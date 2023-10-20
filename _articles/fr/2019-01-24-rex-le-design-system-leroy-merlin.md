---
contentType: article
lang: fr
date: '2019-01-24'
slug: rex-le-design-system-leroy-merlin
title: Retour d'expérience sur la mise en place d'un Design System chez Adeo
excerpt: >-
  Depuis septembre 2018, le groupe Adeo travaille à la mise en place d'un design
  system complet, permettant à l'ensemble des sites E-commerce de Leroy Merlin
  du monde entier d'utiliser une identité visuelle commune.
cover: /assets/2019-01-23-rex-le-design-system-leroy-merlin/cover.png
categories:
  - javascript
authors:
  - captainjojo
keywords:
  - graphql
  - react
---

Depuis septembre 2018, le groupe Adeo travaille à la mise en place d'un design system complet, permettant à l'ensemble des sites E-commerce de Leroy Merlin du monde entier d'utiliser une identité visuelle commune.

Tiago, UX depuis presque 10 ans, est l'initiateur du projet. Il travaille depuis 2013 chez Leroy Merlin et a supervisé l'ensemble de la refonte utilisateur du site E-commerce Leroy Merlin Brésil. Gael, est un designer devenu intégrateur qui a mis en place notamment le design system pour Lemonde.fr. Il est en charge de l'implémentation technique du projet. Quant à moi, je travaille depuis maintenant trois mois pour mettre en place sur ce projet la CI/CD. Revenons sur le début de ce projet pas comme les autres.

![team]({{site.baseurl}}/assets/2019-01-23-rex-le-design-system-leroy-merlin/team.png)

## Brief

Le projet a commencé au mois de septembre 2018. Le brief du client était assez clair. Nous devions mettre en place le plus rapidement possible un outil de design system permettant aux équipes du monde entier de partager le design et l'intégration des multiples composants utilisés dans les sites e-commerce de la marque.

Mais pourquoi mettre en place un tel projet ?

L'inner source est devenu aujourd'hui un élément essentiel de toutes nos plateformes web. C'est dans ce cadre que Leroy Merlin a décidé de mettre en place un design system. Aujourd'hui chaque site e-commerce de la marque arbore un design différent, ce qui peut prêter à confusion pour les clients.

Par exemple, le premier point qui nous a paru très problématique c'est que le logo du favicon n'est pas le même entre le site russe, italien, français ou brésilien.

## Réflexion

Avant de nous lancer dans un tel projet il y a eu beaucoup de réflexion. Ici ce n'est pas la technique qui va compter, mais les moyens de communication mis en place afin que l'ensemble des équipes puisse travailler sur le même projet.

Les équipes étant dispersées dans le monde entier nous avons décidé de commencer un POC, en discutant simplement avec les équipes en France, Italie et Brésil, car ils étaient les initiateurs du projet.

Avant tout, nous avons regardé ce que font les autres sociétés en terme de design system. Celui d'IBM, avec [https://www.carbondesignsystem.com](https://www.carbondesignsystem.com/), [https://primer-css.now.sh](https://primer-css.now.sh/), et [https://www.lightningdesignsystem.com](https://www.lightningdesignsystem.com/), nous a paru le plus complet.

Nous avons donc décidé de partir sur un site généré statiquement, grâce à la technologie Gatsby.

## Mise en place

### Gatsby

Gatsby est un site générator en React utilisant une API GraphQL pour stocker la donnée. L'intérêt de Gatsby est de limiter le développement. La plupart des personnes qui participeront à l'élaboration du design system ne sont pas des développeurs, mais des designers, des intégrateurs, ou des DA.

Il faut alors créer un outil pour tous, qui soit simple d'utilisation. Nous avons choisi de créer un système de documentation en Markdown. C'est un langage assez simple à utiliser, et l'on peut trouver beaucoup d'éditeurs en ligne pour faciliter la rédaction.

### CI / CD

Ce design system étant géré comme un projet open source, il nous fallait mettre en place une CI/CD parfaite.

Le projet est sur un Github privé qui communique avec GitLab Ci. La pipeline est assez simple, elle contient quatre étapes.

Lors d'un Push ou de la création d'une Pull Request un webhook est envoyé dans une Lambda AWS permettant de lancer la pipeline de Gitlab Ci.

**Étape 1**

L'étape 1 est le lancement des tests. Cela permet de vérifier la bonne génération du site statique.

**Étape 2**

L'étape deux permet le build de l'application et le déploiement en démo. Chaque branche créée par un utilisateur est alors déployée et visible dans un environnement de démo. Cela permet à tout le monde de voir le site généré avec la nouvelle documentation sans forcément lire le code dans Github.

Un webhook toujours dans AWS Lambda, récupérant le statut de la pipeline renvoie dans Github l'url de déploiement pour garder une trace de cette dernière.

**Étape 3**

Cette étape n'est pas toujours réalisée, mais elle permet lors d'un merge dans la branche master de choisir quel type de release faire (patch, minor, major). Dans ce cas la pipeline automatise le changelog ainsi que le tag de l'application. Elle est alors déployée dans un environnement de production en spécifiant le tag dans l'url de déploiement.

**Étape 4**

Toujours dans le cadre du merge sur master, le code est envoyé dans une registry NPM pour permettre aux développeurs d'utiliser le CSS dans leurs projets.

## La suite

Le projet n'en est qu'à ses débuts, mais déjà aujourd'hui il solutionne plusieurs des problèmes notés dans le brief.

Les équipes des différents pays se sont rencontrés afin d'échanger, et aujourd'hui un système de couleurs et de token a déjà été mis en place, le tout disponible dans le design system.

Le projet va grandir en travaillant avec l'ensemble des équipes. Cela permettra, on l'espère, de créer un système aussi puissant que celui d'IBM.

La CI/CD continue à grandir au fur et à mesure de l'utilisation des équipes. On y rajoute des nouvelles fonctionnalités pour permettre à tout le monde de travailler dans les meilleures conditions.
