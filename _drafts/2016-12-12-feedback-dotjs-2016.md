---
layout: post
title: Feedback dotJS 2016
author: damien
date: '2016-12-12 17:40:34 +0100'
date_gmt: '2016-12-12 16:40:34 +0100'
categories:
- Javascript
tags:
- Javascript
- AngularJS
- dotJS
---
{% raw %}
La 5ème édition des conférences dotJS a battu un nouveau record d'affluence ce lundi 5 décembre en accueillant environ 1500 personnes. Cette année le rendez-vous était fixé au Dock Pullman à Aubervilliers, en région Parisienne.

Bien que le charme du théâtre parisien des années passées n'y était plus, il était beaucoup plus agréable de suivre une journée entière de conférence dotJS dans cette salle de bon volume, bien ventilée et avec de bons sièges :)

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/dotjs-1.jpg"><img class="wp-image-2845 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/dotjs-1-300x224.jpg" alt="dotjs-1" width="554" height="414" /></a>

&nbsp;

La journée est composée de dix regular talks (sujets de 30 min présentés par des personnalités) et de huit lightning talks (sujets de 5 min présentés par des courageux ;)). Quatre sessions au total temporisent la journée, intercalées par des temps de pauses suffisamment long pour se ressourcer. Ce fût très enrichissant tout en étant très agréable.

Voici un résumé des talks présentés :

<strong>Talk 1 - Nolan Lawson (Maintainer of <a href="https://pouchdb.com/" target="_blank">PouchDB</a>, Web Platform PM for <a href="https://www.microsoft.com/en-us/windows/microsoft-edge" target="_blank">Microsoft Edge</a>)</strong>

Nolan nous présente le challenge à venir des applications web faisant face aux applications natives. Aujourd'hui, HTML5 est une vraie réponse à Flash/Silverlight. Les Progressive Web Apps arrivent rapidement sur le marché. Le service worker est son élément essentiel et il permet de faire bénéficier aux Web Apps les avantages des applications natives. À bien noter que les services workers nécessitent HTTPS.

Souhait de Nolan à l'issue de l'interview : les développeurs ne doivent pas hésiter à remonter des bugs de navigateurs.

<strong>Talk 2 - Ada Rose Edwards (Senior Engineer at <a href="http://www.samsung.com/us/aboutsamsung/samsung_electronics/business_area/rd_page/" target="_blank">Samsung Research UK</a>)</strong>

Ada Rose nous communique sa passion récente à la réalité virtuelle et de ses applications à venir. Ce secteur évolue très rapidement et il est difficile d'estimer son évolution. Elle nous présente l'aide au rendu de l'API VR de Samsung. Elle nous définit également le nouveau standard <a href="http://smus.com/copresence-webvr/">WebVR Copresence</a> basé entre autre sur la RTC Peer connection. Le challenge à venir est de pousser la VR sur le web.

Souhait de Ada Rose à l'issue de l'interview : les développeurs ne doivent pas hésiter à s'impliquer dans les standards WebVR. Les novices sont autant utiles que les expérimentés car ils aideront à rendre le standard plus simple à utiliser.

<strong>Talk 3 - Christophe Porteneuve (JavaScript <a href="http://delicious-insights.com/" target="_blank">trainer</a> &amp; author)</strong>

Christophe parle de l'utilisation des transpilers (Babel, Typescript,...) et de leurs impacts sur la performance. Il faut donc encourager le support natif de ES6+ dans les navigateurs.

<strong>Talk 4 - Guy Bedford (Creator of <a href="https://github.com/systemjs/systemjs" target="_blank">SystemJS</a> and <a href="http://jspm.io/" target="_blank">jspm.io</a>)</strong>

Guy introduit sa présentation avec les imports de module et Web Assembly, pour présenter ensuite <a href="https://github.com/systemjs/systemjs">SystemJS</a> qui est un système d'import dynamique universel.

<strong>Talk 5 - Marko - <em>Lightning talk</em></strong>

Présentation des technologies autour de <a href="https://facebook.github.io/react/">React</a> comme <a href="http://redux.js.org/">Redux</a>, <a href="https://github.com/Reactive-Extensions/RxJS">RxJS</a> et l'utilisation des streams.

<strong>Talk 6 - Rolf Erik Lekang - <em>Lightning talk</em></strong>

