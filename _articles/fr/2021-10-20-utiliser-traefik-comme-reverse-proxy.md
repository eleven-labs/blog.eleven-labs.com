---
contentType: article
lang: fr
date: '2021-10-20'
slug: utiliser-traefik-comme-reverse-proxy
title: Utiliser traefik comme reverse proxy
excerpt: >-
  Besoin d’exposer facilement des sites et applications web sur Internet avec un
  certificat SSL valide ? C’est ici :)
categories:
  - architecture
authors:
  - jmoati
keywords:
  - devops
---

![Cover]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/cover.jpg)

## Introduction

J'ai à la maison un nas, un Raspberry pi sous Octopi, un serveur sous Debian, bref, une multitude d'objets communiquants qui délivrent des sites et des applications mais qui ne sont pas facilement accessibles à l'extérieur de chez moi, et encore moins par le biais d'une connexion sécurisée.

Pour rendre tout ce joli monde accessible avec la seule IP publique dont je dispose, il me sera nécessaire d'utiliser un système de reverse proxy.

Mais c’est quoi au fait un reverse proxy ?

> Un **proxy inverse** (_reverse proxy_) est un type de [serveur](https://fr.wikipedia.org/wiki/Serveur_informatique "Serveur informatique"), habituellement placé en [frontal](https://fr.wikipedia.org/wiki/Frontal_(serveur) "Frontal (serveur)") de [serveurs web](https://fr.wikipedia.org/wiki/Serveur_web "Serveur web"). Contrairement au serveur [proxy](https://fr.wikipedia.org/wiki/Proxy "Proxy") qui permet à un utilisateur d'accéder au réseau [Internet](https://fr.wikipedia.org/wiki/Internet "Internet"), le proxy inverse permet à un utilisateur d'Internet d'accéder à des serveurs internes. Une des applications courantes du proxy inverse est la [répartition de charge](https://fr.wikipedia.org/wiki/R%C3%A9partition_de_charge "Répartition de charge") (load-balancing).
>
> Wikipedia


Il existe beaucoup de solutions de reverse proxy sur le marché mais nous allons nous focaliser sur celle de traefik qui nous permettra de :
 - rediriger des requêtes HTTP ou TCP à un autre serveur
 - faire de l'auto-discovery avec Docker par exemple
 - disposer d'une connexion sécurisée grâce à un certificat let's encrypt

Bien sûr pour que tout fonctionne, vous devez disposer d'un nom de domaine (dans mon cas wilson.net) et faire pointer les différentes zones dns sur votre serveur.

![Mes zones dns]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/11-zones.jpg)

Sinon vous pouvez aussi simuler un nom de domaine dans votre fichier `/etc/hosts` mais dans ce cas la génération d'un certificat SSL ne sera pas possible.

Je vous invite à suivre cet article pour que nous mettions tout cela en place :)


## Mise en place de Traefik

Pour commencer, vous devez mettre en place Traefik sur un serveur accessible à Internet.

Pour moi, ce sera la machine 192.168.0.1 : c'est celle sur laquelle je redirige les ports 80 (HTTP) et 443 (HTTPS) de ma freebox.

![Mes ports dans la freebox]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/01-ports.jpg)

Vous pouvez aussi bien installer l'exécutable, compiler le logiciel à partir de ses sources ou bien comme dans notre exemple, le déployer avec une image Docker.

Nous allons utiliser docker-compose pour ne pas avoir à retaper toujours la commande et pouvoir l'agrémenter au fil du temps de nouveaux éléments de configuration.

Créons donc notre premier fichier `/srv/docker-compose.yaml`:
``` yaml
version: '3'

services:
  reverse-proxy:
    restart: always
    image: traefik:v2.0
    ports:
    - "443:443"
    - "80:80"
    volumes:
    - /srv/traefik.toml:/etc/traefik/traefik.toml
```

Si, pour une raison ou une autre, notre serveur doit redémarrer, `restart: always` nous permettra d’avoir notre service reverse-proxy qui se relancera automatiquement tout seul.

Dans la partie `ports` nous rendons accessibles nos ports du service *reverse-proxy* à l'extérieur de celui-ci.

Dans la partie `volume` nous partageons des fichiers et/ou des répertoires avec notre service.

C'est bien beau de partager le fichier `/srv/traefik.toml` avec notre container, mais il faudrait peut-être le créer, non ?

Nous allons donc créer le fichier de configuration de traefik qui déclarera à minima les deux endpoints précédents dans un fichier `/srv/traefik.toml`

``` toml
[entryPoints]
  [entryPoints.http]
  address = ":80"
  [entryPoints.https]
  address = ":443"
```

