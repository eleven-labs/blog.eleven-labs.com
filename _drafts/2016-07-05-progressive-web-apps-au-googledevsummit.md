---
layout: post
title: Progressive Web Apps  au GoogleDevSummit
author: jonathan
date: '2016-07-05 15:22:28 +0200'
date_gmt: '2016-07-05 13:22:28 +0200'
categories:
- Javascript
tags:
- Google
- conférence
- web
- pwa
- service worker
- webperformance
- application mobile
---

Lundi 19 juin et mardi 20 juin 2016 a eu lieu la GoogleDevSummit à Amsterdam pour une présentation en grande pompe d'une nouvelle façon de faire des sites mobiles : les progressives web apps.

Voici mon retour sur les deux jours de conférence.<!--more-->

####  Keynote (Thao Tran et Alex Russel)
Il s'agit d'une introduction commerciale sur les PWA, il met en perspective l'objectif business des webs apps.

Aujourd'hui, Chrome acquiert 1 milliard d'utilisateurs par mois, ce qui montre que le web possède le plus fort taux d'engagement.

Deux chiffres supplémentaires intriguent, il y a par mois un reach :

<ul>
<li>de 8,9 millions sur web mobile</li>
<li>de 3,3 millions sur apps</li>
</ul>
Le coût d'acquisition d'un utilisateur est aussi très différent :

<ul>
<li>environ 4 euros sur une appli androïd</li>
<li>contre 0,35 euros sur un site mobile</li>
</ul>
Alex Russel montre que les PWA sont la fusion parfaite entre un site web et une application native, ils permettent d'allier la puissance du site mobile aux features des applications natives.

[embed]https://www.youtube.com/watch?v=9Jef9IluQw0&w=560&h=315[/embed]

&nbsp;

#### Instant-loading offline-first progressive web apps the next generation part II uncovered (Jake Archibald)
L'intérêt principal des PWA est le fait d'avoir le site en version offline installé sur son mobile.

Jake Archibald propose de faire notre application avec la notion Offline first. Tout comme le Mobile first, il s'agit de réfléchir l'application en la pensant offline dès le début.

Il explique que la base de PWA est de mettre en place le manifest, ce qui permet d'installer le site web sur les téléphones compatibles.

Il montre ensuite comment fonctionne le offline et le lie-fi (mauvaise connexion), il faut donc mettre en place des service workers. Le concept est simple, il s'agit de code js qui peut tourner en background. Pour cela le navigateur enregistre le service worker et le lance en tâche de fond. Les applications du service worker sont simples, il s'agit surtout de la mise en place de cache pour nous permettre de récupérer des données offline.

Toute la présentation est faite avec des comparaisons sur le chargement de pages en live, je vous invite donc à la regarder.

[embed]https://www.youtube.com/watch?v=qDJAz3IIq18&w=560&h=315[/embed]

&nbsp;

#### **Mythbusting HTTPS (Emily Schechter)**
Les PWA obligent le site à être en HTTPS, et Emily Schechter vient pour détruire l'ensemble des idées reçues sur ce protocole.

<ul>
<li>Mon site n'est pas assez important pour être en HTTPS</li>
</ul>
Tous les sites méritent d'être en HTTPS car cela permet de le sécuriser

<ul>
<li>HTTPS rend le site plus lent</li>
</ul>
Il existe plusieurs façons d'améliorer les performances de l'HTTPS, elle nous en donne quelques-unes que je vous invite à découvrir dans la vidéo.

<ul>
<li>HTTPS coûte plus cher</li>
</ul>
Aujourd'hui, on peut acheter des certificats HTTPS pas chers voire gratuits, ce qui permet de limiter le coût sur votre site web.

<ul>
<li>Comment migrer en HTTPS avec des partenaires tiers ?</li>
</ul>
C'est la partie la plus difficile du passage en HTTPS, aujourd'hui de nombreux partenaires passent en HTTPS mais certains bloquent le process. Morale : choisissez bien les partenaires extérieurs.

Elle termine par un petit cours sur l'HTTP2 qui permet de gagner en performance.

[embed]https://www.youtube.com/watch?v=e6DUrH56g14&w=560&h=315[/embed]

&nbsp;

#### Instant Loading with HTTP/2 (Surma)
Une piqûre de rappel signée Surma, sur ce que sont les webperformances. Il insiste sur le fait que la première visite est la plus importante et qu'il faut absolument faire en sorte que le site s'affiche sans le cache avec une performance équivalente.

Il nous donne donc quelques principes de base:

