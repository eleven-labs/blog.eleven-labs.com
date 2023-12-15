---
contentType: article
lang: fr
date: 2023-11-10
slug: system-props
title: "System Props : Flexibilité et cohérence dans le Design"
excerpt: Découvrez ce que sont les System Props, quels sont leurs avantages, et comment les intégrer pour améliorer vos composants d'interface.
categories:
    - javascript
keywords:
    - design system
    - system props
    - frontend
authors:
    - fpasquet
    - kdung
---

Dans cet article, nous allons vous présenter le concept de *System Props* en illustrant leurs avantages avec des exemples concrets d'utilisation. Nous expliquerons aussi comment les mettre en place sur vos projets, comme nous l'avons fait sur les nôtres au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application) à travers l'implémentation d'un [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/).

## Que sont les System Props ?

Les *System Props*, également connues sous le nom de *System Properties* ou *Style Props*, sont une liste de propriétés spécialement conçues pour personnaliser instantanément le style de vos composants. Contrairement aux props traditionnelles, ces *System Props* ajoutent des options supplémentaires pour ajuster le comportement et l'apparence de vos composants. Par exemple, des `SpacingSystemProps` facilitent la définition rapide de l'espacement de vos éléments, tandis que des `ColorSystemProps` mettent à votre disposition une palette de couleurs prédéfinie pour modifier les fonds, les couleurs de texte, les bordures, et plus encore. En intégrant ces propriétés dans vos composants, vous économisez du temps en utilisant des raccourcis pratiques pour personnaliser leur style. Cela en fait un atout précieux, notamment lors de la création d'un [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/).

### Les atouts majeurs des System Props

Les *System Props* offrent plusieurs avantages qui contribuent à améliorer la réutilisabilité, la prévisibilité et la standardisation de votre projet. Voici quelques-uns de ses atouts :

- **Personnalisation cohérente :**

Associées aux [Design Tokens]({BASE_URL}/fr/un-pont-entre-les-mondes-comment-les-design-tokens-facilitent-la-cooperation-entre-developpeurs-et-designers/), elles permettent de personnaliser uniformément un composant tout en gardant la flexibilité nécessaire pour des ajustements. Cette combinaison garantit la cohérence visuelle et la réactivité, en assurant que les composants respectent les normes tout en s'adaptant aux besoins changeants.

- **Réduction de la duplication de code :**

La création de standards de personnalisation réutilisables simplifie la maintenance et garantit que des styles similaires ne sont pas recréés de manière redondante. Selon les besoins de votre projet, il est possible d'avoir des variantes de votre composant sans avoir à créer un nouveau composant à chaque fois. Vous pourriez ainsi utiliser le composant `Card` plusieurs fois avec des couleurs et des espacements différents.

- **Gain de temps :**

En économisant du temps sur des personnalisations de style mineures et récurrentes, cela permet de se concentrer sur des aspects plus complexes du développement, tels que la logique métier ou les fonctionnalités avancées.

- **Documentation claire et facilité de collaboration :**

Les *System Props* encouragent une documentation claire et cohérente, facilitant ainsi l'adoption par l'équipe. Elle permet aux nouveaux membres de comprendre rapidement comment personnaliser les composants de manière cohérente.

  ![Documentation System Props]({BASE_URL}/imgs/articles/2023-11-10-system-props/documentation-system-props.png)

### Exemples de bibliothèques populaires utilisant le concept des System Props

Les *System Props* sont utilisés dans de nombreuses bibliothèques populaires, chacune ayant ses propres spécificités pour la personnalisation des composants. Voici quelques exemples de ces bibliothèques et de leurs particularités :

