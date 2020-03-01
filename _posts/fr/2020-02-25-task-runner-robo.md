---
layout: post
title: Faciliter sa vie de développeur avec Robo
excerpt: "Tous les développpeurs veulent avoir des outils à leur disposition afin d'automatiser des tâches qui font perdre du temps.
C'est un tel outil que je vais vous présenter aujourd'hui."
authors:
- skontomarkos
permalink: /fr/task-runner-robo/
categories:
    - PHP
tags:
    - PHP
cover: /assets/2020-02-25-task-runner-robo/cover.png
---

## Présentation

Tous les développpeurs veulent avoir des outils à leur disposition afin d'automatiser des tâches qui font perdre du temps.
C'est un tel outil que je vais vous présenter aujourd'hui.

## Robo ? Qu'est-ce que c'est ?

Robo est un task runner pour des projets PHP. Il nous donne la possibillité d'automatiser diverses tâches du quotidien comme :
* lancer des tests
* exécuter des commandes
* lancer plusieurs tâches en même temps
* supeviser notre projet

J'ai decidé d'utiliser car avec des simples commandes je peux m'assurer du code style de mon code,
que mes tests fonctionnent correctement.

Ses points forts
* on peut écrire des tâches customisable
* il est facile à utiliser
* il simplifie notre interaction avec PHPUNIT, Docker, Git

## Comment l'installer

Il existe plusieurs façons d'installer Robo :

* en global via robo.phar
```
wget http://robo.li/robo.phar
```
* via le composer
```
composer require consolidation/robo
```
>Si on passe par le composer il faudra utiliser vendor/bin/robo afin de lancer nos tâches robo.
Sinon on pourra utiliser directement la commande robo.

## Et la magie peut commencer
### Le RoboFile

Toutes les tâches qu'on a besoin d'exécuter, on les écrit dans le fichier RoboFile.php.

* si on a installé robo en global on lance :
```
robo init
```
* sinon on crée le fichier RoboFile.php à la racine du projet :
```
<?php
class RoboFile extends \Robo\Tasks
{
}
```

Voici un exemple de commande qu'on pourra ajouter dans notre RoboFile :
```
<?php
class RoboFile extends \Robo\Tasks
{

    /**
     * Install dependencies
     */
    public function composer()
    {
        $this->taskExec('composer')
            ->env(array_merge(
                $_ENV
            ))
            ->arg('install')
            ->arg('-d')
            ->arg('../')
            ->run();
    }

    /**
     * Run Unit Tests
     */
    public function phpunit()
    {
        $this->stopOnFail();
        $this->taskExec('phpunit')
            ->arg('--configuration=phpunit.xml')
            ->arg('--no-coverage')
            ->run();
    }

     /**
      * cleans cache and log
      */
     public function clean()
     {
         $this->taskCleanDir(['var/cache', 'var/log'])->run();
     }

     /**
      * Push to remote branch
      */
    public function git()
    {
        if ($this->taskExec('phpunit tests/')->run()->wasSuccessful()) { // check all unit test cases are passed
                $commit = $this->ask("Commit message:");
            $branch = $this->ask("Branch name:");
                $this->taskGitStack()
                    ->stopOnFail()
                    ->add('-A')
                    ->commit($commit)
                    ->push('origin', $branch)
                    ->run();
        }
    }

     /**
      * Check the code style of your project
      */
    public function phpcs()
    {
        $task = $this->taskExec(self::BIN_PATH . '/phpcs')
            ->arg('--standard=PSR12')
            ->arg('--extensions=php')
            ->arg('--ignore=' . implode(',', $this->excludedPaths));
        foreach ($this->includedPaths as $path) {
            $task->arg($path);
        }
        $task->run();
    }
}
```
Pour pouvoir lancer la dernière commande il faudra d'abord avoir installer code sniffer:
```
composer require "squizlabs/php_codesniffer=*"
```

Pour lancer la tâche développée il suffit juste de faire :

* si on a installé robo en global

```
robo nomDeLaCommande
```
* sinon

```
vendor/bin/robo nomDeLaCommande
```

Il existe aussi d'autres task runners pour PHP que je testerai pour vous comme:
* [Deployer](https://deployer.org/)
* [Blr](https://bldr.io/)
* [Task](https://taskphp.github.io/)


Pour plus d'informations sur vous pouvez vous rendre aux liens suivants :

* [Packagist](https://packagist.org/packages/consolidation/robo)
* [Robo GitHub](https://github.com/consolidation/Robo)
* [Robo](https://robo.li/)


