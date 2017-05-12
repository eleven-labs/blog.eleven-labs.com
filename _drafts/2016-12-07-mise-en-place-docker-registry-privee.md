---
layout: post
title: Mise en place d'une Docker Registry privée
author: gcanal
date: '2016-12-07 15:24:16 +0100'
date_gmt: '2016-12-07 14:24:16 +0100'
categories:
- Dev Ops
tags: []
---
{% raw %}
Dans cet article, nous allons détailler, étape par étape, la mise en place d'une Docker Registry.

Une Docker Registry est une application qui permet de distribuer des images Docker au sein de votre organisation.

C'est un composant majeur dans l'écosystème Docker, car il va permettre :

<ul>
<li>À vos développeurs de distribuer des images prêtes à l'emploi de vos applications et de les versionner avec un système de tags.</li>
<li>À de nouveaux arrivants dans votre société de mettre en place rapidement leur environnement de développement à partir de ces images.</li>
<li>À des outils d'intégration en continu de jouer une suite de tests sans avoir besoin d'autre chose que de Docker.</li>
<li>Et à des systèmes automatisés de déployer ces applications sur vos environnement de développement, de tests, de recette et de production.</li>
</ul>
<h3 id="petit-rappel">Petit rappel
Une image Docker est en quelque sorte une image disque qui contient l'arborescence d'une distribution linux, le code source d'une application et des binaires capables de la faire tourner.

Une image se construit à partir d'un fichier <strong>Dockerfile</strong> que l'on retrouve généralement à la racine des sources d'une application.

Docker met à disposition un registre d’images publiques : <a href="https://hub.docker.com/">DockerHub</a>.<br />
Dans ce registre, vous allez retrouver des images, telles que :

<ul>
<li>des distributions linux,</li>
<li>des images pré-configurées avec un serveur web et un environnement, exécution pour votre langage préféré,</li>
<li>des bases de données,</li>
<li>et des applications open-source prêtes à l’emploi</li>
</ul>
Docker propose également le dépôt d’images privées via une offre détaillée <a href="https://hub.docker.com/account/billing-plans/">ici</a>.

<h3 id="mise-en-place">Mise en place
Nous allons déployer notre Docker Registry avec <a href="https://docs.docker.com/engine/swarm/">Docker Swarm Mode</a> et <a href="https://traefik.io/">Traefik</a>, un reverse proxy qui va nous permettre d’associer un domaine à notre registre Docker.

Nous aurons besoin d’un nom de domaine, d’un serveur et d’un terminal.

Pour ce guide, je vais utiliser une instance <a href="https://www.ovh.com/fr/cloud/">OVH Public Cloud</a> et un nom de domaine géré par OVH. Dans les grandes lignes, toutes les étapes critiques peuvent être reproduite sur n’importe quel environnement.

<h4 id="configuration-du-serveur">Configuration du serveur
Partons d'une distribution récente, une Ubuntu 16.04 qui a le bon goût d'avoir dans ces dépôts une version de Docker à jour :

<pre class="bash"><code># Installation de Docker
sudo apt-get update &amp;&amp; sudo apt-get install docker.io curl

# Ajoute l'utilisateur courant au groupe docker (si différent de root)
sudo usermod -a -G docker $(id -un)</code></pre>
On se déconnecte du serveur, puis on se reconnecte pour initialiser Docker Swarm mode.

<pre class="bash"><code># Initialise Docker Swarm Mode
docker swarm init</code></pre>
<h4 id="installation-de-traefik">Installation de Traefik
Traefik va nous permettre d'associer un domaine au conteneur dans lequel tournera la registry. Le gros avantage, c'est qu'il permet d'obtenir automatiquement un certificat TLS délivré par <a href="https://letsencrypt.org/">Let's Encrypt</a>.

<pre class="bash"><code># Créer un réseau traefik
docker network create --driver overlay traefik

# Création d'un répertoire où seront stockés nos certificats
sudo mkdir -p /opt/traefik</code></pre>
On va maintenant créer la définition de notre service Traefik.<br />
Créez un fichier à l'adresse <strong>$HOME/traefik.json</strong> dans lequel vous ajoutez :

