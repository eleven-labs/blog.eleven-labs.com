---
layout: post
lang: en
date: '2017-08-23'
categories: []
authors:
  - vcomposieux
cover: >-
  /assets/2017-08-23-retour-sur-un-live-coding-de-decouverte-du-langage-go/cover.jpg
excerpt: >-
  This blog post follows a workshop / live-coding session I organized at Eleven
  Labs for an initiation to Go language.
title: Feedback on a live-coding to discover Go language
slug: feedback-on-a-live-coding-to-discover-go-language
oldCategoriesAndTags:
  - go
  - workshop
  - golang
  - worker
permalink: /en/feedback-on-a-live-coding-to-discover-go-language/
---

This blog post follows a workshop / live-coding session I organized at Eleven Labs for an initiation to Go language.

Workshops are to me the best way to enter in a technical subject that we don't already know. It allows to practice it using a real subject, with the help of a person that knows the subject (even if this person may not be a total expert) as the workshop has been planned and organized so he could be really helpful to you.

Define a subject
----------------

The main objective for this workshop was to allow participants (most of them never wrote a single line of Go) to walk out of these three hours of live-coding, completely understanding the logic of the Go language and knowing the main concepts.

I had to find a subject that allows to practice these main concepts and also that sounds like a complex and complete application, but is in fact a simple one that could be developed quickly during the workshop. After a reflection time I've chosen to go on a concrete case on which every developer could encounter the need: a worker (or message queue).

Presentation of WorkMQ
----------------------

WorkMQ is the name of the project (library) we will develop during this workshop.

The idea is pretty simple:

* The application must receive messages in input and each of them has to be linked to a `Queue` (waiting line),
* The application must process these messages by using a defined number of `Workers` (thread that will process the message),
* The application must expose some statistics of current usage over HTTP.

Before going into details, here is a diagram representing the features of our library:

![WorkMQ Diagram](/assets/2017-08-23-retour-sur-un-live-coding-de-decouverte-du-langage-go/schema.jpg)

As you can see on this diagram, we have four `Queues` defined and each of them has three `Workers`.

Our library (`WorkMQ`, here the central point) will give a [Channel (a Go one)](https://golang.org/ref/spec#Channel_types){:rel="nofollow noreferrer"} in which messages will be stored for corresponding queue. These messages will then be processed by the first available worker.

Configuration
-------------

Far from being the best way to manage the configuration of an application, the `json` file is still a simple one to manage it, and will allow us to write our first lines of Go by understanding the language basics.

Indeed, in order to read the configuration (written in a JSON file) and transform it on a Go `struct`, we have started by defining the JSON structure we will need in the application:

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

Simple and efficient, this configuration allows to define `UDP` port (on which we will receive messages), `HTTP` one (to expose usage statistics) and also the names of our `queues` and `processor` identifiers associated to each queue. We will talk about processors later.

What is interesting in this part is that we will be able to control for each `queue`, the number of workers we want to be available.

On Go side, we've started to import core needed libraries, and I took advantage of this moment to explain the principles of namespaces in Go, project structure and how to import both internal and external libraries:

```go
import (
	"encoding/json"
	"fmt"
	"os"
)
```

Then, we have defined the associated `struct` to each JSON elements:

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

Until here, nothing special except to familiarize with data typing and Go notations.

Now comes the time to write our first `function` in Go in order to read the `config.json` file that will be located at the root directory of the project:

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

It is important here to discuss with participants the error handling, multiple returned values, variables declaration with and without direct assignation. To sum up, these are a lot of quick elements to know about when you are developing in Go.

Our library's core
------------------

Once configuration is ready to be exploited, we have started to write the core of our library.
That's also the opportunity to introduce the pointers notion, how and when use it.

We have written the data structure and also the function that will initialize the core structure of our application:

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

In this piece of code which initialize a pointer of `Workmq` struct, most of the subjects I talk about are:
* Global structure of `Workmq` (configuration, queues, processors, workers, counters, ...),
* `Channels` notion,
* Synchronization (wait) of `goroutines` while exploiting a `channel` into them.

In short terms, the most interesting concepts and the biggest part of the project are explained here.

Workers (part of core)
----------------------

The `Worker` structure type is indeed a part of our core library. A worker will:
* Be associated to a `queue` (as defined by the configuration),
* Be associated to a `Processor` (as defined by the configuration) in order to process messages of this `queue`,
* Retrieve the messages `channel` in order to process incoming messages,
* Finally, retrieve an instance of `RateCounter`, an external library that we will use in order to compute the number of messages processed per second.

Here is the worker definition:

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

First thing important to explain as soon as you will encounter the case is the `func (w *Worker) Process() {` notation that will allow the `Process()` method to be called on a `Workmq` struct instance type only.

Next, another interesting thing to explain here is the `channel` notation:
* `<-chan`: indicates that the channel will be used for read only,
* `chan<-`: indicates that the channel will be used for receiving data only.

Finally, you can also take a tour to explain `for` loops and its notations coupling with `range` keyword.

Processors (part of core)
-------------------------

Nothing really new on this part additionnally to workers when declaring our processors so I used this part to present the error handling/return and also keywords and notation to manipulate maps:

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

The notions to explain here were some little sexy things like the `if _, ok := w.Processors[name]; !ok` notation that will allow to enter in the condition in case of errors (`!ok`) or not (`ok`) and also how to use `nil` and `error` to return an error or our processor when it is found.

You can also explain the `delete(w.Processors, name)` notation that allows to remove an element of the `map` from its name.

All of these little things seem to be nothing but are really helpful and it's important to be able to use them without googling each time to know how to achieve your goal.

UDP Reception and HTTP Exposition
---------------------------------

Things were getting almost ready to work. We just had to receive our messages (using UDP) and expose some statistics (using HTTP) of our library.

Then, we have two `goroutines` that are running in another threads to listen both on UDP and on HTTP servers:

```go
go w.ListenUDP()
go w.ListenHTTP()
```

Let's start by UDP reception:

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

Messages are received on a JSON format and must respect the following structure:

```json
{
  "queue": "queue.1s",
  "body": "This is the message that should be managed by the queue 1 second."
}
```

This way, we listen on each new elements sent on configuration defined port and we transform the `[]byte` received into a `Message` structure thanks to a `TransformStringToMessage` we have defined (quite the same work as transforming JSON configuration to Go struct).

Finally, we added this message to the corresponding queue channel with the `w.Queues[message.Queue] <- message` notation.

At this time, the message will be processed by the first available worker in our queue workers pool.

Last step! We also had to expose some statistics using a HTTP server. In a same way, we have written a `ListenHTTP()` function that is running under a separated `goroutine`:

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

In this code, we loop over each queue to display counters data on output.

In order to let you have a better visualization of the output, here is a sample:

![HTTP Output](/assets/2017-08-23-retour-sur-un-live-coding-de-decouverte-du-langage-go/output.gif)

Conclusion
----------

Before any conclusion, the open-source code of this library is available here: [https://github.com/unikorp/workmq](https://github.com/unikorp/workmq){:rel="nofollow noreferrer"}.

I had two main objectives for this live-coding/workshio session:
* Allow my participants to write a complete and functional open-source library in three hours,
* Allow my participants to discover most of the Go language features and concepts so that they are able to develop a Go library or application by themselves the day after.

I think the contract is fulfilled with this workshop and I hope it will be useful to you, to discover Go language or to let your colleagues know about it.

To conclude, do not hesitate to contact Eleven Labs or me directly if you want to organize workshop sessions on web technologies.
