---
layout: post
title: "[iOS] Comment coupler les delegates et les closures ?"
authors:
    - thuchon
lang: fr
permalink: /ios-comment-coupler-les-delegates-les-closures/
excerpt: "Faisons collaborer les delegates et les closures"
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

Salut les Astronautes, aujourd'hui on va continuer dans notre lancée sur le mobile, toujours en NATIF.

Cet article s'inscrit dans la lignée des 2 précédents, et il est impératif de les avoir lu pour comprendre ce dont il s'agit ici :

[Delegates VS Closures](https://blog.eleven-labs.com/fr/delegates-closures/){:rel="nofollow noreferrer"}

[Pourquoi j'aime les listeners](https://blog.eleven-labs.com/fr/android-listeners/){:rel="nofollow noreferrer"}

Si vous avez lu les 2 précédents articles, vous devez vous douter de ce dont celui-ci va parler.
- Mais oui on sait, allez dépêche-toi là, on veut savoir comment faire un truc aussi sexy que les listeners mais sur iOS cette fois-ci.
- Ok, juste encore un petit peu de blabla technique et on se lance.

**Comment ça va se passer :**

Bon comme le premier article, pour que tout le monde soit heureux, je vais vous produire du DUMMY code en Objective-C comme en Swift.

Dans le monde du développement iOS, comme vous avez pu le comprendre, on peut utiliser les delegates ou bien les closures. En général, on va utiliser la closure pour plus de flexibilité et c'est aussi plus simple à mettre en place. Cependant, dans certains cas, des composants graphiques par exemple sont juste utilisables via un delegate ou un datasource. Je pense à 2 de ces composants que j'utilise beaucoup: UITableView et UICollectionView.

Sur ces 2 composants par exemple, pas possible d'utiliser de blocks/closures, et on doit passer par un bon delegate à l'ancienne. Dans l'absolu, ce n'est pas très gênant, sauf dans le cas où on se retrouve avec plusieurs de ces composants sur le même écran. Les méthodes deviennent alors énormes et cela devient compliqué de faire du code élégant. Ce que je vous propose ici est une petite solution que je trouve assez propre.

### Mise en situation

Comme dans les deux articles précédents, on va juste faire un Appel GET sur une URL  donnée et avoir un système qui nous prévient en cas de succès comme d'erreur. On va aller un peu plus vite que dans le premier article, car ce sont des notions que vous devez déjà maîtriser.

C'est parti pour le code !

Notre but ici est de réaliser une classe qui fait un GET sur une URL donnée. Je veux prévenir l'objet qui a été l'instigateur de cette requête si elle a réussi ou non. Pour éviter un couplage fort, on va utiliser le principe du delegate, grâce à ça, je n'aurai pas à connaitre le type exact de cet objet.

On va agir en 3 étapes:

- Créer un protocol
- Créer des blocks/closures
- Créer une classe qui hérite du protocole et qui a nos 2 blocks/closures en variables.

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

On va maintenant implémenter la classe qui va hériter du protocole. Elle va donc contenir les 2 méthodes **onRequestSuccess** et **onRequestFailure** et chacune appellera le block/closure qui lui correspondra.

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

Ensuite, on code la classe **RequestManager** que vous devez commencer à connaître

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

Puis on va faire une méthode pour appeler notre webservice

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

On va un peu regarder ensemble ce que l'on a codé.
- On a instancié notre **Manager,** qui va appeler le webservice
- On a définit nos deux **blocks/closures**
- On a instancié notre **Delegate**
- On a assigné nos deux **blocks/closures**
- On a assigné le **Delegate** au Manager
- On appelle le webservice

Je vous donne le code Swift pour les plus impatients

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

Si maintenant j'appelle la méthode callWebService, vu le dummy code que l'on a fait, le résultat sera un passage dans le block/closure requestSuccess.

**Mais pourquoi faire tout ça ?**

En effet, pourquoi faire tout ça, alors que dans notre cas, on pouvait juste utiliser un **Delegate** ou des **blocks/closures** comme dans le premier article ? Cela complexifie le code, et on a l'impression de faire les choses deux fois...
Comme je vous l'ai dit au début de l'article, cette solution vient pour un besoin assez spécifique. Celui de rendre un **Delegate** plus flexible quand on est obligé de passer par ce design pattern.

**Problèmes soulevés**

- Si le **Protocol** contient beaucoup de méthodes, on en a beaucoup à ré-implémenter.
- On doit aussi définir tous les **blocks/closures** correspondants.
- Il faut redéfinir les **blocks/closures** pour chaque appel.

**Gains apportés**

- Des delegates plus flexibles
- Du code localisé
- Des méthodes réduites
- Une gestion plus fine des retours du **Delegate**

### Conclusion

Cette solution n'est pas parfaite, mais reste assez élégante et n'est pas trop lourde à mettre en place.
Après, je vous laisse tester et me dire ce que vous en pensez dans les commentaires.

Allez, salut les astronautes :)
