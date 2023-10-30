---
contentType: tutorial-step
tutorial: api-versioning-et-retrocompatibilite-avec-symfony
slug: ajout-de-la-factory-pour-instancier-les-changements
title: Ajout de la factory pour instancier les changements
---

A présent implémentons la classe `Acme\VersionChanges\ChangesFactory`.

### Ajout de la classe

Créez donc le fichier suivant :

```php
<?php

namespace Acme\VersionChanges;

use Symfony\Component\HttpFoundation\RequestStack;

class ChangesFactory
{
    /**
     * @var array
     */
    private $versions;

    /**
     * @var RequestStack
     */
    private $request;

    /**
     * @param array $versions
     * @param RequestStack $requestStack
     */
    public function __construct(array $versions, RequestStack $requestStack)
    {
        $this->versions = $versions;
        $this->requestStack = $requestStack;

        $this->prepare();
    }

    /**
     * @param string $version
     *
     * @return bool
     */
    public function has($version)
    {
        return isset($this->versions[$version]);
    }

    /**
     * @param string $version
     *
     * @return AbstractVersionChanges|null
     */
    public function get($version)
    {
        if (!$this->has($version)) {
            return;
        }

        return $this->versions[$version];
    }
}
```

Cette classe prend donc en entrée le tableau de versions déclaré en tant que `parameters` Symfony ainsi que le `RequestStack` que nous irons injecter dans nos fichiers d'application de changements de versions.

Notez que, par la suite, vous pourrez avoir besoin d'injecter Doctrine afin de récupérer des données en base de données et pas simplement de les remodeler.

Nous avons également écrit deux méthodes, `has($version)` et `get($version)`, assez simples pour retourner une version.

Cependant, les yeux les plus aguerris auront remarqué la présence dans le constructeur de l'appel à la méthode `prepare()` qui va nous permettre d'instancier les namespaces fournis dans la configuration en classes PHP utilisables.

La méthode à ajouter est la suivante :

```php
    /**
     * Prepares class instances from class name.
     *
     * @throws \RuntimeException When version changes class does not exist or does not implement VersionChangesInterface.
     */
    protected function prepare()
    {
        foreach ($this->versions as $version => $class) {
            if (!class_exists($class)) {
                throw new \RuntimeException(sprintf('Unable to find class "%s".', $class));
            }

            if (!$class instanceof VersionChangesInterface) {
                throw new \RuntimeException(sprintf('Class "%s" does not implement VersionChangesInterface.', $class));
            }

            $instance = new $class($this->requestStack);

            $this->versions[$version] = $instance;
        }
    }
```

Enfin, le listener implémenté dans l'étape précédente avait besoin d'une méthode `getHistory($version)` qui avait pour objectif de nous retourner les fichiers de changements de version (instanciés) à jouer en fonction de la version courante.

Nous ajoutons donc la méthode :

```php
    /**
     * Returns compatibility changes history for a given version.
     *
     * @param string $version
     *
     * @return array|null
     */
    public function getHistory($version)
    {
        if (!$this->has($version)) {
            return;
        }

        $index = array_search($version, array_keys($this->versions));

        return array_slice($this->versions, 0, $index + 1);
    }
```

Ainsi, dans le cas ou une version `1.0.0` est demandée, seuls les fichiers de changements `1.0.1` et `1.0.0` seront joués. Les versions précédentes tel que `0.0.9` seront ignorées.

Pour vous aider à mieux comprendre la façon dont cet historique de version est récupéré, voici comment serait testé unitairement (avec PHPUnit) cette méthode :

```php
<?php

namespace Tests\Acme\VersionChanges;

use Acme\VersionChanges\ChangesFactory;
use Symfony\Component\HttpFoundation\RequestStack;

class ChangesFactoryTest extends \PHPUnit_Framework_TestCase
{
    /**
     *
     * @var array
     */
    protected $versions;

    /**
     *
     * @var RequestStack
     */
    protected $requestStack;

    /**
     *
     * @var ChangesFactory
     */
    protected $changesFactory;

    /**
     * {@inheritdoc}
     */
    protected function setUp()
    {
        $this->request = $this->getMockBuilder('Symfony\Component\HttpFoundation\RequestStack')
            ->disableOriginalConstructor()
            ->getMock();

        $this->versions = [
            '1.1.0' => 'Acme\VersionChanges\VersionChange110',
            '1.0.0' => 'Acme\VersionChanges\VersionChange100',
            '0.9.0' => 'Acme\VersionChanges\VersionChange090',
            '0.8.0' => 'Acme\VersionChanges\VersionChange080',
        ];

        $this->changesFactory = new ChangesFactory($this->versions, $this->requestStack);
    }

    /**
     * {@inheritdoc}
     */
    protected function tearDown()
    {
        $this->request = null;
        $this->versions = null;
        $this->changesFactory = null;
    }

    /**
     * Test getHistory() when version 1.1.0
     */
    public function testGetHistoryWithVersion110()
    {
        $history = $this->versionChanges->getHistory('1.1.0');

        $this->assertCount(1, $history);
        $this->assertInstanceOf('Acme\VersionChanges\VersionChange110', $history[0]);
    }

    /**
     * Test getHistory() when version 1.0.0
     */
    public function testGetHistoryWithVersion100()
    {
        $history = $this->versionChanges->getHistory('1.0.0');

        $this->assertCount(2, $history);
        $this->assertInstanceOf('Acme\VersionChanges\VersionChange110', $history[0]);
        $this->assertInstanceOf('Acme\VersionChanges\VersionChange100', $history[1]);
    }
}
```

Pour rappel, n'oubliez pas de vous assurer du comportement de vos méthodes en écrivant des tests unitaires.

### Ajout du service Symfony

Afin que ce service soit injecté par l'injection de dépendance de Symfony, nous devons également déclarer le service :

```php
acme.version.changes_factory:
    class: Acme\VersionChanges\ChangesFactory
    arguments: ["%versions%", "@request_stack"]
```

### Prochaine étape

Notre structure est prête, il ne nous reste plus qu'à implémenter les fichiers de changements, dans l'étape suivante.
