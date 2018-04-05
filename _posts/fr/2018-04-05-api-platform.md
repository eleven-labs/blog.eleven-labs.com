---
layout: post
title: Ta liste des courses avec API Platform
lang: fr
excerpt: "API Plateform se veut être un framework complet permettant de créer des projets web se basant sur des APIs orienté ressource"
authors:
    - vdelpeyroux
permalink: /fr/ta-liste-des-courses-avec-api-plateform/
categories:
    - framework
    - api
    - php
    - symfony
    - graphql
    - javascript
    - react
    - redux

tags:
    - api platform
cover: /assets/2018-04-05-api-platform/cover.jpg
---
Dans la continuité de l'article de notre très cher confrère Romain Pierlot sur [Api Platfrom](https://blog.eleven-labs.com/fr/creer-une-api-avec-api-platform/), nous allons essayer de faire le tour des nouvelles fonctionnalités de ce framework, et par la même occasion,  mettre en place une application web, comportant une api `REST Hydra` / `Graphql` avec un backend et un client full Javascript.

Pour les présentations, [API Platform](https://api-platform.com/) se veut être un framework complet permettant de créer des projets web se basant sur des APIs orientés ressource, ce qui est un peu le standard d'architecture des besoins contemporains de notre domaine.

## Installation d'API Platform

Commençons par installer ce framework en local.

Clonons donc ce projet dans notre workspace préféré

```shell
git clone git@github.com:api-platform/api-platform.git
cd api-platform
```
et ensuite mettons nous sur la dernière version taguée, au moment où j'écris cet article la dernière version est la v2.2.5 

```shell
git checkout tags/v2.2.5
```
Ce fichier docker-compose.yml à la racine du projet, ne nous laisse pas indifférent,
allons donc poper ces conteneurs docker de ce pas.
(mes versions : [docker](https://docs.docker.com/install/) :17.05.0-ce  [docker-compose](https://docs.docker.com/compose/install/) : 1.18.0)

```shell
docker-compose up -d
```

Passons rapidement en vue les images créés

```shell
docker-compose ps
```

Il y a donc 6 conteneurs docker :

 - un conteneur php, pour l'api avec PHP 7.2 et php-fpm
 - un conteneur db, pour la base de donnée [PostgreSQL](https://www.postgresql.org/)
 - un conteneur cache-proxy Varnish
 - un conteneur admin pour le backend en [React](https://reactjs.org/)
 - un conteneur api, pour le serveur http de l'api [Nginx](https://nginx.org/en/)
 - un conteneur client, contenant un client React/[Redux](https://redux.js.org/)
 - et un conteneur h2-proxy pour orchestrer toutes ces images en local

Autant vous dire qu'au niveau des technos, ils ont dépensé sans compter

Ouvrons notre navigateur pour aller à l'url [https://localhost](https://localhost)

vous allez devoir accepter d'ajouter une exception de sécurité dans votre navigateur par rapport au certificat TLS qui a été générer au moment de l'installation

si vous voyez cette belle page d'accueil, c'est que tout s'est bien passé !

![homepage]({{ site.baseurl }}/assets/2018-04-05-api-platform/ready.png)

## Création de modèle de données

Pour pouvoir créer notre api, il va falloir décrire nos ressources en codant de simple objet PHP avec leurs propriétés;
Créons pour l'exemple une simple liste de courses, parce que niveau mémoire c'est plus trop ça;
pour des questions de simplicité on va juste créer une classe shoppingItem et utiliser la vue List que propose le client API Platform que nous verrons plus tard.
(Mais sachez que les toutes les relations entre entités sont très bine géré)


```php
<?php
// api/src/Entity/ShoppingItem.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * An item of a shopping list.
 *
 * @ORM\Entity
 */
class ShoppingItem
{
    /**
     * @var int The id of this item.
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string the name of the item.
     *
     * @ORM\Column
     * @Assert\NotBlank
     */
    public $name;

    /**
     * @var boolean if the item has been purchased.
     *
     * @ORM\Column(type="boolean")
     */
    public $isCheck = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIsCheck(): ?string
    {
        return $this->isCheck ? "yes" : "no";
    }
}
```

et on va en profiter pour supprimer la classe php de démo api/src/Entity/Greeting.php

```shell
rm ./api/src/Entity/Greeting.php
```

et exécuter la commande doctrine pour synchroniser la base de données avec notre nouveau model

```shell
docker-compose exec php bin/console doctrine:schema:update --force --complete
```

le `--complete` effacera la table `gretting` de la base de donnée, ce que la commande ne fait pas par défaut

Maintenant ajoutons l'annotation magique d' API Platform à notre entité pour que le framework puisse détecter les propriétés à exposer par l'api et autoriser les opérations CRUD liés à l'objet 

```php
<?php
// api/src/Entity/ShoppingItem.php

// ...
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * ...
 *
 * @ApiResource
 */
class ShoppingItem
{
    // ...
}
```

Et voilà, notre API est ready !

Allons à cette adresse  [https://localhost:8443](https://localhost:8443)

vous devriez voir cette page  qui décrit toutes les actions possibles sur cette ressource :

![docapi]({{ site.baseurl }}/assets/2018-04-05-api-platform/apidoc.png)

Oh joie! Api Platform intègre NelmioApiDoc Bundle qui permet de documenter vos ressources et par la même occasion de les tester.
Le format par défaut  de l'api est le [JSON-LD](https://json-ld.org/) avec l'extension [Hydra](http://www.hydra-cg.com/), qui est une version plus évolué que le JSON standard donnant plus d'informations sur la ressource ainsi que les opérations possible sur cette dernière;
mais l'api supporte également les formats courants tel que le JSON, XML, HAL et très récemment le [graphQL](https://graphql.org/)...que nous allons bien évidement nous empresser d'activer de ce pas !


## Activer GraphQL

Pour cela, il va falloir installer la librairie [graphql-php](https://github.com/webonyx/graphql-php) 

```shell
docker-compose exec php composer req webonyx/graphql-php
```
et voilà! L'interface graphique GraphiQL est disponible ici [https://localhost:8443/graphql](https://localhost:8443/graphql)

![graphql]({{ site.baseurl }}/assets/2018-04-05-api-platform/graphql.png)
Rien de mieux pour commencer à se faire les dents sur ce super language

## Le Backend

API Plateform intègre [Admin On Rest](https://github.com/marmelab/admin-on-rest), un client en React avec [material design](https://github.com/material-components/material-components-web) qui se bind directement sur une api et construit ses vue en fonction des ressources disponibles et des opérations permises :
[https://localhost:444](https://localhost:444)

![admin]({{ site.baseurl }}/assets/2018-04-05-api-platform/backend.png)

En sachant que ce backend est entièrement paramétrable.

## Création d'une application React/Redux

Le dernier point que j'aborderai et qui n'est pas des moindres, c'est la génération d'une Progressive Web App avec React/Redux, mais il est également possible de générer une application en [Vue.js](https://vuejs.org/) ou une application en [React Native](https://facebook.github.io/react-native/)

Créons notre application Javascript

```shell
docker-compose exec client generate-api-platform-client
```

![console]({{ site.baseurl }}/assets/2018-04-05-api-platform/consolegen.png)

Ajoutons maintenant les routes et les reducers générés dans index.js comme ceci

```js
//client/src/index.js

import React from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import registerServiceWorker from './registerServiceWorker';
import Welcome from './Welcome';
import shoppingitem from './reducers/shoppingitem/';
import shoppingitemRoutes from './routes/shoppingitem';

const store = createStore(
  combineReducers({routing, form, shoppingitem}),
  applyMiddleware(thunk),
);

const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/" component={Welcome} strict={true} exact={true}/>
        {shoppingitemRoutes}
        <Route render={() => <h1>Not Found</h1>}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();

```

Concernant le choix des librairies nous remarquerons que React Router est utilisé pour la navigation,
Redux Form pour gérer les formulaires et Redux Thunk pour gérer les requêtes ou autres traitements asynchrones (désolé pour les redux-saga users), avec une gestion des Services Workers


Nous pouvons maintenant aller à l'url de la vue `list` de notre ressource `shoppingItem`: [https://localhost/shopping_items/](https://localhost/shopping_items/)
Parfait, vous avez votre liste de courses en react/redux qui va bien

![listecourse]({{ site.baseurl }}/assets/2018-04-05-api-platform/listcourse.png)


## Pour conclure
 
Ce framework est vraiment des plus complet, ce que l'on vient d'aborder ne concerne même pas le quart de ce que propose API Platform dans sa globalité, et toutes se basent sur de bonnes pratiques.

Le seul point négatif que l'on peut lui trouver c'est son architecture qui est orienté événement, se basant sur le système des events kernel de Symfony;
l'avantage est que cela donne une grande liberté pour développer de nouvelles fonctionnalité;
mais devient un inconvénient sur de gros projet où, si l'historique du code, produit par moult développeurs sûrement très bien attentionnés, devient un peu trop conséquent, ça peut très vite partir dans tout les sens, et au final être un enfer à debugger.

## À venir
J'aurai aimé vous parler de l'intégration de FOSuser bundle avec l'autentification JWT, des tests en Behat, PHPUnit, déployer son projet API Platform sur un Kubernites cluster en quelques lignes de commande mais le temps me manque, je vous réserve donc cela pour la prochaine fois.
