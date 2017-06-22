---
layout: post
title: "Construire et structurer une API GraphQL en Go"
permalink: /fr/construire-structurer-api-graphql-go/
author: vcomposieux
date: '2017-06-07 12:00:00 +0100'
date_gmt: '2017-06-07 12:00:00 +0100'
categories:
    - Go
tags:
    - api
    - golang
    - graphql
---
GraphQL est disponible depuis maintenant presque 2 ans et les applications qui l'utilisent se font toujours assez rare.
Pourtant, cette implémentation proposée par Facebook offre de nombreuses possibilités que ne permet pas une API REST.

# Introduction

L'objectif de cet article n'est pas de vous expliquer ce qu'est GraphQL, la documentation située à l'adresse http://graphql.org/learn l'explique déjà très bien !

Je me suis donc intéressé à construire une API GraphQL, et tant qu'à avoir une API performante, j'ai choisi le langage Go pour la développer, à l'aide de la librairie `graphql-go` (https://github.com/graphql-go/graphql).

# Structure de fichiers de notre API

La première chose (et pas des moindres) à prendre en compte lorsque l'on souhaite développer une application est la structure de celle-ci.

En effet, notre API va être amenée à évoluer, nous allons avoir de plus en plus d'éléments à fournir à nos applications et peut-être allons-nous souhaiter ajouter des composants (pour sécuriser notre API, pour logger des informations, pour limiter le nombre de requêtes, etc ...).

Ainsi, voici l'arborescence que je vous propose pour notre API :

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

Nous retrouvons ici :
* "app/" qui comprendra tout ce qui sera nécessaire à notre application (API), principalement un fichier de configuration (JSON) `config.json` ainsi que le fichier Go permettant de charger ce JSON,
* "security/" permettra de regrouper les classes liées à la sécurisation de notre API,
* "mutations/" permettra de regrouper toutes les mutations GraphQL (modifications de données),
* "queries/" permettra de regrouper toutes les requêtes GraphQL de sélection de données,
* "types/" permettra de regrouper les structures Go utilisées lors de nos mutations ou requêtes.

Enfin, nous retrouvons bien sûr à la racine `main.go` qui est le point d'entrée de notre API.
Nous allons d'ailleurs commencer dès maintenant à construire notre API !

# Point d'entrée de l'API

Pour construire notre API, nous allons avoir besoin dans un premier temps d'importer le package "net/http" (car notre API GraphQL va être distribuée en HTTP) ainsi que les librairies graphql-go :

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

Vous remarquerez ici qu'il nous manque la variable `httpHandler`, qui sera en fait le handler HTTP GraphQL qui sera exécuté pour chaque requête sur "/". Aussi, nous précisons ici que nous allons écouter sur le port 8383, libre à vous de mettre celui que vous souhaitez.

Notre `httpHandler` va avoir besoin d'un schéma dans lequel nous allons spécifier deux points d'entrée : un pour les requêtes et un second pour les mutations :

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

Dans le cas ou vous n'avez aucune modifications de données mais uniquement des requêtes de sélection, vous pouvez bien sûr supprimer la section concernant les mutations.

Ici, il nous manque `queries.GetRootFields()` ainsi que `mutations.GetRootFields()`. Ces méthodes vont nous permettre de définir toutes les `queries` et `mutations` que nous allons définir par la suite.

Plutôt que d'alourdir le fichier `main.go`, j'ai choisi de les déposer sous `queries/queries.go` et `mutations/mutations.go`.

# Structures de données

Avant de commencer à écrire notre première requête, nous devons définir notre modèles de données.

Dans cet article, nous allons partir sur des données utilisateur ("user") avec un identifiant, un prénom et un nom. Cela donne nous pour notre fichier `types/user.go` :

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

Nous avons ici définis deux choses :
* Une structure Go, qui sera utilisée par notre base de données et afin de renvoyer les données de notre API au format JSON,
* Un object `UserType` qui sera utilisé par notre API GraphQL afin d'indiquer les champs qui peuvent être retournés aux applications.

À l'aide de ce modèle de données, nous sommes maintenant prêts à construire notre première requête GraphQL !

# Requêtes

Commençons par éditer le fichier `queries/queries.go` afin d'ajouter une requête `user` qui sera chargée de retourner nos données utilisateur :

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

Nous avons donc ajoutés un nouveau champ à notre requête principale écrite précédemment (RootQuery) nommé `user` et qui fera appel à la fonction `GetUserQuery()`.

