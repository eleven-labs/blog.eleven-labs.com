---
contentType: article
lang: fr
date: '2021-05-24'
slug: leco-conception
title: L'éco-conception
excerpt: >
  L’éco-conception est un sujet qui se démocratise dans la conception de biens
  matériels. Mais qu’en est-il pour le développement des produits et services
  numériques ?
cover: /assets/2021-05-24-leco-conception/mainimg.png
categories: []
authors:
  - marianne
  - mapo
keywords:
  - bonnes pratiques
  - éco-conception
  - conception
  - produit
  - ux
  - développement
---

Vous en avez sûrement entendu parler : l’éco-conception est un sujet qui se démocratise dans notre société, surtout dans la conception de biens matériels (utilisation de matières premières pour les produire, énergie pour les fabriquer, emballages, recyclage...). Mais qu’en est-il du développement des produits et services numériques ?

C’est une question qui est encore peu abordée dans notre domaine, sûrement par méconnaissance du sujet, aussi bien chez les développeurs que dans les entreprises.

## Qu’est-ce que l’éco-conception ♺ ?

### Définition 🔍
L’ADEME, Agence de l'environnement et de la maîtrise de l'énergie, donne cette [définition de l’éco-conception](https://www.ademe.fr/glossaire/e) :

*L'écoconception est une démarche préventive qui se caractérise par la prise en compte de l'environnement lors de la phase de conception ou d'amélioration d'un produit. L'objectif de cette démarche est d'améliorer la qualité écologique du produit, c'est-à-dire réduire ses impacts négatifs sur l'environnement tout au long de son cycle de vie, tout en conservant sa qualité d'usage.*

L’éco-conception va concerner l’ensemble du cycle de vie du produit. De la récolte des besoins utilisateurs, en passant par le design et maquettage, la mise en place de l’architecture technique jusqu’à la maintenance du produit, l’éco-conception va viser à réduire l’impact sur l’environnement.

Tous les acteurs sont donc concernés : Designer, Product Owner, Architectes, Développeurs… sans oublier le client ! Il est nécessaire que chacun saisisse les enjeux, que ce soit l’aspect écologique de la démarche ou pour faire des économies qui peuvent être mesurables.

### État des lieux 🏠
Sans rentrer dans les détails, l’équipe de [Green IT](https://www.greenit.fr/) propose deux rapports sur l’impact du numérique à l’échelle mondiale et française.

Nous pouvons penser que la majorité de la pollution provient de l’électricité nécessaire au fonctionnement des produits et services informatiques, mais c’est en réalité la fabrication du matériel qui est la plus impactante.

*Tableau représentant l'impact environnemental de la fabrication et de l'utilisation - [Rapport Green IT](https://www.greenit.fr/wp-content/uploads/2021/02/2021-01-iNum-etude-impacts-numerique-France-rapport-0.8.pdf)*

| % | Energie | Gaz à effet de serre | Eau | Ressources |
|--|--|--|--|--|
|Fabrication|41 %|83 %|88 %|100 %|
|Utilisation|59 %|17 %|12 %|0 %|

En plus d’être coûteux à la fabrication, à l’échelle mondiale, seulement [17% des déchets électroniques sont recyclés](https://www.greenit.fr/2020/07/03/dechets-electroniques-21-en-5-ans/).


Green IT détaille par catégorie quels sont les plus gros consommateurs de ressources et d’énergie :
1. les équipements des utilisateurs : **64 à 91 %** de la consommation
2. les réseaux : **5 à 21 %** de la consommation
3. les data centers : **4 à 15 %** de la consommation

La fabrication de nos équipements, (smartphone, tablettes, desktop...) représente donc l'axe majeur sur lequel travailler pour réduire l'impact écologique du numérique.
À notre niveau, concevoir des applications numériques moins gourmandes ou encore rationnaliser l'intégration de fonctionnalités qui nécessitent des équipements dernier cri (Touch ID par exemple) peut y contribuer. 

Les utilisateurs de nos sites, applications et services numériques peuvent garder plus longtemps leurs équipements et sont moins incités à investir dans un matériel plus performant tous les ans. C'est un effort collectif de longue haleine à produire, challengeant dans la complexité à maintenir d'anciennes versions par exemple, mais qui peut permettre de réduire le phénomène d’obsolescence programmée de nos équipements tout en favorisant l'inclusion numérique !

**Les services numériques peuvent donc aider à la diminution de leurs propres impacts écologiques par différentes recommandations que l'on vous livre dans la suite de cet article.**

## Comment éco-concevoir 🔨 ? 
### Challengez vos fonctionnalités et leur mise en oeuvre 📝
#### À l’étape du recueil des besoins

On pourra commencer par se poser les questions suivantes :
-   Est-ce que cette fonctionnalité est utile ?
-   Est-ce que tout ou partie de la fonctionnalité demandée est superflue ?
-   Est-ce que le besoin peut être simplifié, plus sobre ?

Cette démarche d’éco-conception s’aligne d’ailleurs parfaitement avec les réflexions produit qui consistent à définir un Minimum Viable Product à travers des ateliers de priorisation comme le MoSCoW (Must, Should, Could, Would Have) ou encore le story mapping.

Sur une application existante, on pourra par exemple mesurer le taux d’utilisation des différentes fonctionnalités et commencer par désactiver les fonctionnalités non utilisées.

#### À l’étape de conception des interfaces

On pourra réfléchir à optimiser le design et le parcours sur l’interface avec quelques réflexes simples :
-   Optimiser le parcours utilisateur en réduisant au maximum le nombre d’écrans et d’étapes pour réduire le nombre de pages et d'éléments à charger.

-   Penser responsive dès le design des interfaces pour éviter la duplication des pages et des contenus. On préférera ainsi concevoir en mobile first, qui est le support le plus contraignant, et ensuite adapter au Desktop et aux autres formats.

-   Opter pour un design épuré pour une meilleure lisibilité et accessibilité de votre site. Privilégier par exemple les icônes aux images, limiter les images lourdes et utiliser les formats webs pour améliorer les temps de chargement, éviter au maximum les animations, vidéos, GIF.
    Réutiliser les images : vous n’avez pas forcément besoin d’une nouvelle image pour chaque page ou contenu !

-   Bien penser le contenu et le découpage des encarts de texte pour faciliter la lecture et encore une fois l’accessibilité (plus d’infos dans l’article [UX WRITING : INTRODUCTION ET BONNES PRATIQUES]({BASE_URL}/fr/UX-Writing-Introduction-et-bonnes-pratiques/))

-   Limiter le nombre de polices et de couleurs utilisées

#### À l’étape de conception technique
Il conviendra de challenger régulièrement, avec l’équipe de développement, les aspects fonctionnels et techniques :
-   A-t-on besoin de toutes ces données ?
    Qualifier la donnée allégera votre UX et vos bases de données.

-   A-t-on besoin que la fonctionnalité soit en temps réel ?
    Si ce n’est pas le cas, traiter la demande quand les serveurs sont le moins sous pression ou, si vous le pouvez, lancer une instance serveur pour traiter toutes les demandes en même temps permettra de réduire la consommation de votre infrastructure. Cela passe par de l’asynchrone, avec [RabbitMQ]({BASE_URL}/tag/rabbitmq.html) par exemple.

-   Peut-on favoriser un moteur de recherche performant ou des filtres pour que l’utilisateur puisse affiner une recherche par exemple et accéder plus rapidement à l’information ?

-   Peut-on utiliser une pagination plutôt qu’un scroll infini (qui inciterait l’utilisateur à charger plus de contenus) et pourquoi pas laisser l’utilisateur libre d’afficher un certain nombre de résultats par page ?

Pour aller plus loin, on vous conseille de consulter ce [Trello sur la performance et l'éco-conception](https://trello.com/b/4Qfmzwhb/performance-et-%C3%A9co-conception).

### Optimiser votre code 👩‍💻
Que vous soyez développeur front ou back, vous avez un rôle à jouer.
Le collectif Green IT propose une [liste de recommandations](https://collectif.greenit.fr/ecoconception-web/115-bonnes-pratiques-eco-conception_web.html) qui donnent de nombreuses pistes.
Il s’agit principalement de pratiques de bon sens que vous utilisez déjà au quotidien, comme la limitation des requêtes HTTP, d’utiliser du cache ou de faire du responsive efficace.

Pour ce qui sort un peu de l’ordinaire, il y a un travail à faire sur les logs et leur pertinence. Par habitude, on peut avoir tendance à faire des logs très complets pour une erreur ou une exception. Vous pouvez vous poser la question de la pertinence de chaque log que vous allez enregistrer, car une exception “normale” n’a pas forcément besoin d’être loggée.


Si vous devez éco-travailler sur un site web existant, vous pouvez faire un bilan de l’impact carbone avec des outils comme [Arneo - Eco-conception](https://ecoconception.arneogroup.com), [GreenFrame](https://greenframe.io/) ou encore [EcoMeter](http://www.ecometer.org/).

Bonne nouvelle, le blog d’Eleven Labs obtient un A !

![Le blog d'Eleven passe le test]({BASE_URL}/imgs/articles/2021-05-24-leco-conception/blog-eleven-result.png)

Pour la consommation électrique, vous avez [Scaphandre](https://github.com/hubblo-org/scaphandre) qui vous permettra d’avoir des métrics de vos services et de savoir quels services il serait intéressant d’optimiser.

### Des serveurs plus adaptés🍺

On a la chance d’avoir des offres sur le marché de serveurs virtualisés et scalables : en fonction du besoin, votre nombre de serveurs peut diminuer ou augmenter et/ou avoir des instances avec des capacités différentes.

Ne consommer que ce qui est utilisé, cela évite le gaspillage d’énergie, ou permet du moins de le rediriger vers des services qui en ont besoin.

## Au-delà de l’impact environnemental, quels bénéfices mesurables ? 📏

-   **Bon pour l’expérience utilisateur** : côté fonctionnel et design “Less is more”. En réduisant le nombre de fonctionnalités et en simplifiant le design et les interfaces, on sert avant tout l’utilisateur en lui permettant une utilisation plus simple, plus fluide et qui va à l’essentiel !

-   **Bon pour l’accessibilité** : le contenu est simplifié, optimisé et ainsi accessible facilement et rapidement mais également par un public plus élargi !

-   **Bon pour votre taux de rebond** : en allégeant les temps de chargement, vous améliorez l’expérience utilisateur et avez plus de chance de convertir vos prospects et de fidéliser vos clients !

-   **Bon pour votre référencement** : le contenu est plus accessible, le SEO est optimisé, le moteur de recherche vous le rendra bien en vous donnant une meilleure visibilité !

-   **Bon pour la sécurité** : Alléger votre site des fonctionnalités superflues permet d’épurer du code vulnérable aux attaques des pirates informatiques.

-   **Bon pour votre image** : tout comme les entreprises de biens matériels soignent leur politique RSE, soyez les pionniers du low-tech, engagez-vous dans l’éco-conception, vos utilisateurs vous le rendront !

-   **Et enfin bon pour votre porte-monnaie !** On développe moins de fonctionnalités inutiles, on réduit les coûts de développement et les coûts d’infrastructure.

## Comment faire sa veille ? 🕵️

Plusieurs collectifs existent et proposent un contenu sur la culture générale et/ou l’éco-conception :
-   [Green IT](https://www.greenit.fr/) et [son collectif](https://collectif.greenit.fr/)
-   [The Shift Project](https://theshiftproject.org/)

## Et vous, dans votre quotidien ? 🌱

Eco-concevoir va de paire avec l’éco-consommation. Au quotidien, vous pouvez adopter la sobriété numérique pour réduire la pollution :
-   Réparer vos appareils plutôt que de les remplacer, sinon privilégier de l’occasion
-   Regarder moins de vidéos, et en basse définition si possible
-   Faire régulièrement du ménage dans vos données/emails
-   Se poser des questions sur le besoin des objets connectés
-   Vérifier si vos applications sont écolo avec [ClickClean](http://www.clickclean.org/france/fr/) grâce à Greenpeace

Jean-Marc Jancovici explique le concept avec une vidéo en 240p.
<iframe width="560" height="315" src="https://www.youtube.com/embed/muBTIVjS8sA" frameborder="0" allowfullscreen></iframe>

## Sources 📚
- [ADEME](https://www.ademe.fr/)
- [Article Wikipedia Ecoconception](https://fr.wikipedia.org/wiki/%C3%89coconception)
- [Youtube: Eco-concevoir un site web : Retour d’expérience - Romain PETIOT](https://www.youtube.com/watch?v=CbGCG0glAnc)
- [Youtube: Green IT is the new web - Julie Guillerm](https://www.youtube.com/watch?v=SWVCmYGmTsE)
- [Collectif Green IT: Les 115 bonnes pratiques](https://collectif.greenit.fr/ecoconception-web/115-bonnes-pratiques-eco-conception_web.html)
  [https://www.codeur.com/blog/eco-conception-web-site-ecologique/](https://www.codeur.com/blog/eco-conception-web-site-ecologique/)
- [La grande Ourse: GREEN UX : Pourquoi opter pour l’Éco-conception?](https://lagrandeourse.design/blog/actualites/eco-conception/)
- [Codeur mag: UX Design : 6 bonnes pratiques pour un site écologique](https://www.codeur.com/blog/ux-design-ecologie/)
- [Wallonie Design: Éco-conception : la sobriété numérique passe aussi par le design](http://walloniedesign.be/dossiers/eco-conception-web/)
