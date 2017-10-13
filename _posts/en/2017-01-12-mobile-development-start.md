---
layout: post
title: 'Dive into mobile development: where to start'
excerpt: "These days more than ever before mobile applications have become essential in the lives of millions of people. If you are reading this article, it means that you too are interested in this subject. I'll try to make a series of articles to share with you as much as I can on it."
lang: en
permalink: /mobile-development-start/
authors:
 - ibenichou
date: '2017-01-12 11:06:36 +0100'
date_gmt: '2017-01-12 10:06:36 +0100'
categories:
- Mobile
tags:
- mobile app
- Android
- mobile
---

## Mobile development: where to start?

These days more than ever before mobile applications have become essential in the lives of millions of people. If you are reading this article, it means that you too are interested in this subject. I'll try to make a series of articles to share with you as much as I can on it.

**Which technologies?**

The questions you should ask yourself are: "What are the tools, plugins, functionalities my application needs? What is my target audience? How many people are targeted by this application?". Once these questions answered, you are going to answer automatically the question about the technology choice.

Today I am going to talk about 3 technologies that I chose for several reasons:

-   Because they are the most common in making mobile applications and their communities are most active;
-   I have already used these technologies and I want to give real feedback on them. Regarding native mobile development, I chose iOS and not Android (I explain hereafter why, no spoilers).

## **Ionic:**

Ionic is a JavaScript framework based on AngularJS for the web application part of the framework, and on Cordova for the native application development.

**How does it work?**

Ionic actually allows to create an application that opens a "WebView" natively available on mobile devices. To simplify, it is a web browser window, executed in our application, which is responsible for interpreting and displaying the content of our scripts. The WebView, whose possibilities are extended by Cordova, allows to access a certain amount of native features of the mobile device (see schema below).

Android's WebView is based on Chromium. For iOS, it's Safari, and it's Internet Explorer Mobile for Windows Phone.

Thus, Ionic doesn't allow creating native mobile applications strictly speaking. We'll be talking about hybrid applications instead.

*Ionic representation schema*:![schema1](/assets/2017-01-12-mobile-development-start/Schema1.png)

I can see you coming: "AngularJS, great, I have it under control, let's go".

Stop right there, young padawan, read the whole article you must!
Indeed, if you already know AngularJS well, it's a big plus.

The installation process is of an extraordinary simplicity:

```sh
npm install -g cordova ionic
ionic platform add ios
ionic build ios
ionic emulate ios
```

In 4 command lines, you just built your iOS application.

One of the main advantages of Ionic is that it provides pre-made components, which allows to develop applications quickly.

**A spinner example:**

```
<ion-spinner></ion-spinner>
```

