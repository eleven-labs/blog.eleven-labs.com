---
layout: post
title: Devenez Dr. Manhattan avec Ionic
author: mehdy
date: '2015-05-18 15:17:20 +0200'
date_gmt: '2015-05-18 13:17:20 +0200'
categories:
- Javascript
tags:
- AngularJS
- Ionic
- Cordova
---

Après 14 versions beta et 5 release candidates, la première version stable de Ionic est disponible.

https://twitter.com/Ionicframework/status/598185812220465154

Ionic est un framework front-end  open source qui permet de produire des applications mobiles hybrides en HTML5.

Concrètement, Ionic est basé sur AngularJS 1.3 et offre des directives pour implementer rapidement les cas d’usage les plus récurrents : header, footer, scroll, menu, etc ...

**L'écosystème**

Ionic c’est un nombre impressionnant d’outils et services pour vous aider dans votre développement :

-   La documentation <http://ionicframework.com/docs/>
-   Le forum <http://forum.ionicframework.com/>
-   Une collection d’extension pour AngularJS <http://ngcordova.com/>
-   Un live chat <https://gitter.im/driftyco/ionic>
-   Un service de gestion de ses applications (envoi de notification push, mise à jour de l’application sans deploiement sur les stores, outils d’analityques, etc)  <https://apps.ionic.io/>
-   Une application pour le partage et la prévisualisation de vos applications avec vos testeurs <http://view.ionic.io/>
-   Un “playground” pour apprendre et tester les différentes parties du framework sans se soucier des difficultés de compilation et déploiement <http://play.ionic.io/>
-   Un outil de création en ligne pour livrer rapidement des prototypes <https://creator.ionic.io>

**Comment créer sa première application**

1- En pré-requis il vous faut NodeJS et installer la ligne de commande Ionic :

```sh
$ npm install -g ionic
```

2- Pour démarrer un nouveau projet, il suffit de taper :

```sh
$ ionic start myApp [starter]
```

L’équipe Ionic met à disposition une multitude de starters pour démarrer un projet : [Ionic Starter](https://github.com/driftyco?utf8=%E2%9C%93&query=starter)

Il est aussi possible d’utiliser l’url d’un CodePen, par exemple :

```sh
$ ionic start myApp http://codepen.io/ionic/pen/odqCz
```

3- A partir de là, vous pouvez déjà tester votre application dans un navigateur et profiter des joies du livereload

```sh
$ ionic serve
```

4- Ajouter les plateformes sur lesquelles vous souhaitez publier votre application :

```sh
$ ionic platform add android
$ ionic platform add ios
```

5- Pour installer l’application sur un appareil connecté à votre poste de travail :

```sh
$ ionic run android
$ ionic run ios
```

Avec Chrome il est possible de débugger directement l’application sur le téléphone en allant à l’adresse "chrome://inspect"

6- Une fois votre application prête pour la publication sur le store concerné :

```sh
$ ionic build --release android
$ ionic build --release ios
```

Vous obtiendrez un fichier compressé et optimisé à déposer sur le store.

**Quelques liens utiles**

[Ionic cheatsheet](http://devdactic.com/wp-content/uploads/2015/02/ionic-cheatsheet.png)

[100 Ionic framework resources](http://mcgivery.com/100-ionic-framework-resources/)

[Ionic CodePen](http://codepen.io/ionic/)

[Ionic Github](https://github.com/driftyco/ionic)

[Ionic-cli Github](https://github.com/driftyco/ionic-cli)
