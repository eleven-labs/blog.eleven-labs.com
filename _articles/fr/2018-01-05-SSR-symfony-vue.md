---
contentType: article
lang: fr
date: '2018-01-05'
slug: ssr-symfony-vue
title: SSR avec Symfony et Vue.js
excerpt: >-
  Nous travaillons de plus en plus avec à la fois un framework serveur type
  Symfony et un framework client type Vue.js. D'ailleurs on trouve énormément
  d'articles sur le sujet. La question que l'on se pose le plus souvent, c'est
  comment rendre ces choix technologiques performants.
cover: /imgs/articles/2018-01-05-SSR-symfony-vue/cover.jpg
categories:
  - javascript
authors:
  - captainjojo
keywords: []
---

Nous travaillons de plus en plus avec à la fois un framework serveur type Symfony et un framework client type Vue.js. D'ailleurs on trouve énormément d'articles sur le sujet. La question que l'on se pose le plus souvent, c'est comment rendre ces choix technologiques performants.

C'est en lisant un article sur [Medium](https://medium.com/js-dojo/server-side-rendering-with-laravel-vue-js-2-5-6afedd64aa90) qui présente la mise en place de SSR (server side rendering) de vue.js sur un serveur Laravel que je me suis dit "Et pourquoi ne pas le faire en Symfony ?".

## Symfony et Vue.js premiere partie

Tout d'abord, je vous invite à installer un Symfony 4 en suivant les instructions disponibles [ici](https://symfony.com/doc/current/setup.html).

Vous devez alors avoir un projet qui ressemble à ceci :

```
your-project/
├── assets/
├── bin/
│   └── console
├── config/
│   ├── bundles.php
│   ├── packages/
│   ├── routes.yaml
│   └── services.yaml
├── public/
│   └── index.php
├── src/
│   ├── ...
│   └── Kernel.php
├── templates/
├── tests/
├── translations/
├── var/
└── vendor/
```

La première chose à faire, c'est d'installer twig et les annotations :

    composer require annotations
    composer require twig

Cela va vous permettre de créer votre premier controller dans le ficher `src/Controller/DefaultController.php`

```php
<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController  extends Controller
{
    /**
     * @Route("/")
     */
    public function number()
    {
        return $this->render('home.html.twig');
    }
}
```

Et d'ajouter votre template twig dans le fichier `templates/home.html.twig`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>{% block title %}Welcome!{% endblock %}</title>
        {% block stylesheets %}{% endblock %}
    </head>
    <body>
        {% block body %}
            <div id="app">SALUT</div>
        {% endblock %}
        {% block javascripts %}
        {% endblock %}
    </body>
</html>
```

Nous allons maintenant ajouter la partie vue.js, en utilisant Webpack-encore de Symfony. Vous trouverez la documentation [ici](http://symfony.com/doc/current/frontend/encore/installation.html).

Nous allons faire une configuration très simple pour la mise en place de vue.js. Il faut mettre dans votre fichier `webpack.config.js`

```js
var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')
    .addEntry('app', './assets/js/app.js')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVueLoader()
;

module.exports = Encore.getWebpackConfig();
```

Puis nous allons ajouter le composant Vue.js.


Dans le dossier `assets` je vous invite à créer le dossier `js`. À l'intérieur de ce dossier vous pouvez créer le composant vue.js. Dans le fichier `assets/js/components/App.vue`

```html
<template>
  <div id="app">
    {{ message }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        message: 'Hello World'
      }
    }
  }
</script>
```

Puis vous pouvez créer `app` vue.js, dans le fichier `assets/js/app.js` qui est le point d'entrée de votre application vue.js.

```js
import App from './components/App.vue';
import Vue from 'vue';
new Vue({
  el: '#app',
  render: h => h(App)
});
```

Dans votre fichier twig vous devez appeler le fichier généré par webpack en ajoutant ceci dans le block javascript.

```html
<script src="{{ asset('build/app.js') }}"></script>
```

Voilà, vous devez avoir un site symfony 4 qui vous affiche `Hello world` en vue.js. Si vous désactivez le javascript, vous n'aurez que le `salut` qui s'affiche.

![Demo1]({BASE_URL}/imgs/articles/2018-01-05-SSR-symfony-vue/demo1.png)

## Faire du SSR

L'intérêt du SSR est de ne pas interpréter le javascript sur le client lors du premier appel mais plutôt par votre serveur. Cela permet d'avoir une page directement générée, et de gagner en performance d'affichage ainsi qu'en SEO.

Normalement le SSR se fait directement sur un serveur javascript. Il existe d'ailleurs des librairies directement faites pour cela.  Je vous incite à lire cet article qui parle du [SSR sur React](https://blog.eleven-labs.com/en/react-ssr/).

Mais ici, nous voulons garder notre serveur Symfony (pour plein de raison que je n'expliquerai pas).

Tout d'abord nous allons créer deux fichiers d'entrée pour vue.js, parce qu'il faut appeler des fonctions différentes pour l'affichage dans le client et dans le serveur.

![App.js]({BASE_URL}/imgs/articles/2018-01-05-SSR-symfony-vue/appjs.png)

Commençons par créer le fichier `assets/js/entry-client.js` qui permet de "monter" l'application sur l'id `#app`

