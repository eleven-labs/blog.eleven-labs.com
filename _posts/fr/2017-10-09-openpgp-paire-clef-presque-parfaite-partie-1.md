---
layout: post
title: OpenPGP - Une paire de clés presque parfaite
excerpt: Guide sur la création de clés OpenPGP presque parfaites
authors:
    - tthuon
lang: fr
permalink: /fr/openpgp-paire-clef-presque-parfaite-partie-1/
categories:
    - openpgp
    - securite
tags:
    - openpgp
    - securite
cover: /assets/2017-10-09-openpgp-paire-clef-presque-parfaite-partie-1/cover.jpg
---

Dans cet article, je voudrais créer un petit guide sur la création d'une clé PGP parfaite. Pour ceux qui ne connaissent pas,
OpenPGP est un standard qui permet de chiffrer et déchiffrer des messages. À la différence d'une simple paire de clés RSA, le protocole
OpenPGP permet de créer une identité numérique qui est vérifiée par d'autres personnes et qui est décentralisée. Il n'y a aucune
autorité qui va contrôler l'identité. Ce sont les utilisateurs qui vont vérifier les autres personnes.

À travers un ensemble de 4 articles, nous allons aborder :
* La création de la paire de clés PGP
* Comment déporter le secret sur une carte à puce Yubikey
* Le stockage et la sauvegarde de la clé maître
* La participation à une fête de la signature des clés

### Installer les bon outils

Que vous soyez sur Linux, Mac ou Windows, tout pourra être fait en lignes de commande.

