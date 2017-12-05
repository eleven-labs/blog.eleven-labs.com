---
layout: post
title: Retour sur les DotJS 2017
excerpt: "DotJS est la plus grande conférence JavaScript en Europe et c'est souvent l'occasion pour parler des nouvelles technologies à notre disposition et découvrir ce que nous réserve le futur de ECMAScript. Cette année, elle se déroulait pour la deuxième fois aux docks d'Aubervilliers, au nord de Paris. Ce qui nous permettait de profiter d'un confort digne d'une salle de cinéma ! Petit résumé de ce qui s'est y passé..."
lang: fr
authors:
    - mlenglet
permalink: /fr/retour-sur-les-dotjs-2017/
categories:
    - javascript
    - conference
    - dotjs
tags:
    - javascript
    - nodejs
    - dotjs
cover: /assets/2017-12-08-dotjs-2017/cover.jpg
---
![DotJS logo]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/logo.png){:class="center-image"}

[DotJS](https://www.dotjs.io/){:rel="nofollow"} est la plus grande conférence JavaScript en Europe et c'est souvent l'occasion pour parler des nouvelles technologies à notre disposition et découvrir ce que nous réserve le futur de ECMAScript.

Cette année, elle se déroula pour la deuxième fois aux docks d'Aubervilliers, au nord de Paris. Ce qui nous permis de profiter d'un confort digne d'une salle de cinéma !

La conférence s'articule autour d'une dizaine de talks d'une demi-heure répartie tout au long de la journée. En début d'après-midi des "Lightning Talks" d'une durée de cinq minutes chacun viennent nous informer sur des sujets diverses et nous laisser digérer le copieux buffet du déjeuner.

## Talks - 1ère partie

Après un bon petit déjeuner offert par les partenaires de l'événement, il est temps de commencer.

### Wes Bos

![Wes Bos]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/wesbos.jpg){:class="center-image"}

C'est [Wes](https://twitter.com/wesbos){:rel="nofollow"} qui ouvre le bal avec un talk sur les promesses et l'évolution vers le couple async/await.
Il revient notamment sur la problématique historique du JavaScript sur la gestion de l'asynchrone et notamment sur les problèmes très connus que sont le _Callback of Hell_ ou la _Pyramide of Doom_.

Les promesses sont LA solution qui a permis de faciliter la gestion du workflow, en le rendant nativement plus lisible et efficace.
Wes démontre d'ailleurs leur utilisation maintenant commune dans la plupart des APIs des navigateurs web en prenant l'exemple de [fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API){:rel="nofollow"}.

ECMAScript 2017 introduit la nouvelle syntaxe async/await qui permet encore d'améliorer cette gestion en offrant un code encore plus lisible se rapprochant d'un code synchrone. Wes finit par démontrer les différentes possibilités pour gérer les erreurs avec cette nouvelle syntaxe.

_[Voir ses slides](https://wesbos.github.io/Async-Await-Talk/#1){:rel="nofollow"}_

### Trent Willis

![Trent Willis]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/trentwillis.jpg){:class="center-image"}

[Trent Willis](https://twitter.com/trentmwillis){:rel="nofollow"} enchaîne ensuite sur comment bien tester son application web et quels sont les outils disponibles pour y arriver. Il cite notamment Chrome DevTools qui offre tout une gamme d'outils comme par exemple le calcul de la couverture de code.
Cela permet de savoir quelle proportion de code JS/CSS a réellement été utilisée par le navigateur et ainsi procéder, si nécessaire, à un nettoyage.
Il présente aussi d'autre outils comme puppeteer, q-unit-in-browser ou encore ember-macro-benchmark

_[Voir ses slides](http://pretty-okay.com/static/slides/dot-js_working-well-future-testing.pdf){:rel="nofollow"}_

### Suz Hinton

![Suz Hinton]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/suzhinton.jpg){:class="center-image"}

Après une introduction faisant le parallèle entre l'accessibilité sur le web et une proposition de changement du logo international du handicap (♿), [Suz Hinton](https://twitter.com/noopkat){:rel="nofollow"} présente une démonstration de code en machine learning qui, grâce à une requête fetch(), va interroger une API pour ajouter des attributs HTML alt sur une galerie d'images Instagram, et l'accessibiliser.

Une autre de ses démonstrations porte sur l'injection de sous-titres en direct sur ses streamings Twitch : elle transmet en direct son speech audio par WebSockets jusqu'à un serveur qui lui retransmet la transcription en texte. Celle-ci est ensuite incrustée avec la vidéo par un petit hack. Cette dernière phase nécessitait auparavant des extensions spécifiques à Chrome mais désormais une extension JavaScript est prévue par Twitch.

### Feross Aboukhadijeh

![Feross Aboukhadijeh]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/feross.jpg){:class="center-image"}

