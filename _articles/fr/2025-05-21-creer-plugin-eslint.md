---
contentType: article
lang: fr
date: 2025-05-21
slug: creer-plugin-eslint
title: >-
  ESLint Plugin : Créer une règle personnalisée
excerpt: >-
  Découvrez comment créer un plugin ESLint en TypeScript avec la nouvelle configuration "flat config" pour limiter l'utilisation des styles inline dans les composants React, et publiez-le sur npm.
cover:
  alt: Description
  path: /imgs/articles/2025-05-21-creer-plugin-eslint/cover.png
  position: top
authors:
  - fpasquet
---

Suite à notre [précédent article sur les Arbres Syntaxiques Abstraits (AST)]({BASE_URL}/fr/comprendre-et-exploiter-les-arbres-syntaxiques-abstraits), nous allons maintenant mettre en pratique ces connaissances pour créer un plugin ESLint personnalisé. Dans cet article, nous verrons comment développer une règle qui décourage l'utilisation de la propriété `style` dans les composants React, en utilisant TypeScript et la nouvelle configuration "flat config" d'ESLint.

<div class="admonition note" markdown="1"><p class="admonition-title">Code source</p>

Le code source complet de ce projet est disponible sur [GitHub](https://github.com/fpasquet/eslint-plugin-react-props-restrictions). Vous y trouverez tous les fichiers mentionnés dans cet article ainsi que des exemples d'utilisation supplémentaires.
</div>

## Pourquoi créer un plugin ESLint personnalisé ?

Les règles ESLint personnalisées permettent d'améliorer la qualité du code en imposant des conventions spécifiques à votre équipe ou projet. Dans notre cas, nous allons créer une règle qui interdit l'utilisation des styles inline dans les composants React. Cette décision est une convention propre à notre équipe ou notre projet, afin de favoriser des approches que nous jugeons plus adaptées, comme l'utilisation de classes utilitaires ou de CSS Modules.

<div class="admonition info" markdown="1"><p class="admonition-title">À retenir</p>

L'usage des styles inline en React peut présenter certains inconvénients (maintenance, performances, cohérence visuelle). Néanmoins, le choix de les interdire via une règle ESLint relève d’une convention propre à notre contexte. Ce n’est ni une règle universelle, ni une bonne pratique applicable à tous les projets.
</div>

## Préparation du projet

Commençons par mettre en place la structure de notre plugin ESLint en TypeScript. Notre plugin s'appellera `eslint-plugin-react-props-restrictions`.

### Structure du projet

```
eslint-plugin-react-props-restrictions/
├── src/
│   ├── rules/
│   │   └── no-inline-styles.ts      # Notre règle principale
│   │   └── no-inline-styles.test.ts # Tests pour notre règle
│   └── index.ts                     # Point d'entrée du plugin
├── jest.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### Configuration du package.json

Voici la configuration initiale pour notre `package.json` :

```json
{
  "name": "eslint-plugin-react-props-restrictions",
  "version": "1.0.0",
  "description": "ESLint plugin to restrict usage of certain React props",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "prepublishOnly": "npm run build && npm run test"
  },
  "keywords": [
    "eslint",
    "eslintplugin",
    "eslint-plugin",
    "react",
    "props",
    "style"
  ],
  "license": "MIT",
  "devDependencies": {
    "@types/eslint": "^9.6.0",
    "@types/estree-jsx": "^1.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^22.0.0",
    "@typescript-eslint/parser": "^8.31.0",
    "eslint": "^9.25.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.3.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.8.0"
  },
  "peerDependencies": {
    "eslint": ">=9.0.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

### Configuration TypeScript

Créons notre fichier `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "nodenext",
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Configuration Jest

Pour les tests unitaires, créons un fichier `jest.config.ts` qui configure Jest pour fonctionner avec TypeScript :

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', 'src/index.ts'],
  coverageReporters: ['text', 'lcov'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};

export default config;
```

## Implémentation de la règle ESLint

Maintenant, plongeons dans le cœur de notre sujet : la création d'une règle ESLint qui interdit l'utilisation de la propriété `style` dans les composants React.

### Comprendre l'AST pour les attributs JSX

Pour identifier les attributs `style` dans les composants React, nous devons d'abord comprendre comment ces attributs sont représentés dans l'AST. En utilisant [AST Explorer](https://astexplorer.net/), nous pouvons voir qu'un attribut JSX comme `style={{color: 'red'}}` est représenté par un nœud de type `JSXAttribute` avec un nom `style`.

<div class="admonition tip" markdown="1"><p class="admonition-title">Astuce</p>

Utilisez toujours AST Explorer pour comprendre la structure de l'AST avant d'implémenter une règle ESLint. Cela vous permettra d'identifier précisément les nœuds que vous devez cibler.
</div>

### Implémentation de la règle "no-inline-styles"

Créons notre fichier `src/rules/no-inline-styles.ts` :

```typescript
import { Rule } from 'eslint';
import { JSXAttribute } from 'estree-jsx';

interface NoInlineStylesOptions {
  allowInSpecificComponents?: string[];
}

const noInlineStyles: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow inline styles in React components',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInSpecificComponents: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      noInlineStyle: 'Inline styles are not allowed. Use utility classes or CSS modules instead.'
    }
  },
  create(context): Rule.RuleListener {
    return {
      JSXAttribute(node: Rule.Node) {
        const jsxAttribute = node as JSXAttribute;
        // Check if the attribute is 'style'
        if (jsxAttribute.name.type === 'JSXIdentifier' && jsxAttribute.name.name === 'style') {
          const options: NoInlineStylesOptions = context.options[0] || {};
          const allowedComponents = options.allowInSpecificComponents || [];

          // Find the name of the parent component
          const jsxElement = node.parent;
          let componentName = '';

          if (jsxElement.type === 'JSXOpeningElement' && jsxElement.name.type === 'JSXIdentifier') {
            componentName = jsxElement.name.name;
          }

          // Allow inline styles in specific components defined in the options
          if (componentName && allowedComponents.includes(componentName)) {
            return;
          }

          context.report({
            node,
            messageId: 'noInlineStyle'
          });
        }
      }
    };
  }
};

export default noInlineStyles;
```

Analysons les parties clés de cette règle :

1. **Métadonnées** (`meta`) : Cette section définit les caractéristiques de notre règle.
- **Type** : ESLint propose trois types de règles :
  - `suggestion` : Recommandations liées aux bonnes pratiques ou au style de code, comme dans notre cas.
  - `problem` : Règles identifiant des erreurs ou des bugs potentiels dans le code.
  - `layout` : Règles liées à la mise en forme du code (espaces, indentation, etc.).
- **Docs** : Fournit la documentation de la règle, incluant sa description, sa catégorie, et si elle est recommandée par défaut.
- **Schema** : Définit la structure des options que notre règle peut accepter, validant ainsi la configuration fournie par l'utilisateur.
- **Messages** : Centralise les messages d'erreur pour faciliter la maintenance et la localisation.

2. **Options** : Nous ajoutons l'option `allowInSpecificComponents` qui permet de spécifier des composants pour lesquels les styles inline sont autorisés, utile pour les cas exceptionnels. La configuration du schéma dans `meta` garantit que cette option est correctement validée.

3. **Messages** : Nous définissons un message d'erreur clair avec l'identifiant `noInlineStyle`, qui suggère des alternatives aux styles inline. L'utilisation d'identifiants pour les messages (plutôt que des chaînes directes) facilite la maintenance et permet la réutilisation.

4. **Logique de la règle** : Dans la fonction `create`, nous définissons un sélecteur `JSXAttribute` qui sera appelé pour chaque attribut JSX dans l'AST. Cette fonction agit comme un visiteur dans le pattern Observer, étant appelée chaque fois que le moteur ESLint rencontre un nœud du type spécifié dans l'arbre. Nous vérifions si l'attribut est `style`, puis nous appliquons notre logique conditionnelle.

### Création du point d'entrée du plugin

Créons maintenant le point d'entrée de notre plugin dans `src/index.ts` :

```typescript
import noInlineStyles from './rules/no-inline-styles';

export = {
  rules: {
    'no-inline-styles': noInlineStyles
  },
  configs: {
    recommended: {
      plugins: ['react-props-restrictions'],
      rules: {
        'react-props-restrictions/no-inline-styles': 'error'
      }
    }
  }
};
```

Ce fichier exporte notre règle et définit également une configuration recommandée qui active notre règle par défaut.

## Tests de la règle

Les tests sont essentiels pour s'assurer que notre règle fonctionne correctement. Créons le fichier `src/rules/no-inline-styles.test.ts` :

```typescript
import { RuleTester } from 'eslint';
import Parser from '@typescript-eslint/parser';
import noInlineStyles from './no-inline-styles';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: Parser,
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  },
});

ruleTester.run('no-inline-styles', noInlineStyles, {
  valid: [
    // Valid cases (without style)
    { code: '<div className="my-class">Hello</div>' },
    { code: '<Component prop="value" />' },
    // Valid case with exception
    {
      code: '<SpecialComponent style={{color: "red"}} />',
      options: [{ allowInSpecificComponents: ['SpecialComponent'] }]
    }
  ],
  invalid: [
    {
      code: '<div style={{color: "red"}}>Hello</div>',
      errors: [{ messageId: 'noInlineStyle' }]
    },
    {
      code: '<Component style={{margin: 10}} />',
      errors: [{ messageId: 'noInlineStyle' }]
    }
  ]
});
```

Ces tests vérifient que notre règle :
1. N'émet pas d'erreur pour les composants sans style inline
2. Autorise correctement les exceptions spécifiées
3. Signale correctement les styles inline dans les cas standards

## Intégration avec la nouvelle configuration "flat config" d'ESLint

ESLint 9.0 a introduit une nouvelle configuration "flat" qui simplifie la configuration d'ESLint. Voici comment les utilisateurs peuvent intégrer notre plugin dans cette nouvelle configuration :

```javascript
// eslint.config.js
import reactPropsRestrictions from 'eslint-plugin-react-props-restrictions';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-props-restrictions': reactPropsRestrictions
    },
    rules: {
      'react-props-restrictions/no-inline-styles': ['error', {
        allowInSpecificComponents: ['LegacyComponent']
      }]
    }
  }
];
```

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>

La configuration "flat" d'ESLint offre plusieurs avantages par rapport à l'ancienne configuration :
- Plus de dépendance à la résolution de modules basée sur le nom
- Pas de cascading complexe de configurations
- Support natif pour les importations ES modules
</div>

## Publication sur npm

Pour publier notre plugin sur npm, nous devons d'abord le construire :

```bash
npm run build
```

Ensuite, nous pouvons le publier :

```bash
npm publish
```

<div class="admonition tip" markdown="1"><p class="admonition-title">Astuce</p>

Avant de publier, assurez-vous de bien tester votre plugin dans un projet réel pour vérifier qu'il fonctionne comme prévu.

Idéalement, automatisez cette vérification via un pipeline CI/CD qui test, build et publie votre paquet.
</div>

## Extensions possibles

Notre règle actuelle interdit uniquement l'utilisation de la propriété `style`. Voici quelques extensions possibles :

1. **Étendre à d'autres propriétés** : Interdire d'autres propriétés comme `className` pour forcer l'utilisation de solutions CSS-in-JS.

2. **Ajouter des corrections automatiques** : Implémenter `meta.fixable` pour proposer des corrections automatiques, par exemple en convertissant les styles inline en classes CSS.

3. **Vérifier la complexité des styles** : Permettre des styles inline simples mais interdire les styles complexes qui devraient être externalisés.

4. **Vérifier les valeurs des styles** : Interdire certaines valeurs de style spécifiques qui ne respectent pas la charte graphique du projet.

## Exemple d'utilisation dans un projet réel

Voici un exemple de code qui déclencherait notre règle :

```jsx
// ❌ Non conforme - utilise style inline
function UserCard({ user }) {
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h2 style={{ color: 'blue' }}>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ Conforme - utilise CSS modules
import styles from './UserCard.module.css';

function UserCard({ user }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## Le fonctionnement interne de la règle

Pour mieux comprendre comment notre règle fonctionne, analysons les étapes que traverse le code :

1. **Parsing** : ESLint parse le code source en AST en utilisant le parser configuré.

2. **Sélection des nœuds** : Notre règle utilise le sélecteur `JSXAttribute` pour examiner chaque attribut JSX dans l'AST.

3. **Filtrage** : Nous vérifions si l'attribut est `style` en examinant la propriété `name.name` du nœud.

4. **Contexte** : Nous déterminons le composant parent pour appliquer des exceptions si nécessaire.

5. **Rapport** : Si l'attribut est `style` et qu'aucune exception ne s'applique, nous signalons une erreur.

<div class="admonition info" markdown="1"><p class="admonition-title">À retenir</p>

Le AST nous permet d'analyser le code avec précision, en identifiant exactement les patterns que nous cherchons à interdire, sans avoir à recourir à des expressions régulières ou à d'autres méthodes moins fiables.
</div>

## Conclusion

Dans cet article, nous avons vu comment créer un plugin ESLint en TypeScript qui utilise la nouvelle configuration "flat config". Notre règle "no-inline-styles" aide à maintenir une meilleure séparation des préoccupations en interdisant les styles inline dans les composants React.

Les règles ESLint personnalisées sont un excellent moyen d'appliquer des conventions de codage spécifiques à votre équipe ou projet. En combinant la puissance des AST avec la flexibilité de TypeScript, nous pouvons créer des outils robustes qui améliorent la qualité du code.

<div class="admonition tip" markdown="1"><p class="admonition-title">Astuce</p>

N'hésitez pas à créer vos propres règles ESLint pour répondre aux besoins spécifiques de votre équipe. Les règles personnalisées peuvent grandement améliorer la maintenabilité et la cohérence du code.
</div>

Dans notre **prochain article**, nous explorerons comment créer un codemod personnalisé pour automatiser les migrations de code, en utilisant à nouveau la puissance des AST.

## Ressources supplémentaires

- [Documentation officielle ESLint sur la création de règles](https://eslint.org/docs/developer-guide/working-with-rules)
- [Documentation sur la nouvelle configuration "flat config"](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [TypeScript ESLint](https://typescript-eslint.io/) - Documentation sur l'intégration de TypeScript avec ESLint
