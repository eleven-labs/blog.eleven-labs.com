---
contentType: article
lang: fr
date: '2024-07-14'
slug: tester-spark-pytest
title: Tester son script Apache Spark avec pytest
excerpt: >-
  Dans le domaine de la data, la qualité de la données est reine. Il est nécessaire de s'en assurer. Pour poser de bonne fondation,
  il est intéressant de tester unitairement l'algorithme du traitement Spark. Découvrons comment les réalisers.
categories: []
authors:
  - tthuon
keywords: []
---

Dans le précédent article sur [démarrer avec Apache Spark](/fr/demarrer-apache-spark), nous avons créé notre premier script de traitement de la données avec Apache Spark.

Pour s'assurer de la bonne implémentation, nous allons effectuer des tests unitaires.

## Installation de pytest

Dans notre dossier de projet, on va install pytest.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
N'oubliez pas d'activer votre environnement virtuel Python
</div>

```shell
(venv) [thierry@travail:~/eleven/data]
% pip install pytest
```

Avant d'écrire notre premier test, nous allons réorganiser notre code pour le rendre testable. En l'état, il est difficile de le tester.

## Réorganisation du code

Pour rappel, voici le code initial.

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

Nous allons encapsuler le code qui effectue la transformation dans une fonction que nous allons tester.

```python
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import col
from pyspark.sql.types import IntegerType, DateType

spark = SparkSession.builder.appName("Bike calculation").getOrCreate()

source_file = "source/244400404_comptages-velo-nantes-metropole.csv"
df = spark.read.format("csv").option("delimiter", ";").option("header", True).load(source_file)

def transformation(spark: SparkSession, df: DataFrame) -> DataFrame:
  return (
      df.select(
          col("Numéro de boucle").alias("loop_number"),
          col("Libellé").alias("label"),
          col("Total").cast(IntegerType()).alias("total"),
          col("Date formatée").cast(DateType()).alias("date"),
          col("Vacances").alias("holiday_name"),
      )
      .where(col("Probabilité de présence d'anomalies").isNull())
  )

transformation(spark, df).write.format("parquet").partitionBy("date").save("datalake/count-bike-nantes.parquet")
```

Notre code est prêt. Préparons les tests.

## Ecriture du test avec pytest

Notre code est dépendant de Spark. Il est possible de bouchonner cette dépendance, mais c'est une opération assez complexe. 
Le plus simple, selon la [documentation Spark](https://spark.apache.org/docs/latest/api/python/getting_started/testing_pyspark.html#Option-3:-Using-Pytest), est de créer une session Spark dédié.

Initialisons une "fixture" avec la session Spark. Elle sera créé, partagé et détruite automatiquement par pytest.

```python
import pytest

@pytest.fixture
def spark_fixture():
    spark = SparkSession.builder.appName("Testing Bike calculation").getOrCreate()
    yield spark
```

Pour nos tests, nous allons vérifier le schéma du dataframe en sortie de la fonction `transformation()` et vérifier les données.

