---
layout: post
title: Mission accessible, une introduction
excerpt: Cet article est une introduction au sujet de l’accessibilité, son approche en tant que diversité des situations d’usage et son application dans la conception de produits numériques.
lang: fr
authors:
    - meugeniatr
    - fverneuil
permalink: /fr/mission-accessible-introduction/
categories:
    - bonnes pratiques
---

Le Web et les outils numériques sont présents dans toutes les sphères du quotidien, de l’achat de produits de première nécessité jusqu’à la recherche d’emploi et aux démarches administratives. Ils nous concernent toutes et tous et doivent donc être accessibles qu’importe la situation et nos capacités sensorielles, motrices ou cognitives.

Cet article est une **introduction au sujet de l’accessibilité**, son approche en tant que diversité des situations d’usage et son application dans la conception de produits numériques.

## Qu’est-ce que l’accessibilité ?

L’accessibilité est la promesse de rendre compréhensible, utilisable et agréable le web pour toutes et tous, qu’importe les capacités de la personne qui l’utilise, son âge, son lieu de résidence ou son contexte d’usage.

La notion d’usages est au cœur de l’idée d’accessibilité. Opposé à l’idée d’un design par défaut qui conviendrait supposément à tous, un design accessible prend en compte **les différents contextes d’usage possibles**. En effet, notre expérience numérique peut être amenée à changer dans une même journée ou plus largement dans notre vie. Ainsi, une application peut devenir difficile d’utilisation en situation de **handicap permanent, temporaire**, mais aussi **situationnel** : lorsqu’on doit garder un bébé dans les bras, lorsque l’écran est exposé à une forte lumière ou lorsque l’on se retrouve dans un lieu faiblement connecté à internet. Il est donc important de penser aux différents contextes d’usage d’un site ou d’une application.

