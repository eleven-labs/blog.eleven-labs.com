---
layout: post
title: Déboguer vos applications dockerisées avec PhpStorm
excerpt: Aujourd'hui je vais vous expliquer comment lancer vos tests unitaires et les déboguer avec PhpStorm, le tout sans avoir besoin d'installer php, phpunit, ou Xdebug sur votre machine...
authors:
- rmasclef
lang: fr
permalink: /fr/debug-run-phpunit-tests-using-docker-remote-interpreters-with-phpstorm/
categories:
    - php
    - docker
tags:
    - phpStorm
    - docker
    - Tests Unitaires
    - Xdebug

cover: /img/covers/StockSnap_X7ZB66F677.jpg
---

Aujourd'hui je vais vous expliquer comment lancer vos tests unitaires et les déboguer avec PhpStorm, le tout sans avoir besoin d'installer php, phpunit, ou Xdebug sur votre machine...

## Pré-requis
### Sur votre machine locale

- [PhpStorm](https://www.jetbrains.com/phpstorm/)  >= 2016.3
- [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## PhpStorm plugins
Admettons qu'aucun plugin jetbrain ne soit actif sur votre Phpstorm. Voici la liste des plugins que vous allez devoir installer et que nous allons configurer :

- [Docker](https://www.jetbrains.com/help/idea/docker.html)
- PHPDocker
- PHP remote interpreter

**C'est tout**, vous n'avez pas besoin d'installer `php`, `phpunit`, `php-xdebug`... :D

## Un exemple à réutiliser

Afin de rester simple, je me suis permis de créer un petit projet qui regroupe les différentes configurations que je vais vous présenter dans un instant.

Je vous invite donc à cloner le [projet](https://github.com/rmasclef/docker-remote-php-debuging) afin de pouvoir vous entraîner.

Une fois le repo cloné, vous pouvez lancer un `docker-compose up -d` suivi par un `docker-compose exec test_app composer install --prefer-dist`.

Vous aurez alors accès à un container nommé `test-app` faisant tourner un `php-fpm-7.2` avec l'extension `xdebug` ainsi que `phpunit`.

## Configuration des plugins
### Docker
- Ouvrez la fenêtre des paramètres phpStorm (`ctrl`+`alt`+`s` ou **File/Settings/...**)
- Allez dans l'onglet **Build, execution, deployment**
- Cliquez sur **Docker**

> Note : Vous pouvez également effectuer un `ctrl`+`Shift`+`a` et taper **Docker** dans le champ de recherche comme ceci :
>
> ![Quick Docker settings access]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/quick-docker-settings-access.png)

Nous arrivons alors sur la page suivante, qui va nous permettre d'ajouter notre interpréteur `docker` :

![Docker plugin settings page]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/docker-plugin-settings-page.png)

- Cliquez sur ![Plus phpstorm button]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/plus-phpstorm-button.png) pour ajouter une nouvelle configuration Docker et indiquer à phpStorm comment se connecter au démon Docker.
> Le message "Connection successful" doit apparaître.

![Docker configuration]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/docker-configuration.png)

- Allons maintenant dans **Tools** pour fournir à phpStorm les interpréteurs de `docker` et `docker-compose`

![Docker interpreters configuration]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/docker-interpreters-configuration.png)

Voilà tout pour le plugin Docker. Si vous souhaitez en savoir plus sur son utilisation, je vous invite à visiter [cette page](https://www.jetbrains.com/help/idea/docker.html).

### Remote interpreter
L'objectif ici est de configurer l'interpréteur `php` que nous allons utiliser pour lancer un script de notre projet.

Avant d'attaquer la configuration, attardons-nous quelques instants sur les fichiers présents dans ce projet :

**Dockerfile**
```yml
FROM php:7.2-fpm

RUN apt-get update && apt-get install -y \
    zip

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN mkdir /var/composer
ENV COMPOSER_HOME /var/composer
ENV COMPOSER_ALLOW_SUPERUSER 1

# Those lines are important for remote interpreter configuration
RUN mkdir -p /var/www/TEST_APP
WORKDIR /var/www/TEST_APP

# Install PHP Xdebug configuration, (see https://blog.eleven-labs.com/fr/debugger-avec-xdebug/)
ADD xdebug.ini /etc/php/conf.d/

CMD ["php-fpm"]
```
> Note : J'ai utilisé l'image php de base, et non une alpine, pour des raisons de simplification du Dockerfile.

Comme vous pouvez le voir, j'ai simplement ajouté `xdebug` , `zip` et `composer` (inutile d'installer `git` étant donné que nous utilisons l'option `--prefer-dist` de composer 🙂).

**docker-compose**
```yml
version: '3'
services:
  test_app:
    build:
      context: ./
    dockerfile: Dockerfile
    volumes:
      - "./:/var/www/TEST_APP:cached"
      - "~/.composer:/var/composer:cached"
    environment:
      # Keep attention to that env variable
      PHP_IDE_CONFIG: serverName=test-app
```
Ici, on notera la présence de la variable d'environnement `PHP_IDE_CONFIG`. Nous allons utiliser la valeur de `serverName` pour indiquer à phpStorm le nom du serveur sur lequel il va écouter les connexions.

Pour ce faire, rendez-vous dans **File/Settings.../Languages & Framework/PHP***
![PHPStorm Settings PHP]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-settings-php.png)

- Cliquez sur ![PHPStorm Browse button]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-browse-button.png) à droite de **CLI Interpreter**
- Dans **Remote** sélectionnez **Docker** (le serveur que nous avons créé précédemment est automatiquement sélectionné)
- Dans **Image name** sélectionnez **dockerremotephpdebugingexample_test_app:latest**