Nous allons maintenant définir cette fonction et son comportement dans un fichier dédié sous `queries/user.go` :

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

      // ... Implémenter la logique de base de données ici

			return users, nil
		},
	}
}
```

Notre première requête est prête : nous allons utiliser le type de données `UserType`, il ne vous reste plus qu'à implémenter la logique de retour de vos données !

Vous pouvez à cet endroit faire un appel à tout outil de stockage de vos données : bases de données relationnelles ou non, SQL ou non, fichier, mémoire, tout est envisageable.

# Ajouter des relations à votre API

Imaginons maintenant que vous ayez des roles (pour gérer des accès à certaines ressources) associés à vos utilisateurs.

Vous pouvez également demander à votre API de retourner ceux-ci.
Pour cela, nous allons commencer par implémenter une nouvelle structure `Role` ainsi qu'un nouveau type `RoleType` pour GraphQL.

Créez donc le fichier `types/role.go` avec le code suivant :

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

Voilà qui est fait. Il faut maintenant que nous spécifions à notre `UserType` qu'il est possible d'obtenir les roles de l'utilisateur.

Pour cela, éditez le fichier `types/user.go` et ajoutez une nouvelle section `graphql.Field` vers votre `RoleType` :

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

Notez ici que le `Type` spécifié est un `graphql.NewList(RoleType)` car nous allons retourner une liste de roles et non pas un seul role.

Pour effectuer votre requête, vous pouvez utiliser `params.Source` pour obtenir les informations de l'élément principal (ici, l'utilisateur) et ainsi obtenir vos données liées à cet utilisateur.

Enfin, ce qui est intéressant ici est que le requêtage de données (roles) sera effectué uniquement si le client effectuant la requête GraphQL demande à obtenir les roles.

# Effectuer des appels à votre API

À partir de là, vous pouvez donc intéroger votre API avec la requête suivante :

```bash
curl
  -X POST
  -H 'Content-Type: application/json'
  -d '{"query": "query { users { id,firstname,lastname,roles{name} } }"}'
  http://localhost:8383/

{"data":{"user":[{"id":1,"firstname":"Vincent","lastname":"COMPOSIEUX","roles":[]}, ...]}}
```

Bien entendu, uniquement les champs demandés dans la requête vous seront retournés, c'est le principe.

GraphQL offre bien sûr des possibilités intéressantes au niveau des requêtes avec notamment des aliases, variables et fragments qui ne sont pas l'objectif de cet article mais je vous invite à faire un tour dans la documentation, ça se comprend très simplement facilement :

* Aliases : http://graphql.org/learn/queries/#aliases
* Fragments : http://graphql.org/learn/queries/#fragments
* Variables : http://graphql.org/learn/queries/#variables

# Mutations

Côté mutations, le fonctionnement est identique aux requêtes. Nous allons donc créer notre première mutation et vous allez voir que ça ressemble beaucoup aux queries.

Créez le fichier "mutations/mutations.go" et spécifions notre `RootMutation` avec notre fonction `GetRootFields()` :

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

Ici, nous allons créer une mutation pour ajouter un nouvel utilisateur dans notre base de données.

Déclarons donc maintenant la fonction `GetCreateUserMutation()` dans le fichier `mutations/user.go` :

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

Votre mutation est prête à être utilisée !

Comme vous pouvez le remarquer, nous avons ici ajoutés une section `Args` qui nous permet de définir des arguments à notre fonction, par exemple : `createUser(firstname: "John", lastname: "Snow")`.

Il est ensuite possible de tester votre API en effectuant la requête HTTP suivante :

```bash
curl
    -X POST
    -H 'Content-Type: application/json'
    -d '{"query": "mutation { createUser(firstname: \"John\", lastname: \"Snow\") { id,firstname,lastname } }"}'
    http://localhost:8383
```

Vous pouvez bien sûr choisir d'obtenir en retour uniquement l'identifiant de l'utilisateur nouvellement créé.

# Securité

La plupart de vos APIs ne sont certainement pas publiques, il vous faut donc y ajouter un composant de sécurité, et c'est ce que nous allons faire ici en intégrant une authentification JWT (https://jwt.io/).

Nous allons utiliser la librairie `dgrijalva/jwt-go` (https://github.com/dgrijalva/jwt-go) afin de simplifier l'intégration de JWT dans notre application.

Ajoutez simplement dans votre fichier `security/security.go` le contenu suivant :

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

Ici, nous récupérons le token reçu dans le header `Authorization: Bearer xxx` et allons l'utiliser pour le comparer avec notre secret.

Dans le cas ou le token est valide, l'application continuera à exécuter le handler HTTP, sinon, une erreur sera levée.

Pour utiliser ce composant de sécurité, il faut repasser sur notre fichier `main.go` afin d'importer le répertoire `security` et de modifier :

```go
http.Handle("/", httpHandler)
```

en :

```go
http.Handle("/", security.Handle(httpHandler))
```

Vous disposez maintenant d'une API GraphQL performante et sécurisée !

# Conclusion

L'implémentation de GraphQL en Go est plutôt simple à prendre en main et les performances du langage permettent de construire une API performante.

Il nous est également possible de bien structurer celle-ci afin de séparer notamment les queries, les mutations et les autres composants.

Si vous voulez tester cette structure, les sources sont disponibles ici : https://github.com/eko/graphql-go-structure
