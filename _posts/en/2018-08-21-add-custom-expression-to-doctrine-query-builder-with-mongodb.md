---
layout: post
title: Add custom expression to Doctrine Query Builder with MongoDB
lang: en
permalink: /en/add-custom-expression-to-doctrine-query-builder-with-mongodb/
authors:
 - tthuon
excerpt: I'm going to talk about the query builder (Doctrine Query Builder) to make queries to a MongoDB database.
date: '2018-08-21 16:42:12 +0200'
date_gmt: '2018-08-21 14:42:12 +0200'
categories:
- Symfony
- MongoDB
tags:
- doctrine
- symfony
- mongodb
cover: /assets/2018-08-23-add-custom-expression-to-doctrine-query-builder/cover.jpg
---

I'm going to talk about the query builder (Doctrine Query Builder) to make queries to a MongoDB database.

If you want to follow the examples and test them, it's necessary to install the bundle [DoctrineMongoDBBundle](http://symfony.com/doc/current/bundles/DoctrineMongoDBBundle/index.html).

## What is it?

The query builder is a class that will allow you to create queries to the database through objects and methods. It facilitates the writing of complex query.

Let's take an example with a list of articles in the "articles" collection:

```js
[
    {
        "title": "My article",
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
        "title": "My second article",
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

I want to have the article with the title "My second article" in simple mongo query:

```
db.articles.find({"title":"My second article"});
```

With the query builder:

```php
<?php

$article = $this->createQueryBuilder()
    ->find()
    ->field('title')->equals('My second article')
    ->getQuery()
    ->execute();
```

With the query builder, we'll manipulate objects exclusively.

## Query builder and Symfony

In Symfony, all the methods that will perform queries to the database are in the repositories.

I want to create a method to find articles with a specific tag. I will create a method "getArticleByTag" in the repository tag.

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

_ $this->createQueryBuilder() _ will give me an instance of _Doctrine\ODM\MongoDB\Query\Builder_. With this instance, I will have access to a set of expressions to build my query. The expressions are the different Mongo operators. In this example, _->find()->field()->equal()_ are expressions. Each of them are instances of _Doctrine\ODM\MongoDB\Query\Expr_.

To update a document, I use the same principle.

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

To update an article with the title "My article", I must indicate that I want the document with a title equal to "My article": _->field('title')->equals("My article")_. Then I put _->field ('tags')->set($tags)_ to update my "tags" field.

## Add expressions

The basic builder gives a lot of expressions. But sometimes it's not enough. To pick up the example with the articles, I want to have all the articles published as of today. I will add an expression _isPublished(\DateTime $datetime)_.

I will extend _Doctrine\ODM\MongoDB\Query\Expr_ class and add my own method.

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

I do not forget to overload the creation of the query builder to be able to use this new expression class.

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

I can use my new expression in my query builder.

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

This request must return articles that are published on October 2nd, 2015 at 11:00.

The Mongo query generated is:

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

The query builder will hydrate Doctrine objects with the data. On complex objects, this process is greedy resource-wise. To gain performance, it is possible to disable this hydration.

```
<?php

$this->createQueryBuilder()
    ->hydrate(false)
    ->find()
    ->getQuery()
    ->execute();
```

## Conclusion

This article showed you how to use the Doctrine query builder on a MongoDB database. It facilitates the writing of more or less complex queries while remaining in an object style. Extending and adding expressions simplifies complex business queries.

Reference : <http://docs.doctrine-project.org/projects/doctrine-mongodb-odm/en/latest/reference/query-builder-api.html>
