---
contentType: article
lang: fr
date: '2024-07-12'
slug: demarrer-apache-spark
title: Démarrer avec Apache Spark étape par étape
excerpt: >-
  Le domaine de la data est présent dans le quotidien de chacun : la majorité de nos actions peut être traduite en données. Le volume croissant de ces données exploitables a un nom : "Big Data".
  Dans cet article, nous verrons comment exploiter ce "Big data" à l'aide du framework Apache Spark.
categories: [architecture]
authors:
  - tthuon
keywords: [
- apache spark
- data
- big data
  ]
---

Lorsque l'on travaille dans l'univers de la data, nous effectuons principalement trois grands types de tâches :
- extraire la donnée de la source
- la transformer pour lui donner de la valeur
- stocker le résultat

Ces trois étapes constituent ce que l'on appelle un "pipeline ETL", pour : Extract, Transform, Load (Extraire, Transformer, Charger).

Il existe une multitude de façons d'effectuer ces tâches, mais dans cet article, nous allons nous concentrer sur comment le faire avec Apache Spark.

Apache Spark est un framework qui permet de manipuler et transformer la données, et qui s'appuie sur le framework Hadoop pour distribuer les calculs sur les différents noeuds du cluster.

[https://spark.apache.org/](https://spark.apache.org/)

Par simplicité, dans la suite de cet article nous utiliserons le nom "Spark" pour désigner Apache Spark.

## Étape 1 : Récupération d'une source de données

Rentrons dans le vif du sujet avec un cas concret. Je veux importer les données sur le nombre de passages de vélo à un point géographique donné afin d'effectuer une étude sur l'usage du vélo en ville.

Prenons par exemple la ville de Nantes qui met à disposition un jeu de données https://data.nantesmetropole.fr/explore/dataset/244400404_comptages-velo-nantes-metropole/information.

Nous prenons ce fichier et nous le déposons ensuite dans le dossier `source/244400404_comptages-velo-nantes-metropole.csv`.

Voici un échantillon du fichier en question :

```csv
﻿Numéro de boucle;Libellé;Total;Probabilité de présence d'anomalies;Jour de la semaine;Boucle de comptage;Date formatée;Vacances
0674;Pont Haudaudine vers Sud;657;;2;0674 - Pont Haudaudine vers Sud;2021-03-16;Hors Vacances
0674;Pont Haudaudine vers Sud;689;;4;0674 - Pont Haudaudine vers Sud;2021-03-18;Hors Vacances
0674;Pont Haudaudine vers Sud;589;;5;0674 - Pont Haudaudine vers Sud;2021-03-26;Hors Vacances
```

## Étape 2 : Installation d'Apache Spark

Il existe plusieurs façons d'installer Apache Spark : soit en prenant le binaire, soit avec Docker avec [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/).

Nous allons effectuer l'installation avec le binaire Spark. Biern que ce processus soit plus long et complexe, il est plus intéressant car il nous permet de mieux comprendre les différents éléments qui le constituent.

Notez que pour l'installation, il sera nécessaire d'avoir au moins Python 3.8 et Java 17.

Voici la commande pour installer Java Runtime sous Ubuntu :

```shell
sudo apt install openjdk-17-jre-headless
```

### Installer le binaire Apache Spark

Allez sur la page de téléchargement [https://spark.apache.org/downloads.html](https://spark.apache.org/downloads.html) et téléchargez le package en tgz. Prenez la dernière version disponible (il s'agit de la 3.5.1 au moment de l'écriture de l'article).

Une fois téléchargé, décomppressez le tout dans un dossier, par exemple `~/Apps/spark`.

Dans le fichier `.bashrc`, ajoutez une variable d'environnement qui pointera vers le dossier du binaire Spark.

```text
# ~/.bashrc
export SPARK_HOME=~/Apps/spark/spark-3.5.1-bin-hadoop3
```

Vous êtes prêt ! Il ne restera qu'à installer le package Python qui permet de manipuler Spark.

### Installation de PySpark

PySpark est une bibliothèque en Python qui fait la correspondance vers les appels Java Spark.

Dans notre dossier qui contient le projet, nous avons au préalable créé un environnement virtuel.

```shell
virtualenv venv
. venv/bin/activate
```

Une fois l'environnement virtuel activé, nous pouvons installer pyspark.

```shell
pip install pyspark==3.5.1
```

Ça y est, PySpark est installé !

## Étape 3 : Création de notre pipeline ETL avec Apache Spark

Nous allons effectuer les 3 étapes de notre pipeline
- extraire la données de la source
- la transformer pour lui donner de la valeur
- stocker le résultat 

### Lecture de la donnée source

Pour lire la donnée source avec pyspark, il faut tout d'abord créer une session Spark.

Cette session Spark va piloter les différents travaux à effectuer.

```python
from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("Bike calculation").getOrCreate()
```

Ensuite, nous allons instruire le chargement du fichier CSV.

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
(...)
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

La lecture s'est bien passée. Nous retrouvons toutes les colonnes attendues ! 
Passons maintenant à la transformation.

### Transformation de la donnée

Avant de stocker notre donnée à un endroit, nous pouvons faire quelques transformations élémentaires. Dans un paradigme d'architecture orienté Datalake, la donnée est très peu transformée, car ce sont les consommateurs qui vont transformer cette donnée pour lui donner de la valeur. Par exemple : effectuer une aggrégation, puis ensuite la consommer sur un outil de Data Visualisation (aka DataViz).

Dnas notre exemple, d'après les premières observations :
- la colonne "Boucle de comptage" semble être une concaténation de "Numéro de boucle" et "Libellé"
- la colonne "Date formatée" semble être une date
- la colonne "Jour de la semaine" est extrapolée depuis la colonne "Date formatée"
- la colonne "Probabilité de présence d'anomalies" indique si la ligne est de qualité ou non

Nous allons conserver les colonnes qui nous intéressent et typer les colonnes. Nous allons prévoir de les stocker au format parquet car cela permet de conserver le typage des colonnes, et d'effectuer un partitionnement par jour.

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
Un Dataframe est un objet immutable. Lors de l'ajout d'instruction, une nouvelle instance de Dataframe est renvoyée.
</div>

Voici la transformation

```python
df_clean = (
    df.select(
        col("Numéro de boucle").alias("loop_number"),
        col("Libellé").alias("label"),
        col("Total").cast(IntegerType()).alias("total"),
        col("Date formatée").cast(DateType()).alias("date"),
        col("Vacances").alias("holiday_name"),
    )
    .where(col("Probabilité de présence d'anomalies").isNull())
)
df_clean.show()
```

Et le résultat :

```shell
(venv) [thierry@travail:~/eleven/data]
% python main.py
+-----------+--------------------+-----+----------+--------------------+
|loop_number|               label|total|      date|        holiday_name|
+-----------+--------------------+-----+----------+--------------------+
|       0674|Pont Haudaudine v...|  657|2021-03-16|       Hors Vacances|
|       0674|Pont Haudaudine v...|  689|2021-03-18|       Hors Vacances|
|       0674|Pont Haudaudine v...|  589|2021-03-26|       Hors Vacances|
|       0674|Pont Haudaudine v...|  591|2021-04-15|       Hors Vacances|
|       0674|Pont Haudaudine v...|  481|2021-05-04|Vacances de print...|
|       0674|Pont Haudaudine v...|  583|2021-05-10|       Hors Vacances|
+-----------+--------------------+-----+----------+--------------------+
```

### Stockage du résultat en Parquet

Nous allons stocker le résultat au format parquet. Ce format offre l'avantage de : 
- stocker la données en colonnes
- conserver le typage des colonnes
- partitionner les données pour optimiser les requêtes

Pour cela, il faut faire appel au DataFrameWriter. Le support du format parquet est natif.

```python
df_clean.write.format("parquet").partitionBy("date").save("datalake/count-bike-nantes.parquet")
```

Ainsi, dans l'arboresence, nous avons nos données partitionnées par date.

## Conclusion

Bravo, vous venez de créer votre premier pipeline Spark. Un nouveau monde s'ouvre à vous. À travers cet article, nous avons vu l'installation de Spark et PySpark. Avec la création du pipeline, nous avons lu la source de données, effectué quelques transformations, et enfin stocké la donnée à un endroit défini. Ce stockage permettra à d'autre corps de métier de la data de l'exploiter.

## Références

Code complet 

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.types import IntegerType, DateType

spark = SparkSession.builder.appName("Bike calculation").getOrCreate()

source_file = "source/244400404_comptages-velo-nantes-metropole.csv"
df = spark.read.format("csv").option("delimiter", ";").option("header", True).load(source_file)

df_clean = (
    df.select(
        col("Numéro de boucle").alias("loop_number"),
        col("Libellé").alias("label"),
        col("Total").cast(IntegerType()).alias("total"),
        col("Date formatée").cast(DateType()).alias("date"),
        col("Vacances").alias("holiday_name"),
    )
    .where(col("Probabilité de présence d'anomalies").isNull())
)

df_clean.write.format("parquet").partitionBy("date").save("datalake/count-bike-nantes.parquet")
```

