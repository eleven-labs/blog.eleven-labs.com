---
contentType: tutorial-step
tutorial: apollo-rest-cache
slug: apollo-serveur
title: Apollo serveur
---
## Mise en place du serveur Apollo

### Initialisation du projet

Pour commencer, clonez la branche *master* de [ce projet](https://github.com/MarieMinasyan/apollo-tutorial).
Ainsi, vous devriez pouvoir faire :

```bash
docker-compose up -d
```

L'application doit être disponible à l'adresse `http://localhost:3000/`.

### Ajout des dépendances

Maintenant que nous avons une application qui tourne, nous allons ajouter les dépendances pour la librairie *Apollo server* :

```bash
docker-compose exec gateway yarn add apollo-server apollo-server-express graphql --save
```

Enfin, nous devons créer un serveur `ApolloServer` et l'ajouter à notre application. Pour ceci, nous allons modifier le fichier `src/index.js` :

```js
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const PORT = 3000;
const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!'
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);
```

Ça y est, nous avons un serveur GraphQL qui tourne ! 🚀 

À cette étape, nous devons pouvoir faire une query et avoir un résultat, comme ceci :

![graphql-init]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/graphql.png)

### Création du schéma des données

Comme vous pouvez constater ici, lors de la création d'ApolloServer nous devons lui passer nos types & resolvers.
Au fur et à mesure que notre application grandit, leur nombre augmente aussi.
Par conséquence, nous ne pouvons pas les laisser dans le fichier `src/index.js` comme ci-dessus, mais nous allons plutôt séparer tout cela dans des fichiers et dossiers afin de structurer notre application. Je vais créer les dossiers suivants à l'intérieur de  `src` :

- le dossier `definitions` contiendra les Queries, Mutations et les types que nous allons définir dans l'application
- le dossier `dataSources` contiendra les différentes APIs REST que nous allons appeler
- le dossier `resolvers` quant à lui nous permettra d'implémenter les resolvers de nos différents types
- enfin, je vais créer un dossier `helpers` dans lequel je mettrai notamment un `GraphqlHelper` qui me permettra de charger les fichiers qui sont dans les dossiers ci-dessus. Le `GraphqlHelper` parcourt les dossiers de façon reccursive et charge tous les fichiers dans le schéma.

