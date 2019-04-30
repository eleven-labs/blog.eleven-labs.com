---
layout: 'post'
title: Visualiser l'architecture de vos projets
excerpt: Visualiser l'architecture de vos projets
authors:
- gcanal
permalink: /fr/visualiser-l-architecture-de-vos-projets/
categories:
    - Architecture
tags:
    - Architecture
    - C4Model
    - Diagramme
    - Visualisation
    - Modélisation
    - Structurizr
image:
  path: /assets/2019-12-02-visualiser-l-architecture-de-vos-projets/cover.jpg
  height: 970
  width: 450
---

Quand il s'agit de visualiser l'architecture d'un projet, une équipe peut décider d'utiliser un formalisme bien connu: l'[UML](https://fr.wikipedia.org/wiki/Diagramme_de_composants) _(Language de Modélisation Unifié)_.

Or, depuis l'**avènement de l'agilité**, la modélisation de l'architecte via UML est perçue comme une **perte de temps**, **désuet**, **complexe à déchiffrer** et **difficile à maintenir**.

La solution la plus souvent envisagée est d'utiliser ponctuellement un **tableau blanc**, de dessiner des boites, des flêches, de caler quelques infos, de prendre une photo puis de l'archiver.

[![Vidéo Youtube: UML, Cucumber and modeling reality - MPJ's Musings - Fun Fun Function][fff-image]][fff-video]
_[UML, Cucumber and modeling reality - MPJ's Musings - Fun Fun Function](fff-video) par [Mattias Petter Johansson (mpj)](mpj-twitter)_

[fff-image]: {{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/just-use-a-whiteboard.png
[fff-video]: https://www.youtube.com/watch?v=4_SvuUYQ5Fo
[mpj-twitter]: https://twitter.com/mpjme

L'approche semble valable de prime abord, malheureusement, on peut aboutir rapidement à ce résultat: 

![Exemple de diagramme d'architecture problématique]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/diagramme-bordelique.jpg)

Sur le moment, l'équipe qui a produit le diagramme a une idée claire du système et se figure bien les intéractions entre les différentes briques de l'application.

Sauf que le résultat, lui, est difficile (pour ne pas dire impossible) a exploiter.

**Que manque t-il au juste ?**

- Une légende, expliquant les codes couleurs et les différents symboles choisis,
- des labels, permettant de clarifier les intéractions matérialisées par les flêches.
- le sens de circulation de l'information entre deux boites dans la plupart des cas,
- une façon claire de distinguer le type de chacune des boites (es-ce une application ? Un système de fichier ? Un algorithme ? Un composant logiciel ?)
- des informations sur les technologies utilisées pour les intéractions et les briques applicative,
- et j'en passe...

En somme, il nous manque un formalisme accessible qui laisse peu de place à l'interprétation.

Ce sont les problématiques que tente d'adresser le [modèle C4](https://c4model.com/) _(C4 Model)_

## Le Modèle C4 _(C4 Model)_

Le modèle C4, créé par [Simon Brown](https://simonbrown.je/), vise a aider les équipes à **décrire** et **communiquer** l'architecture logicielle, 
lors des sessions de conception _(up-front design)_, 
ainsi que rétrospectivement, pendant les phases de documentation, grâce à une notation semi-formelle accessible au plus grand nombre.

Le modèle permet de créer une cartographie du code, 
à **différents niveaux de détails**, à l'image d'une carte interactive qui permet de zoomer sur une zone d'intérêt.

Chaque niveau s'adresse à une audience bien définie.

![Illustration des 4 niveaux de zooms du modèle C4](/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/c4model-layered.svg)

_Illustration des 4 niveaux de détails du modèle C4_

Avant de plonger dans les formalismes du modèle C4 commençons par...

## Distinguer la visualisation de la modélisation

Utiliser des outils généralistes comme [draw.io](https://www.draw.io/), [lucidchart](https://www.lucidchart.com) ou encore un tableau blanc comme indiqué plus haut pour vos diagrammes apparaît en premier lieu comme une solution pertinente. Vous investissez du temps dans la réalisation de diagrammes pour exposer l'architecture de vos projets à votre audience.

**Sans formalisme**, on abouti la plupart du temps, à des ensembles de boites et de flêches difficilement compréhensibles comme nous l'avons vu dans le préambule de cet article. 

Cependant, même en introduisant un formalisme, il vous sera parfois difficile de ré-exploiter vos travaux et de les maintenir.

**Concrètement, quand vous utilisez ce genre d'outils, que faites-vous ?** 

**Vous couchez sur un support visuel ce que vous savez de l'architecture de vos projets**. Ce **savoir**, la plupart du temps **imparfait**, vous l'avez acquis en vous basant sur vos contributions personnelles, sur le code que vous avez lu, en interrogant les différentes personnes qui participent à la conception des applications, en somme, vous avez construit un **modèle mental** de l'architecture de vos projets.

Voilà! Nous y somme. En réalité, ce qui compte c'est ce **[modèle](https://fr.wikipedia.org/wiki/Mod%C3%A8le_(informatique))**, celui que vous interrogez mentalement pour réaliser vos diagrammes.

Modèle qu'il va falloir **extraire** pour permettre à toutes les personnes concernées de le **maintenir**, de l'**enrichir** et de le **corriger** au fil des évolutions de l'architecture.

![Le professeur Dumbledore utilisant un sort d'extraction de souvenirs]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/dumbledore_memory.jpg)

_Le professeur Dumbledore en pleine séance d'extraction de son model mental de l'architecture._

La modélisation, permet de construire une représentation non visuelle des éléments qui composent notre architecture, de décrire des applications, des personnes et leurs intéractions.

L'avantage de maintenir un modèle, est qu'il est possible de l'intérroger programmatiquement ou via une interface graphique pour générer des diagrammes en fonction de ce que l'on souhaite communiquer.

- Quelles est la liste des applications maintenues par notre société ?
- Quelles personnes utilisent telle application ?
- Quel protocole d'échange utilise-t-on entre ces deux applications ? 
- Quelles sont les services externes utilisés par telle application ?
- Sur quelles technologies repose mon application BackOffice ?
- Quels sont les composants métiers de telle application ?
- etc...

L'idée ici et de **séparer le fond de la forme** et d'accorder plus d'importance au contenu _(que l'on souhaite exhaustif)_, qu'au contenant _(nos futurs diagrammes)_.

![Filtrage du modèle d'architecture pour obtenir une vue correspondant à la question posée]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/c4model-filter.svg)

## Formalisme

Le modèle s'appui sur un ensemble d'abstractions utilisées pour décrire la structure d'un ou de plusieurs systèmes logiciels. 

Le modèle C4 s'intéresse a représenter des **systèmes logiciel** 
composés de **conteneurs**, scindés en **composants** qui s'expriment par du **code**. On matérialise également les **personnes** utilisant ces systèmes et les différentes **relations** qu'entretiennent les élements de l'architecture.

![Hiérarchie des éléments d'architecture du modèle C4]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/hierarchy.png)

## Notation

L'idée derrière le modèle C4 est de laisser peu de place à l'interprétation. Les diagrammes générés à partir du modèle doivent être **autoporteurs**; il ne doit pas être nécessaire de les accompagner d'une documentation ou d'un discours.

![Notation du modèle C4]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/notation.png)

- Chaque boite porte un **nom**, un **type** et une **description**.
- Chaque relation porte une **description** accompagnée si nécessaire de la **technologie** utilisée pour le transport de l'information quand il s'agit d'une relation technique.
- Les relations sont **unidirectionnelles**, et ce, pour éviter de masquer involontairement des intéractions.

## Les principaux diagrammes

On identifie 4 niveaux d'abstractions

### **Niveau 1**: System **Context** _(Contexte Système)_

![Modèle C4: Vue Contexte Système]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/system-context.png)

Ce diagramme permet d'obtenir la vision d'ensemble d'un système.

La boite centrale matérialise un système logiciel, entouré des ses utilisateurs et des systèmes avec lesquels il interagit.

**Element principal**: Un système logiciel.  
**Elements de support**: Des personnes, des systèmes en relation avec le système observé.  
**Audience**: Tout le monde.

### **Niveau 2**: **Container** _(Conteneur)_

![Modèle C4: Vue Conteneur]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/containers.png)

Une fois que l'on situe un système dans son environnement, la prochaine étape est de zoomer 
dans les frontières de ce dernier _(system boundaries)_ pour matérialiser les conteneurs qui le composent.

Un conteneur est un élément qui peut être exécuté/déployé individuellement comme:

- Une **Application Web**,
- une **API**,
- un **CLI**,
- une **SPA** (single page application),
- une **Application Mobile**,
- une **Base de Données**,
- un **Système de Fichiers**,
- etc...

**Elements principaux**: Des conteneurs au sein d'un système logiciel.  
**Elements de support**: Des personnes, des systèmes en relation avec les conteneurs observés.  
**Audience**: Intervenants techniques.

### **Niveau 3**: **Component** _(Composant)_

![Modèle C4: Vue Composant]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/component.png)

Quand on zoome sur un conteneur, on observe les composants nécessaires à son fonctionnement, ainsi que leurs intéractions.

On y retrouve:

- Les points d'entrée de l'application (controllers, cli, workers, etc...),
- les services métier (email, sécurité, gestionnaire d'équipements, etc...),
- et les couches d'accès à la données (repositories, message bus, api clients, etc...).

**Elements principaux**: Des composants à l'intérieur des frontières d'un conteneur.  
**Elements de support**: Des personnes, des conteneurs, et des systèmes externes directement attachés aux composants observés.
**Audience**: Architectes et développeurs.

### **Niveau 4**: **Le Code**

Pour finir, en zoomant sur un composant, on accède à son implémentation.

Pour décrire une implémentation, l'UML est le langage à privilégier sachant qu'à ce niveau de détail, on s'adresse essentiellement à des développeurs.

![Modèle C4: Vue Code]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/code.png)

Pour les traitements jugés triviaux (exemple: un CRUD), il est inutile de descendre jusque là.

Il est par contre utile pour visualiser des algorithmes ou des flux de travaux _(workflow)_ complexes.

Vous n'êtes pas obligé pour ce niveau d'utiliser systématiquement des diagrammes de classes, vous pouvez tout aussi bien utiliser [un diagramme d'activité](https://fr.wikipedia.org/wiki/Diagramme_d%27activit%C3%A9) ou encore un [logigramme _(flowchart)_](https://fr.wikipedia.org/wiki/Organigramme_de_programmation). 

## Les Diagrammes Secondaires

### Software Landscape _(Paysage Applicatif)_

![Modèle C4: Paysage Applicatif]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/landscape.png)

Permet de visualiser plusieurs applicatifs maintenus par l'entreprise et leurs intéractions avec des systèmes et des personnes qu'ils soient internes ou externes à l'entreprise.

### Deployment _(déploiement)_

![Modèle C4: Plan de Déploiement]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/deployment.png)

Fait correspondre les conteneurs (éléments individuellement déployables) à l'infrastructure matérielle du SI.

## Les outils

La page officielle du modèle C4 [référence déjà un certains nombres d'outils](https://c4model.com/#Tooling), mais c'est clairement sur [Structurizr](https://structurizr.com/) qu'il faut porter votre attention.

C'est actuellement le seul outil qui vous permet de modéliser et de maintenir un modèle d'architecture, via du code ([java](https://github.com/structurizr/java), [.net](https://github.com/structurizr/dotnet), [typescript](https://github.com/ChristianEder/structurizr-typescript) ou [php](https://github.com/structurizr-php/structurizr-php)) ou depuis son interface graphique et qui offre la possibilité de générer des diagrammes à partir de ce dernier.

![Logo Structurizr]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/structurizr-logo.png)

![Structurizr: Ajouter des éléments]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/structiruzr-edit-elements.gif)
_Ajout d'éléments via l'interface Structurizr_

![Structurizr: éditeur de styles]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/structurizr-edit-styles.png)
_Edition des styles via l'interface Structurizr_

![Structurizr: éditeur de styles]({{ site.baseurl }}/assets/2019-12-02-visualiser-l-architecture-de-vos-projets/structurizr-edit-views.png)
_Création de vues via l'interface Structurizr_

Le workflow de l'outil est le suivant: 

1. Vous renseignez votre **modèle d'architecture** _(éléments d'architectures, personnes et relations)_,
2. vous configurez des **règles de styles** qui s'appliquent en fonction du type d'un élément ou de leurs tags,
3. vous créez des **vues** (diagrammes) en interrogent votre modèle,
4. puis vous faites de la **mise en page** depuis l'interface graphique.

Si vous souhaitez décrire un projet Java, Structurizr propose également des extensions permettant:

- de faire de l'introspection sur une base de code pour extraire les composants d'architecture ([documentation](https://github.com/structurizr/java-extensions/blob/master/docs/spring-component-finder-strategies.md) et exemples pour [Spring](https://github.com/structurizr/java-extensions/blob/master/structurizr-examples/src/com/structurizr/example/SpringPetClinic.java) et [SpringBoot](https://github.com/structurizr/java-extensions/blob/master/structurizr-examples/src/com/structurizr/example/SpringBootPetClinic.java))
- d'utiliser des annotations pour déclarer votre modèle d'architecture ([documentation](https://github.com/structurizr/java-extensions/blob/master/docs/structurizr-annotations.md) et [exemple](https://github.com/structurizr/java-extensions/blob/master/structurizr-examples/src/com/structurizr/example/StructurizrAnnotations.java)).

## Dans l'épisode suivant...

Dans l'article suivant, je vous proposerai différentes astuces de modélisation, en attendant, je vous invite à [consulter la foire aux questions](https://c4model.com/#FAQ) du modèle 4C qui offre déjà pas mal de pistes de réflexions.
