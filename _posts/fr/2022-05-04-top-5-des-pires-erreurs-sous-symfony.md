---
layout: post
title: "Mon top 5 des PIRES erreurs sous Symfony"
excerpt: "Le numéro 2 va vous surprendre 😱"
authors:
    - marianne
permalink: /fr/top-5-des-pires-erreurs-sous-symfony/
categories:
    - symfony
    - architecture

cover: /assets/2022-05-04-top-5-des-pires-erreurs-sous-symfony/logo.png
---

Je suis développeuse PHP/Symfony depuis près de 10 ans, et au cours de mes missions j’ai pu tester, expérimenter et découvrir différentes architectures et design patterns en entreprise. J'ai vu du bon, j'ai vu du pasable, et j'ai aussi parfois ouvert les portes de l'enfer. De ces expériences, j'ai décidé d'en recenser le pire, et je vous propose dans cet article le top 5 des erreurs qu’il faut à tout prix éviter sous Symfony !

## #5 Faire une library alors qu’il s’agit d’un bundle

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-05-04-top-5-des-pires-erreurs-sous-symfony/libraryvsbundle.png" width="300px" alt="Library vs Bundle" style="display: block; margin: auto;"/>
</div>
Quelle est la différence entre une library et un bundle ? Il arrive que certains développeurs se trompent sur cette question.

Depuis la version 4 de Symfony, il n’est plus recommandé d’organiser son code en bundle (comme indiqué dans la [documentation](https://symfony.com/doc/current/bundles.html)). Malheureusement, certains développeurs se sont arrêtés à ça : on ne crée plus de bundle, alors on doit faire des libraries.

Il faut savoir que dans l’écosystème Symfony, il y a les composants et les bundles mais il n’y a pas de library.
Mais vous pouvez créer une library PHP : il s’agit d’un ensemble de code destiné à être réutilisé qui fournit des outils pour réduire le temps de développement.
Le bundle va intégrer des composants Symfony et pourra donc utiliser toutes les possibilités qu’offrent le framework comme [gérer la configuration](https://symfony.com/doc/current/bundles/configuration.html) ou utiliser directement les services sans avoir besoin de les déclarer.

Alors faire une library qui embarque des composants Symfony, c’est une hérésie.

## #4 Les libraries partagées
On pourrait croire que c’est une bonne idée quand, dans plusieurs projets, nous avons les mêmes classes. On se dit que la duplication de code c’est mal, on a la même unicité sur tous les projets et qu’on n’a qu’à tester qu’une seule fois le code.

Sur le papier, ça passe. Dans les faits, si on n’est pas rigoureux, cela peut vite ressembler à l’enfer.

Prenons un exemple concret : vous avez plusieurs services qui utilisent la même library, celle-ci n’a pas de release.
Un développeur travaille sur le Service A qui utilise la library Tools pour la feature 01. Il a eu besoin de modifier cette library, et ce code a été mergée sur la branche principale.
Mais ce développeur ne savait pas que sa modification avait créé un break change inintentionnel sur le Service B, mais comme la library n’avait pas été mise à jour sur celui-ci, ça a été invisible.
Un autre développeur travaille en parallèle sur, justement, ce Service B et a aussi besoin de modifier cette library. Quand il va faire sa branche sur la library, cela sera à partir de la branche principale, avec la modification pour la feature 01. Quand la library sera mise à jour pour tester la branche spécifique, il y aura une erreur, mais le développeur ne sera pas pourquoi.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-05-04-top-5-des-pires-erreurs-sous-symfony/librairies-partagees.png" width="600px" alt="Example problème librairies partagées" style="display: block; margin: auto;"/>
</div>

Cela fait perdre du temps pour débugger, demander à son équipe, voir avec le développeur responsable de break change.

Si vous avez une bonne communication entre les équipes et un même processus rigoureux ou un versionning fait dans les règles de l’art, vous pouvez limiter les impacts.

## #3 Ne pas faire les mises à jour Symfony
Qui n’a pas déjà eu à travailler sur du code legacy en Symfony dans une vieille version, et plus le temps passe, plus la mise à jour sera difficile et coûteuse.

Le framework n’est pas mis à jour régulièrement que pour des nouvelles fonctionnalités, mais aussi pour corriger des bugs qui peuvent être de sécurité. Cela veut dire que vous pouvez laisser des failles sur votre application.
Aussi, les versions de Symfony sont liées à des versions de PHP. Par exemple, vous ne pourrez pas monter votre version de PHP sur le serveur parce que vous avez une vieille application qui tourne sur du Symfony 3/PHP 7.

Faire régulièrement les montées de versions de Symfony en enlevant progressivement les deprecated évitera les surprises lors d’une montée majeure de version.

Paradoxalement, faire trop rapidement une mise à jour Symfony est aussi une erreur.
Rares sont les projets qui n’utilisent pas de bundles externes, et quand il s’agit d’une montée de version majeure, il faut attendre que ceux-ci proposent leur propre mise à jour.

Même si de nos jours les releases Symfony sont globalement stables, attendre un petit peu pour être sûr qu’il n’y ait pas de bugs peut être salutaire.

## #2 Utiliser TROP les Event Listeners

Je suis la première à aimer utiliser les listeners : ça me permet de mettre en place une action commune pour un événement particulier assez facilement.

Mais ça peut vite devenir une usine à gaz et difficilement maintenable pour une nouvelle personne arrivant sur le projet. Les risques sont d’avoir des listeners se marchant sur les pieds ou d’impacter les performances.

Heureusement avec la commande `bin/console debug:event-dispatcher` ou dans le profiler, il est facile d’avoir la liste des classes et de debugger.

## #1 Utiliser API Platform aveuglément

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-05-04-top-5-des-pires-erreurs-sous-symfony/no-api-platform.png" width="200px" alt="No API Platform" style="display: block; margin: auto;"/>
</div>

API Platform permet de créer rapidement des API et cela permet de gagner un temps incroyable en début de projet. Malheureusement, le coût de développement et de maintien vient plus tard et peut être faramineux.

Si votre besoin est très spécifique et demande plus que des CRUD basiques, cela peut vite devenir très lourd : besoin de faires des hacks dans tous les sens, d’override des classes, et si vous avez besoin d’une serialization un peu gourmande, vos tirs blackfire vous feront perdre de la tête. Pour l’avoir vu et expérimenté, il faut ensuite déployer une énergie folle et faire appel à son ingéniosité pour passer outres toutes ses problématiques.

API Platform propose régulièrement des mises à jour pour améliorer sa performance, pourtant je reste convaincue de ne pas l’utiliser si le projet est un peu plus complexe.

Faire son API avec [FOSRestBundle](https://github.com/FriendsOfSymfony/FOSRestBundle) vous permettra d’être indépendant sur les actions que doivent faire vos routes, sans code magique, ce qui vous permettra de maîtriser la résilience et la performance de votre application.

## Conclusion
Ce top est propre à mon expérience, et avec de la chance, je n’ai sûrement pas tout vu.

Et vous, quelles erreurs avez-vous déjà vues ?
