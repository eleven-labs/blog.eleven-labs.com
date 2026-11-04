---
contentType: tutorial-step
tutorial: mastra-ai-rag
slug: worfklow
title: Création de notre Workflow
---

## Présentation de notre Workflow

Avant de pouvoir interroger notre agent, nous allons devoir enrichir notre base de données avec le contenu de notre Blog.

Pour ce faire, nous allons créer un Workflow. Il s'agit simplement d'une succession de fonctions qui vont être exécutées les unes à la suite des autres,
en passant le résultat de la fonction précédente en argument de la fonction suivante, un peu à la manière de middlewares.

Un Workflow s'exécute ponctuellement, selon notre besoin. Par exemple, on pourrait ré-exécuter notre Workflow à chaque fois qu'un nouvel article est publié,
afin de le stocker dans notre base de connaissances.

Avec Mastra, créer un Workflow est très simple. On ouvre le dossier Worfklow, et on utilise la fonction `createWorkflow` mise à notre disposition par le Framework:

```ts
export const embedElevenBlogWorkflow = createWorkflow({
  id: 'embed-eleven-blog-worflow',
  inputSchema: z.object({
    contentType: contentTypeSchema.optional(),
    limit: z.number().optional(),
  }),
  outputSchema: z.string(),
})
  .then(parseElevenBlogStep)
  .then(generateEmbeddings)
  .then(saveEmbeddingsInStore)
  .commit();
```