I had the chance to develop several applications with Ionic, and I have to say that the component aspect is really handy. The [documentation](http://ionicframework.com/docs/) exposes all components available with Ionic.

As mentioned before, Ionic is also based on Cordova to interact with native components of devices. Through plugins you can use localisation, camera, etc...

**Example of the command to add the camera plugin:**

```sh
ionic plugin add cordova-plugin-camera
```

But Ionic has weaknesses as well:

-   Problems with new iOS versions.
    *Example*: switching to iOS 9 introduced a regression on the way window.location works inside of the iOS WebView.
-   Performances are really behind compared to native applications.
    *Example*: when you implement Google Map via Ionic, the loading time depends on your internet connection (3G/4G) because you are downloading all the data. Whereas, in iOS for example, the map is directly integrated in the OS. I was able to observe a loading time that lasts 2 to 3 seconds on average (once again, everything depends on your connection) against an almost instant loading of the map with native applications.
-   Cordova doesn't allow using all native components of the OS, thus we are limited with features.
    *Example*: IOS introduced a new feature of facial recognition, allowing to detect if a person is smiling on a photograph, or has the eyes open or closed, etc...  This feature is not available with Cordova.

*Compatibility table with Cordova:*

![platform-support](/assets/2017-01-12-mobile-development-start/platform-support.png)

**Conclusion:**

**Ionic is a great way to build small applications quickly. But as soon as you want to widen the scope of features, or to have proper performances, it starts biting. I haven't tested the version 2, but I know that they have made some improvements.**

## **React Native:**

As its name suggests, React Native is a variation of React (driven by Facebook in 2015). Its goal is to re-use as much code as possible between different platforms.

Coding in JavaScript allows web developers to build a native mobile application, unlike Cordova which encapsulates the application in a WebView.

**How does it work?**

Thanks to a JavaScript engine executed asynchronously in a separated thread, the developers manage a native UI with JavaScript code. Thus, the technology avoids usual concessions of native applications, while offering an optimum user experience, almost a native one.

*A piece of advice*:

Before diving into React Native, I suggest that you start by getting familiar with React. You can check out the [video](https://www.youtube.com/watch?v=WbUO00hrjiE) of a conference I've given, where I explain basics of React with a rather interesting and full example.

To be honest I had a hard time with React Native at the beginning when I started developing my first application.

Why?

-   Because React Native isn't stable yet. Its versions change very very often, which implies that the code you wrote yesterday may not be relevant today (that's the major problem of JavaScript in general you'll say \*troll\*);
-   The installation of an Android emulator was not simple, neither was launching the application on my device;
-   For every encountered issue I had trouble finding answers through the community, since it is just starting to grow.

That being said, you are going to ask me why do we hear about it so much?

If you followed the article, one of the biggest advantages of React Native is that we use the native OS UI with our JS code. Every suggested component in the Facebook documentation is a native OS component. But it's not over.

Indeed, you can code a feature (in Java or Objective-C / Swift) that allows to interact with the native API of the OS and to expose it to be used in JS.

Magic, right? By consequence, there are more and more npm plugins and repositories for React Native. The community is growing and wants this tool to become the reference of mobile development.

From my point of view and my experience, here are the weaknesses of React Native:

-   It is not stable yet (version 0.35 at the moment I am writing this article), so a lot of things change at every release, which implies following every modification closely;
-   It offers a certain amount of components, but if the behavior you need requires using native APIs that don't have a component yet (such as Speech Recognition for example), you'll have to develop it natively, and this requires knowledge of the appropriate languages;
-   The installation of the emulator for Android on Mac asks for more time and patience.

**Conclusion:**

**React Native seems to be the perfect approach for creating applications of any type. Nevertheless, it being young means that it isn't mature enough to be used to building big application that may demand particular treatments. But I recommend following its evolution closely.**

### **Native:**

Obviously, to build an application there is nothing better than native development.

Why? Because there are no restrictions linked to a technology. There are no problems with OS upgrades. The user experience is certainly better and the performances are as well (if the application is coded properly \*troll\*). In one word, it's great!

Hence, a little time ago, I told myself: "Astronaut, this mission is for you!"

So, first I had do choose a language.

Yes, native mobile development is great, but you have to know 2 languages if you want to build a multi platform application. My choice was iOS for practical reasons. I have a Mac and an iPhone (alright, I'm an Apple bot \*troll\*).

**Objective-C /  Swift: What to choose?**

**A small history:**

There are 2 languages to develop on iOS. The first one is Objective-C.

It's an extension of C ANSI, just like C++, but different in dynamic message distribution, typing... It's based on class library Cocoa and used in operating systems such as NeXTSTEP.

In 2014, at WWDC conference, Apple presented a new language called Swift designed for application development on iOS, macOS, watchOS and tvOS.

It was meant to co-exist with Objective-C. A couple of days after its presentation, Swift was among the 20 most popular programming languages. In July 2014, Swift was 16th.

Apple released the version 3 of Swift.

Ok, but what to choose?

Isn't it better to begin with Objective-C which showed its stability, or maybe with Swift, which is much more powerful and easier to learn? I looked for answers everywhere in forums and articles. I even asked iOS developers. This is what I concluded.

In my opinion, Swift has an easier syntax, so it's more convenient to start with it. If you are currently developing with another object oriented language, you are going to make progress quickly. Try your hand at it, study the technical aspects, as well as the constraints, and most of all, have fun.

But then, do we forget about Objective-C? Yes and no...

1.  If you want to do some advanced Swift, it's best to know Objective-C first;
2.  The reality gets the upper hand. You might be brought to work on a project that already has an old mobile application, and by consequence, it is written in Objective-C. Don't panic, usually, it's to understand the existing code in order to migrate to a new application which is written in Swift.

**Conclusion:**

**Native development allows to have a better finish. Nonetheless, it requires more effort since you need to learn more languages to publish an application on several platforms.**


*Translated from the french by Marie Gautier*
