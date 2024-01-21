---
contentType: article
lang: fr
date: '2024-01-21'
slug: introduction-gentoo
title: 'Introduction à la distribution Linux Gentoo'
excerpt: >-
  Nous avions vu comment compiler son noyau Linux quelque soit sa distribution,
  apprenons maintenant à tirer parti des connaissances acquises sur le peu de
  compilations effectuées pour le kernel, et installer une distribution que l'on
  qualifie de "source" : Gentoo.
categories: []
authors:
  - aandre
keywords:
  - linux
  - kernel
  - compilation
  - gentoo
---

En 2017, j'avais commencé une suite d'articles concernant le noyau Linux: *[Pour Noël, je comprends mon noyau GNU/Linux !]({BASE_URL}/fr/comprendre-kernel-linux/)* par cette citation :

> Pourquoi compiler son noyau alors qu'on a tous au moins 8 Go de mémoire vive me direz vous ? Pourquoi aller optimiser son Kernel alors que l'on peut exploiter la mémoire vive à fond ?

La réponse est toujours la même, et afin de relancer la visibilité sur ces trois articles (pas folle la guêpe !), vous aurez la réponse à la question citée précédemment en relisant ces trois articles.

Plus sérieusement, je vous incite à lire cette série de trois articles en préambule, car cette nouvelle série d'articles concernant Gentoo, portera également sur le noyau.

## Une histoire de philosophie

Au même titre que Debian ou Ubuntu, les distributions les plus connues du grand public, il existe d'autres distributions GNU/Linux avec d'autres philosophies et ou d'autres préceptes.
Qui reposent sur... (et c'est là où vous avez je l'espère lus, les articles concernant le kernel) : le noyau GNU/Linux.
Donc on peut déjà dire que toutes les distributions GNU/Linux reposent sur une même philosophie : le partage.

### Philosophies, préceptes, quels sont-ils ?

La réponse est : ça dépend.
Je vais plus parler de préceptes que de philosophie.
Je n'ai pas l'intention de faire un liste exhaustive de toutes les distributions Linux existantes et encore moins de chacunes de leurs orientations techniques et philosophiques.
Et encore moins  sans me faire taper dessus par des personnes plus compétentes que moi en la matière, mais on peut retenir quelques élements pour au moins Debian et Ubuntu.

Pour Debian, les mots clés sont : la stabilité, la robustesse, et le pluralisme.
Autrement dit, une distribution très fiable, exempte de bugs (ou très peu) sur les stable releases, et qui puisse s'installer sur tous les systèmes sans trop de modifications.

Pour Ubuntu, qui n'est ni plus ni moins qu'un fork de Debian, c'est l'accessibilité et la facilité à tous (même pour tata).
En gros c'est comme Debian avec une interface graphique proche de Windows ou de Mac selon les versions.
Avec en plus une facilité d'installation déconcertante et d'utilisation, qui consiste pour un novice qui ne veut pas s'embêter à cliquer sur "suivant", "suivant", "suivant", "insérer votre prénom", "insérez votre mot de passe", "suivant", "suivant", "suivant", "redémarrer".
Sur la stabilité on repassera, c'est un des points selon moi qui nuisent à son usage. À vouloir tout faire, on fait tout mal.
C'est mon point de vue vous n'êtes pas obligé de l'accepter ni de le partager :).

### Mais y'a pas un glandu qui s'est dit "on va faire une distrib' universelle" ?

Sûrement que si, mais ça ne marchera probablement jamais.

Chaque distribution sert des objectifs précis qui ne conviennent pas à tous les utilisateurs.
Il y a des distributions qui fournissent clé en main tous les outils pour faire des audits de sécurité,
ou pirater le wifi mal sécurisé du voisin quand t'es étudiant au CROUS en 2009 (pardon Livebox-7732, mais j'avais besoin d'Internet pour télécharger des fi... faire mes devoirs).

