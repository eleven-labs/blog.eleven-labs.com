---
layout: post
title: Vérifier la qualité du code
author: tthuon
date: '2016-01-26 15:09:19 +0100'
date_gmt: '2016-01-26 14:09:19 +0100'
categories:
- Non classé
tags:
- php
- psr
- qualité
- code
- scrutinizer
---
{% raw %}
<p>Aujourd'hui je vais vous parler de la qualité du code (oh really?). Dans cet article, je vais l'aborder sur la partie PHP.</p>
<h2>Qu'est ce que la qualité du code ?</h2>
<p>En PHP, nous pouvons définir la qualité du code par certaines métriques, telles que la couverture des tests ou l'usage des normes PSR. Le but est d'avoir un code compréhensible par tous les développeurs et facilement maintenable.</p>
<p>Tout au long de cet article, je vais aborder les points suivants :</p>
<ul>
<li>les normes PSR</li>
<li>la détection des erreurs</li>
<li>l'automatisation de la correction du code</li>
<li>l'intégration continue</li>
<li>le service sass</li>
</ul>
<h2>PSR, késako ?</h2>
<p>PSR, pour <em>PHP Standard Recommendation,</em> est un ensemble de normes pour PHP qui permet de faciliter l'interopérabilité des composants entre eux.</p>
<p>Elles sont éditées par le php-fig : <em>PHP Framework Interoperability Groupement</em>. C'est un groupement de personnes qui travaillent autour de ces recommandations. Tout le monde peut faire partie de ce groupement. Mais seuls certains membres avec le droit de vote peuvent voter sur les nouvelles recommandations. Les membres votants sont généralement des représentants de projets tels que Doctrine, Composer ou Symfony.</p>
<p>Il y a actuellement 7 normes validées :</p>
<ul>
<li>PSR-4 est la norme pour l'auto chargement des classes. PSR-1 étant déprécié.</li>
<li>PSR-1 et PSR-2 vont se concentrer sur la forme du code</li>
<li>PSR-3 est pour la mise en forme de log.</li>
<li>PSR-6 pour la mise en cache d'objets (Redis, memcached)</li>
<li>PSR-7 pour les requêtes/réponses HTTP</li>
</ul>
<p>Toutes ces normes vont permettre de bien structurer le code, d'avoir les mêmes interfaces, et de permettre aux autres développeurs de contribuer plus facilement.</p>
<h2>Détection des erreurs</h2>
<p>Avec toutes ces normes et recommandations, nous avons une bonne base solide. Apprendre et bien connaître ces recommandations peut prendre du temps. Pour cela, il y a des outils pour nous permettre de détecter les erreurs que nous faisons.</p>
<h3>Erreur de style</h3>
<p>Pour PSR-1 et PSR-2, il y a <a title="Github.com PHP Code Sniffer" href="https://github.com/squizlabs/PHP_CodeSniffer">PHP Code Sniffer</a>. Cet outil va se baser sur un ensemble de règles, parcourir le code et afficher toutes les erreurs. Les règles peuvent être enrichies selon les spécificités du framework.</p>
<p>Avec Symfony, il y a cet ensemble de règles : https://github.com/instaclick/Symfony2-coding-standard</p>
<p>Exemple d'exécution de la commande phpcs :</p>
<pre class="lang:php decode:true">php bin/phpcs --report=checkstyle --standard=vendor/instaclick/symfony2-coding-standard/Symfony2/ruleset.xml --extensions=php --ignore=Tests,DataFixtures,DoctrineMigrations src/
</pre>
<p>La sortie va être un xml:</p>
<pre class="lang:xhtml decode:true">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;checkstyle version="1.5.5"&gt;
&lt;file name="../Service/AvailableTimeService.php"&gt;
 &lt;error line="28" column="12" severity="error" message="Method name &amp;quot;AvailableTimeService::transform_To_NewValue&amp;quot; is not in camel caps format" source="PSR1.Methods.CamelCapsMethodName.NotCamelCaps"/&gt;