<pre class="json"><code>{
    "Name": "traefik",
    "TaskTemplate": {
        "ContainerSpec": {
            "Image": "traefik:v1.1.0",
            "Args": [
                "--defaultentrypoints=http,https",
                "--entryPoints=Name:http Address::80 Redirect.EntryPoint:https",
                "--entryPoints=Name:https Address::443 TLS",
                "--acme",
                "--acme.entrypoint=https",
                "--acme.email=[email]",
                "--acme.storage=/data/acme.json",
                "--acme.ondemand=true",
                "--docker",
                "--docker.swarmmode",
                "--docker.exposedbydefault=false",
                "--docker.watch",
                "--web",
                "--logLevel=INFO"
            ],
            "Mounts": [
                {
                    "Type": "bind",
                    "Source": "/var/run/docker.sock",
                    "Target": "/var/run/docker.sock"
                },
                {
                    "Type": "bind",
                    "Source": "/opt/traefik",
                    "Target": "/data"
                }
            ]
        },
        "RestartPolicy": {
            "Condition": "any",
            "MaxAttempts": 0
        },
        "Placement": {
            "Constraints": [
                "node.role==manager"
            ]
        }
    },
    "Mode": {
        "Replicated": {
            "Replicas": 1
        }
    },
    "UpdateConfig": {
        "Parallelism": 1,
        "FailureAction": "pause"
    },
    "Networks": [
        {
            "Target": "traefik"
        }
    ],
    "EndpointSpec": {
        "Mode": "vip",
        "Ports": [
            {
                "Protocol": "tcp",
                "TargetPort": 80,
                "PublishedPort": 80
            },
            {
                "Protocol": "tcp",
                "TargetPort": 443,
                "PublishedPort": 443
            },
            {
                "Protocol": "tcp",
                "TargetPort": 8080,
                "PublishedPort": 8080
            }
        ]
    }
}</code></pre>
<blockquote><strong>Important</strong>: Remplacez <strong>[email]</strong> par une adresse mail valide sans quoi, Let's Encrypt ne vous délivrera pas de certificat.
</blockquote>
Il ne nous reste plus qu'à lancer le service en utilisant l'API Docker :

<pre class="bash"><code>curl -XPOST --unix-socket /var/run/docker.sock http:/services/create -d @$HOME/traefik.json</code></pre>
Contrôlez que le service tourne en tapant <strong>docker service ls</strong>. Au bout d'un certain temps, vous allez voir <strong>1/1</strong> s'afficher en face du service <strong>traefik</strong>.

<blockquote><strong>Astuce </strong>: Utilisez la commande <strong>watch</strong> pour exécuter la commande périodiquement par intervalles de 1 seconde :<br />
<strong>watch -n1 docker service ls</strong>. <strong>Ctrl+c</strong> pour quitter.
</blockquote>
Sur le port <strong>8080</strong> de votre serveur vous devez trouver l'interface de contrôle de Traefik :

<img title="Traefik Web" src="https://lh3.googleusercontent.com/-7OVJ1TQ-U80/WEeRgAfxt_I/AAAAAAAAAaM/-CFecYhSv-AQRsQxuVBAJ-tj0MG5wyTMQCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+05.32.37.png" alt="enter image description here" />

<h4 id="configuration-du-domaine">Configuration du domaine
Avant de lancer la registry sur notre environnement, nous allons créer deux sous-domaines pointant vers notre serveur web :

<ul>
<li>l'un pour la registry,</li>
<li>l'autre pour le serveur d'authentification</li>
</ul>
Sur le manager d'OVH, il suffit de se rendre dans <strong>Web/Domaine(s)</strong>, de choisir son domaine, puis de cliquer sur l'onglet <strong>Zone DNS</strong>

<img title="Ajout entrée DNS" src="https://lh3.googleusercontent.com/-YW_nkX8qJV8/WEeUfHNWOaI/AAAAAAAAAaY/ljqtytkTCccK3eak8Gu6Ytt15XX28cEyQCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+05.44.40.png" alt="enter image description here" />

Puis nous ajoutons un pointage DNS de type <strong>A</strong> pour les sous-domaines :

<ul>
<li><strong>registry.domain.tld</strong> pour la registry,</li>
<li><strong>token.domain.tld</strong> pour le serveur d'authentification</li>
</ul>
<img title="Ajout pointage DNS" src="https://lh3.googleusercontent.com/-MaFb82-SY3c/WEeVhjIumFI/AAAAAAAAAag/a8dyGIA0gfEQ4MvTFwgu89tEBYWE6j9FwCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+05.51.24.png" alt="enter image description here" />

<blockquote><strong>Important</strong>: Remplacez <strong>domain.tld</strong> par votre domaine et <strong>xxx.xxx.xxx.xxx</strong> par l'adresse IPv4 de votre serveur.
</blockquote>
<h4 id="serveur-dauthentification">Serveur d’authentification
Docker registry permet d'utiliser des services tiers pour gérer l'authentification et les contrôles d'accès des utilisateurs.

Nous allons utiliser ici <a href="https://github.com/cesanta/docker_auth">Docker Registry 2 authentication server</a>.

Cette application en GO prend en charge plusieurs backends. Vous avez au choix la possibilité de stocker vos utilisateurs et ACL dans MongoDB, d'utiliser un serveur LDAP, ou dans notre cas, d'utiliser un fichier YAML.

L'authentification des utilisateurs se fait par jeton <a href="https://jwt.io/">JWT</a>. La registry Docker, de son coté, attend que ces jetons soient signés par un certificat. Commençons par le générer :

