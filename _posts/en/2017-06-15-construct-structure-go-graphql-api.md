---
layout: post
title: "Construct and structure a Go GraphQL API"
lang: en
permalink: /construct-structure-go-graphql-api/
authors:
    - vcomposieux
date: '2017-06-15 12:00:00 +0100'
date_gmt: '2017-06-15 12:00:00 +0100'
categories:
    - Go
tags:
    - api
    - golang
    - graphql
---
GraphQL was released 2 years ago and applications that use it are still rare.
However, this implementation proposed by Facebook offers many possibilities that are not available in REST APIs.

# Introduction

The goal of this blog post is not to explain from the basics what is GraphQL because official documentation of the implementation located at http://graphql.org/learn explain it really well!

I was interested of constructing a GraphQL API and I also wanted to have a performant API so I choose the Go language to develop it using the `graphql-go` library available here: https://github.com/graphql-go/graphql.

# File structure of our API

The first thing to do (and not least!) is to create a great understandable and re-usable file structure.

Indeed, our API will have to evolve in the future, for sure, so we will have to add more and more files into it such as maybe a security component, a rate limiter component, something to log requests, and so many more.

Here is the file structure I propose to create in this blog post that seems to me to be a great start:

```bash
.
├── app
│   ├── config.go
│   ├── config.json
│   └── config_test.go
├── security
│   ├── security.go
│   └── security_test.go
├── mutations
│   ├── mutations.go
│   ├── mutations_test.go
│   ├── user.go
│   └── user_test.go
├── queries
│   ├── queries.go
│   ├── queries_test.go
│   ├── user.go
│   └── user_test.go
├── types
│   ├── role.go
│   ├── role_test.go
│   ├── user.go
│   └── user_test.go
└── main.go
```

Here is what we have here:
* "app/" will contains all Go classes and configuration files that will be needed to get our application (API) to work so we will have mainly a configuration file (JSON) `config.json` and also a `config.go` file that will load this JSON,
* "security/" will group Go classes that will be used for our security component,
* "mutations/" will group all of our GraphQL mutations (data changes),
* "queries/" will group all of our GraphQL queries (selecting data),
* "types/" will group all of our Go structures and types used by GraphQL by both queries and mutations.

Finally, we will find at the root directory the `main.go` file which will be the entry point of our API.

So now that everything is clear, let's start writing our API!

# API entry point

To construct our API, we will need in a first time the Go `net/http` package (because our GraphQL API will be accessible over HTTP) and also the `graphql-go` library:

```go
package main

import (
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

func main() {
	// Todo: Implement GraphQL handler

	http.Handle("/", httpHandler)
	log.Print("ready: listening...\n")

	http.ListenAndServe(":8383", nil)
}
```

You can note here that the `httpHandler` variable that will be the HTTP handler used by GraphQL and will be executed for each request that will be made over the "/" URL. Also, we have to give a port number here (8383) on which our API will listen to.

Let's implement the `httpHandler` which will need a schema in which we will specify two entry points: a first for the queries and a second for the mutations:

```go
schemaConfig := graphql.SchemaConfig{
  Query: graphql.NewObject(graphql.ObjectConfig{
    Name:   "RootQuery",
    Fields: queries.GetRootFields(),
  }),
  Mutation: graphql.NewObject(graphql.ObjectConfig{
    Name:   "RootMutation",
    Fields: mutations.GetRootFields(),
  }),
}

schema, err := graphql.NewSchema(schemaConfig)

if err != nil {
  log.Fatalf("Failed to create new schema, error: %v", err)
}

httpHandler := handler.New(&handler.Config{
  Schema: &schema
})
```

In the case you have no data modifications but only queries, you can of course remove the mutations section from the code.

Here, we are missing the `queries.GetRootFields()` and also the `mutations.GetRootFields()` methods. These methods will allow us to define our `queries` and `mutations` that will be used in our API.

