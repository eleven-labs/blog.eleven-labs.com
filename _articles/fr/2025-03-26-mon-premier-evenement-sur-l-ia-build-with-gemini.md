---
contentType: article
lang: fr
date: 2025-03-26
slug: build-with-gemini-google-ia
title: "Mon premier événement sur l'IA : Build with Gemini"
excerpt: "Retour sur ma première journée de conférences autour de l'IA au Grand Rex à Paris"
cover:
    alt: "Conférence Build with Gemini par Google sur l'intelligence artificielle au Grand Rex à Paris"
    path: /imgs/articles/2025-03-26-mon-premier-evenement-sur-l-ia-build-with-gemini/cover.jpg
    position: left top
categories:
    - architecture
keywords:
- IA
- Google
- Gemini
- Architecture
authors:
    - marianne
seo:
    title: "Build with Gemini : retour sur mon premier événement autour de l'IA organisé par Google"
    description: "Conférences, cas d’usage concrets, architecture IA… Retour d’expérience sur l’événement Build with Gemini, ma première immersion dans le monde de l’intelligence artificielle organisée par Google à Paris."
---
Ce mardi 11 Mars 2025, je me suis rendue à l’événement [**Build with Gemini**](https://cloudonair.withgoogle.com/events/build-with-gemini?utm_source=sales_contacts&utm_medium=email&utm_campaign=FY25-Q1-emea-EME27592-physicalevent-er-developers-summit-fr&utm_content=victoria&utm_term=-), une journée de conférences autour de l’IA organisée par Google au Grand Rex à Paris.

Mon utilisation de l’IA avant d’y aller se limitait à des modèles conversationnels comme ChatGPT ou Mistral, ou à des assistants comme Codeium sur mon IDE. J’avais envie de passer au niveau supérieur.

![Keynote Build with Gemini]({BASE_URL}/imgs/articles/2025-03-26-mon-premier-evenement-sur-l-ia-build-with-gemini/keynote.jpg)

## Les conférences sur les cas d’utilisation

Parmi les conférences que j’ai le plus appréciées, il y a celles présentées par [Matt Cornillon](https://github.com/Matthieu68857), intitulées *Entraînez votre propre modèle de reconnaissance de cartes Pokémons, avec Vertex AI et AlloyDB* et *Discutez avec vos données : créer un chatbot pour jeux de société avec AlloyDB, Gemini et LangChain*. On ne va pas se mentir, les titres évidemment très geek (quasiment putaclic) m’ont attirée, mais au-delà de ça, avoir des exemples de cas d’usage concrets, c’est surtout beaucoup plus pédagogique.

Dans le cas des cartes Pokémon, l’idée était de pouvoir identifier facilement une carte en la passant simplement devant une webcam : nom, extension, tout. Grâce à Vertex AI, il a entraîné son propre modèle pour reconnaître une carte via une photo (même si maintenant on peut le faire facilement avec Google AI Studio), et l’a couplé à Cloud Run pour avoir un endpoint accessible.

![Entraînez votre propre modèle de reconnaissance de cartes Pokémons, avec Vertex AI et AlloyDB]({BASE_URL}/imgs/articles/2025-03-26-mon-premier-evenement-sur-l-ia-build-with-gemini/pokemon.jpg)

Pour faire le lien avec la base de données, il a inséré l’ensemble des cartes existantes dans AlloyDB. Mais comment comparer deux images ? Il leur a appliqué un *embedding* : une représentation vectorielle qui capture les caractéristiques essentielles de l’image — bords, formes, textures, couleurs, etc. Cela génère un vecteur à plusieurs centaines de dimensions, qu’il a inséré en base.

AlloyDB étant un fork de PostgreSQL, il a pu utiliser l’extension [**pgvector**](https://www.postgresql.org/about/news/pgvector-070-released-2852/) pour comparer ces vecteurs entre eux.

![Slide montrant le comparaison des vecteurs]({BASE_URL}/imgs/articles/2025-03-26-mon-premier-evenement-sur-l-ia-build-with-gemini/vector_slides.jpg)

Il existe plusieurs façons de faire ces comparaisons, mais on va se concentrer sur celle qui nous intéresse : trouver les images les plus proches de notre propre carte.
*ici mettre code SQL*
![Slide montrant la requête pour comparer des vecteurs]({BASE_URL}/imgs/articles/2025-03-26-mon-premier-evenement-sur-l-ia-build-with-gemini/vector_sql.jpg)


Grâce à toutes ses explications, j’ai eu envie de faire la même chose pour trier ma collection de timbres.

Sa deuxième conf’ m’a aussi fait découvrir de nouveaux outils comme [LangChain](https://github.com/langchain-ai/langchain), un framework pour créer des applications basées sur des LLM. En gros, c’est un orchestrateur.

## L’IA et l’architecture IT

La conférence *Plateforme d'IA générative : architecture évolutive et maîtrisée*, présentée par Didier Girard et Aurélien Pelletier, m’a éclairée sur plusieurs notions autour de l’IA, mais aussi sur comment l’intégrer dans un système d’information.
Ils ont remis l’accent sur l’importance de la *data* pour avoir une IA efficace, et ont présenté les briques principales qu’on peut retrouver dans une architecture IA.

![IA et architecture]({BASE_URL}/imgs/articles/2025-03-26-mon-premier-evenement-sur-l-ia-build-with-gemini/archi.jpg)

### Les models

Il existe différents modèles, avec des coûts et des vitesses de réponse variés. Il faut donc une architecture souple qui permette d’en changer facilement. Je vais me pencher sur [LiteLLM](https://www.litellm.ai/), qui a été cité pour les intervenants.

### Les assistants

Concrètement, pour les devs, on connaît déjà pas mal d’assistants intégrés à nos IDE ([Codium](https://codeium.com/), [Copilot](https://github.com/features/copilot), etc.) pour produire du code plus vite. Mais il en existe dans plein d’autres contextes : prise de notes, génération de workflows, transcription de réunions…
Et côté entreprise, on peut carrément alimenter un assistant avec ses propres données internes. Grâce à un orchestrateur, on fait passer les données dans un ETL, pour ensuite les vectoriser et les stocker dans une VectorDB.

### Les agents

On confond souvent agents et assistants, mais ce n’est pas la même chose. Un assistant assiste, un agent agit. Un agent est un outil qui exécute des tâches de manière autonome, sans intervention humaine. Je n’en ai encore jamais utilisé, mais ils ont mentionné [Smolagents](https://github.com/huggingface/smolagents), que j’ai bien envie de tester.

### Les orchestrateurs

Ce sont des outils qui permettent d’organiser et d’automatiser des processus.
On a parlé plus tôt de LangChain, mais il serait déjà dépassé par [LangGraph](https://www.langchain.com/langgraph).

<div class="admonition tip" markdown="1"><p class="admonition-title"></p>
L’IA évolue très vite, et tout devient obsolète en quelques mois. Ça ne veut pas dire qu’il faut attendre que ça se stabilise, mais qu’il faut construire une architecture résiliente, capable de s’adapter rapidement. Et à la fin, toujours la même conclusion : il faut une gouvernance forte de la data.

</div>

## L’avenir du métier de développeur : Coding the future

Cyrena Ramdani a présenté un ensemble d’outils Google pour accompagner les développeurs dans leurs tâches lors de son talk *Coding the future : Comment l'IA générative révolutionne le métier de développeur*.

SSans rentrer dans le détail des assistants Google qu’elle a montrés (comme [Gemini Code Assist](https://codeassist.google/products/business?hl=fr)), l’idée, c’est que ce sont des outils destinés à aider les développeurs expérimentés à aller plus vite sur des tâches à faible valeur ajoutée, et donc à gagner en productivité.

## Conclusion : Qu’ai-je réellement appris ?

Cette journée m’a permis de mieux comprendre l’aspect opérationnel de l’IA, que ce soit en tant que développeuse ou en tant qu’architecte. Et surtout, elle m’a donné envie d’en apprendre et d’en faire plus !
