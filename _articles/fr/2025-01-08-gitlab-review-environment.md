---
contentType: article
lang: fr
date: 2025-01-08
slug: environnement-gitlab-ci
title: Créer un environnement de revue avec Gitlab CI
excerpt: Après avoir développé une nouvelle fonctionnalité pour votre application, le code est revue par l'équipe. Pour que le relecteur puisse mieux se rendre compte des changements, il est intéressant de mettre les changements à disposition dans un environnement de revue. Cet article va expliquer les étapes pour le faire avec Gitlab CI.
cover:
    alt: Comment créer un environnement de revue avec Gitlab CI ?
    path: /imgs/articles/2025-01-08-gitlab-review-environment/cover.jpg
categories:
    - architecture
keywords:
  - devops
  - gitlab
authors:
    - tthuon
seo:
    title: Créer un environnement de revue avec Gitlab CI : méthode
    description: Découvrez comment créer une environnement de revue dynamique avec Gitlab CI.
---

Dans une équipe de développement, une des bonnes pratiques consiste à relire le code des autres membres de l'équipe. Cela permet de partager la connaissance et d'avoir un oeil différent sur le code produit. Pour aller encore plus loin, ce code pourrait être déployé dans un environnement isolé : un environnement de revue.

Voyons comment le mettre en oeuvre avec Gitlab CI.

## Créer un environnement de revue avec Gitlab CI

Dans le contexte d'un projet data, nous avons du code Python que nous devons mettre à disposition dans un stockage objet Google Cloud Storage. Ce code est lu et exécuté par le service Google Dataproc.

Gitlab CI a une fonctionnalité qui permet de créer des environnements à la volée.

Prenons ce fichier `.gitlab-ci.yml` initial.

```yaml
variables:
  DATAPROC_CLUSTER_NAME: review-${CI_COMMIT_REF_SLUG}
  DATAPROC_IMAGE_VERSION: 2.2.21-debian12
  DELTA_SPARK_VERSION: 3.2.0
  GCP_PROJECT_ID: my-project

stages:
  - deploy

deploy:review:
  stage: deploy
  image: hub.docker.com/google/cloud-sdk:alpine
  before_script:
    - gcloud auth activate-service-account --key-file $GCP_SA_KEY_DEV
    - gcloud config set project ${GCP_PROJECT_ID}
  script: |
    if [ $(gcloud dataproc clusters list --region=europe-west1 --filter=clusterName:$DATAPROC_CLUSTER_NAME --format="value(clusterName)" | wc -l) -eq 0 ]; then
      gcloud dataproc clusters create ${DATAPROC_CLUSTER_NAME} --enable-component-gateway --region=europe-west1 --master-machine-type=n1-standard-4 --worker-machine-type=n1-highmem-4 --num-workers=3 --num-masters=1 --master-boot-disk-size=1000 --worker-boot-disk-size=1000 --image-version=${DATAPROC_IMAGE_VERSION} --optional-components=JUPYTER --max-idle=1h --public-ip-address --properties=^#^spark:spark.jars=gs://${GCP_PROJECT_ID}/jars/delta-spark_2.12-${DELTA_SPARK_VERSION}.jar,gs://${GCP_PROJECT_ID}/jars/delta-storage-${DELTA_SPARK_VERSION}.jar#dataproc:pip.packages=delta-spark==${DELTA_SPARK_VERSION} --labels=environment-type=review,environment-name=${CI_COMMIT_REF_SLUG}
    fi
    gsutil -m rsync -d -x ".git|venv|__pycache__" -r ./ gs://${GCP_PROJECT_ID}/${CI_COMMIT_REF_SLUG}/spark-app
  rules:
    - if: $CI_MERGE_REQUEST_IID
```

La tâche de déploiement va vérifier la présence d'un cluster Dataproc. S'il n'existe pas, alors le cluster est créé. Les options ne sont pas importantes dans le cadre de l'article. Enfin, les fichiers sont copié dans le stockage objet avec la commande `gsutil`.

À partir de cette base, ajoutons la configuration pour créer un environnement dynamique. Nous voulons que cet environnement soit configuré de cette façon :
- préfixé par `review/`
- auto détruit après 1 jour
- le bouton pour voir l'environnement ouvre la console Google Cloud Platform sur le cluster Dataproc

Cela se traduit par la configuration suivante qui sera à ajouter à notre tâche de `deploy:review`.

```yaml
deploy:review:
  (...)
  environment:
    deployment_tier: testing
    name: review/${CI_COMMIT_REF_SLUG}
    action: start
    auto_stop_in: 1 day
    on_stop: deploy:review:stop
    url: https://console.cloud.google.com/dataproc/clusters/${DATAPROC_CLUSTER_NAME}/monitoring?region=europe-west1&project=${GCP_PROJECT_ID}
```

