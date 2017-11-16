---
layout: post
title: Use the Symfony Workflow component
lang: en
permalink: /symfony-workflow-component/
authors: 
    - vcomposieux
date: '2016-09-29 10:04:20 +0200'
date_gmt: '2016-09-29 08:04:20 +0200'
categories:
    - Symfony
    - Php
tags:
    - symfony
    - php
    - workflow
---
Since Symfony 3.2, a new useful component was born: the [Workflow component](http://symfony.com/blog/new-in-symfony-3-2-workflow-component){:target="_blank" rel="nofollow noopener noreferrer"}.
It is indeed really convenient and can simplify greatly your developments when you have to manage status workflows in your application, that occurs a lot.

# Installation

In all cases, you have to install the following dependency:

```json
"symfony/workflow": "~3.2@dev"
```

If you use an earlier version of Symfony but >=2.3 you are also able to use this component, but you have to install the following non-official bundle, which loads the component itself and add the required configuration under the bundle's namespace:

```json
"fduch/workflow-bundle": "~0.2@dev"
```

Do not forget to enable the bundle in your kernel class.

# Configuration

Time has come to write our workflow configuration. We will have to define all our places (statuses / states) and available transitions.
In this blog post, we will take a pull request status example. A pull request can have one of the following status: `opened` , `closed` , `needs_review` , `reviewed`  or `merged`.
However, it cannot be, for instance, moved from the `merged` status without having the `reviewed`  status before. The workflow component makes sense here.

Here is our full workflow configuration:
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

Here, we specify we want to use a `multiple_state`  workflow. Please not that if you want to use a simple transition from one state to another, you can use a `single_state`.
For this example, we also have defined a `AppBundle\Entity\PullRequest` class which has a `state`  property and associated setter and getter methods (component will use these methods to manage transitions):

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


Everything is now ready, we can start to use the Workflow component!

# Usage

First useful thing to do after you have written your workflow configuration is to generate a graph using the Symfony command. The command will generate one graph using the [Graphviz](http://www.graphviz.org){:target="_blank" rel="nofollow noopener noreferrer"} format.

Here is the Symfony command you have to run:

```bash
$ bin/console workflow:dump pull_request
```

The generated Graphviz will give you the following diagram:

![Workflow Graphviz](/assets/2016-09-29-symfony-workflow-component/workflow.png)

This one gives you a really clear vision of your workflow and allows everyone at every level (developers, product owners, customers, ...) to understand the business logic.
The Workflow component implements methods that allow you to verify if a transition is applicable and to later apply it depending on the current status and to also list all enabled transitions.

In order to check if you can apply a specific transition and apply it, simply use the following code:

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

In the case you do not want to use the `can()` method, the `apply()` ``` one``` will throw an exception if the transition cannot be effectively done, so you will be able to catch exceptions on the `Symfony\Component\Workflow\Exception\LogicException` type.


To list all enabled transitions:

```php
$workflow->getEnabledTransitions($pullRequest);
```

Overall, the component usage is just as simple as these 3 methods. As you can see, complex workflows are now easier to manage!

# Tune in for events!

The component also dispatches multiple events, chronologically sorted as:

* `workflow.leave`: when our pull request will leave its current state,
* `workflow.transition`: when the transition to the new state is launched,
* `workflow.enter`: when the new state is just defined on our pull request,
* `workflow.guard`: this one allows you to prevent the asked transition from occurring, you can do that by calling the following method: `$event->setBlocked(true);`

Finally, you have to know that these events also exist in a unique way for each workflow in order to allow you to tune in your workflow events only.
If you want to do that, you have to listen to the following name: `workflow.pull_request.enter`.

Let's do better than that: you are also able to listen to a specific transition or a state for a specific workflow:

* `workflow.pull_request.enter.needs_review`: is only dispatched when a `needs_review` state is defined on our pull request. We could for instance send an email to the author with the changes the reviewer has suggested,
* `workflow.pull_request.transition.merge`: will occur when the merge transition will be dispatched on our pull request.

# Conclusion

The Workflow component is a really useful component to manage state or status on most of web applications.
Do not hesitate to use it because its simplicity of configuration and use will probably help you a lot on your projects.
Also, this component helps me a lot to give people I was working with a clear vision on a complex workflow we have to manage. The graph generation allows to clarify all of that for everyone!
