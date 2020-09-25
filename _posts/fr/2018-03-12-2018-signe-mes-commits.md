---
layout: post
title: En 2018, je signe mes commit
lang: fr
permalink: /fr/en-2018-je-signe-mes-commit/
excerpt: "Après avoir suivi les 4 parties sur la création d'une paire de clef PGP, nous allons voir un cas d'usage concret de cette clef. Depuis la version 1.7.9, git permet de signer les commit avec une clef PGP."
authors:
    - tthuon
categories:
    - git
    - openpgp
    - sécurité
tags:
    - git
    - openpgp
    - sécurité
cover: /assets/en-2018-je-signe-mes-commit/cover.jpg
---

Pour bien pouvoir faire suivre cette article, je vous recommande de lire les articles précédent:
* [OpenPGP - Une paire de clés presque parfaite (partie 1)](/fr/openpgp-paire-clef-presque-parfaite-partie-1/)
* [OpenPGP - Exporter les clefs secrètes sur une Yubikey (partie 2)](/fr/openpgp-clef-secrete-yubikey-partie-2/)
* [OpenPGP - Stockage sur le long terme de clefs (partie 3)](/fr/openpgp-stockage-froid-clefs-partie-3/)
* [OpenPGP - J'ai participé à une fête de la signature des clefs (partie 4)](/fr/openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/)

Depuis la version 1.7.9, git permet de signer les commit avec une paire de clef PGP. La signature d'un
commit permet de certifier que c'est bien l'auteur qui a fait ce commit et non une personne qui aurait
usurper l'identité de la personne.

Voyons plus en détail la mise en place de la signature des commit.

## Pré-requis

Il est nécessaire d'avoir une paire de clef PGP. Si vous n'en avez pas, suivez l'article [OpenPGP - Une paire de clés presque parfaite (partie 1)](/fr/openpgp-paire-clef-presque-parfaite-partie-1/).

Commençons par lister les clefs PGP disponible dans le trousseau.

```bash
wilson@spaceship:~$ gpg2 --list-keys

/home/wilson/.gnupg/pubring.gpg
--------------------------------
pub   rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-10]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
``` 

Si ce n'est pas le cas, importer la clef privée dans le trousseau.

```bash
wilson@spaceship:~$ gpg2 --import 1A8132B1.sub_priv.asc
```

## Configuration de git

Ensuite, il faut configurer git pour lui dire d'utiliser la clef pour signer les commit.

```bash
wilson@spaceship:~$ git config --global user.signingkey 1A8132B1
```

Cela va ajouter une ligne dans le fichier ~/.gitconfig.

```bash
wilson@spaceship:~$ cat ~/.gitconfig
[user]
	email = wilson.eleven@labs.com
	name = Wilson Eleven
	signingkey = 1A8132B1
```

Une dernière configuration reste à faire. Par défault, git va utiliser `gpg` pour signer les commit. 
Or, nous utilisons la version 2 de gpg `gpg2`. Pour indiquer à git d'utiliser `gpg2` au lieu de `gpg`, lancer la commande suivante:

```bash
wilson@spaceship:~$ git config --global gpg.program gpg2
```

## Je signe mon premier commit

```bash
wilson@spaceship:~$ git add README.md
wilson@spaceship:~$ git commit -m "Mon premier commit signé"
```

```bash
wilson@spaceship:~$ git log --show-signature -1
commit 646c4855348951626beea9a8e09b364c820a0559
gpg: Signature made sam. 03 mars 2018 17:02:37 CET using RSA key ID 9CC8B2FB
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: PGP
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2018-11-03
gpg: Good signature from "Wilson Eleven <wilson.eleven@labs.com>" [ultimate]
Author: Wilson Eleven <wilson.eleven@labs.com>
Date:   Sat Mar 3 17:02:37 2018 +0100

    Mon premier commit signé
```

Félicitation, votre commit est signé et authentique. Toutes les personnes en possession de votre clef publique
pourra vérifié que le commit est authentique et n'a pas été altéré par un tier.

## Configurer github

Github affiche les commit signé sur son interface web. Comme avec la commande `git log`, github affiche un
badge vert `Vérifié` devant chaque commit signé.

Pour cela, il faut donner à Github sa clef publique.

Aller dans `Paramètres`, ensuite dans le menu sélectionner `Clef SSH et GPG`. 
