---
layout: post
title: Votre première PWA
author: jonathan
date: '2016-07-20 15:21:41 +0200'
date_gmt: '2016-07-20 13:21:41 +0200'
categories:
- Javascript
tags:
- tutoriel
- cache
- Javascript
- web
- pwa
---
{% raw %}
<p>Le monde du web évolue. Le site web mobile est devenu le plus grand concurrent aux applications natives, et Google l'a bien compris. Si vous avez suivi la conférence de Google à Amsterdam , vous savez que l'avenir des sites web mobiles sont les Progressive Web Apps (le cas contraire, je vous invite à lire mon précédent article sur cet événement, disponible <a href="http://blog.eleven-labs.com/fr/progressive-web-apps-au-googledevsummit/" target="_blank">ici</a>). Ça tombe bien, cet article va vous permettre de mettre en place votre première "PWA".</p>
### <!--more--> Pré-requis :
<p>Avant de commencer ce tutoriel:</p>
<ul>
<li>Je vous invite à mettre à jour ou installer nodejs, toutes les explications pour ce faire sont disponibles <a href="https://nodejs.org/en/" target="_blank">ici</a>.</li>
<li>Il vous faudra aussi une version de chrome avancée, telle que Canary, disponible <a href="https://download-chromium.appspot.com/" target="_blank">ici</a>.</li>
<li>Une fois l'installation de votre chrome Canary, je vous invite à installer l'extension suivante, disponible <a href="https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk" target="_blank">ici</a>.</li>
<li>Durant l'ensemble du tutoriel, nous allons suivre le projet git suivant, disponible <a href="https://github.com/CaptainJojo/pwa" target="_blank">ici</a>.</li>
</ul>
### Étape 1, l'installation :
<p>L'installation du projet est très simple (suivez le README) ou les étapes suivantes :</p>
<pre class="lang:sh decode:true ">git clone git@github.com:CaptainJojo/pwa.git</pre>
<p>Puis allez dans le répertoire pwa et lancez l'installation.</p>
<pre class="lang:sh decode:true ">cd pwa &amp;&amp; npm install</pre>
<p>Une fois l'installation terminée, vous n'avez plus qu'à lancer le serveur.</p>
<pre class="lang:sh decode:true ">npm start</pre>
<p>Si tout se passe bien, l'application est disponible sur <a href="http://localhost:8080/">cette adresse localhost</a>.</p>
<p>Vous pouvez alors naviguer dans l'application, son seul but étant d'avoir quelques urls et d'afficher des images (ce qui n'a que peu d'intérêt). Je vous invite à lancer l'extension installée plus tôt. Vous devez arriver sur cette page :</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-18.16.05.png"><img class="aligncenter wp-image-2011 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-18.16.05-1024x587.png" alt="Lighthouse Step1" width="1024" height="587" /></a></p>
<p>Cette extension génère une note sur 100 pour votre application. Plus la note est proche de 100, plus votre application est une progressive web app. Comme vous pouvez le lire, il y a deux choses principales qui permettent de gagner des points : la mise en oeuvre d'un service worker qui permet d'avoir une application offline et la mise en place d'un manifest notifiant le navigateur que "vous êtes une progressive web app" et donc installable sur votre téléphone.  Nous allons commencer par mettre en place le service worker.</p>
### Étape 2, le service worker :
<p>Le service worker est un simple fichier js à enregistrer dans le navigateur (s'il est compatible), une fois enregistré, il peut lancer du code sans que vous soyez connecté à internet. La première chose à faire est donc d'enregistrer un fichier js dans le navigateur.</p>
<p>Nous allons tout d'abord créer un fichier vide sw.js dans le dossier public.</p>
<pre class="lang:sh decode:true ">touch public/sw.js</pre>
<p>Puis, pour enregistrer le service worker, il vous suffit d'ajouter le code suivant dans le fichier public/index.html</p>
<pre class="lang:xhtml decode:true " title="Enregistrement d'un service worker">&lt;script&gt;
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/sw.js')
           .then(function() { console.log("Service Worker Registered"); });
}
&lt;/script&gt;</pre>
<p>Vous pouvez retrouver cette étape <a href="https://github.com/CaptainJojo/pwa/compare/step1-register-sw" target="_blank">ici</a>.</p>
<p>Il vous suffit alors de relancer le serveur. Si vous allez sur http://localhost:8080 et que vous ouvrez l'outil de développement, vous trouverez l'onglet application qui vous permet de gérer l'état de votre PWA. Je vous invite à cliquer sur "Service Workers" pour vérifier que vous avez bien un service enregistré pour votre site.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.34.26.png"><img class="aligncenter wp-image-2014 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.34.26-1024x820.png" alt="Enregistrer votre service worker" width="1024" height="820" /></a></p>
<p>Fermez l'outil de développement et relancez l'extension Lighthouse.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.36.15.png"><img class="aligncenter wp-image-2015 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.36.15-1024x477.png" alt="LightHouse - Enregistrez votre service worker" width="1024" height="477" /></a></p>
<p>Bravo, vous avez gagné des points ! Passons à la suite.</p>
### Étape 3, le offline :
<p>Maintenant que vous avez enregistré votre service nous allons mettre en cache le site pour vous permettre d'avoir un site visible en offline.</p>
<p>Pour cela, il suffit d'agrémenter le fichier sw.js. Si vous lisez la norme du W3C sur le service worker, disponible <a href="https://www.w3.org/TR/service-workers/" target="_blank">ici</a>, vous verrez qu'il fonctionne comme suit : il lit des événements javascript et, en fonction de ce qui a été lu, il effectue une action. Nous allons commencer par l’événement 'install' qui va vous permettre de mettre en cache l'ensemble des pages statiques de votre site. Voici le code à ajouter dans le fichier public/sw.js :</p>
<pre class="lang:js decode:true " title="Service worker - install">self.addEventListener('install', e =&gt; {
  e.waitUntil(
    caches.open('pwa').then(cache =&gt; {
      return cache.addAll([
        '/',
        '/sw.js',
        '/index.html',
        '/planets',
        '/bundle.js',
        '/index.css',
        '/cat.png',
        '/duck.png',
        '/donut.png',
        '/racoon.png',
      ])
      .then(() =&gt; self.skipWaiting());
    })
  )
});</pre>
<p>Comme vous pouvez le lire, quand l’événement est lancé, on ouvre un cache au nom 'pwa' et on lui ajoute les fichiers statiques.</p>
<p>Si vous relancez l'application, vous pouvez alors mettre en "offline" dans l'outil de développement puis dans l'onglet applications, bien que cela ne devrait pas encore fonctionner car nous n'avons pas pris en compte les appels serveur. Pour cela, vous allez récupérer l’événement 'fetch' qui permet de récupérer ces appels serveurs en question.</p>
<p>Vous ajoutez dans le fichier public/sw.js, le code suivant :</p>
<pre class="lang:js decode:true " title="Service Worker - Fetch">self.addEventListener('fetch', event =&gt; {
  event.respondWith(
    caches.match(event.request).then(response =&gt; {
      return response || fetch(event.request);
    })
  );
});</pre>
<p>Ce que l'on fait est simple, vous récupérez chaque requête et la mettez dans le cache.</p>
<p>Vous retrouverez cette étape <a href="https://github.com/CaptainJojo/pwa/compare/step1-register-sw...step2-service-worker-offline" target="_blank">ici</a>.</p>
<p>Si vous relancez l'application, vous pouvez voir dans l'outil de développement, onglet application, un lien pour voir ce que contient votre cache (Cache Storage), vous y retrouvez l'ensemble des fichiers statiques.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.54.56.png"><img class="aligncenter wp-image-2017 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.54.56-1024x801.png" alt="Service worker - Cache Storage" width="1024" height="801" /></a></p>
<p>Puis, encore une fois, fermez l'outil de développement, et relancez LightHouse.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.57.34.png"><img class="aligncenter wp-image-2018 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-19.57.34-1024x581.png" alt="LightHouse - Offline" width="1024" height="581" /></a></p>
<p>Vous êtes sur la bonne voie, mais il y a une méthode encore meilleure pour initialiser votre cache.</p>
### Étape 4, PreCache du service worker :
<p>Comme vous avez pu le voir, il est très fastidieux de mettre chaque fichier statique dans le service worker, Google y a pensé et a mis en place plusieurs outils pour faciliter le développement.</p>
<p>Vous allez utiliser le projet sw-précache disponible sur <a href="https://github.com/GoogleChrome/sw-precache" target="_blank">github</a>, ce dernier permet de générer le service worker via un fichier <a href="http://gulpjs.com/" target="_blank">Gulp</a>.</p>
<p>Vous n'avez plus qu'à ajouter dans le package.json.</p>
<pre class="lang:js decode:true " title="Package.json">"sw-precache": "^3.2.0",
"gulp": "^3.9.1",</pre>
<p>Et faire un</p>
<pre class="lang:sh decode:true ">npm install</pre>
<p>Vous pouvez alors ajouter un fichier Gulpfile.js qui contiendra la configuration pour votre service worker.</p>
<pre class="lang:js decode:true" title="Gulpfile - service worker">'use strict';

