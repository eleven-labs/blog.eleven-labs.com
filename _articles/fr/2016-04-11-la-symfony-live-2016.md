---
contentType: article
lang: fr
date: '2016-04-11'
slug: la-symfony-live-2016
title: Le Symfony Live Paris 2016
excerpt: >-
  Cette année, Eleven Labs a, pour la troisième fois, sponsorisé le Symfony Live
  2016, qui s’est déroulé à la Cité Universitaire. Nous étions présents avec nos
  brand new Wilson Black Edition, notre borne d’arcade et nos astrobeers.
categories:
  - php
authors:
  - captainjojo
keywords:
  - symfony
  - tutorial
---

Cette année, Eleven Labs a, pour la troisième fois, sponsorisé le Symfony Live 2016, qui s’est déroulé à la Cité Universitaire. Nous étions présents avec nos brand new Wilson Black Edition, notre borne d’arcade et nos astrobeers.

![]({BASE_URL}/imgs/articles/2016-04-11-la-symfony-live-2016/astrobeer.jpg)
![]({BASE_URL}/imgs/articles/2016-04-11-la-symfony-live-2016/stand-eleven.jpg)
![]({BASE_URL}/imgs/articles/2016-04-11-la-symfony-live-2016/tomgregbox.jpg)

Après notre Storify de ce matin, voici un retour détaillé en mode live tweet de l’astronaute Captain Jojo !


Cette année, le Symfony Live Paris s'est déroulé à la Cité universitaire, un lieu d'exception pour une des meilleures conférences de l'année.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr"><a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> .. prêts :) <a href="https://t.co/6m7gWYENYs">pic.twitter.com/6m7gWYENYs</a></p>
<p>— Ronan Malek (@MalekArkana) <a href="https://twitter.com/MalekArkana/status/717957350104162304">7 avril 2016</a></p></blockquote>


### Tout commence par Fabien Potencier qui nous présente les répertoires de code monolithique.

<blockquote class="twitter-tweet"><p>La conférence <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> Paris 2016 a commencé avec le talk de <a href="https://twitter.com/fabpot">@fabpot</a> ! C'est parti pour 2 jours ! <a href="https://t.co/RgkjFe2tG7">pic.twitter.com/RgkjFe2tG7</a></p>
<p>— Symfony Live (@symfony_live) <a href="https://twitter.com/symfony_live/status/717978114043805696">7 avril 2016</a></p></blockquote>


La notion de répertoire monolithique est utilisée par Facebook et Google, qui pourtant ont des dizaines de gigas de données.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr"><a href="https://twitter.com/facebook">@facebook</a> un repo de 54gb ca doit être long à cloner. <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/717976210849079296">7 avril 2016</a></p></blockquote>

Les avantages de l'utilisation d'un seul répertoire pour un projet sont :


- la simplicité des codes review, comme le code de tous les applicatifs sont dans le même répertoire, une réfactorisation de classe peut se faire en une seule PR et beaucoup plus facilement avec un simple 'sed'
- il n'est plus nécessaire de gérer les dépendances internes, exemple le sdk et l'api du projet évoluent au même moment et seront à jour en même temps.


<blockquote class="twitter-tweet"><p>Ne plus avoir les dépendances internes dans <a href="https://twitter.com/hashtag/composer?src=hash">#composer</a> ça me paraît pas mal ! <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/717978379870408704">7 avril 2016</a></p></blockquote>

Mais comme le dit Fabien Potencier, le mieux est d'avoir les deux gestions de répertoire, avoir une gestion monolithique et avoir un répertoire par projet que l'on souhaite suivre. Le but étant de pouvoir partager des morceaux du projet sans avoir à donner l'ensemble du projet, cela est intéressant surtout lors de la réalisation de projet avec des prestataires externes.

La difficulté d'avoir cette gestion pour les répertoires, est de s'outiller pour suivre l'ensemble des projets. Durant la conférence, Fabien Potencier nous a montré comment il gère cet ensemble plutôt compliqué à l'aide de "git sub-tree" qui a du être recodé suite à des problèmes de lenteur d'exécution (jusqu'a 1 jour complet).

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Recoder git sub-tree pour splitter mon repo <a href="https://twitter.com/hashtag/github?src=hash">#github</a> c'est pas facile <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/717984691131957248">7 avril 2016</a></p></blockquote>

