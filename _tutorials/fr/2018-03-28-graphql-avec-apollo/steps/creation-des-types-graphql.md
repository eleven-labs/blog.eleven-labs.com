---
contentType: tutorial-step
tutorial: graphql-avec-apollo
slug: creation-des-types-graphql
title: Création des types GraphQL
---
### Types objet

Nous allons commencer par créer les types GraphQL pour les trois principaux objets :

- Astronaute
- Planète
- Grade

Commencez par créer le dossier `typedefs` qui contiendra les types GraphQL.

#### Grade

On commence par `grade`, qui est l'objet le plus simple : il ne contient que le nom du grade.

Ajoutez le fichier `grade.js` avec le code suivant :

```javascript
const Grade = `
  type Grade {
    id: Int!
    name: String!
  }
`;

export default Grade;
```

#### Planète

Ajoutez le fichier `planet.js` avec le code suivant :

```javascript
const Planet = `
  type Planet {
    id: Int!
    name: String!
    logo: String!
    astronautes: [Astronaute]
  }
`;

export default Planet;
```

Comme vous le remarquez, le type GraphQL ne suit pas directement le type postgreSQL. Ici on permet la récupération directement dans l'object `planet` de l'ensemble des `astronautes`.

#### Astronaute

Ajoutez le fichier `astronaute.js` avec le code suivant :

```javascript
const Astronaute = `
  type Astronaute {
    id: Int!
    pseudo: String!
    photo: String
    grade: Grade!
    planet: Planet!
  }
`;

export default Astronaute;
```

Dans le cas de l'astronaute, l'objet contient directement le `grade` et la `planet`.

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-apollo/tree/codelabs-step3)