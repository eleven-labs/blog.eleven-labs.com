---
layout: post
lang: fr
date: '2017-12-18'
categories:
  - architecture
  - javascript
authors:
  - captainjojo
cover: /assets/2017-12-18-devops-facile/cover.jpg
excerpt: >-
  Deployer dans le Cloud c'est encore plus simple que de faire un Rsync. En
  voici la preuve avec ce petit tutoriel.
title: Devenir DevOps c'est facile
slug: devops-facile
oldCategoriesAndTags:
  - architecture
  - javascript
  - google
  - devops
permalink: /fr/devops-facile/
---

Ce n'est pas parce que l'on n'est pas DevOps que l'on ne peut pas mettre en production notre code dans le Cloud.

Depuis que deployer n'est plus un Rsync ou un upload FTP (oui je suis #old) la mise en place d'un environnement de production est devenu un métier à part entière. Puis il y a eu l'avènement du Cloud et là je me suis senti encore plus perdu.

Sauf que le Cloud c'est justement ce qui ma permis de remettre un pied dans le monde secret du déploiement en production.

Le but de ce petit article est de montrer qu'avec peu d'effort on peut avoir une application scalable dans le Cloud sans une ligne de bash.

## Le besoin

Mettre en production une application front en React. L'application n'a pas de serveur, c'est du pur React, nous avons donc besoin d'un serveur web type Nginx. Pour ce qui est des assets, on les veut avec un CDN puissant.

## Mise en place

Notre première idée était de mettre l'ensemble des fichiers générés (Javascript/CSS/HTML) dans un [Bucket Google Cloud](https://cloud.google.com/storage/?hl=fr).

Pour cela rien de plus simple, comme le projet est hébergé sur GitHub et que nous avons Travis pour les tests unitaires, nous allons utiliser Travis pour faire le déploiement aussi.

> Oui Travis permet aussi le déploiement !

Je vous invite à regarder la documentation disponible [ici](https://docs.travis-ci.com/user/deployment).

Dans notre fichier `.travis.yml` nous avons seulement besoin d'ajouter :

```yml
deploy:
  provider: gcs
  access_key_id: $GCS_ACCESS_KEY_ID
  secret_access_key: $GCS_SECRET_ACCESS_KEY
  bucket: "tutos"
  skip_cleanup: true
  acl: public-read
  local-dir: public
  on:
    branch: master
```

Et voilà, vous avez déployé tout ce qui est contenu dans le dossier `public` dans le [bucket](https://cloud.google.com/storage/?hl=fr) `tutos`.

Cela fut très pratique, mais la navigation React ne fonctionnait pas. Effectivement, Storage se comporte mal lors d'un changement dynamique d'url (en même temps ce n'est pas fait pour cela). Cloud storage ce n'est pas un serveur web, c'est très bien pour nos assets mais ce n'est pas fait pour gérer l'application.

> Mais alors comment faire ?

La première idée aurait été de créer une machine dans le cloud avec [Compute Engine](https://cloud.google.com/compute/?hl=fr). Mais là on arrive à ma problèmatique. Il va faloir faire la machine et ensuite ccréer des scripts de déploiement avec un système de rollback etc...

> Mais comment faire ?

C'est la que l'idée de [App Engine](https://cloud.google.com/appengine/?hl=fr) est apparue.  App Engine permet d'avoir une application évolutive, ce dernier scale automatiquement selon le CPU de la machine. De plus il permet de mettre en production plusieurs versions de l'application et donc de garder chacune d'elles et faire du [rolling deployment](http://searchitoperations.techtarget.com/definition/rolling-deployment).

Ce qui est super pratique c'est que App Engine prend en compte les Dockerfile, il faut donc simplement lui donner la configuration de votre Docker.

Pour notre projet, qui est statique, nous avons suivi le tutoriel Google disponible [ici](https://cloud.google.com/appengine/docs/flexible/custom-runtimes/quickstart).

Donc dans notre projet nous avons ajouté le fichier Dockerfile suivant :

```sh
# The standard nginx container just runs nginx. The configuration file added
# below will be used by nginx.
FROM nginx

# Copy the nginx configuration file. This sets up the behavior of nginx, most
# importantly, it ensure nginx listens on port 8080. Google App Engine expects
# the runtime to respond to HTTP requests at port 8080.
COPY nginx.conf /etc/nginx/nginx.conf

# create log dir configured in nginx.conf
RUN mkdir -p /var/log/app_engine

# Create a simple file to handle heath checks. Health checking can be disabled
# in app.yaml, but is highly recommended. Google App Engine will send an HTTP
# request to /_ah/health and any 2xx or 404 response is considered healthy.
# Because 404 responses are considered healthy, this could actually be left
# out as nginx will return 404 if the file isn't found. However, it is better
# to be explicit.
RUN mkdir -p /usr/share/nginx/www/_ah && \
    echo "healthy" > /usr/share/nginx/www/_ah/health

# Finally, all static assets.
ADD www/ /usr/share/nginx/www/
RUN chmod -R a+r /usr/share/nginx/www
```

Puis la configuration de notre serveur nginx :

```sh
# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs will appear on the Google Developer's Console when logged to this
    # directory.
    access_log /var/log/app_engine/app.log;
    error_log /var/log/app_engine/app.log;

    gzip on;
    gzip_disable "msie6";

    server {
        # Google App Engine expects the runtime to serve HTTP traffic from
        # port 8080.
        listen 8080;
        root /usr/share/nginx/www;
        index index.html index.htm;

        location / {
          try_files $uri $uri/ /index.html;
        }
    }
}
```

Pour terminer il faut ajouter le fichier `app.yml` qui permet de dire à App Engine quel machine utiliser :

```sh
runtime: custom
env: flex
```

Il ne vous reste plus qu'à dire à Travis que vous voulez déployer dans Google App Engine. Nous avons tout de même gardé le déploiement dans Google Storage pour les assets, ce qui donne la configuration dans le fichier `.travis.yml` suivante :

```yaml
deploy:
  - provider: gcs
    access_key_id: $GCS_ACCESS_KEY_ID
    secret_access_key: $GCS_SECRET_ACCESS_KEY
    bucket: "tutos"
    skip_cleanup: true
    acl: public-read
    cache_control: "public,max-age=60"
    local-dir: _posts
    on:
      branch: master
  - provider: gae
    keyfile: "codelabs-1ddb09746a38.json"
    project: "codelabs-179614"
    local-dir: nginx
    skip_cleanup: true
    on:
      branch: master
```

Attention, dans les tutoriels que vous allez trouver, il faut récupérer le fichier de `credentials` fourni par Google et l'encoder via les scripts de Travis. Surtout ne versionnez pas le fichier de credentials mais seulement le fichier encodé. Il faut seulement garder le fichier de Google en local à l'abri des regards.

## Conclusion

En quelques lignes de code et un peu de lecture de tutoriel, vous avez déployé votre application sur des serveurs scalables et dans un service d'asset avec le CDN Google. Ce qui est magique c'est qu'avec l'ensemble des outils Google, vous pouvez monitorer votre application simplement (CPU/Mémoire/Logs).

Le Cloud et l'outillage associés nous aident tous à devenir des DevOps en puissance. Il suffit de s'y mettre.

Vous pouvez retrouver le projet [ici](https://github.com/eleven-labs/codelabs).
