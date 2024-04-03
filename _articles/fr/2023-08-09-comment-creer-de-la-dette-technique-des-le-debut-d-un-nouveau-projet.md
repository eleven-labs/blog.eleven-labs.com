---
contentType: article
lang: fr
date: '2023-08-09'
slug: comment-creer-de-la-dette-technique-des-le-debut-d-un-nouveau-projet
title: Comment créer de la dette technique dès le début d’un nouveau projet ?
excerpt: >-
  Quand on arrive sur un projet existant, on doit souvent subir une dette
  technique qui nous fait perdre du temps et qui nous rend fou au point de
  vérifier qui a fait le code. Vous aussi vous voulez entrer dans la postérité
  lors d’un git blame et mal concevoir votre produit ?
categories:
  - php
  - javascript
  - architecture
authors:
  - marianne
keywords:
  - bonnes pratiques
  - développement
---

![La dette technique, cet enfer]({BASE_URL}/imgs/articles/2023-08-09-comment-creer-de-la-dette-technique-des-le-debut-d-un-nouveau-projet/logo.png?width=1000)

Quand on arrive sur un projet existant, on doit souvent subir une dette technique qui nous fait perdre du temps et qui nous rend fou au point de vérifier qui a fait le code. Vous aussi vous voulez entrer dans la postérité lors d’un git blame et mal concevoir votre produit ?

Vous avez de la chance, j’ai pu voir quelques exemples qui vont me permettre de vous expliquer les meilleures techniques pour créer votre propre projet legacy 🥳

## Mais qu’est-ce que la dette technique ?

