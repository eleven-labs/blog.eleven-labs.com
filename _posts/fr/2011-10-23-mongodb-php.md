---
layout: post
title: MongoDB pour PHP
excerpt: Aujourd'hui, petit tuto pour installer MongoDB pour php5. Pour cela plusieurs étapes sont nécessaires aussi bien sur le serveur que sur la partie software. Sur ce tuto nous travaillons sur un ubuntu 10.10 lors de l'installation des différents softwares.
authors: 
    - captainjojo
lang: fr
permalink: /fr/mongodb-php/
categories:
    - MongoDB
tags:
    - php
    - mongodb
image:
  path: /assets/2011-10-23-mongodb-php/mongo_logo.png
  height: 160
  width: 160
---
Aujourd'hui, petit tuto pour installer MongoDB pour php5. Pour cela plusieurs étapes sont nécessaires aussi bien sur le serveur que sur la partie software.
Sur ce tuto nous travaillons sur un ubuntu 10.10 lors de l'installation des différents softwares.

### Installation de MongoDB

Pour installer le serveur Mongo la meilleure solution est d'utiliser le package mongo fait pour ubuntu.

```sh
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
```
Puis ajouter la ligne suivante dans le fichier /etc/apt/source.list

```sh
deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen
```
Pour terminer, lancer les deux commandes suivantes:

```sh
sudo apt-get update
sudo apt-get install mongodb-10gen
```

Si tout c'est bien passé le message suivant doit apparaître:

```sh
Adding system user `mongodb' (UID 110) ...
Adding new user `mongodb' (UID 110) with group `nogroup' ...
Not creating home directory `/home/mongodb'.
Adding group `mongodb' (GID 118) ...
Done.
Adding user `mongodb' to group `mongodb' ...
Adding user mongodb to group mongodb
Done.
mongodb start/running, process 1937
```

### Installation d'un "phpmyadmin"

Maintenant que le serveur mongo est lancé, il faut installer un "phpmyadmin" pour pouvoir interagir avec les données de MongoDB. Il existe de nombreux softwares pour cela:

 1. phpmoadmin
 2. obricot
 3. rockmongo

Pour ce tuto nous allons installer rockmongo.
Commençons par télécharger la dernière version de rockmongo.
[rockmongo-v1.1.0](https://github.com/iwind/rockmongo){:rel="nofollow noreferrer"}

Ensuite il faut l'envoyer sur le serveur:

```sh
scp path_to_rockmongo.zip username@host:~
```
 Puis on dezippe le dossier:

```sh
unzip rockmongo.zip
```

Ensuite il faut mettre la configuration de notre mongo dans le fichier config.php. Puis nous devons ajouter le virtualhost pour accéder à notre rockmongo, voici un exemple:

```sh
// etc/apache2/site-available/rockmongo
<VirtualHost *:80>
  ServerName rockmongo.host
  ServerAlias rockmongo.host

  DocumentRoot "/home/rockmongo"
  DirectoryIndex index.php
  <Directory "/home/rockmongo">
    AllowOverride All
    Allow from All
  </Directory>

  <DirectoryMatch .svn>
    Order allow,deny
    Deny from all
  </DirectoryMatch>

  RedirectMatch 403 /phpmyadmin(.*)

</VirtualHost>
```

Ensuite comme d'habitude, on lance les commandes pour relancer apache2:

```sh
sudo a2ensite rockmongo
sudo /etc/init.d/apache2 restart
```

Si tout c'est bien passé rockmongo est visible sur le navigateur à l'url choisi.
Pour la plupart, vous devez avoir le message suivant sur le navigateur:

> To make things right, you must install php_mongo module.
> [Here](http://www.php.net/manual/en/mongo.installation.php){:rel="nofollow noreferrer"} for installation documents on PHP.net.

### Installation de mongo pour php

Cela reste très simple, lancer la commande

```sh
sudo pecl install mongo
```

Une fois la commande lancée, il faut ajouter la ligne suivante:

> extension=mongo.so

Dans les fichiers /etc/php5/cli/php.ini et /etc/php5/apache2/php.ini
Vous pouvez dès maintenant utiliser MongoDb dans votre projet PHP. Pour cela voici un exemple d'utilisation.

```php
<?php

// Permet la connexion à MongoDb
$m = new Mongo();

// Sélectionner la base
$db = $m->test;

// Puis la collection (qui correspond à une table sur mysql)
$collection = $db->user;

// Ajout d'un utilisateur dans la base
$obj = array( "name" => "jonathan", "password" => "test" );
$collection->insert($obj);

// Permet de rechercher tous les éléments d'une collection
$cursor = $collection->find();

// Et enfin une petite boucle
foreach ($cursor as $obj) {
    echo $obj["title"] . "n";
}

?>
```
Ce tuto est terminé, surtout s'il vous a aidé, partagez-le sur vos facebook :)
