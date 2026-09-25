---
contentType: tutorial-step
tutorial: graphql-avec-apollo
slug: installation-du-serveur-graphql
title: Installation du serveur GraphQL
---
## Installation de docker

Si vous souhaitez utiliser [Docker](https://www.docker.com/), je vous invite à cloner le projet [github](https://github.com/duck-invaders/graphql-apollo).

Une fois cloné vous pouvez lancer :

```bash
docker-compose up -d
```

et vous devez ajouter la ligne suivante dans votre `/etc/hosts` :

```
127.0.0.1 apollo.local
```

Si vous travaillez dans le container docker, les commandes suivantes doivent être lancées dans la machine docker :

```bash
docker-compose exec node sh
```

## Initialisation de l'environnement Node

On commence par configurer le gestionnaire de package yarn :

```bash
yarn init
```

Suivre les instructions en laissant comme `entry point` le fichier `index.js`.

Il faut ensuite installer l'ensemble des packages suivant pour l'utiliser babel :

```bash
yarn add --dev babel-cli babel-preset-env babel-preset-es2015 babel-preset-stage-0
```

Puis vous devez installer les packages `apollo-server-express`, `graphql` et `express` :

```bash
yarn add apollo-server-express graphql express
````

Une fois terminé, vous devez ajouter le script pour start le projet. Dans le fichier `package.json` il faut ajouter :

```json
"scripts": {
    "start": "babel-node index.js"
}
```

## Mise en place du serveur

Il nous reste à mettre en place le serveur express qui permettra de lancer le GraphQL.

Ajouter le code suivant dans le fichier `index.js` :

```js
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';

const PORT = 3000;

const app = express();

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(PORT);
```

Si tout est ok, vous devriez, en faisant un `yarn start` avoir le résultat suivant sur l'url [`127.0.0.1:3000`](http://127.0.0.1:3000/)

![Hello Word]({BASE_URL}/imgs/tutorials/2018-03-28-graphql-avec-apollo/hello.png)

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-apollo/tree/codelabs-step1)
