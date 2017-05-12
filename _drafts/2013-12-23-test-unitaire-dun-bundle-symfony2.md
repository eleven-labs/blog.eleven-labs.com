--- layout: post title: Test unitaire d'un bundle Symfony 2 author:
jonathan date: '2013-12-23 00:00:54 +0100' date\_gmt: '2013-12-22
23:00:54 +0100' categories: - Symfony tags: - symfony2 - bundle - test -
phpunit --- {% raw %}

Une question revient souvent : comment tester unitairement chaque bundle
d'un projet Symfony 2?

Il existe Jenkins qui  permet de tester unitairement son projet dans sa
globalité.  Néanmoins, si votre projet contient 10 à 20 bundles et que
vous en avez seulement modifié un, pourquoi lancer les tests sur
l'ensemble du projet et attendre des heures.

La base d'un bundle est justement d'avoir la possibilité de le rendre
totalement indépendant de son environnement. Voici donc un petit exemple
pour rendre vos bundles testables unitairement, indépendamment de votre
projet.

Prenons un projet symfony 2 standard, vous avez certainement commencé
par coder dans le dossier /src ce qui rend votre projet totalement
dépendant de votre code, l'idée est de mettre votre projet dans un
bundle qui sera appelé dans votre projet. // cf article comment créer un
bundle.

Votre bundle est une source indépendante qui peut etre utilisée dans
n'importe quel projet et donc tester indépendamment. Nous partirons de
la mise en place des tests sur Jenkins, pour avoir un objectif sur ce
tuto.

Une fois le bundle créé,  il faut ajouter un dossier /Tests qui
contiendra les tests, les fixtures et l'app de test, car oui, il faut
une app pour avoir le kernel et les services.

Dans le dossier parent, ajoutez un composer.json avec toutes les
dépendances dont vous aurez besoin pour ce bundle seulement, lors d'un
'composer install' cela créera le dossier vendor à la racine du bundle
contenant alors toutes les dépendances.

Dans votre dossier /Tests, ajoutez le fichier bootstrap.php contenant
alors l'autoload.

``` {.lang:default .decode:true}
<?php
// Test/bootstrap.php

use Doctrine\Common\Annotations\AnnotationRegistry;

if (!is_file($loaderFile = __DIR__.'/../vendor/autoload.php') && !is_file($loaderFile = __DIR__.'/../../../../../../vendor/autoload.php')) {
    throw new \LogicException('Could not find autoload.php in vendor/. Did you run "composer install --dev"?');
}

$loader = require $loaderFile;

AnnotationRegistry::registerLoader(array($loader, 'loadClass'));
```

Puis créez un dossier Fixtures dans Tests, contenant le dossier app/ et
le dossier web/, votre app devient alors une simple fixture de votre
bundle.

Dans app/ gardez la structure classique avec vos configurations dans le
dossier config/ vous devez y retrouver vos définitions de services, de
configuration de bdd etc .....

Créez alors le fichier AppKernel.php d'initialisation de votre Kernel

``` {.lang:default .decode:true}
<?php

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
        $loader->load(__DIR__.'/config/config_test.yml');
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
}
```

Ainsi que votre fichier console, vous pourrez appeler votre Kernel.

``` {.lang:default .decode:true}
#!/usr/bin/env php
<?php

// if you don't want to setup permissions the proper way, just uncomment the following PHP line
// read http://symfony.com/doc/current/book/installation.html#configuration-and-setup for more information
umask(0000);

set_time_limit(0);

require_once __DIR__.'/../../bootstrap.php';
require_once __DIR__.'/AppKernel.php';

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArgvInput;

$input = new ArgvInput();
$env = $input->getParameterOption(array('--env', '-e'), getenv('SYMFONY_ENV') ?: 'test');
$debug = getenv('SYMFONY_DEBUG') !== '0' && !$input->hasParameterOption(array('--no-debug', '')) && $env !== 'prod';

$kernel = new AppKernel($env, $debug);
$application = new Application($kernel);
$application->run($input);
```

À partir de là, votre bunlde peut fonctionner seul et donc effectuer ses
tests indépendamment de votre projet.

Il ne reste plus qu'à faire le fichier phpunit.xml.dist permettant de
configurer votre phpunit.

