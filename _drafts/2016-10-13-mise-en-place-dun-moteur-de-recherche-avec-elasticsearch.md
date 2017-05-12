---
layout: post
title: Mise en place d'un moteur de recherche avec Elasticsearch
author: cedric
date: '2016-10-13 10:43:33 +0200'
date_gmt: '2016-10-13 08:43:33 +0200'
categories:
- Non classé
tags: []
---
{% raw %}
    Vous avez une application qui possède des millions de données, votre site commence à ramer ou vous voulez simplement mettre en place un moteur de recherche rapide et efficace sans vous prendre la tête : Elasticsearch est fait pour vous.

    Voici un moteur de recherche open source qui commence à faire beaucoup de bruit. Et ça se comprend vu qu'il suffit de quelques minutes à peine pour disposer d’un moteur de recherche <em>clusterisé</em>, automatiquement sauvegardé et répliqué, équipé d'une API REST et proposant toutes les fonctionnalités d’un moteur de recherche.

<h3 style="padding-left: 30px; text-align: justify;">I. Présentation
    Je ne vais pas refaire l'historique complet d'Elasticsearch mais pour faire court, c'est un projet open source développé en Java sous licence Apache2. Elastisearch est basé sur la librairie java Apache Lucene qui sert de base à d'autres moteurs de recherche dont le plus connu est Apache Solr. Il est utilisé par les plus grands tels que Wikipedia, StackOverflow, GitHub, Dailymotion...

<h3 style="padding-left: 30px; text-align: justify;">II. Terminologie
    Voici un peu de vocabulaire propre à Elasticsearch.

    Un <strong>index</strong> peut être assimilé à une base de données sur un SGBD relationnel. Chaque index dispose d'un mapping, qui permet de définir la structure des types.

    Le <strong>mapping</strong> est similaire à la définition de votre schéma de base de données. Vous pouvez le définir manuellement, sinon il sera généré automatiquement lors de la première indexation de votre document. Attention, une fois le mapping définit, il vous est impossible de le modifier. Il vous faudra le supprimer, le redéfinir et relancer une indexation de vos données.

    Les <strong>types</strong> représentent une table dans un SGBD. Chaque type contient une liste des champs équivalant aux colonnes constituant votre table.

    Les <strong>documents</strong> représentent une entrée dans votre type. Ces documents sont stockés au format JSON et possèdent un <strong>index</strong>, un <strong>type</strong> et un <strong>id</strong>.

    Un <strong>node</strong> est une instance d'ElasticSearch.

   Un <strong>shard</strong> vous permet de répartir vos données sur plusieurs nodes car il y a une limite physique à la taille d'un index sur un seul node. Les shards sont gérés de manière automatique par Elasticsearch, un shard peut être primaire ou être un duplicata.

   Les <strong>replicas</strong> sont des copies des shards primaires auxquels elles sont rattachées. En cas d'erreur du primaire, un replica deviendra shard primaire selon un système d'élection afin que l'application reste disponible.

   Un <strong>cluster</strong> est une collection de node, donc plusieurs instances d'Elasticsearch qui vont partager toutes vos données. Il est identifié par un nom ce qui permet à un node de faire partie du cluster lors de son instanciation.

   Trêve de bavardage, je vous sens impatients de commencer donc en avant pour l'installation ! J'espère que vous avez 5 minutes devant vous :)

<h3 style="padding-left: 30px; text-align: justify;">III. Installation
Pour ce tuto, je serai sous Ubuntu 14.04 mais il ne devrait pas y avoir de difficultés sous un autre OS, même Windows.

Elasticsearch nécessite que Java soit installé sur votre machine, il vous faut au moins la version 7 mais le jdk 1.8 est recommandé.

On a fait le plus gros du travail maintenant, téléchargez la dernière version de <span style="color: #0000ff;"><a style="color: #0000ff;" href="https://www.elastic.co/downloads/elasticsearch">Elasticsearch</a></span>.

Dézippez-le:

<pre class="lang:default decode:true">tar -xvf elasticsearch-2.3.4.tar.gz</pre>
Un dossier "elasticsearch-2.3.4" va être créé, déplacez-vous dedans :

<pre class="lang:default decode:true ">cd elasticsearch-2.3.4/bin</pre>
Il n'y a plus qu'à lancer une instance d'Elastic :

<pre class="lang:default decode:true ">./elasticsearch</pre>
Et voilà, votre moteur de recherche est opérationnel :

