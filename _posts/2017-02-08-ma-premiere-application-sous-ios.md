---
layout: post
title: "Ma première Application sous IOS"
excerpt: "Ma première Application sous IOS"
permalink: /fr/ma-premiere-application-sous-ios/
authors: 
    - ibenichou
date: '2017-02-08 10:42:47 +0100'
date_gmt: '2017-02-08 09:42:47 +0100'
categories:
    - Mobile
    - Ios
tags:
    - swift
    - xcode
    - sketchapp
image:
    path: /assets/2017-02-08-ma-premiere-application-sous-ios/app-store-apps-1.jpg
    height: 100
    width: 100
---

Je voulais partager avec vous un retour d’expérience sur ma première application IOS. Personnellement, j’apprécie ce genre d’article car je peux facilement m’identifier à celui-ci.

# Intro

En ce moment, je travaille ma montée en compétence sur Swift 3/Xcode et donc comme on le sait tous, quand on apprend un nouveau langage c’est bien beau de savoir faire une boucle et des méthodes, mais il n’y a rien de mieux qu’un vrai projet pour valider ses acquis et monter en xp.

Le premier “problème", c’est de trouver une idée sur laquelle travailler. En effet, je ne suis pas très fan des to do lists que je trouve sans grand intérêt. Mais c’est là justement que ça se complique : trouver une idée est la chose la plus difficile  :( (coder est tellement plus simple à côté :) ). Bon, je vous rassure après quelques jours j’ai trouvé un sujet assez intéressant. Sur mon fil d’actualité Facebook je n’arrête pas de voir un petit “jeu” de quizz concernant des calculs mentaux (je ne sais pas si vous avez déjà vu ce genre de publication mais c’est très addictif). J’ai trouvé l’idée mais...

# Graphisme

Mais je ne vais pas faire une app sans un minimum de graphisme, non ? À ce moment là, je me dis, "autant faire une belle app pour la montrer à mon entourage…" Car il faut être honnête, la majorité des gens à qui je vais montrer cette application se contre-fiche de mon code #vieMaVieDeDev :), et par conséquent ils vont juger mon travail plus sur le côté interactif et graphique que sur mon code.

Suite à cela, je me suis encore posé une question : avec quel outil vais-je faire mon design ? Sur un photoshop, ou bien existe t-il une autre solution plus adaptée et plus simple ? C’est là que j’ai entendu parler de Sketch app. Et voilà pourquoi j’ai choisi d’utiliser cet outil pour réaliser mes maquettes :
1. Il est utilisé par une grosse majorité des graphistes / UX qui travaillent sur du mobile ;
2. C’est une bonne occasion de me former dessus et je me dis que si je viens à travailler sur une mission qui utilise cet outil je ne serai pas largué ;
3. Sketch met à votre disposition énormément d’outils afin de faciliter la conception de maquette mobile. En effet, il propose des templates tels que Android/IOS Icon App, IOS UI Design (Sketch inclut tous les éléments graphiques sur IOS), Material Design…
4. Le prix : Sketch App est à 99$/an alors que photoshop… :)

Après avoir visionné quelques tutos vidéos pour apprendre les bases, j’ai pu réaliser les maquettes de mon application. Cependant, j’ai relevé plusieurs points très intéressants sur la partie graphique :
1. Je comprends encore plus l’utilisation d’un(e) UX sur un projet. J’ai du reprendre à plusieurs reprises mes maquettes car je n’avais pas pensé à des détails qui semblent minimes mais qui avaient pour autant un impact important sur l’expérience utilisateur ;
2. Il faut prendre en compte toutes les contraintes d’intégration sur mobile mais comme je ne les connais pas encore exactement en détail, je n’ai pas réalisé que certaines choses n'étaient pas possibles voir très compliquées à mettre en place ;
3. Il est crucial de prendre en considération toutes les tailles de devices. Vous allez me dire "oui c’est logique, je ne comprends pas pourquoi tu n’y as pas pensé". Eh bien sur ce cas précis, j'ai commis l'erreur d'intégrer pleins de petites images et sur des devices avec un petit écran, cela rend surchargé.

Aperçu de mes maquettes :

