---
layout: post
title: Publier, consommer, et réessayer des messages RabbitMQ
author: rpierlot
date: '2017-01-23 12:01:55 +0100'
date_gmt: '2017-01-23 11:01:55 +0100'
categories:
- Symfony
- Php
tags:
- RabbitMQ
---

<img class="aligncenter" src="https://avatars2.githubusercontent.com/u/6749375?v=3&amp;s=400" alt="See original image" />

RabbitMQ est un gestionnaire de queues, permettant d'asynchroniser différents traitements. Si vous n'êtes pas familier avec cet outil, un <a href="http://blog.eleven-labs.com/fr/creer-rpc-rabbitmq/">article</a> traitant du sujet a déjà été écrit précédemment, je vous invite donc à le lire.

Ce que j'aimerais vous présenter ici correspond à la mise en place du cycle de vie d'un message, avec une gestion des erreurs. Le tout, en quelques lignes de code.

Ainsi, nous allons voir ensemble comment configurer son <em>virtual host </em>RabbitMQ, publier un message, le consommer, puis le "rattraper" si ce dernier rencontre une erreur lors de la consommation.

## 
&nbsp;

## 
## Nos outils
La solution technique s'organise aurour de deux librairies :

<ul>
<li><a href="https://github.com/odolbeau/rabbit-mq-admin-toolkit">RabbitMQ Admin Toolkit</a> : librairie PHP qui permet d'interagir avec l'API HTTP de notre serveur RabbitMQ pour y créer les <em>exchanges</em>, les <em>queues</em>...</li>
<li><a href="https://github.com/swarrot/swarrot">Swarrot</a> : librairie PHP qui permet de consommer nos messages.</li>
</ul>
Swarrot est compatible avec l'extension amqp de PHP ainsi la librairie <a href="https://github.com/php-amqplib/php-amqplib">php-amqplib</a>. L'extension PHP possède un avantage certain en performances (écrite en C) sur la librairie d'après les <a href="https://odolbeau.fr/blog/benchmark-php-amqp-lib-amqp-extension-swarrot.html">benchmarks</a>. Pour installer l'extension, rendez-vous <a href="https://serverpilot.io/community/articles/how-to-install-the-php-amqp-extension.html">ici</a>.<br />
Le principal concurrent de Swarrot, <a href="https://github.com/php-amqplib/RabbitMqBundle">RabbitMqBundle</a>, n'est pas compatible avec l'extension PHP, et n'est pas aussi simple dans sa configuration et son utilisation.

## Configuration
Notre première étape va être de créer notre configuration RabbitMQ : notre <em>exchange </em>et notre <em>queue</em>.

La librairie RabbitMQ Admin Toolkit, développée par <em><a href="https://github.com/odolbeau">odolbeau</a>,</em> permet de configurer notre vhost très simplement. Voici une config très basique déclarant un <em>exchange </em>et une <em>queue</em> nous permettant d'envoyer Wilson et ses camarades dans l'espace :

<pre class="theme:sublime-text lang:yaml decode:true" title="RabbitMQ configuration">
{% raw %}
# default_vhost.yml
'/':
    parameters:
        with_dl: false # If true, all queues will have a dl and the corresponding mapping with the exchange "dl"
        with_unroutable: false # If true, all exchange will be declared with an unroutable config

    exchanges:
        default:
            type: direct
            durable: true

    queues:
        send_astronaut_to_space:
            durable: true
            bindings:
                - exchange: default
                  routing_key: send_astronaut_to_space
{% endraw %}
</pre>

Ici, on demande donc la création d'un <em>echange </em>nommé "default", et d'une <em>queue </em>"send_astronaut_to_space", associé à notre échange par une <em>routing key </em>homonyme.<br />
Un <em>binding </em>est une relation entre un <em>exchange </em>et une <em>queue.</em>

Lançons la commande pour la création de notre vhost :

<pre class="theme:sublime-text lang:sh decode:true">
{% raw %}
vendor/bin/rabbit vhost:mapping:create default_vhost.yml --host=127.0.0.1
Password?
With DL: false
With Unroutable: false
Create exchange default
Create queue send_astronaut_to_space
Create binding between exchange default and queue send_astronaut_to_space (with routing_key: send_astronaut_to_space){% endraw %}
</pre>

