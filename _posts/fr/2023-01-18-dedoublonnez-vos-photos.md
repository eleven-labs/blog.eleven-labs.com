---
layout: post
title: Dédoublonnez vos photos
excerpt: Comme moi vous avez sur vos disques dur des copies, de copie, de copie de photos et vous souhaiteriez faire un peu de ménage ? C'est par ici.
authors:
  - jmoati
lang: fr
permalink: /fr/dedoublonnez-vos-photos/
categories:
  - php

---

![Cover]({{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/cover.jpg)

## Introduction

Le dédoublonnage de photos est un processus qui vise à détecter et supprimer les images en double d'une collection.
Il est utilisé pour nettoyer des albums photos ou des bases de données d'images et pour améliorer la qualité des résultats de recherche d'images.
Il existe différentes méthodes pour le dédoublonnage, comme la comparaison de pixels, des caractéristiques d'image, des métadonnées et des signatures d'image, chacune ayant des avantages et inconvénients.

Dans cet article, nous combinerons plusieurs de ces techniques afin d'identifier des doublons.

### 0. Avertissement ###

Il est important de noter que le dédoublonnage de photos peut entraîner la perte de données, il est donc important de sauvegarder les images avant de les supprimer.
Il est également recommandé de vérifier manuellement les images supprimées afin de s'assurer qu'elles sont en effet des doublons et non des images uniques.

### I. Savoir à coup sûr si un fichier est déjà présent dans ma collection d'image

La première méthode que nous utiliserons est de générer une somme de contrôle SHA-1 à partir du contenu du fichier puis de vérifier dans un registre si celle-ci s'y trouve déjà.

La somme SHA-1 (Secure Hash Algorithm 1) est un algorithme de hachage cryptographique qui permet de créer une empreinte numérique (ou "somme de contrôle") d'un fichier. Cette empreinte est générée en transformant les données du fichier en un code à 160 bits (40 caractères hexadecimal), qui est unique pour chaque fichier.
Si un fichier change, même de façon minime, sa somme SHA-1 sera complètement différente.

Les sommes SHA-1 sont souvent utilisées pour vérifier l'intégrité des fichiers téléchargés sur internet, pour s'assurer qu'ils n'ont pas été altérés pendant leur transfert. On peut comparer la somme SHA-1 d'un fichier téléchargé avec la somme SHA-1 d'un fichier original pour vérifier qu'ils sont identiques.
De cette manière, on peut être sûr que le fichier téléchargé est le même que celui qui a été diffusé par son auteur ou son éditeur.

Il est important de noter que même si la somme SHA-1 est encore utilisée, il y a des algorithmes de hachage plus récents qui sont considérés plus sécurisés (comme SHA-256, SHA-3, etc).

Calculons ainsi le hash SHA-1 de la photo suivante :
![Pilou]({{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546.jpg)

Pour faire cela nous utiliserons le code suivant :
```php
<?php

echo sha1_file('~/IMG_0546.jpg');
```

Ce qui nous donnera le résultat suivant :
```
8ffe297f8e88d5573d375cd12536e33db8d49c54
```

Si deux fichiers ont le même hash, alors on peut être sûr (ou presque...), que ces derniers sont identiques en tous points et que nous pouvons archiver n'importe lequel des deux. Toutefois, cela ne fonctionne que si notre fichier n'a jamais été importé dans un logiciel (qui ajoutera des métadonnées sur le fichier) ou que nous n'avons pas fait de post traitement dessus.

Si on refait la même opération sur la photo qui s'est affichée, dans votre navigateur (et qui a été redimensionnée pour prendre moins de place) :

```php
<?php

echo sha1_file('{{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546.jpg');
```

Le résultat ne sera pas du tout le même :

```
fbde9cebfa1522b7489c2e5360bf114f203d7c62'
```

En effet, comme dit précédemment, modifier un seul bit de notre fichier aura pour effet de complétement changer la somme de contrôle de celle-ci. Aussi pour trouver les doublons, nous allons devoir avoir recours à d'autres techniques plus permissives.

### II. Savoir si une image a le même aspect visuel qu'une autre

Nous ne pouvons donc pas seulement utiliser la somme de contrôle afin de trouver tous les doublons d'une même photo. Nous pouvons toutefois nous reposer sur un deuxième type de hash dans le but d'identifier d'éventuels candidats : le perceptual hash.

Le perceptual hash, ou "empreinte perceptuelle", est un algorithme de hachage utilisé pour identifier les images similaires. Il fonctionne en créant un hash (ou une empreinte numérique) unique pour chaque image en comparant les caractéristiques visuelles de l'image plutôt que les données binaires de l'image elle-même.

Il compare les caractéristiques de l'image telles que les niveaux de luminosité, les contours et les textures, pour créer un hash qui est sensible aux différences subtiles entre les images. Cela permet de détecter les images similaires même si elles ont subi des modifications mineures, comme une rotation ou un redimensionnement.

Le perceptual hash est souvent utilisé pour l'analyse d'image, la reconnaissance d'images et la détection de contenu dupliqué, comme dans la vérification de contenu copyright ou, comme dans notre cas, dans la suppression de duplicat d'images. Il est également utilisé dans les systèmes de surveillance vidéo pour détecter des intrusions ou pour des applications de reconnaissance faciale pour identifier les personnes.

Afin de calculer simplement un perceptual hash, on peut utiliser une librairie PHP tel que l'excellente [jenssegers/imagehash](https://github.com/jenssegers/imagehash).

Après l'avoir installée à l'aide de la commande `composer require jenssegers/imagehash`, on pourra utiliser le morceau de code suivant :

```php
<?php

require(__DIR__.'/vendor/autoload.php');

use Jenssegers\ImageHash\ImageHash;

$hasher = new ImageHash();
$hash = $hasher->hash('{{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546.jpg');

echo $hash->toHex();
```

Qui nous donnera comme résultat :

```
a3d7d5f2e22489b3
```

Je vais maintenant faire quelques ajustements sur ma photo afin de changer les niveaux de couleurs et nous obtenons ainsi la photo suivante (plus pâle, plus jaune) :

![Pilou avec des niveaux modifiés]({{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_leveling.jpg)

En exécutant le même bout de code que précédemment :

```php
<?php

require(__DIR__.'/vendor/autoload.php');

use Jenssegers\ImageHash\ImageHash;

$hasher = new ImageHash();
$hash = $hasher->hash('{{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_leveling.jpg');

echo $hash->toHex();
```

Nous obtenons le résultat suivant :

```
a3d7d5f2e22489b3
```

Vous avez bien lu : nous avons toujours le même perceptual hash !
Même si les couleurs de l'image ont été modifiées, la donnée visuelle est toujours la même, et donc le hash de même. Pour avoir un hash différent il va falloir faire des modifications beaucoup plus aggressive. Je vais donc maintenant changer réellement l'aspect d'une zone entière de l'image en mettant un smiley par-dessus la tête de mon chat :

![Pilou avec un emoji à la place de la tête]({{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_emoji.jpg)

En exécutant le même bout de code que précédemment :

```php
<?php

use Jenssegers\ImageHash\ImageHash;

$hasher = new ImageHash();
$hash = $hasher->hash('{{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_emoji.jpg');

echo $hash->toHex();
```

Nous obtenons cette fois-ci un résultat bien différent :
```
a3d7d5f2c26449b3
```

Si on compare les deux hashes :

a3d7d5f2**e**2**2**4**8**9b3

a3d7d5f2**c**2**6**4**4**9b3

On peut maintenant constater que le hash a évolué sur quelques caractères et on peut presque même deviner la zone qui a été modifiée en regardant la position des caractères du hash qui ont changés !

Il existe plusieurs méthodes de hachage pour le perceptual hash mais voici comment fonctionne la forme la plus simple :

_Dans le cas des images, les hautes fréquences donnent des détails, tandis que les basses fréquences montrent la structure._

_Une grande image détaillée comporte beaucoup de hautes fréquences. Une très petite image manque de détails, elle est donc composée uniquement de basses fréquences._

#### 1. Réduire la taille ####

Le moyen le plus rapide de supprimer les hautes fréquences et les détails est de réduire la taille de l'image. Dans ce cas, réduisez-la à 8x8 de façon à ce qu'il y ait 64 pixels au total. Ne prenez pas la peine de conserver le rapport hauteur/largeur, réduisez simplement l'image pour qu'elle tienne dans un carré de 8x8.

De cette façon, le hachage correspondra à toute variation de l'image, indépendamment de l'échelle ou du rapport d'aspect.

![Pilou en 8x8]({{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_8x8.jpg) <-- résultat en taille réelle

<img height="512" src="{{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_8x8.jpg" width="512"/>

#### 2. Réduire la couleur ####

La petite image 8x8 est convertie en niveaux de gris. Cela fait passer le hachage de 64 pixels (64 rouges, 64 verts et 64 bleus) à 64 couleurs au total.

![Pilou en 8x8 et qreyscale]({{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_8x8_greyscale.jpg) <-- résultat en taille réelle

<img height="512" src="{{ site.baseurl }}/assets/2023-01-18-dedoublonnez-vos-photos/IMG_0546_8x8_greyscale.jpg" width="512"/>

#### 3. Moyenne des couleurs ####

Calculer la valeur moyenne des 64 couleurs.

#### 4. Calculer les bits ####

C'est la partie la plus amusante. Chaque bit est simplement défini selon que la valeur de la couleur est supérieure ou inférieure à la moyenne.

#### 5. Construire le hachage ####

Placez les 64 bits dans un entier de 64 bits. L'ordre n'a pas d'importance, du moment que vous êtes cohérent.

#### 6. Résultat ####

0xa3d7d5f2e22489b3

#### 7. Conclusion ####

Le hachage résultant ne changera pas si l'image est mise à l'échelle ou si le rapport d'aspect change. L'augmentation ou la diminution de la luminosité ou du contraste, ou même l'altération des couleurs, ne modifieront pas de façon spectaculaire la valeur de hachage.

Si nous voulons comparer deux images, nous construirons le hachage de chaque image et on comptera le nombre de positions de bits qui sont différentes : il s'agit de la distance de Hamming. Une distance de zéro indique qu'il s'agit probablement d'une image très similaire (ou d'une variation de la même image).

Cette méthode nous permet donc d'identifier des images très proches visuellement, mais attention, elle ne sont pas pour autant identiques aussi il faudra nous baser sur d'autres critères avant de prendre une décision.

### III. Identifier les metadata d'une photo ###

Afin de trouver des doublons, nous pouvons aussi utiliser Exiftool. Exiftool est un outil en ligne de commande qui permet de lire, écrire et éditer les métadonnées dans les fichiers images. Il peut également être utilisé pour détecter les images en double en comparant les métadonnées de ces images.

L'un des avantages d'utiliser Exiftool pour le dédoublonnage de photos est qu'il peut lire les métadonnées de nombreux formats d'images différents, y compris JPEG, TIFF, PNG, et RAW. Il peut également être utilisé pour lire les métadonnées des images stockées sur des appareils photo numériques, comme les informations de prise de vue, les réglages d'exposition, etc.

Pour utiliser Exiftool pour détecter les images en double, il suffit de lancer la commande suivante :

```shell
exiftool -duplicates -r ~/photos > result.txt
```

Cette commande va parcourir tous les fichiers dans le répertoire spécifié (et ses sous-répertoires) et va écrire les images en double dans un fichier texte appelé `result.txt`.

Vous pouvez également utiliser des options pour spécifier les métadonnées à utiliser pour la comparaison, comme la date de prise de vue, la résolution, etc.

Il est important de noter qu'Exiftool ne peut pas identifier les images en double basé sur le contenu de l'image, comme le fait le perceptual hash, il utilise uniquement les métadonnées pour identifier les images en double.

Il peut donc y avoir des faux positifs ou des images manquantes si les métadonnées ont été modifiées ou sont absentes. Il est donc important de vérifier manuellement les résultats pour s'assurer de la précision. Dans mon cas, je préfère ainsi utiliser Exiftool uniquement afin d'extraire les métadonnées d'un fichier.

C'est dans ce but que j'ai écrit la librairie PHP suivante : [jmoati/exiftool](https://packagist.org/packages/jmoati/exiftool).

Après un rapide `composer require jmoati/exiftool` et avoir installé `exiftool` dans un conteneur Docker ou sur votre système, vous pourrez utiliser le code suivant :

```php
<?php

require 'vendor/autoload.php';

use Jmoati\ExifTool\ExifTool;

$media = ExifTool::openFile('~/IMG_0546.JPEG');

echo json_encode($media->data());
```

Ce qui nous donnera le résultat suivant :

```json
{
    "File":{
        "FileSize":808104,
        "FileType":"JPEG",
        "FileTypeExtension":"jpg",
        "MIMEType":"image/jpeg",
        "ExifByteOrder":"Big-endian (Motorola, MM)",
        "ImageWidth":2048,
        "ImageHeight":1536,
        "EncodingProcess":"Baseline DCT, Huffman coding",
        "BitsPerSample":8,
        "ColorComponents":3,
        "YCbCrSubSampling":"YCbCr4:2:0 (2 2)"
    },
    "JFIF":{
        "JFIFVersion":1.01,
        "ResolutionUnit":"inches",
        "XResolution":300,
        "YResolution":300
    },
    "EXIF":{
        "Make":"Apple",
        "Model":"iPhone 13 Pro",
        "Orientation":"Horizontal (normal)",
        "XResolution":72,
        "YResolution":72,
        "ResolutionUnit":"inches",
        "Software":"15.4.1",
        "ModifyDate":"2022:05:14 14:01:09",
        "HostComputer":"iPhone 13 Pro",
        "TileWidth":512,
        "TileLength":512,
        "YCbCrPositioning":"Centered",
        "ExposureTime":"1/81",
        "FNumber":2.7999999999999998,
        "ExposureProgram":"Program AE",
        "ISO":200,
        "ExifVersion":"0232",
        "DateTimeOriginal":"2022:05:14 14:01:09",
        "CreateDate":"2022:05:14 14:01:09",
        "OffsetTime":"+02:00",
        "OffsetTimeOriginal":"+02:00",
        "OffsetTimeDigitized":"+02:00",
        "ComponentsConfiguration":"Y, Cb, Cr, -",
        "ShutterSpeedValue":"1/81",
        "ApertureValue":2.7999999999999998,
        "BrightnessValue":3.137087712,
        "ExposureCompensation":0,
        "MeteringMode":"Multi-segment",
        "Flash":"Off, Did not fire",
        "FocalLength":"9.0 mm",
        "SubjectArea":"2013 1500 2310 1327",
        "SubSecTimeOriginal":305,
        "SubSecTimeDigitized":305,
        "FlashpixVersion":"0100",
        "ColorSpace":"Uncalibrated",
        "ExifImageWidth":4032,
        "ExifImageHeight":3024,
        "SensingMethod":"One-chip color area",
        "SceneType":"Directly photographed",
        "ExposureMode":"Auto",
        "WhiteBalance":"Auto",
        "FocalLengthIn35mmFormat":"77 mm",
        "SceneCaptureType":"Standard",
        "LensInfo":"1.570000052-9mm f/1.5-2.8",
        "LensMake":"Apple",
        "LensModel":"iPhone 13 Pro back triple camera 9mm f/2.8",
        "CompositeImage":"General Composite Image",
        "GPSLatitudeRef":"North",
        "GPSLatitude":"<redacted>",
        "GPSLongitudeRef":"East",
        "GPSLongitude":"<redacted>",
        "GPSAltitudeRef":"Above Sea Level",
        "GPSAltitude":"88.93688587 m",
        "GPSSpeedRef":"km/h",
        "GPSSpeed":0,
        "GPSImgDirectionRef":"Magnetic North",
        "GPSImgDirection":286.21852100000001,
        "GPSDestBearingRef":"Magnetic North",
        "GPSDestBearing":286.21852100000001,
        "GPSHPositioningError":"35 m"
    },
    "MakerNotes":{
        "RunTimeFlags":"Valid",
        "RunTimeValue":42659336558125,
        "RunTimeScale":1000000000,
        "RunTimeEpoch":0,
        "AccelerationVector":"-0.9578987955 0.0249360241 -0.2511245309",
        "ContentIdentifier":"ABDDE637-8EF6-4C67-B0FD-E7DB4BC0526E"
    },
    "MPF":{
        "MPFVersion":"0100",
        "NumberOfImages":2,
        "MPImageFlags":"(none)",
        "MPImageFormat":"JPEG",
        "MPImageType":"Undefined",
        "MPImageLength":106047,
        "MPImageStart":702057,
        "DependentImage1EntryNumber":0,
        "DependentImage2EntryNumber":0,
        "MPImage2":"(Binary data 106047 bytes, use -b option to extract)"
    },
    "ICC_Profile":{
        "ProfileCMMType":"Apple Computer Inc.",
        "ProfileVersion":"4.0.0",
        "ProfileClass":"Display Device Profile",
        "ColorSpaceData":"RGB ",
        "ProfileConnectionSpace":"XYZ ",
        "ProfileDateTime":"2017:07:07 13:22:32",
        "ProfileFileSignature":"acsp",
        "PrimaryPlatform":"Apple Computer Inc.",
        "CMMFlags":"Not Embedded, Independent",
        "DeviceManufacturer":"Apple Computer Inc.",
        "DeviceModel":"",
        "DeviceAttributes":"Reflective, Glossy, Positive, Color",
        "RenderingIntent":"Perceptual",
        "ConnectionSpaceIlluminant":"0.9642 1 0.82491",
        "ProfileCreator":"Apple Computer Inc.",
        "ProfileID":"ca1a9582257f104d389913d5d1ea1582",
        "ProfileDescription":"Display P3",
        "ProfileCopyright":"Copyright Apple Inc., 2017",
        "MediaWhitePoint":"0.95045 1 1.08905",
        "RedMatrixColumn":"0.51512 0.2412 -0.00105",
        "GreenMatrixColumn":"0.29198 0.69225 0.04189",
        "BlueMatrixColumn":"0.1571 0.06657 0.78407",
        "RedTRC":"(Binary data 32 bytes, use -b option to extract)",
        "ChromaticAdaptation":"1.04788 0.02292 -0.0502 0.02959 0.99048 -0.01706 -0.00923 0.01508 0.75168",
        "BlueTRC":"(Binary data 32 bytes, use -b option to extract)",
        "GreenTRC":"(Binary data 32 bytes, use -b option to extract)"
    },
    "Composite":{
        "RunTimeSincePowerUp":"11:50:59",
        "Aperture":2.7999999999999998,
        "ImageSize":"2048x1536",
        "LensID":"iPhone 13 Pro back triple camera 9mm f/2.8",
        "Megapixels":3.1000000000000001,
        "ScaleFactor35efl":8.5999999999999996,
        "ShutterSpeed":"1/81",
        "SubSecCreateDate":"2022:05:14 14:01:09.305+02:00",
        "SubSecDateTimeOriginal":"2022:05:14 14:01:09.305+02:00",
        "SubSecModifyDate":"2022:05:14 14:01:09+02:00",
        "GPSAltitude":"88.9 m Above Sea Level",
        "GPSLatitude":"<redacted>",
        "GPSLongitude":"<redacted>",
        "CircleOfConfusion":"0.004 mm",
        "FOV":"26.3 deg",
        "FocalLength35efl":"9.0 mm (35 mm equivalent: 77.0 mm)",
        "GPSPosition":"<redacted>",
        "HyperfocalDistance":"8.24 m",
        "LightValue":8.3000000000000007
    }
}
```

Voici une quantité monstre d'informations plus intéressantes les unes que les autres. Ne les utilisez pas pour trouver des doublons ! Utilisez-les plutôt comme discriminant afin d'identifier les "doubles légitimes".

Même si une image a le même perceptual hash, si la date de prise de vue n'est pas exactement la même (Exif.DateTimeOriginal) ou que l'identifiant de média (Exif.MakerNotes.ContentIdentifier) est différent ou que le temps écoulé depuis lequel l'appareil est allumé (Exif.Composite.RunTimeSincePowerUp) n'est pas identique alors, ce n'est pas un doublon !

Cette méthode est donc à coupler avec la précédente.

## Conclusion ##

Un fichier qui a la même somme de contrôle (MD5, SHA-1, etc.) peut-être considéré comme un doublon, car la chance que deux photos partagent le même hash est relativement faible. Dans le cas où deux photos ont le même perceptual hash, cela ne veux pas forcément dire que nous avons un doublon.

Pour savoir si la suppression de l'un ou de l'autre est légitime, il nous faut confronter les métadonnées de celles-ci.

Enfin, afin de savoir quelle image garder, écrivez-vous un petit algorithme de scoring dans le but de valoriser par exemple les photos en RAW, ayant une position GPS, n'étant pas passé par un logiciel de retouche, etc.

Bonne chance, et que la force soit avec vous dans cette dangereuse entreprise !
