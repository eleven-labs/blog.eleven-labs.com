---
contentType: article
lang: fr
date: '2015-10-16'
slug: generator-gulp-angular-1-0-0-stable-released
title: generator-gulp-angular 1.0.0 stable released
excerpt: Intro
categories:
  - javascript
authors:
  - mehdy
keywords:
  - angular
  - yeoman
  - gulp
---

Intro
=====

It has now been more than a year since I ([@Swiip](https://twitter.com/Swiip)), quickly followed by [@zckrs](https://twitter.com/Zckrs), started working on our Yeoman generator. Today we’re celebrating the release of our first major and stable version : [generator-gulp-angular 1.0.0](https://www.npmjs.com/package/generator-gulp-angular).

At first we simply wanted to make a good merge of [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) and [generator-angular](https://github.com/yeoman/generator-angular) as I worked on Angular and got tired of Grunt's verbosity. Then, the project popularity started to increase and so did its ambition.

Philosophy
==========

We followed all the precepts of Yeoman adding our own:

-   Provide a well written seed project following the best recommendations in terms of folder structure and code style.
-   Offer lots of options to enable the user to start instantly with the best tooling and optimization adapted to the latest technologies.
-   Use the concept of automatic injection in different parts of the project: scripts tags both vendor and sources in the index.html, styles files, vendor, css or preprocessed.
-   Provide a test coverage, as perfect as possible, of the code of the generator but also of the generated code.

Technologies supported
======================

We are not joking around when we talk about this being a stable version. We integrated lots of technologies and languages, from Coffee to Typescript, from Sass to Stylus. The amount of combinations exceeds several millions! We wrote tests, documentation and fixed issues for 12 minor versions and 2 release candidates, to be able to deliver a perfectly configured seed project, no matter the options you choose.

![technologies-gga]({BASE_URL}/imgs/articles/2015-10-16-generator-gulp-angular-1-0-0-stable-released/generator-gulp-angular-logo.png)

Optimization served
===================

We integrated many optimizations for your web application using some Gulp plugins :

-   *browserSync*: full-featured development web server with livereload and devices sync
-   *ngAnnotate*: convert simple injection to complete syntax to be minification proof
-   *angular-templatecache*: all HTML partials will be converted to JS to be bundled in the application
-   *ESLint*: The pluggable linting utility for JavaScript
-   *watch*: watch your source files and recompile them automatically
-   *useref*: allow configuration of your files in comments of your HTML file
-   *uglify*: optimize all your JavaScript
-   *clean-css*: optimize all your CSS
-   *rev*: add a hash in the file names to prevent browser cache problems
-   *karma*: out of the box unit test configuration with karma
-   *protractor*: out of the box e2e test configuration with protractor

2.0.0 on the road...
====================

But the v1 is not the end of the road. While maintaining the v1 branch, we started a new Github organization called [FountainJS](https://github.com/FountainJS) targeting a futuristic v2 version. As the context of the build tools has greatly evolved over a year, it will be a reboot of the code base.
The major selling point will be to use Yeoman's generators composition, to upgrade to Gulp 4 and to write it in ES6. Finally, I hope to open new horizons in terms of options: dependency management for sure, but also, why not Web frameworks (someone talked about React?) and also a backend.

Go try out [generator-gulp-angular](https://www.npmjs.com/package/generator-gulp-angular) v1.0.0 release! Any feedbacks, issues, or investment on the new  [FountainJS](https://github.com/FountainJS) project will always be appreciated. [generator-gulp-angular-logo](https://www.npmjs.com/package/generator-gulp-angular)

