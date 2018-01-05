---
layout: post
title: '2018 new year resolution: Replace my ERP by a Slack bot implemented with DialogFlow and Symfony'
excerpt: "The purpose of this post is to show the power of a Slack bot that can be used to ease everyday life in your company, and how to implement it using DialoFlow and Symfony"
lang: fr
permalink: /en/replace-erp-by-slack-bot-with-dialogflow-and-symfony/
authors:
    - charles-eric
date: '2018-01-04 15:30:00 +0100'
date_gmt: '2017-01-04 15:30:00 +0100'
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

I'm pretty sure you have the same issue: you're forced to use the ERP systems of your company to handle your leave requests, manage your expenses and receipts, etc... And admit it: it bothers you! Why? Because these tools are not user friendly, not available on your mobile...

Yet there are many ways to simplify, if you're creative enough! :)

In this post, I'm gonna show you one of these simplification ideas that will ease the management of our leave requests.


## Our context

Here are a few more details about our context.

### The existing process that needs to be improved

1. The astronaut sends a request by email to his manager at Eleven Labs, providing start and end dates of his vacation.
2. If this request is validated, he also has to send another request to the client.
3. Once validated too, he needs to create an event in the shared Google calendar to give visibility to the others members of the team.
4. Then he has to add this leave request in the ERP system used by the accounting department.

### How to simplify this process?

If we step back to look at the overall picture, we notice that the goal is first to ask for a validation, and also to communicate to everyone all the absence periods. But actually the validation step is not really needed because each request is almost systematically accepted.

So it would be enough to send the vacation dates to a system that would share this information to everyone, considering that this request is accepted by default.
Then we could handle refusal manually, outside the system, if really needed.

> What would be the most user friendly internal communication tool for that? Slack of course!

Thus the idea would be to set up a **slack bot** which:

1. Would allow everyone to send his leave requests.
2. Then this bot would be responsible for sending notifications to everyone in Slack or via email: manager, team members and client.
3. It could also call Google Calendar API to add a new event in the shared calendar.
4. Ideally, it could send a request to the API of the ERP used by the accountants as well.

If a validation is really needed, we could also imagine that this bot would send a validation request, using Slack [interactive message buttons](https://api.slack.com/docs/message-buttons), or by email containing validation links.

### What we will implement

I think you got that, the possibilities are endless, but let's focus here on the item *1.* from above, the most interesting part.

To set up the first step of this process, here is what we gonna do:

- Create a **Slack bot** and make it available in our Workspace so that all the users can send private messages to it.
- Configure a **DialogFlow** agent: Google tool, formerly known as API.AI, already described on our [blog there (in French)](/fr/dialogflow-votre-chatbot-facile/). It will allow us to understand the messages sent by the users to the bot, thanks to *machine learning*, thing that's not so easy to do without this kind of tools!
- Set up a **Symfony** application that will expose a **webhook** which will be called by Slack server each time a private message will be sent to our bot. That's from this application that we will send request to DialogFlow in order to understand the message received, then call Slack to send an answer to the astronaut, and finally save the leave request in the database.


## Our Slack bot

Let's start with the setup of the Slack bot.

### Create a Slack application

First we have to create a Slack app.

Login to your Slack account related to your company's Workspace. Then go to [https://api.slack.com/apps](https://api.slack.com/apps) and click on 'Create New App'.

[![Create Slack App]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_create_app.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_create_app.png){: .center-image .no-link-style}

Then it's yours to fill all information about your app: name, description, color, icon.

After that, you'll be able to access other following configurations from the screen 'Basic Information':

[![Slack App Basic Information]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_basic_info.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_basic_info.png){: .center-image .no-link-style}

### Create a bot

Now you need to create a bot user related to this app. To do so, let's go to the left menu 'Bot Users' or from 'Basic Information' > 'Add features and functionality' > 'Bots'.

[![Slack Bot]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png){: .center-image .no-link-style}

You only have to add a name for this bot, and make it visible "online".

### Enable events

Then go to the menu 'Event Subscriptions', fill in the **URL of your future webhook** of your Symfony application that will be implemented in the last step. If the webhook route is not created and accessible by Slack servers, be aware that Slack will not be able to verify and save this URL. So you will need to go back to this step later when the route will be ready.

You also need to select the event "**message.im**" in order for Slack to call the previous webhook each time a private message is sent to the bot user.

[![Slack Event Subscriptions]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_event_subscription.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_event_subscription.png){: .center-image .no-link-style}

The requests sent to this webhook must be secured with a token that will be used in the last step: please write down the value of the '**Verification Token**' displayed on the page 'Basic Information' that you will need later.

### Configure OAuth permissions

You will not be surprised to hear that access to Slack data is protected. So you must configure your bot so that it could access some specific **scopes** of data with its **access token**.

To do so please go in the menu '**OAuth & Permissions**'.

First, you can write down the value of '**OAuth Access Token**' which is displayed on this page: we will use it later.

Then, here are the scopes that you will necessarily need and that need to be selected on the same page:
- '**chat:write:bot**' (or 'chat:write:user' depending on the token you will use) that will allow you to send private messages to Slack, to answer the astronaut.
- '**users:read**' and **users:read.email** to be able to access profile information of the user who sends us a message.

There is no need to add more scopes for now, and you will see with more experience that Slack suggests the scopes that you might need to add if needed, when you call an API method which is not autorized.


## Our DialogFlow agent

Now that our Slack bot is ready, we need to configure a DialogFlow agent that will help us understand messages sent by the users.

### Create an agent

Create an account, if you do not already have one, and login on [DialogFlow console](https://console.dialogflow.com).
Then create a new **agent** (button 'Create New Agent') and select the default language **en**.

### Configure the intents

The 'intents' correspond to different types of messages received from the user, that we need to understand. We will configure three of them for this blog post:

[![DialogFlow intents]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/dialogflow_intents.png)]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/dialogflow_intents.png){: .center-image .no-link-style}