Rather than weighing down our `main.go` file with these things, I chose to put them into two separate files: `queries/queries.go` and `mutations/mutations.go`.

# Data structures

Before to go writting our first query, we will need to define our data model.

In this blog post, we will return user data with an identifier, a firstname and a lastname. So we will have to write our first file under `types/user.go`:

```go
package types

import (
	"github.com/graphql-go/graphql"
)

// User type definition.
type User struct {
	ID        int    `db:"id" json:"id"`
	Firstname string `db:"firstname" json:"firstname"`
	Lastname  string `db:"lastname" json:"lastname"`
}

// UserType is the GraphQL schema for the user type.
var UserType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id":         &graphql.Field{Type: graphql.Int},
		"firstname":  &graphql.Field{Type: graphql.String},
		"lastname":   &graphql.Field{Type: graphql.String},
	},
})
```

We declare two things here:
* A Go struct that will be used for mapping data from our database and to return data to the client in a JSON format,
* A `UserType` GraphQL Field that will be used by our GraphQL API to specify fields that can be returned by our API.

By using the data model, we are now (finally) able to write our first query!

# Queries

Let's edit the `queries/queries.go` file in order to add a `user` named query that will be charged to return our user data:

```go
package queries

import (
	"github.com/graphql-go/graphql"
)

// GetRootFields returns all the available queries.
func GetRootFields() graphql.Fields {
	return graphql.Fields{
		"user": GetUserQuery(),
	}
}
```

We've added a new field in our root query previously written named `user` and that will call the `GetUserQuery()` function to return its fields. This function will be defined into another file.

We will now define this function and its behavior into another dedicated file called `queries/user.go`:

```go
package queries

import (
	"../types"

	"github.com/graphql-go/graphql"
)

// GetUserQuery returns the queries available against user type.
func GetUserQuery() *graphql.Field {
	return &graphql.Field{
		Type: graphql.NewList(types.UserType),
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var users []types.User

      // ... Implement the way you want to obtain your data here.

			return users, nil
		},
	}
}
```

Our first query is ready: we will use the data model `UserType` for it so you just have to implement the logic to retrieve your data here.

At this place, you can make a call on every storage engine you want to obtain your data: relational databases or not, SQL or not, file storage, memory storage, everything is possible.

# Add relations to your API

Let's now imagine that you have some roles defined for your users (in order to manage access to some resources).

You can also ask to your GraphQL API to return them.

To do that, we will implement a new `Role` struct and also a `RoleType` used by GraphQL.

Create the `types/role.go` containing following code:

```go
package types

import (
	"github.com/graphql-go/graphql"
)

// Role type definition.
type Role struct {
	ID   int    `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

// RoleType is the GraphQL schema for the user type.
var RoleType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Role",
	Fields: graphql.Fields{
		"id":   &graphql.Field{Type: graphql.Int},
		"name": &graphql.Field{Type: graphql.String},
	},
})
```

We now have to specify to our `UserType` and we can also obtain some roles linked to the user.

To do that, edit the `types/user.go` file and add a new `graphql.Field` section to `RoleType`:

```go
var UserType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		// ... already defined fields
		"roles": &graphql.Field{
			Type: graphql.NewList(RoleType),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				var roles []Role

				// userID := params.Source.(User).ID
				// Implement logic to retrieve user associated roles from user id here.

				return roles, nil
			},
		},
	},
})
```

Please note that the `Type` specified for this field is a `graphql.NewList(RoleType)` because we will return a roles list and not a single role entry.

To request against user roles using the current user data, you can use the available `params.Source`.

Finally, what is interesting here is that roles queries will be only done if the roles data are requested by the GraphQL API client.

# Make calls to your API

Starting from there, you are able to call your API with a query like that:

```bash
curl
  -X POST
  -H 'Content-Type: application/json'
  -d '{"query": "query { users { id,firstname,lastname,roles{name} } }"}'
  http://localhost:8383/

