---
layout: post
title: CQRS Pattern
authors:
    - rpierlot
lang: en
permalink: /cqrs-pattern-2/
date: '2017-03-15 16:28:57 +0100'
date_gmt: '2017-03-15 15:28:57 +0100'
categories:
- Non classé
tags:
- architecture
- cqrs
---

CQRS, which means _Command_ _Query Responsibility Segregation_, comes from CQS (_Command Query Separation_) introduced by Bertrand Meyer in _Object Oriented Software Construction_. Meyer states that every method should be either a _query_ or a _command_.

The difference between CQS and CQRS is that every CQRS object is divided in two objects: one for the query and one for the command.

A command is defined as a method that changes state. On the contrary, a query only returns a value.

The following schema shows a basic implementation of the CQRS pattern inside an application. All messages are sent through commands and events. Let's take a closer look at this.

![Example of implementation of CQRS pattern](/assets/2015-04-07-cqrs-pattern/cqrs_pattern.png)
*Example of implementation of CQRS pattern*

We can clearly see the separation between writing parts and reading ones: the user does a modification on his page, resulting in a command being executed. Once this command is fully handled, an event is dispatched to signal a modification.

## Commands

A command tells our application to do something. Its name always uses the indicative tense, like _TerminateBusiness_ or _SendForgottenPasswordEmail_. It's very important not to confine these names to _create, change, delete..._ and to really focus on the use cases (see _CQRS Documents_ at the end of this document for more information).

A command captures the intent of the user. No content in the response is returned by the server, only queries are in charge of retrieving data.

## Queries

Using different _data stores_ in our application for the command and query parts seems to be a very interesting idea. As Udi Dahan explains very well in his article _Clarified CQRS_, we could create a user interface oriented database, which would reflect what we need to display to our user. We would gain in both performance and speed.
Dissociating our data stores (one for the modification of data and one for reading) does not imply the use of relational databases for both of them for instance. Therefore, it would be more thoughtful to use a database that can read our queries fastly.

If we separate our data sources, how can we still make them synchronized? Indeed, our "read" data store is not supposed to be aware that a command has been sent! This is where events come into play.

## Events

An event is a notification of something that _has_ happened. Like a command, an event must respect a rule regarding names. Indeed, the name of an event always needs to be in the past tense, because we need to notify other parties listening on our event that a command has been completed. For instance, _UserRegistered_ is a valid event name.
Events are processed by one or more consumers. Those consumers are in charge of keeping things synchronized in our query store.

Very much like commands, events are messages. The difference with a command is summed up here: a command is characterized by an action that _must_ happen, and an event by something that _has_ happened.

## Pros and Cons

The different benefits from this segregation are numerous. Here are a few:

*   _Scalability :_ The number of reads being far higher than the number of modifications inside an application, applying the CQRS pattern allows to focus independently on both concerns. One main advantage of this separation is scalability: we can scale our reading part differently from our writing part (allocate more resources, different types of database).
*   _Flexibility_ : it's easy to update or add on the reading side, without changing anything on the writing side. Data consistency is therefore not altered.

One of the main con is to convince the members of a team that its benefits justify the additional complexity of this solution, as underlines the excellent article called _CQRS Journey_ (see below).

## Usage

The CQRS pattern must be used inside a _bounded context_ (key notion of _Domain Driven Development_), or a business component of your application. Indeed, although this pattern has an impact on your code at several places, it must not be at the higher level of your application.

## Event Sourcing

What's interesting with CQRS is _event sourcing_. It can be used without application of the CQRS pattern, but if we use CQRS, _event sourcing_ appears like a must-have.
_Event sourcing_ consists in saving every event that is occurring, in a database, and therefore having a back-up of facts. In a design of _event sourcing_, you cannot delete or modify events, you can only add more. This is beneficial for our business and our information system, because we can know at a specific time what is the status of a command, a user or something else. Also, saving events allows us to rebuild the series of events and gain time in analysis.
One of the examples given by Greg Young in the conference _Code on the Beach_, is the balance in a bank account. It can be considered like a column in a table that we update every time money is debited or credited on the account. One other approach would be to store in our database all transactions that enabled us to get to this balance. It then becomes easier to be sure that the indicated amount is correct, because we keep a trace of events that have occurred, without being able to change them.

We will not go into more details on this principle in this article. A very interesting in-depth study is available in the article _CQRS Journey_ (see below).

## Recap

CQRS is a simple pattern, which enables fantastic possibilities. It consists in separating the reading part from the writing part, with _queries_ and _commands._

Many advantages result from its usage, especially in term of flexibility and scaling.

_Event sourcing_ completes theCQRS pattern by saving the history that determines the current state of our application. This is very useful in domains like accounting, because you get in your database a series of events (like financial transactions for instance) that cannot be modified or deleted.

### To go further

[CQRS Documents](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf "CQRS Documents"){:rel="nofollow"}, _Greg Young_

[CQRS Journey](https://msdn.microsoft.com/en-us/library/jj554200.aspx "Exploring CQRS and Event Sourcing"){:rel="nofollow"}, _Dominic Betts, Julián Domínguez, Grigori Melnik, Fernando Simonazzi, Mani Subramanian_

[Clarified CQRS](http://www.udidahan.com/2009/12/09/clarified-cqrs/){:rel="nofollow"}, _Udi Dahan_

[CQRS and Event Sourcing - Code on the Beach 2014](https://www.youtube.com/watch?v=JHGkaShoyNs){:rel="nofollow"}, _Greg Young_
