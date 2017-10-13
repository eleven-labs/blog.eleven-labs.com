---
layout: post
title: Build an API with API Platform
authors:
    - rpierlot
lang: en
permalink: /build-an-api-with-api-platform/
excerpt: "API Platform defines itself as a « PHP framework to build modern web APIs ». Indeed, this tool will help us to rapidly build a rich and easily usable API."
categories:
    - PHP
tags:
    - php
cover: /assets/2017-07-25-api-platform/cover.jpg
---

API Platform defines itself as a « PHP framework to build modern web APIs ». Indeed, this tool will help us rapidly build a rich and easily usable API.
Why reinvent the wheel? API Platform comes with a bunch of _features_ like an automatic documentation, filters, sorts, and many more.  

In this article, we're going to build an API using API Platform, and talk about some of the features that comes with it. I will assume that API platform has already been installed in your project.

## Let's build our API

We'll create an API around a single resource: _movie._ Indeed, we will build something that adds, deletes and updates movies.

The first thing we need to do is creating our data model. A movie is made of a title, a release date, actors, a director... Many properties known from everyone.
If we go through the documentation, we can see that we can generate our entities with [Schema.org](http://schema.org). This allows us to use a common language to define our usual resources (_Book, Organization_, _Person_…), but it's also understood by search engines like Google or Yahoo.

Good for us, there is a _Movie_ entity from _Schema.org_, with many interesting properties. For simplicity, we'll only work with some of them.

```yaml
# app/config/schemas.yml
types:
  Movie:
    parent: false
    properties:
      name: ~
      dateCreated: ~
      countryOfOrigin: { range: "Text" }
```

To generate our entity, we only need to execute the following command:

```
vendor/bin/schema generate-types src/ app/config/schema.yml
```

Yay! If you go to `src/AppBundle/Entity/Movie.php`, we get an entity generated automatically that has all kinds of validation according to the types set in _Schema.org_.

Last but not least, we need to update the database to be able to play with our movie API:

```
bin/console do:sche:update --force vendor/bin/schema generate-types src/ app/config/schema.yml
```

![](/assets/2017-07-25-api-platform/api_platform_movies.png)Accessing documentation, you see that the _Movie_ resource is here, with all operations like creating, updating, and deleting.
You can play with the interface and the auto-generated documentation before we go on and see another feature used many times in API: filters.

## Filters and sorts

Wouldn't it be nice to filter our movies by name, creation date, or any other property? Let's see how we can do that, in a very simple manner.

The first thing is to declare a _symfony_ service detailing the way we want our properties to be filtered:

```yaml
services:
    movies.search_filter:
        parent:    'api_platform.doctrine.orm.search_filter'
        arguments: [ { id: 'exact', name: 'partial', countryOfOrigin: 'partial' } ]
        tags:      [ { name: 'api_platform.filter', id: 'movies.search_filter' } ]
```

As you can see, we define for all properties the level of comparison: for the _id_, we want an _exact_ match (id=5), for the name a _partial_ level, which is a LIKE %name%, and the same thing for our _countryOfOrigin_. Other levels are available for strings, but not only, you have numeric values, booleans, dates...

Filter management happens automatically with API Platform according to the type (_bool, integer…_), and it's very easy to filter values using operators `<=` and others.

```yaml
services:
    movies.order_filter:
        parent:    'api_platform.doctrine.orm.order_filter'
        arguments: [ { id: ~, name: ~ } ]
        tags:      [ { name: 'api_platform.filter', id: 'movies.order_filter' } ]
```
Above, we declare a service that allows to sort the fields _id_ and _name_.

Now that our services are created, we only have to tell our Movie entity to use them:

```php
<?php
/**
 * A movie.
 *
 * @see http://schema.org/Movie Documentation on Schema.org
 *
 * @ORM\Entity
 * @ApiResource(iri="http://schema.org/Movie", attributes={"filters"={"movies.search_filter", "movies.order_filter"}})
 */
class Movie
{
// ...
}
```
You can now query your API with the following URL: `movies?name=O&order[name]=desc`  
Very simple to implement right?

Obviously, you can create your own [API Platform filters](https://api-platform.com/docs/core/filters#creating-custom-filters).

Many other features exist like :
* [pagination](https://api-platform.com/docs/core/pagination)
* a rich event system
* a cache invalidation system (coming in version 2.1)

## Bottom line

API Platform keeps its promise concerning how fast we can develop an API: creating an API in a few minutes is a child's play!

Developed using best practices, API Platform is easily extensible, which allows everyone to add behaviour.

Finally, the documentation is a very nice thing. You have plenty of examples and explanations.

## To come

Version 2.1 of API platform will soon be released, and comes with new features such as: an admin system developed in React, new filters... Details [here](https://dunglas.fr/2017/06/api-platform-2-1-feature-walkthrough-create-blazing-fast-hypermedia-apis-generate-js-apps/)
