---
layout: post
title: Mission accessible, une introduction
excerpt: Cet article est une introduction au sujet de l’accessibilité, son approche en tant que diversité des situations d’usage et son application dans la conception de produits numériques.
authors:
    - meugeniatr
    - fverneuil
permalink: /mission-accessible-introduction/
categories:
    - bonnes pratiques
cover: /assets/2022-07-27-responsive-accessible-typography/read-me.png
---

Le Web et les outils numériques sont présents dans toutes les sphères du quotidien, de l’achat de produits de première nécessité jusqu’à la recherche d’emploi et aux démarches administratives. Ils nous concernent toutes et tous et doivent donc être accessibles qu’importe la situation et nos capacités sensorielles, motrices ou cognitives.

Cet article est une **introduction au sujet de l’accessibilité**, son approche en tant que diversité des situations d’usage et son application dans la conception de produits numériques.

## Qu’est-ce que l’accessibilité ?

L’accessibilité est la promesse de rendre compréhensible, utilisable et agréable le web pour toutes et tous, qu’importe les capacités de la personne qui l’utilise ou son contexte d’usage.

La notion d’usages est au cœur de l’idée d’accessibilité. Opposé à l’idée d’un design par défaut qui conviendrait supposément à tous, un design accessible prend en compte **les différents contextes d’usage possibles**. En effet, notre expérience numérique peut être amenée à changer dans une même journée ou plus largement dans notre vie. Ainsi, une application peut devenir difficile d’utilisation en situation de **handicap temporaire, permanent**, mais aussi **situationnel** : lorsqu’on doit garder un bébé dans les bras, lorsque l’écran est exposé à une forte lumière ou lorsque l’on conduit une voiture. Il est donc important de penser aux différents contextes d’usage d’un site ou d’une application.