En vous connectant sur votre interface RabbitMQ management (ex: http://127.0.0.1:15672/), plusieurs choses apparaissent :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-27-13-12-34.png"><img class="wp-image-3073 size-medium aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-27-13-12-34-300x271.png" width="300" height="271" /></a>

En cliquant sur l'onglet <em>Exchanges</em>, un exchange <em>default</em> a été créé avec un <em>binding </em>avec notre <em>queue</em>, comme indiqué dans la console.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-27-13-13-29.png"><img class="wp-image-3074 size-medium aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-27-13-13-29-300x213.png" width="300" height="213" /></a>

Si l'on clique maintenant sur <em>Queues</em>, <em>send_astronaut_to_space</em> est également présente. Jusqu'à présent, pas de problèmes.

Passons maintenant à la partie publication et consommation de messages.

## Consommation
La librairie PHP qui va nous aider à consommer et publier nos messages, Swarrot, possède un bundle Symfony, qui va nous permettre de l'utiliser simplement dans notre application : <a href="https://github.com/swarrot/SwarrotBundle">SwarrotBundle</a>.

Nous devons donc publier des messages, et ensuite les consommer. Voici comment le faire très simplement.

Une fois votre bundle installé, il est nécessaire de configurer le bundle :

<pre class="theme:sublime-text lang:yaml decode:true">
{% raw %}
# app/config/config.yml
swarrot:
    provider: pecl # pecl or amqp_lib
    connections:
        rabbitmq:
            host: '%rabbitmq_host%'
            port: '%rabbitmq_port%'
            login: '%rabbitmq_login%'
            password: '%rabbitmq_password%'
            vhost: '/'
    consumers:
        send_astronaut_to_space: # name of the consumer
            processor: processor.send_astronaut_to_space # name of the service
            extras:
                poll_interval: 500000
                requeue_on_error: false
            middleware_stack:
                - configurator: swarrot.processor.exception_catcher
                - configurator: swarrot.processor.ack{% endraw %}
</pre>

Voici donc un exemple de configuration. La partie intéressante arrive à partir du paramètre <em>consumers</em>.

Chaque message publié dans un <em>exchange</em> sera acheminé vers une <em>queue</em> en fonction de sa <em>routing key</em>. Ainsi, il nous est donc nécessaire de traiter une message stocké dans une <em>queue</em>. Dans Swarrot, ce sont les <em>processors</em> qui s'occcupent de cela.<br />
Pour consommer notre message, il nous est donc nécessaire de créer notre propre <em>processor</em>. Comme indiqué dans la documentation, un <em>processor</em> est simplement un service Symfony qui doit implémenter l'interface <em>ProcessorInterface</em>.

[caption id="" align="aligncenter" width="548"]<img src="https://camo.githubusercontent.com/8ac89cd415aebfb1026b2278093dbcc986b126da/68747470733a2f2f646f63732e676f6f676c652e636f6d2f64726177696e67732f642f3145615f514a486f2d3970375957386c5f62793753344e494430652d41477058527a7a6974416c59593543632f7075623f773d39363026683d373230" alt="Swarrot - Middleware stack" width="548" height="411" /> Swarrot - Middleware stack[/caption]

La particularité des <em>processors</em> est qu'ils fonctionnent avec des <em>middlewares</em>, permettant d'ajouter du comportement avant et/ou après le traitement de notre message (notre processeur). C'est pour cela qu'il y a le paramètre <em>middleware_stack</em>, qui contient deux choses : <em>swarrotot.processor.exception_catcher </em>et <em>swarrot.processor.ack</em>. Bien que facultatifs, ces middlewares apportent une souplesse non négligeable. Nous y reviendrons dans la suite de cet article.

<pre class="theme:sublime-text lang:php decode:true">
{% raw %}
&lt;?php

namespace AppBundle\Processor;

use Swarrot\Broker\Message;
use Swarrot\Processor\ProcessorInterface;

class SendAstronautToSpace implements ProcessorInterface
{
    public function process(Message $message, array $options)
    {
        //...
    }
}{% endraw %}
</pre>

Notre <em>processor </em>SendAstronautToSpace implémente la méthode <em>process</em>, qui nous permet de récupérer le message à consommer, et l'utiliser dans notre application.

Nous venons donc de mettre en place la consommation de nos messages. Que nous reste-t-il à faire ? La publication bien sûr !

## Publication
Encore une fois, il est très simple de publier des messages avec Swarrot. Il nous suffit juste de déclarer un <em>publisher</em> dans notre configuration et d'utiliser le service de publication du SwarrotBundle pour publier un nouveau message.

<pre class="theme:sublime-text lang:yaml decode:true">
{% raw %}
# app/config/config.yml
    consumers:
# ...
            middleware_stack:
                - configurator: swarrot.processor.exception_catcher
                - configurator: swarrot.processor.ack

    messages_types:
        send_astronaut_to_space_publisher:
            connection: rabbitmq
            exchange: default
            routing_key: send_astronaut_to_space{% endraw %}
</pre>

Le secret est de déclarer un nouveau type de message, en spécificant la <em>connection</em>, l'<em>exchange</em>, et la <em>routing key</em>, et de publier un message de cette façon :

<pre class="theme:sublime-text lang:default decode:true">
{% raw %}
&lt;?php

$message = new Message('Wilson wants to go to space');
$this-&gt;get('swarrot.publisher')-&gt;publish('send_astronaut_to_space_publisher', $message);
{% endraw %}
</pre>

Le service Symfony <em>swarrot.publisher</em> s'occupe ainsi de la publication de notre message. Simple tout cela non ?

Avec la mise en place des <em>queues</em>, la publication, la consommation des messages, la boucle est bouclée.

## Gestion des erreurs
Un dernier aspect que j'aimerai partager avec vous concerne les erreurs lors de la consommation de vos messages.

Mis à part les problèmes d'implémentation dans votre code, il est possible que vous rencontriez des exceptions, dues à des causes "externes". Par exemple, vous avez un processeur qui doit faire une requête HTTP à un autre service. Ce dernier peut ne pas répondre temporairement, ou être en erreur. Vous avez besoin de publier le message sans que ce dernier ne soit perdu. Ne serait-il pas bien de republier le message si le service ne répond pas, et de le faire après un certain laps de temps ? Faire ce que l'on appelle en anglais un <em>retry</em> ?

Il m'est arrivé d'être confronté à ces problématiques, nous savions que cela pouvait arriver, et que le non-rattrapage des messages perdus devait se faire automatiquement.<br />
Je vais vous montrer comment procéder en gardant l'exemple de <em>send_astronaut_to_space. </em>Partons du principe que nous retenterons la publication de notre message au maximum 3 fois. Il nous faut donc créer 3 <em>queues </em>de <em>retry</em>. Fort heureusement, la configuration des <em>queues </em>et <em>exchanges </em>de <em>retry </em>est faite très facilement avec la librairie <a href="https://github.com/odolbeau/rabbit-mq-admin-toolkit">RabbitMQ Admin Toolkit</a>. En effet, il ne suffit que d'une ligne ! Voyons cela plus en détails :

<pre class="theme:sublime-text lang:yaml decode:true">
{% raw %}
# default_vhost.yml
# ...
queues:
    send_astronaut_to_space:
        durable: true
        retries: [5, 25, 100] # Create a retry exchange with 3 retry queues prefixed with send_astronaut_to_space
        bindings:
            - exchange: default
              routing_key: send_astronaut_to_space{% endraw %}
</pre>

Le tableau de paramètres de la clé <em>retries</em> correspondra à la durée à partir de laquelle le message sera republié. Suite au premier échec, 5 secondes s'écouleront avant de republier le message. Puis 25 secondes, et enfin 100 secondes. Ce comportement correspond très bien à la problématique rencontrée.

Si l'on relance notre commande de création de <em>vhost</em>, voici le résultat :

<pre class="theme:sublime-text lang:sh decode:true ">
{% raw %}
vendor/bin/rabbit vhost:mapping:create default_vhost.yml --host=127.0.0.1
Password?
With DL: false
With Unroutable: false
Create exchange default
Create exchange dl
Create queue send_astronaut_to_space
Create queue send_astronaut_to_space_dl
Create binding between exchange dl and queue send_astronaut_to_space_dl (with routing_key: send_astronaut_to_space)
Create queue send_astronaut_to_space_retry_1
Create binding between exchange retry and queue send_astronaut_to_space_retry_1 (with routing_key: send_astronaut_to_space_retry_1)
Create queue send_astronaut_to_space_retry_2
Create binding between exchange retry and queue send_astronaut_to_space_retry_2 (with routing_key: send_astronaut_to_space_retry_2)
Create queue send_astronaut_to_space_retry_3
Create binding between exchange retry and queue send_astronaut_to_space_retry_3 (with routing_key: send_astronaut_to_space_retry_3)
Create binding between exchange default and queue send_astronaut_to_space (with routing_key: send_astronaut_to_space){% endraw %}
</pre>

On créé l'<em>exchange</em> <em>default </em>comme précédemment. Ensuite, une multitude de nouvelles choses se fait :

<ul>
<li>Création de l'<em>exchange dl</em> et des <em>queues </em><em>send_astronaut_to_space </em>et <em>send_astronaut_to_space_dl</em> : nous reviendrons sur ce point plus tard.</li>
<li>Création de l'<em>exchange retry</em>, et de la <em>queue</em> <em>send_astronaut_to_space_retry_1</em>, <em>send_astronaut_to_space_retry_2</em> et<em> send_astronaut_to_space_retry_3 </em>: voici toute la partie qui va nous intéresser, l'ensemble des <em>queues </em>qui vont etre utilisées pour le <em>retry </em>de notre message.</li>
</ul>
Passons maintenant à la configuration côté consommation.

Avec Swarrot, la gestion des <em>retries</em> est très facile à mettre en place. Vous vous souvenez des <em>middlewares </em>dont je vous ai parlé plus haut ? Et bien, il existe un <em>middleware</em> pour ça !

<pre class="theme:sublime-text lang:yaml decode:true">
{% raw %}
# app/config/config.yml
    consumers:
# ...
            middleware_stack:
                - configurator: swarrot.processor.exception_catcher
                - configurator: swarrot.processor.ack
                - configurator: swarrot.processor.retry
                  extras:
                      retry_exchange: 'retry'
                      retry_attempts: 3
                      retry_routing_key_pattern: 'send_astronaut_to_space_retry_%%attempt%%'

    messages_types:
        send_astronaut_to_space_publisher:
            connection: rabbitmq
            exchange: default
            routing_key: send_astronaut_to_space{% endraw %}
</pre>

La différence avec la configuration précédente se situe uniquement au niveau du <em>middleware_stack</em> : on ajoute le processor <em>swarrot.processor.retry</em>, ainsi que la configuration de la stratégie de <em>retry</em> :

<ul>
<li>le nom de l'exchange de <em>retry </em>(défini précédemment)</li>
<li>le nombre de tentatives de republication</li>
<li>le pattern des <em>queues </em>de <em>retry</em></li>
</ul>
Le <em>workflow</em> va se faire ainsi : si le message n'est pas <em>acknowledged </em>suite à une exception, la première fois, il va être publié dans l'exchange <em>retry</em>, avec la<em> routing key </em><em>send_astronaut_to_space_retry_1, </em>puis 5 secondes après, republié dans la queue principale <em>send_astronaut_to_space</em>. Si le traitement du message rencontre encore une erreur, il va etre publié dans l'<em>exchange retry</em> avec la <em>routing key</em>  <em>send_astronaut_to_space_retry_2</em>, et au bout de 25 secondes, republié dans la <em>queue </em>principale. Et ainsi de suite.

<pre class="theme:sublime-text lang:sh decode:true">
{% raw %}
sf swarrot:consume:send_astronaut_to_space send_astronaut_to_space
[2017-01-12 12:53:41] app.WARNING: [Retry] An exception occurred. Republish message for the 1 times (key: send_astronaut_to_space_retry_1) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:53:46] app.WARNING: [Retry] An exception occurred. Republish message for the 2 times (key: send_astronaut_to_space_retry_2) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:54:11] app.WARNING: [Retry] An exception occurred. Republish message for the 3 times (key: send_astronaut_to_space_retry_3) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:55:51] app.WARNING: [Retry] Stop attempting to process message after 4 attempts {"swarrot_processor":"retry"}
[2017-01-12 12:55:51] app.ERROR: [Ack] An exception occurred. Message #4 has been nack'ed. {"swarrot_processor":"ack","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:55:51] app.ERROR: [ExceptionCatcher] An exception occurred. This exception has been caught. {"swarrot_processor":"exception","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}{% endraw %}
</pre>

