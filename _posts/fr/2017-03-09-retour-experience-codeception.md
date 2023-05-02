---
lang: fr
date: '2017-03-09'
slug: retour-experience-codeception
title: 'Codeception, Retour d''expérience'
excerpt: >-
  Retour d'expérience sur le framework de test Codeception, présentation et
  exemples d'implémentations dans une application Symfony
authors:
  - nkania
categories:
  - php
keywords:
  - symfony
  - mongodb
  - rabbitmq
  - test
  - api
---

![Logo Codeception](/_assets/posts/2017-03-09-retour-experience-codeception/codeception-logo.png)

Dans cet article je vous propose un retour d'expérience sur le framework de test Codeception, outil choisi par mon équipe au sein de France Télévisions lors de la refonte de notre stack !

- Contexte
- Présentation
- Notre utilisation

Contexte
--------

**Un peu de FitNesse..**

Quand je suis arrivé dans l'équipe, une refonte d'une partie de notre SI était en cours. Des tests fonctionnels (en plus des unitaires bien entendu) étaient donc une obligation (refonte oblige). Le choix de l'époque s'était porté sur FitNesse ([http://fitnesse.org/](http://fitnesse.org/)) un outil qui permet d'écrire des tests de manière "human friendly". Le but était donc de laisser le PO écrire les tests fonctionnels. L'équipe technique quant à elle n'avait qu'à écrire les fixtures derrière.

Ce choix aurait pu être une bonne idée si dans la réalité des choses le PO avait réellement écrit les tests techniques. En réalité, l'équipe technique se retrouvait à écrire à la fois les tests techniques et fonctionnels. On devait donc utiliser un outil peu intuitif pour un dev (pas d'autocomplétion, utilisation abusive des tableaux...) et écrire les fixtures qui permettaient à ces tests d'interagir avec notre code.

Dans le cadre de la refonte d'une autre partie de notre SI nous avons donc décidé de changer d'outil de test fonctionnel, afin de choisir un outil plus adapté aux devs (le fait que les devs aient à réaliser les tests fonctionnels étant acté).

**Pas de déception avec Codeception**

Nous avons cherché ce qui se faisait dans le domaine du test fonctionnel. Nos critères étaient d'avoir un outil qui n'est pas forcément "human friendly" mais qui ne constitue pas une difficulté pour les devs (PHP en l'occurence). On a de fait écarté tous les outils dans un langage tierce, à cause du temps d'apprentissage.

On a fini par découvrir Codeception ([http://codeception.com/](http://codeception.com/)) qui est une solution de test écrit en PHP et qui possède beaucoup de modules (AMQP, Doctrine2, Filesystem, MongoDb, REST, Symfony,...){:rel="nofollow noreferrer"}.

Présentation
--------

Codeception permet de couvrir votre application entièrement, en effet ils intègrent tout type de tests :

- Acceptance [http://codeception.com/docs/03-AcceptanceTests](http://codeception.com/docs/03-AcceptanceTests){:rel="nofollow noreferrer"}
- Functional [http://codeception.com/docs/04-FunctionalTests](http://codeception.com/docs/04-FunctionalTests){:rel="nofollow noreferrer"}
- Unit [http://codeception.com/docs/05-UnitTests](http://codeception.com/docs/05-UnitTests){:rel="nofollow noreferrer"}

**Les tests unitaires **

Concernant les tests unitaires, il se base sur Phpunit (donc pas besoin de tout réapprendre, ne vous inquiétez pas), ils ajoutent juste une couche d'abstraction qui vous fournit quelques outils supplémentaires (notamment l'accès aux modules).

**Les tests fonctionnels**

Ici, ce sont les tests fonctionnels qui nous intéressent le plus. Notre équipe n'a pas de front (nous ne fournissons qu'une API). Ils vont nous permettre de la tester de manière complète (nous en discuterons dans la prochaine partie).

**Les tests d'acceptances**

Finalement, pour les tests d'acceptances, plusieurs solutions sont proposées : PHP Browser, un simple crawler qui utilise Guzzle, ou Selenium (PhantomJS est possible aussi). Ces solutions permettent donc toutes de tester votre front.

**Le BDD**

Vous pouvez aussi si vous le souhaitez faire du Behavior Driven Development en utilisant Gherkin. Si vous utilisez déjà Behat, vous pouvez aussi migrer vos tests vers Codeception afin d'avoir tous vos tests au même endroit.

**La gestion de data**
Comme indiqué plus haut, plusieurs modules sont proposés pour gérer vos data. Vous pourrez donc facilement configurer une base de données pour vos tests et l'utiliser au travers des différents modules (Doctrine2, MongoDb, Redis, Memcache, ou tout simplement Db si vous souhaitez utiliser votre base SQL directement).

**Et le reste**

Ils proposent aussi beaucoup d'helpers permettant de tester des webservices (REST ou SOAP) donc vous pourrez facilement simuler des appels sur vos API dans vos tests fonctionnels.

Je ne l'approfondirai pas ici mais ils vous propose bien entendu des solutions pour tout ce qui est couverture de code, intégration continue,...

Notre utilisation
--------

 Je vais maintenant vous parler de l'utilisation que nous en faisons et donc aller un peu plus dans le détail. Nous avons besoin de couvrir notre code unitairement, pour cela pas de miracle, on utilise Phpunit (à travers Codeception) mais qui reste du test Phpunit classique (ça suffit largement). Le point le plus intéressant est donc la couverture de nos API et Crons fonctionnellement.

Test sur un GET /endpoint (nous utilisons mongodb mais vous pouvez bien entendu utiliser n'importe quelle database !) :

Configuration :

```yaml
# api.suite.yml
class_name: ApiTester
modules:
    enabled:
        - Symfony:
            app_path: '../../app'
            var_path: '../../var'
        - REST:
            url: /
            depends: Symfony
        - MongoDb:
            dsn: 'mongodb://root:root@localhost:27017/endpoint'
            dump: tests/_data/
```

Test (attention le code ci-dessous n'est pas fonctionnel en l'état !) :

```php
# EndpointCest.php
<?php

use Codeception\Util\HttpCode;

class EndpointCest
{
    protected $collection;

    public function _before(ApiTester $I)
    {
        $this->collection = $I->getCollection('app.collection');
    }

    public function getEndpoint(ApiTester $I)
    {
        $I->wantTo('Get endpoint');

        // Create a new Document
        $document = new Document();
        $document->setLabel('Label');

        // Persist it in the database
        $this->collection->save($document);

        // Send the call
        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->sendGET('/endpoints/' . $document->getId());

        // Asserts
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeHttpHeader('Content-Type', 'application/json');
        $I->seeHttpHeader('Last-Modified');
        $I->seeHttpHeader('Etag');
        $I->seeHttpHeader('cache-control', 'no-cache, private');
        $I->seeResponseContainsJson([ 'label' => 'Label' ]);
    }
 }
```

On vient donc de vérifier que notre API nous retourne bien nos données avec le bon code HTTP et les bon headers. Il existe beaucoup d'helpers qui vous permettent de vérifier un peu tout et n'importe quoi. Et si vous ne trouvez pas votre bonheur, vous pouvez ajoutez les vôtres très simplement !

L'avantage c'est que l'ajout de module se fait très simplement. Imaginons que votre code envoie une notification rabbitMQ lors d'une modification de donnée à travers votre API. Vous devez rajouter la configuration du module rabbitMQ dans codeception :

```yaml
# api.suite.yml
class_name: ApiTester
modules:
    enabled:
        - symfony:
            app_path: '../../app'
            var_path: '../../var'
        - REST:
            url: /
            depends: Symfony
        - MongoDb:
            dsn: 'mongodb://root:root@localhost:27017/endpoint'
            dump: tests/_data/
        - AMQP:
            host: 'localhost'
            port: '5672'
            username: 'root'
            password: 'root'
            vhost: '/'
            queues: [test]
```

Test :

```php
# EndpointCest.php
<?php

use Codeception\Util\HttpCode;

class EndpointCest
{
    public function postEndpoint(ApiTester $I)
    {
        $I->wantTo('Post endpoint');

        // Send the call

        $I->haveHttpHeader('Content-Type', 'application/json');
        // If you need some authentication through basic auth simply add :
        $I->amHttpAuthenticated('login', 'password');

        $I->sendPOST('/endpoints', [
            'label' => 'Label',
        ]);

        // Asserts REST
        $I->seeResponseCodeIs(HttpCode::CREATED);
        $I->seeHttpHeader('Content-Type', 'application/json');
        $I->seeHttpHeader('cache-control', 'no-cache, private');
        $I->seeHttpHeader('Location');

        // Imagine we publish a message in RabbitMQ to tell people that a new endpoint was created
        $I->seeMessageInQueueContainsText('my-queue', 'new endpoint');

        // Assert that the new endpoint is present in the database
        $I->seeInRepository('Endpoint', ['label' => 'label']);
    }
}
```

Je vous invite à aller lire la [doc de codeception](http://codeception.com/docs/), elle est assez complète et vous pourrez voir qu'ils supportent pas mal de modules :){:rel="nofollow noreferrer"}

Je ne rentre pas plus dans le détail pour le moment, le but était plus de vous faire un retour d'expérience, si vous êtes intéressé pour un article plus poussé sur son utilisation n'hésitez pas à me l'indiquer.

Seeya !
