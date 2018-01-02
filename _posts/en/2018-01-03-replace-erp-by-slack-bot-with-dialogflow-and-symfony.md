---
layout: post
title: '2018 new year resolution: Replace my ERP by a Slack bot implemented with DialogFlow and Symfony'
excerpt: "The purpose of this post is to show the power of a Slack bot that can be used to ease everyday life in your company, and how to implement it using DialoFlow and Symfony"
lang: fr
permalink: /en/replace-erp-by-slack-bot-with-dialogflow-and-symfony/
authors:
    - charles-eric
date: '2018-01-03 11:30:00 +0100'
date_gmt: '2017-01-03 11:30:00 +0100'
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

I'm pretty sure you have the same problem: you're forced to use the ERP systems of your company to handle your leave requests, manage your expenses and receipts, etc... And admit it: it bothers you! Why? Because these tools are not user friendly, not available on your mobile...

Yet there are many ways to simplify, if you're creative enough! :)

In this post, I'm gonna show you one of these simplification ideas that will ease the management of our leave requests.


## Our context

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

If a validation is really needed, we could also imagine that this bot would send validation request, using Slack [interactive message buttons](https://api.slack.com/docs/message-buttons), or by email containing validation links.

### What we will implement

I think you got that, the possibilities are endless, but let's focus here on the item *1.* from above, the most interesting part.

To set up the first step of this process, here is what we gonna do:

- Create a **Slack bot** and make is available in our Workspace so that all the users can send private messages to it.
- Configure a **DialogFlow** agent: Google tool, formerly known as API.AI, already described on our [blog there (in French)](/fr/dialogflow-votre-chatbot-facile/). It will allow us to understand the messages sent by the users to the bot, thanks to *machine learning*, thing that's not so easy to do without this kind of tools!
- Set up a **Symfony** application that will expose a **webhook** which will be called by Slack server each time a private message will be sent to our bot. That's from this application that we will send request to DialogFlow to understand the message received, then call Slack to send an answer to the astronaut, and finally save the leave request in the database.


## Our Slack bot

Let's start with the setup of the Slack bot.

### Create a Slack application

First we have to create a Slack app.

Login to your Slack account related to your company's Workspace. Then go to [https://api.slack.com/apps](https://api.slack.com/apps) and click on 'Create New App'.

[![Create Slack App]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_create_app.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_create_app.png){: .center-image .no-link-style}

Then it's yours to fill all information about your app: name, description, color, icon.

After that, you'll be able to access other following configurations from the screen 'Basic Information':

[![Slack Bot]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png){: .center-image .no-link-style}

### Create a bot

Now you need to create a bot user related to this app. To do so, let's go to the left menu 'Bot Users' or from 'Basic Information' > 'Add features and functionality' > 'Bots'.

[![Slack Bot]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_bot.png){: .center-image .no-link-style}

You only have to add a name for this bot, and make it visible "online".

### Enable events

Then go to the menu 'Event Subscriptions', fill in the **URL of your future webhook** of your Symfony application that will be implemented in the last step. If the webhook route is not created and accessible by Slack servers, be aware that Slack will not be able to verify and save this URL. So you will need to go back to this step later when the route will be ready.

You also need to select the event "**message.im**" in order for Slack to call the previous webhook each time a private message is sent to the bot user.

[![Slack Event Subscriptions]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_event_subscription.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/slack_event_subscription.png){: .center-image .no-link-style}

The requests sent to this webhook must be secured with a token that will be used in the last step: please write down the value of the '**Verification Token**' displayed on the page 'Basic Information' that you will need later.

### Configure OAuth permissions

You will not be surprised to hear that access to Slack data is protected. So you must configure your bot so that it could access some specific **scopes** of data with its **access token**.

To do so please go in the menu '**OAuth & Permissions**'.

First, you can write down the value of '**OAuth Access Token**' which is displayed on this page: we will use it later.

Then, here are the scopes that you will necessarily need and that need to be selected on the same page:
- '**chat:write:bot**' (or 'chat:write:user' depending of the token you will use) that will allow you to send private messages to Slack, to answer the astronaut.
- '**users:read**' and **users:read.email** to be able to access profile information of the user who sends us a message.

There is no need to add more scopes for now, and you will see with more experience that Slack suggests the scopes that you might need to add if needed, when you call an API method which is not autorized.

## Our DialogFlow agent

Now that our Slack bot is ready, we need to configure a DialogFlow agent that will help us understand messages sent by the users.

### Create an agent

Create an account, if you do not already have one, and login on [DialogFlow console](https://console.dialogflow.com).
Then create a new **agent** (button 'Create New Agent') and select the default language **en**.

### Configure the intents

Then 'intents' correspond to different messages types received from the user, that we need to understand. We will configure three of them for this blog post:

[![DialogFlow intents]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intents.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intents.png){: .center-image .no-link-style}

#### 1. First intent, the most interesting one that we will call '**Leave request with start and end dates**':

We're gonna list in the part '**User says**' a maximum number of inputs which could be sent by astronauts who send their leave requests.

[![DialogFlow intent dates input]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_input.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_input.png){: .center-image .no-link-style}

For each of these inputs, we select the most interesting parts, in yellow and orange on the picture just above. These parts correspond to the dates of the vacation that we need to identify and save.

These selected parts are related to parameters that we can name '**startDate**' and '**endDate**' and that we can type as '**@sys.date**' so that Google can be able to recognize them as dates automatically.

Finally, we can configure the answers that will be sent back by DialogFlow when we will send this message type, if it recognizes it:

[![DialogFlow intent dates output]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_output.png)]({{site.baseurl}}/assets/2017-12-21-remplacer-erp-par-slack-bot-avec-dialogflow-et-symfony/dialogflow_intent_dates_output.png){: .center-image .no-link-style}

We notice there is two types of answers:
- texts that we will use to answer the astronaut on Slack.
- '**Custom Payload**' which will allow us to return the values of the parameters 'startDate' and 'endDate' recognizes by Google.

#### 2. The intent '**Hello**'

This intent will allow us to answer politely to the astronaut who says 'hi'. But no need for any parameters for this one.

#### 3. And finally, the intent '**Fallback**'

It allows us to configure default messages, returned when the user's message is not supported by previous intents.
