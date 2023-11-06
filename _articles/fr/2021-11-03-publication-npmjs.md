---
contentType: article
lang: fr
date: '2021-11-03'
slug: publication-npmjs
title: Développer et publier un paquet sur npmjs
excerpt: >-
  Dans cet article, nous allors voir ensemble comment développer et publier un
  paquet sur npmjs.
categories:
  - javascript
authors:
  - ygherbi
keywords: []
---
![logo-npm]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/npm-logo.png)  
  
  
De nos jours, en tant que développeurs front nous sommes constamment confrontés au fait d’utiliser des librairies.
Une librairie publiée sur npmjs se nomme un paquet, et nous les installons au moyen de npm.
Ils sont principalement là pour nous faciliter le quotidien : un paquet répond à un besoin, ce qui évite d'avoir à sans cesse réinventer la roue.

Aujourd’hui nous allons voir ensemble comment développer et publier un paquet sur npmjs.
L’objectif de cet article est de vous apprendre par l’exemple, nous allons donc développer ensemble un paquet qui permet de générer des données utilisateurs aléatoirement.

## Prérequis :

Avant toute chose, vous aurez besoin pour commencer d’un compte npmjs, que vous pouvez créer [ici](https://www.npmjs.com/signup).

**Note très importante :** confirmez votre compte en cliquant sur le lien du mail de npmjs sinon vous ne pourrez pas publier votre paquet.

NodeJs : pour vérifier que node est bien installé, lancez la commande suivante.

- `node -v`

Vous devriez avoir ce résultat (pas forcément la même version)

![node-v capture]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/node-version.png)

L'usage de Git est quant à lui optionnel.


## **SOMMAIRE**

PARTIE 1 : **Développer son paquet**

PARTIE 2 : **Tester son paquet**

PARTIE 3 : **Publication du paquet**

PARTIE 4 : **Versioning**

PARTIE 5 : **Conclusion**



## PARTIE 1 : Développer son paquet

### a/ Rappel des notions de base

Npm permet d’automatiser la gestion des dépendances et des paquets dans les projets javascript.
Un “package” ou “paquet” ou encore “librairie” est un bloc de code composé de fonctions/classes qui permettent d’effectuer des tâches.

Utiliser un paquet permet de ne pas avoir à réinventer la roue et ne pas coder tout soi-même. Quand d’autres développeurs ont déjà développé une fonctionnalité, pourquoi ne pas la réutiliser ?

Un paquet est généralement accompagné d’une documentation afin que les utilisateurs s’y retrouvent.

Ça, c'était pour la partie théorique, passons maintenant à la partie pratique.

### b/ Développer son paquet

#### Étape 1 :

Créez un dossier avec le nom « tutorial-paquet-npm » et placez-vous dans le dossier.
Prenez votre terminal et lancez les commandes suivantes :

Créez le dossier : `mkdir tutorial-paquet-npm`

Entrez dans le dossier : `cd tutorial-paquet-npm`

#### Étape 2:

Créez un fichier package.json

`npm init -y`

Le fichier package.json aura comme contenu le nom du projet, la version, son auteur, une description, les dépendances et d’autres informations.
Ajoutez ceci dans votre package.json

````json
"type": "module",
````

Votre package.json devrait ressembler à ceci :

![paquet package.json init]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/paquet-package-init.png)

Si vous ne souhaitez pas publier votre paquet sur github/gitlab passez à l’étape 4.

#### Étape 3 :

Créez un fichier .gitignore.

Ce fichier est utile pour ignorer les fichiers, par exemple : les builds ou encore les fichiers compilés en lien avec le langage utilisé.

`touch .gitignore`

Ajoutez la ligne suivante dans votre fichier :

`node_modules/`

![paquet .gitignore capture]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/paquet-add-gitignore.png)


Cela permettra lors du versioning de ne pas envoyer le dossier “node_modules” sur git.

Je vous laisse en autonomie pour publier sur github/gitlab.

#### Étape 4 :

Pour définir le nom de votre paquet :

https://www.npmjs.com/package/VOTRE_NOM_DE_PAQUAGE

Si vous atterrissez sur une 404, BRAVO le nom est disponible, sinon trouvez-en un autre. ☺

Maintenant que vous avez trouvé un nom de paquet, veuillez le modifier dans le fichier package.json.

![packahe.json maj]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/paquet-package-maj-name.png)


#### Étape 5 :

Créons un fichier index.js à la racine du projet, là où est placé le fichier package.json.

`touch index.js`

(Dans notre package.json notre main est index.js, le nom est modifiable)

Nous allons aussi installer le paquet node-fetch

`npm i node-fetch`



Dans notre fichier index.js

````js
import fetch from "node-fetch";
export const getRandomUser = async () => (await fetch('https://randomuser.me/api/')).json();
````

![paquet index.js]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/paquet-index.png)


Nous exportons getRandomUser pour qu’elle puisse être appelée par nos futurs utilisateurs.

### Partie 2 : Tester son paquet

