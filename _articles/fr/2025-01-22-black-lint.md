---
contentType: article
lang: fr
date: 2025-01-22
slug: formatter-le-code-python-avec-black
title: Formatter le code Python avec Black
excerpt: "Le formattage du code est une source de querelle entre les membres d'une équipe. Résolvons le une bonne fois pour toute avec un formatteur de code : Black"
categories:
  - architecture
keywords:
  - python
  - lint
authors:
  - tthuon
seo:
  title: Formatter le code Python avec Black
  description: "Le formattage du code est une source de querelle entre les membres d'une équipe. Résolvons le une bonne fois pour toute avec un formatteur de code : Black"
---

Le formattage du code est une source de querelle entre les membres d'une équipe. Il existe pourtant référence _Python Enhancement Proposals_ qui donne un guide sur le style à adopter : PEP 8 - Style Guide for Python Code. Ce guide ne couvre pas tous les cas d'usage. Un même code peut être formatté de deux façon différente et être conforme à la spécification.

Un outil existe : [Black](https://black.readthedocs.io/en/stable/index.html)

## Black - Le formateur de code sans compromis

Cet va appliquer des règles strictes dans le but d'avoir un code cohérent, généraliste, lisibe et avec des différences git réduite.

Les règles sont disponibles sur cette page : https://black.readthedocs.io/en/stable/the_black_code_style/current_style.html.

Avec l'aide de pip, installer la bibliothèque

```shell
pip install black~=24.8.0
```

Pour appliquer le nouveau style, appeler directement l'outil `black`

```shell
black .
```

En sortie, si tout va bien,

```shell
(venv) ➜  my-project git:(main) black .
All done! ✨ 🍰 ✨
88 files left unchanged.
```

Mais si c'est la première fois, alors il y aura beaucoup d'erreur. Black va automatiquement les corriger. Il n'y aura plus qu'à créer et pousser le commit.

```shell
(venv) ➜  my-project git:(main) black .
reformatted /home/user/script.py

All done! ✨ 🍰 ✨
1 file reformatted, 87 files left unchanged.
```

Maintenant que Black est installé et utilisé par tous les membres de l'équipe, automatisation et faisons respecter cet outils avec Gitlab CI.

## Intégration avec Gitlab CI

Généralement, dans votre fichier `.gitlab-ci.yml` vous avez déjà des tâches pour tester votre code. Ajoutons une étape de plus pour vérifier le formattage du code.

A la différence de l'exécution en local, nous voulons uniquement faire une vérification et monter la différence. Cela permet à la personne de corriger plus facilement.

```yaml
stages:
  - tests

lint:
  stage: tests
  image: hub.docker.com/python:3.11
  before_script:
    - pip install black~=24.8.0
  script:
    - black --check --diff .
  rules:
    - if: $CI_MERGE_REQUEST_IID
```

<div class="admonition note" markdown="1"><p class="admonition-title">Uniquement dans le cadre d'une merge request</p>

Ici, cette tâche s'exécute uniquement dans le cadre d'une merge request. Nous voulons nous assurer que le code qui sera fusionné dans la branche principale soit bien formatté. Il n'est pas nécessaire de l'exécuter de nouveau dans la branche principale.
</div>

Voici la sortie en exemple

```shell
(venv) ➜  my-project git:(main) black --check --diff .        
--- /home/user/script.py        2024-11-13 16:30:20.691360+00:00
+++ /home/user/script.py        2024-11-13 16:30:29.534014+00:00
@@ -29,12 +29,14 @@
         .load(dataset_users_path)
         .where(
             (F.col("user_id").isNotNull()) & (F.col("user_id").rlike(PUBLIC_ID_REGEX))
         )
         .withColumn("processed_at", F.lit(ref_processed_at_str))
-        .select(F.col("user_id").alias("public_id"),
-            F.floor(F.months_between(F.current_date(), F.col("birth_date")) / F.lit(12)
+        .select(
+            F.col("user_id").alias("public_id"),
+            F.floor(
+                F.months_between(F.current_date(), F.col("birth_date")) / F.lit(12)
             ).alias("age"),
             F.col("processed_at"),
         )
     )
 
would reformat /home/user/script.py

Oh no! 💥 💔 💥
1 file would be reformatted, 87 files would be left unchanged.
```

Fini les débats sans fin sur le formattage du code. Black défini une bonne fois pour toutes les règles à adopter par l'équipe. Ce projet est stable et est utilisé par de nombreux projet libre de droits tel que SQLAlachemy ou Django.

