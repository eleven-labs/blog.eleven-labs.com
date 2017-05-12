---
layout: post
title: 'Redux : Structurez vos applications front'
author: vcomposieux
date: '2017-01-17 10:09:00 +0100'
date_gmt: '2017-01-17 09:09:00 +0100'
categories:
- Non classé
- Javascript
tags:
- Javascript
- react
- redux
- vuejs
---

L'écosystème Javascript est très riche, beaucoup de développeurs mais aussi de frameworks et d'outils sont disponibles.

Lorsque vous souhaitez développer une application, quel que soit son framework de rendu, vous allez vite être amené à vouloir architecturer votre projet afin de différencier et d'organiser les données des vues. C'est particulièrement le cas lorsque vous utilisez des frameworks de rendu de composants comme <strong>React</strong> ou <strong>VueJS</strong>.

Historiquement, le besoin s'est fait sentir sur <a href="https://facebook.github.io/react/">React</a> et Facebook a donc ouvert les sources de son outil <a href="http://facebook.github.io/flux/">Flux</a>.

Le principe est le suivant :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png"><img class="size-full wp-image-3188 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png" alt="" width="2232" height="1114" /></a>

Votre application déclare, pour chaque composant, les <span class="lang:default decode:true crayon-inline ">actions</span>  qui lui sont liées. Ces actions permettent de définir l'état de votre composant, stocké dans un <span class="lang:default decode:true crayon-inline ">store</span> , qui permet de maintenir votre <span class="lang:default decode:true crayon-inline ">vue</span>  à jour.

L'inconvénient est que dans ce cas, vous avez un store par composant. Ce modèle fonctionne pour React mais vous pouvez vous sentir limité sur certaines applications.

Dan Abramov a donc lancé, en juin 2015, <a href="http://redux.js.org/">Redux</a>, qui permet principalement de simplifier la gestion du store car il y a en effet qu'un seul store pour toute votre application dans Redux.

<strong>Tous vos composants peuvent donc accéder à vos données.</strong>

Pour plus d'informations sur les différences Redux / Flux, je vous invite à lire cette <a href="http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux/32920459#32920459">réponse de Dan</a>.

&nbsp;

## Installation
Nous allons voir dans cet article comment mettre en place et utiliser Redux sur vos projets.<br />
Notez dès maintenant que la librairie peut être utilisée avec plusieurs librairies de rendu comme React ou VueJS.

Pour installer Redux, il vous faudra installer le package npm (ou yarn) <span class="lang:default decode:true crayon-inline ">redux</span> .<br />
Si vous utilisez Redux sur une application React, il vous faudra également le package <span class="lang:default decode:true crayon-inline ">react-redux</span>  ou encore <span class="lang:default decode:true crayon-inline ">vue-redux</span>  s'il s'agit d'un projet VueJS.

<pre class="lang:default decode:true">
{% raw %}
$ yarn add redux{% endraw %}
</pre>

Rien de plus, vous êtes prêt à utiliser Redux.

&nbsp;

## Utilisation classique
Comme décrit précédemment, il vous faudra initialiser un <span class="lang:default decode:true crayon-inline">store</span>  qui va permettre de stocker l'état de votre application.

Pour instancier ce store, il vous faudra passer un ou plusieurs <span class="lang:default decode:true crayon-inline ">reducers</span> . Les reducers contiennent les méthodes qui effectuent le changement d'état de votre application.<br />
Ces changements d'état sont effectués lorsqu'une <span class="lang:default decode:true crayon-inline ">action</span>  est déclenchée sur votre application.

Voilà, nous avons là les 3 composantes d'une application structurée par Redux : des <strong>actions</strong>, des <strong>reducers</strong> et un <strong>store</strong>.

Nous allons prendre un cas pratique simple : un compteur que l'on peut incrémenter ou décrémenter d'une certaine valeur.

&nbsp;

