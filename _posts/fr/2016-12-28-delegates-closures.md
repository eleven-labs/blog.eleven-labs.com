---
lang: fr
date: '2016-12-28'
slug: delegates-closures
title: Delegates vs Closures
excerpt: Delegates VS Closures
authors:
  - thuchon
categories: []
keywords:
  - mobile
  - ios
  - delegates
  - block
  - closure
---

### Introduction

Salut les Astronautes, aujourd'hui on va parler un peu de mobile, et qui plus est de NATIF !!! Cet article se veut accessible pour les néophytes, donc on va passer un petit peu de temps pour voir quelques termes techniques ensemble avant de rentrer dans le vif du sujet. On va se concentrer sur iOS pour cette fois-ci, mais ne vous en faites pas, j'ai prévu de faire l'équivalent sur Android dans très peu de temps.

**Le Swift et l'objective-C**

Pour ceux qui ne savent pas, sur iOS, on peut utiliser deux langages de programmation : l'Objective-C et le Swift. Tout le monde est plus ou moins en train de passer au Swift, mais historiquement, il y a encore beaucoup de projets codés en Objective-C. C'est pourquoi dans cet article, chaque morceau de code que je vais produire sera disponible en Objective-C comme en Swift. Outre le fait que les deux langages n'aient pas la même syntaxe, la structure des fichiers change aussi :
- en Objective-C on va avoir un header (fichier .h) pour tout ce qui est déclaration d'éléments accessibles, puis un fichier d'implémentation (fichier .m) qui va contenir le corps des méthodes, exactement comme en C.
- en Swift, on va avoir un seul et même fichier (fichier .swift) et l'accessibilité sera définie selon "public" ou "private".

**Le Protocol**

Encore une petite notion et promis, on est partis.
Dans cet article je vais beaucoup vous parler de Protocol : un protocol c'est une interface dans le monde Apple, quand je dis interface, je parle de classe que l'on doit hériter pour implémenter certaines méthodes. C'est un mot clef en Swift comme en Objective-C.

**Les Delegates et les Closures / Blocks**

Dans le développement iOS, vous allez souvent retrouver deux principes : ***les delegates***, ***les closures (Swift) / blocks (Objective-C)***

Nous allons couvrir ces deux points plus en détails, mais avant même de se lancer c'est important de savoir qu'ils existent ! Voilà les principes de base à connaître ! C'est fini pour l'intro, on va pouvoir rentrer dans les détails !

#### Les Delegates

Un delegate est une référence vers un objet dont on ignore le type exact, mais, chose importante, il hérite d'un protocol. Comme cet objet hérite d'un protocol, on sait que l'on peut appeler les méthodes définies dans le protocol, même si l'on ne connait pas l'objet qu'il y a en face. Je pense qu'une petite mise en situation pourra nous aider là-dessus.<br/>
N.B. : Le code que je vais vous fournir est juste une dummy implementation pour que vous compreniez les principes, il ne fera pas de vrai appel HTTP sur l'adresse donnée en paramètres. Imaginons que j'ai un appel GET à faire, de manière générale dans le monde du mobile, on aime bien gérer ça avec 2 callbacks pour le retour. Une en cas de succès et une en cas d'erreur. Notre but ici est de réaliser une classe qui fait un GET sur une URL donnée. Je veux prévenir l'objet qui a été l'instigateur de cette requête si elle a réussi ou non. Pour éviter un couplage fort, on va utiliser le principe du delegate, grâce à ça, je n'aurai pas à connaitre le type exact de cet objet. On va donc définir un protocol qui va contenir deux méthodes: onRequestSuccess onRequestFailure regardons à quoi cela va ressembler :

##### Objective-C

```Objective-C
@protocol RequesterDelegateObjc

- (void)onRequestSuccess;
- (void)onRequestFailure;

@end
```

On va l'hériter dans le ficher .h

```Objective-C
@interface MyClassObjC : UIViewController <RequesterDelegateObjc>

@end
```

