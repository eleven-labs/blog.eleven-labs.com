--- layout: post title: Google Cloud Platform (2/3) - AppEngine pour vos
projets author: jonathan date: '2016-12-09 14:37:53 +0100' date\_gmt:
'2016-12-09 13:37:53 +0100' categories: - Javascript - Dev Ops tags: -
Google - node - cloud - express --- {% raw %}

Vous avez souvent été bloqué dans vos projets parce qu'il est difficile
de mettre en production.\
En effet, il faut des serveurs, les installer, les configurer et
installer votre projet.\
Comment rendre cela plus simple ?

Avant de commencer ce tutoriel, il faut suivre les 2 premières étapes du
tutoriel Google Cloud Platform (1/3).

Dans le tutoriel d'aujourd'hui, nous allons utiliser la solution
[AppEngine](https://console.cloud.google.com/appengine), qui vous permet
de déployer facilement et directement depuis votre ordinateur votre
application dans le Cloud.

Par défaut AppEngine permet d'installer du Java, du Php, du Go et du
Python, mais il permet aussi d'installer du Node, c'est d'ailleurs sur
cette technologie que nous allons partir.

##### Etape 1, installer le sdk Google Cloud Platform

Je vous invite à suivre les instructions
disponibles [ici](https://cloud.google.com/sdk/docs/?hl=fr). Une fois
l'installation terminée vous devriez pouvoir lancer la commande suivante
dans votre terminal :

[gcloud -help]{.lang:sh .decode:true .crayon-inline}

Si ce n'est pas le cas, vérifiez votre installation.

##### Etape 2, créer votre projet node.js

Pour continuer nous allons faire simple en mettant en place un petit
"Hello Word",  avec [Express.js](http://expressjs.com/fr/).\
Créez un nouveau dossier, ajoutez le fichier package.json :

``` {.lang:js .decode:true title="package.json"}
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

``` {.lang:js .decode:true title="index.js"}
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

[npm install && npm start]{.lang:sh .decode:true .crayon-inline}

Normalement si vous suivez le lien <http://localhost:8080/>  un joli
"Hello World!" s'affiche.

##### Etape 3, mettons du Cloud

Nous allons ajouter le fichier app.yaml qui permet de configurer votre
AppEngine. Vous trouverez la documentation complète
[ici](https://cloud.google.com/appengine/docs). Dans le fichier, nous
allons mettre en place la configuration de base pour un environnement
node.

``` {.lang:yaml .decode:true title="app.yaml"}
runtime: nodejs
env: flex
```

Comme vous pouvez le comprendre facilement, la première ligne permet de
définir la technologie utilisée, la seconde ligne permet de choisir un
environnement dit 'flex', ce qui signifie qu'il "s'auto scale" selon le
trafic.

##### Etape 4, on met en production

La mise en prod est maintenant super simple, il vous suffit de vous
mettre dans le dossier d'application et de lancer la commande suivante :

[gcloud app deploy --version version1]{.lang:sh .decode:true
.crayon-inline}

L'option --version vous permet de donner un nom à votre version et de
pouvoir la distinguer dans l'interface.

##### Etape 5, allons dans l'interface

Allez dans la console Cloud dans l'onglet
[AppEngine](https://console.cloud.google.com/appengine).\
Puis dans "versions" vous devriez voir la version de votre projet
apparaître.

[![AppEngine - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.05.13-1024x370.png){.aligncenter
.size-large .wp-image-2739 width="1024"
height="370"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.05.13.png)

Quand le déploiement sera terminé, vous pourrez accéder à votre site en
cliquant sur le nom de la version.\
Vous pouvez suivre les logs de l'application en lançant la commande
suivante dans votre terminal :

[gcloud app logs read -s default]{.lang:sh .decode:true .crayon-inline}

##### Etape 6, créons une nouvelle version

Dans index.js changeons le message du "Hello World!" avec par exemple :

``` {.lang:js .decode:true title="Index.js V2"}
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

[gcloud app deploy --version version2]{.lang:sh .decode:true
.crayon-inline}

Dans l'interface AppEngine, vous devez voir la nouvelle version se
lancer :

[![AppEngine V2 - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.13.55-1024x246.png){.aligncenter
.size-large .wp-image-2740 width="1024"
height="246"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.13.55.png)

Google enverra 100% du trafic sur la nouvelle version dès que celle-ci
sera lancée entièrement.\
Une fois le processus terminé vous pouvez choisir vous même comment
répartir le trafic.

##### Etape 7, répartir le trafic

La répartition du trafic permet de gérer un changement de version
progressif de votre application. Pour procéder à cette répartition rien
de plus simple, sélectionnez les versions avec lesquelles vous voulez
travailler et cliquez sur "Répartir le trafic".

Vous arrivez sur l'interface suivante :

[![Répartir le traffic - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.18.42-1024x736.png){.aligncenter
.size-large .wp-image-2741 width="1024"
height="736"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.18.42.png)

##### Etape 8, Stopper les versions

Avant de partir, nous allons éteindre les versions, pour cela
sélectionnez la version que vous souhaitez éteindre, puis cliquez sur
"Arrêter".

[![Arreter - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.22.54-1024x427.png){.aligncenter
.size-large .wp-image-2742 width="1024"
height="427"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-14.22.54.png)

Je vous invite à jouer un peu avec AppEngine, il permet de très vite
tester vos POC sur de vrais serveurs, et même de maintenir une charge
importante pour vos projets.

 

{% endraw %}
