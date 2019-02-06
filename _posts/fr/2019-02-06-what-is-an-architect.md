---
layout: post
title: Qu'est ce qu'un architecte logiciel ?
excerpt: Ah tu es architecte c'est cool ça… Mais en fait ça consiste en quoi ?.
authors:
    - pouzor
lang: fr
permalink: /fr/what-is-an-architect/
categories:
    - architecture
tags:
    - architecture
    - développement
    - vulgarisation
cover: /assets/2019-02-06-what-is-an-architect/cover.jpg   
---

Voila une question que l'on me pose souvent, au sein de mon entourage professionnel, mais aussi par ma mamie du cantal où l'IT ne se limite qu'à son Windows XP et sa messagerie Orange.

Alors comment leurs expliquer ce que je fais, et sans entrer dans des détails trop techniques qui pourraient les perdre. 
C'est d'autant plus intéressant que c'est dans le rôle quotidien de "l'archi" de vulgariser ses choix, notamment au niveau des responsables "fonctionnels" afin de se faire comprendre, et de faire comprendre les enjeux, le pourquoi et le comment.

J'étais tombé sur cet [article](https://blogue.genium360.ca/article/actualites/7-techniques-de-communication-en-matiere-de-vulgarisation-scientifique/) il a quelque temps, et je pense qu'il présente très bien la manière dont on doit présenter aux néophytes notre métier. Cette introduction mise à part, je vais à présent vous présenter le métier d'architecte logiciel, sans parler à un seul moment de technologies, et en utilisant l'analogie avec l'architecte/ure (construction/btp) afin que même votre mamie comprenne ce que vous faites, et l'importance de ce rôle dans la construction de logiciel (web).


## Le besoin

En général, comme tout bon projet, cela commence chez le PrOmoteur. Un client arrive, il veut la maison de ses rêves. Mais avec ses rêves, il arrive aussi très souvent avec ses contraintes : son budget, ses délais, son terrain, sa localisation géographique (chaud, froid, site protégé, ect). C'est à cette première étape que l'architecte entre en action. Son but, dans un premier temps, est d'évaluer la faisabilité du besoin.

L'objectif : savoir si le besoin est réalisable au vue des contraintes. Le plus simple en général c'est le ratio qualité / coup / délai. On peut challenger sur deux contraintes, jamais sur les trois.
![Trium Vira]({{site.baseurl}}/assets/2019-02-06-what-is-an-architect/triumvira.png)


C'est à ce moment que l'architecte a la mission de challenger le besoin. Ce n'est pas rare que le client arrive après avoir visité des maisons témoins : 
"Je viens de visiter la maison `Spotify`, `Netflix` ou encore `Blablacar`, c'est génial je veux le même chose ! Je veux 3 chambres, 4 SDB et un séjour de 50m2, voici mon terrain et mon budget".

L'architecte doit alors essayer de faire comprendre que, avoir 4 salles de bain dans un 150m2 c'est pas l'idéal, ou alors qu'avoir un château en plein cœur de Paris, niveau budget ca va être compliqué.
Les contraintes sont nombreuses: taille et forme du terrain, localisation géographique, équipe de chantier, réglementations locales…. 
L'objectif est de sortir le vrai besoin, et si possible de s'inspirer de ces maisons témoins pour certains aspects de la maison (le mobilier de Spotify, ou les matériaux de Netflix) tout en respectant le triangle vertueux Qualité/Cout/Délais ainsi que ces contraintes.


## L'architecture

Une fois le cahier des charges bien définit avec les différents acteurs, l'architecte va passer à la réalisation des plans de la maison. Ces plans se décomposent en plusieurs parties :

### Les fondations

