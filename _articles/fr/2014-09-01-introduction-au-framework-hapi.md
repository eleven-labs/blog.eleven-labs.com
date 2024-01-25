---
contentType: article
lang: fr
date: '2014-09-01'
slug: introduction-au-framework-hapi
title: Introduction au framework HAPI
excerpt: >-
  HAPI est un framework Node.js développé par Walmart Labs. Il gagne aujourd’hui
  en popularité. Ainsi, des entreprises prestigieuses dans le domaine du web
  telles que Paypal, Mozilla ou encore Beats Audio commencent à l’utiliser, tout
  un gage de confiance !
categories:
  - javascript
authors:
  - arubal
keywords:
  - nodejs
  - hapi
---

HAPI est un framework Node.js développé par ‘Walmart Labs’. Il gagne aujourd’hui en popularité. Ainsi, des entreprises prestigieuses dans le domaine du web telles que Paypal, Mozilla ou encore Beats Audio commencent à l’utiliser, tout un gage de confiance !

Dans cet article, je vais couvrir l’initialisation d’une application,  la création d’un serveur, la déclaration des routes et enfin je me centrerai sur certains points qui m’ont particulièrement intéressé dans son utilisation.

## I **L’initialisation de l’application**

Commençons par créer un dossier , s’y déplacer et débuter un projet à l’aide de *npm init*

```js
mkdir hapi && cd $_
npm init
```

Après cette simple initialisation, nous allons télécharger Hapi et le sauvegarder en tant que dépendance du projet.

```js
npm install hapi@6.5 --save
```

## II **La création du serveur**

La création du serveur est on ne peut plus simple. Ouvrons notre fichier point d’entrée (dans mon cas, je l’ai appelé *app.js*, libre à vous de l‘appeler comme vous le souhaitez !)

```js
var Hapi = require('hapi');

var server = new Hapi.Server('localhost', 3000);

server.start(function() {
    console.log('Serveur Hapi disponible à l\'adresse', server.info.uri);
});
```

Tadaaa ! Notre serveur est prêt ! La méthode start de l’objet Hapi.Server permet de démarrer un serveur sur le port que l’on a défini sur le localhost. La méthode prend en paramètre une callback qui sera exécutée dès que le serveur sera prêt à recevoir des requêtes.

Revenons sur la console, lançons un node app.js  pour y voir apparaître le message que l’on a passé dans notre callback.

En revanche, si l’on se rend à l’adresse http://localhost:3000 depuis un navigateur, on tombe sur une 404 … Il est temps de créer notre première route !

## III Le Routing

La création de routes est, elle aussi, facile à mettre en oeuvre. Pour ce faire, nous allons recourir à la méthode route de notre serveur Hapi. Cette dernière prend un certain nombre de paramètres, dont 3 au minimum doivent être renseignés (method, path et handler) . Reprenons notre fichier app.js et ajoutons ces lignes :

```js
var Hapi = require('hapi');
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});
```

Relançons notre serveur , rendons nous à l’adresse <http://localhost:300>0 … Notre 404 disparaît au profit d’un (sommaire, il est bien vrai !) ‘Hello World!’ .

Détaillons ces 3 paramètres requis pour faire fonctionner notre route:

1.  *method* : la méthode HTTP ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'). Tous les verbes HTTP sont acceptés hormis 'HEAD'
2.  path : le chemin absolu vers la requête (attention, il doit commencer par un ‘/’). Le router d’Hapi nous permet d’extraire des segments de l’URL. Ainsi on pourra créer des routes de ce type
    -   ‘/hello’ : cette route répondra exclusivement à la  requête <http://localhost:3000/hello>
    -   ‘/hello/{name}’ : cette route répondra ainsi sur <http://localhost:3000/hello/jean>  ou encore  <http://localhost:3000/hello/isabelle> . On accède au paramètre ‘name’ en ayant recours à request.params.name.
3.  *handler* : une fonction qui porte la signature function (request, reply) {...} qui sera appelée pour générer la réponse à la requête. L’objet *request* est l’une des forces de Hapi. Il est créé à chaque requête entrante et ses propriétés et méthodes vont changer au cours de ce que les créateurs du framework appellent le ‘r*equest lifecycle*’ (le cycle de vie de la requête). L’objet *request* permet , entre autres choses, d’accéder aux paramètres de l’URL et à la query string. L’interface *reply* nous permettra de renvoyer une réponse au client. Elle peut prendre en paramètre un *String*, un *JSON*, un *Buffer*, un  *ReadableStream*, ou encore une *Error*.

Pour mettre en pratique toutes ces nouvelles choses que l’on vient d’apprendre, créons une nouvelle route !

```js
var Hapi = require('hapi');
server.route({
    path: "/hello/{firstName}/{lastName}",
    method: "GET",
    handler: function(request, reply) {
        reply({
            firstName: request.params.firstName,
            lastName: request.params.lastName,
            occupation: request.query.occupation || "designer"
        });
    }
});
```

Relançons notre navigateur , rendons nous à l’adresse : <http://localhost:3000/hello/john/doe?occupation=developper>
La réponse du serveur :
{firstName: "john", lastName: "doe",occupation: "developper"}

