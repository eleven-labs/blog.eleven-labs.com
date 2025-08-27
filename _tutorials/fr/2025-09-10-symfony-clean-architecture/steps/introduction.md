---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: introduction
title: Introduction
---

## Pourquoi ce tutoriel ?

Alors que la Clean Architecture a plus le vent en poupe que jamais ces dernières années, j'ai moi-même passé beaucoup de temps à chercher des ressources en PHP, voire en Symfony (mon Framework de coeur), pour découvrir plus facilement cette philosophie.

<div class="admonition warning" markdown="1"><p class="admonition-warning">Disclaimer</p>
Oui, la Clean regroupe des concepts qui permettent justement de s'affranchir du Framework et du langage, afin d'en être le pus agnostique possible.
Mais je suis persuadé qu'à l'apprentissage, rien de mieux que des exemples avec lesquels nous sommes familiers, pour correctement assimiler ces principes.
</div>

Et voilà la raison pour laquelle j'écris ce tutoriel aujourd'hui, un tutoriel que j'aurais aimé trouver quand j'ai commencé à apprendre les fondements de la Clean, un tutoriel qui:
- me donne des exemples sur un langage et un framework que je connais
- m'accompagne avec un mini-projet à transfomer étape par étape vers une approche "clean"
- utilise l'état de l'art de mon langage (ici, PHP 8.4)
- propose une approche décomplexée de la Clean, qui comprend que la réalité et la complexité d'un projet demande parfois de faire des concessions ou d'adapter la Règle à son besoin.

Si nous sommes alignés sur ces points, et que c'est aussi ce que vous recherchez, alors vous êtes au bon endroit !

## Ce que n'est pas la Clean Architecture

Avant de rentrer dans le vif du sujet, j'aimerais préciser le périmètre de mon approche de la Clean Architecture, en éliminant ce qui pour moi ne rentre pas dans la philosophie de la Clean.

À mon sens, la Clean Archi, ce n'est pas:
- Des dogmes à respecter absolument sans se poser de questions
- Un cadre imposant un nommage particulier pour nos classes, fichiers, et dossiers
- Une formule magique dénuée de défauts
- Du clean code (je peux faire de la clean en codant comme un cochon)
- Des bonnes pratiques universelles

Il peut exister autant d'applications de la Clean Architecture qu'il existe d'équipes de développeurs.
**Mais** le point commun entre ces équipes sera le suivant: un système de couches qui protègent le métier et ses objets en son centre, découplés des implémentations techniques qui gravitent autour.

Rassurez-vous, je vais malgré tout essayer de donner une vision la plus universelle possible de la Clean, afin que vous ne soyiez pas perdus en étant un jour onboardé sur un projet Clean.
Mais si certains de mes choix ne vous plaisent pas, n'oubliez pas que vous êtes libres d'adapter mes propositions à votre vision.

<div class="admonition tip" markdown="1"><p class="admonition-tip">Tip</p>
Souvent, on reste très attachés à la règle et aux dogmes quand on débute sur un sujet.
Mais c'est en prenant de l'expérience et de la confiance que l'on peut intelligement tordre cette règle (sans jamais la transgresser) pour l'adapter à nos préférences !
</div>

## Prérequis

Pour suivre ce tutoriel, il est préférable a minima d'avoir déjà entendu parler de la Clean Architecture, et de s'y être un peu intéressé.
Au cours des différentes étapes, j'essaierai malgré tout d'expliquer tous mes choix, et les concepts associés.

Sinon, ce tutoriel s'adresse en particulier aux développeurs PHP qui ont déjà travaillé avec Symfony, mais le code présenté restera très simple à comprendre.

On est tout bon ? Alors c'est parti !