La fondation est l'une des plus importantes parties de maison, et cela pour une raison simple : toute la maison va reposer dessus. Donc le choix de la fondation est vitale car il sera quasiment impossible de changer une fois la maison construite. Elle doit être choisie et dimensionnée en fonction de la construction (une tour n'a pas les mêmes fondations qu'une maison plein pied) mais aussi en fonction du terrain. Un terrain en pente, sur un sol sableux ou marécageux ne demandera pas le même type de fondation. Il est aussi intéressant en faisant les plans de la fondation de s'intéresser au futur de la maison : est ce qu'il y aura un garage dans le futur, une terrasse ect… et du coup de prévoir à l'avance ses informations dans le plan, même si ils ne seront réalisés que dans le futur.

---
Vous l'aurez compris, ici la fondation est l'analogie des bases de données. Le choix est structurant, car il est vraiment très difficile de changer de type de BDD (SQL vers NoSQL par exemple) sans interruption de service ou sans changer des grosses parties du projet. Et surtout en fonction des contraintes et du besoin, quel type de BDD on choisit (SQL, NoSQL, Graph ect…) et comment on la dimensionne (prévoir les usages futurs).


### Les murs

La deuxième partie, c'est le choix des matériaux et la position des murs. Les choix ici vont avoir plusieurs impactes, plutôt sur la vie même de la maison (choix des pièces, découpage) mais aussi peuvent être impactés par des contraintes extérieurs comme la position géographique. Par exemple, on va privilégié le bois dans les zones froides et montagneuses car le bois supporte mieux le gel et les changements de températures extrême. De la même manièere, entre les maisons au nord et dans le sud de la France, les matériaux et les isolants seront différents car les écarts de températures ne sont pas les mêmes. On privilégiera par exemple des briques plutôt que du parpaing. Pour l'intérieur, on est plutôt sur le gout du client: petites ou grandes pièces, murs nues ou peintures…

Hormis les murs porteurs, il est relativement simple de changer l'agencement des pièces, de séparer en deux les pièces d'eaux, de transformer un bureau en chambre, et d'ailleurs de manière général dans la vie d'une maison, ces changements arrivent relativement souvent. Une maison qui est vieillotte et souvent refaite à neuf quand des nouveaux propriétaires achète la maison.

