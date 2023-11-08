---
contentType: article
lang: fr
date: 2023-11-07
slug: system-props
title: "System props : Flexibilité et Cohérence dans le Design"
excerpt: Découvrez ce que sont les System Props, quelles sont ses avantages, et comment les intégrer pour améliorer vos composants d'interface.
categories:
    - javascript
keywords:
    - design system
    - system props
    - frontend
authors:
    - kdung
---
Dans cet article, je vais vous présenter le concept des System Props en précisant ses avantages avec des exemples concrets d'utilisation. Je vais aussi expliquer comment le mettre en place sur vos projets comme nous l'avons fait sur nos projets au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application) à travers l'implémentation d'un [Design System](https://blog.eleven-labs.com/fr/pourquoi-creer-design-system/).

## Qu'est-ce que sont les System Props ?

Les **System Props**, également connues sous le nom de **System Properties** ou **Style Props**, sont une liste de propriétés spécialement conçues pour personnaliser instantanément le style de vos composants. Contrairement aux props traditionnelles, ces **System Props** ajoutent des options supplémentaires pour ajuster le comportement et l'apparence de vos composants. Elles vous font gagner du temps en offrant des moyens abrégés pour personnaliser vos composants, ce qui en fait un atout idéal, notamment pour les [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/).

### Les atouts majeurs des System Props

Les System Props offrent plusieurs avantages qui contribuent à améliorer la réutilisabilité, la prévisibilité et la standardisation de votre projet. Voici quelques-uns de ses atouts :

- **Personnalisation Cohérente :**

Associés aux [Design Tokens](https://blog.eleven-labs.com/fr/un-pont-entre-les-mondes-comment-les-design-tokens-facilitent-la-cooperation-entre-developpeurs-et-designers/), ils permettent de personnaliser uniformément un composant tout en gardant la flexibilité nécessaire pour des ajustements. Cette combinaison garantit la cohérence visuelle et la réactivité, en assurant que les composants respectent les normes tout en s'adaptant aux besoins changeants.

- **Réduction de la Duplication de Code :**

La création de standards de personnalisation réutilisables simplifie la maintenance et garantit que des styles similaires ne sont pas recréés de manière redondante. Selon les besoins de votre projet, il est possible d'avoir des variantes de votre composant sans avoir à créer un nouveau composant à chaque fois. Vous pourriez ainsi utiliser le composant `Card` plusieurs fois avec des couleurs et des espacements différents.

- **Gain de temps :**

En économisant du temps sur des personnalisations de style mineures et récurrentes, cela permet de se concentrer sur des aspects plus complexes du développement, tels que la logique métier ou les fonctionnalités avancées.

- **Documentation Claire et Facilité de Collaboration :**

Les System Props encouragent une documentation claire et cohérente, facilitant ainsi l'adoption par l'équipe. Elle permet aux nouveaux membres de comprendre rapidement comment personnaliser les composants de manière cohérente.

  ![Documentation System Props]({BASE_URL}/imgs/articles/2023-11-07-system-props/documentation-system-props.png)

### Exemples de bibliothèques populaires utilisant le concept des System Props

Les System Props sont utilisés dans beaucoup de librairies populaires en voici quelques une:

Les System Props sont utilisés dans de nombreuses bibliothèques populaires, chacune ayant ses propres spécificités pour la personnalisation des composants. Voici quelques exemples de ces bibliothèques et de leurs particularités :

- **[Chakra UI](https://chakra-ui.com/)**

Chakra UI propose un Design System basé sur des composants personnalisables avec des "Style Props" pour ajuster les styles des composants. Il fonctionne avec du CSS-in-JS.

- **[Stitches](https://stitches.dev/)**

Stitches est une bibliothèque CSS-in-JS pour React qui permet de définir des styles en utilisant des "Style Props" de manière similaire à Emotion. Elle fournit les outils nécessaires pour créer votre Design System, bien qu'elle ne soit pas un Design System en soi.

- **[Klass](https://klass.pages.dev/)**

Klass est similaire à Stitches, mais elle n'utilise pas le CSS-in-JS. Elle injecte des classes utilitaires et est compatible avec React, Preact, Solid, et peut être utilisée de manière agnostique par rapport aux frameworks grâce à ses fonctions pures. Elle est souvent combinée avec Tailwind CSS pour une personnalisation avancée.

\
Et bien d'autres encore, telles que **[MUI (Material UI)](https://mui.com/)**, **[Radix UI](https://www.radix-ui.com/)**, **[Antd](https://ant.design/)**, **[Primer](https://primer.style/)** et de nombreuses autres bibliothèques, utilisent également des "System Props" pour simplifier la personnalisation des composants d'interface utilisateur.

### Exemples d'utilisation

Pour illustrer la mise en œuvre des System Props dans un composant, prenons un exemple concret avec le composant `Box`. Les System Props sont des propriétés spécifiques que nous utilisons pour personnaliser l'apparence du composant de manière cohérente et flexible.

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

Dans cet exemple, nous utilisons le composant Box avec des System Props pour définir son apparence. Nous spécifions des propriétés telles que la couleur de fond `bg`, l'espacement `p`, ainsi que la couleur du texte `color` et la taille de police `size` pour le composant `Text`.

Si nous utilisions une bibliothèque comme `Klass`, qui injecte des classes utilitaires, voici à quoi ressemblerait le résultat après la transformation en HTML. Les System Props sont convertis en classes CSS correspondantes :

```html
<article class="bg-primary p-s">
    <p class="color-accent text-size-m">Contenu</p>
</article>
```

Cet exemple illustre comment les System Props permettent de personnaliser le style d'un composant de manière claire et concise, tout en garantissant une cohérence visuelle au sein de l'application.

## Comment intégrer les System Props

Pour intégrer efficacement les System Props dans vos projets, une approche structurée est essentielle.

### Identifiez les System Props pertinents

Avant de commencer à intégrer les "System Props" dans vos projets, il est essentiel d'identifier les props pertinents pour votre design system.

- **Analyser les besoins :** Passez en revue les exigences spécifiques de votre projet ou de votre design system. Identifiez les personnalisations fréquemment requises, les styles ou les comportements qui se répètent fréquemment.

- **Consulter le Design System :** Si vous avez déjà un Design System existant, consulter la documentation pour identifier les System Props existant pour vérifier que les propriétés ne sont pas déjà ajouté ou bien s'il faudrait reprendre certaines propriétés pour les regrouper dans un type plus spécifique.

- **Créer les nouveaux System Props :** Si les System Props existant ne répondent pas à votre besoin, envisager de créer de nouveaux System Props. Ajouter un nouveau fichier selon le type de props dans votre dossier SystemProps.

```tsx
// SystemProps/SpacingSystemProps.ts

export interface SpacingSystemProps {
  p?: SpacingType;
  m?: SpacingType;
  // ...other props
}
```

[//]: # (est ce qu'il faut expliquer tout? de comment transformer une props en classe CSS ?)

### Intégration des System Props

Une fois que vous avez identifié les System Props pertinents, il est temps de les intégrer :

- **Ajoutez les System Props à vos composants :** Pour ajouter votre nouveau System Props (SpacingSystemProps) dans un composant, il suffit de l'ajouter aux props de votre composant

```tsx
// Component Text

interface TextOptions {
    size?: TextSizeType;
    color?: ColorType;
}

type TextProps = TextOptions & SpacingSystemProps;

export const Text: React.FC<TextProps> = ({ size, color, children, ...props }) => (
    <Box {...props} color={colo
```tsx
// Design Tokens - color.tokens.ts

const colorTokens = {
  grey: "#606F95",
  lightGrey: "#C5C8D9"
};

// System props - colorSystemProps.ts

interface ColorSystemProps {
    /** background-color */
    bg?: ColorType;
    /** color */
    color?: ColorType;
}

// Component Box.ts

export type BoxProps = AsProps<'div'> & ColorSystemProps;

export const Box: React.FC<BoxProps> = ({ children, ...props }) => (
    <div {...props}>{children}</div>
);
```

Dans cette exemple, on peut personnaliser le composant Box en lui passant en propriété une couleur ou un background.

```tsx
// System props - SpacingSystemProps.ts

interface SpacingSystemProps {
  /** padding */
  p?: SpacingType;
}

// Component Card.ts

export type CardProps = AsProps<'div'> & SpacingSystemProps;

export const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <div {...props}>
      {children}
  </div>
);
```r} size={size} {...props}>
        {children}
    </Box>
);
```

- **Utilisez les :** Spécifiez les props appropriés pour personnaliser le style de vos composants.

```tsx
<Text m={5}>Hello !</Text>
```

### Documentez

La documentation est essentielle pour garantir que les membres de votre équipe savent comment utiliser correctement les System Props. Une documentation claire et détaillée facilite l'adoption et la cohérence :

- **Description :** Fournissez une description de chaque prop : la propriété CSS que ce system prop impacte et sa valeur possible, si la valeur est dans le Design Token, ajoutez un lien pour rediriger vers ce token.

- **Exemples :** Vous pouvez inclure des exemples d'utilisation pour montrer comment ces props peuvent être appliqués, par exemple avec un Storybook.

- **Compatibilité :** Précisez quels composants acceptent chaque System Prop et comment ils influencent le style ou le comportement.

## Conclusion

L'adoption des System Props permet d'améliorer considérablement la flexibilité, la cohérence et la standardisation au sein de vos projets de développement. Cette approche commence par l'identification des props pertinents, que ce soit pour votre projet actuel ou un design system en cours de création. Une fois ces props identifiés, l'étape suivante consiste à les intégrer harmonieusement dans vos composants, garantissant ainsi une personnalisation uniforme.

Au sein du [Studio Eleven Labs](https://eleven-labs.com/nos-publications/donnez-une-nouvelle-dimension-a-votre-equipe-produit), nous appliquons les System Props pour élaborer des [Design System](https://blog.eleven-labs.com/fr/pourquoi-creer-design-system/) destinés à nos projets internes et à nos clients. Cette approche nous a permis de tirer parti de tous les bénéfices mentionnés dans cet article.
