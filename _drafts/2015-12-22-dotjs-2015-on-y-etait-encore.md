---
layout: post
title: 'dotJS 2015 : compte-rendu d''un astronaute'
author: trughooputh
date: '2015-12-22 16:44:57 +0100'
date_gmt: '2015-12-22 15:44:57 +0100'
categories:
- Javascript
tags:
- dotJS
- conférence
- http
- async
- hyperdrive
- lightning
- talk
- reaction
- angular
- node
---
{% raw %}
&nbsp;

<span style="font-weight: 400;">Cette année encore, Eleven Labs et sa bande d'astronautes étaient partenaires de la </span><a href="http://www.dotjs.io/"><span style="font-weight: 400;">dotJS</span></a><span style="font-weight: 400;"> version 2015.</span>

<img class="alignleft" src="https://c1.staticflickr.com/1/593/23547337312_1589d2613a_h.jpg" alt="" width="565" height="339" />

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

<img class="alignleft" src="https://c1.staticflickr.com/1/759/23027109824_359b4a1a60_h.jpg" alt="" width="283" height="222" /><img class="alignleft" src="https://c1.staticflickr.com/1/626/23653922455_ecf5d0c6b0_k.jpg" alt="" width="266" height="221" />

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

<span style="font-weight: 400;">Alors oui, mais la dotJS c’est quoi déjà ?</span>

<span style="font-weight: 400;">Il s’agit ni plus ni moins de la plus grande conférence Javascript d’Europe. Le but étant de se rassembler afin de présenter l’avenir du Javascript, de voir l’avancement de certaines technologies ou fonctionnalités, et de troller tous ensemble.</span>

<span style="font-weight: 400;">dotJS fait partie des dotConferences, dont mon collègue astronaute Martin Cadoux nous explique très clairement le concept dans </span><a href="http://blog.eleven-labs.com/les-dotcss-2015-cetait-bien/"><span style="font-weight: 400;">son article sur dotCSS</span></a><span style="font-weight: 400;"> : </span>

<blockquote>"dotConference une série de conférences qui vise à proposer des présentations de haute volée en lien avec des technologies ou des sujets particuliers. On en recense six aujourd’hui, dont les dotJS qui se sont déroulés lundi dernier, mais aussi les dotGo, et bientôt les dotScale. Ces rassemblements ont lieu exclusivement à Paris, mais attirent néanmoins une audience venue en large partie de l’étranger."
</blockquote>
<span style="font-weight: 400;">C’était pour ma part ma première participation à la dotJS. Ayant eu des retours assez mitigés des dernières éditions, malgré de nombreuses personnalités connues du monde JS (Addy Osmani, Jeremy Ashkenas...), j'étais impatient de voir par moi-même cette édition 2015.</span>

<span style="font-weight: 400;">Une grande partie des participants venant de toute l’Europe, voir du Monde (et même d’autre galaxie comme notre Wilson !), l’intégralité des conférences se sont déroulées en anglais.</span><br />
<span style="font-weight: 400;">Le programme est assez alléchant: ES6, Node, WebRTC... On retrouve du beau monde, comme Brendan Eich (Inventeur de JavaScript) ou encore Eric Schoffstall (Créateur de Gulp). Mais c’est également l’occasion de découvrir des contributeurs de la communauté moins connus. </span><span style="font-weight: 400;">C’est donc le moment idéal pour rentabiliser votre abonnement WallStreet English !</span>

<blockquote class="twitter-tweet" lang="fr">
Javascripters at <a href="https://twitter.com/hashtag/dotjs?src=hash">#dotjs</a> coffee break! Tabs vs spaces indentation discussion was not going to end well ⊙_☉<a href="https://twitter.com/dotJS">@dotjs</a> <a href="https://t.co/ivkvFMQjtM">pic.twitter.com/ivkvFMQjtM</a>

