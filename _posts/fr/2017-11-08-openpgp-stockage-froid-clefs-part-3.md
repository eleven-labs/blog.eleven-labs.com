---
layout: post
title: OpenPGP - Stockage sur le long terme de clefs
excerpt: Une problématique courante avec les clefs secrètes est leur stockage. Ces clefs doivent être stockées dans un lieu sûr, sur un support durable, tout en restant accessibles en cas de besoin. C'est ce que nous allons voir dans cette article.
authors:
- tthuon
permalink: /fr/openpgp-stockage-froid-clefs-partie-3/
categories:
    - openpgp
    - sécurité
tags:
    - openpgp
    - sécurité
    - yubikey
cover: /assets/2017-11-08-openpgp-stockage-froid-clefs-part-3/cover.jpg
---

Nous avons vu dans le premier article que la clef privée principale ne doit pas être divulguée publiquement. Elle doit être conservée et stockée sur un espace de stockage complètement déconnecté du réseau. Mais alors, comment stocker cette clef privée ?

## Où stocker ?

Il est évident qu'il ne faudra pas laisser ses clefs privées sur son ordinateur portable quotidien. Il faudra la stocker sur un support déconnecté. Il en existe plusieurs : clef USB, disque dur externe, disque optique, bande magnétique. Il y a également des supports non numériques : le papier, la pierre, le tissu.

Un des critères pour le choix du support de stockage est sa durabilité dans le temps. Tous les messages chiffrés que je vais recevoir, je voudrais pouvoir les déchiffrer dans un avenir proche ou lointain.

Ensuite, il faut que le support soit fiable. Même si je sais qu'un support peut durer 10 ans, je veux être sûr qu'au bout de ces 10 ans, je vais pouvoir être capable de lire le média.

Enfin, le support doit pouvoir être lu par un lecteur qui sera toujours disponible à l'avenir. Une pensée pour le HD-DVD dont il n'existe plus aucun lecteur dans le commerce (mis à part en occasion).

Au vu de tous ces critères, je vais pouvoir faire mon choix sur le support. Cependant, les supports numériques sont très récents. Il est difficile de se faire une idée sur leur durée de vie. Il existe de nombreux articles qui traitent de ce sujet sans pouvoir apporter de réponse exacte. Je vous mets quelques liens en bas de l'article. Ils m'ont permis de me forger une opinion sur chacun des supports.

Ensuite, il y a les supports optiques. Ces supports sont très bons également. J'ai archivé des documents et 10 ans plus tard je peux encore les lire. Il faudra prendre des précautions sur la qualité du support, son écriture et son stockage.

Concernant les disques durs, clef USB et SSD, je pense qu'ils ne seront pas adaptés car ils sont fragiles. Le disque dur possède un bras mécanique qui ne doit jamais entrer en contact avec le plateau. Si cela arrive, le disque est illisible. Pour les clefs USB et SSD, à cause de leur mode de fonctionnement (une charge électrique stockée dans une cellule), le support peut laisser fuiter cette charge et causer la perte de la donnée.

Maintenant que nous avons choisi le support avec attention, passons à la sauvegarde de la clef privée principale.

## Exporter les clefs privées

En début d'article, je n'ai parlé que de la clef privée principale. C'est elle qui détient notre identité. Cependant, ce n'est pas avec cette clef que je déchiffre les messages que je reçois. C'est la sous-clef de chiffrement que me le permet. En plus de sauvegarder ma clef privée principale, je vais également sauvegarder toutes les sous-clefs privées (Chiffrement, Signature, Authentification).

Il existe un outil qui permet d'exporter la clef privée principale : paperkey. Il faut savoir que la clef privée contient également la clef publique. Cet outil va permettre de ne sauvegarder que la clef privée. En général, la clef publique est distribuée sur les serveurs de clefs, il ne sera donc pas nécessaire de la sauvegarder.

Cependant, paperkey ne permet pas de sauvegarder les sous-clefs privées. Alors, nous allons exporter la clef privée principale et les sous-clefs privées avec la commande d'export de gpg et un dump hexadécimal. Ensuite, nous allons les imprimer sur un bon papier et même les plastifier pour ensuite les conserver à l'abri de la lumière. De plus, il faudra mettre une copie de ces clefs dans un lieu autre que le domicile : chez les parents, un notaire, un coffre-fort. Cela suppose de faire confiance à une tierce personne.

