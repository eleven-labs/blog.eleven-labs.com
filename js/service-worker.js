---
layout: compress-js
---
(function() {
  'use strict';

  function showOfflineToast() {
    const offlineToast = document.querySelector('.offline-ready');
    offlineToast.classList.add('active');
    setTimeout(() => {
      offlineToast.className = offlineToast.className.replace('active', '').trim();
    }, 5500);
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