— gerardsans (@gerardsans) <a href="https://twitter.com/gerardsans/status/673809192642220033">7 Décembre 2015</a>
</blockquote>
<span style="font-weight: 400;">Pour cette 4ème édition, la communauté JS et plus de 1000 développeurs se sont donc retrouvés le 7 décembre à partir de 9h au coeur du 9eme arrondissement de Paris, plus exactement au “Théatre de Paris”, l’un des plus beaux théâtre de capitale.</span>

<img class="alignnone" src="https://c2.staticflickr.com/6/5667/23025882214_242cee679a_k.jpg" alt="" width="2048" height="1190" />

<hr />
<span style="font-weight: 400;">L’événement s’étalant sur toute la journée, voici donc un tour d’horizon rapide des différents talks.</span>

<img class="alignnone" src="https://c1.staticflickr.com/1/738/23656479935_b63777fc06_k.jpg" alt="" width="2048" height="919" />

## **Modern Async JS** par <a href="https://twitter.com/porteneuve"><i>Christophe Porteneuve</i></a>
<span style="font-weight: 400;">Christophe Porteneuve nous présente ici plusieurs problématiques liées à l’utilisation de callback et du code asynchrone. Le fameux “Callbackhell”, qui comme son nom l’indique, peut vite devenir infernal, autant sur la compréhension que sur la maintenabilité du code.</span> <span style="font-weight: 400;">Celui-ci étant parfois difficile à prendre en main, les générateurs et les promises peuvent déjà nous y aider, en attendant les </span><a href="https://jakearchibald.com/2014/es7-async-functions/"><span style="font-weight: 400;">fonctionnalités await/async d’ES7</span></a>.

<a href="http://tdd.github.io/dotjs-async/">Slides</a>

## **Hyperdrive: p2p hash sharing tool** par <a href="https://twitter.com/mafintosh"><i>Mathias Buus</i></a>
<span style="font-weight: 400;">Mathias Buus, gros contributeur sur npm (Pas loin de 400 modules !), nous présente son dernier module: Hyperdrive. Un module de partage de données via navigateur avec un système de hashage comme l’utilise git.</span>

<span style="font-weight: 400;">Dépôt Github du projet : </span><a href="https://github.com/mafintosh/hyperdrive"><span style="font-weight: 400;">https://github.com/mafintosh/hyperdrive</span></a>

<a href="https://github.com/mafintosh/slides/blob/gh-pages/dotjs-2015/README.md">Slides</a>

## **Dealing with garbage** par <a href="https://twitter.com/samccone"><i>Samuel Saccone</i></a>
<span style="font-weight: 400;">Samuel Saccone, développeur chez Google, aborde ensuite le sujet épineux des fuites mémoire et des performances (Illustré par quelques screenshots assez sympathiques).</span> <span style="font-weight: 400;">S’en suit une démonstration de l’utilisation de la console Chrome poussée, afin de détecter/fixer ces problèmes.</span> <span style="font-weight: 400;">Puis de la présentation de son outil de détection de fuite mémoire: </span><span style="font-weight: 400;"><a href="https://github.com/samccone/drool">Drool</a>.</span>

<span style="font-weight: 400;">Présentation drôle et très bien animée pour un sujet pas super passionnant de premier abord.</span>

<a href="https://docs.google.com/presentation/d/1uom69F6NGURHhrox1Ma50NW1nOKqdxRr0dKDNENwi6Y/edit#slide=id.gd530a4dd9_0_54">Slides</a>

<span style="font-weight: 400;">À lire également, une présentation très intéressante d’Addy Osmani sur l’utilisation de la console Chrome </span><span style="font-weight: 400;"><a href="http://addyosmani.com/blog/chrome-devtools-deepdive/">ici</a>.</span>

