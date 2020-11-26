---
layout: post
title: Retour sur un live-coding de découverte du langage Go
authors:
    - vcomposieux
lang: fr
permalink: /fr/retour-sur-un-live-coding-de-decouverte-du-langage-go/
categories:
    - Go
    - Workshop
tags:
    - golang
    - worker
    - workshop
cover: /assets/2017-08-23-retour-sur-un-live-coding-de-decouverte-du-langage-go/cover.jpg
---

Cet article fait suite à un workshop / live-coding que j'ai eu l'occasion d'organiser chez Eleven Labs pour une initiation au langage Go.

Les workshops sont pour moi le meilleur moyen d'entrer dans un sujet technique que l'on ne maîtrise pas encore. Ils permettent une pratique concrète du sujet, tout en étant accompagné par une personne (pas forcémment experte sur le sujet) qui a déjà été confrontée au sujet, qui a travaillé son workshop et qui saura donc vous donner les billes nécessaires pour bien commencer.

Définition du sujet
-------------------

L'objectif premier de ce workshop était de permettre aux participants (la plupart n'ayant jamais écrit une ligne de Go) de sortir de ces trois heures de live-coding en ayant appris la logique du langage ainsi qu'en sachant maîtriser ses concepts.

Il fallait alors trouver un sujet qui permette de pratiquer tous ces concepts, qui puisse paraître complexe au début mais qui en fait soit rapidement développé. Après un temps de réflexion, j'ai donc choisi de partir sur un cas concret que chaque développeur participant au workshop pourra un jour trouver utile au niveau web : un worker (ou message queue) en Go.

Présentation de WorkMQ
----------------------

WorkMQ est le nom de code du projet (ou plutôt de la librairie) développé durant ce workshop.

L'idée est simple :

* L'application doit pouvoir recevoir des messages en entrée, et chaque message doit appartenir à une `Queue` (file d'attente),
* L'application doit pouvoir traiter ces messages en permettant de mettre à disposition de chaque queue un nombre donné de `Workers` (processus de traitement),
* L'application doit pouvoir fournir en HTTP des statistiques sur son état actuel.

Avant de rentrer dans les détails, voici un schéma expliquant le fonctionnement de notre librairie :

![WorkMQ Schema](/assets/2017-08-23-retour-sur-un-live-coding-de-decouverte-du-langage-go/schema.jpg)

Comme vous pouvez le voir sur ce diagramme, nous avons ici quatre `Queues` de définies, et chacune d'entre elles dispose de trois `Workers`.

