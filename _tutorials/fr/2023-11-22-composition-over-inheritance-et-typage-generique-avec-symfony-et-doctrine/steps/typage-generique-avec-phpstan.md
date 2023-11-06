---
contentType: tutorial-step
tutorial: composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine
slug: typage-generique-avec-phpstan
title: Typage générique avec PHPStan
---
### Typage générique avec PHPStan

Nous y voilà enfin ! Je vous conseille de faire une pause pour aller lire l'article [sur le typage générique en PHP](https://blog.eleven-labs.com/fr/typage-generique-en-php/) pour un peu de théorie sur le pourquoi du comment des ***generics***.

Ça y est ? Alors c'est parti !

Avant toute chose, modifiez votre fichier `phpstan.neon` pour qu'il ressemble à cela :

```yaml
parameters:
    level: max
    paths:
        - bin/
        - config/
        - public/
        - src/
```

Puis lançons notre commande PHPStan pour voir ce qu'il en retourne :

```bash
$ ./vendor/bin/phpstan
```

Vous devriez avoir tout plein d'erreurs. Il est l'heure de se retrousser les manches et de s'en occuper.

Tout d'abord, il faut créer notre nouveau type générique, que nous nommons par convention `T`.
Avec le tag `@template`, nous le déclarons au plus haut niveau possible de notre imbrication de Repository, ici `BaseRepositoryDoctrine` :

```php
/** @template T of object */
abstract class BaseRepositoryDoctrine
{
    // ...
}
```

... et son interface `BaseRepositoryInterface` :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

/** @template T of object */
interface BaseRepositoryInterface
{
    // ...
}

```

La notation `of object` signifie que notre type `T` est quoiqu'il arrive de type `object`.

À présent, typons le corps de notre `BaseRepository` pas à pas.

Commençons avec la propriété `Repository` :

```php
    /** @var ObjectRepository<T> */
    protected ObjectRepository $repository;
```

Cela est possible car l'interface `ObjectRepository` contient elle même un tag `@template T of object`. Ce faisant, nous indiquons à notre analyseur que nous remplaçons le type `T` par le type que nous définissons entre les chevrons. Ici, nous avons remis notre `T` à nous. Aucun changement me direz-vous.
Mais vous imaginez bien que le tour de magie n'est pas terminé.

Ajoutons les tags sur nos méthodes :

```php
    /** @param T $object */
    public function store(object $object): void
    {
        $this->entityManager->persist($object);
    }

    /** @return ?T */
    public function find(int $id): ?object
    {
        return $this->repository->find($id);
    }
```

> Taggez également les méthodes de la `BaseRepositoryInterface` de la même manière !

Ici nous indiquons à notre cher PHPStan de remplacer nos types `object` par notre nouveau type `T`. Cela fonctionne car rappelez-vous, `T` ne peut de toute manière n'être qu'un `object`.

Enfin, dernière petite astuce, vous pouvez faire ceci au niveau du constructeur :

```php
    /** @param class-string<T> $className */
    public function __construct(protected EntityManagerInterface $entityManager, string $className)
    {
        $this->repository = $this->entityManager->getRepository($className);
    }
```

Le type `class-string` permet de limiter le type `string` à des valeurs très précises : ce ne pourra être que des noms de classe valides, pas une chaîne de caractère classique. Or c'est bien ce que l'on veut ici; un nom de classe pour créer la bonne instance de Repository.
Vous trouverez la doc de ce tag [ici](https://phpstan.org/writing-php-code/phpdoc-types#class-string).

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
Petit rappel à mi parcours, toutes ces vérifications ne sont faites que statiquement lorsque vous lancez votre commande PHPStan. À l'exécution du code, rien de tout cela n'est interprété et n'importe quelle chaîne de caractère peut être passée ici. D'où l'importance d'avoir une CI stricte qui vous bloque à la moindre erreur d'analyse statique
</div>

C'est bon, notre repository de base a été ***générisé***, nous pouvons à présent en tirer profit dans nos repositories Doctrine.

Par exemple avec le `PostRepositoryDoctrine` :

```php
/** @extends BaseRepositoryDoctrine<Post> */
class PostRepositoryDoctrine extends BaseRepositoryDoctrine implements PostRepositoryInterface
{
    public function __construct(protected EntityManagerInterface $entityManager)
    {
        parent::__construct($entityManager, Post::class);
    }

    /** @return array<Post> */
    public function findPostsAboutPhp(): array
    {
        // Whatever...
        return [];
    }
}
```

Le seul changement utile et important ici est le tag `@extends` juste au dessus de la classe. C'est *ici* que tout ce passe. 
On indique ici que nous étendons notre BaseRepository, mais avec une info supplémentaire, la présence des chevrons `<Post>`. En faisant cela, on explique à PHPStan que nous souhaitons remplacer, dans cette classe, tous nos types génériques `T` par `Post`. Et par `User` dans notre Repository User en faisant la manipulation équivalente.

Notez également la notation `@return array<Post>` au dessus de la seule méthode de notre Repository. Cela permet d'indiquer que nous ne pouvons retourner qu'un tableau composé d'objets `Post`. En fonction de comment vous implémentez la méthode, PHPStan vous remontere une erreur si ce n'est pas le cas.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
`array<Post>` peut aussi être noté `Post[]` si vous préférez.
</div>

Testons d'ailleurs si tout ce petit monde fonctionne correctement.
Créeons un Controller, et mettons-y ce code :

```php
<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Post;
use App\Repository\UserRepositoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BaseController
{
    #[Route(path: '/', name: 'index', methods: [Request::METHOD_GET])]
    public function index(UserRepositoryInterface $userRepository): Response
    {
        $post = new Post();
        $userRepository->store($post);
        
        return new Response();
    }
}

```

Puis, lançons notre commande PHPStan. Vous devriez recevoir cette erreur :

```bash
$ Parameter 1 $object of method App\Repository\BaseRepositoryInterface<App\Entity\User>::store() expects App\Entity\User, App\Entity\Post given.
```

Et oui, car nous essayons de passer un objet de type `Post` dans la méthode `store()` du `UserRepository`. PHPStan est capable de le détecter grâce à nos quelques annotations, et nous produit cette erreur.
Remplacez l'argument par un objet de type `User`, et tout rentre dans l'ordre.

Et voilà, vous en avez fini avec les types génériques !
