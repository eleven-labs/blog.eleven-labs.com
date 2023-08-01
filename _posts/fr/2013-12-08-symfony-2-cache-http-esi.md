---
lang: fr
date: '2013-12-08'
slug: symfony-2-cache-http-esi
title: 'Symfony 2 : Cache HTTP  et ESI'
excerpt: >-
  Voici un petit tuto orienté performance avec l'utilisation du cache dans
  Symfony. On y abordera aussi l'utilisation des ESI pour mettre en cache une
  partie de la page.
authors:
  - cmoncade
categories:
  - php
keywords:
  - symfony
  - symfony2
  - cache
  - esi
---
Lorsque l’on développe un site, en particulier un site à fort trafic, on est forcément amené à se poser la question des ressources consommées par ce dernier afin d’optimiser son temps de réponse. En effet, une page qui met plus de 3-4 secondes à s’afficher rend vite désagréable la navigation et découragera plus d’une personne à venir sur votre site.

# 1) Principe du cache HTTP

Le système de cache de Symfony vous permettra de diminuer les temps de réponses de vos pages en utilisant la puissance du cache HTTP tel qu'il est défini dans la <a href="https://fr.wikipedia.org/wiki/Hypertext_Transfer_Protocol" rel="nofollow noreferrer" style="color:#0000ff;">spécification HTTP</a>. Sachez cependant que ce n’est qu’une des solutions possibles.

Pour augmenter la vitesse d'une application, on peut par exemple:
- optimiser l’utilisation de la base de données. Gérer l’espace alloué à la mémoire tampon pour accélérer l’accès aux données les plus souvent demandées, développer des vues et des procédures pour alléger votre serveur par exemple.
- Utiliser la mise en cache des <a href="http://php.net/manual/fr/book.opcache.php" rel="nofollow noreferrer" style="color:#0000ff;">OPCodes</a> si vous êtes admin de votre serveur. Pour résumer grossièrement, l’OPCode est le code intermédiaire lors de la transformation de votre code (HTML, PHP …) en code binaire compréhensible par la machine. On trouvera parmi les plus connus APC, XCache ou encore EAccelerator.

Pour revenir au cache http, expliquons en un peu le principe. Le rôle de la mémoire cache (ou reverse proxy) est d’accepter les requêtes coté client et de les transmettre au serveur. Il va ensuite recevoir les réponses et les transmettre au client. Lors de ces deux étapes, il va mémoriser les requêtes et les réponses associées. Ceci lui permettra lorsque qu’une même requête est demandée, de vous retourner la réponse sans la redemander au serveur. On économise donc du temps et des ressources.


<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/reverse_proxy.png)](/assets/2013-12-08-symfony-2-cache-http-esi/reverse_proxy.png)


# 2) Le Cache dans Symfony

Rentrons maintenant dans le vif du sujet. Symfony est équipé d’un reverse proxy défini par la classe AppCache.php qui se situe dans app/AppCache.php de votre projet.

Sa mise en place dans Symfony est relativement simple.

Il vous faut dans un premier temps modifier votre app_dev.php afin qu’il ressemble à ceci :

```php
<?php

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
$kernel->loadClassCache();
$kernel = new AppCache($kernel);
Request::enableHttpMethodParameterOverride();
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
```

Et c’est tout? Eh ben oui, c’est pas plus compliqué que ça. Rajoutez votre dépendance à AppCache et instanciez là avec en paramètre votre kernel.

## Exemple 1 : Utilisation simple

Maintenant, on va dans un premier temps créer un exemple sans activer le cache.

Pour le routing:
```yaml
#app/config/routing.yml
cache:
    resource: "@MyBundle/Resources/config/routing.yml"
    prefix:   /
```

MyBundle/Ressources/config/routing.yml:
```yaml
example:
    pattern:  /example
    defaults: { _controller: MyBundle:Example:cache}
```

Voici pour le Controller:
```php
<?php

namespace MyBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ExampleController extends Controller {
    public function cacheAction() {
        return $this->renderView('MyBundle:Cache:cache.html.twig', array('hello' => 'Hello World!!!'));
    }
}
```

Enfin, votre template cache.html.twig situé dans MyBundle/Resources/views/Cache/cache.html.twig:
```
{% extends "@MyBundle/layout.html.twig" %}

{% block body %}

    <h1>{{ hello }}</h1>

{% endblock %}
```

Et voilà le résultat:

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/hello1.png)](/assets/2013-12-08-symfony-2-cache-http-esi/hello1.png)

Maintenant pour s’assurer que le cache est bien inactif, ouvrez firebug.

Allez dans l’onglet Réseau (ou Network pour ceux qu’ils l’ont en anglais),

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/firebug1.png)](/assets/2013-12-08-symfony-2-cache-http-esi/firebug1.png)

