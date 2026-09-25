---
contentType: tutorial-step
tutorial: gitlab-ci-js
slug: definition-besoins-et-preparation-de-application
title: Définition des besoins et préparation de notre application
---
## Conception et préparation de l'environnement applicatif

Pour cette première étape nous allons commencer par définir nos besoins en termes de technologies à mettre en place mais aussi en termes de workflows git et de CI/CD. Puis nous allons initialiser notre application.

### Conception

#### Les technologies

Docker pour notre environnement de développement.
Node avec npm et yarn pour exécuter notre application sur notre environnement de dév.
Make pour simplifier nos commandes dans la phase de développement.

#### Le workflow de le CI/CD

Voici les trois workflows de notre CI/CD que nous aurons a la fin de ce tutoriel :

![Workflow gitlab-ci app js]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/workflow-gitlab-ci-app-js.svg)

### Initialisation de l’application Vue.js

Pour faire simple et pour aller vite nous allons utiliser vue-cli. Nous allons donc installer vue-cli et initialiser un projet Vue.js.

```bash
$ yarn global add @vue/cli@3.0.1
# ...
$ vue --version
3.0.1
```

> Si vous avez des soucis avec la commande `vue` pensez à regarder votre configuration npm/yarn, et si le chemin des exécutables npm/yarn est bien déclaré dans la variable $PATH.


> Pour la prochaine étape : espace vous permet de sélectionner les choix, les flêches bas et haut de vous déplacer et entrée de valider

```bash
vue create .

# ---------------------------

Vue CLI v3.0.1
? Generate project in current directory? (Y/n) y

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset:
  default (babel, eslint)
❯ Manually select features

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project:
❯◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◉ Unit Testing
 ◉ E2E Testing

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) Y

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): (Use arrow keys)
❯ SCSS/SASS
  LESS
  Stylus

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
❯ ESLint + Standard config
  ESLint + Prettier

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
? Pick a linter / formatter config: Standard
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ Lint on save
 ◯ Lint and fix on commit

# ---------------------------

 Vue CLI v3.0.1
 ? Please pick a preset: Manually select features
 ? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
 ? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
 ? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
 ? Pick a linter / formatter config: Standard
 ? Pick additional lint features: Lint on save
 ? Pick a unit testing solution: (Use arrow keys)
 ❯ Mocha + Chai
   Jest

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Mocha
? Pick a E2E testing solution: (Use arrow keys)
❯ Cypress (Chrome only)
 Nightwatch (Selenium-based)

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Mocha
? Pick a E2E testing solution: Cypress
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.?
 In dedicated config files
❯ In package.json

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Mocha
? Pick a E2E testing solution: Cypress
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In package.json
? Save this as a preset for future projects? (y/N) y

# ---------------------------

Vue CLI v3.0.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): SCSS/SASS
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Mocha
? Pick a E2E testing solution: Cypress
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In package.json
? Save this as a preset for future projects? Yes
? Save preset as: .vuerc

# ---------------------------

? Pick the package manager to use when installing dependencies: (Use arrow keys)
❯ Use Yarn
 Use NPM
```
Voilà pour l’installation, on vérifie que l’application fonctionne avec cette commande :

```bash
yarn serve
```
![Screenshot app Vue.js init]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-app-vue-js-init.png)

### Make

Pour simplifier les commandes docker et pour que l’application soit sous docker, j'ai fait un makefile. Je l’utilise dans la majorité de mes applications et ça fonctionne bien.

Comme le tuto ne porte pas sur ce sujet je vous le donne sans vous donner l'explication mais ça sera peut-être un sujet que j’aborderai dans l’avenir :).

Voici le lien vers le makefile en question : [Makefile pour application node](https://gist.github.com/nicolas-grevin/0aa9c31a90be7bd35cc9fbd05f6a2fb9)
