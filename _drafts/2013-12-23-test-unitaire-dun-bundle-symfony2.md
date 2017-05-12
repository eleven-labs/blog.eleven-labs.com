---
layout: post
title: Test unitaire d'un bundle Symfony 2
author: jonathan
date: '2013-12-23 00:00:54 +0100'
date_gmt: '2013-12-22 23:00:54 +0100'
categories:
- Symfony
tags:
- symfony2
- bundle
- test
- phpunit
---
{% raw %}
Une question revient souvent : comment tester unitairement chaque bundle d'un projet Symfony 2?

Il existe Jenkins qui  permet de tester unitairement son projet dans sa globalité.  Néanmoins, si votre projet contient 10 à 20 bundles et que vous en avez seulement modifié un, pourquoi lancer les tests sur l'ensemble du projet et attendre des heures.

<!--more-->

La base d'un bundle est justement d'avoir la possibilité de le rendre totalement indépendant de son environnement. Voici donc un petit exemple pour rendre vos bundles testables unitairement, indépendamment de votre projet.

Prenons un projet symfony 2 standard, vous avez certainement commencé par coder dans le dossier /src ce qui rend votre projet totalement dépendant de votre code, l'idée est de mettre votre projet dans un bundle qui sera appelé dans votre projet. // cf article comment créer un bundle.

Votre bundle est une source indépendante qui peut etre utilisée dans n'importe quel projet et donc tester indépendamment. Nous partirons de la mise en place des tests sur Jenkins, pour avoir un objectif sur ce tuto.

Une fois le bundle créé,  il faut ajouter un dossier /Tests qui contiendra les tests, les fixtures et l'app de test, car oui, il faut une app pour avoir le kernel et les services.

Dans le dossier parent, ajoutez un composer.json avec toutes les dépendances dont vous aurez besoin pour ce bundle seulement, lors d'un 'composer install' cela créera le dossier vendor à la racine du bundle contenant alors toutes les dépendances.

Dans votre dossier /Tests, ajoutez le fichier bootstrap.php contenant alors l'autoload.

<pre class="lang:default decode:true">&lt;?php
// Test/bootstrap.php

use Doctrine\Common\Annotations\AnnotationRegistry;

if (!is_file($loaderFile = __DIR__.'/../vendor/autoload.php') &amp;&amp; !is_file($loaderFile = __DIR__.'/../../../../../../vendor/autoload.php')) {
    throw new \LogicException('Could not find autoload.php in vendor/. Did you run "composer install --dev"?');
}

$loader = require $loaderFile;

AnnotationRegistry::registerLoader(array($loader, 'loadClass'));</pre>
Puis créez un dossier Fixtures dans Tests, contenant le dossier app/ et le dossier web/, votre app devient alors une simple fixture de votre bundle.

Dans app/ gardez la structure classique avec vos configurations dans le dossier config/ vous devez y retrouver vos définitions de services, de configuration de bdd etc .....

Créez alors le fichier AppKernel.php d'initialisation de votre Kernel

<pre class="lang:default decode:true">&lt;?php

// Test/Fixtures/app/AppKernel.php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        return array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new Sensio\Bundle\DistributionBundle\SensioDistributionBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle(),
            new WhiteOctober\PagerfantaBundle\WhiteOctoberPagerfantaBundle(),
            new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle(),
            new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
        );
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader-&gt;load(__DIR__.'/config/config_test.yml');
    }

    /**
     * @return string
     */
    public function getCacheDir()
    {
        $cacheDir = sys_get_temp_dir().'/cache';
        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0777, true);
        }

        return $cacheDir;
    }

    /**
     * @return string
     */
    public function getLogDir()
    {
        $logDir = sys_get_temp_dir().'/logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        return $logDir;
    }
}</pre>
Ainsi que votre fichier console, vous pourrez appeler votre Kernel.

<pre class="lang:default decode:true">#!/usr/bin/env php
&lt;?php

// if you don't want to setup permissions the proper way, just uncomment the following PHP line
// read http://symfony.com/doc/current/book/installation.html#configuration-and-setup for more information
umask(0000);

