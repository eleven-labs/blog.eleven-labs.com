---
contentType: article
lang: en
date: '2020-12-15'
slug: using-traefik-as-a-reverse-proxy
title: Using Traefik as a reverse proxy
excerpt: >-
  In need for exposing websites and applications easily on the internet with a
  valid SSL certificate ? You're on the right spot ! :)
cover: /assets/2019-12-18-utiliser-traefik-comme-reverse-proxy/cover.jpg
categories: []
authors:
  - jmoati
  - dfert
keywords:
  - docker
  - ssl
  - reverse-proxy
---

![Cover]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/cover.jpg)

## Introduction

At home, I've got a NAS, a Raspberry PI running on Octopi, a server running on Debian, etc. In short, a galaxy of smart devices serving websites and apps, but nonetheless, none of them are easily accessible from outside my place and even less, from a secured connection.

Making this charming little world accessible from the unique public IP adress in my possesion leads me to use a reverse proxy system.

But what actually is a reverse proxy  ? Quoting Wikipedia,

> [...] A reverse proxy is a type of [proxy server](https://en.wikipedia.org/wiki/Proxy_server) that retrieves resources on behalf of a [client](https://en.wikipedia.org/wiki/Client_(computing)) from one or more servers. These resources are then returned to the client, appearing as if they originated from the reverse proxy server itself. Unlike a forward proxy, which is an intermediary for its associated clients to contact any server, a reverse proxy is an intermediary for its associated servers to be contacted by any client. In other words, a proxy is associated with the client(s), while a reverse proxy is associated with the server(s); a reverse proxy is usually an internal-facing proxy used as a 'front-end' to control and protect access to a server on a private network.
>

There are loads of reverse proxy on the market, but today's focus will be on Traefik which allows:
- HTTP and TCP request forwarding
- Automatic service discovery (featuring Docker for instance)
- Secured connections via Let's Encrypt certificates

Of course to make it work you will need a domain name (_wilson.net_ in my case), and to make sure the different DNS Zones are pointing to your server.

![My DNS zones]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/11-zones.jpg)

You could also emulate a domain name through your local `/etc/hosts` file, but in such case the generation of a SSL certificate won't be possible.

Okay, let's set everything up together now :)


## Setting-up Traefik

First, you'll need to setup Traefik on a webserver accessible from the internet.

In my case, that server will be 192.168.0.1: it is where ports 80 (HTTP) and 443 (HTTPS) of my internet router (freebox) are forwarded to.

![Port mapping of my freebox router]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/01-ports.jpg)

It is just as well to install Traefik's binary file, compile it from source, or, just like we'll be doing in this blog post, deploy it with a Docker image.

We'll use `docker-compose` to avoid typing the same command again and again and also enhance it with new configuration elements as this tutorial goes along.

Let's create our first file `/srv/docker-compose.yaml`
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

If, for any reason, our server must restart, the `restart: always` instruction will allow our reverse-proxy service to restart automatically, on its own.

Inside the `ports` section, we expose the ports of the reverse proxy service to the outside.

Inside the `volume` section, we share files and/or directories with our service.

Okay, sharing `/srv/traefik.toml` file with our container is all well and good, but maybe we should create it, right?

We are then going to create Traefik's main configuration file `/srv/traefik.toml` which declares, at least, the 2 endpoints mentionned earlier:

``` toml
[entryPoints]
  [entryPoints.http]
  address = ":80"
  [entryPoints.https]
  address = ":443"
```

Next, we can start our reverse-proxy service from our `/srv` directory using the following command:

``` shell
docker-compose up -d
```

![Launching Traefik with docker-compose]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/02-docker-compose-up.jpg)

Of course, we'll have a pretty 404 response if we visit our server's page for the moment, but take it a proof that our server is here and can't wait to serve us content.

![Traefik returning 404]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/03-nothing-for-the-moment.jpg)


## Configuring the dashboard

We just saw that our reverse-proxy is running but has nothing to display for the moment.
We'll now plug the dashboard, allowing us to know if our services, endpoints and routing rules are correctly applyied by Traefik.

First, we'll add an `[api]` section to enable the dashboard and the API. Also, adding a `[providers.docker]` section will enable Docker provider and watch for its labels.

Traefik needs to know Docker's socket path in order to activate its provider.

Our main Traefik configuration file `/srv/traefik.toml` should now be similar to:

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

We'll have to generate a password for dashboard access and prevent anonymous access.
For that, we must use `htpasswd` and as we don't want to install it inside our ravishing machine, we'll use an Apache Docker image in order to hash our password.


``` shell
docker run --rm --name apache httpd:alpine htpasswd -nb wilson schizo
```

![Password generation]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/04-password.jpg)

In that exemple, *wilson* is my login, *schizo* is my password.
The ouput from our last command is `wilson:$apr1$1eZu7RXg$Ql9Z5AvZNc0Oe4In900mi0`

Now that we have our hashed password, we'll add a `basicauth` middleware which will be in charge of securing access to the page by asking for a password with the `traefik.http.middlewares.auth.basicauth.users=wilson:$$apr1$$1eZu7RXg$$Ql9Z5AvZNc0Oe4In900mi0` instruction.

