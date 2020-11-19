---
layout: post
title: "Storybook - Découvrir les addons"
lang: fr
permalink: /fr/storybook-addons/
excerpt: "Deuxième épisode de cette série, découvrez les incroyables addons sur Storybook. C'est JUSTE des gamebreakers."
authors:
    - manu
categories:
    -  storybook
    - UX
    - UI
    - react
tags:
    - react
    - UI
    - UX
    - storybook
---

![Liste d'addon 1]({{ site.baseurl }}/assets/2020-01-02-Storybook-Addons/addonlist.png)

Coucou les bichons, on se retrouve pour un nouvel article qui porte sur les Addons !

> Attends, attends... Tu devais pas faire un article sur le Testing ou la Documentation ?

Alors oui, mais vu l'importance de la contribution des addons sur ce sujet, il aurait été bien dommage de ne pas en parler avant ! Mais pas de soucis, ces 2 sujets sont déjà dans les tuyaux.

Pour rappel, dans le précédent article, nous avons vu ensemble que Storybook est un environnement de développement de composants. Son but est de simplifier cette tâche en fournissant des `stories` qui servent de guidelines/spec pour les composants, améliorant l'exportabilité et la résilience générale.

## Clique sur la cloche et Addon toi

Bon, je pense qu'on sait tous ce qu'est une extension ou un module complémentaire :

Ce truc qui viens très souvent remplacer une tâche dont t'as bien la flemme au bout d'une semaine, et que tu sacrifies sur l'autel des ralentissements au démarrage.

Avant de cracher davantage dans la soupe, laissons quand même la parole au cuisinier, car qui mieux que Storybook pour vendre sa propre came ?

> **Supercharge Storybook**
> Storybook addons enable advanced functionality and unlock new workflows. Contributed by core maintainers and the amazing developer community.

Donc on nous promet des supers modules qui viennent enrichir notre expérience, maintenus par Storybook et leur communauté ? Ça transpire pas l'originalité, mais ça a le mérite qu'on lui laisse une chance.

On pourrait presque être rabat-joie en se disant que c'est juste une mode d'ouvrir son projet aux addons communautaires... mais là, Storybook à vraiment l'air d'avoir pris les choses très au sérieux.

Déjà le nombre d'addons est moins important que le nombre de vendeurs de tours Eiffel au Trocadéro, on en dénombre 13 officiels et 27 communautaires, ça présage déjà de la part belle à la qualité et au besoin, plutôt qu'à la quantité.

![Liste d'addon 2]({{ site.baseurl }}/assets/2020-01-02-Storybook-Addons/addonlist2.png)

Dans les faits ces derniers sont rangés par fonctionnalité : **Organisation**, **Test, Code**, **Data & State**, **Style** et pour finir **Design**.

Ensuite, l'intérêt de ces modules est communautaire, on rappelle que le but de ce projet est de simplifier la vie de ceux qui l'utilisent : PO, UX designer, dev.

Par exemple, pour nous les petites mains du code, le but est de tester la réaction de notre composant à plusieurs états.

C'est donc tout naturellement que la communauté contribue en fournissant des outils pour permettre de moquer les comportements qu'ils rencontrent au quotidien, permettant ainsi d'intégrer à Storybook un composant connecté à un store Redux, soumis à un contexte comme le [ThemeProvider](https://www.styled-components.com/docs/advanced) de [Material-UI](https://material-ui.com/customization/theming/), bourré de Query/Mutation GraphQL, de l'internationalisation jusqu'à l'accessibilité.

En fait, c'est ce qui fait que Storybook puisse être pertinent, il s'intègre dans l'écosystème de React tout en assumant son rôle.

Bon là je vous sens déjà plus intéressés, est-ce qu'on s'en installerait pas un ou deux, comme ça, pour le plaisir ?

## Un fichier pour les gouverner tous

La dernière fois, on a vu les possibilités qu'offrait le fichier story pour soumettre notre composant à plusieurs états.

Je sais que vous en rêvez encore la nuit mais pour les insomniaques, un petit rappel :

```javascript
    import React from 'react';
    import { storiesOf } from '@storybook/react';
    import { action } from '@storybook/addon-actions';

    import Task from './Task';

    export const task = {
        id: '1',
        title: 'Prévenir Jeanine',
        state: 'TASK_INBOX',
        updatedAt: new Date(2018, 0, 1, 9, 0)
    };

    export const actions = {
        onPinTask: action('onPinTask'),
        onArchiveTask: action('onArchiveTask')
    };

    storiesOf('Task', module)
    .add('default', () => <Task task={task} {...actions} />)
    .add('pinned', () => <Task task={\{...task, state: 'TASK_PINNED'}} {...actions} />)
    .add('archived', () => <Task task={\{...task, state: 'TASK_ARCHIVED'}} {...actions} />);
```

Comme on est des grosses flemasses, nous on voudrait bien ne pas avoir à éditer ce fichier, le sauvegarder et revenir sur notre storybook pour avoir notre retour visuel...

Un peu comme ça non ?

![Storybook knobs addon]({{ site.baseurl }}/assets/2020-01-02-Storybook-Addons/knobs.gif)

C'est cadeau, c'est l'addon **Knobs** comme on peut voir dans le petit onglet, juste à côté d'**Actions**, qui lui aussi est un addon qu'on a utilisé dans le tutoriel d'avant (celui qui permet de mocker des callbacks type `onClick()` par exemple) et qui est déjà présent dans notre fichier story :

```javascript
    // src/components/Task.stories.js
    (...)
    import { action } from '@storybook/addon-actions';

    (...)

    export const actions = {
        onPinTask: action('onPinTask'),
        onArchiveTask: action('onArchiveTask')
    };
```

On va donc s'empresser d'ajouter notre nouvel addon **Knobs :**

`yarn add @storybook/addon-knobs`

Puis on fait un petit tour dans le fichier `.storybook/addon.js` où l'on doit **register** notre addon

```javascript
// .storybook/addons.js

import "@storybook/addon-actions/register";
import "@storybook/addon-knobs/register";
```

C'est tout ! 😏

On va donc immédiatement éditer le code de notre story

```javascript
    // src/components/Task.stories.js

    (...)
    import { withKnobs, object } from '@storybook/addon-knobs/react';

    (...)

    storiesOf('Task', module)
      .addDecorator(withKnobs) // on passe withKnobs en argument à addDecorator()
    	// On passe object('knobName', props) pour trigger l'addon sur l'UI Storybook
    	.add('default', () => {
        return <Task task={object('superArticleManu', { ...task })} {...actions} />;
      })
      .add('pinned', () => <Task task={\{ ...task, state: 'TASK_PINNED' }} {...actions} />)
      .add('archived', () => <Task task={\{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

![Storybook knobs addon]({{ site.baseurl }}/assets/2020-01-02-Storybook-Addons/knobs1.png)

Et là imaginez, vous filez ça à Jean-Marie qui est en charge de tester votre composant. Il va s'éclater à voir si vous avez pas fait de la daube pour revenir vers vous, avec une haleine de cendrier et de café froid, en vous beuglant :

> Eh mec ! T'as vu la gueule de ton composant ? Quand j'ai mis un titre un peu long ? Non mais je te jure... hahaha

![Storybook knobs addon 2]({{ site.baseurl }}/assets/2020-01-02-Storybook-Addons/knobs2.png)

Quel coquin ce Jean-Marie, mais il n'a pas tort. On peut simplement se rajouter une nouvelle story "long titre" pour sauvegarder ce use-case et éviter la régression.

```javascript
    // src/components/Task.stories.js

    const longTitre = "Une phrase bien longue, du genre, que tu ne mettras jamais dans une tâche à faire, mais là Charles-Edouard il tiens un truc t'inquiète"

    storiesOf('Task', module)
      .add('default', () => <Task task={task} {...actions} />)
      .add('pinned', () => <Task task={\{ ...task, state: 'TASK_PINNED' }} {...actions} />)
      .add('archived', () => <Task task={\{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />)
      .add('long titre', () => <Task task={\{ ...task, title: longTitre }} {...actions} />);
```

Voilà voilà, c'est déjà fini les copains ! Mais promis on se revoit vite pour regarder ensemble, à travers deux articles, comment qu'on fait pour avoir de très beaux **Tests structurels** et aussi une très belle **Documentation de composant**, genre documentation de Material UI, mais sans effort.

Je pense fort à vous, hésitez pas à venir me claquer une bise si ça vous a plu.

## À bientôt les bichons 👋
