---
layout: post
title: Protégez du brute force votre application Symfony avec Maba Gentle Force
excerpt: Je vous propose de découvrir un bundle très simple à configurer afin de protéger votre application Sympony contre les attaques de brute force
authors:
- dim
lang: fr
permalink: /symfony-brute-force-protection/
categories:
    - symfony
tags:
    - securite
    - symfony
    -  
---


## Protégez du brute force votre application Symfony avec Maba Gentle Force

La sécurité est l'affaire de tous, vous avez certainement déjà tous entendu cela au moins une fois.
Avec l'arrivée de la RGPD, les fuites de données sont de plus en plus médiatisées et si vous souhaitez éviter d'avoir à faire aux institutions comme la CNIL ou tout simplement si vous souhaitez un outil simple pour protéger contre le brute force votre application Symfony, je vous présente Maba Gentle Force.

## Maba Gentle Force, késaco ?

C'est un bundle basé sur la librairie PHP [Gentle Force](https://github.com/mariusbalcytis/gentle-force).

## Introduction de Gentle Force

La librairie utilise l’algorithme [Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) :
L'utilisateur possède des jetons qu'il va pouvoir utiliser pour effectuer ses actions. À chaque tentative, un jeton sera consommé jusqu’à ce qu'il n'y en ait plus. Il va ensuite pouvoir regagner d'autres jetons au bout d'un certain temps (configurable) pour faire une nouvelle tentative.
Cette librairie fonctionne avec [Predis](https://github.com/nrk/predis) pour le stockage des jetons.

Voici une liste de fonctionnalités que propose Gentle Force :
- Vérification des jetons disponible pré-tentatives d'authentification pour empêcher la [Race_condition](https://en.wikipedia.org/wiki/Race_condition).
- Possibilité de définir différentes limitations selon les créneaux temporels.
- Différents moyens sur lesquels baser sa vérification d'identité : ID, token d'api, adresse IP, etc...


## Initialisation

```sh
composer require maba/gentle-force-bundle
```

Ajouter le bundle dans votre AppKernel si vous n'utilisez pas flex :

```php
new \Maba\Bundle\GentleForceBundle\MabaGentleForceBundle(),
```

Importez ensuite les routes dans votre routing.yml.

```yaml
gentle_force:
    resource: '@MabaGentleForceBundle/Resources/config/routing.xml'
```

Vous trouverez dans l'arborescence `App/config/packages/` un fichier de configuration `maba_gentle_force.yml`.
Dans ce fichier vous allez tout d'abord devoir déclarer votre Predis :

```yaml
maba_gentle_force:
    redis:
        service_id: votre service client redis
```

## Utilisation

### Cas simple

Dans le cas où dans votre application vous permettez à vos utilisateurs l'upload de documents, et afin d'éviter que ceux ci ne saturent vos espaces de stockage, vous pouvez par exemple ajouter cette portion dans votre fichier de configuration `maba_gentle_force.yml`.

```yaml
    limits:
        documents_upload:
            # Autorise uniquement 50 uploads par jour
            -   max_usages: 50
                period: 1d
```

Pour les cas simples où vous n'avez pas le besoin de faire de vérification spécifique, vous devez y ajouter également la configuration du listener comprenant :
- la route concernée.
- la clé d'identifiant de la configuration.
- le type de donnée d'entrée servant à la vérification (ici l'IP).
- la stratégie de réponse (headers signifiant une réponse pré-configurée pour retourner un statut HTTP 429 Too Many Requests).
```yaml
    listeners:
        -   path: ^/votre-route
            limits_key: documents_upload
            identifiers: [ip]
            strategy: headers
```

Si votre vérification porte sur une route peu critique, il est également possible de définir une `strategy: log` à la place, afin de ne pas bloquer vos utilisateurs tout en assurant une surveillance à travers les logs disponibles.
Dans ce cas, il vous faudra également ajouter la configuration sur la stratégie de log :

```yaml
      strategies:
        default:    headers
        log:
            level:  error
```

### Cas avancé 1 : Réinitialisation de mot de passe

Limiter l'accès à une route est plutôt simple, nous allons voir maintenant comment limiter l'accès à une portion de votre application. L'exemple ici portera sur la fonctionnalité de récupération de mot de passe.

#### Première étape : configuration

Dans notre `maba_gentle_force.yml` vous allez devoir déclarer votre configuration :

```yaml
    limits:
        reset_password:
            # Autorise uniquement 3 erreurs par heure
            # 3 tokens d'erreurs seront récupérés pendant 1 heure suivant la dernière erreur
            -   max_usages: 3
                period: 1h
                bucketed_usages: 3

                # Autorise uniquement 20 erreurs par jour
            -   max_usages: 20
                period: 1d
```

Contrairement au cas précédent, nous n'avons pas de listener de route à définir, nous allons directement utiliser le `Throttler` de l'outil.

#### Deuxième étape : utilisation

Du côté de notre code PHP, nous allons dans un premier temps récupérer le `Throttler` puis utiliser la méthode `checkAndIncrease` avant d'appeler notre service de récupération de mot de passe en passant en paramètre :
- l'identifiant de configuration : `reset_password`
- l'identifiant d'identité de l'utilisateur : l'adresse IP

