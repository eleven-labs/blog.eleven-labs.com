---
layout: post
title: Microdata ou microdonnées
author: stephane
date: '2015-05-11 10:05:07 +0200'
date_gmt: '2015-05-11 08:05:07 +0200'
categories:
- Non classé
tags:
- microdata
- bdd
---
{% raw %}
A l’heure où tout le monde ne parle que de Big data, je vais tenter de vous présenter les microdata.

Ces derniers temps, beaucoup de nouveautés sont apparues pour les intégrateurs web du monde entier tels les microformats, microdata (ou microdonnées en français) ou encore de nouvelles balises sémantiques.

Bien que les microformats existent depuis quelques années, l’avènement de la spécification HTML5 a accéléré leur utilisation.

## Qu'est-ce-que c'est ?
HTML5 apporte de nouvelles balises pour décrire de manière encore plus précise un contenu. Les nouveaux éléments de section d’une page html (header, section, footer …) et les nouvelles balises (time, video, audio …).

L’utilisation des microdonnées transmises dans vos codes sources participe à l’amélioration et à la pertinence dans les pages de résultats de vos moteurs de recherche préférés.

Les microdata ou microdonnées, en français dans le texte, sont un moyen d’associer des libellés à du contenu afin de décrire un type d’information spécifique. Plus simplement, il permet de transmettre des informations sur le contenu et de le préciser.

## Quels sont les nouveaux attributs ?
<ul>
<li><strong>itemscope</strong> : il crée un élément et indique que les descendants de cette balise HTML contiennent des informations à son sujet</li>
<li><strong>itemtype</strong> : c’est une URL pointant vers un vocabulaire qui décrit l’élément et ses propriétés</li>
<li><strong>itemid</strong> : c’est un identifiant unique pour l’élément</li>
<li><strong>itemprop</strong> : il est porteur d’une valeur permettant de préciser la nature d’une donnée au sein d’un schéma spécifié précédemment</li>
<li><strong>itemref</strong> : il permet de faire le lien complémentaire entre deux données sans descendance</li>
</ul>
## Mais comment ça marche ?
Pour renseigner ces attributs, un vocabulaire spécifique à chaque type d’identification (société, personne, événement…) est nécessaire. <strong>Schema.org</strong>, initiative commune de <strong>Google</strong>, <strong>Yahoo</strong>, <strong>Bing</strong>, et <strong>Yandex</strong> est devenu la référence sur ce sujet.

Les moteurs de recherche comptent sur ce balisage pour améliorer l'affichage des résultats de recherche, et pour les gens à trouver les pages web les plus pertinentes par rapport à leur recherche.

Nous allons voir un premier exemple que vous avez probablement rencontré dans les résultats de Google.

