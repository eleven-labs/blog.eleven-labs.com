---
layout: post
title: Domotiser son espace de travail - Partie 1
excerpt: L'objectif de cet article est de domotiser simplement et efficacement son espace de travail avec home-assistant.
authors:
    - pouzor
lang: fr
permalink: /fr/domotize-your-workspace/
categories:
    - domotique
    - gitlab
tags:
    - homeassistant
    - gitlab-ci
    - domotique
---

La domotique “grand public” s’installe de plus en plus dans les foyers, notamment grâce aux nouveaux assistants personnels (Google Home, Alexa) ou encore aux solutions de domotisation “clefs en main”. toutefois, elle reste plutôt absente dans les environnements pros et particulièrement dans notre cas, celui du développement. Pourtant les choses ont pas mal bougé ces dernières années dans le domaine.

Dans cet article, nous allons voir comment construire un dashboard d’équipe à l’aide de la solution domotique [home-assistant.io](https://www.home-assistant.io) et de quelques objets connectés (Philips Hue, Google Home).

## home-assistant.io

Mais qu’est-ce donc que Home Assistant ? Home Assistant (hass) est une solution domotique/automatisation open source, privacy-first qui commence à se faire vraiment bien connaître dans le monde de la domotisation. Elle est développée en python, basée sur un système événementiel et “packagé” avec l’ensemble des plugins (pas d’installation de plugin à posteriori).

Nous allons tout d’abord installer hass, et pour se faire, plusieurs choix s'offrent à nous (Docker, hassbian ou hass.io). Dans le cadre de ce tuto, nous allons le faire tourner sous Docker mais je vous invite à tester Hassbian qui marche très bien sous raspberry.

Cela tient en deux commandes (sous linux) : 

```sh
$ mkdir home-assistant
$ docker run -d --name="home-assistant" -v /PATH_TO_YOUR_FOLDER_HASS:/config -e "TZ=Europe/Paris" -p 8123:8123 homeassistant/home-assistant
```
Toutes les infos sur l’installation sont disponibles [ici](https://www.home-assistant.io/docs/installation/docker/) 


Et voilà, votre home-assistant tourne maintenant en local, et vous pouvez y accéder ici : 
[http://localhost:8124/](http://localhost:8124/)

![home-assistant]({{site.baseurl}}/assets/2019-05-28-domotize-your-workspace/connexion-home.png)


Il vous suffit maintenant de créer votre login/pass pour accéder à hass.
Nous allons voir à présent comment activer un [component](https://www.home-assistant.io/components/), en commençant avec [sensor.gitlab_ci](https://www.home-assistant.io/components/sensor.gitlab_ci/).

## Components et Sensor Gitlab CI

Tout d’abord, un petit laïus sur comment fonctionne home-assistant.

Si vous regardez dans le répertoire home-assistant que vous avez créé dans la première étape, vous devriez voir ceci : 

```sh
$ ls home-assistant

automations.yaml     customize.yaml       groups.yaml          home-assistant_v2.db secrets.yaml
configuration.yaml   deps                 home-assistant.log   scripts.yaml         tts

``` 

Globalement, toute la configuration se passe dans le fichier `configuration.yaml`, les autres .yaml étant inclus dans celui-ci.

Comme vous pouvez le voir, il est déjà rempli d'un certain nombre d’éléments, qui sont visibles sur votre home-assistant (map, plugin jour/nuit et météo).

Pour faire simple, il existe plusieurs types de components installables sur hass. Celui qui va nous intéresser c’est le type sensor, celui de gitlab-ci :

Dans la partie sensor du fichier configuration.yaml :

```yaml
sensor:
  - platform: gitlab_ci #référence du plugin
    gitlab_id: xxx #ID du projet à monitorer
    token: xxx #token gitlab
    name: Test gitlab projet X # va être l'id de votre sensor

```

Pour récupérer votre token gitlab, c'est par [ici](https://gitlab.com/profile/personal_access_tokens)

On va maintenant vérifier que le fichier yaml est correct, puis relancer home-assistant pour prendre la configuration en compte.

![home-assistant]({{site.baseurl}}/assets/2019-05-28-domotize-your-workspace/restart.png)


Vous devriez maintenant voir apparaître le dernier statut du build du projet.


![home-assistant]({{site.baseurl}}/assets/2019-05-28-domotize-your-workspace/hass-gitlabci.png)


Et si vous cliquez sur le sensor, vous aurez plus d’infos : 

![home-assistant]({{site.baseurl}}/assets/2019-05-28-domotize-your-workspace/details-gitlabci.png)


## Design

Bon c’est bien sympa, mais on ne voit pas grand chose et c’est assez minimaliste tout ca. Allons ajouter un coup de template là-dessus.
Hass utilise maintenant [lovelace](https://www.home-assistant.io/lovelace/) par défaut. Nous allons activer le mode yaml de lovelace pour simplifier l'édition.

```yaml
#configuration.yaml
lovelace:
  mode: yaml
```

Et créer le fichier de configuration qui va bien dans le répertoire racine.

```sh
$ touch ui-lovelace.yaml
```
Comme à chaque modification du fichier `configuration.yaml`, pensez à redémarrer Hass.



Next, nous avons besoin de faire apparaître les valeurs secondaires du plugin Gitlab comme un sensor à part entière, nous allons donc les créer "à la mano".

{% raw %}
```yaml
#configuration.yaml
sensor:
  #... ajoutez uniquement ces deux platforms sous le noeud sensor
  - platform: template
    sensors:
      test_gitlab_projet_x_build_branch: #nom que l’on donne à notre sensor custom
        value_template: "{{ state_attr('sensor.test_gitlab_projet_x', 'build branch') }}" # On récupère et affiche l’attribute ‘build branche’
        friendly_name: "Branch"
        entity_id: test_gitlab_projet_x #Le sensor va écouter cette entity pour changer ses valeurs 
      test_gitlab_projet_x_commit_date:
        value_template: "{{ state_attr('sensor.test_gitlab_projet_x', 'commit date') }}"
        friendly_name: "Date"
        entity_id: sensor.test_gitlab_projet_x

```
{% endraw %}
Attention à bien insérer les deux nouveaux sensors sous le noeud `sensor` existant déjà dans le fichier configuration.


Ici `state_attr` nous permet de récupérer l’attribut 'commit date' du sensor gitlab.

Enfin, il nous reste plus qu’à configurer notre template pour afficher notre card.

```yaml
#ui-lovelace.yaml

title: Dashboard
views:
    # View tab title.
  - title: Gitlab
    icon: mdi:gitlab
    id: gitlab
    cards:
      - type: entities
        title: Gitlab X Project
        entities:
          - entity: sensor.test_gitlab_projet_x
          - entity: sensor.test_gitlab_projet_x_build_branch
          - entity: sensor.test_gitlab_projet_x_commit_date
            icon: mdi:calendar-range
  - title: Other
    id: other

```

Tadaaa : 

![home-assistant gitlab-ci]({{site.baseurl}}/assets/2019-05-28-domotize-your-workspace/lovelace-gitlabci.png)


Dernière étape, nous allons créer une card spécifique pour la branche master afin de suivre spécifiquement cette branche. Pour cela, nous allons utiliser un custom component : [variable](https://github.com/rogro82/hass-variables).
Il suffit simplement de copier le dossier variable de ce projet dans un repertoire `custom_components` à la racine du projet.

Ensuite, nous allons créer notre variable de status de CI pour master :

```yaml
#configuration.yaml

variable:
  master_status:
    value: "Waiting next commit on master"
```


Puis, il va falloir créer une automation pour mettre à jour le status de la CI sur cette variable uniquement lorsque le pipeline est sur master.

{% raw %}
```yaml
#automation.yaml

- trigger:
    platform: state
    entity_id: sensor.test_gitlab_projet_x
  condition:
    - condition: template
      value_template: "{{ is_state('sensor.test_gitlab_projet_x_build_branch', 'master') }}"
  action:
      - service: variable.set_variable
        data:
          variable: master_status
          value_template: "{{ states('sensor.test_gitlab_projet_x') }}"
```
{% endraw %}
Ici nous avons : 
- `trigger`: chaque changement lance cette automation
- `condition`: il faut que notre entity branch ait la valeur master
- `action`: si la condition est remplie, nous changeons la valeur de notre variable avec le status de la pipeline


Enfin, il nous reste plus qu'à ajouter la card dans lovelace.

```yaml
#ui-lovelace.yaml
      #...
      - type: entities
        title: Gitlab X Project Master
        entities:
          - entity: variable.master_status
```


Le résultat :

![home-assistant gitlab-ci]({{site.baseurl}}/assets/2019-05-28-domotize-your-workspace/master-branch-result.png)


Voilà pour la partie design, il y à des dizaines d’améliorations à apporter que nous ne verrons pas dans cet article.

Par exemple : 
- Changer la couleur de la card en fonction du test / résultat de la pipeline
- Raccourci vers le résultat de la CI
- Stats sur les CI/CD
- …

Pour information, vous pouvez faire la même chose avec [Github](https://www.home-assistant.io/components/github/).


Voila pour la première partie de l'article, vous pouvez retrouver le code de cet article sur [Github](https://github.com/eleven-labs/home-assistant)


Dans le prochain [article]({{site.baseurl}}/fr/domotize-your-workspace-part-2/), nous verrons comment nous pouvons agir physiquement en fonction des résultats des pipelines dans notre espace de travail, grâce aux Philips Hue ou encore avec GoogleHome.
