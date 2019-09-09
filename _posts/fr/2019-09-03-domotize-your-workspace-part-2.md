---
layout: post
title: Domotiser son espace de travail - Partie 2
excerpt: L'objectif de cet article est de domotiser simplement et efficacement son espace de travail avec home-assistant (partie 2).
authors:
    - pouzor
lang: fr
permalink: /fr/domotize-your-workspace-part-2/
categories:
    - domotique
    - gitlab
tags:
    - homeassistant
    - gitlab-ci
    - domotique
    - ifttt
    - hue
    - google home
---

Nous avons vu dans le précédent [article]({{site.baseurl}}/fr/domotize-your-workspace/) comment configurer HA, avec le plugin Gitlab afin de créer notre premier dashboard. Cependant, nous n'avons pas vu encore gros chose en relation avec la domotique... Il est temps de s'y mettre.


## Le plan

Ce qui est compliqué avec la domotique, ce n'est pas la réalisation, ni même la techno, mais bien souvent de savoir ce que l'on va faire, c'est à dire "Comment je peux améliorer mon quotidien, de maniere automatique, avec des intérations IRL".

Dans ce tuto, nous allons voir comment utiliser des Philips Hue, ainsi qu'une Google Home pour "animer" notre open space.


Mais si jamais vous avez du temps et du budget, voici quelques autres idées : 
- Mesurer le niveau sonore de l'open space et avertir en cas de dB trop important
- Faire couler automatiquement le café à l'heure du stand up
- N'éteindre les machines de dev que lorsque tout les développeurs sont partis le soir
- Utiliser un nerf sur tourelle pour tirer automatiquement sur la personne qui fait planter la CI
- ...


Du coup dans ce tuto, deux use-cases : 
- Allumer une lampe de bureau, pendant 5 secondes, en fonction du statut de la CI (rouge ou vert).
- Avoir un message vocale, via la google home, en fonction du statut de la CI.


## Configuration du scénario Hue


Première étape, nous allons ajouter l'intégration Philips Hue sur notre HomeAssistant. Celle ci existe par default, et lorsque vous êtes sur le même reseau wifi, nous pouvons même le configurer automatiquement avec "l'assistant intégration" d'HA.

Rendez-vous dans la partie Configuration / Intégrations / + , puis cherchez Philips Hue. Suivez la procédure affichée (pression le bouton sur le hub ect...). 


![]({{ site.baseurl }}/assets/2019-09-03-domotize-your-workspace-part-2/domo-part2-1.png)  
Une fois l'installation terminée, si tout ce passe correctement, vous devriez voir l'ensemble de vos ampoules hue s'afficher. Vous pouvez les attribuer à une pièce, mais cette partie n'est pas nécessaire pour ce tuto.


![]({{ site.baseurl }}/assets/2019-09-03-domotize-your-workspace-part-2/domo-part2-2.png)  


Pour ma part, je vais utiliser l'ampoule "Bureau" pour ce tuto. Pour voir votre ampoule et commencer à interagir avec elle, vous pouvez retourner sur le dashboard, puis en haut à droite, choisir "Entités inutilisées". 
Vous devriez voir ceci :

![]({{ site.baseurl }}/assets/2019-09-03-domotize-your-workspace-part-2/domo-part2-3.png)  