Dans la création de notre <em>virtual host</em>, nous avons vu qu'un exchange <em>dl</em> ainsi qu'une queue <em>send_astronaut_to_space_dl</em> ont été créés. Cette queue va être la dernière étape dans le cas où notre message rencontre toujours une erreur.<br />
Si l'on regarde les détails de la queue <em>send_astronaut_to_space</em>, on voit que "<em>x-dead-letter-exchange</em>" a pour valeur "<em>dl</em>", et que "<em>x-dead-letter-routing-key</em>" a pour valeur "<em>send_astronaut_to_space</em>", correspondant à notre <em>binding </em>précédemment expliqué.

À chaque erreur rencontrée par notre <em>processor</em>, le <em>retryProcessor</em> va catcher cette erreur, et republier notre message dans la <em>queue</em> de <em>retry</em> autant de fois qu'on l'a configuré. Puis, Swarrot va laisser le champ libre à RabbitMQ pour router le message dans la queue <em>send_astronaut_to_space_dl.</em>

&nbsp;

&nbsp;

## Conclusion
Swarrot est une librairie qui vous permet de consommer et publier des messages de manière très simple. Son système de <em>middleware</em> vous permet d'accroitre les possibilités de consommation de vos messages.<br />
Couplé au RabbitMQ Admin Toolkit pour configurer vos <em>exchanges</em> et<em> </em><em>queues</em>, Swarrot vous permettra également de rattraper vos messages perdus très facilement.

&nbsp;

&nbsp;

## Références
<ul>
<li><a href="https://github.com/odolbeau/rabbit-mq-admin-toolkit">RabbitMQ Admin Toolkit</a></li>
<li><a href="https://github.com/swarrot/swarrot">Swarrot</a></li>
</ul>