[caption id="attachment_1143" align="aligncenter" width="383"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2015/05/Capture-d’écran-2015-05-06-à-09.54.20.png"><img class=" wp-image-1143" src="http://blog.eleven-labs.com/wp-content/uploads/2015/05/Capture-d’écran-2015-05-06-à-09.54.20-300x68.png" alt="Résultat Google avec microdata" width="383" height="87" /></a> résultat Google avec microdata[/caption]

Voici une version HTML de l’exemple ci-dessus :

<pre class="lang:default decode:true">&lt;div&gt;
    &lt;h1&gt;Restaurant Chez Clément Elysées à Paris 8ème : Arc de ...&lt;/h1&gt;
	Note : 7,8/10 - 171 votes
    &lt;p&gt;Restaurant Chez Clément Elysées à Paris : Réservez gratuitement…&lt;/p&gt;
    {...}
&lt;/div&gt;</pre>
Voici ce que cela peut donner avec les microdata :

<pre class="lang:default decode:true">&lt;div itemscope itemtype=”http://schema.org/Restaurant”&gt;
    &lt;h1&gt;Restaurant Chez Clément Elysées à Paris 8ème : Arc de ...&lt;/h1&gt;
	Note :
    &lt;span itemprop=”aggregateRating” itemscope itemtype=”http://schema.org/AggregateRating”&gt;
        &lt;span itemprop=”ratingValue”&gt;7,8&lt;/span&gt;/
        &lt;span itemprop=”bestRating”&gt;10&lt;/span&gt; -
        &lt;span itemprop=”ratingCount”&gt;171&lt;/span&gt; votes
    &lt;/span&gt;
    &lt;p itemprop=”description”&gt;Restaurant Chez Clément Elysées à Paris : Réservez gratuitement…&lt;/p&gt;

    {...}
&lt;/div&gt;
</pre>
Maintenant, nous allons voir un exemple d’une notation simple pour une société.

Eleven Labs<br />
81 rue de Courcelles 75017 Paris<br />
+33 1 82 83 11 75<br />
contact@eleven-labs.com

La version HTML avec les microdata :

<pre class="lang:default decode:true">&lt;div itemscope itemtype=”http://schema.org/Corporation”&gt;
    &lt;span itemprop=”name”&gt;Eleven Labs&lt;/span&gt;
    &lt;span itemprop=”streetAddress”&gt;81 rue de Courcelles&lt;/span&gt;
    &lt;span itemprop=”postalCode”&gt;75017&lt;/span&gt;
    &lt;span itemprop=”adressLocality”&gt;Paris&lt;/span&gt;
    &lt;span itemprop=”telephone”&gt;+33 1 82 83 11 75&lt;/span&gt;
    &lt;span itemprop=”email”&gt;contact@eleven-labs.com&lt;/span&gt;
&lt;/div&gt;</pre>
Ci-dessous un exemple d'une notation imbriquée pour un événement.

Wilson Coding Battlespace<br />
Bataille de code entre les 4 planètes.<br />
La 1ère édition aura lieu le jeudi 26 mars 2015 dans les locaux de Eleven Labs au 81 rue de Courcelles, 75017 Paris.

La version HTML avec les microdata :

<pre class="lang:default decode:true">&lt;article itemscope itemtype=”http://schema.org/Event”&gt;
    &lt;h1 itemprop=”name”&gt;Wilson Coding Battlespace&lt;/h1&gt;
    &lt;p itemprop=”description”&gt;Bataille de code entre les 4 planètes.&lt;/p&gt;
    &lt;p&gt;La 1ère édition aura lieu le jeudi
    &lt;time date=”2015-03-26” itemprop=”startDate”&gt;26 mars 2015&lt;/time&gt;
dans les locaux de
	&lt;!-- Début de l’imbrication --&gt;
	&lt;span itemscope itemtype=”http://schema.org/Corporation”&gt;
	    &lt;span itemprop=”name”&gt;Eleven Labs&lt;/span&gt; au
	    &lt;span itemprop=”streetAddress”&gt;81 rue de Courcelles&lt;/span&gt;,
	    &lt;span itemprop=”postalCode”&gt;75017&lt;/span&gt;
 	    &lt;span itemprop=”adressLocality”&gt;Paris&lt;/span&gt;.
	&lt;/span&gt;
        &lt;!-- Fin de l’imbrication --&gt;
    &lt;/p&gt;
&lt;/article&gt;</pre>
Voici un exemple d’offre d’emploi issu du site <a href="http://www.eleven-labs.com">eleven-labs.com</a> :

Version HTML

<pre class="lang:default decode:true">&lt;div&gt;
    &lt;h1&gt;Développeur Front-End&lt;/h2&gt;
    &lt;h2&gt;LE POSTE&lt;/h2&gt;
    &lt;p&gt;Tu es passionné de l'Open Source, monstre sur HTML5 et CSS3, torpille au babyfoot et pro du Scrum ? Tu aimes partager tes connaissances et tu es toujours prêt à tester des nouvelles technos ?&lt;/p&gt;
    &lt;strong&gt;Welcome home !&lt;/strong&gt;
    &lt;p&gt;On compte sur toi pour venir construire la prochaine fusée front d'Eleven Labs!&lt;/p&gt;
    &lt;h2&gt;TA BOÎTE À OUTILS&lt;/h2&gt;
    &lt;ul&gt;
	&lt;li&gt;Maîtrise du HTML5/ CSS3&lt;/li&gt;
        &lt;li&gt;Maîtrise de Javascript&lt;/li&gt;
        &lt;li&gt;Maîtrise d'au moins un framework MVW (Backbone, Ember, Angular...)&lt;/li&gt;
        &lt;li&gt;Maîtrise d'au moins un framework front end (Bootstrap, Foundation, Pure.IO)&lt;/li&gt;
        &lt;li&gt;Expertise en Responsive Design&lt;/li&gt;
        &lt;li&gt;Utilisation d'un pré-processeur de type SASS ou LESS&lt;/li&gt;
        &lt;li&gt;Bonne connaissance GIT&lt;/li&gt;
        &lt;li&gt;Connaissances en PHP&lt;/li&gt;
        &lt;li&gt;Une bonne connaissance de Grunt et Bower est un plus&lt;/li&gt;
        &lt;li&gt;Familier avec les standards du web (W3C, accessibilité)&lt;/li&gt;
    &lt;/ul&gt;
    &lt;p&gt;Tu penses pouvoir relever le défi ? Entre dans la station Eleven Labs!&lt;/p&gt;
&lt;/div&gt;</pre>
Voici la version avec les microdata :

<pre class="lang:default decode:true">&lt;div itemscope itemtype=”http://schema.org/JobPosting”&gt;
    &lt;h1 itemprop=”title”&gt;Développeur Front-End&lt;/h2&gt;
    &lt;h2&gt;LE POSTE&lt;/h2&gt;
    &lt;p itemprop=”description”&gt;Tu es passionné de l'Open Source, monstre sur HTML5 et CSS3, torpille au babyfoot et pro du Scrum ? Tu aimes partager tes connaissances et tu es toujours prêt à tester des nouvelles technos ?&lt;/p&gt;
    &lt;strong&gt;Welcome home !&lt;/strong&gt;
    &lt;p&gt;On compte sur toi pour venir construire la prochaine fusée front d'Eleven Labs!&lt;/p&gt;
    &lt;h2&gt;TA BOÎTE À OUTILS&lt;/h2&gt;
    &lt;ul itemprop=”skills”&gt;
	&lt;li&gt;Maîtrise du HTML5/ CSS3&lt;/li&gt;
        &lt;li&gt;Maîtrise de Javascript&lt;/li&gt;
        &lt;li&gt;Maîtrise d'au moins un framework MVW (Backbone, Ember, Angular...)&lt;/li&gt;
        &lt;li&gt;Maîtrise d'au moins un framework front end (Bootstrap, Foundation, Pure.IO)&lt;/li&gt;
        &lt;li&gt;Expertise en Responsive Design&lt;/li&gt;
        &lt;li&gt;Utilisation d'un pré-processeur de type SASS ou LESS&lt;/li&gt;
        &lt;li&gt;Bonne connaissance GIT&lt;/li&gt;
        &lt;li&gt;Connaissances en PHP&lt;/li&gt;
        &lt;li&gt;Une bonne connaissance de Grunt et Bower est un plus&lt;/li&gt;
        &lt;li&gt;Familier avec les standards du web (W3C, accessibilité)&lt;/li&gt;
    &lt;/ul&gt;
    &lt;p&gt;Tu penses pouvoir relever le défi ? Entre dans la station Eleven Labs!&lt;/p&gt;
&lt;/div&gt;</pre>
En fait tout se joue au niveau du vocabulaire utilisé car plus il est précis et plus vous pourrez donner du sens à votre contenu. Schema.org propose une arborescence et présente une hiérarchie assez profonde qui touche à des domaines très variés. Le principe est simple : plus vous descendez dans l'arborescence, plus le vocabulaire se précisera.

## En conclusion
Schema.org propose de nombreux vocabulaires adaptés à beaucoup de situations ainsi qu’une grande souplesse dans son utilisation.

Les principaux moteurs de recherche prennent en charge le vocabulaire schema.org pour l'affichage des résultats de recherche. Maintenant tout est là pour faire de la sémantique un atout indéniable pour le référencement de vos sites.

Pour finir, je ne sais pas de quoi le web sera fait à l'avenir : le Big data, les Microdata... Je ne suis pas médium !

## Quelques ressources
<a href="http://schema.org">http://schema.org</a><br />
<a href="https://developers.google.com/structured-data/">https://developers.google.com/structured-data/<br />
https://developers.google.com/structured-data/testing-tool/<br />
</a>

Google propose également un <a href="http://www.google.com/webmasters/tools/richsnippets">outil d'analyse</a> de vos pages à la recherche qui détecte le schéma utilisé et vous fait un rapport sur les données trouvées, leur formatage ainsi que les éventuelles erreurs rencontrées.

{% endraw %}
