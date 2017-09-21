---
layout: post
title: La Console, on aime en Symfony 3.2
permalink: /fr/la-console-aime-en-symfony-3-2/
excerpt: "La console est un composant essentiel pour beaucoup d’applications web. Nous avons pas mal de nouveautés dans cette nouvelle version de Symfony. Je vous présente dans cet article mes préférées et vous mettrai les liens de celles que je ne détaille pas ici à la fin (on est comme ça chez Eleven)."
authors:
 - jgreaux
date: '2016-12-30 10:40:56 +0100'
date_gmt: '2016-12-30 09:40:56 +0100'
categories:
- Symfony
- Php
tags:
- php
- symfony
- Console
---

La console est un composant essentiel pour beaucoup d’applications web. Nous avons pas mal de nouveautés dans cette nouvelle version de Symfony. Je vous présente dans cet article mes préférées et vous mettrai les liens de celles que je ne détaille pas ici à la fin (on est comme ça chez Eleven).

## Les alias dans les commandes

On l’attendait, ils l’ont fait : nous pouvons désormais créer une liste d’alias à nos commandes. Pour cela, rien de plus simple : ajoutez “setAliases” avec en paramètre un tableau de string comportant tous les alias.

Voici un exemple :

**ElevenLabsAliasCommand.php** :

```php
<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ElevenLabsAliasCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('eleven-labs:alias-command')
            ->setDescription('Test alias command')
            ->setAliases(['space', 'moon'])
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Alias command done');
    }

}
```

Voici une petite vidéo pour voir ce que ça rend :

<script type="text/javascript" src="https://asciinema.org/a/8i85eeqih2rwmccrtab407qtv.js" id="asciicast-8i85eeqih2rwmccrtab407qtv" async></script>

## Test des commandes

Tester des commandes, on sait faire. Mais lorsque dans les commandes nous devons répondre à des questions par des étapes intermédiaires, ça devient plus difficile. Terminé les complications, il suffit de rajouter dans vos tests la méthode "setInputs", avec en paramètre un tableau contenant les réponses à vos étapes.
Voici rien que pour vous un exemple très simple :

**ElevenLabsTestCommand.php** :

```php
<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\Input;

class ElevenLabsTestCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('eleven-labs:test-command')
            ->setDescription('...')
            ->setAliases(['test']);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);
        $firstname = $io->ask('What is your firstname ?');
        $lastname = $io->ask('Your last name ?');

        $text = $firstname.' '.$lastname.', welcome on board !';

        $output->writeln($text);
    }

}
```

**ElevenLabsTestCommandTest.php** :

```php
<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class ElevenLabsTestCommandTest extends KernelTestCase
{
    public function testCommand()
    {
        $kernel = $this->createKernel();
        $kernel->boot();

        $application = new Application($kernel);
        $application->add(new ElevenLabsTestCommand());

        $command = $application->find('eleven-labs:test-command');
        $commandTester = new CommandTester($command);

        // Ajouter tous les inputs dans l'ordre, ici nous devons mettre un nom et un prénom
        $commandTester->setInputs(['Niel', 'Armstrong']);

        $commandTester->execute([
            'command'  => $command->getName(),
        ]);

        $output = $commandTester->getDisplay();

        // Nous verifions ici que nous avons bien les mêmes input
        $this->assertContains('Niel Armstrong, welcome on board !', $output);
    }
}
```

## Single command application

Les “**S**ingle **C**ommand **A**pplication” sont possibles sur Symfony, comme vous pouvez le voir dans la [documentation](http://symfony.com/doc/3.1/components/console/single_command_tool.html).
Cette feature améliorée dans la version 3.2 nous permet d’ajouter un booléen à la méthode setDefaultCommand(). C’est grâce à ce booléen que nous pouvons désormais basculer l’application en une SCA.

Mieux vaut un exemple qu’un long discours, commençons par créer deux simples commandes :

**Command/EspaceCommand.php :**

```php
<?php
namespace Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Command\Command;


class EspaceCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('espace')
            ->setDescription('Aller dans l\'espace')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Je suis dans l\'espace');
    }
}
```

**Command/TerreCommand.php :**

```php
<?php
namespace Command;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Command\Command;


class TerreCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('terre')
            ->setDescription('Redescendre sur terre')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Je retourne sur terre');
    }
}
```

**SingleCommand.php :**

```php
#!/usr/bin/env php
<?php

require __DIR__.'/vendor/autoload.php';

use Command\EspaceCommand;
use Command\TerreCommand;
use Symfony\Component\Console\Application;

// On initialise les deux commandes
$espaceCommand = new EspaceCommand();
$terreCommand = new TerreCommand();

// On créer une nouvelle application, et on lui ajoute nos 2 commandes
$application = new Application();
$application->add($espaceCommand);
$application->add($terreCommand);

// On met la commande EspaceCommand en par défaut et on ajout un booléen à TRUE
$application->setDefaultCommand($espaceCommand->getName(), true);

$application->run();
```

Dans le fichier SingleCommand, nous avons rajouté un booléen à true, pour indiquer que nous souhaitons avoir une **SCA**.

<script type="text/javascript" src="https://asciinema.org/a/ctpdd6v34qfh35try9xtqrrpd.js" id="asciicast-ctpdd6v34qfh35try9xtqrrpd" async></script>

## LockableTrait

Depuis la version 2.6, il est possible de bloquer une commande si la commande est déjà en train de tourner.
Voici un petit exemple de comment nous devions faire :

```php
class LockableCommand extends Command
{
    protected function configure()
    {
        // ...
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $lock = new LockHandler('update:contents');
        if (!$lock->lock()) {
            $output->writeln('The command is already running in another process.');
            return 0;
        }

        $lock->release();
    }
}
```

Avec la version 3.2, vous pouvez ajouter le trait directement dans votre commande :

```php
class LockableCommand extends Command
{
    use LockableTrait;

    protected function execute(InputInterface $input, OutputInterface $output)
    {
         if (!$this->lock()) {
            $output->writeln('The command is already running in another process.');
            return 0;
         }

         $this->release();
    }
}
```

## Hidden et Options multiples

Une petite nouveauté qui vous permettra de cacher une commande très simplement.
Une fois la commande cachée, vous pourrez  toujours la lancer, mais elle n’apparaîtra plus dans la liste de vos commandes :

```php
class HiddenCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('hidden')
            ->hidden(true)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // your code here
    }
}
```

Enfin, il est désormais possible de combiner plusieurs options de texte sur le même input, voici un exemple :

``` theme:monokai
$output->writeln('<fg=green;options=italic,underscore>Texte vert italic et souligné</>');
```

## Conclusion

Voilà, je vous ai montré les nouveautés que je préfère, mais ce ne sont pas les seules, pour voir toute la liste des nouveautés pour le composant console, je vous conseille de suivre ce lien : <http://symfony.com/blog/symfony-3-2-0-released>
