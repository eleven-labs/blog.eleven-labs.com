--- layout: post title: De qui je me mock ! author: tthuon date:
'2015-10-26 17:28:08 +0100' date\_gmt: '2015-10-26 16:28:08 +0100'
categories: - Symfony tags: - symfony - phpunit --- {% raw %}

[PHPUnit](https://phpunit.de/) est un outil de test puissant. Il permet
de tester de manière unitaire l'ensemble de son projet.

Dans cet article, je vais me concentrer sur les mock et les stub
d'objet.

### Mock, stub, what else ?

Lorsque l'on teste unitairement une classe, très souvent, cette classe a
des dépendances avec d'autres classes (qui elles-mêmes ont des
dépendances avec d'autres classes.). L'objectif du test unitaire est de
tester la classe cible, et uniquement cette classe. En admettant que les
classes dépendantes soient fiables et retournent ce qui est attendu, il
ne reste plus que la classe cible à tester.

Un "**stub**" est un objet qui va simuler les différentes classes
utilisées par la classe cible. Cet objet va toujours retourner la même
valeur, quels que soient ses paramètres.

Un "**mock**" est un "**stub**" dans lequel on va vérifier des attentes
à des appels de méthodes. Par exemple, je vérifie qu'une méthode est
appelée une fois.

### Stub, un simple bouchon

Je vais rentrer directement dans le cœur du sujet avec un exemple
simple.

J'ai les classes suivantes:

``` {.lang:php .decode:true}
<?php

class Bouteille
{
    private $bouchon;

    public function __construct(Bouchon $bouchon)
   {
         $this->bouchon = $bouchon;
    }

    public function getBouchon()
    {
         return $this->bouchon;
    }

    public function open()
    {
        $this->bouchon->popIt();
    }
}

class Bouchon
{
     private $type;

     public function __construct($type)
     {
         $this->type = $type;
     }

     public function popIt()
     {
         return true;
     }
}
```

La classe Bouteille a besoin de la classe Bouchon (une bouteille sans
bouchon, c'est inutile).

Je vais tester ma classe Bouteille et bouchonner la
méthode [getBouchon()]{.lang:default .decode:true .crayon-inline}

``` {.lang:default .decode:true}
<?php

class BouteilleTest extends \PHPUnit_Framework_TestCase
{
    public function testGetBouchon()
    {
        $bouteille = $this->getMockBuilder("Bouteille")->disableOriginalConstructor()->getMock();
        $bouteille->method("getBouchon")->will($this->returnValue(new Bouchon));

        $this->assertInstanceOf("Bouchon", $bouteille->getBouchon());
    }
}
```

Tout d'abord, je crée le stub avec la méthode
[getMockBuilder()]{.lang:default .decode:true .crayon-inline} . Il prend
en paramètre le nom de la classe. J'ai chaîné un appel à la méthode
[disableOriginalConstructor()]{.lang:default .decode:true
.crayon-inline}  car je ne veux pas que le stub utilise le constructeur
de la classe [Bouteille()]{.lang:default .decode:true .crayon-inline} 
pour se construire. Enfin, la méthode [getMock()]{.lang:default
.decode:true .crayon-inline} me retourne le bouchon.

A la ligne 8, je configure le bouchon. [-&gt;method()]{.lang:default
.decode:true .crayon-inline} . Il prend en paramètre le nom de la
méthode à bouchonner. Ici, c'est [getBouchon()]{.lang:default
.decode:true .crayon-inline} . [-&gt;will()]{.lang:default .decode:true
.crayon-inline} indique la valeur qui va être retournée. Je place en
paramètre une instance de [Bouchon()]{.lang:default .decode:true
.crayon-inline}  : [\$this-&gt;returnValue(new Bouchon())]{.lang:default
.decode:true .crayon-inline} .

Enfin, ligne 10, je vérifie que [getBouchon()]{.lang:default
.decode:true .crayon-inline}  est bien une instance de
[Bouchon()]{.lang:default .decode:true .crayon-inline} .

Ce test démontre l'utilisation d'un bouchon. Le bouchon va toujours
retourner la même valeur. Ici, je bouchonne la méthode
[getBouchon()]{.lang:default .decode:true .crayon-inline}  pour toujours
retourner une instance de [Bouchon()]{.lang:default .decode:true
.crayon-inline} .

Maintenant, je vais tester que ma fonction [open()]{.lang:default
.decode:true .crayon-inline} ouvre bien la bouteille et fait appel à la
méthode [popIt()]{.lang:default .decode:true .crayon-inline}  de la
classe [Bouchon()]{.lang:default .decode:true .crayon-inline} .

### Mock, le bouchon intelligent

Mon test va s’intéresser à la classe [Bouchon()]{.lang:default
.decode:true .crayon-inline} . Je veux vérifier que la méthode
[popIt()]{.lang:default .decode:true .crayon-inline}  est appelée une
fois lorsque j'appelle la méthode [open()]{.lang:default .decode:true
.crayon-inline}  de la classe [Bouteille()]{.lang:default .decode:true
.crayon-inline} .

