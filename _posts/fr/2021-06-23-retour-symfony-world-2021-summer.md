---
layout: post
title: Retours sur la conférence Symfony World 2021 Summer edition
excerpt: La semaine dernière se tenait la conférence Symfony World 2021 Summer edition et nous y avons assisté. Voici un récapitulatif de l'événement.
authors:
    - marianne
permalink: /fr/symfony-world-2021-summer-edition/
categories:
    - conference
    - symfony
tags:
    - Symfony
    - Conférence
    - Veille
cover: /assets/2021-06-23-symfony-world/logo.png
---

La semaine dernière se tenait la conférence Symfony World 2021 Summer edition et j'y ai assisté. Je vais partager avec vous dans cet article le Best of des conférences de l'événement selon moi.


## Le déroulement
La conférence avait lieu en ligne, sur la plateforme [Hopin](https://hopin.com/). C'est un super outil bien adapté au format de la conférence. On peut avoir plusieurs tracks en parallèle, des "booths" en live pour échanger avec des gens, un chat, une section Q&A, et même un chat roulette pour rencontrer de nouvelles personnes !

Chaque présentation passait deux fois dans la journée : une fois sur un créneau défini à l'heure française, et une seconde fois 7h plus tard pour permettre aux gens outre atlantique d'en profiter. Les conférences étaient pré-enregistrées par les speakers, mais ils étaient présents avant / pendant et après leur créneau pour répondre aux questions en live.

Vous pouvez retrouver le programme complet de l'événement [ici](https://symfony.com/blog/symfonyworld-online-2021-summer-edition-starts-today?utm_source=Symfony%20Blog%20Feed&utm_medium=feed).

Avant de parler des conférences qui ont particulièrement retenu notre attention, je voudrais noter que toutes les présentations étaient très intéressantes et que les sujets étaient variés.

## Le Top 3

### Le composant UID de Symfony

Nicolas Grekas, contributeur Symfony, nous a présenté le composant UID de framework.

Il a parlé en détails de ce qu'est un identifiant unique, des cas d'utilisation et de leur utilité d'un point de vue métier. Nicolas a décrit les types d'identifiants uniques et leurs différences (UUIDV4, UUIDV6, ULID, etc.).

Ensuite, il a présenté le composant Symfony, sa configuration et son utilisation. Nous avons vu que le composant met à notre disposition des commandes pour générer ou inspecter différents types d'identifiants, ainsi que des _Factory_ pour générer des identifiants via le code. Cerise sur le gâteau : il est possible d'avoir des champs de type Ulid (ou UUID en PostgreSQL) dans des entités Doctrine. Intéressant, non ?

Enfin, Nicolas décrit pourquoi ce composant a été créé. Je vous laisse découvrir cette partie lorsque le replay sera disponible.

J'ai apprécié ce talk car il s'agît d'un composant Symfony qu'on n'a pas souvent l'occasion de voir, il est bien présenté et très informatif.

### Can your code live without the Symfony Framework?

Hiromi Hishida, une développeuse japonaise avec plus de 10 ans d'expérience, a parlé de comment découpler au maximum le code métier d'une application de son intégration avec un framework, dans le but d'étendre la durée de vie de l'application et de ne pas se retrouver prisonnier d'une version donnée d'une dépendance ou de subir des montées de versions douloureuses.

Alors, comment étendre la durée de vie du code d'une application ? Hiromi nous dit qu'il faut le rendre "portatif". Pour faire cela, elle préconise d'ajouter des couches d'abstraction à nos dépendances en passant par des interfaces pour assurer une compatibilité avec plusieurs intégrations et pour simplifier les mises à jour. Ou encore, d'utiliser des services et des Design Patterns tels que le _UseCase_ pour implémenter notre logique métier.

Ce talk nous fait un bon rappel des bases, avec un exemple simple pour illustrer l'importance des _best practices_.

### Towards Digital Sustainability

François Zaninotto, ancien contributeur Symfony et Lead dev de plusieurs projets open source, a fait une présentation sur l'empreinte carbone du domaine numérique. Les activités numériques sont responsables de 4% des émissions de gaz à effet de serre dans le monde, presque autant que les avions. Mais comparé à d'autres activités humaines, ce n'est pas un chiffre énorme. Alors pourquoi faut-il s'inquiéter ? Tout simplement parce que la courbe illustrant les émissions de gaz à effet de serre liées au numérique croit de façon exponentielle, et nous n'en sommes qu'au début.

Mais alors, comment pouvons-nous réduire l'impact carbone de nos applications ? La première étape serait de mésurer l'empreinte actuelle, mais ce n'est pas si simple. Actuellement aucun outil ne nous permet d'avoir des résultats fiables. Ainsi, François et son équipe se sont penchés sur la question.

En utilisant _docker_ et _docker-compose_ on peut avoir un container _cypress_ qui ferait des tests end-to-end avec un navigateur headless, et on peut obtenir des métriques grâce à la commande `docker stats` (CPU, mémoire, etc.). On peut ensuite convertir ces métriques en Watt/heure, et en utilisant le site _Electricity Map_ on peut convertir les Watt/heure en émissions CO2.

En se basant sur ce modèle, François et son équipe ont publié l'outil [Greenframe.io](Greenframe.io), bientôt open source. Voici quelques chiffres intéressants qui ressortent après un an et demi d'évaluations d'applications web. L'écran du visiteur d'un site web consomme plus de 30% des ressources, ainsi, plus un utilisateur va passer de temps sur votre application, plus elle sera polluante. Le CPU et les appels réseau arrivent après l'écran. Le serveur quant à lui ne consomme que 5% des ressources.

Quelles sont les mesures à prendre face à ce constat ? Voici les conseils de François pour réduire l'empreinte carbone de nos applications.

Premièrement, il ne faut développer que les fonctionnalités réellement nécessaires au bon fonctionnement de l'application, et éviter tout ce qui pourrait engendrer une expérience additive chez nos clients (autoplay, gamification, etc.), afin de minimiser le temps qu'ils passeront sur nos applications.

Deuxièmement, nous savons que la production d'un ordinateur ou d'un téléphone mobile pollue bien plus que leur utilisation. Par conséquent, il faut adapter nos applications aux modèles plus anciens, pour ne pas pousser nos clients à acheter du matériel récent sans réel besoin. De la même façon, nous pouvons héberger nos applications sur des serveurs plus anciens que ce soir on premise ou dans le cloud.

Un autre moyen de réduire l'empreinte carbone de nos applications est d'utiliser moins de ressources : réduire le nombre d'appels réseau, comprimer les images, réduire la rétention de données et les tags tiers utilisés par exemple.

Enfin, nous pouvons choisir un hébergeur qui utilise de l'énergie renouvelable. The site [The green web foundation](https://www.thegreenwebfoundation.org/) peut nous aider à faire un choix en ce sens, même si certains herbergeurs manquent encore de transparence.

La présentation de François Zaninotto est très motivante et encourageante ! Armés de ces informations, nous savons quoi faire pour contribuer au changement.
