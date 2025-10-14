---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: presentation-projet
title: Présentation du projet
---

## Rappels Clean Architecture

Avant de présenter le projet, voici une liste de concepts dont vous pourrez vous servir comme d'un pense-bête tout au long de ce tutoriel.

- **Domain**: Le coeur de la logique métier, indépendant de tout framework, base de donnée et librairie externe. Il contient les objets et les règles métier, ainsi que des contrats d'interface.
- **Application**: La couche qui orchestre les cas d'usages métier, en coordonnant le Domain, ses règles et ses interfaces. Ici on cherche à accomplir des *UseCase* métier, en se servant des règles métier du Domain.
- **Infrastructure**: La couche la plus externe, qui contient le framework, les librairies et toutes les implémentations techniques concrètes (base de donnée, service d'email, API externes, ...), selon les contrats d'Interface du Domain. On l'appellera parfois simplement **Infra** pour gagner du temps !

Le Domain est donc le coeur de votre application, il contient tous les objets métier & les règles fonctionnelles.

Souvent on peut voir une autre couche dans les projets Clean, la couche **Presentation**. C'est elle qui s'occupe de :
- Récupérer le résultat d'une requête
- Formater cette réponse au bon format (json, HTML, ...) et la retourner à l'utilisateur.

Pour ma part, je n'utilise pas du tout cette couche. C'est un choix tout à fait personnel, je trouve que ça reste le rôle de l'Infrastructure, et je garde cette logique dans mes Controllers.
Mais c'est une préférence qui peut être *challengée* dans vos projets bien entendu !

## La Boîte de Leitner

Durant ce tutoriel, nous allons prendre un projet existant que j'ai développé, une application Symfony classique, et très simple, pour petit à petit la migrer vers une architure Clean.

Pour cela, j'ai décidé de développer une Boîte de Leitner.

La méthode Leitner, c'est une stratégie d'apprentissage et de révision de fiches qui est décrite par les scientifiques comme l'une des plus efficaces.

On image une boîte compartimentée avec des numéros. Chaque compartiment correspond à un jour, et chaque compartiment successif doit être de plus en plus espacé temporellement:
- Compartiment 1: Jour 1
- Compartiment 2: Jour 2
- Compartiment 3: Jour 5
- Compartiment 4: Jour 10
- ...

![leitner-box]({BASE_URL}/imgs/tutorials/2025-10-14-symfony-clean-architecture/leitner-box.svg)

Puis on écrit des cartes, aussi appelées *flash cards*, ou cartes de révision, qui contiennent une question au recto, et la réponse au verso.

Le jour 1 je sors les cartes présentes dans le compartiment 1 et j'essaie de répondre à chaque question de chaque carte:
- Bonne réponse ? Je déplace la carte dans le compartiment 2
- Mauvaise réponse ? Je replace la carte dans le premier compartiment.

Et on continue ainsi de suite avec le jour suivant. À chaque bonne réponse, je déplace la carte dans le compartement suivant. À la moindre mauvaise réponse, la carte retourne dans le tout premier compartiment, et on recommence.

Si je répond correctement à une Carte se trouvant dans le dernier compartiment, alors la carte est retirée pour de bon: On estime que la notion est assimilée.

Comme vous le devinez, ce système est assez simple à développer, et surtout à automatiser.

J'aimerais donc pouvoir créer des cartes de révision, et que celles-ci me soient soumises régulièrement (via l'envoi d'un e-mail par exemple), pour que je puisse tenter d'y répondre, et qu'elles soient automatiquement déplacées dans les compartiments correspondants.

Et ainsi de suite, je recevrai chaque jour une notification m'indiquant à quelles cartes je dois répondre aujourd'hui.

Pas de panique vous n'avez pas à tout développer de votre côté, on va partir ensemble de cette modeste base de code que vous retrouverez sur ce [repo Github](https://github.com/ArthurJCQ/leitner-box).

Ce projet utilise une base de donnéee **PostgreSQL** (dans un container Docker), **PHP 8.4** et **Symfony 7.3**.
Avec Docker Compose et le [Symfony CLI](https://symfony.com/download), vous devriez être en mesure de lancer le projet.
Dans le doute, n'hésitez pas à lancer un `symfony check:requirements` pour vous assurer que tout est bon.

Pour le reste, le `README` du projet devrait vous accompagner pour le setup (n'oubliez pas de lancer les migrations Doctrine).
Prenez le temps de découvrir et de vous familiariser avec l'application.

<div class="admonition important" markdown="1"><p class="admonition-important">Important</p>
Pour le moment vous pouvez découvrir l'application via une interface simpliste développée en Twig, pour bien vous familiariser avec le concept de Leitner.
<br/>
Lors du passage en Clean Archi, on supprimera la couche Twig, pour transformer notre Leitner Box en une API ne retournant que du JSON.
<br/>
Le but est de rester simple, sans superflu, et se focaliser sur l'essentiel. Et aussi de prouver qu'il est très simple, en Clean Archi, de changer le type de Réponse de nos Controller.
<br/>
Vous trouverez un fichier <code>tests/requests.http</code> dans lequel des requêtes HTTP sont prêtes à l'emploi (attention à changer les ID quand nécessaire) pour utiliser et tester l'API. Votre IDE devrait vous permettre de lancer ces requêtes directement depuis le fichier.
</div>

Pour un premier tour d'horizon, visitez la page d'accueil, puis créer votre première Carte. Une fois cela fait, elle apparaît dans votre liste de Cartes.

À présent, on vous être notifié chaque jour des Cartes auxquelles on doit répondre. Pour cela, imaginons une tâche **cron** qui appellera la commande `DailyTestNotifCommand`.

Pour cela, on le fait manuellement via le terminal:

```bash
$ bin/console app:daily-test-notif
```

Et voilà, un email est envoyé ! Pour le consulter, rendez-vous sur [](http://localhost:8025/), l'adresse Mailpit (automatiquement lancé via docker compose).

Un lien vous redirigera vers une page où seules les cartes du jour vous seront proposées pour y répondre !
- Bonne réponse ? Super, la Carte est "rangée" dans le compartiment suivant, il faudra y répondre à nouveau dans 3 jours.
- Mauvaise réponse ? Dommage ! La carte reste dans le premier compartiment, venez retenter votre chance demain !

Vous trouverez également une Entité `Card` dont voici les propriétés:
- `$question`: La question associée à la Carte
- `$answer`: La réponse
- `$initialTestDate`: La date initiale à laquelle la question nous est soumise
- `$delay`: Le délai entre la `$initialTestDate` et la prochaine date de test (on incrémente cette valeur à chaque fois qu'on répond correctement à la question)
- `$active`: La Carte est-elle activée ou désactivée

Pour le moment, notre entité utilise Doctrine pour se brancher à la base de données:

```php
<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\CardRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CardRepository::class)]
class Card
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $question;

    #[ORM\Column(length: 255)]
    private string $answer;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $initialTestDate = null;

    #[ORM\Column]
    private ?bool $active = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(options: ['default' => 0])]
    private int $delay = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): string
    {
        return $this->question;
    }

    public function setQuestion(string $question): self
    {
        $this->question = $question;

        return $this;
    }

    public function getAnswer(): string
    {
        return $this->answer;
    }

    public function setAnswer(string $answer): self
    {
        $this->answer = $answer;

        return $this;
    }

    public function getInitialTestDate(): ?\DateTimeInterface
    {
        return $this->initialTestDate;
    }

    public function setInitialTestDate(?\DateTimeInterface $initialTestDate): self
    {
        $this->initialTestDate = $initialTestDate;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getDelay(): int
    {
        return $this->delay;
    }

    public function setDelay(int $delay): self
    {
        $this->delay = $delay;

        return $this;
    }
}
```

C'est en jouant avec ces simples propriétés que notre Leitner Box est fonctionnelle.

On dispose d'un CRUD dans le Controller, ainsi que d'une méthode pour soumettre des réponses aux questions.

Visitez le dossier `Service` et notamment la classe `HandleCardSolving` pour découvrir la logique qui se cache sous le capot.

Vous dévouvrirez également la constante `TEST_DELAY`, qui représente le délai, en nombre de jours, entre chaque compartiments. J'ai choisi ces délais arbitrairement.

Ici, si on répond bon à chaque fois, on répondra aux questions au J1, puis J+3, J+7, etc...

Je vous laisse explorer le repo pour plus de détails sur cette version de l'app **sans** Clean Archi !

<div class="admonition important" markdown="1"><p class="admonition-important">Important</p>
À partir de maintenant, sur le <a href="https://github.com/ArthurJCQ/leitner-box/tree/refacto-clean">repo Github</a> de l'application, vous pouvez switcher sur la branche <code>refacto-clean</code> pour découvrir le projet entièrement réécrit en Clean.
<br/>
Je vais progressivement montrer comment migrer l'architecture, et vous pourrez suivre pas à pas via le repo si vous ne souhaitez pas tout réécrire vous-même.
</div>
