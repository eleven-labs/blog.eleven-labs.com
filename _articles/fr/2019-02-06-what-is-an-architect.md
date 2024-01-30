---
contentType: article
lang: fr
date: '2019-02-06'
slug: c-est-quoi-un-architecte-logiciel
title: Qu'est-ce qu'un architecte logiciel ?
excerpt: Ah tu es architecte c'est cool ça… Mais en fait ça consiste en quoi ?
oldCover: /assets/2019-02-06-what-is-an-architect/cover.jpg
categories:
  - architecture
authors:
  - pouzor
keywords:
  - développement
  - vulgarisation
---

Voilà une question qui m'a souvent été posée par mon entourage professionnel, mais aussi par ma mamie du cantal, pour qui l'IT se limite à son Windows XP et sa messagerie Orange.

Alors comment expliquer ce que je fais, sans entrer dans des détails trop techniques qui pourraient perdre mon interlocuteur ?
C'est d'autant plus intéressant que c'est le rôle quotidien de "l'archi" de vulgariser l'explication de ses choix, notamment pour les présenter aux responsables "fonctionnels". L'objectif de cette démarche de vulgarisation est de se faire comprendre, de faire comprendre les enjeux, le pourquoi et le comment.

J'étais tombé sur cet [article](https://blogue.genium360.ca/article/actualites/7-techniques-de-communication-en-matiere-de-vulgarisation-scientifique/) il y a quelques temps, et je pense qu'il présente très bien la manière dont on doit présenter aux néophytes notre métier.

Cette introduction mise à part, je vais à présent vous présenter le métier d'architecte logiciel, mais sans parler à un seul moment de technologies. À la place je vous propose une analogie avec l'architecture construction/btp. Comme ça, même votre mamie pourra comprendre ce que vous faites, et saisir l'importance de ce rôle dans la construction de logiciels (web).


## Le besoin

En général, comme tout bon projet, cela commence chez le Promoteur. Un client arrive, et il veut la maison de ses rêves. Mais avec ses rêves, il arrive aussi très souvent avec ses contraintes : son budget, ses délais, son terrain, sa localisation géographique (chaud, froid, site protégé...). C'est à cette première étape que l'architecte entre en action. Son but, dans un premier temps, est d'évaluer la faisabilité du besoin.

L'objectif : savoir si le besoin est réalisable au vu des contraintes. Le plus simple en général est d'utiliser le ratio qualité / coût / délai. Il est important de noter ici qu'on peut challenger le projet sur deux de ces contraintes, mais jamais sur les trois en même temps.

![Trium Vira]({BASE_URL}/imgs/articles/2019-02-06-what-is-an-architect/triumvira.png)


C'est à ce moment que l'architecte a la mission de challenger le besoin. Il n'est pas rare que le client arrive après avoir visité des maisons témoins :
"Je viens de visiter la maison `Spotify`, `Netflix` ou encore `Blablacar`, c'est génial je veux le même chose ! Je veux 3 chambres, 4 Salles de Bain et un séjour de 50m2, voici mon terrain et mon budget".

L'architecte doit alors essayer de faire comprendre que, avoir 4 salles de bain dans un 150m2 c'est pas l'idéal, ou alors qu'avoir un château en plein cœur de Paris, niveau budget ca va être compliqué.
Les contraintes sont nombreuses : taille et forme du terrain, localisation géographique, équipe de chantier, réglementations locales...
L'objectif est de cerner le vrai besoin, et si possible de s'inspirer de ces maisons témoins pour certains aspects de la maison (le mobilier de Spotify, ou les matériaux de Netflix) tout en respectant le triangle vertueux Qualité/Coût/Délais ainsi que ces contraintes.


## L'architecture

Une fois le cahier des charges bien défini avec les différents acteurs, l'architecte va passer à la réalisation des plans de la maison. Ces plans se décomposent en plusieurs parties :

### Les fondations

