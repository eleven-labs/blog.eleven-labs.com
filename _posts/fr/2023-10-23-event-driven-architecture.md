---
lang: fr
date: '2023-02-09'
slug: event-driven-architecture
title: 'L''architecture orientée événements : définition et cas concret'
excerpt: >-
  Voyons ensemble ce qu'est l'architecture orientée événements et comment l'implémenter dans vos projets avec un cas concret
authors:
  - marishka
categories:
    - php
    - architecture
keywords: []
---

## Qu'est ce que l'architecture orientée événements ?

L'architecture orientée événements utilise des événements pour déclencher et communiquer entre des services découplés.
Elle est courante dans les applications modernes construites avec des microservices.
Un événement correspond à un changement d'état, ou une mise à jour : un utilisateur qui paie une commande, par exemple.
Les événements peuvent transmettre un état (le numéro de transaction, le montant et le numéro de commande), ou alors être des identifiants (une notification indiquant qu'une commande a été payée).

Les architectures orientées événements comportent trois composants clés : les émetteurs (_producers_), les transmetteurs (_routers_) et les consommateurs (_consumers_).
Un _producer_ publie un événement sur le routeur, qui filtre et transmet les événements aux _consumers_.
Les services producteurs et les services consommateurs sont découplés, ce qui leur permet d'être modifiés et déployés de manière indépendante.

## Avantages

**Découplage** : en découplant vos services, ils ne connaissent que le routeur d'événements, ils ne dépendent pas directement les uns les autres.
Cela signifie que vos services sont interopérables, mais si un service tombe en panne, les autres continueront de fonctionner.

**L'évolutivité** : vous n'avez pas besoin d'écrire du code custom pour gérer les événements, le routeur d'événements filtrera et transmettra automatiquement les événements aux consumers.
Le routeur s'occupe également de la coordination entre les producers et consumers.

**Immutabilité** : une fois créés, les événements ne peuvent pas être modifiés, ils peuvent donc être partagés avec plusieurs services sans risque qu'un service modifie ou supprime des informations que d'autres services consommeraient ensuite.

**Scalabilité** : un événement déclenche plusieurs actions chez différents consumers, améliorant ainsi les performances.
Le découplage simplifie le processus d'ajout, de mise à jour ou de suppression de producers et de consumers, permettant des ajustements rapides pour répondre aux nouvelles exigences ou demandes.

**Réponses en temps quasi-réel** : les événements sont consommés au fur et à mesure qu'ils se produisent, fournissant des réponses en temps quasi-réel aux interactions importantes avec votre platefrome.
Cette agilité garantit que les clients reçoivent toujours les informations au plus vite sans pour autant être bloqués dans leur expérience utilisateur.

## Les modèles

L'architecture orientée événements peut utiliser le modèle de _pub/sub_ ou le modèle de _event streaming_.

**Pub/sub** : lorsqu'un événement est publié, le router va le communiquer à tous les consumers qui sont abonnés à cet événement.
Si un nouveau consumer s'abonne à un événement, il n'a pas accès aux événements passés.
C'est l'exemple que nous allons voir plus bas.

**Event streaming** : les événements sont enregistrés dans un journal dans l'ordre chronologique.
Un client peut lire n'importe quelle partie du flux à n'importe quel moment.
Cela signifie aussi qu'un client peut s'abonner à tout moment et avoir accès aux événements passés.

## Cas concret

Voyons un cas concret en PHP avec RabbitMQ.
Imaginons une architecture avec plusieurs microservices qui ont besoin de communiquer entre eux dans le cas de validation d'une commande.

Reprenons ensemble le fonctionnement du modèle AMQP 0-9-1 (vous pouvez trouver la documentation [ici](https://www.rabbitmq.com/tutorials/amqp-concepts.html)) :

![]({{ site.baseurl }}/assets/2023-10-23-edd/rabbitmq.png)

Les messages sont publiés sur des _exchanges_, voyez ça comme une boîte aux lettres.
Les exchanges distribuent ensuite des copies des messages aux _queues_ à l'aide des _bindings_.
Ensuite, le broker transmet les messages aux consumers abonnés aux queues ou les consumers récupèrent les messages des queues à la demande.

Nous allons utiliser Swarrot Bundle pour la suite de l'exemple.
Vous pouvez lire un article sur son fonctionnement [ici](https://blog.eleven-labs.com/fr/publier-consommer-reessayer-des-messages-rabbitmq/).

Définissons ensemble quelques règles à respecter.

### Exchange

Chaque application a son propre exchange, et elle ne peut publier que dans son exchange.
Cela nous permet d'assurer une séparation des responsabilités de chaque application pour respecter les principes SOLID.

### Message

Le message, c'est ce qui va être envoyé depuis un publisher à un consumer. Par convention, nos messages seront au format JSON.
La donnée principale sera contenue dans la propriété `data` du message, et toute information secondaire sera dans une propriété `meta`.

### Routing key

Un message est associé à une _routing key_.
Dans l'architecture orientée événement, elle va correspondre à l'événement qui a eu lieu.
Pour assurer l'unicité d'une routing key, et étant donné que le nom d'une entité peut figurer dans plusieurs microservices, nous allons nommer nos routing key de la façon suivante : `app.entity.{id}.event`.
Par exemple `purchase.order.42.payed` voudrait dire que dans l'application _Purchase_, l'objet _Order_ avec l'identifiant 42 vient de passer en état "payé".
Notez que les événements doivent représenter des événements métier en premier, bien que parfois les événements du cycle de vie de vos entités puissent aussi être utiles (`session.exam.42.created`).

### Publisher

Chaque object qui sera communiqué via Rabbitmq aura son publisher, par exemple l'entité Order aura son _OrderPublisher_.
Chaque événement publié correspondra à une fonction qui porte le nom de l'événement :

```php
// class OrderPublisher
public function payed(Order $order, bool $isAnonymous): void
{
    $this->publisher->publish(
        self::MESSAGE_TYPE,
        $this->serializer->serialize(
            [
                'data' => $order,
                'meta' => [
                    'isAnonymous' => $isAnonymous,
                ],
            ],
            'json',
            SerializationContext::create()->setGroups('publish-order')
        ),
        ['content_type' => 'application/json'],
        ['routing_key' => sprintf('purchase.order.%d.payed', $business->getId())]
    );
}
```

Comme vous pouvez voir, nous avons également un groupe de sérialization spécifique pour nos publishers.

Cette fonction doit publier un contenu comme ceci :

```json
{
  "data": {
    "id": 42,
    "amount": 124.80,
    "payment": {
      "identifier": "XXX",
      // ...
    },
    // ...
  },
  "meta": {
    "isAnonymous": false
  }
}

```

### Consumer

Un consumer va dépiler des messages qui se trouvent dans une queue.
La queue s'abonne à un événement (subscribe) via les bindings à l'exchange et la routing key.
Elle va suivre le schéma `app_action`, par exemple `mailer_send_order_confirmation` nous indique que l'application _Mailer_ va envoyer un email de confirmation.

Le consumer va porter le nom de l'action à réaliser, sans mentionner l'événement qui va déclencher cette action, par exemple, `SendOrderConfirmationConsumer`.
Nous partons du principe que l'application doit réaliser une action indépendamment de qui la déclenche.

Ainsi, notre configuration de queue ressemblera à ceci :

```yaml
queues:
    mailer_send_order_confirmation:
        durable: true
        arguments:
            ###
        bindings:
            - exchange: "purchase" # the application that published the message
              routing_key: "purchase.order.*.payed" # named after the published event
```

## Conclusion

Avec ces règles simples, nous pouvons facilement implémenter l'architecture orientée événements.
Nous devons placer les événements au centre de notre refléxion pour construire les échanges de notre plateforme autour de ceux-ci.