<pre class="lang:default decode:true">[2016-07-19 11:20:06,036][INFO ][node                     ] [Turner D. Century] version[2.3.4], pid[9825], build[e455fd0/2016-06-30T11:24:31Z]
[2016-07-19 11:20:06,038][INFO ][node                     ] [Turner D. Century] initializing ...
[2016-07-19 11:20:07,487][INFO ][plugins                  ] [Turner D. Century] modules [reindex, lang-expression, lang-groovy], plugins [], sites []
[2016-07-19 11:20:07,568][INFO ][env                      ] [Turner D. Century] using [1] data paths, mounts [[/ (/dev/sda2)]], net usable_space [74.7gb], net total_space [226.3gb], spins? [no], types [ext4]
[2016-07-19 11:20:07,568][INFO ][env                      ] [Turner D. Century] heap size [990.7mb], compressed ordinary object pointers [true]
[2016-07-19 11:20:07,568][WARN ][env                      ] [Turner D. Century] max file descriptors [4096] for elasticsearch process likely too low, consider increasing to at least [65536]
[2016-07-19 11:20:12,321][INFO ][node                     ] [Turner D. Century] initialized
[2016-07-19 11:20:12,321][INFO ][node                     ] [Turner D. Century] starting ...
[2016-07-19 11:20:12,475][INFO ][transport                ] [Turner D. Century] publish_address {127.0.0.1:9300}, bound_addresses {[::1]:9300}, {127.0.0.1:9300}
[2016-07-19 11:20:12,507][INFO ][discovery                ] [Turner D. Century] elasticsearch/q8cNxoNrSKWNDDoOTWgPnA
[2016-07-19 11:20:15,557][INFO ][cluster.service          ] [Turner D. Century] new_master {Turner D. Century}{q8cNxoNrSKWNDDoOTWgPnA}{127.0.0.1}{127.0.0.1:9300}, reason: zen-disco-join(elected_as_master, [0] joins received)
[2016-07-19 11:20:15,596][INFO ][http                     ] [Turner D. Century] publish_address {127.0.0.1:9200}, bound_addresses {[::1]:9200}, {127.0.0.1:9200}
[2016-07-19 11:20:15,596][INFO ][node                     ] [Turner D. Century] started
[2016-07-19 11:20:15,649][INFO ][gateway                  ] [Turner D. Century] recovered [0] indices into cluster_state</pre>
Par défaut, Elasticsearch choisira un nom d'un personnage Marvel de manière aléatoire parmi une liste de plus de 3000 noms.

Si vous allez sur <a href="http://localhost:9200/">http://localhost:9200/</a> dans votre navigateur ou que vous tapez dans votre terminal :

<pre class="lang:default decode:true ">curl -XGET 'http://localhost:9200/'</pre>
Vous aurez une réponse du genre :

<pre class="lang:default decode:true">{
    "name" : "Turner D. Century",
    "cluster_name" : "elasticsearch",
    "version" : {
        "number" : "2.3.4",
        "build_hash" : "e455fd0c13dceca8dbbdbb1665d068ae55dabe3f",
        "build_timestamp" : "2016-06-30T11:24:31Z",
        "build_snapshot" : false,
        "lucene_version" : "5.5.0"
    },
    "tagline" : "You Know, for Search"
}</pre>
<strong>Arborescence:</strong>

Dans votre dossier Elasticsearch vous allez trouver les dossiers suivants :

<ul>
<li><strong>bin</strong>, dans lequel se trouve l'exécutable elasticsearch.(sh|bat) pour démarrer une instance Elastic. Mais on y trouve aussi un plugin.(sh.bat), qui comme son nom l'indique, permet d'installer des plugins.</li>
<li><strong>config</strong>, où vous pourrez configurer votre instance d'Elastic (elasticsearch.yml) ainsi que la manière de logger (logging.yml)</li>
<li><strong>data</strong>, dans lequel seront stockées vos données indexées</li>
<li><strong>logs</strong>, où vous trouverez vos fichiers de logs</li>
<li><strong>plugins</strong>, où se trouveront tous les plugins que vous installerez</li>
</ul>
###     IV. Utilisation
Bon maintenant que tout est fonctionnel, il n'y a plus qu'à jouer un peu :)

Créons un index "foo" avec un type "users" qui aurait comme propriétés un "name", un "age" et des "hobbies":

<pre class="lang:sh decode:true">curl XPUT 'http://localhost:9200/foo' -d '
  { "mappings": {
    "users" : {
      "properties" : {
	"name" : {"type":"string"},
	"age" : {"type":"integer"},
	"hobbies": {"type":"string"}
}}}}'</pre>
Maintenant que notre index est créé, on va insérer des données :

