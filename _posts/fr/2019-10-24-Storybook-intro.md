---
layout: post
title: Storybook - Créer son premier composant
excerpt: Storybook c'est le framework open-source qui a été récompensé pendant la dernière React Europe, décrouvrons ce qu'il nous cache dans cet intro!
authors:
- manu
permalink: /fr/Storybook-creer-son-premier-composant/
categories:
    - Angular
    - React
    - Vue
    - Svelte
    - HTML
    - Storybook
tags:
    - javascript
    - storybook
    - react
    - vue
    - angular
    - UX
    - UI
---
![](/assets/2019-10-24-Storybook-intro/storybooktitle.png)

&nbsp;

# Storybook - Créer son premier composant

Le but de cette future série d'article sur Storybook est de présenter une feature de la librairie pour explorer ses possibilités, le tout de la manière la plus concise possible, avec des petits exemples.

Pour le cas pratique, c'est directement extrait de la documentation officiel de Storybook et ce sera souvent le cas.  
Comme Gad Elmaleh, c'est pas grave si c'est mieux raconté.



&nbsp;
&nbsp;
# Mais qu'est-ce c'est Storybook?

---

Storybook c'est une librairie open source créée pour le développement de composant UI qui se concentre sur l'isolation des composants, permettant une création plus organisée et donc plus efficace.

C'est un environnement de développement permettant de naviguer dans un catalogue de composant (book), de voir les différents états d'un composant par use-case (story) tout en apportant des outils de test, de prévisualisation et de documentation du composant.

&nbsp;

Storybook fonctionne avec la plupart des frameworks UI, que ce soit le sacro-saint triptyque Vue-React-Angular autant que Svelte, React Native ou même les Web Components 🤙

> *"Ah le salaud il a pas cité mon framework"*



&nbsp;
# Père Castor, raconte-moi une Story

---

