---
contentType: article
lang: fr
date: 2023-11-28
slug: design-system-react
title: "Construire un Design System robuste avec react : les fondations essentielles"
excerpt: "Découvrez comment créer un Design System solide avec React. Ce guide simplifié explore les bases essentielles pour concevoir une interface cohérente, améliorer le développement et offrir une expérience utilisateur harmonieuse."
categories:
    - javascript
keywords:
    - design system
    - storybook
    - react
    - frontend
    - atomic design
    - system props
    - bem
    - design token
authors:
    - kdung
    - iregaibi
---

Lors de la conception de vos interfaces, il est probable que vous ayez déjà eu recours à des bibliothèques de composants.
Cependant, il peut arriver que celles-ci ne répondent pas de manière optimale à des cas particuliers ou à des exigences spécifiques de votre application, notamment dans des contextes métiers spécifiques.
Vous décidez alors de mettre en place un écosystème qui rassemble vos propres composants, typographies, couleurs, documentation et des directives d'utilisation : le Design System.
Dans cet article, nous allons vous expliquer comment construire un Design System robuste avec React.


## Contexte

Avant de plonger dans la mise en place d'un Design System robuste avec React, il est essentiel de comprendre les fondamentaux de ce domaine. Nous n'allons revenir que brièvement dessus, car nos derniers articles parus traitent justement de ces fondamentaux.

### Design System

