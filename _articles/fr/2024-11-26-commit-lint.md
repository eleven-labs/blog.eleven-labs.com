---
contentType: article
lang: fr
date: '2024-11-26'
slug: automatiser-la-verification-du-commit
title: Automatiser la vérification du commit
excerpt: Automatiser la vérification du commit avec commitlint
categories:
  - architecture
authors:
  - tthuon
keywords:
  - devops
  - gitlab
covers:
  alt: astronaute qui vérifie les commits
  path: /imgs/articles/2024-11-26-commit-lint/cover.jpg
---

Dans l'article sur [la création automatique d'une nouvelle version d'une application](fr/automatiser-la-creation-de-la-version-dune-application-avec-semantic-release/), nous avons vu que l'outil semantic-release s'appuie sur des messages de commits conventionnels.

Pour que le processus de création automatique de marquage de la nouvelle version puisse fonctionne correctement, nous allons vérifier que les messages de commits suivent bien les commits conventionnels.

## Convention de nommage des commits

Pour rappel, nos commits doivent respecter une convention. Pour cela, nous allons utiliser [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).

Pour simplifier, un commit commençant par 
- "feat: " va incrémenter le numéro de version mineur
- "fix: " va incrémenter le numéro de version de correctif

Pour faire respecter ces règles, nous allons utiliser un outil : [commitlint](https://commitlint.js.org/).

## Mise en oeuvre de commitlint

commitlint va lire le message de commit et la comparer avec les différentes règles.

Cela nécessite quelques configurations.

Tout d'abord, il faut créer un fichier `.commitlintrc.yaml` avec le contenu suivant : 

```yaml
extends:
  - "@commitlint/config-conventional"
```

Cette configuration permet d'indiquer à commitlint d'utiliser les commits conventionnels.

Dans le fichier `.gitlab-ci.yml`, ajoutons une tâche pour générer tester le message de commit.

```yaml
stage:
  - tests

lint:merge_request_title:
  image: dockerhub.ftven.net/node:lts
  stage: tests
  before_script:
    - npm install @commitlint/{cli,config-conventional}
  script:
    - echo "${CI_COMMIT_MESSAGE}" | npx commitlint
```

Félicitation, vous avez automatiser la vérification du message de commit. Prenez une boisson chaude pour vous détendre.

## Références

- https://www.conventionalcommits.org/fr/v1.0.0/
- https://commitlint.js.org/