L'idée derrière ce service est d'apporter une haute robustesse et maintenabilité aux composants de son interface, permettant de les réutiliser et de les partager dans un 'environnement de confiance' (ça c'est la préface du conte).

&nbsp;

Cela est possible grâce aux différentes fonctionnalités de Storybook:
- Construire des composants en isolation
- Moquer facilement des états clés du composant difficiles à recréer dans son application (loading, error, disabled, user not logged in, etc.)
- Créer, documenter, rejouer des use cases en tant que Story pour chaque composant

Auxquelles s'ajoute l'utilisation:  

- De snapshot et test unitaire pour les composants
- Des addons (extensions) pour enrichir l'environnement de base de Storybook

&nbsp;

Storybook propose donc un cadre où l'on peut tester la réponse d'un composant à une story qui n'est, en soi, qu'un jeu de valeur des props passés au composant.

&nbsp;

Qui dit environnement de confiance, dit contremaîtres, et donc vous pourrez inviter PO, Scrum, Designer, QA à votre beau projet pour qu'ils mettent des commentaires partout.

> *"Très joli ton carrousel Eric, maintenant que je le vois, je me dis qu'il faudrait l'enlever..."*  

&nbsp;

Si vous voulez de bons exemples 😉

→ Storybook de Carbon: une librairie de composant

[![Storybook d'un composant Airbnb]({{ site.baseurl }}/assets/2019-10-24-Storybook-intro/carbon.png)](http://react.carbondesignsystem.com/?path=/story/dropdown--default)


→ Storybook d'un composant Airbnb, celui du choix dans les dates

[![Storybook d'un composant Airbnb]({{ site.baseurl }}/assets/2019-10-24-Storybook-intro/airbnb.png)](https://airbnb.io/react-dates/?path=/story/daterangepicker-drp--default)



&nbsp;
&nbsp;
# Read The Fucking Story

---
## useStorybook()

Après un bon vieux `create-react-app` des familles on peut initialiser Storybook (sb) facilement via npx 

`npx -p @storybook/cli sb init`

## Avant d'y aller...

Ça y est, une nouvelle vie de développeur front commence, Storybook installé, les étoiles plein les yeux, tu te dis que plus jamais tu n'auras à retoucher 200 fois ton beau composant. Désormais c'est le vrai monde qui t'attends, et le vrai monde il va chez le coiffeur... et fait du CDD.

&nbsp;

[CDD](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) ( Composent-Driven Development ), si on doit la faire courte, c'est comme du TDD mais à la place des test t'utilises des user stories.

&nbsp;

## Cas pratique

---

<div align="center">
  <img src="{{ site.baseurl }}/assets/2019-10-24-Storybook-intro/pasorcier.png">
</div>

&nbsp;

On va donc appliquer cette belle méthodologie, sur la meilleure application possible: cette bonne vieille to-do list!

Alors on va commencer par se faire un tout petit composant bien gentil qui afficherai une tâche importante comme: *"Prévenir Jeanine".*
``` javascript
    // src/components/Task.js
    
    import React from 'react';
    
    export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
      return (
        <div className="list-item">
          <input type="text" value={title} readOnly={true} />
        </div>
      );
    }
```
Cette tâche va pouvoir vivre sa meilleure vie: être normal, être archivée ou être importante.

On va donc rédiger des jolis cas d'usage pour ce composant, AVANT de coder ses fonctionnalités (comme les tests en TDD)
```javascript
    // src/components/Task.stories.js
    
    import React from 'react';
    import { storiesOf } from '@storybook/react';
    import { action } from '@storybook/addon-actions';
    
    import Task from './Task';
    
    // La tâche de notre composant <Task />
    export const task = {
        id: '1',
        title: 'Prévenir Jeanine',
        state: 'TASK_INBOX',
        updatedAt: new Date(2018, 0, 1, 9, 0)
    };
    
    // Les callbacks qui sont mock via action()
    export const actions = {
        onPinTask: action('onPinTask'),
        onArchiveTask: action('onArchiveTask')
    };
    
    // Les stories, c'est ça le truc stylé.
    	 
    /*  storiesOf('NomDuComposant', module)
        .add('nomStory', render() callback) 
    */ 
    storiesOf('Task', module)
    .add('default', () => <Task task={task} {...actions} />)
    .add('pinned', () => <Task task={/{...task, state: 'TASK_PINNED'}/} {...actions} />)
    .add('archived', () => <Task task={/{...task, state: 'TASK_ARCHIVED'}/} {...actions} />);
```

Et là, c'est le déclic, Storybook permet de render facilement ses composants dans différents états.
Il devient donc facile de wrapper son composant autour de tout un tas de Provider.

```javascript
  storiesOf('NomDuComposant', module)
    .add('nomStory', render() callback) 
    .add('shouldFetchItemList', () => {
      const GET_TRUC_QUERY = gql``
      return (
        <Query query={GET_TRUC_QUERY}>
          {({data, error, loading}) => {
              if (loading) return <p>Loading...</p>
              if (error) return <p>Error: {error}</p>
              return <ItemList>
                  {data.items.map(item => <Item item={item} key={item.id}/>)}
              </ItemList> 
          }}
        </Query>
      )
    })
```

> *"Mais ça fait 6 fois que tu nous le dit"*

Oui mais là on le voit Billy.

&nbsp;

Maintenant qu'on a ce joli cadre de travail on va pouvoir changer le composant `<Task />` pour qu'il exploite tout ce que l'on souhaite tester avec nos stories
```javascript
    // src/components/Task.js
    
    import React from 'react';
    
    export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
      return (
        <div className={`list-item ${state}`}>
          <label className="checkbox">
            <input
              type="checkbox"
              defaultChecked={state === 'TASK_ARCHIVED'}
              disabled={true}
              name="checked"
            />
            <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
          </label>
    
          <div className="title">
            <input type="text" value={title} readOnly={true} placeholder="Input title" />
          </div>
    
          <div className="actions" onClick={event => event.stopPropagation()}>
            {state !== 'TASK_ARCHIVED' && (
              <a onClick={() => onPinTask(id)}>
                <span className={`icon-star`} />
              </a>
            )}
          </div>
        </div>
      );
    }
``` 

Bon on crève tous d'envie de voir ce fameux catalogue de composant, LE storybook, celui qui te fait te lever tous les matins, allons-y de ce p-

> Stop right there criminal scum

Il ne faut pas oublier de dire à Storybook où sont les stories sinon il va faire la gueule...
Il est un peu susceptible le George. 

```javascript
    // .storybook/config.js
    
    import { configure } from '@storybook/react';
    import '../src/index.css';
    
    const req = require.context('../src', true, /\.stories.js$/);
    
    function loadStories() {
      req.keys().forEach(filename => req(filename));
    }
    
    configure(loadStories, module);
```
1. `yarn storybook`
2. Wait...
3. `localhost:9009`

![](/assets/2019-10-24-Storybook-intro/tutobook.gif)

Et voilà c'est tout pour notre premier article!

> Mais... espèce de truand, c'est pas une todo list!

En effet, mais, mon lecteur adoré, je sais que tu es une personne adulte et que tu sauras te débrouiller comme un grand. 

Et si tu n'as pas lu l'encart en début d'article, la suite c'est simplement ici:

[![Storybook d'un composant Airbnb](/assets/2019-10-24-Storybook-intro/composite.png)](https://www.learnstorybook.com/intro-to-storybook/react/en/composite-component/)

&nbsp;

*À bientôt les bichons* 👋

&nbsp;
&nbsp;
## Prochains articles

---

→ Documenter son Storybook avec MDX et DocsPage 

![]({{ site.baseurl }}/assets/2019-10-24-Storybook-intro/docarticle.png)

&nbsp;

→ Test structurel de composant avec Storyshots et Jest

![](/assets/2019-10-24-Storybook-intro/testarticle.png)

