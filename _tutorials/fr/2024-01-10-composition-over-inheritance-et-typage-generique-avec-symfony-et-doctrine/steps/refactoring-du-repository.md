---
contentType: tutorial-step
tutorial: composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine
slug: refactoring-du-repository
title: Refactoring du repository
---
### Refactoring du repository

Pour que la suite soit la plus digeste et facile possible, nous travaillerons dans l'arborescence de fichier créée par Symfony, directement dans le dossier `Repository`.
Dans le monde réel, on pourrait clairement tirer parti du DDD (Domain Driven Design) pour sublimer notre refactoring, mais ce n'est pas l'objet de ce codelab, nous resterons donc concentrés sur le repository en tant que tel.

La première chose à faire pour se découpler de Doctrine, c'est de créer notre propre interface, contenant la liste exhaustive des méthodes que notre Repository devra implémenter. Ici, admettons que nous aurons uniquement besoin des méthodes `store()` pour persister des objets, `find()` pour en récupérer, et une plus particulière `findPostsAboutPhp()`.

Créons donc cette interface :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Post;

interface PostRepositoryInterface
{
    public function store(Post $post): void;

    public function find(int $id): ?Post;

    public function findPostsAboutPhp(): array;
}
```

À présent c'est *ce* contrat d'interface qui fait foi pour notre `PostRepository`. 
De plus cette interface est totalement agnostique de tout ORM (ici, Doctrine), car le choix de votre ORM est un détail d'implémentation dont votre code métier ne doit pas avoir connaissance.
Dorénavant, vous devrez donc toujours utiliser la `PostRepositoryInterface` quand vous voudrez injecter votre repository quelque part.

Revenons maintenant à notre implémentation de Repository Doctrine. Commençons par le renommer `PostRepository` => `PostRepositoryDoctrine`.
Cette instance de Repository est donc celle qui utilisera l'ORM Doctrine.
Puis, vidons notre `PostRepositoryDoctrine` de tout son code superflu, et implémentons cette nouvelle interface :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Post;

class PostRepositoryDoctrine implements PostRepositoryInterface
{
    public function store(Post $post): void
    {
        // TODO: Implement store() method.
    }

    public function find(int $id): ?Post
    {
        // TODO: Implement find() method.
    }

    public function findPostsAboutPhp(): array
    {
        // TODO: Implement findPostsAboutPhp() method.
    }
}
```

Top ! Et si vous souhaitez changer d'ORM, ou utiliser l'ODM de Doctrine (pour utiliser plutôt MongoDB), il vous suffira de créer un nouveau Repository.
Par exemple, un `PostRepositoryDocument` pour l'ODM, et y implémenter le code nécessaire pour intéragir avec les fonctions de l'ODM.

C'est ce que nous nous apprêtons à faire maintenant avec notre `PostRepositoryDoctrine`.

Reprenons ce dernier, et ajoutons ce code dans le corps de la classe :

```php
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\ObjectRepository;

class PostRepositoryDoctrine implements PostRepositoryInterface
{
    private ObjectRepository $repository;

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        $this->repository = $this->entityManager->getRepository(Post::class);
    }

    public function store(Post $post): void
    {
        $this->entityManager->persist($post);
    }

    public function find(int $id): ?Post
    {
        return $this->repository->find($id);
    }

    public function findPostsAboutPhp(): array
    {
        // TODO: Implement findPostsAboutPhp() method.
    }
}
```

Et voilà, au lieu d'étendre l'`EntityRepository` de Doctrine, on injecte l'`EntityManager` dans notre constructeur.
Puis, dans une propriété privée `$repository`, on récupère une instance de Repository Doctrine de type `Post::class` qui sera notre objet ***proxy*** entre nos méthodes et celles de Doctrine.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
L'interface <code>ObjectRepository</code> de Doctrine sera ici implémentée automatiquement par son <code>EntityRepository</code>.
</div>

Petit détail important, souvenez-vous du code généré dans la classe `Post`, notamment l'attribut de la classe :

```php
#[ORM\Entity(repositoryClass: PostRepositoryDoctrine::class)]
class Post
// ...
```

Il vous faudra vous débarrasser du paramètre `repositoryClass` de l'attribut, car ce dernier attend une classe de type `EntityRepository` (de Doctrine).
Or notre classe n'hérite plus de cette dernière.
Ce n'est pas vraiment un problème car vous utiliserez de toute manière normalement l'injection de dépendance pour utiliser votre repository là où vous en avez besoin, plutôt que la méthode `getRepository(Post::class)`.

Et voilà ! Vous disposez à présent d'un repository tout propre qui utilise la composition, et n'implémente que les méthodes Doctrine dont vous avez *réellement* besoin.

... Mais ce n'est pas tout à fait terminé.
En effet, que se passe-t-il si je veux ajouter une nouvelle entité, par exemple un `User` ? Mettons que cette classe n'a besoin que de la méthode `find`.

Créons ensemble cette entité avec la commande `make:entity` avec seulement un `name` pour attribut.

Maintenant reprenons la même logique de refacto pour son repository. Maintenant que l'on est rôdé, ça devrait être assez rapide.

À la fin, vous devriez avoir une interface `UserRepositoryInterface`, ainsi qu'un repository qui ressemble à cela :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\ObjectRepository;

