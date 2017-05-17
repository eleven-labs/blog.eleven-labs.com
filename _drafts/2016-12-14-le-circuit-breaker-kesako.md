---
layout: post
title: Le circuit breaker Késako ?
author: jonathan
date: '2016-12-14 14:36:10 +0100'
date_gmt: '2016-12-14 13:36:10 +0100'
categories:
- Symfony
- Php
tags:
- symfony
- microservice
- circuit-breaker
---

Aujourd'hui les architectures micro-services sont de plus en plus répandues. Mais quels sont les moyens de contrôler votre nouveau système d'information ?

Mettons fin au mystère dès maintenant, le circuit-breaker, c'est le **disjoncteur** de votre architecture micro-services. Mais comment cela fonctionne et pourquoi en aurions-nous besoin ?

## Pourquoi j'ai besoin d'un disjoncteur ?

Pour expliquer l'utilité d'un disjoncteur, un peu d'histoire. C'est Thomas Edison qui apporte l'électricité dans nos foyers en 1879. Peu après la sortie de cette impressionnante invention, de nombreux accidents de surtension, tuent ou blessent de nombreuses personnes. C'est alors que Thomas Edison, et oui toujours lui, invente le disjoncteur : un mécanisme permettant de couper le courant lors d'un surtension avant que celui-ci détruise les éléments du circuit électrique. Aujourd'hui, le disjoncteur est un élément essentiel dans tout circuit électrique, il y a en dans les téléphones, les ordinateurs, les télévisions etc...

Mais quel parallèle avec notre architecture micro-services ? Il faut se représenter cette architecture comme un circuit électrique : Tous les services peuvent communiquer entre eux. conséquence, si un des services surchauffe, il risque de contaminer les autres. Il ne faut donc plus faire appel à lui. Et c'est ici que le circuit-breaker rentre en action.

### *Exemple:*

Un service A fait appel à un service B.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-1.png)

Si le service B tombe ou est ralenti, sans circuit breaker la communication entre le service A et le service B continue.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-1-1.png)

Le service A peut alors être ralenti ou même tomber.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-2.png)

Mais si vous avez un circuit-breaker, quand le service B tombe ou est ralenti, le circuit-breaker s'ouvre et stoppe la communication entre A et B.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-3.png)

Ce qui permet au service A de prendre en charge la panne, et d'attendre que le service B soit relancé. Dans ce cas là le circuit-breaker se ferme et la communication recommence.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-5.png)

**Bonus**: L'intérêt est encore plus présent quand votre architecture est dans le cloud et que vous avez choisi un système d'autoscalling. Quand un service tombe ou est ralenti cela peut entraîner une plus forte demande du service, ce qui par effet de levier peut faire des demandes de création de machine et ne ferrons que sur-alimenter le cloud. Cela peut vite coûter cher !

Vous êtes désormais convaincu d'avoir besoin d'avoir un circuit-breaker, mais comment l'implémenter ? Nous allons en faire une en Symfony permettant de gérer un circuit-breaker minimum avec comme base une communication entre service utilisant Guzzle.

## Implémentation en Symfony 3 :

Nous allons suivre le pattern suivant.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-6.png)

Ce dont nous avons besoin :

