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
{% raw %}
<p>Lors de l’exécution de certain map reduce de MongoDB, il se peut que des tables temporaires ne se drop pas.</p>
<p>Voici la ligne de commande magique pour les supprimer.</p>
<p><!--more--></p>
<pre class="brush: shell; gutter: true">mongo "nom de la base"</pre>
<pre class="brush: shell; gutter: true">db.system.namespaces.find({name:/tmp.mr/}).forEach(function(z) {
  try{
    db.getMongo().getCollection( z.name ).drop();
  } catch(err) {}
});</pre>
<p>Voila si vous aimez alors likez ;)</p>
{% endraw %}
