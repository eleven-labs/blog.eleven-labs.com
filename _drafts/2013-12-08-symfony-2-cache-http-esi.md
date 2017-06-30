---
layout: post
title: 'Symfony 2 : Cache HTTP  et ESI'
author: cedric
date: '2013-12-08 19:11:17 +0100'
date_gmt: '2013-12-08 18:11:17 +0100'
categories:
- Symfony
tags:
- symfony2
---

<span style="text-align: justify; font-size: 13px;">Lorsque l’on développe un site, en particulier un site à fort trafic, on est forcément amené à se poser la question des ressources consommées par ce dernier afin d’optimiser son temps de réponse. En effet, une page qui met plus de 3-4 secondes à s’afficher rend vite désagréable la navigation et découragera plus d’une personne à venir sur votre site.</span>

<!--more-->

#  1)    Principe du cache HTTP
Le système de cache de Symfony vous permettra de diminuer les temps de réponses de vos pages en utilisant la puissance du cache HTTP tel qu'il est défini dans la <em><span style="color: #0000ff;"><a title="Spécification HTTP" href="http://fr.wikipedia.org/wiki/Hypertext_Transfer_Protocol" target="_blank"><span style="color: #0000ff;">spécification HTTP</span></a></span>. </em>Sachez cependant que ce n’est qu’une des solutions possibles.

Pour augmenter la vitesse d'une application, on peut par exemple :

-          optimiser l’utilisation de la base de données. Gérer l’espace alloué à la mémoire tampon pour accélérer l’accès aux données les plus souvent demandées, développer des vues et des procédures pour alléger votre serveur par exemple.

-          Utiliser la mise en cache des <span style="color: #0000ff;"><em><a title="OPCodes" href="http://fr.openclassrooms.com/informatique/cours/accelerer-la-generation-de-vos-pages-php-avec-l-extension-apc/presentation-de-l-extension-apc" target="_blank"><span style="color: #0000ff;">OPCodes</span></a></em></span> si vous êtes admin de votre serveur. Pour résumer grossièrement, l’OPCode est le code intermédiaire lors de la transformation de votre code (HTML, PHP …) en code binaire compréhensible par la machine. On trouvera parmi les plus connus APC, XCache ou encore EAccelerator.

Pour revenir au cache http, expliquons en un peu le principe. Le rôle de la mémoire cache (ou reverse proxy) est d’accepter les requêtes coté client et de les transmettre au serveur. Il va ensuite recevoir les réponses et les transmettre au client. Lors de ces deux étapes, il va mémoriser les requêtes et les réponses associées. Ceci lui permettra lorsque qu’une même requête est demandée, de vous retourner la réponse sans la redemander au serveur. On économise donc du temps et des ressources.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/reverse_proxy.png"><img class="aligncenter  wp-image-728" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/reverse_proxy-300x148.png" alt="mémoire cache" width="300" height="148" /></a>

# 2)    Le Cache dans Symfony
Rentrons maintenant dans le vif du sujet. Symfony est équipé d’un reverse proxy défini par la classe AppCache.php qui se situe dans app/AppCache.php de votre projet.

Sa mise en place dans Symfony est relativement simple.

Il vous faut dans un premier temps modifier votre app_dev.php afin qu’il ressemble à ceci :

<pre class="lang:php mark:28,32 decode:true" title="web/app_dev.php">
{% raw %}
&lt;?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Debug\Debug;

// If you don't want to setup permissions the proper way, just uncomment the following PHP line

// read http://symfony.com/doc/current/book/installation.html#configuration-and-setup for more information

//umask(0000);
// This check prevents access to debug front controllers that are deployed by accident to production servers.

// Feel free to remove this, extend it, or make something more sophisticated.

