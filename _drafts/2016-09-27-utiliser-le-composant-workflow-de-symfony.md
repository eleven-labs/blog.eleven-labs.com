---
layout: post
title: Utiliser le composant Workflow de Symfony
author: vcomposieux
date: '2016-09-27 11:05:28 +0200'
date_gmt: '2016-09-27 09:05:28 +0200'
categories:
- Non classé
- Symfony
- Php
tags:
- symfony
- workflow
---

Depuis Symfony 3.2, un nouveau composant très utile a vu le jour : <a href="http://symfony.com/blog/new-in-symfony-3-2-workflow-component">le composant Workflow</a>.<br />
Celui-ci est en effet très pratique et peut très largement simplifier vos développements lorsque vous avez, par exemple, à gérer des workflows de statut dans votre application.

&nbsp;

**Installation**

Dans tous les cas, vous devez installer la dépendance suivante :

<pre class="lang:js decode:true">
{% raw %}
"symfony/workflow": "~3.2@dev"{% endraw %}
</pre>

Si vous utilisez une version antérieure de Symfony mais &gt;=2.3, c'est aussi possible mais il vous faudra également installer ce bundle non-officiel qui embarque le composant et ajoute la configuration nécessaire sous le namespace du bundle :

<pre class="lang:js decode:true">
{% raw %}
"fduch/workflow-bundle": "~0.2@dev"{% endraw %}
</pre>

Pensez bien à activer le bundle dans votre kernel.

&nbsp;

**Configuration**

Il va maintenant nous falloir définir la configuration de notre workflow et ainsi définir les statuts (appelés places) et transitions possibles.

Pour cet article, nous sommes partis sur un exemple basé sur les statuts d'une pull request. Celle-ci peut avoir les états suivants : <span class="lang:default decode:true crayon-inline ">opened</span> , <span class="lang:default decode:true crayon-inline ">closed</span> , <span class="lang:default decode:true crayon-inline ">needs_review</span> , <span class="lang:default decode:true crayon-inline ">reviewed</span>  et enfin <span class="lang:default decode:true crayon-inline ">merged</span> .

Cependant, elle ne pourra, par exemple, pas être passée en <span class="lang:default decode:true crayon-inline ">merged</span>  sans être passée par le statut <span class="lang:default decode:true crayon-inline ">reviewed</span> . C'est ici que le composant Workflow prend tout son sens.

&nbsp;

Voici ce que donne notre configuration complète :

<pre class="lang:yaml decode:true">
{% raw %}
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
                    to:   closed{% endraw %}
</pre>

Nous spécifions ici que nous souhaitons utiliser un workflow de type <span class="lang:default decode:true  crayon-inline ">multiple_state</span> . Notez que si vous souhaitez utiliser une transition simple d'un statut vers un autre, vous pouvez utiliser ici <span class="lang:default decode:true  crayon-inline">single_state</span>.

Nous disposons donc également d'une classe <span class="lang:default decode:true crayon-inline ">AppBundle\Entity\PullRequest</span>  qui dispose d'une propriété <span class="lang:default decode:true crayon-inline ">state</span>  ainsi que son setter et getter associé (le composant va utiliser les méthodes getter et setter pour changer l'état et/ou obtenir l'état courant) :

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

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
}{% endraw %}
</pre>

&nbsp;

Nous avons terminé, nous pouvons maintenant commencer à utiliser le composant Workflow !

&nbsp;

**Utilisation**

La première chose utile à effectuer après avoir écrit votre workflow est de générer une représentation graphique de celui-ci (sous un format <a href="http://www.graphviz.org/">Graphviz</a>).

Pour se faire, nous utilisons la commande Symfony :

<pre class="lang:sh decode:true">
{% raw %}
$ bin/console workflow:dump pull_request{% endraw %}
</pre>

&nbsp;

Celle-ci va vous générer un code Graphviz qui donne le schéma suivant :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/09/Capture-d’écran-2016-09-26-à-20.50.44.png"><img class="size-full wp-image-2283 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/09/Capture-d’écran-2016-09-26-à-20.50.44.png" alt="Workflow - Graphviz" width="879" height="224" /></a>

Celui-ci permet vraiment de donner une vision claire de son workflow, à tous les niveaux (développeurs, product owners, clients, ...).

Le composant Workflow implémente des méthodes permettant d'effectuer une transition, vérifier si une transition peut être effectuée avec l'état actuel et lister les transitions possibles avec l'état actuel.

&nbsp;

Pour vérifier si vous pouvez effectuer une transition et l'appliquer, rien de plus simple :

<pre class="lang:php decode:true ">
{% raw %}
&lt;?php

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
}{% endraw %}
</pre>

Si vous ne passez pas par la méthode <span class="lang:default decode:true crayon-inline ">can()</span> , la méthode <span class="lang:default decode:true crayon-inline">apply()</span>  renverra une exception si la transition ne peut pas être effectuée. Vous pouvez donc également catcher cette exception de type <span class="lang:default decode:true crayon-inline">Symfony\Component\Workflow\Exception\LogicException</span> .

&nbsp;

Pour lister les transitions disponibles :

<pre class="lang:php decode:true">
{% raw %}
$workflow-&gt;getEnabledTransitions($pullRequest);{% endraw %}
</pre>

Globalement, l'utilisation du composant se limite à ces 3 méthodes. Comme vous le remarquez, il devient très simple d'utiliser un workflow, même complexe !

&nbsp;

**Branchez-vous sur les événements !**

Le composant utilise également plusieurs événements, à savoir, dans l'ordre chronologique :

<ul>
<li><span class="lang:default decode:true crayon-inline ">workflow.leave</span>  : lorsque notre pull request va se voir dépourvue de son dernier statut,</li>
<li><span class="lang:default decode:true crayon-inline ">workflow.transition</span>  : lorsque la transition vers le nouvel état est lancée,</li>
<li><span class="lang:default decode:true crayon-inline ">workflow.enter</span>  : lorsque le nouvel état est défini sur notre pull request,</li>
<li><span class="lang:default decode:true crayon-inline ">workflow.guard</span>  : pour vous éviter de rendre la transition possible, vous pouvez utiliser cet événement pour définir votre événement bloqué : <span class="lang:default decode:true crayon-inline">$event-&gt;setBlocked(true);</span></li>
</ul>
Enfin, sachez que ces événements existent aussi en version unique pour chaque workflow afin de vous permettre de vous brancher dessus uniquement sur certains workflows. Il vous faut alors utiliser le nom <span class="lang:default decode:true crayon-inline">workflow.pull_request.enter</span>.

Faisons encore mieux, vous pouvez même vous brancher sur une transition particulière :

<ul>
<li><span class="lang:default decode:true crayon-inline ">workflow.pull_request.enter.needs_review</span>  : permet de se brancher uniquement lorsque nous définissons un nouvel état <span class="lang:default decode:true crayon-inline ">needs_review</span>  à notre pull request, nous pourrons alors envoyer un email à l'auteur pour qu'il corrige certaines choses,</li>
<li><span class="lang:default decode:true crayon-inline ">workflow.pull_request.transition.merge</span>  : interviendra lorsque la transition de merge prendra effet sur notre pull request.</li>
</ul>
&nbsp;

**Conclusion**

Le composant Workflow est vraiment très utile dans la gestion d'états ou de statuts sur la plupart des projets.

N'hésitez pas à l'utiliser, sa facilité de configuration et d'utilisation vous aidera grandement sur vos projets.

Aussi, il m'a permis de donner un graphique clair sur un workflow complexe à toutes les personnes avec qui je travaillais.


