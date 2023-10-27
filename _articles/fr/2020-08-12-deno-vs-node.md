---
contentType: article
lang: fr
date: '2020-08-12'
slug: deno-vs-node
title: Deno Vs Node - Top 5 des nouveautés de Deno
excerpt: 'Dans cet article, nous allons voir quelques nouveautés offertes par Deno'
categories:
  - javascript
authors:
  - plerouge
keywords:
  - node
  - deno
---

Le créateur de NodeJS, Ryan Dahl, a publié un nouveau runtime qui vise à résoudre de nombreuses lacunes de Node.
Votre première réaction pourrait être « Oh super, un autre framework Javascript ? Juste ce dont j'avais besoin… ».
Ne vous inquiétez pas, j’ai eu la même réaction.
Après avoir compris les avantages, j'ai également vu pourquoi Deno est exactement ce dont un développeur Javascript back-end a besoin en 2020.
Jetons un coup d'œil aux 5 principales nouveautés qu'offre Deno aux développeurs JavaScript.

## 1. Du Javascript moderne (ES Modules)

![]({{ site.baseurl }}/assets/2020-08-12-deno-vs-node/modern.png)

Si vous êtes un développeur React, vous avez remarqué que la syntaxe d'importation des packages est différente lorsque vous travaillez avec NodeJS.
En effet, Node a été créé en 2009, il y a eu de nombreuses mises à jour et améliorations de Javascript depuis lors.

Dans React (et Deno), nous utilisons la syntaxe moderne :

```
import package from 'package'
```

tandis que dans Node, nous utilisons la syntaxe :

```
const package = require ("package").
```

L'importation des modules ES est plus performante pour deux raisons :

  - Avec l'importation, vous pouvez charger de manière sélective uniquement les parties dont vous avez besoin à partir d'un package, ce qui économise de la mémoire.
  - Le chargement est **synchrone** avec *require* tandis que *import* charge les modules de manière **asynchrone**, ce qui améliore les performances.

Si vous avez bien remarqué, dans l'image ci-dessus nous importons le package **moment** à partir d'une URL, ce qui nous amène au prochain avantage de Deno.

## 2. Packages décentralisés

Avec Deno, vous n'êtes plus dépendant de NPM.
C'est vrai, plus de *package.json*.
Chaque package est chargé à partir d'une URL.
Dans NodeJS, pour utiliser un package, vous devez d'abord l'installer à partir de NPM :

```
npm i moment
```

Attendez qu'il s'installe, puis incluez-le dans votre application :

```
const moment = require("moment")
```

De plus, chaque fois que quelqu'un souhaite exécuter votre dépôt NodeJS localement, il doit installer toutes les dépendances de NPM.
Dans Deno, le package est importé à partir d'une URL, donc si vous voulez utiliser moment, vous importez simplement [https://deno.land/x/moment/moment.ts](https://deno.land/x/moment/moment.ts).

![]({{ site.baseurl }}/assets/2020-08-12-deno-vs-node/moment.jpeg)

Un autre énorme avantage en ce qui concerne les packages dans Deno,
c'est que **chaque package est mis en cache sur le disque dur après l'installation**.
Cela signifie que l'installation d'un package n'a lieu qu'une seule fois.
Si vous souhaitez importer à nouveau la dépendance, n'importe où, il ne sera pas nécessaire de la télécharger.

## 3. Await en top level : Utiliser Await en dehors d'une fonction asynchrone

![]({{ site.baseurl }}/assets/2020-08-12-deno-vs-node/await.png)

Dans Node, le mot clé *await* n'est accessible que dans une fonction asynchrone.
Avec Deno, vous pouvez l'utiliser n'importe où, sans l'encapsuler dans une fonction asynchrone.
Presque toutes les applications Javascript incluent de nombreuses fonctions asynchrones.
Cette mise à niveau rend le code beaucoup plus propre et simple.

## 4. TypeScript natif, aucune configuration nécessaire

![]({{ site.baseurl }}/assets/2020-08-12-deno-vs-node/type.jpeg)

Faire fonctionner TypeScript avec NodeJS est un processus en plusieurs étapes.
Vous devez installer Typescript, mettre à jour package.json, tsconfig.json et vous assurer que vos modules prennent en charge @types.
Dans Deno, tout ce que vous avez à faire est d'enregistrer votre fichier avec l'extension .ts au lieu de .js, **le compilateur TypeScript est déjà intégré**.

## 5. Accès à l'API navigateur (Window, Fetch)

Pour éxécuter des requêtes HTTP en javascript, nous pouvons utiliser l'API Fetch.
Dans NodeJS, nous n'avons pas accès à l'API du navigateur, nous ne pouvons donc pas appeler nativement une fonction de récupération de données.

Il faut d'abord installer le package :

```
npm i node-fetch
```

Ensuite nous importons le package :

```
const fetch = require("node-fetch")
```

Et ce n'est qu'alors que nous pouvons faire un appel de récupération.
Deno a nativement accès à l'objet window, ce qui signifie que vous pouvez simplement appeler *fetch ("https://something.com")*
ainsi que tout autre élément dans l'API du navigateur sans installer de librairies.

Lorsqu'il est combiné avec l'avantage top level d'*await*,
vous pouvez maintenant voir à quel point le code Deno est plus simple que le code Node :

![]({{ site.baseurl }}/assets/2020-08-12-deno-vs-node/api.jpeg)

## Ça ne s'arrête pas là

Deno a de nombreux autres avantages, comme être plus sécurisé par défaut. Vous pouvez exécuter des binaires WebAssembly, il a de nombreuses librairies intégrées... et la liste est longue.

Tous les points mentionnés dans cet article sont interconnectés, se réunissant pour former un runtime javascript back-end 2020 plus moderne.

Deno remplacera-t-il finalement Node ? Peut-être, peut-être pas. Cela prendra probablement plusieurs années.
L'écosystème NodeJS est énorme, il faudra du temps à Deno pour le rattraper.
Mais les développeurs Javascript ont récemment privilégié Deno pour leurs nouveaux projets, donc si vous cherchez à démarrer un nouveau projet bientôt, cela vaut vraiment la peine d'être examiné.
Pour plus d'informations sur la façon de commencer, visitez [https://deno.land/](https://deno.land).