Concevoir un outil accessible c’est donc penser un outil pour les utilisatrices et utilisateurs tels qu’ils sont réellement, dans leur diversité (voir les [travaux d’accessibilité de Google](https://m3.material.io/foundations/accessible-design/overview) et de [Microsoft](https://www.microsoft.com/design/inclusive/) pour en savoir plus).

<div style="text-align: center; margin: 2rem 0;">
   <img src="{{ site.baseurl }}/assets/2022-09-29-mission-accessible/disabilities.jpg" width="600px" alt="Exemple de situation d’handicap permanent, temporaire et situationnel" style="display: block; margin: auto;"/>
   <figcaption>Source <cite><a href="https://uxdesign.cc/accessibility-guidelines-for-a-ux-designer-c3ba775539be" target="_blank" rel="nofollow, noreferrer">Accessibility Guidelines de Avinash Kaur</a></cite></figcaption>
</div>
 
## Pourquoi _faire_ de l’accessibilité ?
 
Intégrer une démarche d’accessibilité dans votre produit est **bénéfique pour vos utilisateurs et pour votre business**.
 
Tout d’abord, concevoir une expérience utilisateur accessible est **bénéfique pour l’ensemble de vos utilisateurs**. Par exemple, alors que le sous-titrage de messages peut servir pour les individus avec une déficience auditive, cela permet aussi de faire passer un message dans une situation bruyante (voir illustration ci-dessous). Ainsi, la démarche d’accessibilité permet d’inclure les individus atteints d’un handicap permanent, qui représentent [près d’1 adulte français sur 7](https://www.cnsa.fr/documentation/cnsa_chiffres_cles_2021_interactif.pdf), mais aussi d’offrir une expérience plus adaptée à **l’ensemble de vos utilisateurs**.
 
<div style="text-align: center; margin: 2rem 0;">
   <img src="{{ site.baseurl }}/assets/2022-09-29-mission-accessible/group.png" width="600px" alt="Exemple de situation d’handicap permanent, temporaire et situationnel" style="display: block; margin: auto;"/>
    <figcaption>Source <cite><a href="https://uxdesign.cc/accessibility-guidelines-for-a-ux-designer-c3ba775539be" target="_blank" rel="nofollow, noreferrer">Accessibility Guidelines de Avinash Kaur</a></cite></figcaption>
</div>
 
Enfin, concevoir votre produit dans une démarche d’accessibilité est aussi [bénéfique pour votre business](https://www.w3.org/standards/webdesign/accessibility). Parmi d’autres bénéfices pour votre entreprise, un produit “accessible” est un produit qui:
 
-   Atteint une audience plus grande ;
-   Est plus utilisable ;
-   Est moins coûteux à maintenir ;
-   Apparaît davantage dans les moteurs de recherche.
 
Bénéfique pour vos utilisateurs et votre business, il n’y a plus qu’à se lancer !
Mais par où commencer…
 
## Les principes POUR selon WCAG
 
Le célèbre W3C a conçu les Web Content Accessibility Guidelines (WCAG pour référence) afin d'établir des moyens pour que le contenu web soit accessible aux personnes ayant différents handicaps. Ces directives ont été largement acceptées dans le monde entier. C'est un point très important qui peut même avoir des conséquences juridiques dans des pays dans lesquels l'accessibilité web [est requise par la loi](https://www.w3.org/WAI/policies/).
 
Les critères WCAG ont été déterminés dans quatre grands domaines : perceivable, operable, understandable et robust sous l’acronyme POUR. Mais qu'est-ce que cela signifie ? Heureusement, la réponse est assez simple.
 
-   Tous les critères qui correspondent à la catégorie _Perceivable_ (perceptible) sont liés à **l'accès à l'information**. Cela signifie que chaque information sur l'application doit être perceptible par l'utilisateur en utilisant “un ou plusieurs de ses sens” ([MDN documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable)).
-   Le principe _Operable_ (opérable) décrit les directives de **navigation dans l'application et dans les composants d'interface**. Par exemple, cela inclut la navigation par clavier, voix, écran tactile ou même les appareils par mouvement, entre autres.
-   Aussi clair que cela puisse paraître, le principe _Understandable_ (compréhensible) se concentre sur le fait que l'interface est, disons, **compréhensible par les utilisateurs**.
-   Enfin et surtout, le principe _Robust_ (robuste) fournit une ligne directrice sur la construction de **contenu qui peut être interprété par autant d'agents utilisateurs que possible**, même les agents de technologie d'assistance tels que les lecteurs d'écran.
 
Ces quatre principes ont été classés en trois niveaux de conformité : A, AA et AAA, le dernier étant le plus performant en matière d'accessibilité. Un site web ne peut accomplir l'un de ces niveaux que s'il a atteint tous les critères : cela signifie que les niveaux ne peuvent pas être partiellement atteints.
 
## Comment est faite l'évaluation A/AA/AAA ?
 
L'accessibilité Web peut être délicate pour les concepteurs, les développeurs et même les gestionnaires. Ainsi, W3 a organisé trois niveaux d'accompagnement en matière d'accessibilité pour organiser et classer les applications Web. D'autre part, chaque niveau ajoute une nouvelle couche de complexité qui doit être soigneusement élaborée.
 
Cela dit, les critères pour atteindre le niveau A s'additionnent à ceux du niveau AA, et il en va de même pour atteindre une conformité AAA. Même si dans cet article on n'inclut pas une explication exhaustive de chaque critère de chaque niveau, n'hésitez pas à lire la documentation existante soit sur la page WCAG ou même MDN. Voyons quelques exemples suivant les principes POUR.
 
### - Niveau A, que l'accessibilité commence
 
Le premier niveau est le plus simple où les choix de conception, tels que le contraste des couleurs, ne sont pas fortement impliqués. Il comporte 30 critères et son objectif est que la plupart des utilisateurs soient capables d'utiliser un site avec succès.
 
Comme _Perceivable_ (perceptible), tout contenu non textuel, comme les images ou le son entre autres, doit avoir un équivalent textuel. Il s'agit d'un exemple très simple qui est très facile à mettre en place. Dans le cas d'images, cela peut être facilement réalisé en utilisant l'attribut HTML `alt` :
 
```html
<img src="cat.png" alt="Chat : un petit mammifère à quatre pattes très populaire comme animal de compagnie" />
```
 
On peut aussi utiliser l'attribut HTML `aria-labelledby`, qui permet de faire correspondre un ou plusieurs éléments avec une description par un identifiant.
 
```html
<img src="cat.png" aria-labelledby="catto-label" />
 
<p id="catto-label">Chat : un petit mammifère à quatre pattes très populaire comme animal de compagnie"</p>
```
 
Il est important de comprendre que ces descriptions doivent être objectives et concises, une vraie description de l'image utilisée. Si l'image est purement décorative, il est préférable de laisser ces informations vides, afin que les lecteurs d'écran puissent simplement les ignorer. Dans le cas de vidéos, des sous-titres ou un contenu écrit alternatif doivent être fournis. Ce n'est qu'un début. Vous pouvez en savoir plus sur les alternatives de texte dans [ce lien](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#text_alternatives).
 
De plus, une hiérarchie claire dans la structure du site est nécessaire jusqu'au niveau de conformité A. C'est l'un des nombreux cas où le code et l'UX se chevauchent nécessairement. Voici un exemple de mise en page de site Web prototype :
 
<div style="text-align: center; margin: 2rem 0;">
   <img src="{{ site.baseurl }}/assets/2022-09-29-mission-accessible/layout.png" width="600px" alt="HTML structuré de manière sémantique et prévisible en utilisant les éléments tels que Menu, en-tête, titre, sous-titre, article, image, etc." style="display: block; margin: auto;"/>
   <figcaption>Image de <cite><a href="https://digital.com/how-to-create-a-website/how-to-properly-structure-your-html-for-web-accessibility/" target="_blank" rel="nofollow, noreferrer">How to structure your HTML properly for Web Accessibility</a></cite></figcaption>
</div>
 
Afin de respecter les critères d'accessibilité, la mise en page doit suivre un balisage sémantique. Oui, `<h1>` sera le premier et le plus pertinent en tête, et honnêtement, nous ne voyons aucune raison d'en avoir plus d'un dans la même page. Les données tabulaires doivent être affichées à l'aide de la balise `<table>` et chaque élément `<input>` doit être lié à une étiquette. C'est le moment de se débarrasser de la maladie `<div>` et d'accueillir `<fieldset>` et `<legend>` dans votre code.
 
C'est une excellente occasion de mentionner que les couleurs qui fournissent des informations à l'utilisateur ne doivent jamais être la seule source d’information. Oui ! Les icônes lors d'une erreur et aussi les éléments qui indiquent l'état d'un élément sont essentiels. Cela peut sembler un point assez simple, mais la vérité est qu'en tant que développeur front-end, j'ai vu ce code appliqué à plusieurs reprises. La pseudo-classe CSS ":focus" indique qu'un élément a reçu le focus en cliquant ou en sélectionnant à l'aide de la touche de `tab`. Il vaut mieux ne pas oublier l'état "focus" d’un élément, afin d'éviter que les développeurs écrivent cette ligne de code :
 
```css
:focus {
   outline: none;
}
```
 
Si nous ne fournissons qu'un changement dans l'interface lors du focus sur un élément (ex : un bouton, un input), il est probable qu'un utilisateur malvoyant n'aura pas accès à cette information. **C'est pourquoi l’outline ne doit jamais être enlevé**, à moins qu'un autre élément ne fournisse cette information. Il peut être vrai que le focus par défaut sur les navigateurs n'est généralement pas très attrayant, mais consultez [cette page](https://developer.mozilla.org/en-US/docs/Web/CSS/outline) pour voir comment le personnaliser. À vous de jouer !
 
<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="OJmqVxm" data-user="seyedi" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
 <span>See the Pen <a href="https://codepen.io/seyedi/pen/OJmqVxm">
 outline-style</a> by Mojtaba Seyedi (<a href="https://codepen.io/seyedi">@seyedi</a>)
 on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
 
### - Niveau AA, le challenge
 
La catégorie AA ajoute 20 critères à ceux déjà inclus dans le niveau A. Honnêtement, peu de sites respectent un niveau AA... mais cela ne veut pas dire qu'il faut renoncer aux questions d'accessibilité !
 
Suivant le principe d'opérabilité (_Operable_), **ce niveau propose d'avoir plusieurs façons de naviguer sur un site web**. Par exemple, ajouter un champ de recherche et des liens entre les pages offre une navigation moins rigide. Outre ce point, la relation sémantique entre les en-têtes et les étiquettes est également pertinente pour une conformité AA. Compte tenu des recherches sur la façon dont les utilisateurs lisent sur le web, des messages clairs et concis sont une clé de l'accessibilité. Imaginez un formulaire où l'étiquette ne dit que "nom et nom de famille" mais il y a deux entrées disponibles... laquelle est le nom et laquelle est le nom de famille si elle n'est pas clairement indiquée à chaque côté de chaque entrée ?
 
Pour le principe compréhensible (_Understandable_), **ce niveau se concentre également sur la disponibilité de la langue de l'utilisateur et les éventuelles variations qui pourraient apparaître**. Par exemple, si un mot étranger se trouve dans le contenu de la page, les informations traduites doivent être fournies sur la page. Même un sélecteur de langue est pertinent pour cette catégorie.
 
### - Niveau AAA, le véritable engagement
 
Le niveau AAA, avec 28 critères de plus que le niveau précédent, est très restrictif et n'est atteint que sur des sites hautement spécialisés. Du point de vue de la perception (_Perceivable_), **il permet une très petite gamme de nuances de couleurs avec un contraste très élevé**, les options de conception sont donc assez limitées.
 
Une dynamique parfaitement compréhensible et flexible est nécessaire pour se conformer à ce niveau. Le point unique en (O) indique que l'application peut être entièrement naviguée au clavier sans exception, mais il existe de nombreuses spécifications autour de la section Compréhensible (_Understandable_) pour gérer, par exemple, la soumission de données dans un formulaire : il doit être modifiable , appliquer une vérification lors de l'achèvement de la saisie afin de fournir la possibilité de corriger les erreurs et également d'afficher une confirmation avant la soumission.
 
### Vers quel niveau viser ?
 
Tout d'abord, le fait que tous les critères doivent être réunis pour atteindre un niveau **ne doit décourager aucun produit web**. Les efforts doivent être mesurés en fonction du public cible et du type de site Web. Parfois, il y aura des lois qui peuvent pénaliser l'institution ou l'entreprise si elles ne sont pas respectées. Parfois, les frontières sont moins définies et la rigueur est plus lâche.
 
D'autre part, de nombreux critères d'accessibilité ne font que suivre les bonnes pratiques. Cela rend notre code plus propre et plus performant. Cela rend notre conception plus claire et améliore notre UX. Ensuite, et probablement le plus important de tout, **un Web plus accessible rend l'Internet plus démocratique et plus juste**. Alors pourquoi minimiser l'effort ?
 
## Comment évaluer son produit ?
 
Une fois les principes appliqués se pose la question de l’évaluation. Est-ce que votre produit est effectivement davantage accessible pour les contextes d’usages que vous envisagiez ?
 
<div style="text-align: center; margin: 2rem 0;">
   <img src="{{ site.baseurl }}/assets/2022-09-29-mission-accessible/guidelines.png" width="300px" alt="Illustration of a guidelines book" style="display: block; margin: auto;"/>
</div>
 
### Outils d’audit
 
Il existe de nombreux outils qui peuvent être utiles pour évaluer le niveau d’accessibilité de votre produit. Parmi eux, nous pouvons citer les outils suivants qui permettent d’évaluer :
 
-   L’accessibilité globale de votre produit et d’identifier les éventuels problèmes d’accessibilité avec [CodeSniffer](https://github.com/squizlabs/HTML_CodeSniffer), [LightHouse](https://developer.chrome.com/docs/lighthouse/overview/) ou [Accessibility Insights](https://accessibilityinsights.io/);
-   L’utilisation de vos tags HTML en retirant le CSS de votre page avec [Naked Styles](https://gist.github.com/estudiobold/4181e56129ed5cbd0b6cf40c73787a56);
-   ou encore l’accessibilité de vos couleurs avec [WhoCanUse](https://whocanuse.com/) et [Contrast Grid](http://contrast-grid.eightshapes.com).
 
Cette liste ne représente qu’une petite partie de l’ensemble des outils d’audit d’accessibilité existants, vous pouvez retrouver une liste plus détaillée d’outils recommandés par le W3 via [ce lien](https://www.w3.org/WAI/ER/tools/).
 
### Tests manuels
 
Il est intéressant d’essayer d’utiliser votre propre produit à l’aide d’outils d’assistance technologique, un [lecteur d’écran](https://support.google.com/chromebook/answer/7031755?hl=fr) ou des [options d’agrandissement d’écran](https://support.google.com/accessibility/android/answer/6006949?hl=fr) par exemple. Ces tests ne remplacent pas les tests utilisateurs mais vous permettent de faire une première estimation de votre travail d’accessibilité et d’affiner votre travail en vue des tests utilisateurs.
 
### Tests utilisateurs
 
Enfin, il est intéressant **d’adopter une démarche d’accessibilité pour vos tests utilisateurs.**
 
Cette démarche passe par le recrutement de personnes atteintes de handicap en cohérence avec la population et les contextes cibles de votre produit ou encore la prise en compte des différents contextes d’usages réels dans vos protocoles de test, par exemple tester le produit avec une connexion internet instable ou avec une lumière extérieure éclairant le téléphone.
 
Ces tests utilisateurs vous permettront de :
 
-   Évaluer l’utilisation de votre produit en condition plus écologique ;
-   Évaluer le niveau d’accessibilité de votre produit pour les populations et contextes visés ;
-   Montrer les problématiques d’accessibilité réelles de votre produit à l’ensemble de votre équipe afin de les sensibiliser et les engager sur le sujet.
 
Pour plus d’informations, [Pernice et Nielsen ont rédigé un rapport détaillé sur les tests utilisateur d'accessibilité](https://www.nngroup.com/reports/how-to-conduct-usability-studies-accessibility/) qui regroupe un ensemble très riche de conseils et de méthodes pour la mise en place de ces tests.
 
## L’accessibilité en deux mots
 
Pour récapituler, nous avons vu que :
 
-   L’accessibilité est la promesse d’un outil utilisable par toutes et tous ;
-   Non seulement bénéfique pour vos utilisateurs, la démarche est aussi bénéfique pour votre business ;
-   Il existe un ensemble de principes pour travailler l’accessibilité de vos produits ;
-   Il existe un ensemble d’outils et méthodes pour évaluer le niveau d’accessibilité de votre produit et engager votre équipe sur le sujet.
 
Le chemin déblayé, il ne reste plus qu’à se demander : on commence quand ?
 
<div style="text-align: center;">
   <img src="{{ site.baseurl }}/assets/2022-09-29-mission-accessible/accessibility_cover.png" width="300px" alt="Woman in a wheelchair using a computer" style="display: block; margin: auto;"/>
</div>
 
### Ressources
 
-   Understanding the Web Content Accessibility Guidelines: [https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG)
-   Accessibility Toolkit for Open Educational Resources (OER): Accessibility Principles: [https://guides.cuny.edu/accessibility/whyitmatters](https://guides.cuny.edu/accessibility/whyitmatters)
-   Developing for Web Accessibility: [https://www.w3.org/WAI/tips/developing/](https://www.w3.org/WAI/tips/developing/)
-   W3 Web Design and Applications Accessibility: [https://www.w3.org/standards/webdesign/accessibility](https://www.w3.org/standards/webdesign/accessibility)
-   What is the difference between WCAG A, AA and AAA?: [https://ialabs.ie/what-is-the-difference-between-wcag-a-aa-and-aaa/](https://ialabs.ie/what-is-the-difference-between-wcag-a-aa-and-aaa/)
-   Outline, accessibility concerns: [https://developer.mozilla.org/en-US/docs/Web/CSS/outline#accessibility_concerns](https://developer.mozilla.org/en-US/docs/Web/CSS/outline#accessibility_concerns)
-   How to structure your HTML properly for Web Accessibility: [https://digital.com/how-to-create-a-website/how-to-properly-structure-your-html-for-web-accessibility/](https://digital.com/how-to-create-a-website/how-to-properly-structure-your-html-for-web-accessibility/)
-   Never remove CSS outlines [https://www.a11yproject.com/posts/never-remove-css-outlines/](https://www.a11yproject.com/posts/never-remove-css-outlines/)
-   Outline style [https://css-tricks.com/almanac/properties/o/outline-style/](https://css-tricks.com/almanac/properties/o/outline-style/)
-   Accessibility tools for Developers & QAs: [https://medium.com/leniolabs/accessibility-tools-for-developers-qas-59f8d2b8a502](https://medium.com/leniolabs/accessibility-tools-for-developers-qas-59f8d2b8a502)
-   How to Conduct Usability Studies for Accessibility: [https://www.nngroup.com/reports/how-to-conduct-usability-studies-accessibility/](https://www.nngroup.com/reports/how-to-conduct-usability-studies-accessibility/)
-   Accessibility guidelines for UX Designers: [https://uxdesign.cc/accessibility-guidelines-for-a-ux-designer-c3ba775539be](https://uxdesign.cc/accessibility-guidelines-for-a-ux-designer-c3ba775539be)
-   Les Chiffres Clés de l’Aide à  l’Autonomie 2021: [https://www.cnsa.fr/documentation/cnsa_chiffres_cles_2021_interactif.pdf](https://www.cnsa.fr/documentation/cnsa_chiffres_cles_2021_interactif.pdf)
-   Microsoft Inclusive Design: [https://www.microsoft.com/design/inclusive/](https://www.microsoft.com/design/inclusive/)
-   Accessibility and Material Design: [https://m3.material.io/foundations/accessible-design/overview](https://m3.material.io/foundations/accessible-design/overview)
-   Cover image [by vectorjuice](https://www.freepik.com/free-vector/web-accessibility-program-abstract-concept-illustration_12291244.htm#query=web%20accessibility&position=1&from_view=search) on FreePik