Et dépliez le get correspondant à votre route:

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/response1.png)](/assets/2013-12-08-symfony-2-cache-http-esi/response1.png)

On voit donc bien ici la valeur du Cache-Control qui est à no-cache.

Maintenant pour activer le cache, on va légèrement modifier notre Controller.
Commencez par rajouter votre dépendance à l’objet Response dans votre controller:
```php
use Symfony\Component\HttpFoundation\Response;
```

Modifiez maintenant votre action:
```php
public function cacheAction() {
    $response = new Response();
    $response->setMaxAge(300);

    // Check that the Response is not modified for the given Request
    if (!$response->isNotModified($this->getRequest())) {
        $date = new \DateTime();
        $response->setLastModified($date);
        $response->setContent($this->renderView('MyBundle:Cache:cache.html.twig', array('hello' => 'Hello World!!!')));
        }

        return $response;
    }
}
```

Voici une utilisation très simpliste du système de cache.

L’objet Response va nous permettre de manipuler les différents éléments d’information de l’en-tête Cache-Control. Ici, je me suis contenté de définir le temps de validité de la réponse mise en cache (ici 300 secondes). Au-delà de cette durée, la réponse va être régénérée par le serveur et sera de nouveau valide durant 300 secondes. Si la réponse est encore valide, on la retourne directement sinon on régénère la réponse et on modifie sa date de modification.

Maintenant, si on jette à nouveau un œil à notre firebug:

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/response2.png)](/assets/2013-12-08-symfony-2-cache-http-esi/response2.png)

On constate que le système de cache est bien activé. Pour aller plus loin avec les différentes options possibles de l’en-tête, je vous invite fortement, si ce n’est pas déjà fait, à lire la doc sur le site officiel de <a href="http://symfony.com/doc/master/http_cache.html" rel="nofollow noreferrer" style="color:#0000ff;">Symfony</a>.

Ok, tout ça c’est bien, mais cela met en cache une page entière. Mais votre besoin sera peut-être de ne mettre en page qu’une partie de la page.
Heureusement pour nous, Symfony a pensé à tout et nous fournit une solution, les «Edge Side Includes» (ESI).

## Exemple 2 : ESI

Pour activer le mode ESI dans Symfony, ouvrez votre app/config/config.yml et ajoutez ces deux lignes dans la partie framework :
```yaml
framework:
    esi: { enabled: true }
```

Maintenant créez un deuxième template. Moi je l’appellerai esi.html.twig et il contiendra simplement:
```html
<h2>Partie en Cache</h2>
```

Modifiez le premier template:
```
{% extends "@ MyBundle/layout.html.twig" %}

{% block body %}

    <h1>{{ hello }}</h1>

    {{ render_esi(controller(' MyBundle:Example:getEsiCache')) }}

{% endblock %}
```

Et enfin votre controlleur:
```php
<?php

namespace My\Bundle\TrainingBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class ExampleController extends Controller {

    public function cacheAction() {
        return $this->render('MyBundle:Cache:cache.html.twig',
            array('hello' => 'Hello World!!!'));
    }

    public function getEsiCacheAction(Request $request) {
        $response = new Response();
        $response->setSharedMaxAge(10);
        $response->setPublic();
        $response->setMaxAge(10);

        // Check that the Response is not modified for the given Request
        if (!$response->isNotModified($request)) {
            $date = new \DateTime();
            $response->setLastModified($date);
            $response->setContent($this->renderView('MyBundle:Cache:esi.html.twig'));
        }
        return $response;
    }
}
```

J’ai ici simplifié l’action cacheAction() pour n’activer le cache que pour le fragment ESI.

Actualiser votre page et vous devez obtenir ceci:

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/hello2.png)](/assets/2013-12-08-symfony-2-cache-http-esi/hello2.png)

Maintenant, si on repart voir ce que nous dit notre bon vieil ami firebug, on voit:

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/response3.png)](/assets/2013-12-08-symfony-2-cache-http-esi/response3.png)

Une ligne X-Symfony-Cache est apparu. Si on se concentre sur la fin de la ligne, on lit: «…EsiCache: stale, invalid, store». En gros, le cache de ce fragment n’était pas valide (normal vu qu’on vient de le créer :) ). Mais si vous faite un petit F5, vous aurez le message suivant:

<br/>
[![mémoire cache](/assets/2013-12-08-symfony-2-cache-http-esi/response4.png)](/assets/2013-12-08-symfony-2-cache-http-esi/response4.png)

Aahhhh, ça a l’air d’être «fresh» :)

Je vous passe les explications mais vous aurez compris que le fragment en cache était valide et qu’il a pu être retourné directement.

Vous avez maintenant les bases pour voler de vos propres ailes et optimiser votre application.
