---
lang: fr
date: '2016-01-26'
slug: verifier-la-qualite-du-code
title: Vérifier la qualité du code
excerpt: >-
  Aujourd'hui je vais vous parler de la qualité du code (oh really?). Dans cet
  article, je vais l'aborder sur la partie PHP.
authors:
  - tthuon
categories:
  - php
  - architecture
keywords:
  - psr
  - qualité
  - code
  - scrutinizer
---

Aujourd'hui je vais vous parler de la qualité du code (oh really?). Dans cet article, je vais l'aborder sur la partie PHP.

Qu'est ce que la qualité du code ?
==================================

En PHP, nous pouvons définir la qualité du code par certaines métriques, telles que la couverture des tests ou l'usage des normes PSR. Le but est d'avoir un code compréhensible par tous les développeurs et facilement maintenable.

Tout au long de cet article, je vais aborder les points suivants :

-   les normes PSR
-   la détection des erreurs
-   l'automatisation de la correction du code
-   l'intégration continue
-   le service sass

PSR, késako ?
=============

PSR, pour *PHP Standard Recommendation,* est un ensemble de normes pour PHP qui permet de faciliter l'interopérabilité des composants entre eux.

Elles sont éditées par le php-fig : *PHP Framework Interoperability Groupement*. C'est un groupement de personnes qui travaillent autour de ces recommandations. Tout le monde peut faire partie de ce groupement. Mais seuls certains membres avec le droit de vote peuvent voter sur les nouvelles recommandations. Les membres votants sont généralement des représentants de projets tels que Doctrine, Composer ou Symfony.

Il y a actuellement 7 normes validées :

-   PSR-4 est la norme pour l'auto chargement des classes. PSR-1 étant déprécié.
-   PSR-1 et PSR-2 vont se concentrer sur la forme du code
-   PSR-3 est pour la mise en forme de log.
-   PSR-6 pour la mise en cache d'objets (Redis, memcached)
-   PSR-7 pour les requêtes/réponses HTTP

Toutes ces normes vont permettre de bien structurer le code, d'avoir les mêmes interfaces, et de permettre aux autres développeurs de contribuer plus facilement.

Détection des erreurs
=====================

Avec toutes ces normes et recommandations, nous avons une bonne base solide. Apprendre et bien connaître ces recommandations peut prendre du temps. Pour cela, il y a des outils pour nous permettre de détecter les erreurs que nous faisons.

### Erreur de style

Pour PSR-1 et PSR-2, il y a [PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer "Github.com PHP Code Sniffer"){:rel="nofollow noreferrer"}. Cet outil va se baser sur un ensemble de règles, parcourir le code et afficher toutes les erreurs. Les règles peuvent être enrichies selon les spécificités du framework.

Avec Symfony, il y a cet ensemble de règles : https://github.com/instaclick/Symfony2-coding-standard

Exemple d'exécution de la commande phpcs :

```php
php bin/phpcs --report=checkstyle --standard=vendor/instaclick/symfony2-coding-standard/Symfony2/ruleset.xml --extensions=php --ignore=Tests,DataFixtures,DoctrineMigrations src/
```

La sortie va être un xml:

```xhtml
<?xml version="1.0" encoding="UTF-8"?>
<checkstyle version="1.5.5">
<file name="../Service/AvailableTimeService.php">
 <error line="28" column="12" severity="error" message="Method name &quot;AvailableTimeService::transform_To_NewValue&quot; is not in camel caps format" source="PSR1.Methods.CamelCapsMethodName.NotCamelCaps"/>
</file>
</checkstyle>
```