Présentation de son projet <a href="https://github.com/relekang/lint-filter">lint-filter</a> permettant de facilement exposer les erreurs syntaxiques javascript seulement sur les différents fichiers modifiés depuis le master.

<strong>Talk 7 - Vladimir De Turckheim - <em>Lightning talk</em></strong>

Avertissement sur les injections <a href="https://www.mongodb.com/fr">MongoDb</a> et l'importance d'être sur une version supérieure ou égale à 2.6 pour MongoDb. Conseil de l'utilisation d'ODM tel que <a href="https://github.com/hapijs/joi">JOI</a> intégrable facilement à <a href="https://hapijs.com/">Hapi.js</a> ou <a href="http://expressjs.com/fr/">expressJS</a>.

<strong>Talk 8 - Maxime - <em>Lightning talk</em></strong>

Présentation de <a href="https://github.com/MoOx/phenomic">Phenomic</a> qui est un générateur de website basé sur React et l'écosystème de <a href="https://webpack.github.io/docs/">Webpack</a>.

<strong>Talk 9 - Zeke Sikelianos (<a href="http://electron.atom.io/" target="_blank">Electron</a> enthusiast at GitHub)</strong>

Zeke nous parle des évolutions de navigateurs pour retracer leur spectaculaire amélioration depuis netscape. Petit clin d’œil ensuite au site de npm qui n'a lui, par contre, pratiquement jamais évolué depuis sa création.

Il ne nous cache pas une certaine frustration par rapport à la lenteur d'évolution de npm. C'est pourquoi le projet <a href="https://github.com/yarnpkg/yarn">Yarn</a> est né comme une alternative à npm. Yarn est à npm ce que io.js était à node.js. L'ambition en est la même. Il espère que yarn soit une alternative pour bousculer npm dans ses évolutions.

On retrouve dans Yarn les mêmes fonctionnalités que dans npm et Zeke défend sa meilleure gestion des paquets.

Ensuite nous faisons un tour dans l'écosystème des paquets node.js avec <a href="https://github.com/OctoLinker/browser-extension">Octolinker</a>, <a href="https://libraries.io/">libraries.io</a> et <a href="https://github.com/VictorBjelkholm/trymodule">trymodule</a>. On s'arrête un instant sur des commandes très utiles de trymodule avec <strong>try</strong>, <strong>ghwd</strong> et <strong>ntl</strong> (show scripts available).

On finit par une brève description de <a href="http://electron.atom.io/">Electron</a>. Un framework permettant de créer des applications desktop native cross platform avec JavaScript, HTML, and CSS. Le projet est né avec l'éditeur Atom chez Github précédemment nommé Atom Shell.

<strong>Talk 10 - Evan You (Creator of <a href="https://vuejs.org/" target="_blank">Vue.js</a>)</strong>

Evan nous fait une belle présentation technique de <a href="https://vuejs.org/">Vue.js</a>. C'est un framework qui permet de fabriquer rapidement et simplement des Progressive Web Apps. Il est basé sur le "Pull-based change propagation" comme par exemple <a href="http://knockoutjs.com/">Knockout</a>, <a href="https://www.meteor.com/">Meteor</a> ou <a href="https://github.com/mobxjs/mobx">MobX</a> (le pull étant déclenché par l'utilisateur). On appelle ce concept le <a href="https://en.wikipedia.org/wiki/Reactive_programming">Reactive Programming</a>. On notera que le framework est muni d'un tracker de mémoire qui est un bon outil de suivi de performance.

<strong>Talk 11 - Bertrand Chevrier - <em>Lightning talk</em> (<a href="https://github.com/krampstudio">Krampstudio</a>)</strong>

Bertrand nous présente <a href="https://github.com/vim-dist/webvim">WebVim</a>, notre IDE minimaliste favori version web.

<strong>Talk 12 - Gonçalo Morais - <em>Lightning talk</em></strong>

Gonçalo nous parle d'opérations binaires avec js.

<strong>Talk 13 - Sébastien Chopin - <em>Lightning talk</em></strong>

