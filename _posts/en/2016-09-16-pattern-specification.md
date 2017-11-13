---
layout: post
title: Pattern Specification
authors:
    - rpierlot
lang: en
permalink: /pattern-specification/
date: '2016-09-16 11:24:46 +0200'
date_gmt: '2016-09-16 09:24:46 +0200'
categories:
- Non classé
tags: []
---

Through my different professional experiences, I had to set a lot of business rules in rich web apps. One day, I stumbled upon a different way to deal with those: using the specification pattern. This method has proven to be structuring and deserves some attention if you do not know what it is.

### Let's dig in

Imagine a simple banking application for instance. This app only has clients and bank accounts. A client can have one or multiple accounts, and your job is to create a very simple system of wire transfer between accounts of a same client with this business rule:

*   A client cannot transfer money if his account has a balance equals to 0 or less.
*   The client associated to his debiting account must be active.

You can clearly see the condition which would prevent a transfer from happening.

In a simple implementation, you would write it this way:

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

This business rule, although trivial, needs to be implemented every time we want to do a wire transfer.
Many constraints arise from such implementation.

First off, if our business rule evolves, we have to change the (or all) class that uses it. Then, this implementation in a _if_ statement is really not explicit at all.

This is where the specification pattern comes into play. The main idea is to isolate the business rule, separating it from its use. It's used for validation, selection and building of business logic.

Mainly three types of specification exist:

*   hard coded specifications
*   parameterized specifications
*   composite specifications

A specification is driven by the following interface:

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

### Hard-coded Specifications

This type of specification enables us to hard code the business knowledge without having the possibility to modify the business rule from the outside.

A business rule can then be translated this way:

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

Having created a separated class in order to apply our business rule, we gain clarity and decoupling. Although, it appears obvious that we are condemned to only using our object $account, and that no additional info can be brought from the outside. We still can't use this type of specification in our _TransferMoneyCommand_ because it does not comply totally to our business rule (only the balance is compared).

### Parameterized specifications

Parameterized specifications are identical to what we've been talking about, but they resolve the issue we've just mentioned, allowing us to get outside parameters to our candidate.

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

With this type of specifications, we keep the same pros as before, and we gain flexibility.

This is how our command would look like using our parameterized specification:

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

To simplify my explanation on parameterized specifications, I've hard coded the instantiation of the class AccountCanTransferMoney. A noticeable improvement of this use would be to inject the specification directly into the command, in order to better unit test our command.

### Composite specifications

The last type of specification I'd like to take a look into is composite specifications. Such specification bases itself on what we've seen. Indeed, it uses composition to exist. Logical operations between two (or more) specifications are part of composite specifications.

The following example explains the implementation of the AND logical operator:

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

Then, if we instantiate a composite spec, we can chain it to other specifications (see below), by modifying our previous _AccountCanTransferMoney_ specification:

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
    public function isSatisfiedBy($account);
    {
        return $account->getOwner()->isActive();
    }
}

```

Finally, here is how we use our composition:

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

The advantages of this type of specifications are obviously the support of logical operator, and therefore the creation of even more complex business rules. It's now possible to combine specifications. Flexibility is improved, but beware of additional complexity!

### Recap

Advantages of the specification pattern are as follow:

*   Increased decoupling because the responsability of the validation is now limited to an isolated class
*   So it is easier to unit test specifications and classes using them
*   We made the implicit explicit with a clear definition of business rules

## References

[Eric Evans & Martin Fowler - Specifications](http://martinfowler.com/apsupp/spec.pdf){:target="_blank" rel="nofollow"}

[Specification pattern: C# implementation](http://enterprisecraftsmanship.com/2016/02/08/specification-pattern-c-implementation/){:target="_blank" rel="nofollow"}
