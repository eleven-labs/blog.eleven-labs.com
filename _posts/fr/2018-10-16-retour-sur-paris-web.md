---
layout: post
title: Compte rendu Paris web
excerpt: Compte Rendu Paris Web
authors:
    - nicolas
permalink: /fr/compte-rendu-paris-web/
categories:
    - Conférence
tags:
    - Conférence
cover: /assets/2018-10-16-retour-sur-paris-web/cover.jpg
---

Née en 2006, Paris Web se qualifie comme la conférence « des gens qui font un web accessible et de qualité ». En marge des manifestations orientées principalement vers un public de développeurs, cet événement se distingue par des sujets souvent plus intimement liés à l’UX et l’intégration.   

On y parle ainsi W3C, prototypage, tests utilisateurs et performance, mais le spectre des thématiques proposées s’élargit bien au-delà de ce qui touche à la conception d’un site pour atteindre le Web dans son ensemble : sécurité, vie privée, gestion de projet, intelligence artificielle… La proposition est suffisamment diversifiée pour permettre même aux vétérans de découvrir quelque chose de nouveau chaque année.  

Paris Web est également indissociable de son engagement à promouvoir et mettre en oeuvre l’accessibilité, droit fondamental pourtant trop peu ou trop mal pris en compte sur les projets Web en France. En plus de proposer chaque année plusieurs conférences sur ce thème, chaque intervention est traduite en langue des signes, retranscrite par vélotypie et retransmise en direct sur le site de l’événement. À l’image du Web qu’elle défend, Paris Web se plie chaque année en douze pour rester ouvert à tous.  

L’événement se déroule habituellement sur trois jours. Les deux premiers, consacrés aux conférences, se tenaient cette année dans les locaux d’IBM à Bois-Colombes, au nord-ouest de Paris.   

Le troisième jour est quant à lui dédié à des ateliers, qui se sont déroulé à la Web School Factory dans le 13e arrondissement.  

Au menu de cette année, on comptait pas moins d’une trentaine de sujets différents. Pour faire tenir ce programme sur deux jours, les conférences étaient réparties dans deux auditoriums. On ne pouvait donc pas assister à toutes les présentations en un seul coup, et comme chaque année il a fallu faire des choix difficiles, mais il est heureusement toujours possible de se rattraper avec les vidéos en ligne. Ci-dessous un petit échantillon des conférences que nous avons retenues.


##Tempêtes de boulettes géantes##

**Avis de Martin**

Le bal des conférences s’est ouvert sur les boulettes. Pas les délicieuses boulettes de viande ou de soja qu’on met dans sa bolognaise, mais celles qui nous font transpirer de stress lorsque, après une commande tapée un peu trop vite en production ou le déploiement d’un bout de code non testé, on commet la faute qui fait basculer sa journée dans l’horreur.  

Agnès Haasser connaît bien cette situation. Après avoir effacé l’intégralité des livres dans la base de données d’un vendeur d’ebooks, elle s’est tournée vers Twitter pour recueillir les témoignages de ses confrères sur les pires bourdes commises dans l’exercice de leur fonction.  

Les réponses, nombreuses, aident à relativiser des erreurs qui restent humaines, et nous invitent à réfléchir sur la meilleure façon d’y faire face, et surtout de ne pas les reproduire.  

Agnès souligne l’importance de l’automatisation. Elle explique que dans tout cas de figure ou « à chaque fois que je fais X, je dois penser à faire Y », il y a une action à automatiser. Et que « si vous le faites souvent, ne le faites pas à la main ».  

Pendant la crise, il faut verbaliser le problème, demander de l’aide plutôt que d’essayer de le résoudre seul. Et pour ne pas le reproduire, prendre des mesures : tester, mieux différencier les environnements, et exploiter le pouvoir de la flemme pour rendre pénible les tâches les plus sensibles, avec des parcours longs ou des mots de passe de dix kilomètres.  

L’erreur fait partie de l’apprentissage et doit permettre d’améliorer son organisation plutôt que de culpabiliser les individus responsables. Comme le dit Agnès, «Les boulettes ne sont pas des échecs. La vraie erreur, c’est de répéter les échecs ».

