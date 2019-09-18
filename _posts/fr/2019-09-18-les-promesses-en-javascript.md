---
layout: post
title: Les promesses en Javascript
excerpt: Nous allons voir ensemble ce que sont les promesses et comment les utiliser.
authors:
    - mehdidr
lang: fr
permalink: /fr/lespromessesenjavascript/
categories:
    - Javascript
tags:
    - promise
    - promesse
    - javascript
    - ES6
    - async
    - asynchrone
---

Les promesses ne sont pas récentes. Elles ont commencé à apparaître dans les années 80 dans des langages tels que MultiLisp.
Le JS a depuis quelques années une tendance à baser les nouveautés du langage sur des modèles asynchrones, car cela permet au moteur Javascript de gérer plusieurs tâches en même temps (événements, affichage, interrogation de base locale...) et de conserver une interface réactive malgré le fait qu'il soit single thread.

C'est une fonctionnalité qui existe depuis longtemps dans l'écosystème JS, mais qui devient un nouvel objet nommé `Promise` natif grâce à l'ES6.

## Définition

Les promesses sont donc des objets qui retournent la valeur d'une opération asynchrone, autrement dit elles représentent une valeur future. Elles disposent de méthodes permettant de traiter le résultat une fois l'opération accomplie (`then()` et `catch()`). D'une manière générale, les promesses vont nous permettre de nous affranchir des callback des fonctions, qui sont désormais attachés à la promesse. Cela permet de nous libérer de l'inversion de contrôle induit par les callbacks (c'est la fonction appelée qui est chargée de les lancer).

Pour rappel, un callback, ou fonction de rappel en français, est une fonction qui est passée en argument à une autre fonction, ce qui permet à cette dernière de faire usage de cette fonction comme n'importe quelle fonction alors qu'elle ne la connaît pas par avance.

Il existe 3 états possibles pour une promesse :

- résolue (fulfilled en anglais) : la valeur de la promesse est arrivée et est utilisable. La fonction `resolve()` est appelée.
- rejetée (rejected en anglais) : une erreur est survenue et il est possible d'effectuer une action en réaction à cette erreur. La fonction `reject()` est appelée.
- en cours (pending en anglais) : la valeur contenue dans la promesse n'est pas encore arrivée.

Une fois la promesse résolue ou rejetée, elle ne peut plus changer d'état.

## Comment les utiliser

### then()

Prenons comme exemple une fonction qui retourne une promesse qui sera résolue après un délai déterminé :

```javascript
const wait = time => new Promise(resolve => setTimeout(resolve, time));

wait(3000).then(() => console.log('Hello!')); // 'Hello!'
```

Notre appel de `wait(3000)` va attendre 3000ms (3 secondes) et va ensuite logger `Hello`.

L'utilisation du `then()` est utilisée pour passer un handler qui pourra récupérer la valeur, qu'elle soit résolue ou rejetée, et crée toujours une nouvelle promesse.

Le constructeur de l'objet `Promise` prend une fonction, qui prend elle-même deux paramètres : `resolve()` et `reject()`. Dans l'exemple ci-dessus, seul `resolve()` a été utilisé, d'où l'absence de `reject()` dans les paramètres.

Il existe une liste de règles que les handler `resolve()` et `reject()` suivent :

- Retourne une valeur : cette valeur devient celle de la promesse retournée par le `.then()`.

- Ne retourne rien : la promesse retournée est résolue avec une valeur égale à undefined.

- Jette une erreur : cette erreur devient celle de la promesse qui est désormais rejetée.

- Retourne une promesse déjà résolue : la valeur de cette promesse devient celle de la promesse retournée par le `.then()`

- Retourne une promesse déjà rejetée : même cas que pour une promesse déjà résolue.

- Retourne une promesse en cours : la résolution ou le rejet de la promesse retournée par le `.then` sera la même que celle de la promesse retournée par le handler.

### Chaînage des .then

Il est tout à fait possible de chainer les `.then()` :

```javascript
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // a

}).then(function(result) { // b

  console.log(result); // c
  return result * 2;

}).then(function(result) { // d

  console.log(result); // 2
  return result * 2;

}).then(function(result) {

  console.log(result); // 4
  return result * 2;
});
```

Voilà ce qui se passe :

- a : la promesse initiale est résolue en 1 seconde,
- b : le handler `then()` est appelé,
- c : la valeur qui est retournée est passée au prochain `then()`,
- d : et ainsi de suite.

![]({{ site.baseurl }}/assets/2019-09-18-les-promesses-en-javascript/promises.png)

### .catch()

Cette méthode renvoie une promesse et ne traite que les cas où la promesse initiale est rejetée. C'est en réalité un alias pour `then(null, errorCallback)`.

Le chaînage des promesses permet de gérer facilement les erreurs. Quand une promesse est rejetée, le runtime sautera au handler de rejet le plus proche.

```javascript
// doAsyncOperation1() retourne une promesse.
doAsyncOperation1()
.then(() => {
  // ...
  return doAsyncOperation2();
})
.then((output) => {
  // ...
  return doAsyncOperation3();
})
.catch((err) => {
  // Recupère n'importe quelle erreur qui se produit dans chaque promesse de la chaîne.
});
```

### Promise.all()

Il existe par ailleurs d'autres méthodes couramment utilisées, comme `Promise.all()`. Cette méthode prend un tableau de promesses comme input, et est résolue lorsque toutes les promesses sont résolues ou si l'une d'elles est rejetée.

```javascript
// Une simple promesse qui est résolue après un temps donné
const timeOut = t => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Completed in ${t}`)
    }, t)
  })
}