```php
if ($form->isSubmitted() && $form->isValid()) {
    // Augmenter le compteur de tentatives avant de vérifier la légitimité de l'utilisateur
    // Cela permet entre autres d'éviter la "race condition" provenant d'un grand nombre de requêtes
    try {
        $bucket = $this->get('maba_gentle_force.throttler')->checkAndIncrease('reset_password', $request->getClientIp());
    } catch (RateLimitReachedException $exception) {
        // Vous pouvez logger ici votre erreur puis retourner une réponse avec le code HTTP 429
    }
    // Tout va bien, vous pouvez exécuter votre code permettant de réinitialiser son mot de passe
    // Vous pouvez ensuite réduire le compteur pour éviter de bloquer inutilement votre utilisateur
    $bucket->decrease();
}
```

### Cas avancé 2 : authentification

Certaines fonctionnalités sont plus soumises aux attaques que d'autres. Il est donc nécessaire d'augmenter d'un cran la sécurité de celles-ci. On parle par exemple de l'authentification de votre application.

Cette fois-ci nous allons nous baser sur plusieurs identifiants de vérification : l'email de l'utilisateur et son IP.

#### Première étape : configuration

La différence ici sera uniquement dans l'ajout d'une configuration par identifiant de vérification.
La configuration est similaire à celle du cas précédent, on retrouve nos limitations par durée de créneau de temps :

```yaml
    limits:
        authentication_email:
            # Autorise uniquement 10 erreurs par heure
            # 5 jetons d'erreurs supplémentaires seront récupérés pendant 1 heure
            -   max_usages: 10
                period: 1h
                bucketed_usages: 5

                # Autorise uniquement 30 erreurs par jour
            -   max_usages: 30
                period: 1d

        authentication_ip:
            # Autorise uniquement 120 erreurs par heure par IP
            -   max_usages: 60
                period: 1h
```

#### Deuxième étape : utilisation

Si vous utilisez [Guard](https://symfony.com/doc/current/security/guard_authentication.html) de Symfony, dans votre implémentation de la méthode `checkCredentials`, vous allez pouvoir ajouter cette portion de code qui agit comme dans le cas précédent en vérifiant cette fois une par une les conditions ayant chacune leur propre configuration.

```php
$identifier = $user->getEmail();
$rule = 'authentication_email';
$throttler = $this->get('maba_gentle_force.throttler');
try {
    // Première vérification avec la configuration sur l'email
    $bucket = $throller->checkAndIncrease($rule, $identifier);
    // Deuxième vérification avec la configuration sur l'IP
    if (isset($credentials['ip'])) {
        $identifier = $credentials['ip'];
        $rule = 'authentication_ip';
        $credentialsResultIp = $throttler->checkAndIncrease($rule, $identifier);
    }
} catch (RateLimitReachedException $exception) {
    throw new RateLimitedBadCredentialsException($exception, $rule, $identifier);
}
// L'authentificaion s'est bien passée, vous pouvez décrémenter le seau de jetons
$bucket->decrease();
```

## Bonus : google recaptcha

le bundle propose une configuration compatible avec l'utilisation de [google recaptcha](https://www.google.com/recaptcha/intro/v3.html)

Il vous faudra taper cette ligne de commande en plus :

```sh
composer require google/recaptcha
```

Puis dans votre fichier de configuration `maba_gentle_force.yml` vous pourrez y ajouter vos credentials :

```yaml
maba_gentle_force:
    recaptcha:
        site_key: my_recaptcha_site_key # get this at google.com/recaptcha
        secret: my_recaptcha_secret     # this also
```

Vous pourrez enfin définir deux stratégies propres à recaptcha :
- `recaptcha_headers` aura le même résultat que headers en renvoyant les credentials recaptcha en vue d'activer le widget (pour une API par exemple)
- `recaptcha_template` permettra d'envoyer une réponse sous forme de template HTML (nécessite l'installation de TWIG) contenant le widget

```yaml
    strategies:
        recaptcha_headers:
            site_key_header:      your-site-key-header-to-enable-widget
            unlock_url_header:    your-url-to-unlock
        recaptcha_template:
            template:             your-template-including-google-widget
```

## Aperçu du fichier final


```yaml
maba_gentle_force:
    redis:
        service_id: votre service client redis

    limits:
        authentication_email:
            -   max_usages: 10
                period: 1h
                bucketed_usages: 5

            -   max_usages: 30
                period: 1d

        authentication_ip:
            -   max_usages: 60
                period: 1h

        reset_password:
            -   max_usages: 3
                period: 1h
                bucketed_usages: 3

            -   max_usages: 20
                period: 1d

        documents_upload:
            -   max_usages: 50
                period: 1d

    listeners:
        -   path: ^/votre-route
            limits_key: documents_upload
            identifiers: [ip]
            strategy: headers

    strategies:
        default:    headers
        log:
            level:  error
        recaptcha_headers:
            site_key_header:      your-site-key-header-to-enable-widget
            unlock_url_header:    your-url-to-unlock
        recaptcha_template:
            template:             your-template-including-google-widget

    recaptcha:
        site_key: votre-recaptcha-site-key
        secret: votre-recaptcha-secret
```

## Le mot de la fin

La sécurité est un domaine très vaste et cet outil n'en est qu'un parmi tant d'autres.
PAr exemple, ce bundle ne protègera pas votre application contre de la vérification de combinaison mot de passe / email de manière unitaire comme utilisé récemment dans certaines [attaques](https://www.numerama.com/tech/458514-dailymotion-reinitialise-des-mots-de-passe-apres-une-attaque-informatique-a-grande-echelle.html).
Peu importe quels outils vous allez sélectionner dans votre environnement technique, il convient de rappeler l'importance de prendre en compte l'aspect de la sécurité dans chacun de vos développements.
