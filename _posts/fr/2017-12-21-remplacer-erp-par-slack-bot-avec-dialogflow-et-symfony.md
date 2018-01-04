---
layout: post
title: 'Pour Noël, je remplace mon ERP par un Slack bot implémenté avec DialogFlow et Symfony'
excerpt: "Le but de cet article est de montrer la puissance d'un Slack bot pour simplifier la vie en entreprise, et comment le mettre en place avec DialogFlow et Symfony"
lang: fr
permalink: /fr/remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/
authors:
    - charles-eric
date: '2017-12-21 11:30:00 +0100'
date_gmt: '2017-12-21 11:30:00 +0100'
categories:
    - bot
    - Symfony
tags:
    - Slack
    - bot
    - DialogFlow
    - Symfony
cover: /assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/cover.jpg
---

Je suis sûr que vous rencontrez tous cette problématique : vous êtes obligés d'utiliser les outils ERP de votre entreprise pour faire vos demandes de congés, faire vos comptes-rendus d'activité, vos notes de frais, etc... Et avouez le, ça vous emm$#de ! Pourquoi ? Car ces outils ne sont pas ergonomiques, pas compatibles sur mobile...

Nous avons pourtant une infinité de possibilités de simplifications, si on fait preuve d'un peu d'imagination :) !

Je vais vous présenter dans cet article une de ces idées qui me permet de simplifier le process de demande de congés.


## Notre Contexte

Voilà plus d'éléments sur notre process.

### Le process existant à améliorer

1. L'astronaute envoie une demande par email à son manager Eleven Labs en indiquant les dates de début et fin des congés.
2. Si cette demande est validée, il faut également faire une demande par email au client.
3. Puis une fois validée également, il faut créer un event dans le Google calendar partagé pour donner de la visibilité à toute l'équipe.
4. Puis, il faut faire apparaître cette période de congés dans l'ERP interne pour la comptabilité.

### Comment simplifier ce process ?

Si on prend un peu de recul sur le process existant, on se rend compte que l'objectif est d'une part d'obtenir une validation, puis communiquer à tous les dates d'absences à venir. Mais en réalité, l'étape de validation n'est pas très utile car les congés sont quasiment systématiquement validés.

Il suffirait donc d'envoyer les dates de congés dans un outils qui communiquerait ensuite à tous, en considérant que la demande est validée par défaut.
On pourrait gérer les cas de refus de congés manuellement en parallèle, si ça arrivait.

> Quel est l'outil de communication interne le plus ergonomique ? Slack bien sûr !

L'idée serait donc de mettre en place un **bot Slack** qui :

1. Permettrait à chacun de faire ces demandes de congés.
2. Puis ce bot serait responsable d'envoyer les notifications à tout le monde dans Slack ou par email : manager, équipe et client.
3. Il pourrait également faire appel à l'API Google Calendar pour ajouter un event dans l'agenda.
4. Et idéalement, faire un appel à l'API de l'ERP utilisé pour la comptabilité.

