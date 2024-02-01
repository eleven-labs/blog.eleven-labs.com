---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: ajout-proxy-rest-et-doc-swagger
title: Ajout d'un proxy REST et d'une doc Swagger
---
Nous allons maintenant voir comment exposer un service gPRC comme une API REST.
Puisqu'un serveur gRPC n'est pas disponible pour le web, l'une des solutions est de créer un autre service qui va exposer une route REST et appeler le service gRPC.

[grpc-gateway](https://github.com/grpc-ecosystem/grpc-gateway) est un plugin protoc pour auto-générer un proxy HTTP via de la conf dans le fichier protobuf.
```
    HTTP request
        |
        v
 --------------                   ---------------
|  HTTP Proxy  |   json/proto    |  gRPC Server  |
|   on :8001   | ------------->  |   on :4000    |
 --------------  <-------------   ---------------
```
Nous allons commencer par installer les plugins `grpc-gateway` et `swagger` pour protoc.
```bash
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway
go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
```

Nous allons modifier le fichier `proto/translator.proto`  pour ajouter les directives de génération du proxy HTTP.
Pour ce faire, il faut ajouter des options à notre endpoint RPC.
```proto
option (google.api.http) = {
      post: "/v1/translate"
      body: "*"
};
```
Ici, on définit une route `/v1/translate` avec le verbe POST.

Ce qui nous donne :
```proto
syntax = "proto3";

package proto;

import "google/api/annotations.proto";

enum Language {
    en = 0;
    fr = 1;
}

message TranslateRequest {
    string text = 1;
    Language language = 2;
}

message TranslateResponse {
    string text = 1;
}

service Translator {
    rpc Translate(TranslateRequest) returns (TranslateResponse) {
        option (google.api.http) = {
          post: "/v1/translate"
          body: "*"
        };
    }
}
```

Nous allons maintenant modifer le fichier `prototool.yaml` pour générer le proxy et le json de Swagger.
```yaml
# prototool.yaml
protoc_includes:
  - ../../src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis

gen:
 go_options: import_path: translator-service/

  plugins:
  - name: go
    type: go
    flags: plugins=grpc
    output: .
  - name: grpc-gateway
    type: go
    output: .
  - name: swagger
    type: go
    output: swagger/.
```
Nous pouvons maintenant générer les fichiers Go.
```bash
prototool gen
```
Nous allons maintenant utiliser ce proxy qui a été généré et créer un fichier `proxy.go`.
Il suffit de lancer le serveur gRPC dans une goroutine et d'exposer le proxy HTTP.
```go
// proxy.go
package main

import (
    "context"
    "net/http"
    "github.com/grpc-ecosystem/grpc-gateway/runtime"
    "google.golang.org/grpc"
    "translator-service/proto"
)

func main() {
    lis, err := net.Listen("tcp", "localhost:4000")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    translator := translate.NewGoogleTranslator(os.Getenv("TRANSLATION_API_KEY"))
    srv := server.NewTranslatorServer(server.Endpoints{
        TranslateEndpoint: server.NewTranslateEndpoint(translator),
    })
    s := grpc.NewServer()
    proto.RegisterTranslatorServer(s, srv)
    go s.Serve(lis)

    ctx := context.Background()
    ctx, cancel := context.WithCancel(ctx)
    defer cancel()

    mux := runtime.NewServeMux()
    opts := []grpc.DialOption{grpc.WithInsecure()}
    proto.RegisterTranslatorHandlerFromEndpoint(ctx, mux, "localhost:4000", opts)

    http.ListenAndServe(":8001", mux)
}
```
Nous pouvons maintenant compiler notre serveur.
```bash
TRANSLATION_API_KEY=yourapitoken go run main.go
```

Et vérifier que cela fonctionne bien :
```bash
curl -X POST http://localhost:8001/v1/translate \                                                                                                                            [±master ✓]
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Salut les astronautes !",
    "language": "en"
}'
```

On peut remarquer qu'un fichier json a été aussi généré dans le dossier `swagger/proto`.
Il s'agit de la documentation Swagger qui a été générée à partir des directives présentes dans le fichier protobuf.

Vous pouvez ouvrir la documentation [directement ici](https://editor.swagger.io/) ou directement utiliser [swagger-ui](https://github.com/swagger-api/swagger-ui).

## Conclusion

Nous avons maintenant un service documenté accessible via gRPC ou plus classiquement par HTTP.
Je vous conseille de regarder plus en détails [les plugins protoc](https://developers.google.com/protocol-buffers/docs/reference/other) notamment [gogoprotobuf](https://github.com/gogo/protobuf) qui est une autre implémentation de protobuf en Go et [go-proto-validators](https://github.com/mwitkow/go-proto-validators) qui permet de valider les messages protobuf comme des champs obligatoires ou des regex.