Concevoir un outil accessible c’est donc penser un outil pour les utilisatrices et utilisateurs tels qu’ils sont réellement, dans leur diversité (voir les [travaux d’accessibilité de Google](https://m3.material.io/foundations/accessible-design/overview) et de [Microsoft](https://www.microsoft.com/design/inclusive/) pour en savoir plus).

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-12-top-5-des-pires-erreurs-sous-symfony/libraryvsbundle.png" width="300px" alt="Library vs Bundle" style="display: block; margin: auto;"/>
</div>

## Pourquoi _faire_ de l’accessibilité ?

Intégrer une démarche d’accessibilité dans votre produit est **bénéfique pour vos utilisateurs et pour votre business**.

Tout d’abord, concevoir une expérience utilisateur accessible est **bénéfique pour l’ensemble de vos utilisateurs**. Par exemple, alors que le sous-titrage de messages peut servir pour les individus avec une déficience auditive, cela permet aussi de faire passer un message dans une situation bruyante (voir illustration ci-dessous). Ainsi, la démarche d’accessibilité permet d’inclure les individus atteints d’un handicap permanent, qui représentent [près d’1 adulte français sur 7](https://www.cnsa.fr/documentation/cnsa_chiffres_cles_2021_interactif.pdf), mais aussi d’offrir une expérience plus adaptée à **l’ensemble de vos utilisateurs**.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-12-top-5-des-pires-erreurs-sous-symfony/libraryvsbundle.png" width="300px" alt="Library vs Bundle" style="display: block; margin: auto;"/>
</div>

Enfin, concevoir votre produit dans une démarche d’accessibilité est aussi [bénéfique pour votre business](https://www.w3.org/standards/webdesign/accessibility). Parmi d’autres bénéfices pour votre entreprise, un produit “accessible” est un produit qui:

-   Atteint une audience plus grande;
-   Est plus utilisable;
-   Est moins coûteux à maintenir;
-   Apparaît davantage dans les moteurs de recherche.

Bénéfique pour vos utilisateurs et votre business, il n’y a plus qu’à se lancer !
Mais par où commencer…

## Les principes POUR selon WCAG

Le célèbre W3C a conçu les Web Content Accessibility Guidelines (WCAG pour référence) afin d'établir des moyens pour que le contenu web soit accessible aux personnes ayant différents handicaps. Ces directives ont été largement acceptées dans le monde entier, et même avec des implications juridiques dans différents pays.

Les critères WCAG ont été déterminés dans quatre grands domaines: perceivable, operable, understandable et robust sous l’acronyme POUR. Mais qu'est-ce que cela signifie ? Heureusement, la réponse est assez simple.

-   Tous les critères qui correspondent à la catégorie _Perceivable_ (perceptible) sont liés à **l'accès à l'information**. Cela signifie que chaque information sur l'application doit être perceptible par l'utilisateur en utilisant “un ou plusieurs de ses sens” ([MDN documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable)).
-   Le principe _Operable_ (opérable) décrit les directives de **navigation dans l'application et dans les composants d'interface**. Par exemple, cela inclut la navigation par clavier, voix, écran tactile ou même les appareils par mouvement, entre autres.
-   Aussi clair que cela puisse paraître, le principe _Understandable_ (compréhensible) se concentre sur le fait que l'interface est, disons, **compréhensible pour les utilisateurs**.
-   Enfin et surtout, le principe _Robust_ (robuste) fournit une ligne directrice sur la construction de **contenu qui peut être interprété par autant d'agents utilisateurs que possible**, même les agents de technologie d'assistance tels que les lecteurs d'écran.

Ces quatre principes ont été classés en trois niveaux de conformité : A, AA et AAA, étant le dernier le plus performant en matière d'accessibilité. Un site web ne peut accomplir l'un de ces niveaux que s'il a atteint tous les critères : cela signifie que les niveaux ne peuvent être partiellement atteints.

## Comment est fait l'évaluation A/AA/AAA ?

L'accessibilité Web peut être délicate pour les concepteurs, les développeurs et même les gestionnaires. Ainsi, W3 a organisé trois niveaux d'accompagnement en matière d'accessibilité pour organiser et classer les applications Web.

C'est un point très important qui peut même avoir des conséquences juridiques dans des pays dans lesquels [est requis par la loi](https://www.w3.org/WAI/policies/). D'autre part, chaque niveau ajoute une nouvelle couche de complexité qui doit être soigneusement élaborée.

Cela dit, les critères pour atteindre le niveau A s'additionnent à ceux du niveau AA, et il en va de même pour atteindre une conformité AAA. Même si cela n'inclut pas une explication exhaustive sur chaque critère de chaque niveau, n'hésitez pas à lire la documentation existante soit sur la page WCAG ou même MDN. Entre les critères, nous pouvons trouver des **implémentations pour la conception et l'implémentation du code**. Voyons quelques exemples suivant les principes POUR. Voyons de quoi on parle.

### \* Niveau A, que l'accessibilité commence

Le premier niveau est le plus simple où les choix de conception, tels que le contraste des couleurs, ne sont pas fortement impliqués. Il comporte 30 critères et son objectif est que la plupart des utilisateurs soient capables d'utiliser un site avec succès.

Comme perceptible (P), tout contenu non textuel, comme les images ou le son entre autres, doit avoir un équivalent textuel. Dans le cas d'images, cela peut être facilement réalisé en utilisant la propriété html alt :
<EXEMPLE UTILISANT ALT>

Dans le cas de vidéos, des sous-titres ou un contenu écrit alternatif doivent être fournis. De plus, une hiérarchie claire dans la structure du site est nécessaire jusqu'au niveau de conformité A. C'est l'un des nombreux cas où le code et l'UX se chevauchent nécessairement. Voici un exemple de mise en page de site Web prototype :

<IMAGE D'EXEMPLE DE MISE EN PAGE -- SVP FLORIAN>

Afin de respecter les critères d'accessibilité, la mise en page doit suivre un balisage sémantique. Oui, `<h1>` sera le premier et le plus pertinent entête, et honnêtement, nous ne voyons aucune raison d'en avoir plus d'un dans la même page. Les données tabulaires doivent être affichées à l'aide de la balise `<table>` et chaque élément `<input>` doit être lié à une étiquette. C'est le moment de se débarrasser de la maladie `<div>` et d'accueillir `<fieldset>` et `<legend>` dans votre code.

C'est une excellente occasion de mentionner que les couleurs qui fournissent des informations à l'utilisateur ne doivent jamais etre la seule source des informations contextuelles. Souvent, les designers oublient l’etat "focus" d’un élément, ce qui finit généralement par les développeurs écrivant cette ligne CSS :

```css
outline: none;
```

Si nous ne fournissons qu'un changement de couleur lors du focus sur un élément (ex : un bouton, un input), il est probable qu'un utilisateur malvoyant n'aura pas accès à cette information. Même la navigation au clavier peut devenir une tâche fastidieuse sans l'etat focus visible. C'est pourquoi l’outline ne doit jamais être configuré par none, à moins qu'un autre élément ne fournisse cette information en plus de la couleur. Il est vrai que le focus par défaut sur les navigateurs n'est généralement pas très attrayant, mais consultez cette page pour voir comment le personnaliser.

### \*Niveau AA, le challenge

La catégorie AA ajoute 20 critères à ceux déjà inclus dans le niveau A. Honnêtement, peu de sites respectent un niveau AA... mais cela ne veut pas dire qu'il faut renoncer aux questions d'accessibilité !

Suivant le principe d'opérabilité (O), **ce niveau propose d'avoir plusieurs façons de naviguer sur un site web**. Par exemple, ajouter un champ de recherche et des liens entre les pages offre une navigation moins rigide. Outre ce point, la relation sémantique entre les en-têtes et les étiquettes est également pertinente pour une conformité AA. Compte tenu des recherches sur la façon dont les utilisateurs lisent sur le web, des messages clairs et concis sont une clé de l'accessibilité. Imaginez un formulaire où l'étiquette ne dit que "nom et nom de famille" mais il y a deux entrées disponibles... laquelle est le nom et laquelle est le nom de famille si elle n'est pas clairement indiquée à chaque côté ?

Pour le principe compréhensible (U), **ce niveau se concentre également sur la disponibilité de la langue de l'utilisateur et les éventuelles variations qui pourraient apparaître**. Par exemple, si un mot étranger se trouve dans le contenu de la page, les informations traduites doivent être fournies sur la page. Même un sélecteur de langue est pertinent pour cette catégorie.

### \*Niveau AAA, le véritable engagement

Le niveau AAA, avec 28 critères de plus que le niveau précédent, est très restrictif et n'est atteint que sur des sites hautement spécialisés. Du point de vue de la perception (P), **il permet une très petite gamme de nuances de couleurs avec un contraste très élevé**, les options de conception sont donc assez limitées.

Une dynamique parfaitement compréhensible et flexible est nécessaire pour se conformer à ce niveau. Le point unique en (O) indique que l'application peut être entièrement naviguée au clavier sans exception, mais il existe de nombreuses spécifications autour de la section Compréhensible (U) pour gérer, par exemple, la soumission de données dans un formulaire : il doit être modifiable , appliquer une vérification lors de l'achèvement de la saisie afin de fournir la possibilité de corriger les erreurs et également d'afficher une confirmation avant la soumission.

## Comment évaluer son produit ?

Une fois les principes appliqués se pose la question de l’évaluation. Est-ce que votre produit est effectivement davantage accessible pour les contextes d’usages que vous envisagiez ?

### Outils d’audit

Il existe de nombreux outils qui peuvent être utiles pour évaluer le niveau d’accessibilité de votre produit. Parmi eux, nous pouvons citer les outils suivant qui permettent d’évaluer:

-   L’accessibilité globale de votre produit et d’identifier les éventuels problèmes d’accessibilité avec [CodeSniffer](https://github.com/squizlabs/HTML_CodeSniffer), [LightHouse](https://developer.chrome.com/docs/lighthouse/overview/) ou [Accessibility Insights](https://accessibilityinsights.io/);
-   L’utilisation de vos tags HTML en retirant le CSS de votre page avec [Naked Styles](https://gist.github.com/estudiobold/4181e56129ed5cbd0b6cf40c73787a56);
-   ou encore l’accessibilité de vos couleurs avec [WhoCanUse](https://whocanuse.com/) et [Contrast Grid](http://contrast-grid.eightshapes.com).

Cette liste ne représente qu’une fine partie de l’ensemble des outils d’audit d’accessibilité existants, vous pouvez retrouver une liste plus détaillée d’outils recommandés par le W3 via [ce lien](https://www.w3.org/WAI/ER/tools/).

### Tests manuels

Il est intéressant d’essayer d’utiliser votre propre produit à l’aide d’outils d’assistance technologique, un [lecteur d’écran](https://support.google.com/chromebook/answer/7031755?hl=fr) ou des [options d’agrandissement d’écran par exemple](https://support.google.com/accessibility/android/answer/6006949?hl=fr). Ces tests ne remplacent pas les tests utilisateurs mais vous permettent de faire une première estimation de votre travail d’accessibilité et d’affiner votre travail en vue des tests utilisateurs.

### Tests utilisateurs

Enfin, il est intéressant d’adopter une démarche d’accessibilité pour vos tests utilisateurs.

Cette démarche passe par le recrutement de personnes atteintes de handicap en cohérence avec la population et les contextes cibles de votre produit ou encore la prise en compte des différents contextes d’usages réels dans vos protocoles de test, par exemple tester le produit avec une connexion internet instable ou avec une lumière extérieure éclairant le téléphone.

Ces tests utilisateurs vous permettront de:

-   Évaluer l’utilisation de votre produit en condition plus écologique;
-   Évaluer le niveau d’accessibilité de votre produit pour les populations et contextes visés;
-   Montrer les problématiques d’accessibilité réelles de votre produit à l’ensemble de votre équipe afin de les sensibiliser et les engager sur le sujet.

Pour plus d’informations, [Pernice et Nielsen ont rédigé un rapport détaillé sur les tests utilisateur d'accessibilité](https://www.nngroup.com/reports/how-to-conduct-usability-studies-accessibility/) qui regroupe un ensemble très riche de conseils et de méthodes pour la mise en place de ces tests.

## L’accessibilité en deux mots

Pour récapituler, nous avons vu que :

-   L’accessibilité est la promesse d’un outil utilisable par toutes et tous;
-   Non seulement bénéfique pour vos utilisateurs, la démarche est aussi bénéfique pour votre business;
-   Il existe un ensemble de principes pour travailler l’accessibilité de vos produits;
-   Il existe un ensemble d’outils et méthodes pour évaluer le niveau d’accessibilité de votre produit et engager votre équipe sur le sujet.

Le chemin déblayé il ne reste plus qu’à se demander: On commence quand ?

### Ressources

-   Understanding the Web Content Accessibility Guidelines: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG
-   Accessibility Toolkit for Open Educational Resources (OER): Accessibility Principles https://guides.cuny.edu/accessibility/whyitmatters
-   Developing for Web Accessibility: https://www.w3.org/WAI/tips/developing/
-   What is the difference between WCAG A, AA and AAA?: https://ialabs.ie/what-is-the-difference-between-wcag-a-aa-and-aaa/
-   Outline, accessibility concerns: https://developer.mozilla.org/en-US/docs/Web/CSS/outline#accessibility_concerns
