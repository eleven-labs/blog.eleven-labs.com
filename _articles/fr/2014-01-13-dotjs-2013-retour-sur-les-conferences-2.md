---
contentType: article
lang: fr
date: '2014-01-13'
slug: dotjs-2013-retour-sur-les-conferences-2
title: 'DotJs 2013, retour sur les conférences.'
excerpt: DotJs 2013
categories:
  - javascript
authors:
  - mehdy
keywords:
  - dotjs
---

DotJs 2013
==========

[dotJS](http://www.dotjs.eu/) est une journée consacrée au langage JavaScript, créée par [dotConferences](http://www.dotconferences.eu/), dont le but est d'apporter des conférences du niveau de [TED](http://www.ted.com/) au monde de l'informatique.

### Introduction / Historique

JavaScript a été créé en 1995 par Brendan Eich, développeur chez Netscape, comme un langage de script côté serveur. Il portait alors le nom de LiveScript. Netscape travaille ensuite sur une version client du langage qui sera donc déployée sur son navigateur. Quelques jours avant sa sortie, il est renommé en JavaScript en partie à cause de la popularité de la machine virtuelle Java crée par Sun Microsystem et en partie à cause du partenariat entre Netscape et Sun. Oui, "à cause", car ce nom a longtemps desservi ce langage, souvent considéré comme un simple langage de script, un "java simplifié", alors que comme on peut le lire sur les Internets : "Java is to JavaScript as ham is to hamster".

Au fil des années, les navigateurs ont dû optimiser leur interprétation du JavaScript, pour améliorer l'expérience utilisateur, pour indication, le code s'exécute 100 fois plus rapidement que sur les premiers navigateurs, pour des machines de puissance comparable. Avec le moteur V8, Google a fait l'un des plus grands pas en avant dans cette direction. Aujourd'hui Javascript est le langage le plus populaire sur la plate-forme GitHub. V8 a été utilisé comme base pour Node.js, framework JavaScript destiner à créer des serveurs web (tout comme Apache ou IIS) haute performance. De grands noms du web comme Microsoft, Linkedin, Yahoo ou encore eBay revoient leur architecture pour passer à Node.js, afin d'augmenter les performances des parties critiques de leurs sites et de pouvoir partager un même langage côté client et serveur.

Des grandes entreprises françaises comme [LeMonde](http://www.lemonde.fr/)ou [TF1](http://www.tf1.fr/)tentent petit à petit de passer à une architecture dite "full-stack JavaScript" en se reposant également sur Node.js pour la partie serveur.

Le JavaScript est également utilisé pour programmer des moteurs 3D, comme la librairie [three.js](http://threejs.org/) qui permet de créer des scènes en trois dimensions pour le web, ou plus récemment, le portage de l'[Unreal Engine](http://www.unrealengine.com/) 3 dans le navigateur, qui permettra  à de nombreux jeux console et PC de se jouer directement dans le navigateur.

L'alliance des technologies HTML, CSS, Javascript, et maintenant WebGL est extrêmement puissante, à tel point qu'on la retrouve également dans l'univers mobile et dans quelques applications desktop, comme l'excellent éditeur de code [Brackets](http://brackets.io/), ou encore Facebook Messenger.

### Présentation de la journée

La journée commence par la présentation du problème majeur de JavaScript dans le développement : la confiance que le développeur peut avoir dans son code.

En effet, en l'absence d'un compilateur, on ne peut savoir qu'il existe une erreur qu'au moment de l'exécution. Puisqu'il y a un typage explicite des variables (nombres, chaîne de caractères, booléens …) l'éditeur de code que l'on utilise ne pourra pas facilement voir ce genre d'erreurs.

Ce sera d'ailleurs le leitmotiv de cette journée : *Quels sont les outils existants pour développer en JavaScript ?*

Par ailleurs, plutôt que de présenter les différents intervenants et résumer leurs conférences, je me limiterai à la description des outils qui nous ont marqué et à la problématique à laquelle ils répondent.

### [Polymer](http://www.polymer-project.org/) présenté par Addi Osmani

> “Polymer is a new type of library for the web, built on top of Web Components, and designed to leverage the evolving web platform on modern browsers.”

Polymer est une librairie orientée objet et manipulation du DOM en version pre-alpha. Elle utilise Bower pour gérer ses dépendances de paquets.

La librairie se décompose en trois parties :

-   **Foundation** : ce sont les bases qui font de Polymer une librairie pour les navigateurs modernes. On y retrouve plusieurs notions comme “Shadow DOM”, “MutationObserver”, “Web Animations”, etc
-   **Core** : l’identité et la nature de Polymer. Les développeurs ont fait des choix et affirmé des opinions : comment déclarer un élément, étendre un élément à partir d’un autre, capturer le changement d’un élément, lancer un événement, gérer l’asynchrone, ...
-   **Elements** : il y a deux catégories d'éléments prédéfini par Polymer, les éléments d’interfaces et les autres. On est libre de piocher dans une liste qui s’agrandit au fil du temps ou bien de les définir soit même.

[Polymer architecture](http://www.polymer-project.org/images/architecture-diagram.svg)

L’objectif principal de Polymer est de faire gagner du temps de développement en se basant sur les fonctionnalités natives des navigateurs et du HTML. L’association des éléments prédéfinis et des éléments personnalisés permet de construire une application complète. En contre partie, l’utilisation et la compréhension de la librairie peut prendre du temps selon votre habitude à développer avec des frameworks tel que Angular ou Meteor.

Si Polymer aiguise votre curiosité, une [FAQ](http://www.polymer-project.org/faq.html) et une [sandbox](http://www.polymer-project.org/tools/sandbox/) sont à disposition sur leur [site](http://www.polymer-project.org/) qui est lui-même fait avec Polymer.

### [TypeScript](http://www.typescriptlang.org/) présenté par John K. Paul

> “TypeScript is a language for application-scale JavaScript development. TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open Source.”

TypeScript se présente comme une sur-couche de Javascript. Il offre un cadre de développement plus strict que le Javascript natif. Il permet d’utiliser un typage strict et des mots clefs de POO (class, interface, implements, extends, …) A la manière de l’ActionScript, il faut compiler notre fichier hello.ts pour obtenir un fichier en sortie hello.js. Développé en partenariat avec Microsoft, le compilateur écrit en CodePlex est disponible pour Node.js. La forte valeur ajoutée de TypeScripte réside dans l'existance des plugins pour les éditeurs de textes comme VirtualStudio 2012/2013, Sublime Text, Vim et Emacs.

![Type2\_Fig\_06](/_assets/posts/2014-01-13-dotjs-2013-retour-sur-les-conferences-2/Type2_Fig_06.gif)

Note : TypeScript est différent de CoffeeScript qui supprime la syntaxe superflue du Javascript tel que les accolades, les parenthèses, les semi-colons.

### [Epic Citadel](http://www.unrealengine.com/html5/) présenté par Brendan Eich

> “Epic Citadel is a free application that showcases the technical capabilities of the award-winning Unreal Engine 3.”

Brendan Eich, alias PapaJS, nous a offert une présentation des perspectives d’avenir des jeux développés dans les technologies web. Nous avons assisté à une démo en temps réel de la carte [Epic Citadel](http://www.unrealengine.com/html5/) du  jeu Infinity Blade, avec des combats et des bots contrôlés par l’IA. Le réputé et très utilisé moteur physique et graphique “Unreal Engine” a été porté pour les navigateurs modernes en 4 jours avec [Asm.js](http://www.generation-nt.com/go/?url=http%3A%2F%2Fasmjs.org%2F) et [Emscripten](http://www.generation-nt.com/go/?url=https%3A%2F%2Fgithub.com%2Fkripken%2Femscripten%2Fwiki) pour la compilation du code C++ en JavaScript. Les performances sont au rendez-vous et les graphismes impressionnants pour un jeu dans le navigateur. Cette avancée confirme un peu plus la volonté de faire du navigateur l’élément central d’un ordinateur personnel.

![citadel-demo-2-100068222-orig](/_assets/posts/2014-01-13-dotjs-2013-retour-sur-les-conferences-2/citadel-demo-2-100068222-orig.png)

Suite à cette dernière conférence, beaucoup d'interrogations sont nées sur le devenir du gaming :

-   Quel est la position des constructeurs de console de salon tel que Sony, Microsoft ou même Steam qui récemment a lancé la beta des [SteamMachines ](http://store.steampowered.com/livingroom/SteamMachines/)et [SteamOS ](http://store.steampowered.com/livingroom/SteamOS/)?
-   Comment va évoluer les différents frameworks de développement de jeu comme [Unity](http://unity3d.com/), [JMonkey](http://jmonkeyengine.org/), [Three.js](http://threejs.org/) ?
