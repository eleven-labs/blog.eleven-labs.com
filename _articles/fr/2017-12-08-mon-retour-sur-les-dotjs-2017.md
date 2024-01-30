---
contentType: article
lang: fr
date: '2017-12-08'
slug: retour-sur-les-dotjs-2017
title: Retour sur les DotJS 2017
excerpt: >-
  DotJS est la plus grande conférence JavaScript en Europe et c'est souvent
  l'occasion de parler des nouvelles technologies à notre disposition et
  découvrir ce que nous réserve le futur de ECMAScript. Cette année, elle se
  déroulait pour la deuxième fois aux docks d'Aubervilliers, au nord de Paris.
  Ce qui nous a permis de profiter d'un confort digne d'une salle de cinéma !
  Petit résumé de ce qu'il s'y est passé...
oldCover: /assets/2017-12-08-dotjs-2017/cover.jpg
categories:
  - javascript
authors:
  - mlenglet
keywords:
  - conference
  - dotjs
  - nodejs
---
![DotJS logo]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/logo.png)

[DotJS](https://www.dotjs.io/) est la plus grande conférence JavaScript en Europe et c'est souvent l'occasion de parler des nouvelles technologies à notre disposition et découvrir ce que nous réserve le futur de ECMAScript.

Cette année, elle se déroulait pour la deuxième fois aux docks d'Aubervilliers, au nord de Paris. Ce qui nous a permis de profiter d'un confort digne d'une salle de cinéma !

La conférence s'articule autour d'une dizaine de talks d'une demi-heure répartis tout au long de la journée. En début d'après-midi des "Lightning Talks" d'une durée de cinq minutes chacun portent sur des sujets diverses et nous laisser digérer le copieux buffet du déjeuner.

## Talks - 1ère partie

Après un bon petit-déjeuner offert par les partenaires de l'événement, il est temps de commencer.

### Wes Bos

![Wes Bos]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/wesbos.jpg)

C'est [Wes](https://twitter.com/wesbos) qui ouvre le bal avec un talk sur les promesses et l'évolution vers le couple async/await.
Il revient notamment sur la problématique historique du JavaScript sur la gestion de l'asynchrone et notamment sur les problèmes très connus que sont le _Callback of Hell_ ou la _Pyramide of Doom_.

Les promesses sont LA solution qui a permis de faciliter la gestion du workflow, en le rendant nativement plus lisible et efficace.
Wes démontre d'ailleurs leur utilisation maintenant commune dans la plupart des APIs des navigateurs web en prenant l'exemple de [fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API).

ECMAScript 2017 introduit la nouvelle syntaxe async/await qui permet d'améliorer cette gestion en offrant un code encore plus lisible, se rapprochant d'un code synchrone. Wes finit par montrer les différentes possibilités pour gérer les erreurs avec cette nouvelle syntaxe.

_[Voir ses slides](https://wesbos.github.io/Async-Await-Talk/#1)_

### Trent Willis

![Trent Willis]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/trentwillis.jpg)

[Trent Willis](https://twitter.com/trentmwillis) enchaîne ensuite sur comment bien tester son application web et quels sont les outils disponibles pour y arriver. Il cite notamment Chrome DevTools qui offre tout une gamme d'outils comme par exemple le calcul de la couverture de code.
Cela permet de savoir quelle proportion de code JS/CSS a réellement été utilisée par le navigateur et ainsi procéder, si nécessaire, à un nettoyage.
Il présente aussi d'autre outils comme puppeteer, q-unit-in-browser ou encore ember-macro-benchmark

_[Voir ses slides](http://pretty-okay.com/static/slides/dot-js_working-well-future-testing.pdf)_

### Suz Hinton

![Suz Hinton]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/suzhinton.jpg)

Après une introduction faisant le parallèle entre l'accessibilité sur le web et une proposition de changement du logo international du handicap (♿), [Suz Hinton](https://twitter.com/noopkat) présente une démonstration de code en machine learning qui, grâce à une requête fetch(), va interroger une API pour ajouter des attributs HTML alt sur une galerie d'images Instagram, et l'accessibiliser.

Une autre de ses démonstrations porte sur l'injection de sous-titres en direct sur ses streamings Twitch : elle transmet en direct son speech audio par WebSockets jusqu'à un serveur qui lui retransmet la transcription en texte. Celle-ci est ensuite incrustée avec la vidéo par un petit hack. Cette dernière phase nécessitait auparavant des extensions spécifiques à Chrome mais désormais une extension JavaScript est prévue par Twitch.

### Feross Aboukhadijeh

![Feross Aboukhadijeh]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/feross.jpg)

