---
contentType: tutorial
lang: fr
date: '2018-03-28'
slug: api-versioning-et-retrocompatibilite-avec-symfony
title: API versioning et rétrocompatibilité avec Symfony
excerpt: >-
  Lorsque vous avez besoin de faire évoluer votre API rapidement, vous êtes
  souvent bloqués par vos clients pour qui vous ne pouvez pas casser la
  compatibilité. Ce tutoriel vous explique comment mettre en place du versioning
  dans Symfony et comment gérer la rétro-compatibilité des sorties d'API.
cover: /imgs/tutorials/2018-03-28-api-versioning-et-retrocompatibilite-avec-symfony/cover.jpg
categories:
  - php
authors:
  - vcomposieux
keywords:
  - symfony
  - api
  - versioning
  - compatibility
steps:
  - introduction
  - configuration-des-fichiers-de-changement-par-version
  - ajout-du-listener-sur-la-reponse-symfony
  - ajout-de-la-factory-pour-instancier-les-changements
  - ajout-de-fichiers-de-changements
  - conclusion
---

