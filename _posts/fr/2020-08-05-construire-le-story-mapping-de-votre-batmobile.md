---
layout: post
title: "Construire le Story Mapping de votre Batmobile"
lang: fr
permalink: /fr/construire-le-story-mapping-de-votre-batmobile/
excerpt: "A n'en pas douter, pour construire aussi bien sa Batmobile et toutes les fonctions qui vont avec, Bruce Wayne s'est servi du Story Mapping ! Pourquoi ne pas nous y mettre également en apprenant étape par étape comment le construire ?"
authors:
    - mae
categories:
    - agile
tags:
    - agile
    - story map
    - atelier

---


A n'en pas douter, pour construire aussi bien sa Batmobile et toutes les fonctions qui vont avec, Bruce Wayne s'est servi du Story Mapping ! 

Aussi appelé User Story Map, il s'agit d'un atelier qui se met en place initialement au cœur des projets agiles. Mais qui a aussi son utilité dans n’importe quel type de projet ou organisation, et même hors projets informatiques.

Il permet de définir la vision d’un nouveau produit à son lancement ou encore des nouveaux besoins utilisateurs macros de votre produit, à travers une représentation du backlog en 2 dimensions créée collectivement par tous les parties prenantes à l’atelier.
  
**Ces parties prenantes, qui sont-ils ?**
Il peut s’agir de tous les membres opérationnels de votre équipe : product owner, product manager, développeur, UX Designer, mais aussi utilisateur, sponsor ou encore client.

Il est recommandé d’avoir une palette représentative des personnes participants à la construction de votre produit.

**Et cette représentation du backlog, qu’apporte-elle de plus que le backlog lui-même ?**
Cette représentation en deux dimensions permet de prendre de la hauteur sur votre produit et de poser sur un axe horizontal la représentation chronologique des étapes d’un parcours utilisateur donné. Puis sur un axe vertical les différentes actions à effectuer lors de ce parcours par l’utilisateur (fonctionnalités), afin de pouvoir les prioriser en fonction de leur caractère essentiel pour votre produit.
 
En dehors du fait d’être très visuelle et de pouvoir parler à n’importe quel membre de l’organisation, elle vous permet également de pouvoir scinder vos différents parcours utilisateurs si nécessaire. Et donc de vous y retrouver beaucoup plus clairement dans la distinction des actions par parcours (et potentiellement, par type d’utilisateur).

## Étape 0 - Ne pas oublier les roues : pré-requis et structure globale

Pour construire votre Story Map, vous allez avoir besoin de post-its, d’un mur avec idéalement des bandes collantes pour délimiter vos axes et vos différents niveaux de priorités. Ou d’un tableau blanc avec des feutres pour faire de même.

