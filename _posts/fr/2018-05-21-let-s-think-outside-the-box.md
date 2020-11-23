---
layout: post
title: "[iOS] Let's think outside the box"
authors:
    - thuchon
lang: fr
permalink: /think-outside-the-box/
excerpt: "Utilisons le Framework comme il n'est pas prévu pour"
date: '2018-05-21 14:30:42 +0100'
date_gmt: 2018-05-21 13:30:42 +0100'
categories:
- Mobile
tags:
- ios
- json
- http
- behavior
cover: /assets/2018-05-21-let-s-think-outside-the-box/cover.jpg
---

## Introduction

Salut les Astronautes, ça faisait un bail que je n'avais pas écrit un article, et aujourd'hui j'ai décidé de revenir en force avec un sujet bien technique et bien poussé comme on les aime.

Attention pour celui-ci, il va falloir s'accrocher ! Même si le principe est plutôt simple, on va voir du code assez technique et on va vraiment pousser le framework et l'utiliser de manière tricky pour qu'il fasse des choses qu'il n'est pas trop supposé faire ;)

Ne vous en faites pas, je vais bien vous expliquer chaque étape, et bien décortiquer chaque bout de code.

Ça fait un petit moment que je me retrouve à développer des projets dans lesquels les features doivent être configurables.<br/>
Le plus souvent on me demande de faire en sorte que des features soient activables ou désactivables à distance.

On peut prendre l'exemple d'un burger menu, où chaque entrée correspond à une fonctionnalité de l'application, et on souhaite choisir celles qui sont accessibles.<br/>
Ce n'est pas spécialement compliqué à faire, et c'est très pratique pour le business.<br/>
Néanmoins, je me suis toujours dit, il manque un truc, j'ai envie d'aller plus loin.<br/>
Et donc, on en arrive là...

Aujourd'hui, je vais vous montrer comment "piloter" le comportement d'une application depuis un fichier JSON déposé sur un serveur distant.<br/>
Quézaco?<br/>
Mais il est fou ce garçon, il est resté trop longtemps dans l'espace.<br/>

Pour que la suite de cet article soit plus simple, on va définir ensemble quelques mots clefs pour que vous ne soyez pas perdus.<br/>
Je vais beaucoup utiliser le mot "module". Un module correspond à un ensemble de fonctionnalités que l'on peut facilement ré-utiliser et que l'on peut potentiellement sortir d'une application pour le mettre par exemple en tant que **Pod**<br/>
Le terme suivant sera "action", j'entends par "action" : "Fais telle chose" dans mon application, pour la durée de l'article, ce sera un output console, une ouverture de page web, ce genre de choses.<br/>
Maintenant que l'on a éclairci et défini les termes nécessaires à la bonne compréhension de cet article, je pense qu'il est temps de passer à la suite.<br/>


**Comment nous allons procéder :**

Pour réussir à produire ce que l'on veut, on va devoir faire cohabiter 3 langages :

- **JSON** pour la configuration
- **Objective-C** pour taper bien bas dans le framework
- **Swift** pour notre application


## Mise en situation

Accrochez-vous, c'est là que que tout commence.

Notre but est de réaliser une application qui contient des features, mais qui n'a pas de structure comportementale.<br/>
Chaque feature va être définie comme un module, donc du code bien séparé qui vit sa vie et qui est disponible sans aucune dépendance au moment où il doit être utilisé.<br/>
Une fois que l'on a bien compris ça, il faut se dire que ce que l'on veut réaliser est en 3 différentes parties :

- Les modules
- Notre application
- Le comportement de notre application

Je vous expliquerai par la suite chaque partie une à une.

Notre objectif ici est de réaliser une application qui pourra charger à chaud des modules et leur faire exécuter des actions qui leur sont propres, mais sans que la séquence de ces actions soit défini dans le code de notre application.

On va donc procéder en 3 étapes :

- Récupérer la liste des modules ainsi que la liste des actions sur un serveur distant
- Charger ces modules
- Exécuter les actions des modules

### Les modules