## **HTTP/2 is here, now let's make it easy** par <a href="https://twitter.com/rmurphey"><i>Rebecca Murphy</i></a>
<span style="font-weight: 400;">Constat sur HTTP/2 aujourd’hui: Ça à l’air cool, mais on ne s’en sert pas.</span> <span style="font-weight: 400;">Le principal problème étant la compatibilité des serveurs/hébergeurs/navigateurs, qui ne facilitent pas son utilisation pour le moment.</span>   <span style="font-weight: 400;">J’avoue ne pas avoir compris la totalité de la présentation. Si vous en savez plus, je suis preneur ;)</span>

<a href="https://speakerdeck.com/rmurphey/2-is-here-now-lets-make-it-easy">Slides</a>

**LUNCH BREAK !**

<img class="alignnone" src="https://c2.staticflickr.com/6/5725/23359640130_8bff265e02_h.jpg" alt="" width="1600" height="1066" /> <img class="aligncenter" src="http://i.giphy.com/3GCLlNvCg61ji.gif" alt="" width="383" height="221" />

## Lightning talks
<span style="font-weight: 400;">Après la pause déjeuner, on reprend en douceur avec une série de “Lightining talks” au format court de 5-10 minutes, dont 2 qui ont particulièrement retenus mon attention :</span>

##### **Publishing ES6 modules today** par <a href="https://twitter.com/rmurphey"><i>Laurent Voyer</i></a>
<span style="font-weight: 400;">Laurent Voyer partage avec nous les meilleurs moyens de publier des modules ES6.</span> <span style="font-weight: 400;">La meilleure solution étant de pusher nos modules sur npm ou sur un CDN (avec une retro-compatibilité ES5). Un peu court de résumer tout cela en 10min, mais le principe mérite cependant qu’on s’y intéresse plus longuement. </span>

<a href="http://slides.com/vvo/authoring-and-publishing-es6-modules-today-dotjs-2015">Slides</a>

##### **Mobile debugging with VorlonJS** par <a href="https://twitter.com/@meulta"><i>Etienne Margraff</i></a>
<span style="font-weight: 400;">Etienne Margraff nous présente son outil de debug cross browser: VorlonJS</span><br />
<span style="font-weight: 400;">Après avoir préalablement ajouté un script à notre application, il est possible de debugger depuis une interface VorlonJS à distance. Prometteur.</span> <span style="font-weight: 400;">Prochaine étape, le debug d’application NodeJS.</span>

<a href="http://fr.slideshare.net/emargraff/dotjs-lightning-talk-vorlonjs">Slides</a>

## **Practical ES6** par <a href="https://twitter.com/nzgb"><i>Nicolas Bevacqua</i></a>
<span style="font-weight: 400;">Tour d’horizon sur les fondamentaux de ES6, avec une liste d’exemples expliqués de la nouvelle mouture d’EcmaScript.</span> <span style="font-weight: 400;">Rien de vraiment nouveau mais une piqûre de rappel nécessaire, détaillée dans </span><a href="https://ponyfoo.com/articles/es6"><span style="font-weight: 400;">son article</span></a><span style="font-weight: 400;">.</span><br />
<span style="font-weight: 400;">Si vous souhaitez d’ores et déjà utilisez ES6 dans vos projets, des outils comme Babel vous aideront à prendre en main la nouvelle syntaxe le temps de sa mise en place progressive.</span>

<a href="https://speakerdeck.com/bevacqua/practical-es6-for-the-modern-javascript-tinkerer">Slides</a>

## **Reactive Javascript** par <a href="https://twitter.com/andrestaltz"><i>André Staltz</i></a>
<span style="font-weight: 400;">Sans doute l’une des présentations les plus intéressantes de la journée.<br />
André Staltz y présente de manière très simple et précise la programmation reactive au travers de </span><a href="https://github.com/Reactive-Extensions/RxJS"><span style="font-weight: 400;">RxJS</span></a><span style="font-weight: 400;">. Ne connaissant pas le sujet, j’ai trouvé l’approche claire et les exemples particulièrement parlants, notamment le cycle de vie de deux variables liées et comment l’une affecterait l’autre, via la fonctionnalité “Observable”, sorte de promise améliorée.</span><br />
<span style="font-weight: 400;">Je vous incite vivement à regarder tout cela de plus près.</span><br />
<span style="font-weight: 400;">Une introduction est disponible </span><a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754"><span style="font-weight: 400;">ici</span></a><span style="font-weight: 400;"> et quelques vidéos </span><a href="https://egghead.io/series/introduction-to-reactive-programming"><span style="font-weight: 400;">ici</span></a><span style="font-weight: 400;">, afin d’approfondir le sujet.</span>