https://www.paris-web.fr/2018/conferences/tempete-de-boulettes-geantes.php

**Avis de Stéphane**

Dès le commencement, le ton est donné. En effet, qui n’a jamais fait une grosse erreur en production ? Présentation d’un palmarès des plus belles boulettes 2018, et conseils pratiques pour se sortir au mieux de cette situation de crise et éviter de la reproduire, articulèrent la démonstration.

##Les WebExtensions, du rêve et du cauchemar##

**Avis de Martin :** 

J’avais déjà vu Daniel Glazman à dotCSS en 2015, où il était venu dénoncer le potentiel inexploité du CSS au-delà de sa fonction de mise en forme. Visiblement passé maître dans l’art d’exprimer ses frustrations, il est cette fois venu nous parler du beau bordel que sont les WebExtensions.  

Daniel connaît bien le W3C. Il a été co-président du CSS Working Group pendant près de dix ans, et sait probablement mieux que personne que la standardisation d’une API n’y est pas un long fleuve tranquille.  

Celle des WebExtensions en est un bon exemple. Conçue pour tenter d’unifier l’implémentation des extensions à travers les différents navigateurs, elle se heurte aujourd’hui à de pénibles différences d’implémentation, quand elle n’est pas tout simplement inexistante, comme c’est le cas sur Safari et la totalité des navigateurs mobile.  

Mais même dans un éventuel contexte d’implémentation universelle, l’API en elle-même impose de sérieuses limitations. De XUL, langage hyper-puissant qui poussait très loin les possibilités de personnalisation dans Firefox, on a basculé à HTML, moins puissant, moins natif. La course à la sécurité entraîne avec elle son propre lot de restrictions, heurtant les extensions aux barrières du sandboxing et des permissions. Enfin, tout accès à des éléments système tels que les caméras, microphones, ports USB et autres lecteurs d’empreinte est tout simplement impossible.  

Aujourd’hui, la spécification semble être tombée dans le coma. Sa dernière mise à jour remonte à plus d’un an, et son rédacteur ne veut plus en entendre parler. Bref, le jour où les extensions Web deviendront universelles est encore très, très loin.

https://www.paris-web.fr/2018/conferences/les-webextensions-du-reve-et-du-cauchemar.php

**Avis de Stéphane**

Le sujet était vraiment intéressant, surtout le petit cours d’histoire sur les add-ons qui ont longtemps fait le succès de Firefox (Mozilla). Mais difficile d’en ressortir du positif tant la présentation était orientée principalement sur les problèmes rencontrés, et non sur les perspectives d’avenir et les évolutions possibles.

##L’IA et la fin du Silicium : introduction aux ordinateurs quantiques##

**Avis de Martin**

David Rousset de Microsoft, que je connaissais jusque-là pour ses démos HTML5 et son framework BabylonJS, est venu nous parler d’intelligence artificielle et d’ordinateurs quantiques. Il nous explique que, si les algorithmes de machine learning et de deep learning ne sont pas nouveaux, l’explosion de la puissance de calcul des ordinateurs et l’avènement du Big Data leur a donné l’essor qu’ils ne pouvaient pas avoir à l’époque. Mais à l’heure où la finesse de gravure dépasse l’indécence, les techniques actuelles d’augmentation de la puissance de calcul s’approchent de leur limite. Et c’est là que les ordinateurs quantiques entrent en scène.
Et non, je ne résumerai pas les bases de la physique quantique dans ce paragraphe, mais jetez un oeil à la conférence si le sujet vous intéresse.

**Avis de Stéphane**  

À la lecture du titre de cette conférence, je me demandais réellement si j’avais fait le bon choix en y assistant. Le sujet m’était complètement inconnu. Mais l’orateur m’a rapidement mis à l’aise puisqu’il a avoué lui-même ne pas en être un spécialiste. Bravo à lui car sa présentation fut passionnante, avec des passages historiques, ludiques, et drôles.

https://www.paris-web.fr/2018/conferences/lia-et-la-fin-du-silicium-introduction-aux-ordinateurs-quantiques.php


