---
layout: compress-js
---
/* ====================================================================== */
/* inspired by https://github.com/LINCnil/Cookie-consent_Google-Analytics */
/* ====================================================================== */

(function() {
  'use strict';

  const GA_PROPERTY = '{{ site.theme_settings.google_analytics }}'
  const GA_COOKIE_NAMES = ['__utma', '__utmb', '__utmc', '__utmz', '_ga', '_gat'];
  const COOKIE_EXPIRES = 395 // 395 days = 13 months = max legal duration

  const cookieBanner = document.getElementById('cookie-banner');
  const cookieInformAndAsk = document.getElementById('cookie-inform-and-ask');
  const cookieMoreButton = document.getElementById('cookie-more-button');
  const gaCancelButton = document.getElementById('ga-cancel-button');
  const gaConfirmButton = document.getElementById('ga-confirm-button');

  /**
   * Function that tracks a click on an outbound link in Analytics.
   * This function takes a valid URL string as an argument, and uses that URL string
   * as the event label. Setting the transport method to 'beacon' lets the hit be sent
   * using 'navigator.sendBeacon' in browser that support it.
   * @param {Event} event
   */
  function trackOutboundLink(event) {
    const anchor = event.target.closest('a');
    if (!anchor) {
      return;
    }

    event.preventDefault();
    const url = anchor.getAttribute('href');
    const isShareButton = anchor.classList.contains('share-button');

    ga('send', 'event', 'outbound', 'click', url, {
      transport: 'beacon',
      hitCallback: () => {
        if (!isShareButton) {
          document.location = url;
        }
      }
    });
  }

  /**
   * Start Google Analytics
   */
  function startGoogleAnalytics() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', GA_PROPERTY, 'auto');
    ga('send', 'pageview');

    const anchors = document.getElementsByClassName('tracked-link');
    if (anchors) {
      for (let i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', trackOutboundLink, false);
      }
    }
  }

  /**
   * Reject GA exec, set cookies to save choice, remove GA cookies
   */
  function reject() {
    Cookies.set(`ga-disable-${GA_PROPERTY}`, true, { expires: COOKIE_EXPIRES });
    Cookies.set('hasConsent', false, { expires: COOKIE_EXPIRES });
    window[`ga-disable-${GA_PROPERTY}`] = true;
    GA_COOKIE_NAMES.forEach(cookieName => Cookies.remove(cookieName));
  }

  /**
   * When the user click on the "disagree" button, reject GA and remove listeners
   * @param {Event} event
   */
  function onGaCancelButtonClick(event) {
    event.preventDefault();

    reject();

    cookieInformAndAsk.className = cookieBanner.className.replace('active', '').trim();
    gaCancelButton.removeEventListener('click', onGaCancelButtonClick, false);
    gaConfirmButton.removeEventListener('click', onGaConfirmButtonClick, false);
  }

  /**
   * When the user click on the "agree" button, start GA and remove listeners
   * @param {Event} event
   */
  function onGaConfirmButtonClick(event) {
    event.preventDefault();

    Cookies.set('hasConsent', true, { expires: COOKIE_EXPIRES });
    startGoogleAnalytics();

    cookieInformAndAsk.className = cookieBanner.className.replace('active', '').trim();
    gaCancelButton.removeEventListener('click', onGaCancelButtonClick, false);
    gaConfirmButton.removeEventListener('click', onGaConfirmButtonClick, false);
  }

  /**
   * When the user click out of banner, close banner, remove listeners and start GA
   * @param {Event} event
   */
  function onDocumentClick(event) {
    const target = event.target;
    if (target.id === 'cookie-banner'
      || target.parentNode.id === 'cookie-banner'
      || target.parentNode.parentNode.id === 'cookie-banner'
      || target.id === 'cookie-more-button') {
      return;
    }

    event.preventDefault();

    Cookies.set('hasConsent', true, { expires: COOKIE_EXPIRES });
    startGoogleAnalytics();

    cookieBanner.className = cookieBanner.className.replace('active', '').trim();
    document.removeEventListener('click', onDocumentClick, false);
    cookieMoreButton.removeEventListener('click', onMoreButtonClick, false);
  }

  /**
   * When the user click in the "learn more or disagree" button, close banner, remove listener and open inform and ask
   * @param {Event} event
   */
  function onMoreButtonClick(event) {
    event.preventDefault();

    cookieInformAndAsk.classList.add('active');
    cookieBanner.className = cookieBanner.className.replace('active', '').trim();

    gaCancelButton.addEventListener('click', onGaCancelButtonClick, false);
    gaConfirmButton.addEventListener('click', onGaConfirmButtonClick, false);

    document.removeEventListener('click', onDocumentClick, false);
    cookieMoreButton.removeEventListener('click', onMoreButtonClick, false);
  }

  /**
   * Process all cookie consent choice worflow
   */
  function processCookieConsent() {
    const consentCookie = Cookies.getJSON('hasConsent');
    const doNotTrack = navigator.doNotTrack || navigator.msDoNotTrack;

    if (doNotTrack === 'yes' || doNotTrack === '1' || consentCookie === false) {
      reject();
      return;
    }

    if (consentCookie === true) {
      startGoogleAnalytics();
      return;
    }

    if (doNotTrack === 'no' || doNotTrack === '0') {
      Cookies.set('hasConsent', true, { expires: COOKIE_EXPIRES });
      startGoogleAnalytics();
      return;
    }

    cookieBanner.classList.add('active');
    cookieMoreButton.addEventListener('click', onMoreButtonClick, false);
    document.addEventListener('click', onDocumentClick, false);
  }

  processCookieConsent();
})();
