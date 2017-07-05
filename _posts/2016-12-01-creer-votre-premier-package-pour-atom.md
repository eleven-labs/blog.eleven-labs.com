---
layout: post
title: Créer votre premier package pour Atom
permalink: /fr/creer-votre-premier-package-pour-atom/
authors: 
    - vcomposieux
date: '2016-12-01 12:14:17 +0100'
date_gmt: '2016-12-01 11:14:17 +0100'
categories:
    - Javascript
tags:
    - atom
    - package
    - babel
    - jasmine
---

# Introduction à Atom

[Atom](https://atom.io) est un éditeur de texte (principalement utilisé pour du code) multi-plateforme développé par la société GitHub et qui s'appuie sur un autre framework développé par GitHub : <a href="http://electron.atom.io/">Electron</a>, qui permet de développer des applications natives pour chaque système d'exploitation à partir de code Javascript.

Le grand intérêt d'Atom est qu'il peut être étendu très facilement avec un peu de code Javascript et c'est ce que nous allons voir dans cet article. Ainsi, tout le monde peut écrire son "package" pour Atom.

Aussi, sa communauté très active compte déjà un bon nombre de packages : `5 285` au moment où j'écris cet article.
Vous pouvez les retrouver à l'URL suivante : [https://atom.io/packages](https://atom.io/packages)

Si toutefois vous ne trouvez pas votre bonheur dans les packages déjà proposés, vous pouvez alors écrire le votre et nous allons voir qu'il n'y a rien de compliqué.

# Générer son premier package

Pour créer votre premier package, rassurez-vous, vous n'allez pas partir de rien. En effet, nous allons utiliser la commande fournie par le package `Package Generator` natif à Atom.
Pour se faire, il vous suffira de naviguer dans : `Packages` -> `Package Generator` -> `Generate Atom Package`.

Lors de la génération, vous pouvez choisir le langage que vous souhaitez utiliser pour développer votre package, entre `Javascript` et `Coffeescript`. Cet article est rédigé en Javascript.

Atom vous ouvrira alors une nouvelle fenêtre à l'intérieur de votre nouveau package, nommé `my-package`.

# Structure d'un package

Nous allons maintenant détailler la structure par défaut du projet :

```
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── keymaps
│   └── my-package.json         <- Raccourcis clavier enregistrés par votre package
├── lib
│   ├── my-package-view.js
│   └── my-package.js           <- Point d'entrée de votre package
├── menus
│   └── my-package.json         <- Déclaration des menus que votre package ajoute dans Atom
├── package.json                <- Fichier descriptif et de dépendances de votre package
├── spec                        <- Répertoire de tests (Jasmine) de votre package
│   ├── my-package-spec.js
│   └── my-package-view-spec.js
└── styles                      <- Feuilles de styles utilisées par votre package
└── my-package.less
```

Le premier élément à renseigner est le fichier `package.json`  qui doit contenir les informations relatives à votre package tel que son nom, sa version, license, mots clés pour trouver votre package et également ses librairies de dépendances.
Notez également la présence dans ce fichier d'une section `activationCommands`  qui vous permet de définir la commande exécutée lors de l'activation de votre package.

Nous avons ensuite le fichier `keymaps/my-package.json`  qui vous permet d'enregistrer des raccourcis clavier dans votre application, de façon très simple :

```json
{
  "atom-workspace": {
    "ctrl-alt-p": "my-package:toggle"
  }
}
```

Passons maintenant au point d'entrée de votre package. Il s'agit de ce qui se trouve dans `lib/my-package.js`.
Dans ce fichier est exporté un objet par défaut qui contient une propriété `subscriptions`  et des méthodes `activate()`  et `deactivate()`  notamment.

Lors de l'activation de notre package (dans la méthode `activate()` ), nous allons enregistrer dans notre propriété `subscriptions`  un objet de type [CompositeDisposable](https://atom.io/docs/api/latest/CompositeDisposable)  qui nous permettra d'ajouter et d'éventuellement plus tard, supprimer des commandes disponibles dans notre package :

```js
activate(state) {
  this.subscriptions = new CompositeDisposable();
  this.subscriptions.add(atom.commands.add('atom-workspace', {
    'my-package:toggle': () => this.toggle()
  }));
}
```

Notre commande étant enregistrée, nous pouvons dès maintenant l'exécuter en ouvrant la palette de commande : `My Package: Toggle`.

Celle-ci va exécuter le code contenu dans la méthode `toggle()`  de votre classe, soit dans le package par défaut, afficher une petite fenêtre en haut de l'écran.
Vous pouvez ajouter autant de commandes que vous le souhaitez et surtout, découper votre code comme vous le sentez.

## Ajouter des paramètres dans mon package

Vous avez la possibilité d'ajouter des paramètres à votre package et ceci est rendu possible grâce au composant [Config](https://atom.io/docs/api/latest/Config)</a>.

Il vous suffira d'ajouter une propriété `config`  à votre classe en définissant un objet avec la définition de chaque élément que vous souhaitez voir apparaître dans vos paramètres :

```json
config: {
  "gitlabUrl": {
    "description": "If you rely on a private Gitlab server, please type your base URI here (default: https://gitlab.com).",
    "type": "string",
    "default": "https://gitlab.com"
  }
}
```

La configuration offre un grand nombre de valeurs disponibles (`boolean` , `color` , `integer` , `string` , ...) ce qui permet de laisser un grand nombre de choix à vos utilisateurs.
Les paramètres de votre package apparaîtront alors pour votre package, sous Atom :

![Gitlab URL Parameter](/assets/2016-12-05-create-atom-package/gitlab-url.png)

Vous pourrez alors, à tout moment dans votre code, obtenir dans votre package la valeur définie par l'utilisateur (ou la valeur par défaut fournie si aucune valeur n'a été renseignée) via :

