---
layout: post
title: Les nouveautés d'ES6 Partie I
excerpt: Cet article est le premier d'une série visant à vous présenter les nouveautés apportées par l'ES6 et ce qu'elles comportent d'intéressant.
authors:
    - mehdidr
lang: fr
permalink: /fr/lesnouveauteses6parti/
categories:
    - Javascript
tags:
    - ecmascript
    - javascript
    - ES6
---

Depuis maintenant quelques années, le monde du JavaScript évolue à une vitesse sans pareille. Même le meilleur des développeurs ne peut réussir à suivre toutes les évolutions, que ce soient des librairies, des frameworks, ou des mises à jour du langage en lui-même.
Il y a cependant un standard qui évolue chaque année, que chaque développeur JavaScript se doit de connaître : l'ECMAScript.

ECMAScript est un ensemble de normes régissant les langages de script tels que JavaScript, qui est l'implémentation de l'ECMAscript la plus populaire, établie en 1997. Il modifie la façon d'appréhender certaines notions, et certaines façons d'écrire du JS. Nous en sommes actuellement à la 8ème version (sortie en 2017), mais je vais aujourd'hui vous parler d'ES6, de son vrai nom ECMAScript 6.

## Pourquoi ES6 ?

Cette 6ème édition est créée pour améliorer le langage, notamment dans la création d'applications complexes et de librairies partagées par ces applications. Ce but est atteint notamment par la création des modules (ne vous inquiétez pas si vous ne savez pas ce que c'est, on voit ça dans la deuxième partie ;) ), mais aussi par l'ajout de features rendant la compilation plus simple (comme par exemple `Math.fround()` ou `Math.imul()`).

Un autre but affiché était d'améliorer l'interopérabilité, notamment en adoptant des standards lorsque c'est possible.
Par exemple, l'utilisation des classes, basée sur le constructor des fonctions, ou encore les arrow functions empruntées à CoffeeScript.

Le problème d'une nouvelle implémentation de cette importance, c'est que le Web est vaste et qu'il existe toutes sortes de code, dont certains très vieux. Il faut donc que l'upgrade se fasse de manière automatique et surtout imperceptible. C'est pour cela que ES6 est une surcouche d'ES5, c'est-à-dire que rien n'est supprimé.

