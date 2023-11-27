---
contentType: article
lang: fr
date: 2023-11-29
slug: integration-crm
title: "Comment intégrer son CRM en asynchrone"
excerpt: "Cas d'usage avec Hubspot et RabbitMQ"
categories:
    - php
keywords:
    - crm
    - hubspot
    - rabbitmq
authors:
    - youyou
    - fbelet
    - charles-eric
---
Dans cet article, nous allons nous plonger dans l'intégration d'un CRM (Customer Relationship Management)
au sein d'une application e-commerce.

Un CRM est une solution SaaS (Software as a Service) externe dotée de fonctionnalités,
telles qu'une API et des webhooks (qui permettent de recevoir des notifications en temps réel).
Ces fonctionnalités jouent un rôle central dans la gestion efficace des relations clients.

Pour illustrer ce processus, nous allons nous concentrer sur une application e-commerce personnalisée
qui représente le cœur de notre activité.

Bien entendu, ces principes d'intégration pourraient s’appliquer également à divers systèmes ERP
(Enterprise Resource Planning), mais pour les besoins de notre exemple, nous allons prendre en considération
deux CRM renommés, à savoir Salesforce et HubSpot. (Restez à l'affût, car nous publierons bientôt des
articles détaillés sur l'intégration avec chacun de ces deux CRM.)

![Schema Global]({BASE_URL}/imgs/articles/2023-11-29-integration-crm/integration-crm-schema-global.png)

Pour réaliser cette intégration, nous allons adopter une approche basée sur le concept d'« event-driven »,
où des événements (events) se déclenchent des deux côtés de l'équation,
et nous utiliserons l'outil RabbitMQ pour faciliter cette synchronisation bidirectionnelle.

Par exemple, des événements peuvent provenir de notre plateforme
(comme 'business_created' ou 'purchase_updated') et aussi du CRM (comme 'company_edited').
Les événements se manifestent des deux côtés.

Je vous invite à consulter cet [article de Marie](https://blog.eleven-labs.com/fr/event-driven-architecture-examples/) qui explore plus en profondeur
le concept d'« event-driven ».

![Schema Events]({BASE_URL}/imgs/articles/2023-11-29-integration-crm/integration-crm-schema-rabbit.png)

Lorsque l'on synchronise un CRM avec une application e-commerce,
il est essentiel de prendre en compte des correspondances.

Par exemple, un 'account' côté CRM équivaut à un 'user' côté e-commerce,
un 'order' à un 'purchase', et un 'company' à un 'business'."

## Concepts généraux

L’une des questions à se poser quand on implémente un CRM c’est au niveau de la gestion des erreurs.

Lors de notre implémentation, nous avons opté pour un Event Driven Design (lien vers l’article de Marie), asynchrone, avec une politique de retry.

Asynchrone:

L'Event Driven Design offre une grande résilience.
Lorsqu'un événement est publié, il est stocké dans une file d'attente ou un système de messagerie.
Si, pour une raison quelconque, la synchronisation échoue, les événements restent dans la file d'attente, prêts à être traités à nouveau.
Cela signifie que les erreurs temporaires ou les pannes de système n'impactent pas la synchronisation des données.
De plus, la possibilité de mettre en place des mécanismes de retry automatique garantit que les données seront finalement synchronisées avec succès,
même en cas de problèmes temporaires.

![Schema Detailed]({BASE_URL}/imgs/articles/2023-11-29-integration-crm/integration-crm-schema-detailled.png)

Dans notre exemple de synchronisation avec Hubspot, nous avons un webhook qui est trigger lorsqu’un statut spécifique de Company est ajouté côté CRM.
Le besoin sur notre application est de récupérer les informations de Company et de Contacts associés au trigger, et de les stocker.

Une solution simple et synchrone serait de GET ces informations via l’API d’Hubspot.

Imaginons qu’un problème survient au moment de la synchronisation des Contacts de la Company en question, quel est l’état de notre base côté applicatif ?

Nous aurons une Company enregistrée avec aucun contact, et une erreur dans les logs.
Aussi il faudrait re-GET les informations de contacts liés à cette Company.

Même problème pour la Company, où en cas d’erreur sur notre application, nous devons refaire une call pour récupérer ces mêmes informations.

## Retry

Dans notre exemple plus haut, suite au trigger du webhook, on a choisi de Publish un Event.
Cet event est stocké dans la queue, donc si des soucis opèrent au niveau du GET des Companies et Contacts,
l’opération reprendra. On peut même configurer des cas où l’on veut que ça ne retry pas du tout
(ex : type, erreur 500, etc.).

Dans un second temps, à chaque GET de Company/Contact, on stocke ces informations dans notre BDD Mongo.
Ces informations sont uniquement exploitées dans le cadre de ces Consumers,
pour la suite des opérations.

S’il survient une erreur côté synchronisation, on ne va pas vouloir recommencer toute l’opération de GET côté Hubspot:
ces informations sont stockées dans notre base de données.

Notons que la synchronisation CRM ⇔ notre App est aussi faite à travers des consumers,
donc nous avons la même politique de Retry qui s’applique.

## Presque Real-Time

L'Event Driven Design permet une synchronisation presque en temps réel.
Bien que cela soit asynchrone, la latence est généralement très faible.
Les événements sont traités rapidement, ce qui signifie que les mises à jour des données
dans votre CRM sont quasi-instantanées.

Dans notre cas, la synchronisation presque en temps réel est une approche qui privilégie
la réactivité, l'expérience utilisateur, le suivi en temps réel des activités et la
réduction de la latence. En revanche, la synchronisation par lots (batching)
une fois par jour est moins réactive, peut générer des problèmes de performance et peut
entraîner des retards dans la mise à jour des données.
Le choix entre ces deux approches dépend des besoins spécifiques de votre entreprise
et de vos objectifs en matière de gestion des données.

## Initialisation des données

Lorsque vous envisagez d'intégrer une nouvelle plateforme e-commerce à votre CRM existant,
ou lorsque vous migrez vers un nouveau CRM, l'une des étapes critiques est l'initialisation
des données.
Cette phase consiste à transférer l'ensemble des données historiques,
telles que les informations sur les clients, les contacts, et bien plus encore,
du CRM vers votre plateforme (ou autre CRM).
C'est là que la synchronisation par lots (batching) joue un rôle crucial.

Voici certains avantages que nous avons notés lors d’une synchronisation par batching :

- **Contrôle et Précision** : Lors de la migration initiale, il est essentiel d'avoir un contrôle
précis sur les données qui sont transférées.
Le batching permet de planifier soigneusement la migration, de réaliser des tests,
d'identifier et de résoudre les problèmes potentiels avant le transfert complet des données.
  Minimisation des Perturbations : Les migrations initiales de données peuvent être une tâche complexe, surtout lorsque de grandes quantités de données doivent être déplacées. Le batching vous permet de minimiser les perturbations dans les opérations quotidiennes, car vous pouvez planifier la migration en dehors des heures de pointe.

- **Réversibilité** : En cas d'erreur ou de problème imprévu lors de la migration, la synchronisation par lots offre la possibilité de revenir
en arrière, d'ajuster les données, et de réessayer.
Cela réduit les risques liés à la perte de données critiques.

- **Optimisation des Performances** : Lors d'une migration initiale,
les volumes de données sont généralement importants.
La synchronisation par lots permet d'optimiser les performances en transférant les données
de manière efficace, en minimisant les goulots d'étranglement,
et en garantissant que le système fonctionne de manière stable pendant le processus.

## REX / Tips & tricks

Comprendre en profondeur le CRM que vous allez intégrer est une étape essentielle.
Avant de vous lancer dans le développement, assurez-vous de bien analyser le CRM cible,
testez sa connectivité API, et familiarisez-vous avec le processus de configuration des
applications, ainsi que la gestion des identifiants (credentials).
Cette préparation minutieuse vous permettra d'éviter des erreurs coûteuses et de garantir
une intégration fluide.

Lors de la mise en place de votre intégration, il est essentiel de s'assurer d'un modèle de données cohérent entre le CRM et l'e-commerce. Voici comment procéder de manière méthodique :
1. **Comparaison des Propriétés** :
   - Créez un tableau de correspondance avec des colonnes pour le CRM et l'e-commerce.
   - Répertoriez les propriétés des entités des deux côtés pour un aperçu clair.
   - Assurez-vous que les types de données concordent entre les deux systèmes.
2. **Règles de Validation** :
   - Établissez des règles de validation cohérentes, telles que la vérification des adresses e-mail, la longueur des propriétés, etc.
   - Incluez des règles fonctionnelles, telles que la dépendance entre les champs (p. ex. un champ requis uniquement si un autre est rempli).
