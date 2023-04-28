---
lang: fr
date: '2021-03-04'
slug: bien-preparer-arrivee-de-equipe-de-developpement-prestataire-sur-son-produit
title: >-
  Bien préparer l'arrivée de l'équipe de développement d'un prestataire sur son
  produit
excerpt: >-
  Suivant le cycle de vie du produit et de l'ambition de l'entreprise, il est
  courant de faire appel à une équipe de développement externe pour réaliser
  tout ou partie de la prochaine version du produit. La préparation de l'arrivée
  de la nouvelle équipe est souvent négligée mais pourtant cruciale. Cet article
  a pour objectif de tracer les grandes lignes de cette préparation en amont.
authors:
  - pbrenot
categories:
  - agile
keywords:
  - product management
  - organisation
---

La vie d’un produit est rythmée par de nombreuses phases de développement (et parfois de refonte partielle) en fonction de l'ambition de l’entreprise et de son succès auprès du marché.
Dans le cadre d’une refonte partielle, pour accélérer le time-to-market d’un lot de features ou pour réaliser le MVP (minimum viable product) il est souvent plus intéressant de faire appel à une équipe de développeurs en externe : pas de long processus de recrutement, une équipe modulable et opérationnelle rapidement, un budget maîtrisé, des profils d’experts...

Que l’entreprise soit mature sur la gestion de produit digital ou non, l’arrivée d’une nouvelle équipe externe est souvent peu préparée en amont et est une des causes principales d’un produit de moindre qualité. 
Cet article n’a pas pour vocation d’être un guide exhaustif ni d’être l’unique source de vérité, mais a pour objectif de lever le voile sur les thématiques et artefacts principaux qui doivent absolument être maîtrisés, validés et partageables avant l’arrivée de l’équipe de développement du prestataire, faute de quoi elle ne pourrait pas être pleinement et immédiatement opérationnelle.


## 1. Préparer un kickOff
Trop souvent négligé, le kickOff produit est souvent vu, à tort, comme une réunion où l’on s’accorde uniquement sur les derniers détails organisationnels. C’est pourtant une étape primordiale qui permet d’embarquer la nouvelle équipe à bord de votre produit tout en lui transmettant votre connaissance.

### Synthèse de la concurrence et du marché
Pour une même feature, le niveau d’attente peut être totalement différent en fonction du marché ou du niveau de concurrence. Par exemple, une fonctionnalité permettant de récupérer des informations via un call API pour 100 ou pour 10.000 utilisateurs simultanés peut s’envisager différemment en termes techniques ou d’expérience utilisateur (potentielle lenteur du chargement : skeleton screen, non bloquant pour continuer d’avancer…). Il en est de même pour une application qui aurait des pics d’activités saisonniers très importants.  
L’équipe de votre prestataire qui arrive sur le produit est souvent totalement novice dans votre domaine, et ne fait de surcroît pas forcément partie de votre population cible (par exemple une application pour intérimaire du médical, une plateforme de réservation de stands pour professionnels sur des salons…).  
Votre produit s’est construit sur des analyses de marché, des benchmarks concurrentiels… Ces éléments doivent absolument être synthétisés et explicités à l’équipe.  
La dimension marché/métier de votre produit est indissociable de la dimension technique, vous intégrez une équipe d’experts qui doit avoir toutes les armes en main.

### Votre vision produit, business model
Dans la même logique que le marché ou la concurrence, le travail de l’équipe que vous allez intégrer va s'insérer dans un produit avec une idéologie déjà en place. Plus la vision produit et votre business modèle seront clairement expliqués et démontrés, plus l’équipe de votre prestataire sera à même de comprendre les choix réalisés et ceux à venir. De plus, parce que l’objectif est de raisonner par “valeur”, une équipe qui aura une connaissance fine de la vision produit et de son business model sera beaucoup plus pertinente pour vous proposer des idées de features ou des évolutions auxquelles vous n’auriez pas pensé car vous n’avez pas “les mains dedans”.

