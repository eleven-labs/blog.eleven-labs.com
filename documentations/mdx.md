# Rédiger un contenu en MDX

Les articles (`_articles`), les tutoriels (`_tutorials`, fichier `index` et étapes) et les fiches auteur (`_authors`) s'écrivent en [MDX](https://mdxjs.com/), avec l'extension `.mdx`. Le MDX est du markdown dans lequel on peut utiliser des composants React. Un fichier `.md` est refusé par la validation.

## En-tête

L'en-tête (frontmatter) s'écrit en YAML, entre deux lignes `---`, au début du fichier.

## Le markdown d'abord

Tout ce que le markdown sait rendre s'écrit en markdown. N'utilisez un composant que lorsque le markdown n'a pas d'équivalent, et n'écrivez pas de HTML : la validation le signale par un avertissement.

### Citation

```md
> La simplicité est la sophistication suprême.
```

### Bloc de code coloré

````md
```ts
const answer: number = 42;
```
````

### Diagramme Mermaid

Un diagramme [Mermaid](https://mermaid.js.org/) s'écrit dans un bloc de code `mermaid` :

````md
```mermaid
graph TD
  A[Client] --> B[API]
```
````

## Composants disponibles

Seuls les composants suivants sont utilisables, sans import. Tout autre composant, y compris `Blockquote`, `SyntaxHighlighter` ou `Mermaid`, fait échouer la validation : utilisez la syntaxe markdown ci-dessus.

### `Reminder`

Un encadré de rappel. `variant` accepte `note`, `summary`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example` ou `quote`.

```mdx
<Reminder variant="tip" title="Astuce">

Le contenu est du **markdown** : laissez une ligne vide après la balise ouvrante et avant la balise fermante.

</Reminder>
```

### `Figure`

Une image et sa légende, regroupées pour être plus simples à écrire et à relire.

La légende s'écrit entre les balises, en markdown :

```mdx
<Figure src="{BASE_URL}/imgs/articles/2026-09-24-mon-article/schema.png" alt="Schéma de l'architecture">*Source : [Eleven Labs](https://eleven-labs.com/)*</Figure>
```

Une légende sans mise en forme peut aussi passer par `caption` :

```mdx
<Figure src="{BASE_URL}/imgs/articles/2026-09-24-mon-article/schema.png" alt="Schéma de l'architecture" caption="Source : Eleven Labs" />
```

Comme pour une image markdown, `alt` décrit l'image, et les paramètres `maxWidth`, `maxHeight`, `width` et `height` de l'URL la dimensionnent (`schema.png?maxWidth=400`).

### `Kbd`

Une touche du clavier, pour décrire un raccourci.

```mdx
Videz le cache avec <Kbd>Ctrl</Kbd> + <Kbd>F5</Kbd>.
```

### `Tweet`

Un tweet intégré. La page affiche d'abord une carte avec l'auteur, le texte du tweet, écrit en markdown entre les balises, et la date, qui renvoie vers le tweet. Le script de Twitter la remplace ensuite par le tweet, avec ses images et ses réactions. La carte réserve la hauteur estimée du tweet, un peu plus haute quand il contient une image (un lien `pic.twitter.com`), pour que la page ne se décale presque pas à ce moment-là.

```mdx
<Tweet url="https://twitter.com/afup/status/1578341478518362112" author="AFUP (@afup)" date="7 octobre 2022">

Et vous, il est comment votre vendredi ? [pic.twitter.com/SFMqKjIGfb](https://t.co/SFMqKjIGfb)

</Tweet>
```

Le code d'intégration proposé par Twitter (`<blockquote class="twitter-tweet">` suivi d'un `<script>`) n'est pas à copier, il en fournit les valeurs : `url` est le lien vers le tweet, `author` le texte qui le précède (`Nom (@compte)`) et `date` le texte de ce lien.

### `YouTube`

Une vidéo YouTube, sur toute la largeur de l'article. `id` est l'identifiant de la vidéo (`https://www.youtube.com/watch?v=<id>`) et `title` son titre, lu par les lecteurs d'écran.

```mdx
<YouTube id="9Cfxm7cikMY" title="7 Ways AMP Makes Your Pages Fast" />
```

La vidéo n'est chargée qu'à l'approche de sa position dans la page, depuis `youtube-nocookie.com`, qui ne dépose pas de cookie tant qu'elle n'est pas lancée.

### `Video`

Une vidéo hébergée par le blog, dans `_assets` (WebM, MP4 ou Ogg). `width` et `height`, les dimensions de la vidéo, réservent sa place avant son chargement. Une vidéo parlée a des sous-titres, au format WebVTT, dans `captions`.

```mdx
<Video src="{BASE_URL}/imgs/articles/2026-09-24-mon-article/demo.webm" width={1920} height={1080} />
```

## Particularités du MDX

- `<` et `{` ouvrent une balise ou une expression : dans le texte, échappez-les (`\<`, `\{`) ou placez-les dans du code.
- Le HTML est à éviter. Lorsqu'il reste indispensable, pour intégrer un tweet ou une vidéo par exemple, il s'écrit comme en HTML (`class`, `style="…"`) et il est rendu comme le markdown, mais toute balise doit être fermée : `<br />`, `<img />`, `<p>…</p>`.
- Un retour à la ligne se fait par une ligne vide, qui commence un nouveau paragraphe, et non par `<br />`.
- Une balise de bloc (`<div>`, `<blockquote>`, `<table>`…) qui s'étend sur plusieurs lignes doit être seule sur sa ligne d'ouverture et sur sa ligne de fermeture.
- Les commentaires s'écrivent `{/* commentaire */}` au lieu de `<!-- commentaire -->`.
- Il n'y a ni lien automatique entre chevrons (`<https://…>`) ni code indenté : écrivez `[https://…](https://…)` et utilisez un bloc de code entre ` ``` `.

## Validation

`pnpm validate-markdown`, lancé par la CI, valide l'en-tête, les titres et les images, puis compile chaque fichier `.mdx`. Une syntaxe invalide ou un composant non autorisé fait échouer la validation, avec la ligne et la colonne concernées.

Sans faire échouer la validation, un avertissement signale chaque image sans texte alternatif et chaque élément HTML, avec sa ligne. Dans une pull request, il apparaît en annotation sur le fichier.

## Ajouter un composant

Les composants autorisés sont déclarés dans `src/helpers/mdxComponents.tsx`. N'y ajoutez un composant que si le markdown n'a pas d'équivalent. Le contenu est rendu en HTML statique : un composant ne doit pas dépendre d'un état ou d'événements côté client.
