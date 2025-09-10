---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: identifier-domain
title: Identifier le Domain
---

## Le Domain: Objets, comportement et règles

### Anemic Domain

Comme vous pouvez le constater, notre architecture est celle par défaut proposée par Symfony lorsqu'on crée un nouveau projet: tous les dossiers dans le `src/` et dans un namespace `App`.
Et c'est très bien comme ça, surtout pour un projet de cette taille.
Mais comme tout projet, il peut être amené à grossir, et là, on regrettera peut-être de ne pas s'être imposé à l'avance des contraintes d'architecture.

Il est donc l'heure de prendre le problème à la racine et d'identifier le coeur de métier de notre application.

Première bonne pratique quand on adopte la Clean Architecture, toujours commencer son développement par le `Domain`, toujours *from bottom to top*. On commence donc par créer un nouveau dossier `src/Domain`.

Et pour savoir ce que l'on va mettre dedans, on va essayer d'identifier ces 2 concepts:
- Les objets métiers (*Domain Model*), et leur *comportement*
- Les règles métier

Pour cela on veut se poser la question "Que **fait** mon application ?", et en l'occurence, j'aimerais répondre: "Mon application sert à me présenter des **cartes de révision** automatiquement certains jours. Je veux aussi être capable de gérer (création, suppression, ...) ces cartes".

C'est plutôt simple, j'estime n'avoir qu'un seul objet métier, la `Card`.
Maintenant, un objet tout seul, ça ne sert à rien. Cet objet doit pouvoir se **comporter**.
Prenons un peu de temps sur cette notion, car elle est cruciale, et souvent oubliée des développeurs qui utilisent des ORMs comme Doctrine (dont je fais partie !).

