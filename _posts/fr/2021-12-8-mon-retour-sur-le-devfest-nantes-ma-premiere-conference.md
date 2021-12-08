---
layout: post
title: Mon retour sur le DevFest Nantes 2021, ma première conférence
excerpt: "Enfin ! Après 4 ans à pratiquer le métier de développeur, j'ai assisté pour la première fois à une conférence liée à mon métier et ma passion : le DevFest Nantes"
authors:
    - jbberthet
permalink: /fr/mon-retour-sur-le-devfest-nantes-ma-premiere-conference/
categories:
    - conference
tags:
    - conference
    - devfest
    - nantes
cover: /assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/devfest-logo.jpeg
---

Enfin ! Après 4 ans à pratiquer le métier de développeur, j'ai assisté pour la première fois à une conférence liée à mon métier et ma passion : le [DevFest Nantes](https://devfest2021.gdgnantes.com).

Pour la 9ème édition, qui s'est déroulée les 21 et 22 octobre, le thème était le _street art_. Le GDG (Google Developer Group) de Nantes et ses partenaires pour l'événement se sont donnés à fond et le rendu était splendide ! Des graffitis en veux-tu en voilà, des paniers de basket, des bières, des jeux vidéos et une cabine photo ont occupé le _lounge_ tout au long de l'événement.

## Qu'est-ce que le DevFest ?

Depuis 2012, le GDG de Nantes organise un festival dédié aux développeurs où plusieurs speakers parlent de sujets liés au monde du développement et de la technologie en général (_cloud_, système & réseaux, _data_, développement web et mobile, _soft skills_, etc...).

Pendant 2 jours, les _speakers_ partagent leur veille et leur expérience avec les passionnés pour leur donner leurs avis et conseils sur les technologies qu'ils ont essayé ou les sujets qu'ils ont expérimenté.

C'est aussi l'occasion de rencontrer et échanger avec des passionnés du numérique qui évoluent dans un environnement différent et d'étendre son réseau professionnel.

Cette année le DevFest a accueilli un peu plus de 2000 personnes par jour pendants 2 jours (incluant les _speakers_, les journalistes, les développeurs, etc...).

## Les talks auxquels j'ai assisté

### La keynote d'ouverture

_Par Antonin Fourneau_

![Waterlight Graffiti]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/waterlight-graffiti.jpeg)

<center><i><small>Credits: Antonin Fourneau</small></i></center>

Pour lancer les festivités, Antonin Fourneau a été introduit pour nous parler de son travail de "_designer_, artiste, développeur, _maker_, professeur", qu'il appelle "bricodeur".

Antonin est un artiste qui crée des oeuvres d'art en mélangeant de la vieille technologie et des objets. Son objectif est de rendre ces objets vivants grâce à la technologie, le tout à moindre coût.

Il nous a parlé de plusieurs de ses projets mais principalement de [Waterlight Graffiti](https://www.antoninfourneau.com/2020/09/10/waterlight-graffiti/), qui lui a valu son invitation au DevFest. Cette oeuvre est inspirée de l'art éphémère, qu'Antonin a pu observer lors d'un voyage en Chine, lorsqu'un calligraphe peignait les rues à l'eau. Avec la chaleur, l'eau séchait et l'oeuvre s'évaporait en plusieurs secondes. Il a alors reproduit le principe avec des _leds_ qui s'allument lorsqu'elles sont mouillées, puis s'éteignent lorsqu'elle sont sèches, pour créer Waterlight Graffiti.

Le travail d'Antonin est surprenant et fabuleux, vous pourrez trouver ses autres projets [sur son site](https://www.antoninfourneau.com).

### Tips pour combattre le syndrome de l'imposteur

_Par Aurélie Vache_

Le syndrome de l'imposteur est un sujet qui me touche. Souvent au pire moment, lorsque je fais face à des difficultés, cette petite voix me rappelle que ce serait facile pour les autres. Ce qui est saisissant, c'est que je ne suis pas seul: c'était aussi le cas d'un bon nombre des personnes qui ont assisté au _talk_.

Aurélie nous a rassuré. Elle a essentiellement expliqué que le syndrome de l'imposteur est lié au sentiment de ne pas être légitime. Elle a démontré que c'est une question de perception: nous pensons en savoir moins que les autres, et que nous sommes là où nous sommes grâce à la chance.

_SPOILER ALERT_: Ce n'est pas vrai.

Elle nous donne plusieurs astuces pour passer outre ce syndrome: lister nos accomplissements, trouver des communautés, partager/contribuer, demander du _feedback_, faire du _pair programming_ et positiver, bien évidemment !

Pour résumer, Aurélie nous a fait comprendre que la majorité des développeurs sont atteints par le syndrome de l'imposteur, qu'on peut le prendre en main et que **c'est normal de ne pas tout savoir**.

### Comment créer des jeux en pur CSS

_Par Elad Schechter_

![Coronavirus Invaders]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/coronavirus-invaders.jpeg)

