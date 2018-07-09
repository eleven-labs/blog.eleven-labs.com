---
layout: post
title: "Présentation de la librairie PHP Xpression"   
lang: fr
permalink: /fr/presentation-php-xpression/  
excerpt: "En tant que developpeur nous avons tous déjà eu besoin de filtrer un jeu de donnés (array, collection, API etc...). Nous allons donc découvrir la librairie Xpression qui va nous permettre de filtrer différent contenus avec une syntaxe simplifier."
authors:  
    - amoutte  
categories:
    - php
    - library
    - symfony
    - query
    - filter
    - querybuilder
    - orm
    - odm
    - expression
    - collection
tags:
    - php
    - library
    - symfony
    - query
    - filter
    - querybuilder
    - orm
    - odm
    - expression
    - collection
---

# Présentation de Xpression

[**Xpression**](https://github.com/Symftony/Xpression) est un parser qui converti une expression textuelle ([DSL](https://fr.wikipedia.org/wiki/Langage_d%C3%A9di%C3%A9) en une expression logiciel (**pattern spécification**).
Nous allons donc voir ce que permet de faire la librairie et comment l'utiliser.

# La syntaxe

Voici plusieurs exemples d'expression que nous pouvons écrire:

L'age doit être égal à `26`.

```
age=26
```

L'age doit être supérieur à `20` (inclus) `et inférieur à `30` (exclus).

```
age≥20&age<30
```

Voici la liste des opérateurs supportés

Operateur | Syntax | Exemple | ORM | ODM | ArrayCollection | Closure |
-------- | ------ | ------- | --- | --- | --------------- | ------- |
égal | `=` | `param=value` | X | X | X | X |
différent de | `!=` `≠` | `param!=value` `param≠value` | X | X | X | X |
plus grand que | `>` | `param>value` | X | X | X | X |
plus grand ou égal | `>=` `≥` | `param>=value` `param≥value` | X | X | X | X |
plus petit que | `<` | `param<value` | X | X | X | X |
plus petit ou égal | `<=` `≤` | `param<=value` `param≤value` | X | X | X | X |
dans | `[` `]` | `param[value1,value2]` | X | X | X | X |
contient | `{{` `}}` | `param{{value}}` | X | X |  | X |
ne contient pas | `!{{` `}}` | `param!{{value}}` | X | X |  | X |
et | `&` | `param>1&param<10` | X | X | X | X |
non et | `!&` | `param>1!&param<10` |  | X |  | X |
ou | <code>&#124;</code> | <code>param>1&#124;param<10</code> | X | X | X | X |
non ou | <code>!&#124;</code> | <code>param>1!&#124;param<10</code> |  |  |  | X |
ou exclusif | <code>^&#124;</code> `⊕` | <code>param>1^&#124;param<10</code> `param>1⊕param<10` |  |  |  | X |

> Et oui la librairie fournis aussi des bridges vers doctrine `ORM`, `ODM` et `common` (pour filter les collections).

### Précédence des opérateurs de composition

Il faut faire attention à la priorité des opérateurs de compositions (`&`, `!&`, `|`, `!|`, `⊕`).
Les grandes priorités sont prisent en compte en premier.

- `et`: 15
- `non et`: 14
- `ou`: 10
- `ou exclusif`: 9
- `not or`: 8

Pour gerer correctement vos expressions vous pouvez utiliser les parenthèses `(` `)`.

Par exemple cette expression selectionnera les `Raccoon` ou les `Schizo` qui ont plus de 100 points.

`planet='Raccoon'|name='Schizo'&point>100` et identique à `planet='Raccoon'|(name='Schizo'&point>100)`
 
Alors que l'expression suivante selectionnera les astronautes `Raccoon` qui on plus de 100 points ou les `Schizo` qui on plus de 100 points. 
 
`(planet='Raccoon'|name='Schizo')&point>100` 

# Utilisation

Nous allons maintenant voir dans quel cas nous pourrions utilisé cette librairie.

## Spécification

Afin d'avoir une specification nous allons utiliser la classe `ClosureExpressionBuilder`.
En effet cette class fabrique une callback qui peu être utilisé comme une spécification.

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

// object avec des propriété public
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

Comme vous pouvez le voir la spécification est appelable avec un array associatif, des objets avec des attributs public mais aussi avec des objet qui ont des getter.

## Filtrer un jeu de donnés

Nous allons dans un premier temps filtrer un tableau de donnés.
Pour ce faire nous allons encore utiliser `ClosureExpressionBuilder`

Nous allons utilisé ces donnés pour les exemples suivant.

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

Je veu récuperer les astronautes dont la planete contient 'Raccoons'.

```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// jeu de donnés
$astronauts = [...];

$query = 'planet{{Raccoons}}';

$parser = new Parser(new ClosureExpressionBuilder());
$expression = $parser->parse($query);

$filteredAstronauts = array_filter($astronauts, $expression);
// le tableau ne contient que les astronautes dont la planete contient 'Raccoons'
// $filteredAstronauts = [
//     ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
//     ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
//     ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
// ];
```

Maintenant je veu selectionner les astronautes qui ont plus de 1000 points mais les `Raccoons` aussi.

```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// jeu de donnés
$astronauts = [...];

$query = 'planet{{Raccoons}}|points≥1000';

$parser = new Parser(new ClosureExpressionBuilder());
$expression = $parser->parse($query);

$filteredAstronauts = array_filter($astronauts, $expression);
// le tableau contient tous les astronautes qui on au moins 1000 points, mais aussi les 'Raccoons'
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

> La subtilitée dans l'exemple précédent c'est que l'on utilise `$expression` dans un `array_filter`.

## Filtrer une ArrayCollection

Pour filtrer une ArrayCollection il suffit d'utilisé le bridge `Symftony\Xpression\Bridge\Doctrine\Common\ExpressionBuilderAdapter`. 

```php
<?php
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\ExpressionBuilder;
use Symftony\Xpression\Bridge\Doctrine\Common\ExpressionBuilderAdapter;
use Symftony\Xpression\Parser;

// jeu de donnés
$astronauts = [...];

// on wrap l'array dans une `ArrayCollection`
$astronauts = new ArrayCollection($astronauts);

$parser = new Parser(new ExpressionBuilderAdapter(new ExpressionBuilder()));
$expression = $parser->parse($query);
$filteredAstronauts = $astronauts->matching(new Criteria($expression));
```

> ℹ️ Les `ArrayCollection` sont les objets utilisés par doctrine pour les relations (oneToMany, manyToMany etc...).

> Pour filtrer une `Collection` vous pouvez utiliser `ClosureExpressionBuilder` vu précédemment et l'injecter dans `Collection::filter(Closure $p)`.

## Filtrer des donnés stoquer en base
 
### Doctrine ODM

Ok maintenant imaginons que ces donnés sont dans une base de donnés MongoDB.

> Accrochez vous ça vas être compliqué !

```php
<?php
use Doctrine\Common\EventManager;
use Doctrine\MongoDB\Connection;
use Doctrine\MongoDB\Database;
use Symftony\Xpression\Bridge\Doctrine\MongoDb\ExprBuilder;
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// Initialisation de la connection
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

> Ha bah non ! C'est super simple

### Doctrine ORM

Et pour doctrine/orm alors ?

```php
<?php
use Doctrine\ORM\Tools\Setup;
use Symftony\Xpression\Bridge\Doctrine\ORM\ExprAdapter;
use Symftony\Xpression\Expr\MapperExpressionBuilder;
use Symftony\Xpression\Parser;

// dans cette exemple j'utilise l'annotation reader pour la configuration de mon schéma
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__ . "/Orm/Entity"), true, null, null, false);
$entityManager = EntityManager::create(array(
    // votre configuration d'accès à votre base de donnés
    'driver' => 'pdo_sqlite',
    'path' => __DIR__ . '/ORM/astronauts.sqlite',
), $config);

$query = 'planet{{Raccoons}}|points≥1000';

// utilisation de MapperExpressionBuilder pour ajouter dynamiquement l'alias `a` au champs de la query
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
 
⚠️ Lorsque l'on crée un queryBuilder avec l'ORM il faut spécifier un alias `EntityRepository::createQueryBuilder($alias)`. C'est pourquoi il ne reconnais pas le champ `planet` dans la query.

La première solution serais d'écrire les champs avec l'alias dans la query initial ce qui donnerait `a.planet{{Raccoons}}|a.points≥1000`. Le problème de cette approche c'est que des informations de structure de base de donnés leak dans la query.

La seconde solution est d'utiliser la class `MapperExpressionBuilder`. En effet cette class vas décorer l'`ExpressionBuilder` pour ajouter les alias directement au moment ou le queryBuilder va être configuré.

Dans l'exemple suivant on indique que tous les champs (`*`) de la query sont préfixé avec `a.`.

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
 
> Ce n'est pas la solution la plus légère à implementer. N'est pas forcement adapté pour faire uniquement du filtrage de donnés. 
 
 - récuperer les parametres de requête manuellement et fabriquer votre query avec tous un tas de condition

> la syntaxe http des paramètres n'est pas lisible et peu devenir très lourde pour des requêtes complexe.

Bonne nouvelle! Si votre API utilise une des sources de donnés vu précédemment vous pouvez filtrer les donnés à l'aide d'`Xpression`.

> Garder à l'esprit que Xpression remplis un rôle différent que GraphQL

Nous allons voir un exemple d'utilisation du [Bundle Xpression](https://github.com/Symftony/Xpression-Bundle).

Installer le bundle via `composer require symftony/xpression-bundle` puis ajouter le dans symfony (AppKernel.php ou bundle.php).

Il faut également activer la correction de querystring pour que les caractères résèrvé soit correctement utiliser.

```php
<?php
// public/index.php ou web/app.php (web/app_dev.php)
// ...
\Symftony\Xpression\QueryStringParser::correctServerQueryString(); // ajouter cette ligne juste avant la création de la Requete
$request = Request::createFromGlobals();
// ...
``` 

Pour l'utiliser il vous suffit uniquement d'ajouter l'annotation `@Xpression(expressionBuilder="odm")` au dessus du controller que vous souhaitez filtrer.

```php
<?php
namespace App\Controller;

use App\Document\Article;
use App\Repository\AstronautsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symftony\XpressionBundle\Annotations\Xpression;

class ArticleController extends AbstractController
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

Vous pouvez également configurer les options suivantes: 

 - source (la source de la query (request, query, attributes, cookies, files, server, headers default: query))
 - sourceName (le nom du param, dans la source, qui contient l'expression default:query) 
 - targetName (le nom de l'argument a injecter dans le controller default:query)
 - expressionBuilder (le nom de l'expressionBuilder à utiliser *requis*)

Je vais m'arrêter la pour la présentation de cette librairie PHP.
Je vous invite à tester la librairie et à y contribuer (idée, bugs, feature, documentation, etc).

Voici une petite liste des futures ajout dans la librairie :
- fixer l'utilisation des paramètres de query (placeholder).
- créer d'autre bridge.
- refacto le coeur de la librairie afin d'etre extensible (pouvoir ajouter des syntaxes).
- implementer un builder de query en PHP et JS afin de pouvoir créé directement le query textuelle. 

## Liens utiles

- [Demo Xpression](http://symftony-xpression.herokuapp.com/)
- [Code source Xpression](https://github.com/Symftony/Xpression)
- [Code source Xpression-bundle](https://github.com/Symftony/Xpression-Bundle)