Sébastien nous présente <a href="https://github.com/nuxt/nuxt.js">Nuxt.js</a> (un framework minimaliste pour des rendus serveur d'applications Vue.js inspiré par <a href="https://zeit.co/blog/next">Next.js</a>), puis <a href="https://github.com/vuejs/vuex">Vuex</a> un gestionnaire d'états centralisé pour Vue.js.

<strong>Talk 14 - Thomas Belin - <em>Lightning talk</em></strong>

Thomas nous présente brièvement le concept de <a href="https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976#.n2y832zfz">Pure Functions</a>.

<strong>Talk 15 - Fedot Indutny (Core contributor to <a href="https://nodejs.org/en/" target="_blank">Node.js</a>)</strong>

Fedot nous présente <a href="https://github.com/nodejs/llnode">llnode</a>, un plugin lldb pour Node.js C++. On apprend à manipuler les données comme le CPU avec Uint8Array (ou Uint64Array).  Il expose ensuite quelques commandes intéressantes à retenir comme <strong>findjsobjects</strong>, <strong>findjsinstances</strong>, <strong>findrefs</strong>. C'est un outil utile pour débugger et trouver les fuites mémoires.

<strong>Talk 16 - Sam Wray abd Tim Pietrusky (Digital Artists at <a href="http://webvj.ninja/" target="_blank">LiveJS</a>)</strong>

Cette présentation se compose en trois partie. Elle présente une expérimentation musicale orientée autour des technologies web. Dans la première partie, Sam nous parle de l'aspect logiciel. La deuxième partie est présentée par Tim sur l'aspect matériel. La troisième partie fait monter le son ! ;)

<strong>- Part 1 - Sam</strong><br />
Présentation de Live:JS, une interface audio, et de ses technologies web environnantes comme <a href="https://github.com/hughrawlinson/meyda">Meyda</a> (Web Audio API), <a href="https://github.com/2xAA/modV">modV</a>, Canvas 2D, <a href="https://threejs.org/">ThreeJS</a> (WebGL avec GLSL (OpenGL Shader Language)).<br />
<strong>- Part 2 - Tim</strong><br />
Présentation du matériel avec MIDI - Musical Instrument Digital Interface, Web MIDI API, 8x LEDs, FadeCandy, RaspberryPI, WIFI, des Laptops, de l'éclairage DMX Universe et une machine à fumée.<br />
<strong>- Part 3 - Sam + Tim</strong><br />
Ils font tourner les platines et montent le son !

<strong>Talk 17 - Guillermo Rauch (Creator of <a href="http://socket.io/" target="_blank">socket.io</a> &amp; Founder of <a href="https://zeit.co/" target="_blank">zeit.co</a>)</strong>

Guillermo nous présente <a href="https://zeit.co/">zeit.co</a> qui est un système de déploiement cloud simple, global et temps réel. Ensuite il nous fait un aperçu de <a href="https://zeit.co/blog/next">Next.js</a>, qui est un petit framework de rendus-serveur universel pour les applications javascript. Il est construit en surcouche à React, Webpack et Babel.

<strong>Talk 18 - Igor Minar (<a href="https://angularjs.org/" target="_blank">AngularJS</a> lead)</strong>

Il nous raconte une petite histoire :c'est un discours de <a href="https://github.com/fat">Fat</a> à la conférence de dotJS 2012 (à propos de l'open source) qui fût pour lui un réel déclencheur pour le développement de <a href="https://angularjs.org/">Angular.js</a>.

Igor nous fait une petite timeline de l'évolution des frameworks avec <a href="https://angularjs.org/">Angular 1.x</a>, React, <a href="https://angular.io/">Angular 2</a> et <a href="http://emberjs.com/">Ember</a>. Ensuite il nous présente le concept de compilation anticipée (AOT: <a href="https://en.wikipedia.org/wiki/Ahead-of-time_compilation">Ahead-Of-Time compilation</a>).

Puis on revient à Angular et sa communauté, il raconte les sujets du moment autour des Web Components et le rapprochement entre Angular 2 et Microsoft avec son transpiler <a href="https://www.typescriptlang.org/">Typescript</a>. On finira par un appel à ce que la communauté open-source soit ouverte d'esprit. Que les orientations et les décisions des mainteneurs doivent trancher en considérant les paroles de chacun.

&nbsp;

<strong>Fin de la conférence</strong>

On termine cette conférence par un pot autour de quelques bières et de bons échanges.

À l'année prochaine !

{% endraw %}
