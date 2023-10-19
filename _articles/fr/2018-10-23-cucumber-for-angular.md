---
contentType: article
lang: fr
date: '2018-10-23'
slug: cucumber-for-angular
title: Cucumber for Angular
excerpt: Comment intégrer Cucumber dans Angular
cover: /assets/2018-10-23-cucumber-for-angular/cover.png
categories:
  - javascript
authors:
  - la3roug
keywords:
  - e2e
  - bdd
  - angular
  - angularcli
  - cucumber
  - gherkin
  - puppeteer
---

## Introduction

__AngularCLI__ est une interface en ligne de commandes pour __Angular__ (trouvé sur https://cli.angular.io/).

Cet outil comporte plusieurs fonctionnalités utiles qui nous font gagner beaucoup de temps.
Il nous permet, par exemple, de générer un nouveau projet (Angular bien sûr) en une seule ligne de commande.

Dans cet article, nous n'allons pas aborder toutes les fonctionalités de __AngularCLI__, nous allons plutôt nous concentrer sur la partie _test_, plus précisément les tests `e2e`.

En effet, __AngularCLI__ possède une commande `ng e2e`, qui nous permet de lancer les tests `e2e`. Cela est possible car au moment de la génération d'un nouveau projet __Angular__, __AngularCLI__ va installer des paquets tiers qui nous permettent d'implémenter et exécuter les tests `e2e`. Il va installer (et configurer) pour nous __Protractor__ (qui à son tour va installer _webdriver_ et _selenium_) et __Jasmine__ (utilisé aussi pour les tests unitaires). Ce n'est peut-être pas la bonne sélection d'outils si nous voulons faire du __BDD__ ou si nous avons juste besoin d'exécuter nos tests sur _Chrome Headless_ et que les autres navigateurs ne nous intéressent pas.

À travers cet article, nous allons voir comment supprimer __Protractor__ et le remplacer par __Cucumber__ (pour le __BDD__) et __Puppeteer__ (pour communiquer avec _Chrome Headless_).

## Supprimer Protractor

Avant de mettre en place __Cucumber/Puppeteer__, nous allons d'abord supprimer __Protractor__ et les répertoires/fichiers associés qui ont été générés par AngularCLI.

### Désinstaller Protractor

La désinstallation de __Protractor__ se fait comme suit :

```bash
$ npm uninstall protractor --save-dev
```

### Supprimer la partie e2e des fichiers de configuration

AngularCLI nous permet de lancer les tests `e2e` via la commande `ng e2e`, nous allons donc retirer l'appel à cette commande des scripts `npm` qui se trouvent dans le fichier `package.json` :

```json
 {
   "scripts": {
-    "e2e": "ng e2e",
+    "e2e": "echo \"no e2e test yet!\"",
     ...
   }
 }
```

Vu que nous ne passons plus par AngularCLI pour nos tests `e2e`, nous allons supprimer du fichier `angular.json` le projet `<project-name>-e2e` (où `<project-name>` est le nom de votre projet) qui se trouve dans la partie `projects` :

```json
 {
   "projects": {
     "my-project": {...},
-    "my-project-e2e": {...}
   }
 }
```

Le dernier fichier de configuration à modifier est `src/tsconfig.e2e.json`. Nous allons retirer `jasmine` et `jasminewd2` de la propriété `types` des options du compilateur TypeScript (nous verrons un peu plus bas par quoi nous allons le remplacer) :

```json
 {
   "extends": "../tsconfig.json",
   "compilerOptions": {
     "outDir": "../out-tsc/app",
     "module": "",
     "target": "es5",
     "types": [
-      "jasmine",
-      "jasminewd2",
       "node"
     ]
   }
 }
```

### Supprimer les fichiers créés par AngularCLI

Ensuite, nous allons supprimer le contenu du répertoire `e2e/src` et le fichier `e2e/protractor.conf.js` :

```bash
$ rm e2e/src/* e2e/protractor.conf.js
```

## Mettre en place Cucumber/Puppeteer

Maintenant que nous avons désinstallé __Protractor__ et supprimé les fichiers de configuration correspondants, passons à l'étape suivante qui est la mise en place de __Cucumber/Puppeteer__ et __Chai__ pour pouvoir faire nos assertions.

### Installation

Nous allons installer les paquets suivants :

* __Cucumber__ : c'est l'outil qui va nous permettre d'exécuter nos tests.
* __Puppeteer__ : pour communiquer avec l'API de Chrome/Chromium
* __Chai__ : une librairie d'assertion.

```bash
$ npm install cucumber puppeteer chai --save-dev
```

Afin que __TypeScript__ puisse reconnaître les paquets que nous venons d'installer, nous allons aussi installer les __Type Definition__ de ces derniers :

```bash
$ npm install @types/{cucumber,puppeteer,chai}
```

### Structure des fichiers

La structure par défaut proposée par __Cucumber__ est la suivante :

```
features/
  step_definitions/
    feautre1.steps.ts
    feautre2.steps.ts
    ...
  feature1.feature
  feature2.feature
  ...
```

Personnellement je préfère séparer les _steps_ des _features_, nous allons donc les mettre au même niveau (si vous voulez opter pour la structure proposée par __Cucumber__, il faudra dans ce cas adapter les chemins dans les étapes qui viennent). Nous allons aussi utiliser le modèle __Page Object Pattern__ afin de séparer l'appel à l'API de _Chrome/Chromium_ de nos tests :

```
e2e/
  src/
    features/
      feature1.feature
      feature2.feature
      ...
    steps/
      feature1.steps.ts
      feature2.steps.ts
      ...
    po/
      app.po.ts
      ...
  tsconfig.e2e.json
```

* _features_ : contient nos _user stories_ rédigées en _Gherkin_.
* _steps_ : contient l'implémentation des tests.
* _po_ : contient nos _class_ __PageObject__

### Configuration

Nous allons maintenant configurer notre application pour qu'elle puisse lancer les tests.

Commençons par le fichier `src/tsconfig.e2e.json` en ajoutant `cucumber` au tableau `types` que nous avons édité un peu plus haut :

```json
 {
   "extends": "../tsconfig.json",
   "compilerOptions": {
     "outDir": "../out-tsc/app",
     "module": "commonjs",
     "target": "es5",
     "types": [
+      "cucumber",
       "node"
     ]
   }
 }
```

La dernière configuration à faire, est le _script npm_ `e2e`. C'est à cet endroit que nous ferons appel à __Cucumber__ pour exécuter nos tests.

La commande `cucumber-js` permet d'écrire les _steps_ en _TypeScript_ grâce à `ts-node` (d'autres transpilateurs sont supportés aussi, comme _CoffeeScript_), nous allons donc utiliser l'option `--require-module` afin d'utiliser `ts-node`.

