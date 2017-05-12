---
layout: post
title: Feedback sur les DotCSS 2016
author: tbrugidou
date: '2016-12-05 16:32:25 +0100'
date_gmt: '2016-12-05 15:32:25 +0100'
categories:
- Non classé
tags:
- css
- w3c
- html
---

Pour cette 3ème édition des DotCSS consacrée à la partie stylée de la Force, le menu était alléchant : 8 conférenciers de qualité dont quelques pointures de la profession, avec comme cerise sur le gâteau un talk de Dieu le père, aka Håkon Wium Lie, le créateur de CSS en personne. Comme d’habitude aux Dot Conférences, l’accueil était princier et l’ambiance chaleureuse dans un théâtre des variétés plein à craquer.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/dot2016.jpg"><img class="size-medium wp-image-2782 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/dot2016.jpg" alt="dot2016" /></a>

<strong>VARYA STEPANOVA – PatternLibraries</strong>

Pour débuter l’après-midi, c’est Varya Stepanova qui nous vient d’Helsinki pour nous faire la démonstration des patterns libraries en CSS et du bénéfice qu’ils peuvent apporter dans un monde de plus en plus porté sur le développement modulaire.

<strong>WENTING ZHANG – DrawingWithCSS</strong>

La new-yorkaise Wenting Zhang nous a ensuite montré comment une simple &lt;div&gt; pouvait se transformer en une ravissante moustache, simplement grâce au aux super-pouvoirs du CSS.<br />
Voici le résultat avec le code associé : http://cssicon.space/#/icon/mustache-solid

Elle a ensuite présenté CSSicons, une collection d’icônes construites en CSS selon la même méthode et présentant de nombreux avantages. Il est notamment possible de les animer, chose impensable avec une font d’icônes.

<strong>PHILIP WALTON – Dark Side of Polyfilling CSS</strong>

Lors d’une code-session très instructive, Philip Walton a essayé un exercice simple de prime abord : ajouter un mot-clé ‘random’ dans une feuille de style et le remplacer avec du Javascript par un nombre aléatoire compris entre 0 et 1. Il en est ressorti plusieurs problèmes :<br />
- Générer un nombre par occurrence impose de parser tout le style de la page et de le recracher dans le même ordre, car en CSS il n’y a pas que la taille qui compte, il y a l’ordre aussi.<br />
- Cela fait écrire beaucoup de code Javascript supplémentaire.<br />
- Réaffecter des styles après le chargement de la page déclenchera à nouveau toute la suite événements de rendu de page (Layout, rendering, paint). C’est donc coûteux en perfs.<br />
Moralité, il est possible de le faire, mais ce n’est pas indolore.

<strong>CHRIS LILLEY – Webfonts</strong>

Chris Liley nous a ré-explicité les fondamentaux des fonts pour le web ainsi que quelques tricks sympathiques que pour ma part j’ai découvert. Il a ensuite ouvert une fenêtre sur le futur proche des webfonts avec ce qu’il sera possible de faire en CSS4. On pourra utiliser des fonts variables de part leur style et leur graisse notamment qui permettront plus de souplesse et des animations jusqu’alors inédites à grands coups de transition sur font-weight et font-style. Nice !

<strong>KEVIN MANDEVILLE – Hacking HTML Emails with CSS</strong>

« Oh shit! Il faut intégrer des emails ! » Un calvaire que tout développeur front-end a connu de près ou de loin dans son existence. Kevin Mandeville, développeur chez Litmus, a pointé la difficulté inhérente à l’intégration d’emails : la présence d’une multitude de clients mails sur le marché, bien plus que de browsers. Une autre difficulté est que parmi ces clients mails, il y a Outlook, pour lequel on doit encore utiliser des &lt;table&gt;. Heureusement, depuis peu, on a la possibilité d’isoler dans une media-query le code pour le moteur de rendu webkit, qui est celui utilisé par la majorité des webmails. Et sur webkit, on peut aller bien plus loin et proposer, grâce à quelques ruses de sioux, des emails interactifs. L’intégration d’emails est donc en voie de modernisation.

<strong>LEA VEROU - Les variables CSS</strong>

Léa Verou est venue nous parler d’une fonctionnalité en cours de développement en CSS, probablement la plus attendue par la communauté de la feuille (de style) : les variables CSS !<br />
Cela permet nativement de faire ce que l’on ne pouvait faire que via un préprocesseur (Less/Sass), stocker des valeurs grandement répétées dans nos feuilles de style dans des variables.<br />
Le 1er avantage qui saute aux yeux est bien entendu la maintenabilité accrue que cela apporte. Cela permet également de séparer les styles d’une page ou d’une web app de son comportement. On peut par exemple définir des styles qui seront impactés par une action utilisateur (mouseMove, scroll, …) en passant simplement via Javascript les positions de la souris ou du scroll.<br />
Hélas, comme d’habitude, Internet Explorer est là pour gâcher la fête et ne supporte pas du tout la fonctionnalité. Damned.

<strong>VAL HEAD – The Ins and Outs of Easing</strong>

Val Head a décortiqué le fonctionnement des "easings" en ouvrant le capot et en examinant les fonctions associées, leur émulation en CSS et l'utilisation des courbes de bézier. Un vrai cours de mathématiques appliquées !

<strong>HåKON WIUM LIE – CSS for printing books</strong>

Hakon Wium Lie est au language CSS ce que Maïté est au cholestérol. Il en est l'inventeur. Il nous a fait un historique sur ce qui l'a emmené en 1994 à imaginer un langage voué à décrire la mise en forme d'un document purement structurel, HTML.<br />
Il nous a ensuite emmené sur un tout autre terrain que celui qu'on a l'habitude de pratiquer, à savoir les livres papiers. CSS répond en effet parfaitement à la mise en forme de livres et pourrait être employé pour les mettre en page. C'était donc un aperçu avancé de ce qu'il est possible de faire avec les styles d'impression qu'il nous a proposé.

&nbsp;

Et voilà, c'est fini pour cette année. Une édition particulièrement intéressante sur une techno toujours en train de se réinventer. Vivement 2017 !


