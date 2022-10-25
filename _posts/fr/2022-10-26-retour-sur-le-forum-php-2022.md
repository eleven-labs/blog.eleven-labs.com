---
layout: post
title: "Retour sur le Forum PHP 2022"
excerpt: Un REX sur les différentes confs qui ont été données cette année au Forum PHP.
lang: fr
permalink: /fr/retour-sur-le-forum-php-2022/
authors:
    - ajacquemin
categories:
    - php
    - forum
    - conference
    - afup
---

Les 13 & 14 octobre 2022 a eu lieu le mythique Forum PHP 2022 organisé par l'AFUP, dans un lieu non moins mythique : DisneyLand Paris.
C'est la première fois que l'AFUP vient poser ses valises dans ce lieu magique, plus précisément dans l'hôtel New York qui dispose de salles de conférences grandioses.

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">Et vous, il est comment votre vendredi ? <a href="https://t.co/SFMqKjIGfb">pic.twitter.com/SFMqKjIGfb</a></p>&mdash; AFUP (@afup) <a href="https://twitter.com/afup/status/1578341478518362112?ref_src=twsrc%5Etfw">October 7, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Certains astronautes étaient présents sur place pour assister aux différents talks proposés. Impossible d'assister à tout de manière exhaustive, mais entre rappels et nouveaux apprentissages, voici un retour pêle-mêle sur certains de ces talks qui nous ont marqués.

<br />

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-10-26-retour-sur-le-forum-php-2022/afup2022.png" width="300px" alt="Afup2022 Logo" style="display: block; margin: auto;"/>
    <i>AFUP 2022</i>
</div>

<br />

## The PHP Foundation: The past, the present, and the future

On commence fort car ce n'est pas n'importe qui qui monte sur scène pour ce premier talk. Il s'agit tout simplement de Sebastian Bergmann, notamment créateur de **PHPUnit**. Il est accompagné de Roman Pronskiy, product marketing manager chez JetBrains.

