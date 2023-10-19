---
contentType: article
lang: fr
date: '2011-11-24'
slug: supprimer-tables-temporaires-mongodb
title: Supprimer tables temporaires MongoDB
excerpt: >-
  Lors de l’exécution de certain map reduce de MongoDB, il se peut que des
  tables temporaires ne se drop pas. Voici la ligne de commande magique pour les
  supprimer.
categories:
  - php
authors:
  - captainjojo
keywords:
  - mongodb
---

Lors de l’exécution de certain map reduce de MongoDB, il se peut que des tables temporaires ne se drop pas.Voici la ligne de commande magique pour les supprimer.

```sh
mongo "nom de la base"
```
```js
db.system.namespaces.find({name:/tmp.mr/}).forEach(function(z) {
  try{
    db.getMongo().getCollection( z.name ).drop();
  } catch(err) {}
});
```
Voila si vous aimez alors likez ;)
