---
lang: en
date: '2019-05-09'
slug: manage-translations-with-localise-biz
title: Managing translations with localise.biz
excerpt: >-
  In this article I am going to introduce localise.biz - a SaaS tool to manage
  translations.
authors:
  - marishka
categories: []
keywords:
  - translations
  - intl
  - tools
  - multi-language
  - saas
---

## Introduction

As part of our project, we needed a translation management tool. We have 3 languages on our site, and the translations are done by the business team (marketing and other).

[Localise.biz](https://localise.biz/) (aka Loco) is a SaaS online translation management service. It offers free and paid subscriptions according to the needs and the size of the project.

### Setup

First, we need to create a user account. Once our account is created, we start by creating a project and choose a main language for this project which will serve as a basis for translations. The same user can be part of several projects.

![loco_create]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/create.png "create project")

We can then add all the languages we need in our application, whether it be in a standard format, ISO2, or custom languages for more specific needs.

The interface is quite simple and intuitive.
With all the filters availables, it becomes easy to work on this interface without any issues.

![loco_translate]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/translate.png "translate")

## Features

Here are the reasons that convinced us to choose this tool.

### Implementation of a translation workflow

Loco allows you to manage statuses for assets (an asset is a translation key associated with its translations in all languages).

This allows us to set up a rather simple translation validation workflow.
For example, when the development team creates translation keys, they can put them into *Provisional* status.

Then, when the translations have been done and validated by the people whose responsibility it is, the status is modified, allowing to filter on the assets that are to be translated yet, thus simplifying their work.

![loco_statuses]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/status.png "statuses")

Moreover, it is possible to assign tags to assets.
This was useful for us to prepare releases in particular.

![loco_tags]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/tags.png "tags")

### Import / export

Of course, when migrating to a new solution, we do not want to create the translation keys one by one...
Loco has a very complete import / export system with a wide range of formats (JSON, CSV, etc.).
We can also use all the filters in our exports. I'll let you take a look at their documentation with all the details if needed.

![loco_export]({{site.baseurl}}/assets/2019-05-02-gestion-des-traductions-avec-localise/export.png "export")

### REST API

The main reason to choose Loco for us was the [REST API](https://localise.biz/api/docs). It allows to manipulate all the data that we are able to modify with the UI (translations, locales, tags ...). In our case, we used only the retrieval of translations.

## Usage

When translation files are stored within an application, we sometimes have to deploy it only to update certain translations.

When redesigning our website, we decided to store the translation files on a cloud storage to separate the deployment of our applications from the translations update.

Thus, we export the contents of Loco to store it in a *bucket* on Google Cloud Platform in JSON files (one file per language). So we have set up a cron that runs regularly on Google App Engine that takes care of that.

Below is the code:

```js
const axios = require('axios');
const express = require('express');
const { Storage } = require('@google-cloud/storage');

const app = express();
const storage = new Storage({
  projectId: 'GOOGLE_CLOUD_PLATEFORM_PROJECT_ID',
});


app.get('/translations/b2cwebsite', (req, res,) => {
  const bucket = storage.bucket('YOUR_BUCKET_NAME');
  const locales = ['en', 'fr'];
  let status = 200;

  const client = axios.create({
    baseURL: 'https://localise.biz',
    headers: {'Authorization': 'Loco YOUR_LOCALISE_API_KEY'}
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

As you can see, in just a few lines we get our translation files.
Just load them into our app and you're done!

## Conclusion

If you are working on a multi-language site and you are looking for a solution that would satisfy both developers and translators, Localise.biz could be right for you. This solution offers great flexibility, both in the way you manage and export translations, and in the way you manage translations on a daily basis for business users.
