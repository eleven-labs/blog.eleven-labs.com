---
layout: post
lang: fr
date: '2014-11-24'
categories:
  - javascript
authors:
  - hagbonon
excerpt: >-
  Le 14 novembre a eu lieu la première (et possiblement dernière) édition de
  dotCSS, une conférence par dotConferences, déjà responsables de dotJS,
  dotScale, dotGo, la future dotSwift et la non-renouvellée dotRB.
title: Retour sur la dotCSS 2014
slug: retour-sur-la-dotcss-2014
oldCategoriesAndTags:
  - javascript
  - conference
  - dotcss
permalink: /fr/retour-sur-la-dotcss-2014/
---

Le 14 novembre a eu lieu la première (et possiblement dernière) édition de **dotCSS**, une conférence par dotConferences, déjà responsables de dotJS, dotScale, dotGo, la future dotSwift et la non-renouvellée dotRB.

Version courte : dotCSS était une très bonne conférence qui a clairement trouvé son public étant donné que le théâtre des variétés, lieu où elle avait lieu, était rempli, mais n'a pas probablement pas trouvé assez de ressources pour se financer, ce qui a conduit à la réduction de sa durée (une journée annoncée, réduite à un après-midi)

Résumé rapide des différentes présentations :

-   **Daniel Glazman**, co-chairman du CSS Working Group au W3C, a expliqué durant sa présentation les divers problèmes, et comme il semble complexe pour le langage d'avancer tout en essayant d'atteindre des compromis qui satisfassent tous les éditeurs de navigateurs et leur priorités. Il a par exemple parlé de l'historique problème de centrage vertical des éléments en CSS, et a expliqué qu'il était très dur pour le working group d'arriver à des consensus, parfois sur des sujets comme "simplement" nommer des propriétés.

&nbsp;
-   **Kaelig Deloumeau-Prigent** a parlé de son travail pour le site web de The Guardian, pour faire communiquer développeurs et designers. Sass (et particulièrement des variables bien nommées), sont particulièrement importants pour ça, car il permet de faire communiquer développeurs et designers avec un seul langage pour comprendre la manière dont les éléments du front sont formalisés. Son idée globale était d'avoir le design au centre du projet.

&nbsp;
-   **Harry Roberts** (@csswizardry) a présenté ses 10 principe pour du développement front-end efficace:

1.   L'option la plus simple est habituelement la meilleure
2.  Supprimer le nombre de variables (du projet, pas de variables dans le code)
3.  Comprendre le business
4.  Avoir moins d'attention pour le code, plus d'attention pour le projet en général
5.  Le pragmatisme est plus important que la perfection
6.  Penser à l'intérêt du produit
7.  Ne pas penser les systèmes autour des cas limites
8.  Ne pas prendre de décisions à partir d'anecdotes
9.  Ne rien construire jusqu'à ce que ce soit explicitement demandé
10. S'attendre, et se préparer, aux changements

A suivi une série de lightning talks:

-   **Maxime Thirouin** a résumé ce qui a été l'idée générale de la conférence entière : "Nous aimons le CSS, mais c'est un langage frustrant". Frustrant, car il n'y a toujours pas (sans préprocesseurs) de variables, de math, de customisation... c'est pour cela qu'il travaille sur [cssnext](https://github.com/cssnext/cssnext){:rel="nofollow noreferrer"}, un projet permettant de récupérer d'utiliser immédiatement les futures features CSS
-   **Victor Brito** a demandé à tous les développeurs web de faire des efforts pour rendre le web accessible
-   **Gregor Adams** a parlé de fonctionnalités en CSS pour styler des éléments de manière dynamique (http://slides.pixelass.com/dotcss2014/assets/player/KeynoteDHTMLPlayer.html)
-   **Guido Boman** a parlé de la manière de coder correctement le parallax scrolling en CSS, et d'une implémentation faite par Keith Clark (Détails : http://keithclark.co.uk/articles/pure-css-parallax-websites/)
-   Enfin, **Tim Pietrusky** a parlé des règles CSS appliquées à un élément (http://slides.com/timpietrusky/one-element-rules\#/)

Les présentations des invités ont ensuite repris !

-   **Hugo Giraudel**, dans sa présentation *Keep calm and write Sass*, a parlé de la manière dont les préprocesseurs CSS permettent de faire plus facilement la transition entre les débuts simples de CSS, utilisé pour donner du style à des pages web, et les applications web complexes qu'il doit styler aujourd'hui.
    Il a présenté des principes à suivre pour développer avec Sass:
    -   KYSS - Keep Your Sass Simple(, Smart & Straightforward), extending KISS (Keep It Simple, Stupid)
    -   Ne pas tout faire avec Sass
    -   Suivre des guidelines ([cssguidelin.es](http://cssguidelin.es)), utiliser scss-lint, [px-to-rem](http://github.com/songawee/px_to_rem), [autoprefixer](http://github.com/postcss/autoprefixer){:rel="nofollow noreferrer"}
    -   Nettoyer le code inutilisé
    -   Tester
    -   Documenter

-   **Estelle Weyl** a parlé de features moins connues de CSS, comme compter des éléments, puis a parlé des spécificités des sélectures dans sa présentation *[CSS? WTF!](http://estelle.github.io/doyouknowcss/indexjs.html){:rel="nofollow noreferrer"}*, qui s'est terminée avec son explication d'astuces en CSS pour éviter !important, ou même l'overrider avec des animations CSS.

-   **Nicolas Gallagher** a parlé de CSS scalable et de comment dans une large société comme Twitter penser les différents éléments pour que le développement ne demande pas à se poser des questions, de penser directement en termes de design d'interface utilisateur.

-   **Bert Bos**, le co-createur de CSS, a parlé de typographie, donnant des examples clair au sujet des difficultés qui y sont liées, qui ne peuvent potentiellement pas toutes être réglées avec CSS. Par exemple, les guillemets sont différents en français, anglais, néerlandais. De même, la ponctuation peut être différente (un espace avant ! et ? en français mais pas en anglais), il est donc dififcile de penser à comment faire du markup logique pour ces éléments.

-   **Ana Tudor** (@thebabydino), la dernière invitée de la journée, a montré une série de démos impressionnantes ayant pour sujet la distribution. [Les examples sont sur Codepen](http://codepen.io/thebabydino/){:rel="nofollow noreferrer"}.

Et voilà comment dotCSS s'est terminé. Une fort bonne conférence donc, et on regrettera que l'expérience ne semble visiblement pas avoir vocation à être renouvelée l'an prochain.

C'était en tout cas un après-midi très enrichissant, qui a permis d'avoir l'avis d'experts reconnus sur l'évolution et la qualité du CSS (et de l'environnement qui gravite autour, particulièrement Sass), et de réfléchir aux challenges qui y sont associés. C'était aussi l'occasion de voir tout ce qu'on peut faire d'impressionnant avec CSS, comme les dernières démos l'ont montré.
