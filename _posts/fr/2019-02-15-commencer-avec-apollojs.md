---
layout: post
title: Apollojs, mise en place d'une API GraphQL
excerpt: "Dans cet article nous partageons les bonnes pratiques que nous avons mis en place au sein de nos projets GraphQL. Pour faire simple nous allons mettre en place une API GraphQL devant une API Rest existante, l'ensemble des développements se fera en Node.js avec Apollo GraphQL."
authors:
    - fpasquet
    - captainjojo
lang: fr
permalink: /fr/commencer-avec-apollojs/
categories:
    - GraphQL
tags:
    - apollo
    - graphql
cover: /assets/2019-02-05-commencer-avec-apollojs/cover.jpg
---

Depuis un an nous utilisons GraphQL dans l'ensemble de nos projets au studio. Nous avons commencé directement avec l'implémentation Nodejs et AppolojS qui était en version 1. Depuis juin la version nous a permis de mettre en place une architecture plus solide et plus simple à maintenir.

La plupart de nos projets n'étant pas "from scratch" nous avons eu à migrer des API Rest en API GraphQL le plus rapidement possible. Il nous arrive aussi de mettre une surcouche GraphQL aux apis externes que nous devons utiliser.

Dans cet article nous partageons les bonnes pratiques que nous avons mis en place au sein de nos projets GraphQL. Pour faire simple nous allons mettre en place une API GraphQL devant une API Rest existante, l'ensemble des développements se fera en `Node.js` avec [`Apollo GraphQL`](https://www.apollographql.com/).

# Serveur Apollo GraphQL

## Sommaire

