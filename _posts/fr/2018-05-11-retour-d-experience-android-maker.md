---
lang: fr
date: '2018-05-11'
slug: retour-d-experience-android-maker
title: Retour d'Expérience Android Maker 2018
excerpt: >-
  Cette année a eu lieu la deuxième édition de l'Android Maker. Avec
  l'astronaute Omar, nous vous proposons un petit retour sur ce qu'on y a vu !
cover: /img/covers/StockSnap_1S8SVUVUNU.jpg
authors:
  - babas
categories: []
keywords:
  - android
  - kotlin
  - android maker
---

Du 23 au 24 Avril 2018 s'est déroulée la deuxième édition de l'Android Maker à Montrouge.
Voici un petit résumé de ce que l'on a pu y observer et en retenir. Cet article a été co-écrit avec l'astronaute Omar.

### 23 Avril

## LiveData

Pendant cette conférence, Florina Muntenescu nous a présenté plus en détails les LiveData, nouveau gestionnaire de données.
On y a vu plus en détails son implémentation lors de cas concrets, divers objets flous de la librairie on été mis en avant, comme le swicthmap.

Nous en avons retenu que LiveData peut coexister avec RXJava, et ne doit pas uniquement être perçu comme une alternative.
Cela s'est terminé par une explication du rôle du ViewModel dans l'architecture Component, qui selon moi est très très similaire à son confrère du pattern MVVM, malgré les explications fournies expliquant leurs différences, à éclaircir ! ^^

## SDK (presque) parfait

Ce retour d'expérience de Djavan Bertrand, développeur Android chez Parrot sur la création d'un SDK fut l'occasion de partager plusieurs tips.

Notamment de bien définir le profil de ses utilisateurs, et le réel but final du SDK pour mieux en définir la forme dans laquelle il va être mis à disposition et comment on va concevoir son utilisation.

