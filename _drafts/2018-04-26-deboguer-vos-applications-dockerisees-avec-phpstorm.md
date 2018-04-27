---
layout: post
title: Déboguer vos applications dockerisées avec PhpStorm  
excerpt: Aujourd'hui je vais vous expliquer comment lancer vos tests unitaires et les déboguer avec PhpStorm, le tout sans avoir besoin d'installer php, phpunit ou xdebug sur votre machine...
authors:
- rmasclef
permalink: /fr/debug-run-phpunit-tests-using-docker-remote-interpreters-with-phpstorm/
categories:
    - CATEGORIE 1
    - CATEGORIE 2
    - ...
tags:
    - PhpStorm
    - Docker
    - Tests Unitaire
    - XDEBUG

cover: URL DE L'IMAGE (/assets/....)
---

Aujourd'hui je vais vous expliquer comment lancer vos tests unitaires et les déboguer avec PhpStorm, le tout sans avoir besoin d'installer php, phpunit ou xdebug sur votre machine...

## Prerequis
### Sur votre machine locale

- [PhpStorm](https://www.jetbrains.com/phpstorm/)  >= 2016.3
- [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [OPTIONAL] [Docker Compose](https://docs.docker.com/compose/install/) 
 
### PhpStorm plugins
Admettons qu'aucun plugin jetbrain ne soit actif sur votre Phpstorm. Voici la liste des plugins que vous allez devoir installer et que nous allons configurer :

- [Docker](https://www.jetbrains.com/help/idea/docker.html)
- PHPDocker
- PHP remote interpreter

**C'est tout**, vous n'avez pas besoin d'installer `php`, `phpunit`, `php-xdebug`... :D

## Un exemple à réutiliser 

Afin de rester simple, je me suis permis de créer un petit projet qui regroupe les différentes configurations que je vais vous présenter dans un instant.

Je vous invite donc à cloner le [projet](https://github.com/rmasclef/docker-remote-php-debuging) afin de pouvoir vous entraîner
 
Une fois le repo cloné, vous pouvez lancer un `docker-compose up -d` suivi par un `docker-compose exec test_app composer install --prefer-dist`.

Vous aurez alors accès à un container nommé `test-app` faisant tourner un `php-fpm-7.2` avec l'extension `xdebug` ainsi que `phpunit`.

## Configuration des plugins
### Docker
- Ouvrez la fenêtre des paramètres phpStorm (`ctrl`+`alt`+`s` ou **File/Settings/...**)
- Allez dans l'onglet **Build, execution, deployment**
- Cliquez sur **Docker**

> Note : Vous pouvez également effectuer un `ctrl`+`Shift`+`a` et taper **Docker** dans le champ de recherche comme ceci :
> 
> ![Quick Docker settings access](https://lh3.googleusercontent.com/MJuW4xVsaEJlnDc3TpERTH2uajxjpVa6MYI6GpttP00I_smlWv2OU-uu4PMO1UkFiF1EqKGS3Mg)

Nous arrivons alors sur la page suivante, qui va nous permettre d'ajouter notre interpréteur `docker`:

![Docker plugin settings page](https://lh3.googleusercontent.com/G3rlCHdIfFkzvX4m0FUs2O3Hy4bDa8g4zhDKm2xrZg2IPartVDwjZpPyseurKDsPNQ8lcQ2e_A8)

- Cliquez sur ![Plus phpstorm button](https://lh3.googleusercontent.com/T45MnSFQP2h5AGkNGFyA9CyI4VuIKWQrYHWGBohkTzgL84t8hSmEMac_-31HTwhsVBiequFPD-w) pour ajouter une nouvelle configuration Docker et indiquer à phpStorm comment se connecter au démon Docker. 
> Le message "Connection successful" doit apparaître.

![Docker configuration](https://lh3.googleusercontent.com/qzB9l6jmkOTOHDeE-RtW5MTWmAFJoKbxmOnhPz6v5-aZFL5ydyf-eeo5fyN4DxnVYVTYElivvx4)

- Allons maintenant dans **Tools** pour fournir à phpStorm les interpréteurs de `docker` et `docker-compose`

![Docker interpreters configuration](https://lh3.googleusercontent.com/3mZMaNYVz4tdT4Nbc1HH72GhpwxSzeBY3UKPhK9FS4AU-6XKRaBQzUskUfPA1YTOmmRtnNLU-Pk)

Voilà tout pour le plugin Docker. Si vous souhaitez en savoir plus sur son utilisation, je vous invite à visiter [cette page](https://www.jetbrains.com/help/idea/docker.html).

### Remote interpreter
L'objectif ici est de configurer l'interpréteur `php` que nous allons utiliser pour lancer un script de notre projet.

Avant d'attaquer la configuration, attardons-nous quelques instants sur les fichiers présents dans ce projet :

**DockerFile**
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

# Install PHP XDEBUG configuration, (see https://blog.eleven-labs.com/fr/debugger-avec-xdebug/)
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
    build: context: ./
    dockerfile: DockerFile
    volumes:
      - "./:/var/www/TEST_APP:cached"
      - "~/.composer:/var/composer:cached"
    environment:
      # Keep attention to that env variable 
      PHP_IDE_CONFIG: serverName=test-app
```
Ici, on notera la présence de la variable d'environnement `PHP_IDE_CONFIG`. Nous allons utiliser la valeur de `serverName` pour indiquer à phpStorm le nom du serveur sur lequel il va écouter les connexions. 

Pour ce faire, rendez-vous dans **File/Settings.../Languages & Framework/PHP***
![PHPStorm Settings PHP](https://lh3.googleusercontent.com/EypBsKBO_74JB2Sns7Q69NEoh5O-9ZBBHh3RyIg8eng-ceZJ_aC64S9jK-5kedsTiGRjKJrA2aM)

- Cliquez sur ![PHPStorm Browse button](https://lh3.googleusercontent.com/J1Fz5vcsmhAsUmpe2FJhA0784r5oDXBKbFiN821jQDnf1i7AcP80MhY6D31uzKFrPhoYtK3otMI) à droite de **CLI Interpreter**
- Dans **Remote** sélectionner **Docker** (le serveur que nous avons créé précédemment est automatiquement sélectionné)
- Dans **Image name** sélectionnez **dockerremotephpdebugingexample_test_app:latest**

![PHPStorm Settings CLI interpreter](https://lh3.googleusercontent.com/eZcq72PfUx91M2y09sIYi3KaWDZQM2cNqA-FQWPus6usHwuOCepQozdwcojHGIRRRJ5aq5bf0yU)

PhpStorm va alors automatiquement récupérer l'image si elle n'est pas déjà présente, et va détecter la version de `php` présente sur le container ainsi que ses extensions.

![PHPStorm Settings PHP](https://lh3.googleusercontent.com/oRRQLkDBgO6Ssjmnij2HaDlxX2o3rywdbi9roIeezA2jVoN2Wm5rxiEiOMg9s6PwR66dOkZyxQg)
  - sélectionnez l'interpréteur que nous venons de créer...

PhpStorm va de nouveau détecter (ou au moins essayer...) le mapping entre le chemin du projet en local, et celui sur le container. Je dis "essayer" car vous devrez peut-être setter manuellement ce mapping de la manière suivante :
- Dans la partie `Docker container` cliquez les ![PHPStorm browse buttons](https://lh3.googleusercontent.com/8MmEu0jTW8VyS9ICfpztslvRdidj-JQYBqqRyMR7YSSGPRQBAMaZKNFvp44bGhQB6xfYkaMew0M)

Vous pouvez alors modifier le mapping entre le volume docker et le chemin en local (ici `/home/rmasclef/Documents/projects/ElevenLabs/DockerRemotePhpDebugingExample` doit être bindé avec `var/www/TEST_APP` étant donné que nous avons effectué ce binding dans le [DockerFile](https://github.com/rmasclef/docker-remote-php-debuging/blob/master/docker-compose.yml#L8).

![PHPStorm](https://lh3.googleusercontent.com/-IuvSJqUUATWDadbYy5Z3MR_a6sElYR8gbVGAMsbsvvm98aGT1Q4sd480qUAwjOI7nPeJ6CPWgk)

### PHPUnit
Ici, nous allons faire en sorte de pouvoir lancer nos tests unitaires sur le container en utilisant une simple combinaison de touches :)

- Rendez-vous dans **Files\Settings...\Languages & framework\PHP\Test frameworks**.
- Cliquez sur ![enter image description here](https://lh3.googleusercontent.com/WxZzszQxhcQueWNtlD78nxG9fMUaD6evVK8hwC7-sCT1uvPo1S0U0sdqT0rXK4DQk4LBksEfPjE) puis **phpUnit by remote interpreter**.
- Sélectionnez l'interpréteur php que nous avons créé précédemment.

![PHPStorm PHPUnit by remote interpreter](https://lh3.googleusercontent.com/SWg7OO9p3W5nss5t7M0j3UsWT0Dw5zVHPoDhXSU29EpREAcxjobYVSuAYUAjYQLrCIwg7qfc5T4)

- Ajoutez `/var/www/TEST_APP/vendor/autoload.php` en tant que path vers le fichier d'autoload composer

![PHPStorm PHPUnit interpreter](https://lh3.googleusercontent.com/ekDeZYA8PbPcDnK0dZ9NXS1VzmKbKKy-tCLQ1NTVv6W-QiyHLtPCtRUY9bAdGxT5VQcIWH6DuKo)

PhpStorm doit alors détecter la version de phpunit installée sur le container.
> Note : Vous pouvez également ajouter un fichier de configuration phpunit (ici `/var/www/TEST_APP/phpunit.xml.dist`).

**À présent, vous pouvez lancer les TUs sur votre container via phpStorm**

### PHP Remote debugger
![PHPStorm menu tests](https://lh3.googleusercontent.com/m9mBKwxFDUD6UfBzQRCZOd8yMS1tjlXIYjeVmR86Syu0QxHXw_fJeEg5cJxM8gOtx-l2jBtBpTQ)

- Cliquez sur ![PHPStorm plus button](https://lh3.googleusercontent.com/WxZzszQxhcQueWNtlD78nxG9fMUaD6evVK8hwC7-sCT1uvPo1S0U0sdqT0rXK4DQk4LBksEfPjE) puis **PHP remote debug**
- Donnez un nom à cette configuration
- Cliquez sur ![PHPStorm browse](https://lh3.googleusercontent.com/8MmEu0jTW8VyS9ICfpztslvRdidj-JQYBqqRyMR7YSSGPRQBAMaZKNFvp44bGhQB6xfYkaMew0M) afin d'ajouter un serveur de débogage

![PHPStorm Settings Server](https://lh3.googleusercontent.com/_3grYeA__43Oi-w7APRxv6Bprk1plqoUoU8LzYbF2Ri7wqwZgXm1VjtLdLQsXKtk387lLdnKPXSl)

**/!\ Ici, il faut mettre en nom de serveur le nom que nous avons mis dans la variable d'environnement `PHP_IDE_CONFIG`** 

Notez également qu'il faut ajouter le mapping entre notre environnement local et le container.
 
Sélectionnez le serveur précédemment créé et ajoutez l'IDE key qui est renseigné dans le fichier de configuration `xdebug.ini` (https://github.com/rmasclef/docker-remote-php-debuging/blob/master/xdebug.ini#L5)
![enter image description here](https://lh3.googleusercontent.com/bGCZ72gHEqROnZJPZLB_37YD_cN1sdFY1XO0Wmjmwqv7rtKSJglitenE9sb_UJaJRuQtcolgxd79)

Félicitations ! Vous êtes maintenant capable de déboguer votre application sans avoir php, phpunit, xdebug ou tout autre librairie sur votre environnement local. 

## Lancement des TUs
Nous pouvons à présent lancer notre suite de tests unitaires sur notre container. Vous pouvez effectuer un clic droit sur le dossier `tests` puis sur `run tests` (ou `ctrl`+`Shift`+`F10`).
 
> Vous pouvez également lancer les tests d'une seule classe ou encore lancer un test d'une classe en particulier.
![PHPStorm](https://lh3.googleusercontent.com/0QNIQp1eCGSEZRekZCA7vrRwuwwetc9PZwAeGrSBrB7LsLueJfB3rhaakKICITwme_Mb8JPHA-U)
> Tips: Dans une classe de TU, si vous placez votre curseur à l'intérieur d'une fonction et que vous effectuez un `ctrl`+`Shift`+`F10` alors seul ce test sera lancé.
> 
> À l'inverse, si vous placez votre curseur à l'extérieur des fonctions et que vous effectuez un `ctrl`+`Shift`+`F10` alors tous les tests de la classe seront lancés.

## Déboguer

Tout d'abord, ajoutons un point d'arrêt dans notre code :

![PHPStorm IDE Break point](https://lh3.googleusercontent.com/B9c4mc_Uety40u4nbMk2XinVOa9OqCr29z8A6MxFQ24DgimpKAUD06_9cf0mylEIUVt5qTTxtN5-)

Cette fonction est testée unitairement, nous allons donc pouvoir la déboguer...
- Effectuez un clic droit sur le test unitaire que vous souhaitez déboguer puis cliquez sur **Debug 'testGetContent'**. Le débogueur se lance alors et arrive au point d'arrêt ajouté dans notre classe concrète :D
> Vous pouvez également déboguer des scripts tels que des commandes symfony de cette manière.

# sources
https://www.jetbrains.com/help/phpstorm/configuring-remote-python-interpreters.html
https://blog.jetbrains.com/phpstorm/2016/11/docker-remote-interpreters/
