---
layout: post
title: Organiser sa pipeline Gitlab CI avec les templates
excerpt: Organiser sa pipeline Gitlab CI avec les templates
lang: fr
permalink: /fr/organiser-sa-pipeline-gitlab-ci-avec-les-templates/
authors:
    - tthuon
categories:
    - devops
---

Lors d'une de mes missions en tant que SRE, j'ai découvert une façon d'organiser le code de la pipeline GitLab.

Lorsqu'il y a plusieurs service à maintenir et à déployer, le code des pipelines des différents
services est très souvent copié-collé. Ce n'est pas DRY (Don't Repeat Yourself).

Il est nécessaire de mutualiser le code. Il existe plusieurs façon de le regrouper et de la partager.

## Une pipeline Gitlab CI

Prenons cet exemple de pipeline Gitlab CI. Elle se lance au moment d'une merge-request
et lors d'un merge dans la branche par défault.

La pipeline excécute construit les dépendances, lance les tests et construit l'application.

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

Je pourrai mettre cette pipeline complète en tant que template et la réutiliser partout. Cependant, si
une équipe veut gérer sa pipeline différement, ou qu'elle veut ajouter des outils supplémentaire tel que
gosec, elle ne pourra pas le faire simplement.

Le principe est de créer des templates pour chaque job. Ainsi l'équipe responsable de la pipeline est libre
de les utiliser ou non. Elle peut également en décider l'ordre. C'est le concept du template off-the-shelf
(cela peut être traduit littéralement par "patron sur étagère" ou "livre sur étagère").

Créeons une dépot git avec tous les templates : gitlab-ci-library

L'organisation des dossiers est libre, mais il faut veiller à sa cohérence. Ce dépôt git va grandir au
fûr et à mesure des ajouts des templates pour les différents besoin.

```
code
  |- go
    |- install.yaml
    |- test.yaml
    |- build.yaml
```

Le dossier de niveau 1 sera le thème. Ensuite je spécifie le langage et enfin chaque fichier va contenir le template.

Répartissons le code des différents job dans chacun des fichiers correspondant.

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

La gestion des dépendences entre job est laissé à l'équipe de développement des services.

En plus de mutualiser en un seul endroit le code des jobs des pipelines, il est possible de donner
des options pour les rendre configurable. Par exemple, le dossier où sera stocker le rapport peut être
changé sans impacter la fonctionnalité.

Tous les templates dont nous avons besoin pour transformer la pipeline seront inclus via le mot clef `include`.
Avec l'option `ref`, les templates sont versionné. Un outil tel que [renovate](https://docs.renovatebot.com/)
pourra faire des MR de mise à jour de la version.

Ci-dessous la nouvelle pipeline avec l'inclusion des templates.

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

Cette nouvelle pipeline est plus lisible. Le développeur s'affranchi de la complexité des jobs. Il se concentre sur
l'ordre et les fonctionnalités de la pipeline. Il pourra ajouter un job de code lint plus tard par exemple.

Dans une autre équipe qui gère un autre service, la pipeline pourrait ressembler à ça par exemple.

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

Le nom des stages est différent. La version de go est différente. Et pourtant, les fonctionnalités des templates restent les même.

## Conclusion

Cette organisation du code permet de mutualiser le code à un seul endroit. Le développeur choisi et configure les templates
qui vont lui permettre de créer sa pipeline. Il en garde ainsi la pleine maitrise car il connait les besoin de son applications.

Du côté SRE, cette organisation permet de répondre aux besoins de toutes les applications sans devoir à répéter le code.
Chaque template est générique dans son fonctionnement, mais pleinement configurable.

## Ressources

- [https://docs.gitlab.com/ee/ci/yaml/index.html#includefile](https://docs.gitlab.com/ee/ci/yaml/index.html#includefile)
- [https://docs.renovatebot.com/](https://docs.renovatebot.com/)
