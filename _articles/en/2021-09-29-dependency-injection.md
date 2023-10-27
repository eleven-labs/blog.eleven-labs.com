---
contentType: article
lang: en
date: '2021-09-29'
slug: dependency-injection
title: Dependency injection in Symfony
excerpt: >-
  You work with Symfony, but the concept of dependency injection is a little
  blurry for you? Find out how to take advantage of the component reading this
  article.
categories:
  - php
authors:
  - marishka
keywords:
  - best practices
  - symfony
  - di
---

## Dependency injection
Dependency injection is a mechanism that implements the principle of inversion of control.
The idea is to create dynamically (_inject_) dependencies of a class using a description (a configuration file for example).
This method will allow us to no longer express dependencies between components in the code statically, but to determine them dynamically at execution.

Let's take an example to illustrate this. Imagine that we have a class _A_, that depends on classes _B_ and _C_.
In my code I would need to do this:

```php
<?php

namespace App\Services;

class B implements InterfaceB {
    // ...
}
```

```php
<?php

namespace App\Services;

class C implements InterfaceC {
    // ...
}
```

```php
<?php

namespace App\Services;

class A {
    private B $b;
    private C $c;

    public function __construct()
    {
        $this->b = new B();
        $this->c = new C();
    }

    // ...
}
```

With dependency injection, I will no longer need to create instances of classes _B_ and _C_ manually, I will inject them instead:

```php
<?php

namespace App\Services;

class A {
    private InterfaceB $b;
    private InterfaceC $c;

    public function __construct(InterfaceB $b, InterfaceC $c)
    {
        $this->b = $b;
        $this->c = $c;
    }

    // ...
}
```

Since PHP 8, I can even do this:

```php
<?php

namespace App\Services;

class A {
    public function __construct(
        private InterfaceB $b,
        private InterfaceC $c,
    ) {
    }

    // ...
}
```

Instances of classes _B_ and _C_ will be created by a class whose responsibility is to read configuration files and create objects.

The main advantage of dependency injection is to separate the creation of objects from their use.
Moreover, by injecting our dependencies, we can use interfaces instead of classes and thus avoid a strong coupling between our classes.

## In Symfony
In Symfony framework, dependency injection is done via the service _Container_, which is built by _ContainerBuilder_. The latter is initialized by the _Kernel_.

### Service Container
In a production environment, the kernel will first look for a cached version of the _Container_ for performance concerns.
If it exists, the cached version is used. Otherwise, the kernel will build one based on our application's configuration.

As you know, our Symfony application's configuration is done in the _config_ folder.
The _ContainerBuilder_ will parse all configuration files of our application, and fetch all parameters and services that we have declared, as well as those of our dependencies.
It will take into account, among other things, tagged services and _Compiler passes_ (see below).
Once the compilation is done, a cached version of the _Container_ will be _dumped_ to be used in the following calls.

