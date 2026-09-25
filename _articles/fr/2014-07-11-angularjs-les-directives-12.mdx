---
contentType: article
lang: fr
date: '2014-07-11'
slug: angularjs-les-directives-12
title: 'AngularJS : Les Directives 1/2'
excerpt: 'Kézako ?'
categories:
  - javascript
authors:
  - denis
keywords:
  - angular
---

## Kézako ?

Pour faire simple une directive est un marqueur sur un élément du DOM (en tant qu'attribut, nom d’élément commentaire ou
de classe CSS), ce marqueur informe le compiler HTML ($compile) d'attacher un comportement à cet élément voir de
transformer cet élément et ses enfants.

A mon sens un des gros plus du framework AngularJS  réside dans le fait que tout son langage de Template (directive,
filtre, ...) est implémenté de la même manière que ce que nous allons voir ci-dessous.
Les sources sont accessibles ici : [https://github.com/angular/angular.js/tree/master/src/ng]()

## Créer des directives

Tout d'abord nous suivrons  une convention de nommage qui  veut qu'on préfixe le nom de ses propres directives, dans nos
exemples ci-dessous nous utiliserons le préfixe "my".

Lors de cet article nous étudierons les options les plus communes des directives, deux autres articles compléteront le
tour d'horizon des directives.

### template et templateUrl

Une première étape sera de créer une simple directive chargée d'afficher "Hello Directive"

```js
angular.module('exemple', [])
  .directive('myDirective', function() {
    return {
      template: 'Hello Directive',
      // une autre solution serait de cibler un template html
      // templateUrl: 'my-template.html',
    }
  });
```

```html
<div my-directive></div>
```

Par défaut le seul moyen d'afficher une directive est de l'utiliser via un `attribut`.
Si cela ne convient pas à votre usage il faudra passer par l'option **restrict**.

### restrict

L'option `restrict` permet de définir le marqueur auquel réagira le compilateur, elle peut valoir :

- `A` : un attribut
- `E` : un élément
- `C` : une classe
- `M` : un commentaire

Ces restrictions sont combinables.

- `AEC` : le marqueur peut être un attribut, un élément ou une classe.

```html
// attribut
<div my-directive></div>

// élément
<my-directive></my-directive>

// classe
<div class="my-directive">

// commentaire
<!-- directive:my-directive -->
```

L'usage veut que la déclaration via commentaire ne soit jamais utilisée.

La déclaration via élément est privilégiée dans le cas de création de directive complexe de type widget/composant.

La déclaration par classe ou attribut quand à elle convient parfaitement à un comportement simple, un gestionnaire de
rebond par exemple.

### scope

Une directive peut avoir pour but d'être réutilisée plusieurs fois sur la même page, ce genre de problématique, entre
autre, nous amène à nous intéresser à l'option `scope`.

L'option `scope` peut avoir 3 types de valeurs :

- `false` : ne rien faire vis à vis du scope, c'est la valeur par défaut.
- `true`: créé un scope enfant.
- `{...}`: mettre un objet  javascript créé un `scope isolé.`

Rassurez vous le principe de scope en Angular est très proche de celle de Javascript.

Le `scope enfant` ainsi que le `scope isolé` dispose d'un accès au `scope parent` via sa propriété
`$parent`.

La grosse différence entre ces deux types de `scope` est la gestion de `l'héritage`, ainsi seul un
`scope enfant` hérite via son prototype des données de son `scope parent`, il est donc inutile d'aller
chercher les informations via `$parent`, à l'inverse d'un `scope isolé`.

#### Céation d'un scope isolé

Pour définir un `scope isolé` il est necessaire de `binder` ses propriétés :

- `@` : pour un attribut texte.
- `=` : pour une expression (valeur en two way binding).
- `&` : pour une expression déclenchant une action.

Afin de définir une propriété du `scope isolé` on fait précéder le nom de l'attribut par le signe adéquat.
Si le nom de la propriété est identique au nom de l'attribut, on peut également se contenter de son signe.

```js
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
  });
```

```html
<my-directive name='wiston' expression='user.mission' action='launch(user)'></my-directive>
```

Dans le prochain opus, controller, compile, link et transclude !
