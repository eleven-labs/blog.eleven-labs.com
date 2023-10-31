---
contentType: tutorial-step
tutorial: graphql-avec-symfony
slug: resolver-des-mutations
title: Resolver des mutations
---
### Création d'un type mutation

Comme pour la query, nous devons définir les mutations possibles. Il s'agit là aussi d'une fonction prenant en entrée un type input et qui renvoie un objet.

#### Type Input

Pour ce tutoriel nous allons seulement créer un nouvel astronaute. Nous avons donc besoin d'un seul type input pour l'astronaute.

Dans le dossier `config/graphql/types` vous devez ajouter un fichier `AstronautInput.yaml` qui contient :

```yaml
AstronautInput:
    type: input-object
    config:
        fields:
            pseudo:
                type: 'String!'
```

#### Ajout de la mutation

Dans le dossier `config/graphql/types` vous devez ajouter un fichier `Mutation.yaml` qui contient :

```yaml
MutationSuccess:
    type: object
    config:
        fields:
            content:
                type: String!

Mutation:
    type: object
    config:
        fields:
            NewAstronaut:
                type: MutationSuccess
                resolve: "@=mutation('NewAstronaut', [args['input']['pseudo']])"
                args:
                    input:
                        type: AstronautInput!
```

Puis dans la configuration du bundle vous devez definir le point d'entrée du type mutation. Dans le fichier `config/graphql.yaml`` :

```yaml
overblog_graphql:
    definitions:
        schema:
            query: Query
            mutation: Mutation
        mappings:
            auto_discover: false
            types:
                -
                    type: yaml
                    dir: "%kernel.project_dir%/config/graphql/types"
                    suffix: ~
```

### Resolver de mutation

Comme pour les `resolvers` de query, il s'agit d'un service qui implémente les interfaces `MutationInterface, AliasedInterface`.

Créez le dossier `src/Mutation` et ajouter le fichier `AstronautMutation.php` avec ceci :

```php
<?php

namespace App\Mutation;

use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Resolver\AliasedInterface;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use App\Entity\Astronaut;

final class AstronautMutation implements MutationInterface, AliasedInterface
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function resolve(string $pseudo)
    {
        $astronaute = new Astronaut();
        $astronaute->setPseudo($pseudo);

        $this->em->persist($astronaute);
        $this->em->flush();

        return ['content' => 'ok'];
    }

    /**
     * {@inheritdoc}
     */
    public static function getAliases(): array
    {
        return [
            'resolve' => 'NewAstronaut',
        ];
    }
}
```
Il ne vous reste plus qu'à configurer le service. Dans le fichier `config/services.yaml` :

```yaml
    App\Mutation\:
        resource: '../src/Mutation'
        tags: ['overblog_graphql.mutation']
```

### Testons

Dans GraphiQL vous pouvez mettre la query suivante :

```javascript
mutation NewAstronaut($astronaute: AstronautInput!) {
  NewAstronaut(input: $astronaute) {
    content
  }
}
```

Puis dans `query variables` en bas à gauche :

```json
{
  "astronaute": {
    "pseudo": "test"
  }
}
```

Si tout est ok pour devriez avoir cela comme réponse :

```json
{
  "data": {
    "NewAstronaut": {
      "content": "ok"
    }
  }
}
```

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-symfony/tree/codelabs-step5)

### Conclusion

Je vous invite à lire la documentation de [GraphQL](http://graphql.org/learn/) et du bundle [https://github.com/overblog/GraphQLBundle/](https://github.com/overblog/GraphQLBundle/) pour voir l'ensemble des fonctionnalités disponibles dans GraphQL.