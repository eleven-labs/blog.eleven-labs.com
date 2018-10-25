---
layout: post
title: "Débutons avec le Serverless"
excerpt: "Vous avez un nouveau projet personnel ou professionnel, vous ne voulez pas vous prendre la tête avec l’infrastructure, et vous souhaitez payer seulement pour les ressources utilisées ? Serverless est fait pour vous !"
authors:
    - mmaireaux
permalink: /fr/debutons-avec-le-serverless/
categories:
    - devops
    - serverless
tags:
    - devops
    - serverless
cover: /assets/2018-10-24-debutons-avec-le-serverless/cover.jpg
---

Vous avez un nouveau projet personnel ou professionnel, vous ne voulez pas vous prendre la tête avec l’infrastructure, et vous souhaitez payer seulement pour les ressources utilisées ? Serverless est fait pour vous !

Avant de vous lancer directement dans un cas concret sur l’utilisation du framework serverless, nous allons commencer par revenir sur les notions et la définition de serverless.

# Que veux dire réellement serverless ?

Dans le monde du cloud et du devops, il n’y a pas une seule et unique définition. Je vais donc vous donner la mienne.

Nous pouvons considérer que si nous n’avons pas de gestion de serveur, alors nous sommes dans le monde du Serverless. Cela voudrait dire que des services comme AWS Elastic Beanstalk, Google App Engine, Heroku, Clever Cloud qui sont des services PaaS pourraient être compris dans cette définition.

Cependant, nous allons souvent plus loin dans la définition du serverless. Il y a bien le côté de non-gestion des serveurs, mais aussi de pay-as-you-go. Il n’y a plus de frais fixes pour maintenir votre infrastructure disponible, mais seulement des coûts liés à l’utilisation de celle-ci. Des services comme AWS Lambda ou Google Cloud Functions rentrent parfaitement dans cette catégorie de service.

# Le framework serverless, il sert à quoi ?

