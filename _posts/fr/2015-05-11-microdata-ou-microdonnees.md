---
layout: post
title: Microdata ou microdonnées
lang: fr
permalink: /fr/microdata-ou-microdonnees/
excerpt: Présentation des microdata ou microdonnées, leur implémentation dans les pages web, et leur utilité pour le SEO ou référencement naturel.
authors:
 - seinhorn
permalink: /fr/microdata-ou-microdonnees/
categories:
    - blog
tags:
    - microdata
    - seo

date: 2015-05-11 10:05:07 +0200
date_gmt: 2015-05-11 08:05:07 +0200

cover: 
---

A l’heure où tout le monde ne parle que de Big data, je vais tenter de vous présenter les microdata.

Ces derniers temps, beaucoup de nouveautés sont apparues pour les intégrateurs web du monde entier tels les microformats, microdata (ou microdonnées en français) ou encore de nouvelles balises sémantiques.

Bien que les microformats existent depuis quelques années, l’avènement de la spécification HTML5 a accéléré leur utilisation.

## Qu'est-ce-que les microdata ou microdonnées ?

HTML5 apporte de nouvelles balises pour décrire de manière encore plus précise un contenu. Les nouveaux éléments de section d’une page html (header, section, footer …) et les nouvelles balises (time, video, audio …).

L’utilisation des microdonnées transmises dans vos codes sources participe à l’amélioration et à la pertinence dans les pages de résultats de vos moteurs de recherche préférés.

Les microdata ou microdonnées, en français dans le texte, sont un moyen d’associer des libellés à du contenu afin de décrire un type d’information spécifique. Plus simplement, il permet de transmettre des informations sur le contenu et de le préciser.

### Quels sont les nouveaux attributs ?

- **itemscope** : il crée un élément et indique que les descendants de cette balise HTML contiennent des informations à son sujet
- **itemtype** : c’est une URL pointant vers un vocabulaire qui décrit l’élément et ses propriétés
- **itemid** : c’est un identifiant unique pour l’élément
- **itemprop** : il est porteur d’une valeur permettant de préciser la nature d’une donnée au sein d’un schéma spécifié précédemment
- **itemref** : il permet de faire le lien complémentaire entre deux données sans descendance

### Comment ça marche ?

Pour renseigner ces attributs, un vocabulaire spécifique à chaque type d’identification (société, personne, événement…) est nécessaire. **Schema.org**, initiative commune de **Google**, **Yahoo**, **Bing**, et **Yandex** est devenu la référence sur ce sujet.

Les moteurs de recherche comptent sur ce balisage pour améliorer l'affichage des résultats de recherche, et pour les gens à trouver les pages web les plus pertinentes par rapport à leur recherche.

## Exemples d'utilisation

Nous allons voir un premier exemple que vous avez probablement rencontré dans les résultats de Google.

![Résultat Google avec microdata](/assets/2015-05-11-microdata-ou-microdonnees/Capture-decran-2015-05-06-a-09.54.20.png)

Voici une version HTML de l’exemple ci-dessus :

```html
<div>
    <h1>Restaurant Chez Clément Elysées à Paris 8ème : Arc de ...</h1>
    Note : 7,8/10 - 171 votes
    <p>Restaurant Chez Clément Elysées à Paris : Réservez gratuitement…</p>
    <!-- {...} -->
</div>
```

Voici ce que cela peut donner avec les microdata :

```html
<div itemscope itemtype=”http://schema.org/Restaurant”>
    <h1>Restaurant Chez Clément Elysées à Paris 8ème : Arc de ...</h1>
    Note :
    <span itemprop=”aggregateRating” itemscope itemtype=”http://schema.org/AggregateRating”>
        <span itemprop=”ratingValue”>7,8</span>/
        <span itemprop=”bestRating”>10</span> -
        <span itemprop=”ratingCount”>171</span> votes
    </span>
    <p itemprop=”description”>Restaurant Chez Clément Elysées à Paris : Réservez gratuitement…</p>
    <!-- {...} -->
</div>
```

### Notation simple

Maintenant, nous allons voir un exemple d’une notation simple pour une société.

Eleven Labs
81 rue de Courcelles 75017 Paris
+33 1 82 83 11 75
contact@eleven-labs.com

La version HTML avec les microdata :

```html
<div itemscope itemtype=”http://schema.org/Corporation”>
    <span itemprop=”name”>Eleven Labs</span>
    <span itemprop=”streetAddress”>81 rue de Courcelles</span>
    <span itemprop=”postalCode”>75017</span>
    <span itemprop=”adressLocality”>Paris</span>
    <span itemprop=”telephone”>+33 1 82 83 11 75</span>
    <span itemprop=”email”>contact@eleven-labs.com</span>
</div>
```

### Notation imbriquée

Ci-dessous un exemple d’une notation imbriquée pour un événement.

Wilson Coding Battlespace
Bataille de code entre les 4 planètes.
La 1ère édition aura lieu le jeudi 26 mars 2015 dans les locaux de Eleven Labs au 81 rue de Courcelles, 75017 Paris.

La version HTML avec les microdata :

