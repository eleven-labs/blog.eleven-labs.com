---
layout: post
title: "[iOS] Comment coupler les delegates et les closures ?"
author: thuchon
date: '2017-01-25 14:30:42 +0100'
date_gmt: '2017-01-25 13:30:42 +0100'
categories:
- Mobile
tags:
- ios
- delegates
- closure
---

#### Introduction
Salut les Astronautes, aujourd'hui on va continuer dans notre lancée sur le mobile, toujours en NATIF.

Cet article s'inscrit dans la lignée des 2 précédents, et il est impératif de les avoir lu pour comprendre ce dont il s'agit ici :

<a href="http://blog.eleven-labs.com/fr/delegates-closures/" target="_blank">http://blog.eleven-labs.com/fr/delegates-closures/</a><br />
<a href="http://blog.eleven-labs.com/fr/android-listeners/">http://blog.eleven-labs.com/fr/android-listeners/</a>

Si vous avez lu les 2 précédents articles, vous devez vous douter de ce dont celui-ci va parler.<br />
-Mais oui on sait, allez dépêche-toi là, on veut savoir comment faire un truc aussi sexy que les listeners mais sur iOS cette fois-ci.<br />
-Ok, juste encore un petit peu de blabla technique et on se lance.

<strong>Comment ça va se passer :</strong>

Bon comme le premier article, pour que tout le monde soit heureux, je vais vous produire du DUMMY code en Objective-C comme en Swift.

Dans le monde du développement iOS, comme vous avez pu le comprendre, on peut utiliser les delegates ou bien les closures. En général, on va utiliser la closure pour plus de flexibilité et c'est aussi plus simple à mettre en place. Cependant, dans certains cas, des composants graphiques par exemple sont juste utilisables via un delegate ou un datasource. Je pense à 2 de ces composants que j'utilise beaucoup: UITableView et UICollectionView.

Sur ces 2 composants par exemple, pas possible d'utiliser de blocks/closures, et on doit passer par un bon delegate à l'ancienne. Dans l'absolu, ce n'est pas très gênant, sauf dans le cas où on se retrouve avec plusieurs de ces composants sur le même écran. Les méthodes deviennent alors énormes et cela devient compliqué de faire du code élégant. Ce que je vous propose ici est une petite solution que je trouve assez propre.

#### Mise en situation
Comme dans les deux articles précédents, on va juste faire un Appel GET sur une URL  donnée et avoir un système qui nous prévient en cas de succès comme d'erreur. On va aller un peu plus vite que dans le premier article, car ce sont des notions que vous devez déjà maîtriser.

C'est parti pour le code !

Notre but ici est de réaliser une classe qui fait un GET sur une URL donnée. Je veux prévenir l'objet qui a été l'instigateur de cette requête si elle a réussi ou non. Pour éviter un couplage fort, on va utiliser le principe du delegate, grâce à ça, je n'aurai pas à connaitre le type exact de cet objet.

On va agir en 3 étapes:

-Créer un protocol<br />
-Créer des blocks/closure<br />
-Créer une classe qui hérite du protocole et qui a nos 2 blocks/closures en variables.

-Objective-C

<pre class="lang:Objective-C decode:true">
{% raw %}
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

{% endraw %}
</pre>

On va maintenant implémenter la classe qui va hériter du protocole. Elle va donc contenir les 2 méthodes <strong>onRequestSuccess</strong> et <strong>onRequestFailure</strong> et chacune appellera le block/closure qui lui correspondra.

<pre class="lang:Objective-C decode:true ">
{% raw %}
@implementation RequestManagerObjCDelegateImplementation

- (void)onRequestSuccess {
    self.success();
}

- (void)onRequestFailure {
    self.failure();
}

@end

{% endraw %}
</pre>

Ensuite, on code la classe <strong>RequestManager</strong> que vous devez commencer à connaître

<pre class="lang:Objective-C decode:true ">
{% raw %}
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
{% endraw %}
</pre>

Puis on va faire une méthode pour appeler notre webservice

<pre class="lang:Objective-C decode:true ">
{% raw %}
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
{% endraw %}
</pre>

On va un peu regarder ensemble ce que l'on a codé.<br />
- On a instancié notre <strong>Manager,</strong> qui va appeler le webservice<br />
- On a définit nos deux <strong>blocks/closures</strong><br />
- On a instancié notre <strong>Delegate</strong><br />
- On a assigné nos deux <strong>blocks/closures</strong><br />
- On a assigné le <strong>Delegate</strong> au Manager<br />
- On appelle le webservice

Je vous donne le code Swift pour les plus impatients

- Swift

<pre class="lang:Swift decode:true">
{% raw %}
protocol RequesterDelegateSwift {
    func onRequestSuccess()
    func onRequestFailure()
}

class RequesterDelegateSwiftImplementation:  RequesterDelegateSwift {
    var requestSuccess: ((Void) -&gt; Void)?
    var requestFailure: ((Void) -&gt; Void)?

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

    private func isSuccess() -&gt; Bool {
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

{% endraw %}
</pre>

Si maintenant j'appelle la méthode callWebService, vu le dummy code que l'on a fait, le résultat sera un passage dans le block/closure requestSuccess.

#### Mais pourquoi faire tout ça ?
En effet, pourquoi faire tout ça, alors que dans notre cas, on pouvait juste utiliser un <strong>Delegate</strong> ou des <strong>blocks/closures</strong> comme dans le premier article ? Cela complexifie le code, et on a l'impression de faire les choses deux fois...<br />
Comme je vous l'ai dit au début de l'article, cette solution vient pour un besoin assez spécifique. Celui de rendre un <strong>Delegate</strong> plus flexible quand on est obligé de passer par ce pattern.

<strong>Problèmes soulevés</strong>

-Si le <strong>Protocol</strong> contient beaucoup de méthodes, on en a beaucoup à ré-implémenter.<br />
-On doit aussi définir tous les <strong>blocks/closures</strong> correspondants.<br />
-Il faut redéfinir les <strong>blocks/closures</strong> pour chaque appel.

<strong>Gains apportés</strong>

-Des delegates plus flexibles<br />
-Du code localisé<br />
-Des méthodes réduites<br />
-Une gestion plus fine des retours du <strong>Delegate</strong>

Cette solution n'est pas parfaite, mais reste assez élégante et n'est pas trop lourde à mettre en place.<br />
Après, je vous laisse tester et me dire ce que vous en pensez dans les commentaires.

Allez, salut les astronautes :)


