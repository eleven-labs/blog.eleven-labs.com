---
layout: post
title: Débuter le code splitting avec React.
excerpt: Lorsque votre projet React est bien avancé, charger l'application pour un utilisateur peut devenir de plus en plus long. Pour palier a ce problème, React permet depuis ses dernières mises à jour, de faire du Code Splitting.
authors:
    - rmavillaz
lang: fr
permalink: /fr/react-débuter-le-code-splitting/
categories:
    - React
tags:
    - react
    - loadable
    - code splitting
    - component
    - import
    - lazy
    - suspense
    - webpack
cover: /assets/2019-01-26-apollo-local-state-management-une-alternative-a-redux-contextapi/cover.png
---

Lorsque votre projet React est bien avancé, charger l'application pour un utilisateur peut devenir de plus en plus long. Pour palier a ce problème, React permet depuis ses dernières mises à jour, de faire du **Code Splitting**.


## Définition du Code Splitting

Avant toute chose, il est bon de rappeler ce qu'est le code splitting. Comme vous le savez sans doute, **il est aujourd'hui très commun d'utiliser Webpack pour build notre application JS**. C'est lui qui va regrouper le JS en un seul fichier et gérer les différents assets.
Mais **Webpack peut également découper le code en plusieurs fichiers de manière intelligente**, permettant ainsi de charger la ressource uniquement si nécessaire ou en parallèle.

L'intéret est limité dans un petit projet en React mais peut être nécessaire lorsque celui-ci devient bien avancé. Charger toute l'application peut parfois être fastidieux si l'utilisateur a une très faible connexion, voir même carrément inutile si celui-ci souhaite juste naviguer sur une partie du site.

## React à la rescousse

React n'est pas le premier à faire du Code Splitting, en effet, la librairie [loadable-components](https://github.com/smooth-code/loadable-components) permet déjà de le faire simplement. Mais la team React a commencé à développer son propre module nommé **lazy* que l'on peut importer directement depuis la librairie !

Egalement, un composant React est arrivé en même temps, nommé **Suspense**, qui va de pair avec le lazy. Il va permettre de créer un loading pendant que'une ressource est en train de charger avec le **lazy**.

## Utilisation du lazy

Pour débuter dans le code splitting, il vaut d'abord se poser la question suivante:
- Quelles sont les parties de mon site, ou plus précisement, les composants que je souhaite splitter ?
Je pars donc du principe que vous avez déjà un projet React qui tourne et nous allons intégrer l'import de composants en mode lazy. Le plus simple et le plus pertinent dans 99% des cas, c'est l'intégrer dans le système de routing de votre application.

```js
//routing.js
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFound from '../NotFound';
import Home from '../Home';
import Projects from '../Projects';

const Router = () => (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/projets" component={Projects} />
      <Route component={NotFound} />
    </Switch>
);

export default Router;
```

Voici un système de routing classique, tous les composants sont chargés au même où l'on arrive sur l'application. On peut même voir que le fichier JS fait 2,49Mo !

![size_js_app-without_code_splitting]({{site.baseurl}}/assets/2019-05-22-react-code-splitting/js-size-without-code-splitting.png "javascript code size without code splitting")


### Intégration du lazy

```js
// on importe la methode lazy
import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import { NotFound } from '../NotFound';
// on utilise lazy pour importer les autres composants
const Home = lazy(() => import('../Home'));
const Projects = lazy(() => import('../Projects'));

const Router = () => (
  <Switch>
    <Route path="/" component={Home} exact />
    <Route path="/projets" component={Projects} />
    <Route component={NotFound} />
  </Switch>
);

export default Router;
```

Nous avons donc importé directement la methode `lazy` depuis React puis nous avons modifié la façon d'importé les composants nécessaires au routing. La méthode `import()` permet de façon de l'import dynamique, couplé au lazy, celui-ci va se faire uniquement si la ressource est demandé par l'utilisateur.

Dans ce cas précis, le code du composant `Home` et `Projects` ne sera chargé que si l'utilisateur va sur l'url `/` ou `/projects`.
![size_js_app-with_code_splitting_1]({{site.baseurl}}/assets/2019-05-22-react-code-splitting/js-size-code-splitting-1.png "javascript code size with code splitting 1")

Lorsque Webpack split le code, il utilise toujours le fichier `bundle.js` contenant le coeur de l'application. Mais le reste sera contenu dans de fichiers à part **chunk**. On voit sur l'image qu'il existe un fichier `0.chunk.js` qui correspond au code du composant `Home` dans notre cas.

![size_js_app-with_code_splitting_2]({{site.baseurl}}/assets/2019-05-22-react-code-splitting/js-size-code-splitting-2.png "javascript code size with code splitting 2")

En naviguant sur la page `/projets`, on voit bien qu'un nouveau fichier a été chargé `1.chunk.js`, le code splitting est donc fonctionnel.
Si l'ont additionne tous les fichiers, on retrouve bien les 2,49Mo de base. Bien sur, dans notre exemple, le gain est faible mais peut être énorme dans une réelle application avec des images, et des dizaines de pages.

Au passage, **notez bien que vous n'êtes pas obligé de TOUT importé en mode lazy**, nous ne l'avons pas fait pour la page `Not Found`.

## Et le composant Suspense

En début d'article, je vous ai parlé du composant **Suspense** de React, implémentons-le. 

```js
// on importe le composant Suspense
import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { NotFound } from '../NotFound';
const Home = lazy(() => import('../Home'));
const Projects = lazy(() => import('../Projects'));

const Router = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/projets" component={Projects} />
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);
```

La props fallback doit être un composant (ici, un loading), **il va s'afficher si un des composants enfants de <Suspense> est en train de charger et s'il n'a pas fait au moins un rendu**. Si vous mettez un delai ou une alerte dans le constructeur d'un enfant, vous verrez obligatoirement le loading s'afficher.

Le composant `Suspense` n'est pas indispensable lors du code splitting, mais il reste important afin d'éviter une page blanche temporaire. Celle-ci peut être totalement invisible si vous avez bonne machine et une bonne connexion, mais ce n'est pas le cas de tous vos utilisateurs !

## Pour conclure

Grace au lazy, React permet enfin de faire du code splitting de manière extrèmement simple tout en intégrant diverses modules à coté comme le **Suspense** pour rendre votre application vraiment fluide pour l'utilisateur.
Faire du code splitting nécessite un peu de réflexion pour déterminer ce que vous allez charger en mode lazy, ne le faites pas pour tous vos composants, il faut que ce soit pertinent !

Gardez en tête qu'il s'agit d'un premier pas, et la team React souhaite développer énormément de chose autour de ces sujets en 2019. Par exemple, il n'est pas encore possible en ServerSide Rendering et le Suspense est conseillé uniquement pour du loading de composant en lazy.
Un autres module nommé `react-cache` actuellement en Alpha, va bientôt voir le jour. Il permettra d'aller fetch une donnée sur une API, ou de charger des images et d'utiliser le composant Suspense pour du loading automatique.


Vous pouvez retrouver plus d'informations sur la documentation officielle d'Apollo React :
- [Code Splitting React](https://reactjs.org/docs/code-splitting.html)


