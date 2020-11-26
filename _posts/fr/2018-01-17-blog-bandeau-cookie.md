---
layout: post
title: Google Analytics et le bandeau cookie CNIL
excerpt: "Vous avez tous au moins été confrontés une fois, lors de la visite d'un site, à un message précisant que ce dernier utilise des cookies. Ce message parfois agaçant est dû à une loi passée il y a quelques années par la commission européenne. Profitons donc de l'intégration récente de ce bandeau sur ce blog pour en parler."
lang: fr
authors:
    - mlenglet
permalink: /fr/google-analytics-et-le-bandeau-cookie-cnil/
categories:
    - blog
    - javascript
    - CNIL
    - Vie privée
tags:
    - blog
    - javascript
    - CNIL
    - Vie privée
    - Cookie
cover: /assets/2018-01-17-cookie-banner/cover.jpg
---

Vous avez tous au moins été confrontés une fois, lors de la visite d'un site, à un message précisant que ce dernier utilise des cookies. Ce message parfois agaçant (jetez un coup d'oeil à _[I don't care about cookies](https://www.i-dont-care-about-cookies.eu/){:rel="nofollow"}_) est dû à une loi passée il y a quelques années par la commission européenne. Profitons donc de l'intégration récente de ce bandeau sur ce blog pour en parler.

## Se conformer à la loi

Suite à de nombreux abus sur l'utilisation des cookies (pistage des utilisateurs à travers les différents sites qu'ils visitent, etc), l'Union Européenne a mis en place une directive censée protéger les utilisateurs et leur permettre de donner leur autorisation ou non aux sites qu'ils fréquentent d'utiliser des cookies.

### Explication de la directive

En application de la directive européenne dite "paquet télécom", les internautes doivent être informés et donner leur consentement préalablement à l'insertion de traceurs. Ils doivent disposer d'une possibilité de choisir de ne pas être tracés lorsqu'ils visitent un site ou utilisent une application. Les éditeurs ont donc l'obligation de solliciter au préalable le consentement des utilisateurs. Ce consentement est valable 13 mois maximum.

### Mauvaise application

Cette directive demeure très mal appliquée. En fait la plupart des sites le font de façon non conforme à la directive, en se limitant à une simple "bannière" informant de l'utilisation de "cookies" sans donner d'information sur les utilisations, sans différencier les cookies "techniques" des cookies de "pistage", ni d'offrir de choix réel à l’utilisateur désirant maintenir les cookies techniques (comme les cookies de gestion du panier d'achat) et refuser les cookies de "pistage". De fait de nombreux sites ne fonctionnent pas correctement si les cookies sont refusés, ce qui est non conforme.

### Sanctions

Le non-respect de cette loi peut entraîner, en France, de lourdes sanctions de la part de la CNIL.
Lorsque des manquements à la loi sont portés à sa connaissance, la formation restreinte de cette dernière peut prononcer à l’égard du responsable de traitement fautif :

