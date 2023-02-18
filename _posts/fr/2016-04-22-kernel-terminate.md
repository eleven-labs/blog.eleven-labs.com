---
layout: post
lang: fr
date: '2016-04-22'
categories:
  - php
authors:
  - aandre
excerpt: "Symfony 2 c'est plusieurs\_composants -dont le domaine d'application est\_spécifique-\_qui forment\_les parpaings d'une maison ; pour assembler\_tout ça, un autre composant existe, à la fois le\_parpaing et le ciment : l'EventDispatcher. Son rôle est de distribuer des événements qui seront traités par les divers composants."
title: Kernel Terminate
slug: kernel-terminate
oldCategoriesAndTags:
  - php
  - symfony
permalink: /fr/kernel-terminate/
---
Symfony 2 c'est plusieurs composants -dont le domaine d'application est spécifique- qui forment les parpaings d'une maison ; pour assembler tout ça, un autre composant existe, à la fois le parpaing et le ciment : l'EventDispatcher. Son rôle est de distribuer des événements qui seront traités par les divers composants.

Il ne s'agit pas dans cet article de revenir sur le fonctionnement de l'EventDispatcher, mais d'expliquer le rôle d'un événement mal connu, l'event "kernel.terminate".

Sachez tout d'abord qu'aucun code n'est exposé ici, je vous laisse cette démarche. D'autre part, si l'exemple est pris avec Symfony (qui simplifie le problème), ce n'est pas Symfony qui permet ce que nous allons étudier ici, mais l'implémentation du serveur PHP.

# Les events kernel.*

Avant de rentrer dans le vif du sujet, profitons-en pour rappeler les différents types d'événements kernel.* qui sont dispatchés. Bien entendu, une liste exhaustive et bien plus complète existe en anglais dans la [documentation officielle](http://symfony.com/doc/current/reference/events.html) (et [une version très détaillée](http://symfony.com/doc/current/components/http_kernel/introduction.html)){:rel="nofollow noreferrer"}. Dans leur ordre d'apparition dans le cycle d'une requête HTTP jusqu'à sa réponse.

