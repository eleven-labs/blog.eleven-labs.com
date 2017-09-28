---
layout: post
title: ECMAScript Asynchronicity - dynamic import
excerpt: Optimize your bundles
authors:
    - kelfarsaoui
permalink: /en/ecmascript-asynchronicity-dynamic-import/
categories:
    - ecmascript
    - asynchronous
    - dynamic import
    - AMD
    - NodeJS
    - Lazy loading
    - webpack
    - Modules
tags:
    - ecmascript
    - asynchronous
    - dynamic import
    - AMD
    - NodeJS
    - Lazy loading
    - webpack
    - Modules
cover: /assets/2017-08-16-json-server/cover.jpg
---

ECMAScript came up with some awesome features that demystify the concept of asynchronous programming. They go from promises, through asynchronous functions (and soon iterations), to lazy loading modules. Today I'm going to talk about ECMAScript's dynamic import, one of the promising features in Javascript's Asynchronicity.

### motivation
Imagine you are developing a large scale web application, with several thousands of lines of code, and dozens of dependencies. And, now you are happy that you're finally building your application to be ready for production. Once you create your bundle file and load it in the page, your application might work just fine. However, because life is full of surprises which are sometimes unpleasant, your app might be just another disappointment and you will end up feeling annoyingly uncomfortable. 

Why is that? Your bundle, my friend, is nothing less than a massive file that's gonna need a big deal of time to load into your page. Given some, not so glorifying, browsers performance, you're going to need to address the situation.

Fortunately, there are some good folks out there, who are working on stuff that can help you. Stuff like code splitting, to make sure your app is loaded in several chunks, as small as possible, in order to accelerate the loading. The tools that provide this kind of features are: [RequireJS](https://requirejs.org), [SystemJS](https://github.com/systemjs/systemjs), [Webpack](https://github.com/webpack/webpack) and [curl](https://github.com/cujojs/curl). They are capable of bundling your app and generating your bundle chunks, and especially lazy loading them, so you can load only the one that you need at a given time.

Therefore, the use of dynamic import is necessary. Its main purpose is to optimize the amount of loaded code by lazy loading modules.

Since we're talking about modules, let us take a look at them.

### modules

ECMAScript provides a module system that is similar to Node’s one. Its modules are represented by simple files, each module has its own context, this means that whatever stuff you declare inside of it (variables, functions, ...), won’t pollute the global context. These modules can be imported and used inside other modules, and taking advantage of what they export.

```js
// add.js
const simpleAdd = (a, b) => a + b;

const multipleAdd = (...numbers) => numbers.reduce(simpleAdd, 0);

export default (...numbers) => multipleAdd(...numbers);
```

The code above declares 2 local functions, and exports an anonymous one. We can't use the local functions outside this module. In the module below, we have only access to what `add.js` exports, namely the anonymous function (which we are naming `add`).

```js
// service.js
import add from './add';

export default () => {
  console.log(add(1, 2, 3, 4));
}
```

The ascension of ES6 made it possible to put an end to the choice between the two protagonist systems of ES5: `CommonJS` and `AMD`. because a system with a declarative syntax, thanks to its clarity and simplicity, is much better. It combines their benefits, and provides an intuitive syntax that makes it easy, for engineers, to handle.

It even goes beyond the capabilities of ES5 system by using both synchronous and asynchronous loading. Also, by having a static module structure, which means that you need to explicitly specify what you are importing, by using module names instead of dynamic variables. So you can't do something like this:

```js
import myService from `../services/${myServiceName}`;
```

The static aspect of ES6 modules come up with nice benefits:

- It make it easy for bundlers to eliminate unused modules and de-duplicate redundant ones when bundling.
- Allows cyclic dependencies between modules.
- Variable checking that we can think of as a "shallow type checking", which will give us the opportunity to early catch common errors.
- Possibility to add static type checking in future versions of ECMAScript.

For further reading on modules, check Dr. Axel Rauschmayer's [online book](http://exploringjs.com/es6/ch_modules.html) on modules.

### code splitting with webpack

the normal declarative syntax looks like CommonJS require(), but works more like AMD behind the scenes (which is necessary for browsers). And for that, everything needs to be fixed *before* actually running the code. Look at the use cases again: none of them would work with the declarative syntax.
  - `require.ensure` vs `import()`

#### Prerequisites

The [dynamic import proposal](https://github.com/tc39/proposal-dynamic-import) is in stage 3 (At the time of this writing), 

> This feature relies on Promise internally. If you use import() with older browsers, remember to shim Promise using a polyfill such as es6-promise or promise-polyfill.


[Syntax Dynamic Import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) : Allow parsing of `import()`.

babel config

[babel-plugin-dynamic-import-webpack](https://github.com/airbnb/babel-plugin-dynamic-import-webpack) Babel plugin to transpile import() to require.ensure, for Webpack

Node.js: Guy Bedford’s node-es-module-loader provides a Node.js executable that supports ES6 module syntax and import().

webpack v1: babel-plugin-dynamic-import-webpack is a Babel plugin that transpiles import() to require.ensure().

webpack v2 (v2.1.0-beta.28 and later): supports code splitting via import()
babel config

### Une app composée de 3 bundles.

1. pour l'affichage de la liste et les actions qu'on peut faire sur les elements (like, dislike, ...)
2. pour l'affichage d'un élément et ses sous éléments
3. pour la visualisation
