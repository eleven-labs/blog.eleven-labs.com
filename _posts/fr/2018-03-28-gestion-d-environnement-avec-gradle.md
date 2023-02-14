---
layout: post
lang: fr
date: '2018-03-28'
categories: []
authors:
  - babas
cover: /assets/2018-03-28-gestion-d-environnement-avec-gradle/cover.jpg
excerpt: >-
  Gradle est un outil complexe dont la prise en main permet de faire de super
  choses. Ici, je vous offre un petit aperçu de toutes ces possibilités...
title: Gestion d'environnement avec Gradle
slug: gestion-d-environnement-avec-gradle
oldCategoriesAndTags:
  - android
  - kotlin
  - gradle
  - flavor
  - environnement
permalink: /fr/gestion-d-environnement-avec-gradle/
---


### Prérequis
- Android Studio
- Gradle version 3.0 ou +

## Introduction
Salut ami astronaute ! Si tu es novice sur gradle, et ne l'utilise que pour implémenter tes dépendances, alors cet article devrait t'aider à faire un petit tour d'horizon du possible ! Je vais m'attaquer à plusieurs problématiques communes que tu as sûrement dû croiser. Si ce n'est pas le cas, tu risques de le faire si tu continues plus profondément le développement natif Android !

## Build Type

Tout d'abord, avant de voir ce qu'il est possible de faire, regardons ce qui est déjà fait à la création d'un projet android.

Si vous regardez votre projet, vous devriez voir deux fichiers build.gradle. Le premier va avoir pour rôle de gérer les informations communes à tous les modules présents dans votre projet. Il est donc souvent utilisé pour gérer les répertoires d'où viennent vos dépendances, pour définir des variables communes à tout vos modules, du type la version d'android minimum, voire la version de gradle utilisée, et j'en passe. Mais ce n'est pas ce fichier qui va nous intéresser.

Nous allons nous intéresser au deuxieme fichier qui correspond à notre module applicatif. Jetons-y un oeil :

![Gradle init]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I1.jpg)

Sans effort, gradle genère un fichier build.gradle contenant une configugarion par défaut, defaultConfig, où sont déclarés : votre applicationId, vos versions de SDK et autres, ainsi que deux buildTypes debug et release.

Ces deux BuildTypes ont pour but de séparer vos versions publiables de vos versions debuggables. Généralement le build debug va contenir vos logs, tests et configuration de debug, là ou votre version de release va contenir les clés pour signer votre apk, potentiellement votre config proguard pour obfusquer votre code et autres.

Ici modifions un peu le fichier, nous allons donner un nom de package différent à notre version de debug, et changer la valeur de minifyEnabled qui par défaut est à false, donc ne prenez pas en compte les fichiers de config proguard !

![Gradle minifyEnabled]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I2.jpg)

Géneralement, notre buildType realease va signer l'application. Il est aussi possible que vous ayez besoin de le faire en debug, mais disons que globalement c'est plus souvent un rôle qui incombe au buildType release.

Nous allons donc définir une configuration de signature, signingConfigs, à notre buildtype release pour signer automatiquement notre apk à la compilation ! (Je passe à la trappe la création d'une clé pour signer l'apk, nous éloignant un peu du sujet principal, vous trouverez tout ce qu'il vous faut [ici](https://developer.android.com/studio/publish/app-signing.html) )

![Gradle signingConfig]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I3.jpg)

## Flavor & Flavor Dimension

Bon jusque là, rien de bien fou, on à séparé nos deux versions d'applications...

Maintenant, rajoutons un peu plus de complexité !
Imaginons que vous ayez différents environnements pour votre application, qui dépendent d'un serveur différent à chaque fois, une version de Dev, de PreProd et de Prod. Gradle vous permet de gérer ces multiples configurations sans avoir à préciser quoi que ce soit dans vos classes Java !

Je vous montre ? Allez, on va donc déclarer ce qu'on appelle une dimension de flavor, ici "server" !

![Gradle dimension]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I4.jpg)

Une fois cette dimension déclarée, nous allons créer nos flavors, Prod/Preprod/Dev, en précisant pour chacun de ces flavors qu'ils appartiennent à la dimension "server" :

![Gradle flavor]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I5.jpg)

Après avoir sync le projet, vous devriez voir apparaitre dans vos Build Variants les 6 builds ( 3 flavors x 2 build types ) !
Mais la puissance des flavors ne s'arrete pas là ! Vous pouvez en effet rajouter des dimensions, et multiplier la modulation de votre application.

