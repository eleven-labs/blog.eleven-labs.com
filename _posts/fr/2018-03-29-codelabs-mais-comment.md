---
layout: post
title: Codelabs under the hood
excerpt: À propos d'Eleven Codelabs
authors:
    - kelfarsaoui
lang: en
permalink: /codelabs-under-the-hood/
categories:
    - React
    - Redux
    - Static site generation
    - Markdown
    - AST
    - App engine
tags:
    - React
    - Redux
    - Static site generation
    - Markdown
    - AST
    - App engine
cover: /assets/2018-03-20-codelabs-under-the-hood/cover.jpg
---

Après plusieurs mois de travail acharné, nous avons le plaisir de vous annoncer la sortie d'Eleven Codelabs !

[image]

Au début de l'été 2017, l'idée d'une plateforme de tutoriels "Made in Eleven Labs" a commencé à prendre forme, en même temps que la création du projet sur github. En juillet 2017, douze astronautes se rassemblent pour brainstormer autour des features qui définiront le MVP. Le projet vise à proposer du contenu plus complet et plus didactique que les articles déjà proposés sur le [Blog](https://blog.eleven-labs.com/) : des tutoriels à suivre étape après étape.

### Quelles features ?

Après la réunion de brainstorm, les features retenues sont les suivantes :

- Une page d'accueil affichant un splash et la liste des cours
- Une navigation intuitive entre les étapes des tutoriels
- Un moteur de recherche
- Le display des progrès de lecture de chaque cours

### Organization

Write something here ...

### Static site generation

Créer une application comme celle-ci implique de se confronter à des problématiques complexes, comme le fait de monter une architecture server-side, en maintenant la base de données et en utilisant des moteurs de template. Pour se soustraire à ces difficultés, nous avons opté pour une technique de génération de site statique.

Le concept de génération de site statique repose sur l'aspect serverless d'une application. Quand un utilisateur appelle une page, l'application va chercher le contenu depuis des fichiers stockés en local, plutôt que depuis des scripts server-side, qui eux iraient extraire les données depuis des bases distantes. L'absence de requêtes vers des bases de données, de traitement côté serveur, et de moteurs de templates rendent l'application particulièrement rapide.

[image]