<span style="font-weight: 400;">Pendant ce temps-là, Wilson se promène un peu.</span>

<blockquote class="twitter-tweet" lang="fr">Just made a new friend from <a href="https://twitter.com/Eleven_Labs">@Eleven_Labs</a> <a href="https://twitter.com/hashtag/dotJS?src=hash">#dotJS</a> <a href="https://t.co/dV5PjBm0qA">pic.twitter.com/dV5PjBm0qA</a> — Adrien Trauth (@Nioufe) <a href="https://twitter.com/Nioufe/status/673788757640921088">7 Décembre 2015</a>
</blockquote>
## **WebRTC** par <a href="https://twitter.com/contrahacks"><i>Eric Schoffstall</i></a>
<span style="font-weight: 400;">WebRTC est en passe de devenir un nouveau standard pour tout ce qui est connexion peer-to-peer entre navigateurs sans passer par un serveur, celui-ci étant assez attendu par la communauté vu les possibilités qu’il propose (Communication par voix ou vidéo par exemple). Cependant, seuls Chrome, Firefox et Opera proposent cette implémentation (</span><a href="http://caniuse.com/#search=webrtc"><span style="font-weight: 400;">Voir en détails</span></a><span style="font-weight: 400;">).</span><br />
<span style="font-weight: 400;">Après avoir travaillé sur la compatibilité sur chaque navigateur (y compris IE9 et mobile) et en regroupant les différentes solutions apportées sur chacune des plateformes, Eric annonce la création de sa nouvelle librairie </span><a href="https://github.com/contra/rtc-everywhere"><span style="font-weight: 400;">rtc-everywhere</span></a><span style="font-weight: 400;">. Magique !</span>

<blockquote class="twitter-tweet" lang="fr">
"If you decided your stuff only works on Chrome Desktop, you're not making a product you're building a demo" - <a href="https://twitter.com/contrahacks">@contrahacks</a> at <a href="https://twitter.com/hashtag/dotJS?src=hash">#dotJS</a>

— ChristophePorteneuve (@porteneuve) <a href="https://twitter.com/porteneuve/status/673876828663230465">7 Décembre 2015</a>
</blockquote>
<span style="font-weight: 400;">En bonus: Eric postule également au poste de maire de San Francisco...</span>

<img class="aligncenter" src="http://i.giphy.com/KTHFxuEtrVoGI.gif" alt="" width="453" height="243" />

## **Jade &gt; Pug** par <a href="https://twitter.com/forbeslindesay"><i>Forbes Lindesay</i></a>
<span style="font-weight: 400;">Forbes Lindesay, développeur chez Facebook, nous présente le fonctionnement de son moteur de template HTML “Jade” (Renommé “Pug” pour des questions légales, il me semble). Nous utilisons aujourd’hui de plus en plus ce genre d’outils appelé “transpiler”, notamment Babel ou CoffeeScript, et il est toujours intéressant de comprendre comment ce genre de parser fonctionne. </span> <span style="font-weight: 400;">Il est également possible de créer ses propres plugins avec un système de pipe, une bonne nouvelle pour ceux qui l’utilisent.</span>

## **Teaching Kids to Code** par <a href="https://twitter.com/creationix"><i>Tim Caswell et son fils de 9 ans</i></a>
<span style="font-weight: 400;">Présentation amusante du développement pour plus jeunes, et sur ce qui est possible en dehors d’un navigateur web.</span>

