---
contentType: tutorial-step
tutorial: graphql-avec-apollo
slug: resolver-des-mutations
title: Resolver des mutations
---
## Création d'un type mutation

Comme pour la query, nous devons définir les mutations possibles. Il s'agit là aussi d'une fonction prenant en entrée un type input et renvoyant un objet.

### Type Input

Pour ce tutoriel, nous allons seulement créer un nouvel astronaute. Nous avons donc besoin d'un seul type input pour l'astronaute.

Dans le dossier `typedefs` vous devez ajouter un fichier `astronauteInput.js` qui contient :

```javascript
const AstronauteInput = `
  input AstronauteInput {
    pseudo: String!
    photo: String
  }
`;

export default AstronauteInput;
```

### Ajout de la mutation

Dans le fichier `schemas.js` vous devez ajouter la mutation :

```javascript
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolver';
import Astronaute from './typedefs/astronaute';
import AstronauteInput from './typedefs/astronauteInput';
import Planet from './typedefs/planet';
import Grade from './typedefs/grade';

const RootQuery = `
  type RootQuery {
    astronaute(id: Int!): Astronaute,
    astronautes: [Astronaute]
    planet(id: Int!): Planet
  }
`;

const RootMutation = `
  type RootMutation {
    saveAstronaute(input: AstronauteInput!): Astronaute
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`;

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery, RootMutation, AstronauteInput, Astronaute, Planet, Grade],
    resolvers: resolvers,
});
```

## Resolver de mutation

Dans le resolver du fichier `astronaute.js` vous devez ajouter la fonction permettant la mutation :

```javascript
import pg from './../pg';
import Astronaute from '../typedefs/astronaute';

const resolvers = {
    RootMutation: {
        async saveAstronaute(value, { input }, context, infos) {
            const astronaute = await pg('astronaute').returning(['id', 'pseudo']).insert(input);
            return astronaute.pop();
        }
    },
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

La fonction `saveAstronaute` prend l'input en entrée, sauvegarde dans la base et renvoie l'objet sauvegardé :

## Testons

Dans GraphiQL vous pouvez mettre la query suivante :

```javascript
mutation saveAstronaute($astronaute: AstronauteInput!) {
  saveAstronaute(input: $astronaute) {
    id
    pseudo
  }
}
```

Puis dans `query variables` en bas à gauche :

```json
{
  "astronaute": {
    "pseudo": "test"
  }
}
```

Si tout est ok pour devriez avoir cela comme réponse :

```json
{
  "data": {
    "saveAstronaute": {
      "id": 1,
      "pseudo": "test"
    }
  }
}
```

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-apollo/tree/codelabs-step5)

## Conclusion

Je vous invite à lire la documentation de [GraphQL](http://graphql.org/learn/) et de [Apollo](https://www.apollographql.com/) pour voir l'ensemble des fonctionnalités disponible dans GraphQL.