[serverless](https://serverless.com/) est un des outils les plus connus à ce jour, il est compatible avec les solutions Cloud suivantes : AWS, IBM OpenWhisk, Microsoft Azure, GCP, Kubeless, Spotinst, Webtask. Serverless est agnostique du langage dans lequel vous souhaitez développer. Cependant, si votre provider ne supporte pas votre langage, cela pourrait ne pas fonctionner. L’ensemble des providers supporte deux langages : NodeJS et Python.
Mais il est aussi capable d’aller beaucoup plus loin grâce à un système de plugins. Ainsi, vous pouvez démarrer vos fonctions en local sur votre machine en simulant le fonctionnement d’API Gateway et Lambda, ou encore avoir une base DynamoDB locale pour vos développements.

# Comment fonctionne le framework serverless

Quand on cherche a déployer avec serverless, celui-ci vas lire notre fichier serverless.yml et le convertire en [CloudFormation](https://aws.amazon.com/fr/cloudformation/). Le code vas être zipper puis upload sur S3, CloudFormation lors de son lancement vas récupérer les fichiers sur S3 pour les alimenter les fonctions Lambda, et créer / modifier / supprimer les resources nécessaires (roles, lambda, dynamodb, ...).

# Prenons un cas concret

Nous allons déployer sur AWS une API GraphQL qui utilise une base de donnée DynamoDB. Nous allons découper le fichier serverless.yml et comprendre le fonctionnement de chacun des blocks.
```yaml
service: factory-api

frameworkVersion: ">=1.21.0 <2.0.0"

provider:
 name: aws
 region: eu-west-3
 runtime: nodejs8.10
 environment:
   DYNAMODB_TABLE_TEMPLATE: ${self:service}-${opt:stage, self:provider.stage}-template
iamRoleStatements:
   - Effect: Allow
     Action:
       - dynamodb:Query
       - dynamodb:Scan
       - dynamodb:GetItem
       - dynamodb:PutItem
       - dynamodb:UpdateItem
       - dynamodb:DeleteItem
     Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE_TEMPLATE}"
```
Votre fichier de description doit commencer par un “service” qui porte le nom de votre projet.
Puis vous allez configurer votre provider. Dans notre cas, nous souhaitons utiliser AWS sur la région de Paris (eu-west-3). Notre fonction lambda tournera avec un NodeJS 8.10. Nous voulons aussi ajouter une variable d’environnement à nos lambdas (DYNAMODB_TABLE_TEMPLATE).
Nous avons aussi besoin que notre Lambda communique avec DynamoDB de façon automatique et sans devoir stocker des credentials AWS. Pour cela nous allons utiliser un Rôle AWS.
```yaml
package:
 exclude:
   - docs/**
   - helpers/**
   - node_modules/**
   - test/**
```
Quand on demande un déploiement à Serverless, celui-ci va créer un répertoire temporaire, et copier le code ainsi que les dépendances de celui-ci.
Dans son comportement par défaut, il copie l’ensemble du répertoire dans le répertoire temporaire, mais nous pourrions vouloir exclure certains dossiers (comme dans cet exemple).
```yaml
plugins:
 - serverless-offline
 - serverless-webpack
 - serverless-domain-manager
 - serverless-dynamodb-local
 - serverless-prune-plugin
```
Nous pouvons ajouter des plugins pour améliorer et / ou changer le comportement de serverless :
- serverless-offline : nous permet d’avoir en local un environnement simulant le fonctionnement de Lambda et API Gateway
- serverless-webpack : nous permet de compiler le code NodeJS
- serverless-domain-manager : nous permet de gérer nos domaines et certificats pour les rattacher directement à notre API Gateway
- serverless-dynamodb-local : nous permet d’avoir une base de donnée DynamoDB en local pour nos développements, cela nous permet aussi de faire des développements en offline
- serverless-prune-plugin : nous permet de nettoyer au fur et à mesure les ressources non utilisées, ainsi nous ne gardons pas tout notre historique sur les lambdas, mais seulement les 3 dernières.

```yaml
custom:
 prune:
   automatic: true
   number: 3
 domains:
   preprod: "preprod-api.aws.eleven-labs.com"
   prod: "api.aws.eleven-labs.com"
 certificate:
   preprod: "*.aws.eleven-labs.com"
   prod: "*.aws.eleven-labs.com"
 serverless-offline:
   port: 4000
 webpackIncludeModules: true
 customDomain:
   domainName: "${self:custom.domains.${opt:stage}}"
   stage: "${opt:stage}"
   certificateName: "${self:custom.certificate.${opt:stage}}"
   createRoute53Record: true
   endpointType: 'regional'
 dynamodb:
   start:
     host: dynamodb
     migrate: true
     noStart: true
   migration:
     dir: offline/migrations
```
Quand on ajoute des plugins, il est souvent nécessaire d’ajouter de la config supplémentaire. Il faut alors l’ajouter dans le block custom, et suivre la documentation de chaque plugin :)
```yaml
functions:
 graphql:
   runtime: nodejs8.10
   handler: index.graphqlHandler
   events:
     - http:
         path: graphql
         method: get
         cors: true
     - http:
         path: graphql
         method: post
         cors: true
```
Le block functions nous permet de définir les lambdas que nous souhaitons créer avec leur spécificité.
```yaml
resources:
 Resources:
   dynamodbTemplate:
     Type: 'AWS::DynamoDB::Table'
     DeletionPolicy: Retain
     Properties:
       AttributeDefinitions:
         -
           AttributeName: id
           AttributeType: S
       KeySchema:
         -
           AttributeName: id
           KeyType: HASH
       ProvisionedThroughput:
         ReadCapacityUnits: 1
         WriteCapacityUnits: 1
       TableName: ${self:provider.environment.DYNAMODB_TABLE_TEMPLATE}

```
Nous pouvons demander à Serverless de créer des ressources supplémentaire sur AWS, dans notre cas, nous allons créer une table DynamoDB.

Comme nous avons pu le voir, avec un seul fichier, nous sommes capable de déployer l’infrastructure nécessaire au fonctionnement de notre projet, mais aussi simplifier la vie de nos développeurs.

Maintenant, vous êtes capable de déployer votre projet via le framework serverless, cependant, vous pourriez vouloir aller plus loin. Pourquoi pas ajouter une queue SQS. Voire même des lambdas qui se lancent automatiquement lors d’un nouveau message dans SQS ? (Je vous recommande de regarder du côté des triggers sur SQS et Lambda).
