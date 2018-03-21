---
layout: post
title: Codelabs under the hood
excerpt: Introducing Eleven's Codelabs
authors:
    - kelfarsaoui
lang: en
permalink: /codelabs-under-the-hood/
categories:
    - React
    - Redux
    - Static site generation
    - Markdown
    - AST
    - App engine
tags:
    - React
    - Redux
    - Static site generation
    - Markdown
    - AST
    - App engine
cover: /assets/2018-03-20-codelabs-under-the-hood/cover.jpg
---

After several months of hard work, we're excited to finally announce Eleven's Codelabs!

[image]

At the beginning of summer 2017, the idea of a tutorial platform made in Eleven began to take shape, and the project was born on Github. Then, in July 2017, a dozen motivated engineers gathered to brainstorm and define the features that may be part of the MVP. The project aims to separate tutorials from blog articles so that developers can follow a tutorial step by step.

### What’s inside the box?

We agreed about developing the MVP by implementing these classic features:
Home page that displays a splash and the list of courses.
Make sure readers can navigate intuitively through a tutorial steps.
Build a search engine.
Display the progress of a reader in each course.

### Organization

Write something here ...

### Static site generation

Creating an application like this involves dealing with several complex topics like mounting a server-side architecture, maintaining the database and using template engines. Hopefully, we chose to avoid these complications and opt for the static site generation technique.

The concept of static site generation is based on the serverless aspect of an application. When a user requests a page, the application fetches the content from plain files stored locally, instead of server-side scripts that extract data from databases. This makes the application relatively fast, due to the absence of database queries, server processing and templating engines.

[image]

Working with static files allows us to take advantage of SCM (Source Code Management) features so that we can control the versioning of our content. This is very promising because If you could put yourself in an author’s shoes for a moment, you realize that you want to keep track of your progress when writing your tutorials, and rollback changes when necessary, and I can assure you that it’s pretty much better when you don’t have to worry about losing your content.

Another advantage is that we don't have to worry about security, thanks to the serverless aspect and the lack of user input which saves us a lot of security work.


### The stack

There are plenty of choices when it comes to defining a stack for your project. But here in Eleven Labs, we are big fans of the React ecosystem, it makes modern web development so easy to tame, considering how with not much effort you can build a fairly decent experience. I'm not going to walk through the details of it, knowing that there is a whole bunch of articles out there talking about React and Redux. But hey! you know the drill; Webpack, Components, Props, State, Actions, Reducers, ... the whole nine yards.

### React components generation

This section explains the transformation of the markdown into HTML, which results in displaying a tutorial to the reader. As a matter of fact, this is a critical feature that must be dealt with diligently.

We wanted to keep it simple by using the same process we use in the blog:
Writing articles using Markdown.
Storing files in the repository (Pull Requests and reviews).



We want to parse the markdown.
We want to transform it into a more structured format
More structured format implies more details and more control.
More control implies evolution and expandability of the markdown.
More control implies more access and usability.

#### Why?

Due to the sensitivity of this feature, we didn’t like the idea of using a third-party library to transform the markdown to HTML (even though there are plenty). This feature represents a big deal of the project's value. We can't afford disastrous situations where we might encounter some problems during upgrades, or hassle with bugs We can’t fix. We want full control over the flow.
How?
…

### Deployment

Write something here
App Engine
Write something here



