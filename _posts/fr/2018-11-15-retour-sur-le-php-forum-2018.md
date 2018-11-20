---
layout: post
title: Retour sur le PHP Forum 2018
excerpt: Cet article vous propose un retour sur le Forum PHP qui s'est tenu les 26 et 26 octobre derniers
authors:
    - nicolas
permalink: /fr/retour-sur-le-php-forum-2018/
categories:
    - Conferance
    - PHP
tags:
    - Conférence
    - PHP
    - Linux
    - Paris
    - 2018
    - MySQL
    - Agile
    - DevOps
cover: /assets/2018-11-15-retour-sur-le-php-forum-2018/cover.png
---

## Introduction
Les 25 et 26 Octobre s'est tenue l'édition 2018 du [Forum PHP]({{site.baseurl}}/assets/2018-11-15-retour-sur-le-php-forum-2018/eleven-labs-php-forum-2018.jpg). Les astronautes étaient encore uen fois présents sur place. Voici leurs retours sur les conférences qui les ont marqués.

## Reprenez le contrôle de PostgreSQL grâce à POMM - Mikael Paris - SISMIC
Mickal Paris est venu nous parler de POMM, un outil qui va nous aider à "reprendre le contrôle de PostgreSQL".  
Aujourd'hui, dans nos applications, nous utilisons un ORM pour communiquer avec nos bases de données. C'est utile pour faire abstraction du langage SQL.  

Seulement, l’utilisation d’un ORM met le métier au centre du développement. POMM est une alternative au ORM. Il se définit comme un gestionnaire de modèle objet qui force à recentrer la base de données au coeur du métier. Le but est de laisser de côté l'aspect code, et de se concentrer sur le SGBD (en l'occurrence PostgreSQL, donc) afin de mieux l'appréhender et d'augmenter ses performances. Un des inconvénients de POMM par rapport à un ORM est le manque d’interopérabilité avec différents SGBDR, car il est disponible uniquement avec PostgreSQL.

POMM se décompose en trois briques principales : `Foundation`, `ModelManager` et `Cli`.  

Foundation est la brique centrale composée de sessions et de clients. C’est avec cette brique que vous ferez vos `query_manager`, `prepared_query`, `observer`, `converter`, `notifier`, `inspector`.  
Le ModelManager est une brique extension de la première, apportant de la modélisation objet par rapport à la base de données.  
Quant à la brique CLI, elle va nous faciliter la vie en générant les différents objets. Des commandes d'inspection sont également disponibles pour éviter d'ouvrir une console psql.

Vous pouvez utiliser POMM dans vos projets Symfony. Voici le lien du dépot GitHub: [POMM project - bundle](https://github.com/pomm-project/pomm-bundle). Et si vous voulez en savoir plus, voici le lien de site du projet (POMM project)[http://www.pomm-project.org]

Voici le lien de la vidéo de la présentation de Mickal Paris sur POMM : (afup.org - Reprenez le contrôle de PostgreSQL grâce à POMM)[https://afup.org/talks/2716-reprenez-le-controle-de-postgresql-grace-a-pomm]

## MySQL 8.0 : quoi de neuf ? - Olivier Dasini - Oracle
Olivier Dasini est venu nous parler de MySQL 8.0 est de ses nouveautés. ALors il y a eu beaucoup de nouvelles fonctionnalités sur MySQL 8.8. Mais les plus notables sont : 
    -l'apparition de NoSQL documentaire
    -l’API développeur
    -les window functions
    
Et oui, maintenant, depuis MySQL vous pouvez faire du NoSQL orienté document. Ici je ne vais pas revenir sur le NoSQL donc je vais directement vous parler de l’API.

L'intégration du NoSQL dans MySQL 8.0 va vous permettre de centraliser vos données dans un seul SGBD. De plus avec la nouvelle APi dev vous pouvez mêler query SQL et NoSQL ce qui vous permettra d'optimiser le nombre de requêtes vers votre SGBD. Mais aussi plusieurs nouvelles `Windows Functions` sont apparues pour permettre de prendre en charge le NoSQL.

En plus de toutes ces nouvelles fonctionnalité MySQL 8.0 a subi un petit lifting de performances comme le montre ce graphique :
![Eleven Labs PHP Forum 2018 ]({{site.baseurl}}/assets/2018-11-15-retour-sur-le-php-forum-2018/mysql8performance-80.png)

Voici le lien des slides et de la vidéo de la présentation d'Olivier Dasini sur MySQL 8.0 : (afup.org - MySQL 8.0: Quoi de neuf ?)[https://afup.org/talks/2669-mysql-8-0-quoi-de-neuf]

## Cessons les estimations ! - Frédéric Leguédois - Cloud Temple
Frédéric Leguédois est venu nous parler des estimations dans la gestion de projet. En plus d’avoir fait un one man show surprenant, Frédéric Leguédois nous a démontré rapidement que les estimations étaient une fausse bonne pratique dans la gestion de projet. Avec un argumentaire plus que préparé et une conviction sans bornes Frédéric Leguédois à sans doute fait changer d’avis la quasi-totalité de son auditoire du PHP Forum.

Je ne vais pas reprendre tous ses arguments car je vous conseille d'assister à une de ses conférences, mais le premier qui m’a marqué est celui-ci : “Un chef de projet reçoit un cahier des charge, il va le lire une fois, deux fois et à la troisième fois comme par magie il donne une estimation : 3 mois avec 8 personnes. Mais comment a-t-il fait ?”.  

Les suivants sont identiques et confortent cette incohérence des estimations. Par exemple sur un projet de deux ans, et avec la meilleure estimation possible, si vous faite un bilan un an après le démarrage du projet vous allez voir que les estimations de l’année dernière n’ont plus rien à voir et que le premier planning prévisionnel à eu x versions pour pouvoir retrouver une pseudo corrélation avec la réalité du projet.

Concrètement, il défend le fait que les estimations ne sont pas une bonne pratique Agile. Si on regarde le Framework “Agile” le plus utilisé et populaire, Scrum, on peut constater qu’il ne s'inscrit pas vraiment dans la philosophie Agile. Une des valeurs de l’Agilité est `La collaboration avec les clients plus que la négociation contractuelle` et faire des estimation va simplement permettre d’entrer dans une phase de `négociation` entre Dev Team et client, l'Agilité est rompue.

De mémoire cela fait neuf an que Frédéric Leguédois travaille sans estimations et ses clients sont contents car il n’y a tout simplement pas de retards.

## Conclusion
