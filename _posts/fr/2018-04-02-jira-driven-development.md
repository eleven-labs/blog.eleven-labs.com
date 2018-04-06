---
layout: post
title: Jira Driven Development
excerpt: "Dès lors que l'on commence à développer dans une équipe de quelques personnes en pratiquant les code reviews, de nombreux problèmes peuvent apparaître.
L'exemple le plus fragrant est qu'il se produise des échanges interminables entre le ou les développeurs et les code reviewer.
Voyons quels types de problèmes peuvent apparaître, et surtout, comment nous avons résolu ces problèmes chez Brouette-Labs grâce au Jira Driven Development."
authors:
- alexception
permalink: /fr/jira-driven-development/
categories:
    - développement
    - méthodologie
    - bonnes pratique
    - convention
tags:
    - développement
    - méthodologie
    - bonnes pratique
    - convention
cover: /assets/2018-04-02-jira-driven-development/cover.jpg
---

Dès lors que l'on commence à développer dans une équipe de quelques personnes en pratiquant les code reviews, de nombreux problèmes peuvent apparaître.
L'exemple le plus fragrant est qu'il se produise des échanges interminables entre le ou les développeurs et les code reviewer.
Voyons quels types de problèmes peuvent apparaître, et surtout, comment nous avons résolu ces problèmes chez Brouette-Labs grâce au Jira Driven Development.

## Les problèmes

Nous avons identifié deux problèmes majeurs dans notre cycle de code review, qu'on vous propose de retrouver ci-dessous.

### Conventions de nommage

C'est le problème majeur de tous développeurs. C'est le problème majeur de toutes les codes review. On le connaît tous.
Nommer ses fonctions, ses méthodes, ses classes et ses variables peut parfois être un vrai casse-tête, dès lors que le métier est compliqué.
D'autant que tous les développeurs n'ont pas les même habitudes créant ainsi des tensions au sein des équipes lors des code reviews.

Gilles [Le prénom a été changé, NDLR], a accepté de témoigner sous couvert d'anonymat de son expérience :

> Brouette-Labs : Quelle a été votre pire expérience en terme de conventions de nommage au sein d'une équipe ?
>
> Gilles : Je me souviens très bien d'une mission effectuée au sein d'un grand groupe. On avait deux microservices l'un gérait toute la partie utilisateur et l'autre orienté logistique pour l'émission de colis, dans laquelle on gérait les différentes adresses qu'un utilisateur pouvait avoir. Bien entendu les base de données étaient séparées. Et nous devions pouvoir gérer les adresses également depuis le premier microservice, tout au moins les référencer. Donc dans notre objet User, nous avions les ID's des différentes adresses stockées elles dans le base de données liée au microservice logistique. Déjà j'ai perdu environ 2h30 à me questionner pour savoir comment nommer ma variable. Devait-elle s'appeler `addressesId`, `addresseIds`, ou encore `addressesIds`. Vous en pensez-quoi vous ?
>
> B-L : Je ne sais pas, `addressesIds`, la troisième donc ?
>
> G. : Oui on est d'accord.
>
> B-L : Vous aviez réellement besoin de réfléchir 2h30 pour cela ?
>
> G. : C'est-à-dire qu'on essaie de travailler proprement tout de même, il est important de prendre soin du nommage. Je pensais cette histoire terminée jusqu'à faire une PR [Pull Request, NDLR].
>
> B-L : Vous pouvez développer ?
>
> G. : 
