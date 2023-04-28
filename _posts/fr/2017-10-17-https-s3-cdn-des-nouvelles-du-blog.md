---
lang: fr
date: '2017-10-17'
slug: https-s3-cdn-des-nouvelles-du-blog
title: |
  HTTPS, S3, CDN: des nouvelles du blog
excerpt: >-
  De Github Pages à Amazon Web Services, cet article est un retour
  d'expérience/tutorial de notre changement d'hébergement pour le blog.
cover: /assets/2017-10-17-https-s3-cdn-des-nouvelles-du-blog/cover.jpg
authors:
  - VEBERArnaud
categories:
  - architecture
keywords:
  - blog
  - devops
  - aws
  - github
---

En Juillet dernier nous vous annoncions la
[refonte du blog]({{ '/fr/migration-du-blog/' | prepend: site.baseurl | replace: '//', '/' }}) en Jekyll hébergé sur
github pages.
Cependant, l'hébergement sur github pages ne permet pas l'utilisation d'un certificat SSL autre que celui fourni.
Ce certificat étant prévu pour une utilisation sur le domaine `github.io`, nous ne pouvions pas l'utiliser avec notre
domaine `eleven-labs.com`.

Dans ce post, je vais vous expliquer les modifications que nous avons faites afin d'utiliser Amazon Web Services pour
l'hébergement en https tout en conservant notre stratégie de déploiement continu.