<img src= "../../assets/2017-02-08-ma-premiere-application-sous-ios/Capture-d’écran-2017-01-22-à-13.39.50.png" />
<img src= "../../assets/2017-02-08-ma-premiere-application-sous-ios/Capture-d’écran-2017-01-22-à-13.52.43.png" />
<img src= "../../assets/2017-02-08-ma-premiere-application-sous-ios/Capture-d’écran-2017-01-22-à-13.52.54.png" />
<img src= "../../assets/2017-02-08-ma-premiere-application-sous-ios/Capture-d’écran-2017-01-22-à-13.53.11.png" />
<img src= "../../assets/2017-02-08-ma-premiere-application-sous-ios/Capture-d’écran-2017-01-22-à-13.53.29.png" />
<img src= "../../assets/2017-02-08-ma-premiere-application-sous-ios/Capture-d’écran-2017-01-22-à-13.54.23.png" />

* PS: Je remercie Julie qui m'a aidée sur la partie Graphique/UX :)*

# Backend

Je ne vais pas trop m’attarder sur cette partie car ce n’est pas vraiment le but de cet article. Pour la faire courte, j’ai juste mis en place un symfony 3.* avec un controller qui retourne une réponse en json. Cette réponse est un tableau de questions qui contient pour chacune des questions sa réponse et les liens d'images.

# Xcode

Bon on rentre enfin dans le vif du sujet !

Avant d’attaquer mon application, je me suis posé un peu (oui ça m’arrive :) ) et j’ai porté ma réflexion sur ce dont j’avais besoin, ce que j’allais utiliser, comment j’allais découper mon code…

**Cocoapods** :

Qu’est-ce que cocoapods ? C’est un gestionnaire de dépendance comme npm, composer, yarn…

