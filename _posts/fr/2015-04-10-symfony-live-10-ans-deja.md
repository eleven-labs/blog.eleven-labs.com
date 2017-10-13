---
layout: post
title: Symfony Live, 10 ans déjà !
lang: fr
permalink: /fr/symfony-live-10-ans-deja/
excerpt: "Le Symfony Live est une journée de conférences autour du framework Symfony. Les conférences présentées sont d'un bon niveau technique. Il y a également des retours d'expériences, sur des cas concrets et avec des problématiques que l'on peut rencontrer au quotidien."
authors:
 - tthuon
date: '2015-04-10 12:33:59 +0200'
date_gmt: '2015-04-10 10:33:59 +0200'
categories:
- Symfony
tags:
- conférence
- symfony live
---

Symfony Live, 10 ans déjà !
===========================

Présentation
============

Le Symfony Live est une journée de conférences autour du framework Symfony. Les conférences présentées sont d'un bon niveau technique. Il y a également des retours d'expériences, sur des cas concrets et avec des problématiques que l'on peut rencontrer au quotidien.

Déroulement de la journée
=========================

La journée était rythmée par des conférences de 40 min et de 10 min, sur des thèmes divers et variés. La cadence était assez soutenue, il fallait s'accrocher : 17 au total.

[Planning des présentations](http://paris2015.live.symfony.com/speakers, "Planning des présentations")

Cette journée s'est passée à Paris à la Cité Universitaire.

> En direct des [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) ! [pic.twitter.com/FF8J9DWZzX](http://t.co/FF8J9DWZzX)
>
> — SmartyBoy (@CptSmartyBoy) [April 9, 2015](https://twitter.com/CptSmartyBoy/status/586110067675639808)

Je vais parler des conférences que j'ai le plus appréciées.

Ouverture de la journée
=======================

> [\#symfony](https://twitter.com/hashtag/symfony?src=hash) déjà 10 ans ! [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/rElZII1jMj](http://t.co/rElZII1jMj)
>
> — Mickael Lapeyre (@ckimn) [April 9, 2015](https://twitter.com/ckimn/status/586075241002246144)

La matinée commence par un discours d'ouverture par [Fabien Potencier](https://twitter.com/fabpot). Un peu "freestyle", il n'a pas de support de présentation. Il revient sur l'origine du framework, son historique.

Il a parlé de l'origine du **"f"** de Symfony. Et oui, pourquoi "f" et non "ph". La raison était simple, parce que toutes ses classes commençaient par "Sf", qui est la contraction de "Sensio Framework". Pour éviter de renommer tous les namespaces, il a conservé "Sf" et cherché un nom qui pouvait correspondre à cette abréviation. Comme quoi, les développeurs sont paresseux, mais efficaces :).

Et pourquoi Symfony est open-source ? Au début, le framework était encore à l'état de prototype. Pour leur premier projet, ils ont réalisé un site d'e-commerce de lingerie. À la fin du projet, ils n'ont pas été payés, ils ont mis le framework en open-source. Quitte à ne pas être payé, autant le laisser à la communauté :).

Le premier commit de Symfony 1 était le 15 octobre 2005.

Pourquoi symfony 1 n'a pas continué vers une version 1.5 ? Tout simplement parce qu'il y avait un important couplage entre les composants, que l'évolutivité du framework était limitée. Pour cela, il y a eu une cassure de la compatibilité et montée en version majeure : Symfony 2.

Qu'en est-il de la version 3.0 ? Et bien pas beaucoup de surprise, il s'agit de la version 2.7 sans la rétro-compatibilité sur les version précédente. Ce sera la nouvelle version LTS (LTS pour Long Term Support).

Selon la roadmap (<http://symfony.com/roadmap>) Symfony 3.0 va sortir fin novembre 2015.

Il nous a parlé de PSR-7. La nouvelle spécification pour l'implémentation des interfaces HTTP.

Selon lui, c'est une erreur et une perte de temps de travailler sur une interface pour HTTP. Sachant que HTTP est simple, il n'existe pas plusieurs implémentation mais une seule.

Ce point de vue est intéressant. Sachant qu'HTTP a déjà sa spécification : RFC2616.

Autre annonce très intéressante, les SymfonyCon seront les **3 et 4 decembre**. 2 jours de conférences internationales et tout ça dans une grande salle : les Folies Bergère.

Cette ouverture était simple, conviviale, tout le monde pouvait poser ses questions sur Twitter. D'ailleurs, j'en ai posé une concernant la certification. Elle sera mise à jour en même temps que la publication de Symfony 3.0.

### HTTP Caching

> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) "Going crazy with http caching : caching content for authenticated users" [pic.twitter.com/Q5UNQquVRR](http://t.co/Q5UNQquVRR)
>
> — Julien Lechevanton (@jlechevanton) [April 9, 2015](https://twitter.com/jlechevanton/status/586085249387515904)

Un des sujets complexes dans le monde du web : la mise en cache des ressources. Cette conférence s'est axée sur une problématique que tout le monde rencontre : comment mettre en cache des ressources spécifiques à un groupe d'utilisateur ?

La réponse avec FosHttpCache et le contexte utilisateur. Cette conférence a été présentée par David Buchman ([@dbu](https://twitter.com/dbu)) et Jérôme Vieilledent ([@jvieilledent](https://twitter.com/jvieilledent)).

Au début, il y a eu une présentation succincte du cache http, puis de varnish et de quelques bonnes pratiques sur la mise en cache. Le plus intéressant reste la RFC2616.

Pour répondre à la problèmatique, la librairie va générer un hash spécifique à la ressource et lié à un groupe spécifique d'utilisateur. Ce hash est inséré dans la requête dans un en-tête personnalisé. Cet en-tête est ajouté dans l'en-tête "Vary" pour que la mise en cache se fasse en fonction de cet en-tête. Par exemple, tous les utilisateurs du rôle "ROLE\_USER\_BO" auront la même ressource mise en cache et servie par varnish. Cet exemple peut s'appliquer pour des pages du backoffice qui n'ont aucun lien avec l'utilisateur mais qui sont liées à un groupe d'utilisateurs.

[FosHttpCache User Context](http://foshttpcache.readthedocs.org/en/latest/user-context.html)

Pour illustrer l'exemple, une petite mise en scène d'une requête HTTP.

> Http version humaine ^\_^ [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/GJ150f2iSs](http://t.co/GJ150f2iSs)
>
> — Thierry Piaf (@piaf\_) [April 9, 2015](https://twitter.com/piaf_/status/586094748198428672)

Stack ELK
=========

Présenté par [Olivier Dolbeau](https://twitter.com/odolbeau), elle nous a fait découvrir un moyen de mieux visialiser les logs. ELK pour ElasticSearch Logstash Kibana. Cet écosystème fonctionne à merveille. Les logs applicatifs et systèmes sont envoyés à Logstash. Elles sont ensuite stockeés dans ElasticSearch. Avec Kibana, la création des tableaux permet de visualiser et d'être rapidement alerté sur un problème.

> Avec [@odolbeau](https://twitter.com/odolbeau), on part à la chasse aux logs ! [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/QZk71pDIKh](http://t.co/QZk71pDIKh)
>
> — Les-Tilleuls.coop (@coopTilleuls) [April 9, 2015](https://twitter.com/coopTilleuls/status/586100702797295616)

Encore faut-il bien formater ses logs. Une des astuces est d'utiliser les variables de contexte de Monolog. Cela permet d'avoir des messages de logs génériques et de filtrer plus facilement dans kibana.

Par contre, un des désavantages de Kibana, c'est la création du tableau qui peut prendre du temps.

En terme de volume de log chez BlaBlaCar, il y a 110Go de log journalier.

Lien vers la présentation: [Laisse pas traîner ton log !](https://speakerdeck.com/odolbeau/logs-hunting)

> Blablacar, c'est 110 Go de log par jour O\_o [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
>
> — Bastien Picharles (@Kleinast) [April 9, 2015](https://twitter.com/Kleinast/status/586103060533010432)

Mediapart, le changement c'est maintenant
=========================================

Ce qui était intéressant dans la présentation, c'est leur prise de décision radicale. A un moment, quand tout par "en sucette", il faut savoir dire **"stop"** et faire table rase du passé pour repartir sur de nouvelles bases. Cette décision n'est pas facile. Comme lors de la transition Symfony 1 vers Symfony 2. Mais elle peut être un bon moyen pour redonner du souffle à un projet.

Pattern View Model
==================

Romain Kuzniak a déjà présenté une conférence complète sur les différentes architectures d'applicatives lors d'un [précédent SfPot](http://afsy.fr/blog/meetup-de-decembre-a-paris).

Ici, il a exposé le patron "Vue-Model". La problématique est que la vue a besoin de données en provenance de plusieurs sources : par exemple en provenance de plusieurs tables sql ou service. Chaque vue est donc spécifique et il est difficile de l'adapter.

Pour résoudre cela, il faut ajouter une couche d'abstraction : un assembleur. Il va permettre d'agréger les données de plusieurs sources pour la transmettre à la vue. Ainsi, la vue n'utilise plus que les données de l'assembleur, et non des données brutes. Il n'y a plus de logique dans la vue, ni dans le contrôleur. Tout est dans l'assembleur.

Lien vers la présentation: [OpenClassrooms - Le pattern View Model avec Symfony2](http://fr.slideshare.net/RomainKuzniak/le-pattern-view-model-avec-symfony2)

Pause déjeuner
==============

Après cette grosse matinée, il se faisait faim ^^. Il y a eu un grand buffet.

> Manger ! :-D [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/p7dGg1p2vp](http://t.co/p7dGg1p2vp)
>
> — Matthieu Moquet (@MattKetmo) [April 9, 2015](https://twitter.com/MattKetmo/status/586116887270072321)

Meetic et la migration du backend
=================================

Meetic nous a présenté la façon dont ils ont migré leur backend. Une des problématiques que l'on va rencontrer dans toutes les applications un peu ancienne : c'est leur base. Elle est monolithique. Tout est centré autour d'un coeur unique. Au fur et à mesure des ajouts de fonctionnalités, le code devient de plus en plus complexe, bienvenue au "code spaghetti".

La probabilité de rencontrer un bug est d'autant plus grande qu'il faut maintenir ce code. Sachant que le coût d'un bug est exponentiel est fonction du stade de la fonctionnalité (développement, code review, test, déploiement en intégration, puis en production), il vaut mieux le maîtriser en amont.

> [@MeeticTech](https://twitter.com/MeeticTech) Bug Cost [\#Coding](https://twitter.com/hashtag/Coding?src=hash) [\#UnitTest](https://twitter.com/hashtag/UnitTest?src=hash) [\#FunctionalTest](https://twitter.com/hashtag/FunctionalTest?src=hash) [\#FunctionalTest](https://twitter.com/hashtag/FunctionalTest?src=hash) [\#SystemTest](https://twitter.com/hashtag/SystemTest?src=hash) [\#AfterRelease](https://twitter.com/hashtag/AfterRelease?src=hash) au [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/1ZQW69vbYo](http://t.co/1ZQW69vbYo)
>
> — LinkValue (@LinkValue) [April 9, 2015](https://twitter.com/LinkValue/status/586138108414058496)

Pour répondre à leur problématique, ils vont migrer vers une architecture orientée service avec une API. Puis ensuite, ils ont migré progressivement les briques fonctionnelles.

En ce qui concerne les tests, ils ont utilisé docker pour lancer des tests automatisés en local. Chaque nouvelle branche est testée en amont, puis via Jenkins et après le merge de la fonctionnalité.

> Une très belle utilisation de docker chez Meetic : le testing [@MeeticTech](https://twitter.com/MeeticTech) [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/CWJw5BuKNM](http://t.co/CWJw5BuKNM)
>
> — CARIOU Pierre-Yves (@pycariou) [April 9, 2015](https://twitter.com/pycariou/status/586139102933884929)

Lien vers la présentation: [Meetic backend mutation with Symfony](http://www.slideshare.net/meeticTech/meetic-backend-mutation-with-symfony)

Surveillez votre prod
=====================

On a vu dans une précédente présentation comment partir à la chasse au log. Ce qui était intéressant ici, c'est comment rendre les logs intéressants et pertinents. Il faut utiliser les variables de contexte bien sur. Mais il est possible de faire plus.

Avec Monolog, il est possible d'ajouter des "channel". Cela permet de regrouper les messages de log par "groupe" ou "thème". Comme "assetic", "doctrine", "event", "rabbitmq".

Autre point, avec les processeurs, il est possible d'enrichir les logs avec des données supplémentaires. Par exemple, on peut ajouter la version du framework et l'ip du serveur.

Avec ces différents outils, le log devient plus intéressant, et l'on devient "pro-actif" lorsque qu'il y a un pic anormal d'erreur.

Lien vers la présentation: [Faites plaisir à vos utilisateurs : surveillez votre prod](https://speakerdeck.com/lyrixx/symfony-live-2015-paris-monitorer-sa-prod)

### VarDumper

var\_dump est mort ! Vive VarDumper ! Il est [enfin sorti](https://speakerdeck.com/nicolasgrekas/debug-plus-symfony) !

Présenté par [Nicolas Grekas](https://github.com/nicolas-grekas), ce composant permet de débuguer plus facilement le contenu de ses variables. Certes, il y a var\_dump. Mais pour dumper une entité doctrine, c'est moins rigolo.

Avec VarDumper, il n'y a que les données essentielles et même des informations supplémentaires. Avec var\_dump, il est impossible de savoir si la valeur d'une clef d'un array est une référence ou non. VarDumper le permet.

> Petite démo de VarDumper [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/fFKBTfaYD4](http://t.co/fFKBTfaYD4)
>
> — Thierry Piaf (@piaf\_) [April 9, 2015](https://twitter.com/piaf_/status/586154149756145666)

Lien vers la présentation: [Symfony Debug et VarDumper, ou comment debugger comfortablement](http://fr.slideshare.net/nicolas.grekas/symfony-debug-vardumper)

Docker et l'intégration continue
================================

Meetic l'a utilisé, cette présentation est rentrée plus en détail sur l'utilisation des conteneurs Docker.

La problématique est la suivante: comment passer d'un projet à l'autre sans devoir réinstaller et reconfigurer toute une stack applicative (LAMP par exemple) ?

[Jérémy Derussé](https://github.com/jderusse) nous propose une solution à base de conteneur Docker.

La philosophie de Docker est l'isolation des processus. Il se base sur le système d'exploitation de la machine hôte. Il ne virtualise pas un OS au dessus de l'OS hôte. Ce qui le rend très léger.

Avec Docker, il est possible de créer des boites à outils génériques. Par exemple, le docker jolicode/phaudit contient un ensemble d'outil pour auditer le code PHP.

Si une application utilise un service tiers, comme un LDAP ou un serveur mail, un conteneur docker peut faire le travail. C'est une sorte de bouchon local.

Astuce: Docker permet de paralléliser les tests unitaires.

> Accélérer vos tests en préchargeant les données dans son docker et recréation de la bdd plutôt que de recharger les fixtures [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
>
> — Loïck P. (@pyrech) [April 9, 2015](https://twitter.com/pyrech/status/586197127463890944)

Et surtout, "penser docker".

API et Admin en 10 min
======================

Cette présentation, par [Jonathan Petitcolas](http://www.jonathan-petitcolas.com/) était impressionnante par son efficacité. D'un côté, la création de l'API avec le model. De l'autre le front avec ng-admin. Le tout s'assemble parfaitement et le rendu est bien sympa.

> Ng-admin c'est un peu le générateur d'administration pour une API [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
>
> — Thierry Piaf (@piaf\_) [April 9, 2015](https://twitter.com/piaf_/status/586200815934840832)

Lien vers une ressource: [Create a JavaScript Admin Panel and a REST API for Symfony2 Apps in Minutes](http://marmelab.com/blog/2015/02/24/ngadmingeneratorbundle-create-javascript-admin-panel-rest-api-symfony2-in-minutes.html)

Pour conclure
=============

Cette journée a été riche en conférences, en partage de connaissances, en participants (750 participants) et en soleil.

Les deux annonces à retenir sont :
*Symfony 3.0 en novembre
* SymfonyCon en décembre aux Folies Bergère

Ce que je remarque cette année, c’est le changement d’architecture. Parmi les retour d’expériences, il y a eu deux migrations vers des stack API-centric. Le web évolue, et n’est pas uniquement centré sur un écran, mais plusieurs écrans (mobile, tablette, TV connectée, ...).

Autre point important, la démarche qualité avec l’intégration continue, Jenkins et Docker. Avec Docker, c’est magique et ça ne pourrit pas la machine hôte. Il y a également la méthodologie qui influe sur la qualité, notamment avec Scrum. Mediapart l’a bien souligné, un développeur c’est fragile, il faut le protéger.

Et surtout,

> Symfony, une grande famille ! [@fabpot](https://twitter.com/fabpot) [@Eleven\_Wilson](https://twitter.com/Eleven_Wilson) [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash) [pic.twitter.com/lJXsusdTIy](http://t.co/lJXsusdTIy)
>
> — Eleven Labs (@Eleven\_Labs) [April 9, 2015](https://twitter.com/Eleven_Labs/status/586143926094012416)

Bon anniversaire Symfony !

Lien vers toutes les présentations: [Symfony Live Paris 2015](https://github.com/clem/sflive-paris-2015)
