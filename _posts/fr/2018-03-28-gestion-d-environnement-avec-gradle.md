---
layout: post
title: Gestion d'environnement avec Gradle
lang: fr
permalink: /fr/gestion-d-environnement-avec-gradle/
excerpt: "Gradle est un outil complexe dont la prise en main permet de faire de super choses, ici je vous offre un petit aperçu de toute ces possibilités..."
authors:
    - babas
categories:
    - Android
    - Kotlin
    - gradle
    - flavor
    - environnement
tags:
    - Android
    - Kotlin
    - gradle
    - flavor
    - environnement
cover: 
---


### Prérequis 
- Android Studio
- Gradle version 3.0 ou +

## Introduction
Salut ami astronaute ! Si tu es un peu novice sur l'utilisation de gradle, et ne l'utilise que pour implémenter tes dépendances, alors cet article devrait t'aider à faire un petit tour d'horizon du possible ! Je vais m'attaquer dans cette article à plusieurs problématiques communes que tu as surement du croiser, si ce n'est pas le cas, tu risque de le faire si tu continue plus profondément le développement natif Android !

## Build Type

Tout d'abord, avant de voir se que tu peux faire, regardons se qui est deja fait à la création d'un projet android :

![Gradle init]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I1.jpg)

Sans effort, gradle te genère un fichier build.gradle contenant une configugarion par défaut, defaultConfig, ou sont déclarer ton applicationId, tes versions de SDK et autres, ainsi que deux buildTypes debug et release. Ces deux BuildTypes ont pour but de séparer vos versions publiables de vos versions debuggables. Généralement votre build debug va contenir vos logs, vos tests et votre configuration de debug, la ou votre version de release va contenir les clés pour signer votre apk, potentiellement votre config proguard pour obfusquer votre code et autres. 

Ici modifions un peu le fichier, nous allons donner un nom de package différent à notre version de debug, et changer la valeur de minifyEnabled qui par défaut est à false, donc ne prend pas en compte les fichiers de config proguard !

![Gradle minifyEnabled]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I2.jpg)

Géneralement, notre version realease va signer l'application, nous allons donc définir une configuration de signature, signingConfigs, à notre buildtype release pour signer automatique notre apk à la compilation ! (Je passe à la trappe la création d'une clé pour signer l'apk, nous éloignant un peu du sujet principal, vous trouverez tout ce qu'il vous faut [ici](https://developer.android.com/studio/publish/app-signing.html) )

![Gradle signingConfig]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I3.jpg)

## Flavor & Dimension

Bon jusque là, rien de bien fou, on à séparer nos deux versions d'applications, mettons un peu plus de complexité !
Imaginons que vous ayez différents environnements pour votre application qui dépendent d'un serveur différent à chaque fois, une version de Dev, de PreProd et de Prod. Gradle vous permet de gérer ces multiples configurations sans avoir à ne rien préciser dans vos classe Java ! Je vous montre ? Aller on va donc déclarer ce qu'on appel une dimension de flavor, ici "server" ! 

![Gradle dimension]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I4.jpg)

Une fois déclaré nous allons créer nos flavors, Prod/Preprod/Dev, en précisant pour chacune de ces flavors qu'ils appartiennent à la dimension "server" :

![Gradle flavor]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I5.jpg)

Après avoir sync le projet, vous devriez voir apparaitre dans vos Build Variants les 6 builds ( 3 flavors x 2 build types ) !
Mais la puissance des dimensions ne s'arretent pas la !
Vous pouvez en effet rajouter des dimensions, multiplier la modulation de votre application. Prenons un exemple simple, imaginons qu'en plus de travailler sur plusieurs environnements, vous avez aussi differentes versions à devoir mettre à disposition sur le store, du type une application démo et une application complète, ou meme une application personnalisé pour un client A et une autre version personnalisée pour un client B. Rien de plus simple on va définir une deuxième dimension, et défnir nos deux flavors ! 
A noter tout de meme qu'il y a une hierarchie dans l'ordre de déclaration de vos dimensions, la premiere dimension déclarée étant plus importante que la seconde etc ..

