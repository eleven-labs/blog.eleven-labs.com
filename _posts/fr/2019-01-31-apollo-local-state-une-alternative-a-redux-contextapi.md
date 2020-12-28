---
layout: post
title: React, le local state management d'Apollo, une alternative à Redux / ContextApi?
excerpt: Si vous suivez notre blog ou nos différents meetups, vous avez sans doute entendu parler de la librairie React Apollo afin de gérer une API GraphQL. Depuis peu, celle-ci offre une autre manière de gérer le state de votre application afin de ne pas avoir à gérer un Redux, il est temps de voir ça d'un peu plus près !
authors:
    - rmavillaz
lang: fr
permalink: /fr/react-apollo-le-local-state-management-une-alternative-a-redux-contextapi/
categories:
    - React
    - GraphQL
tags:
    - react
    - redux
    - apollo
    - graphql
    - contextapi
cover: /assets/2019-01-26-apollo-local-state-management-une-alternative-a-redux-contextapi/cover.png
---

Si vous suivez notre blog ou nos différents meetups, vous avez sans doute entendu parler de la librairie React Apollo afin de gérer une API GraphQL. Depuis peu, **celle-ci propose une autre manière de gérer le state de votre application React afin de ne pas avoir à gérer un Redux**, il est temps de voir ça d'un peu plus près !