```js
import { createApp } from './app'
createApp().$mount('#app');
```

Puis il faut créer le fichier `assets/js/entry-server.js` qui, lui, permet de transformer le composant vue.js en un chaîne de caractères que vous pourrez ensuite interpréter dans le php.

```js
import { createApp } from './app'
renderVueComponentToString(createApp(), (err, res) => {
  print(res);
});
```

Et nous terminons par mettre à jour le fichier  `assets/js/app.js` qui permet d'exporter l'application pour qu'elle soit lisible par les deux fichiers précédents.

```js
import App from './components/App.vue';
import Vue from 'vue';

export function createApp() {
  return new Vue({
    render: h => h(App)
  });
}
```

Il vous faut alors changer la configuration de votre `webpack` pour générer les deux fichiers d'entrée

```js
var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')
    .addEntry('entry-client', './assets/js/entry-client.js')
    .addEntry('entry-server', './assets/js/entry-server.js')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVueLoader()
;

module.exports = Encore.getWebpackConfig();
```

Si vous changez le bloc javascript dans votre fichier  `templates/home.html.twig` par ceci.

`<script src="{{ asset('build/entry-client.js') }}"></script>`

Vous devez avoir exactement le même résultat que précédemment.

Nous allons maintenant mettre en place le SSR. Pour faire simple nous allons charger la librairie V8js qui permet à PHP d'utiliser le moteur d'interprétation de javascript.

Pour cela il vous faut installer l'extension [PHP V8js](http://php.net/manual/fr/book.v8js.php) qui vous permet ensuite d'utiliser le class `V8Js` dans votre code PHP.

Ce que l'on va faire, c'est récupérer le retour du fichier `entry-server.js` en format string et le mettre directement dans le template.

Ajoutons une fonction privée dans notre contrôleur Symfony qui va permettre de faire cela (pour faire propre il faudrait le faire dans un service).

```php
private function renderJs()
{
    $renderer_source = file_get_contents(__DIR__ . '/../../node_modules/vue-server-renderer/basic.js');
    $app_source = file_get_contents(__DIR__ . '/../../public/build/entry-server.js');
    $v8 = new \V8Js();
    ob_start();
    $v8->executeString('var process = { env: { VUE_ENV: "server", NODE_ENV: "production" }}; this.global = { process: process };');
    $v8->executeString($renderer_source);
    $v8->executeString($app_source);
    return ob_get_clean();
}
```

Il ne reste plus qu'à récupérer le résultat dans le contrôleur et à l'envoyer dans le template.

```php
/**
 * @Route("/")
 */
public function home()
{
    $ssr = $this->renderJs();
    return $this->render('home.html.twig', ['ssr' => $ssr]);
}
```

Et dans le twig vous pouvez mettre la valeur `raw` de `ssr`.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>{% block title %}Welcome!{% endblock %}</title>
        {% block stylesheets %}{% endblock %}
    </head>
    <body>
        {% block body %}
            {{ ssr|raw }}
        {% endblock %}
        {% block javascripts %}
        {% endblock %}
    </body>
</html>
```

Si tout est ok, votre page affichera "Hello World" directement dans votre code source.

![CodeSource]({BASE_URL}/imgs/articles/2018-01-05-SSR-symfony-vue/source.png)

## Conclusion

Il est assez simple de mettre en place le système à plus grande échelle et donc d'avoir à la fois la puissance d'un framework javascript même lors du premier appel.

Vous trouverez l'ensemble du code sur mon github [ici](https://github.com/CaptainJojo/symfony-vue).
