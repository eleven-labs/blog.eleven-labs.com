---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: identifier-domain
title: Identifier le Domain
---

## Le Domain: Objets, comportement et règles

Comme vous pouvez le constater, notre architecture est celle par défaut proposée par Symfony lorsqu'on crée un nouveau projet: tous les dossiers dans le `src/` et dans un namespace `App`.
Et c'est très bien comme ça, surtout pour un projet de cette taille.
Mais comme tout projet, il peut être amené à grossir, et là, on regrettera peut-être de ne pas s'être imposé à l'avance des contraintes d'architecture.

Il est donc l'heure de prendre le problème à la racine et d'identifier le coeur de métier de notre application.
Commençons par créer un nouveau dossier `src/Domain`.

Et pour savoir ce que l'on va mettre dedans, on va essayer d'identifier ces 2 concepts:
- Les objets métiers, et leur *comportement*
- Les règles métier

Pour cela on veut se poser la question "Que **fait** mon application ?", et en l'occurence, j'aimerais répondre: "Mon application sert à me présenter des **cartes de révision** automatiquement à un timing précis prédéfini. Je veux être capable de gérer (création, suppression, ...) ces cartes".

C'est plutôt simple, j'estime n'avoir qu'un seul objet métier, la `Card`.
Maintenant, un objet tout seul, ça ne sert à rien. Cet objet doit pouvoir se **comporter**.
Prenons un peu de temps sur cette notion, car elle est cruciale, et souvent oubliée des développeurs qui utilisent des ORMs comme Doctrine (dont je fais partie !).

Comme très bien expliqué dans cet [article de Martin Fowler](https://martinfowler.com/bliki/AnemicDomainModel.html), un fléau s'est abattu sur le monde de l'orientée objet: l'*Anemic Domain Model*, ou le domaine anémique en bon français.
Il s'agit d'un **anti-pattern** qui consiste en objets qui possèdent des propriétés, et même des relations avec d'autres objets, ainsi que tout un panel de *getter* et *setter*. En résumé, il s'agit de notre bonne vieille entité Doctrine.
Le problème avec cette approche, c'est que nos objets ne sont plus que des coquilles vides de sens, qui ne contiennent que da la donnée, mais aucun *behavior*, aucune *comportement*.
Martin Fowler, dans son article, explique selon lui qu'il n'y a aucun intérêt à faire de l'orienté objet si on n'utilise pas ce pourquoi l'Objet a été créé: combiner la donnée et la logique au sein d'une même classe. Séparer les données dans les objets et la logique dans des services serait alors un non-sens total.

Le *Service* ne devrait qu'orchestrer et coordonner les objets ensemble et avec le reste du programme, mais pas contenir de connaissance ou de comportement métier.

J'insiste sur ce point car il s'agit, **à mon sens**, d'un concept qui m'a vraiment aidé à comprendre ce que je faisais "de travers", et m'a donné un nouvel angle de compréhension de la solution qu'est la Clean Architecture.

<div class="admonition note" markdown="1"><p class="admonition-note">Note</p>
Je ne porte aucun jugement sur une pratique que j'utilise moi-même encore régulièrement.
Mais je pense qu'il est intéressant de comprendre comment les ORMs ont modifié la façon dont on perçoit le rôle d'un objet: une entité fortement liée au schéma de base de donnée, et qui ne représente que de la donnée.
C'est en revenant à la base de l'<i>Objet</i> que nous allons pouvoir aller de l'avant.
</div>

Reprenons notre object `Card` qui n'est pour le moment qu'une entité Doctrine, ne reflettant que de la donnée persitée en base.
Oublions la base de donnée. De quoi à besoin ma `Card` pour fonctionner ?

Voici ma proposition:

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
```

=> immutable object
=> namespace (composer.json psr4 autoload config)
=> propriétés
=> ajout du behavior