J'ai tout de même envie de tester ce mode de fonctionnement qui parait avoir plus d'avantages que la gestion actuelle.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/monolith-repositories-with-git)

### Le composant Guard

Jéremy, un Marseillais de Sensio, est venu nous parler d'un nouveau composant Guard, disponible depuis la version 2.8 de Symfony. La première chose est que le composant n'apporte aucune nouvelle fonctionnalité par rapport à l'authentification qui existe déjà dans Symfony.
La seule nouveauté est la gestion de l'authentification en une seule class, et non plus les trois ou quatre à mettre en place actuellement.

<blockquote class="twitter-tweet"><p>Guard ou l'authentification en une seul class <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a>. Moins casse tête qu'avant. <a href="https://twitter.com/Eleven_Labs">@Eleven_Labs</a> <a href="https://t.co/ajaHcQpVR9">pic.twitter.com/ajaHcQpVR9</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/717989825274585089">7 avril 2016</a></p></blockquote>


Lors de son talk, un exemple de code nous apporte une idée de l'utilisation beaucoup plus simple, je vous invite à tester le composant dans vos projets en Symfony 2.8.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/guard-dans-la-vraie-vie)

### La migration de Symfony 2.0 à 3.0 où comment faire une migration progressive.

La Fourchette est venue nous montrer comment mettre en place une migration progressive de leurs applications, la problématique étant de ne jamais avoir d'interruption de service.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Voilà comment faire une migration from scratch <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> , bientôt sur <a href="https://twitter.com/lemondefr">@lemondefr</a> <a href="https://t.co/k4Jk3YESfD">pic.twitter.com/k4Jk3YESfD</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718006558282682370">7 avril 2016</a></p></blockquote>


Pour réussir cette migration, ils sont partis sur une solution [ApiPlatform](https://api-platform.com/), qui leur permet de ne plus se concentrer sur la partie transmission des données, mais seulement sur le métier.


<Le code métier a d'abord été mis dans une LegacyBundle pour leur permettre de ne pas avoir d'interruption de service. Puis, les développeurs gèrent la synchronisation des données, pour cela ils n'ont pas choisi une migration unitaire car trop longue, mais plutôt une migration progressive qui récupère les données du legacy au fur et à mesure de l'utilisation de l'application.

<blockquote class="twitter-tweet"><p>Une migration c'est toujours lent plus d'un an de développement pour <a href="https://twitter.com/LaFourchetteMmm">@LaFourchetteMmm</a> <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/oWvY2MXlyC">pic.twitter.com/oWvY2MXlyC</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718010515738460160">7 avril 2016</a></p></blockquote>


Après un an de travail, il leur reste encore beaucoup de fonctionnalités à migrer mais l'architecture qu'ils ont mise en place leur permet d'être sereins.

Je trouve leur migration vraiment sympa, elle permet de vérifier les choix techniques à chaque instant et de ne pas fermer des services utilisateur.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/r2d2-to-bb8)

### Les fuites de mémoire en PHP

Le début du talk nous a permis de comprendre comment PHP opère la gestion de sa mémoire. Cela permet d'avoir une réflexion sur les problèmes liés à cette façon de faire et donc de réfléchir à notre code. L'exemple marquant est l'utilisation d'objet cyclique (A appelle B qui lui même utilise A), qui arrive à chaque fois à une fuite mémoire.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Très bonne explication des memory leak en <a href="https://twitter.com/hashtag/php?src=hash">#php</a> par <a href="https://twitter.com/BJacquemont">@BJacquemont</a> <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/xFJms9WrHQ">pic.twitter.com/xFJms9WrHQ</a></p>
<p>— Fabien Serny (@FabienSerny) <a href="https://twitter.com/FabienSerny/status/718016270520737792">7 avril 2016</a></p></blockquote>


Après cette explication, le speaker nous a montré l'utilisation de son outil phpmeminfo, on peut y trouver les fuites mémoire et surtout quel objet reste en mémoire. Cela peut permettre de débuger des problèmes de performances sur les scripts.