Puis on va implémenter les méthodes dans notre classe de cette manière :

```Objective-C
#import "MyClass.h"

@implementation MyClassObjC

- (void)onRequestFailure {

}

- (void)onRequestSuccess {

}

@end
```

##### Swift

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

On a donc notre Class MyClass qui hérite du protocol RequesterDelegate et qui implémente 2 méthodes (onRequestSuccess, onRequestFailure). On va faire une dummy implementation pour vous donner une idée de comment ça fonctionne :

##### Objective-C

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

##### Swift

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

Si maintenant j'appelle la méthode callWebService, vu le dummy code que l'on a fait, le résultat sera un passage dans la méthode onRequestSuccess.

**Mais pourquoi faire tout ça?**

On a un couplage light entre nos différents objets. En effet, RequestManager n'a aucune idée du type de l'objet de son delegate, tout ce qui l'intéresse c'est de savoir qu'il contient les deux méthodes du protocol pour pouvoir les appeler. Donc, c'est bien, j'ai pu appeler mon Webservice, j'ai mes méthodes de retour dans lesquelles je peux faire mes traitements, tout me semble bon. Oui, tout est bon, ça fonctionne bien et ça couvrira beaucoup de cas.

**Problème soulevé**

- Mais maintenant, si jamais on a besoin d'appeler plusieurs Webservices dans une seule et même classe, comment on fait?
- Comment ça comment on fait? Tu viens de nous montrer tout ça.
- Le soucis c'est qu'avec cette méthode tous vos retours de Webservices vont passer dans vos méthodes onRequestSuccess et onRequestFailure.
- Ah, mais c'est problématique en fait...

**Solution**

Pour palier à ce problème, il y a toujours la solution de changer un peu les méthodes, de passer un id unique quand on fait la requête et de le recevoir dans les méthodes du delegate pour identifier à quel appel sur quel Webservice ça correspond. C'est vrai, on peut faire ça, mais ça peut vite devenir verbeux et pas évident à gérer. Un truc que j'aime bien faire en programmation, c'est éviter le couplage fort (ok, le delegate aide à ça), et surtout j'aime bien quand je peux déplacer du code facilement. Or là, si je veux déplacer mon code, je dois ré-implémenter le protocol dans une autre classe.
- Y'a peut-être une autre solution non?
- Eh mais il avait pas parlé de block ou closure au début?
- C'est quoi ces trucs?

#### Les Closures / Blocks

Tout simplement, on va plus utiliser le terme block en Objective-C et closure en Swift, il s'agit en fait d'une fonction anonyme. Pour ceux qui viennent du web et qui ont fait du JS, ça doit pas mal leur parler. On jette un coup d'oeil ? On va rajouter une méthode dans chaque classe qui va nous permettre d'utiliser des blocks/closures.

##### Objective-C

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

##### Swift

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

#### Conclusion

Du coup, comme avant, on a juste à appeler la méthode callWebServiceWithClosure et on a une callback de retour pour le succès et une pour l'erreur. Vous me allez me demander, quel est l'avantage ? Tout simplement, de base vous n'êtes plus obligé d'hériter d'une interface, ça ne parait pas, mais comme ça, au bout d'un moment, c'est plus simple. Pour la compréhension aussi, c'est plus clair/facile, on voit directement les traitements qui sont fait juste au dessus du call, plutôt que de devoir chercher dans le code pour trouver où le retour est géré. Et comme dit plus haut, si vous avez plusieurs Webservices à appeler, vous êtes capable de bien isoler le code à chaque fois. Le but ici, c'est juste de vous présenter les deux principes, si vous faites du mobile, c'est une problématique que vous avez déjà dû rencontrer plus d'une fois. Mais du coup, ce serait pas cool de pouvoir combiner les deux, Delegates avec block ou closure ? Hum, mais ça devient intéressant. On se fait ça ensemble lors d'un prochain article ? Allez, salut les astronautes :)
