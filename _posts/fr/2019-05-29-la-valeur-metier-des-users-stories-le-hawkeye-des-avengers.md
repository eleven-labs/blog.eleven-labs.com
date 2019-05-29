---
layout: post
title: "La valeur métier des Users Stories, le Hawkeye des Avengers"
lang: fr
permalink: /fr/la-valeur-metier-des-users-stories-le-hawkeye-des-avengers/
excerpt: 'Clairement, quand on vous parle des Avengers, je pense que Clint “Hawkeye” Barton est probablement l’un des derniers membres auxquels vous allez penser. Quand on vous parle de User Story, ce à quoi beaucoup d’équipe ne pense pas, c’est à la valeur métier qui va déterminer sa pertinence et sa priorité.'
authors:
    - mae
categories:
    - agile
tags:
    - po
    - backlog
    - us
    - agile

---

.... On l’oublie bien trop souvent !

Clairement, quand on vous parle des Avengers, je pense que Clint “Hawkeye” Barton est probablement l’un des derniers membres auxquels vous allez penser.

Quand on vous parle de User Story, vous allez tout de suite penser à la BDD, aux critères d’acceptances, règles de gestion, ou encore à les prioriser et les chiffrer en terme de complexité.

Et ce à quoi beaucoup d’équipe aujourd’hui ne pense pas forcément, c’est à la valeur métier que doit représenter cette US. Valeur qui va déterminer sa pertinence et sa réelle priorité à être développée.


## Sommaire
 1. Does anybody copy my User Story ?
 2. BDD, INVEST, DOR & DOD : a Wordsmanship ability
 3. Business value : Why are you even here ?
 4. Risks : willing to take your chances ?
 5. Keep a better line of business value
 6. Conclusion : Make sure your US is safe
 
## 1. Does anybody copy my User Story ?
Une “User Story”, ou “Récit Utilisateur” en français, peut se définir dans son explication la plus simple par une phrase décrivant la fonctionnalité d’un produit avec assez de précision pour être comprise par une personne ne maîtrisant pas forcément ni le métier, ni le produit, ni la technique.

Dans la pratique, la définition d’une User Story est un peu plus complexe que ça.

Tout d’abord elle est écrite par le Product Owner, et découle d’un besoin métier. Il l’ajoute à son product backlog, la relie à une thématique et / ou à une “EPIC” (une “big US” découpée en plusieurs US afin de pouvoir être réalisée sur plusieurs sprints).

Quand cette User Story est complète et prête à être embarquée (nous verrons dans le prochain chapitre de l’article ce qui détermine quand une US est prête), elle pourra être chiffrée, priorisée, et passera dans le “Sprint Backlog” afin d’être développée.

Cette US est accessible à tous et doit surtout être compréhensible par toutes les parties prenantes du projet : sponsor, référent métier, utilisateurs finaux, équipe développement (Scrum Master, Développeurs, UX/UI Designers, …).

Il est donc de coutume qu’elle soit courte, claire, non technique, et indépendante vis à vis des autres US du product backlog.





## 2. BDD, INVEST, DOR et DOD : a Wordsmanship ability
    
