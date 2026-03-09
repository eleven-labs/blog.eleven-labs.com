---
contentType: article
lang: fr
date: 2026-03-11
slug: caddy-wildcard-dns-challenge
title: >-
  Installer et configurer Caddy 2 avec certificat SSL pour tous vos sous-domaines
excerpt: >-
  Sécuriser votre serveur avec des certificat SSL pour tous vos sous-domaines grâce au DNS challenge
cover:
  path: /imgs/articles/2026-03-11-caddy-wildcard-dns-challenge-ovh/cover.png
  position: center
categories:
  - architecture
authors:
  - nkania
seo:
    title: Configurer un certificat SSL wildcard avec Caddy 2
    description: Guide complet pour configurer un certificat SSL wildcard avec Caddy 2 grâce au DNS challenge OVH.
---

Suite aux offres OVH VPS 2026 j'ai décidé de migrer mon vieux Digital Ocean toujours bloqué sur une debian 12.
J'aime héberger mes différents services en utilisant des containers et en mettant un reverse proxy devant.
Sur mon ancienne configuration j'utilisais Traefik, pour changer un peu j'ai décidé que c'était l'occasion de tester Caddy.

J'ai cherché un peu de doc afin de le configurer correctement (notamment la partie wildcard avec dns challenge) et je n'ai pas trouvé d'article récent parlant de ce sujet, du coup je vous partage mon expérience en espérant pouvoir vous aider :)

**Attention, j'utilise la version Docker de Caddy, mais vous pouvez tout de même suivre cet article si vous l'avez installé directement sur votre système !**