### Mise en pratique

La sauvegarde des clefs sur papier est très simple. Il suffit d'imprimer le fichier `1A8132B1.priv asc` et c'est fini. Ensuite, pour reconstruire le fichier à partir du papier, nous allons utiliser un scanner et un logiciel d'OCR (*optical caractère recognition* ou reconnaissance optique de caractères). Cette technique est bien avancée et utilisée depuis les années 90 pour retranscrire le programme PGP sur papier.

Mais lors de la reconnaissance des caractères, il peut y avoir des erreurs, notamment sur des caractères se ressemblant, comme "i" et "l" ou "0" et "o". Comme notre clef fait plus de 14000 caractères et qu'il est quasiment impossible de retrouver le caractère non reconnu, nous allons encoder chaque caractère par son code hexadécimal et chaque ligne aura une somme de contrôle. Ainsi, il sera plus simple de trouver la ligne en erreur et de corriger le caractère non reconnu lors du scan du papier.

L'avantage par rapport à paperkey, c'est qu'il utilise des outils simples : hd et cksum. Je me suis inspiré de [cet article de blog](https://nipil.org/2013/09/19/GnuPG-plan-de-secours-valide.html){:target="_blank" rel="nofollow noopener noreferrer"} et j'ai légèrement modifié la commande.

Voici la commande qui permet d'avoir le dump hexadécimal ainsi que la somme de contrôle de chaque ligne du dump.

`cat 1A8132B1.priv.asc | hd | while read n; do echo -e -n "${n}\t"; echo "${n}" |  cut --delimiter="|" -f2 | cksum; done > 1A8132B1.txt`

Les étapes:
* afficher le fichier 1A8132B1.priv.asc
* génération du dump hexadécimal
* pour chaque ligne du dump, afficher la ligne, ne prendre que la partie brute du dump (celle qui est entre `|`) et générer une somme de contrôle
* le tout est enregistré dans le fichier *1A8132B1.txt*

Exemple de sortie de la commande

```bash
00003490  58 33 6e 37 6f 65 76 61  71 42 47 30 48 6c 31 62  |X3n7oevaqBG0Hl1b|	1532581431 17
000034a0  42 56 78 4e 6f 77 62 31  77 53 69 44 70 56 64 4d  |BVxNowb1wSiDpVdM|	1320948498 17
000034b0  44 43 6e 58 47 52 75 66  34 69 7a 48 4d 72 41 56  |DCnXGRuf4izHMrAV|	1344535859 17
000034c0  6e 6b 47 4d 32 41 6c 0a  2f 75 63 51 42 6c 49 63  |nkGM2Al./ucQBlIc|	2010309333 17
000034d0  50 2b 44 6c 41 72 36 4f  6b 62 67 73 4a 34 38 57  |P+DlAr6OkbgsJ48W|	1939973554 17
```

Prenons la première ligne en exemple. De gauche à droite :
* numéro de la ligne en hexadécimal
* 17 groupe de 2 caractères hexadécimaux. Chaque groupe représente un caractère ASCII
* entre `|` la valeur ASCII
* la somme de contrôle de la valeur ASCII
* la longueur de la chaine de caractère ASCII.

Imprimer le fichier 1A8132B1.priv.asc et 1A8132B1.txt. Et c'est tout. 

### Testons

Comme toute sauvegarde, ce n'est pas le jour où on en a besoin qu'il faut la tester. Il faut la tester maintenant. Cette étape est assez fastidieuse, mais avec les outils que nous avons mis en place, c'est relativement simple.

Tout d'abord, il faudra se munir d'un scanner. Il faudra le régler en noir et blanc avec un DPI d'au moins 300, idéalement plus. Cela apportera plus de précision. Scanner chaque feuille.

Installons un outil de reconnaissance de caractères : tesseract-ocr. Il est libre. Il suffit de lancer la commande suivante :

`for i in *.jpg ; do tesseract $i >> private_key.txt; done;`

Si vous êtes chanceux, importez la clef directement dans gpg avec `gpg2 --import private_key.txt`. S'il y a une erreur, c'est qu'un caractère n'a pas été reconnu. Utilisez la commande qui a permis de générer le dump hexadécimal et comparez-la avec la copie en papier. 

