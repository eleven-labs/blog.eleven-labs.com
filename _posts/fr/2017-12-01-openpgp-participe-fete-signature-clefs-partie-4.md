---
layout: post
title: OpenPGP - J'ai participé à une fête de la signature des clefs
excerpt: OpenPGP ne s'appuie pas sur une autorité de certification pour certifier les personnes, mais elle se base sur la confiance entre les personnes.
authors:
- tthuon
permalink: /fr/openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/
categories:
    - openpgp
    - sécurité
tags:
    - openpgp
    - sécurité
    - confiance
cover: /assets/2017-12-01-openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/cover.jpg
---

Le 2 novembre 2017, Ludovic Hirlimann qui est membre du staff technique chez Mozilla, a organisé une rencontre pour que les détenteur 
d'une clef PGP puissent certifier les autres clef: c'est une _key signing party_.

Le principe est simple. Chaque participant donne sa clef publique à l'organisateur. L'organisateur va regrouper l'ensemble des clefs
sur une feuille. Cette feuille est ensuite distribué à chaque participant. Le but est de vérifier l'identité du détenteur de la clef et de certifier ou non la clef PGP.

Cela parait simple, mais il faut une bonne organisation. Lors de cette rencontre, nous étions 20 personnes.

![key signing party](/assets/2017-12-01-openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/key_signing_party.jpg)

Il y a deux rangées de 10 personnes qui se font face. A tour de role, les personnes posent des questions pour vérifier l'identité: Prenons un exemple avec Bob et Alice.
Bob: Qui es-tu?
Alice: Je suis Alice.
Bob: Est-ce que l'empreinte de la clef est correcte?
Alice: Oui
Bob: Est-ce que je peux voir une pièce d'identité?
Alice: Oui, la voici.
Bob: _vérifie le nom, prénom et la photo_. Ok je valide ton identité. 

Ensuite Bob met une croix pour dire que l'empreinte de la clef est bonne et que l'identité est vérifié. Ce dialogue est inversé et avec les 19 autres personnes.

![key signing party list](/assets/2017-12-01-openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/keysigning_list.png)

Une fois l'événement terminé, il faut certifier les clefs des personnes que l'on a vérifié. Certifier une clef, c'est donner sa confiance à la personne 
que j'ai rencontré. Cette action n'est pas anodine car elle sera retranscrite dans la clef que je vais certifier. Par exemple, je n'ai pas certifier des clefs 
dont le nom et prénom incrit dans la clef PGP ne correspond pas à ce qui a été vérifié avec la pièce d'identité. 

Comment est-ce que je certifie une clef? Il faut tout d'abord charger la clef maitre dans le trousseau de clef GPG.

```bash
wilson@spaceship:~$ gpg2 --import 1A8132B1.priv.asc
```

Ensuite, je télécharge la clef publique que je veux certifier.

```bash
wilson@spaceship:~$ gpg2 --keyserver pgp.mit.edu --recv-key 0x66B9A0141AD7A463
```

Je vérifie que la clef est bien téléchargé.

```bash
wilson@spaceship:~$ gpg2 --list-keys
/home/thierry/.gnupg/pubring.gpg
--------------------------------
pub   rsa4096/1A8132B1 2017-10-05 [C]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
sub   rsa4096/B73A9C79 2017-10-05 [E] [expires: 2018-10-05]
sub   rsa4096/9CC8B2FB 2017-10-05 [S] [expires: 2018-10-05]
sub   rsa4096/8047B454 2017-10-05 [A] [expires: 2018-10-05]

pub   rsa2048/1AD7A463 2017-01-05 [SC] [expires: 2018-11-03]
uid         [  full  ] Thierry Thuon <thierry@thuon.eu>
sub   rsa2048/9AC774F5 2017-01-05 [E] [expires: 2018-08-03]
sub   rsa2048/BCA82453 2017-08-05 [S] [expires: 2018-08-05]
sub   rsa2048/178CF83B 2017-08-05 [A] [expires: 2018-08-05]
```

Et je certifie la clef.

```bash
wilson@spaceship:~$ gpg2 --sign-key 1AD7A463

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: never       usage: C   
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E   
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S   
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A   
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg: using "1A8132B1" as default secret key for signing

pub  rsa2048/1AD7A463
     created: 2017-10-05  expires: never       usage: C   
     trust: ultimate      validity: ultimate
 Primary key fingerprint: F493 8474 2A00 383E 1B4D  6511 66B9 A014 1AD7 A463

     Thierry Thuon <thierry@thuon.eu>

Are you sure that you want to sign this key with your
key "Wilson Eleven <wilson.eleven@labs.com>" (1A8132B1)

Really sign? (y/N) y 
```

Taper 'y' et entrer. Voilà, la clef est certifié. Il est possible de le déposer directement sur le serveur de clef ou de l'envoyer 
par email de manière chiffé et signé.

```bash
wilson@spaceship:~$ gpg2 --keyserver pgp.mit.edu --send-keys 0x66B9A0141AD7A463
```

Si je vais sur [le serveur de clef](http://pgp.mit.edu/pks/lookup?op=vindex&search=0x66B9A0141AD7A463) je peux voir que ma clef a 
été certifié par plusieurs personnes que j'ai rencontré lors de l'événement.

Pour conclure, cet événement m'a permis de rencontre d'autre personne intéressé par le protocole PGP. Il se qui se base principalement sur la confiance.
Plus la clef est certifié par de nombreuses personnes, plus les autres personnes qui voudront communiquer avec moi auront confiance en cette clef. C'est un cercle vertueux :).

N'hésitez pas a y participer et voir à en organiser une.

### Resources
- [Se rencontrer pour échanger ses clefs le 2 novembre à Paris](https://blog.mozfr.org/post/2017/09/Se-rencontrer-pour-echanger-ses-clefs-2-novembre-Paris)
- [Wikipedia Key signing party](https://en.wikipedia.org/wiki/Key_signing_party) 
- [Debian Keysigning](https://wiki.debian.org/Keysigning)
