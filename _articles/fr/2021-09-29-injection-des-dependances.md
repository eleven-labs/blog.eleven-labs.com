---
contentType: article
lang: fr
date: '2021-09-29'
slug: injection-des-dependances
title: L'injection des dépendances dans Symfony
excerpt: >-
  Vous travaillez avec Symfony, mais l'injection de dépendances reste un peu
  floue pour vous ? Découvrez son fonctionnement et apprenez comment en tirer
  profit au maximum.
categories:
  - php
authors:
  - marishka
keywords:
  - bonnes pratiques
  - symfony
  - di
---

## Injection de dépendances
L'injection de dépendances est un mécanisme qui permet d'implémenter le principe de l'inversion de contrôle.
L'idée est de créer dynamiquement (_injecter_) les dépendances d'une classe en utilisant une description (un fichier de configuration par exemple).
Cette méthode va nous permettre de ne plus exprimer les dépendances entre les composants dans le code de manière statique, mais de les déterminer dynamiquement à l'exécution.

Prenons un exemple pour illustrer. Imaginons que nous avons une classe _A_, qui dépend des classes _B_ et _C_.
Dans mon code, j'aurai besoin de faire ceci :

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

Avec l'injection des dépendances, je ne vais plus avoir besoin de créer les instances des classes _B_ et _C_ manuellement, mais je vais les injecter :

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

Encore mieux, depuis PHP 8, je peux faire simplement ceci :

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

Les instances des classes _B_ et _C_ seront créées par une classe dont la responsabilité est de lire les fichiers de configuration et de créer des objets.

L'intérêt principal de l'injection de dépendances est de séparer la création des objects de leur utilisation.
De plus, en injectant nos dépendances, nous pouvons utiliser des interfaces au lieu des classes et ainsi éviter un couplage fort entre nos classes.

## Dans Symfony
Dans le framework Symfony, l'injection de dépendances est réalisée via le _Container_ de services, qui est construit par le _ContainerBuilder_. Celui-ci est initialisé par le _Kernel_.

### Service Container
En environnement de production, le kernel va d'abord chercher une version cachée du _Container_ par souci de performances.
Si elle existe, c'est la version cachée qui est utilisée. Sinon, le kernel va en construire une en se basant sur la configuration de l'application.

Comme vous le savez, la configuration d'une application Symfony est faite dans le dossier _config_.
Le _ContainerBuilder_ va donc parser tous les fichiers de configuration pour les traiter et récupérer tous les paramètres et services de notre application, et aussi de nos dépendances.
Il va prendre en compte, entre autres, les services tagués et les _Compiler pass_ (cf. plus bas).
Une fois la compilation faite, une version cachée du _Container_ va être _dump_ pour être utilisée par les requêtes suivantes.

Pour en savoir plus sur ce process, vous pouvez [lire cette documentation](https://symfony.com/doc/current/components/dependency_injection/workflow.html).

### Déclaration de services
Revenons sur notre exemple précédent et voyons comment déclarer nos classes en tant que services :

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

Je configure chacun de mes services séparément.
Pour injecter un service dans un autre, je le passe en arguments du second service, en le préfixant par un '@'.

### Autowiring
Depuis la version 3.4 de Symfony, nous avons la possibilité d'utiliser l'_autowiring_, ce qui va m'éviter de déclarer tous les services à la main :

```yaml
# config/services.yaml
services:
    # la configuration par défaut de services dane *ce* fichier
    _defaults:
        autowire: true      # Injecte automatiquement les dependances dans nos services
        autoconfigure: true # Déclare automatiquement nos services en tant que commandes, event subscribers, etc.

    # rendre les classes dans src/ disponibles pour être utilisées en tant que services
    # ceci va créer un service par classe donc l'id sera son nom complet
    App\:
        resource: '../src/*'
        exclude: '../src/{DependencyInjection,Entity,Tests,Kernel.php}'

    # ...
```

Dans nos services, on peut injecter non seulement d'autres services, mais aussi les paramètres configurés dans l'application.
Voici un exemple :

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
            # tout argument $adminEmail dans un constructeur aura cette valeur
            $adminEmail: 'admin@example.com'
```

Ce sont des exemples basiques pour vous donner un aperçu de l'injection de dépendances.
Je vous invite à lire la [documentation Symfony sur l'injection de dépendances](https://symfony.com/doc/current/service_container.html) pour une vision complète de ce qu'il est possible de faire avec ce composant, qui est très puissant !

## Services tagués
Ceux qui utilisent Symfony depuis quelque temps ont déjà probablement eu affaire aux services tagués.
Les services tagués sont un moyen de dire à Symfony que votre service doit être chargé d'une certaine façon.
Prenons l'exemple suivant : je souhaite formatter les exceptions de mon application, pour cela je vais intercepter un évènement précis.

```yaml
# config/services.yaml
services:
    App\EventListener\ExceptionListener:
        tags:
            - { name: kernel.event_listener, event: kernel.exception }
```

Tous les services tagués `kernel.event_listener` sont chargés par le `FrameworkBundle` et sont appelés en fonction de l'évènement auquel ils sont liés.
Il existe une [multitude de tags disponibles dans Symfony](https://symfony.com/doc/current/reference/dic_tags.html), et chacun a une fonction bien précise.
Ainsi, vous pouvez agir sur des évènements comme ci-dessus, mais aussi ajouter une extension Twig, intervenir au moment de la sérialisation d'une entité, etc.

## Tags personnalisés et Compiler pass
Imaginons maintenant que dans mon application j'ai un système de génération de documents.
Je voudrais implementer une solution propre et facilement maintenable, avec un service central qui, en fonction du type de document souhaité, va déléguer la génération du document au bon service.

Pour ceci, je vais créer un générateur par type de document souhaité, les taguer avec un tag personnalisé, et ensuite les injecter à mon service principal de génération de documents.

Au départ, je crée une interface pour mes générateurs, pour m'assurer qu'ils ont tous le même comportement :

```php
<?php

namespace App\Services;

interface DocumentGeneratorInterface {
    public function supports(string $type): bool;
    public function generate(array $data): mixed;
}
```

Ensuite, je prépare mon service principal de génération de documents, qui sera uniquement injecté dans les endroits de mon application où j'aurai besoin de générer un document :

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

Enfin, j'implémente mes générateurs par type de document :
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

Pour dire à l'injection de dépendances que mes générateurs doivent avoir un tag spécifique, je peux le déclarer de cette façon :
```yaml
# config/services.yaml
services:
    _instanceof:
        # toutes les instances de DocumentGeneratorInterface seront automatiquement tagués
        App\Services\DocumentGeneratorInterface:
            tags: ['app.document_generator']
```

Maintenant, il ne me reste plus qu'à indiquer à l'injection de dépendances que tous les services tagués `app.document_generator` doivent être injectés dans ma classe `DocumentGenerator`.
Pour cela, je vais créer un _Compiler pass_ personnalisé :

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

Enfin, dernière étape, ajouter mon _Compiler pass_ dans le Kernel :

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

Grâce à mon tag personnalisé, je peux très facilement ajouter un nouveau type de document à générer dans l'application, sans devoir modifier le reste de l'application.

### Pour aller plus loin
Nous venons de parcourir ensemble en grandes lignes l'injection de dépendances dans Symfony.
C'est un composant très puissant et central au framework.
Si vous voulez en savoir plus, n'hésitez pas à parcourir la [documentation très bien faite](https://symfony.com/doc/current/service_container.html#learn-more).

À bientôt !
