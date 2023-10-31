---
contentType: tutorial-step
tutorial: react-env-variable-gcp-gitlabci
slug: introduction
title: Introduction
---
## Qu'allons-nous faire ?

Lors du développement d'une application, il est toujours nécessaire d'avoir des environnements de recette et de production indépendants l'un de l'autre, pour tester de nouvelles features en recette et ensuite être capable de les déployer en production en toute sérénité.

**Problématique :**

Ces applications nécessitent parfois de faire appel à des services externes, comme des API (Rest // Graphql).

Si nous prenons l'exemple d'un appel vers une API Rest ou GraphQL, l'URL appelée par notre application de recette devra être différente de l'URL appelée par l'application de production.

**Solution :**

Afin de gérer cette problématique, il est nécessaire d'utiliser ce que l'on appelle des variables d'environnement pour dissocier la configuration de nos deux applications.

Il est assez facile de gérer ces variables d'environnement dans un projet perso, mais qu'en est-il dans un environnement tel que Google Cloud Platform pour des projets professionnels ?

Dans ce CodeLabs, nous allons donc voir comment créer et déployer, via Gitlab CI, une application React sur différents environnements d'exécution (recette // production) dans l'écosystème Google Cloud Platform (App Engine) et comment gérer ses variables d'environnement.

## Liens utiles

Créer une application [React](https://facebook.github.io/create-react-app/docs/documentation-intro)
Obtenir un compte [Google Cloud Platform](https://console.cloud.google.com)
Créer un compte [Gitlab](https://about.gitlab.com/)
En savoir plus à propos de [Gitlab CI]([https://docs.gitlab.com/ee/ci/](https://docs.gitlab.com/ee/ci/))

## Pré-requis

Nous aurons besoin d'une installation de [Npm & Nodejs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
Le code complet du projet est disponible [ici](https://github.com/RedPi/codelabs-env-var) mais je vous conseille de le récupérer seulement si besoin.