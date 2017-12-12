---
layout: post
title: Monitorer ses containers Docker
lang: fr
permalink: /fr/monitorer-ses-containers-docker/
excerpt: "Les containers sont aujourd'hui largement utilisés en développement jusqu'en production. Cependant un `docker stats` en ssh ne permet pas de gèrer correctement sont environnement de production. Nous allons donc voir comment répondre à ce besoin de monitoring pour des containers en production."
authors:
    - qneyrat
categories:
    - monitoring
    - docker
    - prometheus
tags:
    - monitoring
    - docker
    - prometheus
cover: /assets/2017-12-12-monitorer-ses-containers-docker/cover.jpeg
---

Les containers sont aujourd'hui largement utilisés en développement jusqu'en production. Cependant un `docker stats` en ssh ne permet pas de gèrer correctement sont environnement de production. Nous allons donc voir comment répondre à ce besoin de monitoring pour des containers en production.

Nous allons donc aborder plusieurs technologies pour répondre à ce besoin :
- [cAdvisor](https://github.com/google/cadvisor), solution rendue open-source par Google qui permet d'exposer l'ensemble des metrics des containers.
- [Prometheus](https://github.com/prometheus/prometheus), solution open-source de base de données orienté time series.
- [Grafana](https://github.com/grafana/grafana), solution open-source de dashboard très facilement configurable qui va permettre de tracer de jolies graphs.

> **Ressource :**
> [ctop](https://ctop.sh/) vous permets de visualiser les infos de `docker stats` dans le style de `htop`.

La stack que nous allons voir fonctionne comme ceci :

- `cAdvisor` va exposer un endpoint `http://cadvisor:8080/metrics` avec l'ensemble des metrics des containers au moment `t`.

- `Prometheus` va requêter toute les `x` secondes l'endpoint de cAdvisor et stocker les metrics dans sa base de données.

- `Grafana` va afficher les metrics de Prometheus sous forme de graphs.

Avant de commencer, assurez-vous d'avoir installé `docker` et `docker-compose`. Mes versions pour écrire cet article sont :

```bash
> $ docker --version; docker-compose --version
Docker version 17.11.0-ce, build 1caf76c
docker-compose version 1.17.1, build 6d101fb
```

Pour commencer, nous allons installer rapidement une application, prenons par exemple comme base [Api Platform](https://api-platform.com/).

```bash
> $ git clone git@github.com:api-platform/api-platform.git
> $ git checkout v2.1.4
> $ docker-compose up
> $ open http://127.0.0.1
```
Une fois installé, vous devriez vous la documentation de l'api que vous venez d'installer.

![api](/assets/2017-12-12-monitorer-ses-containers-docker/api.png)

## cAvisor

Nous allons maintenant ajouter `cAvisor` au `docker-compose.yml` :

> **Ressource :**
> vous pouvez retrouver [les fichiers `docker-compose.yml` et `prometheus.yml` ici](https://gist.github.com/qneyrat/318e7433b8c4de9edeccbac8ef0ec335).

```yml
services:
...
cadvisor:
image: google/cadvisor
container_name: cadvisor
volumes:
- /:/rootfs:ro
- /var/run:/var/run:rw
- /sys:/sys:ro
- /var/lib/docker/:/var/lib/docker:ro
expose:
- 8080
ports:
- "8005:8080"
networks:
- monitoring

networks:
monitoring:
driver: bridge
```

Nous pouvons relancer le `docker-compose`.

```bash
> $ docker-compose build
> $ docker-compose up
> $ open http://localhost:8005/docker/
```

Nous avons maintenant accès à l'interface de `cAdvisor`.

![cadvisor](/assets/2017-12-12-monitorer-ses-containers-docker/cadvisor.png)

Ce qui nous permet déjà de voir sommairement les metrics de nos containers.

image

Malgré tout cette solution seul n'est pas assez configurable et ne peut pas répondre pleinement à notre besoin.

## Prometheus

Commençons par installer `Prometheus` :

```yml
services:
...
prometheus:
image: prom/prometheus:v2.0.0
container_name: prometheus
volumes:
- ./docker/prometheus/:/etc/prometheus/
- prometheus-data:/prometheus
command:
- '--config.file=/etc/prometheus/prometheus.yml'
- '--storage.tsdb.path=/prometheus'
- '--web.console.libraries=/etc/prometheus/console_libraries'
- '--web.console.templates=/etc/prometheus/consoles'
- '--storage.tsdb.retention=200h'
expose:
- 9090
ports:
- "9090:9090"
networks:
- monitoring

volumes:
...
prometheus-data: {}
```

Et ajoutons dans le dossier `docker` le fichier de configuration de `Prometheus` `prometheus.yml` dans le dossier `prometheus`.

```yml
global:
scrape_interval: 15s
evaluation_interval: 15s
external_labels:
monitor: 'docker-host-alpha'

rule_files:
- "targets.rules"
- "host.rules"
- "containers.rules"

scrape_configs:
- job_name: 'cadvisor'
scrape_interval: 5s
static_configs:
- targets: ['cadvisor:8080']

- job_name: 'prometheus'
scrape_interval: 10s
static_configs:
- targets: ['localhost:9090']
```

Nous pouvons remarquer le job de scraping `cadvisor` sur l'endpoint `cadvisor:8080`. Prometheus va toujours scraper selon le schéma suivant :

```
/metrics
```

Pour la configuration, le `/metrics` est implicite.

Nous pouvons de nouveau relancer le `docker-compose`.

```bash
> $ docker-compose build
> $ docker-compose up
> $ open http://localhost:9090/targets
```

Nous pouvons voir que les jobs que nous avons configuré sont bien `up`. C'est à dire que `Prometheus` a bien réussi à scraper les metrics de `cAdisor` et de `Prometheus`.

![metrics](/assets/2017-12-12-monitorer-ses-containers-docker/metrics.png)

## Grafana

Nous allons maintenant installer `Grafana` :

```yml
services:
...
grafana:
image: grafana/grafana:4.6.2
container_name: grafana
volumes:
- grafana-data:/var/lib/grafana
expose:
- 3000
ports:
- "3000:3000"
networks:
- monitoring

volumes:
...
grafana-data: {}
```

Nous pouvons lancer une dernière fois le `docker-compose`.

```bash
> $ docker-compose build
> $ docker-compose up
> $ open http://localhost:3000
```

> **Accès :**
> les accès par défaut du Grafana sont
>admin
>admin

Commençons par ajouter notre `Prometheus` comme `Data Sources`. Rendons-nous sur [http://localhost:3000/datasources/new](http://localhost:3000/datasources/new) et ajoutons le host de notre `Prometheus`.

![grafana](/assets/2017-12-12-monitorer-ses-containers-docker/grafana.png)

Maintenant que `Grafana` peut accèder à notre `Prometheus`. Il nous reste plus qu'à créer un nouveau dashboard. Pour gagner du temps nous allons en importer directement.

> [https://grafana.com/dashboards/193](https://grafana.com/dashboards/193)

Importons ce nouveau dashboard [http://localhost:3000/dashboard/new?editview=import∨gId=1](http://localhost:3000/dashboard/new?editview=import∨gId=1) et mettons l'id de template `193`. Une fois fait, nous pouvons nous rendre sur notre dashboard.

> [http://localhost:3000/dashboard/db/docker-monitoring?refresh=10s∨gId=1](http://localhost:3000/dashboard/db/docker-monitoring?refresh=10s∨gId=1)

![dashboard](/assets/2017-12-12-monitorer-ses-containers-docker/dashboard.png)

Selon vos besoins, vous pouvez créer des dashboards plus spécifique avec les informations que vous avez besoin.
Pour `Prometheus`, il existe de nombreux `exporter` pour pouvoir récupérer encore plus de metrics comme par exemple pour `Redis` ou `RabbitMQ`.
Vous pouvez aussi créer vous-même un `exporter` du moment qu'il expose des metrics sur un endpoint `HTTP` `/metrics` ou encore exposer des metrics métier de votre application.

> **Ressource :**
> vous pouvez retrouvez l'exposition de metrics métier dans une application Java expliquer dans cette article
> [http://blog.xebia.fr/2017/07/28/superviser-mon-application-play-avec-prometheus](http://blog.xebia.fr/2017/07/28/superviser-mon-application-play-avec-prometheus)

## Ressources complémentaires

- [https://prometheus.io/blog/2017/05/17/interview-with-iadvize/](https://prometheus.io/blog/2017/05/17/interview-with-iadvize/)
- [https://www.digitalocean.com/community/tutorials/how-to-install-prometheus-on-ubuntu-16-04](https://www.digitalocean.com/community/tutorials/how-to-install-prometheus-on-ubuntu-16-04)
- [https://www.ctl.io/developers/blog/post/monitoring-docker-services-with-prometheus/](https://www.ctl.io/developers/blog/post/monitoring-docker-services-with-prometheus/)

## Dépots Github pour le monitoring avec Docker
- [https://github.com/vegasbrianc/prometheus](https://github.com/vegasbrianc/prometheus)
- [https://github.com/stefanprodan/dockprom](https://github.com/stefanprodan/dockprom)