Le talk était très sympa, mais le speaker oublie que le choix de PHP n'est pas une obligation et que dans certain cas (comme un deamon), il vaut mieux choisir une autre technologie.

<blockquote class="twitter-tweet"><p><a href="https://twitter.com/hashtag/memory?src=hash">#memory</a> <a href="https://twitter.com/hashtag/leak?src=hash">#leak</a> c'est surtout pour les deamon mais pourquoi les faire en <a href="https://twitter.com/hashtag/php?src=hash">#php</a> ? <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/Tz8ERo2wtQ">pic.twitter.com/Tz8ERo2wtQ</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718013770950434816">7 avril 2016</a></p></blockquote>

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/php-meminfo-ou-la-chasse-aux-memory-leak)

### Retour d'expérience sur les microservices.

Le speaker vient nous expliquer la mise en place des microservices chez Auchan, il commence par présenter ce qu'est une architecture microservices.

> 1 microservice = 1 domaine métier = 1 composant applicatif

Il montre que l'architecture qu'il voulait mettre en place devait suivre le reactive manifesto disponible [ici](http://www.reactivemanifesto.org/fr) . En résumé c'est:

- responsive
- resilient
- elactic
- message driven

La première étape de son travail a été de mettre en place un message driven. Il a donc choisi RabbitMq, mais cela ne suivant pas le manifesto qui n'était ni elastic, ni résilent, ni responsive, il a donc choisi de reporter le problème et de faire une nouvelle architecture.

Tout d'abord il a choisi un format d'exchange entre les applicatifs, le canonical data (json).

Il est alors parti sur des applications full Symfony, qui contiennent chacune l'api (route + format d'echange) mais le code métier restait dans chaque applicatif. Il avait alors un seul code d'API compris dans un bundle partagé. Avec ce choix technique, il suivait le manifesto reactive, mais n'avait plus de message driven.

Il choisit donc de mettre seulement en prod un talend entre chaque appli qui permet d'avoir de l'asynchronisme. Pour les développeurs, il y a donc une transparence de l'asynchronisme qui permet d'avoir des environnements de dev plus simples.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Talend ESB + Symfony = ? application réactive ? <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/Aqc7nihoPy">pic.twitter.com/Aqc7nihoPy</a></p>
<p>— Fabien Gasser (@fabien_gasser) <a href="https://twitter.com/fabien_gasser/status/718062763793362944">7 avril 2016</a></p></blockquote>

Je ne suis pas fan de son architecture car elle ne contient qu'une seule technologie et non une réflexion plus globale, de plus l'utilisation d'un bundle commun entre chaque applicatif n'est pas microservices compiliant car cela créé une dépendance entre les services.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/retour-dexprience-reactive-architecture-et-microservices--comment-dcoupler-mes-applications)

### Le composant workflow.

Ce composant ne parle pas à grand monde, d'ailleurs peu de personnes l'utilisent car il n'est pas en production depuis longtemps.

<blockquote class="twitter-tweet"><p>Le composant Workflow, mais c'est quoi ? <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/2aC62jFuGQ">pic.twitter.com/2aC62jFuGQ</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718065203225706498">7 avril 2016</a></p></blockquote>


Le composant workflow est une machine à état ou machine de pétri. Il est développé par Fabien Potencier au début puis surtout par Grégoire Pineau qui l'a repris en main, il a essayé de suivre les spécifications de la machine de pétri.

Le composant permet de suivre le workflow d'un objet très facilement, il suffit de beaucoup de config et un peu d'implémentation pour les transitions.

Durant tout le talk, il donne l'exemple de la presse et la gestion du workflow de publication ce qui nous donne un vrai exemple d'utilisation de ce nouveau composant.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/le-reveil-du-workflow)

### Blablacar nous présente ElasticSearch

Le talk nous propose de comprendre comment Blablacar utilise ElasticSearch sur leur front.

