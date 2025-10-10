---
contentType: tutorial-step
tutorial: mastra-ai-rag
slug: setup
title: Setup de notre application Mastra AI
---

## Installation du projet

J'ai créé un [repo Github](https://github.com/ArthurJCQ/mastra-sandbox) avec le projet dans son entiereté, que vous pourrez aller consulter au fur et à mesure que ce tutoriel avance.
Si vous souhaitez développer en parallèle votre propre version de ce projet, n'hésitez pas à en créer un nouveau ou à forker le mien pour partir sur de bonnes bases.

Avant de pouvoir tout installer, il vous faudra récupérer plusieurs clés d'API:
- OpenRouter
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_APP_URL`
  - `OPENROUTER_APP_NAME`
- Langfuse
  - `LANGFUSE_PUBLIC_KEY`
  - `LANGFUSE_SECRET_KEY`
  - `LANGFUSE_BASE_URL`
- Turso (LibSQL)
  - `DATABASE_URL`
  - `DATABASE_AUTH_TOKEN`

Enfin, si vous souhaitez que votre application utilise tous ces outils (Langfuse, Turso), il vous faudra lancer votre application avec NODE_ENV=production.

N'oubliez pas de sélectionner un modèle de langage et de le configurer dans `src/mastra/constants/models.ts`.

<div  class="admonition attention"  markdown="1"><p  class="admonition-title">Attention</p>
Par défaut c'est <code>openai/gpt-4o-mini</code> qui est sélectionné, mais ce modèle est <b>payant</b>.
Il m'a coûté moins d'1 centime au total pour tester le fonctionnement de l'application, mais attention au nombre de tokens que vous lui envoyez.
Il existe des modèles gratuits, qu'il vous suffit de chercher sur OpenRouter.
</div>

À partir de maintenant, vous pouvez lancer les commandes classiques:

 ```bash
npm install
cp .env.dist .env
NODE_ENV=production npm run dev
# ...
npm run build
npm run start
  ```

Le README du projet est plus exhaustif si vous avez besoin d'aide.

## Arborescence du projet

Comme vous pouvez le constater, Mastra dispose d'une arborescence plutôt parlante et intuitive:
- `src/mastra/tools` contient les Tools (les fonctions) que nos agents pourront appeler.
- `src/mastra/mcp` le serveur MCP de Mastra.
- `src/mastra/workflows` contient tous les workflows de notre application.
- `src/mastra/steps` contient les steps qui composent les workflows.
- `src/mastra/agent` contient nos Agents et leurs configurations.
- `src/mastra/constants` pour toutes les constantes du projet.
- `src/mastra/lib` où on retrouvera les libs externes du projet.
- `src/mastra/infrastructure` contient les instanciations de nos providers externes.
- `src/mastra/schemas` contient tous nos schémas de validation (on y reviendra, ils sont très importants)

Nous irons tout d'abord visiter la partie worfklow, avec laquelle nous allons pouvoir donner une grande quantité de documentation (ici, nos articles de blog) se faire ingérer, *embedded*, et sauvegarder en base de données.
Ensuite, on s'occupera de notre Agent, qui est la partie avec laquelle nous allons pouvoir interagir avec nos utilisateurs.
C'est l'Agent qui va recevoir la requête de l'utilisateur, et décider de lui-même d'utiliser les Tools à sa disposition pour retrouver les articles les plus pertinents.

Vous trouverez également le fichier `src/mastra/index.ts` dans lequel on configure toute notre application.
Voilà notre configuration minimum :

```ts
export const mastra = new Mastra({
  workflows: {},
  agents: {},
  mcpServers: {},
  storage,
  observability: {
    configs: {
      local: {
        serviceName: 'mastra',
        exporters: [new DefaultExporter()],
      },
      langfuse: {
        serviceName: 'mastra',
        sampling: { type: SamplingStrategyType.ALWAYS },
        exporters: [langfuseExporter],
      },
    },
    configSelector: () => {
      return ENVIRONMENT === 'production' ? 'langfuse' : 'local';
    },
  },
  logger,
  deployer: new VercelDeployer(),
});
```

À chaque création d'un nouveau Worflow, Agent, serveur MCP, il faudra le rajouter ici, dans la configuration de Mastra.
C'est ainsi qu'on enregistre nos outils dans Mastra, et qu'on y aura accès dans le Playground ...

## Mastra Playground

Une fois le projet lancé, vous pourrez cliquer sur l'URL proposée dans votre console, très certainement http://localhost:3000.
Et bienvenue sur Mastra Playground, votre interface de test pour Mastra.

![Mastra Playground]({BASE_URL}/imgs/tutorials/mastra-ai-rag/mastra-playground.png)

Vous retrouverez sur le menu de gauche les Agents, Workflows que vous aurez développé, et serez même en mesure de tester vos Tools indépendamment.
Pour la partie Observabilité, vous y trouverez des informations utiles sur l'exécution de vos Workflows, et les requêtes à vos Agents.
Mais si vous avez lancé votre application en mode production, c'est sur l'interface de Langfuse que vous retrouverez toutes ces informations.

À présent que nous sommes plus familier avec l'arborescence et le Playground de Mastra, on peut passer aux choses sérieuses !
