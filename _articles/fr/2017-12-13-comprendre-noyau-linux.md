---
contentType: article
lang: fr
date: '2017-12-13'
slug: comprendre-kernel-linux
title: 'Pour Noël, je comprends mon noyau GNU/Linux !'
excerpt: >-
  Linux n'est rien de plus qu'un noyau, les abus de langages sont trop nombreux
  et trop fréquents. Apprenons ici à faire la différence entre Linux et une
  distribution basée sur Linux.
cover: /imgs/articles/2017-12-13-understanding-linux-kernel/cover.jpg
categories: []
authors:
  - aandre
keywords:
  - linux
  - kernel
  - compilation
  - gentoo
---

Pourquoi compiler son noyau alors qu'on a tous au moins 8 Go de mémoire vive me direz vous ? Pourquoi aller optimiser son Kernel alors que l'on peut exploiter la mémoire vive à fond ?

La réponse est très simple : un jour vous allez tomber sur une vieille machine et vous dire "hey pourquoi ne pas en faire un serveur ou un genre de NAS ?".
Un peu optimiste, vous allez commencer par installer une Ubuntu 17.04 version graphique (on sait jamais), *pimpée comme une voiture volée* et vous dire après coup : "en fait, c'est lent".
En effet, on constate rapidement que Ubuntu 17.04 ou Debian Strech, ça tourne mal sur une vieille machine.

C'est là que l'on s'aperçoit que des distributions comme Ubuntu chargent l'équivalent du nombre d'atomes dans l'univers :
 - Driver pour lecteur d'empreintes ;
 - Driver pour cartes Wifi ;
 - etc...

Les distributions "grand public" sont très bien, mais couvrent un champ des possibles beaucoup trop vaste pour certaines applications.

## Pré-requis

Avant de commencer, voici quelques notions de base indispensables au suivi de ces quelques articles :

 - Avoir une distribution basée sur le kernel GNU/Linux ;
 - Maîtriser les commandes de base de GNU/Linux ;
 - Il peut par ailleurs être utile d'avoir des notions en systèmes de fichiers selon les cas.

Si vous ne souhaitez pas installer les différents outils sur votre machine, vous pouvez au choix utiliser un container Debian pour docker ou encore Virtual Box.
Sachez en tout cas que si vous compilez votre noyau sur votre machine, nous n'écraserons pas l'ancien, et nous ferons une entrée différente dans le bootloader.

Ces notions ne seront néanmoins pas nécessaires si vous ne souhaitez que la théorie. En effet, il s'agit d'une série de trois articles composés comme il suit :
 - théorie (& pourquoi) ;
 - configuration (& comment) ;
 - compilation (& installation).

## Pourquoi parler de Kernel Linux ?

Linux c'est juste le noyau, c'est une couche logicielle permettant au software de dialoguer avec le hardware.
Debian, Ubuntu, Arch, Fedora, Red Hat, OpenSUSE, Gentoo, et j'en passe des plus ou moins bonnes, sont des distributions basées sur une seule et même base : le noyau GNU/Linux.

Ce qui fait qu'on les nomme "distributions", c'est qu'il y a une philosophie derrière, et surtout un gestionnaire de paquets souvent différent d'une distribution à l'autre (apt, yum, emerge, pacman, etc.). Ils sont divers & variés.

Des distributions orientées grand public vont tout inclure pour couvrir le maximum d'utilsateurs et donc d'environnements et drivers (Ubuntu). D'autres vont préférer la stabilité (Debian), et certaines vont même jusqu'à compiler tout pour l'optimisation (Gentoo).

## Alors, pourquoi (re)compiler son Kernel ?

Les raisons sont multiples. On peut travailler dans l'embedded (IoT/satellites/etc.) et avoir de grandes restrictions en terme de mémoire utilisée.
On peut aussi être passionné et se dire : "je veux comprendre le noyau, et je suis un fou je veux booter en 5 secondes sur ma machine".
Ou tout simplement penser : "j'ai une vieille machine, j'essaie de la sauver de la casse, il ne faut pas que je lui en demande trop".
Un autre domaine où la compilation du noyau est très utilisée, est la musique assistée par ordinateur. En effet, un noyau temps-réel est souvent bien plus performant pour la MAO.