Define the (http) endpoint with `traefik.http.routers.api.entrypoints=http`.

Declare we want to use the _api_ service provided by the _internal_ provider `traefik.http.routers.api.service=api@internal`:
Finally, we now have to adapt the `/srv/docker-compose.yaml` file to something similar to that:

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

I'd like to highlight that I had to double the `$` symbols in order to escape the `$` symbols as it tries to reference a variable.
It is important to stay consistent with names inside routers and middlewares.

Here, the name of my rule is `api`. You could use any name if you like considering that it's not already used for another service and that the name stays the same everywhere.

We can now ask our service to apply our modifications running the following command again from the `/srv` directory

``` shell
docker-compose up -d
```

Here's what I see when I browse the URL defined in my routing rule above:

![Dashboard]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/05-dashboard.jpg)


## Reverse proxy of a website accessible from local network

Connected to my network, there's my NAS I'd like to reach from outside.


![My NAS Synology]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/06-nas-http.jpg)

We'll need to declare it to with the `file` provider as, unlike Docker, it can't be automatically discovered.
Therefore, we'll create the `/srv/services.toml` file as below:

```toml
[http]
  [http.services]
    [http.services.nas]
      [http.services.nas.loadBalancer]
        [[http.services.nas.loadBalancer.servers]]
          url = "http://192.168.0.11:5000/"
```
`192.168.0.11` is my NAS IP here and it awaits HTTP requests on port 5000

I'll declare this file provider in `/srv/traefik.toml` in order to load this service file:

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

As you may see, the container will search for our service file under `/etc/traefik` but yet, we will keep it under `/srv`.

We will declare these routing rules in `/srv/docker-compose.yaml` as docker labels:

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
You probably understood this already but, the service name is always in the form of [service name]@[provider.

`rule` allows me to define which route let me reach my service. Here, I only match on the domain name which must be `nas.wilson.net` .

Once again, let's not forget to apply our changes with docker-compose:

``` shell
docker-compose up -d
```

_Voilà_, here's what I get now when I reach my NAS using th hostname declared above.

![My reversed nas synology]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/07-nas-reversed.jpg)


## Generating SSL certificate

Thanks to Let's Encrypt, we can very easily generate SSL certificates that will be automatically renewed for free.

No more excuses now refraining to embrace HTTP2 and securing the data of your users.

In order to generate certificates signed by Let's Encrypt, I need to create a `/srv/acme.json` file and make it accessible for Traefik to store its aforesaid certificates.

```shell
 touch /srv/acme.json
 ```
Next, add this file insde the volume section `/srv/acme.json:/acme.json` of your `/srv/docker-compose.yaml` file.

Inside `/srv/traefik.toml`, I declare a certificatesResolver allowing me to get certificates.

```toml
[certificatesResolvers.wilson.acme]
  email = "YOUR@EMAIL.COM"
  storage = "acme.json"
  [certificatesResolvers.wilson.acme.httpChallenge]
    entryPoint = "http"
```

Which would give me a `/srv/traefik.toml` file similar to:

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
Beware, your email adress is mandatory.

Inside `/srv/docker-compose.yaml` we still need to add labels for generating the SSL certificate of my NAS, that would give:

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

`entrypoints` indicates that I want a HTTPS access, else HTTP.

`tls`, that I want to use a SSL certificate.

`tls.certresolver` what certresolver I should use.

And let's not forget again to ask docker-compose to apply our new configuration:

``` shell
docker-compose up -d
```
Once done, I have an access to my NAS, secured by HTTPS :D

![My nas synology https]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/08-nas-https.jpg)

And that I can, of course, see inside my Traefik dashboard:

![My nas synology dashboard]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/09-traefik-dashboard-nas.jpg)


## Reverse proxy for services running in Docker containers

Now that we know how to write different routing rules for a service and how to generate SSL certificates, doing such for a Docker service should be a breeze.

After reading [DOMOTIZE YOUR WORKSPACE (lang. French)]({BASE_URL}/fr/domotize-your-workspace/) article, I wanted to setup _Home Assistant_ at home.

_Home Assistant_ can be set up with a Docker container, so we will add the extra lines inside `/srv/docker-compose.yml` which should now look like this:

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

`traefik.enable=true` enables the reverse proxy for the service and then make it accessible from the internet.

`traefik.http.routers.home.entrypoints=https,http` activates https endpoint, then http endpoint otherwise.

`traefik.http.routers.home.tls=true` indicates that I wish for a SSL certificate.

`traefik.http.routers.home.tls.certresolver=wilson` indicates I want to use the *wilson* certresolver to generate my certificate.

`traefik.http.services.home.loadbalancer.server.port=8123` indicates that the service port I want to expose is 8123.

Once last time, don't forget to ask docker-compose to apply our new configuration:

``` shell
docker-compose up -d
```

We can now use _Home Assistant_  and do so directly through https ;)

![Home Assistant]({BASE_URL}/imgs/articles/2019-12-18-utiliser-traefik-comme-reverse-proxy/10-home-assistant.jpg)

I hope that you enjoyed this article and that you'll be delighted to play with Traefik.

See ya /o/
