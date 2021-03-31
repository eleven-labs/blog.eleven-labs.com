---
layout: post
title: Les nouveautés d'ES6 Partie II
excerpt: La suite de la partie I est là ! Nous allons voir ensemble d'autres concepts apportés par ES6.
authors:
    - mehdidr
lang: fr
permalink: /fr/lesnouveauteses6partii/
categories:
    - javascript
tags:
    - ecmascript
    - javascript
    - ES6
---

Vous l'attendiez (si si, ne dites pas le contraire), la voici ! La deuxième partie des nouveautés d'ES6 est arrivée
_Psst, si tu n'as pas lu la partie I, elle se trouve [ici](https://blog.eleven-labs.com/fr/lesnouveauteses6parti) !_
Il est conseillé de l'avoir lue pour comprendre plus aisément certaines notions qui ne seront pas réexpliquées ici.

## destructuring

Le destructuring, ou en français "l'affectation par décomposition" permet d'extraire (techniquement, en faire une copie) des données d'un tableau ou d'un objet, et de les assigner à une variable ou de déclarer une variable grâce à une syntaxe qui ressemble à la structure d'un tableau ou d'un objet.

```javascript
// Exemple avec un tableau
var someArray = [1, 2, 3]

// ES5
var first = someArray[0];
var second = someArray[1];
var third = someArray[2];

// ES6
const [ first, second, third ] = someArray;

// Exemple avec un objet
var myObject = {
  foo: 1,
  bar: 2,
};

// ES5
var foo = myObject.foo;
var bar = myObject.bar;

// ES6
const { foo, bar } = myObject;
```

Il est par ailleurs possible de nester les propriétés autant que souhaité, mais aussi de passer celles qui ne nous intéressent pas, de créer des valeurs par défaut et même de les renommer :

```javascript
// Nester les propriétés
const [ foo, [[bar], baz]] = [1, [[2], 3] ];
console.log(foo); // 1
console.log(bar); // 2
console.log(baz); // 3

// Skipper les propriétés
const [,,third] = ["foo", "bar", "baz"];
console.log(third); // "baz"

// Renommer les propriétés
const myObject = {
  foo: 1,
  bar: 2,
};
const { foo: renamedFoo } = myObject;
renamedFoo; // 1

// Créer une valeur par défaut
const person = {
    name: 'John Doe',
    country: 'Canada'
};

const { name: fullname, country: place, age: years = 25 } = person; // si la clé age est undefined, sa valeur par défaut sera 25

console.log(`I am ${fullname} from ${place} and I am ${years} years old.`); // I am John Doe from Canada and I am 25 years old.'
```

Il faut cependant se méfier lorsque l'on utilise le destructuring sur un objet pour assigner une variable sans la déclarer :

```javascript
{ blowUp } = { blowUp: 10 }; // Syntax error
```

Cela se produit car javascript considère que l'on cherche à parser toute déclaration commencant par `{` comme un bloc (par exemple, `{ console }` est un bloc valide). Il suffit pour y remédier d'entourer l'assignation entre parenthèses :

```javascript
({ safe } = {}); // Pas d'erreur
```

Pour creuser le sujet et voir pleins d'exemples différents, je vous conseille de regarder par [ici](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition).

## rest parameter & spread operator

Le paramètre du reste et le spread operator font partie du sucre syntaxique apporté par ES6, tout comme le destructuring. Ils consistent tous les deux à effectuer plus simplement des opérations complexes sur les objets itérables en utilisant la syntaxe `...`.

### rest parameters

