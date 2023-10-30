---
contentType: article
lang: fr
date: '2017-12-15'
slug: compiler-kernel-linux
title: 'Pour Noël, je compile mon noyau GNU/Linux !'
excerpt: >-
  Le moment tant attendu est finalement arrivé, il est tant de : compiler,
  installer, tester (kernel-paniquer, recompiler, réinstaller, retester).
cover: /assets/2017-12-15-compiling-linux-kernel/cover.jpg
categories: []
authors:
  - aandre
keywords:
  - linux
  - kernel
  - compilation
  - gentoo
---

Cette article fait suite à un article intitulé [Je configure mon noyau GNU/Linux (partie 2)]({BASE_URL}/fr/configurer-kernel-linux/) et en dépend. Si vous ne l'avez pas lu, je vous invite à le faire.

Le moment tant attendu est finalement arrivé, il est tant de : compiler, installer, tester (kernel-paniquer, recompiler, réinstaller, retester).

## Compilation

Ici rien de très compliqué nous allons juste lancer la compilation du noyau et des potentiels modules avec l'option -j4, ce qui correspond à paralléliser sur 4 coeurs de microprocesseur.
La règle empirique est de faire 1 core = 1 job, vous pouvez connaître le nombre de coeur de votre microprocesseur via la commande `nproc` ou via `cat /proc/cpuinfo |grep processor` :
```
# make -j4 & make -j4 modules_install
```

Je vous vois venir :

> Et qu'est-ce qu'on fait  pendant que ça compile ? Ça dure longtemps ?

Déjà assurez-vous que votre processeur n'est pas trop utilisé par d'autres tâches, cela accélère grandement la compilation.
Par exemple évitez de miner de la crypto-monnaie sur votre processeur en même temps.
Et pour répondre, pendant que ça compile on fait autre chose :

![On attend...]({BASE_URL}/imgs/articles/2017-12-15-compiling-linux-kernel/wait.gif)

### Si ça plante ?

Parfois on a pas besoin d'attendre longtemps pour que la compilation s'arrête et affiche une erreur.
Ces erreurs sont au cas par cas, encore une fois un moteur de recherche sur le message d'erreur précédé des mots clés `kernel compile` devrait vous aider.

### Comment sait-on que ça a réussi ?

Lorsque qu'il n'y a pas d'erreurs :D

Plus sérieusement, en cherchant un fichier `bzImage` dans `/usr/src` :
```
# find ./ -iname "bzImage"
./arch/x86/boot/bzImage
./arch/x86_64/boot/bzImage
# ls -lh ./arch/x86_64/boot/bzImage
lrwxrwxrwx 1 root root 22 déc.  15 02:09 ./arch/x86_64/boot/bzImage -> ../../x86/boot/bzImage
# ls -lh ./arch/x86/boot/bzImage
-rw-r--r-- 1 root root 3.7M déc.  15 02:09 ./arch/x86/boot/bzImage
```

Les date & heure sont bonnes, la taille correcte, tout est bon.

## Installation

Pour installer le kernel dans son répertoire, il suffit de lancer la commande suivante :
```
make install
```

Cela effectue plusieurs tâches :
 - copier le binaire du kernel `./arch/x86/bzImage` => `/boot/vmlinuz-4.14.5`.
 - copier la configuration écrite dans le fichier `./.config` => `/boot/config-4.14.5`
 - copier le fichier `./System.map` => `/boot/System.map-4.14.5`
 - créer un `/boot/initrd.img-4.14.5`

 Deux choses devraient vous choquer ici.
 Pourquoi diantre a-t-on un fichier initrd, alors que nous n'en voulions pas ? La réponse est simple. C'est comme ça que fait make install, mais rien ne nous oblige à l'utiliser.
 Et quel est ce mystérieux fichier System.map ? Il contient tout simplement l'adresse mémoire d'un bon nombre de fonctions et de variables (83334 dans mon cas) :

```
# cat System.map
0000000000000000 D __per_cpu_start
0000000000000000 D irq_stack_union
00000000000001cf A kexec_control_code_size
0000000000004000 d exception_stacks
0000000000009000 D gdt_page
000000000000a000 D espfix_waddr
000000000000a008 D espfix_stack
000000000000a020 D cpu_llc_id
000000000000a040 D cpu_llc_shared_map
000000000000a080 D cpu_core_map
000000000000a0c0 D cpu_sibling_map
000000000000a100 D cpu_info
000000000000a1e8 D cpu_number
# cat System.map |wc -l
83334
```
Ce fichier est essentiellement utilisé par le Kernel. Notez que si vous recompilez votre kernel, le System.map sera différent.

## Bootloader

Étant donné que la plupart des gens utilisent GRUB 2, nous allons effectuer cette manipulation pour ce bootloader.
Référez-vous à la documentation de votre bootloader si vous n'utilisez pas GRUB 2.

