---
layout: post
title: "Développement d'un bot conversationnel pour Leroy Merlin"
excerpt: "Cette année est certainement l'année des bot sconversationnels. Le marché ne cesse de grandir et tout le monde veut prendre une place sur ce dernier.L'usage deviens de plus en grand et les utilisateurs sont en demande. C'est même l'un des cadeaux le plus populaire de cette fin d'année."
authors:
    - captainjojo
lang: fr
permalink: /fr/rex-la-voix-leroy-merlin/
categories:
    - bot
cover: /assets/2018-12-26-rex-la-voix-leroy-merlin/cover.png
---

Cette année est certainement l'année des bot sconversationnels. Le marché ne cesse de grandir et tout le monde veut prendre une place sur ce dernier.

- [https://www.meta-media.fr/2018/08/31/premier-bilan-des-usages-de-google-assistant.html](https://www.meta-media.fr/2018/08/31/premier-bilan-des-usages-de-google-assistant.html)
- [https://mbamci.com/point-de-vue-expert-essor-bots-conversationnels/](https://mbamci.com/point-de-vue-expert-essor-bots-conversationnels/)
- [https://mbamci.com/point-de-vue-expert-essor-bots-conversationnels/](https://mbamci.com/point-de-vue-expert-essor-bots-conversationnels/)
- [https://www.lesechos.fr/idees-debats/cercle/cercle-185750-les-assistants-vocaux-moteur-de-la-reussite-des-marques-2197410.php](https://www.lesechos.fr/idees-debats/cercle/cercle-185750-les-assistants-vocaux-moteur-de-la-reussite-des-marques-2197410.php)

L'usage deviens de plus en grand et les utilisateurs sont en demande. C'est même l'un des cadeaux le plus populaire de cette fin d'année.

Les IA sont elle aussi de plus en plus performantes. C'est pour cela que les bots deviennent de plus en plus performant.  Comme le montre cet article [https://www.clubic.com/domotique/article-844539-1-siri-alexa-google-assistant-grand-comparatif-assistants-vocaux.html](https://www.clubic.com/domotique/article-844539-1-siri-alexa-google-assistant-grand-comparatif-assistants-vocaux.html)

C'est pour cela que cette année nous avons travaillé en partenariat avec `Start` l'équipe inovation de Leroy Merlin pour mettre en place l'un de leur bot conversationnel.

## Brief

Le brief du projet fut assez simple, nous avions 4 semaines de développement pour mettre en place le premier bot conversationnelle. Le but de ces quatres semaines était aussi de comprendre comment fonctionne un bot conversationnel, quel en sont les avantages et inconvenient. Tout ceci afin de pouvoir plus rapidement réflechir aux usages pour des futurs besoins.

Nous avons mis en place une équipe de 3 personnes pour réaliser se projet.
- un developpeur (Eleven-labs)
- un lead developpeur (Eleven-labs)
- le product owner (Leroy Merlin)

Comme 4 semaines de développement c'est assez rapide nous avons choisis de réaliser le projet sans intéraction extérieur (API, BDD, etc...).

## Data analyse

La première semaine du projet, doit nous apporter le premier usage possible pour un bot. Nous avons donc commencer par comprendre la donnée disponible sur l'ensemble des sites Leroy Merlin. Apres quelques moment sur les différentes applications nous avons pu mettre en avant les contenus de type tutoriels disponible à la fois sur la [chaine youtube de la marque](https://www.youtube.com/user/leroymerlinfr/videos), et sur leurs application [Campus](https://www.leroymerlin.fr/v3/p/campus/cours-de-bricolage-en-ligne-l1500452300).

Nous avons choisis de mettre en place un un bot permettatn de suivre un tutoriel en ligne.

## Préparation du dialogue

L'étape principale fut de lire l'exemple de la documentation que google propose pour la création de son premier assistant. Vous pouvez suivre cela [ici](https://developers.google.com/actions/design/).

Nous avons donc suivi cette documentation et créer notre premier dialogue en format `pièce de théatre`. L'un de nous jouait le rôle d'un utilisateur et le second celui d'un assitant vocal. Cela nous a parmis de très vite comprendre les intéractions que nous devions mettre en place.

Le second fut de mettre en place un `personna`. Ce dernier represente l'utilisateur type, cela nous permet d'adapter le contenu du dialogue et créer un vrai lien dans le dialogue.

## Développement rapide

Afin de nous permettre de réaliser le plus rapidement nos premiers tests utilisateur, nous avons choisis de développer le dialogue de facon **statique**. Nous avons donc seulement utilisé [Dialogflow](https://dialogflow.com/) afin de créer le premier dialogue et le mettre en place sur Google Home.

Ce développement mous a permis de mettre en place le dialogue suivant avec seulement un tutoriel disponible.

![conversation]({{site.baseurl}}/assets/2018-12-26-rex-la-voix-leroy-merlin/conversation1.png)

## Test utilisateur V1

Une fois ce développement réalisé, nous avons effectuer les permiers tests utilisateurs. Pour cela nous pris deux personnes étrangère au projet, avec lequelq nous avons realiser le test suivant.

Dans une salle filmée en live, l'utilisateur est resté avec le PO. Le PO était là pour guider l'utilisateur dans son dialogue sans le laisser seul face à l'assitant.

Pendant ce temps, le lead et le développeur prenaientt des notes sur les intéroggations et les suggestions des différents utilisateurs.

Beaucoup de chose en sont ressortis et nous ont permis d'affiner notre dialogue. Voici quelques exemples :
- Simplifier les termes techniques
- Proposer des services
- Lister les matériaux
- Etc...

## Développement dynamique

Après un travail sur le dialogue nous avons perfectionner ce dernier en utilisant l'ensemble des fonctionnalités de Dialogflow, ainsi qu'en mettant beaucoup plus de code en version dynamique.

![conversation2]({{site.baseurl}}/assets/2018-12-26-rex-la-voix-leroy-merlin/conversation2.png)

La suite du développement à pris plus d'une semaine. Il fallait pouvoir répondre à l'ensemble des tutoriels disponible dans les différentes données.

Le développement du bot c'est aussi axé sur le visuel disponible via Google Assitant sur votre téléphone ou la tablette.

L'aspect visuel est un plus donc notre bot car il apporte les détails qu'il manquait lors nos tests utilisateurs.

### Test utilisateur v2

Une fois le développement terminé, nous avons pu réaliser une seconde serie de test utilisateur.

Ce dernier nous as permis de rélger les dernier problèmes lié à la conversation. C'est surtout de bon moments pour voir les réelles intéractions qu'on les utilisateurs.

En effet, comme dans tout les développements, quand nous travaillons tout la journée sur le projet nous ne prenons plus en compte les cas d'erreurs ou les cas compliqué. C'est ce qu'apporte les tests utilisateurs, ce confronter à la réalité. Dans notre cas, une conversation est assez difficile à valider, l'intéligence de Google permet énormément de chose mais nous devons mettre aussi de nombreux point d'arret permettant de sortir du dialogue proprement.

## Production

Apres une validation compliqué de Google via [Action on Google](https://developers.google.com/actions/). La validation peut prendre du temps car elle est aujourd'hui faite manuellement par les équipes de Google qui la valide consciencieusement afin de respecté l'ensemble des règles de Google au sujet des bots conversationnelles.

L'application est aujourd'hui en production sous le non de **Tutoriel bricolage** disponible [ici](https://assistant.google.com/services/a/uid/00000032863ac780?hl=fr)

![production]({{site.baseurl}}/assets/2018-12-26-rex-la-voix-leroy-merlin/production.png)

Nous vons invitons à l'utiliser afin de nous permettre de la rendre toujours meilleur.

Après quatre semaines nous avons choisis en collaboation avec l'équipe `Start` de continuer sur d'autre cas d'usages.

Pendant le développement des nouveaux cas d'usages nous avons aussi mis en place plusieurs outils nous permettatn d'améliorer le bot existant.

## Tooling

Nous avons mis en place un panel d'administration permettant de suivre chaque conversation en production et de savoir s'il se sont correctement dans le bon **intent**

Ce panel permet aussi de suivre l'ensemble des conversions données et donc de connaitre les futurs besoins de nos utilisateurs.

![admin1]({{site.baseurl}}/assets/2018-12-26-rex-la-voix-leroy-merlin/admin1.png)

Il existe aussi une fonction permettant de changé les réponses du bot directement en production sans changer la release. Pour cela nous mettons en place une système clé/valeur qui nous permettent via l'admin des bots de changé une réponse très facilement.

![admin2]({{site.baseurl}}/assets/2018-12-26-rex-la-voix-leroy-merlin/admin2.png)

## Conclusion

Le projet continue de grandir de jour en jour. De nouveaux cas d'usages sont en cours de réalisation et vont arriver en production d'ici peu. En attendant nous analysons l'ensemble des conversations pour toujours améliorer notre bot actuel.