``` {.lang:default .decode:true}
<?php

class BouteilleTest extends \PHPUnit_Framework_TestCase
{
    public function testOpen()
    {
        $bouchon = $this->getMock("Bouchon");
        $bouchon->expect($this->once())->method("popIt");

        $bouteille = new Bouteille($bouchon);
        $bouteille->open();
    }
}
```

La différence avec le test précédent est l'**assertion** dans la
configuration du mock.

A la ligne 7, la méthode [-&gt;expect()]{.lang:default .decode:true
.crayon-inline}  est l'assertion. Le paramètre prend en valeur le nombre
de fois que la méthode sera appelée. Ici, c'est une fois
[\$this-&gt;once()]{.lang:default .decode:true .crayon-inline}  .

### Et avec Symfony ?

Nous avons vu des exemples très théoriques sur l'utilisation des stub et
des mock. Qu'en est-il avec Symfony ?

Je vais prendre un exemple concret où un service fait appel au
repository pour avoir des données depuis la base de données. Le service
[UserService()]{.lang:default .decode:true .crayon-inline}  a une
méthode [generateReport()]{.lang:default .decode:true .crayon-inline} 
qui génère un rapport au format JSON. Pour avoir les statistiques de
l'utilisateur, je vais créer une méthode
[getStatsForUser()]{.lang:default .decode:true .crayon-inline} qui va me
retourner un array. Le contenu de la méthode ne m’intéresse pas car je
vais le bouchonner. Par contre, je sais que cette méthode doit retourner
un array.

Mon repository:

``` {.lang:php .decode:true}
<?php

namespace App\AppBundle\Repository;

class UserRepository extends DocumentRepository
{
    /**
     * @param string $userId
     *
     * @return array
     */
    public function getStatsForUser($userId)
    {
        // a complicated aggration to get stats of user
    }
}
```

Mon service:

``` {.lang:default .decode:true}
<?php

namespace App\AppBundle\Service;

use Doctrine\ODM\MongoDB\DocumentManager;

class UserService
{
    private $manager;

    public function __construct(DocumentManager $manager)
    {
        $this->manager = $manager;
    }

    public function generateReport($userId)
    {
        if (!$stats = $this->manager->getRepository("User")->getStatsForUser($userId)){
             return;
        }

        return json_encode($stats);
    }
}
```

Mon test:

``` {.lang:php .decode:true}
<?php

namespace App\AppBundle\Tests;

class UserServiceTest extends \PHPUnit_Framework_TestCase
{
  public function testGenerateReport()
  {
    $values = [
        "userId" => "dummy-user-id",
        "nbArticle" => 5,
        "lastPublication" => "2015-10-04T11:11:00+0200"
    ];

    $expectedString = '{"userId":"dummy-user-id", "nbArticle":5, "lastPublication":"2015-10-04T11:11:00+0200"}';

    $repository = $this->getMockBuilder('App\AppBundle\Repository\UserRepository')
      ->disableOriginalConstructor()
      ->getMock();
    $repository
      ->expect($this->once())
      ->method('getStatsForUser')
      ->with("dummy-user-id")
      ->will($this->returnValue($values));

    $manager = $this->getMockBuilder('Doctrine\ODM\MongoDB\DocumentManager')
        ->disableOriginalConstructor()
        ->getMock();
    $manager->expect($this->any())->method("getRepository")->will($this->returnValue($repository));

    $service = new UserService($manager);

    $this->assertEquals($expectedString, $service->generateReport("dummy-user-id"))
  }
}
```

Dans ce test, j'ai décomposé bloc par bloc.

-   ligne 9: c'est l'array qui sera retourné par la méthode
    [getStatsForUser()]{.lang:default .decode:true .crayon-inline}
-   ligne 15: la valeur finale de la méthode
    [generateReport()]{.lang:default .decode:true .crayon-inline}
-   lignes 17-24: je mock le repository et bouchonne la méthode
    [getStatsForUser()]{.lang:default .decode:true .crayon-inline} .
    J'utilise la variable [\$values]{.lang:default .decode:true
    .crayon-inline}  pour indiquer la valeur de retour de la méthode
    bouchonnée.
-   lignes 26-29: je mock le document manager. Il va retourner le
    repository que j'ai précédemment configuré.
-   ligne 31: j'injecte le mock dans mon service
    [UserService()]{.lang:default .decode:true .crayon-inline}
-   ligne 33: j'appelle la méthode [generateReport()]{.lang:default
    .decode:true .crayon-inline}  et je vérifie que j'ai bien la valeur
    de [\$expectedString]{.lang:default .decode:true .crayon-inline} .

Le test permet de bien comprendre comment fonctionnent les différents
objets et les différentes interactions.

Voilà !

N.B. : Injecter le document manager est totalement "overkill", mais
c'était pour les besoins de l'exemple \^\^.

Référence : <https://phpunit.de/manual/current/en/test-doubles.html>

{% endraw %}
