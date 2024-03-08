---
contentType: article
lang: en
date: '2020-01-08'
slug: think-outside-the-box
title: '[iOS] Let''s think outside the box'
excerpt: Let's use the Framework in a way that it's not supposed to be
oldCover: /assets/2018-05-21-let-s-think-outside-the-box/cover.jpg
categories: []
authors:
  - thuchon
keywords:
  - mobile
  - ios
  - json
  - http
  - behavior
---

## Introduction

Hi Astronauts,  I haven't written any article in a while, and today I decided to come back in style with a highly technical one, like we love them.

Warning though, for this one you'll need to be focused! Even if the overall idea is pretty simple, you'll see some pretty complex code and we will push the framework and use it in a tricky way, so that it will do things that it's not supposed to ;)

Don't you worry guys, I'll do my best to explain every step, and shell every piece of code.

It's been a while now since I have been working on projects in which features must be configurable.<br/>
Most of the time, I'm asked to develop it in a way that features can be enabled or disabled remotely.

We can take as an example a burger menu, where each entry represents a feature of the app, and we want to choose which ones are available.<br/>
It's not that difficult to do, and it's really helpful for the business.<br/>
Nevertheless, deep down, I always told myself, there is something missing, I want to push it further.<br/>
And so, this is why we're here today...

Today, I'll show you how to "drive" the behavior of an app from a remote JSON file stored on a server.<br/>
WTH?<br/>
But this guy is crazy, he spent too much time in space...<br/>

In order for the remainder of the article to be easier to understand, we will define a few keywords together so that you don't get lost in translation.<br/>
I will use a lot the word "module". A module can be defined as a gathering of features that can be reused easily and that can be developed outside of an app, we can take the **Pod** as an example.<br/>
The next word will be "action", when I say "action": "Do what I asked you" in my app, for the article being, it will be a console output, an opening of a webpage, that kind of stuff.<br/>
Now that we enlightened and defined the necessary words in order to understand clearly this article, I think it's time to move forward.<br/>

**How we will proceed:**

In order to produce what we want, we'll have to make 3 languages coexist:

- **JSON** for configuration
- **Objective-C** to reach a really deep level in the framework
- **Swift** for our app


## A little setup

Fasten your seat belt, this is where everything starts.

Our goal is to create an app that contains features, but does not have a behavior as a structure.<br/>
Each feature will be defined as a module, so separated code bases that live their own lives and available without any dependencies when it needs to be used.<br/>
Once we understand that, we must tell ourselves that what we want to develop will be in three different parts:

- The modules
- Our app
- The behavior of our app

I will explain soon each part on its own.

Our goal here is to develop an app that will be able -while running- to load some modules and make them execute some actions that they own, but without the sequence of those actions defined in the app code base.

We will then proceed in 3 steps:

- Get the list of modules and actions from the server
- Load those modules
- Execute the actions within the modules

### The modules

Here, we will define 3 modules and explain what they do:

First module
```Swift
import Foundation
@objc

class MyFirstModule: NSObject {

    func sayHello() {
        let name = String(describing: type(of: self))
        print("Hello My name is \(name)")
    }

    func sayGoodBye() {
        let name = String(describing: type(of: self))
        print("GoodBye My name was \(name)")
    }
}
```
This module is really simple, it contains two methods, **sayHello** and **sayGoodBye**. Those two methods will write on the console log the text defined within it.


Second module
```Swift
import Foundation
@objc

class MySecondModule: NSObject {

    func sayHello() {
        let name = String(describing: type(of: self))
        print("What's up? My name is \(name)")
    }

    func sayGoodBye() {
        let name = String(describing: type(of: self))
        print("See you, My name was \(name)")
    }
}
```
This module is a clone of the first one, the only difference is the text in the two methods.


Third module
```Swift
import UIKit

@objc
class MyThirdModule: NSObject {

    func openUrl(url: String) {
        let uri = URL(string: url)!
        UIApplication.shared.open(uri, options: [:], completionHandler: nil)
    }
}
```
This third module contains only one method, it will open a safari instance and go to an url that is given as a paremeter, easy stuff.

As you can see, the modules don't own any intelligence, they just do what we ask them to do.


### The app

Let's now focus on the app, the core of the project.<br/>
Indeed, as defined above, we will act in 3 steps:

- Get our modules from the server
- Load the modules
- Execute the actions from the modules

