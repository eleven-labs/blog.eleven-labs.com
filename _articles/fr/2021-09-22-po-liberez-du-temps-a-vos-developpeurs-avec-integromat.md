---
contentType: article
lang: fr
date: '2021-09-22'
slug: po-liberez-du-temps-a-vos-developpeurs-avec-integromat
title: 'PO : Libérez du temps à vos développeurs en faisant du NoCode avec Integromat'
excerpt: >-
  Vous faites partie d’une petite équipe, avec des features à sortir très
  rapidement et un PoC pour tester un produit, mais vous n'avez pas ou peu de
  connaissances techniques ? Le NoCode est fait pour vous !
cover: >-
  /assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cover.jpg
categories: []
authors:
  - marianne
keywords:
  - bonnes pratiques
---

En tant que PO ou chef de produit, vous pouvez développer vous-même certaines fonctionnalités qui peuvent être répétitives et peu motivantes pour vos développeurs et qui ont peu de valeur ajoutée. Cela permet aux équipes de se concentrer sur l'essentiel, tout en laissant plus de temps disponible pour réfléchir à l’architecture et aux différents challenges techniques. Pour tester une nouvelle idée et/ou un marché sans trop investir, un outil NoCode est une vraie solution.

J’avais déjà présenté l’[outil open-source n8n](https://blog.eleven-labs.com/fr/outil-low-code-automatisation-workflow-n8n/) qui permet de faire de l’automatisation Low Code, [Integromat](https://www.integromat.com/) permet d’aller encore plus loin en permettant de faire du NoCode, et donc d’être à la portée des non-tech.

Pour tester l’outil, un freeplan est proposé pour pouvoir faire ses premiers scénarios. Avec des premiers plans à des prix accessibles, il est facile de passer du PoC à une utilisation professionnelle.

Je vais proposer des fonctionnalités qu’on retrouve régulièrement dans un projet, et faire un comparatif développeur vs outil no-code integromat.

## Présentation de l’interface

![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/homepage.png)

On peut noter qu'Integromat a fait attention aux utilisateurs ayant un profil non technique en proposant une interface facile d’utilisation et assez intuitive.

Sur la page de fabrication d’un scénario, chaque noeud est représenté par une bulle : l’ajout et la configuration se font directement sur la page. Integromat permet de créer des structures de données (Data structures) et de stocker des données (Data Stores) que vous pouvez préparer en amont dans leurs propres menus pour ensuite les utiliser dans les scénarios.
Grâce à ces fonctionnalités, vous pouvez traiter et manipuler des données sans avoir besoin de base de données spécifique.
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/interface-noeud.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/OExHVQ9CRCw" frameborder="0" allowfullscreen></iframe>


## Cas 1 : Envoi d’un email pour activer une inscription

Vous commencez un nouveau site from scratch qui demande une inscription, et vous souhaitez envoyer l’email de confirmation.

Le scénario est assez simple : un webhook sur lequel l’application devra envoyer des données, et un serveur d’envoi d’emails.
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas1-scenario.png)
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas1-webhook.png)
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas1-mail.png)

> Dans les points positifs, c’est que vous êtes autonomes pour changer le template : pas besoin de développement supplémentaire et donc pas de mise en production à prévoir.

Vos développeurs devront quand même implémenter l'envoi de la requête au webhook.

### Si les développeurs devaient le faire

Ils auraient alors à installer et configurer un bundle/librairie pour la gestion d'email, puis créer et envoyer le mail. En plus du temps de développement et de review, il faut aussi tester.


### Pour aller plus loin

#### Sauvegarder l’information de l’envoi du mail

Après avoir envoyé l’email, il peut être intéressant d’ajouter cette information dans la base de données de votre application. Pour cela, vous pouvez soit envoyer l’information sur une route API d'update avec le noeud *HTTP*, ou directement modifier la ligne grâce au noeud correspondant à votre base de données.


#### Statistiques

Vous avez besoin de savoir combien de personnes se sont inscrites par jour, et au lieu de demander à vos développeurs de vous sortir les chiffres, vous pouvez intégrer les données dans un Google Sheet. Ensuite grâce aux fonctions intégrées vous allez pouvoir rajouter un +1 dans une cellule.

## Cas 2 : Création et impression de flyers personnalisés

