---
lang: fr
date: 2023-10-19
slug: conception-intelligente-composants-polymorphes-react-typescript-librairie-ui
title: "Conception Intelligente : Composants Polymorphes en React et TypeScript pour une Librairie UI"
excerpt: Concevez des composants polymorphes en React et TypeScript pour une librairie UI intelligente. Explorez la polyvalence de ces composants, leurs avantages et comment les utiliser pour concevoir des interfaces utilisateur cohérentes et flexibles.
categories:
    - javascript
keywords:
    - react
    - typescript
    - ui
authors:
    - fpasquet
---

## Qu'est-ce qu'un composant polymorphe ?

En développement d'interfaces utilisateur, un composant polymorphe est un élément qui a la capacité d'adopter le comportement et l'apparence de n'importe quel élément HTML. Cela signifie qu'un même composant peut s'afficher en tant qu'ancre (lien hypertexte) ou en tant que bouton, tout en maintenant une cohérence visuelle. Il est essentiel de noter que, visuellement, ce composant demeure identique, quel que soit le rôle qu'il joue.

### Polyvalence dans l'Adaptation

L'atout principal des composants polymorphes réside dans leur capacité à s'ajuster dynamiquement en fonction du contexte d'utilisation, sans nécessiter de modifications significatives de leur code source. Par exemple, un tel composant peut se comporter comme un bouton "Valider" dans un scénario, puis se transformer en un lien hypertexte "En savoir plus" dans un autre, tout en maintenant une apparence cohérente.

### Optimisation de la Réutilisation

L'un des avantages majeurs des composants polymorphes est leur capacité à réduire la duplication de code. En concevant des composants de cette nature, vous favorisez la réutilisation du code, ce qui permet de simplifier la maintenance, un aspect essentiel pour le développement de librairies UI évolutives.

## Pourquoi les composants polymorphes sont-ils cruciaux pour une librairie UI ?

Les composants polymorphes ne sont pas simplement une tendance passagère, mais une composante essentielle de toute librairie d'interfaces utilisateur (UI) moderne. Comprendre leur rôle stratégique est fondamental pour saisir leur importance.

### Réduction de la Complexité

Les librairies UI se développent constamment, et leur complexité augmente en conséquence. Les composants polymorphes offrent une solution élégante pour gérer cette complexité croissante. Au lieu de multiplier les composants spécifiques, vous pouvez utiliser des composants polymorphes pour couvrir une gamme plus large de cas d'utilisation, réduisant ainsi le nombre de composants à gérer.

### Maintenance Simplifiée

La maintenance des composants est simplifiée, car les variations d'un composant ne nécessitent des modifications que dans un seul composant polymorphe. Ainsi, les erreurs et les efforts de maintenance sont réduits.

### Cohérence Visuelle

Les composants polymorphes maintiennent une apparence uniforme, quel que soit leur rôle. Cela garantit une expérience utilisateur cohérente.

### Évolutivité

Ils sont essentiels pour le développement évolutif d'une librairie UI, car ils permettent d'ajouter de nouvelles fonctionnalités ou de modifier le comportement existant sans affecter la stabilité globale.

## Création de Composants de Base

Maintenant que nous comprenons l'importance des composants polymorphes, passons à la création des composants de base. Cette section vous guidera à travers les étapes essentielles pour concevoir des composants réutilisables et polyvalents.

Pour illustrer cette idée, prenons l'exemple du composant `Box`, qui est couramment utilisé dans de nombreuses librairies UI, telles que [`Material UI`](https://mui.com/material-ui/react-box/) et [`Chakra UI`](https://chakra-ui.com/docs/components/box/usage).

C'est un composant de base polyvalent conçu pour créer des éléments de contenu avec une personnalisation flexible de la couleur de fond et de la couleur de la police. Il offre une approche modulaire pour l'affichage de contenu avec une variété de styles visuels.

Exemple du composant `Box`:

```tsx
import classNames from 'classnames';
import React, { forwardRef } from 'react';
import type { PolyRefFunction } from 'react-polymorphed';

// Nous avons simplement eu besoin de créer une fonction polyRef et d'overrider le type de retour de `forwardRef` avec `PolyRefFunction`.
const polyRef = forwardRef as PolyRefFunction;

type ColorType = 'accent' | 'calm' | 'info' | 'primary' | 'secondary';

export interface BoxProps {
  bg: ColorType;
  className?: string;
  color: ColorType;
  children: React.ReactNode;
}

// Le premier argument, défini par `polyRef`, est le composant HTML par défaut que vous souhaitez afficher.
export const Box = polyRef<'div', BoxProps>(({ as: As = 'div', children, className, color, bg, ...props }, ref) => (
  <As
    className={classNames(
      {
        bg: bg,
        color: color,
      },
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </As>
));
```

