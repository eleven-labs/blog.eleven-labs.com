---
layout: post
title: Présentation de gRPC
authors: 
    - qneyrat
permalink: /fr/presentation-grpc/
categories:
    - Api
    - Go
    - gRPC
    - http2
tags:
    - api
    - go
    - grpc
    - http2
cover: /assets/2017-09-28-presentation-grpc/cover.jpg
---

# Présentation de gRPC

Avant toute chose je vous invite à lire [la première partie](https://blog.eleven-labs.com/fr/presentation-protocol-buffers/) si ce n'ai déjà fait. L'article présente protobuf qui va être utilisé avec gRPC. Aujourd'hui nos projets sont quasiment tous en architecture microservices et chaque service communique avec d'autre via HTTP. Et si maintenant on utilisé HTTP/2 pour faire communiquer nos services ?

Parce que qu'un client HTTP/1 c'est bien mais un client HTTP/2 c'est mieux.

HTTP/2 c'est quoi ? Je vous invite à lire [cet article de Vincent](https://blog.eleven-labs.com/fr/http2-nest-pas-le-futur-cest-le-present/)  pour y voir plus clair.

gRPC c'est quoi ?

gRPC a été développé initialement par Google puis rendu open source. Il permet de réaliser des clients et serveurs rpc via HTTP/2 et donc de profiter de ces nouveautés. Les données sont sérialisé et désérialisé grâce à Protocol Buffers. Le framework gRPC permet aussi d'avoir un client et un serveur dans différents languages. En effet il est disponible pour la plupart des langages.

Chaque service rpc est déclaré dans le fichier protobuf.

gRPC permet quatre modes communications.


Le one to one classique :
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

Nous allons voir pour cette article uniquement le troisième mode `streaming côté serveur` mais les quatre sont très semblables.

Vous pouvez retrouver l'ensemble du code de [l'exemple sur mon github](https://github.com/qneyrat/go-grpc-example).

### Installation

Assurez vous avant de commencer l'installation d'avoir bien installé Go en version supérieur à 1.5 et Protocol Buffers V3.

Récupérez gRPC pour Go.

```Bash
go get google.golang.org/grpc
```

### Protobuf

Nous allons commencer par récupérer le fichier proto du [précédent article](https://blog.eleven-labs.com/fr/presentation-protocol-buffers/).

Nous allons ajouté un service pour récupérer en streaming la liste des Posts.

Un service rpc est composé :

```
rpc function(request) returns (response)
```

Ici on va une request vide et retourné un streaming de Post.

```Proto
service PostService {
    rpc ListPosts(google.protobuf.Empty) returns (stream Post) {}
}
```

Ce qui nous donnes :

```Proto
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

### Serveur

On va commencé par générer le code source depuis le fichier protobuf.

```Bash
protoc --proto_path=. --go_out=plugins=grpc:. post.proto
```

On commence par déclarer une pseudo base de données :

```Go
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

```Go
	lis, _ := net.Listen("tcp", fmt.Sprintf("localhost:%d", 4000))
	g := grpc.NewServer()
	RegisterPostServiceServer(g, NewServer())
	g.Serve(lis)
}
```

On a plus qu'a créer notre endpoint qui va parcourir notre pseudo base de données et envoyer les posts un par un :
```Go
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
```Go
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
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", 4000))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	g := grpc.NewServer()
	RegisterPostServiceServer(g, NewServer())
	g.Serve(lis)
}
```

astuce : `go run *` pour compiler entièrement le projet.

### Client

Dans un nouveau projet, on déclare un client gRPC pour notre service.
```Go
conn, _ := grpc.Dial("localhost:4000", grpc.WithInsecure())
client := NewPostServiceClient(conn)
```

Puis une méthode pour récupérer les Posts :
```Go
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
```Go
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

gRPC permet de profiter de toute les nouveautés de HTTP/2 et la puissance de Protocol Buffers. Indispensable pour la communication entre micro-services.
