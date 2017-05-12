---
layout: post
title: PhantomJS
author: cedric
date: '2014-07-16 15:41:12 +0200'
date_gmt: '2014-07-16 13:41:12 +0200'
categories:
- Javascript
tags:
- tutoriel
- Javascript
- PhantomJS
---
{% raw %}
PhantomJS est un navigateur webkit en ligne de commande.

Il vous permet entre autres :

<ul>
<li>de faire des captures écran au format PDF, PNG ou JPEG</li>
<li>de récupérer des pages web via leurs urls et de les manipuler</li>
<li>d’exécuter des tests JavaScript</li>
<li>d'envoyer des requêtes sur un serveur distant</li>
<li>de faire du monitoring de page web</li>
<li>de manipuler le DOM</li>
<li>etc</li>
</ul>
Je vous laisse la curiosité de survoler la <span style="color: #0000ff;"><a title="documentation" href="http://phantomjs.org/documentation/" target="_blank"><span style="color: #0000ff;">documentation</span></a></span> qui est assez complète et plutôt bien faite. Au pire la communauté est plutôt active et répondra à la plupart de vos questions.

# I Installation
Les exemples que je vais détailler dans cet article seront faits sous ubuntu 14.04.

Pour installer PhantomJS, rien de compliqué, rendez-vous sur le <span style="color: #0000ff;"><a title="install" href="http://phantomjs.org/download.html" target="_blank"><span style="color: #0000ff;">site officiel</span></a></span>.

Deux possibilités s'offrent à vous, la 1ère (et celle que j'ai choisie) est de télécharger un zip, vous le décompressez et c'est gagné.

La 2ème est de <a title="compiler" href="http://phantomjs.org/build.html" target="_blank"><span style="color: #0000ff;"><span style="color: #0000ff;">compiler Phantom</span>JS</span></a> vous-même. Ce n'est pas plus compliqué que la 1ère méthode, c'est juste plus long.

# II Capture
#### Exemple 1
Phantomjs supporte trois formats d'export: PNG, JPEG et PDF.

Commencez par créer un fichier javascript que j’appellerai phantomjs.js et mettez-y le code suivant :

<pre class="lang:js decode:true" title="exemple capture">var page = require('webpage').create(),
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
</pre>
Ceci est un exemple très simpliste car PhantomJS possède tout un tas d'<span style="color: #0000ff;"><a title="options phantomjs" href="http://phantomjs.org/api/webpage/" target="_blank"><span style="color: #0000ff;">options</span></a></span>.

La première ligne est essentielle comme vous pouvez l'imaginer car elle permet de récupérer le mode rendu de page web.

La deuxième vous permet de récupérer les arguments renseignés en ligne de commande via le module System. Ce dernier vous permet également d'afficher les variables d'environnement, les informations de l'OS, le PID de PhantomJS.

On récupère donc l'url de la page web ainsi que le dossier de destination lors de la création du pdf. Je les récupère à l'index 1 et 2 en suivant l'ordre dans lequel j'ai tapé ma commande (cf plus bas sur l'exemple de la commande).

Ensuite, on ouvre la page web et si elle a bien répondu,on fait alors le rendu de la page et on sort du script.

Vous remarquez que j'ai précisé l'extension ".png" du fichier afin d'avoir une image. Il vous suffit de mettre ".pdf" ou ".jpeg" pour changer le format en fonction de vos besoins.

Enfin la commande à taper dans le shell :

<pre class="lang:sh decode:true" title="commande PhantomJs">path/to/phantomjs phantomjs.js 'url' 'yourfolder'</pre>
Pour faire le rendu du site de PhantomJS par exemple, vous taperez:

<pre class="lang:sh decode:true">path/to/phantomjs phantomjs.js 'http://phantomjs.org/' 'yourfolder'</pre>
Si des erreurs existent sur la page, il est possible que celles-ci s'affichent dans votre console.

#### Exemple 2
Voici un second exemple pour faire un rendu d'une partie de la page. Ici je crée une image de l'icône de PhantomJS présent sur leur site.

<pre class="lang:js decode:true">var page = require('webpage').create(),
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
</pre>
Vous remarquerez l'utilisation de la méthode includeJs() . Cette dernière vous permet d'inclure des librairies javascript (tel que jQuery dans cet exemple) afin de pouvoir les utiliser sur la page que vous évaluez.

Cependant, si la librairie est déjà présente, il est inutile de l'inclure une deuxième fois.

Ensuite, la propriété clipRect nous permet de préciser la zone à retourner et le tour est joué. Retapez la commande précédente et l'image devrait apparaître.

Vous voyez également via cet exemple qu'il vous est possible de manipuler le DOM (supprimer, modifier, rajouter des éléments) à votre guise avant de faire le rendu.

# III Exécuter des tests
PhantomJS peut également être utilisé pour exécuter des tests JavaScript. Parmi tous <span style="color: #0000ff;"><a title="exemples" href="https://github.com/ariya/phantomjs/tree/master/examples" target="_blank"><span style="color: #0000ff;">les exemples</span></a></span> fournis sur leur GitHub officiel, vous trouverez des scripts afin d’exécuter des tests QUnit et Jasmine.

Voici un exemple avec QUnit:

<span style="text-decoration: underline;">test.html</span>

<pre class="lang:xhtml decode:true" title="test.html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;title&gt;QUnit Example&lt;/title&gt;
  &lt;script src="jquery-2.1.1.js"&gt;&lt;/script&gt;
  &lt;link rel="stylesheet" href="qunit-1.14.0.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="qunit"&gt;&lt;/div&gt;
  &lt;div id="qunit-fixture"&gt;&lt;/div&gt;
  &lt;script src="qunit-1.14.0.js"&gt;&lt;/script&gt;
  &lt;script src="test.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<span style="text-decoration: underline;"> test.js</span>

<pre class="lang:js decode:true" title="test.js">QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});</pre>
Et enfin, téléchargez le fichier <span style="color: #0000ff;"><a title="run-qunit.js" href="https://github.com/ariya/phantomjs/blob/master/examples/run-qunit.js" target="_blank"><span style="color: #0000ff;">run-qunit.js</span></a></span> et lancez la commande:

<pre class="lang:sh decode:true" title="commande">path/to/phantomjs run-qunit.js page.html</pre>
Vous devriez voir les lignes suivantes:

<pre class="lang:sh decode:true" title="output">'waitFor()' finished in 200ms.
Tests completed in 15 milliseconds.
1 assertions of 1 passed, 0 failed.</pre>
Vous trouverez d'autres scripts tels que run-qunit.js à <span style="color: #0000ff;"><a title="qunit-phantomjs-runner" href="https://github.com/jonkemp/qunit-phantomjs-runner" target="_blank"><span style="color: #0000ff;">cette adresse</span></a></span>.

#  IV Conclusion
PhantomJS est un outil très puissant et bien documenté. Donc, si vous avez besoin de générer des pdfs et/ou des images et que votre site contient beaucoup de javascript, PhantomJS peut devenir votre allié.

Mais ce n'est là qu'un aperçu de ses possibilités, je vous encourage à faire un tour sur leur <span style="color: #0000ff;"><a title="documentation" href="http://phantomjs.org/examples/index.html" target="_blank"><span style="color: #0000ff;">site</span></a></span>, cela peut vous donner des idées.

&nbsp;

{% endraw %}
