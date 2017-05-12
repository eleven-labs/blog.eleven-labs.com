---
layout: post
title: 'Redux: Structure your frontend applications'
author: vcomposieux
date: '2017-01-20 12:12:34 +0100'
date_gmt: '2017-01-20 11:12:34 +0100'
categories:
- Non classé
tags:
- Facebook
- Javascript
- react
- redux
---
{% raw %}
Javascript ecosystem is really rich: full of developers but also full of frameworks and libraries.

When you want to develop a frontend application, whatever its rendering framework, you will have to structure things into your project in order to organize the data management with views. This case occurs particularly when you use component rendering frameworks like <strong>React</strong> or <strong>VueJS</strong>.

Historically, this has been needed by <a href="https://facebook.github.io/react/">React</a> so that's why Facebook has open sourced its tool named <a href="http://facebook.github.io/flux/">Flux</a>.

Here is the philosophy:

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png"><img class="size-full wp-image-3188 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png" alt="" width="2232" height="1114" /></a>

Your application declare <span class="lang:default decode:true crayon-inline">actions</span>  for each components. These actions allow you to define the state of your data which is stored in a <span class="lang:default decode:true crayon-inline">store</span> . This stores continually maintains your <span class="lang:default decode:true crayon-inline">view</span>  up-to-date.

We have a drawback in this case because you have to define one store per component. This is working but on large applications you can feel limited with it.

In June 2015, Dan Abramov has launched <a href="http://redux.js.org/">Redux</a> which simplify store management because you only have one store for all your application.

<strong>All of your application components can access to the whole state.</strong>

For more information about Redux/Flux differences I encourage you to have a look at <a href="http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux/32920459#32920459">Dan's answer</a> on this subject.

&nbsp;

## Installation
This article will deal about how to install and use Redux on your own projects.<br />
Please keep in mind that Redux can be used with multiple rendering frameworks like React or VueJS.

To install Redux, you will just need the <span class="lang:default decode:true crayon-inline">redux</span> npm (or yarn) package.<br />
If you use Redux into a React application, you will also need the <span class="lang:default decode:true crayon-inline">react-redux</span>  package or even the <span class="lang:default decode:true crayon-inline">vue-redux</span>  if you want to use it on a VueJS project.

<pre class="lang:default decode:true">$ yarn add redux</pre>
Nothing more, you can now start to use Redux.

&nbsp;

## Basic usage
As previously described, you will have to instanciate a new <span class="lang:default decode:true crayon-inline">store</span>  that will allow to store the state of all your application.

In order to instanciate this store, you will have to give to it some <span class="lang:default decode:true crayon-inline">reducers</span> . Reducers contain methods that change the state of your application.<br />
These state changes occur when an <span class="lang:default decode:true crayon-inline">action</span>  is dispatched by your application.

Here we are, we have the 3 things needed by a Redux application: <strong>actions</strong>, <strong>reducers</strong> and a <strong>store</strong>.

We will use a simple practical case: a counter that we can increment or decrement with a given value.

Here is our target arborescence:

<pre class="lang:default decode:true">src/
├── actions
│   └── counter.js
├── constants
│   └── ActionTypes.js
├── reducers
│   ├── another.js
│   ├── counter.js
│   └── index.js
└── store
    └── configureStore.js</pre>
### Actions
Let's write an actions containing file that will implement our 2 actions: increment and decrement.

Before all, we will store these actions names into constants in order to keep our code clear and comprehensible as we will always call these constants in all of our code.

Start by creating a <span class="lang:default decode:true crayon-inline">src/constants/ActionTypes.js</span>  file with the following content:

<pre class="lang:js decode:true">export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';</pre>
Great, we will now write actions that correspond to these constants in a <span class="lang:default decode:true crayon-inline">src/actions/counter.js</span>  file:

<pre class="lang:js decode:true">import * as types from '../constants/ActionTypes';

export const increment = (value) =&gt; ({ type: types.INCREMENT, value });
export const decrement = (value) =&gt; ({ type: types.DECREMENT, value });</pre>
You have just created your 2 actions (<span class="lang:default decode:true crayon-inline">increment</span>  and <span class="lang:default decode:true crayon-inline">decrement</span>) which each have a type property (required) and a value to add or remove to the current counter value.

### Reducers
We will now write reducers functions that correspond to the actions we previously wrote in order to update the value in our application state.

This will be written in the <span class="lang:default decode:true crayon-inline ">src/reducers/counter.js</span>  file:

