---
layout: post
title: 'Redux: Structure your frontend applications'
permalink: /en/redux-structure-frontend-applications/
author: vcomposieux
date: '2017-01-20 12:12:34 +0100'
date_gmt: '2017-01-20 11:12:34 +0100'
categories:
    - Javascript
tags:
    - Facebook
    - Javascript
    - react
    - redux
---
Javascript ecosystem is really rich: full of developers but also full of frameworks and libraries.

When you want to develop a frontend application, whatever its rendering framework, you will have to structure things into your project in order to organize the data management with views. This case occurs particularly when you use component rendering frameworks like `React` or `VueJS`.
Historically, this has been needed by [React](https://facebook.github.io/react/) so that's why Facebook has open sourced its tool named [Flux](http://facebook.github.io/flux/).

Here is the philosophy:

<img class="size-full wp-image-3188 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/flux-diagram.png" alt="" />

Your application declare `actions`  for each components. These actions allow you to define the state of your data which is stored in a `store` . This stores continually maintains your `view`  up-to-date.
We have a drawback in this case because you have to define one store per component. This is working but on large applications you can feel limited with it.
In June 2015, Dan Abramov has launched [Redux](http://redux.js.org/) which simplify store management because you only have one store for all your application.

All of your application components can access to the whole state.

For more information about Redux/Flux differences I encourage you to have a look at [Dan's answer](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux/32920459#32920459) on this subject.

# Installation

This article will deal about how to install and use Redux on your own projects.
Please keep in mind that Redux can be used with multiple rendering frameworks like React or VueJS.
To install Redux, you will just need the `redux` npm (or yarn) package.

If you use Redux into a React application, you will also need the `react-redux`  package or even the `vue-redux`  if you want to use it on a VueJS project.

```bash
$ yarn add redux
```

Nothing more, you can now start to use Redux.

# Basic usage

As previously described, you will have to instanciate a new `store`  that will allow to store the state of all your application.
In order to instanciate this store, you will have to give to it some `reducers` . Reducers contain methods that change the state of your application.
These state changes occur when an `action`  is dispatched by your application.

Here we are, we have the 3 things needed by a Redux application: `actions`, `reducers` and a `store`.
We will use a simple practical case: a counter that we can increment or decrement with a given value.

Here is our target arborescence:

```
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

## Actions

Let's write an actions containing file that will implement our 2 actions: increment and decrement.
Before all, we will store these actions names into constants in order to keep our code clear and comprehensible as we will always call these constants in all of our code.

Start by creating a `src/constants/ActionTypes.js`  file with the following content:

```js
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
```

Great, we will now write actions that correspond to these constants in a `src/actions/counter.js` file:

```js
import * as types from '../constants/ActionTypes';

export const increment = (value) => ({ type: types.INCREMENT, value });
export const decrement = (value) => ({ type: types.DECREMENT, value });
```

You have just created your 2 actions (`increment`  and `decrement`) which each have a type property (required) and a value to add or remove to the current counter value.

## Reducers

We will now write reducers functions that correspond to the actions we previously wrote in order to update the value in our application state.

This will be written in the `src/reducers/counter.js` file:

```js
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

You got the idea, we have our actions wrapped into a `switch() { case ... }`  and directly return the store updated with new values.
You can also observe that we have initialized an initial state (initialState) in order to prepare our application state with some default values.

`Note:` You can write as many reducers as you need in your application so you can clearly split your code application.

Only point if you declare multiple reducers into your application is that you will have to combine them here in a file named `src/reducers/index.js`  as follows:

```js
import { combineReducers } from 'redux';

import counter from './counter';
import another from './another';

const reducers = combineReducers({
  counter,
  another,
});

export default reducers;
```

## Store

You have your actions and your reducers so let's dive into the final step: store creation!
Store will be created in a `src/store/configureStore.js`  file with only these couple of lines:

```js
import { createStore } from 'redux';
import reducers from '../reducers';

const configureStore = () => {
  return createStore(
    reducers,
  );
};

export default configureStore;
```

You just have to call the Redux's `createStore()`  API function in order to create your store.
In order to go further, please note that this function can take a maximum of 3 arguments:

* one or many combines reducers,
* a pre-loaded state (*optional*), corresponding to an initial state,
* some "enhancers" (*optionals*), which are some callbacks such as middlewares.

A middleware is a callback that is executed each time Redux can the `dispatch()`  function so each time an action is triggered.

Here is a simple middleware that logs each dispatched actions:

```js
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

Do not forget to call the `applyMiddleware()` function when you pass your function to the store argument.

# React use case

Principles are exactly the same when you want to use Redux on a React application. However, the `react-redux`  library brings some cool additional features to fit with React.
Indeed, thanks to this library, you will be able to map your React components `props`  with the Redux state and actions.

Let's take a concrete case: a `Counter`  component which could be a component for our previous use case:

```js
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CounterActions from '../actions/counter';

const Counter = ({ children, value, actions }) => (
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

This way, we are able to retrieve our props values which came from the Redux store but also an `actions` property that will allow us to dispatch Redux events when we will call it.

Main things to note here are:

* `mapStateToProps`  is a function that allows to map our Redux **state properties** with `React properties`,
* `mapDispatchToProps`  is a function that allows to map Redux `actions` with `React properties`.

These two functions are applied thanks to the `connect()`  function brought by the `react-redux` library.

`Note:` We have to use the `bindActionCreators()`  function over our `CounterActions`  because this is an object that contains actions functions so this function will allows React to call the `dispatch()`  Redux function when React will call the functions in order to have them correctly triggered.

# Conclusion

If we put in parallel the download numbers of Redux (`1 303 720 download over the previous month)` with the `2 334 221 downloads of React`, we can conclude that Redux is today `very used` and seems very much `appreciated` by developers because it's a `simple` solution that can greatly help you to structure your application.
Redux brings, in my opinion, a `real solution` to structure complex (or large) business applications and bring that to the React and VueJS (and others) communities.
