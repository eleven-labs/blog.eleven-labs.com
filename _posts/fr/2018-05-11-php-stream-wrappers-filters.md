--- 
layout: post  
title: PHP Stream, Wrappers, Filters, un allié méconnu.   
lang: fr  
permalink: /fr/php-stream-wrappers-filters/  
excerpt: "Bien que très puissant et présent dans PHP depuis la version 4.3, ce composant est souvent méconnu, sous exploité, voire mal utilisé."  
authors:  
    - amoutte  
categories:
    - php
    - stream 
    - flux
    - protocol  
    - wrappers
    - transports
    - filters
tags:
    - php
    - stream 
    - flux
    - protocol  
    - wrappers
    - transports
    - filters
cover: /assets/2018-05-11-php-stream-wrappers-filters/cover.jpg  
--- 

## Définition

La définition du [manuel](http://php.net/intro.stream) étant déjà très claire, je me contente simplement de vous la partager. 
> La gestion des flux a été introduit en PHP 4.3.0. comme méthode de généralisation des fichiers, sockets, connexions réseau, données compressées et autres opérations du même type, qui partagent des opérations communes. Dans sa définition la plus simple, un flux est une ressource qui présente des capacités de flux : c'est-à-dire que ces objets peuvent être lus ou recevoir des écritures de manière linéaire, et dispose aussi de moyen d'accéder à des positions arbitraires dans le flux.

## Protocoles

Un protocole est une spécification de plusieurs règles pour un type de communication. Il peu également être utile pour vérifier que les informations soit correctement reçues.

> Dans une conversation téléphonique quand l'interlocuteur décroche il commence par dire "Allô" afin de spécifier qu'il est prêt à recevoir des informations.

La référence d'un flux (style URL) s'écrit de la forme `scheme://target`.

> Donc oui `https://blog.eleven-labs.com/` peu être ouvert comme un flux qui pointe vers une ressource distante.

### Wrappers

Dans le contexte présent un `wrapper` est un gestionnaire de protocole (de style URL).

Voici la liste des `scheme` ([wrappers](http://php.net/wrappers)) supportés par PHP :

- [file://](http://php.net/manual/fr/wrappers.file.php)  — Accès au système de fichiers local
- [http://](http://php.net/manual/fr/wrappers.http.php)  — Accès aux URLs HTTP(s)
- [ftp://](http://php.net/manual/fr/wrappers.ftp.php)  — Accès aux URLs FTP(s)
- [php://](http://php.net/manual/fr/wrappers.php.php)  — Accès aux divers flux I/O
- [data://](http://php.net/manual/fr/wrappers.data.php)  — Données (RFC 2397)
- [glob://](http://php.net/manual/fr/wrappers.glob.php)  — Trouve des noms de fichiers correspondant à un masque donné
- [phar://](http://php.net/manual/fr/wrappers.phar.php)  — Archive PHP (PHP >= 5.3.0)
- [zlib://](http://php.net/manual/fr/wrappers.compression.php)  — Flux de compression **(requiert un extension pour zip://)**
- [ssh2://](http://php.net/manual/fr/wrappers.ssh2.php)  — Shell sécurisé 2 **(requiert l'extension SSH2)**
- [rar://](http://php.net/manual/fr/wrappers.rar.php)  — RAR **(requiert l'extension RAR)**
- [ogg://](http://php.net/manual/fr/wrappers.audio.php)  — Flux Audio **(requiert l'extension OGG/Vorbis)**
- [expect://](http://php.net/manual/fr/wrappers.expect.php)  — Flux d'interactions de processus **(requiert l'extension Expect)**

Utiliser `stream_get_wrappers()` pour avoir la liste des protocoles supportés par votre serveur.
```php
var_dump(stream_get_wrappers());
```

### Transports

Un [transport](http://php.net/transports) en PHP ce n'est ni plus ni moins qu'un moyen de transférer des données. Pour cela PHP utilise les `sockets`.

ℹ️ Il ne faut pas oublier que les `sockets` sont aussi des flux 😜.

**Sockets type WEB**
- tcp:// ([Transmission Control Protocol](https://fr.wikipedia.org/wiki/Transmission_Control_Protocol))
- udp:// ([User Datagram Protocol](https://fr.wikipedia.org/wiki/User_Datagram_Protocol))
- ssl:// (négociation automatique entre ssl v2/v3) (sslv2://, sslv3:// depuis PHP 5.0.2) **(requiert OpenSSL)**
- tls:// **(requiert OpenSSL)**

Utiliser `stream_get_transports()` pour avoir la liste des protocoles de transport supportés par votre serveur.
```php
var_dump(stream_get_transports());
```
> A noter que les paths des `sockets` web s'écrivent sous la forme
> `{PROTOCOL}://{DOMAIN / IP v4, v6}:{PORT}`

Voici plusieurs exemples :
-   _127.0.0.1_
-   _fe80::1_
-   _www.example.com_
-   _tcp://127.0.0.1_
-   _tcp://fe80::1_
-   _tcp://[fe80::1]:80_
-   _tcp://www.example.com_
-   _udp://www.example.com_
-   _ssl://www.example.com_
-   _sslv2://www.example.com_
-   _sslv3://www.example.com_
-   _tls://www.example.com_

**Sockets type UNIX**
- unix:// (fournit l'accès à un flux de type socket, sur un domaine Unix)
- udg:// (fournit un mode de transport alternatif, avec un protocole de datagrammes utilisateur)

----

Voila un petit tour d'horizon des différents protocoles que PHP met nativement, ou par extensions, à votre disposition.

**👨‍🚀 Il est également possible de créer sont propre `wrapper`, afin d'encapsuler la logique de transmission des données !**

Comme par exemple :

- [s3://](https://docs.aws.amazon.com/aws-sdk-php/v2/guide/feature-s3-stream-wrapper.html) donne accès à votre storage AWS
- [git://](https://github.com/teqneers/PHP-Stream-Wrapper-for-Git#using-the-streamwrapper) permet d'intéragir avec git
- [hoa://](https://github.com/hoaproject/Protocol) permet d'accéder aux différentes informations managées par HOA

### Contexte de flux

Les contextes de flux sont une autre notion importante de la gestion des flux. Le contexte est un ensemble d'options qui sera passé en argument aux diverses fonctions de traitements de flux (ex: `stream_*`, `fopen`, `copy`, `file_get_contents`...).

```php
$context = stream_context_create(
    [
        'http' => [
            'protocol_version' => '1.1', 
            'timeout' => 10, 
            'user_agent' => 'Wilson Browser', 
            'method' => 'GET',
        ],
    ],
    []
);

$result = file_get_contents('http://../page', false, $context);
```
> La requête générée pour récupérer la page sera donc en `GET HTTP 1.1` avec un user agent `Wilson Browser` et un timeout à 10 secondes.

Vous pouvez également utiliser `stream_context_set_default` afin de configurer les options par défaut des gestionnaires de flux.

```php
stream_context_set_default([
    'http' => [
        'timeout' => 10, 
        'user_agent' => 'Wilson Browser',
    ],
    'ftp' => [...]
]);
```
> ⚠️ Attention à l'utilisation de cette dernière, car elle configure les options de toutes les requêtes HTTP faites par la couche de flux de PHP.

### Filtres

Une autre partie assez intéressante des flux étant la possibilité d'ajouter des fonctions de [filtre](http://php.net/filters) sur les données qui transiteront dans le flux.

- _string.rot13_
- _string.toupper_
- _string.tolower_
- _string.strip_tags_ **(depuis PHP 5)**
- _convert.base64-encode_ - _convert.base64-decode_
- _convert.quoted-printable-encode_ - _convert.quoted-printable-decode_
- _zlib.deflate_ (compression) (PHP >= _5_ si le support [zlib](http://php.net/manual/fr/ref.zlib.php) est activé)
- _zlib.inflate_ (decompression) (PHP >= _5_ si le support [zlib](http://php.net/manual/fr/ref.zlib.php) est activé)
- _bzip2.compress (PHP >= _5_ si le support [bz2](http://php.net/manual/fr/ref.bzip2.php) est activé)
- _bzip2.decompress_ (PHP >= _5_ si le support [bz2](http://php.net/manual/fr/ref.bzip2.php) est activé)
- _mcrypt.*_ (❌ **_OBSOLETE_ depuis PHP 7.1.0. Nous vous encourageons vivement à ne plus l'utiliser.**)
- _mdecrypt.*_ (❌ **_OBSOLETE_ depuis PHP 7.1.0. Nous vous encourageons vivement à ne plus l'utiliser.**)

Utiliser `stream_get_filters()` pour avoir la liste des filtres supportés par votre serveur.
```php
var_dump(stream_get_filters());
```

Il existe 2 syntaxes pour configurer un filtre sur un flux.

L'utilisation de `stream_filter_append`/`stream_filter_prepend`.
```php
$fp = fopen('php://output', 'w');
stream_filter_append($fp, 'string.toupper', STREAM_FILTER_WRITE);
fwrite($fp, "Code de lancement: 151215");
fclose($fp);
```
[`Exécuter le php`](https://3v4l.org/VV6FG)

Grâce au flux `php://filter`
```php
file_put_contents('php://filter/string.toupper/resource=php://output', 'Code de lancement: 151215');
```
[`Exécuter le php`](https://3v4l.org/4nggb)
> Les 2 exemples ci-dessus vont afficher `CODE DE LANCEMENT: 151215`

**👨‍🚀 Là aussi il est possible de créer sont propre `filter` grâce à [php_user_filter](http://php.net/php_user_filter) !**

Voici un petit filtre geek.

```php
class l33t_filter extends php_user_filter {  
    function filter($in, $out, &$consumed, $closing)  
    {
        $common = ["a", "e", "s", "S", "A", "o", "O", "t", "l", "ph", "y", "H", "W", "M", "D", "V", "x"];
        $leet = ["4", "3", "z", "Z", "4", "0", "0", "+", "1", "f", "j", "|-|", "\\/\\/", "|\\/|", "|)", "\\/", "><"];  
  
        while ($bucket = stream_bucket_make_writeable($in)) {  
            $bucket->data = str_replace($common, $leet, $bucket->data);  
            $consumed += $bucket->datalen;  
            stream_bucket_append($out, $bucket);  
        }  
        return PSFS_PASS_ON;  
    }
}
stream_filter_register('l33t_filter', 'l33t_filter') or die('Failed to register filter Markdown');

file_put_contents('php://filter/l33t_filter/resource=php://output', 'Salut ça va?');
```
[`Exécuter le php`](https://3v4l.org/Zpgr8)

> L'exemple du dessus convertira `Salut ça va?` en `Z41u+ ç4 v4?`

On peu imaginer des filtres html>markdown,  un emoji converter, un dictionnaire de mot blacklistés, etc.

## Les flux I/O

PHP met également à notre disposition des flux d'`Input`/`Output`. 

### php://stdin 
C'est le flux d'entrée standard (ligne de commande)
> ℹ️ stdin: est en lecture seule

Exemple
```php
//index.php
copy(  
    'php://stdin',  
    'php://filter/string.toupper/resource=php://stdout'
);
```
La commande ci-dessous écrira `string` dans le flux `stdin` et ici on copie simplement ce que l'on reçois dans la sortie standard après avoir appliqué un filtre `toupper`.
```bash
$ echo 'string' | php index.php #affichera STRING
$ cat file.txt | php index.php #affichera le contenu du fichier en majuscule
```

### php://stdout et php://stderr
Sont les flux de sortie standard (ligne de commande)
> ℹ️ stdin: est en lecture seule

Exemple
```php
//error.php
error_reporting(E_ALL);
ini_set("display_errors", 0);  
echo 'Hello '.$_GET['user'];
```
Avec ce script nous allons reporter toutes les erreurs (E_ALL) mais ne pas les afficher aux visiteurs.

Dans un navigateur web ce script affichera :
```
Hello
```
Et les erreurs seront dirigées vers le flux `php://stderr` qui est bien souvent configuré par votre file handler (nginx/apache...) grâce au paramètre [error_log](http://php.net/error-log).

👨‍🚀 **En ligne de commande `php://output` `php://stderr` sont par défaut envoyer dans `php://stdout`**

Lançons ce script avec la commande suivante :
```bash
$ php error.php
```
Ce qui donnera :
```
PHP Notice:  Undefined index: user in /var/www/error.php on line 5
PHP Stack trace:
PHP   1. {main}() /var/www/error.php:0
Hello %
```
**Utilisons maintenant la redirection de flux GNU/Linux**
```bash
$ php error.php > out.txt
```
la console affichera :
```
PHP Notice:  Undefined index: user in /var/www/error.php on line 5
PHP Stack trace:
PHP   1. {main}() /var/www/error.php:0
```
tandis que le fichier `out.txt` contiendra :
```
Hello
```

**Mais on peu également rediriger la sortie d'erreur**
```bash
$ php error.php 2> errors.txt
```
la console affichera :

```
Hello
```
tandis que le fichier `errors.txt` contiendra :
```
PHP Notice:  Undefined index: user in /var/www/error.php on line 5
PHP Stack trace:
PHP   1. {main}() /var/www/error.php:0
```
ℹ️ On peu également combiner les 2 `php error.php > out.txt 2> errors.txt`
> `>` et `2>` écrase le fichier ou le créé.
> `>>` et `2>>` écrit à la fin du fichier ou le créé.
> `2>&1` et `2>>&1` redirige les 2 flux (avec le même comportement pour `>` et `>>`)

### php://input
Permet de lire les données brutes du corps de la requête.
> ⚠️ N'est pas disponible avec _enctype="multipart/form-data"_.

### php://output
Permet d'écrire dans le buffer de sortie de la même façon que `print` `echo`.
```php
// les 2 écritures suivantes feront la même chose
file_put_contents('php://output', 'Some data');
echo 'Some data';
```
N'oubliez pas qu'avec `php://output` vous pouvez utiliser les filtres, le contexte et même pourquoi pas réécrire au début.

### php://temp et php://memory
Permet d'écrire dans un gestionnaire de fichiers. `php://memory` stockera toujours en mémoire tandis que `php://temp` stockeras en mémoire, puis sur disque après avoir attends la limite prédéfinie (défaut 2Mo)
> 👨‍🚀 `php://temp/maxmemory:200` stockera sur disque une fois que 200 octets seront écrit dans le flux.

### php://filter
Permet d'ajouter un filtre lors de l'ouverture d'un autre flux.
Exemple :
```php
// Applique un filtre lors de la lecture
file_get_contents('php://filter/read=string.rot13/resource=example.txt');

// Applique un filtre lors de l'écriture
file_put_contents('php://filter/write=string.rot13/resource=example.txt', 'new data');

// Applique le filtre lors de l'écriture mais aussi lors de la lecture
$res = fopen('php://filter/string.rot13/resource=example.txt', 'w+');
```

### php://fd

N'ayant pas trouvé d'informations utiles je vous laisse consulter la [documentation](http://php.net/wrappers-php#refsect2-wrappers.php-unknown-unknown-unknown-unknown-descriptior)

## Quelques cas d'utilisation

Prenons l'exemple d'une copie de fichier :
```php
$file = file_get_contents('http://.../textfile.txt');
file_put_contents(__DIR__.'/downloaded_textfile.txt', $file);
```
⚠️ Avec ce code nous allons télécharger **entièrement** le fichier `textfile.txt` dans la mémoire avant de l'écrire dans le fichier de destination !

Maintenant si l'on change légèrement le code on obtient :

DO
```php
copy(
    'http://.../textfile.txt', 
    __DIR__.'/downloaded_textfile.txt'
);
```
ℹ️ On peu faire le même traitement avec des ressources :

```php
stream_copy_to_stream(
    fopen('http://.../textfile.txt', 'r'), 
    fopen(__DIR__.'/downloaded_textfile.txt', 'w+')
);
```
Voici la consommation mémoire pour un fichier de 5Mo.

| Code  | memory_get_usage(true) | memory_get_peak_usage(true) |
|--|--|--|
| file_get_content | 8Mo | 13Mo |
| copy | 2Mo | 2Mo |
|stream_copy_to_stream|2Mo|2Mo|

La différence de consommation mémoire est due au fait que `copy` et `stream_copy_to_stream` vont  directement écrire la source dans la destination.

👨‍🚀 N'hésitez pas à utiliser les `wrappers`/`transports` cités au début de l'article.

---
```php
copy(
    'http://.../image.jpg', 
    'ssh2.scp://user:pass@server:22/home/download/image.jpg'
);
```
> Copie le fichier depuis le web sur un serveur en utilisant `scp` via `ssh`.

---

Un autre exemple fréquemment rencontré lors de la création de fichier temporaire :

```php
$tmpFile = tempnam(sys_get_temp_dir(), 'php' . rand());
```
⚠️ Ici le script va créé un **fichier** dans le **dossier temporaire** de php. 
- Ce qui veut dire qu'il vous faudra supprimer vous-même ce fichier.
- La fonction `tempnam()` retourne le `path` et non la ressource.

👨‍🚀 Préférez donc l'utilisation de :
- `php://temp` ou `php://temp/maxmemory:100` qui stockera en mémoire puis sur disque une fois la limite atteinte.
- `php://memory` stocker en mémoire
- `tmpfile()` crée un fichier temporaire avec un nom unique, ouvert en écriture et lecture (_w+_), et retourne un pointeur de fichier.

```php
$tmp = fopen('php://temp', 'w+');
```

Ce fichier sera automatiquement effacé :
- lorsqu'il sera fermé.
- lorsqu'il n'y a plus de référence au gestionnaire de fichiers.
- lorsque le script sera terminé.

## Conclusion
Bien que très puissant et présent dans PHP depuis la version 4.3, ce composant est souvent méconnu, sous exploité, voir mal utilisé. C'est pourquoi j'en fais la promotion ici, et, j'espère avoir suscité un élan d'intérêt pour ce composant. 

📝 **Je n'ai volontairement pas abordé les flux de type `socket` car, ils mériteraient un article à eux seul.**

## Liens utiles
- 👍 https://www.youtube.com/watch?v=3tOGhPj8IcA
- http://php.net/stream
- http://php.net/context
- http://php.net/wrappers
- https://github.com/reactphp/react