### Getting the modules

In order to retrieve the modules, we will use 2 libs:

- Alamofire for all network calls
- Gloss to transform from JSON to object

First of all, getting the JSON file hosted on the server.<br/>
Here, nothing fancy, we just do a GET call with the library Alamofire and then we transform this JSON into GenericProtocol (a class specially created by us in order to recover our data) with a little class made by me that I use in almost all my projects.

The class for transformation
```Swift
import Foundation
import Gloss

class BinderManager {

    static func readValue<T: Glossy>(json: JSON, type: T.Type) -> T? {
        if let result = T.init(json: json) {
            return result
        }
        return nil
    }

    static func readValue<T: Glossy>(json: [JSON], type: T.Type) -> [T]? {
        if let result = [T].from(jsonArray: json) {
            return result
        }
        return nil
    }
}
```
The GenericProtocol
```Swift
import Foundation
import Gloss

struct GenericAction: Glossy {
    var method: String?
    var value: String?

    init?(json: JSON) {
        self.method = "func" <~~ json
        self.value = "value" <~~ json
    }

    func toJSON() -> JSON? {
        return nil
    }
}

struct GenericProtocol: Glossy {

    var name: String?
    var realObject: AnyObject?
    var actions: [GenericAction]?

    init?(json: JSON) {
        self.name = "name" <~~ json

        if let programmingObject = ObjectCreator.create(self.name) {
            self.realObject = programmingObject as AnyObject
        }

        self.actions = "actions" <~~ json
    }

    func toJSON() -> JSON? {
        return nil
    }
}
```
As you can see, I use the Gloss library for the mapping (old habit).<br/>
Our GenericProtocol has a name, a list of actions,  and a realObject. I'll come back later on this realObject.<br/>
And then the transformation from JSON to an object after the HTTP call.<br/>

```Swift
func getModules() {
    let uri = "http://plop.fr/Protocols.json"
    let completionHandlerHttp : (DataResponse<Any>) -> Void = { response in
        switch response.result {
        case .success:
            if let jsonArray = response.value as? [JSON] {
                if let modules = BinderManager.readValue(json: jsonArray, type: GenericProtocol.self) {
                    self.useModules(modules: modules)
                }
            }
            break
        case .failure(let error):
            print(error)
            break
        }
    }

    Alamofire.request(uri, method: .get, headers: nil).validate().responseJSON(completionHandler: completionHandlerHttp)
}
```
Above, I told you about the realObject. But what is it?<br/>
Actually, this realObject is our module, we instantiate it and keep a reference on it, I got the inspiration from the function pointers in C for the idea.

Let's now move on to the loading/instanciation of our modules.

### The loading of our modules

