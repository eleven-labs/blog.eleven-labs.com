---
contentType: article
lang: fr
date: 2023-11-06
slug: micro-frontend
title: "Micro frontend : la solution pour une meilleure maintenabilité de vos applications web"
excerpt: "Comprendre et mettre en place le concept de micro frontend : cas d'usage concrets et exemples d'implémentations basés sur notre expérience"
cover:
  path: /imgs/articles/2023-11-06-micro-frontend/cover.jpg
categories:
    - javascript
keywords:
    - micro frontend
authors:
    - fpasquet
    - iregaibi
    - charles-eric
---

Dans cet article, nous introduirons la notion de "micro frontend" et ses avantages. Ensuite, nous donnerons des cas d'usage concrets et des exemples d'implémentation basés sur notre expérience réelle au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application) pour des projets internes et des projets clients. Bonne lecture !

## Qu'est-ce que le "micro frontend" ?

À mesure que les applications web évoluent, elles ont tendance à devenir de plus en plus volumineuses et complexes, parfois obsolètes en raison de l'utilisation de frameworks non maintenus. Ces applications posent de nombreux défis, notamment en matière de maintenance et d'évolutivité. Les mises à jour, l'ajout de nouvelles fonctionnalités et la correction des bugs deviennent de plus en plus compliqués.

C'est là que le concept de micro frontend intervient en tant que solution à cette problématique.

