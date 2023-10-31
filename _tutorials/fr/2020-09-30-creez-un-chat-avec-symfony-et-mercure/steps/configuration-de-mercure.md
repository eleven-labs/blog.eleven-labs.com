---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: configuration-de-mercure
title: Configuration de Mercure
---
Mercure va nous permettre d'envoyer et recevoir en temps réel nos messages, sans avoir à reloader les navigateurs
déjà connectés au chat.

Dans un premier temps, il nous faut le package composer qui nous permettra d'interagir avec notre Hub Mercure.

### Installation

Vous avez sans doute remarqué des warnings dans votre console à propos de variables d'environnement Mercure.

Il est temps de s'en occuper en installant le package mercure depuis composer.

```shell
docker-compose exec php composer req mercure
```

De nouvelles variables d'environnement sont apparues dans votre `.env`. Allez les modifier pour obtenir ce résultat :

```env
MERCURE_PUBLISH_URL=http://mercure/.well-known/mercure
MERCURE_JWT_KEY=astronautsKey
MERCURE_ALLOW_ANONYMOUS=1
MERCURE_CORS_ALLOWED_ORIGINS=*
MERCURE_PUBLISH_ALLOWED_ORIGINS='http://localhost'
```

> En production, ne laissez jamais ces données sensibles en clair dans ce fichier.

Petit rappel tout de même. Avec Mercure, vous décidez d'updates qui seront publiées vers un `Hub`, avec
pour identifiant un `topic`. À son tour, le Hub dispatche ces updates à tous les clients abonnés
au topic en question.

Plusieurs points ici :
-   Le `PUBLISH_URL` est l'adresse du Hub mercure sur lequel on veut publier nos updates
-   Le `MERCURE_JWT_KEY` est la clé secrète qui nous permettra de générer un token JWT
-   Et avec `PUBLISH_ALLOWED_ORIGINS`, on autorise Mercure à accepter les Publishers depuis le domaine localhost

Ici donc, admettons que les topics soient nos différents channels. Ces derniers lanceront des updates au Hub à chaque nouveau message envoyé, en étant identifiés par un topic que nous définirons plus loin.

### Autoriser notre application à publier sur le Hub
Si vous vous rappelez bien de l'article de découverte de Mercure, vous savez qu'il est nécessaire de générer un JWT Token afin de pouvoir publier sur le Hub.

Afin de le générer depuis la clé secrète précisée dans le `.env`, nous allons utiliser le package `lcobucci/jwt`.

```shell
docker-compose exec php composer req lcobucci/jwt
```

Créons à présent un service invokable pour générer automatiquement notre token JWT :

```php
<?php

declare(strict_types=1);

namespace App\Service\Mercure;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;

class JwtProvider
{
    private string $key;

    public function __construct(string $key)
    {
        $this->key = $key;
    }

    public function __invoke(): string
    {
        $signer = new Sha256();

        return (new Builder())
            ->withClaim('mercure', ['publish' => ['*']])
            ->getToken($signer, new Key($this->key))
            ->__toString();
    }
}

```

Remarquez que le Claim de notre builder représente le json que nous avions utilisé sur jwt.io dans l'article de blog.

Il se passe ici exactement la même chose, mais dynamiquement avec PHP. En récupérant le token, on le signe avec une signature de type SHA256.

Faites attention à rentrer correctement le claim, avec la bonne clé et la bonne valeur, autrement Mecure vous refusera l'accès au Hub avec une `401 Unauthorized`.

Pour injecter automatiquement la clé que ce service attend dans son constructeur, ajoutez ces lignes dans `services.yaml` :

```yaml
services:
    # ...
    App\Services\Mercure\JwtProvider:
        arguments:
            $key: '%env(MERCURE_JWT_KEY)%'
```

Enfin, rendez-vous dans le fichier de config `mercure.yaml` qui vous a été généré, et remplacez la config par celle-ci :

```yaml
mercure:
    enable_profiler: '%kernel.debug%'
    hubs:
        default:
            url: '%env(MERCURE_PUBLISH_URL)%'
            jwt_provider: App\Services\Mercure\JwtProvider

```

Notre service est à présent fonctionnel.

Ainsi c'est notre nouveau service qui sera invoqué pour générer un nouveau JWT et nous autoriser à publier sur le Hub.

D'ailleurs, relancez toute l'application (`docker-compose down && docker-compose up -d`) afin que les nouvelles variables d'environnement soient bien prises
en compte.

Vous pouvez vous rendre sur [cette branche](https://github.com/ArthurJCQ/tutorial-astro-chat/tree/codelabs/mercure-config) pour être à jour sur cette étape du tutoriel, et continuer sereinement vers la prochaine partie.