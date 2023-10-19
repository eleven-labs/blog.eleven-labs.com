---
contentType: tutorial-step
tutorial: api-versioning-et-retrocompatibilite-avec-symfony
slug: introduction
title: Introduction
---

Lorsque vous travaillez sur une API (principalement REST) et que vous souhaitez sortir de nouvelles fonctionnalités, une problématique montre souvent le bout de son nez : vous ne pouvez pas mettre en production avant que les applications clientes de votre application soient compatibles avec ces changements.

Afin de pouvoir livrer rapidement de nouvelles fonctionnalités ou encore des modifications au niveau du schéma de données, il vous faut alors mettre en place du versioning sur votre API.

Malheureusement, les manières de traiter réellement le sujet sont assez floues aujourd'hui.

J'ai donc parcouru différentes solutions et j'ai choisi d'adopter [le modèle présenté par Stripe](https://stripe.com/blog/api-versioning), permettant d'appliquer une retrocompatibilité du modèle de données pour les versions précédentes.

## Objectif

Pour la suite de ce tutoriel Codelabs, nous allons imaginer que nous développons une API et que nous souhaitons sortir une nouvelle version `1.2.0` en production, qui inclura des changements au niveau de notre modèle de données par rapport aux versions précédentes.

L'objectif est alors de sortir en production notre nouvelle version et que chaque client qui appelle notre API sans spécifier de version particulière puisse en bénéficier.

En revanche, si un client, lors de sa requête, spécifie une version (comme `1.1.0` par exemple), alors il doit continuer à récupérer le même modèle de données que précédemment.

D'un point de vue technique, notre API devra appliquer une transformation sur le modèle de sortie afin d'assurer la retrocompatibilité sur cette version. C'est vraiment la réponse de notre API qui sera versionnée.
stepT
![Schema API Versioning](https://storage.googleapis.com/tutos/assets/2018-03-28-api-versioning-et-retrocompatibilite-avec-symfony/schema.jpg)

## Gestion du numéro de version

Pour la suite de cet article, j'ai choisi de partir sur un numéro de version spécifié en header de requête, type `X-Accept-Version: 1.1.0`.

À vous de choisir ce qui vous conviendra le mieux, mais je trouve la solution du header plus simple à maintenir et surtout, lorsque vous décidez de ne plus supporter une version, cela n'a pas d'impact sur les endpoints d'appel à votre API, vous renvoyez simplement la dernière version de votre API.

## Pré-requis

Avant de débuter l'implémentation technique il vous faut disposer d'une instance Symfony. Vous pouvez vous rendre sur [http://symfony.com/download](http://symfony.com/download) pour en installer une version.

Cet article n'est pas spécifique à Symfony 4, cependant, si vous souhaitez installer cette dernière version vous pouvez directement utiliser composer :

```
$ composer create-project symfony/skeleton api-versioning
```

## Prochaine étape

Une fois la logique claire, nous pouvons commencer à implémenter la configuration des changements en fonction du numéro de version dans notre application Symfony.
