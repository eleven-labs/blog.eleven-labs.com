---
contentType: article
lang: fr
date: '2017-12-14'
slug: configurer-kernel-linux
title: 'Pour Noël, je configure mon noyau GNU/Linux !'
excerpt: >-
  Maintenant que nous avons compris de façon générale comment fonctionnait le
  noyau Linux dans le précédent article, voyons comment le configurer afin, à
  terme, de le compiler et l'utiliser.
cover: /assets/2017-12-14-configuring-linux-kernel/cover.jpg
categories: []
authors:
  - aandre
keywords:
  - linux
  - kernel
  - compilation
  - gentoo
---

Cette article fait suite à un article intitulé [Je comprends mon noyau GNU/Linux (partie 1)]({BASE_URL}/fr/comprendre-kernel-linux/) et en dépend. Si vous ne l'avez pas lu, je vous invite à le faire.

Maintenant que nous avons compris de façon générale comment fonctionnait le noyau Linux dans le précédent article, voyons comment le configurer afin, à terme, de le compiler et l'utiliser.

Je considère dorénavant que votre choix est fait sur comment compiler votre Kernel par l'usage d'une des solutions suivantes :
 - Sur votre machine actuelle ;
 - Sur une ancienne machine ;
 - Sur une VM type VirtualBox ;
 - Sur un container Docker.

À noter encore une fois que nous n'écraserons pas votre ancien Kernel, l'exemple est donc beaucoup plus concret en utilisant votre machine ou une ancienne machine.

Afin de correspondre à une majorité de personnes sous Linux, je vais jouer le rôle de l'initrd, et fournir des commandes pour Debian et toutes distributions qui héritent de Debian.
Par ailleurs, certains faits énoncés ne seront pas toujours vrais selon les distributions ainsi que les versions des distributions.
Je pars du principe que vous avez la version la plus naïve d'une distribution Debian. Donc il se peut, à votre avantage, que certaines manipulations ne soient pas à réaliser.

## Un peu de théorie

Abordons tout d'abord très rapidement quelques notions théoriques.

### Notions d'architecture

Avant de compiler son noyau soi-même, encore faut-il disposer d'un environnement propice à sa compilation. Mais bien souvent, vous n'avez pas cet environnement de compilation.
En effet, lorsque vous téléchargez une image bootable de votre future distribution, vous avez souvent le choix entre les architectures amd64 et x86. Cela correspond aux deux types de processeurs majeurs du marché sur ordinateur standard.
Cependant il en existe d'autres pour des processeurs mais également des microcontrôleurs (les microcontrôleurs étant assimilables à des microprocesseurs de basse consommation énergétique) : arm, sparc, hppa, etc.

### Le cas de la cross-compilation

Dans de très rares cas, la distribution que vous souhaiterez utiliser ne proposera pas votre type de microcontrôlleur ou microprocesseur.
C'est là qu'intervient là cross-compilation. Il s'agit d'utiliser une machine source, pour compiler un exécutable pour un autre type d'architecture cible, et d'aller *pusher* l'exécutable final dans la mémoire de la cible.
Ce n'est cependant pas le sujet de cet article tant cela est rare et destiné à des systèmes embarqués très particuliers.

### Absence des outils de compilation

Dans la plupart des cas (sauf distributions isolées telles que Gentoo), le noyau ne sera pas compilé, mais sera copié depuis l'image ISO de la distribution que vous souhaitez utiliser. D'où l'intérêt de bien choisir le type d'architecture. Cela explique aussi pourquoi de base, vous n'avez pas les outils de compilation nécessaires.

## Step 1 : Récupérer le Kernel

Comme je souhaite que cet article soit le plus agnostique possible de la distribution utilisée, nous allons récupérer les sources directement depuis kernel.org, mais sachez que chaque distribution fourni en général un package permettant de récupérer les sources de façon automatisée. Les manipulations que vous allez effectuer sont donc l'équivalent de ce que fait votre distribution quand vous lui dites "je veux installer les sources du kernel pour les compiler".
Sauf qu'ici nous allons outrepasser les sécurités d'usage de votre gestionnaire de paquet qui peuvent vous interdire d'installer la dernière version du noyau, car il n'a pas été validé par la Core Team de la distribution, ce qui est potentiellement le cas pour Debian.

