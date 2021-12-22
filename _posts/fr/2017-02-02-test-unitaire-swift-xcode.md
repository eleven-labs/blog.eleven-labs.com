---
layout: post
title: "Des tests unitaires en Swift avec Xcode"
excerpt: "Des tests unitaires en Swift avec Xcode"
lang: fr
permalink: /fr/test-unitaire-swift-xcode/
authors:
    - ibenichou
date: '2017-02-02 10:29:51 +0100'
date_gmt: '2017-02-02 09:29:51 +0100'
categories:
    - Mobile
    - ios
tags:
    - swift
    - xcode
    - tests
    - xctest
image:
    path: /assets/2017-02-02-test-unitaire-swift-xcode/logo_xcode.png
    height: 100
    width: 100
---

Bonjour à vous les astronautes !!! :)

Aujourd'hui, nous allons voir ensemble un nouveau tuto de l'espace sous iOS/Xcode.

Le sujet : **Les tests unitaires** !

Le but de cet article est de vous sensibiliser aux tests sous Xcode et de vous apporter les bases pour vous lancer. N’hésitez pas à écrire un commentaire si vous avez des questions ou autres...

Vous avez sûrement entendu la phrase : "tester c'est douter", mais dans mon équipe on aime bien rajouter: "mais douter c'est bien".

Alors un test unitaire c'est quoi ?

Un test unitaire permet de :
* Vérifier le bon fonctionnement d'une méthode, une classe, une portion d'un programme... ;
* Garantir une non-régression de votre code ;
* Se rendre compte que son code est trop long et compliqué, ce qui entraîne une refacto.


En général, un test se décompose en trois parties, suivant le schéma « **AAA** », qui correspond aux mots anglais « Arrange, Act, Assert », que l’on peut traduire en français par Arranger, Agir, Auditer.

* **Arranger** : Il s’agit dans un premier temps de définir les objets, les variables nécessaires au bon fonctionnement de son test (initialiser les variables, initialiser les objets à passer en paramètres de la méthode à tester, etc.) ;
* **Agir** : Il s’agit d’exécuter l’action que l’on souhaite tester (en général, exécuter la méthode que l’on veut tester, etc.) ;
* **Auditer** : Vérifier que le résultat obtenu est conforme à nos attentes.

Bon ça c'est la théorie, passons un peu à la pratique.

Sur Xcode, pour effectuer des tests, nous utiliserons le framework fournit par Apple qui s’appel XCTest.

Ce framework fournit pas mal de choses mais je ne vous en dis pas plus, après on va me reprocher de spoiler :)

## Test sur un(e) Model/Classe

Tout d’abord, nous allons créer une structure Astronaute (dans un dossier Model pour faire genre on fait du MVC :p ) comme ceci :

```swift
import Foundation

struct Astronaute {
    let name: String
    let grade: String
    let sex: String

    let planet: String?

    init(name: String, grade: String, sex: String, planet: String? = nil) {
        self.name = name
        self.grade = grade
        self.sex = sex
        self.planet = planet
    }
}
```

Comme vous pouvez le constater, un Astronaute a obligatoirement un nom, un grade et un sexe mais n’a pas forcément de planète (c’est pas bien ça !).

On vient de créer cette structure donc le bon réflexe à prendre c’est de la tester tout de suite.

Alors commentkonfé ?

Lorsque vous créez un projet, généralement Xcode vous demande si vous désirez ajouter des units tests (checkbox). Si vous avez coché cette case alors vous avez un dossier finissant par **Tests** qui s'est créé à la racine. Supprimez le fichier généré dedans et créez un dossier Model afin de respecter l’architecture mise en place (c’est dans les bonnes pratiques).

Une fois cette étape terminée, faites clique droit sur le dossier &gt; New File et sélectionnez Unit Test Case Class.

<img src="{{ site.baseurl }}/assets/2017-02-02-test-unitaire-swift-xcode/capture-d-ecran-2017-01-16-a-23.18.39.png" />

Le nommage de la classe doit obligatoirement finir par Tests, soit dans notre cas **AstronauteTests**.

Nous allons maintenant nous attarder sur la classe générée afin de vous expliquer la base.

```swift
import XCTest

class AstronauteTests: XCTestCase {

    override func setUp() {
        super.setUp()
    }

    override func tearDown() {
        super.tearDown()
    }

    func testExample() {
    }

    func testPerformanceExample() {
        self.measure {
        }
    }

}
```

