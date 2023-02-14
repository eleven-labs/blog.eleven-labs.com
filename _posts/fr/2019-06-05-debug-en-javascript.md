---
layout: post
lang: fr
date: '2019-06-05'
categories:
  - javascript
authors:
  - jgreaux
excerpt: >-
  Nous avons tous utilisé des console.log() pour déboguer notre code JS.
  Javacript permet pourtant de faire du débogue pas à pas très simplement.
  Voyons ensemble à quel point cela sera rapide à mettre en place sur vos projet
  FRONT / BACK.
title: Déboguer efficacement React / Node.js sous VSCode ?
slug: debogue-javascript-vscode
oldCategoriesAndTags:
  - javascript
  - vscode
permalink: /fr/debogue-javascript-vscode/
---

## Introduction

Il parait souvent ardu de mettre en place des débogues pas à pas sur des projets, ce qui nous pousse à nous contenter de faire des `console.log()` dans notre code.
Nous allons voir qu'avec **VSCode**, nous pouvons facilement déboguer du code **React** tout comme du code **Node.js**.
Ensuite nous verrons comment déboguer une app Node.JS dans un container Docker.
Pour finir je vous donnerai une astuce pour ceux utilisant Docker + **NestJS**.

## Déboguer une application REACT-APP

Commençons par une application front.
Pour déboguer une application front React, vous avez 2 possibilités :
- Le faire directement depuis la console de votre navigateur (Google/Firefox).
- Le faire depuis votre éditeur de code comme VSCode ou Webstorm par exemple.
Ici, nous partirons sur le débogue directement dans l'IDE.

### 1/ Créer une nouvelle app React create-react-app

Pour commencer il nous faut une application React, pour cela vous devez créer une application :

```bash
npx create-react-app my-app
cd my-app
yarn start
```

### 2/ Extension Chrome Debugger

Dans la section des extensions de VSCode, installez l'extension nommée 'VSCode Debugger for Chrome'.
Une fois l'installation effectuée, relancez VSCode.

### 3/ Configurer VSCode

Comme vu ci-dessus, VSCode possède une section pour interpréter le débogue de JS.
Sauf que dans l'état, aucune configuration n'est encore faite sur le projet React.

Allez dans la section de débogage de VSCode, et cliquez sur la molette puis sélectionnez google chrome.
VSCode va vous ouvrir un fichier launch.js, avec une configuration par défaut pour fonctionner avec google Chrome.
Yeah, exactement ce qu'il nous faut !

Le fichier se nomme `launch.js`, et s'ajoute à la racine de votre projet dans un dossier `.vscode`.

`.vscode/launch.js` :
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Chrome", // ajouter un nom a la conf
            "type": "chrome", // On le lance avec chrome, donc le type est chrome
            "request": "launch",
            "url": "http://localhost:3000", // URL d'acces
            "webRoot": "${workspaceRoot}/src" // Où se situe le point d'entrée
        }
    ]
}
```
### 4/ Lancer l'application

Il ne vous reste plus qu'à mettre un point d'arrêt dans le code et à cliquer sur le bouton play dans la section "déboguer" de VSCode, qui va ouvrir un navigateur chrome et lancer votre application front.

## Déboguer une application Node.js

Maintenant que nous avons vu la partie FRONT sous React, passons à la partie BACK avec du Node.js sous express.

### 1/ Installation d'un projet Node.js

Nous allons partir ici sur une application Node.js & express.

```bash
yarn init
yarn add express
```
Ensuite il faut créer un `index.js` :

```javascript
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  const number = Math.floor(Math.random() * Math.floor(100));
  res.send('Hello World! ' + number);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```

Nous sommes prêts, nous pouvons maintenant passer à la configuration de notre fichier launch.js.

### 2/ Configurer launch.js

Avant toute chose, Node.js nous permet de lancer notre code avec un mode debogue.
Pour cela, il faut ajouter --inspect a notre commande :

`node --inspect index.js`

Par défaut, Node.js va créer un webSocket sur le port 9229 sur l'adresse 127.0.0.1.

Comme pour la partie front, nous avons besoin de créer un fichier `.vscode/launch.js`
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node", // nous voulons déboguer du node
            "request": "launch", // nous voulons exécuter la commande de lancement de node
            "name": "Launch node test", // ajouter un nom a la conf
            "program": "${workspaceFolder}/index.js" // indiquer ici
        }
    ]
}
```

Executez la configuration, VSCode vous ouvrira une console en lancant cette commande :

```bash
node --inspect-brk=XXXX index.js
```

Vous pouvez maintenant mettre un point d'arrêt.

## Deboguer une app Node.js sous Docker

Reprenez le projet précédent et ajoutez-y les fichiers suivants :

**docker-compose.yml**:
```yml
version: '3.3'

services:
  api:
    build: ./
    working_dir: /app
    volumes:
      - ".:/app:cached"
    ports:
      - 9229:9229 #On ouvre le port 9229 qui est le port de debogue par défaut
      - 3000:3000
```

**Dockerfile**:

```Dockerfile
FROM node:8-alpine

# Create app directory
WORKDIR /app

# Bundle app source
COPY . /app/

# yarn install
RUN yarn

EXPOSE 9229 3000
CMD [ "yarn", "start:debug-docker"]
```

Dans le fichier Dockerfile, nous lançons la commande **start:debug-docker**, nous devons donc la rajouter dans notre fichier package.json :

```javascript
{
  ...
  "scripts": {
    "start:debug-docker": "node --inspect=0.0.0.0:9229 index.js"
  },
  ...
}
```

Enfin, nous devons rajouter une configuration dans le fichier launch.js :

```json
{
    "version": "0.2.0",
    "configurations": [
        ...,
        {
            "type": "node",
            "request": "attach",
            "name": "Launch docker node debug",
            "port": 9229,
            "address": "localhost",
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "/app"
        }
    ]
}
```

Vous pouvez maintenant lancer `docker-compose up` et lancer le débogueur 'launch docker node debug'.

## Déboguer une app NestJS sous Docker

Si vous utilisez NestJS, il faut effectuer une petite modification pour le faire fonctionner sous Docker.
Comme nodemon est utilisé pour le développement en local sur NestJS, il faut lui ajouter une configuration spécifique.

Ajoutez un fichier `nodemon-docker-debug.json`

```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "tsc && node --inspect=0.0.0.0:2992 ./dist/src/main.js"
}
```
Dans le package.json il vous suffit de créer une nouvelle commande que votre Dockerfile exécutera.

`package.json`

```javascript
{
  ...
  "scripts": {
    ...
    "start:debug-docker": "nodemon --config nodemon-docker-debug.json",
    ...
  },
  ...
}
```

## Conclusion

Vous n'avez maintenant plus d'excuses pour utiliser des `console.log()` sur vos projets.
Vous trouverez tous les exemples sur mon github à cette adresse : [https://github.com/JeremyGreaux/debug-javascript](https://github.com/JeremyGreaux/debug-javascript)


N'hésitez pas à partager cet article s'il vous a plu ! :)
