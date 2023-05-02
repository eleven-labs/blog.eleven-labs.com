---
lang: fr
date: '2020-09-30'
slug: meilleurs-outils-js-2020
title: |
  Les meilleurs outils du développeur en Js/React en 2020
excerpt: >
  Laissez-moi vous présenter quelques outils très pratiques, qui amélioreront
  grandement votre vie de développeur Js/React
authors:
  - kcordier
categories:
  - javascript
keywords:
  - react
  - ux
  - outils
  - aide
  - docker
  - chrome
  - npm
  - storybook
  - bit
  - browserstack
---

Que serait Batman sans ses Bat-gadgets ? Toujours un détective de génie et un combattant redoutable… mauvais exemple...
Que serait l’homme sans les outils ? Juste un Néandertalien, ou pire un Homo erectus. Ah oui là ça marche.

Tout ça pour dire que depuis la nuit des temps les hommes et femmes développent des outils pour grandement se faciliter la vie.

Le but de cette article est de vous présenter les meilleurs outils pour tous les Homo Reactus appelés aussi "développeurs et développeuses JS/React".

## Un ordinateur, duh !

Je ne vais pas vous faire l'affront de vous dire ce qu’est un ordinateur. Mais le mieux est bien sûr de vous équiper de votre bécane adorée avec votre OS favori, car oui il n’y a pas de distribution obligatoire pour travailler avec JS et React. Même sur windows c'est possible...

## Un IDE

Si d'un point de vue artistique vos lignes de code peuvent être considérés comme des coups de crayons, alors votre **IDE** (Integrated Development Environment) est votre chevalet, votre pinceau, votre toile et votre palette de couleurs.

Si vous souhaitez faire de votre code une œuvre d’art alors il est plus facile d’utiliser des boîtes à outils complètes comme les IDE modernes. Ils permettent entre autres :
*   Une navigation rapide et facile dans son code.
*   Une coloration syntaxique.
*   Une autocompletion de code.
*   Un affichage des erreurs à la volée.
*   Des outils de debugging.

Pour ma part j’ai longtemps utilisé **PhpStorm** et **WebStorm** de **IntelliJ** qui est un environnement de dev payant et très lourd mais qui fait un travail d’indexation exceptionnel me permettant d’avoir des aides rapides et une navigation parfaite entre mes composants. De plus il intègre la plupart des outils présentés plus bas ainsi que des options de collaborations comme Git et SVN.

Aujourd’hui j'utilise plutôt **VSCode** qui est un éditeur open source de Microsoft qui est beaucoup plus léger, mais qui couplé avec les nombreux plugins disponibles devient aussi complet qu’un WebStorm.

