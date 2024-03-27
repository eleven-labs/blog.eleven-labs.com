---
contentType: tutorial-step
tutorial: chromatic
slug: introduction
title: Introduction
---

## Qu'allons-nous faire ?

Storybook se définit comme un "workshop" permettant de créer des composants et des pages en isolation. Concrètement, **c’est une interface sur laquelle on va pouvoir jouer avec les différents états d’un composant** pour vérifier s’il correspond bien au design attendu, trouver de la documentation et récupérer les props à utiliser pour différentes implémentations. C’est un outil qui est de plus en plus utilisé lors de la **création de Design Systems**, et qui peut être utilisé avec de plus en plus de frameworks bien qu’il est initialement fait pour React. L’utilisation de Storybook peut être améliorée avec des plugins.

Mais si on passe nos composants sur Storybook, **est-ce qu’il est possible de les y tester aussi directement ? La réponse est oui !** Un des outils à notre disposition pour cela, **c’est Chromatic**.

Chromatic est développé par la même équipe que Storybook (d’ailleurs on peut remarquer que la chaîne officielle de Storybook sur Youtube s’est renommée Chromatic !). C’est un outil qu’on utilise dans la CI, qui permet de faire des **tests de non régression visuelle (mais pas que !)** sur les stories créées sur Storybook. Chromatic est un outil payant avec une version gratuite que nous allons utiliser et qui va nous permettre d'effectuer 5000 snapshots, ce qui est largement suffisant pour les besoins de ce tuto !

<div class="admonition info" markdown="1"><p class="admonition-title">Note</p>
Un plugin est actuellement en beta au moment où j'écris ce tutoriel pour la version 8 de Storybook pour permettre de lancer Chromatic directement en local sans passer par la CI, mais pour l’instant nous allons passer par la CI uniquement.
</div>

Les tests de non régression visuelle sont parfaits dans le cas d’un Design System car ils permettent de **vérifier au pixel près si les modifications sur un composant n’affectent pas d’autres composants**, ce qui peut être très compliqué à remarquer plus le projet est complexe. Dans ce tuto nous allons voir&nbsp;:

-   comment **installer Storybook et Chromatic** sur un nouveau projet Vite + React
-   comment **automatiser** Chromatic en CI
-   comment **créer et tester visuellement** sur Chromatic un composant simple
-   comment faire des **tests d’interaction** et les lancer avec Chromatic

## Prérequis

- Avoir NodeJs installé sur votre machine (`node -v` pour vérifier)
- Avoir un compte Github

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
Avant de commencer je voudrais quand même vous avertir&nbsp;: Chromatic est un outil très pratique, qui n'a pas vraiment de concurrent aussi facile d'utilisation actuellement. A partir du moment où on commence à ajouter des tests de non régression visuelle il devient difficile de s'en passer pour le projet. Il est donc probable que votre projet devienne dépendant de Chromatic, et il est déjà arrivé qu'ils décident d'augmenter le tarif de certains services. Du moment qu'il n'y a pas de réel concurrent, utiliser Chromatic c'est malheureusement accepter cette dépendance.
</div>

