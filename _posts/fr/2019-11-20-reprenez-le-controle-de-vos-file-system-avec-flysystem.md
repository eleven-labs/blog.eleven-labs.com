---
layout: post
title: Reprenez le contrôle de vos file system avec Flysystem
excerpt: Cet article vous présente comment interagir simplement avec vos systèmes de gestion de fichier avec Flysystem.
authors:
    - nicolas
lang: fr
permalink: /fr/reprenez-le-controle-de-vos-file-system-avec-Flysystem/
categories:
    - PHP
    - Bundle
    - File system
tags:
    - PHP
    - Symfony
    - Flysystem
    - File system
---

# Introduction

La gestion d’un ou plusieurs système de fichier dans une application peut s’avérer compliqué. Si on utilise une solution distante comme un stockage en cloud ou sur un serveur SFTP il faudra s’occuper de la connection. Et dans tous les cas il faudra créer un système  d’interaction avec nos ressources pour les différentes solution que l’on pourra réutiliser dans toute notre application.

Pour gérer la connection avec les solutions de stockage en cloud nous pouvons trouver un sdk qui nous simplifiera notre notre code. Seulement pour l'interaction avec nos resource nous seront obligé de créer ce genre de classe :

![Class CRUD AWS S3]({{ site.baseurl }}/assets/2019-10-30-reprenez-le-controle-de-vos-file-system-avec-flysystem/screenshot-class.png){: style="margin: 0 auto; display: block;" }

Avec des méthodes comme celle-ci :

![Method delete AWS S3]({{ site.baseurl }}/assets/2019-10-30-reprenez-le-controle-de-vos-file-system-avec-flysystem/screenshot-method.png){: style="margin: 0 auto; display: block;" }

Ca fait du code à maintenir et si un jour on l’on doit changer de solution de stockage l’on peut avoir des problématiques de compatibilité.

 # Voici la solution que je vous propose

