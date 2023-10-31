---
contentType: tutorial-step
tutorial: graphql-avec-apollo
slug: configuration-de-la-bdd
title: Installation du serveur GraphQL
---
### Création de la base de données

Si vous utilisez le container docker, la base de données PostgreSQL est comprise dans le projet.

Si vous n'utilisez pas le docker, vous devez installer un PostgreSQL sur votre machine via la documentation [suivante](https://www.postgresql.org/download/)

### Création du schéma

Pour gérer la communication avec PostgreSQL, nous allons utiliser la librairie [Knex](http://knexjs.org/).

Pour cela il faut l'installer via Yarn :

```bash
yarn add knex pg
```

Nous allons commencer par gérer la connexion à la base de données en ajoutant un fichier `pg.js` à la racine du projet.

```javascript
import Knex from 'knex';

const config = {
    host: 'pg',
    user: 'pg',
    password: 'pg',
    database: 'graphql'
};

const pg = Knex({
    client: 'pg',
    connection: config
});

export default pg;
```

Puis nous allons créer le schéma de base de données. Dans la suite du tutoriel nous allons imaginer que l'application doit gérer les astronautes d'Eleven Labs, les liens avec leurs planètes et leurs grades.

Commençons par créer le dossier `schemas` qui contiendra l'ensemble des schémas de la base de données.

#### Astroanutes

Ajoutez le fichier `astronaute.js` contenant la table astronaute :

```javascript
const up = function up(pg) {
    return pg.schema.createTable('astronaute', function (table) {
        table.increments();
        table.string('pseudo');
        table.string('photo');
        table.integer('grade_id');
        table.foreign('grade_id').references('grade.id');
        table.timestamps(true, true);
    });
};

const down = function down(pg) {
    return pg.schema.hasTable('astronaute').then(function (exists) {
        if (exists) {
            return pg.schema.table('astronaute', function (table) {
                table.dropForeign('grade_id');
            }).then(() => {
                return pg.schema.dropTable('astronaute');
            });
        }
    });
};

export default { up, down };
```

Nous utiliserons les fonctions `up` et `down` pour la création de la base.

#### Planets

Ajoutez le fichier `planet.js` contenant la table planet :

```javascript
const up = function up(pg) {
    return pg.schema.createTable('planet', function (table) {
        table.increments();
        table.string('name');
        table.string('logo');
        table.timestamps(true, true);
    });
};

const down = function down(pg) {
    return pg.schema.dropTableIfExists('planet');
};

export default { up, down };
```

#### Planets-Astronautes

Ajoutez le fichier `planet-astronaute.js` contenant la table de liaison entre un astronaute et sa planète :

```javascript
const up = function up(pg) {
    return pg.schema.createTable('planet-astronaute', function (table) {
        table.increments();
        table.integer('planet_id');
        table.integer('astronaute_id');
        table.foreign('planet_id').references('planet.id');
        table.foreign('astronaute_id').references('astronaute.id');
        table.timestamps(true, true);
    });
};

const down = function down(pg) {
    return pg.schema.hasTable('planet-astronaute').then(function (exists) {
        if (exists) {
            return pg.schema.table('planet-astronaute', function (table) {
                table.dropForeign('planet_id');
                table.dropForeign('astronaute_id');
            }).then(() => {
                return pg.schema.dropTable('planet-astronaute');
            });
        }
    });
};

export default { up, down };
```

#### Grades

Ajouter le fichier `grade.js` contenant la table des grades :

```javascript
const up = function up(pg) {
    return pg.schema.createTable('grade', function (table) {
        table.increments();
        table.string('name');
        table.timestamps(true, true);
    });
};

const down = function down(pg) {
    return pg.schema.dropTableIfExists('grade');
};

export default { up, down };
```

#### Création de la base

Ajouter le fichier `index.js` permettant de générer la base de données :

```javascript
import pg from './../pg';
import astronaute from './astronaute';
import planet from './planet';
import grade from './grade';
import planetAstronaute from './planet-astronaute';

planetAstronaute.down(pg).then(() => {
    console.log('planet-astronaute DROP');
    return astronaute.down(pg);
}).then(() => {
    console.log('astronaute DROP');
    return grade.down(pg);
}).then(() => {
    console.log('grade City DROP');
    return planet.down(pg);
}).then(() => {
    console.log('planet DROP');
    return planet.up(pg);
}).then(() => {
    console.log('planet CREATE');
    return grade.up(pg);
}).then(() => {
    console.log('grade CREATE');
    return astronaute.up(pg);
}).then(() => {
    console.log('astronaute CREATE');
    return planetAstronaute.up(pg);
}).then(() => {
    console.log('planetAstronaute City CREATE');
}).then(() => {
    console.log('Success !');
    process.exit();
}).catch((e) => {
    console.log(e);
});
```

Vous pouvez ajouter votre script suivant dans le `package.json` :

```json
"scripts": {
    "start": "babel-node index.js",
    "pg": "babel-node schemas/index.js"
}
```

Si vous lancez `yarn pg`, vos tables sont créées.

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-apollo/tree/codelabs-step2)