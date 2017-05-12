---
layout: post
title: MongoDB pour PHP
author: jonathan
date: '2011-10-23 17:30:26 +0200'
date_gmt: '2011-10-23 17:30:26 +0200'
categories:
- MongoDB
tags:
- php
- mongodb
---
{% raw %}
Aujourd'hui, petit tuto pour installer MongoDB pour php5. Pour cela plusieurs étapes sont nécessaires aussi bien sur le serveur que sur la partie software.

Sur ce tuto nous travaillons sur un ubuntu 10.10 lors de l'installation des différents softwares.

<!--more-->

<ul>
<li>Installation de MongoDB</li>
</ul>
<div>Pour installer le serveur Mongo la meilleure solution est d'utiliser le package mongo fait pour ubuntu.</div>
<div>
<pre class="brush: shell; gutter: true">sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10</pre>
</div>
<div>Puis ajouter la ligne suivante dans le fichier /etc/apt/source.list</div>
<div>
<pre class="brush: shell; gutter: false">deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen</pre>
</div>
<div>Pour terminer, lancer les deux commandes suivantes:</div>
<div>
<pre class="brush: shell; gutter: true">sudo apt-get update
sudo apt-get install mongodb-10gen</pre>
</div>
<div>Si tout c'est bien passé le message suivant doit apparaître:</div>
<div>
<pre class="brush: shell; gutter: true">Adding system user `mongodb' (UID 110) ...
Adding new user `mongodb' (UID 110) with group `nogroup' ...
Not creating home directory `/home/mongodb'.
Adding group `mongodb' (GID 118) ...
Done.
Adding user `mongodb' to group `mongodb' ...
Adding user mongodb to group mongodb
Done.
mongodb start/running, process 1937</pre>
</div>
<ul>
<li>Installation d'un "phpmyadmin"</li>
</ul>
Maintenant que le serveur mongo est lancé, il faut installer un "phpmyadmin" pour pouvoir interagir avec les données de MongoDB. Il existe de nombreux softwares pour cela:

<ol>
<li>phpmoadmin</li>
<li>obricot</li>
<li>rockmongo</li>
</ol>
<div>Pour ce tuto nous allons installer rockmongo.</div>
<div>Commençons par télécharger la dernière version de rockmongo.</div>
<div><a href="http://clycks.fr/wp-content/uploads/2011/10/rockmongo-v1.1.0.zip">rockmongo-v1.1.0</a></div>
<div>Ensuite il faut l'envoyer sur le serveur:</div>
<div>
<pre class="brush: shell; gutter: true">scp path_to_rockmongo.zip username@host:~</pre>
</div>
<div>  Puis on dezippe le dossier:</div>
<div>
<pre class="brush: shell; gutter: true">unzip rockmongo.zip</pre>
</div>
<div>
Ensuite il faut mettre la configuration de notre mongo dans le fichier config.php. Puis nous devons ajouter le virtualhost pour accéder à notre rockmongo, voici un exemple:

<pre class="lang:default decode:true brush: shell; gutter: true ">// etc/apache2/site-available/rockmongo

&lt;VirtualHost *:80&gt;
  ServerName rockmongo.host
  ServerAlias rockmongo.host

  DocumentRoot "/home/rockmongo"
  DirectoryIndex index.php
  &lt;Directory "/home/rockmongo"&gt;
    AllowOverride All
    Allow from All
  &lt;/Directory&gt;

  &lt;DirectoryMatch .svn&gt;
    Order allow,deny
    Deny from all
  &lt;/DirectoryMatch&gt;

  RedirectMatch 403 /phpmyadmin(.*)

&lt;/VirtualHost&gt;</pre>
</div>
<div>Ensuite comme d'habitude, on lance les commandes pour relancer apache2:</div>
<div>
<pre class="brush: shell; gutter: true">sudo a2ensite rockmongo
sudo /etc/init.d/apache2 restart</pre>
</div>
<div>Si tout c'est bien passé rockmongo est visible sur le navigateur à l'url choisi.</div>
<div>Pour la plupart, vous devez avoir le message suivant sur le navigateur:</div>
<blockquote>
<div>To make things right, you must install php_mongo module. <a href="http://www.php.net/manual/en/mongo.installation.php" target="_blank">Here for installation documents on PHP.net.</a></div>
</blockquote>
<div>
<ul>
<li>Installation de mongo pour php</li>
</ul>
</div>
<div>Cela reste très simple, lancer la commande</div>
<div>
<pre class="brush: shell; gutter: true">sudo pecl install mongo</pre>
</div>
<div>Une fois la commande lancée, il faut ajouter la ligne suivante:</div>
<blockquote>
<div>extension=mongo.so</div>
</blockquote>
<div>Dans les fichiers /etc/php5/cli/php.ini et /etc/php5/apache2/php.ini</div>
<div>Vous pouvez dès maintenant utiliser MongoDb dans votre projet PHP. Pour cela voici un exemple d'utilisation.</div>
<div>
<pre class="lang:php decode:true brush: php; gutter: true">&lt;?php

// Permet la connexion à MongoDb
$m = new Mongo();

// Sélectionner la base
$db = $m-&gt;test;

// Puis la collection (qui correspond à une table sur mysql)
$collection = $db-&gt;user;

// Ajout d'un utilisateur dans la base
$obj = array( "name" =&gt; "jonathan", "password" =&gt; "test" );
$collection-&gt;insert($obj);

// Permet de rechercher tous les éléments d'une collection
$cursor = $collection-&gt;find();

// Et enfin une petite boucle
foreach ($cursor as $obj) {
    echo $obj["title"] . "n";
}

?&gt;</pre>
</div>
<div>Ce tuto est terminé, surtout s'il vous a aidé, partagez-le sur vos facebook :)</div>
{% endraw %}
