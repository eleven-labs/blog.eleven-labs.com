---
contentType: article
lang: fr
date: '2024-11-19'
slug: automatiser-la-creation-de-la-version-dune-application-avec-semantic-release
title: Automatiser la création de la version d'une application avec semantic-release
excerpt: Automatiser la création de la version d'une application avec semantic-release
categories:
  - architecture
authors:
  - tthuon
keywords:
  - devops
  - gitlab
cover:
    alt: Astronautes qui font la fete
    path: /imgs/articles/2024-11-19-semantic-release/cover.jpg
---

Votre est prête à être livrée. Pour cela, vous avez besoin de marquer votre application avec un numéro de version. Une convention permet de faciliter le suivi de version : [Gestion sémantique de version](https://semver.org/lang/fr/).

La livraison de la version 1.0.0 s'est déroulé avec succès. Maintenant, vous avez besoin d'ajouter de nouvelles fonctionnalité. Il faudra donc incrémenter le numéro de version.

Deux options possibles : 
- marquer la prochaine version manuellement
- automatiser ce processus en suivant une convention

Automatisons ce processus.

## Convention de nommage des commits

Afin d'automatiser le processus de marquage des versions, nous allons nous référer à l'historique des commits du dépôt Git. Une nouvelle version d'une application peut se définir par un ensemble de commit entre la précédente version et la tête de la branche principale.

Nos commits doivent respecter une convention. Pour cela, nous allons utiliser [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).

Pour simplifier, un commit commençant par 
- "feat: " va incrémenter le numéro de version mineur
- "fix: " va incrémenter le numéro de version de correctif

Une fois que nos commits respectent la nomenclature défini par Commits Conventionnels, nous pouvons utiliser un outil pour effectuer le différentiel de version : [semantic-release](https://github.com/semantic-release/semantic-release).

## semantic-release

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

Lors de la prochaine exécution du pipeline Gitlab CI, une tâche `release` va apparaître. Elle sera en attente d'une action utilisateur. Une fois que l'utilisateur a validé, la nouvelle version est créé et publié dans Gitlab (voir documentation : https://docs.gitlab.com/ee/user/project/releases/).

Félicitation, vous avez automatiser la création d'une version de votre application. Prenez une boisson chaude pour vous détendre.

## Références

- https://semver.org/lang/fr/
- https://www.conventionalcommits.org/fr/v1.0.0/
- https://github.com/semantic-release/semantic-release
- https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html
- https://docs.gitlab.com/ee/user/project/releases/