Voilà comment se présente la création d'un Workflow:
- On lui donne un nom, un ID
- On donne **toujours** un `inputSchema` (arguments entrée), et un `outputSchema` (résultats à la fin de l'exécution du Worflow).
- On ajoute ensuite chaque `steps` de notre Worflow, dans l'ordre dans lequel ils doivent être exécutés.
- On enregistre notre Workflow avec la méthode `commit`.

N'oublions pas de rajouter notre nouveau Workflow dans le fichier `index.ts` à la racine du dossier `src/Mastra`:

```ts
import { embedElevenBlogWorkflow } from './workflows/embed-eleven-blog-workflow';

export const mastra = new Mastra({
  workflows: { embedElevenBlogWorkflow },
  // ...
});
```

Comme on peut le deviner à son nom, et aux **Steps** déjà indiqués dans sa configuration, l'objectif de notre Worflow sera de créer des embeddings pour chaque article de notre Blog.
Pour cela, il commencera par *parser* le repo Github de notre Blog, pour en récupérer tous les articles sous format Mardown.
Puis, nous générerons des embeddings grâce à un **embedding model**. Enfin, nous sauvegardons ces embeddings dans notre store grâce à Turso.

## Parser le Blog d'Eleven

Je ne m'étendrai pas sur la partie *parsing* en tant que tel car ce n'est pas l'objectif ici.
Mais il y a tout de même une étape cruciale qui se déroule dans cette Step, le **chunking** de Document.

Tout d'abord, on va créer un `Tool` pour notre besoin. L'avantage, c'est que depuis le Mastra Playground, on pourra exécuter uniquement ce `Tool` en isolation du reste du Workflow.
Rendez-vous donc dans `src/mastra/tools/parse-eleven-blog-tool.ts`.

```ts
export const parseElevenBlog = createTool({
  id: 'parse-eleven-blog',
  description: 'Parse and chunk content from Eleven Labs blog',
  inputSchema: z.object({
    contentType: contentTypeSchema.optional(),
    limit: z.number().optional(),
  }),
  outputSchema: parseElevenBlogOutputSchema,
  execute: async ({ mastra, context }) => {
    const logger = mastra?.getLogger();
    const { contentType, limit } = context;
    // ...
 },
});
```

Vous remarquerez que l'`inputSchema` est le même que celui de notre Workflow. C'est normal, c'est la première Step. Et en `outputSchema` par contre, on trouve des tableaux de chaînes de caractère, accompagnées de Metadata.
Une option `execute` fait son apparition : c'est la fonction qui sera appelée quand ce `Tool` sera exécuté.
Mastra injecte automatiquement plusieurs types d'arguments que l'on peut récupérer ici, découvrons-en deux.
Le premier, le principal, le `context`. À l'intérieur se trouvent les arguments définis dans notre `inputSchema`.
Le second, le `mastra`, est l'instance de Mastra, depuis laquelle on peut obtenir de nombreux services, comme le Logger.

À partir de là, vous constaterez dans le code que nous utilisons un `githubClient` pour récupérer la liste des contenus du blog.
Le code de ce *client* est dispoible dans la partie `lib` si cela vous intéresse.

Une fois tout récupéré, on va effectuer un **chunking** de ces contenus :

```ts
const chunkGroups = await Promise.all(
  blogItems.map(async (blogItem) => {
    const markdownDocument = MDocument.fromMarkdown(blogItem.content, {
      source: blogItem.metaData.url,
      slug: blogItem.metaData.slug,
      contentType: blogItem.metaData.contentType,
      lang: blogItem.metaData.lang,
      date: blogItem.metaData.date,
      authors: blogItem.metaData.authors,
    });

    return markdownDocument.chunk({
      strategy: 'markdown',
      maxSize: CHUNK_SIZE,
      overlap: OVERLAP,
    });
  })
);
```

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
Pourquoi faire cela ? Qu'est-ce que le <i>chunking</i> ?
</div>

C'est très simple. Le *chunking* permet de diviser un Document en plusieurs Documents, en fonction de la taille maximale que l'on souhaite.
Ce serait contre-productif de stocker un Document qui est trop gros dans notre store. Rappelez-vous que quand nous allons *vectoriser* nos Documents, nous allons vouloir sauvegarder l'*idée*, le *sens* sémantique d'un texte.
Un article entier comporte trop d'idées différentes, on serait beaucoup moins précis, alors on va préférer stocker des *paragraphhes* de texte, plus petits, et avec un *sens* bien plus défini.
C'est ça, le fait de *chunker* nos Documents.

Mastra AI nous fournit encore une fois une API pour faire cela, via les fonctions:
- `MDocument.fromMarkdown(content, { metadata })`
- `markdownDocument.chunk({ strategy, maxSize, overlap })`

La première permet de récupérer un Document Markdown (ici, un article de notre Blog en entier). On ajoute des *Metadata* à ce contenu afin de pouvoir toujours l'identifier, même après son chunking.
Ainsi, on ajoutera la source de la donnée (url de l'article), le slug, l'auteur, la date de l'article...
Toutes ces Metadata seront sauvegardées sur **chacun** de nos *chunks*. Cela permet de pouvoir toujours rattacher un morceau de texte à son contexte original, malgré le fait qu'il ait été coupé et sorti de son contexte.

Les arguments `maxSize` et `overlap`, permettent respectivement de définir la taille de chaque chunk, et de définir combien de caractère en commun se trouvera au début et à la fin de chaque *chunk* (overlap).

Ouf, voilà, on a récupéré notre contenu, et on l'a *chunker* en de plus petites partie pour affiner le contexte de chaque morceau, tout en gardant son contexte original via les Metadata.

Dernière chose, notre Workflow ne comprend que les objets de type `Step`, et c'est pourquoi on va transformer notre `Tool` en `Step` pour l'utiliser dans le Workflow:

```ts
const parseElevenBlogStep = createStep(parseElevenBlog);
```

C'est tout !

Maintenant, on va pouvoir passer à la partie *embedding* de nos Documents !

## Embeddings

Pour cette partie, on ne va pas avoir à faire grand-chose, car en réalité c'est notre modèle d'*embedding* qui va faire le travail.
On commence par créer un `Step`, et cette fois en `inputSchema`, on doit prendre en paramètre l'équivalent du `outputSchema` du `Step` précédent.

Donc :
```ts
export const generateEmbeddings = createStep({
  id: 'generate-embeddings',
  description: 'Create embeddings from a text content',
  inputSchema: z.array(z.array(chunkSchema)).describe('List of chunked documents to be embed'),
  outputSchema: embeddingsSchema,
  execute: async ({ inputData, mastra }) => {
    const logger = mastra.getLogger();
    const chunkedDocuments = inputData;
    // ...
  },
});
```

Puis, pour chacun de nos documents, on va appeler notre *model*  :

```ts
import { embedDocuments } from '../lib/xenova-embeddings';
// ...
const vectors = await embedDocuments(
  chunks.map((chunk) => chunk.text),
  {
    model: MODEL_EMBEDDING,
    pooling: 'mean',
    normalize: true,
  }
);
```

L'option `MODEL` correspond au type de modèle d'embedding que l'on souhaite utiliser. Ici, il s'agit du modèle `Xenova/all-MiniLM-L6-v2` que nous faisons exécutons en local directement.

L'option de `pooling` correspond à la méthode d'aggrégation des tokens en vecteurs. Ce qu'il faut retenir, c'est que mettre une valeur à `none` permet d'obtenir un embedding par **token**.
C'est très fin, et utile si on souhaite manipuler les embeddings soi-même, mais on perd du context et du sens de notre texte.
La valeur `mean` fait une moyenne de tous les embeddings de tokens, et permet donc une meilleure recherche dans le cas du **RAG** où on recherche par similarité de texte.

Enfin, la dernière option permet de normaliser les vecteurs entre eux, ce qui est crucial pour pouvoir les comparer les uns avec les autres ensuite.

On a plus qu'à construire notre collection d'embeddings, par exemple comme ceci :

```ts
const embeddings: z.infer<typeof embeddingsSchema> = [];
const dimension = vectors.length > 0 ? vectors[0].length : undefined;
const metadata = chunks.map((chunk) => ({ ...chunk.metadata, chunkText: chunk.text }));

embeddings.push({ vectors, dimension, metadata });
```

Trois informations ici :
- `vectors` : Il s'agit simplement des vecteurs que notre *model* vient de nous calculer
- `dimension` : Il s'agit de la dimension des vecteurs. Il nous faut absolument récupérer cette information car elle nous servira lors du stockage des vecteurs en base de données.
- `metadata` : On récupère les Metadata créées précédemment dans les *chunks*, et on y ajoute le **contenu original textuel** du vecteur.

<div  class="admonition question"  markdown="1"><p  class="admonition-title">Question</p>
Pourquoi rajouter le texte du Document original dans les Metadata, alors qu'on s'est donné de la peine pour <i>chunker</i> et vectoriser ce dernier ?
</div>

En fait, les vecteurs nous serviront plus tard à faire du calcul de **similarité sémantique** pour retourner le vecteur le plus pertinent selon un contexte donné.
Mais une fois les vecteurs les plus intéressants récupérés, il faudra bien fournir à notre LLM favori ce qu'il est capable de comprendre : du texte ! Et c'est en se servant de ce texte comme base de connaissance qu'il pourra renvoyer une réponse pertinente à l'utilisateur.

Top ! Il ne nous reste plus qu'à stocker nos embeddings dans notre store !

## Le Store

Rappelez-vous, nous avons décidé d'utiliser une base de données LibSQL (un fork de SQLite) pour stocker nos embeddings. Et plus particulièrement Turso, pour stocker cette base sur le cloud et pouvoir interagir avec.
Il vous faut donc vous créer une nouvelle base de données sur Turso, et récupérer un token ainsi que l'URL de connexion pour l'ajouter dans vos variables d'environnement.

Bien, une fois cela fait, on commence de la même manière que précédemment, on crée une nouvelle `Step`, et on ajoute en `inputSchema` ce que nous a retourné la `Step` précédente :

```ts
import { DATABASE_VECTOR_INDEX } from '../constants/vector-config';
import { createIndex } from '../lib/libsql';
import { embeddingsSchema } from '../schemas/embeddings-schema';
// ...

export const saveEmbeddingsInStore = createStep({
  id: 'save-embeddings-in-store',
  description: 'Save the given embedded vectors in store',
  inputSchema: embeddingsSchema,
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ inputData: embeddings, mastra }) => {
    const logger = mastra.getLogger();
    const indexDimension = embeddings[0].dimension;

    logger.info(`INDEX: ${DATABASE_VECTOR_INDEX}`);

    await createIndex(DATABASE_VECTOR_INDEX, indexDimension ?? 0);
    // ...
  },
});
```

On commence par créer un nouvel index dans notre Store. C'est à ce moment-là que l'on a besoin de fournir la dimension de l'index a créé à notre base de données.
Ici, notre méthode `createIndex` va supprimer l'éventuel index existant pour en créer un nouveau. L'objectif est de recréer tous les embeddings à chaque exécution du Workflow, pour garder les vecteurs à jour (nouvel article, mise à jour d'un article existant, etc.).

On aurait pu faire plus "propre", mais Mastra étant un Framework encore très jeune, de nombreuses APIs ne sont pas développées ou disposes de fonctionnalités insuffisantes, ce qui nous oblige parfois à coder des solutions *custom* pour s'en sortir.

Il n'empêche que ça fonctionne bien comme ça, et il ne nous reste plus qu'à enregistrer nos *embeddings* :

```ts
for (const embedding of embeddings) {
  const { vectors, metadata } = embedding;
  await saveEmbeddings(DATABASE_VECTOR_INDEX, vectors, metadata);
}
```

On stocke bien chaque *embedding* avec ses metadata, et le tour est joué !

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Question</p>
Pour ma part, cette partie de sauvegarde en base m'a pris plusieurs minutes d'attente pour une soixantaine d'articles de Blog.
C'est certainement l'inconvénient de travailler avec la version gratuite de tous ces outils, mais au moins au final, ça fonctionne !
</div>

## Conclusion

Vous venez de faire toute une partie du *RAG*, la partie *embedding* de notre base de connaissances sous forme de données vectorisées !

Il ne nous manque plus que la partie *retrieval* du RAG, que nous allons faire dans la prochaine partie du tutoriel.
