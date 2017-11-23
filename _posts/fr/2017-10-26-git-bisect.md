---
layout: post
title: Débugger avec Git
permalink: /fr/debugging-with-git/
excerpt: "Aujourd'hui je souhaite vous présenter un outil vous permettant d'isoler rapidement notre commit frauduleux qui a occasionné un bug dans notre application : git bisect"
lang: fr
authors:
    - rpierlot
categories:
    - git
tags:
    - amp
    - git
    - php
cover: /assets/2017-10-26-debugging-with-git/branching-illustration.png
---

Des risques de régressions existent lors de la mise en production de nouvelles fonctionnalités. Notamment sur les grosses applications ayant beaucoup de code non testé.
En effet, nous ne sommes jamais à l'abri d'un effet de bord, ou d'impacts qui demandent une investigation immédiate. 

Dans un projet utilisant Git comme outil de management de code source, il apparaît capital de pouvoir trouver la source du problème rapidement. 
Si un nombre important de personnes sont impliquées dans le développement d'une application, chaque mise en production est accompagnée de multiples commits.
Or, si la source du problème est dissimulée au milieu d'un ensemble de commits, il est compliqué d'aller vérifier sur chaque commit l'origine du problème. 

Git est un outil plus que populaire dans le développement d'applications, et vient avec tout un tas de commandes qui nous empêchent de regretter ce bon vieux SVN.
Aujourd'hui je souhaite vous partager un outil vous permettant d'isoler rapidement notre commit frauduleux qui a occasionné un bug dans notre application : `git bisect`

Pour simplifier l'explication de `git bisect`, je vais utiliser un historique de quelques commits que voici :

```
* bad5bfe - fixed security issue (1 hour ago) <Wilson Bouncer>
* a73d98b - implemented feature to get recipe in space kitchen (8 hours ago) <Wilson Cook>
* 9bd6395 - updated metrics computation on space launcher (13 hours ago) <Wilson Analyst>
* 99f3fa1 - worked on real-time suggestion when encounting problems in space (1 day ago) <Wilson Scientist>
* 4021b7f - deleted ab test feature and cleaned up code (1 day ago) <Wilson Cleaner>
* 0d7c223 - computed the ideal playlist based upon astronauts tastes (2 days ago) <Wilson DJ>
* 29d90f9 - updated README.md (2 days ago) <Wilson Documentation>
```
Imaginons que ces commits aient été déployés en production. Au bout de quelques jours, quelqu'un s'aperçoit que quelque chose cloche. Une des fonctionnalités ne marche plus comme convenu.
Le problème est donc immédiatement remonté aux développeurs et ces derniers doivent isoler la cause de ce non fonctionnement. Leur seul indice est le suivant : tout marchait bien lors de la dernière mise en production.
 
Git nous épargne l'ennui de tester tous nos commits un par un avec `git bisect`. Cette commande effectue une recherche par [dichotomie (recherche binaire)](https://fr.wikipedia.org/wiki/Recherche_dichotomique){:rel="nofollow noreferrer"}.

![](/assets/2017-10-26-debugging-with-git/binary_search.jpg)
*Binary search illustration*

À chaque étape de la recherche binaire, nous devons dire à `git bisect` si le problème persiste toujours. 
En fonction de notre réponse, `bisect` va chercher en amont ou en aval pour isoler le problème. 

Il existe deux commandes principales pour `git bisect` :
* `git bisect good`: cela permet de spécifier que le commit sur lequel `bisect` s'est arrêté ne contient pas le bug
* `git bisect bad`: cela permet de spécifier que le commit en question présente toujours le bug. 

## Débuggons !

Pour commencer à débugger, il nous faut démarrer le script, et lui indiquer l'intervalle sur lequel nous souhaitons utiliser `bisect`.

```
git bisect start
git bisect good 29d90f9
git bisect bad bad5bfe
```
Une fois cette étape faite, nous pouvons apercevoir que `bisect` nous a positionné sur un commit au milieu de notre intervalle.
```
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[99f3fa1b86489dd9d6f30368d5b5321e04a955df] worked on real-time suggestion when encounting problems in space
```
Nous pouvons donc vérifier si le problème est toujours là. Malheureusement oui, nous sommes tombés sur un morceau ! 
Continuons alors notre "bisection". 
```
git bisect bad
```
Nous sommes maintenant positionnés au milieu de notre intervalle précédent (recherche dichotomique)
```
Bisecting: 0 revisions left to test after this (roughly 1 step)
[4021b7f911b84daa6ea5ccad51d3171fc0e46b67] deleted ab test feature and cleaned up code
```
On nous indique également le nombre d'étapes quant à la recherche du commit problématique : `roughly 1 step`. 
Notre problème persiste : 
```
git bisect bad
```
Nous approchons, nous approchons ! 
```
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[0d7c223dcfee62e1750e21385e7fa35b030bc8a7] computed the ideal playlist based upon astronauts taste
```
Positionné sur ce commit, notre problème n'est plus là ! Hourra ! Indiquons le à `git bisect` :
```
git bisect good
```
`git bisect` est arrivé à la fin de sa recherche, il a trouvé le coupable : 
```
4021b7f911b84daa6ea5ccad51d3171fc0e46b67 is the first bad commit
commit 4021b7f911b84daa6ea5ccad51d3171fc0e46b67
Author: Wilson Cleaner <wilson.cleaner@eleven-labs.com>
Date:   Tue Oct 17 16:56:06 2017 +0200

    deleted ab test feature and cleaned up code

:100644 100644 66f0d114adeee6d2141aa6fe64a5cc431ebce65e a0fe62c949a75957245ec1c04728fea047488697 M	README.md
```

Pour réinitialiser, rien de plus simple : 

```
git bisect reset
```
Nous sommes maintenant au point de départ, mais nous avons trouvé le méchant commit qui a tourmenté toute l'équipe, et cela dans un temps plutôt rapide.

## Bonus

La commande `bisect` vous permet d'automatiser le process de recherche d'un mauvais commit. 
En effet, si vous avez le luxe d'ajouter un test permettant de mettre en évidence le bug, vous pouvez lancer git bisect comme cela : 
```
git bisect run vendor/bin/phpunit --filter ThatWontHappenAgainISwearTest
```
Le test sera lancé à chaque étape vue précédemment, et vous aurez de manière automatique le hash du commit que vous cherchez.

## Conclusion

L'utilisation de `git bisect` permet de débugger rapidement, en isolant un commit erroné de manière dichotomique. 
Il suffit d'indiquer `git bisect good` ou `git bisect bad` pour que `bisect` navigue à travers l'historique.

