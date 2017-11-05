---
layout: post
title: DialogFlow, votre chatbot facile
permalink: /fr/dialogflow-votre-chatbot-facile/
excerpt: "La communication avec l'utilisateur étant le point central pour le fidéliser, il est naturel que les ChatBots conversationnels fassent leurs apparition et paraissent devenir un point important dans nos applications.
Il existe aujourd'hui de nombreuse aide pour mettre en place des ChatBots conversationnel dit intelligent, on parlera aujourd'hui de DialogFlow anciennement Api.ai de Google."
authors:
    - captainjojo
categories:
    - google
    - dialogflow
tags:
    - bot
    - javascript
cover: /assets/2017-11-06-chatbot-dialogflow/cover.png
---

La communication avec l'utilisateur étant le point central pour le fidéliser, il est naturel que les ChatBots conversationnels fassent leurs apparition et paraissent devenir un point important dans nos applications.

Il existe aujourd'hui de nombreuse aide pour mettre en place des ChatBots conversationnel dit "intelligent", on parlera aujourd'hui de DialogFlow anciennement Api.ai de Google.

### J'écris un chatbot sans code

DialogFlow c'est avant tout une interface qui va vous permettre d'utiliser l'intelligence de Google. Ce que DialogFlow contient c'est assez simple, il contient [l'API Cloud Natural Language](https://cloud.google.com/natural-language/?hl=fr) qui permet de reconnaitre des phrases envoyées par l'utilisateur. Avec les phrases récupérés Google fait du machine learning et reconnait la phrase, et selon lance une action proposée par votre configuration.

DialogFlow c'est donc cela, l'utilisateur propose une phrase, Google cherche parmi les "intents" que vous avez configurer et effectue l'action que vous avez proposé.

Maintenant que l'on connait le fonctionnement basic, nous allons créer le premier chatbot.

Je vous invite à allez sur la console de DialogFlow disponible [ici](https://console.dialogflow.com).  Nous allons créer notre premier "Agent" [ici](https://console.dialogflow.com/api-client/#/newAgent).

![dialogflow-agent](/assets/2017-11-06-chatbot-dialogflow/dialogflow-agent.png)

Il faut donc remplir le formulaire de création de votre agent. Je vous invite à mettre le *DEFAULT LANGUAGE* en Français.

Voila vous avez votre premier chatbot, par défaut vous avez 2 "intents" que Google vous propose.

![dialogflow-intent](/assets/2017-11-06-chatbot-dialogflow/dialogflow-intent.png)

Allons voir ce que contient l'intent *Default Welcome Intent*, un intent est toujours séparé de la même façon.

 **- Contexts**

Vous pouvez y mettre context d'entré et de sortie. Cela permet de garder le context de la conversation.

Exemple: Votre utilisateur demande une recette de cuisine, vous répondez avec un context *recette*, vous mettez alors *recette* dans le output context. Puis dans un autre intent vous prenez le context *recette* dans input context, l'ensemble des paramètres contenu dans l'intent précédent seront en entré de l'intent, votre utilisateur pourra alors demander, le temps de cuisson et vous serez quel recette c'etait.

Pour plus d'explication vous pouvez allez sur la documentation [ici](https://dialogflow.com/docs/contexts).

**- User says**

Vous y mettez les phrases possible en entré de votre intent. C'est aussi ici que Google va vous aider, si vous mettez par exemple "salut", il prendra tout seul en compte les synonymes de "salut" comme le "hello", 'hey" etc ...

C'est aussi dans user says que Google vous propose des *entities* que nous verrons plus tard.

La documentation est [ici](https://dialogflow.com/docs/intents).

**- Events**

Permet d'invoquer l'intent via un trigger, nous n'utiliserons pas dans ce tutoriel mais pour plus d'information vous pouvez lire la documentation [ici](https://dialogflow.com/docs/events).

**- Actions**

C'est le point central d'un intent, une action permet de prendre en paramètres les données de l'utilisateur, les fameuses *entities*. Par default DiaologFlow reconnait des *entities* du type data, url, géolocalisation etc ... On pourra aussi ajouter nos propres *entities* dans un second temps.

Quand vous sélectionnez des *entities* dans les phrases utilisateurs, ils sont transformé en paramètre de l'action que vous pourrez utilisé ensuite dans vos scripts et dans vos réponses.

Si un paramètre est obligatoire, DialogFlow vous propose d'ajoutez une réponse si votre utilisateur est entré dans l'intent mais n'a pas mis le paramètre.

Vous pouvez trouvez d'autre précision dans la documentation [ici](https://dialogflow.com/docs/actions-and-parameters).

**- Responses**

C'est ici que vous mettez les réponses que vous voulez envoyé à l'utilisateur s'il est rentré dans cette intent.

Vous pouvez mettre plusieurs réponse DialogFlow choissira aléatoirement une des réponses, ce qui donne un meilleur effet pour vos utilisateurs.

Allons voir ce que contient l'intent *Default Fallback Intent*, qui permet de récupérer tout les messages non reconnu par d'autre intent.

Il ne contient pas une section *User says*, il vous permet seulement de répondre à votre utilisateur si aucun intent n'est trouvé. Cela vous permet d'expliquer le fonctionnement de votre application à vos utilisateurs, c'est un peu votre **help**.

Nous allons maintenant testé notre chatbot, vous avez du voir sur la droite de la console DialogFlow vous permet d'utiliser en live votre chatbot.  Si vous rentrez n'importe quel phrase vous devez arrivé dans le *Default Fallback Intent* puisque pour l'instant nous n'avons aucun *user says* dans votre autre intent.

![dialogflow-fallback](/assets/2017-11-06-chatbot-dialogflow/dialogflow-fallback.png)

Vous pouvez aussi voir le json que cela génère il vous servira lors de la phase *Mettons une petite intelligence*.

![dialogflow-json](/assets/2017-11-06-chatbot-dialogflow/dialogflow-json.png)

Si dans le *User says* de votre *Default Welcome Intent* vous ajouté un "salut" et que vous sauvegardez, vous pouvez re-testé et voir que le bot vous répond une des phrases présent dans l'intent *Default Welcome Intent*

![dialogflow-test2](/assets/2017-11-06-chatbot-dialogflow/dialogflow-test2.png)

Maintenant créons une vrai conversation.

Dans l'intent *Default Welcome Intent* que vous pouvez renommer *Salut* je vous invite à changer les réponses en ajoutant la question *tu vis où ?*

Puis créer, l'intent *tu habites ?*,  qui aura un context de sortie *city*. Puis vous pouvez ajouter  comme *User says*  les phrases suivantes

![dialogflow-response](/assets/2017-11-06-chatbot-dialogflow/dialogflow-response.png)

Si tous se passe bien DialogFlow va directement reconnaitre les *entities* de géolocalisation, si ce n'est pas le cas en sélectionnant le mot vous pouvez choisir l'entity *@sys.geo-city*.

![dialogflow-entity](/assets/2017-11-06-chatbot-dialogflow/dialogflow-entity.png)

Il ne vous reste plus qu'a répondre à votre utilisateur avec les phrases suivantes.

![dialogflow-response2](/assets/2017-11-06-chatbot-dialogflow/dialogflow-response2.png)

Vous pouvez utiliser *$geo-city* pour récupérer la ville de l'utilisateur.

Vous pouvez sauvegarder l'intent, maintenant ajoutez l'intent *Tu as quel age ?* comme pour l'intent précédent vous mettez en input le context *city* permettant de récupérer le ville précédemment envoyé par l'utilisateur.

Comme pour l'autre intent vous pouvez prendre le chiffre des *user says* et le mettre en tant que paramètre. Il ne vous reste plus qu'a répondre à l'utilisateur par.

    Cool $number et tu vis à #city.geo-city

 $number c'est le paramètre que l'utilisateur viens de fournir et #city.geo-city c'est la ville contenu dans le contexte.

![dialogflow-entity2](/assets/2017-11-06-chatbot-dialogflow/dialogflow-entity2.png)

Vous pouvez sauvegarder et tester. Si tout est ok vous devez avoir ce genre de conversation.

![dialogflow-test4](/assets/2017-11-06-chatbot-dialogflow/dialogflow-test4.png)

Vous pouvez le tester ici.

<iframe width="350" height="430" src="https://console.dialogflow.com/api-client/demo/embedded/6025f565-6593-4d27-9fe1-45e65c7b571b"></iframe>

Il ne vous reste plus qu'a trouvez une conversation.

### Mettons une petite intelligence

C'est bien nous avons un chatBot qui permet de faire une conversation avec vos utilisateurs, mais il ne contient aucune intelligence métier.

> Alors comment faire ?

C'est simple, il faut fournir à Dialog un *Fulfillment* qui est en fait un webhook vers un webservice.

![dialogflow-webhook](/assets/2017-11-06-chatbot-dialogflow/dialogflow-webhook.png)

Il existe deux formats *Fulfillment*:

**- Webhook**

![dialogflow-webhook2](/assets/2017-11-06-chatbot-dialogflow/dialogflow-webhook2.png)

Il s'agit d'une simple url que DialogFlow appellera lors d'un intent. Vous pouvez y mettre des options comme l'authentification, des headers spécifiques ou encore autorisé le webhook seulement sur vos domains web.

**- Inline Editor**

![dialogflow-inlineeditor](/assets/2017-11-06-chatbot-dialogflow/dialogflow-inlineeditor.png)

Il s'agit d'un éditeur de code qui met cela directement dans une *function* Firebase.  Ce qui est pratique avec cela c'est que vous n'avez pas à réfléchir sur le déploiement de votre code Google le fait pour vous, mais vous n'avez pas aussi à faire la structure de base du code elle est déjà prête.

Vous trouverez toute les informations sur les *Fulfillment* sur la documentation [ici](https://dialogflow.com/docs/fulfillment).

Il ne vous reste plus qu'a activer le *Fulfillment* sur votre intent.
Commençons par activer le *Fulfillment* Inline Editor.

![dialogflow-inlineeditor2](/assets/2017-11-06-chatbot-dialogflow/dialogflow-inlineeditor2.png)

Puis dans l'intent *Salut* en bas de la configuration vous avez la parti *Fulfillment* qui apparait vous pouvez donc activer l'utilisation du webhook pour cet intent.

![dialogflow-webhook3](/assets/2017-11-06-chatbot-dialogflow/dialogflow-webhook3.png)

Si vous avez fait attention au code par défaut vous verez cela.

```javascript
const actionHandlers = {
	// The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
	'input.welcome': () => {
		  // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
	  if (requestSource === googleAssistantRequest) {
	    sendGoogleResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
	  } else {
	    sendResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
  }
},
```

C'est simple si l'intent est l'action *input.welcome* alors on répond *Hello, Welcome to my Dialogflow agent!*

Vous pouvez donc essayer.

![dialogflow-test5](/assets/2017-11-06-chatbot-dialogflow/dialogflow-test5.png)

Vous pouvez faire beaucoup de chose avec vos webhook, l'entré du webhook c'est le json que vous trouvez dans les tests.

![dialogflow-json2](/assets/2017-11-06-chatbot-dialogflow/dialogflow-json2.png)

La sortie c'est un objet json que vous pouvez retrouver [ici](https://dialogflow.com/docs/fulfillment#response).

### Deployons sur un outils de chat

Maintenant que nous avons terminé notre chatbot, nous allons le déployer et c'est aussi la que DialogFlow est bien utile car il contient déjà pas mal d'intégration avec des systèmes de Chat existant.

Sur le coté cliquez sur *intégration*. Vous y trouverez les différentes intégration possible.

![dialogflow-integration](/assets/2017-11-06-chatbot-dialogflow/dialogflow-integration.png)

J'ai d'ailleurs utilisé l'intégration *Web Demo* pour cet article.

Si vous n'avez pas l'intégration que vous souhaitez, vous pouvez aussi utiliser les SQK disponible par DialogFlow.

![dialogflow-sdk](/assets/2017-11-06-chatbot-dialogflow/dialogflow-sdk.png)

> Bravo vous avez déployé

Maintenant il nous reste deux dernières chose que DialogFlow nous propose.
La première c'est de l'*Analytics* que vous trouverez dans le menu à gauche.

Il vous permet de voir combien vous avez eu d'appel en général et sur chaque *intents*.

![dialogflow-analytics](/assets/2017-11-06-chatbot-dialogflow/dialogflow-analytics.png)

La documentation est assez riche [ici](https://dialogflow.com/docs/analytics).

Et pour terminer, comme DialogFlow c'est aussi du machine learning, vous pouvez suivre ce dernier dans la section *Training* dans votre menu de gauche.

Vous y trouverez l'ensemble des conversations qu'il y a eu avec votre chatbot, et donc pouvoir comprendre l'utilisation qu'en a vos utilisateurs.

![dialogflow-learning](/assets/2017-11-06-chatbot-dialogflow/dialogflow-learning.png)

Ce qui est pratique c'est de voir les phrases qu'y n'ont matché aucun intent et donc pouvoir ensuite les ajouter dans un intent ou faire des réponses différentes à vos utilisateurs.

Dans l'interface vous pouvez même directement ajouter une phrase dans un intent.

Voila vous avez un chatbot performant, en plus c'est gratuit alors n'hésité plus.
