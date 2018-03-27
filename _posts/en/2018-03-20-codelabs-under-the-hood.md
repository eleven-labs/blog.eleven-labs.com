---
layout: post
title: Codelabs under the hood
excerpt: Introducing Eleven's Codelabs
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

After several months of hard work, we're excited to finally announce Eleven's Codelabs!

[image]

At the beginning of summer 2017, the idea of a tutorial platform made in Eleven began to take shape, and the project was born on Github. Then, in July 2017, a dozen motivated engineers gathered to brainstorm and define the features that may be part of the MVP. The project aims to separate tutorials from blog articles so that developers can follow a tutorial step by step.

### What’s inside the box?

Codelabs is a static site generator. And among the classic features that will be part of its MVP (List of tutorials, search engine, ...), there are some requirements that must be satisfied:

- Break a tutorial into step files, and load them on demand.
- Transform markdown into HTML in order to display the a tutorial to the reader.
- Build a global json file containing the metadata of all tutorials (in order to list them in the home page).
- Deploy into Google Cloud Storage.

### Static site generation

Creating an application like this involves dealing with several complex topics like mounting a server-side architecture, maintaining the database and using template engines. Hopefully, we chose to avoid these complications and opt for the static site generation technique.

The concept of static site generation is based on the serverless aspect of an application. When a user requests a page, the application fetches the content from plain files stored locally, instead of server-side scripts that extract data from databases. This makes the application relatively fast, due to the absence of database queries, server processing and templating engines.

Working with static files allows us to take advantage of SCM (Source Code Management) features so that we can control the versioning of our content. This is very promising because If you could put yourself in an author’s shoes for a moment, you realize that you want to keep track of your progress when writing your tutorials, and rollback changes when necessary, and I can assure you that it’s pretty much better when you don’t have to worry about losing your content.

Another advantage is that we don't have to worry about security, thanks to the serverless aspect and the lack of user input which saves us a lot of security work.

### The stack

There are plenty of choices when it comes to defining a stack for your project. But here in Eleven Labs, we are big fans of the React ecosystem, it makes modern web development so easy to tame, considering how with not much effort you can build a fairly decent experience. I'm not going to walk through the details of it, knowing that there is a whole bunch of articles out there talking about React and Redux. But hey! you know the drill; Webpack, Components, Props, State, Actions, Reducers, ... the whole nine yards.

#### The workflow

We wanted to keep it simple by using the same process we use in the blog:
- Writing articles using Markdown.
- Storing files in the repository (in order to take advantage of Pull Requests and reviews).

#### Course structure

A tutorial is represented by a folder structure that contains these files:

```txt
├── course
|   ├── index.json
|   ├── index.md
|   ├── step1.md
|   ├── step2.md
|   ├── ...
```

The index.json file contains the metadata of a tutorial, here is an example:

```json
{
  "title": "GraphQL with Apollo",
  "permalink": "/en/graphql-with-apollo/",
  "excerpt": "In this tutorial we are going to build a GraphQL server using the Apollo framework",
  "slug": "graphql-with-apollo",
  "stepTitles": [
    "Introduction",
    "Install GraphQL server",
    "Configure the Database",
    "Create GraphQL types",
    "Resolve queries",
    "Resolve mutations"
  ],
  "date": "2018-03-20",
  "cover": "/assets/2018-03-20-graphql-with-apollo/cover.jpg",
  "authors": [
    {
      "name": "Jonathan Jalouzot",
      "username": "captainjojo"
    }
  ]
}
```

### React components generation

This section explains the transformation of the Markdown into React components, which results in displaying a tutorial to the reader. As a matter of fact, this is a critical feature that must be dealt with diligently. Due to its sensitivity, we didn’t like the idea of using a third-party library to transform the Markdown to Components (even though there are plenty). This feature represents a big deal of the project's value. We can't afford disastrous situations where we might encounter some problems during upgrades, or hassle with bugs we can’t fix. We want full control over the flow.

Dealing with Markdown, means we need to parse it into something more structured that can be easily interpreted. So we can have more control over the evolution of our components generation process.

#### Abstract Syntax Tree (AST)

> An abstract syntax tree (AST), or just syntax tree, is a tree representation of the abstract syntactic structure of source code written in a programming language.
> — Wikipedia

AST is a concept that is widely used in source code generation. It’s used by compilers in syntax analysis for different purposes; mainly, the semantic analysis that allows the compiler to check whether a program uses correctly the elements of the language. It’s also used in type-checking (ex: Typescript, Flow, ...etc) and many other use cases.

In our context, AST is the representation of the Markdown’s structure. It provides a reliable way to walk through the nodes (Paragraphs, Headings, Lists, …) that compose a Markdown text.

Here is an example:

```md
hello *world*
```

And its AST:

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

Based on this AST, it's easy to predict what is going to happen next. We know that among every node’s properties, there is a `type`, and most commonly a `children` property. This actually reminds us of React development's basics (props, children). So let’s see how this can help us generate React components.

Of course we’re going to programmatically create components during the AST traversal, so we need to take a look at the signature of some of the functions in React API. These are `createElement` and `createFactory`:

```ts
function createElement<P>(
    type: SFC<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
    ...children: ReactNode[]): ReactElement<P>;

function createFactory<P>(type: ComponentClass<P>): Factory<P>;
```

PS: There are several signatures of these functions, but here I’m using the classic ones.

As we can see, `createElement` accepts a string as type, and it must be an HTML tag name. So based on the types in the generated AST we have a `Document`, `Paragraph`, `Emphasis` and a `Str` type. So we can consider the following mapping:

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

Write something here
App Engine
Write something here



