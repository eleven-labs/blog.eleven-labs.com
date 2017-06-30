---
layout: post
title: Papa, c'est quoi un Polyfill ?
excerpt: Avec l'avènement du js natif, et la multiplication des navigateurs et des environnements (mobile, desktop, tablette), on entend de plus en plus dans nos open-spaces «-Dis, tu connaîtrais pas un polyfill ?»
author: captainjojo
permalink: /fr/tutoriel-polyfill/
categories:
- Javascript
tags:
- tutoriel
- Javascript
- web
---

Avec l'avènement du js natif, et la multiplication des navigateurs et des environnements (mobile, desktop, tablette), on entend de plus en plus dans nos open-spaces :

> «-Dis, tu connaîtrais pas un polyfill ?»

Mais c'est qui ce polyfill ?

### Définition :

Un polyfill, c'est simple. C'est un ensemble de fonctions permettant de simuler, sur un [navigateur web](https://fr.wikipedia.org/wiki/Navigateur_web) ancien, des fonctionnalités qui ne sont pas nativement disponible. (cf : Wikipédia)

En clair, c'est comme à l'époque avec le double CSS, un spécialement pour IE et un pour le reste. Aujourd'hui les navigateurs n'implémentent pas à la même vitesse les nouvelles fonctionnalités disponibles par javascript natif. Nous devons alors utiliser un polyfill pour que celle-ci soient disponibles partout.
Et là je vous entend me dire :

> «-Mais c'est pas ce que Jquery fait déjà ?»

Alors non, ce n'est pas exactement ce que fait Jquery. En effet, ce dernier est une surcouche qui permet d'utiliser les mêmes fonctions js sur l'ensemble des navigateurs, mais ce n'est pas un polyfill, car il renomme les fonctions et n'utilise pas directement la fonction native.
Encore une fois, vous allez me dire :

> «-Mais alors, c'est quoi le polyfill ?»

C'est simple. Prenons la fonction native javascript "[fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch)", qui permet d'appeler des urls en XHR. Si vous allez sur le site [Can I Use ?](http://caniuse.com/#search=fetch), vous verrez que vous ne pouvez pas utiliser cette fonction sur IOS 10.  Alors vous pouvez utiliser la fonction "ajax" de Jquery mais en échange vous avez chargé l'ensemble de Jquery et n'utilisez pas la puissance de votre navigateur. C'est là qu'il vous faut le polyfill "fetch" disponible ici [https://github.com/github/fetch](https://github.com/github/fetch). Il vous suffit de l'importer et alors la fonction "fetch" sera disponible pour l'ensemble des navigateurs, même IOS 10.
Et maintenant, je vous entend encore:

> «-Je trouve pas mon polyfill, alors comment je le développe ?»

### Comment implémenter un polyfill ?

Nous allons faire simple, aujourd'hui nous voulons utiliser la fonction "Object.assign()" permettant de créer un nouvel object js.

Si vous allez sur [Can I Use](http://caniuse.com/) vous trouvez la page [suivante](http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign) :

![](/assets/2016-12-13-tutoriel-polyfill/Capture-d’écran-2016-12-11-à-17.38.08.png)

Donc comme vous pouvez le voir, la fonction n'est pas implémentée sur IE11. Nous allons donc faire le polyfill nous même.

Il suffit d'abord de vérifier l'existence de la fonction :

```javascript
if (typeof Object.assign != 'function') {
  // La fonction n'existe pas
}
```

Si elle n'existe pas alors on la surcharge avec notre polyfill, et en js il suffit de définir la fonction :

```javascript
if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    'use strict';
    // on developpe
  };
}
```

Et maintenant on fait le développement :

```javascript
if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index &lt; arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
```

Et voilà ! Vous avez un polyfill !
Normalement il y a un polyfill pour tout alors avant de l'implémenter, go to [Google](https://www.google.fr/).
