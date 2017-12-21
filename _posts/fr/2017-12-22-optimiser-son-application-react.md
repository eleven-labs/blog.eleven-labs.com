---
layout: post
title: Optimiser son application React
excerpt: "React est, à l'heure où j'écris ces lignes, le framework JavaScript le plus utilisé du marché. Grâce à son DOM virtuel, il a montré qu'il était l'un des plus performant. Mais à cause d'exemples peut-être trop simple et d'une croyance aveugle en la toute puissance de React, il peut en résulter de sérieux problèmes de performance."
lang: fr
authors:
    - mlenglet
permalink: /fr/optimiser-son-application-react/
categories:
    - javascript
    - react
    - performance
tags:
    - javascript
    - react
    - performance
    - optimisation
cover: /assets/2017-12-22-optimiser-son-application-react/cover.jpg
---

[React](https://reactjs.org/){:rel="nofollow"} est, à l'heure où j'écris ces lignes, le framework JavaScript le plus utilisé du marché. Grâce à son DOM virtuel, il a montré qu'il était l'un des plus performant. Mais à cause d'exemples peut-être trop simple et d'une croyance aveugle en la "toute puissance" de React (Amen), il peut en résulter de sérieux problèmes de performance.

## Le problème

Prenons l'exemple d'une application assez simple et commune. On réalise un back-office permettant de gérer les différents articles sur un blog. Cela consiste donc, dans un premier temps, à simplement afficher un tableau de donnée.

Vous vous exécutez donc et pensant avoir fini vous constatez ceci :

![Exemple d'application lente]({{site.baseurl}}/assets/2017-12-22-optimiser-son-application-react/slow-app.gif)

> MéKéCéCéCeBordel ?!

Votre application est lente et peu réactive (un comble pour du React...).
Allons faire un petit tour dans la console de Chrome à l'onglet Timeline. Ici on va pouvoir capturer tout ce qui se passe au niveau code, mémoire et rendu pendant un laps de temps donné.
Après quelques bidouilles, voici ce qu'on obtient :

![Flamegraph de l'application]({{site.baseurl}}/assets/2017-12-22-optimiser-son-application-react/slow-app-flamegraph.png)

Alors au premier abord, ça peut être un peu repoussant mais c'est en fait très simple. Sur ce "FlameGraph", on peut voir que lorsque l'utilisateur a cliqué, ce n'est pas seulement les lignes de notre tableau qui se redessinées et toute l'application ! En bref, à chaque changement de `state` dans votre application, vous complètement réinitialiser cette dernière de zéro comme si vous étiez au tout premier rendu de la page.

> Mais React est pas censé faire un différentiel intelligent avec son DOM virtuel avant de modifier réellement le DOM ?

Alors si, mais React n'est pas si intelligent que ça... Il faut lui donner un peu la main.

## Les solutions

En effet, React n'est pas magique. Il faut lui indiquer vous-même quand effectuer un rendu et comment.

### Découper ses composants

Une première étape pour l'optimisation sera de découper intelligent ses composants. Vous savez sûrement que React fonctionne sur le principe d'avoir le plus possible de composants réutilisable de taille assez réduite voire atomique.
Prenant l'exemple du code ci-dessous :

```jsx
// in Datagrid.js
render() {
  const {resource, childre, ids, data, currentSort} = this.props;
  return (
    <table>
      <thead>
        <tr>
          {React.Children.map(children, (field, index) => (
            <DatagridHeaderCell
              key={index}
              field={field}
              currentSort={currentSort}
              updateSort={this.updateSort}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {React.Children.map(children, (field, index) => (
          <DatagridCell
            record={data[id]}
            key={`${id}-${index}`}
            field={field}
            resource={resource}
          />
        ))}
      </tbody>
    </table>
  );
}
```

Cela semble être une implémentation très simple d'un tableau de données, mais elle est particulièrement inefficace.
Chaque appel `<DatagridCell>` affiche au moins deux ou trois composants. Comme vous pouvez le voir dans le screencast de l'interface initiale, la liste a 7 colonnes, 11 lignes, ce qui signifie 7x11x3 = 231 composants référencés. Quand seul le `currentSort` change, c'est une perte de temps. Même si React ne met pas à jour le DOM réel si le DOM virtuel est inchangé, il faut environ 500 ms pour traiter tous les composants.

Afin d'éviter un rendu inutile du body de la table, il faut d'abord l'extraire:

```jsx
// in Datagrid.js
render() {
  const {resource, childre, ids, data, currentSort} = this.props;
  return (
    <table>
      <thead>
        <tr>
          {React.Children.map(children, (field, index) => (
            <DatagridHeaderCell
              key={index}
              field={field}
              currentSort={currentSort}
              updateSort={this.updateSort}
            />
          ))}
        </tr>
      </thead>
      <DatagridBody resource={resource} ids={ids} data={data}>
        {children}
      </DatagridBody>
    </table>
  );
}
```

```jsx
// in DatagridBody.js
import React from 'react';

const DatagridBody = ({ resource, ids, data, children }) => (
    <tbody>
      {ids.map(id => (
        <tr key={id}>
          {React.Children.map(children, (field, index) => (
            <DatagridCell
              record={data[id]}
              key={`${id}-${index}`}
              field={field}
              resource={resource}
            />
          ))}
        </tr>
      ))}
    </tbody>
);

export default DatagridBody;
```

L'extraction du body de la table n'a aucun effet sur les performances, mais elle facilitera l'optimisation. Les gros composants à usage général sont difficiles à optimiser. Les petits composants à une seule responsabilité sont beaucoup plus faciles à gérer.

### shouldComponentUpdate

La documentation React est très claire sur la façon d'éviter les répétitions inutiles: `shouldComponentUpdate()`. Par défaut, React restitue toujours un composant au DOM virtuel. En d'autres termes, c'est votre travail en tant que développeur de vérifier que les `props` ou le `state` d'un composant n'ont pas changé et d'ignorer complètement le rendu dans ce cas.

Dans le cas du composant `<DatagridBody>` ci-dessus, il ne devrait pas y avoir de rendu supplémentaire du BO sauf si les `props` ont changé.

Donc le composant devrait être complété comme suit:

```jsx
// in DatagridBody.js
import React, {Component} from 'react';

class DatagridBody extends Component {
  shouldComponentUpdate(nextProps) {
      return (nextProps.ids !== this.props.ids || nextProps.data !== this.props.data);
  }

  render() {
    const { resource, ids, data, children } = this.props;
    return (
        <tbody>
          {ids.map(id => (
            <tr key={id}>
              {React.Children.map(children, (field, index) => (
                <DatagridCell
                  record={data[id]}
                  key={`${id}-${index}`}
                  field={field}
                  resource={resource}
                />
              ))}
            </tr>
          ))}
        </tbody>
    );
  }
}

export default DatagridBody;
```

Avec cette optimisation, la re-rendu du composant `<Datagrid>` après avoir cliqué sur un des headers de la table ignore entièrement le body et ses 231 composants. Cela réduit le temps de mise à jour de 500ms à 60ms. C'est une amélioration nette des performances de plus de 400ms!

### PureComponent

Au lieu d'implémenter manuellement `shouldComponentUpdate()`, une solution est d'hériter de `PureComponent` au lieu de `Component`. Quand la méthode `shouldComponentUpdate` par défaut de `Component` retourne systématiquement `true`, celle de `PureComponent` effectue une comparaison des `props` en utilisant une égalité stricte (`===`) :

```jsx
// in DatagridBody.js
import React, {PureComponent} from 'react';

class DatagridBody extends PureComponent {
  render() {
    const { resource, ids, data, children } = this.props;
    return (
        <tbody>
          {ids.map(id => (
            <tr key={id}>
              {React.Children.map(children, (field, index) => (
                <DatagridCell
                  record={data[id]}
                  key={`${id}-${index}`}
                  field={field}
                  resource={resource}
                />
              ))}
            </tr>
          ))}
        </tbody>
    );
  }
}

export default DatagridBody;
```

Cela a l'avantage de faire gagner du temps mais il faut attention à son implémentation :
- Son utilisation n'est pas toujours justifiée, dans le cas de l'exemple ci-dessus (un tri de table), `resource` et `children` ne seraient pas concernés. Effectuer un test sur ces `props` serait donc inutile et une implémentation manuelle de `shouldComponentUpdate` plus appropriée.
- Du fait de l'égalité stricte (`===`), vous ne pourrez pas utiliser efficacement `PureComponent` si vos `props` sont des objets ou des tableaux. La comparaison se faisant en adresse pour ces structures, il faudrait tester via une implémentation manuelle de `shouldComponentUpdate`. Une solution alternative et beaucoup plus intelligente est de plus utiliser d'objet et tableau JavaScript et d'utiliser à la place des structures [Immutable.js](https://facebook.github.io/immutable-js/){:rel='nofollow'}.

### Se servir du workflow

Une bonne façon d'optimiser son code est d'éviter tout calcul lourd ou inutile dans la méthode `render`. La solution est d'utiliser le workflow de React pour parvenir à nos fins. Dans l'exemple ci-dessous, on a une liste d'utilisateur qui peuvent éventuellement être filtré via un champ de recherche.

On ne veut rendre que si la liste des utilisateurs après filtrage a changé et pas constamment :
- Si un utilisateur n'est plus dans la liste complète mais qu'il faisait déjà partie des utilisateurs filtrés, on ne veut pas rendre.
- Si bien que la valeur dans le champ de recherche est différente, le résultat est le même, on ne veut pas rendre.

On va donc implémenter la méthode `componentWillReceiveProps` pour y vérifier si les `props` `users` et `search` ont changé et, le cas échéant, recalculer la nouvelle liste d'utilisateur filtrée que nous stockerons dans le `state`.

La méthode `shouldComponentUpdate` nous assurera que nous ne re-rendons le composant que si cette liste filtrée a effectivement changé.

```jsx
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';

function getFilteredUsers(users, search) {
  // retourne une nouvelle liste immutable d'utilisateurs filtrés
};

class UsersPage extends Component {
  static propTypes = {
    search: PropTypes.string,
    users: PropTypes.instanceOf(List).isRequired,
  };

  static defaultProps = {
    search: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      filteredUsers: getFilteredUsers(props.users, props.search),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users !== this.props.users || nextProps.search !== this.props.search) {
      const filteredUsers = getFilteredUsers(nextProps.users, this.props.search);
      this.setState({ filteredUsers });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.filteredUsers !== this.state.filteredUsers;
  }

  render() {
    return (
      <TableBody>
        {this.state.filteredUsers.map((user) => <UserRow key={user.get('id')} user={user} />)}
      </TableBody>
    )
  }
}

export default UsersPage;
```

### Attention aux objets en JSX

Une fois que vos composants deviennent plus "purs", vous commencez à détecter les mauvais modèles qui mènent à des répétitions inutiles. Le plus commun est la déclaration directe d'objets dans JSX (le fameux `{% raw %}{{{% endraw %}`). Petit exemple :

```jsx
import React from 'react';
import MyTableComponent from './MyTableComponent';

const Datagrid = (props) => (
    <MyTableComponent style={% raw %}{{ marginTop: 10 }}{% endraw %}>
        ...
    </MyTableComponent>
)
```

Le style du composant `<MyTableComponent>` reçoit une nouvelle valeur chaque fois que le composant `<Datagrid>` est rendu. Donc, même si `<MyTableComponent>` est pur, il sera rendu à chaque fois que `<Datagrid>` est rendu. En fait, chaque fois que vous transmettez un objet littéral en tant que `prop` à un composant enfant, vous cassez la pureté. La solution est simple :

```jsx
import React from 'react';
import MyTableComponent from './MyTableComponent';

const tableStyle = { marginTop: 10 };
const Datagrid = (props) => (
    <MyTableComponent style={tableStyle}>
        ...
    </MyTableComponent>
)
```

En créant l'objet aux préalable, vous vous assurez que ce dernier ne soit pas considéré comme changé par le composant `<MyTableComponent>`.

### Le piège des "stateless functions"

Une petite parenthèse sur les "stateless functions". Comme vous l'avez sûrement remarqué précédemment, nous avons systématiquement déclaré des classes pour gérer l'optimisation de nos composants car il n'y a pas moyen d'implémenter la méthode `shouldComponentUpdate` sur une simple fonction.

> J'imagine qu'il doit y avoir une optimisation spécifique pour les "stateless functions", non ?

Eh bien... non. C'est prévu mais à l'heure où j'écris ces lignes, rien n'a été fait. Une "stateless function" est transpilé en une classe à la compilation...

![Commentaire sur github confirmant le problème des stateless functions]({{site.baseurl}}/assets/2017-12-22-optimiser-son-application-react/stateless-function-github.png)

Ainsi il est plutôt conseillé d'utiliser des `Component` ou `PureComponent`, car vous pouvez y maitriser le workflow.
Vous pouvez jeter un coup d'oeil à cet article pour de plus amples informations : ["7 reasons to outlaw React's functional components"](https://medium.freecodecamp.org/7-reasons-to-outlaw-reacts-functional-components-ff5b5ae09b7c){:rel="nofollow"}

Ainsi si vous vouliez réaliser un composant "statique" qui rend systématiquement la même chose, vous devrez transformer cette fonction :

```jsx
function ResetButton(props) {
  return (
    <IconButton>
      <NavigationClose />
    </IconButton>
  );
}
```

En cette classe :

```jsx
class ResetButton extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <IconButton>
        <NavigationClose />
      </IconButton>
    );
  }
}
```

## Détecter les besoins

Si vous avez une application React de taille importante dans laquelle aucune de ces optimisation n'a été faîte, le refactoring peut-être long est fastidieux. Il serait intéressant de cibler en priorité les points les plus critiques de votre appli où vous pourriez focaliser dans un premier temps votre attention.

### Extension React pour Chrome et Firefox

React-Developer-Tools, disponible pour [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi){:rel="nofollow"} et [Firefox](https://addons.mozilla.org/fr/firefox/addon/react-devtools/){:rel="nofollow"} permet de débugger efficacement une application React. Elle permet d'afficher notamment dynamiquement les éléments de la page qui sont redessinées au fur et à mesure de vos interactions.

### ReactOpt

[ReactOpt](https://github.com/reactopt/reactopt){:rel="nofollow"} est un outil d'audit puissant qui affichera un compte rendu détaillé des performances de votre application.

## Conclusion

L'ensemble des techniques présentés dans cette article sont indispensables à la réalisation d'une application React rapide et réactive.
[Redux](https://redux.js.org/){:rel="nofollow"} ou encore [reselect](https://github.com/reactjs/reselect){:rel="nofollow"} sont aussi des pistes que vous pouvez explorer afin d'améliorer encore cette optimisation. Mais n'oubliez pas que nous n'avons optimisé que la partie "update" de votre application, c'est-à-dire uniquement lorsque application est déjà chargée. Le premier chargement est tout aussi important si ce n'est plus et la solution à ce problème est le SSR (Server Side Rendering). Je vous redirige donc vers l'excellent article de [Vincent](/authors/vcomposieux/) sur ce sujet : ["Migrer une application React Client-Side en Server-Side avec NextJS"](/fr/migrer-une-application-react-client-side-en-server-side-avec-nextjs/).
