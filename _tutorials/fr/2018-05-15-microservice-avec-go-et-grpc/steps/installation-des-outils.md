---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: installation-des-outils
title: Installation des outils
---
### Installer protoc  

`protoc` est un générateur qui va lire vos fichiers Protobuf et générer du code.

Si vous êtes sur Linux :
```bash
PROTOC_ZIP=protoc-3.3.0-osx-x86_64.zip
curl -OL https://github.com/google/protobuf/releases/download/v3.3.0/$PROTOC_ZIP
sudo unzip -o $PROTOC_ZIP -d /usr/local bin/protoc
rm -f $PROTOC_ZIP
```
Si vous êtes sur Mac OS X :
```bash
brew install protobuf
```
Si vous êtes sur Windows, vous pouvez [télécharger l'exécutable ici](https://github.com/google/protobuf/releases/download/v3.5.1/protoc-3.5.1-win32.zip).

### Installer prototool  

`prototool` est une commande qui va vous permettre d'utiliser plus facilement `protoc` via un fichier yaml. Il intègre aussi un linter et un client gRPC que nous verrons à l'étape 5.

L'installer avec Go :
```bash
go get -u github.com/uber/prototool/cmd/prototool
```