Ici on va définir 3 modules et expliquer ce qu'ils font :

Premier module
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
Ce module est très simple, il contient deux méthodes, **sayHello** et **sayGoodBye**. Ces deux méthodes vont écrire sur la console le message défini à l'intérieur de celle-ci.


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
Ce module est un clone du premier, la seule différence est le texte à l'intérieur de nos deux méthodes.


Troisième module
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
Ce troisième module contient une seule méthode, il va ouvrir une instance safari et aller sur l'url passée en paramètre, rien de bien compliqué.


Comme vous pouvez le voir, les modules n'ont aucune intelligence, ils font juste ce qui leur est demandé.


### L'application

Intéressons-nous maintenant à l'application, c'est le coeur du projet.<br/>
En effet, comme défini plus haut, nous allons agir en 3 étapes :<br/>

- Récupérer nos modules sur le serveur distant
- Charger les modules
- Exécuter les actions des modules

### La récupération des modules

Pour procéder à cette récupération, nous allons utiliser 2 libs :

- Alamofire pour tout ce qui est appels réseaux
- Gloss pour la transformation du JSON en objet

Tout d'abord la récupération du fichier JSON présent sur notre serveur.<br/>
Là, rien de bien méchant, on fait un GET avec la librairie Alamofire et on transforme ce JSON en GenericProtocol (une classe créée spécialement pour récupérer nos infos) via une petite classe perso que j'utilise toujours dans mes projets.

La classe en question
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
Le GenericProtocol
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
On peut voir que j'utilise la librairie Gloss pour le mapping (question d'habitude).<br/>
Notre GenericProtocol a un nom, une liste d'actions et un realObject. Je reviendrai plus tard sur ce realObject.<br/>
Et s'en suit la transformation du JSON en objet après le retour du call HTTP.<br/>

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
Au-dessus, je vous ai parlé du realObject. Mais qu'est-ce que c'est que ça?<br/>
Et bien en fait ce realObject c'est notre module, on l'instancie et garde une référence accessible dessus, je me suis inspiré des pointeurs sur fonctions en C pour cette idée.

Passons maintenant au chargement/création de nos modules.

### Le chargement de nos modules

Le code sur lequel nous allons nous concentrer ici correspond à ces 3 petites lignes.
```Swift
if let programmingObject = ObjectCreator.create(self.name) {
    self.realObject = programmingObject as AnyObject
}
```
Cela me sert à instancier mon module en me basant sur son nom.<br/>
Au début de l'article, je vois ai parlé d'***Objective-C***, on y arrive enfin.<br/>
J'utilise l'Objective-C pour accéder à une couche vraiment basse pour instancier des classes basées sur leurs noms.<br/>
Voici la classe qui nous permet de faire ça (Objective-C oblige en 2 fichiers, le .h et le .m), le tout avec un Bridging-Header pour que ce code soit visible pour Swift.
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
Donc, si je résume, on a récupéré notre JSON via un call HTTP, transformé ce JSON en objet et instancié des classes qui contiennent des actions (nos modules).<br/>
C'est bien beau tout ça, mais comment on fait pour les utiliser ces fameux modules?<br/>
Dans la méthode **getModules** on fait appel à une autre méthode **useModules**, on va aller regarder de côté-là.

### Exécuter les actions des modules

D'avance, je suis désolé, cette méthode va piquer les yeux.<br/>
Je vous entends venir avec vos "mais la complexité cyclomatique, c'est illisbile, comment on peut reprendre ça ?!"<br/>
En même temps, appeler des méthodes sur des objets au Runtime, vous vous doutiez bien que ça n'allait pas être super clean et être fait en 2 lignes.<br/>
Je vous demande juste de me faire confiance pour cette méthode et je vais vous expliquer du mieux que je peux ce qu'elle fait.<br/>

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

C'est parti pour l'explication ligne par ligne:

