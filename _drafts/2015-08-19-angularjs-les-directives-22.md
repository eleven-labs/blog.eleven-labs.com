---
layout: post
title: 'AngularJS : Les Directives 2/2'
author: denis
date: '2015-08-19 14:44:26 +0200'
date_gmt: '2015-08-19 12:44:26 +0200'
categories:
- Javascript
tags:
- AngularJS
- angular
- directive
---

## Préambule
Comme vu dans l’article précédent, une directive est un marqueur HTML interprété par AngularJS via son $compile. Nous allons donc nous intéresser ici aux divers moyens nous permettant d’avoir une gestion la plus fine possible des transformations de nos directives.

&nbsp;

## Manipulation du contenu
Nous pouvons donc agir à quatre moments clefs de la vie d’une directive :

<ul>
<li>Le compile n’est appelé qu’une seule fois lors de l’initialisation. C’est ici que l’on manipule le template de la directive en amont, souvent dans un but d’optimisation.</li>
<li>Le controller est appelé quand une directive est instanciée. Il permet d’initialiser le scope de la directive et de définir les méthodes de notre directive qui pourront éventuellement être partagées avec d’autres controllers extérieurs.</li>
<li>Le pre-link est très rarement utilisé, sa principale particularité est que les pre-link sont appelés en héritage parent vers les enfants, là ou les post-link sont appelés en remontant des enfants vers les parents.</li>
<li>Le post-link sera votre principal outil car à ce moment là, le contenu est prêt et disponible pour agir dessus. C’est donc ici que l’on pourra par exemple manipuler le DOM finalisé, attacher des événements, attacher des watchers sur le scope, observer les attributs de la directive ...</li>
</ul>
&nbsp;

Ci-dessous une directive implémentant tous ces concepts :

<pre class="lang:js decode:true">
{% raw %}
angular.module('exemple', [])
  .directive('myDirective', function() {
    return {
      restrict: 'EA',
      controller: function($scope, $element, $attrs, $transclude) {
        // controller code
      },
      compile: function(tElement, tAttributes, transcludeFn) {
        // compile code
        return {
          pre: function(scope, element, attributes, controller, transcludeFn) {
            // pre-link code
          },
          post: function(scope, element, attributes, controller,transcludeFn) {
            // post-link code
          }
        };
      }
    };  
  });{% endraw %}
</pre>

La fonction pre-link étant rarement utile, nous pouvons la supprimer. Dans ce cas le compile doit retourner la fonction post-link.

<pre class="lang:js decode:true">
{% raw %}
angular.module('exemple', [])
  .directive('myDirective', function() {
    return {
      restrict: 'EA',
      controller: function($scope, $element, $attrs, $transclude) {
        // controller code
      },
      compile: function(tElement, tAttributes, transcludeFn) {
        // compile code
        return function(scope, element, attributes, controller,transcludeFn) {
          // post-link code
        }
      }
    };  
  });
{% endraw %}
</pre>

Si l'on ne souhaite effectuer aucune manipulation du template, la fonction compile devient inutile Dans ce cas il est possible de déclarer uniquement un link contenant la fonction post-link.

<pre class="lang:js decode:true">
{% raw %}
angular.module('exemple', [])
  .directive('myDirective', function() {
    return {
      restrict: 'EA',
      controller: function($scope, $element, $attrs, $transclude) {
        // controller code
      },
      link: function(scope, element, attributes, controller,transcludeFn) {
        // post-link code
      }
    };  
  });{% endraw %}
</pre>

<h2 class="lang:js decode:true ">
<h2 class="lang:js decode:true ">Transclusion
Il peut arriver qu'une directive doive modifier les éléments du DOM se trouvant à l’intérieur d'elle. Dans ce cas, la transclusion est notre amie, et nous permet de récupérer le contenu interne à la directive pour le manipuler.

### Mise en place
Pour se faire il suffit de spécifier à sa directive qu'elle souhaite utiliser la transclusion.

<pre class="lang:js decode:true">
{% raw %}
angular.module('exemple', [])
  .directive('myDirective', function () {
    return {
      restrict: 'EA',
      transclude: true,
      scope: {
        chapo: @
      },
      template: template.html
      link: function(scope, element, attributes, controller,transcludeFn) {
        // post-link code
      }
    };  
  });{% endraw %}
</pre>

&nbsp;

&nbsp;

Mais cela seul ne suffit pas, il vous faudra aussi définir dans son template l'emplacement où la transclusion sera faite

<pre class="lang:xhtml decode:true">
{% raw %}
&lt;div&gt;
  &lt;h2&gt;{{chapo}}&lt;/h2&gt;
  &lt;div ng-transclude&gt;&lt;/div&gt;
&lt;/div&gt;{% endraw %}
</pre>

Dans certains cas plus complexes, il faudra passer par la fonction $transclude, qui est un peu plus complexe mais pas insurmontable.

Nous voilà donc au terme de notre promenade dans le monde merveilleux des directives sous Angular 1.x. Souvent un peu complexe à prendre en main au début, on peut très rapidement en devient friand parfois de façon un peu excessive.<br />
Si je peux vous donner un conseil assurez-vous que la fonctionnalité va être répété sinon il peut être contre-productif de faire une directive.

En complément n'hésitez à aller voir <a href="https://docs.angularjs.org/guide/directive">le guide</a> du site officiel, et bon Angular à tous !


