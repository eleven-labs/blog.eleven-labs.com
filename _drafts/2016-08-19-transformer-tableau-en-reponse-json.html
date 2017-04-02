---
layout: post
title: Transformer un tableau en réponse JSON
author: tthuon
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
{% raw %}
<h2>Introduction</h2>
<p>Dans le contexte d'une API REST, intéressons nous particulièrement à la donnée rendue par le contrôleur. Je vous emmène découvrir le mécanisme qui permet l'affichage de la donnée en format compréhensible par d'autres systèmes, JSON dans cet exemple.</p>
<p>Concrètement, le rôle du contrôleur est de prendre un objet <em>Request</em> en entrée et de renvoyer un objet <em>Response</em> en sortie. Mais comment faire si je veux formater mes données autrement, par exemple en JSON ?</p>
<h2>Le chemin d'une requête</h2>
<p>Ce qui a été décrit plus haut peut se résumer en une image ci-dessous.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/08/10-kernel-view.png"><img class="alignnone size-medium wp-image-2064" src="http://blog.eleven-labs.com/wp-content/uploads/2016/08/10-kernel-view-300x180.png" alt="Symfony kernel event" width="300" height="180" /></a></p>
<p>Le cœur de Symfony tourne autour d'un composant en particulier : <em>HttpKernel</em>. Tout au long de sa vie, la requête va passer par plusieurs étapes successives dans le noyau de Symfony.</p>
<p>Nous pouvons avoir cette liste:</p>
<ul>
<li>kernel.request</li>
<li>kernel.controller</li>
<li>kernel.view</li>
<li>kernel.response</li>
<li>kernel.finish_request</li>
<li>kernel.terminate</li>
<li>kernel.exception</li>
</ul>
<p>Pour référence, vous pouvez aller lire la description de chacun des événements : <a href="http://symfony.com/doc/current/components/http_kernel.html">http://symfony.com/doc/current/components/http_kernel.html</a></p>
<p>Pour mon exemple, ma fonctionnalité devra prendre en entrée le retour du contrôleur et renvoyer un objet <em>JsonResponse. </em>Pour cela, je vais me brancher sur l'événement <strong>kernel.view</strong>. Cet événement est situé juste après l'exécution du contrôleur, mais juste avant l'envoi de la réponse.</p>
<h2>Création d'un service</h2>
<p>Après avoir récupéré toutes mes données depuis le contrôleur, je retourne un tableau.</p>
<pre class="lang:php decode:true">&lt;?php

namespace AppBundle\Controller;

class FooController
{
    public function getAction()
    {
        (...some logics)

        return [
            "id" =&gt; 42
            "foo" =&gt; "bar",
        ];
    }
}</pre>
<p>En l'état, symfony va lever une exception car il ne saura pas quoi faire du tableau. Je vais donc créer un écouteur pour transformer ce tableau. C'est une simple classe PHP.</p>
<pre class="lang:default decode:true">&lt;?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class JsonListener
{
    public function onKernelView(GetResponseForControllerResultEvent $event)
    {
        $data = $event-&gt;getControllerResult();

        if (is_array($data)) {
            $event-&gt;setResponse(new JsonResponse($data));
        }
    }
}</pre>
<p>L'événement kernel.view passe en argument un objet de type <em><a href="http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Event/GetResponseForControllerResultEvent.html">Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent</a>. </em>J'ai accès au retour du contrôleur avec <em>getControllerResult().</em></p>
<p>Je fais une simple vérification sur le type avant de créer la réponse: ici JsonResponse. Une fois la réponse créé, j'affecte l'objet à la méthode <em>setResponse()</em> de l'événement.</p>
<p>Avec cet écouteur, je transforme un tableau en une réponse JSON.</p>
<h2>Branchement à l'événement</h2>
<p>Une fois la classe créée, il faut la déclarer en tant que service et taguer le service.</p>
<pre class="lang:xhtml decode:true ">&lt;!-- app/config/services.xml --&gt;
&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
&lt;container xmlns="http://symfony.com/schema/dic/services"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd"&gt;

    &lt;services&gt;
        &lt;service id="app.view.json_listener" class="AppBundle\EventListener\JsonListener"&gt;
            &lt;tag name="kernel.event_listener" event="kernel.view" /&gt;
        &lt;/service&gt;
    &lt;/services&gt;
&lt;/container&gt;</pre>
<p>Je tague le service avec le nom <em>kernel.event_listener</em> et avec l'événement<em> kernel.view</em>.</p>
<p>Tout est bien branché. Lorsque je vais aller sur la route pour accéder au contrôleur, je vais avoir une réponse au format json.</p>
<p>Cette méthode est pratique lors de la création de webservice. Avec la réponse d'une requête en base de données, le résultat est souvent un tableau. Il suffit juste de faire un <em>return</em> du résultat de la requête sans avoir à créer un objet <em>JsonResponse</em>. Autre avantage donc, cette méthode permet d'éclaircir le code et vous évite la création systématique d'un objet <em>JsonResponse.</em></p>
<p>&nbsp;</p>
<h2>Références :</h2>
<ul>
<li><a href="http://symfony.com/doc/current/event_dispatcher.html">http://symfony.com/doc/current/event_dispatcher.html</a></li>
<li><a href="http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Event/GetResponseForControllerResultEvent.html">http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Event/GetResponseForControllerResultEvent.html</a></li>
<li><a href="http://symfony.com/doc/current/reference/dic_tags.html#kernel-event-listener">http://symfony.com/doc/current/reference/dic_tags.html#kernel-event-listener</a></li>
</ul>
{% endraw %}
