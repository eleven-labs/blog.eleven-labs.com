---
layout: post
title: Symfony2 - Ce qui change
permalink: /fr/symfony2-ce-qui-change/
excerpt: Si vous êtes courageux, vous aurez dans l'idée de vouloir passer à Symfony2.
authors:
 - pouzor
date: '2011-10-05 15:43:21 +0200'
date_gmt: '2011-10-05 15:43:21 +0200'
categories:
- Symfony
tags:
- php
- symfony2
---

Si vous êtes courageux, vous aurez dans l'idée de vouloir passer à Symfony2.

Voici une petite liste non-exaustive des points de différences à connaître pour passer de Symfony1.x à Symfony2

Symfony 2, tout le monde en parle en ce moment, mais qu'est ce qu'il change exactement par rapport à la première mouture ?

Nous allons voir ici les trois grands changements de Symfony 2

### Symfony 2 c'est ... un projet basé sur une version de PHP 5.3.x:

Et oui, comme vous l'aurez surement vu/lu, Symfony 2 tourne exclusivement sous PHP 5.3 et plus. Mais en quoi cela est il important ?

Tout simplement parce que cette version de PHP apporte des fonctionnalités tout droit sortie du Java et quelque autre langage OO: les [namespaces](http://www.journaldunet.com/developpeur/php/tutoriel-pratique/chargement-automatique-de-classes-avance-avec-php-5/php-5-3-et-les-namespaces-pour-simplifier-tout-ca.shtml "Namespaces : Kesako ?").

Hormis le côté "propreté du code", ce nouveau système est à la base de toute la nouvelle architecture de Symfony 2, les Bundles.

Un Bundle est au sens très large un module/plugin, c'est :

-   Portable
-   Facilement installable dans un projet Sf2
-   Une architecture MVC
-   Un mini-projet

En fait, un Bundle c'est plus ou moins ce que vous décidez d'en faire. Certains auront pour envie de dire que cela ressemble aux "app" dans Sf1, d'autres au plugins.

### Symfony 2 c'est ... un nouvel ORM :

Et oui, qui dit nouveau framwork, dit aussi nouvel ORM, et Symfony 2 intègre de base ... Doctrine 2 ! (Et oui, une autre version 2 :) )

C'est la partie la plus déroutante pour ceux qui veulent passer de SF1 à SF2. En effet, le passage de la version 1 à 2 de Doctrine a entraîné pas mal de modifications, tant au niveau du mapping en lui même de la donnée (les fameux schema.yml de Sf1) que des fonctions pour récupérer et travailler cette donnée.

Pour faire simple et court, il n'y a plus de notion de "Model" dans Sf2 mais d' "Entités" (Entities). Qu'est ce que cela apporte ? Un code plus clair mais une architecture beaucoup plus dense que Sf1 (et oui c'est possible).

Par exemple, vous n'aurez pas un fichier Yml pour la génération de votre base de données mais bien un fichier par Entité (par class en somme).

D'autre part, la synthaxe de ces fichiers de création d'entité a légèrement changée, surtout au niveau de la gestion des relations entre les objets de notre base de données.

Par exemple, là où vous auriez crée une table intermediaire pour créer une relation N-N entre deux objets en SF1, vous aurez simplement à décrire ce comportement grâce à des mots clefs propres à SF2:

```yaml
User:
  type: entity
  manyToMany:
    groups:
      targetEntity: Group
      inversedBy: users
      joinTable:
        name: users_groups
        joinColumns:
          user_id:
            referencedColumnName: id
        inverseJoinColumns:
          group_id:
            referencedColumnName: id
```

```yaml
Group:
  type: entity
  manyToMany:
    users:
      targetEntity: User
      mappedBy: groups
```

Vous pouvez retrouver toutes ces nouveautés sur la doc [officielle de Doctrine 2](http://www.doctrine-project.org/docs/orm/2.1/en/reference/association-mapping.html "Doctrine2 - Mapping Relation")

Et pour ce qui est de la récupération des données, tout se passe maintenant via l'utilisation d'une class EntityManager. C'est grâce à cette objet que vous pourrez créer votre propre requête, DQL par exemple, afin d'obtenir vos données tant convoitées. Exemple:

```php
$em = $this->getDoctrine()->getEntityManager();
$myObjects= $em->getRepository('MyBundle:MyEntity')->findAll();
```

ou encore

```php
$qb = $em->createQueryBuilder()
            ->select("d")
            ->addSelect("b")
            ->from('MyBundle:MyEntity', "d")
            ->leftJoin('d.other-entity', "b")
           ->getResult();
```

### Symfony 2 c'est ... un nouveau moteur de template:

La dernière grosse modification de Sf2 est son nouveau moteur de template : [TWIG](http://twig.sensiolabs.org/ "Twig")

Twig est un moteur de template simple, plutôt rapide et sécurisé, ne permettant l'accès aux seuls éléments que ce que vous lui aurez préalablement passé. Twig est un autre projet développé et soutenu par Sensio et vient directement, concurrent d'autres technologies plus anciennes comme Smarty.

En gros, si vous le souhaitez, vous pouvez maintenant éliminer totalement de vos templates la moindre trace de code PHP, et utiliser toutes les fonctions de templating propre a twig comme les boucles, echo, if ....

Vous pouvez configurer le moteur de template que vous voulez utiliser directement dans l'action de votre page, ce qui permet de pouvoir utiliser Twig et PHP comme vous le souhaitez.

### En conclusion :

Symfony 2, c'est pas mal de nouvelles choses, je dirais même c'est assez différent de SF1. Si vous avez fait du Symfony 1, ne partez pas avec l'idée que le passage d'une version à une autre sera simple. D'autant plus que cette version du framwork intègre beaucoup de spécificités du langage Java comme les injections de dépendance, les déclarations de services ...

Si toutefois vous êtes determiné à passer à la nouvelle version, je vous invite à suivre le tuto [Mon premier projet en Symfony 2](http://clycks.fr/2011/10/449-mon-premier-projet-en-symfony2 "Mon premier projet en Symfony2") sur ce même blog :)
