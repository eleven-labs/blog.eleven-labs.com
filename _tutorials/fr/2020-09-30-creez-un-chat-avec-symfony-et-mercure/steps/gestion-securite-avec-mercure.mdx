---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: gestion-securite-avec-mercure
title: Gestion de la sécurité avec Mercure
---
## Update privée

Nous envoyons des messages en temps réel sur notre chat, mais presque n'importe qui peut récupérer nos événements et lire leur contenu. Pas très sécurisé n'est-ce pas ?
Pour protéger nos updates, il suffit de rajouter un paramètre au moment de leur création :

```php
    $update = new Update(
        sprintf('http://astrochat.com/channel/%s',
            $channel->getId()),
        $jsonMessage,
        true // Notre update est à présent privée
    );
```

Et voilà ! Ou presque... Vous remarquez sûrement que le temps-réel de votre messagerie ne fonctionne plus... En effet, l'update étant à présent privée, il va falloir prouver que l'on est autorisé à la recevoir.

Pour cela, notre serveur doit créer un cookie contenant un JWT qui authentifiera le topic auquel on souhaite s'abonner. Ce cookie sera simplement déposé sur le client (navigateur) pour qu'il puisse requêter le Hub avec les bons droits.

### Générer le Cookie

La valeur de ce cookie étant un Jwt, nous allons utiliser le même principe qu'avec notre JwtProvider. Créons un nouveau Service `CookieJwtProvider` et générons un token à l'intérieur :

```php
<?php

declare(strict_types=1);

namespace App\Services\Mercure;

use App\Entity\Channel;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;

class CookieJwtProvider
{
    private string $key;

    public function __construct(string $key)
    {
        $this->key = $key;
    }

    public function __invoke(Channel $channel): string
    {
        $signer = new Sha256();
        return (new Builder())
            ->withClaim('mercure', ['subscribe' => [sprintf('http://astrochat.com/channel/%s', $channel->getId())]]) // Attention le claim est différent qu'avec le JWTProvider. Ici on précise le topic privé que l'on souhaite avec le droit "d'accès"
            ->getToken($signer, new Key($this->key))
            ->__toString()
            ;
    }
}
```

Comme je l'ai précisé, attention au Claim qui est la seule valeur qui change, en comparaison avec notre `JwtProvider`.

N'oubliez pas d'enregistrer votre nouveau service pour lui préciser son argument dans `services.yaml` :
```yaml
services:
    # ...
    App\Services\Mercure\CookieJwtProvider:
        arguments:
            $key: '%env(MERCURE_JWT_KEY)%'
```

Votre Cookie doit être envoyé de préférence au moment du discovery. Générez-le donc dans la réponse de l'action `chat` du `ChannelController`, en stockant la réponse dans une nouvelle variable comme ceci :

```php
    // ...
    $response = $this->render('channel/chat.html.twig', [
        'channel' => $channel,
        'messages' => $messages
    ]);
    $response->headers->setCookie(
        Cookie::create(
            'mercureAuthorization',
            $cookieJwtProvider($channel),
            new \DateTime('+1day'),
            '/.well-known/mercure'
        )
    );
    return $response;
```

N'oubliez pas d'injecter votre `CookieJwtProvider` dans la signature de cette fonction pour pouvoir l'utiliser ici.


## S'authentifier auprès du Hub

Un Cookie est donc à présent déposé dans le navigateur grâce à la réponse de notre serveur.

> Comment l'utiliser pour prévenir le Hub qu'on a le droit d'écouter notre topic favori ?

Il suffit d'ajouter un paramètre au moment de la création de votre EventSource. Aussi simplement que ca :

```javascript
const eventSource = new EventSource(url, {withCredentials: true}); // On a ajouté le "withCredentials". Ainsi la requête sera accompagnée du JWT présent dans le cookie !
```

Et voilà, c'est terminé !

> Mais alors... Pourquoi je ne recois plus mes messages en temps réel ?!

Eh bien, c'est à cause d'une dernière petite subtilité. Quand Mercure envoie des Updates privées, il devient également plus sévère au niveau de ses règles CORS, pour lesquelles il faut préciser le domaine qui recevra les updates.

Changez donc simplement dans votre `.env` la variable d'environnement `MERCURE_CORS_ALLOWED_ORIGINS`, et attribuez-y la valeur `http://localhost:81`.

Et maintenant, après avoir relancé l'application, tout devrait fonctionner correctement !

Pour tester une conversation à plusieurs utilisateurs, ouvrez une nouvelle page de navigation privée ou un nouveau navigateur, et connectez-vous avec un autre utilisateur que vous aurez pris soin de créer.

Discutez ! Et voyez comment les messages sont reçus en temps réel sur votre chat. Tout ce qui vous reste à faire, c'est de lui donner un coup de peinture pour qu'il ressemble à quelque chose, et vous pourrez alors être fiers du résultat.

Vous pouvez vous rendre sur [cette branche](https://github.com/ArthurJCQ/tutorial-astro-chat/tree/codelabs/security-mercure) pour récupérer la version finale de l'application.
