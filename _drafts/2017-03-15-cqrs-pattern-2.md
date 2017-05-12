---
layout: post
title: CQRS Pattern
author: rpierlot
date: '2017-03-15 16:28:57 +0100'
date_gmt: '2017-03-15 15:28:57 +0100'
categories:
- Non classé
tags:
- architecture
- cqrs
---
{% raw %}
CQRS, which means <i>Command</i> <i>Query Responsibility Segregation</i>, comes from CQS (<em>Command Query Separation</em>) introduced by Bertrand Meyer in <em>Object Oriented Software Construction</em>. Meyer states that every method should be either a <em>query </em>or a <em>command</em>.

The difference between CQS and CQRS is that every CQRS object is divided in two objects: one for the query and one for the command.

A command is defined as a method that changes state. On the contrary, a query only returns a value.

The following schema shows a basic implementation of the CQRS pattern inside an application. All messages are sent through commands and events. Let's take a closer look at this.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-31-at-19.57.09.png"><img class="wp-image-1083 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-31-at-19.57.09-1024x723.png" alt="Screen Shot 2015-03-31 at 19.57.09" width="538" height="380" /></a>

<div style="text-align: center; font-size: 10px;">Example of implementation of CQRS pattern</div>
We can clearly see the separation between writing parts and reading ones: the user does a modification on his page, resulting in a command being executed. Once this command is fully handled, an event is dispatched to signal a modification.

## Commands
A command tells our application to do something. Its name always uses the indicative tense, like <em>TerminateBusiness</em> or <em>SendForgottenPasswordEmail</em>. It's very important not to confine these names to <em>create, change, delete...</em> and to really focus on the use cases (see <em>CQRS Documents </em>at the end of this document for more information).

A command captures the intent of the user. No content in the response is returned by the server, only queries are in charge of retrieving data.

## Queries
Using different <em>data stores </em>in our application for the command and query parts seems to be a very interesting idea. As Udi Dahan explains very well in his article <em>Clarified CQRS</em>, we could create a user interface oriented database, which would reflect what we need to display to our user. We would gain in both performance and speed.<br />
Dissociating our data stores (one for the modification of data and one for reading) does not imply the use of relational databases for both of them for instance. Therefore, it would be more thoughtful to use a database that can read our queries fastly.<em> </em>

If we separate our data sources, how can we still make them synchronized? Indeed, our "read" data store is not supposed to be aware that a command has been sent! This is where events come into play.

## Events
<div class="page" title="Page 259">
<div class="layoutArea">
<div class="column">
An event is a notification of something that <em>has </em>happened. Like a command, an event must respect a rule regarding names. Indeed, the name of an event always needs to be in the past tense, because we need to notify other parties listening on our event that a command has been completed. For instance, <em>UserRegistered </em>is a valid event name.<br />
Events are processed by one or more consumers. Those consumers are in charge of keeping things synchronized in our query store.

Very much like commands, events are messages. The difference with a command is summed up here: a command is characterized by an action that <em>must</em> happen, and an event by something that <em>has </em>happened.

</div>
</div>
</div>
## Pros and Cons
The different benefits from this segregation are numerous. Here are a few:

<ul>
<li><em>Scalability : </em>The number of reads being far higher than the number of modifications inside an application, applying the CQRS pattern allows to focus independently on both concerns. One main advantage of this separation is scalability: we can scale our reading part differently from our writing part (allocate more resources, different types of database).</li>
<li><em>Flexibility</em> : it's easy to update or add on the reading side, without changing anything on the writing side. Data consistency is therefore not altered.</li>
</ul>
One of the main con is to convince the members of a team that its benefits justify the additional complexity of this solution, as underlines the excellent article called <em>CQRS Journey </em>(see below)<em>.</em>

## Usage
The CQRS pattern must be used inside a <em>bounded context </em>(key notion of <em>Domain Driven Development</em>), or a business component of your application. Indeed, although this pattern has an impact on your code at several places, it must not be at the higher level of your application.

## Event Sourcing
What's interesting with CQRS is <i>event sourcing</i>. It can be used without application of the CQRS pattern, but if we use CQRS, <i>event sourcing </i>appears like a must-have.<br />
E<i>vent sourcing </i>consists in saving every event that is occurring, in a database, and therefore having a back-up of facts. In a design of <i>event sourcing</i>, you cannot delete or modify events, you can only add more. This is beneficial for our business and our information system, because we can know at a specific time what is the status of a command, a user or something else. Also, saving events allows us to rebuild the series of events and gain time in analysis.<br />
One of the examples given by Greg Young in the conference <em>Code on the Beach</em>, is the balance in a bank account. It can be considered like a column in a table that we update every time money is debited or credited on the account. One other approach would be to store in our database all transactions that enabled us to get to this balance. It then becomes easier to be sure that the indicated amount is correct, because we keep a trace of events that have occurred, without being able to change them.

We will not go into more details on this principle in this article. A very interesting in-depth study is available in the article <em>CQRS Journey</em> (see below).

## Recap
CQRS is a simple pattern, which enables fantastic possibilities. It consists in separating the reading part from the writing part, with <em>queries </em>and <em>commands.</em>

Many advantages result from its usage, especially in term of flexibility and scaling.

<em>Event sourcing</em> completes the<em> </em>CQRS pattern by saving the history that determines the current state of our application. This is very useful in domains like accounting, because you get in your database a series of events (like financial transactions for instance) that cannot be modified or deleted.

### To go further
<span style="text-decoration: underline;"><a title="CQRS Documents" href="https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf" target="_blank">CQRS Documents</a></span>, <em>Greg Young</em>

<span style="text-decoration: underline;"><a title="Exploring CQRS and Event Sourcing" href="https://msdn.microsoft.com/en-us/library/jj554200.aspx" target="_blank">CQRS Journey</a></span>, <em>Dominic Betts, Julián Domínguez, Grigori Melnik, Fernando Simonazzi, Mani Subramanian</em>

<span style="text-decoration: underline;"><a href="http://www.udidahan.com/2009/12/09/clarified-cqrs/" target="_blank">Clarified CQRS</a></span>, <em>Udi Dahan</em>

<div id="watch-headline-title">
<span id="eow-title" class="watch-title " dir="ltr" title="Greg Young - CQRS and Event Sourcing - Code on the Beach 2014"><span style="text-decoration: underline;"><a href="https://www.youtube.com/watch?v=JHGkaShoyNs" target="_blank">CQRS and Event Sourcing - Code on the Beach 2014</a></span>, <em>Greg Young</em></span>

</div>
{% endraw %}