La première chose à noter est qu’on importe XCTest. Comme vous vous en doutez, ceci permet d’avoir accès au framework XCTest.

Ensuite nous avons plusieurs méthodes que nous allons voir en détail :

* **setUp()**. Cette méthode est appelée avant chaque invocation de chaque méthode de test écrit dans la classe. Pour ceux ou celles qui font des tests avec phpunit vous avez sûrement reconnu cette méthode ;
* **tearDown()**. Cette méthode est appelée après l’invocation de chaque méthode de tests écrits dans la classe ;
* **testExample()**. Méthode créée par défaut par Xcode. Il est important de savoir que chaque méthode de test que vous allez créer doit absolument être préfixée par **test**;
* **testPerformanceExample()**. Méthode créée par défaut par Xcode. Dans celle-ci, Xcode nous montre que nous pouvons aussi faire un test de performance. Tester la perfomance de votre code permet de s’assurer que les algorithmes les plus importants qui demandent un traitement particulier restent performants avec le temps.

```swift
import XCTest
@testable import tuto_xctest

class AstronauteTests: XCTestCase {

    func testInitAstronaute() {
        let astronaute = Astronaute(name: "Pepito", grade: "Amiral", sex: "Male")

        XCTAssertEqual("Pepito", astronaute.name)
        XCTAssertEqual("Amiral", astronaute.grade)
        XCTAssertEqual("Male", astronaute.sex)
    }
}
```


Rien ne vous choque ? J’ai ajouté un @testable import {nomDeMonProjet}.

En effet, sur chaque classe de test que vous allez créer, vous devrez ajouter ceci afin d’autoriser l’accès au AppDelegate notamment mais aussi à l’ensemble des classes et méthodes créées dans votre application. Cependant, @testable donne accès seulement aux méthodes dites internes et non aux méthodes privées.

Nous allons créer notre première méthode de test. Pour ceci, nous allons tester que notre structure Astronaute initialise bien les valeurs qu'on lui passe. C'est pourquoi, nous allons créer la méthode **testInitAstronaute** (bien évidemment la bonne pratique est de donner un nom qui indique ce qu’on souhaite tester et son nom doit être en camelCase).

Dans cette méthode, nous initialisons dans une constante astronaute la structure Astronaute avec les paramètres obligatoires.

Pour tester que nos valeurs sont bien passées à la structure, il n’y a rien de plus simple.

Nous allons utiliser une méthode fournie par le framework XCTest. Dans notre cas, nous testerons l’égalité entre deux valeurs et nous nous servirons de la méthode **XCTAssertEqual** (la notion d’assert a déjà été vue plus haut) qui prend plusieurs arguments.
1. expression1 : Une expression de type scalaire C ;
2. expression2 : Une expression de type scalaire C ;
3. …: Une description optionnelle lors d’un échec. Cette description doit être typée en String.

Cette méthode génère un échec lorsque expression1 != expression2.

Bon on a écrit notre test mais comment on l’exécute ?

Il y a 3 solutions :

1. Vous lancez tous les tests via CMD + U ;
2. Vous passez votre curseur sur le carré vide à côté du nom de la classe et celui-ci se transforme en bouton play. Ce procédé va lancer tous les tests de votre classe (cf. screenshot ci-dessous) ;
3. Même procédure que la solution 2 mais seulement sur la méthode que vous souhaitez tester.

<img src="{{ site.baseurl }}/assets/2017-02-02-test-unitaire-swift-xcode/capture-d-ecran-2017-01-17-a-23.46.10.png" />

Pour finir notre test, nous allons rajouter la méthode **testInitAstronuateWithPlanet** >qui va tester l’initialisation d’un astronaute avec une planète (oui j’aime bien mettre des noms en rapport avec Star Wars :) ).

```swift
func testInitAstronuateWithPlanet() {
  let astronaute = Astronaute(name: "Skywalker", grade: "Jedi", sex: "Male", planet: "Tatooine")

  XCTAssertEqual("Tatooine", astronaute.planet)
}
```

Bon normalement nous avons testé tous les cas possibles sur notre structure. Mais comment en être sûr ?

La solution : le code coverage. Il permet d’écrire le taux de code source testé d'un programme. Comment faire sous Xcode ?
Cliquez sur l’icone (cf. screenshot ci-dessous) et cliquez sur “Edit Schema”

