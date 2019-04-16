---
layout: post
title: "AWS Summit 2019 - Retour d'expérience"
excerpt: "L'AWS Summit Paris, s'est tenu le 2 Avril au palais des congrés, c'était l'occasion d'en apprendre plus sur les différents services proposés par AWS via des conférences, tutoriel et discussions sur les stands des différents partenaires de l'événement. Nous sommes plusieurs enthousiastes Cloud d'Eleven Labs à nous être rendu sur place."
authors:
    - vbertrand
lang: fr
permalink: /fr/aws-summit-2019-retour-d-experience/
categories:
    - aws
tags:
    - cloud
---

# AWS Summit 2019 - Retour d'expérience

L'AWS Summit Paris, s'est tenu le 2 Avril au palais des congrés, c'était l'occasion d'en apprendre plus sur les différents services proposés par AWS via des conférences, tutoriel et discussions sur les stands des différents partenaires de l'événement. Nous sommes plusieurs enthousiastes Cloud d'Eleven Labs à nous être rendu sur place.

Je vais donc vous faire un retour de ce que j'ai pu y voir, je vous recommande par ailleurs fortement l'événement (PS: Google le fait aussi et ça se passe en juin : [Google Summit](https://inthecloud.withgoogle.com/summit-par-19/home.html). ). Vous pouvez trouver l'ENSSEMBLE des conférences et ressources données sur place en suivant ce [lien](https://aws.amazon.com/fr/events/summits/paris/contenu/). 

Autre précision, l'événement est gratuit il faut simplement se préinscrire, et c'est à mon avis une occasion formidable de découvrir les différents services, voir dans certaines track d'apprendre de manière basique à les utilisers.
  
## Keynote d'ouverture

![]({{site.baseurl}}/assets/2019-04-16-aws-summit-2019-retour-d-experience/keynote-ouverture.jpg)


L'ouvertude des conférences s'est faite à 9h30 après le petit déjeuné sur un Keynote d'une heure quarante-cinq, Julien Groues, Country Manager France AWS est revenu un peu sur l'historique des services.

Ouvert en 2006, AWS proposait uniquement : 
- S3 : stockage d'objets dans le cloud
- SQS : un service de "Queuing" (comme RabbitMq)
- EC2: un service de calcul virtuel scalable et sécurisé

Aujourd'hui AWS propose plus de 100 services répartis dans 23 catégories différentes, Adrian Cockroft, VP Cloud Architecture Strategy AWS, en a présenté certains des nouveaux et nous à aussi parlé un peu du développement d'un point de vue "commercial".

Trois track ont eux lieu entre les différents discours des deux représentant d'AWS:
- Antoine Larmanjat, CIO, Euler Hermes
- Florian Douetteau, Co-founder & CEO, Dataiku
- Gilles Chervy, Head of Infrastructure, Gameloft

Chacune d'elle montrait les avantages économiques, logistique, et autres d'utiliser les services d'AWS et indroduisaient les thèmes de prédilection de ce summit: 
- Le Machine Learning
- Les Architectures Hybrides
- La migration de base de données vers AWS
- La sécurité

Voici donc quelques retours sur les conférences auquelles j'ai assisté, et ce qui m'a marqué.

## Cloud Economics – Optimisez vos budgets IT en passant sur le cloud - Alexis Dahan (AWS) & Fouad Maach (Veolia)

L'idée générale du talk était de montrer comment faire des économies en comparant le on-promise (avoir son propre matériel server / data-center) au cloud.

Statistiquement : sur **une moyenne de 125 clients** on obtient une **économie de 26 à 49%** en cloud comparé à du on promise, en partie du au fait que **84% des servers on-promise sont surdimensionnés** (statistiques d'Amazon).

![]({{site.baseurl}}/assets/2019-04-16-aws-summit-2019-retour-d-experience/onpremise-vs-aws.jpg)


### Economie:

[photo palliés d'économie talk cloud economics]

Pour du on-premise le premier point de comparaison est le coût upfront, ce que l'on va débourser avant même de pouvoir utiliser nos serveurs, le matériel coûte extrement cher, mais il faut aussi prendre en compte son entretien, la sécurité de celui-ci et autres, comme les interventions sur les bases de données, les upgrades, c'est beaucoup de chose à gérer qui ne sont pas le "core" de notre métier. AWS propose donc une solution pour nous libérer ce temps et en même temps réduire nos coûts.

Il n'y a (généralement) pas de coût upfront avec les services AWS, on trouve pour la plus part des offres gratuites, qui permettent largement de tester une idée, ou de voir si son modèle économique fonctionne avant même de débourser un centime. 

Le paiement quand à lui se fait "à la demande" en fonction de l'utilisation, et de nos besoins, pas besoin de payer une grosse machine lorsque l'on a besoin de petites capacités de calcul. Pour une configuration bien faite il n'y même pas besoin de payer lorsque les machines que l'on "loue" ne sont pas utilisées.

### Productivité:

Alexis nous a expliqué dans cette sous partie, que l'économie passait aussi par l'augmentation très significative de la productivité de l'équipe lors du passage au Cloud, en reprennant l'exemple des bases de données: sur du on-promise il faut s'occuper du matériel, mesurer des KPI pour faire évoluer son architecture de manière intelligente, et donc ensuite changer le matériel soit même. 

En version Cloud, l'équipe à la possiblité de manager beaucoup plus de machines, imaginons qu'on ai 2 managers pour 100 machines on-prem, lors du passage en cloud un seul peut souvent s'occuper des 100, ce qui nous permet de réinvestir le temps de la deuxième personne ailleurs. 

### Agilité et innovation : 

L'un des autres aspects du cloud qui fait que beaucoup de gens migrent vers celui-ci est la **sécurité**, on trouve des services comme IAM et Cognito qui permettent de gérer les permissions d'accès à tout le parc de manières simplifié, et de gérer ses utilisateurs, en laissant à Amazon le soin de les stockers et de sécuriser l'information.

Même chose pour la "sécurité du matériel", le cloud permet statistiquement de **réduire de 43,4% le nombres d'incidents**, ce qui contribue encore une fois à rendre le tout plus économique, pas de changement de disque cassé, c'est le rôle d'Amazon.

Alexis nous a cité Joy Ito, "Si vous voulez accroitre votre innovation, réduisez le coût de votre échec", et c'est exactement ce que permettent les services d'Amazon.


## Simplifiez vos frontend à l'aide de backend serverless dans le cloud - Sébastien Stormacq (AWS) & Aurélien Capedecomme (CTO 20 Minutes) 

Ce talk abordait la génération d'un architecture serverless avec un exemple concret, celui de 20 Minutes (Quotidien) et la présentation de l'outil Amplify qui permet d'accélérer grandement le développement d'application serverless. 

Je vous encourage fortement à aller jeter un oeil au talk, vous le retrouverez sur la page de ressource que j'ai mis en introduction en cherchant le titre ("Simplifiez vos frontend [...]").

Le talk commence sur le slide drôle de la journée typique d'un développeur avec son Chef de projet/Scrum Master qui lui demande : 
- "Notre client a besoin d'une app, notre concurrent vient de lancer la sienne nous en avons donc besoin rapidement, je n'ai pas de budget, je ne veux pas payer si ça ne marche pas, elle doit fonctionner pour des millions d'utilisateurs et être simple a gérer au quotidien, TU ES TOUT SEUL SUR CE PROJET DÉSOLÉ" :')

Et c'est en fait presque le problème que le Serverless permet de solutionner. 

### 20 Minutes

Aurélien nous a ensuite fait une présentation de la nouvelle architecture de 20 Minutes, qui au fil des années a su rester technologiquement innovante. 

Pour commencer, 20 Minutes est depuis 2013 disponible au moins en même temps en version numérique et en version papier. Ils prennent une première approche du serverless avec un bot pour converser sur Messenger en 2016, puis ils sont le premier média à intégrer Alexa en 2017 toujours en serverless. Ils utilisent depuis 2018 de l'IA et du machine learning pour permettre aux rédacteurs de se concentrer sur leur contenu plutot que d'avoir a gérer des tags et autres.

Aurélien nous a donc présenté le passage de leur frontend monolitique de 2013 fait avec : 
- Symfony (PHP)
- Mysql
- Apache

à quelque chose de serverless et fait à l'aide de microservices en 2018: 
- React (Javascript)
- GraphQl
- Amazon Aurora (base de données)

Voici un résumé du nouveau parcours "technique" de l'application pour une inscription utilisateur: 

L'utilisateur accède a l'app (statique) qui est sur un bucket (S3, le service de stockage d'Amazon), lorsqu’il s’inscrit la demande passe par API-Gateway (Gestion des calls de l'api AWS) qui déclanche une lambda (Cloud Function d'AWS), qui sauvegarde à son tour l'utilisateur dans Aurora.

Pour finir cette sauvegarde lance un événement qui permet d'éxécuter une autre lambda qui va écrire dans un SQS (Simple Queue Storage) pour envoyer la confirmation d'inscription à l'utilisateur.

![]({{site.baseurl}}/assets/2019-04-16-aws-summit-2019-retour-d-experience/20-minutes-frontend.jpg)


Conclusion le frontend est maintenant séparé en différentes briques interchangeable et est scalable en fonction de la demande des utilisateurs et tout ça a moindre coût.

Pour vous faire une idée, cette nouvelle architecture qui gère **plus de 22 Millions d'utilisateurs par mois**, en utilisant une **40aine de lambdas**,  avec **84 Millions d'invocations** par mois et **56ms** de temps de réponse, coûte environ **600€ par mois** ce qui semble vraiment peu à cette échelle.

### Amplify 

[Amplify](https://aws-amplify.github.io/docs/) est un outil CLI pour créer nos services plus rapidement, ajouter une authentification devient un jeu d'enfant : 
- amplify add auth

Amplify fournit aussi une librairie JS qui permet de se connecter (par exemple en Javascript) à tous nos services AWS, pour récupérer vos contenus sur vos Buckets ou autre. 

On peut aussi créer des CI ou déployer sur des environnements différents avec cet outils, je vous laisse regarder la deuxième partie du talk sur le site d'amazon pour voir la démo, elle vaut le coup ;). 

## Conclusion 

L'événement était vraiment super bien organisé, les talks étaient séparés par niveau de maitrise permettant d'éviter de se retrouver 45 minutes dans une conférence d'un niveau inaccessible en ayant raté le début d'une autre.

On a aussi pu y voir des événements intéractifs et concours autour du machine learning avec des courses de voitures qui devaient apprendre à faire un parcours ou encore des conférences sur de l'IoT dans des petites et grandes industries. 

Beaucoup de sujets sont couverts dans les ressources en début d'article.

Affaire à suivre pour l'édition de 2020 ! 