La clé `on_stop` dans l'objet `environment` fait référence à une tâche `deploy:review:stop`. C'est cette tâche qui sera exécutée lorsque l'environnement sera détruit par Gitlab.

Ajoutons cette tâche `deploy:review:stop`.

```yaml

deploy:review:stop:
  stage: deploy
  image: hub.docker.com/google/cloud-sdk:alpine
  before_script:
    - gcloud auth activate-service-account --key-file $GCP_SA_KEY_DEV
    - gcloud config set project ${GCP_PROJECT_ID}
  script:
    - gcloud dataproc clusters delete ${DATAPROC_CLUSTER_NAME} --region=europe-west1 --quiet || true
  rules:
    - if: $CI_MERGE_REQUEST_IID
      when: manual
  environment:
    name: review/${CI_COMMIT_REF_SLUG}
    action: stop
```

La tâche `deploy:review:stop` a bien une configuration `environment` avec la référence vers le nom de l'environnement à stopper, ainsi que l'action à effectuer.

Dans le cas d'une merge request, un environnement dynamique est automatiquement arrêté lorsque la branche est fusionnée dans la branche principale.

Lorsque vous allez créer une nouvelle merge request, les tâches de déploiement en environnement de revue se lance. Quelques minutes plus tard, l'environnement est disponible.

La liste des environnements actifs est disponible dans le menu à gauche : Operate > Environments.

## Conclusion

Bravo, vous avez créé un environnement de revue dynamique pour vos merge request. Cela va grandement faciliter la revue de code et va vous permettre de voir concrètement les changements. Votre Product Owner va adorer 🤩 !

## Référence

- https://docs.gitlab.com/ee/ci/environments/


Code complet

```yaml
variables:
  DATAPROC_CLUSTER_NAME: review-${CI_COMMIT_REF_SLUG}
  DATAPROC_IMAGE_VERSION: 2.2.21-debian12
  DELTA_SPARK_VERSION: 3.2.0
  GCP_PROJECT_ID: my-project

stages:
  - deploy

deploy:review:
  stage: deploy
  image: hub.docker.com/google/cloud-sdk:alpine
  before_script:
    - gcloud auth activate-service-account --key-file $GCP_SA_KEY_DEV
    - gcloud config set project ${GCP_PROJECT_ID}
  script: |
    if [ $(gcloud dataproc clusters list --region=europe-west1 --filter=clusterName:$DATAPROC_CLUSTER_NAME --format="value(clusterName)" | wc -l) -eq 0 ]; then
      gcloud dataproc clusters create ${DATAPROC_CLUSTER_NAME} --enable-component-gateway --region=europe-west1 --master-machine-type=n1-standard-4 --worker-machine-type=n1-highmem-4 --num-workers=3 --num-masters=1 --master-boot-disk-size=1000 --worker-boot-disk-size=1000 --image-version=${DATAPROC_IMAGE_VERSION} --optional-components=JUPYTER --max-idle=1h --public-ip-address --properties=^#^spark:spark.jars=gs://${GCP_PROJECT_ID}/jars/delta-spark_2.12-${DELTA_SPARK_VERSION}.jar,gs://${GCP_PROJECT_ID}/jars/delta-storage-${DELTA_SPARK_VERSION}.jar#dataproc:pip.packages=delta-spark==${DELTA_SPARK_VERSION} --labels=environment-type=review,environment-name=${CI_COMMIT_REF_SLUG}
    fi
    gsutil -m rsync -d -x ".git|venv|__pycache__" -r ./ gs://${GCP_PROJECT_ID}/${CI_COMMIT_REF_SLUG}/spark-app
  rules:
    - if: $CI_MERGE_REQUEST_IID
  environment:
    deployment_tier: testing
    name: review/${CI_COMMIT_REF_SLUG}
    action: start
    auto_stop_in: 1 day
    on_stop: deploy:review:stop
    url: https://console.cloud.google.com/dataproc/clusters/${DATAPROC_CLUSTER_NAME}/monitoring?region=europe-west1&project=${GCP_PROJECT_ID}

deploy:review:stop:
  stage: deploy
  image: hub.docker.com/google/cloud-sdk:alpine
  before_script:
    - gcloud auth activate-service-account --key-file $GCP_SA_KEY_DEV
    - gcloud config set project ${GCP_PROJECT_ID}
  script:
    - gcloud dataproc clusters delete ${DATAPROC_CLUSTER_NAME} --region=europe-west1 --quiet || true
  rules:
    - if: $CI_MERGE_REQUEST_IID
      when: manual
  environment:
    name: review/${CI_COMMIT_REF_SLUG}
    action: stop
```