Et si vous cliquez dessus (je vous laisse tester l'interface hue plutot fonctionnelle) :

![]({{ site.baseurl }}/assets/2019-09-03-domotize-your-workspace-part-2/domo-part2-4.png)  

Notre lampe etant maintenant configurée, nous allons pouvoir intéragir automatiquement avec elle en fonction des résultats de la CI. Sur la [page](https://www.home-assistant.io/components/light/) de documentation des entities "light", nous pouvons voir que nous avons de nombreuses fonctionnalités accessibles, comme la possibilité bien sur de pouvoir allumer/éteindre l'ampoule mais aussi de pouvoir set la couleur (rgb) ect...

Cela ca donc ce passer de nouveau dans le fichier `automations.yaml`.


```yaml
# automations.yaml
- trigger:
    platform: state
    entity_id: sensor.test_gitlab_projet_x
  condition:  
    - condition: state
      entity_id: sensor.test_gitlab_projet_x
      state: 'failed' #if CI failed   
  action:
    - service: light.turn_on #Action to turn on light
      data:
        entity_id: light.bureau #entity to turn on
        brightness: 255 
        rgb_color: [255,0,0] #red color (RGB)
    - delay:
        seconds: 5 #wait 5 sec
    - service: light.turn_off #then turn off light
      data:
        entity_id: light.bureau

- trigger:
    platform: state
    entity_id: sensor.test_gitlab_projet_x
  condition:  
    - condition: state
      entity_id: sensor.test_gitlab_projet_x
      state: 'success'      
  action:
    - service: light.turn_on
      data:
        entity_id: light.bureau
        brightness: 255
        rgb_color: [0,255,0]
    - delay:
        seconds: 5
    - service: light.turn_off
      data:
        entity_id: light.bureau

```

On définit donc deux nouvelles automations, une pour le 'failed' et l'autre pour le statut 'success'. Pour ces deux automations, nous allons allumer la lampe, mettre la bonne couleur en fonction du resultat de la CI, attendre 5 seconde puis éteindre la lumière.

Relancez votre home assistant et attendez votre prochain commit sur gitlab. Pensez juste que le plugin Gitlab est en "pull" sur les données, donc il peut y avoir un peut de delais entre la fin de la CI et le lancement de l'automation.



## Configuration du scénario Vocale

De la même manière que pour la partie précédente, nous allons commencer par ajouter l'élément "Cast" de google. Nous allons donc aller dans la partie Configuration / Intégrations / + , puis cherchez "Cast" et suivre la procédure pour ajouter les devices Google (chromecast, home...). Dans notre cas, c'est notre Google Home qui nous intéresse.

![]({{ site.baseurl }}/assets/2019-09-03-domotize-your-workspace-part-2/domo-part2-5.png)  


Ensuite, nous allons activer le component text-to-speech dans la configuration, puis redémarrez HA.

```yaml
# configuration.yaml
# Text to speech
tts:
  - platform: google_translate
```

Pour tester que notre configuration est bonne, nous pouvons call le service directement depuis la page des services `http://localhost:8123/developer-tools/service`

![]({{ site.baseurl }}/assets/2019-09-03-domotize-your-workspace-part-2/domo-part2-6.png)  

Si tout est bon, nous pouvons donc ajouter les nouvelles automations :

```yaml
# automations.yaml
- trigger:
    platform: state
    entity_id: sensor.test_gitlab_projet_x
  condition:  
    - condition: state
      entity_id: sensor.test_gitlab_projet_x
      state: 'failed' #if CI failed   
  action:
    - service: tts.google_translate_say
      entity_id: "all"
      data:
        message: 'ah ah ah, you didn't say the magic word'
    - service: light.turn_on #Action to turn on light
      data:
        entity_id: light.bureau #entity to turn on
        brightness: 255 
        rgb_color: [255,0,0] #red color (RGB)
    - delay:
        seconds: 5 #wait 5 sec
    - service: light.turn_off #then turn off light
      data:
        entity_id: light.bureau

- trigger:
    platform: state
    entity_id: sensor.test_gitlab_projet_x
  condition:  
    - condition: state
      entity_id: sensor.test_gitlab_projet_x
      state: 'success'      
  action:
    - service: tts.google_translate_say
      entity_id: "all"
      data:
        message: 'GG, it's all Green ready to prod'
    - service: light.turn_on
      data:
        entity_id: light.bureau
        brightness: 255
        rgb_color: [0,255,0]
    - delay:
        seconds: 5
    - service: light.turn_off
      data:
        entity_id: light.bureau
```

Plus d'informations sur le [tts](https://www.home-assistant.io/components/tts/)


C'est tout pour ce tuto, vous pouvez trouver les sources du code sur [github](https://github.com/eleven-labs/home-assistant/tree/part-2)