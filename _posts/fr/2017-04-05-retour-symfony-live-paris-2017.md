---
lang: fr
date: '2017-04-05'
slug: retour-symfony-live-paris-2017
title: LE SYMFONY LIVE PARIS 2017
excerpt: Récapitulatif des différentes présentations du sflive 2017
authors:
  - nkania
  - aandre
categories:
  - php
keywords:
  - symfony
  - conference
  - symfony_live
---

Tout comme l’année dernière (et les 3 années précédentes) Eleven Labs était présent cette année au Symfony Live ! On a mangé des Schokobons, bu des bières, mais aussi et surtout : suivi les conférences. Voilà donc notre r>etour sur l’événement en tweets, images, et résumés de ces deux jours :

Symfony 4
-------

Ouverture des conférences avec une présentation de Symfony 4 par Fabien Potencier.

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Envoyé spécial <a href="https://twitter.com/symfony_live">@symfony_live</a> ! <a href="https://t.co/BMy3M2rp54">pic.twitter.com/BMy3M2rp54</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847349984382955520">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

À la découverte du composant Serializer
-------

Grégoire Poineau prend le relai pour nous parler de la remise à niveau du composant Serializer de Symfony pour compenser JMSSerializer

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">À la découverte du composant Serializer par Grégoire Pineau <a href="https://twitter.com/lyrixx">@lyrixx</a> <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/ogmGEOBTRU">pic.twitter.com/ogmGEOBTRU</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847361896374190081">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Grâce aux tags Varnish, j'ai switché ma prod sur Raspberry Pi
-------

Au tour de Jérémy DERUSSÉ.

Cette conférence nous démontre qu’il est possible de faire fonctionner sa prod sur une machine telle qu’un raspberry PI si on gère correctement notre cache.

Le but est donc de faire en sorte que les utilisateurs n’appellent jamais le back-end mais plutôt Varnish qui permet de répondre à beaucoup plus de requêtes.

Pour cela il suffit d’implémenter un peu de logique dans notre back afin qu’il puisse purger Varnish quand cela est nécessaire en utilisant les tags. Ils permettent en effet de pouvoir purger une ressource (ou sous-ressource) très facilement.

Exemple :

- ajouter des tags dans le header en utilisant un listener écoutant le postSerialize (eg : ressource-1)
- ajouter un listener sur le onFlush pour demander à varnish de purger la ressource qui vient d’être modifiée (donc tous les objets possédant ce tag, eg : ressource-1)

Attention cependant, ceci n’est pas une solution miracle :

- ne fonctionne que pour la lecture
- il faut que varnish HIT (le premier client qui va appeler notre ressource après un purge va taper sur le back)
- besoin que l'application connaisse les ressources (ex : fonctionne pour un call simple, mais pour un top ou des filtres ça ne va pas fonctionner car besoin de compute des data potentiellement autres que celle appelée)
- il peut y avoir un délais entre l'écriture en base et le call varnish du coup possibilité que le client récupère des data obsolètes

Conclusion :
Peut importe le langage ou le framework, si on gère bien le cache, c'est tout bon ;)

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Next talk <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> : &quot;Grâce aux tags <a href="https://twitter.com/hashtag/Varnish?src=hash">#Varnish</a>, j&#39;ai switché ma prod sur Raspberry Pi&quot; par Jérémy Derussé <a href="https://twitter.com/jderusse">@jderusse</a> <a href="https://t.co/VjtsK2yAcX">pic.twitter.com/VjtsK2yAcX</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847377425331658753">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

JWT - Sécurisez vos APIs
-------

Une présentation de André TAPIA.

JWT est un standard qui repose sur une RFC qui fournit un moyen d'authentification (repose sur un token sécurisé) pour webservices, plus simple à mettre en place que de l'Oauth.

À partir de là quelques éléments à noter !

Le token se sépare en 3 parties :

