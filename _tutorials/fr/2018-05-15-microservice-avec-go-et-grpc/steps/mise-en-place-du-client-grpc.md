---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: mise-en-place-du-client-grpc
title: Mise en place du client gRPC
---
### gRPC client avec prototool

Nous allons commencer par tester notre service avec prototool.
Prototool va permettre de transformer un json en protobuf et d'appeler le serveur gRPC.

Nous allons créer un fichier `payload.json`.
```json
{
    "text": "Salut les astronautes !",
    "language": "en"
}
```
Nous allons maintenant appeler notre serveur gRPC.
```bash
cat payload.json | prototool grpc proto/translator.proto 0.0.0.0:4000 proto.Translator/Translate - 
```

### gRPC client avec Go

Nous allons créer un simple fichier `client.go` pour appeler le serveur gRPC avec le code qui a été généré.

```go
// client.go
package main  
  
import (  
    "context"
    "log"
    "google.golang.org/grpc"
    "translator-service/proto"
)
  
func main() {  
    conn, err := grpc.Dial("localhost:4000", grpc.WithInsecure())  
    if err != nil {  
        log.Fatalln(err)  
    }
    defer conn.Close()  
    
    client := proto.NewTranslatorClient(conn)  
    res, err := client.Translate(  
        context.Background(),  
        &proto.TranslateRequest{Text:"Salut les astronautes !", Language: proto.Language_en},  
    )
    if err != nil {  
        log.Fatalln(err) 
    }
    log.Println(res.Text)
}
```
Nous allons maintenant appeler notre serveur gRPC avec notre client en Go.
```bash
go run client.go
```