Vous pouvez tout aussi bien vous servir d’outils en ligne tel que [draft.io](https://draft.io/) (gratuit) ou [Product Craft](https://product.craft.io/story-map-lp.). Je vais me servir du premier pour illustrer mes propos.

La structure globale d’une Story Map se fait donc sur 2 axes.
Vous avez d’abord l’axe horizontal qui représente le temps. Autrement dit, le déroulé des actions de ou des utilisateurs dont vous écrivez la Story Map, issues de votre User Journey (nous y viendrons à l’étape 2).

Vous avez ensuite l’axe vertical, représentant l’ordre de priorité des différents éléments que vous allez rajouter dans votre Story Mapping.


## Etape 1 - Bruce, milliardaire et super héros : créer vos "Personae"

Dans un tout premier temps, nous allons définir les composants qui vont nous permettre de construire une Story Map solide.

Vous devez de ce fait tout d'abord définir un ou plusieurs personae : quels sont ou seront les utilisateurs de votre produit ou de votre nouvelle feature ? Comment les catégoriser ?

Le mieux, quand il s’agit de projets agiles, est de regrouper vos utilisateurs par type de parcours d’utilisation. Cela vous permettra d’avoir pour chaque persona un seul besoin lié à votre produit identifiable et clair.

Une fois cela fait, vous allez pouvoir compléter la fiche de votre persona avec quelques informations la définissant :

-   une représentation visuelle
-   les caractéristiques de votre persona tels que son âge, son sexe, son emploi, ou encore son statut social si cela est pertinent
-   son besoin ou son comportement, ce qu’il cherche à atteindre au travers de son parcours sur notre produit  
-   comment le produit peut répondre à ce besoin
    

Pour en savoir plus sur la définition des personae, je vous invite à vous rendre sur le blog de [MyAgilePartner](https://blog.myagilepartner.fr/index.php/2017/07/24/bien-ecrire-son-persona-dans-un-projet-agile/).  
  

  

## Etape 2 - Sauver Gotham City : écrire son User Journey 

Après avoir défini les personae de votre produit ou de votre feature, nous allons maintenant écrire leur “User Journey”. Cela va en effet nous aider à poser les premières bases de notre Story Map.


Qu’est ce qu’une User Journey ? C’est en fait le parcours d’un utilisateur, retraçant chaque action, à partir du moment où il va arriver sur votre produit jusqu’au moment où il aura atteint son besoin ou son objectif défini dans sa fiche de persona.

Vous allez donc choisir le persona sur lequel vous souhaitez travailler et réaliser sa User Journey.

Pour prendre moi-même un exemple et pouvoir vous illustrer la suite de l’atelier, je souhaite monter un site de streaming de contenu culinaire. J’ai défini 2 personae : le streamer qui vient partager son expertise sur la plateforme de streaming, et le passionné culinaire qui vient consommer ces streams pour en apprendre plus et débattre.

  

Je vais construire l’User Journey de mon second persona, à savoir le passionné culinaire. Il va pouvoir :

-   arriver sur la homepage
-   naviguer sur la homepage
-   naviguer entre les différentes sections représentant plusieurs cuisines du monde
-   cliquer sur un des stream en direct de la rubrique méditerranéenne
-   s’inscrire ou se connecter pour accéder au stream
-   accéder à la vidéo
-   commenter en live sur un fil de discussion
-   s’abonner au streamer
-   faire une donation
-   choisir le montant de sa donation
-   confirmer le paiement
-   se déconnecter
    
Maintenant qu’elle est construite dans les grandes lignes (vous n’avez pas besoin d’être le plus exhaustif possible ici, vous le serez par la suite), nous allons voir dans l’étape suivante comment les regrouper par thème pour poser les premières bases de votre Story Map !

## Etape 3 - Mille et une features de la Batmobile : alimenter sa Story Map

En repartant de votre User Journey, vous allez pouvoir réunir les différentes actions de votre persona en “thème”. Ces thèmes ne sont d’ailleurs autres que les [EPICS](https://www.atlassian.com/fr/agile/project-management/epics) de votre produit. Vous en saurez plus ici sur le terme s’il ne vous est pas familier, mais il s’agit globalement de User Stories très macro.

  
Dans mon exemple précédent, je peux typiquement définir les EPICS suivantes :

-   “Navigation” qui englobe l’arrivée sur la homepage, la navigation de la homepage et dans les rubriques du site ainsi que le clique sur une vidéo (stream) depuis une liste disponible dans une thématique “Navigation”
-   “Authentification” avec l’inscription ou connexion pour accéder au contenu vidéo du streamer
-   “Lecteur vidéo” avec l’accès à la vidéo et suivre en direct le streamer.
-   “Profil” qui va permettre de se relier à d’autres streamer en suivant leurs activités
-   “Communautaire” avec la possibilité de discuter en direct avec le streamer et les autres internautes
-   “Paiement” avec évidemment le don, le paiement et la confirmation du paiement
    
Ces EPICS sont à écrire sur des post-its et à placer sur votre axe horizontal, celui de la “timeline”, qui représente le déroulé des actions de votre utilisateur dans le temps.

Image

Pour le moment, celui-ci est très large en terme de scope, et c’est normal. Le but étant maintenant, sous chaque EPIC, de rentrer un peu plus dans le détail.

Nous allons donc rajouter de nouveaux post-it : les “Features”. Qui représentent les fonctionnalités macro à développer dans chaque EPIC.

Image

Puis, sous ces features, nous allons maintenant pouvoir rajouter toutes les tâches - qui seront directement vos user stories - que cet utilisateur va pouvoir y faire !

Image 

Vous vous demandez surement pourquoi mes post-its “User Stories” sont répartis et séparés par des traits ? Nous y arrivons tout de suite dans la dernière étape !

## Etape 4 - Sauver Rachel ou suivre Joker : prioriser sa Story Map

Maintenant que nous avons nos thèmes, EPICS et premières user stories réparties sur notre tableau, nous allons pouvoir les prioriser !

Il est important que vous définissiez en premier votre MVP (Most Valuable Product), afin de déterminer quels sont les features essentielles à son fonctionnement, celles dont vous ne pourrez certainement pas vous passer. Et de ce fait, de mettre en plus basse priorité les features de “confort”, qui peuvent être un vrai plus mais qui n'empêchent pas votre produit de fonctionner.

Vous pouvez vous servir du [dot voting](https://blog.myagilepartner.fr/index.php/2019/05/08/concept-du-dot-voting/) pour déterminer tous ensemble, parties prenantes du produit, les US (et donc fonctionnalités) qui seront prioritaires vis à vis des autres.


Vous arriverez donc à la suite de cette répartition à cela : image

De cette manière, vous allez pouvoir laisser en place vos EPICS et Features comme ils le sont, puis regrouper tous vos user stories qui font parties de votre MVP. Tracer ensuite un trait sous ce premier regroupement. Félicitations, vous avez là la constitution de votre premier release !

Faites ensuite le même travaille pour définir les éléments qui sont selon vous importants mais non essentiels pour définir une priorité 2. Et enfin les éléments qui ne sont que du confort et qui vont constituer une potentielle priorité 3.

Voici la représentation globale de mon Story Mapping, auquel vous avez également accès ici :

  

## Keep the Story Map Alive
La Story Map n’a pas pour unique but de vous aider à lancer les développements de votre produit ou de votre nouvelle feature. N’hésitez pas à la garder vivante, à la mettre à jour, à rajouter ou enlever des éléments en fonction des directions que peuvent prendre les développements de votre produit.

Car c’est en effet un excellent outil de suivi tout au long de vos développements qui va vous aider à avoir une représentation très visuelle de votre produit et à le recentrer sur l’essentiel quand vous en aurez besoin !