Au final un talk très intéressant, comprenant pas mal de tips. Je vous en ai sélectionné plusieurs. Les voici pêle-mêle :
  - Rendre cohérente l'utilisation au détriment de la justesse technique, ici un exemple simple pour avancer, un robot Parrot doit avoir une vitesse sur ses roues mises en négatives ! Pas très user friendly et, pour les non initiés, pas très logique d'avancer avec du négatif. Du coup ils ont choisi d'inverser en toute transparence la valeur et de rendre public une méthode avec une vitesse positive.
  - Si cross platform, ne pas hésiter à rendre le sdk différent en fonction des plateformes pour rester fidèle aux pratiques, notamment dans le naming de ses méthodes, cas des callbacks par exemple.
  - Point d'honneur sur le Testing/Commentaires, la mise en place d'une documentation et la mise à disposition de sample concret !
  - Toujours avoir en tête le coût et le poids ! Votre sdk doit pouvoir être utilisé en toute transparence sur les traitements de l'application.
  - Laisser la possibilité au développeur de personnaliser certaines parties de sa librairie/son sdk (ex du Pattern Builder où l'on peut modifier le builder pour le custom à sa guise)

## Kotlin coroutines

Une présentation sous les couleurs du mème de chat toujours très efficace !
Ici Erik Hellman nous présentait une alternative pour pouvoir travailler en asynchrone aux Asynctask et autres outils actuels.
Je dois dire que cette présentation m'a plutôt convaincu ^^

On y voit en effet la simplicité et la meilleure visibilité qu'offrent les coroutines quand elles sont mises en pratique avec Kotlin !
Les coroutines peuvent être cancel, elles peuvent lancer elles-mêmes d'autres coroutines (inception de coroutine). On peut préciser le thread dans lequel elle va s'exécuter, on peut définir si l'on veut avoir un retour ou non via l'utilisation des mots-clés launch (sans retour) ou async (présence d'un retour).

Très important aussi, la présence dans la librairie d'un Listener, le CoroutineLifeCycleListener, qui permet à votre objet coroutine de coller parfaitement au cycle de vie de vos vues, et d'adapter son comportement en fonction.

Il a aussi mis en avant son utilisation liée avec l'objet Continuation, objet permettant de recevoir les retours d'erreur et de les gérer comme bon vous semble.

Au final une solution efficace, assez complexe à première vue. Il faut se faire la main avec les lambdas mais le résultat à l'air d'en valoir le coup !

## Gérer vos tests UI

Un bon retour d'expérience de la part de l'équipe Android de chez LeBonCoin, qui nous présentait le chemin parcouru lors de l'élaboration d'un système de test d'UI automatisé.

C'était aussi l'occasion de nous partager quelques outils plutôt appréciables :
 - Gerrit, pour la relecture de code
 - Swarmer, pour la génération d'émulateur
 - Spoon, pour lancer l'exécution de tests
 - Composer, autre outil pour lancer l'exécution des tests mais fournissant un rapport plus facile à lire
 - Barrista, surcouche Espresso pour faciliter l'écriture de tests UI
 - Android test orchestrator, qui exécute les tests
(à titre informatif parmi ces outils, Swarmer et Composer étaient les solutions retenues par leurs équipes)

Petit bémol de la présentation, et plus généralement de la solution, elle n'est viable que pour une stack Android, ce qui est dommage surtout lorsque comme LeBonCoin, on possède un écosystème comprenant les deux environnements iOS/Android.

## Gitlab dans vos process

Petite présentation de Marc Daniel, développeur chez Nokia qui nous a détaillé le panel d'outils qu'offre Gitlab :
 - Gitlab, pour le versioning
 - Gitlab CI, pour les tests automatisés
 - Gitlab Store, pour la mise à disposition des apks
 - Gitlab CD, pour automatiser cette mise à disposition
 - Gitlab CE, pour programmer ou lancer des builds releases
 - Création d'outils, notamment un changelog, à partir de l'API gitlab

Il nous a prouvé que l'on pouvait gérer son produit de A à Z en utilisant à 90% les solutions mises à disposition par Gitlab.

## Build Layout sans galérer !

Ici l'équipe de google à essayer de nous convaincre que le builder de layout avait changé et qu'il était désormais plus user friendly !
Pari plus ou moins réussi avec l'ajout de nombreuses features sexy basées sur le constraintlayout, permettant de grandement simplifier la création de layout à partir de simple drag & drop !

La création d'un constructeur de chaîne permettant en un simple clic sur élément de les aligner à la manière d'un LinearLayout en est un bon exemple.

À noter que tout les changements sont effectifs à partir d'Android Studio 3.0. Avant ça, continuez de tout faire à la dur dans le code !

## ConstraintLayout 2.0

John Hoford et Nicolas Roard, dreamteam du ConstraintLayout, sont revenus sur toutes les nouveautés et réflexions qui ont été portées sur le ConstraintLayout.

Ils ont parlé Barriers, élément invisible que l'on peut fixer comme référence entre éléments de design notamment lorsque que l'on veut aligner un élément à partir de plusieurs champs texte à longueurs variables. On a vu l'apparition aussi de nouveau concepts comme les Helpers qui permettent de refactor du code d'animation, la notion aussi de State XML, donc d'état permettant de gérer des reactions de design, des animations sans avoir à le faire programmatiquement !

Les States XML permettent aussi en cas de changement de taille d'écran de faire des changements réactifs de design, ou même de layout, un peu comme du responsive design !

Enfin ils ont parlé de la mise à disposition d'une réelle API, Fluent Api, permettant de centraliser et de trouver une documentation sur tout ces éléments de design liés au ConstraintLayout.

### 24 Avril :

## Le rendering sur Android

L'équipe de choc composée de Chet Haase et Romain Guy revient pour nous parler d'un sujet bien plus intéressant que celui de l'année dernière (Business of technology) : le rendering sur Android.

Ils nous expliquent comment le SDK structure et essaye d'optimiser les instructions de rendering via OpenGL afin d'avoir un affichage le plus rapide possible. On peut noter 2 gros changements qui sont arrivés au fur et à mesure.

En effet le premier consiste en l'introduction du RenderThread, introduit depuis Android Lollipop, qui est un thread parallèle à l'UI Thread et qui effectue les calculs, optimisations entre autres pour alléger l'UI Thread.

Le second est la réorganisation des instructions de rendering par forme. Un exemple s'impose. Prenons un affichage d'une liste avec une icône et un texte. Avant les instructions étaient renvoyées comme suit : afficher l'icône, dessiner un rectangle, écrire le texte etc... le tout en boucle. Maintenant les instructions similaires sont envoyées en même temps évitant ainsi de changer tout le temps ce qu'il faut dessiner. On aurait donc pour l'exemple comme instruction : dessine un rectangle x10, affiche une icône x10 et écris ce texte x10.

## Room et Paging

Cette année, Google a beaucoup mis en avant les Architecture Components. Cette conférence revenait sur une partie de cette librairie, à savoir Room et Paging, qui permettent de manipuler des données récupérées soit via base de donnée (Room), soit via une API web, et de les charger lorsqu'il y en a besoin (Paging).

L'exemple donné, très classique, est l'affichage d'une liste d'éléments à partir d'une source de données. Cette source de données, appelée DataSource, définit la manière dont on souhaite accéder à la donnée, par exemple pour afficher ces données dans une liste paginée, on utilisera PageKeyedDataSource. Ensuite cette DataSource va notifier notre LiveData lorsqu'un ou plusieurs éléments ont été modifiés afin de mettre à jour notre PagedList, qui est tout simplement notre liste à afficher, mais qui se base sur notre LiveData et non une donnée qu'on met à jour manuellement.

Les deux sont très complémentaires et permettent de concevoir nos données et leur exploitation de façon plus dynamique.
À noter que ça fonctionne aussi avec RxJava2.

## Sous le capot de Dagger Android

Conférence prévue en français à la base, mais qui a été faite en anglais finalement, celle-ci nous présentait un peu les dessous de Dagger jusqu'à l'inspection de son code source.

Au final on est sur du classique avec Dagger, énormément de possibilités, parfois trop. Dagger n'en finit pas d'évoluer avec ses versions 2.10 et 2.11 introduisant un nouveau module spécifiquement pour Android.

Personnellement je m'y perds un peu, donc je ne pourrais pas rentrer plus en détails sur cette conférence.

## De la domotique faite-maison

L'une des meilleures conférences de ces Android Makers. On nous explique comment se passer des boîtiers domotiques bridés (coucou Philips Hue Bridge) qui ne gèrent que ses ampoules, pour faire notre propre maison connectée avec Android Things.

Une ampoule bluetooth à moins de 10€, un Raspberry Pi à moins de 30€, une carte SD pour y installer Android Things et Cloud Functions.
Le principe étant que notre assistant (Google Home ou autre) se synchronise tout d'abord avec notre Raspberry, lorsqu'il reçoit une commande utilisateur, via une Google Cloud Function afin d'avoir un état des lieux de tous les objets connectés de notre domicile. Ensuite il envoie la commande de l'utilisateur, puis notre fonction va donner l'instruction à notre Raspberry, qui va enfin pouvoir commander notre ampoule ou autre objet connecté. Une fois que tout s'est bien passé, on renvoie un message à l'assistant pour lui notifier que tout s'est bien passé.

Contrairement à des solutions toutes prêtes mais qui ne fonctionnent qu'avec un certain type d'objet, on se retrouve ici avec une infinité de possibilités à connecter, et le tout avec Android.

## En bref

Cette deuxième édition de l'Android Maker est plutôt une réussite, avec un bon mix entre talks techniques et retours d'expériences.
Vivement la troisième édition !
