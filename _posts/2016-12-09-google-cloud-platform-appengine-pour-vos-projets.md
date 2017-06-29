---
layout: post
title: Google Cloud Platform (2/3) - AppEngine pour vos projets
excerpt: Vous avez souvent été bloqué dans vos projets parce qu'il est difficile de mettre en production. En effet, il faut des serveurs, les installer, les configurer et installer votre projet. Comment rendre cela plus simple ?
author: captainjojo
permalink: /fr/google-cloud-platform-appengine-pour-vos-projets/
categories:
- Javascript
- Dev Ops
tags:
- Google
- node
- cloud
- express
---

Vous avez souvent été bloqué dans vos projets parce qu'il est difficile de mettre en production.
En effet, il faut des serveurs, les installer, les configurer et installer votre projet.
Comment rendre cela plus simple ?

Avant de commencer ce tutoriel, il faut suivre les 2 premières étapes du tutoriel Google Cloud Platform (1/3).

Dans le tutoriel d'aujourd'hui, nous allons utiliser la solution [AppEngine](https://console.cloud.google.com/appengine), qui vous permet de déployer facilement et directement depuis votre ordinateur votre application dans le Cloud.
Par défaut AppEngine permet d'installer du Java, du Php, du Go et du Python, mais il permet aussi d'installer du Node, c'est d'ailleurs sur cette technologie que nous allons partir.

### Etape 1, installer le sdk Google Cloud Platform

Je vous invite à suivre les instructions disponibles [ici](https://cloud.google.com/sdk/docs/?hl=fr). Une fois l'installation terminée vous devriez pouvoir lancer la commande suivante dans votre terminal :

```sh
gcloud -help
```
Si ce n'est pas le cas, vérifiez votre installation.

### Etape 2, créer votre projet node.js

Pour continuer nous allons faire simple en mettant en place un petit "Hello Word",  avec [Express.js](http://expressjs.com/fr/).

Créez un nouveau dossier, ajoutez le fichier package.json :

```json
//package.json
{
  "name": "hello-word",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.14.0"
  }
}
```

Puis ajoutez le fichier index.js :

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
```

Si vous lancez dans votre terminal :

```sh
npm install && npm start
```

Normalement si vous suivez le lien [http://localhost:8080/](http://localhost:8080/) un joli "Hello World!" s'affiche.

### Etape 3, mettons du Cloud

Nous allons ajouter le fichier app.yaml qui permet de configurer votre AppEngine. Vous trouverez la documentation complète [ici](https://cloud.google.com/appengine/docs). Dans le fichier, nous allons mettre en place la configuration de base pour un environnement node.

```yaml
runtime: nodejs
env: flex
```

Comme vous pouvez le comprendre facilement, la première ligne permet de définir la technologie utilisée, la seconde ligne permet de choisir un environnement dit 'flex', ce qui signifie qu'il "s'auto scale" selon le trafic.

### Etape 4, on met en production

La mise en prod est maintenant super simple, il vous suffit de vous mettre dans le dossier d'application et de lancer la commande suivante :

```sh
gcloud app deploy --version version1
```

L'option --version vous permet de donner un nom à votre version et de pouvoir la distinguer dans l'interface.

### Etape 5, allons dans l'interface

Allez dans la console Cloud dans l'onglet [AppEngine](https://console.cloud.google.com/appengine).
Puis dans "versions" vous devriez voir la version de votre projet apparaître.


![AppEngine - Google Cloud Platform](/assets/2016-12-09-google-cloud-platform-appengine-pour-vos-projets/Capture-d’écran-2016-11-30-à-14.05.13.png)

Quand le déploiement sera terminé, vous pourrez accéder à votre site en cliquant sur le nom de la version.
Vous pouvez suivre les logs de l'application en lançant la commande suivante dans votre terminal :

```sh
gcloud app logs read -s default
```

### Etape 6, créons une nouvelle version

Dans index.js changeons le message du "Hello World!" avec par exemple :

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World V2!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
```

Puis lancez la commande :

```sh
gcloud app deploy --version version2
```
Dans l'interface AppEngine, vous devez voir la nouvelle version se lancer :

![AppEngine V2 - Google Cloud Platform](/assets/2016-12-09-google-cloud-platform-appengine-pour-vos-projets/Capture-d’écran-2016-11-30-à-14.13.55.png)

Google enverra 100% du trafic sur la nouvelle version dès que celle-ci sera lancée entièrement.
Une fois le processus terminé vous pouvez choisir vous même comment répartir le trafic.

### Etape 7, répartir le trafic

La répartition du trafic permet de gérer un changement de version progressif de votre application. Pour procéder à cette répartition rien de plus simple, sélectionnez les versions avec lesquelles vous voulez travailler et cliquez sur "Répartir le trafic".

Vous arrivez sur l'interface suivante :

![Répartir le traffic - Google Cloud Platform](/assets/2016-12-09-google-cloud-platform-appengine-pour-vos-projets/Capture-d’écran-2016-11-30-à-14.18.42.png)

### Etape 8, Stopper les versions

Avant de partir, nous allons éteindre les versions, pour cela sélectionnez la version que vous souhaitez éteindre, puis cliquez sur "Arrêter".

![Arreter - Google Cloud Platform](/assets/2016-12-09-google-cloud-platform-appengine-pour-vos-projets/Capture-d’écran-2016-11-30-à-14.22.54.png)

Je vous invite à jouer un peu avec AppEngine, il permet de très vite tester vos POC sur de vrais serveurs, et même de maintenir une charge importante pour vos projets.
