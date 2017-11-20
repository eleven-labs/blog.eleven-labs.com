---
layout: post
title: ECMAScript Asynchronicity - dynamic import
excerpt: Optimize your production code by splitting and lazy loading modules
authors:
    - kelfarsaoui
lang: en
permalink: /ecmascript-asynchronicity-dynamic-import/
categories:
    - ECMAScript
    - Asynchronous
    - Dynamic import
    - AMD
    - NodeJS
    - Lazy loading
    - Webpack
    - Modules
tags:
    - ECMAScript
    - Asynchronous
    - Dynamic import
    - AMD
    - NodeJS
    - Lazy loading
    - Webpack
    - Modules
cover: /assets/2017-10-04-ecmascript-asynchronicity-dynamic-import/cover.jpg
---

ECMAScript came up with some awesome features that demystify the concept of asynchronous programming. These features vary from promises, through asynchronous functions —and soon iterations— to lazy loading modules. Today I'm going to talk about one of the promising features in Javascript's Asynchronicity: ECMAScript's dynamic import.

### Motivation
Imagine you are developing a large scale web application, with several thousands of lines of code, and dozens of dependencies. And now you are happy that you're finally building your application to be ready for production. Once you create your bundle file and load it in the page, your application might work just fine. However, because life is full of unpleasant surprises, your app might be just another disappointment and you will end up feeling annoyingly uncomfortable.

Why is that? Your bundle, my friend, is nothing less than a massive file which requires too much time in order to be loaded in your page. Given some, not so glorifying, browsers performance, you're gonna need to address the situation.

