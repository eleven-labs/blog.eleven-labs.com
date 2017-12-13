---
layout: compress-js
---
(function() {
  'use strict';

  if (window.ga) {
    /**
    * Function that tracks a click on an outbound link in Analytics.
    * This function takes a valid URL string as an argument, and uses that URL string
    * as the event label. Setting the transport method to 'beacon' lets the hit be sent
    * using 'navigator.sendBeacon' in browser that support it.
    */
    function trackOutboundLink(event) {
      const anchor = event.target.closest('a');
      if (!anchor) {
        return;
      }

      event.preventDefault();
      const url = anchor.getAttribute('href');

      ga('send', 'event', 'outbound', 'click', url, {
        transport: 'beacon',
        hitCallback: () => {
          document.location = url;
        }
      });
    }

    const anchors = document.getElementsByClassName('tracked-link');
    if (anchors) {
      for (let i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', trackOutboundLink, false);
      }
    }
  }
})();
