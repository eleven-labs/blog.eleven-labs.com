---
layout: compress-js
---
(function() {
  'use strict';

  const screenSize = screen.height * 0.4;

  window.addEventListener('scroll', function() {
    if (document.getElementById('backTop')) {
      if (window.scrollY >= screenSize) {
        document.getElementById('backTop').classList.add('back-to-top--displayed');
      } else {
        document.getElementById('backTop').classList.remove('back-to-top--displayed');
      }
    }
  });

  document.getElementById('backTopLink').addEventListener('click', function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
})();