On boucle sur notre liste de modules.<br/>
On vérifie que chaque module a une liste d'actions.<br/>
On boucle sur la liste d'actions du module.<br/>
On vérifie que l'action possède bien une méthode (pour rappel une action peut avoir une méthode et un paramètre).<br/>
On récupère le selector, c'est la signature de la méthode.<br/>
On vérifie que le realObject existe, et qu'il contient bien le selector.<br/>
Si l'action a un paramètre alors on exécute cette action en lui passant le paramètre.<br/>
Si l'action n'a pas de paramètre, on exécute alors juste l'action.<br/>

Waow, c'était intense, mais je pense que c'était nécessaire pour une bonne compréhension du sujet.<br/>

Bon, maintenant, c'est bien, on a une application qui peut avoir un comportement dicté à distance, mais si on se penchait un peu plus sur ce comportement ?<br/>
On enchaîne ?

### Le comportement de notre app

```JSON
[
    {
        "name": "GenericProtocol.MyFirstModule",
        "actions": [
            {
                "func": "sayHello"
            }
            ,
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

Il s'agit d'un array JSON qui contient 3 objets (modules).<br/>
Le champ **name** correspond au nom du module, **actions** à la liste de méthodes du module (**func** étant le nom de chaque méthode et **value** la valeur à passer à la méthode).<br/>
J'ai bien fait exprès pour les deux premiers modules de rajouter des actions inexistantes, car nous voulons un système un minimum robuste.

### Petit Interlude

On a codé nos modules.<br/>
On a réalisé une application pouvant charger et utiliser ces modules.<br/>
On a défini le comportement de notre application.<br/>
C'est quoi les prochaines étape ?<br/>
L'avant-dernière étape, c'est d'appeler notre méthode **getModules** dans **viewDidLoad**
```Swift
override func viewDidLoad() {
    super.viewDidLoad()
    getModules()
    // Do any additional setup after loading the view, typically from a nib.
}
```
Et maintenant la dernière étape.
Bah, tout simplement tester ce que ça donne :)

## It's time to run the APP

Bon, on a enfin tout en place, il suffit juste de runner notre application.
Notre belle application se lance et que se passe-t-il ?

Pour ce qui est visible dans le simulateur, on va voir notre application s'ouvrir, afficher notre dummy screen, puis ouvrir Safari et aller sur le site d'**Eleven-Labs**.<br/>
Hum, c'est étrange ça, ça me rappelle l'action que l'on avait définie dans le 3ème module.<br/><br/>
![AppVideo]({{ site.baseurl }}/assets/2018-05-21-let-s-think-outside-the-box/appvideo.gif){:height="1104px" width="621px"}<br/><br/>
Si on se penche maintenant sur la console, on va pouvoir observer des outputs.<br/>
Mais dis-donc, ces outputs là, ce ne seraient pas ceux que l'on a définis pour nos deux premiers modules ?!.<br/><br/>
![ConsoleOutput]({{ site.baseurl }}/assets/2018-05-21-let-s-think-outside-the-box/console-output.png)<br/><br/>
Je pense que vous commencez à comprendre le truc non ?<br/>
Toutes les actions que l'on a définies dans le **JSON** et qui existent vraiment dans le module se sont réalisées.<br/>
Plutôt cool non ? :)

## Mais pourquoi faire tout ça ?

Vous devez vous dire, mais pourquoi faire tout ça ?<br/>
Pour différentes raisons.<br/>
La première étant que c'est très, très fun. Il faut de temps en temps sortir des sentiers battus et essayer de nouvelles choses, pousser le langage, pousser le framework, pousser les outils avec lesquels vous travaillez.
Déstructurer une application peut être très utile, vous aider à établir de nouvelles architectures, voir des problématiques sous des angles différents et vous apporter des solutions pour des projets futurs.

Voilà, j'espère que cet article vous a donné envie d'essayer de nouvelles choses et qu'il vous poussera à penser "**Outside the box**".

Je vous donne un lien pour télécharger le projet déjà tout fait.<br/>
Il suffit de le cloner, faire un pod install et la suite vous la connaissez.<br/>
[Le Projet](https://github.com/ettibo/GenericProtocols){:rel="nofollow noreferrer"}

Allez, salut les astronautes :)
