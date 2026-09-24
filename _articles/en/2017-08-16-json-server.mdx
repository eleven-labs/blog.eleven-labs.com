---
contentType: article
lang: en
date: '2017-08-16'
slug: json-server
title: JSON Server
excerpt: Accelerate your prototyping process by mocking your APIs using JSON Server
oldCover: /assets/2017-08-16-json-server/cover.jpg
categories:
  - javascript
authors:
  - kelfarsaoui
keywords:
  - json
  - api
  - nodejs
---

Hello, Today I’m going to talk about [json-server](https://github.com/typicode/json-server), what is it? why use it? and especially how to use it?

`json-server` is a cool `npm` module, that provides an [Express](https://github.com/expressjs/express) server that serves a JSON API.

## Why use it?

Let's say you are starting to work on your awesome (Javascript, PHP, IOS, Android, … whatever) app, and you want to consume remote data of some, not finished yet, API. The first step you take consists in setting up some mocks, either hard coded in some constant (please, don't do this), or using a static JSON file, which will be a pain in the neck. Why? You're a good developer who likes to do the right thing. You want to test your app against data updates. You want to perform HTTP requests (like `GET`, `POST` …etc.), and you want to persist your updates. Unfortunately, you can't do all of this using a static file, you need to look for a way to make it dynamic. So, unless your pal who's developing the API has finished their work, you're gonna need some serious help.

Here comes `json-server`, it allows you to mock the API, and provide dynamic access to data. By dynamic, I mean that we can read, add, update, and delete data (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

It provides common URL use cases like:
- [Routes](#routes) (`/articles/1`)
- [Filters](#filters) (`/articles/1/comments?author.username=rpierlot`)
- [Pagination](#pagination) (`/articles?_page=2&_limit=10`)
- [Full text search](#full-text-search) (`/articles?q=graphql`)
- [Relationships](#relationships) (`/articles?_embed=comments`)

and other miscellaneous stuff like:
- `CORS` & `JSONP`
- Ability to access remote schemas
- [Randomly generated data](#random-data)
- [Custom routes](#custom-routes)
- [Middlewares](#middlewares)
- [Ability to use `json-server` as a module in your NodeJS server](#nodejs-module)

Okay, let's get to it.

## How to use it?

This will take less than 5 minutes!

### Requirements

- NodeJS & `npm`
- An API consumer (Your code, `curl`, postman, or simply your browser)

### Installation

It's pretty straightforward to set up:

```bash
$ npm install -g json-server

# Or with yarn
$ yarn global add json-server

# Then create a folder in which we will put our db.json file:
$ mkdir blog && cd $_

# create our schema file
$ touch db.json
```

To fill it in, we can either do it by hand or use a random json generator (my favorite is [json-generator](http://json-generator.com))

```json
{
  "articles": [
    {
      "id": 1,
      "title": "Build an API using GO",
      "authorId": 2
    },
    {
      "id": 2,
      "title": "Build an API using API Platform",
      "authorId": 1
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "Brilliant",
      "articleId": 1
    },
    {
      "id": 2,
      "body": "Awesome",
      "articleId": 2
    }
  ],
  "authors": [
    {
      "id": 1,
      "username": "rpierlot",
      "title": "Romain Pierlot"
    },
    {
      "id": 2,
      "username": "qneyrat",
      "title": "Quentin Neyrat"
    }
  ]
}
```

Now we can run `json-server` so that we can access the endpoints that `json-server` created for us


```bash
$ json-server db.json

  \{^_^}/ hi!

  Loading db.json
  Done

  Resources
  http://localhost:3000/articles
  http://localhost:3000/comments
  http://localhost:3000/authors

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
```

Great, we've set up our API mock. Now we can test our endpoints:

```bash
$ curl http://localhost:3000/articles
[
  {
    "id": 1,
    "title": "Build an API using GO",
    "authorId": 2
  },
  {
    "id": 2,
    "title": "Build an API using API Platform",
    "authorId": 1
  }
]

$ curl http://localhost:3000/articles/1
{
  "id": 1,
  "title": "Build an API using GO",
  "authorId": 2
}
```

<a name="routes"></a>

### Routes

We can use almost all kinds of URIs to perform requests:
For example, to insert (create) a new author, we might use:
`POST http://localhost:3000/authors`

```bash
$ curl --data-urlencode "title=Vincent Composieux" --data "username=vcomposieux" http://localhost:3000/authors
{
  "title": "Vincent Composieux",
  "username": "vcomposieux",
  "id": 3
}
```

To read an article with article id 2: `GET http://localhost:3000/articles/2`. The same URI would be used for `PUT` and `DELETE`, to update and delete, respectively.

Now, when it comes to creating a new comment in an article, one option might be: `POST http://localhost:3000/comments` And that could work to create a comment, but it's arguably outside the context of an article.

As a matter of fact, this URI is not as intuitive as it could be. It could be argued that the following URI would offer better clarity: `POST http://localhost:3000/articles/1/comments`. Now we know we're creating a comment in article id 1.

```bash
$ curl --data-urlencode "body=Cool article ;-)" http://localhost:3000/articles/1/comments
{
  "body": "Cool article ;-)",
  "articleId": 1,
  "id": 4
}
```

Same with creating an article by author id 3:

```bash
$ curl --data-urlencode "title=GraphQL" http://localhost:3000/authors/3/articles
{
  "title": "GraphQL",
  "authorId": "3",
  "id": 3
}
```

<a name="filters"></a>

#### Filters, sort & operators

**Filtering** is done using query parameters: `GET http://localhost:3000/articles?title=GraphQL`.

**Sort** is as easy as adding `_sort` & `_order` (`asc` & `desc`) query parameters:

`GET http://localhost:3000/articles?_sort=likes`

(Assuming we have added the `likes` field to each article). The order is ascending by default.

In case we want to sort by multiple properties, we can write our properties separated by a comma:

`GET http://localhost:3000/articles?_sort=author,score&_order=desc,asc`

**Operators** are suffixes used to augment our query parameters:

* `_gt` (greater than), `_lt` (less than), `_gte` (greater than or equal) and `_lte` (less than or equal): `GET http://localhost:3000/comments?score_gte=5` (assuming we have a `score` field in the comments)
* `_ne`(not equal) negation of an expression `GET http://localhost:3000/comments?articleId_ne=2`
* `_like` is an operator that can be applied to string properties, it gives the same result as an `SQL`'s `LIKE`. `GET http://localhost:3000/articles?title_like=API`

<a name="pagination"></a>

#### Pagination

We can use the built-in query parameters `_page` & `_limit` to paginate our results.
`json-server` exposes `X-Total-Count` and the `Link` header that contain links to the first, next and last pages.

`GET http://localhost:3000/articles?_page=1&_limit=1`

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin, Accept-Encoding
Access-Control-Allow-Credentials: true
Cache-Control: no-cache
Pragma: no-cache
Expires: -1
X-Total-Count: 3
Access-Control-Expose-Headers: X-Total-Count, Link
Link: <http://localhost:3000/articles?_page=1&_limit=1>; rel="first", <http://localhost:3000/articles?_page=2&_limit=1>; rel="next", <http://localhost:3000/articles?_page=3&_limit=1>; rel="last"
X-Content-Type-Options: nosniff
Content-Type: application/json; charset=utf-8
Content-Length: 89
ETag: W/"59-24+hjZrVFdbtnn+FgcogU6QvujI"
Date: Sun, 30 Jul 2017 17:22:34 GMT
Connection: keep-alive
```

<a name="full-text-search"></a>

#### Full text search

We can implement a search feature in our app using full-text search by simply adding a `q` query parameter.

```bash
$ curl http://localhost:3000/articles?q=api
[
  {
    "id": 1,
    "title": "Build an API using GO",
    "author": "qneyrat"
  },
  {
    "id": 2,
    "title": "Build an API using API Platform",
    "author": "rpierlot"
  }
]
```

<a name="relationships"></a>

#### Relationships


We can see relationships using `_embed` & `_expand` parameters.
* `_embed` allows us to see the children resources like `comments`: `GET http://localhost:3000/articles?_embed=comments`
* `_expand` allows us to see the parent resources like `articles`: `GET http://localhost:3000/comments?_expand=article`

```bash
$ curl http://localhost:3000/articles?author=vincent&_embed=comments
[
  {
    "title": "GraphQL",
    "author": "vincent",
    "id": 3,
    "comments": [
      {
        "body": "nice",
        "articleId": 3,
        "id": 3
      },
      {
        "body": "great!",
        "articleId": 3,
        "id": 4
      }
    ]
  }
]


$ curl http://localhost:3000/comments?_expand=article
[
  {
    "id": 1,
    "body": "Brilliant",
    "articleId": 1,
    "article": {
      "id": 1,
      "title": "Build an API using GO",
      "author": "qneyrat"
    }
  },
  {
    "id": 2,
    "body": "Awesome",
    "articleId": 2,
    "article": {
      "id": 2,
      "title": "Build an API using API Platform",
      "author": "rpierlot"
    }
  },
  ...
]
```

Until now, we've seen only the routes part of `json-server`, there are a lot more things we can do, let's see what's next.

<a name="random-data"></a>

### Randomly generated data

The [basic example in Typicode's docs](https://github.com/typicode/json-server#generate-random-data) presents a simple script that generates the `users` endpoint. Here we are going to write endpoints that serve randomly generated data using a data faker module. Personally, I use [faker.js](https://github.com/Marak/faker.js), but there are others that you can explore like [Chance](https://github.com/chancejs/chancejs) and [Casual](https://github.com/boo1ean/casual).

The random aspect of the generation occurs only once, and that's when we run the script. This means that `json-server` won't give us a different response for each request. Eventually, we have to install our fake data tool, then write the generation script:

```bash
$ yarn add faker
$ touch generate.js
```

Keep in mind that the script must export a function that exclusively returns an object with keys (endpoints) inside.

```js
// generate.js
const faker = require('faker');

module.exports = () => ({
  messages: [...Array(3)].map((value, index) => ({
    id: index + 1,
    name: faker.hacker.noun(),
    status: faker.hacker.adjective(),
    description: faker.hacker.phrase(),
  })),
});
```

Then run json-server by giving it the generation script:

```bash
$ json-server generate.js

  \{^_^}/ hi!

  Loading generate.js
  Done

  Resources
  http://localhost:3000/messages

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
```

And the results would be something like:

```bash
$ curl http://localhost:3000/messages
[
  {
    "id": 1,
    "name": "driver",
    "status": "cross-platform",
    "description": "If we connect the system, we can get to the ADP panel through the redundant PCI protocol!"
  },
  {
    "id": 2,
    "name": "monitor",
    "status": "1080p",
    "description": "Try to synthesize the CSS driver, maybe it will navigate the bluetooth matrix!"
  },
  {
    "id": 3,
    "name": "hard drive",
    "status": "virtual",
    "description": "Use the redundant SMS program, then you can compress the bluetooth port!"
  }
]
```

And we can still perform requests on it as we've seen in the [routes](#routes) section.

<a name="custom-routes"></a>

### Custom routes

Let's imagine we are supposed to perform requests on several different endpoints on our future API, and these endpoints don't have the same URIs:

```url
/api/dashboard
/api/groups/ducks/stats
/auth/users
/rpierlot/articles
```

`json-server` allows us to specify route rewrites. We can address this problem by using a map that resolves the actual routes in our json schema:

```json
{
  "/api/:view": "/:view",
  "/api/groups/:planet/stats": "/stats?planet=:planet",
  "/:user/articles": "/articles?author=:user",
  "/auth/users": "/users"
}
```

So, when we start `json-server` it shows us the route rewrites we are using :

```bash
$ json-server --watch db2.json --routes routes.json

  \{^_^}/ hi!

  Loading db2.json
  Loading routes.json
  Done

  Resources
  http://localhost:3000/users
  http://localhost:3000/dashboard
  http://localhost:3000/stats
  http://localhost:3000/articles

  Other routes
  /api/:view -> /:view
  /api/groups/:planet/stats -> /stats?planet=:planet
  /:user/articles -> /articles?author=:user
  /auth/users -> /users

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
  Watching...
```

Now we can perform our custom requests to see the results:

```bash
$ curl http://localhost:3000/api/dashboard
{
  "visits": 3881,
  "views": 625128,
  "shares": 7862
}

$ curl http://localhost:3000/api/groups/ducks/stats
[
  {
    "planet": "ducks",
    "stats": {
      "points": 5625,
      "ships": 8
    }
  }
]
```

<a name="middlewares"></a>

### Middlewares

In case we want to augment our `json-server` instance with a specific behavior, we have the possibility to do so using custom middlewares, these middlewares are passed to the express server the same way we would do it when developing a classic express app. In this section, we're going to explore a useful example of a feature that is usually necessary.

Imagine we want to access a resource on the API, but it turns out that this resource is secured. We can say that it's just about data and assume that we'll be satisfied by just returning it, then we use `json-server` to provide the data without worrying about security. But, we know that something's odd, we want our app to be ready when our future API is ready, in order to test the whole thing together. So, instead of bypassing it, let's use middlewares to set up an authentication layer.

```js
// auth.js
const auth = require('basic-auth');

module.exports = (req, res, next) => {
  var user = auth(req);

  if (typeof user === 'undefined' || user.name !== 'kamal' || user.pass !== 'secret') {
    // We will discuss this line later in this section.
    res.header('WWW-Authenticate', 'Basic realm="Access to the API"');
    return res.status(401).send({ error: 'Unauthorized' });
  }

  next();
};
```

Now run the `json-server` command with the `--middlewares` option:

```bash
$ json-server --watch db2.json --routes routes.json --middlewares auth.js
```

Notice: the `--middlewares` option accepts a list of files. `--middlewares file1.js file2.js file3.js`.

Now let's test our authentication layer:

```bash
$ curl http://localhost:3000/api/groups/ducks/stats
{
  "error": "Unauthorized"
}
```

And we can see `json-server`'s log with the `401` HTTP status:

```bash
GET /api/groups/ducks/stats 401 12.180 ms - 29
```

When we display the headers of this response, we recognize this header `WWW-Authenticate: Basic realm="Access to the API"`:

```http
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Vary: Origin, Accept-Encoding
Access-Control-Allow-Credentials: true
Cache-Control: no-cache
Pragma: no-cache
Expires: -1
WWW-Authenticate: Basic realm="Access to the API"
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-t1Z3N2Fd2Yqi/vcyFQaHaMeQEew"
Date: Thu, 03 Aug 2017 09:59:57 GMT
Connection: keep-alive
```

Here is what Mozilla Developer Network tells about it:

> The `WWW-Authenticate` and `Proxy-Authenticate` response headers define the authentication method that should be used to gain access to a resource. They need to specify which authentication scheme is used so that the client that wishes to authorize knows how to provide the credentials.
>
> <cite>[HTTP authentication : `WWW-Authenticate` and `Proxy-Authenticate` headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#WWW-Authenticate_and_Proxy-Authenticate_headers)</cite>

Then we test again, and this time we add credentials to our request (Notice: `curl`'s `--user` option is not restricted to basic authentication, we can do other types of authentication, [see here](https://ec.haxx.se/http-auth.html)):

```bash
$ curl --user kamal:secret http://localhost:3000/api/groups/ducks/stats
[
  {
    "planet": "ducks",
    "stats": {
      "points": 5625,
      "ships": 8
    }
  }
]
```

Great! Obviously, it's a `200` HTTP status :-D

```bash
GET /api/groups/ducks/stats 200 4.609 ms - 94
```

<a name="nodejs-module"></a>

### As a NodeJS module

`json-server` is an `express` application, which means that we can use it in an existing node/express app to achieve special behaviors. Here is a simple example that shows how to customize the logger:

`json-server` uses [`morgan`](https://github.com/expressjs/morgan) for logs, and the default format that it uses is the [`dev`](https://github.com/expressjs/morgan#dev) log format, which doesn't expose all the info that we want, we need to use the [standard Apache combined log outpout format](https://github.com/expressjs/morgan#combined) instead:

```js
// server.js
import express from 'express';
import api from './api';

const port = 9001;
const app = express();
const API_ROOT = `http://localhost:${port}/api`;

app.use('/api', api);

app.listen(port, error => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up %s in your browser.', port, API_ROOT);
  }
});
```


```js
// api.js
import { create, defaults, rewriter, router } from 'json-server';
import morgan from 'morgan';
import rewrites from './routes.json';

const server = create();
const apiEndpoints = router('db2.json');
// Deactivate the existing logger
const middlewares = defaults({ logger: false });

// Here we use our own logging format
server.use(morgan('combined', { colors: true }));

server.use(rewriter(rewrites));
server.use(middlewares);
server.use(apiEndpoints);

export default server;
```

Then we run our server:

```bash
$ nodemon --exec babel-node server.js
==> 🌎  Listening on port 9001. Open up http://localhost:9001/api/ in your browser.
```

Here we can see our custom logs in the console:

```bash
$ curl --user kamal:secret http://localhost:9001/api/groups/ducks/stats
::1 - kamal [11/Aug/2017:15:04:58 +0000] "GET /api/groups/ducks/stats HTTP/1.1" 200 187 "-" "curl/7.51.0"

# or with Chrome
::1 - - [10/Aug/2017:08:57:04 +0000] "GET /api/ HTTP/1.1" 200 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## Conclusion

`json-server` has drastically decreased the time of scaffolding an API. Amongst the possibilities that we've seen, there are lots of use cases you can explore in order to use json-server, like logging customization, testing, reconciliation between micro-services, serverless applications ...etc.

I hope this post did shed some light on how we can use json-server. I tried to bring some useful use cases we encounter every day. If you still want to learn more about using it or even its inner working, I recommend exploring its [github project](https://github.com/typicode/json-server).

Thanks for reading!
