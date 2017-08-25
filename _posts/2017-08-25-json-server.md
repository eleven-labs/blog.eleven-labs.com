---
layout: post
title: JSON Server
excerpt: Accélérez le prototypage de vos applications, en imitant vos APIs avec JSON Server.
authors:
    - kelfarsaoui
permalink: /fr/json-server/
categories:
    - JSON
    - API
    - NodeJS
tags:
    - JSON
    - API
    - NodeJS
cover: /assets/2017-08-16-json-server/cover.jpg
---

Bonjour, aujourd'hui, je vais parler de `json-server`, de la motivation qui pousse à l'utiliser, et surtout comment l'utiliser ?

`json-server` est un module `npm`, qui fournit un serveur [Express](https://github.com/expressjs/express) qui sert une API JSON.

## Motivation

Disons que vous travaillez sur votre application (Javascript, PHP, IOS, Android, ...) et que vous souhaitez consommer les données d'une certaine API. Sauf qu'il s'avère que cette API est encore en développement. La première étape consiste à travailler avec de fausses données, soit codées en dur dans une certaine constante (à éviter), soit en utilisant un fichier JSON statique, ce qui sera un peu difficile à gérer. Pourquoi ? Vous êtes un bon développeur qui aime faire le bon choix; vous voulez que votre application puisse effectuer des mises à jour de données, en utilisant des requêtes HTTP (comme GET, POST... etc.), et vous souhaitez conserver vos mises à jour. Malheureusement, vous ne pouvez pas faire tout cela en utilisant un fichier statique, vous devez trouver un moyen de le rendre dynamique. Donc, à moins que votre collègue ait fini de développer l'API, vous aurez besoin d'une aide sérieuse.

`json-server` nous permet d'imiter une API et de fournir un accès dynamique aux données. Cela veut dire qu'on peut lire, ajouter, mettre à jour et supprimer des données (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

Il fournit des cas d'utilisation d'URL comme :

- [Les routes](#routes) (`/articles/1`)
- [Les filtres](#filters) (`/articles/1/comments?author.username=rpierlot`)
- [La pagination](#pagination) (`/articles?_page=2&_limit=10`)
- [La recherche intégrale de texte](#full-text-search) (`/articles?q=graphql`)
- [Les relations](#relationships) (`/articles?_embed=comments`)

Et d'autres choses diverses comme :

- `CORS` & `JSONP`
- La possibilité d'accéder aux schémas à distance
- [La génération de données aléatoires](#random-data)
- [Les routes personnalisées](#custom-routes)
- [Les middlewares](#middlewares)
- [La possibilité d'utiliser `json-server` comme module dans votre serveur NodeJS](#nodejs-module)

## Comment l'utiliser ?

Cela prendra moins de 5 minutes !

### Recommandations

- NodeJS & `npm`
- Un consommateur de l'API (Votre code, `curl`, `postman` ou simplement votre navigateur)

### Installation

Il est assez simple à mettre en place :

```bash
$ npm install -g json-server

# ou bien avec yarn
$ yarn global add json-server

# puis créer un repertoire dans lequel on va mettre notre fichier db.json
$ mkdir blog && cd $_

# créer le schéma
$ touch db.json
```

Pour le remplir, on peut le faire à la main, ou utiliser un générateur de json aléatoire (mon préféré est [json-generator](http://json-generator.com))

```json
{
  "articles": [
    {
      "id": 1,
      "title": "Construire une API en GO",
      "authorId": 2
    },
    {
      "id": 2,
      "title": "Créer une API avec API Platform",
      "authorId": 1
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "Brillant",
      "articleId": 1
    },
    {
      "id": 2,
      "body": "Sympa",
      "articleId": 2
    }
  ],
  "authors": [
    {
      "id": 1,
      "username": "rpierlot",
      "title": "Romain Pierlot"
    },
    {
      "id": 2,
      "username": "qneyrat",
      "title": "Quentin Neyrat"
    }
  ]
}
```

Maintenant, on peut exécuter `json-server` afin de pouvoir accéder aux URL que `json-server` a créées.

```bash
$ json-server db.json

  \{^_^}/ hi!

  Loading db.json
  Done

  Resources
  http://localhost:3000/articles
  http://localhost:3000/comments
  http://localhost:3000/authors

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
```

Bien, on a configuré la simulation d'API. Maintenant, on peut la tester :

```bash
$ curl http://localhost:3000/articles
[
  {
    "id": 1,
    "title": "Construire une API en GO",
    "authorId": 2
  },
  {
    "id": 2,
    "title": "Créer une API avec API Platform",
    "authorId": 1
  }
]

$ curl http://localhost:3000/articles/1
{
  "id": 1,
  "title": "Construire une API en GO",
  "authorId": 2
}
```

<a name="routes"></a>

### Les routes

On peut utiliser presque toutes sortes de requêtes : par exemple, pour insérer (créer) un nouvel auteur, on peut utiliser : `POST http://localhost:3000/authors`

```bash
$ curl --data-urlencode "title=Vincent Composieux" --data "username=vcomposieux" http://localhost:3000/authors
{
  "title": "Vincent Composieux",
  "username": "vcomposieux",
  "id": 3
}
```

Pour lire un article ayant l'id 2 : `GET http://localhost:3000/articles/2`. Le même URI serait utilisé pour `PUT` et `DELETE` pour mettre à jour et supprimer, respectivement.

Maintenant, en ce qui concerne la création d'un nouveau commentaire dans un article, on peut utiliser l'URI suivant : `POST http://localhost:3000/comments`, et cela pourrait fonctionner pour créer un commentaire, mais il est sans doute en dehors du contexte d'un article.

En fait, cette URI n'est pas très intuitive. On peut l'améliorer en y ajoutant contexte : `POST http://localhost:3000/articles/1/comments`. Maintenant, on sait qu'on crée un commentaire dans l'article ayant id 1.

```bash
$ curl --data-urlencode "body=Cool article ;-)" http://localhost:3000/articles/1/comments
{
  "body": "Cool article ;-)",
  "articleId": 1,
  "id": 4
}
```

Idem avec la création d'un article par l'auteur ayant l'id 3 :

```bash
$ curl --data-urlencode "title=GraphQL" http://localhost:3000/authors/3/articles
{
  "title": "GraphQL",
  "authorId": "3",
  "id": 3
}
```

<a name="filters"></a>

#### Filtres, tri et opérateurs

**Le filtrage** se fait à l'aide de simples paramètres de requête : `GET http://localhost:3000/articles?title=GraphQL`.

**Le tri** est aussi simple que d'ajouter les paramètres `_sort` et `_order` (`asc` & `desc`) dans la requête :

`GET http://localhost:3000/articles?_sort=likes`

(En supposant qu'on a ajouté le champ `likes` à chaque article). Le tri est ascendant par défaut.

Dans le cas où l'on veux trier par plusieurs propriétés, on peut écrire les propriétés séparées par une virgule :

`GET http://localhost:3000/articles?_sort=author,score&_order=desc,asc`


**Les opérateurs** sont des suffixes utilisés pour augmenter les paramètres de requête :

* `_gt` (greater than), `_lt` (less than), `_gte` (greater than or equal) et `_lte` (less than or equal) : `GET http://localhost:3000/comments?score_gte=5` (en supposant qu'on a un champ `score` dans les commentaires).

* `_ne` (not equal) négation d'une expression `GET http://localhost:3000/comments?articleId_ne=2`
* `_like` est un opérateur qui peut être appliqué à des chaînes de caractères, il donne le même résultat que le `LIKE` de `SQL`. `GET http://localhost:3000/articles?title_like=API`

<a name="pagination"></a>

#### La pagination

On peut utiliser les paramètres de requête intégrés `_page` et `_limit` pour paginer les résultats. `json-server` expose `X-Total-Count` et l'en-tête `Link` qui contient des liens vers la première, la prochaine et la dernière page.

`GET http://localhost:3000/articles?_page=1&_limit=1`

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin, Accept-Encoding
Access-Control-Allow-Credentials: true
Cache-Control: no-cache
Pragma: no-cache
Expires: -1
X-Total-Count: 3
Access-Control-Expose-Headers: X-Total-Count, Link
Link: <http://localhost:3000/articles?_page=1&_limit=1>; rel="first", <http://localhost:3000/articles?_page=2&_limit=1>; rel="next", <http://localhost:3000/articles?_page=3&_limit=1>; rel="last"
X-Content-Type-Options: nosniff
Content-Type: application/json; charset=utf-8
Content-Length: 89
ETag: W/"59-24+hjZrVFdbtnn+FgcogU6QvujI"
Date: Sun, 30 Jul 2017 17:22:34 GMT
Connection: keep-alive
```

<a name="full-text-search"></a>

#### La recherche intégrale de texte

On peut implémenter une fonction de recherche dans notre application, en utilisant la fonctionnalité "recherche intégrale de texte" de json-server, avec le paramètre `q`.

```bash
$ curl http://localhost:3000/articles?q=api
[
  {
    "id": 1,
    "title": "Construire une API en GO",
    "author": "qneyrat"
  },
  {
    "id": 2,
    "title": "Créer une API avec API Platform",
    "author": "rpierlot"
  }
]
```

<a name="relationships"></a>

#### Les relations

On peut voir les relations à l'aide des paramètres `_embed` et `_expand`.

* `_embed` permet de voir les ressources "enfants" comme les commentaires : `GET http://localhost:3000/articles?_embed=comments`
* `_expand` permet de voir les ressources "parentes" comme les articles : `GET http://localhost:3000/comments?_expand=article`

```bash
$ curl http://localhost:3000/articles?author=vincent&_embed=comments
[
  {
    "title": "GraphQL",
    "author": "vincent",
    "id": 3,
    "comments": [
      {
        "body": "nice",
        "articleId": 3,
        "id": 3
      },
      {
        "body": "great!",
        "articleId": 3,
        "id": 4
      }
    ]
  }
]


$ curl http://localhost:3000/comments?_expand=article
[
  {
    "id": 1,
    "body": "Brillant",
    "articleId": 1,
    "article": {
      "id": 1,
      "title": "Construire une API en GO",
      "author": "qneyrat"
    }
  },
  {
    "id": 2,
    "body": "Sympa",
    "articleId": 2,
    "article": {
      "id": 2,
      "title": "Créer une API avec API Platform",
      "author": "rpierlot"
    }
  },
  ...
]
```

Jusqu'à présent, on n'a vu que les routes `json-server`, mais il y a encore plein de choses à découvrir.

<a name="random-data"></a>

### La génération de données aléatoire

L'[exemple de base de Typicode](https://github.com/typicode/json-server#generate-random-data) présente un script simple qui génère le point d'accès `users`. Ici, on va écrire des points d'accès qui servent des données générées de manière aléatoire en utilisant un module qui génère de fausses données. Personnellement, j'utilise [faker.js](https://github.com/Marak/faker.js), mais il y en a d'autres que vous pouvez explorer comme [Chance](https://github.com/chancejs/chancejs) et [Casual](https://github.com/boo1ean/casual).

L'aspect aléatoire de la génération ne se produit qu'une seule fois, et c'est seulement pendant le démarrage du serveur. Cela signifie que `json-server` ne nous donnera pas une réponse différente pour chaque requête. Finalement, on doit installer le générateur de données fausses, puis écrire le script de génération.

```bash
$ yarn add faker
$ touch generate.js
```

Gardez à l'esprit que le script doit exporter une fonction qui renvoie exclusivement un objet avec des clés (points d'accès).

```js
// generate.js
const faker = require('faker');

module.exports = () => ({
  messages: [...Array(3)].map((value, index) => ({
    id: index + 1,
    name: faker.hacker.noun(),
    status: faker.hacker.adjective(),
    description: faker.hacker.phrase(),
  })),
});
```

Ensuite, on exécute `json-server` en lui donnant le script de génération comme argument :

```bash
$ json-server generate.js

  \{^_^}/ hi!

  Loading generate.js
  Done

  Resources
  http://localhost:3000/messages

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
```

Et les résultats ressembleront à quelque chose comme :

```bash
$ curl http://localhost:3000/messages
[
  {
    "id": 1,
    "name": "driver",
    "status": "cross-platform",
    "description": "If we connect the system, we can get to the ADP panel through the redundant PCI protocol!"
  },
  {
    "id": 2,
    "name": "monitor",
    "status": "1080p",
    "description": "Try to synthesize the CSS driver, maybe it will navigate the bluetooth matrix!"
  },
  {
    "id": 3,
    "name": "hard drive",
    "status": "virtual",
    "description": "Use the redundant SMS program, then you can compress the bluetooth port!"
  }
]
```

Et on peut toujours effectuer des requêtes comme on l'a vu dans la section des [routes](#routes).

<a name="custom-routes"></a>

### Les routes personnalisées

Imaginons qu'on est censés effectuer des requêtes sur plusieurs points d'accès différents sur la future API, et que ces paramètres ne contiennent pas les mêmes URI :

```url
/api/dashboard
/api/groups/ducks/stats
/auth/users
/rpierlot/articles
```

`json-server` permet de spécifier des routes personnalisées. Elles vont permettre de résoudre ce problème en utilisant un mapping qui résout les routes réelles dans notre schéma json :

```json
{
  "/api/:view": "/:view",
  "/api/groups/:planet/stats": "/stats?planet=:planet",
  "/:user/articles": "/articles?author=:user",
  "/auth/users": "/users"
}
```

Donc, lorsque on lance `json-server`, il nous montre les routes personnalisées qu'on peut utiliser :

```bash
$ json-server --watch db2.json --routes routes.json

  \{^_^}/ hi!

  Loading db2.json
  Loading routes.json
  Done

  Resources
  http://localhost:3000/users
  http://localhost:3000/dashboard
  http://localhost:3000/stats
  http://localhost:3000/articles

  Other routes
  /api/:view -> /:view
  /api/groups/:planet/stats -> /stats?planet=:planet
  /:user/articles -> /articles?author=:user
  /auth/users -> /users

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
  Watching...
```

Maintenant, on peut effectuer les requêtes personnalisées pour voir les résultats :

```bash
$ curl http://localhost:3000/api/dashboard
{
  "visits": 3881,
  "views": 625128,
  "shares": 7862
}

$ curl http://localhost:3000/api/groups/ducks/stats
[
  {
    "planet": "ducks",
    "stats": {
      "points": 5625,
      "ships": 8
    }
  }
]
```

<a name="middlewares"></a>

### Middlewares

Dans le cas où l'on veut ajouter un comportement spécifique à notre instance json-server, on peut utiliser des middlewares personnalisés, qu'on intègre dans le serveur de la même manière que lors du développement d'une application express classique. Dans cette section, on va explorer un exemple utile d'une fonctionnalité qui est habituellement nécessaire.

Imaginez qu'on veuille accéder à une ressource sur l'API, mais qu'il s'avère que cette ressource est sécurisée. On peut dire qu'il s'agit simplement de données, et qu'on se satisferait de les utiliser sans se soucier de la sécurité. Mais, on sait que ce n'est le bon choix, on veut que l'application soit prête lorsque la future API est prête, afin de tout tester. Donc, au lieu de contourner la sécurité, on va utiliser les middlewares pour mettre en place une couche d'authentification.

```js
// auth.js
const auth = require('basic-auth');

module.exports = (req, res, next) => {
  var user = auth(req);

  if (typeof user === 'undefined' || user.name !== 'kamal' || user.pass !== 'secret') {
    // Cette ligne sera expliquée plus tard dans cette section.
    res.header('WWW-Authenticate', 'Basic realm="Access to the API"');
    return res.status(401).send({ error: 'Unauthorized' });
  }

  next();
};
```

Maintenant, on exécute `json-server` avec l'option `--middlewares` :

```bash
$ json-server --watch db2.json --routes routes.json --middlewares auth.js
```

Remarque: l'option `--middlewares` accepte une liste de fichiers. `--middlewares file1.js file2.js file3.js`.

Puis, on teste la couche d'authentification :

```bash
$ curl http://localhost:3000/api/groups/ducks/stats
{
  "error": "Unauthorized"
}
```

Et on peut voir le log avec le status HTTP `401` :

```bash
GET /api/groups/ducks/stats 401 12.180 ms - 29
```

Lorsqu'on affiche les en-têtes de la réponse, on reconnaît cet en-tête `WWW-Authenticate: Basic realm="Access to the API"` :

```http
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Vary: Origin, Accept-Encoding
Access-Control-Allow-Credentials: true
Cache-Control: no-cache
Pragma: no-cache
Expires: -1
WWW-Authenticate: Basic realm="Access to the API"
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-t1Z3N2Fd2Yqi/vcyFQaHaMeQEew"
Date: Thu, 03 Aug 2017 09:59:57 GMT
Connection: keep-alive
```

Voici ce que Mozilla Developer Network en dit :

> Les en-têtes de réponse `WWW-Authenticate` et `Proxy-Authenticate` définissent la méthode d'authentification qui devrait être utilisée pour accéder à une ressource. Ils doivent spécifier quel schéma d'authentification est utilisé afin que le client qui souhaite l'autoriser sache comment fournir les informations d'identification.
>
> <cite>[HTTP authentication : `WWW-Authenticate` and `Proxy-Authenticate` headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#WWW-Authenticate_and_Proxy-Authenticate_headers)</cite>

Ensuite, on teste à nouveau, et cette fois en ajoutant les informations d'identification à la requête (Remarque: l'option `--user` de `curl` n'est pas limitée à l'authentification de type `Basic`, nous pouvons effectuer d'autres types d'authentification, [voir ici](https://ec.haxx.se/http-auth.html)) :

```bash
$ curl --user kamal:secret http://localhost:3000/api/groups/ducks/stats
[
  {
    "planet": "ducks",
    "stats": {
      "points": 5625,
      "ships": 8
    }
  }
]
```

Bien ! Évidemment, c'est un status HTTP `200` :-D.

```bash
GET /api/groups/ducks/stats 200 4.609 ms - 94
```

<a name="nodejs-module"></a>

### En tant que module NodeJS

`json-server` est une application Express, ce qui signifie que nous pouvons l'utiliser dans une application NodeJS/Express existante pour réaliser des comportements personnalisés. Voici un exemple simple qui montre comment personnaliser le logger :

`json-server` utilise `morgan` pour les logs, et le format par défaut qu'il utilise est le format [`dev`](https://github.com/expressjs/morgan#dev), qui n'expose pas toutes les informations que l'on veut. Pour avoir un log détaillé on doit utiliser le [format  standard d'Apache](https://github.com/expressjs/morgan#combined) :

```js
// server.js
import express from 'express';
import api from './api';

const port = 9001;
const app = express();
const API_ROOT = `http://localhost:${port}/api`;

app.use('/api', api);

app.listen(port, error => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up %s in your browser.', port, API_ROOT);
  }
});
```


```js
// api.js
import { create, defaults, rewriter, router } from 'json-server';
import morgan from 'morgan';
import rewrites from './routes.json';

const server = create();
const apiEndpoints = router('db2.json');

// Désactiver le logger existant
const middlewares = defaults({ logger: false });

// Ici on utilise notre propre logger
server.use(morgan('combined', { colors: true }));

server.use(rewriter(rewrites));
server.use(middlewares);
server.use(apiEndpoints);

export default server;
```

Ensuite, on lance le serveur :

```bash
$ nodemon --exec babel-node server.js
==> 🌎  Listening on port 9001. Open up http://localhost:9001/api/ in your browser.
```

Ici, on peut voir les logs personnalisés dans la console :

```bash
$ curl --user kamal:secret http://localhost:9001/api/groups/ducks/stats
::1 - kamal [11/Aug/2017:15:04:58 +0000] "GET /api/groups/ducks/stats HTTP/1.1" 200 187 "-" "curl/7.51.0"

# or with Chrome
::1 - - [10/Aug/2017:08:57:04 +0000] "GET /api/ HTTP/1.1" 200 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## Conclusion

`json-server` a considérablement réduit le temps de scaffolding d'une API. Parmi les possibilités qu'on a vues, il existe de nombreux cas d'utilisation que vous pouvez explorer pour utiliser `json-server`, comme la personnalisation des logs, les tests, la réconciliation entre micro-services, les applications sans serveur ... etc.

J'espère que cet article a pu éclairer la façon dont on peut utiliser `json-server`. J'ai essayé d'apporter des cas d'utilisation utiles qu'on rencontre tous les jours. Si vous souhaitez encore en savoir plus sur l'utilisation ou même sur son fonctionnement interne, je recommande d'explorer son [projet Github](https://github.com/typicode/json-server).

Merci pour la lecture !
