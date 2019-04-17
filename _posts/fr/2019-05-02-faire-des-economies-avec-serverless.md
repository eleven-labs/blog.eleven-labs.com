---
layout: post
title: Faire des économies avec Serverless
excerpt: Comment faire des économies avec Serverless ? 
authors:
    - mmaireaux
lang: fr
permalink: /fr/faire-des-economies-avec-serverless/

image:
  path:  /assets/2018-10-24-debutons-avec-le-serverless/cover.jpg
  height: 610
  width: 429

categories:
    - devops
    - serverless
tags:
    - devops
    - serverless
---

Il y a quelque mois, nous vous avions présenter [ServerLess](https://blog.eleven-labs.com/fr/debutons-avec-le-serverless/), et vous aviez pu déployer votre premier applications avec celui-ci. 

Nous allons voir comment optimiser notre facture ServerLess. 

## Lambda : Ne pas écrire de log sauf en cas d'erreur

L'ensemble des outputs de votre lambda irons dans CloudWatch Logs, cependant, celui-ci a un coût et si a chaque exécution vous donner beaucoup d'information en log, vous allez vous retrouvez avec une facture CloudWatch Log énorme.    
Lors du fonctionnement "normal" de votre API (Code 200), n'écrivez pas de log. Par contre, lors des erreurs, n'hésiter pas être verbeux pour donner le plus d'information possible pour facilité le débug. 

## Api Gateway ou ALB, bien choisir

Voici la définition d'[API GATEWAY](https://aws.amazon.com/fr/api-gateway/) par AWS : ``` Amazon API Gateway est un service entièrement opéré, qui permet aux développeurs de créer, publier, gérer, surveiller et sécuriser facilement des API à n'importe quelle échelle ```.    
Le service fonctionne très bien dans l'ensemble, propose des options avancer comme des Authorizer, la gestion de la documentation, etc. Cependant, tout le monde n'utilise pas forcément les fonctionnalités d'API Gateway, et le service a un coût qui n'est pas négligeable: 
- Lors des 12 premiers mois : 1 Million de requête gratuite / mois 
- Après et au dessus du "free tiers", 3,5$ par Million de requête (prix dégressif)

Hors quand on créer une API qui reçoit un traffic important, on se retrouve avec une facture API GATEWAY assez haute.    
Vous pouvez régler le problème en ajoutant un cache CloudFront (je vous le recommande très très fortement), celui-ci réduira le nombre d'appel vers votre API (seulement si vous pouvez utiliser du cache sur votre API).    

Il existe sinon, une autre solution, l'utilisation de l'[ALB](https://aws.amazon.com/fr/elasticloadbalancing/) (Application Load balancer). 

Lors du dernier [AWS re:Invent](https://reinvent.awsevents.com/), AWS a fait une annonce qui est un peu passer innaperçu. Le support de lambda dans les ALB.    

ALB ne propose pas toute les options fourni par API Gateway, mais au niveau du tarif, vous allez voir une grande différence : 
- La mise a disposition d'un ALB coûte (0,0252$ / heure)
- On paye au LCU consommé (0,008$ / lcu / heure)

Lors de notre mise en place d'ALB sur un de nos plus gros projet, nous avons réduit la facture de 50$ / jours par rapport a API Gateway, soit une réduction mensuel de 1 500$ (pas vraiment négligeable).

## CloudFront

Si vous avez la possibiliter d'utiliser du cache, faites le ! L'économie réaliser par celui-ci sera énorme ! Et votre site sera capable de bien mieux tenir la charge. 

# Conclusion

Vous pouvez faire de grande économie avec Serverless, mais il ne faut pas oublier les coûts annexes qui tourne au tour de celui-ci ! 
Le cache peux vous permettre de faire de grande économie, encore faut-il savoir le configurer correctement :) "