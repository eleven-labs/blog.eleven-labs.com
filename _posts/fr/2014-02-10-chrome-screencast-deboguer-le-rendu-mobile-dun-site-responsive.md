---
layout: post
title: 'Chrome Screencast : Déboguer le rendu mobile d''un site responsive'
excerpt: Depuis quelques mois, le navigateur Google Chrome permet, dans ses fonctionnalités expérimentales, de profiter des DevTools pour les téléphones et tablettes Android.
lang: fr
permalink: /fr/chrome-screencast-deboguer-le-rendu-mobile-dun-site-responsive/
authors:
 - laurent
date: '2014-02-10 09:32:03 +0100'
date_gmt: '2014-02-10 08:32:03 +0100'
categories:
- Javascript
tags:
- chrome
- extension
- responsive
---

Depuis quelques mois, le navigateur Google Chrome permet, dans ses fonctionnalités expérimentales, de profiter des DevTools pour les téléphones et tablettes Android.

Pour faire simple, voilà ce que j'ai sur ma tablette Nexus 7.

![Screenshot Nexus 7](/assets/2014-02-10-chrome-screencast-deboguer-le-rendu-mobile-dun-site-responsive/screenshot-nexus-7.jpg)

Sur mon ordinateur, après avoir activé le Chrome Screencast, je peux faire de l'édition live et contrôler le rendu sur la tablette :

![Screenshot Google Chrome Screencast](/assets/2014-02-10-chrome-screencast-deboguer-le-rendu-mobile-dun-site-responsive/screenshot-google-chrome-screencast.png)

Pour activer ces fonctionnalités :

-   Sur votre ordinateur, allez sur [chrome://flags/](//flags/){:rel="nofollow noreferrer"} et cliquez :
    -   *Activer le débogage à distance sur USB* et
    -   *Activer les expérimentations dans les outils de développement*.
-   Sur la tablette, il faut avoir le *Débogage USB activé*. Pour ce faire :
    -   allez dans *Paramètres* puis *À propos de la tablette* (ou du téléphone, je suppose) et tapez plusieurs fois sur *Numéro de build*. Un message indiquera que vous êtes/devenez développeur.
    -   Apparait alors au dessus de *À propos de la tablette* une nouvelle ligne : *Options pour les développeurs* et vous y trouverez l'option à cocher : *Débogage USB*.
-   Ensuite, connectez votre tablette ou téléphone en USB, et ouvrez Google Chrome.
-   Sur la tablette, il faut accepter votre ordinateur en validant la fenêtre d'alerte.

Et c'est bon ! Il ne vous reste plus qu'à aller sur [chrome://inspect/](//inspect/){:rel="nofollow noreferrer"} pour voir apparaitre les pages ouvertes sur le périphérique :

![Google inspect screencast](/assets/2014-02-10-chrome-screencast-deboguer-le-rendu-mobile-dun-site-responsive/google-inspect-screencast.jpg)

![Google-toggle-screencast](/assets/2014-02-10-chrome-screencast-deboguer-le-rendu-mobile-dun-site-responsive/google-toggle-screencast.jpg)
Et à cliquer sur *inspect*. Vous trouverez en bas à gauche de de la fenètre DevTools qui s'ouvre un bouton *Toggle Screencast *:

Retrouvez encore plus de fonctionnalités avancées dans cet excellent article de Paul Irish pour HTML5Rocks : [Chrome DevTools for Mobile: Screencast and Emulation](http://www.html5rocks.com/en/tutorials/developertools/mobile/ "Chrome DevTools for Mobile: Screencast and Emulation by Paul Irish"){:rel="nofollow noreferrer"}

Ce site n'a pas été évalué
