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
<?php

declare(strict_types=1);

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


### Doctrine et DBAL

Bien ! Parlons à présent de notre ORM, Doctrine. On le place dans un dossier à part, et dans notre cas nous n'avons que notre seul Repository à implémenter.

Voilà à quoi cela ressemble : 

```php
<?php

declare(strict_types=1);

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
De plus, qui dit pas d'*ORM* dit pas de *mapping*. Et donc c'est à nous de faire ce mapping nous-mêmes, avec la méthode `mapToCard` que vous trouvez ci-dessus.
Dans notre monde simpliste, cette méthode suffit à couvrir tous nos usages, et on continue à gagner en performance sur l'usine qu'est l'ORM. Mais dans le monde réel, il faudra bien penser à valider le données récupérées, et faire un travail de maintenance constant sur ce genre de méthode pour qu'elle résiste au changement. De nombreuses autres alternatives exites sûrement, votre imagination est la seule limite !

Super ! Attaquons maintenant le plus gros morceau de notre Infrastrucure, j'ai nommé le point d'entrée de notre Application ...

### Les Requests, les DTOs et la Serialization

-> Valider les données en entrée (Symfony Validator + constraint sur les Requests)

-> Serializer les données (pas l'affaire du Domain mais de l'infra, donc via les DTO. ça se disctute pour les mettre dans le Domain si la serialization est une vraie problématique métier).


### Symfony Object Mapper

-> Au moment où j'écris ces lignes, le nouveau composant Symfony Object Mapper vient de sortir, qui facilite grandement le mapping d'un objet à un autre. On va pouvoir l'utiliser pour mapper les Request vers notre objet `Card`.

-> Usage : exemple


### Le Controller

Nous avons décidé de faire une API, c'est donc un Controller HTTP que nous créerons ici. Mais gardez en tête que nous pourrions décider de renvoyer du HTML, ou de ne fonctionner uniquement que dans un Terminal, cela ne changerait absolument rien: notre Domain et notre Application ne sait pas dans quel environnement elle évolue, si elle est un site web, une desktop app, une app mobile, ou n'importe quoi d'autre. Ça, ne n'est pas du ressort de nos règles métiers, c'est l'Architecture qui décide de cette implémentation technique.

-> On prend nos Request, on les valide, on les MAP à la Card, on les passe au UseCase, on renvoit le DTO.