Les fondations constituent la partie la plus importante de la maison, et cela pour une raison simple : tout le reste va reposer dessus. Le choix des fondations est crucial car il sera quasiment impossible d'en changer une fois la maison construite. Elle doivent être choisies et dimensionnées en fonction de la construction (une tour n'a pas les mêmes fondations qu'une maison de plain-pied) mais aussi en fonction du terrain. Un terrain en pente, sur un sol sableux ou marécageux ne demandera pas le même type de fondation. Il est aussi intéressant en faisant les plans des fondations de s'intéresser au futur de la maison : est ce qu'il y aura un garage, une terrasse ? Ceci afin d'envisager ces possibles bouleversements futurs dès la réalisation du plan, même s'il ne s'agit pour le moment que d'une projection.

---
Vous l'aurez compris, ici la fondation est la base de données. Le choix est structurant, car il est vraiment très difficile de changer de type de BDD (SQL vers NoSQL par exemple) sans interruption de service ou sans changer de grosses parties du projet. En fonction des contraintes et du besoin, quel type de BDD choisit-on ? SQL, NoSQL, Graph ?  Comment la dimensionne-t-on ? (prévoir les usages futurs)


### Les murs

La deuxième partie, c'est le choix des matériaux et la position des murs. Les choix ici sont impactés par plusieurs éléments. Tout d'abord l'usage même de la maison, qui détermine le choix des pièces ou leur agencement. Mais aussi par des contraintes extérieures comme la position géographique ou le climat. Par exemple, on va privilégier le bois dans les zones froides et montagneuses car le bois supporte mieux le gel et les changements de température extrêmes. De la même manière, entre les maisons du Nord et du Sud de la France, les matériaux et les isolants seront différents car les écarts de températures ne sont pas les mêmes. On privilégiera par exemple des briques plutôt que du parpaing. L'intérieur lui est plutôt assujetti aux goûts du client : petites ou grandes pièces, murs nus ou peinture...

Hormis les murs porteurs, il est relativement simple de changer l'agencement des pièces, de séparer en deux les salles d'eau, de transformer un bureau en chambre. D'ailleurs de manière générale dans la vie d'une maison, ces changements arrivent relativement souvent. Une maison qui est vieillotte est souvent refaite à neuf quand des nouveaux propriétaires achètent la maison.

