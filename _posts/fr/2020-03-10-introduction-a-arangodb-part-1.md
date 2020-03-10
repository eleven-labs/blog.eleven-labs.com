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
elle supporte les données de type "clé-valeur", "document" ainsi que de type "graphe", et toute ces données peuvent être requêtées avec un seul et même language le AQL (ArangoDB Query Language) tout en assurant aux transactions les propriétés [ACID](https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID) (atomicité, cohérence, isolation et durabilité).


# Performences et architecture
Du fait que ArangoDB est basé sur des concepts NoSQL, et que tout est en quelque sorte "document", elle est réputé pour être très réactive sur les opérations écriture/lecture mais également pour des requètes sur les données de type graphe ( pour les plus curieux voici un [lien](https://www.arangodb.com/2018/02/nosql-performance-benchmark-2018-mongodb-postgresql-orientdb-neo4j-arangodb/) vers un benchmark présentant ses résultats avec ceux de bases de données connues et techniquement comparable; ce test ne date pas d'hier, donc à prendre avec des pincettes, mais cela vous donnera une petite idée de ses performences.


ArangoDB vient également avec des notions de réseau et vous laisse choisir entre plusieurs architectures:

  - "Single instance": une unique instance Arango existera sur le serveur

  - "master/slave": toutes les opérations se fera sur le "master", pendant que l'instance "slave" effectuera une réplication du "master" de façon asynchrone

  - "Active Failover": presque le même principe "Master/Slave", sauf que l'intance "Master" est déterminé par un composant de la base de donnée "Agency Supervision" et donne le droit d'écriture et lecture de façon dynamique

  - "Cluster": architecture la plus interressante selon moi, qui permet une haute scalabilité devant un fort traffic.
    chaque "cluster est composé de différentes noeud ayant des rôles différents.

    - l'Agence (Agency): elle est en charge de prioriser les opérations arrivant et de gérer les services de synchronisation, sans elle, les composants ci dessous ne peuvent plus communiquer

    - le coordinateurs (Coordinator): ce composant est le point d'entrée entre le client et la données, elle coordonne les requêtes entre les différentes instances de base de donnée

    - l'instances de base de donnée (DB Server): responsable de l'écriture et lecture des données

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/cluster.webp) 


# Installation
Multiples sont les façons d'installer ArangoDB:
  - installation sur tout les systemes d'exploitations (Ubuntu, Windows, macOS) ou autres distributions serveurs (CentOS, ...)
  - installation Docker avec une image officielle
  - installation Kubernetes (via kubectl ou helm) en local avec miniKube ou Google Cloud, Azure, Amazon (à savoir que ArangoDB a ses propres operator)

Pour une première prise en main on va faire au plus simple c'est à dire une installation Docker:
``` bash
docker run -p 8529:8529 -e ARANGO_ROOT_PASSWORD=rocketEleven arangodb/arangodb:3.6.1
```

# Interface
Même si Arango de base expose par défault une API REST pour pouvoir communiquer via le protocole HTTP, une interface graphique est également disponible à l'adresse [http://localhost:8529](http://localhost:8529)

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/login.webp)
Le login admin par defaut est "root" et le mot de passe est celui fournit dans la ligne de commande ci dessus, ici "rocketEleven"

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/selectDBView.webp)
Chaques serveurs par défaut avec un base de donnée "_syteme", selectionez là.

![]({{ site.baseurl }}/assets/2020-03-10-introduction-a-arangodb-part-1/dashboard.png)
Nous accédons enfin sur le dashboard de l'instance, qui présente quelques statistiques (le nombre de requête par seconde, le type de requêtes, le nombre de connexions, mémoire, CPU, etc...)
A savoir que par défaut ArangoDB choisit l'architecture "single instance", si on avait choisit le mode "cluster" nous aurions eu des statistiques sur les noeuds le composant (Coordinator, DB SErver, Agency) ainsi que leur endpoint;


# La suite
Dans la partie 2 de cette article nous allons créer une base de donnée ArongoDB, avec plusieurs collections de différents types de données (Document, Graphe,..) et commencer à voir comment les requêter via le language AQL.
