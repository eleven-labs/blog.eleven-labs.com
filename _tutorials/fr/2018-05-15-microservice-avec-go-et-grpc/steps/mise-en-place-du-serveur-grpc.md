---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: mise-en-place-du-serveur-grpc
title: Mise en place du serveur gRPC
---
Nous allons maintenant mettre en place le serveur gRPC.

Dans un premier temps, nous devons créer une struct qui respecte l'interface du serveur présent dans `proto/translator.pb.go`.
```go
type TranslatorServer interface {
    Translate(context.Context, *TranslateRequest) (*TranslateResponse, error)
}
```
Nous allons créer un dossier `server` et un fichier `grpc.go`.
```go
// grpc.go
package server

import (
    "context"
    "translator-service/proto"
)

type TranslatorServer struct {}

func (s TranslatorServer) Translate(ctx context.Context, req *proto.TranslateRequest) (*proto.TranslateResponse, error) {
    return nil, nil
}
```
Nous allons maintenant créer le fichier `main.go` à la racine du projet.
```go
// main.go
package main

import (
    "log"
    "net"
    "translator-service/proto"
    "translator-service/server"
    "google.golang.org/grpc"
)

func main() {
    lis, err := net.Listen("tcp", "localhost:4000")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    srv := server.TranslatorServer{}
    s := grpc.NewServer()
    proto.RegisterTranslatorServer(s, srv)
    s.Serve(lis)
}
```
>Lancez la commande `dep ensure` pour installer les packages qui vous manquent.

Pour ajouter des services (comme un client mysql ou une struct d'un autre de nos packages), nous avons deux choix. Soit d'ajouter les structs directement dans `TranslatorServer{}` .
```
type Server struct { s1: s1, s2: s2, s3: s3 }
func (s Server) m1 () { s1.foo }
func (s Server) m2 () { s2.foo; s3.foo }
```
Soit de créer une factory pour chaque endpoint et ajouter les endpoints à `TranslatorServer{}`.
```
func NewE1(s1 service) { return func(){ s1.foo }}
func NewE2(s2, s3 service) { return func(){ s2.foo; s3.foo }}

type Server struct { e1: e1, e2: e2 }
func NewServer(ee endpoints) { return &Server{ e1: e1, e2: e2 }}

func (s Server) m1 () { s.e1() }
func (s Server) m2 () { s.e2() }
```
La deuxième solution est un peu plus compliquée, mais permet de rendre plus unitaire chaque méthode gRPC et de ne pas faire grossir la struct `TranslatorServer{}` de services inutiles.

Nous allons maintenant mettre en place cette solution et créer un fichier `endpoint.go` dans le package `server`.

```go
// endpoint.go
package server

import (
    "context"
    "translator-service/proto"
)

type Endpoints struct {
    TranslateEndpoint TranslateEndpoint
}

type TranslateEndpoint func(ctx context.Context, req *proto.TranslateRequest) (*proto.TranslateResponse, error)

func NewTranslateEndpoint(t translate.Translator) TranslateEndpoint {
    return func(ctx context.Context, req *proto.TranslateRequest) (*proto.TranslateResponse, error) {
        return nil, nil
    }
}
```

Nous allons maintenant modifier le fichier `grpc.go`.
```go
// grpc.go
package server

import (
    "context"
    "translator-service/proto"
)

type TranslatorServer struct {
    translate TranslateEndpoint
}

func NewTranslatorServer(e Endpoints) *TranslatorServer {
    return &TranslatorServer{
        translate: e.TranslateEndpoint,
    }
}

func (s TranslatorServer) Translate(ctx context.Context, req *proto.TranslateRequest) (*proto.TranslateResponse, error) {
    return s.translate(ctx, req)
}
```