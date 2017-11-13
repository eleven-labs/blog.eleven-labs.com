---
layout: post
title: Pattern Specification
authors:
    - rpierlot
lang: fr
permalink: /fr/pattern-specification-2/
date: '2016-09-14 16:36:55 +0200'
date_gmt: '2016-09-14 14:36:55 +0200'
categories:
- Php
tags:
- php
- architecture
- conception
---

Au cours de mes différentes expériences professionnelles, j'ai dû mettre en place de nombreuses règles métier dans diverses applications riches fonctionnellement. Un jour, j'ai été confronté à une façon de faire différente : l'utilisation du pattern specification. Cette méthode s’est avérée structurante pour les projets, et si vous ne la connaissez pas encore elle mérite qu’on s’y attarde.

### Commençons

Imaginez une application bancaire par exemple. Cette dernière comprend des clients et des comptes bancaires. Un client peut avoir un ou plusieurs comptes bancaires. Vous devez mettre en place un système hyper simple de virement bancaire entre comptes d’un même client, comprenant la règle métier suivante :

*   Un client ne peut pas effectuer un virement depuis un compte dont le solde est inférieur à 0
*   Le client associé au compte bancaire débité doit etre actif.

Vous apercevez donc clairement la condition qui empêcherait le virement bancaire de se faire pour deux comptes d’un même client.

Dans un cas classique, il vous serait possible d’écrire cela sous cette forme :

```php
<?php

namespace ElevenLabs\Application;

use ElevenLabs\Domain\Payment\Entity\Account;

class TransferMoneyCommand
{
    /**
     * @param Amount $accountToDebit
     * @param Amount $accountToCredit
     * @param float  $amount
     */
    public function execute(Account $accountToDebit, Account $accountToCredit, $amount)
    {
        if ($accountToDebit->getBalance() - $amount > 0 && $accountToDebit->getOwner()->isActive()) {
            //transfer authorized
            //...
        }
    }
}
```

Cette règle métier, bien que triviale, doit être implémentée dès que l’on souhaite effectuer un virement.
Il apparait plusieurs contraintes, suite à cette implémentation.

Tout d’abord, si notre règle métier évolue, nous devrons modifier la (ou les) classe(s) qui l’utilise(nt). Ensuite, une telle implémentation dans une condition _if_ n’est pas explicite du tout.

C’est là qu’entre en scène le _pattern_ spécification. L’idée de la spécification est d’isoler une règle métier, en la séparant de son utilisation. Elle est utilisée dans le cas de la validation, de la sélection et dans la construction de logique métier.

Il existe principalement trois types de spécifications :

*   les spécifications _hard coded_
*   les spécifications paramétrées
*   les spécifications composites

Une spécification est régie par l'interface suivante :

```php
<?php

namespace ElevenLabs\Domain;

interface Specification
{
    /**
     * @param $candidate
     *
     * @return bool
     */
    public function isSatisfiedBy($candidate);
}
```

    ### Spécifications Hard-coded

Ce type de specifications permet de déclarer en dur la connaissance métier sans pouvoir modifier la règle métier de l'extérieur.

Une règle métier peut donc être, par exemple, traduite de la sorte :

```php
<?php

namespace ElevenLabs\Domain\Payment;

use ElevenLabs\Domain\Specification;

class AccountCanTransferMoney implements Specification
{
    /**
     * @param \ElevenLabs\Domain\Payment\Entity\Account $account
     *
     * @return boolean
     */
    public function isSatisfiedBy($account)
    {
         return $account->getBalance() > 0 && $account->getOwner()->isActive();
    }
}
```

En ayant créé une classe séparée pour appliquer notre règle, nous gagnons en découplage et en clarté. Cependant, il apparait évident que nous sommes cantonnés à l'object $account, et qu'aucune information ne peut être apportée de l'extérieur. Nous ne pouvons toujours pas utiliser ce type de spécification dans notre _TransferMoneyCommand_ car il ne répond pas totalement à notre règle métier (seul le solde actuel du compte est comparé).

### Spécifications paramétrées

Les spécifications paramétrées sont identiques au point précédent, sauf qu'elles résolvent le problème que nous venons d'indiquer en permettant de passer des paramètres extérieurs à notre _candidate_.

```php
<?php

namespace ElevenLabs\Domain\Payment;

use ElevenLabs\Domain\Specification;

class AccountCanTransferMoney implements Specification
{
    /** @var float */
    private $amount;

    /**
     * @param float $amount
     */
    public function __construct($amount)
    {
        $this->amount = $amount;
    }

    /**
     * @param \ElevenLabs\Domain\Payment\Entity\Account $account
     *
     * @return boolean
     */
    public function isSatisfiedBy($account)
    {
         return $account->getBalance() - $this->amount > 0 && $account->getOwner()->isActive();
    }
}
```

Avec ce type de spécifications, nous gardons les mêmes avantages que précédemment, et nous gagnons en flexibilité.

Voici ce que donnerait notre commande avec l'utilisation de notre spécification paramétrée :

