---
layout: post
title: 'Consul : Service Discovery et Failure Detection'
author: vcomposieux
date: '2017-02-22 10:49:25 +0100'
date_gmt: '2017-02-22 09:49:25 +0100'
categories:
- Dev Ops
- Devops
tags:
- service
- consul
- discovery
- failure
- detection
- health
- check
---

# Introduction
Consul est un outil développé en Go par la société HashiCorp et a vu le jour en 2013.<br />
Consul a plusieurs composants mais son objectif principal est de regrouper la connaissance des services d'une architecture (service discovery) et permet de s'assurer que les services contactés sont toujours disponibles en s'assurant que la santé de ces services est toujours bonne (via du health check).

&nbsp;

Concrètement, Consul va nous apporter un serveur DNS permettant de mettre à jour les adresses IP disponibles pour un service, en fonction de ceux qui sont en bonne santé. Ceci permet également de faire du load balancing bien que nous verrons qu'il ne permette pas pour le moment de préférer un service à un autre.

Il offre également d'autres services tel que du stockage clé/valeur, nous l'utiliserons dans cet article afin que Docker Swarm y stocke ses valeurs.

&nbsp;

Afin de clarifier la suite de cet article, voici les ports utilisés par Consul :

<ul>
<li>**8300** (+ **8301** et **8302**) : Echanges via RPC,</li>
<li>**8400** : Echanges via RPC par le CLI,</li>
<li>**8500** : Utilisé pour l'API HTTP et l'interface web,</li>
<li>**8600** : Utilisé pour le serveur DNS.</li>
</ul>
&nbsp;

La suite de cet article va se concentrer sur la partie service discovery et failure detection. Nous allons pour cela mettre en place un cluster Docker Swarm possédant l'architecture suivante :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/02/consul-archi.png"><img class="size-full wp-image-3445 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2017/02/consul-archi.png" alt="" width="1036" height="611" /></a>

Nous aurons donc 3 machines Docker :

<ul>
<li>Une machine avec **Consul** (Swarm Discovery),</li>
<li>Une machine étant notre "**node 01**" avec un service HTTP (Swarm),</li>
<li>Une machine étant notre "**node 02**" avec un service HTTP (Swarm).</li>
</ul>
&nbsp;

Nous mettrons également sur nos deux nodes (cluster Docker Swarm) un container Docker pour Registrator, permettant de faciliter l'enregistrement de nos services Docker sur Consul.

Pour plus d'informations concernant **Registrator**, vous pouvez vous rendre sur : <a href="https://gliderlabs.com/registrator/">https://gliderlabs.com/registrator/</a>

Commençons à installer notre architecture !

&nbsp;

# Service discovery
&nbsp;

#### Première machine : Consul (Swarm Discovery)
Nous allons commencer par créer la première machine : notre Consul.

&nbsp;

Pour cela, tapez :

<pre class="lang:sh decode:true ">
{% raw %}
$ docker-machine create -d virtualbox consul{% endraw %}
</pre>

&nbsp;

Une fois la machine prête, préparez votre environnement pour utiliser cette machine et lancez un container Consul :

<pre class="lang:sh decode:true ">
{% raw %}
$ eval $(docker-machine env consul)
$ docker run -d \
    -p 8301:8301 \
    -p 8302:8302 \
    -p 8400:8400 \
    -p 8500:8500 \
    -p 53:8600/udp \
    consul{% endraw %}
</pre>

&nbsp;

Nous avons maintenant notre Consul prêt à recevoir nos services et nos prochaines machines membres de notre cluster Docker Swarm.

Vous pouvez d'ailleurs ouvrir l'interface web mise à disposition en obtenant l'ip de la machine Consul :

<pre class="lang:sh decode:true">
{% raw %}
$ docker-machine ip consul
&lt;ip-obtenue&gt;{% endraw %}
</pre>

&nbsp;

Puis ouvrez dans votre navigateur l'URL : http://&lt;ip-obtenue&gt;:8500.

&nbsp;

#### Deuxième machine : Node 01
Nous allons maintenant créer la machine correspondant au premier node de notre cluster Docker Swarm qui se verra également obtenir le rôle de master de notre cluster Swarm (il en faut bien un).

<pre class="lang:sh decode:true ">
{% raw %}
$ docker-machine create -d virtualbox \
    --swarm \
    --swarm-master \
    --swarm-discovery="consul://$(docker-machine ip consul):8500" \
    --engine-opt="cluster-store=consul://$(docker-machine ip consul):8500" \
    --engine-opt="cluster-advertise=eth1:2376" swarm-node-01{% endraw %}
</pre>

&nbsp;

Comme vous le voyez, nous précisons l'option <span class="lang:default decode:true crayon-inline">--swarm-discovery</span>  avec l'IP de notre machine Consul et le port 8500 correspondant à l'API de Consul. Ainsi, Docker Swarm pourra utiliser l'API pour enregistrer les machines du cluster.