[Feross](https://feross.org/) aime enfreindre les règles sur le web et bidouiller les navigateurs.
Ainsi il fait la démonstration d'une technique éprouvée permettant d'activer la webcam des visiteurs d'un site à leur insu en passant par les autorisations du plugin Flash. Celles-ci sont hébergées par une page d'Adobe, qui peut être placée en iframe transparente au-dessus de la page courante. En faisant croire à un jeu et en incitant l'internaute à cliquer sur plusieurs boutons qui se déplacent successivement à 4 emplacements stratégiques, on provoque des clics sur l'interface de gestion délicate d'Adobe Flash qui débloque l'accès à la webcam.

Une autre limitation qui peut être enfreinte est celle du stockage de données dans le navigateur via localStorage, qui est normalement plafonné à quelques Mo par nom de domaine. Or il "suffit" d'exploiter une myriade de sous-domaines différents pour rapidement remplir le disque dur du visiteur innocent. Principe démontré par [Filldisk.com](http://www.filldisk.com/).

Dans le même ordre d'idées, on peut utiliser l'API Fullscreen pour du phishing, en faisant croire au visiteur qu'il est sur le site de sa banque et récupérer ses identifiants.

Feross jongle ainsi avec les popups, leur déplacement sur l'écran, leur génération automatique suite à une action de l'utilisateur et les équipe de comportements bien embêtants : impossibilité de les attraper/fermer, auto-redimensionnement aux coordonnées de la souris, etc. En écoutant des events comme keypress, on peut ouvrir à nouveau une vidéo en plein écran.

Vous pouvez en retrouver la compilation sur [Theannoyingsite.com](http://www.theannoyingsite.com/).

## Lightning Talks

![La salle de conférence]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/lightningtalks.jpg)

Les Lightning Talks sont une suite de petites présentations d'environ cinq minutes. Elles permettent de présenter des sujets simples ne nécessitant pas la durée complète d'un talk. Ces sujets sont très variés et peuvent être aussi bien une anecdote amusante, un rappel utile, une découverte intéressante ou la présentation du métier et/ou produit d'un des partenaires de l'événement.

Nous avons donc eu :

- Un rappel sur l'utilité et la mise en place du SSR (Server Side Rendering)
- Une présentation des comportements parfois contre-intuitifs de JavaScript lors d'addition/concaténation, de comparaison ou encore d'affectation
- La création d'un jeu avec React/Redux
- Comment faire du traitement d'image avec les APIs WebAudio
- Une présentation de TypeScript
- La gestion du State avec GraphQL
- Comment marchent les GPUs et leur utilisation au niveau du Web

## Talks - 2ème partie

Après un déjeuner plus que mérité, il est temps de continuer.

### Adrian Holovaty

![Adrian Holovaty]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/adrianholovaty.jpg)

Voilà un sujet intéressant que l'on pourrait penser à contre-courant. [Adrian Holovaty](https://twitter.com/adrianholovaty), co-fondateur du célèbre framework Django nous fait un plaidoyer en faveur d'une notion simple : arrêter d'utiliser des frameworks.

Derrière ce constat vient l'expérience d'Adrian avec Django qui a fini par devenir une "usine à gaz" à force de demandes et de corrections de bugs qui ne les concernaient, lui et son équipe, nullement. Le projet qu'ils avaient monté pour se faciliter la vie suite à des demandes de rentabilité de sa direction ne leur appartenaient plus. Les nouvelles features et correction de bugs ne leur étaient d'aucune utilité.

