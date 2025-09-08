---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: presentation-projet
title: Présentation du projet
---

## Rappels Clean Architecture

Avant de présenter le projet, voici une liste de concepts dont vous pourrez vous servir comme d'un pense-bête tout au long de ce tutoriel.

- Domain: Le coeur de la logique métier, indépendant de tout framework, base de donnée et librairie externe. Il contient les objets et les règles métier, ainsi que des contrats d'interface.
- Infrastructure: La couche la plus externe, qui contient le framework, les librairies et toutes les implémentations techniques concrètes (base de donnée, service d'email, API externes, ...).
- Use Case: La couche qui orchestre l'application, en coordonnant le Domain et l'Infrastructure ensemble. Ici on cherche à accomplir des *process* métier, en se servant des règles métier du Domain, le tout facilité par l'Infrastructure.

Le Domain est le coeur de votre application, il contient tous les objets métier & les règles fonctionnelles. 

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
Vous trouverons un fichier <code>tests/requests.http</code> dans lequel des requêtes HTTP sont prêtes à l'emploi (attention à changer les ID quand nécessaire). 
Votre IDE devrait vous permettre de lancer ces requêtes directement depuis le fichier.
</div>

Vous trouverez également une Entité `Card` dont voici les propriétés:
- `$question`: La question associée à la Carte
- `$answer`: La réponse
- `$initialTestDate`: La date initiale à laquelle la question nous est soumise
- `$delay`: Le délai entre la `$initialTestDate` et la prochaine date de test (on incrémente cette valeur à chaque fois qu'on répond correctement à la question)
- `$active`: La Carte est-elle activée ou désactivée

C'est en jouant avec ces simples propriétés que notre Leitner Box est fonctionnelle.
On dispose d'un CRUD dans le Controller, ainsi que d'une méthode pour soumettre des réponses aux questions.
On dispose également d'une commande qui permet de nous envoyer un mail tous les jours avec les nouvelles cartes auxquelles répondre.

Je vous laisse explorer le repo pour plus de détails !