Comme très bien expliqué dans cet [article de Martin Fowler](https://martinfowler.com/bliki/AnemicDomainModel.html), un fléau s'est abattu sur le monde de l'orienté objet: l'***Anemic Domain Model***, ou le ***Domaine Anémique*** en bon français.

Il s'agit d'un **anti-pattern**, dans lequel nos objets se sont appauvris pour ne contenir plus que la donnée: des propriétés, des relations avec d'autres objets, ainsi que tout un panel de *getter* et *setter*. En résumé, ça ressemble grandement à notre bonne vieille entité Doctrine.

Le problème avec cette approche, c'est que nos objets ne sont plus que des coquilles vides de sens, qui ne font que transiter de la donnée entre la base de données et notre application, mais qui n'ont aucun *comportement*, aucun *behavior*.

Martin Fowler, dans son article, explique selon lui qu'il n'y a aucun intérêt à faire de l'orienté objet si on n'utilise pas ce pourquoi l'Objet a été créé. Un objet se doit de combiner **donnée** et **logique**, et contenir des méthodes qui lui permettent de se **comporter**. 

Ainsi, la tendance des dernières années à systèmatiquement séparer les **données** dans les objets et la **logique** dans des services serait alors un non-sens total.

Le *Service* ne devrait qu'orchestrer et coordonner les objets ensemble et avec le reste du programme, mais pas contenir de connaissance ou de comportement métier.

J'insiste sur ce point car il s'agit, **à mon sens**, d'un concept qui m'a vraiment aidé à comprendre ce que je faisais "de travers", et m'a donné un nouvel angle de compréhension de la solution qu'est la Clean Architecture: redonner le pouvoir au Domain.

<div class="admonition note" markdown="1"><p class="admonition-note">Note</p>
Je ne porte aucun jugement sur une pratique que j'utilise moi-même encore régulièrement.
Mais je pense qu'il est intéressant de comprendre comment les <b>ORMs</b> ont modifié la façon dont on perçoit le rôle d'un objet: une entité fortement liée au schéma de base de donnée, et qui ne représente que de la donnée.
<br/>
C'est en revenant à la base de l'<i>Objet</i> que nous allons pouvoir aller de l'avant.
</div>

### Propriétés & Immutabilité

Reprenons notre object `Card` qui n'est pour le moment qu'une entité Doctrine, ne reflettant que de la donnée persitée en base.
Oublions la base de donnée. De quoi à besoin ma `Card` pour fonctionner ? On ne conservera que les propriétés qui ont un **sens fonctionnellement**. Pas besoin de garder des timestamp tels que `$updatedAt` par exemple (à moins que cette valeur ait une vraie utilité fonctionnelle).
Dans notre cas, la `Card` était déjà plutôt bien définie, avec peu de propriétés.

Voici donc ma proposition:

```php
<?php

declare(strict_types=1);

namespace Domain;

/**
 * Immutable domain object representing a Card in the Leitner box system
 */
readonly class Card
{
    /**
     * Delay schedule for the Leitner box system (in days)
     */
    private const array TEST_DELAY = [1, 3, 7, 15, 30, 60];

    public function __construct(
        public string $question,
        public string $answer,
        public ?\DateTimeInterface $initialTestDate,
        public ?bool $active,
        public int $delay = 1,
        public ?string $id = null,
    ) {
    }

    // ...
}
```

Premier élément à noter, l'utilisation du `readonly` pour rendre cet objet immuable. Il est intéressant de garder tous ses *Domain Objbect Models* immuables pour la lisibilité du code et pour minimiser les erreurs. Une fois que je crée un objet Card, il ne changera jamais, donc aucun risque qu'un appel à une fonction cachée change secrètement la valeur d'une propriété avant que je persiste le tout en base: mon code gagne en fiabilité.

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
C'est super mais que faire si j'ai vraiment envie de modifier une propriété de mon objet ?
</div>

La solution dorénavant dans ce cas est assez simple. Imaginons que nous souhaitons désactiver une `Card` car on ne souhaite plus qu'elle apparaisse dans notre boîte.
On rajoute cette fonction à notre classe :

```php
    // ...

    /**
     * Creates a new Card with the updated active status
     */
    public function withActive(bool $active): self
    {
        return new self(
            $this->question,
            $this->answer,
            $this->initialTestDate,
            $active,
            $this->delay,
            $this->id,
        );
    }

    // ...
```

Puis j'appelle cette fonction ainsi :

```php
public function disableCard($card): Card
{
    $disabledCard = $card->withActive(false);

    return $disabledCard;
}
```

Quels sont les avantages d'une telle méthode ?
- Par défaut mon objet est `immutable`, stable dans le temps, il garde le même `state`.
- Je crée des fonctions `with*()` uniquement pour définir des situations dans lesquelles j'autorise des propriétés à changer. Le nom de ces fonctions à un sens, contrairement à de simples `setters`.
- Plutôt que de manipuler 1 objet `Card`, que je modifie plusieurs fois au cours de mon programme, ici je retourne à chaque fois des objets différents. Chacun à son propre état, et si je les nomme bien, il est beaucoup plus aisé de les manipuler et de suivre ce qui se passe dans le code.

Cela permet une meilleure fluidité de développement, plutôt que d'avoir par exemple plusieurs objets `$card1`, `$card2`, ... Ou pire, avoir un seul objet `$card` qui passe à la machine à laver, se faisant muter de fonction en fonction, durant plusieurs dizaines de lignes, et à la fin on ne sait plus quelles sont les valeurs de ses propriétés.


Vous aurez également remarqué que nous avons changé le namespace en supprimant le préfixe `App`. Pour que ce changement fonctionne, n'oublions pas de modifier notre `composer.json` au niveau de l'autoload ainsi:

```json
"autoload": {
    "psr-4": {
        "Domain\\": "src/Domain/",
        "Application\\": "src/Application/",
        "Infrastructure\\": "src/Infrastructure/"
    }
}
```

Je vous offre un petit spoil des dossiers que nous allons créer par la suite, c'est cadeau !


### Comportement

Très bien, il ne nous reste plus qu'une chose à rajouter à notre objet, dont nous avons parlé plus tôt: un *comportement*.
Moins de blabla, plus de code, voici quelques comportements à ajouter à notre `Card`:

```php

    /**
     * Checks if the provided answer is correct for this card
     */
    public function isAnswerCorrect(string $answer): bool
    {
        return strtolower(trim($answer)) === strtolower($this->answer);
    }

    /**
     * Handles a failed answer attempt by resetting the card's delay and setting the initial test date to now
     */
    public function handleFailedAnswer(): self
    {
        return $this->withInitialTestDate(new \DateTime())
            ->withDelay(1);
    }

    /**
     * Checks if this card is due for testing today
     */
    public function isDueForTesting(): bool
    {
        if (!$this->active) {
            return false;
        }

        if (!$this->initialTestDate instanceof \DateTime) {
            return false;
        }

        $dueDate = (clone $this->initialTestDate)->modify($this->delay . 'days');

        return $dueDate <= new \DateTime('today');
    }
```

<div class="admonition note" markdown="1"><p class="admonition-note">Note</p>
Comme pour tous les exemples de ce tutoriel, le contenu des classes n'est pas exhaustif. Pour voir le code dans son intégralité, gardez en parallèle une <a href="https://github.com/ArthurJCQ/leitner-box/tree/refacto-clean">page Github</a> ouverte avec le code complet de notre application.
<br/>
En l'occurence, vous pourrez trouver d'autres exemples de comportements directement dans la classe `Card.php` du repo !
</div>

Super ! Notre `Card` est dorénavant capable de se comporter. On distinguera les règles métier qui vérifient et renvoient un résultat comme notre `isAnswerCorrect`, des **comportements** qui renvoient une nouvelle instance de `Card` suite à une modification, comme le `handleFailedAnswer` qui renvoie une nouvelle `Card` avec son délai réinitialisé suite à une mauvaise réponse.

### Interfaces & Exceptions

On a presque finit de construire le Domain, mais on va être confronté à un problème: comment pourrai-je plus tard communiquer avec l'Infrastructure ?
Deux réponses à cela:
- La couche Domain de doit **jamais** appeler une autre couche, elle ne dépend de personne.
- La couche Applicative par contre, qui contient les *UseCases*, doit pouvoir orchestrer le Domain **et** l'Infrastructure, mais sans pour autant **dépendre** de l'Infra.

La solution ? Les Interfaces ! On va ajouter dans notre Domain des contrats d'interface que notre Application pourra utiliser, sans avoir besoin de savoir quelles sont les implémentations concrètes de ces interfaces côté Infrastructure.

Par exemple, c'est typiquement ce genre d'interface que nous allons mettre ici :

```php
interface CardRepositoryInterface
{
    public function listAllCards(): iterable;

    public function findCard(string $id): ?Card;

    /** @throws CardCreationException */
    public function createNewCard(Card $card): void;

    /** @throws CardEditException */
    public function editCard(Card $card): void;

    /** @throws CardRemovalException */
    public function removeCard(string $id): void;

    /** @return iterable<Card> */
    public function findTodayCards(): iterable;
}
```

On n'ajoutera dans nos interfaces **que** les méthodes dont nous sommes sûr qu'elles seront utiles à notre Application, ni plus, ni moins. Cela permet notamment de ne pas être parasité par les nombreuses autres méthodes et propriétés que nous mettent à disposition Framework, librairies, APIs, ORMs,..

Pour les ORMs comme Doctrine par exemple, on n'exposera pas la `Connection` à la base de donnée, le `QueryBuilder`, ou encore toutes les fonctions toutes faites telles que `find`, `findOneBby`, etc... qui n'ont aucun **sens métier** dans notre Application.
C'est nous qui définissons, avec des termes clairs et logiques, le nom de nos interfaces et de leurs méthodes, et on laisse le soin à l'Infrastructure de se débrouiller avec cela.


<div class="admonition important" markdown="1"><p class="admonition-important">Important</p>
Pour rappel, le but ici est <b>théoriquement</b> de pouvoir être capable de se débarasser de la couche Infrastructure et de la remplacer par une autre (changement de Framework, d'ORM, ou d'autres API..), sans que cela ait la moindre incidence sur notre Domain ou notre couche Applicative.
<br/>
Même s'il est peu probable que vous changiez votre Framework, c'est en respectant au maximum cette philosophie que vous ne ferez plus l'erreur de développer une fonctionnalité en <i>partant du Framework</i>, mais bien de penser d'abord aux besoins et aux règles métier, et en implémentant l'Infra seulement à la <b>fin</b>, et en vous servant des Interfaces que vous aurez peut-être créé.
</div>

Enfin, on remarquera que mon Interface peut lever des Exceptions particulières et personnalisées. Celles-ci permettent de communiquer à l'Infrastructure quelle Exception lever à quel moment, pour que notre couche Applicative sache à quoi l'erreur correspond, et comment réagir.

Ces Exceptions sont rangées dans le Domain au même titre que les Interfaces, comme par exemple:

```php
<?php declare(strict_types=1);

namespace Domain\Exception;

class CardRemovalException extends \Exception
{
    public function __construct(string $message = 'Failed to remove card', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
```

Rendez-vous sur le [repo Github](https://github.com/ArthurJCQ/leitner-box/tree/refacto-clean) pour voir plus d'Interfaces et d'Exceptions.