<ul>
<li>avoir des assets petites (css/images/js)</li>
<li>compresser les échanges réseaux</li>
<li>pour éviter la page blanche, streamer la page (lazyload)</li>
<li>charger la CSS en asynchrone (https://github.com/filamentgroup/loadCSS)</li>
<li>utiliser le cache busting</li>
<li>paramétrer correctement les headers HTTP</li>
<li>utiliser HTTP/2 https://github.com/GoogleChrome/simplehttp2server</li>
</ul>
&nbsp;

[embed]https://www.youtube.com/watch?v=G62aCRIlONU&w=560&h=315[/embed]

&nbsp;

#### Deep Engagement with Push Notifications (Owen Campbell-Moore)
L'intérêt des PWA est aussi de pouvoir faire des push notifications comme avec une application native.  Owen Campbell-Moore nous explique que les push notifications permettent un meilleur engagement de l'utilisateur, dans le cas d'une notification intelligente.

D'ailleurs, il nous donne les règles d'une bonne notification:

<ul>
<li>Elle doit être timée</li>
<li>Elle doit être précise</li>
<li>On doit comprendre qui l'envoie</li>
</ul>
La suite de la conférence nous permet de mettre en place notre première push notification, je vous invite à voir ce <a href="https://developers.google.com/web/fundamentals/getting-started/push-notifications/">code lab</a>.

[embed]https://www.youtube.com/watch?v=Zq-tRtBN3ws[/embed]

&nbsp;

#### UI Elements at 60fps (Paul Lewis)
La conférence la plus technique de ces deux journées. Paul Lewis montre que faire une application mobile comme une applicative peut causer de gros problèmes de performance. Il nous explique comment les éviter avec trois use-cases d'interface d'application mobile :

<ul>
<li>le menu bugger</li>
<li>le swip</li>
<li>la liste qui s'agrandit</li>
</ul>
Cette conférence est très dure à résumer, je vous invite donc à regarder la vidéo.

[embed]https://www.youtube.com/watch?v=ZqdNgn5Huqk&w=560&h=315[/embed]

#### Progressive Web Apps in Any Context (Rod Dodson)
Maintenant que vous savez faire des PWA, Rod Dodson propose de mettre en place les technologies pour améliorer l'accessibilité aux personnes présentant un handicap.

La première étape est de mettre en place le tabindex qui permet de se déplacer entre les liens (ou actions) de votre application en appuyant sur la touche 'tab'.

Le problème de l'utilisation du tabindex dans une application mobile (SPA) est de réussir à mettre à jour le tabindex à chaque action utilisateur. Par exemple, si dans une liste d'items l'utilisateur en supprime un, il faut supprimer les tabindex de l'item, Rod Dodson appelle cela le 'detabinator'.

Le second réflexe à avoir pour améliorer l'accessibilité de votre PWA est de mettre en place la norme ARIA que vous pouvez retrouver sur le site  <a href="https://www.w3.org/WAI/intro/aria.php">W3C</a>.

[embed]https://www.youtube.com/watch?v=8dr_IUGwsO0&w=560&h=315[/embed]

&nbsp;

#### Progressively Enhanced Markup: Using Web Components to Build PWAs (Eric Bidelman)
Eric Bidelman nous donne un cours sur les web components, pour cela il nous donne des exemples concrets avec Polymer. La conférence étant assez technique il faut la regarder pour tout comprendre, je vous invite aussi à faire le <a href="https://codelabs.developers.google.com/codelabs/polymer-first-elements/index.html?index=..%2F..%2Findex#0">code lab</a>.

[embed]https://www.youtube.com/watch?v=pBCDdeqzUlY&w=560&h=315[/embed]

&nbsp;

#### Putting the Progressive in Progressive Web Apps (Paul Kinlan)
Pas grand chose à dire sur cette conférence. Ce qu'il faut retenir est qu'il ne faut pas faire une PWA pour faire une PWA, mais il faut d'abord choisir les fonctionnalités que l'on souhaite pour nos utilisateurs.

[embed]https://www.youtube.com/watch?v=zHNYFUhVzgw&w=560&h=315[/embed]

&nbsp;

#### Tools for Success (Mat Scales)
Le service worker étant la base d'une PWA, Mat Scales nous propose de nombreuses librairies disponibles sur Github pour mettre en place les différents caches des services worker. L'idée est de rendre le code plus simple et très générique, vous pouvez retrouver toutes les librairies <a href="https://github.com/GoogleChrome/">ici</a>.

Il nous montre aussi les dev-tools, que Chrome a mis en place pour nous permettre de travailler sur nos PWA et qui sont disponibles à partir de la version 52 de Chrome. Elles permettent de voir les services worker en cours, de mettre votre application en offlline, de vérifier le cache utilisé, parmi plein d'autres fonctionnalités.

[embed]https://www.youtube.com/watch?v=m2Zk5CgVX9I[/embed]

&nbsp;

#### To the Lighthouse (Jeffrey Posnick)
Certainement l'une des meilleures conférences de la journée, Jefferey Posnick nous montre comment mettre en place sa première PWA en s'aidant de l'extension <a href="https://github.com/GoogleChrome/lighthouse">LightHouse</a>.

Pour cela, il utilise un projet Github qu'il passe étape par étape pour améliorer le score sur LightHouse.

<ol>
<li class="p2">Isomorphique <a href="https://github.com/GoogleChrome/sw-precache/compare/step1...step2">https://github.com/GoogleChrome/sw-precache/compare/step1...step2</a></li>
<li class="p2">Service worker <a href="https://github.com/GoogleChrome/sw-precache/compare/step2...step3">https://github.com/GoogleChrome/sw-precache/compare/step2...step3</a></li>
<li class="p2">Manifest <a href="https://github.com/GoogleChrome/sw-precache/compare/step3...step4">https://github.com/GoogleChrome/sw-precache/compare/step3...step4</a></li>
</ol>
[embed]https://www.youtube.com/watch?v=LZjQ25NRV-E&w=560&h=315[/embed]

&nbsp;

#### Autres conférences
Les autres conférences étant assez redondantes, je vous invite à voir les vidéos disponibles <a href="https://www.youtube.com/playlist?list=PLNYkxOF6rcIAWWNR_Q6eLPhsyx6VvYjVb">ici</a>.

Vous pouvez aussi faire les différents code lab disponibles <a href="https://codelabs.developers.google.com/?cat=Web">ici</a>, qui vous permettrons de mettre en place votre première PWA.

Pour voir des exemples de PWA, un site dédié à été mis en place <a href="https://pwa.rocks/">ici</a>.