##La donnée graphique avec HTML et CSS##  

**Avis de Martin**

Gaël Poupard revient à Paris Web pour nous démontrer qu’en appliquant le principe de moindre pouvoir, on peut dès aujourd’hui réaliser toutes sortes de diagrammes sémantiques et accessibles dans le DOM, avec beaucoup de CSS et un minimum de JS.  

La conférence est ponctuée de bouts de codes et d’exemples visuels qui guident pas à pas vers la réalisation d’élégants diagrammes en barre, d’un magnifique camembert, et même d’un donut très sexy, le tout entièrement rétro-compatible et absolument accessible. Un bel exemple d’amélioration progressive qui devrait tous nous inspirer.

https://www.paris-web.fr/2018/conferences/la-donnee-graphique-avec-html-et-css.php


##Dear developer, the Web isn’t about you##

Développeur front-end senior chez Springer Nature à Berlin, Charlie Owen met les pieds dans le plat dès le titre de sa conférence, et nous rappelle quelque chose qu’on semble oublier trop souvent : nous ne faisons pas le Web pour nous, mais pour ses utilisateurs.  

Charlie nous rappelle brièvement l’histoire du Web et de ce qui le caractérise : libre et ouvert, parfois accaparé et propriétarisé par certains navigateurs, puis de nouveau libéré par d’autres. L’arrivée de l’iPhone en 2007 a tout bousculé et nous a ouvert à la diversité. Il fallait alors adapter nos sites pour offrir une expérience qui n’exclurait personne, et les technologies se sont adaptées pour répondre à ce besoin.  

Mais que reste-t’il de ces bonnes intentions aujourd’hui ? Dans une époque où la vitesse du réseau s’améliore à toute allure dans les régions les plus aisées du monde, et où la puissance de calcul de nos appareils augmente pour qui a les moyens de se les offrir, nous sommes en train de tomber dans le piège de la surenchère technique, basculant dans une perte de conscience des conditions de navigation réelles de nos utilisateurs.  

Le téléphone le plus commun au monde n’est pas le dernier iPhone, ni celui de l’année précédente ou même celui de l’année d’avant. La 4G ne couvre pas l’ensemble du territoire mondial comme il couvre la ville de Paris. Et pourtant, on a tendance à considérer que toute condition de navigation qui n’est pas idéale est un cas extrême. La conséquence, c’est que la taille moyenne d’une page Web est de 3 Mo aujourd’hui, et qu’il faut en moyenne 12 secondes pour l’afficher en 3G.  

Notre façon de concevoir les sites, ainsi que la multiplication des librairies JS comme React, nous a progressivement conduit à accepter le JavaScript comme étant toujours activé par défaut. Il existe pourtant plusieurs cas de figure dans lesquels ce n’est pas le cas, et nous condamnons les utilisateurs concernés à ne pas pouvoir utiliser nos services.  

Dans un timing presque parfait, cette conférence se pose comme un complément admirable à cet article récent sur le « désenchantement logiciel » http://tonsky.me/blog/disenchantment/. Les solutions existent, mais il faut revoir notre philosophie de travail. Comme Gaël Poupard l’expliquait plus tôt, il faut appliquer le principe de moindre puissance, concevoir progressivement, et surtout arrêter de supposer que nos utilisateurs ont majoritairement des téléphones de dernière génération et sont parfaitement desservis par leurs opérateurs. Pensons un peu moins aux gens qui font le Web, et un peu plus à ceux qui l’utilisent.

**Avis de Stéphane**

Ou comment apprendre à développer pour les autres, qui ne nous ressemblent pas.

Le postulat de départ était le suivant :  tout le monde n’a pas le même accès à l’évolution des technologies. Et certains ont des difficultés financières ou font face au monde via un handicap ou une barrière quelconque.

Dans un projet Web, on doit penser à tous les utilisateurs et ne laisser personne de côté.

En tant que développeur, notre mission n’est pas de coder pour notre propre plaisir personnel, en utilisant la dernière technologie à la mode. Notre rôle est de réaliser des projets accessibles au plus grand nombre.

