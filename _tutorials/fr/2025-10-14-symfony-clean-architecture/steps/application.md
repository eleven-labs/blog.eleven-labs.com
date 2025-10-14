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
Chaque classe de cette couche doit répondre à un cas d'usage applicatif réel, et se servir du Domain (Model, règles, Interfaces) pour y répondre.

En général, ces classes ne doivent contenir qu'une méthode `execute()` dont le but est d'*exécuter* le cas d'usage applicatif, rien de plus, rien de moins.

Un UseCase peut donc être quasi-dépourvu de contenu, s'il n'est qu'un passe plat entre l'Infrastructure et le Domain, par exemple si l'on souhaite créer une `Card`:

```php
<?php declare(strict_types=1);

namespace Application;

use Domain\Card;
use Domain\CardRepositoryInterface;
use Domain\Exception\CannotCreateCard;

readonly class CreateCardUseCase
{
    public function __construct(
        private CardRepositoryInterface $cardRepository,
    ) {
    }

    /** @throws CannotCreateCard */
    public function execute(Card $card): void
    {
        $this->cardRepository->createNewCard($card);
    }
}
```

Voilà l'exemple le plus simple possible. On rappelle qu'à ce stade selon le *flow of control*, le UseCase ne doit dépendre que de la couche inférieure à lui, soit le Domain, d'où l'injection du `CardRepositoryInterface`, définie dans le chapitre précédent sur le Domain.

<div class="admonition note" markdown="1"><p class="admonition-note">Note</p>
Dans la réalité, il est rare qu'un UseCase soit aussi dépouillé que celui-ci, un projet plus complet aurait nécessité certainement un traitement plus exhaustif, comme réagir à la création de la Carte, ajouter des garde-fous, etc...
</div>

C'est bien joli mais il n'y a pas grand chose à orchestrer dans ce cas précis.
Prenons un cas plus complexe. Je souhaite répondre à la question d'une Carte, et savoir si j'ai bien répondu ou non.

Créons ce UseCase:

```php
<?php declare(strict_types=1);

namespace Application;

use Domain\Card;
use Domain\CardRepositoryInterface;
use Domain\Exception\CannotEditCard;

readonly class SolveCardUseCase
{
    public function __construct(
        private CardRepositoryInterface $cardRepository,
    ) {
    }

    /** @throws CannotEditCard */
    public function execute(Card $card, string $answer): bool
    {
        // Update the card based on whether the answer was correct
        $updatedCard = $card->resolve($answer);

        $this->cardRepository->editCard($updatedCard);

        return $card->isAnswerCorrect($answer);
    }
}
```

Reprenons cette classe depuis le début:
- Comme pour le UseCase précédent, on injecte le repository pour mettre à jour la `Card` dans la base de donnée en fonction de la réponse donnée
- Ma fonction `execute` prend en paramètre une `Card` et la réponse proposée
- On utilise le comportement de notre objet (la méthode `resolve($answer)`) pour correctement gérer sa mise à jour en cas de bonne ou mauvaise réponse
- On met à jour la `Card` dans la base de donnée via l'interface du Repository (méthode `editCard()`).
- On se sert de la règle métier `isAnswerCorrect` pour retourner `true` ou `false` en fonction de la validité de la réponse.

Ce qui est important de remarquer, c'est qu'il n'y a aucune logique métier dans nos UseCase.
Car ce n'est **pas son rôle**. Le UseCase sera simplement appelé par l'Infrastructure (requête d'un utilisateur par exemple), pour donner une réponse en orchestrant le Domain (vérification de règles, appels à des interfaces, ...).

### Maintenabilité et Tests

À ce stade, nous avons donc des cas d'usages métier bien définis et représentés par des classes. C'est l'idéal pour ajouter des tests unitaires, qui chacun testeront de façon bien isolée chaque cas.

Peut-être connaissez-vous l'adage ***Don't mock what you don't own*** ?

Il peut être en effet compliqué d'essayer de mocker une classe provenant de librairies externes, comme Doctrine, car parfois elles sont complexes, et dépendent elles-mêmes d'autres classes que l'on comprend moins. La mocker pourrait même apporter des effets de bord indésirables lors des tests.

Bonne nouvelle, ce problème n'existe pas ici ! Notre couche Application est protégée de l'Infrastructure et donc du Framework, des librairies externes, de l'ORM, etc...

Jusqu'ici, tout nous appartient, grâce aux interfaces fournies par le Domain. Ces interfaces qui ne contiennent à chaque fois que le contrat nécéssaire au fonctionnement de notre projet, pas de superflu ni de détails d'implémentation.

On peut donc les mocker sans danger si l'on souhaite ajouter des tests unitaires, car nous *possèdons* ces Interfaces !

Grâce à tout cela, notre code est réellement maintenable, car il est totalement isolé du reste, il ne sait pas quelle base de données est utilisée par dessus, quel Framework, quel client mail, ... Tout cela pourrait changer du jour au lendemain que ça ne changerait rien pour notre Domain et notre Application, et surtout ... Les tests passeraient toujours !
Ce que cela signifie en particulier, c'est qu'on ne teste que des *UseCase* qui ne représentent **que** de la logique métier. Ici, si vous faites une erreur d'implémentation d'une librairie, ou d'utilisation de votre Framework, ça ne viendra pas polluer le résultat de vos tests, qui isolent votre logique métier.
Si votre test *fail*, il y a beaucoup plus de chances que ce soit vraiment un souci de cohérence de votre *métier*.