Le but de l'architecte est de répondre aux besoins du client, tout en se projetant dans l'avenir et en challengeant le besoin auprès des clients (l'arrivé d'enfants dans le futur, l'agrandissement du salon avec une véranda…).

--- 
Ici, on fait le rapprochement entre les murs/les pièces de la maison et les technologies que l'on utilise pour développer nos applications. Il y a des éléments que l'on évite de changer complètement, comme les murs porteurs, ou l'on se contente de refaire une beauté par-dessus, comme un coup de crépit ou de peinture, et il y a des parties de la maison qui avec le temps deviennent obsolète et/ou l'usage n'est plus adapté et que l'on change complètement. Cela arrive de manière naturelle (les normes, les gouts et les matières évoluent avec le temps) tout comme les technologies mais aussi quand une nouvelle équipe reprend un projets, et qu'elle décide de tout "refacto".


### La toiture

Dernière partie de l'architecture, la toiture. La ici on est moins soumis aux contraintes climatiques hormis dans de rare cas. C'est plus souvent l'harmonisation que l'on cherche, avec son quartier, ses voisins et au final les choix se limites à quelques "détails". Ici l'architecte doit simplement s'assurer que le toit soit à la bonne taille par rapport à la maison, ni trop grand, ce qui couterait plus cher mais qui ne servirait à rien, ni trop petit. Il y a néanmoins une évolution dans l'architecture, grâce aux toits plats, ou "tuilleless" qui permettent contrairement aux toits en pente, de pouvoir agrandir sa maison dans n'importe quel sens, contrairement aux toits en pente ou seul l'agrandissement dans la longueur est possible. Cela reste pour le moment moins répandu même si on voit de plus en plus d'architecture de ce style avec le temps.

---
Je pense que vous l'avez, ici la toiture c'est notre infrastructure. Globalement, on travail depuis les débuts sur du "on-premise", et ou les impacts entre tel ou tel technologie sont négligeable par rapport au reste, tant que cette infra est à l'échelle du besoin actuel et des besoins à moyen terme.  
Malgré tout, les nouvelles solutions cloud et serverless apportent du nouveau coté infra avec plus de flexibilité, afin de ne pas sur-approvisionner son infrastructure (et donc ses coûts) avant d'avoir le nombre d'utilisateur cible.


## La construction

Une fois les plans terminés et validés avec tous les acteurs, l'architecte va travailler étroitement avec l'équipe du chantier, notamment avec le chef de chantier afin de s'assurer que les plans soient bien compris par tous. Il interviendra tout au long du chantier jusqu'à la restitution afin de s'assurer que tout se passe correctement et que les plans soient respectés.

Il pourra aussi intervenir de manière ponctuelle en cas de problème ou de nouvelles demandes au cours du chantier afin de s'assurer de la pérennité de celui ci.


## L'après

L'architecte pourra intervenir dans le futur (une fois le chantier terminée) pour de potentiels agrandissements comme ajouter un étage ou une véranda. La, son objectif sera de s'assurer que ces "extensions" soit en cohérence avec le reste de la construction, comme éviter de changer les matériaux ou les couleurs si le besoin n'y est pas. Il va devoir aussi s'assurer que ces "extensions" ne mettent pas en risque la construction existante. On pourra prendre l'exemple de la construction d'une cave sous la maison, qui pourrait poser un problème d'affaissement de celle ci.

## En conclusion

Vous l'aurez compris, l'architecte intervient à de nombreuses étapes de la vie d'un projet, mais son implication au début de celui est la plus importante. Il sera le garant de la viabilité du projet dans le long terme, ainsi que de la cohérence de celui-ci au vue du contexte où celui-ci se déroule.

Il y a d'autres contraintes non abordées dans cette vulgarisation que l'architecte doit garder en tête, comme celles des ressources humaines. Imaginons par exemple une technologie prometteuse pouvant facilité l'exécution d'un projet. L'architecte se devra aussi de calculer le risque d'utiliser cette technologie, si peu de personnes sont disponibles sur le marché pour l'employer.


Enfin, si vous souhaitez dans le futur exercer ce (fabuleux) métier qu'est celui d'architecte logiciel, voici quelques conseils sorties de ma besace :


### La veille

Elle est déjà importante pour les développeurs, indispensable pour les architectes. La différence ici est que cette veille doit être la plus large et cross-domain possible. Le rôle d'un architecte est de cadrer des besoins inexistants jusqu'à maintenant. La veille doit donc être le premier point d'observation du reste du monde, ce qu'il se fait ailleurs et comment. Elle doit dépasser votre domaine de compétence afin d'agrandir vos connaissances et non "juste" les améliorer.
Elle peut se faire sur internet mais aussi en échangeant avec d'autres personnes, comme lors de meetup.


### Le POC

On apprend toujours mieux en pratiquant. C'est aussi valable dans notre domaine. Vous avez découvert une nouvelle pratique ou technologie, alors lancez vous et faites des tests. Ne vous arrêtez pas à un simple `hello world` mais essayez de trouver un use-case concret et mettez le en œuvre. Evitez aussi de faire ça aussi en production, sur un sujet critique ;)


### La remise en question

Certainement la partie la plus difficile, apprenez de vos erreurs, mais aussi des personnes meilleurs que vous. Voyez cela comme un challenge, d'être capable de les surpasser et d'ajouter leurs compétences aux vôtres. Et surtout, *sortez de votre zone de confort*.


### Être agnostique

Enfin dernier point, ne vous attachez pas (trop) aux technologies. Apprenez les forces et les faiblesses de chacune et choisissez en fonction de ces critères factuels. Evitez la "hype train" voir le [HDD](https://blog.daftcode.pl/hype-driven-development-3469fc2e9b22). Formalisez d'abords votre architecture de manière agnostique, puis choisissez chaque brique en fonction des contraintes et des besoins. Si vous souhaitez malgré tout partir sur une nouvelle technologie, mesurez les risques et communiquez dessus avec l'ensemble des acteurs.

![Hype Driven Development]({{site.baseurl}}/assets/2019-02-06-what-is-an-architect/hdd.png)
