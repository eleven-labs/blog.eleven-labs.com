---
layout: post
title: "Mon top 5 des PIRES erreurs sous Symfony"
excerpt: "La numéro 2 va vous surprendre 😱"
authors:
    - marianne
permalink: /fr/top-5-des-pires-erreurs-sous-symfony/
categories:
    - symfony
    - architecture

cover: /assets/2022-08-12-top-5-des-pires-erreurs-sous-symfony/logo.png
---

Je suis développeuse PHP/Symfony depuis près de 10 ans, et au cours de mes missions j’ai pu tester, expérimenter, et découvrir différentes architectures et design patterns en entreprise. J'ai vu du bon, j'ai vu du passable, et j'ai aussi parfois ouvert les portes de l'enfer. De ces expériences, j'ai décidé de recenser le pire, et je vous propose dans cet article le top 5 des erreurs qu’il faut à tout prix éviter sous Symfony !

## #5 Faire une librairie, alors qu’il s’agit d’un bundle

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-12-top-5-des-pires-erreurs-sous-symfony/libraryvsbundle.png" width="300px" alt="Library vs Bundle" style="display: block; margin: auto;"/>
</div>

Combien de fois ai-je vu des soi-disant librairies qui, n'en étant pas (vous allez comprendre ce que j'entends par là très vite), posaient des soucis de maintenabilité sur les projets Symfony ? La réponse est : beaucoup trop.

Tout d'abord revenons sur le vocabulaire : une librairie est un ensemble de code destiné à être réutilisé, qui fournit des outils pour réduire le temps de développement. Il peut être normal, vu cette définition, de vouloir en faire avec des composants Symfony.

Le seul hic c'est que dans l’écosystème Symfony... il n'y a pas de librairies, il n'y a que des composants ou des bundles. Je répète donc : les librairies dites Symfony sont inexistantes ! Notons toutefois qu'il peut bien y avoir des librairies PHP.