<pre class="bash"><code># Préparation des répertoires nécessaires à docker auth
sudo mkdir -p /opt/docker-auth/{logs,config,certs}

# Génération du certificat
cd /opt/docker-auth/certs
sudo openssl req -x509 -newkey rsa:2048 -new -nodes -keyout privkey.pem -out fullchain.pem -subj "/C=FR/ST=Paris/L=Paris/O=ACME/OU=IT Department/CN=[domain.tld]"</code></pre>
<blockquote><strong>Note </strong>: Remplacez <strong>[domain.tld]</strong> par votre nom de domaine
</blockquote>
On crée un fichier de configuration contenant nos utilisateurs et nos règles d'accès dans <strong>/opt/docker-auth/config/auth_config.yml</strong>

<pre class="yml"><code>server:
  addr: ":5001"

token:
  issuer: "Acme auth server"  # Doit correspondre à l'émetteur (issuer) indiqué dans la configuration du registre
  expiration: 900 # Expiration en secondes du jeton d'accès
  certificate: "/certs/fullchain.pem"
  key: "/certs/privkey.pem"

# Les mots de passe sont hashés avec BCrypt (Utiliser htpasswd -B pour en générer un)
users:
  "admin":
    password: "$2y$05$LO.vzwpWC5LZGqThvEfznu8qhb5SGqvBSWY1J3yZ4AxtMRZ3kN5jC"  # badmin
  "test":
    password: "$2y$05$WuwBasGDAgr.QCbGIjKJaep4dhxeai9gNZdmBnQXqpKly57oNutya"  # 123
  "": {}  # Autorise les accès anonymes au registre

acl:
  - match: {account: "admin"}
    actions: ["*"]
    comment: "Tout est permit pour l'administrateur"

  - match: {account: "/.+/", name: "${account}/*"}
    actions: ["*"]
    comment: "Les utilisateurs enregistrés peuvent tirer et contribuer des images dans leur espace de nom"

  - match: {account: "/.+/"}
    actions: ["pull"]
    comment: "Les utilisateurs enregistrés peuvent tirer n'importe quelle image"

  - match: {account: ""}
    actions: ["pull"]
    comment: "Les utilisateurs anonymes peuvent tirer n'importe quelle image"</code></pre>
Créons enfin un fichier à l'adresse <strong>$HOME/docker-auth.json</strong>:

<pre class="json"><code>{
    "Name": "docker-auth",
    "Labels": {
        "traefik.docker.network": "traefik",
        "traefik.enable": "true",
        "traefik.frontend.rule": "Host:[token.domain.tld]",
        "traefik.port": "5001"
    },
    "TaskTemplate": {
        "ContainerSpec": {
            "Image": "cesanta/docker_auth:stable",
            "Args": [
                "/config/auth_config.yml"
            ],
            "Mounts": [
                {
                    "Type": "bind",
                    "Source": "/opt/docker-auth/config",
                    "Target": "/config"
                },
                {
                    "Type": "bind",
                    "Source": "/opt/docker-auth/logs",
                    "Target": "/logs"
                },
                {
                    "Type": "bind",
                    "Source": "/opt/docker-auth/certs",
                    "Target": "/certs"
                }
            ]
        },
        "RestartPolicy": {
            "Condition": "any",
            "MaxAttempts": 0
        },
        "Placement": {
            "Constraints": [
                "node.role==manager"
            ]
        }
    },
    "Mode": {
        "Replicated": {
            "Replicas": 1
        }
    },
    "UpdateConfig": {
        "Parallelism": 1,
        "FailureAction": "pause"
    },
    "Networks": [
        {
            "Target": "traefik"
        }
    ],
    "EndpointSpec": {
        "Mode": "vip"
    }
}</code></pre>
<blockquote><strong>Important </strong>: Remplacez <strong>[token.domain.tld]</strong> par le sous-domaine que vous avez créé précédemment pour le serveur d'authentification
</blockquote>
On lance le service :

<pre class="bash"><code>curl -XPOST --unix-socket /var/run/docker.sock http:/services/create -d @$HOME/docker-auth.json</code></pre>
Et on vérifie que le service <strong>docker-auth</strong> est bien lancé en utilisant la commande <strong>docker service ls</strong>.

<h4 id="mise-en-place-de-la-registry">Mise en place de la registry
Il ne nous reste plus qu'à mettre en place la registry.

Créons des répertoires qui contiendront nos images docker :

<pre class="bash"><code>sudo mkdir -p /opt/registry</code></pre>
Puis on finit avec un fichier que l'on crée à l'adresse <strong>$HOME/registry.json </strong>:

