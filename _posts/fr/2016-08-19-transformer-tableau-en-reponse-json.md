---
layout: post
title: Transformer un tableau en réponse JSON
authors:
- tthuon
lang: fr
permalink: /fr/transformer-tableau-en-reponse-json/
excerpt: Dans le contexte d'une API REST, intéressons nous particulièrement à la donnée rendue par le contrôleur. Je vous emmène découvrir le mécanisme qui permet l'affichage de la donnée en format compréhensible par d'autres systèmes, JSON dans cet exemple.
date: '2016-08-19 14:54:40 +0200'
date_gmt: '2016-08-19 12:54:40 +0200'
categories:
- Symfony
- Php
tags:
- php
- symfony
- HttpKernel
- api
- rest
- json
---
## Introduction

Dans le contexte d'une API REST, intéressons nous particulièrement à la donnée rendue par le contrôleur. Je vous emmène découvrir le mécanisme qui permet l'affichage de la donnée en format compréhensible par d'autres systèmes, JSON dans cet exemple.

Concrètement, le rôle du contrôleur est de prendre un objet _Request_ en entrée et de renvoyer un objet _Response_ en sortie. Mais comment faire si je veux formater mes données autrement, par exemple en JSON ?

## Le chemin d'une requête

Ce qui a été décrit plus haut peut se résumer en une image ci-dessous.

[![Symfony kernel event](/assets/2016-08-19-transformer-tableau-en-reponse-json/10-kernel-view.png)

Le cœur de Symfony tourne autour d'un composant en particulier : _HttpKernel_. Tout au long de sa vie, la requête va passer par plusieurs étapes successives dans le noyau de Symfony.

Nous pouvons avoir cette liste:

* kernel.request
* kernel.controller
* kernel.view
* kernel.response
* kernel.finish_request
* kernel.terminate
* kernel.exception

Pour référence, vous pouvez aller lire la description de chacun des événements : [http://symfony.com/doc/current/components/http_kernel.html](http://symfony.com/doc/current/components/http_kernel.html){:target="_blank" rel="nofollow noopener noreferrer"}

Pour mon exemple, ma fonctionnalité devra prendre en entrée le retour du contrôleur et renvoyer un objet _JsonResponse._ Pour cela, je vais me brancher sur l'événement **kernel.view**. Cet événement est situé juste après l'exécution du contrôleur, mais juste avant l'envoi de la réponse.

## Création d'un service

Après avoir récupéré toutes mes données depuis le contrôleur, je retourne un tableau.

```php
<?php

namespace AppBundle\Controller;

class FooController
{
    public function getAction()
    {
        (...some logics)

        return [
            "id" => 42
            "foo" => "bar",
        ];
    }
}
```

En l'état, symfony va lever une exception car il ne saura pas quoi faire du tableau. Je vais donc créer un écouteur pour transformer ce tableau. C'est une simple classe PHP.

```php
<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class JsonListener
{
    public function onKernelView(GetResponseForControllerResultEvent $event)
    {
        $data = $event->getControllerResult();

        if (is_array($data)) {
            $event->setResponse(new JsonResponse($data));
        }
    }
}
```

L'événement kernel.view passe en argument un objet de type _[Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent](http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Event/GetResponseForControllerResultEvent.html)._ J'ai accès au retour du contrôleur avec _getControllerResult(){:target="_blank" rel="nofollow noopener noreferrer"}._

Je fais une simple vérification sur le type avant de créer la réponse: ici JsonResponse. Une fois la réponse créé, j'affecte l'objet à la méthode _setResponse()_ de l'événement.

Avec cet écouteur, je transforme un tableau en une réponse JSON.

## Branchement à l'événement

Une fois la classe créée, il faut la déclarer en tant que service et taguer le service.

```xml
<!-- app/config/services.xml -->
<?xml version="1.0" encoding="UTF-8" ?>
<container xmlns="http://symfony.com/schema/dic/services"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd">

    <services>
        <service id="app.view.json_listener" class="AppBundle\EventListener\JsonListener">
            <tag name="kernel.event_listener" event="kernel.view" />
        </service>
    </services>
</container>
```

Je tague le service avec le nom _kernel.event_listener_ et avec l'événement _kernel.view_.

Tout est bien branché. Lorsque je vais aller sur la route pour accéder au contrôleur, je vais avoir une réponse au format json.

Cette méthode est pratique lors de la création de webservice. Avec la réponse d'une requête en base de données, le résultat est souvent un tableau. Il suffit juste de faire un _return_ du résultat de la requête sans avoir à créer un objet _JsonResponse_. Autre avantage donc, cette méthode permet d'éclaircir le code et vous évite la création systématique d'un objet _JsonResponse._

## Références :

* [http://symfony.com/doc/current/event_dispatcher.html](http://symfony.com/doc/current/event_dispatcher.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Event/GetResponseForControllerResultEvent.html](http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Event/GetResponseForControllerResultEvent.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [http://symfony.com/doc/current/reference/dic_tags.html#kernel-event-listener](http://symfony.com/doc/current/reference/dic_tags.html#kernel-event-listener){:target="_blank" rel="nofollow noopener noreferrer"}