Comme l'a précisé clairement l’oratrice, si on code avec empathie, simplement, et en adhérant aux normes Web, on pourra créer des sites utilisables par tous. Des sites robustes face à tout ce qui est étrange.

Cette présentation m’a réellement conforté dans ma vision de mon métier.

https://www.paris-web.fr/2018/conferences/dear-developer-the-web-isnt-about-you.php


##Les jeux vidéos sont-ils des logiciels comme les autres ?##

Enseignant-chercheur au Conservatoire National des Arts et Métiers, Jérôme Dupire nous décrit les challenges auxquels font face les concepteurs de jeux vidéo dans leur quête d’accessibilité, et établit un parallèle avec les contraintes familières du Web.  

L’une des principales difficultés réside dans la diversité des genres de jeu, dont les interfaces et les méthodes de contrôle varient d’un jeu à l’autre. Les jeux sont aussi multi-modaux, c’est-à-dire qu’ils peuvent nécessiter une implication visuelle, orale, gestuelle, spatiale et / ou linguistique de la part du joueur.  

Les jeux vidéo, comme tout type de jeu, fixent généralement un ou plusieurs buts que le joueur doit atteindre. Les conditions à remplir font souvent l’objet d’un réglage méthodique afin de trouver un équilibre entre difficulté et plaisir de jeu. Cette étape, cruciale pour assurer l’engagement du joueur, est parfois difficile à mettre en oeuvre en raison de la diversité des individus.  

Les solutions varient donc autant d’un type de jeu à l’autre que d’un individu à l’autre. D’un point de vue logiciel, certains développeurs proposent de reconfigurer les touches, de modifier les couleurs, de régler manuellement la difficulté, ou encore d’automatiser les actions qui requièrent de la précision.  

Et d’un point de vue matériel, des appareils existent pour répondre aux besoins spécifiques des utilisateurs, comme des micros pour contrôler les jeux avec la voix, et des souris à haute-précision qui limitent la nécessité d’effectuer de grand mouvements. Dans le monde des consoles, Microsoft a pris une initiative majeure en sortant une manette accessible, à laquelle on peut brancher un appareil différent pour chaque bouton d’une manette traditionnelle.  

À l’instar du Web, un référentiel d’accessibilité existe pour les jeux vidéo intitulé Game accessibility guidelines : http://gameaccessibilityguidelines.com. Les jeux vidéo ont également été inclus dans la loi américaine pour l’accessibilité des nouvelles technologies, le CVAA (21st Century Communications and Video Accessibility Act).

https://www.paris-web.fr/2018/conferences/les-jeux-video-sont-ils-des-logiciels-comme-les-autres.php


##Les objets connectés liés à la santé portent-ils atteinte à la vie privée ?##

**Avis de Martin**  

L’année dernière, Emmanuelle Aboaf a reçu la greffe de son deuxième implant cochléaire. Elle nous raconte sa surprise quand, lors d’une visite chez son practicien, elle découvre que son appareil transmet à distance une foule de données sur son usage : durée d’utilisation, environnement sonore, heures du port de l’implant… Des informations collectées sans demande de consentement de sa part.  

L’exemple d’Emmanuelle n’en est qu’un parmi d’autres. Elle nous explique qu’aujourd’hui, presque tous les implants sont devenus des objets connectés, géolocalisés et synchronisés à distance. Il y a de vrais avantages, comme la possibilité pour un pacemaker de rapporter une anomalie cardiaque à distance pour anticiper une crise, mais ils s’obtiennent au prix de la vie privée. Un problème d’autant plus grave que les porteurs d’implants sont généralement dépendants de leur appareillage. La moindre des choses serait donc d’informer le patient de l’usage de ses données, de leur appartenance, et lui permettre de donner son consentement avant l’opération.

https://www.paris-web.fr/2018/conferences/les-objets-connectes-lies-a-la-sante-portent-ils-atteinte-a-la-vie-privee.php


##L’UX du X##

**Avis de Martin**

Cette année à Paris Web, il y avait aussi un peu de sexe. **Quentin Bouissou**, UX designer senior chez UX Republic, aborde sans décontenance une industrie confrontée à des challenges intéressants en matière d’expérience utilisateur.  

