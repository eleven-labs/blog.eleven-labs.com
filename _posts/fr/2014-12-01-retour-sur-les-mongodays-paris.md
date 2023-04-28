---
lang: fr
date: '2014-12-01'
slug: retour-sur-les-mongodays-paris
title: Retour sur les MongoDays @Paris
excerpt: >-
  Ayant eu la chance de pouvoir participer a la version Française MongoDB Days
  qui s'est tenue le 18 Novembre, je vais vous présenter en quelques lignes le
  déroulement de la journée. Je m'attarderai un peu plus sur les présentations
  qui selon moi étaient intéressantes techniquement. Vous trouverez aussi le
  lien vers toutes les présentations des speakers.
authors:
  - pouzor
categories: []
keywords:
  - mongodb
  - mongodays
---

Ayant eu la chance de pouvoir participer a la version Française MongoDB Days qui s'est tenue le 18 Novembre, je vais vous présenter en quelques lignes le déroulement de la journée. Je m'attarderai un peu plus sur les présentations qui selon moi étaient intéressantes techniquement. Vous trouverez aussi le lien vers toutes les présentations des speakers.

**Introduction**

*9h30-10h -* Yann Aubr, Senior Director et Alain Hélaïli, Senior Solutions Architect.

Hormis la présentation générael de la société et du produit, certains chiffres intéressants ont été mis en avant afin de mettre en avant la montée de l'utilisation de MongoDb :

