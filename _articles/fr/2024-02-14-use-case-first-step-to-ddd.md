---
contentType: article
lang: fr
date: '2024-02-14'
slug: use-case-first-step-to-ddd
title: 'Le UseCase, la première étape vers le DDD'
excerpt: >-
  Le DDD, tout le monde en parle, la clean archi', tout le monde en parle. Mais dès qu'il s'agit de mettre les mains dans le code pour tout refacto, y'a sonneper.
categories:
  - php
authors:
  - aandre
keywords:
  - Bonnes pratiques
  - développement PHP
  - Symfony
  - Design Pattern
---

La clean archi' ou le DDD sont des termes qui vous parlent ? Ou pas d'ailleurs ? C'est probable.
C'est vendeur sur le papier, la solution a tous les miracles.
Dans un sens oui, c'est la solution à tous les miracles, dès lors que le projet a été pensé et réfléchi pour.
Dans un sens non, c'est votre pire ami en tant que dev, lead dev, lead tech, CTO, que sais-je encore ? *Hapiness-dev-lead-tech-core-cto-coordinator* ?

Et en même temps on ne va pas se mentir, très rares sont les projets business dans un contexte économique et financier ou l'aspect étude de projet et cahier des charges est financièrement intéressant (les gens du market là, qui répondent par les chiffres parce que "*les calculs sont pas bon Kévin*") pour votre direction ou votre client.

Fun fact, ils sont au moins responsable à 50% de votre dette technique.

## Pourquoi DDD, clean archi, et archi hexagonale ?

### Déjà pourquoi le mot archi ?

Au delà de *pisser du code*, comme vulgairement on nous décrit, on essaie de faire les choses bien. Ou pas. C'est au choix, mais autant les faire bien.

### DDD, CA, AH donc

Pourquoi on parle de clean archi, de DDD, d'archi hexa.

Personnellement j'englobe clean archi, archi hexa et DDD dans le même package. C'est trois notions complètement liées à leur échelle, et je dirais même que clean archi et DDD se marchent un peu sur les pieds (après chacun vois midi à sa porte).

