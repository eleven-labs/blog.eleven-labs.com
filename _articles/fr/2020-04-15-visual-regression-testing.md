---
contentType: article
lang: fr
date: '2020-04-15'
slug: storybook-visual-regression
title: Storybook - Tester la régression visuelle
excerpt: >-
  Troisième épisode de cette série, où nous parcourrons les concepts et les
  différentes solutions autour de la régression visuelle d'une application
categories:
  - javascript
authors:
  - manu
keywords:
  - storybook
  - ux
  - ui
  - react
---

Hello les petits loups!

On se retrouve déjà pour mon 3ème article sur Storybook, maintenant que nous avons pu apercevoir comment créer ses composants dans Storybook et la toute puissance de ses addons dans les 2 précédents articles, on va pouvoir commencer à vraiment s'amuser.

Il existe plein de nouveaux besoins dans notre métier de développeur web, car les besoins des sites web évoluent et nous entrons dans une dynamique vraiment très empathique, et c'est ça qu'est beau d'abord: 🙌 **Le design inclusif** 🙌

Accessibilité de la page pour les personnes en situation d'handicap, internationalisation du contenu pour une plus grande ouverture vers l'étranger, support de toutes les résolutions, navigateurs, devices et j'en passe.

Tout cela conduit à ce que notre projet, qui à la base ne sert qu'un intérêt prédéfini, puisse grandir et s'ouvrir sans discrimination! Mais cela a bien évidemment un coût technique qui n'est autre que celui de la consistance de l'interface de notre application face à ces problématiques, et c'est là que les petits gars de Storybook vous passent le Salam 👋

## Au pays des aveugles, Storybook est ROI

---

Une très bonne façon de rendre une interface consistante reste d'avoir quelques tests qui assurent que l'intégrité fonctionnelle et visuelle soit respectée.

Mais un des biais auquel nous sommes le plus exposé c'est la possibilité de redéployer très souvent son application pour tenir compte des petites modifications faites à droite, à gauche, mais quand la diversité de support grandit, il devient compliqué d'anticiper les modifications de l'interface sur chacun d'entre eux.

C'est également très pratique si le support ne peut accepter une politique de redéploiement fréquent, ce qui peut arriver dans du système embarqué - Eh oui, il n'y a pas que le web dans la vie!

C'est donc tout naturellement qu'un nouveau type de test est née: les tests de régression visuelle.

![principe de la régression visuelle]({BASE_URL}/imgs/articles/2020-04-15-visual-regression-testing/regressionvisuelle.gif)

Le but de la régression visuelle est de détecter les changements d'apparence qui ne saurait être mesuré finement, via les snapshots Jest ou les tests unitaires, sachant que le test visuelle est fastidieux pour le développeur et parfois l'erreur ou sa source ne sont pas détectable à l'oeil nu.

Pour détecter ces changements, les outils qui opèrent les tests mesurent la régression de l'UI en prenant des captures d'image de la page ou d'un composant et les comparent aux originaux.

C'est le même principe que les snapshots Jest mais au lieu de regarder la structure fonctionnelle du composant on regarde son rendu graphique pur.

On se rend donc compte pourquoi Storybook est si apprécié, il offre un environnement à trois niveaux de granularité sur les tests:

-   **Les tests fonctionnels** avec **Jest** qui vérifient que l'output d'un composant reste le même pour un input donné. Bien pour tester la qualité fonctionnelle d'un composant, savoir si Joe le stagiaire n'a pas flingué le bouton "Se connecter".
-   **Les tests "Snapshot"** avec **Storyshots** qui testent le rendu structurel du composant (JSX). Ils permettent d'éviter les erreurs de rendu et les alertes dues à un changement du code du composant.
-   **Les tests visuels** qui dépendent du **développeur** pour vérifier que le rendu graphique est conforme. Ils permettent de vérifier que le composant ne devienne pas une chimère difforme. C'est là où les outils de tests de régression visuelle vont intervenir.

Bon pour ceux qui m'ont déjà perdu, je vous ai fait un beau dessin pour illustrer les 3 niveaux de test d'un composant (un bouton) incrémentant un compteur de 1 à chaque clic.

