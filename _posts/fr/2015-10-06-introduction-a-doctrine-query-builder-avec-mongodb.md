---
layout: post
title: Introduction à Doctrine Query Builder avec MongoDB
lang: fr
permalink: /fr/introduction-a-doctrine-query-builder-avec-mongodb/
authors:
 - tthuon
excerpt: Je vais parler du query builder (constructeur de requête) Doctrine pour faire des requêtes vers une base de données MongoDB.
date: '2015-10-06 16:42:12 +0200'
date_gmt: '2015-10-06 14:42:12 +0200'
categories:
- Symfony
- MongoDB
tags:
- doctrine
- symfony
- mongodb
---

Bonjour à tous,

Je vais parler du query builder (constructeur de requête) Doctrine pour faire des requêtes vers une base de données MongoDB.

Si vous voulez suivre les exemples et les tester, il est nécessaire d'installer le bundle [DoctrineMongoDBBundle.](http://symfony.com/doc/current/bundles/DoctrineMongoDBBundle/index.html){:rel="nofollow noreferrer"}

## Qu'est-ce que c'est ?

Le query builder est une classe qui va permettre de créer des requêtes à la base de données en passant par des objets et méthodes. Il facilite l'écriture de requête complexe.

Prenons un exemple avec une liste d'articles dans la collection "articles" :

```js
[
    {
        "title": "Mon article",
        "tags": [
            {
                "label": "article"
            },
            {
                "label": "test"
            }
        ],
        "publication": {
            "status": true,
            "startDate": "2015-10-04T11:00:00+0200",
            "endDate": "2016-10-04T11:00:00+0200"
        }
    },
    {
        "title": "Mon second article",
        "tags": [
            {
                "label": "article"
            },
            {
                "label": "second"
            }
        ],
        "publication": {
            "status": true,
            "startDate": "2015-01-04T11:00:00+0200",
            "endDate": "2015-02-04T11:00:00+0200"
        }
    }
]
```

Je veux avoir l'article avec le titre "Mon second article" en simple query mongo:

```
db.articles.find({"title":"Mon second article"});
```

Avec le query builder:

```php
<?php

$article = $this->createQueryBuilder()
    ->find()
    ->field('title')->equals('Mon second article')
    ->getQuery()
    ->execute();
```

Avec le query builder, on va rester dans le monde de l'objet et manipuler exclusivement des objets.

## Le query builder et Symfony

Dans Symfony, toutes les méthodes qui vont effectuer des requêtes à la base de données se situent dans les repository.

Je veux créer une méthode pour retrouver les articles avec un tag spécifique. Je vais donc créer une méthode "getArticleByTag" dans le repository tag.

```php
<?php
namespace App\Appbundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ArticleRepository extends DocumentRepository
{
    public function getArticleByTag($tag)
    {
        return $this->createQueryBuilder()
              ->find()
              ->field('tag')->equals($tag)
              ->getQuery()
              ->execute();
    }
}
```

$this-&gt;createQueryBuilder() va me donner une instance de Doctrine\\ODM\\MongoDB\\Query\\Builder . Avec cette instance, je vais avoir accès à un ensemble d'expressions pour construire ma requête. Les expressions, ce sont les différents opérateurs Mongo. Dans cet exemple, -&gt;find() -&gt;field() -&gt;equal() sont des expressions. Chacune d'elles sont des instances de Doctrine\\ODM\\MongoDB\\Query\\Expr .

Pour mettre à jour un document, j'utilise le même principe.

```php
<?php
namespace App\Appbundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

class ArticleRepository extends DocumentRepository
{
    public function updateTagArticle($title, array $tags)
    {
        return $this->createQueryBuilder()
              ->update()
              ->field('title')->equals($title)
              ->field('tag')->set($tags)
              ->getQuery()
              ->execute();
    }
}
```

Pour mettre à jour un article qui a pour titre "Mon article", je dois indiquer que je veux le document avec un titre égal à "Mon article" : -&gt;field('title')-&gt;equals("Mon article") . Ensuite, je mets -&gt;field('tags')-&gt;set($tags) pour mettre à jour mon champs "tags".

## Ajouter des expressions

Le builder de base donne un bon nombre d'expressions. Mais parfois, ce n'est pas suffisant. Pour reprendre l'exemple avec les articles, je veux avoir tous les articles publiés à la date d'aujourd'hui. Je vais donc ajouter une expression isPublished(\\DateTime $datetime) .

Je vais étendre la classe Doctrine\\ODM\\MongoDB\\Query\\Expr et ajouter ma méthode.

```php
<?php

namespace App\AppBundle\Query\Expr;

use Doctrine\ODM\MongoDB\Query\Expr as BaseExpr;

class Expr extends BaseExpr
{
    public function isPublished(\DateTime $datetime)
    {
        $this->query['$and'] = [
             ['publication.status' => ['$equals' => true]],
             ['publication.startDate' => ['$lte' => $datetime->format(\DateTime::ISO8601)]],
             ['publication.endDate' => ['$gte' => $datetime->format(\DateTime::ISO8601)]]
        ]
    }
}
```

Je n'oublie pas de surcharger la création du query builder pour pouvoir utiliser cette nouvelle classe expression.

```php
<?php

namespace App\AppBundle\Query;

use Doctrine\ODM\MongoDB\Query\Builder as BaseBuilder;
use App\AppBundle\Query\Expr;

class Builder extends BaseBuilder
{
public function __construct(DocumentManager $dm, $documentName = null)
    {
        $this->expr = new Expr($dm);

        parent::__construct($dm, $documentName);
    }
}
```

```php
<?php

namespace App\AppBundle\Repository;

use App\AppBundle\Query\Builder;
use Doctrine\ODM\MongoDB\DocumentRepository as BaseDocumentRepository;

classe DocumentRepository extends BaseDocumentRepository
{
   public function createQueryBuilder($documentName = null)
   {
       return new Builder($this->dm, $this->documentName);
   }
}
```

Et je peux utiliser ma nouvelle expression dans mon query builder.

```php
<?php
namespace App\Appbundle\Repository;

use App\AppBundle\Repository\DocumentRepository;

class ArticleRepository extends DocumentRepository
{
    public function getPublishedArticle()
    {
        return $this->createQueryBuilder()
              ->find()
              ->isPublished(new \DateTime("2015-10-02T11:00:00+0200"))
              ->getQuery()
              ->execute();
    }
}
```

Cette requête doit me retourner les articles qui sont publiés en date du 02 octobre 2015 à 11h00.

La requête Mongo générée est la suivante :

```js
{
    "$and": [
        {
            "publication.status": {
                "$equals": true
            }
        },
        {
            "publication.startDate": {
                "$lte": new ISODate("2015-10-02T11:00:00+0200")
            }
        },
        {
            "publication.endDate": {
                "$gte": new ISODate("2015-10-02T11:00:00+0200")
            }
        }
    ]
}
```

## Quick tip

Le query builder va hydrater les objets Doctrine avec les données. Sur des objets complexes, ce processus est gourmand en ressource.  Pour gagner en performance, il est possible de désactiver cette hydratation.

```
<?php

$this->createQueryBuilder()
    ->hydrate(false)
    ->find()
    ->getQuery()
    ->execute();
```

## Conclusion

Cet article vous a montré comment utiliser le query builder de Doctrine sur une base de données MongoDB. Il facilite l'écriture de requêtes plus ou moins complexes tout en restant dans un style objet. Étendre et ajouter des expressions permet de simplifier des requêtes métier complexes.

Référence : <http://docs.doctrine-project.org/projects/doctrine-mongodb-odm/en/latest/reference/query-builder-api.html>