Le paramètre du reste (appelé ainsi car c'est un paramètre de fonction qui va servir à ramasser les "restes") remplace un mot-clé utilisé par les fonctions appelé `arguments`. Il permettait, comme son nom l'indique, de récupérer les arguments d'une fonction sous forme de tableau, qui ne conserve aucune des propriétés ou méthodes d'un tableau mis à part `length`.
De plus,  il était impossible de ne mettre qu'une partie des paramètres dans l'objet `arguments`, qui par ailleurs n'est pas disponible dans les arrow functions en plus d'être plus gourmand en performances.

Le rest parameter permet donc d'assembler plusieurs valeurs dans un tableau, sans avoir les problèmatiques de l'`arguments`.

```javascript
// Exemple 1
const logArgs = (...args) => console.log(args)

logArgs('coucou', 3, 'Bob') // args == ['coucou', 3, 'Bob']

// Exemple 2
const sumAll = (...args) => { // args is the name for the array
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

console.log(sumAll(1)); // 1
console.log(sumAll(1, 2)); // 3
console.log(sumAll(1, 2, 3)); // 6
```

### spread operator

Le spread operator (appelé opérateur de décomposition en français) permet de développer un objet itérable lorsqu'on a besoin de plusieurs arguments. Son utilisation est donc complètement opposée au rest parameter, et nous donne la possibilité par ailleurs d'éviter l'utilisation d'`apply` et `concat`:

```javascript
// Exemple 1
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5
console.log(arr1.concat(arr2, arr3)); // [ 'a', 'b', 'c', 'd', 'e' ]

// ES6
console.log([...arr1, ...arr2, ...arr3]); // [ 'a', 'b', 'c', 'd', 'e' ]

// Exemple 2

// ES5
console.log.apply(console, ["foo", "bar"]);

// ES6
console.log(...["foo", "bar"]); // même résultat
```

Le spread operator se marie à merveille avec l'utilisation du destructuring :

```javascript
const words = ["foo", "bar", "baz"];

// ES5
var first = words[0]; // "foo"
var rest = words.slice(1); // ["bar", "baz"]

// ES6
const [first, ...rest] = words; // même résulat
```

## Template literals

L'ajout du support des template literals (ou template strings) permet de simplifier la manipulation des chaînes de caractères. Ils sont par ailleurs supportés par la plupart des navigateurs et babel, donc aucune raison de passer à côté !

```javascript
// Exemple
const rep = 42;

// ES5
console.log('La réponse est ' + 42); // La réponse est 42

// ES6
console.log(`La réponse est ${rep}`); // La réponse est 42
```

Un autre intérêt des template literals est le support multi-lignes :

```javascript
// ES5
var multiline =
  "foo \
                 bar \
                 baz";

var multiline2 = "foo";
multiline2 += "bar";
multiline2 += "baz";

// ES6
const multiline = `foo
                   bar
                   baz`;
```

⚠️ Les espaces sont conservés sur l'utlisation du multi-lignes avec les templates literals.

```javascript
const str1 = `foo
bar`;

const str2 = `foo
             bar`;

str1 === str2; // => false
```

## Maps

Les Maps sont des dictionnaires qui contiennent des clés dont l'ordre d'insertion est mémorisé, auxquelles sont associées des valeurs. Bien qu'ils sont similaires aux objets, il existe certaines différences :

- Un objet possède un `prototype`, ce qui n'est pas le cas des maps.
- Les clés d'un objet sont soit des chaînes de caractères, soit des `Symbols`, alors que celles d'un Map peuvent avoir n'importe quelle valeur. Par exemple:

```javascript
const myMap = new Map();
myMap.set(window, 1);
myMap.get(window); // 1
```

Petite particularité des Maps, la valeur `NaN`, qui n'est pas égale à elle-même en JS, est bien gérée.

```javascript
myMap.set(NaN, 1);
myMap.get(NaN); // 1
```

- Les clés des Maps sont ordonnées par ordre d'insertion comme dit précédemment, contrairement à celles des objets qui n'ont pas d'ordre particulier. Il est par ailleurs possible d'itérer sur les clés des Maps (avec un `forEach` par exemple), ce qui est impossible avec un objet car il faut au préalable récupérer les clés pour pouvoir itérer dessus. Cela permet d'obtenir facilement un tableau, par exemple :

```javascript
const myEntries = [...myMap]; // […[key, value]]

// or
const myEntries = [...myMap.entries()];
```

- Il existe une méthode `size` qui permet de récupérer simplement la taille d'un Map, contrairement aux objets où il faudra compter "manuellement". En outre, les maps permettent de meilleures performances lorsqu'il s'agit d'ajouter ou supprimer fréquemment des éléments.

## Nouvelles méthodes pour les tableaux et les chaînes de caractères

L'ES6 apporte aussi de nouvelles méthodes pour les tableaux tels que `from`, qui permet de créer un tableau à partir d'un objet itérable (comme une string, un objet, etc), ou `findIndex` ou encore `fill`, etc.

Comme il serait trop long de toutes les énumérer ici, je vous renvoie vers cet [article](https://www.hackerearth.com/fr/practice/notes/hemanth12/es6-array-methods/). Si vous êtes anglophobes, n'hésitez pas à lire la [doc de MDN sur les array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array) ainsi que la [doc de MDN sur les chaînes de caractères](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) qui vous donnera de nombreux exemples.

Certaines méthodes sont beaucoup plus utilisées que d'autres, comme par exemple le `map`, le `reduce`, le `push`, ou encore le `join`. Il est cependant utile de connaître (ou du moins de savoir qu'elles existent) toutes les méthodes, car elles ont toutes leur utilité dans des cas spécifiques sur lesquels vous tomberez forcément un jour ou l'autre.

## Conclusion

Voilà, après ces deux parties bien remplies, nous arrivons au terme des fonctionnalités les plus intéressantes apportées par ES6 ! Elles ne sont pas toute expliquées ici, mais vous pouvez les retrouver sur ce [lien](https://exploringjs.com/es6/ch_core-features.html) ou encore [celui-ci](http://es6-features.org/#Constants). Attention cependant, il ne faut pas oublier que chacune des fonctionnalités évoquées est un simple aperçu, n'hésitez pas à creuser les différents sujets abordés. Certains diront qu'il manque les promesses qui est une énorme feature, mais je réserve ça pour un autre article. See ya !
