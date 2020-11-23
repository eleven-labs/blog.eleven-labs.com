---
layout: post
title: 'Construire une api en Go'
excerpt: Présentation du package http/net et de la librairie Buffalo
authors:
    - qneyrat
lang: fr
permalink: /construire-une-api-en-go/
categories:
    - Go
tags:
    - api
    - golang
    - rest
cover: /assets/2017-07-26-construire-une-api-en-go/cover.jpg
---

Le langage Go est rapidement devenu très populaire mais beaucoup hésitent encore à l'utiliser pour le développement de leurs nouvelles applications. Nous allons ici voir comment construire une api REST rapidement et facilement.

----------


Introduction
-------------

La particularité du langage Go est sa simplicité d’écriture. La syntaxe est inspirée du langage C avec un code procédural. Il n’intègre pas de concept de classes mais fournit les mécanismes nécessaires à l’écriture de code dans un style orienté objet. Le code est concis et clair, principe KISS (Keep It Simple, Stupid). Nous allons donc voir comment utiliser ce language pour faire du web. Nous verrons dans un premier temps une implémentation du package "net/http" pour la création d'une api REST. Dans un second temps, je vous présenterai un utilitaire pour faciliter le développement d'une application web : **Buffalo**.

Package "http/net"
-------------

Documentation du package : https://golang.org/pkg/net/http/.

Pour commencer, nous allons créer un serveur http qui va écouter sur le port `8001`.

```go
package main

import "net/http"

func main() {
	//TO DO Implement handler
	http.ListenAndServe(":8001", nil)
}
```

Pour démarrer le serveur, il suffit d’exécuter le fichier `main.go` avec la commande :

```
go run main.go
```

Si vous essayez de faire une requête http sur `127.0.0.1:8001`, le serveur vous retournera une `404` puisque la route `/` n'est pas spécifiée. Pour remédier à ce problème il faut implémenter un handler sur `/`.

```go
// Handle registers the handler for the given pattern
// in the DefaultServeMux.
// The documentation for ServeMux explains how patterns are matched.
func Handle(pattern string, handler Handler) { DefaultServeMux.Handle(pattern, handler) }
```

Pour cela, http.Handle a besoin d'un modèle qui va correspondre à la route de la requête et à un handler.

```go
type Handler interface {
	ServeHTTP(ResponseWriter, *Request)
}
```

Un handler a besoin d’un objet de type `ResponseWriter` et de la requête. Nous allons créer une méthode `handler`. Ici, pour une api REST, la réponse doit être au format JSON. Nous allons donc ajouter au header le content-type JSON et retourner du contenu JSON. La méthode `Write` de `ResponseWriter` prend en paramètre un tableau de byte. Donc on ‘caste’ notre string contenant du JSON vers le format bytes avec la méthode `byte[](string)`.

```go
func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	w.Write([]byte(`{"message": "Hello world !"}`))
}
```

Le code final de notre serveur donne donc :

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

Cette fois-ci, si on lance le serveur et que l’on fait une requête http sur `127.0.0.1:8001`, le serveur répond bien un code 200 avec notre message en JSON.

Ce package est très bas niveau et assez pénible à utiliser. La communauté a donc mis à disposition différentes surcouches notamment au niveau du routing pour faciliter le développement.

Présentation de Buffalo
-------------

Buffalo est une librairie permettant de faciliter le développement avec Go. Elle utilise principalement les librairies de Gorilla `https://github.com/gorilla`.

Pour installer buffalo lancer la commande :

```
go get -u -v github.com/gobuffalo/buffalo/buffalo
```

Une fois buffalo installé,

