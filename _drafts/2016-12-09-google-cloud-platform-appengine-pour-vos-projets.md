---
layout: post
title: Google Cloud Platform (2/3) - AppEngine pour vos projets
author: jonathan
date: '2016-12-09 14:37:53 +0100'
date_gmt: '2016-12-09 13:37:53 +0100'
categories:
- Javascript
- Dev Ops
tags:
- Google
- node
- cloud
- express
---

Vous avez souvent été bloqué dans vos projets parce qu'il est difficile de mettre en production.<br />
En effet, il faut des serveurs, les installer, les configurer et installer votre projet.<br />
Comment rendre cela plus simple ?

<!--more-->

Avant de commencer ce tutoriel, il faut suivre les 2 premières étapes du tutoriel Google Cloud Platform (1/3).

Dans le tutoriel d'aujourd'hui, nous allons utiliser la solution <a href="https://console.cloud.google.com/appengine">AppEngine</a>, qui vous permet de déployer facilement et directement depuis votre ordinateur votre application dans le Cloud.

Par défaut AppEngine permet d'installer du Java, du Php, du Go et du Python, mais il permet aussi d'installer du Node, c'est d'ailleurs sur cette technologie que nous allons partir.

##### Etape 1, installer le sdk Google Cloud Platform
Je vous invite à suivre les instructions disponibles <a href="https://cloud.google.com/sdk/docs/?hl=fr">ici</a>. Une fois l'installation terminée vous devriez pouvoir lancer la commande suivante dans votre terminal :

<span class="lang:sh decode:true crayon-inline ">gcloud -help</span>

Si ce n'est pas le cas, vérifiez votre installation.

##### Etape 2, créer votre projet node.js
Pour continuer nous allons faire simple en mettant en place un petit "Hello Word",  avec <a href="http://expressjs.com/fr/">Express.js</a>.<br />
Créez un nouveau dossier, ajoutez le fichier package.json :

<pre class="lang:js decode:true" title="package.json">
{% raw %}
//package.json
{
  "name": "hello-word",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.14.0"
  }
}
{% endraw %}
</pre>

Puis ajoutez le fichier index.js :

<pre class="lang:js decode:true " title="index.js">
{% raw %}
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
{% endraw %}
</pre>

Si vous lancez dans votre terminal :

<span class="lang:sh decode:true crayon-inline">npm install &amp;&amp; npm start</span>

Normalement si vous suivez le lien <a href="http://localhost:8080/">http://localhost:8080/</a>  un joli "Hello World!" s'affiche.

##### Etape 3, mettons du Cloud
Nous allons ajouter le fichier app.yaml qui permet de configurer votre AppEngine. Vous trouverez la documentation complète <a href="https://cloud.google.com/appengine/docs">ici</a>. Dans le fichier, nous allons mettre en place la configuration de base pour un environnement node.

<pre class="lang:yaml decode:true " title="app.yaml">
{% raw %}
runtime: nodejs
env: flex
{% endraw %}
</pre>

Comme vous pouvez le comprendre facilement, la première ligne permet de définir la technologie utilisée, la seconde ligne permet de choisir un environnement dit 'flex', ce qui signifie qu'il "s'auto scale" selon le trafic.

##### Etape 4, on met en production
La mise en prod est maintenant super simple, il vous suffit de vous mettre dans le dossier d'application et de lancer la commande suivante :

<span class="lang:sh decode:true crayon-inline ">gcloud app deploy --version version1</span>

L'option --version vous permet de donner un nom à votre version et de pouvoir la distinguer dans l'interface.

##### Etape 5, allons dans l'interface
Allez dans la console Cloud dans l'onglet <a href="https://console.cloud.google.com/appengine">AppEngine</a>.<br />
Puis dans "versions" vous devriez voir la version de votre projet apparaître.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.05.13.png"><img class="aligncenter size-large wp-image-2739" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.05.13-1024x370.png" alt="AppEngine - Google Cloud Platform" width="1024" height="370" /></a>

Quand le déploiement sera terminé, vous pourrez accéder à votre site en cliquant sur le nom de la version.<br />
Vous pouvez suivre les logs de l'application en lançant la commande suivante dans votre terminal :

<span class="lang:sh decode:true crayon-inline">gcloud app logs read -s default</span>

##### Etape 6, créons une nouvelle version
Dans index.js changeons le message du "Hello World!" avec par exemple :

<pre class="lang:js decode:true " title="Index.js V2">
{% raw %}
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World V2!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
{% endraw %}
</pre>

Puis lancez la commande :

<span class="lang:sh decode:true crayon-inline ">gcloud app deploy --version version2</span>

Dans l'interface AppEngine, vous devez voir la nouvelle version se lancer :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.13.55.png"><img class="aligncenter size-large wp-image-2740" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.13.55-1024x246.png" alt="AppEngine V2 - Google Cloud Platform" width="1024" height="246" /></a>

Google enverra 100% du trafic sur la nouvelle version dès que celle-ci sera lancée entièrement.<br />
Une fois le processus terminé vous pouvez choisir vous même comment répartir le trafic.

##### Etape 7, répartir le trafic
La répartition du trafic permet de gérer un changement de version progressif de votre application. Pour procéder à cette répartition rien de plus simple, sélectionnez les versions avec lesquelles vous voulez travailler et cliquez sur "Répartir le trafic".

Vous arrivez sur l'interface suivante :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.18.42.png"><img class="aligncenter size-large wp-image-2741" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.18.42-1024x736.png" alt="Répartir le traffic - Google Cloud Platform" width="1024" height="736" /></a>

##### Etape 8, Stopper les versions
Avant de partir, nous allons éteindre les versions, pour cela sélectionnez la version que vous souhaitez éteindre, puis cliquez sur "Arrêter".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.22.54.png"><img class="aligncenter size-large wp-image-2742" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.22.54-1024x427.png" alt="Arreter - Google Cloud Platform" width="1024" height="427" /></a>

Je vous invite à jouer un peu avec AppEngine, il permet de très vite tester vos POC sur de vrais serveurs, et même de maintenir une charge importante pour vos projets.

&nbsp;


