---
layout: post
title: Migrer une application React client-side en server-side avec Next.JS
authors:
    - vcomposieux
lang: fr
permalink: /fr/migrer-une-application-react-client-side-en-server-side-avec-nextjs/
categories:
    - Javascript
    - React
    - Frontend
tags:
    - javascript
    - server
    - react
    - nextjs
cover: /assets/2017-09-03-migrer-une-application-react-client-side-en-server-side-avec-nextjs/cover.jpg
---

La plupart des applications front utilisant React sur lesquelles j'ai pu travailler sont des applications destinées à être rendues par le navigateur (client-side).

Cependant, en fonction des outils que vous utilisez, il se peut que celles-ci ne soient pas visibles par les moteurs de recherche et empêchent donc une bonne indexation de vos contenus (SEO).

Afin de palier à ce problème, des frameworks ont vu le jour afin de permettre de rendre des applications React côté serveur (server-side). C'est le cas de [Next.JS](https://github.com/zeit/next.js){:target="_blank" rel="nofollow noopener noreferrer"}{:target="blank"} que nous allons étudier dans cet article.

Je disposais en effet d'une application React rendue côté client et l'ai migrée vers un rendu côté serveur en quelques heures seulement grâce au framework.
L'objectif de cet article est de partager avec vous mon expérience technique sur cette migration.

Premiers pas
------------

Avant tout, il nous faut regarder ce que propose Next.JS afin de voir si ce framework correspond à nos besoins :

