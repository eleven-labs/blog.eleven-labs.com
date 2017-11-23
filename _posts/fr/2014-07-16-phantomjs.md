---
layout: post
title: PhantomJS
authors:
    - cmoncade
date: '2014-07-16 15:41:12 +0200'
date_gmt: '2014-07-16 13:41:12 +0200'
lang: fr
permalink: /fr/phantomjs/
excerpt: Petite présentation d'un navigateur webkit appelé PhantomJS
categories:
  - Javascript
tags:
  - Javascript
  - PhantomJS
image:
  path: /assets/2014-07-16-phantomjs/phantomjs-logo.png
  height: 160
  width: 160
---
PhantomJS est un navigateur webkit en ligne de commande. Il vous permet entre autres :

*   de faire des captures écran au format PDF, PNG ou JPEG
*   de récupérer des pages web via leurs urls et de les manipuler
*   d’exécuter des tests JavaScript
*   d'envoyer des requêtes sur un serveur distant
*   de faire du monitoring de page web
*   de manipuler le DOM
*   etc

Je vous laisse la curiosité de survoler la <a href="http://phantomjs.org/documentation/" rel="nofollow noreferrer" style="color:#0000ff;">documentation</a> qui est assez complète et plutôt bien faite. Au pire la communauté est plutôt active et répondra à la plupart de vos questions.

# I Installation

Les exemples que je vais détailler dans cet article seront faits sous ubuntu 14.04.

Pour installer PhantomJS, rien de compliqué, rendez-vous sur le <a href="http://phantomjs.org/download.html" rel="nofollow noreferrer" style="color:#0000ff;">site officiel</a>.

Deux possibilités s'offrent à vous, la 1ère (et celle que j'ai choisie) est de télécharger un zip, vous le décompressez et c'est gagné.

La 2ème est de <a href="http://phantomjs.org/build.html" rel="nofollow noreferrer" style="color:#0000ff;">compiler Phantom</a> vous-même. Ce n'est pas plus compliqué que la 1ère méthode, c'est juste plus long.

# II Capture

#### Exemple 1

Phantomjs supporte trois formats d'export: PNG, JPEG et PDF.

Commencez par créer un fichier javascript que j’appellerai phantomjs.js et mettez-y le code suivant :
```js
var page = require('webpage').create(),
system = require('system'), 
address, output, size;

address = system.args[1];
output = system.args[2];

console.log(address, output)

page.open(address, function(status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
    page.render(output + '/phantomjs.png');
    phantom.exit();
    }
});
```

Ceci est un exemple très simpliste car PhantomJS possède tout un tas d'<a href="http://phantomjs.org/api/webpage/" rel="nofollow noreferrer" style="color:#0000ff;">options</a>.

La première ligne est essentielle comme vous pouvez l'imaginer car elle permet de récupérer le mode rendu de page web.

La deuxième vous permet de récupérer les arguments renseignés en ligne de commande via le module System. Ce dernier vous permet également d'afficher les variables d'environnement, les informations de l'OS, le PID de PhantomJS.

On récupère donc l'url de la page web ainsi que le dossier de destination lors de la création du pdf. Je les récupère à l'index 1 et 2 en suivant l'ordre dans lequel j'ai tapé ma commande (cf plus bas sur l'exemple de la commande).

Ensuite, on ouvre la page web et si elle a bien répondu,on fait alors le rendu de la page et on sort du script.

Vous remarquez que j'ai précisé l'extension ".png" du fichier afin d'avoir une image. Il vous suffit de mettre ".pdf" ou ".jpeg" pour changer le format en fonction de vos besoins.

Enfin la commande à taper dans le shell :
```
path/to/phantomjs phantomjs.js 'url' 'yourfolder'
```

Pour faire le rendu du site de PhantomJS par exemple, vous taperez:
```
path/to/phantomjs phantomjs.js 'http://phantomjs.org/' 'yourfolder'
```

Si des erreurs existent sur la page, il est possible que celles-ci s'affichent dans votre console.

#### Exemple 2

Voici un second exemple pour faire un rendu d'une partie de la page. Ici je crée une image de l'icône de PhantomJS présent sur leur site.
```js
var page = require('webpage').create(),
system = require('system'),
address, output, size;

address = system.args[1];
output = system.args[2];

page.open(address, function(status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
      page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js", function() {
            var icone = page.evaluate(function() {
                return $('img[alt="PhantomJS"]')[0].getBoundingClientRect();
            });

            page.clipRect = {
                top:    icone.top,
                left:   icone.left,
                width:  icone.width,
          height: icone.height
            };
            page.render(output + '/phantomjs.png');
      phantom.exit();
  });
    }
});
```

Vous remarquerez l'utilisation de la méthode includeJs() . Cette dernière vous permet d'inclure des librairies javascript (tel que jQuery dans cet exemple) afin de pouvoir les utiliser sur la page que vous évaluez.

Cependant, si la librairie est déjà présente, il est inutile de l'inclure une deuxième fois.

Ensuite, la propriété clipRect nous permet de préciser la zone à retourner et le tour est joué. Retapez la commande précédente et l'image devrait apparaître.

Vous voyez également via cet exemple qu'il vous est possible de manipuler le DOM (supprimer, modifier, rajouter des éléments) à votre guise avant de faire le rendu.

# III Exécuter des tests

PhantomJS peut également être utilisé pour exécuter des tests JavaScript. Parmi tous <a href="https://github.com/ariya/phantomjs/tree/master/examples" rel="nofollow noreferrer" style="color:#0000ff;">les exemples</a> fournis sur leur GitHub officiel, vous trouverez des scripts afin d’exécuter des tests QUnit et Jasmine.

Voici un exemple avec QUnit:

test.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>QUnit Example</title>
  <script src="jquery-2.1.1.js"></script>
  <link rel="stylesheet" href="qunit-1.14.0.css">
</head>
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <script src="qunit-1.14.0.js"></script>
  <script src="test.js"></script>
</body>
</html>
```

test.js
```js
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
```

Et enfin, téléchargez le fichier <a href="https://github.com/ariya/phantomjs/blob/master/examples/run-qunit.js" rel="nofollow noreferrer" style="color:#0000ff;">run-qunit.js</a> et lancez la commande:
```
path/to/phantomjs run-qunit.js page.html
```

Vous devriez voir les lignes suivantes:
```
'waitFor()' finished in 200ms.
Tests completed in 15 milliseconds.
1 assertions of 1 passed, 0 failed.
```

Vous trouverez d'autres scripts tels que run-qunit.js à <a href="https://github.com/jonkemp/qunit-phantomjs-runner" rel="nofollow noreferrer" style="color:#0000ff;">cette adresse</a>.

# IV Conclusion

PhantomJS est un outil très puissant et bien documenté. Donc, si vous avez besoin de générer des pdfs et/ou des images et que votre site contient beaucoup de javascript, PhantomJS peut devenir votre allié.

Mais ce n'est là qu'un aperçu de ses possibilités, je vous encourage à faire un tour sur leur <a href="http://phantomjs.org/examples/index.html" rel="nofollow noreferrer" style="color:#0000ff;">site</a>, cela peut vous donner des idées.