The part of the code that we will focus on here is those 3 small lines.
```Swift
if let programmingObject = ObjectCreator.create(self.name) {
    self.realObject = programmingObject as AnyObject
}
```
It helps me instantiate my module based on its name.<br/>
At the beginning of the article, I mentionned ***Objective-C***, here we are.<br/>
I use Objective-C to access a really low level part of the framework in order to instantiate classes based on their names.<br/>
Here is the class that allows us to do this (because it's Objective-C, we need to separate in 2 files, the .h and the .m), then with a Bridging-Header so that the Objective-C code is visible from Swift.
```Objective-C

#import <Foundation/Foundation.h>

@interface ObjectCreator : NSObject

+ (id)create:(NSString *)className;

@end


#import "ObjectCreator.h"

@implementation ObjectCreator

+ (Class)create:(NSString *)className
{
    Class daClass = NSClassFromString(className);
    return [daClass new];
}

@end
```
So, if I sum up, we get our JSON from the HTTP call, transform this JSON into an object and instantiate some classes that contain some actions (our modules).<br/>
Ok, happy to know that, but how do we proceed to use those so called modules?<br/>
In the method **getModules**, we call another method **useModules**, let's check this one out.

### Execute the actions within the modules

First of all, I would like to apologize, this method is going to be hard to read.<br/>
I already hear you coming with your "but the cyclomatic complexity, it's impossible to read, how do you expect us to maintain this?!"<br/>
Guys, let's be serious, call some methods on runtime objects, come on, you already know deep down inside that it won't be that clean and it won't be just 2 lines.<br/>
I just ask you to trust me on this one, and I'll explain you the best I can what it does.<br/>

```Swift
func useModules(modules: [GenericProtocol]) {
    for module in modules {
        if let actions = module.actions {
            for action in actions {
                if let method = action.method {
                    let selector = NSSelectorFromString(method)
                    if let obj = module.realObject, obj.responds(to: selector) {
                        if let value = action.value {
                            _ = obj.perform(selector, with: value)
                        } else {
                            _ = obj.perform(selector)
                        }
                    }
                }
            }
        }
    }
}
```

Let's get ready to rumble!!! And explain this method line by line:

We loop on our modules' list.<br/>
We check that every module has a list of actions.<br/>
We loop on the list of actions of the module.<br/>
We check that the action has a method (remember that an action can have a method and a parameter).<br/>
We get the selector, it's the method signature.<br/>
We check that the realObject exists, that it has the selector.<br/>
If the action has a parameter then we execute this action with the parameter.<br/>
If the action does not have a parameter, we then just execute the action.<br/>

Wow, that was intense, but I think that was necessary in order that everyone understands everything.<br/>

So, now that's cool, we have an app that can have a behavior driven outside of it, but let's have a look on this behavior actually.<br/>
Let's move forward!

### The behavior of our app

```JSON
[
    {
        "name": "GenericProtocol.MyFirstModule",
        "actions": [
            {
                "func": "sayHello"
            },
            {
                "func": "showPopup"
            },
            {
                "func": "sayGoodBye"
            }
        ]
    },
    {
        "name": "GenericProtocol.MySecondModule",
        "actions": [
            {
                "func": "sayHello"
            }
            ,
            {
                "func": "showPlop"
            },
            {
                "func": "sayGoodBye"
            }
        ]
    },
    {
        "name": "GenericProtocol.MyThirdModule",
        "actions": [
            {
                "func": "openUrlWithUrl:",
                "value": "https://eleven-labs.com/"
            }
        ]
    }
]
```

It is just a JSON array that contains 3 objects (modules).<br/>
The field **name** is the name of the module, **actions** is the list of methods of the module (**func** being the name of each method and **value** the value of the parameter given to the method).<br/>
If you look closely, I especially added in the first two modules some actions that don't exist in the classes. I did that because we want our system to be reliable and be able to handle these kinds of cases.

### Let's take a small break

We coded our modules.<br/>
We developped an app that is able to load and use those modules.<br/>
We defined the behavior of our app.<br/>
What are the next steps?<br/>
The second to last step is to call our method **getModules** in **viewDidLoad**
```Swift
override func viewDidLoad() {
    super.viewDidLoad()
    getModules()
    // Do any additional setup after loading the view, typically from a nib.
}
```
And now, the last step.
Just test what we did :)


## It's time to run the APP

So everything is set up, we just have to run our app.
Our beautiful app runs and what's happening?

For what we can see in the simulator, our app launches, displays our dummy screen, then opens Safari and navigates to the website of **Eleven-Labs**.<br/>
Hum, that's funny, it reminds me of the action we defined in the third module.<br/><br/>
![AppVideo]({BASE_URL}/imgs/articles/2018-05-21-let-s-think-outside-the-box/appvideo.gif)<br/><br/>
If we know have a look at the log console, we can see some outpouts.<br/>
But those outputs, we are familiar with them, aren't they the ones defined in the two first modules?!<br/><br/>
![ConsoleOutput]({BASE_URL}/imgs/articles/2018-05-21-let-s-think-outside-the-box/console-output.png)<br/><br/>
I think that you start to understand, right?<br/>
All the actions that we defined in the **JSON** file, and that really exist in our modules are then executed.<br/>
Pretty cool isn't it? :)

## But why do all this?

You are probably asking yourself, but why do all this?<br/>
For many reasons.<br/>
The first one being, it's so much fun. You need to venture and try new things from time to time, push the language, push the framework or the tools you use on a daily basis.
Breaking the bones of an app can be really useful, to help you establish new architectures, see issues from different angles and to bring you solutions for some other projects in the future.

That's it, I hope that this article gave you the motivation to try new stuff, and that it'll help you to think "**Outside the box**".

I give you the link to download the project with everything already set up.<br/>
You just have to clone it, run a pod install and for the rest, you already know it.<br/>
[The Project](https://github.com/ettibo/GenericProtocols)

See you space cowboys :)
