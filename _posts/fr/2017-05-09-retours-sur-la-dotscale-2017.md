---
layout: post
title: "Retours sur la dotScale 2017"
lang: fr
permalink: /fr/retours-sur-la-dotscale-2017/
authors: 
    - vcomposieux
date: '2017-05-09 12:00:00 +0100'
date_gmt: '2017-05-09 12:00:00 +0100'
categories:
    - Dev Ops
tags:
    - conferences
    - devops
    - dot
    - dotccale
    - scalability
---
Nous avons assisté à la 5ème édition de la dotScale (2017) qui se tenait cette année à Paris. Cette édition se déroulait dans le Théâtre de Paris et nous tenons à saluer les partenaires et volontaires pour l’organisation de cette conférence qui s’est très bien déroulée.

# Introduction

Beaucoup de monde dans ce théâtre et beaucoup de stands sponsors/partenaires variés entre outils de monitoring, Google Cloud Platform, outils publicitaires ou de réservation en ligne.

Côté conférences, beaucoup de contenu autour du scaling d'applications, de bases de données, mais aussi certaines très intéressantes sur des sujets annexes comme la gestion de crise en production sur de grosses infrastructures.

Si vous n’avez pas pu y participer, pas de panique, nous vous avons préparé un retour sur les talks ayant eu lieu lors de cette édition :

## Benjamin Hindman - Co-créateur d'Apache Mesos et Co-fondateur de Mesosphere

Benjamin nous décrit dans ce talk le fonctionnement d'Apache Mesos et de ce que sa société Mesosphere peut mettre en place.

Il faut avant tout connaitre l'utilité d'Apache Mesos : il s'agit d'un outil permettant de gérer les ressources d'un datacenter (en tout cas plusieurs machines) afin de permettre l'exécution d'applications sur un système distribué.

Ainsi, Apache Mesos gère les ressources dont vos applications ont besoin telles que le CPU, la RAM, les IO pour stockage de données, etc ...

Mesosphere vient ensuite avec la couche OS s'appuyant sur Apache Mesos permettant de gérer au mieux vos applications et vos ressources.

## Neha Narkhede  - Co-créatrice d'Apache Kafka et CTO de Confluent

Neha dans ce talk nous a présenté pourquoi et comment passer d'un système d'information en "spaghetti" (avec des échanges de flux entre toutes les applications, bases de données et autres) en un système d'information centralisé grâce à Apache Kafka.

Apache Kafka va en effet permettre de centraliser tous les événements déclenchés par vos applications et de permettre aux applications ou encore bases de données ou outils variés de réagir au déclenchement de ceux-ci. Les échanges de votre SI seront ainsi beaucoup mieux organisés et surtout il vous sera plus simple de les suivre.

L'exemple devient beaucoup plus parlant lorsque Neha s'appuie sur le cas de LinkedIN qui échange plus de 1 400 000 000 000 d'événements par jour.

De plus, l'usage d'Apache Kafka devient de plus en plus simple grâce à son API d'interconnexion qui dispose aujourd'hui d'un grand nombre de connecteurs tels que Cassandra, Oracle, ElasticSearch, Mysql, MongoDB, Hadoop, ...

