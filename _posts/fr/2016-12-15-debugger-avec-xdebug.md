---
layout: post
title: Débugger avec xDebug
excerpt: Dans cet article je vais tenter de vous familiariser avec xDebug, cet outil d'une incroyable utilité, qui vous fera gagner un temps fou pour débugger vos applications.
authors:
    - rgraillon
date: '2016-12-15 14:49:00 +0100'
date_gmt: '2016-12-15 15:49:00 +0100'
lang: fr
permalink: /fr/debugger-avec-xdebug/
categories:
    - php
tags:
    - php
image:
    path: /assets/2016-12-15-debugger-avec-xdebug/php-bug.jpg
    height: 100
    width: 100
---

Bien que la plupart des développeurs PHP connaissent l'existence de xDebug, je me rends compte que bien peu l'utilisent réellement, et souvent se laissent tenter par la méthode « à l'ancienne » du `var_dump(); die;`.

Dans cet article je vais tenter de vous familiariser avec cet outil d'une incroyable utilité, qui vous fera gagner un temps fou pour débugger vos applications.

## Les bases

Le principe est assez simple : On place tout d'abord un ou plusieurs points d'arrêt dans le code, là où on veut interrompre l'exécution du script. Lorsque l'on accède à une URL via le navigateur, xDebug intercepte l'appel et déclenche une session de debug en notifiant l'IDE. On retrouve alors dans l'IDE la valeur des variables du scope courant ainsi que la pile d'appels. Le plus sympathique est de pouvoir avancer l'exécution pas à pas en naviguant dans les appels de fonctions tout en gardant un œil sur les valeurs des variables présentes dans le scope.

Il est également possible de débugger les scripts en mode CLI. C'est exactement le même principe.

## Prérequis

Si ce n'est pas déjà le cas, il faut installer et activer l'extension xDebug.

Sur ubuntu cela donne :

```bash
sudo apt-get install php-xdebug
```
Pour les autres systèmes je vous invite à voir la documentation officielle.

Normalement l'extension doit maintenant être chargée avec PHP :

```bash
php -m | grep xdebug
xdebug
```

Vous aurez également besoin d'un IDE, ici nous verrons un exemple avec PHPStorm, mais bien d'autres sont compatibles en installant simplement un plugin (NetBeans, Atom, SublimeText, etc...)

## Remote debugging (web)

Dans cette section nous verrons comment utiliser xDebug avec votre IDE pour débugger une application web sur un serveur distant (ou même en local).

Pour activer le debug distant, nous avons besoin de modifier la config php.ini :

```ini
xdebug.remote_enable=On         # Activer le debug distant
xdebug.remote_connect_back=On   # xDebug va automatiquement se connecter sur l'IP présente dans $_SERVER['REMOTE_ADDR']
xdebug.remote_host=localhost    # Host à contacter si remote_connect_back est désactivé ou dans un contexte CLI
xdebug.remote_port=9000         # Port par défaut
xdebug.idekey=idekey            # Identifiant de session utilisé par l'IDE
```
Ensuite, configurons PHPStorm :

On va dans **Run > Edit configurations**, puis cliquer sur le symbole « + »
Dans la liste on clique sur « **PHP Remote Debug** ».

![](/assets/2016-12-15-debugger-avec-xdebug/my_app_remote.png)

Nommez votre configuration et renseignez l'idekey, ici « idekey » comme configuré dans le php.ini.
On ajoute ensuite un serveur en cliquent sur le bouton « ... »

![](/assets/2016-12-15-debugger-avec-xdebug/remote_host.png)

Dans cet exemple je fais tourner un server en local, mon host distant est en fait localhost. On laisse le port **80** et on sélectionne évidemment « **xDebug** ». Il faut également mapper les fichiers PHP locaux avec ceux qui se trouvent sur le serveur (pour que l'IDE reconnaisse les fichiers que xDebug lui communique). Ici mon projet se trouve dans **/var/www** sur le serveur distant.

Maintenant il ne nous reste plus qu'à poser un point d'arrêt dans le code et d'écouter les connections de xDebug (bouton à droite sur l'image) : ![](/assets/2016-12-15-debugger-avec-xdebug/configuration_dropdown.png)

![](/assets/2016-12-15-debugger-avec-xdebug/my_controller.png)

Pour déclencher la session de debug, nous devons passer la variable `XDEBUG_SESSION_START` en query string avec comme valeur notre idekey.

![](/assets/2016-12-15-debugger-avec-xdebug/browser.png)
> Il est également possible de passer par un cookie, mais le plus simple est d'utiliser un plugin sur votre navigateur ([Xdebug helper](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc) pour chrome, [The easiest debug](https://addons.mozilla.org/fr/firefox/addon/the-easiest-xdebug/) pour firefox){:rel="nofollow noreferrer"} qui vous permet en un clic d'activer le debugging.

Et HOP ! PHPStorm surgit tout à coup et nous montre tout ce qui se passe à l'endroit de notre point d'arrêt !
On peut même avancer l'exécution au pas à pas !

![](/assets/2016-12-15-debugger-avec-xdebug/debugging.png)

## Debugger les scripts CLI

Pour utiliser xDebug sur un script CLI (exécuter un simple fichier PHP ou une commande Symfony par exemple), la démarche est exactement la même. Mais cette fois xDebug ne peut plus déterminer sur quelle IP se connecter pour lancer la session de debug. La propriété `xdebug.remote_connect_back` n'est d'aucune utilité. Nous devons spécifier sur quel hôte nous voulons être contactés en utilisant la propriété `xdebug.remote_host` (localhost par défaut).

Voici à quoi ressemble notre configuration php.ini (celui du CLI cette fois) :

```ini
xdebug.remote_enable=On         # Activer le debug distant
xdebug.remote_host=localhost    # Host à contacter (obligatoire en mode CLI)
xdebug.remote_port=9000         # Port par défaut
xdebug.idekey=idekey            # Identifiant de session utilisé par l'IDE
```

La configuration reste similaire, mais en mode CLI nous ne voulons pas forcément lancer du debug à chaque commande PHP. Je vous conseille plutôt de ne pas activer le remote debugging dans le php.ini, mais directement en lançant la commande PHP :

```bash
export XDEBUG_CONFIG="remote_enable=1"    # Démarrage de la session
php bin/console xdebug:test
...
unset XDEBUG_CONFIG                       # Fin de session
```
Ou encore :

```bash
XDEBUG_CONFIG="remote_enable=1" php bin/console xdebug:test
```

![](/assets/2016-12-15-debugger-avec-xdebug/debugging_cli.png)

Pour débugger en mode CLI sur un serveur distant, vous devez simplement changer la valeur de `xdebug.remote_host` dans le php.ini par votre IP.

## Conclusion

L'utilisation de xDebug ne demande pas 5 ans d'études ! Alors utilisez-le, vu l'énorme gain de temps qu'il apporte par rapport à du debug à la main, que ce soit en web ou en CLI, en local ou sur un serveur distant, vous n'avez plus d'excuse !
