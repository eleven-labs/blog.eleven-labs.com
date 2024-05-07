---
contentType: article
lang: fr
date: 2024-05-05
slug: industrialisation-design-tokens-style-dictionary
title: >-
  Maîtriser l'harmonie visuelle : Industrialisation des Design Tokens avec Style Dictionary
excerpt: >-
  Description
categories: []
authors:
  - fpasquet
keywords:
  - Design Tokens
  - Design System
  - Style Dictionary
---

## Introduction aux Design Tokens

Les Design Tokens sont des éléments fondamentaux de la conception d'interfaces utilisateur cohérentes. Ils représentent des valeurs clés telles que les couleurs, les polices, les espacements et autres propriétés visuelles utilisées pour créer une expérience utilisateur harmonieuse.

**Pourquoi les Design Tokens sont-ils essentiels ?** Imaginez un projet de grande envergure avec des centaines, voire des milliers d'éléments de conception, tous nécessitant une cohérence visuelle. Les Design Tokens permettent d'organiser et de centraliser ces éléments en un ensemble de valeurs réutilisables. En utilisant les Design Tokens, les équipes de conception et de développement peuvent garantir une harmonie visuelle à travers l'ensemble de l'application ou du système de conception.

## Les défis de la gestion des Design Tokens

La gestion des Design Tokens peut rapidement devenir complexe et fastidieuse, en particulier dans les projets de grande envergure. Les équipes de conception et de développement sont souvent confrontées à des défis tels que la duplication de valeurs, le manque de cohérence, la mise à jour laborieuse et la synchronisation entre les différentes plateformes.

Prenons l'exemple d'une application Web qui doit également avoir une présence mobile. Les Design Tokens tels que les couleurs ou les tailles de police doivent être cohérents sur toutes les plateformes. Sans une méthode d'industrialisation, cela peut entraîner des erreurs humaines, des incohérences et un processus de mise à jour laborieux lorsque des changements sont nécessaires.

Style Dictionary vient à la rescousse en offrant une solution pour industrialiser les Design Tokens et résoudre ces problèmes courants. Grâce à Style Dictionary, les équipes peuvent centraliser et synchroniser les Design Tokens, garantissant ainsi leur cohérence et facilitant leur maintenance à long terme.

## L'importance de l'industrialisation

L'industrialisation des Design Tokens avec Style Dictionary présente de nombreux avantages. Elle permet d'établir une source unique de vérité pour les valeurs de conception, ce qui améliore la cohérence visuelle et la productivité de l'équipe. De plus, elle facilite l'évolutivité du système de conception en rendant les modifications et les mises à jour plus efficaces.

En industrialisant les Design Tokens, vous créez une infrastructure solide qui permet une collaboration harmonieuse entre les concepteurs et les développeurs. Les concepteurs peuvent se concentrer sur la création de belles interfaces utilisateur, tandis que les développeurs peuvent utiliser les Design Tokens générés par Style Dictionary pour les intégrer de manière cohérente dans l'application.

Par ailleurs, l'industrialisation des Design Tokens offre une flexibilité considérable. Grâce à Style Dictionary, il est possible de générer des Design Tokens dans différents formats de sortie, adaptés à différentes plates-formes et frameworks. Que vous travailliez sur du développement Web, mobile ou même des projets d'impression, l'industrialisation des Design Tokens avec Style Dictionary vous permet d'adapter facilement les valeurs de conception à vos besoins spécifiques.

Dans la suite de cet article, nous explorerons en détail comment industrialiser les Design Tokens avec Style Dictionary peut grandement faciliter la gestion de ces éléments, en automatisant leur génération et leur utilisation cohérente tout au long du cycle de développement, mettant ainsi en lumière la puissance de Style Dictionary.

## Qu’est-ce que Style Dictionary ?

Style Dictionary, initialement créé par Danny Banks en 2017 et aujourd'hui porté par Token Studio depuis août 2023, se présente comme un outil puissant pour générer des styles cohérents et réutilisables sur une multitude de plateformes. Android (Kotlin), iOS (Swift) ou encore du Web (CSS, SASS, JS, TypeScript...), toutes ces destinations s'alimentent d'une source unique de vérité : des jetons de conception statiques.

![Architecture de Style Dictionary]({BASE_URL}/imgs/articles/2024-05-08-industrialisation-design-tokens-style-dictionary/architecture-style-dictionary.png)

Il repose sur une architecture robuste et modulaire, articulée autour de trois éléments essentiels :

- **Transformers :** ces fonctionnalités convertissent les design tokens dans une gamme de formats de style, tels que CSS, JavaScript, TypeScript, JSON, etc.

- **Transformer Groups :** des regroupements de transformers permettant d'appliquer des transformations spécifiques à des ensembles de tokens de design. Cette organisation favorise la génération de styles cohérents pour différentes plateformes ou langages de programmation.

- **Formatters :** des outils de mise en forme personnalisables pour peaufiner l'apparence des fichiers générés, en ajoutant des commentaires, en formatant le code selon vos préférences, et bien plus encore.

Style Dictionary adopte une convention de nommage claire et structurée pour les design tokens, favorisant une organisation efficace. Par défaut, il suit le schéma Category/Type/Item (CTI), comme illustré ci-dessous :

![Structure par défaut de Style Dictionary (CTI)]({BASE_URL}/imgs/articles/2024-05-08-industrialisation-design-tokens-style-dictionary/cti-style-dictionary.png)

Cependant, vous avez la liberté d'adopter une autre structure selon vos besoins. Nathan Curtis propose une variété de structures dans cet [article](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676).