```js
let gitlabUrl = atom.config.get('gitlabUrl');
```

# Tour d'horizon des composants

Vous pouvez maintenant commencer à développer votre package, nous allons donc parcourir les différents composants qui sont à votre disposition et que vous pourrez utiliser dans votre package !

## TextEditor : Agissez sur l'éditeur de texte

Avec le composant `TextEditor` , vous allez pouvoir insérer du texte dans votre éditeur, enregistrer le fichier, jouer sur l'historique des actions (aller en avant ou arrière), déplacer le curseur dans l'éditeur, copier/coller dans le presse-papier, jouer sur l'indentation, scroller, etc ...
Quelques commandes en exemple, ici pour insérer du texte à une coordonnée donnée et enregistrer le fichier :

```js
editor.setCursorBufferPosition([row, column]);
editor.insertText('foo');
editor.save();
```

## ViewRegistry et View : Créez et affichez votre propre fenêtre

Ces composants vont vous permettre de créer votre fenêtre à l'intérieur d'Atom et de l'afficher.
Vous disposez d'un exemple d'utilisation du composant `View`  dans le package généré par défaut :

```js
export default class MyPackageView {
    constructor(serializedState) {
      // Create root element
      this.element = document.createElement('div');
      this.element.classList.add('my-package');

      // Create message element
      const message = document.createElement('div');
      message.textContent = 'The MyPackage package is Alive! It\'s ALIVE!';
      message.classList.add('message');
      this.element.appendChild(message);
    }

    // ...
}

let myPackageView = new MyPackageView(state.myPackageViewState);
let modalPanel = atom.workspace.addModalPanel({
item: myPackageView.getElement(),
visible: false;
});

modalPanel.show();
```

## NotificationManager et Notification : Informez vos utilisateurs via des notifications

Vous avez également la possibilité de rendre des notifications dans l'éditeur de plusieurs niveaux, avec les commandes suivantes :

```js
atom.notifications.addSuccess('My success notification');
atom.notifications.addInfo('My info notification');
atom.notifications.addWarning('My warning notification');
atom.notifications.addError('My error notification');
atom.notifications.addFatalError('My fatal error notification');
```