Pour implémenter cette structure de dossier, nous allons avoir besoin de modifier notre code.
Pour gagner du temps, je vous mets à disposition [ici](https://github.com/MarieMinasyan/apollo-tutorial/commit/d8a44ac89f98abb1eda8ceda2b3c6bf08a273c91) le helper et tous les fichiers modifiés.
J'ai simplement déplacé la Query `hello` dans le fichier `src/definitions/Query.graphql` et le resolver dans le fichier `src/resolvers/hello.js`.

Et nous allons mettre à jour notre fichier `src/index.js`:

```js
import express from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';

const PORT = 3000;
const app = express();

const GraphQLHelper = require('./helpers/graphql');

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: GraphQLHelper.typeDefs,
    resolvers: GraphQLHelper.resolvers,
  }),
  dataSources: () => GraphQLHelper.dataSources,
});

server.applyMiddleware({ app });

app.listen({ port: PORT, expressApp: app }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);

app.get('/', (req, res) => res.send('Hello World!'));
```

Nous utilisons `makeExecutableSchema` pour construire notre schéma graphql qui est détaillé [ici](https://www.apollographql.com/docs/graphql-tools/generate-schema).

### Rest data source

Tout d'abord nous allons ajouter la dépendance suivante :
```bash
docker-compose exec gateway yarn add apollo-datasource-rest --save
```

Cette librairie met à disposition une classe RESTDataSource qui permet de faire des appels REST facilement.

L'API de la NASA met à disposition plein de ressources. Imaginons que nous avons une page sur notre site où nous allons afficher sur la homepage de notre application :
* la photo du jour APOD
* une image aléatoire qui correspond à une recherche que nous effectuons

Nous allons donc utiliser les endpoints suivants :
- [APOD](https://api.nasa.gov/api.html#apod) - Astronomy Picture of the Day
- Une [bibliothèque d'images](https://api.nasa.gov/api.html#Images) sur laquelle nous pouvons faire des recherches texte

Dans cet exercice nous allons créer 2 DataSource différents pour ces 2 besoins pour plusieurs raisons :
- leurs URLs sont différentes
- on peut imaginer implémenter un certain nombre de méthodes pour chacune des ces APIs
- afin d'éviter de nous retrouver avec une classe de plusieurs centaines de lignes

Rappelez-vous, certaines APIs de la NASA demandent une authentification via un paramètre dans l'URL.
Pour faire cela pour toutes les URLs que nous allons appeler, nous pouvons surcharger la méthode `willSendRequest` de la classe `RESTDataSource`.
Dans le cas où on aurait plusieurs classes avec le même comportement, pour éviter de dupliquer du code, je peux créer la classe suivante :

```js
// src/dataSources/NASARESTDataSource.js
const { RESTDataSource } = require('apollo-datasource-rest');
const API_KEY = 'DEMO_KEY';

class NASARESTDataSource extends RESTDataSource {
  willSendRequest(request) {
    request.params.append('api_key', API_KEY);
  }
}

module.exports = NASARESTDataSource;
```

Ainsi, voici ma classe data source pour récupérer les APODs :

```js
// src/dataSources/apod.js
import NASARESTDataSource from './NASARESTDataSource';

class APODRESTDataSource extends NASARESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.nasa.gov/';
  }

  getDailyImage() {
    return this.get('planetary/apod');
  }
}

module.exports = APODRESTDataSource;

```

Sachez que les méthodes `get`, `put`, `post`, etc. sont toutes disponibles dans la classe RESTDataSource et retournent des *Promises*.

Je vous invite désormais à mettre en place le data source pour envoyer des requêtes à la bibliothèque d'images.
Pour information, cette API ne demande pas d'authentification.
Vous devriez avoir une classe comme ceci :

```js
// src/dataSources/imageLibrary.js
const { RESTDataSource } = require('apollo-datasource-rest');

class ImageLibraryRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://images-api.nasa.gov/';
  }

  search(searchString) {
    return this.get(`search?q=${searchString}`);
  }
}

module.exports = ImageLibraryRESTDataSource;
```

### Types de données

La prochaine étape est de définir les types des données que nous allons avoir. Bien sûr, cela dépend des APIs que vous avez à disposition, et surtout de la *façon dont vous allez afficher les données sur le front*.

Ainsi, notre type pourrait ressembler à ceci :

```js
// src/definitions/APOD.graphql
type APOD {
  title: String!
  url: String!
  date: String
  explanation: String
  type: String
}
```

Et pour l'image aléatoire :

```js
// src/definitions/NASAImage.graphql
type NASAImage {
  title: String!
  description: String!
  url: String!
}
```

Notez que les champs suivis d'un `!` après leur type sont des champs que l'on définit comme obligatoires (non nulls) dans notre schéma, nous devons donc nous assurer que les APIs retournent toujours ces champs pour éviter des exceptions.

Pour voir tous les types possibles, référez-vous à la [documentation Apollo](https://www.apollographql.com/docs/apollo-server/essentials/schema#scalar).

Maintenant, nous pouvons déclarer nos nouvelles requêtes disponibles. Avec GraphQL, cela se fait dans le fichier suivant :

```js
// src/definitions/Query.graphql
type Query {
    apod: APOD
    randomImage(search: String!): NASAImage
}
```

Ici, nous déclarons toutes les requêtes qui seront disponibles dans l'application, avec les paramètres qu'elles recoivent et ce qu'elles retournent.

Aussi, dans ce tutoriel nous allons parler des *Queries* uniquement, car il a pour but de vous présenter comment améliorer les performances de votre application. Néanmoins, je vous invite à lire [la documentation suivante](https://graphql.github.io/graphql-js/mutations-and-input-types/) pour voir comment fonctionnent les *Mutations*.

Si vous testez les APIs de la NASA, vous allez remarquer que nous avons nommé nos champs de la façon dont nous allons les utiliser sur le front, ce qui ne correspond pas forcément à ce que retourne l'API. C'est donc dans nos resolvers que nous allons mapper les champs.

### Resolvers

Les *resolvers* font le lien entre les *Query* et les *DataSource*.
Chaque type et chaque query doit avoir son resolver.

Commençons par les APODs.
Dans le dossier `src/resolvers` je vais créer un fichier `apod.js` :

```js
'use strict';

const resolvers = {
  Query: {
    apod: (parent, args, context, info) => {
      return context.dataSources.APODRESTDataSource.getDailyImage();
    }
  },
};

module.exports = resolvers;
```

Vous pouvez voir dans cet exemple que depuis une Query nous avons accès au parent, aux arguments de la requête, au contexte (qui nous donne accès aux data sources, aux extensions éventuelles, etc.) et aux informations de notre appel (qui contient le type de retour attendu, le type de parent, le cacheControl, etc.).

Néanmoins, pour une meilleure lisibilité, le plus souvent nous allons écrire nos resolvers sous cette forme :
```js
  Query: {
    apod: (_, __, { dataSources: { APODRESTDataSource } }) => APODRESTDataSource.getDailyImage(),
  },
```

Nous pouvons enfin tester notre code sur l'URL [http://localhost:3000/graphql](http://localhost:3000/graphql) :

```js
query apod {
  apod {
    title
  }
}
```

À ce stade vous devriez avoir un résultat :

![graphql-response1]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/result1.png)

Et que se passe-t-il si je demande par exemple le champ `type` ? Il est null, car l'API ne retourne pas de champ avec ce nom, ce champ correspond à `media_type` dans le retour de l'API. Pour mapper notre entité, nous pouvons faire ceci :

```js
'use strict';

const resolvers = {
  APOD: {
    type: ({ media_type }) => media_type,
    // équivalent de "type: data => data.media_type,"
  },
  Query: {
    apod: (_, __, { dataSources: { APODRESTDataSource } }) => APODRESTDataSource.getDailyImage(),
  },
};

module.exports = resolvers;
```

Et maintenant, essayez de mettre en place le resolver pour l'API de la bibliothèque d'images.
Le résultat devrait être proche de celui-ci :

```js
'use strict';

const resolvers = {
  NASAImage: {
    title: ({ data}) => data[0].title,
    description: ({ data}) => data[0].description,
    url: ({ links}) => links[0].href,
  },
  Query: {
    randomImage: (_, { search }, { dataSources: { ImageLibraryRESTDataSource } }) => ImageLibraryRESTDataSource.search(search).then(result => {
      if (result.collection.metadata.total_hits === 0) {
        return null;
      }

      return result.collection.items[Math.floor(Math.random()*result.collection.metadata.total_hits)];
    }),
  },
};

module.exports = resolvers;
```

![graphql-response2]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/result2.png)

*Exercice : pour pratiquer davantage ce que nous venons de mettre en place, je vous invite à écrire le type & resolver pour cette API - la liste des [astéroïdes](https://api.nasa.gov/api.html#NeoWS) près de la terre.*