```php
<?php

namespace ElevenLabs\Application;

use ElevenLabs\Domain\Payment\Entity\Account;
use ElevenLabs\Domain\Payment\Specification\AccountCanTransferMoney;

class TransferMoneyCommand
{
    /**
     * @param Account $accountToDebit
     * @param Account $accountToCredit
     * @param float   $amount
     */
    public function execute(Account $accountToDebit, Account $accountToCredit, $amount)
    {
        $accountCanTransferMoney = new AccountCanTransferMoney($amount);

        if (true === $accountCanTransferMoney->isSatisfiedBy($accountToDebit)) {
            //transfer authorized
            //...
        }
    }
}
```

Pour simplifier l'explication des spécifications paramétrées, j'ai instancié la class AccountCanTransferMoney en dur. Une amélioration notable de cette utilisation serait d'injecter dans la commande la spécification, au lieu de l'instancier en dur, afin de pouvoir tester unitairement notre commande.

### Spécifications composites

Le dernier type de spécification que nous aborderons aujourd'hui concerne la spécification composite. Cette dernière se base sur ce que nous venons de voir. En effet, ce pattern utilise une composition de spécifications pour exister. Les opérations logiques entre deux (ou plus) spécifications font parties des _composite specifications._

L'exemple suivant vous explique l'implémentation de l'opération logique AND :

```php
<?php

namespace ElevenLabs\Domain;

abstract class Composite implements Specification
{
    /**
     * {@inheritdoc}
     */
    abstract public function isSatisfiedBy($candidate);

    /**
     * @param Specification $spec
     *
     * @return AndSpecification
     */
    public function andIsSatisfiedBy(Specification $spec)
    {
        return new AndSpecification($this, $spec);
    }

    //...
}

class AndSpecification extends Composite
{
    /** @var Specification */
    private $a;

    /** @var Specification */
    private $b;

    /**
     * @param Specification $a
     * @param Specification $b
     */
    public function __construct(Specification $a, Specification $b)
    {
        $this->a = $a;
        $this->b = $b;
    }

    /**
     * {@inheritdoc}
     */
    public function isSatisfiedBy($candidate)
    {
        return $this->a->isSatisfiedBy($candidate) && $this->b->isSatisfiedBy($candidate);
    }
}
```

Ainsi, si l'on déclare une spécification composite, on peut la chainer à d'autres spécifications, comme ci-dessous, en modifiant notre spécification précédente _AccountCanTransferMoney_ :

```php
<?php

namespace ElevenLabs\Domain\Payment;

use ElevenLabs\Domain\Composite;

class AccountCanTransferMoney extends Composite
{
    /** @var float */
    private $amount;

    /**
     * @param float $amount
     */
    public function __construct($amount = 0)
    {
        $this->amount = $amount;
    }

    /**
     * @param \ElevenLabs\Domain\Payment\Entity\Account $account
     *
     * @return boolean
     */
    public function isSatisfiedBy($account)
    {
         return $account->getBalance() - $this->amount > 0;
    }
}
```

```php
<?php

namespace ElevenLabs\Domain\Payment\Specification;

use ElevenLabs\Domain\Specification;

class AccountOwnerIsActive implements Specification
{
    /**
     * @param \ElevenLabs\Domain\Payment\Entity\Account $account
     *
     * @return boolean
     */
    public function isSatisfiedBy($account)
    {
        return $account->getOwner()->isActive();
    }
}
```

Enfin, voici comment utiliser notre composition :

```php
<?php

namespace ElevenLabs\Application;

use ElevenLabs\Domain\Payment\Entity\Account;
use ElevenLabs\Domain\Payment\Specification\AccountCanTransferMoney;

class TransferMoneyCommand
{
    /**
     * @param Account $accountToDebit
     * @param Account $accountToCredit
     * @param float   $amount
     */
    public function execute(Account $accountToDebit, Account $accountToCredit, $amount)
    {
        $accountCanTransferMoney = new AccountCanTransferMoney($amount);
        $accountOwnerIsActive = new AccountOwnerIsActive();
        $compositeSpecification = $accountCanTransferMoney->andIsSatisfiedBy($accountOwnerIsActive);

        if (true === $compositeSpecification->isSatisfiedBy($accountToDebit)) {
            //transfer authorized
            //...
        }
    }
}
```

Les avantages de ce type de spécifications sont bien sûr le support des opérations logiques, et donc la création de règles métier plus complexes. Il est maintenant possible de combiner les spécifications. La flexibilité est encore accrue, mais attention à la complexité générée !

### Recap

Les avantages du pattern spécification sont les suivants :

*   Découplage augmenté car la responsabilité de la validation est maintenant limitée à une classe isolée
*   Ainsi, il est plus facile de tester unitairement à la fois les spécifications et les classes utilisant ces dernières
*   L'implicite est rendu explicite avec une définition claire des règles métier

## Références

[Eric Evans & Martin Fowler - Specifications](http://martinfowler.com/apsupp/spec.pdf){:target="_blank" rel="nofollow"}

[Specification pattern: C# implementation](http://enterprisecraftsmanship.com/2016/02/08/specification-pattern-c-implementation/){:target="_blank" rel="nofollow"}
