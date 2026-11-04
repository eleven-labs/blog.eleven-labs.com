---
contentType: tutorial-step
tutorial: mastra-ai-rag
slug: retrieval-tool
title: Création d'un Tool de Retrieval
---

## Les Tools

On en a déjà parlé plus tôt, mais les Tools sont un concept très important.
Un Tool n'est rien de plus qu'une fonction, qu'un **modèle d'IA est capable** d'appeler pour exécuter une tâche, et se servir du résultat pour formuler une réponse.

Les Tools sont utilisés en particulier par les Agents IA, qui sont capables prendre l'initiative de faire appel à ces fonctions, ou non, en fonction de la requête des utilisateurs.

Mais ce n'est pas magique ! Pour que nos LLMs soient capables d'utiliser des Tools, il faut leur expliquer comment faire.
Et c'est pour cela que l'on utilise la librairie de validation `zod` depuis le début de ce tutoriel, si vous avez bien fait attention.

Dans chacun de nos `inputSchema` et `outputSchema`, on effectue une validation avec `zod`. Mais remarquez que ces schémas de validation contiennent souvent un détail supplémentaire : un appel à la fonction `describe()`.

Allons voir dans le dossier `src/Mastra/schemas` où se trouvent des schémas redondants utilisés à plusieurs endroits. Sur beaucoup de ces schémas, la méthode `describe` est appelée pour *décrire* chaque élément du schéma.
Et ce n'est pas pour faire joli, loin de là ! Il s'agit d'informations très précieuses pour les LLMs, qui vont s'en abreuver pour savoir quel type de données ils doivent passer en argument lors d'un appel à un `Tool`.

Prenons un exemple concret, créons notre nouveau `Tool` `embedQueryTool`. Ce `Tool` doit être appelé lorsqu'un utilisateur effectue une recherche sur notre Blog.
Le but sera de créer un *embedding* de cette requête, pour pouvoir la comparer aux *embeddings* existants en base de données de notre Blog par similarité sémantique, puis renvoyer un résultat textuel compréhensible par notre LLM.

Créons le squelette de ce `Tool` :

```ts
export const embedQueryTool = createTool({
  id: 'embed-query',
  description:
    'Generate a single query embedding using @xenova/transformers with configurable pooling, normalization, and quantization.',
  inputSchema: embeddingOptionsSchema.extend({
    index: z.string().describe('The database vector index'),
    text: z.string().min(1).describe('Query text to embed'),
  }),
  outputSchema: z.object({
    response: z.string(),
  }),
  execute: async ({ context }) => {}});
```

En plus de la description du `Tool`, on fournit le plus de contexte possible à notre LLM via `zod`. Notre `inputSchema` *extend* de `embeddingOptionsSchema`, dont voici la définition :

```ts
export const embeddingOptionsSchema = z.object({
  model: z.string().default('Xenova/all-MiniLM-L6-v2').optional().describe('Embedding model to use'),
  pooling: poolingEnum.default('mean').optional().describe('Pooling strategy'),
  normalize: z.boolean().default(true).optional().describe('Normalize the vector'),
  quantize: z.boolean().optional().describe('Enable quantization'),
  precision: precisionEnum.optional().describe('Quantization precision'),
});
```

Pareil, on ajoute des `describe` partout pour indiquer au LLM *comment* utiliser ce `Tool`.

Maintenant, on peut implémenter la fonction `execute` de notre `Tool` :

```ts
export const embedQueryTool = createTool({
  // ...
  execute: async ({ context }) => {
    const {
      text,
      index,
      model = 'Xenova/all-MiniLM-L6-v2',
      pooling = 'mean',
      normalize = true,
      quantize, precision,
    } = context;

    const vector = await embedQuery(text, {
      model,
      pooling,
      normalize,
      quantize,
      precision,
    });
  },
});
```

On commence par créer un *embedding* de la query. Rien de plus simple, on fait appel à notre modèle qui s'en charge.
Puis, on fait appel à notre Store pour qu'il calcule et nous retourne les *embeddings* du blog les plus proches de la query.

```ts
const embeddings = await getEmbeddings(index, vector);
const response = embeddings
  .map(({ metadata }) => {
    return Object.entries(metadata ?? {}).map(([key, value]) => `**${key}**: ${value}`);
  })
  .join('\n-------\n');
```

Pareil, le store se charge de faire ce calcul pour nous.

Et le travail qu'il nous reste à faire, c'est de formatter la réponse pour qu'elle soit compréhensible par notre LLM, et qu'il s'en serve comme d'un contexte supplémentaire pour répondre à la question poseée.
Pour cela, on fait un `map` sur les résultats pour obtenir ce genre de chose :

```markdown
**Source**: filename or url
author: John Doe
Date: 01/01/1970
**Chunk content**: Text
-------
*Source**: filename or url
author: John Doe
Date: 01/01/1970
**Chunk content**: Text
```

Ainsi pour chaque *chunk* de texte, notre LLM sera en capacité de savoir de quel article il provient, et donc de le proposer à l'utilisateur.

## Cache

Un élément important qui n'a pas du tout été pris en compte dans ce tutoriel, c'est le cache.
Durant cette partie de *retrieval* de la donnée, il y a 3 moments distincts où on peut penser à utiliser le cache :
- Lors de l'*embedding* de la query. On pourrait stocker en cache le texte de la query, et son embedding correspondant, pour ne pas avoir à le recalculer en cas de recherche similaire.
- Lors du *retrieval* des résultats. En complément du cache de la query, on pourrait mettre en cache les résultats correspondants déjà calculés, et les servir directement à l'utilisateur.
- Lors de la génération de la réponse par le LLM. Passer autant de contexte au LLM pour qu'il nous fournisse une réponse peut être coûteux. On pourrait donc aussi cacher des réponses déjà faites pour une même query.

Voilà ce qui clôture le chapitre sur les *Tools*. Il ne nous reste plus qu'à créer notre Blog Agent qui se chargera de l'utiliser.
