---
contentType: article
lang: fr
date: '2017-10-24'
slug: openpgp-clef-secrete-yubikey-partie-2
title: OpenPGP - Exporter les clefs secrètes sur une Yubikey
excerpt: >-
  Après avoir généré les clefs OpenPGP, nous allons voir comment les stocker sur
  une clef USB comme la Yubikey. Cela va nous permettre de sécuriser d'avantage
  nos clefs secrètes.
cover: /assets/2017-10-24-openpgp-clef-secrete-yubikey-partie-2/cover.jpg
categories: []
authors:
  - tthuon
keywords:
  - openpgp
  - securite
  - yubikey
---

Nous avons vu dans l'article précedent [la génération de clefs OpenPGP](/fr/openpgp-paire-clef-presque-parfaite-partie-1/).
Pour rappel, nous avons dans notre trousseau de clefs privées gpg :

```bash
wilson@spaceship:~$ gpg2 --list-secret-keys

sec#  rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-05]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
ssb   rsa4096/B73A9C79 2017-10-05 [E] [expires: 2018-10-05]
ssb   rsa4096/9CC8B2FB 2017-10-05 [S] [expires: 2018-10-05]
ssb   rsa4096/8047B454 2017-10-05 [A] [expires: 2018-10-05]
```

Nous avons également exporté les clefs dans des fichiers :
* 1A8132B1.priv.asc : contient toutes les clefs privées
* 1A8132B1.pub.asc : contient toutes les clefs publiques
* 1A8132B1.sub_priv.asc : contient uniquement les clefs privées des sous-clefs

Avec cette configuration, nous avons une stratégie efficace contre le vol ou la perte de la clef privée qui sert à la certification.
Si un attaquant venait à s'emparer de l'ordinateur, il ne pourra pas certifier d'autre clef. Cependant, les clefs privées qui permettent
de signer, chiffrer et s'authentifier sont encore présentes sur l'ordinateur. Donc, en cas de vol des clefs, il serait possible de signer des messages pendant un certains temps (le temps que la sous-clef dérobée soit révoquée).

Pour contrer cette attaque, il est possible de placer les clefs privées dans une carte à puce (smart card). Ces dispositifs sont
très résistants à des techniques d'extraction de clef. En plus des attaques physiques, il y a un code pin avec 3 essais uniquement. Ensuite, elle se bloque.

Nous allons voir dans cet article l'export des clefs privées des sous-clefs dans une carte à puce. Pour cet exemple, je vais utiliser
une Yubikey 4.

### Yubikey, qu'est ce que c'est ?

Yubikey est un dispositif de la taille d'une clef usb classique. Cette clef permet d'effectuer la double authentification sur des sites
 web, tel que Google ou Github. Ainsi, si une personne est en possession de l'email et du mot de passe de la victime, l'attaquant ne pourra pas se connecter sans cette clef usb. C'est le principe de la double authentification, il faut être en possession de deux secrets.

La Yubikey implémente un protocole ouvert : *universal 2nd factor*.

En plus de ce principal protocole, elle en supporte d'autres : OpenPGP, TOTP, HOTP, défi-réponse.

Celui qui va nous intéresser est OpenPGP.

### Comment s'en procurer une

