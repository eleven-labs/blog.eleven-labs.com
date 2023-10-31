---
contentType: tutorial-step
tutorial: apollo-rest-cache
slug: apollo-client
title: Apollo client
---
## Mise en place d'Apollo client

### Initialisation du projet front

Pour commencer, clonez la branche "step-2" de [ce projet](https://github.com/MarieMinasyan/apollo-tutorial), mettez-vous sur [le commit suivant](https://github.com/MarieMinasyan/apollo-tutorial/commit/b4b6ac037e1b7a63c748dba93839baa94b4915a2).
Nous avons besoin d'éxécuter la commande suivante pour prendre en compte les modifications du fichier `docker-compose.yml` :

```bash
docker-compose up -d
```

L'application front en React est disponible sur [http://localhost:3001/](http://localhost:3001/).

### Initialisation d'Apollo client

Afin de démarrer, nous allons ajouter de nouvelles dépendances dans l'application :

```bash
docker-compose exec front-app yarn add apollo-client apollo-cache-inmemory apollo-link apollo-link-http apollo-link-error react-apollo graphql graphql-tag --save
```

`apollo-client`, `react-apollo`, `graphql` et `graphql-tag` sont le minimum dont nous allons avoir besoin.
Nous avons également ajouté d'autres librairies qui vont nous permettre de mettre en place la gestion des erreurs et la connexion à notre serveur Apollo.

Je vous invite à lire en détail la documentation d'Apollo sur la [configuration de plusieurs links](https://www.apollographql.com/docs/link/composition) et la page sur le [fonctionnement de `link`](https://www.apollographql.com/docs/react/advanced/network-layer).

Ainsi, je vais commencer la configuration de mon client. Dans le dossier `src/` je vais créer un nouveau dossier `graphql/helpers` qui contiendra la configuration.

Voici le code pour créer un `httpLink` :

```js
// src/graphql/helpers/httpLink.js
import { createHttpLink } from 'apollo-link-http';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

export default httpLink;
```

Ensuite, je vais créer le fichier `errorLink` :

```js
// src/graphql/helpers/errorLink.js
import { onError } from 'apollo-link-error';

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export default errorLink;
```

Vous remarquerez que nous avons également installé `apollo-cache-inmemory`.
En effet, ApolloClient demande d'avoir un système de cache obligatoirement lors de l'initialisation.
`InMemoryCache` est la solution recommandée par Apollo.

Maintenant, j'ai besoin d'initialiser un client Apollo avec les *links* et le cache ci-dessus.
Je vais faire ceci dans un fichier à part pour bien séparer mes différents besoins :

```js
// src/graphql/helpers/client.js
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import errorLink from './errorLink';
import httpLink from './httpLink';

const createGraphQLClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

export default createGraphQLClient;
```

Enfin, passons le client Apollo à l'application :

```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import './index.css';
import App from './App';
import createClientGraphQL from './graphql/helpers/client';

ReactDOM.render((
  <ApolloProvider client={createClientGraphQL()}>
    <App />
  </ApolloProvider>
), document.getElementById('root'));
```

### Récupération des données depuis le serveur

Nous sommes enfin prêts pour faire notre première query !
Je vais placer toutes les requêtes dans le dossier `graphql/queries`.

```js
// graphql/queries/apod.js
import gql from 'graphql-tag';

export const APOD = gql`
  query APOD {
    apod {
      title
      url
      date
      explanation
      type
    }
  }
`;
```

Nous écrivons la même requête que dans le playground du serveur.

Apollo client fournit un composant [`Query`](https://www.apollographql.com/docs/react/essentials/queries) : 

```js
import React from 'react';
import { Query } from 'react-apollo';

import { APOD } from './graphql/queries/apod';

const App = () => {
  return (
    <div>
      <Query query={APOD}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div>
              <p>{data.apod.title}</p>
              <p>{data.apod.explanation}</p>
              <p>{data.apod.date}</p>
              <p><img src={data.apod.url} alt={data.apod.title}/></p>
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default App;
```

Le composant `Query` est un `observer`, il se met donc à jour lorsqu'il obtient une réponse du serveur.

Maintenant que nous avons l'image du jour, nous souhaitons ajouter une image aléatoire qui vient de la bibliothèque d'images de la NASA.
Je vais donc ajouter la query `randonImage` :

```js
// graphql/queries/randomImage.js
import gql from 'graphql-tag';

export const RANDOM_NASA_IMAGE = gql`
  query RANDOM_NASA_IMAGE($search: String!) {
    randomImage(search: $search) {
      title
      url
      description
    }
  }
`;
```

Et voici notre composant App :

```js
import React from 'react';
import { Query } from 'react-apollo';

import { APOD } from './graphql/queries/apod';
import { RANDOM_NASA_IMAGE } from './graphql/queries/randomImage';

const App = () => {
  return (
    <div>
      <Query query={APOD}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div className={'apod'}>
              <p>{data.apod.title}</p>
              <p>{data.apod.explanation}</p>
              <p>{data.apod.date}</p>
              <p><img src={data.apod.url} alt={data.apod.title}/></p>
            </div>
          );
        }}
      </Query>
      <Query query={RANDOM_NASA_IMAGE} variables={{ search: 'raccoon' }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div className={'random'}>
              <p>{data.randomImage.title}</p>
              <p>{data.randomImage.description}</p>
              <p><img src={data.randomImage.url} alt={data.randomImage.title}/></p>
            </div>
        );
        }}
      </Query>
    </div>
  );
};

export default App;
```

Pour information, avec GraphQL, nous pouvons faire plusieurs requêtes en un appel réseau au serveur, et c'est le serveur qui se chargera d'aggréger les données pour nous renvoyer une réponse.

Et voilà ! Bravo à vous :)
Nous avons un client / serveur Apollo avec les résultats attendus.
Dans le chapitre suivant nous allons voir comment améliorer les performances de notre application.