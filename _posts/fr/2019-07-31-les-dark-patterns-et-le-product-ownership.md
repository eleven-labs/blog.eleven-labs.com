---
layout: post
title: "Les Dark Patterns et le Product Ownership"
lang: fr
permalink: /fr/les-dark-patterns-et-le-product-ownership/
excerpt: "Les Darks Patterns sont un ensemble de techniques utilisées sur des sites ou des applications numériques pour vous forcer à faire des choix que vous n'auriez pas fait consciemment. L'objectif de cet article est de faire prendre conscience aux concepteurs de produits numériques, et plus particulièrement les Product Owners et Product Managers, de la puissance qui se cache derrière les dark patterns et qu'un grand pouvoir implique de grandes responsabilités"
authors:
    - pbrenot
categories:
    - agile
tags:
    - agile
    - organisation

---


Les Darks Patterns (ou "design douteux", pour faire plaisir au -petit- Robert) sont un ensemble de techniques utilisées sur des sites ou des applications numériques pour vous forcer à faire des choix que vous n'auriez pas fait consciemment.
Le but de cet article n'est pas d'en faire une liste exhaustive, ni même d'aborder comment cela est devenu une norme, et encore moins de fustiger les entreprises et services qui les utilisent consciemment (je laisse cette lourde tache à un expert : [Harry Brignull](https://www.darkpatterns.org/)).
Mon objectif ici est de faire prendre conscience aux concepteurs de produits numériques, et plus particulièrement les Product Owners et Product Managers, de la puissance qui se cache derrière les dark patterns et "*qu'un grand pouvoir implique de grandes responsabilités*" ;).


## PETIT TOUR D'HORIZON DES GRANDS CLASSIQUES

Avant toute choses mettons de côté un instant le fait que la grands cadres de Facebook, Google, Instagram etc.. ont pour certains suivi des "cours" dans des instituts comme "Le Laboratoire des technologies persuasives" de Stanford et ont donc une connaissance assez étendue sur la capacité des nouvelles technologies à transformer des expériences en dark patterns. Cependant, tout le monde n'est pas diabolique et dans une certaine mesure ces dark patterns naissent suite à une multitude de choix fait indépendamment et qui une fois mis bout-à-bout donnent naissance à ces biais cognitifs.

Ci-dessous, je vous en dresse quelques-un pour vous en donner un aperçu (il en existe bien plus), que je ne détaillerai pas cette fois-ci.


### LE MENU
Si tu contrôles le menu, tu contrôles les choix.
Le fait de ne laisser à un utilisateur qu'une liste de choix rend très facile la possibilité de contrôler ses réponses. Et plus la liste est importante, plus l'utilisateur va penser qu'elle est exhaustive et ne pas chercher plus loin, pensant que ce sont là les seuls choix possibles, ou du moins les plus adéquats.
Ajoutez à cela un travail sur le wording, une priorisation de cette liste qui n'est pas transparente (algorithmes) et des choix de couleurs douteux, vous avez là un beau dark pattern. Des exemples ? Trip advisor.

### FEAR OF MISSING OUT SOMETHING IMPORTANT
C'est ce 1% de chance que nous avons de rater quelque chose si nous ne connectons pas immédiatement à un service, une appli, un site... ou si nous nous désabonnons.
C'est ce qui nous force inconsciemment à rester sur des réseaux sociaux, conserver des abonnements à des newsletters, et même swipper à l'infini sur Tinder (qui me dit que la prochaine personne ne sera pas celle que je cherche ?).
Il est très facile de jouer là-dessus, spécialement sur les applications.

### L' INTERMITENT VARIABLE REWARD
On l'appelle aussi le concept de la machine à sous. On regarde en moyenne 80 à 150 fois notre téléphone par jour. À partir de là, maximiser l'effet addictif d'une application est simple : il suffit de lier l'action d'un utilisateur (un swipe down, un refresh, un clic, une ouverture de page...) à une variable aléatoire qui aurait un pourcentage de chances d'offrir une récompense. L'effet addictif est immédiat et l'utilisateur s'enferme petit à petit dans un circuit de récompense qui est positif pour le business, certes, mais pas pour lui.
Un exemple  simple : sur 9gag ou instagram un swipe down (pour rafraîchir) ou une réouverture de l'application a un pourcentage de chance de faire remonter des publications anciennes, vues ou non (plutôt qu'un affichage chronologique simple). Combien de fois avez-vous inconsciemment réouvert ces applications après les avoir fermées 30 secondes auparavant ?

### LE SOCIAL APPROVAL ET LES CHOIX INCONSCIENTS
Notre besoin d'approbation est un des leviers de motivation les plus forts. Par des designs de suggestion, on peut manipuler les gens pour les faire créer des engrenages d’approbation sociale.  
Un exemple ? Sur Facebook, si je tag un ami dans une photo suite à l’apparition d'une pop-in qui m’interrompt, m'invitant à le faire, est-ce que j’ai fait un choix conscient ? Je réponds plutôt à une suggestion de Facebook... Je ne l'aurais peut être pas fait de moi-même via le bouton de bas de page. Une notification est envoyée à mon ami, c'est bon pour le business.
Il est très facile de contrôler cela et d'en faire des réactions en chaîne. Linkedin est très bon là-dessus : vous recevez une invitation de quelqu’un, vous l’acceptez, on vous recommande d'ajouter d'autres gens qui sont proches, et qui une fois qu'ils auront accepté rentreront dans le même processus. Est-ce que le choix est conscient ? A-t'il vraiment été souhaité par toutes ces personnes ou se sont elles retrouvées emprisonnées dans un contexte de réciprocité sociale en chaîne ?

