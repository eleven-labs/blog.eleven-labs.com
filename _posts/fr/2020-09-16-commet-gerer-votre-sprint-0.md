---
layout: post
title: "Comment gérer votre sprint 0 ?"
lang: fr
permalink: /fr/comment-gerer-votre-sprint-0/
excerpt: "Nouveau projet ? Lancement de produit ? Construction des fondations techniques du produit, mais pas que, comment gérer alors son sprint 0 ? On vous en dit plus par ici !"
authors:
    - mae
categories:
    - agile
tags:
    - agile
    - sprint
    - backlog

---

Nouveau projet ? Lancement de produit ? C’est l’heure de la phase de cadrage, autrement dit : le sprint 0 !
Construction des fondations techniques du produit, de la vision produit et business, mais pas que...

**Comment gérer ce fameux tout premier sprint ? **

Le sprint 0 est la phase de découverte des membres de l’équipe entre eux, mais aussi celle de la vision produit, business et de l’organisation.

Il n’aura pas forcément la même durée que vos prochaines itérations de sprint, et c'est tout à fait normal !
Par exemple, avec mon équipe actuelle nous fonctionnons en itération de 2 semaines. Notre sprint 0 a duré 3 semaines. Ce qui est un délai raisonnable pour cette phase d'initialisation d’un projet, qui comporte de nombreuses variables essentielles pour partir du bon pied.

Et ce qui est pratique, d'ailleurs, avec le sprint 0, c’est que le cadrage produit implique toutes ses parties prenantes ! De quoi occuper tout le monde pendant ce laps de temps.

## Que peut-on mettre en place dans un Sprint 0 ?

