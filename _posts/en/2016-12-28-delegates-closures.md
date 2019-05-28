---
layout: post
title: Delegates vs Closures
lang: fr
permalink: /fr/delegates-closures/
excerpt: "Delegates VS Closures"
authors:
    - thuchon
date: '2016-12-28 18:25:24 +0100'
date_gmt: '2016-12-28 17:25:24 +0100'
categories:
- Mobile
tags:
- mobile
- ios
- delegates
- block
- closure
---

#### Introduction

Salut les Astronautes, aujourd'hui on va parler un peu de mobile, et qui plus est de NATIF !!! Cet article se veut accessible pour les néophytes, donc on va passer un petit peu de temps pour voir quelques termes techniques ensemble avant de rentrer dans le vif du sujet. On va se concentrer sur iOS pour cette fois-ci, mais ne vous en faites pas, j'ai prévu de faire l'équivalent sur Android dans très peu de temps. **Le Swift et l'objective-C** Pour ceux qui ne savent pas, sur iOS, on peut utiliser deux langages de programmation : l'Objective-C et le Swift. Tout le monde est plus ou moins en train de passer au Swift, mais historiquement, il y a encore beaucoup de projets codés en Objective-C. C'est pourquoi dans cet article, chaque morceau de code que je vais produire sera disponible en Objective-C comme en Swift. Outre le fait que les deux langages n'aient pas la même syntaxe, la structure des fichiers change aussi : -en Objective-C on va avoir un header (fichier .h) pour tout ce qui est déclaration d'éléments accessibles, puis un fichier d'implémentation (fichier .m) qui va contenir le corps des méthodes, exactement comme en C. -en Swift, on va avoir un seul et même fichier (fichier .swift) et l'accessibilité sera définie selon "public" ou "private". **Le Protocol** Encore une petite notion et promis, on est partis. Dans cet article je vais beaucoup vous parler de Protocol : un protocol c'est une interface dans le monde Apple, quand je dis interface, je parle de classe que l'on doit hériter pour implémenter certaines méthodes. C'est un mot clef en Swift comme en Objective-C. **Les Delegates et les Closures / Blocks** Dans le développement iOS, vous allez souvent retrouver 2 principes : -les delegates -les closures (Swift) / blocks (Objective-C) Nous allons couvrir ces deux points plus en détails, mais avant même de se lancer c'est important de savoir qu'ils existent ! Voilà les principes de bases à connaître ! C'est fini pour l'intro, on va pouvoir rentrer dans les détails !

Hi Astronauts, today we are going to talk about mobile programming, et you know what it's native development !!! This article will be for beginners, so we will spend a bit of time to understand few technical terms together before going deep in the subject. This time we will focus on iOS, but don't worry, I plan to do the equivalent for Android as soon as possible. **Swift and Objective-C** For those who don't know, on iOS, you can use two different programming languages : Objective-C and Swift. Everyone is more or less using Swift now, but because of legacy, you can still find some projects made with Objective-C. This is why in this article, every piece of code will be provided as well in Objective-C as in Swift. The two langages have two different syntaxes and in addition to that, even the file structure is different: -in Objective-C you have an header (.h file) to declare all the accesible elements, then you will have an implementation file (.m file) that will contain the body of the methods, exactly like in C language.
- in Swift, you have only one file (.swift file) et the accessibilty will be defined depending on "public" or "private". **The Protocol** Just one last notion, and I promise, we are good to go. In this article, I will use a lot the term: "Protocol" : a protocol is an interface in the Apple world, when I say interface, I mean a class that you have to inherits in order to implement some methods. It's a keyword for both Swift and Objective-C. **Delegates and Closures / Blocks** Un iOS developpment, you will often find 2 principles: -delegates -closures (Swift) / blocks (Objective-C) We will cover those two points more in detail, but before we go further it is immportant to know that exist ! Here are the basic principles to know ! Were are now done with the introduction, we can finally go deep and have a proper look !

#### Delegates

