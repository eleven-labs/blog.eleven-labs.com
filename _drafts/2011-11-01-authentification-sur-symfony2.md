---
layout: post
title: Authentification sur Symfony2
author: jonathan
date: '2011-11-01 09:20:01 +0100'
date_gmt: '2011-11-01 09:20:01 +0100'
categories:
- Symfony
tags:
- php
- symfony2
---

Attention ce code date du début de Symfony2 un nouveau tuto est en cours

&nbsp;

Nouveau tuto sur Symfony2, comme pour tous les sites nous avons souvent besoin de rendre une partie de ce dernier non visible pour le public. Pour cela, nous allons mettre en place le système d'authentification de Symfony.

<!--more-->Pour commencer, il faut comprendre comment fonctionne le système d'authentification avec Symfony2.

Il fonctionne en deux étapes, la première est l'authentification de l'utilisateur qui peut se faire de différentes manières :

<ul>
<li>un formulaire de login</li>
<li>http authentification</li>
<li>une authentification custom</li>
</ul>
<div>Puis l'étape de l'autorisation de l'utilisateur qui elle aussi peut s'effectuer de différentes manières :</div>
<div>
<ul>
<li>le control par url</li>
<li>ACL</li>
<li>objets sécurisés</li>
</ul>
</div>
<div>Dans notre exemple, nous allons créer une partie admin dans le projet, cette partie ne sera disponible que pour les utilisateurs ayant le rôle d'administrateur.</div>
<div>Tout ce passe dans le fichier app/config/security.yml, qui va nous permettre de mettre en place les pages que nous voulons protéger ainsi que la page de login.</div>
<div>Tout d'abord, nous allons ajouter un firewall en donnant le type d'authentificaiton que nous souhaitons, ici, c'est un formulaire de login qui aura pour accès l'url /login, pour la vérification du formulaire il aura comme url /login_check et enfin l'url de logout.</div>
<div>
<pre class="brush: xml; gutter: true">
{% raw %}
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
                target: /{% endraw %}
</pre>

</div>
<div>Il faut alors ajouter les zone d'access des utilisateurs, pour cela il faut ajouter access_control et mettre les rôles pour une serie d'url. Comme nous l'avons dit, nous voulons que la partie admin de notre site soit visible seulement pour les administrateurs.</div>
<div>
<pre class="brush: xml; gutter: false">
{% raw %}
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
        - { path: ^/admin, roles: ROLE_ADMIN }{% endraw %}
</pre>

</div>
<div>Ce qui fait que si l'url commence par /admin alors l'utilisateur doit avoir le rôle admin.</div>
<div>Maintenant que nous savons comment l'utilisateur va s'authentifier et quelles url sont protégées, nous devons definir nos utilisateurs.</div>
<div>Dans ce système d'authentification c'est ce que l'on appelle le provider qui est le service de récupération des utilisateurs. Comme nous protégeons la partie admin de notre site, il n'y a pas besoin de stocker les utilisateurs nous avons seulement 2 utilisateurs.</div>
<div>
<pre class="brush: xml; gutter: false">
{% raw %}
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
                admin: { password: adminpass, roles: [ 'ROLE_ADMIN' ] }{% endraw %}
</pre>

</div>
<div>Comme on peut le voir dans le fichier, il y a deux utilisateurs dont un qui à le rôle admin, c'est avec celui-ci que nous pourront nous logguer.</div>
<div>Apres avoir configuré le fichier security.yml, nous devons definir les url de login et logout, pour cela il faut ouvrir le fichier routing.yml. Dans notre projet, nous utilisons app/config/routing.yml.</div>
<div>
<pre class="brush: xml; gutter: true">
{% raw %}
login:
    pattern:   /login
    defaults:  { _controller: ClycksBundle:Default:login }
login_check:
    pattern:   /login_check

logout:
    pattern: /logout
    defaults:  { _controller: ClycksBundle:Default:logout }{% endraw %}
</pre>

</div>
<div>Pour login_check, il n'y a pas besoin de controller, Symfony le fait pour vous :).</div>
<div>Il ne reste plus qu'à remplir le controller pour afficher le formulaire d'authentification.</div>
<div>
<pre class="lang:php decode:true brush: php; gutter: true">
{% raw %}
// src/Clycks/ClycksBundle/Controller/;
namespace ClycksClycksBundleController;

use SymfonyBundleFrameworkBundleControllerController;
use SymfonyComponentSecurityCoreSecurityContext;

class ClycksController extends Controller
{
    public function loginAction()
    {
        $request = $this-&gt;getRequest();
        $session = $request-&gt;getSession();

        // Permet la récupération des erreurs
        if ($request-&gt;attributes-&gt;has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $request-&gt;attributes-&gt;get(SecurityContext::AUTHENTICATION_ERROR);
        } else {
            $error = $session-&gt;get(SecurityContext::AUTHENTICATION_ERROR);
        }

        return $this-&gt;render('ClycksClycksBundle:Security:login.html.twig', array(
            //Récupération du dernier username
            'last_username' =&gt; $session-&gt;get(SecurityContext::LAST_USERNAME),
            'error'         =&gt; $error,
        ));
    }
    public function logoutAction()
    {
    }{% endraw %}
</pre>

</div>
<div>Comme vous pouvez le voir, nous n'avons pas de code dans l'action logout à vous de mettre ce que vous souhaitez :)</div>
<div>Maintenant nous allons afficher le formulaire dans le fichier login.html.twig.</div>
<div>
<pre class="lang:php decode:true brush: html; gutter: false ">
{% raw %}
{% if error %}
    &lt;div&gt;{{ error.message }}&lt;/div&gt;
{% endif %}

&lt;form action="{{ path('login_check') }}" method="post"&gt;
    &lt;label for="username"&gt;Username:&lt;/label&gt;
    &lt;input type="text" id="username" name="_username" value="{{ last_username }}" /&gt;

    &lt;label for="password"&gt;Password:&lt;/label&gt;
    &lt;input type="password" id="password" name="_password" /&gt;

    &lt;input type="submit" name="login" /&gt;
&lt;/form&gt;{% endraw %}
</pre>

</div>
<div>
Voila maintenant votre partie admin est protégée, dans un prochain tuto j'expliquerai comment créer son propre provider.

</div>