Pour créer notre composant Box, nous utilisons la librairie `react-polymorphed` qui simplifie le processus de création de composants polymorphes avec TypeScript. Nous avons créé une fonction `polyRef` pour surcharger le type de retour de `forwardRef` avec `PolyRefFunction`. Cela nous permet d'obtenir une référence à tous les composants que nous créons.

Le premier argument, défini par `polyRef`, permet de spécifier le composant HTML par défaut que vous souhaitez afficher (dans ce cas, `div`). L'autre chose importante à faire est de définir la valeur de as à `div` dans les props, ce qui permet au composant de fonctionner correctement même si aucune valeur n'est fournie pour `as`.

Ainsi, avec ces ajustements et l'utilisation de `polyRef`, nous créons un composant Box qui peut s'adapter à différents contextes d'utilisation de manière fluide et cohérente, tout en étant facilement personnalisable pour répondre à vos besoins spécifiques de conception d'interfaces utilisateur.

Exemples d'utilisation :

```tsx
<Box bg="primary" color="calm">
  Ceci est un `div` avec une couleur de fond `primary` et une couleur de police `calm`.
</Box>
```

> Dans cet exemple, nous utilisons le composant `Box` pour créer un élément HTML `<div>`

```tsx
<Box as="a" bg="primary" color="calm" href="#">
    Ceci est un `a` avec une couleur de fond `primary` et une couleur de police `calm`.
</Box>
```

> Dans ce deuxième exemple, nous utilisons le composant `Box` pour créer un élément HTML `<a>`.
> Cependant, il est important de noter qu'ajouter un attribut `href` ou d'autres attributs spécifiques aux liens est essentiel pour qu'il fonctionne correctement en tant que lien hypertexte.

```tsx
import { Link } from 'react-router-dom';

<Box as={Link} bg="primary" color="calm" to="home">
    Ceci est un `Link` de React Router avec une couleur de fond `primary` et une couleur de police `calm`.
</Box>
```

> Dans ce dernier exemple, nous utilisons le composant `Box` pour créer un composant de lien de navigation en utilisant React Router.
> Cependant, comme précédemment, il est crucial d'ajouter les attributs spécifiques requis par React Router, tels que `to`, pour que le composant fonctionne comme un lien de navigation.

Ces deux exemples illustrent comment le composant `Box` peut être utilisé pour personnaliser des éléments HTML de base, que ce soit des conteneurs `<div>` ou des éléments en ligne `<span>`. La polyvalence de Box est un atout majeur pour créer des librairies UI flexibles et cohérentes.

<div  class="admonition tip" markdown="1"><p class="admonition-title">Notes</p>
Un avantage significatif lors de l'utilisation de composants polymorphes réside dans la capacité de TypeScript à détecter les erreurs lorsque les propriétés spécifiques à un type d'élément HTML ou à un composant ne sont pas correctement définies. Cette fonctionnalité de détection d'erreurs constitue une amélioration notable par rapport à JavaScript, où de telles erreurs pourraient passer inaperçues, potentiellement entraînant des problèmes de rendu et de fonctionnement.
</div>

## Conclusion

La polyvalence des composants polymorphes repose sur votre capacité à anticiper les besoins variés de votre librairie UI et à concevoir des composants capables de s'adapter à une multitude de cas d'utilisation.

L'avenir de la conception de librairies UI est prometteur, avec des composants polymorphes qui deviennent de plus en plus essentiels pour répondre aux besoins d'interfaces utilisateur flexibles et dynamiques. En investissant du temps et des ressources dans la création de composants polymorphes bien conçus, vous pouvez contribuer à l'évolution positive de la conception d'interfaces utilisateur et à la satisfaction de vos utilisateurs.

Si vous souhaitez voir quelques exemples plus concrets de composants polymorphes ([Box](https://github.com/fpasquet/my-design-system/blob/master/src/components/Atoms/Layout/Box/Box.tsx), [Link](https://github.com/fpasquet/my-design-system/blob/master/src/components/Atoms/Link/Link.tsx), [Heading](https://github.com/fpasquet/my-design-system/blob/master/src/components/Atoms/Typography/Heading/Heading.tsx) ...), vous pouvez vous rendre sur ce [dépot GitHub](https://github.com/fpasquet/my-design-system).

## Sources

- [react-polymorphed](https://www.npmjs.com/package/react-polymorphed)
- [Build strongly typed polymorphic components with React and TypeScript](https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/)
