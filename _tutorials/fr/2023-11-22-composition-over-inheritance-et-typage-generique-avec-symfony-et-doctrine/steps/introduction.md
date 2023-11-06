---
contentType: tutorial-step
tutorial: composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine
slug: introduction
title: Introduction
---
### Qu'allons-nous faire ?

Sans doute qu'aujourd'hui, lors de l'installation d'un nouveau projet Symfony avec Doctrine, vous gardez le design de base de ces classes, avec une classe qui étend du repository de base de Doctrine, l'`EntityRepository`.

Quel est le problème me diriez-vous ? Et bien tout d'abord, mettons que vous n'ayez besoin que de la méthode `find` de votre repository. Ici, vous hériterez bien de cette méthode, mais également de toutes les autres venant du repository de base de Doctrine. Ainsi, n'importe quel développeur pourrait utiliser le `getEntityManager` qui permet ensuite d'effectuer toutes les opérations de mutation (insertion, mise à jour, suppression) d'un objet dans votre base de données, et ce même si vous ne souhaitez pas que ce soit possible.
De plus, l'`EntityManager` est un concept étroitement lié à Doctrine dans notre cas.
Ainsi, on dira que le détail de notre implémentation (ici Doctrine et toutes ses méthodes & ses concepts) va *fuire* dans notre code métier, et ce n'est pas ce que l'on veut.

Pour régler cela, nous allons utiliser l'injection de dépendance.

De plus, nous aurons besoin d'être aidé par un typage plus strict pour faciliter et améliorer notre expérience de développement. Pour cela, nous utiliserons le typage générique. Comme vous le savez sûrement, ce n'est pas possible nativement en PHP de faire ce genre de typage, mais grâce à l'outil d'analyse statique PHPStan, nous contournerons ce problème.
En cela, ce codelab est une mise en application de [cet article sur le typage générique en PHP](https://blog.eleven-labs.com/fr/typage-generique-en-php/) sorti sur le blog d'Eleven Labs. Allez y jeter un oeil !

Enfin, le code source de ce codelab est disponible sur mon GitHub : 
-   [Codelab Symfo/Doctrine](https://github.com/ArthurJCQ/codelabs-compo)


### Pré-requis

Pour les besoins de ce tutoriel il vous faudra :

- Avoir PHP d'installé sur votre machine (ou via Docker si vous vous sentez plus à l'aise)
- Avoir des bases en Symfony & Doctrine
- Avoir lu [notre article](https://blog.eleven-labs.com/fr/typage-generique-en-php/) sur le typage générique en PHP est un plus

> Le tout est développé avec PHP 8.2