Nous pouvons ensuite lancer notre service de reverse proxy en nous trouvant dans le répertoire `/srv` avec la commande :

``` shell
docker-compose up -d
```

![Démarrage de traefik avec docker-compose]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/02-docker-compose-up.jpg)

Bien sûr si on visite la page de notre serveur, on obtient pour le moment une petite 404, mais c'est déjà la preuve qu'il est là et qu'il n'attend plus que de nous servir un contenu.

![Traefik renvoie une 404]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/03-nothing-for-the-moment.jpg)

## Configurer le tableau de bord

Nous avons pu voir que notre reverse-proxy traefik tourne mais il n'a rien à afficher pour le moment.

Nous allons lui ajouter le tableau de bord ce qui nous permettra de savoir si nos services, endpoints et règles de routages sont correctement prises en compte par traefik.

Nous allons tout d'abord ajouter `[api]` pour activer le dashboard et l'api ainsi que `[providers.docker]` pour activer le support de Docker et des labels.

Traefik a besoin de connaître le chemin vers le socket de Docker afin d'activer son provider.

Notre fichier de configuration `/srv/traefik.toml` devrait maintenant ressembler à cela :

``` toml
[entryPoints]
  [entryPoints.http]
  address = ":80"
  [entryPoints.https]
  address = ":443"

[api]

[providers.docker]
  endpoint = "unix:///var/run/docker.sock"
```

Nous allons devoir générer un mot de passe afin d'accéder au tableau de bord pour qu'il ne soit pas accessible à n'importe qui.

Cela se fait avec htpasswd.

Comme nous ne voulons pas l'installer sur notre belle machine, nous allons faire appel à une image Docker de apache pour hasher notre mot de passe :

``` shell
docker run --rm --name apache httpd:alpine htpasswd -nb wilson schizo
```

![Génération du mot de passe]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/04-password.jpg)

Dans cet exemple, *wilson* est mon login tandis que *schizo* sera mon mot de passe.

Le résultat est donné sous la forme : `wilson:$apr1$1eZu7RXg$Ql9Z5AvZNc0Oe4In900mi0`

Une fois le mot de passe hashé en notre possession, nous allons ajouter un middleware basicauth qui sera en charge de sécuriser l'accès à la page avec la demande du mot de passe avec `traefik.http.middlewares.auth.basicauth.users=wilson:$$apr1$$1eZu7RXg$$Ql9Z5AvZNc0Oe4In900mi0`.

Définir le endpoint (http) avec `traefik.http.routers.api.entrypoints=http`.

Dire que l'on veut faire appel au service *api* qui est mis à disposition par le provider *internal* : `traefik.http.routers.api.service=api@internal`

Il ne nous reste donc plus qu'à adapter le fichier `/srv/docker-compose.yaml` qui devrait nous donner :

```yaml
version: '3'

services:
  reverse-proxy:
    restart: always
    image: traefik:v2.0
    ports:
    - "443:443"
    - "80:80"
    volumes:
    - /srv/traefik.toml:/etc/traefik/traefik.toml
    - /var/run/docker.sock:/var/run/docker.sock
    labels:
    - "traefik.http.routers.api.rule=Host(`traefik.home.wilson.net`)"
    - "traefik.http.routers.api.service=api@internal"
    - "traefik.http.routers.api.entrypoints=http"
    - "traefik.http.routers.api.middlewares=auth"
    - "traefik.http.middlewares.auth.basicauth.users=wilson:$$apr1$$1eZu7RXg$$Ql9Z5AvZNc0Oe4In900mi0"
```

Je souhaite attirer votre attention sur le fait que j'ai dû doubler les `$` pour échapper le caractère `$` qui cherche à faire appel à une variable.

Il est important de garder la cohérence des noms entre les routers et les middlewares.

Là, le nom de ma règle est api, vous pouvez mettre ce que vous désirez du moment que vous ne l'utilisez pas pour un autre service et que le nom est le même partout.

On peut maintenant demander à notre service de prendre en compte les modifications en nous trouvant dans le répertoire `/srv` et en exécutant une nouvelle fois la commande :

``` shell
docker-compose up -d
```

Voici ce que j'obtiens quand j'accède à l'url définie dans ma règle de routage plus haut :

![Dashboard]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/05-dashboard.jpg)


## Reverse proxy d'un site accessible sur le réseau local

J'ai sur mon réseau mon nas, que je souhaiterais rendre accessible de l'extérieur.

![Mon nas synology]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/06-nas-http.jpg)

Il va falloir le déclarer par le provider `file` car il ne peut pas être découvert automatiquement comme avec Docker.

Nous allons donc créer pour cela un fichier `/srv/services.toml` :