To learn more about this process, you can [read the documentation](https://symfony.com/doc/current/components/dependency_injection/workflow.html).

### Service declaration
Let's go back to our previous example, and learn how to declare our classes as services:

```yaml
# config/services.yaml
services:
    App\Services\B:

    App\Services\C:

    App\Services\A:
        arguments:
            - '@App\Services\B'
            - '@App\Services\C'
```

I configure each of my services separately.
To inject one service into another, I pass it as an argument of the second service, prefixing it with an '@'.

### Autowiring
Since version 3.4 of Symfony, we have the possibility to use the _autowiring_, which will prevent me from declaring all the services by hand:

```yaml
# config/services.yaml
services:
    # configuration of default services in *this* file
    _defaults:
        autowire: true      # automatically inject dependencies in our services
        autoconfigure: true # automatically declare our services as commands, event subscribers, etc.

    # make classes in src/ available to be used as services
    # this will create a service per class
    App\:
        resource: '../src/*'
        exclude: '../src/{DependencyInjection,Entity,Tests,Kernel.php}'

    # ...
```

In our services, we can inject not only other services, but also the parameters configured in the application.
Here's an example:

```php
<?php

namespace App\Services;

class AdminMailer {
    private string $recipient;

    public function __construct(string $adminEmail)
    {
        $this->recipient = $adminEmail;
    }

    // ...
}
```

```yaml
# config/services.yaml
services:
    _defaults:
        bind:
            # any argument called $adminEmail in a constructor will have this value
            $adminEmail: 'admin@example.com'
```

These are basic examples to give you an overview of dependency injection.
I invite you to read the [Symfony documentation on dependency injection](https://symfony.com/doc/current/service_container.html) for a global view of what is possible to do, this component is very powerful!

## Tagged services
Those who have been using Symfony for some time have probably already encountered tagged services.
Tagged services are a way to tell Symfony that your service needs to be loaded in a certain way.
Take the following example: I want to format the exceptions in my application, for that I am going to intercept a specific event.

```yaml
# config/services.yaml
services:
    App\EventListener\ExceptionListener:
        tags:
            - { name: kernel.event_listener, event: kernel.exception }
```

All services tagged `kernel.event_listener` are loaded by the `FrameworkBundle` and are called depending on the event they are linked to.
There is a [multitude of tags available in Symfony](https://symfony.com/doc/current/reference/dic_tags.html), each one has a specific role.
Thus, you can act on events as seen above, as well as add Twig extensions, interact on an entity's serialization process, etc.

## Custom tags and Compiler passes
Now imagine that in my application I have a document generation system.
I would like to implement a clean and easily maintainable solution, with a central service which, depending on the type of document desired, will delegate the generation of the document to the right service.

For this, I will create a generator per desired document type, tag them with a custom tag, and then inject them into my main document generation service.

Initially, I create an interface for my generators, to make sure they all behave the same:

```php
<?php

namespace App\Services;

interface DocumentGeneratorInterface {
    public function supports(string $type): bool;
    public function generate(array $data): mixed;
}
```

Next, I prepare my main document generation service. Only it will be injected into services in my application where I will need to generate a document:

```php
<?php

namespace App\Services;

class DocumentGenerator {
    private array $documentGenerators;

    public function addGenerator(DocumentGeneratorInterface $generator): void
    {
        $this->documentGenerators[] = $generator;
    }

    public function generate(array $data, string $type): mixed
    {
        /** @var GeneratorInterface $generator */
        foreach ($this->documentGenerators as $generator) {
            if (!$generator->supports($type)) {
                continue;
            }

            return $generator->generate($data);
        }

        throw new \LogicException(sprintf('Document of type %s cannot be handled', $type));
    }
}
```

Finally, I implement my generators by document type:
```php
<?php

namespace App\Services;

class PDFDocumentGenerator {
    public function supports(string $type): bool
    {
        return $type === 'pdf';
    }

    public function generate(array $data): mixed
    {
        // generation du document
    }
}
```

```php
<?php

namespace App\Services;

class CSVDocumentGenerator {
    public function supports(string $type): bool
    {
        return $type === 'csv';
    }

    public function generate(array $data): mixed
    {
        // generation du document
    }
}
```

To tell dependency injection that my generators must have a specific tag, I can declare it this way:

```yaml
# config/services.yaml
services:
    _instanceof:
        # all instances of DocumentGeneratorInterface will be automatically tagged
        App\Services\DocumentGeneratorInterface:
            tags: ['app.document_generator']
```

Now I just have to tell the dependency injection that all the services tagged `app.document_generator` should be injected into my `DocumentGenerator` class.
For that, I'll create a custom _Compiler pass_:

```php
namespace App\DependencyInjection\Compiler;

use App\Services\DocumentGenerator;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class DocumentGeneratorPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        if (!$container->has(DocumentGenerator::class)) {
            return;
        }

        $definition = $container->findDefinition(DocumentGenerator::class);

        $taggedServices = $container->findTaggedServiceIds('app.document_generator');

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall('addGenerator', [new Reference($id)]);
        }
    }
}
```

Finally, last step, add my _Compiler pass_ in the Kernel:

```php
// src/Kernel.php
namespace App;

use App\DependencyInjection\Compiler\DocumentGeneratorPass;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
// ...

class Kernel extends BaseKernel
{
    // ...

    protected function build(ContainerBuilder $container): void
    {
        $container->addCompilerPass(new DocumentGeneratorPass());
    }
}
```

Thanks to my custom tag, I can very easily add a new type of document to generate in the application, without having to modify the rest of the application.

### Learn more
We have just walked through dependency injection in Symfony together.
It is a very powerful component and central to the framework.
If you want to learn more, feel free to browse the [very well done documentation](https://symfony.com/doc/current/service_container.html#learn-more).
