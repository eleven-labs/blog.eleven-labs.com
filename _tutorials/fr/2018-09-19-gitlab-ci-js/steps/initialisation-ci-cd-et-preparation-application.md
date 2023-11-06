---
contentType: tutorial-step
tutorial: gitlab-ci-js
slug: initialisation-ci-cd-et-preparation-application
title: Initialisation de la CI/CD et préparation de notre application pour notre CI/CD
---
# Initialisation de la CI/CD et préparation de l'application pour notre CI/CD

Pour cette deuxième étape nous allons initialiser la CI/CD et préparer notre application pour le temps d'exécution de notre CI/CD.

## Initialisation du repository gitlab
Bon, sur cette partie je pense que je ne vais rien vous apprendre. Rendez-vous sur l’interface de gitlab, puis dans projet, et enfin cliquez sur `New project`.

![Screenshot create project gitlab]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-create-project-gitlab.png)

Ensuite depuis votre console :

```bash
mkdir gitlas-ci-js && cd gitlas-ci-js

git init
git remote add origin git@gitlab.com:ngrevin/gitlab-ci-js.git
git add .
git commit -m "Initial commit"
git push -u origin master

# Si vous avez plusieurs comptes Github / GitLab / … pensez à changer votre config
git config user.name "ngrevin"
git config user.email "ngrevin@eleven-labs.com"
```

On va en profiter pour créer notre branche demo et protéger les branches demo et master, ainsi que tous les tags.
Pour ce faire rendez-vous sur l'interface web de Gitlab et allez dans `Settings  > General > Repository`

![Screenshot protected branch]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-protected-branch.png)
![Screenshot protected tag]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-protected-tag.png)

## Initialisation de la CI/CD de gitlab-ci

Pour cette partie, rien de compliqué. Il faut juste ajouter un fichier `.gitlab-ci.yml` à la racine de votre projet et pour que la CI puisse fonctionner nous allons juste mettre une déclaration `script` dans un `job`.

```yaml
init:gitlab-ci:
  script:
   - echo 'hello gitlab-ci'
```
On push nos modifications :

```bash
git checkout -b gitlab-ci-js/hello-gitlab-ci
git add .
git commit -m “gitlab-ci-js/hello-gitlab-ci - add .gitlab-ci.yml”
git push origin gitlab-ci-js/hello-gitlab-ci
```
Et voilà le résultat :

![Resultat initialisation gitlab-ci]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/result-init-gitlab-ci.png)

## Préparation de notre application pour notre CI/CD

Lors de l'exécution de la CI/CD nous aurons besoin de notre application déjà construite avec toutes ces dépendances.

On va avoir besoin de notre application dans deux états :
La version construite avec les dépendances de développement pour les codes styling et les tests
La version construite sans les dépendances de développement et les fichiers compilés pour le futur déploiement
```yaml
stages:
  - build

.template_build: &template_build # Template commun aux deux jobs de la stage build
  stage: build # On lie les jobs au stage de build
  image: node:8-alpine # On utilise l’image de node 8

build:node_modules:
  <<: *template_build # on appelle notre template
  script: # Les scripts exécutés pendant ce job
    - yarn install
  cache: # on définit notre cache
    policy: push
    paths:
      - ./node_modules
  except: # On définit une règle d'exécution : ce job sera fait tout le temps sauf sur master et demo, mais aussi en cas de tag
    - master
    - demo
    - tags

build:app:
  <<: *template_build # on appelle notre template
  before_script: # On met à jour la version de package.json si nous sommes sur un tag
    - if [ ! -z "${CI_COMMIT_TAG}" ]; then npm version ${CI_COMMIT_TAG:1}; fi
  script: # Les scripts exécutés pendant ce job
    - yarn install
    - yarn build
  after_script: # On sauvegarde le fichier package.json dans le répertoire "dist" pour le mettre en cache
    - cp package.json dist/package.json
  cache: # on définit notre cache
    policy: push
    paths:
      - ./dist
      - ./node_modules
  only: # On définit une règle d'exécution : ce job sera fait uniquement sur demo ou en cas de tag
    - demo
    - tags
  except: # On définit une règle d'exécution : ce job ne se fera pas sur master
    - master
```

Voici quelques liens pour avoir des explications sur les définitions utilisés :
 - [stages]({BASE_URL}/fr/introduction-gitlab-ci/#stages)
 - [image]({BASE_URL}/fr/introduction-gitlab-ci/#image)
 - [anchors, ici les "templates"]({BASE_URL}/fr/introduction-gitlab-ci/#anchors)
 - [before_script et after_script]({BASE_URL}/fr/introduction-gitlab-ci/#before_script-et-after_script)
 - [script]({BASE_URL}/fr/introduction-gitlab-ci/#script)
 - [variables]({BASE_URL}/fr/introduction-gitlab-ci/#stages)
 - [cache]({BASE_URL}/fr/introduction-gitlab-ci/#cache)
 - [only et except]({BASE_URL}/fr/introduction-gitlab-ci/#only-et-except)

On push nos modifications :

```bash
git checkout -b gitlab-ci-js/step1
git add .
git commit -m “gitlab-ci-js/step1 - add .gitlab-ci.yml”
git origin gitlab-ci-js/step1
```

Et voilà notre CI/CD :

![Résultat CI/CD stage build]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-pipeline-build.png)

Vous créez une PR et vous la mergez dans master. Et voilà pour la première étape ! Passons à la suivante.