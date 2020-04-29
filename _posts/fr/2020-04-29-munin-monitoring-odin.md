---
layout: post
title: "Munin, le monitoring des dieux"
lang: fr
permalink: /fr/munin-monitoring-oding/
excerpt: "Certains connaissent Munin, le corbeau de la mythologie nordique. C'est en l'occurrence un lointain cousin que vous allez découvrir dans cet article : L'outil de monitoring Munin."
authors:
    - jbernard
categories:
    - monitoring
tags:
    - serveur
    - master
    - nodes
    - munin
    - opensource

---

Pour les amateurs de mythologie nordique, Munin et Hunin sont les deux corbeaux d’Odin. Ils surveillent les moindres recoins de Midgard et rapportent ensuite à leur maître. L’application qui nous intéresse aujourd’hui porte donc bien son nom car elle permet le monitoring et le reporting des constantes de vos différents serveurs, et est baptisée Munin.
Après une rapide présentation, nous nous attarderons sur le processus d'installation de cette dernière et sur son utilisation.


## 1. Présentation

Munin est une application self-hosted open-source (code sur GitHub) créée en 2002 et encore activement maintenue à ce jour. Elle propose une foule de plugins permettant de monitorer de nombreux éléments vitaux des vos machines comme l’usage des CPU ou de la RAM, le load-average ou encore le taux d’utilisation des interfaces réseaux. Le tout est affiché via une interface web sobre et efficace.

Le soft sauvegarde ces informations sur la durée et permet une visualisation sur une longue période de l’évolution des différentes métriques.

Enfin, il a la particularité de gérer autant de machine que vous le souhaitez grâce à un système de Master/Nodes simples et faciles à configurer.

## 2. Pré-requis

- Avoir un utilisateur sudo sur chaque machine que vous souhaitez configurer
- Identifier la machine destinée à disposer du Master (en l'occurrence là où sera exposée l’interface web)

## 3. Installation et configuration du Master

### Installation
Passons directement à l’installation de Munin sur le serveur Master à proprement parler :

```
sudo apt-get update
sudo apt-get install munin
```

### Configuration
Une fois cette installation terminée, nous pouvons passer à la configuration.
La configuration de Munin se trouve dans le fichier `munin.conf` localisé dans le dossier `/etc/munin`. Avec votre éditeur de texte préféré, ouvrez ce fichier de configuration pour pouvoir visualiser les premières options qui nous intéressent :

```
dbdir     /var/lib/munin
htmldir   /var/www/munin
logdir    /var/log/munin
rundir    /var/run/munin
```

La ligne qui nous intéresse ici est le `htmldir`. C’est dans ce dossier que seront stockées les pages et images statiques de l’interface web. N’hésitez pas à configurer ce chemin selon vos besoin, en fonction de l’installation de votre serveur web (Nginx, Apache, …)
La seconde partie de la configuration qui nous intéresse se situe plus bas, dans ce même fichier :
```
[localhost.localdomain]
    address 127.0.0.1
    use_node_name yes
```

Il s’agit ici de l’endroit où nous allons référencer le master et les différents nodes afin de les monitorer. Par exemple, j’ai choisi de renommer mon master comme suit :

```
[ElevenMaster]
    address 127.0.0.1
    use_node_name yes
```

Le nom que j’ai choisi, `ElevenMaster`, sera donc affiché sur l’interface web pour décrire ma machine, en l'occurrence le Master de notre infrastructure Munin.
Il ne reste plus qu'à sauvegarder et fermer le fichier de configuration puis relancer le service Munin pour prendre en compte ces nouvelles configurations :

```
sudo service munin-node restart
```

Les fichiers statiques de l’interface web devraient maintenant être disponibles dans le dossier indiqué précédemment dans la configuration (ligne `htmldir`) :

![]({{ site.baseurl }}/assets/2020-04-29-munin-monitoring-odin/eleven-master.png)

Le monitoring de votre machine “Master” est donc bien en place. Voyons maintenant la suite.

## 4. Installation et configuration d’un Node

### Installation

Le monitoring de votre machine “Master” est donc maintenant en place.
L'intérêt majeur de Munin réside dans sa capacité à gérer pour vous une multitude de machine sans effort. Sur une seconde machine, il suffit donc d’installer le package `munin-node` puis de procéder à deux petites configurations : l’une du côté du Node, l’autre du côté du Master.

L’installation du package tout d’abord :

```
sudo apt-get update
sudo apt-get install munin-node
```


### Configuration

Il vous faut ensuite configurer le munin-node pour autoriser le Master à récupérer les données requises. Cela se passe dans le fichier de configuration `/etc/munin/munin-node.conf`, au niveau de la ligne autorisant le localhost :
```
allow ^127.0.0.1$
```

Il faut remplacer cette IP locale par l’ip publique du serveur Master, au format RegExp. Ce qui donnerait par exemple :

```
allow ^145\.78\.309\.444$
```

Relancez maintenant le service Munin-node pour prendre en compte cette configuration :

```
sudo service munin-node restart
```

De retour sur le Master pour la dernière étape, il nous faut ajouter le Node dans la liste des machine monitorée. Dans le fichier de configuration du Master (`/etc/munin/munin.conf`), ajoutez le Node à la suite de la déclaration du Master faite précédemment. Il vous faudra y indiquer un nom représentant le Node ainsi que l’adresse IP de ce dernier. En reprenant notre exemple de tout à l’heure :

```
[ElevenMaster]
    address 127.0.0.1
    use_node_name yes
[ElevenNode]
    address 267.117.81.341
    use_node_name yes
```

Sauvegardez, fermez le fichier de configuration et une fois de plus relancez le service Munin pour prendre en compte ce nouveau Node :

```
sudo service munin-node restart
```

Au bout de quelques minutes, le temps que Munin récupère les informations du Node fraîchement ajouté, vous devriez voir apparaître votre seconde machine dans l’interface web :

![]({{ site.baseurl }}/assets/2020-04-29-munin-monitoring-odin/eleven-node.png)

Votre instance de Munin est maintenant en place. Vous pouvez à tout moment configurer des outils de monitoring spécifiques (apache, mysql, nginx, etc) grace aux [plugins issus de la communauté](http://gallery.munin-monitoring.org/), il y a beaucoup de choses très utiles.