### Anticiper la disponibilité des parties prenantes
L’arrivée d’une nouvelle équipe externe sur un produit est souvent synonyme de bouleversement du quotidien des différents acteurs, d’évolution des responsabilités, de hausse de la charge de travail potentielle et de modifications de la routine.  
C’est lors du kickOff qu’il convient notamment de s’assurer de prévenir les différents acteurs internes du temps qu’ils devront dégager pour accompagner les débuts de l’équipe : des ateliers avec le métier, des échanges avec la DSI, des points réguliers avec les product owners des autres équipes… Bien trop souvent ce point est négligé, ce qui oblige l’équipe à courir après les intervenants en interne et à repousser les ateliers et transferts de connaissances, ce qui au final est dommageable pour la qualité du produit et le moral de l’équipe.

### Outils, droits, dépôts de fichiers et accès
Vous n’en avez peut-être pas la connaissance directe ou exhaustive mais l’équipe du prestataire va devoir travailler dans votre environnement et donc utiliser et accéder à vos outils : il leur faut donc un accès.  
Cela peut aller du simple accès à votre Google Drive ou à votre board Jira, à un accès à vos outils de CI, votre Github, Storybook ou tout autre outil “technique”.  
Pensez à bien lister ces éléments en amont et à vérifier les licences associées, car un compte supplémentaire est parfois synonyme d’une licence à payer en plus (ou parfois de passer de la version gratuite à la version payante).

## 2. S’assurer de connaître suffisamment votre produit et son contexte
Pour que l'efficience de l’équipe de votre prestataire soit maximale : il vous faut avoir balayé toutes les zones d’ombres qui entourent votre produit. il faut que vous sachiez où est ce que vous allez, pour qui, et pourquoi. Si vous n’en êtes pas certains, vous pouvez être assuré que vous perdrez du budget sur de potentiels ajustements a posteriori.

### Risques et hypothèses
Un produit se construit de manière itérative, dans un contexte changeant et pour lesquels les acteurs et décideurs ont une rationalité limitée. Ainsi, les features que vous allez demander de développer à l’équipe de votre prestataire sont souvent basées sur des hypothèses de travail vérifiées, des statistiques, des recherches utilisateurs, des études de marché… Si ce n’est pas le cas : alors c’est le plus souvent foncer dans le mur en brûlant du budget.  
Vous avez émis en amont du projet des hypothèses (exemple : nos utilisateurs souhaitent mettre en favoris des éléments avant de les mettre dans leur panier et de finaliser leur achat), et vous devez les vérifier avant d’envisager engager votre futur équipe dessus. Personne ne souhaite travailler sur des éléments sans valeur réelle, qui ne seront pas utilisés. La démotivation et la déception peuvent arriver plus vite qu’on ne le pense.

### User journey et persona
Afin que l’équipe qui arrive puisse être opérationnelle instantanément, elle s’attend à ce qu’on lui fournisse un ensemble de documents liés au produit pour en expliquer son fonctionnement, les interactions qu’ont les utilisateurs avec le métier… Toute la partie User Experience que vous aurez réalisée en amont avec vos UX designers. Et parce qu’il existe une multitude de façons de formaliser cela, il peut être intéressant de proposer à minima un user journey et des fiches sur les principaux personae.

Un user journey représente de manière synthétique et chronologique le parcours d’un utilisateur pour réaliser une action définie (exemple : acheter un produit). Les features qui seront à développer par l’équipe de votre prestataire viendront s'insérer directement dans ce processus (voire même : réaliser ce processus). Comme ce document se base sur un mélange de retours utilisateurs, de métier et du marketing : vous devez l’avoir réalisé en amont. Je ne peux que vous conseiller le [très bon article sur le sujet disponible sur ce blog](https://blog.eleven-labs.com/fr/customer-journey-map-votre-arme-secrete-pour-cartographier-votre-parcours-client/)  
Concernant les personas (qui sont des fiches synthétiques qui décrivent les buts, souhaits, “pain points” et critères socio-démographiques d’un ensemble cohérent d’utilisateurs représenté artificiellement par “un” utilisateur non existant), vous devez être en mesure de pouvoir en lister les principaux afin que l’équipe soit en mesure de moduler ses développement, proposer des évolutions ou des priorisations cohérentes avec la base (ou future base) utilisateur.

