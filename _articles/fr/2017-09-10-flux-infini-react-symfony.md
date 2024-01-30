---
contentType: article
lang: fr
date: '2017-09-10'
slug: flux-infini-symfony-react
title: Mise en place d'un flux infini Symfony-React
excerpt: >-
  Pour rendre l'expérience utilisateur de nos applications web toujours plus
  agréable, nous sommes de plus en plus obligés d'utiliser plusieurs
  technologies en même temps. C'est par exemple le cas si l'on souhaite mettre
  en place un flux infini. Pour le rendre simple et performant, nous allons
  utiliser un backend Symfony et un front en ReactJs. La question se pose alors
  : comment interfacer les deux technos ?
oldCover: /assets/2017-09-10-flux-infini-react-symfony/cover.jpg
categories:
  - php
  - javascript
authors:
  - captainjojo
keywords:
  - symfony
  - react
  - redux
---
Pour rendre l'expérience utilisateur de nos applications web toujours plus agréable, nous sommes de plus en plus obligés d'utiliser plusieurs technologies en même temps. C'est par exemple le cas si l'on souhaite mettre en place un flux infini. Pour le rendre simple et performant, nous allons utiliser un backend Symfony et un front en ReactJs. La question se pose alors : comment interfacer les deux technos ?

### Mise en place du backend

