---
contentType: tutorial-step
tutorial: graphql-avec-apollo
slug: resolver-des-queries
title: Resolver des queries
---
## Création du type Query

Avant de mettre en place les `resolvers` pour les query en lecture, vous devez créer le type query.

Il faut ensuite créer un type avec l'ensemble des fonctions que vous souhaitez avoir. Nous allons :

- récupérer l'ensemble des astronautes
- récupérer un astronaute
- récupérer une planète

Ajoutez le fichier `schemas.js` à la racine de votre projet. Importez l'ensemble des types que nous avons défini à l'étape précédente :

```javascript
import Astronaute from './typedefs/astronaute';
import Planet from './typedefs/planet';
import Grade from './typedefs/grade';

const RootQuery = `
  type RootQuery {
    astronaute(id: Int!): Astronaute,
    astronautes: [Astronaute]
    planet(id: Int!): Planet
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;
```

## Configuration de GraphQL

Toujours dans le même fichier `schemas.js` vous devez dire à votre serveur GraphQL où est votre schéma.
Pour cela vous devez ajouter le module `graphql-tools` :

```
yarn add graphql-tools
```

Ce module expose la fonction `makeExecutableSchema` qui prend en paramètre vos types.

Vous devriez avoir le code suivant :

```javascript
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolver';
import Astronaute from './typedefs/astronaute';
import Planet from './typedefs/planet';
import Grade from './typedefs/grade';

const RootQuery = `
  type RootQuery {
    astronaute(id: Int!): Astronaute,
    astronautes: [Astronaute]
    planet(id: Int!): Planet
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export default makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, Astronaute, Planet, Grade],
  resolvers: resolvers,
});
```

## Ajoutez le resolver

Ajoutez un fichier `resolver.js` contenant seulement :

```javascript
export const resolvers = {}
```

## Activez le serveur

Il nous reste à indiquer à GraphQL comment récupérer notre schéma.
Dans le fichier `index.js` vous devez importer ledit schéma :

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schemas';

const PORT = 3000;

const app = express();

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));


app.listen(PORT);
```

Nous ajoutons au même moment l'IDE GraphiQL qui est contenu dans la librairie Apollo. L'IDE permet d'afficher directement la documentation, ainsi que d'effectuer les query.

Si tout est ok, vous devriez avoir accès à l'url suivante [http://127.0.0.1:3000/graphiql](http://127.0.0.1:3000/graphiql) et voir la doucmentation (à droite).

![Documentation]({BASE_URL}/imgs/tutorials/2018-03-28-graphql-avec-apollo/documentation.png)

## Création des resolvers

Si vous essayez la query :

```json
{
  astronautes {
    id
  }
}
```

Vous devriez voir la réponse suivante :

```json
{
  "data": {
    "astronautes": null
  }
}
```

Et oui, pour l'instant vous n'avez aucun resolver !

Le resolver est le code qui permet de récuperer la donnée dans la base.

Dans un dossier `resolvers` vous devez ajouter le fichier `astronautes.js` avec le code suivant :

```javascript
import pg from './../pg';
import Astronaute from '../typedefs/astronaute';

const resolvers = {
    RootQuery: {
        async astronautes() {
            return await pg.select().table('astronaute');
        }
    },
};

export default resolvers;
````

Dans le fichier `resolver.js` il vous faut ajouter le resolver que nous venons de définir :

```javascript
import AstronauteResolver from './resolvers/astronaute';

export const resolvers = AstronauteResolver;
```

Si tout est ok la réponse à votre requête est :

```json
{
  "data": {
    "astronautes": []
  }
}
```

Et si vous ajoutez des astronautes dans votre base de donnnées et changer la requête en :

```javascript
{
  astronautes {
    id,
    pseudo
  }
}
```

la réponse est donc :

```json
{
  "data": {
    "astronautes": [
      {
        "id": 1,
        "pseudo": "CaptainJojo"
      },
      {
        "id": 2,
        "pseudo": "Pouzor"
      },
      {
        "id": 3,
        "pseudo": "Franky"
      }
    ]
  }
}
```

