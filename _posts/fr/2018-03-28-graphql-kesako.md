---
layout: post
title: GraphQL, kesako ? 
lang: fr
permalink: /fr/graphql-kesako/
excerpt: "Dans nos architectures micro-services, l'un des nouveaux défis est de réussir à récupérer les données stockées dans les différents micro-services le plus facilement possible. Pour résoudre ce défi, je vous propose d'utiliser GraphQL. Cette technologie qui est devenu un des buzz word du moment est en vrai très simple à mettre en place. Ne voulant pas faire de jaloux je vous propose de réaliser deux serveurs GraphQL l'un en PHP et l'autre en NodeJs."
authors:
    - captainjojo
categories:
    - javascript
    - graphql
tags:
    - javascript
cover: /assets/2018-03-28-graphql-kesako/cover.jpeg
---
Dans nos architectures micro-services, l'un des nouveaux défis est de réussir à récupérer les données stockées dans les différents micro-services le plus facilement possible. 

Pour résoudre ce défi, je vous propose d'utilisé GraphQL. Cette technologie qui est devenu un des buzz word du moment est en vrai très simple à mettre en place. Ne voulant pas faire de jaloux je vous propose de réaliser deux serveurs GraphQL l'un en PHP et l'autre en NodeJs.

## GraphQL c'est quoi ?