### Une Roadmap
Il est primordial d’offrir une vue d’ensemble, même macro, à la future équipe.  
L’équipe, autonome, doit être en mesure d’anticiper les prochains grands jalons, les objectifs en cours et à venir, ainsi que les grandes étapes du produit.  
Une roadmap à jour est donc un incontournable.  
Pas besoin d’une vision trop précise, elle s'affine avec le travail de l’équipe, mais il faut à minima que votre roadmap propose une vision synthétique des objectifs sur les 3 prochains mois, et un peu plus large sur les 3 suivants.  


## 3. Disposer d’assets graphiques et d’artefacts directement utilisables et validés
Une équipe ne peut être opérationnelle que si elle dispose d’éléments exploitables et validés pour venir alimenter ses développements. Il est crucial que pour l’arrivée de l’équipe de votre prestataire vous ayez réalisé la plus grosse partie de l’UX design, de la création graphique ainsi que de la rédaction de vos spécificités fonctionnelles ou User Stories.

### Design system et bibliothèque de composants
Afin que votre application, plateforme service, etc. dispose d’une expérience utilisateur cohérente (entre les différentes équipes, entre les différentes fonctionnalités…), il est primordial que la future équipe dispose d’éléments graphiques suffisamment clairs pour ne pas avoir besoin de faire des choix ou de se poser trop de questions.

L’équipe s’attend donc à ce qu’on lui fournisse des éléments graphiques prêts à être intégrés : par exemple un export sur Zeplin.io, des maquettes Sketch, un storybook déjà réalisé par une autre équipe portant sur le même projet, un design system fait par l’UX/UI et qui contient les différents styles de boutons et leurs état, en plus des maquettes desktop et mobile de toutes les pages.  
Sans ces éléments, l’équipe va perdre du temps et de la vélocité, et devra interpréter. C’est souvent synonyme de perte de qualité.

### Backlog priorisé et story mapping
Un listing exhaustif des spécificités fonctionnelles envisagées sur votre produit n’est pas suffisant pour que l’équipe puisse exprimer pleinement sa capacité à développer un produit avec un ROI maximal.  
En effet, l’équipe s'attend aussi à disposer d’un backlog priorisé qui reprend toutes les fonctionnalités souhaitées, détaillées du point de vue utilisateur (exemple : “en tant qu’utilisateur je souhaite pouvoir ajouter un produit dans mon panier depuis n’importe quelle page ou liste produit”) mais aussi avec des règles métiers (exemple : ajouter un produit dans son panier ne retire pas le produit du stock, il le "réserve" juste pour 15 minutes) et la maquette ou le composant graphique associé.

Cette liste doit bien évidemment être priorisée, du plus impactant et important pour le produit, au moins nécessaire.

## 4. L’équipe dans votre organisation
On dit souvent, à juste titre, qu’un produit est le reflet de l’organisation de l’entreprise qui le produit. Ainsi, que l’entreprise ou le service dans lequel l’équipe du prestataire va être intégrée soit grand ou plus modeste, il faut avoir réfléchi à la façon la plus efficiente de le faire.

### Quelle méthodologie (Lean, Agile…) ?
Tout d’abord commençons par la méthodologie de travail de l’équipe. Est-ce que l’équipe sera libre et autonome sur ce point ? Peut-elle appliquer un framework AGILE comme SCRUM ? Êtes-vous à l’aise avec des livraisons itératives toutes les 2 semaines ? L’équipe pourra-t-elle faire tester ses fonctionnalités auprès d’utilisateurs le plus rapidement possible ?  
Toutes ces questions devront êtres définies en amont du projet et sont directement liées à sa réussite.  
On n’intègre pas une équipe AGILE dans une entreprise qui ne l’est pas, comme on intègre une équipe qui fait du SCRUM dans une entreprise qui applique SAFe.  

