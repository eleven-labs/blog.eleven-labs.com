---
lang: fr
date: '2017-04-11'
slug: http2-nest-pas-le-futur-cest-le-present
title: HTTP/2 n'est pas le futur. C'est le présent.
excerpt: >-
  Souvenez-vous, en `mai 1996`, la première version du protocole HTTP (HTTP/1.0)
  voit le jour.
authors:
  - vcomposieux
categories:
  - javascript
  - php
keywords:
  - mobile
  - compression
  - header
  - http
  - http2
  - protocole
  - tls
---
Souvenez-vous, en `mai 1996`, la première version du protocole HTTP (HTTP/1.0) voit le jour.
Ce protocole est décrit sous forme de RFC et plus particulièrement sous la [RFC 1945](https://tools.ietf.org/html/rfc1945).

Mais le temps a passé et les applications web ont énormément évoluées. Nous avons maintenant des applications front qui apportent de plus en plus de logique dans le navigateur et avons donc également de plus en plus d'assets à charger : de plus en plus de CSS avec des règles d'animations, parfois des opérations complexes définies en CSS, de plus en plus de fichiers Javascript, et enfin de plus en plus d'images.

Si `HTTP/1.1` est sorti et nous a permis l'utilisation des nouvelles technologies que nous avons connues ces dernières années, l'usage de plus en plus intensif des smartphones et appareils connectés nécessite désormais d'améliorer les performances de chargement de nos applications HTTP.

Après une première étape menée en 2009 par Google avec le protocole `SPDY`, c'est finalement dans ce sens que va `HTTP/2` et sa [RFC 7540](https://tools.ietf.org/html/rfc7540).

# Introduction à HTTP/2

Aujourd'hui, le protocole HTTP/2 est supporté par la plupart des navigateurs. Au moment de l'écriture de cet article, seul Opera Mini se fait encore désirer :

![Can I use HTTP/2?](/_assets/posts/2017-04-12-http2-future-present/caniuse.jpg)

Il est donc possible d'envisager dès maintenant de passer vos applications web à HTTP/2 et ainsi offrir des performances de navigation accrues à vos visiteurs.

En effet, HTTP/2 va vous permettre d'apporter les fonctionnalités que nous allons décrire dans la suite de ces article.

## Support natif de TLS

Si le chiffrement n'est `pas obligatoire`, certains navigateurs ne supportent HTTP/2 qu'avec la méthode de chiffrement TLS associée, et ce n'est pas plus mal car étant donné qu'il est de plus en plus simple d'obtenir un certificat SSL de nos jours, cela ne pose donc aucun soucis et vous permet de sécuriser davantage vos applications.

Si vous n'utilisez pas le chiffrement, le diminutif donné au protocole est `h2c` . Ce sera  `h2`  si vous utilisez le chiffrement.

Si vous souhaitez plus d'informations sur la configuration du protocole TLS afin d'[améliorer la sécurité des échanges SSL](https://vincent.composieux.fr/article/ameliorer-la-securite-des-echanges-ssl-effectues-par-votre-serveur), je vous invite à lire mon article sur le sujet.

## Multiplexage de flux

Si HTTP/1 chargeait les ressources les unes après les autres, comme en décrit la cascade de chargement des ressources d'une application ci-dessous, HTTP/2 va vous permettre de gagner du temps au niveau des états d'attente car plusieurs ressources pourront être directement déchargées dans le même flux de réponse HTTP.

![Waterfall HTTP](/_assets/posts/2017-04-12-http2-future-present/waterfall_http.jpg)

Ici, le temps passé en vert correspond au temps d'attente avant le chargement de la ressource, le temps passé en violet correspond au temps d'attente de chargement de la ressource (TTFB - Time To First Byte) et enfin le temps en gris correspond au temps de réception de la ressource.

Voici à quoi ressemble le chargement des ressources sous le protocole HTTP/2 :

![Waterfall HTTP/2?](/_assets/posts/2017-04-12-http2-future-present/waterfall_http2.jpg)

Nous voyons clairement ici que le temps alloué à attendre les ressources (le temps en vert) a complètement disparu et que toutes les ressources sont bien chargées "en même temps", en utilisant le même flux.

De plus, étant donné que les moteurs de recherche se basent de plus en plus sur le temps de chargement des pages pour améliorer leur référencement, le passage au protocole HTTP/2 est également un gros plus pour le `SEO`.

Pour bien vous rendre compte de la vitesse de chargement des ressources, je vous propose la démo suivante :

* Chargement avec `HTTP/1.1` : [http://http2.golang.org/gophertiles?latency=0](http://http2.golang.org/gophertiles?latency=0)
* Chargement avec `HTTP/2` : [https://http2.golang.org/gophertiles?latency=0](https://http2.golang.org/gophertiles?latency=0)

## HPACK : Compression des headers

Cette nouvelle version du protocole vient également avec une compression des headers envoyés par le serveur afin d'optimiser les flux échangés.

Ainsi, si on effectue une première requête sur un site HTTP/2 et que nous récupérons les headers suivants :

```
:authority: vincent.composieux.fr
:method: GET
:path: /
:scheme: https
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
accept-encoding: gzip, deflate, sdch, br
```

Lors de ma prochaine requête, les headers `:authority` , `:method` , `:scheme` , `accept`  et `accept-encoding` ne vont potentiellement pas changer.
HTTP/2 effectuera alors une compression sur ceux-ci.

Pour vous rendre compte de la compression des headers, je vous invite à utiliser l'outil [h2load](https://nghttp2.org/documentation/h2load-howto.html) permettant d'effectuer un benchmark des appels HTTP/2, en effectuant ici deux requêtes sur votre application :

```bash
$ h2load https://vincent.composieux.fr -n 2 | grep traffic
traffic: 32.25KB (33023) total, 650B (650) headers (space savings 25.29%), 31.51KB (32270) data
```

On voit ici que mes headers m'ont permis d'`économiser 25,29%` d'échanges dans les headers.

## Server Push (preload)

Ceci est une petite révolution dans le chargement des ressources d'un navigateur.

Votre serveur va en effet pouvoir pousser dans le cache de votre navigateur des ressources dont votre application aurait (ou pourrait avoir) besoin, et ce, uniquement lorsque vous détectez que le client en aura besoin.

Afin de pré-charger une ressource (preload), il vous suffit d'envoyer un header HTTP de la forme suivante :

```
Link: </fonts/myfont.woff2>;rel="preload";as="font"
```

Vous pouvez bien sûr définir plusieurs headers `Link` , et les attributs `as` peuvent prendre les valeurs suivantes : `font` , `image` , `style`  ou `script`.

Il est également possible d'utiliser le markup HTML pour précharger vos ressources :

```html
<link rel="preload" href="/fonts/myfont.woff2" as="font">
```


Aussi, si vous utilisez le framework PHP [Symfony](https://www.symfony.com), notez que celui-ci a intégré le push d'assets dans sa version 3.3. Pour se faire, il vous suffit de spécifier dans Twig :

{% raw %}
```html
<link href="{{ preload(asset('/fonts/myfont.woff2'), { as: 'font' }) }}">
```
{% endraw %}

Pour plus d'informations, rendez-vous sur : [http://symfony.com/blog/new-in-symfony-3-3-asset-preloading-with-http-2-push](http://symfony.com/blog/new-in-symfony-3-3-asset-preloading-with-http-2-push)

Notez également qu'un nouveau composant Symfony est à l'étude sur [cette Pull Request](https://github.com/symfony/symfony/pull/22273) afin de gérer tous les types de liens disponibles afin d'effectuer du pré-chargement ou du push (preload, preset, prerender, ...).

## Server Hints (prefetch)

Notez que cette méthode n'est pas liée à HTTP/2 car disponible bien avant mais il est toutefois intéressant d'aborder la différence entre ces deux méthodes `prefetch`  et `preload`.

Si preload va en effet charger une ressource dans le `cache du navigateur`, prefetch lui, va s'assurer que le client ne l'a pas déjà à disposition et récupérera la ressource `uniquement si le client en a besoin`.

Son fonctionnement est identique sauf que vous n'avez pas besoin de préciser l'attribut `as`:

```
Link: </fonts/myfont.woff2>; rel=prefetch
```

# Utiliser le protocole HTTP/2

Si vous utilisez nginx, le protocole HTTP/2 est supporté depuis la `version 1.9.5` et il vous suffit simplement de spécifier dans l'attribut `listen`  que vous souhaitez utiliser : "http2"
Exemple :

```lua
server {
    listen 443 ssl http2;
    ...
```

Afin de vous assurer que HTTP/2 est bien activé sur votre serveur, je vous invite à taper `nginx -V`  afin de vous assurer que vous disposiez bien de l'option de compilation `--with-http_v2_module`  ainsi qu'à vérifier que votre version d'OpenSSL utilisée par nginx est récente.

À partir de là, vous n'avez plus qu'à redémarrer votre serveur web afin de profiter du protocole.

`Note` : Pour information, si le protocole http/2 n'est pas disponible dans le navigateur du client, le serveur web effectuera tout seul une fallback sur le protocole http/1.1.

Côté Apache, les `versions 2.4.12` et supérieures supportent également le protocole.

Globalement, l'activation du protocole HTTP/2 est assez simple. Si vous venez du monde Javascript, un package [http2](https://www.npmjs.com/package/http2) est également disponible afin d'instancier un serveur `express` avec la nouvelle version du protocole.

# Conclusion

HTTP/2 peut être dès maintenant utilisé sur vos applications web et ne peut faire que du bien à celles-ci sur plusieurs aspects (performances, SEO, chiffrement, ...).
Sa facilité de mise en place et son support sur un grand nombre de technologies est également un atout majeur qui devrait vous aider à passer le cap !

Et après ? Aucun travail n'est actuellement commencé au sujet d'HTTP/3 mais l'avenir et les technologies nous réserveront bien une troisième version de ce protocole tant utilisé !
