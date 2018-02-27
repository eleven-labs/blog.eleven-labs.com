---
layout: post
title: Comment estimer les tâches durant son planning poker
excerpt: "Estimer les tâches à réaliser durant un sprint est souvent compliqué. Entre les désaccords entre les développeurs, les votes faussés par ces derniers, voire l'absence de vote conduisant à une estimation totalement arbitraire, le planning poker est une tâche complexe."
authors:
- alexception
permalink: /fr/planning-poker/
categories:
    - agile
    - scrum
tags:
    - agile
    - scrum
cover: /assets/2018-02-27-planning-poker/cover.jpg
---

Estimer les tâches à réaliser durant un sprint est souvent compliqué.
Entre les désaccords entre les développeurs, les votes faussés par ces derniers,
voire l'absence de vote conduisant à une estimation totalement arbitraire,
le planning poker est une tâche complexe.

Pour combler tous les défauts possible du planning poker, nous avons tenté
diverses expériences chez Brouette-Labs. Après plusieurs versions testées à
chaque sprint, nous sommes convaincus d'avoir trouvé la meilleure méthode à
appliquer durant ce rituel agile.

# Prérequis

## Méthode agile

Le planning poker ne s'applique pas à tout type de projet. Il s'agit d'un rituel
agile que l'on retrouve essentiellement dans la méthode Scrum et de façon plus
laxiste, en Kanban. Si les besoins métiers nécessitent que vous travailliez en
cycle en V, vous ne pourrez malheureusement pas profiter de ces conseils.

## Les différents acteurs

### Scrum Master

Le Scrum Master est un élément essentiel du planning poker. Il entretient la
dynamique de ce rituel agile, comme les autres (démonstration, rétrospective).
On peut aisément le comparer à un Game Master dans les jeux de société pour
geeks. Il s'assure en effet que les joueurs (ici les développeurs), ne
s'endorment pas durant la partie (ici le rituel agile). Ce qui justifie bien
souvent son salaire exhorbitant.

### PO

Le Product Owner est également un élément clé du rituel. Son rôle est de
s'assurer que toutes les fonctionnalités prévues par l'équipe produit, seront
effectivement prévues dans le sprint. On peut le voir comme un "gambler", un
flambeur en quelque sorte. Son statut de gambler explique également son salaire
bien moindre qu'un Scrum Master puisqu'il prend beaucoup plus de risque au
niveau du planning popker.

### Les développeurs

Un Scrum Master et un PO ne permettent pas en soit de terminer un Sprint. Il
incombe donc aux développeurs, de part leurs compétences, de participer à
l'estimation des tickets. Je tiens à préciser qu'il ne s'agit pas d'estimer des
tickets en terme de temps effectif, il s'agit de points de complexité.

## Les outils

### Un jeu de carte

Oubliez la suite de Fibonacci, désuette et trop mathématique. Dans planning
poker il y a "poker". Un planning poker se fait donc avec un jeu de 52 cartes.

### La mise de départ

Autre information importante pour un planning poker réussi, la mise de départ.
Il ne faut en aucun cas la négliger. Un erreur de calcul ou une négligence des
règles peut remettre en cause tout le sprint.

Il y a 3 inputs pour chaque sprint :
 - 1% du salaire mensuel du Scrum Master
 - 10% du salaire mensuel du PO
 - 1% de la moyenne des salaires mensuels de l'équipe

Pour une équipe composée de 5 développeurs, 1 PO et un Scrum Master, la règle
est la suivante : à chaque nouveau développeur, il faut rajouter 0.5% à la
moyenne salariale mensuelle des développeurs. Ça se fait très rapidement sur
un fichier Excel que vous fournira aisément le Scrum Master.

- Scrum Master, 4500€ net/mois. Mise de départ : 45€/sprint
Prenons un exemple concret :
 - PO, 2200€ net/mois. Mise de départ : 110€/sprint
 - Développeur, 2600€ net/mois (équipe hétérogène) : 13€/développeur/sprint
 (soit 65€ au total)

# Planning poker

Les Prérequis ayant été assimilés, il ne reste qu'à estimer les tickets du
sprint. En général, et pour ne ruiner personne, on part sur des sprints de deux
semaines (en tout cas chez Brouette-Labs). À vous d'ajuster au besoin en
fonction du salaire de chacun. Nous verrons ultérieurement dans un article
dédiée aux PO une méthode pour optimiser le rendement de production des
développeurs.

## Les règles de refill

 - Il y a autant de manches qu'il y a de tickets ;
 - Il est possible pour le PO de faire un refill de sa somme de départ, indexée
 sur son salaire mensuel ;
 - Il est possible pour le Scrum Master de faire un refill de 50% de sa somme de
 départ indexée soit sur son salaire mensuel s'il est interne, soit facturé s'il
 est prestataire
 - Il est possible pour les développeurs de faire un refill de 10%, de façon
 collégiale et unanime (donc 50% pour une équipe de 5 développeurs).

## Déroulement d'une manche

Comme évoqué précedemment : un ticket = une manche.

Les manches se jouent comme une partie de Poker Texas Holdem améliorée :
 - Chaque personne se voit distribuer 2 cartes
 - Le PO est Dealer sur chaque manche, ce qui lui permet d'évaluer la tendance
 - Le Scrum Master doit obligatoirement poser la Small Blind
 - Un des développeurs pose la Big Blind (l'usage veut que cela tourne entre
 chaque manche)
 - Le flop (les 3 cartes communes) sont étalées au centre
 - Le reste de la partie se déroule comme une partie de Poker Texas Holdem
 normale

## Gains/Pertes

Là où les règles diffèrent du Texas Holdem standard revient à la position du
Scrum Master. Ce dernier n'étant pas affecté par les choix décisionnels
techniques ou business, et ayant donc son salaire (et ses pertes qu'il
justifiera par un salaire plus important), il peut décider de donner sa somme au
PO où aux développeurs.

À l'issue d'une manche, si le Scrum Master ne s'est pas couché, il doit donc
annoncer pour quelle équipe (PO ou développeurs) il s'est positionné. Ajoutant
ainsi sa somme à l'équipe choisie.

L'issue d'une manche est multiple :
 - Le PO gagne, fixe l'estimation du ticket, et remporte les sommes des autres
 joueurs ;
 - Les développeurs gagnent, fixent l'estimation du ticket, et remportent la
 somme du PO.

## Crédits restants & autres règles

Il se peut qu'à l'issue du Planning Poker il reste de l'argent en jeu pour
les joueurs restant en lice. Cet argent pourra être utilisé en accompte lors
du prochain planning poker.

Si le Planning Poker n'est pas terminé, que tous les refill ont été refait,
il incombe au PO de contacter son supérieur hiérarchique afin de trancher tout
en exposant la situation de non entente cordiale suite au Planning Poker.

# Conclusion

Cette méthode à porté ses fruits chez Brouette-Labs. Nous arrivons enfin à
trouver une estimation concrète qui dépend fortement du bluff et d'autres
stratégies. Nous avons même poussé le vice plus loin en créant notre propre
crypto-monnaie : la brouette-coin, mais cela fera l'objet d'un autre article.
