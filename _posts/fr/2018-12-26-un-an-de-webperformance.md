---
layout: post
title: "Un an de webperformance dans un média français"
excerpt: "Depuis un an je travaille en tant qu'expert webperformance chez France Media Monde dans le cadre de la refonte de l'ensemble des fronts des différentes sites web du groupe. Nous allons revenir sur cette mission d'un an, pour nous permettre de comprendre comment réaliser ce genre de mission."
authors:
    - captainjojo
lang: fr
permalink: /fr/un-an-de-webperformance/
categories:
    - webperformance
cover: /assets/2018-12-26-un-an-de-webperformance/cover.jpg
---

Depuis un an je travaille en tant qu'expert webperformance chez France Media Monde dans le cadre de la refonte de l'ensemble des fronts des différentes sites web du groupe.

Nous allons revenir sur cette mission d'un an, pour nous permettre de comprendre comment réaliser ce genre de mission.

## Brief

France Media Monde c'est trois gros sites public [MCD](https://www.mc-doualiya.com/), [RFI](http://www.rfi.fr/) et [France24](https://www.france24.com/fr/).

Les sites sont principalement utilisés en version mobile sur des réseaux 3g voir edge.

Aujourd'hui l'ensemble des sites médias sont en concurrence sur l'info dit `chaude`, c'est à dire l'info en direct. En effet, tout le monde veut récupérer les utilisateurs lors d'une nouvelle info, pour cela il faut être l'un des premiers a remonté sur Google. On sait aujourd'hui que le calcul de la position dans la recherche Google prend en compte la performance du site en version mobile avec peu de réseau. Le but est donc d'être meilleurs que les autres sites pour être le premier à apparaitre.

Il n'y a pas que pour l'actu chaude que la performance du site est importante. On le sait aujourd'hui il existe clairement un impact fort entre le trafic du site et la web performance. Je vous invite à lire [https://www.thinkwithgoogle.com/marketing-resources/data-measurement/mobile-page-speed-new-industry-benchmarks/](https://www.thinkwithgoogle.com/marketing-resources/data-measurement/mobile-page-speed-new-industry-benchmarks/) provenant d'une source plutôt fiable puisqu'il s'agit de Google.

![thinkwithgoogle]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image1.jpg)

Voici trois points qui vous donnerons envie de faire de la webperformance.

- Votre taux de pages vues par visite augmente
    - +1 seconde de temps de chargement = – 11% de pages vues.
- Vous diminuez votre taux de rebond
    - -7% sur le taux de rebond grâce à un site rapide
- Vous sauvez la vie des ours polaires
    - And last but not least : moins de requêtes = moins d’énergie. En un sens, vous agissez pour l’environnement !

Source: [https://www.fasterize.com/fr/blog/15-raisons-de-penser-webperf/](https://www.fasterize.com/fr/blog/15-raisons-de-penser-webperf/
)

Dans le cadre de la refonte de l'ensemble des sites, France Média Monde voulais donc suivre les indicateurs de performance pour leurs permettre de devenir les numéros 1 sur le mobile.

## Choisir les metriques

Le choix des métriques sont très importantes pour le suivi de la webperformance. Il existe de nombreuses métriques qui permettent de savoir si votre site est performant.

Prenons quelques exemples de métrique importante:

- *Page Load* : le temps que met la page à se charger
- *Fully Loaded* : le temps que met la page pour ne plus avoir d’activités réseaux (2 secondes sans activité)
- *First Byte* : le temps que met le premier Byte à être récupéré par le navigateur
- *Speed Index* : métrique calculée qui permet de connaitre la perception de l’affichage pour l’utilisateur (elle utilise plusieurs métriques)

Bien sûr il n'est pas possible de suivre l'ensemble des métriques et cela n'aurait pas de sens. Souvent réduire une métrique aura un impact négatif sur une autre et inversement. Nous avons donc besoin de choisir nos KPI dès le début du projet et de ne plus changer.

