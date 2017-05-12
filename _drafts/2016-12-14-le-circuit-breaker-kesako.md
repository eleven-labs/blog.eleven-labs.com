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
{% raw %}
<p>Aujourd'hui les architectures micro-services sont de plus en plus répandues. Mais quels sont les moyens de contrôler votre nouveau système d'information ?</p>
<p>Mettons fin au mystère dès maintenant, le circuit-breaker, c'est le <strong>disjoncteur</strong> de votre architecture micro-services. Mais comment cela fonctionne et pourquoi en aurions-nous besoin ?</p>
#### Pourquoi j'ai besoin d'un disjoncteur ?
<p>Pour expliquer l'utilité d'un disjoncteur, un peu d'histoire. C'est Thomas Edison qui apporte l'électricité dans nos foyers en 1879. Peu après la sortie de cette impressionnante invention, de nombreux accidents de surtension, tuent ou blessent de nombreuses personnes. C'est alors que Thomas Edison, et oui toujours lui, invente le disjoncteur : un mécanisme permettant de couper le courant lors d'un surtension avant que celui-ci détruise les éléments du circuit électrique. Aujourd'hui, le disjoncteur est un élément essentiel dans tout circuit électrique, il y a en dans les téléphones, les ordinateurs, les télévisions etc...</p>
<p>Mais quel parallèle avec notre architecture micro-services ? Il faut se représenter cette architecture comme un circuit électrique : Tous les services peuvent communiquer entre eux. conséquence, si un des services surchauffe, il risque de contaminer les autres. Il ne faut donc plus faire appel à lui. Et c'est ici que le circuit-breaker rentre en action.</p>
###### <em>Exemple:</em>
<p>Un service A fait appel à un service B.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-1.png"><img class="aligncenter size-full wp-image-2884" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-1.png" alt="" width="783" height="296" /></a></p>
<p>Si le service B tombe ou est ralenti, sans circuit breaker la communication entre le service A et le service B continue.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-1-1.png"><img class="aligncenter size-full wp-image-2885" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-1-1.png" alt="" width="792" height="307" /></a></p>
<p>Le service A peut alors être ralenti ou même tomber.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-2.png"><img class="aligncenter size-full wp-image-2886" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-2.png" alt="" width="807" height="293" /></a></p>
<p>Mais si vous avez un circuit-breaker, quand le service B tombe ou est ralenti, le circuit-breaker s'ouvre et stoppe la communication entre A et B.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-3.png"><img class="aligncenter size-full wp-image-2887" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-3.png" alt="" width="784" height="281" /></a></p>
<p>Ce qui permet au service A de prendre en charge la panne, et d'attendre que le service B soit relancé. Dans ce cas là le circuit-breaker se ferme et la communication recommence.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-5.png"><img class="aligncenter size-full wp-image-2888" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-5.png" alt="" width="785" height="277" /></a></p>
<p><em><strong>Bonus </strong></em>: L'intérêt est encore plus présent quand votre architecture est dans le cloud et que vous avez choisi un système d'autoscalling. Quand un service tombe ou est ralenti cela peut entraîner une plus forte demande du service, ce qui par effet de levier peut faire des demandes de création de machine et ne ferrons que sur-alimenter le cloud. Cela peut vite coûter cher !</p>
<p>Vous êtes désormais convaincu d'avoir besoin d'avoir un circuit-breaker, mais comment l'implémenter ? Nous allons en faire une en Symfony permettant de gérer un circuit-breaker minimum avec comme base une communication entre service utilisant Guzzle.</p>
<p>&nbsp;</p>
#### Implémentation en Symfony 3 :
<p>Nous allons suivre le pattern suivant.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-6.png"><img class="aligncenter size-full wp-image-2889" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-drawing-6.png" alt="" width="960" height="720" /></a></p>
<p>Ce dont nous avons besoin :</p>
<ul>
<li>un <a href="http://symfony.com/doc/current/event_dispatcher.html">event</a> permettant d'envoyer le statut de la communication</li>
<li>une <a href="http://symfony.com/doc/current/event_dispatcher.html">listener</a> permettant de récupérer l'événement précédent</li>
<li>un <a href="http://symfony.com/doc/current/service_container.html">service</a> permettant de connaitre le statut du circuit-breaker</li>
<li>un <a href="https://symfony.com/blog/new-in-symfony-3-1-cache-component">cache</a> permettant de stocker les informations du circuit-breaker</li>
</ul>
<p>&nbsp;</p>
<p>Nous allons commencer par l'event, pour cela rien de plus simple : nous devons envoyer le nom du service et le statut de la communication.</p>
<pre class="lang:php decode:true " title="CircuitBreakerEvent">&lt;?php declare(strict_types=1);

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
        $this-&gt;key = $key;
        $this-&gt;status = $status;
    }

    /**
     * @return string
     */
    public function getKey() :string
    {
        return $this-&gt;key;
    }

    /**
     * @return bool
     */
    public function getStatus() :bool
    {
        return $this-&gt;status;
    }
}</pre>
<p>Une fois l'événement envoyé, il faut le récupérer dans un listener, qui servira de passe-plat vers le service du circuit-breaker.</p>
<pre class="lang:default decode:true " title="CircuitBreakerListener">&lt;?php declare(strict_types=1);

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
        $this-&gt;circuitBreaker = $circuitBreaker;
    }

    /**
     * @param CircuitBreakerEvent $event
     */
    public function onCircuitBreaker(CircuitBreakerEvent $event)
    {
        $this-&gt;circuitBreaker-&gt;save($event-&gt;getKey(), $event-&gt;getStatus());
    }
}</pre>
<p>On n'oublie pas de mettre en place le listener dans la configuration des services.</p>
<pre class="lang:yaml decode:true" title="services.yml">services:
    circuit.breaker.listener:
        class: AppBundle\EventListener\CircuitBreakerListener
        arguments: ['@circuit.breaker']
        tags:
            - { name: kernel.event_listener, event: circuit.breaker, method: onCircuitBreaker, priority: 1  }</pre>
