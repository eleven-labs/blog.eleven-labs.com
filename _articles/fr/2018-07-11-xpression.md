---
contentType: article
lang: fr
date: '2018-07-11'
slug: presentation-php-xpression
title: Présentation de la librairie PHP Xpression
excerpt: >-
  En tant que développeur nous avons tous déjà eu besoin de filtrer un jeu de
  donnés (array, collection, API etc...). Nous allons découvrir la librairie
  Xpression qui va nous permettre de filtrer différents contenus avec une
  syntaxe simplifiée.
cover: /assets/2018-07-11-xpression/cover.jpg
categories:
  - php
authors:
  - amoutte
keywords:
  - library
  - symfony
  - query
  - filter
  - querybuilder
  - doctrine
  - orm
  - odm
  - expression
  - collection
---

## Présentation de Xpression

[**Xpression**](https://github.com/Symftony/Xpression) est un parser qui convertit une expression textuelle ([DSL](https://fr.wikipedia.org/wiki/Langage_d%C3%A9di%C3%A9)) en une expression logicielle (**pattern spécification**).
Nous allons voir ce que permet de faire la librairie et comment l'utiliser.

## La syntaxe

Voici plusieurs exemples d'expressions que nous pouvons écrire :

L'âge doit être égal à `26`.

```
age=26
```

L'âge doit être supérieur à `20` (inclus) et inférieur à `30` (exclus).

```
age≥20&age<30
```

Voici la liste des opérateurs supportés par les différents bridges :

Opérateur | Syntaxes | Exemples | ORM | ODM | ArrayCollection | Closure |
-------- | ------ | ------- | --- | --- | --------------- | ------- |
égal | `=` | `param=value` | X | X | X | X |
différent de | `!=` `≠` | `param!=value` `param≠value` | X | X | X | X |
plus grand que | `>` | `param>value` | X | X | X | X |
plus grand ou égal | `>=` `≥` | `param>=value` `param≥value` | X | X | X | X |
plus petit que | `<` | `param<value` | X | X | X | X |
plus petit ou égal | `<=` `≤` | `param<=value` `param≤value` | X | X | X | X |
dans | `[` `]` | `param[value1,value2]` | X | X | X | X |
contient | `{% raw %}{{{% endraw %}` `{% raw %}}}{% endraw %}` | `{% raw %}param{{value}}{% endraw %}` | X | X |  | X |
ne contient pas | `{% raw %}!{{{% endraw %}` `{% raw %}}}{% endraw %}` | `{% raw %}param!{{value}}{% endraw %}` | X | X |  | X |
et | `&` | `param>1&param<10` | X | X | X | X |
non et | `!&` | `param>1!&param<10` |  | X |  | X |
ou | <code>&#124;</code> | <code>param>1&#124;param<10</code> | X | X | X | X |
non ou | <code>!&#124;</code> | <code>param>1!&#124;param<10</code> |  |  |  | X |
ou exclusif | <code>^&#124;</code> `⊕` | <code>param>1^&#124;param<10</code> `param>1⊕param<10` |  |  |  | X |

> Eh oui, la librairie fournit aussi des bridges vers doctrine `ORM`, `ODM` et `common` (pour filter les collections).

### Précédence des opérateurs de composition

Il faut faire attention à la priorité des opérateurs de compositions (`&`, `!&`, `|`, `!|`, `⊕`).
Les grandes priorités sont prises en compte en premier.

- `et`: 15
- `non et`: 14
- `ou`: 10
- `ou exclusif`: 9
- `not or`: 8

Pour gérer correctement vos expressions vous pouvez utiliser les parenthèses `(` `)`.

Par exemple, cette expression sélectionnera les `Raccoon` ou les `Schizo` qui ont plus de 100 points.

`planet='Raccoon'|name='Schizo'&point>100` est identique à `planet='Raccoon'|(name='Schizo'&point>100)`

Alors que l'expression suivante sélectionnera les astronautes `Raccoon` qui ont plus de 100 points ou les `Schizo` qui on plus de 100 points.

`(planet='Raccoon'|name='Schizo')&point>100`

## Utilisation

Nous allons maintenant voir dans quels cas nous pourrions utiliser cette librairie.

## Spécification

Afin d'avoir une spécification nous allons utiliser la classe `ClosureExpressionBuilder`.
En effet cette classe fabrique une callback qui peut être utilisée comme une spécification.

```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// classe avec des getter
class Astronaut {
    private $name;
    private $planet;
    private $points;
    private $rank;

    public function __construct($name, $planet, $points, $rank)
    {
        $this->name = $name;
        $this->planet = $planet;
        $this->points = $points;
        $this->rank = $rank;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getPlanet()
    {
        return $this->planet;
    }

    public function getPoints()
    {
        return $this->points;
    }

    public function getRank()
    {
        return $this->rank;
    }
}

// objet avec des propriétés publiques
$astronaut1 = new \stdClass();
$astronaut1->name = 'Mehdy';
$astronaut1->planet = 'Raccoons of Asgard';
$astronaut1->points = 675;
$astronaut1->rank = 'Captain';

$query = 'planet{{Raccoons}}|points≥1000';

$parser = new Parser(new ClosureExpressionBuilder());
$specification = $parser->parse($query);

$specification(['name' => 'Arnaud', 'planet' => 'Duck Invaders', 'points' => 785, 'rank' => 'Fleet Captain']); // false
$specification($astronaut1);// true
$specification(new Astronaut('Ilan', 'Donut Factory', 1325, 'Commodore')); // true
```

Comme vous pouvez le voir, la spécification est appelable avec un array associatif, des objets avec des attributs publics mais aussi avec des objets qui ont des getters.

## Filtrer un jeu de donnés

Nous allons dans un premier temps filtrer un tableau de données.
Pour ce faire nous allons encore utiliser `ClosureExpressionBuilder`

Nous allons utiliser ces données pour les exemples suivants :

```php
<?php
$astronauts = [
    ['name' => 'Jonathan', 'planet' => 'Duck Invaders', 'points' => 5505, 'rank' => 'Fleet Admiral'],
    ['name' => 'Thierry', 'planet' => 'Duck Invaders', 'points' => 2555, 'rank'=> 'Vice Admiral'],
    ['name' => 'Vincent', 'planet' => 'Donut Factory', 'points' => 1885, 'rank' => 'Rear Admiral'],
    ['name' => 'Rémy', 'planet' => 'Schizo Cats', 'points' => 1810, 'rank' => 'Rear Admiral'],
    ['name' => 'Charles Eric', 'planet' => 'Donut Factory', 'points' => 1385, 'rank' => 'Commodore'],
    ['name' => 'Ilan', 'planet' => 'Donut Factory', 'points' => 1325, 'rank' => 'Commodore'],
    ['name' => 'Alexandre', 'planet' => 'Schizo Cats', 'points' => 1135, 'rank' => 'Commodore'],
    ['name' => 'Noel', 'planet' => 'Duck Invaders', 'points' => 960, 'rank' => 'Fleet Captain'],
    ['name' => 'Damien', 'planet' => 'Donut Factory', 'points' => 925, 'rank' => 'Fleet Captain'],
    ['name' => 'Quentin', 'planet' => 'Donut Factory', 'points' => 910, 'rank' => 'Fleet Captain'],
    ['name' => 'Martin', 'planet' => 'Schizo Cats', 'points' => 860, 'rank' => 'Fleet Captain'],
    ['name' => 'Carl', 'planet' => 'Donut Factory', 'points' => 800, 'rank' => 'Fleet Captain'],
    ['name' => 'Arnaud', 'planet' => 'Duck Invaders', 'points' => 785, 'rank' => 'Fleet Captain'],
    ['name' => 'Alexandre', 'planet' => 'Donut Factory', 'points' => 785, 'rank' => 'Fleet Captain'],
    ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
    ['name' => 'Romain', 'planet' => 'Donut Factory', 'points' => 735, 'rank' => 'Captain'],
    ['name' => 'Julie', 'planet' => 'Donut Factory', 'points' => 735, 'rank' => 'Captain'],
    ['name' => 'Cedric', 'planet' => 'Donut Factory', 'points' => 700, 'rank' => 'Captain'],
    ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
    ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
];
```

Je veux récupérer les astronautes dont la planète contient 'Raccoons'.

```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// jeu de données
$astronauts = [...];

$query = 'planet{{Raccoons}}';

$parser = new Parser(new ClosureExpressionBuilder());
$expression = $parser->parse($query);

$filteredAstronauts = array_filter($astronauts, $expression);
// le tableau ne contient que les astronautes dont la planète contient 'Raccoons'
// $filteredAstronauts = [
//     ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
//     ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
//     ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
// ];
```

> La subtilité dans l'exemple précédent c'est que l'on utilise `$expression` dans un `array_filter`.

Maintenant je veux sélectionner les astronautes qui ont plus de 1000 points mais aussi les `Raccoons`.

```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// jeu de données
$astronauts = [...];

$query = 'planet{{Raccoons}}|points≥1000';

$parser = new Parser(new ClosureExpressionBuilder());
$expression = $parser->parse($query);

$filteredAstronauts = array_filter($astronauts, $expression);
// le tableau contient tous les astronautes qui ont au moins 1000 points, mais aussi les 'Raccoons'
// $filteredAstronauts = [
//     ['name' => 'Jonathan', 'planet' => 'Duck Invaders', 'points' => 5505, 'rank' => 'Fleet Admiral'],
//     ['name' => 'Thierry', 'planet' => 'Duck Invaders', 'points' => 2555, 'rank'=> 'Vice Admiral'],
//     ['name' => 'Vincent', 'planet' => 'Donut Factory', 'points' => 1885, 'rank' => 'Rear Admiral'],
//     ['name' => 'Rémy', 'planet' => 'Schizo Cats', 'points' => 1810, 'rank' => 'Rear Admiral'],
//     ['name' => 'Charles Eric', 'planet' => 'Donut Factory', 'points' => 1385, 'rank' => 'Commodore'],
//     ['name' => 'Ilan', 'planet' => 'Donut Factory', 'points' => 1325, 'rank' => 'Commodore'],
//     ['name' => 'Alexandre', 'planet' => 'Schizo Cats', 'points' => 1135, 'rank' => 'Commodore'],
//     ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
//     ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
//     ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
// ];
```

## Filtrer une ArrayCollection

Pour filtrer une ArrayCollection il suffit d'utiliser le bridge `Symftony\Xpression\Bridge\Doctrine\Common\ExpressionBuilderAdapter`.

```php
<?php
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\ExpressionBuilder;
use Symftony\Xpression\Bridge\Doctrine\Common\ExpressionBuilderAdapter;
use Symftony\Xpression\Parser;

// jeu de données
$astronauts = [...];

// on wrap l'array dans une `ArrayCollection`
$astronauts = new ArrayCollection($astronauts);

$parser = new Parser(new ExpressionBuilderAdapter(new ExpressionBuilder()));
$expression = $parser->parse($query);
$filteredAstronauts = $astronauts->matching(new Criteria($expression));
```

> ℹ️ Les `ArrayCollection` sont les objets utilisés par doctrine pour les relations (oneToMany, manyToMany etc...).

> Pour filtrer une `Collection` vous pouvez utiliser `ClosureExpressionBuilder` vu précédemment et l'injecter dans `Collection::filter(Closure $p)`.

## Filtrer des données stockées en base

### Doctrine ODM

Bien, maintenant imaginons que ces données soient dans une base de données MongoDB.

> Accrochez-vous, ça va être compliqué !

```php
<?php
use Doctrine\Common\EventManager;
use Doctrine\MongoDB\Connection;
use Doctrine\MongoDB\Database;
use Symftony\Xpression\Bridge\Doctrine\MongoDb\ExprBuilder;
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// Initialisation de la connexion
$connection = new Connection('mongodb://localhost');
$database = $connection->selectDatabase('eleven-labs');
$collection = $database->selectCollection('astronauts');

$query = 'planet{{Raccoons}}|points≥1000';

$parser = new Parser(new ExprBuilder());
$queryBuilder = $parser->parse($query);
$astronauts = $collection->createQueryBuilder()->setQueryArray($queryBuilder->getQuery())->getQuery()->execute();
// $astronauts est un Doctrine\MongoDB\Cursor
// iterator_to_array($astronauts) = [
//     ['name' => 'Jonathan', 'planet' => 'Duck Invaders', 'points' => 5505, 'rank' => 'Fleet Admiral'],
//     ['name' => 'Thierry', 'planet' => 'Duck Invaders', 'points' => 2555, 'rank'=> 'Vice Admiral'],
//     ['name' => 'Vincent', 'planet' => 'Donut Factory', 'points' => 1885, 'rank' => 'Rear Admiral'],
//     ['name' => 'Rémy', 'planet' => 'Schizo Cats', 'points' => 1810, 'rank' => 'Rear Admiral'],
//     ['name' => 'Charles Eric', 'planet' => 'Donut Factory', 'points' => 1385, 'rank' => 'Commodore'],
//     ['name' => 'Ilan', 'planet' => 'Donut Factory', 'points' => 1325, 'rank' => 'Commodore'],
//     ['name' => 'Alexandre', 'planet' => 'Schizo Cats', 'points' => 1135, 'rank' => 'Commodore'],
//     ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
//     ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
//     ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
// ];
```

> Ha bah non ! C'est super simple en fait

### Doctrine ORM

Et pour doctrine/orm alors ?

```php
<?php
use Doctrine\ORM\Tools\Setup;
use Symftony\Xpression\Bridge\Doctrine\ORM\ExprAdapter;
use Symftony\Xpression\Expr\MapperExpressionBuilder;
use Symftony\Xpression\Parser;

// dans cet exemple j'utilise l'annotation reader pour la configuration de mon schéma
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__ . "/Orm/Entity"), true, null, null, false);
$entityManager = EntityManager::create(array(
    // votre configuration d'accès à votre base de donnés
    'driver' => 'pdo_sqlite',
    'path' => __DIR__ . '/ORM/astronauts.sqlite',
), $config);

$query = 'planet{{Raccoons}}|points≥1000';

// utilisation de MapperExpressionBuilder pour ajouter dynamiquement l'alias `a` aux champs de la query
$parser = new Parser(new MapperExpressionBuilder(new ExprAdapter(new Expr()), ['*' => 'a.%s']));
$expression = $parser->parse($query);
$qb = $entityManager->getRepository('Example\Orm\Entity\Product')->createQueryBuilder('a');
$astronauts = $qb->where($expression)->getQuery()->execute();
// $astronauts = [
//     ['name' => 'Jonathan', 'planet' => 'Duck Invaders', 'points' => 5505, 'rank' => 'Fleet Admiral'],
//     ['name' => 'Thierry', 'planet' => 'Duck Invaders', 'points' => 2555, 'rank'=> 'Vice Admiral'],
//     ['name' => 'Vincent', 'planet' => 'Donut Factory', 'points' => 1885, 'rank' => 'Rear Admiral'],
//     ['name' => 'Rémy', 'planet' => 'Schizo Cats', 'points' => 1810, 'rank' => 'Rear Admiral'],
//     ['name' => 'Charles Eric', 'planet' => 'Donut Factory', 'points' => 1385, 'rank' => 'Commodore'],
//     ['name' => 'Ilan', 'planet' => 'Donut Factory', 'points' => 1325, 'rank' => 'Commodore'],
//     ['name' => 'Alexandre', 'planet' => 'Schizo Cats', 'points' => 1135, 'rank' => 'Commodore'],
//     ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
//     ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
//     ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
// ];
```

⚠️ Lorsque l'on crée un queryBuilder avec l'ORM il faut spécifier un alias `EntityRepository::createQueryBuilder($alias)`. C'est pourquoi il ne reconnait pas le champ `planet` dans la query.

La première solution serait d'écrire les champs avec l'alias dans la query initiale ce qui donnerait `a.planet{{Raccoons}}|a.points≥1000`. Le problème de cet approche c'est que des informations de structure de base de données leakent dans la query.

La seconde solution est d'utiliser la classe `MapperExpressionBuilder`. En effet cette classe va décorer l'`ExpressionBuilder` pour ajouter les alias directement au moment où le queryBuilder va être configuré.

Dans l'exemple suivant on indique que tous les champs (`*`) de la query sont préfixés avec `a.`.

```php
$parser = new Parser(
    new MapperExpressionBuilder(
        new ExprAdapter(new Expr()),
        ['*' => 'a.%s']
    )
);
```

## Filtrer un endpoint d'API

Actuellement si vous voulez filtrer votre API vous pouvez :

 - utiliser GraphQL.

> Ce n'est pas la solution la plus légère à implementer. N'est pas forcément adaptée pour faire uniquement du filtrage de données.

 - récupérer les paramètres de requête manuellement et fabriquer votre query avec tous un tas de condition

> la syntaxe http des paramètres n'est pas lisible et peut devenir très lourde pour des requêtes complexes.

Bonne nouvelle ! Si votre API utilise une des sources de données vu précédemment, vous pouvez filtrer les données à l'aide d'`Xpression`.

> Gardez à l'esprit que Xpression remplit un rôle différent de GraphQL

Nous allons voir un exemple d'utilisation du [Bundle Xpression](https://github.com/Symftony/Xpression-Bundle).

Installez le bundle via `composer require symftony/xpression-bundle` puis ajoutez-le dans symfony (AppKernel.php ou bundle.php).

Il faut également activer la correction de querystring pour que les caractères réservés soient correctement utilisés.

```php
<?php
// public/index.php ou web/app.php (web/app_dev.php)
// ...
\Symftony\Xpression\QueryStringParser::correctServerQueryString(); // ajoutez cette ligne juste avant la création de la Requete
$request = Request::createFromGlobals();
// ...
```

Pour l'utiliser il vous suffit uniquement d'ajouter l'annotation `@Xpression(expressionBuilder="odm")` au-dessus du controller que vous souhaitez filtrer.

```php
<?php
namespace App\Controller;

use App\Document\Astronaut;
use App\Repository\AstronautsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symftony\XpressionBundle\Annotations\Xpression;

class AstronautController extends AbstractController
{
    /**
     * @Xpression(expressionBuilder="odm")
     *
     * @return JsonResponse
     */
    public function list(AstronautsRepository $astronautsRepository, $query = null)
    {
        $qb = $astronautsRepository->createQueryBuilder();
        if (null !== $query) {
            $qb->setQueryArray($query->getQuery());
        }

        return $this->json($qb->getQuery()->execute());
    }
}
```

Vous pouvez également configurer les options suivantes :

 - source (la source de la query (request, query, attributes, cookies, files, server, headers default: query))
 - sourceName (le nom du param, dans la source, qui contient l'expression default:query)
 - targetName (le nom de l'argument a injecter dans le controller default:query)
 - expressionBuilder (le nom de l'expressionBuilder à utiliser *requis*)

Maintenant vous pouvez vous rendre sur votre URL et y ajouter votre Xpression dans `query`.


```
http://localhost/astronauts/list?query={planet{{Raccoons}}|points≥1000}
```

## Mots de la fin

Je vais m'arrêter là pour la présentation de cette librairie PHP.
Je vous invite à tester la librairie et à y contribuer (idée, bugs, features, documentation, etc).

Voici une petite liste des futures ajouts dans la librairie :
- fixer l'utilisation des paramètres de query (placeholder).
- créer d'autre bridges.
- refacto le coeur de la librairie afin d'être extensible (pouvoir ajouter des syntaxes).
- implémenter un builder de query en PHP et JS afin de pouvoir créer directement le query textuel.

## Liens utiles

- [Demo Xpression](http://symftony-xpression.herokuapp.com/)
- [Code source Xpression](https://github.com/Symftony/Xpression)
- [Code source Xpression-bundle](https://github.com/Symftony/Xpression-Bundle)
