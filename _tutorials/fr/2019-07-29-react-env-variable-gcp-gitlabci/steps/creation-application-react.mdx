---
contentType: tutorial-step
tutorial: react-env-variable-gcp-gitlabci
slug: creation-application-react
title: Creation de l'application React
---
## Création de l'application React

### Pré-requis
Pour commencer, vous devez installer [Npm & Nodejs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Création de l'application REACT

À l'heure où je rédige ce CodeLabs, le framework **React** permet facilement de créer des interfaces utilisateurs interactives.

Nous allons donc créer une application très simple avec React.
Si vous désirez plus d'informations sur ce framework, rendez-vous [ici](https://fr.reactjs.org/).

Pour créer votre application, suivez les instructions suivantes.
Dans un dossier *react-app*, lancez la commande suivante :
```bash
npx create-react-app react-app
cd react-app
npm start
```
Nous avons utilisé **create-react-app** qui génère automatiquement les fichiers nécessaires au bon fonctionnement d'une application React et ses dépendances. Nous pouvons consulter maintenant tous ces fichiers à la racine de notre projet.

Ensuite en nous plaçant dans le dossier du projet, nous avons lancer l'application avec la dernière ligne de commande.

En quelques instants, notre application est fonctionnelle dans notre environnement local.

Rendez-vous à cette adresse : http://localhost:3000 pour visualiser le résultat.

### Modification en vue du déploiement sur Google Cloud Platform

Notre objectif est de déployer notre application dans l'écosystème Google Cloud Platform et plus précisément via le service **App Engine** dont nous parlerons un peu plus loin dans ce CodeLabs.

Il est important de savoir que toutes les applications déployées sur App Engine sont servies via le port **8080**.

Vous l'aurez sûrement compris, notre application est disponible via le port 3000 par défaut. Nous devons donc préventivement faire en sorte que notre application utilise le port 8080 afin d'éviter des surprises dans un futur proche.

Pour ce faire, nous allons éditer le fichier **package.json**, qui gère une grande partie de la configuration de notre application.

Nous allons remplacer la ligne suivante :
```js
"start": "react-scripts start"
```
par :
```js
"start": "PORT=8080 react-scripts start"
```
Relancez ensuite votre application :
```bash
Ctrl + C
npm start
```
Rendez-vous ensuite [ici](http://localhost:8080) pour vérifier que votre application est disponible sur ce port.

Ce simple changement permettra de forcer l'application React à utiliser le port 8080 et sera utilisé pour servir notre application par le service App Engine.

### Utiliser des variables d'environnement

Un des moyens simples de gérer les variables d'environnement pour une application React est d'utiliser un fichier **.env** dans lequel on stockera toutes les variables relatives à l'environnement.

Pour éviter que personne ne puisse accéder à ce fichier sensible, nous allons ajouter ce dernier dans un fichier **.gitignore**, qui se trouve à la racine du projet.

Exemple de .gitignore :
```
# Exemple de .gitignore
# ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

#configuration
.env

# misc
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*

```
Notre application pourra faire référence à la même variable d'environnement (**process.env.REACT_APP_API_URL** par exemple) pour nos deux environnements d'exécution (toujours recette et production), mais lors de la compilation, cette variable aura une valeur différente selon l'environnement.

Créons maintenant ce fichier *.env* à la racine du projet.
Puis ajoutons une variable :

```
REACT_APP_API_URL=http://api-url.com
```

Affichons cette variable dans notre application. Pour ce faire, éditons le fichier **App.js** de notre application en remplaçant le code par celui-ci :

```js
import  React  from  'react';
import  './App.css';

const  apiUrl  = process.env.REACT_APP_API_URL;
const App = () => apiUrl;

export  default  App;
```

Avec ces modifications, nous avons supprimé le logo et le texte par défaut de React.
Nous avons défini une variable qui récupère la valeur de notre variable d'environnement.
Nous demandons ensuite à notre component App d'afficher cette variable sur la home page de notre application.

Après sauvegarde du fichier, relancez ensuite votre application :
```bash
Ctrl + C
npm start
```
nous pouvons voir apparaître la valeur de notre variable.

Nous verrons plus tard comment faire pour que cette variable change de valeur selon l'environnement d'exécution.

Notre application est fin prête ! Nous allons pouvoir la déployer sur Google Cloud Platform via le service App Engine.
Pour cela, nous allons voir dans la prochaine étape comment créer un projet sur Google Cloud Platform.