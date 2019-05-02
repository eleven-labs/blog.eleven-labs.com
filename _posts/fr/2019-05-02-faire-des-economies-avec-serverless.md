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

Il y a quelques mois, nous vous avions présenté [ServerLess](https://blog.eleven-labs.com/fr/debutons-avec-le-serverless/), et vous aviez pu déployer votre première application. 

Aujourd'hui, nous allons voir comment optimiser notre facture ServerLess. 

## Lambda : ne pas écrire de log, sauf en cas d'erreur

L'ensemble des outputs de votre lambda iront dans CloudWatch Log. Cependant, celui-ci a un coût. Et si a chaque exécution vous donnez beaucoup d'informations en log, vous allez vous retrouver avec une facture CloudWatch Log énorme.    
Lors du fonctionnement "normal" de votre API (Code 200), n'écrivez pas de log. Par contre, lors des erreurs, n'hésitez pas être verbeux pour donner le plus d'informations possible et faciliter le débug. 

## Lambda : Bien le configurer 
Sur lambda, vous êtes facturer par rapport a la mémoire alloué pour votre lambda ainsi que le temps de fonctionnement de celui-ci. 
Augmenter la mémoire de lambda, alloue aussi un CPU plus performant. 
Il peut donc être très intéressant d'utiliser une configuration mémoire suppérieur et ainsi réduire le temps de fonctionnement de votre lambda et donc d'en réduire le coût. 

Il faut aussi faire attention au Cold Start, celui-ci est facturé par AWS, et peut être très long sur certain language. 
Par exemple, si vous avez une lambda en java, celle-ci aura un cold start plus important que la même lambda en Python ou NodeJS. 

## Api Gateway ou ALB, bien choisir

Voici la définition d'[API GATEWAY](https://aws.amazon.com/fr/api-gateway/) par AWS : ``` Amazon API Gateway est un service entièrement opéré, qui permet aux développeurs de créer, publier, gérer, surveiller et sécuriser facilement des API à n'importe quelle échelle ```.    
Le service fonctionne très bien dans l'ensemble, propose des options avancées comme des Authorizer, la gestion de la documentation, etc. Cependant, tout le monde n'utilise pas forcément les fonctionnalités d'API Gateway, et le service a un coût qui n'est pas négligeable : 
- Lors des 12 premiers mois : 1 Million de requête gratuite / mois 
- Après et au dessus du "free tiers", 3,5$ par Million de requête (prix dégressif)

Or, quand on créée une API qui reçoit un traffic important, on se retrouve avec une facture API GATEWAY assez haute.    
Vous pouvez régler le problème en ajoutant un cache CloudFront (je vous le recommande très très fortement), celui-ci réduira le nombre d'appel vers votre API (seulement si vous pouvez utiliser du cache sur votre API).    

Il existe sinon une autre solution, l'utilisation de l'[ALB](https://aws.amazon.com/fr/elasticloadbalancing/) (Application Load balancer). 

Lors du dernier [AWS re:Invent](https://reinvent.awsevents.com/), AWS a fait une annonce qui est un peu passer innaperçue. Le support de lambda dans les ALB.    

ALB ne propose pas toutes les options fournies par API Gateway, mais au niveau du tarif, vous allez voir une grande différence : 
- La mise à disposition d'un ALB coûte (0,0252$ / heure)
- On paye au LCU consommé (0,008$ / lcu / heure)

Lors de notre mise en place d'ALB sur un de nos plus gros projet, nous avons réduit la facture de 50$ / jour par rapport à API Gateway, soit une réduction mensuelle de 1500 $ (pas négligeable).

## CloudFront

Je vous recommande de créer dès le début un cloudfront devant votre API Gateway ou ALB, ainsi, le passage de l'un a l'autre sera totalement transparent pour vos utilisateur. 
De plus, vous pourrez configurer du cache sur celui-ci, et ainsi permettre de réduire le nombre d'appel avotre Lambda.

# Conclusion

Vous pouvez faire de grandes économies avec Serverless, mais il ne faut pas oublier les coûts annexes qui tournent au tour de celui-ci ! 
Surveillez attentivement votre facturation avec [AWS Cost Explorer](https://aws.amazon.com/fr/aws-cost-management/aws-cost-explorer/) ! Ainsi, vous serrez capable de suivre votre facturation et donc les coûts de votre Lambda. 