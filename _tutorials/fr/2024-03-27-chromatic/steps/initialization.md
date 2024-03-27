---
contentType: tutorial-step
tutorial: chromatic
slug: initialization
title: Initialisation du projet
---

## Initialisation du projet (Vite + React + Storybook)

Il est assez probable que vous utilisez React, donc nous allons faire un nouveau projet en React appelé "chromatic-tuto-elevenlabs" sur lequel nous allons installer Storybook et React. Storybook va automatiquement comprendre qu’il est sur un projet React.

Sur un terminal, placez vous dans le dossier dans le lequel vous souhaitez **créer le projet**, puis lancez ces commandes&nbsp;:

```bash
npm create vite@latest chromatic-tuto-elevenlabs --template react-ts
```

Acceptez l’installation de `create-vite` puis selectionnez en Framework `React` et en variant `Typescript` (ou `Javascript` si vous êtes plus à l’aise, ça ne change pas grand chose dans le cadre de ce tuto mais il faudra adapter les extraits de code en retirant les types). **Installez le projet**, sans le lancer&nbsp;:

```bash
cd chromatic-tuto-elevenlabs
npm install
```

Avant de lancer le projet nous allons **installer Storybook**. Comme dit précédemment Storybook va automatiquement déterminer dans quel environnement il est installé.

<div class="admonition important" markdown="1"><p class="admonition-title">Important</p>
Une nouvelle version majeure de Storybook, la version 8, est sortie récement au moment où j'écris ce tuto. Pour être sûrs de ne pas se retrouver avec des bugs dûs à la nouveauté de cette version, je vous propose d'installer la dernière version 7 sur laquelle je suis sûre que tout fonctionne bien.
</div>

Lancez cette commande, puis acceptez l’installation du package `storybook`, puis un peu plus tard dans l’installation, installez le plugin ESLint recommandé si vous le souhaitez.

```bash
npx storybook@7 init
```

A la fin de l’installation un onglet s’ouvre par défaut à l’adresse `localhost:6006`. Si vous avez besoin de relancer Storybook plus tard, faites cette commande&nbsp;:

```bash
npm run storybook
```

Si vous n’avez pas l’habitude de Storybook je vous conseille de suivre le tour proposé par Storybook au premier lancement du projet (préparez vous à recevoir une myriade de confettis colorés).

Nous avons donc pour l’instant 3 stories&nbsp;: un bouton, un header et une page complète. Nous allons utiliser dans ce tuto le composant le plus simple&nbsp;: le bouton. Mais accrochez vous parce qu’il va falloir **faire un peu de CI**...
