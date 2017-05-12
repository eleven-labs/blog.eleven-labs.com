--- layout: post title: MongoDB pour PHP author: jonathan date:
'2011-10-23 17:30:26 +0200' date\_gmt: '2011-10-23 17:30:26 +0200'
categories: - MongoDB tags: - php - mongodb --- {% raw %}

Aujourd'hui, petit tuto pour installer MongoDB pour php5. Pour cela
plusieurs étapes sont nécessaires aussi bien sur le serveur que sur la
partie software.

Sur ce tuto nous travaillons sur un ubuntu 10.10 lors de l'installation
des différents softwares.

-   Installation de MongoDB

<div>

Pour installer le serveur Mongo la meilleure solution est d'utiliser le
package mongo fait pour ubuntu.

</div>

<div>

``` {.brush: .shell; .gutter: .true}
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
```

</div>

<div>

Puis ajouter la ligne suivante dans le fichier /etc/apt/source.list

</div>

<div>

``` {.brush: .shell; .gutter: .false}
deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen
```

</div>

<div>

Pour terminer, lancer les deux commandes suivantes:

</div>

<div>

``` {.brush: .shell; .gutter: .true}
sudo apt-get update
sudo apt-get install mongodb-10gen
```

</div>

<div>

Si tout c'est bien passé le message suivant doit apparaître:

</div>

<div>

``` {.brush: .shell; .gutter: .true}
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

</div>

-   Installation d'un "phpmyadmin"

Maintenant que le serveur mongo est lancé, il faut installer un
"phpmyadmin" pour pouvoir interagir avec les données de MongoDB. Il
existe de nombreux softwares pour cela:

1.  phpmoadmin
2.  obricot
3.  rockmongo

<div>

Pour ce tuto nous allons installer rockmongo.

</div>

<div>

Commençons par télécharger la dernière version de rockmongo.

</div>

<div>

[rockmongo-v1.1.0](http://clycks.fr/wp-content/uploads/2011/10/rockmongo-v1.1.0.zip)

</div>

<div>

Ensuite il faut l'envoyer sur le serveur:

</div>

<div>

``` {.brush: .shell; .gutter: .true}
scp path_to_rockmongo.zip username@host:~
```

</div>

<div>

  Puis on dezippe le dossier:

</div>

<div>

``` {.brush: .shell; .gutter: .true}
unzip rockmongo.zip
```

</div>

<div>

Ensuite il faut mettre la configuration de notre mongo dans le fichier
config.php. Puis nous devons ajouter le virtualhost pour accéder à notre
rockmongo, voici un exemple:

``` {.lang:default .decode:true .brush: .shell; .gutter: .true}
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

</div>

<div>

Ensuite comme d'habitude, on lance les commandes pour relancer apache2:

</div>

<div>

``` {.brush: .shell; .gutter: .true}
sudo a2ensite rockmongo
sudo /etc/init.d/apache2 restart
```

</div>

<div>

Si tout c'est bien passé rockmongo est visible sur le navigateur à l'url
choisi.

</div>

<div>

Pour la plupart, vous devez avoir le message suivant sur le navigateur:

</div>

> <div>
>
> To make things right, you must install php\_mongo module. [Here for
> installation documents on
> PHP.net.](http://www.php.net/manual/en/mongo.installation.php)
>
> </div>

<div>

-   Installation de mongo pour php

</div>

<div>

Cela reste très simple, lancer la commande

</div>

<div>

``` {.brush: .shell; .gutter: .true}
sudo pecl install mongo
```

</div>

<div>

Une fois la commande lancée, il faut ajouter la ligne suivante:

</div>

> <div>
>
> extension=mongo.so
>
> </div>

<div>

Dans les fichiers /etc/php5/cli/php.ini et /etc/php5/apache2/php.ini

</div>

<div>

Vous pouvez dès maintenant utiliser MongoDb dans votre projet PHP. Pour
cela voici un exemple d'utilisation.

</div>

<div>

``` {.lang:php .decode:true .brush: .php; .gutter: .true}
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

</div>

<div>

Ce tuto est terminé, surtout s'il vous a aidé, partagez-le sur vos
facebook :)

</div>

{% endraw %}
