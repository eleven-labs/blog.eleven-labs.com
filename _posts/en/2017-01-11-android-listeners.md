---
layout: post
title: 'Android : Why do I like listeners ?'
authors:
    - thuchon
lang: en
permalink: android-listeners/
excerpt: "Let's talk about listeners"
date: '2017-01-11 18:28:25 +0100'
date_gmt: '2017-01-11 17:28:25 +0100'
categories:
- Mobile
tags:
- mobile application
- mobile
- dev mobile
- Android
---
### Introduction

Hi Astronauts ! Today again, I will keep talking about native mobile development, et this time, it is about Android. As my previous article, this one is for beginners, si it means that we will spend a small amount of time to discover few technical terms together before going deep in the subject. If you did not read my last article Closures VS Delegates, I welcome you to do it, it is a prerequisite in order to understand this one. [Delegates VS Closures](https://blog.eleven-labs.com/en/delegates-closures/){:rel="nofollow noreferrer"}<br />
For those who don't know, in order to code for Android, you must use Java. So, for the code samples, it will be faster, because only one language to procude, one syntax et one file structure. The important notion in this article is: Listener.

**Listeners**

A listener is a reference to an object that we don't know the exact type, but important thing, it inherits an interface. Because this object inherits an interface, we then know that we can call the methods defined in the interface, even if we don"t know in detail the given object. I think that a proper exemple will help us to understand what I am talking about.<br/>
NB : The code I will provide is just a dummy implementation so that you are able to understand the principles I am talking about, it will not really do any HTTP call on the URL given as a parameter. Let's imagine that I need to do a GET, usually in the mobile development world, we like to handle this with 2 different callbacks for the return of the call. One is for the success case et the other one, is for the error case.<br/>
Our goal here is to produce a class that will do a GET on a given URL. I want to notify the object that launched this request, if it failed or succeed. In order to avoid a strong dependance, we will use the design pattern of the listener, thanks to that, I don't need to know the exact type of this object. We will then define an interface that will contain two methods :
- onRequestSuccess
- onRequestFailure

```Java
public interface RequesterListener {
    void onRequestSuccess();
    void onRequestFailure();
}
```

We will then inherit this interface in our Java class

```Java
public class MainActivity extends AppCompatActivity implements RequesterListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    public void onRequestSuccess() {

    }

    @Override
    public void onRequestFailure() {

    }
}
```

We then have our class MainActivity that inherits the RequesterListener interface and implements 2 methods (onRequestSuccess, onRequestFailure). We will make a dummy implementation to give you an idea of how it works :

```Java
public class RequestManager {

    private RequesterListener mListener;

    public void get(String uri) {
        //Do the call
        boolean requestSucceed = this.isSuccess();

        //After the call
        if (requestSucceed) {
            this.mListener.onRequestSuccess();
        } else {
            this.mListener.onRequestFailure();
        }
    }

    public void setListener(RequesterListener listener) {
        this.mListener = listener;
    }

    public  RequesterListener getListener() {
        return this.mListener;
    }

    private boolean isSuccess() {
        return true;
    }
}
```

The RequestManager is used to do the GET call on a give URL.

```Java
public class MainActivity extends AppCompatActivity implements RequesterListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        RequestManager manager = new RequestManager();
        manager.setListener(this);
        manager.get("http://plop.fr");
    }

    private void callWebService() {
        RequestManager manager = new RequestManager();
        manager.setListener(this);
        manager.get("http://plop.fr");
    }

    @Override
    public void onRequestSuccess() {

    }

    @Override
    public void onRequestFailure() {

    }
}
```

If now, I call the callWebService method, considering the dummy code that we produced, the result will be that we reach the onRequestSuccess method.

**Bu why do that?**

We have a light dependency between our different objects. Indeed, RequestManager has no idea idea of the type of object of its listener, all it cares about is to know that the delegate contains the two methods of the interface so that it is able to call them both. So, it's good, I was able to call my Webservice, I have my two callbacks where I can process what needs to be, everything seems good. Yes everything is good, it works fine and it will cover a lot of cases.

**Raised issue**

In the previous article, I told you about the case where you need to do many calls in the same class. Then you will tell me :
- There must be something equivalent from closurs on Android, like on iOS.
- Yes, there is one.
- So, give it to us then, instead of making us wait for it.
- Listeners
- What? What is he talking about? We just talked about it !!!
- Let me explain.

**Solution**

Actually, thanks to Java, you can instantiate an interface if you redefine the methods when you instanciate it. A small sample of code in order to show you ?

```Java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        RequestManager manager = new RequestManager();
        RequesterListener listener = new RequesterListener() {

            @Override
            public void onRequestSuccess() {

            }

            @Override
            public void onRequestFailure() {

            }
        };

        manager.setListener(listener);
        manager.get("http://plop.fr");
    }
}
```
### Conclusion

If now, I call the callWebService method, considering the dummy code that we produced, the result will be that we reach the onRequestSuccess method. So, it's pretty cool no? It covers 100% of cases and easily without having to change a lot, you can become listener by inheriting an interface or just define an instance of this one. Personnaly, when I discovered this, I told myself, how can it be ? It is just awesome ! I look for something equivalent for iOS, telling myself of course they thought about that... Big fail, I found nothing... Then by searching on internet, for a really specific need, I found a pretty elegant solution. But that, it will be covered in another article :) See you space cowboys !