class UserRepositoryDoctrine implements UserRepositoryInterface
{
    private ObjectRepository $repository;

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        $this->repository = $this->entityManager->getRepository(User::class);
    }

    public function find(int $id): ?User
    {
        return $this->repository->find($id);
    }

    public function store(User $user): void
    {
        $this->entityManager->persist($user);
    }
}
```

Bon, comme on peut le voir, ça commence à faire pas mal de code en doublon. Pour peu que toutes vos entités aient besoin d'un Repository avec les méthodes de base `find`, `store`, `save`, `remove`, ... On commence à faire pas mal de duplication de code.

Et c'est à partir de là que nous allons mettre en place... de l'héritage !

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
Mais ... On vient de faire tout ça pour se débarrasser de l'héritage et faire de la composition... Pourquoi ?!
</div>

Promis je ne me moque pas de vous. Se débarrasser de l'héritage du `ServiceEntityRepository` de Doctrine, c'était surtout se débarrasser d'une tonne de code superflu, non voulu, et surtout inconnu, qui se retrouvait dans votre classe.

Maintenant que nous avons fait le ménage, rien ne nous empêche de factoriser notre propre code pour éviter de se répéter.

Pour commencer, supprimons de nos Repository toutes ces méthodes ***génériques*** dont on vient de parler (`find`, `store`, ...), car nous allons les définir à plus haut niveau.

Dans notre exemple, `UserRepositoryInterface` se retrouve vide, et notre `PostRepositoryInterface` va finalement ressembler à cela :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

interface PostRepositoryInterface
{
    public function findPostsAboutPhp(): array;
}
```

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
On ne garde que les méthodes <b>spécifiques</b> de nos repositories, comme notre <code>findPostsAboutPhp()</code>
</div>

Adaptez bien en conséquence le code des classes implémentant ces interfaces.

Puis, créons à présent un Repository de base, que nous appellerons `BaseRepositoryDoctrine`, qui contiendra tout le code en commun avec tous nos autres repository.
Comme nous somme consciencieux, créons d'abord son interface :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

interface BaseRepositoryInterface
{
    public function store(object $object): void;

    public function find(int $id): ?object;
}

```

> C'est donc ici que l'on remet nos méthodes ***génériques***

Cette interface pourra être implémentée par n'importe quel ORM; ici c'est un Repository Doctrine que nous souhaitons créer :

```php
<?php

declare(strict_types=1);

namespace App\Repository;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ObjectRepository;

abstract class BaseRepositoryDoctrine extends BaseRepositoryInterface
{
    private ObjectRepository $repository;

    public function __construct(protected readonly EntityManagerInterface $entityManager)
    {
        $this->repository = // ??
    }

    public function store(/* Quel type pour l'objet à insérer ? */): void
    {
        $this->entityManager->persist($object);
    }

    public function find(int $id) // Typage de retour ?
    {
        return $this->repository->find($id);
    }
}
```

> Et le tour est joué, tous nos repository Doctrine n'auront qu'à hériter de cette classe pour posséder ces méthodes ***génériques***.

Plusieurs remarques :
- Notre classe est abstraite car elle n'est pas censée être instantiée. Il s'agit juste d'un squelette, qui sera étendu par nos réels Repository.
- On ne sait pas encore comment instantier notre propriété `$repository` qui est censé être une instance du Repository Doctrine lié à notre entité. Or, ici cette classe abstraite ne sait pas par quel Repository elle sera utilisé.
- Quel typage pour l'argument de la méthode `store` qui reçoit le nouvel objet à instantier ?
- Même problème pour le type de retour de notre fonction `find`, nous ne savons pas à l'avance quel objet retourner.

Pour les problèmes de typage cités ci-dessus, deux solutions.

Pour la première, on va modifier un peu le constructeur, pour qu'il accepte un argument `$className`.

```php
    // BaseRepositoryDoctrine.php
    // ...

    public function __construct(protected EntityManagerInterface $entityManager, string $className)
    {
        $this->repository = $this->entityManager->getRepository($className);
    }

    // ...
```

Puis, dans le `PostRepositoryDoctrine`, on appelle le constructeur parent en spécifiant la bonne entité (ici, `Post`) :

```php
class PostRepositoryDoctrine extends BaseRepositoryDoctrine implements PostRepositoryInterface
{
    public function __construct(protected EntityManagerInterface $entityManager)
    {
        parent::__construct($entityManager, Post::class);
    }
}
```

Dans cette classe nous avons plus tôt supprimé toutes les méthodes déjà implémentées dans la classe abstraite, nous n'avons donc plus que ce constructeur et la méthode `findPostsAboutPhp()`.
On y ajoutera d'autres méthodes uniquement si elles sont spécifiques à ce Repository.

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
Quid de notre problème de type dans les méthodes de la classe abstraite ?
</div>

On y vient. 

Et comme du code vaut mille mots, voilà la solution, attention les yeux :

```php
    // BaseRepositoryDoctrine.php
    // ...

    public function store(object $object): void
    {
        $this->entityManager->persist($object);
    }

    public function find(int $id): ?object
    {
        return $this->repository->find($id);
    }

    // ...
```

Ah ! Un typage `object`, vous l'aviez vu venir ? Certains crient peut-être au scandale, et ils auraient sûrement raison: en l'état actuel, nous sommes passés d'un typage fort à un typage vraiment bancal. N'importe quel `object` ferait l'affaire ici.

En réalité, c'est là que la magie du typage générique va faire son affaire.
On en a fini avec notre refactoring, vous pouvez souffler un coup.

C'est bon ? Alors rendez-vous dans la prochaine section pour régler nos problèmes de types, et ainsi devenir un sorcier qui maîtrise les ***generics***.
