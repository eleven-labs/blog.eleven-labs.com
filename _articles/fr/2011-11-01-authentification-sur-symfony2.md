---
contentType: article
lang: fr
date: '2011-11-01'
slug: authentification-sur-symfony2
title: Authentification sur Symfony2
excerpt: >-
  Nouveau tuto sur Symfony2, comme pour tous les sites nous avons souvent besoin
  de rendre une partie de ce dernier non visible pour le public. Pour cela, nous
  allons mettre en place le système d'authentification de Symfony.
categories:
  - php
authors:
  - captainjojo
keywords:
  - symfony
  - symfony2
---

Attention ce code date du début de Symfony2 un nouveau tuto est en cours

Nouveau tuto sur Symfony2, comme pour tous les sites nous avons souvent besoin de rendre une partie de ce dernier non visible pour le public. Pour cela, nous allons mettre en place le système d'authentification de Symfony.

Pour commencer, il faut comprendre comment fonctionne le système d'authentification avec Symfony2.
Il fonctionne en deux étapes, la première est l'authentification de l'utilisateur qui peut se faire de différentes manières :

- un formulaire de login
- http authentification
- une authentification custom

Puis l'étape de l'autorisation de l'utilisateur qui elle aussi peut s'effectuer de différentes manières :

- le control par url
- ACL
- objets sécurisés

Dans notre exemple, nous allons créer une partie admin dans le projet, cette partie ne sera disponible que pour les utilisateurs ayant le rôle d'administrateur.
Tout ce passe dans le fichier app/config/security.yml, qui va nous permettre de mettre en place les pages que nous voulons protéger ainsi que la page de login.
Tout d'abord, nous allons ajouter un firewall en donnant le type d'authentificaiton que nous souhaitons, ici, c'est un formulaire de login qui aura pour accès l'url /login, pour la vérification du formulaire il aura comme url /login_check et enfin l'url de logout.

```yaml
security:
    firewalls:
        assets:
            pattern:  ^/(_(profiler|wdt)|css|images|js|favicon.ico)/
            security: false
        secured_area:
            form_login:
              login_path: /login
              check_path:  /login_check
            logout:
                path: /logout
                target: /
```

Il faut alors ajouter les zone d'access des utilisateurs, pour cela il faut ajouter access_control et mettre les rôles pour une serie d'url. Comme nous l'avons dit, nous voulons que la partie admin de notre site soit visible seulement pour les administrateurs.

```yaml
security:
    firewalls:
        assets:
            pattern:  ^/(_(profiler|wdt)|css|images|js|favicon.ico)/
            security: false
        secured_area:
            pattern: ^/
            anonymous: ~
            form_login:
              login_path: /login
              check_path:  /login_check
            logout:
                path: /logout
                target: /

    access_control:
        - { path: ^/login, roles: IS_AUTHENTICATED_ANONYMOUSLY }
        - { path: ^/, roles: IS_AUTHENTICATED_ANONYMOUSLY}
        - { path: ^/admin, roles: ROLE_ADMIN }
```

Ce qui fait que si l'url commence par /admin alors l'utilisateur doit avoir le rôle admin.
Maintenant que nous savons comment l'utilisateur va s'authentifier et quelles url sont protégées, nous devons definir nos utilisateurs.
Dans ce système d'authentification c'est ce que l'on appelle le provider qui est le service de récupération des utilisateurs. Comme nous protégeons la partie admin de notre site, il n'y a pas besoin de stocker les utilisateurs nous avons seulement 2 utilisateurs.

```yaml
security:
    firewalls:
        assets:
            pattern:  ^/(_(profiler|wdt)|css|images|js|favicon.ico)/
            security: false
        secured_area:
            pattern: ^/
            anonymous: ~
            form_login:
              login_path: /login
              check_path:  /login_check
            logout:
                path: /logout
                target: /

    access_control:
        - { path: ^/login, roles: IS_AUTHENTICATED_ANONYMOUSLY }
        - { path: ^/i, roles: IS_AUTHENTICATED_ANONYMOUSLY}
        - { path: ^/admin, roles: ROLE_ADMIN }
    providers:
        in_memory:
            users:
                user:  { password: userpass, roles: [ 'ROLE_USER' ] }
                admin: { password: adminpass, roles: [ 'ROLE_ADMIN' ] }
```

Comme on peut le voir dans le fichier, il y a deux utilisateurs dont un qui à le rôle admin, c'est avec celui-ci que nous pourront nous logguer.
Apres avoir configuré le fichier security.yml, nous devons definir les url de login et logout, pour cela il faut ouvrir le fichier routing.yml. Dans notre projet, nous utilisons app/config/routing.yml.

```yaml
login:
    pattern:   /login
    defaults:  { _controller: ClycksBundle:Default:login }
login_check:
    pattern:   /login_check

logout:
    pattern: /logout
    defaults:  { _controller: ClycksBundle:Default:logout }
```

Pour login_check, il n'y a pas besoin de controller, Symfony le fait pour vous :).
Il ne reste plus qu'à remplir le controller pour afficher le formulaire d'authentification.

```php
<?php
// src/Clycks/ClycksBundle/Controller/;
namespace ClycksClycksBundleController;

use SymfonyBundleFrameworkBundleControllerController;
use SymfonyComponentSecurityCoreSecurityContext;

class ClycksController extends Controller
{
    public function loginAction()
    {
        $request = $this->getRequest();
        $session = $request->getSession();

        // Permet la récupération des erreurs
        if ($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(SecurityContext::AUTHENTICATION_ERROR);
        } else {
            $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
        }

        return $this->render('ClycksClycksBundle:Security:login.html.twig', array(
            //Récupération du dernier username
            'last_username' => $session->get(SecurityContext::LAST_USERNAME),
            'error'         => $error,
        ));
    }

    public function logoutAction()
    {
    }
}
```

Comme vous pouvez le voir, nous n'avons pas de code dans l'action logout à vous de mettre ce que vous souhaitez :)
Maintenant nous allons afficher le formulaire dans le fichier login.html.twig.

```twig
{% if error %}
    <div>{{ error.message }}</div>
{% endif %}

<form action="{{ path('login_check') }}" method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="_username" value="{{ last_username }}" />

    <label for="password">Password:</label>
    <input type="password" id="password" name="_password" />

    <input type="submit" name="login" />
</form>
```

Voila maintenant votre partie admin est protégée, dans un prochain tuto j'expliquerai comment créer son propre provider.