```
> $ buffalo help new
Buffalo version v0.9.0

Creates a new Buffalo application

Usage:
  buffalo new [name] [flags]

Flags:
      --api                  skip all front-end code and configure for an API server
      --ci-provider string   specify the type of ci file you would like buffalo to generate [none, travis, gitlab-ci] (default \"none\")
      --db-type string       specify the type of database you want to use [postgres, mysql, sqlite3] (default \"postgres\")
      --docker string        specify the type of Docker file to generate [none, multi, standard] (default \"multi\")
  -f, --force                delete and remake if the app already exists
  -h, --help                 help for new
      --skip-dep             skips adding github.com/golang/dep to your app
      --skip-pop             skips adding pop/soda to your app
      --skip-webpack         skips adding Webpack to your app
  -v, --verbose              verbosely print out the go get/install commands
      --with-yarn            allows the use of yarn instead of npm as dependency manager

```

La commande `new` permet de générer un nouveau projet. On va donc créer un projet api sans la base de données qui est gérée par `pop`. Nous allons donc lancer cette commande pour générer la base de notre api REST. Placez-vous dans votre répertoire de travail (`$GOPATH/src/your_user_name` par exemple) et lancez la commande suivante :

```
buffalo new api --api --skip-pop
```

Cette commande a créé le dossier `api`. Celui-ci comprend :
* le fichier `main.go`, il s’agit de l’entrée de l'application ;
* le dossier `actions/` il s’agit du dossier contenant nos handlers ;
* le dossier `grifts/` il s’agit du dossier contenant les commandes

Le reste des fichiers ne nous intéresse pas.

Lancez le serveur :

```
buffalo dev
```

Ceci va compiler votre projet et démarrer le serveur.

```go
package main

import (
	"log"

	"qneyrat/api/actions"

	"github.com/gobuffalo/envy"
)

func main() {
	port := envy.Get("PORT", "3000")
	app := actions.App()
	log.Fatal(app.Start(port))
}

```

Nous allons regarder ce que fait la méthode `app.start()`.

```go
// ...
server := http.Server{
		Addr:    fmt.Sprintf(":%s", addr),
		Handler: a,
	}

// ...
err := server.ListenAndServe()
```

Comme dans la première partie, Buffalo démarre le serveur http du package "http/net".

Lancez une requête sur `127.0.0.1:3000`, celle-ci nous retourne bien une réponse JSON. Allons maintenant voir dans `actions.App()` ce qu’il se passe.

```go
func App() *buffalo.App {
	if app == nil {
		//...

		app.GET("/", HomeHandler)

	}

	return app
}
```

La function `App()` va attacher à l'instance de `*buffalo.App` les handlers de notre api. Ici, un handler est attaché à la route `/`. Le handler `HomeHandler` est du type `Handler`.

```go
type Handler func(Context) error
```

Handler prend en paramètre un `Context`.

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

L'interface `Context` va contenir le `http.ResponseWriter` et `*http.Request` comme dans l'exemple de la première partie. On peut remarquer que `Context` dispose de plein d'autres interfaces qui permettront de faciliter le développement de notre handler.

Par exemple, pour retourner notre message JSON, on utilise `Render`.

```go
return c.Render(200, r.JSON(map[string]string{"message": "Welcome to Buffalo!"}))
```

Vous pouvez maintenant construire l'application et lancer le serveur. Buffalo offre un mode `dev` qui va automatiquement recompiler votre application lorsque vous faites une modification dans le code. Pour cela, lancez la commande :

```
buffalo dev
```

Maintenant, si vous essayez de faire une requête sur `127.0.0.1:3000`, vous aurez bien votre message `Welcome to Buffalo!` en JSON.

Pour faciliter le développement buffalo intègre le package `grifts` qui permet la création de commandes. Les commandes sont déclarées dans le dossier `grifts`.

```
buffalo task list
```

Par défaut, il existe la commande `routes` qui permet de voir l'ensemble des routes et les handlers. Pour lancer cette commande, on va d'abord construire l'application pour contruire les routes puis jouer la tâche `routes`.

```
buffalo build
buffalo task routes
```
Maintenant que buffalo a été présenté, nous allons créer de nouvelles routes. Vous pouvez retrouver l'ensemble du code sur mon github [https://github.com/qneyrat/api](https://github.com/qneyrat/api){:rel="nofollow noreferrer"}.

