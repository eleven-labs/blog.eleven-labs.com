---
contentType: tutorial-step
tutorial: react-env-variable-gcp-gitlabci
slug: deploiement-du-projet-sur-app-engine
title: Déploiement du projet sur App Engine
---
## Déploiement du projet sur App Engine

Nous allons survoler cette étape assez rapidement, car ce point n'est pas le sujet du CodeLabs mais reste essentiel pour la suite.

Nous utiliserons le service **App Engine** qui permet de déployer des applications web très facilement.
Si vous voulez en savoir sur AppEngine rendez-vous ici : https://cloud.google.com/appengine/
Vous devriez également lire l'article [suivant]({BASE_URL}/fr/google-cloud-platform-appengine-pour-vos-projets/) si vous n'avez aucune connaissance sur le service App Engine.

Dans l'ordre, nous allons créer un projet sur GCP, installer le **SDK** et enfin déployer une application de recette et de production.


### Création du projet GCP

Je vous invite tout simplement à lire l'article suivant, il vous permettra de créer un projet GCP :
https://blog.eleven-labs.com/fr/google-cloud-platform-pour-les-nuls/

### Installation du SDK GCP en vue du déploiement
 

#### Création d'un compte de service

Avant toute chose, il est nécessaire de créer un compte de service pour utiliser le SDK.

Je vous invite à aller dans l'onglet **IAM et administration** de la console GCP et de créer un compte de service :

Nom du compte de service :
```bash
react-app
```
Description du compte de service :
```bash
react-app
```
Ensuite il vous demandera de définir les autorisations du compte :

Nous choisirons dans notre cas : Projet >> propriétaire (pour plus de simplicité).
Enfin, créez une clé de sécurité au format **JSON** et enregistrez cette clé sur votre machine à l'extérieur de votre projet.
Si vous désirez plus d'informations sur les comptes de services, rendez-vous [ici](https://cloud.google.com/compute/docs/access/service-accounts?hl=fr).

#### Installation du SDK GCP

Je vous invite à suivre les instructions disponibles [ici](https://cloud.google.com/sdk/install).
Une fois l’installation terminée vous devriez pouvoir lancer la commande suivante dans votre terminal :
```bash
gcloud auth activate-service-account --key-file chemin/vers/key.json
```
  
Ensuite il nous faut configurer votre SDK avec la commande suivante :

```bash
gcloud init
```


Suivez les instructions du prompteur en choisissant le compte de service que vous avez créé et le projet que nous avons créé précédemment.
Nous sommes fin prêts à déployer notre application sur AppEngine.

  

### Déploiement sur App Engine

  
Afin de déployer notre application via le SDK, nous allons utiliser un fichier au format YAML reconnu par App Engine.
Nous allons donc ajouter un fichier **app.yaml** qui permet de configurer votre service App Engine. Vous trouverez la documentation complète [ici](https://cloud.google.com/appengine/docs/standard/python/config/appref?hl=fr).

Dans le fichier, nous allons mettre en place la configuration de base pour un environnement node.

```bash
#app.yml
service: default
runtime: nodejs10
instance_class: F1

handlers:
    - url: /
    static_files: build/index.html
    upload: build/index.html
    - url: /(.*)/
    static_files: build/\1/index.html
    upload: build/(.*)/index.html
    - url: /static
    static_dir: build/static
    - url: /(.*)
    static_files: build/index.html
    upload: build/index.html

```


Le premier service aura toujours pour nom : **default**.
Le paramètre **runtime** permet de définir l'environnement d'exécution.
**instance_class** définit le type d'instance que l'on va utiliser.
Et le paramètre **handlers** permet de lister les formats d'une URL de notre application React.


#### Déploiement de l'application de production

La mise en production est maintenant simple, il nous suffit de lancer la commande suivante à la racine du projet :

```bash
gcloud app deploy ./app.yml --version version1
```

L’option *–version* vous permet de donner un nom à votre version. App Engine permet de gérer différentes versions pour un même service.
Ceci peut être utile en cas de rollback ou de tests.

Allons vérifier que notre application est bien déployée.
Rendez-vous dans la console Cloud dans l’onglet App Engine, puis dans *SERVICES >> VERSIONS*. Vous devriez voir la version de votre application *default* apparaître.

Quand le déploiement sera terminé, nous pourrons accéder à notre front React en cliquant sur le nom de la version.
  

#### Déploiement de l'application de production

Pour obtenir une version de recette de notre application, nous allons déployer un second service de la même manière que précédemment. Il nous suffit de créer un second fichier **app.recette.yml** et d'y ajouter la configuration suivante :

  

```bash
#app.recette.yml
service: react-app-recette
runtime: nodejs10
instance_class: F1

handlers:
    - url: /
    static_files: build/index.html
    upload: build/index.html
    - url: /(.*)/
    static_files: build/\1/index.html
    upload: build/(.*)/index.html
    - url: /static
    static_dir: build/static
    - url: /(.*)
    static_files: build/index.html
    upload: build/index.html

```

  
Le seul changement ici se fait au niveau du nom de notre service.
Nous aurons ainsi deux services distincts que nous pourrons déployer indépendamment l'un de l'autre.

Dans la prochaine étape, nous allons maintenant industrialiser ce process en utilisant les fonctionnalités offertes par GitlabCI. Ce qui nous évitera de déployer *à la main* nos versions.