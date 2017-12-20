---
layout: post
title: Optimiser vos images avec Imagine
excerpt: "L’optimisation d’images est un enjeu très important dans la conception d’une application web et nécessite une attention particulière. Durant le développement d’un jeu en ligne impliquant une gestion importante d’images, nous avons été amenés à les optimiser pour différents devices (desktop et mobile). La suite de cet article sera dédiée à expliquer de manière assez simple notre démarche."
authors:
  - skpotogbey
permalink: /fr/optimize-image-with-imagine/
lang: fr
categories:
    - symfony
    - php
tags:
    - php
    - symfony
    - letscreate
---

L’optimisation d’images est un enjeu très important dans la conception d’une application web et nécessite une attention particulière.
Durant le développement d’un jeu en ligne impliquant une gestion importante d’images, nous avons été amenés à les optimiser pour différents devices (desktop et mobile).
La suite de cet article sera dédiée à expliquer notre démarche en créant une version simplifiée que vous retrouverez [ici](https://github.com/shalomaku/resize-with-imagine){:rel="nofollow"}.

## Pré-requis :
* php7
* SYMFONY3
* [GD](http://php.net/manual/fr/book.image.php){:rel="nofollow"}, [Imagick](http://php.net/manual/fr/book.imagick.php){:rel="nofollow"} ou [GMagick](http://php.net/manual/fr/book.gmagick.php){:rel="nofollow"}

## Definition du projet
Notre projet est un jeu dont le but est de placer des objets (par drag and drop en Javascript) dans une pièce.
Les données à manipuler essentiellement sont :
* **la pièce**: Elle est caractérisée principalement par _une image_ et un _coefficient d'agrandissement_ des objets.

![un exemple de pièce]({{site.baseurl}}/assets/2017-12-20-optimize-image-with-imagine/room.jpg)
* **les objets**: Ils ont comme informations principales _une image_, et _une taille réelle_ en centimètre.

![une table]({{site.baseurl}}/assets/2017-12-20-optimize-image-with-imagine/table.png)
![un écran]({{site.baseurl}}/assets/2017-12-20-optimize-image-with-imagine/imac.png).

L'objectif à atteindre :
* Optimiser les fonds de pièces
* Optimiser les objets

## Résolution
Cette section sera subdivisée en deux grandes parties :
* Installation et définition
* Optimisation

### Installation et définition

Dans cette partie, on parlera brièvement de la mise en place de la bibliothèque Imagine, et de nos classes (room et furniture).

#### Imagine

Nous utilisons la librairie **Imagine** parce qu'elle permet notamment :
* d'unifier les méthodes des bibliothèques [GD](http://php.net/manual/fr/book.image.php){:rel="nofollow"}, [Imagick](http://php.net/manual/fr/book.imagick.php){:rel="nofollow"} et [GMagick](http://php.net/manual/fr/book.gmagick.php){:rel="nofollow"},
* simplifier les tests.

```bash
$ composer require imagine/imagine
```


#### Room (Nos pièces)
Définissons nos pièces.

```php
<?php

namespace AppBundle\Entity;

class Room
{
   ...
   /** @var string */
   private $imageUrl;

   /** @var float */
   private $scale;
   ...
}
```

#### Furniture (Nos objets)

Voici un preview de nos objets :

```php
<?php
namespace AppBundle\Entity;

class Furniture
{
  ...
  /** @var string */
  private $imageUrl;

  /** @var float */
  private $height;

  /** @var Room[] */
  private $rooms;
  ...
}
```

### Optimisation
Optimiser, dans notre cas, cela implique de :
* Trouver une ou plusieurs **tailles de destination**.
* Déterminer la **méthode de calcul** des tailles des pièces et des objets

#### Taille de destination
A quoi servent les tailles de destination ? Elles permettent de définir les tailles idéales que doivent avoir nos images.
Dans notre projet, nous avons défini deux tailles basées sur la taille maximale de chaque pièce sur mobile, et sur desktop.
* LD (Low display) : La largeur maximale a été fixée à 600px.
* HD (High display) : Une largeur maximale de 1200px a été choisie.

Nous reflétons nos tailles dans le fichier de configuration **config.yml**.

```yaml
parameters:
    format_size:
        ld:
            size: 600
            quality: 90
        hd:
            size: 1200
            quality: 75
```

#### Méthode de calcul
Pour optimiser, il faut déterminer une méthode qui permettrait de réduire la taille des images (pièces et objets) sans pour autant en perdre la qualité.

Pour toutes nos images, nous utiliserons les méthodes ```open```, ```resize``` et ```save``` d'Imagine pour les traitements.

**Les pièces**

Elles sont censées recouvrir la quasi totalité de l'écran donc nous leur appliquons les tailles maximales **LD** et **HD** tout en gardant les proportions des images.

Ex : Pour une image ```WIDTHxHEIGHT: 3000x1687``` de **14Mo** ca donnera en :
* LD : ```600x336```, soit à peu près **592 ko**
* HD : ```1200x672```, soit environ **2 Mo**

```php
<?php
...
/**
 * Execute resize.
 *
 * @param Room $object
 * @param string $fullInputfile
 * @param string $relativeOutputFilePath
 * @param string $fullOutputFilePath
 * @param int $size
 * @param int $quality
 *
 * @return string
 */
protected function execute(
  $object,
  $fullInputfile,
  $relativeOutputFilePath,
  $fullOutputFilePath,
  $size,
  $quality
): string {
    //On récupère la taille de l'image d'origine
    list($width, $height) = getimagesize($fullInputfile);
    //On calcule le ratio pour toujours garder la même proportion
    $ratio = $height / $width;
    $newWidth = $size;

    //Ne pas agrandir l'image si elle est déjà assez petite
    if ($width < $newWidth) {
        $newWidth = $width;
    }

    //Calcul de la nouvelle taille de l'image
    $newHeight = ceil($newWidth * $ratio);
    $this->createFileDirectory($fullOutputFilePath);

    //Enregistrons tout ça
    $box = new Box($newWidth, $newHeight);
    $this->imagine->open($fullInputfile)
        ->resize($box)
        ->save($fullOutputFilePath, ['jpeg_quality' => $quality]);

    return $relativeOutputFilePath;
}
...
```

**Les objets**

Pour les objets, la méthode de calcul est un peu différente. On ne peut pas leur appliquer une taille par défaut comme pour les pièces. En effet ils n'ont pas tous la même taille (On ne peut pas redimensionner une table et un écran de la même manière)!

![une table](/assets/2017-12-20-optimize-image-with-imagine/table.png)
![un écran](/assets/2017-12-20-optimize-image-with-imagine/imac.png).

Nous avons décidé de calculer la taille maximale des images de nos objets lorsqu'elles sont au maximum zoomées dans les pièces.

Pour ce faire il fallait se baser sur trois éléments :
* La longueur maximale de la pièce, on la retrouve en multipliant la largeur par 0,75 _(0,75 parce que la partie jeu est au format quatre tiers.)_. Soite ```LONG_PIECE_EN_PX = LARG_PIECE_EN_PX * 0.75```.
* La taille réelle de l’objet en mètre (pas de l’image !). Soit ```HAUTEUR_REEL_OBJET_EN_METRE = HAUTEUR_REEL_OBJET_EN_CM * 0.01```.
* Et la taille de la pièce en mètre (nous l’avons fixée à 2m30).

Par une petite règle de trois, nous obtenons :

```
LONG_PIECE_EN_PX    -> HAUTEUR_PIECE_EN_METRE
LONG_OBJET_EN_PX(?) -> HAUTEUR_REEL_OBJET_EN_METRE
LONG_OBJET_EN_PX = (HAUTEUR_REEL_OBJET_EN_METRE * LONG_PIECE_EN_PX) / HAUTEUR_PIECE_EN_METRE
```

Le code correspondant est :

```php
<?php
...
/**
 * Execute resize
 *
 * @param Furniture $object
 * @param $fullInputfile
 * @param $relativeOutputFilePath
 * @param $fullOutputFilePath
 * @param $size
 * @param $quality
 *
 * @return string
 */
public function execute(
  $object,
  $fullInputfile,
  $relativeOutputFilePath,
  $fullOutputFilePath,
  $size,
  $quality
): string {
    list($width, $height) = getimagesize($fullInputfile);
    $ratio = $width / $height;

    $newHeight = ($object->getHeight() * 0.01) * ($size * 0.75) / 2.30;
    if ($newHeight > $height) {
        $newHeight = $height;
    }
    $newWidth = floor($newHeight * $ratio);

    $this->createFileDirectory($fullOutputFilePath);

    $box = new Box($newWidth, $newHeight);
    $this->imagine->open($fullInputfile)
        ->resize($box)
        ->save($fullOutputFilePath, [
            'png_compression_level' => floor($quality * 9 / 100)
        ]);

    return $relativeOutputFilePath;
}
...
```

## Récapitulons :

Pour résoudre notre problème, nous avons :

* utilisé la librairie Imagine
* défini les différents objectifs (tailles) que nous voulions atteindre
* mis en place les différentes méthodes de redimensionnement de nos objets.