<pre class="lang:sh decode:true ">curl XPOST 'http://localhost:9200/_bulk' -d '
{ "create" : { "_index" : "foo", "_type" : "users", "_id": 1 } }
{"name": "john", "hobbies": ["tennis", "guitar", "cinema"], "age" : 30}
{ "create" : { "_index" : "foo", "_type" : "users", "_id": 2 } }
{"name": "jane", "hobbies": ["dance", "running"], "age" : 25}
{ "create" : { "_index" : "foo", "_type" : "users", "_id": 3 } }
{"name": "tom", "hobbies": ["tennis", "guitar"], "age" : 35}'</pre>
Ici, j'ai utilisé l'<span style="color: #0000ff;"><a style="color: #0000ff;" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html">API Bulk</a></span> de Elasticsearch qui permet d'insérer plusieurs documents en même temps.

Maintenant qu'on a des données, passons aux requêtes. La requête la plus simple que vous puissiez faire, c'est celle par id:

<pre class="lang:sh decode:true ">curl XGET 'http://localhost:9200/foo/users/1'</pre>
Ce qui vous retournera :

<pre class="lang:default decode:true ">{
  "_index": "foo",
  "_type": "users",
  "_id": "1",
  "_version": 1,
  "found": true,
  "_source": {
    "name": "john",
    "hobbies": [
      "tennis",
      "guitar",
      "cinema"
    ],
    "age": 30
  }
}</pre>
Une requête plus poussée :

<pre class="lang:sh decode:true">curl XGET 'http://localhost:9200/foo/users/_search' -d '
{
  "query": {
    "match": {
      "hobbies": "guitar"
    }
  }
}'</pre>
Et hop :

<pre class="lang:default decode:true">{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 2,
    "max_score": 0.19178301,
    "hits": [
      {
        "_index": "foo",
        "_type": "users",
        "_id": "3",
        "_score": 0.19178301,
        "_source": {
          "name": "tom",
          "hobbies": [
            "tennis",
            "guitar"
          ],
          "age": 35
        }
      },
      {
        "_index": "foo",
        "_type": "users",
        "_id": "1",
        "_score": 0.15342641,
        "_source": {
          "name": "john",
          "hobbies": [
            "tennis",
            "guitar",
            "cinema"
          ],
          "age": 30
        }
      }
    ]
  }
}</pre>
Ici vous remarquez que bien que le champ "hobbies" soit un tableau, la recherche s'effectue comme s'il était un simple champ string. Elasticsearch est suffisamment intelligent pour comprendre que la recherche s'applique au contenu du tableau.

Le système de recherche est très poussé et ne peut être traité dans un simple article mais je vous laisse parcourir la <span style="color: #0000ff;"><a style="color: #0000ff;" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html">documentation</a></span> qui est très complète.

On peut voir dans le résultat ci-dessus, un champ "_score" qui correspond à la pertinence du document par rapport à la recherche. Vous pourrez donc influencer la pertinence des résultats en <em>boostant </em>la valeur d'un champ lorsque celui-ci match votre requête.

Utiliser les "analyzers" pour que les données soient retravaillées avant d'être indexées.

Typiquement, l'API "_analyze" vous permet de visualiser la valeur qui sera indexée pour un analyzer donné :

<pre class="lang:default decode:true">GET /foo/_analyze?analyzer=french&amp;text=tennis</pre>
Vous retournera :

<pre class="lang:default decode:true">{
  "tokens": [
    {
      "token": "teni",
      "start_offset": 0,
      "end_offset": 6,
      "type": "&lt;ALPHANUM&gt;",
      "position": 0
    }
  ]
}</pre>
On constate que le mot "tennis" sera indexé en tant que "teni" pour l'analyzer "<strong>french</strong>". Donc une recherche sur le mot "tennis", "tenis", "tenni"... vous retournera tous les documents qui contiendront le mot "tennis".

On pourrait passer des heures sur les requêtes car le Query DSL d'Elasticsearch est très puissant mais je vous laisse découvrir ça par vous-même.

<h3 style="padding-left: 30px;">V. Conclusion
Voilà pour une première approche, mais Elasticsearch vous réserve beaucoup d'autres surprises.

Le système de requête est très poussé et vous permettra de configurer votre moteur de recherche de manière très précise et tout ça en un temps record.

Beaucoup d'outils sont fournis par Elastic afin de faciliter le monitoring, les requêtes, le débogage

Donc baladez-vous sur la documentation, jouez un peu avec et vous serez rapidement séduit !

&nbsp;

{% endraw %}
