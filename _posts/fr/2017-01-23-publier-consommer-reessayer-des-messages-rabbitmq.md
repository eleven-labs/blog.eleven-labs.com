---
lang: fr
date: '2017-01-23'
slug: publier-consommer-reessayer-des-messages-rabbitmq
title: 'Publier, consommer, et réessayer des messages RabbitMQ'
excerpt: >-
  ![Swarrot
  Logo](/_assets/posts/2017-01-23-publier-consommer-reessayer-des-messages-rabbitmq/logo.png)
authors:
  - rpierlot
categories:
  - php
keywords:
  - symfony
  - rabbitmq
---

![Swarrot Logo](/_assets/posts/2017-01-23-publier-consommer-reessayer-des-messages-rabbitmq/logo.png)

RabbitMQ est un gestionnaire de queues, permettant d'asynchroniser différents traitements. Si vous n'êtes pas familier avec cet outil, un [article](https://blog.eleven-labs.com/fr/creer-rpc-rabbitmq/){:rel="nofollow noreferrer"} traitant du sujet a déjà été écrit précédemment, je vous invite donc à le lire.

Ce que j'aimerais vous présenter ici correspond à la mise en place du cycle de vie d'un message, avec une gestion des erreurs. Le tout, en quelques lignes de code.

Ainsi, nous allons voir ensemble comment configurer son _virtual host_ RabbitMQ, publier un message, le consommer, puis le "rattraper" si ce dernier rencontre une erreur lors de la consommation.

## Nos outils

La solution technique s'organise aurour de deux librairies :

*   [RabbitMQ Admin Toolkit](https://github.com/odolbeau/rabbit-mq-admin-toolkit){:rel="nofollow noreferrer"} : librairie PHP qui permet d'interagir avec l'API HTTP de notre serveur RabbitMQ pour y créer les _exchanges_, les _queues_...
*   [Swarrot](https://github.com/swarrot/swarrot){:rel="nofollow noreferrer"} : librairie PHP qui permet de consommer nos messages.

Swarrot est compatible avec l'extension amqp de PHP ainsi la librairie [php-amqplib](https://github.com/php-amqplib/php-amqplib). L'extension PHP possède un avantage certain en performances (écrite en C) sur la librairie d'après les [benchmarks](https://odolbeau.fr/blog/benchmark-php-amqp-lib-amqp-extension-swarrot.html). Pour installer l'extension, rendez-vous [ici](https://serverpilot.io/community/articles/how-to-install-the-php-amqp-extension.html){:rel="nofollow noreferrer"}.
Le principal concurrent de Swarrot, [RabbitMqBundle](https://github.com/php-amqplib/RabbitMqBundle){:rel="nofollow noreferrer"}, n'est pas compatible avec l'extension PHP, et n'est pas aussi simple dans sa configuration et son utilisation.

## Configuration

Notre première étape va être de créer notre configuration RabbitMQ : notre _exchange_ et notre _queue_.

La librairie RabbitMQ Admin Toolkit, développée par _[odolbeau](https://github.com/odolbeau){:rel="nofollow noreferrer"},_ permet de configurer notre vhost très simplement. Voici une config très basique déclarant un _exchange _et une _queue_ nous permettant d'envoyer Wilson et ses camarades dans l'espace :

```yaml
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
```

Ici, on demande donc la création d'un _echange_ nommé "default", et d'une _queue_ "send_astronaut_to_space", associé à notre échange par une _routing key_ homonyme.
Un _binding_ est une relation entre un _exchange_ et une _queue._

Lançons la commande pour la création de notre vhost :

```bash
vendor/bin/rabbit vhost:mapping:create default_vhost.yml --host=127.0.0.1
Password?
With DL: false
With Unroutable: false
Create exchange default
Create queue send_astronaut_to_space
Create binding between exchange default and queue send_astronaut_to_space (with routing_key: send_astronaut_to_space)
```

En vous connectant sur votre interface RabbitMQ management (ex: http://127.0.0.1:15672/), plusieurs choses apparaissent :

![Capture of exchanges created](/_assets/posts/2017-01-23-publier-consommer-reessayer-des-messages-rabbitmq/create_exchanges.png)

En cliquant sur l'onglet _Exchanges_, un exchange _default_ a été créé avec un _binding_ avec notre _queue_, comme indiqué dans la console.

![Capture of queues created](/_assets/posts/2017-01-23-publier-consommer-reessayer-des-messages-rabbitmq/create_queues.png)

Si l'on clique maintenant sur _Queues_, _send_astronaut_to_space_ est également présente. Jusqu'à présent, pas de problèmes.

Passons maintenant à la partie publication et consommation de messages.

## Consommation

La librairie PHP qui va nous aider à consommer et publier nos messages, Swarrot, possède un bundle Symfony, qui va nous permettre de l'utiliser simplement dans notre application : [SwarrotBundle](https://github.com/swarrot/SwarrotBundle){:rel="nofollow noreferrer"}.

Nous devons donc publier des messages, et ensuite les consommer. Voici comment le faire très simplement.

Une fois votre bundle installé, il est nécessaire de configurer le bundle :

```yaml
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
                - configurator: swarrot.processor.ack
```

Voici donc un exemple de configuration. La partie intéressante arrive à partir du paramètre _consumers_.

Chaque message publié dans un _exchange_ sera acheminé vers une _queue_ en fonction de sa _routing key_. Ainsi, il nous est donc nécessaire de traiter une message stocké dans une _queue_. Dans Swarrot, ce sont les _processors_ qui s'occcupent de cela.
Pour consommer notre message, il nous est donc nécessaire de créer notre propre _processor_. Comme indiqué dans la documentation, un _processor_ est simplement un service Symfony qui doit implémenter l'interface _ProcessorInterface_.

![Swarrot - Middleware stack](https://camo.githubusercontent.com/8ac89cd415aebfb1026b2278093dbcc986b126da/68747470733a2f2f646f63732e676f6f676c652e636f6d2f64726177696e67732f642f3145615f514a486f2d3970375957386c5f62793753344e494430652d41477058527a7a6974416c59593543632f7075623f773d39363026683d373230){:rel="nofollow noreferrer"}

La particularité des _processors_ est qu'ils fonctionnent avec des _middlewares_, permettant d'ajouter du comportement avant et/ou après le traitement de notre message (notre processeur). C'est pour cela qu'il y a le paramètre _middleware_stack_, qui contient deux choses : _swarrot.processor.exception_catcher_ et _swarrot.processor.ack_. Bien que facultatifs, ces middlewares apportent une souplesse non négligeable. Nous y reviendrons dans la suite de cet article.

```php
<?php

namespace AppBundle\Processor;

use Swarrot\Broker\Message;
use Swarrot\Processor\ProcessorInterface;

class SendAstronautToSpace implements ProcessorInterface
{
    public function process(Message $message, array $options)
    {
        //...
    }
}
```

Notre _processor_ SendAstronautToSpace implémente la méthode _process_, qui nous permet de récupérer le message à consommer, et l'utiliser dans notre application.

Nous venons donc de mettre en place la consommation de nos messages. Que nous reste-t-il à faire ? La publication bien sûr !

## Publication

Encore une fois, il est très simple de publier des messages avec Swarrot. Il nous suffit juste de déclarer un _publisher_ dans notre configuration et d'utiliser le service de publication du SwarrotBundle pour publier un nouveau message.

```yaml
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
            routing_key: send_astronaut_to_space
```

Le secret est de déclarer un nouveau type de message, en spécificant la _connection_, l'_exchange_, et la _routing key_, et de publier un message de cette façon :

```php
<?php

$message = new Message('Wilson wants to go to space');
$this->get('swarrot.publisher')->publish('send_astronaut_to_space_publisher', $message);
```

Le service Symfony _swarrot.publisher_ s'occupe ainsi de la publication de notre message. Simple tout cela non ?

Avec la mise en place des _queues_, la publication, la consommation des messages, la boucle est bouclée.

## Gestion des erreurs

Un dernier aspect que j'aimerai partager avec vous concerne les erreurs lors de la consommation de vos messages.

Mis à part les problèmes d'implémentation dans votre code, il est possible que vous rencontriez des exceptions, dues à des causes "externes". Par exemple, vous avez un processeur qui doit faire une requête HTTP à un autre service. Ce dernier peut ne pas répondre temporairement, ou être en erreur. Vous avez besoin de publier le message sans que ce dernier ne soit perdu. Ne serait-il pas bien de republier le message si le service ne répond pas, et de le faire après un certain laps de temps ? Faire ce que l'on appelle en anglais un _retry_ ?

Il m'est arrivé d'être confronté à ces problématiques, nous savions que cela pouvait arriver, et que le non-rattrapage des messages perdus devait se faire automatiquement.
Je vais vous montrer comment procéder en gardant l'exemple de _send_astronaut_to_space._ Partons du principe que nous retenterons la publication de notre message au maximum 3 fois. Il nous faut donc créer 3 _queues_ de _retry_. Fort heureusement, la configuration des _queues_ et _exchanges_ de _retry_ est faite très facilement avec la librairie [RabbitMQ Admin Toolkit](https://github.com/odolbeau/rabbit-mq-admin-toolkit){:rel="nofollow noreferrer"}. En effet, il ne suffit que d'une ligne ! Voyons cela plus en détails :

```yaml
# default_vhost.yml
# ...
queues:
    send_astronaut_to_space:
        durable: true
        retries: [5, 25, 100] # Create a retry exchange with 3 retry queues prefixed with send_astronaut_to_space
        bindings:
            - exchange: default
              routing_key: send_astronaut_to_space
```

Le tableau de paramètres de la clé _retries_ correspondra à la durée à partir de laquelle le message sera republié. Suite au premier échec, 5 secondes s'écouleront avant de republier le message. Puis 25 secondes, et enfin 100 secondes. Ce comportement correspond très bien à la problématique rencontrée.

Si l'on relance notre commande de création de _vhost_, voici le résultat :

```bash
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
Create binding between exchange default and queue send_astronaut_to_space (with routing_key: send_astronaut_to_space)
```

On créé l'_exchange_ _default_ comme précédemment. Ensuite, une multitude de nouvelles choses se fait :

*   Création de l'_exchange dl_ et des _queues __send_astronaut_to_space _et _send_astronaut_to_space_dl_ : nous reviendrons sur ce point plus tard.
*   Création de l'_exchange retry_, et de la _queue_ _send_astronaut_to_space_retry_1_, _send_astronaut_to_space_retry_2_ et_ send_astronaut_to_space_retry_3 _: voici toute la partie qui va nous intéresser, l'ensemble des _queues_ qui vont etre utilisées pour le _retry_ de notre message.

Passons maintenant à la configuration côté consommation.

Avec Swarrot, la gestion des _retries_ est très facile à mettre en place. Vous vous souvenez des _middlewares_ dont je vous ai parlé plus haut ? Et bien, il existe un _middleware_ pour ça !

```yaml
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
            routing_key: send_astronaut_to_space
```

La différence avec la configuration précédente se situe uniquement au niveau du _middleware_stack_ : on ajoute le processor _swarrot.processor.retry_, ainsi que la configuration de la stratégie de _retry_ :

*   le nom de l'exchange de _retry_(défini précédemment)
*   le nombre de tentatives de republication
*   le pattern des _queues_de _retry_

Le _workflow_ va se faire ainsi : si le message n'est pas _acknowledged_ suite à une exception, la première fois, il va être publié dans l'exchange _retry_, avec la _routing key_ _send_astronaut_to_space_retry_1,_ puis 5 secondes après, republié dans la queue principale _send_astronaut_to_space_. Si le traitement du message rencontre encore une erreur, il va etre publié dans l'_exchange retry_ avec la _routing key_ _send_astronaut_to_space_retry_2_, et au bout de 25 secondes, republié dans la _queue_ principale. Et ainsi de suite.

```bash
sf swarrot:consume:send_astronaut_to_space send_astronaut_to_space
[2017-01-12 12:53:41] app.WARNING: [Retry] An exception occurred. Republish message for the 1 times (key: send_astronaut_to_space_retry_1) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:53:46] app.WARNING: [Retry] An exception occurred. Republish message for the 2 times (key: send_astronaut_to_space_retry_2) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:54:11] app.WARNING: [Retry] An exception occurred. Republish message for the 3 times (key: send_astronaut_to_space_retry_3) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:55:51] app.WARNING: [Retry] Stop attempting to process message after 4 attempts {"swarrot_processor":"retry"}
[2017-01-12 12:55:51] app.ERROR: [Ack] An exception occurred. Message #4 has been nack'ed. {"swarrot_processor":"ack","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:55:51] app.ERROR: [ExceptionCatcher] An exception occurred. This exception has been caught. {"swarrot_processor":"exception","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
```

Dans la création de notre _virtual host_, nous avons vu qu'un exchange _dl_ ainsi qu'une queue _send_astronaut_to_space_dl_ ont été créés. Cette queue va être la dernière étape dans le cas où notre message rencontre toujours une erreur.
Si l'on regarde les détails de la queue _send_astronaut_to_space_, on voit que "_x-dead-letter-exchange_" a pour valeur "_dl_", et que "_x-dead-letter-routing-key_" a pour valeur "_send_astronaut_to_space_", correspondant à notre _binding_ précédemment expliqué.

À chaque erreur rencontrée par notre _processor_, le _retryProcessor_ va catcher cette erreur, et republier notre message dans la _queue_ de _retry_ autant de fois qu'on l'a configuré. Puis, Swarrot va laisser le champ libre à RabbitMQ pour router le message dans la queue _send_astronaut_to_space_dl._

## Conclusion

Swarrot est une librairie qui vous permet de consommer et publier des messages de manière très simple. Son système de _middleware_ vous permet d'accroitre les possibilités de consommation de vos messages.
Couplé au RabbitMQ Admin Toolkit pour configurer vos _exchanges_ et _queues_, Swarrot vous permettra également de rattraper vos messages perdus très facilement.

## Références

*   [RabbitMQ Admin Toolkit](https://github.com/odolbeau/rabbit-mq-admin-toolkit){:rel="nofollow noreferrer"}
*   [Swarrot](https://github.com/swarrot/swarrot){:rel="nofollow noreferrer"}