Ce concept a été introduit pour la première fois en novembre 2016 dans le [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends). Il a ensuite rencontré un fort succès, et de gros acteurs comme [Spotify](https://www.quora.com/What-is-the-technology-stack-behind-the-Spotify-web-client/answer/Andreas-Blixt), [Ikea](https://www.infoq.com/news/2018/08/experiences-micro-frontends/), ou [Leroy Merlin (ADEO)](https://medium.com/adeo-tech/behind-leroymerlin-fr-micro-frontends-47fd7c53f99d) en France ont pu utiliser cette approche.

Cette architecture s'inspire des principes des microservices et les transpose dans le domaine du développement frontend. Elle repose sur le découpage de l'application web en composants autonomes, les "micro frontends", responsables de domaines et de fonctions spécifiques, qui communiquent et fonctionnent ensemble pour former une seule application frontend.

Chaque micro frontend peut être développé indépendamment, testé, déployé et évolué sans perturber le reste de l'application. De plus, le micro frontend permet d'utiliser divers langages et frameworks sur chaque brique. Cette modularité et cette indépendance de chaque composant offrent une grande flexibilité aux équipes de développement, qui peuvent se concentrer sur des domaines spécifiques de l'application.

![Architecture micro Frontend]({BASE_URL}/imgs/articles/2023-11-06-micro-frontend/microfrontend-concept.png)

Cependant, il est important de noter que dans la réalité, la mise en place du micro frontend peut être complexe, à la fois d'un point de vue technique et organisationnel :

- Sur le plan technique, la définition d'une architecture solide, la coordination entre les micro frontends, la gestion des dépendances peuvent représenter des défis significatifs.
- Du point de vue organisationnel, cette approche implique de définir de nouvelles organisations d'équipes.

Ainsi, bien que cette approche soit puissante, son succès dépendra d'une planification minutieuse et de l'expertise technique des équipes.

Dans les sections suivantes, nous explorerons les avantages de cette approche, les cas d'usage, les façons de l'implémenter, tout en relevant ces défis.

## Les avantages du micro frontend

L'adoption du micro frontend présente de nombreux avantages pour les entreprises. Il est essentiel de saisir ces avantages pour évaluer la pertinence de cette approche pour votre organisation. Voici un aperçu des principaux atouts :

### Indépendance des responsabilités fonctionnelles

L'un des avantages les plus marquants du micro frontend réside dans sa capacité à isoler les fonctionnalités de l'application frontend en blocs autonomes. Chaque micro frontend a sa propre responsabilité et suit ainsi le [principe Single Responsibility de SOLID](https://fr.wikipedia.org/wiki/Principe_de_responsabilit%C3%A9_unique). Cela signifie que vous pouvez travailler sur chaque micro frontend de manière indépendante, sans perturber le reste de l'application. Cette isolation facilite le développement, les tests, les déploiements et les mises à jour, tout en réduisant également les risques de régressions sur les autres fonctionnalités de l'application. Ainsi, chaque micro frontend, et donc l'application frontend parente, sont plus simples à maintenir.

 ### Indépendance des équipes

La notion de "feature team" prend tout son sens grâce à ce concept de micro frontend. Des équipes entièrement indépendantes peuvent être responsables chacune d'une partie complète d'un produit.

Ces "feature teams" sont composées de tous les métiers nécessaires pour mener à bien le développement de cette partie du produit, du discovery produit et du design jusqu'au déploiement et à la maintenance en production. Notamment, les développeurs backend et frontend travaillent ensemble dans la même équipe. Pour qu'ils puissent mener à bien leur mission sur cette partie du produit, ils doivent avoir la main sur toutes ses composantes techniques, aussi bien côté backend, ce qui est permis avec des microservices par exemple, que côté frontend, ce que favorise l'architecture micro frontend.

Par opposition, sans micro frontend, et même si son périmètre de responsabilité fonctionnelle est bien défini, une "feature team" peut se retrouver bloquée au moment de livrer ses fonctionnalités, puisque la composante front doit être implémentée dans une application frontend monolithique qui est co-maintenue avec toutes les autres "feature teams". Les processus de livraison sont dans ce cas plus complexes et les risques de régressions plus élevés.

### Indépendance technique

Chaque équipe peut être indépendante dans le choix de la technologie et du framework frontend. Cela permet une plus grande flexibilité et une meilleure adaptation aux besoins spécifiques de chaque composant. On pourra imaginer, par exemple, une application frontend composée d'un micro frontend en Angular, un autre en React, et un autre en Vue.

En réalité, nous recommanderons bien sûr que différentes équipes d'une même organisation fassent en sorte de rendre leurs choix et outils techniques cohérents globalement pour garantir une meilleure maintenabilité du système dans son ensemble. Mais comme ces équipes sont indépendantes techniquement, elles ont tout de même la liberté d'adapter leurs choix techniques à leur contexte.

Également, cette indépendance permet à chaque équipe de livrer son micro frontend sans affecter l'ensemble de l'application, car les changements n'affectent qu'une partie du processus métier, et qu'une partie complètement isolée techniquement. Cela permet d'augmenter la fréquence de livraison des correctifs et nouvelles fonctionnalités, ce qui peut être un avantage concurrentiel intéressant.

De plus, cette isolation technique laisse place à d'éventuelles optimisations de [performances front](https://eleven-labs.com/nos-publications/guide-d-optimisation-web-performance-le-cas-france-medias-monde) : chaque micro frontend découplé du reste de l'application se charge indépendamment et ainsi, les plus lents ne bloquent pas le bon fonctionnement des autres.

<div class="admonition summary" markdown="1"><p  class="admonition-title">En résumé</p>

Finalement, ces avantages favorisent une meilleure évolutivité du produit, et la productivité des équipes.
</div>

## Dans quels cas utiliser cette approche ?

Tout d'abord, après avoir listé tous ces avantages, précisons que cette architecture ne convient certainement pas à tous les contextes !

Nous en parlerons plus en détail dans les parties suivantes, mais il est indéniable que la mise en place de micro frontends peut s'avérer complexe sur le plan technique. Il est donc nécessaire de se poser les bonnes questions pour s'assurer que cette implémentation permettra réellement de gagner en productivité.

Voici les cas d'usage qui nous semblent les plus intéressants :

### Passage à l'échelle

Cette architecture répond à une problématique organisationnelle de passage à l'échelle d'un produit et de l'organisation qui le développe.

Par exemple, si l'application devient trop complexe techniquement ou fonctionnellement, on souhaite pouvoir la découper en petits produits plus simples à maintenir avec des équipes dédiées qui en sont responsables de manière indépendante. Dans ce cas, les features teams permettent de faciliter la maintenance globale. Mais pour être indépendantes sur leur périmètre, ces équipes ont besoin d'avoir les bons outils : l'approche micro frontend leur permet de maîtriser intégralement leur partie du produit, même sur la partie frontend.

Aussi, si l'organisation définit de forts objectifs de croissance qui impliquent d'ajouter de nombreuses fonctionnalités à un produit existant et de les livrer et de les faire évoluer rapidement, ces mêmes features teams seront plus efficaces sur un domaine bien défini, y compris sur le front.

### Migration progressive d'une application legacy

Plus originale que le cas d'usage que nous venons de décrire, il est intéressant de parler d'une autre utilité du concept de micro frontend, qui peut être au cœur de votre stratégie de maintenance de vos applications legacy.

Quand une application n'est plus au goût du jour fonctionnellement et sur une stack technique vieillissante, on rêve tous de pouvoir la réimplémenter en repartant de zéro, pour tout changer, mais ce n'est pas toujours possible !

Si vous entreprenez une refonte complète "from scratch" de cette application legacy, cela signifie que vous recommencez une nouvelle application de zéro en parallèle de l'application legacy existante. Dans ce cas, l'application existante reste généralement inchangée pendant toute la durée de la refonte, puisqu'on ne souhaite plus investir dans son évolution. L'utilisateur se retrouve donc bloqué pendant une longue période sur une application qui présente divers soucis : bugs, fonctionnalités manquantes, mauvaises performances ou UX. Et c'est seulement à la livraison de la nouvelle application qui remplace celle legacy que l'utilisateur peut profiter des nouvelles fonctionnalités et améliorations.

À l'inverse, il est préférable que le client et utilisateur de notre application puisse continuer à utiliser les fonctionnalités existantes, qui doivent être maintenues, et idéalement qu'il puisse commencer à profiter des nouvelles fonctionnalités au fur et à mesure de leur développement, le tout dans la même application. On parlera dans ce cas de migration progressive.

Le concept de micro frontend est un véritable allié pour cette migration progressive. En effet, il nous permet de faire fonctionner ensemble différentes parties de l'application front qui reposent sur des structures techniques différentes : nouvelles fonctionnalités vs. legacy.

Ainsi, par exemple, vous pouvez envisager ces possibilités :

- Ajouter un nouveau composant dans son propre micro frontend, correspondant à une nouvelle fonctionnalité, et l'intégrer sur les différentes pages de votre application legacy.
- Ajouter une nouvelle page dans son propre micro frontend pour répondre à de nouveaux besoins.
- Refondre un composant existant en le migrant dans un micro frontend pour remplacer une partie d'une page legacy existante.
- Migrer une page existante complète pour la remplacer par une nouvelle page micro frontend.

![Exemple d'utilisation du micro frontend pour une migration progressive]({BASE_URL}/imgs/articles/2023-11-06-micro-frontend/microfrontend-progressive-migration.png)

En fonction du contexte, notamment du budget et des deadlines, vous pouvez choisir parmi ces différentes possibilités ainsi :

- Si les contraintes sont fortes, vous limitez la refonte d'une fonctionnalité existante à la création d'un composant micro frontend se limitant strictement au nouveau besoin.
- Si les contraintes sont plus faibles, vous pouvez choisir de refondre complètement chaque page dans son micro frontend à chaque modification demandée sur la page existante en question.

Mais dans tous les cas, quel que soit ce choix, l'usage du micro frontend vous permet d'arrêter de faire grossir la base de code de l'application existante, puisque toute fonctionnalité strictement nouvelle sera ajoutée dans un micro frontend et non dans l'application legacy.

## Stratégies d'implémentation du micro frontend

La mise en œuvre du micro frontend offre différentes stratégies pour composer et intégrer les micro frontends dans une application. Ces stratégies varient en fonction du moment où la composition a lieu, des besoins de votre projet, et des préférences techniques. Chaque approche peut être utilisée en conjonction avec une application conteneur (App Shell) pour créer une expérience utilisateur cohérente. Voici quatre stratégies couramment utilisées :

### Composition côté serveur

Il s'agit d'une stratégie où la composition des micro frontends se produit au niveau du serveur. Dans cette approche, le serveur génère la page web complète, y compris les micro frontends, avant de la renvoyer au navigateur du client. Cette stratégie présente des avantages en matière de performances, de référencement et de sécurité. Cette approche peut être mise en œuvre de plusieurs manières :

#### SSR + Rehydration

Une première approche consiste à tirer parti du Server-Side Rendering (SSR) pour générer initialement la page avec les micro frontends. Ensuite, la partie côté client (JavaScript) prend en charge l'hydratation, c'est-à-dire la réactivation des fonctionnalités côté client une fois que la page est chargée.

Cette stratégie combine la performance d'une génération côté serveur avec la flexibilité des micro frontends côté client. Elle est souvent utilisée dans les applications web modernes, en particulier celles basées sur des frameworks tels que **Next.js**, **Nuxt.js**, ou **Angular Universal**.

#### Server Side Includes (SSI)

Le Server Side Includes (SSI) représente une approche traditionnelle de composition côté serveur. Elle offre la possibilité d'insérer de manière dynamique le contenu d'un micro frontend directement au sein d'une page HTML, au moment de la génération de la page. Cependant, les SSI sont davantage adaptés aux architectures où les micro frontends sont conçus comme des fragments de page réutilisables.

Pour illustrer l'utilisation des SSI, voici un exemple :

```html
<!-- Exemple d'utilisation de SSI -->
<html>
<head>
    <title>Shop</title>
</head>
<body>
    <div>
        <!--#include virtual="/$page.html" -->
    </div>
</body>
</html>
```

Les SSI sont pris en charge par divers serveurs web et environnements. Voici quelques-uns des serveurs et outils compatibles : **Apache HTTP Server**, **Nginx**, **IIS**...

Lorsque vous envisagez d'intégrer des micro frontends complets au sein de votre architecture, il peut être préférable d'explorer d'autres stratégies de composition qui offrent une plus grande flexibilité et la capacité d'inclure des micro frontends autonomes.

#### Edge Side Includes (ESI)

Les Edge Side Includes (ESI) représentent une extension évoluée des SSI et sont couramment utilisés dans des environnements de mise en cache côté serveur. Ils offrent une approche permettant d'inclure dynamiquement des fragments de page en fonction de règles de composition, apportant ainsi une flexibilité accrue dans le processus de composition côté serveur.

Les ESI offrent la possibilité de composer des pages web en combinant des micro frontends de manière dynamique, en fonction des besoins de chaque requête. Voici un exemple d'utilisation des ESI :

```html
<!-- Exemple d'utilisation d'ESI -->
<esi:include src="/microfrontend" />
```

Pour obtenir des détails approfondis sur la mise en œuvre des ESI et sur leur intégration dans votre architecture, il est recommandé de consulter la documentation spécifique à votre environnement.

Pour vous aider à identifier les outils et serveurs compatibles avec les ESI, voici une liste de références : **Varnish Cache**, **Akamai Edge Platform**, **Fastly**, **Cloudflare**... Chacun de ces outils peut être configuré pour gérer les ESI conformément à vos besoins particuliers.

Un exemple de cas d'utilisation notable des ESI est celui de [Marianne](https://aws.amazon.com/fr/blogs/france/marianne-une-infrastructure-serverless-pour-mieux-servir-les-lecteurs/), un magazine d'information qui a adopté une infrastructure serverless pour améliorer l'expérience de ses lecteurs.

Il est important de noter qu'une approche similaire basée sur le concept des ESI est le Edge Side Rendering (ESR). Elle repose sur l'utilisation avancée des Content Delivery Networks (CDN) pour fournir du contenu statique et dynamique de manière progressive aux utilisateurs en mode streaming.

Ci-dessous, quelques exemples d'implémentations :

- [Next.js avec Lambda@Edge et Serverless Framework](https://www.serverless.com/blog/serverless-nextjs)
- [Cloudflare Workers avec le framework Flareact](https://blog.cloudflare.com/rendering-react-on-the-edge-with-flareact-and-cloudflare-workers/)

L'Edge Side Rendering offre une méthode puissante pour composer des micro frontends au niveau du serveur Edge, améliorant ainsi les performances, la mise en cache et l'expérience utilisateur. Elle devient de plus en plus populaire pour répondre aux besoins des sites web modernes et des applications qui exigent une réactivité optimale.

### Composition au moment de la construction

La stratégie de composition au moment de la construction consiste à assembler les micro frontends pendant la phase de développement de l'application. Chaque micro frontend est développé indépendamment en tant que package distinct, et ensuite, ils sont inclus en tant que dépendances dans l'application conteneur.

Voici un exemple de code illustrant cette approche :

```json
{
  "name": "@shop/shell-app",
  "version": "1.0.0",
  "dependencies": {
    "@shop/mfe-product": "^1.0.0",
    "@shop/mfe-checkout": "^1.0.0"
  }
}
```

```js
import ShellApp from './App';
import MFEProduct from 'mfe-product';
import MFECheckout from 'mfe-checkout';

const shellAppContainer = document.getElementById('shell-app-container');
const mfeProductContainer = document.getElementById('mfe-container');
const mfeCheckoutContainer = document.getElementById('mfe-container');

const shellApp = new ShellApp();
shellAppContainer.render(shellApp);

const mfeProduct = new MFEProduct();
mfeProduct.render(mfeProductContainer);

const mfeCheckout = new MFECheckout();
mfeCheckout.render(mfeCheckoutContainer);
```

Dans cet exemple, les micro frontends `MFEProduct` et `MFECheckout` sont importés comme des modules distincts et intégrés dans l'application conteneur. Cette approche peut être adaptée à différents frameworks ou technologies, offrant ainsi une grande flexibilité dans la création d'applications modulaires basées sur des micro frontends.

### Composition au moment de l'exécution côté client

La composition au moment de l'exécution côté client via JavaScript est une approche dans laquelle les micro frontends sont chargés et intégrés de manière dynamique au moment de l'exécution, directement dans le navigateur du client. Cela permet de conserver la flexibilité tout en minimisant les dépendances préalables.

Voici un exemple de code illustrant cette approche :
```tsx
const loadMicroFrontend = (options: { name: String, url: string }) => {
    fetch(`${options.url}/manifest.json`)
        .then((res) => res.json())
        .then((manifest) => {
            const manifestMain = manifest['src/main.tsx'];

            if (manifestMain?.css) {
                for (const key in manifestMain.css) {
                    const cssPath = manifestMain.css[key];
                    const stylesheet = document.createElement('link');
                    stylesheet.type = 'text/css';
                    stylesheet.id = `style-${key}-${options.name}`;
                    stylesheet.rel = 'stylesheet';
                    stylesheet.crossOrigin = '';
                    stylesheet.href = `${options.url}/${cssPath}`;
                    document.body.appendChild(stylesheet);
                }
            }

            const script = document.createElement('script');
            script.id = `script-${options.name}`;
            script.type = 'module';
            script.crossOrigin = '';
            script.src = `${options.url}/${manifestMain.file}`;
            document.body.appendChild(script);
        });
}

loadMicroFrontend({ name: 'product', url: 'mfe-product.shop.com' });
loadMicroFrontend({ name: 'checkout', url: 'mfe-checkout.shop.com' });
```

Il convient de noter que cette approche permet de charger dynamiquement les micro frontends au moment de l'exécution, ce qui offre une grande flexibilité dans la composition de votre application. De plus, pour une implémentation plus avancée et simplifiée, vous pouvez envisager d'utiliser des outils tels que [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/), qui facilitent cette approche en gérant automatiquement le chargement des modules à la volée.

## Comment aborder certaines problématiques d'implémentation ?

Lors de la mise en œuvre des micro frontends, plusieurs questions et problématiques spécifiques surgissent. Voici comment répondre à certaines d'entre elles :

### Comment les micro frontends communiquent-ils entre eux ?

En général, il est recommandé de minimiser les communications directes entre les micro frontends, car l'un des avantages clés de cette architecture est la séparation et l'indépendance. Cependant, il peut y avoir des situations où une communication est nécessaire. Dans de tels cas, il existe des pratiques courantes pour gérer cette communication de manière propre.

**Custom Events :** Les événements personnalisés permettent aux micro frontends de déclencher et de répondre à des actions sans avoir besoin d'une connaissance directe des autres micro frontends. Cela peut aider à maintenir une certaine isolation tout en autorisant une communication ciblée. Pour en savoir plus sur cette méthode, consultez cet [article sur la communication entre composants avec des événements personnalisés]({BASE_URL}/fr/communication-entre-composants-avec-des-evenements-personnalises/).

**Contexte commun :** Un contexte partagé, tel que LocalStorage ou une instance partagée, peut être utilisé pour stocker des informations partagées entre les micro frontends. Cela peut être utile pour des données telles que l'état de l'application ou des informations d'authentification.

**Modèle de données et contrat d'interface :** Il est essentiel d'établir un modèle de données et un contrat d'interface commun entre les micro frontends pour garantir une communication efficace. Cela permet de définir clairement ce qui peut être partagé et comment interagir avec les autres composants.

### Peut-on maintenir une cohérence visuelle entre les micro frontends ?

Il est essentiel de préserver une cohérence visuelle pour offrir une expérience utilisateur fluide. Une approche recommandée pour atteindre cette cohérence consiste à développer une bibliothèque de composants d'interface utilisateur partagés. Pour atteindre cette cohérence, il est fortement recommandé de considérer l'implémentation d'un [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/).

En intégrant un Design System dans votre architecture de micro frontends, vous facilitez la création, la gestion et la mise à jour d'éléments d'interface utilisateur cohérents. Cela garantit que l'ensemble de votre application conserve une apparence uniforme, quel que soit le nombre de micro frontends impliqués dans le processus de développement.

### Quelle stratégie de tests adopter ?

Lorsqu'il s'agit de tester vos micro frontends, la principale différence réside dans la nécessité de vérifier l'intégration et la communication entre les différents micro frontends. Pour ce faire, vous devrez mettre en place des tests fonctionnels visant à assurer la bonne cohabitation et communication entre ces composants. Assurez-vous que les interactions entre les micro frontends se déroulent de manière fluide et que les fonctionnalités attendues sont bien en place. Il faudra préalablement penser à tester unitairement un maximum les petites briques de chaque composant, pour s'assurer du bon fonctionnement interne du micro frontend avant de tester la communication entre les différentes parties de l'application. Cela contribuera à garantir que l'ensemble de votre application fonctionne correctement.

### Comment minimiser l'impact sur la taille des fichiers JavaScript ?

Les micro frontends sont construits de manière indépendante, ce qui peut entraîner de la duplication de code et des dépendances communes. Cela a un impact sur la taille globale de l'application, car chaque micro frontend inclut son propre ensemble de ressources. Pour minimiser cet impact, plusieurs stratégies peuvent être envisagées.

**Externalisation des dépendances communes :** Il est possible d'externaliser les dépendances communes vers une bibliothèque partagée. Cependant, cela nécessite que tous les micro frontends utilisent la même version de ces dépendances, ce qui peut entrer en conflit avec le principe d'indépendance des micro frontends.

**Éviter la multiplication des technologies et frameworks :** Il est préférable de limiter le nombre de technologies et frameworks utilisés au sein de l'architecture des micro frontends. Trop de diversité peut compliquer la gestion et la maintenance, et entraîner une augmentation de la taille des fichiers JavaScript.

**Performance Web :** Il est important de garder un œil sur la performance web de notre application. Limiter les requêtes réseau en consolidant les appels, utiliser la mise en cache, le code splitting, adopter le préchargement sélectif pour les ressources essentielles et mettre en place des stratégies de lazy loading sont autant de techniques qui aideront l'application finale à être performante.

**Minification et compression:** Après le développement des fonctionnalités, il sera aussi possible d'adopter une stratégie de minification des fichiers JavaScript, ce qui va venir supprimer les lignes et caractères inutiles, et par conséquent répondre à l'objectif initial. La compression des fichiers est aussi une technique qui peut aider à ce niveau-là, une fois le développement fini.

<div  class="admonition summary" markdown="1"><p class="admonition-title">En résumé</p>

La communication entre les micro frontends nécessite des méthodes de communication ciblées, tandis qu'un Design System maintient la cohérence visuelle. Des tests spécialisés et une gestion efficace des dépendances et de la taille des fichiers JavaScript sont essentiels pour une architecture performante.
</div>

## Conclusion

Vous avez maintenant tous les éléments en main pour bien comprendre et mettre en place cette architecture de micro frontends.

La vraie question reste de savoir si vous en avez besoin : si vous démarrez juste une nouvelle application ou si vous n'avez pas de difficulté à maintenir votre application existante, cela peut être une solution surdimensionnée.

Mais si, comme nous au sein du [Studio Eleven Labs](https://eleven-labs.com/nos-publications/donnez-une-nouvelle-dimension-a-votre-equipe-produit), vous avez besoin de solutions pour faire évoluer efficacement vos applications complexes, cette approche peut vous aider, notamment pour assurer la migration progressive de vos applications frontend vers de nouvelles technologies.

\
*Ressources pour aller plus loin :*

- [Cam Jackson, Martin Fowler : Micro frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Michael Geers: Micro frontends extending the microservice idea to frontend development](https://micro-frontends.org/)