Maintenant nous allons modifer le resolver pour récupérer via l'id :

```javascript
import pg from './../pg';
import Astronaute from '../typedefs/astronaute';

const resolvers = {
    RootQuery: {
        async astronautes() {
            return await pg.select().table('astronaute');
        },
        async astronaute(obj, args, context, info) {
            return (await pg
                .select()
                .table('astronaute')
                .where('id', args.id)
                .limit(1)).pop();
        },
    },
};

export default resolvers;
```

Puis nous allons résoudre la récupération du `grade` et de la `planet` :

```javascript
import pg from './../pg';
import Astronaute from '../typedefs/astronaute';

const resolvers = {
    RootQuery: {
        async astronautes() {
            return await pg.select().table('astronaute');
        },
        async astronaute(obj, args, context, info) {
            return (await pg
                .select()
                .table('astronaute')
                .where('id', args.id)
                .limit(1)).pop();
        },
    },
    Astronaute: {
        async grade(astronaute) {
            return (await pg
                .select()
                .table('grade')
                .where('id', astronaute.grade_id)
                .limit(1)).pop();
        },
        async planet(astronaute) {
            return (
                await pg
                    .select()
                    .table('planet')
                    .innerJoin('planet-astronaute', 'planet-astronaute.planet_id', '=', 'planet.id')
                    .where('planet-astronaute.astronaute_id', astronaute.id)
                    .limit(1)).pop();
        }
    },
};

export default resolvers;
```

Comme vous pouvez le voir, c'est assez simple, il suffit de spécifier pour chaque attribut comment le récupérer.

Enfin créons le resolver pour la `planet`.

Ajouter le fichier `planet.js` au dossier resolvers :

```javascript
import pg from './../pg';
import Planet from '../typedefs/planet';

const resolvers = {
    RootQuery: {
        async planet(obj, args, context, info) {
            return (await pg
                .select()
                .table('planet')
                .where('id', args.id)
                .limit(1)).pop();
        },
    },
    Planet: {
        async astronautes(planet) {
            return (await pg
                .select()
                .table('astronaute')
                .innerJoin('planet-astronaute', 'planet-astronaute.astronaute_id', '=', 'astronaute.id')
                .where('planet-astronaute.planet_id', planet.id)
            );
        }
    },
};

export default resolvers;
```

Puis dans le fichier `resolver.js` vous devez ajouter le resolver :

```javascript
import { merge } from 'lodash';
import AstronauteResolver from './resolvers/astronaute';
import PlanetResolver from './resolvers/planet';

export const resolvers = merge(AstronauteResolver, PlanetResolver);
```

Si tout est ok, la requête suivante doit fonctionner :

```javascript
{
  astronautes {
    id,
    pseudo
  },
  astronaute(id: 1) {
    id,
    pseudo
    grade {
      id,
      name
    }, planet {
      id,
      name
    }
  },
  planet(id: 2) {
    id,
    astronautes {
      id,
      pseudo,
      grade {
        name
      }
    }
  }
}
```

La réponse doit ressembler à cela :


```json
{
  "data": {
    "astronautes": [
      {
        "id": 1,
        "pseudo": "CaptainJojo"
      },
      {
        "id": 2,
        "pseudo": "Pouzor"
      },
      {
        "id": 3,
        "pseudo": "Franky"
      }
    ],
    "astronaute": {
      "id": 1,
      "pseudo": "CaptainJojo",
      "grade": {
        "id": 1,
        "name": "admiral"
      },
      "planet": {
        "id": 1,
        "name": "duck"
      }
    },
    "planet": {
      "id": 2,
      "astronautes": [
        {
          "id": 2,
          "pseudo": "Pouzor",
          "grade": {
            "name": "rookie"
          }
        },
        {
          "id": 3,
          "pseudo": "Franky",
          "grade": {
            "name": "rookie"
          }
        }
      ]
    }
  }
}
```

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-apollo/tree/codelabs-step4)
