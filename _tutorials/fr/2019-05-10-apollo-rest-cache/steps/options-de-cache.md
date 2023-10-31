---
contentType: tutorial-step
tutorial: apollo-rest-cache
slug: options-de-cache
title: Options de cache
---
## Mise en place du cache

Nos back & front étant prêts, nous allons enfin passer à la mise en place du cache.
Le but de l'exercice est d'arriver à mettre en place le schéma suivant :

![cache-schema]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/cache-schema.png)

Nous allons couvrir ces points un par un.

### In-memory

Il est temps de voir comment fonctionne le cache [`InMemory`](https://www.apollographql.com/docs/react/advanced/caching) d'Apollo.
En effet, par défaut il va cacher les données avec leur champ `id` ou `_id` et `__typename` (qui correspond à leur type défini dans le schéma du serveur).

Ainsi, si je re-demande une même query, il n'y aura pas de deuxième appel au serveur, mais j'obtiendrai le résultat du premier appel.

Pour illustrer ce cas, je vais apporter des modifications à notre application.
Pour gagner du temps, vous pouvez cloner la branche "step-3" de notre projet, [ce commit en particulier](https://github.com/MarieMinasyan/apollo-tutorial/commit/f41319551da1ccfa42e20e70c901f5bbfe0c7c46).
Pour information, j'ai ajouté un Router et 2 pages - Home page et Random page.
La home page a le même comportement que précédemment, et la Random page affiche uniquement le résultat de la query `randomImage`.

Je vous invite à tester l'application.
Vous allez constater que lorsqu'on change de page pour aller sur random page ou revenir sur la Home, les résultats ne changent pas.

Maintenant, imaginons que nous avons un site e-commerce et que nous sommes dans le tunnel d'achat.
Évidemment, dans un cas pareil nous souhaitons toujours récupérer les données à jour depuis nos APIs, et non les résultats cachés côté client.
Pour faire cela, nous pouvons configurer une Query pour avoir toujours la response depuis le réseau (plutôt que le cache client) via la props `fetchPolicy` :

```js
// front-app/src/pages/Random.js
<Query query={RANDOM_NASA_IMAGE} variables={{ search: 'raccoon' }} fetchPolicy={"network-only"}>
```

Notez que ceci va également mettre à jour le cache. Ainsi, si je reviens sur la Home, je verrai la photo récupérée sur la page Random.
Si je souhaite avoir toujours une photo aléatoire, je dois changer tous les endoits où j'appelle les requêtes concernées.

### Redis

Nous avons donc mis en place du cache côté client pour limiter le nombre d'appels inutiles au serveur.
Nous pouvons maintenant nous concentrer sur le serveur.

Jusque là, nous n'avons fait aucune gestion de cache côté serveur. Pourtant, la plupart du temps les réponses des APIs (surtout publiques comme la nôtre) peuvent être cachées pour une durée définie dans les headers. Et la bonne nouvelle est que les datasources Apollo sont compatibles avec Redis et Memcached.

Pour cet exemple, nous allons utiliser Redis pour mettre les réponses en cache.
J'ai donc modifié le fichier `docker-compose.yml` pour ajouter un container `redis` :

```yml
redis:
    image: bitnami/redis
    ports:
        - 6379:6379
    environment:
        ALLOW_EMPTY_PASSWORD: 'yes'
```

Et maintenant je vais ajouter une nouvelle dépendance à mon Apollo serveur :

```bash
docker-compose exec gateway yarn add apollo-server-cache-redis --save
```

Ensuite, je vais dire à mon serveur de stocker les réponses des data sources dans le cache Redis :

```js
const { RedisCache } = require('apollo-server-cache-redis');

const redisCache = new RedisCache({
  host: 'redis',
  password: 'password',
});

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: GraphQLHelper.typeDefs,
    resolvers: GraphQLHelper.resolvers,
  }),
  dataSources: () => GraphQLHelper.dataSources,
  cache: redisCache,
});
```

Et c'est tout. Désormais les réponses de nos APIs sont bien cachées.
Si vous avez Redis Desktop Manager par exemple, vous pouvez facilement vérifier le bon fonctionnement de cette étape.

![graphql-redis-cache]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/redis_cache.png)

### Automatic Persisted Queries

Un autre moyen d'améliorer les performances est d'utiliser les [*persisted queries*](https://www.apollographql.com/docs/apollo-server/features/apq).
Cela permet de faire des appels en GET au serveur au lieu de POST, cela réduit la taille de la requête envoyée et bypass l'étape de validation du schéma.

Voici un schéma qui explique le fonctionnement :

![graphql-persisted-queries]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/persisted_queries.png)

Pour activer les *persisted queries* côté serveur :

```js
const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: GraphQLHelper.typeDefs,
    resolvers: GraphQLHelper.resolvers,
  }),
  dataSources: () => GraphQLHelper.dataSources,
  cache: redisCache,
  persistedQueries: {
    cache: redisCache,
  },
});
```

Et côté client je vais créer un nouveau link :

```bash
docker-compose exec front-app yarn add apollo-link-persisted-queries --save
```

```js
// src/graphql/helpers/persistedQueryLink.js
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';

const persistedQueryLink = createPersistedQueryLink({
  useGETForHashedQueries: true,
});

export default persistedQueryLink;
```

```js
// src/graphql/helpers/client.js
import persistedQueryLink from './persistedQueryLink';

const createGraphQLClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([persistedQueryLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
};
```

Désormais dans notre navigateur les appels se font en GET quand cela est possible :

![graphql-persisted-queries-result]({BASE_URL}/imgs/tutorials/2019-05-10-apollo-rest-cache/persisted_queries_result.png)

Maintenant que nous avons des appels en GET, nous pouvons même mettre en place un Varnish pour encore plus améliorer les performances.

### Suivre les performances

Pour aller encore plus loin, vous pouvez analyser chacun de vos appels réseau entre le Gateway et les APIs en passant pas les extensions.
Je vous invite à lire [cet article sur notre blog](https://blog.eleven-labs.com/fr/commencer-avec-apollojs/#analyser-les-resolvers-graphql) pour en savoir plus.

### Mot de la fin

Merci à tous ceux qui ont suivi ce tutoriel jusqu'à la fin.
J'espère qu'il vous a été utile.