Dans le cadre de la mission nous avons choisi cinq KPIs à suivre. L'une des plus importantes est le visuel d'une page seconde par seconde (filmstrips), cela permettant d'apprécier ce que voit l'utilisateur. Comme la webperformance n'a pas de valeur absolu, il est préférable de faire un benchmark avec vos concurrents. C'est certainement ce qui est le plus important, car Google compare les résultats entre les sites.

![filmstrips]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image2.png)

Maintenant que nous savons quelles sont les métriques à suivre nous pouvons choisir le ou les outils pour les suivre.

## Suivre les metriques

Les métriques doivent être dans plusieurs étapes du développement. Tout d'abord, nous devons pouvoir suivre les métriques durant le développement, ainsi que dans une CI.

Il nous faut donc un outil le permettant.

Nous avons choisi [Sitespeed.io](https://www.sitespeed.io/) qui est une suite d'outillage sur Docker que vous pouvez insérer dans votre CI ou installer sur vos postes.

Sitespeed utilise les résultats de [WebPageTest](https://www.sitespeed.io/documentation/sitespeed.io/webpagetest/) et les pose dans un [ELK](https://www.elastic.co/fr/elk-stack). Cela nous permet de mettre en place des boards personalisés permettant de voir en un instant nos KPI.

Les équipes de développement peuvent aussi utiliser la console Chrome qui contient de nombreux outils permettant de suivre la webperformance.

Comme par exemple:

- **audit** permettant de faire un rapport de webperformance

![audit]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image3.png)

- **network** permettant de voir les bottleneck du réseau
- **coverage** permettant de connaitre le taux d'utilisation du javascript et du css

![coverage]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image4.png)

## Travailler avec les equipes

UUne fois l'ensemble des métriques et des outils choisis, il faut travailler avec les équipes sur les sujets de fond.

Nous avons choisi avec France Media Monde de faire cela en plusieurs étapes.

Comme la refonte utilisera Vue.js nous avons tout d'abord travaillé sur l'architecture et la performance de l'application javascript. Dès le début du projet, nous avons donc travaillé avec les équipes pour mettre en place la meilleure architecture possible.

Depuis, tout le long du projet je passe du temps avec les équipes pour donner des recommendations, selon l'avancement des développements. En effet, le principe de la webperformance c'est de faire étape par étape, il faut que chaque développements suives les récommandations webperf et que l'ajout de nouvelles fonctionnalités ne cassent pas celle-ci.

En un an, nous avons mis en place de nombreuses choses permettant d'améliorer la webperformance. Je vais vous donner quelques tips pour vos sites.

## Les tips

- Le passage en **HTTPS/HTTP2** est un moyen simple d'améliorer la performance de votre site. Le coût de vos requêtes HTTP sera amélioré
- **Comprésser** vos réponses HTML en Gzip pour vous permettre de gagner sur le download surtout en 3G
- **Minimize** les CSS et JS toujours dans un souci de gain de place dans vos requêtes HTTP
- Utiliser les **defer** pour ne plus bloquer l'affichage de la page
- Mettre en place des **preconnect**, **preload** et **prefetch** pour que votre navigateur se connecte aux ressources externes plus rapidement
- Etc...

Ce qui est important c'est de suivre les nouveautés en lien avec la webperformance. Google met très souvent du contenu en ligne pour expliquer les nouveaux outils mise en place pour nous permettre de rendre nos applications toujours plus performante.

Voici un exemple fait à la google I/O 2018

<iframe width="560" height="315" src="https://www.youtube.com/embed/Mv-l3-tJgGk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Bilan

Après un an de mission et grâce au travail des équipes MCD et France24 sont maintenant en ligne et sont d'après nos métriques numéro un. Comme un long discours ne sert à rien voici le résultat après la mise en production.

![bilan]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image5.png)

![bilan]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image6.png)

![bilan]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image7.png)

![bilan]({{site.baseurl}}/assets/2018-12-26-un-an-de-webperformance/image8.png)


Si vous aussi vous souhaitez améliorer votre webperformance rensignez vous [ici](https://eleven-labs.com/accompagnement-sur-mesure/audit-et-expertise)







