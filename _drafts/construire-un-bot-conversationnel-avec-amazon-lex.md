---
layout: post
title: Construire un bot conversationnel avec Amazon Lex
authors:
    - VEBERArnaud
excerpt: "Dans un premier temps, nous allons découvrir amazon lex, qu'est ce que c'est et comment ca fonctionne.
Puis dans un second temps nous allons créer notre premier bot conversationnel que nous brancherons ensuite dans Twilio."
permalink: /fr/construire-un-bot-converstionnel-avec-amazon-lex/
cover: /assets/construire-un-bot-conversationnel-avec-amazon-lex/cover.jpg
---

## Amazon Lex, qu'est ce que c'est ?

Amazon Lex est un service permettant de créer des interfaces de conversation dans une application reposant sur la voix
et le texte.
Amazon Lex offre des fonctionnalités de deep learning avancées incluant la reconnaissance automatique de la parole (RAP),
permettant de convertir une saisie orale en texte, et la compréhension du langage naturel (CNL), qui vise à reconnaître
l'intention du texte.
Vous pouvez ainsi concevoir des applications offrant une expérience utilisateur très attrayante et des interactions
prenant la forme de conversations vivantes et naturelles.
Avec Amazon Lex, les technologies de deep learning qui propulsent Amazon Alexa sont désormais accessibles à
tous les développeurs.
Vous pouvez donc créer facilement et rapidement des robots de conversation (« chatbots ») perfectionnés, comprenant et
utilisant le langage naturel.

La reconnaissance de la parole et la compréhension du langage naturel font partie des problèmes les plus difficiles à
surmonter en informatique ; elles nécessitent des algorithmes de deep learning très élaborés pour emmagasiner des
connaissances à partir d'importantes infrastructures et d'énormes volumes de données.
Amazon Lex démocratise ces technologies de deep learning en mettant la puissance d'Amazon Alexa à la portée de
tous les développeurs.

## Comment ca fonctionne

### Workflow

![amazon lex bot structure](/assets/construire-un-bot-conversationnel-avec-amazon-lex/amazon_lex_bot_structure.png)

### Vocabulaire

**Bot**: Le bot contient tous les composants d'une conversation.

**Intent**: Un intent (intention) représente un objectif que l'utilisateur veut atteindre.
Par exemple: acheter un billet d'avion, planifier un rendez-vous, ...

**Utterance**: Une utterance est une expression parlée ou écrite qui invoque une intention.
Par exemple: "*Je veux réserver un hôtel*", "*Je souhaite commander des fleurs*", ...

**Slots**: Chaque slot est une donnée que l'utilisateur doit fournir afin de réaliser l'intention.
Par exemple: un bot de voyage pourrait avoir besoin d'un aéroport de départ et de destination.

**Prompt**: Un prompt est une question qui demande à l'utilisateur de fournir des données (pour un slot) nécessaires
pour réaliser une intention.

**Fulfillement**: Le fulfillement est la logique métier qui réalise l'intention de l'utilisateur.
Lex prend en charge l'utilisation

## Créons notre premier bot conversationnel

![amazon lex first open](/assets/construire-un-bot-conversationnel-avec-amazon-lex/amazon_lex_first_open.png)
