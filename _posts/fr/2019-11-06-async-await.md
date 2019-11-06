---
layout: post
title: Async / await
excerpt: Après avoir décortiqué les promesses, nous allons voir comment utiliser async await.
authors:
    - mehdidr
lang: fr
permalink: /fr/asyncawait/
categories:
    - Javascript
tags:
    - promise
    - promesse
    - javascript
    - ES6
    - async
    - await
---

Après avoir vu en profondeur comment fonctionnent les promesses et comment les utiliser, nous allons nous pencher sur une fonctionnalité arrivée avec l'ES7 : `async/await`.
`Async` await nous permet de résoudre un problème né de l'utilisation de code asynchrone en javascript : le [callback hell](http://callbackhell.com/), récurrent lorsque l'on cherche à faire de l'asynchrone de manière séquentielle.
`Async/await` n'est globalement que du sucre syntaxique, qui nous permet de lire du code asynchrone comme s'il était synchrone.

⚠️ Il est important de connaître et de comprendre les promesses pour maîtriser `async/await`. Si ce n'est pas votre cas, je vous conseille de lire mon précédent [article](https://blog.eleven-labs.com/fr/lespromessesenjavascript/) qui traite justement des promesses.

![]({{ site.baseurl }}/assets/2019-11-06-async-await.jpg)

## Définition

### async

Mettre le mot `async` devant une fonction lui donne l'instruction de retourner une promesse. Si une erreur apparaît pendant l'exécution, la promesse est rejetée. Si la fonction retourne une valeur, la promesse est résolue avec cette valeur. Et si une promesse est retournée, elle reste inchangée.

```javascript
async function asyncFunction() {
 // équivaut à : return Promise.resolve('résultat');
 return 'résultat';
}

asyncFunction().then(console.log) // "résultat"
```

les fonctions async rendent le code beaucoup plus concis que l'utilisation de promesses normales :

```javascript
// Utilisation du then
const makeRequest = () =>
  getJSON()
    .then(data => {
      console.log(data)
      return "done"
    })

makeRequest()

// Utilisation d'async
const makeRequest = async () => {
  console.log(await getJSON())
  return "done"
}

makeRequest()
```

### await

Le mot-clé `await` ne peut être utilisé qu'à l'intérieur d'une fonction async. Il nous permet d'attendre que la promesse retourne son résultat (ou une erreur) pour continuer l'exécution du code.

```javascript
async function getAsyncNumber1() // renvoie une promesse avec comme valeur un nombre
async function getAsyncNumber2() // même chose que ligne du dessus

const getAsyncAddition = async () => {
 const number1 = await getAsyncNumber1();
 const number2 = await getAsyncNumber2();
 return number1 + number2;
}
```

Pour avoir le même résultat sans `await`, il faudrait

- soit imbriquer un `then()` dans un autre :

```javascript
const getAsyncAddition = () => getAsyncNumber1().then(number1 => getAsyncNumber2().then(number2 => number1 + number2));
```

Ce qui, vous en conviendrez, est difficile à lire.

- soit déclarer une variable dans le scope de la fonction :

```javascript
const getAsyncAddition = () => {
 let number;
 return getAsyncNumber1()
   .then(vnumber => {
     number1 = vnumber1;
     return getAsyncNumber2();
   })
   .then(number2 => number1 + number2);
}
```

Voici une liste de règles importantes à retenir sur async await :

- les fonctions async retournent une promesse.
- les fonctions async utilisent une `Promise` implicite pour retourner un résultat. Même si une promesse n'est pas retournée explicitement, la fonction async fait en sorte que le code soit passé par une promesse.
- `await` bloque l'exécution du code à l'intérieur d'une fonction async. Il permet de s'assurer que la prochaine ligne soit exécutée quand la promesse est résolue. Donc si du code asynchrone est déjà en train de s'exécuter, `await` n'aura pas d'effet sur lui.
- il peut y avoir plusieurs `await` à l'intérieur d'une fonction async.
- Il faut bien faire attention lors de l'utilisation d'`await` dans une boucle, car le code peut facilement s'exécuter de manière séquentielle au lieu d'être executé en parallèle.
- `await` est toujours utilisé pour une seule promesse.