On y retrouve un tutoriel de l'utilisation d'Elasticsearch avec de nombreux exemples concrets récupérés du site de Blablacar. Le talk fut assez court et manquait de préparation.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Et maintenant <a href="https://twitter.com/BlaBlaCarTech">@BlaBlaCarTech</a> nous explique leurs utilisations de <a href="https://twitter.com/Elasticsearch">@Elasticsearch</a> <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/ShuuhFjofc">pic.twitter.com/ShuuhFjofc</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718084231981830144">7 avril 2016</a></p></blockquote>


En bref un bon récapitulatif de la documentation Elasticsearch, dommage de ne pas être allé plus loin.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/elasticsearch-chez-blablacar)

### Performance au quotidien dans un environnement Symfony.

Certainement la meilleure présentation de la première journée de la Symfony Live, Xavier Leune est venu nous présenter la performance chez CCM Benchmark, le plus gros groupe de médias en termes de pages vues au monde.

Tout d'abord, il a choisi des métriques à suivre qui permettent d'avoir une ligne directrice lors de tout choix technique ou de développement.

Il a choisi alors le framework, Symfony n'avait pas les meilleures performances, au contraire il était dans les derniers, mais cela était surtout dû à Doctrine, CCM Benchmark avait envie de travailler avec Symfony car malgré de mauvaises performances, c'est un framework très suivi et qui a beaucoup d'autres avantages.

Il a donc codé leur propre ORM nommé [Ting](http://tech.ccmbg.com/ting/) qui a remis Symfony dans la course des performances.

Une fois le framework choisi, il donne plusieurs petits tips pour améliorer le cache Symfony telle que la mise en place du warm-up après la mise en production et pleins d'autres à revoir dans les slides.

Le dernier point de la présentation était la mise en place de Blackfire pour le suivi des performances pendant le développement, il explique comment mettre Blackfire dans notre CI, à chaque PR, il joue les scénarios Blackfire sur un environnement de test.

Cette présentation est à voir, elle permet de se familiariser avec la gestion de la performance dans un grand groupe média.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/performance-au-quotidien-dans-un-environnement-symfony)

### La confiance dans une entreprise.

Le fondateur d'OpenClassRoom vient présenter sa vision de la société d'aujourd'hui.

<blockquote class="twitter-tweet"><p>La <a href="https://twitter.com/hashtag/confiance?src=hash">#confiance</a> élément clé du travail en équipe. <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/ntVXMLCxVZ">pic.twitter.com/ntVXMLCxVZ</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718334302191284225">8 avril 2016</a></p></blockquote>

La présentation nous montre les défauts de la société d'aujourd'hui qui pense que nous sommes toujours à l'usine. Il commence par nous montrer ce qui ne va pas aujourd'hui.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">C'est pas <a href="https://twitter.com/hashtag/tolteque?src=hash">#tolteque</a> ? N'est ce pas <a href="https://twitter.com/ludowic">@ludowic</a> et <a href="https://twitter.com/mloliee">@mloliee</a>. <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/WBfZBMyUiF">pic.twitter.com/WBfZBMyUiF</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718337978565795840">8 avril 2016</a></p></blockquote>

Puis, nous explique ce qu'il a mis en place chez OpenClassRoom avec un historique très sympa du Site du zéro. On y voit des images d'il y a 10 ans et ça nous fait revenir dans le passé.

Il finit par de nombreux conseils de management tels que la transparence et la confiance. On n'est pas loin chez Eleven :)

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/pourquoi-se-faire-confiance)

### PSR6 ou le cache interface.

<blockquote class="twitter-tweet"><p>PSR-6 et le cache c'est pas mal ça <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718345799944560640">8 avril 2016</a></p></blockquote>

Nicolas Grekas est venu nous présenter l'un des derniers standards de la php-fig. Il explique que PSR6 est une norme qui tente d'uniformiser la gestion du cache. Le problème étant que cette norme est en 'brouillon' depuis plus de 3 ans et que personne n'arrive à se mettre d'accord.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">La gestion du cache une fonctionnalité difficile à uniformiser <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/1bzCMEC13Z">pic.twitter.com/1bzCMEC13Z</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718347350490669057">8 avril 2016</a></p></blockquote>