Cela fait quelques années que les développeurs utilisent le duo React/Redux pour leurs applications front-end, ce dernier permettant de centraliser les données dans un store. Je pars du principe que vous êtes déjà familier avec ce concept, sinon je vous invite à en apprendre plus via [nos autres articles sur le blog](https://blog.eleven-labs.com/fr/redux-structurez-vos-applications-front/).

Même si Redux est encore très présent, de nouveaux moyens permettent de gérer les données de son application comme le tout nouveau ContextAPI intégré directement à React. Pour ceux qui utilisent Apollo pour gérer une API GraphQL, sachez qu'il intégre également sa propre gestion du store répondant au nom de Local State Management. Nous allons voir ici comment l'utiliser et pourquoi.

## Du GraphQL pour gérer ses données locales !

Habituellement, pour récupérer/modifier des données sur une API GraphQL avec Apollo, il est assez courant d'utiliser les composants Query et Mutation afin d'effectuer les requêtes sur le serveur. Apollo stocke automatiquement les données récupérées dans un cache afin d'éviter deux fois la même requête en parcourant l'application. L'idée derrière le Local State Management est de **combiner vos données locales avec celles provenant du serveur !** De ce fait, on va écrire des **requêtes GraphQL en direction de son cache** !

Cela peut paraître assez étrange, mais il est possible d'écrire un nouveau schéma de données de la même manière que sur votre serveur GraphQL, sauf que celui-ci se destine uniquement à votre application front-end. Une sorte d'extension du schéma GraphQL serveur avec des données locales !

## Un exemple vaut mieux qu'un long discours

Utilisons ce fameux Local State management d'Apollo dans un exemple concret : **un système de notifications**. Dans notre application, il sera possible de faire apparaitre un message de notification pour spécifier qu'une action a bien été effectuée par l'utilisateur. La donnée de notification devra être stockée dans le cache Apollo afin d'être exploitable dans toute l'application.


### Initialisation du client Apollo
Ici, notre client Apollo est déjà configuré, nous allons donc ajouter un nouveau module :
```
yarn add apollo-link-state
```
Puis on l'ajoute au client Apollo dans notre code :

```js
//client.js
import { withClientState } from  'apollo-link-state';

const stateLink = withClientState({
  cache, // on injecte le cache de base d'Apollo
  resolvers,
  typeDefs,
  defaults
});
const client =  new ApolloClient({
  connectToDevTools: true,
  link: stateLink, // on l'ajoute le link à notre client Apollo
  cache,
});
```
Comme vous pouvez le constater, le stateLink contient 4 paramètres dont resolvers, typeDefs, defaults. Cela ne vous rappelle rien ? Comme je le disais en début d'article, **on va pouvoir définir un schéma, des resolvers, afin d'exploiter les données, comme sur une API GraphQL** !

### Création du schéma

Avant d'injecter notre schéma dans le client, il faut créer notre fichier typeDefs.js :

```json
// typeDefs.js
export  const typeDefs =  `
  enum NotificationType {
    success
    error
    warning
  }

  type Notification {
    header: String
    content: String
    type: NotificationType
 }

  type Mutation {
    newNotification(input: NotificationInput!): Boolean
    deleteNotification(): Boolean
  }

  type Query {
    Notification: Notification
  }

  input NotificationInput {
    header: String
    content: String
    type: NotificationType
  }
`;
```
Comme sur une API, on retrouve les types de Input, Query, Mutations, notre objet Notification ainsi qu'un enum. En lisant ce schéma, on comprend que l'on va pouvoir lire la notification, en ajouter et la supprimer.

### Les resolvers

Après avoir défini notre schéma, il faut ajouter nos resolvers :

```js
//resolvers.js
export  const resolvers = {
  Mutation: {
    newNotification: (_, { input }, { cache }) => {
      cache.writeData({
         data: { Notification: { __typename: 'Notification', ...input } },
      });

      return  true;
    },
    deleteNotification: (_, variables, { cache }) => {
      cache.writeData({ data: { Notification: null } });

      return  true;
    },
  },
};

export  default resolvers;
```
Le principe est relativement simple, on écrit directement dans le cache avec la méthode writeData. Notre input contient les paramètres envoyés à la mutation qui vont nous permettre de créer et insérer l'objet Notification dans notre cache.
La propriété **__typename** est obligatoire et nécessaire pour Apollo, il faut lui spécifier le nom de l'objet dans votre Schéma.
Il est également possible de lire le cache avec le méthode readQuery si vous avez besoin des données précédentes avant la mutation. Par exemple, pour ajouter une nouvelle entrée à une liste.

Vous remarquerez qu'il n'y a pas de resolver pour la query Notification, en effet, Apollo se charge de la retrouver automatiquement.

### Les requêtes

Maintenant que nous avons fait notre schéma et nos resolvers, il ne reste plus qu'à créer les queries/mutations.

```js
//local/notification.js
import gql from  'graphql-tag';

export  const GET_NOTIFICATION =  gql`
  query GET_NOTIFICATION {
    getNotification @client {
      content
      header
      type
    }
  }
`;

export  const NEW_NOTIFICATION =  gql`
  mutation NEW_NOTIFICATION ($input: NotificationInput!) {
    newNotification(input: $input) @client
  }
`;

export  const DELETE_NOTIFICATION =  gql`
  mutation DELETE_NOTIFICATION {
    deleteNotification @client
  }
`;
```

Pour éviter de les confondre avec les requêtes serveurs, je vous conseille de les mettre dans un dossier séparé nommé "local" ou "client" car la syntaxe est identique, et la seule chose qui vous permet de les différencier est **la directive @client**. Pensez-y, elle est très importante, sinon Apollo tentera une requête sur le serveur !

### Les composants

Il ne reste plus qu'à créer nos composants ! Le découpage est relativement simple, nous allons avoir un composant Notification qui va s'occuper d'exécuter la Query pour lire la notification dans le cache et l'afficher.
Puis un HOC **withNotification** qui contiendra la mutation newNotification et qui permettra de l'injecter à n'importe quel composant qui a besoin de créer une notification.

```js
import { GET_NOTIFICATION, DELETE_NOTIFICATION } from '../../graphql/local/notification';
import Message from './Message';

const Notification = () => (
  <Mutation mutation={DELETE_NOTIFICATION}>
    {deleteNotification => (
      <Query query={GET_NOTIFICATION}>
        {({ data: { Notification } = {} }) => {

          return(
            <Fragment>
              {Notification && (
                <Message
                  header={Notification.header}
                  content={Notification.content}
                  onDismiss={deleteNotification}
                  type={Notification.type}
                  ttl={7000}
                />
              )}
            </Fragment>
          );
        }}
      </Query>
    )}
  </Mutation>
);
```

Le composant est très simple avec une Query **GET_NOTIFICATION** qui va récupérer l'objet Notification, si celle-ci existe alors un message apparait. La Query agit comme un watcher, à chaque fois que l'objet Notification est manipulé dans le cache, un nouveau rendu est effectué !
J'ai également mis la mutation permettant de supprimer la notification car le composant Message possède une croix ou un TTL (time to live). Il éxecute la mutation lorsque l'utilisateur ferme le message ou au bout d'un certain temps (7000ms dans notre cas).

```js
import { NEW_NOTIFICATION } from '../../graphql/local/notification';

const withNotification = WrappedComponent => class extends Component {
  newNotification = ({ header, content, type = 'success' }) => {
    this.mutate({
      variables: {
        input: { header, content, type },
      },
    });
  }

  render() {
    return (
      <Mutation mutation={NEW_NOTIFICATION}>
        {(mutate) => {
          this.mutate = mutate;

          return (
            <WrappedComponent
              {...this.props}
              newNotification={this.newNotification}
            />
          );
        }}
      </Mutation>
    );
  }
};
```

Vous risquez d'utiliser très souvent la mutation afin de créer des notifications dans votre application, personnellement, je préfère faire un HOC qui va injecter directement la fonction au composant enfant. Maintenant, il suffit d'ajouter ce HOC où bon vous semble afin de créer une notification !


```js
import withNotification from './withNotification';

const Button = ({ newNotification }) => (
  <button
    onClick={() => newNotification({
      header: 'Nouvelle notification',
      content: 'J\'ai cliqué sur le bouton !',
    })}
  >
    Ajouter une notification
  </button>
);

export default withNotification(Button);
```

Et voilà, à chaque clic sur le bouton, le composant Notification affichera un nouveau message. Pourtant les 2 composants sont complètement indépendants !

### Apollo DevTools

Pour les habitués d'Apollo, sachez qu'il existe une extension nommée Apollo DevTools, uniquement sur le navigateur Chrome. Elle permet d'éxecuter des Queries/Mutations via une interface exactement comme Playground. Etant donné que le Local State Management étend le schéma de votre API,  Apollo DevTools affiche également les requêtes en direction de son cache ! Plutôt pratique pour tester sans forçément manipuler l'interface de votre application.

## Pour conclure

Le Local State Management est un module intéressant de librairie Apollo car il présente plusieurs avantages. Premièrement, il vous évite de gérer et maintenir un Redux qui peut très vite devenir une usine à gaz ou un ContextApi, vous aurez donc juste à comprendre la librairie Apollo. Le code de votre application sera plus simple car vous utiliserez uniquement des composants Mutation/Query, je trouve cela assez fun de gérer son store avec des requêtes GraphQL.

En revanche, sachez que le Local State Management est encore très jeune et il présente quelques problèmes notamment pour la gestion des erreurs dans vos resolvers, il est assez difficile de debug pour l'instant. Néanmoins, pour une petite application avec une capacité de développement limitée, je vous conseille très fortement de l'utiliser, afin de vous concentrer uniquement sur Apollo ce qui peut vous faire gagner beaucoup de temps.


Vous pouvez retrouver plus d'informations sur la documentation officielle d'Apollo React :
- [Local State Management](https://www.apollographql.com/docs/react/essentials/local-state.html)

Le code est également disponible sur mon Github :
- [Github](https://github.com/KizeRemi/local-state-management-tuto)
