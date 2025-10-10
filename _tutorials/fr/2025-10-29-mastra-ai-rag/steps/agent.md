---
contentType: tutorial-step
tutorial: mastra-ai-rag
slug: agent
title: Création de notre Blog Agent
---

## Création d'un Agent avec Mastra

L'objectif d'un agent est d'effectuer une tâche précise, et il doit pouvoir décider d'utiliser les `Tools` mis à sa disposition pour s'en charger.

Pour cela, il suffit de donner des instructions sous forme de prompt à notre Agent, de lui expliquer son rôle, lui présenter les outils dont il dispose, et la manière dont il doit répondre.
C'est pourquoi notre prompt doit être le plus exhaustif possible, pour bien indiquer l'Agent comment réagir.

Voilà ma proposition pour notre cas :

```ts
export const elevenBlogAgent = new Agent({
  name: 'Eleven Blog Agent',
  instructions: `
      You are the Eleven Labs blog search assistant. Eleven Labs is a french company of digital services. Its employees are mostly senior web developers,
       but there are many other digital professions as well such as product owners, scrum masters, UX/UI designers, ...
       We give digital advices, create robust solutions, and perform audits for our clients.

       Plus, Eleven Labs has a blog on which we can find many posts (articles and tutorials), because we like to share our skills and knowledge to the world.
       Users can use the search bar to find the best article or tutorial that will match their problem, issue, or wondering.

      Your primary function is to help users by listing the posts that will match the best their question:
      - Always answer in the same language as the user
      - Organize your list by showing first the articles, and then the tutorials
      - For each result, give the title of the post, the author and the date
      - Add a short custom summary on each post to explain why it is relevant
      - Do not answer directly the user's question, just redirect him to the relevant post
      - If no relevant post is found, just say that nothing has been found on this topic.

      Use the embedQueryTool to handle the question of the user. The index to use is "eleven_blog". This is your only context to answer.
      If no data or no relevant data is returned from the embedQueryTool, just answer you can't answer.
`,
  model: openRouterAiSdkProvider(DEFAULT_MODEL),
  tools: { embedQueryTool },
  memory: new Memory({
    storage,
  }),
});
```

Et voilà ! On fournit une instruction, le modèle à utiliser (ici `openai/gpt-4o-mini`), les `Tools` à sa disposition et comment les utiliser.

Pas grand-chose de plus à faire, notre Agent sait à présent comment se comporter et comment répondre aux questions. Pour cela, on peut utiliser le Mastra Playground.

![Mastra Playground](/assets/tutorials/mastra-ai-rag/agent-playground.png)

On observe que notre Agent fait bien appel à notre `Tool`, et nous répond qu'un article existe sur le blog d'Eleven Labs à propos des femmes dans l'IT, avec sa date et un résumé du contenu !

## Observabilité

Pour en savoir ce qu'il s'est passé en arrière-plan, on peut se rendre sur notre dashboard Langfuse. Ici, on trouve les traces de notre utilisation de l'application.
On retrouve notre appel, et des informations très intéréssantes telles que l'agent utilisé, la latence, les paramètres...

Surtout, on pourra consulter l'output de notre `EmbedQueryTool`, c'est-à-dire quels sont les contenus similaires à la question de l'utilisateur qui ont été trouvés et retournés.
On pourra grâce à cela s'interroger sur leur pertinence, et en fonction, ajuster certains paramètres.

On aura également plein de métriques à propos du coût de chaque requête, et pour chaque *model* utilisé, et plein d'autres informations.
