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

## Kézako ?
Pour faire simple une directive est un marqueur sur un élément du DOM (en tant qu'attribut, nom d’élément commentaire ou de classe CSS), ce marqueur informe le compiler HTML ($compile) d'attacher un comportement à cet élément voir de transformer cet élément et ses enfants.

A mon sens un des gros plus du framework AngularJS  réside dans le fait que tout son langage de Template (directive, filtre…) est implémenté de la même manière que ce que nous allons voir ci-dessous. Les sources sont accessibles ici : <a title="https://github.com/angular/angular.js/tree/master/src/ng" href="https://github.com/angular/angular.js/tree/master/src/ng" target="_blank">https://github.com/angular/angular.js/tree/master/src/ng</a>.

## 
## Créer des directives
Tout d'abord nous suivrons  une convention de nommage qui  veut qu'on préfixe le nom de ses propres directives, dans nos exemples ci-dessous nous utiliserons le préfixe "my".

Lors de cet article nous étudierons les options les plus communes des directives, deux autres articles compléteront le tour d'horizon des directives.

### 
### template et templateUrl
Une première étape sera de créer une simple directive chargée d'afficher "Hello Directive"

<pre class="lang:js decode:true">
{% raw %}
angular.module('exemple', [])
  .directive('myDirective', function() {
    return {
      template: 'Hello Directive',
      // une autre solution serait de cibler un template html
      // templateUrl: 'my-template.html',
    }
  });{% endraw %}
</pre>

<pre class="lang:xhtml decode:true">
{% raw %}
&lt;div my-directive&gt;&lt;/div&gt;{% endraw %}
</pre>

Par défaut le seul moyen d'afficher une directive est de l'utiliser via un <em>attribut</em>. Si cela ne convient pas à votre usage il faudra passer par l'option **restrict**.

### 
### restrict
L'option <em>restrict</em> permet de définir le marqueur auquel réagira le compilateur, elle peut valoir :

<ul>
<li><em>A</em> : un attribut</li>
<li><em>E</em> : un élément</li>
<li><em>C</em> : une classe</li>
<li><em>M </em>: un commentaire</li>
</ul>
Ces restrictions sont combinables.

<ul>
<li><em>AEC</em> : le marqueur peut être un attribut, un élément ou une classe.</li>
</ul>
<pre class="lang:xhtml decode:true">
{% raw %}
// attribut
&lt;div my-directive&gt;&lt;/div&gt;
// élément
&lt;my-directive&gt;&lt;/my-directive&gt;
// classe
&lt;div class="my-directive"&gt;
// commentaire
&lt;!-- directive:my-directive --&gt;{% endraw %}
</pre>

L'usage veut que la déclaration via commentaire ne soit jamais utilisée.

La déclaration via élément est privilégiée dans le cas de création de directive complexe de type widget/composant.

La déclaration par classe ou attribut quand à elle convient parfaitement à un comportement simple, un gestionnaire de rebond par exemple.

&nbsp;

### scope
Une directive peut avoir pour but d'être réutilisée plusieurs fois sur la même page, ce genre de problématique, entre autre, nous amène à nous intéresser à l'option <em>scope</em>.

L'option <em>scope</em> peut avoir 3 types de valeurs :

<ul>
<li><em>false</em> : ne rien faire vis à vis du scope, c'est la valeur par défaut.</li>
<li><em>true </em>: créé un scope enfant.</li>
<li><em>{...}</em> : mettre un objet  javascript créé un <em>scope isolé.</em></li>
</ul>
Rassurez vous le principe de scope en Angular est très proche de celle de Javascript.

Le <em>scope enfant</em> ainsi que le <em>scope isolé</em> dispose d'un accès au <em>scope parent</em> via sa propriété <em>$parent</em>.

La grosse différence entre ces deux types de <em>scope</em> est la gestion de <em>l'héritage</em>, ainsi seul un <em>scope enfant</em> hérite via son prototype des données de son <em>scope parent</em>, il est donc inutile d'aller chercher les informations via <em>$parent</em>, à l'inverse d'un <em>scope isolé</em>.

&nbsp;

##### Céation d'un scope isolé
Pour définir un <em>scope isolé</em> il est necessaire de <em>binder</em> ses propriétés :

<ul>
<li><em>@</em> : pour un attribut texte.</li>
<li><em>=</em> : pour une expression (valeur en two way binding).</li>
<li><em>&amp;</em> : pour une expression déclenchant une action.</li>
</ul>
Afin de définir une propriété du <em>scope isolé</em> on fait précéder le nom de l'attribut par le signe adéquat. Si le nom de la propriété est identique au nom de l'attribut, on peut également se contenter de son signe.

<pre class="lang:js decode:true">
{% raw %}
angular.module('exemple', [])
  .directive('myAstraunote', function() {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        expression: '=',
        fn: '&amp;action',
      },
    }
  });{% endraw %}
</pre>

<pre class="lang:xhtml decode:true ">
{% raw %}
&lt;my-directive name='wiston' expression='user.mission' action='launch(user)'&gt;&lt;/my-directive&gt;
{% endraw %}
</pre>

&nbsp;

Dans le prochain opus, controller, compile, link et transclude !


