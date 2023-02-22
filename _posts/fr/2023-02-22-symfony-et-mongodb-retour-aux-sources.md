---
layout: post
lang: fr
date: '2023-02-22'
categories:
  - php
  - symfony
  - mongodb
  - doctrine
authors:
  - marianne
cover: /assets/2023-02-22-symfony-et-mongodb-retour-aux-sources/logo.png
excerpt: "Faire du MongoDB avec Symfony, c'est facile, mais avec ou sans Doctrine ?"
title: Symfony et MongoDB, retour aux bases
slug: symfony-et-mongodb-retour-aux-sources
oldCategoriesAndTags:
  - php
  - mongodb
  - symfony
permalink: /fr/symfony-et-mongodb-retour-aux-sources/
---

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2023-02-22-symfony-et-mongodb-retour-aux-sources/logo.png" width="200px" alt="Symfony et MongoDB" style="display: block; margin: auto;"/>
</div>


Sur ce blog, nous avons déjà [quelques articles](https://blog.eleven-labs.com/tag/mongodb.html) autour de MongoDB, et même s’ils sont encore d’actualité, il n’y en avait pas sur MongoDB dans Symfony.

## Qu’est-ce que MongoDB ?

MongoDB est une base de données orientée documents en NoSQL. On a souvent plus l’habitude de base de données relationnelles comme MySQL pour enregistrer les entités sous Symfony, alors que quand c’est orientée Document, c’est pour un besoin différent : stocker des contenus comme des articles de journaux/blogs ou des catalogues de produits pour le e-commerce. Cela permet d’y accéder plus rapidement et il n’y a pas besoin de relationnelle : toutes les informations sont enregistrées dans un json ou xml dans une structure souple.

## Installer une base MongoDB pour un projet Symfony dans Docker

Avant de l’utiliser dans votre projet sous Symfony, il faut installer dans votre docker-compose l’image de MongoDB et de le configurer.

On reste sur une configuration simple où les paramètres sont stockés dans le .env.

```bash
# .env
###> mongodb ###
DATABASE_NAME=documents
DATABASE_HOST=database
DATABASE_PORT=27017
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_VERSION=x.x.xx
###< mongodb ###
```

```bash
# docker-compose.yml
    database:
        image: mongo:${DATABASE_VERSION}
        restart: always
        environment:
            MONGO_INITDB_ROOT_USERNAME: ${DATABASE_USER}
            MONGO_INITDB_ROOT_PASSWORD: ${DATABASE_PASSWORD}
        ports:
            - ${DATABASE_PORT}:27017
        expose:
            - ${DATABASE_PORT}
        volumes:
            - data-documents:/data/db
```

## MongoDB dans Symfony, deux solutions possibles

Pour l’implémentation dans Symfony, je vais proposer deux approches : avec Doctrine, et comme c’est dans l’air du temps, SANS Doctrine !

Pourquoi proposer sans Doctrine ? Il y a certes du Doctrine Bashing depuis quelques années, mais pour MongoDB, comme ce n’est pas du relationnel, et si vous n’avez pas besoin de l’utiliser comme un objet lors de la récupération, pourquoi s’embêter avec un modèle ?

## Avec [DoctrineMongoDBBundle](https://www.doctrine-project.org/projects/doctrine-mongodb-bundle/en/4.4/index.html)
### Installation

Je ne vais pas répéter la documentation du Bundle qui est bien fait sur [l’installation](https://www.doctrine-project.org/projects/doctrine-mongodb-bundle/en/4.4/installation.html#install-the-bundle-with-composer), je vais préciser pour la configuration pour être cohérent avec celle pour docker-compose.

```bash
# config/packages/doctrine_mongodb.yaml

doctrine_mongodb:
    connections:
        default:
            server: 'mongodb://%env(resolve:DOC_DATABASE_HOST)%:%env(resolve:DOC_DATABASE_PORT)%'
            options:
                username: '%env(resolve:DOC_DATABASE_USER)%'
                password: '%env(resolve:DOC_DATABASE_PASSWORD)%'
    default_database: '%env(resolve:DOC_DATABASE_NAME)%'
```

### Utilisation
#### Insérer un document

Pour cela, il faut créer un objet correspondant au document que vous voulez insérer. On va prendre l’exemple d’un article de blog.

La suite est comme pour une autre base de données : il faut créer l’article, le persister via le DocumentManager et le flusher.

```php
// Article.php
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="article")
 */
class Article
{
    /**
     * @MongoDB\Id()
     */
    private string $id;

    /** @MongoDB\Field(type="string") */
    private string $title;

    /** @MongoDB\Field(type="string") */
    private string $content;

    /** @MongoDB\Field(type="string") */
    private string $status;

    /** @MongoDB\Field(type="date") */
    private \DateTime $createdDate;

    public function getId(): string
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): Article
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): Article
    {
        $this->content = $content;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): Article
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedDate(): \DateTime
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTime $createdDate): Article
    {
        $this->createdDate = $createdDate;

        return $this;
    }
}
```

Après dans n'importe quelle classe, il faut déclarer `Doctrine\ODM\MongoDB\DocumentManager` dans le `__construct()` et appeler persist/flush.
```php
[...]
    public function __construct(
        public readonly DocumentManager $documentManager
    ) {
    }

    public function process(array $data): void
    {
        $article = new Article();
        $article
            ->setTitle($data['title'])
            ->setContent($data['content'])
            ->setStatus($data['status'])
            ->setCreatedDate($data['createdDate'])
        ;

        $this->documentManager->persist($article);
        $this->documentManager->flush();
    }
```

Voici la [documentation de MongoDB](https://www.doctrine-project.org/projects/doctrine-mongodb-bundle/en/4.4/first_steps.html#persisting-objects-to-mongodb) si vous voulez aller plus loin.

#### Récupérer un document

Pour récupérer un document, il y a plusieurs possibilités comme décrites dans la [documentation](https://www.doctrine-project.org/projects/doctrine-mongodb-odm/en/2.3/reference/document-repositories.html). Ici ça va être simplement par `id` et ça se fait en une ligne.

```php
[...]
    public function process(int $id): Article
    {
        return $this->documentManager->find(Article::class, $id);
    }
```

On ne voit pas qu'il s'agit d'une base de données MongoDB, Doctrine masque l'information. Mais cela peut être inutile de créer des objets correspondants aux documents. Et pour cela, il faut s'affranchir de Doctrine.

## Sans Doctrine mais avec [Facile.it MongoDB Bundle](https://github.com/facile-it/mongodb-bundle)
### Installation

Après avoir installé le bundle `composer require facile-it/mongodb-bundle`, à vous de vérifier et de mettre à jour la configuration.

```bash
# config/packages/facile_it_mongodb.yaml

mongo_db_bundle:
    data_collection: '%kernel.debug%'
    clients:
        default:
            hosts:
                - { host: '%env(resolve:DATABASE_HOST)%', port: '%env(int:DATABASE_PORT)%' }
            username:         '%env(resolve:DATABASE_USER)%'
            password:         '%env(resolve:DATABASE_PASSWORD)%'
            replicaSet:       '' # default null (no replica)
            ssl:              false
            connectTimeoutMS: 3000
            readPreference:   primaryPreferred

    connections:
        default:
            client_name:    default
            database_name:  '%env(resolve:DATABASE_NAME)%'
```

### Utilisation
#### Insérer un document

Contrairement à la précédente solution, ici, pas besoin d'objet à persister : on utilise un tableau avec les données. A vous de voir si vous voulez vérifier le format et les données dedans.

Ensuite, pour insérer les données, il faut sélectionner la collection (ici `article` pour rester sur le thème) et tout simplement insérer le tableau.
```php
[...]
use MongoDB\Database;
[...]
    public function __construct(private readonly Database $database)
    {
    }

    public function process(array $data): void
    {
        $collection = $this->database->selectCollection('article');
        $collection->insertOne($data);
    }
}
```

#### Récupérer un document

Pour récupérer un document, on procède aussi à la sélection de la collection et le `findOne()` permet de rechercher sur n'importe quel champ.

```php
[...]
    public function process(int $id): array
    {
        $collection = $this->database->selectCollection('article');

        return $collection->findOne(['id' => $id]);
    }
```

Vous pouvez créer un repository avec l'ensemble des fonctions. Cela vous permettra d'être plus indépendant dans vos services vis-à-vis du choix de la base de données.

## Conclusion

Nous sommes restés sur les bases qui sont l'insertion et la récupération d'un document, mais MongoDB a aussi un système d'indexation qui permet de gagner en efficacité pour la recherche de documents.

La documentation pour les deux possibilités est assez claire pour aller plus loin dans son utilisation.
