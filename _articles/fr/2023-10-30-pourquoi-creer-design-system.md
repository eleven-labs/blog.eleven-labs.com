---
contentType: article
lang: fr
date: 2023-10-30
slug: pourquoi-creer-design-system
title: "Design System : Qu'est-ce que c'est et pourquoi en avez-vous besoin ?"
excerpt: Plongez dans le monde du Design System pour comprendre comment il assure la cohérence visuelle et fonctionnelle dans la conception. Explorez ce qu'est un Design System, pourquoi il est essentiel, le moment propice pour envisager sa création, ainsi que les étapes à respecter.
categories: []
keywords:
    - design system
authors:
    - fpasquet
---

Dans cet article, je vais vous présenter le concept du Design System que nous mettons en place pour nos clients au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application). Plongez dans le monde du Design System pour comprendre comment il assure la cohérence visuelle et fonctionnelle dans la conception. Explorez ce qu'est un Design System, pourquoi il est essentiel, le moment propice pour envisager sa création, ainsi que les étapes à respecter.

## Qu'est-ce qu'un Design System ?

Un Design System est un écosystème qui rassemble des éléments graphiques, des typographies, des palettes de couleurs, de la documentation et des directives d'utilisation, le tout au sein d'une organisation. Il constitue une ressource essentielle pour garantir la cohérence visuelle et fonctionnelle dans tous les aspects de la conception d'un produit ou d'une marque. Il va bien au-delà de la simple charte graphique ou du kit d'interface utilisateur en mettant l'accent sur des principes et des fondamentaux clés.

> Un système de conception n'est pas un projet. C'est un produit au service des produits.
>
> Nathan Curtis, EightShapes

### Les Principes et fondamentaux d'un Design System

Le Design System repose sur un ensemble de principes et de fondamentaux qui en font un atout indispensable pour toute entreprise. Voici quelques-uns de ces principes :

- **Cohérence visuelle et esthétique :**

Il vise à établir une esthétique visuelle cohérente à travers tous les supports, renforçant ainsi la reconnaissance de la marque.

- **Réutilisabilité des Composants :**

Un élément fondamental d'un Design System est la réutilisation des composants de conception. Ils peuvent être utilisés de manière cohérente dans l'ensemble de l'écosystème de conception.

- **Modularité et évolutivité :**

Il est conçu de manière modulaire, favorisant l'évolutivité et l'adaptabilité.

- **Concepts fondamentaux, documentations, directives d'utilisation et exemples d'utilisation :**

Il est accompagné de documentations détaillées, directives d'utilisation, d'exemples d'utilisation, ainsi que des concepts fondamentaux sur lesquels se base le système, pour une utilisation adéquate des composants.

- **Collaboration efficace entre les équipes de conception et de développement :**

Il encourage la collaboration fluide entre les designers et les développeurs, simplifiant la communication et réduisant les erreurs.

- **Facilité de maintenance et de mise à jour :**

Grâce à sa structure modulaire, un Design System est facile à maintenir et à mettre à jour, assurant la cohérence à long terme.

- **Composants de présentation uniquement et indépendant des données :**

L'implémentation technique du Design System repose sur un principe clé : les composants du Design System ne doivent contenir que des éléments liés à la présentation de l'interface utilisateur et à son comportement. Ils ne doivent en aucun cas inclure de logique associée aux données métier qui seront affichées à l'intérieur de ces composants, et ils doivent rester indépendants des sources de données spécifiques, se concentrant exclusivement sur l'apparence et l'interaction.

### Les éléments graphiques essentiels

Au cœur du Design System se trouvent des éléments graphiques essentiels qui jouent un rôle déterminant dans la création d'une expérience utilisateur cohérente. Ces éléments comprennent :

- **Couleurs :** Les palettes de couleurs définies garantissent une identité visuelle cohérente.
- **Typographies :** Les choix de police, les tailles et l'épaisseur de texte ...
- **Espacements :** Les directives sur l'espacement, la hiérarchie de l'information et la grille contribuent à une mise en page cohérente.
- **Icônes :** Des illustrations standardisées facilitent la reconnaissance des actions et des fonctionnalités.
- **Logos et illustrations :** Les logos et les illustrations de la marque définissent son identité visuelle et renforcent sa reconnaissance.

### Exemples de Design System en Production

