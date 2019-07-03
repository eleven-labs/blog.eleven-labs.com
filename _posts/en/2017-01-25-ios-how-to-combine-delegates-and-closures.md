---
layout: post
title: "[iOS] How to combine Delegates and Closures"
authors:
    - thuchon
lang: en
permalink: /ios-how-to-combine-delegates-and-closures/
excerpt: "Let's make Delegates and Closures work together"
date: '2017-01-25 14:30:42 +0100'
date_gmt: '2017-01-25 13:30:42 +0100'
categories:
    - Mobile
tags:
    - ios
    - delegates
    - closure
---

### Introduction

Hi Astronauts, today we will keep talking about mobile development, and as always native style.

This article is following up with the 2 previous ones, and it's mandatory that you read them before in order to understand what's going on in this one:

[Delegates VS Closures](https://blog.eleven-labs.com/en/delegates-closures/){:rel="nofollow noreferrer"}

[Let's talk about listeners](https://blog.eleven-labs.com/en/android-listeners/){:rel="nofollow noreferrer"}


If you have already read the 2 previous articles, I guess you already have an idea about what this one is about.
- Yes we already know, so please hurry up, we want to know how we can make something as sexy as the listeners but on iOS this time.
- Ok, just a bit of technical chit-chat before, and then were are ready to go.

**How are we going to proceed?:**

As in the first article, so that everyone is happy I will provide some DUMMY code for both Objective-C and Swift.

As you may know in the iOS universe, we can use both Delegates and Closures. Usually closure is used for more flexibility and it is also easier to implement. However, in some cases, graphic components for example are just made to work with a delegate or a datasource. Right now I'm thinking about 2 components: UITableView and UICollectionView.

With those 2 components, you cannot use block/closure, and you have to use a good old delegate. Usually it's not really a big issue and you can just work like that. But let's say that you have to work with many of those components on a single screen, in this case the code can start to be really messy. You'll find yourself with some huge classes, and it really starts to be difficult to produce some beautiful and elegant code. What I would like to show you today is a solution, that, in my opinion, is pretty clean, and easy to put in place.

### A little setup

As in the two previous articles, we will proceed with a GET call on a URL and build a system that will notify us in case of both success and error. We will go a little bit faster than in the first article, because those are notions that you are already suppose to master.

It's time to talk about code!

Our goal is is to realize a class that performs a GET call on URL. I want to notify the object that launched this request if it failed or succeed. To avoid strong dependencies, we will use the delegate pattern, thanks to this I don't need to know the exact type of the object.

Let's do this in 3 steps:

- Write the protocol
- Write the blocks/closures
- Write a class that will inherits from the protocol and that contains our 2 blocks/closures as attributes.

##### Objective-C

```Objective-C
typedef void (^successBlock)();
typedef void (^failureBlock)();

@protocol RequestManagerObjCDelegate

- (void)onRequestSuccess;
- (void)onRequestFailure;

@end

@interface RequestManagerObjCDelegateImplementation : NSObject
{

}

@property (weak, nonatomic) successBlock success;
@property (weak, nonatomic) failureBlock failure;

@end

@interface RequestManagerObjC : NSObject

- (void)get:(NSString*)url;

@property (nonatomic, weak) id delegate;

@end
```

We will now implement the class that will inherit from the protocol. It will contain the 2 methods **onRequestSuccess** and **onRequestFailure** and each of it will call the dedicated block/closure.

```Objective-C
@implementation RequestManagerObjCDelegateImplementation

- (void)onRequestSuccess {
    self.success();
}

- (void)onRequestFailure {
    self.failure();
}

@end
```

Then, we code the class **RequestManager** that you are familiar with.

```Objective-C
@implementation RequestManagerObjC

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

Then, we code the method to call our webservice.

```Objective-C
- (void)callWebService {

    RequestManagerObjC* manager = [[RequestManagerObjC alloc] init];

    successBlock success = ^void() {

    };

    failureBlock failure = ^void() {

    };

    RequestManagerObjCDelegateImplementation* delegate = [[RequestManagerObjCDelegateImplementation alloc] init];
    delegate.success = success;
    delegate.failure = failure;

    manager.delegate = delegate;
    [manager get: @"http://plop.fr"];
}
```

We will have a look altogether of what we just coded.
- We instantiated our **Manager**, that will call the webservice
- We defined our two **blocks/closures**
- We instantiated our **Delegate**
- We assigned our two **blocks/closures**
- We assigned the **Delegate** to the **Manager**
- We call the webservice

Here is the Swift code for the most excited ones

##### Swift

```Swift
protocol RequesterDelegateSwift {
    func onRequestSuccess()
    func onRequestFailure()
}

class RequesterDelegateSwiftImplementation:  RequesterDelegateSwift {
    var requestSuccess: ((Void) -> Void)?
    var requestFailure: ((Void) -> Void)?

    func onRequestSuccess() {
        if let successClosure = self.requestSuccess {
            successClosure()
        }
    }

    func onRequestFailure() {
        if let failureClosure = self.requestFailure {
            failureClosure()
        }
    }
}

class RequestManagerSwift {

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

func callWebService() {

    let manager: RequestManagerSwift = RequestManagerSwift()
    let requesterDelegate: RequesterDelegateSwiftImplementation = RequesterDelegateSwiftImplementation()
    requesterDelegate.requestSuccess = {

     }

     requesterDelegate.requestFailure = {

     }

     manager.delegate = requesterDelegate
     manager.get(url: "http://plop.fr")
 }
```

Now, if I call the method callWebService, considering the dummy code we produced, the result will be a call to the block/closure requestSuccess.

**But why do we bother to do all this?**

Indeed, why do all this, especially in our case, we could just have used a **Delegate** or **Blocks/Closures**, as we did in the first article. This adds a lot of complexity in the code, and it looks like we are doing the same things twice...
As I told you at the beginning of the article, this solution comes for a specific case. To make a **Delegate** more flexible when you have no other choice that to use this pattern.

**Issues**

- If the **Protocol** contains a lot of methods, then we need to re-implement a lot.
- We also must define all **blocks/closures** related.
- We need to redefine the **blocks/closures** for every call.

**Benefits**

- More flexible delegates
- Clean code
- Reduced methods
- Thinner handling for the the callbacks of the **Delegate**

### Conclusion

This solution is not perfect, but still is quite elegant and is not too heavy to implement.
Then, I'll let you test it and give me some feedback in the comments section.

See you space cowboys :)
