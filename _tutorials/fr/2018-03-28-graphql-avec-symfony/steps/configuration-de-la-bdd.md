---
contentType: tutorial-step
tutorial: graphql-avec-symfony
slug: configuration-de-la-bdd
title: Configuration de la BDD
---
## Création de la base de données

Si vous utilisez le container docker, la base de données MySQL est comprise dans le projet.

Si vous n'utilisez pas le docker, vous devez installer un MySQL sur votre machine via la documentation [suivante](https://www.mysql.com/fr/downloads/)

## Création du schéma

Nous allons utiliser doctrine pour mettre en place le schéma de la base de données.

Vous devez installer doctrine et maker (qui permet de générer les entity) en lançant :

```bash
composer require doctrine maker
```

Vous pouvez changer le fichier `.env` avec la connexion à votre base de données. Dans le cadre de l'utilisation du container docker vous devez mettre :

```bash
###> doctrine/doctrine-bundle ###
# Format described at http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# For an SQLite database, use: "sqlite:///%kernel.project_dir%/var/data.db"
# Configure your db driver and server_version in config/packages/doctrine.yaml
DATABASE_URL=mysql://symfony:symfony@db:3306/symfony
###< doctrine/doctrine-bundle ###
```

Puis nous allons créer le schéma de base de données. Dans la suite du tutoriel nous allons imaginer que l'application doit gérer les astronautes d'Eleven Labs, les liens avec leurs planètes et leurs grades.

Nous allons créer les trois entités doctrine.

### Astronautes

Lancez la commande :

```bash
php bin/console make:entity Astronaut
```

Cela va créer le fichier `src/Entity/Astronaut.php`.

Vous pouvez alors ajouter les `fields` que nous aurons besoin :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AstronautRepository")
 */
class Astronaut
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $pseudo;

    /**
     * @ORM\ManyToOne(targetEntity="Grade")
     * @ORM\JoinColumn(name="grade_id", referencedColumnName="id")
     */
    private $grade;

    /**
     * Get the value of grade
     */
    public function getGrade()
    {
        return $this->grade;
    }

    /**
     * Set the value of grade
     *
     * @return  self
     */
    public function setGrade($grade)
    {
        $this->grade = $grade;

        return $this;
    }

    /**
     * Get the value of pseudo
     */
    public function getPseudo()
    {
        return $this->pseudo;
    }

    /**
     * Set the value of pseudo
     *
     * @return  self
     */
    public function setPseudo($pseudo)
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    /**
     * Get the value of id
     */
    public function getId()
    {
        return $this->id;
    }
}
```

## Planets

Lancez la commande :

```bash
php bin/console make:entity Planet
```

Cela va créer le fichier `src/Entity/Planet.php`.

Vous pouvez alors ajouter les `fields` dont nous aurons besoin :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlanetRepository")
 */
class Planet
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity="Astronaut")
     * @ORM\JoinTable(name="planet_astronaut",
     *      joinColumns={@JoinColumn(name="planet_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="astronaut_id", referencedColumnName="id", unique=true)}
     *      )
     */
    private $astronauts;

    public function __construct()
    {
        $this->astronauts = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getAstronauts()
    {
        return $this->astronauts;
    }

    public function setAstronauts($astronauts)
    {
        $this->astronauts = $astronauts;

        return $this;
    }

    /**
     * Get the value of name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set the value of name
     *
     * @return  self
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }
}
```

### Grade

Lancez la commande :

```bash
php bin/console make:entity Grade
```

Cela va créer le fichier `src/Entity/Grade.php`.

Vous pouvez alors ajouter les `fields` dont nous aurons besoin :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\GradeRepository")
 */
class Grade
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $name;

    /**
     * Get the value of name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set the value of name
     *
     * @return  self
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get the value of id
     */
    public function getId()
    {
        return $this->id;
    }
}
```

### Création de la base

Nous allons utiliser les commandes de doctrine.

Il faut d'abord créer la migration en lançant :

```bash
php bin/console doctrine:migrations:generate
```

Cela va générer un fichier dans le dossier `src/Migrations`

Puis il faut lancer la migration pour créer les tables :

```bash
php bin/console doctrine:migrations:migrate
```

C'est bon ! Vos tables sont créés.

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-symfony/tree/codelabs-step2)
