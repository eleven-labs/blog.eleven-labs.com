---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: vues-et-logique-de-base
title: Vues et logique de base
---
## Création des controllers

Avant de faire intervenir Mercure, il nous faut un minimum de logique. Créons alors nos deux controllers correspondants à nos entités :
```shell
docker-compose exec php bin/console make:controller
```
Vos controllers `MessageController` et `ChannelController` sont créés, et avec eux des templates twig ont été générés, que nous allons remplir avec le minimum syndical pour un chat.

## Remplissage des templates

Créez un template supplémentaire `templates/channel/chat.html.twig`. Nous n'aurons en réalité besoin que de celui-là et de `templates/channel/index.html.twig`. Ces deux pages seront suffisantes pour toute l'application.

Voici ce que je vous propose pour vos templates, mais vous pouvez bien entendu leur donner la forme que vous voulez (d'autant plus que mes compétences en UI sont... limitées) :

```html
{# templates/channel/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Home{% endblock %}

{% block body %}

<div class="container">
    {% if app.user %}
        <div class="mb-3">
            You are logged in as {{ app.user.username }}, <a href="{{ path('app_logout') }}">Logout</a>
        </div>
    {% endif %}
    {% if channels %}
        <h2>Which chan do you want to join ?</h2>
        <table class="table table-striped">
            <tbody>
            {% for channel in channels %}
                <tr class="">
                    <th>
                        <span>{{ channel.name }}</span>
                        <a class="btn btn-primary float-right" href="{{ path('chat', {id: channel.id}) }}">Go chat !</a>
                    </th>
                </tr>
            {% endfor %}
            </tbody>
        </table>
    {% else %}
        <div>
            <div class="alert alert-danger text-center">No Channels found.</div>
        </div>
    {% endif %}
</div>
{% endblock %}
```

Dans `index.html.twig`, on ajoute des informations sur l'utilisateur courant (ce qui nous permettra par la même occasion de pouvoir le déconnecter), et de quoi afficher simplement nos futurs canaux de discussion.

Pour le moment, la page affiche une erreur car nous tentons d'accéder à la variable `channels`. Injectons-la dans le template depuis notre controller `ChannelController`.

```php
    /**
     * @Route("/", name="home")
     */
    public function getChannels(ChannelRepository $channelRepository): Response
    {
        $channels = $channelRepository->findAll();

        return $this->render('channel/index.html.twig', [
            'channels' => $channels ?? []
        ]);
    }
```

N'oubliez pas d'importer le composant `HttpFoundation\Response` et le `ChannelRepository`.

Avec l'annotation `@Route`, on définit cette page comme étant notre page d'accueil.

Et nous utilisons simplement `ChannelRepository` pour retourner la liste de tous les canaux.

Il n'y a aucun channel pour le moment, on y viendra.
Remplissez pour l'instant le dernier template :

```html
{# templates/channel/chat.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Chat{% endblock %}

{% block body %}
<div class="container">
    {% if app.user %}
        <div class="mb-3">
            You are logged in as {{ app.user.username }}, <a href="{{ path('app_logout') }}">Logout</a>
        </div>
    {% endif %}
    <h1>Channel {{ channel.name }}</h1>
    <div class="container" style="height: 600px">
        <div class="container bg-light h-75 overflow-auto">
            {% for message in messages %}
                {% if app.user == message.author %}
                    <div class="row w-75 float-right">
                        <b>{{ message.author.username }}</b>
                        <p class="alert alert-info w-100">
                            {{ message.content }}
                        </p>
                    </div>
                {% else %}
                    <div class="row w-75 float-left">
                        <b>{{ message.author.username }}</b>
                        <p class="alert alert-success w-100">
                            {{ message.content }}
                        </p>
                    </div>
                {% endif %}
            {% endfor %}
        </div>
        <div>
            <form id="form" class="container row">
                <input id="message" class="input-group-text col-sm-9" placeholder="Message" type="text" />
                <button id="submit" type="submit" class="btn btn-success col-sm-3">Send</button>
            </form>
        </div>
    </div>
</div>
{% endblock %}
```

On y remet les informations de l'utilisateur courant, et surtout, un affichage conditionnel de nos futurs messages, en fonction de l'auteur du message.

On décide d'afficher l'auteur et le contenu du message.

Justement, ajoutez enfin la fonction `chat` dans le `ChannelController` afin de récupérer ces futurs messages :
```php
    /**
     * @Route("/chat/{id}", name="chat")
     */
    public function chat(
        Channel $channel,
        MessageRepository $messageRepository
    ): Response
    {
        $messages = $messageRepository->findBy([
            'channel' => $channel
        ], ['createdAt' => 'ASC']);

        return $this->render('channel/chat.html.twig', [
            'channel' => $channel,
            'messages' => $messages
        ]);
    }
```

On n'oublie pas d'importer `MessageRepository`, et le tour est joué (on pourra accéder à cette page quand des channels seront créés, on y vient).

## Créer nos channels

Pour nous embêter le moins possible, nous créerons nos channel avec une commande simple.

Il vous suffit de créer ces deux fichiers de commande dans `App\Command`.

Le premier pour créer nos channels :

```php
// App\Command\CreateChannelCommand
<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Channel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateChannelCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em, string $name = 'create:channel')
    {
        parent::__construct($name);

        $this->em = $em;
    }

    public function configure(): void
    {
        $this
            ->setDescription('Creates a new channel')
            ->setDefinition(
                [
                    new InputArgument('name', InputArgument::REQUIRED, 'name')
                ]
            )
            ->setHelp(
                <<<'EOT'
The <info>create:channel</info> command creates a channel with an <info>name</info> argument
EOT
            );
    }

    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $name = $input->getArgument('name');
        $channel = $this->em->getRepository(Channel::class)->findOneBy([
            'name' => $name
        ]);

        if ($channel) {
            throw new \Exception('Channel already exists');
        }

        $channel = (new Channel())
            ->setName($name);

        $this->em->persist($channel);
        $this->em->flush();

        return 0;
    }
}
```

Le deuxième pour les supprimer au besoin :

```php
<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Channel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DeleteChannelCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em, string $name = 'delete:channel')
    {
        parent::__construct($name);

        $this->em = $em;
    }

    public function configure(): void
    {
        $this
            ->setDescription('Deletes a channel')
            ->setDefinition([
                new InputArgument('name', InputArgument::REQUIRED, 'name')
            ])
            ->setHelp(
                <<<'EOT'
The <info>delete:channel</info> command delete a channel regarding an <info>name</info> argument
EOT
            );
    }

    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $name = $input->getArgument('name');
        $channel = $this->em->getRepository(Channel::class)->findOneBy([
            'name' => $name
        ]);

        if (!$channel) {
            throw new \Exception('Channel does not exist.');
        }

        $this->em->remove($channel);
        $this->em->flush();

        return 0;
    }
}
```

Et voilà ! Vous pouvez à présent gérer vos channels à l'aide de ces commandes :

```bash
docker-compose exec php bin/console create:channel channel1 #Create a channel
docker-compose exec php bin/console delete:channel channel1 # Delete a channel
```

Dans la prochaine partie nous implémentons la logique d'envoi des messages !

Vous pouvez vous rendre sur [cette branche](https://github.com/ArthurJCQ/tutorial-astro-chat/tree/codelabs/templates-and-logic) pour être à jour sur cette étape du tutoriel, et continuer sereinement vers la prochaine partie.
