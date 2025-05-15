---
contentType: article
lang: fr
date: 2025-05-16
slug: golang-httpware-solution-elegante
title: >-
  Gol4ng - Httpware : Middleware et Tripperware GO, une Solution Élégante.
excerpt: >-
  Httpware offre une approche simple et modulaire pour gérer les middlewares en Go, avec l'avantage notable de supporter également les tripperwares pour manipuler les requêtes HTTP côté client.
cover:
  alt: Gol4ng httpware
  path: /imgs/articles/2025-05-16-golang-httpware-middleware-tripperware-une-solution-elegante/cover.jpg
  position: center
authors:
  - amoutte
seo:
    title: "Gol4ng - Httpware : Middleware et Tripperware GO, une Solution Élégante."
    description: "Httpware offre une approche simple et modulaire pour gérer les middlewares en Go, avec l'avantage notable de supporter également les tripperwares pour manipuler les requêtes HTTP côté client."
---

## Introduction

Dans le monde du développement web en Go, la gestion efficace des requêtes HTTP est **cruciale**.
Les **middlewares**/**tripperware** jouent un rôle central dans cette gestion en permettant d'_intercepter_, de _modifier_ et d'_enrichir_ les requêtes et les réponses HTTP.
C'est dans ce contexte que la librairie [`httpware`](https://github.com/gol4ng/httpware) s'impose comme une solution **élégante** et **puissante**.

Si vous êtes familier avec des librairies populaires comme [`justinas/alice`](https://github.com/justinas/alice) ou [`gorilla/handlers`](https://github.com/gorilla/handlers), vous retrouverez des fonctionnalités similaires dans httpware.

<div class="admonition info" markdown="1"><p class="admonition-title">Tripperware</p>
Cependant, ce qui distingue véritablement cette librairie, c'est son support natif des `tripperware` - des middlewares côté client.
Cette fonctionnalité unique permet d'appliquer les mêmes principes de middleware tant au niveau du **serveur** que du **client** HTTP, offrant ainsi une solution complète et cohérente pour la gestion des requêtes HTTP dans votre application.
</div>

Développée pour simplifier l'implémentation des **middlewares**/**tripperware** en Go, cette librairie offre un ensemble d'outils prêts à l'emploi tout en restant flexible et légère.
Elle répond particulièrement aux besoins de _traçabilité_, de _sécurisation_ et de manipulation des requêtes HTTP dans les applications modernes.

## Fondamentaux et Architecture

### Le Concept de Middleware en Go

En Go, un middleware est essentiellement une fonction qui encapsule un handler HTTP.

![Gol4ng visuel d'un middleware]({BASE_URL}/imgs/articles/2025-05-16-golang-httpware-middleware-tripperware-une-solution-elegante/middleware.jpg)

La signature type est la suivante :

``` go
type Middleware func(http.Handler) http.Handler
```

Cette approche permet d'empiler plusieurs middlewares de manière élégante. Httpware s'appuie sur ce principe fondamental tout en l'enrichissant.

### Le Concept de Tripperware en Go

L'appellation `tripperware` est dérivée de l'interface GO `http.RoundTripper` utiliser par le client HTTP de GO.

![Gol4ng visuel d'un tripperware]({BASE_URL}/imgs/articles/2025-05-16-golang-httpware-middleware-tripperware-une-solution-elegante/tripperware.jpg)

La signature type est la suivante :

``` go
type Tripperware func(http.RoundTripper) http.RoundTripper
```

De la même manière que pour les middlewares il est possible d'empiler plusieurs tripperwares de manière élégante.

### Architecture de Httpware

La librairie s'articule autour de deux concepts clés :

1. **Middlewares** : Pour le traitement côté serveur
2. **Tripperware** : Pour la manipulation des requêtes côté client

## Principales Fonctionnalités

| Name                        | Middleware | Tripperware |
|-----------------------------|:----------:|:-----------:|
| **Authentication**          |     X      |             |
| **AuthenticationForwarder** |            |      X      |
| **CorrelationId**           |     X      |      X      |
| **Metrics**                 |     X      |      X      |
| **Interceptor**             |     X      |      X      |
| **Skip**                    |     X      |      X      |
| **Enable**                  |     X      |      X      |
| **RateLimiter**             |     X      |      X      |
| **RequestListener**         |     X      |      X      |
| **CurlLogDumper**           |     X      |      X      |

## Exemples

Voici par exemple un server HTTP qui va logguer toutes les requêtes reçus (http://localhost:8080/*) au format curl :

``` go
package main

import (
	"github.com/gol4ng/httpware/v4"
	"github.com/gol4ng/httpware/v4/middleware"
	"github.com/gol4ng/httpware/v4/request_listener"
	"net/http"
)

func main() {
	http.ListenAndServe(
		":8080",
		middleware.RequestListener(request_listener.CurlLogDumper)(httpware.NopHandler),
	)
}
```

Cet autre exemple ajoute un CorrelationID sur la requête et possède un rate limiter HTTP

``` go
package main

import (
	"github.com/gol4ng/httpware/v4"
	"github.com/gol4ng/httpware/v4/middleware"
	"github.com/gol4ng/httpware/v4/rate_limit"
	"net/http"
	"time"
)

func main() {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})

	limiter := rate_limit.NewTokenBucket(1*time.Minute, 20)
	defer limiter.Stop()

	stack := httpware.MiddlewareStack(
		middleware.CorrelationId(),   // ID de corrélation
		middleware.RateLimit(limiter),// RateLimiting
	)

	http.ListenAndServe(":8080", stack.DecorateHandler(handler))
}
```

### Création d'un Middleware Personnalisé
Voici un exemple de middleware personnalisé qui mesure le temps de réponse :
``` go
func TimingMiddleware() httpware.Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			defer func() {
				duration := time.Since(start)
				log.Printf("Request processed in %v", duration)
			}()

			next.ServeHTTP(w, r)
		})
	}
}
```

## Bonnes Pratiques et Optimisations
### Patterns Recommandés
1. **Ordre des Middlewares** :
  - Placez les middlewares de sécurité en premier
  - Suivis des middlewares de logging et traçage
  - Terminez par les middlewares spécifiques à l'application

2. **Gestion du Contexte** :
``` go
func ContextAwareMiddleware() httpware.Middleware {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            ctx := r.Context()
            // Enrichir le contexte
            ctx = context.WithValue(ctx, "key", "value")
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}
```

### Pièges à Éviter
1. **Ne pas modifier le ResponseWriter original**
2. **Éviter les opérations bloquantes dans les middlewares**
3. **Gérer correctement les erreurs et les panics**

## Comparaison et Positionnement
Httpware se distingue d'autres solutions comme Gorilla Handlers par :
- Sa simplicité d'utilisation
- Son approche modulaire
- Sa gestion native des IDs de corrélation
- Sa compatibilité parfaite avec la bibliothèque standard

## Conclusion
Httpware est une solution robuste et élégante pour la gestion des middlewares en Go. Elle brille particulièrement dans :
- La traçabilité des requêtes
- La simplicité d'implémentation
- La flexibilité d'extension

### Ressources Complémentaires
- [Gol4ng httpware](https://github.com/gol4ng/httpware)
- [Documentation Officielle](https://github.com/gol4ng/httpware)
- [GoDoc](https://pkg.go.dev/github.com/gol4ng/httpware/v4)

Cette librairie continue d'évoluer et représente un excellent choix pour les développeurs Go cherchant une solution de middleware.