- **[Chakra UI](https://chakra-ui.com/)**

Chakra UI propose un Design System basé sur des composants personnalisables avec des *Style Props* pour ajuster les styles des composants. Il fonctionne avec du CSS-in-JS.

- **[Stitches](https://stitches.dev/)**

Stitches est une bibliothèque CSS-in-JS pour React qui permet de définir des styles en utilisant des *Style Props* de manière similaire à [Emotion](https://emotion.sh/) qui est une bibliothèque CSS-in-JS. Elle fournit les outils nécessaires pour créer votre Design System, bien qu'elle ne soit pas un Design System en soi.

- **[Klass](https://klass.pages.dev/)**

Klass est similaire à Stitches, mais elle n'utilise pas le CSS-in-JS. Elle injecte des classes utilitaires et est compatible avec React, Preact, Solid, et peut être utilisée de manière agnostique par rapport aux frameworks grâce à ses fonctions pures. Elle est souvent combinée avec [Tailwind CSS](https://tailwindcss.com/) pour une personnalisation avancée.

\
Et bien d'autres encore, telles que **[MUI (Material UI)](https://mui.com/)**, **[Radix UI](https://www.radix-ui.com/)**, **[Antd](https://ant.design/)**, **[Primer](https://primer.style/)**, utilisent également des *System Props* pour simplifier la personnalisation des composants d'interface utilisateur.

### Exemples d'utilisation

Pour illustrer la mise en œuvre des *System Props* dans un composant, prenons un exemple concret avec le composant `Box`. Les *System Props* sont des propriétés spécifiques que nous utilisons pour personnaliser l'apparence du composant de manière cohérente et flexible.

```tsx
<Box
    as="article"
    bg="primary"
    p="s"
>
    <Text color="accent" size="m">
        Contenu
    </Text>
</Box>
```

Dans cet exemple, nous utilisons le composant `Box` avec des *System Props* pour définir son apparence. Nous spécifions des propriétés telles que la couleur de fond `bg`, l'espacement `p`, ainsi que la couleur du texte `color` et la taille de police `size` pour le composant `Text`.

Si nous utilisions une bibliothèque comme `Klass`, qui injecte des classes utilitaires, voici à quoi ressemblerait le résultat après la transformation en HTML. Les *System Props* sont convertis en classes CSS correspondantes :

```html
<article class="bg-primary p-s">
    <p class="color-accent text-size-m">Contenu</p>
</article>
```

Cet exemple illustre comment les *System Props* permettent de personnaliser le style d'un composant de manière claire et concise, tout en garantissant une cohérence visuelle au sein de l'application.

## Comment intégrer et implémenter les System Props

Pour intégrer efficacement les System Props dans vos projets, une approche structurée est essentielle.

### Identifier les System Props pertinents

Avant de commencer à intégrer les *System Props* dans vos projets, il est essentiel d'identifier les props pertinentes pour votre Design System.

- **Analyser les besoins :** Passez en revue les exigences spécifiques de votre projet ou de votre Design System. Identifiez les personnalisations fréquemment requises, les styles ou les comportements qui se répètent fréquemment.

- **Consulter le Design System :** Si vous avez déjà un Design System existant, consulter la documentation pour identifier les *System Props* existantes et vérifiez si les propriétés que vous envisagez ne sont pas déjà incluses. Vous pourriez également envisager de regrouper certaines propriétés existantes si nécessaire.

- **Créer les nouvelles System Props :** Si les *System Props* existantes ne répondent pas à votre besoin, envisager de créer de nouvelles *System Props*.

- **Responsive value** :  Dans certaines situations, il peut être nécessaire d'ajouter des valeurs différentes en fonction de la taille de l'écran pour garantir l'accessibilité et l'adaptabilité à différents types d'appareils sur votre site. Nous reviendrons sur ce sujet lors de l'implémentation.

### Implémenter des System Props

Nous allons explorer trois méthodes différentes pour mettre en œuvre les *System Props*. Chacune de ces méthodes offre des avantages spécifiques en fonction de vos besoins et de vos préférences.

- **Première implémentation avec classnames :**

La première méthode implique l'utilisation de **classnames** pour générer des classes CSS utilitaires en fonction des *System Props*.

```tsx
import classNames from 'classnames';
...

export interface ColorSystemProps {
    bg?: ColorTokenValue;
    color?: ColorTokenValue;
}

export interface SpacingSystemProps {
    p?: SpacingTokenValue;
    ...
}

export interface BoxProps extends ColorSystemProps, SpacingSystemProps {
    children: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({ bg, color, p, children }) => {
    <div className={classNames({
        [`bg-${bg}`]: bg,
        [`color-${color}`]: color,
        [`p-${p}`]: p,
    })}>
        {children}
    </div>
};
```

Avec cette implémentation, il vous suffit de créer ou d'utiliser des classes utilitaires correspondant aux *System Props* pour personnaliser le style.

- **Seconde implémentation avec Klass :**

Cette seconde approche utilise la bibliothèque **Klass** pour simplifier la gestion des *System Props*. **Klass** génère automatiquement des classes utilitaires à partir des propriétés que vous spécifiez dans le composant, ce qui simplifie considérablement le processus.

```ts
import { klassed } from '@klass/react';

const colorTokenValues = {
    primary: '#3767B6',
    secondary: '#DD3156',
    ...
};

const spacingTokenValues = {
    xs: '4px',
    s: '8px',
    ...
};

const Box = klassed('div', {
    variants: {
        bg: colorTokenValues,
        color: colorTokenValues,
        p: spacingTokenValues,
    },
});
```

Pour rendre vos propriétés **responsive**, vous pouvez ajouter des conditions pour chaque breakpoint souhaité et spécifier les valeurs correspondantes.

```ts
import { reklassed } from '@klass/react';

...

const Box = reklassed("div", {
    conditions: {
        base: "",
        sm: "sm:",
        md: "md:",
        lg: "lg:"
    },
    defaultCondition: "base",
    variants: {
        bg: colorTokenValues,
        color: colorTokenValues,
        p: spacingTokenValues,
    },
};
```

Les conditions sont vos différents breakpoints, étant donné que la majorité des sites sont en "mobile-first", vous appliquez le mobile en tant que condition par défaut.

Et pour utiliser ensuite ce composant, il suffit d'ajouter vos **responsive values** :

```tsx
<Box p={{ base: 'xs', md: 's' }} />
```

- **Dernière implémentation avec Stitches :**

La troisième méthode repose sur l'utilisation de **Stitches**, une bibliothèque de CSS-in-JS, pour gérer les *System Props*. Stitches génère du CSS-in-JS pour chaque propriété spécifiée.

```ts
import { styled } from '@stitches/react';

const Box = styled('div', {
  variants: {
    bg: {
        primary: {
            backgroundColor: '#3767B6',
        },
        secondary: {
            backgroundColor: '#DD3156',
        },
        ...
    },
    ...,
    p: {
        xs: {
            padding: "4px"
        },
        s: {
            padding: "8px"
        }
    }
});
```

Le fonctionnement du responsive pour **Stitches** est similaire à **Klass**, vous pouvez spécifier des conditions pour chaque breakpoint souhaité.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Ces trois approches vous permettent d'implémenter les *System Props* en fonction de vos besoins spécifiques, que ce soit en utilisant simplement **classnames**, **Klass**, ou CSS-in-JS avec **Stitches**.
</div>

### Documentez

La documentation est essentielle pour garantir que les membres de votre équipe savent comment utiliser correctement les System Props. Une documentation claire et détaillée facilite l'adoption et la cohérence :

- **Description :** Fournissez une description de chaque prop : la propriété CSS que ce system prop impacte et sa valeur possible, si la valeur est dans le Design Token, ajoutez un lien pour rediriger vers ce token.

- **Exemples :** Vous pouvez inclure des exemples d'utilisation pour montrer comment ces props peuvent être appliqués, par exemple avec un [Storybook]({BASE_URL}/fr/storybook-creer-son-premier-composant/).

- **Compatibilité :** Précisez quels composants acceptent chaque System Prop et comment ils influencent le style ou le comportement.

## Conclusion

L'adoption des System Props permet d'améliorer considérablement la flexibilité, la cohérence et la standardisation au sein de vos projets de développement. Cette approche commence par l'identification des props pertinents, que ce soit pour votre projet actuel ou un design system en cours de création. Une fois ces props identifiées, l'étape suivante consiste à les intégrer harmonieusement dans vos composants, garantissant ainsi une personnalisation uniforme.

Au sein du [Studio Eleven Labs](https://eleven-labs.com/nos-publications/donnez-une-nouvelle-dimension-a-votre-equipe-produit), nous appliquons les System Props pour élaborer des [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/) destinés à nos projets internes et à nos clients. Cette approche nous a permis de tirer parti de tous les bénéfices mentionnés dans cet article.
