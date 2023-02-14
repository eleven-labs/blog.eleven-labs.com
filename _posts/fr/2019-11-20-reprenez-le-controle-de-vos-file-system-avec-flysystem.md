---
layout: post
lang: fr
date: '2019-11-20'
categories:
  - php
authors:
  - nicolas
excerpt: >-
  Cet article vous présente comment interagir simplement avec vos systèmes de
  gestion de fichiers grâce à Flysystem.
title: Reprenez le contrôle de vos filesystem avec Flysystem
slug: reprenez-le-controle-de-vos-file-system-avec-Flysystem
oldCategoriesAndTags:
  - php
  - bundle
  - filesystem
  - symfony
  - flysystem
permalink: /fr/reprenez-le-controle-de-vos-file-system-avec-Flysystem/
---


La gestion d’un ou plusieurs systèmes de fichiers dans une application PHP peut s’avérer compliqué, même si de prime abord il semble simple de manipuler des fichiers en local grâce aux fonctions natives. Si l'on regarde [la documentation officielle](https://www.php.net/manual/en/ref.filesystem.php) on peut faire un sytème rapidement comme ceci :

```php
public function write(string $content, string $path): void
{
    if (file_exists($path)) {
      // throw exception
    }

    file_put_contents($path, $content);
}
```

C'est donc faisable, mais le jour où vous allez migrer sur un système de fichiers distant comme AWS, vous allez devoir tout recommencer. Il vous faudra installer le SDK AWS, le configurer puis re-développer votre fonction comme ceci :

```php
use AWS\S3\S3Client

private s3Client;

public function __construct()
{
    $options = [
        'region' => 'us-west-2',
        'version' => '2006-03-01',
        'signature_version' => 'v4',
    ];

    $this->s3Client = new Aws\S3\S3Client([
        'region' => '-- your region --',
        'version' => 'latest',
        'credentials' => [
            'key' => "-- access key id --",
            'secret' => "-- secret access key --",
        ],
    ]);
}


public function write(string $content, string $path)
{
    $this->s3Client->putObject([
        'Bucket' => '-- bucket name --',
        'Key' => $path,
        'Body' => $content,
    ]);
}
```

Et si demain on vous demande de passer sur Google Cloud Storage ou bien de gérer une multitude de systèmes de fichiers ? Cela va être lourd à écrire et à maintenir, sans parler des tests d'intégration...

