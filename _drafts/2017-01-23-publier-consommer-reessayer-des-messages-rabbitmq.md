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

![See original image](https://avatars2.githubusercontent.com/u/6749375?v=3&s=400)

RabbitMQ est un gestionnaire de queues, permettant d'asynchroniser différents traitements. Si vous n'êtes pas familier avec cet outil, un [article](http://blog.eleven-labs.com/fr/creer-rpc-rabbitmq/) traitant du sujet a déjà été écrit précédemment, je vous invite donc à le lire.

Ce que j'aimerais vous présenter ici correspond à la mise en place du cycle de vie d'un message, avec une gestion des erreurs. Le tout, en quelques lignes de code.

Ainsi, nous allons voir ensemble comment configurer son *virtual host *RabbitMQ, publier un message, le consommer, puis le "rattraper" si ce dernier rencontre une erreur lors de la consommation.

 

Nos outils
----------

La solution technique s'organise aurour de deux librairies :

-   [RabbitMQ Admin Toolkit](https://github.com/odolbeau/rabbit-mq-admin-toolkit) : librairie PHP qui permet d'interagir avec l'API HTTP de notre serveur RabbitMQ pour y créer les *exchanges*, les *queues*...
-   [Swarrot](https://github.com/swarrot/swarrot) : librairie PHP qui permet de consommer nos messages.

Swarrot est compatible avec l'extension amqp de PHP ainsi la librairie [php-amqplib](https://github.com/php-amqplib/php-amqplib). L'extension PHP possède un avantage certain en performances (écrite en C) sur la librairie d'après les [benchmarks](https://odolbeau.fr/blog/benchmark-php-amqp-lib-amqp-extension-swarrot.html). Pour installer l'extension, rendez-vous [ici](https://serverpilot.io/community/articles/how-to-install-the-php-amqp-extension.html).
Le principal concurrent de Swarrot, [RabbitMqBundle](https://github.com/php-amqplib/RabbitMqBundle), n'est pas compatible avec l'extension PHP, et n'est pas aussi simple dans sa configuration et son utilisation.

Configuration
-------------

Notre première étape va être de créer notre configuration RabbitMQ : notre *exchange *et notre *queue*.

La librairie RabbitMQ Admin Toolkit, développée par *[odolbeau](https://github.com/odolbeau),* permet de configurer notre vhost très simplement. Voici une config très basique déclarant un *exchange *et une *queue* nous permettant d'envoyer Wilson et ses camarades dans l'espace :

``` theme:sublime-text
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

Ici, on demande donc la création d'un *echange *nommé "default", et d'une *queue *"send\_astronaut\_to\_space", associé à notre échange par une *routing key *homonyme.
Un *binding* est une relation entre un *exchange *et une *queue.*

Lançons la commande pour la création de notre vhost :

``` theme:sublime-text
vendor/bin/rabbit vhost:mapping:create default_vhost.yml --host=127.0.0.1
Password?
With DL: false
With Unroutable: false
Create exchange default
Create queue send_astronaut_to_space
Create binding between exchange default and queue send_astronaut_to_space (with routing_key: send_astronaut_to_space)
```

En vous connectant sur votre interface RabbitMQ management (ex: http://127.0.0.1:15672/), plusieurs choses apparaissent :

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-27-13-12-34.png)

En cliquant sur l'onglet *Exchanges*, un exchange *default* a été créé avec un *binding* avec notre *queue*, comme indiqué dans la console.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-27-13-13-29.png)

Si l'on clique maintenant sur *Queues*, *send\_astronaut\_to\_space* est également présente. Jusqu'à présent, pas de problèmes.

Passons maintenant à la partie publication et consommation de messages.

Consommation
------------

La librairie PHP qui va nous aider à consommer et publier nos messages, Swarrot, possède un bundle Symfony, qui va nous permettre de l'utiliser simplement dans notre application : [SwarrotBundle](https://github.com/swarrot/SwarrotBundle).

Nous devons donc publier des messages, et ensuite les consommer. Voici comment le faire très simplement.

Une fois votre bundle installé, il est nécessaire de configurer le bundle :

``` theme:sublime-text
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

Voici donc un exemple de configuration. La partie intéressante arrive à partir du paramètre *consumers*.

Chaque message publié dans un *exchange* sera acheminé vers une *queue* en fonction de sa *routing key*. Ainsi, il nous est donc nécessaire de traiter une message stocké dans une *queue*. Dans Swarrot, ce sont les *processors* qui s'occcupent de cela.
Pour consommer notre message, il nous est donc nécessaire de créer notre propre *processor*. Comme indiqué dans la documentation, un *processor* est simplement un service Symfony qui doit implémenter l'interface *ProcessorInterface*.

\[caption id="" align="aligncenter" width="548"\]![Swarrot - Middleware stack](https://camo.githubusercontent.com/8ac89cd415aebfb1026b2278093dbcc986b126da/68747470733a2f2f646f63732e676f6f676c652e636f6d2f64726177696e67732f642f3145615f514a486f2d3970375957386c5f62793753344e494430652d41477058527a7a6974416c59593543632f7075623f773d39363026683d373230) Swarrot - Middleware stack\[/caption\]

La particularité des *processors* est qu'ils fonctionnent avec des *middlewares*, permettant d'ajouter du comportement avant et/ou après le traitement de notre message (notre processeur). C'est pour cela qu'il y a le paramètre *middleware\_stack*, qui contient deux choses : *swarrotot.processor.exception\_catcher *et *swarrot.processor.ack*. Bien que facultatifs, ces middlewares apportent une souplesse non négligeable. Nous y reviendrons dans la suite de cet article.

``` theme:sublime-text
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

Notre *processor *SendAstronautToSpace implémente la méthode *process*, qui nous permet de récupérer le message à consommer, et l'utiliser dans notre application.

Nous venons donc de mettre en place la consommation de nos messages. Que nous reste-t-il à faire ? La publication bien sûr !

Publication
-----------

Encore une fois, il est très simple de publier des messages avec Swarrot. Il nous suffit juste de déclarer un *publisher* dans notre configuration et d'utiliser le service de publication du SwarrotBundle pour publier un nouveau message.

``` theme:sublime-text
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

Le secret est de déclarer un nouveau type de message, en spécificant la *connection*, l'*exchange*, et la *routing key*, et de publier un message de cette façon :

``` theme:sublime-text
<?php

$message = new Message('Wilson wants to go to space');
$this->get('swarrot.publisher')->publish('send_astronaut_to_space_publisher', $message);
```

Le service Symfony *swarrot.publisher* s'occupe ainsi de la publication de notre message. Simple tout cela non ?

Avec la mise en place des *queues*, la publication, la consommation des messages, la boucle est bouclée.

Gestion des erreurs
-------------------

Un dernier aspect que j'aimerai partager avec vous concerne les erreurs lors de la consommation de vos messages.

Mis à part les problèmes d'implémentation dans votre code, il est possible que vous rencontriez des exceptions, dues à des causes "externes". Par exemple, vous avez un processeur qui doit faire une requête HTTP à un autre service. Ce dernier peut ne pas répondre temporairement, ou être en erreur. Vous avez besoin de publier le message sans que ce dernier ne soit perdu. Ne serait-il pas bien de republier le message si le service ne répond pas, et de le faire après un certain laps de temps ? Faire ce que l'on appelle en anglais un *retry* ?

Il m'est arrivé d'être confronté à ces problématiques, nous savions que cela pouvait arriver, et que le non-rattrapage des messages perdus devait se faire automatiquement.
Je vais vous montrer comment procéder en gardant l'exemple de *send\_astronaut\_to\_space. *Partons du principe que nous retenterons la publication de notre message au maximum 3 fois. Il nous faut donc créer 3 *queues *de *retry*. Fort heureusement, la configuration des *queues *et *exchanges *de *retry *est faite très facilement avec la librairie [RabbitMQ Admin Toolkit](https://github.com/odolbeau/rabbit-mq-admin-toolkit). En effet, il ne suffit que d'une ligne ! Voyons cela plus en détails :

``` theme:sublime-text
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

Le tableau de paramètres de la clé *retries* correspondra à la durée à partir de laquelle le message sera republié. Suite au premier échec, 5 secondes s'écouleront avant de republier le message. Puis 25 secondes, et enfin 100 secondes. Ce comportement correspond très bien à la problématique rencontrée.

Si l'on relance notre commande de création de *vhost*, voici le résultat :

``` theme:sublime-text
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

On créé l'*exchange* *default *comme précédemment. Ensuite, une multitude de nouvelles choses se fait :

-   Création de l'*exchange dl* et des *queues send\_astronaut\_to\_space *et *send\_astronaut\_to\_space\_dl* : nous reviendrons sur ce point plus tard.
-   Création de l'*exchange retry*, et de la *queue* *send\_astronaut\_to\_space\_retry\_1*, *send\_astronaut\_to\_space\_retry\_2* et* send\_astronaut\_to\_space\_retry\_3 *: voici toute la partie qui va nous intéresser, l'ensemble des *queues *qui vont etre utilisées pour le *retry *de notre message.

Passons maintenant à la configuration côté consommation.

Avec Swarrot, la gestion des *retries* est très facile à mettre en place. Vous vous souvenez des *middlewares *dont je vous ai parlé plus haut ? Et bien, il existe un *middleware* pour ça !

``` theme:sublime-text
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

La différence avec la configuration précédente se situe uniquement au niveau du *middleware\_stack* : on ajoute le processor *swarrot.processor.retry*, ainsi que la configuration de la stratégie de *retry* :

-   le nom de l'exchange de *retry *(défini précédemment)
-   le nombre de tentatives de republication
-   le pattern des *queues *de *retry*

Le *workflow* va se faire ainsi : si le message n'est pas *acknowledged *suite à une exception, la première fois, il va être publié dans l'exchange *retry*, avec la *routing key send\_astronaut\_to\_space\_retry\_1,* puis 5 secondes après, republié dans la queue principale *send\_astronaut\_to\_space*. Si le traitement du message rencontre encore une erreur, il va etre publié dans l'*exchange retry* avec la *routing key*  *send\_astronaut\_to\_space\_retry\_2*, et au bout de 25 secondes, republié dans la *queue *principale. Et ainsi de suite.

``` theme:sublime-text
sf swarrot:consume:send_astronaut_to_space send_astronaut_to_space
[2017-01-12 12:53:41] app.WARNING: [Retry] An exception occurred. Republish message for the 1 times (key: send_astronaut_to_space_retry_1) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:53:46] app.WARNING: [Retry] An exception occurred. Republish message for the 2 times (key: send_astronaut_to_space_retry_2) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:54:11] app.WARNING: [Retry] An exception occurred. Republish message for the 3 times (key: send_astronaut_to_space_retry_3) {"swarrot_processor":"retry","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:55:51] app.WARNING: [Retry] Stop attempting to process message after 4 attempts {"swarrot_processor":"retry"}
[2017-01-12 12:55:51] app.ERROR: [Ack] An exception occurred. Message #4 has been nack'ed. {"swarrot_processor":"ack","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
[2017-01-12 12:55:51] app.ERROR: [ExceptionCatcher] An exception occurred. This exception has been caught. {"swarrot_processor":"exception","exception":"[object] (Exception(code: 0): An error occurred while consuming hello at /home/gus/dev/swarrot/src/AppBundle/Processor/SendAstronautToSpace.php:12)"}
```

Dans la création de notre *virtual host*, nous avons vu qu'un exchange *dl* ainsi qu'une queue *send\_astronaut\_to\_space\_dl* ont été créés. Cette queue va être la dernière étape dans le cas où notre message rencontre toujours une erreur.
Si l'on regarde les détails de la queue *send\_astronaut\_to\_space*, on voit que "*x-dead-letter-exchange*" a pour valeur "*dl*", et que "*x-dead-letter-routing-key*" a pour valeur "*send\_astronaut\_to\_space*", correspondant à notre *binding *précédemment expliqué.

À chaque erreur rencontrée par notre *processor*, le *retryProcessor* va catcher cette erreur, et republier notre message dans la *queue* de *retry* autant de fois qu'on l'a configuré. Puis, Swarrot va laisser le champ libre à RabbitMQ pour router le message dans la queue *send\_astronaut\_to\_space\_dl.*

 

 

Conclusion
----------

Swarrot est une librairie qui vous permet de consommer et publier des messages de manière très simple. Son système de *middleware* vous permet d'accroitre les possibilités de consommation de vos messages.
Couplé au RabbitMQ Admin Toolkit pour configurer vos *exchanges* et* queues*, Swarrot vous permettra également de rattraper vos messages perdus très facilement.

 

 

Références
----------

-   [RabbitMQ Admin Toolkit](https://github.com/odolbeau/rabbit-mq-admin-toolkit)
-   [Swarrot](https://github.com/swarrot/swarrot)