Dans votre terminal à la racine de votre projet faites un :

`npm link`

Pour comprendre ce que fait “npm link” je vous invite à lire la [documentation officielle](https://docs.npmjs.com/cli/v7/commands/npm-link).

Une fois le link effectué, vous pouvez utiliser votre package sur n’importe quel projet installé sur votre machine #macOs <3

Nous allons maintenant initialiser un projet afin de tester notre paquet pour être sûr d’envoyer quelque chose de fonctionnel ☺

Sortez de la racine du projet et créez un nouveau dossier que nous  appellerons test_paquet et placez-vous dedans.

`mkdir test_paquet`

`cd test_paquet`

Initialisons un fichier package.json.

`npm init -y`

Ajoutez ceci dans votre package.json comme précédemment.

````json
"type": "module",
````

Créons un fichier index.js car n’oublions pas que c’est le main dans notre fichier package.json qui est généré.

`touch index.js`

Maintenant nous allons importer notre paquet :

npm link « LE NOM DE VOTRE PAQUET QUE VOUS AVEZ DÉFINI À L’ETAPE 4 »
Exemple : npm link tutorial-paquet-npm

« tutorial-paquet-npm »  fait référence au nom que j’ai défini dans le fichier package.json du paquet développé/

Dans notre fichier index.js, ajoutez ceci :

![index.js test]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/test-index.png)


Nous importons le paquet que nous avons développé.

Ensuite exécutez la commande suivante :

`node index.js`

Cela va nous permettre de voir ce que nous renvoie notre paquet.

Dans votre console vous devriez avoir un user généré aléatoirement.

![node index.js capture]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/test-log-node.png)

Si c’est le cas vous pouvez publier votre paquet avec la certitude qu’il est fonctionnel ☺

### Partie 3 : Publication du paquet

#### **a/ Publication**

Une fois que vous avez vérifié votre paquet en local, nous allons passer à l’étape cruciale, : la publication sur npmjs ☺
Dans votre fichier package.json, nous allons ajouter des métadonnées pour que sur npmjs l’utilisateur dispose de multiples informations concernant votre paquet.

Nous allons ajouter homepage, repository et keywords qui sont optionnels.
Note : Ajoutez homepage et repository seulement si vous avez publié votre paquet sur Gitlab/Github.
Dans le champ _author_ mettre votre nom et prénom pour informer que c’est vous le développeur du paquet.

![package.json paquet finish]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/paquet-maj-package-data-finish.png)


Si vous n’avez pas créé votre compte sur npm, veuillez le faire maintenant et n’oubliez pas de valider votre compte via l’email reçu.

https://www.npmjs.com/signup

Une fois votre compte créé, rendez-vous à la racine de votre projet et lancez la commande :

`npm login` (Vous allez devoir entrer votre username, password et mail)

![Login-npmjs-capture]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/login-npmjs.png)


Maintenant vous pouvez lancer la commande suivante qui permet de publier votre paquet :


`npm publish`

![Npm publish capture]({BASE_URL}/imgs/articles/2021-11-03-publication-npmjs/npm-publish.png)


Votre paquet est maintenant publié ! Vous pouvez aller le vérifier dans vos paquets via votre compte sur https://www.npmjs.com/

#### **b/ Publier une maj de son paquet**

Après avoir corrigé un bug ou implémenté une fonctionnalité et si vous souhaitez publier vos modifications, c’est très simple.

Il vous suffit simplement de changer la version de votre paquet qui se situe dans le fichier package.json.

Pour comprendre la gestion des versions, je vous laisse passer à la partie 4.



### Partie 4 : Versioning

La version de votre paquet se situe dans votre fichier package.json

````json
"version": "1.0.0",
````

Pour aider les développeurs qui s'appuient sur votre code, nous vous recommandons de démarrer la version de votre package à **1.0.0** et d'incrémenter comme suit :


|Statut de code|Organisation|Règle|Exemple de version|
|---|---|---|---|
|Sortie de produit|Nouveau produit|La première version du produit commence par 1.0.0|1.0.0|
|Correction de bug|Correctif|Incrémenter le troisième chiffre|1.0.1|
|Implémentation d’une nouvelle fonctionnalité|Version mineure|Incrémenter le chiffre du milieu et remettre le dernier chiffre à zéro|1.1.0|
|Modifications qui rompent la compatibilité descendante|Version majeure|Incrémenter le premier chiffre et réinitialisez les autres à zéro|2.0.0|

**source**: https://docs.npmjs.com/about-semantic-versioning

### PARTIE 5 : Conclusion

Malheureusement en formation, on ne nous montre que la partie émergée de l'iceberg lors de l’utilisation de langage/framework.
Nous faisons appel à des librairies en pensant que c’est magique sans connaître la mécanique derrière.

Maintenant que vous avez saisi la notion de paquet et comment le publier vous êtes fin prêt pour développer des librairies et aider la communauté. ☺


Si vous souhaitez en savoir plus, rendez-vous sur la [documentation officielle](https://docs.npmjs.com/getting-started).

