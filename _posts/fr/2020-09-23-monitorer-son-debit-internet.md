---
layout: post
title: >
    Monitorer son débit internet
excerpt: >
    Voyons ensemble comment monitorer son débit internet avec un Raspberry Pi
lang: fr
authors:
    - VEBERArnaud
permalink: /fr/monitorer-son-debit-internet/
categories:
    - monitoring
tags:
    - monitoring
    - raspberry pi
---

## Le projet
Il y a quelques mois j'ai changé de contrat internet à mon domicile, passant par la même occasion sur la fibre.
Passé l'excitation d'une connexion beaucoup plus rapide, j'ai commencé à ressentir de la frustration à la moindre petite
latence.
Par ~~conscience scientifique~~ curiosité, j'ai voulu déterminer si ces latences étaient psychologiques ou bien réelles en
testant régulièrement ma connexion internet avec [speedtest.net](https://speedtest.net) pour finalement me dire qu'une
automatisation était certainement possible.

Après quelques recherches et la découvert de l'utilitaire [speedtest-cli](https://www.speedtest.net/apps/cli), le projet
était lancé.

L'objectif étant de récupérer a interval régulier, historiser et consulter ces mesures.

![]({{site.baseurl}}/assets/2020-09-23-monitorer-son-debit-internet/dashboard.png)

## Architecture globale du projet
Notre projet se décompose en deux parties, d'une part le stockage et la visualisation des métriques et d'autre part
la récupération de ces métriques.
Le tout sera hébergé sur un Raspberry Pi avec docker et docker-compose.

![]({{site.baseurl}}/assets/2020-09-23-monitorer-son-debit-internet/schema.png)

Pour la première partie, stockage et visualisation des métriques, nous allons utiliser InfluxDB et Grafana.
InfluxDB est une base de données time series conçue pour supporter des charges soutenues en lecture et en écriture.
Grafana est une solution d'analyse et de monitoring supportant de nombreuses sources de données.

Pour la seconde partie, récupération des métriques, nous allons utiliser notre version conteneurisé de speedtest-cli.
L'exécution de cette tache sera planifiée pour un lancement toutes les 10 minutes à l'aide d'un cron job sur le
raspberry pi.

Les présentations étant faites, enchaînons directement avec la création des composants de notre projet.

## Stockage et visualisation des métriques
Voyons tout de suite la stack docker-compose permettant la mise en place de la partie stockage et
visualisation, puis prenons le temps de la comprendre.

`./docker-compose.yaml`
```yaml
version: "3.7"

services:
  grafana:
    image: grafana/grafana:7.1.5

    volumes:
      - "grafana-storage:/var/lib/grafana"

    networks:
      - speedtest
    ports:
      - "3000:3000"

  influxdb:
    image: influxdb:1.8.2

    volumes:
      - "influxdb-data:/var/lib/influxdb"

    networks:
      - speedtest
    expose:
      - "8086"

networks:
  speedtest:
    name: speedtest
    driver: bridge

volumes:
  grafana-storage:
  influxdb-data:
```

Cette stack docker-compose en version `"3.7"` définie nos deux services, `grafana` et `influxdb`.
Elle définie également deux volumes `grafana-storage` et `influxdb-data`, et un network `speedtest` en bridge.

Le service `grafana` lance un conteneur docker basé sur l'image officielle `grafana/grafana` en version `7.1.5`,
attache le volume `grafana-storage` au point de montage `/var/lib/grafana` pour la persistance des données de
configuration de Grafana, utilise le réseau `speedtest` et map le port `3000` de l'hôte (le raspberry pi) au port
`3000` du conteneur (Grafana) nous permettant ainsi d'atteindre l'interface de Grafana via l'url
`http://<ip_raspberry_pi>:3000/`.

Le service `influxdb` lance un conteneur docker basé sur l'image officielle `influxdb` en version `1.8.2`,
attache le volume `influxdb-data` au point de montage `/var/lib/influxdb` permettant la persistance des données, et
expose le port `8086` dans le réseau `speedtest` permettant une communication interne dans ce réseau via le hostname
`influxdb`.

> Les versions d'images ont été pinnées `majeur.mineur.patch` pour faciliter le suivi de la partie pratique en éliminant
> les soucis de compatibilité des futures versions, mais rien oblige à rester sur ces versions si les compatibilités
> sont vérifiées.

Démarrons maintenant cette stack docker-compose avec la commande:
```bash
docker-compose up -d
```

Puis vérifions que vos 2 conteneurs sont bien au statut `Up` avec la commande.
```bash
docker-compose ps

        Name                  Command           State    Ports
----------------------------------------------------------------
speedtest_grafana_1    /run.sh                  Up      3000/tcp
speedtest_influxdb_1   /entrypoint.sh influxd   Up      8086/tcp
```

Maintenant que notre stack stockage et visualisation est démarrée, intéressons nous à la partie récupération des
métriques.

## Récupération des métriques
Comme annoncé précédemment, nous allons ici utiliser notre propre image docker embarquant speedtest-cli.

### Docker entrypoint
Commençons par créer notre script bash servant d'entrypoint docker et qui sera en charge de l'exécution de speedtest-cli,
de l'extraction des informations qui nous intéressent, puis de l'envoi des métriques à InfluxDB.

`./docker-entrypoint.sh`
```bash
#!/usr/bin/env bash

# InfluxDB variables
influxdb_proto=${INFLUXDB_PROTO:-http}
influxdb_host=${INFLUXDB_HOST:-influxdb}
influxdb_port=${INFLUXDB_PORT:-8086}
influxdb_db=${INFLUXDB_DB:-speedtest}

influxdb_url="${influxdb_proto}://${influxdb_host}:${influxdb_port}"

# run speedtest & store result
json_result=$(speedtest -f json --accept-license --accept-gdpr)

# Extract data from speedtest result
result_id=$(echo "${json_result}" | jq -r '.result.id')
ping_latency=$(echo "${json_result}" | jq -r '.ping.latency')
download_bandwidth=$(echo "${json_result}" | jq -r '.download.bandwidth')
upload_bandwidth=$(echo "${json_result}" | jq -r '.upload.bandwidth')

# Ensure InfluxDB database exists
curl \
    -d "q=CREATE DATABASE ${influxdb_db}" \
    "${influxdb_url}/query"

# Write metric to InfluxDB
curl \
    -d "speedtest,result_id=${result_id} ping_latency=${ping_latency},download_bandwidth=${download_bandwidth},upload_bandwidth=${upload_bandwidth}" \
    "${influxdb_url}/write?db=${influxdb_db}"
```

On commence par définir les variables permettant la communication avec InfluxDB:
- `influxdb_proto`: le protocole de communication avec InfluxDB, par défaut `http`, surchargeable par la variable
d'environnement `INFLUXDB_PROTO`
- `influxdb_host`: le hostname du conteneur InfluxDB, par défaut `influxdb`, surchargeable par la variable
d'environnement `INFLUXDB_HOST`
- `influxdb_port`: le port d'écoute du conteneur InfluxDB, par défaut `8086`, surchargeable par la variable
d'environnement `INFLUXDB_PORT`
- `influxdb_db`: le nom de la base de données InfluxDB à utiliser, par défaut `speedtest`, surchargeable par la variable
d'environnement `INFLUXDB_DB`

L'ensemble de ces variables étant ensuite concaténées afin de produire l'url permettant la communication avec InfluxDB

Ensuite on stock dans une variable le résultat de la commande speedtest exécutée avec les options et arguments:
- `-f json`: spécifie le format de retour à `json`, nous facilitant l'extraction par la suite
- `--accept-license`: pour accepter en non interactif la license d'utilisation speedtest/Ookla
- `--accept-gdpr`: pour accepter en non interactif les conditions de conservation/utilisation des résultats par
speedtest/Ookla

Une fois notre résultat récupéré, nous utilisons l'utilitaire `jq` pour extraire les informations qui nous intéressent:
- `result_id`: l'id unique du test chez speedtest/Ookla
- `ping_latency`: la latence du ping en millisecondes
- `download_bandwidth`: le débit descendant de notre connexion internet en bytes par secondes
- `upload_bandwidth`: le débit montant de notre connexion internet en bytes par secondes

Maintenant que nous avons toutes les informations qui nous intéressent dans des variables, assurons nous que la base de
données InfluxDB `speedtest` existe en forçant la création si celle ci n'existe pas en exécutant la query
`CREATE DATABASE ${influx_db}` sur le endpoint `/query` d'InfluxDB.

Puis pour finir écrivons dans cette base de données nos résultats sur le endpoint `/write` d'InfluxDB en précisant le
nom de notre base de données `?db=${influxdb_db}`, avec la data
`speedtest,result_id=${result_id} ping_latency=${ping_latency},download_bandwidth=${download_bandwidth},upload_bandwidth=${upload_bandwidth}`

> Plus d'informations sur l'écriture dans InfluxDB sont disponibles dans la
> [documentation officielle](https://docs.influxdata.com/influxdb/v1.8/guides/write_data/)

Ajoutons ensuite les droits d'exécution sur ce script avec la commande `sudo chmod +x ./docker-entrypoint.sh`.

Notre entrypoint est prêt, passons maintenant à la création de l'image docker responsable de l'exécution de ce script

### Dockerfile
La documentation d'[installation](https://www.speedtest.net/fr/apps/cli#installation) de speedtest-cli donne des
instructions pour Debian, nous allons donc partir d'une image debian pour créer la nôtre et nous inspirer de
cette documentation d'installation en l'adaptant à notre cas.

`./Dockerfile`
```dockerfile
FROM debian:buster-slim

ENV INSTALL_KEY 379CE192D401AB61
ENV DEB_DISTRO buster

# install requirements curl & jq
RUN apt-get update && apt-get install -y curl jq

# install speedtest
RUN apt-get update && apt-get install -y gnupg1 apt-transport-https dirmngr && \
        apt-key adv --keyserver keyserver.ubuntu.com --recv-keys $INSTALL_KEY && \
        echo "deb https://ookla.bintray.com/debian ${DEB_DISTRO} main" | tee /etc/apt/sources.list.d/speedtest.list && \
        apt-get update && \
        apt-get install speedtest

COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
```

Nous partons donc d'une image officielle `debian` en version `buster-slim`, la slim étant largement suffisante
pour notre projet tout en préservant l'espace disque si précieux de notre raspberry pi.

Définissons ensuite quelque variables d'environnements:
- `INSTALL_KEY`: récupérée de la documentation d'installation de speedtest-cli.
- `DEB_DISTRO`: pour supprimer l'étape `lsb_release -sc` de la documentation d'installation speedtest-cli étant donné
que l'on connaît la distribution debian utilisée via sa version.

On installe ensuite les paquets requis (`curl`, `jq`) par notre script bash d'entrypoint.

Ensuite on installe `speedtest-cli`, inspirée par la documentation d'installation speedtest-cli mais adaptée pour
docker.

Et pour finir on copie notre script bash `docker-entrypoint.sh`, dans l'image et on indique que ce script sert
d'entrypoint.

Passons au build de notre image docker avec la commande

```bash
docker build -t docker.local/speedtest:buster-slim .
```

Notre système de récupération, extraction et écriture étant prêt, passons maintenant à la planification de cette tache.

### Cron Job
Après de multiples test de résolution (toutes les heures, toutes les demi-heures, toutes les minutes, ...), je me suis
arrêté sur une mesure toutes les 10 minutes qui permet une bonne visibilité sans trop charger le réseau. Pour cela nous
allons ajouter un cron job sur notre raspberry pi.

Utilisez la commande
```bash
crontab -e
```

Et ajoutez en fin de fichier la ligne suivante avant de sauvegarder.
```
*/10 * * * * /usr/bin/docker run --rm --network speedtest docker.local/speedtest:buster-slim
```

Cela signifie que toutes les 10 minutes (`*/10 * * * *`), la commande
`/usr/bin/docker run --rm --network speedtest docker.local/speedtest:latest` sera exécutée. Cette commande ayant pour
responsabilité de démarrer un conteneur docker depuis l'image précédemment créée `docker.local/speedtest:latest` dans le
réseau `speedtest` (pour la communication avec `influxdb`) puis de supprimer le conteneur (`--rm`) une fois l'exécution
terminée.

## Configuration de grafana
La dernière étape de notre projet consiste a configurer notre Grafana en:
- se connectant a l'interface web
- ajoutant `influxdb` comme source de données
- créant un dashboard pour une meilleure visualisation des données de la source `influxdb`

### Connexion à l'interface web

Pour vous connecter a l'interface web de Grafana, rendez vous à l'url `http://<ip_raspberry_pi>:3000/`.

Un écran de connexion s'affiche, utilisez le username `admin` et le mot de passe `admin` pour votre première connexion.
Vous serez ensuite redirigé vers une page vous permettant de changer le mot de passe de l'utilisateur `admin`.

![]({{site.baseurl}}/assets/2020-09-23-monitorer-son-debit-internet/grafana_connect.gif)

### Source de donnée InfluxDB

Intéressons nous maintenant à le configuration de la data source InfluxDB dans Grafana.

Depuis l'accueil de Grafana, sélectionnez `Add your first data source` ou rendez vous à l'url
`http://<ip_raspberry_pi>:3000/datasources/new`.

Sélectionnez ensuite `InfluxDb`.

Sur la page configuration de la data source, il faut renseigner l'url `http://influxdb:8086` dans la section "HTTP", puis
renseigner le nom de la base de données `speedtest` dans la section "InfluxDB Details".

Vous pouvez alors Sauvegarder et tester la connexion (bouton "Save & Test").

![]({{site.baseurl}}/assets/2020-09-23-monitorer-son-debit-internet/grafana_datasource.gif)

### Création du dashboard

Pour la configuration du dashboard, on va importer directement le json que j'ai exporté de mon installation.

Dans le menu survolez le `+` (Create) puis sélectionnez "Import".

Récupérez le json dans ce [gist](https://gist.github.com/VEBERArnaud/4d37935fe906324dd18ff01cb511eda6) et collez le dans
la zone "Import via panel json" puis chargez le (bouton "Load").

Et enfin importez le (bouton "Import").

![]({{site.baseurl}}/assets/2020-09-23-monitorer-son-debit-internet/grafana_dashboard.gif)

## Conclusion
En quelques minutes nous avons mis en place une solution permettant de monitorer votre débit internet, cependant cette
solution peut être améliorée.
Je pense par exemple à la multiplication des mesures en augmentant le nombre de serveurs de tests pour ne pas toujours
me fier au serveur sélectionner automatiquement par speedtest-cli (voir `speedtest -L`).

N'étant pas totalement satisfait de la méthode utilisé pour les mesures je ne me lancerai pas dans une analyse des
résultats, mais libre à chacun de les interpréter comme ils le souhaitent.
