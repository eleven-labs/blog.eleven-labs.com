---
layout: post
lang: fr
date: '2017-09-28'
categories: []
authors:
  - qneyrat
excerpt: >-
  gRPC a été développé initialement par Google puis rendu open source. Il permet
  de réaliser des clients et serveurs rpc via HTTP/2 et donc de profiter de ses
  nouveautés.
title: Présentation de gRPC
slug: presentation-grpc
oldCategoriesAndTags:
  - bonnes pratiques
permalink: /fr/presentation-grpc/
---

Avant toute chose je vous invite à lire [la première partie](https://blog.eleven-labs.com/fr/presentation-protocol-buffers/){:rel="nofollow noreferrer"} si ce n'est pas déjà fait. L'article présente protobuf qui va être utilisé avec gRPC. Aujourd'hui nos projets sont quasiment tous en architecture microservices et communiquent via HTTP.

> Et si maintenant on utilisait HTTP/2 pour faire communiquer nos services ?

Parce qu'un client HTTP/1 c'est bien mais un client HTTP/2 c'est mieux.

> HTTP/2 c'est quoi ?

Je vous invite à lire [cet article de Vincent](https://blog.eleven-labs.com/fr/http2-nest-pas-le-futur-cest-le-present/){:rel="nofollow noreferrer"} pour y voir plus clair.

> gRPC c'est quoi ?

gRPC a été développé initialement par Google puis rendu open source. Il permet de réaliser des clients et serveurs rpc via HTTP/2 et donc de profiter de ses nouveautés. Les données sont sérialisées et désérialisées grâce à Protocol Buffers. Le framework gRPC permet aussi d'avoir un client et un serveur dans différents langages. En effet il est disponible pour la plupart des langages. Chaque service rpc est déclaré dans un fichier protobuf. La RFC est [disponible ici](https://tools.ietf.org/html/draft-kumar-rtgwg-grpc-protocol-00){:rel="nofollow noreferrer"} si ça vous intéresse.

gRPC permet quatre modes de communication.

Le one-to-one classique :

```
Client Request -> Server
Client <- Response Server

service CustomService {
    rpc Endpoint(Request) returns (Response) {}
}
```

La streaming côté client :

```
Streaming Request -> Server
Client <- Response Server

service CustomService {
    rpc Endpoint(stream Request) returns (Response) {}
}
```

Le streaming côté serveur :

```
Request -> Server
Client <- Streaming Response

service CustomService {
    rpc Endpoint(Request) returns (stream Response) {}
}
```

Le streaming bidirectionnel :

```
Streaming Request -> Server
Client -> Streaming Response

service CustomService {
    rpc Endpoint(stream Request) returns (stream Response) {}
}
```

Nous allons voir pour cet article uniquement le troisième mode `streaming côté serveur` mais les quatre sont très semblables.

Vous pouvez retrouver l'ensemble du code de [l'exemple sur mon github](https://github.com/qneyrat/go-grpc-example){:rel="nofollow noreferrer"}.

## Installation

Assurez-vous avant de commencer l'installation d'avoir bien installé Go en version supérieure à 1.5 et Protocol Buffers en version 3.

Récupérez gRPC pour Go :

```bash
go get google.golang.org/grpc
```

## Protobuf

Nous allons commencer par récupérer le fichier proto du [précédent article](https://blog.eleven-labs.com/fr/presentation-protocol-buffers/){:rel="nofollow noreferrer"}.

Nous allons ajouter un service pour récupérer en streaming la liste des Posts.

Un service rpc est composé de la structure suivante :

```
rpc function(request) returns (response)
```

Ici on a une request vide et un streaming de Post.

```proto
service PostService {
    rpc ListPosts(google.protobuf.Empty) returns (stream Post) {}
}
```

Ce qui nous donne :

```proto
syntax = "proto3";

import "google/protobuf/empty.proto";

package main;

message Post {
    int32 id = 1;
    string title = 2;
    string author = 3;
}

service PostService {
    rpc ListPosts(google.protobuf.Empty) returns (stream Post) {}
}

```

## Serveur

On va commencer par générer le code source depuis le fichier protobuf.

```bash
protoc --proto_path=. --go_out=plugins=grpc:. post.proto
```

On commence par déclarer une pseudo base de données :

```go
var posts = []Post{
	{
		Id:     1,
		Title:  "My awesome article 1",
		Author: "Quentin Neyrat",
	},
	{
		Id:     2,
		Title:  "My awesome article 2",
		Author: "Quentin Neyrat",
	},
	{
		Id:     3,
		Title:  "My awesome article 3",
		Author: "Quentin Neyrat",
	},
}
```

Puis on crée un serveur TCP sur le port 4000 pour notre serveur gRPC et on attache notre service déclaré dans le protobuf :

```go
	lis, _ := net.Listen("tcp", "localhost:4000")
	g := grpc.NewServer()
	RegisterPostServiceServer(g, NewServer())
	g.Serve(lis)
}
```

On a plus qu'à créer notre endpoint qui va parcourir notre pseudo base de données et envoyer les posts un par un :

```go
func (s *Server) ListPosts(empty *google_protobuf.Empty, stream PostService_ListPostsServer) error {
	for _, post := range posts {
		fmt.Printf("Send post #%d \n", post.GetId())
		if err := stream.Send(&post); err != nil {
			return err
		}
	}

	return nil
}
```

Le code final :

```go
package main

import (
	"fmt"
	"log"
	"net"

	google_protobuf "github.com/golang/protobuf/ptypes/empty"
	grpc "google.golang.org/grpc"
)

type Server struct{}

func NewServer() *Server {
	return &Server{}
}

var posts = []Post{
	{
		Id:     1,
		Title:  "My awesome article 1",
		Author: "Quentin Neyrat",
	},
	{
		Id:     2,
		Title:  "My awesome article 2",
		Author: "Quentin Neyrat",
	},
	{
		Id:     3,
		Title:  "My awesome article 3",
		Author: "Quentin Neyrat",
	},
}

func (s *Server) ListPosts(empty *google_protobuf.Empty, stream PostService_ListPostsServer) error {
	for _, post := range posts {
		fmt.Printf("Send post #%d \n", post.GetId())
		if err := stream.Send(&post); err != nil {
			return err
		}
	}

	return nil
}

func main() {
	lis, err := net.Listen("tcp", "localhost:4000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	g := grpc.NewServer()
	RegisterPostServiceServer(g, NewServer())
	g.Serve(lis)
}
```

> **Astuce :**
> Vous pouvez exécuter `go run *` pour compiler entièrement le projet.

### Client

Dans un nouveau projet, on déclare un client gRPC pour notre service.

```go
conn, _ := grpc.Dial("localhost:4000", grpc.WithInsecure())
client := NewPostServiceClient(conn)
```

Puis une méthode pour récupérer les Posts :

```go
func printPosts(client PostServiceClient) {
	stream, err := client.ListPosts(context.Background(), &google_protobuf.Empty{})
	if err != nil {
		log.Fatalf("%v.ListPosts(_) = _, %v", client, err)
	}
	for {
		post, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("%v.ListPosts(_) = _, %v", client, err)
		}

		fmt.Printf("Id: %d \n", post.GetId())
		fmt.Printf("Title: %s \n", post.GetTitle())
		fmt.Printf("Author: %s \n", post.GetAuthor())
	}
}
```

Le code final donne :

```go
package main

import (
	"fmt"
	"io"
	"log"

	google_protobuf "github.com/golang/protobuf/ptypes/empty"
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

func printPosts(client PostServiceClient) {
	stream, err := client.ListPosts(context.Background(), &google_protobuf.Empty{})
	if err != nil {
		log.Fatalf("%v.ListPosts(_) = _, %v", client, err)
	}
	for {
		post, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("%v.ListPosts(_) = _, %v", client, err)
		}

		fmt.Printf("Id: %d \n", post.GetId())
		fmt.Printf("Title: %s \n", post.GetTitle())
		fmt.Printf("Author: %s \n", post.GetAuthor())
	}
}

func main() {
	conn, err := grpc.Dial("localhost:4000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to start gRPC connection: %v", err)
	}
	defer conn.Close()

	client := NewPostServiceClient(conn)

	printPosts(client)
}
```

## Conclusion
---

gRPC permet de profiter de toutes les nouveautés de HTTP/2 et la puissance de Protocol Buffers. Indispensable pour la communication entre micro-services.
