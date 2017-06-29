---
layout: post
title: Google Cloud Platform (3/3) - Compute Engine, une architecture complete
excerpt: Si vous avez suivi les deux premiers articles sur Google Cloud Platform, vous êtes capable de mettre en production un site rapidement et êtes capable de scaler automatiquement selon le trafic. Mais tout cela n'est possible qu'avec les éléments pré-installés de Google Cloud Platform. Comment créer sa propre configuration ? Réinstaller un serveur facilement ? Scaler automatiquement ?
author: captainjojo
permalink: /fr/google-cloud-platform-compute-engine-architecture-complete/
categories:
- Dev Ops
tags:
- tutoriel
- web
- cloud
---

Si vous avez suivi les deux premiers articles sur Google Cloud Platform, vous êtes capable de mettre en production un site rapidement et êtes capable de scaler automatiquement selon le trafic. Mais tout cela n'est possible qu'avec les éléments pré-installés de Google Cloud Platform. Comment créer sa propre configuration ? Réinstaller un serveur facilement ? Scaler automatiquement ?
Dans ce tutoriel nous allons seulement installer un apache, mais vous pouvez appliquer tout ceci avec n'importe quelle installation.

### Etape 1, créer votre configuration :

Allez dans le menu "Compute Engine", disponible [ici](https://console.cloud.google.com/compute/instances).

![Compute Engine - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.09.20.png)

Puis cliquez sur "Créer une instance", vous allez arriver sur un formulaire qu'il va falloir remplir.

![Créer une instance - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.11.17.png)

- Choisissez un nom
- Puis la zone (il s'agit du lieu du serveur)
- Choisissez le type de machine (c'est ceci qui fait varier le prix)
- Laissez le disque de démarrage par défaut
- Cochez la case "Autoriser le trafic HTTP"

Ouvrez le lien "Gestion, disque, réseau et clés SSH", et dans l'onglet Disque décochez la case "Supprimer le disque de démarrage lorsque l'instance est supprimée".

![Suppression du disque - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.14.42.png)

Cliquez alors sur "Créer".

### Etape 2, installer apache :

Allez dans "Instance de VM" et attendre que la machine soit prête.

![Instance de VM - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.18.22.png)

Cliquez sur SSH pour ouvrir la connexion à la machine.

![Connexion SSH - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.20.12.png)

Une fois connecté, nous allons installer apache. Pour cela il vous suffit de lancer les commandes suivantes :

```sh
sudo apt-get update;
sudo apt-get install apache2;
sudo /etc/init.d/apache2 restart;
```

Une fois terminé, si vous cliquez sur l'IP externe fournie dans l'interface "Instance de VM", vous devriez voir la page apache par défaut.

![Apache - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.25.36.png)

Comme vous pouvez le voir l'installation prend un certain temps, et nous ne voulons pas le refaire pour chaque machine dont nous avons besoin. Nous allons donc nous servir de cette machine comme template pour d'autres machines.

### Etape 3, création d'un template de machine :

Retour dans l'interface "Instance de VM", vous allez supprimer la machine en sélectionnant la VM puis cliquer sur supprimer.

![Supprimer une instance - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.29.17.png)

Allez dans le menu "Images" et cliquez sur "Créer une image".

![Créer une image - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.32.54.png)

Vous devez alors remplir le formulaire de création d'image.

![Formulaire Image - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.33.58.png)

La seule chose qu'il faut surveiller, c'est le choix du disque source qui doit être celui de la machine que l'on vient de détruire.
Une fois l'image créée, allez dans le menu "Modèles d'instances" et cliquez sur "Créer un modèle d'instance".

![Modèle d'instance - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.37.04.png)

Vous arrivez dans un formulaire ressemblant à celui de la création d'instance.

![Modèle d'instance - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.39.26.png)

Dans disque de démarrage, vous devez choisir l'image que vous venez de créer, elle est disponible dans l'onglet "images personnalisées" .

![Image perso - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.41.14.png)

Et n'oubliez pas de cocher la case "Autoriser le trafic HTTP". Puis cliquez sur "Créer".
Pour vérifier que tout est bon, nous allons créer de nouvelles instances via ce template.

### Etape 4, création d'un groupe d'instance:

Allez dans le menu "Groupes d'instances" puis cliquez sur "Créer un groupe d'instances".

![Créer groupe d'instances - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.47.54.png)

Vous avez l'habitude, nous arrivons sur un formulaire assez long.

![Formulaire 1 - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.49.30.png)

![Formulaire 2 - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.49.43.png)

- Choisissez un nom pour votre groupe
- Puis l'emplacement (le mieux c'est multizone qui permet d'avoir des serveurs dans le monde entier)
- Prenez ensuite le "modèle d'instance" que vous venez de créer
- Activez l'évolution dynamique
- Mettez le minimum d'instances à 3

Vous pouvez alors créer le groupe.
Si vous retournez dans le menu "Instances de VM" vous pourrez voir les trois machines en cours de création. Une fois terminé, cliquez sur l"IP externe" de chaque machine. Normalement la page d'apache par défaut s'affiche.

![groupe d'instance - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-18.56.59.png)

À partir de maintenant, nous avons un groupe d'instances qui va scaler selon le trafic. Seulement, le trafic arrive sur les trois Ips, il nous faut donc un "load balancer" devant les machines pour envoyer le trafic sur le groupe d'instances.

### Etape 5, le load balancer :

Changez de menu et allez dans "réseau".

![Réseau - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.02.40.png)

Puis allez dans "Équilibrage des charges", et créez un équilibreur.

![Load Balancer - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.05.27.png)

Choisissez un équilibrage des charges HTTP(S).
Vous pouvez alors configurer l'équilibreur.

![Configuration équilibreur - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.07.08.png)

Choisissez un nom.
Puis cliquez sur "Configuration des backends", et créez un service backend.
Vous arrivez sur le formulaire suivant :

![Backend - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.10.37.png)

![Formulaire - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.10.42.png)

- Choisissez un nom
- Puis l'instance backend (c'est le groupe créé juste avant)

Ajoutez un test périodique.

![Test périodique - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.11.07.png)

- Choisissez un nom
- Puis le protocole http
- Laissez le reste

Il ne nous reste plus qu'a cliquer sur "Règles d'hôte et de chemin d'accès", qui passera directement en vert. La même chose pour "Configuration du frontend" qui passe en vert automatique.
Vous n'avez plus qu'à créer, cela va prendre pas mal de temps (environs 5 min).
Vous pourrez trouver l'IP d'entrée du load balancer dans le menu "Équilibrage des charges", puis sur le load balancer fraîchement configuré vous aurez l'ip disponible.

![Load balancer - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.17.18.png)

Toujours dans cette interface, dans l'onglet surveillance vous pouvez suivre les backends qui reçoivent les requêtes.

![Surveillance Backend - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.20.22.png)

Et voila vous avez une architecture scalable automatiquement avec un load balancer comme un vrai architecte réseau.

### Etape 6, on supprime les machines :

Avant de vous quitter, nous allons supprimer les machines.  Vous devez le faire dans l'ordre suivant car sinon les machines se relanceront automatiquement.

- Supprimez le load balancer
- Puis dans le menu avancé de l'équilibrage des charges supprimez le service backend
- Retourner dans le menu "compute engine", puis "groupe d'instances"
- Supprimez votre groupe d'instance

Si vous allez dans le dashboard vous devez ne plus voir de machine "compute engine"


![Dashboard - Google Cloud Platform](/assets/2016-12-12-google-cloud-platform-compute-engine-architecture-complete/Capture-d’écran-2016-11-30-à-19.28.32.png)
