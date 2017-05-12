---
layout: post
title: 'Se lancer dans le dév mobile : Partie I'
author: ibenichou
date: '2016-11-10 15:44:34 +0100'
date_gmt: '2016-11-10 14:44:34 +0100'
categories:
- Non classé
- Mobile
tags:
- AngularJS
- Ionic
- Cordova
- mobile
- ios
- swift
- objective-c
- react
- react-native
- application
---

#### **Faire du mobile oui, mais par où commencer ?**
Aujourd’hui plus qu’hier les applications mobiles deviennent indispensables dans la vie de plusieurs millions de personnes. Si vous lisez cet article, c’est que le sujet vous intéresse ou que vous souhaitez vous y mettre vous aussi. Je vais essayer de faire une série d’articles afin de partager avec vous le plus possible sur ce sujet.

**Quelles technos ?**

Les bonnes questions avant de prendre parti pour une solution sont : “Quels sont les outils, plugins, fonctionnalités dont mon application a besoin ? Quel public viser ? Quel volume de personne est visé par cette appli ? ”. Une fois ces questions résolues, vous allez automatiquement répondre à la question de l’orientation de la techno.

Je vais parler aujourd’hui de 3 technos que j’ai choisies pour plusieurs raisons :

<ul>
<li>Car ce sont les plus répandues sur le marché afin de produire des applis mobile et leurs communautés sont les plus actives ;</li>
</ul>
<ul>
<li>J’ai déjà utilisé ces technos et donc je peux vous faire un vrai retour d’expérience dessus. Concernant la partie natif, je suis parti sur de l’IOS et non sur de l’Android (j’explique plus bas pourquoi, non *spoil*)</li>
</ul>
### **Ionic :**
Ionic est un framework Javascript basé sur AngularJS pour la partie application web du framework et sur Cordova pour la partie construction des applications natives.

**Comment ça marche ?**

Ionic permet en fait de créer une application qui ouvre une « WebView » disponible nativement sur les appareils mobiles. Pour simplifier, il s’agit d’une fenêtre de  navigateur Web, exécutée dans notre application, qui va se charger d’interpréter et d’afficher le contenu de nos scripts. Cette WebView, dont les possibilités sont étendues par Cordova, permet d’accéder à un certain nombre de fonctionnalités natives à l’appareil mobile (voir schéma plus bas)

La WebView d’Android est basée sur Chromium. Il s’agit de Safari pour iOS, et d’Internet Explorer Mobile pour Windows Phone.

Ainsi, Ionic ne permet pas de créer à proprement parler d’applications natives. On parlera plutôt d’applications hybrides.

<em>Schéma représentation Ionic</em> :<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Schéma1.png"><img class=" wp-image-2476 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Schéma1-300x132.png" alt="schema1" width="520" height="229" /></a>

&nbsp;

<span style="font-weight: 400;">Je vous vois venir :  </span><span style="font-weight: 400;">“AngularJs, super je maîtrise le truc, aller hop on y go”.<br />
</span><span style="font-weight: 400;">Hop hop hop !!!!. Jeune padawan, lire l’article en entier tu dois !<br />
</span><span style="font-weight: 400;">Effectivement, si vous connaissez bien AngularJS, c’est un gros plus.</span>

<span style="font-weight: 400;">L’installation de Ionic est d’une simplicité extraordinaire !</span>

<pre class="lang:sh decode:true ">
{% raw %}
npm install -g cordova ionic
ionic platform add ios
ionic build ios
ionic emulate ios{% endraw %}
</pre>

<span style="font-weight: 400;">En 4 lignes de commandes, vous venez de builder votre application sous iOS.</span>

<span style="font-weight: 400;">L’un des gros avantages de Ionic est qu’il fournit des composants tout prêts, ce qui permet encore une fois de faire des applications de manière rapide.</span>

**Exemple de spinner :**

<pre class="lang:default decode:true">
{% raw %}
&lt;ion-spinner&gt;&lt;/ion-spinner&gt;{% endraw %}
</pre>

<span style="font-weight: 400;">J’ai eu l’occasion de développer quelques applications sous Ionic et je dois dire que cet aspect composant m’a énormément servi. <a href="http://ionicframework.com/docs/">La </a></span><span style="font-weight: 400;">documentation</span><span style="font-weight: 400;"> expose tous les composants mis à disposition par Ionic.</span>

<span style="font-weight: 400;">Comme mentionné plus haut, Ionic se base aussi sur Cordova pour interagir sur les composants natifs de l’appareil. Il vous permet, via des plugins, d’utiliser la géolocalisation, l’appareil photo, etc…</span>

**E****xemple de commande afin d’ajouter le plugin caméra :**

<pre class="lang:sh decode:true">
{% raw %}
ionic plugin add cordova-plugin-camera{% endraw %}
</pre>

<span style="font-weight: 400;">Mais Ionic dispose de points faibles :</span>