*   **kernel.request** : il est dispatché une fois que l'objet Request a été créé. Il est utilisé par Symfony pour renvoyer des réponses qui ne nécessitent pas de parcourir tout le cycle. Un erreur 401 dans le cadre du security component, ou 404 pour le routeur. Il est possible d'écouter cet event pour enrichir l'objet Request par exemple ;
*   **kernel.controller** : lorsque cet événement est dispatché, le contrôleur et l'action sont déterminés, mais n'ont pas encore été instanciés ni appelés. Il est utilisé par l'annotation [@ParamConverter](http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html){:rel="nofollow noreferrer"} du SensioFrameworkExtraBundle. On pourrait par ailleurs appeler une action totalement différente pour des besoins spécifiques ;
*   **kernel.view** : cet événement n'est dispatché que si le retour d'une action d'un contrôleur n'est pas un objet Response dans le contexte du HttpKernel, laissant le soin à un listener de formater le tout en json ou en xml par exemple. C'est ce que propose par exemple l'excellent [FOSRestBundle](http://symfony.com/doc/current/bundles/FOSRestBundle/index.html){:rel="nofollow noreferrer"} ;
*   **kernel.response** : cet event est dispatché juste avant l'envoi de la réponse HTTP au client. Le but étant si nécessaire d'enrichir l'objet Response avec des entêtes supplémentaires par exemple ;
*   **kernel.terminate** : c'est l'objet de cet article, nous allons voir tout de suite à quoi il sert.

# app.php

Si vous ouvrez votre arborescence Symfony 2, et plus particulièrement le fichier web/app.php -à savoir le point d'entrée de votre application- vous verrez très peu de lignes :

*   un _use_ ;
*   quelques prérequis de l'autoloader Composer ;
*   une probable méthode de cache ;
*   la déclaration du kernel ;
*   un : _$response->send();_
*   et enfin un : _$kernel->terminate($request, $response)_

Deux étapes exposées précédemment devraient vous interroger. Je vous laisse réfléchir desquelles il s'agit 2 minutes, pendant que je mets un petit gif de chat.

[![catbeer](/_assets/posts/2016-04-22-kernel-terminate/catbeer.gif)

Alors, trouvé ? Une fois la réponse envoyée (_$response->send();_) l'exécution du processus de votre serveur HTTP devrait se terminer étant donné que la réponse à été envoyée et probablement reçue par le client. Pourtant, on a de nouveau une instruction ensuite.

La vérité est un peu plus complexe en fait. Il existe plusieurs implémentations du serveur PHP. Comme je suis un peu oldschool, j'utilise toujours Apache, qui pour moi a toujours fait l'affaire dans mes projets personnels. D'autant plus que mon travail chez les clients n'est pas de m'occuper de l'administration système des serveurs. Dans le cadre d'Apache il a existé et existe encore la librairie mod_php. Le problème de celle-ci est de terminer l'exécution du processus une fois que la réponse HTTP a été renvoyée. Mais il existe une autre implémentation : PHP-FPM. Je ne prétends pas faire un article orienté admin', étant donné que ce n'est pas mon domaine. Mais pour simplifier, la plupart des handler PHP pour HTTP actuels, peuvent renvoyer une réponse HTTP puis continuer le traitement du script PHP impliqué (sauf mod_php sur Apache). Et ça, ça peut être très utile, d'où l'event kernel.terminate.

# kernel.terminate

Cet événement est dispatché lorsque la réponse HTTP à été transmise au client. L'intérêt étant de pouvoir effectuer des traitements coûteux en temps. Si ces traitements étaient fait en amont de l'envoi de la réponse, l'utilisateur le ressentirait sur le délai de réponse de la page. Et à mon sens, cet événement est bien souvent sous-estimé.

## Exemple concret

Vous ne voyez toujours pas l'intérêt ? Un petit exemple pour vous l'expliquer pourrait vous aider à comprendre.

Prenons le cas suivant. Vous gérez un service d'upload de photos qui ajoute des filtres (comme sur Snapchat ou Instagram). Pour ces photos vous fournissez des liens à intégrer sur les différents supports numériques (sites, forums, réseaux sociaux, etc.). Vous gérez toute cette manipulation d'image en PHP via une surcouche Symfony ; ce n'est peut-être pas la meilleure solution, mais nous prendrons cet exemple. Naturellement, vous seriez obligés de passer par l'une des extensions PHP que sont GD ou ImageMagick pour manipuler les images.

### L'idée bof-bof

Une première idée pourrait être de faire ce traitement dans votre contrôleur. Puis une fois celui-ci fait, retourner la réponse HTTP avec l'image et les liens. Admettons que ce traitement d'image nécessite 20 secondes. Cela implique à vos utilisateurs de s'impatienter pendant 20 longues secondes avec une page blanche. Vous même développeurs ne supportez pas d'attendre tout ce temps.

### L'idée plus optimisée

Alors pourquoi ne pas duper l'utilisateur ? 20 secondes pour une tâche informatique c'est assez long, ça l'est également pour l'utilisateur devant une page blanche. Pourquoi ne pas aborder le problème dans l'autre sens, donner gratification à l'utilisateur en lui affichant une page rapidement, tout en pariant sur sa non-réactivité. À la place de lui afficher directement l'image et tous les liens, pourquoi ne pas afficher que les liens et parier sur la non-réactivité de l'utilisateur. Un utilisateur c'est lent, très lent. Pourquoi ne pas lui donner le Kinder Surprise, sans le jouet dans la boîte jaune parce que vous n'aviez pas fini de le fabriquer. Et pendant qu'il mange tranquillement son Kinder, pourquoi ne pas profiter de son inattention pour insérer le jouet dans la boîte jaune une fois fabriqué ? Le principe est le même ici.

Ce pari, il a été pris par de nombreuses entreprises, qui anticipent vos déplacements sur leurs sites pour vous faire croire que celui-ci est fluide et réactif, et pour cacher certaines lenteurs dû à des processus parfois complexes. Et ça marche plutôt bien, alors pourquoi ne pas en profiter dans vos projets ? Pour plus d'informations, je vous renvoie une fois de plus à la documentation officielle pour cet [événement](http://symfony.com/doc/current/components/http_kernel/introduction.html#the-kernel-terminate-event){:rel="nofollow noreferrer"}.

## Est-ce vraiment utile ?

Dans des grosses structures, telles que LinkedIn par exemple, on préférera utiliser des solutions asynchrones qui passent par des queues manager (exemple : RabbitMQ, Kafka, etc.) qui sont beaucoup plus scalables sur de larges architectures. Mais dans des projets de petite à moyenne envergure, dans les PME notamment, il n'est pas toujours simple de mettre en place ces solutions qui répondent à des problématiques de grande envergure. Ce serait comme pêcher du poisson avec un lance-roquettes.

Or ici, dans de plus petits projets, le fait de jouer avec cette notion de kernel.terminate prend tout son sens. De plus, il est très simple à mettre en place avec Symfony, il suffit de créer un [listener](http://symfony.com/doc/current/cookbook/event_dispatcher/event_listener.html#creating-an-event-listener) ou un [subscriber](http://symfony.com/doc/current/cookbook/event_dispatcher/event_listener.html#creating-an-event-subscriber){:rel="nofollow noreferrer"} dessus.

## Ce n'est pas la réponse à tous les problèmes

Il y a des cas où l'événement ne peut pas être utilisé, il cible des problèmes particuliers. En effet parfois, vous aurez besoin d'attendre que votre traitement coûteux soit terminé pour fournir une réponse HTTP, car celle-ci dépend de votre traitement. Dans ce cas vous ne pourrez pas utiliser cet événement. Ce sera à vous donc d'optimiser au mieux votre algorithme, pour qu'il prenne le moins de temps possible dans votre contrôleur ; et ainsi retourner une réponse dans les meilleurs délais.

Notez aussi que si vous tournez sur Apache + mod_php, toute la logique liée à l'événement sera quand même exécutée, mais avant d'envoyer la réponse.

# Conclusion

PHP n'est pas le langage le plus rapide du monde, mais il s'en sort quand même plutôt bien avec ce genre de petites optimisations, pour peu qu'on sache l'appréhender. Avec Symfony, cela rajoute un peu de complexité pour configurer l'optimisation aux petits oignons, mais c'est du devoir du développeur d'anticiper ces problèmes. J'ai pris l'exemple ici avec Symfony qui mâche le travail avec l'event kernel.terminate, mais sachez que c'est possible en PHP natif comme je le disais grâce à la fonction [fastcgi_finish_request](http://php.net/manual/en/function.fastcgi-finish-request.php){:rel="nofollow noreferrer"}.

N'hésitez pas à faire un retour dans les commentaires, si vous constatez des inexactitudes, des améliorations à apporter, ou simplement si vous avez des questions sur des points un peu obscurs ;)
