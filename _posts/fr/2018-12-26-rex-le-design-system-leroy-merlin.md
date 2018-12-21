---
layout: post
title: "Retour d'expérience sur la mise d'un Design System chez Adeo"
excerpt: "Depuis septembre le groupe Adeo travail pour mettre en place un design System complet permettant à l'ensemble des site E-commerce de Leroy Merlin du monde entier d'utiliser une identité visuel commune. Je travaille avec Leroy Merlin depuis maintenant trois mois pour mettre en place sur ce projet la CI/CD. Revenons sur le début de se projet pas comme les autres."
authors:
    - captainjojo
lang: fr
permalink: /fr/rex-le-design-system-leroy-merlin/
categories:
    - graphql
    - react
cover: /assets/2018-12-26-rex-le-design-system-leroy-merlin/cover.png
---

Depuis septembre le groupe Adeo travail pour mettre en place un design System complet permettant à l'ensemble des site E-commerce de Leroy Merlin du monde entier d'utiliser une identité visuel commune.

Je travaille avec Leroy Merlin depuis maintenant trois mois pour mettre en place sur ce projet la CI/CD. Revenons sur le début de se projet pas comme les autres.

## Brief

Le projet a commencé au mois de septembre le brief du client été assez clair. Nous devions mettre en place le plus rapidement possible un outils de design system permettant aux équipes du monde entier de partager les design et intégration des multiples composants utilisé dans les sites e-commerce de la marque.

Mais pourquoi mettre en place un tel projet ?

L'inner source est devenu aujourd'hui un élément essentiel de toute nos plateforme web. C'est dans ce cadre que Leroy Merlin décida de mettre en place un design system.  aujourd'hui chaque site e-commerce de la marque un design différent selon pays ce qui peut porter à confusion pour les clients.

Le premier point qui nous a paru très problématique c'est que le logo du favicon n'est pas le même entre le site russe, italien, français ou brésilien.

## Reflexion

Avant de nous lancer dans un tel projet il y a eu beaucoup de réflexion. Ici c'est pas la technique qui va compter mais les moyens de communication mise en place pour que l'ensemble du monde travaille sur le même projet.

Les équipes étant dispersés dans le monde entier nous avons décidé de commencer un POC sans en discutant simplement avec les équipes en France, car ils étaient les initiateurs du projet.

Avant tout nous avons regardé ce que font les autres sociétés en terme de design system celui d'IBM avec https://www.carbondesignsystem.com/, nous à paru le plus complet.

Nous avons donc décidé de partir sur un site générer statiquement nous avons choisi Gatsby

## Mise en place

### Gatsby

Gatsby est un site générator en React utilisant une API GraphQL pour stocké la donnée. L'interet de Gatsby est de limiter le développement. La plupart des personnes participeront à l'élaboration du design system ne sont pas des développeurs mais des designers, des intégrateurs, ou des DA.

Il faut donc créer un outils pour tous et simple d'utilisation. Nous avons donc choisi de créer un système de documentation en  Markdown qui est assez simple à utilisé et l'on peut trouver beaucoup d'éditeur en ligne.

### CI / CD

Ce design system étant géré comme un projet open source, il nous falait mettre ne place une CI/CD parfaite.

Le projet est sur un Github privé qui communique avec GitLabCi. La pipeline est assez simple, elle contient quatre étapes.

Lors d'un Push ou de la création d'une Pull Request un webhook est envoyé dans une Lambda AWS permettant de lancer la pipeline de GitlabCi.

#### Etape 1

L'étape 1 est le lancement des tests. Cela permet de vérifier la bonne génaration du site statique.

#### Etape 2

L'étape deux permet de build l'appication et la déploiement en démo. Chaque branche créé par un utilisateur est alors déployé et visible dans un environnement de démo. Cela permet à tout le monde voir le site générer avec la nouvelles documentation sans forcément lire le code dans Github.

Un webhook toujours dans AWS Lambda, récupéreant le status de la pipeline renvoit dans Github l'url de déployement pour garder une trace de cette dernière.

### Etape 3

Cette étape n'est pas toujours réalisé mais elle permet lors d'un merge dans la branche master de choisir quel type de release faire (patch, minor, major). Dans ce cas la pipeline automtise le changelog ainsi que le tag de l'applicaiton. Elle est alors déployé dans un envrionnement de production en spécifiant le tag dans l'url de d"ployement.

### Etape 4

Toujours dans le cadre du merge sur master, le code est envoyé dans une registry NPM pour permettre aux développeur d'utiliser le CSS dans leurs projets.

## La suite

Le projet n'en est qu'à ses débuts mais déjà aujourd'hui il répond à plusieurs des problèmes noter dans le brief.

Les équipes des différents pays se sont rencontrés et ont parlés et aujourd'hui un système de couleurs et de token a déjà été mis en place et tout cela est disponible dans le design system.

Le projet va grandir en travaillant avec l'ensemble des équipes cela permettra, on l'espère, de créer un système aussi puissant que celui du IBM.

LA CI/CD continue à grandir au fur et à mesure de l'utilisation des équipes. On y rajoute  des nouvelles fonctionnalités pour permettre à tout le monde de travailler dans les meilleures conditions.






