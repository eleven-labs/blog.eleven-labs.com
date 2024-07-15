---
contentType: article
lang: fr
date: '2024-07-23'
slug: tester-spark-pytest
title: Tester son script Apache Spark avec pytest
excerpt: >-
  Dans le domaine de la data, la qualité de la données est reine. Il est nécessaire de s'en assurer. Pour poser de bonne fondation,
  il est intéressant de tester unitairement l'algorithme du traitement Spark. Découvrons comment les réalisers.
categories: [architecture]
authors:
  - tthuon
cover:
  alt: Un enfant astronaute qui fait une tour en lego
  path: /imgs/articles/2024-07-23-tester-spark-avec-pytest/cover.jpg
keywords: 
- apache spark
- pytest
- data
---

Dans le précédent article sur [démarrer avec Apache Spark](/fr/demarrer-apache-spark), nous avons créé notre premier script de traitement de la donnée avec Apache Spark.

Pour s'assurer de la bonne implémentation, nous allons effectuer des tests unitaires.

## Installation de pytest

Dans notre dossier de projet, on va installer [pytest](https://docs.pytest.org/).

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
N'oubliez pas d'activer votre environnement virtuel Python avec `. venv/bin/activate`
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

## Écriture du test avec pytest

Notre code est dépendant de Spark. Il est possible de bouchonner cette dépendance, mais c'est une opération assez complexe. 
Le plus simple, selon la [documentation Spark](https://spark.apache.org/docs/latest/api/python/getting_started/testing_pyspark.html#Option-3:-Using-Pytest), est de créer une session Spark dédiée.

Initialisons une_fixture_ avec la session Spark. Elle sera créée, partagée et détruite automatiquement par pytest.

```python
import pytest
from pyspark.sql import SparkSession

@pytest.fixture
def spark_fixture() -> SparkSession:
    spark = SparkSession.builder.appName("Testing Bike calculation").getOrCreate()
    yield spark
```

Nous allons également créer un jeu de données pour notre test. Dans ce Dataframe de test, je vais mettre une ligne avec la colonne "Probabilité de présence d'anomalies" avec une string vide, et une ligne avec une valeur. Cela va nous permettre de tester la condition `where()`.

```python
import datetime

import pytest
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    DateType,
    IntegerType,
)
from pyspark.testing import assertSchemaEqual, assertDataFrameEqual

from main import transformation

@pytest.fixture
def source_fixture(spark_fixture) -> DataFrame:
    return spark_fixture.createDataFrame(
        [
            (
                "0674",
                "Pont Haudaudine vers Sud",
                "657",
                "",
                "2",
                "0674 - Pont Haudaudine vers Sud",
                "2021-03-16",
                "Hors Vacances",
            ),
            (
                "0676",
                "Pont Willy Brandt vers Beaulieu",
                "480",
                "Faible",
                "1",
                "0676 - Pont Willy Brandt vers Beaulieu",
                "2021-05-31",
                "Hors Vacances",
            ),
        ],
        StructType(
            [
                StructField("Numéro de boucle", StringType()),
                StructField("Libellé", StringType()),
                StructField("Total", StringType()),
                StructField("Probabilité de présence d'anomalies", StringType()),
                StructField("Jour de la semaine", StringType()),
                StructField("Boucle de comptage", StringType()),
                StructField("Date formatée", StringType()),
                StructField("Vacances", StringType()),
            ]
        ),
    )
```

Pour nos tests, nous allons vérifier le schéma du dataframe en sortie de la fonction `transformation()` et vérifier les données. La fonction [assertSchemaEqual()](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.testing.assertSchemaEqual.html) nous facilite le test.

```python
import datetime

import pytest
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    DateType,
    IntegerType,
)
from pyspark.testing import assertSchemaEqual, assertDataFrameEqual

from main import transformation

(...)

def test_schema(spark_fixture: SparkSession, source_fixture: DataFrame):
    df_result = transformation(source_fixture)

    assertSchemaEqual(
        df_result.schema,
        StructType(
            [
                StructField("loop_number", StringType()),
                StructField("label", StringType()),
                StructField("total", IntegerType()),
                StructField("date", DateType()),
                StructField("holiday_name", StringType()),
            ]
        ),
    )
```

Je lance le test.

```shell
% pytest test.pyy -vv
================================= test session starts =================================
platform linux -- Python 3.10.12, pytest-8.0.0, pluggy-1.4.0 -- /usr/bin/python3
cachedir: .pytest_cache
plugins: time-machine-2.13.0, anyio-4.2.0, mock-3.12.0
collected 1 item                                                                      

test.py::test_schema PASSED                                                     [100%]
============================ 1 passed, 2 warnings in 6.44s ============================
```

La structure correspond bien à l'attendu.

Vérifions maintenant le contenu du dataframe. La fonction [assertDataFrameEqual()]([https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.testing.assertSchemaEqual.html](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.testing.assertDataFrameEqual.html)) nous facilite le test.

```python
def test_dataframe_content(spark_fixture: SparkSession, source_fixture: DataFrame):
    df_expected = spark_fixture.createDataFrame(
        [
            (
                "0674",
                "Pont Haudaudine vers Sud",
                657,
                datetime.date.fromisoformat("2021-03-16"),
                "Hors Vacances",
            )
        ],
        StructType(
            [
                StructField("loop_number", StringType()),
                StructField("label", StringType()),
                StructField("total", IntegerType()),
                StructField("date", DateType()),
                StructField("holiday_name", StringType()),
            ]
        ),
    )
    df_result = transformation(source_fixture)
    assertDataFrameEqual(df_result, df_expected)
```

Je devrais obtenir qu'une seul ligne, car la seconde ligne dans `source_fixture` la colonne "Probabilité de présence d'anomalies" contient "Faible". Or, je ne veux pas utiliser de données avec une présence d'anomalie.

Lançons le test.


```shell
% pytest test.py -vv             
================================= test session starts =================================
platform linux -- Python 3.10.12, pytest-8.0.0, pluggy-1.4.0 -- /usr/bin/python3
cachedir: .pytest_cache
rootdir: /home/thierry/eleven/data
plugins: time-machine-2.13.0, anyio-4.2.0, mock-3.12.0
collected 2 items                                                                     

test.py::test_schema PASSED                                                     [ 50%]
test.py::test_dataframe_content FAILED                                          [100%]

====================================== FAILURES =======================================
_______________________________ test_dataframe_content ________________________________
(...)
E           pyspark.errors.exceptions.base.PySparkAssertionError: [DIFFERENT_ROWS] Results do not match: ( 100.00000 % )
E           *** actual ***
E           ! None
E           
E           
E           *** expected ***
E           ! Row(loop_number='0674', label='Pont Haudaudine vers Sud', total=657, date=datetime.date(2021, 3, 16), holiday_name='Hors Vacances')

../../.local/lib/python3.10/site-packages/pyspark/testing/utils.py:579: PySparkAssertionError
-------------------------------- Captured stderr call ---------------------------------
FAILED test.py::test_dataframe_content - pyspark.errors.exceptions.base.PySparkAssertionError: [DIFFERENT_ROWS] Results do ...
======================= 1 failed, 1 passed, 2 warnings in 7.80s =======================
```

Tiens, c'est bizarre 🤔, le test est en échec. Pourtant, le résultat attendu est correct.

Revenons sur le code PySpark, et en particulier sur la condition `where()`.

```python
def transformation(df: DataFrame) -> DataFrame:
    return (
        ...
        .where(col("Probabilité de présence d'anomalies").isNull())
    )
```

En effet, il y a une coquille. D'après notre jeu de données, la colonne "Probabilité de présence d'anomalies" est de type string. Or, la fonction `isNull()` est un test sur la nullité d'une colonne au sens strict : c'est équivalent en SQL à `IS NULL`. Donc, une colonne de type string vide n'est pas _null_ au sens strict.

Il faut corriger la condition par une égalité avec une string vide.

```python
from pyspark.sql.functions import col, lit

def transformation(df: DataFrame) -> DataFrame:
    return (
        ...
        .where(col("Probabilité de présence d'anomalies") == lit(""))
    )
```

Ainsi, lorsque je relance mon test.

```shell
% pytest test.py -vv                        
================================= test session starts =================================
platform linux -- Python 3.10.12, pytest-8.0.0, pluggy-1.4.0 -- /usr/bin/python3
cachedir: .pytest_cache
plugins: time-machine-2.13.0, anyio-4.2.0, mock-3.12.0
collected 2 items                                                                     

test.py::test_schema PASSED                                                     [ 50%]
test.py::test_dataframe_content PASSED                                          [100%]
============================ 2 passed, 2 warnings in 8.33s ============================
```

Félicitations, votre code est maintenant testé. Vous pouvez aller en production sereinement 😌.

## Conclusion

A travers cet article, nous avons vu la mise en place de tests unitaire pour notre traitement de données PySpark. Cela nous a permis de nous rendre compte qu'il y avait une erreur dans le code. Ainsi, nous avons pu le corriger. Nous savons maintenant que le code produit répond à nos attentes, ainsi qu'aux utilisateurs de la donnée.

## Références

Code complet

```python
# main.py
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

```python
# test.py
import datetime

import pytest
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    DateType,
    IntegerType,
)
from pyspark.testing import assertSchemaEqual, assertDataFrameEqual

from main import transformation


@pytest.fixture
def spark_fixture() -> SparkSession:
    spark = SparkSession.builder.appName("Testing Bike calculation").getOrCreate()
    yield spark


@pytest.fixture
def source_fixture(spark_fixture) -> DataFrame:
    return spark_fixture.createDataFrame(
        [
            (
                "0674",
                "Pont Haudaudine vers Sud",
                "657",
                "",
                "2",
                "0674 - Pont Haudaudine vers Sud",
                "2021-03-16",
                "Hors Vacances",
            ),
            (
                "0676",
                "Pont Willy Brandt vers Beaulieu",
                "480",
                "Faible",
                "1",
                "0676 - Pont Willy Brandt vers Beaulieu",
                "2021-05-31",
                "Hors Vacances",
            ),
        ],
        StructType(
            [
                StructField("Numéro de boucle", StringType()),
                StructField("Libellé", StringType()),
                StructField("Total", StringType()),
                StructField("Probabilité de présence d'anomalies", StringType()),
                StructField("Jour de la semaine", StringType()),
                StructField("Boucle de comptage", StringType()),
                StructField("Date formatée", StringType()),
                StructField("Vacances", StringType()),
            ]
        ),
    )


def test_schema(spark_fixture: SparkSession, source_fixture: DataFrame):
    df_result = transformation(source_fixture)

    assertSchemaEqual(
        df_result.schema,
        StructType(
            [
                StructField("loop_number", StringType()),
                StructField("label", StringType()),
                StructField("total", IntegerType()),
                StructField("date", DateType()),
                StructField("holiday_name", StringType()),
            ]
        ),
    )


def test_dataframe_content(spark_fixture: SparkSession, source_fixture: DataFrame):
    df_expected = spark_fixture.createDataFrame(
        [
            (
                "0674",
                "Pont Haudaudine vers Sud",
                657,
                datetime.date.fromisoformat("2021-03-16"),
                "Hors Vacances",
            )
        ],
        StructType(
            [
                StructField("loop_number", StringType()),
                StructField("label", StringType()),
                StructField("total", IntegerType()),
                StructField("date", DateType()),
                StructField("holiday_name", StringType()),
            ]
        ),
    )

    df_result = transformation(source_fixture)
    assertDataFrameEqual(df_result, df_expected)
```

```text
# requirements.txt
pyspark==3.5.0
pytest
```
