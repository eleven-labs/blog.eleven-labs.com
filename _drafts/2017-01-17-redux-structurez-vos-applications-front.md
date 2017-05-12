--- layout: post title: 'Redux : Structurez vos applications front'
author: vcomposieux date: '2017-01-17 10:09:00 +0100' date\_gmt:
'2017-01-17 09:09:00 +0100' categories: - Non classé - Javascript tags:
- Javascript - react - redux - vuejs --- {% raw %}

L'écosystème Javascript est très riche, beaucoup de développeurs mais
aussi de frameworks et d'outils sont disponibles.

Lorsque vous souhaitez développer une application, quel que soit son
framework de rendu, vous allez vite être amené à vouloir architecturer
votre projet afin de différencier et d'organiser les données des vues.
C'est particulièrement le cas lorsque vous utilisez des frameworks de
rendu de composants comme **React** ou **VueJS**.

Historiquement, le besoin s'est fait sentir sur
[React](https://facebook.github.io/react/) et Facebook a donc ouvert les
sources de son outil [Flux](http://facebook.github.io/flux/).

Le principe est le suivant :

[![](http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png){.size-full
.wp-image-3188 .aligncenter width="2232"
height="1114"}](http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png)

Votre application déclare, pour chaque composant, les
[actions]{.lang:default .decode:true .crayon-inline}  qui lui sont
liées. Ces actions permettent de définir l'état de votre composant,
stocké dans un [store]{.lang:default .decode:true .crayon-inline} , qui
permet de maintenir votre [vue]{.lang:default .decode:true
.crayon-inline}  à jour.

L'inconvénient est que dans ce cas, vous avez un store par composant. Ce
modèle fonctionne pour React mais vous pouvez vous sentir limité sur
certaines applications.

Dan Abramov a donc lancé, en juin 2015, [Redux](http://redux.js.org/),
qui permet principalement de simplifier la gestion du store car il y a
en effet qu'un seul store pour toute votre application dans Redux.

**Tous vos composants peuvent donc accéder à vos données.**

Pour plus d'informations sur les différences Redux / Flux, je vous
invite à lire cette [réponse de
Dan](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux/32920459#32920459).

 

Installation
------------

Nous allons voir dans cet article comment mettre en place et utiliser
Redux sur vos projets.\
Notez dès maintenant que la librairie peut être utilisée avec plusieurs
librairies de rendu comme React ou VueJS.

Pour installer Redux, il vous faudra installer le package npm (ou
yarn) [redux]{.lang:default .decode:true .crayon-inline} .\
Si vous utilisez Redux sur une application React, il vous faudra
également le package [react-redux]{.lang:default .decode:true
.crayon-inline}  ou encore [vue-redux]{.lang:default .decode:true
.crayon-inline}  s'il s'agit d'un projet VueJS.

``` {.lang:default .decode:true}
$ yarn add redux
```

Rien de plus, vous êtes prêt à utiliser Redux.

 

Utilisation classique
---------------------

Comme décrit précédemment, il vous faudra initialiser un
[store]{.lang:default .decode:true .crayon-inline}  qui va permettre de
stocker l'état de votre application.

Pour instancier ce store, il vous faudra passer un ou plusieurs
[reducers]{.lang:default .decode:true .crayon-inline} . Les reducers
contiennent les méthodes qui effectuent le changement d'état de votre
application.\
Ces changements d'état sont effectués lorsqu'une [action]{.lang:default
.decode:true .crayon-inline}  est déclenchée sur votre application.

Voilà, nous avons là les 3 composantes d'une application structurée par
Redux : des **actions**, des **reducers** et un **store**.

Nous allons prendre un cas pratique simple : un compteur que l'on peut
incrémenter ou décrémenter d'une certaine valeur.

 

Voici l'arborescence que nous ciblons :

``` {.lang:default .decode:true}
src/
├── actions
│   └── counter.js
├── constants
│   └── ActionTypes.js
├── reducers
│   ├── another.js
│   ├── counter.js
│   └── index.js
└── store
    └── configureStore.js
```

 

### Actions

Écrivons donc un fichier d'actions qui permet de définir ces deux
actions : incrémenter et décrémenter.

Avant tout, nous allons également stocker ces noms d'actions dans des
constantes, ce qui nous permettra d'être clair dans notre code car nous
ferons toujours appel à ces constantes.

Créez donc un fichier [src/constants/ActionTypes.js]{.lang:default
.decode:true .crayon-inline}  avec le contenu :

``` {.lang:js .decode:true}
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
```

 

Nous allons maintenant écrire les définitions des actions. Créez
maintenant le fichier [src/actions/counter.js]{.lang:default
.decode:true .crayon-inline}  :

``` {.lang:js .decode:true}
import * as types from '../constants/ActionTypes';

export const increment = (value) => ({ type: types.INCREMENT, value });
export const decrement = (value) => ({ type: types.DECREMENT, value });
```

 

Vous venez de déclarer deux actions ([increment]{.lang:default
.decode:true .crayon-inline}  et [decrement]{.lang:default .decode:true
.crayon-inline} ) qui prennent chacune un type (obligatoire) et une
valeur à ajouter ou soustraire.

 

### Reducers

Il nous faut maintenant écrire les méthodes des reducers permettant de
mettre à jour l'état de notre application.

Ces reducers seront écrits dans le fichier
[src/reducers/counter.js]{.lang:default .decode:true .crayon-inline}  :

``` {.lang:js .decode:true}
import { INCREMENT, DECREMENT } from '../constants/ActionTypes';

const initialState = {
  current: 0,
};

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        current: state.current += action.value,
      };

    case DECREMENT:
      return {
        current: state.current -= action.value,
      };

    default:
      return state;
  }
}
```

 

 

Vous avez compris l'idée, nous avons nos actions dans un [switch() {
case ... }]{.lang:default .decode:true .crayon-inline}  et mettons
directement à jour les valeurs de notre store.\
Vous remarquerez que nous avons créés un état initial (initialState)
afin d'initialiser les valeurs de notre application.

\[note\]**Note :** Il vous est possible de créer autant de reducers que
nécessaire.\[/note\]

 

Si vous avez déclaré plusieurs reducers dans votre application, vous
pouvez les combiner dans un fichier
[src/reducers/index.js]{.lang:default .decode:true .crayon-inline} 
comme suit :

 

``` {.lang:js .decode:true}
import { combineReducers } from 'redux';

import counter from './counter';
import another from './another';

const reducers = combineReducers({
  counter,
  another,
});

export default reducers;
```

 

### Store

Maintenant que nous avons nos actions et reducers, dernière étape
indispensable : la création du store !

Créez un fichier [src/store/configureStore.js]{.lang:default
.decode:true .crayon-inline}  avec le contenu suivant :

``` {.lang:js .decode:true}
import { createStore } from 'redux';
import reducers from '../reducers';

const configureStore = () => {
  return createStore(
    reducers,
  );
};

export default configureStore;
```

 

Nous utilisons ici la fonction [createStore()]{.lang:default
.decode:true .crayon-inline}  de l'API Redux permettant de créer notre
store.

 

Afin d'aller un peu plus loin, notez que cette fonction peut prendre
jusqu'à 3 arguments :

1.  un ou des reducers,
2.  un état pré-chargé (*optionnels*), correspondant à un état initial,
3.  des "enhancers" (*optionnels*), autrement dit des callbacks comme
    des middlewares.

Un middleware permet d'exécuter une callback à chaque fois que le
[dispatch()]{.lang:default .decode:true .crayon-inline}  d'actions est
exécuté.

 

Voici un exemple de middleware permettant de logger chaque action
déclenchée :

``` {.lang:js .decode:true}
import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers';

function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)
    return next(action)
  }
}

const configureStore = () => {
  return createStore(
    reducers,
    applyMiddleware(logger)
  );
};

export default configureStore;
```

 

N'oubliez pas d'utiliser la fonction [applyMiddleware()]{.lang:default
.decode:true .crayon-inline}  lorsque vous passez vos fonctions de
middleware au store.

 

Utilisation avec React
----------------------

Le principe reste exactement le même lorsque Redux est utilisé avec
React, cependant, la librairie [react-redux]{.lang:default .decode:true
.crayon-inline}  va vous apporter des petites choses en plus.

Vous allez en effet pouvoir lier l'état de votre application gérée par
Redux ainsi que les actions que vous avez définies avec les
[props]{.lang:default .decode:true .crayon-inline}  de vos composants
React.

Prenons un composant [Counter]{.lang:default .decode:true
.crayon-inline}  reflétant l'architecture Redux mise en place dans notre
cas d'exemple :

``` {.lang:js .decode:true}
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CounterActions from '../actions/counter';

const Counter = ({ children, value, actions }) => (
  


    Increment
    Decrement
  
);

Counter.propTypes = {
  children: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  value: state.counter.current,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(CounterActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Counter);
```

 

De cette façon, nous récupérons donc les valeurs de nos props provenant
de notre store mais également une propriété [actions]{.lang:default
.decode:true .crayon-inline}  permettant d'appeler nos actions Redux.

Les principaux éléments à noter ici sont :

-   [mapStateToProps]{.lang:default .decode:true .crayon-inline}  est
    une fonction permettant de mapper des **valeurs de notre state**
    Redux avec des **propriétés React**,
-   [mapDispatchToProps]{.lang:default .decode:true .crayon-inline}  est
    une fonction permettant de mapper des **actions** Redux avec des
    **propriétés React**.

Ces deux fonctions sont ensuite appliquées à l'aide de la fonction
[connect()]{.lang:default .decode:true .crayon-inline}  fournie par
[react-redux]{.lang:default .decode:true .crayon-inline} .

\[note\]**Note :** Nous devons ici utiliser
[bindActionCreators()]{.lang:default .decode:true .crayon-inline}  sur
nos [CounterActions]{.lang:default .decode:true .crayon-inline}  car il
s'agit d'un objet dont les valeurs sont des actions et cette fonction va
permettre d'ajouter un appel à la fonction [dispatch()]{.lang:default
.decode:true .crayon-inline}  de Redux afin que celles-ci soient
correctement déclenchées.\[/note\]

 

Conclusion
----------

Si nous mettons en parallèle les **1 303 720 téléchargements sur le mois
précédent** **de la librairie Redux** avec les **2 334 221 de
téléchargements pour React**, nous remarquons que Redux est aujourd'hui
**très utilisé** et semble vraiment très **apprécié** par les
développeurs car il s'agit d'une solution **simple** qui permet
réellement de structurer une application front.

Redux apporte, selon moi, une **vraie solution** permettant de
structurer des applications au métier complexe aux communautés comme
React, VueJS mais également aux autres.

{% endraw %}