Comme toute industrie, celle du porno a besoin de comprendre les envies de ses clients pour répondre à leurs besoins. Quentin a mené sa propre enquête au sein de son entourage pour relever les différentes raisons qui poussent les gens à consommer ces contenus, et les réponses, variées, expliquent le trafic que connaissent ces sites.  

Il note également que, si le porno innove peu, il s’approprie très rapidement les innovations technologiques, de l’imprimerie jusqu’à la réalité virtuelle, ainsi que les phénomènes culturels comme la Coupe du Monde. Il s’adapte ainsi à nos vies de tous les jours, se rend disponible sous plusieurs formes et reste à l’écoute du monde extérieur.  

Quentin aborde aussi les objets physiques, qui se présentent sous de multiples formes pour de multiples usages : objets connectés, jouets, poupées… La co-conception, qui consiste à concevoir une réponse à un besoin plus spécifique, est également évoquée.
En prenant pour exemple une industrie tabou, Quentin nous explique que faire de l’UX, c’est faire face à des a priori qu’on ne peut briser qu’en allant au contact des gens. C’est aussi penser à la problématique avant la solution, sortir des idées reçues, rester curieux, et tester, tester, tester.

https://www.paris-web.fr/2018/conferences/lux-du-x.php


###[Le W3C pour les développeurs Web](https://www.paris-web.fr/2018/conferences/le-w3c-pour-les-developeurs-web.php){:rel="nofollow noreferrer"} par Dominique Hazael-Massieux

**Avis de Stéphane**

Présentation sous forme de dialogue entre le W3C et Paris Web, pour exposer les différentes actions du W3C et des outils mis en place pour interagir avec la communauté des développeurs Web dans le processus de standardisation.


###[UX en Terre Inconnue](https://www.paris-web.fr/2018/conferences/ux-en-terre-inconnue.php){:rel="nofollow noreferrer"} par Sébastien Desbenoit

**Avis de Stéphane**

La présentation était axée sur les méthodologies utilisées au quotidien en expérience utilisateur qui permettent également de débloquer des situations, et de faire avancer des projets dans un contexte que l’on ne connaît pas et un périmètre inhabituel. L’orateur a évoqué les actions à mener en cas de difficultés, voire de conflits entre différents intervenants d’un projet. En résumé, un sujet ancré dans la réalité, et une ode à l’adaptabilité.

Un [tweet de Marjorie Delrieu](https://twitter.com/MarjorieDelrieu/status/1047807455084916737){:rel="nofollow noreferrer"} présente une synthèse visuelle de cette conférence.

##[La donnée graphique avec HTML et CSS](https://www.paris-web.fr/2018/conferences/la-donnee-graphique-avec-html-et-css.php){:rel="nofollow noreferrer"} par Gaël Poupard

**Avis de Stéphane**

Comment présenter des données sous forme de graphique uniquement avec HTML et CSS, sans utiliser de librairie JavaScript ? Le sujet et la démonstration étaient au niveau de mes attentes en tant qu’intégrateur. Mais j’étais un peu déçu sur la forme car cela ressemblait à une explication de code.  

##[Le W3C pour les développeurs Web](https://www.paris-web.fr/2018/conferences/le-w3c-pour-les-developeurs-web.php){:rel="nofollow noreferrer"} par Dominique Hazael-Massieux

**Avis de Stéphane**

Présentation sous forme de dialogue entre le W3C et Paris Web, pour exposer les différentes actions du W3C et des outils mis en place pour interagir avec la communauté des développeurs Web dans le processus de standardisation.

##[L’accessibilité au-delà des spécifications](https://www.paris-web.fr/2018/conferences/L-accessibilite-au-dela-des-specifications.php){:rel="nofollow noreferrer"} par Hugo Giraudel

**Avis de Stéphane**  

Comment prendre en compte l’accessibilité dès le démarrage d’un projet et son rapport au design inclusif ? Sujet intéressant mais trop vaste pour une présentation de courte durée.


Toutes les conférences sont visibles sur cette page : https://www.paris-web.fr/2018/
