---
layout: post
title: PHP 7 - Le petit guide qui ne trompe pas
authors:
    - aandre
date: '2015-12-21 18:33:37 +0100'
date_gmt: '2015-12-21 17:33:37 +0100'
lang: fr
permalink: /fr/php-7-petit-guide-qui-ne-trompe-pas/
categories:
    - Php
tags:
    - php
    - migration
---
> Dans la vie, il n'y a pas que Symfony — Un collègue

Les frameworks sont indispensables au monde des entreprises, mais occultent parfois les évolutions d'un langage. C'est le cas de PHP 7, qui même si sa sortie est largement relayée, est caché derrière d'autres projets portés par le langage. À l'aube d'un changement potentiellement radical dans la façon de développer en PHP, il est important de souligner les évolutions apportées et leurs conséquences.

# PHP 6

En premier lieu, évoquons le fait que nous soyons passés de PHP 5 à PHP 7.
PHP 6 a existé de 2005 à 2014.

Parmi les fonctionnalités prévues dans cette version on peut évoquer :

*   Support de l'UTF-8
*   Support natif des annotations
*   Multi-thread & meilleur support 64 bits

Néanmoins, aucune version stable n'est jamais sortie, même si de nombreux livres sur le sujet sont sortis durant ces quelques années. Afin d'éviter toute confusion avec PHP 6, la nouvelle version de PHP est donc passée à 7.

# Les origines de PHP 7

Afin de comprendre l'origine de PHP 7, il est nécessaire de parler des problèmes de performance de l'interpréteur PHP. Clairement orienté pour le web, le langage souffre néanmoins de nombreux défauts, notamment lorsqu'il est question de performance et de rapidité d'exécution.

Confrontés à ces problèmes, la société Facebook ; reposant sur PHP ; lance en 2008 l'initiative d'un projet basé sur PHP avec plusieurs améliorations, autant situées au niveau des paradigmes du langage, que sur son exécution. Le projet viendra finalement à terme sous le nom de HHVM, et sera utilisé en production par la société, en multipliant par deux la vitesse d'exécution du langage, via une transformation en [bytecode](https://en.wikipedia.org/wiki/Bytecode){:rel="nofollow noreferrer"} du code source.

Étant distribué librement, HHVM fait son chemin depuis quelques années comme alternative non-officielle au moteur PHP, employé ça et là par quelques sociétés, mais également cité dans de nombreux benchmarks.

Afin d'endiguer la montée d'HHVM, la communauté des développeurs du moteur PHP se doit de répondre avec une solution officielle. S'il s'agit au départ d'un nettoyage des API, la branche dérive rapidement sur une refonte du moteur nommé "PHP-NG" (New Generation). Cette branche sera par la suite réintégrée à la branche principale du projet en 2014. Au même moment, PHP 6 sera officiellement annulé et l'intégration de ce nouveau moteur permettra la création de PHP 7.

# Les nouveautés

La refonte du moteur est une des nouveautés majeures de PHP 7 puisqu'il multiple par deux la vitesse d'exécution du code source. Mais de nombreuses fonctionnalités ont été proposées, parfois acceptées, et parfois refusées. Cet article se veut être un résumé des changements majeurs et non une liste exhaustive.

## Spaceship operator

Non sans humour, l'opérateur de comparaison introduit a en effet une ressemble visuelle importante avec un vaisseau spatial : <=> . Son intérêt est néanmoins tout autre, il permet de comparer deux variables d'une façon beaucoup plus simplifiée que ce qui était proposé auparavant. Si les deux opérandes sont égales, l'opérateur renverra 0, 1 si l'opérande de gauche est plus grande, -1 sinon.

```php
<?php
// PHP 5
usort($r, function($a, $b) {
  if ($a < $b) {
    return -1;
  } elseif ($a > $b) {
    return 1;
  }

  return 0;
});
// PHP 7
usort($r, function($a, $b) {
  return $a <=> $b;
});
```

Un opérateur qui simplifie donc la vie des développeurs. Cependant, l'importance de cet opérateur est négligeable sur du code orienté objet, celui-ci se contentant de comparer les valeurs des attributs. Il aurait été intéressant de créer une interface de type Comparable comme ce qu'il existe en Java, afin de mieux gérer la comparaison entre objets.

##  Null coalesce operator

Autre opérateur ajouté, il sert deux buts : les tests et l'affectation. Jusqu'ici, il fallait tester l'existence d'une variable avant de l'affecter à une autre par le biais d'une condition (en général un ternaire). Ici, l'opérateur simplifie encore une fois le travail des développeurs :

