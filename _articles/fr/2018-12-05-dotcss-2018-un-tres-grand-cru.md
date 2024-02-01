---
contentType: article
lang: fr
date: '2018-12-05'
slug: dotcss-2018-un-tres-grand-cru
title: 'dotCSS 2018, un très grand cru !'
excerpt: >-
  Retour sur l'édition 2018 de dotCSS, la plus grande conférence au monde sur le
  CSS.
cover: /assets/2018-12-05-dotcss-2018-un-tres-grand-cru/dotcss-2018.jpg
categories: []
authors:
  - seinhorn
keywords:
  - conference
  - css
  - paris
  - '2018'
  - intégrateur web
  - designer web
---

[DotCSS](https://www.dotcss.io/), la plus grande conférence sur le CSS au monde, a eu lieu le 8 novembre 2018 à Paris... plus précisément au Dock Pullman à Aubervilliers.

Cauchemar dans la gestion des textes en dehors de leur cadre, filtres SVG, internationalisation, accessibilité et polices de caractères variables étaient au programme de cette édition.

## La gestion des sauts de ligne... un véritable cauchemar

![Le cauchemar de la gestion des sauts de ligne]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/line-breaking.png)

Pour gérer les sauts de ligne (line-break) des contenus de nos éléments HTML, on a tendance à utiliser la configuration standard des espaces blancs (white-space).

Les règles CSS relatives aux espaces utilisent plusieurs étapes pour la gestion des espaces. L'attribut lang en HTML affecte particulièrement la gestion de la césure d'un mot par le navigateur.

Les propriétés les plus couramment utilisées pour la gestion des espaces blancs sont white-space: nowrap, white-space: normal, white-space: pre. Or, il existe de nombreuses manières de casser notre contenu, et chaque manière spécifique peut aider à atteindre un résultat ou un autre.