Ces trois notions n'ont qu'un but : organiser des problématiques métier en workflows qui sont interprétables à la fois par le métier (d'un point de vue macro), et par les développeurs (d'un point de vue tech), tout en permettant à chacun de comprendre l'autre.
En effet, dans une entreprise, sauf si le métier est simple (spoiler alert: si c'est pas le cas, ça va le devenir bientôt), c'est impossible d'organiser en simple pattern MVC + CRUD. Ne vous laissez pas avoir par des librairies "magiques" qui font tout bien et mal.

### La dette technique du coup ?

C'est simple, le métier va venir avec une demande simple : "Créer un utilisateur depuis un backoffice".
Somme tout, effectivement c'est très simple, on est tout de suite tenté par la facilité.

Il y a une règle de base à savoir : le métier, va toujours revenir avec une demande supplémentaire. Votre code qui était simple, sera votre pire ennemi et votre pire ami.

Votre pire ennemi, parce que tout ça n'était pas prévu, ça en devient le foutoir dans le code, et donc dans votre tête (et vice-versa). Mais c'est aussi votre pire ami, plutôt que de vous imposer auprès du métier en disant "il faut revoir tout", vous allez ajouter de la complexité à votre code.

Et c'est là où la dette technique apparaît, le Legacy quoi.

### C'est bien mais on fait quoi ?

Peu importe si vous êtes junior, senior, developpeur, archi', consulté ou non pour des décisions, que ça soit du SCRUM, du cycle en V (ça existe encore en dev ???), du Kanban, ou de l'agile full-flex-over-the-top-subside ; il y a un ticket : la demande métier.
Dans votre tête, il y a deux tickets, l'investigation et la réalisation.

Ça n'est pas pareil quand c'est du legacy que lorsque c'est un projet récent qui potentiellement a été bien pensé.
Sur un projet bien pensé en amont la phase d'investigation c'est peut être 1h, et la réalisation une demi journée  (je parle pas en complexité, j'suis tout seul dans mon équipe, ça n'a aucun intérêt).
Sur un projet mal pensé ou legacy, la phase d'investigation peut être plus longue que la réalisation.

## Et le code dans tout ça ?

On y arrive, le préambule à tout ça me semblait essentiel pour structurer sa pensée.
La phase de réflexion est importante, et j'ai vu plein de projets se casser la tronche alors que plus ou moins bien pensé au départ pour le besoin.

"Ouais mais si j'ai pas le temps de faire la phase de réflexion ? Parce que je dois faire ça pour hier."

La réponse est simple, tout ce qui a été réfléchi est du temps en moins à développer sur du code de merde, et plus de temps pour penser le futur à moyen terme.
Personnellement je peux passer 6h à réfléchir tout en faisant un rubik's cube ou en écoutant de la musique, et on va venir me voir à 18h en mode "t'en es où ?" - "ben j'viens de finir ça m'a pris 1h de dev", ça fait partie du job.
En tout cas maintenant je le considère comme tel et j'ai plus de complexes avec ça. J'suis pas en train de dire qu'il faut faire de l'over-engineering non plus, le pragmatisme c'est la clé.

### On a toujours pas parlé de dev ?

Ah oui le dev. Vous voyez c'est important de poser les bases avant de faire du dev.

Posons un contexte tout bête, un UseCase métier : "en tant que vendeur je veux pouvoir enregistrer un client dans notre base de données".

On va prendre l'exemple en Symfony, c'est un peu les mots clés de l'article.
Il y a 10 ans tout le monde aurait dit "on a un controller, un service, puis le repository et pouf, ça fait des chocapics".
J'en vois encore du code comme ça... du code de 2023.

Je vois même du code "bah on fait tout dans le controller qui appelle le repository doctrine et c'est bon" (toujours du code de 2023).

Admettons que mon useCase métier évolue. De "en tant que vendeur je veux pouvoir enregistrer un client dans notre base de données", ce qui est toujours le cas. Mais, un nouveau useCase s'ajoute : "en tant que vendeur je veux pouvoir importer un fichier de clients toutes les heures qui vont êtres récupérés depuis un serveur".
C'est là où le bât blesse, là où le code peut devenir le meilleur ami et le meilleur ennemi. Tout réinventer dans un système basé sur Symfony ou un autre framework à base de commandes.
L'engrenage ; sans réflexion ; est déjà lancé. Une commande Symfony, un copié collé du code un peu adapté de ce qui a été fait dans notre "useCase" de base.

Jusque là ça peut encore fonctionner. C'est pas beau, mais ça fonctionne.

Je vais rajouter une règle métier pour le fun : "si cela vient d'un fichier client, il faut que j'applique au client une remise de 15%".
Si tout est fait dans un service, tout peut être centralisé, mais encore une fois j'ai vu du code de 2023 où cette règle métier était dupliquée dans une commande et dans un controller Symfony (ça pourrait bien être du python/django ou du java natif ça serait pareil).

C'est pernicieux.

### Et le dev dans tout ça ?

Il n'y aura pas de code dans cet article, ou très peu, les conventions de nommage sont propre à chacun, beaucoup ressortent en entreprise globalement de façon assez uniformes : les UseCase.

Un métier = un UseCase. Je parle de UseCase mais cela pourrait très bien être du CQRS, encore faut-il savoir exploiter le CQRS à bon escient.
Tout en sachant que l'archi hexa, le DDD, la clean archi, les useCase et le CQRS sont ultra compatibles (évitez l'over engineering quand c'est possible encore une fois).

### Et donc le dev, toujours pas ?

Je vais schématiser vulgairement sur un framework orienté Symfony.
Le but n'étant pas d'avoir du code mais des pistes de réflexions par rapport aux trois contraintes métier exposées plus haut :

C'est une visualisation personnelle que l'on peut totalement remettre en question :
```
MyApp/Application/Command/Customer/ImportCommand # 1 méthode pour appeler le useCase
 -> MyApp/Business/UseCase/CreateCustomers::handle($customers)
   -> MyApp/Business/UseCase/CreateCustomer::handle($customer)
MyApp/Application/Controller/Customer/CreateController
 -> MyApp/Business/UseCase/CreateCustomer::handle($customer) # 1 méthode pour appeler le useCase

MyApp/Business/UseCase/CreateCustomers::handle($customers)  # 1 foreach pour appeler le useCase CreateCustomer
  -> MyApp/Business/UseCase/CreateCustomer::handle($customer)

MyApp/Business/UseCase/CreateCustomer::handle(Customer $customer) # Règles métier à potentiellement dispatcher sur un un CommandBus ou une ChainOfResponsibility
```

C'est purement schématique, mais ça ne doit jamais plus être compliqué que ça.

## Conclusion

Je ne parle ici que de faire en sorte que de plusieurs règles métiers dupliquées un peu partout dans le code, on commence à épurer le code, pour avoir quelque chose de plus "clean" sur un legacy où un projet mal pensé à moyen/long terme.

À partir de ce moment, étapes par étapes, briques par briques, tout en documentant, vous aurez une meilleure perception du code que vous aurez soit hérité, soit mal conçu par manque de temps.
Et ce temps, vous allez pouvoir le reprendre en main pour faire les choses bien.

Je ne parle même pas ici d'isolation de code métier, même si c'est une première étape vers la clean archi.

Il y aura, quoi qu'il en soit un article à venir sur le découplage de votre code métier avec les frameworks. Si l'exemple sera pris avec Symfony et Doctrine cela vaut pour tous les langages.
