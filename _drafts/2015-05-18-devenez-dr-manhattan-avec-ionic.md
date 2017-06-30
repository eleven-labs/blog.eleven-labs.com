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

<ul>
<li>La documentation <a href="http://ionicframework.com/docs/">http://ionicframework.com/docs/</a></li>
<li>Le forum <a href="http://forum.ionicframework.com/">http://forum.ionicframework.com/</a></li>
<li>Une collection d’extension pour AngularJS <a href="http://ngcordova.com/">http://ngcordova.com/</a></li>
<li>Un live chat <a href="https://gitter.im/driftyco/ionic">https://gitter.im/driftyco/ionic</a></li>
<li>Un service de gestion de ses applications (envoi de notification push, mise à jour de l’application sans deploiement sur les stores, outils d’analityques, etc)  <a href="https://apps.ionic.io/">https://apps.ionic.io/</a></li>
<li>Une application pour le partage et la prévisualisation de vos applications avec vos testeurs <a href="http://view.ionic.io/">http://view.ionic.io/</a></li>
<li>Un “playground” pour apprendre et tester les différentes parties du framework sans se soucier des difficultés de compilation et déploiement <a href="http://play.ionic.io/">http://play.ionic.io/</a></li>
<li>Un outil de création en ligne pour livrer rapidement des prototypes <a href="https://creator.ionic.io">https://creator.ionic.io</a></li>
</ul>
**Comment créer sa première application**

1- En pré-requis il vous faut NodeJS et installer la ligne de commande Ionic :

<pre class="lang:sh decode:true ">
{% raw %}
$ npm install -g ionic{% endraw %}
</pre>

2- Pour démarrer un nouveau projet, il suffit de taper :

<pre class="lang:sh decode:true ">
{% raw %}
$ ionic start myApp [starter]{% endraw %}
</pre>

L’équipe Ionic met à disposition une multitude de starters pour démarrer un projet : <a href="https://github.com/driftyco?utf8=%E2%9C%93&amp;query=starter">Ionic Starter</a>

Il est aussi possible d’utiliser l’url d’un CodePen, par exemple :

<pre class="lang:sh decode:true">
{% raw %}
$ ionic start myApp http://codepen.io/ionic/pen/odqCz{% endraw %}
</pre>

3- A partir de là, vous pouvez déjà tester votre application dans un navigateur et profiter des joies du livereload

<pre class="lang:sh decode:true">
{% raw %}
$ ionic serve{% endraw %}
</pre>

4- Ajouter les plateformes sur lesquelles vous souhaitez publier votre application :

<pre class="lang:sh decode:true ">
{% raw %}
$ ionic platform add android
$ ionic platform add ios{% endraw %}
</pre>

5- Pour installer l’application sur un appareil connecté à votre poste de travail :

<pre class="lang:sh decode:true">
{% raw %}
$ ionic run android
$ ionic run ios{% endraw %}
</pre>

Avec Chrome il est possible de débugger directement l’application sur le téléphone en allant à l’adresse "chrome://inspect"

6- Une fois votre application prête pour la publication sur le store concerné :

<pre class="lang:sh decode:true">
{% raw %}
$ ionic build --release android
$ ionic build --release ios
{% endraw %}
</pre>

Vous obtiendrez un fichier compressé et optimisé à déposer sur le store.

**Quelques liens utiles**

<a href="http://devdactic.com/wp-content/uploads/2015/02/ionic-cheatsheet.png">Ionic cheatsheet</a>

<a href="http://mcgivery.com/100-ionic-framework-resources/">100 Ionic framework resources</a>

<a href="http://codepen.io/ionic/">Ionic CodePen</a>

<a href="https://github.com/driftyco/ionic">Ionic Github</a>

<a href="https://github.com/driftyco/ionic-cli">Ionic-cli Github</a>


