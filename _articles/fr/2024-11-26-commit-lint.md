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
---

Dans l'article sur la c
## Convention de nommage des commits

Nos commits doivent respecter une convention. Pour cela, nous allons utiliser [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).

Pour simplifier, un commit commençant par 
- "feat: " va incrémenter le numéro de version mineur
- "fix: " va incrémenter le numéro de version de correctif

Une fois que nos commits respectent la nomenclature défini par Commits Conventionnels, nous pouvons utiliser un outil pour effectuer le différentiel de version : [semantic-release](https://github.com/semantic-release/semantic-release).

## commitlint

commitlint va automatiser ce processus de marquage d'une version d'une application.

Cela nécessite quelques configurations.

Tout d'abord, il faut créer un fichier `.commitlintrc.yaml` avec le contenu suivant : 

```yaml
extends:
  - "@commitlint/config-conventional"
```

Cette configuration ajoute deux modules pour utiliser les commits conventionnels, et un troisième pour s'intégrer avec Gitlab.

Enfin, la branche de référence en `main` dans notre cas.

Dans le fichier `.gitlab-ci.yml`, ajoutons une tâche pour générer le prochain numéro de version.

```yaml
stage:
  - tests

lint:merge_request_title:
  image: dockerhub.ftven.net/node:lts
  stage: tests
  before_script:
    - npm install @commitlint/{cli,config-conventional}
  script:
    - echo "${CI_MERGE_REQUEST_TITLE}" | npx commitlint
  rules:
    - if: $CI_MERGE_REQUEST_IID
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
