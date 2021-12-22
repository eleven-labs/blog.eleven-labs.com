---
layout: post
title: Ajouter le code coverage sur les MR avec Gitlab-CI
authors:
    - pouzor
excerpt: Voici un tip qui permet de pouvoir voir en un clin d’œil les répercussions d'une MR sur la couverture de code de votre projet.
lang: fr
permalink: /fr/ajouter-le-code-coverage-sur-les-pr-avec-gitlab-ci/
date: '2016-12-02 12:15:55 +0100'
date_gmt: '2016-12-02 11:15:55 +0100'
categories:
    - Non classé
tags:
    - test
    - gitlab
    - code-coverage
    - gitlab-ci
---


Voici un tip qui permet de pouvoir voir en un clin d’œil les répercussions d'une MR sur la couverture de code de votre projet.


![gitlab-ci-code-coverage]({{ site.baseurl }}/assets/2016-12-02-gitlab-ci/gitlab-ci-code-coverage-1.png)


Dans un premier temps, nous allons modifier notre .gitlab-ci.yml

```yaml
before_script:
  - composer install

stages:
  - test

test:
  script:
  - vendor/phpunit/phpunit/phpunit -c app --coverage-text --colors=never
```

La modification de notre pipeline porte sur les configs de phpunit en ajoutant ```--coverage-text --colors=never```  afin d'avoir dans les logs du pipeline les résultats du code-coverage.

Puis dans l'interface de réglages du pipeline, nous allons configurer la regex afin de récupérer la couverture de code du commit.


![gitlab-ci-code-coverage]({{ site.baseurl }}/assets/2016-12-02-gitlab-ci/gitlab-ci-code-coverage-2.png)

Là, gitlab est plutot sympa et nous donne déjà plusieurs regex toutes prêtes en fonction du langage du projet. Dans mon cas c'est du PHP donc la config sera ```^\s*Lines:\s*\d+.\d+\%```

*C'est tout !!!*

Petit bonus, pour avoir le badge avec le code coverage sur le README, ajouter simplement ces lignes :

```md
[![build status](https://gitlab.com/[TEAM]/[PROJECT]/badges/master/build.svg)](https://gitlab.com/[TEAM]/[PROJECT]/commits/master){:rel="nofollow noreferrer"}
```

Et voila le résultat

![gitlab-ci-code-coverage]({{ site.baseurl }}/assets/2016-12-02-gitlab-ci/gitlab-ci-code-coverage-3.png)

Pour plus d'infos : [gitlab-ci: documentation](https://docs.gitlab.com/ee/user/project/pipelines/settings.html#test-coverage-parsing){:rel="nofollow noreferrer"}
