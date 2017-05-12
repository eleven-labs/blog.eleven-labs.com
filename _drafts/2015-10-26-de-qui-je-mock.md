---
layout: post
title: De qui je me mock !
author: tthuon
date: '2015-10-26 17:28:08 +0100'
date_gmt: '2015-10-26 16:28:08 +0100'
categories:
- Symfony
tags:
- symfony
- phpunit
---

<a href="https://phpunit.de/">PHPUnit</a> est un outil de test puissant. Il permet de tester de manière unitaire l'ensemble de son projet.

Dans cet article, je vais me concentrer sur les mock et les stub d'objet.

### Mock, stub, what else ?
Lorsque l'on teste unitairement une classe, très souvent, cette classe a des dépendances avec d'autres classes (qui elles-mêmes ont des dépendances avec d'autres classes.). L'objectif du test unitaire est de tester la classe cible, et uniquement cette classe. En admettant que les classes dépendantes soient fiables et retournent ce qui est attendu, il ne reste plus que la classe cible à tester.

Un "<strong>stub</strong>" est un objet qui va simuler les différentes classes utilisées par la classe cible. Cet objet va toujours retourner la même valeur, quels que soient ses paramètres.

Un "<strong>mock</strong>" est un "<strong>stub</strong>" dans lequel on va vérifier des attentes à des appels de méthodes. Par exemple, je vérifie qu'une méthode est appelée une fois.

### Stub, un simple bouchon
Je vais rentrer directement dans le cœur du sujet avec un exemple simple.

J'ai les classes suivantes:

<pre class="lang:php decode:true ">
{% raw %}
&lt;?php

class Bouteille
{
    private $bouchon;

    public function __construct(Bouchon $bouchon)
   {
         $this-&gt;bouchon = $bouchon;
    }

    public function getBouchon()
    {
         return $this-&gt;bouchon;
    }

    public function open()
    {
        $this-&gt;bouchon-&gt;popIt();
    }
}

class Bouchon
{
     private $type;

     public function __construct($type)
     {
         $this-&gt;type = $type;
     }

     public function popIt()
     {
         return true;
     }
}{% endraw %}
</pre>

La classe Bouteille a besoin de la classe Bouchon (une bouteille sans bouchon, c'est inutile).

Je vais tester ma classe Bouteille et bouchonner la méthode <span class="lang:default decode:true crayon-inline ">getBouchon()</span>

<pre class="lang:default decode:true">
{% raw %}
&lt;?php

class BouteilleTest extends \PHPUnit_Framework_TestCase
{
    public function testGetBouchon()
    {
        $bouteille = $this-&gt;getMockBuilder("Bouteille")-&gt;disableOriginalConstructor()-&gt;getMock();
        $bouteille-&gt;method("getBouchon")-&gt;will($this-&gt;returnValue(new Bouchon));

        $this-&gt;assertInstanceOf("Bouchon", $bouteille-&gt;getBouchon());
    }
}
{% endraw %}
</pre>

Tout d'abord, je crée le stub avec la méthode <span class="lang:default decode:true crayon-inline ">getMockBuilder()</span> . Il prend en paramètre le nom de la classe. J'ai chaîné un appel à la méthode <span class="lang:default decode:true crayon-inline ">disableOriginalConstructor()</span>  car je ne veux pas que le stub utilise le constructeur de la classe <span class="lang:default decode:true crayon-inline ">Bouteille()</span>  pour se construire. Enfin, la méthode <span class="lang:default decode:true crayon-inline ">getMock()</span> me retourne le bouchon.

A la ligne 8, je configure le bouchon. <span class="lang:default decode:true crayon-inline ">-&gt;method()</span> . Il prend en paramètre le nom de la méthode à bouchonner. Ici, c'est <span class="lang:default decode:true crayon-inline ">getBouchon()</span> . <span class="lang:default decode:true crayon-inline ">-&gt;will()</span> indique la valeur qui va être retournée. Je place en paramètre une instance de <span class="lang:default decode:true crayon-inline ">Bouchon()</span>  : <span class="lang:default decode:true crayon-inline ">$this-&gt;returnValue(new Bouchon())</span> .

Enfin, ligne 10, je vérifie que <span class="lang:default decode:true crayon-inline ">getBouchon()</span>  est bien une instance de <span class="lang:default decode:true crayon-inline ">Bouchon()</span> .

Ce test démontre l'utilisation d'un bouchon. Le bouchon va toujours retourner la même valeur. Ici, je bouchonne la méthode <span class="lang:default decode:true crayon-inline ">getBouchon()</span>  pour toujours retourner une instance de <span class="lang:default decode:true crayon-inline ">Bouchon()</span> .

Maintenant, je vais tester que ma fonction <span class="lang:default decode:true crayon-inline ">open()</span> ouvre bien la bouteille et fait appel à la méthode <span class="lang:default decode:true crayon-inline ">popIt()</span>  de la classe <span class="lang:default decode:true crayon-inline ">Bouchon()</span> .

### Mock, le bouchon intelligent
Mon test va s’intéresser à la classe <span class="lang:default decode:true crayon-inline ">Bouchon()</span> . Je veux vérifier que la méthode <span class="lang:default decode:true crayon-inline ">popIt()</span>  est appelée une fois lorsque j'appelle la méthode <span class="lang:default decode:true crayon-inline ">open()</span>  de la classe <span class="lang:default decode:true crayon-inline ">Bouteille()</span> .

<pre class="lang:default decode:true">
{% raw %}
&lt;?php

class BouteilleTest extends \PHPUnit_Framework_TestCase
{
    public function testOpen()
    {
        $bouchon = $this-&gt;getMock("Bouchon");
        $bouchon-&gt;expect($this-&gt;once())-&gt;method("popIt");

        $bouteille = new Bouteille($bouchon);
        $bouteille-&gt;open();
    }
}
{% endraw %}
</pre>

La différence avec le test précédent est l'<strong>assertion</strong> dans la configuration du mock.

A la ligne 7, la méthode <span class="lang:default decode:true crayon-inline ">-&gt;expect()</span>  est l'assertion. Le paramètre prend en valeur le nombre de fois que la méthode sera appelée. Ici, c'est une fois <span class="lang:default decode:true crayon-inline ">$this-&gt;once()</span>  .

### Et avec Symfony ?
Nous avons vu des exemples très théoriques sur l'utilisation des stub et des mock. Qu'en est-il avec Symfony ?

Je vais prendre un exemple concret où un service fait appel au repository pour avoir des données depuis la base de données. Le service <span class="lang:default decode:true crayon-inline ">UserService()</span>  a une méthode <span class="lang:default decode:true crayon-inline ">generateReport()</span>  qui génère un rapport au format JSON. Pour avoir les statistiques de l'utilisateur, je vais créer une méthode <span class="lang:default decode:true crayon-inline ">getStatsForUser()</span> qui va me retourner un array. Le contenu de la méthode ne m’intéresse pas car je vais le bouchonner. Par contre, je sais que cette méthode doit retourner un array.

Mon repository:

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

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
}{% endraw %}
</pre>

Mon service:

<pre class="lang:default decode:true ">
{% raw %}
&lt;?php

namespace App\AppBundle\Service;

use Doctrine\ODM\MongoDB\DocumentManager;

class UserService
{
    private $manager;

    public function __construct(DocumentManager $manager)
    {
        $this-&gt;manager = $manager;
    }

    public function generateReport($userId)
    {
        if (!$stats = $this-&gt;manager-&gt;getRepository("User")-&gt;getStatsForUser($userId)){
             return;
        }

        return json_encode($stats);
    }
}{% endraw %}
</pre>

Mon test:

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

namespace App\AppBundle\Tests;

class UserServiceTest extends \PHPUnit_Framework_TestCase
{
  public function testGenerateReport()
  {
    $values = [
        "userId" =&gt; "dummy-user-id",
        "nbArticle" =&gt; 5,
        "lastPublication" =&gt; "2015-10-04T11:11:00+0200"
    ];

    $expectedString = '{"userId":"dummy-user-id", "nbArticle":5, "lastPublication":"2015-10-04T11:11:00+0200"}';

    $repository = $this-&gt;getMockBuilder('App\AppBundle\Repository\UserRepository')
      -&gt;disableOriginalConstructor()
      -&gt;getMock();
    $repository
      -&gt;expect($this-&gt;once())
      -&gt;method('getStatsForUser')
      -&gt;with("dummy-user-id")
      -&gt;will($this-&gt;returnValue($values));

    $manager = $this-&gt;getMockBuilder('Doctrine\ODM\MongoDB\DocumentManager')
        -&gt;disableOriginalConstructor()
        -&gt;getMock();
    $manager-&gt;expect($this-&gt;any())-&gt;method("getRepository")-&gt;will($this-&gt;returnValue($repository));

    $service = new UserService($manager);

    $this-&gt;assertEquals($expectedString, $service-&gt;generateReport("dummy-user-id"))
  }
}
{% endraw %}
</pre>

Dans ce test, j'ai décomposé bloc par bloc.

<ul>
<li>ligne 9: c'est l'array qui sera retourné par la méthode <span class="lang:default decode:true crayon-inline ">getStatsForUser()</span></li>
<li>ligne 15: la valeur finale de la méthode <span class="lang:default decode:true crayon-inline ">generateReport()</span></li>
<li>lignes 17-24: je mock le repository et bouchonne la méthode <span class="lang:default decode:true crayon-inline ">getStatsForUser()</span> . J'utilise la variable <span class="lang:default decode:true crayon-inline ">$values</span>  pour indiquer la valeur de retour de la méthode bouchonnée.</li>
<li>lignes 26-29: je mock le document manager. Il va retourner le repository que j'ai précédemment configuré.</li>
<li>ligne 31: j'injecte le mock dans mon service <span class="lang:default decode:true crayon-inline">UserService()</span></li>
<li>ligne 33: j'appelle la méthode <span class="lang:default decode:true crayon-inline ">generateReport()</span>  et je vérifie que j'ai bien la valeur de <span class="lang:default decode:true crayon-inline ">$expectedString</span> .</li>
</ul>
Le test permet de bien comprendre comment fonctionnent les différents objets et les différentes interactions.

Voilà !

N.B. : Injecter le document manager est totalement "overkill", mais c'était pour les besoins de l'exemple ^^.

Référence : <a href="https://phpunit.de/manual/current/en/test-doubles.html">https://phpunit.de/manual/current/en/test-doubles.html</a>


