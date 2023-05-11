---
lang: fr
date: '2023-05-03'
slug: archi-l-outil-de-modelisation-qui-vous-veut-du-bien
title: >-
  Archi - L’outil de modélisation qui vous veut du bien
excerpt: >-
  Quand il s’agit de faire des schémas d’architectures en projection ou en documentation, il y a pléthore d’outils disponibles, que ce soit en client lourd, web, SaaS… Et avec eux, une multitude de “templates”, presque propres à chaque outil, avec des problématiques de passage à l’échelle dès que l’on commence à avoir plusieurs contributeurs sur ces documents.
authors:
  - pouzor
categories:
  - architecture
---

Quand il s’agit de faire des schémas d’architectures en projection ou en documentation, il y a pléthore d’outils disponibles, que ce soit en client lourd, web, SaaS… Et avec eux, une multitude de “templates”, presque propres à chaque outil, avec des problématiques de passage à l’échelle dès que l’on commence à avoir plusieurs contributeurs sur ces documents.
Aujourd’hui, je vais vous faire une présentation d’ARCHI, un outil de modélisation Open Source qui pour moi répond bien à ces problématiques.


## Norme et Urbanisation

Avant de parler de l’outil, parlons un peu d’urbanisation. En tant qu’architecte, notre préoccupation première est, à mon sens, faciliter la communication et le partage d’informations entre les différentes parties prenantes d’un projet, d’une équipe ou d’une entreprise, ce qui implique de trouver un langage commun. J’ai souvent cherché le bon compromis entre représentation technique et fonctionnelle sans trouver forcément chaussure à mon pied. Quand on ajoute la notion de pérennité à cette équation déjà complexe, cela devient impossible. Certain frameworks de modélisation sont trop orientés dev (à mon sens) comme C4 ou BPMN et ne sont pas facilement compréhensibles pour des personnes hors de la cible première.
Dans le cas de C4 que j’ai beaucoup utilisé, même s’il existe des éditeurs maintenant, le coté “implémentation” de la documentation limite très souvent l’utilisation par rapport à un [draw.io](http://draw.io) ou solution équivalente.

À l’inverse, [draw.io](http://draw.io) est un super outil mais n’offre pas beaucoup de cadre et, même avec des templates prédéfinis, vous aurez beaucoup de mal à avoir un rendu homogène entre les utilisateurs.

Voila déjà le premier point qui m’a séduit, ARCHI vient avec son framework, [ArchiMate](https://fr.wikipedia.org/wiki/ArchiMate). C’est un standard technique de l’[OpenGroup](https://www.opengroup.org/) et aligné avec la norme TOGAF.
ArchiMate offre un langage commun pour décrire la construction et le fonctionnement des processus d'entreprise, des structures organisationnelles, des flux d'information, des systèmes informatiques et de l'infrastructure technique. On peut donc décrire une architecture sous plusieurs scopes, et faire des ponts entre les différentes vues d’architecture.


### ArchiMate Framework

Les principaux concepts et éléments du langage ArchiMate sont présentés sous le nom d'ArchiMate Core Framework, qui se compose de trois “layers” et de trois “aspects”. Cela crée une matrice de combinaisons. Chaque couche à ses aspects “Passive Structure”, “Behavior” et “Active Structure”.

<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/core_framework_archimate.jpeg" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>

D'après Wikipedia : 

### Layer

- La couche Business concerne les processus, services, fonctions et événements des unités commerciales. Cette couche "offre des produits et des services à des clients externes, qui sont réalisés dans l'organisation par des processus commerciaux exécutés par des acteurs et des rôles commerciaux".
- La couche Application concerne les applications logicielles qui "soutiennent les composants de l'entreprise avec des services d'application".
- La couche Technologie concerne "le matériel et l'infrastructure de communication pour soutenir la couche Application. Cette couche offre les services d'infrastructure nécessaires à l'exécution des applications, réalisés par du matériel informatique et de communication et des logiciels système".

### Aspects

- “Passive Structure” désigne l'ensemble des objets sur lesquels une action (un comportement) est menée. Dans la couche métier, il s'agirait d'objets d'information, dans la couche application, d'objets de données et dans la couche technologie, d'objets physiques.
- “Behavior” représente l'ensemble des processus et fonctions réalisés par les acteurs. "*Les éléments structurels sont assignés aux éléments comportementaux, pour montrer qui ou quoi affiche le comportement*".
- “Active Structure” représente par exemple des acteurs commerciaux, des dispositifs ou des composants d'application. On peut les appeler des sujets d'activité, des éléments structurels qui affichent un certain comportement.


Cette matrice accompagnée des différentes représentations et des différents types de relation permet globalement de représenter n’importe quel système, des plus simples aux plus complexes.


## ArchimateTool


Parlons maintenant de l’outil, et de ce qui le rend puissant.
Au delà d’un fonctionnement classique de modélisation comme draw.io, sa puissance vient de sa gestion des objets.

Tout élément dans Archi est un objet (boite, relation, étiquette, …), possédant des attributs descriptifs (au-delà des types dans Archimate) et sont sauvegardés dans un référentiel. L’intérêt me direz-vous ?

Prenons comme exemple ce schéma simple, décrivant le parcours de création d’un utilisateur.

<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/archi_screenshot_1.png" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>

Ce que l’on peut voir immédiatement, c’est que l’ensemble des éléments sont référencés dans le Model Archi, que ça soit les éléments business (en jaune), les applications techniques et les interfaces d’API (en bleu) et même les relations. Cela vous permet d’avoir un référentiel documentaire entre les différents schémas, et de réutiliser les mêmes éléments dans des schémas différents.


Dans l'exemple ci-dessous, l’application “MS Client” est le même objet que dans le premier schéma.
<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/archi_screenshot_2.png" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>


Cela permet notamment d’avoir une documentation unique sur l’ensemble de models et de faciliter cette documentation.
<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/archi_screenshot_3.png" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>


Autre force de l’outil, sa gestion des relations et notamment des imbrications. Lors de l’insertion d’un objet dans un autre, Archi comprend qu’il peut s’agir d’une relation (souvent d’une composition) et va vous demander explicitement de décrire s'il s’agit d’une relation explicite (comme une flèche finalement). 

Exemple ici quand je tente d’ajouter un component “test” dans l’API Gateway.
<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/archi_screenshot_4.png" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>


D’ailleurs maintenant, si je veux sortir cette boite de l’API Gateway, la relation va rester et apparaître explicitement.
<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/archi_screenshot_5.png" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>


Mais le plus gros avantage à cette gestion des “objets” dans Archi, c’est la possibilité de générer en un clic une vue, à partir d’un élément du référentiel, avec l’ensemble des objets qui lui sont attachés. Idéal pour comprendre la place d’un objet dans l’ensemble de notre ecosystème, y compris sur des schémas gérés par d’autres personnes.

Exemple :
<figure style="text-align: center; margin: 2rem 0;">
  <img src="{{ site.baseurl }}/assets/2023-05-03-archi-modelisation/archi_screenshot_6.png" width="800px" alt="Matrice Archimate" style="display: block; margin: auto;" />
</figure>


Enfin, dernier gros avantage de ce référentiel, l’outil permet de rechercher dans l’ensemble des objets (et des attributs des objets) !

Dans les autres points forts d'Archi, on trouve une organisation libre via des dossiers dans la gestion des “Views” (des schémas à proprement parler) qui vous permet d’organiser le travail par type de schéma (business, applicatif, infra…) ou encore par équipe, fonctionnement qui était assez pratique avec l’utilisation de Lucidchart (payant) par exemple.

D’un point de vue collaboratif, il peut s’intégrer (via un plugin) à une configuration GIT afin de versionner le travail, ou encore exporter la documentation en format HTML, PDF, image...


## Conclusion

[Archi](https://www.archimatetool.com/) a vraiment été pour moi un gros "level up" dans la gestion de la documentation d’architecture, notamment sur ses aspects outil collaboratif et centralisation des connaissances. Le fait de construire de nouveaux schémas en utilisant l’outil permet de faire croître au fur et à mesure du temps la connaissance globale du projet, et construit de manière empirique la connaissance, ce qui est assez rare dans ce genre d’outil.
En bref c’est un outil assez complet, pas très compliqué à prendre en main et Open Source. Pour moi il devient un Must Have dès qu’il y a plusieurs contributeurs sur les modélisations.

Je vous le recommande fortement !
