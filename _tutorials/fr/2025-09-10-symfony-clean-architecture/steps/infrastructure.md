---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: infrastructure
title: Ajouter une Infrastructure
---

## Ajouter une Infrastructure

### Le Framework

La première chose que nous allons mettre dans notre Infrastructure, c'est notre Framework, en l'occurence Symfony.
Pour cela on commence par créer un dossier `Infrastructure\Symfony`, puis on va séparer chaque sous-dossier selon les Symfony Components utilisés.

C'est une préférence personnelle, mais le fait que Symfony fonctionne avec des packages isolés les uns des autres qui peuvent être ajoutés briques par briques au fur et à mesure, cela facilite grandement le découpage des dossiers: 

1 package = 1 dossier

Ce qui nous donne ceci:

```
src/
└───Domain/
│   
└───Application/
│   
└───Infrastructure/
    │   └───Symfony/
        │   └───Command/
        │   └───Controller/
        │   └───Mailer/
        │   └───Http/
```

Petite exception pour les Controller qui ont leur propre dossier car il s'agira du point d'entrée de notre application, qui pour rappel, est une API REST.

Il nous suffit à présent de déplacer tous les fichiers correspondants dans leurs dossiers respectifs, et d'implémenter les interfaces du Domain quand il y en a.
Par exemple, on a créé une `NotificationInterface` dans le Domain pour définir les méthodes attendues.
On implémente donc cette interface ainsi:

```php
<?php declare(strict_types=1);

namespace Infrastructure\Symfony\Mailer;

use Domain\Notification;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

readonly class AppMailer implements Notification
{
    public function __construct(private MailerInterface $mailer)
    {
    }

    public function sendTestCardsNotification(string $to, string $subject, string $htmlBody): void
    {
        $email = (new Email())
            ->from('leitner@box.com')
            ->to($to)
            ->subject($subject)
            ->html($htmlBody);

        $this->mailer->send($email);
    }
}
```

