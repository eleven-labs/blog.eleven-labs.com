---
contentType: tutorial-step
tutorial: composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine
slug: initialisation-du-projet
title: Initialisation du projet
---
### Initialisation du projet

Pour commencer, initialisez un nouveau projet symfony [selon votre OS](https://symfony.com/download).

Pour moi (Ubuntu), ce sera comme cela :

```bash
$ symfony new codelabs-symfo-repo
```

À présent, installons les différentes librairies requises, en commençant par Doctrine.

```bash
$ composer require symfony/orm-pack
```

On installe le `maker` de Symfony pour aller plus vite :

```bash
$ composer require --dev symfony/maker-bundle
```

Enfin, installons PHPStan dès à présent pour plus tard.

```bash
$ composer require --dev phpstan/phpstan
```

Super, nous sommes à présent prêts à créer notre entité qui nous accompagnera tout le long de ce codelabs.

Faisons simple, et créons une entité `Post` avec un `title` et un `content` avec la commande :

```bash
$ bin/console make:entity
```

Super ! Comme vous le savez, cette commande a créé une nouvelle entité ainsi que son repository, respectivement dans les dossiers `src/Entity` et `src/Repository`.
On remarque que notre repository étend par défaut le `ServiceEntityRepository` de Doctrine, qui contient toutes les méthodes :

```php
/**
 * @extends ServiceEntityRepository<Post>
 *
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

// ...
```

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Notez au passage le tag <code>ServiceEntityRepository&lt;Post&gt;</code> qui est un avant-goût de ce que nous ferons plus tard avec le typage générique.
</div>

Comme on peut l'observer, notre repository est extrêmement couplé à Doctrine. Et de nombreuses méthodes que nous n'utiliserons jamais viennent polluer cette classe.
Nous allons donc nettoyer et alléger notre repository dans la prochaine partie.
