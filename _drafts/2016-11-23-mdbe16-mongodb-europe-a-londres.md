--- layout: post title: "\#MDBE16 - MongoDB Europe à Londres" author:
rjardinet date: '2016-11-23 14:54:12 +0100' date\_gmt: '2016-11-23
13:54:12 +0100' categories: - MongoDB tags: - mongodb - mongodays -
"\#MDBE16" --- {% raw %}

Cette Année, j'ai eu l'occasion de participer à l’événement MongoDB
Europe qui s'est déroulé à Londres le 15 Novembre dernier. Voici un
retour non exhaustif sur les tracks et les annonces intéressantes de la
journée !

 

Note : les slides n’étant pas encore disponibles, l'article sera mis à
jour avec les illustrations/slides dès qu'elles seront disponibles.

Edit : [les
voici](https://www.mongodb.com/presentations/all?page=1&search=europe%202016)

**Welcome et nouveautés**

Comme chaque année, une ouverture sur quelques chiffres :

-   MongoDB : +20 Millions de téléchargements
-   BDD NoSQL la plus présente sur Linkedin
-   Présent dans 47 pays

Puis quelques grands acteurs sous MongoDB : Baidu (plus grand site
chinois, +1000 noeuds MongoDB) ou Barclays

 

**Mongo 3.4**

Les nouveautés de cette version sont présentées sous forme
d’amélioration, d'extension ou d'innovation.

[![Improve, Extend and
innovate](http://blog.eleven-labs.com/wp-content/uploads/2016/11/IMG_4288-300x227.jpg){.wp-image-2593
.aligncenter width="469"
height="355"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/IMG_4288.jpg)

 

Improve :

-   L’élection sous wiredTiger plus rapide

Extend :

-   Read-Only views
-   Bi Connector
-   \$graphLookup - Graphes dans MongoDB (article à suivre)
-   Document validation

Innovate :

-   Zones (sharding par zone géographique)
-   [Compass](https://www.mongodb.com/products/compass)
-   Possibilité de mélanger les types de stockage (Ex : In Memory et
    wiredTiger)

 

Toutes les nouveautés de la 3.4
[ici](https://www.mongodb.com/mongodb-3.4).

 

**Keynote du Prof Brian Cox, physicien et astronome.**

[![Brian Cox
MDBE16](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxS5AUkWgAAgyK0-300x225.jpg){.wp-image-2598
.aligncenter width="439"
height="329"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxS5AUkWgAAgyK0.jpg)

L'objectif de cette présentation était de nous montrer l’utilité de
MongoDB dans le travail de cartographie de l'univers du prof Cox, et
comment l’avènement du BigData aide aujourd'hui énormément les
chercheurs à définir des "modèles" d’expansion de l'univers (milliards
de données).

 

> Great keynote this morning with Professor Brian Cox, OBE at
> [@MongoDB](https://twitter.com/MongoDB)
> [\#MDBE16](https://twitter.com/hashtag/MDBE16?src=hash)
> [pic.twitter.com/3x9SNp7VS6](https://t.co/3x9SNp7VS6)
>
> — Charlotte Brown (@Charlotte\_Br8wn) [15 novembre
> 2016](https://twitter.com/Charlotte_Br8wn/status/798485488474669056)

\
**Advanced MongoDB Aggregation pipelines**

La présentation a commencé par un récapitulatif de l'utilité de
l'aggregation framework, puis plusieurs use-cases plus ou moins
compliqués d'application.

 

[![Aggregation
Framework](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTD2xUWEAAaGFI-1-300x225.jpg){.wp-image-2600
.aligncenter width="588"
height="441"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTD2xUWEAAaGFI-1.jpg)

 

Par exemple le calcul des nombres premiers en MongoDB

[![MongoDB](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTJq9WXUAAw7Et-300x225.jpg){.wp-image-2601
.aligncenter width="597"
height="448"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTJq9WXUAAw7Et.jpg)

 

Et enfin, une première présentation des graphes sous MongoDB 3.4 avec
\$graphLookup

Avec \$graphLookup dans MongoDB 3.4, nous avons enfin la possibilité de
"join" des données d'une même collection, afin de constituer un graphe
de données.

Par exemple :

[![\$graphLookup](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdM2XAAAsM_G-300x225.jpg){.wp-image-2604
.aligncenter width="617"
height="463"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdM2XAAAsM_G.jpg)

 

 

[![cxthdmtw8aeguuu](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdMTW8AEgUuU-300x225.jpg){.wp-image-2606
.aligncenter width="656"
height="492"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/CxTHdMTW8AEgUuU.jpg)

 

Un article sur les fonctionnalités de \$graphLookup plus complet sera
disponible sur le blog d'ici peu.

 

**Building WiredTiger**

Il s'agit d'un REX sur la conception du moteur WiredTiger et sur
sa gestion de la mémoire.

 

> [\#MDBE16](https://twitter.com/hashtag/MDBE16?src=hash)
> [pic.twitter.com/ENF1ViV1JT](https://t.co/ENF1ViV1JT)
>
> — Pouzor (@Pouz0r) [15 novembre
> 2016](https://twitter.com/Pouz0r/status/798489580328648704)

 

**The rise of Data Lake**

Cette session avait pour but d'exprimer une architecture cible pour la
construction d'un data lake et la place de MongoDB dans cette
architecture.

 

> Complète moderne EDM architecture avec
> [\#MongoDB](https://twitter.com/hashtag/MongoDB?src=hash)
> [\#MDBE16](https://twitter.com/hashtag/MDBE16?src=hash)
> [pic.twitter.com/FMNIuwFi5T](https://t.co/FMNIuwFi5T)
>
> — Pouzor (@Pouz0r) [15 novembre
> 2016](https://twitter.com/Pouz0r/status/798539076559175680)

 

 

**Graph Operations with MongoDB**

Cette session finale avait pour but de couvrir en détail les
possibilités des graphes dans MongoDB.

La session a commencé par une timeline des versions MongoDB.

 

> Évolution of MongoDB
> [\#MDBE16](https://twitter.com/hashtag/MDBE16?src=hash)
> [pic.twitter.com/Sbj45iHEFk](https://t.co/Sbj45iHEFk)
>
> — Pouzor (@Pouz0r) [15 novembre
> 2016](https://twitter.com/Pouz0r/status/798572477001633792)

\
Puis sur l’étude de plusieurs cas d'utilisations des graphes sous
MongoDB.

 

> [\#MongoDB](https://twitter.com/hashtag/MongoDB?src=hash) graph usage
> : Get friends of mine
> [pic.twitter.com/sbXzUIUqvr](https://t.co/sbXzUIUqvr)
>
> — Pouzor (@Pouz0r) [15 novembre
> 2016](https://twitter.com/Pouz0r/status/798577288715571200)

 

**Goodby and see you soon**

On se retrouve donc l'année prochaine pour l’évent à Paris !

 

{% endraw %}
