---
layout: post
title: "Retour d'experience sur la mise en place du nouveau service Leroy Melin"
excerpt: "Eleven-labs depuis plus de deux ans à ouvert son studio. C'est dans ce dernier que nous mettons en place des projets web et mobile complet pour nos clients. En janvier 2018, Start le service innovation de Leroy Merlin nous a contacter pour mettre en place leurs site de dépannage express en partenaraita avec Bob dépannage."
authors:
    - captainjojo
lang: fr
permalink: /fr/rex-depannage-leroy-merlin/
categories:
    - graphql
    - react
    - aws
cover: /assets/2018-12-26-rex-depannage-leroy-merlin/cover.png
---

Eleven-labs depuis plus de deux ans à ouvert son studio. C'est dans ce dernier que nous mettons en place des projets web et mobile complet pour nos clients. En janvier 2018, **Start** le service innovation de Leroy Merlin nous a contacter pour mettre en place leurs site de dépannage express en partenaraita avec **Bob dépannage**.
Le plus du projet, c'est un client (partenaire) qui veux suivre la méthodologie Lean Startup et rélaliser un site très technique, pour cela il nous donne carte blanche dans nos choix technologiques. Revenons sur 9 mois de développements.

## Le scope

Le but du projet est de mettre Leroy Merlin sur le marché de ses concurents direct. Ici c'est Engi qui depuis quelques mois à lancé le site [https://www.mesdepanneurs.fr/](https://www.mesdepanneurs.fr/). Nous avons donc composé une équipe réduite de deux personnes pour mettre en place un site (mobile first) permettant de prendre un rendez vous avec un artisant dépanneur le plus rapidement possible. La relation avec les artisants se fera donc via un partenaire [https://www.bobdepannage.fr/](https://www.bobdepannage.fr/).

L'équipe sera donc composé d'un développeur Fullstack, d'un Lead dev/ Dev ops et d'un UX qui notre client.

## Reprendre l'existant

La première étape du projet fut de reprendre l'existant du projet. Une plateforme avait été développé durant l'année 2017, nous devions donc reprendre cela le plus rapidement possible, pour offrir à notre client de nouvelle fonctionnalité des le mois d'apres.

Pour nous permettre de reprendre très rapidement la platforme nous avons choisis de mettre en place une architecture serverless.

Nous avons donc créer une API Graphql permettant de communiquer avec un base de données Postgres. Le front quand à lui sera en React. Nous avosn choisi de travailler exclusivement dans le Cloud en utilisant le service AppEngine de Google Cloud.

15 jours de développement plus tard, nous avions un site ISO fonctionnel, serverless utilisant les technologies React/GraphQL avec la librairie ApolloJS en version 1 (Janvier 2018).

![Architecture Depannage]({{site.baseurl}}/assets/2018-12-26-rex-depannage-leroy-merlin/architecture.png)


Une fois cette architecture posé le développement des nouvelles fonctionnalités peuvent commencer. Nous utiliseront la methode Lean Startup que le client met en place en utilisant des outils d'analytiques comme Google Analytics, Hotjar ou d'AB testing. Vous pouvez lire l'article de Tiago notre client disponible [ici](https://medium.com/leroymerlin-tech-digital/backstage-of-a-new-service-created-for-leroy-merlin-france-ca81b15d51be).

## Développement Lean

Le développement en Lean Startup exige de pouvoir faire des virage technique très rapide. Nous avons donc eu besoin de nous équipé techniquement pour réussir à suivre une cadence de développement avec des nouvelles `features` chaques semaines.

Nous avons donc mis en place en premier un **design system** complet permettant d'utiliser des composant React générique rapidement dans le site. Nous avons choisi [storybook](https://storybook.js.org/) qui nous permet de prendre en compte les changements visuel proposer par le client simplement.

Le CI/CD est aussi un élément indispensable pour répondre rapidement aux besoins du Lean Startup. Nous avons donc mis en place une pipeline complète dans **Gitlab.ci** nous permettant de livrer en un clique les différentes applications.

Comme nous utilisons AppEngine un service de Google Cloud nous pouvons mettre en recette et en prodution plusieurs version du site disponible pour les utilisateurs. Cela nous offre la possibilité de montrer à nos utilisateurs des sites totalement différents de d'avoir très rapidement des data sur l'utilisation des nouvelles `features`. Vous pouvez avoir plus d'information sur APpEngine [ici](https://blog.eleven-labs.com/fr/google-cloud-platform-appengine-pour-vos-projets/).

Le choix de GraphQL peut paraitre complexe au premier abord pour une communication avec une base de données PostgreSQL. Mais le choix dans une architecture React dans un projet en Lean Startup cela permet de faire des changements visuels assez rapidement. Comme en GraphQL nous pouvons récupérer que les data dont nous avons besoin, la mise en place de nouveau composant ou l'a mise à jour des composants dèjà mis en place est devenu simple. Le plus est l'utilisation d'[ApolloJS](https://www.apollographql.com/) comme librairie de communication entre React et GraphQL, sa simplicité d'utilisation est vraiment parfaite.

