---
layout: post
title: "#MDBE16 - MongoDB Europe à Londres"
author: rjardinet
date: '2016-11-23 14:54:12 +0100'
date_gmt: '2016-11-23 13:54:12 +0100'
categories:
- MongoDB
tags:
- mongodb
- mongodays
- "#MDBE16"
---

Cette Année, j'ai eu l'occasion de participer à l’événement MongoDB Europe qui s'est déroulé à Londres le 15 Novembre dernier. Voici un retour non exhaustif sur les tracks et les annonces intéressantes de la journée !

<!--more-->

&nbsp;

Note : les slides n’étant pas encore disponibles, l'article sera mis à jour avec les illustrations/slides dès qu'elles seront disponibles.

Edit : <a href="https://www.mongodb.com/presentations/all?page=1&amp;search=europe%202016">les voici</a>

**Welcome et nouveautés**

Comme chaque année, une ouverture sur quelques chiffres :

<ul>
<li>MongoDB : +20 Millions de téléchargements</li>
<li>BDD NoSQL la plus présente sur Linkedin</li>
<li>Présent dans 47 pays</li>
</ul>
Puis quelques grands acteurs sous MongoDB : Baidu (plus grand site chinois, +1000 noeuds MongoDB) ou Barclays

&nbsp;

**Mongo 3.4**

Les nouveautés de cette version sont présentées sous forme d’amélioration, d'extension ou d'innovation.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/IMG_4288.jpg"><img class=" wp-image-2593 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/IMG_4288-300x227.jpg" alt="Improve, Extend and innovate" width="469" height="355" /></a>

&nbsp;

Improve :

<ul>
<li>L’élection sous wiredTiger plus rapide</li>
</ul>
Extend :

<ul>
<li>Read-Only views</li>
<li>Bi Connector</li>
<li>$graphLookup - Graphes dans MongoDB (article à suivre)</li>
<li>Document validation</li>
</ul>
Innovate :

<ul>
<li>Zones (sharding par zone géographique)</li>
<li><a href="https://www.mongodb.com/products/compass">Compass</a></li>
<li>Possibilité de mélanger les types de stockage (Ex : In Memory et wiredTiger)</li>
</ul>
&nbsp;

Toutes les nouveautés de la 3.4 <a href="https://www.mongodb.com/mongodb-3.4">ici</a>.

&nbsp;

**Keynote du Prof Brian Cox, physicien et astronome.**

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxS5AUkWgAAgyK0.jpg"><img class=" wp-image-2598 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxS5AUkWgAAgyK0-300x225.jpg" alt="Brian Cox MDBE16" width="439" height="329" /></a>

L'objectif de cette présentation était de nous montrer l’utilité de MongoDB dans le travail de cartographie de l'univers du prof Cox, et comment l’avènement du BigData aide aujourd'hui énormément les chercheurs à définir des "modèles" d’expansion de l'univers (milliards de données).

&nbsp;

<blockquote class="twitter-tweet" data-lang="fr">
Great keynote this morning with Professor Brian Cox, OBE at <a href="https://twitter.com/MongoDB">@MongoDB</a> <a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/3x9SNp7VS6">pic.twitter.com/3x9SNp7VS6</a>

— Charlotte Brown (@Charlotte_Br8wn) <a href="https://twitter.com/Charlotte_Br8wn/status/798485488474669056">15 novembre 2016</a>
</blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script><br />
**Advanced MongoDB Aggregation pipelines**

La présentation a commencé par un récapitulatif de l'utilité de l'aggregation framework, puis plusieurs use-cases plus ou moins compliqués d'application.

&nbsp;

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTD2xUWEAAaGFI-1.jpg"><img class=" wp-image-2600 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTD2xUWEAAaGFI-1-300x225.jpg" alt="Aggregation Framework" width="588" height="441" /></a>

&nbsp;

Par exemple le calcul des nombres premiers en MongoDB

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTJq9WXUAAw7Et.jpg"><img class="wp-image-2601 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTJq9WXUAAw7Et-300x225.jpg" alt="MongoDB" width="597" height="448" /></a>

&nbsp;

Et enfin, une première présentation des graphes sous MongoDB 3.4 avec $graphLookup

Avec $graphLookup dans MongoDB 3.4, nous avons enfin la possibilité de "join" des données d'une même collection, afin de constituer un graphe de données.

Par exemple :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdM2XAAAsM_G.jpg"><img class=" wp-image-2604 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdM2XAAAsM_G-300x225.jpg" alt="$graphLookup" width="617" height="463" /></a>

&nbsp;

&nbsp;

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdMTW8AEgUuU.jpg"><img class=" wp-image-2606 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdMTW8AEgUuU-300x225.jpg" alt="cxthdmtw8aeguuu" width="656" height="492" /></a>

&nbsp;

Un article sur les fonctionnalités de $graphLookup plus complet sera disponible sur le blog d'ici peu.

&nbsp;

**Building WiredTiger**

Il s'agit d'un REX sur la conception du moteur WiredTiger et sur sa gestion de la mémoire.

&nbsp;

<blockquote class="twitter-tweet" data-lang="fr">
<a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/ENF1ViV1JT">pic.twitter.com/ENF1ViV1JT</a>

— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798489580328648704">15 novembre 2016</a>
</blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

&nbsp;

**The rise of Data Lake**

Cette session avait pour but d'exprimer une architecture cible pour la construction d'un data lake et la place de MongoDB dans cette architecture.

&nbsp;

<blockquote class="twitter-tweet" data-lang="fr">
Complète moderne EDM architecture avec <a href="https://twitter.com/hashtag/MongoDB?src=hash">#MongoDB</a> <a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/FMNIuwFi5T">pic.twitter.com/FMNIuwFi5T</a>

— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798539076559175680">15 novembre 2016</a>
</blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

&nbsp;

&nbsp;

**Graph Operations with MongoDB**

Cette session finale avait pour but de couvrir en détail les possibilités des graphes dans MongoDB.

La session a commencé par une timeline des versions MongoDB.

&nbsp;

<blockquote class="twitter-tweet" data-lang="fr">
Évolution of MongoDB <a href="https://twitter.com/hashtag/MDBE16?src=hash">#MDBE16</a> <a href="https://t.co/Sbj45iHEFk">pic.twitter.com/Sbj45iHEFk</a>

— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798572477001633792">15 novembre 2016</a>
</blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script><br />
Puis sur l’étude de plusieurs cas d'utilisations des graphes sous MongoDB.

&nbsp;

<blockquote class="twitter-tweet" data-lang="fr">
<a href="https://twitter.com/hashtag/MongoDB?src=hash">#MongoDB</a> graph usage : Get friends of mine <a href="https://t.co/sbXzUIUqvr">pic.twitter.com/sbXzUIUqvr</a>

— Pouzor (@Pouz0r) <a href="https://twitter.com/Pouz0r/status/798577288715571200">15 novembre 2016</a>
</blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

&nbsp;

**Goodby and see you soon**

On se retrouve donc l'année prochaine pour l’évent à Paris !

&nbsp;


