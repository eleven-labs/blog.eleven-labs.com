---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: presentation-projet
title: Présentation du projet
---

## La Boîte de Leitner

Durant ce tutoriel, nous allons prendre un projet existant, une application Symfony classique, et très simple, pour petit à petit la migrer vers une architure Clean.

Pour cela, j'ai décidé de développer une Boîte de Leitner. Il s'agit d'une stratégie de d'apprentissage et de révision qui est désignée par les scientifiques comme l'une des plus efficaces.

On image une boîte compartimentée avec des numéros. Chaque compartiment correspond à un jours, et chaque compartiment successif doit être de plus en plus espacé temporellement:
- Compartiment 1: Jour 1
- Compartiment 2: Jour 2
- Compartiment 3: Jour 5
- Compartiment 4: Jour 10
- ...

-- image -- 

Puis on écrit des cartes, aussi appelées *flash cards*, qui contiennent une question au recto, et la réponse au verso.

Le jour 1 je sors les cartes présentes dans le compartiment 1. J'essaie de répondre à la question de chaque carte.
- Bonne réponse ? Je déplace la carte dans le compartiment 2
- Mauvaise réponse ? Je replace la carte dans le premier compartiment.

Et on continue ainsi de suite avec le jour suivant. À chaque bonne réponse, je déplace la carte au compartement suivant. À la moindre mauvaise réponse, la carte retourne dans le tout premier compartiment, et on recommence.
Une carte dans le dernier compartiment à laquelle on répond correctement peut être mise de côté: On estime que la notion est assimilée.

Comme vous le devinez, ce système est assez simple à développer, et surtout à automatiser.
J'aimerais pouvoir créer des cartes de révision, et que celles-ci me soient soumises régulièrement (via l'envoi d'un e-mail par exemple), pour que je puisse tenter d'y répondre, et qu'elles soient automatiquement déplacées dans les compartiments correspondants.
Pas de panique vous n'avez pas à tout développer de votre côte, on va partir ensemble de cette modeste base que vous retrouverez sur ce [repo Github](https://github.com/ArthurJCQ/leitner-box).

Ce projet utilise une base de donnéee PostgreSQL (dans un container Docker), PHP 8.4 et Symfony 7.3.
Avec Docker Compose et le [Symfony CLI](https://symfony.com/download), vous devriez être en mesure de lancer le projet.
Dans le doute, n'hésitez pas à lancer un `symfony check:requirements` pour vous assurer que tout est bon.

Pour le reste, le README du projet devrait vous accompagner pour le setup (n'oubliez pas de lancer les migrations Doctrine).
Prenez le temps de découvrir et de vous familiariser avec l'application.

<div class="admonition important" markdown="1"><p class="admonition-important">Important</p>
Pour le moment vous pouvez découvrir l'application via une interface simpliste développée en twig, pour mieux comprendre son fonctionnement. Mais lors du passage en Clean Archi, nous ferons la bascule vers une API ne retournant que du JSON, pour rester simple, sans superflu, et se focaliser sur l'essentiel.
</div>

## Identifier le Domain

Comme vous pouvez le constater, notre architecture est celle par défaut proposée par Symfony lorsqu'on crée un nouveau projet: tous les dossiers dans le `src/` et dans un namespace `App`.
Et c'est très bien comme ça, surtout pour un projet de cette taille.
Mais comme tout projet, il peut être amené à grossir, et là, on regrettera peut-être de ne pas s'être imposé à l'avance des contraintes d'architecture.

Il est donc l'heure de prendre le problème à la racine et d'identifier le coeur de métier de notre application.

Pour cela, on veut identifier 2 concepts:
- Les objets métiers, et leur *comportement*
- Les règles métier


