---
layout: post
title: Démarrer avec Docker Symfony et Vue.js
excerpt: Dans cet article nous allons vous décrire comment configurer un projet Docker, Symfony et Vue.js
authors:
- nicolas
- jiefmoreno
permalink: /fr/docker-symfony-vue/
categories:
    - docker
    - Symfony
    - Vue.js
tags:
    - php
    - javascript
cover: /assets/2017-11-10-docker-symfony-vue/cover.jpg
---

Dans cette article nous allons vous montrer comment mettre en place une application web avec symfony et Vue.js dans un environnement docker. À la fin de cette article vous aurez un projet prêt au développement, mais vous pouvez également retrouver le projet sur le github d’Eleven-labs sur ce dépôt [eleven-labs/docker-symfony-vuejs](https://github.com/eleven-labs/docker-symfony-vuejs)  

## ENVIRONEMENT : Docker
Pour l'environement nous allons nous baser sur le projet de Maxence POUTORD disponible sur son [GitHub](https://github.com/maxpou/docker-symfony) et nous allons apporter quelques modifications.
Dans un premier temps nous changeons de base de donnée pour passer sur  [PostgreSQL](https://www.postgresql.org). Pour ce faire nous modifions le fichier `docker-compose.yml` se trouvant à la racine de notre projet :

```yaml
# ...

postgres:
	image: postgres:9.6
	ports:
		- ${POSTGRES_PORT}:5432
	environment:
		POSTGRES_DB: ${POSTGRES_DB}
		POSTGRES_USER: ${POSTGRES_USER}
		POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

php:
	build: docker/php7-fpm
	env_file: ./.env
	volumes:
		- ${SYMFONY_APP_PATH}:/var/www/symfony
	links:
		- postgres

# ...
```

Ensuite nous ajoutons à notre stack Node JS pour Vue.js ainsi que Redis pour la gestion des sessions. Toujours dans le fichier `docker-compose.yml` :
```yaml
# …

redis:
	image: redis:3.2.10

node:
	build: docker/node
	volumes:
		- ${SYMFONY_APP_PATH}:/var/www/symfony
	command: bash -c "yarn && yarn dev"
```
Puis nous créeons le Dockerfile pour Node JS dans le répertoire `docker/node` :
```dockerfile
FROM node:8

RUN apt-get update && \
	apt-get install -y \
		curl \
		apt-transport-https

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn

WORKDIR /var/www/symfony
```

Enfin nous modifions le Dockerfile de PHP qui se trouve dans le répertoire `docker/php7-fpm` pour installer la librairie cliente de PostgreSQL [libpq-dev](https://www.postgresql.org/docs/9.5/static/libpq.html) ainsi que l’extension [pdo_pgsql](http://php.net/manual/en/ref.pdo-pgsql.php) pour PHP :
```dockerfile
# ...
RUN apt-get update && \
	apt-get install -y \
		git \
		unzip \
		libpq-dev

# …

RUN docker-php-ext-install pdo pdo_pgsql

# ...
```
Dans le même fichier, nous en profitons aussi pour supprimer l’alias de la commande pour Symfony 2 `RUN echo 'alias sf="php app/console"' >> ~/.bashrc`

Et nous mettons à jour nos variables du fichier `.env.dist` se trouvant à la racine du projet :
```dotenv
# PATH DIR
SYMFONY_APP_PATH=./
LOGS_DIR=./docker/logs

# DATABASE
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=

# PORT WEB
WEB_PORT=
ELK_PORT=

# SYMFONY
SECRET=

#SMTP
SMTP_USER=
SMTP_PASSWORD=
SMTP_HOST=
SMTP_TRANSPORT=

#REDIS
REDIS_DNS=
```

## BACKEND : Symfony
Maintenant que notre environnement est prêt nous installons Symfony, je vous invite à suivre le [tutoriel officiel sur le site de symfony](https://symfony.com/doc/current/setup.html).
Nous allons personnaliser Symfony pour notre projet et pour ce faire nous supprimons l'appel à trois scripts exécutés lors du `composer install ` ou du `composer update`, qui se trouvent dans le fichier `composer.json` à la racine du projet. Qui sont :

- `installRequirementsFile`
- `prepareDeploymentTarget`,
- `buildParameters`.

Ce qui nous donne :
```json
// …
{
"deploy-scripts": [
	"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::buildBootstrap",
	"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::clearCache",
	"Sensio\\Bundle\\DistributionBundle\\Composer\\ScriptHandler::installAssets
],
"symfony-scripts": [
	"@deploy-scripts"
],
"post-install-cmd": ["@symfony-scripts"],
"post-update-cmd": ["@symfony-scripts"]
},

// ...
```
Nous pouvons donc supprimer les lignes de contrôle d’accès du fichier `app_dev.php` qui se trouvent dans `web/` (ATTENTION: ce fichier ne devra plus se trouver dans un environnement de production) :
```php
<?php

// ...

if (isset($_SERVER['HTTP_CLIENT_IP'])
    || isset($_SERVER['HTTP_X_FORWARDED_FOR'])
    || !(in_array(@$_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) || PHP_SAPI === 'cli-server')
) {
    header('HTTP/1.0 403 Forbidden');
    exit('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
}

// ...
```
Nous pouvons supprimer les fichiers `web/config.php` et `app/config/parameters.yml.dist`, et éditer le fichier `app/config/parameters.yml` comme ceci :
```yaml
parameters:
    # Database parameters
    database_host: postgres
    database_port: '%env(POSTGRES_PORT)%'
    database_name: '%env(POSTGRES_DB)%'
    database_user: '%env(POSTGRES_USER)%'
    database_password: '%env(POSTGRES_PASSWORD)%'

    # Mailer parameters
    mailer_transport: %env(SMTP_TRANSPORT)%
    mailer_host: '%env(SMTP_HOST)%'
    mailer_user: '%env(SMTP_USER)%'
    mailer_password: '%env(SMTP_PASSWORD)%'

    # Secret
    secret: '%env(SECRET)%'

    # Redis parameters
    redis_dsn: '%env(REDIS_DNS)%'
    redis_options: ~
    session_ttl: 86400
```
Notre projet est installer et personnalisé, il ne reste plus qu'à installer quelques bundle :
- friendsofsymfony/rest-bundle, pour la mise en place rapide d’une API REST
- jms/serializer-bundle, pour faciliter la sérialisation et désérialisation des données
- predis/predis et snc/redis-bundle, pour la communication avec redis et la gestion des sessions
- (optionnel) doctrine/doctrine-fixtures-bundle, pour générer des données

Avec cette commande, nous les installons `docker-compose exec -T --user www-data php composer require friendsofsymfony/rest-bundle jms/serializer-bundle predis/predis snc/redis-bundle doctrine/doctrine-fixtures-bundle`

Nous les référençons dans `app/AppKernel.php` :
```php
<?php

// ...

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = [
            // ...
            new FOS\RestBundle\FOSRestBundle(),
            new JMS\SerializerBundle\JMSSerializerBundle(),
            new Snc\RedisBundle\SncRedisBundle(),
            new AppBundle\AppBundle(),
        ];

        if (in_array($this->getEnvironment(), ['dev', 'test'], true)) {
            // ...
            $bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();

	// ..
        }
// ...
}
```

Et nous les configurons :
```yaml
# SerializerBundle Configuration
jms_serializer:
    metadata:
        auto_detection: true

# FOSRestBundle Configuration
fos_rest:
    body_converter:
        enabled: true
        validate: true
    serializer:
        serialize_null: true
    param_fetcher_listener: true
    routing_loader:
        default_format: json
        include_format: false
    view:
        view_response_listener: true
    format_listener:
        rules:
            - { path: '^/api', priorities: ['json'], fallback_format: 'json' }
            - { path: '^/', stop: true }

# RedisBundle Configuration
snc_redis:
    clients:
        session_client:
            type: predis
            logging: false
            alias: session_client
            dsn: %redis_dsn%
            options: %redis_options%
    session:
        client: session_client
        prefix: app_session_
        ttl: '%session_ttl%'
```
Voilà qui est fait pour la partie docker et symfony nous allons donc passer à la partie Vue.sj

## FRONTEND: Vue.js
Si vous n’êtes pas familier avec Vue.js, vous pouvez visiter la [page officielle du framework](https://vuejs.org). Vous trouverez des tutoriels très bien fait et traduits en français.

Tout d’abord initialisons notre gestionnaire de package:
```bash
symfony-vue $ yarn init
yarn init v1.3.2
question name (symfony-vue):
question version (1.0.0):
question description: symfony <3 vue
question entry point (index.js):
question repository url:
question author: Wilson
question license (MIT):
question private:
success Saved package.json
✨  Done in 49.10s.
symfony-vue $

```
Pour nous permettre d’utiliser ES6 tout en restant compatible, nous utilisons babel:

```json
/* .babelrc */
{
  "presets": [
    [
      "env",
      {
       "targets": {
          "browsers": [
            "last 2 versions",
            "Chrome >= 52",
            "FireFox >= 44",
            "Safari >= 7",
            "ie >= 10",
            "last 4 Edge versions",
          ],
        },
      },
    ],
    "stage-2",
    "vue",
  ],
}
```
Et pour gérer nos différents bundles nous utilisons Webpack. Voici notre configuration:
```javascript
/* app/config/webpack.config.js */

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    page1: './src/AppBundle/Resources/js/page1/entrypoint.js',
    page2: './src/AppBundle/Resources/js/page2/entrypoint.js',
  },
  output: {
    path: path.resolve(__dirname, '../../src/AppBundle/Resources/public'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          scss: 'style!css!sass',
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[a|c]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    remove: false,
                    browsers: [
                      'last 2 versions',
                      'Chrome >= 52',
                      'FireFox >= 44',
                      'Safari >= 7',
                      'ie >= 10',
                      'last 4 Edge versions',
                    ],
                  }),
                ],
              },
            },
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/style.css',
    }),
    new webpack.LoaderOptionsPlugin({
      options: { sassLoader: { includePaths: [path.resolve(__dirname, '../node_modules')] } },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
      },
    }),
  ],
};

```
Nous avons aussi configuré Webpack pour utiliser SASS.

Nous pouvons ajouter les scripts suivant à notre package.json pour lancer et builder notre application:

```json
/* package.json */
// ...

"dev": "NODE_ENV=dev webpack --config ./app/config/webpack.conf.js --devtool source-map --debug --watch --display-error-details",
"build": "NODE_ENV=production webpack --config ./app/config/webpack.conf.js --progress --colors --optimize-minimize",

// ...
```
Comme vous pouvez le voir, nous avons deux entrypoints différents dans notre configuration Webpack. De ces deux entrypoints, Webpack va générer deux bundles. De cette façon, nous allons pouvoir intégrer des applications Vue.js à différentes pages Twig.

Pour cet exemple, nous allons créer un composant “message” que nous allons appeler dans deux pages différentes.
Créons d’abord notre composant, qui prend en propriété “text”:
```javascript
/* src/AppBundle/Resources/js/components/message/index.vue */
<template>
  <div class="message">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

```
Appelons le dans notre page1:

```javascript
/* src/AppBundle/Resources/js/page1/index.vue */
<template>
	<Message text="Hello page 1" />
</template>

<script>
import Message from '../components/message/index.vue';
export default {
  name: 'Page1Container',
  data() {
    return { };
  },
  components: {
    Message,
  },
};
</script>
```

Il faut ensuite créer notre application Vue.js :

```javascript
/* src/AppBundle/Resources/js/page1/entrypoint.js */

import Vue from 'vue';

import Page1 from './index.vue';

export const vm = new Vue({
  el: '#app1',
  components: {
    app: Page1,
  },
  render: h => h('app'),
});
```

Puis nous appelons notre application dans la page Twig:
{% raw %}
```twig
/* src/AppBundle/Resources/views/App/index.html.twig */

{% extends '@App/App/layout.html.twig' %}

{% block container %}
<div id="app1"></div>
<script type="text/javascript" src="{{ asset('bundles/app/js/page1.js') }}"></script>
{% endblock %}
```
{% endraw %}

Nous faisons de même pour la page 2:

```javascript
/* src/AppBundle/Resources/js/page2/index.vue */

<template>
	<Message text="Hello page 2" />
</template>

<script>
import Message from '../components/message/index.vue';
export default {
  name: 'Page2Container',
  data() {
    return { };
  },
  components: {
    Message,
  },
};
</script>
```

```javascript
/* src/AppBundle/Resources/js/page2/entrypoint.js */

import Vue from 'vue';

import Page2 from './index.vue';

export const vm = new Vue({
  el: '#app2',
  components: {
    app: Page2,
  },
  render: h => h('app'),
});
```

{% raw %}
```twig
/* src/AppBundle/Resources/views/App/page2.html.twig */

{% extends '@App/App/layout.html.twig' %}

{% block container %}
<div id="app2"></div>
<script type="text/javascript" src="{{ asset('bundles/app/js/page2.js') }}"></script>
{% endblock %}
```
{% endraw %}


## COMMUNICATION
Parfois nous avons besoin d’envoyer des informations de Symfony vers Vue.js. Selon la taille de l’information et sa sensibilité, nous pouvons passer par une requête API, ou par un Data Layout.

Commençons par le Data Layout. Le Data Layout est un objet déclaré globalement, qui sera donc accessible par notre template Twig, et notre application Vue.js.

Nous allons d’abord définir un objet dataLayout au niveau le plus haut de nos template Twig:

{% raw %}
```twig
/* app/Resources/views/app.html.twig */

<!DOCTYPE html>
<html lang="{{ app.request.locale }}">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8" />

        <title>{% block title %}{% endblock %}</title>

        {% block stylesheets %}{% endblock %}

        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    </head>
    <body>
        {% block data_layout %}
            <script type="text/javascript" id="dataLayout">
                var dataLayout = {};
            </script>
        {% endblock %}
        {% block body %}{% endblock %}

        {% block javascripts %}{% endblock %}
    </body>
</html>
```
{% endraw %}

Veillez à bien respecter l’ordre d’appel des scripts : en premier le dataLayout et ensuite l’application Vue.js. Sinon vous n’aurez pas accès à l’objet global dataLayout, car il ne sera pas encore créé.
Ensuite nous allons envoyer des données depuis Symfony, et les récupérer dans notre Twig:

```php
/* src/AppBundle/Controller/appController.php */

// ...
public function indexAction(): Response
    {
        return $this->render('@App/App/index.html.twig', [
          'message'=>'hello !'
          ]);
    }
// ...
```

{% raw %}
```twig
/* src/AppBundle/Resources/views/App/index.html.twig */

// ...
{% block data_layout %}
    {{ parent() }}
    <script type="text/javascript">
      dataLayout.message = "{{ message }}";
    </script>
{% endblock %}

// ...
```
{% endraw %}

Il faut maintenant récupérer le message depuis Vue.js. Modifions notre index.vue de la page1:

```javascript
/* src/AppBundle/Resources/js/page1/index.vue */
<template>
	<Message :text="message" />
</template>

// ...
data() {
    return {
      message: '',
    };
// ...
mounted() {
    this.$set(this, 'message', dataLayout.message);
  },
};
</script>

```

Plus classiquement, nous pouvons récupérer les informations depuis un appel API.
Créons une route “/hello/:astronaut”:

```php
/* src/AppBundle/Controller/apiController.php */
/**
* Class ApiController
* @package AppBundle\Controller
*/
class ApiController extends FOSRestController
{
   /**
    * @Rest\View()
    * @Rest\Get("hello/{astronaut}", defaults={"astronaut" = null})
    *
    * @param string $astronaut
    *
    * @return string
    */
   public function getHelloAction(string $astronaut = null)
   {
       return isset($astronaut) ? "Hello $astronaut" : "Hello Astronaut";
   }
}

```
Et modifions notre page2/index.vue :

```javascript
/* page2/index.vue */
<template>
	<Message :text="message" />
</template>
// ...
data() {
    return {
      message: '',
    };
// ...
mounted() {
    fetch('/api/hello/wilson')
        .then(response => response.json)
        .then(({ message }) => this.$set(this, 'message', message))
  },
};
</script>

```

Et voilà, vous pouvez maintenant faire communiquer votre application Symfony avec Vue.js

## EXTRA UN SCRIPT POUR SE SIMPLIFIER LA VIE
Voici un petit extra pour se simplifier la vie. Comme vous avez pu le voir, pour l’installation de bundle, nous devions écrire une commande assez longue donc pour ne pas la réécrire entièrement, je vous propose de créer un script dédié  à notre projet.
Nous définissons dans un premier temps la fonction d'entrée et la fonction d’information sur l'usage comme ceci :
```bash
#!/bin/bash

# ...

usage ()
{
    echo "usage: bin/docker COMMAND [ARGUMENTS]

    init              Initialize the project
    start             Start project
    stop              Stop project
    bash              Use bash inside the app container
    exec              Executes a command inside the app container
    destroy           Remove all the project Docker containers with their volumes
    console           Use the Symfony console
    composer          Use Composer inside the app container
    test              Run test project inside the app container
    "
}

main ()
{
    declare CMD=$1

    if [ -z $1 ]; then
        usage
        exit 0
    fi

    if [[ ! $1 =~ ^init|start|stop|bash|destroy|console|composer|exec|tests$ ]]; then
        echo "$1 is not a supported command"
        exit 1
    fi

    $@
}

main $@
```
Ensuite nous implémentons nos fonctions, je vais prendre uniquement
l’exemple de `composer`, mais vous pouvez retrouver l'intégralité du script [ici](https://github.com/eleven-labs/docker-symfony-vuejs/master/bin/app).
```bash
#!/bin/bash

# …

# run Composer inside the app container
composer ()
{
    declare ARGS=$@
    docker-compose exec -T --user www-data php composer $ARGS
}

# …
```

Et voilà le tour est joué ! maintenant au lieu d’écrire `docker-compose exec -T --user www-data php compose [repositor/bundleName]`, nous écrirons `bin/app compose [repository/bundleName]`

## EN CONCLUSION
Vous disposez maintenant d’un projet configuré pour utiliser la puissance de Symfony et la simplicité de Vue.js. N’hésitez pas à nous poser des questions ou à nous laisser un commentaire !
