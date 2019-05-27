---
layout: post
title: Delegates vs Closures
lang: en
permalink: /delegates-closures/
excerpt: "Delegates VS Closures"
authors:
    - thuchon
date: '2019-05-27 18:25:24 +0100'
date_gmt: '2019-05-27 17:25:24 +0100'
categories:
- Mobile
tags:
- mobile
- ios
- delegates
- block
- closure
---

## Introduction

Hi astronauts, today we're going to talk about mobile programming, and you know what? It's native development! This article will be for beginners, so we'll spend a bit of time to understand a few technical terms together before going deeper in the subject. This time we'll focus on iOS, but don't worry, I plan to do the equivalent for Android as soon as possible.

**Swift and Objective-C**

For those who don't know, in iOS, you can use two different programming languages: Objective-C and Swift. Everyone is more or less using Swift now, but because of legacy, you can still find some projects made with Objective-C. This is why in this article, every piece of code will be provided in Objective-C as well as in Swift. The two langages have two different syntaxes and in addition to that, even the file structure is different:
- In Objective-C you have a header (.h file) to declare all the accessible elements, then you will have an implementation file (.m file) that will contain the body of the methods, exactly like in C language.
- In Swift, you have only one file (.swift file) and the accessibility will be defined depending on "public" or "private".

**Protocol**

Just one last notion, and I promise, we're good to go.
In this article, I'll use a lot the term "Protocol": a protocol is an interface in the Apple world, when I say interface, I mean a class that you have to inherit in order to implement some methods. It's a keyword for both Swift and Objective-C.

**Delegates and Closures / Blocks**

In iOS development, you will often find 2 principles: ***delegates***, ***closures (Swift) / blocks (Objective-C)***

We will cover those two points more in detail, but before we go further it's important to know that they exist! Here are the basic principles to know! We're now done with the introduction, we can finally go deeper and have a proper look!

### Delegates

A delegate is a reference to an object that we don't know the exact type of. Important thing though, it inherits a protocol. Because this object inherits a protocol, we then know that we can call the methods defined in the protocol, even if we don't know in detail the given object. I think that a proper example will help you to figure out what I'm talking about.  

NB: The code I'll provide is just a dummy implementation so that you're able to understand the principles of which I'm talking about, it will not really do any HTTP call on the URL given as a parameter.  

Let's imagine that I need to do a GET. Usually, in the mobile development world, we like to handle this with 2 different callbacks for the return of the call. One is for the success case and the other one is for the error case. Our goal here is to produce a class that will do a GET on a given URL. I want to notify the object that launched this request, if it failed or succeed.  

In order to avoid a strong dependance, we will use the design pattern of the delegate. Thanks to that, I don't need to know the exact type of this object. We'll then define a protocol that will contain two methods: onRequestSuccess onRequestFailure. Let's have a look at what it will look like:

#### Objective-C

```Objective-C
@protocol RequesterDelegateObjc 

- (void)onRequestSuccess;
- (void)onRequestFailure;

@end
```

We inherit it in the header file (.h)

```Objective-C
@interface MyClassObjC : UIViewController <RequesterDelegateObjc> 

@end
```

Then we implement the methods in our class like this:

```Objective-C
#import "MyClass.h"

@implementation MyClassObjC

- (void)onRequestFailure {

}

- (void)onRequestSuccess {

}

@end
```

#### Swift

```Swift
protocol RequesterDelegateSwift {
    func onRequestFailure()
    func onRequestSuccess()
}
```

```Swift
class MyClassSwift: UIViewController, RequesterDelegateSwift {

    func onRequestFailure() {

    }

    func onRequestSuccess() {
    }
}
```

So, we have our Class MyClass that inherits the Protocol RequesterDelegate and that implements 2 methods (onRequestSuccess, onRequestFailure). We're going to do a dummy implementation so that you have an idea of how this works: 

#### Objective-C

```Objective-C
#import "MyClass.h"
#import "RequestManager.h"

@implementation MyClassObjC

- (void)callWebService {
    RequestManager* manager = [[RequestManager alloc] init];
    manager.delegate = self;
    [manager get:@"http://plop.fr/json"];
}

- (void)onRequestFailure {

}

- (void)onRequestSuccess {

}

@end
```

```Objective-C
@interface RequestManager : NSObject
{

}

@property (nonatomic, weak) id delegate;

- (void)get:(NSString*)url;
```

