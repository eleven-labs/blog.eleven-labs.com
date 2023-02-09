---
layout: post
lang: en
date: '2017-09-03'
categories:
  - javascript
authors:
  - vcomposieux
cover: >-
  /assets/2017-09-03-migrer-une-application-react-client-side-en-server-side-avec-nextjs/cover.jpg
excerpt: >-
  Most of the front-end applications using React that I've been able to work on
  are browser-based (client-side) applications.
title: Migrate a React client-side application to server-side with Next.JS
slug: migrate-a-react-client-side-application-to-server-side-with-nextjs
oldCategoriesAndTags:
  - javascript
  - react
  - frontend
  - server
  - nextjs
permalink: /en/migrate-a-react-client-side-application-to-server-side-with-nextjs/
---

Most of the front-end applications using React that I've been able to work on are browser-based (client-side) applications.

However, depending on the tools you use, they may not be visible to search engines and therefore prevent a good indexing of your content (SEO).

To overcome this problem, frameworks have been developed to make server-side React applications possible.
This is the case of [Next.JS](https://github.com/zeit/next.js){:rel="nofollow noreferrer"}{: target="blank"} which we will study in this article.

I had a React application used client-side and migrated it to a server side rendering in just a few hours thanks to the framework.
The purpose of this article is to share with you my technical experience on this migration.

First steps
-----------

First of all, we need to look at what Next.JS has to offer so that we can see if this framework fits our needs:

* A [simple installation](https://github.com/zeit/next.js#setup){:rel="nofollow noreferrer"},
* Rendering of [static files](https://github.com/zeit/next.js#static-file-serving-eg-images){:rel="nofollow noreferrer"} such as images and CSS files in a `static` directory,
* Routing URLs pre-defined from the names of the JS files in the `pages` directory,
* Possibility to define [customized/parameterized routes](https://github.com/zeit/next.js/#custom-server-and-routing){:rel="nofollow noreferrer"} (but I used [next-routes](https://github.com/fridays/next-routes){:rel="nofollow noreferrer"} for this, a cleaner way),
* Running [server-side actions only](https://github.com/zeit/next.js#fetching-data-and-component-lifecycle){:rel="nofollow noreferrer"},
* Simple integration with Redux using [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper){:rel="nofollow noreferrer"}.

So you should have everything you need to migrate your project. Let's get started!

Adding dependencies
-------------------

The first thing to do is to add our dependencies to the `package. json` file:

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

We therefore add here our three dependencies: `next`, `next-redux-wrapper` and `next-routes`. No need to go into more details on the subject, to me the name of the libraries seems clear enough to guess their usefulness.

We also need to modify the scripts. Indeed, we will now need a `node` HTTP server and will use the `next' library to build and develop our application with an on-the-fly compiler.

Note that for the moment, I have kept `react-scripts` to run my tests but this one could of course be deleted.

New file structure
------------------

We will respect the conventions proposed by Next.JS, so we will place our different pages in a directory named `page`, and our static files in a `static` directory.

The only difference is that we will place them in `src`. This is why we have specified this directory in the previous commands.

So here's our project structure:

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

We kept the same file structure we had with our client-side project and simply added the `pages` and `static` directories (which were previously named `assets` in our case).

You can already run the server on your development machine by running:

```
$ npm run dev (ou yarn dev)
```

On the production side, the `server.js` node server will be executed. Here's his code:

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

We instantiate here Next.JS and retrieve the routes we will create later.
We also specify the `src` directory and specify that you are not in a development environment to optimize the build.

Writing the first page
----------------------

Now it's time to write our first server-side page!

We will start with a very simple homepage. Place a file at `src/pages/index.js`:

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

Very simple, we instantiate a `Page` React object comprising the components that will form our page and call a function returned by `withRedux(store)` (provided by the `next-redux-wrapper` library) to synchronize our Redux store on this page.

This way, our entire page (and the components included inside) will have access and can manipulate the Redux store.

If you go to `http://localhost:3000/` now, your homepage should be visible!

Customized routes / including variables
---------------------------------------

Unfortunately, it is a bit complicated to declare custom routes and/or containing variables directly via Next.JS framework, that's why I choose to use the `next-routes` library which will allow me to do this very simply.

For this example, we will start with a `/category/: slug` URL.

We must then declare a file to `src/routes.js` with the following content:

```js
const routes = module.exports = require('next-routes')()

routes
  .add('category', '/category/:slug')
```

When the URL `/category/: slug` is called (or slug is a dynamic value), the `src/pages/category.js` file will be called.

Let's create this file:

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

As you can see here, we have added the following code to the component, allowing us to retrieve the `slug` parameter from the request and send it to our page component in its props (and then to our `Category` component):

```js
Page.getInitialProps = async ({ query }) => {
    return { slug: query.slug }
}
```

Really simple, isn't it? You now know how to perform dynamic routing!

Server-side requests
--------------------

The `getInitialProps()` method presented above will also allow you to make server-side requests, which means that the end client will not know about it.

This way, you will be able to retrieve the API data and insert it into your store.

Manipulating templates
----------------------

In the templates of your React components, you can declare links to your routes this way, by importing the `Link` component available through your `routes.js` file and then:

{% raw %}
```js
import { Link } from '../routes';

<Link route='category' params={{slug: 'hello-world'}}>
    Go to hello-world category
</Link>
```
{% endraw %}

Note that you can also use the following notation:

```js
<Link route='category/hello-world'>
```

> **Note :**
> You can add a `prefetch` attribute if you want to preload your pages.

Next.JS also provides a `Head` component that will allow you, as its name suggests, to manipulate the `<head>` HTML of your page.

To define the `<title>` of your page, you must write:

```js
import Head from 'next/head';

const Page = () => (
    <Head>
        <title>My homepage title</title>
    </Head>
    ...
)
```

Another element that will allow you to improve your referencing and to further personalize your pages.

Conclusion
----------

Migrating from a client-side React application (initialized with `create-react-app`) took me only a few hours because the `Next.JS` framework is really easy to use and the community already quite large.

In fact, Next.JS integrates very well with most of the React ecosystem tools.

I hope this article will help you migrate your client-side application to server-side.