Par défaut `ts-node` va charger le fichier `tsconfig.json` qui se trouve à la racine du projet. Mais comme `cucumber-js` ne permet pas le passage de paramètres au module `ts-node`, nous allons utiliser la variable d'environnement `TS_NODE_PROJECT` et lui assigner le chemin `e2e/tsoncif.e2e.json` que nous avons vu un peu plus haut.

```json
 {
   "scripts": {
-    "e2e": "echo \"no e2e test yet\"",
+    "e2e": "TS_NODE_PROJECT=e2e/tsconfig.e2e.json cucumber-js --require-module ts-node/register -r e2e/steps/**/*.steps.ts e2e/features/**/*.feature",
     ...
   }
 }

```

## Exemple de scénario

Nous allons à présent rédiger notre première _feature_ que nous allons mettre dans le fichier `e2e/src/features/welcome.feature` :

```gherkin
Feature: Say hello to visitor
  Scenario: Display a welcome message
    Given a visitor visits our website
    When the home page is loaded
    Then he should see a message saying "Welcome Visitor !"
```

Passons maintenent au fichier `e2e/src/steps/welcome.steps.ts` :
```typescript
import { AfterAll, BeforeAll, Given, Then, When }  from 'cucumber';
import { expect } from 'chai';

import { AppPage } from '../po/app.po';

let appPage: AppPage;

BeforeAll(async () => {
  appPage = new AppPage();
  await appPage.init();
});

Given('a visitor visits our website', async () => {
  await appPage.gotoPage('/');
});

When('the home page is loaded', async () => {
  await appPage.waitFor('h1');
});

Then('he should see a message saying {string}', async message => {
  expect(await appPage.getContent('h1')).to.equal(message);
});

AfterAll(() => {
  appPage.close();
});

```

Et dans le fichier `e2e/src/po/app.po` :

```typescript
import * as puppeteer from 'puppeteer';

export class AppPage {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
  baseUrl = 'http://localhost:4200';

  async init() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
  }

  async gotoPage(url) {
    await this.page.goto(this.baseUrl + url);
  }

  async getContent(selector) {
    return await this.page
      .evaluate(select => document.querySelector(select).textContent, selector);
  }

  async waitFor(selector) {
    return this.page.waitFor(selector);
  }

  close() {
    this.browser.close();
  }
}
```

## Exécution des tests

Avant de lancer __Cucumber__, nous devons exécuter `npm start` pour que __Puppeteer__ puisse naviguer vers `http://localhost:4200`.

Une fois que notre serveur _http_ en local est en marche, nous pouvons exécuter nos tests via la commande :

```bash
$ npm run e2e
```

> Pour rappel, lors de la configuration de __Cucumber__ nous avons remplacé le script _npm_ `e2e` par la commande qui permet de lancer __Cucumber__.

## Conclusion

__AngularCLI__ nous fournit plein d'outils par défaut, afin d'accélerer et faciliter le développement de nos applications. Mais cela ne veut pas dire que nous ne pouvons pas remplacer ces outils par d'autres.

Dans notre cas, nous avons décidé de ne pas utiliser __Protractor__ et d'utiliser à la place __Cucumber/Puppeteer__.

Nous avons donc commencé par voir comment supprimer __Protractor__. Ensuite, nous avons vu comment mettre en place __Cucumber__. Une fois tout en place, nous avons rédigé un exemple de scénario et implémenté les _steps definitions_ de ce scénario. En dernier, nous avons vu comment exécuter nos tests.
