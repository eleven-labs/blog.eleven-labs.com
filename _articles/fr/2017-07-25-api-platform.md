---
contentType: article
lang: fr
date: '2017-07-25'
slug: creer-une-api-avec-api-platform
title: Créer une API avec API Platform
excerpt: "Api Platform se définit comme un «\_framework PHP pour construire des APIs web modernes\_». En effet, cet outil va nous permettre de construire rapidement une API riche et facilement utilisable."
cover: /assets/2017-07-25-api-platform/cover.jpg
categories:
  - php
authors:
  - rpierlot
keywords: []
---

Api Platform se définit comme un « framework PHP pour construire des APIs web modernes ». En effet, cet outil va nous permettre de construire rapidement une API riche et facilement utilisable.
Pourquoi réinventer la roue ? Cet outil est accompagné de tout un tas de _features_ comme une documentation automatisée, la gestion des filtres et des tris, et bien d’autres encore.
Dans cet article, nous allons voir ensemble la création d’une API avec Api Platform, en parlant de certaines fonctionnalités. Je pars du principe que vous avez déjà installé [Api Platform](https://api-platform.com/docs/).

## Créons notre API

Dans notre article, nous allons créer une API autour d’une seule ressource : _movie._ En effet, nous allons simplement créer une API permettant d’ajouter, supprimer, mettre à jour et récupérer des films.

La première chose à faire consiste à créer notre modèle de données. Un film est composé d’un titre, d’une date de sortie, d’acteurs, d’un réalisateur… Plusieurs propriétés qui sont connues de tous.
Si l’on parcourt la documentation d’API Platform, on peut voir qu’il nous est possible de générer nos modèles d’après [Schema.org](http://schema.org). Ce dernier permet d’utiliser un langage commun pour définir des ressources de tous les jours (_Book, Organization_, _Person_…), mais est surtout compris par les moteurs de recherche comme Google ou Yahoo.

Il existe donc l’entité _Movie_ au sein de _Schema.org_, avec de nombreuses propriétés qui nous intéressent. Pour la simplicité de lecture, nous allons en sélectionner uniquement quelques-unes.

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

Pour générer notre entité, il suffit de lancer la commande suivante :

```
vendor/bin/schema generate-types src/ app/config/schema.yml
```

Et hop ! Si vous allez dans src/AppBundle/Entity/Movie.php, on peut apercevoir une entité générée automatiquement qui contient tout un tas de validations par défaut en fonction des types définis dans _Schema.org_.

Enfin, il nous reste à mettre à jour la base de données pour pouvoir jouer avec notre API movies :

```
bin/console do:sche:update --force vendor/bin/schema generate-types src/ app/config/schema.yml
```

![]({BASE_URL}/imgs/articles/2017-07-25-api-platform/api_platform_movies.png)
En accédant à la documentation, vous apercevrez que la ressource _Movie_ est maintenant là, accompagnée de toutes les opérations de création, modification, suppression.
Je vous laisse jouer avec l’interface et la documentation auto-générée avant de passer à une fonctionnalité très utilisée dans les API de listing : les filtres.

## Filtres et sort

Ne serait-il pas pratique de pouvoir filtrer nos films par titre, ou date de création, ou n’importe quelle autre propriété ? Voyons comment faire cela, encore une fois de manière très simple.

La première étape consiste à déclarer un service _symfony_ détaillant la façon dont nous filtrons sur les propriétés voulues :

```yaml
services:
    movies.search_filter:
        parent:    'api_platform.doctrine.orm.search_filter'
        arguments: [ { id: 'exact', name: 'partial', countryOfOrigin: 'partial' } ]
        tags:      [ { name: 'api_platform.filter', id: 'movies.search_filter' } ]
```

Comme vous pouvez le voir, nous définissons pour chacune de nos propriétés la sévérité de comparaison : pour l’_id_, nous voulons un match de type _exact_ (id=5), pour le nom du film une sévérité _partial_, qui correspond à un LIKE %name%, et il en va de même pour le _countryOfOrigin_. D’autres sévérités sont disponibles sur les _strings_, mais également sur les valeurs numériques, les _booleans_, les dates…

La gestion des filtres se fait automatiquement avec API Platform en fonction du type (_bool, integer…_), et il vous est également très facile de filtrer des valeurs en utilisant les comparateurs `<=` et autres.

```yaml
services:
    movies.order_filter:
        parent:    'api_platform.doctrine.orm.order_filter'
        arguments: [ { id: ~, name: ~ } ]
        tags:      [ { name: 'api_platform.filter', id: 'movies.order_filter' } ]
```
Le code ci-dessus permet de déclarer un service qui permet d’ordonner les champs _id_ et _name_.

Maintenant que nos services sont créés, il ne reste plus qu’à dire de les utiliser sur notre entité _Movie_ :

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
Vous avez maintenant la possibilité de requêter votre API avec l’url suivante : `movies?name=O&order[name]=desc`
Simple à mettre en place non ?

Il est bien évidemment possible de créer ses propres [filtres Api Platform](https://api-platform.com/docs/core/filters#creating-custom-filters).

De nombreuses autres fontionnalités détaillées dans la documentation existent notamment :
* la [pagination](https://api-platform.com/docs/core/pagination)
* un système d'événements riche
* un système d'invalidation de cache (à venir dans la version 2.1)

## Conclusion

Api Platform tient sa promesse quant à la rapidité de développement. Comme nous venons de le voir, créer une API en quelques minutes est un jeu d'enfant !

Développé selon les bonnes pratiques, API Platform est très facilement _extensible_, ce qui permet à chacun d'ajouter sa propre touche.

Enfin la documentation est un gros point positif. Étant très riche, elle contient de nombreux exemples et explications.

## À venir

La version 2.1 d'API Platform va bientot sortir, et nous réserve de nombreuses nouvelles fonctionnalités, notamment un système d'administration développé en _React_, de nouveaux filtres... Les détails [ici](https://dunglas.fr/2017/06/api-platform-2-1-feature-walkthrough-create-blazing-fast-hypermedia-apis-generate-js-apps/)