Un petit plus, au fur et à mesure que grandit notre projet et / ou que l’on crée des routes dans des fichiers différents, il est difficile de savoir quelles sont toutes les routes déclarées. Les créateurs du framework ont pensé à tout ! Notre objet *server* dispose d’une méthode *table* qui, une fois appelée, nous permet de voir en un clin d’oeil l’ensemble des routes disponibles sur le serveur !

## IV Validation

En tant que développeurs, nous avons régulièrement besoin de valider les paramètres passés dans une URL. Spumko, l’équipe qui réalise entre autres le framework, nous met à disposition un module facilitant cette validation, Joi.

Retournons sur la console, plaçons nous à la racine de l’application et téléchargeons Joi.

```js
npm install joi@4.6 --save
```

Pour accéder au module, rien de plus simple :

```js
var Joi = require(‘joi’);
```

Pour utiliser pleinement les possibilités du module nous allons modifier notre méthode *route* précédemment créée afin d’y ajouter une clé *config*. Editons à nouveau notre fichier app.js et changeons la route que nous avons précédemment créée :

```js
server.route({
    path: "/hello/{firstName}/{lastName}",
    method: "GET",
    config : {
        handler: function(request, reply) {
            reply({
                firstName: request.params.firstName,
                lastName: request.params.lastName,
                occupation: request.query.occupation || "developper"
            });
        },
        validate: {
            params: {
            firstName: Joi.string().min(3).max(20),
            lastName: Joi.string().min(3).max(20)
       },
       query: {
          occupation: Joi.string().valid(["developper","designer","cto"]).default("developper"),
          age: Joi.number().integer().min(13).max(100).required()
       }
    }
  }
});
```

Le *handler* (paramètre obligatoire) est toujours présent, mais dans ce cas, il passe en clé de *config*
Dans notre exemple, nous demandons à valider les paramètres *firstName* et *lastName*. Nous n’autorisons que des *string* ayant entre 3 et 20 caractères.

Si nous essayons des mauvais paramètres, par exemple <http://localhost:3000/hello/j/doe?occupation=developper> … badaboum ! Hapi nous renvoie automatiquement une 400 (Bad Request) car la longueur du paramètre {firstName} est de 1 caractère. Or, dans nos règles de validation, nous avons précisé "min(3).max(20)".
De même, nous avons ajouté des critères de validation pour la query string. Ainsi, si nous tentons d’accéder à cette route sans renseigner *age*, Hapi nous renvoie une 404 car nous avons exigé qu‘il devait être ‘required()’ .
Joi est un module complet que je ne vais pas détailler ici. Pour vous mettre l’eau à la bouche, sachez qu’il est possible d’introduire des petits algorithmes (par exemple, on pourra valider un paramètre en fonction de ce qui a été passé pour un autre paramètre, c’est très utile ! ). Pour une liste exhaustive de ses possibilités, je vous laisse lien vers la documentation : <https://github.com/hapijs/joi>

## V Les plugins

Je vous l’accorde, si je continue à définir de nouvelles routes au sein du même fichier, ce sera bientôt illisible et difficile à maintenir… ! Là encore, Hapi possède une solution pour organiser votre projet. En effet , les plugins viennent à notre rescousse pour structurer notre application en un ensemble d’unités logiques. Avant d’entrer en détail dans la création d’un plugin, il est nécessaire de comprendre que Hapi propose une interface pour regrouper des serveurs, appelée ‘pack’. Chaque serveur Hapi fait partie d’un Pack HAPI (je reviendrai sur ce concept plus tard).
Pour créer un plugin, on peut soit le faire dans un dossier de son choix ou directement dans ‘node\_modules’. Personnellement, je préfère la seconde option.

```js
cd node_modules && mkdir plugin-example && cd $_
npm init
```

Dans ce dossier, éditons notre fichier point d’entrée (encore une fois, j’ai choisi app.js)

```js
exports.register = function(plugin, options, next) {
    plugin.route({
        path: "/plugin-example",
        method: "GET",
        handler: function(request, reply) {
            reply("Ceci est une réponse depuis un plugin");
        }
    });
    next();
};

exports.register.attributes = {
     ‘name’: ‘plugin-example’,
     ‘version’: ‘1.0.0’
};
```

Une explication est nécessaire ! On construit un plugin avec ces éléments :

1.  *name* : le nom donné au plugin. Les plugins publics sont à publier sur *npm.* Si le plugin est privé, faites attention à ce qu’il n’entre pas en conflit avec un autre ayant le même nom !
2.  *register* : C’est la fonction décrite dans *exports.register* et qui est le noyau du plugin. Cette fonction est appelée lorsque le plugin est enregistré. Elle constitue l’unique point d’entrée du plugin.
3.  *version* : un paramètre optionnel décrivant la version du plugin.

Dans notre exemple, *‘name*’ et  ‘*version*’ sont inclus au moyen de la propriété *‘attributes*’

Détaillons maintenant les paramètres que prend la fonction ‘register’ :

