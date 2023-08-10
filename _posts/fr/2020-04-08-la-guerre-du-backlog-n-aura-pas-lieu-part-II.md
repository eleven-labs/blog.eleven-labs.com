---
lang: fr
date: '2020-04-08'
slug: la-guerre-du-backlog-n-aura-pas-lieu-part-II
title: La Guerre du Backlog n'aura pas lieu (PART II)
excerpt: >-
  RICE, KANO et ruse de Sioux - Trois nouvelles méthodologies de priorisation
  produit centrées sur vos utilisateurs !
authors:
  - mapo
categories:
  - agile
keywords:
  - agilité
  - po
  - pm
  - product owner
  - product manager
  - backlog
  - priorisation
---

Dans notre [premier article](https://blog.eleven-labs.com/fr/la-guerre-du-backlog-n-aura-pas-lieu/), nous avons détaillé trois méthodes de priorisation assez classiques du backlog : MoSCoW, WSJF, priorisation par la business value. Mais dans la bataille quotidienne de priorisation de votre produit, vous pouvez faire face à d’autres biais qui peuvent impacter négativement votre stratégie produit :

-   Prioriser de nouvelles features attrayantes et fun mais qui n’ont pas un impact suffisamment large sur vos clients

-   Prioriser votre backlog sur la base de ce que font les concurrents et non sur la base du feedback client, des idées innovantes de votre Team...

-   Prioriser uniquement les features faciles à développer, ce qui peut vous amener à un manque de stratégie produit

-   Prioriser à l’instinct sans vous baser sur les études utilisateurs, les feedbacks clients, les remontées des équipes, de vos prospects

-   Prioriser votre backlog uniquement sur la base des remontées de votre équipe Sales. S’ils sont en première ligne, au contact des prospects et clients, les demandes peuvent être disparates et ne pas concerner un nombre suffisant de clients.

Alors si la guerre du produit est déclarée, voici trois nouvelles méthodologies pour upgrader votre arsenal, “votre stuff”.

![]({{ site.baseurl }}/assets/2020-04-08-la-guerre-du-backlog-n-aura-pas-lieu-part-II/product-warzone.png)

# Tactique numéro 4 : RICE, la bataille de l’impact

La méthode **RICE** a été créée par l’équipe d’Intercom, plateforme de centralisation des échanges clients, pour ses propres besoins de priorisation produit.

![]({{ site.baseurl }}/assets/2020-04-08-la-guerre-du-backlog-n-aura-pas-lieu-part-II/rice-4-piliers.png)

Source : Intercom - Illustration: Maddie Edgar

RICE est donc une méthode basée sur le scoring de 4 éléments :

-   **Reach** ou la **Portée**

-   L'**Impact**

-   **Confidence** ou la **Confiance**

-   L’**Effort**

L’idéal est toujours de **faire scorer ces différents éléments en réunissant les bons interlocuteurs lors d’un atelier**. Le marketing, les commerciaux, le support, la R&D… pourront vous aider à mesurer le Reach et l’Impact et la team Dev est indispensable pour estimer l’Effort ! La confiance, elle, nécessite d’avoir le sentiment de toutes les parties prenantes !


### Étape 1 : Calculez la portée de l’attaque

Savoir combien de personnes vont être impactées par la feature que vous souhaitez développer est au moins aussi important que de savoir combien de soldats vous avez dans votre squad.

Pour estimer plusieurs items de votre backlog, il vous faudra donc **définir une période de temps commune**. Le nombre de clients susceptibles d’utiliser cette feature sur un trimestre, un semestre ou une année... mais la période de temps doit être la même pour toutes vos estimations RICE.

Pour la portée,il s’agit donc de déterminer **combien d’utilisateurs sont concernés par la feature** sur la période de temps définie.

***Exemple de portée*** :

Combien d’utilisateurs verront notre module d’onboarding automatique sur une période de 3 mois ?
- Nous avons 50 prospects qui souscrivent à l’offre d’essai gratuite/mois.
La portée est donc : 50 x 3 = 150 utilisateurs


### Étape 2 : Calculez l’impact de l’attaque

Il s’agit de définir l’impact que votre feature aura sur vos utilisateurs sur une échelle qui peut être la suivante :

**3** - la user story aura un très fort impact sur le produit, elle va améliorer l’engagement fortement ou convertir facilement un prospect

**2** - la user story aura un impact fort sur le produit, l’engagement

**1** - la user story aura un impact moyen pour les utilisateurs

**0,5** - la user story aura un impact faible pour les utilisateurs

**0,25** - la user story aura un impact minime pour les utilisateurs


### Étape 3 : L’effort de guerre !

Il s’agit de l’**effort de développement** pour livrer la feature en question. Ici, plutôt que de reprendre la définition de l’équipe d’Intercom, on préférera nettement utiliser notre classique **suite de Fibonacci** pour estimer l’effort à produire pour développer la feature.


### Étape 4 : Tout est une histoire de Confiance

Il s’agit d’estimer un **pourcentage entre 0 et 100 de confiance en la feature**. Quelle confiance vous avez dans la portée, l’impact et l’effort demandé pour développer la feature.

***Exemples*** :
- La Dev Team estime la feature à 21 points mais lève beaucoup d’alertes sur des incertitudes techniques et l’équipe commerciale n’est pas certaine d’atteindre 50 souscriptions à l’offre d’essai par mois. On estime donc la confiance dans cette nouvelle feature à 40%.

- Ou encore, la Dev Team a déjà réfléchi à cette feature et fait de la conception technique, c’est une feature à 13 points assurés ! et j’ai une étude auprès des utilisateurs qui m’assure d’une excellente portée de mon module d’onboarding. On estime donc la confiance dans cette nouvelle feature à 90%.


### Étape 5 : Le calcul épargne le sang !

Appliquez la formule suivante pour calculer votre score RICE pour chacune des features.

![]({{ site.baseurl }}/assets/2020-04-08-la-guerre-du-backlog-n-aura-pas-lieu-part-II/rice-formule-de-calcul.png)

Source : Intercom - Illustration: Maddie Edgar

### Étape 6 : Comparez et ré-estimez toujours !

Une fois votre RICE score obtenu pour les différents items de votre backlog, n’hésitez pas à **comparer les différents scores obtenus et à réévaluer** au besoin si un élément semble avoir un score trop faible ou trop élevé. Et surtout **réévaluez le RICE dans le temps**, l’impact, la confiance, la portée et même l’effort nécessaire peuvent évoluer très rapidement.

Cette méthodologie n’est certainement pas à appliquer pour prioriser de petites features ou des user stories. Les 4 niveaux d’analyse nécessaires en font une tactique que l’on privilégiera **pour prioriser de vraies Roadmap Features**. Elle présente cependant le grand avantage de se baser sur du tangible, la portée et l’impact notamment, des fondements solides pour votre priorisation produit !


# Tactique numéro 5 : Kano, nous avons les moyens de vous faire parler...

Vous hésitez entre plusieurs features innovantes pour votre produit et aucun des corps de métier de l'entreprise ne semble s'accorder sur la priorité à donner... On change alors d’angle d’attaque en se concentrant sur les utilisateurs du produit avec le **modèle Kano** !

Le modèle créé en 1984 par Noriaki Kano trouve son fondement dans le fait qu'il n'y a pas forcément de symétrie entre la satisfaction et l'insatisfaction d’un utilisateur.


Ainsi certains facteurs peuvent par leur absence influencer fortement l'insatisfaction sans pour autant apporter une satisfaction lorsqu'ils sont présents. De même un facteur de satisfaction client peut ne pas apporter d’insatisfaction par son absence comme le Message de Bienvenue sur une application ou le cadeau envoyé par Airbnb après la résolution d’un litige.


### Étape 1 : Préparation de l’interrogatoire

**1**.  **Listez les Epics qui font débat** en terme de priorisation et qui ont une valeur tangible pour les utilisateurs. Une US pour réduire la dette technique ou une feature de refonte graphique ne pourra pas être sélectionnée par exemple.

**2**.  **Constituez un panel d’utilisateurs et/ou prospects représentatif**. Faites attention à bien sélectionner des représentants de vos différents personae, de situations démographiques et géographiques différentes etc…

**3**.  La modèle Kano consiste à questionner chacun des utilisateurs sur son sentiment si :

-   Le produit possède cette fonctionnalité : **Fonctionnel**

-   Le produit ne possède pas cette fonctionnalité : **Dysfonctionnel**


Préparez donc bien vos questions fonctionnelles et dysfonctionnelles. Elles doivent être tournées en termes de bénéfices pour l’utilisateur, par exemple :

-   **Fonctionnel** : Vous pouvez vous logger via les réseaux sociaux, qu’en pensez-vous ?

-   **Dysfonctionnel** : Vous devez créer un profil utilisateur, login et mdp pour votre première connexion, qu’en pensez-vous ?

N’hésitez pas au besoin à présenter un prototype ou une maquette d’une fonctionnalité pour permettre aux utilisateurs interrogés de se projeter.


### Étape 2 : Déroulement du grand interrogatoire

L’utilisateur devra répondre aux deux questions en choisissant parmi les 5 réponses suivantes :

**1.  Like it** - J’aime cette fonctionnalité

**2.  Expect it** - J’attends ou espère cette fonctionnalité

**3.  Don’t Care** - Je suis neutre

**4.  Live with** - Je fais avec, je m’en contente

**5.  Dislike** - Je n’aime pas la fonctionnalité, elle me déplaît fortement


N’hésitez pas à rephraser pour les questions dysfonctionnelles pour permettre à l’utilisateur de bien exprimer ses sentiments :

**1.  Cela m’est très utile**

**2.  C’est une fonctionnalité nécessaire** pour moi

**3.  Cela m’est égal**, cela ne m’affecte pas

**4.  C’est un inconvénient mineur**

**5.  C’est un problème majeur**

***Exemple de réponse utilisateur dans notre exemple du login*** : “la fonctionnalité de login via les réseaux sociaux m’est très utile, mais cela m’est égal de devoir créer un compte utilisateur lors de ma première connexion”


### Étape 3 : Analyse de l’interrogatoire

Chacune des fonctionnalités pourra à la suite des entretiens avec les utilisateurs être située sur la grille suivante :

![]({{ site.baseurl }}/assets/2020-04-08-la-guerre-du-backlog-n-aura-pas-lieu-part-II/evaltable-kano-model.png)

Source : © Daniel Zacarias - Folding Burritos

Le modèle Kano permet ainsi d’identifier des catégories de fonctionnalités :

- **M : les facteurs de base ou "must have"** qui génèrent de l'insatisfaction s’ils ne sont pas présents et qui sont attendus dans le produit. Ce ne sont pas forcément des fonctionnalités innovantes mais elles sont nécessaires !

- **P : les facteurs de performance** qui génèrent de la satisfaction si la feature est présente et de l’insatisfaction si non présente. Plus il y en a dans le produit et plus je suis satisfaite ou moins j'ai d'action à réaliser pour atteindre cette feature et plus je suis satisfaite.
***Exemple*** : Plus il y a de reporting dans l’outil et plus je suis satisfaite ou moins j’ai d’actions à faire pour créer mon rapport et plus je suis satisfaite

- **A : les facteurs attractifs** qui génèrent une forte satisfaction sans pour autant créer d’insatisfaction s’ils ne sont pas présents
***Exemple*** : le cadeau envoyé par Airbnb suite à la résolution d’un litige

- **I : Indifférent**

- **Q : Questionnable**

- **R : À double-tranchant**

Pour plus d’information sur l’analyse des résultats, n’hésitez pas à consulter : [https://foldingburritos.com/kano-model/](https://foldingburritos.com/kano-model/)

Cette méthodologie, à nouveau, n’est pas forcément adaptée à une priorisation régulière du backlog car elle peut s’avérer très chronophage cependant elle est **extrêmement efficace pour prioriser des nouvelles features** et tester l’appétence des utilisateurs pour ces fonctionnalités, **trouver les fonctionnalités d’excitation, inattendues** qui vont créer une forte rétention client et vous démarquer potentiellement de la concurrence.


# Tactique numéro 6 : ruse de Sioux

Quelques éléments déclencheurs de la guerre :

Les feedbacks et suggestions de nouvelles fonctionnalités de vos utilisateurs pleuvent et la rétention de vos clients est en jeu... Ou encore, l’équipe commerciale vous abreuve de ces fonctionnalités, qui si elles étaient développées très rapidement, pourraient leur permettre de closer des deals...

Face à ces exemples de situations, vous pouvez rencontrer plusieurs soucis : un backlog inondé de nouvelles fonctionnalités, une équipe métier ou commerciale agacée de ne pas voir les demandes de features sortir, des développeurs découragés par le *Produit Frankenstein* qui en train de se construire...

Pour contrer ces risques de défaite Produit, je vous propose non pas une méthode mais une **organisation éprouvée**.


### Étape 1 : Attaquez les remontées clients par les flancs

Au lieu d’alimenter votre backlog d’absolument toutes les remontées clients non qualifiées, n’hésitez pas à alimenter un Trello, ou à défaut un Google Sheet, partagé avec vos différentes parties prenantes, dans lequel elles pourront elles-même faire des remontées ou demandes de nouvelles fonctionnalités.


### Étape 2 : Ouvrez un système de votes sur les différentes cartes, features demandées

Les votes pourront être donnés par les différentes parties prenantes en annotant dans la carte Trello le client ou prospect qui a fait la demande de fonctionnalité.


### Étape 3 : Qualifier les cartes

Votre tableau Trello peut par exemple contenir les colonnes suivantes : Inbox / Won’t Have / Could Have / Should Have / Must Have / Maquettes / Backlog Jira. Vous pouvez ainsi déplacer les cartes au rythme des remontées client.

À l’aide d’un Power-up Trello, une intégration automatique des feedbacks peut se faire depuis votre Zendesk, votre Intercom ou autre outil de support/suivi client dans votre Trello de suivi des demandes de nouvelles fonctionnalités.

De même, une fois un élément qualifié, un Power-up [Trello/Jira](https://trello.com/power-ups/586be36326cc4c7e9f70beb3/jira) peut vous permettre de créer de manière automatique la carte dans Jira.


### Les bénéfices de cette stratégie

Cela demande certes au PO de faire un suivi régulier d’un second board produit que le backlog Jira mais cela permet de :

- **Consigner l’ensemble des remontées clients** qui pourront venir alimenter la roadmap à plus long terme

- **Impliquer les parties prenantes et communiquer** avec eux en leur assurant un suivi positif ou négatif explicité pour chacune des remontées client

- **Justifier des choix de priorisation** et les faire comprendre : “oui les investisseurs sont friands de telle fonctionnalité mais on préfère prioriser la fonctionnalité d’export des rapports en .xls car elle intéresse plus de X prospects et X clients listés sur la carte” ou encore “Non, ta demande de fonctionnalité datant de la semaine dernière ne sera pas développée dans le prochain sprint car ta demande concernant le login via les réseaux sociaux datant d’il y a trois mois vient tout juste d’être intégrée au sprint”

Le but n’est pas ici de faire un écran de fumée sur le backlog qui doit rester l’outil central de priorisation du produit mais d’avoir **un espace vous permettant de qualifier et quantifier** les nombreuses remontées clients ou métiers et de communiquer avec vos généraux de guerre.

Il ne s’agit pas non plus de prioriser uniquement les remontées clients, vos utilisateurs ont toujours des **besoins non exprimés** ou des **besoins qu’ils ne connaissent pas encore** !


# CONCLUSION

Ces trois tactiques ont l’avantage de **mettre les utilisateurs au centre**, que ce soit au travers de l’impact et la portée dans la méthodologie RICE, la satisfaction procurée avec la méthode KANO ou la quantification des remontées utilisateurs dans la dernière proposition d’organisation.

D’autres ateliers de **Story mapping** ou d’**Impact mapping** peuvent être utilisés notamment dans le cadre de la **création d’un nouveau produit** et ils feront peut-être l’objet d’un prochain article !

Le plus important et on va se répéter ici avec la partie I de cet article, c’est de **trouver la méthode qui fonctionne avec vos parties prenantes, votre équipe, votre produit**. Alors **restez agiles, testez, itérez, changez, mixez les méthodes** en fonction de vos objectifs et de la maturité de votre produit !


## RÉFÉRENCES

[https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)

[https://foldingburritos.com/kano-model/](https://foldingburritos.com/kano-model/)