Il y a des distributions par ailleurs plus orientées pour les smarphones, Android en est une.
C'est plus compliqué que ça, mais l'idée est là.
Enfin non c'est pas plus compliqué, si je commence à dire "c'est compliqué", vous êtes pas prêts pour cette suite d'articles : pour Android, ils ont forké le noyau pour leur besoins.

Prenons un dernière exemple, il a pléthore de distributions optimisées pour Raspberry Pi : domotique, retro gaming, media center, etc.

Bref il y a plein de raisons qui font qu'une distribution existe ou non.
Et si vous ne trouvez pas une distribution qui vous convienne, il y a deux solutions :
 - Vous n'avez pas assez bien cherché parmi la liste des [distributions existantes](https://en.wikipedia.org/wiki/List_of_Linux_distributions) ;
 - Vous avez un besoin très spécifique et dans ce cas vous ne devriez pas lire cet article mais plutôt chercher du côté de [LFS](https://www.linuxfromscratch.org/lfs/).

### Et Gentoo dans tout ça ?

![Gentoo]({BASE_URL}/imgs/articles/2024-01-21-gentoo-introduction/gentoo.png)
C'est le logo le plus éclaté de toutes les distributions Linux, mais le graphisme ne fait pas parti de la philosophie Gentoo !
Le but c'est la rapidité rien d'autre !

Pour Gentoo, la philosophie est radicalement différente des distributions citées plus haut.
Pour être plus clair :

 - La robustesse ? C'est vous ;
 - La  stabilité ? C'est vous ;
 - La fiabilité ? c'est vous ;
 - Le pluralisme ? C'est vous (c'est faux, j'y reviendrai).

> Mais pourquoi je voudrais faire tout ça moi-même ?

Gentoo est une distribution que l'on qualifie de *distribution source* à l'inverse des distributions binaires telles que Debian et Ubuntu par exemple.
C'est-à-dire que vous compilez absolument tous les logiciels que vous allez utiliser sur votre machine.

L'intérêt de l'un ou de l'autre ?

Pour les distributions à base de binaires, la compilation a déjà a été faite pour votre architecture avec le plus d'options possible pour matcher votre matériel.
L'intérêt est donc d'avoir un logiciel qui fonctionne très rapidement (le temps de téléchargement du fichier binaire pouvant être souvent plus long que l'installation elle même si vous n'êtes pas fibrés).

Pour les distributions source, c'est d'optimiser aux petits oignons tous les paramètres.
Un peu à la manière d'une voiture full options, plutôt que d'avoir toutes les options ce qui ferait gonfler le prix, vous allez dire "je vais me passer du lecteur CD, j'ai plus de CD, j'ai mon smartphone, Spotify.
Par contre j'ai besoin du bluetooth", "le cuir, c'est froid l'hiver, chaud l'été, très peu pour moi, et ça m'emmerde d'avoir le siège chauffant parce que ça résoud pas le problème l'été".

En fait, avec des distributions sources vous pourriez même dire "je conduis sans ceinture de sécurité, et sans moteur, parce que ma voiture sera à pédales, mais il faudra un casque, mais elle fera ce que j'ai décidé qu'elle fasse, à savoir finir premier de la course de caisse à savon de Crépy-en-Valois".

![Caisses à savon]({BASE_URL}/imgs/articles/2024-01-21-gentoo-introduction/caisses-a-savon.jpg)

Oui, c'est une voiture de caisse à savon de l'édition de Crépy-en-Valois, spoiler, aucune distribution Linux dedans, c'était pour donner un exemple.

## Gentoo, plus en détails

J'imagine que vous n'êtes pas encore convaincus pour beaucoup d'entre vous.
Et c'est normal, cette notion de rapport qualité/prix, sachant que le prix est 0, est impossible à résoudre.
Le rapport qualité/temps à l'air mauvais en surface.
Et surtout je vous vois venir :

> Mais je dois tout compiler moi-même ? à la main ?! Je suis pas fou !

C'est la première question que je me suis posé en 2009.
Je me la suis posée pour une raison simple, j'avais un dual boot Windows/Ubuntu, mais mon vieux laptop boudait un peu, et démarrait en quelques minutes (en plus de ne pas avoir de batterie).
Un vieux CPU pas trop de RAM, pas d'argent, c'était impossible pour moi de changer d'ordinateur durant mes études.

Alors j'ai cherché une distribution capable de résoudre ce problème.
La réponse était Gentoo.
Ça aurait pu être Arch Linux (une distrib' source et binaire à la fois, mais ils ont fait de la merde vers 2013, du coup je suis toujours fâché).

### Optimisation des paquets

Donc pour en revenir à nos manchots, non sur Gentoo on ne compile pas à la main tout nous même.
Il y a un gestionnaire de paquets pour compiler et installer chaque software.
Prenons `mplayer` par exemple, la compilation et l'installation peut se limiter à la simple commande suivante :

`$ emerge media-video/mplayer`

Facile nan ? Ok je vous vois encore une fois venir :

> En fait c'est pareil que Debian, mais on compile, donc c'est plus long pour le même résultat ? Autant rester sur Debian.

On va en premier lieu simuler l'installation de `mplayer` si je devais le compiler et installer en l'état :

```bash
livecd / # emerge -pv media-video/mplayer

These are the packages that would be merged, in order:

Calculating dependencies... done!
Dependency resolution took 13.81 s (backtrack: 0/20).

[ebuild  N     ] dev-libs/lzo-2.10:2::gentoo  USE="(split-usr) -examples -static-libs" 587 KiB
[ebuild  N     ] media-libs/libdvdcss-1.4.3:1.2::gentoo  USE="-doc" 380 KiB
[ebuild  N     ] media-libs/alsa-topology-conf-1.2.5.1::gentoo  12 KiB
[ebuild  N     ] media-libs/alsa-ucm-conf-1.2.10-r1::gentoo  44 KiB
[ebuild  N     ] media-fonts/liberation-fonts-2.1.5::gentoo  USE="-X -fontforge" 2330 KiB
[ebuild  N     ] x11-base/xorg-proto-2023.2::gentoo  USE="-test" 742 KiB
[ebuild  N     ] dev-lang/nasm-2.16.01-r1::gentoo  USE="-doc" 994 KiB
[ebuild  N     ] media-libs/libpng-1.6.40-r1:0/16::gentoo  USE="-apng -static-libs" CPU_FLAGS_X86="sse" 998 KiB
[ebuild  N     ] virtual/ttf-fonts-1-r2::gentoo  0 KiB
[ebuild  N     ] media-libs/alsa-lib-1.2.10-r2::gentoo  USE="-alisp -debug -doc -python" PYTHON_SINGLE_TARGET="python3_11 -python3_10" 1082 KiB
[ebuild  N     ] app-i18n/enca-1.19-r3::gentoo  USE="iconv (-doc) -recode" 455 KiB
[ebuild  N     ] dev-lang/yasm-1.3.0-r1::gentoo  USE="nls" 1458 KiB
[ebuild  N     ] app-eselect/eselect-fontconfig-20220403::gentoo  2 KiB
[ebuild  N     ] media-gfx/graphite2-1.3.14_p20210810-r3::gentoo  USE="-perl -test" 6501 KiB
[ebuild  N     ] x11-libs/pixman-0.42.2::gentoo  USE="(-loongson2f) -static-libs -test" CPU_FLAGS_X86="mmxext sse2 ssse3" 638 KiB
[ebuild  N     ] app-eselect/eselect-cdparanoia-0.1-r1::gentoo  0 KiB
[ebuild  N     ] media-libs/freetype-2.13.2:2::gentoo  USE="adobe-cff bzip2 cleartype-hinting png -X -brotli -debug -doc -fontforge -harfbuzz -static-libs -svg -utils" 2444 KiB
[ebuild  N     ] dev-libs/libcdio-2.1.0-r1:0/19::gentoo  USE="cxx -cddb -minimal -static-libs -test" 1718 KiB
[ebuild  N     ] media-libs/libdvdread-6.1.3:0/8::gentoo  USE="css -static-libs" 387 KiB
[ebuild  N     ] x11-libs/xtrans-1.5.0::gentoo  USE="-doc" 167 KiB
[ebuild  N     ] x11-libs/libXau-1.0.11::gentoo  USE="-doc" 268 KiB
[ebuild  N     ] x11-libs/libXdmcp-1.1.4-r2::gentoo  USE="-doc" 289 KiB
[ebuild  N     ] x11-base/xcb-proto-1.16.0::gentoo  PYTHON_TARGETS="python3_11 -python3_10 (-python3_12)" 149 KiB
[ebuild  N     ] dev-libs/fribidi-1.0.13::gentoo  USE="-doc -test" 1143 KiB
[ebuild  N     ] media-libs/dav1d-1.2.1:0/6::gentoo  USE="8bit 10bit asm -test -xxhash" 853 KiB
[ebuild  N     ] media-libs/fontconfig-2.14.2-r3:1.0::gentoo  USE="nls -doc -test" 1408 KiB
[ebuild  N     ] x11-libs/libxcb-1.16:0/1.12::gentoo  USE="xkb -doc (-selinux) -test" 443 KiB
[ebuild  N     ] media-video/ffmpeg-6.0-r9:0/58.60.60::gentoo  USE="bzip2 dav1d encode gnutls gpl iconv network pic postproc threads zlib -X -alsa (-amf) -amr -amrenc (-appkit) -bluray -bs2b -cdio -chromaprint -chromium -codec2 -cpudetection (-cuda) -debug -doc -fdk -flite -fontconfig -frei0r -fribidi -gcrypt -gme -gmp -gsm -hardcoded-tables -iec61883 -ieee1394 -jack -jpeg2k -jpegxl -kvazaar -ladspa -lcms -libaom -libaribb24 -libass -libcaca -libdrm -libilbc -libplacebo -librtmp -libsoxr -libtesseract -libv4l -libxml2 -lv2 -lzma (-mipsdspr1) (-mipsdspr2) (-mipsfpu) (-mmal) -modplug -mp3 (-nvenc) -openal -opencl -opengl -openh264 -openssl -opus -oss -pulseaudio (-qsv) -rav1e -rubberband -samba -sdl -snappy -sndio -speex -srt -ssh -static-libs -svg -svt-av1 -test -theora -truetype -twolame -v4l -vaapi -vdpau -verify-sig -vidstab (-vmaf) -vorbis -vpx -vulkan -webp -x264 -x265 -xvid -zeromq -zimg -zvbi" CPU_FLAGS_X86="mmx mmxext sse sse2 sse3 ssse3 -3dnow -3dnowext -aes -avx -avx2 -fma3 -fma4 -sse4_1 -sse4_2 -xop" FFTOOLS="aviocat cws2fws ffescape ffeval ffhash fourcc2pixfmt graph2dot ismindex pktdumper qt-faststart sidxindex trasher" 9995 KiB
[ebuild  N     ] dev-libs/libcdio-paranoia-2.0.1:0/2::gentoo  USE="cxx -static-libs -test" 576 KiB
[ebuild  N     ] media-libs/libdvdnav-6.1.1::gentoo  USE="-static-libs" 359 KiB
[ebuild  N     ] x11-misc/compose-tables-1.8.7::gentoo  1816 KiB
[ebuild  N     ] x11-libs/cairo-1.18.0::gentoo  USE="glib -X (-aqua) (-debug) -gtk-doc -test" 42949 KiB
[ebuild  N     ] x11-libs/libX11-1.8.7::gentoo  USE="-doc -test" 0 KiB
[ebuild  N     ] media-libs/harfbuzz-8.3.0:0/6.0.0::gentoo  USE="cairo glib graphite introspection truetype -debug -doc -experimental -icu -test" 18558 KiB
[ebuild  N     ] x11-libs/libXext-1.3.5::gentoo  USE="-doc" 333 KiB
[ebuild  N     ] media-libs/libass-0.17.1:0/9::gentoo  USE="fontconfig -test -verify-sig" 394 KiB
[ebuild  N     ] x11-libs/libXxf86vm-1.1.5::gentoo  USE="-doc" 260 KiB
[ebuild  N     ] x11-libs/libXScrnSaver-1.2.4::gentoo  USE="-doc" 259 KiB
[ebuild  N     ] x11-libs/libXv-1.0.12::gentoo  USE="-doc" 270 KiB
[ebuild  N     ] media-video/mplayer-1.5_p20230618::gentoo  USE="X alsa cdio dvd dvdnav enca encode iconv ipv6 libass network osdmenu shm truetype unicode xscreensaver xv -a52 -aalib (-aqua) -bidi -bl -bluray -bs2b -cddb -cdparanoia -cpudetection -debug -dga -doc -dts -dv -dvb -faac -faad -fbcon -ftp -ggi -gsm -jack -joystick -jpeg -ladspa -libcaca -libmpeg2 -lirc -live -lzo -mad -md5sum -mng -mp3 -nas -openal -opengl -oss -png -pnm -pulseaudio -pvr -radio -rar -rtc -rtmp -samba -sdl (-selinux) -speex -tga -theora -toolame -tremor -twolame -v4l -vcd -vdpau -vidix -vorbis -x264 -xinerama -xvid -yuv4mpeg -zoran" CPU_FLAGS_X86="mmx mmxext sse sse2 sse3 ssse3 -3dnow -3dnowext -avx -avx2 -fma3 -fma4 -sse4_1 -sse4_2 -xop" VIDEO_CARDS="-mga" 14748 KiB

Total: 40 packages (40 new), Size of downloads: 115988 KiB
```

C'est un beau bordel vous allez dire, pour installer `mplayer` il faut au préalable compiler 39 dépendances pour un total de 115Mb de fichiers sources.
Au delà de ça, juste pour les options de mplayer, il y en a beaucoup :
```bash
[ebuild  N     ] media-video/mplayer-1.5_p20230618::gentoo  USE="X alsa cdio dvd dvdnav enca encode iconv ipv6 libass network osdmenu shm truetype unicode xscreensaver xv -a52 -aalib (-aqua) -bidi -bl -bluray -bs2b -cddb -cdparanoia -cpudetection -debug -dga -doc -dts -dv -dvb -faac -faad -fbcon -ftp -ggi -gsm -jack -joystick -jpeg -ladspa -libcaca -libmpeg2 -lirc -live -lzo -mad -md5sum -mng -mp3 -nas -openal -opengl -oss -png -pnm -pulseaudio -pvr -radio -rar -rtc -rtmp -samba -sdl (-selinux) -speex -tga -theora -toolame -tremor -twolame -v4l -vcd -vdpau -vidix -vorbis -x264 -xinerama -xvid -yuv4mpeg -zoran" CPU_FLAGS_X86="mmx mmxext sse sse2 sse3 ssse3 -3dnow -3dnowext -avx -avx2 -fma3 -fma4 -sse4_1 -sse4_2 -xop" VIDEO_CARDS="-mga" 14748 KiB
```
Beaucoup sont déjà désactivées certes, mais si mon projet est de fournir des images d'un film sans le son, encodé en X264 converti en ASCII (oui c'est possible, ça s'appelle "libcaca" et c'est français !), je peux modifier mes options :
```bash
echo "media-video/mplayer libcaca x264 -X -alsa -cdio -dvd -dvdnav -enca -encode -iconv -ipv6 -libass -network -osdmenu -shm -truetype -unicode -xscreensaver -xv" >> /etc/portage/package.use/media-video
```

Une nouvelle simulation d'installation s'impose :

```bash
livecd / # emerge -pv media-video/mplayer

These are the packages that would be merged, in order:

Calculating dependencies... done!
Dependency resolution took 10.60 s (backtrack: 0/20).

[ebuild  N     ] dev-lang/nasm-2.16.01-r1::gentoo  USE="-doc" 994 KiB
[ebuild  N     ] dev-lang/yasm-1.3.0-r1::gentoo  USE="nls" 1458 KiB
[ebuild  N     ] media-libs/libcaca-0.99_beta19-r11::gentoo  USE="ncurses -X -doc -imlib -opengl -slang -static-libs -test -truetype" 1176 KiB
[ebuild  N     ] media-libs/dav1d-1.2.1:0/6::gentoo  USE="8bit 10bit asm -test -xxhash" 853 KiB
[ebuild  N     ] media-video/ffmpeg-6.0-r9:0/58.60.60::gentoo  USE="bzip2 dav1d encode gnutls gpl iconv network pic postproc threads zlib -X -alsa (-amf) -amr -amrenc (-appkit) -bluray -bs2b -cdio -chromaprint -chromium -codec2 -cpudetection (-cuda) -debug -doc -fdk -flite -fontconfig -frei0r -fribidi -gcrypt -gme -gmp -gsm -hardcoded-tables -iec61883 -ieee1394 -jack -jpeg2k -jpegxl -kvazaar -ladspa -lcms -libaom -libaribb24 -libass -libcaca -libdrm -libilbc -libplacebo -librtmp -libsoxr -libtesseract -libv4l -libxml2 -lv2 -lzma (-mipsdspr1) (-mipsdspr2) (-mipsfpu) (-mmal) -modplug -mp3 (-nvenc) -openal -opencl -opengl -openh264 -openssl -opus -oss -pulseaudio (-qsv) -rav1e -rubberband -samba -sdl -snappy -sndio -speex -srt -ssh -static-libs -svg -svt-av1 -test -theora -truetype -twolame -v4l -vaapi -vdpau -verify-sig -vidstab (-vmaf) -vorbis -vpx -vulkan -webp -x264 -x265 -xvid -zeromq -zimg -zvbi" CPU_FLAGS_X86="mmx mmxext sse sse2 sse3 ssse3 -3dnow -3dnowext -aes -avx -avx2 -fma3 -fma4 -sse4_1 -sse4_2 -xop" FFTOOLS="aviocat cws2fws ffescape ffeval ffhash fourcc2pixfmt graph2dot ismindex pktdumper qt-faststart sidxindex trasher" 9995 KiB
[ebuild  N     ] media-video/mplayer-1.5_p20230618::gentoo  USE="libcaca x264 -X -a52 -aalib -alsa (-aqua) -bidi -bl -bluray -bs2b -cddb -cdio -cdparanoia -cpudetection -debug -dga -doc -dts -dv -dvb -dvd -dvdnav -enca -encode -faac -faad -fbcon -ftp -ggi -gsm -iconv -ipv6 -jack -joystick -jpeg -ladspa -libass -libmpeg2 -lirc -live -lzo -mad -md5sum -mng -mp3 -nas -network -openal -opengl -osdmenu -oss -png -pnm -pulseaudio -pvr -radio -rar -rtc -rtmp -samba -sdl (-selinux) -shm -speex -tga -theora -toolame -tremor -truetype -twolame -unicode -v4l -vcd -vdpau -vidix -vorbis -xinerama -xscreensaver -xv -xvid -yuv4mpeg -zoran" CPU_FLAGS_X86="mmx mmxext sse sse2 sse3 ssse3 -3dnow -3dnowext -avx -avx2 -fma3 -fma4 -sse4_1 -sse4_2 -xop" VIDEO_CARDS="-mga" 15438 KiB

Total: 6 packages (6 new), Size of downloads: 29911 KiB
```
Nous n'avons plus que 6 packages pour une taille de fichiers de 29Mo à compiler pour regarder des films en ASCII.
Je vous laisse voir sur google images ce que donne la puissance de libcaca (Safe For Work sur Google Images en tout cas) ou sur [libcaca](http://caca.zoy.org/wiki/libcaca).

De la même manière, j'aurais pu affiner pour pour chaque dépendance les options voulues, si tant est que je sache à quoi elles servent, mais j'aurais dû faire des recherches sur chaque option, ce n'était pas forcément le but de cet article à l'instant T.

Certes, l'exemple est un cas à la marge, mais il aura le mérite de vous faire connaître la libcaca si ce n'était pas le cas !

![libcaca c'est drôle]({BASE_URL}/imgs/articles/2024-01-21-gentoo-introduction/libcaca.png)

### Et pour les softwares pas open-source ?

C'est très simple, soit l'éditeur propose un binaire dédié à l'architecture cible, soit le code est open-source mais sont usage est soumis à licence.

D'ailleurs, en parlant de licences, nous y reviendront un peu plus en détails plus tard, mais vous avez aussi la possibilité de définir quelles licences vous acceptez ou non pour votre système (ou votre produit, qui sait).

### Instructions processeur et graphique

Il y a dans les divers exemples de console fournis plus haut, beaucoup d'options que je n'ai pas détaillé ni évoqué.
Votre processeur ou microcontrôlleur pour ne citer que lui, utilise un jeu d'instructions qui lui est propre.
Je ne vais pas rentrer dans les détails, mais en fonction de la façon dont est conçu et architecturé votre CPU,
des jeux d'instructions seront disponibles ou non, optimisés pour celui-ci, ils peuvent être génériques ou ciblés.
Tout ceci en résulte un système plus optimisé pour votre processeur, votre carte graphique (si tant est que vous en ayez une), et autres drivers internes/externes.

Chaque configuration optimisée, la plus petite soit elle, sur votre processeur, votre carte graphique les différents drivers, le noyau Linux, de part les options activées ou non provoquera une amélioration en terme de réactivité, de gain de mémoire et j'en passe.


## Conclusion

Ce n'est qu'un préambule à ce qu'est Gentoo, pour essayer de vous faire comprendre que beaucoup de distributions stables et fiables, vous apportent un tas d'options inutiles qui viennent polluer les ressources de votre système que vous n'utiliserez peut-être jamais.

Au delà de ça, la curiosité, la volonté d'optimiser, permet d'en apprendre plus sur Linux, et les distributions en général.
Cela peut être chronophage, en tout cas au début, mais une fois passées les premières installations d'une Gentoo, vous créerez des automatismes que vous n'auriez pas sur d'autres distributions.
Un exemple parmi d'autres : versionner vos fichiers, créer des branches optimisées pour des configurations spécifiques, puisque tout est source !

Si d'aventure cela vous intéresse déjà, sachez qu'il existe des [*handbooks Gentoo*](https://wiki.gentoo.org/wiki/Handbook:Main_Page), en français, en anglais, en klingon sûrement, et pour toutes les architectures : ARM, X86_64, X86, etc.

Ah et au fait, mon vieux laptop dual boot Ubuntu/Windows qui démarrait en trois minutes ; sur une Gentoo optimisée (et encore, avec mes connaissances de débutant de l'époque et la puissance de Gentoo en 2009) finissait par démarrer en moins de trente secondes.

Si cela ne vous convainc toujours pas, faites moi don de vos vieilles machines qui prennent la poussière, je saurai toujours quoi faire avec.
Ou alors, peut-être que vous pouvez vous motiver à leur donner une nouvelle vie, à vous de choisir.
N'oubliez juste pas que pour chaque distribution Linux, la philosophie fondamentale, c'est le partage de connaissances ;)