1.  *plugin*: l’interface plugin que nous utiliserons pour définir des routes, des méthodes. Je ne détaillerai pas ici l’ensemble des propriétés et des méthodes que nous offre ici le framework, je vous laisse un lien vers la documentation <https://github.com/hapijs/hapi/blob/master/docs/Reference.md#root-methods-and-properties>
2.  *options* : un objet qui contient les options du plugin fourni par les méthodes d’enregistrement du pack.
3.  *next* : la fonction de callback qui DOIT être explicitement appelée, et qui complète le process d’enregistrement du plugin. Elle prend un en paramètre une éventuelle erreur.

Malheureusement, cette nouvelle route définie dans le plugin n’est pas encore disponible …. On doit enregistrer notre plugin ! Pour ce faire, on doit remonter, au niveau de notre dossier racine de l’application et modifier notre fichier *app.js*

```js
var Hapi = require('hapi');
var server = new Hapi.Server('localhost', 3000);
server.pack.register(
    {
        plugin: require('./node_modules/plugin-example/app.js'),
        options: {
            message: 'hello from options',
        }
    }
    , function(err) {
        if (err) {
           throw err;
       }
        server.start(function() {
            console.log('Serveur Hapi disponible à l\'adresse', server.info.uri);
       });
});
```

Relançons notre application … cette fois-ci, cela fonctionne, rendez-vous l’adresse http://localhost:3000/plugin-example pour confirmation !
Avez-vous aperçu l’objet options que nous avons passé en paramètre ? On va les récupérer au niveau de notre plugin dans la fonction register !

## VI Les packs

Un objet Pack représente une collection de serveurs qu’on regroupe ensemble pour former une seule et unique unité logique. L’objectif principal de cet objet est d’offrir une interface lorsqu’on travaille avec les plugins.

Regrouper plusieurs serveurs au sein d’un pack permet de les traiter comme une seule entité que l’on peut démarrer ou arrêter, et ce, de manière synchrone. Chaque instance de serveur Hapi porte une référence vers un pack.

Ainsi, lorsque nous avons précédemment créé le serveur de notre application, un pack a automatiquement été créé et assigné à la propriété pack du serveur !

Néanmoins, nous allons apprendre à en créer un explicitement, c’est très facile aussi :

```js
var Hapi = require('hapi');
var pack = new Hapi.Pack();
var server1 = pack.server(8000, { labels: ['web'] });
var server2 = pack.server(8001, { labels: ['admin'] });

server2.route({
    path: "/admin/article/{id}",
    method: "GET",
    handler: function(request, reply) {
        reply(request.params.id);
    }
});

pack.register(
    {
        plugin: require('./node_modules/plugin-example/app.js'),
        options: {
            message: 'hello from options',
        }
    }
, function(err) {
    if (err) throw err;
    pack.start(function(server) {
        console.log("Pack hapi disponible.");
    });
});
```

Ici, on a créé deux serveurs, chacun ayant un propre label, notion que l’on pourrait comparer à un *tag*. Ensuite, on a explicitement déclaré une route pour le serveur avec le label *admin*. On a ensuite démarré notre pack. On y a inscrit notre plugin-example, c’est pourquoi l’URL ‘/plugin-example’ est disponible à la fois à l’adresse <http://localhost:8000/plugin-example> mais aussi sur <http://localhost:8001/plugin-example> !

En revanche, nous avons attaché explicitement la route ‘admin/article/{id}’ à la variable server2. C’est pourquoi cette route n’est disponible que sur le port 8081 !

Afin de faciliter la création d’un pack, Hapi met à notre disposition une méthode *compose* à partir d’un simple fichier de configuration. On pourrait ainsi réécrire le code précédemment utilisé pour notre pack de cette façon :

```js
var Hapi = require('hapi');

var manifest = {
    servers: [
        {
            port: 8000,
            options: {
                labels: ['web']
            }
        },
        {
            host: 'localhost',
            port: 8001,
            options: {
                labels: ['admin']
            }
        }
    ],
    plugins: {
        'plugin-example': {
            options: {
                message: 'hello from options',
            }
        }
    }
};

Hapi.Pack.compose(manifest, function (err, pack) {
    pack.start(function(server) {
         console.log("Pack hapi disponible.");
     });
});
```

Avec cette méthode, on a créé un objet *manifest*, qui spécifie la configuration de notre pack et les plugins que l’on souhaite enregistrer. On a ainsi isolé toute notre configuration ! (que l’on pourra bien évidemment placer dans un autre fichier).

## VII Conclusion

J’espère que je vous ai donné envie d’essayer cet excellent mais méconnu framework !  Je ne suis pas rentré dans tous les détails, c’est pourquoi, je vous conseille d’approfondir cette introduction en consultant la documentation officielle, qui est très bien écrite et régulièrement mise à jour: <https://github.com/hapijs/hapi/blob/master/docs/Reference.md>

Par ailleurs l’équipe est très impliquée et propose d’excellents modules (<https://github.com/hapijs>). Parmi ceux que j’apprécie le plus : *lout* qui génère automatiquement une documentation de votre serveur Hapi, *yar*, qui est un gestionnaire de sessions et de cookies ou encore *catbox* qui offre  une gestion du cache …. !