Notre site est tout d'abord un site en Symfony 3.3. La mise en place est assez basique, il vous suffit d'installer Symfony en suivant le tutoriel suivant sur le [site officiel](https://symfony.com/doc/current/setup.html).  Pour la suite de notre projet, nous allons avoir besoin de stocker les données du flux, pour cela nous allons mettre en place une base de données [Postgresql](https://www.postgresql.org/). Il vous suffit de changer dans votre fichier de configuration les paramètres par défaut de la database doctrine.

```yaml
# config.yml
# Doctrine Configuration
doctrine:
    dbal:
        driver: pdo_pgsql
        host: '%database_host%'
        port: '%database_port%'
        dbname: '%database_name%'
        user: '%database_user%'
        password: '%database_password%'
        charset: UTF8
    orm:
        auto_generate_proxy_classes: '%kernel.debug%'
        naming_strategy: doctrine.orm.naming_strategy.underscore
        auto_mapping: true
```

Comme nous aimons le code propre, nous allons utiliser les variables d'environnement pour notre configuration de base de donnée. Il vous faut alors changer dans votre fichier parameters.yml les valeurs des variables pour aller chercher les valeurs dans votre environnement.

```yaml
# parameters.yml
parameters:
    database_host: '%env(POSTGRES_HOST)%'
    database_port: '%env(POSTGRES_PORT)%'
    database_name: '%env(POSTGRES_DB)%'
    database_user: '%env(POSTGRES_USER)%'
    database_password: '%env(POSTGRES_PASSWORD)%'
    secret: '%env(SECRET)%'
```

Vous pouvez maintenant créer votre fichier .env avec les valeurs de vos variables.

```yaml
// .env
# PATH DIR
SYMFONY_APP_PATH=./
LOGS_DIR=./docker/logs

# DATABASE
POSTGRES_HOST=postgres
POSTGRES_DB=infinite
POSTGRES_USER=infinite
POSTGRES_PASSWORD=infinitepass
POSTGRES_PORT=5432

# PORT WEB
WEB_PORT=80

# SYMFONY
SECRET=d3e2fa9715287ba25b2d0fd41685ac031970f555
```

Si vous avez fait un peu attention, vous avez vu que dans le fichier `.env` il y a d'autres variables, c'est parce que l'application utilise [docker](https://www.docker.com/).

### Mettez en place votre docker (optionnel)

Pour aller plus vite dans la suite de notre projet, nous avons mis en place une architecture docker permettant d'utiliser l'application. La mise en place est optionnelle mais vous aidera pour avancer dans votre développement.

À la racine de votre projet,  ajoutez un dossier `docker` qui contiendra la configuration de votre stack technique. Pour le projet nous allons utiliser :

 1. Php7 pour la partie symfony
 2. Nodejs pour builder l'application React
 3. Nginx comme serveur web pour servir le site

Vous devez créer les trois dossiers suivants à l'intérieur du dossier `docker`.

 - `nginx`
 - `php7-fpm`
 - `node`

Respectivement dans chaque dossier vous devez ajouter les fichiers `Dockerfile` suivants.

Dans le fichier `nginx/Dockerfile`

```sh
/nginx/Dockerfile
FROM debian:jessie

MAINTAINER Maxence POUTORD <maxence.poutord@gmail.com>

RUN apt-get update && apt-get install -y \
    nginx

ADD nginx.conf /etc/nginx/
ADD symfony.conf /etc/nginx/sites-available/

RUN ln -s /etc/nginx/sites-available/symfony.conf /etc/nginx/sites-enabled/symfony
RUN rm /etc/nginx/sites-enabled/default

RUN echo "upstream php-upstream { server php:9000; }" > /etc/nginx/conf.d/upstream.conf

RUN usermod -u 1000 www-data

CMD ["nginx"]

EXPOSE 80
EXPOSE 443
````

Dans le fichier `php/Dockerfile`

```sh
/php/Dockerfile
# See https://github.com/docker-library/php/blob/4677ca134fe48d20c820a19becb99198824d78e3/7.0/fpm/Dockerfile
FROM php:7.1-fpm

MAINTAINER Maxence POUTORD <maxence.poutord@gmail.com>

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zlib1g-dev \
    libpq-dev

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer --version
RUN mkdir /var/www/.composer && chown -R www-data /var/www/.composer

# Set timezone
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime
RUN "date"

# Type docker-php-ext-install to see available extensions
RUN docker-php-ext-install pdo pdo_pgsql zip

# install xdebug
RUN pecl install xdebug
RUN docker-php-ext-enable xdebug
RUN echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "display_errors = On" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_connect_back=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.idekey=\"PHPSTORM\"" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_port=9001" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN echo 'alias sf3="php bin/console"' >> ~/.bashrc

RUN usermod -u 1000 www-data

WORKDIR /var/www/symfony
```

Dans le fichier `node/Dockerfile`

```sh
/node/Dockerfile
FROM node:8

RUN apt-get update && apt-get install -y \
    curl \
    apt-transport-https

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn

WORKDIR /var/www/symfony
```

Il vous faut aussi ajouter la configuration de nginx. Dans le dossier `nginx`vous devez ajouter la configuration par défaut suivante.

```json
/nginx/ngin.conf
user www-data;
worker_processes 4;
pid /run/nginx.pid;

events {
  worker_connections  2048;
  multi_accept on;
  use epoll;
}

http {
  server_tokens off;
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 15;
  types_hash_max_size 2048;
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  access_log off;
  error_log off;
  gzip on;
  gzip_disable "msie6";
  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
  open_file_cache max=100;
}

daemon off;
```

Puis ajouter la configuration de votre application symfony.

```json
/nginx/symfony.conf
server {
    server_name infinite.dev;
    root /var/www/symfony/web;

    location / {
        try_files $uri @rewriteapp;
    }

    location @rewriteapp {
        rewrite ^(.*)$ /app.php/$1 last;
    }

    location ~ ^/(app|app_dev|config)\.php(/|$) {
        fastcgi_pass php-upstream;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS off;
    }

    error_log /var/log/nginx/symfony_error.log;
    access_log /var/log/nginx/symfony_access.log;
}
```

Il ne vous reste plus qu'à ajouter le fichier `docker-compose.yml`à la racine de votre projet avec la configuration suivante.

```yml
version: '2'

services:
    postgres:
        image: postgres:9.6
        ports:
            - ${POSTGRES_PORT}:5432
        volumes:
            - ./.data/pgdata:/var/lib/postgresql/data
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
    nginx:
        build: docker/nginx
        ports:
            - ${WEB_PORT}:80
        volumes_from:
            - php
        volumes:
            - ${LOGS_DIR}/nginx/:/var/log/nginx
    node:
        build: docker/node
        volumes:
            - ${SYMFONY_APP_PATH}:/var/www/symfony
        command: bash -c "yarn install && yarn watch"
```

Ajoutez la ligne suivante dans votre `/etc/hosts`

```sh
120.0.0.1 infinite.dev
```

Si vous lancez un `docker-compose up` puis allez sur la page suivante [infinite.dev](infinite.dev), vous devriez voir la page suivante vous indiquant que votre site est bien configuré.

![Configuration]({BASE_URL}/imgs/articles/2017-09-10-flux-infini-react-symfony/image1.png)

Une partie de la configuration est tirée de l'article de Maxence Poutord disponible [ici](http://www.maxpou.fr/docker-pour-symfony/).

Vous pouvez aussi retrouver le code directement dans le projet [Infinite github](https://github.com/CaptainJojo/infinite) dans la branche [configuration](https://github.com/CaptainJojo/infinite/tree/configuration).

### Mettre en place React

Nous allons utiliser React/Redux pour mettre en place notre flux infini. Comme tous les projets node la première chose à faire est d'ajouter à la racine de votre projet le fichier `package.json`. Comme nous utiliserons [Babel](https://babeljs.io/) pour la compilation de [l'ES2105](https://babeljs.io/learn-es2015/) il faut le mettre dans la configuration du projet, ainsi que l'utilisation [EsLint](https://eslint.org/) parce que même dans un tutoriel nous faisons les choses proprement. Bien sur il nous faut aussi [React](https://facebook.github.io/react/) et [Redux](http://redux.js.org/)  pour avoir notre configuration au complet. Vous pouvez alors ajouter l'ensemble dans votre fichier `package.json`

```json
{
  "name": "infinite",
  "version": "0.0.1",
  "engines": {
    "node": "6.x"
  },
  "private": true,
  "description": "Infinite flux",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config app/config/webpack.config.js -p",
    "lint": "eslint src app/config --ext .js --ext .jsx",
    "lint:fix": "npm run lint -- --fix",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "watch": "webpack --config app/config/webpack.config.js --devtool source-map --debug --watch --display-error-details",
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/captainjojo/infinite.git"
  },
  "bugs": {
    "url": "https://github.com/captainjojo/infinite/issues"
  },
  "homepage": "https://github.com/captainjojo/infinite#readme",
  "devDependencies": {
    "babel-core": "^6.14.0",
    "babel-jest": "^15.0.0",
    "babel-loader": "^6.2.5",
    "babel-preset-react": "^6.11.1",
    "eslint": "^3.2.0",
    "eslint-config-airbnb": "^10.0.1",
    "eslint-import-resolver-webpack": "^0.8.0",
    "eslint-plugin-import": "^1.14.0",
    "eslint-plugin-jsx-a11y": "^2.2.1",
    "eslint-plugin-react": "^6.2.0",
    "jest": "^18.0.0",
    "react-test-renderer": "^15.3.1"
  },
  "dependencies": {
    "babel-polyfill": "^6.16.0",
    "babel-preset-es2015": "^6.18.0",
    "clean-webpack-plugin": "^0.1.14",
    "lodash": "^4.15.0",
    "react": "^15.3.1",
    "react-dom": "^15.3.1",
    "react-redux": "^4.4.5",
    "redux": "^3.6.0",
    "redux-thunk": "^2.1.0",
    "release-it": "^2.5.1",
    "webpack": "^v2.2.0-rc.3",
    "whatwg-fetch": "^2.0.0"
  },
  "jest": {
    "cacheDirectory": "var/jest",
    "coverageDirectory": "build/coverage/jest",
    "moduleFileExtensions": [
      "js",
      "jsx"
    ],
    "transformIgnorePatterns": [
      "/node_modules/(?!o-.*)/"
    ],
    "moduleNameMapper": {
      "^actions(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/react/actions$1",
      "^components(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/react/components$1",
      "^containers(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/react/containers$1",
      "^helpers(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/helpers$1",
      "^lib(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/lib$1",
      "^reducers(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/react/reducers$1",
      "^store(.*)": "<rootDir>/src/AppBundle/Resources/scripts/js/react/store$1"
    },
    "testRegex": ".*.(test|spec).js[x]?$"
  }
}
```

Comme vous pouvez le constater nous allons utiliser [Webpack](https://webpack.github.io/docs/)  pour compiler et préparer nos fichiers javascript. Vous avez aussi en fin du fichier la configuration de [Jest](https://facebook.github.io/jest/) qui sera l'outil qui va nous permettre de mettre en place les tests unitaires et les tests visuels de notre application javascript. La configuration Jest permet ici de *mapper* les noms des modules lors d'un import javascript avec l'emplacement des fichiers.

Il faut donc ajouter les fichiers pour la configuration de Babel et d'Eslint. Pour Babel il vous faut ajouter le fichier `.babelrc` à la racine de votre projet.

```json
{
    "presets": ["es2015", "react"]
}
```

Pour la configuration d'Eslint il vous faut ajouter le fichier `.eslintrc.yml` à la racine de votre projet.

```yml
---
    extends: "airbnb"
    env:
        node: true
        browser: true
        jest: true
    settings:
        import/resolver:
            webpack:
                config: 'app/config/webpack.config.js'
