---
contentType: article
lang: fr
date: 2023-11-23
slug: construire-un-design-system-robuste-avec-react-les-fondations-essentielles
title: "Construire un Design System robuste avec react: les fondations essentielles"
excerpt: "Description"
categories:
    - javascript
keywords:
    - design system
    - storybook
    - react
    - frontend
authors:
    - kdung
    - iregaibi
---

Dans le développement frontend, la nécessité d'établir des bases solides devient impératif pour garantir la cohérence, la réutilisation et la facilité de maintenance des interfaces utilisateur.
Lors de la conception de vos interfaces, il est probable que vous ayez déjà eu recours à des bibliothèques de composants.

Cependant, il peut arriver que celles-ci ne répondent pas de manière optimale à des cas particuliers ou à des exigences spécifiques de votre application, notamment dans des contextes métiers spécifiques.
Vous décidez alors de mettre en place un écosystème qui rassemble vos propres composants, typographies, couleurs, documentation et des directives d'utilisation : le Design System.
A travers cette article, nous allons vous expliquer comment construire un Design System robuste avec React.


## CONTEXTE

Avant de plonger dans la mise en place d'un Design System robuste avec React, il est essentiel de comprendre les fondamentaux de ce domaine.

### Design System

Un [Design System](https://blog.eleven-labs.com/fr/pourquoi-creer-design-system/) réunit un ensemble d'éléments graphiques, des typographies, des palettes de couleurs, de la documentation et des directives d'utilisation.
C'est un référenciel qui garantie une cohérence visuelle et fonctionnelle qui apporte un cadre et des règles à respecter. 

### Atomic Design

L'[Atomic Design](https://blog.eleven-labs.com/fr/atomic-design/) est une approche de conception de systèmes d'interface utilisateur et de design d'interaction. Cette approche consiste à découper les composants en éléments modulaires : Atome, Molecule, Organisme, Templates, et Pages. 

### Design token

Les [Design Token](https://blog.eleven-labs.com/fr/un-pont-entre-les-mondes-comment-les-design-tokens-facilitent-la-cooperation-entre-developpeurs-et-designers/) sont un ensemble de valeurs ou de variables utilisé pour référencer plusieurs types d'éléments tels que les couleurs, typographies, espacements et bien d'autres.
Ces tokens permettent entre autre, de faciliter la mise à jour des styles et de maîtriser les déclinaisons de thèmes qui partagent des références communes. 

### BEM

La méthodologie [BEM](https://blog.eleven-labs.com/fr/retour-d-experience-sur-bem/) donne au CSS une convention de structuration, de nommage et d’organisation pour vos composants.
BEM envisage la composition d’une page web en plusieurs **B**lock, qui contiennent des **E**lements, et ces derniers peuvent varier grâce à des **M**odifiers.

### System Props

Les [System Props](https://blog.eleven-labs.com/fr/system-props/) sont une liste de propriétés permettant de personnaliser instantanément le style de vos composants.
Ces ***System Props*** sont des raccourcis pratiques pour ajouter des styles complémentaires qui permettent de modifier le comportement et l'apparence de vos composants.

## Implémentation

## Comment documenter un Design System ?

Dans le monde du développement front-end, la documentation des composants est cruciale pour assurer une cohérence visuelle et fonctionnelle au sein d'une application, ainsi que pour servir de point de référence entre les designers et les développeurs. Une bonne documentation permet de lister les composants disponibles, les variantes pour chacun des éléments et de tenir une trame claire sur les bonnes pratiques lors de la création des composants qui alimenteront le Design System. C'est là qu'interviennent différents outils de documentation. Storybook, un outil puissant qui offre une solution innovante à ce défi et c'est cette solution que nous avons choisie pour nos Design System au sein du Studio Eleven Labs.

### Qu'est ce que Storybook ?

[Storybook](https://storybook.js.org/) n'est pas seulement un outil, c'est une plateforme interactive permettant aux développeurs de créer, visualiser et documenter des composants de manière isolée. Contrairement à la documentation statique traditionnelle, Storybook offre une approche dynamique et visuelle pour présenter les différents états et variantes de vos composants. Avant de nous plonger dans des exemples d'utilisation de cet outil, voyons ce que nous offre Storybook comme avantages et spécificités.

- **Documentation visuelle**

Les stories permettent d'ajouter des annotations, des descriptions détaillées et des exemples interactifs, rendant la documentation plus riche et accessible.

- **Intégration Facile et support multi-framework**

Storybook peut s'intégrer trés simplement à projet existant et s'adapte à différentes stack techniques. Que vous utilisiez React, Angular, Vue ou tout autre framework ou librairie, Storybook offre un support multi-framework, ce qui lui confert une certaine flexibilité.

- **Isolation des composants**

Storybook permet d'isoler chaque composant, facilitant ainsi l'inspection de ses spécificités, variantes et états. Chaque composant aura donc une documentation séparée et indépendante de l'ensemble de l'application.

- **Interactivité Instantanée**

Les développeurs et les designers ont la possibilité d'interagir directement avec les composants de l'interface, ce qui simplifie considérablement la compréhension de ces éléments. Cette approche facilite les tests fonctionnels et la détection de comportements anormaux en vue de les corriger.

- **Réutilisabilité des Stories**

Une fois écrite, une _Story_ est facilement réutilisable et intégrable au sein d'une autre _Story_. Ce qui garantit une cohérence de la documentation et une maintenance simplifiée.

### Écriture des Stories

Une _Story_ est une représentation visuelle d'un composant donnée dans ses différents états et différentes variantes. Chaque _Story_ permet de manipuler les propriétés du composant afin de visualiser et tester tous les aspects du composants. Nous allons prendre l'exemple d'un `Organism` pour lequel nous allons créer une _Story_.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Je vous invite à lire cet [article traitant de l'Atomic Design](https://blog.eleven-labs.com/fr/atomic-design/) afin d'en apprendre plus sur ce qu'est un `Organism`.
</div>

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

Nous avons donc ce composant `PostPreviewList` pour lequel nous allons décrire la _Story_ correspondante, dans un fichier `PostPreviewList.stories.tsx`. Cette _Story_ va tout d'abord décrire l'etat initial du composant. On fournira en entrée des données fictives permettant l'affichage du composant selon le contrat de l'interface, et ce aprés avoir nommé notre _Story_, qui viendra se loger dans le dossier `Organism`.

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

![PostPreviewList par defaut]({BASE_URL}/imgs/articles/2023-11-23-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/postPreviewList-default.png)
Figure: *PostPreviewList - Default*

Comme vous pouvez observer nous avons donc un visuel du composant avec une section permettant de constater les données reçus qui ont servit à la construction de celui-ci.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Il est possible de manipuler les données afin de pouvoir customisé l'affichage du composant, ainsi cela vous donnera la possibilité de visionner plusieurs variantes du composant et ce, sans modifié la _Story_ de base. Vous pouvez aussi trouver les propriétés dépendantes des [System Props](https://blog.eleven-labs.com/fr/system-props/).
</div>

#### Documenter les cas d'usage
Comme dis précédemment, il est possible de documenter les variantes en manipulant les données d'une _Story_ de base. Mais il est aussi possible de crée une _Story_ par variante ou par état afin d'en garder la trace dans le Storybook sans avoir à modifier quoi que ce sois. Une bonne documentation se doit de décrire toutes les cas d'usages d'un composant, cette étape est donc primoridial pour une documentation robuste et exaustive.

```tsx
export const PostPreviewListIsLoading = Template.bind({});
PostPreviewListIsLoading.args = {
  isLoading: true,
};
```

En modifiant le jeu de donnée en entrée pour le composant, on a la possibilité de crée cette _Story_ mettant en avant le composant `PostPreviewList` dans un état de chargement.

![PostPreviewList en état de chargement]({BASE_URL}/imgs/articles/2023-11-23-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/postPreviewList-loading.png)
Figure: *PostPreviewList - Is Loading*

En appliquant le même principe, nous pouvons documenter une variante du composant. Par exemple, en reprenant le composant précédent, nous pouvons lui appliquer une pagination en lui fournissant en entrée les données necessaires qui vont permettre l'affichage de cette pagination.

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

L'extension `action` est utilisée pour afficher les données reçues par les arguments du gestionnaire d'événements, ici `onLoadMore`. En effet, une _Story_ ne doit être qu'un visuel du composant, non une documentation de son comportement. Je vous invite à lire cet [article, traitant des Storybook addons](https://blog.eleven-labs.com/fr/storybook-addons/).
</div>

![PostPreviewList avec une pagination]({BASE_URL}/imgs/articles/2023-11-23-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/postPreviewList-pagination.png)
Figure: *PostPreviewList - With pagination*

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Écrire une _Story_ permet de visualiser le design d'un composant indépendement du reste de l'application. Cela nous permet aussi de jouer avec le composant afin de documenter toutes ses variantes et diffétents états. Toutes les facettes du composant sont donc disponible à la vue des designers et des developpeurs, ce qui facilite la communication entre les équipes et l'évolution du design.
</div>

### Documentation statique

En plus de la documentation visuelle des composants, il est aussi possible de retrouver des documentation statiques dans un Storybook. En effet, une documentation se doit aussi d'être explicative, de ce fait, les documentations statiques restent necessaires afin d'informer sur les usages, les maniéres de faire, les bonnes pratiques ou concernant des propriétés disponibles comme les différents Design Tokens.

Storybook nous offre la possibilité d'écrire des fichiers `MDX`, qui vont mixer entre le `Markdown` et le Javascript/JSX et donnent la possibilité de construire des documentations statiques mais aussi visuelle.

Essayons de construire un exemple dans un fichier `Colors.stories.mdx` qui viendra documenter les Design Tokens concernant les couleurs disponibles dans notre application.

```mdx
// Documentations - Colors.stories.mdx
import { Meta } from '@storybook/addon-docs'
import { tokenVariables } from '../constants'

<Meta title="Documentations/Design Tokens/Colors" />

# Colors

> Present color palette used by both design and engineering.

<table style={{ width: '100%'}}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Value</th>
      <th>Preview</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(tokenVariables.colors).map(([colorKey, colorValue]) => (
        <tr key={colorKey}>
          <td>{colorKey}</td>
          <td>{colorValue}</td>
          <td>
            <div style={{
                boxSizing: 'border-box',
                width: '200px',
                height: '50px',
                backgroundColor: colorValue
              }}
            />
          </td>
        </tr>
    ))}
  </tbody>
</table>
```
Ce qui nous donne ceci comme résultat.

![Documentation Design Tokens Colors]({BASE_URL}/imgs/articles/2023-11-23-construire-un-design-system-robuste-avec-react-les-fondations-essentielles/colors-design-token.png)
Figure: *Documentation statique - Colors Design Token*

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Les documentations statiques vont décrire les fondations de votre design d'application, il donc est important de commencer à documenter d'abord les concepts et les bases sur lesquelles s'appuit le design, et ce avant de commencer l'ecriture de la documentation des composants.
</div>

## Conclusion

Construire un Design System robuste passe par une bonne conception en amont, un choix concernant les outils utilisés et une bonne documentation qui permettera de rendre le tout clair, et ce pour tous les acteurs agissant dans la création du design.

Les outils et concepts présentés dans cet articles sont le résultat de notre expérience avec les Design System au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application). Cela nous a permis de mettre en place des Design System complets et robustes pour nos clients et pour nos projets internes.