`cat private_key.txt | hd | while read n; do echo -e -n "${n}\t"; echo "${n}" |  cut --delimiter="|" -f2 | cksum; done > dprivate_key.dump.txt`

Parcourez chaque ligne du fichier à la recherche du caractère et corrigez le fichier `private_key.txt` au fur et à mesure.

Cette étape est nécessaire pour assurer une bonne sauvegarde des clefs privées sur papier. 

## Conclusion

Cet article permet de conclure sur cette série OpenPGP. Nous avons vu la génération des clefs OpenPGP, l'usage d'une carte à puce pour un usage quotidien et enfin la sauvegarde des clefs privées. La partie la plus critique est la sauvegarde. Sans elle, tout est perdu à jamais car il n'existe, à ce jour, aucun moyen de casser la clef. L'avantage avec la technique abordée est qu'elle est utilisable pour tous types de clefs. Je l'ai utilisé pour sauvegarde ma clef RSA et ma clef Etheurem. Il est possible d'aller plus loin avec le qrcode ou le datamatrix. Tous les deux sont des formats ouverts de code 2D. Il suffit de prendre un bloc de texte et de générer le code correspondant. Cela évite de passer par une phase de reconnaissance de caractères.

Toutes les étapes décrites tout au long de ces articles nous font prendre conscience que la sécurité n'est pas un sujet abordable pour tous, qui reste néanmoins compréhensible lorsque bien expliqué.

## Ressources

* [Acid free paper](https://en.wikipedia.org/wiki/Acid-free_paper){:target="_blank" rel="nofollow noopener noreferrer"}
* [Quelle est la durée de vie d’un CD ?](http://future.arte.tv/fr/memoire-numerique/quelle-est-la-duree-de-vie-dun-cd){:target="_blank" rel="nofollow noopener noreferrer"}
* [La durée de vie d'un CD ? Les experts sont plutôt pessimistes](https://www.tomsguide.fr/actualite/cd-audio-duree-vie,44609.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [Les supports CD et leur durée de vie](https://www.canada.ca/fr/institut-conservation/services/soin-objets/supports-electroniques/supports-cd-duree-vie-faq.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [Pourquoi les clés USB claquent-elles si vite ?](https://www.lesnumeriques.com/cle-usb/pourquoi-cles-usb-claquent-si-vite-a1648.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [Pourquoi les disques SSD ont une durée de vie limitée ?](https://lehollandaisvolant.net/?d=2017/03/21/17/16/34-pourquoi-les-disques-ssd-ont-une-duree-de-vie-limitee){:target="_blank" rel="nofollow noopener noreferrer"}
* [Dire au revoir: 5 Alternatives au disque optique ](http://wikifra.xyz/expliqu-technology/11065-dire-au-revoir-5-alternatives-au-disque-optique.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [OpenPGP et GnuPG : 25 ans de chiffrement pour tous, ce qu'il faut savoir avant de s'y mettre](https://www.nextinpact.com/news/98509-openpgp-et-gnupg-25-ans-chiffrement-pour-tous-ce-quil-faut-savoir-avant-sy-mettre.htm){:target="_blank" rel="nofollow noopener noreferrer"}
* [gnupg hardcopy](https://github.com/nipil/gnupg-hardcopy){:target="_blank" rel="nofollow noopener noreferrer"}
* [GnuPG, plan de secours validé, ouf !](https://nipil.org/2013/09/19/GnuPG-plan-de-secours-valide.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [Pretty Good Privacy: Criminal_investigation](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#Criminal_investigation){:target="_blank" rel="nofollow noopener noreferrer"}
* [Journal De la gestion des clefs OpenPGP](http://linuxfr.org/users/gouttegd/journaux/de-la-gestion-des-clefs-openpgp){:target="_blank" rel="nofollow noopener noreferrer"}
* [Rapport disque blue-ray](http://blog.nalis.fr/public/pdf/DGP_SIAF_2012_010.RAPPORT_DISQUES_BLU_RAY.pdf){:target="_blank" rel="nofollow noopener noreferrer"}
* [Printing and Scanning a PGP Key](http://archive.is/RWTbi){:target="_blank" rel="nofollow noopener noreferrer"}
