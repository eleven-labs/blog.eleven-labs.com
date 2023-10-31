---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: declaration-du-protobuf
title: Déclaration du Protobuf
---
### Notre fichier Protobuf  

Nous allons créer un fichier `translator.proto` dans le dossier `proto`.
```protobuf
syntax = "proto3";

package proto;
```
Nous allons déclarer dans ce fichier un service gRPC. La méthode `Translate` aura comme payload `TranslateRequest` et retournera `TranslateResponse`.
```protobuf
service Translator {
    rpc Translate(TranslateRequest) returns (TranslateResponse) {}
}
```
Nous allons maintenant déclarer les messages `TranslateRequest` et `TranslateResponse`.
```protobuf
message TranslateRequest {
    string text = 1;
    Language language = 2;
}

message TranslateResponse {
    string text = 1;
}
```
Petite subtilité ici, les chaînes de caractères ne sont pas compressées avec protobuf. Afin d'optimiser les traitements, on déclare pour `language` que les valeurs possibles sont `en` et `fr`. Pour ce faire on déclare une `enum` `Language`.
```protobuf
enum Language {
    en = 0;
    fr = 1;
}
```
Notre fichier Protobuf est terminé et devrait ressembler à ça :
```protobuf
syntax = "proto3";

package proto;

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
    rpc Translate(TranslateRequest) returns (TranslateResponse) {}
}
```
### Génération avec Prototool  

Nous allons commencer par générer le fichier de config de Prototool.
```bash
prototool init
```
Nous allons maintenant éditer la config pour qu'il génère notre service gRPC en Go.
```yaml
gen:
  go_options:
  import_path: translator-service/

plugins:
  - name: go
    type: go
    flags: plugins=grpc
    output: .
```
Nous pouvons maintenant générer les fichiers Go.
```bash
prototool gen
```
Dans le dossier `proto` , nous avons maintenant un fichier `translator.pb.go`.