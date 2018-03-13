---
layout: post
title: Retour d’expérience sur BEM
lang: fr
permalink: /fr/retour-d-experience-sur-bem/
excerpt: "Dans cette article vous trouverez mon retour d'expérience sur la méthodologie BEM (Block ; Element ; Modifier), choisie dans ma précédente refont..."
authors:
    - kcordier
categories:
    - bem
    - html
    - css
    - javascript
tags:
    - bem
    - html
    - css
    - javascript
cover: /assets/2018-03-15-retour-d-experience-sur-bem/cover.jpg
---

Dans cette article vous trouverez mon retour d'expérience sur la méthodologie BEM (**Block** ; **Element** ; **Modifier**), choisie dans ma précédente refont du site RueDuCommerce et prenant de plus d’ampleur chez mes different clients.  
  
# Pourquoi vous faites ça ?  
  
Dans le cas de mon dernier client, l’objectif été de refondre le site en plusieurs services renvoyant leur propre vue. Chaque services étant géré par une équipe différente il était nécessaire pour chacun de mettre en place des bonnes pratiques et des méthodologies pour être tous sur la même longueur d’onde, même pour le HTML et le CSS. Les projet back-end et front-end étaient réalisé en Symfony et Javascript pure (le mot d’ordre étant d’avoir le moins de librairie externe)  
  
# Comment est votre HTML/CSS/JS ?