Le souci est que php-fig est un regroupement des gros frameworks du marché, ce n'est pas toujours représentatif des besoins métiers. C'est pour cela que l'un des développeurs du cache doctrine était assez mécontent en lisant la PSR6 car malgré le cache très poussé de Doctrine, celui-ci était loin de la nouvelle norme PSR6.

<blockquote class="twitter-tweet"><p>PSR-6 plein de problèmes pour <a href="https://twitter.com/guilhermeblanco">@guilhermeblanco</a> vu le nombre de tweets <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/EwGLIXwm4v">pic.twitter.com/EwGLIXwm4v</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718347952314544128">8 avril 2016</a></p></blockquote>

Nicolas Grekas nous montre alors comment Symfony a développé la mise en place de ce PSR6, il s'agit de deux interfaces à implémenter, une pour l'objet que l'on souhaite mettre en cache et la seconde pour le pool de cache (la technologie de cache).

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Premier code de la seconde journée du <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> pour la norme PSR-6 avec <a href="https://twitter.com/nicolasgrekas">@nicolasgrekas</a> <a href="https://t.co/RJvQF3eY0M">pic.twitter.com/RJvQF3eY0M</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718349709342089216">8 avril 2016</a></p></blockquote>

Pour l'instant, l'implémentation est simple, mais il reste beaucoup de travail donc toute aide est la bienvenue.
La présentation était sympa et permet de réfléchir sur la mise en place du cache ainsi que l'intérêt du PSR.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/psr-6--symfony-cache--de-la-perf-en-standard)

### La sécurité web par Blablacar.

La présentation était très parlante et permet de voir le nombre de failles possibles dans un site web. L'exemple parlant du champ hidden qui n'est pas correctement vérifié sur le serveur et permet d'avoir pleins de billets SNCF pour le prix d'un parait une évidence mais rappelle que la sécurité est une affaire du quotidien.

<blockquote class="twitter-tweet"><p>Et voilà un petit crawler fait par <a href="https://twitter.com/BlaBlaCarTech">@BlaBlaCarTech</a> grâce à <a href="https://twitter.com/fabpot">@fabpot</a> <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/wQm5QBrcgO">pic.twitter.com/wQm5QBrcgO</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718364085990137856">8 avril 2016</a></p></blockquote>


Il montre ensuite une succession de problèmes de sécurité courants, tels que les XSS, le CRSF TOKEN, le brut force, etc ....
Je vous invite à regarder les slides au plus vite, en espérant qu'ils soient disponibles.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/scurit-web-pirater-pour-mieux-protger)

### Doctrine 2

Cette présentation ne partait pas gagnante, je ne suis pas fan de Doctrine et même contre beaucoup d'ORM.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Une petite présentation sur <a href="https://twitter.com/hashtag/doctrine?src=hash">#doctrine</a>, pas sur de changer d'avis sur l'outil !!! <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/IOYTNuNw4n">pic.twitter.com/IOYTNuNw4n</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718372581284442112">8 avril 2016</a></p></blockquote>

Les speakers nous ont présenté plusieurs cas d'utilisation. Doctrine ne permet pas de gérer nativement de IFNOTNUL, il faut donc coder un adaptateur.

<blockquote class="twitter-tweet"><p>Ça commence mal !! Trop de code pour faire un Ifnull natif en <a href="https://twitter.com/hashtag/mysql?src=hash">#mysql</a> avec <a href="https://twitter.com/hashtag/doctrine?src=hash">#doctrine</a> <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/TkST4bqZha">pic.twitter.com/TkST4bqZha</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718373491104489472">8 avril 2016</a></p></blockquote>

Durant tout le talk, les présentateurs parlent des problématiques rencontrées avec Doctrine et comment faire pour y répondre. Mais comme d'habitude, on y retrouve une succession de code magique, qui n'invite pas à l'utilisation de Doctrine.
Je repars dans le même état d'esprit qu'en arrivant : je n'ai aucune envie d'utiliser Doctrine.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Pas de changement d'avis sur <a href="https://twitter.com/hashtag/doctrine?src=hash">#doctrine</a> trop de code pour faire des requêtes <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/25Mna0ppTz">pic.twitter.com/25Mna0ppTz</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718380797800132609">8 avril 2016</a></p></blockquote>

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/aller-plus-loin-avec-doctrine2)

