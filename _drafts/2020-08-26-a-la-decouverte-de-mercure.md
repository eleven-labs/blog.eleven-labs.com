---
layout: post
title: À la découverte de Mercure
excerpt: Exploration du protocole Mercure. Vous n'aurez plus peur des communications client-server en temps réel à la fin du voyage.
permalink: /fr/a-la-decouverte-de-mercure/
authors:
    - ajacquemin
categories:
    - Mercure
tags:
    - Mercure
    - Server
    - Real-time
    - Javascript
    - Docker
---

[Mercure](https://mercure.rocks/) est un sérieux concurent aux classiques WebSockets et autres solutions similaires, car il tire parti de nombreuses nouveautés du Web (HTTP/2, SSE, ...) et est supporté nativement par la plupart des navigateurs.

![Logo de Mercure]({{ site.baseurl }}/assets/2020-08-26-a-la-decouverte-de-mercure/mercure_logo.png)

En clair, c'est un **protocole** qui permet d'envoyer des push updates vers tout client HTTP.

Par exemple, une ressource de votre API est mise à jour, et vous souhaitez que les navigateurs ou smartphones connectés à votre application reçoivent le changement sans avoir à requêter l'API. Le tout est possible en temps réel grâce à Mercure !

Ce protocole est publié en tant que [Internet Draft](https://datatracker.ietf.org/doc/draft-dunglas-mercure/) par Kévin Dunglas, il est donc encore jeune (le protocole, pas Kévin.. Enfin Kévin est encore jeune aussi mais...... Hum, bref).

Cependant, j'ai décidé de vous le présenter car il est déjà stable et parfaitement utilisable pour vos applications (et déjà utilisé en production sur de nombreux projets).

Vous êtes des adeptes de la nouveauté ? Férus de conquête spatiale ? Fans de Freddy Mercury ? Alors entrez dans la fusée, attachez vos ceintures et gardez vos rations lyophilisées à portée de main, on part à la découverte de Mercure.

## 1. A kind of magic
> Waw c'est magique !

C'est ce qui m'a traversé l'esprit la première fois que j'ai testé Mercure, tant c'est facile d'utilisation. Un magicien ne révèle habituellement pas ses secrets, mais vous m'avez l'air sympa, on va faire une exception.

Alors pour débuter la visite de Mercure, commencons par apprendre ensemble son langage...

Je vous présente tout d'abord le **Hub**, le serveur et le coeur de Mercure.
C'est vers lui que sont publiées les **Updates**, et lui qui s'occupe ensuite de les dispatcher à tous les clients s'étant abonnés aux ressources souhaitées.

Ces ressources sont définies par des **Topics**. Un topic représente une ressource, à laquelle on peut s'abonner, pour en recevoir les **Updates**.
C'est une bonne pratique d'identifier un **topic** par une URI complète, par exemple : *http://example.com/product/1* qui représente le produit d'ID 1.
Une **Update** est donc la version mise à jour d'un **topic**.

Enfin, on a les **Subscribers** (clients HTTP) et les **Publishers** (par exemple votre API), dont les termes parlent d'eux mêmes : les premiers s'abonnent au **Hub** Mercure, afin de récupérer les **Updates** de certains **topics**, publiés par ... Je vous le donne en mille... Les **Publishers**, exactement !

> Mercure utilise les SSE (Server Sent Events) pour pousser ses Updates

![Schéma du fonctionnement de Mercure]({{ site.baseurl }}/assets/2020-08-26-a-la-decouverte-de-mercure/mercure.png)


C'est bon, vous avez tout compris.. Plus qu'à mettre en pratique !


## 2. Mercure en pratique
La théorie ça va 5 minutes, mais je sens bien que vous trépignez d'impatience de tester par vous-même. Ça tombe bien, c'est maintenant !

Rien de tel qu'un petit exemple pour dompter la bête. Pour des besoins de reproduisibilité et de facilité, nous allons utiliser [l'image Docker de Mercure](https://hub.docker.com/r/dunglas/mercure).

```shell
docker run \
-e JWT_KEY='astronautsKey' -e ALLOW_ANONYMOUS=1 -e CORS_ALLOWED_ORIGINS='*' -e PUBLISH_ALLOWED_ORIGINS='http://localhost' \
-p 3000:80 -d \
dunglas/mercure
```

Plusieurs choses à décortiquer. Mercure peut prendre plusieurs variables d'environnement en entrée pour fonctionner, mais voici ici les plus importantes :
-   **JWT_KEY** : Ce paramètre est obligatoire. Les Publishers et Subscribers l'utilisent pour s'abonner et publier sur le Hub.
-   **ALLOW_ANONYMOUS** : Définit si les clients non authentifiés (sans JWT) peuvent s'abonner au Hub. On l'autorise pour l'exemple.
-   **CORS_ALLOWED_ORIGINS** : Définit les règles CORS du serveur Mercure. Pour l'exemple, nous autorisons les clients de tout domaine.
-   **PUBLISH_ALLOWED_ORIGINS** : Les domaines autorisés à publier des updates sur le Hub.

Et ... C'est tout ! Vous avez un serveur Mercure qui tourne sur votre machine. Rendez-vous sur votre [http://localhost:3000](http://localhost:3000) pour vérifier.


Connectez-vous sur [http://localhost:3000/.well-known/mercure](http://localhost:3000/.well-known/mercure). Bienvenue sur votre Hub ! Normalement, ce dernier vous affiche un petit message...

> Missing "topic" parameter

En effet, il s'attend à ce que vous lui précisiez sur quel topic vous souhaitez écouter les updates. Il suffit de rajouter ce paramètre dans l'URL du hub : [http://localhost:3000/.well-known/mercure?topic=http://example.com/message/1](http://localhost:3000/.well-known/mercure?topic=http://example.com/message/1).

Parfait, vous écoutez donc le topic *http://example.com/message/1*.

> Attention à ne pas confondre. Il ne s'agit pas à proprement parler d'une **URL** mais plutôt d'une **URI** (*Uniform Resource Identifier*), qui identifie une ressource. En soi vous pourriez mettre n'importe quel identifiant ici (e.g. juste `messages`, ou `message-1`, mais il est fortement conseillé de préférer indiquer une **URI**.)

Il est temps de publier une Update sur votre Hub Mercure pour voir ce qu'il se passe. Pour cela, nous simulerons notre Publisher avec [Postman](https://www.postman.com/downloads/).

Pour autoriser notre Publisher à pousser des Updates sur le Hub, nous devons générer un **JWT** (*Json Web Token*) .
Rendez-vous sur [jwt.io](https://jwt.io/).
Dans la partie Payload, insérer ce tableau :
```json
{
    "mercure": {
        "publish": ["*"]
    }
}
```
Cette configuration autorise à publier des updates **publiques**.
Enfin, dans dans la signature, remplacez le secret par la **JWT_KEY** que vous avez renseignée plus tôt dans la commande Docker (e.g. `astronautsKey`). Collez le JWT généré dans la partie autorisation de Postman.

La requête que nous allons faire est de type **POST**, sur l'addresse du hub : *http://localhost:3000/.well-known/mercure* .

Utilisez un body de type *x-www-form-urlencoded* pour les paramètres, qui sont les suivants :
-   **topic** : Ce paramètre est obligatoire, il identifie la resource à publier. Indiquez le même que celui sur lequel vous écoutez (e.g. *http://example.com/message/1*)
-   **data** : Le but, c'est d'envoyer une update. C'est dans le paramètre data que vous allez populer votre update avec les données souhaitées. Vous pouvez y mettre ce que vous voulez.

> Il existe d'autres paramètres optionnels possibles, que vous pourrez retrouver sur la [documentation officielle de Mercure](https://mercure.rocks/docs).

Gardez un oeil sur l'onglet de votre navigateur connecté au Hub, et lancez la requête.

Tadam ! Vous devriez voir un message apparaître. Bravo, vous avez envoyé votre première update avec Mercure.

> Si rien ne s'affiche, rafraichissez la page, et relancez votre requête, Si toujours rien ne s'affiche et que Postman ne vous renvoie pas l'identifiant de l'Update, vérifiez votre JWT.

Et voilà ! Amusez-vous à changer les topics, et savourez l'envoi d'update en temps réel.

## 3. Abonnez-vous à vos évènements
Avant de finir, je vais vous présenter comment on s'abonne très simplement au Hub de Mercure. Car nous venons de tricher en nous connectant directement au Hub, mais ce que nous souhaitons, c'est bel et bien s'y abonner depuis un vrai client HTTP !

Créez vous un simple fichier HTML, et insérez-y ce code dans une balise **script** :
```javascript
const url = new URL('http://localhost:3000/.well-known/mercure'); // URL de notre Hub Mercure
url.searchParams.append('topic', 'http://example.com/message/1'); // On ajoute les topics auxquels on souhaite s'abonner
url.searchParams.append('topic', 'http://example.com/message/{id}'); // Il est possible d'utilise un topicSlector avant de sélectionner plusieurs topics en même temps
const eventSource = new EventSource(url);

eventSource.onmessage = ({data}) => {
    console.log(data);
}
```

Comme vous pouvez le voir, on peut s'abonner à plusieurs topics, ce qui facilite bien des choses.

Mercure repose sur les SSE, on utilise donc l'API JavaScript **EventSource** pour écouter les updates qui nous sont envoyées. Ainsi, si vous postez encore une Update avec Postman, vous verrez dans votre console les `data` de cette Update qui s'affichent. A vous à présent d'imaginer une multitude de use cases !

## Conclusion

Voilà qui conclu un très rapide tour d'horizon de Mercure. Ce protocole est beaucoup plus complet qu'il n'y parait, et il y aurait beaucoup d'autres choses à dire, mais je n'en dévoilerai pas plus dans cet article d'introduction.

![GIF Keep your secrets]({{ site.baseurl }}/assets/2020-08-26-a-la-decouverte-de-mercure/keep_your_secrets.gif)

Cependant, un codelabs est prévu très bientôt pour approfondir tout ce qu'on a vu et découvrir pleins d'autres choses. Notamment comment sécuriser les connexions, utiliser Mercure dans une application Symfony, créer un chat minimaliste... Le tout sur la plateforme [Eleven's Codelabs](https://codelabs.eleven-labs.com/).

Je vous invite bien entendu à consulter la [documentation officielle de Mercure](https://mercure.rocks/docs) qui est extrêmement bien faite, afin de pousser votre exploration encore un peu plus loin.

Je vous souhaite de nombreuses et très belles aventures avec Mercure.