```html
<article itemscope itemtype=”http://schema.org/Event”>
    <h1 itemprop=”name”>Wilson Coding Battlespace</h1>
    <p itemprop=”description”>Bataille de code entre les 4 planètes.</p>
    <p>La 1ère édition aura lieu le jeudi
    <time date=”2015-03-26” itemprop=”startDate”>26 mars 2015</time>
dans les locaux de
    <!-- Début de l’imbrication -->
    <span itemscope itemtype=”http://schema.org/Corporation”>
        <span itemprop=”name”>Eleven Labs</span> au
        <span itemprop=”streetAddress”>81 rue de Courcelles</span>,
        <span itemprop=”postalCode”>75017</span>
        <span itemprop=”adressLocality”>Paris</span>.
    </span>
        <!-- Fin de l’imbrication -->
    </p>
</article>
```

### Autre exemple

Voici un exemple d’offre d’emploi issu du site [eleven-labs.com](http://www.eleven-labs.com) :

Version HTML

```html
<div>
    <h1>Développeur Front-End</h2>
    <h2>LE POSTE</h2>
    <p>Tu es passionné de l'Open Source, monstre sur HTML5 et CSS3, torpille au babyfoot et pro du Scrum ? Tu aimes partager tes connaissances et tu es toujours prêt à tester des nouvelles technos ?</p>
    <strong>Welcome home !</strong>
    <p>On compte sur toi pour venir construire la prochaine fusée front d'Eleven Labs!</p>
    <h2>TA BOÎTE À OUTILS</h2>
    <ul>
    <li>Maîtrise du HTML5/ CSS3</li>
        <li>Maîtrise de Javascript</li>
        <li>Maîtrise d'au moins un framework MVW (Backbone, Ember, Angular...)</li>
        <li>Maîtrise d'au moins un framework front end (Bootstrap, Foundation, Pure.IO)</li>
        <li>Expertise en Responsive Design</li>
        <li>Utilisation d'un pré-processeur de type SASS ou LESS</li>
        <li>Bonne connaissance GIT</li>
        <li>Connaissances en PHP</li>
        <li>Une bonne connaissance de Grunt et Bower est un plus</li>
        <li>Familier avec les standards du web (W3C, accessibilité)</li>
    </ul>
    <p>Tu penses pouvoir relever le défi ? Entre dans la station Eleven Labs!</p>
</div>
```

Voici la version avec les microdata :

```html
<div itemscope itemtype=”http://schema.org/JobPosting”>
    <h1 itemprop=”title”>Développeur Front-End</h2>
    <h2>LE POSTE</h2>
    <p itemprop=”description”>Tu es passionné de l'Open Source, monstre sur HTML5 et CSS3, torpille au babyfoot et pro du Scrum ? Tu aimes partager tes connaissances et tu es toujours prêt à tester des nouvelles technos ?</p>
    <strong>Welcome home !</strong>
    <p>On compte sur toi pour venir construire la prochaine fusée front d'Eleven Labs!</p>
    <h2>TA BOÎTE À OUTILS</h2>
    <ul itemprop=”skills”>
    <li>Maîtrise du HTML5/ CSS3</li>
        <li>Maîtrise de Javascript</li>
        <li>Maîtrise d'au moins un framework MVW (Backbone, Ember, Angular...)</li>
        <li>Maîtrise d'au moins un framework front end (Bootstrap, Foundation, Pure.IO)</li>
        <li>Expertise en Responsive Design</li>
        <li>Utilisation d'un pré-processeur de type SASS ou LESS</li>
        <li>Bonne connaissance GIT</li>
        <li>Connaissances en PHP</li>
        <li>Une bonne connaissance de Grunt et Bower est un plus</li>
        <li>Familier avec les standards du web (W3C, accessibilité)</li>
    </ul>
    <p>Tu penses pouvoir relever le défi ? Entre dans la station Eleven Labs!</p>
</div>
```

En fait tout se joue au niveau du vocabulaire utilisé car plus il est précis et plus vous pourrez donner du sens à votre contenu. Schema.org propose une arborescence et présente une hiérarchie assez profonde qui touche à des domaines très variés. Le principe est simple : plus vous descendez dans l'arborescence, plus le vocabulaire se précisera.

## En conclusion

Schema.org propose de nombreux vocabulaires adaptés à beaucoup de situations ainsi qu’une grande souplesse dans son utilisation.

Les principaux moteurs de recherche prennent en charge le vocabulaire schema.org pour l'affichage des résultats de recherche. Maintenant tout est là pour faire de la sémantique un atout indéniable pour le référencement de vos sites.

Pour finir, je ne sais pas de quoi le web sera fait à l'avenir : le Big data, les Microdata... Je ne suis pas médium !

### Quelques ressources

- [Schema.org](http://schema.org)
- [Introduction to Structured Data](https://developers.google.com/structured-data/)

Google propose également un [outil d'analyse](http://www.google.com/webmasters/tools/richsnippets) de vos pages à la recherche qui détecte le schéma utilisé et vous fait un rapport sur les données trouvées, leur formatage ainsi que les éventuelles erreurs rencontrées.