Le but de l'architecte est de pousser le client à se projeter dans l'avenir (arrivée d'enfants, agrandissement du salon avec une véranda...), et de répondre à ses besoins tout en les challengeant.

---
Ici, on fait le rapprochement entre les murs et pièces de la maison et les technologies que l'on utilise pour développer nos applications. Il y a des éléments que l'on évite de changer complètement. Pour les murs porteurs, on se contente généralement de changements cosmétiques, comme un coup de crépit ou de peinture. Il y a des parties de la maison qui avec le temps deviennent obsolètes et/ou dont l'usage n'est plus adapté et que l'on change complètement. Cela arrive de manière naturelle lorsque les normes changent, ou parce que les goûts et les matières évoluent avec le temps, comme pour les technologies utilisées dans un projet. Ces changements peuvent aussi faire suite à la reprise d'un projet par une nouvelle équipe, qui décide de tout "refacto".


### La toiture

Dernière partie de l'architecture, la toiture. Là on est moins soumis aux contraintes climatiques. C'est plus souvent l'harmonisation que l'on cherche, avec son quartier, ses voisins... Au final les choix se limitent à quelques "détails". Ici l'architecte doit simplement s'assurer que le toit soit à la bonne taille, ni trop grand, ce qui coûterait plus cher mais qui ne servirait à rien, ni trop petit. Il y a néanmoins une évolution dans l'architecture, grâce aux toits plats, ou "tuileless" qui permettent contrairement aux toits en pente de pouvoir agrandir sa maison dans n'importe quel sens, contrairement aux toits en pente où seul l'agrandissement dans la longueur est possible. Cela reste pour le moment moins répandu même si on voit de plus en plus d'architecture de ce style avec le temps.

---
Je pense que vous l'avez, ici la toiture c'est notre infrastructure. Globalement, on travaille depuis le début sur du "on-premise". Les impacts entre telle ou telle technologie sont négligeables, tant que cette infrastructure est à l'échelle du besoin actuel et des besoins à moyen terme.
Malgré tout, les nouvelles solutions cloud et serverless apportent du nouveau coté infra avec plus de flexibilité, afin de ne pas sur-approvisionner son infrastructure (et donc faire exploser ses coûts) avant d'avoir le nombre d'utilisateurs cible.


## La construction

Une fois les plans terminés et validés avec tous les acteurs, l'architecte va travailler étroitement avec l'équipe du chantier, notamment avec le chef de chantier afin de s'assurer que les plans soient bien compris par tous. Il interviendra tout au long du chantier jusqu'à la restitution afin de s'assurer que tout se passe correctement et que les plans soient respectés.

Il pourra aussi intervenir de manière ponctuelle en cas de problème ou de nouvelles demandes au cours du chantier afin de s'assurer de la bonne conduite de celui-ci.


## L'après

L'architecte pourra intervenir une fois le chantier terminé pour de potentiels agrandissements comme l'ajout d'un étage ou d'une véranda. Là, son objectif sera de s'assurer que ces "extensions" soit cohérentes avec le reste de la construction. Il pourra s'agir par exemple d'éviter de changer les matériaux ou les couleurs si le besoin n'y est pas. Il va devoir aussi s'assurer que ces "extensions" ne mettent pas en risque la construction existante. On pourra prendre l'exemple de la construction d'une cave sous la maison, qui pourrait poser un problème d'affaissement.

## En conclusion

Vous l'aurez compris, l'architecte intervient à de nombreuses étapes de la vie d'un projet, mais son implication au début de celui-ci est la plus importante. Il sera le garant de la viabilité du projet sur le long terme, ainsi que de sa cohérence.

Il y a d'autres contraintes non abordées ici, que l'architecte doit tout de même garder en tête, comme celles posées par la gestion des ressources humaines. Imaginons par exemple une technologie prometteuse pouvant faciliter l'exécution d'un projet. L'architecte se devra aussi de calculer le risque d'utiliser cette technologie, si peu de personnes compétentes sont disponibles sur le marché, par exemple.


Enfin, si vous souhaitez dans le futur exercer ce -fabuleux- métier d'architecte logiciel, voici quelques conseils sortis de ma besace :


### La veille

Elle est déjà importante pour les développeurs, elle devient indispensable pour les architectes. La différence ici est que cette veille doit être la plus large et cross-domain possible. Le rôle d'un architecte est de cadrer des besoins inexistants jusqu'à maintenant. La veille doit donc être le premier point d'observation du reste du monde, sur ce qui se fait ailleurs, et comment. Elle doit dépasser votre domaine de compétence afin d'élargir vos connaissances et non "juste" les améliorer.
Elle peut se faire sur internet mais aussi en échangeant avec d'autres personnes, comme lors de meetups.


### Le POC

On apprend toujours mieux en pratiquant. C'est aussi valable dans notre domaine. Vous avez découvert une nouvelle pratique ou technologie ? Alors lancez-vous et faites des tests. Ne vous arrêtez pas à un simple `hello world` mais essayez de trouver un use-case concret et mettez-le en œuvre. Evitez aussi de faire ça en production, sur un sujet critique ;)


### La remise en question

Certainement la partie la plus difficile, apprenez de vos erreurs, mais aussi des personnes meilleures que vous. Voyez cela comme un challenge que d'être capable de les surpasser et d'ajouter leurs compétences aux vôtres. Et surtout, *sortez de votre zone de confort*.


### Être agnostique

Enfin dernier point, ne vous attachez pas (trop) aux technologies. Apprenez les forces et les faiblesses de chacune et choisissez en fonction de ces critères factuels. Evitez la "hype train" : voir le [HDD](https://blog.daftcode.pl/hype-driven-development-3469fc2e9b22). Formalisez d'abord votre architecture de manière agnostique, puis choisissez chaque brique en fonction des contraintes et des besoins. Si vous souhaitez malgré tout partir sur une nouvelle technologie, mesurez les risques et communiquez dessus avec l'ensemble des acteurs.

![Hype Driven Development]({BASE_URL}/imgs/articles/2019-02-06-what-is-an-architect/hdd.png)