#### 1. First intent, the most interesting one that we will call '**Leave request with start and end dates**':

We're gonna list in the part '**User says**' all possible inputs which could be sent by astronauts who send their leave requests.

[![DialogFlow intent dates input]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/dialogflow_intent_dates_input.png)]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/dialogflow_intent_dates_input.png){: .center-image .no-link-style}

For each of these inputs, we select the most interesting parts, in yellow and orange on the picture just above. These parts correspond to the dates of the vacation that we need to identify and save.

These selected parts are related to parameters that we can name as '**startDate**' and '**endDate**' and type as '**@sys.date**' so that Google can be able to recognize them as dates automatically.

Finally, we can configure the answers that will be sent back by DialogFlow when we will send this message type, if it recognizes it:

[![DialogFlow intent dates output]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/dialogflow_intent_dates_output.png)]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/dialogflow_intent_dates_output.png){: .center-image .no-link-style}

We notice there are two types of answers:
- texts that we will use to answer the astronaut on Slack.
- '**Custom Payload**' which will allow us to return the values of the parameters 'startDate' and 'endDate' recognized by Google.

#### 2. The intent '**Hello**'

This intent will allow us to politely answer to the astronaut who says 'hi'. But no need for any parameter for this one.

#### 3. And finally, the intent '**Fallback**'

It allows us to configure default messages, returned when the user's message is not supported by previous intents.


## Our Symfony application