```Objective-C
#import "RequestManager.h"

@implementation RequestManager

- (void)get:(NSString *)url {
    //Do the call
    BOOL requestSucceed = [self isSuccess];

    //After the call
    if (requestSucceed) {
        [self.delegate onRequestSuccess];
    } else {
        [self.delegate onRequestFailure];
    }
}

- (BOOL)isSuccess {
    return YES;
}

@end
```

#### Swift

```Swift
class MyClassSwift: UIViewController, RequesterDelegateSwift {

    func callWebService() {
        let manager: RequestManager = RequestManager()
        manager.delegate = self
        manager.get(url: "http://plop.fr/json")
    }

    func onRequestFailure() {

    }

    func onRequestSuccess() {
    }
}
```

```Swift
class RequestManager {

    var delegate: RequesterDelegateSwift?

    func get(url: String) {
        //Do the call
        let requestSucceed: Bool = self.isSuccess()

        //After the call
        if requestSucceed {
            self.delegate?.onRequestSuccess()
        } else {
            self.delegate?.onRequestFailure()
        }
    }

    private func isSuccess() -> Bool {
        return true
    }
}
```

**But why do all this?**

We have a light dependency between our different objects. Indeed, RequestManager has no idea of the type of the object of its delegate, all that it cares about is to know that the object contains the two methods defined in the protocol in order to be able to call them. So, It's fine, I was able to call my webservice, I have my callback methods in which I can handle the different cases, everything seems good to me. Yes, everything is well, it works fine and it will cover a lot of cases.

**Raised Issue**

- But now, if we need to call many webservices in only one class, how do we do?
- How do we do? You just showed us how to do it.
- The issue is that by doing it this way, all the returns of your webservices will go in the methods onRequestSuccess and onRequestFailure.
- Ha, but you are right, it raises an issue...

**Solution**

In order to solve this issue, there is still the possibility to change a bit the method, add a unique id when we launch the request and receive it when the request is done and they identify to which request it belongs to. Yes it's true, we can do that, but it will quickly become "verbose" and not so easy to handle. One thing I like to do when I program is to avoid strong dependency (Yes, the delegate already helps with that), but even more, I like when I can move some code really easily.  

But here, If I want to move my code, I need to re-implement the protocol in another class.
- Maybe there is something easier right?
- But guys, at the beginning, didn't he talk about block or closure?
- What are those things?

### Closures / Blocks

It's really easy, the term "Block" will be used in Objective-C and "Closure" in swift, it really is an anonymous function. For those who are coming from web and who develop in JS, it should ring a bell. Let's have a look? We are going to add one method in both classes that will allow us to use blocks/closures.

#### Objective-C

```Objective-C
typedef void (^successBlock)();
typedef void (^failureBlock)();

- (void)callWebServiceWithBlocks {
    RequestManager* manager = [[RequestManager alloc] init];
    successBlock success = ^void() {

    };

    failureBlock failure = ^void() {

    };
    [manager get:@"http://plop.fr/json" success:success failure:failure];
}
```

```Objective-C
- (void)get:(NSString *)url success:(successBlock)successBlock failure:(failureBlock)failureBlock {
    //Do the call
    BOOL requestSucceed = [self isSuccess];

    //After the call
    if (requestSucceed) {
        successBlock();
    } else {
        failureBlock();
    }
}
```

#### Swift

```Swift
func callWebServiceWithClosure() {
    let manager: RequestManager = RequestManager()

    let success: () -> Void = {

    }

    let failure: () -> Void = {

    }

    manager.get(url: "http://plop.fr/json", successClosure: success, failureClosure: failure)
}
```

```Swift
func get(url: String, successClosure: () -> Void, failureClosure: () -> Void) {
    //Do the call
    let requestSucceed: Bool = self.isSuccess()

    //After the call
    if requestSucceed {
       successClosure()
     } else {
       failureClosure()
    }
}
```

## Conclusion

So, like before, we just need to call the method callWebServiceWithClosure and we have a callback for the success case and one for the error case. You're going to ask me, what is the advantage? Easy, you just don't need to inherit from an interface anymore, you maybe don't realise it yet, but it really gets easier. For the understanding also, it's easier, you see straight above the different handlings you have instead of having to look in the code in order to find how the callback handles the return of the call.  

And as I said earlier, if you have many webservices to call, you can easily isolate the code for every single one of them. The goal here is just to present you both principles, if you already are a mobile developer, it's probably something you encountered more than once. But, just a question, wouldn't it be cool to be able to merge the delegates with the blocks/closures? Hum, it seems like an interesting topic right? Let's do that together in the future in a new article? See you space cowboys :)