```

Maintenant la grande question qu'il faut se poser c'est où mettre en place l'architecture javascript pour qu'elle communique et interagisse facilement avec Symfony ? *La décision n'a pas été facile et n'est pas forcément la meilleure*.

Commençons par la mise en place de la configuration `webpack`, nous la placerons dans le dossier `app/config` de Symfony.  Vous devez ajouter le fichier `webpack.config.js`suivant :

```js
const _ = require('lodash');
const fs = require('fs');
const resolve = require('path').resolve;
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV === 'prd' ? 'production' : 'development';
const root = `${__dirname}/../../`;
const paths = {
  assets: resolve(root, 'src/AppBundle/Resources/views/Assets/'),
  scripts: resolve(root, 'web/scripts/js'),
  context: resolve(root, 'src/AppBundle/Resources/scripts/js/'),
};

const manifestPlugin = (file, path) => ({
  apply: (compiler) => {
    compiler.plugin('done', (stats) => {
      fs.writeFileSync(
        resolve(path, file),
        JSON.stringify(
          _.mapValues(
            stats.toJson().assetsByChunkName,
            (chunk) => (env === 'development' ? chunk[0] : chunk)),
          null,
          '\t'
        )
      );
    });
  },
});

const config = {
  context: paths.context,
  entry: {
    /**
     * Contain all the vendors entries
     *
     * Vendors library (React, Lodash, ...)
     * Polyfills
     */
    vendor: [
      // Polyfills
      'core-js/es6/object',
      'core-js/es6/promise',
      'whatwg-fetch',

      // Vendors
      'lodash/isEqual',
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'redux-thunk',
    ],
    /**
     * Each of the following entries represent the single entrypoints
     * for a given page type
     */
    home: [
      'entrypoints/latest_news_home.jsx',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!o-.*)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', ['es2015', { modules: false }]],
        },
      },
    ],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: paths.scripts,
  },
  performance: {
    hints: env === 'production' ? 'warning' : false,
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'inlined'],
      minChunks: Infinity,
    }),
    new CleanWebpackPlugin(['**'], {
      root: paths.scripts,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
    manifestPlugin('manifest.json', resolve(root, 'var/webpack/')),
  ],
  resolve: {
    alias: {
      actions: 'react/actions',
      components: 'react/components',
      containers: 'react/containers',
      helpers: 'helpers',
      lib: 'lib',
      reducers: 'react/reducers',
      store: 'react/store',
    },
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      './src/AppBundle/Resources/scripts/js',
    ],
  },
  target: 'web',
};