Lorsque j'écris ces lignes, le noyau est en version 4.x, plus précisément en 4.14.5. La liste est donc disponible ici : [](https://www.kernel.org/pub/linux/kernel/v4.x/). Exécutons les commandes suivantes :

```
# cd /usr/src
# wget -c --no-check-certificate https://www.kernel.org/pub/linux/kernel/v4.x/linux-4.14.5.tar.gz
# tar xvzf linux-4.14.5.tar.gz
```

En premier lieu, nous nous sommes placés dans le répertoire conventionnel des sources du noyau linux (à priori il ne contient rien sauf pour certaines distributions).
À priori vous mettez les sources où vous le souhaitez (sauf dans /dev/null tant qu'à faire), mais /usr/src pour les puristes reste la zone où stocker les sources des différentes versions du Kernel avec leurs configurations respectives.
J'irais même plus loin en vous disant : versionnez vos configuration de kernel avec git par exemple, mais cela fera un très bon sujet d'article de ma part sur la globalité de votre système.

## Step 2 : Outils permettant de configurer & compiler le kernel

Avoir les sources du Kernel c'est bien, pouvoir en tirer quelque chose, c'est mieux.

### Installer les utilitaires nécessaires

Nous aurons besoin des programmes suivants :

 - make
 - gcc
 - ncurses-dev

Sous Debian ces programmes sont installables via l'une des deux méthodes suivantes :
```
# apt-get install make gcc libncurses5-dev
# apt-get install build-essential libncurses5-dev
```

ncurses-dev n'est pas obligatoire mais dans ce cas, vous devrez répondre à autant de question qu'il y a d'options à configurer dans le noyau.

Sans ncurses-dev, `make config` :

![Vue make config]({BASE_URL}/imgs/articles/2017-12-14-configuring-linux-kernel/make_config.png)

*Have fun ! On se revoit dans 10 jours quand vous aurez fini de configurer votre kernel :troll:*

Avec ncurses-dev, `make menuconfig` (ou `make nconfig` pour un style plus épuré) :

![Vue make menuconfig]({BASE_URL}/imgs/articles/2017-12-14-configuring-linux-kernel/make_menuconfig.png)

*Bien plus user-friendly*

## Step 3 : Comprendre et apprendre de sa machine

Là vous vous dites sûrement :

> ok `make menuconfig` c'est bien, mais je ne comprends rien.

C'est là que la commande `lspci` va nous être très utile. Elle permet de lister tous les périphériques PCI : cartes graphiques, cartes réseau, cartes son, etc :
Cette commande dispose d'ailleurs d'options très utiles :

 - `-k` : permet d'afficher le driver utilisé par le kernel pour piloter ce périphérique ;
 - `-q` : parfois certains périphériques ne sont pas reconnus localement via leur ID, cette option permet d'interroger la base de données centrale des PCI ID pour les reconnaître.

Pour tout autres type de périphériques externes vous devriez déjà avoir les références.

### Google is your friend

Une fois que vous avez les informations de votre matériel, Google is your friend.
Par exemple je dispose d'un pilote graphique intégré Intel HD Graphics 430, ma recherche sera `intel hd graphics 430 linux kernel`, et une rapide recherche me confirmera que le driver à utiliser est le i915. Ce qui était d'ailleurs le résultat de `lspci -k` :

```
00:02.0 VGA compatible controller: Intel Corporation HD Graphics 530 (rev 06)
	Subsystem: Dell HD Graphics 530
	Kernel driver in use: i915
	Kernel modules: i915
```

## Step 4 : Choisir son type de configuration

"Il y a 10 types de personnes, celles qui configurent leur noyau à partir de la configuration de leur noyau actuel, et celles qui partent de la configuration de base imposée par les sources du Kernel pour la distribution voulue."

### A. Depuis une configuration "vierge"

Je n'ai jamais configuré de noyau avec la configuration de base de Kernel.org, mais j'imagine sans trop spéculer, que la configuration proposée se doit d'être plutôt neutre par rapport aux distributions qui vont se greffer par dessus et surtout par rapport au hardware.
Il y a donc potentiellement plus de choses à configurer, le but n'étant pas de vous dégoûter de la compilation de kernel, cet article traîtera uniquement de l'option B.

### B. Depuis une configuration existante

C'est la solution la plus utilisée : partir d'une configuration de Kernel imposée par votre distribution, bien trop lourde, pour retirer l'inutile. Comme je l'expliquais, cet article reprend les concepts de Debian & Ubuntu, on se base sur un noyau assez gourmand.
Autre avantage, ce choix permet d'itérer, en retirant des pilotes pas à pas (d'où encore, l'intérêt de versionner la configuration de son noyau). Je recommande vivement cette méthode en faisant confiance à la configuration du Kernel proposée par votre distribution, qui est souvent en adéquation avec votre volonté de choisir cette distribution plutôt qu'une autre.

## Step 5 : Configuration

C'est parti, il est temps de commencer :
```
# cd linux-4.14.5
```
### Récupérer notre configuration actuelle

Comme je le disais nous allons récupérer la configuration du noyau actuel. Deux possibilités s'offrent à nous :
```
# zcat /proc/config.gz > /usr/src/linux-4.14.5/.config
# cat /boot/config-$(uname -r) > /usr/src/linux-4.14.5/.config
```

### menuconfig

Nous allons enfin pouvoir configurer notre noyau.
```
# make menuconfig
```

#### Quelques commandes utiles

 - Le slash `/` permet de faire une recherche ;
 - Les flèches directionnelles up/down permettent de sélectionner une option ;
 - Les flèches directionnelles left/right permettent de switcher dans le menu du bas : select/exit/help/save/load.
 - La touche espace permet de switcher une option :
    - `[*]` option activée en dur dans le kernel
    - `[M]` option activée en tant que module, et qui ne sera pas directement embarquée dans le kernel
    - `[ ]` option désactivée
 - La touche entrée permet de valider l'une des options du menu du bas.

#### Explication des menus

General setup : comme son nom l'indique il traite de configurations générales, telles que :
    - Initrd
    - Type de compression du module
    - Optimisation de compilation taille vs. performance
    - etc...

Il y a des options qu'il est préférable de ne pas désactiver par hasard (lisez l'aide associée à l'option, faites des recherches sur le web). Par exemple si vous désactivez le support de la Swap sur une machine avec très peu de RAM, vous voudrez sûrement y penser à deux fois.

Loadable module support : Permet d'activer ou non la possibilité d'utiliser la compilation en tant que module, et de charger des modules autour du noyau. En effet, ce n'est pas parce vous désactivez l'initrd qu'il vous sera impossible de charger des modules. Néanmoins tous les pilotes nécessaires au boot devront être compilés en dur.

Block layer : cela fait partie des options que je ne m'amuse pas à désactiver, puisque je n'en ai jamais eu l'utilité.
Une rapide lecture de l'aide m'indique que sans cette option, je risque de me tirer une balle dans le pied, en rendant inutilisables certains systèmes de fichiers.

Processor type & features : comme son nom l'indique tout ce qui touche au processeur.
Comme pour le general setup il y a des modifications qu'il est préférable de ne pas changer sans maîtriser.

Power management & ACPI : tout ce qui touche à la gestion de la consommation, très utile notamment pour les laptops.

Bus options : Tout ce qui gère les différents bus, évitez de désactiver le PCI, mais vous pourriez très bien en activer d'autres tels que PCMCIA.

Executable file formats : l'intitulé est trompeur. Je vous invite à regarder plus en détails l'aide de chacune des options.
C'est ici que vous pourriez décider de ne plus supporter les librairies 32bits lorsque vous êtes sur du amd64.

Networking support : le nom parle de lui-même.
Il y a beaucoup de choses qui peuvent être désactivées ici.
Pour le sous-menu `networking options` soyez prudent, certaines options ne devraient pas être désactivées tandis que d'autres sont totalement inutiles si vous n'utilisez pas la machine pour faire un routeur comme `IP: advanced router`.

Device drivers : Ce menu contient tous les drivers pour carte graphique, audio, réseaux, tout ! C'est là que vous désactiverez le plus de choses. Faites-vous plaisir mais n'oubliez pas google et `lspci`.

Firmware drivers : cela permet au kernel de dialoguer avec le firmware (BIOS, EFI, etc.) pour obtenir des informations supplémentaires.

File systems : de nombreux systèmes de fichiers sont disponibles ici, c'est en connaissant les différents filesystems que vous utilisez que vous saurez lesquels activer ou non.
Rappelez-vous néanmoins que si vous désactivez l'initrd, si votre disque est disons en ext3, il vous faudra impérativement activer l'ext3 en dur dans le noyau et non en tant que module si vous ne voulez pas d'un joli kernel panic.

Kernel hacking, security options, cryptographic API, Virtualization, library routines : je n'ai jamais trop joué avec ces menus, mais leurs noms sont assez parlants pour se passer d'explications supplémentaires. Il y a sûrement quelques kilo-octets à grapiller dans certains (notamment la virtualisation).

#### Désactiver initrd

Dans notre cas, nous voulions nous passer de l'initrd. Une brève recherche m'indique que je peux trouver cette option dans le menu general setup :
![Recherche initrd]({BASE_URL}/imgs/articles/2017-12-14-configuring-linux-kernel/search_initrd.png)

Il me suffit de m'y rendre pour le désactiver.
En faisant ça je m'assure que l'initrd ne pourra jamais être utilisé, ce qui m'oblige à avoir un noyau très épuré, avec les drivers nécessaires au boot compilés en dur dans le Kernel.

#### Retirer les drivers graphiques inutiles

Dans mon cas je sais que mon driver graphique est l'i915, une nouvelle recherche sur `i915` m'indique que plusieurs options sont disponibles :
```
Symbol: DRM_I915 [=m]
Type  : tristate
Prompt: Intel 8xx/9xx/G3x/G4x/HD Graphics
  Location:
    -> Device Drivers
      -> Graphics support
Defined at drivers/gpu/drm/i915/Kconfig:1
Depends on: HAS_IOMEM [=y] && DRM [=m] && X86 [=y] && PCI [=y]
Selects: INTEL_GTT [=y] && INTERVAL_TREE [=y] && SHMEM [=y] && TMPFS [=y] && DRM_KMS_HELPER [=m] && DRM_PANEL [=y] && DRM_MIPI_DSI [=y] && RELAY [=y] && BACKLIGHT_LCD_SUPPORT [=y]
```
C'est donc dans le sous-menu graphics support que je vais aller activer l'option si ce n'est pas déjà fait, et désactiver ce qui me semble inutile (c'est à dire d'autres pilotes graphiques).

![Menu graphics]({BASE_URL}/imgs/articles/2017-12-14-configuring-linux-kernel/graphics.png)

Comme vous le voyez, tout est compilé en modules, et quasiment toutes les cartes sont supportées ! Faisons un peu de ménage.

![Twelve seconds later]({BASE_URL}/imgs/articles/2017-12-14-configuring-linux-kernel/12s.jpg)

![Menu graphics propre]({BASE_URL}/imgs/articles/2017-12-14-configuring-linux-kernel/clean_graphics.png)

C'est beaucoup plus digeste !

#### Jouez & apprenez !

Comme je l'expliquais la plupart des optimisations sont à faire dans le menu "device drivers".
Jouez, lisez les différentes aides, utilisez abondamment vos moteurs de recherche pour apprendre ce que vous pouvez ou non enlever en fonction de vos périphériques.

## Conclusion

Nous verrons dans le prochain article comment compiler notre noyau.
En attendant, jouez avec les différentes options, et essayez d'apprendre de votre matériel et du kernel.
Si vous avez tenté d'optimiser au maximum votre kernel, votre première compilation sera probablement défectueuse :D

Cette article est le second d'une série de trois. Vous pouvez retrouver le précédent et le suivant ci-dessous :

- [Je comprends mon noyau GNU/Linux (partie 1)]({BASE_URL}/fr/comprendre-kernel-linux/)
- [Je compile mon noyau GNU/Linux (partie 3)]({BASE_URL}/fr/compiler-kernel-linux/)