Tout d'abord, installons les outils :
* Windows:  [GPG4Win](https://www.gpg4win.org/){:rel="nofollow noreferrer"}
* Mac:  [GPGtools](https://gpgtools.org/){:rel="nofollow noreferrer"}
* Linux:  [gnupg.org](https://gnupg.org/download/) (déjà intégré dans Ubuntu par exemple){:rel="nofollow noreferrer"}

Pour cet article, je vais me baser sur Ubuntu 16.04 et GnuPG v2.1.11. Il s'agit de la nouvelle version moderne de gnupg qui va
remplacer la v1.4 et la v2.0.

Avant de lancer la création de la clé, il faut configurer gpg pour renforcer la sécurité.
Les premières lignes permettent de ne pas diffuser des informations sur la façon dont la clé a été créée.
Ensuite il y a la configuration d'OpenPGP pour afficher plus d'information lors du listage des clés. En fin de configuration, il y a des restrictions sur les algorithmes de chiffrement afin d'utiliser les meilleurs et les plus résistantes à ce jour.

Copier cette configuration dans ~/.gnupg/gpg.conf (Linux et Mac) ou C:\Users\[nom de l'utilisateur]\AppData\Roaming\gnupg\gpg.conf (Windows).

```
# Limite les informations diffusées
no-emit-version
no-comments
export-options export-minimal

# Permet d'afficher le format long de l'ID des clés et leurs empreintes
keyid-format 0xlong
with-fingerprint

# Affiche la validité des clés
list-options show-uid-validity
verify-options show-uid-validity

# Limite les algorithmes utilisés
personal-cipher-preferences AES256
personal-digest-preferences SHA512
default-preference-list SHA512 SHA384 SHA256 RIPEMD160 AES256 TWOFISH BLOWFISH ZLIB BZIP2 ZIP Uncompressed

cipher-algo AES256
digest-algo SHA512
cert-digest-algo SHA512
compress-algo ZLIB

disable-cipher-algo 3DES
weak-digest SHA1

# Paramètres S2K (String-to-Key) de la phrase de passe des clés
# Le paramètre s2k-count peut être réduit sur les machines peu puissantes
s2k-cipher-algo AES256
s2k-digest-algo SHA512
s2k-mode 3
s2k-count 65011712
```
### Prendre l'avantage des sous-clés

Lors de la création d'une clé OpenPGP dans son mode de base, gpg va créer une paire de clés qui permet de signer et de certifier.
Pour augmenter la sécurité de notre clé, nous allons utiliser une particularité d'OpenPGP : les sous-clés.

OpenPGP permet de créer des sous-clés avec un usage spécifique : signer, chiffrer et authentifier. Un autre avantage à l'utilisation
des sous-clés est qu'en cas de perte ou vol des clés secrètes des sous-clés, il suffira de révoquer la sous-clé
sans avoir à révoquer la clé principale (celle qui permet de certifier d'autres clés).

Commençons par créer la clé principale, celle qui va détenir notre identité. Puis ensuite, créons des sous-clés pour signer, chiffrer et authentifier.

### Création de la clé principale

Nous allons choisir de générer notre clé de façon personnalisée et de créer la clé de certification pour Wilson.
Elle va permettre de certifier d'autre clés. Elle est très importante, il faudra la conserver précieusement. En cas de perte ou de vol, celui qui détiendra cette clé pourra se faire passer pour cette personne.

```bash
wilson@spaceship:~$ gpg2 --expert --full-gen-key

gpg (GnuPG) 2.1.11; Copyright (C) 2016 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
   (9) ECC and ECC
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
Your selection? 8
```

Ensuite il faudra sélectionner les attributs de cette clé. Il ne faut garder que la capacité **Certifier** (*Certify* en anglais).

```bash
Possible actions for a RSA key: Sign Certify Encrypt Authenticate
Current allowed actions: Sign Certify Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? s

Possible actions for a RSA key: Sign Certify Encrypt Authenticate
Current allowed actions: Certify Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? e

Possible actions for a RSA key: Sign Certify Encrypt Authenticate
Current allowed actions: Certify

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? q
```

Nous avons configuré les capacités de cette premiere clé pour n'autoriser que la certification.
Passons ensuite à la taille de la clé : il est recommandé d'avoir une clé
d'une taille minimale de 2048. À ce jour, cette longueur est encore résistante, mais il est
préférable de prendre la taille maximale : 4096.

Pour la durée de vie de la clé, il est toujours recommandé d'en mettre une. En cas de perte de cette clé, et si elle
a été envoyée sur un serveur de clé, elle y restera à jamais valide. Mettez une durée d'au maximum 2 ans. Ici je vais mettre 1 an.
Cela permet de réviser les commandes chaque année :) .

```bash
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y
Key does not expire at all
Is this correct? (y/N) y
```

Ajoutons des détails sur l'identité de Wilson :

```bash
GnuPG needs to construct a user ID to identify your key.

Real name: Wilson Eleven
Email address: wilson.eleven@labs.com
Comment:
You selected this USER-ID:
    "Wilson Eleven <wilson.eleven@labs.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? o
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
```

Une fenêtre va s'afficher. Elle va vous demander de renseigner un pass-phrase pour protéger les clés secrètes.
Choisissez-en un assez long que vous pouvez mémoriser facilement.

```bash
gpg: key 1A8132B1 marked as ultimately trusted
gpg: directory '/home/wilson/.gnupg/openpgp-revocs.d' created
gpg: revocation certificate stored as '/home/wilson/.gnupg/openpgp-revocs.d/5EA44FF53CEB240FD3F1A6E4DCEE216E1A8132B1.rev'
public and secret key created and signed.

gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: PGP
gpg: depth: 0  valid:   2  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 2u
pub   rsa4096/1A8132B1 2017-10-05 [] [expires: 2018-10-10]
      Key fingerprint = 5EA4 4FF5 3CEB 240F D3F1  A6E4 DCEE 216E 1A81 32B1
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
```

La paire de clés principale est créée. Maintenant créons les sous-clés.

### Création des sous-clés

Comme nous l'avons vu en introduction sur les sous-clés, il est important d'en avoir une dédiée à chaque tâche :
* Authentification (A)
* Signature (S)
* Chiffrement (E)

Créons les maintenant.

Nous allons d'abord faire la liste des clés disponibles :

```
wilson@spaceship:~$ gpg2 --list-keys

/home/wilson/.gnupg/pubring.gpg
--------------------------------
pub   rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-10]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
```

Éditons-la pour lui ajouter des sous-clés. Pour cela, il va falloir passer en mode expert.

```bash
wilson@spaceship:~$ gpg2 --expert --edit-key 1A8132B1
gpg (GnuPG) 2.1.11; Copyright (C) 2016 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

Vous êtes maintenant en mode édition de la clé.

Ajoutons la clé de chiffrement avec la commande `addkey`.

```bash
gpg> addkey
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key
Your selection? 8

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Sign Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? s

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? q
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y
Key expires at ven. 05 oct. 2018 13:37:19 CEST
Is this correct? (y/N) y
Really create? (y/N) y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>

```

La clé avec l'empreinte B73A9C79 a bien été créée. Répétez l'opération pour la clé de signature et d'authentification.

À la fin, vous devez avoir ces clés :

```bash
sec  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> save
gpg> quit
```

Entrez `save` puis `quit`, et vous avez fini. Wilson a maintenant une paire de clés OpenPGP avec son identité et des sous-clés avec chacune une capacité.
Avant de pouvoir pleinement utiliser cette clé, sauvegardons-la.

### Exporter la clé principale

La clé PGP ne doit pas être utilisée telle quelle. En cas de vol de la clé principale et du mot de passe,
le détenteur de cette clé peut usurper l'identitié numérique et signer des messages à la place de la vraie personne.
Il est donc primordial de séparer la clé principale des sous-clés. La cleé principale, celle qui permet de certifier,
sera conservée dans un espace de stockage à froid et totalement déconnectée du réseau.

Tout d'abord, créons un certificat de révocation en cas de vol de la clé principale.

```bash
wilson@spaceship:~$ gpg2 --output 1A8132B1.rev --gen-revoke 1A8132B1
```

Le certificat de révocation est créé dans `1A8132B1.rev`. Il faudra le conserver précieusement (nous le verrons en partie 3).

Sauvegardons également toutes les clés.

```bash
wilson@spaceship:~$ gpg2 --export --armor 1A8132B1 > 1A8132B1.pub.asc
wilson@spaceship:~$ gpg2 --export-secret-keys --armor 1A8132B1 > 1A8132B1.priv.asc
wilson@spaceship:~$ gpg2 --export-secret-subkeys --armor 1A8132B1 > 1A8132B1.sub_priv.asc
```

`1A8132B1.pub.asc` va contenir toutes les clés publiques et `1A8132B1.priv.asc` la clé privée de la clé principale.
`1A8132B1.sub_priv.asc` ne contient que les clés privée des sous-clés.

Comme dit plus haut, nous n'allons utiliser que les sous-clés pour une utilisation quotidienne.

Supprimons toutes les clés privées.

```bash
wilson@spaceship:~$ gpg2 --delete-secret-key 1A8132B1
```

Ensuite, nous importons uniquement les clés privée des sous-clés.

```bash
wilson@spaceship:~$ gpg2 --import 1A8132B1.sub_priv.asc
```

Vérifions que nous avons uniquement les clés privées des sous-clés :

```bash
wilson@spaceship:~$ gpg2 --list-secret-keys
/home/wilson/.gnupg/secring.gpg
sec#  rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-05]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
ssb   rsa4096/B73A9C79 2017-10-05 [E] [expires: 2018-10-05]
ssb   rsa4096/9CC8B2FB 2017-10-05 [S] [expires: 2018-10-05]
ssb   rsa4096/8047B454 2017-10-05 [A] [expires: 2018-10-05]
```

Le petit `#` devant `sec` indique que la clé secrète de la clé principale n'existe plus, c'est un bouchon à la place.

Tous les fichiers que nous avons créés seront à conserver sur un média déconnecté du réseau (CD, clé USB, bande magnétique, feuille papier, ...).

### Conclusion

À travers cet article, nous avons créé une clé PGP avec un ensemble de sous-clés dédié à une tâche particulière. L'avantage d'utiliser OpenPGP par rapport à une simple clé asymétrique ce sont les sous-clés. Si une des clés est compromise, il suffira de la révoquer et d'en regénérer une nouvelle. Il ne sera pas nécessaire de révoquer la clé principale, celle qui détient notre identité numérique. Cette stratégie offre un niveau de sécurité beaucoup plus élevé.

Vous pouvez dès à présent signer vos emails et en recevoir des chiffrés, signer vos commit git, utiliser keybase.io et
même vous authentifier sur un serveur en SSH.

Par ailleurs, le 2 novembre, il y aura [une fête de la signature des clés](https://blog.mozfr.org/post/2017/09/Se-rencontrer-pour-echanger-ses-clefs-2-novembre-Paris) (key signing party){:rel="nofollow noreferrer"} dans les locaux de Mozilla France.
Cet évévenement est l'occasion de rencontrer d'autres adeptes d'OpenPGP et surtout, il permettra de faire certifier votre clé nouvellement créée.

### Article en relation
* [OpenPGP - Une paire de clés presque parfaite (partie 1)](/fr/openpgp-paire-clef-presque-parfaite-partie-1/)
* [OpenPGP - Exporter les clefs secrètes sur une Yubikey (partie 2)](/fr/openpgp-clef-secrete-yubikey-partie-2/)
* [OpenPGP - Stockage sur le long terme de clefs (partie 3)](/fr/openpgp-stockage-froid-clefs-partie-3/)
* [OpenPGP - J'ai participé à une fête de la signature des clefs (partie 4)](/fr/openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/)

### Resources
* [GPG : création de votre première paire de clefs et chiffrement d'un fichier](https://www.nextinpact.com/news/98374-gnupg-creation-votre-premiere-paire-clefs-et-chiffrement-dun-fichier.htm){:rel="nofollow noreferrer"}
* [GPG : comment créer une paire de clefs presque parfaite](https://www.nextinpact.com/news/102685-gpg-comment-creer-paire-clefs-presque-parfaite.htm){:rel="nofollow noreferrer"}
* [Creating the perfect GPG keypair](https://alexcabal.com/creating-the-perfect-gpg-keypair/){:rel="nofollow noreferrer"}
* [Ma nouvelle clé PGP](http://www.bortzmeyer.org/nouvelle-cle-pgp.html){:rel="nofollow noreferrer"}
* [OpenPGP Best Practices](https://riseup.net/en/security/message-security/openpgp/best-practices){:rel="nofollow noreferrer"}
* [Using OpenPGP subkeys in Debian development](https://wiki.debian.org/Subkeys){:rel="nofollow noreferrer"}
* [PGP Key signing party](https://www.eventbrite.com/e/pgp-key-signing-party-tickets-37092612001){:rel="nofollow noreferrer"}
* [Se rencontrer pour échanger ses clefs le 2 novembre à Paris](https://blog.mozfr.org/post/2017/09/Se-rencontrer-pour-echanger-ses-clefs-2-novembre-Paris){:rel="nofollow noreferrer"}