// Include Gulp &amp; Tools We'll Use
var gulp = require('gulp');

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'public';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif}'],
    stripPrefix: rootDir,
    navigateFallback: '/',
    runtimeCaching: [{
      urlPattern: /\/planet/,
      handler: 'cacheFirst'
    }],
    verbose: true

  }, callback);
});</pre>
<p>En lisant le fichier, vous pouvez voir que lors de l'initialisation du sw-precache vous avez plusieurs clés de configuration. La première est la 'staticFileGlobs' qui permet d'aller chercher l'ensemble des fichiers statiques. Vous avez ensuite le 'runtimeCaching' qui permet de cacher les requêtes qui vont vers le serveur. Il vous suffit de choisir un pattern d'url et une façon de cacher, sachant qu'il existe plusieurs 'handler' :</p>
<ul>
<li>cacheFirst : Prend ce qui se trouve dans le cache, s'il est vide, envoie la requête au serveur.</li>
<li>networkFirst : Envoie le requête au serveur, s'il ne répond pas prend ce qu'il y a dans le cache.</li>
<li>fastest : Envoie la requête au serveur et va chercher dans le cache, prend celui qui répond en premier.</li>
</ul>
<p>Pour générer le fichier, il ne vous reste plus qu'à lancer la commande suivante :</p>
<pre class="lang:sh decode:true ">gulp generate-service-worker</pre>
<p>Je vous invite à lire le fichier généré que vous pouvez trouver à la place de l'ancien /public/sw.js</p>
<p>Si vous relancez l'application normalement vous n'avez aucune modification.</p>
<p>Vous pouvez retrouver l'étape <a href="https://github.com/CaptainJojo/pwa/compare/step2-service-worker-offline...step3-sw-precache" target="_blank">ici</a>.</p>
### Étape 5, le manifest :
<p>La mise en place du manifest est une étape simple mais qui permet de signifier aux navigateurs que vous avez créé votre première PWA.  Vous pouvez retrouver la spécification sur le site <a href="https://w3c.github.io/manifest/" target="_blank">W3C</a>.</p>
<p>Je vous donne l'exemple typique que l'on trouve dans tous les bons tutoriels.</p>
<pre class="lang:js decode:true" title="manifest.json">{
  "name": "My PWA",
  "short_name": "PWA",
  "icons": [{
        "src": "images/touch/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png"
      }, {
        "src": "images/touch/apple-touch-icon.png",
        "sizes": "152x152",
        "type": "image/png"
      }, {
        "src": "images/touch/ms-touch-icon-144x144-precomposed.png",
        "sizes": "144x144",
        "type": "image/png"
      }, {
        "src": "images/touch/chrome-touch-icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      }],
  "start_url": "/",
  "display": "standalone",
  "background_color": "#3E4EB8",
  "theme_color": "#2F3BA2"
}</pre>
<p>Il est très lisible puisque vous y trouvez le nom de votre application, les icônes utilisés lors de l'installation sur le téléphone et les couleurs pour le splashScreen.  La clé 'display' vous permet de choisir l'orientation du téléphone lors de l'installation, soit horizontale, verticale ou 'standalone' qui permet de laisser l'utilisateur choisir.</p>
<p>Une fois le fichier rempli, vous devez signifier son emplacement pour le navigateur. Dans le header de la page, il faut ajouter dans le fichier /public/index.html :</p>
<pre class="lang:xhtml decode:true " title="Installation du manifest"> &lt;link rel="manifest" href="/manifest.json"&gt;</pre>
<p>Vous pouvez retrouver cette étape <a href="https://github.com/CaptainJojo/pwa/compare/step3-sw-precache...step4-manifest" target="_blank">ici</a>.</p>
<p>Si vous relancez l'application et que vous allez dans l'outil de développement, onglet application, vous trouverez les propriétés de votre manifest. Il est même possible d'installer votre application en cliquant sur 'Add to homescreen'.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-21.10.55.png"><img class="aligncenter wp-image-2021 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-21.10.55-1024x788.png" alt="Propriétés du manifest" width="1024" height="788" /></a></p>
<p>Et encore une fois, fermez l'outil de développement et lancez l'extension LightHouse.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-21.12.32.png"><img class="aligncenter wp-image-2022 size-large" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/Capture-d’écran-2016-07-18-à-21.12.32-1024x474.png" alt="LightHouse - Manifest" width="1024" height="474" /></a></p>
<p>Vous y êtes, votre application est une Progressive Web App !</p>
<p>En conclusion, ce n'est pas compliqué de mettre en place une PWA, maintenant il faut jouer avec, tester le cache, etc... Il existe d'autres fonctionnalités sympa comme la mise en place des push notifications, le fait de contrôler le bluetooth...</p>
<p>Pour en apprendre encore plus, vous pouvez trouver des tutoriels super intéressants dont je me suis inspiré, chez <a href="https://codelabs.developers.google.com/" target="_blank">Google</a>.</p>
{% endraw %}
