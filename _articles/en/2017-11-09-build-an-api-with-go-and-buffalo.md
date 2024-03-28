---
contentType: article
lang: en
date: '2017-11-09'
slug: build-an-api-with-go-and-buffalo
title: Build an api with Go and Buffalo
excerpt: Presentation of http/net package and Buffalo.
oldCover: /assets/2017-07-26-construire-une-api-en-go/cover.jpg
categories: []
authors:
  - qneyrat
keywords:
  - go
  - api
  - golang
  - rest
---

The Go language has quickly become very popular, but there are still some people reluctant to use it for the development of their new apps. We will see here how to build a REST API quickly and easily.

The greatest feature of the Go language is its simplicity of writing. The syntax is inspired by the C language with a procedural code. It does not integrate a concept of classes but provides the mechanisms needed to write code in an object-oriented style. The code is brief and clear, KISS-oriented (Keep It Simple, Stupid). We will see how to use this language to build a web application with the **Buffalo** framework.


## Package "http/net"

Package documentation: [https://golang.org/pkg/net/http/](https://golang.org/pkg/net/http/).

First of all, we are going to create an http server that will listen on the `8001` entry.

```go
package main

import "net/http"

func main() {
	//TO DO Implement handler
	http.ListenAndServe(":8001", nil)
}
```

To start the server, just run the file `main.go` with the following command:

```
go run main.go
```

If you try to make an http request on `127.0.0.1:8001`, the server will return you a `404` since the path is not specified. To solve this problem, it's necessary to implement a handler on `/`.

```go
// Handle registers the handler for the given pattern
// in the DefaultServeMux.
// The documentation for ServeMux explains how patterns are matched.
func Handle(pattern string, handler Handler) { DefaultServeMux.Handle(pattern, handler) }
```

For this, `http.Handle` needs a pattern that will match the query's path and a handler.

```go
type Handler interface {
	ServeHTTP(ResponseWriter, *Request)
}
```

A handler needs an object of type `ResponseWriter` and query. We will create a `handler` method. Here, for a REST API, the response must be in JSON format. We will therefore add to the header the content-type JSON and return JSON content. The `ResponseWriter` and `Write` method take a byte array as a parameter. So we cast our string containing JSON to the bytes format with the `byte[](string)` method.

```go
func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Write([]byte(`{"message": "Hello world !"}`))
}
```

The final code of our server gives:

```go
package main

import "net/http"

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Write([]byte(`{"message": "hello world"}`))
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8001", nil)
}

```

This time, if we launch the server and make an http request on `127.0.0.1:8001`, the server responds a code 200 with our message in JSON.

This package is very low level and quite annoying to use. The community has therefore made available various overlays, especially at the level of routing to make development easier.


## Buffalo framework

> Buffalo documentation on [http://gobuffalo.io](http://gobuffalo.io).

Buffalo is a library that makes web development with Go easier. It mainly uses the Gorilla libraries [https://github.com/gorilla](https://github.com/gorilla).

To install buffalo run the command:

`go get -u -v github.com/gobuffalo/buffalo/buffalo`

After buffalo is installed:

```
> $ buffalo help new
Buffalo version v0.10.1

Creates a new Buffalo application

Usage:
  buffalo new [name] [flags]

Flags:
      --api                  skip all front-end code and configure for an API server
      --ci-provider string   specify the type of ci file you would like buffalo to generate [none, travis, gitlab-ci] (default "none")
      --db-type string       specify the type of database you want to use [postgres, mysql, sqlite3] (default "postgres")
      --docker string        specify the type of Docker file to generate [none, multi, standard] (default "multi")
  -f, --force                delete and remake if the app already exists
  -h, --help                 help for new
      --skip-pop             skips adding pop/soda to your app
      --skip-webpack         skips adding Webpack to your app
      --skip-yarn            skip to use npm as the asset package manalready exists
      --vcs string           specify the Version control system you would like to use [none, git, bzr] (default "git")
  -v, --verbose              verbosely print out the go get commands
      --with-dep             adds github.com/golang/dep to your app
```

The command `new` generates a new project. We will therefore create an api project without the database that is managed by `pop`. We will therefore launch this command to generate the basis of our API REST. Go to your working directory (`$GOPATH/src/your_user_name for example`) and run the following command:

```
buffalo new api --api --skip-pop
```

This command created the `api` folder. This includes:

* The file `main.go`, this is the entry of the application;
* The file `actions/`, it is the file containing our handlers;
* The folder `grifts/`, this is the folder containing the commands

The rest of the files do not interest us.

Launch the server:

```
buffalo dev
```

Open `main.go` file:

```go
package main

import (
	"log"

	"qneyrat/api/actions"

	"github.com/gobuffalo/envy"
)

func main() {
	app := actions.App()
	log.Fatal(app.Serve())
}

```

Our interest will be in the `app.Serve()` method.

```go
// ...
server := http.Server{
		Addr:    fmt.Sprintf(":%s", addr),
		Handler: a,
	}

// ...
err := server.ListenAndServe()
```

As in the first part, Buffalo starts the http server of the `http/net` package.

Start a query on `127.0.0.1:3000`, this one returns us a reply JSON. Let's now see in `actions.App()` what happens.

```go
func App() *buffalo.App {
	if app == nil {
		//...

		app.GET("/", HomeHandler)

	}

	return app
}
```

The `App()` function will attach to the instance of `*buffalo.App` the handlers of our API. Here, a handler is attached to the `/` route. The Handler `HomeHandler` is `Handler` type.

```go
type Handler func(Context) error
```

Handler takes a `Context` parameter.

```go
// Context holds on to information as you
// pass it down through middleware, Handlers,
// templates, etc... It strives to make your
// life a happier one.
type Context interface {
	context.Context
	Response() http.ResponseWriter
	Request() *http.Request
	Session() *Session
	Params() ParamValues
	Param(string) string
	Set(string, interface{})
	LogField(string, interface{})
	LogFields(map[string]interface{})
	Logger() Logger
	Bind(interface{}) error
	Render(int, render.Renderer) error
	Error(int, error) error
	Websocket() (*websocket.Conn, error)
	Redirect(int, string, ...interface{}) error
	Data() map[string]interface{}
	Flash() *Flash
}
```

The `Context` interface will contain the `http.ResponseWriter` and `*http.Request` as in the example of the first part. One can notice that `Context` has many other interfaces that will make the development of our handler easier.

For instance, to return our JSON message, we use `Render`.

```go
return c.Render(200, r.JSON(map[string]string{"message": "Welcome to Buffalo!"}))
```

You can now build the application and run the server. Buffalo offers a dev mode that will automatically recompile your application when you make a change in the code. To do this, run the command:

```
buffalo dev
```

Now, if you try to make a query on `127.0.0.1:3000`, you will get your message `Welcome to Buffalo!` in JSON.

To make the development easier Buffalo integrates the package `grifts` which allows the creation of task scripts. These scripts are declared in the `grifts` folder.

```
buffalo task list
```

By default, there is the `routes` command that allows you to see all routes and handlers.

```
buffalo task routes
```

Now that buffalo has been presented, we will create new routes. You can find all the code on my github [https://github.com/qneyrat/api](https://github.com/qneyrat/api).

We will manage a new resource for our api, the `user` resource. Create the `models` folder and in it the `user.go` file. We will state a `User` structure composed of an `ID`.

```go
package models

import (
	"github.com/satori/go.uuid"
)

type User struct {
	ID uuid.UUID `json:"id"`
}

```

Create a new action in the `actions` folder to manage the user resource. Create a `users.go` file. To abstract from a database, we will create a map to store our users.

```go
var db = make(map[uuid.UUID]models.User)
```

So we will create a function to return to a JSON the set of users stored in "database" `db`. To group all the handlers that will manage our user resource, we will create an empty structure to attach our functions.

```go
type UserResource struct{}

func (ur UserResource) List(c buffalo.Context) error {
	return c.Render(200, r.JSON(db))
}
```

We will now attach this new handler to a route in the `app.go` file. Before that we will prefix our routes by `/api/v1`.

```go
// /api/v1 prefix for new routes
g := app.Group("/api/v1")

// new UserResource
ur := &UserResource{}

// new route and handler UserResource.List
// the path is /api/v1/users
g.GET("/users", ur.List)
```

If you do a `get` on `/api/v1/users`, the api returns you an empty collection since there is no user yet. We will create a new handler that will create one.

```go
// Create User.
func (ur UserResource) Create(c buffalo.Context) error {
	// new User
	user := &models.User{
		// on génère un nouvel id
		ID: uuid.NewV4(),
	}
	// add in database
	db[user.ID] = *user

	return c.Render(201, r.JSON(user))
}

```

We add the route in `app.go`.

```go
g.POST("/users", ur.Create)
```

Now, if you do a `post` on `/api/v1/users`, the api will return a `201` and inform you that the user was created. We will check in our list of users. So we do a `get` on `/api/v1/users` and we see that we have our user in the collection. Finally, we will do a handler to display a specific user. We will create it on the route `/users/{id}`.

```go
func (ur UserResource) Show(c buffalo.Context) error {
	// get id and format to uuid
	id, err := uuid.FromString(c.Param("id"))
	if err != nil {
		// if id isnt uuid
		return c.Render(500, r.String("id is not uuid v4"))
	}

	// get user in database
	user, ok := db[id]
	if ok {
		// if exist return user
		return c.Render(200, r.JSON(user))
	}

	// if not exist return not found
	return c.Render(404, r.String("user not found"))
}
```

We attach this new handler to our `app`.

```go
g.GET("/users/{id}", ur.Show)
```

Now we create a user with a `post` on `/api/v1/users` and then we make a `get` on `/api/v1/users/{id}` replacing `{id}` with the `uuid` of the user you just created. The api returns you a code 200 with the user's information.

From now on you have a powerful api database with tools to quickly and easily develop an api in Go. You can find all the documentation and other buffalo features on [http://gobuffalo.io](http://gobuffalo.io).
