# Rédiger un contenu en MDX

Les articles (`_articles`) et les tutoriels (`_tutorials`, fichier `index` et étapes) peuvent être écrits en [MDX](https://mdxjs.com/) : il suffit de donner l'extension `.mdx` au fichier au lieu de `.md`. Le MDX est du markdown dans lequel on peut utiliser des composants React.

Les fichiers `.md` existants restent rendus comme avant, il n'est pas nécessaire de les convertir.

## En-tête

L'en-tête (frontmatter) est identique à celui d'un fichier `.md` et il est validé de la même manière.

## Composants disponibles

Seuls les composants suivants sont utilisables, sans import. Tout autre composant fait échouer la validation.

### `Reminder`

Un encadré de rappel. `variant` accepte `note`, `summary`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example` ou `quote`.

```mdx
<Reminder variant="tip" title="Astuce">

Le contenu est du **markdown** : laissez une ligne vide après la balise ouvrante et avant la balise fermante.

</Reminder>
```

### `Blockquote`

Une citation mise en forme.

```mdx
<Blockquote>La simplicité est la sophistication suprême.</Blockquote>
```

### `SyntaxHighlighter`

Un bloc de code coloré. Un bloc de code markdown (` ```js `) donne le même résultat et reste à privilégier.

```mdx
<SyntaxHighlighter language="js" children={`const answer = 42;`} />
```

### `Figure`

Une image accompagnée de sa légende.

```mdx
<Figure src="{BASE_URL}/imgs/articles/2026-09-24-mon-article/schema.png" alt="Schéma de l'architecture" caption="Source : Eleven Labs" />
```

La syntaxe markdown, une image suivie d'une ligne `Figure: légende`, reste disponible.

### `Mermaid`

Un diagramme [Mermaid](https://mermaid.js.org/). Un bloc de code ` ```mermaid ` donne le même résultat.

```mdx
<Mermaid chart={`graph TD
  A[Client] --> B[API]`} />
```

## Différences avec le markdown

- `<`, `>`, `{` et `}` ont une signification en MDX : dans le texte, échappez-les (`\{`, `&lt;`) ou placez-les dans du code.
- Le HTML est interprété comme du JSX : utilisez `className` au lieu de `class` et fermez les balises vides (`<br />`).
- Les admonitions en HTML (`<div class="admonition tip" markdown="1">`) ne sont pas prises en charge : utilisez le composant `Reminder`.
- Les commentaires s'écrivent `{/* commentaire */}` au lieu de `<!-- commentaire -->`.

## Validation

`pnpm validate-markdown`, lancé par la CI, compile chaque fichier `.mdx` en plus des vérifications déjà faites sur le markdown. Une syntaxe invalide ou un composant non autorisé est signalé avec la ligne et la colonne concernées.

## Ajouter un composant

Les composants autorisés sont déclarés dans `src/helpers/mdxComponents.tsx`. Le contenu est rendu en HTML statique : un composant ne doit pas dépendre d'un état ou d'événements côté client.
