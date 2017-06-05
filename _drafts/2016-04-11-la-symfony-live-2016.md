--- layout: post title: Le Symfony Live Paris 2016 author: jonathan
date: '2016-04-11 17:42:12 +0200' date\_gmt: '2016-04-11 15:42:12 +0200'
categories: - Symfony tags: - doctrine - symfony2 - RabbitMQ -
conférence - symfony live - architecture - microservice - psr6 -
composant - guard - migration - sécurité - http --- {% raw %}

Cette année, Eleven Labs a, pour la troisième fois, sponsorisé le
Symfony Live 2016, qui s’est déroulé à la Cité Universitaire. Nous
étions présents avec nos brand new Wilson Black Edition, notre borne
d’arcade et nos astrobeers.

[\
](http://blog.eleven-labs.com/wp-content/uploads/2016/04/Astrobeer.jpg)[\
](http://blog.eleven-labs.com/wp-content/uploads/2016/04/stand-eleven.jpg)[![tomgregbox](http://blog.eleven-labs.com/wp-content/uploads/2016/04/tomgregbox-200x300.jpg){.alignnone
.wp-image-1710 width="121"
height="181"}](http://blog.eleven-labs.com/wp-content/uploads/2016/04/tomgregbox.jpg)
[![stand
eleven](http://blog.eleven-labs.com/wp-content/uploads/2016/04/stand-eleven-300x169.jpg){.alignnone
.wp-image-1708 width="275"
height="155"}](http://blog.eleven-labs.com/wp-content/uploads/2016/04/stand-eleven.jpg)[![Astrobeer](http://blog.eleven-labs.com/wp-content/uploads/2016/04/Astrobeer-225x300.jpg){.alignnone
.wp-image-1709 width="130"
height="174"}](http://blog.eleven-labs.com/wp-content/uploads/2016/04/Astrobeer.jpg)

Après notre Storify de ce matin, voici un retour détaillé en mode live
tweet de l’astronaute Captain Jojo !

 

 

Cette année, le Symfony Live Paris s'est déroulé à la Cité
universitaire, un lieu d'exception pour une des meilleures conférences
de l'année.

> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> .. prêts :) [pic.twitter.com/6m7gWYENYs](https://t.co/6m7gWYENYs)
>
> — Ronan Malek (@MalekArkana) [7 avril
> 2016](https://twitter.com/MalekArkana/status/717957350104162304)

#### [Tout commence par Fabien Potencier qui nous présente les répertoires de code monolithique.]{style="line-height: 1.5"}

> La conférence
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> Paris 2016 a commencé avec le talk de
> [@fabpot](https://twitter.com/fabpot) ! C'est parti pour 2 jours !
> [pic.twitter.com/RgkjFe2tG7](https://t.co/RgkjFe2tG7)
>
> — Symfony Live (@symfony\_live) [7 avril
> 2016](https://twitter.com/symfony_live/status/717978114043805696)

La notion de répertoire monolithique est utilisée par Facebook et
Google, qui pourtant ont des dizaines de gigas de données.

> [@facebook](https://twitter.com/facebook) un repo de 54gb ca doit être
> long à cloner.
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/717976210849079296)

Les avantages de l'utilisation d'un seul répertoire pour un projet sont
:

-   la simplicité des codes review, comme le code de tous les
    applicatifs sont dans le même répertoire, une réfactorisation de
    classe peut se faire en une seule PR et beaucoup plus facilement
    avec un simple 'sed'
-   il n'est plus nécessaire de gérer les dépendances internes, exemple
    le sdk et l'api du projet évoluent au même moment et seront à jour
    en même temps.

> Ne plus avoir les dépendances internes dans
> [\#composer](https://twitter.com/hashtag/composer?src=hash) ça me
> paraît pas mal !
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/717978379870408704)

Mais comme le dit Fabien Potencier, le mieux est d'avoir les deux
gestions de répertoire, avoir une gestion monolithique et avoir un
répertoire par projet que l'on souhaite suivre. Le but étant de pouvoir
partager des morceaux du projet sans avoir à donner l'ensemble du
projet, cela est intéressant surtout lors de la réalisation de
projet avec des prestataires externes.

La difficulté d'avoir cette gestion pour les répertoires, est de
s'outiller pour suivre l'ensemble des projets. Durant la conférence,
Fabien Potencier nous a montré comment il gère cet ensemble plutôt
compliqué à l'aide de "git sub-tree" qui a du être recodé suite à des
problèmes de lenteur d'exécution (jusqu'a 1 jour complet).

 

> Recoder git sub-tree pour splitter mon repo
> [\#github](https://twitter.com/hashtag/github?src=hash) c'est pas
> facile
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/717984691131957248)

 

J'ai tout de même envie de tester ce mode de fonctionnement qui parait
avoir plus d'avantages que la gestion actuelle.

[Les slides et les
avis.](https://joind.in/event/symfonylive-paris-2016/monolith-repositories-with-git)

#### Le composant Guard

Jéremy, un Marseillais de Sensio, est venu nous parler d'un nouveau
composant Guard, disponible depuis la version 2.8 de Symfony. La
première chose est que le composant n'apporte aucune nouvelle
fonctionnalité par rapport à l'authentification qui existe déjà dans
Symfony.

La seule nouveauté est la gestion de l'authentification en une seule
class, et non plus les trois ou quatre à mettre en place actuellement.

 

> Guard ou l'authentification en une seul class
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash).
> Moins casse tête qu'avant.
> [@Eleven\_Labs](https://twitter.com/Eleven_Labs)
> [pic.twitter.com/ajaHcQpVR9](https://t.co/ajaHcQpVR9)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/717989825274585089)

Lors de son talk, un exemple de code nous apporte une idée de
l'utilisation beaucoup plus simple, je vous invite à tester le composant
dans vos projets en Symfony 2.8.

[Les slides et les
avis](https://joind.in/event/symfonylive-paris-2016/guard-dans-la-vraie-vie)

#### La migration de Symfony 2.0 à 3.0 où comment faire une migration progressive.

La Fourchette est venue nous montrer comment mettre en place une
migration progressive de leurs applications, la problématique étant de
ne jamais avoir d'interruption de service.

> Voilà comment faire une migration from scratch
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash) ,
> bientôt sur [@lemondefr](https://twitter.com/lemondefr)
> [pic.twitter.com/k4Jk3YESfD](https://t.co/k4Jk3YESfD)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/718006558282682370)

Pour réussir cette migration, ils sont partis sur une solution
[ApiPlatform](https://api-platform.com/), qui leur permet de ne plus se
concentrer sur la partie transmission des données, mais seulement sur le
métier.

Le code métier a d'abord été mis dans une LegacyBundle pour leur
permettre de ne pas avoir d'interruption de service. Puis, les
développeurs gèrent la synchronisation des données, pour cela ils n'ont
pas choisi une migration unitaire car trop longue, mais plutôt une
migration progressive qui récupère les données du legacy au fur et à
mesure de l'utilisation de l'application.

> Une migration c'est toujours lent plus d'un an de développement pour
> [@LaFourchetteMmm](https://twitter.com/LaFourchetteMmm)
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/oWvY2MXlyC](https://t.co/oWvY2MXlyC)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/718010515738460160)

Après un an de travail, il leur reste encore beaucoup de fonctionnalités
à migrer mais l'architecture qu'ils ont mise en place leur permet d'être
sereins.

Je trouve leur migration vraiment sympa, elle permet de vérifier les
choix techniques à chaque instant et de ne pas fermer des services
utilisateur.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/r2d2-to-bb8)

#### Les fuites de mémoire en PHP

Le début du talk nous a permis de comprendre comment PHP opère la
gestion de sa mémoire. Cela permet d'avoir une réflexion sur les
problèmes liés à cette façon de faire et donc de réfléchir à notre code.
L'exemple marquant est l'utilisation d'objet cyclique (A appelle B qui
lui même utilise A), qui arrive à chaque fois à une fuite mémoire.

> Très bonne explication des memory leak en
> [\#php](https://twitter.com/hashtag/php?src=hash) par
> [@BJacquemont](https://twitter.com/BJacquemont)
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> [pic.twitter.com/xFJms9WrHQ](https://t.co/xFJms9WrHQ)
>
> — Fabien Serny (@FabienSerny) [7 avril
> 2016](https://twitter.com/FabienSerny/status/718016270520737792)

Après cette explication, le speaker nous a montré l'utilisation de son
outil phpmeminfo, on peut y trouver les fuites mémoire et surtout quel
objet reste en mémoire. Cela peut permettre de débuger des problèmes de
performances sur les scripts.

Le talk était très sympa, mais le speaker oublie que le choix de PHP
n'est pas une obligation et que dans certain cas (comme un deamon), il
vaut mieux choisir une autre technologie.

> [\#memory](https://twitter.com/hashtag/memory?src=hash)
> [\#leak](https://twitter.com/hashtag/leak?src=hash) c'est surtout pour
> les deamon mais pourquoi les faire en
> [\#php](https://twitter.com/hashtag/php?src=hash) ?
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> [pic.twitter.com/Tz8ERo2wtQ](https://t.co/Tz8ERo2wtQ)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/718013770950434816)

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/php-meminfo-ou-la-chasse-aux-memory-leak)

#### Retour d'expérience sur les microservices.

Le speaker vient nous expliquer la mise en place des microservices chez
Auchan, il commence par présenter ce qu'est une architecture
microservices.

-   1 microservice = 1 domaine métier = 1 composant applicatif

Il montre que l'architecture qu'il voulait mettre en place devait suivre
le reactive manifesto disponible
[ici](http://www.reactivemanifesto.org/fr) . En résumé c'est:

1.  responsive
2.  resilient
3.  elactic
4.  message driven

La première étape de son travail a été de mettre en place un message
driven. Il a donc choisi RabbitMq, mais cela ne suivant pas le manifesto
qui n'était ni elastic, ni résilent, ni responsive, il a donc choisi de
reporter le problème et de faire une nouvelle architecture.

Tout d'abord il a choisi un format d'exchange entre les applicatifs, le
canonical data (json).

Il est alors parti sur des applications full Symfony, qui contiennent
chacune l'api (route + format d'echange) mais le code métier restait
dans chaque applicatif. Il avait alors un seul code d'API compris dans
un bundle partagé. Avec ce choix technique, il suivait le manifesto
reactive, mais n'avait plus de message driven.

Il choisit donc de mettre seulement en prod un talend entre chaque appli
qui permet d'avoir de l'asynchronisme. Pour les développeurs, il y a
donc une transparence de l'asynchronisme qui permet d'avoir des
environnements de dev plus simples.

> Talend ESB + Symfony = ? application réactive ?
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> [pic.twitter.com/Aqc7nihoPy](https://t.co/Aqc7nihoPy)
>
> — Fabien Gasser (@fabien\_gasser) [7 avril
> 2016](https://twitter.com/fabien_gasser/status/718062763793362944)

Je ne suis pas fan de son architecture car elle ne contient qu'une seule
technologie et non une réflexion plus globale, de plus l'utilisation
d'un bundle commun entre chaque applicatif n'est pas microservices
compiliant car cela créé une dépendance entre les services.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/retour-dexprience-reactive-architecture-et-microservices--comment-dcoupler-mes-applications-)

 

#### Le composant workflow.

Ce composant ne parle pas à grand monde, d'ailleurs peu de personnes
l'utilisent car il n'est pas en production depuis longtemps.

> Le composant Workflow, mais c'est quoi ?
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/2aC62jFuGQ](https://t.co/2aC62jFuGQ)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/718065203225706498)

Le composant workflow est une machine à état ou machine de pétri. Il est
développé par Fabien Potencier au début puis surtout par Grégoire Pineau
qui l'a repris en main, il a essayé de suivre les spécifications de la
machine de pétri.

Le composant permet de suivre le workflow d'un objet très facilement, il
suffit de beaucoup de config et un peu d'implémentation pour les
transitions.

Durant tout le talk, il donne l'exemple de la presse et la gestion du
workflow de publication ce qui nous donne un vrai exemple d'utilisation
de ce nouveau composant.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/le-reveil-du-workflow)

#### Blablacar nous présente ElasticSearch

Le talk nous propose de comprendre comment Blablacar utilise
ElasticSearch sur leur front.

On y retrouve un tutoriel de l'utilisation d'Elasticsearch avec de
nombreux exemples concrets récupérés du site de Blablacar. Le talk fut
assez court et manquait de préparation.

> Et maintenant [@BlaBlaCarTech](https://twitter.com/BlaBlaCarTech) nous
> explique leurs utilisations de
> [@Elasticsearch](https://twitter.com/Elasticsearch)
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/ShuuhFjofc](https://t.co/ShuuhFjofc)
>
> — Jonathan (@CaptainJojo42) [7 avril
> 2016](https://twitter.com/CaptainJojo42/status/718084231981830144)

En bref un bon récapitulatif de la documentation Elasticsearch, dommage
de ne pas être allé plus loin.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/elasticsearch-chez-blablacar)

#### Performance au quotidien dans un environnement Symfony.

Certainement la meilleure présentation de la première journée de la
Symfony Live, Xavier Leune est venu nous présenter la performance chez
CCM Benchmark, le plus gros groupe de médias en termes de pages vues au
monde.

Tout d'abord, il a choisi des métriques à suivre qui permettent d'avoir
une ligne directrice lors de tout choix technique ou de développement.

Il a choisi alors le framework, Symfony n'avait pas les meilleures
performances, au contraire il était dans les derniers, mais cela était
surtout dû à Doctrine, CCM Benchmark avait envie de travailler avec
Symfony car malgré de mauvaises performances, c'est un framework très
suivi et qui a beaucoup d'autres avantages.

Il a donc codé leur propre ORM nommé [Ting](http://tech.ccmbg.com/ting/)
qui a remis Symfony dans la course des performances.

Une fois le framework choisi, il donne plusieurs petits tips pour
améliorer le cache Symfony telle que la mise en place du warm-up après
la mise en production et pleins d'autres à revoir dans les slides.

Le dernier point de la présentation était la mise en place de Blackfire
pour le suivi des performances pendant le développement, il explique
comment mettre Blackfire dans notre CI, à chaque PR, il joue les
scénarios Blackfire sur un environnement de test.

Cette présentation est à voir, elle permet de se familiariser avec la
gestion de la performance dans un grand groupe média.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/performance-au-quotidien-dans-un-environnement-symfony)

 

#### La confiance dans une entreprise.

Le fondateur d'OpenClassRoom vient présenter sa vision de la société
d'aujourd'hui.

> La [\#confiance](https://twitter.com/hashtag/confiance?src=hash)
> élément clé du travail en équipe.
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/ntVXMLCxVZ](https://t.co/ntVXMLCxVZ)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718334302191284225)

La présentation nous montre les défauts de la société d'aujourd'hui qui
pense que nous sommes toujours à l'usine. Il commence par nous montrer
ce qui ne va pas aujourd'hui.

> C'est pas [\#tolteque](https://twitter.com/hashtag/tolteque?src=hash)
> ? N'est ce pas [@ludowic](https://twitter.com/ludowic) et
> [@mloliee](https://twitter.com/mloliee).
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/WBfZBMyUiF](https://t.co/WBfZBMyUiF)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718337978565795840)

Puis, nous explique ce qu'il a mis en place chez OpenClassRoom avec un
historique très sympa du Site du zéro. On y voit des images d'il y a 10
ans et ça nous fait revenir dans le passé.

Il finit par de nombreux conseils de management tels que la transparence
et la confiance. On n'est pas loin chez Eleven :)

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/pourquoi-se-faire-confiance-)

#### PSR6 ou le cache interface.

> PSR-6 et le cache c'est pas mal ça
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718345799944560640)

Nicolas Grekas est venu nous présenter l'un des derniers standards de la
php-fig. Il explique que PSR6 est une norme qui tente d'uniformiser la
gestion du cache. Le problème étant que cette norme est en 'brouillon'
depuis plus de 3 ans et que personne n'arrive à se mettre d'accord.

> La gestion du cache une fonctionnalité difficile à uniformiser
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/1bzCMEC13Z](https://t.co/1bzCMEC13Z)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718347350490669057)

Le souci est que php-fig est un regroupement des gros frameworks du
marché, ce n'est pas toujours représentatif des besoins métiers. C'est
pour cela que l'un des développeurs du cache doctrine était assez
mécontent en lisant la PSR6 car malgré le cache très poussé de Doctrine,
celui-ci était loin de la nouvelle norme PSR6.

> PSR-6 plein de problèmes pour
> [@guilhermeblanco](https://twitter.com/guilhermeblanco) vu le nombre
> de tweets
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/EwGLIXwm4v](https://t.co/EwGLIXwm4v)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718347952314544128)

Nicolas Grekas nous montre alors comment Symfony a développé la mise en
place de ce PSR6, il s'agit de deux interfaces à implémenter, une pour
l'objet que l'on souhaite mettre en cache et la seconde pour le pool de
cache (la technologie de cache).

> Premier code de la seconde journée du
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> pour la norme PSR-6 avec
> [@nicolasgrekas](https://twitter.com/nicolasgrekas)
> [pic.twitter.com/RJvQF3eY0M](https://t.co/RJvQF3eY0M)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718349709342089216)

Pour l'instant, l'implémentation est simple, mais il reste beaucoup de
travail donc toute aide est la bienvenue.

La présentation était sympa et permet de réfléchir sur la mise en place
du cache ainsi que l'intérêt du PSR.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/psr-6--symfony-cache--de-la-perf-en-standard)

#### La sécurité web par Blablacar.

La présentation était très parlante et permet de voir le nombre de
failles possibles dans un site web. L'exemple parlant du champ hidden
qui n'est pas correctement vérifié sur le serveur et permet d'avoir
pleins de billets SNCF pour le prix d'un parait une évidence mais
rappelle que la sécurité est une affaire du quotidien.

> Et voilà un petit crawler fait par
> [@BlaBlaCarTech](https://twitter.com/BlaBlaCarTech) grâce à
> [@fabpot](https://twitter.com/fabpot)
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/wQm5QBrcgO](https://t.co/wQm5QBrcgO)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718364085990137856)

Il montre ensuite une succession de problèmes de sécurité courants, tels
que les XSS, le CRSF TOKEN, le brut force, etc ....

Je vous invite à regarder les slides au plus vite, en espérant qu'ils
soient disponibles.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/scurit-web-pirater-pour-mieux-protger)

#### Doctrine 2

Cette présentation ne partait pas gagnante, je ne suis pas fan de
Doctrine et même contre beaucoup d'ORM.

> Une petite présentation sur
> [\#doctrine](https://twitter.com/hashtag/doctrine?src=hash), pas sur
> de changer d'avis sur l'outil !!!
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/IOYTNuNw4n](https://t.co/IOYTNuNw4n)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718372581284442112)

Les speakers nous ont présenté plusieurs cas d'utilisation. Doctrine ne
permet pas de gérer nativement de IFNOTNUL, il faut donc coder un
adaptateur.

> Ça commence mal !! Trop de code pour faire un Ifnull natif en
> [\#mysql](https://twitter.com/hashtag/mysql?src=hash) avec
> [\#doctrine](https://twitter.com/hashtag/doctrine?src=hash)
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/TkST4bqZha](https://t.co/TkST4bqZha)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718373491104489472)

Durant tout le talk, les présentateurs parlent des problématiques
rencontrées avec Doctrine et comment faire pour y répondre. Mais comme
d'habitude, on y retrouve une succession de code magique, qui n'invite
pas à l'utilisation de Doctrine.

Je repars dans le même état d'esprit qu'en arrivant : je n'ai aucune
envie d'utiliser Doctrine.

> Pas de changement d'avis sur
> [\#doctrine](https://twitter.com/hashtag/doctrine?src=hash) trop de
> code pour faire des requêtes
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/25Mna0ppTz](https://t.co/25Mna0ppTz)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718380797800132609)

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/aller-plus-loin-avec-doctrine2)

#### Le composant d'expression langage.

La présentation était très métier, je n'ai presque rien noté. La seule
chose que j'ai comprise est que l'utilisation du composant d'expression
langage était très simple d'utilisation.

C'est ce genre de présentation très métier qui sans notion de ce
dernier, me pose problème et m'ennuie dans les conférences.
Heureusement, une session de live coding m'a permis de ne pas
m'endormir.

> Une petit session de
> [\#livecoding](https://twitter.com/hashtag/livecoding?src=hash) au
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> sur le composant
> [\#expression](https://twitter.com/hashtag/expression?src=hash)-language.
> [\#bravo](https://twitter.com/hashtag/bravo?src=hash)
> [pic.twitter.com/c14TmoOirn](https://t.co/c14TmoOirn)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718418419448721409)

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/refondre-un-moteur-de-rgles-avec-lexpression-language-de-symfony2)

#### Sécurité et HTTP

Romain Neutron était là pour nous expliquer comment fonctionnent les
headers http de sécurité. Il nous a montré les bases d'un serveur
sécurisé avec les headers tels que xss-protection, frame-options,
content-type-option, ainsi que la configuration sécurisée d'un nginx.

> Voilà ma nouvelle config de header dans mon nginx, merci
> [@romainneutron](https://twitter.com/romainneutron)
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> [pic.twitter.com/HcuXPdk3yj](https://t.co/HcuXPdk3yj)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718424507279667200)

La suite de la présentation était sur les content-security-policy, qui
permettent d'identifier les contenus de son site. La conférence était
très complète et nous donnait de bonnes idées à mettre en place sur nos
serveurs de prod.

> Une bonne solution pour sécurisé mon site avec les
> content-security-policy
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> avec [@romainneutron](https://twitter.com/romainneutron)
> [pic.twitter.com/FjJORu3ZIG](https://t.co/FjJORu3ZIG)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718428864758816768)

L'utilisation
du [nelmio/NelmioSecurityBundle](https://github.com/nelmio/NelmioSecurityBundle) permet
de faire une migration en douceur des headers et donc de la sécurisation
de vos applications.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/scurit-et-http)

#### Les applications cloud native

Le speaker était "fou", il parlait très vite et se perdait parfois dans
ses explications. Mais ce qu'il faut retenir, c'est que applications
cloud natives ne veulent pas dire applications sur des serveur cloud, il
suffit de suivre des règles d'architecture :

-   avoir un CDN
-   avoir un proxy cache
-   les applications n'ont pas connaissance du serveur où elles sont
    déployées
-   avoir un message driven

> Trop bien j'ai un CDN donc je fait du micro-service
> [\#Symfony\_Live](https://twitter.com/hashtag/Symfony_Live?src=hash)
> [pic.twitter.com/xarYh2oZrX](https://t.co/xarYh2oZrX)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718444803374063621)

La présentation était très intéressante mais manquait d'une ligne
directrice.

[Les slides et
avis.](https://joind.in/event/symfonylive-paris-2016/construire-des-applications-cloud-natives)

#### Conclusion

La conférence était un vrai succès et merci à tous les conférenciers
pour la qualité de leurs présentations. J'ai appris beaucoup de choses
et repars avec de nombreuses idées de veille.

> Merci [@symfony](https://twitter.com/symfony) pour ce
> [\#symfony\_live](https://twitter.com/hashtag/symfony_live?src=hash)
> sympa. Vivement les [@symfonycon](https://twitter.com/symfonycon)
> [pic.twitter.com/UtSTMnm2iO](https://t.co/UtSTMnm2iO)
>
> — Jonathan (@CaptainJojo42) [8 avril
> 2016](https://twitter.com/CaptainJojo42/status/718451424892465152)

Je vous invite à voir l'ensemble des slides et à poser vos questions en
commentaire de ce post.

{% endraw %}