![Gradle double dimension]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I6.png)

Maintenant vous êtes capable de coder sur vos deux versions d'application en même temps, tout en ayant la possibilités de générer vos versions pour l'ensemble de vos environnements de développement !
Mais comment personnaliser le code pour toute ces versions coexistantes en parallèle ?

## Personnalisation de code

Il faut savoir qu'à la création de chaque flavor, il vous est devenu possible de créer un repertoire du même nom que votre flavor dans votre repertoire src. A partir de ce moment, le champs du possible est vaste !

### Ressources : 
Vous pouvez dupliquer votre fichier res, et modifier l'ensembles des ressources qui y sont déclarer en fonction de vos versions. Un exemple simple ici je vais modifier la valeur du string app_name pour chacune de mes versions dev/prod/preprod pour qu au téléchargement nos testeurs par exemple soit sur d'être sur le bon envirronement, mais il aurait été possible de faire varier le design, les dimensions, modifier les icones en fonction des versions et j'en passe :

![Gradle res]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I7.png)

 A savoir, à la compilation, sur vos fichiers contenus dans votre répertoire main vont se merge tout les fichiers contenus dans les répertoires de vos flavors. Si il y a des clés, des noms de fichiers identiques, les valeurs des repertoires de flavor vont écraser celles contenues dans votre repertoire main. Ici la valeur d'app_name va, en fonction du build que vous choisissez, être remplacée ou non par les valeurs de nos flavors ! 

### BuildConfig : 
Android génère une classe BuildConfig, accessible partout, qui va vous permettre de connaitre programmatiquement à tout moment dans quelle version, quel flavor vous êtes ! Imaginons qu'une feature soit disponible uniquement en version complète, nous allons vérifier avant son lancement si l'on se trouve bien dans une version full ou afficher un log d'erreur pour notifier que l'utilisateur doit passer à la version complète :

![Gradle BuildConfig]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I8.png)

  Encore plus fort, il est possible de déclarer directement dans votre fichier build.gradle des champs, BuildFields, qui seront accessible depuis votre classe BuildConfig. Alors la encore à vous d'y trouver une utilité, je vous propose un petit exemple simple qui serait l'activation de vos log ou non en fonction de votre build type. 

![Gradle bluildFields]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I9.png)

  Imaginons que vous ayez centralisé l'envoie de vos log dans une classe LogManager, un simple accès à votre paramètre LOG dans BuildConfig va vous permettre de savoir si oui ou non, l'appel à votre classe va renvoyer un Log ou pas !
  
### Classe JAVA/Kotlin 
 Allons plus loin, imaginons qu'en fonction des versions, le code soit complétement différent, mettre des conditions partout devient vite une solution peu efficace avec des pavés de code pour chaque version, ça peut vite devenir le grand bazar ! Pour remédier à ça il est possible de créer plusieurs version de vos classe en fonction du flavor selectionné. Mais à la différence des fichiers de ressources vu précedement, si vous voulez pouvoir personnaliser une classe en particulier, et la rendre disponible dans tout votre code sans devoir spécifier de quel package elle appartient, il va falloir la retirer de votre répertoire main et créer une version pour chaque flavor d'une même dimension. Car à la différence des fichiers de ressources qui vont se merge avec ceux existant à la compilation, ici Android va juste selectionné quelle classe appelé en fonction de votre build. 

![Gradle duplicate]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I10.jpg)

  Ma classe ApiManager ici est disponible partout dans mon code et va pouvoir avoir un comportement différent en fonction du niveau de version de l'utilisateur en total transparance au niveau de ma classe MainActivity !

![Gradle use]({{site.baseurl}}/assets/2018-03-28-gestion-d-environnement-avec-gradle/I11.jpg)

C'est tout pour moi, j'aurais essayé de vous faire un petit tour d'horizon du possible avec gradle pour gérer vos envirronements,
éclatez vous bien et bon voyage !
