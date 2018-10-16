---
layout: post
title: La programmation fonctionnelle avec Choo
lang: fr
permalink: /fr/la-programmation-fonctionnelle-avec-choo/
excerpt: "Encore un nouveau framework JS?!!?! Ça commence à bien faire! Et oui encore un, mais celui-ci est super mignon ! Vous allez voir !"
authors:
 - rascarlito
date: '2017-01-09 16:55:06 +0100'
date_gmt: '2017-01-09 15:55:06 +0100'
categories:
- Javascript
tags:
- Javascript
- api
- framework
- choo
---

Bonjour ! je vais vous parler d'un nouveau framework JavaScript qui s'appelle [Choo](https://github.com/yoshuawuyts/choo){:rel="nofollow noreferrer"} (ou ChooChoo pour les intimes).

Encore un nouveau framework JS?!!?! Ça commence à bien faire!

Et oui encore un, mais celui-ci est super mignon ! Vous allez voir !

6 méthodes
==========

En effet, la simplicité de Choo est ce qui le caractérise le plus. Son API est composée de six méthodes uniquement. Vous allez me dire que ce n'est pas possible. Eh ben si, c'est possible de reproduire un système très similaire en fonctionnement au couple React + Redux avec uniquement six méthodes à manipuler :

-   const app = choo() Instancie le framework
-   app.model() Crée un modèle pour contenir et manipuler des données
-   app.router() Déclare les routes de l'application
-   app.start() Crée le premier rendu en renvoyant l'arbre DOM généré par la route déclenchée
-   app.use() Déclare un plugin. Cette interface n'est pas nécessaire la plupart du temps
-   send() Envoie un événement depuis une vue à un modèle pour modifier ses données et engendrer un nouveau rendu

Voici un exemple des plus basiques :

```js
const choo = require('choo')
const html = require('choo/html')

// Instancier l'application
const app = choo()

// Déclarer un modèle avec ses reducers
app.model({
    namespace: 'counter',
    state: { value: 0 },
    reducers: {
        increment (state, data) {
            return { value: state.count + 1 }
        }
    }
})

// Déclarer une vue
function mainView (state, prev, send) {
    return html `
        <div>
            <div>${state.count}</div>
            <button onclick=${increment}>Increment</button>
        </div>
    `;

    function increment () {
        send('counter:increment')
    }
}

// Attacher la vue à une route
app.router(['/', mainView])

// Activer le rendu de l'application
const tree = app.start()
// Attacher l'arbre DOM généré au document
document.body.appendChild(tree)
```

Et voilà ! Un petit compteur avec un bouton pour incrémenter la valeur du compteur, rien de plus simple !

Maintenant, voyons ça un peu plus en détails.

Charger les dépendances
=======================

```js
const choo = require('choo')
const html = require('choo/html')
```

Rien de plus banal ici. On charge la méthode choo() qui va nous servir à démarrer notre petit train. Puis, on charge une méthode html qui n'est rien d'autre que la librairie open-source bel, une des dépendances de Choo. En effet, ce n'est pas Choo qui s'occupe du DOM. À la place, il délègue ça à une autre petite librairie qui sait déjà le faire.

Démarrer le petit train
=======================

```js
const app = choo()
```

On instancie le framework en exécutant la méthode choo() à laquelle on peut passer un objet pour écouter certains événements globaux. On en récupère un objet qui va nous permettre d'accéder aux autres méthodes du framework.

Les modèles
===========

```js
const http = require('xhr')

app.model({
    namespace: 'counter',
    state: { count: 0 },
    effects: {
        fetchCount: (state, data, send, done) => {
            http.get('/counter', { json: true }, (err, res, body) => {
                if (err) return done(err)
                send('counter:increment', body.value, done)
            })
        }
    },
    reducers: {
        increment (state, data) {
            return { value: state.count + 1 }
        }
    }
})
```

Un modèle avec Choo est simplement un objet qui décrit un état initial et fournit quelques méthodes pour modifier cet état. L'exemple ici est un peu plus complexe pour montrer les paramètres plus avancés du fonctionnement des modèles.

Les données sont représentées par le state qui est un objet avec le contenu que l'on souhaite.

Les reducers sont des méthodes synchrones qui sont chargées de modifier le state. C'est le seul endroit où l'on peut réellement le modifier, le reste de l'application étant obligé d'appeler ces reducers via la méthode send() que chaque vue reçoit en paramètre pour modifier le state.

Choo représente les données dans un objet de state global, ce qui veut dire que peu importe le nombre de modèles que l'on crée, tous les state de ces derniers seront stockés dans un même objet. Pour éviter les conflits, on peut ajouter un namespace au modèle avec un nom unique.

Enfin, nous avons les effects qui vont servir à exécuter un appel asynchrone pour ensuite modifier le state via les reducers. Pour appeler les effects, on utilise également la méthode send().

Les vues
========

```js
const html = require('choo/html')

function mainView (state, prev, send) {
    return html `
        <div>
            <div>${state.count}</div>
            <button onclick=${increment}>Increment</button>
        </div>
    `;

    function increment () {
        send('counter:increment')
    }
}
```

Toutes les vues Choo sont tout simplement des fonctions qui retournent du DOM. Un peu comme en React, on va écrire le HTML dans nos fichiers JavaScript mais simplement dans une [template string ES2015](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals). Pour transformer cette string en DOM, Choo se repose sur la librairie [bel](https://github.com/shama/bel){:rel="nofollow noreferrer"}. La vue va également s'occuper d'écouter les événements utilisateur pour réagir en exécutant les effects ou reducers des modèles pour mettre à jour le state de l'application.

Le routeur
==========

```js
app.router({ default: '/404' }, [
    ['/', require('./views/main')],
    ['/404', require('./views/error')]
])
```

Tous les frameworks front-end se doivent d'avoir un bon routeur. Celui de Choo est très simple et efficace. Il suffit de lui donner une liste couple url/vue en forme d'Array. On peut également lui dire quelle route exécuter par défaut si la route demandée n'est pas trouvée.

Le routeur va s'occuper d'écouter les clics sur les liens dans les vues pour rediriger automatiquement sur la bonne route en utilisant l'[API HTML5 pushState](https://developer.mozilla.org/en-US/docs/Web/API/History_API){:rel="nofollow noreferrer"}.

Commencer le voyage !
=====================

```js
const tree = app.start()
document.body.appendChild(tree)
```

C'est le début de l'aventure ! Il ne reste plus qu'à demander à Choo d'exécuter le premier rendu de l'application et de rattacher le DOM généré au document et voilà !

Pour plus d'informations, d'exemples, et de petits trains mignons rendez-vous sur la [page github de Choo](https://github.com/yoshuawuyts/choo) ou sur sa [page de démonstration](https://choo.io/){:rel="nofollow noreferrer"}.

Bon voyage !