![PHPStorm Settings CLI interpreter]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-settings-CLI-interpreter.png)

PhpStorm va alors automatiquement récupérer l'image si elle n'est pas déjà présente, et va détecter la version de `php` présente sur le container ainsi que ses extensions.

![PHPStorm Settings PHP]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-settings-php.png)
  - sélectionnez l'interpréteur que nous venons de créer...

PhpStorm va de nouveau détecter (ou au moins essayer...) le mapping entre le chemin du projet en local, et celui sur le container. Je dis "essayer" car vous devrez peut-être configurer manuellement ce mapping de la manière suivante :
- Dans la partie `Docker container` cliquez sur les ![PHPStorm browse buttons]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-browse-button.png)

Vous pouvez alors modifier le mapping entre le volume docker et le chemin en local (ici `/home/rmasclef/Documents/projects/ElevenLabs/DockerRemotePhpDebugingExample` doit être bindé avec `var/www/TEST_APP` étant donné que nous avons effectué ce binding dans le [Dockerfile](https://github.com/rmasclef/docker-remote-php-debuging/blob/master/docker-compose.yml#L8).

![PHPStorm]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm.png)

### PHPUnit
Ici, nous allons faire en sorte de pouvoir lancer nos tests unitaires sur le container en utilisant une simple combinaison de touches :)

- Rendez-vous dans **Files\Settings...\Languages & framework\PHP\Test frameworks**.
- Cliquez sur ![Plus phpstorm button]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/plus-phpstorm-button.png) puis **phpUnit by remote interpreter**.
- Sélectionnez l'interpréteur php que nous avons créé précédemment.

![PHPStorm PHPUnit by remote interpreter]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-PHPUnit-by-remote-interpreter.png)

- Ajoutez `/var/www/TEST_APP/vendor/autoload.php` en tant que path vers le fichier d'autoload composer

![PHPStorm PHPUnit interpreter]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-PHPUnit-interpreter.png)

PhpStorm doit alors détecter la version de phpunit installée sur le container.
> Note : Vous pouvez également ajouter un fichier de configuration phpunit (ici `/var/www/TEST_APP/phpunit.xml.dist`).

**À présent, vous pouvez lancer les tests unitaires sur votre container via phpStorm**

### PHP Remote debugger
![PHPStorm menu tests]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-menu-tests.png)

- Cliquez sur ![Plus phpstorm button]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/plus-phpstorm-button.png) puis **PHP remote debug**
- Donnez un nom à cette configuration
- Cliquez sur ![PHPStorm browse buttons]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-browse-button.png) afin d'ajouter un serveur de débogage

![PHPStorm Settings Server]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-settings-server.png)

**/!\ Ici, il faut mettre en nom de serveur le nom que nous avons mis dans la variable d'environnement `PHP_IDE_CONFIG`**

Notez également qu'il faut ajouter le mapping entre notre environnement local et le container.

Sélectionnez le serveur précédemment créé et ajoutez l'IDE key qui est renseignée dans le fichier de configuration [xdebug.ini](https://github.com/rmasclef/docker-remote-php-debuging/blob/master/xdebug.ini#L5).

![PHPStorm Remote debug configuration]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-remote-debug-configuration.png)

Félicitations ! Vous êtes maintenant capable de déboguer votre application sans avoir php, phpunit, Xdebug ou tout autre librairie sur votre environnement local.

## Lancement des tests unitaires
Nous pouvons à présent lancer notre suite de tests unitaires sur notre container. Vous pouvez effectuer un clic droit sur le dossier `tests` puis cliquer sur `run tests` (ou `ctrl`+`Shift`+`F10`).

> Vous pouvez également lancer les tests d'une seule classe ou encore lancer un test d'une classe en particulier.
![PHPStorm test class]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-test-class.png)
> Tips: Dans une classe de tests unitaires, si vous placez votre curseur à l'intérieur d'une fonction et que vous effectuez un `ctrl`+`Shift`+`F10`, alors seul ce test sera lancé.
>
> À l'inverse, si vous placez votre curseur à l'extérieur des fonctions et que vous effectuez un `ctrl`+`Shift`+`F10`, alors tous les tests de la classe seront lancés.

## Déboguer

Ajoutons un point d'arrêt dans notre code :

![PHPStorm IDE Break point]({{site.baseurl}}/assets/2018-04-26-deboguer-vos-applications-dockerisees-avec-phpstorm/PHPStorm-IDE-break-point.png)

Cette fonction est testée unitairement, nous allons donc pouvoir la déboguer...
- Effectuez un clic droit sur le test unitaire que vous souhaitez déboguer puis cliquez sur **Debug 'testGetContent'**. Le débogueur se lance alors et arrive au point d'arrêt ajouté dans notre classe concrète :D
> De la même manière, vous pouvez également déboguer des scripts tels que des commandes symfony.

## Conclusion
C'est terminé, vous êtes maintenant capable de configurer PHPStorm afin qu'il lance vos tests unitaires et/ou une session de débogage à travers un container Docker.

N'hésitez pas à commenter ce post pour toute question/remarque, demande d'ajout, ou éventuel point de bloquage rencontré lors de la configuration de votre environement, nous serons ravis de pouvoir échanger avec vous !

## Sources
[configuring-remote-python-interpreters.html](https://www.jetbrains.com/help/phpstorm/configuring-remote-python-interpreters.html)
[docker-remote-interpreters](https://blog.jetbrains.com/phpstorm/2016/11/docker-remote-interpreters/)
