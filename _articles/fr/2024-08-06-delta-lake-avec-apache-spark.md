---
contentType: article
lang: fr
date: '2024-08-06'
slug: delta-lake-avec-apache-spark
title: Delta Lake avec Apache Spark
excerpt: >-
  Il existe différent format de fichier pour stocker la donnée : parquet, avro, csv. Connaissez-vous le format Delta Lake ? Découvrons les fonctionnalités de ce format.
categories: [architecture]
authors:
  - tthuon
keywords: 
- apache spark
- data
- big data
- delta lake
---

## Qu'est ce que le format de fichier Delta Lake ?

Initié par les créateur du moteur [Apache Spark](/fr/demarrer-apache-spark/), et également de la solution SaaS [Databricks](https://www.databricks.com/fr), ce format est une surcouche au format [parquet](https://parquet.apache.org/). Il apporte le concept [ACID](https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID) (Atomicité, Cohérence, Isolation et Durabilité) sur les fichiers parquet dans du stockage de type objet (tel que [Google Cloud Storage](https://cloud.google.com/storage/), [AWS S3](https://aws.amazon.com/fr/s3/)). Ansi, nous pouvons bénéficier d'un stockage à très bas coût et les bénéfices d'une table dans une base de données (en particulier la notion ACID).

## Les bénéfices d'utiliser Delta Lake

Comme vu précédemment, il y a la notion de transaction ACID, à cela s'ajoute les avantages suivants : 
- capacité à ingérer des données par lot ou en flux continu
- contraindre la table à suivre un schéma
- navigation dans le temps avec des versions
- mise à jour en upsert et delete de la table

Le format Delta Lake se veut être les fondations d'une architecture de type _[Lakehouse](https://www.databricks.com/fr/glossary/data-lakehouse)_. L'industrie de la data évolue vers cette architecture afin de réduire drastriquement les coûts, et cela permet également de réduire la barrière entre les différents utilisateurs. Avec l'avènement de l'intelligence artificielle, les équipes _Data Scientiest_ ont besoin d'accéder à de la données fraîche.

## Installer et configuration Spark pour utiliser Delta Lake

Reprenons le code de notre précédent article [Démarrer avec Apache Spark étape par étape](/fr/demarrer-apache-spark/).

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

Nous allons donner à la session Spark la configuration nécessaire. D'une part, nous allons lui donner les dépendances, et d'autre part la configuration.

Télécharger les jars dans un dossier `jars/`
- [delta-spark 3.2.0](https://repo1.maven.org/maven2/io/delta/delta-spark_2.12/3.2.0/delta-spark_2.12-3.2.0.jar)
- [delta-storage 3.2.0](https://repo1.maven.org/maven2/io/delta/delta-storage/3.2.0/delta-storage-3.2.0.jar)

Ajoutons les jars dans un premier temps. Soit Spark va les télécharger, soit nous les fournissons. Dans nos exemples, nous allons le lui fournir.

```python
spark = (
    SparkSession
    .builder
    .appName("Bike calculation")
    .config("spark.jars", "jars/delta-spark_2.12-3.2.0.jar,jars/delta-storage-3.2.0.jar")
    .getOrCreate()
)
```

Ensuite, ajoutons la configuration pour pouvoir utiliser le format Delta Lake.

```python
spark = (
    SparkSession
    .builder
    .appName("Bike calculation")
    .config("spark.jars", "jars/delta-spark_2.12-3.2.0.jar,jars/delta-storage-3.2.0.jar")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .getOrCreate()
)
```

Votre session Spark est prêt pour utiliser le format Delta Lake.

## Enregistrement de la table en delta

Lors de l'écriture de la table dans le dossier `datalake/`, il faut changer le format de fichier pour __delta__.

```python
df_clean.write.format("delta").partitionBy("date").save("datalake/count-bike-nantes.parquet")
```

Voilà, votre table est maintenant enregistré format delta.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Si vous relancez le script, vous allez avoir une erreur car le répertoir existe déjà. Soit vous supprimez le dossier, soit vous ajoutez l'option `mode("overwrite")` pour écraser la table existante.
</div>

## Mise à jour de la table

Il y a eu une mise à jour de la source de données. Il faut donc les intégrer. Pour cela, nous allons utiliser la fonction `merge()` de la lib Python Delta Lake. 

Cette fonction va automatiquement faire la mise à jour de la table en fonction des conditions. Si la ligne est nouvelle dans la source, alors elle sera ajouté. Si elle existe déjà et qu'elle a changé, alors la ligne dans la table des destinations elle sera mise à jour.

Voyons en détail son utilisation.

Pour cela, installer le package Python `delta-spark`.

Attention à prendre la version correspondante. Se référer à la matrice de compatibilité https://docs.delta.io/latest/releases.html#compatibility-with-apache-spark.

Dans notre cas, nous avons besoin de la version 3.2.0 car nous utilisons Spark 3.2.0.

```shell
pip install delta-spark==3.2.0
```

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Ajoutez cette dépendance dans votre fichier requirements.txt ou autre gestionnaire de paquet Python.
</div>

```python

```

## Conclusion


## Références

Code complet 

- https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID
- https://www.databricks.com/fr/glossary/data-lakehouse
- https://parquet.apache.org/
- https://delta.io/
- https://docs.delta.io/latest/quick-start.html#set-up-apache-spark-with-delta-lake
- https://docs.delta.io/latest/quick-start.html#python

