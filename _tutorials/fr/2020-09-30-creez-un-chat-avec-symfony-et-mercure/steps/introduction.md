---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: introduction
title: Introduction
---
## Qu'allons-nous faire ?

Mercure est un protocole permettant une communication client-server en temps réel. Utile par exemple pour envoyer des notifications, ou encore pour connaître en live le nombre d'articles restant dans un stock, sans jamais avoir besoin de recharger notre page.

Le but de ce tutoriel est de maîtriser le protocole Mercure. Pour cela, nous allons le combiner au framework Symfony pour créer un petit système de chat, en temps réel bien entendu.

C'est une suite à l'article de [découverte de Mercure]({BASE_URL}/fr/a-la-decouverte-de-mercure/), que vous retrouverez sur notre blog.

Voici les étapes que nous allons suivre au cours de ce tutoriel :
-   Initialisation du projet
-   Création des vues et de la logique de base
-   Envoi de messages
-   Configuration de Mercure
-   Discovery, abonnement et publication avec Mercure
-   Gestion de la sécurité avec Mercure
-   Conclusion

Si une partie ne vous intéresse pas ou ne vous paraît pas nécessaire, il vous sera toujours possible de l'ignorer et de vous rendre à la prochaine étape, dont vous pourrez récupérer l'état actuel du code sur une branche dédiée.
Le code source du projet est d'ailleurs disponible sur mon GitHub :
-   [Astrochat](https://github.com/ArthurJCQ/astrochat)


## Pré-requis

Pour les besoins de ce tutoriel il vous faudra :

- Avoir des bases en Symfony
- Avoir lu [notre article]({BASE_URL}/fr/a-la-decouverte-de-mercure/) pour connaître les bases de Mercure et de son fonctionnement
- Avoir [Docker](https://docs.docker.com/desktop/) et [docker-compose](https://docs.docker.com/compose/install/) d'installés sur votre PC

Tout sera expliqué pas à pas, mais vous pouvez tout de même vous accompagner de ces documentations pendant le tutoriel si quelque chose ne vous paraît pas clair :
-   [Documentation officielle de Mercure](https://mercure.rocks/docs)
-   [Documentation de Mercure dans Symfony](https://symfony.com/doc/current/mercure.html)

> Le tout est développé avec PHP 7.4
