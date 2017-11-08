---
layout: post
title: PHP 7.1 - Pour les null
authors: 
    - aandre
date: '2016-09-07 11:39:10 +0200'
date_gmt: '2016-09-07 09:39:10 +0200'
lang: fr
permalink: /fr/php-7-1-pour-les-null/
categories:
    - Php
tags: []
---
Il y a quelques temps, pour ainsi dire un an (le temps passe vite ! ), je parlais de la sortie de PHP 7.0. Dix mois plus tard, les choses évoluent à nouveau : PHP 7.1 est en RC1.

Cet article n'a pas pour vocation d'être exhaustif, mais uniquement de présenter les changements intéressants (vous trouverez en bas de page un lien vers les RFC de PHP 7.1 qui m'ont servi de socle pour cet article). Par ailleurs, cela nécessite d'avoir pris connaissance des features de PHP 7.0 que vous pouvez retrouver dans le [précédent article](https://blog.eleven-labs.com/fr/php-7-petit-guide-qui-ne-trompe-pas/).

# RC1 ?

RC prévaut pour "Release Candidate". Dans le processus de développement on a souvent une alpha, une beta et une Release Candidate. Il s'agit là de versions majeures dans le processus de développement. Et pour chaque version majeure, comme en cycle normal, il y a plusieurs versions mineures. La RC1 est donc une version mineure. Si des bugs (en règle générale mineurs) sont détectés, ceux-ci seront corrigés puis une RC2 verra le jour.

Dans l'idée, PHP 7.1 sortira donc incessamment sous peu, en tout cas, avant la fin de l'année.

# Les features

## Nullable types

Il s'agit selon moi de l'implémentation la plus intéressante de PHP 7.1. En effet, PHP 7.0 a permis l'ajout du Scalar Type Hinting en paramètres des fonctions, mais il est également possible de typer le retour (classes &amp; scalaires). Cependant, le problème se pose lorsque l'on a potentiellement un paramètre ou un retour null.

Comme un exemple vaut mieux qu'un long discours, voici le comportement en PHP 7.0 (c'est également le cas pour php ~5 lorsque l'on passe ou renvoie null) :
[![asciinema](https://asciinema.org/a/84925.png)](https://asciinema.org/a/84925)

Voyons maintenant le workaround pour les paramètres, mais qui ne résout pas le problème pour le type de retour :
[![asciinema](https://asciinema.org/a/84927.png)](https://asciinema.org/a/84927)

Adaptons maintenant ce code pour PHP 7.1, et voyons ce que cela donne :
[![asciinema](https://asciinema.org/a/84926.png)](https://asciinema.org/a/84926)

Comme on peut le constater, nous pouvons dorénavant sans utiliser les paramètres par défaut, passer ou retourner des valeurs nulles grâce au type préfixé "?".

## Multi-catch

Il est déjà possible depuis bien longtemps de faire du multi-catch avec plusieurs blocs catch, les uns à la suite des autres. Néanmoins, cela peut être parfois redondant, lorsque l'on veut gérer de la même manière deux types d'exceptions qui n'ont rien en commun. Voici comment l'utiliser :
[![asciinema](https://asciinema.org/a/84954.png)](https://asciinema.org/a/84954)

Notez que je n'utilise que deux exceptions ici, mais j'aurais pu les chaîner avec d'autres.

## Void type

Un nouveau type de retour a également été introduit, il s'agit du type "void". Voici son comportement :
[![asciinema](https://asciinema.org/a/84952.png)](https://asciinema.org/a/84952)

Comme on peut le voir, il est possible d'utiliser un return. Mais il faut noter que retourner null n'est pas permis, ce qui m'a amené à me poser une question farfelue et en même temps totalement inutile : est-il possible de préfixer le type void avec notre opérateur de nullité ? Comme vous pouvez le voir dans l'animation, la réponse est non, et heureusement d'ailleurs !

De prime abord, son utilisation peut paraître inutile (surtout dans le cadre de cet exemple) mais est pourtant bien réel, appliqué dans une interface par exemple, il permet de ne pas faire dévier les multiples implémentations de cette interface.

## Iterable type

De la même manière que pour le type void, un autre type a été introduit, le type "iterable". Là encore, son utilité peut paraître trouble, puisqu'il existe pour cela l'interface native Traversable. Cependant, étant donné le retour à un typage des scalaires, les tableaux et les objets pouvant être itérés de la même manière, il fallait pouvoir englober à la fois tableaux scalaires, et objets traversable, ce à quoi répond ce type.

Encore une fois, il est utilisable aussi bien pour typer un paramètre, que dans le typage de retour.

## Class constant visibility

Quelque chose qui manquait à mon sens dans les classes, et qui est enfin résolu. Il n'était pas possible jusqu'ici d'appliquer une visibilité à une constante de classe. Ce problème est résolu, et évitera à bon nombre d'utiliser des variables statiques pour contourner le problème.

Notez tout de même, que la portée par défaut si vous ne la spécifiez pas reste publique, afin de garder un minimum de cohérence avec les anciennes versions.

## Miscellaneous

Nous pouvons également citer **en vrac** d'autres features :
- la short syntax pour list($foo, $bar, $baz) =&gt; [$foo, $bar, $baz], qui va dans la continuité de ce qui avait été fait sur les tableau en 5.4 ;
- le support des clés dans list, pour les tableaux de type clé-valeur ;
- une meilleure gestion des nombres octaux ;
- une quasi-interdiction de l'usage de $this dans les classes pour éviter des effets de bords dus à des réassignations hasardeuses ;
- etc.

# Comment qu'on teste ?

Avant toute chose, il ne s'agit que d'une RC, donc mon conseil reste de ne l'utiliser que sur vos environnements de développement. Et pour répondre, vous avez deux solutions :

- compiler PHP 7.1 RC1 à la main, je vous renvoie à la [documentation officielle](http://php.net/manual/fr/install.windows.building.php) ;
- utiliser phpenv, qui de toute manière compile également les sources (mais de façon plus automatisée).

Je préconise d'utiliser la seconde méthode sur vos environnements de développement, il n'est pas rare dans un environnement professionnel d'être confronté à des projets nécessitant différentes versions de PHP. PHPEnv permettant de faire tourner plusieurs versions de PHP en console selon le projet. Je détaillerai dans un article comment utiliser Nginx et PHPEnv pour pouvoir faire tourner plusieurs versions de PHP en HTTP toujours sur vos environnements de développement, nous ne sommes pas des barbares !

# Conclusion

Cette version, même mineure, apporte un lot de nouveautés non négligeable.

Bien entendu PHP est encore loin d'être un langage parfait, et souffre encore de lacunes. Mais ne désespérons pas de voir apparaître un jour les annotations ou les énumérations par exemple. La communauté est sans cesse en mouvement, et tend à améliorer le projet, afin que PHP aie une meilleure réputation dans le monde du développement.

Si vous souhaitez en savoir plus, je vous invite à lire les différentes [RFC](https://wiki.php.net/rfc#php_71) qui concernent PHP 7.1.

À plus tard pour un article sur PHP 7.2, si les features se prêtent au jeu ;)

![cat bye goodbye done im out](https://media.giphy.com/media/iPiUxztIL4Sl2/giphy.gif)