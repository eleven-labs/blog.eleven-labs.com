---
contentType: article
lang: fr
date: '2025-03-05'
slug: delta-lake-avec-apache-spark
title: Delta Lake avec Apache Spark
excerpt: >-
  Il existe différent format de fichier pour stocker la donnée : parquet, avro, csv. Connaissez-vous le format Delta Lake ? Découvrons les fonctionnalités de ce format.
categories:
  - architecture
authors:
  - tthuon
keywords:
- apache spark
- data
- big data
- delta lake
cover:
  alt: Delta Lake avec Apache Spark
  path: /imgs/articles/2025-03-05-delta-lake-avec-apache-spark/cover.jpg
seo:
  title: "Delta Lake avec Apache Spark"
  description: "Delta Lake : Optimisez vos coûts de stockage tout en ayant le principe ACID des bases de données"
---

## Qu'est ce que le format de fichier Delta Lake ?

Initié par les créateur du moteur [Apache Spark](/fr/demarrer-apache-spark/), et également de la solution SaaS [Databricks](https://www.databricks.com/fr), ce format est une surcouche au format [parquet](https://parquet.apache.org/). Il apporte le concept [ACID](https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID) (Atomicité, Cohérence, Isolation et Durabilité) sur les fichiers parquet dans du stockage de type objet (tel que [Google Cloud Storage](https://cloud.google.com/storage/), [AWS S3](https://aws.amazon.com/fr/s3/)). Ansi, nous pouvons bénéficier d'un stockage à très bas coût et les bénéfices d'une table dans une base de données (en particulier la notion ACID).

## Les bénéfices d'utiliser Delta Lake

Comme vu précédemment, il y a la notion de transaction ACID, à cela s'ajoute les avantages suivants :
- capacité à ingérer des données par lot ou en flux continu
- contraindre la table à suivre un schéma
- navigation dans le temps avec des versions
- mise à jour en upsert et delete de la table

Le format _Delta Lake_ se veut être les fondations d'une architecture de type _[Lakehouse](https://www.databricks.com/fr/glossary/data-lakehouse)_. L'industrie de la data évolue vers cette architecture afin de réduire drastriquement les coûts, et cela permet également de réduire la barrière entre les différents utilisateurs. Avec l'avènement de l'intelligence artificielle, les équipes _Data Scientiest_ ont besoin d'accéder à de la données fraîche.

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

Ainsi que le contenu du fichier `source/244400404_comptages-velo-nantes-metropole.csv`
```text
Numéro de boucle;Libellé;Total;Probabilité de présence d'anomalies;Jour de la semaine;Boucle de comptage;Date formatée;Vacances
0674;Pont Haudaudine vers Sud;657;;2;0674 - Pont Haudaudine vers Sud;2021-03-16;Hors Vacances
0674;Pont Haudaudine vers Sud;689;;4;0674 - Pont Haudaudine vers Sud;2021-03-18;Hors Vacances
0674;Pont Haudaudine vers Sud;589;;5;0674 - Pont Haudaudine vers Sud;2021-03-26;Hors Vacances
```

Nous allons donner à la session Spark la configuration nécessaire. D'une part, nous allons lui donner les dépendances, et d'autre part la configuration.

Télécharger les jars dans un dossier `jars/`
- [delta-spark 3.2.0](https://repo1.maven.org/maven2/io/delta/delta-spark_2.12/3.2.0/delta-spark_2.12-3.2.0.jar)
- [delta-storage 3.2.0](https://repo1.maven.org/maven2/io/delta/delta-storage/3.2.0/delta-storage-3.2.0.jar)

Ajoutons les jars dans un premier temps à la session Spark.

```python
spark = (
    SparkSession
    .builder
    .appName("Bike calculation")
    .config("spark.jars", "jars/delta-spark_2.12-3.2.0.jar,jars/delta-storage-3.2.0.jar")
    .getOrCreate()
)
```

Ensuite, ajoutons la configuration pour pouvoir utiliser le format _Delta Lake_.

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

Votre session Spark est prêt pour utiliser le format _Delta Lake_.

## Enregistrement de la table en delta

Lors de l'écriture de la table dans le dossier `datalake/`, il faut changer le format de fichier pour __delta__.

```python
df_clean.write.format("delta").partitionBy("date").save("datalake/count-bike-nantes")
```

Voilà, votre table est maintenant enregistré format delta.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Si vous relancez le script, vous allez avoir une erreur car le répertoire existe déjà. Soit vous supprimez le dossier, soit vous ajoutez l'option `mode("overwrite")` pour écraser la table existante.
</div>

## Mise à jour de la table

Il y a eu une mise à jour de la source de données. Il faut donc les intégrer. Pour cela, nous allons utiliser la fonction `merge()` de la lib Python _Delta Lake_.

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

Nous effectuons toujours notre calcul avec notre nouveau fichier source. Ensuite, nous avons besoin de lire notre table de destination. Généralement, cette table est qualifié de _Gold_ (Or) car c'est une table avec des données agrégés et à forte valeur.

Voici le nouveau fichier à ingérer avec les nouvelles données. Il y a une mise à jour et une nouvelle ligne.

```text
Numéro de boucle;Libellé;Total;Probabilité de présence d'anomalies;Jour de la semaine;Boucle de comptage;Date formatée;Vacances
0674;Pont Haudaudine vers Sud;1890;;5;0674 - Pont Haudaudine vers Sud;2021-03-26;Hors Vacances
0674;Pont Haudaudine vers Sud;689;;4;0674 - Pont Haudaudine vers Sud;2021-03-27;Hors Vacances
```

Mettons à jour la variable `source_file` pour lire le nouveau fichier. Ajoutons le code pour lire la table Gold en _Delta Lake_.

```python
source_file = "source/nouveau_comptages-velo-nantes-metropole.csv"

(...)

# Lecture de la table Gold
from delta import DeltaTable
delta_table = DeltaTable.forPath(spark, "datalake/count-bike-nantes")

# Commenter cette dernière ligne
# df_clean.write.format("delta").partitionBy("date").save("datalake/count-bike-nantes")
```

Appliquons la fonction `merge()` pour fusionner les deux _DataFrame_.

```python
(
  delta_table
  .alias("gold_table")
  .merge(
    df_clean.alias("fresh_data"),
    condition="fresh_data.loop_number = gold_table.loop_number and fresh_data.date = gold_table.date"
  )
  .whenMatchedUpdateAll()
  .whenNotMatchedInsertAll()
  .execute()
)
```

La fonction `merge()` prend en entrée un _[DataFrame](https://spark.apache.org/docs/3.5.0/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)_ avec lequel faire la comparaison. Ensuite, nous avons une condition de correspondance entre les deux _DataFrame_. Avec `fresh_data.loop_number = gold_table.loop_number and fresh_data.date = gold_table.date`, la comparaison entre les deux _DataFrame_ est effectué sur la colonne `date` et `loop_number`. Il faut que la condition de correspondance soit discriminante afin de ne faire ressortir qu'une ligne : c'est le cas pour les deux colonnes que nous avons sélectionné.

Ensuite, des conditions de merge sont appliqués :
- `whenMatchedUpdateAll()`, s'il existe une correspondance entre les deux _DataFrame_ sur ces clefs, alors la ligne dans le _DataFrame_ de destination (la gold) est mise à jour.
- `whenNotMatchedInsertAll()`, s'il n'existe pas de correspondance entre les deux _DataFrame_ sur ces clefs, alors la ligne dans le _DataFrame_ de destination (la gold) est ajoutée. destination.

Enfin, la fonction `execute()` va appliquer les modifications.

Avant l'exécution, nous avons ces données :

```text
+-----------+--------------------+-----+----------+-------------+
|loop_number|               label|total|      date| holiday_name|
+-----------+--------------------+-----+----------+-------------+
|       0674|Pont Haudaudine v...|  689|2021-03-18|Hors Vacances|
|       0674|Pont Haudaudine v...|  589|2021-03-26|Hors Vacances|
|       0674|Pont Haudaudine v...|  657|2021-03-16|Hors Vacances|
+-----------+--------------------+-----+----------+-------------+
```

Après l'exécution, la table est à jour :

```text
+-----------+--------------------+-----+----------+-------------+
|loop_number|               label|total|      date| holiday_name|
+-----------+--------------------+-----+----------+-------------+
|       0674|Pont Haudaudine v...|  689|2021-03-18|Hors Vacances|
|       0674|Pont Haudaudine v...|  657|2021-03-16|Hors Vacances|
|       0674|Pont Haudaudine v...| 1890|2021-03-26|Hors Vacances|
|       0674|Pont Haudaudine v...|  689|2021-03-27|Hors Vacances|
+-----------+--------------------+-----+----------+-------------+
```

En quelques lignes, votre table sera facilement mis à jour. En fonction de votre besoin métier, ajustez les conditons de merge.

## Revenir à une version précédente

En plus de respecter les principes ACID, le format _Delta Lake_ a d'autre fonctionnalité tel que le retour en arrière.

Ainsi, si je souhaite annuler une opération, je peux revenir à une version précédente de la table.

Dans un nouveau script, `rollback.py`, ajouter le code suivant qui permet de lister les différentes version de la table.

```python
from delta import DeltaTable
from pyspark.sql import SparkSession

spark = (
  SparkSession.builder.appName("Bike calculation")
  .config(
    "spark.jars", "jars/delta-spark_2.12-3.2.0.jar,jars/delta-storage-3.2.0.jar"
  )
  .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
  .config(
    "spark.sql.catalog.spark_catalog",
    "org.apache.spark.sql.delta.catalog.DeltaCatalog",
  )
  .getOrCreate()
)

delta_table = DeltaTable.forPath(spark, "datalake/count-bike-nantes")
delta_table.history().show()
```

Nous avons bien deux versions.

```text
+-------+--------------------+------+--------+---------+--------------------+----+--------+---------+-----------+--------------+-------------+--------------------+------------+--------------------+
|version|           timestamp|userId|userName|operation| operationParameters| job|notebook|clusterId|readVersion|isolationLevel|isBlindAppend|    operationMetrics|userMetadata|          engineInfo|
+-------+--------------------+------+--------+---------+--------------------+----+--------+---------+-----------+--------------+-------------+--------------------+------------+--------------------+
|      1|2025-01-30 14:43:...|  NULL|    NULL|    MERGE|{predicate -> ["(...|NULL|    NULL|     NULL|          0|  Serializable|        false|{numTargetRowsCop...|        NULL|Apache-Spark/3.5....|
|      0|2025-01-30 14:42:...|  NULL|    NULL|    WRITE|{mode -> ErrorIfE...|NULL|    NULL|     NULL|       NULL|  Serializable|         true|{numFiles -> 3, n...|        NULL|Apache-Spark/3.5....|
+-------+--------------------+------+--------+---------+--------------------+----+--------+---------+-----------+--------------+-------------+--------------------+------------+--------------------+
```

Pour revenir à la version zéro, j'applique la fonction `restoreToVersion()` avec le numéro de version souhaité.

```python
delta_table.restoreToVersion(0)
```

En consultant de nouveau l'historique de la table, il y a une entrée de type _RESTORE_. Ainsi, si je lis de nouveau la table, je serais bien à la version avec les données du début de l'article.

Historique de la table :

```text
+-------+--------------------+------+--------+---------+--------------------+----+--------+---------+-----------+--------------+-------------+--------------------+------------+--------------------+
|version|           timestamp|userId|userName|operation| operationParameters| job|notebook|clusterId|readVersion|isolationLevel|isBlindAppend|    operationMetrics|userMetadata|          engineInfo|
+-------+--------------------+------+--------+---------+--------------------+----+--------+---------+-----------+--------------+-------------+--------------------+------------+--------------------+
|      2|2025-01-30 14:44:...|  NULL|    NULL|  RESTORE|{version -> 0, ti...|NULL|    NULL|     NULL|          1|  Serializable|        false|{numRestoredFiles...|        NULL|Apache-Spark/3.5....|
|      1|2025-01-30 14:43:...|  NULL|    NULL|    MERGE|{predicate -> ["(...|NULL|    NULL|     NULL|          0|  Serializable|        false|{numTargetRowsCop...|        NULL|Apache-Spark/3.5....|
|      0|2025-01-30 14:42:...|  NULL|    NULL|    WRITE|{mode -> ErrorIfE...|NULL|    NULL|     NULL|       NULL|  Serializable|         true|{numFiles -> 3, n...|        NULL|Apache-Spark/3.5....|
+-------+--------------------+------+--------+---------+--------------------+----+--------+---------+-----------+--------------+-------------+--------------------+------------+--------------------+
```

Contenu de la table :

```text
+-----------+--------------------+-----+----------+-------------+
|loop_number|               label|total|      date| holiday_name|
+-----------+--------------------+-----+----------+-------------+
|       0674|Pont Haudaudine v...|  657|2021-03-16|Hors Vacances|
|       0674|Pont Haudaudine v...|  589|2021-03-26|Hors Vacances|
|       0674|Pont Haudaudine v...|  689|2021-03-18|Hors Vacances|
+-----------+--------------------+-----+----------+-------------+
```

La gestion des versions dans _Delta Lake_ permet de facilement retourner en arrière en cas d'erreur.

## Conclusion

A travers cet article, nous avons découvert un format de fichier qui permet de stocker des données comme dans une base de données traditionnelle. Elle facilite la manipulation et la mise à jour des tables grâce à la fonction de `merge()`. Les fonctionnalités d'historique et de retour en arrière offre une sécurité pour supplémentaire en cas d'erreur de manipulation. Il est alors aisé de faire un retour en arrière.

Alors n'hésitez plus un instant et utilisez _Delta Lake_.

## Références

- https://fr.wikipedia.org/wiki/Propri%C3%A9t%C3%A9s_ACID
- https://www.databricks.com/fr/glossary/data-lakehouse
- https://parquet.apache.org/
- https://delta.io/
- https://docs.delta.io/latest/quick-start.html#set-up-apache-spark-with-delta-lake
- https://docs.delta.io/latest/quick-start.html#python
- https://docs.delta.io/latest/delta-update.html#upsert-into-a-table-using-merge

Code complet

```python
# main.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.types import IntegerType, DateType

spark = (
    SparkSession.builder.appName("Bike calculation")
    .config(
        "spark.jars", "jars/delta-spark_2.12-3.2.0.jar,jars/delta-storage-3.2.0.jar"
    )
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config(
        "spark.sql.catalog.spark_catalog",
        "org.apache.spark.sql.delta.catalog.DeltaCatalog",
    )
    .getOrCreate()
)

source_file = "source/nouveau_comptages-velo-nantes-metropole.csv"
df = (
    spark.read.format("csv")
    .option("delimiter", ";")
    .option("header", True)
    .load(source_file)
)

df_clean = df.select(
    col("Numéro de boucle").alias("loop_number"),
    col("Libellé").alias("label"),
    col("Total").cast(IntegerType()).alias("total"),
    col("Date formatée").cast(DateType()).alias("date"),
    col("Vacances").alias("holiday_name"),
).where(col("Probabilité de présence d'anomalies").isNull())

from delta import DeltaTable

delta_table = DeltaTable.forPath(spark, "datalake/count-bike-nantes")

(
    delta_table.alias("gold_table")
    .merge(
        df_clean.alias("fresh_data"),
        condition="fresh_data.loop_number = gold_table.loop_number and fresh_data.date = gold_table.date",
    )
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .execute()
)

# df_clean.write.format("delta").partitionBy("date").save("datalake/count-bike-nantes")
```

```python
# rollback.py
from delta import DeltaTable
from pyspark.sql import SparkSession

spark = (
    SparkSession.builder.appName("Bike calculation")
    .config(
        "spark.jars", "jars/delta-spark_2.12-3.2.0.jar,jars/delta-storage-3.2.0.jar"
    )
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config(
        "spark.sql.catalog.spark_catalog",
        "org.apache.spark.sql.delta.catalog.DeltaCatalog",
    )
    .getOrCreate()
)

delta_table = DeltaTable.forPath(spark, "datalake/count-bike-nantes")
delta_table.history().show()
delta_table.restoreToVersion(0)
```
