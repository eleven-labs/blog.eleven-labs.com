---
layout: post
title: Introduction à AngularJS
author: peter
date: '2013-12-11 09:36:42 +0100'
date_gmt: '2013-12-11 08:36:42 +0100'
categories:
- Javascript
tags:
- tutoriel
- Javascript
- AngularJS
---
{% raw %}
<p><em>AngularJS</em> est un <em>framework</em> <em>JavaScript</em> open-source qui a vu le jour en 2009 et dont le père Miško Hevery est un expert Web autour des technologies <em>Java</em> et <em>JavaScript</em>, travaillant chez Google.</p>
<p>Construire une application web avec une interface utilisateur complexe devient très difficile en utilisant uniquement des librairies telles que <em>jQuery</em>. <em>AngularJS</em> facilite la création et la maintenance des applications, et accélère le développement <em>JavaScript/AJAX</em>. Il permet la création d'applications web monopage (<em>single-page application</em>) et apporte aux applications Web côté client les services traditionnellement apportés côté serveur, rendant de ce fait les applications Web beaucoup plus légères.</p>
<p><!--more--></p>
<p><strong>Les concepts d'<em>AngularJS</em> :</strong></p>
<p><strong><em>Template</em> côté client</strong></p>
<p>Les <em>templates</em> et les données sont assemblés côté client. Le rôle du serveur se résume alors seulement à servir les données requises par ces <em>templates</em>.</p>
<p>Voici un exemple minimaliste contenant un <em>template</em> et un <em>controller</em> :</p>
<p>Voici notre <em>template</em> "hello.html" :</p>
<pre class="lang:xhtml decode:true">&lt;html ng-app&gt;
&lt;head&gt;
&lt;title&gt;Hello, World in AngularJS&lt;/title&gt;
  &lt;script src="angular.js"&gt;&lt;/script&gt;
  &lt;script src="controllers.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div ng-controller='HelloController'&gt;
    &lt;input ng-model='hello.text'&gt;
    &lt;p&gt;{{hello.text}}, World&lt;/p&gt;
  &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<p>Voici notre contrôleur "controller.js"</p>
<pre class="lang:js decode:true">function HelloController($scope) {
  $scope.hello = { text: 'Hello' };
}</pre>
<p>Le chargement de "hello.html" dans un navigateur produira l'affichage suivant :</p>
<p style="text-align: center;"><a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello.png"><img class="alignnone size-full wp-image-802" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello.png" alt="hello" width="165" height="74" /></a></p>
<p>Il y a plusieurs choses intéressantes à noter ici en comparaison avec la plupart des méthodes utilisées aujourd'hui :</p>
<ul>
<li>Il n'y a pas de classes ou d'ID dans le code <em>HTML</em> pour identifier où attacher des <em>event listeners</em>.</li>
<li>Lorsque le contrôleur initialise <em>hello.text</em>, nous n'avons pas eu à enregistrer des <em>event listeners</em> ou écrire des <em>callbacks</em>.</li>
<li>Le contrôleur est un bon vieux code <em>JavaScript</em> qui n'a besoin de rien hériter de ce que <em>AngularJS</em> fournit, et qui obtient l'objet <em>$scope</em> sans que l'on n'ait besoin de le créer.</li>
<li>Nous n'avons pas eu à appeler le constructeur du contrôleur.</li>
</ul>
<p>&nbsp;</p>
<p><strong><em>MVC</em> (Modèle-Vue-Contrôleur)</strong></p>
<p>Dans les applications <em>AngularJS</em>, la vue est le <em>DOM</em> (<em>Document Object Model</em>), les contrôleurs sont des classes <em>JavaScript</em>, et le modèle est stocké dans les propriétés des objets.</p>
<p><strong><em>Data Binding</em></strong></p>
<p><em>AngularJS</em> permet de faire du <em>data binding</em> très simplement sans devoir écrire le moindre code <em>AJAX</em>.<br />
Retournons dans l'exemple de code ci-dessus. Si nous remplaçons le texte <em>Hello</em> par le texte <em>Hi</em> dans le champ de saisie, voici l'affichage que nous aurons dans le navigateur :</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/Hi.png"><img class="alignnone size-full wp-image-803 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/Hi.png" alt="Hi" width="168" height="65" /></a></p>
<p>&nbsp;</p>
<p>L'interface utilisateur se met à jour dynamiquement, sans que nous ayons eu besoin d'attacher un <em>change listener</em> sur le champ de saisie.<br />
Il faut également noter que le <em>data binding</em> est bidirectionnel. Dans notre contrôleur, le changement de valeur de notre variable <em>$scope.hello.text</em>, à la suite d'une requête au serveur par exemple, mettrait automatiquement à jour le champ de saisie et le texte dans les doubles accolades.</p>
<p><strong>Injection de dépendances</strong></p>
<p>Si nous reprenons le code de notre contrôleur, on note que l'objet <em>$scope</em> est passé à notre fonction automatiquement. En effet, <em>AngularJS</em> fournit un système d'injection de dépendances qui suit un modèle de conception appelé la "loi de Déméter" (Law of Demeter).</p>
<p><strong>Directives</strong></p>
<p>Une des meilleures parties de <em>AngularJS</em>, c'est que vous pouvez écrire vos propres <em>templates</em> <em>HTML</em>. En effet, le cœur du <em>framework</em> inclut un puissant moteur de manipulation du <em>DOM</em> qui vous permet d'étendre la syntaxe du <em>HTML</em>.<br />
Nous avons déjà vu plusieurs nouveaux attributs dans notre <em>template</em> qui ne font pas partie de la spécification HTML.<br />
Si l'on reprend notre <em>template</em> "hello.html", on remarque la notation de double accolades et <em>ng-model</em> pour le <em>data binding </em>et <em>ng-controller</em> pour spécifier quel contrôleur supervise quelle partie de la vue. On appel ces extensions HTML des directives.<br />
<em>AngularJS</em> est livré avec de nombreuses directives qui vous aideront à définir les vues de votre application. Ces directives peuvent définir ce que nous appelons des <em>templates</em> et peuvent être utilisé pour créer des composants réutilisables.</p>
<p>Comparons notre code écrit avec <em>AngularJS</em>, à ce que l'on écrirait en <em>JavaScript</em> natif :</p>
<pre class="lang:default decode:true">&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Hello, World in JavaScript&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;p id="hello"&gt;&lt;/p&gt;
&lt;script type="text/javascript"&gt;
  var isIE = document.attachEvent;
  var addListener = isIE
      ? function(e, t, fn) {e.attachEvent('on' + t, fn);}
      : function(e, t, fn) {e.addEventListener(t, fn, false);};

  addListener(window, 'load', function() {
    var hello = document.getElementById('hello');
    if (isIE) {
      hello.innerText = 'Hello, World';
    } else {
      hello.textContent = 'Hello, World';
    }
  });
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<p>N'y a-t-il pas une très grande différence entre un code <em>JavaScrit</em> natif et un code <em>AngularJS</em> ?</p>
<p>Cette petite introduction à <em>AngularJS</em> ne vous donne-t-elle pas envie d'aller plus loin ?<br />
Nous étudierons dans un autre article, l'anatomie d'une application <em>AngularJS</em>. À suivre...</p>
<p>Pour aller plus loin :<br />
http://misko.hevery.com/about<br />
http://angularjs.org<br />
http://egghead.io/lessons</p>
<p>&nbsp;</p>
{% endraw %}
