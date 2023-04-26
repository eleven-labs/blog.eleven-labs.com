---
lang: fr
date: '2019-08-21'
slug: bases-blockchain
title: Les bases de la Blockchain
excerpt: >-
  Qu'est ce que la Blockchain ? Cet article présente les bases du concept de la
  blockchain et explique les différentes propriétés de celle-ci.
authors:
  - katario
categories: []
keywords:
  - blockchain
  - hash
  - concepts
---

On entend beaucoup parler de la Blockchain comme étant l'une des futures révolutions technologiques, au même titre que l'intelligence artificielle. Pour autant, le concept est encore souvent mal compris, tant par le grand public que par les férus de technologies que nous sommes. Alors, qu'est ce que c'est ? A quoi ça sert, et comment on peut s'en servir ? On va tenter de trouver des pistes de réponses dans cet article en essayant d'en comprendre les concepts (et le vocabulaire qui va avec !) et en jetant un oeil sur ce qui se fait aujourd'hui dans le milieu. C'est parti !


![]({{site.baseurl}}/assets/2019-08-21-les-bases-de-la-blockchain/cat-ready.gif)


## Qu'est ce que la Blockchain ?

La blockchain est une technologie permettant de stocker et de diffuser des informations via un système décentralisé, c'est à dire qui n'est pas dirigé par une seule entité. En cela, son rôle ressemble à celui d'une base de données distribuée, accessible aux utilisateurs. Le point de départ de son fonctionnement semble assez évident : la blockchain consiste en un ensemble de blocs, chaînés entre eux par des chaînes de caractères créées par des moyens cryptographiques, et dénommé "hash". Le premier bloc de la chaîne est appelé Bloc Genesis, et permet de débuter la chaîne en créant et en établissant le premier hash.

Un hash cryptographique est une chaîne de caractère créée en appliquant une fonction de hachage, qui va transformer cette chaîne de caractère en une chaîne différente. Une première propriété de ces fonctions concerne le nombre de caractère du hash, qui reste fixe quelque soit la taille de la chaîne chiffrée. La deuxième propriété de ce hash est tout aussi intéressante dans le cadre de la blockchain : le moindre changement de virgule dans une string, et le hash change complètement !

![]({{site.baseurl}}/assets/2019-08-21-les-bases-de-la-blockchain/hash.png)

Pour revenir à notre sujet, chaque bloc contient un hash du bloc précédent (qui permet de lui assurer une "position" dans la chaîne) et des informations, qui peuvent concerner des transactions financières par exemple. Cet agencement des blocs attribue à la blockchain certaines propriétés intéressantes, que nous allons voir plus en détail.


### La blockchain est structurée

Comme dit précédemment, chaque bloc consiste en un paquet de données structurées, disposant d'une position dans la chaîne. Le bloc contient au minimum un body, contenant les informations que l'on souhaite stocker dans la blockchain, comme des transactions entre deux utilisateurs, par exemple. Il contient aussi un header composé des métadonnées comme l'index (la position du bloc dans la chaîne), un hash (le hash du bloc en cours), un previous hash (le hash du bloc précédent) ou un timestamp (la date de création du bloc).