Quand le confinement a commencé, Elad a préparé son appartement pour en faire un endroit où il se sent bien, où il pourrait rester enfermé toute la journée. Pendant un week-end entier, c'est exactement ce qu'il a fait et il s'est lancé dans la création d'un jeu lié à la situation sanitaire: Coronavirus Invaders. Le jeu et son code source sont [disponibles sur CodePen](https://codepen.io/elad2412/pen/wvabjXy).

Pour développer son jeu, il a utilisé plusieurs astuces HTML et CSS grâce auxquelles il n'a pas eu besoin d'utiliser Javascript:

-   Des éléments HTML `label` et `input:radio` pour définir les créatures à éliminer
-   Des élements HTML label et `input:checkbox` pour naviguer de page en page
-   La fonctionnalité CSS `counter` pour mettre en place un compte à rebours
-   Un formulaire HTML avec un `input:reset` pour retourner au menu principal
-   etc...

J'ai trouvé ce _talk_ très inspirant. Il m'a rappelé à quel point le développement est fun et que la seule limite à ce qu'on peut faire est notre imagination.

### Petit guide pratique pour commencer un design system

_Par Cecile Freyd-Foucault_

Quand et comment démarrer un _[design system](https://www.usabilis.com/design-system/)_ ?

C'est la question à laquelle Cecile répond tout en nous donnant une tonne d'astuces pour le démarrer. On sent qu'elle a beaucoup d'expériences, qu'elles soient bonnes ou mauvaises. Elle a pu apprendre de ses erreurs et elle nous explique en plusieurs étapes comment ne pas les reproduire et réussir notre _design system_.

Elle insiste sur le fait qu'il faille démarrer un _design system_ pour les bonnes raisons et en équipe (minimum un _designer_ et un développeur). Il faut expliquer pourquoi c'est nécessaire et convaincre sa hiérarchie tout en étant transparent (avantages, inconvénients, charge de travail et organisation).

Il faudra ensuite faire un inventaire, prioriser, documenter puis créer de l'engagement autour de ce design system, en interne puis en externe.

J'espère avoir l'opportunité de créer un design system au sein d'un projet futur, c'est un de mes objectifs en tant que développeur. Quand le jour viendra, je sais déjà que je pourrai ressortir mes notes et appliquer les précieux conseils de Cécile !

### Et si vous appreniez à programmer à vos enfants

_Par Stéphanie Moallic_

Je n'ai pas d'enfant, et j'étais pourtant très curieux à l'idée de voir le _talk_ de Stéphanie. Jusqu'alors, je n'avais aucune idée de comment aborder la programmation avec les plus jeunes. Stéphanie, elle, a une fille.

"Maman, c'est quoi ton travail ?" est une question qui lui a donc déjà été posée, et elle a entreprit de répondre à sa fille en la faisant participer à la programmation de jouets !

Stéphanie nous explique comment rendre la programmation ludique, grâce à du matériel et des technologies connectés entre eux qui nous permettent d'animer des jouets, des robots, etc... Grâce notamment à la carte _[micro:bit](https://fr.wikipedia.org/wiki/Micro:bit)_. Elle nous fait même la démonstration avec ses propres robots, voitures, et une maison Lego connectée !

Durant son _talk_, Stéphanie me fait me sentir comme un grand enfant et au final, j'ai très envie d'essayer tout ça. Et elle finira par l'avouer, c'est bien elle qui joue le plus avec tous ces jouets !

### React Query, le server state facile pour React

_Par Olivier Thierry_

En tant que développeur React j'attendais ce _quickie_ avec impatience. Olivier nous présente React Query, un gestionnaire d'état **serveur** (contrairement à Redux qui est un gestionnaire d'état **client**) développé par Tanner Linsley, bien connu pour ses contributions à la communauté ReactJS ([son GitHub](https://github.com/tannerlinsley) vous le confirmera).

Bref. Les principales fonctionnalités de React Query sont la synchronisation _front-end_/_back-end_, le _fetching_ REST/GraphQL, la gestion des états des requêtes, la gestion du cache et la mise à jour des données mise en cache. Pour profiter de ces fonctionnalités, plusieurs _hooks_ sont fournis par la librairie (`useQuery`, `useMutation` et `useQueryClient`).

Des fonctionnalités plus avancées sont également disponibles, comme les requêtes paginées, "voir plus", le _scroll_ infini, l'annulation des requêtes, etc...

Olivier a eu le temps de nous présenter les fonctionnalités principales avec du code et de nous énoncer les fonctionnalités avancées intéressantes, le tout en 15 minutes ! Chapeau à lui, car en si peu de temps, il m'a donné envie d'essayer React Query dans mon prochain side-project...

### Next.js à la rescousse de mon frontend

_Par Nordwin Hoff_

Next.js s'impose peu à peu comme le futur du développement _front-end_ performant en venant ajouter à React un serveur Node.js qui permet notamment d'effectuer du rendu côté serveur.

Nordwin effectue un léger rappel de ce qu'est Next.js et de ce que ça apporte à un projet (notamment les différents modes de rendu, le _lazy loading_, les composants intégrés, etc...) avant d'expliquer comment il l'a mit en place dans une _codebase_ existante.

Je ne vais pas entrer dans le détail car c'est assez spécifique. Cela dit, sa méthodologie pour nous présenter les fonctionnalités de Next.js a bien fonctionné puisque c'est appliqué à un cas pratique et réel auquel il est très facile de s'identifier.

Pour moi qui ne connait pas du tout Next.js, c'était un _talk_ très intéressant. Pour couronner le tout, Nordwin est un très bon orateur.

### Vue 3 et son écosystème

_Par Nicolas Frizzarin_

J'ai toujours été très intéressé par Vue.js sans avoir vraiment approfondi le sujet. J'ai bien sûr effectué les "_Hello world_" des premières versions, mais j'ai jamais pris le temps d'étudier les concepts avancés de Vue, raison pour laquelle j'ai assisté à ce _talk_.

Vue 3 semble s'inspirer de certains concepts de React pour optimiser son expérience développeur tout en conservant ce qui fait sa force: les performances.

La _Composition API_, les _reactive refs_, les _proxy handlers_, la _Suspense API_, les composants asynchrones, les librairies, etc... Tout y passe ! Nicolas donne tout son savoir sur un plateau, son _talk_ est très riche en informations. Seul problème pour moi, ça ressemble beaucoup à un comparatif Vue 2/Vue 3, mais mon peu de connaissances sur Vue 2 m'empêche de percevoir toutes les avancées effectuées. Un petit rappel m'aurait vraiment aidé à mieux apprécier le _talk_ qui m'a paru encore une fois hyper complet !

### Art & entropie: Du chaos dans ton front-end

_Par Thibaud Courtoison_

Je suis obligé de l'admettre, le titre m'attire, mais ne m'évoque rien. De quoi Thibaud va-t-il parler ? Je n'en sais rien. Et pourtant, il me tient, je vais assister à son _talk_.

Et qu'est-ce que j'ai bien fait ! Je découvre le _chaos engineering_, dont il explique les origines (Netflix, 2011), qui consiste - en gros - à péter des trucs pour regarder le comportements de l'infrastructure, de l'application, etc...

Aujourd’hui, le _chaos engineering_ est utilisé principalement côté infrastructure et _back-end_. Thibaud nous emmène avec lui dans l'expérimentation du _chaos engineering_ dans le _front-end_:

-   Perturbations des requêtes HTTP (que se passe-t-il se le CDN qui héberge les fichiers de style est _down_ par exemple)
-   Perturbation de la localisation (que se passe-t-il si la langue se lit de droite à gauche, ou si elle est très verbeuse ?)
-   Perturbation des timers (ajout d'un proxy sur `setTimeout` et `setInterval`)
-   Vérifications de l'historique (si un utilisateur clique sur précédent puis revient, est-ce que le formulaire est toujours rempli ?)
-   Que se passe-t-il si l'utilisateur double clique sur le bouton de soumission d'un formulaire ?
-   Accessibilité: le site l'est-il toujours avec l'ajout d'un filtre CSS `grayscale(100%)` ?

C'est la proposition de Thibaud pour mettre en place du _chaos engineering_ dans un _front-end_. Il le pousse dans ses retranchements, regarde comment celui-ci réagit, puis corrige.

## Ce que je retiens de cette première conf'

![Waouh]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/waouh.jpeg)

D'un côté, j'ai ressenti une ferveur lors de ces 2 journées dans laquelle je me suis engouffré et qui me faisait un peu regarder partout avec des yeux émerveillés. Tout me paraissait incroyable et tout le monde me paraissait accessible et bienveillant.

De l'autre, j'ai retrouvé lors des _talks_ le genre de présentations que j'avais déjà vu en vidéo, et que je trouvais super cool. De là où je bossais avant (nord-ouest Bretagne), j'avais le sentiment que ce monde était à part et très loin de moi. Je sais maintenant que c'est un monde accessible et carrément pas fictif !

Tout ça mêlé à la bonne compagnie que j'ai eu tout au long de l'événement - que ce soit lors des _talks_ ou à l'heure de l'apéro - m'ont permis de passer 2 jours hyper enrichissants professionnellement et personnellement.

Merci donc le GDG Nantes et Eleven Labs de m'avoir permis d'assister à ma première conférence ! 🚀

_See you soon!_