if (env === 'production') {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  );
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        negate_iife: true,
        unused: true,
        dead_code: true,
        drop_console: true,
        warnings: false,
      },
      output: { comments: false },
    })
  );
}

module.exports = config;
```

Puis comme pour l'ensemble des fichiers javascript d'un projet javascript, nous allons les mettre dans les `ressources` du `bundle` Symfony.

Nous allons créer la coquille d'une architecture Rect/Redux à l'intérieur du dossier `src/AppBundle/Resources/scripts/js/react` pour cela, créez les dossiers suivants :

 - `actions`
 - `containers`
 - `reducers`
 - `store`

Dans chaque dossier nous allons commencer à créer notre architecture. Le but du tutoriel n'étant pas la compréhension d'une architecture React/Redux, si vous le souhaitez je vous invite à lire [ceci](http://redux.js.org/docs/introduction/).

Ajoutez le fichier `index.js` dans le dossier `store` avec le code suivant.

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from 'reducers';

export default function configureStore(initial) {
  return createStore(reducers, initial, applyMiddleware(thunk));
}
```
Le fichier est assez simple et permet seulement de gérer votre store.

Ajoutez le fichier `index.js` dans le dossier `reducers` avec le code suivant :

```js
import { combineReducers } from 'redux';

import latestNews from './latest_news';

export default combineReducers({
  latestNews,
});
```

Nous allons créer le premier `reducers` du projet qui ensuite contiendra les changements d'état de notre application. Ajoutez le fichier `latest_news.js` avec le code suivant :

```js
import actions from 'actions';

export default function latestNews(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```

Vous pouvez maintenant créer les fichiers d' `actions` en commençant par le fichier `index.js`

```js
import * as latestNews from './latest_news';

const actions = {
  latestNews,
};

export default actions;
```

Puis le fichier `latest_news.js` qui sera vide.

 Terminons par l'affichage en créant un fichier `jsx` très simple dans le dossier `containers` , ajoutez le fichier `LatestNewsHome.jsx` qui contiendra l'affichage.

```js
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import actions from 'actions';

class LatestNewsHome extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>Coucou</div>
    );
  }
}

LatestNewsHome.propTypes = {
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(LatestNewsHome);
```

Voilà notre architecture React/Redux terminée, il nous faut maintenant la faire communiquer avec Symfony.

### Faire communiquer React et Symfony

Il vous faut un point d'entrée entre React et Symfony pour vous permettre de lancer votre application React. Dans le dossier `src/AppBundle/Resources/scripts/js/entrypoints` ajoutez un fichier `latest_news_home.jsx` contenant l'initialisation de votre React.

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import LatestNewsHome from 'containers/LatestNewsHome.jsx';
import configureStore from 'store';

const elements = {
  latest_news: document.getElementById('react-latest-news-home'),
};

// eslint-disable-next-line no-underscore-dangle
const store = configureStore(window.__INITIAL_STATE__);

const component = (
  <Provider store={store}>
    <LatestNewsHome />
  </Provider>
);

render(component, elements.latest_news);
```

Comme vous pouvez le voir, nous allons insérer notre composant React dans notre page HTML via la balise avec l'id `react-latest-news-home`.

Il faut donc dans votre fichier template Twig ajouter cet `id`.

*Pour le tutoriel j'utilise les pages par défaut du projet Symfony, à vous de choisir votre page*

Dans la page `app/Resources/views/default/index.html.twig` changez le `block` body avec le code suivant.

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <div id="react-latest-news-home" >
    <div>
{% endblock %}

{% block javascripts %}
{% endblock  %}

{% block stylesheets %}
{% endblock %}
```

Si vous lancez votre site il ne se passe rien... Et oui, il manque les appels javascript.

Si vous lancez un `yarn watch` vous verrez que les fichiers sont générés dans votre dossier `web/scripts/js` sous trois formes :

 1. `vendor.*.js` contenant les librairies React etc...
 2. `home.*.js` contenant le code de votre composant
 3. `inlined.*.js` contenant la configuration de webpack