// Résoudre une promesse.
timeOut(1000)
 .then(result => console.log(result)) // Completé in 1000

// Utilisation de Promise.all pour résoudre plusieurs promesses
Promise.all([timeOut(1000), timeOut(2000)])
 .then(result => console.log(result)) // ["Completed in 1000", "Completed in 2000"]
```

Dans cet exemple, `Promise.all` est résolue après 2 secondes et renvoie un tableau.

Une autre utilité de cette méthode est que l'ordre des promesses est maintenu : la première promesse du tableau sera aussi le premier élément du tableau renvoyé, et de même pour les suivantes.

### Promise.race()

Tout comme `Promise.all`, cette méthode prend un tableau en entrée. La différence se situe dans le résultat. `Promise.race` renverra la promesse la plus rapide à se résoudre, ou à être rejetée.

```javascript
const promise1 = new Promise((resolve, reject) => setTimeout(resolve, 500, 'one'));

const promise2 = new Promise((resolve, reject) => setTimeout(resolve, 100, 'two'));

Promise.race([promise1, promise2]).then(value => {
  return console.log(value); // Les 2 sont résolues, mais promise2 est plus rapide
});

// résultat attendu: "two"
```

### Promise.allSettled()

Cette méthode renvoie une promesse qui est résolue une fois l'ensemble des promesses du tableau passé en argument réussi ou rejeté. La valeur retournée est un tableau d'objets dont chacun est le résultat de chaque promesse du tableau passé en argument.

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result.status)));

// résultat attendu:
// "fulfilled"
// "rejected"
```

⚠️ Cette méthode est actuellement en draft au TC39, plus de détails sur la [doc MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#Specifications)

## Comment ça marche

Avant d'expliquer comment fonctionnent les promesses dans les coulisses, il est d'abord important d'expliquer comment le runtime JS fonctionne. Le runtime JS est un programme qui exécute du code à la demande. Il est appelé par l'événement `loop` (une boucle infinie de gestion des évènements) du navigateur. Il est appelé en premier lieu pour exécuter le programme contenu dans une balise `<script>`, et en deuxième lieu pour exécuter un callback à l'expiration d'un timer créé par exemple par un `setTimeout()`.

Le runtime utilise un principe nommé "run-to-completion", qui lui impose de ne jamais s'interrompre lors de l'exécution d'une task (qui est le code executé à un instant donné).

Avant l'arrivée de l'ES6, il n'existait pas de possibilités de créer une fonction asynchrone en dehors d'appels à des fonctions telles que `setTimeout()` ou `XMLHttpRequest.send()` : ces appels entraînent plus tard la création des événements adéquats pour exécuter une callback.

L'apparition de l'objet `Promise` apporte avec lui un nouveau concept : celui des `job queue`. Un job queue est une task qui doit être exécutée aussitôt que possible par l'event loop, c'est-à-dire avant la task suivante si elle existe. Il existe une différence de nomenclature entre les auteurs de la spécifiation ECMAScript 2015 (qui font abstraction du contexte dans lequel fonctionne le runtime JS) et les développeurs qui appellent ces job queues des `microtask`.

Pour résumer, les régles au sein du navigateur sont donc :

- une task n'est exécutée qu'après une autre, à cause du principe de run-to-completion.
- une microtask crée par une task est exécutée après cette task et avant la task suivante.
- les microtasks sont exécutées les unes après les autres.

⚠️ Les fonctions comme `setTimeout()`, même avec un délai nul, ne rajoutent pas une microtask mais bien une task.

## Conclusion

Comme nous l'avons vu, les promesses sont devenues un outil indispensable en Javascript pour gérer les opérations asynchrones. Elles permettent d'avoir un meilleur contrôle et une meilleure gestion des erreurs, tout en rendant le code bien plus lisible.

Vous pouvez aller voir ce [lien](https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects) si vous aimez l'anglais et la lecture pour voir les specs des promesses par l'ECMAScript.

Deux autres liens utiles [ici](http://latentflip.com/loupe) et [ici](https://bevacqua.github.io/promisees/), qui vous permettront de jouer avec une sandbox et de visualiser ce qui se passe en arrière-plan, ce qui vous aidera peut-être à mieux comprendre l'asynchronisme !

Le prochain article portera sur async / await, qui mérite bien un article à lui tout seul !