Au fur et à mesure de l'évolution des fonctionnalités de l'application, GraphQL est vite devenu indispensable. Nous avons commencé par mettre en place un service de paiement, en utilisant [Stripe](https://stripe.com/fr) et son API Rest. Nous avons développé une surchouge GraphQL pour l'API Rest Stripe que nous avons déployé dans une Lambda AWS. Nous avons donc utilisé le principe du stiching GraphQL qui nous permet de récupere plusieurs schémas GraphQL externe et de les utiliser directement dans notre propre schémas. En quelque ligne de code nous avons pu intégrer le paiement dans l'application. Nous avons utilisé le même principe pour la mise en place de la connexion via [AWS Cognito](https://aws.amazon.com/fr/cognito/) et l'upload de fichier dans S3.

## Les désagréments

Comme tout projet sur des technologies innovantes nous avons eu des soucis.

Tout d'abord dans l'utilisation du Cloud, nous avions dans l'idée d'utiliser qu'un seul provider Cloud. Nous avons donc commencé le deployement dans AppEngine, puis nous voulions vers des `functions` Google cloud mais nous n'avions pas la possiblité de correctement gérer les environnement (Prod, Dev, Demo) cela posant trop de problèmatique nous avons choisis l'utilisation d'AWS et de Lambda. Nous avions donc finalement deux providers Cloud à maintenir.

Le plus gros souci est l'utilisation de la librairi ApolloJS. Lors du dévur du projet la version 1 nous a permis de mettre en place très rapidement un serveur GrapQL et un client React. Mais en Avril la version 2 est sorti et nous avons du revoir l'ensemble de notre stack. C'est l'un des soucis d'utilisés des nouvelles technologies c'est qu'il est obligatoire de prendre en compte le coût technique des changements de version. La mise à jour nous à pris 2 semaines de développement ce qui à bloqué les développements des nouvelles `features`.

React est une très bonne technologie pour réaliser une single page application, mais dans notre cas nous voulions avoir un SEO parfait, c'est de la que provient le traffic du site. La difficulté était donc de mettre en place un site React en [server side rendering](https://medium.freecodecamp.org/what-exactly-is-client-side-rendering-and-hows-it-different-from-server-side-rendering-bd5c786b340d). Comme nous utilitions Redux et AppoloJS la mise en place du SSR fut très compliqué. Mais en utilisant la nouvelle version d'ApolloJS la mise en place fut simplifié ce fut donc beaucoup plus pratique de mettre cela en place.

## Tooling

Durant l'ensemble du projet nous avions besoin de mettre en place du tooling soit pour améliorer la technique, soit pour suivre les data pour avancer dans le Learn Startup.

Le site étant en React il peut y a avoir de nombreuses erreurs Javascript sur les navigateurs des différentes utilisateurs. Nous avions besoin de connaitre les erreurs et de les suivre. Pour nous permettre ceci, nous avons utilisé [Sentry](https://sentry.io). Cette ouitls nous a permis de voir qu'il nous manquait des [Polyfill](https://blog.eleven-labs.com/fr/tutoriel-polyfill/) pour certain anciens navigateurs.

L'utilisation de serverless nous posait aussi des problèmes dans la récupération de logs. CloudWatch le service d'AWS ne nous permettait pas de faire des recherches facilement sur les logs. Nous avons donc mis en place [Logz](https://logz.io/) qui permet d'agréger les logs dans un ELK en Saas afin de nous permettre de comprendre plus rapidement les bugs potentiels.

L'un des principes du Lean Startup est de suivre des KPI au jours le jours selon l'évolution de l'application. Pour cela nous avons mis en place DataStudio qui permet de récupérer en temps réel l'ensemble des données nécessaire pour prendre les décision sur la suite des développements. Nous vous invitons à lire l'article de Tiago pour en savoir plus sur cette partie, il est disponible [ici](https://medium.com/leroymerlin-tech-digital/backstage-of-a-new-service-created-for-leroy-merlin-france-ca81b15d51be).

## Conclusion

En plus de 9 mois de développement, nous avons pu tester de nombreuses technologies innovantes que nous utilisons aujourd'hui chez de nombreux autres clients.

Le développement dans un contexte Lean Startup est diférent de nos habitudes. Il faut avoir de nombreux tooling nous permettant de répondre rapidement à un changement ou la mise en place d'une fonctionnalité.

Notre choix architectural nous parait aujourd'hui  parfait puisque depuis septembre nous n'avons plus eu besoin d'intervenir sur le site.

## Référence

- [https://depannage.leroymerlin.fr/](https://depannage.leroymerlin.fr/)
- [Google cloud platform appengine pour vos projets](https://blog.eleven-labs.com/fr/google-cloud-platform-appengine-pour-vos-projets/)
- [Backstage of a new service created on Leroy Merlin France](https://medium.com/leroymerlin-tech-digital/backstage-of-a-new-service-created-for-leroy-merlin-france-ca81b15d51be)
- [Tutoriel Polyfill](https://blog.eleven-labs.com/fr/tutoriel-polyfill/)
- [Tutoriel GraphQL](https://blog.eleven-labs.com/fr/graphql-kesako/)
- [Optimiser son application react](https://blog.eleven-labs.com/fr/optimiser-son-application-react/)
- [Migrer une application react client side en server side avec nextjs](https://blog.eleven-labs.com/fr/migrer-une-application-react-client-side-en-server-side-avec-nextjs/)