J’ai besoin de cocoapods car je souhaite inclure deux librairies à mon projet, à savoir :
1. [Alamofire](https://github.com/Alamofire/Alamofire), qui est une des librairies la plus connue et utilisée sur Swift. Elle permet de faire des requêtes HTTP. Quand j’ai vu la différence entre la procédure dite “classique” utilisant les méthodes natives, et Alamofire, mon choix a été vite fait !
2. [AlamofireImage](https://github.com/Alamofire/AlamofireImage), cette librairie permet de gérer les images qui proviennent du net. Lorsque vous récupérez des images via une url, il faut gérer cette dernière en passant par de l’asynchrone. Je me suis amusé une fois à écrire du code afin de gérer ce cas et j’ai comparé le résultat de mon code avec l’utilisation d’AlamoFireImage. Je ne vous cache pas qu’Alamofire m’a mis une fessée ! :)

Pour ajouter les deux librairies, il vous suffit de créer un fichier Podfile à la racine de votre projet et d’ajouter ces petites lignes :
```podfile
# Podfile
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'
platform :ios, '10.0'
target 'GeniusApp' do
  # Comment the next line if you're not using Swift and don't want to use dynamic frameworks
  use_frameworks!

  # Pods for GeniusApp
  pod 'Alamofire', '~> 4.0'
  pod 'AlamofireImage', '~> 3.1'
end
```

Puis de faire un :

```shell
$ pod install
```


**Model** :

Au lieu d'avoir tout mon code métier dans mes controllers (pas bien ça !!), j’ai décidé de mettre un peu de logique dans des model afin d’isoler mon code pour notamment le tester plus facilement...

*Exemple* :

```swift
// Model/Party.swift
import Foundation

class Party {
    let BASE_SCORE = 0
    let BASE_LIFE = 3
    var score:Int = 0
    var life:Int = 3

    func addScore() {
        self.score += 1
    }

    func getScore() -> String {
        return "x \(self.score)"
    }

    func getLife() -> String {
        return "\(self.life)"
    }

    func killLife() {
        if isGameOver() {
            return;
        }

        self.life -= 1
    }

    func isGameOver() -> Bool {
        return self.life < 1
    }

    func resetData() {
        self.life = BASE_LIFE
        self.score = BASE_SCORE
    }
}
```

**ViewController** :

Au lieu de vous montrer en détail mes ViewControllers, je vais vous parler de quelques parties que je trouve intéressantes.

Pour commencer, j’ai rencontré plusieurs “soucis” avec le clavier :
1. Quand je clique sur mon label “??” celui-ci doit se transformer en input ;
2. Lorsque j’affiche mon clavier, il faut que je remonte l’écran afin de faciliter l’écriture de la réponse de l’utilisateur.

Ensuite, pour compliquer encore un peu plus les choses, j’ai décidé d'utiliser un clavier de type “number pad” pour améliorer l’expérience utilisateur. Toutefois, le soucis avec ce type de clavier est qu’il n’y a pas de bouton dit “return”.
*A noter : Si vous souhaitez que lorsque votre utilisateur clique sur le label "??" cela déclenche un événement de type touch il suffit de changer son attribut **isUserInteractionEnabled = true** afin de délivrer les événements de type touch et keyboard à la vue.*

Je souhaite que lorsque mon utilisateur clique sur ma cellule cela déclenche l’activation de mon clavier.
```swift
// Controller/ViewController.swift
let click = UITapGestureRecognizer(target: self, action: #selector(self.showKeyboard))

cell.addGestureRecognizer(click)
```

Dans la méthode `showKeyboard()`, je fais appel à une autre méthode `addDoneButtonOnKeyboard()` qui permet d’ajouter un bouton "Envoyer" sur le clavier.
```swift
// Controller/ViewController.swift
// let doneToolbar: UIToolbar = UIToolbar()
func addDoneButtonOnKeyboard() {
    doneToolbar.barStyle = UIBarStyle.default

    let flexSpace = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.flexibleSpace, target: nil, action: nil)
    let done: UIBarButtonItem = UIBarButtonItem(title: "Envoyer", style: UIBarButtonItemStyle.done, target: self, action: #selector(self.doneButtonAction))

    var items = [UIBarButtonItem]()
    items.append(flexSpace)
    items.append(done)

    doneToolbar.items = items
    doneToolbar.sizeToFit()
 }
```

J’ai d'abord initialisé une constante de type UIToolbar pour pouvoir y accéder à un autre moment dans le code. Une fois la Toolbar initialisée, je souhaite lui ajouter le bouton "Envoyer" (UIBarButtonItem).

Cependant, il faudrait que celui-ci se situe tout à droite de la Toolbar car par défaut il se place tout à gauche. Pour y remédier, j’ai donc créé un bouton flexSpace qui ne fait rien mais qui va cependant permettre d’avoir le bouton à droite. Je n’ai plus qu'à ajouter lesdits boutons à ma Toolbar.

Attention : il ne faut pas oublier aussi d'ajouter la Toolbar au clavier via :
```swift
// Controller/ViewController.swift
{UITextField}.inputAccessoryView = doneToolbar
```

La propriété inputAccessoryView est utilisée pour attacher une vue accessoire (ici, notre UIToolbar) au clavier qui est présentée par UITextField.

Pour résoudre le deuxième "problème", je vous avoue que j'ai opté pour la solution la plus simple mais qui marche parfaitement bien. J'ai donc créé deux méthodes qui me permettent de faire un "scroll" sur ma vue.
```swift
// Controller/ViewController.swift
if self.view.frame.origin.y < 0.0 {
    if UIScreen.main.bounds.size.height < 600 {
        self.view.frame.origin.y += 285

        return
    }

    self.view.frame.origin.y += 180
}
// And

if self.view.frame.origin.y >= 0.0 {
    if UIScreen.main.bounds.size.height < 600 {
        self.view.frame.origin.y -= 285

        return
    }

    self.view.frame.origin.y -= 180
}
```

J'ai dû rajouter un petit "hack" car sur l'Iphone 5 il me faut un plus grand scroll. C'est une des parties de mon code qui je pense demande une refacto (si vous avez des suggestions je suis bien évidemment preneur).

**Extension** :

Une des choses qui me plait le plus en Swift, ce sont les extensions ! J'ai donc pensé à en faire une pour la partie téléchargement d'une image depuis une url.
```swift
// Extensions/UIImageViewExtension.swift
import UIKit
import Alamofire
import AlamofireImage

extension UIImageView {
    func getUIImageViewByUrl(url: String) {
        Alamofire.request(url).responseImage { response in
            if let image = response.result.value {
                self.image = image
            }
        }
    }
}
``

Je n'ai plus qu'à appeler celle-ci dans mon ViewController:
```swift
// Controller/ViewController.swift
cell.image.getUIImageViewByUrl(url: url)
```

## Conclusion

J'ai pris énormément de plaisir à coder cette application (c'est le plus important je pense).
Avant de me lancer, j'avais pas mal d'a priori et je me disais "cette partie va être dure... ; comment je vais gérer ça..." Et finalement, pour chaque problème rencontré, j'ai su trouver des solutions. Alors oui, mon application n'est pas hyper optimisée et elle demande surement une refacto générale mais j'ai tellement appris de choses qu'on ne voit pas dans un tuto :).
Ce que je retiens de ma toute première application sous IOS, c'est que j'apprécie vraiment de faire du mobile, que je prends du plaisir à coder sous Swift et qu'il ne faut pas avoir peur de se lancer. Alors j'espère qu'en lisant cet article, ça va tenter certaines personnes à se lancer sur cette voie.

*P.S. : Merci aux Pandas pour les relectures*