*Les slides sont à disposition ici* : [https://speakerdeck.com/nehanarkhede/the-rise-of-real-time](https://speakerdeck.com/nehanarkhede/the-rise-of-real-time){:target="_blank" rel="nofollow noopener noreferrer"}

## Adrian Cole - Lead de Zipkin

Ce talk d'Adrian portait sur les 3 éléments clés permettant de surveiller vos applications :

* Logger : le fait d'enregistrer les événements de vos applications,
* Ajouter des métriques : le fait de combiner des données afin d'obtenir une tendance,
* Tracer : pour identifier les causes entre les services interagissant avec votre application.

Pour l'action de logger, il convient de bien structurer le format de vos logs afin de vous permettre de les exploiter au mieux.

Les métriques, quant à elles, sont simplement un nombre indicateur apparaissant à un moment donné. Il est donc important d'avoir l'association de temps avec cette donnée.

Enfin, il vous faudra passer un identifiant unique de requête entre toutes vos dispositions afin de tracer les échanges entre vos applications.

*Les slides sont à disposition ici* : [https://speakerdeck.com/adriancole/observability-3-ways-logging-metrics-and-tracing](https://speakerdeck.com/adriancole/observability-3-ways-logging-metrics-and-tracing){:target="_blank" rel="nofollow noopener noreferrer"}

## Ulf Adams - Lead de Bazel

Bazel est le système de build utilisé par Google sur une petite partie de ses applications pour répondre à une problématique de temps de builds importants, sur certaines applications dont le code source était un unique repository monolithique.

Ulf et son équipe planchent alors sur ce problème de temps de build exponentiel en travaillant en étroite collaboration avec les équipes de développement avec cet outil de build et d'exécution de tests nommé Bazel.

Parfois même, il est nécessaire d'ajouter des portions de code spécifique permettant d'améliorer les temps de build.

Le mot de la fin de ce talk était d'essayer de sortir le plus possible les librairies qui peuvent être indépendantes dans votre application afin de ne pas avoir à maintenir une base de code énorme.

## Aish Raj Dahal - Ingénieur chez PagerDuty

Ce talk n'est pas évident à retranscrire par écrit car il faut vraiment entendre l'histoire de Aish par soi-même afin de comprendre ce qu'il veut dire.

En effet, ce talk traitait de la gestion de crise lors d'un incident majeur en production : garder son sang froid et considérer les éléments suivants :

* Quelles sont les actions à prendre en compte ?
* Comment diviser les tâches dans l'équipe disponible à ce moment là ? Qui fait quoi ?
* Comment notifier en interne et communiquer au(x) client(s) ?
* Comment s'y préparer ? et surtout : apprendre de ses erreurs.

Je vous encourage à regarder la vidéo du talk lorsqu'elle sera disponible sur le site des dotConferences car l'orateur était vraiment prenant !

*Les slides sont à disposition ici* : [https://speakerdeck.com/aishraj/chaos-management-during-a-major-incident](https://speakerdeck.com/aishraj/chaos-management-during-a-major-incident){:target="_blank" rel="nofollow noopener noreferrer"}

## Mitchell Hashimoto - Fondateur Hashicorp

Dans ce talk, Mitchell a mis l’accent sur l’aspect central du produit de la suite Hashicorp : Vault ([https://www.vaultproject.io](https://www.vaultproject.io)){:target="_blank" rel="nofollow noopener noreferrer"}.

En effet, dans l’organisation DevOps, ce produit permet de stocker des données de manière sécurisée pour toutes les équipes projet : il permet aussi bien de stocker des clés d’API (qui seront utiles aux développeurs) que des données de configuration réseau (qui dans ce cas sera utile pour les Ops).

Il met à disposition plusieurs méthodes pour authentifier les accès aux ressources stockées dans Vault comme par exemple le Multi-Factor App ou encore via certificats TLS.

Le stockage des données (encryptées bien sûr) peut ensuite être effectué sur le back-end de votre choix (MongoDB, PostgreSQL, AWS, Consul, ...).

L’objectif principal de ce produit est de donner les moyens aux personnes de sécuriser leurs applications et infrastructures.

*Les slides sont à disposition ici* : [https://speakerdeck.com/mitchellh/scaling-security](https://speakerdeck.com/mitchellh/scaling-security){:target="_blank" rel="nofollow noopener noreferrer"}

Petit fait marquant pour l’occasion : Mitchell a profité de sa visite à Paris pour demander sa femme en mariage ([https://twitter.com/mitchellh/status/856202103194353664](https://twitter.com/mitchellh/status/856202103194353664)){:target="_blank" rel="nofollow noopener noreferrer"}, tous nos vœux de bonheur !

## James Cammarata - Mainteneur principal d’Ansible

James a commencé très fort son talk en pointant du doigt les erreurs d’ingénieurs qui ont eu pour effet de causer un début de black-out sur Internet ces dernières années.

Comme exemple récent, nous retiendrons la coupure d’une région AWS S3 aux Etats-Unis récemment ([https://aws.amazon.com/fr/message/41926/](https://aws.amazon.com/fr/message/41926/)){:target="_blank" rel="nofollow noopener noreferrer"} dont l’erreur était clairement humaine. Un employé était en effet en train de débugger sur le système de paiement d’AWS et a voulu couper un serveur afin d’effectuer un test. Malheureusement, il y a eu un “effet domino” qui a causé l’arrêt de tous les serveurs AWS S3 de toute une région.

Le talk s’est ensuite recentré sur Ansible et les moyens que nous avons à notre disposition afin d’éviter ce genre de problème.

Par exemple, n’écrivez jamais ce genre de ligne :

```
- name: Removes backup directory.
  shell: rm -rf /{{ backup_directory }}
```

Dans ce cas, si la variable "backup_directory" n’est pas définie, les données de votre disque seront effacées. Préférez l’utilisation du module “file” d’Ansible qui s’occupera, lui, de faire la vérification que la commande est cohérente.

D’autres cas d’erreurs sont également possibles et ce sont souvent les variables qui en sont la cause. James invite donc à toujours préfixer les variables utilisées dans le code Ansible.

Autre détail annexe mais “fun” de ce talk : James a développé un module Ansible permettant d’interagir avec l’API Phillips Hue. Si cela vous intéresse, il est disponible à cette URL : [https://github.com/jimi-c/hue](https://github.com/jimi-c/hue){:target="_blank" rel="nofollow noopener noreferrer"}

Enfin, un point important évoqué lors de l’interview qui a suivie : Ansible Tower ([https://www.ansible.com/tower](https://www.ansible.com/tower)){:target="_blank" rel="nofollow noopener noreferrer"} devrait par la suite être disponible en open-source.

## David Mazières - Chief Scientist chez Stellar et Professeur à l’université de Stanford

Un talk très intéressant mais pas forcément évident à suivre pour tout le monde !

En effet, l’objectif de ce talk était de nous faire prendre conscience du protocole Consensus ([https://fr.wikipedia.org/wiki/Consensus_(informatique)](https://fr.wikipedia.org/wiki/Consensus_(informatique))){:target="_blank" rel="nofollow noopener noreferrer"} et donc d’un monde où tout le monde peut avoir le moyen de vérifier une information.

Le premier exemple dont a parlé David, et qui semble évident, sont les autorités de certification. Aujourd’hui, lorsqu’elles délivrent un certificat, elles sont les seules habilitées à contrôler l’authenticité de celui-ci.

Mais qu’adviendrait-il si elles étaient corrompues ? Si Apple fournissait des certificats à la NSA par exemple …

Le protocole, largement utilisé par David -dans la société Stellar pour laquelle il travaille- et particulièrement la façon dont il est appliqué a été expliqué en détail dans ce talk.

Plusieurs autorités sont ainsi capables d’authentifier une information.

## Marco Slot - Ingénieur logiciel chez Citus Data

Fort de son expérience chez Citus Data, Marco Slot nous fait part de la difficulté de scaler une base de données SQL, pourtant souvent centrale dans une application. Mais il nous rappelle aussi que difficile n’est pas impossible...

Grâce au système ouvert de PostgreSQL et particulièrement à la mise à disposition d’API permettant de créer des extensions pouvant se brancher à plusieurs niveaux dans l’exécuteur SQL, Marco nous laisse comprendre qu’il est ainsi possible de créer une extension permettant de mettre en place du “sharding” en vue de récupérer des données (par exemple) à partir de plusieurs noeuds PostgreSQL lorsqu’une requête est effectuée.

La conclusion de ce talk est sans appel : PostgreSQL, grâce à son système d’extension, ne se cantonne plus à la fonction de simple base de données, mais devient ainsi une plateforme SQL extensible, et surtout scalable.

*Les slides sont à disposition ici* : [https://speakerdeck.com/marcocitus/scaling-out-postgre-sql](https://speakerdeck.com/marcocitus/scaling-out-postgre-sql){:target="_blank" rel="nofollow noopener noreferrer"}

## Andrew Shafer - Directeur de technologie chez Pivotal
Ce talk est presque de nature philosophique. Pour autant, les propos avancés sont assez denses.

Cette présentation sur le DevOps en général et les termes à la mode comme les “micro-services” nous démontraient qu’il n’est pas possible de pratiquer correctement ces méthodologies sans changer d’organisation et de méthodes de travail.

En effet, voici une liste de quelques termes définissant ce que les gens souhaitent lorsqu’ils parlent de DevOps, selon Andrew : évolutivité, disponibilité, fiabilité, opérabilité, facilité d’utilisation, le tout gratuitement, et sans rien changer.

Vous en conviendrez, les deux derniers termes sont bien sûr très compliqués à obtenir, et surtout, il ne sont pas possible sans toucher aux deux parties essentielles : le logiciel et l’humain. Les deux vont de paire pour réussir à adopter ces concepts.

Il définit alors la méthodologie “Calms” pour arriver à pratiquer correctement ces concepts: “Culture, Automation, Lean, Metrics, Sharing”.

*Les slides sont à disposition ici* : [https://www.slideshare.net/littleidea/the-end-of-the-beginning-devopsdays-denver-2017](https://www.slideshare.net/littleidea/the-end-of-the-beginning-devopsdays-denver-2017){:target="_blank" rel="nofollow noopener noreferrer"}

## Clay Smith - Technologue chez New Relic

Clay s’est amusé dans ce talk a rechercher le serveur dans le “serverless”.

En effet, il s’est basé sur les Lambdas d’AWS afin de déterminer de quelles façons elles étaient exécutées.

Ses trouvailles sont assez intéressantes : en exécutant un bout de code NodeJS, il a ainsi pu obtenir l’utilisateur courant sur le serveur et même plus : des informations provenant de `/proc`.

Nous pouvons donc savoir que les serveurs sur lesquels tournent nos Lambdas (serverless) ont en fait les caractéristiques suivantes (équivalent à peu près à un serveur EC2 de type c4.large) :

* Processeur : 2x Intel(R) Xeon(R) CPU E5-2666 v3 @ 2.90 Ghz
* Mémoire vive : 3857664 KB (soit environ 4 GO de ram)
* Interface réseau : 10 Gbps

Chaque Amazon Lambda pouvant prendre de 128 MO à 1,5 GO de mémoire vive (et un temps d’exécution maximum de 5 minutes), cela vous laisse imaginer le nombre de machines nécessaires pour faire tourner vos lambdas.

Clay montre également que le temps d’exécution varie entre la première lambda et les autres appelées en callback (lorsqu’elles sont déjà initialisées). Il y a donc un laps de temps alloué à l’instanciation des lambdas.

Il conclut ensuite sur le fait qu'idéalement les lambdas sont à utiliser lorsque vous avez des traitements importants à effectuer, de façon occasionnelle en réponse à un événement bien défini qui n’est pas sensible à un temps de latence.

*Les slides sont disponibles ici* : [https://speakerdeck.com/smithclay/searching-for-the-server-in-serverless](https://speakerdeck.com/smithclay/searching-for-the-server-in-serverless){:target="_blank" rel="nofollow noopener noreferrer"}

À lire également, l'article sur comment Clay a pu monter un serveur SSH sur une lambda : [https://medium.com/clog/ssh-ing-into-your-aws-lambda-functions-c940cebf7646](https://medium.com/clog/ssh-ing-into-your-aws-lambda-functions-c940cebf7646){:target="_blank" rel="nofollow noopener noreferrer"}

# Conclusion

Nous avons passé une très bonne journée, intense en informations. Les conférences très techniques n'étaient pas forcément évidentes à suivre mais étaient pour autant très intéressantes, et si elles n'arrivent pas toujours à convaincre, elles ont au moins le mérite de faire réfléchir.

À l'année prochaine !