Notre librairie (`WorkMQ`, ici le point central), fournira un [Channel (au sens du langage Go)](https://golang.org/ref/spec#Channel_types){:rel="nofollow noreferrer"} dans lequel seront stockés les messages de la queue correspondante qui seront dépilés par le premier worker disponible.

Configuration
-------------

Loin d'être le meilleur moyen de gérer la configuration d'une application, le fichier `json` reste une des manières simple qui permet d'écrire les premières lignes de Go tout en permettant de comprendre les principes de base du langage.

Pour lire la configuration (écrite donc dans un fichier JSON) et la transformer sous forme de `struct` (structures) Go, nous avons commencé par définir la structure de données de notre configuration de la manière suivante :

```json
{
  "ports": {
    "udp": ":10001",
    "http": ":8080"
  },
  "queues": {
    "queue.1s": {
      "processor": "processor.logger.1s",
      "num_workers": 150
    },
    "queue.2s": {
      "processor": "processor.logger.2s",
      "num_workers": 200
    }
  }
}
```

Simple et efficace, celle-ci nous permet de définir les ports `UDP` (pour l'envoi des messages) et `HTTP` (pour l'export de statistiques) ainsi que les noms de nos `queues` et les identifiants des `processor` associés. Nous reviendrons sur les processors un peu plus tard.

Ce qui est intéressant et que nous allons également pouvoir contrôler ici est, pour chaque `queue`, le nombre de workers que nous souhaitons voir disponibles.

Côté Go, nous avons commencé par importer les librairies nécessaires, ici, que des packages natifs, ce qui m'a permis d'expliquer rapidement le concept d'import de librairies internes mais aussi externes ainsi que que la logique de namespaces en répertoires dans un projet :

```go
import (
	"encoding/json"
	"fmt"
	"os"
)
```

Puis, nous avons donc défini les `struct` associées à chaque élément de configuration JSON :

```go
// Config is the configuration type definition.
type Config struct {
	Ports  PortsConfig            `json:"ports"`
	Queues map[string]QueueConfig `json:"queues"`
}

// PortsConfig is the "port" configuration section type definition.
type PortsConfig struct {
	UDP  string `json:"udp"`
	HTTP string `json:"http"`
}

// QueueConfig is the "queues" configuration section type definition.
type QueueConfig struct {
	Processor  string `json:"processor"`
	NumWorkers int    `json:"num_workers"`
}
```

Jusque là, rien de particulier si ce n'est se familiariser avec le typage des données et la notation.

Il était maintenant temps d'écrire notre première `fonction` en Go, pour lire le fichier `config.json` à la racine du projet et importer les données de JSON vers Go :

```go
func GetConfig() Config {
	file, _ := os.Open("./config.json")
	decoder := json.NewDecoder(file)

	config := Config{}
	err := decoder.Decode(&config)

	if err != nil {
		fmt.Println("An error occurs on configuration loading:", err)
	}

	return config
}
```

Il est important ici de discuter avec les participants de la gestion d'erreur, des possibles plusieurs éléments de retour, de la déclaration de variables avec assignation directe, bref, beaucoup d'éléments à assimiler dans cette petite fonction.

Le coeur de notre librairie
---------------------------

La configuration prête à être exploitée, nous avons pu commencer à mettre en place le coeur de notre librairie. L'occasion d'introduire la notion de pointeurs, quand et comment les utiliser.

Nous avons donc écrit la structure de données ainsi que la fonction d'initialisation de notre librairie :

```go
type Workmq struct {
	Config     Config
	Queues     map[string]chan Message
	Processors map[string]Processor
	Counters   RateCounters
	Workers    []Worker
	Wg         sync.WaitGroup
}

// Init initializes processor part
func Init() *Workmq {
	config := GetConfig()
	processors := make(map[string]Processor)
	queues := make(map[string]chan Message)

	counters := RateCounters{
		"sent": ratecounter.NewRateCounter(1 * time.Second),
	}

	return &Workmq{
		Config:     config,
		Queues:     queues,
		Processors: processors,
		Counters:   counters,
	}
}
```

Dans ce bout de code qui initialise un pointeur de structure `Workmq`, la plupart des sujets que je souhaitais traiter sont à expliquer :
* La structure globale de `Workmq` (config, queues, processors, workers, counters, ...),
* La notion de `channels`,
* La notion de synchronisation (attente) des `goroutines` lorsque nous exploitons un `channel` à l'intérieur.

En bref, le gros du sujet et des principes les plus intéressants du langage sont expliqués dans cette partie.

Les workers (partie intégrante du coeur)
----------------------------------------

Le type de structure `Worker` est en effet partie intégrante de notre librairie. Un worker va :
* Se voir associer à une `queue` (comme défini dans la configuration),
* Se voir associer un `Processor` (comme défini dans la configuration) pour traiter les messages de cette `queue`,
* Récupérer le `channel` de messages pour traiter les messages arrivants,
* Et enfin, récupérer une instance de `RateCounter`, une librairie externe que nous utilisons pour calculer le nombre de messages traités à la seconde.

Voici la définition de nos workers :

```go
package workmq

import (
	"fmt"

	"github.com/paulbellamy/ratecounter"
)

// Worker struct
type Worker struct {
	ID        int
	Queue     string
	Message   <-chan Message
	Processor Processor
	Counter   *ratecounter.RateCounter
}

// NewWorker creates a new Worker instance
func NewWorker(id int, queue string, processor Processor, message <-chan Message, counter *ratecounter.RateCounter) Worker {
	return Worker{ID: id, Queue: queue, Processor: processor, Message: message, Counter: counter}
}

// Process listens for a processor on the worker.
func (w *Worker) Process() {
	fmt.Printf("-> Worker %d ready to process queue \"%s\"...\n", w.ID, w.Queue)

	for message := range w.Message {
		w.Counter.Incr(1)
		w.Processor(w, message)
	}
}
```

La première chose importante à retenir, est que la notation `func (w *Worker) Process() {` permet à cette méthode `Process()` d'être appelée uniquement sur un type de structure `Worker`.

Ensuite, la notion intéressante à expliquer ici également est la notation des `channel` :
* `<-chan` : signifie que le channel sera utilisé en lecture uniquement,
* `chan<-` : signifie que le channel sera utilisé pour recevoir des données uniquement.

Enfin, vous pouvez également faire un tour sur les boucles `for` et leurs notations avec `range`.

Les processors (partie intégrante du coeur)
-------------------------------------------

Rien de très nouveau par rapport aux workers lors de la déclaration de nos processors alors je me suis servi de cette structure pour présenter la gestion d'erreurs en Go ainsi que les notations et mots clés utiles pour ajouter et supprimer des éléments d'un tableau :

```go
package workmq

import "fmt"

// Processor type
type Processor func(worker *Worker, message Message)

// AddProcessor adds a processor into the processors list
func (w *Workmq) AddProcessor(name string, processor Processor) {
	w.Processors[name] = processor
}

// GetProcessor retrieves a processor from its name
func (w *Workmq) GetProcessor(name string) (Processor, error) {
	if _, ok := w.Processors[name]; !ok {
		return nil, fmt.Errorf("Unable to find processor '%s'", name)
	}

	return w.Processors[name], nil
}

// RemoveProcessor removes a processor from its name
func (w *Workmq) RemoveProcessor(name string) {
	delete(w.Processors, name)
}
```

Les notions à expliquer ici étaient :
-les notations `if _, ok := w.Processors[name]; !ok` qui permettent de rentrer dans la condition en cas d'erreur (`!ok`) ou non (`ok`) --comment utiliser `nil` et `error` pour retourner notre processor ou aucun, mais tout de même retourner une erreur si le cas se présentait de ne pas disposer du processor demandé.

Aussi, vous noterez la notation `delete(w.Processors, name)` qui permet de supprimer un élément d'une `map`.

Toutes ces petites choses ne paient pas de mine mais sont intéressantes à apprendre lorsque vous découvrez le langage Go. Sinon, vous allez devoir aller fouiller dans la documentation à chaque fois pour savoir comment l'écrire.

La réception en UDP et l'exposition en HTTP
-------------------------------------------

Voilà, tout était prêt et nous n'avions plus qu'à recevoir nos messages (en UDP) et exposer (en HTTP) nos statistiques d'utilisation de la librairie.

Ainsi, nous avons deux `goroutines` qui tournent afin d'écouter sur les deux ports :

```go
go w.ListenUDP()
go w.ListenHTTP()
```

Commençons par la réception de messages en UDP :

```go
// ListenUDP creates a UDP server that listens for new messages
func (w *Workmq) ListenUDP() {
	defer w.Wg.Done()

	address, _ := net.ResolveUDPAddr("udp", w.Config.Ports.UDP)
	connection, _ := net.ListenUDP("udp", address)

	defer connection.Close()

	buf := make([]byte, 1024)

	for {
		n, _, _ := connection.ReadFromUDP(buf)
		w.Counters["sent"].Incr(1)

		message := TransformStringToMessage(buf[0:n])
		w.Queues[message.Queue] <- message
	}
}
```

Les messages reçus sont sous la forme JSON et doivent respecter la structure suivante :

```json
{
  "queue": "queue.1s",
  "body": "This is the message that should be managed by the queue 1 second."
}
```

Nous écoutons donc chaque nouvel élément envoyé sur le port défini dans notre configuration et transformons le message reçu de `[]byte` en structure `Message` grâce à une fonction `TransformStringToMessage` que nous avons défini.

Enfin, nous avons ajouté ce message dans le channel correspondant à la queue avec la notation `w.Queues[message.Queue] <- message`.

À ce moment là, le message sera donc traité par le premier worker disponible dans notre pool de worker.

Dernière étape : l'exposition de statistiques en HTTP. De la même façon, nous écrivons donc notre fonction `ListenHTTP()` qui tourne dans une `goroutine` séparée :

```go
// ListenHTTP creates a HTTP server to expose statistics information
func (w *Workmq) ListenHTTP() {
	defer w.Wg.Done()

	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		fmt.Fprintln(writer, fmt.Sprintf("Sent rate: %d/s", w.Counters["sent"].Rate()))

		var keys []string
		for key := range w.Queues {
			keys = append(keys, key)
		}

		sort.Strings(keys)

		for _, key := range keys {
			fmt.Fprintln(writer, fmt.Sprintf("\n-> %s (%d workers):", key, w.Config.Queues[key].NumWorkers))
			fmt.Fprintln(writer, fmt.Sprintf("	Acknowledge: %d/s", w.Counters[key].Rate()))
			fmt.Fprintln(writer, fmt.Sprintf("	Messages: %d", len(w.Queues[key])))
		}
	})

	err := http.ListenAndServe(w.Config.Ports.HTTP, nil)

	if err != nil {
		log.Fatal("ListenAndServe error: ", err)
	}
}
```

Nous avons ici bouclé sur toutes les queues et affichons les données des compteurs en sortie. Rien de vraiment sorcier par rapport à ce que nous avons déjà appris précédemment.

Pour vous aider à visualiser le résultat, voici la sortie HTTP :

![HTTP Output](/assets/2017-08-23-retour-sur-un-live-coding-de-decouverte-du-langage-go/output.gif)

Conclusion
----------

Avant tout, le code de la librairie est disponible en open-source ici : [https://github.com/unikorp/workmq](https://github.com/unikorp/workmq){:rel="nofollow noreferrer"}.

Pour ce live-coding / workshop, j'avais deux objectifs :
* Permettre à mes participants de ressortir de la session en ayant écrit une librairie open-source complète et fonctionnelle,
* Permettre à mes participants de découvrir la plupart des fonctionnalités principales du langage Go afin de leur permettre de développer dès le lendemain en Go s'ils le souhaitaient.

Je pense que le contrat est rempli avec ce projet et j'espère qu'il vous servira pour découvrir Go vous-même ou le faire découvrir à vos collègues.

N'hésitez pas à contacter Eleven Labs ou à me contacter directement si vous souhaitez organiser des sessions de workshop sur des technologies.
