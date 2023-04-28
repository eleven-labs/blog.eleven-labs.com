---
lang: fr
date: '2021-05-20'
slug: informatique-quantique
title: L'informatique quantique
excerpt: >-
  L'objectif de cet article est de vulgariser certains principes de la mécanique
  quantique, puis de se concentrer sur ce qu'est le Qubit et quelles sont ses
  différentes utilisations.
authors:
  - youyou
categories: []
keywords:
  - culture
  - quantique
  - qubit
---
![Informatique quantique]({{ site.baseurl }}/assets/2021-05-20-informatique-quantique/informatique-quantique.jpg)

## Qu'est-ce que l'informatique quantique


À la différence d'un ordinateur classique, qui se repose sur des Bits qui représentent le passage ou l'absence
de courant électrique, un ordinateur quantique lui est doté de Qubits. Ça ne nous avance pas plus que ça hein...

Du coup c'est quoi un Qubit :) ?

On va vulgariser certains principes de la mécanique quantique avant d'arriver au cas du Qubit et de ses différentes utilisations. Et c'est parti !


## Physique classique vs Physique quantique


### 1. Le principe de superposition :

La physique classique c'est ce que l'on observe. Par exemple, je suis Youyou, être humain unique
(chacun de nous est unique bien entendu :)), en mouvement, entouré d'air, le tout sur une planète Terre.
Tout est en réalité parfaitement défini, tel qu'on le voit.

La physique quantique elle, décrit le comportement des atomes/particules, mais on pourrait se dire que chaque objet est en
quelque sorte quantique aussi. Ne nous emmêlons pas les pinceaux d'entrée de jeu et voyons voir ce qui change dans un système
quantique.

Prenons par exemple, un électron qui "orbite" autour du noyau d'un atome. En mécanique quantique, il se trouve à une
**probabilité de plusieurs positions** à la fois (et non simultanément).

Si l'on dit qu'il se trouve à plusieurs positions simultanément, ça serait faux. C'est juste qu'il est exactement à tant de %
de la position A, et tant de % de la position B... Sa position "exacte" ne peut être déterminée, visible par nos yeux,
ou tout autre appareil, car poser la question "à quelle position te trouves-tu jeune électron?" n'est tout bonnement pas possible.

Pourquoi donc ? C'est ce que nous verrons un peu plus tard, patience.
À titre d'exemple, l'experience de pensée du **chat de Schrodinger** fait débat car l'on a tendance à dire que le chat
est **mort et vivant à la fois.**

Cela n'est pas vrai, il est dans un état qui est une combinaison de l'état mort et de l'état vivant. Cet état est aussi
légitime que l'état mort tout court (pauvre chat), ou l'état vivant, mais simplement **nous ne pouvons pas l'observer**.

![Schrodinger meme]({{ site.baseurl }}/assets/2021-05-20-informatique-quantique/schrodinger-meme.jpg)