All the code of the Symfony application which is connected with Slack and DialogFlow is on [my Github profile](https://github.com/ch3ric/WilsonPlanning/tree/master/src/AppBundle). I'm gonna describe here only the most interesting parts.

> I recommend you use 'autoconfigure' and 'autowiring' features of Symfony Dependency Injection to inject all your components and classes, it would be much easier. Here is an example of [my configuration file](https://github.com/ch3ric/WilsonPlanning/blob/master/app/config/services.yml).

### Create the Controller for the Slack webhook

First we need to create the action with the same route as the one configured in the part 'Event Subscriptions' of our Slack app.

In order for Slack to be able to verify this webhook, not only do we have the check the value of the '**Verification Token**' sent by Slack, but we also need to return the 'challenge' value as it was sent in the Slack request which as a type '**url_verification**'.

Here is the code you can use:

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

        // check 'Verification Token'
        if (!isset($content['token']) || $content['token'] !== $this->slackWebhookToken) {
            throw new AccessDeniedHttpException('No token given or token is wrong.');
        }

        // return 'challenge' to allow Slack to verify this route
        if (isset($content['type']) && $content['type'] === 'url_verification') {
            return new JsonResponse(['challenge' => $content['challenge']]);
        }

        // $content -> valid content
        // call other services from here.

        return new Response('', 204);
    }
}
```

### Parse content of Slack request

Then we get this request content:

```json
{
    ...
    "event": {
        "type": "message",
        "text": "I'd like to be off from the 5th of January to the 12th of March",
        "user": "XXXXXX",
        "channel": "ZZZZZZ"
    },
    ...
}
```

We will be able to use a dedicated service to parse this response and get data that we need:
- text of the message, only if its type is 'message'
- the user ID: 'user'
- the ID of the private discussion between the user and the bot: 'channel'

See [src/AppBundle/Slack/WebhookParser.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/Slack/WebhookParser.php) for more details.

### Call Slack API to get user's information

We need the profile information from the user who sent the Slack message to be able to create a `Member` in our Symfony application, who will be related to the leave request.

To do so we're gonna call '**users.info**' API method on Slack. For more details, see [API documentation here](https://api.slack.com/methods).

We will need a **Guzzle** client to call this Slack API:

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

Thus we can call the `get` method of this service with the user ID as an argument, that we've got from the previous request content.

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

Then we will user another service [src/AppBundle/Service/MemberHandler.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/Service/MemberHandler.php) to create an instance of `Member` with this 'name' and 'email', if it does not already exist in our database.

### Call DialogFlow API

Now that we've got the text of the Slack message and profile information of the user that sent this message, we need to call DialogFlow '**query**' API. This API method will return the answer text that we will be able to send back to the user, and the values of the parameters 'startDate' and 'endDate' that we are interested in.

Here we're are also going to use a Guzzle client to call this API:


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

- The query parameter named 'query' is the text of the message sent by the user.
- The parameter 'sessionId' corresponds to the current session or the DialogFlow user. To make it easier, I will use the user ID for this parameter: each user has a single user session in DialogFlow, that corresponds to his private discussion with the bot.
- Parameters 'lang' and 'v' are required too. More details in the [doc here](https://dialogflow.com/docs/reference/agent/query).

### Parse the response from DialogFlow

Here is the response we receive:

```json
"result": {
    ...
    "fulfillment": {
        ...
        "speech": "Alright!",
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

Thus we use a service [src/AppBundle/DialogFlow/Parser.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/DialogFlow/Parser.php) to retrieve interesting information from the response:

- '**speech**' which is one of the text answers we configured on DialogFlow, that we'll be able to sent back to the user.
- 'startDate', 'endDate' from our custom '**payload**'.

### Send a private message back to the user on Slack

To do so we can add a method in our Slack Guzzle client to call '**chat.postMessage**':

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

We send these input arguments:
- 'message': 'speech' content from DialogFlow response.
- 'channel': ID of the private discussion between the user and the bot on Slack, as it is received from the first Slack request.

The 'token' that we must use is the same one we already used for the `GET` request we've sent to get user profile information.

### Save the vacation dates in our database

We've already got the user information that allowed us to create the `Member`, and we've also got the 'startDate' and 'endDate' from DialogFlow. So now we have to create an instance of `Vacation` and save it into the database.

See [src/AppBundle/Service/VacationHandler.php](https://github.com/ch3ric/WilsonPlanning/blob/master/src/AppBundle/Service/VacationHandler.php) for more details.

### Call all previous services

We now need to plug all our components together: this is pretty easy because we decided to use 'autowiring' option for dependencies injection. We only need to inject the service we need and call them from the controller action. Here is how our controller now looks like:

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

**Be careful**: you must anticipate all responses types that you could possibly receive from Slack or DialogFlow, in order to avoid all errors, at all cost.
That's why I catch all `\InvalidArgumentException` thrown by the parsers in my code.
Indeed if your webhook returns an **HTTP error** code, Slack will call many times your route, until it gets a successful response code 20X. That means you could get surprising results: if an error is thrown at the end of your action, after the message has already been posted to Slack, you could spam the private discussion on Slack because it will send one message to Slack each time Slack sends a request to the webhook that returns an error!

> Of course to follow Symfony best practises, it would be much better to move all the domain logic from this controller to a dedicated service.


## Our final result

**Demonstration**: here is the discussion I had with our awesome bot:

[![Demonstration]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/slack_demo1.png)]({{site.baseurl}}/assets/2018-01-04-replace-erp-by-slack-bot-with-dialogflow-and-symfony/slack_demo1.png){: .center-image .no-link-style}

And here is the result in our database:

[![Results from the database]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_demo2.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_demo2.png){: .center-image .no-link-style}

We notice our friend Google managed to recognize the dates that were written in full English and allowed us to save the dates with a 'datetime' format in our database: big thanks to him!


## Conclusion

I will stop there for now, even if, like I mentionned in the first part of this blog post, there would be so many other ways to automate this process so that we would never have to use our old ERP again: call calendars APIs, use interactive Slack buttons to ask for validation, send Slack notifications to all team members, or even calculate the sprint velocity of the team which is impacted by this new leave request!

You will also notice that I used [API Platform](/en/build-an-api-with-api-platform/) on [my Github project](https://github.com/ch3ric/WilsonPlanning), even if it's not used for the purpose of this article: because I have many other ideas in mind to implement and this application's API could be called by other systems.

I'll let you know when I'll improve this tool in the future, if you're interested!
Let me know in the comments if you have other ideas to ease this process!