## Pourquoi utiliser async await ?

On pourrait se demander pourquoi utiliser cette fonctionnalité, alors que les promesses existent déjà en JS.

- Comme vous l'avez vu avec les exemples ci-dessus, `async/await` nous permet d'avoir un code beaucoup plus concis et nous évite le callback hell.
- L'utilisation d'`async/await` permet d'améliorer la gestion d'erreur, car il est possible de gérer les erreurs synchrones et asynchrones en même temps (ce qui n'était pas le cas auparavant), notamment grâce à l'utilisation d'un `try/catch`.

```javascript
const makeRequest = () => {
  try {
    getJSON()
      .then(result => {
        // this parse may fail
        const data = JSON.parse(result)
        console.log(data)
      })
      // décommenter ce bloc pour gérer les erreurs asynchrones
      // .catch((err) => {
      //   console.log(err)
      // })
  } catch (err) {
    console.log(err)
  }
}
```

Dans cet exemple, le `try/catch` va casser si le `JSON.parse` casse car il se passe à l'intérieur d'une promesse. Il est nécessaire d'utiliser un `.catch()` sur la promesse et donc dupliquer la gestion d'erreur. Voici le même code avec `async/await` :

```javascript
const makeRequest = async () => {
  try {
    // this parse may fail
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```

Mais il est aussi possible d'utiliser un catch à l'appel de la fonction avec async/await :

```javascript
const doSomethingAsync = async () => {
    let result = await someAsyncCall();
    return result;
}

doSomethingAsync().
  .then(successHandler)
  .catch(errorHandler);
```

- Il arrive assez souvent d'appeler une promesse (qu'on va appeler promesse1) et d'utiliser sa valeur de retour pour appeler une deuxième promesse (qui s'appelle sans surprise promesse2), pour ensuite utiliser le résultat de ces deux promesses pour appeler promesse3. Le code ressemble donc à ceci :

```javascript

const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // Du code
      return promise2(value1)
        .then(value2 => {
          // Du code
          return promise3(value1, value2)
        })
    })
}
```

Il est possible ici d'englober les promesses 1 et 2 dans un `Promise.all` pour éviter d'avoir à imbriquer les promesses :

```javascript
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // Du code
      return Promise.all([value1, promise2(value1)])
    })
    .then(([value1, value2]) => {
      // Du code
      return promise3(value1, value2)
    })
}
```

Le problème de cette approche est qu'elle sacrifie la sémantique au profit de la lisibilité. Il n'y a aucune raison de mettre les promesses 1 et 2 dans un tableau, excepté pour éviter l'imbriquation de promesses.

Ce qui est rendu beaucoup plus simple grâce à `async/await` :

```javascript
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```

- Le debugging est rendu beaucoup plus simple grâce à l'utilisation d'`async/await`. On peut mettre des points d'arrêts contrairement à l'utilisation de promesses.

- Il est possible d'utiliser `await` sur des opérations synchrones et asynchrones. Par exemple, écrire `await 5` revient à écrire `Promise.resolve(5)`.

## Conclusion

`async/await` est une fonctionnalité incroyable qui permet d'écrire de l'asynchrone facilement. Il est cependant important que pour le language, `async/await` fonctionne exactement comme une promesse et qu'il ne résoud pas tout les problèmes, comme la gestion de plusieurs appels asynchrones qui sont indépendants. Les fonctions async fonctionnent exactement comme les promesses, mais sont utiles pour gérer les erreurs, éviter d'imbriquer ses promesses, et lire du code asynchrone comme du code synchrone. J'espère que cet article vous aura aidé à y voir plus clair !
