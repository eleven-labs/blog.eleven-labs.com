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

Par simplicité, nous nommerons Spark pour désigner Apache Spark.

## Mise en situation

Rentrons dans le vif du sujet avec un cas concret. Je veux importer les données sur le nombre de passage de vélo sur un point données afin d'effectuer une étude sur l'usage du vélo en ville.

Prenons par exemple la ville de Nantes qui met à disposition un jeu de données https://data.nantesmetropole.fr/explore/dataset/244400404_comptages-velo-nantes-metropole/information

Nous prenons ce fichier et le déposons dans le dossier `source/244400404_comptages-velo-nantes-metropole.csv`.

Voici un échantillon du fichier

```csv
﻿Numéro de boucle;Libellé;Total;Probabilité de présence d'anomalies;Jour de la semaine;Boucle de comptage;Date formatée;Vacances
0674;Pont Haudaudine vers Sud;657;;2;0674 - Pont Haudaudine vers Sud;2021-03-16;Hors Vacances
0674;Pont Haudaudine vers Sud;689;;4;0674 - Pont Haudaudine vers Sud;2021-03-18;Hors Vacances
0674;Pont Haudaudine vers Sud;589;;5;0674 - Pont Haudaudine vers Sud;2021-03-26;Hors Vacances
```

## Installation d'Apache Spark

Il existe plusieurs façon d'install Apache Spark : soit en prenant le binaire, soit avec Docker avec [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/).

Nous allons effectuer l'installation avec le binaire Spark. Ce processus est plus long et complexe, mais il est intéressant car il permet de mieux comprendre les différents éléments.

Il sera nécessaire d'avoir au moins Python 3.8 et Java 17.

Pour installer Java Runtime sous Ubuntu

```shell
sudo apt install openjdk-17-jre-headless
```

### Installer le binaire Apache Spark