<pre class="lang:js decode:true">import { INCREMENT, DECREMENT } from '../constants/ActionTypes';

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
}</pre>
You got the idea, we have our actions wrapped into a <span class="lang:default decode:true crayon-inline">switch() { case ... }</span>  and directly return the store updated with new values.<br />
You can also observe that we have initialized an initial state (initialState) in order to prepare our application state with some default values.

[note]<strong>Note:</strong> You can write as many reducers as you need in your application so you can clearly split your code application.[/note]

Only point if you declare multiple reducers into your application is that you will have to combine them here in a file named <span class="lang:default decode:true crayon-inline">src/reducers/index.js</span>  as follows:

<pre class="lang:js decode:true">import { combineReducers } from 'redux';

import counter from './counter';
import another from './another';

const reducers = combineReducers({
  counter,
  another,
});

export default reducers;</pre>
### Store
You have your actions and your reducers so let's dive into the final step: store creation!

Store will be created in a <span class="lang:default decode:true crayon-inline">src/store/configureStore.js</span>  file with only these couple of lines:

<pre class="lang:js decode:true">import { createStore } from 'redux';
import reducers from '../reducers';

const configureStore = () =&gt; {
  return createStore(
    reducers,
  );
};

export default configureStore;</pre>
You just have to call the Redux's <span class="lang:default decode:true crayon-inline">createStore()</span>  API function in order to create your store.

In order to go further, please note that this function can take a maximum of 3 arguments:

<ol>
<li>one or many combines reducers,</li>
<li>a pre-loaded state (<em>optional),</em> corresponding to an initial state,</li>
<li>some "enhancers" (<em>optionals</em>), which are some callbacks such as middlewares.</li>
</ol>
A middleware is a callback that is executed each time Redux can the <span class="lang:default decode:true crayon-inline">dispatch()</span>  function so each time an action is triggered.

Here is a simple middleware that logs each dispatched actions:

<pre class="lang:js decode:true ">import { createStore, applyMiddleware } from 'redux'
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

export default configureStore;</pre>
Do not forget to call the <span class="lang:default decode:true crayon-inline">applyMiddleware()</span>  function when you pass your function to the store argument.

&nbsp;

## React use case
Principles are exactly the same when you want to use Redux on a React application. However, the <span class="lang:default decode:true crayon-inline">react-redux</span>  library brings some cool additional features to fit with React.

Indeed, thanks to this library, you will be able to map your React components <span class="lang:default decode:true crayon-inline">props</span>  with the Redux state and actions.

Let's take a concrete case: a <span class="lang:default decode:true crayon-inline">Counter</span>  component which could be a component for our previous use case:

<pre class="lang:js decode:true ">import React, { PropTypes } from 'react';
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
)(Counter);</pre>
This way, we are able to retrieve our props values which came from the Redux store but also an <span class="lang:default decode:true crayon-inline">actions</span>  property that will allow us to dispatch Redux events when we will call it.

Main things to note here are:

<ul>
<li><span class="lang:default decode:true crayon-inline">mapStateToProps</span>  is a function that allows to map our Redux **state properties** with <strong>React properties</strong>,</li>
<li><span class="lang:default decode:true crayon-inline">mapDispatchToProps</span>  is a function that allows to map Redux <strong>actions</strong> with <strong>React properties</strong>.</li>
</ul>
These two functions are applied thanks to the <span class="lang:default decode:true crayon-inline">connect()</span>  function brought by the <span class="lang:default decode:true crayon-inline">react-redux</span> library.

[note]<strong>Note:</strong> We have to use the <span class="lang:default decode:true crayon-inline">bindActionCreators()</span>  function over our <span class="lang:default decode:true crayon-inline">CounterActions</span>  because this is an object that contains actions functions so this function will allows React to call the <span class="lang:default decode:true crayon-inline">dispatch()</span>  Redux function when React will call the functions in order to have them correctly triggered.[/note]

&nbsp;

## Conclusion
If we put in parallel the download numbers of Redux (<strong>1 303 720 download over the previous month)</strong> with the <strong>2 334 221 downloads of React</strong>, we can conclude that Redux is today <strong>very used</strong> and seems very much <strong>appreciated</strong> by developers because it's a <strong>simple</strong> solution that can greatly help you to structure your application.

Redux brings, in my opinion, a <strong>real solution</strong> to structure complex (or large) business applications and bring that to the React and VueJS (and others) communities.

{% endraw %}
