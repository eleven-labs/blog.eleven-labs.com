--- layout: post title: Mise en place d'une Docker Registry privée
author: gcanal date: '2016-12-07 15:24:16 +0100' date\_gmt: '2016-12-07
14:24:16 +0100' categories: - Dev Ops tags: \[\] --- {% raw %}

Dans cet article, nous allons détailler, étape par étape, la mise en
place d'une Docker Registry.

Une Docker Registry est une application qui permet de distribuer des
images Docker au sein de votre organisation.

C'est un composant majeur dans l'écosystème Docker, car il va permettre
:

-   À vos développeurs de distribuer des images prêtes à l'emploi de vos
    applications et de les versionner avec un système de tags.
-   À de nouveaux arrivants dans votre société de mettre en place
    rapidement leur environnement de développement à partir de ces
    images.
-   À des outils d'intégration en continu de jouer une suite de tests
    sans avoir besoin d'autre chose que de Docker.
-   Et à des systèmes automatisés de déployer ces applications sur vos
    environnement de développement, de tests, de recette et de
    production.

### Petit rappel

Une image Docker est en quelque sorte une image disque qui contient
l'arborescence d'une distribution linux, le code source d'une
application et des binaires capables de la faire tourner.

Une image se construit à partir d'un fichier **Dockerfile** que l'on
retrouve généralement à la racine des sources d'une application.