Dans la suite de cet article, nous explorerons des exemples d'implémentation de ces éléments clés.

## Mise en œuvre de Style Dictionary

### Configuration de Style Dictionary

Maintenant que nous avons une compréhension des systèmes de conception, passons à la création de notre propre système de conception à l'aide de Style Dictionary.

1. Exécutez la commande suivante pour installer Style Dictionary en tant que dépendance de développement :

```
npm install -D style-dictionary
```

Dans votre projet, ajouter le fichier de configuration de style dictionnary, dans celui-ci nous configurerons seulement des fichiers Web (css, js et ts):

```js
// bin/style-dictionary.mjs
import StyleDictionary from 'style-dictionary';
import { registerMathTransform } from './sd/math.transformer.mjs';
import { registerSizePxTransform } from './sd/size-px.transformer.mjs';
import { registerWebTransformGroup } from './sd/web.transformer-group.mjs';

registerMathTransform(StyleDictionary);
registerSizePxTransform(StyleDictionary);
registerWebTransformGroup(StyleDictionary);

const defaultFilter = token => token.type !== 'scale';

const sd = StyleDictionary.extend({
    source: [
      'tokens/**/*.json'
    ],
    platforms: {
      css: {
        transformGroup:  'web',
        buildPath: 'src/css/',
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
            filter: defaultFilter
          }
        ]
      },
      ts: {
        transformGroup: 'web',
        buildPath: 'src/constants/',
        files: [
          {
            format: 'javascript/module',
            destination: 'variables.js',
            filter: defaultFilter
          },
          {
            format: 'typescript/module-declarations',
            destination: 'variables.d.ts',
            filter: defaultFilter
          }
        ]
      }
    }
  }
);

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
```

Transformer 1:

```js
// bin/sd/math.transformer.mjs
export const registerMathTransform = (sd) => {
  sd.registerTransform({
    name: 'math',
    type: 'value',
    transitive: true,
    matcher: token => typeof token.value === 'string' && /(\+|-|\*|\/)(\s|\d)/.test(token.value),
    transformer: token => {
      const cleanExpression = token.value.replace(/[a-z]+/gi, '');
      return eval(cleanExpression);
    },
  });
}
```

Transformer 2:

```js
// bin/sd/size-px.transformer.mjs
export const registerSizePxTransform = (sd) => {
    sd.registerTransform({
        name: 'size/px',
        type: 'value',
        transitive: true,
        matcher: token => ['spacing'].includes(token.attributes.category),
        transformer: token => {
            const value = parseFloat(token.value);
            if (isNaN(value)) {
                throw `Invalid Number: '${token.name}: ${value}' is not a valid number, cannot transform to 'px' \n`;
            }
            return `${value}px`;
        },
    });
}
```

Transformer group:

```js
// bin/sd/web.transformer-group.mjs
export const registerWebTransformGroup = (sd) => {
  sd.registerTransformGroup({
    name: 'web',
    transforms: ['attribute/cti', 'name/cti/kebab', 'math', 'size/px'],
  });
}
```

Ensuite ajouter dans votre `package.json` la commande suivante `build:design-tokens`:

```json
// package.json
{
  "name": "my-design-system",
  ...
  "scripts": {
    "build:design-tokens": "node ./bin/style-dictionary.mjs"
  },
  "devDependencies": {
    "style-dictionary": "^3.9.2",
    ...
  }
}
```

Il ne reste maintenant plus qu'à créer le dossier `tokens` et ajouter nos premiers tokens au formats json.

```json
// tokens/color.json
{
  "color": {
    "primary": {
      "value": "#3767B6",
      "comment": "Typically your primary brand color."
    },
    "secondary": {
      "value": "#224579",
      "comment": "A secondary branding color for supplementary value."
    },
    "black": {
      "value": "#000"
    },
    "white": {
      "value": "#FFF"
    },
    "neutral": {
      "comment": "A versatile base color for backgrounds, borders, and text, creating a calm and unobtrusive aesthetic while allowing other elements to stand out.",
      "value": "#9B9B9B"
    },
    "info": {
      "value": "#DD3156",
      "comment": "Used to provide additional information to the user without conveying any particular level of importance."
    },
    "accent": {
      "value": "#F3C93D",
      "comment": "A distinct accent color for content separators and blockquote styling, highlighting visual elements with a unique touch."
    },
    "calm": {
      "value": "#E1EAF9",
      "comment": "A soothing color that creates a serene and tranquil atmosphere. It can be used to convey a sense of peace, relaxation, and harmony in the user interface, often suitable for backgrounds or elements that require a calm visual presence."
    }
  }
}
```

```json
// spacing.json
{
  "spacing": {
    "scale": {
      "value": "4",
      "type": "scale"
    },
    "0": {
      "value": "0"
    },
    "2xs": {
      "value": "{spacing.scale}"
    },
    "xs": {
      "value": "{spacing.2xs} + {spacing.scale}"
    },
    "s": {
      "value": "{spacing.xs} + {spacing.scale}"
    },
    "m": {
      "value": "{spacing.s} + {spacing.scale}"
    },
    "l": {
      "value": "{spacing.m} + {spacing.scale}"
    },
    "xl": {
      "value": "{spacing.l} + {spacing.scale}"
    },
    "2xl": {
      "value": "{spacing.xl} + {spacing.scale}"
    },
    "3xl": {
      "value": "{spacing.2xl} + {spacing.scale}"
    },
    "4xl": {
      "value": "{spacing.3xl} + {spacing.scale}"
    }
  }
}
```

## Conclusion


