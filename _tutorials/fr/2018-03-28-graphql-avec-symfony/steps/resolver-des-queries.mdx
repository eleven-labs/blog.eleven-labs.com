---
contentType: tutorial-step
tutorial: graphql-avec-symfony
slug: resolver-des-queries
title: Resolver des queries
---
## Création du type Query

Avant de mettre en place les `resolvers` pour les query en lecture. Vous devez créer le type query.

Il faut ensuite créer un type avec l'ensemble des fonctions que vous souhaitez avoir. Nous allons :

- récupérer l'ensemble des astronautes ;
- récupérer un astronaute ;
- récupérer une planète.

Commençons par créer le fichier `Query.yaml` dans le dossier `config/graphql/types`.

Dans ce fichier nous allons identifier les points d'entrée du graphql :

```yaml
Query:
    type: object
    config:
        fields:
            Astronaut:
                type: 'Astronaut'
                args:
                    id:
                        description: 'Resolves Astronaut using its id.'
                        type: 'Int!'
            Astronauts:
                type: '[Astronaut]'
            Planet:
                type: 'Planet'
```

Si tout est ok, vous devez avoir la documentation qui s'affiche dans l'interface [GraphiQL](http://symfony.localhost/graphiql)

## Création des resolvers

Si vous essayez la query :

```json
{
  Astronauts {
    id
  }
}
```

Vous devriez voir la réponse suivante :

```json
{
  "data": {
    "Astronauts": null
  }
}
```

Puisque pour l'instant vous n'avez aucun resolver.

Le resolver est le code qui permet de récuperer la donnée dans le base.

Dans le bundle il s'agit de **service** symfony.

Il existe deux façons de créer un `resolver` :

- en utilisant des services implémentant les interfaces `ResolverInterface, AliasedInterface` ;
- en créant ses propres services.

On va commencer par créer les trois `resolver` via les interfaces.

Dans le fichier `Query.yaml` vous devez ajouter les appels aux différents `resolver` :

```yaml
Query:
    type: object
    config:
        fields:
            Astronaut:
                type: 'Astronaut'
                args:
                    id:
                        description: 'Resolves Astronaut using its id.'
                        type: 'Int!'
                resolve: "@=resolver('Astronaut', [args['id']])"
            Astronauts:
                type: '[Astronaut]'
                resolve: "@=resolver('Astronauts')"
            Planet:
                type: 'Planet'
                args:
                    id:
                        description: 'Resolves Planet using its id.'
                        type: 'Int!'
                resolve: "@=resolver('Planet', [args['id']])"
```

Puis nous allons créer les services. Créez le dossier `src/Resolver`.

Ajoutez le fichier `PlanetResolver.php` avec :

```php
<?php

namespace App\Resolver;

use App\Repository\PlanetRepository;
use Overblog\GraphQLBundle\Definition\Resolver\AliasedInterface;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;


final class PlanetResolver implements ResolverInterface, AliasedInterface
{
    /**
     * @var PlanetRepository
     */
    private $planetRepository;

    /**
     *
     * @param PlanetRepository $planetRepository
     */
    public function __construct(PlanetRepository $planetRepository)
    {
        $this->planetRepository = $planetRepository;
    }

    /**
     * @return \App\Entity\Planet
     */
    public function resolve(int $id)
    {
        return $this->planetRepository->find($id);
    }

    /**
     * {@inheritdoc}
     */
    public static function getAliases(): array
    {
        return [
            'resolve' => 'Planet',
        ];
    }
}
```

Ajoutez le fichier `AstronautResolver.php` avec :

```php
<?php

namespace App\Resolver;

use App\Repository\AstronautRepository;
use Overblog\GraphQLBundle\Definition\Resolver\AliasedInterface;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;


final class AstronautResolver implements ResolverInterface, AliasedInterface
{
    /**
     * @var AstronautRepository
     */
    private $astronautRepository;

    /**
     *
     * @param AstronautRepository $astronautRepository
     */
    public function __construct(AstronautRepository $astronautRepository)
    {
        $this->astronautRepository = $astronautRepository;
    }

    /**
     * @return \App\Entity\Planet
     */
    public function resolve(int $id)
    {
        return $this->astronautRepository->find($id);
    }

    /**
     * {@inheritdoc}
     */
    public static function getAliases(): array
    {
        return [
            'resolve' => 'Astronaut',
        ];
    }
}
```

Ajoutez le fichier `AstronautsResolver.php` avec :

```php
<?php

namespace App\Resolver;

use App\Repository\AstronautRepository;
use Overblog\GraphQLBundle\Definition\Resolver\AliasedInterface;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;


final class AstronautsResolver implements ResolverInterface, AliasedInterface
{
    /**
     * @var AstronautRepository
     */
    private $astronautRepository;

    /**
     *
     * @param AstronautRepository $astronautRepository
     */
    public function __construct(AstronautRepository $astronautRepository)
    {
        $this->astronautRepository = $astronautRepository;
    }

    /**
     * @return \App\Entity\Astronaut
     */
    public function resolve()
    {
        return $this->astronautRepository->findAll();
    }

    /**
     * {@inheritdoc}
     */
    public static function getAliases(): array
    {
        return [
            'resolve' => 'Astronauts',
        ];
    }
}
```

Si tout est ok la réponse à votre requête est :

```json
{
  "data": {
    "Astronauts": []
  }
}
```

Et si vous ajoutez des astronautes dans votre base de donnnées et changez la requête en :

```javascript
{
  Astronauts {
    id,
    pseudo,
    grade {
      id,
      name
    }
    planet {
      id,
      name
    }
  }
}
```

La réponse devrait être :

```javascript
{
  "data": {
    "Astronauts": [
      {
        "id": 1,
        "pseudo": "captainjojo",
        "grade": {
          "id": 1,
          "name": "admiral"
        },
        "planet": null
      },
      {
        "id": 2,
        "pseudo": "pouzor",
        "grade": {
          "id": 2,
          "name": "rookie"
        },
        "planet": null
      },
      {
        "id": 3,
        "pseudo": "francki",
        "grade": {
          "id": 2,
          "name": "rookie"
        },
        "planet": null
      }
    ]
  }
}
```

Il manque le lien avec la planète, car dans un objet `Astronaut` nous n'avons pas directement le lien avec la planet.

Nous allons donc mettre en place un autre `resolver`. Cette fois-ci via un service.

Dans le fichier `Astronaut.yaml` nous allons ajouter le `resolver` pour la planète :

```yaml
Astronaut:
    type: object
    config:
        fields:
            id:
                type: 'Int!'
            pseudo:
                type: 'String!'
            grade:
                type: 'Grade'
            planet:
                type: 'Planet'
                resolve: "@=service('planet.resolver').resolveInAstronaut(value, args, context, info)"
```

Puis dans le `PlanetResolver.php` vous pouvez ajouter la fonction de resolve suivante :

```php
public function resolveInAstronaut(Astronaut $astronaut, $args, $context, $info)
{
    return $this->planetRepository->findByAstronaut($astronaut->getId());
}
```

Vous devez ajouter la fonction suivante dans le `PlanetRepository.php` :

```php
public function findByAstronaut($id)
{
    return $this->createQueryBuilder('p')
        ->innerJoin('p.astronauts', 'a')
        ->andWhere('a.id = :id')
        ->setParameter('id', $id)
        ->getQuery()
        ->getOneOrNullResult();
}
```

Si tout est bon le résultat de votre précédente requête doit être :

```json
{
  "data": {
    "Astronauts": [
      {
        "id": 1,
        "pseudo": "captainjojo",
        "grade": {
          "id": 1,
          "name": "admiral"
        },
        "planet": {
          "id": 1,
          "name": "duck"
        }
      },
      {
        "id": 2,
        "pseudo": "pouzor",
        "grade": {
          "id": 2,
          "name": "rookie"
        },
        "planet": {
          "id": 2,
          "name": "panda"
        }
      },
      {
        "id": 3,
        "pseudo": "francki",
        "grade": {
          "id": 2,
          "name": "rookie"
        },
        "planet": {
          "id": 2,
          "name": "panda"
        }
      }
    ]
  }
}
```

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-symfony/tree/codelabs-step4)