Le [cache busting](https://www.keycdn.com/support/what-is-cache-busting/) est déjà intégré dans la configuration Webpack.

Il nous faut maintenant ajouter les balises `scripts` dans votre page `twig`. La facilité serait de poser la balise suivante :

```html
<script src="http://infinite.dev/scripts/js/inlined.2d4b19e4578c3af04a03.js" defer></script>
<script src="http://infinite.dev/scripts/js/vendor.2d4b19e4578c3af04a03.js" defer></script>
<script src="http://infinite.dev/scripts/js/home.e428223280fc3028d63f.js" defer></script>
```

Cela n'est pas très pratique car vous devez changer vos balises à chaque changement de javascript. Nous voulons donc utiliser la fonction `asset` de twig comme pour tout autre javascript.  Vous pouvez mettre dans votre `block javascript` les deux balises suivantes :

```twig
{% block javascripts %}
<script src="{{ asset('inlined.js', 'js') }}" defer></script>
<script src="{{ asset('vendor.js', 'js') }}" defer></script>
<script src="{{ asset('home.js', 'js') }}" defer></script>
{% endblock  %}
```

Si vous testez maintenant vous avez deux 404. Effectivement `asset`ne prend pas en compte le cache busting mais nous allons l'aider.

Nous allons créer un service permettant de gérer l'utilisation du cache busting. Dans votre fichier `config.yml` vous pouvez surcharger la function `asset`.  Si vous voulez mieux comprendre vous pouvez allez lire l'article de Symfony [ici](https://symfony.com/doc/current/frontend/custom_version_strategy.html).

```yml
framework:
    #esi: ~
    #translator: { fallbacks: ['%locale%'] }
    secret: '%secret%'
    router:
        resource: '%kernel.project_dir%/app/config/routing.yml'
        strict_requirements: ~
    form: ~
    csrf_protection: ~
    validation: { enable_annotations: true }
    #serializer: { enable_annotations: true }
    templating:
        engines: ['twig']
    default_locale: '%locale%'
    trusted_hosts: ~
    session:
        # https://symfony.com/doc/current/reference/configuration/framework.html#handler-id
        handler_id: session.handler.native_file
        save_path: '%kernel.project_dir%/var/sessions/%kernel.environment%'
    fragments: ~
    http_method_override: true
    assets: ~
    php_errors:
        log: true
    assets:
        packages:
            js:
                base_urls: 'http://infinite.dev/scripts/js'
                version_strategy: 'app.assets.js.version_strategy'
```

Puis nous allons ajouter le service dans notre bundle. Commençons par créer le `service.yml`

```yml
services:
    app.assets.js.version_strategy:
        class: AppBundle\Service\VersionStrategy\JavascriptBusterVersionStrategy
        arguments:
            - '%kernel.root_dir%/../var/webpack/manifest.json'
```

Nous utiliserons la `manifest.json` de webpack qui nous permettra de connaître la version actuelle du cache busting.

Il ne vous reste plus qu'à ajouter le fichier `src/AppBundle/Service/VersionStrategy/JavascriptBusterVersionStrategy.php` avec le code suivant :

```php
<?php

namespace AppBundle\Service\VersionStrategy;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class JavascriptBusterVersionStrategy implements VersionStrategyInterface
{
    /**
     * The manifest object containing for each entry
     * the filename containing the version.
     *
     * @var array
     */
    private $hashes = [];

    /**
     * The manifest file path.
     *
     * @var string
     */
    private $path;

    /**
     * @param string $path The manifest file path
     */
    public function __construct(string $path)
    {
        $this->path = $path;
    }

    /**
     * {@inheritdoc}
     */
    public function getVersion($asset): string
    {
        $this->ensureHashesLoaded();

        preg_match(
            // Matches pattern like 'vendor.67e29947398bcbf9b383.js'
            '/(?:.*)\.([[:alnum:]]*)\.js/',
            $this->hashes[$this->getEntryName($asset)] ?? '',
            $matches
        );

        return $matches[1] ?? '';
    }

    /**
     * {@inheritdoc}
     */
    public function applyVersion($asset): string
    {
        $this->ensureHashesLoaded();

        return $this->hashes[$this->getEntryName($asset)] ?? '';
    }

    /**
     * Return the manifest entry name for the given asset.
     *
     * @return string
     */
    private function getEntryName($path): string
    {
        // Replace pattern like 'vendor.js' into 'vendor'
        return preg_replace(
            '/(.*)\.js/',
            '$1',
            $path
        );
    }

    /**
     * Load hashes from manifest if needed.
     */
    private function ensureHashesLoaded()
    {
        if (empty($this->hashes)) {
            $this->hashes = json_decode(file_get_contents($this->path), true);
        }
    }
}
```

Vous n'avez normalement plus de 404, mais une erreur javascript signalant que vous n'avez pas d'`__INITIAL_STATE__` pour votre composant React.

Nous allons donc le configurer dans votre fichier Twig, en ajoutant une valeur par défaut.

```twig
{% block javascripts %}
{% set initial_state = {latestNews: {}} %}
<script>window.__INITIAL_STATE__ = {{ initial_state|json_encode|raw }};</script>
<script src="{{ asset('inlined.js', 'js') }}" defer></script>
<script src="{{ asset('vendor.js', 'js') }}" defer></script>
<script src="{{ asset('home.js', 'js') }}" defer></script>
{% endblock  %}
```

Vous pouvez aussi retrouver le code directement dans le projet [Infinite github](https://github.com/CaptainJojo/infinite) dans la branche [communication](https://github.com/CaptainJojo/infinite/tree/communication).

### On code le flux infini

#### Partie Symfony

Dans ce flux nous allons mettre des articles contenant seulement une date et un titre. Nous aurons besoin d'initialiser le composant React avec les X premiers articles, puis pour chaque passage sur le `voir plus` d'un appel vers un webservice qui nous renverra les articles suivants.

*Pour ce tutoriel, nous allons seulement utiliser des `fixtures` à vous de jouer pour le reste.*

Nous allons créer l'`Entity`article en ajoutant le fichier `src/AppBundle/Entity/Article.php` avec le code suivant :

```php
<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Class Article
 * @package AppBundle\Entity
 *
 * @ORM\Table(name="article")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ArticleRepository")
 */
class Article
{
    /**
     * @var int $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string $title
     *
     * @ORM\Column(name="title", type="string", nullable=false)
     */
    private $title;

    /**
     * @var datetime $created
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    protected $createdAt;


    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param string $title
     *
     * @return Article
     */
    public function setTitle(string $title): Article
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     * @return Article
     */
    public function setCreatedAt(\DateTime $createdAt): Article
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
```

Ensuite en suivant l'article [ici](http://symfony.com/doc/master/bundles/DoctrineFixturesBundle/index.html), permettant de mettre en place des fixtures doctrine, vous pouvez ajouter dans votre `composer.json`

```json
    "require-dev": {
        "doctrine/doctrine-fixtures-bundle": "^2.3"
    }
```

Puis dans votre `AppKernel.php`

```php
<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = [
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new AppBundle\AppBundle(),
        ];

        if (in_array($this->getEnvironment(), ['dev', 'test'], true)) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();

            if ('dev' === $this->getEnvironment()) {
                $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
                $bundles[] = new Symfony\Bundle\WebServerBundle\WebServerBundle();
            }
        }

        return $bundles;
    }

    public function getRootDir()
    {
        return __DIR__;
    }

    public function getCacheDir()
    {
        return dirname(__DIR__).'/var/cache/'.$this->getEnvironment();
    }

    public function getLogDir()
    {
        return dirname(__DIR__).'/var/logs';
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}
```

Pour terminer, ajoutez le fichier `src/AppBundle/DataFixtures/ORM/LoadArticleData.php` contenant les données que l'on utilisera pour la suite.

```php
<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\Article;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class LoadArticleData
 * @package AppBundle\DataFixtures\ORM
 *
 *
 * @codeCoverageIgnore
 */
class LoadArticleData  extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * @param ObjectManager $manager
     *
     * @return void
     */
    public function load(ObjectManager $manager): void
    {
        foreach ($this->getData() as $data) {
            $article = new Article();
            $article->setTitle($data['title']);
            $article->setCreatedAt($data['created_at']);

            $manager->persist($article);
        }

        $manager->flush();
        $manager->clear();
    }

    /**
     * @return int
     */
    public function getOrder(): int
    {
        return 1;
    }

    /**
     * @return array
     */
    private function getData(): array
    {
        return [
            ['title' => 'MIGRER UNE APPLICATION REACT CLIENT-SIDE EN SERVER-SIDE AVEC NEXT.JS', 'created_at' => new \DateTime('03-09-2017')],
            ['title' => 'VOTRE CI DE QUALITÉ', 'created_at' => new \DateTime('30-08-2017')],
            ['title' => 'JSON SERVER', 'created_at' => new \DateTime('25-08-2017')],
            ['title' => 'BUILD AN API WITH API PLATFORM', 'created_at' => new \DateTime('24-08-2017')],
            ['title' => 'RETOUR SUR UN LIVE-CODING DE DÉCOUVERTE DU LANGAGE GO', 'created_at' => new \DateTime('23-08-2017')],
            ['title' => 'FEEDBACK ON A LIVE-CODING TO DISCOVER GO LANGUAGE', 'created_at' => new \DateTime('23-08-2017')],
            ['title' => 'HOW TO CHECK THE SPELLING OF YOUR DOCS FROM TRAVIS CI?', 'created_at' => new \DateTime('18-08-2017')],
            ['title' => 'COMMENT VÉRIFIER L\'ORTHOGRAPHE DE VOS DOCS DEPUIS TRAVIS CI ?', 'created_at' => new \DateTime('18-08-2017')],
            ['title' => 'JSON SERVER', 'created_at' => new \DateTime('16-08-2017')],
            ['title' => 'ANDROID ET LES DESIGN PATTERNS', 'created_at' => new \DateTime('09-08-2017')],
            ['title' => 'CONTINUOUS IMPROVEMENT: HOW TO RUN YOUR AGILE RETROSPECTIVE?', 'created_at' => new \DateTime('03-08-2017')],
            ['title' => 'CONSTRUIRE UNE API EN GO', 'created_at' => new \DateTime('26-07-2017')],
            ['title' => 'CRÉER UNE API AVEC API PLATFORM', 'created_at' => new \DateTime('25-07-2017')],
            ['title' => 'LES PRINCIPAUX FORMATS DE FLUX VIDEO LIVE DASH ET HLS', 'created_at' => new \DateTime('19-07-2017')],
            ['title' => 'MIGRATION DU BLOG', 'created_at' => new \DateTime('11-07-2017')],
            ['title' => 'TAKE CARE OF YOUR EMAILS', 'created_at' => new \DateTime('05-07-2017')],
            ['title' => 'ENVOYER DES PUSH NOTIFICATIONS VIA AMAZON SNS EN SWIFT 3', 'created_at' => new \DateTime('28-06-2017')],
            ['title' => 'CONSTRUCT AND STRUCTURE A GO GRAPHQL API', 'created_at' => new \DateTime('15-06-2017')],
            ['title' => 'IS AMP THE WEB 3.0', 'created_at' => new \DateTime('14-06-2017')],
            ['title' => 'CONSTRUIRE ET STRUCTURER UNE API GRAPHQL EN GO', 'created_at' => new \DateTime('07-06-2017')],
        ];
    }
}
```

Vous pouvez lancer la commande suivante `php bin/console doctrine:fixtures:load` pour insérer les données dans votre base de données.

Fonctionnellement nous voulons afficher les articles par ordre de dernière création, l'idée est donc qu'un clic sur le bouton `voir plus` permette de voir les articles antérieurs.

    Mais comment être sur d'avoir les articles les plus anciens ?

En effet, si on utilise seulement l'offset et le limit il se peut qu'un article s'insère dans notre flux. Nous allons donc prendre les articles qui sont plus anciens que le dernier article qui s'est affiché.

Dans le dossier `src/AppBundle/Repository/ArticleRepository.php` nous allons mettre la `query`qu'il faudra utiliser pour récupérer les contenus.

```php
<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * Class ArticleRepository
 * @package AppBundle\Repository
 */
class ArticleRepository extends EntityRepository
{
    public function getArticles(int $lastNewsDate, int $limit)
    {
        $lastNewsDateTime = new \Datetime();
        $lastNewsDateTime->setTimestamp($lastNewsDate);

        $qb = $this->createQueryBuilder('b')
            ->where('b.createdAt < :lastNewsDate')
            ->setParameter('lastNewsDate', $lastNewsDateTime)
            ->orderBy('b.createdAt', 'DESC')
            ->getQuery()
            ->setMaxResults($limit);

        return $qb;
    }
}
```

Maintenant nous allons initialiser le composant React avec les premiers articles. Nous le faisons dans la partie PHP car nous voulons que l'utilisateur n'ayant pas javascript voie tout de même les articles.

Dans votre fichier `src/AppBundle/Controller/DefaultController.php` vous pouvez changer votre `indexAction` avec le code suivant

```php
<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Article;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $articles = $this->getDoctrine()
            ->getRepository(Article::class)
            ->getArticles(time(), 3)
            ->getResult();

        $jsonArticles = [];
        foreach ($articles as $article) {
            $jsonArticles[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'createdAt' => $article->getCreatedAt()->getTimestamp()
            ];
        }

        return $this->render('default/index.html.twig', [
            'latestNews' => $jsonArticles,
            'lastItemDate' => $jsonArticles[count($jsonArticles) - 1]['createdAt']
        ]);
    }
```

Puis nous allons ajouter le webservice dans ce même fichier.

```php
<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Article;

class DefaultController extends Controller
{
	/****
	Index Action
	****/

    /**
     * @Route("/ws", name="ws")
     */
    public function wsAction(Request $request)
    {
        $lastItemDate = (int) ($request->get('last_item_date') ?? time());
        $articles = $this->getDoctrine()
            ->getRepository(Article::class)
            ->getArticles($lastItemDate, 3)
            ->getResult();

        $jsonArticles = [];
        foreach ($articles as $article) {
            $jsonArticles[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'createdAt' => $article->getCreatedAt()->getTimestamp()
            ];
        }

        return new JsonResponse($jsonArticles);
    }
}
```

Dernières choses : faire afficher les articles et initialiser votre React. Il vous faut changer votre fichier `app/Resources/views/default/index.html.twig`

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <div id="react-latest-news-home" >
      <ul>
        {% for article in latestNews %}
        <li>
          {{ article.title }}
        </li>
        {% endfor %}
      <ul>
    <div>
{% endblock %}

{% block javascripts %}
{% set initial_state = {
      latestNews: {
          data: latestNews,
          lastItemDate: lastItemDate,
          limit: 3,
      },
  } %}
<script>window.__INITIAL_STATE__ = {{ initial_state|json_encode|raw }};</script>
<script src="{{ asset('inlined.js', 'js') }}" defer></script>
<script src="{{ asset('vendor.js', 'js') }}" defer></script>
<script src="{{ asset('home.js', 'js') }}" defer></script>
{% endblock  %}

{% block stylesheets %}
{% endblock %}
```

Si vous affichez votre site, vous devez voir les trois premiers contenus mais le `voir plus` ne marchera pas, normal nous n'avons pas fini notre React.


#### Partie React

Peu de chose à changer, d'abord commençons par changer `src/AppBundle/Resources/scripts/js/react/actions/latest_news.js`

```js
export const ERROR = 'latest_news/ERROR';
export const FETCH = 'latest_news/FETCH';
export const RECEIVE = 'latest_news/RECEIVE';
export const SHOW = 'latest_news/SHOW';

const error = () => ({
  type: ERROR,
});

const fetching = (lastItemDate, limit) => ({
  lastItemDate,
  limit,
  type: FETCH,
});

const receive = (news) => ({
  type: RECEIVE,
  data: news,
});

const show = () => ({
  type: SHOW,
});

/**
 * Fetch the data latest_news data
 *
 * @dispatch latest_news/FETCH
 * @dispatch latest_news/RECEIVE
 * @dispatch latest_news/ERROR
 */
export const fetch = () => (dispatch, getState) => {
  const { isFetching, lastItemDate, limit } = getState().latestNews;

  if (isFetching) {
    return Promise.resolve();
  }

  let url = `/app_dev.php/ws?last_item_date=${lastItemDate}&limit=${limit}`;

  dispatch(fetching(lastItemDate, limit));

  return window.fetch(url, { credentials: 'same-origin' })
    .then(response => {
      if (!response.ok) {
        return Promise.reject();
      }

      return response.json();
    })
    .then(json => dispatch(receive(json)))
    .catch(() => dispatch(error()));
};

/**
 * Prefetch the data latest_news data
 * And display the previously prefetched data
 *
 * @dispatch latest_news/ERROR
 * @dispatch latest_news/FETCH
 * @dispatch latest_news/RECEIVE
 * @dispatch latest_news/SHOW
 */
export const prefetch = () => (dispatch, getState) => {
  dispatch(show());

  return fetch()(dispatch, getState);
};

/**
 * Refresh the latest views to update their diff time
 */
export const refresh = () => ({
  type: REFRESH,
});
```

On y trouve l'appel au webservice lors de l'action `Fetch`. Pour améliorer les performances nous allons chercher les données lors de l'affichage des données précédentes qui permet d'avoir un coup d'avance sur l'utilisateur.

Vous pouvez maintenant changer le `reducers` suivant `src/AppBundle/Resources/scripts/js/react/reducers/latest_news.js`

```js
import actions from 'actions';

export default function latestNews(state = {}, action) {
  switch (action.type) {
    case actions.latestNews.FETCH:
      return Object.assign({}, state, {
        lastItemDate: action.lastItemDate,
        limit: action.limit,
        isFetching: true,
      });
    case actions.latestNews.RECEIVE:
      return Object.assign({}, state, {
        data: state.data.concat(
          action.data.map(
            (article) => Object.assign({}, article, { visible: false })
          )
        ),
        isFetching: false,
      });
    case actions.latestNews.SHOW:
      return Object.assign({}, state, {
        data: state.data.map(
          (article) => {
            if (article.visible === false) {
              return Object.assign({}, article, { visible: true });
            }

            return article;
          }
        ),

        // Items on the next page must be published prior to the last article on the current page.
        lastItemDate: (state.data.length === 0 ? 0 : state.data[state.data.length - 1].createdAt),
      });
    default:
      return state;
  }
}
```

Puis terminons les composants. D'abord `src/AppBundle/Resources/scripts/js/react/containers/LatestNewsHome.jsx` qui est le point d'entrée.

```js
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import actions from 'actions';
import ThreadSection from 'components/Organisms/ThreadSection.jsx';

const REFRESH_INTERVAL = 60; // One minute

class LatestNewsHome extends Component {
  constructor() {
    super();

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.latestNews.fetch());
  }

  onButtonClick(event) {
    this.props.dispatch(actions.latestNews.prefetch());
  }

  render() {
    const filtered = this.props.latestNews
      .filter((article) => article.visible === undefined || article.visible);

    return (
      <ThreadSection
      articles={filtered}
      more={!this.props.isFetching}
      onButtonClick={this.onButtonClick}
      />
    );
  }
}

LatestNewsHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  latestNews: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  isFetching: state.latestNews.isFetching,
  latestNews: state.latestNews.data,
});

