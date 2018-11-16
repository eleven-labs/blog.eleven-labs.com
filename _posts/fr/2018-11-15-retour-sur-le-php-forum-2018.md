---
layout: post
title: Retour sur le PHP Forum 2018
excerpt: Cet article fait un retour sur les deux jours du PHP Forum 2018 qui s'est tenu
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
Le 25 et 26 Octobre 2018 c'est tenu ...
![Eleven Labs PHP Forum 2018 ]({{site.baseurl}}/assets/2018-11-15-retour-sur-le-php-forum-2018/eleven-labs-php-forum-2018.jpg)


## Reprenez le contrôle de PostgreSQL grâce à POMM - Mikael Paris - SISMIC
Mickal Paris est venu nous a parlé de POMM pour reprendre le contrôle de PostgreSQL. Aujourd'hui dans nos applications nous utilisons un ORM pour communiquer avec nos base de donnée, ce qui est utile pour faire abstraction du langage SQL. Seulement l’utilisation d’un ORM met le métier au centre du développement.

POMM est une alternative au ORM, il se définit comme un gestionnaire de modèle objet qui force à recentrer la base de donnée au coeur du métier. Le but étant de plus se concentrer sur PostgreSQL afin contrôle de votre SGBDR et de le comprendre pour pouvoir gagner en performance et mieux l’utiliser. Un des inconvénients de POMM par rapport à un ORM est l’interopérabilité entre différents SGBDR car il est disponible uniquement avec PostgreSQL

POMM se décompose en trois briques principales : `Foundation`, `ModelManager` et `Cli`. Foundation est la brique centrale composé de session et de client. C’est avec cette brique que vous ferez vos `query_manager`, `prepared_query`, `observer`, `converter`, `notifier`, `inspector`. Le ModelManager est une brique extension de la première apportant de la modélisation objet par rapport à la base de donnée. Quant à la brique CLI elle vas nous faciliter la vie en générant les différents objets. Des commandes d'inspection sont également disponibles pour éviter d'ouvrir une console psql.

Vous pouvez utiliser POMM dans vos projets Symfony pour ça voici le lien du dépots GitHub: [POMM project - bundle](https://github.com/pomm-project/pomm-bundle). Et si vous voulez en savoir plus voici le lien de site du projet (POMM project)[http://www.pomm-project.org]

Voici le lien de la video de la présentation de Mickal Paris sur POMM : (afup.org - Reprenez le contrôle de PostgreSQL grâce à POMM)[https://afup.org/talks/2716-reprenez-le-controle-de-postgresql-grace-a-pomm]

## MySQL 8.0 : quoi de neuf ? - Olivier Dasini - Oracle
Olivier Dasini est venu nous parler de MySQL 8.0 est ses nouveautés. ALors il y a eu beaucoup de nouvelle fonctionnalité sur MySQL 8.8 mais celles que j’ai retenu c’est l'apparition de NoSQL documentaire, l’API développeur et les window functions. Et oui maintenant de MySQL vous pouvez faire du NoSQL orienté document, ici je ne vais pas revenir sur le NoSQL donc je vais directement vous parler de l’API.

L'intégration du NoSQL dans MySQL 8.0 vas vous permettre de centraliser vos données dans un seul SGBD. De plus avec la nouvelle APi dev vous pouvez mêler query SQL et NoSQL ce qui vous permettra d'optimiser le nombre de requête à vous SGBD. Mais aussi plusieurs nouvelles `Windows Functions` sont apparues pour permettre de prendre en charge le NoSQL.

En plus de toutes ces nouvelles fonctionnalité MySQL 8.0 c'est améliorer dans ces performances comme le montre ce graphique :
![Eleven Labs PHP Forum 2018 ]({{site.baseurl}}/assets/2018-11-15-retour-sur-le-php-forum-2018/mysql8performance-80.png)

Voici le lien de des slides et de la vidéo de la présentation d'Olivier Dasini sur MySQL 8.0 : (afup.org - MySQL 8.0: Quoi de neuf ?)[https://afup.org/talks/2669-mysql-8-0-quoi-de-neuf]

## Cessons les estimations ! - Frédéric Leguédois - Cloud Temple
Frédéric Leguédois est venu nous parler des estimations dans la gestion de projet. En plus d’avoir fait un one man show surprenant, Frédéric Leguédois nous a démontré rapidement que les estimations été une fausse bonne pratique dans la gestion de projet. Avec un argumentaire plus que préparé et une conviction aveugle à son idée Frédéric Leguédois à du faire changer d’avis la quasi totalité de son auditoire du PHP Forum.

Je ne vais pas reprendre tous ces arguments car je vous conseille d’aller voir mais le premier qui m’a marqué est celui-ci : “Un chef de projet reçoit un cahier des charge, il va le lire une fois, deux fois et à la troisième fois comme par magie il donne une estimation : 3 mois avec 8 personnes. Mais comment a-t-il fait ?”. Je pense que vous pouvez trouver plein de réponse à son premier argument mais les suivants sont identiques et vous prouve que c’est impossible. Par exemple sur un projet de deux avec la meilleur estimation si vous faite un bilan un an après le démarrage du projet vous allez voir que les estimations de l’année dernière n’ont plus rien à voir et que le premier planning prévisionnel à eu x version pour pouvoir avoir une pseudo corrélation avec la réalité

De plus les estimations ne sont pas une bonne pratique Agile. Si on regarde Framework “Agile” le plus utilisé et populaire, Scrum, on peut voir qu’il n’a pas la philosophie Agile. Une des valeur de l’Agile est `La collaboration avec les clients plus que la négociation contractuelle` et faire des estimation vas simplement permettre d’entrer dans une phase de `négociation` entre Dev Team et client, Agilité est rompu.

De mémoire cela fait neuf an que Frédéric Leguédois travail sans estimation et ces clients sont contents car il n’y a tout simplement pas de retard et devenir vraiment Agile.

## Conclusion