Une chose est sûre, c'est que sur un hardware un tout petit peu exotique, ou pour configurer des devices un peu particuliers, vous recompilerez au moins une fois votre Kernel dans votre vie.
Bien souvent cette opération fait peur, même pour des utilisateurs confirmés sur Linux. Pour preuve, faites un sondage, vous verrez que rares sont ceux qui l'ont fait manuellement (en effet le but ici est de le faire manuellement pour comprendre les impacts).

Je n'ai pas de benchmarks sous la main, mais j'en ai fait plusieurs à l'époque sur une machine relativement standard : le kernel proposé par Ubuntu prenait 30 secondes à booter, mes kernel customisés pas plus de 10 secondes.

## Quels problèmes cela peut-il engendrer ?

![Kernel Panic]({BASE_URL}/imgs/articles/2017-12-13-understanding-linux-kernel/kernel_panic.jpg)

TL;DR : beaucoup de problèmes, est-ce dangereux pour autant ? Non, à condition de respecter certaines règles.
De la même manière qu'il existe des règles de sécurité en chimie, en bricolage, et j'en passe, il y en a pour se prémunir d'une compilation de Kernel loupée conduisant à une impossibilité de booter.

Dans un cas réel, les problèmes qui peuvent empêcher le boot de votre machine dans l'immédiat sont les suivants :
 - écraser votre ancien kernel ;
 - ne pas avoir de clé/disque bootable avec la distribution Linux de votre choix ;
 - ne pas avoir fait un backup de votre config.

En suivant ces trois règles, rien n'est irréversible dans l'immédiat. Même si vous ne suivez pas ces consignes, vous pourrez toujours rebooter. Le risque est donc présent, mais jamais irréversible, celà peut juste être frustant parfois.

D'expérience, mes deux *pires* problèmes ont été les suivants :
 - compiler un noyau sans le support du système de fichiers ext2 alors que celui-ci était stocké sur une partition ext2 ;
 - supprimer le support de la carte réseau sans clé bootable à portée de main (ce qui implique de ne plus avoir internet).

Notez tout de même ce qu'il suit. Plus le nombre d'expérimentations est grand et réalisé sans trop de méthodologie, plus le risque de voir s'afficher un message "Kernel Panic" est proportionnel. Voyez ça comme le BSOD Windows, que vous aurez provoqué tout seul.
Ici, je laisse H2G2 répondre au problème : "Don't panic", c'est normal, cela arrive de faire des bétises !

## Comprendre le processus de boot

### Firmware & MBR

Au démarrage, le premier élément à être démarré est le firmware (BIOS et EFI sont les plus courants), qui est stocké en ROM.
Celui-ci va appeler le MBR (Master Boot Record), aussi appelé zone d'amorce, stocké lui sur un disque à l'adresse 0 pour une taille de 512 octets. On y trouve notamment les éléments suivants :
 - La table des quatre partitions primaires du disque : 64 octets ;
 - Une "routine" (instructions peremettant de charger le bootloader, nous y reviendrons) : ~440 octets ;

### Bootloader

Le MBR appelle donc le bootloader. Les plus courants sont GRUB & LILO sur Linux.
C'est lors de l'installation du bootloader lui-même qui va mettre dans le MBR la routine lui permettant de se charger.

C'est le bootloader dans notre cas qui va charger tel ou tel noyau pour Linux, et même dans le cas d'un dualboot Linux/Windows, se charger d'appeler le bootloader de Windows.

### Initrd & Kernel

Dans la plupart des distributions grand public, du fait de pouvoir supporter un grand nombre de configurations matérielles, les pilotes sont embarqués dans le noyau en tant que "modules", c'est-à-dire qu'ils seront chargés dynamiquement, et non pas inclus de base dans le noyau. Cela allège la taille du noyau, mais en revanche, cela rend impossible de booter le noyau seul. Dans ce cas, un autre binaire est chargé par le bootloader en même temps que le kernel : Initrd.

L'initrd sert trois objectifs principaux :
 - Monter en RAM un premier système de fichier : initramfs, pour exécuter des tâches telles que monter un vrai système de fichier sur un disque ;
 - Contenir un kernel minimaliste contenant des pilotes indispensables ;
 - Permettre de charger les pilotes compilés en tant que modules dans le vrai noyau.