Dans cet exemple, le fichier "AvailableTimeService" contient une erreur. Cet erreur se situe à la ligne 28 et colonne 12. Le message d'erreur indique que le nom de la méthode n'est pas en camelCase. Or, selon PSR-1, [les méthodes doivent être écrites en camelCase](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md#1-overview){:rel="nofollow noreferrer"}.

Lors du premier lancement de la commande, il peut y avoir beaucoup d'erreurs. Au fur et à mesure, ces erreurs se réduisent et vous connaîtrez par coeur ces règles :D .

### Consistance du code

[PHP Mess Detector](https://github.com/phpmd/phpmd "Github.com PHP Mess Detector") permet de détecter tout ce qui fait un bon "*code spaghetti*". D'où le nom de *mess detector* (littéralement 'détecteur de bordel'). Cet outil va se baser sur des règles telles que la[complexité cyclomatique](http://www-igm.univ-mlv.fr/~dr/XPOSE2008/Mesure%20de%20la%20qualite%20du%20code%20source%20-%20Algorithmes%20et%20outils/complexite-cyclomatique.html){:rel="nofollow noreferrer"} du code, le nombre de conditions dans une méthode, etc...

Cet outil va nous aider à rendre le code beaucoup plus simple, lisible et d'éviter les répétitions ou des méthodes à rallonge.

Exemple :

```sh
php bin/phpmd src/ xml app/phpmd.xml --exclude Tests,DataFixtures,DoctrineMigrations,Test
```

Sortie de la commande :

```html
<?xml version="1.0" encoding="UTF-8" ?>
<pmd version="@project.version@" timestamp="2016-01-21T13:40:01+01:00">
  <file name="../Service/AvailableTimeService.php">
    <violation beginline="28" endline="61" rule="CyclomaticComplexity" ruleset="Code Size Rules" package="MyVendor\Bundle\AppBundle\Service" externalInfoUrl="http://phpmd.org/rules/codesize.html#cyclomaticcomplexity" class="AvailableTimeService" method="transformToNewValue" priority="3">
      The method transformToNewValue() has a Cyclomatic Complexity of 11. The configured cyclomatic complexity threshold is 10.
    </violation>
    <violation beginline="28" endline="61" rule="NPathComplexity" ruleset="Code Size Rules" package="MyVendor\Bundle\AppBundle\Service" externalInfoUrl="http://phpmd.org/rules/codesize.html#npathcomplexity" class="AvailableTimeService" method="transformToNewValue" priority="3">
      The method transformToNewValue() has an NPath complexity of 243. The configured NPath complexity threshold is 200.
    </violation>
  </file>
</pmd>
```

Pour comprendre ces erreurs, affichons un bout de code :

```php
<?php

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
        "5" => "5",
        "10" => "15",
        "15" => "15",
        "20" => "15",
        "plus" => "plus",
    ];

    /**
     * @param string $value
     *
     * @return string
     */
    public function transformToNewValue($value)
    {
        if ($value === "5") {
            if ($this->mappingTime["5"]) {
                return $this->mappingTime["5"];
            }
        }

        if ($value === "15") {
            if ($this->mappingTime["15"]) {
                return $this->mappingTime["15"];
            }
        }

        if ($value === "10") {
            if ($this->mappingTime["10"]) {
                return $this->mappingTime["10"];
            }
        }

        if ($value === "20") {
            if ($this->mappingTime["20"]) {
                return $this->mappingTime["20"];
            }
        }

        if ($value === "plus") {
            if ($this->mappingTime["plus"]) {
                return $this->mappingTime["plus"];
            }
        }

        return $value;
    }
}
```

*Le code de cet article étant purement fictif, toute ressemblance avec du code existant ou ayant existé ne saurait être que fortuite.* ( :p on ne sait jamais)

Ça fonctionne, mais il est possible de faire mieux. Les alertes retournées par PHPMD indique une complexité cyclomatique importante ainsi qu'une complexité sur le NPath. En clair, c'est complexe et il y a beaucoup de chemins possibles à cause des nombreux "if".

Au final, il est possible de réduire le code plus simplement :

```php
<?php

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
        "5" => "5",
        "10" => "15",
        "15" => "15",
        "20" => "15",
        "plus" => "plus",
    ];

    /**
     * @param string $value
     *
     * @return string
     */
    public function transformToNewValue($value)
    {
        if (isset($this->mappingTime[$value])) {
            $value = $this->mappingTime[$value];
        }

        return $value;
    }
}
```

Bien entendu, la refactorisation de code s'accompagne de tests unitaires afin d'assurer la fiabilité et la stabilité de cette partie.

### La tentation du copier/coller

"*pff j'ai la flemme de mutualiser ce code, je vais juste le copier coller ici*"

Combien de fois avez-vous entendu cette phrase ? Et puis le jour où le fonctionnel change, nous oublions et ça fait des choses bizarres.

Pour ne pas entrer dans cette mauvaise pratique, il y a [PHP Copy/Paste Detector](https://github.com/sebastianbergmann/phpcpd "Github PHP CPD"){:rel="nofollow noreferrer"}. Il détecte les parties de codes qui ont été dupliquées.

Petit exemple :

```sh
phpcpd src/
```

En sortie, la liste des fichiers avec les lignes dupliquées :

```
phpcpd 2.0.1 by Sebastian Bergmann.

Found 1 exact clones with 81 duplicated lines in 2 files:

  - src/MyVendor/Bundle/AppBundle/Manager/MyManager.php:13-94
    src/MyVendor/Bundle/AppBundle/Manager/PastedManager.php:13-94

0.25% duplicated lines out of 32388 total lines of code.

Time: 2.21 seconds, Memory: 20.00Mb
```

La sortie indique que les fichiers "MyManager" et "PastedManger" contiennent des lignes dupliquées. L'action à faire est de refactoriser en créant une classe abstraire, par exemple.

### Corriger en un éclair

Une fois les erreurs détectées, il faut les corriger. Personnellement, je n'utilise pas d'outils pour corriger les erreurs de manière automatique. Je me force à apprendre les règles pour que ça deviennent un automatisme.

[PHP CS Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer "Github PHP CS Fixer"){:rel="nofollow noreferrer"} va permettre de corriger toutes les erreurs de formatage du code de manière automatisée. Il s'intéresse aux recommandations PSR-1 et PSR-2.

    php bin/php-cs-fixer src/

L'outil va parcourir tout le code et corriger les erreurs. Simple, n'est-ce pas ?

Intégration continue
====================

Tous ces outils, une fois en place, permettent de surveiller et de maintenir la qualité du code. Lancer régulièrement ces commandes doit être une exigence à adopter.

Avec Jenkins, il est possible de lancer ces commandes de manière automatisée. Il suffit de créer un "job" et de le programmer. Chacune des commandes abordées dans cet article permettent de produire un rapport au format jUnit.

![rapport jenkins](/_assets/posts/2016-01-26-verifier-la-qualite-du-code/Capture-decran-2016-01-25-a-21.35.56.png)

### SonarQube

Pour ceux qui n'ont pas envie d'ajouter chaque outil séparément et de mettre un place un serveur Jenkins, il y a SonarQube.

[SonarQube](http://www.sonarqube.org/){:rel="nofollow noreferrer"} est un projet libre de droit qui permet de vérifier et contrôler la qualité du code. C'est une solution tout-en-un.

### SensioLab Insight

[SensioLab Insight](https://insight.sensiolabs.com/){:rel="nofollow noreferrer"} est un service en SASS. Principalement orienté vers Symfony 2, il s'adapte également au projet PHP sans framework.

Ce service va analyser votre code et vous indiquer les faiblesses du code. Un des points intéressants est le temps estimé pour le corriger.

### Blackfire.io

Encore un autre outil Sensio, mais très efficace dans l'analyse des performances d'une application. [Blackfire.io](https://blackfire.io/){:rel="nofollow noreferrer"} va permettre de cibler les points faibles : consommation mémoire, CPU, disque et réseau.

Cet outil s'utilise principalement pour le débogage, notamment lorsqu'une route met du temps à répondre.

Pour conclure
=============

Tout au long de cet article, nous avons vu les normes et recommandations en PHP, comment détecter les erreurs que nous pouvons faire, et enfin comment les corriger.

Avoir une bonne qualité de code et les mêmes conventions de code permet d'avoir un projet solide et compréhensible par tous les développeurs. C'est la base pour la réussite d'un projet. Ainsi, le projet s'adaptera plus facilement au changement de fonctionnalités.

En complément, nous avons abordé l'utilisation de ces outils dans un flux d'intégration continue avec Jenkins et SonarQube.

Enfin, des outils en SASS efficaces permettent de déboguer facilement et d'avoir des indicateurs enrichis.