``` {.lang:default .decode:true}
// phpunit.xml.dist

<?xml version="1.0" encoding="UTF-8"?>

<phpunit backupGlobals="false"
         backupStaticAttributes="false"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false"
         syntaxCheck="false"
         bootstrap="Tests/bootstrap.php"
>
    <testsuites>
        <testsuite name="PhotoBundle Test Suite">
            <directory>./Tests/</directory>
        </testsuite>
    </testsuites>

    <php>
        <server name="KERNEL_DIR" value="./Tests/Fixtures/app" />
    </php>

    <filter>
        <whitelist>
            <directory>./</directory>
            <exclude>
                <directory>./Resources</directory>
                <directory>./Tests</directory>
                <directory>./vendor</directory>
                <directory>./DataFixtures</directory>
            </exclude>
        </whitelist>
    </filter>

    <logging>
        <log type="coverage-html" target="build/coverage" title="Phototheque" charset="UTF-8" yui="true" highlight="true" lowUpperBound="35" highLowerBound="70"/>
        <log type="coverage-clover" target="build/logs/clover.xml"/>
        <log type="junit" target="build/logs/junit.xml" logIncompleteSkipped="false"/>
    </logging>
</phpunit>
```

 

Pour rendre vos tests encore plus propres et plus indépendants, mettez
en place un système de rollback des requêtes de test, il suffit pour
cela d'étendre le Client de Symfony2 par un client qui isole les
requêtes de test. Créez la class Client dans le dossier de test.

``` {.lang:default .decode:true}
<?php

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
        if ($this->requested) {
            $this->getKernel()->shutdown();
            $this->getKernel()->boot();
        }

        if (null === self::$connection) {
            self::$connection = $this->getContainer()->get('doctrine.dbal.default_connection');
        } else {
            $this->getContainer()->set('doctrine.dbal.default_connection', self::$connection);
        }

        $this->requested = true;

        self::$connection->beginTransaction();

        $response = $this->getKernel()->handle($request);

        self::$connection->rollback();

        return $response;
    }
}
```

Terminez par le plus simple : la configuration du build.xml pour
Jenkins, voici un exemple mais là, c'est à vous de jouer.

