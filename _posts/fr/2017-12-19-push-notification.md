---
layout: post
title: Recevez nos push notifications
lang: fr
permalink: /fr/push-notification/
excerpt: "Notre retour d'expérience sur la mise en place des push notifications"
authors:
    - captainjojo
categories:
    - google
    - firebase
    - notification
tags:
    - javascript
cover: /assets/2017-12-19-push-notification/cover.jpg
---

Parce que nous voulons toujours améliorer notre blog, et parce que ce dernier est la vitrine de notre expertisetechnique, aujourd'hui nous avons mis en place les notifications.

> Mais à quoi cela sert-il ?

Cela sert à savoir quand un nouvel article est en ligne. Si vous acceptez les notifications, vous pourrez être averti même sur votre téléphone (sauf Iphone car pas encore disponible chez Apple).

Voyons ensemble comment nous nous y sommes pris.

## Etape 1: le service worker

Tout d'abord nous avons mis en place un service worker. Le service worker est un script Javascript qui tourne directement sur votre navigateur sans que le site soit activé. Pour plus d'explications, vous pouvez lire ce super document [ici](https://developers.google.com/web/fundamentals/primers/service-workers/){:rel="nofollow noreferrer"}.

Le service worker est la base pour faire de votre site une [PWA](https://developers.google.com/web/progressive-web-apps/){:rel="nofollow noreferrer"}.  Tout d'abord cela nous permet d'avoir le site offline (d'ailleurs testé dès maintenant).

Pour cela lors de la première visite sur le site, le service worker s'enregistre et met en cache les assets et les pages d'articles.

Vous pouvez voir cela directement dans votre console de développement dans l'onglet `application`.

![Console Chrome]({{site.baseurl}}/assets/2017-12-19-push-notification/image1.png)

La mise en place d'un service worker est assez simple. Il faut dire au navigateur compatible avec les service workers où se dernier se trouve. Voici la liste des navigateurs actuellement compatibles ([CanIUse](https://caniuse.com/#search=service%20workers){:rel="nofollow noreferrer"}).

![Can I Use]({{site.baseurl}}/assets/2017-12-19-push-notification/image2.png)

Vous devez avoir un fichier contenant l'enregistrement du service workers.

```js
if (navigator.serviceWorker) {
    const swPath = (window.site && window.site.sw) || '/sw.js';
    navigator.serviceWorker.register(swPath).then((reg) => {
      if (!reg.installing) {
        return;
      }

      console.log("[*] ServiceWorker is installing...");
      const worker = reg.installing;

      worker.addEventListener('statechange', () => {
        if (worker.state == 'redundant') {
          console.log('[*] ServiceWorker Install failed');
        }
        if (worker.state == 'installed') {
          console.log('[*] ServiceWorker Install successful!');
        }

        if (worker.state == 'activated' && !navigator.serviceWorker.controller) {
          // VOTRE CODE SI LE SERVICE WORKERS EST ACTIVÉ
        }
      });

    });
  }
```

Puis le service workers permettant d'avoir une site offline ressemble a cela :

```js
const CACHE_NAME_PREFIX = 'PREFIX DU CACHE-cache-';
  const CACHE_NAME = `NOM DU CACHE`;

  const filesToCache = [
    // LIST DES FICHIERS A CACHÉ
  ];


self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches
      .open(CACHE_NAME)
      .then(cache => Promise.all(filesToCache.map(file => cache.add(file))))
    );
  });

  self.addEventListener('activate', (e) => {
    e.waitUntil(caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames
        .filter(cacheName => cacheName.startsWith(CACHE_NAME_PREFIX) && cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
      ))
    );
  });

  // Network falling back to the cache strategy (See: https://serviceworke.rs/caching-strategies.html)
  self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request)
      .catch(err => caches
        .match(e.request)
        .then(response => response || Promise.reject(err))
      ));
  });
```

Donc voilà, nous avons notre service worker prêt pour y mettre des notifications.

## Enregistrer les utilisateurs

La première chose à faire dans la mise en place des web notifications, c'est d'ajouter dans votre `manifest.json` votre `gcm_sender_id`  que vous pouvez trouver dans les paramètres du projet Firebase.

![Paramètre Firebase]({{site.baseurl}}/assets/2017-12-19-push-notification/image3.png)

Il faut ensuite enregistrer le token des utilisateurs qui acceptent de recevoir les notifications.

Nous avons choisi d'enregistrer les tokens dans une base [Firebase](https://firebase.google.com/){:rel="nofollow noreferrer"}. Cela nous permet d'avoir une base de données en temps réel à moindre coût. De plus, l'utilisation de Firebase est super facile en Javascript via le SDK disponible [ici](https://firebase.google.com/docs/web/setup){:rel="nofollow noreferrer"}.

L'enregistrement du token utilisateur se fait au même endroit que celui du service worker. Il suffit d'y ajouter le code suivant :

```js
  function subscribeDevice() {
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      return serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true });
    }).then((subscription) => {
      const endpointSections = subscription.endpoint.split('/');
      const subscriptionId = endpointSections[endpointSections.length - 1];
      fb.auth().onAuthStateChanged((user) => {
        if (user) {
          fb.database().ref('token/' + user.uid).set({subscriptionId: subscriptionId});
        }
      })

    });
  }

  function getFirebase() {
    const config = {
      apiKey: "API_KEY",
      authDomain: "AUTH_DOMAIN",
      databaseURL: "DATABASE_URL",
      projectId: "PROJECT_ID",
      storageBucket: "STORAGE_BUCKET",
      messagingSenderId: "SENDERID"
    };

    firebase.initializeApp(config);

    return firebase;
  }
```

Il faut appeler la fonction `subscribeDevice` si le service worker est disponible dans le navigateur. Si tout est ok vous avez un petit popup qui vous demande de valider l'autorisation de recevoir les notifications.

![Popup notification]({{site.baseurl}}/assets/2017-12-19-push-notification/image4.png)

Si la personne accepte son token (unique par navigateur) cela devrait apparaître dans votre base de données Firebase.

![BDD Firebase]({{site.baseurl}}/assets/2017-12-19-push-notification/image5.png)

Et voilà la première étape est terminée, vous avez dans votre base de données l'ensemble des utilisateurs qui acceptent de recevoir vos notifications.

## Etape 2: Afficher les notifications

Dans cette première version nous allons mettre en place une notification très simple. Pour que les notifications soient envoyées même si l'onglet de votre site est fermé, il faut mettre le code d'affichage dans votre service worker.

Vous pouvez ajouter cela :

```js
  self.addEventListener('push', (e) => {
    console.log('Push message', e);

    var title = 'Un nouvel article est disponible sur le blog d\'Eleven-labs';

    e.waitUntil(
      self.registration.showNotification(title, {
        body: 'Rendez vous sur notre site',
        icon: 'img/icons/icon-512x512.png',
      })
    );
  });
```

Vous pouvez faire un lien vers votre site lors du clic sur la notification, en ajoutant l'event dans le service worker.

```js
  self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
      clients.openWindow('https://blog.eleven-labs.com/')
    );
  });
```

Donc maintenant l'utilisateur pourra voir votre notification s'afficher.

![Notification]({{site.baseurl}}/assets/2017-12-19-push-notification/image6.png)

> Et comment je l'envoie ?

C'est la meilleur question car c'est à ce moment que c'est un peu plus compliqué.

## Etape 3 : Je pushe ma notification

Sur le papier c'est assez simple, il faut faire un post avec les paramètres suivants :

```js
{
          url: 'https://android.googleapis.com/gcm/send',
          method: 'POST',
          headers: {
            'Content-Type' :' application/json',
            'Authorization': 'key=SERVER_KEY',
          },
          body: JSON.stringify(
            {
              "registration_ids" : [TOKEN_UTILISATEUR]
            })
        }
```

Votre clé serveur est disponible au même endroit que votre `gcm_sender_id` dans Firebase.

Alors oui c'est simple mais comment faire pour faire un envoi à toute ma base de données de tokens ?

Comme je suis fan du serverless, et que Firebase le propose, nous avons choisi d'utiliser [Functions](https://firebase.google.com/products/functions/?authuser=0){:rel="nofollow noreferrer"} de Firebase.

Pour créer votre Functions, il vous suffit de suivre le tutoriel de Google disponible [ici](https://firebase.google.com/docs/functions/get-started){:rel="nofollow noreferrer"}.

Ce qui est pratique c'est que vous pouvez utiliser la librairie Firebase pour tester en local votre code.

```sh
firebase serve --only functions
```

Cela permet de créer un serveur Firebase en local et donc de ne pas s'amuser à déployer à chaque modification.

La Functions est assez simple elle récupère l'ensemble des tokens de la base de données et fait un post sur l'url vue au dessus pour chaque token.

```js
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
const requestPromise = require('request-promise-native');

admin.initializeApp(functions.config().firebase);

const requestOptions = {
  uri: 'https://android.googleapis.com/gcm/send',
  method: 'POST',
  headers: {
    'Content-Type': ' application/json',
    'Authorization': 'key=SERVER_KEY',
  },
};

exports.sendNotification = functions.https.onRequest((req, res) => {
  var allToken = admin.database().ref('/token');

  // allToken.once('value') is already a promise, so no need of Promise.all
  return allToken.once('value').then(function(resp) {
    var allToken = resp.val();

    // Here we generate a list of request promises, and give them to Promise.all
    // so that we wait for their completion. then we calculate the status (success, failure)
    Promise.all(Object.keys(allToken).map(function(uid) {
      var token = allToken[uid];

      return requestPromise(Object.assign(requestOptions, {
        body: JSON.stringify({ registration_ids: [token.subscriptionId] }),
      }));
    }))
    .then((responses) => {
      const status = responses.reduce((result, statusResponse) => {
        const itemObject = JSON.parse(statusResponse);

        return Object.assign({}, result, {
          success: result.success + itemObject.success,
          failure: result.failure + itemObject.failure,
        });
      }, { success: 0, failure: 0 });

      res.send(status);
    })
    .catch((error) => {
      console.error(error);
    });
  }).catch(function(error) {
    return res.send('Failed send notification:', error);
  });
});
```

Si tout est ok, vous devriez voir la notification apparaître sur votre écran.

## Conclusion

Nous avons maintenant une PWA permettant d'envoyer des notifications lors d'un nouvel article. La suite c'est d'avoir des notifications personnalisées. Pour cela lors de la réception du push par le service workers nous allons faire un call sur une api pour récupérer l'information à afficher.

Vous pouvez nous aider à améliorer le blog en allant sur le [Github](https://github.com/eleven-labs/blog.eleven-labs.com){:rel="nofollow noreferrer"}.
