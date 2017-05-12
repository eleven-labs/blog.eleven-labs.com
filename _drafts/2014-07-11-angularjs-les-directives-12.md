---
layout: post
title: 'AngularJS : Les Directives 1/2'
author: denis
date: '2014-07-11 14:19:25 +0200'
date_gmt: '2014-07-11 12:19:25 +0200'
categories:
- Javascript
tags:
- AngularJS
---
{% raw %}
## Kézako ?
<p>Pour faire simple une directive est un marqueur sur un élément du DOM (en tant qu'attribut, nom d’élément commentaire ou de classe CSS), ce marqueur informe le compiler HTML ($compile) d'attacher un comportement à cet élément voir de transformer cet élément et ses enfants.</p>
<p>A mon sens un des gros plus du framework AngularJS  réside dans le fait que tout son langage de Template (directive, filtre…) est implémenté de la même manière que ce que nous allons voir ci-dessous. Les sources sont accessibles ici : <a title="https://github.com/angular/angular.js/tree/master/src/ng" href="https://github.com/angular/angular.js/tree/master/src/ng" target="_blank">https://github.com/angular/angular.js/tree/master/src/ng</a>.</p>
## 
## Créer des directives
<p>Tout d'abord nous suivrons  une convention de nommage qui  veut qu'on préfixe le nom de ses propres directives, dans nos exemples ci-dessous nous utiliserons le préfixe "my".</p>
<p>Lors de cet article nous étudierons les options les plus communes des directives, deux autres articles compléteront le tour d'horizon des directives.</p>
<h3></h3>
<h3>template et templateUrl</h3>
<p>Une première étape sera de créer une simple directive chargée d'afficher "Hello Directive"</p>
<pre class="lang:js decode:true">angular.module('exemple', [])
  .directive('myDirective', function() {
    return {
      template: 'Hello Directive',
      // une autre solution serait de cibler un template html
      // templateUrl: 'my-template.html',
    }
  });</pre>
<pre class="lang:xhtml decode:true">&lt;div my-directive&gt;&lt;/div&gt;</pre>
<p>Par défaut le seul moyen d'afficher une directive est de l'utiliser via un <em>attribut</em>. Si cela ne convient pas à votre usage il faudra passer par l'option <strong>restrict</strong>.</p>
<h3></h3>
<h3>restrict</h3>
<p>L'option <em>restrict</em> permet de définir le marqueur auquel réagira le compilateur, elle peut valoir :</p>
<ul>
<li><em>A</em> : un attribut</li>
<li><em>E</em> : un élément</li>
<li><em>C</em> : une classe</li>
<li><em>M </em>: un commentaire</li>
</ul>
<p>Ces restrictions sont combinables.</p>
<ul>
<li><em>AEC</em> : le marqueur peut être un attribut, un élément ou une classe.</li>
</ul>
<pre class="lang:xhtml decode:true">// attribut
&lt;div my-directive&gt;&lt;/div&gt;
// élément
&lt;my-directive&gt;&lt;/my-directive&gt;
// classe
&lt;div class="my-directive"&gt;
// commentaire
&lt;!-- directive:my-directive --&gt;</pre>
<p>L'usage veut que la déclaration via commentaire ne soit jamais utilisée.</p>
<p>La déclaration via élément est privilégiée dans le cas de création de directive complexe de type widget/composant.</p>
<p>La déclaration par classe ou attribut quand à elle convient parfaitement à un comportement simple, un gestionnaire de rebond par exemple.</p>
<p>&nbsp;</p>
<h3>scope</h3>
<p>Une directive peut avoir pour but d'être réutilisée plusieurs fois sur la même page, ce genre de problématique, entre autre, nous amène à nous intéresser à l'option <em>scope</em>.</p>
<p>L'option <em>scope</em> peut avoir 3 types de valeurs :</p>
<ul>
<li><em>false</em> : ne rien faire vis à vis du scope, c'est la valeur par défaut.</li>
<li><em>true </em>: créé un scope enfant.</li>
<li><em>{...}</em> : mettre un objet  javascript créé un <em>scope isolé.</em></li>
</ul>
<p>Rassurez vous le principe de scope en Angular est très proche de celle de Javascript.</p>
<p>Le <em>scope enfant</em> ainsi que le <em>scope isolé</em> dispose d'un accès au <em>scope parent</em> via sa propriété <em>$parent</em>.</p>
<p>La grosse différence entre ces deux types de <em>scope</em> est la gestion de <em>l'héritage</em>, ainsi seul un <em>scope enfant</em> hérite via son prototype des données de son <em>scope parent</em>, il est donc inutile d'aller chercher les informations via <em>$parent</em>, à l'inverse d'un <em>scope isolé</em>.</p>
<p>&nbsp;</p>
<h5>Céation d'un scope isolé</h5>
<p>Pour définir un <em>scope isolé</em> il est necessaire de <em>binder</em> ses propriétés :</p>
<ul>
<li><em>@</em> : pour un attribut texte.</li>
<li><em>=</em> : pour une expression (valeur en two way binding).</li>
<li><em>&amp;</em> : pour une expression déclenchant une action.</li>
</ul>
<p>Afin de définir une propriété du <em>scope isolé</em> on fait précéder le nom de l'attribut par le signe adéquat. Si le nom de la propriété est identique au nom de l'attribut, on peut également se contenter de son signe.</p>
<pre class="lang:js decode:true">angular.module('exemple', [])
  .directive('myAstraunote', function() {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        expression: '=',
        fn: '&amp;action',
      },
    }
  });</pre>
<pre class="lang:xhtml decode:true ">&lt;my-directive name='wiston' expression='user.mission' action='launch(user)'&gt;&lt;/my-directive&gt;
</pre>
<p>&nbsp;</p>
<p>Dans le prochain opus, controller, compile, link et transclude !</p>
{% endraw %}
