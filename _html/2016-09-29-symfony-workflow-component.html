---
layout: post
title: Use the Symfony Workflow component
author: vcomposieux
date: '2016-09-29 10:04:20 +0200'
date_gmt: '2016-09-29 08:04:20 +0200'
categories:
- Non classé
tags: []
---
{% raw %}
<p>Since Symfony 3.2, a new useful component was born: the <a href="http://symfony.com/blog/new-in-symfony-3-2-workflow-component">Workflow component</a>.</p>
<p>It is indeed really convenient and can simplify greatly your developments when you have to manage status workflows in your application, that occurs a lot.</p>
<p>&nbsp;</p>
<p><strong>Installation</strong></p>
<p>In all cases, you have to install the following dependency:</p>
<pre class="lang:default decode:true">"symfony/workflow": "~3.2@dev"</pre>
<p>If you use an earlier version of Symfony but &gt;=2.3 you are also able to use this component, but you have to install the following non-official bundle, which loads the component itself and add the required configuration under the bundle's namespace:</p>
<pre class="lang:default decode:true">"fduch/workflow-bundle": "~0.2@dev"</pre>
<p>Do not forget to enable the bundle in your kernel class.</p>
<p>&nbsp;</p>
<p><strong>Configuration</strong></p>
<p>Time has come to write our workflow configuration. We will have to define all our places (statuses / states) and available transitions.</p>
<p>In this blog post, we will take a pull request status example. A pull request can have one of the following status: <span class="lang:default decode:true crayon-inline ">opened</span> , <span class="lang:default decode:true crayon-inline ">closed</span> , <span class="lang:default decode:true crayon-inline ">needs_review</span> , <span class="lang:default decode:true crayon-inline ">reviewed</span>  or <span class="lang:default decode:true crayon-inline">merged</span>.</p>
<p>However, it cannot be, for instance, moved from the <span class="lang:default decode:true crayon-inline">merged</span> status without having the <span class="lang:default decode:true crayon-inline ">reviewed</span>  status before. The workflow component makes sense here.</p>
<p>&nbsp;</p>
<p>Here is our full workflow configuration:</p>
<pre class="lang:yaml decode:true">workflow:
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
                    to:   closed</pre>
<p>Here, we specify we want to use a <span class="lang:default decode:true crayon-inline">multiple_state</span>  workflow. Please not that if you want to use a simple transition from one state to another, you can use a <span class="lang:default decode:true crayon-inline">single_state</span> .</p>
<p>For this example, we also have defined a <span class="lang:default decode:true crayon-inline">AppBundle\Entity\PullRequest</span> class which has a <span class="lang:default decode:true crayon-inline ">state</span>  property and associated setter and getter methods (component will use these methods to manage transitions):</p>
<pre class="lang:php decode:true">&lt;?php

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
        $this-&gt;state = $state;
    }

    public function getState()
    {
        return $this-&gt;state;
    }
}</pre>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>Everything is now ready, we can start to use the Workflow component!</p>
<p>&nbsp;</p>
<p><strong>Usage</strong></p>
<p>First useful thing to do after you have written your workflow configuration is to generate a graph using the Symfony command. The command will generate one graph using the <a href="http://www.graphviz.org/">Graphviz</a> format.</p>
<p>&nbsp;</p>
<p>Here is the Symfony command you have to run:</p>
<pre class="lang:sh decode:true">$ bin/console workflow:dump pull_request</pre>
<p>The generated Graphviz will give you the following diagram:</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/09/Capture-d’écran-2016-09-26-à-20.50.44-1.png"><img class="size-full wp-image-2288 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/09/Capture-d’écran-2016-09-26-à-20.50.44-1.png" alt="Workflow - Graphviz" width="879" height="224" /></a></p>
<p>This one gives you a really clear vision of your workflow and allows everyone at every level (developers, product owners, customers, ...) to understand the business logic.</p>
<p>The Workflow component implements methods that allow you to verify if a transition is applicable and to later apply it depending on the current status and to also list all enabled transitions.</p>
<p>&nbsp;</p>
<p>In order to check if you can apply a specific transition and apply it, simply use the following code:</p>
<pre class="lang:php decode:true">&lt;?php

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
        $pullRequest = $this-&gt;getPullRequestManager()-&gt;find($identifier);

        // Nous obtenons le service "workflow.&lt;nom du workflow&gt;"
        $workflow = $this-&gt;get('workflow.pull_request');

        if ($workflow-&gt;can($pullRequest, 'merge')) {
            $workflow-&gt;apply($pullRequest, 'merge');
        }

        ...
    }
}</pre>
<p>In the case you do not want to use the <span class="lang:default decode:true crayon-inline">can()</span> method, the <span class="lang:default decode:true crayon-inline ">apply()</span> <span id="crayon-57ea364c0a715059785852" class="crayon-syntax crayon-syntax-inline crayon-theme-classic crayon-theme-classic-inline crayon-font-monaco"><span class="crayon-pre crayon-code"><span class="crayon-sy"> one</span></span></span> will throw an exception if the transition cannot be effectively done, so you will be able to catch exceptions on the <span class="lang:default decode:true crayon-inline ">Symfony\Component\Workflow\Exception\LogicException</span> type.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>To list all enabled transitions:</p>
<pre class="lang:php decode:true">$workflow-&gt;getEnabledTransitions($pullRequest);</pre>
<p>Overall, the component usage is just as simple as these 3 methods. As you can see, complex workflows are now easier to manage!</p>
<p>&nbsp;</p>
<p><strong>Tune in for events!</strong></p>
<p>The component also dispatches multiple events, chronologically sorted as:</p>
<ul>
<li><span class="lang:default decode:true crayon-inline">workflow.leave</span>: when our pull request will leave its current state,</li>
<li><span class="lang:default decode:true crayon-inline">workflow.transition</span>: when the transition to the new state is launched,</li>
<li><span class="lang:default decode:true crayon-inline">workflow.enter</span>: when the new state is just defined on our pull request,</li>
<li><span class="lang:default decode:true crayon-inline">workflow.guard</span>: this one allows you to prevent the asked transition from occurring, you can do that by calling the following method: <span class="lang:default decode:true crayon-inline">$event-&gt;setBlocked(true);</span></li>
</ul>
<p>&nbsp;</p>
<p>Finally, you have to know that these events also exist in a unique way for each workflow in order to allow you to tune in your workflow events only.<br />
If you want to do that, you have to listen to the following name: <span class="lang:default decode:true crayon-inline ">workflow.pull_request.enter</span> .</p>
<p>&nbsp;</p>
<p>Let's do better than that: you are also able to listen to a specific transition or a state for a specific workflow:</p>
<ul>
<li><span class="lang:default decode:true crayon-inline">workflow.pull_request.enter.needs_review</span>: is only dispatched when a <span class="lang:default decode:true crayon-inline">needs_review</span> state is defined on our pull request. We could for instance send an email to the author with the changes the reviewer has suggested,</li>
<li><span class="lang:default decode:true crayon-inline">workflow.pull_request.transition.merge</span>: will occur when the merge transition will be dispatched on our pull request.</li>
</ul>
<p>&nbsp;</p>
<p><strong>Conclusion</strong></p>
<p>The Workflow component is a really useful component to manage state or status on most of web applications.</p>
<p>Do not hesitate to use it because its simplicity of configuration and use will probably help you a lot on your projects.</p>
<p>Also, this component helps me a lot to give people I was working with a clear vision on a complex workflow we have to manage. The graph generation allows to clarify all of that for everyone!</p>
{% endraw %}
