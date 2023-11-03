---
contentType: article
lang: fr
date: 2023-11-07
slug: micro-frontend
title: "Micro frontend : la clé d'une migration fluide et évolutive"
excerpt: Description
categories:
    - javascript
keywords:
    - micro frontend
authors:
    - fpasquet
    - iregaibi
    - charles-eric
---

## Qu'est-ce que le Micro frontend ?

Le concept de Micro frontend a été introduit pour la première fois en novembre 2016 dans le [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends). Il s'inspire des principes des microservices et les transpose dans le domaine du développement front-end. À mesure que les applications web évoluent, elles ont tendance à devenir de plus en plus volumineuses et complexes, parfois obsolètes en raison de l'utilisation de frameworks non maintenus. Ce phénomène les qualifie souvent de "frontend monolithique."

Les applications front-end monolithiques posent de nombreux défis, notamment en matière de maintenance, d'extensibilité, et d'agilité. Les mises à jour, l'ajout de nouvelles fonctionnalités et la correction des bogues deviennent de plus en plus compliqués. C'est là que le Micro frontend intervient, il repose sur le découpage de l'application en composants autonomes, les "micro frontends," responsables de fonctions spécifiques.

Dans la théorie, chaque micro frontend peut être développé indépendamment, testé, déployé et évolué sans perturber le reste de l'application. Cette modularité offre une grande flexibilité aux équipes de développement, qui peuvent se concentrer sur des domaines spécifiques de l'application. De plus, le Micro frontend permet d'utiliser divers langages et frameworks, offrant ainsi une compatibilité accrue.

Cependant, il est important de noter que dans la réalité, l'adoption du Micro frontend peut être plus complexe que prévue. La coordination entre les micro frontends, la gestion des dépendances, et la définition d'une architecture solide peuvent représenter des défis significatifs. Bien que cette approche soit puissante, son succès dépendra de la planification minutieuse et de l'expertise technique de l'équipe de développement.
& Complexité opérationnelle et organisationnelle

Dans les sections suivantes, nous explorerons les avantages de cette approche et les différents cas d'usage.

## Les avantages du Micro frontend

L'adoption du Micro frontend présente de nombreux avantages pour les entreprises. Il est essentiel de saisir ces avantages pour évaluer la pertinence de cette approche pour votre organisation. Voici un aperçu des principaux atouts :

- **Indépandance des responsabilités fonctionnelles :**

L'un des avantages les plus marquants du Micro frontend réside dans sa capacité à isoler chaque fonctionnalité de l'application en composants autonomes. Cela signifie que vous pouvez travailler sur chaque micro frontend de manière indépendante, sans perturber le reste de l'application. Cette isolation facilite le développement, les tests, les déploiements, et les mises à jour, réduisant ainsi les risques d'effets secondaires non désirés.
& Single Responsibility SOLID

- **Indépendance des équipes :**

La notion de Feature Team prend tout son sens avec le concept de micro frontend. Des équipes entièrement indépendantes peuvent posséder une section d'un produit. Pour que cela fonctionne, vos équipes doivent être formées autour de tranches verticales de fonctionnalités métier, plutôt qu'autour de capacités techniques.

- **Indépendance vise à vis de la stack technique :**

Chaque équipe peut être indépendante dans le choix de la technologie et du framework, sans nécessité de synchronisation avec les autres équipes. Cela permet une plus grande flexibilité et une meilleure adaptation aux besoins spécifiques de chaque composant.
& Déploiement individuel
La livraison de votre micro frontend n'affectera pas l'ensemble de l'application, car les changements n'affectent qu'une partie du processus métier. Cela peut réduire la fréquence de livraison, ce qui peut être avantageux en termes de gestion des mises à jour.

<div class="admonition summary" markdown="1"><p  class="admonition-title">En résumé</p>

Finalement ces avantages permettent de garantir une meilleur agilité et évolutivité et donc productivité des équipes.
</div>

## Dans quels cas utiliser cette approche ?

- split cope by product or team
- migration progressive

## Stratégies d'implémentation du Micro frontend

- intégration de modules micro au sein d'une app avec potentiellement webpack federation (non recommendé)
- Rendu côté serveur + hydratation : juste à citer car plus complexe (non recommendé)
- Au moment de l'exécution via JavaScript / runtime

## Comment répondre au problématiques particulières d’implémentation ?

- Communicate via Custom events (instead of storage): lien article existant
- Cohérence visuelle : avec Design System
- Stratégie de tests : sur chaque brique + tests d’intégration de l’ensemble + risque pcq dev teste que en local
- Coût sur la taille des JavaScript : rester attentif et pragramtique : ex migration progressive 1 ou 2 micro front par page
- Dépendances : ne pas casser qd seulement 1 microfrontend à un problème : découpler les compostants, communication via events uniquement.

## Conclusion

rappel avantages
attention Complexité opérationnelle et organisationnelle
au studio: on l'utilise surtout pour la migration progressive

Ressources
Cam Jackson, Martin Fowler : Micro frontends
Michael Geers: Micro frontends extending the microservice idea to frontend development