```toml
[http]
  [http.services]
    [http.services.nas]
      [http.services.nas.loadBalancer]
        [[http.services.nas.loadBalancer.servers]]
          url = "http://192.168.0.11:5000/"
```

Mon nas a ici comme ip `192.168.0.11` et attend des requêtes http sur le port 5000.

Je vais ajouter le provider file dans mon fichier `/srv/traefik.toml` afin de charger ce fichier de services :

```toml
[entryPoints]
  [entryPoints.http]
  address = ":80"
  [entryPoints.https]
  address = ":443"

[api]

[providers.docker]
  endpoint = "unix:///var/run/docker.sock"

[providers.file]
  filename = "/etc/traefik/services.toml"
```

Comme vous pouvez le constater, le container cherchera le fichier dans son répertoire `/etc/traefik`, toutefois, nous le mettrons dans `/srv`.

Nous allons définir ces règles de routages dans `/srv/docker-compose.yaml` sous forme de labels :

```yaml
version: '3'

services:
  reverse-proxy:
    restart: always
    image: traefik:v2.0
    ports:
    - "443:443"
    - "80:80"
    volumes:
    - /srv/traefik.toml:/etc/traefik/traefik.toml
    - /srv/services.toml:/etc/traefik/services.toml
    - /var/run/docker.sock:/var/run/docker.sock
    labels:
    - "traefik.http.routers.api.rule=Host(`traefik.home.wilson.net`)"
    - "traefik.http.routers.api.service=api@internal"
    - "traefik.http.routers.api.entrypoints=http"
    - "traefik.http.routers.api.middlewares=auth"
    - "traefik.http.middlewares.auth.basicauth.users=wilson:$$apr1$$1eZu7RXg$$Ql9Z5AvZNc0Oe4In900mi0"

    - "traefik.http.routers.nas.entrypoints=http"
    - "traefik.http.routers.nas.rule=Host(`nas.wilson.net`)"
    - "traefik.http.routers.nas.service=nas@file"
```

Vous l'avez sûrement déjà compris mais le nom du service est toujours sous la forme [nom du service]@[provider].

`rule` me permet de définir quelle route me permet d'accéder à mon service. Ici, je matche uniquement sur le nom de domaine qui doit être `nas.wilson.net`.

N'oublions pas de demander à docker-compose de prendre notre nouvelle configuration en compte :

``` shell
docker-compose up -d
```

Voilà, quand j'accède maintenant à mon nas par le host déclaré plus haut j'ai cela :

![Mon nas synology reversed]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/07-nas-reversed.jpg)


## Génération d'un certificat SSL


Nous pouvons très facilement générer des certificats SSL avec let's encrypt qui seront automatiquement renouvelés et cela gratuitement.

Vous n'avez donc plus aucune excuse maintenant pour ne pas passer à HTTP2 et sécuriser les données de vos utilisateurs.

Pour générer un certificat let's encrypt, il me faut créer et rendre accessible à traefik un fichier `/srv/acme.json` afin qu'il puisse y conserver les différents certificats :

```shell
 touch /srv/acme.json
 ```

puis ajouter le fichier dans la partie volume : `/srv/acme.json:/acme.json` de votre fichier `/srv/docker-compose.yaml`

Dans `/srv/traefik.toml`, je déclare un certificatesResolver qui me permettra d'obtenir des certificats avec :

```toml
[certificatesResolvers.wilson.acme]
  email = "VOTRE@MAIL.COM"
  storage = "acme.json"
  [certificatesResolvers.wilson.acme.httpChallenge]
    entryPoint = "http"
```

Ce qui me donnera comme fichier `/srv/traefik.toml` :

```toml
[entryPoints]
  [entryPoints.http]
  address = ":80"
  [entryPoints.https]
  address = ":443"

[api]

[providers.docker]
  endpoint = "unix:///var/run/docker.sock"

[providers.file]
  filename = "/etc/traefik/services.toml"

[certificatesResolvers.wilson.acme]
  email = "VOTRE@MAIL.COM"
  storage = "acme.json"
  [certificatesResolvers.wilson.acme.httpChallenge]
    entryPoint = "http"
```

Attention, votre email doit être obligatoirement renseigné.

Dans `/srv/docker-compose.yaml` il nous reste à ajouter des labels pour faire le certificat SSL de mon nas ce qui donnera :