Aller sur la page de Téléchargement [https://spark.apache.org/downloads.html](https://spark.apache.org/downloads.html) et télécharger le package en tgz. Prenez la dernière version disponible.

Une fois téléchargé, décomppresser dans un dossier, par exemple `~/Apps/spark`.

Dans le fichier `.bashrc`, ajouter une variable d'environnement qui pointera vers le dossier du binaire Spark.

```
# cat ~/.bashrc
export SPARK_HOME=~/Apps/spark/spark-3.5.1-bin-hadoop3
```

Vous êtes prêt. Il restera à installer le package Python qui permet de manipuler Spark

### Installation de PySpark

PySpark est une bibliothèque en Python qui fait la correspondance vers les appels Java Spark.

Dans notre dossier qui contient le projet, nous avons au préalable créé un environnement virtuel.

```shell
virtualenv venv
. venv/bin/activate
```

Une fois l'environnement virtual activé, nous pouvons installer pyspark.

```shell
pip install pyspark
```

PySpark est installé !

## Lecture de la donnée source

Pour lire la donnée source avec pyspark, il faut tout d'abord créer une session Spark.

Cette session Spark va piloter les différents travaux à effectuer.

```python
from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("Bike calculation").getOrCreate()
```

Ensuite, nous instruire le chargement du fichier CSV.

Le fichier contient un en-tête et le caractère de séparation est un point-virgule. Il sera nécessaire de le spécifier lors du chargement.

```python
source_file = "source/244400404_comptages-velo-nantes-metropole.csv"
df = spark.read.format("csv").option("delimiter", ";").option("header", True).load(source_file)
```

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
La nom de la variable `df` signifie Dataframe. Avec Spark, une fois la donnée chargé, nous manipulons des dataframes.
</div>

On peut ajouter les instructions `.show()` et `.printSchema()` pour afficher les premiers éléments.

```python
df.printSchema()
df.show()
```

Vous pouvez dès à présent exécuter le fichier pour voir le résultat.

```shell
(venv) [thierry@travail:~/eleven/data]
% python main.py
24/06/26 16:59:07 WARN Utils: Your hostname, travail resolves to a loopback address: 127.0.1.1; using 10.0.12.31 instead (on interface enp0s31f6)
24/06/26 16:59:07 WARN Utils: Set SPARK_LOCAL_IP if you need to bind to another address
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
24/06/26 16:59:08 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
root
 |-- Numéro de boucle: string (nullable = true)
 |-- Libellé: string (nullable = true)
 |-- Total: string (nullable = true)
 |-- Probabilité de présence d'anomalies: string (nullable = true)
 |-- Jour de la semaine: string (nullable = true)
 |-- Boucle de comptage: string (nullable = true)
 |-- Date formatée: string (nullable = true)
 |-- Vacances: string (nullable = true)

+----------------+--------------------+-----+-----------------------------------+------------------+--------------------+-------------+--------------------+
|Numéro de boucle|             Libellé|Total|Probabilité de présence d'anomalies|Jour de la semaine|  Boucle de comptage|Date formatée|            Vacances|
+----------------+--------------------+-----+-----------------------------------+------------------+--------------------+-------------+--------------------+
|            0674|Pont Haudaudine v...|  657|                               null|                 2|0674 - Pont Hauda...|   2021-03-16|       Hors Vacances|
|            0674|Pont Haudaudine v...|  689|                               null|                 4|0674 - Pont Hauda...|   2021-03-18|       Hors Vacances|
|            0674|Pont Haudaudine v...|  589|                               null|                 5|0674 - Pont Hauda...|   2021-03-26|       Hors Vacances|
|            0674|Pont Haudaudine v...|  591|                               null|                 4|0674 - Pont Hauda...|   2021-04-15|       Hors Vacances|
|            0674|Pont Haudaudine v...|  481|                               null|                 2|0674 - Pont Hauda...|   2021-05-04|Vacances de print...|
|            0674|Pont Haudaudine v...|  583|                               null|                 1|0674 - Pont Hauda...|   2021-05-10|       Hors Vacances|
|            0674|Pont Haudaudine v...|  421|                               null|                 6|0674 - Pont Hauda...|   2021-05-22|       Hors Vacances|
|            0674|Pont Haudaudine v...|  279|                               null|                 7|0674 - Pont Hauda...|   2021-05-23|       Hors Vacances|
|            0674|Pont Haudaudine v...|  512|                               null|                 6|0674 - Pont Hauda...|   2021-06-12|       Hors Vacances|
|            0674|Pont Haudaudine v...|  338|                               null|                 7|0674 - Pont Hauda...|   2021-06-13|       Hors Vacances|
|            0674|Pont Haudaudine v...|  948|                               null|                 2|0674 - Pont Hauda...|   2021-06-15|       Hors Vacances|
|            0674|Pont Haudaudine v...|  688|                               null|                 1|0674 - Pont Hauda...|   2021-06-21|       Hors Vacances|
|            0674|Pont Haudaudine v...|  381|                               null|                 6|0674 - Pont Hauda...|   2021-07-10|      Vacances d'été|
|            0674|Pont Haudaudine v...|  413|                               null|                 6|0674 - Pont Hauda...|   2021-07-17|      Vacances d'été|
|            0674|Pont Haudaudine v...|  648|                               null|                 5|0674 - Pont Hauda...|   2021-07-23|      Vacances d'été|
|            0675|Pont Haudaudine v...|  541|                               null|                 3|0675 - Pont Hauda...|   2021-01-06|       Hors Vacances|
|            0675|Pont Haudaudine v...|  549|                               null|                 4|0675 - Pont Hauda...|   2021-01-07|       Hors Vacances|
|            0675|Pont Haudaudine v...|  520|                               null|                 1|0675 - Pont Hauda...|   2021-01-18|       Hors Vacances|
|            0675|Pont Haudaudine v...|  184|                               null|                 7|0675 - Pont Hauda...|   2021-01-24|       Hors Vacances|
|            0675|Pont Haudaudine v...|  418|                               null|                 1|0675 - Pont Hauda...|   2021-02-01|       Hors Vacances|
+----------------+--------------------+-----+-----------------------------------+------------------+--------------------+-------------+--------------------+
only showing top 20 rows
```

La lecture s'est bien passé. Nous retrouvons toutes les colonnes attendue. Passons à la transformation.

## Transformation de la données

Avant de stocker notre donnée à un endroit, nous pouvons faire quelques transformation élémentaire. Dans une architecture orienté Datalake, la donnée est très peu transformé lorsqu'il est stocké dans le lac de donnée. Dans ce paradigme, ce sont les consommateurs qui vont transformer cette donnée pour donner de la valeur. Par exemple, effectuer une aggrégation pour ensuite la consommer sur un outil de Data Visualisation (aka DataViz).

D'après les premières observations,
- la colonne "Boucle de comptage" semble être une concaténation de "Numéro de boucle" et "Libellé"
- la colonne "Date formatée" semble être une date
- la colonne "Jour de la semaine" est extrapolé depuis la colonne "Date formatée"

Je vais conserver les colonnes qui m'interesse et typer les colonnes. Je prévois de les stocker au format parquet car ça va me permettre de conserver le typage des colonnes, et d'effectuer un partitionnement par jour.

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
Un Dataframe est un objet immutable. Lors de l'ajout d'instruction, une nouvelle instance de Dataframe est renvoyé.
</div>