Si une validation est vraiment nécessaire, on pourrait aussi imaginer que ce bot enverrait des demandes de validation, soit par Slack en utilisant les [interactive message buttons](https://api.slack.com/docs/message-buttons), soit par email avec un lien de validation.

### Ce que nous allons implémenter

Vous l'avez compris, les possibilités sont multiples, mais concentrons nous ici sur le point *1.* ci-dessus uniquement, le plus intéressant.

Pour mettre en place cette première étape du process, nous avons allons donc :

- Créer un **bot Slack** et le rendre accessible sur notre Workspace pour que tous les utilisateurs puissent lui envoyer des messages privés.
- Mettre en place un agent **DialogFlow** : outil Google, anciennement appelé API.AI, déjà décrit sur notre [blog ici](/fr/dialogflow-votre-chatbot-facile/). Celui-ci va nous permettre de comprendre, grâce au *machine learning*, les messages envoyés au bot par les utilisateurs, ce qui est loin d'être simple sans ce type d'outils !
- Mettre en place une application **Symfony** exposant un **webhook** qui sera appelé par le serveur Slack à chaque fois qu'un message privé est envoyé à notre bot. C'est depuis cette application que nous allons ensuite appeler DialogFlow pour interpréter le message Slack reçu, puis répondre à l'astronaute, et enfin enregistrer la demande de congés.


## Notre bot Slack

Commençons par la mise en place du bot Slack.

### Créer une application Slack

Il faut tout d'abord créer une app Slack.

Connectez vous donc à votre compte Slack relié à votre Workspace d'entreprise. Puis allez sur [https://api.slack.com/apps](https://api.slack.com/apps) et cliquez sur "Create New App".

[![Create Slack App]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_create_app.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_create_app.png){: .center-image .no-link-style}

Puis à vous de compléter les informations de votre app comme bon vous semble : nom, description, couleur et icône.

Vous pourrez ensuite accéder aux configurations suivantes depuis cet écran de "Basic Information" :

[![Slack App Basic Information]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_basic_info.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_basic_info.png){: .center-image .no-link-style}

### Créer un bot

Il faut maintenant créer un utilisateur bot relié à cette app. Pour cela, rendez vous dans le menu de gauche "Bot Users" ou depuis les "Basic Information" > "Add features and functionality" > "Bots".

[![Slack Bot]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png){: .center-image .no-link-style}

Il suffit ici de nommer le bot et de le rendre visible "online".

### Activer les events

Ensuite allez dans le menu "Event Subscriptions", saisissez l'**URL de votre futur webhook** Symfony que nous implémenterons dans la dernière partie. Notez que tant que le webhook n'est pas créé et accessible par Slack, ce dernier ne pourra pas le vérifier et l'enregistrer, il faudra donc revenir plus tard à cette étape quand le webhook sera prêt.

Il faut également sélectionner l'event "**message.im**" pour signifier à Slack d'appeler le webhook précédent à chaque fois qu'un message privé est envoyé à notre bot.

[![Slack Event Subscriptions]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_event_subscription.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_event_subscription.png){: .center-image .no-link-style}

Les appels faits vers ce webhook devront être sécurisés à l'aide d'un token qui sera utilisé dans la dernière partie : veuillez donc noter la valeur du "**Verification Token**" affichée sur la page "Basic Information".

### Configurer les permissions OAuth

Vous vous en doutez, les accès aux données Slack sont protégés. Il faut donc configurer notre bot pour que celui-ci ait accès à certains **scopes** de données avec son **access token**.

Cela se passe dans la partie "**OAuth & Permissions**".

Tout d'abord, vous pouvez noter la valeur d'"**OAuth Access Token**" qui apparaît sur cette page et que nous utiliserons plus tard.

Ensuite, voilà les scopes dont vous aurez forcément besoin, et donc à ajouter sur cette même page :
- "**chat:write:bot**" (ou "chat:write:user" suivant le token que vous utilisez) qui permettra d'envoyer un message privé sur Slack, pour répondre à l'astronaute.
- "**users:read**" et "**users:read.email**" pour accéder aux informations de profil de l'utilisateur qui nous envoie un message.

Pas forcément besoin d'ajouter plus de scopes pour le moment, et vous verrez avec l'expérience que Slack vous indique bien les scopes à autoriser si nécessaire quand vous appelez une méthode de l'API non autorisée.

## Notre agent DialogFlow

Maintenant que notre bot Slack est prêt, nous avons besoin de configurer un agent DialogFlow pour qu'il nous aide à comprendre les messages envoyés par les utilisateurs.

### Créer un agent

Créez donc un compte, si vous n'en avez pas déjà un, et connectez vous sur la [console DialogFlow](https://console.dialogflow.com).
Puis créez un nouvel **agent** (bouton "Create New Agent") et sélectionnez la langue par défaut **fr**.

### Configurer les intents

Les "intents" correspondent aux types de messages de l'utilisateur que nous avons envie de comprendre. Nous allons en configurer trois dans le cadre de cet article :

[![DialogFlow intents]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intents.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intents.png){: .center-image .no-link-style}

#### 1. Premier intent, le plus intéressant que nous appelons "**Demande de congés avec dates de début et de fin**" :

Nous allons lister dans la partie "**User says**" un maximum d'inputs utilisateurs qui pourraient être envoyés par les astronautes qui font leur demande de congés.

[![DialogFlow intent dates input]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_input.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_input.png){: .center-image .no-link-style}

Pour chacun de ces inputs, nous sélectionnons les passages les plus intéressants, en jaune et orange sur l'image ci-dessus. Ces passages correspondent aux dates de congés qu'on doit reconnaître puis enregistrer.

Ces sélections sont associées à des paramètres que nous nommerons "**startDate**" et "**endDate**" et que nous typons en tant que "**@sys.date**" pour que Google reconnaisse automatiquement ces dates.

Enfin, nous pouvons configurer les réponses qui seront renvoyées par DialogFlow quand on lui enverra un message de ce type, s'il le reconnaît :

[![DialogFlow intent dates output]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_output.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_output.png){: .center-image .no-link-style}

Nous avons deux types de réponses :
- les textes que nous utiliserons pour répondre à l'astronaute sur Slack.
- le "**Custom Payload**" qui nous permettra de retourner les valeurs des paramètres "startDate" et "endDate" qui seront reconnus par Google.

#### 2. L'intent "**Bonjour**"

Quant à lui, il nous permettra de répondre poliment à l'astronaute qui nous dit bonjour. Mais pas de paramètre à configurer pour celui-ci.

#### 3. Et enfin, l'intent "**Fallback**"

Il nous permet de configurer des messages par défaut, quand le message de l'utilisateur n'est pas reconnu par les précédent intents.


## Notre application Symfony

Tout le code de l'application Symfony qui permet de communiquer avec Slack et DialogFlow est sur [mon Github ici](https://github.com/ch3ric/WilsonPlanning/tree/master/src/AppBundle). Je vais détailler ici uniquement les parties les plus importantes.

> Je vous recommande d'utiliser les options "autoconfigure" et "autowiring" pour gérer vos injections de dépendances en toute simplicité : voir [app/config/services.yml](https://github.com/ch3ric/WilsonPlanning/blob/master/app/config/services.yml).

### Créer le Controller pour le webhook Slack

Tout d'abord, il faut créer l'action avec une route qui doit correspondre à ce qui a été configuré dans la partie "Event Subscriptions" de l'app Slack.

Pour que Slack vérifie ce webhook, il faut non seulement vérifier le "**Verification Token**" envoyé dans la requête de Slack mais également retourner le "challenge" envoyé par Slack en cas de requête de type "**url_verification**".

Voilà donc le code à utiliser :

```php
<?php
// src/AppBundle/Action/Webhook/SlackAction.php

namespace AppBundle\Action\Webhook;

// use statements...

final class SlackAction
{
    // private properties and __construct...

    /**
     * @Route("/api/webhook/slack", defaults={"_format": "json"})
     * @Method("POST")
     */
    public function __invoke(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        // check "Verification Token"
        if (!isset($content['token']) || $content['token'] !== $this->slackWebhookToken) {
            throw new AccessDeniedHttpException('No token given or token is wrong.');
        }

        // return "challenge" to allow Slack to verify this route
        if (isset($content['type']) && $content['type'] === 'url_verification') {
            return new JsonResponse(['challenge' => $content['challenge']]);
        }

        // $content -> valid content
        // call other services from here.

        return new Response('', 204);
    }
}
```

### Parser le contenu de la requête Slack

Ensuite, nous récupérons le "content" de la requête qui a cette forme :

```json
{
    ...
    "event": {
        "type": "message",
        "text": "Je veux poser des congés entre le 5 décembre et le 6 janvier",
        "user": "XXXXXX",
        "channel": "ZZZZZZ"
    },
    ...
}
```

Nous pouvons donc utiliser un service pour extraire les données qui nous intéressent :
- le texte du message, à condition que ce message soit de type "message"
- l'ID de l'utilisateur: "user"
- l'ID de la conversation privée entre l'utilisateur et le bot: "channel"

Voir [src/AppBundle/Slack/WebhookParser.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/Slack/WebhookParser.php) pour plus de détails.

### Appeler l'API Slack pour récupérer les informations de l'utilisateur

Nous avons besoin des informations de l'astronaute qui a envoyé le message Slack pour être capable de créer un `Member` dans notre application Symfony, qui sera relié à notre demande de congés.

Pour cela, nous allons appeler la méthode "**users.info**" de l'API Slack. Pour plus de détails, voir la [doc de cette API ici](https://api.slack.com/methods).

Il nous faut donc un client **Guzzle** pour appeler l'API Slack :

```php
// src/AppBundle/Slack/Client.php

namespace AppBundle\Slack;

// use statements...

class Client
{
    private $client; // GuzzleHttp\ClientInterface
    private $baseUri; // https://slack.com/api/
    private $token; // 'OAuth Access Token' from 'OAuth & Permissions' > 'Tokens for Your Workspace' on https://api.slack.com/apps

    // __construct...

    public function getUser(string $userId): array
    {
        $options = [
            'user' => $userId,
        ];
        return $this->get('users.info', $options);
    }

    private function get(string $uri, array $options): array
    {
        $options['query'] = array_merge(
            ['token' => $this->token],
            $options
        );

        return $this->handleResponse(
            $this->client->get($this->baseUri . $uri, $options)
        );
    }

    private function handleResponse(ResponseInterface $response): array
    {
        $data = json_decode($response->getBody()->getContents(), true);

        if (JSON_ERROR_NONE !== json_last_error()) {
            throw new \RuntimeException("Can't get Slack response");
        }
        if (!isset($data['ok']) || true !== $data['ok']) {
            throw new \RuntimeException('Got error from Slack');
        }

        return $data;
    }
}
```

Nous pouvons ainsi utiliser la méthode `get` de ce service en lui passant le user ID récupéré dans le "content" précédent. En retour, nous obtenons :

```json
{
    "user": {
        "name": "Charles-Eric Gorron",
        ...
        "profile": {
            ...
            "email": "cgorron@eleven-labs.com"
        }
    }
}
```

Ensuite nous utilisons un autre service [src/AppBundle/Service/MemberHandler.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/Service/MemberHandler.php) pour créer une instance de `Member` avec ce nom et cet email, si elle n'existe pas déjà dans notre base de données.

### Appeler l'API DialogFlow

Maintenant que nous avons le texte du message Slack ainsi que les données de l'utilisateur qui nous l'a envoyé, nous devons appeler DialogFlow via l'API "**query**" pour que celle-ci nous retourne la réponse à renvoyer à l'astronaute, ainsi que les valeurs de "startDate" et "endDate" qui nous intéressent.

Là encore nous utilisons un client Guzzle pour appeler cette API :

```php
// src/AppBundle/DialogFlow/Client.php
<?php

namespace AppBundle\DialogFlow;

// use statements...

class Client
{
    private $client; // GuzzleHttp\ClientInterface
    private $baseUri; // https://api.dialogflow.com/v1/
    private $token; // 'Client access token' from agent settings > 'General' tab > 'API KEYS (V1)' on https://console.dialogflow.com

    // __construct...

    public function query(string $message, string $sessionId): array
    {
        $options = [
            'query' => [
                'query' => $message,
                'sessionId' => $sessionId,
                'lang' => 'fr',
                'v' => '20170712',
            ],
        ];

        return $this->handleResponse(
            $this->call('query', $options)
        );
    }

    private function call(string $method, array $options): ResponseInterface
    {
        $options = array_merge(
            ['headers' => ['Authorization' => 'Bearer ' . $this->token]],
            $options
        );

        return $this->client->get($this->baseUri . $method, $options);
    }

    private function handleResponse(ResponseInterface $response): array
    {
        $data = json_decode($response->getBody()->getContents(), true);

        if (JSON_ERROR_NONE !== json_last_error()) {
            throw new \RuntimeException("Can't get DialogFlow response");
        }

        return $data;
    }
}
```

- Le paramètre "query" doit être le texte du message envoyé par l'utilisateur.
- Le paramètre "sessionId" correspond à une session d'utilisation de DialogFlow. Pour simplifier, j'envoie l'ID de l'utilisateur pour ce paramètre : chaque utilisateur a donc une seule session d'utilisation de DialogFlow.
- Les paramètres "lang" et "v" sont également obligatoires. Plus de détails dans la [doc ici](https://dialogflow.com/docs/reference/agent/query).

### Parser la réponse de DialogFlow

Cette réponse est sous cette forme :

```json
"result": {
    ...
    "fulfillment": {
        ...
        "speech": "OK, c'est noté !",
        "messages": [
            {
                "type": 4,
                "payload": {
                    "startDate": "2018-01-06",
                    "endDate": "2018-03-10"
                }
            },
            ...
        ]
    }
}
```

Ainsi nous utilisons un service [src/AppBundle/DialogFlow/Parser.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/DialogFlow/Parser.php) pour extraire les informations intéressantes de cette réponse :

- "**speech**" qui est une des réponses textes, configurées sur DialogFlow, qu'on va pouvoir renvoyer à l'utilisateur.
- les "startDate" et "endDate" de notre "**payload**".

### Envoyer une réponse privée à l'utilisateur via Slack

Pour cela, on peut ajouter une méthode dans notre service Client Slack pour appeler "**chat.postMessage**" :

```php
// src/AppBundle/Slack/Client.php

...

    public function postMessage(string $message, string $channel)
    {
        $payload = [
            'text' => $message,
            'channel' => $channel,
            'username' => 'wilson-planning',
        ];

        $response = $this->client->post(
            $this->baseUri . 'chat.postMessage',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ]
        );

        return $this->handleResponse($response);
    }

...

```

On donne en entrée ces arguments :

- "message" : réponse "speech" de DialogFlow.
- "channel" : ID de la conversation privée Slack entre l'utilisateur et le bot, tel que retourné dans la première requête Slack.

Le "token" à utiliser est le même que celui qu'on a envoyé lors de la requête `GET` qui récupère les informations de l'utilisateur.

### Enregistrer la période de congés en base de données

On a bien récupéré précédemment les informations de l'utilisateur qui nous ont permis de créer un `Member`, et on a aussi les "startDate" et "endDate" retournées par DialogFlow. Il ne nous reste donc qu'à créer une instance de `Vacation` et l'enregistrer en base de données.

Voir [src/AppBundle/Service/VacationHandler.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/Service/VacationHandler.php) pour plus de détails.

### Appeler tous les services précédents

Il faut maintenant brancher tous ces services ensemble, ce qui est très simple puisque nous avons configuré nos services en "autowiring" : il suffit donc d'injecter les services au bon endroit dans le constructeur. Finalement voilà à quoi ressemble notre action de controller :

```php
<?php
// src/AppBundle/Action/Webhook/SlackAction.php

namespace AppBundle\Action\Webhook;

// use statements...

final class SlackAction
{
    // private properties and __construct...

    /**
     * @Route("/api/webhook/slack", defaults={"_format": "json"})
     * @Method("POST")
     */
    public function __invoke(Request $request): Response
    {
        // get $content from request, check 'token', verify 'challenge'...

        try {
            $userSlackId = $this->slackWebhookParser->getSenderId($content);
            $member = $this->memberHandler->getOrCreateFromSlackId($userSlackId);

            $dialogFlowResponse = $this->dialogFlowClient->query(
                $this->slackWebhookParser->getMessage($content),
                $userSlackId
            );

            $slackResponse = $this->slackClient->postMessage(
                $this->dialogFlowParser->getSpeech($dialogFlowResponse),
                $this->slackWebhookParser->getChannel($content)
            );

            $vacationDates = $this->dialogFlowParser->getMessageCustomPayload($dialogFlowResponse);
            $this->vacationHandler->create($vacationDates['startDate'], $vacationDates['endDate'], $member);

        } catch (\InvalidArgumentException $e) {
            $this->logger->warning(
                'Response not supported from Slack or DialogFlow: {exception}',
                ['exception' => $e]
            );
        }

        return new Response('', 204);
    }
}
```

**Point d'attention** : il faut bien prévoir tous les types de messages qu'on peut possiblement recevoir de Slack ou DialogFlow et éviter à tout prix les erreurs.
Voilà pourquoi je catch ici les `\InvalidArgumentException` retournées par mes parsers.
Si votre webhook retourne un code d'**erreur HTTP**, Slack **rappellera plusieurs fois votre webhook**, jusqu'à obtenir une réponse avec un code 20X. Cela peut avoir des conséquences surprenantes : si l'erreur intervient à la dernière étape de votre controller, après le POST vers Slack, vous pourriez spammer la conversation privée de l'utilisateur en lui renvoyant un nouveau message à chaque fois que Slack rappelle le webhook en erreur !

> Bien sûr, pour respecter les bonnes pratiques, il faudrait aussi déplacer toute la logique métier de ce controller vers un service dédié.

## Notre résultat final

**Démonstration** : voici un extrait d'une conversation Slack avec notre bot :

[![Démonstration]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_demo1.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_demo1.png){: .center-image .no-link-style}

Et voilà le résultat enregistré en base de données :

[![Résultats en base de données]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_demo2.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_demo2.png){: .center-image .no-link-style}

On remarque notre ami Google a bien su reconnaître les dates écrites en français et nous a permis d'enregistrer des dates au format "datetime" en base de données, merci à lui !


## Conclusion

Je m'arrête ici pour cette fois, même si comme mentionné en première partie de cet article, il y aurait encore beaucoup à faire pour automatiser totalement ce process et ne plus jamais avoir besoin d'utiliser nos vieux ERPs : appels vers les API des calendars, utilisation des boutons Slack pour la validation, envoi de notifications Slack à tous les membres de la même équipe, ou même calcul automatique de la capacité du Sprint de l'équipe impactée par cette nouvelle demande de congés !

Vous noterez que j'ai utilisé [API Platform](/fr/creer-une-api-avec-api-platform/) sur mon [projet Github](https://github.com/ch3ric/WilsonPlanning), alors qu'il n'a aucun intérêt pour cet article en particulier : car j'ai encore beaucoup d'idées en tête à implémenter pour interagir avec d'autres systèmes qui pourraient appeler cette API.

Je vous tiendrai au courant des prochaines évolutions de cet outil si ça vous intéresse :P !
Faites moi savoir en commentaire si vous avez d'autres idées d'optimisations !
