---
layout: post
title: Supprimer tables temporaires MongoDB
excerpt: Lors de l’exécution de certain map reduce de MongoDB, il se peut que des tables temporaires ne se drop pas. Voici la ligne de commande magique pour les supprimer.
authors:
    - captainjojo
lang: fr
permalink: /fr/supprimer-tables-temporaires-mongodb/
categories:
    - MongoDB
tags:
    - php
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