<img src="{{ site.baseurl }}/assets/2017-02-02-test-unitaire-swift-xcode/capture-d-ecran-2017-01-18-a-00.19.57.png" />

Allez dans l’onglet Test et cochez la case “Gather coverage data” (cf. screenshot ci-dessous)

<img src="{{ site.baseurl }}/assets/2017-02-02-test-unitaire-swift-xcode/capture-d-ecran-2017-01-18-a-00.21.30.png" />

Une fois ces étapes effectuées, relancez le processus de test sur votre classe et cliquez sur l’icône qui ressemble à un message dans votre onglet à gauche puis dans l’onglet principal sélectionnez Code Coverage. N’oubliez pas de cocher dans cette partie la checkbox “Show Test Bundles”

<img src="{{ site.baseurl }}/assets/2017-02-02-test-unitaire-swift-xcode/capture-d-ecran-2017-01-18-a-00.23.46.png" />

## Test sur un ViewController

Maintenant nous allons créer une méthode qui va changer le texte d'un label en fonction d'une condition. Voici le code d'exemple (rien de très compliqué).
```swift
import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var uiText: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    func changeLabel(score: Int) {
        if (score > 0) {
            self.uiText.text = "Gagner"

            return;
        }

        self.uiText.text = "Perdu"
    }

}
```

Nous allons voir en détails ensemble comment tester ceci :
```swift
import XCTest
@testable import tuto_xctest

class ViewControllerTests: XCTestCase {
    var controller:ViewController!

    override func setUp() {
        super.setUp()

        let storyboard = UIStoryboard(name: "Main", bundle: Bundle.main)
        controller = storyboard.instantiateInitialViewController() as! ViewController
    }

    override func tearDown() {
        super.tearDown()

        controller = nil
    }

    func testScoreIsWinChangeLabel() {
        let _ = controller.view
        controller.changeLabel(score: 1)

        XCTAssertEqual("Gagner", controller.uiText.text)
    }

    func testScoreIsLooseChangeLabel() {
        let _ = controller.view
        controller.changeLabel(score: 0)

        XCTAssertEqual("Perdu", controller.uiText.text)
    }

}
```

Nous devons créer une variable de type ViewController afin d'accéder pour chaque méthode de test à celle-ci.
1. **setUp()** : (qui sera appelée avant chaque invocation de méthode de test)
    1. Nous créons une constante storyboard qui va récupérer le storyboard Main (qui est par défaut votre storyboard) ;
    2. Nous faisons appel à la méthode **instantiateInitialViewController** du storyboard afin d'instancier et renvoyer le controller de vue initial.
1. **tearDown()** : (qui sera appelée après chaque invocation de méthode de test). Nous mettons à nil notre controller pour plus de sécurité.
3. **testScoreIsWinChangeLabel()** :
    1. Nous souhaitons accéder au texte du label uiText de notre controller. Cependant sans l'instruction  `let _= controller.view` vous allez relever une erreur car le label sera égal à nil.
    Comment est-ce possible ? Quand nous avons créé notre label dans notre storyboard, celui-ci s’instancie une fois que la vue est chargée. Mais dans notre classe unitaire, la méthode **loadView()** n’est jamais déclenchée.
    Le label n’est donc pas créé et il est égal à nil. Une solution pour ce problème serait alors d'appeler **controller.loadView()** mais Apple ne le recommande pas car cela cause des problèmes de **memory leaks** quand les objets qui ont déjà été chargés sont de nouveau chargés.
    L’alternative est d’utiliser la propriété **view** de votre controller qui déclenchera toutes les méthodes requises.
    *Note : L'utilisation d'un underscore (_) comme nom de constante a pour but de réduire le nom de la constante car nous n'avons pas vraiment besoin de la vue. Cela dit au compilateur qu'on prétend avoir l'accès à la vue et qu'on déclenche toutes les méthodes.*
    2. Nous appelons la méthode concernée et nous vérifions l’assertion entre notre string et notre texte du label.

## Conclusion

J’espère que cet article vous a plu et qu’il vous a donné envie de faire pleins de test unitaires. J’insiste sur le fait que faire des tests est vraiment important car :
* Cela vérifie le bon fonctionnement de votre code ;
* Cela cible plus facilement une erreur due à un changement de code ;
* Vous y gagnerez sur le long terme.
