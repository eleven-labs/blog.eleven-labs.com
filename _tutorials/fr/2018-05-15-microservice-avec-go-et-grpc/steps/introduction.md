---
contentType: tutorial-step
tutorial: microservice-avec-go-et-grpc
slug: introduction
title: Introduction
---
## gRPC c'est quoi ?
gRPC a été développé initialement par Google. Il permet de réaliser des clients et serveurs RPC (Remote Procedure Call) via HTTP/2 avec Protocol Buffers.

Je vous invite à lire les articles de notre blog expliquant comment [fonctionne Protobuf](https://blog.eleven-labs.com/fr/presentation-protocol-buffers/) et comment [fonctionne gRPC](https://blog.eleven-labs.com/fr/presentation-grpc/).

## Qu'allons-nous faire ?

Dans ce tutoriel nous allons mettre en place un serveur gRPC en Go utilisant [l'API Translate de Google](https://cloud.google.com/translate/?hl=fr).

Vous pouvez retrouver l'ensemble du code [sur le github des donuts-factory](https://github.com/donuts-factory/translator-service).

Le but est de comprendre :
- la déclaration d'un service gRPC via le fichier protobuf
- la mise en place d'un serveur gRPC
- l'utilisation de l'outil prototool
- la mise en place d'un proxy REST pour pouvoir l'appeler depuis le web

## Prérequis

- Installer [Go 1.9 ou 1.10](https://golang.org/doc/install)
- Créer un dossier `translator-service` dans le dossier `$GOPATH/src`
- Installer [Dep](https://github.com/golang/dep)