### Les points d’arbitrage et de pilotage envisagés
Bien que vous ayez listé et priorisé dans un backlog toutes les fonctionnalités envisagées pour le produit et que l’équipe soit autonome : il vous faut avoir réfléchi à la façon dont l’entreprise (et vous) allez interagir avec l’équipe.  
Par exemple, comment allez-vous fixer et mesurer l’atteinte des objectifs de l’équipe ? À quelle fréquence souhaitez-vous pouvoir échanger avec elle, sur quels critères souhaitez-vous avoir un pouvoir décisionnel versus sur quels éléments leur accordez-vous une totale autonomie ?  
Vous pourriez par exemple décider de fixer des OKRs trimestriels (Objective Key Results) à l’équipe et qui découlent directement des objectifs de l’entreprise, puis de fixer une démo du travail accompli toutes les 2 semaines et enfin un comité de pilotage et de revue de la roadmap tous les 2 mois afin de discuter du budget et des besoins de l’équipe afin d’avancer sur la roadmap.

### Les processus de validation
Qui valide les éléments qui sont transmis à l’équipe ? Qui valide la priorisation ? Qui valide les éléments livrés ? Qui fait la recette ? Ce sont toutes ces questions qui doivent avoir trouvé leur réponse avant l’arrivée de l’équipe de votre prestataire.

Dans le cas d’une grande entreprise multi-équipes la réponse est souvent facile car la hiérarchie est posée. Mais dans le cas d’une entreprise qui se lance sur un nouveau segment (avec un produit digital par exemple, ou une refonte) il est souvent difficile de trouver les bonnes personnes, avec les compétences nécessaires et assez de temps.

Vous pouvez par exemple mettre en place une matrice RACI pour vous aider à identifier et figer les rôles et processus de décisions.

### Votre niveau d’attente
Le niveau de qualité des livrables qui seront produits par l’équipe de votre prestataire dépendra directement du temps alloué, du budget et du périmètre fonctionnel envisagé.  
Il vous appartient donc d’être très clair et parfaitement réaliste sur le sujet, dès le début. Ainsi, si la dimension SEO est primordiale, il faut l’envisager en amont car cela aura un impact non négligeable sur les livraisons.

### Qui dit “On met en PRODUCTION” ?
C’est souvent la décision la plus difficile à prendre, à tort. Et le manque d’une personne clairement identifiée pour la prendre pourra repousser le time-to-market (où la livraison effective en production de votre lot fonctionnel) de la feature développée.

Il est souvent plus dommageable pour un produit, et donc pour le business, de retarder une mise en production d’une fonctionnalité car on repousse le moment où l’on peut disposer de retours utilisateurs, et donc de s’améliorer.  
Il est primordial qu’une personne soit définie comme responsable pour dire “OK PROD”.

# Conclusion  
La quantité de travail nécessaire pour préparer le terrain pour l’arrivée d’une équipe d’un prestataire est souvent sous-estimée. Cela représente effectivement un investissement de temps et d’efforts et cela nécessite de produire de nombreux documents, d’anticiper énormément de choses et des compétences et connaissances très diverses (technique, métier, communication, marketing…).  
Néanmoins, cela reste un temps bien investi car garant d’une équipe qui sera opérationnelle dès le premier jour, autonome, motivée, avec des objectifs clairs et en capacité de faire preuve d’initiatives. La qualité du produit n’en sera que meilleure, et le time-to-market plus court.  
Dans une majorité des cas, les acteurs internes à l’entreprise n’ont que peu de temps à accorder à cette tâche et cela peut être intéressant de faire appel sur les premières semaines à un Product Owner, qui reprendra ensuite le travail avec l’équipe de développement.
