---
layout: post
title: "Tester son application avec Cypress"
excerpt: "Dans cet article nous allons voir comment mettre en place des tests end-to-end avec Cypress"
authors:
- kdung
permalink: /fr/test-e2e-avec-cypress/
categories:
    - javascript
    - test
tags:
    - javascript
    - test
    - cypress
# cover: URL DE L'IMAGE (/assets/....)
---

![Logo Cypress]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/cypress-logo.png)

Les tests sont devenus un aspect essentiel du développement web, pour ces deux raisons : **vérifier** que l’application fonctionne correctement et **garantir** la meilleure expérience utilisateur possible. Il existe différents types de tests mais aujourd’hui nous allons nous concentrer principalement sur les **tests End-to-end** et comment les implémenter avec **[Cypress](https://cypress.io/)**.

## Que sont les tests end to end ?

![Pyramide des coûts et quantités selon les tests]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/pyramid.png)

Tout d’abord avant de parler des tests end-to-end, il faut que je vous explique les deux premières couches de cette pyramide (on ne peut pas arriver au sommet sans grimper la montagne).

![GIF Alright]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/alright.gif)

**Les tests unitaires (TU)** constituent le socle des tests d’une application. Les TU permettent de tester uniquement un élément individuel de l’application (classe, fonction…).

**Les tests d’intégration** vérifient simplement que les différentes parties de votre programme, que vous avez testées individuellement via des tests unitaires, fonctionnent bien une fois intégrées ensemble. Le but est de créer des cas d'usages réels ou très proches du réel.

**Le test end-to-end** (aussi appelé e2e ou tests de bout-en-bout) est une méthode qui consiste à tester l'ensemble de l'application du début à la fin pour s'assurer que le flux d'application se comporte comme prévu. Il définit les dépendances système du produit et garantit que toutes les pièces intégrées fonctionnent ensemble comme prévu. L'objectif principal des tests de bout en bout (E2E) est de tester l'expérience de l'utilisateur final en simulant le scénario de l'utilisateur réel et en validant le système testé et ses composants pour l'intégration et l'intégrité des données.

Ces tests ignorent généralement la structure interne de l'ensemble de l’application et prennent le contrôle du navigateur comme un utilisateur allant sur votre application.

## Qu'est ce que Cypress ?
Il existe de nombreux outils de test de bout-en-bout pour les applications Web, tels que TestCafe, Puppeteer et Selenium. Chacun a ses avantages et ses inconvénients. **Donc pourquoi utiliser Cypress ?**

Cypress est un framework JS de tests end-to-end. C’est un outil open source permettant de mettre facilement en place ces tests d’applications utilisant React ou des frameworks JavaScript comme Vue, Angular, Elm et bien d’autres.

***"Fast, easy and reliable testing for anything that runs in a browser."***

Par rapport à d’autres outils de tests e2e, Cypress n’a pas besoin d’être couplé à une solution ni à un driver pour sa mise en place. Sa mission est de rendre l’écriture des tests plus rapide (tests exécutés sur le navigateur), plus facile (écriture des tests en JavaScript avec Mocha, Chai et Sinon) et encore plus fiable (visibilité des tests effectués sur le navigateur, screenshot de l’erreur).

![Schéma avant et après Cypress]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/cypress-details.png)

Ce qui m'a poussé à vous parler aujourd'hui de Cypress est le fait que lors d'un projet j'ai eu l'occasion de pouvoir l'utiliser et de constater la simplicité d'installation et d'écriture des tests mais aussi la robustesse de l'outil.

Ce qui démarque Cypress se décompose en plusieurs points :
 - Son architecture : contrairement à la plupart des outils de tests end-to-end, Cypress n'utilise pas de driver Selenium. Alors que Selenium exécute des commandes à distance via le réseau, Cypress s'exécute au sein même de votre boucle d'application, ce qui permet de développer et tester ces scénarios en temps réel. Cette exécution permet aussi de lancer les tests au sein même de votre navigateur. L'écriture des tests se fait donc en JavaScript avec des librairies déjà intégrées dans l'installation de Cypress telles que Mocha, Chai et Sinon.
 - accès natif : comme Cypress opère au sein même de l’application, cela lui permet d'avoir accès à tout, comme par exemple un élément du DOM, ou bien `window` ou `document`.
 - sa robustesse : Cypress est notifié du chargement d'une page. Comme il exécute la grande majorité de ses commandes à l'intérieur du navigateur, il n'y a donc pas de décalage réseau. Lors de l’exécution du scénario, Cypress attend automatiquement que l’élément du DOM soit visible (grâce aux assertions) avant de passer à la suite
 - débuggabilité : l'interface de Cypress permet facilement de faire du débuggage. Comme nous allons le voir par la suite, l'interface va nous montrer visuellement étape par étape l'exécution des commandes, assertions, requêtes réseaux et les temps de chargements et d'exécutions au sein de votre page. Il existe de nombreux messages d'erreurs décrivant la raison exacte pour laquelle Cypress a échoué sur le test du scénario. De plus, Cypress prend des snapshots de l'application et permet donc de revenir dans le temps à l'état dans lequel elle se trouvait lorsque les commandes ont été exécutées, mais aussi d'utiliser l'outil du développement du navigateur, par exemple pour voir les messages dans la console ou voir les requêtes réseaux.


Après ce petit tour des avantages (non-exhaustifs !) de Cypress, voyons comment ca marche.

## Mise en place

**Installation et configuration**

Comme expliqué plus tôt, Cypress est simple et rapide à prendre en main. Pour installer Cypress sur votre projet JS, il vous suffit juste d'exécuter à la racine de votre projet :