### LE FOIE GRAS DE CONTENU
Un seul mot : Youtube.
Qui n'a pas passé des heures à vagabonder sur Youtube sans presque toucher son clavier ? C'est grâce à l'autoplay de la vidéo suivante. Vous êtes invité à consommer toujours plus de contenu, même quand vous n'en voulez pas plus.
Un autre exemple est celui de l'infinite scroll sur les sites internet de news : l'utilisateur ne sait pas quand s’arrêter, et tombe facilement dans du "zombie scrolling".

### INDISSOCIABILITÉ
C'est le fait de lier toutes les raisons de venir sur l’application ou le service avec la raison du business. Il s'agit en quelque sorte de  maximiser votre consommation de contenu.  
Par exemple sur Facebook, quand on veut regarder l’événement de ce soir, on est presque toujours obligé de passer par le feed des notifications ou par le feed d’actualité. Il y a de grandes chances pour que vous restiez sur ces pages pour consommer du contenu avant d'aller finalement voir cet événement.

### L'OPT-IN
Un très simple mais maintenant interdit : cocher par défaut des options qui vont générer des coûts, des actions, de l'engagement.

### LE CONFIRM SHAMING
On le retrouve assez souvent sur des sites d'actualités ou de commerce qui pensent ajouter une touche d'humour à un désabonnement, par exemple, en rajoutant de l'émotionnel dans un message du type "en vous désabonnant vous ne recevrez plus nos incroyables offres promotionnelles, vous verrez vous allez le regretter ;). Vous nous manquez déjà !".


## ET LE PRODUCT OWNER DANS TOUT CA ?

### PRÉVENIR PLUTÔT QUE GUÉRIR
Évidemment tout est question de contexte : vous ne pouvez pas arriver chez Pinterest en leur disant que les interruptions mises en place via des push notifications ne sont pas très éthiques et qu'il faudrait revoir leurs metrics business. Soyons réalistes.
Néanmoins, comme dit plus haut : certains dark patterns naissent de mauvais choix et/ou de l'agrégation d'une multitude de choix faits par différentes feature teams qui vont venir créer un dark pattern. Il est donc plus important d’évangéliser l'ensemble des concepteurs (développeurs, PM, PO, sponsors, testeurs...). Le simple fait d'informer de la nocivité de ces pratiques pour l'utilisateur (et potentiellement pour la marque sur le long terme) peut influer positivement et générer un changement.


### PROPOSER DES ALTERNATIVES ET CHALLENGER LES METRICS
Le Product Owner, bien qu'assez loin de la stratégie business, est garant de la mise en place opérationnelle (et donc de l'interprétation de la stratégie). Il est aussi au centre des interactions entre le métier, l'équipe technique, les designers et les UX. Il a toutes les cartes en main pour tirer la sonnette d'alarme sur l'implémentation d'une feature qui pourraient créer ou alimenter un dark pattern et y trouver une alternative.
dans un contexte AGILE, tout est encore possible à ce stade.
Bien souvent, les dark patterns sont créés dans un contexte où il fallait répondre à une contrainte business basée sur des metrics. Posez-vous la question (et posez leur aussi) : pourquoi chercher à augmenter le temps passé sur tel service de 2% ? Qu'est-ce que cela va générer ? La réponse sera souvent que cela va potentiellement créer plus de revenus (publicité, bien souvent). Mais est-ce que la modification demandée est la bonne (si dark pattern), ne pourrait-on pas améliorer plutôt telle feature de recommandation pour réduire la frustration de l'utilisateur et lui donner envie de rester de lui-même ? Lui donner une nouvelle raison de rester ?

Une autre option pourrait être de revoir les sucess metrics de la feature ou les metrics business. Que vaut vraiment le temps passé d'un utilisateur quand on sait que pendant une grande partie du temps il n'est pas "concentré" sur le service ou le produit ?
Il est d'ailleurs de plus en plus commun de penser qu'un business model basé uniquement sur l'engagement des utilisateurs ne survivra pas les prochaines années.


### REPENSER LE USER CENTERED DESIGN ET LES 4P
On a tous en tête le "Price, Product, Promotion, Place". Sachez que des Licornes (les start-up valorisées à plus de 1 milliards de $) sont en train de revoir ces principes et commencent à penser en : "People, Promise, Purpose, Principles".
Bien que j’entende tout le temps parler de "User Centered design", c'est encore bien trop souvent des designs non pas basés sur l'utilisateur, mais sur la valeur générée par l'utilisateur (à son propre détriment).
Qu'en conclure ? Regardez les grandes dernières actions de Google et Facebook du côté de la re-considération de la place de l'utilisateur et de son respect. Même les GAFA se posent les bonnes questions (suivies ou non d'actions, bien entendu), c'est le signe d'un changement à venir.
 

## CONCLUSION

Nous sommes tous responsables de ce que nous concevons, chacun à notre échelle.
Il est vrai que la notion de dark pattern est très liée à l'éthique, et sa vision est donc par conséquent très subjective.
Cependant, de plus en plus d'utilisateurs délaissent des services et des applications qui bafouent les règles éthiques, et effectuer un retropédalage pour ces grandes entreprises est souvent extrêmement couteux.
Ne soyez pas dans la réaction, soyez dans la pro-activité.

 

## RÉFÉRENCES

- https://humanebydesign.com/
- https://www.darkpatterns.org/
- http://www.lefigaro.fr/secteur/high-tech/2018/07/03/32001-20180703ARTFIG00220-les-dark-patterns-comment-les-technologies-nous-manipulent.php
- https://graphism.fr/mieux-comprendre-et-eviter-les-dark-patterns/
