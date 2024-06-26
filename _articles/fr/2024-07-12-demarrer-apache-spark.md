---
contentType: article
lang: fr
date: '2024-07-12'
slug: demarrer-apache-spark
title: Démarrer avec Apache Spark
excerpt: >-
  Le domaine de la data est présent au quotidient. La quantité de donnée est si grande que nous la nommons Big Data.
  Dans cet article, nous verrons comment traiter ce volume de données à l'aide du framework Apache Spark.
categories: []
authors:
  - tthuon
keywords: []
---

Lorsque l'on travaille dans l'univers de la data, nous effectuons principalements sur ces trois étapes : 
- extraire la données de la source
- la transformer pour lui donner de la valeur
- stocker le résultat

Ces trois étapes décrivent un pipeline ETL : Extract, Transform, Load (Extraire, Transformer, Charger). 

Il existe une multitude de façon d'effectuer ce travail. Ici, nous utiliserons Apache Spark.

Apache Spark est un framework qui permet de manipuler et transformer la données. Il s'appuie sur le framework Hadoop pour distribuer les calculs sur les différents noeuds du cluster. 

[https://spark.apache.org/](https://spark.apache.org/)

## Mise en situation

Rentrons dans le vif du sujet avec un cas concret. Je veux importer les données sur le nombre de passage de vélo sur un point données afin d'effectuer une étude sur l'usage du vélo en ville.

Prenons par exemple la ville de Nantes qui met à disposition un jeu de données https://data.nantesmetropole.fr/explore/dataset/244400404_comptages-velo-nantes-metropole/information

Nous prenons ce fichier et le déposons dans le dossier `source/244400404_comptages-velo-nantes-metropole.csv`.

## Installation d'Apache Spark

Il existe plusieurs façon d'install Apache Spark : soit en prenant le binaire, soit avec Docker avec [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/).





