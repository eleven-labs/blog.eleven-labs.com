---
layout: compress-js
---
(function() {
  'use strict';

  function getFirebase() {
    const config = {
      apiKey: "AIzaSyCuWxK1PXYm5LxCUerQ3m8DFBXf7KNbWAo",
      authDomain: "pwa-blog-39121.firebaseapp.com",
      databaseURL: "https://pwa-blog-39121.firebaseio.com",
      projectId: "pwa-blog-39121",
      storageBucket: "pwa-blog-39121.appspot.com",
      messagingSenderId: "291145269412"
    };

    firebase.initializeApp(config);

    return firebase;
  }

  const fb = getFirebase();
  fb.auth().signInAnonymously().catch((error) => {
    console.log(error.message);
  });

  function showOfflineToast() {
    const offlineToast = document.querySelector('.offline-ready');
    offlineToast.classList.add('active');
    setTimeout(() => {
      offlineToast.className = offlineToast.className.replace('active', '').trim();
    }, 5500);
  }

  function subscribeDevice() {
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      return serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true });
    }).then((subscription) => {
      const endpointSections = subscription.endpoint.split('/');
      const subscriptionId = endpointSections[endpointSections.length - 1];
      fb.auth().onAuthStateChanged((user) => {
        if (user) {
          fb.database().ref(`token/${user.uid}`).set({subscriptionId});
        }
      })
    });
  }

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
          showOfflineToast();
        }
      });
    });

   
  }
})();