Vous venez de créer votre site e-commerce, que ce soit via Shopify ou Prestashop. Pour vous démarquer de la concurrence, vous aimeriez sortir du lot en ajoutant un flyer personnalisé à mettre dans le colis avec [BannerBear](https://www.bannerbear.com/).

Pour l’exemple, je vais plutôt utiliser un webhook que directement un noeud de site e-commerce qui permet de récupérer l’information dès qu’il y a un nouvel événement.

![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas2-scenario.png)

> Comme pour le template d’email, vous êtes autonome pour le changer.

### Si vous deviez le faire “à la main”

Pour chaque client, il vous faudrait ouvrir un logiciel de traitement d’image, copier/coller le nom/prénom, pour ensuite l’exporter ou l’imprimer.

### Si les développeurs devaient le faire

Sans trop rentrer dans le détail, il y a plusieurs manières de créer une image, mais cela oblige à installer librairies et bundles sur votre projet. S’il faut en plus enregistrer l’image sur un drive, il faut aussi installer et configurer le bundle adéquat.

### Pour aller plus loin

#### Envoyer cette image par email

En plus de stocker l’image, vous pouvez en même temps l’envoyer par email.
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas2-aller-plus-loin.png)

#### L’impression

Au lieu de stocker l’image sur votre drive, vous pouvez directement l’imprimer grâce à l’application [PrintNode](https://www.printnode.com/fr).

## Cas 3 Advanced level : Traitement de fichiers CSV

Ce scénario permet d’aller plus loin dans integromat avec l’utilisation des Data Stores et Data Structures.
On veut traiter un CSV pour le spliter en plusieurs CSV pour être traités par des micro-services différents.
Vous pouvez brancher le trigger sur un *FTP* comme sur un *Google Drive*.

![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-scenario.png)

Entre les noeuds, il est possible de rajouter des filtres. Pour ne pas avoir d’erreur lors du traitement, j’ai rajouté la condition pour n'accepter que des documents CSV pour la suite.
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-filter-csv.png)


Après avoir téléchargé le document, pour être sûr du modèle et pour enregistrer les données à potentiellement utiliser dans un autre scénario, j’utilise le noeud *Data Store* qui va permettre de mapper chaque entrée du CSV en une entrée en base de données.
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-mapping-csv-data-store.png)


Pour mon besoin, j’ai besoin de créer 3 CSV différents en se reposant sur des Data Structures et de les enregistrer dans un dossier. Le noeud *Router* permet de paralléliser le travail.
![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-create-data-structure-product.png)

> Dans les points positifs, il y a l’autonomie sur les modèles : si l’entrée ou la/les sorties changent, vous pouvez mettre à jour facilement.

### Si les développeurs devaient le faire

Le traitement de fichiers CSV peut vite devenir fastidieux : connexion à un drive, téléchargement du fichier sur le serveur, lecture du fichier et de chaque entrée, vérification des données, enregistrement en base de données, création de chaque CSV et dépôt sur le drive. À vue d’oeil, on pourrait en faire un micro-service.

### Pour aller plus loin

#### Enrichir le CSV

Vous avez besoin de rajouter l’id de la marque ou un trigramme de couleur, mais la donnée n’est pas dans le CSV d’origine. Vous avez plusieurs solutions :

-   avec le noeud *HTTP*, vous pouvez faire un appel API

-   grâce au *Data Store,* vous avez une base de données à votre disposition que vous pouvez remplir grâce à un autre scénario

-   grâce aux noeuds de base de données vous pouvez requêter directement


#### Avertir l’équipe métier

Il existe plein de noeuds pour permettre la communication : à chaque traitement de nouveau fichier, un message slack sera envoyé pour prévenir l'équipe.
Il est même possible de prévoir le chemin en cas d’erreur lors d’un noeud.

![]({{ site.baseurl }}/assets/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-add-error-handler.png)


## Conclusion

Contrairement à n8n, integromat est un outil que vous pouvez essayer tout de suite, avec une prise en main facile et accessible même si vous n’êtes pas "technique".

En tant que développeuse, je suis pour le No/Low Code : ça me décharge de fonctionnalités peu intéressantes et me permet de ne me concentrer que sur celles qui demandent de la réflexion avec une forte valeur ajoutée.


## Source :

-   integromat: [site](https://www.integromat.com/) et [documentation](https://www.integromat.com/en/integrations)
