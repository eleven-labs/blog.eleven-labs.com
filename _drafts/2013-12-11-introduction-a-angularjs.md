--- layout: post title: Introduction à AngularJS author: peter date:
'2013-12-11 09:36:42 +0100' date\_gmt: '2013-12-11 08:36:42 +0100'
categories: - Javascript tags: - tutoriel - Javascript - AngularJS ---
{% raw %}

*AngularJS* est un *framework* *JavaScript* open-source qui a vu le jour
en 2009 et dont le père Miško Hevery est un expert Web autour des
technologies *Java* et *JavaScript*, travaillant chez Google.

Construire une application web avec une interface utilisateur complexe
devient très difficile en utilisant uniquement des librairies telles que
*jQuery*. *AngularJS* facilite la création et la maintenance des
applications, et accélère le développement *JavaScript/AJAX*. Il permet
la création d'applications web monopage (*single-page application*) et
apporte aux applications Web côté client les services traditionnellement
apportés côté serveur, rendant de ce fait les applications Web beaucoup
plus légères.

**Les concepts d'*AngularJS* :**

***Template* côté client**

Les *templates* et les données sont assemblés côté client. Le rôle du
serveur se résume alors seulement à servir les données requises par ces
*templates*.

Voici un exemple minimaliste contenant un *template* et un *controller*
:

Voici notre *template* "hello.html" :

``` {.lang:xhtml .decode:true}
<html ng-app>
<head>
<title>Hello, World in AngularJS</title>
  <script src="angular.js"></script>
  <script src="controllers.js"></script>
</head>
<body>
  <div ng-controller='HelloController'>
    <input ng-model='hello.text'>
    <p>{{hello.text}}, World</p>
  </div>
</body>
</html>
```

Voici notre contrôleur "controller.js"

``` {.lang:js .decode:true}
function HelloController($scope) {
  $scope.hello = { text: 'Hello' };
}
```

Le chargement de "hello.html" dans un navigateur produira l'affichage
suivant :

[![hello](http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello.png){.alignnone
.size-full .wp-image-802 width="165"
height="74"}](http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello.png)

Il y a plusieurs choses intéressantes à noter ici en comparaison avec la
plupart des méthodes utilisées aujourd'hui :

-   Il n'y a pas de classes ou d'ID dans le code *HTML* pour identifier
    où attacher des *event listeners*.
-   Lorsque le contrôleur initialise *hello.text*, nous n'avons pas eu à
    enregistrer des *event listeners* ou écrire des *callbacks*.
-   Le contrôleur est un bon vieux code *JavaScript* qui n'a besoin de
    rien hériter de ce que *AngularJS* fournit, et qui obtient l'objet
    *\$scope* sans que l'on n'ait besoin de le créer.
-   Nous n'avons pas eu à appeler le constructeur du contrôleur.

 

***MVC* (Modèle-Vue-Contrôleur)**

Dans les applications *AngularJS*, la vue est le *DOM* (*Document Object
Model*), les contrôleurs sont des classes *JavaScript*, et le modèle est
stocké dans les propriétés des objets.

***Data Binding***

*AngularJS* permet de faire du *data binding* très simplement sans
devoir écrire le moindre code *AJAX*.\
Retournons dans l'exemple de code ci-dessus. Si nous remplaçons le texte
*Hello* par le texte *Hi* dans le champ de saisie, voici l'affichage que
nous aurons dans le navigateur :

[![Hi](http://blog.eleven-labs.com/wp-content/uploads/2013/12/Hi.png){.alignnone
.size-full .wp-image-803 .aligncenter width="168"
height="65"}](http://blog.eleven-labs.com/wp-content/uploads/2013/12/Hi.png)

 

L'interface utilisateur se met à jour dynamiquement, sans que nous ayons
eu besoin d'attacher un *change listener* sur le champ de saisie.\
Il faut également noter que le *data binding* est bidirectionnel. Dans
notre contrôleur, le changement de valeur de notre variable
*\$scope.hello.text*, à la suite d'une requête au serveur par exemple,
mettrait automatiquement à jour le champ de saisie et le texte dans les
doubles accolades.

**Injection de dépendances**

Si nous reprenons le code de notre contrôleur, on note que l'objet
*\$scope* est passé à notre fonction automatiquement. En effet,
*AngularJS* fournit un système d'injection de dépendances qui suit un
modèle de conception appelé la "loi de Déméter" (Law of Demeter).

**Directives**

Une des meilleures parties de *AngularJS*, c'est que vous pouvez écrire
vos propres *templates* *HTML*. En effet, le cœur du *framework* inclut
un puissant moteur de manipulation du *DOM* qui vous permet d'étendre la
syntaxe du *HTML*.\
Nous avons déjà vu plusieurs nouveaux attributs dans notre *template*
qui ne font pas partie de la spécification HTML.\
Si l'on reprend notre *template* "hello.html", on remarque la notation
de double accolades et *ng-model* pour le *data binding*
et *ng-controller* pour spécifier quel contrôleur supervise quelle
partie de la vue. On appel ces extensions HTML des directives.\
*AngularJS* est livré avec de nombreuses directives qui vous aideront à
définir les vues de votre application. Ces directives peuvent définir ce
que nous appelons des *templates* et peuvent être utilisé pour créer des
composants réutilisables.

Comparons notre code écrit avec *AngularJS*, à ce que l'on écrirait en
*JavaScript* natif :

``` {.lang:default .decode:true}
<html>
<head>
<title>Hello, World in JavaScript</title>
</head>
<body>
<p id="hello"></p>
<script type="text/javascript">
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
</script>
</body>
</html>
```

N'y a-t-il pas une très grande différence entre un code *JavaScrit*
natif et un code *AngularJS* ?

Cette petite introduction à *AngularJS* ne vous donne-t-elle pas envie
d'aller plus loin ?\
Nous étudierons dans un autre article, l'anatomie d'une application
*AngularJS*. À suivre...

Pour aller plus loin :\
http://misko.hevery.com/about\
http://angularjs.org\
http://egghead.io/lessons

 

{% endraw %}
