---
contentType: tutorial-step
tutorial: gitlab-ci-js
slug: mise-en-place-phases-code-style-et-tests
title: Mise en place des phases de code style et de tests
---
# Mise en place des phases de code style et de test

Pour cette troisième étape, nous allons mettre en place le code style et les tests sur notre CI. Pour ce faire nous allons devoir ajouter des dépendances à notre projet pour le code style du scss.

## Installation des dépendances

Pour le code style du scss nous allons avoir besoin de `stylelint` avec `stylelint-processor-html` pour fonctionner avec Vue.js.
Nous utiliserons les règles de base avec `stylelint-config-standard`

```bash
make yarn "add -D stylelint stylelint-processor-html stylelint-config-standard"

```

## Configuration de stylelint

Nous allons mettre en place une configuration standard dans le fichier que vous devez créer sous nom de `.stylelintrc` et qui doit être placé à la racine de votre projet.

```json
{
  "processors": ["stylelint-processor-html"],
  "extends": "stylelint-config-standard"
}
```

## Création des commandes

Pour faire fonctionner notre code style scss nous allons ajouter une commande au fichier `package.json` et en modifier une autre

```diff
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
-    "lint": "vue-cli-service lint --no-fix",
+    "lint": "yarn lint:js && yarn lint:scss",
+    "lint:js": "vue-cli-service lint --no-fix",
+    "lint:scss": "stylelint '**/*.vue' --syntax scss",
    "test": "yarn test:unit && yarn test:e2e",
    "test:unit": "vue-cli-service test:unit",
    "test:e2e": "vue-cli-service test:e2e"
  },
```

## Application à la CI/CD

Nous n'avons plus qu'à ajouter deux étapes comprenant chacune deux `jobs`.

```yaml
stages:
  - build
  - lint # Nouvelle étape pour les code style
  - test # Nouvelle étape pour les tests

# ...

.template_lint_and_test: &template_lint_and_test # Définition du template pour les codes style et les tests
  image: node:8-alpine # On utilise l’image de node 8
  cache: # Définition des règles de cache pour récuperer les caches de l'étape de build
    paths:
      - ./node_modules
    policy: pull
  when: on_success # Condition d'exécution : sera exécuté uniquement si les jobs de l'étape précédente réussissent
  except:
    - tags
    - master

lint:js:
  <<: *template_lint_and_test # on appel notre template
  stage: lint # On lie le job au stage de lint
  script: # Les scripts exécutés pendant ce job
    - yarn lint:js

lint:scss:
  <<: *template_lint_and_test # on appelle notre template
  stage: lint # On lie le job au stage de lint
  script: # Les scripts exécutés pendant ce job
    - yarn lint:scss

test:unit:
  <<: *template_lint_and_test # on appel notre template
  stage: test # On lie le job au stage de test
  script: # Les scripts exécutés pendant ce job
    - yarn test:unit

test:e2e:
  <<: *template_lint_and_test # on appel notre template
  image: cypress/base:8 # On utilise un image différente pour les test e2e. overwrite de l'image de base du template
  stage: test # On lie le job au stage de test
  cache: {} # On désactive le cache pour cette étape
  script: # Les scripts exécutés pendant ce job
    - yarn install
    - yarn cypress install
    - yarn run test:e2e --headless

# ...
```

Voici quelques liens pour avoir des explications sur les nouvelle définitions utilisés :
 - [when](https://blog.eleven-labs.com/fr/introduction-gitlab-ci/#when)

On push nos modifications :

```bash
git checkout -b gitlab-ci-js/step2
git add .
git commit -m “gitlab-ci-js/step2 - update .gitlab-ci.yml”
git origin gitlab-ci-js/step2
```

Et voilà notre CI/CD :

![résultat CI/CD stage lint et test]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-pipeline-lint-and-test.png)

Vous créez un PR et vous la mergé dans master. Et voilà pour la deuxième étape, passons à la suivante.