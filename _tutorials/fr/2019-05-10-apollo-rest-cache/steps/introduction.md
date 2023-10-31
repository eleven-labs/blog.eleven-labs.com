---
contentType: tutorial-step
tutorial: apollo-rest-cache
slug: introduction
title: Introduction
---
## Qu'allons-nous faire ?

[Dans un tutoriel précédent](https://codelabs.eleven-labs.com/course/fr/graphql-avec-apollo/) l'astronaute Jonathan vous a présenté comment mettre en place un serveur GraphQL avec une base de données. Ici, nous allons voir comment utiliser Apollo en passant par des APIs REST et surtout les points d'attention pour préserver les performances de votre application.

Nous allons mettre en place un serveur GraphQL et une application front via le framework [Apollo](https://www.apollographql.com).

## Pré-requis

Nous allons utiliser [https://api.nasa.gov](https://api.nasa.gov), une API ouverte à tout le monde, mise à disposition par la NASA.
Vous pouvez utiliser la clé d'authentification de démo (qui est limitée à 30 appels par heure), mais si vous souhaitez vous pouvez aller sur [cette page](https://api.nasa.gov/index.html#apply-for-an-api-key) pour demander une clé d'authentification personnelle.

![authentication_key]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/authentication_key.png)

Le serveur [Apollo](https://www.apollographql.com) sera en NodeJS en version 10.
L'application front sera faite en React.
Je vais utiliser [Docker](https://www.docker.com/) pour ce projet. Le code fourni pour le tutoriel est disponible [ici](https://github.com/MarieMinasyan/apollo-tutorial) et contient un fichier `docker-compose.yml` vous permettant d'installer le projet.