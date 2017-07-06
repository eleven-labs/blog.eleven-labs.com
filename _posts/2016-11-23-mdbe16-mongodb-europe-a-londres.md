---
layout: post
title: "#MDBE16 - MongoDB Europe à Londres"
authors:
    - pouzor
date: '2016-11-23 14:54:12 +0100'
date_gmt: '2016-11-23 13:54:12 +0100'
permalink: /fr/mdbe16-mongodb-europe-a-londres/
categories:
    - MongoDB
tags:
    - mongodb
    - mongodays
    - "#MDBE16"
    - conference
---


Cette Année, j'ai eu l'occasion de participer à l’événement MongoDB Europe qui s'est déroulé à Londres le 15 Novembre dernier. Voici un retour non exhaustif sur les tracks et les annonces intéressantes de la journée !


Note : les slides n’étant pas encore disponibles, l'article sera mis à jour avec les illustrations/slides dès qu'elles seront disponibles.
Edit : [les voici](https://www.mongodb.com/presentations/all?page=1&amp;search=europe%202016")

### Welcome et nouveautés

Comme chaque année, une ouverture sur quelques chiffres :

- MongoDB : +20 Millions de téléchargements
- BDD NoSQL la plus présente sur Linkedin
- Présent dans 47 pays

Puis quelques grands acteurs sous MongoDB : Baidu (plus grand site chinois, +1000 noeuds MongoDB) ou Barclays

### Mongo 3.4

Les nouveautés de cette version sont présentées sous forme d’amélioration, d'extension ou d'innovation.
![Mongo3.4](../../assets/2016-11-23-mdbe16/IMG_4288.jpg)

*Improve :*

- L’élection sous wiredTiger plus rapide

*Extend :*

- Read-Only views
- Bi Connector
- $graphLookup - Graphes dans MongoDB (article à suivre)
- Document validation

*Innovate :*

- Zones (sharding par zone géographique)
- <a href="https://www.mongodb.com/products/compass">Compass</a>
- Possibilité de mélanger les types de stockage (Ex : In Memory et wiredTiger)

Toutes les nouveautés de la 3.4 <a href="https://www.mongodb.com/mongodb-3.4">ici</a>.

### Keynote du Prof Brian Cox, physicien et astronome.

![Prof Brian Cox](../../assets/2016-11-23-mdbe16/CxS5AUkWgAAgyK0.jpg)

L'objectif de cette présentation était de nous montrer l’utilité de MongoDB dans le travail de cartographie de l'univers du prof Cox, et comment l’avènement du BigData aide aujourd'hui énormément les chercheurs à définir des "modèles" d’expansion de l'univers (milliards de données).

<blockquote class="twitter-tweet" data-lang="fr">
<p dir="ltr" lang="en">Great keynote this morning with Professor Brian Cox, OBE at <a href="https://twitter.com/MongoDB">@MongoDB</a> <a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/3x9SNp7VS6">pic.twitter.com/3x9SNp7VS6</a></p>
<p>— Charlotte Brown (@Charlotte_Br8wn) <a href="https://twitter.com/Charlotte_Br8wn/status/798485488474669056">15 novembre 2016</a></p></blockquote>


### Advanced MongoDB Aggregation pipelines

La présentation a commencé par un récapitulatif de l'utilité de l'aggregation framework, puis plusieurs use-cases plus ou moins compliqués d'application.

![Pipelines](../../assets/2016-11-23-mdbe16/CxTD2xUWEAAaGFI-1.jpg)

Par exemple le calcul des nombres premiers en MongoDB

![Pipelines2](../../assets/2016-11-23-mdbe16/CxTJq9WXUAAw7Et.jpg)

Et enfin, une première présentation des graphes sous MongoDB 3.4 avec $graphLookup
Avec $graphLookup dans MongoDB 3.4, nous avons enfin la possibilité de "join" des données d'une même collection, afin de constituer un graphe de données.

Par exemple :

![Pipelines3](../../assets/2016-11-23-mdbe16/CxTHdM2XAAAsM_G.jpg)

![Pipelines4](../../assets/2016-11-23-mdbe16/CxTHdMTW8AEgUuU.jpg)

Un article sur les fonctionnalités de $graphLookup plus complet sera disponible sur le blog d'ici peu.

### Building WiredTiger

Il s'agit d'un REX sur la conception du moteur WiredTiger et sur sa gestion de la mémoire.

<blockquote class="twitter-tweet" data-lang="fr">
<p dir="ltr" lang="und"><a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/ENF1ViV1JT">pic.twitter.com/ENF1ViV1JT</a></p>
<p>— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798489580328648704">15 novembre 2016</a></p></blockquote>


### The rise of Data Lake

Cette session avait pour but d'exprimer une architecture cible pour la construction d'un data lake et la place de MongoDB dans cette architecture.

<blockquote class="twitter-tweet" data-lang="fr">
<p dir="ltr" lang="fr">Complète moderne EDM architecture avec <a href="https://twitter.com/hashtag/MongoDB?src=hash">#MongoDB</a> <a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/FMNIuwFi5T">pic.twitter.com/FMNIuwFi5T</a></p>
<p>— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798539076559175680">15 novembre 2016</a></p></blockquote>


### Graph Operations with MongoDB

Cette session finale avait pour but de couvrir en détail les possibilités des graphes dans MongoDB.
La session a commencé par une timeline des versions MongoDB.

<blockquote class="twitter-tweet" data-lang="fr">
<p dir="ltr" lang="fr">Évolution of MongoDB <a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/Sbj45iHEFk">pic.twitter.com/Sbj45iHEFk</a></p>
<p>— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798572477001633792">15 novembre 2016</a></p></blockquote>


Puis sur l’étude de plusieurs cas d'utilisations des graphes sous MongoDB.

<blockquote class="twitter-tweet" data-lang="fr">
<p dir="ltr" lang="en"><a href="https://twitter.com/hashtag/MongoDB?src=hash">#MongoDB</a> graph usage : Get friends of mine <a href="https://t.co/sbXzUIUqvr">pic.twitter.com/sbXzUIUqvr</a></p>
<p>— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798577288715571200">15 novembre 2016</a></p></blockquote>

### Goodby and see you soon
On se retrouve donc l'année prochaine pour l’évent à Paris !