Je vous recommande de passer par [la boutique officielle](https://www.yubico.com/product/yubikey-4-series/)
pour s'assurer de la provenance du produit. Nous sommes sur des produits liés à la sécurité, il est important de savoir d'où provient le produit acheté.

Pour ceux qui ont un compte Github, il y a une [offre promotionelle qui permet d'avoir -10%](https://www.yubico.com/github-special-offer/) sur le panier. Intéressant :).
Par contre, elle n'est valable qu'une seule fois. Je vous recommande d'en commander au moins 2. La deuxième sera utile pour faire une sauvegarde en cas de perte de la première.

Dernier point important, notre clef OpenPGP a été générée avec une taille de 4096 bits. Seule la version 4 de la Yubikey permet
d'enregistrer des clefs de cette taille. La version 3 et la NEO, et ne supporte que des clefs de 3072 bits au maximum.

### Installons les outils nécessaires

Pour rappel, nous avons commencé notre génération de clef OpenPGP avec une machine sous Ubuntu 16.04 et GnuPG 2.1.11. Pour pouvoir
faire l'export des clefs vers la Yubikey, nous devons installer des outils supplémentaires.

```bash
wilson@spaceship:~$ sudo apt-get install -y gnupg-agent pinentry-curses scdaemon pcscd yubikey-personalization libusb-1.0-0-dev
```

### Personnaliser la Yubikey avec gpg

Avant d'utiliser la Yubikey, vérifer que la bande de garantie ne soit pas altérée. Si c'est le cas, ne pas l'utiliser.

Insérer la Yubikey dans un port USB et taper la commande suivante pour vérifier que la carte est bien reconnue.

```bash
wilson@spaceship:~$ gpg2 --card-status
Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240102010006064764950000
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: 06476495
Name of cardholder: [not set]
Language prefs ...: [not set]
Sex ..............: unspecified
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
```

La carte est vierge, il n'y aucune information personnelle. Il est recommandé de compléter les informations au cas où une
personne retrouve cette clef.

Éditons la carte et passons en mode admin. Vous pouvez entrer `help` pour avoir la liste des commandes disponibles.

```bash
wilson@spaceship:~$ gpg2 --card-edit
gpg/card> admin
Admin commands are allowed
```

Nous allons tout d'abord changer le code PIN d'administration de la clef et le code PIN utilisateur. Par défaut, le code PIN de l'administrateur est 12345678 et 123456 pour le code PIN utilisateur.

Le PIN administrateur est requis pour quelques opérations sur la carte (l'export de clef par exemple), et pour débloquer quand un code PIN a été entré 3 fois par erreur.

Entrer `passwd` pour les changer. Commençons par le PIN administrateur et ensuite le PIN utilisateur.

```
gpg/card> passwd
gpg: OpenPGP card no. D2760001240102010006064764950000 detected

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 3
PIN changed.

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 1
PIN changed.

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? q
gpg/card>
```

Ensuite, entrer les informations pour personnaliser votre clef :

```bash
gpg/card> name
Cardholder's surname: Wilson
Cardholder's given name: Eleven
Editer la clef
gpg/card> lang
Language preferences: fr

gpg/card> login
Login data (account name): wilson.eleven@labs.com

gpg/card> sex
Sex ((M)ale, (F)emale or space): m

gpg/card> quit
```

La clef est a présent configurée. Nous pouvons exporter les clefs privées des sous-clefs dans la carte à puce.

### Exporter les clefs vers la Yubikey

L'objectif est de déplacer les clefs secrètes des sous-clefs dans la Yubikey. Pour cela, nous allons
séléctionner chaque sous-clef une par une avec la commande `key n` et la déplacer dans la carte avec `keytocard`.
À la fin, il n'y aura plus aucun secret dans le trousseau de clef gpg.

Éditons la clef.

```bash
wilson@spaceship:~$ gpg2 --expert --edit-key 1A8132B1
gpg (GnuPG) 2.1.11; Copyright (C) 2016 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

Exportons la clef de chiffrement `B73A9C79`.

```bash
gpg> key 1

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb* rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>
```

Le petit astérisque devant l'empreinte de la clef indique qu'elle est sélectionnée.

Entrer `keytocard` pour l'exporter vers la Yubikey. Ensuite, taper `2` qui est l'unique choix. La Yubikey peut stocker les 3 types
de sous-clefs.

```bash
gpg> keytocard
Please select where to store the key:
   (2) Encryption key
Your selection? 2

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb* rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>
```

gpg va vous demander le mot de passe de la clef secrète de chiffrement et ensuite le code pin d'administration de la clef Yubikey.
Une fois le code pin d'administration de la Yubikey entré, la clef secrète de chiffrement est bien dans la Yubikey. Nous pourrons le vérifier juste après avoir déplacé les deux autres clef.

Séléctionnons la clef de signature. Il faut désélectionner la première clef et séléctionner la seconde.

```bash
gpg> key 1

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> key 2

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb* rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

La seconde clef est bien séléctionnée car il y a la petite astérisque devant la clef `9CC8B2FB`.

Répétons l'opération. Il faudra sélectionner `1` car c'est une clef de signature.

```bash
gpg> keytocard
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 1

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb* rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

C'est ok pour la seconde clef. Répéter avec la troisième.

```bash
gpg> key 2

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> key 3

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb* rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> keytocard
Please select where to store the key:
   (3) Authentication key
Your selection? 3

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb* rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

Nous avons terminé. Taper `save` et `quit`.

Vérifions que nous n'avons plus aucune clef secrète dans notre trousseau de clefs gpg.

```bash
wilson@spaceship:~$ gpg2 --list-secret-keys
/home/wilson/.gnupg/pubring.gpg
--------------------------------
sec#  rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-05]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
ssb>  rsa4096/B73A9C79 2017-10-05 [E] [expires: 2018-10-05]
ssb>  rsa4096/9CC8B2FB 2017-10-05 [S] [expires: 2018-10-05]
ssb>  rsa4096/8047B454 2017-10-05 [A] [expires: 2018-10-05]
```

Le chevron `>` devant `ssb` indique que la clef secrète n'existe pas pour cette clef. C'est un bouchon.

Vérifions que ces clefs secrètes sont bien dans la Yubikey.

```bash
wilson@spaceship:~$ gpg2 --card-status

Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240102010006064764950000
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: 06476495
Name of cardholder: Eleven Wilson
Language prefs ...: fr
Sex ..............: male
URL of public key : [not set]
Login data .......: wilson.eleven@labs.com
Signature PIN ....: not forced
Key attributes ...: rsa4096 rsa4096 rsa4096
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: 49B7 73DB 292F 8A66 C254  AC97 69FE 9865 9CC8 B2FB
      created ....: 2017-10-05 11:39:18
Encryption key....: 88CD 3F3C BA60 1AFD D0A6  22E9 FE2B A21E B73A 9C79
      created ....: 2017-10-05 11:36:19
Authentication key: 0E2F 255E DE28 F044 474D  E571 F000 F81C 8047 B454
      created ....: 2017-10-05 11:43:21
General key info..: sub  rsa4096/9CC8B2FB 2017-10-05 Wilson Eleven <wilson.eleven@labs.com>
sec#  rsa4096/1A8132B1  created: 2017-10-05  expires: 2018-10-05
ssb>  rsa4096/B73A9C79  created: 2017-10-05  expires: 2018-10-05
                        card-no: 0006 06476495
ssb>  rsa4096/9CC8B2FB  created: 2017-10-05  expires: 2018-10-05
                        card-no: 0006 06476495
ssb>  rsa4096/8047B454  created: 2017-10-05  expires: 2018-10-05
                        card-no: 0006 06476495
```

Nous retrouvons bien les informations personnelles dans la première partie. Ensuite, il y a les informations
sur les clefs présentes dans la Yubikey.

Nous voyons qu'il y a le chevron `>` devant `ssb`. Comme vu plus haut, cela indique l'absence de la clef secrète dans le
trousseau de clefs. Mais juste en dessous, il y a une ligne supplémentaire qui permet de dire à gpg où trouver la clef secrète.
Ici, nous avons le numéro de série de la Yubikey `card-no: 0006 06476495`. Ce numéro de série est également imprimé sur la clef physiquement. Si vous avez plusieurs Yubikey, il sera facile de retrouver celle que vous cherchez.

### Conclusion

À travers ces deux premiers articles, nous avons couvert la création d'une clef OpenPGP et l'exportation des secrets sur une carte à puce. L'utilisation d'une carte à puce permet une protection supplémentaire contre le vol des clefs secrètes. Il ne suffira pas de pirater l'ordinateur pour les voler, mais il sera nécessaire de voler physiquement la clef et le code PIN associé pour utiliser les clefs secrètes. De plus, comme vu en introduction, la clef secrète ne peut être extraite. Notre clef est bien protégée, sauf contre le facteur humain qui reste la seule menace.

Par ailleurs, vous pouvez diffuser votre clef publique sur [un serveur de clefs](https://pgp.mit.edu/) et d'autre services (GitHub, Kraken, keybase.io). Cela vous permet de recevoir des messages chiffrés, et de [signer vos commits](https://help.github.com/articles/signing-commits-using-gpg/) sur GitHub (exemple sur ce commit [31dd621](https://github.com/eleven-labs/blog.eleven-labs.com/commit/31dd621db58a7ee1428bc9615c23e74d5ac98c3f)).

Dans un prochain article, nous allons mettre en place une stratégie de sauvegarde en cas de perte des clefs secrètes. Une erreur peut vite arriver, comme formater son ordinateur suite à un ransonware (ce qui est d'actualité en ce moment).

## Article en relation
* [OpenPGP - Une paire de clés presque parfaite (partie 1)](/fr/openpgp-paire-clef-presque-parfaite-partie-1/)
* [OpenPGP - Exporter les clefs secrètes sur une Yubikey (partie 2)](/fr/openpgp-clef-secrete-yubikey-partie-2/)
* [OpenPGP - Stockage sur le long terme de clefs (partie 3)](/fr/openpgp-stockage-froid-clefs-partie-3/)
* [OpenPGP - J'ai participé à une fête de la signature des clefs (partie 4)](/fr/openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/)

### Resources
- [wikipedia - Universal 2nd Factor](https://en.wikipedia.org/wiki/Universal_2nd_Factor)
- [fidoalliance -Universal 2nd Factor (U2F) Overview](https://fidoalliance.org/specs/fido-u2f-overview-ps-20150514.pdf)
- [YubiKey 4 series](https://www.yubico.com/products/yubikey-hardware/yubikey4/)
- [Yubico Expands FIPS Security Certification ](https://www.yubico.com/2016/05/yubikey-gains-support-for-higher-levels-of-federal-crypto-standards/)
- [wikipedia - FIPS 140-2](https://en.wikipedia.org/wiki/FIPS_140-2#Level_1)
- [Cryptographic Module Validation Program](https://csrc.nist.gov/projects/cryptographic-module-validation-program/Certificate/2267)
- [Guide to using YubiKey as a SmartCard for GPG and SSH](https://github.com/drduh/YubiKey-Guide)
- [RFC4880](https://tools.ietf.org/html/rfc4880)
- [Nitrokey Storage Got Great Results in a 3rd Party Security Audit](https://www.nitrokey.com/news/2015/nitrokey-storage-got-great-results-3rd-party-security-audit)
- [Secure Hardware vs. Open Source ](https://www.yubico.com/2016/05/secure-hardware-vs-open-source/)
- [Yubico has replaced all open-source components](https://www.reddit.com/r/linux/comments/4ls94a/yubico_has_replaced_all_opensource_components/)
- [Cover image source](https://www.yubico.com/press/images/)

### Remarques
Ce tutoriel utilise une Yubikey pour le stockage des secrets. La Yubikey est la clef la plus répandue dans le grand public, notamment
pour la fonctionnalité de second facteur d'authentification. Il existe d'autre clefs supportant OpenPGP comme la [NitroKey](https://www.nitrokey.com/). Contrairement à la Yubikey, la NitroKey est open-source. Une sécurité avec du matériel fermé et propriétaire n'est pas une solution viable sur le long terme. C'est également contraire à l'esprit OpenPGP qui se veut être ouvert. Cepedant, j'ai fait le choix de la Yubikey pour sa facilité de mise en oeuvre et sa capacité à faire de la double authentification.