``` {.lang:default .decode:true}
/build.xml

<?xml version="1.0" encoding="UTF-8"?>
<project name="Push Server" default="build">
  <target name="build" depends="prepare,lint,phploc,tools-parallel,phpunit,phpcb"/>
  <target name="tools-parallel" description="Run tools in parallel">
    <parallel threadCount="2">
      <sequential>
        <antcall target="pdepend"/>
      </sequential>
      <antcall target="phpmd-ci"/>
      <antcall target="phpcpd"/>
      <antcall target="phpcs-ci"/>
    </parallel>
  </target>

  <target name="clean" description="Cleanup build artifacts">
    <delete dir="${basedir}/build/code-browser"/>
    <delete dir="${basedir}/build/coverage"/>
    <delete dir="${basedir}/build/logs"/>
    <delete dir="${basedir}/build/pdepend"/>
    <delete dir="${basedir}/Tests/Fixtures/app/config/parameters.yml"/>
    <exec executable="cp">
      <arg value="${basedir}/Tests/Fixtures/app/config/parameters.yml.ci"/>
      <arg value="${basedir}/Tests/Fixtures/app/config/parameters.yml"/>
    </exec>
  </target>

  <target name="prepare" depends="clean" description="Prepare for build">
    <mkdir dir="${basedir}/build/code-browser"/>
    <mkdir dir="${basedir}/build/coverage"/>
    <mkdir dir="${basedir}/build/logs"/>
    <mkdir dir="${basedir}/build/pdepend"/>
    <exec executable="composer">
      <arg value="update"/>
      <arg value="--dev"/>
    </exec>
    <exec executable="php">
      <arg value="${basedir}/Tests/Fixtures/app/console"/>
      <arg value="doctrine:database:drop"/>
      <arg value="--force"/>
    </exec>
    <exec executable="php">
      <arg value="${basedir}/Tests/Fixtures/app/console"/>
      <arg value="doctrine:database:create"/>
    </exec>
    <exec executable="php">
      <arg value="${basedir}/Tests/Fixtures/app/console"/>
      <arg value="doctrine:schema:create"/>
    </exec>
    <exec executable="php">
      <arg value="${basedir}/Tests/Fixtures/app/console"/>
      <arg value="doctrine:fixtures:load"/>
      <arg value="--no-interaction"/>
      <arg value="--purge-with-truncate"/>
    </exec>
    <exec executable="php">
      <arg value="${basedir}/Tests/Fixtures/app/console"/>
      <arg value="cache:clear"/>
    </exec>
  </target>

  <target name="lint" description="Perform syntax check of sourcecode files">
    <apply executable="php" failonerror="true">
      <arg value="-l"/>
      <fileset dir="${basedir}">
        <include name="**/*.php"/>
        <exclude name="**/vendor/**" />
        <modified/>
      </fileset>
    </apply>
  </target>

  <target name="phploc" description="Measure project size using PHPLOC">
    <exec executable="phploc">
      <arg value="--log-csv"/>
      <arg value="${basedir}/build/logs/phploc.csv"/>
      <arg value="--exclude"/>
      <arg value="${basedir}/vendor" />
      <arg path="${basedir}"/>
    </exec>
  </target>

  <target name="pdepend" description="Calculate software metrics using PHP_Depend">
    <exec executable="pdepend">
      <arg value="--jdepend-xml=${basedir}/build/logs/jdepend.xml"/>
      <arg value="--jdepend-chart=${basedir}/build/pdepend/dependencies.svg"/>
      <arg value="--overview-pyramid=${basedir}/build/pdepend/overview-pyramid.svg"/>
      <arg value="--ignore=${basedir}/vendor/"/>
      <arg path="${basedir}"/>
    </exec>
  </target>

  <target name="phpmd" description="Perform project mess detection using PHPMD and print human readable output. Intended for usage on the command line before committing.">
    <exec executable="phpmd">
      <arg path="${basedir}" />
      <arg value="text" />
      <arg value="codesize,design,unusedcode" />
      <arg value="--exclude" />
      <arg value="${basedir}/vendor" />
    </exec>
  </target>

  <target name="phpmd-ci" description="Perform project mess detection using PHPMD creating a log file for the continuous integration server">
    <exec executable="phpmd">
      <arg path="${basedir}" />
      <arg value="xml" />
      <arg value="codesize,design,unusedcode" />
      <arg value="--reportfile" />
      <arg value="${basedir}/build/logs/pmd.xml" />
      <arg value="--exclude" />
      <arg value="${basedir}/vendor" />
    </exec>
  </target>

  <target name="phpcs" description="Find coding standard violations using PHP_CodeSniffer and print human readable output. Intended for usage on the command line before committing.">
    <exec executable="phpcs">
      <arg value="--standard=PSR2"/>
      <arg value="--ignore=${basedir}/vendor" />
      <arg path="${basedir}"/>
    </exec>
  </target>

  <target name="phpcs-ci" description="Find coding standard violations using PHP_CodeSniffer creating a log file for the continuous integration server">
    <exec executable="phpcs" output="/dev/null">
      <arg value="--report=checkstyle"/>
      <arg value="--report-file=${basedir}/build/logs/checkstyle.xml"/>
      <arg value="--standard=PSR2"/>
      <arg value="--ignore=vendor"/>
      <arg value="--extensions=php"/>
      <arg path="${basedir}"/>
    </exec>
  </target>

  <target name="phpcpd" description="Find duplicate code using PHPCPD">
    <exec executable="phpcpd">
      <arg value="--log-pmd"/>
      <arg value="${basedir}/build/logs/pmd-cpd.xml"/>
      <arg value="--exclude" />
      <arg value="${basedir}/vendor" />
      <arg value="--exclude" />
      <arg value="${basedir}/Tests" />
      <arg path="${basedir}"/>
    </exec>
  </target>

  <target name="phpunit" description="Run unit tests with PHPUnit">
    <exec executable="phpunit" failonerror="true"/>
  </target>

  <target name="phpcb" description="Aggregate tool output with PHP_CodeBrowser">
    <exec executable="phpcb">
      <arg value="--log" />
      <arg path="${basedir}/build/logs" />
      <arg value="--source" />
      <arg path="${basedir}" />
      <arg value="--ignore" />
      <arg path="${basedir}/vendor" />
      <arg value="--output" />
      <arg path="${basedir}/build/code-browser" />
    </exec>
  </target>
</project>
```

 

Si vous avez des questions laissez moi un commentaire :)

 

 

 

{% endraw %}
