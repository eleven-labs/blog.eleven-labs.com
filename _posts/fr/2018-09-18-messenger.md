---
layout: post
title: "Symfony Messenger"
lang: fr
permalink: /fr/symfony-messenger/
excerpt: "Nous allons voir comment utiliser le nouveau composant Messenger de Symfony"
authors:
    - amoutte
categories:
    - php
    - symfony
    - messenger
tags:
    - php
    - symfony
    - messenger
cover: /assets/2018-09-11-messenger/cover.jpg
---

## Présentation générale

Le composant messenger nous apporte un message bus. Un message bus est un composant très simple qui permet de dispatcher un objet (message). Le bus a pour rôle d'exécuter le handler approprié au message. Durant ce processus le message va passer dans une pile ordonnée de middleware.

Les middlewares sont encapsulés les uns sur les autres autours du handler.

Exemple simplifier
```php
<?php
$handler = function ($value) {
    // Le code métier à exécuter
    return $value;
};

// ce middleware va encapsuler la réponse du middleware suivant avec du texte
$wrappingMiddleware = function (callable $handler) {
    return function ($string) use ($handler) {
        return 'before > ' . $handler('-' . $string . '-') . ' < after';
    };
};

// ce middleware va logguer dans un fichier les différentes exécutions de la stack d'exécution
$loggingMiddleware = function (callable $handler) {
    return function ($string) use ($handler) {
        $result = $handler($string);
        file_put_contents('dev.log', sprintf('Info: Input "%s" with output "%s".', $string, $result));

        return $result;
    };
};

// on encapsule les middlewares les uns sur les autres autour du handler
$middlewareStack = $loggingMiddleware(
        $wrappingMiddleware(
            $handler
        )
    );

// on exécute la stack de middleware ainsi que le handler
echo $middlewareStack('example string');
// will show "before > -example string- < after"
// le middleware logging aura quand à lui écrit "Info: Input "example string" with output "before > -example string- < after"" dans le fichier dev.log.
```

Les middlewares permettent d'ajouter un traitement avant ou après l'exécution du handler (ou du middleware suivant), c'est pourquoi l'ordre des middlewares est très important.

Dans le composant Messenger de symfony il existe 2 cas d'utilisation standard :
- Envoi de message (sender)
- Réception de message (receiver)

## Envoi de message

Un message est envoyé depuis le système vers une destination. Par exemple cette destination peut être un message broker ou un endpoint API.

Vous pourriez creer un Handler qui envoie le message à votre destination mais symfony met à disposition un `SendMessageMiddleware`.

Vous n'aurez donc qu'à configurer le routage des objets vers le transport souhaité :

```yaml
framework:
    messenger:
        transports:
            amqp: '%env(MESSENGER_TRANSPORT_DSN)%'

        routing:
             'App\MyModel': amqp
```

Reportez-vous à la [documentation](https://symfony.com/doc/current/messenger.html#routing) pour les différentes syntaxes possibles.

## Réception de message

Un message entre dans le système de manière synchrone (endpoint API/controlleur) ou asynchrone (via worker/queue).
Le message reçu est donc encapsulé avec une enveloppe `ReceivedMessage` avant d'être dispatché dans le message bus.

> L'enveloppe `ReceivedMessage` permet d'éviter au bus de renvoyer le message au sender (boucle infinie).

Pour traiter un message il faudra créer un handler avec une méthode `__invoke` (si vous avez déjà une méthode, utilisez l'attribut `handles` dans le tag de définition du service. Voir plus bas).

Par exemple :

```php
<?php
// src/MessageHandler/MyMessageHandler.php
namespace App\MessageHandler;

use App\MyModel;

class MyModelHandler
{
    public function __invoke(MyModel $message)
    {
        // do something with it.
    }
}
```

et ensuite l'enregistrer dans symfony

```yaml
# config/services.yaml
services:
    App\MessageHandler\MyModelHandler:
        tags: [messenger.message_handler]
```

Si symfony n'arrive pas à deviner le type de message, vous pouvez utiliser la syntaxe complète afin de spécifier la méthode à appeler et ou le modèle supporté.
```yaml
# config/services.yaml
services:
    App\MessageHandler\MyModelHandler:
        tags:
             - {name: 'messenger.message_handler', method: 'process', handles: 'App\MyModel'}
```

## Consommer des messages

Le composant met également à disposition une commande `bin/console messenger:consume-messages {TRANSPORT_NAME}` afin de lancer un worker qui va écouter/consulter le transport et dispatcher un message dans le bus.
Dans le cas du transport `amqp` le worker dispatchera chaque message de la queue du broker.
Mais il est tout à fait possible de récupérer les changements d'un résultat d'API.


Par exemple :
```php
<?php

namespace App\Receiver;

use Symfony\Component\Messenger\Transport\ReceiverInterface;
use Symfony\Component\Messenger\Envelope;

class APIMeteoReceiver implements ReceiverInterface
{
    /**
     * Last API result
     */
    private $result;
    private $shouldStop;

    public function receive(callable $handler): void
    {
        while (!$this->shouldStop) {
            $result = file_get_contents("{URL d'une API de meteo}");

            // si le résultat est le même que le précédent on attend une seconde avant de recommencer
            if ($this->result === $result) {
                sleep(1);
                continue;
            }

            $this->result = $result;

            // Si la météo a changé on dispatche la nouvelle météo dans le bus
            $handler(new Envelope($this->result));
        }
    }

    public function stop(): void
    {
        $this->shouldStop = true;
    }
}
```

Dans l'exemple précédent on ne dispatche que lorsque la météo change

## Conclusion

Voila un premier tour d'horizon du composant Messenger.
Bien que le concept du message bus soit assez simple, l'implémentation du composant ne l'est pas autant.
Et étant donné que le composant est encore expérimental et que la documentation s'étoffe petit à petit c'est donc encore un composant mal connu et peu utilisé pour le moment.
Par ailleurs le composant Messenger nous apporte plein d'outils et nous laisse un grand niveau de personnalisation.
C'est pourquoi une bonne compréhension du concept et une bonne prise en main sont préférables pour une exploitation maximum du potentiel.

Sachez qu'il est également possible d'implémenter vos propres `Transport` `Middleware` `Sender` `Receiver`.
Vous avez en plus de cela la possibilité de créer plusieurs bus dans l'application afin de bien compartimenter votre logique.

### Liens utiles

- [Command Bus](https://matthiasnoback.nl/tags/command%20bus/)
- [Simple Bus](http://simplebus.io/)
- [Composant Messenger](https://symfony.com/doc/current/components/messenger.html)
- [how to use messenger](https://symfony.com/doc/current/messenger.html)
