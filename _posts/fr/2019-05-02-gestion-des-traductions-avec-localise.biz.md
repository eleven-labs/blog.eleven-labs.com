---
layout: post
title: Gestion des traductions avec localise.biz
excerpt: Dans cet article je vais vous présenter localise.biz - un outil de gestion de traduction en SaaS.
authors:
- marishka
lang: fr
permalink: /fr/gestion-des-traductions-avec-localise.biz/
categories:
    - traductions
    - intl
    - outils
tags:
    - traductions
    - multilangue
    - saas
---

## Introduction

Dans le cadre de notre projet, nous avions besoin d'un outil de gestion de traduction. Nous avons 3 langues sur notre site, et les traductions sont faites par l'équipe métier (marketing et autre).

[Localise.biz](https://localise.biz/) (Loco pour les familiers) est un service SaaS de gestion de traduction en ligne. Il propose des abonnements gratuits et payants selon les besoins et la taille du projet.

### Mise en place

Tout d'abord, il faut créer un compte utilisateur. Une fois notre compte créé, nous commençons par créer un projet et choisissons une langue principale pour ce projet qui servira de base pour les traductions. Un même utilisateur peut faire partie de plusieurs projets.

![loco_create]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/create.png "create project")

Nous pouvons ensuite ajouter toutes les langues dont nous avons besoin dans notre application, que ce soient des langues au format standard, ISO2, ou custom pour des besoins un peu plus spécifiques.

L'interface est assez simple et intuitive, et il est facile de travailler dessus sans s'y perdre grâce à tous les filtres disponibles.

![loco_translate]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/translate.png "translate")

## Fonctionnalités

Voici les raisons qui nous ont convaincus de choisir cet outil.

### Mise en place d'un workflow de traduction

Loco permet de gérer des statuts pour les assets (un asset étant une clé de traduction associée aux traductions dans toutes les langues).

Ceci nous permet de mettre en place un flux de validation des traductions assez simple.
Par exemple, lorsque l'équipe de développement crée les clés de traduction, elle peut les mettre en statut *Provisional*.

Ensuite, lorsque les traductions ont été faites et validées par les gens dont c'est la responsabilité, le statut est modifié, permettant ainsi de filtrer sur les assets qui sont à traduire et en simplifiant leur travail.

![loco_statuses]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/status.png "statuses")

De plus, il est possible d'assigner des tags aux assets.
Ceci nous a été utile pour préparer les releases notamment.

![loco_tags]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/tags.png "tags")

### Import / export

Bien sûr, lorsqu'on migre sur une nouvelle solution, on n'a pas envie de créer les clés de traduction une par une...
Loco a un système d'import / export d'assets très complet avec un large choix de formats (JSON, CSV, etc.).
On peut aussi utiliser tous les filtres dans nos exports. Je vous laisse regarder leur documentation avec tous les détails si besoin.

![loco_export]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/export.png "export")

### API REST

La raison principale de choisir Loco a été [l'API REST](https://localise.biz/api/docs). Elle permet de manipuler toutes les données sur lesquelles nous avons la main (les traductions, les locales, les tags...). Dans notre cas, nous n'avons utilisé que la récupération des traductions.

## Utilisation

Lorsque les fichiers de traduction sont stockés au sein d'une application, il nous arrive de devoir la déployer uniquement pour mettre à jour certaines traductions.

Lors de la refonte de notre site, nous avons fait le choix de stocker les fichiers de traduction sur un storage en cloud pour dissocier le déploiement de nos applications de la mise à jour des traductions.

Ainsi, nous exportons le contenu de Loco pour le stocker dans un *bucket* sur Google Cloud Plateform dans des fichiers au format JSON (un fichier par langue). Nous avons donc mis en place un cron qui tourne régulièrement sur Google AppEngine qui s'occupe de ça.

Voici le code associé :

```js
const axios = require('axios');
const express = require('express');
const Storage = require('@google-cloud/storage');

const app = express();
const storage = new Storage({
  projectId: "L_ID_DU_PROJET_GOOGLE_CLOUD_PLATEFORM",
});


app.get('/translations/b2cwebsite', (req, res,) => {
  const bucket = storage.bucket('LE_NOM_DE_VOTRE_BUCKET');
  const locales = ['en', 'fr'];
  let status = 200;

  const client = axios.create({
    baseURL: 'https://localise.biz',
    headers: {'Authorization': 'Loco VOTRE_CLEF_API_LOCO' }
  });

  locales.forEach(function(locale) {
    client.get('/api/export/locale/'  + locale +  '.json')
      .then(function (response) {
        const file = bucket.file(`messages.${locale}.json`);
        file.save(JSON.stringify(response.data), {
          contentType: 'application/json',
          public: true,
          gzip: true,
          resumable: false,
          metadata: {
            cacheControl: `public, max-age=3600`,
          },
        }, function(err) {
          if (err) {
            console.error(`Couldn't upload translations file to Google Cloud Storage for locale ${locale}: ${err}`);
            status = 500;
          }
        });
      })
      .catch(function (error) {
        console.error(`Couldn't fetch translations from Localise for locale ${locale}: ${error}`);
        status = 500;
      });
  });

  res.status(status).end();
});
```

Comme vous pouvez le constater, en quelques lignes seulement nous obtenons nos fichiers de traduction.
Il suffit de les charger dans notre application et le tour est joué !

# Conclusion

Si vous travaillez sur un site multi-langues et cherchez une solution qui permettrait de satisfaire aussi bien les devs que les traducteurs, Localise.biz pourrait vous convenir. Cette solution offre une grande souplesse, que ce soit dans la façon de gérer et exporter les traductions, que dans la façon de gérer les traductions au quotidien pour le métier.
