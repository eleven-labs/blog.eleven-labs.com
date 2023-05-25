---
lang: fr
date: '2016-09-27'
slug: utiliser-le-composant-workflow-de-symfony
title: Utiliser le composant Workflow de Symfony
excerpt: >-
  Depuis Symfony 3.2, un nouveau composant très utile a vu le jour : [le
  composant
  Workflow](http://symfony.com/blog/new-in-symfony-3-2-workflow-component).
authors:
  - vcomposieux
categories:
  - php
keywords:
  - symfony
  - workflow
---
Depuis Symfony 3.2, un nouveau composant très utile a vu le jour : [le composant Workflow](http://symfony.com/blog/new-in-symfony-3-2-workflow-component).
Celui-ci est en effet très pratique et peut très largement simplifier vos développements lorsque vous avez, par exemple, à gérer des workflows de statut dans votre application.

# Installation

Dans tous les cas, vous devez installer la dépendance suivante :

```json
"symfony/workflow": "~3.2@dev"
```

Si vous utilisez une version antérieure de Symfony mais >=2.3, c'est aussi possible mais il vous faudra également installer ce bundle non-officiel qui embarque le composant et ajoute la configuration nécessaire sous le namespace du bundle :

```json
"fduch/workflow-bundle": "~0.2@dev"
```

Pensez bien à activer le bundle dans votre kernel.

# Configuration

Il va maintenant nous falloir définir la configuration de notre workflow et ainsi définir les statuts (appelés places) et transitions possibles.
Pour cet article, nous sommes partis sur un exemple basé sur les statuts d'une pull request. Celle-ci peut avoir les états suivants : `opened` , `closed` , `needs_review` , `reviewed`  et enfin `merged`.

Cependant, elle ne pourra, par exemple, pas être passée en `merged`  sans être passée par le statut `reviewed` . C'est ici que le composant Workflow prend tout son sens.

Voici ce que donne notre configuration complète :
```yaml
workflow:
    workflows:
        pull_request:
            marking_store:
                type: multiple_state
                arguments:
                    - state
            supports:
                - AppBundle\Entity\PullRequest
            places:
                - opened
                - closed
                - needs_review
                - reviewed
                - merged
            transitions:
                feedback:
                    from: opened
                    to:   needs_review
                review:
                    from: [opened, needs_review]
                    to:   reviewed
                merge:
                    from: reviewed
                    to:   merged
                close:
                    from: [opened, needs_review, reviewed]
                    to:   closed
```

Nous spécifions ici que nous souhaitons utiliser un workflow de type `multiple_state` . Notez que si vous souhaitez utiliser une transition simple d'un statut vers un autre, vous pouvez utiliser ici `single_state`.
Nous disposons donc également d'une classe `AppBundle\Entity\PullRequest`  qui dispose d'une propriété `state`  ainsi que son setter et getter associé (le composant va utiliser les méthodes getter et setter pour changer l'état et/ou obtenir l'état courant) :

```php
<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="pull_request")
 */
class PullRequest
{
    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    protected $state;

    public function setState($state)
    {
        $this->state = $state;
    }

    public function getState()
    {
        return $this->state;
    }
}
```

Nous avons terminé, nous pouvons maintenant commencer à utiliser le composant Workflow !

# Utilisation

La première chose utile à effectuer après avoir écrit votre workflow est de générer une représentation graphique de celui-ci (sous un format [Graphviz](http://www.graphviz.org)).

Pour ce faire, nous utilisons la commande Symfony :

```bash
$ bin/console workflow:dump pull_request
```

Celle-ci va vous générer un code Graphviz qui donne le schéma suivant :

![Workflow Graphviz](/_assets/posts/2016-09-29-symfony-workflow-component/workflow.png)

Celui-ci permet vraiment de donner une vision claire de son workflow, à tous les niveaux (développeurs, product owners, clients, ...).
Le composant Workflow implémente des méthodes permettant d'effectuer une transition, vérifier si une transition peut être effectuée avec l'état actuel et lister les transitions possibles avec l'état actuel.

Pour vérifier si vous pouvez effectuer une transition et l'appliquer, rien de plus simple :

```php
<?php

namespace AppBundle\Controller;

use AppBundle\Manager\PullRequestManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;

class PullRequestController extends Controller
{
    /**
     * @param int $identifier A pull request identifier.
     *
     * @return RedirectResponse
     */
    public function update($identifier)
    {
        ...

        // Notre pull request est au statut "reviewed"
        $pullRequest = $this->getPullRequestManager()->find($identifier);

        // Nous obtenons le service "workflow.<nom du workflow>"
        $workflow = $this->get('workflow.pull_request');

        if ($workflow->can($pullRequest, 'merge')) {
            $workflow->apply($pullRequest, 'merge');
        }

        ...
    }
}
```

Si vous ne passez pas par la méthode `can()` , la méthode `apply()`  renverra une exception si la transition ne peut pas être effectuée. Vous pouvez donc également catcher cette exception de type `Symfony\Component\Workflow\Exception\LogicException`.

Pour lister les transitions disponibles :

```php
$workflow->getEnabledTransitions($pullRequest);
```

Globalement, l'utilisation du composant se limite à ces 3 méthodes. Comme vous le remarquez, il devient très simple d'utiliser un workflow, même complexe !

# Branchez-vous sur les événements !

Le composant utilise également plusieurs événements, à savoir, dans l'ordre chronologique :

* `workflow.leave`  : lorsque notre pull request va se voir dépourvue de son dernier statut,
* `workflow.transition`  : lorsque la transition vers le nouvel état est lancée,
* `workflow.enter`  : lorsque le nouvel état est défini sur notre pull request,
* `workflow.guard`  : pour vous éviter de rendre la transition possible, vous pouvez utiliser cet événement pour définir votre événement bloqué : `$event->setBlocked(true);`

Enfin, sachez que ces événements existent aussi en version unique pour chaque workflow afin de vous permettre de vous brancher dessus uniquement sur certains workflows. Il vous faut alors utiliser le nom `workflow.pull_request.enter`.

Faisons encore mieux, vous pouvez même vous brancher sur une transition particulière :

* `workflow.pull_request.enter.needs_review`  : permet de se brancher uniquement lorsque nous définissons un nouvel état `needs_review`  à notre pull request, nous pourrons alors envoyer un email à l'auteur pour qu'il corrige certaines choses,
* `workflow.pull_request.transition.merge`  : interviendra lorsque la transition de merge prendra effet sur notre pull request.

# Conclusion

Le composant Workflow est vraiment très utile dans la gestion d'états ou de statuts sur la plupart des projets.

N'hésitez pas à l'utiliser, sa facilité de configuration et d'utilisation vous aidera grandement sur vos projets.
Aussi, il m'a permis de donner un graphique clair sur un workflow complexe à toutes les personnes avec qui je travaillais.