Si on fait une librairire qui utilise des composants Symfony (qui aura sûrement besoin d'une configuration), alors lors d'une mise à jour de la librairie sur le projet on s'expose à la fois à des bugs difficilement identifiables mais aussi au fait de rendre la configuration illisible.
Alors que faire un bundle permet d'utiliser toutes les possibilités qu’offre le framework comme [gérer la configuration](https://symfony.com/doc/current/bundles/configuration.html) ou utiliser directement les services sans avoir besoin de les déclarer.

Moralité : que ce soit à cause de la sémantique ou de la pratique, faites des bundles si vous avez des composants Symfony !


## #4 Les librairies partagées
On pourrait croire que c’est une bonne idée quand dans plusieurs projets nous avons les mêmes classes. On se dit que la duplication de code c’est mal, qu'on a la même unicité sur tous les projets et qu’on n’a qu’à tester qu’une seule fois le code.

Sur le papier, ça passe. Dans les faits, si on n’est pas rigoureux, cela peut vite ressembler à l’enfer.

Prenons un exemple concret : vous avez plusieurs services qui utilisent la même librairie, et celle-ci n’a pas de release.
Un développeur travaille sur le service A qui utilise la library Tools pour la feature 01. Il a eu besoin de modifier cette librairie, et ce code a été mergé sur la branche principale.
Mais ce développeur n'a pas détecté que sa modification a créé un break change inintentionnel sur le Service B, et comme la librairie n’a pas été mise à jour sur celui-ci, c'est resté invisible.
Un autre développeur travaille en parallèle sur, justement, ce Service B et a aussi besoin de modifier cette librairie. Quand il va faire sa branche sur la librairie, cela sera à partir de la branche principale, avec la modification pour la feature 01. Quand la librairie sera mise à jour pour tester la branche spécifique, il y aura une erreur, dont la raison demeurera complètement opaque pour le deuxième développeur...

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-12-top-5-des-pires-erreurs-sous-symfony/librairies-partagees.png" width="600px" alt="Example problème librairies partagées" style="display: block; margin: auto;"/>
</div>

Cela fait perdre du temps pour débugger, car ça implique de solliciter toute son équipe, pour identifier le développeur responsable du break change et corriger ce qui doit l'être.

S'il y a une bonne communication dans votre équipe et avec les autres équipes, un même processus rigoureux, ou un versionning fait dans les règles de l’art, vous pourrez limiter les impacts de ce genre d'erreur.

## #3 Ne pas faire les mises à jour Symfony
Qui n’a pas déjà eu à travailler sur du code legacy en Symfony dans une vieille version, dont la mise à jour est devenue plus difficile et coûteuse au fur et à mesure du temps qui passe ?

Le framework n’est pas mis à jour régulièrement que pour des nouvelles fonctionnalités, il l'est aussi pour corriger des bugs qui peuvent être relatifs à la sécurité. Cela veut dire qu'en ignorant une ou plusieurs mises à jour, vous pouvez laisser des failles sur votre application.
Aussi, les versions de Symfony sont liées à des versions de PHP. Vous ne pourrez par exemple pas monter votre version de PHP sur le serveur si vous avez une vieille application qui tourne sur du Symfony 3/PHP 7.

Faire régulièrement les montées de versions de Symfony en enlevant progressivement les deprecated évitera les surprises lors d’une montée majeure de version.

Attention toutefois, car paradoxalement faire trop rapidement une mise à jour Symfony est aussi une erreur.
Rares sont les projets qui n’utilisent pas de bundles externes, et quand il s’agit d’une montée de version majeure, il faut attendre que ceux-ci proposent leur propre mise à jour.

Même si de nos jours les releases Symfony sont globalement stables, attendre un petit peu pour être sûr qu’il n’y ait pas de bugs peut être salutaire.

## #2 TROP utiliser les Event Listeners

Je suis la première à aimer utiliser les listeners : ça me permet de mettre en place une action commune pour un événement particulier assez facilement.

Mais ça peut vite devenir une usine à gaz difficilement maintenable pour toute nouvelle personne arrivant sur le projet.
Les listeners sont souvent invisibles dans le code, dispersés entre le code source et les bundles, pouvant être déclenchés très facilement si l'événement est récurrent. Les risques sont d’avoir des listeners se marchant sur les pieds (par exemple un listener pouvant impacter le comportement d'un deuxième) ou de plomber les performances par des appels trop fréquents. Blackfire peut être votre ami dans ce cas-là avec le metric `symfony.events`.

Grâce à la commande `bin/console debug:event-dispatcher` ou dans le profiler, il est facile d’avoir la liste des classes, de vérifier qu'un listener existant ne peut pas être enrichi avant d'en créer un autre et surtout de debugger.

## #1 Utiliser API Platform aveuglément

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-12-top-5-des-pires-erreurs-sous-symfony/no-api-platform.png" width="200px" alt="No API Platform" style="display: block; margin: auto;"/>
</div>

API Platform permet de créer rapidement des APIs et cela permet de gagner un temps incroyable en début de projet. Malheureusement, le coût de développement et de maintien vient plus tard et peut être faramineux.

Si votre besoin est très spécifique et demande plus que des CRUD basiques, cela peut vite devenir très lourd : besoin de faire des hacks dans tous les sens, d’override des classes, et si vous avez besoin d’une serialization un peu gourmande, vos tirs blackfire vous feront perdre de la tête. Pour l’avoir vu et expérimenté, il faut ensuite déployer une énergie folle et faire appel à son ingéniosité pour passer outres toutes ces problématiques.

API Platform propose régulièrement des mises à jour pour améliorer sa performance, pourtant je reste convaincue de ne pas l’utiliser si le projet est un peu plus complexe.

En fonction de votre besoin, il faut réfléchir entre utiliser cet outil ou faire soi-même son API. [FOSRestBundle](https://github.com/FriendsOfSymfony/FOSRestBundle) vous permettra d’être indépendant sur les actions que doivent faire vos routes, sans code magique, ce qui vous permettra de maîtriser la résilience et la performance de votre application.

## Conclusion
Ce top est propre à mon expérience, et avec de la chance, je n’ai sûrement pas tout vu.

Et vous, quelles erreurs avez-vous déjà vues ?