## GitRepository

Celui-ci est très intéressant : vous pouvez en effet accéder à toutes les propriétés du repository Git actuellement utilisé par l'utilisateur.
Vous pourrez alors obtenir (entre autres) la branche actuellement utilisée, obtenir l'URL du remote, voir si un fichier est nouveau ou modifié ou encore accéder au diff.

```js
let repository = atom.project.getRepositoryForDirectory('/path/to/project');

console.log(repository.getOriginURL());               // -> git@github.com:eko/atom-pull-request.git
console.log(repository.getShortHead());               // -> master
console.log(repository.isStatusNew('/path/to/file')); // -> true
```

## Encore bien d'autres choses à découvrir ...
Je vous ai présenté les composants les plus courants mais je vous invite à visiter la documentation de l'API si vous souhaitez aller plus loin : [https://atom.io/docs/api/latest/AtomEnvironment](https://atom.io/docs/api/latest/AtomEnvironment)

# Tester votre package

Nous en arrivons au moment de tester notre package, et pour cela, Atom utilise [Jasmine](https://jasmine.github.io)

Votre package vient déjà avec un fichier de test pré-défini :

```js
import MyPackageView from '../lib/my-package-view';

describe('MyPackageView', () => {
  it('has one valid test', () => {
    expect('life').toBe('easy');
  });
});
```


Les tests Jasmine doivent être structurés de la façon suivante :

* `describe()`  : Une suite de test commence par une fonction describe qui prend un nom en premier argument et une fonction en deuxième argument,
* `it()`  : Une spécification est ajoutée par ce mot clé, il doit être contenu à l'intérieur d'une suite de test,
* `expect()`  : Il s'agit d'une assertion, lorsqu'on s'attend à avoir un résultat donné.

C'est maintenant à vous de jouer et de tester votre logique applicative.

Vous pouvez lancer les specs via le menu d'Atom : `View`  -> `Packages`  -> `Run Package Specs`.

# Publier votre package

Notre package est maintenant prêt à être publié !

![Publish](/assets/2016-12-05-create-atom-package/publish.gif)

Pour se faire, nous allons utiliser l'outil CLI installé avec Atom : `apm`.

Après avoir pushé votre code sur un repository Github, rendez-vous dans le répertoire de votre package et jouez la commande suivante :

```bash
$ apm publish --tag v0.0.1 minor

Preparing and tagging a new version ✓
Pushing v0.0.1 tag ✓
...
```

La commande va s'occuper de créer et pusher le tag de la version spécifiée et référencer cette version sur le registry d'Atom.
Félicitations, votre package est maintenant publié et visible à l'URL : `https://atom.io/packages/<votre-package>` !

# Intégration continue

Afin de vous assurer que votre package fonctionne toujours sur la version stable d'Atom mais également pour anticiper et tester également la version bêta, vous pouvez mettre en place [Travis-CI](https://travis-ci.org) sur le repository de votre code avec le fichier suivant :

```yaml
language: objective-c

notifications:
  email:
    on_success: never
    on_failure: change

script: 'curl -s https://raw.githubusercontent.com/nikhilkalige/docblockr/develop/spec/atom-build-package.sh | sh'

env:
  global:
    - APM_TEST_PACKAGES=""

  matrix:
    - ATOM_CHANNEL=stable
    - ATOM_CHANNEL=beta<
```

# Conclusion

Je trouve personnellement qu'il s'agit d'une vraie révolution de pouvoir interagir à tel point avec l'éditeur de texte, l'outil utilisé la plupart du temps par les développeurs.
L'API d'Atom est déjà très riche et est très simple à utiliser, c'est très certainement la raison pour laquelle la communauté offre déjà un bon nombre de packages.

Comme pour toute librairie, inutile de réinventer la roue et de créer des doublons dans les packages, l'idée est vraiment d'ajouter des fonctionnalités à Atom afin d'enrichir notre expérience utilisateur d'Atom.