Un delegate est une référence vers un objet dont on ignore le type exact, mais, chose importante, il hérite d'un protocol. Comme cet objet hérite d'un protocol, on sait que l'on peut appeler les méthodes définies dans le protocol, même si l'on ne connait pas l'objet qu'il y a en face. Je pense qu'une petite mise en situation pourra nous aider là-dessus. N.B. : Le code que je vais vous fournir est juste une dummy implementation pour que vous compreniez les principes, il ne fera pas de vrai appel HTTP sur l'adresse donnée en paramètres. Imaginons que j'ai un appel GET à faire, de manière générale dans le monde du mobile, on aime bien gérer ça avec 2 callbacks pour le retour. Une en cas de succès et une en cas d'erreur. Notre but ici est de réaliser une classe qui fait un GET sur une URL donnée. Je veux prévenir l'objet qui a été l'instigateur de cette requête si elle a réussi ou non. Pour éviter un couplage fort, on va utiliser le principe du delegate, grâce à ça, je n'aurai pas à connaitre le type exact de cet objet. On va donc définir un protocol qui va contenir deux méthodes: onRequestSuccess onRequestFailure -Objective-C Notre protocol va ressembler à ça :

A delegate is a reference to an object that we don't know the exact type, but important thing, it inherits a protocol. Because this object inherits a protocol, we then know that we can call the methods defined in the protocol, even if we don"t know in detail the given object. I think that a proper exemple will help us to understand what I am talking about. NB : The code I will provide is just a dummy implementation so that you are able to understand the principles I am talking about, it will not really do any HTTP call on the URL given as a paremeter. Let's imagine that I need to do a GET, usually in the mobile development world, we like to handle this with 2 different callbacks for the return of the call. One is for the success case et the other one, is for the error case. Our goal here is to produce a class that will do a GET on a given URL. I want to notify the object that launched this request, if it failed or succeed. In order to avoid a strong dependance, we will use the design pattern of the delegate, thanks to that, I don't need to know the exact type of this object. We will then define a protocol that will contain two methods: onRequestSuccess onRequestFailure -Objective-C Out protocol will look like this :

```Objective-C
@protocol RequesterDelegateObjc 

- (void)onRequestSuccess;
- (void)onRequestFailure;

@end
```

On va l'hériter dans le ficher .h

We inherit it in the header file (.h)

```Objective-C
@interface MyClassObjC : UIViewController <RequesterDelegateObjc> 

@end
```

Puis on va implémenter les méthodes dans notre classe de cette manière :

Then we implement the methods in our class like this :

```Objective-C
#import "MyClass.h"

@implementation MyClassObjC

- (void)onRequestFailure {

}

- (void)onRequestSuccess {

}

@end
```

-Swift Le delegate
-Swift The delegate

```Swift
protocol RequesterDelegateSwift {
    func onRequestFailure()
    func onRequestSuccess()
}
```

##### L'implémentation dans notre classe
##### Class implementation

```Swift
class MyClassSwift: UIViewController, RequesterDelegateSwift {

    func onRequestFailure() {

    }

    func onRequestSuccess() {
    }
}
```

On a donc notre Class MyClass qui hérite du protocol RequesterDelegate et qui implémente 2 méthodes (onRequestSuccess, onRequestFailure). On va faire une dummy implementation pour vous donner une idée de comment ça fonctionne :

So, we have our Class MyClass that inherits the Protocol RequesterDelegate and that implements 2 methods (onRequestSuccess, onRequestFailure). We are going to do a dummy implementation so that you have an idea of how this works : 

##### -Objective-C

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

##### -Swift

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

Si maintenant j'appelle la méthode callWebService, vu le dummy code que l'on a fait, le résultat sera un passage dans la méthode onRequestSuccess. **Mais pourquoi faire tout ça?** On a un couplage light entre nos différents objets. En effet, RequestManager n'a aucune idée du type de l'objet de son delegate, tout ce qui l'intéresse c'est de savoir qu'il contient les deux méthodes du protocol pour pouvoir les appeler. Donc, c'est bien, j'ai pu appeler mon Webservice, j'ai mes méthodes de retour dans lesquels je peux faire mes traitements, tout me semble bon. Oui, tout est bon, ça fonctionne bien et ça couvrira beaucoup de cas. **Problème soulevé** - Mais maintenant, si jamais on a besoin d'appeler plusieurs Webservices dans une seule et même classe, comment on fait? - Comment ça comment on fait? Tu viens de nous montrer tout ça. - Le soucis c'est qu'avec cette méthode tous vos retours de Webservices vont passer dans vos méthodes onRequestSuccess et onRequestFailure. - Ah, mais c'est problématique en fait... **Solution** Pour palier à ce problème, il y a toujours la solution de changer un peu les méthodes, de passer un id unique quand on fait la requête et de le recevoir dans les méthodes du delegate pour identifier à quel appel sur quel Webservice ça correspond. C'est vrai, on peut faire ça, mais ça peut vite devenir verbeux et pas évident à gérer. Un truc que j'aime bien faire en programmation, c'est éviter le couplage fort (ok, le delegate aide à ça), et surtout j'aime bien quand je peux déplacer du code facilement. Or là, si je veux déplacer mon code, je dois ré-implémenter le protocol dans une autre classe. - Y'a peut-être une autre solution non? - Eh mais il avait pas parlé de block ou closure au début? - C'est quoi ces trucs?

