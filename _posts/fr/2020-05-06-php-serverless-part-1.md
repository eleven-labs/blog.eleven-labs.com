---
layout: post
title: "PHP & Serverless avec Bref - part 1"
lang: fr
permalink: /fr/php-serverless-part-1/
excerpt: "Qu'est-ce qu'une architecture Serverless, et quelles sont les options pour y déployer des applications PHP ?"
authors:
    - marishka
categories:
    - php
tags:
    - php
    - serverless
    - aws
    - bref
    - lambda

---

Voilà maintenant des années que l'on parle des architectures *Serverless*. Mais qu'est-ce que cela veut dire précisément ? Et comment développer des applications PHP que l'on peut déployer sur cette architecture ?

## Définition et introduction au *serverless*

L’architecture Serverless est un modèle dans lequel le fournisseur de services Cloud (bien qu'il est possible d'héberger sa propre infrastructure Serverless, nous y reviendrons) est responsable de l’exécution d’un morceau de code en allouant les ressources de manière dynamique.

Le code est généralement exécuté dans des conteneurs Stateless et peut être déclenché par divers événements (requête HTTP, crons, téléchargement d'un document, etc.). Il se présente généralement sous la forme d’une fonction, ainsi Serverless est parfois appelé *“Functions as a Service”* ou *“FaaS”*.

### Cas d'utilisation

L'architecture Serverless peut s'avérer utile dans plusieurs cas :

- si vous avez des *web hooks* - c'est un exemple classique où l'on n'a pas besoin d'un serveur qui tourne à temps plein
- pour des *traitements multimedia* (génération de factures, téléchargements de fichiers, traitements d'images et de vidéos, etc.)
- si vous avez un *trafic variable* - si personne n'utilise votre plateforme à un instant donné, vous ne souhaitez sûrement pas être facturés pour rien, et à l'inverse, s'il y a un pic de trafic vous voulez que votre infrastructure s'adapte automatiquement
- pour des *tâches planifiées* - les containers démarrent le temps d'exécuter le cron et s’éteignent ensuite
- *IoT*- pour des alertes de surveillance par exemple, dans un système de sécurité
- dans le  cas d'*event streaming* - si votre application communique avec la bourse par exemple

### Avantages

Le premier avantage que l'on peut constater est qu'il n'y a **aucune gestion d'infrastructure** et de ressources à réaliser. Vous n'avez pas besoin de faire le provisionning et les upgrades des serveurs car c'est le fournisseur Cloud qui s'en occupe.

Ensuite, vous ne payez que les ressources que vous utilisez. On appelle ça **Pay as you go**. C'est à dire que vous ne payez les ressources que lorsqu'elles sont en train d'être utilisées. Les containers s’éteignent si aucune fonction n'est appelée pendant un temps donné, vous permettant de faire des économies.

Un autre avantage est la **scalabilité** de votre plateforme. L'infrastructure s'adapte automatiquement en fonction de la charge.

Il est également simple de faire des **déploiements** de nouvelles versions de vos applications, ce qui peut contribuer à accélérer les cycles de release.

De plus, cela permet à l'équipe de **se concentrer sur le développement** de l'application et investir leur énergie et ressources dans le bon fonctionnement de celle-ci.

Enfin, ne pas avoir de containers qui tournent sans qu'il y en ait besoin permet d'économiser de l'énergie et c'est mieux pour la planète !

### Contraintes et limitations

Un des gros inconvénients que l'on peut constater est le **cold start**, c'est à dire le temps que mettent les containers à démarrer s'ils étaient éteints lors de l'appel d'une fonction. Actuellement, il varie entre quelques centaines de millisecondes et une seconde. Bien que cela dépende du langage de votre application et de la taille de vos fonctions.

Une autre contrainte est la **durée d'exécution maximale** d'une fonction. Elle varie en fonction des fournisseurs Cloud (9 min chez Google function, 15 minutes chez AWS Lambda). Il faut donc en tenir compte dans les différents traitements de votre application.

Il existe aussi des **limitations** liées à la mémoire, la taille maximum des packages que vous déployez et à l'espace disque disponible. Ci-dessous un extrait des limitations d'AWS Lambda pour vous donner une idée.

![]({{ site.baseurl }}/assets/2020-05-06-php-serverless-part-1/aws-limitations.png)

Un autre point à garder en tête est que le **prix** de notre infrastructure peut être **imprévisible**. Etant donné que le fournisseur Cloud s'occupe de tout, nous n'avons aucun contrôle sur la façon dont il gère les ressources. En cas d’événement imprévu qui solliciterait beaucoup nos fonctions serverless, le prix pourrait alors grimper. Rassurez-vous, il est néanmoins possible de créer des alertes et d'être notifié par votre fournisseur Cloud si vous dépassez un certain montant.

Un dernier inconvénient est lié aux **tests** et à la résolution de bugs de vos fonctions. Cela demande une certaine habitude et parfois l'utilisation de services supplémentaires, tels que [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) par exemple.

## Applications PHP et les infrastructures Serverless

Nous allons voir maintenant les principaux acteurs Cloud permettant de déployer des applications PHP sur des infrastructures Serverless.

### Fournisseurs cloud

Actuellement, il est possible de déployer des applications PHP sur des infrastructures Cloud suivantes :
- AWS Lambda grâce aux *Layers*
- Google App Engine en version *standard* qui permet d'avoir 0 instances qui tournent

### Kubernetes

Il existe plusieurs frameworks permettant de déployer une infrastructure Serverless sur Kubernetes. Les plus connus sont :

- Knative
- Kubeless
- OpenFaaS
- Fission

### Apache OpenWhisk

Je fais ici une mention spéciale à la plateforme Apache OpenWhisk. Il s'agît d'un projet open source supportant nativement le PHP (parmi d'autres langages de programmation), qui est disponible via :

- IBM Cloud
- une implémentation Kubernetes que vous déployez chez n'importe quel provider cloud qui le supporte
- un hébergement *local* chez vous (possible avec Kubernetes, Docker, Ansible, Vagrant), c'est à dire que vous seriez votre propre provider d'infrastructure Serverless - cette solution n'est pas recommandée pour la production néanmoins, il est souhaitable de privilégier les solutions Cloud.

### Framework *serverless*

Chaque solution vue ci-dessus vient avec son propre SDK avec lequel il faut se familiariser.
Ainsi, si vous changez de plateforme, il faut refaire toutes les configurations et toutes les installations.

Il existe une solution que essaie de centraliser toutes les configurations et d'être aussi agnostique de la plateforme que possible : le [framework Serverless](https://serverless.com/).

Le framework Serverless comprend un CLI open source qui permet d'éviter l'installation de multiples SDK.

L'installation du framework Serverless est très rapide et simple :

```bash
$ npm install -g serverless
$ serverless -v
Framework Core: 1.67.3 (standalone)
Plugin: 3.6.6
SDK: 2.3.0
Components: 2.29.0
```

La mise en place et le paramétrage de ce framework dans votre application se font via un fichier `serverless.yml` qui ressemble à ceci :

```yaml
# serverless.yml
service: my-service
provider:
  name: aws
  runtime: nodejs12.x

functions: # Your functions
  hello:
    events: # The events that trigger this function
      - http: get hello
  usersCreate:
    events:
      - http: post users/create
  usersDelete:
    events:
      - http: delete users/delete

plugins:
  - serverless-offline
```

Le plugin `serverless-offline` sert à émuler AWS Lambda sur votre machine et vous permet de faire des tests de vos fonctions.

Bien sûr, la configuration n'est pas complètement agnostique du provider que vous auriez choisi, car les options dépendent fortement de celui-ci.

Pour déployer et appeler une fonction avec le framework serverless nous utilisons les commandes suivantes :

```bash
$ serverless deploy -v
$ serverless invoke -f hello -l
```

Dans l'article suivant, nous verrons en détails comment déployer une application PHP sur AWS Lambda avec Bref.
