---
lang: fr
date: '2023-05-10'
slug: instruction-debugger-et-points-arret
title: >-
    Maîtriser le temps lors du débogage grâce aux points d’arrêt
excerpt: >-
    On ne va pas se mentir, la journée type d’un développeur est rythmée par des cafés et des “ça marche pô”.
    Et si le dev en question a choisi JS comme langage de programmation, ou de scripting si vous préférez, et bien, ça n'arrange pas les choses.
    Mais alors que faire quand “ça marche pô” ?
keywords:
    - debugger, point d'arrêt, call stack, scope, bug, console
authors:
  - gcunsolo
categories:
  - javascript
---

## Ça marche pô

On ne va pas se mentir, la journée type d’un développeur est rythmée par des cafés et des “ça marche pô”.<br>
Et si le dev en question a choisi JS comme langage de programmation, ou de scripting si vous préférez, et bien, ça n'arrange pas les choses.

Mais alors que faire quand “ça marche pô” ?

La technique préférée par les développeurs JS est `console.log(‘toto’)`

On va spammer notre code malade de `console.log(‘toto’)` pour vérifier si on rentre bien dans un `if` ou, de manière générale, si un bout de code est réellement exécuté ou pas.

Il existe pourtant une technique bien plus efficace, mais qui semblerait être peu connue du grand public : l’instruction `debugger` et l’utilisation des points d'arrêt.

Si ton sourcil s’est levé en mode “uhm, c’est quoi ça ?”, accroche-toi, dans 7 minutes chrono ta vie aura complètement changé :-)


## L’instruction `debugger`

Un exemple va nous aider à comprendre l’utilisation et les avantages de cette instruction, ainsi que la technique du point d'arrêt.

Pour l’occasion j’ai préparé une page web qui nous dit la vérité sur ce fameux `debugger`, la voici :

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="La fausse vérité sur l'instruction debugger" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/screenshot1.png" width="800px" style="margin: auto" />
</figure>

Euh… ok… Je ne m’attendais pas à ça…<br>
Bon, on va dire que ça tombe bien, on va déboguer tout ça !

Le code qui donne ce rendu est en VueJs, très basique pour que n’importe qui puisse y trouver ses marques, et il ressemble à ça :

```js
<template>
 <main>
   <h1>Hello Blog</h1>
   <h2>L'instruction <code>debugger;</code> <b>{{ tellMeAboutIt() }}</b></h2>
 </main>
</template>
<script>
import { theWholeTruth } from '@/theTruth';
export default {
 name: 'DebuggerSavedMyLife',
 methods: {
   /**
    * @description Describes the `debugger;` statement
    * @returns {string} The truth, the whole truth and nothing but the truth
    */
   tellMeAboutIt() {
     const theTruth = theWholeTruth();
     return theTruth;
   },
 },
}
</script>
```
Il doit y avoir un problème dans ma méthode `tellMeAboutIt()`, et c’est fort probable que ça vienne de la fonction que j’appelle à l’intérieur…

Mais tu sais quoi ? Je ne vais pas me prendre la tête, je vais rajouter ma petite instruction comme ça :

```js
   tellMeAboutIt() {
     debugger; // Salut !
     const theTruth = theWholeTruth();
     return theTruth;
   },
```
L’instruction `debugger` ne fait rien d’autre que créer un **point d’arrêt** (**breakpoint**) pour qu’on puisse arrêter l'exécution de notre script et prendre le temps d'analyser ce qui s'y passe.

C’est une façon d'arrêter le temps à un instant T et fouiller dans le code, un véritable bullet time à la Matrix pendant lequel on peut trouver et buter Le Grand Méchant Bug.

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="Neo - Bullet time" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/bullet-time.jpg" width="800px" style="margin: auto" />
</figure>

Si on rafraîchit simplement notre page web, on ne verra rien de nouveau… mais si avant de rafraîchir la page on ouvre notre console… *it’s bullet time, baby!*

<video width="800" controls>
  <source src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/001.webm" type="video/webm">
</video>


Ça y est, le temps s’est arrêté, la console nous montre l’onglet “Sources”, qui contient différents outils pour analyser le code, se déplacer dans l’espace-temps et comprendre d’où vient réellement le problème.

## L’onglet Sources en deux mots

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="L'onglet Source dans Google Chrome" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/onglet-source.png" width="800px" style="margin: auto" />
</figure>

**Sources** nous présente trois sections :
1. À gauche on retrouve tous les fichiers qui ont été chargés sur la page, y compris les fichiers CSS et HTML, très utile pour naviguer dans la structure de notre application et visualiser/modifier en temps réel chaque fichier.
2. Au centre on a un focus sur le fichier qui contient le point d’arrêt. La ligne exacte où l'exécution s’est arrêtée est en surbrillance (en vert dans le screenshot).
3. À droite il y a le panel de débogage, la partie la plus dense et importante qui mérite un aparté.

## Le panel de débogage

Résumé des épisodes précédents : le temps s’est arrêté, on est comme *Doctor Strange* sur une page web qui est totalement congelée et qui ne répond plus.

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="Doctor Strange - Oeil d'Agamotto" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/Eye-of-Agamotto.jpg" width="800px" style="margin: auto" />
</figure>

Le panel de débogage est notre *Oeil d'Agamotto*, voici un aperçu de ses principaux buttons :

<figure style="float: left; margin: 0 1rem;">
 <img alt="Boutton reprendre l'execution du script" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/boutton-1.gif" width="45px" style="margin: auto" />
</figure>

**Reprendre l'exécution du script.**<br>
Une façon de décongeler l'exécution du script, l’application reprendra son cycle naturel, sauf s'il y a d'autres points d'arrêt, auquel cas l'exécution s'arrêtera à nouveau.