Un autre problème se trouve dans les navigateurs : il faut que l'upgrade soit compatible avec tout les navigateurs utilisés. À ce problème existe deux solutions : soit attendre des années que tous les utilisateurs utilisent un navigateur capable de le supporter (si cela ne vous paraît pas viable, c'est normal !), soit de [transpiler](https://fr.wikipedia.org/wiki/Compilateur_source_%C3%A0_source) l'ES6 en ES5.

Mais pourquoi vous parler d'ES6 en particulier, et non des versions précédentes ou suivantes ? Car ES6 marque un tournant dans l'histoire du JavaScript. C'est à partir de cette version que les publications d’ECMAscript deviennent annuelles (ce qui est une énorme avancée pour JS, ES5 ayant été publié en 2009, soit 6 ans auparavant !) et sont désormais appelées en fonction de leur année de sortie : ES7 est appelé ES2016, ES8 est appelé ES2017, etc...

Je vais donc vous présenter certaines des nouveautés apportées par ES6, et vous présenter leurs avantages par rapport à ce qui se faisait auparavant.

## "const" et "let"

En ES5, la déclaration d’une variable se fait via le mot clé `var`. Le [scope](https://blog.lesieur.name/les-contextes-d-execution/) de ces variables est soit global (si défini en dehors d’une fonction), soit local (si déclaré à l’intérieur d’une fonction), mais ne prend pas en compte les blocs (par exemple une condition, ou une boucle).

```javascript
var globalVariable = 'I am global !';

function functionName() {
    var localVariable = 'I am local !';
}

console.log(globalVariable); // output 'I am global !'
console.log(localVariable); // output undefined
```

En ES6, deux nouveaux mots clés ont été ajoutés pour déclarer une variable : `const` et `let`.

### À propos de "const" ###

`const` permet de déclarer une variable à assignation unique bindée lexicalement : c’est-à-dire que l'identifiant utilisé pour déclarer la variable ne peut pas être réaffecté, et sera scopé au niveau du bloc (la portée de la variable est limitée au bloc dans lequel elle est déclarée).

```javascript
function example() {
  const foo = "bar"

  if (true) {
    const foo // SyntaxError, la variable a besoin d'être assignée
    const foo = "foobar"
    foo = "reassign" // SyntaxError, la variable ne peut pas être réassignée
    console.log(foo) // "foobar", la variable appartient au scope du bloc if
  }
  console.log(foo) // "bar", la variable appartient au scope de la fonction "example"
}
```

Cependant, il faut bien faire attention car une variable `const` est constante (seems legit) au niveau référence : les types primitifs (number, string, boolean) bloquent sa réassignation, mais les valeurs à l’intérieur d’un tableau ou d'un objet sont modifiables.

```javascript
const obj = {};
obj.prop = 123;
console.log(obj.prop); // 123
```

### Concernant "let" ###

`let` quant à lui fonctionne de la même façon que `const` sans avoir cette assignation unique, et ressemble donc au fonctionnement de `var`, le scope mis à part.

```javascript
let x = 1;

if( x === 1 ) {
    let x = 2

    console.log(x) // output 2
}

console.log(x) // output 1
```

⚠️ Les variables déclarées avec `var` sont affectées par le *hoisting*, un mécanisme qui va lire toute les déclarations et les remonter au début du scope de la fonction lors de l’exécution de code. Plus de détails [ici](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html).

Lorsqu'une `var` est déclarée, elle est immédiatement initialisée et sa valeur est à ce moment égale à `undefined`. C'est lorsque l'exécution atteint la déclaration de la variable que sa valeur est spécifiée par l'*initializer* (l'assignement donné à cette variable). S'il n'y a pas d'*initializer*, la variable reste égale à `undefined`.

Les variables `let` et `const` ne fonctionnent pas de la même manière : elles ont une *Temporal Dead Zone* (TDZ). Lorsqu'elles sont déclarées, un espace mémoire est créé au sein du bloc mais la variable n'est pas initialisée. C'est lorsque l'exécution atteint la variable qu'elle est initialisée, avec pour différence entre `let` et `const` que `const` doit obligatoirement avoir un *initializer*.

Pour les anglophones, voici un article qui parle plus en détails de la [Temporal Dead Zone](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified).

## Arrow function

L’ES6 apporte une nouvelle façon d’écrire des fonctions, appelée arrow function (ou fat arrow).
En dehors du fait que la syntaxe soit plus concise, les arrow functions ne créent pas leurs propres valeurs pour `this` (contrairement aux fonctions classiques qui ne récupèrent pas le `this` du bloc parent) : elles partagent leur valeur avec leur scope parent, ce qui permet d’éviter d’avoir à binder le « this ».

```javascript
// ES5
function UiComponent() {
    var _this = this; // (A)
    var button = document.getElementById('myButton');
    button.addEventListener('click', function () {
        console.log('CLICK');
        _this.handleClick(); // (B)
    });
}
UiComponent.prototype.handleClick = function () {
    ···
};


// ES6
function UiComponent() {
    var button = document.getElementById('myButton');
    button.addEventListener('click', () => {
        console.log('CLICK');
        this.handleClick(); // (A)
    });
}
```

Lorsque l’on a qu’un seul argument au sein d’une arrow function, il n’est pas obligatoire de mettre des parenthèses :

```javascript
const function = parameter => expression
```

Les accolades sont nécessaires si la function exécute du code avant de retourner son résultat :

```javascript
const function = parameter => {
    // do some stuff
    return expression
}
```

## Symbol

Les symbols sont un nouveau type primitif (comme Number, String et Boolean) apporté par ES6. Ils sont créés uniquement à partir des *factory function* (les fonctions qui ne sont ni des classes ni des constructeurs).

```javascript
var sym1 = Symbol();
var sym2 = Symbol("toto");
var sym3 = Symbol("toto");
```

À chaque fois que la fonction est appelée, un nouvel et unique symbol est créé : cela signifie que deux symbols ne seront jamais égaux, même si leur valeur est la même.

```javascript
Symbol("toto") === Symbol("toto"); // false
```

Le principal intérêt des symbols se trouve principalement dans leur utilisation avec les objets : il est possible de les assigner comme clé, ce qui nous permet de créer des clés uniques qui ne rentreront jamais en conflit avec d'autres clés.

## Generators

Toutes les nouveautés apportées par ES6 ne sont pas que des fonctionnalités. Il y a, parmi ces nouveautés, les generators, qui sont une nouvelle façon de boucler sur une collection en JavaScript. Les generators comprennent en réalité deux protocoles.

### Le protocole itérateur ###

Le protocole itérateur définit une façon standard pour produire une suite de valeurs, ainsi qu'une valeur de retour. Un objet est un itérateur lorsqu'il implémente une fonction `next()` qui retourne un objet avec deux propriétés : la `value` (qui correspond à la valeur courante lors de l'itération), et `done` (un booléen qui indique si on a atteint la fin de l'itération ou non).

    Ce sont les appels successifs à la méthode `next()` qui permettent donc de traverser et récupérer les valeurs d'un objet, comme montré dans cet exemple d'un tableau qui contiendrait deux valeurs (a et b) :

```javascript
iteratorArray.next();
// -> Object {value: "a", done: false}
iteratorArray.next();
// -> Object {value: "b", done: false}
iteratorArray.next();
// -> Object {value: undefined, done: true}
```

### Le protocole itérable ###

Le protocole itérable permet aux objets de définir leur comportement lors d'une itération (car ils n'en ont pas nativement, contrairement aux tableaux). Un objet est un itérable s'il implémente une méthode particulière qui va retourner l'itérateur. Cette méthode doit être définie en utilisant le symbole `[Symbol.iterator]`.

    Pour reprendre l'exemple précédent, voici l'itérable d'un tableau :

```javascript
const arr = ["a", "b"];
const iteratorArray = arr[Symbol.iterator]();
iteratorArray.next();
// -> Object {value: "a", done: false}
iteratorArray.next();
// -> Object {value: "b", done: false}
iteratorArray.next();
// -> Object {value: undefined, done: true}
```

Sans ces protocoles, une bonne partie des fonctionnalités (comme le spread ou le destructuring) ne pourrait pas exister :

```javascript
const arr = ["a", "b"];

// La syntaxe à laquelle on pense immédiatement est la syntaxe « for... of »
// qui permet de boucler sur les valeurs des Iterables.
for (val of arr) {
  console.log(val);
}

// Le spread qui permet d'insérer facilement des valeurs dans un Array
// utilise des Iterables.
["0", ...arr, "1"]; // 0, a, b, 1

// Le destructuring avec le pattern Array
const [x, y] = arr; // x = 'a',  y = "b"
```

Voici un [article](http://2ality.com/2015/02/es6-iteration.html) qui vous permettra de creuser si le sujet vous intéresse.

## Classes

L'ajout des classes en JavaScript est juste une façon d'utiliser les constructeurs de manière plus lisible et accessible.

En ES5, on implémente le constructeur de la fonction directement :

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.describe = function () {
    return 'Person called '+this.name;
};
```

Alors qu'en ES6 on utilise une classe :

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    describe() {
        return 'Person called '+this.name;
    }
}
```

La syntaxe pour les getters et les setters reste la même qu'en ES5 :

```javascript
class MyClass {
    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: '+value);
    }
}
```

Une sous-classe hérite d'une autre classe grâce à l'utilisation du mot clé `extends`.

Si l'on construit un constructeur dans une sous-classe, on doit utiliser `super()` avant `this`.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  makeSound() {
    console.log(this.name + ' make some noise.');
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // appelle le constructeur parent avec le paramètre
  }
  makeSound() {
    console.log(this.name + ' bark.');
  }
}
```

⚠️ Contrairement aux fonctions, les classes ne bénéficient pas du hoisting. Il est donc nécessaire de déclarer la classe avant de l'instancier :

```javascript
const p = new Rectangle(); // ReferenceError

class Rectangle {}
```

Voici un [article](https://medium.com/@robertgrosse/how-es6-classes-really-work-and-how-to-build-your-own-fd6085eb326a) (en anglais !) qui pourrait vous intéresser si vous cherchez à comprendre ce qui se passe en coulisses, ou [celui-ci](http://exploringjs.com/es6/ch_classes.html#ch_classes) pour creuser le sujet et voir toutes les subtilités des classes.

## Conclusion

Cet article est loin d'être exhaustif (comme vous pouvez le voir [ici](http://tc39wiki.calculist.org/es6/)), et se concentre sur certaines des nouvelles fonctionnalités les plus utilisées. Il a principalement pour but de donner des premières pistes de compréhension sur les concepts abordés (car il serait possible d'écrire un article entier sur chacune des fonctionnalités), mais n'hésitez pas à vous documenter plus en profondeur !
Par ailleurs, une deuxième partie arrive bientôt pour parler d'autres fonctionnalités très utilisées, comme le spread operator, le destructuring, ou les modules.
