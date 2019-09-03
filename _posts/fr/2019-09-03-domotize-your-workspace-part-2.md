---
layout: post
title: Domotiser son espace de travail - Partie 2
excerpt: L'objectif de cet article est de domotiser simplement et efficacement son espace de travail avec home-assistant (partie 2).
authors:
    - pouzor
lang: fr
permalink: /fr/domotize-your-workspace-part-2/
categories:
    - domotique
    - gitlab
tags:
    - homeassistant
    - gitlab-ci
    - domotique
    - ifttt
    - hue
    - google home
---

Nous avons vu dans le précedent [article]({{site.baseurl}}/fr/domotize-your-workspace/) comment configurer HA, avec le plugin Gitlab afin de creer notre premier dashboard. Cependant, nous n'avons pas vu encore gros chose en relation avec la domotique... Il est temps de s'y mettre.


## Le plan

Ce qui est compliqué avec la domotique, ce n'est pas la réalisation, ni même la techno, mais bien souvent de savoir ce que l'on va faire, c'est à dire "Comment je peux améliorer mon quotidien, de maniere automatique, avec des intérations IRL".

Dans ce tuto, nous allons voir comment utiliser des Philips Hue, ainsi qu'une Google Home pour "animer" notre open space.


Mais si jamais vous avez du temps et du budget, voici quelques autres idées : 
- Mesurer le niveau sonore de l'open space et avertir en cas de dB trop important
- Faire couler automatiquement le café à l'heure du stand up
- N'eteindre les machines de dev que lorsque tout les développeurs sont partis le soir
- Utiliser un nerf sur tourelle pour tirer automatiquement sur la personne qui fait planter la CI
- ...


Du coup dans ce tuto, deux use-cases : 
- Allumer une lampe de bureau, pendant 5 secondes, en fonction du statut de la CI (rouge ou vert).
- Avoir un message vocale, via la google home, en fonction du statut de la CI (rouge ou vert).
- Petit bonus blame sur ce même use-case.


## Configuration du scénario Hue


Première étape, nous allons ajouter l'intégration Philips Hue sur notre HomeAssistant. Celle ci existe par default, et lorsque vous êtes sur le même reseau wifi, nous pouvons même le configurer automatiquement avec "l'assistant intégration" d'HA.

Rendez-vous dans la partie Configuration / Intégrations / + , puis cherchez Philips Hue. Suivez la procédure affichée (pression le bouton sur le hub ect...). 
(img 1)
Une fois l'installation terminée, si tout ce passe correctement, vous devriez voir l'ensemble de vos ampoules hue s'afficher. Vous pouvez les attribuer à une pièce, mais cette partie n'est pas necessaire pour ce tuto.
(img 2)


Pour ma part, je vais utiliser l'ampoule "Bureau" pour ce tuto. Pour voir votre ampoule et commencer à interagir avec elle, vous pouvez retourner sur le dashboard, puis en haut à droite, choisir "Entités inutilisées". Vous devriez voir ceci :

(img3)

Et si vous cliquez dessus (je vous laisse tester l'interface hue plutot fonctionnelle) :

(img4)
