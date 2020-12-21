---
layout: post
title: "Presentation of the PHP library Xpression"
lang: en
permalink: /presentation-php-xpression/
excerpt: "As developers, all of us already had to filter dataset (array, collection, API, etc...). Let's focus on the Xpression library, wich allows us to filter different content sources with a simplified query syntax."
authors:
    - amoutte
categories:
    - php
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
tags:
    - php
    - library
    - symfony
    - query
    - filter
    - doctrine
    - querybuilder
    - orm
    - odm
    - expression
    - collection
cover: /assets/2018-07-11-xpression/cover.jpg
---

## Presentation of Xpression

[**Xpression**](https://github.com/Symftony/Xpression) is a simple parser which converts textual expression ([DSL](https://fr.wikipedia.org/wiki/Langage_d%C3%A9di%C3%A9)) into logical one (**specification pattern**).
Here's an overview of Xpression's functionnalities.

## The syntax

There is some expression examples:

Age must be equal to `26`.

{% raw %}
```
age=26
```
{% endraw %}

Age must be greater than or equal to `20` (included) and less than `30` (excluded).

{% raw %}
```
age≥20&age<30
```
{% endraw %}

Operators supported by bridges:

Operator | Syntax | Examples | ORM | ODM | ArrayCollection | Closure |
-------- | ------ | ------- | --- | --- | --------------- | ------- |
equal | `=` | `param=value` | X | X | X | X |
not equal | `!=` `≠` | `param!=value` `param≠value` | X | X | X | X |
greater than | `>` | `param>value` | X | X | X | X |
greater equal than | `>=` `≥` | `param>=value` `param≥value` | X | X | X | X |
less than | `<` | `param<value` | X | X | X | X |
less equal than | `<=` `≤` | `param<=value` `param≤value` | X | X | X | X |
in | `[` `]` | `param[value1,value2]` | X | X | X | X |
contains | `{% raw %}{{{% endraw %}` `{% raw %}}}{% endraw %}` | `{% raw %}param{{value}}{% endraw %}` | X | X |  | X |
not contains | `{% raw %}!{{{% endraw %}` `{% raw %}}}{% endraw %}` | `{% raw %}param!{{value}}{% endraw %}` | X | X |  | X |
and | `&` | `param>1&param<10` | X | X | X | X |
not and | `!&` | `param>1!&param<10` |  | X |  | X |
or | <code>&#124;</code> | <code>param>1&#124;param<10</code> | X | X | X | X |
not or | <code>!&#124;</code> | <code>param>1!&#124;param<10</code> |  |  |  | X |
exclusive or | <code>^&#124;</code> `⊕` | <code>param>1^&#124;param<10</code> `param>1⊕param<10` |  |  |  | X |

> Yes, the library provides some bridges like doctrine `ORM`, `ODM` and `common` (collections filter).

#### Priority of composition operator

Pay attention to the composition priority operator (`&`, `!&`, `|`, `!|`, `⊕`).
The bigger priority applies first.

- `and`: 15
- `not and`: 14
- `or`: 10
- `exclusive or`: 9
- `not or`: 8

Use parenthesis `(` `)` to group the expressions as you need.

For example, this expression will select the `Raccoon` or the `Schizo` with more than 100 points.

`planet='Raccoon'|name='Schizo'&point>100` is equal to `planet='Raccoon'|(name='Schizo'&point>100)`

But the following expression will select `Raccoon` with more than 100 points or `Schizo` with more than 100 points. 
 
`(planet='Raccoon'|name='Schizo')&point>100` 

## Usage

Let's see with which cases we should use this library.

### As specification

In order to have a specification we will use `ClosureExpressionBuilder`.
In fact, this class builds a callback with the input expression.

{% raw %}
```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// class with getter
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

// objet with public property
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
{% endraw %}

As you see, the specification can be called with an associative array, an object with public properties and an object with getters.

### Filter dataset

We filter an associative array.`
We use again `ClosureExpressionBuilder`.

This is the dataset we use for the following examples:

{% raw %}
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
{% endraw %}

I want to get a 'Raccoons' astronaut.

{% raw %}
```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// dataset
$astronauts = [...];

$query = 'planet{{Raccoons}}';

$parser = new Parser(new ClosureExpressionBuilder());
$expression = $parser->parse($query);

$filteredAstronauts = array_filter($astronauts, $expression);
// array contains only 'Raccoons' astronauts
// $filteredAstronauts = [
//     ['name' => 'Thibaud', 'planet' => 'Raccoons of Asgard', 'points' => 760, 'rank' => 'Fleet Captain'],
//     ['name' => 'Mehdy', 'planet' => 'Raccoons of Asgard', 'points' => 675, 'rank' => 'Captain'],
//     ['name' => 'Romain', 'planet' => 'Raccoons of Asgard', 'points' => 550, 'rank' => 'Captain'],
// ];
```
{% endraw %}

> Tips: here we use the `$expression` with `array_filter`.

Now, I'd like to select astronauts with more than 1000 points but `Raccoons` too.

{% raw %}
```php
<?php
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// dataset
$astronauts = [...];

$query = 'planet{{Raccoons}}|points≥1000';

$parser = new Parser(new ClosureExpressionBuilder());
$expression = $parser->parse($query);

$filteredAstronauts = array_filter($astronauts, $expression);
// contains only the 1000 points astronauts and the 'Raccoons'
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
{% endraw %}

### ArrayCollection Filter

To filter an ArrayCollection we use the bridge `Symftony\Xpression\Bridge\Doctrine\Common\ExpressionBuilderAdapter`. 

{% raw %}
```php
<?php
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\ExpressionBuilder;
use Symftony\Xpression\Bridge\Doctrine\Common\ExpressionBuilderAdapter;
use Symftony\Xpression\Parser;

// dataset
$astronauts = [...];

// we wrap the array dataset in `ArrayCollection`
$astronauts = new ArrayCollection($astronauts);

$parser = new Parser(new ExpressionBuilderAdapter(new ExpressionBuilder()));
$expression = $parser->parse($query);
$filteredAstronauts = $astronauts->matching(new Criteria($expression));
```
{% endraw %}

> ℹ️ `ArrayCollection` are used by doctrine to manage relations (oneToMany, manyToMany etc...).

> To filter `Collection` you can use `ClosureExpressionBuilder` and inject it in `Collection::filter(Closure $p)`.

### Database filter
 
#### Doctrine ODM

Now, we will filter some data in the MongoDB database.

> Brace yourselves, it's gonna be tough!

{% raw %}
```php
<?php
use Doctrine\Common\EventManager;
use Doctrine\MongoDB\Connection;
use Doctrine\MongoDB\Database;
use Symftony\Xpression\Bridge\Doctrine\MongoDb\ExprBuilder;
use Symftony\Xpression\Expr\ClosureExpressionBuilder;
use Symftony\Xpression\Parser;

// init connection
$connection = new Connection('mongodb://localhost');
$database = $connection->selectDatabase('eleven-labs');
$collection = $database->selectCollection('astronauts');

$query = 'planet{{Raccoons}}|points≥1000';

$parser = new Parser(new ExprBuilder());
$queryBuilder = $parser->parse($query);
$astronauts = $collection->createQueryBuilder()->setQueryArray($queryBuilder->getQuery())->getQuery()->execute();
// $astronauts is a Doctrine\MongoDB\Cursor
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
{% endraw %}

> Pretty simple in the end!

#### Doctrine ORM

And doctrine/orm then?

{% raw %}
```php
<?php
use Doctrine\ORM\Tools\Setup;
use Symftony\Xpression\Bridge\Doctrine\ORM\ExprAdapter;
use Symftony\Xpression\Expr\MapperExpressionBuilder;
use Symftony\Xpression\Parser;

// in this example I will use the annotation reader for my schema
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__ . "/Orm/Entity"), true, null, null, false);
$entityManager = EntityManager::create(array(
    // database configuration
    'driver' => 'pdo_sqlite',
    'path' => __DIR__ . '/ORM/astronauts.sqlite',
), $config);

$query = 'planet{{Raccoons}}|points≥1000';

// MapperExpressionBuilder use to dynamicly add `a` alias the the query field
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
{% endraw %}

⚠️ When we create queryBuilder with ORM we have to specifiy an alias `EntityRepository::createQueryBuilder($alias)`. That's why it can't identify query field `planet`.

First solution is to write the full quallified path field in the query like `a.planet{{Raccoons}}|a.points≥1000`. But some database informations leak in the query.

The second solution is to use `MapperExpressionBuilder`. This class will decorate `ExpressionBuilder` to dynamically add the alias when the query builder is configured.

In the following example we prefix all (`*`) fields with `a`.

{% raw %}
```php
$parser = new Parser(
    new MapperExpressionBuilder(
        new ExprAdapter(new Expr()), 
        ['*' => 'a.%s']
    )
);
```
{% endraw %}

### API endpoint filter

Many solutions are available if you want to filter your API:
 
 - use GraphQL.
 
> This is not the lightest one. It is not the best choice to only filter data. 
 
 - manually get request params and manually build the query with a lot of "if" conditions.

> http query params are not readable and can be very heavy for complex query.

Good news! If your API uses one of the previous data sources, you can filter your endpoint with `Xpression`.

> Keep in mind that Xpression is different than GraphQL

We are going to use [Xpression Bundle](https://github.com/Symftony/Xpression-Bundle).

Install it with `composer require symftony/xpression-bundle` then add it in symfony (AppKernel.php or bundle.php).

You must activate querystring correction to fix the parsing of reserved char.

{% raw %}
```php
<?php
// public/index.php or web/app.php (web/app_dev.php)
// ...
\Symftony\Xpression\QueryStringParser::correctServerQueryString(); // add this line right before Request creation
$request = Request::createFromGlobals();
// ...
``` 
{% endraw %}

To use it you just need to add annotation `@Xpression(expressionBuilder="odm")` over desired filter controller.

{% raw %}
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
{% endraw %}

You can configure the following options: 

 - source (query source (request, query, attributes, cookies, files, server, headers default: query))
 - sourceName (param name, in the source) 
 - targetName (controller argument name to inject the built expression)
 - expressionBuilder (expressionBuilder used for building query *required*)

Now you can go to your endpoint url and add `query`.

{% raw %}
```
http://localhost/astronauts/list?query={planet{{Raccoons}}|points≥1000}
```
{% endraw %}

### Conclusion

This presentation is now over! Don't hesitate to test this library and contribute (idea, bugs, features, documentation, etc).

To do list :
- fix usage of query placeholder.
- add more bridges.
- refacto lib core to be extensible (easer way to add some syntax).
- implement a query builder in PHP and JS in order to create directly textual query from the front. 

### Useful resources

- [Demo Xpression](http://symftony-xpression.herokuapp.com/)
- [Code source Xpression](https://github.com/Symftony/Xpression)
- [Code source Xpression-bundle](https://github.com/Symftony/Xpression-Bundle)
