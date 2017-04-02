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
{% raw %}
<p>Bien que la plupart des développeurs PHP connaissent l'existence de xDebug, je me rends compte que bien peu l'utilisent réellement, et souvent se laissent tenter par la méthode "à l'ancienne" du "<b>var_dump(); die;</b>".</p>
<p>Dans cet article je vais tenter de vous familiariser avec cet outil d'une incroyable utilité, qui vous fera gagner un temps fou pour débugger vos applications.</p>
<p><!--more--></p>
<h4>Les bases</h4>
<p>Le principe est assez simple : On place tout d'abord un ou plusieurs points d'arrêt dans le code, là où on veut interrompre l'exécution du script. Lorsque l'on accède à une URL via le navigateur, xDebug intercepte l'appel et déclenche une session de debug en notifiant l'IDE. On retrouve alors dans l'IDE la valeur des variables du scope courant ainsi que la pile d'appels. Le plus sympathique est de pouvoir avancer l'exécution pas à pas en naviguant dans les appels de fonctions tout en gardant un œil sur les valeurs des variables présentes dans le scope.</p>
<p>Il est également possible de débugger les scripts en mode CLI. C'est exactement le même principe.</p>
<h4>Prérequis</h4>
<p>Si ce n'est pas déjà le cas, il faut installer et activer l'extension xDebug.</p>
<p>Sur ubuntu cela donne :</p>
<pre class="lang:sh decode:true" title="Installer xDebug sur Ubuntu">$ sudo apt-get install php-xdebug
</pre>
<p>Pour les autres systèmes je vous invite à voir la <a href="https://xdebug.org/docs/all" target="_blank">documentation officielle</a>.</p>
<p>Normalement l'extension doit maintenant être chargée avec PHP :</p>
<pre class="lang:sh decode:true" title="Check xDebug">$ php -m | grep xdebug
xdebug
</pre>
<p>Vous aurez également besoin d'un IDE, ici nous verrons un exemple avec PHPStorm, mais bien d'autres sont compatibles en installant simplement un plugin (NetBeans, Atom, SublimeText, etc...)</p>
<h4>Remote debugging (web)</h4>
<p>Dans cette section nous verrons comment utiliser xDebug avec votre IDE pour débugger une application web sur un serveur distant (ou même en local).</p>
<p>Pour activer le debug distant, nous avons besoin de modifier la config php.ini :</p>
<pre class="lang:ini false" title="xDebug configuration">xdebug.remote_enable=On         # Activer le debug distant
xdebug.remote_connect_back=On   # xDebug va automatiquement se connecter sur l'IP présente dans $_SERVER['REMOTE_ADDR']
xdebug.remote_host=localhost    # Host à contacter si remote_connect_back est désactivé ou dans un contexte CLI
xdebug.remote_port=9000         # Port par défaut
xdebug.idekey=idekey            # Identifiant de session utilisé par l'IDE
</pre>
<p>Ensuite, configurons PHPStorm :</p>
<p>On va dans <b>Run &gt; Edit configurations</b>, puis cliquer sur le symbole "<b>+</b>"<br />
Dans la liste on clique sur "<b>PHP Remote Debug</b>".</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/my_app_remote.png"><img class="aligncenter size-full wp-image-2928" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/my_app_remote.png" alt="" width="845" height="549" /></a></p>
<p>Nommez votre configuration et renseignez l'idekey, ici "idekey" comme configuré dans le php.ini.<br />
On ajoute ensuite un serveur en cliquent sur le bouton "<b>...</b>"</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/remote_host.png"><img class="aligncenter size-full wp-image-2930" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/remote_host.png" alt="" width="844" height="549" /></a></p>
<p>Dans cet exemple je fais tourner un server en local, mon host distant est en fait localhost. On laisse le port <b>80</b> et on sélectionne évidemment "<b>xDebug</b>". Il faut également mapper les fichiers PHP locaux avec ceux qui se trouvent sur le serveur (pour que l'IDE reconnaisse les fichiers que xDebug lui communique). Ici mon projet se trouve dans <b>/var/www</b> sur le serveur distant.</p>
<p>Maintenant il ne nous reste plus qu'à poser un point d'arrêt dans le code et d'écouter les connections de xDebug (bouton à droite sur l'image) :<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-15-133303.png"><img class="aligncenter size-full wp-image-2932" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Screenshot-from-2016-12-15-133303.png" alt="" width="259" height="31" /></a></p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/my_controller.png"><img class="aligncenter size-full wp-image-2931" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/my_controller.png" alt="" width="733" height="524" /></a></p>
<p>Pour déclencher la session de debug, nous devons passer la variable <b>XDEBUG_SESSION_START</b> en query string avec comme valeur notre idekey.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/browser.png"><img class="aligncenter size-full wp-image-2933" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/browser.png" alt="" width="604" height="35" /></a></p>
<blockquote><p>Il est également possible de passer par un cookie, mais le plus simple est d'utiliser un plugin sur votre navigateur (<a href="https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc" target="_blank">Xdebug helper</a> pour chrome, <a href="https://addons.mozilla.org/fr/firefox/addon/the-easiest-xdebug/" target="_blank">The easiest debug</a> pour firefox) qui vous permet en un clic d'activer le debugging.</p></blockquote>
<p>Et HOP ! PHPStorm surgit tout à coup et nous montre tout ce qui se passe à l'endroit de notre point d'arrêt !<br />
On peut même avancer l'exécution au pas à pas !</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/debugging.png"><img class="aligncenter size-full wp-image-2934" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/debugging.png" alt="" width="1253" height="982" /></a></p>
<h4>Debugger les scripts CLI</h4>
<p>Pour utiliser xDebug sur un script CLI (exécuter un simple fichier PHP ou une commande Symfony par exemple), la démarche est exactement la même. Mais cette fois xDebug ne peut plus déterminer sur quelle IP se connecter pour lancer la session de debug. La propriété <b>xdebug.remote_connect_back</b> n'est d'aucune utilité. Nous devons spécifier sur quel hôte nous voulons être contactés en utilisant la propriété <b>xdebug.remote_host</b> (localhost par défaut).</p>
<p>Voici à quoi ressemble notre configuration php.ini (celui du CLI cette fois) :</p>
<pre class="lang:text decode:true" title="xDebug configuration">xdebug.remote_enable=On         # Activer le debug distant
xdebug.remote_host=localhost    # Host à contacter (obligatoire en mode CLI)
xdebug.remote_port=9000         # Port par défaut
xdebug.idekey=idekey            # Identifiant de session utilisé par l'IDE
</pre>
<p>La configuration reste similaire, mais en mode CLI nous ne voulons pas forcément lancer du debug à chaque commande PHP. Je vous conseille plutôt de ne pas activer le remote debugging dans le php.ini, mais directement en lançant la commande PHP :</p>
<pre class="lang:sh decode:false" title="Enable xDebug locally">$ export XDEBUG_CONFIG="remote_enable=1"    # Démarrage de la session
$ php bin/console xdebug:test
...
$ unset XDEBUG_CONFIG                       # Fin de session
</pre>
<p>Ou encore :</p>
<pre class="lang:sh decode:true" title="xDebug configuration">$ XDEBUG_CONFIG="remote_enable=1" php bin/console xdebug:test
</pre>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/debugging_cli.png"><img class="aligncenter size-full wp-image-2935" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/debugging_cli.png" alt="" width="1209" height="778" /></a></p>
<p>Pour débugger en mode CLI sur un serveur distant, vous devez simplement changer la valeur de <b>xdebug.remote_host</b> dans le php.ini par votre IP.</p>
<h4>Conclusion</h4>
<p>L'utilisation de xDebug ne demande pas 5 ans d'études ! Alors utilisez-le, vu l'énorme gain de temps qu'il apporte par rapport à du debug à la main, que ce soit en web ou en CLI, en local ou sur un serveur distant, vous n'avez plus d'excuse !</p>
{% endraw %}
