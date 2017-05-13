---
layout: post
title: Débugger avec xDebug
author: rgraillon
date: '2016-12-15 14:49:11 +0100'
date_gmt: '2016-12-15 13:49:11 +0100'
categories:
- Php
tags:
- php
- test
- debug
---

Bien que la plupart des développeurs PHP connaissent l'existence de xDebug, je me rends compte que bien peu l'utilisent réellement, et souvent se laissent tenter par la méthode "à l'ancienne" du "**var\_dump(); die;**".

Dans cet article je vais tenter de vous familiariser avec cet outil d'une incroyable utilité, qui vous fera gagner un temps fou pour débugger vos applications.

#### Les bases

Le principe est assez simple : On place tout d'abord un ou plusieurs points d'arrêt dans le code, là où on veut interrompre l'exécution du script. Lorsque l'on accède à une URL via le navigateur, xDebug intercepte l'appel et déclenche une session de debug en notifiant l'IDE. On retrouve alors dans l'IDE la valeur des variables du scope courant ainsi que la pile d'appels. Le plus sympathique est de pouvoir avancer l'exécution pas à pas en naviguant dans les appels de fonctions tout en gardant un œil sur les valeurs des variables présentes dans le scope.

Il est également possible de débugger les scripts en mode CLI. C'est exactement le même principe.

#### Prérequis

Si ce n'est pas déjà le cas, il faut installer et activer l'extension xDebug.

Sur ubuntu cela donne :

```sh
$ sudo apt-get install php-xdebug
```

Pour les autres systèmes je vous invite à voir la [documentation officielle](https://xdebug.org/docs/all).

Normalement l'extension doit maintenant être chargée avec PHP :

```sh
$ php -m | grep xdebug
xdebug
```

Vous aurez également besoin d'un IDE, ici nous verrons un exemple avec PHPStorm, mais bien d'autres sont compatibles en installant simplement un plugin (NetBeans, Atom, SublimeText, etc...)

#### Remote debugging (web)

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

On va dans **Run &gt; Edit configurations**, puis cliquer sur le symbole "**+**"
Dans la liste on clique sur "**PHP Remote Debug**".

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/my_app_remote.png)

Nommez votre configuration et renseignez l'idekey, ici "idekey" comme configuré dans le php.ini.
On ajoute ensuite un serveur en cliquent sur le bouton "**...**"

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/remote_host.png)

Dans cet exemple je fais tourner un server en local, mon host distant est en fait localhost. On laisse le port **80** et on sélectionne évidemment "**xDebug**". Il faut également mapper les fichiers PHP locaux avec ceux qui se trouvent sur le serveur (pour que l'IDE reconnaisse les fichiers que xDebug lui communique). Ici mon projet se trouve dans **/var/www** sur le serveur distant.

Maintenant il ne nous reste plus qu'à poser un point d'arrêt dans le code et d'écouter les connections de xDebug (bouton à droite sur l'image) :![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-15-133303.png)

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/my_controller.png)

Pour déclencher la session de debug, nous devons passer la variable **XDEBUG\_SESSION\_START** en query string avec comme valeur notre idekey.

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/browser.png)

> Il est également possible de passer par un cookie, mais le plus simple est d'utiliser un plugin sur votre navigateur ([Xdebug helper](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc) pour chrome, [The easiest debug](https://addons.mozilla.org/fr/firefox/addon/the-easiest-xdebug/) pour firefox) qui vous permet en un clic d'activer le debugging.

Et HOP ! PHPStorm surgit tout à coup et nous montre tout ce qui se passe à l'endroit de notre point d'arrêt !
On peut même avancer l'exécution au pas à pas !

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/debugging.png)

#### Debugger les scripts CLI

Pour utiliser xDebug sur un script CLI (exécuter un simple fichier PHP ou une commande Symfony par exemple), la démarche est exactement la même. Mais cette fois xDebug ne peut plus déterminer sur quelle IP se connecter pour lancer la session de debug. La propriété **xdebug.remote\_connect\_back** n'est d'aucune utilité. Nous devons spécifier sur quel hôte nous voulons être contactés en utilisant la propriété **xdebug.remote\_host** (localhost par défaut).

Voici à quoi ressemble notre configuration php.ini (celui du CLI cette fois) :

```text
xdebug.remote_enable=On         # Activer le debug distant
xdebug.remote_host=localhost    # Host à contacter (obligatoire en mode CLI)
xdebug.remote_port=9000         # Port par défaut
xdebug.idekey=idekey            # Identifiant de session utilisé par l'IDE
```

La configuration reste similaire, mais en mode CLI nous ne voulons pas forcément lancer du debug à chaque commande PHP. Je vous conseille plutôt de ne pas activer le remote debugging dans le php.ini, mais directement en lançant la commande PHP :

```sh
$ export XDEBUG_CONFIG="remote_enable=1"    # Démarrage de la session
$ php bin/console xdebug:test
...
$ unset XDEBUG_CONFIG                       # Fin de session
```

Ou encore :

```sh
$ XDEBUG_CONFIG="remote_enable=1" php bin/console xdebug:test
```

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/debugging_cli.png)

Pour débugger en mode CLI sur un serveur distant, vous devez simplement changer la valeur de **xdebug.remote\_host** dans le php.ini par votre IP.

#### Conclusion

L'utilisation de xDebug ne demande pas 5 ans d'études ! Alors utilisez-le, vu l'énorme gain de temps qu'il apporte par rapport à du debug à la main, que ce soit en web ou en CLI, en local ou sur un serveur distant, vous n'avez plus d'excuse !
