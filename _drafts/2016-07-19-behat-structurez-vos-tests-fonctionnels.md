---
layout: post
title: 'Behat : structurez vos tests fonctionnels'
author: vcomposieux
date: '2016-07-19 10:16:11 +0200'
date_gmt: '2016-07-19 08:16:11 +0200'
categories:
- Symfony
- Php
tags: []
---

**Introduction**

Il est important de mettre en place des tests fonctionnels sur les projets afin de s'assurer du bon fonctionnement de l'application.<br />
Lorsqu'il s'agit d'une application Symfony, Behat est l'outil le plus souvent utilisé pour réaliser ces tests et c'est tant mieux car cet outil est très complet.<br />
Il faut néanmoins savoir l'utiliser à bon escient afin de couvrir des cas de tests utiles et complets, c'est ce que nous allons voir dans cet article.

&nbsp;

**Tests fonctionnels : qu'est-ce ?**

Lorsque nous parlons de "tests fonctionnels", nous entendons bien souvent vouloir tester l'interface de l'application (site web), autrement dit, automatiser des tests qui pourraient être faits par un humain.

Or, il est important d'écrire les cas de tests suivants afin de couvrir le périmètre fonctionnel :

<ul>
<li>Les **tests d'interface** : il s'agit de réaliser des contrôles d'interface pour s'assurer que le comportement de l'application web réagit correctement,</li>
<li>Les **tests d'intégration** : il s'agit de s'assurer que le code (testé unitairement) qui fait tourner l'application réagit bien comme il le devrait lorsque tous les éléments sont assemblés.</li>
</ul>
Il conviendra alors de lancer à la fois les tests d'intégration et les tests d'interface avec Behat.

Avant de commencer, notez que dans cet exemple, nous allons utiliser un serveur **Selenium** qui recevra les informations fournies par **Mink** (extension de Behat) et qui pilotera ensuite notre navigateur (Chrome, dans notre configuration).

Pour être clair sur l'architecture, voici un schéma qui résume le rôle de chacun :