Prenons un exemple simple, imaginons qu'en plus de travailler sur plusieurs environnements, vous ayez aussi différentes versions à devoir mettre à disposition sur le store, du type une application démo et une application complète, ou même une application personnalisée pour un client A et une autre version personnalisée pour un client B.

Rien de plus simple ! On va définir une deuxième dimension, et défnir nos deux flavors !

À noter tout de même qu'il y a une hiérarchie dans l'ordre de déclaration de vos dimensions. La première dimension déclarée étant plus importante que la seconde etc...

![Gradle double dimension]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I6.png)

Maintenant, vous êtes capable de coder sur vos deux versions d'application en même temps, tout en ayant la possibilité de générer vos versions pour l'ensemble de vos environnements de développement !
Mais comment personnaliser le code pour toutes ces versions coexistantes en parallèle ?

## Personnalisation de code

Il faut savoir qu'à la création de chaque flavor, il vous est devenu possible de créer un repertoire du même nom que votre flavor dans votre repertoire src. À partir de ce moment, le champ du possible est vaste !

### Ressources :
Vous pouvez dupliquer votre fichier res, et modifier l'ensemble des ressources qui y sont déclarées en fonction de vos versions.

Un exemple simple : ici je vais modifier la valeur du string app_name pour chacune de mes versions dev/prod/preprod pour qu'au téléchargement nos testeurs par exemple soient sûrs d'être sur le bon environemment.

Mais il aurait été possible de faire varier le design, les dimensions, modifier les icônes en fonction des versions et j'en passe :

![Gradle res]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I7.png)

À savoir, à la compilation, sur les fichiers contenus dans votre répertoire main vont se merge tous les fichiers contenus dans les répertoires de vos flavors. Si il y a des clés, des noms de fichiers identiques, les valeurs des répertoires de flavor vont écraser celles contenues dans votre repertoire main. Ici la valeur d'app_name va, en fonction du build que vous choisissez, être remplacée ou non par les valeurs de nos flavors !

### BuildConfig :

Android génère une classe BuildConfig, accessible partout, qui va vous permettre de connaître programmatiquement à tout moment dans quelle version, quel flavor vous êtes !

Imaginons qu'une feature soit disponible uniquement en version complète, nous allons vérifier avant son lancement si l'on se trouve bien dans une version full, ou si l'on doit afficher un log d'erreur pour notifier que l'utilisateur doit passer à la version complète :

![Gradle BuildConfig]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I8.png)

Encore plus fort, il est possible de déclarer directement dans votre fichier build.gradle des champs, BuildFields, qui seront accessibles depuis votre classe BuildConfig. Alors là, encore à vous d'y trouver une utilité.

Je vous propose un petit exemple simple qui serait l'activation de vos logs ou non en fonction de votre build type :

![Gradle bluildFields]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I9.png)

Imaginons que vous ayez centralisé l'envoi de vos logs dans une classe LogManager, un simple accès à votre paramètre LOG dans BuildConfig va vous permettre de savoir si oui ou non, l'appel à votre classe va renvoyer un Log ou pas !

### Classe JAVA/Kotlin
Allons plus loin. Imaginons qu'en fonction des versions, le code soit complétement différent. Mettre des conditions partout devient vite une solution peu efficace, et avec des pavés de code pour chaque version, ça peut vite devenir le grand bazar !

Pour remédier à ça il est possible de créer plusieurs versions de vos classes en fonction du flavor selectionné. Mais à la différence des fichiers de ressources vu précédemment, si vous voulez pouvoir personnaliser une classe en particulier, et la rendre disponible dans tout votre code sans devoir spécifier à quel package elle appartient, il va falloir la retirer de votre répertoire main et créer une version pour chaque flavor d'une même dimension. Car à la différence des fichiers de ressources qui vont se merge avec ceux existants à la compilation, ici Android va juste sélectionner quelle classe appeler en fonction de votre build.

![Gradle duplicate]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I10.jpg)

Ma classe ApiManager ici est disponible partout dans mon code et va pouvoir avoir un comportement différent en fonction du niveau de version de l'utilisateur en totale transparence au niveau de ma classe MainActivity !

![Gradle use]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I11.jpg)

C'est tout pour moi, j'espère que vous aurez apprécié ce petit tour d'horizon du potentiel de la gestion de vos environemments avec Gradle, éclatez-vous bien et bon voyage !