nous allons donc ajouter une entrée custom dans /etc/grub.d/40_custom afin qu'il ressemble à ce qui suit :
```
#!/bin/sh
exec tail -n +3 $0
# This file provides an easy way to add custom menu entries.  Simply type the
# menu entries you want to add after this comment.  Be careful not to change
# the 'exec tail' line above.

menuentry "deb 4.14.5 no initrd" {
  set root=(hd0,1)
  linux /boot/vmlinuz-4.14.5 root=/dev/sda1 ro quiet
}
```

Pour savoir qui indiquer pour les `root=`, nous allons afficher notre table de montage des partitions :
```
# cat /etc/fstab
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sda1 during installation
UUID=d3cdbebd-8030-45af-8f53-5910d38f8493 /               ext4    errors=remount-ro 0       1
# swap was on /dev/sda5 during installation
UUID=068aa3bb-48b2-4bb8-af83-8d603bc80931 none            swap    sw              0       0
```

### Cas basique

Dans mon cas je n'ai qu'une partition réelle : `sda1` montée à la racine `/` de mon système de fichier.
Donc je sais que je peux renseigner `root=(hd0,1)` et `root=/dev/sda1`.

### Cas de plusieurs zone de stockage

Si ma partition avait été `/dev/sdb1`, j'aurais renseigné `root=(hd1,1)` et `root=/dev/sdb1`

### Cas de plusieurs partitions dont l'une sur /boot

Maintenant si j'avais deux partitions `/dev/sda1` et `/dev/sda2`, la première sur `/` et l'autre sur `/boot`.
J'utiliserais alors `/dev/sda2` parce que le kernel se trouve sur `/boot`, donc c'est une partition qui est bootable (en effet, il existe des partitions non bootables, il faut switcher un flag avec un gestionnaire de partition tel que `fdisk`).
Donc dans mon fichier grub j'aurais à la première ligne `set root=(hd0,2)` et à la seconde `linux /vmlinuz-4.14.5 root=/dev/sda2 ro quiet` (notez que la nous n'avons pas préfixé le noyau de `/boot`)

### Mapping /dev/sd* / hd*,*

| /dev/sd*  | hd*,* |
|-----------|-------|
| /dev/sda1 | hd0,1 |
| /dev/sda2 | hd0,2 |
| /dev/sda3 | hd0,3 |
| /dev/sdb1 | hd1,1 |
| /dev/sdb2 | hd1,2 |

Bref vous aurez compris le fonctionnement.

## Mettre à jour grub

Sauvegardez le fichier, et lancez la commande `update-grub`. Cette commande va scanner le dossier /boot et ajouter automatiquement à GRUB tous les noyaux qu'elle trouve.

Là vous vous posez sûrement une question :
> Pourquoi avoir modifié un fichier et s'être pris la tête sur les partitions, si grub le fait automatiquement ?

La réponse est simple, l'entrée ajoutée à grub ajoute le initrd avec, sauf que nous ne voulons pas l'utiliser, donc nous avons ajouté une entrée custom.

Il n'y a plus qu'à rebooter et sélectionner notre nouvelle entrée :

![grub]({BASE_URL}/imgs/articles/2017-12-15-compiling-linux-kernel/grub.png)

Puis le moment tant attendu arriva... Le saint Graal de toute personne qui compile son Kernel ! Le Mother Fucking Kernel Panic

![Kernel Panic]({BASE_URL}/imgs/articles/2017-12-15-compiling-linux-kernel/kernel_panic.png)

Bon dans mon cas précis j'ai vite fait trouvé l'erreur, je l'ai fait sur une VM (c'est plus simple pour les screenshots) sauf que j'ai désactivé le support des systèmes de fichiers virtuels (VFS). L'erreur est en général beaucoup plus parlante que sur un BSOD Windows !

## Conclusion

C'est dorénavant à vous de jouer, vous savez comment compiler votre Kernel.
Si vous avez des Kernel Panic encore une fois c'est normal, c'est même mieux, c'est en faisant des erreurs qu'on apprend !
Il vaut mieux avoir trop de Kernel Panic et savoir comment les résoudre, que ne pas en avoir et dire "je sais compiler mon Kernel".
L'avantage c'est que le Kernel évolue toujours !
Des drivers & autres options sont ajoutés à chaque nouvelle version, de nouveaux devices/matériels sont créés, et de nouveaux matériels sont donc supportés !
C'est donc une source intarissable d'apprentissage !

Cette article est le dernier d'une série de trois. Vous pouvez retrouver les précédents ci-dessous :

- [Je comprends mon noyau GNU/Linux (partie 1)]({BASE_URL}/fr/comprendre-kernel-linux/)
- [Je configure mon noyau GNU/Linux (partie 2)]({BASE_URL}/fr/configurer-kernel-linux/)
