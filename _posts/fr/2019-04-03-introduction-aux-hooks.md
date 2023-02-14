---
layout: post
lang: fr
date: '2019-04-03'
categories:
  - javascript
authors:
  - mehdidr
excerpt: 'Une petite introduction à la nouvelle fonctionnalité de React, les hooks !'
title: Introduction aux hooks
slug: introductionauxhooks
oldCategoriesAndTags:
  - javascript
  - react
  - hooks
permalink: /fr/introductionauxhooks/
---

Les **hooks** arrivent avec la release de la version 16.8 de React (sans breaking changes !), et amènent avec eux la solution à de nombreux problèmes causés par certains patterns.

Nous allons comparer ensemble les deux méthodes les plus populaires avant l’arrivée des hooks : les HOC et les renderProps. Il est intéressant de voir quels problèmes peuvent poser ces méthodes, et comment les hooks simplifient le code et résolvent ces problèmes.

## Avant l’utilisation des hooks

Prenons un exemple qui montre la position de la souris.

Voilà à quoi ressemble le code classique :

```jsx
import React, { Component } from 'react';

export default class MouseRender extends Component {
  state = { x: 0, y: 0 };

  componentDidMount() {
      window.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = e => this.setState({ x: e.clientX, y: e.clientY });

  render() {
    const { x, y } = this.state;

    return (
      <span>
        Mouse X : { x }, Mouse Y: { y }
      </span>
    );
  }
};
```

Ce code peut vite poser problème, principalement pour deux raisons :

- Si le mouvement de la souris est nécessaire dans un autre composant, il va falloir dupliquer ce code.
- Si on complexifie le composant en ajoutant d’autres comportements de la souris, cela peut rapidement devenir illisible, notamment à cause du contenu du `componentDidMount` et du `componentWillUnmount`.

Voilà comment on peut régler le problème avec les deux méthodes dont nous avons parlé plus haut :

### HOC (Higher Order Component)

Un HOC est une fonction qui prend un composant en paramètre, et retourne un nouveau composant en lui ajoutant un comportement (voir le [decorator pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript)). Cela permet de séparer la logique et le rendu dans le DOM. Voilà donc à quoi ressemble le même code en utilisant un HOC :

```jsx
import React, { Component } from 'react';

const withMousePosition = ComponentToWrap => {
  return class MousePositionHoc extends Component {
    state = { x: 0, y: 0 };

    componentDidMount() {
        window.addEventListener('mousemove', this.onMouseMove);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onMouseMove);
    }

    onMouseMove = e => this.setState({ x: e.clientX, y: e.clientY });

    render() {
      return (
        <ComponentToWrap { ...this.state } />
      );
    }
  }
};

class MouseRender extends Component {
  render() {
    const { x, y } = this.props;

    return (
      <span>
        Mouse X : { x }, Mouse Y: { y }
      </span>
    )
  }
}

const EnhanceMouseRender = withMousePosition(MouseRender);
export default EnhanceMouseRender;
```

Les HOC posent plusieurs problèmes :

- Ils étirent le code en longueur, car ils nécessitent de créer un composant pour chaque élément dynamique que l’on souhaite intégrer dans le DOM.
- Il n’est pas possible de différencier la donnée qui vient du HOC et la donnée qui est passée au composant.
- Ils peuvent poser des problèmes de conflits, à cause du nommage des props (qui peut vite devenir compliqué en fonction du nombre de HOC).
- Si beaucoup de HOC sont présents, cela peut causer des problèmes de performances.

### renderProps

Une autre solution est d’utiliser les **renderProps**, qui permettent de partager la logique entre plusieurs composants en passant en propriété d’un composant une fonction qui permet de générer un autre composant :

```jsx
import React, { Component } from 'react';

class MousePosition extends Component {
  state = { x: 0, y: 0 };

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = e => this.setState({ x: e.clientX, y: e.clientY });

  render() {
    return (
      this.props.children(this.state)
    );
  }
};

export default class MouseRender extends Component {
  render() {
    return (
      <MousePosition>
        {({ x, y }) => (
          <span>Mouse X : { x }, Mouse Y: { y }</span>
        )}
      </MousePosition>
    )
  }
}
```

Le principal intérêt d'utiliser des renderProps, c'est d'éviter la duplication de code.
Cependant les **renderProps** amènent certains problèmes :

- La lisibilité : utiliser les **renderProps** implique de wrapper les composants, et peut vite devenir un véritable enfer (voir [Pyramid of Doom](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming)))
- Utiliser les `PureComponent` devient compliqué : le shallow comparison retournera toujours faux pour les nouvelles props, et chaque render générera donc une nouvelle valeur pour la prop (voir [la doc](https://reactjs.org/docs/render-props.html#be-careful-when-using-render-props-with-reactpurecomponent)).

La nouvelle fonctionnalité, les **hooks**, pourrait donc être une alternative qui éliminerait les soucis rencontrés par ces différentes méthodes.

## Hooks : mode d'emploi

Les **hooks** sont des fonctions qui permettent d’aller chercher les données dans le state et dans le lifecycle à partir de fonctions. Il ne faut les utiliser qu’au plus haut niveau, et il ne faut donc pas les appeler dans des boucles, des conditions, des classes ou des nested functions. Les hooks sont toujours appelés dans le même ordre.

Pour reprendre l’exemple de la souris, voici à quoi ressemble le code avec l’utilisation des **hooks** :

```jsx
import React, { useState, useEffect } from 'react';

const useMousePosition = () => {
  const [position, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = e => setMousePosition({ x: e.clientX, y: e.clientY });

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  return position;
}

const MouseRender = () => {
  const mouse = useMousePosition();
  return (
    <span>Mouse X : { mouse.x }, Mouse Y: { mouse.y }</span>
  )
}

export default MouseRender;
```

Comme on peut le voir, on utilise 2 hooks dans ce code :

- `useState`, comme son nom l’indique, permet d’utiliser le state : le premier argument étant le state initial (qui n’a pas nécessairement besoin d’être un objet), et le second étant la fonction à appliquer sur cette valeur.
- `useEffect` indique que le composant peut causer des effets de bord comme par exemple fetcher des données ou modifier manuellement le DOM et vient remplacer `componentDidMount`, `componentDidUpdate` et `componentWillUnmount` dans la même API.

Il est aussi possible de créer ses propres hooks : il suffit de créer une fonction Javascript qui commence par « use » et qui appelle d’autres hooks. Dans notre exemple, il s’agit de la fonction `useMousePosition`.

Il existe d’autres hooks, comme `useContext` qui utilise le context API, ou `useReducer` qui permet de manager son state local avec des reducers, à la manière de redux.


## Conclusion

Les hooks ne sont pas indispensables à votre code, mais vous permettront de créer des composants qui n'ont plus besoin de classes, et vous permettront de gagner de nombreuses lignes de code.
Il existe de [nombreux](https://nikgraf.github.io/react-hooks/) hooks qui vous faciliteront la vie. La hype autour des hooks est justifiée par les changements qu'ils vont probablement apporter à l'écosystème React.

Il y a beaucoup à dire sur les hooks, cet article est loin d’être exhaustif ! Pour les anglophones, n’hésitez pas à  [cliquer sur ce lien](https://github.com/rehooks/awesome-react-hooks) qui vous donnera toutes les ressources nécessaires !