- 9 000 000+ de téléchargements
- 250 000+ participants aux Mongos University (https://university.mongodb.com/)
- 35 000+ Membres du groupe MongoDb
- 40 000+ Utilisateurs du service MMS
- 700+ Services et partenaires
- 1000+ Clients toutes industries confondues

Enfin, les nouveautés de la futur version 2.8(http://docs.mongodb.org/manual/release-notes/2.8/) de mongoDB ont été presentées. A l'affiche, le "Document Level Locking" ainsi que la possibilité de plugger un autre moteur de stockage, notamment dans cette version avec (http://www.wiredtiger.com) wiredtiger comme alternative au moteur MMAPv1 par defaut.

------------------------------------------------------------------------

**Socialite, the Open Source Status Feed**
10h-11h par Asya Kamsky, Principal Solutions Architect, MongoDB

La présentation a tourné autour de l'étude d'un cas pratique, en l'occurrence "[Socialite](https://github.com/10gen-labs/socialite){:rel="nofollow noreferrer"}" un réseau social proposant des fonctionnalités proches de Twitter.

De la gestion des Index, du mapping ou du Sharding, en passant par l'architecture même de l'application, tout est passé au crible afin de développer une application scalable et correspondant aux besoins.

*- Retours personnels*

Présentation intéréssante, repassant sur les bases d'une application Mongo fullstack. Malgré tout, plusieurs pro-tips sont sortis de cette présentation.
Par exemple, saviez vous que l'objet ObjectId contient une methode getTimestamp() renvoyant le timestamp de l'insertion de la donnée dans la collection (si celui ci na pas été forcé bien evidemment).

[Lien de la présentation](http://fr.slideshare.net/mongodb/socialite-the-open-source-status-feed){:rel="nofollow noreferrer"}

------------------------------------------------------------------------

**Plus de flexibilité et de scalabilité chez Bouygues Télécom grâce à MongoDB**

11h-12h -  par Pierre-Alban Dewitte, Leader d'équipe, Bouygues Télécom

Ce talk, présenté par Pierre-Alban Dewitte, a présenté la refonte de l'outil de gestion client chez Bouygues, en partant de la solution initiale, ne correspondant pas aux besoins, jusqu'à la solution "fait main" par l'équipe en question, utilisant bien évidemment comme socle mongoDB. Les chiffres annoncés sont vertigineux :

- 99,9% de disponibilité
- 3000 req/s
- 2To de RAM
- 750 de données
- x noeuds

*- Retours personnels*

Présentation très interéssante, d'autant plus que travaillant dans un contexte et sur un produit similaire, la possibilité de pouvoir échanger avec eux à été très enrichissante. Surtout quand on sait qu'ils n'avaient aucune connaissance de mongoDB lorsqu'ils ont commencé le poke de la solution, les chiffres annoncés sont impressionnants !

[Lien vers les slides](http://fr.slideshare.net/mongodb/plus-de-flexibilit-et-de-scalabilit-chez-bouygues-tlcom-grce-mongodb){:rel="nofollow noreferrer"}

------------------------------------------------------------------------



**Scalabilité de MongoDB**

13h-14h - Alain Hélaïli, Senior Solutions Architect, MongoDB

La présentation d'Alain Hélaïli avait comme sujet "Comment rendre notre système mongoDb performant, rapide et scalable". Au travers d'exemples et de cas concrets, le speaker a répondu point par point à ces différentes problématiques avec les différentes solutions dont mongoDB disposent comme le Replica, le Sharding, ou encore la gestion des indexes.

Quelques concepts clés :

-   Bonne gestion des indexes (notamment la gestion des doubles indexes)
-   Eviter d'ajouter trop de champs lors des updates, quitte a les instancier à NULL lors de la création afin de "réserver" la place sur le disque pour de futurs écritures.
-   Bulk insert
-   Gestion des chunks et du sharding
-   MMS, mongoperf, mongostats....



*- Retours personnels*

Ce fut la présentation qui sur le planning m'interessait le plus et ce fut la plus intéressante. L'axe de présentation correspond à l'évolution nécessaire d'une application mongoDB, en partant des "petites optimisations" mais quand bien même nécessaire jusqu'à comment construire une architecture a +100 noeuds mongo. Je vous invite à consulter les slides [ici](http://fr.slideshare.net/mongodb/scalabilit-de-mongodb){:rel="nofollow noreferrer"} .



------------------------------------------------------------------------

**MongoDB et Hadoop**
14-15h - Tugdual Grall, Partner Technical Services Solutions Architect, MongoDB

Présentation detaillée sur l'utilisation d'une couche d'application supplémentaire afin de donner une vision 360 sur certains types de données. De la même manière, le speaker a présenté de nombreux cas où l'utilisation des outils comme Hadoop, Spark sont nécessaires et comment les faire interagir avec notre application mongoDB.

[Lien vers les slides](http://fr.slideshare.net/mongodb/mongodb-day-paris2014hadooptgrall-1){:rel="nofollow noreferrer"}



------------------------------------------------------------------------

15h-16h
Speak des sponsors de l’événement par Teradata et Zenika

------------------------------------------------------------------------

**Automatisez votre gestion de MongoDB avec MMS**

16-17h - Alain Hélaïli, Senior Solutions Architect, MongoDB

Dernier speak technique de la journée. La nouvelle version de l'outil en ligne MMS a été présenté. En plus de la partie classique de monitoring et de gestion de cluster, cette version intègre la possibilité de provisionner directement grâce a Amazon S3 des clusters de machine et de les configurer.

[Lien de la présentation](http://fr.slideshare.net/mongodb/mongo-db-days-paris-2014-mms-fr){:rel="nofollow noreferrer"}

------------------------------------------------------------------------

**Roadmap produit**

17h-17h30 - Tugdual Grall, Partner Technical Services Solutions Architect, MongoDB

En forme de conclusion de la journée, Tugdual nous a teasé sur les futures (ou non) fonctionnalités de mongoDB 2.8+.

Voici une liste non exhaustive :

-   Document Level Locking
-   Mapping Validation
-   Document Join
-   De nouveaux moteurs de BDD en plus des deux versions de la 2.8
-   Service de backup performant et de restauration par filtre
-   ...



Tugdual a mis en avant les difficultés pour développer ces fonctionnalités ainsi que les potentielles limites. Par exemple pour le join, cela ne pourrait ce faire que sur les clefs de shard afin de pouvoir être scalable et donc de fonctionner avec le sharding de mongoDB.

**En conclusion**

Ce fut une journée très instructive. Au-delà d'une mise au point sur les capacités et les nouveautés de MongoDB, beaucoup de petit "tips" de performance sont ressortis des différentes conférences. Le genre de petites choses qui misent bout à bout peuvent permettre de gagner pas mal de performance sur des architectures complexes ou sur des gros volumes.

A noter qu'en parallèle des différentes présentations, les architectes et spécialistes mongoDB étaient présents toute la journée pour des entretiens personnels afin de répondre aux questions ou aux problématiques que l'on peut avoir dans nos projets personnels ou professionnels. J'ai trouvé cette initiative très agréable, de pouvoir se rendre disponible aux 'clients' de leurs solutions, surtout que la plupart de ces solutions sont gratuites.

Vous pouvez aussi trouver toutes les speaks des précédents événements à cette [adresse](http://www.mongodb.com/presentations/){:rel="nofollow noreferrer"}
