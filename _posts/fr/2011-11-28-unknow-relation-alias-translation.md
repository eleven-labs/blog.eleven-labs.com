---
layout: post
title: Unknow relation alias Translation
lang: fr
permalink: /unknow-relation-alias-translation/
excerpt: 'Un petit Bug qui subsiste dans Symfony 1.4, lorsque l''on joue avec l''admin generator avec les éléments i18n.'
authors:
    - rjardinet
date: '2011-11-28 15:06:50 +0100'
date_gmt: '2011-11-28 15:06:50 +0100'
categories:
    - symfony
tags:
    - symfony
---

Hello,

Un petit Bug qui subsiste dans Symfony 1.4, lorsque l'on joue avec l'admin generator avec les éléments i18n.

Il peut arriver que lors de l’exécution d'un batch action ou autre sur l'admin G sur une table avec une liaison i18n, on tombe sur cette erreur la : "Unknow relation alias Translation" malgré que tout semble correct.

La solution est simple, ouvrez le fichier generator.yml sur module sur lequel vous travaillez, et regardez attentivement la 4eme ligne: model\_class.

Essayez de mettre une majuscule au nom de la class ici sur cette ligne.

On aura alors

```yaml
generator:
  class: sfDoctrineGenerator
  param:
    model_class:           actor
```

Qui devient :

```yaml
generator:
  class: sfDoctrineGenerator
  param:
    model_class:           Actor
```

Vous avez une chance sur deux pour que cela corrige votre problème. Cela vient de Doctrine qui utilise sa propre config en cache avec ses noms de model contenant une majuscule comme première lettre.

Bref, en espérant que cela vous aide.