C'est pourquoi avec son nouveau site [SoundSlice](https://www.soundslice.com/scores/auld-lang-syne/), Adrian n'a utilisé que du JavaScript simple (_plain javascript_ dans la langue de Shakespeare). Et le résultat est assez impressionnant. L'interface est fluide, ergonomique et totalement responsive (les partitions aussi !).

Mais attention de ne pas faire l'erreur : Adrian utilise bien des bibliothèques pour réaliser son site. Il ne va pas réinventer la roue à chaque fois. Mais il faut comprendre la différence fondamentale entre bibliothèque et framework : un framework appelle votre code, tandis qu'une bibliothèque est, elle, appellée par votre code.

### Thomas Watson

![Thomas Watson]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/thomaswatson.jpg)

[Thomas Watson](https://twitter.com/wa7son) nous explique pendant près de 15 minutes comment les avions communiquaient entre eux et comment le contrôle aérien pouvait récupérer énormément d'informations sur ses radars. Quel rapport avec JavaScript me direz-vous ? Et bien Thomas s'est mis en tête de créer une application permettant de capter les signaux émis par les avions à plusieurs dizaines de kilomètres (protocole ADS-B) puis récupérer leur identification transpondeur, altitude, longitude, latitude, etc, et les placer sur une carte en direct. Toutes ces données sont librement accessibles et il n'y aucune sécurité (ce qui peut poser des questions...). Il suffit de s'équiper d'une petite antenne radio grand public (chip RTL2832U fréquence 1090 Mhz) et de la piloter avec Node.JS.
Si vous êtes intéressé, n'hésitez pas à consulter ses projets récents sur son compte GitHub : [rtl-sdr](https://github.com/watson/rtl-sdr), [mode-s-decoder](https://github.com/watson/mode-s-decoder).

_[Voir ses slides](https://speakerdeck.com/wa7son/dotjs-2017-getting-data-from-the-sky)_

### Sean Larkin

![Sean Larkin]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/seanlarkin.jpg)

[Sean Larkin](https://www.twitter.com/thelarkinn) est, entre autres, un des _lead maintainer_ sur [Webpack](https://webpack.js.org/). Et ça tombe bien, car il a décidé de nous expliquer comment que tout ça marche dedans.
Il nous introduit la bibliothèque [Tapable](https://github.com/webpack/tapable) qui constitue l'épine dorsale de Webpack.
Elle permet d'étendre les classes de base, d'attraper les événements de compilation et donc de personnaliser le fonctionnement global et l'architecture du compilateur de WebPack...
Il nous présente enfin le futur de Webpack avec sa version 4 : amélioration des performances, réduction de la taille des fichiers générés, gestion intelligente du chargement asynchrone des fichiers JavaScript.

### Marcy Sutton

![Marcy Sutton]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/marcysutton.jpg)

[Marcy](https://www.twitter.com/marcysutton) met particulièrement l'accent dans son travail sur l'accessibilité. Elle souhaite prendre en compte toutes les spécificités : handicap, situation géographique, capacités de lecture, âge, matériel, moyens, vitesse d'accès au réseau. Elle démontre ainsi l'importance de JavaScript sur ce domaine et comment il est possible d'apporter des améliorations en suivant quelques critères :

- Respecter la structuration du document, les niveaux de titres
- Faire attention au contraste et aux couleurs
- Mieux gérer le focus (ne jamais utiliser `* { outline: none;` } en CSS) et permettre la navigation clavier par tabulation (en ajustant avec l'attribut tabindex s'il le faut)
- Utilisation d'ARIA avec par exemple aria-label sur les icônes
- Si des éléments de la page sont cachés (par exemple un menu en `display: none` affiché lors du clic sur un "hamburger"), il convient d'appliquer l'attribut `inert` sur le conteneur HTML. Malheureusement il faudra souvent utiliser des polyfills (WCIG inert).

Enfin, la meilleure façon de se rendre compte de la bonne accessibilité ou non de notre site, est d'utiliser les même outils que ceux qui en ont besoin. C'est le rôle que remplissent [axe-coconut](https://axe-core.org/coconut/) ou Chrome Accessibility Debugger, en permettant d'effectuer des audits.

_[Voir ses slides](https://marcysutton.github.io/enabling-users/)_

### Tom Dale

![Tom Dale]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/tomdale.jpg)

En tant que _Software Engineer_ chez LinkedIn et co-créateur de Ember.js, [Tom Dale](https://twitter.com/tomdale) travaille principalement sur les performances d'affichage et notamment les marchés émergents.

On peut distinguer 3 grand axes pour agir sur la vitesse de chargement d'une page :
- le téléchargement
- le parsing
- le rendu

Le téléchargement est solutionné par l'introduction des bundlers (Webpack, Rollup...), de la minification, compression et de la réduction générale de la taille des fichiers.
On peut aussi économiser du temps sur le parsing et le rendu en utilisant le SSR (Serveur Side Rendering).

Mais la réactivité de l'interface est aussi importante : elle doit se mettre à jour rapidement, comporter des animations fluides et supporter une fréquence de 60 images par seconde.
Une solution récente à ce dernier problème a été l'introduction d'un DOM Virtuel (Shadow DOM) notamment utilisé par React. Cela permet de résoudre les soucis de réactivité et de rendering des navigateurs.

Mais comme l'explique Tom, le mobile exacerbe tous ces problèmes. Si votre terminal possède un processeur lent, le parsing peut parfois prendre deux fois plus de temps que le téléchargement !
La solution à ce souci serait [Glimmer](https://glimmerjs.com/) qui permet de transformer JavaScript en langage compilé (!). En gros, le but sera de pré-compiler tout votre code en bytecode qui sera directement interprété par une petite machine virtuelle sur le navigateur.
Résultat : le téléchargement est plus rapide, le compilé étant plus léger, le parsing est quasi inexistant.

Mais ce n'est pas tout, car la machine virtuelle est en fait deux petites machines virtuelles qui ont chacune une tâche spécifique : l'une à la création, l'autre à l'update. Les performances sont réelles et permettent de dépasser aisément ce que fait React sans les nombreuses techniques d'optimisation manuelle de ce dernier (`shouldComponentUpdate`, `PureComponent`, etc).

Vous pouvez tester cette nouvelle technique sur [Glimmer Playground](https://glimmer-playground.netlify.com/). Cela se destine aux sites les plus gourmands pour l'instant, mais cela pourrait se démocratiser dans quelques années !

### Brendan Eich

![Brendan Eich]({BASE_URL}/imgs/articles/2017-12-08-dotjs-2017/brendaneich.jpg)

[Brendan Eich](https://twitter.com/brendaneich) n'est autre que le créateur de JavaScript lui-même. Comme il lui est souvent demandé, il nous présente la genèse et l'évolution du JS au fur et à mesure des années avec évidemment son lot de difficultés et d'espoir.

Il nous présente ensuite ce que nous réserve le comité ECMA pour les années à venir avec notamment les gestions des BigInt, de nouvelles syntaxes pour la gestion de l'asynchrone (`for await of`), etc.

Il finit sur un ton plus philosophique en exposant le fait que, que pendant des années, énormément de personnes n'ont pas cru en JavaScript et lui disaient "Non, on ne pourra jamais faire ça avec du JS". Il l'a à chaque fois démenti en introduisant des notions avancées comme WebGL.

Comme disait Ian Ickson, un des rédacteurs de la spec HTML5 :
> Things that are impossible just take longer

_[Voir ses slides](https://brendaneich.com/wp-content/uploads/2017/12/dotJS-2017.pdf)_

## En bref

Cette année, dotJS est clairement une réussite. Avec des talks extrêmement intéressants, trouvant le juste ton entre complexité, amusement et vulgarisation.
Vivement les dotJS 2018 !
