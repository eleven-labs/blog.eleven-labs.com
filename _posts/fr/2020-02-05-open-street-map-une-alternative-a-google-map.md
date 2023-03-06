---
layout: post
lang: fr
date: '2020-02-05'
categories:
  - javascript
authors:
  - talgrin
excerpt: Ajouter une carte interactive sans utiliser Google Maps
title: OpenStreetMap - une alternative à Google Maps
slug: open-street-map-une-alternative-a-google-map
oldCategoriesAndTags:
  - javascript
  - es6
  - open street map
permalink: /fr/open-street-map-une-alternative-a-google-map/
---

## Intro
En tant que développeur, j'ai un jour dû ajouter une carte interactive sur un site.
On avait pris l'habitude d'utiliser Google Maps, qui proposait une offre gratuite avec une limite de requêtes par mois. Il existait aussi une autre offre payante, elle sans restrictions. Mais l'offre gratuite a fini par ête supprimée...

Ne pouvant pas prendre la version payante, je me suis intéressé à une version open source de Google Maps appelée [Open Street Map](https://www.openstreetmap.fr/)

Dans cet article, je vous propose de vous montrer l'utilisation de cette solution dans un écosystème Symfony.
Ainsi, nous aborderons les points suivants :

 - Installer les différentes librairies
 - Chercher une adresse
 - Ajouter notre position sur la carte

## La Stack Technique

- Symfony 4.4
-   WebpackLibrairie JS :
	-   Jquery
	-   Bootstrap
	-   Leaflet
	-   Leaflet-easybutton
	-   devbridge-autocomplete
	-   @ansur/leaflet-pulse-icon

## Les bases : affichons une carte

Commençons par installer les différentes librairies JS dont nous aurons besoin en lançant la commande suivante :
``` bash
yarn add leaflet leaflet-easybutton @ansur/leaflet-pulse-icon @ansur/leaflet-pulse-icon devbridge-autocomplete
```

Créons un composant JS qui aura la responsabilité de gérer notre carte.
```jsx
// assets/js/components/map.js
'use strict';

import L from 'leaflet';
import 'devbridge-autocomplete';

// Pour une raison obscure, lorsque nous utilisons Webpack, nous devons redéfinir les icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

require('leaflet-easybutton');
require('@ansur/leaflet-pulse-icon');

class Map {
    init(mapId, center = [45.5, 2], zoom = 5) {
        this.map = L.map(mapId, { center: center, zoom: zoom });
        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }
}

export default Map;
```
Comme Google Map, nous devons définir un container HTML
```twig
{# templates/default/index.html.twig #}
<div class="container">
    <div class="row">
        <div class="col-10">
            <div id="map"></div>
        </div>
        <div class="col-2">
            <input type="text" name="address" id="address" />
        </div>
    </div>
</div>
```
Sans oublier le SCSS, sinon la carte ne s'affiche pas
```css
// assets/scss/map.scss
@import "~bootstrap";
@import "~leaflet";
@import "~@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css";

#map {
   height: 500px;
}
```

![]({{ site.baseurl }}/assets/2020-02-05-open-street-map-une-alternative-a-google-map/init-map.jpeg)

## Chercher une adresse
Notre besoin est le suivant : lorsque je commence à entrer une adresse ou le nom de mon bar favori, je voudrais avoir une liste déroulante qui affiche les différentes propositions sans utiliser Google. Lorsque je clique sur une adresse, un marqueur s'affiche sur la carte.

Pour ce faire, nous allons faire appel à une [API tiers](https://photon.komoot.de), gratuite, qui va convertir une recherche en longitude et latitude.

Pour afficher la liste des suggestions, nous allons utiliser le composant Jquery `autocomplete` comme suit :
```jsx
_search () {
     let proprieties = ['name', 'housenumber', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country'];

     $('#address').autocomplete({
         serviceUrl: 'https://photon.komoot.de/api/',
         paramName: 'q',
         params: { lang: 'fr', limit: 5 },
         dataType: 'json',
         onSelect: (suggestion) => {
             let position = suggestion.data.geometry.coordinates;

             // À la selection, on ajoute un marqueur sur la carte et on la recentre
             L.marker([position[1], position[0]]).addTo(this.map);
             this.map.setView([position[1], position[0]], 12);
         },
         transformResult: (response) => {
             // On reformate la réponse de l'api afin de respecter le contrat du plugin
             return {
                 suggestions: $.map(response.features, (dataItem) => {
                     return {
                         value: proprieties
                             .map((p) => { return dataItem.properties[p]; })
                             .filter((v) => { return !!v; }).
                             join(', '),
                         data: dataItem
                     };
                 })
             };
         }
     });
 }
```

## Afficher notre localisation

Il existe, en HTML 5, un composant natif  ``navigator.geolocation`` pour géolocaliser la personne. Pas de panique, lorsque l'on utilise une pop-in demandant l'autorisation s'affiche :

![]({{ site.baseurl }}/assets/2020-02-05-open-street-map-une-alternative-a-google-map/pop-in.jpeg)

<div class="admonition important" markdown="1"><p class="admonition-title">Important</p>

Il faut que le site soit en https pour que la géolocalisation HTML se fasse
</div>

Nous avons deux situations :
 - l'utilisateur accepte, c'est super, on affiche un marqueur sur la carte
 - l'utilisateur refuse, c'est moins cool, mais on peut par exemple estimer une zone géographique en utilisant son adresse IP

### Étape 1 : la géolocalisation en JS

Comme promis, nous allons utiliser la notion `navigator.geolocation` mais surtout la méthode ``getCurrentPosition``. Elle prend deux callbacks, d'une part pour exécuter du code en cas de succès et d'autre part en cas d'échec. Le callback d'erreur s'exécute si l'utilisateur refuse de donner sa position.

Je suis parti du principe que nous aurions besoin d'utiliser ce code plusieurs fois. Ainsi, j'ai créé un composant `Utils`
```jsx
'use strict';

class Utils {
     static getCurrentPosition(success) {
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                 (position) => success('js', position.coords),
                 () => success('php', Utils.getCurrentPositionWithPhp()),
                 { enableHighAccuracy: true }
             );
         } else {
             console.error('navigator.geolocation is not enable to this navigator');
             success('php', Utils.getCurrentPositionWithPhp());
         }
     }

     static getCurrentPositionWithPhp() {
         console.log('Get position by PHP');
     }
}

export default Utils;
```

Vous l'aurez compris, nous allons l'appeler dans notre composant `map`
```jsx
_getCurrentPosition() {
    Utils.getCurrentPosition((provider, coords) => {
        if (provider === 'js') {
        //On stocke la position de l'utilisateur pour centrer la carte s'il clique sur le bouton de position
            this.latitude = coords.latitude;
            this.longitude = coords.longitude;
            // On ajoute un icon différent de nos lieux
            const icon = L.icon.pulse({ color: 'blue', fillColor: 'blue', heartbeat: 3 });
            // On ajoute le marqueur sur la carte
            L.marker([coords.latitude, coords.longitude], { icon: icon }).addTo(this.map);
            // On crée un nouveau bouton pour localiser l'utilisateur
            L.easyButton({
                position: 'topright',
                states: [{
                    onClick: () => this.map.setView([this.latitude, this.longitude], 12),
                    title: 'Me localiser',
                    icon: '<span class="target">&target;</span>'
                }],
            }).addTo(this.map);
            this.map.setView(new L.LatLng(this.latitude, this.longitude), 12);
       } else {
           // On recentre la carte par rapport aux coordonnées récoltées en PHP
           this.map.setView(new L.LatLng(coords.lat, coords.lon), 11);
       }
    });
}
```
![]({{ site.baseurl }}/assets/2020-02-05-open-street-map-une-alternative-a-google-map/current-position-js.jpeg)

### Étape 2 : Localisation en PHP

Lorsque l'utilisateur refuse la localisation, nous pouvons estimer une zone géographique en utilisant son IP grâce à http://ip-api.com/json
L'idée est de faire appel, avec - par exemple -  le client HTTP de Symfony, à cette api, de stocker le résultat dans **du cache** afin d'optimiser. Et oui c'est pour cela que nous allons utiliser l'éco-système de Symfony ; car nous ne pouvons pas le faire en JS car c'est une adresse en HTTP.

Et bien let's go :
```php
<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\Localisation\LocalisationInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use Symfony\Component\Cache\CacheItem;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Class LocalisationController.
 */
 Class LocalisationController
{
  /**
   * @var LoggerInterface
   */
  private $logger;

  /**
   * @var HttpClientInterface
   */
  private $client;

  /**
   * @var CacheInterface
   */
  private $cache;

  /**
   * LocalisationController constructor.
   *
   * @param LoggerInterface $logger
   * @param CacheInterface $cache
   * @param HttpClientInterface $client
   */
  public function __construct(LoggerInterface $logger, CacheInterface $cache, HttpClientInterface $client)
  {
      $this->logger = $logger;
      $this->cache = $cache;
      $this->client = $client;
  }

  /**
   * @Route("/localisation", name="localisation", options={"expose"=true})
   * @param Request $request
   *
   * @return JsonResponse
   */
  public function getCurrentLocalisation(Request $request): JsonResponse
  {
     $ip = $request->query->get('ip');

     /** @var CacheItem $item */
     $item = $this->cache->getItem($ip);

     // On vérifie si l'item cache est toujours valable
     if (!$item->isHit()) {
      $url = sprintf('http://ip-api.com/json/%s', $ip);
      $response = $this->client->request('GET', $url);
      $this->logger->info('User localisation', ['provider' => 'ip', 'url' => $url, 'response' => $response]);

      //On stocke la valeur et on ajoute une date d'expiration
      $item
          ->set($response->toArray())
          ->expiresAfter(3600)
      ;
      $this->cache->save($item);
     }

     return new JsonResponse($item->get());
  }
}
```
Maintenant, appellons cette route en Ajax dans notre composant `utils` dans la méthode `getCurrentPositionWithPhp`


```jsx
static getCurrentPositionWithPhp() {
     // On la conserve dans sessionStorage pour éviter de surcharger notre back
     if (sessionStorage['localisation']  === undefined) {
         $.ajax({
             url: '/localisation?ip=' + Utils.getAddressIp(),
             type: 'GET',
             dataType: 'json',
             async: false,
             success: (data) => {
                 sessionStorage['localisation'] = JSON.stringify(data);
             }
         });
     }

     return JSON.parse(sessionStorage['localisation']);
 }

 static getAddressIp() {
     // Là aussi, on la conserve dans sessionStorage pour éviter de surcharger notre back
     if (sessionStorage['ip'] === undefined) {
         $.ajax({
             url : 'https://api.ipify.org/?format=json',
             type : 'GET',
             dataType : 'json',
             async: false,
             success: (data) => {
                 sessionStorage['ip'] = data.ip;
             }
         });
     }

     return sessionStorage['ip'];
 }
```

## Conclusion

En conclusion, nous pouvons dire que l'alternative OpenStreetMap peut réellement rivaliser avec son concurrent le plus célèbre, tout en étant gratuit. C'est votre porte-monnaie qui va être content !
J’espère que vous avez apprécié cet article et que vous allez prendre beaucoup de plaisir à jouer avec OpenStreetMap.

À bientôt pour de nouvelles aventures ;)