Ils sont venus nous présenter la [**PHP Foundation**](https://opencollective.com/phpfoundation), qu'ils ont créé il y a tout juste un an. Le but ? Réduire le *bus factor* de l'écosystème PHP.

Rembobinons, qu'est-ce qu'un *Bus Factor* ? Et bien c'est simple, ce principe part du postulat que nous allons **tous mourir** (oui, PHP y compris).

Or, imaginez un bus transportant une poignée de personnes, rassemblant à elles seules 80% de la connaissance sur PHP (le fonctionnement de son moteur, son interpréteur, toutes les zend functions utilisées en C, etc...). Si ce bus se crash, on perd instantanément toute la connaissance.

La solution à ce problème est de réduire le plus possible le Bus Factor, en partageant au maximum la connaissance sur le **développement et la maintenance** du langage PHP.

Et c'est exactement le but de la PHP Foundation nouvellement créée. D'après eux, le Bus Factor du PHP est immense sur beaucoup de concepts, et il est important de le réduire le plus possible.

Pour retrouver le support de présentation de ce talk :

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here is the material from the presentation on <a href="https://twitter.com/ThePHPF?ref_src=twsrc%5Etfw">@ThePHPF</a> that I just gave with <a href="https://twitter.com/pronskiy?ref_src=twsrc%5Etfw">@pronskiy</a> at <a href="https://twitter.com/afup?ref_src=twsrc%5Etfw">@afup</a> <a href="https://twitter.com/hashtag/ForumPHP?src=hash&amp;ref_src=twsrc%5Etfw">#ForumPHP</a>:<a href="https://t.co/wKUrOVuXrI">https://t.co/wKUrOVuXrI</a> <a href="https://t.co/RMbQNf4ibG">pic.twitter.com/RMbQNf4ibG</a></p>&mdash; Sebastian Bergmann (@s_bergmann) <a href="https://twitter.com/s_bergmann/status/1580487913858441216?ref_src=twsrc%5Etfw">October 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## Comprenez comment PHP fonctionne, vos applications marcheront mieux

Le premier rappel et le plus important, qui a d'ailleurs été évoqué à de nombreuses reprises durant ce Forum PHP, c'est l'aspect **shared-nothing** du langage lui-même.
Entre 2 requêtes distinctes, PHP oublie tout, ce qui est un avantage pour nous développeurs. Il est plus facile de coder sans se soucier de potentielles fuites mémoire entre deux requêtes.
Mais c'est également un coût en performance : à chaque requête, on ré-alloue la mémoire nécessaire, on ré-ouvre des connexions, etc... 

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Plutôt que d'utiliser les traditionnels `malloc` & `mfree` natifs du langage C, PHP utilise son propre gestionnaire de mémoire ZMM (pour Zend Memory Manager) afin d'optimiser l'allocation de mémoire en PHP, qui s'effectue à chaque requête. 
</div>

Le SAPI PHP-FPM est très bien optimisé, certes, mais cela ne suffit pas toujours à avoir une application qui fonctionne parfaitement.
De plus, il n'existe pas de **multi-threading** en PHP. On peut cumuler plusieurs processus avec PHP-FPM, mais ce n'est pas une solution illimitée; chaque nouveau processus va consommer du CPU et de la RAM. Il ne s'agit donc pas d'en rajouter dès que l'application connaît des lenteurs.

Des problèmes des problèmes, mais où sont les solutions alors ?

Eh bien, au risque de vous décevoir, il n'y a pas de solution magique (auquel cas, vous le sauriez déjà), mais on peut rappeler quelques pistes à prendre en compte lorsque l'on projette d'améliorer nos performances :
- Ne pas hésiter à mettre des **timeouts** sur les appels API au sein de notre application. PHP est un langage qui attend la fin de l'exécution de chaque instruction, faisons tout pour lui simplifier la tâche en offrant ce genre de portes de sortie.
- Dans la lignée du point ci-dessus et de manière générale; **optimiser** son code.
- Vérifier que **OPCache** est bien activé.
- Penser à la **scalabilité** des serveurs (mais attention aux **coûts**)
- Bien comprendre le fichier de configuration de PHP et travailler de pair avec les DevOps pour en fournir un qui soit à la fois **compatible** avec votre infrastructure, et **optimisé** pour votre application.

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
En ce qui concerne l'OPCache, l'activer ne suffit pas, le configurer CORRECTEMENT est un point central, au risque d'être totalement contre-productif.
</div>

J'en profite pour vous présenter le super compte Twitter de @mdesnouveaux, découvert pendant l'événement, qui a partagé sa prise de notes en format #sketchnotes, admirez :

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">Retour en <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> sur la conférence de <a href="https://twitter.com/pascal_martin?ref_src=twsrc%5Etfw">@pascal_martin</a> au <a href="https://twitter.com/hashtag/ForumPHP?src=hash&amp;ref_src=twsrc%5Etfw">#ForumPHP</a> de l’<a href="https://twitter.com/afup?ref_src=twsrc%5Etfw">@afup</a> sur le fonctionnement de <a href="https://twitter.com/hashtag/php?src=hash&amp;ref_src=twsrc%5Etfw">#php</a> <a href="https://t.co/Ep2JeO0SK6">pic.twitter.com/Ep2JeO0SK6</a></p>&mdash; Mathieu Desnouveaux (@mdesnouveaux) <a href="https://twitter.com/mdesnouveaux/status/1580560861290110977?ref_src=twsrc%5Etfw">October 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## Design Pattern Rules Engine

Une de mes conférences préférées, merci à Thibault Richard pour ce talk. La présentation de ce design pattern en application dans un cas concret, c'était la meilleure manière d'en prouver l'efficacité et la simplicité.

Ce design pattern implémente un système qui évalue un ensemble de **règles** pour définir les **actions** à mener.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
C'est un design pattern avant tout indiqué dans un projet comprenant beaucoup de règles métier à vérifier. Si vous constatez une armée de `if (...)` qui commence à s'entasser dans votre code pour vérifier chacune d'entre elle, impactant la lisibilité et la testabilité de votre application, alors le Rules engine est fait pour vous.
</div>

Il vous faudra dans un premier temps créer 1 fichier par règle métier. Ce fichier devra faire 2 choses :
- **Vérifier** si la règle est vérifiée pour un état donné.
- **Exécuter** l'action correspondante si la règle a été vérifiée.

Ces 2 actions peuvent être dans 2 fonctions différentes ou non, selon votre préférence.

Il ne vous reste plus qu'à créer votre fichier principal, le **système**. 
Dans une boucle, on appelera chacune de ces règles, pour en exécuter ou non le contenu, si la condition est préalablement vérifiée.

Votre code est à présent bien mieux découpé, et beaucoup plus facilement **testable** : une règle = 1 fichier = 1 test unitaire.

De plus, avec un framework comme Symfony, implémenter ce design pattern peut être plus rapide, grâce aux annotations `AutoconfigureTag` et `TaggedIterator`.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Vous pouvez même ajouter un attribut `priority` sur votre tag si vous souhaitez que vos règles soient appelées dans un ordre particulier, très pratique !

Si des exemples des code seraient plus parlants pour vous, retrouvez-en dans les [slides de Thibault](https://speakerdeck.com/trichard/un-moteur-bien-huile-forum-php-2022).
</div>

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">Mon <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> de la conférence « un moteur bien huilé » donné par <a href="https://twitter.com/t__richard?ref_src=twsrc%5Etfw">@t__richard</a> lors du <a href="https://twitter.com/hashtag/forumphp?src=hash&amp;ref_src=twsrc%5Etfw">#forumphp</a> de l’<a href="https://twitter.com/afup?ref_src=twsrc%5Etfw">@afup</a> concernant le Rule engine pattern. Un sujet intéressant surtout que j’ai eu à implémenter un cas similaire. <a href="https://t.co/K0T39CDvWJ">pic.twitter.com/K0T39CDvWJ</a></p>&mdash; Mathieu Desnouveaux (@mdesnouveaux) <a href="https://twitter.com/mdesnouveaux/status/1581905545493037056?ref_src=twsrc%5Etfw">October 17, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## Watch the clock

Ahhh, les dates... Ne partez pas tout de suite ! Je sais que c'est la némésis de beaucoup d'entre vous. Notamment lorsqu'il s'agit d'écrire des tests.
Pour venir à bout de ce problème, Andreas Heigl est là pour nous aiguiller.

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
Pourquoi est-ce si compliqué de tester des dates ?
</div>


C'est surtout parce que les fonctions comme `time()` qui nous renvoient l'heure actuelle ne sont pas des *fonctions pures*, c'est-à-dire que la valeur de retour de la fonction n'est pas prédictible, quelque soit l'argument passé, même en utilisant un **DateTimeImmutable**.

Pour solutionner cela, Andreas nous présente la [**PSR-20**](https://github.com/php-fig/fig-standards/blob/master/proposed/clock.md) qui est actuellement en Draft, et est bien nommée *Clock*.
Ce standard fournit une *ClockInterface* qui permet une interopérabilité avec les tests. Elle expose une méthode `now()` qui renvoie un `DateTimeImmutable`.

À partir de là, il suffit d'implémenter l'interface avec différents types de `Clock`, dont une pourrait par exemple renvoyer **toujours** la même date, et donc être utilisée pour les tests. Ainsi, vous pouvez utilisez un objet `RegularClock` au comportement habituel dans votre code. Et grâce à l'interface, vous pouvez maintenant utiliser votre `MockClock` dans vos tests, et enfin accéder au bonheur du test unitaire de date sans bug inattendu.

En attendant que cette PSR soit validée, sachez que vous pouvez tout de même en installer une implémentation :

``` shell
composer require psr/clock
```

Cependant, après une petite recherche de mon côté, sachez que Symfony à créé son propre **[composant Clock](https://symfony.com/components/Clock)** qui sera disponible dès la version 6.2.

Elle vous permettera d'accéder à ces différentes implémentations de la `ClockInterface` :

- `NativeClock` => Pour créer une date basée sur celle du système (renvoie simplement un `new DateTimeImmutable('now')`) avec une timezone que vous pouvez passer en paramètre.
- `MonotoniClock` => Une Clock adaptée pour l'analyse de performance par exemple.
- `MockClock` => Pour renvoyer **toujours** la même date, votre graal pour les tests.

Pour retrouver les slides d'Andreas :

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Find the slides of my talk &quot;Watch the Clock&quot; earlier at <a href="https://twitter.com/hashtag/ForumPHP?src=hash&amp;ref_src=twsrc%5Etfw">#ForumPHP</a> at <a href="https://t.co/HZfZH25P6n">https://t.co/HZfZH25P6n</a> - and while you&#39;re there, why not also leave some feedback at <a href="https://t.co/nf7ZWmOLoT">https://t.co/nf7ZWmOLoT</a> ? Thanks!</p>&mdash; 💙💛Andreas Heigl @ 🏡 (@heiglandreas) <a href="https://twitter.com/heiglandreas/status/1580585784473632768?ref_src=twsrc%5Etfw">October 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## FrankenPHP

Une fois n'est pas coutume, Kévin Dunglas a quelque chose sous la main à nous montrer. Et une fois n'est pas coutume, c'est un outil **expérimental** qu'il a créé lui-même qu'il nous présente. Voici FrankenPHP.

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
Quel est le problème de base ?
</div>

Le constat **principal** de Kévin est le suivant : il est compliqué de dockeriser une application PHP / Symfony, notamment avec PHP-FPM qui est un service externe.

On se retrouve donc rapidement avec une architecture complexe juste pour avoir une application qui tourne.

La solution est double :

Premièrement, partir d'une base **Caddy** pour le serveur. Nginx fait partie des serveurs web les plus populaires aujourd'hui, mais depuis que Caddy a pointé le bout de son nez, il lui vole la vedette. Une configuration plus intuitive et plus simple, une résolution automatique de certificat pour le HTTPS, une extensibilité par modules, le support des  HTTP 103 (Early Hint), ... Tout ça, c'est la modernité de Caddy, le serveur web écrit en Go.

Ensuite, il y a **FrankenPHP** en lui-même, un **SAPI** (Serveur Application Programming Interface), lui-même écrit en Go, qui fonctionne directement par dessus Caddy.

L'avantage ? Plus besoin de dockeriser plusieurs containers pour notre serveur web d'un côté, et notre SAPI (PHP-FPM) de l'autre, qui doivent communiquer ensemble.

À présent, vous avez un seul service. One service to rule them all, and in docker, bind them. On parle de Docker, mais FrankenPHP est tout autant facile d'utilisation sans.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Pour la config ? Plus qu'à éditer votre **Caddyfile** pour la partie Web server, et votre **php.ini** pour la partie applicative. FrankenPHP vient également avec une intégration spéciale Symfony pour en facilité l'interopérabilité.
</div>

Le tout étant bâti sur Caddy et donc Go, votre application peut à présent supporter la puissance des **Early Hints**.

Mais une des killers features de FrankenPHP, c'est son **Worker Mode**. Grâce à ce mode, Franken construit votre application une seule fois au démarrage, et la garde en mémoire, ce qui permet de traiter toutes les futures requêtes sans avoir à redémarrer l'application à chaque fois, comme le voudrait le comportement de base de PHP.

Ce comportement est compatible avec Symfony et Laravel, et permet d'atteindre des performances assez dingues, d'après le benchmark que Kévin nous présente.

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
S'il est <b>découragé</b> d'utiliser FrankenPHP en production pour le moment, c'est d'autant plus le cas pour son Worker Mode. Vous pouvez être sûr de faire face à des bugs en vous y essayant. Préférez plutôt tester l'outil en local et remonter les bugs à Kévin (voire de faire une PR, FrankenPHP est open source !) pour le faire grandir en maturité.
</div>

Et pour finir, le site de [FrankenPHP](https://frankenphp.dev/), et ci-dessous notre habituel sketchnote :

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">Retour en <a href="https://twitter.com/hashtag/sketchnote?src=hash&amp;ref_src=twsrc%5Etfw">#sketchnote</a> sur la découverte de <a href="https://twitter.com/hashtag/frankenphp?src=hash&amp;ref_src=twsrc%5Etfw">#frankenphp</a>, un serveur d’application PHP par <a href="https://twitter.com/dunglas?ref_src=twsrc%5Etfw">@dunglas</a> lors de sa conférence au <a href="https://twitter.com/hashtag/ForumPHP?src=hash&amp;ref_src=twsrc%5Etfw">#ForumPHP</a> de l’<a href="https://twitter.com/afup?ref_src=twsrc%5Etfw">@afup</a> <a href="https://t.co/j9cXLAtETs">pic.twitter.com/j9cXLAtETs</a></p>&mdash; Mathieu Desnouveaux (@mdesnouveaux) <a href="https://twitter.com/mdesnouveaux/status/1580923228247461890?ref_src=twsrc%5Etfw">October 14, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## Conclusion

Ce fut un ForumPHP encore riche en partage, qui a atteint le nombre record de **774 participants**. De quoi faire taire ceux qui pensent que le PHP est mort. Les évolutions et acquis récents de notre langage préféré prouvent qu'il a encore de belles années devant lui, et c'était un plaisir de partager le même état d'esprit et la même philosophie avec autant d'homologues.

Je ne pouvais pas vous partager toutes les conférences de manière exhaustive, mais restez connectés sur youtube pour accéder aux replays des talks qui seront partagés bientôt.

Merci aux conférenciers, aux participants, et surtout, merci au PHP.
