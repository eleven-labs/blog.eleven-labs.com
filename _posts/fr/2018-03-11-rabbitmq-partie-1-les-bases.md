---
layout: post
title: RabbitMQ des bases à la maîtrise (Partie 1) 
lang: fr
permalink: /fr/rabbitmq-partie-1-les-bases/
excerpt: "Rabbitmq est un message broker très complet et robuste, c'est pourquoi le comprendre et l'utilisé est assez simple par contre le maîtriser l'est un peu moins."
authors:
    - amoutte
categories:
    - rabbitMQ
    - broker
    - queuing
    - retry
tags:
    - rabbitMQ
    - broker
    - queuing
    - retry
cover: /assets/2018-03-11-rabbitmq-partie-1-les-bases/cover.jpg
---

# RabbitMQ des bases à la maîtrise (Partie 1)

RabbitMQ est un message broker très complet et robuste, c'est pourquoi le comprendre et l'utilisé est assez simple
par contre le maîtriser l'est un peu moins.

*Donc avant de manger du pâté de lapin il va falloir bouffer des carottes!*

## Introduction

RabbitMQ a de nombreux points fort ce qui en fais une solution utilisable sur tout type/taille de projet.
Voici quelque uns des ces points fort:

- utilise AMQP (courante: 0.9.1)
- développé en `Erlang` ce qui en fais un logiciel très robuste
- system de *clustering* pour la haute disponibilité et la scalabilité 
- un system de [plugins](https://www.rabbitmq.com/plugins.html) qui permet d'apporter d'autre fonctionnalité (management, ldap, shovel, mqtt, stomp, tracing, AMQP 1.0)
- les vhost permettent de cloisonner des environnements (mutualisé le serveur, env dev/preprod/prod)
- *Quality Of Service* (QOS) permet de prioriser les messages

## AMQP

*Ok donc on va commencer par semer des carottes*

Afin de pouvoir utilisé efficacement RabbitMQ il faut comprendre le fonctionnement du protocol `AMQP`.

Voici le fonctionnement global du `broker`.

> Le `publisher` va envoyer un `message` dans un `exchange` qui va, en fonction du `binding`, router le `message` vers la ou les `queues`.

![RabbitMQ Broker]({{site.baseurl}}/assets/2018-03-11-rabbitmq-partie-1-les-bases/rabbitmq-broker.jpg)

Nous allons donc détaillés les différents éléments qui compose le `broker`.

### Le message

Le message est comme une requête HTTP, il contient des `attributs` ainsi qu'un `payload`.
Parmi les `attributs` du protocol vous pouvez y ajouter des `headers` depuis votre publisher.

> Liste des properties du protocol 
> content_type, content_encoding, priority, correlation_id, reply_to, expiration, message_id, timestamp, type, user_id, app_id, cluster_id  

Les `headers` seront disponibles dans `attributes[headers]`.

L'attribut `routing_key` bien qu'optionnel n'en est pas moins très utile dans le protocol.

### Le Broker

RabbitMQ est un message broker, son rôle est de transporter et router les messages depuis les publishers vers les consumers. 
Le broker utilise les `exchanges` et `bindings` pour savoir si il doit délivrer, ou non, le message dans la queue. 

### Les Exchanges

Un `exchange` est un routeur de message. Il existe différent type de routage définit par le type d'`exchange`.

Important à savoir: l'`exchange` `amq.default` est l'`exchange` par défaut de rabbit. Vous ne pouvez ni le supprimer ni vous binder dessus.

*Cet exchange est auto binder avec toutes les `queues` avec une routing key égale au nom de la queue.*  

![RabbitMQ Broker]({{site.baseurl}}/assets/2018-03-11-rabbitmq-partie-1-les-bases/rabbitmq-exchange-default.jpg)

**Vous publiez dans un exchange.**

**Vous ne consommer pas un exchange!**

#### L'exchange type fanout

L'`exchange` `fanout` est le plus simple. En effet il délivre le message à **toutes** les queue binder.

![RabbitMQ Broker]({{site.baseurl}}/assets/2018-03-11-rabbitmq-partie-1-les-bases/rabbitmq-exchange-fanout.jpg)

#### L'exchange type direct

L'`exchange` `direct n'autorise que le binding utilisant strictement la routing key.

![RabbitMQ Broker]({{site.baseurl}}/assets/2018-03-11-rabbitmq-partie-1-les-bases/rabbitmq-exchange-direct.jpg)

Si la `routing_key` du message est strictement égale à la `routing_key` spécifier dans le binding alors le message sera délivré à la queue.

> binding.routing_key == message.routing_key 

#### L'exchange type topic

L'`exchange` `topic délivre le message si `routing_key` du message match le pattern définis dans le binding.

![RabbitMQ Broker]({{site.baseurl}}/assets/2018-03-11-rabbitmq-partie-1-les-bases/rabbitmq-exchange-topic.jpg)

Un routing key est composé de plusieurs segment séparer par des `.`. Il y a également 2 caractères utilisé dans le matching.
`*` n'importe quel valeur de segment
`#` n'importe quel valeur de segment une ou plusieurs fois 

Par exemple pour la routing key `foo.bar.baz`

- `foo.*.baz` match
- `foo.*.*` match
- `foo.#` match
- `foo.#.baz` match
- `*.*.baz` match
- `#.baz` match
- `#.bar.baz` match
- `#` match
- `foo.*` **non trouver**

> match(binding.routing_key, message.routing_key) 

#### L'exchange type headers

L'`exchange` headers délivre le message si les `headers` du binding match les headers du message.

![RabbitMQ Broker]({{site.baseurl}}/assets/2018-03-11-rabbitmq-partie-1-les-bases/rabbitmq-exchange-headers.jpg)

L'option `x-match` dans le binding permet de définir si **un seul** header ou **tous** doivent matcher.

Avec le `x-match = any` le message sera délivré si un seul des headers du binding correspond a un header du message. 

> x-match = any
> binding.headers[attrName1] == message.headers[attrName1] || binding.headers[attrName2] == message.headers[attrName2]

*Le message sera délivré si le header `attrName1` (configurer au moment du binding) est égal au header `attrName1` du message* 

OU

*si le header `attrName2` est égal au header `attrName2` du message.*
 
Avec le `x-match = all` le message sera délivré si **tous** les headers du binding correspond aux header du message.

> x-match = all
> binding.headers[attrName1] == message.headers[attrName1] && binding.headers[attrName2] == message.headers[attrName2]

*Ici le message sera délivré seulement si les headers `attrName1` ET `attrName2` (du binding) sont égaux aux headers `attrName1` et `attrName2` du message.*

### Les Bindings

Les bindings se sont les règles que les exchanges utilisent pour déterminé à quel queue il faut délivrer le message.
Les différentes configuration peuvent utiliser la `routing key` (direct/topic exchanges) les `headers`(header exchanges) ou même le simple fait d'être binder`(fanout exchanges).

### Les Queues

Une queue est l'endroit ou sont stocké les messages. Il existe des options de configuration afin de modifier leurs comportements.

Quelques options:

 - Durable, (stocker sur disque) la queue survivra au redémarrage du broker. Attention seul les messages *persistent* survivront au redémarrage.
 - Exclusive, seras utilisable que pas une seul connection et sera supprimer à la cloture de celle-ci.
 - Auto-delete, la queue sera supprimer quand toutes les connections sont fermés (après au moins une connection).

**Vous consommez une queue.**

**Vous ne publiez pas dans une queue!**
**(quand vous croyez publier dans une queue en réalité le message est publier dans l'`exchange` `amq.default` avec la routing key = queue name)**

## Consumer

Le rôle du `consumer` est d'exécuter un traitement après avoir récupéré un ou plusieurs `messages`.

Pour ce faire il va réserver (prefetching) un ou plusieurs `messages` depuis la `queue`, avant d'exécuter un traitement. 
Généralement si le traitement c'est correctement déroulé le consumer va acquitter le message avec succès (basic.ack).
En cas d'erreur le `consumer` peut également acquitter négativement le `message` (basic.nack).
Si le `message` n'est pas acquitter il restera à ça place dans la queue et sera re fetch un peu plus tard.

*Vous voila maintenant fin prêt à récolter vos carottes*

Dans la partie 2 (maîtrise) nous verrons comment attrapé les lapins, et comment préparer la pâté.

## Liens utiles

http://www.rabbitmq.com/documentation.html