Si les deux sont chargés, cela implique deux images, et cela se traduit par d'autant plus de RAM utilisée. Voici la taille d'un noyau et de son initrd tous les deux compressés pour une Debian Stretch :

```
alexception@rataxes-HQ:~$ ls /boot -lah
total 13M
drwxr-xr-x  3 root root 4,0K nov.  20 11:44 .
drwxr-xr-x 22 root root 4,0K déc.   1 14:07 ..
-rw-r--r--  1 root root 192K oct.  15 08:57 config-4.13.0-1-amd64
drwxr-xr-x  5 root root 4,0K nov.  20 11:45 grub
-rw-r--r--  1 root root 5,1M nov.  20 11:44 initrd.img-4.13.0-1-amd64
-rw-r--r--  1 root root 2,9M oct.  15 08:57 System.map-4.13.0-1-amd64
-rw-r--r--  1 root root 4,3M oct.  15 08:57 vmlinuz-4.13.0-1-amd64
```

Ce qui nous intéresse ici :
 - initrd.img-4.13.0-1-amd64 - 5.1Mo
 - vmlinuz-4.13.0-1-amd64 - 4.3Mo

Sans compter bien sûr tous les pilotes chargés dynamiquement que l'on peut visualiser (ainsi que leur taille) grâce à la commande `lsmod` :

```
alexception@rataxes-HQ:/boot$ lsmod
Module                  Size  Used by
pci_stub               16384  1
vboxpci                24576  0
vboxnetadp             28672  0
vboxnetflt             28672  0
vboxdrv               442368  3 vboxnetadp,vboxnetflt,vboxpci
...
...
...
xhci_hcd              208896  1 xhci_pci
scsi_mod              212992  3 sd_mod,libata,sg
usbcore               245760  3 usbhid,xhci_pci,xhci_hcd
usb_common             16384  1 usbcore
fan                    16384  0
thermal                20480  0
```

En comptant le nombre de lignes, on s'aperçoit qu'une Debian Stretch charge en plus 145 modules de tailles diverses en RAM.

```
alexception@rataxes-HQ:/boot$ lsmod |wc -l
146
```

Deux "noyaux" sont donc chargés au lieu d'un seul afin de supporter une vaste majorité de matériels & configuration.
En apprenant de votre matériel, ce que nous ferons dans le prochain article, vous pourrez vous passer de l'initrd, et compiler uniquement vos pilotes nécessaires en dur dans votre noyau.

Voilà qui conclut cette première approche du noyau Linux et de quelques généralités concernant son fonctionnement et sa compilation.

## [Bonus] Le "sachiez-tu" ?

Une petite rubrique pour conclure cette introduction à la compilation d'un Kernel avant de rentrer dans le vif du sujet.

 - Linux 4.9 (2016) contient environ 22 million de lignes de code pour 56 000 fichiers ;
 - Le fait pour le noyau d'être open source permet de gérer très rapidement de nombreux devices tels que des Raspberry Pi dernière génération, grâce aux contributions de la communauté ;
 - Il est possible d'avoir plusieurs entrées dans son bootloader (grub/lilo) pour booter sur divers kernels ;
 - Toute la configuration d'un kernel (à compiler/compilé) est disponible dans /usr/src/linux/.config ;
 - Il est possible de configurer des options du kernel comme "modules", ce qui permet d'alléger encore la taille du kernel ; et donc la vitesse de boot ; pour ne les charger que lorsque c'est nécessaire et non au boot ;
 - Sur une distribution Ubuntu, le noyau de base et ses dépendances occupent environ 20Mo compressés sur le disque, sur certains systèmes embarqués cela doit tenir sur 512Ko non compressé en mémoire vive.

## Conclusion

Cette article est le premier d'une série de trois. Vous pouvez retrouver les deux suivants ci-dessous :

- [Je configure mon noyau GNU/Linux (partie 2)]({BASE_URL}/fr/configurer-kernel-linux/)
- [Je compile mon noyau GNU/Linux (partie 3)]({BASE_URL}/fr/compiler-kernel-linux/)