Voici l'arborescence que nous ciblons :

<pre class="lang:default decode:true">
{% raw %}
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
    └── configureStore.js{% endraw %}
</pre>

&nbsp;

### Actions
Écrivons donc un fichier d'actions qui permet de définir ces deux actions : incrémenter et décrémenter.

Avant tout, nous allons également stocker ces noms d'actions dans des constantes, ce qui nous permettra d'être clair dans notre code car nous ferons toujours appel à ces constantes.

Créez donc un fichier <span class="lang:default decode:true crayon-inline ">src/constants/ActionTypes.js</span>  avec le contenu :

<pre class="lang:js decode:true">
{% raw %}
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';{% endraw %}
</pre>

&nbsp;

Nous allons maintenant écrire les définitions des actions. Créez maintenant le fichier <span class="lang:default decode:true crayon-inline ">src/actions/counter.js</span>  :

<pre class="lang:js decode:true">
{% raw %}
import * as types from '../constants/ActionTypes';

export const increment = (value) =&gt; ({ type: types.INCREMENT, value });
export const decrement = (value) =&gt; ({ type: types.DECREMENT, value });{% endraw %}
</pre>

&nbsp;

Vous venez de déclarer deux actions (<span class="lang:default decode:true crayon-inline ">increment</span>  et <span class="lang:default decode:true crayon-inline ">decrement</span> ) qui prennent chacune un type (obligatoire) et une valeur à ajouter ou soustraire.

&nbsp;

### Reducers
Il nous faut maintenant écrire les méthodes des reducers permettant de mettre à jour l'état de notre application.

Ces reducers seront écrits dans le fichier <span class="lang:default decode:true crayon-inline ">src/reducers/counter.js</span>  :

<pre class="lang:js decode:true ">
{% raw %}
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
}{% endraw %}
</pre>

&nbsp;

&nbsp;

Vous avez compris l'idée, nous avons nos actions dans un <span class="lang:default decode:true crayon-inline ">switch() { case ... }</span>  et mettons directement à jour les valeurs de notre store.<br />
Vous remarquerez que nous avons créés un état initial (initialState) afin d'initialiser les valeurs de notre application.

[note]<strong>Note :</strong> Il vous est possible de créer autant de reducers que nécessaire.[/note]

&nbsp;

Si vous avez déclaré plusieurs reducers dans votre application, vous pouvez les combiner dans un fichier <span class="lang:default decode:true crayon-inline">src/reducers/index.js</span>  comme suit :

&nbsp;

<pre class="lang:js decode:true ">
{% raw %}
import { combineReducers } from 'redux';

import counter from './counter';
import another from './another';

const reducers = combineReducers({
  counter,
  another,
});

export default reducers;{% endraw %}
</pre>

&nbsp;

### Store
Maintenant que nous avons nos actions et reducers, dernière étape indispensable : la création du store !

Créez un fichier <span class="lang:default decode:true crayon-inline ">src/store/configureStore.js</span>  avec le contenu suivant :

<pre class="lang:js decode:true ">
{% raw %}
import { createStore } from 'redux';
import reducers from '../reducers';

const configureStore = () =&gt; {
  return createStore(
    reducers,
  );
};

export default configureStore;{% endraw %}
</pre>

&nbsp;

Nous utilisons ici la fonction <span class="lang:default decode:true crayon-inline ">createStore()</span>  de l'API Redux permettant de créer notre store.

&nbsp;

Afin d'aller un peu plus loin, notez que cette fonction peut prendre jusqu'à 3 arguments :

<ol>
<li>un ou des reducers,</li>
<li>un état pré-chargé (<em>optionnels</em>), correspondant à un état initial,</li>
<li>des "enhancers" (<em>optionnels</em>), autrement dit des callbacks comme des middlewares.</li>
</ol>
Un middleware permet d'exécuter une callback à chaque fois que le <span class="lang:default decode:true crayon-inline ">dispatch()</span>  d'actions est exécuté.