Avant de vous donner mon avis sur cette méthodologie, un peu de d’explication s’impose. Le BEM est une méthodologie comme dit plus haut. Elle définit une convention de structuration, de nommage et d’organisation pour vos assets web. Les conventions de structuration sont simples dans la théorie (expliqué en détail [ici](https://en.bem.info)). Rapidement, vos pages HTML peuvent être définis en plusieurs “**Blocks**”, dans ces “**Blocks**” vous avez des “**Elements**“ et tout cela peut varier grâce à des “**Modifiers**”, d’où le nom BEM. À partir de là on nomme nos classes de la manière suivante:

 - Les classes de **Block** ont le format `.nom-du-block`.
 - Les classes d’**Element** d’un **Block** ont le format `.nom-du-block__nom-d-element`.
 - Les **Modifiers** s’ajoutent au nom des **Blocks**/**Elements** avec `_nom-du-modifier` exemple : `.nom-du-block_nom-du-modifier` ou `.nom-du-block__nom-d-element_nom-du-modifier`.
Une variante existe avec `--nom-du-modifier`.

Au seins des **Modifiers** il faut distinguer :
 - Les **Modifiers** booléen traitant d’une modification on/off s'écrivant juste avec `_nom-du-modifier`, exemple : `.footer_hide` ; `.header_sticky` ; `.menu_open`.
- Les **Modifiers** clef+valeur s'écrivant `_nom-de-clef_valeur`, exemple : `.body_theme_sunny` ; `.body_theme_rainy` ; `.button_color_blue` ; `.button_color_red` ; `.column_size_s` ; `.column_size_m`.

La première difficulté à utiliser cette méthodologie est de savoir identifier un **Block**. Dans la documentation il est dit que toutes zones logiques et fonctionnellement indépendantes sont des **Blocks**.

![BEM_image]({{site.baseurl}}/assets/2018-03-15-retour-d-experience-sur-bem/bem_image.png)

Un **Block** peut contenir d’autre **Blocks**, il peut ne pas contenir d’**Elements** et peut être utilisé plusieurs fois sur la même page.
Le gros plus de cette méthode est d’avoir une structure simple sur 2 niveaux et un système de nommage permettant d’identifier facilement les **Elements** de nos pages par des nom de class unique et exclusive.
Mais BEM ce n’est pas qu’une structuration de page HTML et un nommage de classe CSS, c’est aussi une manière de ranger son projet front.
De ce côté là, BEM dit 2 choses :
 - Les **Blocks** sont rangés par niveau de définition, par exemple un dossier `common.blocks` avec tous les **Blocks** commun à l’application, un dossier `library.blocks` avec ceux importés de l'extérieur, un dossier `mobile.blocks` pour les versions mobiles etc...
 - Nos fichiers doivent être rangés par **Block** et non par extension de fichiers.

En suite, la méthodologie nous offre 3 approches pour organiser les dossiers :
 - **Nested** : La structure classique de BEM, ici une classe correspond à un fichier. cette approche est de la forme :
```
project
    common.blocks/
        block-name/
            _modifier/
                block-name_modifier.css                     
            __element/
                _modifier/
                   block-name__element_modifier.css
                block-name__element.css
                block-name__element.js
            block-name.css
            block-name.js
```
 - **Flat** : Une structure plus simple car ici tout est dans le dossier de définition et libre au développeur de séparer les classes dans des fichiers ou de tout mettre dans le fichier principal du **Block** :
```
project 
    common.blocks/
        block-name1_modifier.css                     
        block-name1__element_modifier.css
        block-name1__element.css
        block-name1__element.js
        block-name1.css
        block-name1.js        
        block-name2.css
        block-name2.js       
```
 - **Flex** : Cette approche est la plus flexible car elle combine les 2 structures cité plus haut, libre à vous de découper vos **Block** dans plusieurs fichiers, temps que c’est rangé dans un dossier correspondant au **Block**
```
project 
    common.blocks/
        block-name/
            _modifier/
                block-name_modifier.css                     
            __element/
                _modifier/
                   block-name__element_modifier.css
                block-name__element.css
                block-name__element.js
            block-name.css
            block-name.js
        block-name2/
            block-name2.css
            block-name2.js
```

# Oui mais en pratique ?

Pour notre cas, le projet n'étant qu'à ses balbutiements, cela n’a pas été trop long de redéfinir l'architecture de nos page HTML actuel et de supprimer tout nos ID pour en faire des classes biens définis, mais ce n’est que la première partie du travail.

S’en est suivi le découpage des classes en plusieurs fichiers. La structure choisie fut **Nested**, ce qui engendra la création d’une centaine de fichiers SCSS. Certaines classes CSS étant dépendantes nous avons fait le choix de garder une hiérarchie dans ces classes, surtout les classes possédants des selector tel que les :hover.
Comme les **Blocks** sont réutilisable et indépendant, nous avons dupliqué pas mal de code à la base de chaque classe de **Block** tel que les information des polices et des couleurs.
Le style étant écrit dans des fichier SCSS nous avons revue notre compilation d’asset. Du au trop grand nombre de fichier à importer nous somme passé sur un import généralisé par nom de dossiers, correspondant aux Blocks de chaque pages.

L’ajout des **Modifiers** nous à fait repenser une partie de notre JS dans la foulé, au lieu de définir des valeurs de CSS en Javascript nous avons créé des classes avec **Modifiers** sur les **Blocks** et **Elements** que nous souhaitions transformé et ajouté des toogleClass dans notre JS pour passer d’un état à un autre. De plus nous avons découpé tous nos JS dans des fichiers correspondant à chaque **Block**. Contrairement à la documentation de BEM nous avons fait le choix de garder les fichiers JS séparé de nos fichiers CSS comme il est défini par défaut par Symfony.

Qui dit mis en place de bonne pratique dit test. Pour cela, nous avons utilisé SCSSLint avec les règles de nommages de BEM pour nous assurer de notre régularité sur le nommage des classe.

# Et donc ?

Le bon côté de BEM c'est que c'est une méthodologie, *(No shit Sherlock !)* c'est bête à dire, mais on a besoin de se mettre des règles dans notre travail et surtout en HTML et CSS qui sont des langages dont on ne prends pas assez soins.
Cela nous a permis de facilement disposer de bouts de codes mutualisés de la part d'autres équipes avec la sécurité que leurs JS et CSS n'impacte pas notre travail.
Due au découpage minutieux des classes CSS il était très facile et rapide de retrouver notre code à condition de ne pas être allergique aux arbres de dossiers fournis.
Le fait de définir des **Modifiers** nous a permis une plus grande maîtrise des états des **Blocks** et **Elements**. son utilisation nous a aussi permis l'ajout d'effets de transitions grâce au CSS3.

Côté mauvais points, le découpage en multiple fichiers a grandement ralenti la compilation de nos assets, dû aux vérifications faites. La nature stricte des règles de BEM nous a obligé à faire beaucoup de changement sur nos assets et dans certain cas nous avons dû faire quelque entorses à la règles, mais les personnes qui ont conçue cette méthodologie sont conscients et les autorisent dans la mesure du possible (si je vous assure c'est écrit [ici](https://en.bem.info/methodology/css/#nested-selectors)). Pour les soucis de codes dupliqués, il nous aurait été facile d'utiliser les mixins.

Même si cette méthodologie fut longue à appréhender, elle nous a beaucoup apporté au niveau de l'architecture. Les mauvais points que nous avons pu rencontrer ont été, pour la plupart, dû à notre manque d'expérience de BEM. Avec du recule et si on fait le compte des points, je conclurai que BEM mérite que l’on se penche dessus. Je ne peux que vous conseiller de la mettre en place sur vos projets web.