Docker met à disposition un registre d’images publiques :
[DockerHub](https://hub.docker.com/).\
Dans ce registre, vous allez retrouver des images, telles que :

-   des distributions linux,
-   des images pré-configurées avec un serveur web et un environnement,
    exécution pour votre langage préféré,
-   des bases de données,
-   et des applications open-source prêtes à l’emploi

Docker propose également le dépôt d’images privées via une offre
détaillée [ici](https://hub.docker.com/account/billing-plans/).

### Mise en place

Nous allons déployer notre Docker Registry avec [Docker Swarm
Mode](https://docs.docker.com/engine/swarm/) et
[Traefik](https://traefik.io/), un reverse proxy qui va nous permettre
d’associer un domaine à notre registre Docker.

Nous aurons besoin d’un nom de domaine, d’un serveur et d’un terminal.

Pour ce guide, je vais utiliser une instance [OVH Public
Cloud](https://www.ovh.com/fr/cloud/) et un nom de domaine géré par OVH.
Dans les grandes lignes, toutes les étapes critiques peuvent être
reproduite sur n’importe quel environnement.

#### Configuration du serveur

Partons d'une distribution récente, une Ubuntu 16.04 qui a le bon goût
d'avoir dans ces dépôts une version de Docker à jour :

``` {.bash}
# Installation de Docker
sudo apt-get update && sudo apt-get install docker.io curl

# Ajoute l'utilisateur courant au groupe docker (si différent de root)
sudo usermod -a -G docker $(id -un)
```

On se déconnecte du serveur, puis on se reconnecte pour initialiser
Docker Swarm mode.

``` {.bash}
# Initialise Docker Swarm Mode
docker swarm init
```

#### Installation de Traefik

Traefik va nous permettre d'associer un domaine au conteneur dans lequel
tournera la registry. Le gros avantage, c'est qu'il permet d'obtenir
automatiquement un certificat TLS délivré par [Let's
Encrypt](https://letsencrypt.org/).

``` {.bash}
# Créer un réseau traefik
docker network create --driver overlay traefik

# Création d'un répertoire où seront stockés nos certificats
sudo mkdir -p /opt/traefik
```

On va maintenant créer la définition de notre service Traefik.\
Créez un fichier à l'adresse **\$HOME/traefik.json** dans lequel vous
ajoutez :

``` {.json}
{
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
}
```

> **Important**: Remplacez **\[email\]** par une adresse mail valide
> sans quoi, Let's Encrypt ne vous délivrera pas de certificat.

Il ne nous reste plus qu'à lancer le service en utilisant l'API Docker :

``` {.bash}
curl -XPOST --unix-socket /var/run/docker.sock http:/services/create -d @$HOME/traefik.json
```

Contrôlez que le service tourne en tapant **docker service ls**. Au bout
d'un certain temps, vous allez voir **1/1** s'afficher en face du
service **traefik**.

> **Astuce **: Utilisez la commande **watch** pour exécuter la commande
> périodiquement par intervalles de 1 seconde :\
> **watch -n1 docker service ls**. **Ctrl+c** pour quitter.

Sur le port **8080** de votre serveur vous devez trouver l'interface de
contrôle de Traefik :

![enter image description
here](https://lh3.googleusercontent.com/-7OVJ1TQ-U80/WEeRgAfxt_I/AAAAAAAAAaM/-CFecYhSv-AQRsQxuVBAJ-tj0MG5wyTMQCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+05.32.37.png "Traefik Web")

#### Configuration du domaine

Avant de lancer la registry sur notre environnement, nous allons créer
deux sous-domaines pointant vers notre serveur web :

-   l'un pour la registry,
-   l'autre pour le serveur d'authentification

Sur le manager d'OVH, il suffit de se rendre dans **Web/Domaine(s)**, de
choisir son domaine, puis de cliquer sur l'onglet **Zone DNS**

![enter image description
here](https://lh3.googleusercontent.com/-YW_nkX8qJV8/WEeUfHNWOaI/AAAAAAAAAaY/ljqtytkTCccK3eak8Gu6Ytt15XX28cEyQCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+05.44.40.png "Ajout entrée DNS")

Puis nous ajoutons un pointage DNS de type **A** pour les sous-domaines
:

-   **registry.domain.tld** pour la registry,
-   **token.domain.tld** pour le serveur d'authentification

![enter image description
here](https://lh3.googleusercontent.com/-MaFb82-SY3c/WEeVhjIumFI/AAAAAAAAAag/a8dyGIA0gfEQ4MvTFwgu89tEBYWE6j9FwCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+05.51.24.png "Ajout pointage DNS")

> **Important**: Remplacez **domain.tld** par votre domaine et
> **xxx.xxx.xxx.xxx** par l'adresse IPv4 de votre serveur.

#### Serveur d’authentification

Docker registry permet d'utiliser des services tiers pour gérer
l'authentification et les contrôles d'accès des utilisateurs.

Nous allons utiliser ici [Docker Registry 2 authentication
server](https://github.com/cesanta/docker_auth).

Cette application en GO prend en charge plusieurs backends. Vous avez au
choix la possibilité de stocker vos utilisateurs et ACL dans MongoDB,
d'utiliser un serveur LDAP, ou dans notre cas, d'utiliser un fichier
YAML.

L'authentification des utilisateurs se fait par jeton
[JWT](https://jwt.io/). La registry Docker, de son coté, attend que ces
jetons soient signés par un certificat. Commençons par le générer :

``` {.bash}
# Préparation des répertoires nécessaires à docker auth
sudo mkdir -p /opt/docker-auth/{logs,config,certs}

# Génération du certificat
cd /opt/docker-auth/certs
sudo openssl req -x509 -newkey rsa:2048 -new -nodes -keyout privkey.pem -out fullchain.pem -subj "/C=FR/ST=Paris/L=Paris/O=ACME/OU=IT Department/CN=[domain.tld]"
```

> **Note **: Remplacez **\[domain.tld\]** par votre nom de domaine

On crée un fichier de configuration contenant nos utilisateurs et nos
règles d'accès dans **/opt/docker-auth/config/auth\_config.yml**

``` {.yml}
server:
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
    comment: "Les utilisateurs anonymes peuvent tirer n'importe quelle image"
```

Créons enfin un fichier à l'adresse **\$HOME/docker-auth.json**:

``` {.json}
{
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
}
```

> **Important **: Remplacez **\[token.domain.tld\]** par le sous-domaine
> que vous avez créé précédemment pour le serveur d'authentification

On lance le service :

``` {.bash}
curl -XPOST --unix-socket /var/run/docker.sock http:/services/create -d @$HOME/docker-auth.json
```

Et on vérifie que le service **docker-auth** est bien lancé en utilisant
la commande **docker service ls**.

#### Mise en place de la registry

Il ne nous reste plus qu'à mettre en place la registry.

Créons des répertoires qui contiendront nos images docker :

``` {.bash}
sudo mkdir -p /opt/registry
```

Puis on finit avec un fichier que l'on crée à
l'adresse **\$HOME/registry.json **:

``` {.json}
{
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
}
```

> **Important **: Remplacez **\[registry.domain.tld\]** par le
> sous-domaine que vous avez créé précédemment pour la registry et
> **\[token.domain.tld\]** par celui dédié au serveur
> d'authentification.

On lance la registry :

``` {.bash}
curl -XPOST --unix-socket /var/run/docker.sock http:/services/create -d @$HOME/registry.json
```

Et on vérifie que le service **docker-registry** est bien lancé en
utilisant la commande **docker service ls**.

#### Tests

Sur le port **8080** de votre serveur, vous devez avoir quelque chose
d'équivalent à ceci :

![enter image description
here](https://lh3.googleusercontent.com/-CHOW4DC6pi4/WEefmOVQGpI/AAAAAAAAAbA/f7W-kRKRLaoUKMXb1BNgQHEyRLxPZHuNgCLcB/s0/Capture+d%25E2%2580%2599e%25CC%2581cran+2016-12-07+a%25CC%2580+06.34.33.png "Traefik Services")

Si c'est le cas, c'est que Traefik à fait correctement son boulot, vous
avez maintenant un registre docker et un serveur d'authentification
associés à leur domaines respectifs.

> **Note **: Concernant le support de l'HTTPS pour ces domaines, il faut
> savoir que Traefik génère les certificats TLS et les fait signer par
> Let's Encrypt lors du premier accès. Il est recommandé d'utiliser cURL
> sur chacun d'eux pour initier la procédure. (exemple: \*\*curl -L
> <http://registry.guillem.me**>) Répéter la procédure dans le cas ou ça
> échoue.

Maintenant, **sur votre poste local** (sur lequel vous avez installé
docker) nous allons nous authentifier à la registry, "tagguer" une image
puis l'envoyer.

> **Note **: Pensez toujours à remplacer **\[registry.domain.tld\]** par
> le sous-domaine choisi précédemment.

``` {.bash}
docker login registry.domain.tld
Username: # saisir l'identifiant admin
Password: # saisir badmin
Login Succeeded
```

Récupérons une image lambda sur DockerHub, tagguons-la, puis envoyons-la
sur notre registry.

    docker pull alpine
    docker tag alpine registry.domain.tld/alpine
    docker push registry.domain.tld/alpine

> **Note **: Remplacez toujours et encore le fameux
> **\[registry.domain.tld\]**

Si tout se déroule comme prévu, vous voyez alors quelque chose de proche
de :

``` {.bash}
The push refers to a repository [registry.domain.tld/alpine]
011b303988d2: Pushed
latest: digest: sha256:1354db23ff5478120c980eca1611a51c9f2b88b61f24283ee8200bf9a54f2e5c size: 528
```

Si c'est le cas, félicitations, vous avez une registry docker à dispo !

Au prochain numéro… {#au-prochain-numero}
-------------------

Nous verrons comment utiliser **docker-compose** pour lancer un
environnement de développement en local en tirant profit de notre
registry docker et d’un outil de versionning pour fabriquer
automatiquement nos images docker.

À la prochaine!

{% endraw %}