[caption id="attachment_1986" align="alignnone" width="781"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/07/behat.jpg"><img class="wp-image-1986 size-full" src="http://blog.eleven-labs.com/wp-content/uploads/2016/07/behat.jpg" alt="Schéma d'architecture Behat/Selenium" width="781" height="251" /></a> Schéma d'architecture Behat/Selenium[/caption]

&nbsp;

**Mise en place de Behat**

La première étape est d'installer Behat et ses extensions en tant que dépendance dans notre fichier **composer.json** :

<pre class="theme:github lang:js decode:true ">
{% raw %}
"require-dev": {
    "behat/behat": "~3.1",
    "behat/symfony2-extension": "~2.1",
    "behat/mink": "~1.7",
    "behat/mink-extension": "~2.2",
    "behat/mink-selenium2-driver": "~1.3",
    "emuse/behat-html-formatter": "dev-master"
}{% endraw %}
</pre>

Afin que vos futurs contextes soient autoloadés, nous allons également ajouter la section **PSR-4** suivante :

<pre class="theme:github lang:js decode:true ">
{% raw %}
"autoload-dev": {
    "psr-4": {
        "Acme\Tests\Behat\Context\": "features/context/"
    }
}{% endraw %}
</pre>

Maintenant, créons le fichier de configuration **behat.yml** à la racine de notre projet afin d'architecturer nos tests.

Voici le fichier de configuration à partir duquel nous allons débuter :

<pre class="theme:github lang:yaml decode:true">
{% raw %}
default:
    suites: ~
    extensions:
        Behat\Symfony2Extension: ~
        Behat\MinkExtension:
            base_url: "http://acme.tld/"
            selenium2:
                browser: chrome
                wd_host: 'http://selenium-host:4444/wd/hub'
            default_session: selenium2
        emuse\BehatHTMLFormatter\BehatHTMLFormatterExtension:
            name: html
            renderer: Twig,Behat2
            file_name: index
            print_args: true
            print_outp: true
            loop_break: true
    formatters:
        pretty: ~
        html:
            output_path: %paths.base%/web/reports/behat{% endraw %}
</pre>

Si nous prenons les sections dans leur ordre, nous avons avant tout une section <em>suites</em> pour le moment vide mais que nous allons alimenter par la suite de cet article.

Ensuite, nous chargeons ici plusieurs extensions de Behat :

<ul>
<li>L'extension **Behat\Symfony2Extension** permettant notamment d'injecter des services Symfony dans nos classes contextes de test,</li>
<li>L'extension **Behat\MinkExtension** qui va nous permettre de piloter notre Selenium (qui pilotera lui-même notre navigateur Chrome), nous lui fournissons donc les informations nécessaires tels que le host et port du serveur Selenium ainsi que la base de l'URL à contacter,</li>
<li>L'extension **emuse\BehatHTMLFormatter\BehatHTMLFormatterExtension** qui nous permettra de générer un rapport HTML lors du lancement des tests (toujours sympa à présenter au client).</li>
</ul>
Notons enfin que dans la section **formatters**, nous conservons le formatter **pretty** afin d'avoir une sortie sympa sur notre terminal et que les rapports HTML seront quant à eux générés dans le répertoire **web/reports/behat** afin qu'ils soient accessibles en HTTP (à priori pas de soucis car vous ne devriez pas jouer ces tests en production, attention à la restriction d'accès si c'est le cas).

Maintenant que Behat est prêt et configuré, nous allons préparer nos tests fonctionnels que nous allons découper en deux "suites" Behat distinctes : **integration** et **interface**.

&nbsp;

**Ecriture des tests fonctionnels (features)**

Nous allons partir sur des tests permettant de s'assurer du bon fonctionnement d'une page d'inscription.

Nous devons avant tout écrire nos scénarios de tests fonctionnels (fichier **.feature**) que nous allons placer dans un répertoire **features/** à la racine du projet.

Nous allons donc avoir, par exemple, le scénario suivant :

<span style="text-decoration: underline;">Fichier</span><em> </em>: **features/registration/register.feature** :

<pre class="theme:github lang:default decode:true">
{% raw %}
Feature: Register
    In order to create an account
    As a user
    I want to be able to register on the application

Scenario: I register when I fill my username and password only
    Given I am on the registration page
        And I register with username "johndoe" and password "azerty123"
    When I submit the form
    Then I should see the registration confirmation{% endraw %}
</pre>

&nbsp;

**Tests d'intégration**

Il va maintenant convenir d'implémenter le code qui va nous permettre de tester que le code écrit pour l'inscription d'un utilisateur peut être exécuté et enchaîné sans erreur.

Nous allons donc créer un contexte d'intégration propre à l'inscription sous le répertoire **features/context/registration** :

<span style="text-decoration: underline;">Fichier</span> : **features/context/registration/IntegrationRegisterContext** :

<pre class="theme:github lang:php decode:true ">
{% raw %}
&lt;?php

namespace Acme\Tests\Behat\Context\Registration;

use Acme\AppBundle\Entity\User;
use Acme\AppBundle\Registration\Registerer;
use Behat\Behat\Context\Context;

/**
 * Integration register context.
 */
class IntegrationRegisterContext implements Context
{
    /**
     * Registerer
     */
    protected $registerer;

    /**
     * User
     */
    protected $user;

    /**
     * boolean
     */
    protected $response;

    /**
     * Constructor.
     *
     * @param Registerer $registerer
     */
    public function __construct(Registerer $registerer)
    {
        $this-&gt;registerer = $registerer;
    }

    /**
     * @Given I am on the registration page
     */
    public function iAmOnTheRegistrationPage()
    {
        $this-&gt;user = new User();
    }

    /**
     * @Given /I register with username "(?P&lt;username&gt;[^"]*)" and password "(?P&lt;password&gt;[^"]*)"/
     */
    public function iRegisterWithUsernameAndPassword($username, $password)
    {
        $this-&gt;user-&gt;setUsername($username);
        $this-&gt;user-&gt;setPassword($password);
    }

    /**
     * @When I submit the form
     */
    public function iSubmitTheForm()
    {
        $this-&gt;response = $this-&gt;registerer-&gt;register($this-&gt;user);
    }

    /**
     * @Then I should see the registration confirmation message
     */
    public function iShouldSeeTheRegistrationConfirmation()
    {
        if (!$this-&gt;response) {
            throw new \RuntimeException('User is not registered.');
        }
    }
}{% endraw %}
</pre>

L'implémentation du test d'intégration est terminé pour cette feature !<br />
Passons maintenant au test d'interface !

&nbsp;

**Tests d'interface**

Ce test va se baser sur la même feature et nous n'avons absolument rien modifié dans le test précédemment écrit. C'est pourquoi il est important de bien rédiger ses tests fonctionnels afin qu'ils restent assez génériques pour être implémentés à la fois en test d'intégration et en test d'interface.

Créons donc le contexte qui sera utilisé pour le test d'interface (préfixé par Mink dans notre cas, mais vous pouvez préfixer par ce que vous voulez) sous le même répertoire **features/context/registration** :

<span style="text-decoration: underline;">Fichier</span> : **features/context/registration/MinkRegisterContext** :

<pre class="theme:github lang:php decode:true ">
{% raw %}
&lt;?php

namespace Acme\Tests\Behat\Context\Registration;

use Acme\AppBundle\Entity\User;
use Acme\AppBundle\Registration\Registerer;
use Behat\Behat\Context\Context;
use Behat\MinkExtension\Context\MinkContext;

/**
 * Mink register context.
 */
class MinkRegisterContext extends MinkContext
{
    /**
     * @Given I am on the registration page
     */
    public function iAmOnTheRegistrationPage()
    {
        $this-&gt;visit('/register');
    }

    /**
     * @Given /I register with username "(?P&lt;username&gt;[^"]*)" and password "(?P&lt;password&gt;[^"]*)"/
     */
    public function iRegisterWithUsernameAndPassword($username, $password)
    {
        $this-&gt;fillField('registration[username]', $username);
        $this-&gt;fillField('registration[password]', $password);
    }

    /**
     * @When I submit the form
     */
    public function iSubmitTheForm()
    {
        $this-&gt;pressButton('Register');
    }

    /**
     * @Then I should see the registration confirmation message
     */
    public function iShouldSeeTheRegistrationConfirmation()
    {
        $this-&gt;assertPageContainsText('Congratulations, you are now registered!');
    }
}{% endraw %}
</pre>

Nous venons d'implémenter un test d'interface basé sur le même scénario que celui que nous avons utilisé pour notre test d'intégration, reprenant exactement les quatre méthodes implémentées précédemment avec les mêmes annotations Behat.

La seule différence est que dans ce contexte, Mink va demander à Selenium d'effectuer les actions au niveau de l'interface de notre application en pilotant un navigateur au lieu de tester le code lui-même.

&nbsp;

**Définitions des contextes**

Il ne nous reste plus qu'à ajouter les contextes créés précédemment sous notre section **suites** dans le fichier de configuration **behat.yml** :

<pre class="theme:github lang:default decode:true ">
{% raw %}
    suites:
        integration:
            paths:
                - %paths.base%/features/registration
            contexts:
                - Acme\Tests\Behat\Context\Registration\IntegrationRegisterContext:
                    - "@acme.registration.registerer"
        interface:
            paths:
                - %paths.base%/features/registration
            contexts:
                - Behat\MinkExtension\Context\MinkContext: []
                - Acme\Tests\Behat\Context\Registration\MinkRegisterContext: []{% endraw %}
</pre>

Il est important de voir ici que nous découpons clairement les tests en deux suites distinctes : **integration** et **interface** : chacune d'entre elles sera exécutée avec les contextes qui lui sont propres.

Etant donné que nous avons chargés l'extension Symfony2 lors de la mise en place de Behat, nous avons la possibilité d'injecter des services Symfony dans nos contextes, c'est le cas ici avec le service **acme.registration.registerer**.

&nbsp;

**Exécution des tests**

Pour lancer tous les tests, exécutez simplement, à la racine du projet : **bin/behat -c behat.yml**.

Pour lancer uniquement la suite d'integration, par exemple : **bin/behat -c behat.yml --suite=integration**.

Le rapport HTML est quand à lui généré dans **web/reports/behat/**, comme spécifié dans notre configuration, ce qui vous permettra d'avoir un aperçu rapide des tests qui échouent, plutôt pratique lorsque vous avez de nombreux tests.

&nbsp;

**Lier plusieurs contextes entre eux**

Pour terminer, vous pourrez parfois avoir besoin de lier les contextes entre eux. Par exemple, imaginons que vous ayez une deuxième page sur votre formulaire d'inscription pour renseigner les informations personnelles, vous allez alors créer deux nouveaux contextes **IntegrationProfileContext** et **MinkProfileContext**.<br />
Partons sur le contexte d'intégration pour simplifier l'explication, l'idée est de ne pas dupliquer le code précédemment créé et permettant de tester la première étape **IntegrationRegisterContext** et de réutiliser ces informations dans le nouveau contexte **IntegrationProfileContext**.

Ceci est possible grâce à l'annotation **@BeforeScenario** de Behat.

<span style="text-decoration: underline;">Fichier</span> : **features/context/registration/IntegrationProfileContext** :

<pre class="theme:github lang:php decode:true">
{% raw %}
&lt;?php

namespace Acme\Tests\Behat\Context\Registration;

use Behat\Behat\Context\Context;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;

/**
 * Integration registration profile  context.
 */
class IntegrationProfileContext implements Context
{
    /**
     * IntegrationRegisterContext
     */
    protected $registerContext;

    /**
     * @BeforeScenario
     */
    public function gatherContexts(BeforeScenarioScope $scope)
    {
        $environment = $scope-&gt;getEnvironment();

        $this-&gt;registerContext = $environment-&gt;getContext(
            'Acme\Tests\Behat\Context\Registration\IntegrationRegisterContext'
        );
    }
}{% endraw %}
</pre>

Vous avez maintenant à disposition une propriété **$registerContext** et pouvez accéder à des informations qui proviennent du contexte précédent.

&nbsp;

**Conclusion**

Tout part de l'écriture des tests fonctionnels qui doivent être bien réfléchis pour ensuite permettre une implémentation technique à la fois en test d'intégration mais aussi en test d'interface.<br />
La structure choisie pour classer ses tests fonctionnels est aussi importante pour pouvoir s'y retrouver rapidement dans les différents scénarios de test lorsque l'application prend de l'ampleur.


