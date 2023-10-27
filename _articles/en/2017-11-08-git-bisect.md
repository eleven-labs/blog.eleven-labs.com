---
contentType: article
lang: en
date: '2017-11-08'
slug: debugging-with-git
title: Debugging with Git
excerpt: >-
  Today I'd like to talk about a tool that will allow us to rapidly isolate an
  incorrect commit, that caused a bug in our application: git bisect
cover: /assets/2017-10-26-debugging-with-git/branching-illustration.png
categories:
  - javascript
  - php
authors:
  - rpierlot
keywords:
  - git
  - amp
---

When deploying new features to a production environment, risks of regression exist. Especially in big applications with a lot of untested code. We are never safe from negative behaviour, or impacts that need our immediate attention.

In a project using Git as a source code management tool, it appears essential to rapidly find the source of our problem.
When dealing with large teams composed of many people, every deployment comes with a lot of commits.
But if the origin of the problem is hidden in the middle of all those commits, it is quite complicated to check every commit for the source of the issue.

Git is a very famous tool in software development, and it comes with a bunch of commands that prevent us from missing good old SVN.
Today I'd like to talk about a tool that will allow us to rapidly isolate an incorrect commit, that caused a bug in our application:  : `git bisect`

To simplify my explanation of `git bisect`, I'm going to use the following history of commits:

```
* bad5bfe - fixed security issue (1 hour ago) <Wilson Bouncer>
* a73d98b - implemented feature to get recipe in space kitchen (8 hours ago) <Wilson Cook>
* 9bd6395 - updated metrics computation on space launcher (13 hours ago) <Wilson Analyst>
* 99f3fa1 - worked on real-time suggestion when encounting problems in space (1 day ago) <Wilson Scientist>
* 4021b7f - deleted ab test feature and cleaned up code (1 day ago) <Wilson Cleaner>
* 0d7c223 - computed the ideal playlist based upon astronauts tastes (2 days ago) <Wilson DJ>
* 29d90f9 - updated README.md (2 days ago) <Wilson Documentation>
```
Imagine that those commits have been deployed to production. After a few moments, someone notices that something's wrong. One of the functionalities is broken.
The problem is immediately brought to developers and they have to isolate the cause of the bug. They only have one clue: everything was fine before the last deployment.

Git takes away the boredom of testing our commits one by one with `git bisect`. This command does a [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) in our history.

![](/_assets/articles/2017-10-26-debugging-with-git/binary_search.jpg)

At every step of the binary search, we must tell `git bisect` if the issue still persists.
According to our response, `bisect` will go forward or backward to isolate the issue.

There are two main commands with `git bisect` :
* `git bisect good`: this allows us to say that the commit which `bisect` stopped us on does not contain the bug.
* `git bisect bad`: this allows us to say that the bug still exists on the commit we're on.

## Let's debug!

Before we begin debugging, we must start the script, and indicate the interval on which we're going to use `bisect`.

```
git bisect start
git bisect good 29d90f9
git bisect bad bad5bfe
```
Once this is done, we can notice that `bisect` changed our position in the commits history to the middle of our interval.
```
Bisecting: 2 revisions left to test after this (roughly 2 steps)
[99f3fa1b86489dd9d6f30368d5b5321e04a955df] worked on real-time suggestion when encounting problems in space
```
Now, we must check if the bug is still here. Unfortunately yes in this case!
Keep on "bisecting".
```
git bisect bad
```
We're now on the middle of our last interval (binary search)
```
Bisecting: 0 revisions left to test after this (roughly 1 step)
[4021b7f911b84daa6ea5ccad51d3171fc0e46b67] deleted ab test feature and cleaned up code
```
Notice that the number of steps left in the search is indicated: `roughly 1 step`.
We still have the bug on this commit:
```
git bisect bad
```
We're getting closer!
```
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[0d7c223dcfee62e1750e21385e7fa35b030bc8a7] computed the ideal playlist based upon astronauts taste
```
On this commit, our problem is gone! Yay! Let's tell it to `git bisect`:
```
git bisect good
```
`git bisect` has reached the end of its search. He has found the culprit:
```
4021b7f911b84daa6ea5ccad51d3171fc0e46b67 is the first bad commit
commit 4021b7f911b84daa6ea5ccad51d3171fc0e46b67
Author: Wilson Cleaner <wilson.cleaner@eleven-labs.com>
Date:   Tue Oct 17 16:56:06 2017 +0200

    deleted ab test feature and cleaned up code

:100644 100644 66f0d114adeee6d2141aa6fe64a5cc431ebce65e a0fe62c949a75957245ec1c04728fea047488697 M	README.md
```

To reinitialize nothing more simple:

```
git bisect reset
```
We're now where we began, but we have found the evil commit that tormented the whole team, all of this quite rapidly.

## Bonus

The `bisect` command allows you to automate the search process.
Indeed, if you have the luxury of adding a test that highlights the bug, you can launch git bisect as follow:
```
git bisect run vendor/bin/phpunit --filter ThatWontHappenAgainISwearTest
```
The command `vendor/bin/phpunit --filter ThatWontHappenAgainISwearTest` will be launched at every step seen before, and you'll automatically have the hash of the commit you're looking for.

## Recap

The use of `git bisect` allows us to rapidly debug by isolating a bad commit with a binary search.
Just indicate `git bisect good` or `git bisect bad` so that `bisect` can navigate through your history.