Un [Design System](https://blog.eleven-labs.com/fr/pourquoi-creer-design-system/) réunit un ensemble d'éléments graphiques, des typographies, des palettes de couleurs, de la documentation et des directives d'utilisation.
C'est un référenciel qui garantit une cohérence visuelle et fonctionnelle qui apporte un cadre et des règles à respecter.

### Atomic Design

L'[Atomic Design](https://blog.eleven-labs.com/fr/atomic-design/) est une approche de conception de systèmes d'interface utilisateur et de design d'interaction. Cette approche consiste à découper les composants en éléments modulaires : Atome, Molecule, Organisme, Templates, et Pages.

### Design token

Les [Design Token](https://blog.eleven-labs.com/fr/un-pont-entre-les-mondes-comment-les-design-tokens-facilitent-la-cooperation-entre-developpeurs-et-designers/) sont un ensemble de valeurs ou de variables utilisés pour référencer plusieurs types d'éléments tels que les couleurs, typographies, espacements et bien d'autres.
Ces tokens permettent entre autres, de faciliter la mise à jour des styles et de maîtriser les déclinaisons de thèmes qui partagent des références communes.

### BEM

La méthodologie [BEM](https://blog.eleven-labs.com/fr/retour-d-experience-sur-bem/) donne au CSS une convention de structuration, de nommage et d’organisation pour vos composants.
BEM envisage la composition d’une page web en plusieurs **B**locks, qui contiennent des **E**lements, et ces derniers peuvent varier grâce à des **M**odifiers.

### System Props

Les [System Props](https://blog.eleven-labs.com/fr/system-props/) sont une liste de propriétés permettant de personnaliser instantanément le style de vos composants.
Ces ***System Props*** sont des raccourcis pratiques pour ajouter des styles complémentaires qui permettent de modifier le comportement et l'apparence de vos composants.

## Implémentation

En suivant les fondamentaux tout juste cités, nous allons créer un Design System en React avec du SCSS qui nous permettra de bien utiliser la méthodologie BEM.

Commençons par déclarer nos Design tokens :
```json
// Design token - spacing.tokens.json
{
  "spacing": {
    "0": {
      "value": "0"
    },
    "xxs": {
      "value": "8px"
    },
    "xs": {
      "value": "12px"
    },
    "s": {
      "value": "16px"
    },
    "m": {
      "value": "24px"
    },
    "l": {
      "value": "32px"
    },
    "xl": {
      "value": "42px"
    }
  }
}
```

```json
// Design token - color.tokens.json
{
  "color": {
    "primary": {
      "azure": {
        "value": "#3767B6"
      }
    },
    "secondary": {
      "navy": {
        "value": "#102F7D"
      },
      "cerulean": {
        "value": "#59B9F5"
      },
      "emerald": {
        "value": "#69CC97"
      },
      "purple": {
        "value": "#AB83B9"
      }
    },
    "greyscale": {
      "light-grey": {
        "value": "#C4C4C4"
      },
      "grey": {
        "value": "#9B9B9B"
      },
      "dark-grey": {
        "value": "#757575"
      }
    }
  }
}
```
En collaboration avec les designers, nous avons défini les espacements et les couleurs récurrents dans les maquettes fournies.

Définissons ensuite les types qui peuvent utiliser ces design token :
```tsx
// tokenTypes.ts
import type { tokenVariables } from '@/constants';

export type ColorType =
  | keyof (typeof tokenVariables)['color']['primary']
  | keyof (typeof tokenVariables)['color']['secondary']
  | keyof (typeof tokenVariables)['color']['greyscale'];

export type SpacingType = keyof (typeof tokenVariables)['spacing'];
```

Ces types peuvent ensuite être utilisés pour définir :
- des **System Props**

```tsx
// System Props - ColorSystemProps.ts
import type { ColorType } from '@/types';

export interface ColorSystemProps {
  /** background-color */
  bg?: ColorType;
  /** color */
  color?: ColorType;
}

// System Props - SpacingSystemProps.ts
import type { SpacingType } from '@/types';

export interface MarginSystemProps {
    /** margin */
    m?: SpacingType;
    /** margin-top */
    mt?: SpacingType;
    /** margin-right */
    mr?: SpacingType;
    /** margin-bottom */
    mb?: SpacingType;
    /** margin-left */
    ml?: SpacingType;
}

export interface PaddingSystemProps {
    p?: SpacingType;
    ...
}

export interface SpacingSystemProps extends MarginSystemProps, PaddingSystemProps {}
```

- le type d'une propriété d'un composant
```tsx
// Atomic Design - Atom/Button.tsx
import type { ColorType } from '@/types';

interface ButtonProps {
    color: ColorType;
    label: string;
    handleClick: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ label, color, handleClick }) => (
    <button style={{ backgroundColor: color }} onClick={handleClick}>{label}</button>
);

export default Button;
```

Passons maintenant à la création de nos éléments modulaires. Dans l'exemple ci-dessus, nous avons créé un composant atomique qui est stylisé via l'attribut `style`. Reprenons ce composant et avec, créons une classe CSS :
```scss
// Button.scss
.button {
  color: white;
  background-color: red;
  padding: var(--spacing-xs);

  &--bg-primary {
    background-color: var(--color-primary);
  }
}
```

```tsx
// Atomic Design - Atom/Button.tsx
...
import classNames from 'classnames';
import type { ColorType } from '@/types';

import './Button.scss';

interface ButtonProps extends SpacingSystemProps {
    color: ColorType;
    label: string;
    handleClick: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ label, color, handleClick, p }) => (
    <button className={classNames('button', {
        [`button--${color}`]: color,
        [`p-${p}`]: p,
    })} onClick={handleClick}>{label}</button>
);

export default Button;
```

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Nous avons utilisé ici `classnames` pour générer des classes CSS utilitaires, mais d'autres approches peuvent être utilisées en fonction de vos besoins et de vos préférences.
Vous pouvez notamment retrouver dans cet [article](https://blog.eleven-labs.com/fr/system-props/) d'autres exemples qui permettent de bien implémenter les System Props dans votre Design System.
</div>

Le Design System exige une collaboration étroite entre les différents métiers impliqués (Designers, Développeurs, PO / PM).
Pour que cette collaboration soit efficace, la documentation joue un rôle important.


## Comment documenter un Design System ?

Dans le monde du développement front-end, la documentation des composants est cruciale pour assurer une cohérence visuelle et fonctionnelle au sein d'une application, ainsi que pour servir de point de référence entre les designers et les développeurs. Une bonne documentation permet de lister les composants disponibles, les variantes pour chacun des éléments, et de tenir une trame claire sur les bonnes pratiques lors de la création des composants qui alimenteront le Design System. C'est là qu'interviennent différents outils de documentation. Storybook, un outil puissant, offre une solution innovante à ce défi, et c'est cette solution que nous avons choisie pour nos Design Systems au sein du Studio Eleven Labs.

### Qu'est-ce que Storybook ?

[Storybook](https://storybook.js.org/) n'est pas seulement un outil, c'est une plateforme interactive permettant aux développeurs de créer, visualiser et documenter des composants de manière isolée. Contrairement à la documentation statique traditionnelle, Storybook offre une approche dynamique et visuelle pour présenter les différents états et variantes de vos composants. Avant de nous plonger dans des exemples d'utilisation de cet outil, examinons ce que Storybook offre comme avantages et spécificités.

- **Documentation visuelle**

Les stories permettent d'ajouter des annotations, des descriptions détaillées et des exemples interactifs, rendant la documentation plus riche et accessible.

- **Intégration Facile et support multi-framework**

Storybook peut s'intégrer très simplement à un projet existant et s'adapte à différentes stacks techniques. Que vous utilisiez React, Angular, Vue, ou toute autre framework ou librairie, Storybook offre un support multi-framework, ce qui lui confère une certaine flexibilité.

- **Isolation des composants**

Storybook permet d'isoler chaque composant, facilitant ainsi l'inspection de ses spécificités, variantes et états. Chaque composant aura donc une documentation séparée et indépendante de l'ensemble de l'application.

- **Interactivité Instantanée**

Les développeurs et les designers ont la possibilité d'interagir directement avec les composants de l'interface, ce qui simplifie considérablement la compréhension de ces éléments. Cette approche facilite les tests fonctionnels et la détection de comportements anormaux en vue de les corriger.

- **Réutilisabilité des Stories**

Une fois écrite, une _Story_ est facilement réutilisable et intégrable au sein d'une autre _Story_, ce qui garantit une cohérence de la documentation et une maintenance simplifiée.

### Écriture des Stories

Une _Story_ est une représentation visuelle d'un composant donné dans ses différents états et différentes variantes. Chaque _Story_ permet de manipuler les propriétés du composant afin de visualiser et tester tous ses aspects. Nous allons prendre l'exemple d'un `Organism` pour lequel nous allons créer une _Story_.

```tsx
// Organism - PostPreviewList.tsx
export interface PostPreviewListProps {
  posts: Partial<PostPreviewProps>[];
  pagination?: PaginationProps;
  isLoading?: boolean;
}

export const PostPreviewList: React.FC<PostPreviewListProps> = ({ posts, pagination, isLoading = false }) => (
  <>
    {posts.map((post, index) => (
      <React.Fragment key={post?.slug ?? index}>
        <PostPreview
          hasMask={Boolean(pagination && index === posts.length - 1)}
          {...(post || {})}
          isLoading={isLoading}
        />
        {posts.length - 1 !== index && <Divider my="m" bg="light-grey" />}
        {posts.length - 1 === index && pagination && <Divider size="m" my="m" mx={{ md: 'xl' }} bg="azure" />}
      </React.Fragment>
    ))}
    {pagination && <Pagination {...pagination} />}
  </>
);
```

Nous avons donc ce composant `PostPreviewList` pour lequel nous allons décrire la _Story_ correspondante, dans un fichier `PostPreviewList.stories.tsx`. Cette _Story_ va tout d'abord décrire l'état initial du composant. On fournira en entrée des données fictives permettant l'affichage du composant selon le contrat de l'interface, et ce après avoir nommé notre _Story_, qui viendra se loger dans le dossier `Organism`.

```tsx
// Organism - PostPreviewList.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { PostPreviewList } from './PostPreviewList';

export default {
  title: 'Organism/PostPreviewList',
  component: PostPreviewList,
  args: {
    posts: Array.from({ length: 7 }).map((_, index) => ({
      contentType: 'article',
      slug: `slug-${index}`,
      title: `Titre de l'article ${index}`,
      date: '09 fév. 2021',
      readingTime: 24,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit vel tellus in molestie. Curabitur malesuada sodales consectetur. Aliquam convallis nec lacus in euismod. Vestibulum id eros vitae tellus sodales ultricies eget eu ipsum.',
    })),
  },
} as Meta<typeof PostPreviewList>;

const Template: StoryFn<typeof PostPreviewList> = (args) => <PostPreviewList {...args} />;

export const PostPreviewListWithData = Template.bind({});
```

En voici le résultat.

![PostPreviewList par defaut]({BASE_URL}/imgs/articles/2023-11-28-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/postPreviewList-default.png)
Figure: *PostPreviewList - Default*

Comme vous pouvez l'observer, nous avons donc un visuel du composant avec une section permettant de constater les données reçues qui ont servi à la construction de celui-ci.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Il est possible de manipuler les données afin de pouvoir personnaliser l'affichage du composant. Ainsi, cela vous donnera la possibilité de visualiser plusieurs variantes du composant sans modifier la _Story_ de base. Vous pouvez également trouver les propriétés dépendantes des [System Props](https://blog.eleven-labs.com/fr/system-props/).
</div>

#### Documenter les cas d'usage
Comme dit précédemment, il est possible de documenter les variantes en manipulant les données d'une _Story_ de base. Mais il est aussi possible de créer une _Story_ par variante ou par état afin d'en garder la trace dans le Storybook sans avoir à modifier quoi que ce soit. Une bonne documentation se doit de décrire tous les cas d'usage d'un composant, cette étape est donc primordiale pour une documentation robuste et exhaustive.

```tsx
export const PostPreviewListIsLoading = Template.bind({});
PostPreviewListIsLoading.args = {
  isLoading: true,
};
```

En modifiant le jeu de données en entrée pour le composant, on a la possibilité de créer cette _Story_ mettant en avant le composant `PostPreviewList` dans un état de chargement.

![PostPreviewList en état de chargement]({BASE_URL}/imgs/articles/2023-11-28-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/postPreviewList-loading.png)
Figure: *PostPreviewList - Is Loading*

En appliquant le même principe, nous pouvons documenter une variante du composant. Par exemple, en reprenant le composant précédent, nous pouvons lui appliquer une pagination en lui fournissant en entrée les données nécessaires qui permettront l'affichage de cette pagination.

```tsx
export const PostPreviewListWithPagination = Template.bind({});
PostPreviewListWithPagination.args = {
    pagination: {
        textNumberOfPosts: '6/156 affichés',
        numberOfPosts: 6,
        maxNumberOfPosts: 156,
        loadMoreButtonLabel: 'Afficher plus',
        onLoadMore: action('onLoadMore'),
    },
};
```
<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

L'extension `action` est utilisée pour afficher les données reçues par les arguments du gestionnaire d'événements, ici `onLoadMore`. En effet, une _Story_ ne doit être qu'un visuel du composant, non une documentation de son comportement. Je vous invite à lire cet [article traitant des Storybook addons](https://blog.eleven-labs.com/fr/storybook-addons/).
</div>

![PostPreviewList avec une pagination]({BASE_URL}/imgs/articles/2023-11-28-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/postPreviewList-pagination.png)
Figure: *PostPreviewList - With pagination*

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Écrire une _Story_ permet de visualiser le design d'un composant indépendamment du reste de l'application. Cela nous permet également de jouer avec le composant afin de documenter toutes ses variantes et différents états. Toutes les facettes du composant sont donc disponibles à la vue des designers et des développeurs, ce qui facilite la communication entre les équipes et l'évolution du design.
</div>

### Documentation statique

En plus de la documentation visuelle des composants, il est aussi possible de retrouver des documentations statiques dans un Storybook. En effet, une documentation se doit également d'être explicative. Ainsi, les documentations statiques restent nécessaires afin d'informer sur les usages, les méthodes, les bonnes pratiques, ou encore concernant des propriétés disponibles comme les différents Design Tokens.

Storybook nous offre la possibilité d'écrire des fichiers `MDX`, qui mélangent le `Markdown` avec le Javascript/JSX et permettent de construire des documentations à la fois statiques et visuelles.

Essayons de construire un exemple dans un fichier `Colors.stories.mdx` qui documentera les Design Tokens concernant les couleurs disponibles dans notre application, ceux que nous avons eu l'occasion de voir plus haut.

```mdx
// Documentations - Colors.stories.mdx
import { Meta } from '@storybook/addon-docs'
import { tokenVariables } from '../constants'

<Meta title="Documentations/Design Tokens/Colors" />

# Colors

> Present color palette used by both design and engineering.

{Object.entries(tokenVariables.color).map(([categoryKey, tokenColorsByCategory]) => (
  <div key={categoryKey}>
    {categoryKey}
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tokenColorsByCategory).map(([tokenName, token]) => (
          <tr key={tokenName}>
            <td>{tokenName}</td>
            <td>{token.value}</td>
            <td>
              <div
                style={{
                  boxSizing: 'border-box',
                  width: '200px',
                  height: '50px',
                  backgroundColor: token.value,
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}
```
Ce qui nous donne ceci comme résultat.

![Documentation Design Tokens Colors]({BASE_URL}/imgs/articles/2023-11-28-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/colors-design-token.png)
Figure: *Documentation statique - Colors Design Token*

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Les documentations statiques vont décrire les fondations de votre design d'application. Il est donc important de commencer par documenter les concepts et les bases sur lesquels s'appuie le design, avant d'entamer l'écriture de la documentation des composants.
</div>

## Conclusion

Construire un Design System robuste passe par une bonne conception en amont, le choix des outils utilisés et une documentation adéquate qui permettra de rendre le tout clair pour tous les acteurs participant à la création du design.

Les outils et concepts présentés dans cet article sont le résultat de notre expérience avec les Design System au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application). Cela nous a permis de mettre en place des Design System complets et robustes pour nos clients ainsi que pour nos projets internes.
