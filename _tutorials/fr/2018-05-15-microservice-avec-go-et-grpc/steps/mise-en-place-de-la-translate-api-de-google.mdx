---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: mise-en-place-de-la-translate-api-de-google
title: Mise en place de la Translate API de Google
---
Nous allons maintenant mettre en place [l'API Translate de Google](https://cloud.google.com/translate/?hl=fr).

Commencez par récupérer une clé API pour Translate. Il suffit de vous inscrire et de profiter de l'offre gratuite de Google Cloud Platform.

Nous allons créer un package `translate` qui va utiliser l'API de Google.
```go
// translate.go
package translate

import (
    "context"
    "log"
    "cloud.google.com/go/translate"
    "golang.org/x/text/language"
    "google.golang.org/api/option"
)

type Translator interface {
    Translate(targetLanguage string, text string) (string, error)
}

type GoogleTranslator struct {
    client *translate.Client
}

func NewGoogleTranslator(apiKey string) *GoogleTranslator {
    ctx := context.Background()
    client, err := translate.NewClient(ctx, option.WithAPIKey(apiKey))
    if err != nil {
        log.Fatal(err)
    }
    return &GoogleTranslator{
        client: client,
    }
}

func (t GoogleTranslator) Translate(targetLanguage string, text string) (string, error) {
    ctx := context.Background()
    lang, err := language.Parse(targetLanguage)
    if err != nil {
        return "", err
    }
    res, err := t.client.Translate(ctx, []string{text}, lang, nil)
    if err != nil {
        return "", err
    }
    return res[0].Text, nil
}
```
>Lancez la commande `dep ensure` pour installer les packages qui vous manquent.

Nous allons modifier la factory de `TranslateEndpoint`.
```go
// endpoint.go
func NewTranslateEndpoint(t translate.Translator) TranslateEndpoint {
    return func(ctx context.Context, req *proto.TranslateRequest) (*proto.TranslateResponse, error) {
        text, err := t.Translate(req.Language.String(), req.Text)
        if err != nil {
            return nil, err
        }
        return proto.TranslateResponse{Text: text}, nil
    }
}
```
Nous pouvons maintenant modifier le `main.go` pour ajouter le service à l'endpoint.
```go
// main.go
// ...
translator := translate.NewGoogleTranslator(os.Getenv("TRANSLATION_API_KEY"))
srv := server.NewTranslatorServer(server.Endpoints{
    TranslateEndpoint: server.NewTranslateEndpoint(translator),
})
// ...
```
Nous pouvons maintenant compiler notre serveur.
```bash
TRANSLATION_API_KEY=yourapitoken go run main.go
```