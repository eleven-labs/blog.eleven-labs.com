---
contentType: tutorial-step
tutorial: api-versioning-et-retrocompatibilite-avec-symfony
slug: ajout-de-fichiers-de-changements
title: Ajout de fichiers de changements
---

Comme constaté précédemment, l'interface des fichiers de changements est assez simple. En effet, nous allons avoir principalement besoin de deux méthodes `supports()` et `apply()`.

Ajoutons donc cette interface :

```php
<?php

namespace Acme\VersionChanges;

interface VersionChangesInterface
{
    /**
     * Apply version changes for current request.
     *
     * @param array $data
     *
     * @return array
     */
    public function apply(array $data);

    /**
     * Returns if this version changes is supported for current request.
     *
     * @param array $data
     *
     * @return bool
     */
    public function supports(array $data);
}
```

# Ajout de la classe abstraite

Cette interface sera implémentée par la classe abstraite qui étendra de nos fichiers de versions.

Celle-ci va principalement nous permettre d'abstraire l'injection des différents services dans les fichiers de changements de version.

Ajoutons donc la classe abstraite `Acme\VersionChanges\AbstractVersionChanges` :

```php
<?php

namespace Acme\VersionChanges;

use Symfony\Component\HttpFoundation\RequestStack;

abstract class AbstractVersionChanges implements VersionChangesInterface
{
    /**
     * RequestStack
     */
    protected $requestStack;

    /**
     * Constructor.
     *
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * @return Request
     */
    public function getRequest()
    {
        return $this->requestStack->getCurrentRequest();
    }
}
```

Souvenez-vous, notre service `ChangesFactory` qui instancie ces classes de changements injecte le service `RequestStack`, c'est précisément à cet endroit que nous en avons besoin.

# Ajout d'une classe de changements de version (exemple)

Nous allons maintenant pouvoir ajouter une classe de changements de version.

Imaginons donc que nous ajoutons la classe `Acme\VersionChanges\Version101.php` qui permettra la retrocompatibilité sur la version `1.0.1` de notre API.

Par exemple, celle-ci aura pour objectif de supprimer les entrées de type `taxonomy` des réponses de notre API car il s'agit d'une fonctionnalité active uniquement depuis la version `1.0.2`.

Créons donc le fichier de changement suivant :

```php
<?php

namespace Acme\VersionChanges;

class VersionChanges101 extends AbstractVersionChanges
{
    /**
     * {@inheritdoc}
     */
    public function apply(array $data)
    {
        foreach ($data['results'] as $key => $result) {
            if ('taxonomy' == $result['type']) {
                unset($data['results'][$key]);
            }
        }

        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function supports(array $data)
    {
        return isset($data['results'])
            && array_search('taxonomy', array_column($data['results'], 'type'));
    }
}
```

Dans cet exemple, nous avons la méthode `supports()` qui vérifie que des contenus de type `taxonomy` sont bien présents dans la réponse de cette requête et qu'ils doivent donc être supprimés. C'est ensuite la méthode `apply()` qui s'occupe de supprimer les contenus et de retourner les données mises à jour.

En fonction des cas, ces fichiers peuvent se complexifier mais généralement, ils restent simple et rapide à implémenter par les développeurs lors de l'ajout de fonctionnalités présentant des cas de cassage de compatibilité (breaking changes).

# Prochaine étape

Nous en avons terminé pour l'implémentation, il est temps de tester celle-ci dans la dernière étape.
