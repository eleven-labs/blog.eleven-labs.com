---
layout: post
title: "Tester son application avec Cypress"
excerpt: "Dans cette article nous allons voir comment mettre en place des tests end-to-end avec Cypress"
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

![]({{ site.baseurl }}/assets/2020-08-19-test-e2e-cypress/cypress-logo.jpg)

Les tests sont devenus un aspect essentiel du développement web, pour ces deux raisons : **vérifier** que l’application fonctionne correctement et **garantir** la meilleure expérience utilisateur possible. Il existe différents types de tests mais aujourd’hui nous allons nous concentrer principalement sur les **tests End-to-end** et comment les implémenter avec **Cypress**. 

## qu’est ce que les tests end to end

![]({{ site.baseurl }}/assets/2020-08-19-test-e2e-cypress/pyramid.png)

Tout d’abord avant de parler des tests end-to-end, il faut que je vous explique les deux premières couches de cette pyramide (on ne peut pas arriver au sommet sans grimper la montagne).

![]({{ site.baseurl }}/assets/2020-08-19-test-e2e-cypress/alright.gif)

**Les tests unitaires (TU)** constituent le socle des tests d’une application. Les TU permettent de tester uniquement un élément individuel de l’application (classe, fonction…).

**Les tests d’integrations** vérifient simplement que les différentes parties de votre programme, que vous avez testé individuellement via des tests unitaires, fonctionnent bien une fois intégrées ensemble. Le but est de créer des cas d'usages réels ou très proches du réel.

**Le test end-to-end** (aussi appelé e2e ou tests de bout-en-bout) est une méthode qui consiste à tester l'ensemble de l'application du début à la fin pour s'assurer que le flux d'application se comporte comme prévu. Il définit les dépendances système du produit et garantit que toutes les pièces intégrées fonctionnent ensemble comme prévu. L'objectif principal des tests de bout en bout (E2E) est de tester l'expérience de l'utilisateur final en simulant le scénario de l'utilisateur réel et en validant le système testé et ses composants pour l'intégration et l'intégrité des données.

Ces tests ignorent généralement la structure interne de l'ensemble de l’application et prennent le contrôle du navigateur comme un utilisateur allant sur votre application.

## Qu'est ce que Cypress ?
Il existe de nombreux outils de test de bout-en-bout pour les applications Web, tels que TestCafe, Puppeteer et Selenium. Chacun a ses avantages et ses inconvénients. **Donc pourquoi utiliser Cypress ?**

Cypress est un framework JS de tests end to end. C’est un outil open source permettant de mettre facilement en place ces tests d’applications utilisant React ou des frameworks JavaScript comme Vue, Angular et bien d’autres.

***"Fast, easy and reliable testing for anything that runs in a browser."***

Par rapport à d’autres outils de tests e2e, Cypress n’a pas besoin d’être couplé à une solution ni de driver pour sa mise en place. Sa mission est de rendre l’écriture des tests plus rapide (tests exécutés sur le navigateur), plus facile (écriture des tests en JavaScript avec Mocha, Chai et Sinon) et encore plus fiable (visibilité des tests effectués sur le navigateur, screenshot de l’erreur).

![]({{ site.baseurl }}/assets/2020-08-19-test-e2e-cypress/cypress-details.png)

Ce qui m'a poussé à vous parler aujourd'hui de Cypress est le fait que lors d'un projet j'ai eu l'occasion de pouvoir l'utiliser et de voir la simplicité d'installation et d'écriture des tests mais aussi de la robustesse de l'outil.

Ce qui démarque Cypress se décompose en plusieurs points :
 - Son architecture : Cypress fonctionne avec un serveur Node. Cypress communique avec ce serveur de manière synchrone ce qui permet de developper et tester ces scenarios en temps reels 
 - acces natif : comme cypress opère au sein meme de l’application ce qui lui permet de pouvoir interagir avec le DOM pour les tests. De plus, Cypress permet de modifier n'importe quel aspect du fonctionnement de l’application. Au lieu de tests lents et coûteux, tels que la création de l'état requis pour une situation donnée, vous pouvez créer ces états artificiellement comme vous le feriez dans un test unitaire (mocker des fonctions, modifier les code statut pour voir comme réagit l’application)
 - sa robustesse : Cypress est notifié du chargement d’une page, il exécute la grande majorité de ses commandes à l'intérieur du navigateur, il n'y a donc pas de décalage réseau. Lors de l’execution du scenario Cypress attend automatiquement que l’element du DOM soit visible (grace aux assertions) avant de passer à la suite 

Apres ce petit tour des avantages (non-exhaustifs) de Cypress voyons comment ca marche

## Mise en place

Comme expliqué plus haut, Cypress est simple et rapide à prendre en main. Pour installer Cypress sur votre projet JS, il vous suffit juste d'executer à la racine de votre projet : 

`npm install cypress --save-dev`
ou bien si vous utiliser yarn
`yarn add cypress -D`