export default connect(mapStateToProps)(LatestNewsHome);
```

Puis vous pouvez ajouter dans le dossier `src/AppBundle/Resources/scripts/js/react/components` les composants suivants :

 - `src/AppBundle/Resources/scripts/js/react/components/Organisms/ThreadSection.jsx`

```js
import React, { PropTypes } from 'react';

import Button from 'components/Atoms/Button.jsx';

const renderThreadItems = (article, index) => {
  if (!article.id) {
    return null;
  }

  return (
    <li key={index}>
     {article.title}
    </li>
  );
};

const ThreadSection = ({
  articles = [],
  more = false,
  onButtonClick,
}) => (
  <div>
    <ul>
      {articles.map((article, index) => renderThreadItems(article, index))}
    </ul>
    {more && (
    <div>
      <Button
        text="Voir Plus"
        onClick={onButtonClick}
        ariaLabel="Afficher les contenus plus anciens"
      />
    </div>
    )}
  </div>
  );

ThreadSection.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object),
  more: PropTypes.bool,
  onButtonClick: PropTypes.func,
};

export default ThreadSection;
````

 - `src/AppBundle/Resources/scripts/js/react/components/Atoms/Button.jsx`

```js
import React, { PropTypes } from 'react';

const Button = ({onClick = () => {}, text = '', ariaLabel = '' }) => {
  const attributes = {
    onClick,
  };

  if (ariaLabel !== '') {
    attributes['aria-label'] = ariaLabel;
  }

  return (<a
    {...attributes}
  >
    {text}
  </a>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
````

Bravo vous avez terminé votre flux infini.

Vous pouvez aussi retrouver le code directement dans le projet [Infinite github](https://github.com/CaptainJojo/infinite) dans la branche `master`.

Merci d'avoir suivi ce tutoriel, si vous avez des questions surtout n'hésitez pas.
