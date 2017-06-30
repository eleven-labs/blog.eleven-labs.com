---
layout: post
title: Les push notifications sur votre site
excerpt: L'intérêt d'une PWA, c'est d'agir comme une application mobile, d'être installé sur le téléphone, de gérer le off-line et surtout d'envoyer des push notifications. Les notifications sont un élément essentiel de l'engagement de l'utilisateur, elles permettent de faire un rappel et de communiquer avec nos utilisateurs
author: captainjojo
permalink: /fr/les-push-notifications-sur-votre-site/
categories:
- Javascript
tags:
- Javascript
- pwa
- firebase
- mobile
- notification
---

Lors d'un article précédent nous avons créé [notre première PWA](http://blog.eleven-labs.com/fr/votre-premiere-pwa/), mais nous n'avons pas été jusqu'au bout du concept. L'intérêt du [PWA](http://blog.eleven-labs.com/fr/progressive-web-apps-au-googledevsummit/), c'est d'agir comme une application mobile, d'être installé sur le téléphone, de gérer le off-line et surtout d'envoyer des push notifications. Les notifications sont un élément essentiel de l'engagement de l'utilisateur, elles permettent de faire un rappel et de communiquer avec nos utilisateurs. Nous allons donc finaliser le dernier tutoriel en mettant en place un système simple de push notification, en utilisant

[Firebase](https://firebase.google.com/) pour stocker nos tokens utilisateurs.

Pour aller plus vite, nous vous invitons à récupérer le projet [https://github.com/CaptainJojo/pwa-parisjs](https://github.com/CaptainJojo/pwa-parisjs) qui contient une PWA prête à l'emploi.

```sh
git clone https://github.com/CaptainJojo/pwa-parisjs
cd pwa-parisjs
git checkout manifest
npm install
npm start
```

A partir de la vous devez avoir accès à votre PWA à l'adresse suivante [localhost:8080](localhost:8080). Si ce n'est pas fait, vous devez  installer [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk), ce qui vous permettra de valider que vous avez bien une PWA.
Avant de se lancer dans l'envoi d'une push notification, nous allons passer par la configuration. Et oui ! Ce n'est pas magique, nous allons demander à Google l'autorisation.
Nous allons sur [Firebase](https://console.firebase.google.com/) pour créer un projet.

![Firebase - créer un projet](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-11.19.54.png)

Nous vous laissons choisir le nom du projet. Une fois sur le dashboard, vous devez cliquer sur la petite roue puis "Paramètres du projet".

![Firebase - parametre du projet](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-11.22.12.png)

Dans l'onglet "Cloud Messaging" vous trouverez votre bonheur en récupérant l'ID de l'expéditeur.

![Firebase - Cloud messaging](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-11.32.06.png)

Dans le manifest.json, disponible dans le dossier public de l'application, vous devez ajouter en fin de fichier le "gsm_sender_id" avec comme valeur l'ID de l'expéditeur.

```json
{
  "name": "Lemonde",
  "short_name": "Lemonde",
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
  "theme_color": "#2F3BA2",
  "gcm_sender_id": "262283691358"
}
```

Nous allons maintenant demander à l'utilisateur d'accepter les notifications. C'est très simple, il vous faut ajouter dans le fichier public/register.js ce qui suit :

```javascript
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
      return navigator.serviceWorker.ready;
    }).then(function(registration) {
      registration.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
        var endpointSections = sub.endpoint.split('/');
        var subscriptionId = endpointSections[endpointSections.length - 1];
        console.log('endpoint:', subscriptionId);
      });
    });
  navigator.serviceWorker.ready.then(function(registration) {
     console.log('Service Worker Ready');
  });
}
```

Normalement, si vous relancez le serveur, vous devez avoir une demande pour accepter les notifications.

![PWA - Autoriser les notifications](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-15.34.14.png)

Vous devez aussi voir dans votre console un message du type :

```json
endpoint: cV2kP3sOb24:APA91bHfZgFSPQ3CXyG9LejWdq9jOT-WqQpvK4peX9ZZtrfsHCf6OPEvDegjsTF3uXj-Qsf4jOJ5O8rwdEm9fjKZbqerzcZUjDmsiaRcqmxuOOkpuEqPca31Dlh-6g0YgkvnLccIPz_Z
```

Il s'agit du token du device, c'est à partir de celui-ci que nous pourrons envoyer une push notification.
Comme nous voulons faire quelque chose de propre (même s'il ne s'agit que d'un tutoriel), nous allons utiliser Firebase pour stocker les tokens utilisateurs. Pour cela rien de plus simple,  vous retournez sur la console Firebase et dans l'onglet "Authentification" vous cliquez sur "configuration web".

![PWA - Autoriser les notifications](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-15.50.59.png)

L'installation du script se fait dans le code html, donc public/home.html et public/article/alorscettearticle.html.

```html
<html>;
  <head>;
    <meta charset=utf-8/>;
    <meta name="theme-color" content="#2F3BA2">;
    <meta name="viewport" content="width=device-width, initial-scale=1">;
    <link rel="manifest" href="/manifest.json">;
  </head>;
  <body>;
    <script src="https://www.gstatic.com/firebasejs/3.5.2/firebase.js">;</script>;
    <script src="/register.js">;</script>;
    <link rel="stylesheet" href="/main.css">;
    <link rel="stylesheet" href="/async.css">;
```

L'initialization, nous la mettrons dans public/register.js.

```javascript
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQxLWhe7UNMnxWlO88Ybzf93Qv_3HLeQA",
  authDomain: "pwa-parisjs.firebaseapp.com",
  databaseURL: "https://pwa-parisjs.firebaseio.com",
  storageBucket: "pwa-parisjs.appspot.com",
  messagingSenderId: "262283691358"
};

firebase.initializeApp(config);

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
      return navigator.serviceWorker.ready;
    }).then(function(registration) {
      registration.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
        var endpointSections = sub.endpoint.split('/');
        var subscriptionId = endpointSections[endpointSections.length - 1];
        console.log('endpoint:', subscriptionId);
      });
    });
  navigator.serviceWorker.ready.then(function(registration) {
     console.log('Service Worker Ready');
  });
}
```

Maintenant que Firebase est installé, nous n'avons plus qu'à mettre en "database" le token de l'utilisateur. Vous trouverez toute les aides dont vous avez besoin dans la documentation Firebase.
Nous allons donc ajouter le fichier public/register.js

```javascript
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQxLWhe7UNMnxWlO88Ybzf93Qv_3HLeQA",
  authDomain: "pwa-parisjs.firebaseapp.com",
  databaseURL: "https://pwa-parisjs.firebaseio.com",
  storageBucket: "pwa-parisjs.appspot.com",
  messagingSenderId: "262283691358"
};

firebase.initializeApp(config);

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
      return navigator.serviceWorker.ready;
    }).then(function(registration) {
      registration.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
        var endpointSections = sub.endpoint.split('/');
        var subscriptionId = endpointSections[endpointSections.length - 1];
        var newKey = firebase.database().ref().child('token').push().key;
        firebase.database().ref('token/' + newKey).set({subscriptionId: subscriptionId});
        console.log('endpoint:', subscriptionId);
      });
    });
  navigator.serviceWorker.ready.then(function(registration) {
     console.log('Service Worker Ready');
  });
}
```

Avant de lancer le serveur, vous devez ouvrir les droits à Firebase afin qu'il puisse écrire dans le database. Dans l'onglet "Database" puis "Règles" il faut mettre :

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

![Firebase - Règles database](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-16.13.27.png)

Si vous relancez le serveur, vous devez voir dans l'onglet "Database" de Firebase un token dans la BDD.

![Firebase - Database Token](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-16.24.58.png)

Bon, maintenant que nous mettons les tokens dans une base de données nous allons préparer le message qui s'affichera lors d'une push notification. Pour aller vite nous allons ajouter le code suivant en fin du fichier public/sw.js :

```javascript
console.log('Started', self);

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);

  var title = 'Le push de test :)';

  event.waitUntil(
    self.registration.showNotification(title, {
     body: 'Bravo tu l\'as reçu',
     icon: 'images/icon.png',
     tag: 'my-tag'
   }));
});
```

C'est presque fini ! Nous allons créer une url "/sender" qui nous permettra d'envoyer les notifications à tous les tokens que nous avons en base. Pour cela nous allons utiliser les modules *request* et *firebase* (version npm). Voici le nouveau package.json :

```json
{
  "name": "pwa-parisjs",
  "version": "0.0.1",
  "description": "A Progressive Web App",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "sw": "gulp sw-precache"
  },
  "dependencies": {
    "express": "^4.14.0",
    "firebase": "^3.5.1",
    "request": "^2.75.0"
  },
  "devDependencies": {
    "gulp": "^3.9.1",
    "sw-precache": "^3.2.0"
  }
}
```

Dans le fichier app.js, nous initialisons Firebase. Vous allez avoir besoin d'un fichier de clé serveur. Vous allez cliquer sur la roue dans Firebase puis "Autorisation". Vous êtes alors redirigé sur une autre console.

![Firebase - Autorisation](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-16.59.31.png)

Puis dans Comptes de service, vous créez un nouveau compte de service.

![Création - Compte et services](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-17.02.45.png)

Un fichier json sera alors téléchargé, il vous suffit de l'ajouter à la racine de votre projet.

![JsonFile - Racine](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-17.22.04.png)

Dans le fichier app.js nous allons ajouter la route /sender qui envoie la requête de demande de push en prenant l'ensemble des tokens.

```javascript
var path = require('path');
var express = require('express');
var app = express();
var firebase = require('firebase');
var request = require('request');

firebase.initializeApp({
  databaseURL: 'https://pwa-parisjs.firebaseio.com/', // A trouver dans l'onglet Database
  serviceAccount: 'pwa-parisjs-cf0bc079ee69.json' // Nom du fichier json a votre racine
});

app.use(express.static(path.join(__dirname, 'public'), {index: false}))

app.get('/sender', function(req, res){
  var allToken = firebase.database().ref('/token');
  Promise.all([allToken.once('value')]).then(function(resp) {
    var allToken = resp[0].val();
    tokenRep = '';
    Object.keys(allToken).forEach(function(uid) {
      var token = allToken[uid];
      request({
        url: 'https://android.googleapis.com/gcm/send',
        method: 'POST',
        headers: {
          'Content-Type' :' application/json',
          'Authorization': 'key=AIzaSyDV-KhCa9dM-bSg_r23GUwpRJqBw6qrJIc', // Clé serveur disponible dans les paramètres du projet Firebase
        },
        body: JSON.stringify(
          {
            "registration_ids" : [token.subscriptionId]
          }
        )
      }, function(error, response, body) {

      });
    });
  }).catch(function(error) {
    console.log('Failed to start weekly top posts emailer:', error);
  });

  res.send('ok');
});


app.use('/', function (req, res) {
  res.sendFile(__dirname + '/public/home.html');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
```

Attention ! La clé Authorization se trouve dans le premier onglet que l'on a ouvert.

![Firebase - Autorisation](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-17.44.27.png)

Si tout est bon, quand vous relancez le serveur et que vous allez sur / puis /sender vous avez la notification. Si ce n'est pas le cas supprimez le cache de votre application dans la console chrome onglet application.

![Firebase - Autorisation](/assets/2016-10-27-les-push-notifications-sur-votre-site/Capture-d’écran-2016-10-26-à-17.46.23.png)


Encore une fois ce code est vraiment un tutoriel, je vous invite donc à faire des issues pour la moindre question. Le code final est [ici](https://github.com/CaptainJojo/pwa-parisjs/tree/push).
