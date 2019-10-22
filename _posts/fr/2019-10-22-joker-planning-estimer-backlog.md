---
layout: post
title: "Joker planning : estimer pour la première fois son product backlog"
lang: fr
permalink: /fr/joker-planning-estimer-pour-la-premiere-fois-son-product-backlog/
excerpt: "Un vrai casse-tête pour tout Product Owner et pour la team se lançant dans la réalisation d’un nouveau produit ! Tirant le Joker de ma manche, je vous laisse en compagnie du master mind de Gotham City pour vous guider."
authors:
    - mae
categories:
    - agile
tags:
    - agile
    - estimation
    - planning

---

Un vrai casse-tête pour tout Product Owner et pour la team se lançant dans la réalisation d’un nouveau produit : réussir à prendre un engagement en terme de développement dès le premier sprint auprès de son client (externe ou interne) ou de sa direction.

Tirant le Joker de ma manche, je vous laisse en compagnie du master mind de Gotham City pour revenir sur la base de l’estimation, les meilleures stratégies à adopter et les pièges à éviter pour se lancer dans le crim… Euh pardon, dans le développement de son produit !

## 1. "Estimer c'est faire un choix. Pourquoi cet air si sérieux ?"
 
![]({{site.baseurl}}/assets/2019-10-22-joker-planning-estimer-backlog/joker.jpg)

Quand on parle d’estimation de son product backlog, on parle de l’estimation en points d’effort des user stories composant le backlog de votre produit.

Avant d’entrer dans le vif du sujet, reprenons le processus de pré-estimation, au cours de sa vie, de votre product backlog.

Vos US sont prêtes en termes de spécifications fonctionnelles. Elles ont été présentées au reste de la team pour s’assurer de la compréhension des futures features demandées, mais aussi pour procéder à un redécoupage si nécessaire.

Arrive ensuite la phase d’estimation par l’équipe de développement en terme de **points d’effort** pour chacune de ces user stories.

Et avant d'évoquer des méthodologies pour se lancer la première fois dans une estimation, listons d'abord quelques exemples d'ateliers qui me paraissent intéressants d'évoquer ici :

-   **Le “Planning Poker”**

Méthodologie la plus utilisée en Scrum pour estimer son backlog, elle s'accompagne d’un jeu de cartes reprenant les valeurs de la suite de Fibonacci : 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, « ∞ » et « ? ». Ces valeurs ne représentent pas des jours / hommes, mais des valeurs volontairement neutres pour représenter des “story points” ou “point. Les deux dernières options sont utilisées dans le cas d’une user story non estimable : soit parce que trop complexe et nécessitant une étude, soit parce qu’elle n’a pas été comprise par la personne.
 Après un temps d’échanges limités autour de l’explication d’une user story, tous les membres de l’équipe de développement, cartes en main, doivent la chiffrer en même temps en nombre de points. Si une disparité dans les valeurs révélées est trop importante, chacun défend sa proposition, et on relance l’estimation jusqu’à arriver à un consensus.

-   **La taille de t-shirt**

Il s'agit d'une technique plutôt informelle qui se sert des différentes tailles de t-shirt pour estimer les fonctionnalités présentées : XS, S, M, L ou XL. Cette technique peut-être pratique pour chiffrer un grand nombre de user stories en même temps et avoir une estimation du backlog dans sa globalité par exemple. Mais ne permet pas d’avoir une estimation aussi précise qu’avec la suite de Fibonacci, plus adaptée pour estimer les prochaines US à développer plus proches dans le temps et probablement plus complètes.
    

-   **Le “Bucket System”**

Ressemblant quelque peu au planning poker, on ne se sert pas de cartes mais on définit des “buckets” (seaux en français) sous forme de post-it. Chaque bucket possédant une valeur parmi la liste suivante : 0, 1, 2, 3, 4, 5, 8, 13, 20, 30, 50, 100 et 200. Toutes les US sont elles-aussi rédigées sur des post-its ou des fiches.
Une US est choisie au hasard pour être présentée puis placée sous le bucket “8” afin de faire office de première référence (8 étant le milieu entre le plus petit et le plus grand bucket).
Une seconde US est lue, puis après échanges, elle est placée sous un bucket choisi en fonction de la première. Le processus est reproduit une troisième fois.
Ces trois US réparties forment désormais le référentiel. Chacun peut prendre une fiche et le positionner sous le bucket qui lui semble correspondre. Et chacun peut débattre pour remettre en question le placement d’une US et adapter son estimation.