### Le composant d'expression langage.

La présentation était très métier, je n'ai presque rien noté. La seule chose que j'ai comprise est que l'utilisation du composant d'expression langage était très simple d'utilisation.

C'est ce genre de présentation très métier qui sans notion de ce dernier, me pose problème et m'ennuie dans les conférences. Heureusement, une session de live coding m'a permis de ne pas m'endormir.

<blockquote class="twitter-tweet"><p>Une petit session de <a href="https://twitter.com/hashtag/livecoding?src=hash">#livecoding</a> au <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> sur le composant <a href="https://twitter.com/hashtag/expression?src=hash">#expression</a>-language. <a href="https://twitter.com/hashtag/bravo?src=hash">#bravo</a> <a href="https://t.co/c14TmoOirn">pic.twitter.com/c14TmoOirn</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718418419448721409">8 avril 2016</a></p></blockquote>

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/refondre-un-moteur-de-rgles-avec-lexpression-language-de-symfony2)

### Sécurité et HTTP

Romain Neutron était là pour nous expliquer comment fonctionnent les headers http de sécurité. Il nous a montré les bases d'un serveur sécurisé avec les headers tels que xss-protection, frame-options, content-type-option, ainsi que la configuration sécurisée d'un nginx.

<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Voilà ma nouvelle config de header dans mon nginx, merci <a href="https://twitter.com/romainneutron">@romainneutron</a> <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/HcuXPdk3yj">pic.twitter.com/HcuXPdk3yj</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718424507279667200">8 avril 2016</a></p></blockquote>

La suite de la présentation était sur les content-security-policy, qui permettent d'identifier les contenus de son site. La conférence était très complète et nous donnait de bonnes idées à mettre en place sur nos serveurs de prod.

<blockquote class="twitter-tweet"><p>Une bonne solution pour sécurisé mon site avec les content-security-policy <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> avec <a href="https://twitter.com/romainneutron">@romainneutron</a> <a href="https://t.co/FjJORu3ZIG">pic.twitter.com/FjJORu3ZIG</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718428864758816768">8 avril 2016</a></p></blockquote>

L'utilisation du [nelmio/NelmioSecurityBundle](https://github.com/nelmio/NelmioSecurityBundle) permet de faire une migration en douceur des headers et donc de la sécurisation de vos applications.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/scurit-et-http)

### Les applications cloud native

Le speaker était "fou", il parlait très vite et se perdait parfois dans ses explications. Mais ce qu'il faut retenir, c'est que applications cloud natives ne veulent pas dire applications sur des serveur cloud, il suffit de suivre des règles d'architecture :

- avoir un CDN
- avoir un proxy cache
- les applications n'ont pas connaissance du serveur où elles sont déployées
- avoir un message driven


<blockquote class="twitter-tweet">
<p dir="ltr" lang="fr">Trop bien j'ai un CDN donc je fait du micro-service <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/xarYh2oZrX">pic.twitter.com/xarYh2oZrX</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718444803374063621">8 avril 2016</a></p></blockquote>

La présentation était très intéressante mais manquait d'une ligne directrice.

[Les slides et les avis](https://joind.in/event/symfonylive-paris-2016/construire-des-applications-cloud-natives)

### Conclusion

La conférence était un vrai succès et merci à tous les conférenciers pour la qualité de leurs présentations. J'ai appris beaucoup de choses et repars avec de nombreuses idées de veille.

<blockquote class="twitter-tweet"><p>Merci <a href="https://twitter.com/symfony">@symfony</a> pour ce <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> sympa. Vivement les <a href="https://twitter.com/symfonycon">@symfonycon</a> <a href="https://t.co/UtSTMnm2iO">pic.twitter.com/UtSTMnm2iO</a></p>
<p>— Jonathan (@CaptainJojo42) <a href="https://twitter.com/CaptainJojo42/status/718451424892465152">8 avril 2016</a></p></blockquote>

Je vous invite à voir l'ensemble des slides et à poser vos questions en commentaire de ce post.

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