* Une [installation simple](https://github.com/zeit/next.js#setup){:target="_blank" rel="nofollow noopener noreferrer"}{:target="_blank"},
* Rendu de [fichiers statiques](https://github.com/zeit/next.js#static-file-serving-eg-images){:target="_blank" rel="nofollow noopener noreferrer"}{:target="_blank"} tel que des images et fichiers CSS dans un répertoire `static`,
* Des URLs (routing) pré-définies à partir des noms des fichiers JS présents dans le répertoire `pages`,
* Possibilité de définir des [routes personnalisées/paramétrisées](https://github.com/zeit/next.js/#custom-server-and-routing){:target="_blank"} (mais j'ai utilisé [next-routes](https://github.com/fridays/next-routes){:target="_blank"} pour cela, plus simple d'utilisation){:target="_blank" rel="nofollow noopener noreferrer"},
* Exécuter des [actions côté serveur seulement](https://github.com/zeit/next.js#fetching-data-and-component-lifecycle){:target="_blank" rel="nofollow noopener noreferrer"}{:target="_blank"},
* Une intégration simple avec Redux grâce à [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper){:target="_blank" rel="nofollow noopener noreferrer"}{:target="_blank"}.

À priori, vous devriez donc avoir tout ce dont vous avez besoin pour migrer votre projet. Commençons !

Ajout des dépendances
---------------------

La première chose à faire est d'ajouter nos dépendances dans le fichier `package.json` :

```diff
 {
   "version": "0.0.1",
   "private": true,
   "dependencies": {
+    "next": "^3.0.3",
+    "next-redux-wrapper": "^1.3.2",
+    "next-routes": "^1.0.40",
     "prop-types": "^15.5.10",
     "react": "^15.5.4",
     "react-dom": "^15.5.4",
     "react-scripts": "1.0.1"
   },
   "scripts": {
-    "start": "react-scripts start",
-    "build": "react-scripts build",
-    "test": "react-scripts test --env=jsdom",
+    "dev": "next dev src",
+    "start": "node server.js",
+    "build": "next build src",
+    "test": "react-scripts test --env=jsdom"
   }
 }
```

Nous ajoutons donc ici nos trois dépendances : `next`, `next-redux-wrapper` et `next-routes`. Pas besoin de s'étendre plus sur le sujet, le nom des librairies me semble assez clair pour deviner leur utilité.

Il nous faut également modifier les scripts. En effet, nous allons avoir désormais besoin d'un serveur HTTP `node` et allons utiliser la librairie `next` pour construire et développer notre application avec un compilateur à la volée.

Notez que pour le moment, j'ai gardé `react-scripts` pour exécuter mes tests mais notez que celui-ci pourrait bien entendu être supprimé.

Nouvelle structure de fichiers
------------------------------

Nous allons respecter les conventions proposées par Next.JS, ainsi nous allons placer nos différentes pages dans un répertoire nommé `page`, nos fichiers statiques dans un répertoire `static`.

Seule différence, nous allons les placer dans `src`. C'est pourquoi nous avons précisé ce répertoire dans les commandes précédentes.

Voici donc notre structure de projet :

```
.
├── src
│   ├── actions
│   │   ├── ...
│   ├── components
│   │   ├── ...
│   ├── constants
│   │   └── ...
│   ├── containers
│   │   ├── ...
│   ├── pages
│   │   ├── _error.js
│   │   ├── index.js
│   │   └── category.js
│   ├── reducers
│   │   ├── ...
│   ├── static
│   │   ├── css
│   │   │   ├── ...
│   │   ├── fonts
│   │   │   └── ...
│   │   ├── img
│   │   │   ├── ...
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── store
│   │   └── configureStore.js
│   ├── translations
│   │   ├── ...
│   ├── index.js
│   └── routes.js
├── tests
│   └── ...
├── Makefile
├── README.md
├── package-lock.json
├── package.json
├── server.js
```

Nous avons gardé la même structure de fichier que nous avions avec notre projet client-side et avons simplement ajouté le répertoire `pages` ainsi que `static` (qui était précédemment nommé `assets` chez nous).

Vous pouvez d'ores et déjà faire tourner le serveur sur votre machine de développement en exécutant :

```
$ npm run dev (ou yarn dev)
```

Côté production, c'est le serveur node `server.js` qui sera exécuté. Voici son code :

```js
const next = require('next')
const routes = require('./src/routes')
const app = next({dir: 'src', dev: false})
const handler = routes.getRequestHandler(app)

const {createServer} = require('http')

app.prepare().then(() => {
  createServer(handler).listen(8081)
})
```

Nous instancions ici Next.JS et récupérons les routes que nous allons créer par la suite.
Nous précisons également le répertoire `src`. Spécifiez bien que vous n'êtes pas en environnement de développement afin d'optimiser le build.

Écriture de la première page
----------------------------

Il est maintenant temps d'écrire notre première page rendue en server-side !

Nous allons commencer avec une homepage très simple. Placez donc un fichier à l'emplacement `src/pages/index.js` :

```js
import React from 'react'
import withRedux from 'next-redux-wrapper'

import { store } from '../store/configureStore'
import { Footer, Homepage } from '../components';
import { AppContainer, HeaderContainer } from '../containers';

const Page = () => (
    <AppContainer className='App Homepage'>
        <div>
            <HeaderContainer />
            <Homepage />
            <Footer />
        </div>
    </AppContainer>
)

export default withRedux(store)(Page)
```

Très simple, nous instancions un objet `Page` React comprenant les composants qui vont former notre page, et appelons une fonction retournée par `withRedux(store)` (fournie par la librairie `next-redux-wrapper`) permettant de synchroniser notre store Redux sur cette page.

Ainsi, toute notre page (et les composants compris à l'intérieur) auront accès et pourront manipuler le store Redux.

Si vous vous rendez sur `http://localhost:3000/`, votre homepage doit maintenant être visible !

Routes personnalisées / comprenant des variables
-------------------------------------------------

Malheureusement, il est un peu complexe actuellement de déclarer des routes personnalisées et/ou contenant des variables directement via Next.JS, c'est pourquoi j'ai fait le choix d'utiliser la librairie `next-routes` qui va me permettre de faire cela très simplement.

Nous allons pour cet exemple partir sur une URL de type `/category/:slug`.

Il nous faut alors déclarer un fichier à l'emplacement `src/routes.js` avec le contenu suivant :

```js
const routes = module.exports = require('next-routes')()

routes
  .add('category', '/category/:slug')
```

Lorsque l'URL `/category/:slug` sera appelée (où slug est une valeur dynamique), le fichier `src/pages/category.js` sera appelé.

Créons donc ce fichier :

```js
import React from 'react'
import withRedux from 'next-redux-wrapper'

import { store } from '../store/configureStore'
import { Category, Footer } from '../components';
import { AppContainer, HeaderContainer, } from '../containers';

const Page = ({ slug }) => (
    <AppContainer className='App Homepage'>
        <div>
            <HeaderContainer displaySearch={true} />
            <Category slug={slug} />
            <Footer />
        </div>
    </AppContainer>
)

Page.getInitialProps = async ({ query }) => {
    return { slug: query.slug }
}

export default withRedux(store)(Page)
```

Comme vous pouvez le voir ici, nous avons ajouté le code suivant au composant, nous permettant de récupérer le paramètre `slug` depuis la requête, et de l'envoyer à notre composant de page (puis ensuite à notre composant `Category`) :

```js
Page.getInitialProps = async ({ query }) => {
    return { slug: query.slug }
}
```

Vraiment simple, non ? Vous savez dorénavant faire du routing dynamique !

Requêtes server-side
--------------------

La méthode `getInitialProps()` présentée précédemment vous permettra également de faire des requêtes côté serveur, ce qui signifie que le client final n'en aura pas connaissance.

Ainsi, vous allez pouvoir récupérer les données d'une API et les insérer dans votre store.

Manipulation des templates
--------------------------

Dans les templates de vos composants React, vous pouvez déclarer des liens vers vos routes de cette façon, en important le composant `Link` disponible via votre fichier `routes.js` puis :

{% raw %}
```js
import { Link } from '../routes';

<Link route='category' params={{slug: 'hello-world'}}>
    Go to hello-world category
</Link>
```
{% endraw %}

Notez que vous pouvez également utiliser la notation suivante :

```js
<Link route='category/hello-world'>
```

> **Note :**
> Vous pouvez également ajouter un attribut `prefetch` si vous souhaitez pré-charger vos pages.

Next.JS fournit également un composant `Head` qui vous permettra, comme son nom l'indique, de manipuler le `<head>` HTML de votre page.

Pour définir le `<title>` de votre page, il vous faut écrire :

```js
import Head from 'next/head';

const Page = () => (
    <Head>
        <title>My homepage title</title>
    </Head>
    ...
)
```

Encore un élément qui vous permettra d'améliorer votre référencement et de personnaliser davantage vos pages.

Conclusion
----------

Migrer d'une application client-side React (initialisée avec `create-react-app`) ne m'a pris que quelques heures car le framework `Next.JS` est réellement simple d'utilisation et la communauté déjà assez conséquente.

De fait, Next.JS s'intègre très bien avec la plupart des outils de l'écosystème React.

J'espère que cet article aura pu vous aider à migrer votre application client-side du côté server-side.