- le header (qui contient l'algorithme)>>
- le payload : qui contient des propriétés qui peuvent être :
 * réservées (user_id, expiration, ndf,...)
 * privées : c’est à dire avec un nom non défini (rôles,...)
- la signature (base64 du header + payload) chiffré avec un algo (HMAC + SHA, RSA + SHA, ECDSA + SHA)

Fonctionne en 2 étapes :

- 1 call (ex : /login) pour récupérer le token
- à chaque call utiliser le token en header Authorization (bearer)

Le fait de penser à implémenter une expiration du token avec le mécanisme du refresh token permet à un utilisateur de récupérer un nouveau token lorsque celui-ci est expiré sans pour autant re-saisir son login/password (ex : appeler /token/refresh et mettre le refresh_token dans l’Authorization bearer).

L'intégration dans symfony se fait avec le component Guard ou alors il est possible d'implémenter soi-même. À noter que comme pour l'Oauth, il existe un Bundle qui simplifie le travail "LexikJWTAuthenticationBundle" pour ne pas réinventer la roue.
<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Et maintenant : &quot;JWT &#8211; Sécurisez vos APIs&quot; par André Tapia <a href="https://twitter.com/dedeparisg">@dedeparisg</a> <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/18yLhhvdrC">pic.twitter.com/18yLhhvdrC</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847389116815654913">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Micro-Services Symfony chez Meetic : retour d’expérience après 2 ans de refonte !
-------

La société Meetic était venue aux SfLive paris 2015 pour nous présenter son plan de refonte. En expliquant comment passer d’une architecture monolitique vers des micro-services dont la tâche est bien définie. Deux ans plus tard, ils jouent de nouveau le jeu de la rencontre avec le public, pour présenter la nouvelle architecture, et dans quelle mesure cela a changé les choses.

Il y a deux ans très peu voir pas de micro-services, le plan était justement de déléguer des tâches précises à ceux-là sans pour autant impacter le monolite existant. Dorénavant, de nombreux micro-services ont été créés, l’utilisation de Kafka en tant que message permet de l’asynchrone et une très bonne partie du site est désormais disponible sous forme de WebService sous Symfony.

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Les confs reprennent au <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a>, avec un Rex d&#39;Etienne Broutin sur 2 ans de refonte des micro-services <a href="https://twitter.com/hashtag/Symfony?src=hash">#Symfony</a> chez <a href="https://twitter.com/MeeticFrance">@MeeticFrance</a> <a href="https://t.co/k7cUQAbFUC">pic.twitter.com/k7cUQAbFUC</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847427312798670851">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Utiliser Webpack dans une application Symfony
-------

En bref, Webpack c'est :

- là pour remplacer Assetic (qui n'est plus inclus dans symfony standard edition)
- un "module bundler" (bundler = service container dans symfony)
- un outil qui permet de lire des fichiers sources, transformer des assets, produire des bundles,...

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Au tour d&#39;Alain Hippolyte <a href="https://twitter.com/Al0ne_H">@Al0ne_H</a> de nous expliquer comment utiliser <a href="https://twitter.com/hashtag/webpack?src=hash">#webpack</a> dans une application <a href="https://twitter.com/hashtag/Symfony?src=hash">#Symfony</a> <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/0yeaHtYRg5">pic.twitter.com/0yeaHtYRg5</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847439294583255041">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Introduction au CQRS et à l'Event Sourcing
-------

Samuel Roze nous propose ici de comprendre les bénéfices du CQRS et de l'Event Sourcing grâce au Behavioral Driven Development et au Domain Driven Design, pour que le produit, le développeur et le développement soient en phase. Tout ça dans l'optique de s'affranchir de problématiques techniques non liées au métier.

**L'event Sourcing**

Pour cela, plutôt que d'enregistrer nos modèles sous forme d'objet dans un état X à un instant T, l'event sourcing propose une solution radicalement différente : lors d'un Event Storming, produit &amp; développeur s'accordent sur tous les événements qui peuvent avoir lieu dans la vie d'un modèle (l'exemple du compte en banque est repris : des événements pourraient être : création d'un compte, crédité, débité). Tous ces événements sont ensuite enregistrés. Puis lorsque l'on aurait besoin de l'objet, il suffirait de rejouer tous ces événements pour le construire.

Il est ainsi plus simple de remonter la trace de ce qui s'est produit dans la vie du modèle.

Par ailleurs, s'il est nécessaire de présenter ces objets à la lecture dans diverses "vues", il suffit d'employer un Event Dispatcher ou un Message Queue pour alimenter ces modèles de lecture.

On nous rappelle que cette architecture est applicable à la plupart des problématiques et qu'il est ainsi plus simple de séparer la logique dans des microservices. Il n'y a par ailleurs aucun couplage entre le domaine métier et la façon dont on le stocke.

**Le pattern CQRS**

En ce qui concerne le pattern CQRS il est parfait pour fonctionner avec l'event sourcing. D'un côté les commandes vont générer des événements, de l'autre les Query vont permettre de générer des vues optimisées pour la lecture. Il peut y avoir autant de vues que nécessaire à partir d'un seul agrégat d'événements à reconstituer.

Nous vous renvoyons vers l'article de Romain Pierlot sur le sujet du [CQRS](https://blog.eleven-labs.com/fr/cqrs-pattern/) qui rentre vraiment dans le détail technique.

Notre ressenti : l'introduction est très bonne en terme de théorie sur des exemples basiques, mais il manque un peu de cas pratiques et en conditions réelles.

<blockquote class="twitter-tweet" data-width="500">
<p lang="en" dir="ltr">&quot;Introduction to CQRS and event sourcing&quot; par <a href="https://twitter.com/samuelroze">@samuelroze</a> <a href="https://twitter.com/hashtag/symfony_live?src=hash">#symfony_live</a> <a href="https://t.co/78oYsHrDfh">pic.twitter.com/78oYsHrDfh</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847458422236733441">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Quoi de neuf dans Symfony depuis un an ?
-------

Une rétrospective des changements majeurs entre Symfony 3.2 et 3.3, présentée par Sarah Khalil. Nous reviendrons ici sur l'essentiel, le tout étant disponible dans ses slides disponibles en fin de chapitre.

**En terme de nouvelles features, nous pouvons évoquer :**

- le fait de pouvoir utiliser app.flashes dans des template Twig sans devoir faire un nombre astronomique de checks. La recherche du contenu dans les dump (via l'usage de la fonction dump de VarDumper et non la fonction native PHP var_dump ;) ).
- l'ajout de l'onglet Cache dans le Profiler ainsi que l'implémentation de la PSR-16 : Simple Cache. Le FQCN d'une classe peut et devrait être utilisé comme id de service afin de pouvoir l'appeler plus facilement dans le code "MyClass::class".
- le global pattern pour importer de multiples fichiers de configuration à l'aide de wildcards et de listes d'extensions.
- les arguments nommés dans la déclaration des services qui peut-être utile avec l'auto-wiring.

**Mais il y a aussi plusieurs dépréciations :**

- l'usage de SYMFONY__ dans les fichiers de configuration ne sera plus supporté en version 3.4
- la nouvelle façon de faire depuis la 3.2 étant %env()%
- la commande cache:clear en sf >=3.3 devrait comporter l'option --no-warmup et le warmup devrait lui être appelé ensuite
- Composer va dorénavant gérer le ClassLoader.
- certaines options de l'autowiring sont dépréciées au profit d'autres qui sont plus simple notamment lorsque plusieurs services matchent à l'autowiring.
- les noms des services étaient jusqu'ici insensibles à la casse.

**Nous noterons par ailleurs la création de deux nouveaux composants** : le [LockComponent](https://github.com/symfony/lock) et le [DotenvComponent](https://github.com/symfony/dotenv).

**À noter également,**

- la release de Symfony Demo en version 1.0.0
- l'ajout de features documentées comme @experimental qui pourraient être ou ne pas être conservées
- et finalement, la standardisation des topics sur github

Notre ressenti : ce n'est pas la conférence la plus intéressante étant donné qu'il s'agit d'un rappel des différentes news du blog présentes sur le site de Symfony, néanmoins une piqûre de rappel est parfois nécessaire, pour peu qu'une news soit passée à la trappe.

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Séance de rattrapage avec Sarah Khalil <a href="https://twitter.com/Saro0h">@Saro0h</a> ! &quot;Quoi de neuf dans <a href="https://twitter.com/hashtag/Symfony?src=hash">#Symfony</a> depuis un an ?&quot; <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/WX1PhvJwMn">pic.twitter.com/WX1PhvJwMn</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847467523427545088">March 30, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Qui veut gagner une carrière de développeur ?
-------

Réveil dans la bonne humeur avec l’équipe de CommitStrip, qui met en scène une version parodique de "Qui veut gagner des Millions", sauf que le saint Graal ici est d'accéder à la Core Team Symfony. Des questions sous forme de mini-sketches, pour une présentation bien sentie et très sympa !

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Grosse pression de bon matin ! Ambiance plateau télé avec l&#39;émission &quot;Qui veut gagner une carrière de développeur&quot; 😂 <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/fD52pmiswQ">pic.twitter.com/fD52pmiswQ</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847708308169383937">March 31, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Architecture inutile ?
-------

Présentation de Jérôme VIEILLEDENT.

La morale de l'histoire ? Lorsqu'on arrive à un code impossible à maintenir il vaut mieux investir du temps à faire une refonte et repartir sur des principes sains (SOLID, DRY, KISS) plutôt que de s'entêter dans son plat de spaghetti.

[https://twitter.com/Eleven_Wilson/status/847716873797906437](https://twitter.com/Eleven_Wilson/status/847716873797906437)

Déployer une app Symfony dans un PaaS
-------

**En bref**

Tristan Darricau nous propose ici de déployer une application service dans ce que l'on appelle un PaaS (Product as a Service), tels que le font platform.sh ou encore sensio.cloud. Chaque plateforme est différente et propose ses propres options, mais l'approche reste néanmoins la même.

**Le PaaS**

Le but du PaaS est d'automatiser la chaîne de déploiement en production depuis le développement jusqu'à la production, et que le produit soit disponible sur cette plateforme pour le visiteur, tout ceci sur le cloud.

Ici pas d'ansible, puppet, chef, ou encore de copie via sftp/scp. Tout commence par un hook déclenché sur un push git. Ce hook va ensuite lancer deux processus, l'un de build, puis de run. Nous retrouverons dans le cadre d'une application Symfony dans le cadre du build des scripts tels que composer, le cache clear puis le warmup puis le run de l'application.

L'accent de la conférence est mis sur l'injection des différents paramètres, password et autre secret token. Il est possible de commiter les passwords mais c'est loin d'être la manière la plus sécurisée de faire, d'ailleurs certaines plateformes telles qu'Amazon détectent les commits de password.

**D'autres idées**

Une idée pourrait être d'injecter un fichier secret parameters.yml injecté au moment du run. C'est fonctionnel, mais pas idéal, en effet que ce passe t'il si nous avons besoin de ses password au moment du cache warmup, cela ne répond plus à la problématique.

Une autre idée est d'utiliser des variables d'environnement, inutile alors de lancer tout le process de rebuild, juste de relancer l'application pour prendre en compte les changements de variables d'environnement. Néanmoins il s'agit d'une solution "runtime only", cela fonctionne sur les  filesystem readonly, mais encore une fois impossible de les utiliser au moment du build pour une possible mise en cache par exemple.

Tristan nous indique que le warmup du cache pourrait être fait au run, mais encore une fois cela risque de rendre le processus de run assez lent.

Par ailleurs, un autre problème se pose. Certains outils lorsque mal configurés ont besoin de vos dépendances (mysql/redis/etc). Doctrine par exemple au moment de son cache warmup nécessite la version de la base de données utilisée. Or si ce warmup est fait au moment du build, sur un PaaS l'instance de la base de données ne sera pas créée.

Notre ressenti : de nombreuses problématiques sont évoquées, mais un sentiment de non résolutions de ceux-ci prend le dessus à la fin de cette conférence. Nous ne savons pas réellement comment résoudre ces problèmes.

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Comment déployer une app <a href="https://twitter.com/hashtag/Symfony?src=hash">#Symfony</a> dans un PaaS ? Réponse de Tristan Darricau ! <a href="https://twitter.com/Nicofuma">@Nicofuma</a> <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/XIA2lBrvDh">pic.twitter.com/XIA2lBrvDh</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847735755220828160">March 31, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Sécurité Web : et si on continuait à tout casser ?
-------

Présentation par Alain TIEMBLO.

Retour sur quelques grands chiffres liés à des hacks (record de braquage de banque à 81 millions de dollars, attaque sur OVH avec un botnet capable de ddos à 1TB/s, SHA1 fini...). Tout ça afin de démontrer que malgré toutes les évolutions technologiques, nous avons toujours des problèmes de sécurité. Comment s'en prémunir ?

Plusieurs solutions s'offrent à nous. En tant que simple utilisateur, le plus simple est de faire de la prévention sur les mots de passe : utilisation de passphrase unique par plateforme par exemple. Mais il s'agit aussi de faire attention aux attaques MITM qui peuvent avoir lieu sur les réseaux wifi publiques.

En tant que développeur cela va consister à être vigilant et à ne pas laisser de faille béante dans ses applications : injection SQL, redirect attaques, XSS,...

La sécurité joue un rôle primordial dans l'informatique, il ne faut pas la sous-estimer ni l'oublier !

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">On clôt cette matinée avec un talk d&#39;Alain Tiemblo <a href="https://twitter.com/ninsuo">@ninsuo</a> intitulé &quot;Sécurité Web : et si on continuait de tout casser ?&quot; <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/Ft18oY5awI">pic.twitter.com/Ft18oY5awI</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847747983294713857">March 31, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Créer des webapps modernes avec Symfony, ReactJS et API Platform
-------

Présentation par Kevin DUNGLAS.

Les APIs sont devenues incontournables à l'heure actuelle. Afin de simplifier leur création Kévin nous présente un exemple de stack en utilisant API Plateform pour le back (surcouche de Symfony Framework) + un front en React.

API Plateform est donc basé sur Symfony et propose de générer très facilement des APIs. Il supporte les formats modernes tels que JSON-LD, Hydra, HAL. Il permet de générer un CRUD automatiquement via Doctrine (mais n'est pas fortement couplé à celui-ci du coup vous pouvez utiliser ce que vous désirez), supporte la pagination et intègre FOSUserBundle, et génère automatiquement de la doc à l'aide de NelmioApiDoc et Swagger.

Une de ses particularité est de ne pas utiliser de controlleur, tout est managé à travers les événements (via event dispatcher). On peut donc interagir facilement aux différents niveaux en utilisant des listeners (ex : read, deserialize, validate, serialize, response,...).

Côté client, un outil -actuellement expérimental- permet d'exploiter toute api JSON-LD+Hydra afin de générer un back-office (type EasyAdminBundle ou Sonata) en quelques lignes. Ce client r>epose sur ReactJS et utilise >>yarn (composer-like qui remplace npm).>

Le but étant donc de proposer des outils côté clients aussi simple à utiliser qu'API Plateform afin de compléter un besoin encore peut couvert.

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">C&#39;est reparti ! Kévin Dunglas relance les talks avec &quot;Créer des webapps modernes avec <a href="https://twitter.com/hashtag/Symfony?src=hash">#Symfony</a>, <a href="https://twitter.com/hashtag/ReactJs?src=hash">#ReactJs</a> et API Platform&quot; <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/K9uqzWbKQI">pic.twitter.com/K9uqzWbKQI</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847787620369399808">March 31, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Tout ce qu'un dev devrait savoir à propos d'Unicode
-------

Présentation de Nicolas GREKAS.

Comment faire pour pouvoir représenter tous les langages de la planète ? Au début une table a été créée : ASCII qui compte 128 caractères (ce qui est forcément trop peu). Cette table fût ensuite doublée afin d'ajouter les caractères accentués notamment.

Le jeu de caractère le plus utilisé sur le web reste UTF-8 : consortium créé dans les années 90 (informaticiens et linguistes) pour représenter tous les caractères du monde dans une seule table. Celle-ci est composée de 128237 caractères et >135 scripts (langues).

Le plus gros problème est de trouver une règle qui fonctionne pour toutes les exceptions du monde. Par exemple la majuscule grecque Σ devient σ ou ς en minuscule. De même pour les accents il existe 2 modes de fonctionnements, d'un côté NFC qui va comprendre une lettre accentuée comme 1 seul caractère et de l'autre NFD qui va comprendre une lettre accentuée comme 2 caractères (imaginez un count dessus).

L'unicode en revanche gère pas mal de choses : majuscules, minuscules, folding (permet de gérer la comparaison de chaînes avec caractères spéciaux), compositions, ligatures, normalisations, collations...

Si vous voulez utiliser l'unicode en PHP il y a plusieurs possiblités :

- iconv ([http://php.net/manual/fr/book.iconv.php">http://php.net/manual/fr/book.iconv.php](http://php.net/manual/fr/book.iconv.php%22%3Ehttp://php.net/manual/fr/book.iconv.php))>>
- mbstring ([http://php.net/manual/fr/book.mbstring.php">http://php.net/manual/fr/book.mbstring.php](http://php.net/manual/fr/book.mbstring.php%22%3Ehttp://php.net/manual/fr/book.mbstring.php))
- PCRE via le modificateur "//u" ([http://php.net/manual/en/reference.pcre.pattern.modifiers.php">http://php.net/manual/en/reference.pcre.pattern.modifiers.php](http://php.net/manual/en/reference.pcre.pattern.modifiers.php%22%3Ehttp://php.net/manual/en/reference.pcre.pattern.modifiers.php))
- fonctions pour grapheme clusters ([http://php.net/manual/en/ref.intl.grapheme.php">http://php.net/manual/en/ref.intl.grapheme.php](http://php.net/manual/en/ref.intl.grapheme.php%22%3Ehttp://php.net/manual/en/ref.intl.grapheme.php))
- Normalizer ([http://php.net/manual/en/class.normalizer.php">http://php.net/manual/en/class.normalizer.php](http://php.net/manual/en/class.normalizer.php%22%3Ehttp://php.net/manual/en/class.normalizer.php))
- Intl (ICU pour PHP : [http://php.net/manual/en/book.intl.php">http://php.net/manual/en/book.intl.php](http://php.net/manual/en/book.intl.php%22%3Ehttp://php.net/manual/en/book.intl.php))
- Mysql :
* collation utf8_binary A != a
* general_ci <b>œ</b> != oe
* unicode_ci <b>œ</b> = oe
* SET NAMES utf8mb4 (sécurité et emoji)

Pour aller plus loin :

[https://www.julp.fr/articles/3-php-et-utf-8.html](https://www.julp.fr/articles/3-php-et-utf-8.html)

[https://jolicode.com/blog/l-histoire-d-unicode-et-son-adoption-sur-le-web](https://jolicode.com/blog/l-histoire-d-unicode-et-son-adoption-sur-le-web)

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Maintenant, Nicolas Grekas nous dit tout ce qu&#39;un <a href="https://twitter.com/hashtag/dev?src=hash">#dev</a> devrait savoir à propos d&#39;<a href="https://twitter.com/hashtag/unicode?src=hash">#unicode</a> ! <a href="https://twitter.com/nicolasgrekas">@nicolasgrekas</a> <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/jfobdtpAJT">pic.twitter.com/jfobdtpAJT</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847797839514263552">March 31, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Optimisation de performances de PHP7
-------

Pour conclure ce Symfony Live, Julien Pauli contributeur pour PHPInternals nous propose de voir en détails les différentes optimisations de performance qui ont été réalisées pour passer de PHP 5 à PHP 7.

**Compilateur PHP 5 = Catastrophe**

Tout d’abord il nous indique que le compilateur PHP 5 était une “catastrophe”, qui ne contenait pas d’Abstract Syntax Tree (AST). Le but n’étant pas de faire une présentation de ce qu’est un AST, nous nous contenterons sommairement de dire que sans AST il est difficile d’optimiser au mieux la version compilée/interprétée d’un programme de quelconque langage.

Le compilateur a donc été entièrement refait en PHP 7 avec un AST. Nous y apprenons également que ce compilateur est plus lent que l’ancien puisqu’il effectue beaucoup plus de passes (boucles) d’optimisation, notamment pour tout ce qui est statique. Auparavant il aurait été obligatoire d’avoir recours à la VM pour faire une addition statique telle que “1 + 2”.

Autre chose notable, on apprend que dans le contexte d’un namespace, appeler une fonction native de PHP sera plus rapide en la préfixant d’un blackslash. En effet, si la fonction native n’est pas préfixée, PHP regarde d’abord dans le contexte du namespace si la fonction a été surchargée. Puis si ce n’est pas le cas alors la fonction native sera appelée. Cela résulte en  de plus nombreux opcodes successifs, mais cela n’a rien de significatif pour autant en terme de performances.

Il en est de même pour les tableaux statiques. Auparavant ils étaient reconstruits par une succession d’opcode. Dorénavant : un seul opcode pour l’assignation du tableau statique avec tous ses éléments.

**Une bonne performance de PHP 7**

Pour rendre PHP 7 deux fois plus rapide que PHP 5, un effort a été fait sur le cache CPU. En effet, comme nous le rappelle Julien Pauli un appel mémoire est 100 fois plus lent qu’un appel au cache CPU. Par ailleurs, la taille des données stockées par PHP a donc été réduite, de façon à ce que celles-ci soient côte à côte dans le cache CPU. Pour ainsi éviter de faire de nombreux appels au CPU.

Un effort conséquent sur le moteur PHP a été fait sur les variables. En effet, celles-ci sont omniprésentes dans n’importe quel code. Optimiser la façon dont sont maniées les variables par le moteur a donc un impact global sur tout l’écosystème PHP. La structure qui gère les variables (zval) a donc fortement été optimisée, pour réduire les sauts de pointeurs et l’espace nécessaire pour stocker cette structure :

- PHP5 : 40 octets + value size et 2 pointeurs
- PHP7 : 16 octets + value size et 1 seul pointeur

À noter que PHP 7 gère également mieux le cache CPU pour le stockage de variables.

Le principe des Hashtables -terme interne de PHP pour symboliser ce que nous autres définissons comme array- a été entièrement refait également pour optimiser la gestion des listes (tableaux à clé numérique dont l’index est itératif et successif). Le but étant -entre autres- de réduire leur coût de stockage. Voici l’impact pour un bucket (un bucket étant une structure représentant une seule valeur d’un tableau dans le moteur de PHP) :

- PHP5 : 4 pointeurs, 72 octets pour le bucket et 32 octets pour la Zval
- PHP7 : 2 pointeurs, 32 octets pour le bucket bucket

Imaginez l’impact sur des tableaux de plusieurs milliers de valeurs !

**Un point sur les strings et OPCache**

Autre bouleversement : les strings. C’était complètement à “l’arrache”, dans le sens où aucune optimisation n’était faite. Dorénavant celles-ci sont “refcounted” pour ne pas être stockées deux fois. Une structure C est employée,  la “zstring”. Cette structure n’utilise pas de pointeur vers la chaîne de caractères, mais grâce à ce qui semble s’appeler un “struct hack”, celle-ci est directement stockée dans la structure “zstring” et évite de faire un saut mémoire à l’emplacement de la chaîne de caractère.

OPCache quant à lui, optimise encore plus les chaînes de caractères, puisqu’il partage son cache entre le processus parent, et tous ses processus fils. Une subtilité d’ailleurs nous est rappelée : dans un script PHP tout est string, du nom de la classe jusqu’à l’annotation d’un commentaire. Par défaut le buffer OPCache pour les strings est de 4Mo, ce qui pour Julien Pauli n’est absolument pas suffisant et qui suggère de le modifier en utilisant la propriété “opcache.interned_strings_buffer” de php.ini

Enfin concernant les strings, une nouvelle et pas des moindres ! En PHP 5 s’il était plus ou moins équivalent de concaténer des strings avec des quotes simples. Eh bien en PHP 7 il est dorénavant plus performant d’utiliser des quotes doubles en concaténant les variables à l’intérieur : “foo $bar baz $fu” est donc plus performant en PHP 7 que ‘foo ’.$bar.’ baz ‘.$fu à cause du nombre de réallocations de mémoire nécessaire par la seconde méthode.

**Pour terminer, une roadmap**

- PHP 7.2 : sortie au dernier trimestre 2017
- PHP 5.6 : fin du support au dernier trimestre 2017
- PHP 8 : au mieux pas avant 2017

Notre ressenti : une présentation très intéressante néanmoins très complexe à suivre pour ceux n'ayant aucune notion de langage bas niveau ou tout simplement aux plus néophytes.

<blockquote class="twitter-tweet" data-width="500">
<p lang="fr" dir="ltr">Pour conclure, c&#39;est Julien Pauli <a href="https://twitter.com/julienPauli">@julienPauli</a> qui monte sur scène pour parler optimisations de performances avec <a href="https://twitter.com/hashtag/PHP7?src=hash">#PHP7</a> ! <a href="https://twitter.com/hashtag/Symfony_Live?src=hash">#Symfony_Live</a> <a href="https://t.co/7sFAtE5h7O">pic.twitter.com/7sFAtE5h7O</a></p>
<p>&mdash; Wilson (@Eleven_Wilson) <a href="https://twitter.com/Eleven_Wilson/status/847816590779441152">March 31, 2017</a></p></blockquote>
<p><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>

Voilà pour le résumé de ces deux journées ! Les twitters des auteurs ainsi que leurs slides donnés dans cet article, sont tirés du github de Nicolas Potier : [https://github.com/npotier/sflive-paris-2017](https://github.com/npotier/sflive-paris-2017)

On se dit à l'année prochaine :)