So, If now I call the method callWebService, considering the dummy code we produced, the result will be that we reach the method onRequestSuccess. **But why do all this?** We have a light dependency between our different objects. Indeed, RequestManager has no idea of the type of the object of its delegate, all that it cares about is to know that the object contains the two methods defined in the protocol in order to be able to call them. So, It's good, I was able to call my webservice, I have my callback methods in which I can handle the different cases, everything seems good to me. Yes, everything is good, it works well and it will cover a lot of cases. **Raised Issue** - But now, if we need to call many webservices in only one class, how do we do? - How do we do? You just showed us how to do it. - The issue is that by doing it this way, all the returns of your webservices will go in the your methods onRequestSuccess and onRequestFailure. - Ha, but you are right, it raises an isue... **Solution** In order to solve this issue, there is still the possibility to change a bit the method, add a unique id when we launch the request and to receive it when the request is done and they identify to which request it belongs to. Yes it is true, we can do that, but it will fast become "verbose" and not so easy to handle. One thing I like to do when I program is to avoid strong dependency (Yes, the delegate already helps for that), but even more, I like when I can move some code really easily. But here, If I want to move my code, I need to re-implement the protocol in one other class. - Maye there is something easier right? - But dude, at the beginning, didn't you talk about block or closure? - What are those things?

#### Closures / Blocks

Tout simplement, on va plus utiliser le terme block en Objective-C et closure en Swift, il s'agit en fait d'une fonction anonyme. Pour ceux qui viennent du web et qui ont fait du JS, ça doit pas mal leur parler. On jette un coup d'oeil ? On va rajouter une méthode dans chaque classe qui va nous permettre d'utiliser des blocks/closures.

It is really easy, the term "Block" will be use in Objective-C and "Closure" in swift, it really is an anonymous function. For those who are coming from web and that develop in JS, it should ring a bell. Let's have a look ? We are going to add one method in both class that will allow us to use blocks/closures.

##### -Objective-C

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

##### -Swift

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

Du coup, comme avant, on a juste à appeler la méthode callWebServiceWithClosure et on a une callback de retour pour le succès et une pour l'erreur. Vous me allez me demander, quel est l'avantage ? Tout simplement, de base vous n'êtes plus obligé d'hériter d'une interface, ça ne parait pas, mais comme ça, au bout d'un moment, c'est plus simple. Pour la compréhension aussi, c'est plus clair/facile, on voit directement les traitements qui sont fait juste au dessus du call, plutôt que de devoir chercher dans le code pour trouver où le retour est géré. Et comme dit plus haut, si vous avez plusieurs Webservices à appeler, vous êtes capable de bien isoler le code à chaque fois. Le but ici, c'est juste de vous présenter les deux principes, si vous faites du mobile, c'est une problématique que vous avez déjà dû rencontrer plus d'une fois. Mais du coup, ce serait pas cool de pouvoir combiner les deux, Delegates avec block ou closure ? Hum, mais ça devient intéressant. On se fait ça ensemble lors d'un prochain article ? Allez, salut les astronautes :)

So, as before, we just need to call the method callWebServiceWithClosure et we have a callback for the success case and one for the error case. You are going to ask me, what is the advantage ? Easy, you just don't need to inherit from an interface anymore, you maybe don't realise it yet, but it really get easier. For the understanding also, it's easier, you see straight above the different handlings you have instead of having to look in the code in order to find how the callback handle the return of the call. And as I said earlier, if you have many webservices to call, you can easily isolate the code for every single one of them. The goal here is just to present you both principles, if you already are a mobile developper, it is probably something you encountered more than once. But, just a question, wouldn't it be cool to be able to merge the delegates with the blocks/closures? Hum, it seems like an interesting topic right ? Let's do that together in the futur in a new article ? See you space cowboys :)