{"data":{"user":[{"id":1,"firstname":"Vincent","lastname":"COMPOSIEUX","roles":[]}, ...]}}
```

Of course, as said previously, only query specified fields will be returned, that's the GraphQL main principle.

GraphQL also offers a lot of great things to help you writing neat queries with among others aliases, variables and fragments.

You can read documentation of these parts here:

* Aliases : http://graphql.org/learn/queries/#aliases
* Fragments : http://graphql.org/learn/queries/#fragments
* Variables : http://graphql.org/learn/queries/#variables

# Mutations

About mutations, le fonctionnement est identique aux requêtes. Nous allons donc créer notre première mutation et vous allez voir que ça ressemble beaucoup aux queries.

Create file `mutations/mutations.go` and specify the `RootMutation` returned by `GetRootFields()`:

```go
package mutations

import (
	"github.com/graphql-go/graphql"
)

// GetRootFields returns all the available mutations.
func GetRootFields() graphql.Fields {
	return graphql.Fields{
		"createUser": GetCreateUserMutation(),
	}
}
```

Then, we will create a mutation to create a new user in our database.

Let's declare the `GetCreateUserMutation()` function in file `mutations/user.go`:

```go
package mutations

import (
	"../types"

	"github.com/graphql-go/graphql"
)

// GetCreateUserMutation creates a new user and returns it.
func GetCreateUserMutation() *graphql.Field {
	return &graphql.Field{
		Type: types.UserType,
		Args: graphql.FieldConfigArgument{
			"firstname": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"lastname": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			user := &types.User{
				Firstname: params.Args["firstname"].(string),
				Lastname:  params.Args["lastname"].(string),
			}

      // Add your user in database here

			return user, nil
		},
	}
}
```

Your mutation is now ready to be used!

As you can notice, we've added an `Args` section here that allows us to define some arguments to our function, such as: `createUser(firstname: "John", lastname: "Snow")`.

This is of course possible to test our API by calling it now using the following way:

```bash
curl
    -X POST
    -H 'Content-Type: application/json'
    -d '{"query": "mutation { createUser(firstname: \"John\", lastname: \"Snow\") { id,firstname,lastname } }"}'
    http://localhost:8383
```

You can of course choose only the identified of the newly created user if needed.

# Security

Most of your APIs are certainly not public so you also need a component to handle security and that's whay we will do by using a JWT authentication (https://jwt.io/).

We will use the `dgrijalva/jwt-go` library (https://github.com/dgrijalva/jwt-go) in order to simplify the use of JWT in our Go application.

Simply add in your `security/security.go` file the following content:

```go
package security

import (
	"fmt"
	"log"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
)

// Handle security middleware aims to implement a JWT authentication.
func Handle(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")[7:] // 7 corresponds to "Bearer "

		token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

      var secret = "my-high-security-secret" // Prefer to store this secret in a configuration file

			return []byte(secret), nil
		})

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			log.Printf("JWT Authenticated OK (app: %s)", claims["app"])

			next.ServeHTTP(w, r)
		}
	})
}
```

We retrieve the token sent in the `Authorization: Bearer xxx` header by the client and will compare it with a secret we've stored in our configuration file.

In the case the token is valid, the application will continue to execute the HTTP handler, elsewhere, an error will be thrown.

In order to use this security component, we will have to update our `main.go` file to import the `security` folder and also modify:

```go
http.Handle("/", httpHandler)
```

with:

```go
http.Handle("/", security.Handle(httpHandler))
```

You now have a functional and secured GraphQL API!

# Conclusion

The GraphQL implementation using Go is quite simple to do thank to the available library and language performances allows to construct powerful APIs.

It is also possible to well structure your API in order to separate, especially for queries, mutations and other components.

If you want to give it a try, sources of this blog post are available here: https://github.com/eko/graphql-go-structure