&nbsp;

Nous allons maintenant configurer notre environnement pour utiliser cette machine et y installer dessus un container Registrator permettant d'auto-enregistrer les nouveaux services sur Consul.

&nbsp;

Pour ce faire, tapez :

<pre class="lang:sh decode:true ">
{% raw %}
$ eval $(docker-machine env swarm-node-01){% endraw %}
</pre>

puis :

<pre class="lang:sh decode:true ">
{% raw %}
$ docker run -d \
    --volume=/var/run/docker.sock:/tmp/docker.sock \
    gliderlabs/registrator \
    -ip $(docker-machine ip swarm-node-01) \
    consul://$(docker-machine ip consul):8500{% endraw %}
</pre>

&nbsp;

Vous remarquez que nous partageons le socket Docker sur la machine. Cette solution peut être <a href="https://www.lvh.io/posts/dont-expose-the-docker-socket-not-even-to-a-container.html">controversée</a> mais dans le cas de cet article, passons là-dessus. Pour une architecture stable, nous préférerons enregistrer nous-même les services via l'API de Consul.<br />
L'option <span class="lang:default decode:true crayon-inline ">-ip</span>  permet de préciser à Registrator l'IP sur laquelle nous voulons accéder aux services, à savoir l'IP de la machine et non pas l'IP interne du container Docker.

Nous sommes prêts à démarrer notre service HTTP. Celui-ci est une simple image Docker "ekofr/http-ip" qui lance une application HTTP écrite en Go et qui affiche "hello, &lt;ip&gt;" avec l'adresse IP du container courant.

&nbsp;

Pour le besoin de cet article, nous allons également créer un réseau différent entre les deux machines afin d'identifier des adresses IP différentes pour les deux services.

&nbsp;

Créons donc un nouveau réseau pour notre node 01 :

<pre class="lang:sh decode:true">
{% raw %}
$ docker network create \
    --subnet=172.18.0.0/16 network-node-01{% endraw %}
</pre>

puis utilisez ce réseau sur le container du service HTTP :

<pre class="lang:sh decode:true ">
{% raw %}
$ docker run -d \
    --net network-node-01 \
    -p 80:8080 \
    ekofr/http-ip{% endraw %}
</pre>

&nbsp;

Avant d'exécuter les mêmes étapes pour créer notre node 02, assurons-nous d'avoir un service fonctionnel :

<pre class="lang:sh decode:true ">
{% raw %}
$ curl http://localhost:80
hello from 172.18.0.X{% endraw %}
</pre>

&nbsp;

#### Troisième machine : Node 02
Nous allons donc (presque) répéter les étapes du node 01 en changeant quelques valeurs seulement. Créez la machine :

<pre class="lang:sh decode:true ">
{% raw %}
$ docker-machine create -d virtualbox \
    --swarm \
    --swarm-discovery="consul://$(docker-machine ip consul):8500" \
    --engine-opt="cluster-store=consul://$(docker-machine ip consul):8500" \
    --engine-opt="cluster-advertise=eth1:2376" swarm-node-02{% endraw %}
</pre>

&nbsp;

Préparez votre environnement pour utiliser cette machine node 02 et installez-y Registrator :

<pre class="lang:sh decode:true ">
{% raw %}
$ eval $(docker-machine env swarm-node-02){% endraw %}
</pre>

<pre class="lang:sh decode:true ">
{% raw %}
$ docker run -d \
    --volume=/var/run/docker.sock:/tmp/docker.sock \
    gliderlabs/registrator \
    -ip $(docker-machine ip swarm-node-02) \
    consul://$(docker-machine ip consul):8500{% endraw %}
</pre>

&nbsp;

Puis créez un nouveau réseau et lancez le service HTTP avec ce réseau :

<pre class="lang:sh decode:true">
{% raw %}
$ docker network create \
     --subnet=172.19.0.0/16 network-node-02{% endraw %}
</pre>

<pre class="lang:sh decode:true">
{% raw %}
$ docker run -d \
    --net network-node-02 \
    -p 80:8080 \
    ekofr/http-ip{% endraw %}
</pre>

Nous voilà prêt à découvrir ce que nous apporte Consul.

&nbsp;

## Requêtes DNS
Vous pouvez en effet maintenant résoudre votre service <span class="lang:default decode:true crayon-inline ">http-ip.service.consul</span>  en utilisant le serveur DNS apporté par Consul, vous devriez voir vos deux services enregistrés :

<pre class="lang:sh decode:true ">
{% raw %}
$ dig @$(docker-machine ip consul) http-ip.service.consul

;; QUESTION SECTION:
;http-ip.service.consul. IN A

;; ANSWER SECTION:
http-ip.service.consul. 0 IN A 192.168.99.100
http-ip.service.consul. 0 IN A 192.168.99.102{% endraw %}
</pre>

&nbsp;

Autrement dit, un load balancing sera fait sur un de ces deux services lorsque vous chercherez à joindre <span class="lang:default decode:true crayon-inline ">http://http-ip.service.consul</span> .