if (isset($_SERVER['HTTP_CLIENT_IP'])
    || isset($_SERVER['HTTP_X_FORWARDED_FOR'])
    || !in_array(@$_SERVER['REMOTE_ADDR'], array('127.0.0.1', 'fe80::1', '::1'))
) {
    header('HTTP/1.0 403 Forbidden');
    exit('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
}

$loader = require_once __DIR__.'/../app/bootstrap.php.cache';

Debug::enable();

require_once __DIR__.'/../app/AppKernel.php';
require_once __DIR__.'/../app/AppCache.php';

$kernel = new AppKernel('dev', true);
$kernel-&gt;loadClassCache();
$kernel = new AppCache($kernel);
Request::enableHttpMethodParameterOverride();
$request = Request::createFromGlobals();
$response = $kernel-&gt;handle($request);
$response-&gt;send();
$kernel-&gt;terminate($request, $response);{% endraw %}
</pre>

Et c’est tout ? Eh ben oui, c’est pas plus compliqué que ça. Rajoutez votre dépendance à AppCache et instanciez là avec en paramètre votre kernel.

## 
## Exemple 1 : Utilisation simple
Maintenant, on va dans un premier temps créer un exemple sans activer le cache.

Pour le routing :

<pre class="lang:yaml decode:true" title="app/config/routing.yml">
{% raw %}
app/config/routing.yml :
    cache:
        resource: "@MyBundle/Resources/config/routing.yml"
        prefix:   /{% endraw %}
</pre>

&nbsp;

MyBundle/Ressources/config/routing.yml :

<pre class="lang:yaml decode:true" title="MyBundle/Resources/views/routing.yml">
{% raw %}
example:
    pattern:  /example
    defaults: { _controller: MyBundle:Example:cache}{% endraw %}
</pre>

&nbsp;

Voici pour le Controller :

<pre class="lang:php decode:true" title="MyBundle/Controller/ExampleController.php">
{% raw %}
&lt;?php

namespace MyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ExampleController extends Controller {
    public function cacheAction() {
        return $this-&gt;renderView('MyBundle:Cache:cache.html.twig', array('hello' =&gt; 'Hello World!!!'));
    }
}{% endraw %}
</pre>

&nbsp;

Enfin, votre template cache.html.twig situé dans MyBundle/Resources/views/Cache/cache.html.twig:

<pre class="lang:default decode:true" title="MyBundle/Resources/views/Cache/cache.html.twig">
{% raw %}
{% extends "@MyBundle/layout.html.twig" %}

{% block body %}

    &lt;h1&gt;{{ hello }}&lt;/h1&gt;

{% endblock %}{% endraw %}
</pre>

&nbsp;

Et voilà le résultat :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello1.png"><img class="aligncenter size-medium wp-image-732" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello1-300x182.png" alt="hello1" width="300" height="182" /></a>

Maintenant pour s’assurer que le cache est bien inactif, ouvrez firebug.

Allez dans l’onglet Réseau (ou Network pour ceux qu’ils l’ont en anglais),

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/firebug1.png"><img class="aligncenter  wp-image-754" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/firebug1-300x27.png" alt="firebug1" width="555" height="50" /></a>

&nbsp;

Et dépliez le get correspondant à votre route :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response1.png"><img class="aligncenter size-medium wp-image-735" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response1-300x208.png" alt="response1" width="300" height="208" /></a>

&nbsp;

On voit donc bien ici la valeur du Cache-Control qui est à no-cache.

Maintenant pour activer le cache, on va légèrement modifier notre Controller:

Commencez par rajouter votre dépendance à l’objet Response dans votre controller :

<pre class="lang:php decode:true">
{% raw %}
use Symfony\Component\HttpFoundation\Response;{% endraw %}
</pre>

&nbsp;

Modifiez maintenant votre action :

<pre class="lang:php decode:true">
{% raw %}
public function cacheAction() {
    $response = new Response();
    $response-&gt;setMaxAge(300);

    // Check that the Response is not modified for the given Request
    if (!$response-&gt;isNotModified($this-&gt;getRequest())) {
        $date = new \DateTime();
        $response-&gt;setLastModified($date);
        $response-&gt;setContent($this-&gt;renderView('MyBundle:Cache:cache.html.twig', array('hello' =&gt; 'Hello World!!!')));
        }

        return $response;
    }
}{% endraw %}
</pre>

&nbsp;

Voici une utilisation très simpliste du système de cache.

L’objet Response va nous permettre de manipuler les différents éléments d’information de l’en-tête Cache-Control. Ici, je me suis contenté de définir le temps de validité de la réponse mise en cache (ici 300 secondes). Au-delà de cette durée, la réponse va être régénérée par le serveur et sera  de nouveau valide durant 300 secondes. Si la réponse est encore valide, on la retourne directement sinon on régénère la réponse et on modifie sa date de modification.