Être adroit pour écrire une User Story ne demande pas seulement du bon sens, mais aussi de suivre certains principes. Hawkeye n’est pas devenu “[the world’s greatest marksman](https://marvelcinematicuniverse.fandom.com/wiki/Hawkeye#Abilities)” sans avoir ses propres techniques bien à lui.

![]({{site.baseurl}}/assets/2019-05-29-la-valeur-metier-des-users-stories-le-hawkeye-des-avengers/hawkeye_img1.jpg)

 
 ### 1. Independent Negotiable Valuable Estimable Small Testable
 

L’acronyme [INVEST](https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/) a évidemment tout volé de la “Strategic Homeland Intervention Enforcement Logisitcs Decision”, dixit “[S.H.I.E.L.D](https://fr.wikipedia.org/wiki/SHIELD)”.
Mais c’est la base fondamentale de rédaction d’une User Story.

**Indépendant**, car une US doit pouvoir être embarquée au moment souhaité, dans l’ordre souhaité en fonction de sa priorité dans le sprint backlog, et sans être bloqué par le développement d’un autre membre de l’équipe.

**Négociable**, elle doit en effet représenter le coeur de la fonctionnalité à développer sans en dessiner tous les détails, qui eux doivent pouvoir s’adapter au besoin et se définir dans un second temps.

**Valeur**, pour l’utilisateur ou le client, une US ne peut de ce fait être uniquement technique. Introduire son US par “En tant que” permet de l’ancrer du point de vue du rôle souhaité.

**Estimable**, par les équipes de développement qui doivent être en mesure de la comprendre et d’en voir les limites pour pouvoir la chiffrer.

**Suffisamment petite**, chaque US doit être découpée suffisamment afin de pouvoir être embarquée, développée et livrée dans le même sprint.

**Testable**, par n’importe quel membre de l’équipe de développement, et de bout en bout. Ce qui implique que le product owner doit pouvoir se passer de l’équipe de développement pour pouvoir tester une US de son côté.


### 2. Behavior Driven Development


Comme expliqué précédemment, la base d’une US est de pouvoir être compréhensible par tout un chacun, technique, métier ou encore sponsor.

Cette technique du BDD qui a vu le jour en 2003, constitue en l’utilisation d’un langage naturel pour décrire l’objectif et le bénéfice en complément d’une user story. Ce qui permet à l’équipe, et notamment aux développeurs, de se concentrer sur les raisons du développement demandées plutôt que sur le code en lui-même, et d’apporter une réponse plus cohérente en terme de conception technique.

Par ailleurs, le BDD met au coeur de son principe l’utilisation d’exemples dans la rédaction des règles métiers et des tests d’acceptance, qui permet de se projeter dans une situation donnée avec un comportement attendu concret.

En sommes, cette façon de construire et d’écrire les US, critères et tests d’acceptance, règles métiers, et tout ce qui va pivoter autour, permet de faire converser toutes les équipes entre elles.


### 3. Definition of Ready & Definition of Done

Il ne s’agit pas tant d’éléments ou de pratiques rédactionnels accompagnant une User Story comme précédemment, mais plutôt des règles à définir en début de projet qui suivront la vie et le déroulement de chaque Sprint.

Une US doit valider un certain nombre de critères (DoR) pour pouvoir passer d’une étape à l’autre de sa vie, de la spécification, au développement jusqu’à son test et sa livraison (DoD). Ces critères sont adaptables et propres à chaque projet, mais on retrouve généralement les suivants.

Dans sa première étape de DoR pour la spécification, l’US doit pouvoir être réalisable, priorisée et estimée par l’équipe de développement.

Dans sa seconde étape de DoR pour le développement, les différents tests et critères d’acceptation sont rédigées.

Dans sa troisième étape de DoR pour le test, l’US est développée, le code review a été effectué, les tests unitaires s’il y en a sont concluants.  

Elle est considérée comme “Done” une fois tous les tests fonctionnels ont été validés, la démo effectuée et également validée, ainsi que potentiellement la documentation à jour.


## Business value : Why are you even here ?
 
Après avoir fait le point sur la méthodologie de conception de nos Users Stories, découpons le format rédactionnel pour y retrouver notre valeur métier.

La plupart des Product Owner que vous rencontrerez rédigent leurs users stories dans un format similaire à celui-ci : < en tant que >, < je veux / souhaite >, < afin de >. Et si ce n’est pas le cas, chaque partie ayant un objectif précis, le découpage suivant pourra tout de même s’appliquer :

-   Nous avons évoqué dans la partie précédente de l’article l’importance de définir le rôle de la personne concernée et que celle-ci ne pouvait pas être, par exemple, une machine.
    
-   Nous avons également évoqué la nécessité de la clarté de la demande pour sa compréhension par n’importe quel membre de l’équipe projet, métier, technique ou sponsor.
    
-   La partie < afin de > d’une US est tout aussi cruciale, et pourtant souvent mise de côté car considérée comme optionnel pour l’équipe de développement. Elle définit le “pourquoi” de l’existence de l’US et exprime de ce fait sa valeur pour l’utilisateur.
    
En dehors de son importance pour l’utilisateur et le produit évidemment, celle-ci est également précieuse pour le Product Owner.

Elle lui permet de prioriser par ordre d’importance les US à développer dans le product backlog de manière. Et ce de manière cohérente et compréhensible en gardant en tête l’objectif stratégique que doit remplir le produit, ou tout du moins la prochain release du produit.

C’est aussi un bon moyen de ne pas se perdre dans des users stories trop techniques, ou de faire l’erreur de séparer la partie développement front et back en faisant perdre leur valeur ajoutée aux fonctionnalités d’un point de vue produit.


## Risks : Willing to take your chances ?
    
Mais pourquoi s’embêter avec la valeur métier dans les quelques cas où cela ne semble pas forcément utile ? Quand par exemple une US semble trop courte ou tellement évidente que vous n’en voyez pas l’intérêt ? Ou au contraire quand elle englobe une fonctionnalité complexe ou tellement conséquente qu’il vous semble difficile de pouvoir définir sa valeur en une seule phrase ?

![]({{site.baseurl}}/assets/2019-05-29-la-valeur-metier-des-users-stories-le-hawkeye-des-avengers/ronin_hawkeye_img2.jpg)

C’est précisément quand vous aurez du mal à définir la valeur métier d’une user story que vous prendrez le plus de risques. Risque de passer à côté de l’intérêt que de la fonctionnalité pourrait avoir pour son utilisateur. Risque de ne pas remettre en cause cette fonctionnalité qui ne sera peut-être pas utile avant que vos équipes de développement ne soient passées par là.

Les premiers risques qui me viennent en tête, et pour n’en citer que quelques uns sont les suivants :

-   Vous faire perdre du temps, un voir plusieurs sprints à spécifier, concevoir et développer des fonctionnalités sans réel sens pour vos utilisateurs, votre client ou encore votre sponsor. Au point d’arriver en démonstration avec un produit qui pourrait créer de la confusion et du désaccord. Autrement dit, tout ce que vous ne souhaitez pas.
      
-   Partir dans un sens pour revenir en arrière post-développement. Potentiellement risquer de complexifier les choix techniques par manque de visibilité des objectifs des fonctionnalités souhaitées, et de devoir adapter le reste du développement à ces choix initiaux.
    
-   Livrer une release ou un produit final qui ne correspondra ni au besoin, ni à la demande, et ne sera au final pas utilisé.



## Keep a better line of business value
    
Malgré toute la bonne volonté, ce n’est pas toujours évident d’avoir une vision claire de la valeur apportée par certaine user story, et surtout de pouvoir la définir.

Il arrive aussi parfois que le client, n’impliquant pas l’utilisateur final du produit dans les prises de décision liées au produit, parte sur des à priori, des choix arbitraires, ou encore suivent les directives du sponsor qui n’est pas au coeur du métier.

Voici quelques idées qui pourraient vous permettre de mieux identifier les raisons pour lesquelles vous n’arrivez à définir le “pourquoi” de votre US ou encore de ne pas tomber dans des raccourcis.

-   Parfois quand une US est trop courte, la confusion peut très vite se faire entre le “quoi” et le “pourquoi”. Ou quand elle est tellement évidente, on ne prend même plus la peine de chercher le pourquoi de son existence. Si vous et votre équipe fonctionnez comme cela, et que vous êtes bloqué sur ce type de cas, vous pouvez toujours attribuer la valeur métier à l’EPIC plutôt qu’aux US.
    
-   A contrario, si vous avez du mal à cerner la valeur de votre US car elle semble partir dans tous les sens, c’est probablement car elle est trop conséquente ou trop complexe. N’hésitez donc pas à la redécouper ou même en faire une EPIC. Cela vous permettra dans le même temps de respecter la structure INVEST évoquée précédemment.  

-   La valeur d’une US peut aussi se définir inversement par le fait de ne pas la développer. Méthodologie beaucoup plus abordable et adaptée pour des sujets réglementaires, légaux ou encore liés à des contraintes techniques.
    
-   Certain Product Owner préfère opter pour un format imposant de commencer par la valeur métier de la story, afin de ne pas prendre de raccourci et de passer outre par facilité : < Afin de > pourquoi, < en tant que > qui, < veux / souhaite > quoi.

-   Enfin, n’hésitez pas à demander à vos utilisateurs d’expliquer leur besoin pour pouvoir leur apporter la meilleure réponse possible. Car il n’est autre que la valeur métier que vous insufflez à vos users stories. Si celles-ci sont creuses, votre produit le sera également.

![]({{site.baseurl}}/assets/2019-05-29-la-valeur-metier-des-users-stories-le-hawkeye-des-avengers/avengers_hawkeye_img3.png)

## Conclusion : Make sure your User Story is safe

Même s’il vous paraît peu utile de toujours spécifier la valeur ajoutée pour chaque user story et que cette étape est bien trop souvent négligée.
Même si à côté d'Iron Man, Captain America ou Thor, Hawkeye vous semble insignifiant. 

Elle est en fait essentielle dans la conception du product backlog par le Product Owner. Elle lui donne un sens et fait raisonner le produit.
Tout comme Hawkeye fait reprendre raison a nos super-héros préférés quand ils se sont perdus eux-mêmes dans [Age of Ultron](https://marvelcinematicuniverse.fandom.com/wiki/Hawkeye#Place_on_the_Avengers). 

Enfin, il est important de garder en tête que le retour sur investissement (ROI) n’est pas l’unique facteur de valeur dans un projet, et ne l’est même pas du tout d’un point de vue utilisateur final. Même s’il joue son rôle dans les choix de conception technique, ou plus globalement dans le choix des releases, le ROI n’est pas la valeur métier d’une user story.
