---
lang: en | fr
date: 2023-07-25
slug: comprendre-et-personnaliser-ses-docker
title: Comprendre et Personnaliser ses Docker
excerpt: Comprendre comment fonctionne docker et être capable de créer les siens sur mesure.
categories:
    - docker | architecture
keywords:
    - docker
    - dockerfile
    - docker-compose
    - comprendre
    - personnaliser
    - image
    - container
    - volume
    - instruction
    - commande
authors:
    - kadorais
---

[//]: # (![baleine]&#40;/assets\cover.jpg "baleine"&#41;)
![cover]({{ site.baseurl }}/assets/2023-07-25-comprendre-et-personnaliser-ses-docker/cover.jpg)

# Comprendre et Personnaliser ses Docker

## Introduction

Docker s'est imposé comme un incontournable.
Il permet d'emballer des applications et leurs dépendances dans des conteneurs légers et portables, offrant ainsi une flexibilité et une cohérence accrues lors du déploiement sur différentes plateformes.

En première partie, nous allons découvrir l'ecosysteme docker.

Ensuite, nous expliquerons comment créer ces propre images docker a l'aide des dockerfile.

Puis, nous explorerons Docker Compose, un outil qui vient compléter Docker en permettant la gestion d'applications multi-containers.
Avec Docker Compose, vous pourrez définir et orchestrer vos services en un seul fichier.

Que vous soyez un débutant cherchant à comprendre les bases de Docker ou un utilisateur chevronné souhaitant améliorer ses compétences avec
Docker Compose, cet article vous fournira les connaissances nécessaires pour en tirer pleinement parti.

## L'écosystème Docker

[//]: # (![ecosystem docker]&#40;/assets\ecosystem.png "ecosystem docker"&#41;)
![ecosystem]({{ site.baseurl }}/assets/2023-07-25-comprendre-et-personnaliser-ses-docker/ecosystem.png)

### Une Image

Une image Docker est un modèle de système, qui contient tous ce qui est nécessaires pour exécuter une application, y compris le code, les dépendances, les bibliothèques système et les fichiers de configuration.

Nous pouvons utiliser une image fournit sur [docker hub](https://hub.docker.com/) ou créer notre propre image sur mesure.
Dans le cas de l'utilisation d'une image existante, il est conseillé d'utiliser des images officiels.

Commandes pour manipuler les images:

- Voir les commandes : `docker image --help`
- Lister les images : `docker image ls -a`
- Supprimer les image non utilisées : `docker image prune`

### Un Container

Un conteneur Docker est une instance exécutable d'une image Docker.
Il s'agit d'un environnement isolé et autonome qui encapsule une application ou un service, ainsi que toutes ses dépendances.

Chaque conteneur Docker est créé à partir d'une image Docker et peut être lancé, arrêté, supprimé et déplacé facilement d'un système à un autre.

- Voir les commandes : `docker container --help`
- Lister les images : `docker container ls -a`
- Supprimer les image non utilisées : `docker container prune`

### Un Volume

Les volumes permettent aux conteneurs de stocker des données.
Ils sont initialisés lors de la création d'un conteneur.

Ils permettent de conserver des données même si un conteneur est supprimé, mis à jour ou rechargé.

- Voir les commandes : `docker volume --help`
- Lister les volumes : `docker volume ls -a`
- Supprimer les volumes non utilisées : `docker volume prune`
- Creer un volume : `docker volume create myvolume`

Il existe 3 type de volumes.

#### Type Volume

Les volumes type "volume" sont stocké dans docker et ne dependent pas de la machine hôte.
Ils peuvent être partagés entre plusieurs conteneurs, sont faciles à sauvegarder, restaurer et déplacer.
Ils peuvent être sécurisés avec des options de chiffrement et d'authentification.
C'est le type de volume le plus utilisé.

#### Type Bind Mount

Un volume de type "bind mount" est un moyen pour les conteneurs Docker de ce lier aux fichiers ou aux répertoires l'hôte.
Contrairement aux volumes de type "volume", les volumes de type "bind mount" ne sont pas persistants et ne sont pas gérés par Docker.
Les volumes de type "bind mount" peuvent être utilisés pour monter des fichiers de configuration, des fichiers journaux ou d'autres fichiers qui ne nécessitent pas de persistance.

#### Type TMPFS

Les TMPFS ne sont pas persistés. Ils permettent de stocker les données en mémoire vive.
Nous l'utiliserons principalement pour des données secrètes ou des données d'état qui seraient trop grosses pour être gardées sur le disque.

## Créer son image avec Dockerfile

#### Qu'est-ce qu'un "layer" ?

En Docker, une image est constituée de plusieurs couches (layers) de fichiers en lecture seule qui sont empilées les unes sur les autres pour former l'image finale.
Chaque couche représente un état particulier de l'image et contient un ensemble de modifications apportées à la couche précédente.
A chaques étape de votre build un layer est créer et docker le garde en mémoire.
Ce qui permet lors d'un nouveau build de ne pas répéter les actions déjà faites car elles sont en memoire.
Si à une étape le contenu n'est plus le même docker ne pourra pas utiliser un layer déjà existant et devra en créer de nouveaux pour la suite.

### Les instructions Dockerfile

- FROM : Permet d'indiquer une image parente depuis laquelle vous allez partir pour la création de votre image.
- WORKDIR : Permet de modifier le répertoire de travail en cours.
- RUN : Permet d'exécuter une commande.
- COPY : Permet de copier des fichiers et des dossiers et de les ajouter au système de fichiers de l'image.
- ADD : Permet de copier des fichiers, des dossiers ou des fichiers en utilisant des URL.
- CMD : Permet de definir la commande par défaut qui sera executé lors du lancement d'un container lancés depuis l'image.
- ENTRYPOINT : Permet de configurer un conteneur qui sera lancé comme un exécutable.
- ARG : Permet de définir des variables qui seront utilisables par l'utilisateur depuis sont container.
- ENV : Permet de définir des variables d'environnement.
- LABEL : Permet d'ajouter des métadonnées à une image.

Voici un exemple de Dockerfile permettant de créer une image avec un ecosysteme Symfony :

    # On part d'une image officiel php 8.1.3
    FROM php:8.1.3

    # Nous allons déplacer le php.ini
    RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

    # Installation de Composer
    RUN curl -sS https://getcomposer.org/installer | php -- --filename=composer --install-dir=/usr/local/bin
    # Installation du CLI de symfony
    RUN curl -sS https://get.symfony.com/cli/installer | bash
    # On deplace l'executable symfony dans le dossier user/local/bin pour que la commande soit reconnu
    RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony
    # Met à jour apt
    RUN apt-get update

    # Installation de plusieurs librairies
    RUN apt-get install -y libzip-dev libicu-dev git locales
    RUN docker-php-ext-install zip intl opcache pdo_mysql

    # Creer la locale FR
    RUN locale-gen fr_FR.UTF-8

    # On ce deplace dans le dossier /app
    WORKDIR /app
    # A partir d'ici tout les commandes seront éxécuté dans /app

    # Une fois tout l'environnement prêt on copie le composer.json
    COPY ./composer.json .
    # On l'éxécute
    RUN composer install
    # Puis ensuite on copie le projet dans l'image et plus précisement dans /app
    COPY . .

    # La commande qui sera éxécuté au demarrage d'un container
    CMD ["symfony", "serve"]

## Créer son docker-compose

Docker Compose est l'outil Docker permettant de définir et de lancer des applications multi-containers.
Nous avons simplement à utiliser un fichier de configuration pour définir les services de l'application.
Nous pourrons donc lancer tous les services de l'application en une commande (docker-compose up -d).
Cela nous donne la possibilité d'avoir une application avec un service pour la base de données, un pour l'application serveur,
puis un pour phpMyAdmin ou d'autres services.
Nous allons d'abord sélectionner notre [version de docker](https://docs.docker.com/compose/compose-file/compose-versioning/)
et l'inscrire dans notre docker-compose, le Compose file format.

[//]: # (![docker-v]&#40;/assets\docker-v.png "docker-v"&#41;)
![docker-v]({{ site.baseurl }}/assets/2023-07-25-comprendre-et-personnaliser-ses-docker/docker-v.png)

Dans mon cas, la version 20.10.24 de Docker correspond à la version 3.8 du fichier.

[//]: # (![docker-compose-v]&#40;/assets/docker-compose-v.png "docker-compose-v"&#41;)
![docker-compose-v]({{ site.baseurl }}/assets/2023-07-25-comprendre-et-personnaliser-ses-docker/docker-compose-v.png)


Nous pouvons ensuite commencer la création de nos services.

### Service Database MySql

Notre premier service s'appelle "db" et nous utilisons une image officielle de MySQL 8.0.
Nous allons stocker cette base de données dans un volume afin de la conserver en mémoire quelque part.
Nous l'assignons au port 3306.
Puis nous décidons que la base de données s'appelle "mydb" et qu'elle aura comme mot de passe "root".
N'oubliez pas de déclarer le volume à la fin du docker-compose.

    version: '3.8'
    services:
      db:
        image: mysql:8.0
        volumes:
          - db-volume:/var/lib/mysql
        ports:
          - "3306:3306"
        environment:
          MYSQL_DATABASE: mydb
          MYSQL_ROOT_PASSWORD: root

    ...

    volumes:
      db-volume:

### Service PHP

En ce qui concerne notre application serveur, nous utilisons la commande "build: ." afin de la construire depuis notre Dockerfile courant.
Le service sera disponible sur le port 80.
Et nous utiliserons le bind mount pour transmettre les changements en temps réel entre l'application virtuelle et notre dossier local.

    ...

    client:
      build: .
      ports:
        - "80:8000"
      volumes:
        - .:/app

    ...

### Service PHPMyAdmin

Nous utilisons une image [phpmyadmin](https://hub.docker.com/_/phpmyadmin).
Nous allons mettre ce service sur le port 88.
Ensuite, nous paramétrons les identifiants de connexion dans l'environnement.

    ...

    phpmyadmin:
      image: phpmyadmin
      ports:
        - "88:80"
      environment:
        - PMA_ARBITRARY=1
        - PMA_HOST=db
        - PMA_USER=root
        - PMA_PASSWORD=root

    ...

### En résumé voila a quoi ressezmble notre docker-compose

    version: '3.8'
    services:
      db:
        image: mysql:8.0
        volumes:
          - db-volume:/var/lib/mysql
        ports:
          - "3306:3306"
        environment:
          MYSQL_DATABASE: mydb
          MYSQL_ROOT_PASSWORD: root

    client:
      build: .
      ports:
        - "80:8000"
      volumes:
        - .:/app

    phpmyadmin:
      image: phpmyadmin
      ports:
        - "88:80"
      environment:
        - PMA_ARBITRARY=1
        - PMA_HOST=db
        - PMA_USER=root
        - PMA_PASSWORD=root

    volumes:
      db-volume:

## Personaliser Mes Services

#### Les Variables d'environnement

Il est possible d'utiliser un fichier d'environnement avec Docker (.env).
Nous pouvons y mettre le nom du projet avec la variable ``COMPOSE_PROJECT_NAME=monprojet``.
Ou d'autres variables personnalisées en utilisant la même syntaxe.
Nous pouvons utiliser ces variables depuis le docker-compose avec la syntaxe ``${NOM_DE_MA_VAR}``.
l'ordre de priorité des variables :

1 - Le fichier docker-compose.yml.

2 - Les variables d'environnement de votre shell.

3 - Le fichier des variables d'environnement défini, par exemple .env.dev.

4 - Le fichier Dockerfile (si vous avez défini des valeurs dans des instructions ENV).

#### Les ports

Il est possible de définir un ou plusieurs ports.
Pour ce faire, il suffit d'utiliser "ports".
Le format est toujours HOTE:CONTENEUR puis par défaut TCP. Vous pouvez préciser UDP avec /udp :

    client:
    ...
      ports:
        - "80:8000"
        - "80:9000"

#### Les networks

Il faut savoir que Docker Compose crée un réseau par défaut nommé "nomduprojet_default".
En plus du réseau par défaut, il est possible de définir d'autres réseaux.
Dans ce cas, il faut les déclarer au plus haut niveau comme pour les volumes nommés, puis les utiliser dans les services.

    client:
    ...
      # J'utilise mon réseau mynetwork1
      networks:
        - mynetwork1

    ...
    # Je déclare mes réseaux
    networks:
      mynetwork1:
      mynetwork2:

#### Les Images, context et dockerfile

Nous pouvons utiliser "image" et sélectionner une image déjà prête sur le Docker Hub, comme nous l'avons déjà fait pour notre image phpMyAdmin.
Ou partir de notre Dockerfile en utilisant "build" ou "context".
Nous pouvons utiliser "build" et spécifier où se trouve le Dockerfile, comme nous l'avons fait pour notre service PHP.
Ou entrer plus en détail avec un contexte qui sera le chemin d'accès et un "dockerfile" comme dans l'exemple suivant.

    client:
      build:
        context: ./mesdockerfiles
        dockerfile: MonDockerfile.dev

#### Volume External

Si vous ne souhaitez pas que Docker Compose crée un nouveau volume mais qu'il utilise un volume déjà existant, vous pouvez préciser
``external: true`` dans la configuration, comme dans l'exemple suivant :

    version: '3.8'
    services:
      db:
        image: mysql:8.0
        volumes:
          - db-volume:/var/lib/mysql
        ports:
          - "3306:3306"
        environment:
          MYSQL_DATABASE: mydb
          MYSQL_ROOT_PASSWORD: root

    ...

    volumes:
      db-volume:
        external: true

## Quelques commandes docker-compose

Verifier la version de docker-compose :

    docker-compose version

Build les container :

    docker-compose build

Pour lancer les container :

    docker-compose up
    docker-compose up -d // En mode detach

Stopper les container :

    docker-compose stop
    docker compose down
    docker compose down -v // Supprime les volumes aussi

Pour entrer dans l'application avec le terminal vous pouvez executer :

    docker exec -ti {nom du container} bash

Lister tout les container actif lancés par docker-compose

    docker compose ps

Afficher les reseaux disponible :

    docker network ls

Pour voir les options disponible vous pouvez ajouter --help a la fin de la commande.
Exemples :

    docker-compose up --help
    docker-compose buil --help

## En Conclusion

En somme, Docker Compose est un outil essentiel pour simplifier le déploiement d'applications multi-containers.
Grâce à un simple fichier de configuration, vous pouvez définir tous les services nécessaires à votre application, les orchestrer et les gérer efficacement.
Cela favorise la portabilité, la scalabilité et vous offre une plus grande flexibilité dans la création d'environnements de développement et de production cohérents.
En utilisant Docker Compose, vous pouvez tirer pleinement parti de l'écosystème des conteneurs et simplifier votre workflow de développement.

Avec toutes ces informations vous devriez être capable de comprendre qu'est ce que Docker, comment ca fonctionne, et créer vos images ou environnement de travail sur mesure.
