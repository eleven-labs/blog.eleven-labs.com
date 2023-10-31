---
contentType: tutorial-step
tutorial: graphql-avec-symfony
slug: creation-des-types-graphql
title: Création des types GraphQL
---
### Installation du bundle

Commençons par installer le bundle [https://github.com/overblog/GraphQLBundle](https://github.com/overblog/GraphQLBundle)

```bash
composer require overblog/graphql-bundle
```

Nous ajoutons au même moment l'IDE GraphiQL qui est contenu dans un autre bundle [https://github.com/overblog/GraphiQLBundle](https://github.com/overblog/GraphiQLBundle). L'IDE permet d'afficher directement la documentation, ainsi que d'effectuer les query :

```bash
composer req --dev overblog/graphiql-bundle
```

Normalement l'url [http://symfony.localhost/graphiql](http://symfony.localhost/graphiql) est disponible (avec une erreur 500)

### Types objet

Nous allons commencer par créer les types GraphQL pour les trois principaux objets :

- Astronaute
- Planète
- Grade

Nous allons ensuite mettre les types dans le dossier `config/graphql/types`.

#### Grade

On commence par `grade` qui est l'objet le plus simple, il ne contient que le nom du grade.

Ajoutez le fichier `Grade.yaml` avec le code suivant :

```yaml
Grade:
    type: object
    config:
        fields:
            id:
                type: 'Int!'
            name:
                type: 'String!'
```

#### Planète

Ajoutez le fichier `Planet.yaml` avec le code suivant :

```yaml
Planet:
    type: object
    config:
        fields:
            id:
                type: 'Int!'
            name:
                type: 'String!'
            astronauts:
                type: '[Astronaut]'
```

Comme vous le remarquez, le type GraphQL ne suit pas directement le type MySQL. Ici on permet la récupération directement dans l'object `planet` de l'ensemble des `astronautes`.

#### Astronaute

Ajoutez le fichier `Astronaut.yaml` avec le code suivant :

```yaml
Astronaut:
    type: object
    config:
        fields:
            id:
                type: 'Int!'
            pseudo:
                type: 'String!'
            grade:
                type: 'Grade'
            planet:
                type: 'Planet'
```

Dans le cas de l'astronaute, l'objet contient directement le `grade` et la `planet`.

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-symfony/tree/codelabs-step3)