---
layout: post
title: Mutation Testing - Vérifiez la qualité de vos tests unitaires
author: rgraillon
date: '2016-10-19 13:28:58 +0200'
date_gmt: '2016-10-19 11:28:58 +0200'
categories:
- Php
tags: []
---

### Les tests unitaires et la confiance

Ce n'est plus à démontrer : les tests unitaires sont incontournables dans le développement d'une application. Ils permettent de mettre en évidence d'éventuelles régressions apportées lors de modifications du code, et donc au développeur d'acquérir une certaine confiance à mettre le code en production : si les tests passent, c'est que tout fonctionne correctement.

Pour mesurer cette confiance, on utilise principalement comme métrique la couverture de code. Plus la couverture est grande (proche de 100%), moins il y a de chances qu'une régression passe entre les mailles du filet.
Mais attention ! Cette affirmation n'est que purement théorique !

### Couverture vs protection

Nous allons voir que dans certains cas la couverture de code n'est qu'un faux indicateur de protection.
Voici un exemple simple :

```php
<?php

class Astronaut {}

class SpaceShip
{
    private $capacity;
    public $astronauts = [];

    public function __construct($capacity)
    {
        $this->capacity = $capacity;
    }

    public function addAstronaut(Astronaut $astronaut)
    {
        if (count($this->astronauts) < $this->capacity) {
            $this->astronauts[] = $astronaut;
        }
    }
}
```

Ici notre classe *SpaceShip* a une méthode publique *addAstronaut* qui ajoute une instance de *Astronaut* uniquement si la capacité maximale n'est pas atteinte.
Voyons un exemple de test unitaire associé :

```php
<?php

class SpaceShipTest extends \PHPUnit_Framework_TestCase
{
    public function testAddAstronaut()
    {
        $spaceShip = new SpaceShip(1);

        $spaceShip->addAstronaut(new Astronaut());

        $this->assertCount(1, $spaceShip->astronauts);
    }
}
```

Le test vérifie ici que la méthode ajoute bien une entrée au tableau d'astronautes. En lançant les tests nous avons une couverture de 100% (même sans assertion nous aurions eu ce résultat).
Mais nous ne sommes pas protégés pour autant : que se passerait-il si la méthode *addAstronaut* changeait ?
Notre test suffira-t-il à détecter une régression ?

### Tests de Mutation

Pour détecter les failles dans vos tests unitaires, il existe une solution : les **tests de mutation**.

Le principe est simple : altérer le code source pour vérifier que les tests associés échouent en conséquence.
Afin d'y parvenir, voici les étapes nécessaires :

-   Lancer la suite de tests une première fois pour vérifier que tous les tests passent (il est inutile d'essayer de faire échouer un test qui échoue déjà !)
-   Relancer la suite en modifiant certaines parties du code testé.
-   Vérifier que les tests échouent lorsque le code testé a subi une mutation.
-   Recommencer autant de fois qu'il y a de mutations possibles.

Évidemment, pas la peine de faire tout ça à la main, il existe des frameworks qui vont s'en occuper pour nous.

Mais avant de voir ça de plus près, voici un peu de vocabulaire :

-   **Mutant** : Altération unitaire du code (ex: un !== remplacé par un ===)
-   **Killed/Captured** : On dit qu'un mutant est tué si le test unitaire échoue (résultat positif)
-   **Escaped** : Un mutant s'échappe si le test unitaire n'échoue pas (résultat négatif)
-   **Uncovered** : Un mutant n'est pas couvert si aucun test ne couvre le code qui porte le mutant.

### Mise en pratique avec Humbug

Ici nous utiliserons [Humbug](https://github.com/padraic/humbug), un framework parmi d'autres qui permet de faire des tests de mutation en PHP.

Lorsque nous lançons Humbug avec notre exemple de tout à l'heure, nous obtenons :

```txt
$> humbug
...
Mutation Testing is commencing on 1 files...
(.: killed, M: escaped, S: uncovered, E: fatal error, T: timed out)

M.

2 mutations were generated:
       1 mutants were killed
       0 mutants were not covered by tests
       1 covered mutants were not detected
       0 fatal errors were encountered
       0 time outs were encountered

Metrics:
    Mutation Score Indicator (MSI): 50%
    Mutation Code Coverage: 100%
    Covered Code MSI: 50%
```

Diantre ! Un mutant nous a échappé ! Voyons dans le fichier de de log :

```txt
1) \Humbug\Mutator\ConditionalBoundary\LessThan
Diff on \SpaceShip::addAstronaut() in src/SpaceShip.php:
--- Original
+++ New
@@ @@
     {
-        if (count($this->astronauts) < $this->capacity) {
+        if (count($this->astronauts) <= $this->capacity) {
             $this->astronauts[] = $astronaut;
         }
     }
 }
```

Nos tests n'ont pas détecté le changement d'opérateur de comparaison. En effet, nous n'avons pas testé le cas où notre vaisseau spatial est plein. À présent, ajoutons un test pour couvrir ce use-case :

```php
<?php

class SpaceShipTest extends \PHPUnit_Framework_TestCase
{
    public function testAddsAstronautWhenShipNotFull()
    {
        $spaceShip = new SpaceShip(1);

        $spaceShip->addAstronaut(new Astronaut());

        $this->assertCount(1, $spaceShip->astronauts);
    }

    public function testDoesNotAddAstronautWhenShipFull()
    {
        $spaceShip = new SpaceShip(0);

        $spaceShip->addAstronaut(new Astronaut());

        $this->assertCount(0, $spaceShip->astronauts);
    }
}
```

Maintenant relançons Humbug :

```txt
$> humbug
...
Mutation Testing is commencing on 1 files...
(.: killed, M: escaped, S: uncovered, E: fatal error, T: timed out)

..

2 mutations were generated:
       2 mutants were killed
       0 mutants were not covered by tests
       0 covered mutants were not detected
       0 fatal errors were encountered
       0 time outs were encountered

Metrics:
    Mutation Score Indicator (MSI): 100%
    Mutation Code Coverage: 100%
    Covered Code MSI: 100%
```

Et voilà, cette fois aucun mutant ne s'est échappé, notre suite de tests est vraiment efficace, ce bug éventuel n'arrivera jamais jusqu'à la production !
Evidemment, l'exemple choisi ici est volontairement simple et n'est pas très évocateur, mais dans le code métier au cœur de votre application, vous avez certainement des use-case beaucoup plus sensibles.

Pour parvenir à ses fins, Humbug est capable de générer tout un éventail de mutations :

-   Remplacement d'opérateurs de comparaison (**&gt;** par **&gt;=**, **!==** par **===**, etc...)
-   Remplacement de constantes (**0** par **1**, **true** par **false**, etc...)
-   Remplacement des opérateurs logiques (**&&**, **||**, etc...)
-   Remplacement des opérateurs binaires (**&**, **|**, **%**, etc...)
-   Remplacement des valeurs de retour d'une fonction

Je ne vais pas tout détailler ici, si vous voulez en savoir plus je vous invite à consulter la [page GitHub du projet](https://github.com/padraic/humbug).

### Conclusion

Les tests de mutation sont un moyen simple et efficace de détecter la fiabilité des tests unitaires. La couverture de code n'est pas une métrique très fiable, un code peut être couvert à 100% sans une seule assertion !
Nous avons vu avec Humbug que nous pouvons automatiser ces tests, il devient alors possible de les greffer dans notre workflow d'intégration continue. Attention toutefois au temps d'exécution qui grandit de manière exponentielle lorsque la base de code grandit, on utilisera en priorité les tests de mutation là où il y a un véritable enjeu : le code métier.
