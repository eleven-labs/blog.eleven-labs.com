---
layout: post
lang: fr
date: '2014-08-04'
categories:
  - php
authors:
  - charles-eric
excerpt: >-
  Quand on exécute une suite de tests fonctionnels ou unitaires sur une
  application, le mieux est de ne pas changer l'état de la base de données. Cela
  permet ainsi d'exécuter ces tests plusieurs fois sur un état stable des
  données. Chaque test est ainsi isolé des autres.
title: Isolation des tests fonctionnels avec Symfony 2 et Doctrine
slug: isolation-des-tests-fonctionnels-avec-symfony-2-doctrine
oldCategoriesAndTags:
  - php
  - symfony
  - doctrine
  - symfony2
permalink: /fr/isolation-des-tests-fonctionnels-avec-symfony-2-doctrine/
---

Quand on exécute une suite de tests fonctionnels ou unitaires sur une application, le mieux est de ne pas changer l'état de la base de données. Cela permet ainsi d'exécuter ces tests plusieurs fois sur un état stable des données. Chaque test est ainsi isolé des autres.

**Contexte : isolation grâce à un rollback de la base de données :**

Comme indiqué dans un [article précédent](https://blog.eleven-labs.com/fr/test-unitaire-dun-bundle-symfony2/ "Test unitaire d’un bundle Symfony 2") et [décrit par Alexandre Salomé](http://alexandre-salome.fr/blog/Symfony2-Isolation-Of-Tests "Isolation of tests in Symfony2"){:rel="nofollow noreferrer"}, il est possible de mettre en place un système de rollback pour rétablir l'état initial des données après l’exécution de chaque test.

Cela repose sur cette classe que vos tests fonctionnels PHPUnit devront étendre et qui déclenche le système d'isolation, avant et après chaque cas de tests grâce aux méthodes *setUp* et *tearDown* :

```php
<?php

namespace Cheric\ExampleBundle\Test;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseWebTestCase;

class IsolatedWebTestCase extends BaseWebTestCase
{
    protected $client;

    public function setUp()
    {
        parent::setUp();

        $this->client = self::createClient();

        $this->client->startIsolation();
    }

    public function tearDown()
    {
        if (null !== $this->client) {
            $this->client->stopIsolation();
        }

        parent::tearDown();
    }
}
```

Ce *Test Case* utilise le *Test Client* suivant, il est capable de déclencher un rollback en base de données :

```php
<?php

namespace Cheric\ExampleBundle\Test;

use Symfony\Bundle\FrameworkBundle\Client as BaseClient;
use Symfony\Component\HttpFoundation\Request;

/**
 * Test client.
 */
class Client extends BaseClient
{
    /**
     * The current DBAL connection.
     */
    protected $connection;

    /**
     * Was this client already requested?
     */
    protected $requested = false;

    /**
     * @param Request $request
     *
     * @return Request
     */
    protected function doRequest($request)
    {
        if (true === $this->requested) {
            $this->kernel->shutdown();
            $this->kernel->boot();
        }

        $this->startIsolation();
        $this->requested = true;

        return $this->kernel->handle($request);
    }

    /**
     * Starts the isolation process of the client.
     */
    public function startIsolation()
    {
        if (null === $this->connection) {
            $this->connection = $this->getContainer()
                ->get('doctrine.dbal.default_connection');
        } else {
            $this->getContainer()
                ->set('doctrine.dbal.default_connection', $this->connection);
        }

        if (false === $this->requested) {
            $this->connection->beginTransaction();
        }
    }

    /**
     * Stops the isolation process of the client.
     */
    public function stopIsolation()
    {
        if (null !== $this->connection) {
            if ($this->connection->isTransactionActive()) {
                $this->connection->rollback();
            }

            $this->connection->close();
        }

        $this->connection = null;
    }

    /**
     * Connect a user
     *
     * @param string  $username    The username
     * @param string  $password The password
     *
     * @return Crawler
     */
    public function connect($username, $password = '11labs')
    {
        $this->followRedirects(true);

        $crawler = $this->request('GET', '/logout');
        $crawler = $this->request(
            'POST',
            '/login_check',
            array(
                '_username' => $username,
                '_password' => $password
            )
        );

        $this->followRedirects(false);

        return $this->crawler;
    }
}
```

Cela fonctionne très bien sauf dans les cas où vous souhaitez tester des *Events Listeners Doctrine* dans vos tests fonctionnels, dans lesquels vous effectuez plusieurs requêtes (pour connecter l'utilisateur avant votre action par exemple). Nous allons donc d'abord constater l'erreur dans ce cas là avant de voir comment l'éviter.

**Problème : quand on utilise des *Listeners* Doctrine :**

Imaginons par exemple que vous ayez besoin d'exécuter une stratégie particulière pour changer un attribut de votre entité Doctrine juste après sa création, i.e. lors de l'event postPersit et/ou postUpdate. Vous mettriez alors en place ce [listener](http://symfony.com/doc/current/cookbook/doctrine/event_listeners_subscribers.html "How to Register Event Listeners and Subscribers"){:rel="nofollow noreferrer"} :

```php
<?php

namespace Cheric\ExampleBundle\Doctrine\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Cheric\ExampleBundle\Entity\Article;
use Cheric\ExampleBundle\Strategy\PriceStrategy;

class ArticleListener
{
    private $priceStrategy;

    public function __construct(PriceStrategy $priceStrategy)
    {
        $this->priceStrategy = $priceStrategy;
    }

    public function postPersist(LifecycleEventArgs $args)
    {
        $article = $args->getEntity();

        if (!$article instanceof Article) {
            return;
        }

        $this->execute($article);
    }

    private function execute(Article $article)
    {
        $this->priceStrategy->execute($article);
    }

    public function postUpdate(LifecycleEventArgs $args)
    {
        $article = $args->getEntity();

        if (!$article instanceof Article) {
            return;
        }

        $this->execute($article);
    }
}
```

qui fait appel à la *Strategy* suivante (sans intérêt fonctionnel je vous l'accorde, mais je vous laisse imaginer le service qui répondra à vos besoins et fera appel à différents Web Services ou base de données pour trouver le prix unitaire de notre article) :

```php
<?php

namespace Cheric\ExampleBundle\Strategy;

use Doctrine\Bundle\DoctrineBundle\Registry;
use Cheric\ExampleBundle\Entity\Article;

/**
 * Useless strategy that sets the price to 42.
 * We can easily imagine another strategy
 * that gets this price from the database.
 */
class PriceStrategy
{
    private $doctrine;

    public function __construct(Registry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function execute(Article $article)
    {
        $article->setPrice(42);

        $this->doctrine->getManager()->flush($article);
    }
}
```

Et vous voudriez ensuite tester cela fonctionnellement :

```php
<?php

namespace Cheric\ExampleBundle\Tests\Controller;

use Cheric\ExampleBundle\Test\IsolatedWebTestCase;

class ArticleControllerTest extends IsolatedWebTestCase
{
    public function testCreate()
    {
        $this->client->connect('admin');
        $this->client->request('POST', '/secured/article', array('quantity' => 42));

        $responseContent = $this->client->getResponse()->getContent();
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertNotEmpty($responseContent);

        $em = $this->client->getContainer()->get('doctrine')->getManager();

        $article = $em->getRepository('ChericExampleBundle:Article')->find($responseContent);
        $this->assertEquals(42, $article->getQuantity());
        $this->assertEquals(42, $article->getPrice());
    }

    public function testUpdate()
    {
        $em = $this->client->getContainer()->get('doctrine')->getManager();

        $article = $em->getRepository('ChericExampleBundle:Article')->find(1);
        $this->assertEquals(1, $article->getQuantity());
        $this->assertEquals(1, $article->getPrice());

        $this->client->connect('admin');
        $this->client->request('PUT', '/secured/article/1', array('quantity' => 42));
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $em->refresh($article);
        $this->assertEquals(42, $article->getQuantity());
        $this->assertEquals(42, $article->getPrice());
    }
}
```

Ce test fonctionnel vérifie simplement que les données postées (quantity = 42) sont bien settées dans l'entité par le [controller](https://github.com/ch3ric/BlogTestsIsolation/blob/master/src/Cheric/ExampleBundle/Controller/ArticleController.php "ArticleController"){:rel="nofollow noreferrer"}, et que le prix est ensuite renseigné lors du passage dans notre *ArticleListener* avant la sauvegarde en base de données.

Et là, surprise lors de l’exécution de PHPUnit :

```sh
Failed asserting that 500 matches expected 200.
```

associée à l'erreur `InvalidArgumentException: Entity has to be managed or scheduled for removal for single computation` visible dans les logs...

Et pourtant si l'on exécute ce code, sans utiliser nos tests fonctionnels, via de simples appels curl par exemple (1 premier pour se logguer et un deuxième en POST ou PUT pour mettre à jour notre entité, en utilisant le token d'authentification retourné lors du login), on constate que cela fonctionne très bien : l'entité est bien modifiée ou créée en base de données.

Le problème vient donc de notre façon de tester, et très probablement de la façon d'isoler les tests.

**La solution :**

En analysant notre *IsolatedWebTestCase* et notre *Test Client*, on constate que la *DBAL Connection* initialisée lors de la première requête de login est ensuite réutilisée dans la requête de l'action suivante, dans la méthode *startIsolation*. Ce premier indice permet de dire que la *Connection* initialisée lors de la première requête ne sait pas gérer correctement ce qui lui est demandé lors de la deuxième requête.

Deuxième indice : la stack trace de l'exception dit que l'erreur est levée lors de l'appel `$this->doctrine->getManager()->flush($article);` dans notre *PriceStrategy*, déclenché par notre *ArticleListener*. Autrement dit, l'instance du *Doctrine Registry* injectée dans la *PriceStrategy* et l'*Entity Manager* lié n'ont pas connaissance de l'état de l'entité Article qu'ils doivent flusher : "*Entity has to be managed*".

De plus, en regardant d'un peu plus près la [DBAL Connection de Doctrine](Doctrine\DBAL\Connection "https://github.com/doctrine/dbal/blob/master/lib/Doctrine/DBAL/Connection.php#L107"), on remarque une propriété [EventManager](https://github.com/doctrine/common/blob/master/lib/Doctrine/Common/EventManager.php "Doctrine\Common\EventManager"){:rel="nofollow noreferrer"} qui gère les *Events* et *Listeners* Doctrine, dont notre *ArticleListener*.

Finalement, on en déduit que l'*Event Manager* de la *DBAL Connection* de notre deuxième requête doit être conservé tel quel, pour gérer correctement l'enregistrement de l'entité après passage dans le listener. Pour permettre le rollback et l'isolation de nos tests, on ne souhaite conserver que l'état de la *Connection*, qui a lancé la requête SQL "*START TRANSACTION"*, sans pour autant conserver l'*Event Manager* de la première requête, qui semble poser problème.

La [solution](https://github.com/ch3ric/BlogTestsIsolation/commit/2038a61e723f3091b7dd935cf3da9f3cc57651e1 "Commit Solution"){:rel="nofollow noreferrer"} consiste donc simplement à setter le bon *Event Manager* dans la *Connection* conservée entre chaque requête de test, lors de l'appel à la méthode *startIsolation*. Cela passe par une extension de la classe *DBAL Connection* dans laquelle on ajoute un setter *setEventManager* :

```php
<?php

namespace Cheric\ExampleBundle\Doctrine\DBAL;

use Doctrine\DBAL\Connection as BaseConnection;
use Doctrine\Common\EventManager;

/**
 * Extends Doctrine DBAL connection
 * to add the ability to change the event manager.
 * Used for tests only.
 */
class Connection extends BaseConnection
{
    /**
     * @param EventManager $eventManager
     */
    public function setEventManager(EventManager $eventManager)
    {
        $this->_eventManager = $eventManager;
        $this->_platform->setEventManager($eventManager);
    }
}
```

Et dans notre *Test Client*, on set le bon *EventManager* dans la *Connection* conservée entre chaque test :

```php
<?php

namespace Cheric\ExampleBundle\Test;

use Symfony\Bundle\FrameworkBundle\Client as BaseClient;

class Client extends BaseClient
{
    // ...

    public function startIsolation()
    {
        if (null === $this->connection) {
            $this->connection = $this->getContainer()->get('doctrine.dbal.default_connection');
        } else {
            $this->connection->setEventManager(
                $this->getContainer()->get('doctrine.dbal.default_connection')->getEventManager()
            );
            $this->getContainer()->set('doctrine.dbal.default_connection', $this->connection);
        }

        if (false === $this->requested) {
            $this->connection->beginTransaction();
        }
    }

    // ...
}
```

Voir commit complet [ici : sur github](https://github.com/ch3ric/BlogTestsIsolation/commit/2038a61e723f3091b7dd935cf3da9f3cc57651e1#diff-d618fa2c315d1d7b933528805e889d00R55 "Commit Solution"){:rel="nofollow noreferrer"}.

Le code complet permettant l'analyse de ce problème d'isolation et la solution sont disponibles ici : [github.com/ch3ric/BlogTestsIsolation](https://github.com/ch3ric/BlogTestsIsolation "github.com/ch3ric/BlogTestsIsolation"){:rel="nofollow noreferrer"}

Je ne pense pas être le seul à avoir rencontré ce problème avec les tests de listeners Doctrine et j'espère donc que cette astuce pourra vous permettre de tester fonctionnellement vos listeners plus proprement.

Intergalactiquement vôtre et à bientôt !!

NB : je me suis concentré ici sur la recherche d'une solution à mon problème d'isolation bien précis, sans pour autant pousser l'analyse du comportement de Doctrine et plus spécifiquement de son *Event Manager*. Si certains ont fait cette analyse, je suis intéressé :) !