Maintenant, si on jette à nouveau un œil à notre firebug :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response2.png"><img class="aligncenter size-medium wp-image-737" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response2-300x165.png" alt="response2" width="300" height="165" /></a>

&nbsp;

On constate que le système de cache est bien activé. Pour aller plus loin avec les différentes options possibles de l’en-tête, je vous invite fortement, si ce n’est pas déjà fait, à lire la doc sur le site officiel de <em><span style="color: #0000ff;"><a title="cache Symfony 2" href="http://symfony.com/fr/doc/master/book/http_cache.html" target="_blank"><span style="color: #0000ff;">Symfony</span></a></span></em>.

&nbsp;

Ok, tout ça c’est bien, mais cela met en cache une page entière. Mais votre besoin sera peut-être de ne mettre en page qu’une partie de la page.

Heureusement pour nous, Symfony a pensé à tout et nous fournit une solution, les « Edge Side Includes » (ESI).

&nbsp;

##  Exemple 2 : ESI
Pour activer le mode ESI dans Symfony, ouvrez votre app/config/config.yml et ajoutez ces deux lignes dans la partie framework :

<pre class="lang:yaml decode:true">
{% raw %}
framework:
    esi: true # Pour utiliser les tags ESI dans les templates Twig
    fragments:     { path: /_proxy }{% endraw %}
</pre>

&nbsp;

Maintenant créez un deuxième template. Moi je l’appellerai esi.html.twig et il contiendra simplement :

<pre class="lang:default decode:true">
{% raw %}
&lt;h2&gt;Partie en Cache&lt;/h2&gt;{% endraw %}
</pre>

&nbsp;

Modifiez le premier template :

<pre class="lang:default decode:true">
{% raw %}
{% extends "@ MyBundle/layout.html.twig" %}

{% block body %}

    &lt;h1&gt;{{ hello }}&lt;/h1&gt;

    {{ render_esi(controller(' MyBundle:Example:getEsiCache')) }}

{% endblock %}{% endraw %}
</pre>

&nbsp;

Et enfin votre controlleur :

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

namespace My\Bundle\TrainingBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class ExampleController extends Controller {

    public function cacheAction() {
        return $this-&gt;render('MyBundle:Cache:cache.html.twig',
            array('hello' =&gt; 'Hello World!!!'));
    }

    public function getEsiCacheAction(Request $request) {
        $response = new Response();
        $response-&gt;setSharedMaxAge(10);
        $response-&gt;setPublic();
        $response-&gt;setMaxAge(10);

        // Check that the Response is not modified for the given Request
        if (!$response-&gt;isNotModified($request)) {
            $date = new \DateTime();
            $response-&gt;setLastModified($date);
            $response-&gt;setContent($this-&gt;renderView('MyBundle:Cache:esi.html.twig'));
        }
        return $response;
    }
}{% endraw %}
</pre>

&nbsp;

J’ai ici simplifié l’action cacheAction() pour n’activer le cache que pour le fragment ESI.

Actualiser votre page et vous devez obtenir ceci :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello2.png"><img class="aligncenter size-medium wp-image-742" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/hello2-300x107.png" alt="hello2" width="300" height="107" /></a>

&nbsp;

Maintenant, si on repart voir ce que nous dit notre bon vieil ami firebug, on voit :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response3.png"><img class="aligncenter size-medium wp-image-743" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response3-300x93.png" alt="response3" width="300" height="93" /></a>

&nbsp;

Une ligne X-Symfony-Cache est apparu. Si on se concentre sur la fin de la ligne, on lit : «…EsiCache : stale, invalid, store ». En gros, le cache de ce fragment n’était pas valide (normal vu qu’on vient de le créer :) ). Mais si vous faite un petit F5, vous aurez le message suivant :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response4.png"><img class="aligncenter size-medium wp-image-744" src="http://blog.eleven-labs.com/wp-content/uploads/2013/12/response4-300x90.png" alt="response4" width="300" height="90" /></a>

&nbsp;

Aahhhh, ça a l’air d’être « fresh » :)

Je vous passe les explications mais vous aurez compris que le fragment en cache était valide et qu’il a pu être retourné directement.

Vous avez maintenant les bases pour voler de vos propres ailes et optimiser votre application.