<pre class="json"><code>{
    "Name": "docker-registry",
    "Labels": {
        "traefik.docker.network": "traefik",
        "traefik.enable": "true",
        "traefik.frontend.rule": "Host:[registry.domain.tld]",
        "traefik.port": "5000"
    },
    "TaskTemplate": {
        "ContainerSpec": {
            "Image": "registry:2.5.0",
            "Mounts": [
                {
                    "Type": "bind",
                    "Source": "/opt/docker-auth/certs",
                    "Target": "/certs"
                },
                {
                    "Type": "bind",
                    "Source": "/opt/registry",
                    "Target": "/var/lib/registry"
                }
            ],
            "Env": [
                "REGISTRY_LOG_LEVEL=warn",
                "REGISTRY_STORAGE_DELETE_ENABLED=true",
                "REGISTRY_AUTH=token",
                "REGISTRY_AUTH_TOKEN_REALM=https://[token.domain.tld]/auth",
                "REGISTRY_AUTH_TOKEN_SERVICE=Docker registry",
                "REGISTRY_AUTH_TOKEN_ISSUER=Acme auth server",
                "REGISTRY_AUTH_TOKEN_ROOTCERTBUNDLE=/certs/fullchain.pem"
            ]
        },
        "Placement": {
            "Constraints": [
                "node.role==manager"
            ]
        }
    },
    "Mode": {
        "Replicated": {
            "Replicas": 1
        }
    },
    "UpdateConfig": {
        "Parallelism": 1,
        "FailureAction": "pause"
    },
    "Networks": [
        {
            "Target": "traefik"
        }
    ],
    "EndpointSpec": {
        "Mode": "vip"
    }
}</code></pre>
<blockquote><strong>Important </strong>: Remplacez <strong>[registry.domain.tld]</strong> par le sous-domaine que vous avez créé précédemment pour la registry et <strong>[token.domain.tld]</strong> par celui dédié au serveur d'authentification.
</blockquote>
On lance la registry :

<pre class="bash"><code>curl -XPOST --unix-socket /var/run/docker.sock http:/services/create -d @$HOME/registry.json</code></pre>
Et on vérifie que le service <strong>docker-registry</strong> est bien lancé en utilisant la commande <strong>docker service ls</strong>.

<h4 id="tests">Tests
Sur le port <strong>8080</strong> de votre serveur, vous devez avoir quelque chose d'équivalent à ceci :

<img title="Traefik Services" src="https://lh3.googleusercontent.com/-CHOW4DC6pi4/WEefmOVQGpI/AAAAAAAAAbA/f7W-kRKRLaoUKMXb1BNgQHEyRLxPZHuNgCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+06.34.33.png" alt="enter image description here" />

Si c'est le cas, c'est que Traefik à fait correctement son boulot, vous avez maintenant un registre docker et un serveur d'authentification associés à leur domaines respectifs.

<blockquote><strong>Note </strong>: Concernant le support de l'HTTPS pour ces domaines, il faut savoir que Traefik génère les certificats TLS et les fait signer par Let's Encrypt lors du premier accès. Il est recommandé d'utiliser cURL sur chacun d'eux pour initier la procédure. (exemple: **curl -L <a class="uri" href="http://registry.guillem.me**">http://registry.guillem.me**</a>) Répéter la procédure dans le cas ou ça échoue.
</blockquote>
Maintenant, <strong>sur votre poste local</strong> (sur lequel vous avez installé docker) nous allons nous authentifier à la registry, "tagguer" une image puis l'envoyer.

<blockquote><strong>Note </strong>: Pensez toujours à remplacer <strong>[registry.domain.tld]</strong> par le sous-domaine choisi précédemment.
</blockquote>
<pre class="bash"><code>docker login registry.domain.tld
Username: # saisir l'identifiant admin
Password: # saisir badmin
Login Succeeded</code></pre>
Récupérons une image lambda sur DockerHub, tagguons-la, puis envoyons-la sur notre registry.

<pre><code>docker pull alpine
docker tag alpine registry.domain.tld/alpine
docker push registry.domain.tld/alpine</code></pre>
<blockquote><strong>Note </strong>: Remplacez toujours et encore le fameux <strong>[registry.domain.tld]</strong>
</blockquote>
Si tout se déroule comme prévu, vous voyez alors quelque chose de proche de :

<pre class="bash"><code>The push refers to a repository [registry.domain.tld/alpine]
011b303988d2: Pushed
latest: digest: sha256:1354db23ff5478120c980eca1611a51c9f2b88b61f24283ee8200bf9a54f2e5c size: 528</code></pre>
Si c'est le cas, félicitations, vous avez une registry docker à dispo !

<h2 id="au-prochain-numero">Au prochain numéro…
Nous verrons comment utiliser <strong>docker-compose</strong> pour lancer un environnement de développement en local en tirant profit de notre registry docker et d’un outil de versionning pour fabriquer automatiquement nos images docker.

À la prochaine!

{% endraw %}