&nbsp;

Voici un exemple de middleware permettant de logger chaque action déclenchée :

<pre class="lang:js decode:true ">
{% raw %}
import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers';

function logger({ getState }) {
  return (next) =&gt; (action) =&gt; {
    console.log('will dispatch', action)
    return next(action)
  }
}

const configureStore = () =&gt; {
  return createStore(
    reducers,
    applyMiddleware(logger)
  );
};

export default configureStore;{% endraw %}
</pre>

&nbsp;

N'oubliez pas d'utiliser la fonction <span class="lang:default decode:true crayon-inline ">applyMiddleware()</span>  lorsque vous passez vos fonctions de middleware au store.

&nbsp;

## Utilisation avec React
Le principe reste exactement le même lorsque Redux est utilisé avec React, cependant, la librairie <span class="lang:default decode:true crayon-inline ">react-redux</span>  va vous apporter des petites choses en plus.

Vous allez en effet pouvoir lier l'état de votre application gérée par Redux ainsi que les actions que vous avez définies avec les <span class="lang:default decode:true crayon-inline ">props</span>  de vos composants React.

Prenons un composant <span class="lang:default decode:true crayon-inline ">Counter</span>  reflétant l'architecture Redux mise en place dans notre cas d'exemple :

<pre class="lang:js decode:true  ">
{% raw %}
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CounterActions from '../actions/counter';

const Counter = ({ children, value, actions }) =&gt; (
  <div>


    <button>Increment</button>
    <button>Decrement</button>
  </div>
);

Counter.propTypes = {
  children: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state =&gt; ({
  value: state.counter.current,
});

const mapDispatchToProps = dispatch =&gt; ({
  actions: bindActionCreators(CounterActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Counter);{% endraw %}
</pre>

&nbsp;

De cette façon, nous récupérons donc les valeurs de nos props provenant de notre store mais également une propriété <span class="lang:default decode:true crayon-inline ">actions</span>  permettant d'appeler nos actions Redux.

Les principaux éléments à noter ici sont :

<ul>
<li><span class="lang:default decode:true crayon-inline ">mapStateToProps</span>  est une fonction permettant de mapper des <strong>valeurs de notre state</strong> Redux avec des <strong>propriétés React</strong>,</li>
<li><span class="lang:default decode:true crayon-inline ">mapDispatchToProps</span>  est une fonction permettant de mapper des <strong>actions</strong> Redux avec des <strong>propriétés React</strong>.</li>
</ul>
Ces deux fonctions sont ensuite appliquées à l'aide de la fonction <span class="lang:default decode:true crayon-inline ">connect()</span>  fournie par <span class="lang:default decode:true crayon-inline">react-redux</span> .

[note]<strong>Note :</strong> Nous devons ici utiliser <span class="lang:default decode:true crayon-inline ">bindActionCreators()</span>  sur nos <span class="lang:default decode:true crayon-inline ">CounterActions</span>  car il s'agit d'un objet dont les valeurs sont des actions et cette fonction va permettre d'ajouter un appel à la fonction <span class="lang:default decode:true crayon-inline ">dispatch()</span>  de Redux afin que celles-ci soient correctement déclenchées.[/note]

&nbsp;

## Conclusion
Si nous mettons en parallèle les <strong>1 303 720 téléchargements sur le mois précédent</strong> <strong>de la librairie Redux</strong> avec les <strong>2 334 221 de téléchargements pour React</strong>, nous remarquons que Redux est aujourd'hui <strong>très utilisé</strong> et semble vraiment très <strong>apprécié</strong> par les développeurs car il s'agit d'une solution <strong>simple</strong> qui permet réellement de structurer une application front.

Redux apporte, selon moi, une <strong>vraie solution</strong> permettant de structurer des applications au métier complexe aux communautés comme React, VueJS mais également aux autres.