Si vous travaillez en équipe il vous sera très pratique d’inclure dans votre projet un **[.editorconfig](https://editorconfig.org/) **qui vous permettra automatiquement de régler certains paramètres afin de fournir un code style consistant entre tous les dev.

Il existe d'autres IDE très bon comme Atom et même des sandboxes en ligne comme CodeSandbox qui permettent aussi de travailler dans de bonnes conditions.

Et bien sûr, si vous êtes un fervent utilisateur de vim il faut rappeler que les premières œuvres d’art étaient réalisées à la main sur les murs de grottes.

## NVM

La première chose à faire quand on souhaite travailler avec n’importe quel framework/library javascript est sans nul doute d’installer NodeJS. Le problème est de savoir quelle version de Node installer. Selon les librairies il nous sera demandé de travailler avec une version très spécifique, ce qui rend le changement d’un projet à l’autre très compliqué. Pour cela il existe une solution qui est : [NVM](https://github.com/nvm-sh/nvm).

Node Version Manager est un logiciel permettant de faire cohabiter plusieurs versions de Node sur une même machine. Il est compatible avec Linux et Mac OS, et une version nvm-windows existe pour l’OS de Microsoft.

## Docker

![]({{ site.baseurl }}/assets/2020-09-30-meilleurs-outils-js-2020/docker.png)

Si vous ne voulez pas vous soucier de quelle version de Node vous utilisez, il existe une solution encore plus pratique : [Docker](https://blog.eleven-labs.com/fr/cheat-sheet-docker-tout-ce-que-vous-devez-savoir/).

Docker permet de faire tourner chaque partie de votre application dans des conteneurs, permettant une meilleure maîtrise de l'environnement de dev. Il permet aussi de garder une cohérence entre tous les environnements d’un groupe de travail, et une installation très rapide pour les nouveaux arrivants.

## Scripts NPM

Une fois Node installé, nous avons à disposition un fabuleux outil qui est NPM. Au-delà du fait qu'il permette de récupérer les packages liés à votre application, il vous donne aussi la possibilité de créer des scripts permettant d’automatiser et de simplifier des tâches qui seraient trop longues ou trop complexes à mémoriser.

Ils peuvent nous permettre de lancer notre application sur nos différents environnements, lancer nos tests unitaires et fonctionnels, ou reformater notre code d’une simple ligne dans notre terminal. Pour mettre en place un script, il vous suffit juste d'écrire votre code dans la section “scripts” de votre package.json.

## ESLint & Prettier

![]({{ site.baseurl }}/assets/2020-09-30-meilleurs-outils-js-2020/lint-prettier.jpg)

Quand on fait du travail collaboratif, parler le même langage c’est bien. Mais arriver à lire les autres c’est encore mieux. Comme il existe autant de manières de coder qu’il y a de développeurs, on a besoin d’un outil qui permette d’uniformiser notre manière d'écrire pour permettre de nous concentrer sur d’autres aspects de notre travail. Ce genre d’outils existe et se nomme “linteur”. Il en existe pour à peu près tous les langages et celui de javascript s'appelle [ESLint](https://eslint.org/). Il marche grâce à un système de “rules” qui peuvent être décrites dans un fichier spécifique inclus à votre projet. Parmis ces “rules” on retrouve des règles de formatage, comme par exemple le nombre de caractères maximum pour une ligne, ou la nomenclature des variables et fonctions. Mais on trouve surtout des règles de bonne pratique régissant la qualité du code qui peuvent nous prévenir d'éventuels bugs.

Couplé à ESLint j’utilise aussi [Prettier](https://github.com/prettier/prettier), qui est une librairie de formatage de fichier très populaire, qui s’occupe d'analyser la forme de notre code pour le rendre plus harmonieux.

Ces outils peuvent facilement être appelés via nos scripts NPM et branchés à votre CI pour une analyse constante et une fiabilité toujours au top.

## Husky

Git est un outil formidable mais il devient encore plus fabuleux quand on utilise des hooks.

Les hooks sont des scripts à lancer lors d'événements particuliers. Pour Git, vous pouvez utiliser la librairie [Husky](https://github.com/typicode/husky). Elle va vous donner la possibilité de déclencher des scripts avant et après chaque commit, push, pull, checkout, merge ou rebase de votre travail. Avec cet outil vous allez pouvoir par exemple lancer les tests et le fix de lint avant chaque commit afin de ne jamais pousser du contenu de mauvaise qualité ou déclencher l’installation des paquets lors d’un merge de votre package.json pour toujours être à jour en dev.

## Un framework de test

Tout bon code doit être testé, mais faire des tests peut être très fastidieux. C’est pour cela qu'il existe des frameworks qui facilitent grandement leur écriture.

Du côté des tests unitaires, il existe [Jest](https://jestjs.io/) ou [Mocha](https://mochajs.org/).

Pour les tests End to End je vous conseille [Cypress](https://www.cypress.io/).

## Chrome dev tool

Tous les web developers qui travaillent avec le navigateur de Google vous le diront, la console de Chrome est incroyable que ce soit pour logger, debbuger, analyser le network, etc… il existe un outil inclus. Mais à côté de toutes ces fonctionnalités qui existent aussi sur les autres navigateurs, il y en a une qui nous intéresse particulièrement, c’est Lighthouse.

![]({{ site.baseurl }}/assets/2020-09-30-meilleurs-outils-js-2020/lighthouse.jpg)

Lighthouse est un programme open source qui permet en un clic de générer des audits de votre application pour mobile ou desktop et ce sur plusieurs aspects, qui sont:
*   Les performances
*   Les bonnes pratiques
*   Le SEO
*   L’accesibilité

C’est donc un outil tout-en-un qui est disponible en ligne de commandes, en module node ou en service web, pour pouvoir être utilisé de la manière que l’on souhaite, comme par exemple avec votre CI.

## React developper tools

Tant que l’on est sur les outils inclus au navigateur, je vous conseille le plugin Chrome et Firefox **React developper tools** qui vous permet d’aller au plus profond de vos composants pour voir leur état en temps réel et monitorer leur renders d’un coup d'œil.

## WhyDidYouRender

En parlant de render, ne vous êtes vous jamais demandé pourquoi vos composants déclenchent leur rendu sans que vous ne leur en ayez donné l’ordre ? Pour répondre à cette question il existe une librairie très pratique qui se nomme [WhyDidYouRender](https://github.com/welldone-software/why-did-you-render), qui peut facilement s’inclure dans l'environnement de dev de votre application et qui, grâce à une ligne à ajouter à votre composant, affiche les raisons de son re-render en temps réel dans votre console. Cet outil va grandement vous aider à optimiser votre application en empêchant le travail inutile de rendu de certains de vos composants.

## Storybook

![]({{ site.baseurl }}/assets/2020-09-30-meilleurs-outils-js-2020/storybook.png)

Si comme moi vous avez adopté la méthodologie [BEM](https://blog.eleven-labs.com/fr/retour-d-experience-sur-bem/), alors vous connaissez la nécessité d’avoir des composants unitaires, avec un affichage et un comportement uniforme à chaque utilisation. Pour aider à travailler dans ce sens il existe l’outil open source [Storybook](https://storybook.js.org/), qui est disponible pour React, Vue et Angular et qui permet de facilement créer et maintenir vos composants pour une meilleure réutilisabilité. Pour en savoir plus une suite d’articles est disponible sur notre [blog](https://blog.eleven-labs.com/fr/Storybook-creer-son-premier-composant/).

## Bit

Une fois vos jolis composants créés et réutilisables, vous avez la possibilité de facilement les partager entre vos différentes équipes grâce à un fabuleux outil qui s'appelle [Bit](https://github.com/teambit/bit).

## BrowserStack

Plus la demande de compatibilité d’une application avec les navigateurs est grande et plus le développement en devient pénible. Avec le nombre de navigateurs/lecteurs et leurs versions toujours en augmentation il devient très compliqué de tester son site sur tous les supports. C’est pour cette raison qu’existent les services comme [BrowserStack](https://www.browserstack.com/) qui permettent en un seul endroit de tester son application dans plus de 2000 configurations différentes. C’est un service payant qui vous propose une version light gratuite.

## Graphql code generator

Si vous travaillez avec GraphQL et TypeScript, il devient très rébarbatif de re-décrire chaque retour ou input de query en type TypeScript. C’est pour cela que je vous présente [Graphql code generator](https://graphql-code-generator.com/) qui est un outil CLI qui va automatiquement générer les types TypeScript à partir de vos fichiers .graphql ou à partir de votre schéma en ligne. De plus, cette lib peut aussi vous générer automatiquement des hooks à utiliser dans votre code.

## npm-check-updates

La gestion des versions de package npm de votre application peut être compliquée. [npm-check-updates](https://github.com/raineorshine/npm-check-updates) est là pour automatiquement chercher les versions de vos packages afin d’éviter les problèmes de compatibilité entre vos différentes librairies. Il peut être installé via NPM en global ou en devDependency directement dans votre application.

## Bundlephobia

![]({{ site.baseurl }}/assets/2020-09-30-meilleurs-outils-js-2020/bundlephobia.png)

[Bundlephobia](https://bundlephobia.com/) est un site très pratique permettant de rechercher et d’afficher les informations d’un package npm afin de connaître son poids (minifier ou gziper), son temps de chargement ainsi que toutes ses dépendances selon ses versions. Il permet aussi de scanner votre package.json pour y retrouver toutes les informations de votre application.

## Webpack visualizer

![]({{ site.baseurl }}/assets/2020-09-30-meilleurs-outils-js-2020/webpack-visualizer.png)

Comme Bundlephobia, [Webpack visualizer](https://chrisbateman.github.io/webpack-visualizer/) vous permet de scanner votre application afin de connaître le poids de vos différentes librairies au sein de votre application. Cette application est spécifique aux utilisateurs de webpack et contrairement à l'outil que je vous ai montré précédemment, il existe aussi sous forme de plugin qui nous donne la possibilité de faire une analyse pour une partie spécifique de notre application.

Voilà ! On a fait le tour de ce que je voulais vous présenter ! J'espère que tout ou partie de ces outils sauront vous être utiles à vous aussi, et je vous dis à la prochaine pour un nouvel article ;)