<ul>
<li><span style="font-weight: 400;">Problème lors </span> <span style="font-weight: 400;">de sortie de nouvelle version OS.<br />
<i>Exemple</i> : le passage à iOS 9 a introduit une régression sur la manière dont window.location fonctionne au cœur de la WebView iOS.</span></li>
<li><span style="font-weight: 400;">Les performances sont vraiment trop éloignées par rapport à du natif.<br />
<i>Exemple </i>: lorsque vous implémentez Google Map via Ionic, le temps de chargement dépend de votre connexion internet (3G/4G) puisque vous téléchargez toutes les données. Alors que sur IOS par exemple, celle-ci est directement intégrée à l’OS. J’ai pu constater personnellement cette différence et on passe d’un chargement qui dure entre 2 à 3 secondes en moyenne (tout dépend encore une fois de votre connexion) à un chargement quasi instantané en native.</span></li>
<li><span style="font-weight: 400;">Cordova ne permet pas d’utiliser tous les composants natifs de l’OS et nous sommes donc limités dans les fonctionnalités.<br />
<i>Exemple </i>: IOS a mis au point une nouvelle fonctionnalité de reconnaissance faciale, permettant de détecter sur l’image si la personne sourit, a les yeux ouverts ou fermés… .Cette fonctionnalité n’est pas disponible sur Cordova.</span></li>
</ul>
<em><span style="font-weight: 400;">Tableau compatibilité sous Cordova :</span></em>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/platform-support.png"><img class="alignnone size-medium wp-image-2490" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/platform-support-300x232.png" alt="platform-support" width="300" height="232" /></a>

<span style="text-decoration: underline;">**Conclusion :**</span>

**Ionic est un super moyen de faire des applications rapides et petites. Mais dès lors que vous voulez agrandir vos fonctionnalités ou avoir des performances correctes, il montre les dents. Je n’ai pas testé la version 2 mais je sais qu’ils ont améliorés quelques points.**

&nbsp;

<h3 style="text-align: left;"> **React Native :**
<span style="font-weight: 400;">Comme son nom l’indique, React Native est une déclinaison de React (propulsée par Facebook en 2015). Le but de React Native est de pouvoir réutiliser le maximum de code entre les différentes plateformes.</span>

<span style="font-weight: 400;">L'écriture en Javascript permet aux développeurs web de construire une application mobile native, contrairement à Cordova qui encapsule l'application dans une WebView.</span>

**Comment ça marche ?**

<span style="font-weight: 400;">Grâce à un moteur Javascript exécuté en asynchrone sur un thread séparé, le développeur pilote une UI native avec un code Javascript. La techno évite ainsi les compromis habituels des applications natives, tout en produisant une expérience utilisateur optimale, puisque native.</span>

<i><span style="font-weight: 400;">Conseil </span></i><span style="font-weight: 400;">:</span>

<span style="font-weight: 400;">Avant de vous lancer sur React Native, je vous conseille de commencer par un peu de React. Vous pouvez consulter <a href="https://www.youtube.com/watch?v=WbUO00hrjiE">la vidéo</a> d’une conférence que j’ai faite qui vous explique les bases de React avec un exemple plutôt intéressant et complet. </span>

<span style="font-weight: 400;">Je ne vous cache pas que j’ai pas mal ramé au début avec React Native lorsque j’ai commencé à vouloir développer ma première application.</span>

<span style="font-weight: 400;">Pourquoi ?</span>

<ul>
<li><span style="font-weight: 400;">Car React Native est un jeunot qui n’est pas encore stable. Les versions de celui-ci changent très, très vite, ce qui implique que le code que vous avez produit hier ne sera peut-être plus d’actualité aujourd’hui (c’est le gros problème du Javascript vous allez me dire *troll*) ;</span></li>
<li><span style="font-weight: 400;">L’installation d’un émulateur pour faire tourner Android ne fut pas simple et le lancement de l’appli sur mon device (Android) non plus ;</span></li>
<li><span style="font-weight: 400;">Sur chaque problème rencontré, j’ai eu du mal à trouver des réponses via la communauté puisque celle-ci commençait à peine à grandir.</span></li>
</ul>
<span style="font-weight: 400;">Vous allez me dire, mais avec tous ces points pourquoi en parle-t-on autant ?</span>

<span style="font-weight: 400;">Si vous avez bien suivi l’article, l’un des plus gros avantages de React Native, est qu’on utilise l’UI native des OS avec notre JS. Chaque composant proposé dans la documentation de Facebook est un composant natif de l’OS. Mais ce n’est pas tout.</span>

<span style="font-weight: 400;">En effet, vous pouvez coder en Java ou Objective-C / Swift une fonctionnalité qui permet d’interagir avec l’API native de l’OS et exposer celle-ci afin de l’utiliser en JS. </span>

<span style="font-weight: 400;">Magique non ? De ce fait, il existe de plus en plus de plugins et dépôts sur npm concernant React Native. Une communauté qui s'accroît et qui souhaite que celui-ci devienne une référence dans le développement mobile.</span>

<span style="font-weight: 400;">De mon point de vue et de mon retour d’expérience, voici les points faibles que je relève sur React Native : </span>