![Les 3 niveaux de test d'un composant]({BASE_URL}/imgs/articles/2020-04-15-visual-regression-testing/Untitled.png)

> Super ta régression visuelle Manu mais au final, j'ai des yeux et pour voir les différences, ça suffit.

Si l'envie vous prend de vérifier chaque rendu, de chaque composant, sur chaque navigateur, sur chaque résolution, à la limite.

Sinon pour le reste il y a les solutions de test de régression automatisé.

## Optique 2000

---

Il existe pléthore d'outil de test de régression visuelle automatisé, c'est pourquoi je vous propose 3 choses:

-   D'une part, de passer en revue les solutions automatisées parce qu'au final on est des gros flemmards.
-   D'autre part, de regarder la recette pour le faire soi-même avec Puppeteer et Jest parce qu'en fait, on aime pas le travail des autres.
-   Pour finalement installer le mal absolu (payant): Chromatic, l'environnement de test visuel utilisé par Storybook itself, parce que dans notre métier on joue avec les sous de quelqu'un d'autre.

On recense 8 addons (visible sur cette [liste](https://storybook.js.org/docs/testing/automated-visual-testing/#libraries-and-services-with-storybook-integration)) permettant de faire ces tests et qui s'intègre tout seul avec l'environnement Storybook, ça va d'outils en reconnaissance d'image par IA comme [applitools](https://applitools.com/storybook) assez cher par des plus classiques comme [Happo](https://happo.io/) (plus abordable) ou [Loki](https://loki.js.org/) (gratuit)

On peut même réutiliser l'addon `Storyshots` et le coupler avec `jest-image-snapshot` qui s'occupera de la comparaison pixel 1:1 (maintenu par American Express babe)

Toutes ces solutions justifient leur coût par les possibilités qu'elles offrent, consistance entre les navigateurs, testing et calcul des différences sur le cloud, snapshot illimités, etc.

Mais nous on préfère retrousser nos manches, sentir l'huile et mettre la main au package, pas vrai?

Je ne vais pas vous étaler l'installation maison, le lien du guide est [ici](https://storybook.js.org/docs/testing/automated-visual-testing/#example-using-puppeteer-and-jest), mais c'est assez simple à mettre en place et ça permet de bien comprendre comment Jest et Storybook peuvent fonctionner ensemble ainsi que l'API Storybook pour accéder aux pages uniques des composants, qui sait quelles belles idées vous pourriez y trouver!

Ce que je vous propose maintenant c'est d'explorer une des solutions les plus complètes, clés en main, disponible à l'heure actuelle: Chromatic.

Le but est de vous montrer les possibilités qu'offre Storybook en terme de workflow.

Elles sont très bien représentées dans cet outil et sont à mon avis facilement reproductible avec les autres librairies open-sources, gratuites.
Allez, venez, laissez faire l'insouciance et entrez dans la danse.

## C'est moi Chroma, c'est moi le roi, du royaume libéral.

---

![Simba à bien changé entre 2 versions]({BASE_URL}/imgs/articles/2020-04-15-visual-regression-testing/Untitled1.png)

Chroma s'articule sur 3 points:

-   Tester chaque composant à chaque commit en s'intégrant directement dans le workflow Storybook
-   Prévenir des différences et les Analyser via l'interface sur l'UI de Chromatic
-   Faciliter la gestion des snapshots de référence (ground truth) toujours via l'UI Chromatic

S'ajoute alors tout le sel pour agrémenter ces features:

-   Support multi-navigateurs,
-   Gestion des viewports pour les composants responsive,
-   Gestion de version des composants (permettant des rollbacks)

![Chromatic workflow]({BASE_URL}/imgs/articles/2020-04-15-visual-regression-testing/workflow-chromatic.gif)

L'installation est relativement simple:

→ On ajoute le package en dépendance via yarn

`yarn add storybook-chromatic`

→ On importe Chromatic dans notre config storybook

```javascript
// .storybook/config.js

import { configure } from "@storybook/react";
import requireContext from "require-context.macro";
import "storybook-chromatic"; // <- ici

import "../src/index.css";

const req = requireContext("../src/components", true, /\.stories\.js$/);

function loadStories() {
    req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
```

→ On se connecte sur le site de [Chromatic](http://www.chromaticqa.com/start) pour y récupérer notre code d'appli

→ On se sert du CLI chromatic ou via `npx` pour lancer les tests

`npx chromatic --app-code=ifjsfvx2w6o8`

`./node_modules/.bin/chromatic test --app-code=ifjsfvx2w6o8`

Juste trop simple en fait.

Je vous laisse le lien pour voir par vous même les possibilités de l'outil sur le [tuto officiel](https://www.learnstorybook.com/intro-to-storybook/react/en/test/) de Storybook.

Pour résumé, on voit que l'environnement de développement d'une application évolue, plus inclusif sur les travaux des autres pour que chaque étape s'inscrive dans une logique produit ferme tout en réduisant la charge de travail répétitif sans lésiner sur la qualité lorsque le produit grandit.

Au fait, c'est ça l'article des tests, à bientôt les bichons!