D’après [Wikipédia](https://fr.wikipedia.org/wiki/Dette_technique), il s’agit d’un concept de développement logiciel qui désigne la difficulté à faire évoluer ou à corriger un code source mal conçu initialement.


Inventé en 1992, le terme vient d'une métaphore qui applique au développement la notion de dettes que l’on peut trouver dans le milieu de la finance. On peut dire qu’une équipe de développement contracte une dette pour acquérir plus rapidement une fonction.

Il est possible de contracter une dette consciemment pour des problématiques de délais, mais elle peut être prise inconsciemment.

## Mal cadrer son architecture
![Quand ton architecture se casse la figure]({BASE_URL}/imgs/articles/2023-08-09-comment-creer-de-la-dette-technique-des-le-debut-d-un-nouveau-projet/falling-diagram.png?width=1000)


Prendre des mauvaises décisions dès le début en faisant des erreurs d’architecture peut être de vrais boulets pour la vie du projet.

Il faut bien comprendre le besoin et vos contraintes car chaque type d’architecture à ses avantages et ses inconvénients (oui le monolithe a des avantages, et vous pouvez voir les avantages du micro-services dans l’article “[D'un monolithe vers une architecture microservices]({BASE_URL}/fr/monolithe-a-microservices/)”). Partir sur une architecture micro-services alors qu’il n’y a pas les ressources suffisantes niveau infrastructure ou dans les équipes de développements, c’est le début de la souffrance sur le projet.


Vous n’avez pas forcément d’architecte dans vos équipes, mais avec l’expérience et l’entraide, vous pouvez prendre en compte tous les besoins et imaginer l’architecture qu’il vous faut. Si vous avez un architecte sous la main, n’hésitez pas à collaborer avec lui : vous allez pouvoir être sûr qu’il a toutes les informations nécessaires et vous, vous allez apprendre à son contact !

Pour être sûr de ne pas oublier des possibilités, essayez de faire plusieurs architectures différentes pour les comparer.



## Mal choisir ses technologies

Ensuite il y a le choix des technologies, langages et outils.

L’erreur principal dont les motivations sont diverses c’est de vouloir utiliser une technologie qu’on ne connaît pas.
Par tendance, pour apprendre une nouvelle technologie, pour essayer de répondre à un besoin, peu importe votre raison, vous mettez le pied dans l’inconnu. Inconnu de temps, de montée en compétence, de maintenance, de coût et si cela répond réellement au besoin.

Les bonnes questions à vous poser sont :
-   Est-ce que la technologie existe depuis longtemps ?
-   Est-ce que la communauté est assez grande ?
-   Ai-je assez de ressources et disponible dans l’équipe ?
-   Ai-je bien calculé le coût ?
-   Puis-je faire différemment ?

On veut souvent tester les dernières tendances, mais si vous n’avez pas au moins 3 “**Oui**” à la liste de questions, **revoyez votre copie**.

Même si le modèle est criticable, vous pouvez aussi vous baser sur le [cycle de la hype](https://fr.wikipedia.org/wiki/Cycle_du_hype) : il est plus raisonnable de prendre une technologie quand elle est à son plateau de productivité.

![Schéma du cycle de la hype]({BASE_URL}/imgs/articles/2023-08-09-comment-creer-de-la-dette-technique-des-le-debut-d-un-nouveau-projet/cycle-de-la-hype.png?width=500)

<br />
Finalement, vous choisissez une nouvelle technologie, vous pouvez encore limiter la casse. La question sur la disponibilité n’est pas anodine : il faut se former sur la technologie et ça prend du temps. Entre les livres et les cours en ligne, vous savez où chercher, et au pire, vous avez votre réseau pour poser des questions.

## Mal modéliser sa base de données
![Quand la base de données est mal modélisée]({BASE_URL}/imgs/articles/2023-08-09-comment-creer-de-la-dette-technique-des-le-debut-d-un-nouveau-projet/burning-database.png?width=1000)


Point critique qui peut être source de problème de performances sur des applications qui ont besoin d’être rapide à lire en écriture et/ou en lecture. S’il y a trop de latence, un client peut délaisser votre produit pour un concurrent.



Je vais m’attarder sur les bases de données orientées objets et celles orientées documents, et certains conseils sont valables pour les deux.



Le conseil principal est de prendre le temps de modéliser votre base de données. C’est une pratique qui se perd mais qui pourtant permet de prendre de la hauteur sur le besoin et de détecter de potentielles trous dans la raquette pour répondre au mieux aux attentes.



J’ai un petit faible pour modéliser en UML et j’utilise [PlantUML](https://plantuml.com/fr/) (qui possède un [plugin sur PhpStorm](https://plugins.jetbrains.com/plugin/7017-plantuml-integration)) pour modéliser facilement et comme c’est du scripting, on peut même le versionner dans git.

### Base de données orientée objets

Pour la base de données orientée objets, on a souvent l’habitude d’utiliser le [modèle relationnel](https://fr.wikipedia.org/wiki/Mod%C3%A8le_relationnel), et c’est ce que je vous recommande dans les cas les plus courants.

Mais il existe un modèle de données appelé [Entity–attribute–value model](https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model) qu’on oublie un peu trop souvent : il s’agit d’un grosso-modo de faire une table en plus de sa table entity contenant la liste de clé-valeur. J’ai eu l’occasion de l’utiliser dans un des cas où beaucoup de champs ne sont pas obligatoires pour éviter d’avoir une table entity beaucoup trop grosse. Elle comporte quelques faiblesses comme l’efficacité du requêtage (bref, ne faîte pas de recherche dessus), on ne peut pas être sûr que les clés soient toutes bien orthographiées, on ne peut pas typé la valeur etc…

Je vous en parle car cela peut totalement convenir à certains cas d’utilisation comme la construction de générateur à formulaires.

### Base de données orientée documents

Pour la base de données orientée documents, il faut aussi prendre le temps de la modélisation. Pour rappel, vous pouvez voir la définition d’une base de données documents avec MongoDB sur l’article [Symfony et MongoDB, retour aux bases]({BASE_URL}/fr/symfony-et-mongodb-retour-aux-sources/).

Quand on a connu le modèle relationnel, il faut changer sa pensée pour comprendre le document et son modèle. Je vous conseille cette vidéo qui permet de comprendre ce changement de modélisation : [Base de données : MongoDB - Conception par Algomius](https://www.youtube.com/watch?v=ZvPS5Gx0nnU).

Je pense que la plus grosse erreur que j’ai pu voir, c’est de tout mettre dans une même collection. Une collection un peu fourre-tout car la technologie le permet. Mais la gestion des indexes étant plus compliquée mais aussi plus importante dans ce type de base de données, cette modélisation coûtera très cher à maintenir dans le temps.

A contrario d'une base de données SQL et de ses jointures, une modélisation NoSQL se veut la plus proche de son utilisation/consommation, comme dans une approche API First par exemple : la donnée doit être modélisée comme elle sera consommée.

<br />

**Quoi qu’il arrive, n’oubliez pas votre besoin : performance lecture ou écriture, recherche, comment votre application va utiliser vos données…**


## Mal coder

Je vais un peu enfoncer des portes ouvertes, mais pour un minimum assurer une qualité de code, il faut connaître et appliquer quelques principes, et à minima [SOLID](https://fr.wikipedia.org/wiki/SOLID_(informatique)).

Les autres principes du _Clean Code_ comme **YAGNI** (_You Ain't Gonna Need It_), **DRY** (_Don’t Repeat Yourself_) ou **KISS** (_Keep It Simple, Stupid_) sont aussi conseillés pour avoir un code compréhensible, intuitif et facile à modifier.

Cela vous aidera aussi à éviter de faire de l’over-engineering : faire du code ayant inutilement compliqué ou élaboré alors qu’un code plus simple peut répondre au besoin.

Les commentaires sur des MRs pourront vous aider à vous améliorer, vous indiquer des fonctions ou des façons de faire pour être au plus proche des bonnes pratiques.


## Mal ou pas tester

On ne rappellera jamais assez les bienfaits des tests automatisés : on évite les bugs, on améliore la qualité logicielle, ça permet de faire gagner du temps même si pour cela, il faut en investir !

Il y a plusieurs articles sur le blog vous donnant les définitions de tests unitaires, fonctionnels, intégrations, end-to-ends avec différents outils pour revoir les bases :

-   [Tester son application avec Cypress]({BASE_URL}/fr/test-e2e-avec-cypress/)
-   [Behat : structurez vos tests fonctionnels]({BASE_URL}/fr/behat-structurez-vos-tests-fonctionnels/)
-   [Storybook - Tester la régression visuelle]({BASE_URL}/fr/storybook-visual-regression/)

Mais ça ne répond pas à la question : quelle est la différence entre un mauvais test et un bon test ?

Voici quelques questions à vous poser :
- *Est-ce que la fonctionnalité/code est critique ?* Si oui, **prenez le temps de le faire**
- *Quels sont les impacts si tout n’est pas testé ?* Si ça impacte le client ou le business, il est **plus prudent** de prendre le temps
- *Ai-je le temps de les faire ? / Que puis-je faire dans le temps imparti ?* Concentrez-vous sur **l’essentiel/le critique**, et si on vous demande de ne pas faire de test, prévenez bien les commanditaires des risques
- *Dois-je tout tester ?* **Non** car faire des tests unitaires sur des parties non critiques, ça ne sert à rien.

N’oubliez pas que les tests sont aussi là pour vous aider même si c’est barbant de les faire !

## Conclusion

Maintenant, vous avez quelques clés pour éviter de faire de la dette technique dès le début d’un projet ! Avec votre expérience, souvenez-vous de ce code imbitable qui vous a donné des cauchemars, et rappelez-vous de tout ça pour éviter de refaire les mêmes erreurs.

Car comme le disait Albert Einstein :
>La folie, c'est de faire toujours la même chose et de s'attendre à un résultat différent