```yaml
version: '3'

services:
  reverse-proxy:
    restart: always
    image: traefik:v2.0
    ports:
    - "443:443"
    - "80:80"
    volumes:
    - /srv/traefik.toml:/etc/traefik/traefik.toml
    - /srv/services.toml:/etc/traefik/services.toml
    - /var/run/docker.sock:/var/run/docker.sock
    labels:
    - "traefik.http.routers.api.rule=Host(`traefik.home.wilson.net`)"
    - "traefik.http.routers.api.service=api@internal"
    - "traefik.http.routers.api.entrypoints=http"
    - "traefik.http.routers.api.middlewares=auth"
    - "traefik.http.middlewares.auth.basicauth.users=wilson:$$apr1$$1eZu7RXg$$Ql9Z5AvZNc0Oe4In900mi0"

    - "traefik.http.routers.nas.entrypoints=https,http"
    - "traefik.http.routers.nas.rule=Host(`nas.wilson.net`)"
    - "traefik.http.routers.nas.service=nas@file"
    - "traefik.http.routers.nas.tls=true"
    - "traefik.http.routers.nas.tls.certresolver=wilson"
```

`entrypoints` indique que je souhaite un accès https, sinon, http.

`tls`, que je souhaite utiliser un certificat SSL.

`tls.certresolver` quel certresolver je devrais utiliser.

N'oublions pas de demander à docker-compose de prendre notre nouvelle configuration en compte :

``` shell
docker-compose up -d
```

Une fois ceci fait, j'ai un accès à mon nas sécurisé par HTTPS :D

![Mon nas synology https]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/08-nas-https.jpg)

Et puis bien sûr, je peux le voir aussi dans mon dashboard traefik :

![Mon nas synology dashboard]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/09-traefik-dashboard-nas.jpg)

## Reverse proxy de services tournants sous Docker

Maintenant que nous savons écrire les différentes règles de routage pour un service ainsi que générer un certificat SSL, il va nous être enfantin de faire la même chose pour un service Docker.

Après avoir lu l'article [DOMOTISER SON ESPACE DE TRAVAIL]({BASE_URL}/fr/domotize-your-workspace/), j'ai voulu mettre en place Home Assistant à la maison.

Home Assistant peut être mis en place avec un container Docker, nous allons donc ajouter les lignes dans notre fichier `/srv/docker-compose.yml` qui devrait maintenant ressembler à cela :

```yaml
version: '3'

services:
  home-assistant:
    restart: always
    image: homeassistant/home-assistant
    volumes:
    - /srv/docker/home-assistant:/config
    labels:
    - "traefik.enable=true"
    - "traefik.http.routers.home.rule=Host(`home.wilson.net`)"
    - "traefik.http.routers.home.entrypoints=https,http"
    - "traefik.http.routers.home.tls=true"
    - "traefik.http.routers.home.tls.certresolver=wilson"
    - "traefik.http.services.home.loadbalancer.server.port=8123"

  reverse-proxy:
    restart: always
    image: traefik:v2.0
    ports:
    - "443:443"
    - "80:80"
    volumes:
    - /srv/traefik.toml:/etc/traefik/traefik.toml
    - /srv/services.toml:/etc/traefik/services.toml
    - /var/run/docker.sock:/var/run/docker.sock
    labels:
    - "traefik.http.routers.api.rule=Host(`traefik.home.wilson.net`)"
    - "traefik.http.routers.api.service=api@internal"
    - "traefik.http.routers.api.entrypoints=http"
    - "traefik.http.routers.api.middlewares=auth"
    - "traefik.http.middlewares.auth.basicauth.users=wilson:$$apr1$$1eZu7RXg$$Ql9Z5AvZNc0Oe4In900mi0"

    - "traefik.http.routers.nas.entrypoints=https,http"
    - "traefik.http.routers.nas.rule=Host(`nas.wilson.net`)"
    - "traefik.http.routers.nas.service=nas@file"
    - "traefik.http.routers.nas.tls=true"
    - "traefik.http.routers.nas.tls.certresolver=wilson"
```

`traefik.enable=true` active le reverse proxy pour le service et permet donc de le rendre accessible par intenet.

`traefik.http.routers.home.entrypoints=https,http` active le endpoint https puis le http sinon.

`traefik.http.routers.home.tls=true` indique que je souhaite un certificat SSL.

`traefik.http.routers.home.tls.certresolver=wilson` indique que je souhaite utiliser certresolver *wilson* pour générer mon certificat.

`traefik.http.services.home.loadbalancer.server.port=8123` indique que le port à exposer de mon service est le 8123.

N'oublions pas de demander à docker-compose de prendre notre nouvelle configuration en compte :

``` shell
docker-compose up -d
```

Nous pouvons maintenant utiliser Home Assistant, et ce directement en https ;)

![Home Assistant]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/10-home-assistant.jpg)

J'espère que vous avez apprécié cet article et que vous allez prendre beaucoup de plaisir à jouer avec traefik.

À bientôt /o/