Selon les blockchains, d'autres éléments, comme la taille d'un bloc, le nombre de transactions contenus dans le bloc, le Nounce (nous verrons dans un autre article l'intérêt de ce bidule) peuvent être également présent.


![]({{site.baseurl}}/assets/2019-08-21-les-bases-de-la-blockchain/block.png)

Ainsi, chaque bloc dispose d'une position relative par rapport au précédent bloc de la chaîne, via le Previous Hash.


### La blockchain est distribuée

Si une blockchain peut tourner en local, elle prend son intérêt lorsqu'elle est exécutée via des protocoles ["peer to peer"](https://www.journaldunet.fr/web-tech/dictionnaire-du-webmastering/1203399-p2p-peer-to-peer-definition-traduction-et-acteurs/), en réseau. Elle peut alors être comparée à un registre d'informations accessible à tous ses participants.

Le fonctionnement d'une blockchain en "peer to peer" est assez simple : il existe plusieurs rôles au sein d'une blockchain (qui diffèrent évidemment selon les blockchains) : la création de simples transactions via des wallets, les noeuds simples qui vont vérifier, valider et relayer les informations à insérer dans la blockchain, les mineurs qui vont construire les blocs, les noeuds complets, qui vont tenir à jour un exemplaire local de la blockchain… Chaque rôle trouve son intérêt.

Ainsi, une transaction ou une information destinée à rejoindre un bloc est émise par un participant. Elle est envoyée sur le réseau, où elle est vérifiée par un ou plusieurs autres participants. S'ils la valident, elle rejoint alors une "file d'attente", où elle sera récupérée pour être insérée dans un bloc par un mineur. Une fois le minage effectué en local, le mineur enverra l'information aux autres participants. En cas de conflits (deux blocs tous les deux parents d'un même bloc), alors la blockchain exécute un protocole de consensus réalisé par les noeuds complets. Il existe plusieurs types de protocoles de consensus à ce jour, mais au vu de leur complexité, nous les détaillerons dans un autre article.


### La blockchain n'est pas modifiable (sauf avec la puissance de calcul appropriée)

On entend souvent dire que la blockchain est immutable, ou non modifiable. En théorie, c'est faux. Modifier un bloc ne demande pas énormément de connaissances ou de ressources. Cependant, à la moindre modification du contenu d'un bloc, son hash va être modifié, et va donc entraîner la modification de tous les blocs suivants dans la chaîne (puisque dans le hash d'un bloc, on hash également le previous hash du bloc précédent… Si si, c'est logique !).


![]({{site.baseurl}}/assets/2019-08-21-les-bases-de-la-blockchain/changed-char.png)

Quelles sont les conséquences de ce principe ? Lorsque l'on met à jour un bloc, on introduit une modification dans la blockchain, qui va forcément finir par entraîner un conflit. Au moment d'ajouter le bloc dans la chaîne, celui-ci va être analysé, et sa correspondance avec le précédent bloc sera vérifiée. Si le hash du précédent bloc ne correspond pas, alors le bloc est rejeté, et un mécanisme de consensus est démarré, pour savoir lequel des deux est valide. Ce mécanisme est très gourmand en énergie et en puissance de calcul, notamment parce qu'il doit reconstituer la blockchain depuis le point de conflit jusqu'au bout de la chaîne !

Ainsi, la théorie voudrait qu'avec une puissance de calcul suffisante, les blockchains puissent être modifiées et / ou réécrites. C'est d'ailleurs ce qui se passe lors d'un Hard Fork d'une Blockchain (où, suite à des propositions de changements du fonctionnement général, l'adoption se manifeste par la participation de la part d'un grand nombre d'acteurs au [Hard Fork](https://blog.ethereum.org/2016/07/20/hard-fork-completed/))
Il est donc possible de modifier une blockchain, contrairement à ce qui est écrit dans de nombreux articles. Cependant, faire ce changement demande une puissance de calcul titanesque, et suffisante pour assurer dans la grande majorité des cas l'immutabilité d'une blockchain.



## CONCLUSION

Au travers de cet article, nous avons exploré les bases de ce qu'est une blockchain. Nous en avons découvert les concepts principaux, et nous avons réussi à le faire sans directement évoquer les crypto-monnaies ! Effectivement, si le concept de blockchain a été implémenté pour la première fois en 2008 via le lancement de Bitcoin, il est important de comprendre que toutes les blockchains ne sont pas des crypto-monnaies. Il existe aujourd'hui de nombreuses implémentations, comme [Frankl](https://frankl.io/) ou [Carrefour](https://actforfood.carrefour.fr/nos-actions/la-blockchain-alimentaire). La blockchain est une technologie vaste, et il reste beaucoup de sujets que nous aurons l'occasion d'expliquer dans d'autres articles. Si vous ne comprenez pas un point, n'hésitez pas à poser des questions en commentaire !