Cette dernière technique est cependant difficilement applicable en Scrum : elle ne permet pas d’avoir une vélocité définie pour l’équipe - basée sur un référentiel fixe et non aléatoire (les précédentes estimations). Donc de pouvoir planifier son prochain sprint en sachant la limite de ce qui pourra être réalisé par l’équipe sur le temps imparti.

Si vous souhaitez tout de même mettre en place ce format, je vous conseille de ce fait de prendre en référentiel une user story déjà réalisée et d’estimer les autres vis à vis de celle-ci.



## 2. "J'ai vraiment l'air d'avoir un plan ?"
    
C’est bien beau, toutes ces méthodologies à utiliser pour estimer les user stories du backlog d’un environnement maîtrisé et avec une équipe déjà rodée. Mais comment faire pour se lancer pour la première fois dans un planning poker ou une estimation en taille de t-shirt ?

Voici quelques idées pour vous aider :

-   **L'Objectif de sprint**

Fixer un objectif de sprint à atteindre avec l’équipe de développement, qui ne soit pas trop restrictif (l’équipe ne doit pas avoir pieds et poings liés) mais qui ait un sens pour tout le monde, aussi bien côté développement que compréhensible pour un client ou une direction.
    
Cela doit être des objectifs très simples, comme de prendre en main la stack et l’environnement du produit, très important si une équipe récupère un produit déjà en production par exemple.
    
Ou encore de livrer seulement les premiers champs d’un formulaire de connexion sans avoir toute l’authentification raccordée de bout en bout, de réaliser un POC, etc.

  

-   **Les référentiels**

Prendre des user stories de référence est une technique très simple, et peut aider toute l’équipe à se lancer plus justement dans cette première réunion d’estimation. L’idée est de choisir une première user story dans le backlog qui est très simple, et qu’on pourra estimer à 1. Puis d’en choisir une autre, cette fois-ci à l'opposé, qui semble à l’équipe bien complexe, et qui pourra être estimée à 8 ou 13.
    
Ces 2 US identifiées vont servir de référence pour pouvoir chiffrer toutes les autres de manière relative.
La science infuse n’existant pas, des ajustements seront potentiellement à prendre en compte lors de la seconde réunion d’estimation avec une revue à la hausse ou à la baisse de la valeur du ticket le moins complexe ou du plus complexe.
Mais cela permettra dans tous les cas et dès le départ, de garder une estimation relative entre vos tickets.

-   **L'Extreme Quotation**

Un lancement de produit implique parfois un premier backlog très chargé à estimer et avec beaucoup d’inconnu pour les développeurs. Pour palier à cette problématique, il existe un atelier très simple à mettre en place : l’Extreme quotation.
Pour ce faire, prenez votre jeu de planning poker, disposez les cartes sur une grande table puis écrivez vos US sur des post-it.
Dans cette première phase, invitez les développeurs à choisir tous en même temps une user story, et à la placer sous une estimation. Puis de continuer jusqu’à ce qu’il n’y en ait plus à estimer. L’avantage ici est de ne pas se focaliser user story par user story, mais que chacun avance à son rythme en donnant sa propre estimation.

Commence la seconde phase où chaque développeur, dans le silence, va bouger les post-its si la valeur estimée ne lui semble pas juste.
Enfin, une fois qu’un consensus silencieux semble avoir été trouvé, on passe en revue les estimations attribuées. Si certaines user stories sont placées entre 2 valeurs, c’est la plus grande qui est choisie.
L’atelier est terminé et le backlog estimé ! Le chiffrage des US est bien relatif et l’équipe a pu avoir un aperçu de ce qui l’attend dans sa globalité.


-   **Le 5 Jours / Homme**

Dernière méthodologie pour vous permettre d’estimer pour la première fois votre backlog : choisir une user story qui pour la team peut-être estimée à environ 5 jours / homme, et la chiffrer à 5. Cette US devient référente et par la suite les estimations se font à plus ou moins de celle-ci, sans plus tenir compte des jours / homme associés au départ.
    