```php
<?php
// PHP 5
$foo = isset($bar) ? $bar : 'baz';
// or
$foo = 'baz';
if (isset($bar)) {
  $foo = $bar;
}
// PHP 7
$foo = $bar ?? $baz;
```

## Les classes anonymes

Largement inspiré de Java, les classes anonymes font leur entrée en PHP 7\. Une suite logique à l'introduction des fonctions anonymes en PHP 5.3\. Tout comme les classes définies, elle acceptent l'héritage, l'implémentation et l'usage des traits. L'avantage est multiple mais reste spécifique.
On peut évoquer une simplification des mocks dans les tests unitaires, ou une alternative à la lourdeur de la norme PSR (qui recommande la création d'un fichier par classe) dans certains cas :

```php
<?php
use Psr\Log\LoggerInterface,

$foo->setLogger(new class implements LoggerInterface {
  public function log($level, $message, array $context = array()) {
    // do something
  }

  // etc.
});
```

## Scalar Type Hinting

PHP a toujours été reconnu pour son typage faible et sa permissivité parfois extrême, qui peut mener à des incohérences et de nombreuses heures de debug. Dans cette nouvelle version de PHP, le typage fort est probablement l'une des plus importantes évolutions du langage, et ce n'est pas sans débats que celle-ci a été intégrée. Il aura en effet fallu pas moins de 5 propositions pour faire accepter cette fonctionnalité.

Le but est d'autoriser le typage des types primitifs (ou scalaires) en argument des méthodes ou fonctions, comme c'est déjà le cas pour les objets, les tableaux et les fonctions anonymes. Étant donné le changement majeur apporté, il a été décidé que ce typage fort serait optionnel. Pour l'activer, il faudra utiliser l'instruction : "declare(strict_types=1);". Par ailleurs cette instruction doit être la première après avoir déclaré le tag "

Il est important de préciser que de l'autocast peut-être réalisé dans certains cas par le moteur, et qu'il reste possible de forcer le cast manuellement lors de l'appel d'une fonction ou méthode.

Un exemple de contournement :

```php
<?php
declare(strict_types=1);

function mySum(float $a, float $b)
{
  return $a + $b;
}

echo mySum((float) "1.0", (float) "2");
```

## Types de retour

Souvent associée au Scalar Type Hinting, cette fonctionnalité est pourtant différente et fonctionne en toute circonstances, quelque soit la valeur ou la présence du "declare(strict_types=1|0)". Il s'agit ici d'une nouvelle implémentation et non d'une amélioration de l'existant comme pour le typage d'arguments. Sont supportés en retour de méthodes les types primitifs ainsi que les différentes classes, mais également les mots-clé "self" et "parent".

Nous noterons deux choses supplémentaires qui sont importantes à prendre en compte :

*   Aucun type "void", mais il n'est pas exclu que celui-ci ne soit rajouté dans une prochaine version ;
*   Retourner null dans une fonction ou méthode dont le retour est typé soulève une erreur. Cependant, une discussion est ouverte sur un objet potentiellement nul, dont la syntaxe serait ?MyObject.

Exemple de syntaxe :

```php
<?php

// pas de typage en entrée, cela peut donc lever une erreur
// (cf. le nouveau système d'exception plus bas)
function bar($a, $b) : int
{
  return $a + $b;
}
```

## Throwable

Enfin, dernière modification majeure, le changement du système d'exceptions.
Jusqu'ici tout était géré par exceptions, en PHP 7, le mécanisme a été scindé en deux : exceptions d'un côté (Exception), erreur de l'autre (Error), les deux implémentant l'interface Throwable. Le but étant de pouvoir _catcher_ certaines erreurs propres au moteur, par exemple une division par 0, ou encore un problème de typage comme nous avons pu le voir plus haut. On peut donc faire l'hypothèse que la plupart des exceptions relèveront du code métier.

Un point important est qu'il est impossible d'implémenter directement l'interface Throwable, il faudra impérativement hériter d'Exception, mais il sera possible d'utiliser l'interface lors du typage, pour _catcher_ les erreurs et les exceptions de la même manière. Vous pouvez consulter la liste des erreurs prédéfinies [ici](http://php.net/manual/en/reserved.exceptions.php){:rel="nofollow noreferrer"}.

## Sortie

La première release stable est sortie le 3 décembre 2015, et un premier patch correctif (7.0.1) a été diffusé le 17 décembre. Étant donné les nombreux changements apportés par cette nouvelle version, il reste à savoir combien de temps l'adoption de PHP 7 prendra par le monde professionnel. Sachant que certains systèmes d'informations tournant encore sur PHP 4, d'autres sur des versions de PHP plus récentes, mais souvent obsolètes, il n'est pas improbable que la migration prenne plusieurs années.