set_time_limit(0);

require_once __DIR__.'/../../bootstrap.php';
require_once __DIR__.'/AppKernel.php';

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArgvInput;

$input = new ArgvInput();
$env = $input-&gt;getParameterOption(array('--env', '-e'), getenv('SYMFONY_ENV') ?: 'test');
$debug = getenv('SYMFONY_DEBUG') !== '0' &amp;&amp; !$input-&gt;hasParameterOption(array('--no-debug', '')) &amp;&amp; $env !== 'prod';

$kernel = new AppKernel($env, $debug);
$application = new Application($kernel);
$application-&gt;run($input);</pre>
À partir de là, votre bunlde peut fonctionner seul et donc effectuer ses tests indépendamment de votre projet.

Il ne reste plus qu'à faire le fichier phpunit.xml.dist permettant de configurer votre phpunit.

<pre class="lang:default decode:true">// phpunit.xml.dist

&lt;?xml version="1.0" encoding="UTF-8"?&gt;

&lt;phpunit backupGlobals="false"
         backupStaticAttributes="false"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false"
         syntaxCheck="false"
         bootstrap="Tests/bootstrap.php"
&gt;
    &lt;testsuites&gt;
        &lt;testsuite name="PhotoBundle Test Suite"&gt;
            &lt;directory&gt;./Tests/&lt;/directory&gt;
        &lt;/testsuite&gt;
    &lt;/testsuites&gt;

    &lt;php&gt;
        &lt;server name="KERNEL_DIR" value="./Tests/Fixtures/app" /&gt;
    &lt;/php&gt;

    &lt;filter&gt;
        &lt;whitelist&gt;
            &lt;directory&gt;./&lt;/directory&gt;
            &lt;exclude&gt;
                &lt;directory&gt;./Resources&lt;/directory&gt;
                &lt;directory&gt;./Tests&lt;/directory&gt;
                &lt;directory&gt;./vendor&lt;/directory&gt;
                &lt;directory&gt;./DataFixtures&lt;/directory&gt;
            &lt;/exclude&gt;
        &lt;/whitelist&gt;
    &lt;/filter&gt;

    &lt;logging&gt;
        &lt;log type="coverage-html" target="build/coverage" title="Phototheque" charset="UTF-8" yui="true" highlight="true" lowUpperBound="35" highLowerBound="70"/&gt;
        &lt;log type="coverage-clover" target="build/logs/clover.xml"/&gt;
        &lt;log type="junit" target="build/logs/junit.xml" logIncompleteSkipped="false"/&gt;
    &lt;/logging&gt;
&lt;/phpunit&gt;</pre>
&nbsp;

Pour rendre vos tests encore plus propres et plus indépendants, mettez en place un système de rollback des requêtes de test, il suffit pour cela d'étendre le Client de Symfony2 par un client qui isole les requêtes de test. Créez la class Client dans le dossier de test.

<pre class="lang:default decode:true">&lt;?php

/Tests/Client.php

namespace MyBundle\Tests;

use Symfony\Bundle\FrameworkBundle\Client as BaseClient;

class Client extends BaseClient
{
    protected static $connection;
    protected $requested;

    /**
     * @see http://alexandre-salome.fr/blog/Symfony2-Isolation-Of-Tests
     *
     * @param Request $request A Request instance
     *
     * @return Response A Response instance
     */
    protected function doRequest($request)
    {
        if ($this-&gt;requested) {
            $this-&gt;getKernel()-&gt;shutdown();
            $this-&gt;getKernel()-&gt;boot();
        }

        if (null === self::$connection) {
            self::$connection = $this-&gt;getContainer()-&gt;get('doctrine.dbal.default_connection');
        } else {
            $this-&gt;getContainer()-&gt;set('doctrine.dbal.default_connection', self::$connection);
        }

        $this-&gt;requested = true;

        self::$connection-&gt;beginTransaction();

        $response = $this-&gt;getKernel()-&gt;handle($request);

        self::$connection-&gt;rollback();

        return $response;
    }
}</pre>
Terminez par le plus simple : la configuration du build.xml pour Jenkins, voici un exemple mais là, c'est à vous de jouer.