Fortunately for you, there are some good folks out there working on stuff that can help you, stuff like code splitting. They make sure your app is loaded in several chunks, as small as possible, in order to accelerate the loading. The tools that provide this kind of features are: [RequireJS](https://requirejs.org), [SystemJS](https://github.com/systemjs/systemjs), [Webpack](https://github.com/webpack/webpack), [Rollup](https://rollupjs.org/) and [curl](https://github.com/cujojs/curl){:target="_blank" rel="nofollow noopener noreferrer"}. They are capable of bundling your app and generating your bundle chunks, and especially lazy loading them, so you can load only the one that you need at a given time.

Therefore, the use of dynamic import is necessary. Its main purpose is to optimize the amount of loaded code by lazy loading modules.

Since we're talking about modules, let's take a look at them.

### Modules

ECMAScript provides a module system that is similar to that of Node. Its modules are represented by simple files, and each module has its own context. This means that whatever variables, functions, etc, you declare inside of these files, they won’t pollute the global context.

```js
// add.js
const simpleAdd = (a, b) => a + b;

const multipleAdd = (...numbers) => numbers.reduce(simpleAdd, 0);

export default (...numbers) => multipleAdd(...numbers);
```

The code above declares 2 local functions and exports an anonymous one. We can't use the local functions outside of this module. In the module below, we only have access to what `add.js` exports, namely the anonymous function, which we are renaming to `add`.

```js
// service.js
import add from './add';

export default () => {
  console.log(add(1, 2, 3, 4));
}
```

The ascension of ES6 made it possible to put an end to the choice between the two protagonist systems of ES5: `CommonJS` and `AMD`. ES6 system has a declarative syntax, which makes it clear and simple. It combines their benefits, and provides an intuitive syntax that makes it easy for engineers to handle.

It even goes beyond the capabilities of ES5 system by using both synchronous and asynchronous loading, along with a static module structure. That is, you need to explicitly specify what you are importing, by using module names instead of dynamic variables. So, the following is not recommended:

```js
import myService from `../services/${myServiceName}`;
```

The static aspect of ES6 modules comes up with some great benefits:

- It makes it easy for bundlers to eliminate unused modules and de-duplicate redundant ones when bundling. This is called Tree Shaking —which was made popular by the module bundler [Rollup](https://rollupjs.org/){:target="_blank" rel="nofollow noopener noreferrer"}.
- Allows cyclic dependencies between modules.
- Provides variable checking that we can think of as a "shallow type checking", which will give us the opportunity to early catch common errors.
- Gives the possibility to add static type checking in future versions of ECMAScript.

For further reading on modules, check Dr. Axel Rauschmayer's [online book](http://exploringjs.com/es6/ch_modules.html){:target="_blank" rel="nofollow noopener noreferrer"} on modules.

### Code splitting with Webpack

Webpack offers several features to optimize your application's bundle. Code splitting is among these features. It can be done in 2 different ways: declarative and imperative. The declarative way generates several bundles based on the entries you specify in Webpack's config, while the imperative way generates bundles based on dynamic imports in your code. Let's see how the declarative one is done:

Here is a classical Webpack config file:

```ts
// webpack.config.ts
import * as CompressionPlugin from 'compression-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

export default {
  devtool: 'source-map',
  target: 'web',
  entry: [
    './src/index',
  ],
  plugins: [
    new CompressionPlugin(),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      ...
    ],
  },
};
```

After building our app, Webpack generates only one bundle, `main.js`, with its source map `main.js.map`. And, thanks to the [`compression-webpack-plugin`](https://www.npmjs.com/package/compression-webpack-plugin){:target="_blank" rel="nofollow noopener noreferrer"}, we have also those files "gzip"ed.

```bash
$ NODE_ENV=production webpack -p
ts-loader: Using typescript@2.5.3 and /Users/kamal/code/vacs/tsconfig.json
Hash: 35488b05aa5b90774401
Version: webpack 3.6.0
Time: 10955ms
         Asset       Size  Chunks                    Chunk Names
       main.js     406 kB       0  [emitted]  [big]  main
   main.js.map    3.83 MB       0  [emitted]         main
    main.js.gz    97.7 kB          [emitted]
main.js.map.gz     803 kB          [emitted]  [big]
    index.html  246 bytes          [emitted]
  [38] (webpack)/buildin/global.js 509 bytes {0} [built]
  [50] ./src/constants.ts 173 bytes {0} [built]
  ...
Done in 13.48s.
```

One of the ways you can split your bundle is by defining entry points in Webpack config. These entry points represent the chunks that will be generated. Another way is by using [CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/){:target="_blank" rel="nofollow noopener noreferrer"}. In the following example, we’re going to use both ways.

How to choose your entry points is totally up to you. In our case, we will adopt a strategy that will help us isolate vendor libraries in a single chunk. Then, we create another chunk only for our app’s code.

```ts
import * as HTMLWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

export default {
  devtool: 'source-map',
  entry: {
    styles: path.join(__dirname, 'src', 'assets', 'scss', 'main.scss'),
    main: path.join(__dirname, 'src', 'index'),
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    }),

    new HTMLWebpackPlugin({
      title: 'App',
      template: './templates/index.ejs',
    }),
  ],
  output: {
    path: path.join(__dirname, 'demo'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  ...
}
```

In our entry property, we're specifying 2 entry points `main` and `styles`, and we're using the `CommonsChunkPlugin` to intercept vendor modules, so that we can isolate them in a single chunk `vendor.js`. This is done by the `minChunks` function of the plugin.

```bash
$ NODE_ENV=production webpack -p
ts-loader: Using typescript@2.5.3 and /Users/kamal/code/vacs/tsconfig.json
Hash: 5aabff62c38fc1681fe7
Version: webpack 3.6.0
Time: 12965ms
        Asset       Size  Chunks                    Chunk Names
      main.js    15.3 kB       0  [emitted]         main
    styles.js  926 bytes       1  [emitted]         styles
    vendor.js     388 kB       2  [emitted]  [big]  vendor
  main.js.map    66.8 kB       0  [emitted]         main
styles.js.map     5.8 kB       1  [emitted]         styles
vendor.js.map    3.78 MB       2  [emitted]         vendor
   index.html  360 bytes          [emitted]
  [49] (webpack)/buildin/global.js 509 bytes {2} [built]
  ...
Done in 16.68s.
```

Until now we've only seen how to split our code at compile time, how about runtime?

### Lazy loading

Lazy loading is a much cooler feature than simple code splitting; not only it splits your code, but loads only the chunks you need. It allows you to incrementally load your app. This is a piece of cake for ECMAScript's `import()`, but before getting there, let's see how the legacy way was:

---
#### Webpack's `require.ensure`

In the following example we will see how to asynchronously load the `StoryEditor` component from `Editor`:

```js
// StoryEditor.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StoryEditor extends Component {
  ...
}
```

Here is the Editor component that loads the `StoryEditor` component asynchronously, using the `require.ensure` method:

```js
// Editor.jsx
import React from 'react';
import PropTypes from 'prop-types';

export default class extends React.Component {
  static propTypes = {
    story: PropTypes.shape().isRequired,
  };

  state = {};

  componentDidMount() {
    require.ensure(['./editors/StoryEditor'], (require) => {
      const StoryEditor = require('./editors/StoryEditor');
      this.setState({ entityEditor: StoryEditor });
    });
  }

  render() {
    const { entityEditor: EntityEditor } = this.state;

    return (
      <div className="editor">
        <div className="editor-header">
          <div className="editor-header-title">Editor</div>
          <button
            className="editor-header-close"
            onClick={this.props.close}
          >Close</button>
        </div>
        <div className="editor-body">
          {EntityEditor && <EntityEditor {...this.props} />}
        </div>
      </div>
    );
  }
}
```

In the `componentDidMount` lifecycle method we use `require.ensure` to load and make available the `StoryEditor` component. Then, we use the static `require` to extract and display it.

So, when we execute our code, the file that is loaded should be as follows:

```js
webpackJsonp_name_([0],{

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

... // too much code

var StoryEditor = function (_Component) {
  _inherits(StoryEditor, _Component);

  ... // too much code

  return StoryEditor;
}(_react.Component);

exports.default = StoryEditor;
module.exports = exports['default'];

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

... // too much code

var FormGroup = function FormGroup(_ref) {
  ... // too much code
};

exports.default = FormGroup;
module.exports = exports['default'];

/***/ })

});
//# sourceMappingURL=0.js.map
```

This ugly code is the result of transpiling and bundling the `StoryEditor` component. As you can see, it asynchronously loaded children components too, namely `FormGroup`.

There is, however, some restrictions to this approach. The `require.ensure` method resolves modules statically. It means that you need to specify the modules in string literals, that are evaluated at compile time, so you can't use variables. But, if you want to lazy load modules dynamically, ECMAScript's dynamic `import()` will have the pleasure to satisfy your request.

---
#### `import()`

The dynamic import is a pretty awesome feature ECMAScript came up with. It offers the possibility to handle cases like: computed module specifiers, conditional loading of modules, accessing exports and default exports, and many more. The [dynamic import proposal](https://github.com/tc39/proposal-dynamic-import){:target="_blank" rel="nofollow noopener noreferrer"} is in stage 3 at the time of this writing.

Like `require.ensure`, `import()` relies on `Promise`. This implies that you have to use some polyfills like [es6-promise](https://www.npmjs.com/package/es6-promise) or [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) in order to make it work. You're gonna need `babel` support too, using the [Syntax Dynamic Import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) plugin that allows the parsing of `import(){:target="_blank" rel="nofollow noopener noreferrer"}`.

```json
// .babelrc
{
  "presets": ["env", "react"],
  "plugins": [
    "syntax-dynamic-import"
  ]
}
```

Here is the `import()` version of the previous example:

```js
  ...
  async componentDidMount() {
    this.setState({ entityEditor: await import('./editors/StoryEditor') });
  }
  ...
```

So intuitive!

In the `require.ensure` example, we've seen how it loads a statically resolved modules. Now, what if `Editor.jsx` doesn't know which editor to load? What if we give it an array of editors, so it can load them? Let's see how `import()` handles this like a boss:

```js
// Editor.jsx
import React from 'react';
import PropTypes from 'prop-types';


export default class extends React.Component {
  static propTypes = {
    story: PropTypes.shape().isRequired,
    editors: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    editors: [
      'StoryEditor',
      'MessageEditor',
    ],
  };

  state = {};

  async componentDidMount() {
    const { editors } = this.props;
    const loadedEditors = await Promise.all(editors.map(this.importEditor));
    this.setState({ loadedEditors });
  }

  importEditor(module) {
   return import(`./editors/${module}`);
  }

  render() {
    const { loadedEditors } = this.state;

    return (
      <div className="editor">
        <div className="editor-header">
          <div className="editor-header-title">Editor</div>
          <button
            className="editor-header-close"
            onClick={this.props.close}
          >Close</button>
        </div>
        <div className="editor-body">
          {loadedEditors && loadedEditors.map((editor, key) => {
            const renderer = React.createFactory(editor);
            return renderer({ ...this.props, key });
          })}
        </div>
      </div>
    );
  }
}
```

The `import()` statement is dynamic. Yes! But it needs something to rely on: a context. In our case, this context is the `./editors/` that we feed it.

```js
  ...
  importEditor(module) {
    return import(`./editors/${module}`);
  }
  ...
```

At compile time, ECMAScript cannot resolve the `module` argument. It's going to systematically ignore it, and take the first static piece of the module name `./editors/`, then generate a context module using it.

Wait, what the heck is a context module?

A context module is a kind of bundle that Webpack generates for a given directory, in order to make it possible to **dynamically** load any file in that directory. Take for example Webpack's [`require.context`](https://webpack.js.org/api/module-methods/#require-context){:target="_blank" rel="nofollow noopener noreferrer"} function:

```js
const context = require.context('./editors/', true, /\.jsx?$/);

context.keys(); // returns ["./StoryEditor.jsx", "./MessageEditor.jsx"]
```

We just created a context module that contains the 2 files `StoryEditor.jsx` and `MessageEditor.jsx`. Now, we can dynamically load them by simply `require`ing them:

```js
const context = require.context('./editors/', true, /\.jsx?$/);

var modules = ((contextRequire) => {
  return contextRequire.keys().map(contextRequire);
})(context);
```

_**Notice**: the context returned from `require.context` is a function that works like a local `require`, and in the same time an object that contains the paths to all the files it holds._

Here is what Webpack says about `require.context`:
> A context module is generated. It contains references to all modules in that directory that can be required with a request matching the regular expression. The context module contains a map which translates requests to module ids.
>
>The context module also contains some runtime logic to access the map.
>
>–– https://webpack.github.io/docs/context.html

Okay, but what about asynchronous routing?

### Example of asynchronous routing

Using `react-router` we will define some routes in our app in order to load the components of those routes asynchronously:

Here are some classic routes:

```js
// routes.jsx
import App from './App';
import ListPage from './containers/ListPage';
import StoryPage from './containers/StoryPage';

export default [{
  component: App,
  routes: [
    {
      path: '/list',
      exact: true,
      component: ListPage,
    },
    {
      path: '/stories/:id',
      exact: true,
      component: StoryPage,
    },
  ],
}];
```

The components are loaded synchronously because we're importing them statically. To do it dynamically we need to use a wrapper component that loads the other components —`ListPage` and `StoryPage`. The wrapper component uses the `componentDidMount` lifecycle method to load those components.

We are going to write it as a factory function that takes a `name` argument in order to know what to load.

```js
// asyncComponentFactory.js
export default name => class extends React.Component {
  static displayName = `${name}Wrapper`;

  state = {};

  async componentDidMount() {
    const component = await import(`./containers/${name}`);
    this.setState({ component });
  }

  render() {
    const { component } = this.state;

    if (!component) {
      return null;
    }

    const renderer = React.createFactory(component);
    return renderer(this.props);
  }
};
```

This factory returns a component class which the router renders in the page, and once it is mounted, the class imports the real component (`ListPage` or `StoryPage`) and renders it. The following explains how we should use it:

```js
// routes.jsx
import App from './App';
import AsyncComponentFactory from './asyncComponentFactory';

export default [{
  component: App,
  routes: [
    {
      path: '/list',
      exact: true,
      component: AsyncComponentFactory('ListPage'),
    },
    {
      path: '/stories/:id',
      exact: true,
      component: AsyncComponentFactory('StoryPage'),
    },
  ],
}];
```

Now, all you need to do is visit those routes, so that you can appreciate how amazing asynchronous import of components is. In the case of the `/list` route, React's representation of the components tree should look like this:

```html
<Route>
  <ListPageWrapper>
    <ListPage>
      ...
    </ListPage>
  </ListPageWrapper>
</Route>
```

### Conclusion

Optimizing production performances is a boundless topic. There are many other strategies that help improving it. Thus it should be clear that Asynchronicity is merely one solution amongst other various ones that can be used to enhance production performances. I hope this post was useful and could enlighten some curious minds about ECMAScript's asynchronous loading.

Thanks for reading.
