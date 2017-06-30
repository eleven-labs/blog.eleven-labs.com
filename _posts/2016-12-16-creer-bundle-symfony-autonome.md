---
layout: post
title: Créer un bundle Symfony autonome
excerpt: Dans ce post nous allons voir step-by-step comment créer de zéro un bundle symfony autonome.
authors: 
    - VEBERArnaud
permalink: /fr/creer-bundle-symfony-autonome/
categories:
    - PHP
    - Symfony
tags:
    - PHP
    - Symfony
    - tutorial
---
Dans ce post nous allons voir step-by-step comment créer de zéro un bundle symfony autonome.
Ce bundle n'aura aucune responsabilité fonctionnelle, il servira simplement à dérouler les étapes de création d'un
bundle autonome.

---

### Les étapes
* [Bootstrap du projet](#bootstrap-du-projet)
* [Bundle minimal](#bundle-minimal)
* [Application embarquée](#application-embarquée)
* [Utilisation autonome](#utilisation-autonome)
  * [Application console](#application-console)
  * [Application web](#application-web)
* [Tests](#tests)
  * [Tests unitaires](#tests-unitaires)
  * [Tests fonctionnels](#tests-fonctionnels)
* [Conclusion](#conclusion)

---

## Bootstrap du projet

Commençons par créer un fichier composer.json pour notre projet.

```json
{
    "name": "acme/standalone-bundle",
    "description": "acme standalone bundle",
    "type": "bundle",
    "require": {}
}
```

Afin d'optimiser les performances en production, nous séparons les sources et les tests.
Reprenons notre composer.json et ajoutons-y ces règles d'autoload.

```json
{
    "name": "acme/standalone-bundle",
    "description": "acme standalone bundle",
    "type": "bundle",
    "require": {},
    "autoload": {
        "psr-4": {
            "Acme\StandaloneBundle\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Acme\StandaloneBundle\Tests\": "tests/"
        }
    }
}
```

Lançons un composer install afin d'initialiser le projet.

```bash
composer install
```

Composer crée un dossier vendor que nous ne souhaitons pas versionner.
Pour indiquer à git que ce dossier doit être ignoré, il faut créer le fichier `.gitignore` à la racine du projet et y
ajouter le path vers le dossier à ignorer.

```ini
# .gitingore

/vendor
```

## Bundle minimal

Pour créer notre bundle minimal, nous devons créer la classe `\Acme\StandaloneBundle\StandaloneBundle` qui étend
`\Symfony\Component\HttpKernel\Bundle\Bundle`.

```php
<?php
// src/StandaloneBundle.php

namespace Acme\StandaloneBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class StandaloneBundle extends bundle
{
}
```

La classe parente est disponible dans le composant `symfony/http-kernel`, ajoutons cette dépendance à notre projet avec
composer.

```bash
composer require "symfony/http-kernel:3.1.*"
```

Notre bundle minimal est maintenant prêt, il peut être register dans une application Symfony.

## Application embarquée

Afin d'être sûr que notre bundle fonctionne comme attendu au sein d'une application symfony, nous allons embarquer une
application minimale dans notre projet.

Dans le kernel de cette application embarquée, nous allons surcharger les méthodes
* registerBundles: pour y register notre bundle
* registerContainerConfiguration: pour définir l'emplacement de notre fichier de configuration

```php
<?php
// tests/App/AppKernel.php

namespace Acme\StandaloneBundle\Tests\App;

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        return [
            new \Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new \Acme\StandaloneBundle\StandaloneBundle(),
        ];
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load(__DIR__.'/config/config.yml');
    }
}
```

On en profite pour ajouter en dépendance de dev le composant `symfony/framework-bundle`

```bash
composer require --dev "symfony/framework-bundle:3.1.*"
```

Le composant FrameworkBundle requiert au minimum la configuration d'un secret, que nous ajoutons au fichier
tests/App/config/config.yml

```yaml
# tests/App/config/config.yml

# FrameworkBundle Configuration
framework:
secret: This is a secret, change me
```

Pour que ce fichier de configuration en yaml puisse être chargé par le kernel, nous devons ajouter en dépendance de dev
le composant `symfony/yaml`.

```bash
composer require --dev "symfony/yaml"
```

Au boot, le kernel crée un dossier de cache et un dossier de logs que l'on ne souhaite pas versionner.
On ajoute alors ces dossiers au `.gitignore`

```ini
# .gitingore

/vendor
/tests/App/cache
/tests/App/logs
```

## Utilisation autonome

### Application console

Pour pouvoir créer dans notre bundle autonome des commandes symfony, nous devons dans un premier temps ajouter en
dépendance de dev le composant symfony/console puis ajouter à notre application minimale le script console.

```bash
composer require --dev "symfony/console:3.1.*"
```

```php
<?php
// tests/App/console

namespace Acme\StandaloneBundle\Tests\App;

require_once __DIR__ . '/../../vendor/autoload.php';

use Symfony\Bundle\FrameworkBundle\Console\Application;

$kernel = new AppKernel('dev', true);
$application = new Application($kernel);
$application->run();
```

Nous pouvons maintenant lancer des commandes en utilisant la console.

```bash
php tests/App/console
```

### Application web

Maintenant que nous pouvant lancer des commandes, intéressons-nous au web.
Afin de pouvoir appeler un contrôleur, nous devons ajouter à notre application minimale un frontal web.

```php
<?php
// tests/App/app_dev.php

namespace Acme\StandaloneBundle\Tests\App;

require_once __DIR__ . '/../../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$kernel = new AppKernel('dev', true);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
```

Ajoutons un contrôleur et la configuration du routing afin de pouvoir tester notre frontal web.

```php
<?php
// src/Controller/FooController.php

namespace Acme\StandaloneBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class FooController extends Controller
{
    public function barAction()
    {
        return new JsonResponse(['foo' => 'bar']);
    }
}
```

```yaml
# src/Resources/config/routing.yml

standalone_foobar:
    path: /
    defaults:
    _controller: StandaloneBundle:Foo:bar
```

```yaml
# tests/App/config/routing.yml

_main:
    resource: ../../../src/Resources/config/routing.yml
```

```yaml
# tests/App/config/config.yml

# FrameworkBundle Configuration
framework:
    secret: This is a secret, change me
    router:
        resource: '%kernel.root_dir%/config/routing.yml'
        strict_requirements: ~
```

Maintenant que nous avons un frontal web disponible dans notre projet, voyons comment lancer un serveur web très simple
qui dirige directement vers celui-ci.

Pour commencer ajoutons le composant symfony/process.

```bash
composer require --dev "symfony/process:3.1.*"
```

L'ajout de ce composant nous permet d'utiliser le serveur web interne de php.

```bash
php tests/App/console server:run -d tests/App
```

Ouvrez votre navigateur vers [](http://127.0.0.1:8000/), le json `{"foo": "bar"}` doit s'afficher.
Vous avez maintenant un bundle capable de recevoir des requêtes HTTP et d'y répondre sans avoir besoin de configurer un
serveur web pour le développement.

## Tests

### Tests unitaires

Pour exécuter les tests unitaires sur notre projet, nous allons utiliser la librairie phpunit.

Ajoutons cette dépendance de dev

```bash
composer require --dev "phpunit/phpunit"
```

Ajoutons le fichier de configuration phpunit dans notre projet.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!-- phpunit.xml -->

<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="http://schema.phpunit.de/4.3/phpunit.xsd"
    backupGlobals="false"
    colors="true"
    bootstrap="./vendor/autoload.php"
    >

    <php>
        <server name="KERNEL_DIR" value="./tests/App/" />
    </php>

    <testsuites>
        <testsuite name="StandaloneBundle Suite">
            <directory suffix="Test.php">./tests/</directory>
        </testsuite>
    </testsuites>

    <filter>
        <whitelist processUncoveredFilesFromWhitelist="true">
            <directory suffix=".php">./src/</directory>
        </whitelist>
    </filter>

    <logging>
        <log type="coverage-clover" target="build/logs/clover.xml"/>
        <log type="coverage-html" target="build/coverage" />
    </logging>
</phpunit>
```

Ajoutons un test unitaire pour tester notre configuration.

```php
<?php
// tests/Unit/Controller/FooControllerTest.php

namespace Acme\StandaloneBundle\Tests\Unit\Controller;

use Acme\StandaloneBundle\Controller\FooController;
use Symfony\Component\HttpFoundation\JsonResponse;

class FooControllerTest extends \PHPUnit_Framework_TestCase
{
    private $controller = null;

    protected function setUp()
    {
        $this->controller = new FooController();
    }

    protected function tearDown()
    {
        $this->controller = null;
    }

    public function testBarAction()
    {
        $this->assertInstanceOf(JsonResponse::class, $this->controller->barAction());
    }
}
```

On lance ensuite la suite de test, qui nous affiche qu'un test et une assertion ont été exécutés sans problèmes.

```bash
./vendor/bin/phpunit
```

### Tests fonctionnels

Pour lancer les tests fonctionnels, nous allons encore une fois utiliser la librairie phpunit.

Commençons par ajouter le composant symfony/brower-kit, puis nous étendrons le WebTestCase symfony pour override la
méthode getKernelClass afin renvoyer le bon FQCN de notre Kernel embarqué, puis nous rajouterons de la configuration au
framework bundle.

```bash
composer require "symfony/browser-kit:3.1.*"
```

```php
<?php
// tests/WebTestCase.php

namespace Acme\StandaloneBundle\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseWebTestCase;

abstract class WebTestCase extends BaseWebTestCase
{
    protected static function getKernelClass()
    {
        return 'Acme\StandaloneBundle\Tests\App\AppKernel';
    }
}
```

```yaml
# tests/App/config/config.yml

# FrameworkBundle Configuration
framework:
    secret: This is a secret, change me
    router:
        resource: '%kernel.root_dir%/config/routing.yml'
        strict_requirements: ~
    test: ~
```

Nous allons maintenant utiliser ce WebTestCase pour créer un client et parcourir les pages web de notre projet.

```php
<?php
// tests/Functional/Controller/FooControllerTest.php

namespace Acme\StandaloneBundle\Tests\Functional\Controller;

use Acme\StandaloneBundle\Tests\WebTestCase;

class FooControllerTest extends WebTestCase
{
    private $client = null;

    private $container = null;

    public function setUp()
    {
        $this->client = static::createClient();
        $this->container = $this->client->getContainer();
    }

    public function tearDown()
    {
        $this->client = null;
        $this->container = null;
    }

    public function testBarAction()
    {
        $this->client->request('GET', '/');

        $this->assertTrue($this->client->getResponse()->isSuccessful());
    }
}
```

Nous pouvons maintenant relancer les tests

```bash
./vendor/bin/phpunit
```

Nous avons maintenant deux tests et deux assertions en succès.

## Conclusion

En quelques étapes nous avons un bundle symfony autonome.
Un bundle qui est capable de lancer ses propres tests unitaires et fonctionnels mais également de faire tourner son
propre serveur web, très utile pour le développement.

J'espère que ce post vous aura donné l'envie de développer des bundles autonomes.
N'hésitez pas à poser des questions dans les commentaires, et à me dire si vous voulez que je continue sur le sujet en
expliquant comment rajouter des composants (twig, web-profiler, ...), comment faire de votre bundle autonome un projet
open-source distribué via packagist aux quatre coins du monde.