<p>Maintenant nous allons mettre en place le service CircuitBreaker, qui permet de calculer le statut du circuit-breaker pour un service donné.</p>
<p>Nous allons d'abord initialiser le service avec les trois statuts possibles, nous allons aussi mettre en configuration le nombre d'essais en erreur possibles et le temps avant de relancer un appel.</p>
<pre class="lang:php decode:true" title="CircuitBreakerService Init">&lt;?php declare(strict_types=1);

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
        $this-&gt;cacheApp = $cacheApp;
        $this-&gt;threshold = $threshold;
        $this-&gt;timeout = $timeout;
    }
}</pre>
<p>Maintenant nous allons créer la fonction "save" qui permet de prendre en compte  le statut de la dernière communication.</p>
<pre class="lang:php decode:true" title="Circuit-Breaker Save">&lt;?php declare(strict_types=1);

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
        $this-&gt;cacheApp = $cacheApp;
        $this-&gt;threshold = $threshold;
        $this-&gt;timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this-&gt;status[$key])) {
            $this-&gt;status[$key] = self::CLOSED;
        }

        if ($this-&gt;status[$key] === self::OPEN) {
            $this-&gt;attemptReset($key);
        }

        if (!$status) {
            $this-&gt;countFailure($key);
        } else {
            $this-&gt;resetCount($key);
        }
    }
}</pre>
<p>Comme vous pouvez le constater, nous suivons ce qui est dans le schéma plus haut. Arrivé dans la fonction save, si le circuit-breaker n'a pas encore de statut, nous le mettons à CLOSED et enregistrons le statut de la communication. Si celui-ci est OPEN nous appelons la fonction "attemptReset", ce qui permet de retenter ou non un appel.</p>
<p>Nous continuons en mettant en place les fonctions "countFailure" et "resetCount".</p>
<pre class="lang:php decode:true" title="CircuitBreaker Take status">&lt;?php declare(strict_types=1);

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
        $this-&gt;cacheApp = $cacheApp;
        $this-&gt;threshold = $threshold;
        $this-&gt;timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this-&gt;status[$key])) {
            $this-&gt;status[$key] = self::CLOSED;
        }

        if ($this-&gt;status[$key] === self::OPEN) {
            $this-&gt;attemptReset($key);
        }

        if (!$status) {
            $this-&gt;countFailure($key);
        } else {
            $this-&gt;resetCount($key);
        }
    }

    /**
     * Increment number of fail to one service
     *
     * @param string $service
     */
    private function countFailure(string $service)
    {
        $this-&gt;info('[CircuitBreaker] call countFailure to ' . $service);
        $value = $this-&gt;cacheApp-&gt;getItem($service);
        $fail = $value-&gt;get() + 1;
        $value-&gt;set($fail);

        if ($this-&gt;status[$service] === self::HALFOPEN) {
            $value-&gt;set($this-&gt;threshold);
        }

        $value-&gt;expiresAfter($this-&gt;timeout);

        if ($fail &gt;= $this-&gt;threshold) {
            $this-&gt;tripBreaker($service);
        }

        $this-&gt;cacheApp-&gt;save($value);
    }

    /**
     * Close circuit breaker, and reset value to fail service
     *
     * @param string $service
     */
    private function resetCount(string $service)
    {
        $this-&gt;info('[CircuitBreaker] call resetCount to ' . $service);
        $value = $this-&gt;cacheApp-&gt;getItem($service);

        $value-&gt;set(0);
        $this-&gt;status[$service] = self::CLOSED;
        $this-&gt;cacheApp-&gt;save($value);
    }
}</pre>
<p>"ResetCount" est super simple, on remet le compteur stoker en cache à 0 et on met le circuit-breaker en CLOSED.</p>
<p>"CountFailure" incrémente le compteur, si celui-ci atteint le "threshold" on passe dans le "tripBreaker". Si le statut du cricuit-breaker est HALFOPEN on le remet tout de suite au niveau du "threshold".</p>
<p>Maintenant on va développer les fonctions "attemptReset" et "tripBreaker".</p>
<pre class="lang:php decode:true " title="Circuit Breaker Change Status">&lt;?php declare(strict_types=1);

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
        $this-&gt;cacheApp = $cacheApp;
        $this-&gt;threshold = $threshold;
        $this-&gt;timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this-&gt;status[$key])) {
            $this-&gt;status[$key] = self::CLOSED;
        }

        if ($this-&gt;status[$key] === self::OPEN) {
            $this-&gt;attemptReset($key);
        }

        if (!$status) {
            $this-&gt;countFailure($key);
        } else {
            $this-&gt;resetCount($key);
        }
    }

    /**
     * Increment number of fail to one service
     *
     * @param string $service
     */
    private function countFailure(string $service)
    {
        $this-&gt;info('[CircuitBreaker] call countFailure to ' . $service);
        $value = $this-&gt;cacheApp-&gt;getItem($service);
        $fail = $value-&gt;get() + 1;
        $value-&gt;set($fail);

        if ($this-&gt;status[$service] === self::HALFOPEN) {
            $value-&gt;set($this-&gt;threshold);
        }

        $value-&gt;expiresAfter($this-&gt;timeout);

        if ($fail &gt;= $this-&gt;threshold) {
            $this-&gt;tripBreaker($service);
        }

        $this-&gt;cacheApp-&gt;save($value);
    }

    /**
     * Open circuit breaker
     *
     * @param string $service
     */
    private function tripBreaker(string $service)
    {
        $this-&gt;error('[CircuitBreaker] call tripBreaker to ' . $service);
        $this-&gt;status[$service] = self::OPEN;
    }

    /**
     * CLose circuit breaker, and reset value to fail service
     *
     * @param string $service
     */
    private function resetCount(string $service)
    {
        $this-&gt;info('[CircuitBreaker] call resetCount to ' . $service);
        $value = $this-&gt;cacheApp-&gt;getItem($service);

        $value-&gt;set(0);
        $this-&gt;status[$service] = self::CLOSED;
        $this-&gt;cacheApp-&gt;save($value);
    }

    /**
     * HalfOpen circuit breaker
     *
     * @param string $service
     */
    private function attemptReset(string $service)
    {
        $this-&gt;warning('[CircuitBreaker] call attemptReset to ' . $service);
        $this-&gt;status[$service] = self::HALFOPEN;
    }
}</pre>
<p>"AttemptReset" change le statut du circuit-breaker en HALFOPEN.</p>
<p>"TripBreaker" change le statut du circuit-breaker en OPEN.</p>
<p>Il ne nous reste plus qu'à mettre en place la fonction qui permet de connaitre le statut du circuit-breaker.</p>
<pre class="lang:php decode:true " title="Circuit Breaker Service">&lt;?php declare(strict_types=1);

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
        $this-&gt;cacheApp = $cacheApp;
        $this-&gt;threshold = $threshold;
        $this-&gt;timeout = $timeout;
    }

    /**
     * @param string $key The service key
     * @param string $status The service status (true: up, false: down)
     */
    public function save(string $key, bool $status)
    {
        if (!isset($this-&gt;status[$key])) {
            $this-&gt;status[$key] = self::CLOSED;
        }

        if ($this-&gt;status[$key] === self::OPEN) {
            $this-&gt;attemptReset($key);
        }

        if (!$status) {
            $this-&gt;countFailure($key);
        } else {
            $this-&gt;resetCount($key);
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
        if (!isset($this-&gt;status[$service]) &amp;&amp;
            $this-&gt;cacheApp-&gt;getItem($service)-&gt;get() &gt;= $this-&gt;threshold
        ) {
            $this-&gt;status[$service] = self::OPEN;
        }

        return $this-&gt;status[$service] === self::OPEN;
    }

    /**
     * Increment number of fail to one service
     *
     * @param string $service
     */
    private function countFailure(string $service)
    {
        $this-&gt;info('[CircuitBreaker] call countFailure to ' . $service);
        $value = $this-&gt;cacheApp-&gt;getItem($service);
        $fail = $value-&gt;get() + 1;
        $value-&gt;set($fail);

        if ($this-&gt;status[$service] === self::HALFOPEN) {
            $value-&gt;set($this-&gt;threshold);
        }

        $value-&gt;expiresAfter($this-&gt;timeout);

        if ($fail &gt;= $this-&gt;threshold) {
            $this-&gt;tripBreaker($service);
        }

        $this-&gt;cacheApp-&gt;save($value);
    }

    /**
     * Open circuit breaker
     *
     * @param string $service
     */
    private function tripBreaker(string $service)
    {
        $this-&gt;error('[CircuitBreaker] call tripBreaker to ' . $service);
        $this-&gt;status[$service] = self::OPEN;
    }

    /**
     * CLose circuit breaker, and reset value to fail service
     *
     * @param string $service
     */
    private function resetCount(string $service)
    {
        $this-&gt;info('[CircuitBreaker] call resetCount to ' . $service);
        $value = $this-&gt;cacheApp-&gt;getItem($service);

        $value-&gt;set(0);
        $this-&gt;status[$service] = self::CLOSED;
        $this-&gt;cacheApp-&gt;save($value);
    }

    /**
     * HalfOpen circuit breaker
     *
     * @param string $service
     */
    private function attemptReset(string $service)
    {
        $this-&gt;warning('[CircuitBreaker] call attemptReset to ' . $service);
        $this-&gt;status[$service] = self::HALFOPEN;
    }
}</pre>
<p>Vous n'avez plus qu'à utiliser votre circuit-breaker. Voici un exemple avec une communication avec Guzzle 6.</p>
<pre class="lang:php decode:true " title="Utilisation du circuit-breaker">    /**
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
            'headers' =&gt; [
                'x-access-token' =&gt; $this-&gt;tokenGeneratorService-&gt;getToken($uri, $queryParams),
            ],
        ];

        $options = array_merge($options, $headerOptions);

        if ($this-&gt;circuitBreaker-&gt;isOpen('edito-service')) {
            $promise = new Promise();
            $promise-&gt;resolve([
                'statusCode' =&gt; 503,
                'reasonPhrase' =&gt; 'Circuit breaker is open',
            ]);

            return $promise;
        }

        return $this-&gt;client
            -&gt;requestAsync($method, $uri, $options)
            -&gt;then(
                function (Response $response): array {
                    $this-&gt;eventDispatcher-&gt;dispatch('circuit.breaker', new CircuitBreakerEvent('edito-service', true));

                    $contents = json_decode($response-&gt;getBody()-&gt;getContents(), true);

                    return [
                        'headers' =&gt; $response-&gt;getHeaders(),
                        'statusCode' =&gt; $response-&gt;getStatusCode(),
                        'reasonPhrase' =&gt; $response-&gt;getReasonPhrase(),
                        'contents' =&gt; $contents['data'] ?? [],
                    ];
                }
            )
            -&gt;otherwise(
                function (RequestException $exception): array {
                    $this-&gt;eventDispatcher-&gt;dispatch('circuit.breaker', new CircuitBreakerEvent('edito-service', false));

                    $return = [
                        'message' =&gt; $exception-&gt;getMessage(),
                        'contents' =&gt; [],
                    ];

                    if ($exception-&gt;hasResponse()) {
                        $return = array_merge($return, [
                            'statusCode' =&gt; $exception-&gt;getResponse()-&gt;getStatusCode(),
                            'reasonPhrase' =&gt; $exception-&gt;getResponse()-&gt;getReasonPhrase(),
                        ]);
                    }

                    return $return;
                }
            );
    }</pre>
<p>Pour aller plus loin, je vous invite à lire <a href="https://www.amazon.com/Release-Production-Ready-Software-Pragmatic-Programmers/dp/0978739213">Release-It</a>, dans lequel vous pourrez trouver une superbe explication d'un circuit-breaker.</p>
{% endraw %}