Les services AWS que nous utilisons pour cela sont :
- [AWS Certificate Manager](https://aws.amazon.com/fr/certificate-manager/){:rel="nofollow noreferrer"}
- [Amazon S3](https://aws.amazon.com/fr/s3/){:rel="nofollow noreferrer"}
- [Amazon Cloudfront](https://aws.amazon.com/fr/cloudfront/){:rel="nofollow noreferrer"}

> Pour simplifier les interactions avec AWS, nous allons utiliser `aws-cli` afin de ne pas nous perdre dans son interface
> web chargée.
> Un [guide d'installation](http://docs.aws.amazon.com/fr_fr/cli/latest/userguide/installing.html){:rel="nofollow noreferrer"} est disponible sur la
> [documentation officielle](https://aws.amazon.com/fr/documentation/){:rel="nofollow noreferrer"}.

## Mise en place du certificat SSL/TLS avec AWS Certificate Manager

Pour le certificat SSL/TLS, nous utilisons le service AWS Certificate Manager.
Ce service gratuit permet la mise en place et le renouvellement automatiques de certificats SSL/TLS utilisables avec les
services AWS.

### Demande de certificat

Les demandes de certificat via `aws-cli` s'effectuent grâce à la commande `aws acm request-certificate` à laquelle il faut
préciser le nom domaine via l'option `--domain-name`.
Il est également possible de renseigner les options `--subject-alternative-names`, `--idempotency-token` et
`--domain-validation-options`.

Dans notre cas la commande est :

```bash
aws acm request-certificate --domain-name "blog.eleven-labs.com" --region "us-east-1"
```

> La subtilité de cette étape consiste à faire la demande de certificat dans la région us-east-1 (N. Virginia), sinon
> le certificat ne pourra pas être utilisé sur la future distribution Amazon Cloudfront.

### Validation de la propriété du domaine

Avant que l'autorité de certification d'Amazon puisse émettre le certificat, AWS Certificate Manager doit vérifier que
vous possédez ou contrôlez tous les domaines que vous avez indiqués dans la demande.
Amazon Certificate Manager effectue cela en envoyant un e-mail de validation de domaines aux adresses qui sont
enregistrées pour les domaines.
Pour chaque nom de domaine que vous incluez dans votre demande de certificat, un e-mail est envoyé à 3 adresses de
contact dans WHOIS et 5 adresses d'administration système courantes pour votre domaine.
Ainsi, jusqu'à 8 messages électroniques seront envoyés pour chaque nom de domaine que vous spécifiez dans votre demande.
Pour valider, vous devez donner suite à 1 de ces 8 messages dans un délai de 72 heures.

Cet e-mail est envoyé aux trois adresses de contact suivantes dans WHOIS :
- Propriétaire du domaine
- Contact technique
- Contact administratif

L'e-mail est également envoyé aux cinq adresses d'administration système courantes suivantes :
- administrator@votre_domaine
- hostmaster@votre_domaine
- postmaster@votre_domaine
- webmaster@votre_domaine
- admin@votre_domaine

## Déploiement sur Amazon S3 avec Travis CI

Pour l'hébergement de notre blog Jekyll buildé, nous avons opté pour Amazon S3.
Amazon S3 pour Simple Storage Service, est un service de stockage d'objets qui peut-être configuré pour servir les
objets du bucket comme site web statique.
Cette solution est idéale dans notre cas car une fois buildé, le blog est un ensemble de fichiers statiques qui peuvent
être servis tels quels, nous évitant ainsi l'utilisation et les coûts d'une VM de type EC2 qui n'aurait servi qu'à
héberger un serveur web.

### Création du bucket S3

La première étape consiste à créer le bucket S3 qui stockera nos fichiers statiques buildés.
Pour cela on utilise la
commande `aws s3api create-bucket` à laquelle il faut préciser le nom du bucket via l'option `--bucket`.

> La subtilité de cette étape, consiste a nommer le bucket comme le FQDN du site.
> Dans notre cas, le site doit être accessible à l'url `blog.eleven-labs.com`, le bucket doit donc être nommé
> `blog.eleven-labs.com`

La commande à exécuter dans notre cas est :

```bash
aws s3api create-bucket --bucket "blog.eleven-labs.com"
```

### Configuration du bucket en site web

La seconde étape est la configuration du bucket en site web statique.
Nous utilisons ce coup-ci la commande `aws s3api put-bucket-website` en lui précisant le nom du bucket via l'option
`--bucket` ainsi qu'un peu de configuration pour notre site web avec l'option `--website-configuration` à laquelle il
faut fournir un fichier json.

*fichier: blog_eleven-labs_com.s3.json*
```json
{
    "ErrorDocument": {
        "Key": "404.html"
    },
    "IndexDocument": {
        "Suffix": "index.html"
    }
}
```

Dans la configuration du site web, nous renseignons la clé du fichier d'erreur (`ErrorDocument`) ainsi que le suffixe
des documents d'index (`IndexDocument`).
Il est ici question de suffixe car un bucket S3 n'est pas un système de fichier, tous les documents sont à plat et les
slashs `/` font partie intégrante du nom de fichier, on parle alors de clé.
Ce système permet de simuler la fonctionnalité de `DirectoryIndex` de la plupart des serveurs web traditionnels.

Nous utilisons alors la commande :

```bash
aws s3api put-bucket-website --bucket "blog.eleven-labs.com" --website-configuration file://blog_eleven-labs_com.s3.json
```

### Autorisation d'accès publique en lecture seule aux objets du bucket

Maintenant que notre bucket est configuré en tant que site web, il faut également que l'on autorise un accès publique en
lecture aux objets qui se trouvent à l'intérieur.
Pour cela nous utilisons une `policy` que nous attachons au bucket via la commande `aws s3api put-bucket-policy` à
laquelle nous précisons le bucket via l'option `--bucket` ainsi que la policy en json inline dans l'option `--policy`.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::blog.eleven-labs.com/*"
        }
    ]
}
```

Cette policy autorise (`Allow`) un accès en lecture seule (`s3:GetObject`) sur tous les objets du bucket
(`arn:aws:s3:::blog.eleven-labs.com/*`) et à tout le monde (`*`).

```bash
aws s3api put-bucket-policy --bucket "blog.eleven-labs.com" --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::blog.eleven-labs.com/*\"}]}"
```

### Déploiement depuis Travis CI

Notre bucket est maintenant prêt à servir le blog, il ne nous reste plus qu'à y uploader les fichiers buildés à chaque
merge sur la branche master du [repository](https://github.com/eleven-labs/blog.eleven-labs.com){:rel="nofollow noreferrer"} grâce à Travis CI.
Nous utilisons déjà Travis CI pour l'intégration et le déploiement continus du blog, notamment pour la
[vérification de l'orthographe]({{ '/fr/comment-verifier-l-orthographe-de-vos-docs-depuis-travis-ci/' | prepend: site.baseurl | replace: '//', '/' }})
dans les PR mais également la création et l'upload à Algolia des données permettant la recherche dans le blog.

Pour le déploiement du blog dans notre bucket S3, il a suffit d'ajouter deux étapes au fichier de configuration
`.travis.yml`.
L'étape `before_deploy` qui permet de préparer le déploiement et l'étape `deploy` qui effectue le déploiement.

```yml
# .travis.yml

#...

before_deploy:
    - bundle exec jekyll build
    - pip install --user awscli
    - aws s3 rm s3://blog.eleven-labs.com --recursive

deploy:
    - provider: s3
      access_key_id: $AWS_ACCESS_KEY_ID
      secret_access_key: $AWS_SECRET_ACCESS_KEY
      region: $AWS_DEFAULT_REGION
      bucket: blog.eleven-labs.com
      local_dir: _site
      skip_cleanup: true
      on:
          branch: master

#...

```

Dans l'étape de préparation du déploiement, nous buildons les fichiers statiques (`bundle exec jekyll build`) puis nous
installons l'outil aws-cli afin de vider le bucket avant le déploiement (`aws s3 rm s3://blog.eleven-labs.com
--recursive`)

Dans l'étape de déploiement, nous utilisons le provider s3 supporté nativement par travis pour uploader les fichiers
buildés.
Cette étape ainsi que l'étape de préparation du déploiement ne sont déclenchées que pour la branche master.

## Mise en place de Amazon CloudFront

L'autre modification que nous avons apportée à l'architecture du blog est l'ajout d'une distribution Amazon Cloudfront,
cela permet une amélioration des temps de réponse grâce à une augmentation des points de présence.
Mais cela nous a également permis d'utiliser le protocole http2 ainsi que le certificat SSL/TLS que nous avons généré au
début de l'article.

### Création de la distribution Cloudfront

La commande permettant la création d'une distribution Amazon Cloudfront est `aws cloudfront create-distribution` à
laquelle on fournit un fichier json de configuration via l'option `--distribution-config`.

> La subtilité de cette étape, consiste à utiliser une `CustomOriginConfig` à la place d'une `S3OriginConfig`.
> Cela permet de profiter de la fonctionnalité S3 simulant le `DirectoryIndex` étant donné que l'on utilise directement
> le site servi par S3 au lieu du contenu du bucket.

*fichier: blog_eleven-labs_com.cloudfront.json*

```json
{
    "CallerReference": "1504193163145",
    "Aliases": {
        "Quantity": 1,
        "Items": [
            "blog.eleven-labs.com"
        ]
    },
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-Website-blog.eleven-labs.com.s3-website.eu-west-2.amazonaws.com",
                "DomainName": "blog.eleven-labs.com.s3-website.eu-west-2.amazonaws.com",
                "OriginPath": "",
                "CustomHeaders": {
                    "Quantity": 0
                },
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only",
                    "OriginSslProtocols": {
                        "Quantity": 3,
                        "Items": [
                            "TLSv1",
                            "TLSv1.1",
                            "TLSv1.2"
                        ]
                    },
                    "OriginReadTimeout": 30,
                    "OriginKeepaliveTimeout": 5
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-Website-blog.eleven-labs.com.s3-website.eu-west-2.amazonaws.com",
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            },
            "Headers": {
                "Quantity": 0
            },
            "QueryStringCacheKeys": {
                "Quantity": 0
            }
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "AllowedMethods": {
            "Quantity": 2,
            "Items": [
                "HEAD",
                "GET"
            ],
            "CachedMethods": {
                "Quantity": 2,
                "Items": [
                    "HEAD",
                    "GET"
                ]
            }
        },
        "SmoothStreaming": false,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true,
        "LambdaFunctionAssociations": {
            "Quantity": 0
        }
    },
    "CacheBehaviors": {
        "Quantity": 0
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/404.html",
                "ResponseCode": "404",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Comment": "",
    "Logging": {
        "Enabled": false,
        "IncludeCookies": false,
        "Bucket": "",
        "Prefix": ""
    },
    "PriceClass": "PriceClass_100",
    "Enabled": true,
    "ViewerCertificate": {
        "ACMCertificateArn": "arn:aws:acm:us-east-1:760119988015:certificate/0324426f-d1d5-42b7-8c42-955b131b12ba",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1",
        "Certificate": "arn:aws:acm:us-east-1:760119988015:certificate/0324426f-d1d5-42b7-8c42-955b131b12ba",
        "CertificateSource": "acm"
    },
    "Restrictions": {
        "GeoRestriction": {
            "RestrictionType": "none",
            "Quantity": 0
        }
    },
    "WebACLId": "",
    "HttpVersion": "http2",
    "IsIPV6Enabled": true
}
```

Créons la distribution Cloudfront avec la commande:

```bash
aws cloudfront create-distribution --distribution-config file://blog_eleven-labs_com.cloudfront.json
```

### Gestion des invalidations de cache

Le temps de cache par défaut de la distribution Cloudfront étant de 86400 secondes, nous avons maintenant besoin
d'invalider ce cache à chaque nouveau déploiement.

Pour cela nous allons utiliser une nouvelle étape du déploiement avec Travis, le `after_deploy`.
Comme son nom l'indique, cette étape est déclenchée après le `deploy` à condition que celui-ci soit en succès.

```yml
# .travis.yml

#...

after_deploy:
    - aws configure set preview.cloudfront true
    - aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"

#...
```

À cette étape, nous utilisons une fois de plus l'outil aws-cli auquel nous précisons que l'on veut utiliser les
fonctionnalités en preview de la command cloudfront (`aws configure set preview.cloudfront true`), puis nous créons une
demande d'invalidation sur l'ensemble du cache (`aws cloudfront create-invalidation --distribution-id
"$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"`).
`$CLOUDFRONT_DISTRIBUTION_ID` étant une variable définie dans la configuration Travis et contenant l'id de la
distribution Cloudfront.

## Conclusion

Depuis la refonte du blog nous n'avons cessé d'améliorer l'expérience utilisateur en intervenant sur les aspects
graphiques et fonctionnels du blog, mais également comme nous venons de le voir, sur la sécurité, les performances et les
possibilités d'évolutions du blog.

Travis CI nous a permis de conserver notre workflow de déploiement continu et Amazon Web Services nous a permis
d'améliorer les performances et la sécurité grâce à l'utilisation de Cloudfront avec le protocole http2 et de AWS
Certificate Manager pour le certificat SSL/TLS managé.
Concernant les possibilités d'évolutions, il y a par exemple une PWA jusque là bloquée par l'absence de certificat SSL.

Un autre point que j'aimerais éclaircir concerne les coûts de cette architecture.
Nous sommes passés d'un hébergement Github Pages gratuit mais qui ne nous satisfaisait pas pleinement, à cette architecture
payante mais plus flexible et répondant à nos attentes.
Les coûts de cette architecture sont relativement compliqués à estimer étant donné que la facturation pour les services
Amazon Cloudfront et Amazon S3 sont principalement liés à l'utilisation.
L'utilisation de ces services est calculée en fonction du volume de données tranférés pour Cloudfront et du volume de
données stockées sur S3.
Cette solution reste tout de même économique comparée à un hébergement traditionnel composé de serveurs web sur Amazon EC2,
auxquels peuvent s'ajouter un load balancer pour les sites ayant un traffic plus soutenu.

Cette migration n'a rencontré aucun problème en particulier et s'est déroulée de manière totalement transparente pour
les utilisateurs, à l'exception de l'utilisation du protocole https, qui était le but recherché.

Cette migration a également entraîné la mise en place de "live preview" des pull requests, le fonctionnement étant très
proche de ce que l'on vient de voir ensemble, mais je garde ce sujet pour un potentiel futur article sur notre blog.
