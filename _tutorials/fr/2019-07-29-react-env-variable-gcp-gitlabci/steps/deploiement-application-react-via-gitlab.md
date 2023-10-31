---
contentType: tutorial-step
tutorial: react-env-variable-gcp-gitlabci
slug: deploiement-application-react-via-gitlab
title: Déploiement de l'application React (recette et production) via Gitlab CI
---
## Déploiement de l'application React (recette et production) via Gitlab CI

Nous allons survoler également cette étape assez rapidement.
Pour commencer, je vous invite à lire [ceci](https://codelabs.eleven-labs.com/course/fr/gitlab-ci-js/)


### Pré-requis

Vous devez posséder un compte gitlab.
Créez un projet et un repository dans lequel vous aurez déposé votre code source.

 
### Mise en place de la CI (Continuous integration)

Le service CI/CD va nous permettre de déployer notre application.
Pour ce faire, il nous faut d'abord créer un fichier **gitlabci.yml** à la racine de notre projet et ajouter les instructions suivantes :

  
```bash

image: node:10
cache:
    paths:
    - node_modules/

stages:
    - deploy_recette
    - deploy_production

before_script:
    - echo  "deb http://packages.cloud.google.com/apt cloud-sdk-jessie main"  | tee /etc/apt/sources.list.d/google-cloud-sdk.list
    - curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    - apt-get update && apt-get install -y google-cloud-sdk
    - echo  $DEPLOY_KEY_JSON_PRODUCTION  > /tmp/$CI_PIPELINE_ID.json
    - gcloud auth activate-service-account --key-file /tmp/$CI_PIPELINE_ID.json
    - npm install


after_script:
    - rm /tmp/$CI_PIPELINE_ID.json
  
deploy_recette:
    environment: recette
    script:
    - npm run build
    - gcloud app deploy ./app.recette.yml --version=$CI_PIPELINE_ID --promote --stop-previous-version

deploy_production:
    environment: production
    script:
    - npm run build
    - gcloud app deploy ./app.yml --version=$CI_PIPELINE_ID --promote --stop-previous-version

```

Cet exemple est une version simplifiée, mais elle contient les éléments nécessaires au déploiement de nos deux applications.

Les principaux éléments ici sont :
**before_script** : cette partie nous permet d'installer le *SDK GCP* nécessaire au déploiement et d'initialiser ce dernier avec notre compte de service créé dans l'étape précédente via la variable d'environnement Gitlab (*DEPLOY_KEY_JSON_PRODUCTION*).

D'ailleurs, rendons-nous dans notre projet Gitlab, dans l'onglet *Settings* du repository.
Et allons insérer ce compte de service dans CI/CD >> Variables.

Indiquez *DEPLOY_KEY_JSON_PRODUCTION* dans le champ *KEY*. Et dans le champ *VALUE*, ajoutez le contenu de notre fichier **key.json**.
Ceci permettra à notre script de récupérer notre clé secrète sans qu'elle puisse être accessible par des tiers.

Enfin si nous jetons un oeil aux deux parties qui concernent les déploiements, le script va tout d'abord ajouter nos dépendances et ensuite lancer la commande que nous avons lancé à la main dans le step précédent.

Pour rappel, l'option version (*--version=$CI_PIPELINE_ID*) va utiliser l'ID de la pipeline, et permettra d'avoir des URLs différentes selon les versions.

Une fois ce fichier créé, je vous invite à pusher vos modifications sur votre repository.
Gitlab va détecter automatiquement notre fichier de CI et va l'exécuter.

À la fin du script de CI, si tout s'est bien passé, nous pourrons voir le résultat dans votre console GCP et vérifier que de nouvelles versions de nos services sont maintenant fonctionnelles.