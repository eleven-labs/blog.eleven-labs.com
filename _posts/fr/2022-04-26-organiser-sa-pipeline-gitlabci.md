---
layout: post
lang: fr
date: '2022-04-26'
categories:
  - architecture
authors:
  - tthuon
excerpt: >-
  Lorsqu'il y a plusieurs services à maintenir et à déployer, le code des
  pipelines des différents services est très souvent copié-collé. Nous verrons
  dans cet article comment mutualiser le code !
title: Organiser son pipeline Gitlab CI avec les templates
slug: organiser-son-pipeline-gitlab-ci-avec-les-templates
oldCategoriesAndTags:
  - architecture
  - devops
permalink: /fr/organiser-son-pipeline-gitlab-ci-avec-les-templates/
---

Lors de ma mission chez Maisons du Monde en tant que SRE, j'ai découvert une nouvelle façon d'organiser le code du pipeline GitLab.

Lorsqu'il y a plusieurs services à maintenir et à déployer, le code des pipelines des différents
services est très souvent copié-collé. Ce n'est pas DRY (Don't Repeat Yourself).

Il est donc recommandé dans ce cas de mutualiser le code. Il existe plusieurs façons de procéder, mais nous nous attarderons dans cet article sur la façon suivante.

## Un pipeline Gitlab CI

Prenons cet exemple de pipeline Gitlab CI. Il se lance au moment d'une merge-request
et lors d'un merge dans la branche par défaut.

Le pipeline construit les dépendances, lance les tests et construit l'application.

```yaml
workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

image: golang:1.18

stages:
  - install
  - test
  - build

install:
  stage: install
  script:
    - go mod download

test:
  stage: test
  script:
    - mkdir report
    - go test -json -cover -coverprofile report/coverage.out > report/unittest.json
  artifacts:
    paths:
      - report
  dependencies:
    - install

build:
  stage: build
  script:
    - mkdir -p build
    - go build -o build/awesome-app
  dependencies:
    - test
  artifacts:
    paths:
      - build/
```

## Le concept du template off-the-shelf

Je pourrais mettre ce pipeline complet en tant que template et le réutiliser partout. Cependant, si
une équipe veut gérer son pipeline différement, ou qu'elle veut ajouter des outils supplémentaires tel que
gosec, elle ne pourra pas le faire simplement.

Le principe est de créer des templates pour chaque job. Ainsi l'équipe responsable du pipeline est libre
de les utiliser ou non. Elle peut également en décider l'ordre. C'est le concept du template off-the-shelf
(cela peut être traduit littéralement par "patron sur étagère" ou "livre sur étagère").

Créons un dépôt git avec tous les templates : gitlab-ci-library

L'organisation des dossiers est libre, mais il faut veiller à sa cohérence. Ce dépôt git va grandir au
fur et à mesure des ajouts des templates pour les différents besoins.

```
code
  |- go
    |- install.yaml
    |- test.yaml
    |- build.yaml
```

Le dossier de niveau 1 sera le thème. Ensuite je spécifie le langage et enfin chaque fichier va contenir le template.

Répartissons le code des différents jobs dans chacun des fichiers correspondants.

```yaml
# code/go/install.yaml
.template:code:go:install:
  variables:
    GO_VERSION: 1.18
  image: golang:$GO_VERSION
  script:
    - go mod download
```

```yaml
# code/go/test.yaml
.template:code:go:test:
  variables:
    REPORT_PATH: report
    GO_VERSION: 1.18
  image: golang:$GO_VERSION
  script:
    - mkdir -p ${REPORT_PATH}
    - go test -json -cover -coverprofile ${REPORT_PATH}/coverage.out > ${REPORT_PATH}/unittest.json
  artifacts:
    paths:
      - ${REPORT_PATH}
```

```yaml
# code/go/build.yaml
.template:code:go:build:
  variables:
    BUILD_PATH: build
    GO_VERSION: 1.18
  image: golang:$GO_VERSION
  script:
    - mkdir -p ${BUILD_PATH}
    - go build -o ${BUILD_PATH}
  artifacts:
    paths:
      - ${BUILD_PATH}
```

La gestion des dépendences entre jobs est laissée à l'équipe de développement des services.

En plus de mutualiser en un seul endroit le code des jobs des pipelines, il est possible de donner
des options pour les rendre configurables. Par exemple, le dossier où sera stocké le rapport peut être
changé sans impacter la fonctionnalité.

Tous les templates dont nous avons besoin pour transformer le pipeline seront inclus via le mot clef `include`.
Avec l'option `ref`, les templates sont versionnés. Un outil tel que [renovate](https://docs.renovatebot.com/)
pourra faire des MR de mise à jour de la version.

Ci-dessous le nouveau pipeline avec l'inclusion des templates.

```yaml
include:
  - project: gitlab-ci-library
    ref: 1.0.0
    file:
      - '/code/go/install.yaml'
      - '/code/go/test.yaml'
      - '/code/go/build.yaml'

workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

stages:
  - install
  - test
  - build

install:
  stage: install
  extends: .template:code:go:install

test:
  stage: test
  extends: .template:code:go:test
  dependencies:
    - install

build:
  stage: build
  extends: .template:code:go:build
  dependencies:
    - test
```

Ce nouveau pipeline est plus lisible. Le développeur s'affranchit de la complexité des jobs. Il se concentre sur
l'ordre et les fonctionnalités du pipeline. Il pourra ajouter un job de code lint plus tard par exemple.

Dans une autre équipe qui gère un autre service, le pipeline pourrait ressembler à ça par exemple :

```yaml
include:
  - project: gitlab-ci-library
    ref: 1.0.0
    file:
      - '/code/go/install.yaml'
      - '/code/go/test.yaml'

workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

variables:
  GO_VERSION: 1.17

stages:
  - download deps
  - testing

download_deps:
  stage: download deps
  extends: .template:code:go:install

test_app:
  stage: testing
  extends: .template:code:go:test
  dependencies:
    - download deps
```

Le nom des stages est différent. La version de go est différente. Et pourtant, les fonctionnalités des templates restent les mêmes.

## Conclusion

Cette organisation du code permet de mutualiser le code à un seul endroit. Le développeur choisi et configure les templates
qui vont lui permettre de créer son pipeline. Il en garde ainsi la pleine maîtrise car il connait les besoins de son application.

Du côté SRE, cette organisation permet de répondre aux besoins de toutes les applications sans avoir à répéter le code.
Chaque template est générique dans son fonctionnement, mais pleinement configurable.

## Ressources

- [https://docs.gitlab.com/ee/ci/yaml/index.html#includefile](https://docs.gitlab.com/ee/ci/yaml/index.html#includefile)
- [https://docs.renovatebot.com/](https://docs.renovatebot.com/)
