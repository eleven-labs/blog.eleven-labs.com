---
layout: compress-js
---
(function() {
  'use strict';

  const screenSize = screen.height * 0.4;
  const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

  window.addEventListener('scroll', function() {
    if (document.getElementById('backTop')) {
      if (window.scrollY >= screenSize) {
        document.getElementById('backTop').classList.add('back-to-top--displayed');
      } else {
        document.getElementById('backTop').classList.remove('back-to-top--displayed');
      }
    }
  });

  document.getElementById('backTopLink').addEventListener(touchEvent, function() {
    document.body.scrollTop = 0;
  });
})();