Et c'est tout ! Ainsi notre Domain reste agnostique de l'implémentation technique (il n'a pas à savoir quel type de Notification sera envoyée, un mail, un sms, ...), et notre Infrastructure sait ce qu'elle doit faire grâce au contrat d'interface. Ici donc, on injecte le Mailer de Symfony pour envoyer notre Notification.

Demain, on pourrait préfèrer une notification via SMS, ou une push notification, il suffira d'ajouter ces classes. L'Application, elle, restera inchangée, car elle dépend uniquement de l'Interface `Notification`.


### Doctrine et DBAL

Bien ! Parlons à présent de notre ORM, Doctrine. On le place dans un dossier à part, et dans notre cas nous n'avons qu'un seul Repository à implémenter.

Voilà à quoi cela ressemble : 

```php
<?php declare(strict_types=1);

namespace Infrastructure\Doctrine\Repository;

use Doctrine\DBAL\Connection;
use Domain\Card;
use Domain\CardRepositoryInterface;

class PostgresCardRepository implements CardRepositoryInterface
{
    public function __construct(private readonly Connection $connection)
    {
    }
    
    public function findCard(string $id): ?Card
    {
        $queryBuilder = $this->connection->createQueryBuilder();
        $result = $queryBuilder
            ->select('c.id, c.question, c.answer, c.delay, c.initial_test_date, c.active')
            ->from('card', 'c')
            ->where('c.id = :id')
            ->setParameter('id', $id)
            ->executeQuery()
            ->fetchAssociative();

        if ($result === false) {
            return null;
        }

        return $this->mapToCard($result);
    }

    private function mapToCard(array $row): Card
    {
        return Card::create(
            $row['question'],
            $row['answer'],
            $row['initial_test_date'] ? new \DateTime($row['initial_test_date']) : new \DateTime(),
            (bool) $row['active'],
            (int) $row['delay'],
            $row['id'],
        );
    }
}
```

Comme vous le constatez, en réalité nous n'utilisons pas l'*ORM* de Doctrine, car nous ne faisons aucun *mapping* d'entité.
Nous utilisons uniquement **Doctrine DBAL** (***Database Abstraction Layer***) pour construire nos requêtes.

Avantages de **DBAL** ? C'est beaucoup plus léger que l'ORM en entier, on n'injecte que l'object `Connection`, et c'est bon on peut se connecter et faire des requêtes dans notre base, tout en profitant du `QueryBuilder` pour nous aider à construire nos requêtes.
De plus, les performances sont bien plus intéressantes qu'avec la surcouche de l'ORM.

Inconvénient ? Pas de méthode magique (`findBy`, etc...), il faut écrire toutes nos requêtes, même les plus simples (je vois ça aussi comme un avantage pour garder le contrôle sur les données récupérées et la performance).

Autre inconvénient, qui dit pas d'*ORM* dit pas de *mapping* automatique entre le résultat de la requête SQL et notre entité `Card`. Et donc c'est à nous de faire ce mapping nous-mêmes, avec la méthode `mapToCard` que vous trouvez ci-dessus.

Dans notre monde simpliste, cette méthode suffit à couvrir tous nos usages, et on continue à gagner en performance sur l'usine qu'est l'ORM. Mais dans le monde réel, il faudra bien penser à valider le données récupérées, et faire un travail de maintenance constant sur ce genre de méthode pour qu'elle résiste au changement. De nombreuses autres alternatives exites sûrement, votre imagination est la seule limite !

### Les Requests, les DTOs et la Serialization

Bien, maintenant que cela est fait, il ne faut pas oublier une étape cruciale : notre application doit être capable de communiquer avec l'extérieur.
Pour cela, on doit pouvoir valider et contrôler les données reçues, mais aussi correctement serializer les données renvoyées, pour ne pas exposer de données sensibles ou superflues.
On va se servir de DTOs pour tout cela, en distinguant deux types:
- Les DTOs de type `Request`
- Les DTOs de type `Response`

Commençons par le plus simple, les `Response`. On crée un objet en y ajoutant uniquement les propriétés que l'on souhaite exposer. Par exemple, lorsque je souhaite essayer répondre à la question d'une `Card`, il vaut mieux que je n'expose pas la réponse, et que seule la question soit accessible.
Créons donc un `TestCardDto` ainsi:

```php
<?php declare(strict_types=1);

namespace Infrastructure\Symfony\Http\Response;

readonly class TestCardResponse
{
    public function __construct(
        public string $id,
        public string $question,
    ) {
    }
}
```

Et voilà, il ne nous restera plus qu'à retourner cet objet depuis notre controller au moment voulu.

Pour ce qui est des `Request`, ce sont aussi de simples DTOs, mais sur lesquels on ajoute des `Constraint` du Validator de Symfony. Mettons que je souhaite créer une nouvelle `Card`, je n'accepterai que trois informations:
- La question (qui ne doit pas être vide)
- La réponse (pareil)
- Le statut de la Carte (par défaut à `true`)

Ce qui donne:

```php
<?php declare(strict_types=1);

namespace Infrastructure\Symfony\Http\Requests;

use Domain\Card;
use Symfony\Component\ObjectMapper\Attribute\Map;
use Symfony\Component\Validator\Constraints as Assert;

#[Map(target: Card::class)]
readonly class CreateCardRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'La question ne peut pas être vide')]
        public string $question = '',
        #[Assert\NotBlank(message: 'La réponse ne peut pas être vide')]
        public string $answer = '',
        public ?\DateTimeInterface $initialTestDate = null,
        public bool $active = true,
    ) {
    }
}
```

<div class="admonition important" markdown="1"><p class="admonition-important">Important</p>
Vous vous demandez peut-être pourquoi je fais de la validation de données ici dans l'Infrastructure plutôt que via des règles de gestion dans le Domain. C'est vrai, ce devrait être le rôle du Domain de contenir ces règles !
<br />
Il est totalement normal de se poser cette question et c'est là une limite parfois floue qu'il vous reviendra de trancher: est-ce que je fais une validation <b>technique</b> (le format d'une donnée brute en entrée par exemple) ou une validation <b>fonctionnelle</b>, auquel cas il <b>faut</b> en effet que cette règle soit contenue dans le Domain.
<br />
Ici, je vérifie simplement que mes données en entrée ne sont pas vides, et j'estime que ça n'a aucun intérêt fonctionnel, et pas de valeur métier, je décide donc de laisser la charge de cette validation au <code>Validator</code> de Symfony.
<br/>
À vous d'arbitrer quand vous vous retrouverez dans des cas similaires !
</div>

Vous remarquerez le namespace de ces DTO, respectivement `Infrastructure\Symfony\Http\Response` & `Infrastructure\Symfony\Http\Requests`.
J'ai fait le choix de les placer dans le répertoire `Symfony\Requests` car cela me parraissait le plus logique, mais surtout parce que les `Requests` utilisent le **Validator** et l'**ObjectMapper** de Symfony, ce qui en font des objets totalement dépendants du Framework.

Vous aurez remarqué que je n'ai pas encore mentionné l'utilisation de l'`ObjectMapper` dans notre `CreateCardRequest`. Prenons un instant pour parler de ce composant.

### Symfony Object Mapper

Au moment où j'écris ces lignes, le nouveau composant Symfony `ObjectMapper` vient de sortir.
C'est une super nouvelle car ce dernier va grandement faciliter le mapping d'un objet à un autre.
Je vous laisse le [lien vers la documentation](https://symfony.com/doc/current/object_mapper.html) de ce nouveau composant pour en savoir plus.

Ce qu'il faut retenir, c'est que Symfony va se servir du nom des propriétés de notre DTO pour les faire correspondre avec notre objet métier, sans avoir besoin de toujours créer un `new Card()` à chaque réception d'une `Request`. J'ai juste besoin d'ajouter l'attribut `#[Map(target: Card::class)]`, au dessus de mon DTO, et c'est bon il est prête à être mappé sur mon objet `Card`.

Mais pour voir ce composant en action, il faut que l'on parle des `Controller`, où toute cette logique de communication avec l'extérieur va se dérouler.

### Le Controller

Nous avons décidé de faire une API, c'est donc un Controller HTTP que nous créerons ici. Mais gardez en tête que nous pourrions décider de renvoyer du HTML, ou de ne fonctionner uniquement que dans un Terminal, cela ne changerait absolument rien: notre Domain et notre Application ne sait pas dans quel environnement elle évolue, si elle est un site web, une desktop app, une app mobile, ou n'importe quoi d'autre. Ça, ne n'est pas du ressort de nos règles métiers, c'est l'Infrastructure qui décide de cette implémentation technique.

Dans les chapitres précédents, nous avons commencé par créer nos règles métier dans le Domain, nous avons défini nos UseCase, et nous avons nos Request et Response prêts à être utilisés.

C'est l'heure pour le Controller, point d'entrée de notre API, de recevoir ces requêtes et de faire appel à tout ce beau monde.

Première chose à faire, listons toutes les `Card` existantes dans notre base de données:

```php
/** ... */
class CardController extends AbstractController
{
    public function __construct(
        private readonly GetTodayAvailableCardsToTestUseCase $cardsAvailableToTestUseCase,
        /** ... */
    ) {
    }

    #[Route('/cards/test', name: 'app_cards_test', methods: [Request::METHOD_GET])]
    public function listCardsToTest(): JsonResponse
    {
        $cardsToTest = $this->cardsAvailableToTestUseCase->execute();
        $testCards = [];

        foreach ($cardsToTest as $card) {
            $testCards[] = new TestCardDto(
                $card->id ?? '',
                $card->question,
            );
        }

        return $this->json([
            'cards' => $testCards,
        ]);
    }

    /** ... */
```

Dans ce cas ultra-simpliste, nous souhaitons simplement récupérer les `Card` auxquelles je dois répondre aujourd'hui. Je sais que j'ai un UseCase qui me permet de le faire, auquel je fais appel.
Puis, je décide de serializer les données car je ne veux pas exposer les réponses aux questions dans ce cas précis. Pour cela j'utilise le `TestCardDto` créé précédemment. Enfin je retourne mes données, c'est tout !

La logique sera un poil plus complexe lorsqu'il s'agira de vouloir créer une nouvelle `Card`:

```php
    #[Route('/new', name: 'app_card_new', methods: [Request::METHOD_POST])]
    public function newCard(#[MapRequestPayload] CreateCardRequest $createCardRequest): JsonResponse
    {
        $violations = $this->validator->validate($createCardRequest);

        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }

            return $this->json([
                'error' => 'Validation failed',
                'violations' => $errors,
            ], Response::HTTP_BAD_REQUEST);
        }

        $card = $this->objectMapper->map($createCardRequest, Card::class);

        try {
            $this->createCardUseCase->execute($card);

            return $this->json([
                'message' => 'Card created successfully',
                'card' => $card,
            ], Response::HTTP_CREATED);
        } catch (CardCreationException $e) {
            throw new BadRequestHttpException('Failed to create card: ' . $e->getMessage(), $e);
        }
    }
```

Bon, découpons cette métode en plusieurs morceaux :

On commence par définir notre route `POST` et on utilise le `MapRequestPayload` de Symfony pour automatiquement mapper la requête vers notre DTO `CreateCardRequest`. Si le mapping n'est pas possible, Symfony retournera automatiquement une Exception.

Notre Request est à présent bien arrivée jusqu'à nous, on va pouvoir la valider avec le Validator de Symfony, et les `Constraint` que l'on a appliqué au DTO. Si des erreurs de validation sont trouvées, on les renvoit de manière très triviale.

Si tout va bien, on va pouvoir utiliser l'`ObjectMapper` de Symfony, qui va automatiquement nous créer un nouvel objet `Card`, et l'hydrater avec les données de notre `CreateCardRequest`.

Les données sont validées, et on manipule enfin un objet que le Domain comprend: une `Card`.
On peut donc faire appel à notre Application via le `CreateCardUseCase`. On sait qu'il peut renvoyer une Exception, donc on englobe le tout dans un try / catch, et en renvoit notre `Card` nouvellement créée si tout s'est bien passé. Ici, j'estime qu'il n'y a nullement besoin de serializer la donnée, car je viens moi-même de créer cette `Card`.

C'est tout ! Notre Controller n'a pas à savoir ce qui se passe à l'intérieur de l'Application, il ne sert que de passe plat entre des données en entrée (qu'il faut certes valider et formatter), et des données en retour (que l'on peut vouloir serializer).

## La Command

N'oublions pas qu'un **cron** tourne tous les jours pour envoyer un mail si nécessaire, pour nous prévenir si des Cartes sont présentes dans le compartiment du jour, et qu'on doit y répondre.

Pour cela, on s'est créé un cas d'usage dans la couche Application, et il ne nous reste plus qu'à l'appeler. Tirons profit du composant `Command` de Symfony, et ajoutons cette commande:

```php
<?php

declare(strict_types=1);

namespace Infrastructure\Symfony\Command;

use Application\SendDailyCardsUseCase;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:daily-test-notif',
    description: 'Daily Notification for test',
)]
class DailyTestNotifCommand extends Command
{
    public function __construct(private readonly SendDailyCardsUseCase $sendDailyCardsUseCase)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->sendDailyCardsUseCase->execute();

        return Command::SUCCESS;
    }
}
```

On pourrait même rajouter un `try / catch` si jamais notre `UseCase` lève une `Exception`, pour afficher une erreur proprement dans le terminal.

Et c'est tout, si demain on souhaite envoyer cet email en cliquant sur un bouton depuis une page, on pourra jeter cette commande, créer un Controller, appeler ce même `UseCase`, et rien d'autre que la couche Infrastructure n'aura a changer, pratique !

## Félicitations !

Notre Domain est parfaitement bien isolé du reste, tout est faiblement couplé grâce aux interfaces, et je peux me concentrer sur l'essentiel: développer de la valeur métier.

Bien sûr, je peux toujours m'amuser à choisir des implémentations techniques complexes, challengeantes ou farfelues si l'envie m'en prend, mais au moins mon code métier n'en pâtira jamais, et si un jour je fais de mauvais choix techniques, je peux juste tout remplacer sans toucher au coeur de mon application.