- **Un avertissement, qui peut être rendu public.** Dans l'hypothèse où le Président de la CNIL a, au préalable, prononcé une mise en demeure, et que le responsable de traitement ne s'y est pas conformé, la formation restreinte peut prononcer, à l'issue d'une procédure contradictoire :
- **Une sanction pécuniaire** (sauf pour les traitements de l’État) d’un montant maximal de 150.000€, et, en cas de récidive, jusqu’à 300.000 €. Cette sanction peut être rendue publique ; la formation restreinte peut également ordonner l'insertion de sa décision dans la presse, aux frais de l'organisme sanctionné. Le montant des amendes est perçu par le Trésor Public et non par la CNIL.
- **Une injonction de cesser le traitement.**
- **Un retrait de l’autorisation accordée par la CNIL** en application de [l’article 25 de la loi](https://www.cnil.fr/fr/loi-78-17-du-6-janvier-1978-modifiee#Article25){:rel="nofollow"}

![saline]({{site.baseurl}}/assets/2018-01-17-cookie-banner/brouette-sel.jpg){:class="center-image"}
_Chargement de sel pour une entreprise ayant été sanctionné par la CNIL_{:style="text-align:center;display:block;"}

### Cas de Google Analytics

Certains traceurs sont cependant dispensés du recueil de ce consentement.
Pour en faire partie, les outils de mesure d'audience doivent respecter les conditions suivantes :

- L'éditeur du site doit délivrer une information claire et complète ;
- Un mécanisme d’opposition doit être accessible simplement et doit pouvoir être utilisable sur tous les navigateurs, et tous les types de terminaux (y compris les smartphones et tablettes) ;
- Les données collectées ne doivent pas être recoupées avec d’autres traitements (fichiers clients ou statistiques de fréquentation d'autres sites par exemple) ;
- Le cookie déposé doit servir uniquement à la production de statistiques anonymes ;
- Le cookie ne doit pas permettre de suivre la navigation de l’internaute sur d’autres sites ;
- L’adresse IP permettant de géolocaliser l’internaute ne doit pas être plus précise que l’échelle de la ville. Concrètement les deux derniers octets de l’adresse IP doivent être supprimés ;
- Les cookies permettant la traçabilité des internautes et les adresses IP ne doivent pas être conservés au-delà de 13 mois à compter de la première visite.

Certains outils respectent l'ensemble de ces critères comme [Matomo](https://matomo.org/){:rel="nofollow"} (anciennement Piwik) ou [Xiti](https://www.xiti.com/){:rel="nofollow"}. Malheureusement, Google Analytics n'en fait pas partie, notamment car les cookies posés par ce dernier ont une durée de vie supérieure à 13 mois.
Étant l'outil que nous avons choisi pour ce blog, nous devions donc intégrer un "bandeau cookie".

## L'implémentation sur notre blog

Nous avons développé cette fonctionnalité récemment sur ce blog. Les seuls cookies posés par ce site sont ceux de Google Analytics, c'est pourquoi la solution a été orientée vers celle-ci. Elle s'inspire d'un [code d'exemple disponible directement sur le compte Github de la CNIL](https://github.com/LINCnil/Cookie-consent_Google-Analytics){:rel="nofollow"}.

### Le HTML/CSS

Comme la CNIL le recommande, on part sur un bandeau avertissant l'utilisateur avec un bouton/lien lui permettant d'avoir plus d'informations et de s'opposer à l'utilisation des cookies. Si l'utilisateur clique sur le site n'importe où en dehors de ce bandeau, il sera considéré que l'utilisateur a approuvé l'utilisation des cookies.

![Bandeau Cookie - learn the difference]({{site.baseurl}}/assets/2018-01-17-cookie-banner/learn-the-difference.jpg){:class="center-image"}

Le choix final de l'utilisateur (après clic sur le bouton dans le bandeau) sera affiché dans une boite de dialogue contenant une explication détaillée de pourquoi les cookies sont nécessaires et deux boutons permettant d'accepter ou de refuser l'utilisation des cookies.
Cette boite de dialogue comportera un "overlay" obligeant l'utilisateur à faire son choix avant de continuer à utiliser le site.

```html
<!-- Bandeau cookie comportant le message et le bouton pour éventuellement s'opposer -->
<div id="cookie-banner" class="cookie-banner">
    Ce site utilise Google Analytics. En continuant à naviguer, vous nous autorisez à déposer un cookie à des fins de mesure d'audience.
    <button id="cookie-more-button" name="cookie-more">En savoir plus ou s'opposer</button>
</div>

<!-- Boite de dialogue comportant une description détaillée et deux boutons (confirmation, rejet) -->
<div id="cookie-inform-and-ask" class="cookie-inform-and-ask">
    <div class="cookie-dialog">
        <h1>Les cookies Google Analytics</h1>
        <p>Ce site utilise des cookies de Google Analytics. Ces cookies nous aident à identifier le contenu qui vous intéresse le plus ainsi qu'à repérer certains dysfonctionnements. Vos données de navigations sur ce site sont envoyées à Google Inc.</p>
        <div>
          <button id="ga-cancel-button" name="ga-cancel">S'opposer</button>
          <button id="ga-confirm-button" name="ga-confirm">Accepter</button>
        </div>
    </div>
</div>
```

```scss
// Le bandeau cookie
.cookie-banner {
  display: none;
  position: fixed;
  top: 0;
  width: 100%;

  &.active {
    display: block;
  }
}

// Overlay de la boite de dialogue
.cookie-inform-and-ask {
  background-color: $semi-transparent-black;
  display: none;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;

  &.active {
    display: block;
  }

  // La vraie boîte de dialogue
  .cookie-dialog {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
  }
}
```

### Le JavaScript

Le code utilisé est du JavaScript natif. La seule librairie utilisée est [JS-Cookie](https://github.com/js-cookie/js-cookie){:rel="nofollow"} qui nous permet de faciliter la manipulation des cookies.
Le but du code sera triple :
- Gérer les choix et actions utilisateurs
- Gérer les cookies (création, suppression, vérification)
- Gérer la fonctionnalité _[doNotTrack](https://fr.wikipedia.org/wiki/Do_Not_Track){:rel="nofollow"}_ des navigateurs

Nous créons d'abord une fonction spécifique pour démarrer Google Analytics. C'est le code basique fourni par Google sur sa [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/){:rel="nofollow"} :
```js
function startGoogleAnalytics() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXX-Y', 'auto');
  ga('send', 'pageview');
}
```

Reprenons les éléments DOM correspondant au HTML que nous avons créé ci-dessus. Retenez-bien le nom des constantes, elles seront utilisées tout au long des prochaines fonctions :
```js
const cookieBanner = document.getElementById('cookie-banner');
const cookieInformAndAsk = document.getElementById('cookie-inform-and-ask');
const cookieMoreButton = document.getElementById('cookie-more-button');
const gaCancelButton = document.getElementById('ga-cancel-button');
const gaConfirmButton = document.getElementById('ga-confirm-button');
```

La stratégie sera la suivante :
```js
function processCookieConsent() {
  // 1. On récupère l'éventuel cookie indiquant le choix passé de l'utilisateur
  const consentCookie = Cookies.getJSON('hasConsent');
  // 2. On récupère la valeur "doNotTrack" du navigateur
  const doNotTrack = navigator.doNotTrack || navigator.msDoNotTrack;

  // 3. Si le cookie existe et qu'il vaut explicitement "false" ou que le "doNotTrack" est défini à "OUI"
  //    l'utilisateur s'oppose à l'utilisation des cookies. On exécute une fonction spécifique pour ce cas.
  if (doNotTrack === 'yes' || doNotTrack === '1' || consentCookie === false) {
    reject();
    return;
  }

  // 4. Si le cookie existe et qu'il vaut explicitement "true", on démarre juste Google Analytics
  if (consentCookie === true) {
    startGoogleAnalytics();
    return;
  }

  // 5. Si le cookie n'existe pas et que le "doNotTrack" est défini à "NON", on crée le cookie "hasConsent" avec pour
  //    valeur "true" pour une durée de 13 mois (la durée maximum autorisée) puis on démarre Google Analytics
  if (doNotTrack === 'no' || doNotTrack === '0') {
    Cookies.set('hasConsent', true, { expires: 395 });
    startGoogleAnalytics();
    return;
  }

  // 6. Si le cookie n'existe pas et que le "doNotTrack" n'est pas défini, alors on affiche le bandeau et on crée les listeners
  cookieBanner.classList.add('active');
  cookieMoreButton.addEventListener('click', onMoreButtonClick, false);
  document.addEventListener('click', onDocumentClick, false);
}
```

Lorsque l'utilisateur a décidé de s'opposer à l'utilisation des cookies, il faut... poser des cookies...

![Ironic]({{site.baseurl}}/assets/2018-01-17-cookie-banner/ironic.jpg){:class="center-image"}

Le but est d'enregistrer le choix de l'utilisateur pendant la durée maximum légale (13 mois).
Dans cette fonction, on créera aussi des cookies spécifiques à Google Analytics pour l'empêcher de fonctionner (voir la [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/user-opt-out){:rel="nofollow"}).
On créera donc la fonction suivante (utilisée dans le workflow ci-dessus) :
```js
const GA_PROPERTY = 'UA-XXXXX-Y'
const GA_COOKIE_NAMES = ['__utma', '__utmb', '__utmc', '__utmz', '_ga', '_gat'];

function reject() {
  // création du cookie spécifique empêchant Google Analytics de démarrer
  Cookies.set(`ga-disable-${GA_PROPERTY}`, true, { expires: 395 });
  // insertion de cette valeur dans l'objet window
  window[`ga-disable-${GA_PROPERTY}`] = true;

  // création du cookie précisant le choix utilisateur
  Cookies.set('hasConsent', false, { expires: 395 });

  // suppression de tous les cookies précédemment créés par Google Analytics
  GA_COOKIE_NAMES.forEach(cookieName => Cookies.remove(cookieName));
}
```
La dernière étape est de créer les handlers pour les différents listeners :

- Lorsque l'utilisateur clique n'importe où sur la page
```js
function onDocumentClick(event) {
  const target = event.target;

  // Si l'utilisateur a cliqué sur le bandeau ou le bouton dans ce dernier alors on ne fait rien.
  if (target.id === 'cookie-banner'
    || target.parentNode.id === 'cookie-banner'
    || target.parentNode.parentNode.id === 'cookie-banner'
    || target.id === 'cookie-more-button') {
    return;
  }

  event.preventDefault();

  // On crée le cookie signifiant le consentement de l'utilisateur et on démarre Google Analytics
  Cookies.set('hasConsent', true, { expires: 365 });
  startGoogleAnalytics();

  // On cache le bandeau
  cookieBanner.className = cookieBanner.className.replace('active', '').trim();

  // On supprime le listener sur la page et celui sur le bouton du bandeau
  document.removeEventListener('click', onDocumentClick, false);
  cookieMoreButton.removeEventListener('click', onMoreButtonClick, false);
}
```
- Lorsque l'utilisateur sur le bouton "En savoir plus ou s'opposer" du bandeau
```js
function onMoreButtonClick(event) {
  event.preventDefault();

  // On affiche la boîte de dialogue permettant à l'utilisateur de faire son choix
  cookieInformAndAsk.classList.add('active');

  // On cache le bandeau
  cookieBanner.className = cookieBanner.className.replace('active', '').trim();

  // On crée les listeners sur les boutons de la boîte de dialogue
  gaCancelButton.addEventListener('click', onGaCancelButtonClick, false);
  gaConfirmButton.addEventListener('click', onGaConfirmButtonClick, false);

  // On supprime le listener sur la page et celui sur le bouton du bandeau
  document.removeEventListener('click', onDocumentClick, false);
  cookieMoreButton.removeEventListener('click', onMoreButtonClick, false);
}
```
- Lorsque l'utilisateur accepte l'utilisation des cookies sur la boîte de dialogue
```js
function onGaConfirmButtonClick(event) {
  event.preventDefault();

  // On crée le cookie signifiant le consentement de l'utilisateur et on démarre Google Analytics
  Cookies.set('hasConsent', true, { expires: 365 });
  startGoogleAnalytics();

  // On cache la boîte de dialogue
  cookieInformAndAsk.className = cookieBanner.className.replace('active', '').trim();

  // On supprime les listeners sur les boutons de la boîte de dialogue
  gaCancelButton.removeEventListener('click', onGaCancelButtonClick, false);
  gaConfirmButton.removeEventListener('click', onGaConfirmButtonClick, false);
}
```
- Lorsque l'utilisateur refuse l'utilisation des cookies sur la boîte de dialogue
```js
function onGaCancelButtonClick(event) {
  event.preventDefault();

  // On lance la procédure de refus de l'utilisation des cookies
  reject();

  // On cache la boîte de dialogue
  cookieInformAndAsk.className = cookieBanner.className.replace('active', '').trim();

  // On supprime les listeners sur les boutons de la boîte de dialogue
  gaCancelButton.removeEventListener('click', onGaCancelButtonClick, false);
  gaConfirmButton.removeEventListener('click', onGaConfirmButtonClick, false);
}
```

## Vers la RGPD

Si vous avez bien suivi cet article et si vous l'avez adapté aux besoins de votre site, vous avez maintenant un bandeau cookie parfaitement fonctionnel et respectant les recommandations de la CNIL !
Évidemment un site comme celui-ci (un simple blog) est un cas simple où il y a peu voire pas de cookies posés du tout. En réalité, votre site est déjà quasiment prêt pour la future mise en application de la RGPD à quelques ajustements près.
Si vous ne savez pas ce qu'est la RGPD, c'est en gros une évolution de la directive européenne dont nous avons parlé précédemment vers une version XXL. Pour de plus amples informations, je vous invite à lire l'excellent article de mon collègue [Pouzor](/authors/pouzor/) : [RGPD - Ce qu'il va changer](/fr/rgpd-ce-qu-il-va-changer/).

![Cookie Monster]({{site.baseurl}}/assets/2018-01-17-cookie-banner/cookie-monster.jpg){:class="center-image"}
