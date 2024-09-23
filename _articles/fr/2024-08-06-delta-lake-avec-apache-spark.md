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

Initié par les créateur du moteur Apache Spark, et également de la solution SaaS Databricks, ce format est une surcouche au format parquet. Il apporte le concept ACID (Atomicité, Cohérence, Isolation et Durabilité) sur les fichiers parquet dans du stockage de type objet (Google Cloud Storage, AWS S3). Ansi, nous pouvons bénéficier d'un stockage à très bas coût et les bénéfices d'une table dans une base de données (en particulier la notion ACID).

## Les bénéfices d'utiliser Delta Lake

Comme vu précédemment, il y a la notion de transaction ACID, à cela s'ajoute les avantages suivants : 
- capacité à ingérer des données par lot ou en flux continu
- Contraindre la table à suivre un schéma
- Navigation dans le temps avec des versions
- Mise à jour en upsert et delete de la table

Le format Delta Lake se veut être les fondations d'une architecture de type _Data Lake_. L'industrie de la data évolue vers cette architecture afin de réduire drastriquement les coûts, et cela permet également de réduire la barrière entre les différents utilisateurs. Avec l'avènement de l'intelligence artificielle, les équipes _Data Scientiest_ ont besoin d'accéder à de la données fraîche et proche de la production.

## Installer et configuration Spark pour utiliser Delta Lake

Notre code 

```python
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col, lit
from pyspark.sql.types import IntegerType, DateType

spark = SparkSession.builder.appName("Bike calculation").getOrCreate()

source_file = "source/244400404_comptages-velo-nantes-metropole.csv"
df = spark.read.format("csv").option("delimiter", ";").option("header", True).load(source_file)


def transformation(df: DataFrame) -> DataFrame:
    return (
        df.select(
            col("Numéro de boucle").alias("loop_number"),
            col("Libellé").alias("label"),
            col("Total").cast(IntegerType()).alias("total"),
            col("Date formatée").cast(DateType()).alias("date"),
            col("Vacances").alias("holiday_name"),
        )
        .where(col("Probabilité de présence d'anomalies") == lit(""))
    )


transformation(df).write.format("parquet").partitionBy("date").save("datalake/count-bike-nantes.parquet")
```

Nous allons donner à la session Spark la configuration nécessaire. D'une part nous allons lui donner les dépendances, et d'autre part la configuration.

Télécharger les jars dans un dossier `jars/`
- [delta-spark 3.2.0](https://repo1.maven.org/maven2/io/delta/delta-spark_2.12/3.2.0/delta-spark_2.12-3.2.0.jar)
- [delta-storage 3.2.0](https://repo1.maven.org/maven2/io/delta/delta-storage/3.2.0/delta-storage-3.2.0.jar)

Ajoutons les jars dans un premier temps. Soit Spark va les télécharger, soit nous les fournissons. Dans nos exemples, nous allons le fournir.

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
transformation(df).write.format("delta").partitionBy("date").save("datalake/count-bike-nantes")
```

Voilà, votre table est au format delta.

## Mise à jour de la table

Installer le package Python `delta-spark`.

Attention à prendre la version correspondante. Se référer à la matrice de compatibilité.

```shell
pip install delta-spark==3.2.0
```

```python
from delta import DeltaTable

delta_table_path = "datalake/count-bike-nantes"
if DeltaTable.isDeltaTable(spark, delta_table_path):
  dt = DeltaTable.forPath(spark, "datalake/count-bike-nantes")
  transformation(df)
  (
    dt
    .alias("gold_table")
    .merge(transformation(df).alias("fresh_data"), condition="fresh_data.loop_number = gold_table.loop_number")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .whenNotMatchedBySourceDelete()
    .execute()
  )
else:
  transformation(df).write.format("delta").partitionBy("date").save(delta_table_path)
```

## Conclusion


## Références

Code complet 