<a href="https://gist.github.com/creationix/507719a418be365c7631">Slides</a>

## **Pocked sized JS** par <a href="https://twitter.com/HenrikJoreteg"><i>Henrik Joreteg</i></a>
<span style="font-weight: 400;">Dans un contexte de plus en plus “Mobile-first”, Henrik Joreteg nous incite ici vivement à penser “Mobile everywhere”. Les performances de nos devices et la qualité de notre connexion lorsque nous développons nos applications n’étant pas forcement identiques à celles de l’utilisateur final.</span>

<blockquote class="twitter-tweet" lang="fr">if you want to write fast software, use a slow computer

— Dominic Tarr (@dominictarr) <a href="https://twitter.com/dominictarr/status/629992939738005504">8 Août 2015</a>
</blockquote>
<span style="font-weight: 400;">Une présentation plus théorique que technique mais certainement pas moins intéressante, qui remet en question notre façon de concevoir nos applications afin de rendre l’expérience utilisateur la plus agréable possible. </span><br />
<span style="font-weight: 400;">Je vous incite vivement à voir sa présentation, une très bonne surprise !</span>

<a href="https://slides.joreteg.com/dotjs/">Slides</a>

## **No title** par <a href="https://twitter.com/brendaneich"><i>Brendan Eich</i></a>
<span style="font-weight: 400;">Enfin pour terminer la journée en beauté, Brendan Eich, le créateur de Javascript. A vrai dire, il était assez compliqué de suivre, tellement les sujets étaient nombreux: FirefoxOS, Tizen, asm.js... </span><br />
<span style="font-weight: 400;">S’en suivit une petite démonstration de jeux Facebook développés en Javascript (Notamment un avec des poulets tueurs de zombies…), le résultat est assez impressionnant par sa fluidité.<br />
J’attendais un peu plus de cette présentation cependant.</span>

&nbsp;

<blockquote class="twitter-tweet" lang="fr">So impressed when <a href="https://twitter.com/BrendanEich">@BrendanEich</a> demo'ed what web assembly is capable of in <a href="https://twitter.com/hashtag/firefox?src=hash">#firefox</a> <a href="https://twitter.com/hashtag/wasm?src=hash">#wasm</a> <a href="https://twitter.com/hashtag/dotjs?src=hash">#dotjs</a> <a href="https://t.co/sTGDdkHKMr">pic.twitter.com/sTGDdkHKMr</a> — Perry Mitchell (@perry_mitchell) <a href="https://twitter.com/perry_mitchell/status/674242616096104448">8 Décembre 2015</a>
</blockquote>
&nbsp;

## Conclusion
<span style="font-weight: 400;">Ce fut pour ma part une très bonne expérience. L’événement fut très bien organisé, les conférences étaient de qualité, les sujets variés et l’ambiance y était très bonne.</span><br />
<span style="font-weight: 400;">C’est avec plaisir qu’on y retrouve également certaines têtes.</span><br />
<span style="font-weight: 400;">Pas de réelle révolution cependant, le but de ce rassemblement semblait plus d’obtenir une orientation de la communauté.</span><br />
<span style="font-weight: 400;">Petite frustration tout de même sur le fait de ne pas pouvoir poser de questions directement en fin de présentation, mais cela est sûrement dû à un souci de logistique.</span><br />
<span style="font-weight: 400;">L’objectif de ce post étant de survoler le large panel de sujets abordés, je vous laisse approfondir les plus intéressants.</span>

<img class="aligncenter" src="http://i.giphy.com/kRWFIgO75okHm.gif" alt="" width="408" height="242" />

<span style="font-weight: 400;">Les photos de l’événement sont disponibles sur le </span><a href="https://www.flickr.com/photos/97226415@N08/sets/72157661549425069/"><span style="font-weight: 400;">compte Flickr</span></a>

<span style="font-weight: 400;">Compte Twitter : https://twitter.com/dotJS</span>

{% endraw %}