**Prérequis** : 
- Avoir installé Caddy version 2 (>2.10.0 pour ne pas avoir à ajouter l'option `auto_https prefer_wildcard` plus de détails [ici](https://github.com/caddyserver/caddy/releases/tag/v2.10.0)) via Docker ou directement.
- Au niveau de votre provider dns avoir déjà redirigé vos domaines sur votre serveur, cela inclut votre domain de base + le wildcard de votre domain, donc par exemple avoir un enregistrement du type `*.example.com IN A 1.1.1.1` (où `1.1.1.1` correspond à l'ip de votre serveur) si vous utilisez ovh vous pouvez vous référer à cette [doc](https://help.ovhcloud.com/csm/fr-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051684)


## Trouver le bon plugin

La première étape est de trouver son provider DNS dans le repository suivant : https://github.com/caddy-dns

J'utilise personnellement ovh. Pour la suite de l'article ce sera donc : https://github.com/caddy-dns/ovh

## Installer le plugin

Il faut maintenant ajouter le plugin à Caddy :

Installation direct : `xcaddy build --with github.com/caddy-dns/ovh`

Pour Docker on va créer un dossier par exemple dans notre home : `mkdir -p ~/caddy/config` (le dossier config vous sera utile juste après)

Ensuite créer un Dockerfile avec le contenu suivant dans notre dossier `~/caddy` :
```
FROM caddy:builder AS builder

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    xcaddy build \
    --with github.com/caddy-dns/ovh

FROM caddy:latest

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
```

## Préparer le Caddyfile

Exemple de Caddyfile à utiliser (pour une installation via Docker le placer dans le path suivant : `~/caddy/config/Caddyfile` il sera utilisé par le `compose.yaml` plus tard) :
```
{
    debug
}

*.example.com, example.com {
    tls {
        dns ovh {
            endpoint {$OVH_ENDPOINT}
            application_key {$OVH_APPLICATION_KEY}
            application_secret {$OVH_APPLICATION_SECRET}
            consumer_key {$OVH_CONSUMER_KEY}
        }
    }
    # default handle
    handle {
      respond "it works !"
    }
}
```
(n'oubliez pas de remplacer `example.com` par votre nom de domaine)

Les variables d'environnement nécessaires à la configuration d'OVH seront renseignées dans les chapitres suivants.

**Attention, ici j'ai pris l'exemple de configurations pour ovh, veillez à la remplacer par celle de votre provider que vous trouverez dans le README du repository https://github.com/caddy-dns de votre provider.**

## Trouver les identifiants du provider OVH

Afin de trouver les informations requises par Let's Encrypt pour communiquer et gérer nos enregistrements DNS OVH le README nous indique qu'il va falloir aller créer une application (avec accès API) à notre compte OVH.

La documentation Caddy nous redirige vers ce lien : https://github.com/libdns/ovh#authenticating

Qui ensuite nous mène ici : https://github.com/ovh/go-ovh#supported-apis

L'idée est de trouver quelle est notre OVH région afin de suivre le lien "Create script credentials (all keys at once)".

La mienne étant Europe, je vais donc suivre https://eu.api.ovh.com/createToken/

Authentifiez-vous à votre compte OVH et vous devriez arriver sur cette page :

![Formulaire ovh vide]({BASE_URL}/imgs/articles/2026-03-11-caddy-wildcard-dns-challenge-ovh/caddydnschallengeovh.png)

Vous allez remplir le formulaire de la manière suivante :

![Formulaire ovh rempli]({BASE_URL}/imgs/articles/2026-03-11-caddy-wildcard-dns-challenge-ovh/ovhdnschallengeapikey.png)

Si vous avez un doute référez vous à la page que j'ai indiqué précédemment : https://github.com/libdns/ovh#authenticating . Je vous conseille de suivre la configuration pour un simple domaine, mais si vous avez vocation à laisser votre Caddy gérer plusieurs domaines différents, alors vous devriez suivre la configuration pour multiple domaines !

Une fois enregistré, n'oubliez pas de sauvegarder les informations suivantes (**Attention, vous ne pourrez plus accéder à ces informations par la suite**) :
- **application key**
- **application secret**
- **consumer key**

Nous allons les utiliser dès maintenant !

## Ajouter les identifiants du provider OVH

Si vous avez installé Caddy directement alors modifiez les info dans votre Caddyfile.

Si vous avez utilisé Docker je vous conseille de fournir ces infos via un `compose.yaml` :
```
services:
  caddy:
    build: .
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./conf:/etc/caddy
      - ./site:/srv
      - caddy_data:/data
      - caddy_config:/config
    environment:
      OVH_ENDPOINT: "ovh-eu"
      OVH_APPLICATION_KEY: "votre-application-key"
      OVH_APPLICATION_SECRET: "votre-application-secret"
      OVH_CONSUMER_KEY: "votre-consumer-key"

volumes:
  caddy_data:
  caddy_config:
```

## Conclusion

Le moment de vérité est arrivé !
Relancez Caddy pour qu'il prenne en compte votre nouvelle configuration

Sans Docker :
`sudo systemctl restart caddy`

Avec Docker :
`sudo docker compose up -d && sudo docker compose logs -f`

Rendez-vous sur votre nom de domaine et vous devriez voir la phrase "it works !" ainsi qu'un certificat tls !

Si vous voulez tester un sous domain, rien de plus simple.

Ajoutez le bloc suivant à votre Caddyfile (en modifiant bien `subdomain.example.com` par votre nom de domaine et le sous domain désiré)

```
@subdomain host subdomain.example.com
handle @subdomain: {
  respond "subdomain works !"
}
```

Dans le bloc précédemment ajouté, entre le bloc `tls` et l'instruction `handle`

Relancez Caddy via les commandes suivantes :

Sans Docker :
`sudo systemctl reload caddy`

Avec Docker :
`sudo docker compose exec -w /etc/caddy caddy caddy reload`

Si vous avez une erreur sur le formattage de votre fichier Caddy vous pouvez utiliser la commande suivante :
`sudo docker compose exec -w /etc/caddy caddy caddy fmt --override`

Puis reload Caddy.

Et allez tester votre sous-domaine :)

Have fun !


## Liens utiles

- https://caddyserver.com/docs/automatic-https#wildcard-certificates
- https://caddyserver.com/docs/caddyfile/patterns#wildcard-certificates
- https://caddyserver.com/docs/automatic-https#dns-challenge
- https://caddy.community/t/how-to-use-dns-provider-modules-in-caddy-2/8148
- https://github.com/caddy-dns/ovh
- https://github.com/libdns/ovh#authenticating
- https://github.com/ovh/go-ovh#supported-apis
