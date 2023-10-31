---
contentType: tutorial-step
tutorial: graphql-avec-symfony
slug: introduction
title: Introduction
---
### GraphQL c'est quoi

GraphQL est un langage de requête initié par Facebook en 2012 et développé en 2015. [Facebook Manifest](http://facebook.github.io/graphql/October2016/). GraphQL permet de se brancher à n'importe quel type de base de données ou d'API. Le but de GraphQL est de décrire les données et les fonctions disponibles entre les applications client-serveur.

GraphQL **ne stocke donc pas** de données. Il va seulement décrire le modèle donnée et savoir comment aller la récupérer sur vos différentes applications backend.

Je vous invite à lire l'article de notre blog expliquant comment [fonctionne GraphQL](https://blog.eleven-labs.com/fr/graphql-kesako/).

### Qu'allons nous faire ?

Dans ce tutoriel nous allons mettre en place un serveur GraphQL sur Symfony 4 en utilisant le bundle [https://github.com/overblog/GraphQLBundle](https://github.com/overblog/GraphQLBundle)

Le but est de comprendre:
- la mise en place d'un serveur GraphQL
- la création des requêtes pour lire la donnée
- la création des requêtes d'écriture des données

### Pré-requis

Nous allons utiliser une base de données MySQL pour le stockage des données.

Le serveur sera en Symfony 4, avec la version 7 de PHP.

Si vous ne souhaitez pas installer node sur votre machine, vous pouvez utiliser [Docker](https://www.docker.com/). Le code fourni pour le tutoriel est disponible [ici](https://github.com/duck-invaders/graphql-symfony), contient un fichier `docker-compose.yml` vous permettant d'installer le projet.