Personnellement, je ne recommande pas l’utilisation de cette méthode. Par expérience, il est très difficile par la suite pour les développeurs de se détacher de l’association des valeurs à une estimation en jour.
Mais si vous avez une équipe qui se sent rassurer par ce fonctionnement, ou même une direction très attachée à la notion de planning (comme cela arrive souvent), cette technique peut être adaptée.

## 3. "Introduire une goutte d'anarchie, et tout devient brutalement ... chaotique"
    
Avant de vous lancer dans l’estimation, balayons quelques points d’attention !

![]({{site.baseurl}}/assets/2019-10-22-joker-planning-estimer-backlog/black-joker.jpg)


-   **Points d’effort & points de complexité**
    
Il est important de distinguer points d’effort (ce que j’appelle également story point) avec des “points de complexité”.
Un point de complexité n’embarque dans sa définition que la complexité technique d’une fonctionnalité à développer.

Là où les points d’effort, en plus de la complexité, doivent aussi tenir compte de la quantité de travail à fournir, les risques potentiels pendant le développement de la feature, les dépendances avec d’autres éléments mais aussi les inconnues au moment de l’estimation.

-   **Ne pas chiffrer sans comprendre**
    
Donner une estimation à la louche en simplifiant ou complexifiant une tâche alors que l’équipe ou une partie de l’équipe n’a aucune idée soit de la demande, soit de la valeur de l’estimation qu’elle vient de faire va dans tous les cas mettre vos prochains sprints en danger.

Au delà évidemment du fait que votre potentiel sprint en cours pourra prendre du retard du fait de la non compréhension des enjeux techniques, ou d’un chiffrage plus ou moins approximatifs qui sera mal tombé.
Vous pouvez impacter vos prochains sprints en biaisant vos prochaines estimations, l’idée étant de garder vos précédentes US déjà réalisées comme référentes pour estimer les nouvelles.
 

-   **Accepter l’apprentissage**
    
Enfin, il est également important que l’équipe : Team Dev, Product Owner, Scrum Master mais aussi (et surtout) le Client / Sponsor se rappelle que le principe même de l’agilité est basé sur l’expérience.

Ce qui en fera une approche toujours plus efficace dans le temps que les méthodologies traditionnelles de gestion de projet. Mais qui donne par cette même définition, la possibilité voir même l’intérêt pour une équipe de se tromper afin de pouvoir réaffirmer la direction à prendre. 

Il est donc clé pour le bon lancement de tout projet, d’expliquer à son équipe, sa direction ou encore son client (qui ne sera probablement pas au fait) que les premiers sprints serviront d’équilibrage pour la suite.

Expliquer à son client que les premiers sprints permettront d’apprendre à connaître la stack, le produit et l’objectif produit, aussi bien que les développeurs entre eux. Au fur et à mesure, au bout de 3-4 sprints, les estimations pourront enfin être plus justes, et l’engagement de l’objectif de sprint tenu.

  
## Pour conclure : "Avant de me juger, assurez-vous d’être parfaits"

Vous allez forcément vous **tromper** les premières fois où vous estimerez votre product backlog. Mais cela fait parti du jeu et de la vie d’une équipe au sein d’un projet.

Le plus important est de partir sur de bonnes bases et d’avancer en suite. De par ce même fait, les estimations données à un instant T ne sont pas des valeurs fixes pour le reste de la vie du produit.

Au fur et à mesure, une équipe va connaître de mieux en mieux son environnement, le langage technique, le contexte (d’où l’importance de le partager le plus souvent possible avec sa team dev sans entraver leur routine de développement).  
**L’estimation évoluera**, et de plus en plus des tâches qui auront parues complexes au départ le seront beaucoup moins par la suite.

Cependant, et je vous vois venir d’ici !N'imaginez pas que cette explication signifie que la vélocité d’une équipe peut augmenter en terme de points d’effort possibles à embarquer de sprint en sprint.  
Vous auriez tort, mais si dans le fond, ce n'est pas totalement faux pour autant.

La vélocité d’une équipe qui évolue grâce aux connaissances acquises et à l’habitude permettra en réalité de chiffrer à moins de points des US qui auraient pris plus d’effort auparavant.

Je vous laisse à vos affaires pour retourner aux miennes, Batman m'attend impatiemment. 
Et n'oubliez pas : l'estimation, c'est comme la gravité, il suffit parfois juste d’un petit coup de pouce ;).