-   un [event](http://symfony.com/doc/current/event_dispatcher.html) permettant d'envoyer le statut de la communication
-   une [listener](http://symfony.com/doc/current/event_dispatcher.html) permettant de récupérer l'événement précédent
-   un [service](http://symfony.com/doc/current/service_container.html) permettant de connaitre le statut du circuit-breaker
-   un [cache](https://symfony.com/blog/new-in-symfony-3-1-cache-component) permettant de stocker les informations du circuit-breaker

Nous allons commencer par l'event, pour cela rien de plus simple : nous devons envoyer le nom du service et le statut de la communication.

```php
<?php declare(strict_types=1);

namespace AppBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class CircuitBreakerEvent extends Event
{
    /**
     * @var string
     */
    private $key;

    /**
     * @var bool
     */
    private $status;

    /**
     * @param string $key
     * @param bool $status
     */
    public function __construct(string $key, bool $status)
    {
        $this->key = $key;
        $this->status = $status;
    }

    /**
     * @return string
     */
    public function getKey() :string
    {
        return $this->key;
    }

    /**
     * @return bool
     */
    public function getStatus() :bool
    {
        return $this->status;
    }
}
```

Une fois l'événement envoyé, il faut le récupérer dans un listener, qui servira de passe-plat vers le service du circuit-breaker.

```php
<?php declare(strict_types=1);

namespace AppBundle\EventListener;

use AppBundle\Event\CircuitBreakerEvent;
use AppBundle\Service\CircuitBreakerService;

class CircuitBreakerListener
{
    /**
     * @var CircuitBreakerService
     */
    private $circuitBreaker;

    /**
     * @param CircuitBreakerService $circuitBreaker
     */
    public function __construct(CircuitBreakerService $circuitBreaker)
    {
        $this->circuitBreaker = $circuitBreaker;
    }

    /**
     * @param CircuitBreakerEvent $event
     */
    public function onCircuitBreaker(CircuitBreakerEvent $event)
    {
        $this->circuitBreaker->save($event->getKey(), $event->getStatus());
    }
}
```

On n'oublie pas de mettre en place le listener dans la configuration des services.

```yaml
services:
    circuit.breaker.listener:
        class: AppBundle\EventListener\CircuitBreakerListener
        arguments: ['@circuit.breaker']
        tags:
            - { name: kernel.event_listener, event: circuit.breaker, method: onCircuitBreaker, priority: 1  }
```

Maintenant nous allons mettre en place le service CircuitBreaker, qui permet de calculer le statut du circuit-breaker pour un service donné.

Nous allons d'abord initialiser le service avec les trois statuts possibles, nous allons aussi mettre en configuration le nombre d'essais en erreur possibles et le temps avant de relancer un appel.

```php
<?php declare(strict_types=1);

namespace AppBundle\Service;

use Symfony\Component\Cache\Adapter\AbstractAdapter;

class CircuitBreakerService
{
    const OPEN = 'open';
    const CLOSED = 'closed';
    const HALFOPEN = 'half-open';

    /**
     * @var AbstractAdapter
     */
    private $cacheApp;

    /**
     * @var array
     */
    private $status;

    /**
     * @var int
     */
    private $threshold;

    /**
     * @var int
     */
    private $timeout;

    /**
     * @param AbstractAdapter $cacheApp
     * @param int $threshold
     * @param int $timeout
     */
    public function __construct(AbstractAdapter $cacheApp, int $threshold, int $timeout)
    {
        $this->cacheApp = $cacheApp;
        $this->threshold = $threshold;
        $this->timeout = $timeout;
    }
}
```

Maintenant nous allons créer la fonction "save" qui permet de prendre en compte  le statut de la dernière communication.

```php
<?php declare(strict_types=1);

namespace AppBundle\Service;

use Symfony\Component\Cache\Adapter\AbstractAdapter;

class CircuitBreakerService
{
    const OPEN = 'open';
    const CLOSED = 'closed';
    const HALFOPEN = 'half-open';

    /**
     * @var AbstractAdapter
     */
    private $cacheApp;

    /**
     * @var array
     */
    private $status;

    /**
     * @var int
     */
    private $threshold;

    /**
     * @var int
     */
    private $timeout;

    /**
     * @param AbstractAdapter $cacheApp
     * @param int $threshold
     * @param int $timeout
     */
    public function __construct(AbstractAdapter $cacheApp, int $threshold, int $timeout)
    {
        $this->cacheApp = $cacheApp;
        $this->threshold = $threshold;
        $this->timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this->status[$key])) {
            $this->status[$key] = self::CLOSED;
        }

        if ($this->status[$key] === self::OPEN) {
            $this->attemptReset($key);
        }

        if (!$status) {
            $this->countFailure($key);
        } else {
            $this->resetCount($key);
        }
    }
}
```

Comme vous pouvez le constater, nous suivons ce qui est dans le schéma plus haut. Arrivé dans la fonction save, si le circuit-breaker n'a pas encore de statut, nous le mettons à CLOSED et enregistrons le statut de la communication. Si celui-ci est OPEN nous appelons la fonction "attemptReset", ce qui permet de retenter ou non un appel.

Nous continuons en mettant en place les fonctions "countFailure" et "resetCount".

```php
<?php declare(strict_types=1);

namespace AppBundle\Service;

use Symfony\Component\Cache\Adapter\AbstractAdapter;

class CircuitBreakerService
{
    const OPEN = 'open';
    const CLOSED = 'closed';
    const HALFOPEN = 'half-open';

    /**
     * @var AbstractAdapter
     */
    private $cacheApp;

    /**
     * @var array
     */
    private $status;

    /**
     * @var int
     */
    private $threshold;

    /**
     * @var int
     */
    private $timeout;

    /**
     * @param AbstractAdapter $cacheApp
     * @param int $threshold
     * @param int $timeout
     */
    public function __construct(AbstractAdapter $cacheApp, int $threshold, int $timeout)
    {
        $this->cacheApp = $cacheApp;
        $this->threshold = $threshold;
        $this->timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this->status[$key])) {
            $this->status[$key] = self::CLOSED;
        }

        if ($this->status[$key] === self::OPEN) {
            $this->attemptReset($key);
        }

        if (!$status) {
            $this->countFailure($key);
        } else {
            $this->resetCount($key);
        }
    }

    /**
     * Increment number of fail to one service
     *
     * @param string $service
     */
    private function countFailure(string $service)
    {
        $this->info('[CircuitBreaker] call countFailure to ' . $service);
        $value = $this->cacheApp->getItem($service);
        $fail = $value->get() + 1;
        $value->set($fail);

        if ($this->status[$service] === self::HALFOPEN) {
            $value->set($this->threshold);
        }

        $value->expiresAfter($this->timeout);

        if ($fail >= $this->threshold) {
            $this->tripBreaker($service);
        }

        $this->cacheApp->save($value);
    }

    /**
     * Close circuit breaker, and reset value to fail service
     *
     * @param string $service
     */
    private function resetCount(string $service)
    {
        $this->info('[CircuitBreaker] call resetCount to ' . $service);
        $value = $this->cacheApp->getItem($service);

        $value->set(0);
        $this->status[$service] = self::CLOSED;
        $this->cacheApp->save($value);
    }
}
```

"ResetCount" est super simple, on remet le compteur stoker en cache à 0 et on met le circuit-breaker en CLOSED.

"CountFailure" incrémente le compteur, si celui-ci atteint le "threshold" on passe dans le "tripBreaker". Si le statut du cricuit-breaker est HALFOPEN on le remet tout de suite au niveau du "threshold".

Maintenant on va développer les fonctions "attemptReset" et "tripBreaker".

```php
<?php declare(strict_types=1);

namespace AppBundle\Service;

use Symfony\Component\Cache\Adapter\AbstractAdapter;

class CircuitBreakerService
{
    const OPEN = 'open';
    const CLOSED = 'closed';
    const HALFOPEN = 'half-open';

    /**
     * @var AbstractAdapter
     */
    private $cacheApp;

    /**
     * @var array
     */
    private $status;

    /**
     * @var int
     */
    private $threshold;

    /**
     * @var int
     */
    private $timeout;

    /**
     * @param AbstractAdapter $cacheApp
     * @param int $threshold
     * @param int $timeout
     */
    public function __construct(AbstractAdapter $cacheApp, int $threshold, int $timeout)
    {
        $this->cacheApp = $cacheApp;
        $this->threshold = $threshold;
        $this->timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this->status[$key])) {
            $this->status[$key] = self::CLOSED;
        }

        if ($this->status[$key] === self::OPEN) {
            $this->attemptReset($key);
        }

        if (!$status) {
            $this->countFailure($key);
        } else {
            $this->resetCount($key);
        }
    }

    /**
     * Increment number of fail to one service
     *
     * @param string $service
     */
    private function countFailure(string $service)
    {
        $this->info('[CircuitBreaker] call countFailure to ' . $service);
        $value = $this->cacheApp->getItem($service);
        $fail = $value->get() + 1;
        $value->set($fail);

        if ($this->status[$service] === self::HALFOPEN) {
            $value->set($this->threshold);
        }

        $value->expiresAfter($this->timeout);

        if ($fail >= $this->threshold) {
            $this->tripBreaker($service);
        }

        $this->cacheApp->save($value);
    }

    /**
     * Open circuit breaker
     *
     * @param string $service
     */
    private function tripBreaker(string $service)
    {
        $this->error('[CircuitBreaker] call tripBreaker to ' . $service);
        $this->status[$service] = self::OPEN;
    }

    /**
     * CLose circuit breaker, and reset value to fail service
     *
     * @param string $service
     */
    private function resetCount(string $service)
    {
        $this->info('[CircuitBreaker] call resetCount to ' . $service);
        $value = $this->cacheApp->getItem($service);

        $value->set(0);
        $this->status[$service] = self::CLOSED;
        $this->cacheApp->save($value);
    }

    /**
     * HalfOpen circuit breaker
     *
     * @param string $service
     */
    private function attemptReset(string $service)
    {
        $this->warning('[CircuitBreaker] call attemptReset to ' . $service);
        $this->status[$service] = self::HALFOPEN;
    }
}
```

"AttemptReset" change le statut du circuit-breaker en HALFOPEN.

"TripBreaker" change le statut du circuit-breaker en OPEN.

Il ne nous reste plus qu'à mettre en place la fonction qui permet de connaitre le statut du circuit-breaker.

```php
<?php declare(strict_types=1);

namespace AppBundle\Service;

use Symfony\Component\Cache\Adapter\AbstractAdapter;

class CircuitBreakerService
{
    const OPEN = 'open';
    const CLOSED = 'closed';
    const HALFOPEN = 'half-open';

    /**
     * @var AbstractAdapter
     */
    private $cacheApp;

    /**
     * @var array
     */
    private $status;

    /**
     * @var int
     */
    private $threshold;

    /**
     * @var int
     */
    private $timeout;

    /**
     * @param AbstractAdapter $cacheApp
     * @param int $threshold
     * @param int $timeout
     */
    public function __construct(AbstractAdapter $cacheApp, int $threshold, int $timeout)
    {
        $this->cacheApp = $cacheApp;
        $this->threshold = $threshold;
        $this->timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this->status[$key])) {
            $this->status[$key] = self::CLOSED;
        }

        if ($this->status[$key] === self::OPEN) {
            $this->attemptReset($key);
        }

        if (!$status) {
            $this->countFailure($key);
        } else {
            $this->resetCount($key);
        }
    }

    /**
     * Verify if service is open
     *
     * @param string $service
     * @return boolean
     */
    public function isOpen(string $service) :bool
    {
        if (!isset($this->status[$service]) &&
            $this->cacheApp->getItem($service)->get() >= $this->threshold
        ) {
            $this->status[$service] = self::OPEN;
        }

        return $this->status[$service] === self::OPEN;
    }

    /**
     * Increment number of fail to one service
     *
     * @param string $service
     */
    private function countFailure(string $service)
    {
        $this->info('[CircuitBreaker] call countFailure to ' . $service);
        $value = $this->cacheApp->getItem($service);
        $fail = $value->get() + 1;
        $value->set($fail);

        if ($this->status[$service] === self::HALFOPEN) {
            $value->set($this->threshold);
        }

        $value->expiresAfter($this->timeout);

        if ($fail >= $this->threshold) {
            $this->tripBreaker($service);
        }

        $this->cacheApp->save($value);
    }

    /**
     * Open circuit breaker
     *
     * @param string $service
     */
    private function tripBreaker(string $service)
    {
        $this->error('[CircuitBreaker] call tripBreaker to ' . $service);
        $this->status[$service] = self::OPEN;
    }

    /**
     * CLose circuit breaker, and reset value to fail service
     *
     * @param string $service
     */
    private function resetCount(string $service)
    {
        $this->info('[CircuitBreaker] call resetCount to ' . $service);
        $value = $this->cacheApp->getItem($service);

        $value->set(0);
        $this->status[$service] = self::CLOSED;
        $this->cacheApp->save($value);
    }

    /**
     * HalfOpen circuit breaker
     *
     * @param string $service
     */
    private function attemptReset(string $service)
    {
        $this->warning('[CircuitBreaker] call attemptReset to ' . $service);
        $this->status[$service] = self::HALFOPEN;
    }
}
```

Vous n'avez plus qu'à utiliser votre circuit-breaker. Voici un exemple avec une communication avec Guzzle 6.

```php
    /**
     * @param string $method
     * @param string $uri
     * @param array  $options
     *
     * @return PromiseInterface
     */
    private function callApi(string $method, string $uri, array $options = []): PromiseInterface
    {
        $queryParams = $options['query'] ?? [];

        $headerOptions = [
            'headers' => [
                'x-access-token' => $this->tokenGeneratorService->getToken($uri, $queryParams),
            ],
        ];

        $options = array_merge($options, $headerOptions);

        if ($this->circuitBreaker->isOpen('edito-service')) {
            $promise = new Promise();
            $promise->resolve([
                'statusCode' => 503,
                'reasonPhrase' => 'Circuit breaker is open',
            ]);

            return $promise;
        }

        return $this->client
            ->requestAsync($method, $uri, $options)
            ->then(
                function (Response $response): array {
                    $this->eventDispatcher->dispatch('circuit.breaker', new CircuitBreakerEvent('edito-service', true));

                    $contents = json_decode($response->getBody()->getContents(), true);

                    return [
                        'headers' => $response->getHeaders(),
                        'statusCode' => $response->getStatusCode(),
                        'reasonPhrase' => $response->getReasonPhrase(),
                        'contents' => $contents['data'] ?? [],
                    ];
                }
            )
            ->otherwise(
                function (RequestException $exception): array {
                    $this->eventDispatcher->dispatch('circuit.breaker', new CircuitBreakerEvent('edito-service', false));

                    $return = [
                        'message' => $exception->getMessage(),
                        'contents' => [],
                    ];

                    if ($exception->hasResponse()) {
                        $return = array_merge($return, [
                            'statusCode' => $exception->getResponse()->getStatusCode(),
                            'reasonPhrase' => $exception->getResponse()->getReasonPhrase(),
                        ]);
                    }

                    return $return;
                }
            );
    }
```

Pour aller plus loin, je vous invite à lire [Release-It](https://www.amazon.com/Release-Production-Ready-Software-Pragmatic-Programmers/dp/0978739213), dans lequel vous pourrez trouver une superbe explication d'un circuit-breaker.