Plusieurs grandes entreprises ont implémenté avec succès des Design Systems. Parmi les exemples les plus notables, citons le "[Material Design](https://m3.material.io/)" de Google, qui offre une approche cohérente pour concevoir des applications au sein de l'écosystème Android. Un autre exemple pertinent est le "[Atlassian Design System](https://atlassian.design/)" d'Atlassian, qui fournit un ensemble complet de directives de conception, de composants réutilisables et de ressources pour créer des expériences utilisateur unifiées dans les produits et les services d'Atlassian, tels que Jira, Confluence et Trello. Ce Design System a été largement adopté dans l'industrie pour sa capacité à améliorer la cohérence et l'efficacité de la conception d'interfaces utilisateur.

Pour illustrer la diversité des choix réalisés dans le contexte français, voici quelques exemples de Design Systems :

- **[Système de Design de l'État (Gouvernement Français)](https://www.systeme-de-design.gouv.fr/)**

![Design System Etat Français]({{ site.baseurl }}/assets/2023-10-30-pourquoi-creer-design-system/design-system-etat-francais.png)

Ce Design System gouvernemental garantit une cohérence visuelle à travers les différents services et sites web de l'administration française.

- **[Vitamin (Decathlon)](https://www.decathlon.design/)**

![Design System Decathlon]({{ site.baseurl }}/assets/2023-10-30-pourquoi-creer-design-system/design-system-decathlon.png)

Decathlon a développé son propre Design System, Vitamin, pour maintenir l'uniformité de l'expérience utilisateur dans ses produits sportifs diversifiés.

- **[Welcome UI (Welcome to the Jungle)](https://www.welcome-ui.com/)**

![Design System Welcome to the Jungle]({{ site.baseurl }}/assets/2023-10-30-pourquoi-creer-design-system/design-system-welcome-to-the-jungle.png)

Welcome to the Jungle, une plateforme d'emploi, a créé Welcome UI pour assurer une interface utilisateur cohérente et conviviale.

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Ces exemples illustrent comment les Design Systems peuvent améliorer la cohérence et l'efficacité de la conception à grande échelle.
</div>

## Pourquoi avez-vous besoin d'un Design System ?

Maintenant que nous avons exploré les principes et les composants fondamentaux d'un Design System, il est temps de comprendre pourquoi les organisations ont besoin de mettre en place une telle ressource. Voici les avantages d'un Design System :

- **Accélération du processus de développement :**

Un Design System accélère le développement en fournissant des composants prêts à l'emploi, réduisant le temps nécessaire pour mettre de nouvelles fonctionnalités sur le marché.

- **Amélioration de la productivité des équipes :**

La cohérence des composants de conception permet aux [équipes de travailler plus efficacement](https://eleven-labs.com/expertises-agiles), en se concentrant sur des tâches complexes.

- **Réduction des redondances et des erreurs de conception :**

Le Design System élimine les redondances et assure que tous les éléments sont conformes aux normes, garantissant une expérience utilisateur de qualité.

- **Renforcement de la marque et de l'identité visuelle :**

La cohérence visuelle garantie par un Design System renforce la marque et l'identité visuelle de l'organisation. Les utilisateurs reconnaissent rapidement les éléments de la marque, renforçant ainsi la confiance et la fidélité.

- **Amélioration de l'expérience utilisateur :**

Un Design System assure une expérience utilisateur cohérente. Les utilisateurs bénéficient d'une navigation fluide et d'une interaction intuitive avec l'application ou le site web, tout en étant assurés que les composants de conception sont visuellement harmonieux et fonctionnent correctement.

- **Simplification de la documentation et des tests des composants :**

La documentation et les tests sont simplifiés, facilitant la maintenance et les mises à jour.

- **Favorisation de l'innovation et de la créativité dans le Design :**

En libérant les concepteurs des tâches répétitives, un Design System favorise l'innovation et la créativité dans le design. Les équipes peuvent se concentrer sur des idées novatrices plutôt que de recréer des éléments de conception de base.

- **Source of truth :**

Le Design System sert de référence unique et fiable pour tous les composants de conception, ce qui réduit les conflits d'information et garantit que tous les membres de l'équipe travaillent sur la même base.

- **Faciliter l'onboarding :**

Les nouveaux membres de l'équipe peuvent être rapidement intégrés grâce à la documentation et aux composants cohérents du Design System, ce qui réduit le temps nécessaire pour qu'ils deviennent opérationnels.

- **Limitation des dépenses dans le Design :**

Un Design System permet de limiter les dépenses liées à la conception, car il réduit les besoins en ressources pour la création de nouveaux éléments de conception à partir de zéro.

- **Amélioration de la communication :**

La cohérence offerte par un Design System améliore la communication entre les équipes de conception et de développement, et permet donc une collaboration plus efficace.

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Ces avantages font du Design System un atout inestimable pour les organisations, améliorant la productivité, la cohérence, la créativité, tout en réduisant les coûts et les erreurs.
</div>

## Quand devriez-vous envisager la création d'un Design System ?

La création d'un Design System est une démarche stratégique qui doit être entreprise à des moments clés de l'évolution d'une entreprise ou d'une organisation. Voici quelques indicateurs et situations qui devraient vous pousser à envisager sérieusement la mise en place d'un Design System :

- **Croissance de l'entreprise :**

Lorsqu'une entreprise connaît une croissance significative, il devient de plus en plus difficile de maintenir la cohérence visuelle et fonctionnelle de tous les produits ou services. [Les équipes de conception et de développement](https://eleven-labs.com/expertises-techniques) sont souvent éparpillées sur de multiples projets, ce qui peut entraîner une divergence dans l'apparence et l'expérience utilisateur. C'est à ce stade que la nécessité d'un Design System devient évidente, car il offre une base cohérente pour accompagner la croissance de l'entreprise.

- **Complexité croissante :**

À mesure que vos produits ou services deviennent plus complexes, la gestion de la conception devient un défi. Des éléments d'interface utilisateur sophistiqués et des interactions avancées nécessitent une coordination minutieuse pour garantir une expérience utilisateur fluide. Un Design System offre une structure modulaire et évolutive, adaptée à la complexité croissante, tout en simplifiant la gestion de la conception.

- **Besoin de réduction des coûts :**

Si votre entreprise cherche à réduire les coûts liés à la conception et au développement, un Design System est la solution idéale. En éliminant les redondances, en simplifiant la documentation et en favorisant la réutilisation des composants, il permet de réaliser des économies significatives à long terme.

- **Signaux indiquant le besoin d'un Design System :**

Outre les situations spécifiques évoquées ci-dessus, il existe également des signaux qui indiquent que votre entreprise a besoin d'un Design System. Parmi ces signaux, on peut citer : *incohérence visuelle*, *redondances de conception*, *problèmes de communication*, *difficultés de maintenance*, *temps de développement prolongé*.

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

En conclusion, un Design System devient incontournable lorsque votre entreprise évolue, se diversifie, ou fait face à des défis liés à la conception. Lorsque des signaux de problèmes surgissent, il est temps de considérer sérieusement la création d'un Design System pour améliorer la cohérence et l'efficacité de la conception.
</div>

## Comment créer un Design System ?

La création d'un Design System est un processus complexe qui requiert une approche méthodique. Voici une vue d'ensemble de certaines étapes clés, sans entrer dans les détails, car nous explorerons ces sujets plus en profondeur dans de futurs articles.

### Méthode Atomic Design

Une approche courante pour concevoir un Design System est la méthode Atomic Design, proposée par Brad Frost. Cette méthode décompose l'interface en éléments de plus en plus petits, tels que les atomes (boutons, champs de texte), les molécules (groupes d'atomes), les organismes (groupes de molécules), les templates (dispositions de page), et les pages finales. Cette méthode favorise la réutilisabilité et la cohérence des composants.

### Design Tokens

Les Design Tokens sont des variables de conception qui définissent des éléments tels que les couleurs, les typographies, les espacements, et plus encore. Ils jouent un rôle essentiel dans un Design System en garantissant la cohérence visuelle.

### Outils de Conception

Différents outils de conception tels que **Figma**, **InVision** et **Sketch**, sont disponibles pour faciliter le développement et la documentation des composants d'un Design System. Ces outils offrent des fonctionnalités de collaboration en temps réel et de création de prototypes interactifs, ainsi que des options pour documenter les interactions et les spécifications, et simplifier la conception et la documentation des composants.

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Chacun de ces outils présente des avantages spécifiques, et le choix dépendra des besoins et des préférences de l'équipe de conception.
</div>

### Outils de Documentation

Plusieurs outils de documentation, comme **Storybook** et **Zeroheight**, sont conçus pour simplifier la documentation des composants de l'interface utilisateur et des Design Systems. Storybook propose une interface conviviale pour présenter de manière structurée les composants, leurs variations et leurs spécifications, tandis que Zeroheight permet de créer des documents détaillés mettant en avant les composants, leurs utilisations et leurs règles. 

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Les choix dépendront des exigences particulières de la documentation et de la présentation des composants au sein de l'équipe de conception.
</div>

### Implémentation technique

Du point de vue technique, la création d'un Design System pour du Web implique généralement les éléments suivants :

- **Styles avec PostCSS ou CSS-in-JS :**

Pour définir les styles et les Design Tokens, vous avez le choix entre des outils tels que PostCSS, SCSS, avec l'utilisation de la méthodologie [BEM](/fr/retour-d-experience-sur-bem/), ou du CSS-in-JS. Ces approches offrent une manière structurée et maintenable de gérer les styles, en garantissant la cohérence et la réutilisabilité.

- **Web Components ou bibliothèque (React, VueJS, ...) :**

Les composants de votre Design System peuvent être construits en utilisant des Web Components, ou vous pouvez opter pour une bibliothèque de composants telle que React ou VueJS, en fonction de vos besoins spécifiques et de l'écosystème technologique de votre projet. Une alternative consiste à personnaliser une bibliothèque de composants existante, telle que Material-UI pour React, pour répondre à vos exigences particulières.

- **Typescript :**

L'intégration de TypeScript représente un atout considérable dans le développement de votre Design System en raison de son typage fort, qui contribue significativement à la qualité et à la robustesse du code. Cette approche renforce la maintenabilité du système en éliminant de nombreuses erreurs potentielles dès la phase de développement, tout en améliorant la collaboration entre les équipes de conception et de développement. Grâce à l'autocomplétion avancée fournie par TypeScript, les développeurs n'ont souvent pas besoin de consulter fréquemment la documentation, ce qui accélère considérablement leur productivité.

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

Le choix des outils et des technologies dépendra de la préférence de l'équipe, de la complexité du Design System, et des exigences spécifiques du projet. Il est essentiel de sélectionner des outils qui favorisent une collaboration fluide entre les équipes de conception et de développement pour garantir le succès de votre Design System.
</div>

### Organisation et collaboration

La création d'un Design System est une entreprise multidisciplinaire qui exige une collaboration étroite entre les différents métiers impliqués. Voici comment chaque rôle contribue au succès du projet :

- **Les UX/UI Designers** façonnent l'esthétique, l'ergonomie et l'expérience utilisateur du Design System. Leur expertise garantit que les composants et les directives répondent aux besoins produits, assurant ainsi une cohérence visuelle et fonctionnelle.

- **Les Product Managers/Product Owners** jouent un rôle crucial en alignant le Design System avec la vision produit et les besoins des utilisateurs. Leur compréhension des priorités et des fonctionnalités essentielles guide le développement de composants pertinents.

- **Les développeurs** transforment la vision du Design System en réalité. Leur rôle consiste à mettre en œuvre les composants de manière efficace et à garantir qu'ils sont techniquement réalisables.

Dans certaines organisations, chacun de ces acteurs peut se concentrer exclusivement sur la construction du Design System, tandis que dans d'autres ils travaillent simultanément sur le Design System et d'autres produits métier qui intègrent ce Design System. De plus, de nouveaux métiers, tels que les Design Ops, ont émergé pour assurer la gestion du Design System et la coordination des équipes de produits qui l'utilisent.

L'organisation est un acteur clé de cette collaboration en veillant à ce que tous les membres de l'équipe aient accès aux composants et aux directives nécessaires. La mise en place de mécanismes de communication et de partage efficaces est essentielle pour assurer la cohérence et la pérennité du Design System.

Pour approfondir l'importance de cette collaboration, nous vous invitons à consulter notre [article qui traite de ce sujet ainsi que des design tokens](/fr/un-pont-entre-les-mondes-comment-les-design-tokens-facilitent-la-cooperation-entre-developpeurs-et-designers/).

## Conclusion : la création d'un design system, élément clé de l'évolution de votre entreprise

Et voilà, vous êtes à présent prêt à lancer votre propre Design System. En instaurant des principes clés tels que la cohérence, la réutilisabilité, la modularité, et en encourageant la collaboration, vous renforcerez votre organisation. Que vous soyez une grande entreprise ou une start-up, un Design System accélérera le développement, améliorera la productivité, réduira les erreurs et renforcera votre image de marque.

Au sein du [Studio Eleven Labs](https://eleven-labs.com/nos-publications/donnez-une-nouvelle-dimension-a-votre-equipe-produit), nous faisons usage de Design Systems dans nos projets internes et pour nos clients, afin de tirer parti de tous les avantages évoqués dans cet article. Restez à l'affût pour de futurs articles approfondis et des astuces visant à optimiser votre Design System !