[Feross](https://feross.org/){:rel="nofollow"} aime enfreindre les règles sur le web et bidouiller les navigateurs.
Ainsi il fait la démonstration d'une technique éprouvée permettant d'activer la webcam des visiteurs d'un site à leur insu en passant par les autorisations du plugin Flash. Celles-ci sont hébergées par une page d'Adobe, qui peut être placée en iframe transparente au-dessus de la page courante. En faisant croire à un jeu et en incitant l'internaute à cliquer sur plusieurs boutons qui se déplacent successivement à 4 emplacements stratégiques, on provoque des clics sur l'interface de gestion délicate d'Adobe Flash qui débloque l'accès à la webcam.

Une autre limitation qui peut être enfreinte est celle du stockage de données dans le navigateur via localStorage, qui est normalement plafonné à quelques Mo par nom de domaine. Or il "suffit" d'exploiter une myriade de sous-domaines différents pour rapidement remplir le disque dur du visiteur innocent. Principe démontré par [Filldisk.com](http://www.filldisk.com/){:rel="nofollow"}.

Dans le même ordre d'idée, on peut utiliser l'API Fullscreen pour du phishing, en faisant croire au visiteur qu'il est sur le site de sa banque et récupérer ses identifiants.

Feross jongle ainsi avec les popups, leur déplacement sur l'écran, leur génération automatique suite à une action de l'utilisateur et les équipe de comportements bien embêtants : impossibilité de les attraper/fermer, auto-redimensionnement aux coordonnées de la souris, etc. En écoutant des events comme keypress, on peut ouvrir à nouveau une vidéo en plein écran.

Vous pouvez en retrouver la compilation sur [Theannoyingsite.com](http://www.theannoyingsite.com/){:rel="nofollow"}.

## Lightning Talks

![La salle de conférence]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/lightningtalks.jpg){:class="center-image"}

Les Lightning Talks sont une suite de petites présentations d'environ cinq minutes. Elle permettent de présenter des sujets simples ne nécessitant pas la durée complète d'un talk. Ces sujets sont très variés et peuvent être aussi bien une anecdote amusante, un rappel utile, une découverte intéressante ou la présentation du métier et/ou produit d'un des partenaires de l'événement.

Nous avons donc eu :

- Un rappel sur l'utilité et la mise en place du SSR (Server Side Rendering)
- Une présentation des comportements parfois contre-intuitif de JavaScript lors d'addition/concaténation, de comparaison ou encore d'affectation
- La création d'un jeu avec React/Redux
- Comment faire du traitement d'image avec les APIs WebAudio
- Une présentation de TypeScript
- La gestion du State avec GraphQL
- Comment marche les GPUs et leur utilisation au niveau du Web

## Talks - 2ème partie

Après un déjeuner plus que mérité, il est temps de continuer.

### Adrian Holovaty

![Adrian Holovaty]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/adrianholovaty.jpg){:class="center-image"}

Voilà un sujet intéressant que l'on pourrait penser à contre-courant. [Adrian Holovaty](https://twitter.com/adrianholovaty){:rel="nofollow"}, co-fondateur du célèbre framework Django nous fait un plaidoyer en faveur d'une notion simple : arrêter d'utiliser des frameworks.

Derrière ce constat vient l'expérience d'Adrian avec Django qui a fini par devenir une "usine à gaz" à force de demande et de correction de bug qui ne le concernait, lui et son équipe, nullement. Le projet qu'ils avait monté pour se faciliter la vie suite à des demandes de rentabilité de sa direction ne leur appartenaient plus. Les nouvelles features et correction de bugs ne leur étaient d'aucune utilité.