La solution est donc d'utiliser une librairie qui vas faire le travail pour vous, Flysystem. 
[Flysystem](https://flysystem.thephpleague.com/docs/) développer par [thephpleague](https://thephpleague.com/fr/), un groupe de développer de bibliothèques PHP. *Flysystem* est une bibliothèque d'abstraction du système de fichier. 
Cela permet donc de changer du solution de système de fichier rapidement et facilement. 
Vous pouvez l’utiliser dans une application PHP avec ou sans framework.

Flysystem fourni une API permettant de gérer vos ressources sur un grand nombre de système de fichier. D’office, la librairie fournit trois adaptateurs de système de fichier, FTP, Local et NullAdapter. Mais rien ne vous empêche d’ajouter d’autre adaptateur de système de fichier, d'ailleurs il en existe un grand nombre.
 
Voici la liste des adaptateurs développés par The PHP league :

AWS S3 V2 et V3
Azure Blob Storage
Menory
PHPCR
Rackspace Cloud Files
SFTP
WebDAV
Zip

Et quelque uns des adaptateurs développer par la communauté :

Azure File Storage
Cloudinary
Dropbox
Gaufrette
GitLab
Google Cloud Storage
Google Drive
OneDrive
PDO Database
SSH/Shell
...

Vous pouvez retrouver la liste complète sur [le README du dépôt officiel](https://github.com/thephpleague/flysystem). Si par malheur vous ne trouvez pas votre bonheur parmi la liste proposée vous pouvez développer le vôtre. Voici le lien pour [créer un adaptateur](https://flysystem.thephpleague.com/docs/advanced/creating-an-adapter/) car je n’en parlerait pas ici.  

# Flysystem pour permuter de système de fichier

Je vais vous montrer un exemple de permutation de système de fichier avec Flysystem dans une application Symfony 4.

Dans un premier temps il faut déjà configurer un système de fichier avec Flysystem. Pour ce faire nous allons installer le bundle avec composer comme ceci `composer require league/flysystem-bundle`, puis on édite la configuration de Flysystem dans le fichier `config/packages/flysystem.yaml` avec ces quelques lignes :

```yaml
flysystem:
  storages: 
    default.storage:
      adapter: 'local'
      options:
        directory: '%kernel.project_dir%/var/storage'
```

Ici on peut voir que l’on configure un file system qui ce nome `default.storage`, utilisant l’adaptateur `local` et qu’il y a une option qui cible le répertoire ou seront stockés les ressources: `directory: '%kernel.project_dir%/var/storage'`.

Jusqu'ici rien de compliqué. Mais maintenant on change de système de fichier pour passer sur une solution de stockage sur AWS S3. Pour ce faire nous allons dans un premier temps [créer un Bucket dans la console AWS](https://docs.aws.amazon.com/fr_fr/AmazonS3/latest/user-guide/create-bucket.html). Puis, nous installons l'adaptateur Flysystem AWS S3 via composer comme ceci `composer require league/flysystem-aws-s3-v3`.
Ensuite nous configurons notre client AWS :

```yaml
services:
# ...
  Aws\S3\S3Client:
    arguments:
        - version: 'latest'
          region: '%env(string:AWS_REGION)%'
          credentials:
            key: '%env(string:AWS_CREDENTIALS_KEY)%'
            secret: '%env(string:AWS_CREDENTIALS_SECRET)%'
          S3:
            version: "2006-03-01"
```

Il faudra récupérer des `credentials` sur la console AWS pour ça je vous laisse regarder la [documentation officiel sur AWS](https://docs.aws.amazon.com/fr_fr/cli/latest/userguide/cli-chap-configure.html).

Une fois le client configurer, il nous reste à permuter de système de fichier. On retourne dans `config/packages/flysystem.yaml` et modifie quelques lignes comme ceci :

```yaml
flysystem:
  storages:
    default.storage:
      adapter: 'aws'
      options:
        client: Aws\S3\S3Client
        bucket: '%env(string:AWS_BUCKET)%'
```

Et voilà on viens de changer de système de fichier juste en changeant la valeur de l’adaptateur de `local` à `aws` et en modifiant les options pour spécifier le client et le bucket à utiliser.


# Flysystem pour utiliser plusieurs system de fichier

On a vu comment permuter facilement de système de fichier, maintenant nous allons voir comment configurer plusieurs système de fichier. Je vais vous faire un exemple de configuration avec trois solution de stockage. Un système de fichier locale et deux solution cloud (AWS et GCP). 

La première étage va être d’installer le bundle et l'adaptateur pour AWS S3 , ainsi que l'adaptateur pour Google Storage. `composer require league/flysystem-bundle league/flysystem-aws-s3-v3 superbalist/flysystem-google-storage`.

Maintenant nous allons configurer les clients AWS et GCP. Pour AWS pas de changement, il faire ce que l’on a fait pour la permutation. 
Pour GCP, il faut [créer un storage](https://cloud.google.com/storage/docs/creating-buckets?hl=fr) et récupère un [fichier json d’authentification ](https://cloud.google.com/video-intelligence/docs/common/auth?hl=fr#set_up_a_service_account).

Une fois que l’on a configurer le Bucket AWS S3 ainsi que le Storage Google et que l’on a récupérer les information de connection il nous avous plus qu'à configurer les clients comme ceci :

```yaml
# config/services.yaml
services :
# …

  Google\Cloud\Storage\StorageClient:
    arguments:
      - keyFilePath: '%env(string:GCP_AUTH_FILE)%' #fichier json contenant les information de connection

  Aws\S3\S3Client:
    arguments:
        - version: 'latest'
          region: '%env(string:AWS_REGION)%'
          credentials:
            key: '%env(string:AWS_CREDENTIALS_KEY)%'
            secret: '%env(AWS_CREDENTIALS_SECRET)%'
          S3:
            version: "2006-03-01"
```

Maintenant on va configurer nos système de fichier :

```yaml
flysystem:
    local.storage:
      adapter: 'local'
      options:
        directory: '%kernel.project_dir%/var/storage'

    gcp.storage:
      adapter: 'gcloud'
      options:
        client: Google\Cloud\Storage\StorageClient
        bucket: '%env(string:GCP_BUCKET)%'
        api_url: 'https://storage.googleapis.com'

    aws.storage:
      adapter: 'aws'
      options:
        client: Aws\S3\S3Client
        bucket: '%env(string:AWS_BUCKET)%'
```

Alors dans c’est exemple je nomme mes systèmes de fichier par rapport à leurs adaptateur mais vous pouvez les nommer par rapport à leur utilité exemple :

```yaml
flysystem:
    assets.storage:
      adapter: 'local'
      # ...

    invoice.storage:
      adapter: 'gcloud'
      # ...

    media.storage:
      adapter: 'aws'
      # ...
``` 

Et voilà pour la configuration de plusieurs système de fichier.

# La configuration ça va deux minutes

Nous avons vu comment permuter de système de fichier juste avec quelque lignes de configuration, mais aussi comment configurer plusieurs système de fichier.
Maintenant nous allons voir comment utiliser nos système de fichier. [l’API Flysystem](https://flysystem.thephpleague.com/docs/usage/filesystem-api/) nous offre plusieurs méthode pour manipuler des resources. Voici la liste des méthodes 

- write
- writeStream
- update
- updateStream
- put
- putStream
- read
- readStream
- has
- delete
- readAndDelete
- rename
- copy
- getMimetype
- getTimestamp
- getSize
- createDir
- deleteDir
- listContents
- setVisibility
- addPlugin

Vous pouvez remarquer que certaine méthodes sont suffixées par `Stream`, cela signifie manipuler un fichier en tant que [ressource](https://www.php.net/manual/en/language.types.resource.php). Dans le cas contraire vous manipuler un fichier sous forme de chaîne de caractère. 

Flysystem met un peu de magie dans l’utilisation des systèmes de fichier. Quand vous déclarer un système de fichier vous créer un clé comme ceci `local.storage`. Cette clé va nous permettre d’injecter le système de fichier dans nos services, controllers ou autres comme ceci `FilesystemInterface $localStorage`.

Voici un petit exemple dans un controller qui utilise le système de fichier ayant pour clé `local.storage`  :

```php
<?php

declare(strict_types=1);

namespace App\Controller;

use League\Flysystem\FilesystemInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends AbstractController
{
    public function index(FilesystemInterface $localStorage): Response
    {
        return $this->render('Default/index.html.twig', ['files' => $localStorage->listContents()]);
    }
}
```

Dans cette exemple on liste les fichiers du système de fichier local. 

Un autre exemple d’utilisation, l’écriture d’une ressource dans un système de fichier.  

```php
// Écriture sur le système de fichier local avec un fichier sous forme de chaîne de caractère
$localStorage->wirte($path, $content);

// Écriture sur le Storage Google avec un resource avec un fichier sous forme de ressource. En plus on gère la visibilité du fichier.
$gcpStorage->wirteStream($path, $resource, ['visibility' => AdapterInterface::VISIBILITY_PRIVATE]);
``

Un autre exemple d’utilisation. Le déplacement d’un fichier d’un système de fichier à un autre système de fichier. Pour ce faire nous aurons besoin d’utiliser le `MountManager` de Flysystem.

Le `MountManager` permet de faire des manipulation dans plusieurs système de fichier préalablement renseigner. Il suffira uniquement de préfixé le paramètre `path` avec le nom du système de fichier à utiliser.

Voici l’exemple pour déplacer un fichier d’un système de fichier local vers un Storage Google :

```php
// …
public function copToGcp(FilesystemInterface $localStorage, FilesystemInterface $gcpStorage)
    {
         $mountManager = new MountManager();
         $mountManager->mountFilesystems([
             'local' => $localStorage,
             'gcp' => $gcpStorage,
         ]);

         $mountManager->move('local://my_file.txt', 'gcp://mysdirectory/my_file_to_gcp.txt');
    }

// ...
```

Vous pouvez voir que l’on assigne un clé au système de fichier renseigner au `MountManager` comme ceci `'local' => $localStorage`. Ensuite, pour spécifier le système de fichier on prefix le `path` par la clé de précédemment défini `local://my_file.txt`.

## Un plugin pour customiser vos actions

Dernier exemple d’utilisation pour cette article. Dans la liste des méthode vous avez peut être vu cette méthode `addPlugin`. Flysystem nous permet de créer nos plugins pour avoir nos propre méthode.

Nous allons prendre la problématique suivante :
> Dans un système de gestion de facture nous voulons que lorsque l’on sauvegarde une facture elle soit placé dans un répertoire à la date du jour dans ce format `Y-m-d`. 
> Et que la facture soit renommer avec son `id` et l’heure de l’enregistrement dans ce format `H-m-s`. 

Voilà comment procéder : 

1. Configuration du système de fichier 

```yaml 
# config/packages/flysystem.yaml
flysystem:
  storages:
    invoice.storage:
      adapter: 'local'
      options:
        directory: '%kernel.project_dir%/var/storage/invoice'
```

2. Créer du plugin

```php
<?php

declare(strict_types=1);

namespace App\FlysystemPlugins;

use League\Flysystem\FilesystemInterface;
use League\Flysystem\PluginInterface;

class invoicePlugin implements PluginInterface
{
    /** @var FilesystemInterface */
    protected $filesystem;

    public function setFilesystem(FilesystemInterface $filesystem): void
    {
        $this->filesystem = $filesystem;
    }

    public function getMethod(): string
    {
        return 'saveInvoice';
    }

    public function handle(int $id, string $content)
    {
        $now = new \DateTimeImmutable();
        $this->filesystem->write(
            sprintf('%s/%d-%s', $now->format('Y-m-d'), $id, $now->format('H-i-s')),
            $content
        );
    }
}
```

3. L’utiliser du plugin (Attention ici il y a du fake il faut réadapter pour une vraie utilisation)

```php
    public function saveInvoice(FilesystemInterface $defaultStorage, FilesystemInterface $invoiceStorage)
    {
        $invoice = $defaultStorage->read('invoice.txt');

        $invoiceStorage->addPlugin(new invoicePlugin());
        $invoiceStorage->saveInvoice($id, $invoice);
    }
```

4. Voir le résultat :


![result plugin Flysystem]({{ site.baseurl }}/assets/2019-10-30-reprenez-le-controle-de-vos-file-system-avec-flysystem/screenshot-result-plugin.png){: style="margin: 0 auto; display: block;" }

Et voilà pour ce dernier exemple.

# En conclusion

Pour conclure, Flysystem est une librairie complète qui va vous permettre de simplifier votre code et de diminuer le temps de développement. 
En plus, vous n’aurait plus de problème en cas de changement de solution de système de fichier au cas où votre nouveau CTO n’aime pas AWS ou qu’il y ai une réduction budgétaire et vous devenez repasser en locale sur vos bon vieux serveur.

Et comme on l’a vu en fin d’article vous pouvais avoir des méthodes qui sont propre à votre métier sans à devoir surcharger des classes. Bon après si vous avez des modifications ou ajouts qui pourrait être utile n'hésitez pas à soumettre une PR sur le [dépôt du projet](https://github.com/thephpleague/flysystem).

Si vous le souhaitez vous pouvez aller consulter [les autres projet de The PHP league](https://thephpleague.com/fr/#nos-biblioth%C3%A8ques). 

J'espère que cette article vous a plus et à la prochaine pour un prochain article.

