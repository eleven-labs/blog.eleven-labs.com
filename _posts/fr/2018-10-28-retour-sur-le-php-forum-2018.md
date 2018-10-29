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
    - Conferance
    - PHP
    - Linux
    - Paris
    - 2018
    - MySQL
    - Agile
    - DevOps
cover: /assets/2018-11-08-retour-sur-le-php-forum-2018/cover.png
---
<!-- TODO: Changer la date de l'article -->

## Introduction
Le 25 et 26 Octobre 2018 c'est tenu ...


## Reprenez le contrôle de PostgreSQL grâce à POMM - Mikael Paris - SISMIC
Mickal Paris est venu nous a parlé de POMM pour reprendre le contrôle de PostgreSQL. Aujourd'hui dans nos applications nous utilisons un ORM pour communiquer avec nos base de donnée, ce qui est utile pour faire abstraction du langage SQL. Seulement l’utilisation d’un ORM met le métier au centre du développement.

POMM est une alternative au ORM, il se définit comme un gestionnaire de modèle objet qui force à recentrer la base de donnée au coeur du métier. Le but étant de plus se concentrer sur PostgreSQL afin contrôle de votre SGBDR et de comprendre pour pouvoir gagner en performance et mieux l’utiliser. Un des inconvénients de POMM par rapport à un ORM est l’interopérabilité entre différents SGBDR car il est disponible uniquement avec PostgreSQL

POMM se décompose en trois briques Foundation, ModelManager et Cli. Foundation est la brique principale composé de session et de client. C’est avec cette brique que vous ferez vos `query_manager`, `prepared_query`, `observer`, `converter`, `notifier`, `inspector`. Le ModelManager est une brique extension de la première apportant de la modélisation objet par rapport à la base de donnée. Quant à la brique CLI elle vas nous faciliter la vie en générant les différents objets. Des commandes d'inspection sont également disponibles pour éviter d'ouvrir une console psql.

Vous pouvez utiliser POMM dans vos projets Symfony pour ça voici le lien du dépots GitHub: [POMM project - bundle](https://github.com/pomm-project/pomm-bundle). Et si vous voulez en savoir plus voici le lien de site du projet (POMM project)[http://www.pomm-project.org]

## MySQL 8.0 : quoi de neuf ? - Olivier Dasini - Oracle
Olivier Dasini est venu nous parler de MySQL 8.0 est ses nouveautés. ALors il y a eu beaucoup de nouvelle fonctionnalité sur MySQL 8.8 mais celles que j’ai retenu c’est l'apparition de NoSQL documentaire, l’API développeur et les window functions. Et oui maintenant de MySQL vous pouvez faire du NoSQL orienté document, ici je ne vais pas revenir sur le NoSQL donc je vais directement vous parler de l’API. 

Avec l'apparition du NoSQL l’API développeur à évoluer, avec MySQL 5.x on utilise le plus souvent PDO pour PHP

-- compatible NoSQL
-- Lien SQL - NoSQL

-- Window Functions

## Cessons les estimations ! - Frédéric Leguédois - Cloud Temple
Frédéric Leguédois est venu nous parler des estimations dans la gestion de projet