-   Nous pouvons nous pencher en tout premier lieu sur l’initialisation du backlog. Celui-ci est en effet le travail de l’ensemble des membres de l’équipe de développement, et pas seulement du Product Owner, même s'il en a la responsabilité.
Pour initialiser ce backlog, rien de plus idéal que de créer la “Customer journey map” en compagnie des représentants métiers & utilisateurs, puis le [story mapping de chaque utilisateur](https://blog.eleven-labs.com/fr/construire-le-story-mapping-de-votre-batmobile/) du futur produit ou de la future feature.

De là, un MVP pourra déjà être identifié, des US macro écrites et une première priorisation établie.
Cette initialisation du backlog va permettre à l’équipe de développement de se faire une idée plus claire de la vision produit et d’échanger avec le PO autour des premières user stories à embarquer. L’idée étant d’extraire de ces US ce que l’équipe peut “déjà” faire tout de suite techniquement.
Mais aussi de les éclairer sur un des premiers enjeux plus macro de ce sprint 0 : établir les fondations architecturales du produit.

-   C’est bien à cette occasion que l’[architecture technique](https://blog.eleven-labs.com/fr/livre-blanc-architecture-logicielle-tout-ce-que-vous-devez-savoir/) du produit doit être posée, et conçue de manière à pouvoir répondre aux spécifications fonctionnelles qui auront pu être approchées lors de l’initialisation du backlog. Elle doit prendre en compte les différentes communications et interactions de l’app avec d’autres services, internes comme externes dont l’équipe dont elle à connaissance à ce moment-là.
    
-   Dans la même veine technique, c’est aussi le moment tout choisi pour mettre en place la [CI / CD](https://blog.eleven-labs.com/fr/introduction-gitlab-ci/). De manière très simplifiée, il s’agit d'un processus d’automatisation d’intégration et de déploiement de code en continu, afin de pouvoir livrer sur différents environnements (de dév, de recette ou de production) le plus fluidement possible et à plusieurs développeurs. Attention, cela ne permet cependant pas de livrer "plus vite", mais surtout de le faire de manière plus sécurisé.
    
-   Le sprint 0 n’est pas juste une question de socle technique, mais aussi de fondation visuelle ! Le product designer va pouvoir rencontrer le métier, mettre en place des ateliers avec les utilisateurs, commencer à produire un [design system](https://blog.eleven-labs.com/fr/rex-le-design-system-leroy-merlin/) et pourquoi pas de premières ébauches de votre futur produit. Tout un travail en amont qui va permettre d'embarquer par la suite des développements sur une base saine et déjà validée !
    
-   L'écriture, en accord avec toute l’équipe, de la Défintion of ready (DOR) et de la Definition of done (DOD) des US de votre backlog est aussi un élément idéal à intégrer dans ce premier sprint. Tout le monde doit pouvoir ajouter ce qui lui semble pertinent, les éléments contraignants compris, dans chacune des deux définitions. Leur but commun est d’améliorer la qualité des livraisons à chaque itération du produit. Elles ne sont d’ailleurs pas figées dans le temps et peuvent (doivent) être améliorées par la suite pour mieux correspondre à l’organisation de l’équipe.
    
-   Enfin, le dernier élément qui se fera naturellement au cours de ce sprint, et qui selon moi a beaucoup d’importance sur le long terme, est qu’il va permettre au groupe de personnes impliquées sur le projet à devenir un équipe.
Ce temps de cadrage et de découverte est aussi idéal et permet à chacun de pouvoir se former sur un environnement inconnu, de se connaître mutuellement, de comprendre les forces et les faiblesses au sein de l'équipe, et d' apprendre à travailler ensemble. Il pose aussi les bases du fonctionnement agile à adopter.

## Pourquoi on aime le sprint 0 ?

-   Toutes les parties prenantes du projet sont concernées par le sprint 0 : le business, le sponsor, les représentants du métier, les utilisateurs, l'équipe de dév (développeurs, UX/UI (Product Designer), Scrum Master, Product Owner). Et on aime quand tout le monde est impliqué au même niveau !

-   Le sprint 0 est rassurant pour chacun des membres de l’équipe. C’est un sprint de préparation avant la réalisation. La roadmap est initialisée, le budget technique est posé, la conception fonctionnelle se dessine et les product designers peuvent commencer à préparer le terrain le plus en amont possible pour les développeurs. Développeurs, qui, accompagnés d’un architecte vont pouvoir établir le socle technique du produit.

## Qu'est-ce qu'on aime moins dans le sprint 0 ?

-   Il n’a pas toujours de valeur métier immédiate dans le sens où le sprint 0 n’a pas forcément de livraison à sa clôture.
    
-   Ce sprint a lieu, comme son nom l'indique, à l'initialisation du projet. Ce qui implique que les équipes doivent prendre les bonnes décisions au moment où la connaissance de l'environnement, des utilisateurs, de l’organisation projet et de chaque membre de l’équipe est au plus bas.
C’est également à ce moment que les engagements sont pris sur des mois, parfois même des années, notamment à travers la construction des “fondations techniques” du produit. 

Comment dans ce cas pallier au mieux ces problématiques ? 

## Conclusion

De mon point de vue, le sprint 0 représente un investissement essentiel et nécessaire pour que le produit puisse voir le jour dans les meilleures conditions possibles. Autant en terme de choix fonctionnels et techniques que pour souder l'équipe à travers la connaissance des points forts et points faibles de chacun de ses membres. 

Nous pourrions penser qu'une fois la phase de cadrage terminée et que le produit commence à être développé, le sprint 0 n'aurait plus lieu d'être. 

Il me semble pourtant pertinent que chacun puisse remettre en question l'architecture, les choix du design, la vision produit, l'organisation de l'équipe ou encore les DOD et DOR à tout moment du cycle de vie du produit.

C’est en itérant et en s'adaptant que l’équipe trouvera le fonctionnement le plus efficace et la production la plus qualitative possible. Pourquoi ne pas, à chaque itération où cela semblera nécessaire, intégrer un sprint 0 pour reparler cadrage, choix technique, et discuter du backlog ?
