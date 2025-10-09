---
contentType: tutorial-step
tutorial: mastra-ai-rag
slug: presentation-des-outils
title: Présentation des outils
---

## OpenRouter

Intégrer des modèles d'IA (LLMs, embeddings, ...) à notre application peut-être compliqué car chacun de ces modèles peut se configurer de manière différente, et cela devient donc compliquer si l'on veut en changer ou simplement en tester plusieurs pour faire un benchmark du meilleur modèle pour nos besoins.

C'est là qu'intervient la librairie [**OpenRouter**](https://openrouter.ai/). Elle nous permet de standardiser l'intégration de nos modèles d'IA à nos applications, quelque soit le provider de ces modèles.

Voici un exemple. On commence par créer une instance de notre provider OpenRouter:

```typescript
export const openRouterAiSdkProvider = createOpenRouter({
  apiKey: OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': OPENROUTER_APP_URL,
    'X-Title': OPENROUTER_APP_NAME,
  },
});
```

Puis, quand Mastra AI nous demandera de fournir le modèle que doit utiliser notre agent, on pourra simplement faire:

```typescript
export const agent = new Agent({
  name: 'Some AI Agent',
  instructions: `Agent prompt ...`,
  model: openRouterAiSdkProvider(MY_AI_MODEL),
});
```

Et il ne reste plus qu'a créé notre constante `MY_AI_MODEL` et de la peupler avec notre modèle préféré, et on pourra le changer à volonté ! OpenRouter se chargera de se connecter au modèle spécifier, et s'il est payant, c'est votre compte OpenRouter qui sera facturé, pas besoin de se créer un compte chez le provider de chacun des modèles que vous utiliser.

Et pour retrouver tous les modèles disponibles, vous pouvez vous rendre [ici](https://openrouter.ai/models) !

## Turso

Turso est un provider de base donnée basé sur un fork de SQLite, nommé **libSQL**. Il nous permet notamment 2 choses:

- Disposer gratuitement et en un clic d'une base de donnée distribuée dans le cloud, qui suffira largement à nos besoins
- Turso permet **nativement**  de gérer des données vectorielles, et de faire de la recherche par similarité

Les bases de données relationnelles ne sont pas faites pour stocker des vecteurs et y faire des calculs de proximité.
Il existe des solutions de stockage beaucoup plus adaptées telles que [Chroma](https://www.trychroma.com/), beaucoup plus adaptées pour des cas d'usages liés à l'IA.

Mais il existe des extensions qui permettent à des bases de données relationnelles d'être compatibles avec les vecteur, bien que les performances soient souvent moindres qu'avec des solutions dédiées. Mais au moins, on reste en terrain connu (et on peut utiliser nos requêtes SQL).

Il existe notamment une extension open-source pour PostgreSQL, [pgvector](https://github.com/pgvector/pgvector).

Mais de notre côté, nous utiliserons donc Turso pour ça facilité d'utilisation.

## Langfuse

On en parlera plus longuement dans notre chapitre sur l'observabilité, mais il est important et très utile de pouvoir tracer toutes les opérations que nos modèles vont exécuter (décision des Agents, outils exécutés, tokens utilisés, latence des modèles, prompts et réponses des LLMs, ...).

Mastra AI va venir logger toutes ces informations, et un outil comme Langfuse va récupérer ces traces et les afficher dans une interface claire, et facile à manipuler.

On pourra suivre tout le cycle de vie d'une requête à nos Agents, et en tirer de nombreuses informations très utiles pour corriger et adapter la configuration de nos modèles. Par exemple, on saura le temps de réponse à chaque étape, les paramètres utilisés et les réponses obtenues ce qui pourra nous donner des indices sur la pertinences de ces paramètres et nous permttre de les ajuster, etc...

Ce suivi nous sera très précieux lorsqu'on voudra ajuster certains paramètres pour le calcul de la similarité syntaxique par exemple !

## Xenova Embeddings

Plus tôt, je vous parlais de modèles d'embeddings pour pouvoir vectoriser nos documents et les stocker en base de données. Il s'agit de calculs souvent coûteux (bien que cela dépend de la quantité de texte à vectoriser), et de nombreux modèles sont payants. Pour garder nos sous en sécurité, nous allons donc utiliser un modèle d'embeddings en *local*. Le calcul de nos vecteurs sera plus long (de quelques dizaines de secondes à plusieurs minutes), mais au moins ce sera gratuit !

Pour cela, nous utiliserons un [petit modèle trouvé sur Hugging Face](https://huggingface.co/Xenova/all-MiniLM-L6-v2), développé par Xenova.

## Et.. Votre LLM favori

Enfin, pour ce qui est du modèle LLM utilisé par votre agent, vous pourrez choisir celui que vous voulez, à un détail près... Il doit être compatible avec l'utilisation de **Tools**.

Vous pouvez rechercher sur OpenRouter en filtrant par LLMs surpportant cette option, et choisir un modèle gratuit, ou payant et plus puissant selon vos préférences.

La compatibilité avec les Tools est obligatoire car c'est grâce à des Tools que notre agent pourra effectuer des actions, et notamment vectoriser la requête de l'utilisateur et effectuer une recherche par similarité sémantique.

Avec tout ce beau monde, nous somme parés à affronter notre objectif !