- [Comment structurer son projet](#comment-structurer-son-projet)
- [Implémenter notre schéma GraphQL](#implementer-notre-schema-graphql)
- [Créer un dataSource REST](#creer-un-datasource-rest)
- [Analyser les resolvers GraphQL](#analyser-les-resolvers-graphql)
- [Optimiser les dataSources GraphQL](#optimiser-les-datasources-graphql)

## Comment structurer son projet

La première chose que nous avons optimisée c'est l'arborescence du projet, en tant que développeur nous savons qu'il faut avoir une architecture claire et simple pour permettre à un développeur de travailler le plus rapidement possible et de ne pas avoir à chercher où placer son code.

Nous allons tout d'abord commencer par cloner le projet starter kit qui se trouve sur notre [github](https://github.com/fpasquet/apollo-server-starter-kit). Vous pouvez aussi le tester directement sur [codesandbox](https://codesandbox.io/s/github/eleven-labs/apollo-server-starter-kit/tree/master).

À quoi ressemble ce starter kit et que contient-il ? Voici l'arborescence de notre serveur Apollo :

```bash
.
├── src
│   ├── dataLayers
│   ├── dataSources
│   ├── definitions
│   ├── resolvers
│   ├── directives
│   ├── subscriptions
│   └── index.js
└── package.json
```

Nous retrouvons ici :

- `"src/index.js"` est notre point d'entrée pour notre API GraphQL, il contient la configuration du server GraphQL
- `"src/definitions/"` comprendra tous nos fichiers définissant notre schéma GraphQL (`Queries`, `Mutations`, `Types`, `Inputs`, `Interfaces`, `Directives`, `Enums` ...)
- `"src/resolvers/"`, `"src/directives/"` et `"src/subscriptions/"` contiendra nos différents résolveurs
- `"src/dataLayers"` contiendra tout ce qui concerne la couche d'abstractions de données, dans notre exemple nous en aurons deux, une pour le REST et une autre pour le SQL avec `Knex.js`.
- `"src/dataSources/"` quant à lui incluera les classes qui encapsulent l'extraction des données. Il peut être lié à une API REST (RESTDataSource), une base de données... Apollo Server implémente une classe qui intègre la mise en cache, la dé-duplication et le traitement des erreurs. Dans chacune des classes, nous pourrons ajouter des dataLoaders qui optimiseront notre API GraphQL. Les dataLoaders sont des fonctions de dé-duplication et du traitement par lots d'objets avec un système de cache intégré.

## Implémenter notre schéma GraphQL

Vous pourrez lire dans de nombreux articles GraphQL que la première chose à faire est de définir son schéma, on dit que GraphQL est `schema first`.

Petit conseil sur l'implémentation de votre schéma, ne reprenez pas la structure et le nommage de votre API REST, car le nommage de votre schéma GraphQL doit être fonctionnel et non technique. Une personne non technique doit comprendre du premier coup d'oeil votre API GraphQL, rien quand regardant votre schéma.

L'API GraphQL sera sur le thème de Game Of Throne, on affichera les différents personnages et les différentes maisons. Pour ce faire nous utiliserons l'API REST qui se trouve sur le dépôt [github](https://github.com/fpasquet/got-api).


### Ajoutons les types

Ajoutons notre type `Character` dans le fichier `src/definitions/Type/Character.graphql` :

```graphql
type Character {
  key: ID!
  name: String!
  imageUrl: String
  father: Character
  mother: Character
  spouse: Character
  childrens: [Character]
  house: House
}
```

Ajoutons notre type `House` dans le fichier `src/definitions/Type/House.graphql` :

```graphql
type House {
  key: ID!
  name: String!
  imageUrl: String
  lord: Character
  heirs: [Character]
  characters: [Character]
}
```

Ajoutons nos queries dans le fichier `src/definitions/Query.graphql` :

```graphql
extend type Query {
  characters: [Character]
  character(key: ID!): Character
  houses: [House]
  house(key: ID!): House
}
```

Pour plus de détails sur l'implémentation des types graphQL nous vous invitons à lire la documentation [ici](https://graphql.org/learn/schema/#type-system).

Une démo de cette étape est présente sur [CodeSandbox](https://codesandbox.io/s/github/eleven-labs/article-starter-kit-graphql/tree/step/definitions).

## Créer un dataSource REST

Les dataSource Apollo permettent d'encapsuler la récupération des données pour un service particulier (Ex: Api Rest, BDD Mysql, etc ...). Les dataSource prennent en compte directement la gestion du cache, la dé-duplication ainsi que le traitement des erreurs. Vous n'avez donc plus besoin d'écrire le code spécifique pour l'interaction avec votre serveur REST, Apollo s'occupe de gérer les interactions.

Nous allons donc créer deux dataSource REST un pour les personnages et l'autre pour les maisons.

Ajoutons notre premier DataSource pour les personages dans le fichier `src/dataSources/CharacterRESTDataSource.js`:

```js
const { compact } = require("lodash");
const { RESTDataSource } = require("apollo-datasource-rest")

class CharacterRESTDataSource extends RESTDataSource {
  get baseURL() {
      return this.context.ENDPOINT_GOT_API;
  }

  get characters() {
    return this.get("/characters");
  }

  findCharacterByKey(key) {
    return this.get(`/character/${key}`).catch(error => {
      if (error.extensions.response.status === 404) {
        return null;
      }
      return error;
    })
  }

  async filterCharactersByKeys(keys) {
    let characters = keys.map(key => this.findCharacterByKey(key));
    return Promise.all(characters).then(([...results]) => compact(results));
  }

  async filterCharactersByHouseKey(houseKey) {
    const characters = await this.characters;
    return characters.filter(character => character.royalHouseKey === houseKey);
  }
}

module.exports = CharacterRESTDataSource;
```
Ajoutons notre deuxième DataSource pour les maisons dans le fichier `src/dataSources/HouseRESTDataSource.js` :

```js
const { RESTDataSource } = require("apollo-datasource-rest");

class HouseRESTDataSource extends RESTDataSource {
    get baseURL() {
        return this.context.ENDPOINT_GOT_API;
    }

    get houses() {
        return this.get("/houses");
    }

    findHouseByKey(key) {
        return this.get(`/house/${key}`).catch(error => {
            if (error.extensions.response.status === 404) {
                return null;
            }
            return error;
        })
    }
}

module.exports = HouseRESTDataSource;
```

La démo [CodeSandbox](https://codesandbox.io/s/github/eleven-labs/article-starter-kit-graphql/tree/step/dataSources).

## Ajoutons nos resolvers

Les resolvers sont la brique centrale de GraphQL, c'est ici que vous expliquez à votre serveur comment récupérer chaque Query et Type que vous avez définis dans votre schéma.

Comme vous le constatez la configuration des resolvers doit suivre votre configuration de typage.
Ici dans les resolvers vous n'avez plus qu'à appeler votre Datasource qui se chargera de récupérer les données.

Ajoutons notre premier `resolver` pour les personnages dans le fichier `src/resolvers/character.js` :

```js
const { ApolloError } = require("apollo-server");

const resolvers = {
  Query: {
    characters: (
      parent,
      args,
      { dataSources: { CharacterRESTDataSource } },
      info
    ) => CharacterRESTDataSource.characters,
    character: (
      parent,
      { key },
      { dataSources: { CharacterRESTDataSource } },
      info
    ) => CharacterRESTDataSource.findCharacterByKey(key).then(character => character ? character : new ApolloError("Character not found.", "RESOURCE_NOT_FOUND")),
  },
  Character: {
    father: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.fatherKey ? CharacterRESTDataSource.findCharacterByKey(parent.fatherKey) : null,
    mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.motherKey ? CharacterRESTDataSource.findCharacterByKey(parent.motherKey) : null,
    spouse: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.spouseKey || parent.queenKey ? CharacterRESTDataSource.findCharacterByKey(parent.spouseKey || parent.queenKey) : null,
    childrens: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.childrensKey ? CharacterRESTDataSource.filterCharactersByKeys(parent.childrensKey) : null,
    house: (parent, args, { dataSources: { HouseRESTDataSource } }) => parent.royalHouseKey ? HouseRESTDataSource.findHouseByKey(parent.royalHouseKey) : null,
  }
};

module.exports = resolvers;
```

Ajoutons notre deuxième `resolver` pour les maisons dans le fichier `src/resolvers/house.js` :

```js
const { ApolloError } = require("apollo-server");

const resolvers = {
  Query: {
    houses: async (
      parent,
      args,
      { dataSources: { HouseRESTDataSource } },
      info
    ) => HouseRESTDataSource.houses,
    house: (
      parent,
      { key },
      { dataSources: { HouseRESTDataSource } },
      info
    ) => HouseRESTDataSource.findHouseByKey(key).then(house => house ? house : new ApolloError("House not found.", "RESOURCE_NOT_FOUND")),
  },
  House: {
    lord: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.lordKey ? CharacterRESTDataSource.findCharacterByKey(parent.lordKey) : null,
    heirs: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.heirsKey ? CharacterRESTDataSource.filterCharactersByKeys(parent.heirsKey) : null,
    characters: (parent, args, { dataSources: { CharacterRESTDataSource } }) => CharacterRESTDataSource.filterCharactersByHouseKey(parent.key),
  }
};

module.exports = resolvers;
```

Une fois vos resolvers terminés vous pouvez les tester dans l'interface `playground` qui est fournie directement dans Apollo. Il s'agit d'un IDE permettant de lancer des Query et Mutation sur votre API. Vous pouvez aussi voir la documentation qui est autogénérée grâce aux typages fort de votre API GraphQL.

```graphql
query CHARACTERS(
  $withMother: Boolean = false
  $withFather: Boolean = false
  $withSpouse: Boolean = false
  $withChildrens: Boolean = false
  $withHouse: Boolean = false
) {
  characters {
    ...FullCharacter
  }
}

query HOUSES(
  $withLord: Boolean = false
  $witHeirs: Boolean = false
  $witCharacters: Boolean = false
) {
  houses {
    ...FullHouse
  }
}

fragment FullCharacter on Character {
  ...Character
  mother @include(if: $withMother) {
    ...Character
  }
  father @include(if: $withFather) {
    ...Character
  }
  spouse @include(if: $withSpouse) {
    ...Character
  }
  childrens @include(if: $withChildrens) {
    ...Character
  }
  house @include(if: $withHouse) {
    ...House
  }
}

fragment FullHouse on House {
  key
  name
  imageUrl
  lord @include(if: $withLord) {
    ...Character
  }
  heirs @include(if: $witHeirs) {
    ...Character
  }
  characters @include(if: $witCharacters) {
    ...Character
  }
}

fragment Character on Character {
  key
  name
  imageUrl
}

fragment House on House {
  key
  name
  imageUrl
}
```

Dans l'exemple de query nous utilisons des `fragment` qui agissent comme des `include`. Cela permet de ne pas répéter plusieurs fois le même code dans des Queries. L'utilisation est assez simple une fois votre `fragment` créé vous pouvez l'utiliser dans vos queries en utilisant `...`, ça fonctionne de la même manière que l'affectation par décomposition ([https://developer.mozilla.org/fr/docs/Web/JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition)).

La démo [CodeSandbox](https://codesandbox.io/s/github/eleven-labs/article-starter-kit-graphql/tree/step/resolvers).

## Analyser les resolvers GraphQL

Maintenant que notre API est prête à être utilisée, nous devons mettre en place du monitoring. Cela va nous permettre de suivre les performances et d'optimiser les points de congestion.

Pour cela nous allons créer une extension, qui va nous permettre d'analyser notre API GraphQL, et par la suite de l'optimiser.

Ajoutons un collecteur de données pour le Datasource REST dans le fichier `src/dataLayers/restCollector.js`:

```js
class RestCollector {
  constructor() {
    this._initializeData();
  }

  _initializeData() {
    this.globalExecutionTimeRequest = 0;
    this.maxExecutionTimeRequest = null;
    this.minExecutionTimeRequest = null;
    this.requests = [];
  }

  reset() {
    this._initializeData();
  }

  addRequest({ executionTimeRequest, request }) {
    if (
      !this.maxExecutionTimeRequest ||
      executionTimeRequest > this.maxExecutionTimeRequest
    ) {
      this.maxExecutionTimeRequest = executionTimeRequest;
    }
    if (
      !this.minExecutionTimeRequest ||
      executionTimeRequest < this.minExecutionTimeRequest
    ) {
      this.minExecutionTimeRequest = executionTimeRequest;
    }
    this.globalExecutionTimeRequest += executionTimeRequest;
    this.requests.push({
      executionTimeRequest: `${executionTimeRequest} ms`,
      request
    });

    return this;
  }

  static getInstance() {
    if (!RestCollector.instance) {
      RestCollector.instance = new RestCollector();
    }

    return RestCollector.instance;
  }
}

module.exports = RestCollector.getInstance();
```
Cela va nous permettre de récupérer des données de performance lors de chaque appel à notre ApiRest.

Les appels étant réalisés dans notre DataSource, nous allons étendre notre RestDataSource pour ajouter notre collecteur, pour cela on va créer le fichier `src/dataLayers/restDataSource.js`:

```js
const { AuthenticationError, ForbiddenError, ApolloError } = require("apollo-server");
const { RESTDataSource: BaseRESTDataSource } = require('apollo-datasource-rest');
const RestCollector = require('./restCollector');

class RESTDataSource extends BaseRESTDataSource {

    willSendRequest(request) {
        this.startTime = process.hrtime();
        this.request = request;
    }

    getErrorFromResponseAndBody(response, body) {
        return {
            code: "INTERNAL_SERVER_ERROR",
            message: `${response.status}: ${response.statusText}`
        };
    }

    errorFromResponse(response, body) {
        const { message, code } = this.getErrorFromResponseAndBody(response, body);

        let error;
        if (response.status === 401) {
            error = new AuthenticationError(message);
        } else if (response.status === 403) {
            error = new ForbiddenError(message);
        } else {
            error = new ApolloError(message, code);
        }

        Object.assign(error.extensions, {
            response: {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                body,
            },
        });

        return error;
    }

    async didReceiveResponse(response, _request) {
        const hrend = process.hrtime(this.startTime);
        const body = await this.parseBody(response);

        RestCollector.addRequest({
            executionTimeRequest: hrend[1] / 1000000,
            request: {
                url: response.url,
                method: this.request.method,
                params: this.request.params,
                headers: this.request.headers,
                status: response.status,
                statusText: response.statusText,
                error: !response.ok ? this.getErrorFromResponseAndBody(response, body) : null
            }
        });

        if (response.ok) {
            return body;
        } else {
            throw this.errorFromResponse(response, body);
        }
    }
}

module.exports = RESTDataSource;
```

Maintenant que chaque `request` nous renvoie des valeurs de performance nous voulons les récupérer pour les ajouter dans la réponse GraphQL.

Ajoutons une extension dans le fichier `src/dataLayers/restExtension.js` qui permettra d'ajouter les éléments dans notre réponse GraphQL.

```js
const RestCollector = require('./restCollector');

class RestExtension {

    willSendResponse(graphqlResponse) {
        let logging = `--------- START_MONITORING_REST ---------\n`;
        logging += `Duration min request: ${RestCollector.minExecutionTimeRequest} ms\n`;
        logging += `Duration max request: ${RestCollector.maxExecutionTimeRequest} ms\n`;
        logging += `Duration total request: ${RestCollector.globalExecutionTimeRequest} ms\n`;
        logging += `Numbers of requests: ${RestCollector.requests.length}\n`;
        logging += `Requests REST: ${JSON.stringify(RestCollector.requests)}\n`;
        logging += `--------- END_MONITORING_REST ---------`;
        console.log(logging);

        RestCollector.reset();

        return graphqlResponse;
    }

    format() {
        return ['rest', {
            minExecutionTimeRequest: RestCollector.minExecutionTimeRequest,
            maxExecutionTimeRequest: RestCollector.maxExecutionTimeRequest,
            globalExecutionTimeRequest: RestCollector.globalExecutionTimeRequest,
            numbersOfRequests: RestCollector.requests.length,
            requests: RestCollector.requests,
        }];
    }
}

module.exports = RestExtension;
```

Et pour finir on exporte tout dans un fichier à la racine `src/dataLayers/index.js`:

```js
const RestExtension = require("./restExtension");
const RESTDataSource = require('./restDataSource');

module.exports = {
    RestExtension,
    RESTDataSource
}
```

Et maintenant nous l'activons en modifiant notre serveur apollo, via le fichier  `index.js` :

```js
...
const { RestExtension } = require("./dataLayers/rest");
...

const server = new ApolloServer({
  ...
  extensions: [() => new RestExtension()],
  ...
});
```

Et modifier nos deux RESTDataSource en important l'extend de notre DataSource.

```js
const { RESTDataSource } = require("apollo-datasource-rest");
```

par

```js
const { RESTDataSource } = require("../dataLayers/rest");
```

Après avoir activé l'extension on va constater que dans les réponses de chacun de nos appels, on peut voir apparaître un objet extensions qui contient les données de performance :

```json
{
    "data": {...},
    "extensions": {
        "rest": {
            "minExecutionTimeRequest": 0.44865,
            "maxExecutionTimeRequest": 561.711479,
            "globalExecutionTimeRequest": 171837.08310799988,
            "numbersOfRequests": 396
        },
        "requests": [
            {
                "executionTimeRequest": "43.088889 ms",
                "request": {
                    "url": "http://localhost:8080/api/characters",
                    "method": "GET",
                    "params": {},
                    "headers": {},
                    "status": 200,
                    "statusText": "OK",
                    "error": null
                }
            },
            {
                "executionTimeRequest": "294.645117 ms",
                "request": {
                    "url": "http://localhost:8080/api/house/L2luZGV4LnBocC9Ib3VzZV9UYXJnYXJ5ZW4=",
                    "method": "GET",
                    "params": {},
                    "headers": {},
                    "status": 200,
                    "statusText": "OK",
                    "error": null
                }
            },
            ...
        ]
    }
}
```

Comme vous pouvez le constater nous avons un temps d'exécution un peu long... Dans la prochaine étape nous verrons comment l'optimiser.

La démo [CodeSandbox](https://codesandbox.io/s/github/eleven-labs/article-starter-kit-graphql/tree/step/rest-extension).

## Optimiser les dataSources GraphQL

Nous allons donc optimiser nos DataSources en implémentant des DataLoaders :

Les Dataloaders sont des utilitaires génériques fournis par Facebook sur le projet github suivant : [https://github.com/facebook/dataloader](https://github.com/facebook/dataloader). Il permet de gérer la récupération des sources de données (ici via une ApiRest) en utilisant du cache et de la récupération via `batch`. Cela permet de gagner en performance.

On commencera par notre dataSource des personnages, `src/dataSource/CharacterRESTDataSource.js`:

```js
const { compact } = require("lodash");
const DataLoader = require("dataloader");
const { RESTDataSource } = require("../dataLayers/rest");

class CharacterRESTDataSource extends RESTDataSource {
    get baseURL() {
        return this.context.ENDPOINT_GOT_API;
    }

    get limitRequest() {
        return this.context.LIMIT_REQUEST || 25;
    }

    get characters() {
        return this.get("/characters");
    }

    findCharacterByKey(key) {
        return this.dataLoaders.characterByKey.load(key);
    }

    async filterCharactersByKeys(keys) {
        let characters = keys.map(key => this.findCharacterByKey(key));
        return Promise.all(characters).then(([...results]) => compact(results));
    }

    async filterCharactersByHouseKey(houseKey) {
        return this.characters.then(characters => characters.filter(character => character.royalHouseKey === houseKey));
    }

    get dataLoaders() {
        if (!this._dataLoaders) {
            this._dataLoaders = {
                characterByKey: this._characterByKeyDataLoader
            }
        }

        return this._dataLoaders;
    }

    get _characterByKeyDataLoader() {
        return new DataLoader(keys => {
            let promise;
            if (keys.length > this.limitRequest) {
                promise = this.characters;
            } else {
                const promises = keys.map(key => this.get(`/character/${key}`).catch(error => {
                    if (error.extensions.response.status === 404) {
                        return {};
                    }
                    return error;
                }));
                promise = Promise.all(promises);
            }

            return promise.then(items => keys.map(key => items.find(({ key: currentKey }) => currentKey === key)));
        });
    }
}

module.exports = CharacterRESTDataSource;
```

Puis celui des maisons, `src/dataSource/HouseRESTDataSource.js`:

```js
const DataLoader = require("dataloader");
const { RESTDataSource } = require("../dataLayers/rest");

class HouseRESTDataSource extends RESTDataSource {
    get baseURL() {
        return this.context.ENDPOINT_GOT_API;
    }

    get limitRequest() {
        return this.context.LIMIT_REQUEST || 25;
    }

    get houses() {
        return this.get("/houses");
    }

    findHouseByKey(key) {
        return this.dataLoaders.houseByKey.load(key);
    }

    get dataLoaders() {
        if (!this._dataLoaders) {
            this._dataLoaders = {
                houseByKey: this._houseByKeyDataLoader
            }
        }

        return this._dataLoaders;
    }

    get _houseByKeyDataLoader() {
        return new DataLoader(keys => {
            let promise;
            if (keys.length > this.limitRequest) {
                promise = this.houses;
            } else {
                const promises = keys.map(key => this.get(`/house/${key}`).catch(error => {
                    if (error.extensions.response.status === 404) {
                        return {};
                    }
                    return error;
                }));
                promise = Promise.all(promises);
            }

            return promise.then(items => keys.map(key => items.find(({ key: currentKey }) => currentKey === key)));
        });
    }
}

module.exports = HouseRESTDataSource;
```
Donc notre cas, le Dataloader nous permet de récupérer les `character` de façon optimisée, et nous permet d'effectuer moins de requêtes sur notre API.

Grace à cela vous pouvez constater une amélioration des performances de la query.

```json
{
    "data": {...},
    "extensions": {
        "rest": {
          "minExecutionTimeRequest": 108.412019,
          "maxExecutionTimeRequest": 190.706104,
          "globalExecutionTimeRequest": 1727.125432,
          "numbersOfRequests": 14,
          "requests": [
            {
              "executionTimeRequest": "187.381987 ms",
              "request": {
                "url": "https://game-of-throne-api.appspot.com/api/characters",
                "method": "GET",
                "params": {},
                "headers": {},
                "status": 200,
                "statusText": "OK",
                "error": null
              }
            },
            {
              "executionTimeRequest": "108.412019 ms",
              "request": {
                "url": "https://game-of-throne-api.appspot.com/api/house/L2luZGV4LnBocC9Ib3VzZV9EdXJyYW5kb24=",
                "method": "GET",
                "params": {},
                "headers": {},
                "status": 200,
                "statusText": "OK",
                "error": null
              }
            },
            ...
        ]
    }
}
```

La démo [CodeSandbox](https://codesandbox.io/s/github/eleven-labs/article-starter-kit-graphql/tree/step/optimization-with-dataLoaders).

### Conclusion

Vous avez ici un exemple clair et poussé d'une API GraphQL. Nous travaillons actullement sur la mise en place de tooling pour gérer le monitoring et la mise en cache. Nous vous invitons à suivre notre blog et à participer à la communauté GraphQL !
