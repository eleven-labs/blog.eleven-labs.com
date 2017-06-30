---
layout: post
title: Supprimer tables temporaires MongoDB
author: jonathan
date: '2011-11-24 16:49:31 +0100'
date_gmt: '2011-11-24 16:49:31 +0100'
categories:
- MongoDB
tags:
- mongodb
---

Lors de l’exécution de certain map reduce de MongoDB, il se peut que des tables temporaires ne se drop pas.

Voici la ligne de commande magique pour les supprimer.

<!--more-->

<pre class="brush: shell; gutter: true">
{% raw %}
mongo "nom de la base"{% endraw %}
</pre>

<pre class="brush: shell; gutter: true">
{% raw %}
db.system.namespaces.find({name:/tmp.mr/}).forEach(function(z) {
  try{
    db.getMongo().getCollection( z.name ).drop();
  } catch(err) {}
});{% endraw %}
</pre>

Voila si vous aimez alors likez ;)


