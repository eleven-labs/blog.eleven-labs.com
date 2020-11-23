---
layout: post
title: Présentation de Protocol Buffers
authors:
    - qneyrat
lang: fr
permalink: /presentation-protocol-buffers/
categories:
    - Api
    - Go
tags:
    - api
    - go
cover: /assets/2017-09-20-presentation-protocol-buffers/cover.jpg
---

Une problématique assez récurrente dans nos applications est la manière de rendre notre donnée, qu'elle soit transmise ou stockée. Le format qu'on utilise souvent aujourd'hui est le `JSON`. Cependant certains langages le gèrent très mal tel que Java et Go. Google a donc développé un système pour palier à ce problème : `Protocol Buffers`.

## Présentation
---

Protocol Buffers est un système de sérialisation de données tout comme `JSON` et `XML`. Il est disponible pour la plupart des langages. Une application en Java peut envoyer des objets à une application en Go. Le système repose sur un fichier qui va permettre de structurer notre objet, les fichiers `.proto`. Ce fichier va un peu comme une interface décrire notre objet. Protobuf permet ensuite de générer le code source de l'objet dans plusieurs langages différents.

Pour récapituler, on déclare un fichier proto, on génère notre objet dans notre application serveur et dans notre application client. Nos objets auront dans leur déclaration des méthodes de sérialisation et de de-sérialisation et ce quel que soit le langage.

Notre exemple va être le suivant :

Notre API va retourner un objet `Post`. Un client va appeler cette api. Nous allons avoir besoin d'un fichier `proto` qui va générer le code source en Go. Le serveur va sérialiser un objet et le rendre au client. Ce qui nous donne :

```
Go Struct  ↘                                              ↗ Java Object
             Serialization -> bytes -> Deserialization
Proto file ↗                                              ↖ Proto file
```

Nous allons maintenant voir étape par étape comment ça fonctionne.

## Fonctionnement
---

Protobuf est un langage qui va permettre de définir comment l'objet va être sérialisé et comment il va générer le code source.
Voici un exemple de fichier protobuf :

```Proto
message Person {
  string name = 1;
  int32 id = 2;
  string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    string number = 1;
    PhoneType type = 2;
  }

  repeated PhoneNumber phones = 4;
}
```

Dans cet exemple notre objet `Person` est constitué d'un `name`, d'un `id`, d'un `email` et de `phones`.
La déclaration d'une propriété est définie par un type `int32` ou `string` (et bien d'autres), du nom de la propriété puis d'un identifiant unique (la position) de cette propriété.

On peut aussi faire de la composition en créant de nouveaux types comme ici `PhoneNumber` ou bien des énumérations.
Des modèles de données sont aussi disponibles comme les `array` avec le mot-clé `repeated` ou bien encore des maps avec `map<Key, Value>`.

