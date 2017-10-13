---
layout: post
title: Cohabitation de plusieurs versions de PHP
authors:
    - aandre
date: '2016-10-05 10:23:54 +0200'
date_gmt: '2016-10-05 08:23:54 +0200'
lang: fr
permalink: /fr/cohabitation-de-plusieurs-version-de-php/
categories:
    - Php
tags: []
---
Dans un contexte professionnel, il n'est pas rare de travailler sur divers projets. Sur ces divers projets, il n'est pas rare non plus que ceux-ci ne fonctionnent pas avec les mêmes versions de PHP. C'est d'ailleurs pour cette raison que les IDE vous proposent de sélectionner la version de PHP (et c'est le cas pour de nombreux langages), afin de vous informer si vous utilisez une fonctionnalité qui n'est pas encore supportée, ou à l'inverse dépréciée, ou voire même inexistante.

Quid de la partie tests ? Dans cet article, je vous propose de faire cohabiter plusieurs versions de PHP, avec une granularité par projet, aussi bien en console qu'au travers d'un serveur HTTP.

# Étape 1 : installer PHPEnv

Avant toute chose, sachez qu'il existe de nombreux outils qui permettent de faire cohabiter plusieurs versions de PHP. Le but n'est pas de faire un listing de tous les outils. Pour ma part j'ai choisi PHPEnv, dans une ancienne version, étant donné que la nouvelle ne semble pas fonctionner sur ma machine.

Selon votre OS et vos préférences, vous aurez peut-être donc des adaptations à faire. Dans tous les cas le fonctionnement est toujours assez similaire, ces outils vont automatiser la compilation de PHP depuis les sources. Sur une machine décente, cela prendra une quinzaine de minutes.

Clonez le projet dans votre home (ou l'outil le plus récent, comme je l'expliquais : https://github.com/phpenv/phpenv) :

```bash
$ git clone git://github.com/humanshell/phpenv.git ~/.phpenv
```

# Étape 2 : lister les versions de PHP

Lister les versions PHP disponibles à la compilation, c'est toujours à jour puisque l'outil analyse directement les dépôts git de PHP :

```bash
$ cd .phpenv
$ ./bin/phpenv install --releases
```

Dans mon cas, au moment où j'écris ces lignes, nous avons :

```bash
...
php-7.0.9RC1
php-7.1.0RC1
php-7.1.0RC2
php-7.1.0RC3
php-7.1.0alpha1
php-7.1.0alpha2
php-7.1.0alpha3
php-7.1.0beta1
php-7.1.0beta2
php-7.1.0beta3
```

# Étape 3 : compiler une version de PHP

La dernière fois que j'évoquais [PHP 7.1](https://blog.eleven-labs.com/fr/php-7-1-pour-les-null/) c'était la première RC, donc je vais en profiter pour installer la beta 3, c'est tout simple (j'ai précédé les logs par les horaires, pour que vous voyiez le temps que ça peut prendre) :

```bash
$ ./bin/phpenv install php-7.1.0beta3
(12h19)
 [Cloning]: source from php-src Github repo
(12h23)
php.ini-development gets used as php.ini

Building php-7.1.0beta3

 [Fetching]: latest code from Github repo
 [Branching]: for a clean build environment
 [Configuring]: build options for selected release
BUILD ERROR
Switched to a new branch 'build' configure: WARNING: unrecognized options: --with-mysql configure: WARNING: You will need re2c 0.13.4 or later if you want to regenerate PHP parsers. configure: error: Cannot find OpenSSL's <evp.h>

The full Log is available here /tmp/phpenv-install-php-7.1.0beta3.20160929122243.log
```

# Étape 4 : corriger les problèmes de compilation

J'ai volontairement affiché le log précédent parce qu'il y a une __**première**__ erreur à gérer : PHPEnv utilise d'anciennes options qui ne sont plus forcément supportées. Et c'est justement l'occasion de voir comment les modifier.

On va donc éditer le script PHPEnv en charge de l'installation (à l'arrache, c'est fait pour du dev' pas pour de la prod') :

```bash
$ vim libexec/phpenv-install
```

Pour supprimer la ligne **--with-mysql=mysqlnd \**

J'ai eu bien sûr d'autres erreurs, je vous laisse chercher, la plupart du temps il s'agit de librairies de développement manquantes ou pas à jour (comme libssl-dev dans mon cas). La compilation n'a jamais été une science exacte tant cela dépend de nombreux facteurs.

# Étape 5 : prendre son mal en patience

Nous pouvons relancer l'installation :

```bash
$ ./bin/phpenv install php-7.1.0beta3
(12h31)
 [Fetching]: latest code from Github repo
 [Branching]: for a clean build environment
 [Configuring]: build options for selected release
 [Compiling]: /home/alexception/tmp/.phpenv/versions/7.1.0beta3
```

J'ai le temps d'aller prendre un café :

![cat](/assets/2016-10-05-cohabitation-de-plusieurs-versions-de-php/cat.gif)

```bash
(12h40, le ventilateur se met en route, ça compile beaucoup)

(12h45)
 [Info]: The Log File is not empty, but the build did not fail.
    Maybe just warnings got logged?
    You can review the log at /tmp/phpenv-install-php-7.1.0beta3.20160929123438.log
 [Success]: Built php-7.1.0beta3 successfully.
```

J'ai vraisemblablement eu des warnings, mais étant donné que je suis en local, c'est largement suffisant. À vous d'affiner si vous préférez optimiser.

# Étape 6 : crier ~~miaou~~ hourra

Et nous pouvons donc exécuter la commande suivante :

```bash
$ ./versions/7.1.0beta3/bin/php -v

PHP 7.1.0beta3 (cli) (built: Sep 29 2016 12:44:17) ( NTS )
Copyright (c) 1997-2016 The PHP Group
Zend Engine v3.1.0-dev, Copyright (c) 1998-2016 Zend Technologies
```

Où l'on peut constater que nous avons bien la version PHP 7.1.0beta3.

# Conclusion

Cette première étape de l'utilisation de PHPEnv vous permet déjà d'avoir plusieurs versions de PHP sur vos projets en CLI aussi bien que via un serveur HTTP, puisque PHP 5.4 sortait avec un [serveur HTTP interne](http://php.net/manual/fr/features.commandline.webserver.php). On pourrait aller un peu plus loin dans l'utilisation de cet outil, mais pour ça il y a la [documentation de l'outil](https://github.com/humanshell/phpenv). Il est bon de rappeler que c'est un outil de développement à utiliser en local ou sur un serveur de développement, et non sur un serveur de production, surtout si vous ne configurez pas les options de PHP, ou compilez des versions non finales (RC/alpha/beta). Vous vous exposeriez potentiellement à des bugs ou des failles de sécurité. Donc ne vous amusez pas à binder votre configuration Nginx sur php-fpm en version beta :)

Si toutefois vous veniez à compiler vos versions de PHP pour la production, ce qui est totalement justifié pour des raisons de performances en affinant la granularité des options, faites le correctement en utilisant [le manuel](http://php.net/manual/fr/install.unix.php).

_Crédits photo : [Nick Brandt](http://visualattraction.fr/nick-brandt)_
