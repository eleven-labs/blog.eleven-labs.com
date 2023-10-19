---
contentType: tutorial-step
tutorial: api-versioning-et-retrocompatibilite-avec-symfony
slug: ajout-du-listener-sur-la-reponse-symfony
title: Ajout du listener sur la réponse Symfony
---

Nous allons donc agir sur la réponse de Symfony en implémentant un listener sur l'événement `kernel.response` du framework.

### Ajout de la classe

Commençons donc par créer la classe PHP du listener. Créez un ficier `Acme\Event\Listener\VersionChangesListener` :

```php
<?php

namespace Acme\Event\Listener;

use Acme\VersionChanges\ChangesFactory;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;

class VersionChangesListener
{
    /**
     * @var RequestStack
     */
    protected $requestStack;

    /**
     * @var ChangesFactory
     */
    protected $changesFactory;

    /**
     * Constructor.
     *
     * @param RequestStack $requestStack
     * @param ChangesFactory $changesFactory
     */
    public function __construct(RequestStack $requestStack, ChangesFactory $changesFactory)
    {
        $this->requestStack = $requestStack;
        $this->changesFactory = $changesFactory;
    }

    /**
     * @return Request
     */
    private function getRequest()
    {
        return $this->requestStack->getCurrentRequest();
    }
}
```

La structure du listener est en place. Nous y avons injecté le service `RequestStack` de Symfony ainsi qu'un service nommé `ChangesFactory`. Nous allons créer ce service dans les étapes suivantes.

Le service `RequestStack` va nous servir à récupérer le numéro de version demandé en header de la requête et `ChangesFactory` s'occupera de nous instancier et de nous retourner les classes de changements de rétrocompatibilité de notre API.

Ajoutons donc la méthode `onKernelResponse` qui sera déclenchée par l'`EventManager` de Symfony :

```php
    /**
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        $version = $this->getRequest()->headers->get('X-Accept-Version');

        $versionChanges = $this->changesFactory->getHistory($version);

        if (!$versionChanges) {
            return;
        }

        $data = json_decode($event->getResponse()->getContent(), true);
        $data = $this->apply($versionChanges, $data);

        $response = $event->getResponse();
        $response->setContent(json_encode($data));

        $event->setResponse($response);
    }
```

Nous récupérons ici la valeur de la version envoyée dans le header `X-Accept-Version`, demandons au service `ChangesFactory` de nous récupérer l'historique des changements à jouer pour cette version, puis, si nous en trouvons, nous récupérons les données de la version actuelle et appelons une méthode `apply($versionChanges, $data)` que nous allons déclarer dès maintenant afin de jouer les changements.

Les nouvelles données seront ensuite mises à jour dans l'object réponse de Symfony et envoyées au client.

Pour jouer les changements, il nous manque donc la méthode `apply()` :

```php
    /**
     * Apply given version changes for given data.
     *
     * @param array $versionChanges
     * @param array $data
     *
     * @return array
     */
    private function apply($versionChanges, $data)
    {
        foreach ($versionChanges as $version => $changes) {
            if (!$changes->supports($data)) {
                continue;
            }

            $data = $changes->apply($data);
        }

        return $data;
    }
```

On commence à deviner l'interface qui sera implémentée par les fichiers d'application de changements. Un premier appel à la méthode `supports()` permet de vérifier si les changements de ce fichier doivent être appliqués à cette version.

Dans certains cas (certains endpoints d'API), les données renvoyées ne seront jamais impactées par ces changements. Cette méthode permet de s'assurer que les changements doivent bien être appliqués.

Enfin, `$changes->apply()` joue les changements nécessaires.

### Ajout du service Symfony

Afin que notre listener soit effectif, il ne nous reste plus qu'à déclarer le service dans l'injection de dépendance du framework :

```yaml
acme.event.version_changes_listener:
    class: Acme\Event\Listener\VersionChangesListener
    arguments: ["@request_stack", "@acme.version.changes_factory"]
    tags:
        - { name: kernel.event_listener, event: kernel.response, method: onKernelResponse }
```

Le service `acme.version.changes_factory` est manquant à ce niveau car déclaré dans la prochaine étape.

### Prochaine étape

Entrons dans le coeur du gestionnaire de changements de retrocompatibilité en implémentant le service `ChangesFactory` qui nous permet d'instancier les classes de changements.