Oublions nos chats, et revenons à notre électron. On dit qu'en mécanique quantique la mesure de la position d'un électron est un **"observable"**,
qui n'est en réalité pas observable avec quelconque appareil, à contrario de la mécanique classique où ma position en tant qu'humain à un instant T
(ou celle de l'électron) est observable à n'importe quel moment.

Pour faire court, on peut dire que notre mécanique classique est **déterministe** (on ne peut avoir qu'un seul état à la fois),
contrairement à la mécanique quantique qui est **probabiliste** (les différentes positions d'un électron). Il n'existe pas en
physique quantique de système à deux états (1 ou 0) (forcément, on devra comptabiliser l'infinité de possibilités de combinaisons
des deux états sur lesquels on se base) alors qu'en physique classique oui (le bit, une pièce de monnaie, un verre vide ou rempli etc.).

### 2. La décohérence quantique :

Maintenant revenons encore une fois à notre électron, en se basant sur deux états de positions qui
sont A ou B (deux points sur un cercle par exemple). Je pourrais aussi ajouter les positions C, D, E etc. à l'infini mais
on va se repérer uniquement avec A et B pour plus de clarté.
Il peut-être à la position A, ou B, ou proche de A (80% vers A / 20% vers B), etc.

Si je suis doté d'un appareil de mesure qui arrive à déterminer sa position exacte à un instant T, et que j'effectue l'opération
à plusieurs reprises, je trouverai dans certains cas A et dans d'autres cas B (il ne me donnera jamais la réponse 20% vers A par exemple).
Pourtant juste avant que j'effectue cette mesure, il était exactement à 20% de A et 80% de B.

On ne **peut pas** poser en mécanique quantique la question de type : "Dans quel position exacte te trouves-tu ?".
En revanche, ce que l'on peut déduire de ces différentes expériences, c'est que si on a eu des résultats mélangés A et B,
alors on est sûrs que notre petit électron ne se trouve ni à la position A (car l'on aurait jamais pu avoir B comme résultat),
ni à la position B.


On est passé d'un monde probabiliste à un monde déterministe. On vient tout bonnement de vivre une
**décohérence quantique**. Les positions de l'électron ne sont plus "superposées" à la mesure, mais elles transitent
bien vers une position exacte (A ou B) dans notre physique classique, lorsque j'effectue une mesure.

Cette histoire de décohérence fait toujours couler beaucoup d'encre, et il existe d'autres explications liées au problème de la
mesure (école de Copenhague, théorie des mondes multiples), mais personnellement je digère mieux la décohérence :).
Voyez ça un peu comme le passage entre deux mondes : celui de la mécanique quantique (superposition d'états) et
la mécanique classique (nos yeux, notre instrument de mesure, le monde tel qu'on le voit).

Notons pour plus tard que le cas où l'électron se trouve exactement à la position A n'est que le cas particulier où il
est à 100% sur A et 0% ailleurs, et pareil pour B. On appelle ces états particuliers des états **propres**.

![Monsieur propre]({{ site.baseurl }}/assets/2021-05-20-informatique-quantique/mr-propre.jpg)

Pour résumer un peu ce charabia, notre physique classique admet des grandeurs (comme la taille, le poids, la vitesse
d'un objet), et la physique quantique a des observables (la position comme vu un peu plus haut, mais aussi le niveau
d'énergie d'un atome et d'autres propriétés :)).

Dans un état quantique, ces observables sont sous la forme de probabilité (% pos A / % pos B) pour simplifier.
En réalité, pour αA + βB, α et β sont des nombres complexes, (tel que α = ai+b et β = ci+d - avec i² = -1, mais passons)
C'est cet état de combinaisons qu'on appelle superposition.

### 3. Les différents niveaux d'énergie :

Si on prend comme deuxième exemple les niveaux d'énergie d'un électron :
un électron a différents niveaux d'énergie. Il peut être excité ou au repos (nos deux états propres),
ou une combinaison de ces deux états (infinité de possibilités).

Notons que tous les atomes/électrons qui nous entourent n'ont pas leurs niveaux d'énergie dans un état de superposition.
Les interactions sont plutôt fréquentes entre atomes / ondes / chaleur etc. (pas de confinement pour eux !),
et la superposition reste rare. On se trouve donc face à deux challenges de taille :
comment créer cet état de superposition, et comment le garder le plus longtemps possible.

Les recherches ont conduit nos braves physiciens à se tourner vers certains matériaux éligibles, comme les **supraconducteurs**
(prenons l'aluminium par exemple), ou les ions piégés, les photons etc. et créer un système autour pour pouvoir observer un état quantique.

Dans le cas d'un Qubit supraconducteur, ce n'est pas le matériau (ex : aluminium) qui est un Qubit (cela n'a pas de sens),
mais l'état quantique du courant qui apparaît entre deux matériaux supraconducteurs (la liste des prérequis pour en arriver là
est bien entendu non-exhaustive).

Pour garder cet état de superposition quantique le plus longtemps possible, il ne faut aucune interaction extérieure, et de ce fait
les expériences peuvent se faire dans des conditions de température très basse. Plus il y a de Qubits, et plus cela devient compliqué.


## Le Qubit


Bon, et notre Qubit alors ? Pourquoi "1 ou 0 ou les deux à la fois" ?

Dans le cas de notre électron excité (niveau d'énergie maximal) ou au repos (niveau d'énergie minimal), ces deux états propres
sont l'équivalent du 1 et du 0 de notre bit. Un bit n'est que les deux états propres d'un Qubit. Un Qubit n'est lui-même qu'un système
quantique à 2 états, on pourrait prendre en exemple une pièce de monnaie avec ses deux états pile et face qui constituerait un Qubit.

### 1. Pourquoi c'est plus efficace qu'un bit classique ?

Vous l'avez bien compris, ce n'est pas sur un 0+0 que la techno fera ses preuves.

Un des algorithmes les plus connus où un ordinateur quantique sera toujours plus performant est l'Algorithme de Grover.

Prenons 8 boîtes vides, et seulement dans une de ces boîtes se trouve une paire de chaussures. Il n'y a aucune relation entre les
boîtes. Pour retrouver la paire, je vais ouvrir chacune des boîtes jusqu'à la trouver.
La complexité de mon algorithme est en fait le nombres de boîtes totales (ici 8), le problème étant NP-Complet.

Maintenant dans le cas d'un ordinateur quantique, l'algorithme de Grover nous permet de trouver chaussure à notre pied avec une complexité de
√8 (racine carrée de 8).

Un autre algorithme comme celui de Shor nous permet de réduire la complexité de la factorisation d'un nombre N en nombres premiers. On passe
d'une complexité exponentielle à une complexité logarithmique (un gain conséquent).

Enfin, grâce à la superposition quantique, chaque nouveau Qubit ajouté à notre système double le nombre d'états possibles, d'où sa
croissance exponentielle car pour N Qubits on aura "2 puissance N" états.

### 2. La logique quantique :

Les portes logiques (ou fonctions logiques) dans un ordinateur classique sont: NON, ET, Non-ET, OU, XOR NOR etc.
On peut les construire à partir de plusieurs transistors connectés, et ils servent de base au calcul informatique.

Peut-on les appliquer en informatique quantique ? Hormis la porte NON (NOT) ou OUI, ce n'est pas possible. Toutes les portes quantiques
se doivent d'être réversibles. Une porte logique OU n'est pas réversible, car pour le cas où mon output est 1, j'ai comme possibilités
d'inputs le couple 1 - 0 / 0 - 1 ou 1 - 1.

Un exemple de porte quantique est la porte de Hadamard qui permet à un Qubit de passer de l'état initial 0 vers un état de superposition
de "50% de 0 et 50% de 1".

On peut donc imaginer qu'en ayant plusieurs Qubits (comme plusieurs circuits de transistors), on peut ajouter nos propres portes quantiques,
et effectuer des mesures, et c'est ce qui se passe sur un ordinateur quantique.

### 3. Intrication quantique :

Prenons un système de 2 Qubits. Je vais m'intéresser à l'état de l'ensemble de ces deux Qubits et me poser la question suivante :
Est-ce que pour toute possibilité de cet état d'ensemble (donc de mes deux Qubits) je peux trouver séparément deux états
distincts (donc du Qubit 1 et du Qubit 2) ?

La réponse est non. Dans cet ensemble de cas particuliers, cela veut dire que pour un état de nos deux Qubits, il n'existe pas deux Qubits "séparés"
qui vérifieraient cette équation. En réalité, si j'effectue une mesure sur le premier Qubit, alors le deuxième se "coordonera" exactement
de la même façon que le premier. C'est ce qu'on appelle "l'intrication quantique", et on dit alors que nos deux Qubits sont "intriqués".

Le phénomène d'intrication est fou, car on peut se poser la question : "Comment le deuxième Qubit détient l'information du premier ?" Est-ce une
transmission, un coordination, ou a-t-il ces données stockées sans possibilités de hasard (paradoxe EPR, théorie de variable cachée).

Si cela vous intéresse, je vous invite à vous renseigner sur la mission spatiale scientifique chinoise
[QUESS](https://fr.wikipedia.org/wiki/QUESS), qui a réalisé un fabuleux exploit mêlant intrication et téléportation quantique.

### 4. À quand un ordinateur quantique à la maison ?

Comme à l'époque où nos ordinateurs classiques étaient d'énormes machines qui faisaient office de calculette,
l'ordinateur quantique n'est pas prêt d'arriver chez nous. Il permet de résoudre quand même bon nombre d'algos,
et tendra à surpasser nos chers supercalculateurs dans quelques années (pour certains types de problèmes) -
une limite appelée [suprématie quantique](https://www.youtube.com/watch?v=-ZNEzzDcllU).

Dans le domaine médical/pharmaceutique, la modélisation de protéine est très coûteuse et elle se prête bien à la mécanique quantique.
En terme de cryptographie, les enjeux sont grands. Une fois atteint un certain nombre de Qubits, l'ordinateur quantique peut s'attaquer facilement à du
[RSA 2048](https://www.technologyreview.com/2019/05/30/65724/how-a-quantum-computer-could-break-2048-bit-rsa-encryption-in-8-hours/),
et théoriquement on pourrait étendre cela au [Bitcoin](https://decrypt.co/28560/quantum-computers-could-crack-bitcoins-encryption-by-2022)
dans quelques années.

Pas mal du tout hein !

En termes d'entreprises présentes sur le marché, la "startup" nommée D-wave (créée en 1999) est devenue l'un des leadeurs
dans la vente d'ordinateurs quantiques, mais d'autres acteurs comme IBM Q, Microsoft Q et Google sont bels et bien présents.

### 5. Et le covid ?

Le fameux D-wave a donné aux chercheurs la possibilité d'utiliser (cloud) certains de leurs ordinateurs quantiques pour les
aider à la modélisation de protéines (comme dans le domaine médical), ou plancher sur les
[problématiques de distribution de vaccin](https://medium.com/@dwave/what-we-learned-this-past-year-from-the-quantum-computing-for-covid-19-program-85bdd99aa628)
entre autres.

## Si je veux faire de l'informatique quantique, je fais comment ?

Il y a un super livre qui résume bien tout ça : "Quantum Computing for Computer Scientists" (Yanofsky/Mannucci), et un chaîne Youtube que je recommande
est celle de l'astrophysicien [Etienne Parizot](https://www.youtube.com/channel/UCTwKk-J5WjE5cFmHiaLKfhQ).

Pour conclure, il est même possible de réaliser des expériences avec des Qubits réels depuis chez vous car IBM
met à disposition des ordinateurs quantiques, pour faire tourner vos expériences sur 1 => 15 Qubits.
Vous pouvez combiner des portes quantiques, mesurer, et leur [outil](https://quantum-computing.ibm.com/) est vraiment stylé.