Vous pouvez retrouver tous les types et déclaration sur [la documentation de Protobuf](https://developers.google.com/protocol-buffers/docs/proto3){:rel="nofollow noreferrer"}.

Une fois notre fichier proto prêt, nous pouvons générer notre fichier Go ou autres avec la commande `protoc`.

Par exemple :

```Bash
protoc -I=$SRC_DIR --go_out=$DST_DIR $SRC_DIR/person.proto
```

En lui donnant le fichier proto en entrée et le dossier de destination en précisant le langage Go `--go_out` ou Java `--java_out`.

Maintenant que notre fichier Go ou Java est généré, nous avons accès à la méthode de sérialisation.

```Go
book := &pb.AddressBook{}
out, err := proto.Marshal(book)
```

Pour comprendre comment Protocol Buffers sérialise un objet en binaire nous allons prendre la définition suivante :

```Proto
message Test1 {
  int32 a = 1;
}
```

Nous allons assigner à `a` la valeur 150. Une sérialisation en `json` donnerait :

```JSON
{"a": 150}
```

Donne `7b 22 61 22 3a 31 35 30 7d` sur 9 octets.

En sérialisant avec Protobuf on obtient `08 96 01` sur 3 octets. Ce binaire est composé pour chacune des propriétés de notre objet d'un couple clé/valeur.

### Clé :

Codage de la clé : `(POSITION << 3) | TYPE`

La position ici est 1 et le type 0, soit :

```
(1 << 3) | 0 = 0000 1000
             = 08

```

### Valeur :

Codage de la valeur : groupage en 7 bits avec l'ajout d'un msb (most significant bit), soit :

```
96 01 = 1001 0110  0000 0001
       → 000 0001  ++  001 0110 (drop the msb and reverse the groups of 7 bits)
       → 10010110
       → 2 + 4 + 16 + 128 = 150
```

Un binaire protobuf sera plus léger qu'un json et donc plus rapidement transmis dans une requête. De plus le parsing est très performant, retrouvez un article sur [les performances de Protobuf](https://medium.com/@fzambia/centrifugo-protobuf-inside-json-outside-21d39bdabd68){:rel="nofollow noreferrer"}.

Nous allons maintenant voir tout ça en pratique.

## Exemple d'application
---

Nous allons tout d'abord installer `protoc` qui permet de générer notre code depuis les fichiers protobuf. [Installer la version pour votre système d'exploitation](https://github.com/google/protobuf/releases/latest){:rel="nofollow noreferrer"}. Une fois ceci fait on va déclarer notre fichier protobuf. Nous allons ensuite installer la librairie qui va permettre de gérer la génération des fichiers Go.

```Bash
go get -u github.com/golang/protobuf/protoc-gen-go
```

### Le fichier Proto :

```proto
syntax = "proto3";

package main;

message Post {
    int32 id = 1;
    string title = 2;
    string author = 3;
}

```

Un `Post` est donc composé d'un `id`, d'un `title` et d'un `author`.
Nous allons donc générer le fichier `Post` grâce à `protoc`:

```Bash
protoc --proto_path=. --go_out=. post.proto
```

Nous devons récupérer la librairie `proto` qui sera utilisée dans le client et dans le serveur.

```Bash
go get github.com/golang/protobuf/proto
```
### Le serveur :
Nous allons maintenant passer au code du serveur.

```Go
package main

import (
	"encoding/json"
	"log"
	"net/http"

	proto "github.com/golang/protobuf/proto"
)

var post = &Post{
	Id:     1,
	Title:  "My awesome article",
	Author: "Quentin Neyrat",
}

func protoHandler(w http.ResponseWriter, r *http.Request) {
	out, err := proto.Marshal(post)
	if err != nil {
		log.Fatalln("Failed to serialize post in protobuf:", err)
	}

	w.Write(out)
}

func main() {
	http.HandleFunc("/posts/1", protoHandler)
	http.ListenAndServe(":8080", nil)
}
```

### Le client :
Nous allons maintenant passer au code du client.

```Go
package main

import (
	"bufio"
	"bytes"
	"fmt"
	"log"
	"net/http"

	proto "github.com/golang/protobuf/proto"
)

func main() {
	post := &Post{}
	resp, err := http.Get("http://127.0.0.1:8080/posts/1")
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	sca := bufio.NewScanner(resp.Body)
	sca.Split(bufio.ScanRunes)

	var buf bytes.Buffer
	for sca.Scan() {
		buf.WriteString(sca.Text())
	}

	err = proto.Unmarshal(buf.Bytes(), post)
	if err != nil {
		log.Fatal("unmarshaling error: ", err)
	}

	fmt.Printf("Id: %d \n", post.GetId())
	fmt.Printf("Title: %s \n", post.GetTitle())
	fmt.Printf("Author: %s \n", post.GetAuthor())
}
```

## Conclusion
---

Protocol Buffers est un système maintenu par Google qui va permettre de jouer plus facilement avec nos données et de pouvoir travailler avec différents langages. Ceci est relativement important dans une architecture micro-services où chaque service doit communiquer avec d'autres quel que soit le langage.

Points positifs :
- performance
- taille du binaire
- langage-agnostic

Points négatifs :
- maintenir les fichiers proto
- debug (message en binaire)

Nous verrons dans un prochain article gRPC, un client RPC qui utilise HTTP2 et protobuf.