&lt;/file&gt;
&lt;/checkstyle&gt;</pre>
<p>Dans cet exemple, le fichier "AvailableTimeService" contient une erreur. Cet erreur se situe à la ligne 28 et colonne 12. Le message d'erreur indique que le nom de la méthode n'est pas en camelCase. Or, selon PSR-1, <a href="https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md#1-overview">les méthodes doivent être écrites en camelCase</a>.</p>
<p>Lors du premier lancement de la commande, il peut y avoir beaucoup d'erreurs. Au fur et à mesure, ces erreurs se réduisent et vous connaîtrez par coeur ces règles :D .</p>
<h3>Consistance du code</h3>
<p><a title="Github.com PHP Mess Detector" href="https://github.com/phpmd/phpmd">PHP Mess Detector</a> permet de détecter tout ce qui fait un bon "<em>code spaghetti</em>". D'où le nom de <em>mess detector</em> (littéralement 'détecteur de bordel'). Cet outil va se baser sur des règles telles que la<a href="http://www-igm.univ-mlv.fr/~dr/XPOSE2008/Mesure%20de%20la%20qualite%20du%20code%20source%20-%20Algorithmes%20et%20outils/complexite-cyclomatique.html"> complexité cyclomatique</a> du code, le nombre de conditions dans une méthode, etc...</p>
<p>Cet outil va nous aider à rendre le code beaucoup plus simple, lisible et d'éviter les répétitions ou des méthodes à rallonge.</p>
<p>Exemple :</p>
<pre class="lang:default decode:true ">php bin/phpmd src/ xml app/phpmd.xml --exclude Tests,DataFixtures,DoctrineMigrations,Test</pre>
<p>Sortie de la commande :</p>
<pre class="lang:xhtml decode:true">&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
&lt;pmd version="@project.version@" timestamp="2016-01-21T13:40:01+01:00"&gt;
  &lt;file name="../Service/AvailableTimeService.php"&gt;
    &lt;violation beginline="28" endline="61" rule="CyclomaticComplexity" ruleset="Code Size Rules" package="MyVendor\Bundle\AppBundle\Service" externalInfoUrl="http://phpmd.org/rules/codesize.html#cyclomaticcomplexity" class="AvailableTimeService" method="transformToNewValue" priority="3"&gt;
      The method transformToNewValue() has a Cyclomatic Complexity of 11. The configured cyclomatic complexity threshold is 10.
    &lt;/violation&gt;
    &lt;violation beginline="28" endline="61" rule="NPathComplexity" ruleset="Code Size Rules" package="MyVendor\Bundle\AppBundle\Service" externalInfoUrl="http://phpmd.org/rules/codesize.html#npathcomplexity" class="AvailableTimeService" method="transformToNewValue" priority="3"&gt;
      The method transformToNewValue() has an NPath complexity of 243. The configured NPath complexity threshold is 200.
    &lt;/violation&gt;
  &lt;/file&gt;
&lt;/pmd&gt;
</pre>
<p>Pour comprendre ces erreurs, affichons un bout de code :</p>
<pre class="lang:php decode:true">&lt;?php

namespace MyVendor\Bundle\AppBundle\Service;

/**
 * Service to transform old value to new value and reverse
 *
 * @package MyVendor\Bundle\AppBundle\Service
 */
class AvailableTimeService
{
    /**
     * @var array
     */
    private $mappingTime = [
        "5" =&gt; "5",
        "10" =&gt; "15",
        "15" =&gt; "15",
        "20" =&gt; "15",
        "plus" =&gt; "plus",
    ];

    /**
     * @param string $value
     *
     * @return string
     */
    public function transformToNewValue($value)
    {
        if ($value === "5") {
            if ($this-&gt;mappingTime["5"]) {
                return $this-&gt;mappingTime["5"];
            }
        }

        if ($value === "15") {
            if ($this-&gt;mappingTime["15"]) {
                return $this-&gt;mappingTime["15"];
            }
        }

        if ($value === "10") {
            if ($this-&gt;mappingTime["10"]) {
                return $this-&gt;mappingTime["10"];
            }
        }

        if ($value === "20") {
            if ($this-&gt;mappingTime["20"]) {
                return $this-&gt;mappingTime["20"];
            }
        }

        if ($value === "plus") {
            if ($this-&gt;mappingTime["plus"]) {
                return $this-&gt;mappingTime["plus"];
            }
        }

        return $value;
    }
}
</pre>
<p><em><span id="yui_3_17_2_3_1453380107099_1635" class="ya-q-full-text">Le code de cet article étant purement fictif, toute ressemblance avec du code existant ou ayant existé ne saurait être que fortuite.</span></em><span id="yui_3_17_2_3_1453380107099_1635" class="ya-q-full-text"> </span><span id="yui_3_17_2_3_1453380107099_1635" class="ya-q-full-text">( </span><span id="yui_3_17_2_3_1453380107099_1635" class="ya-q-full-text">:p on ne sait jamais)<br />
</span></p>
<p>Ça fonctionne, mais il est possible de faire mieux. Les alertes retournées par PHPMD indique une complexité cyclomatique importante ainsi qu'une complexité sur le NPath. En clair, c'est complexe et il y a beaucoup de chemins possibles à cause des nombreux "if".</p>
<p>Au final, il est possible de réduire le code plus simplement :</p>
<pre class="lang:php decode:true">&lt;?php

namespace MyVendor\Bundle\AppBundle\Service;

/**
 * Service to transform old value to new value and reverse
 *
 * @package MyVendor\Bundle\AppBundle\Service
 */
class AvailableTimeService
{
    /**
     * @var array
     */
    private $mappingTime = [
        "5" =&gt; "5",
        "10" =&gt; "15",
        "15" =&gt; "15",
        "20" =&gt; "15",
        "plus" =&gt; "plus",
    ];

