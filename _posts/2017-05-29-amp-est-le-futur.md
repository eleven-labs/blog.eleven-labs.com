---
layout: post
title: AMP le futur du web ?
author: captainjojo
permalink: /fr/amp-le-futur-du-web/
excerpt: Google, leader incontesté des services web (recherche, pub, analytics...), propose depuis plus d'un an une nouvelle façon d'afficher vos pages, désignée sous le nom AMP project
categories:
- Javascript
tags:
- tutoriel
- cache
- Javascript
- web
---
Google, leader incontesté des services web (recherche, pub, analytics...), propose depuis plus d'un an une nouvelle façon d'afficher vos pages, désignée sous le nom [AMP](https://www.ampproject.org/) project.

### Mais ça donne quoi ?

Si vous suivez à fond l'ensemble des actualités médiatiques et que vous utilisez énormément la recherche google, vous avez sûrement vu apparaître les "cartes" suivantes lors de vos recherches mobile :

![](/assets/2017-05-29-amp-est-le-futur/Croped-1.png)

Et oui, c'est cela AMP. Une place de choix dans la recherche Google, mais aussi une nouvelle façon de naviguer entre les sites. En effet, si vous cliquez sur une des cartes vous ne serez pas sur le site qui a envoyé le contenu (on comprendra pourquoi plus tard) mais vous resterez chez Google, qui vous permettra de "slider" entre chaque page de la recherche :

![](/assets/2017-05-29-amp-est-le-futur/Capture-d’écran-2017-05-29-à-10.38.18.png)

Intéressant non ? Mais ce n'est pas tout, si vous regardez plus attentivement vous vous rendrez compte que le site AMP est énormément plus rapide que votre site lui-même.

### Mais comment ça marche ?

Le projet se repose sur 3 composants permettant de proposer cette nouvelle expérience utilisateur :

- AMP HTML

AMP est par défaut du HTML classique, mais dans certain cas de nouvelles balises sont mises en place pour permettre une rapidité d'exécution accrue. Vous avez par exemple 

```html
<amp-img>
```

qui va permettre un affichage plus rapide des images et cela même pour les navigateurs non compatibles. AMP interdit aussi l'utilisation de certaine balises considérées comme inutiles ou non performantes. Vous êtes donc restreint sur l'utilisation des balises suivantes, 

```html
<object>
```

, 
```html
<param>
```
, etc...

- AMP JS

AMP propose une nouvelle utilisation de javascript dans vos pages web, au moyen d'une liste exhaustive de librairies javascript optimisées. Vous pouvez en trouver la liste [ici](https://github.com/ampproject/amphtml/tree/master/src). Mais l'optimisation principale réside en la *désynchronisation* des librairies javascript externes à votre site. C'est d'ailleurs pour cela que la plupart des pages AMP  ne proposent pas de publicité. Cette dernière reste la hantise de la web performance.

- AMP Cache

AMP cache est en option mais c'est tout de même le point central d'AMP. Vous avez toujours rêvé d'avoir accès à l'un des meilleurs systèmes de cache du monde ? C'est maintenant possible : AMP Cache permet de stocker vos pages AMP directement dans le cache Google. C'est pour cela que vous n'êtes plus sur votre site mais directement sur www.google.com. Cela permet une optimisation exponentielle de la performance de votre page.

Pour aller plus loin dans la description des principes d'AMP je vous invite à lire cette article [https://www.ampproject.org/fr/learn/amp-design-principles/](https://www.ampproject.org/fr/learn/about-how/) ou de regarder cette vidéo :

<iframe width="560" height="315" src="https://www.youtube.com/embed/9Cfxm7cikMY" frameborder="0" allowfullscreen></iframe>


### Créons notre première page

Comme AMP ce n'est jamais que du HTML nous allons commencer par la phase obligatoire : la mise en place des metas de notre page.

Commençons par créer un fichier index.amp, puis mettons la balise indiquant le type de document.

```html
<!doctype html>
```
Puis nous ouvrons la balise html en y ajoutant l'option AMP.

```html
<!doctype html>
<html ⚡>
</html>
```
Il nous faut maintenant mettre les metas obligatoires.

```html
<!doctype html>
<html ⚡>
  <head>
    <meta charset="utf-8">
    <title>Ma première page AMP</title>
    <link rel="canonical" href="http://test.fr/index.amp" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  <body>
    Ma première page AMP
  </body>
</html>
```
Comme vous le constatez, on y retrouve :

- l'encodage de votre page
- le lien canonique qui contient soit l'url HTML de votre page, soit l'url AMP
- le viewport de votre page
- la balise style obligatoire pour prendre en compte AMP
- le chargement de la librairie javascript AMP
- le body de la page

Pour être présent dans la recherche AMP de Google comme vu précédemment, il faut mettre en place le [schema.org](http://schema.org/), dont vous trouverez de plus amples informations [ici](https://developers.google.com/search/docs/guides/intro-structured-data).

```html
<!doctype html>
<html ⚡>
  <head>
    <meta charset="utf-8">
    <title>Ma première page AMP</title>
    <link rel="canonical" href="http://test.fr/index.amp" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "Exemple AMP",
        "datePublished": "2017-05-25T19:37:41Z",
      }
    </script>
  </head>
  <body>
    Ma première page AMP
  </body>
</html>
```
Nous avons maintenant une page de base. Mais est-elle vraiment AMP ? Afin d'effectuer une vérification, AMP a mis en place deux systèmes. Le plus simple est directement online, à cette url [https://validator.ampproject.org/](https://validator.ampproject.org/). Votre deuxième option est d'afficher votre page dans le navigateur en ajoutant 
```html
#development=1
```
à votre url. Dans votre console chrome vous devriez maintenant voir les erreurs de validation.

Une page web c'est bien, mais il faut y mettre du CSS. C'est aussi là que AMP est assez contraignant. Vous pouvez utiliser seulement un fichier CSS externe, sinon le CSS doit être dans une balise spécifique. Vous devez aussi définir explicitement la taille de chaque élément.

```html
<!doctype html>
<html ⚡>
  <head>
    <meta charset="utf-8">
    <title>Ma première page AMP</title>
    <link rel="canonical" href="http://test.fr/index.amp" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "Exemple AMP",
        "datePublished": "2017-05-25T19:37:41Z",
      }
    </script>
    <style amp-custom>
      body {
        background-color: white;
      }
      h1 {
        color: red;
      }
      amp-img {
        background-color: yellow;
        border: 1px solid black;
      }
    </style>

  </head>
  <body>
    <h1>Ma première page AMP</h1>
    <div>
      Salut tout le monde
    </div>
    <amp-img src="/wp-content/uploads/2017/05/logo-og-image.jpg" alt="amp" height="300" width="500"></amp-img>
  </body>
</html>
```
Pour terminer notre page, il faut que Google sache que nous avons fait une page AMP, et pour cela rien de plus simple.

Dans votre HTML vous devez notifier que la page existe en ajoutant la meta suivante :


```html
<link rel="amphtml" href="URL DE LA PAGE AMP">
```

Dans la page AMP vous devez mettre votre page HTML en ajoutant cette balise :

```html
<link rel="canonical" href="URL DE LA PAGE HTML">
```

Si vous n'avez qu'une page rien de plus vous n'avez qu'à mettre le lien canonique de votre page.

### C'est fini

Bravo, vous avez fait un grand pas dans la web performance !

Il existe de nombreuses autres fonctionnalités disponibles, telles que la mise en place [d'un système de login](https://www.ampproject.org/fr/docs/tutorials/login_requiring), un [live blog](https://www.ampproject.org/fr/docs/tutorials/live_blog) mais aussi de la publicité, de l'analytics... Je vous invite à regarder la page [https://www.ampproject.org/fr/docs/guides/](https://www.ampproject.org/fr/docs/guides/) qui  pourra vous inspirer pour votre application web.