C'est pourquoi avec son nouveau site [SoundSlice](https://www.soundslice.com/scores/auld-lang-syne/){:rel="nofollow"}, Adrian n'a utilisé que du JavaScript simple (_plain javascript_ dans la langue de Shakespeare). Et le résultat est assez impressionnant. L'interface est fluide, ergonomique et totalement responsive (les partitions aussi !).

Mais attention de ne pas faire l'erreur. Adrian utilise bien des bibliothèques pour réaliser son site. Il ne va pas réinventer la roue à chaque fois. Mais il faut comprendre la différence fondamentale entre bibliothèque et framework : Un framework appelle votre code, tandis que votre code appelle une bibliothèque.

### Thomas Watson

![Thomas Watson]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/thomaswatson.jpg){:class="center-image"}

[Thomas Watson](https://twitter.com/wa7son){:rel="nofollow"} nous explique pendant près de 15 minutes comment les avions communiquaient entre eux et comment le contrôle aérien pouvait récupérer énormément d'information sur leur radar. Quel rapport avec JavaScript me diriez-vous ? Et bien Thomas s'est mis en tête de créer une application permettant de capter les signaux émis par les avions à plusieurs dizaines de kilomètres (protocole ADS-B) puis récupérer leur identification transpondeur, altitude, longitude, latitude, etc, et les placer sur une carte en direct. Toutes ses données sont librement accessible et il n'y aucune sécurité (ce qui peut poser des questions...). Il suffit de s'équiper d'une petite antenne radio grand public (chip RTL2832U fréquence 1090 Mhz) et de la piloter avec Node.JS.
Si vous êtes intéressé, n'hésitez pas à consulter ses projets récents sur son compte GitHub : [rtl-sdr](https://github.com/watson/rtl-sdr){:rel="nofollow"}, [mode-s-decoder](https://github.com/watson/mode-s-decoder){:rel="nofollow"}.

_[Voir ses slides](https://speakerdeck.com/wa7son/dotjs-2017-getting-data-from-the-sky){:rel="nofollow"}_

### Sean Larkin

![Sean Larkin]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/seanlarkin.jpg){:class="center-image"}

[Sean Larkin](https://www.twitter.com/thelarkinn){:rel="nofollow"} est, entre autres, un des _lead maintainer_ sur [Webpack](https://webpack.js.org/){:rel="nofollow"}. Et ça tombe bien, car il a décidé de nous expliquer comment que tout ça marche dedans.
Il nous introduit la bibliothèque [Tapable](https://github.com/webpack/tapable){:rel="nofollow"} qui constitue l'épine dorsale de Webpack.
Elle permet d'étendre les classes de base, d'attraper les événements de compilation et donc de personnaliser le fonctionnement global et l'architecture du compilateur de WebPack...
Il nous présente enfin le futur de Webpack avec sa version 4 : amélioration des performance, réduction de la taille des fichiers générés, gestion intelligente du chargement asynchrone des fichiers JavaScript.

### Marcy Sutton

![Marcy Sutton]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/marcysutton.jpg){:class="center-image"}

[Marcy](https://www.twitter.com/marcysutton){:rel="nofollow"} mets particulièrement l'accent dans son travail sur l'accessibilité. Elle souhaite prendre en compte toutes les spécificités : handicap, situation géographique, capacités de lecture, âge, matériel, moyens, vitesse d'accès au réseau. Elle démontre ainsi l'importance de JavaScript sur ce domaine et comment il est possible d'apporter des améliorations en suivant quelques critères :

- Respecter la structuration du document, les niveaux de titre
- Faire attention au contraste et aux couleurs
- Mieux gérer le focus (ne jamais utiliser `* { outline: none;` } en CSS) et permettre la navigation clavier par tabulation (en ajustant avec l'attribut tabindex s'il le faut)
- Utilisation d'ARIA avec par exemple aria-label sur les icônes
- Si des éléments de la page sont cachés (par exemple un menu en `display: none` affiché lors du clic sur un "hamburger"), il convient d'appliquer l'attribut `inert` sur le conteneur HTML. Malheureusement il faudra souvent utiliser des polyfills (WCIG inert).

Enfin la meilleur façon de se rendre compte si notre site est bien accessible et d'utiliser les même outils ceux qui en nécessite. C'est ce que font [axe-coconut](https://axe-core.org/coconut/){:rel="nofollow"} ou Chrome Accessibility Debugger qui permettent d'effectuer des audits.

_[Voir ses slides](https://marcysutton.github.io/enabling-users/){:rel="nofollow"}_

### Tom Dale

![Tom Dale]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/tomdale.jpg){:class="center-image"}

En tant que _Software Engineer_ chez LinkedIn et co-créateur de Ember.js, [Tom Dale](https://twitter.com/tomdale){:rel="nofollow"} travaille principalement sur les performances d'affichage et notamment les marchés émergents.

On peut distinguer 3 grand axes pour agir sur la vitesse de chargement d'une page :
- le téléchargement
- le parsing
- le rendu

Le téléchargement est solutionné par l'introduction des bundlers (Webpack, Rollup...), de la minification, compression et de la réduction générale de la taille des fichiers.
On peut aussi économiser du temps sur le parsing et le rendu en utilisant le SSR (Serveur Side Rendering).

Mais la réactivité de l'interface est aussi importante : elle doit se mettre à jour rapidement, comporter des animations fluides et supporter une fréquence de 60 images par seconde.
Une solution récente à ce dernier problème a été l'introduction d'un DOM Virtuel (Shadow DOM) notamment utilisé par React. Cela permet de résoudre les souci de réactivité et de rendering des navigateurs.

Mais comme l'explique Tom, le mobile exacerbe tous ces problèmes. Si votre terminal possède un processeur lent, le parsing peut parfois prendre deux fois plus temps que le téléchargement !
La solution à ce souci serait [Glimmer](https://glimmerjs.com/){:rel="nofollow"} qui permet de transformer JavaScript en langage compilé (!). En gros, le but sera de pré-compiler tout votre code en bytecode qui sera directement interprété par une petite machine virtuelle sur le navigateur.
Résultat : le téléchargement est plus rapide, le compilé étant plus léger, le parsing est quasi inexistant.

Mais ce n'est pas tout, car la machine virtuelle est en fait deux petites machines virtuelles qui ont chacun une tâche spécifique : l'une à la création, l'autre à l'update. Ainsi que les performances sont réelle et permettent de dépasser aisément ce que fait React sans les nombreuses techniques d'optimisation manuelle de ce dernier (`shouldComponentUpdate`, `PureComponent`, etc).

Vous pouvez tester cette nouvelle technique sur [Glimmer Playground](https://glimmer-playground.netlify.com/){:rel="nofollow"}. Cela se destine aux sites les plus gourmand pour l'instant, mais cela pourrait se démocratiser dans quelques années !

### Brendan Eich

![Brendan Eich]({{site.baseurl}}/assets/2017-12-08-dotjs-2017/brendaneich.jpg){:class="center-image"}

[Brendan Eich](https://twitter.com/brendaneich){:rel="nofollow"} n'est autre que le créateur de JavaScript lui-même. Comme il lui est souvent demandé, il nous présente la genèse et l'évolution du JS au fur et à mesure des années avec évidemment son lot de difficultés et d'espoir.

Il nous présente ensuite ce que nous réserve le comité ECMA pour les années à venir avec notamment les gestions des BigInt, de nouvelles syntaxes pour la gestion de l'asynchrone (`for await of`), etc.

Il finit sur un ton plus philosophique que pendant des années, énormément de personnes n'ont pas cru en JavaScript et lui disait "Non, on ne pourra jamais faire ça avec du JS". Il l'a à chaque fois démenti en introduisant des notions avancés comme WebGL.

Comme disait Ian Ickson, un des rédacteurs de la spec HTML5 :
> Things that are impossible just take longer

_[Voir ses slides](https://brendaneich.com/wp-content/uploads/2017/12/dotJS-2017.pdf){:rel="nofollow"}_

## En bref

Cette année, dotJS est clairement une réussite. Avec des talks extrêmement intéressant, trouvant le juste ton entre complexité, amusement et vulgarisation.
Vivement les dotJS 2018 !