[Florian Rivoal](https://twitter.com/frivoal) nous a éclairé avec son exposé sur les différentes manières de séparer les lignes, leur utilité pour certaines langues et leurs inconvénients. Il a également présenté quelques nouvelles fonctionnalités pour mieux gérer les sauts de ligne et le retour à la ligne, déjà implémentés dans certains navigateurs.

En voici une liste non exhaustive : white-space, overflow-wrap, hyphens (césure des mots), word-break, line-break, et la balise HTML .

Même si, une fois n'est pas coutume, la compatibilité navigateur reste une contrainte, Florian nous encourage vivement à utiliser toutes ces propriétés et à plonger dans leurs particularités.

Le choix de leur utilisation dépend finalement des besoins linguistiques et de la fonction d'affichage de votre texte, comme par exemple s'il s'agit d'une poésie ou d'un texte brut.

[Lire la présentation sur "line-breaking"](https://florian.rivoal.net/talks/line-breaking/)

[Voir l'exposé de Florian Rivoal en vidéo](https://www.dotconferences.com/2018/11/florian-rivoal-line-breaking)

## Casser les normes en utilisant du CSS créatif

Aga Naplocha part donc du constat qu'aujourd'hui il est difficile de trouver l'inspiration et d'être créatif quand on conçoit des interfaces web. En effet, la plupart des sites utilisent 3 boîtes principales et une grille de 12 colonnes pour leur mise en page.

Afin de retrouver un nouveau souffle créatif, elle se pencha sur le monde du "print" et du design éditorial.

**Comment retranscrire en CSS la créativité du monde hors ligne ?**

Les propriétés CSS que l'on peut utiliser de manière créative sont nombreuses, de plus en plus performantes, et leur support par les navigateurs est plutôt bon.

Aga nous présente quelques propriétés à utiliser :

* **CSS Grid Layout** : le nouveau système de grille, considéré comme le futur (et même le présent) de la mise en forme des pages web. À mettre en place de concert avec "Flexbox" pour utiliser la puissance des deux systèmes.
* **Clip-path** permet d'afficher une zone spécifique d'un élément défini par des formes, comme un cercle ou un triangle, mais aussi avec des SVG.
* **Mask** : propriété sensiblement identique à clip-path, mais qui permet la gestion de la transparence et des images.
* **Shape-outside** est une propriété qui permet d'envelopper du texte selon la forme de votre image.

Découvrez la [présentation en vidéo de Aga Naplocha](https://www.youtube.com/watch?v=y16qppUSheE)

## Les filtres SVG

![Sara Soueidan à dotCSS 2018]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/sara-soueidan-dotcss2018.jpg)

Sara Soueidan, développeuse web front-end freelance, formatrice et auteure, a animé un cours accéléré sur la mise en œuvre des filtres SVG sur nos sites Web. Elle nous a démontré qu'il est possible de créer des effets similaires à ceux de Photoshop.

### Qu'est-ce-que le SVG ?

Le format SVG (Scalable Vector Graphics) est un format de données décrivant des images vectorielles bidimensionnelles. Il présente 2 avantages principaux : sa légèreté et son redimensionnement sans perte de qualité. De plus, on peut facilement le manipuler avec du CSS.

### Qu'est-ce-qu'un filtre SVG ?

C'est tout simplement une fonction qui permet d'appliquer un ou plusieurs traitements à une image.

De nombreux filtres sont à notre disposition, comme le flou, la déformation, ou les effets de lumière. Ces filtres peuvent être utilisés en cascade, ce qui offre plein de possibilités. Cette technique est largement répandue puisque vous l'utilisez quotidiennement sur Instagram pour styliser vos photos.

### Exemples de filtres SVG

* _feBlend_ permet de combiner 2 objets en utilisant un mode de fusion (comme fusionner 2 calques sur Photoshop)
* _feColorMatrix_ change l'apparence d'un élément, comme la sutaration
* _feDropShadow_ crée une ombre portée sur l'image
* _feGaussianBlur_ applique un effet de flou à l'image
* _feComponentTransfer_ permet notamment de régler la luminosité ou le constraste d'une image en jouant sur ses différentes couches d'informations chromatiques (Rouge, Vert, Bleu et Alpha)

### Comment ajouter un filtre SVG ?

Les filtres CSS standards sont bien, mais assez limités si on souhaite décorer des images. Une petite astuce consiste à utiliser url() pour appliquer les filtres SVG personnalisés.

Prenons un exemple concret : rendre une image floue.

![Comparaison entre le filtre CSS blur() et sa version SVG]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/svg-filtre-blur.png)

Si on utilise le filtre CSS standard blur(), on obtiendra un effet de flou radial uniforme sur les axes X et Y. Cependant, si nous voulons un flou spécifique affectant un seul des axes, nous aurons besoin d'un filtre SVG personnalisé pour obtenir ce résultat. Certains effets ne peuvent être obtenus que par les filtres SVG.

Pour ce faire, voici à quoi ressemble le code :

```
<svg width="600" height="450" viewBox="0 0 600 450">
 <filter id="monFiltre">
  <!-- Mettre ici les opérations de filtrage -->
 </filter>
 <image xlink:href=".Mon Image."
       width="100%" height="100%" x="0" y="0"
       filter="url(#monFiltre)">
 </image>
</svg>
```

Ainsi, on affecte ou modifie l'image d'origine et on lui applique des opérations de filtrage sous forme de calques. C'est le même concept que sur Photoshop.

### Exemples de filtres SVG présentés par Sara

* [Effet de dispersion](https://codepen.io/SaraSoueidan/pen/fae98b2d1ef55ed56b0ef3e5bb1a5f5e)
* [Effet bichromie](https://codepen.io/SaraSoueidan/pen/898c0dbac0c8d1f362f8904a7d9fe911)
* Plus d'exemples d'[effets réalisables à l'aide des filtres SVG](https://codepen.io/collection/0b42ddcbfbd4072bbe500bab9e139563/)

En conclusion, les filtres SVG sont un excellent moyen d'obtenir des éléments ludiques, décoratifs et accessibles. Leur exploration et leurs possibilités n'en sont qu'à leurs débuts. Mais, leur utilisation présente de nombreux avantages : le contenu reste éditable et dynamique, ils sont faciles à modifier, et les effets peuvent être animés.

Au final, il est donc possible de recréer la majorité des filtres Photoshop... mais pas tous.

[Lire la présentation sur les filtres SVG](https://www.sarasoueidan.com/blog/svg-filters/)

[Voir l'exposé de Sara Soueidan en vidéo](https://www.dotconferences.com/2018/11/sara-soueidan-svg-filters/)

## Un bref aperçu de l'internationalisation web

Elika J. Etemad, rédactrice principale de spécifications au sein du groupe de travail CSS, nous a présenté quelques principes à prendre en compte pour l'internationalisation (i18n en abrégé) d'un site internet.

### Ne pas confondre traduction et localisation

En effet, chaque pays possède sa(es) propre(s) langue(s), monnaie, lois, géographie, format de date...

De plus, il ne faut pas croire que la langue correspond à la localisation, sachant que certains pays comme la Suisse en utilisent plusieurs.

Pour chaque langue ou lieu, il faut utiliser UTF-8, à savoir '&lt;meta charset="UTF-8"&gt;' dans les documents HTML.

### Comment styliser un site web internationalisé ?

Tout d'abord, il faut préciser la langue de votre site web :

* soit en la renseignant dans les attributs HTML lang (ex. : '&lt;html lang="fr"&gt;')
* soit en utilisant l'en-tête HTTP Content-Language (ex. : Content-Language: fr-FR)

Puis, on pourra utiliser des sélecteurs basés sur la langue de la manière suivante :

```
:lang(fr) {
  // CSS pour des éléments en français
}

[lang]:lang(fr) {
 // CSS qui hérite de la langue racine
}
```

D'autres notions sont également à prendre en compte selon la langue :

* la typographie (pour les langues asiatiques ou avec accents)
* la bidirectionnalité (pour l'hébreu ou l'arabe dont le sens de lecture se fait de droite à gauche)

Pour en savoir plus, je vous recommande la lecture de la [présentation de Elika J. Etemad](http://fantasai.inkedblade.net/style/talks/i18n-primer/).

## Lire les codes de couleur hexadécimaux !

David DeSandro, auteur entre autres des plugins open-source [Masonry](https://masonry.desandro.com/) et [Isotope](https://isotope.metafizzy.co/), est également un designer... daltonien !

### Comment un concepteur d'interface graphique daltonien fait-il pour travailler avec la couleur ?

Réponse de David : pas avec ses yeux !

Au lieu de cela, il se fie à la lecture des codes couleur hexadécimaux.

David nous a partagé son processus pour comprendre ces codes et les informations connexes sur la vision humaine, l'histoire de l'ordinateur et la couleur numérique.

![Comprendre le cercle chromatique]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/hexadecimal-1.png)

### Qu'est-ce-qu'un code hexadécimal de couleur ?

Tout d'abord, un code hexadécimal n'est pas fait pour être compris par les humains, mais par les robots.

Il est composé de 6 chiffres correspondant à 3 octets, où chaque octet représente une composante de rouge, vert et bleu. Un octet a une valeur comprise entre "00", pour la couleur noire, et "FF", pour la couleur blanche.

### Comment apprendre à lire des codes hexadécimaux ?

Devenir un super-héros du web et avoir, comme David, le super pouvoir de lire et traiter les codes couleurs, c'est possible !

David nous présente les 5 étapes à suivre pour déchiffrer le code hexadécimal suivant : [#D49B25](https://www.color-hex.com/color/d49b25).

#### Déterminer la version raccourcie du code hexadécimal de la couleur

Pour l'obtenir, il faut choisir le premier caractère pour chaque composante de couleur RVB :
D4 (rouge), 9B (vert), 25 (bleu), soit [#D92](https://www.color-hex.com/color/dd9922).

#### Le graphique en bâtons

Pour représenter la version courte de notre code hexadécimal, il faut créer un graphique en bâtons, comme dans l'exemple ci-dessous.

![Graphique en bâtons du code hexadécimal et cercle chromatique]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/hexadecimal-2.png)

Plus un chiffre est proche de "F" et plus le bâton du graphique sera grand. Et inversement, plus un chiffre est proche de "0" et plus le bâton du graphique sera petit.

#### La teinte de la couleur

Maintenant, il faut comparer ce graphique à celui du cercle chromatique RVB (couleur primaire, secondaire et tertiaire). Ainsi, la couleur trouvée est le orange.

![Teinte de la couleur du code hexadécimal]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/hexadecimal-3.png)

#### La luminosité de la couleur

Chaque couleur possède trois variantes de luminosité : claire (_Light_), moyenne (_Middle_), et sombre (_Dark_). Pour la connaître, il suffit d'additionner les trois valeurs RGB d'une couleur. Plus la somme est élevée, plus la couleur est claire. Dans notre exemple, la variante de couleur est moyenne.

![Luminosité du code hexadécimal]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/hexadecimal-4.png)

#### La saturation de la couleur

Une couleur possède quatre niveaux de saturation : _Saturated_ (saturé), _Washed_, _Muted_, et _Grey_ (gris).

Pour la déterminer, on utilise l'intervalle entre la valeur RGB la plus faible et la plus élevée de notre couleur.

Si l'intervalle est très grand alors le niveau de saturation sera de type _Saturated_, grand il sera de type _Washed_, moyen il sera _Muted_, et s'il est nul le niveau de saturation sera _Grey_.

Dans notre cas, il est grand, donc la saturation de notre couleur est _Washed_.

![Saturation du code hexadécimal]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/hexadecimal-5.png)

Après toutes ces étapes, nous pouvons dire que le code couleur hexadécimal **#D49B25** représente un **orange moyen avec une saturation washed** (_"middle washed orange"_) !

### Les codes de couleurs raccourcis sont...

* **faciles à lire !**

Comme vu dans la démonstration de David, on peut obtenir une approximation du ton final d'un code hexadécimal en calculant mentalement la quantité de couleur de chaque composant RVB.
* **faciles à choisir**

Mailchimp a récemment choisi une nouvelle palette de couleurs pour leur stratégie de marque. Ils ont donc choisi une palette de couleurs raccourcie au lieu d'une palette complète, sans pour autant s'éloigner des tonalités d'origine. Ainsi, nous pouvons donc avoir une première sélection de couleurs bien contrastées, pures et consistantes.
* **et faciles à changer dans le code**

Pour obtenir facilement une variante légèrement nouvelle d'une couleur définie, on peut jouer avec les composants RVB et leurs valeurs de luminosité, de saturation et de teinte.

Personnellement, ce fut la présentation la plus impressionnante et fascinante de la conférence. Je vous invite vivement à découvrir cet exposé dans son intégralité.

[Lire la présentation sur les codes hexadécimaux](https://www.sarasoueidan.com/blog/svg-filters/)

[Voir l'exposé de David DeSandro en vidéo](https://www.dotconferences.com/2018/11/sara-soueidan-svg-filters<)

## Comment améliorer rapidement l'accessibilité de son site web ?

L'accessibilité est parfois oubliée lorsqu'il s'agit de développer des sites Web. Rendre le Web accessible profite aux particuliers, aux entreprises et à la société.

Le b.a.-ba de l'accessibilité Web :

* une bonne structure de contenu
* un bon contraste de couleur
* des éléments zoomables et des textes redimensionnables (utiliser "rem" pour la taille des polices et "em" pour l'espacement)
* laisser l'état "focus" des éléments
* ne pas oublier les interactions clavier

Ainsi, votre site Web sera plus accessible et convivial à utiliser.

## Les polices variables... et l'avenir de la conception Web

Aujourd'hui, les polices variables sont assez standardisées et compatibles avec la majorité des navigateurs... sauf Internet Explorer et le navigateur Web Android.

Mandy Michael nous explique que les polices variables peuvent améliorer les performances réelles et perçues de notre site web.

### Qu'est-ce qu'une police variable ?

Une police de caractères variable est un format de police incluant une nouvelle technologie appelée "OpenType Font Variation". Cette police peut contenir jusqu'à 64 000 variations d'axes, notamment de poids, largeur, et inclinaison.

### Comment mettre en place une police variable pour son site web ?

L'implémentation de polices variables en CSS est très similaire à ce qu'on fait actuellement.

```
@font-face {
 font-family: "Ma font variable";
 src: url("ma-font-variable.woff") format("woff-variations");
 font-weight: 200 700; // représente la limite de plage de poids de la police
}

h1 {
 font-family: "Ma font variable";
 font-variations-settings: 'wght' 375, 'INLI' 88;
}
```

Dans le code ci-dessus, "wght" représente un axe nommé pour le poids de la police et "INLI" est un axe personnalisé appelé inline.

Comme évoqué précédemment, il faudra mettre en place une solution de secours pour Internet Explorer et le navigateur Web Android.

Voici les quelques modifications à apporter au code précédent :

```
h1 {
 font-family: "Source Sans", sans serif;
 font-weight: 700;
}

@supports (font-variations-settings: normal) {
 h1 {
  font-family: "Ma font variable";
  font-variations-settings: 'wght' 375, 'INLI' 88;
 }
}
```

@support est synonyme de navigateurs compatibles avec les polices variables, "Source Sans" étant la solution de secours.

### Les polices variables représentent-elles l'avenir de la conception Web ?

D'après Mandy, la réponse est oui !

Tous les éléments artistiques et créatifs souhaitées peuvent aujourd'hui être réalisés avec des polices variables, alors qu'auparavant, on devait les faire en image.

![Exemple d'effet réalisable avec une police variable]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/font-variable.png)

D'autres avantages à utiliser les polices variables :

* le texte reste sélectionnable et accessible
* les propriétés peuvent être animées
* moins de poids pour votre site web, donc une meilleur performance

En effet, les différentes variantes de la police (condensé, gras, italique...) sont configurées par un unique fichier de police. Finies les importations multiples de familles de polices !

Quelques exemples pour en découvrir le potentiel :

[https://codepen.io/mandymichael/pen/dJZQaz](https://codepen.io/mandymichael/pen/dJZQaz)

[https://codepen.io/collection/DamKJW/](https://codepen.io/collection/DamKJW/)

[https://codepen.io/collection/XqRLMb/](https://codepen.io/collection/XqRLMb/)

Et aussi, des ressources pour vous plonger sur ce sujet :

[https://v-fonts.com/](https://v-fonts.com/)

[https://www.axis-praxis.org](https://www.axis-praxis.org)

## Conclusion

![Photo finish de dotCSS 2018]({BASE_URL}/imgs/articles/2018-12-05-dotcss-2018-un-tres-grand-cru/dotCSS-photo-finish.jpg)

Quelle magnifique conférence !

Certains exposés étaient réellement étonnants et inspirants. J'ai également pu parler à des conférenciers comme Sara Soueidan, la grande prêtresse du SVG, qui a grandement participé à ma venue cette année.

Enfin, un grand merci aux organisateurs pour avoir réuni le gratin mondial de la discipline.

Vivement dotCSS 2019 en espérant que le prochain millésime soit... un grand cru classé !