Pour supporter plusieurs systèmes de fichiers on peut éventuellement mettre en œuvre le patron de conception [Adaptateur](https://fr.wikipedia.org/wiki/Adaptateur_(patron_de_conception)) ce qui nous permettrait d'abstraire les opérations sur les fichiers et de supporter plusieurs implémentations.

Le patron de conception `Adaptateur` permet de convertir l’interface d’une classe en une autre interface attendue par notre système. Cela permet d'adapter des classes dont nous ne maîtrisons pas la signature.

Si l’on prend le cas de notre système de gestion de système de fichiers qui doit utiliser plusieurs clients ou librairies différentes (AWS, SFTP, fonction native, etc...) alors nous pouvons faire comme ceci :

- On crée une classe que l’on va instancier pour manipuler nos fichiers

```php
class FileSystem
{
    /** @var AdapterInterface */
    private $adapter;

    public function __construct(AdapterInterface $adapter)
    {
        $this->adapter = $adapter;
    }

    public function write(string $path, string $content, array $config): bool
    {
        return $this->adapter->write($path, $content, $config);
    }
}
```

- Puis, on crée une interface qui va définir les méthodes qui devront être implémentées dans notre adaptateur :

```php
interface AdapterInterface
{
    public function write(string $path, string $content, array $config): bool;
}
```

- Enfin, on crée nos _**n**_ adaptateurs :

```php
class LocalAdapter implements AdapterInterface
{
    public function write(string $path, string $content, array $config): bool
    {
        print_r("write with local adapter\n");

        return true;
    }
}


class AWSAdapter implements AdapterInterface
{
    private s3Client;

    public function __construct()
    {
        $options = [
            'region' => 'us-west-2',
            'version' => '2006-03-01',
            'signature_version' => 'v4',
        ];

        $this->s3Client = new Aws\S3\S3Client([
            'region' => '-- your region --',
            'version' => 'latest',
            'credentials' => [
                'key' => "-- access key id --",
                'secret' => "-- secret access key --",
            ],
        ]);
    }

    public function write(string $path, string $content, array $config): bool
    {
        print_r("write with aws adapter\n");

        return true;
    }
}
```

Et voilà !

Si on teste notre code ça donne ceci :

```php
$localAdapter = new LocalAdapter();
$localFileSystem = new FileSystem($localAdapter);
$localFileSystem->write('', '', []);

$awsAdapter = new AWSAdapter();
$awsFileSystem = new FileSystem($awsAdapter);
$awsFileSystem->write('', '', []);
```

```bash
$ php index.php
write with local adapter
write with aws adapter
```

Nous avons créé une abstraction pour manipuler un système de fichiers puis nous avons adapté les interfaces de chacune des librairies que l'on souhaitait utiliser.

Mais bon, on doit encore maintenir du code. Heureusement pour nous, il existe déjà une librairie qui s'en charge.

Je vous présente la librairie [Flysystem](https://flysystem.thephpleague.com/docs/), développée par [thephpleague](https://thephpleague.com/fr/), un groupe de développeurs de bibliothèques PHP. *Flysystem* est une bibliothèque d'abstraction du système de fichiers.
Cela permet donc de changer de solution de système de fichiers rapidement et facilement grâce au patron de conception `Adaptateur`.
Vous pouvez l’utiliser dans une application PHP avec ou sans framework.

Flysystem fournit une API permettant de gérer vos ressources sur un grand nombre de systèmes de fichiers. D’office, la librairie fournit trois adaptateurs de système de fichiers : FTP, Local, et NullAdapter. Mais rien ne vous empêche d’ajouter d’autres adaptateurs de système de fichiers, d'ailleurs, il en existe un grand nombre.

Vous pouvez retrouver la liste complète sur [le README du dépôt officiel](https://github.com/thephpleague/flysystem). Si par malheur vous ne trouvez pas votre bonheur parmi la liste proposée vous pouvez développer le vôtre. Voici le lien pour [créer un adaptateur](https://flysystem.thephpleague.com/docs/advanced/creating-an-adapter/) car je n’en parlerai pas ici.

## Permuter de système de fichiers avec Flysystem

Je vais vous montrer un exemple de permutation de système de fichiers avec Flysystem dans une application Symfony 4.

Dans un premier temps, il faut configurer un système de fichiers avec Flysystem. Pour ce faire, nous allons installer le bundle avec composer comme ceci : `composer require league/flysystem-bundle`, puis on édite la configuration de Flysystem dans le fichier `config/packages/flysystem.yaml` avec ces quelques lignes :

```yaml
flysystem:
  storages:
    default.storage:
      adapter: 'local'
      options:
        directory: '%kernel.project_dir%/var/storage'
```

Ici on peut voir que l’on configure un système de fichiers qui se nomme `default.storage`, utilisant l’adaptateur `local`, et qu’il y a une option qui cible le répertoire où seront stockés les ressources : `directory: '%kernel.project_dir%/var/storage'`.

Jusqu'ici rien de bien compliqué. Mais maintenant, on change de système de fichiers pour passer sur une solution de stockage sur AWS S3. Pour ce faire, nous allons dans un premier temps [créer un Bucket avec la console AWS](https://docs.aws.amazon.com/fr_fr/AmazonS3/latest/user-guide/create-bucket.html). Puis, nous installons l'adaptateur Flysystem AWS S3 via composer comme ceci `composer require league/flysystem-aws-s3-v3`.
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

Il faudra récupérer des `credentials` sur la console AWS, pour ce faire, je vous laisse consulter la [documentation officielle sur AWS](https://docs.aws.amazon.com/fr_fr/cli/latest/userguide/cli-chap-configure.html).

Une fois le client configuré, il nous reste à permuter de système de fichiers. On retourne dans `config/packages/flysystem.yaml` et on modifie quelques lignes comme ceci :

```yaml
flysystem:
  storages:
    default.storage:
      adapter: 'aws'
      options:
        client: Aws\S3\S3Client
        bucket: '%env(string:AWS_BUCKET)%'
```

Et voilà, on vient de changer de système de fichiers juste en changeant la valeur de l’adaptateur de `local` à `aws` et en modifiant les options pour spécifier le client et le bucket à utiliser.


##  Utiliser plusieurs systèmes de fichiers avec Flysystem

On a vu comment permuter facilement de système de fichiers, maintenant nous allons voir comment configurer plusieurs systèmes de fichiers. Je vais vous faire un exemple de configuration avec trois solutions de stockage. Un système de fichiers local et deux solutions cloud (AWS et GCP).

La première étape va consister à installer le bundle et l'adaptateur pour AWS S3, ainsi que l'adaptateur pour Google Storage. `composer require league/flysystem-bundle league/flysystem-aws-s3-v3 superbalist/flysystem-google-storage`.

Maintenant, nous allons configurer les clients AWS et GCP. Pour AWS pas de changement.
Pour GCP, il faut [créer un storage](https://cloud.google.com/storage/docs/creating-buckets?hl=fr) et récupérer un [fichier json d’authentification](https://cloud.google.com/video-intelligence/docs/common/auth?hl=fr#set_up_a_service_account).

Une fois que l’on a configuré le Bucket AWS S3 ainsi que le Storage Google et que l’on a récupéré les informations de connexion, il ne nous reste plus qu'à configurer les clients comme ceci :

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

Maintenant on va configurer nos systèmes de fichiers :

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

Alors, dans ces exemples, je nomme mes systèmes de fichiers en fonction du nom de l'adaptateur, mais vous pouvez les nommer en fonction de leur utilité, exemple :

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

Et voilà pour la configuration de plusieurs systèmes de fichiers.

## La configuration ça va deux minutes

Nous avons vu comment permuter de système de fichiers juste avec quelque lignes de configuration, mais aussi comment configurer plusieurs systèmes de fichiers.
Maintenant nous allons voir comment utiliser nos système de fichier. [l’API Flysystem](https://flysystem.thephpleague.com/docs/usage/filesystem-api/) nous offre plusieurs méthodes pour manipuler des ressources. Voici la liste des méthodes :

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

Vous pouvez remarquer que certaine méthodes sont suffixées par `Stream`. Cela signifie manipuler un fichier en tant que [ressource](https://www.php.net/manual/en/language.types.resource.php). Dans le cas contraire vous manipulez un fichier sous forme de chaîne de caractères.

Flysystem met un peu de magie dans l’utilisation des systèmes de fichiers. Quand vous déclarez un système de fichiers vous créez une clé comme ceci `local.storage`. Cette clé va nous permettre d’injecter le système de fichiers dans nos services, controllers ou autres, comme ceci `FilesystemInterface $localStorage`.

Voici un petit exemple dans un controller qui utilise le système de fichiers ayant pour clé `local.storage`  :

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

Dans cet exemple on liste les fichiers du système de fichiers local.

Un autre exemple d’utilisation, l’écriture d’une ressource dans un système de fichiers.

```php
// Écriture sur le système de fichiers local avec un fichier sous forme de chaîne de caractères
$localStorage->wirte($path, $content);

// Écriture sur le Storage Google avec un fichier sous forme de ressource. En plus on gère la visibilité du fichier.
$gcpStorage->wirteStream($path, $resource, ['visibility' => AdapterInterface::VISIBILITY_PRIVATE]);
```

Un autre exemple d’utilisation. Le déplacement d’un fichier d’un système de fichiers à un autre système de fichiers. Pour ce faire nous aurons besoin d’utiliser le `MountManager` de Flysystem.

Le `MountManager` permet de faire des manipulations dans plusieurs systèmes de fichiers préalablement renseignés. Il suffira uniquement de préfixer le paramètre `path` avec le nom du système de fichiers à utiliser.

Voici l’exemple pour déplacer un fichier d’un système de fichiers local vers un Storage Google :

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

Vous pouvez voir que l’on assigne une clé au système de fichiers renseigné au `MountManager` comme ceci `'local' => $localStorage`. Ensuite, pour spécifier le système de fichiers on préfixe le `path` par la clé précédemment définie `local://my_file.txt`.

## Un plugin pour personnaliser vos actions

Dernier exemple d’utilisation pour cet article. Dans la liste des méthodes vous avez peut être vu cette méthode `addPlugin`. Flysystem nous permet de créer nos plugins pour avoir nos propres méthodes.

Nous allons prendre la problématique suivante :
> Dans un système de gestion de factures nous voulons que lors de la sauvegarde d'une facture, cette dernière soit placée dans un répertoire à la date du jour dans ce format `Y-m-d`.
> Et que la facture soit renommée avec son `id` et l’heure de l’enregistrement dans ce format `H-m-s`.

Voilà comment procéder :

1/ Configuration du système de fichiers

```yaml
# config/packages/flysystem.yaml
flysystem:
  storages:
    invoice.storage:
      adapter: 'local'
      options:
        directory: '%kernel.project_dir%/var/storage/invoice'
```

2/ Création du plugin

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

3/ Exemple d'utilisation (Attention ici il y a du fake il faut réadapter pour une vraie utilisation)

```php
    public function saveInvoice(FilesystemInterface $defaultStorage, FilesystemInterface $invoiceStorage)
    {
        $invoice = $defaultStorage->read('invoice.txt');

        $invoiceStorage->addPlugin(new invoicePlugin());
        $invoiceStorage->saveInvoice($id, $invoice);
    }
```

4/ Voir le résultat :


![result plugin Flysystem]({{ site.baseurl }}/assets/2019-11-20-reprenez-le-controle-de-vos-file-system-avec-flysystem/screenshot-result-plugin.png){: style="margin: 0 auto; display: block;" }

Et voilà pour ce dernier exemple.

## Le mot de la fin

Flysystem est une librairie complète qui va vous permettre de simplifier votre code et de diminuer le temps de développement.
En plus, vous n’aurez plus de problèmes en cas de changement de solution du système de fichiers, au cas où votre nouveau CTO n’aime pas AWS, ou dans l'éventualité d'une réduction budgétaire vous obligeant à repasser en local sur vos bon vieux serveurs.

Et comme on l’a vu en fin d’article vous pouvez avoir des méthodes qui sont propres à votre métier sans avoir à surcharger des classes. Bon après si vous avez des modifications ou ajouts qui pourrait être utile n'hésitez pas à soumettre une PR sur le [dépôt du projet](https://github.com/thephpleague/flysystem).

Si vous le souhaitez vous pouvez aller consulter [les autres projet de The PHP league](https://thephpleague.com/fr/#nos-biblioth%C3%A8ques).

J'espère que cet article vous a plu, à la prochaine !

## Resources

- [php.net - filesystem](https://www.php.net/manual/en/ref.filesystem.php)
- [flysystem.thephpleague.com - docs](https://flysystem.thephpleague.com/docs/)
- [github.com - thephpleafue/flysystem](https://github.com/thephpleague/flysystem)
- [fr.wikipedia.org - patron de conception Adaptateur](https://fr.wikipedia.org/wiki/Adaptateur_(patron_de_conception))
- [developpez - Florian Casabianca - Comprendre le design Pattern Adaptateur](https://badger.developpez.com/tutoriels/dotnet/patterns/adaptateur/)
