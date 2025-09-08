---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: application
title: Orchestrer le Domain avec les UseCase
---

## Orchestrer le Domain avec les UseCase

### La couche Application

Notre Domain est à présent riche en règles métier & comportement, il contient des Interfaces, des Exceptions, il serait temps de faire fonctionner tout cela ensemble !
C'est là le but de la couche Application, aussi appelée UseCases, ou parfois même Services, bien que qu'à titre personnel, je n'aime pas le terme "Service" qui est trop générique et foure-tout à mon goût.

Pour ma part, j'aime appeler cette couche "Application" et suffixer toutes les classes qu'elle contient par `...UseCase`. Je trouve cela plus parlant pour comprendre l'objectif de cette couche: orchestrer l'application au travers de *cas d'usages* métier.
Chaque classe de cette couche doit répondre à un cas d'usage applicatif réel, et se service du Domain (Model, règles, Interfaces) pour y répondre.

En général, ces classes ne doivent contenir qu'une méthode `execute()` dont le but est d'*exécuter* le cas d'usage applicatif, rien de plus, rien de moins.

Un UseCase peut donc être quasi-dépourvu de contenu, s'il n'est qu'un passe plat entre l'Infrastructure et le Domain, par exemple si l'on souhaite créer une `Card`:

```php
<?php declare(strict_types=1);

namespace Application;

use Domain\Card;
use Domain\CardRepositoryInterface;
use Domain\Exception\CardCreationException;

readonly class CreateCardUseCase
{
    public function __construct(
        private CardRepositoryInterface $cardRepository,
    ) {
    }

    /** @throws CardCreationException */
    public function execute(Card $card): void
    {
        $this->cardRepository->createNewCard($card);
    }
}
```

Voilà l'exemple le plus simple possible. On rappelle qu'à ce stade, le UseCase ne doit dépendre que de la couche inférieure à lui, soit le Domain, d'où l'injection du `CardRepositoryInterface`, définie plus tôt dans le Domain.

<div class="admonition note" markdown="1"><p class="admonition-note">Note</p>
Dans la réalité, il est rare qu'un UseCase soit aussi dépouillé que celui-ci, un projet plus complet aurait nécessité certainement un traitement plus complet, comme réagir à la création de la Carte, ajouter des garde-fous, etc...
</div>

C'est bien joli mais il n'y a pas grand chose à orchestrer dans ce cas précis.
Prenons un cas plus complexe. Je souhaite répondre à la question d'une Carte, et savoir si j'ai bien répondu ou non.

Créons ce UseCase:

```php
<?php declare(strict_types=1);

namespace Application;

use Domain\Card;
use Domain\CardRepositoryInterface;
use Domain\Exception\CardEditException;

readonly class SolveCardUseCase
{
    public function __construct(
        private CardRepositoryInterface $cardRepository,
    ) {
    }

    /** @throws CardEditException */
    public function execute(Card $card, string $answer): bool
    {
        $isCorrect = $card->isAnswerCorrect($answer);
            ? $card->handleSuccessfulAnswer()
            : $card->handleFailedAnswer();

        $this->cardRepository->editCard($updatedCard);

        return $isCorrect;
    }
}
```

Reprenons cette classe depuis le début:
- Comme pour le UseCase précédent, on injecte le repository pour mettre à jour la `Card` dans la base de donnée en fonction de la réponse donnée
- On se sert de la règle métier contenue dans la carte pour vérifier la validité de la réponse
- On utilise le comportement de notre objet pour correctement gérer sa mise à jour en cas de bonne ou mauvaise réponse (cf Domain)
- On met à jour la `Card` dans la base de donnée via l'interface du Repository.

Ce qui est important de remarquer, c'est qu'il n'y a aucune logique métier dans nos UseCase.
Car ce n'est **pas son rôle**. Le UseCase doit simplement être appelé par l'Infrastructure (requête d'un utilisateur ou d'un système externe pour un cas d'usage précis à résoudre), et donner une réponse en orchestrant le Domain.

### Maintenabilité et Tests

À ce stade, nous avons donc des cas d'usages métier bien définis et représentés par des classes. C'est l'idéal pour ajouter des tests unitaires, qui chacun testeront de façon bien isolée chaque cas.

Peut-être connaissez-vous l'adage ***Don't mock what you don't own*** ?

Il peut être en effet compliqué d'essayer de mocker une classe provenant de librairies externes, commee Doctrine, car parfois elles sont complexes, et dépendent elles-mêmes d'autres classes que l'on comprend moins. La mocker pourrait même apporter des effets de bord indésirables lors des tests.

Bonne nouvelle, ce problème n'existe pas ici ! Notre couche Application est protégée de l'Infrastructure et donc du Framework, des librairies externes, de l'ORM, etc...

Jusqu'ici, tout nous appartient, grâce aux interfaces fournies par le Domain. Ces interfaces qui ne contiennent à chaque fois que le contrat nécéssaire au fonctionnement de notre projet, pas de superflu ni de détails d'implémentation. 

On peut donc les mocker sans danger si l'on souhaite ajouter des tests unitaires !

Grâce à tout cela, notre code est réellement maintenable, car il est totalement isolé du reste, il ne sait pas quelle base de données est utilisée par dessus, quel Framework, quel client mail, ... Tout cela pourrait changer du jour au lendemain que ça ne changerait rien pour notre Domain et notre Application, et surtout ... Les tests passeraient toujours !