Travailler avec des fichiers statiques permet de tirer avantage des features du SCM (Source Code Management, ce qui permet de controller le versioning du contenu. C'est extrêmement prometteur car en se mettant à la place d'un auteur, on  ne peut qu'apprécier la possibilité de garder une trace de l'avancement de l'écriture des tutoriels, de pouvoir rétablir une modification. Dans la pratique c'est toujours mieux de ne pas avoir à se soucier de la perte de son contenu.

Un autre avantage est le fait de ne pas avoir à se soucier non plus de la securité grâce à l'aspect serverless et à l'absence de données utilisateurs, ce qui évite beaucoup de contraintes.


### La stack

Les choix sont multiples lorsqu'il s'agit de définir une stack pour votre projet. Mais chez Eleven Labs nous sommes assez fan de l'ecosystème React, qui rend très accessible un développement web "moderne", si l'on considère à quel point cela demande peu d'efforts de construire une expérience utilisateur qualitative. Nous ne couvrirons pas plus en détails cet aspect, car plusieurs articles s'attardent déjà sur React et Redux. Mais vous connaissez le principe ! Webpack, Components, Props, State, Actions, reducers... et tout le toutim.

### Le Workflow

Nous voulions garder quelque chose de simple, donc nous avons gardé le process déjà éprouvé du blog :

- Écrire les articles en Markdown
- Stocker les fichier dans le repo (ce qui permet de bénéficier des avantages du système de Pull requests et de reviews).

### La structure d'un cours

Un tutoriel est structuré, dans son dossier,  par les fichiers suivants :

- index.json
- index.md
- step1.md
- step2.md
- …

### Génération des composants react

Cette partie explique la transformation du Markdown en composants react, ce qui se concrétise par le display d'un tutoriel au lecteur. Cette feature critique devait être traitée avec la plus grande attention. À cause de sa nature sensible, nous ne voulions pas d'une librairie tierce qui assumerait la transformation du Markdown en Composants, même si il en existe un bon nombre. Cette feature étant constitutive de la valeur ajoutée du projet, nous ne pouvions envisager qui puisse éventuellement avoir des problèmes lors d'upgrades, ou de se débattre avec des bugs insolvables. Nous voulions un contrôle total au fil de l'eau.

Manager le Markdown signifie que nous devons le parser dans quelque chose plus structuré, qui puisse facilement être interprété, dans l'optique d'avoir plus de contrôle sur notre process d'évolution des composants.

#### Abstract Syntax Tree (AST)

> Un "Abstract Syntax Tree", ou seulement "Syntax tree", est une représentation en arborescence de la structure syntaxique abstraite du code source écrit dans un langage de programmation.
> Wikipedia

L'AST est un concept largement répandu dans la génération de code source. Il est utilisé par les compilateurs dans l'analyse de syntaxe, à différentes fins. En premier lieu, l'analyse sémantique permet au compilateur de vérifier si un programme utilise correctement les éléments de langage. Il est aussi utilisé dans le type-checking (ex : Typescript, Flow...) and dans bien d'autres cas.

Dans notre contexte, AST est la représentation de la structure du Markdown. Ça fournit un moyen fiable de naviguer à travers les noeuds (Paragraphes, titres, listes...) qui composent un texte en Markdown.

En voici un exemple : 

```md
hello *world*
```


Et son AST :

```json
{
  "type": "Document",
  "children": [
    {
      "type": "Paragraph",
      "children": [
        {
          "type": "Str",
          "value": "hello ",
          "loc": {
            "start": { "line": 1, "column": 0 },
            "end": { "line": 1, "column": 6 }
          },
          "range": [0, 6],
          "raw": "hello "
        },
        {
          "type": "Emphasis",
          "children": [
            {
              "type": "Str",
              "value": "world",
              "loc": {
                "start": { "line": 1, "column": 7 },
                "end": { "line": 1, "column": 12 }
              },
              "range": [7, 12],
              "raw": "world"
            }
          ],
          "loc": {
            "start": { "line": 1, "column": 6 },
            "end": { "line": 1, "column": 13 }
          },
          "range": [6, 13],
          "raw": "*world*"
        }
      ],
      "loc": {
        "start": { "line": 1, "column": 0 },
        "end": { "line": 1, "column": 13 }
      },
      "range": [0, 13],
      "raw": "hello *world*"
    }
  ]
}
```

En se basant sur cet AST, il devient facile de prédire ce qui se passe ensuite. On sait que parmi chaque propriété de noeud, il y a un `type`, et bien souvent une propriété `children`. Cela nous rappelle les bases du développement React (props, children). Maintenant voyons comment cela va nous aider à générer des composants React.

bien sûr, nous allons créer programmatiquement des composants durant la traversée de l'AST, donc nous devrons être attentifs à la signature de certaines fonctions dans l'API React. en particulier `createElement` et `createFactory` :

```ts
function createElement<P>(
    type: SFC<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
    ...children: ReactNode[]): ReactElement<P>;

function createFactory<P>(type: ComponentClass<P>): Factory<P>;
```

N.B.: Il y a plusieurs signatures pour ces fonctions, mais ici j'utilise les plus classiques.

Comme on peut le voir, `createElement` accept une string en tant que type, et ce doit être un "tag name" en HTML. Donc si on se base sur ces types dans l'AST généré, on a `Document`, `Paragraph`, `Emphasis` et `Str`. On peut considérer le mapping suivant :

```js
const AST_NODES = {
  Document: 'div',
  Paragraph: 'p',
  Emphasis: 'em',
};
```

The `Str` type is a simple string that has to be added to HTML as a text node, so we don’t need to specify a tag name for it.

We’re going to use `createFactory` to create a function that returns a component.

```js
const createComponent = ast => React.createFactory(
  class extends React.Component {
    static displayName = ast.type;
    static defaultProps = {};

    shouldComponentUpdate() {
      return false;
    }

    render() {
      return React.createElement(
        AST_NODES[ast.type], // type
        {}, // props
        [], // content
      );
    }
  },
);
```

`createComponent` takes an AST and returns a component factory that creates a React component with empty props and empty children (for the moment). But how are we going to fill in the blanks? Since AST is a tree, we need to think about recursivity. `createComponent` will be fed to a loop that walks through the main AST document. So we need to call it again inside the components that has children in order to keep the parsing going until it reaches the leafs (`type === ‘Str’`).


Take a look at the walk function:
```js
function* walk(ast) {
  if (ast.children) {
    for (const child of ast.children) {
      yield child.type === 'Str' ? child.raw : createComponent(child);
    }
  }
}
```

It’s a simple `for of` loop that yields the created component, and when it reaches an Str node, it simply yields its value. So when we call `createElement`, we can call the walk generator to parse create the next level of components:

```js
  ...
  render() {
    return React.createElement(
      AST_NODES[ast.type],
      {},
      [...walk(ast)],
    );
  }
  ...
```

Since `createComponent` can return either a function (`type !== str`) or a string (`type === str`), we cannot have functions in the children of a React component, we need to resolve them in order to extract the real components:

```js
const resolveRenderer = renderer => (
 typeof renderer === 'function' ? renderer() : renderer
);

  ...
  render() {
    return React.createElement(
      AST_NODES[ast.type],
      {},
      [...walk(ast)].map(resolveRenderer),
    );
  }
```

#### Putting it all together

We created a factory that generates React components based on a markdown text. This factory parses the markdown using `markdown-to-ast`, then it recursively traverses the tree in order to create a content for each component:

```js
import React from 'react';
import { parse } from 'markdown-to-ast';

const AST_NODES = {
  Document: 'div',
  Paragraph: 'p',
  Emphasis: 'em',
};

function* walk(ast) {
  if (ast.children) {
    for (const child of ast.children) {
      yield child.type === 'Str' ? child.raw : createComponent(child);
    }
  }
}

const resolveRenderer = renderer => (
  typeof renderer === 'function' ? renderer() : renderer
);

const createComponent = ast => React.createFactory(
  class extends React.Component {
    static displayName = ast.type;
    static defaultProps = {};

    shouldComponentUpdate() {
      return false;
    }

    render() {
      return React.createElement(
        AST_NODES[ast.type],
        {},
        [...walk(ast)].map(resolveRenderer),
      );
    }
  },
);

const generateComponents = (md) => [...walk(parse(md))];

const components = generateComponents('hello *world*');

ReactDOM.render(
  <div>
    {components.map(renderer => renderer())}
  </div>,
  document.getElementById('root'),
);
```

This is a very simple version of the component generation process in Codelabs. Let’s see the results:

Here is the React representation of the generated components :

```
![React components result]({{site.baseurl}}/assets/2018-03-20-codelabs-under-the-hood/react-result.png)
```

And here is the corresponding HTML :

```
![Html result]({{site.baseurl}}/assets/2018-03-20-codelabs-under-the-hood/html-result.png)
```

### Deployment

Le deployement d'une application comme Codelab est assez complexe. En effet, la problématique est que les developpeurs qui travail sur le projet sont dispersé dans tout Paris. Il faut donc avoir un [Continuous Delevery](https://continuousdelivery.com/) simple et rapide. 

Nous avons donc choisis de faire comme pour notre blog un deployement lors du merge d'une PR dans Master. Ce qui est bien c'est que Travis permet facilement d'utiliser des scripts de deployement dans le Cloud lors de cet évènement.

Nous avons donc choisis d'effectuer le déployement dans Travis. 

Le deployement se fait en deux étapes :
- d'un coté les assets (Images, mais aussi les différents tutos en markdown) dans un (Bucket Google Cloud)[https://cloud.google.com/storage/]
- de l'autre un serveur Nginx via [AppEngine](https://cloud.google.com/appengine/) qui affiche le React.

Dans la config travis, que vous trouverez [ici](https://github.com/eleven-labs/codelabs/blob/master/.travis.yml). Vous pouvez voir que dans la partie `deploy` nous utilisons les providers `gae` pour Google App Engine, et `gcs` pour Google Cloud Storage. 

C'est assez simple à mettre en place il suffit de suivre la documentation :
- [`gae`](https://docs.travis-ci.com/user/deployment/google-app-engine/)
- [`gcs`](https://docs.travis-ci.com/user/deployment/gcs/)

Dans notre cas nous déployons dans le Bucket le dossier `_posts` qui contient les assets, ainsi que les tutos en markdown. Puis dans le App Engine, le dossier Nginx qui va déployer une machine docker avec Nginx et le code React.



