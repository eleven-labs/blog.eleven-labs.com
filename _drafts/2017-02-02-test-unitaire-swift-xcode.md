--- layout: post title: Des tests unitaires en Swift avec Xcode author:
ibenichou date: '2017-02-02 10:29:51 +0100' date\_gmt: '2017-02-02
09:29:51 +0100' categories: - Mobile tags: \[\] --- {% raw %}

[Bonjour à vous les astronautes !!! :)]{style="font-weight: 400;"}

[Aujourd'hui, nous allons voir ensemble un nouveau tuto de l'espace sous
iOS/Xcode.]{style="font-weight: 400;"}

[Le sujet : **Les tests unitaires** !]{style="font-weight: 400;"}

[Le but de cet article est de vous sensibiliser aux tests sous Xcode et
de vous apporter les bases pour vous lancer. N’hésitez pas à écrire un
commentaire si vous avez des questions ou
autres...]{style="font-weight: 400;"}

[Vous avez sûrement entendu la phrase : "tester c'est douter", mais
d]{style="font-weight: 400;"}[ans mon équipe on aime bien rajouter:
"mais douter c'est bien".]{style="font-weight: 400;"}

[Alors un test unitaire c'est quoi ?]{style="font-weight: 400;"}

[Un test unitaire permet de :]{style="font-weight: 400;"}

-   [Vérifier le bon fonctionnement d'une méthode, une classe, une
    portion d'un programme... ;]{style="font-weight: 400;"}
-   [Garantir une non-régression de votre code
    ;]{style="font-weight: 400;"}
-   [Se rendre compte que son code est trop long et compliqué, ce qui
    entraîne une refacto.]{style="font-weight: 400;"}

[En général, un test se décompose en trois parties, suivant le schéma «
]{style="font-weight: 400;"}**AAA**[ », qui correspond aux mots anglais
« Arrange, Act, Assert », que l’on peut traduire en français par
Arranger, Agir, Auditer.]{style="font-weight: 400;"}

-   **Arranger**[ : Il s’agit dans un premier temps de définir les
    objets, les variables nécessaires au bon fonctionnement de son test
    (initialiser les variables, initialiser les objets à passer en
    paramètres de la méthode à tester, etc.)
    ;]{style="font-weight: 400;"}
-   **Agir**[ : Il s’agit d’exécuter l’action que l’on souhaite tester
    (en général, exécuter la méthode que l’on veut tester, etc.)
    ;]{style="font-weight: 400;"}
-   **Auditer**[ : Vérifier que le résultat obtenu est conforme à nos
    attentes.]{style="font-weight: 400;"}

[Bon ça c'est la théorie, passons un peu à la
pratique.]{style="font-weight: 400;"}

[Sur Xcode, pour effectuer des tests, nous utiliserons le framework
fournit par Apple qui s’appel XCTest.]{style="font-weight: 400;"}

[Ce framework fournit pas mal de choses mais je ne vous en dis pas plus,
après on va me reprocher de spoiler :)]{style="font-weight: 400;"}

### Test sur un(e) Model/Classe

[Tout d’abord, nous allons créer une structure Astronaute (dans un
dossier Model pour faire genre on fait du MVC :p ) comme ceci
:]{style="font-weight: 400;"}

``` {.lang:swift .decode:true}
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

[Comme vous pouvez le constater, un Astronaute a obligatoirement un nom,
un grade et un sexe mais n’a pas forcément de planète (c’est pas bien ça
!).]{style="font-weight: 400;"}

[On vient de créer cette structure donc le bon réflexe à prendre c’est
de la tester tout de suite.]{style="font-weight: 400;"}

[Alors commentkonfé ?]{style="font-weight: 400;"}

[Lorsque vous créez un projet, généralement Xcode vous demande si vous
désirez ajouter des units tests (checkbox). Si vous avez coché cette
case alors vous avez un dossier finissant par
]{style="font-weight: 400;"}**Tests** [qui s'est créé à la racine.
Supprimez le fichier généré dedans et créez un dossier Model afin de
respecter l’architecture mise en place (c’est dans les bonnes
pratiques).]{style="font-weight: 400;"}\
[Une fois cette étape terminée, faites clique droit sur le dossier &gt;
New File et sélectionnez Unit Test Case Class.
]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-16-à-23.18.39-300x211.png){.size-medium
.wp-image-3219 .aligncenter width="300"
height="211"}](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-16-à-23.18.39.png)

[Le nommage de la classe doit obligatoirement finir par Tests, soit dans
notre cas
]{style="font-weight: 400;"}**AstronauteTests**[.]{style="font-weight: 400;"}

[Nous allons maintenant nous attarder sur la classe générée afin de vous
expliquer la base.]{style="font-weight: 400;"}

``` {.lang:swift .decode:true}
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

[La première chose à noter est qu’on importe XCTest. Comme vous vous en
doutez, ceci permet d’avoir accès au framework
XCTest.]{style="font-weight: 400;"}

[Ensuite nous avons plusieurs méthodes que nous allons voir en détail
:]{style="font-weight: 400;"}

-   **setUp()**[. Cette méthode est appelée avant chaque invocation de
    chaque méthode de test écrit dans la classe. Pour ceux ou celles qui
    font des tests avec phpunit vous avez sûrement reconnu cette méthode
    ;]{style="font-weight: 400;"}
-   **tearDown()**[. Cette méthode est appelée après l’invocation de
    chaque méthode de tests écrits dans la classe
    ;]{style="font-weight: 400;"}
-   **testExample()**[. Méthode créée par défaut par Xcode. Il est
    important de savoir que chaque méthode de test que vous allez créer
    doit absolument être préfixée par
    ]{style="font-weight: 400;"}**test **;
-   **testPerformanceExample()**[. Méthode créée par défaut par Xcode.
    Dans celle-ci, Xcode nous montre que nous pouvons aussi faire un
    test de performance. Tester la perfomance de votre code permet de
    s’assurer que les algorithmes les plus importants qui demandent un
    traitement particulier restent performants avec le
    temps.]{style="font-weight: 400;"}

``` {.lang:swift .decode:true}
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

[Rien ne vous choque ? J’ai ajouté un @testable import {nomDeMonProjet}.
]{style="font-weight: 400;"}

[En effet, sur chaque classe de test que vous allez créer, vous devrez
ajouter ceci afin d’autoriser l’accès au AppDelegate notamment mais
aussi à l’ensemble des classes et méthodes créées dans votre
application. Cependant, @testable donne accès seulement aux méthodes
dites internes et non aux méthodes privées.]{style="font-weight: 400;"}

[Nous allons créer notre première méthode de test. Pour ceci, nous
allons tester que notre structure Astronaute initialise bien les valeurs
qu'on lui passe. C'est pourquoi, nous allons créer la méthode
]{style="font-weight: 400;"}**testInitAstronaute**[ (bien évidemment la
bonne pratique est de donner un nom qui indique ce qu’on souhaite tester
et son nom doit être en camelCase).]{style="font-weight: 400;"}

[Dans cette méthode, nous initialisons dans une constante astronaute la
structure Astronaute avec les paramètres
obligatoires.]{style="font-weight: 400;"}

[Pour tester que nos valeurs sont bien passées à la structure, il n’y a
rien de plus simple.]{style="font-weight: 400;"}

[Nous allons utiliser une méthode fournie par le framework XCTest. Dans
notre cas, nous testerons l’égalité entre deux valeurs et nous nous
servirons de la méthode ]{style="font-weight: 400;"}**XCTAssertEqual**[
(la notion d’assert a déjà été vue plus haut) qui prend plusieurs
arguments.]{style="font-weight: 400;"}

1.  [expression1 ]{style="font-weight: 400;"}**:** [Une expression de
    type scalaire C ;]{style="font-weight: 400;"}
2.  [expression2 ]{style="font-weight: 400;"}**:** [Une expression de
    type scalaire C ;]{style="font-weight: 400;"}
3.  […: Une description optionnelle lors d’un échec. Cette description
    doit être typée en String.]{style="font-weight: 400;"}

[Cette méthode génère un échec lorsque expression1 !=
expression2.]{style="font-weight: 400;"}

[Bon on a écrit notre test mais comment on l’exécute
?]{style="font-weight: 400;"}

[Il y a 3 solutions :]{style="font-weight: 400;"}

1.  [Vous lancez tous les tests via CMD + U
    ;]{style="font-weight: 400;"}
2.  [Vous passez votre curseur sur le carré vide à côté du nom de la
    classe et celui-ci se transforme en bouton play. Ce procédé va
    lancer tous les tests de votre classe (cf. screenshot ci-dessous)
    ;]{style="font-weight: 400;"}
3.  [Même procédure que la solution 2 mais seulement sur la méthode que
    vous souhaitez tester.]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-17-à-23.46.10-300x70.png){.size-medium
.wp-image-3232 .aligncenter width="300"
height="70"}](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-17-à-23.46.10.png)

[Pour finir notre test, nous allons rajouter la méthode
]{style="font-weight: 400;"}**testInitAstronuateWithPlanet **[qui va
tester l’initialisation d’un astronaute avec une planète (oui j’aime
bien mettre des noms en rapport avec Star Wars :)
).]{style="font-weight: 400;"}

``` {.lang:swift .decode:true}
func testInitAstronuateWithPlanet() {
  let astronaute = Astronaute(name: "Skywalker", grade: "Jedi", sex: "Male", planet: "Tatooine")

  XCTAssertEqual("Tatooine", astronaute.planet)
}
```

[Bon normalement nous avons testé tous les cas possibles sur notre
structure. Mais comment en être sûr ?  ]{style="font-weight: 400;"}

[La solution : le code coverage. Il permet d’écrire le taux de code
source testé d'un programme. Comment faire sous Xcode
?]{style="font-weight: 400;"}\
[Cliquez sur l’icone (cf. screenshot ci-dessous) et cliquez sur “Edit
Schema”]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-18-à-00.19.57-300x167.png){.alignnone
.size-medium .wp-image-3235 width="300"
height="167"}](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-18-à-00.19.57.png)

[Allez dans l’onglet Test et cochez la case “Gather coverage data” (cf.
screenshot ci-dessous)]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-18-à-00.21.30-300x169.png){.alignnone
.size-medium .wp-image-3236 width="300"
height="169"}](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-18-à-00.21.30.png)

[Une fois ces étapes effectuées, relancez le processus de test sur votre
classe et cliquez sur l’icône qui ressemble à un message dans votre
onglet à gauche puis dans l’onglet principal sélectionnez Code Coverage.
N’oubliez pas de cocher dans cette partie la checkbox “Show Test
Bundles”]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-18-à-00.23.46-300x72.png){.alignnone
.size-medium .wp-image-3237 width="300"
height="72"}](http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-18-à-00.23.46.png)

### Test sur un ViewController {#test-sur-un-viewcontroller style="text-align: left;"}

Maintenant nous allons créer une méthode qui va changer le texte d'un
label en fonction d'une condition. Voici le code d'exemple (rien de très
compliqué).

``` {.lang:swift .decode:true}
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

[Nous allons voir en détails ensemble comment tester ceci
:]{style="font-weight: 400;"}

``` {.lang:swift .decode:true}
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

Nous devons créer une variable de type ViewController afin d'accéder
pour chaque méthode de test à celle-ci.

1.  [**setUp()**: (qui sera appelée avant chaque invocation de méthode
    de test)]{style="font-weight: 400;"}
    1.  [Nous créons une constante storyboard qui va récupérer le
        storyboard Main (qui est par défaut votre storyboard)
        ;]{style="font-weight: 400;"}
    2.  [Nous faisons appel à la méthode
        **instantiateInitialViewController** du storyboard afin
        d'instancier et renvoyer le controller de vue
        initial.]{style="font-weight: 400;"}
2.  [**tearDown()**: (qui sera appelée après chaque invocation de
    méthode de test). Nous mettons à nil notre controller pour plus de
    sécurité.]{style="font-weight: 400;"}
3.  [**testScoreIsWinChangeLabel()**: ]{style="font-weight: 400;"}
    1.  [Nous souhaitons accéder au texte du label uiText de notre
        controller. Cependant sans l'instruction
         `let _= controller.view` vous allez relever une erreur car le
        label sera égal à nil.\
        Comment est-ce possible ? Quand nous avons créé notre label dans
        notre storyboard, celui-ci s’instancie une fois que la vue est
        chargée. Mais dans notre classe unitaire, la méthode
        **loadView()** n’est jamais déclenchée.\
        Le label n’est donc pas créé et il est égal à nil. Une solution
        pour ce problème serait alors d'appeler
        **controller.loadView()** mais Apple ne le recommande pas car
        cela cause des problèmes de **memory leaks** quand les objets
        qui ont déjà été chargés sont de nouveau chargés.\
        L’alternative est d’utiliser la propriété **view** de votre
        controller qui déclenchera toutes les méthodes
        requises.]{style="font-weight: 400;"}\
        *Note: L'utilisation d'un underscore (\_) comme nom de constante
        a pour but de réduire le nom de la constante car nous n'avons
        pas vraiment besoin de la vue. Cela dit au compilateur qu'on
        prétend avoir l'accès à la vue et qu'on déclenche toutes les
        méthodes.*
    2.  [Nous appelons la méthode concernée et nous vérifions
        l’assertion entre notre string et notre texte du
        label.]{style="font-weight: 400;"}

### Conclusion

[J’espère que cet article vous a plu et qu’il vous a donné envie de
faire pleins de test unitaires. J’insiste sur le fait que faire des
tests est vraiment important car :]{style="font-weight: 400;"}

-   [Cela vérifie le bon fonctionnement de votre code
    ;]{style="font-weight: 400;"}
-   [Cela cible plus facilement une erreur due à un changement de code
    ;]{style="font-weight: 400;"}
-   [Vous y gagnerez sur le long terme.]{style="font-weight: 400;"}

{% endraw %}