GraphQL est un language de requête initié par Facebook en 2012 et développé en 2015. [Facebook Manifest](http://facebook.github.io/graphql/October2016/). GraphQL permet de se plugguer à n'importe quel type de base de données ou d'API. Le but de GraphQL est de décrire les données et les fonctions disponible entre les applications client-server.

GraphQL **ne stocke donc pas** de données. Il va seulement décrire la donnée et savoir comment allez la récupérer sur vos différentes applications backend. 

La communication sur un serveur GraphQL se fait en `json` à la fois pour l'entrée et la sortie.

Le principal intérêt de GraphQL est donc d'un faire une API-Gateway qui va devenir votre seul point d'entré pour récupérer toutes vos données très simplement. 

Le serveur GraphQL aura la charge d'aller chercher les données selon la query. Ce qui permet pour une même requête d'aller chercher la données dans plusieurs type de base de données (exemple: dans un PostgreSQL, dans une API, etc ...)

Il est possible de faire un serveur GraphQL dans n'importe quel technologie, il suffit de suivre le manifest de Facebook.  

Dans n'importe qu'elle technologie les étapes de construction d'un serveur GraphQL sont les suivantes.

## GraphiQL

Tout d'abord il faut installer l'IDE de GraphQL, GraphiQL. Ce dernier se place devant un serveur GraphQL et permet :

 - tester les requêtes en live
 - de générer une documentation
 - d'utiliser l'ensemble des fonctionnalités d'un serveur GraphQL (exemple : variables)

L'installation est assez simple, il vous suffit de suivre le tutoriel [suivant](https://github.com/graphql/graphiql/tree/master/example).


## Serveur

Une fois l'IDE choisi vous de choisir le serveur que vous souhaitez utiliser. Il existe de nombreux serveur différents dans cet article j'utilise le serveur de base en nodeJS ([Express GraphQL](http://graphql.org/graphql-js/running-an-express-graphql-server/)), c'est à vous de choisir. 
Dans le cadre de projet plus poussé j'utilise soit :

- en Symfony le bundle [Overblog](https://github.com/overblog/GraphQLBundle)
- en node le framework [apollo](https://www.apollographql.com/)

## Les types

La première chose à faire est de déclarer les types de données que vous souhaitez requêter.

Comme pour une base de données classique vous avez accès à des types `Scalar`:

 - `Int` un entier
 - `Float` un double
 - `String` une chaîne de caractères
 - `Boolean` un booléen
 - `ID` représente un identifiant unique

Vous pouvez utiliser le type `Enum` qui est considéré comme un `scalar` et permet de valider les valeurs d'un argument.

```json
enum Status {
	ONLINE
	ERROR
	REVIEW
}
```

Il est aussi possible de gérer des `list` de `scalar` ou d'`type` . Pour cela il suffit de mettre en place des `[]`.

Dans l'ensemble des cas, vous pouvez choisir de forcer le `non-null` en ajoutant un `!` à la fin du typage.

La création d'un nouveau type se fait via le mot clé `type`.

```json
type Article {
  name: String!
  status: Status!
}
```

Comme pour des objets dans un language orienté object vous pouvez utiliser des interfaces via le mot clé `interface`.

```json
interface Publish {
  id: ID!
  name: String!
  createdAt: Date
}
```

Et donc l'utiliser dans vos types :

```json
type Article implements Publish {
  content: String!
}
```

Une fois l'ensemble de vos types définis, vous devez définir les types principaux :

 - query
 - mutation

### Query 

Le type `query` représente l'ensemble des fonctions utilisables pour la récupération des données.

Chaque `query` peut prendre des paramètres et renvoie un `type`. 

Exemple:

```json
type Query {
  article(id: ID!): Article
  articles(): [Article]
}
```

### Mutation

Comme dans une API rest la mutation permet d'effectuer des changements dans votre base de données. 

Elle se configure comme la `query` il faut définir la fonction avec ses paramètres et sa sortie.
Les paramètres d'une mutation sont de type `input`.

Le type `input` se configure comme un type classique en utilisant le mot clé `input`. 

```json
input ArticleInput {
  id: Int!
  title: String
}
```

Vous pouvez utiliser vos inputs dans vos mutations.

```json
saveArticle(input: ArticleInput!): Article
```

## Resolver

Maintenant que vos types sont faits, il faut dire à GraphQL comment allez chercher vos données. 
Dans chaque librairie il vous faut configurer ce que l'on appel un `resolver`. 

Chaque `resolver` est une fonction qui permet d'aller chercher la données au bon endroit. 

La magie des serveurs GraphQL est de savoir que la donnée a déjà été chargée et ne pas la recharger. C'est aussi de permettre via une seule requête GraphQL d'aller chercher dans plusieurs bases.

## Les plus vs les moins

### Les moins

Le gros moins de l'utilisation de GraphQL est que l'ensemble des queries se font en POST sur un seul endpoint. Elle ne sont donc *pas cachées*.

Comme le cache HTTP utilise l'url comme clé de cache, il n'est pas possible d'utiliser votre cache navigateur.

L'un des biais que propose GraphQL c'est de faire du cache applicatif qui permet d'éviter l'appel vers les bases de données mais pas le call HTTP.

Le second moins est qu'il faut souvent réécrire l'ensemble de vos types que vous avez certainement dus faire pour votre ORM.

Le troisième point faible est la diffuculté de metre en place une authentification via GraphQL?

Le dernier problème est la difficulté de monitorer le serveur GraphQL, même si maintenant il existe [Apollo Engine](https://www.apollographql.com/engine)

### Les plus

GraphQL permet de mettre en place facilement une API Gateway. Il permet d'avoir un unique point d'entrée pour l'ensemble de vos applications.

Prenons l'exemple de données séparées dans deux API, d'un coté les utilisateurs et de l'autre les articles.  Vous pouvez en *une seule requête* GraphQL récupérer l'ensemble des articles qu'un utilisateur aurait lus.

Le point sympathique est que la documentation se fait automatiquement dans l'IDE tel que GraphIQL qui aura même l'autocomplétion. 

Le plus majeur que c'est le front qui gère ce qu'il a besoin ce qui limite le nombre de calls HTTP. Il arrive assez couramment que pour afficher une page complexe avec une API Rest il faut 7 ou 8 call API, avec GraphQL c'est 1. Le gain de performance est donc assez sympa.

## Conclusion

GraphQL est une technologie ayant de nombreux avantages. GraphQL est très appréciable lors de son utilisation avec des frameworks javascript tel que React et Angular.  

Je vous invite desormais à lire les deux Codelabs suivant:

 - [Utiliser GraphQL avec apollo](https://codelabs.eleven-labs.com/fr/graphql-avec-apollo/)
 - [Utiliser GraphQL avec Symfony](https://codelabs.eleven-labs.com/fr/graphql-avec-symfony/)
 
 
