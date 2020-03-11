---
layout: post
title: "Introduction à ArangoDB Part 1"
excerpt: "Dans cet article, nous allons faire un petit tour de cette base de donnée multi-modèle"
authors:
    - vdelpeyroux
permalink: /fr/s/
categories:
    - base de donnée
tags:
    - base de donnée multi-modèle
    - javascript
    - graphe
---
![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/ArangoDB_logo.webp)

# ArangoDB c'est quoi?
ArangoDB est une base de donnée multi-modèle, ce qui veut dire qu'elle prend en charge plusieurs types de données nativement.
elle supporte les données de type "clé-valeur", "document", "géospaciale" (GeoJSON,..) ainsi que de type "graphe", et toutes ces données peuvent être requêtées avec un seul et même language le AQL (ArangoDB Query Language) tout en assurant aux transactions les propriétés [ACID](https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID) (atomicité, cohérence, isolation et durabilité).

ArangoDB est open source (Apache License 2.0) possède une édition gratuite "Community" et un autre payante dite "Enterprise" ajoutant des fonctionnalités répondant à des problématiques de projets avancés.


# Performances et architecture
Du fait que ArangoDB est basé sur des concepts NoSQL, et que tout est en quelque sorte "document" avec une indexation des données customisable et poussée, elle est réputée pour être très réactive sur des opérations écriture/lecture mais également pour des requêtes orientées graphe;

pour les plus curieux voici un [lien](https://www.arangodb.com/2018/02/nosql-performance-benchmark-2018-mongodb-postgresql-orientdb-neo4j-arangodb/) vers un benchmark présentant ses résultats avec ceux de bases de données connues et techniquement comparable (ce test ne date pas d'hier, donc à prendre avec des pincettes, mais cela vous donnera une petite idée de ses performances).


ArangoDB vient également avec des notions de réseau et vous laisse choisir entre plusieurs architectures:

  - "Single instance": une unique instance Arango existera sur le serveur

  - "master/slave": toutes les opérations se fera sur le "master", pendant que l'instance "slave" effectuera une réplication du "master" de façon asynchrone.

  - "Active Failover": presque le même principe "Master/Slave", sauf que l'instance "Master" est déterminé par un composant de la base de donnée "Agency Supervision" et donne le droit d'écriture et lecture à une instance de façon dynamique.

  - "Cluster": architecture la plus intéressante selon moi, qui permet une haute scalabilité devant un fort traffic.
    chaque "cluster est composé de différents nœud ayant des rôles bien définis:

    - l'Agence (Agency): elle est en charge de prioriser les opérations arrivant et de gérer les services de synchronisation, sans elle, les composants ci dessous ne peuvent pas communiquer.

    - le coordinateurs (Coordinator): ce composant est le point d'entrée entre le client et la donnée, elle coordonne les requêtes entre les différentes instances de base de donnée.

    - l'instance de base de donnée (DB Server): responsable de l'écriture et lecture des données.

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/cluster.webp) 


# Installation
Multiples sont les façons d'installer ArangoDB:
  - installation sur tout les systèmes d'exploitations (Ubuntu, Windows, macOS) ou autres distributions serveurs (CentOS, ...)
  - installation Docker avec une image officielle
  - installation Kubernetes (via kubectl ou helm) en local avec miniKube ou sur les plateformes cloud tel que Amazon, Google Cloud ou Azure (à savoir que ArangoDB a ses propres "operator")

Avec [ArangoDB Oasis](https://cloud.arangodb.com/home), il est même possible de lancer de façon très simple des instances hautement scalables d'ArangoDB déployées automatiquement sur AWS, Google Cloud ou Azure.

Pour une première prise en main on va faire au plus simple c'est à dire une installation Docker:
``` bash
docker run -p 8529:8529 -e ARANGO_ROOT_PASSWORD=rocketEleven arangodb/arangodb:3.6.1
```


# Interface
Même si Arango de base expose par défaut une API REST pour pouvoir communiquer via le protocole HTTP, une interface graphique est également disponible; pour nous ce sera à l'adresse [http://localhost:8529](http://localhost:8529)

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/login.webp)
Le login admin par défaut est "root" et le mot de passe est celui fournit dans la ligne de commande ci dessus, ici "rocketEleven".

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/selectDBView.webp)
Chaque serveur a par défaut une base de donnée "_system", sélectionnez là.


![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/dashboard.png)

Nous accédons enfin au dashboard de l'instance, qui présente quelques statistiques (le nombre de requêtes par seconde, le type de requête, le nombre de connexions, mémoire, CPU, etc...)
À savoir que par défaut ArangoDB choisit l'architecture "single instance", si on avait choisit le mode "cluster" nous aurions eu des statistiques sur les nœuds le composant (Coordinator, DB Server, Agency) ainsi que leur endpoint.

De cette interface nous pouvons créer des utilisateurs, des nouvelles bases de données, des collections de différents types données, mais ce sera le sujet de la deuxième partie.


# La suite
Dans la partie 2 de cette article nous allons voir comment créer une base de donnée ArongoDB, avec plusieurs collections de différents types de données (Document, Graphe,..) et voir comment les requêter via le language AQL.
