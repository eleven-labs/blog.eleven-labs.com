---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: initialisation-du-projet
title: Initialisation du projet
---
Dans cette partie, nous récupérons la base du code et nous créons nos entités.

## Récupération du sample
Pour commencer, vous pouvez cloner le sample de code que je vous ai créé sur ce [repo GitHub](https://github.com/ArthurJCQ/tutorial-astro-chat).

> Et pour lancer l'application ?

Nous utiliserons Docker !
La configuration Docker est déjà présente, dans le dossier `docker/` et le fichier `docker-compose.yml`.
Jetez un œil au fichier `docker-compose.yml`.

Quatre services y sont définis (le serveur `nginx`, l'application `Symfony`, la base de données `postresql` et `mercure`).

Notez que des variables d'environnement sont nécessaires à certains de ces services. Tout ou presque est défini dans le fichier `.env`, mais nous y reviendrons pour le compléter.

C'est bon vous êtes enfin autorisés à lancer la commande tant attendue :
```shell
docker-compose up -d
```
Les services vont chacun automatiquement se builder. Ensuite, afin d'installer les dépendances dans le container php il vous faudra faire :
```shell
docker-compose exec php composer i
```

Et voilà, rendez-vous sur votre `localhost:81` pour voir votre page d'accueil.

L'application tourne, mais elle est bien vide...
Seule la gestion des utilisateurs a été créée pour vous (je ne vais pas vous mâcher tout le travail non plus).

Créons quelques entités en amont et les pages HTML correspondantes en tant que squelette de notre chat !

## Création des entités

Listons les entités dont nous allons avoir besoin pour une messagerie :

- Une entité `Message` bien évidemment, cœur de nos échanges.
- Une entité `Channel`, pour pouvoir choisir sur quel canal discuter.

Et... C'est tout ! Oui, c'est très minimaliste, mais c'est pour ne pas perdre de vue notre objectif, Mercure !

Avec la commande `make:entity`, suivez les instructions pour créer ces deux entités.
Reportez-vous à ces fichiers de classe pour ajouter les propriétés depuis la console :

```php
// Message.php
<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=MessageRepository::class)
 */
class Message
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $content;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     */
    private UserInterface $author;

    /**
     * @ORM\Column(type="datetime")
     */
    private \DateTimeInterface $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=Channel::class, inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     */
    private Channel $channel; // Créez l'entité Channel pour pouvoir ajouter cette propriété

    public function __construct()
    {
        $this->createdAt = new \DateTime(); // Initialisation de la date à chaque nouveau message
    }

    // ... getters and setters
}

```

```php
// Channel.php
<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ChannelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ChannelRepository::class)
 */
class Channel
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $name;

    /**
     * @ORM\OneToMany(targetEntity=Message::class, mappedBy="channel", orphanRemoval=true)
     */
    private Collection $messages; // Créez l'entité Message pour pouvoir ajouter cette propriété

    public function __construct()
    {
        $this->messages = new ArrayCollection();
    }

    // ... getters and setters
}

```

Parfait, nos entités sont créées, n'oubliez pas les relations !
Vérifiez que les repository ont bien été générés également.

Et hop, on peut créer la base de données :
```bash
docker-compose exec php bin/console do:da:cr # Pour doctrine database create
docker-compose exec php bin/console make:migration # Pour générer les migrations
docker-compose exec php bin/console do:mi:mi # Pour appliquer les migrations à la DB
```

Vous pouvez vous rendre sur [cette branche](https://github.com/ArthurJCQ/tutorial-astro-chat/tree/codelabs/entity-creation) pour être à jour sur cette étape du tutoriel, et continuer sereinement vers la prochaine partie.