Oui, mais qu'en est-il du côté de la répartition de cette charge ? Pouvons-nous définir une priorité et/ou poids ?<br />
Malheureusement, la réponse est non, pas pour le moment. Une issue a cependant été ouverte sur Github pour demander le support de celui-ci : <a href="https://github.com/hashicorp/consul/issues/1088">https://github.com/hashicorp/consul/issues/1088</a>.

&nbsp;

En effet, si nous regardons de plus près l'enregistrement DNS de type <span class="lang:default decode:true crayon-inline ">SRV</span> , voici ce que nous obtenons :

<pre class="lang:sh decode:true ">
{% raw %}
$ dig @$(docker-machine ip consul) http-ip.service.consul SRV

;; ANSWER SECTION:
http-ip.service.consul. 0 IN SRV 1 1 80 c0a86366.addr.dc1.consul.
http-ip.service.consul. 0 IN SRV 1 1 80 c0a86364.addr.dc1.consul.{% endraw %}
</pre>

&nbsp;

Comme vous pouvez le voir, la priorité et le poids sont tous les deux définis à 1, le load balancing sera donc équilibré entre tous les services.

Si vous ajoutez l'IP de la machine Consul en tant que serveur DNS sur votre système d'exploitation, vous pourrez donc appeler votre service en HTTP et vous rendre compte plus facilement du load balancing :

<pre class="lang:sh decode:true ">
{% raw %}
$ curl http://http-ip.service.consul
hello from 172.18.0.2

$ curl http://http-ip.service.consul
hello from 172.19.0.2{% endraw %}
</pre>

&nbsp;

Nous avons ici une IP correspondant à chaque service HTTP que nous avons enregistré.

&nbsp;

# Failure detection
Nous allons maintenant ajouter un Health Check à notre service afin de s'assurer que celui-ci peut être utilisé.

Nous allons donc commencer par retourner sur notre node 01 et supprimer le container <span class="lang:default decode:true crayon-inline ">ekofr/http-ip</span>  afin de le recréer avec un Health Check :

<pre class="lang:sh decode:true">
{% raw %}
$ eval $(docker-machine env swarm-node-01){% endraw %}
</pre>

<pre class="lang:sh decode:true ">
{% raw %}
$ docker kill \
$(docker ps -q --filter='ancestor=ekofr/http-ip'){% endraw %}
</pre>

&nbsp;

Registrator nous offre des variables d'environnement afin d'ajouter des Health Check de nos containers à Consul, vous pouvez consulter la liste de toutes les variables disponibles ici : <a href="http://gliderlabs.com/registrator/latest/user/backends/#consul">http://gliderlabs.com/registrator/latest/user/backends/#consul</a>.

&nbsp;

L'idée est pour nous de vérifier que le port 80 répond correctement, nous allons donc ajouter un script exécutant simplement une requête curl. Pour ce faire :

<pre class="lang:sh decode:true ">
{% raw %}
$ docker run -d \
    --net network-node-01 -p 80:8080 \
    -e SERVICE_CHECK_SCRIPT="curl -s -f http://$(docker-machine ip swarm-node-01)" \
    -e SERVICE_CHECK_INTERVAL=5s \
    -e SERVICE_CHECK_TIMEOUT=1s \
    ekofr/http-ip{% endraw %}
</pre>

&nbsp;

Vous pouvez faire de même sur le node 02 (en faisant attention à bien modifier les <span class="lang:default decode:true crayon-inline ">node-01</span>  en <span class="lang:default decode:true crayon-inline ">node-02</span> ) et vous devriez maintenant pouvoir visualiser ces checks sur l'interface Consul :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/02/consul-checks.png"><img class="aligncenter size-full wp-image-3446" src="http://blog.eleven-labs.com/wp-content/uploads/2017/02/consul-checks.png" alt="" width="881" height="446" /></a>

&nbsp;

De la même façon, vous pouvez également utiliser l'API de Consul afin de vérifier la santé de vos services :

<pre class="lang:sh decode:true ">
{% raw %}
$ curl http://$(docker-machine ip consul):8500/v1/health/checks/http-ip ..
[
  {
    "Status": "passing",
    "Output": "hello from 172.18.0.2",
    "ServiceName": "http-ip",
  },
  ...
]{% endraw %}
</pre>

&nbsp;

# Conclusion
Vous pouvez maintenant mettre en place Consul sur vos architectures afin de vous assurer que les services contactés sont bien disponibles mais surtout pouvoir identifier les éventuels problèmes qui peuvent survenir sur vos services.

Il est donc important d'ajouter un maximum de checks sur les éléments pouvant rendre vos services indisponibles (vérifier que celui-ci peut bien être contacté, vérifier l'espace disque disponible sur la machine, etc ...).

Consul est un outil qui s'intègre parfaitement dans vos architectures, grâce à son utilisation très simple et son API complète.


