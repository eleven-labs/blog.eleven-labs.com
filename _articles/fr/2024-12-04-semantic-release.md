---
contentType: article
lang: fr
date: '2024-12-04'
slug: semantic-release
title: Automatiser la création de version d'une application avec semantic-release
excerpt: "Dans cet article, découvrez comment automatiser une création de version de votre application grâce à Semantic-Release : nommage des commits et configurations"
categories:
  - architecture
authors:
  - tthuon
keywords:
  - devops
  - gitlab
cover:
    alt: Comment automatiser la version d'une application avec semantic-release ?
    path: /imgs/articles/2024-12-04-semantic-release/cover.jpg
seo:
  title: Automatiser la création de version avec semantic-release
  description: Découvrez les configurations et le nommage des commits à réaliser pour automatiser le marquage de version de votre application avec semantic-release.
---

Votre application est prête à être livrée. Pour cela, vous avez besoin de marquer votre application avec un numéro de version. Une convention permet de faciliter le suivi de version : [Gestion sémantique de version](https://semver.org/lang/fr/).

La livraison de la version 1.0.0 s'est déroulée avec succès. Maintenant, vous avez besoin d'ajouter de nouvelles fonctionnalités. Il faudra donc incrémenter le numéro de version.

Deux options possibles :
- marquer la prochaine version manuellement
- automatiser ce processus en suivant une convention

Voyons donc comment automatiser ce processus afin de gagner en efficacité.

## Mettre nos commits au format de la nomenclature Commits Conventionnels

Afin d'automatiser le processus de marquage des versions, nous allons nous référer à l'historique des commits du dépôt Git. Une nouvelle version d'une application peut se définir par un ensemble de commits entre la précédente version et la tête de la branche principale.

Nos commits doivent respecter une convention. Pour cela, nous allons utiliser [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).

Pour simplifier, un commit commençant par :
- "feat: " va incrémenter le numéro de version mineur
- "fix: " va incrémenter le numéro de version de correctif

Une fois que nos commits respectent la nomenclature défini par Commits Conventionnels, nous pouvons utiliser un outil pour effectuer le différentiel de version : [semantic-release](https://github.com/semantic-release/semantic-release).

## Mise en oeuvre de commitlint

[commitlint](https://commitlint.js.org/) va lire le message de commit et faire respecter la nomenclature Commits Conventionnels.

Cela nécessite quelques configurations.

Tout d'abord, il faut créer un fichier `.commitlintrc.yaml` avec le contenu suivant :

```yaml
extends:
  - "@commitlint/config-conventional"
```
Cette configuration permet d'indiquer à commitlint d'utiliser les commits conventionnels.
Dans le fichier `.gitlab-ci.yml`, ajoutons une tâche pour tester le message de commit.

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

<div class="admonition note" markdown="1"><p class="admonition-title">Alternatif</p>

Dans le cas d'une merge request, il est possible de vérifier uniquement le titre de la merge request. Ce cas de figure fonctionne bien dans le cas où la branche est fusionnée et squash vers la branche principale.

Pour cela, utiliser la variable Gitlab $CI_MERGE_REQUEST_TITLE.
</div>


## Utiliser semantic-release pour automatiser le processus de marquage d'une version

semantic-release va automatiser ce processus de marquage d'une version d'une application.

Cela nécessite quelques configurations.

Tout d'abord, il faut créer un fichier `.releaserc.yml` avec le contenu suivant :

```yaml
plugins:
  -
    - "@semantic-release/commit-analyzer"
    - preset: "conventionalcommits"
  -
    - "@semantic-release/release-notes-generator"
    - preset: "conventionalcommits"
  - "@semantic-release/gitlab"
branches:
  - "main"
```

Cette configuration ajoute deux modules pour utiliser les commits conventionnels, et un troisième pour s'intégrer avec Gitlab.

Enfin, la branche de référence en `main` dans notre cas.

Dans le fichier `.gitlab-ci.yml`, ajoutons une tâche pour générer le prochain numéro de version.

```yaml
stage:
  - release

release:
  image: dockerhub.ftven.net/node:lts
  stage: release
  variables:
    GITLAB_TOKEN: ${RELEASE_TOKEN}
  before_script:
    - npm install semantic-release @semantic-release/gitlab conventional-changelog-conventionalcommits
  script:
    - npx semantic-release
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
```

<div class="admonition info" markdown="1"><p class="admonition-title">Prévisualiser le contenu de la prochaine version</p>
Ajoutez l'option --dry-run afin de prévisualiser le contenu de la prochaine version
</div>

Le jeton `RELEASE_TOKEN` est créé en suivant la documentation suivante https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html

Lors de la prochaine exécution du pipeline Gitlab CI, une tâche `release` va apparaître. Elle sera en attente d'une action utilisateur. Une fois que l'utilisateur a validé, la nouvelle version est créée et publiée dans Gitlab (voir documentation : https://docs.gitlab.com/ee/user/project/releases/).

## Conclusion

Félicitation, vous avez automatisé la création d'une version de votre application. Prenez une boisson chaude pour vous détendre.

## Références

- https://semver.org/lang/fr/
- https://www.conventionalcommits.org/fr/v1.0.0/
- https://github.com/semantic-release/semantic-release
- https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html
- https://docs.gitlab.com/ee/user/project/releases/