    /**
     * @param string $value
     *
     * @return string
     */
    public function transformToNewValue($value)
    {
        if (isset($this-&gt;mappingTime[$value])) {
            $value = $this-&gt;mappingTime[$value];
        }

        return $value;
    }
}
</pre>
<p>Bien entendu, la refactorisation de code s'accompagne de tests unitaires afin d'assurer la fiabilité et la stabilité de cette partie.</p>
<h3>La tentation du copier/coller</h3>
<p>"<em>pff j'ai la flemme de mutualiser ce code, je vais juste le copier coller ici</em>"</p>
<p>Combien de fois avez-vous entendu cette phrase ? Et puis le jour où le fonctionnel change, nous oublions et ça fait des choses bizarres.</p>
<p>Pour ne pas entrer dans cette mauvaise pratique, il y a <a title="Github PHP CPD" href="https://github.com/sebastianbergmann/phpcpd">PHP Copy/Paste Detector</a>. Il détecte les parties de codes qui ont été dupliquées.</p>
<p>Petit exemple :</p>
<pre class="lang:default decode:true ">phpcpd src/</pre>
<p>En sortie, la liste des fichiers avec les lignes dupliquées :</p>
<pre class="lang:default decode:true ">phpcpd 2.0.1 by Sebastian Bergmann.

Found 1 exact clones with 81 duplicated lines in 2 files:

  -	src/MyVendor/Bundle/AppBundle/Manager/MyManager.php:13-94
 	src/MyVendor/Bundle/AppBundle/Manager/PastedManager.php:13-94

0.25% duplicated lines out of 32388 total lines of code.

Time: 2.21 seconds, Memory: 20.00Mb</pre>
<p>La sortie indique que les fichiers "MyManager" et "PastedManger" contiennent des lignes dupliquées. L'action à faire est de refactoriser en créant une classe abstraire, par exemple.</p>
<h3>Corriger en un éclair</h3>
<p>Une fois les erreurs détectées, il faut les corriger. Personnellement, je n'utilise pas d'outils pour corriger les erreurs de manière automatique. Je me force à apprendre les règles pour que ça deviennent un automatisme.</p>
<p><a title="Github PHP CS Fixer" href="https://github.com/FriendsOfPHP/PHP-CS-Fixer">PHP CS Fixer</a> va permettre de corriger toutes les erreurs de formatage du code de manière automatisée. Il s'intéresse aux recommandations PSR-1 et PSR-2.</p>
<pre><code>php bin/php-cs-fixer src/
</code></pre>
<p>L'outil va parcourir tout le code et corriger les erreurs. Simple, n'est-ce pas ?</p>
<h2>Intégration continue</h2>
<p>Tous ces outils, une fois en place, permettent de surveiller et de maintenir la qualité du code. Lancer régulièrement ces commandes doit être une exigence à adopter.</p>
<p>Avec Jenkins, il est possible de lancer ces commandes de manière automatisée. Il suffit de créer un "job" et de le programmer. Chacune des commandes abordées dans cet article permettent de produire un rapport au format jUnit.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/01/Capture-d’écran-2016-01-25-à-21.35.56.png"><img class="alignnone size-medium wp-image-1554" src="http://blog.eleven-labs.com/wp-content/uploads/2016/01/Capture-d’écran-2016-01-25-à-21.35.56-300x242.png" alt="rapport jenkins" width="300" height="242" /></a></p>
<h3>SonarQube</h3>
<p>Pour ceux qui n'ont pas envie d'ajouter chaque outil séparément et de mettre un place un serveur Jenkins, il y a SonarQube.</p>
<p><a href="http://www.sonarqube.org/">SonarQube</a> est un projet libre de droit qui permet de vérifier et contrôler la qualité du code. C'est une solution tout-en-un.</p>
<h3>SensioLab Insight</h3>
<p><a href="https://insight.sensiolabs.com/">SensioLab Insight</a> est un service en SASS. Principalement orienté vers Symfony 2, il s'adapte également au projet PHP sans framework.</p>
<p>Ce service va analyser votre code et vous indiquer les faiblesses du code. Un des points intéressants est le temps estimé pour le corriger.</p>
<h3>Blackfire.io</h3>
<p>Encore un autre outil Sensio, mais très efficace dans l'analyse des performances d'une application. <a href="https://blackfire.io/">Blackfire.io</a> va permettre de cibler les points faibles : consommation mémoire, CPU, disque et réseau.</p>
<p>Cet outil s'utilise principalement pour le débogage, notamment lorsqu'une route met du temps à répondre.</p>
<h2>Pour conclure</h2>
<p>Tout au long de cet article, nous avons vu les normes et recommandations en PHP, comment détecter les erreurs que nous pouvons faire, et enfin comment les corriger.</p>
<p>Avoir une bonne qualité de code et les mêmes conventions de code permet d'avoir un projet solide et compréhensible par tous les développeurs. C'est la base pour la réussite d'un projet. Ainsi, le projet s'adaptera plus facilement au changement de fonctionnalités.</p>
<p>En complément, nous avons abordé l'utilisation de ces outils dans un flux d'intégration continue avec Jenkins et SonarQube.</p>
<p>Enfin, des outils en SASS efficaces permettent de déboguer facilement et d'avoir des indicateurs enrichis.</p>
{% endraw %}