```shell
npm install cypress --save-dev
```

ou bien si vous utilisez yarn

```shell
yarn add cypress -D
```

Une fois l'installation terminée, on va ajouter une commande dans le champ `scripts` du `package.json`.
```json
 {
    "scripts": {
        "cypress: "cypress open"
    },
}
```
Cette commande va nous permettre de démarrer l'interface d'exécution de tests de Cypress. Comme vous pouvez le voir sur la photo ci-dessous, des fichiers de tests sont affichés sur l'interface de Cypress. Ces fichiers ont été créés lors de l'exécution de la commande. Pour tester sur différents navigateurs, Cypress va tenter de trouver tous les navigateurs compatibles sur la machine. À l'heure où j'écris cet article, Cypress peut effectuer les scénarios de tests sur `Chrome`, `Chromium`, `Electron` et `Firefox`.

![Cypress test runner]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/cypress-test-runner.png)

L'exécution du script `yarn cypress` n'a pas seulement généré des fichiers de tests, mais aussi une architecture placée à la racine du code de votre application.

```
.
├── cypress
│   ├── fixtures
│   ├── integration
│   ├── plugin
│   └── support
├── src
│   └── ...
├── cypress.json
├── ...
```
Dans ce dossier `cypress` vous pouvez retrouver des exemples et des commentaires pour vous guider dans le développement de vos tests. Le fichier `cypress.json` est le fichier de configuration sur lequel Cypress va se baser pour faire les tests. Dans ce fichier nous allons ajouter l'url de notre application qui servira de préfix pour des commandes de Cypress comme `cy.visit()` ou `cy.request()`. C'est aussi une bonne pratique de stocker notre url afin qu'elle soit accessible dans tous nos tests. Pour en savoir plus sur les possibilités de configuration de Cypress cliquez [ici](https://docs.cypress.io/guides/references/configuration.html#Global)
```json
{
  "baseUrl": "http://localhost:3000"
}
```

**Écriture des tests**

Maintenant que nous avons installé et configuré Cypress, voyons comme écrire des tests.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>

Pour cette présentation de la mise en place des tests end-to-end avec Cypress, supposons que nous avons une application React permettant d'acheter des produits.

</div>

Un développeur doit savoir comment et quoi tester dans l'application. Écrire des tests sans signification qui augmentent la couverture du code mais ne testent pas la vraie fonctionnalité est une perte de temps.

Tout d'abord avant d'écrire ce test il faut avoir le scénario en tête :
 - L'utilisateur arrive sur le site
 - Il se connecte
 - Si les identifiants sont corrects, il arrive sur la liste des produits
 - Il sélectionne un produit
 - Le panier s'incrémente
 - Il clique sur le panier
 - Il arrive sur la page panier
 - Il valide son achat
 - Un message de confirmation apparait
(oui c'est un scénario assez court !)

Une fois que vous avez votre scénario, vous pouvez commencer à coder. Il suffit de créer votre fichier de tests dans le dossier de Cypress `cypress/integration`.

```javascript
const login = require("../../fixtures/login");

context("Login and buy stuff", () => {
  before(() => {
    cy.visit('/');
  });

  describe("Attempt to sign in", () => {
    it('should have link to sign in', () => {
      cy.get('[data-cy=signInBtn]').click();
    });

    it("Type data and submit form", () => {
      cy.get('[data-cy=email]')
        .type(login.email)
        .should("have.value", login.email);

      cy.get('[data-cy=password]')
        .type(login.password)
        .should("have.value", login.password);

      cy.get('[data-cy=submit]').click();
    });
  });

  describe("Buy stuff process", () => {
    it('url should be /shop', () => {
      cy.url().should("include", "/shop");
    });

    it('check the cart to be zero', () => {
      cy.get('[data-cy=cart]').contains(0);
    })

    it('click on stuff 2', () => {
      cy.get('[data-cy=stuff-1]').contains('Add');
      cy.get('[data-cy=stuff-1]').click();
    });

    it('increment the cart', () => {
      cy.get('[data-cy=cart]').contains(1);
    })

    it('click on cart', () => {
      cy.get('[data-cy=cart]').click();
    });

    it('redirect to cart view', () => {
      cy.url().should("include", "/cart");
    });

    it('purchase stuff and see confirm message', () => {
      cy.get('[data-cy=submit]').contains('PURCHASE');
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=success]').contains('Thank you for your purchase');
    });
  })
});
```

Lorsque vous souhaitez tester votre scénario, il suffit de cliquer sur le scénario voulu dans l'interface de Cypress et ce dernier le lancera dans le navigateur qui a été sélectionné.
Chaque ligne du test est répertoriée en détails (action, temps ...) sur l'interface de Cypress, la description des tests est séparée comme dans le code (`context`, `describe`, `it`).

![Cypress tests succeed]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/cypress-succeed.png)

Lorsque le test échoue, l'interface permet de débugger assez rapidement grâce aux messages d'erreurs assez explicites et aux snapshots de l'état avant et après au niveau du test qui a échoué.

![Cypress tests failed]({{ site.baseurl }}/assets/2020-09-02-test-e2e-cypress/cypress-failed.png)

## Conclusion

Voilà c'est tout pour aujourd'hui ! J'espère que cet article vous a donné envie d'utiliser Cypress dans vos développments ! Il y a beaucoup de possibilités d'utilisation avec Cypress, comme l'intégration continue avec la commande `cypress run` qui va jouer les tests et retourner les cas de réussite ou d'échecs.
Si vous souhaitez en savoir plus sur Cypress, je vous invite à regarder la [documentation](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes/) qui est très bien alimenté.