Nous allons gérer une nouvelle ressource pour notre api, la ressource `user`.

Créez le dossier `models` et dedans le fichier `user.go`. On va déclarer une structure `User` composé d'un `ID`.

```go
package models

import (
	"github.com/satori/go.uuid"
)

type User struct {
	ID uuid.UUID `json:"id"`
}

```

Créez une nouvelle action dans le dossier `actions` pour gérer la ressource `user`. Créez donc un fichier `users.go`.
Pour s'abstraire d'une base de données, on va créer une map pour stocker nos utilisateurs.

```go
var db = make(map[uuid.UUID]models.User)
```

On va donc créer une fonction pour retourner dans un JSON l'ensemble des utilisateurs stockés dans "base de données" `db`. Pour regrouper l'ensemble des handlers qui vont gérer notre ressource `user`, on va créer une structure vide pour y attacher nos fonctions.

```go
type UserResource struct{}

func (ur UserResource) List(c buffalo.Context) error {
	return c.Render(200, r.JSON(db))
}
```

On va maintenant attacher ce nouvel handler à une route dans le fichier `app.go`. Avant cela on va faire préfixer nos routes par `/api/v1`.

```go
// on préfixe nos nouvelles routes par /api/v1
g := app.Group("/api/v1")

// on déclare notre UserResource
ur := &UserResource{}

// on déclare notre route get qu'on rattache au handler UserResource.List
// le path est donc /api/v1/users
g.GET("/users", ur.List)
```

Si vous faites donc un `GET` sur `/api/v1/users`, l'api vous retourne une collection vide puisqu'il n'y a pas encore d’utilisateur.
On va donc créer un nouveau handler qui va en créer un.

```go
// Create User.
func (ur UserResource) Create(c buffalo.Context) error {
	// on crée un nouvel utilisateur
	user := &models.User{
		// on génère un nouvel id
		ID: uuid.NewV4(),
	}
	// on l'ajoute à notre base de données
	db[user.ID] = *user

	return c.Render(201, r.JSON(user))
}

```

On ajoute la route dans `app.go`.

```go
g.POST("/users", ur.Create)
```

Maintenant, si vous faites un `POST` sur `/api/v1/users`, l'api vous retournera une 201 et vous informera que l’utilisateur a bien été créé. On va donc vérifier dans notre liste d’utilisateurs. Donc on fait un `GET` sur `/api/v1/users` et on constate qu’on a bien notre utilisateur dans la collection.

Pour finir, nous allons maintenant faire un handler pour afficher un utilisateur spécifique. On va donc créer un handler sur la route `/users/{id}`.

```go
func (ur UserResource) Show(c buffalo.Context) error {
	// on récupère l'id de la requête qu'on formate en uuid
	id, err := uuid.FromString(c.Param("id"))
	if err != nil {
		// si l'id n'est pas un uuid on génère une erreur
		return c.Render(500, r.String("id is not uuid v4"))
	}

	// on récupère notre utilisateur dans notre base de données
	user, ok := db[id]
	if ok {
		// si il existe, on le retourne
		return c.Render(200, r.JSON(user))
	}

	// si il n'existe pas, on retourne une erreur 404
	return c.Render(404, r.String("user not found"))
}
```

On attache ce nouveau handler à notre `app`.

```go
g.GET("/users/{id}", ur.Show)
```
Maintenant, on crée un utilisateur avec un `POST` sur `/api/v1/users` puis on fait un `GET` sur `/api/v1/users/{id}` en remplaçant `{id}` par l'uuid de l’utilisateur que vous venez de créer. L'api vous retourne un code 200 avec les informations de l’utilisateur.

Vous avez maintenant une base d'api performante avec des outils pour développer rapidement et facilement une api en Go. Vous pouvez retrouver l'ensemble de la documentation et découvrir les autres fonctionnalités de buffalo sur [http://gobuffalo.io](http://gobuffalo.io){:rel="nofollow noreferrer"}.