<pre class="lang:default decode:true">/build.xml

&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;project name="Push Server" default="build"&gt;
  &lt;target name="build" depends="prepare,lint,phploc,tools-parallel,phpunit,phpcb"/&gt;
  &lt;target name="tools-parallel" description="Run tools in parallel"&gt;
    &lt;parallel threadCount="2"&gt;
      &lt;sequential&gt;
        &lt;antcall target="pdepend"/&gt;
      &lt;/sequential&gt;
      &lt;antcall target="phpmd-ci"/&gt;
      &lt;antcall target="phpcpd"/&gt;
      &lt;antcall target="phpcs-ci"/&gt;
    &lt;/parallel&gt;
  &lt;/target&gt;

  &lt;target name="clean" description="Cleanup build artifacts"&gt;
    &lt;delete dir="${basedir}/build/code-browser"/&gt;
    &lt;delete dir="${basedir}/build/coverage"/&gt;
    &lt;delete dir="${basedir}/build/logs"/&gt;
    &lt;delete dir="${basedir}/build/pdepend"/&gt;
    &lt;delete dir="${basedir}/Tests/Fixtures/app/config/parameters.yml"/&gt;
    &lt;exec executable="cp"&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/config/parameters.yml.ci"/&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/config/parameters.yml"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="prepare" depends="clean" description="Prepare for build"&gt;
    &lt;mkdir dir="${basedir}/build/code-browser"/&gt;
    &lt;mkdir dir="${basedir}/build/coverage"/&gt;
    &lt;mkdir dir="${basedir}/build/logs"/&gt;
    &lt;mkdir dir="${basedir}/build/pdepend"/&gt;
    &lt;exec executable="composer"&gt;
      &lt;arg value="update"/&gt;
      &lt;arg value="--dev"/&gt;
    &lt;/exec&gt;
    &lt;exec executable="php"&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/console"/&gt;
      &lt;arg value="doctrine:database:drop"/&gt;
      &lt;arg value="--force"/&gt;
    &lt;/exec&gt;
    &lt;exec executable="php"&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/console"/&gt;
      &lt;arg value="doctrine:database:create"/&gt;
    &lt;/exec&gt;
    &lt;exec executable="php"&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/console"/&gt;
      &lt;arg value="doctrine:schema:create"/&gt;
    &lt;/exec&gt;
    &lt;exec executable="php"&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/console"/&gt;
      &lt;arg value="doctrine:fixtures:load"/&gt;
      &lt;arg value="--no-interaction"/&gt;
      &lt;arg value="--purge-with-truncate"/&gt;
    &lt;/exec&gt;
    &lt;exec executable="php"&gt;
      &lt;arg value="${basedir}/Tests/Fixtures/app/console"/&gt;
      &lt;arg value="cache:clear"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="lint" description="Perform syntax check of sourcecode files"&gt;
    &lt;apply executable="php" failonerror="true"&gt;
      &lt;arg value="-l"/&gt;
      &lt;fileset dir="${basedir}"&gt;
        &lt;include name="**/*.php"/&gt;
        &lt;exclude name="**/vendor/**" /&gt;
        &lt;modified/&gt;
      &lt;/fileset&gt;
    &lt;/apply&gt;
  &lt;/target&gt;

  &lt;target name="phploc" description="Measure project size using PHPLOC"&gt;
    &lt;exec executable="phploc"&gt;
      &lt;arg value="--log-csv"/&gt;
      &lt;arg value="${basedir}/build/logs/phploc.csv"/&gt;
      &lt;arg value="--exclude"/&gt;
      &lt;arg value="${basedir}/vendor" /&gt;
      &lt;arg path="${basedir}"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="pdepend" description="Calculate software metrics using PHP_Depend"&gt;
    &lt;exec executable="pdepend"&gt;
      &lt;arg value="--jdepend-xml=${basedir}/build/logs/jdepend.xml"/&gt;
      &lt;arg value="--jdepend-chart=${basedir}/build/pdepend/dependencies.svg"/&gt;
      &lt;arg value="--overview-pyramid=${basedir}/build/pdepend/overview-pyramid.svg"/&gt;
      &lt;arg value="--ignore=${basedir}/vendor/"/&gt;
      &lt;arg path="${basedir}"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="phpmd" description="Perform project mess detection using PHPMD and print human readable output. Intended for usage on the command line before committing."&gt;
    &lt;exec executable="phpmd"&gt;
      &lt;arg path="${basedir}" /&gt;
      &lt;arg value="text" /&gt;
      &lt;arg value="codesize,design,unusedcode" /&gt;
      &lt;arg value="--exclude" /&gt;
      &lt;arg value="${basedir}/vendor" /&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="phpmd-ci" description="Perform project mess detection using PHPMD creating a log file for the continuous integration server"&gt;
    &lt;exec executable="phpmd"&gt;
      &lt;arg path="${basedir}" /&gt;
      &lt;arg value="xml" /&gt;
      &lt;arg value="codesize,design,unusedcode" /&gt;
      &lt;arg value="--reportfile" /&gt;
      &lt;arg value="${basedir}/build/logs/pmd.xml" /&gt;
      &lt;arg value="--exclude" /&gt;
      &lt;arg value="${basedir}/vendor" /&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="phpcs" description="Find coding standard violations using PHP_CodeSniffer and print human readable output. Intended for usage on the command line before committing."&gt;
    &lt;exec executable="phpcs"&gt;
      &lt;arg value="--standard=PSR2"/&gt;
      &lt;arg value="--ignore=${basedir}/vendor" /&gt;
      &lt;arg path="${basedir}"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="phpcs-ci" description="Find coding standard violations using PHP_CodeSniffer creating a log file for the continuous integration server"&gt;
    &lt;exec executable="phpcs" output="/dev/null"&gt;
      &lt;arg value="--report=checkstyle"/&gt;
      &lt;arg value="--report-file=${basedir}/build/logs/checkstyle.xml"/&gt;
      &lt;arg value="--standard=PSR2"/&gt;
      &lt;arg value="--ignore=vendor"/&gt;
      &lt;arg value="--extensions=php"/&gt;
      &lt;arg path="${basedir}"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="phpcpd" description="Find duplicate code using PHPCPD"&gt;
    &lt;exec executable="phpcpd"&gt;
      &lt;arg value="--log-pmd"/&gt;
      &lt;arg value="${basedir}/build/logs/pmd-cpd.xml"/&gt;
      &lt;arg value="--exclude" /&gt;
      &lt;arg value="${basedir}/vendor" /&gt;
      &lt;arg value="--exclude" /&gt;
      &lt;arg value="${basedir}/Tests" /&gt;
      &lt;arg path="${basedir}"/&gt;
    &lt;/exec&gt;
  &lt;/target&gt;

  &lt;target name="phpunit" description="Run unit tests with PHPUnit"&gt;
    &lt;exec executable="phpunit" failonerror="true"/&gt;
  &lt;/target&gt;

  &lt;target name="phpcb" description="Aggregate tool output with PHP_CodeBrowser"&gt;
    &lt;exec executable="phpcb"&gt;
      &lt;arg value="--log" /&gt;
      &lt;arg path="${basedir}/build/logs" /&gt;
      &lt;arg value="--source" /&gt;
      &lt;arg path="${basedir}" /&gt;
      &lt;arg value="--ignore" /&gt;
      &lt;arg path="${basedir}/vendor" /&gt;
      &lt;arg value="--output" /&gt;
      &lt;arg path="${basedir}/build/code-browser" /&gt;
    &lt;/exec&gt;
  &lt;/target&gt;
&lt;/project&gt;</pre>
&nbsp;

Si vous avez des questions laissez moi un commentaire :)

&nbsp;

&nbsp;

&nbsp;

{% endraw %}