<ul>
<li><span style="font-weight: 400;">Il n’est pas encore stable (version 0.35 au moment de l’article) et donc pas mal de choses changent à chaque release, ce qui implique de suivre de très près chaque changement ;</span></li>
<li><span style="font-weight: 400;">Il propose pas mal de composants mais si vous désirez avoir un comportement / une fonctionnalité qui demande de toucher à l’API native (tel que le Speech Recognition, dernière nouveauté d’IOS 10) et qui n’est pas encore développé par quelqu’un, il va falloir le développer en natif, ce qui implique d’avoir des connaissances dans les langages appropriés ;</span></li>
<li><span style="font-weight: 400;">L’installation de l'émulateur pour Android sur Mac qui demande plus de temps et de patience.</span></li>
</ul>
**Conclusion :**

**React Native semble l’approche idéale pour faire des applications de tous types. Cependant, il faudra noter que son jeune âge lui fait défaut car il ne dispose pas encore de la maturité nécessaire afin de développer de grosses applications qui nécessitent des traitements particuliers. Mais je vous conseille de suivre de près son évolution.**

### 
### **Natif :**
<span style="font-weight: 400;">Bien évidement pour faire une application il n’y a rien de mieux que le natif. </span>

<span style="font-weight: 400;">Pourquoi ? Car il n’y a pas de contraintes dues à la technologie. Il n’y a pas de problèmes lors des mises à jour de l’OS. L’expérience utilisateur est forcément meilleure et les perfs sont au rendez-vous (si l’app est bien codée *troll*), bref c’est le top !</span>

<span style="font-weight: 400;">Du coup, depuis peu je me suis dit : “Astronaute, c’est une mission pour toi !”</span>

<span style="font-weight: 400;">Alors d’abord la première chose sur laquelle j’ai dû trancher c’est sur le langage.</span>

<span style="font-weight: 400;">Et oui, le natif c’est super mais il faut connaître 2 langages si on souhaite faire une application multiplateformes. Mon choix s’est porté sur iOS pour des raisons pratiques. Je dispose d’un Mac et d’un iPhone (ok je suis un peu Apple boy *troll*).</span>

**Objective-C /  Swift : Que choisir ?**

**Petit point histoire :**

<span style="font-weight: 400;">Il existe 2 langages pour développer sur iOS. Le premier est l’Objective-C.</span>

<span style="font-weight: 400;">C'est une extension du C ANSI, comme le C++, mais qui se distingue de ce dernier par sa distribution dynamique des messages, son typage… .Il est basé sur la bibliothèque de classes Cocoa et </span><span style="font-weight: 400;">utilisé dans les systèmes d'exploitation tels que NeXTSTEP.</span>

<span style="font-weight: 400;">En 2014, lors de la conf WWDC, Apple présente un nouveau langage nommé Swift destiné à la programmation d'applications sur les systèmes d'exploitation iOS, macOS, watchOS et tvOS.</span>

<span style="font-weight: 400;">Il a été conçu pour coexister avec l'Objective-C. Quelques jours après sa présentation, Swift était en passe d'entrer dans la liste des 20 langages de programmation les plus populaires. En juillet 2014, Swift passe à la 16e place de ce classement. </span>

<span style="font-weight: 400;">Apple est passé depuis peu à la version 3 de Swift.</span>

<span style="font-weight: 400;">Bon mais tout ça ne fait pas avancer le micmac. Que choisir ? </span>

<span style="font-weight: 400;">Ne vaut-il pas mieux commencer par de l’Objective-C qui a montré sa stabilité ou alors Swift qui est beaucoup plus puissant et beaucoup plus simple à apprendre ? J’ai cherché un peu partout des réponses sur des articles ou forum. J’ai même été poser cette question à des dev iOS. Voilà ce que j’ai pu en conclure.</span>

<span style="font-weight: 400;">De mon point de vue, Swift dispose d’une syntaxe plus facile pour débuter, donc plus pratique pour vous de commencer par apprendre celui-ci. Si vous codez actuellement sur un autre langage orienté objet alors vous allez avoir une forte progression. Faites-vous la main, comprenez bien les aspects techniques, les contraintes et surtout faites-vous plaisir. </span>

<span style="font-weight: 400;">Mais alors on oublie l’Objective-C ? Oui et non…</span>

<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Si vous souhaitez pousser un peu le swift c’est mieux d’avoir fait un peu d’Objective-c avant ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">La réalité prend le dessus. En effet vous allez être amené peut-être à travailler sur un projet qui dispose déjà d’une ancienne application mobile et par conséquent celle-ci est faite en Objective-C. C’est pourquoi vous pouvez constater que sur certaines offres d’emploi il est souvent mentionné Objective-C. Ne vous affolez pas, généralement, c’est pour comprendre le code existant afin de migrer vers la nouvelle appli qui elle est faite en Swift.</span></li>
</ol>
**Conclusion :**

**Le natif permet d’avoir un meilleur rendu final. ****Cependant, il demande plus d'investissement car il convient d’apprendre un à plusieurs langages afin de publier une app sur plusieurs plateformes.**