<figure style="float: left; margin: 0 1rem;">
 <img alt="Boutton passer à l’appel de fonction suivant" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/boutton-2.gif" width="45px" style="margin: auto" />
</figure>

**Passer à l’appel de fonction suivant.**<br>
Lui, il nous permet d’avancer jusqu'au prochain appel d’une fonction.

<figure style="float: left; margin: 0 1rem;">
 <img alt="Boutton rentrer dans la fonction actuelle" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/boutton-3.gif" width="45px" style="margin: auto" />
</figure>

**Rentrer dans la fonction actuelle.**<br>
Si la ligne sur laquelle on s’est arrêté contient un appel à fonction, en cliquant sur ce bouton on sera magiquement téléporté à l'intérieur de cette fonction. Vous allez adorer.

<figure style="float: left; margin: 0 1rem;">
 <img alt="Boutton quitter la fonction actuelle" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/boutton-4.gif" width="45px" style="margin: auto" />
</figure>

**Quitter la fonction actuelle.**<br>
À l'inverse, ce bouton nous permet de sortir de la fonction dans laquelle on s’est téléporté.

<figure style="float: left; margin: 0 1rem;">
 <img alt="Boutton etape" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/boutton-5.gif" width="45px" style="margin: auto" />
</figure>

**Étape.**<br>
Notre meilleur ami, en cliquant dessus il nous fera avancer dans notre script d’une ligne à la fois, *step by step*.

Plus en bas dans le panel de débogage, on retrouve plusieurs sections, on va se focaliser sur les sections **Scope** et **Call stack**.

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="Scope" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/scope.gif" width="449px" style="margin: auto" />
</figure>

La section **Scope** contient la liste des variables et des fonctions disponibles dans le contexte d'exécution actuel de votre code.

Intéressant de voir que le hoisting de javascript fait que la variable `theTruth` est déjà disponible dans le scope Local, malgré le fait qu’elle n’ait pas encore été initialisée. *Mathemagical!*

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="Call stack" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/call-stack.gif" width="449px" style="margin: auto" />
</figure>

La section **Call stack** contient la “pile d’appels”, autrement dit l’historique des fonctions appelées qui font qu’on en est là.
La fonction la plus récente est toujours au sommet de la pile.
Ce n’est pas étonnant donc qu'en haut de la pile on retrouve notre `tellMeAboutIt`, qui est visiblement appelée par des fonctions obscures qui font surement partie du moteur de VueJs (_sfc_render, renderComponenetRoot, blah blah blah, magie noire).

Dans notre exemple la Call stack ne contient rien d’intéressant, mais c’est un outil très puissant qui nous permettrait de “remonter dans le temps” (ce n’est pas tout à fait ça, mais presque) pour analyser ce qui c’est passé dans notre application juste avant d’arriver à notre point d'arrêt.

Ok, on a toutes les armes pour tacler notre bug, on arrête le blah blah et on y go !

## Où est le bug ?

Essayons de faire avancer notre script jusqu’à la ligne 19 pour observer les changements de notre panel de débogage.

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="L'onglet Source dans Google Chrome - Breakpoint" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/onglet-source-2.png" width="800px" style="margin: auto" />
</figure>

C’est intéressant de voir que la valeur de la variable `theTruth` dans la section Scope => Local du panel de débogage est passée de `undefined` à `“ne sert à rien”` (super, merci…).

Le bug vient d’ailleurs, il doit se cacher dans la fonction `theWholeTruth()`.

Pas de panique, je vais rafraîchir la page et cette fois-ci inspecter ce qui se passe dans la fonction qui retourne ce résultat maudit : *Keep Calm and F5*.

Je vais utiliser les actions du panel de débogage pour :

1. **Avancer jusqu’à la ligne** qui appelle la fonction que je veux inspecter (ligne 18)
2. **Rentrer dans la fonction** `theWholeTruth()` comme un cowboy dans un saloon, flingue à la main.

Essayons:

<video width="800" controls>
  <source src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/002.webm" type="video/webm">
</video>


Intéressant : `theWholeTruth()` a l’air de faire un simple `join` sur un array qui semblerait venir d'une autre fonction : `nothingButTheTruth()`.

On sait ce qu’il faut faire, n’est-ce pas ? ;-)

Let’s go!

<video width="800" controls>
  <source src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/003.webm" type="video/webm">
</video>


Voilà… on a trouvé le responsable du bug.
Autant de suspense, et finalement, il s'agissait juste d’un array de mensonges…

Il ne me reste plus qu'à revenir à mon IDE, dénoncer l’array en question pour faux et usage de faux, rétablir l’ordre dans l’univers et…

<figure style="text-align: center; margin: 2rem 0;">
 <img alt="La vérité sur l'instruction debugger" src="{{ site.baseurl }}/assets/2023-05-10-instruction-debugger-et-points-arret/screenshot2.png" width="800px" style="margin: auto" />
</figure>

## Conclusion

L’instruction `debugger` est un moyen de **placer des points d'arrêt** dans notre code afin de :
- pouvoir **évaluer des variables** à un instant T
- **rentrer dans les méthodes/fonctions** pour en inspecter le contenu
- **remonter la pile d’appels** pour comprendre qui a appelé quoi et comment

Il existe d’autres façons de placer des points d’arrêt et évaluer les variables d’un Scope donné (directement depuis la console du navigateur), mais je laisserai votre curiosité se déchaîner sur l’interweb ;-)

Le temps à notre disposition est fini, j’ai un bug à résoudre qui me casse la tête là, avant de finir la journée…

…heureusement je sais exactement quoi faire pour le dénicher :-)

Goodbye `console.log(‘toto’)`<br>
Welcome `debugger`
