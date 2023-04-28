---
lang: fr
date: '2017-03-03'
slug: angular2-symfony3-comment-creer-rapidement-systeme-dauthentification
title: 'Angular2 & Symfony3 : Comment créer rapidement un système d''authentification ?'
excerpt: >-
  Après avoir travaillé sur AngularJS, j'ai voulu tester la seconde version du
  framework : Angular2. Pour me faire la main, j'ai choisi de travailler sur un
  système d'authentification par token en utilisant Symfony pour la partie
  back-end, en incluant le bundle Lexik JWT Authentication.
authors:
  - glanau
categories:
  - php
  - javascript
keywords:
  - symfony
  - angular2
  - angular
---

Introduction
============

Après avoir travaillé sur AngularJS, j'ai voulu tester la seconde version du framework : Angular2. Pour me faire la main, j'ai choisi de travailler sur un système d'authentification par token en utilisant Symfony pour la partie back-end, en incluant le bundle **Lexik JWT Authentication.**

Je vous propose de voir ensemble un exemple très simple et les différentes étapes à suivre pour la mise en place d'une API sécurisée servant une liste de publications (...très privées) à notre application Angular2.

Sommaire
========

1.  **Mise en place de la partie Back-end**
    1.  Installation d'une application Symfony3
    2.  Installation des bundles nécessaires
    3.  Création d'utilisateurs
    4.  Création d'un jeu de données
2.  **Mise en place de la partie Front-end**
    1.  Création d'une application Angular2 via Angular CLI
    2.  Création des différents composants
    3.  Mise en place d'un système de routing
    4.  Authentifier ses requêtes grâce à Angular2-jwt
    5.  Protéger les routes authentifiées avec AuthGuard
3.  **Conclusion**

![](/_assets/posts/2017-03-03-angular2-symfony3-comment-creer-rapidement-systeme-dauthentification/sf-blog-2.png)

---

### **1 Mise en place de la partie Back-end**

#### 1.1 Installation d'une application Symfony3

Installons tout d'abord la dernière version de Symfony3 via l'installeur prévu à cet effet sur le site officiel :

```sh
symfony new api-lab
```

Puis lançons le serveur PHP interne via cette commande à la racine du projet :

```sh
bin/console server:start
```

#### 1.2 Installation des bundles nécessaires

Viens ensuite l'installation et la configuration de certains bundles incontournables lorsque l'on veut créer une API. Nous sauterons volontairement l'étape du "composer require" et de la déclaration des bundles dans le Kernel de Symfony pour passer directement à la configuration.

##### **FOSRestBundle**

Ce bundle va nous permettre d'utiliser des routes API automatiques ainsi que de retourner des réponses au format Json à notre client Angular2 avec un minimum de configuration :

```yaml
# app/config/config.yml
fos_rest:
    routing_loader:
        default_format: json
    view:
        view_response_listener: true
```

```yaml
# app/config/routing.yml
app:
    resource: "@AppBundle/Controller/"
    type: rest
    prefix: /api
```

**[+ d'information sur la documentation](http://symfony.com/doc/current/bundles/FOSRestBundle/index.html){:rel="nofollow noreferrer"}**

##### **NelmioCorsBundle**

Continuons ensuite avec le Bundle, qui va nous permettre de faire des requêtes Ajax sur l'API, étant donné que nos deux applications se trouvent sur deux domaines différents :

```yaml
nelmio_cors:
    paths:
        '^/api/':
            allow_origin: ['http://localhost:4200']
            allow_headers: ['origin', 'content-type', 'authorization']
            allow_methods: ['POST', 'PUT', 'GET', 'DELETE']
            max_age: 3600
```

*Note : Nous avons ici autorisé notre future application Angular2 ainsi que le header "authorization" qui nous servira à nous authentifier. Patience, on y est bientôt :)*

##### **JMSSerializerBundle**

Ce bundle va nous permettre de sérialiser les données renvoyées par notre API. Aucune configuration n'est nécessaire dans le cadre de cet article. Nous utiliserons JMSSerializer plus tard, directement dans notre PostController.

##### **LexikJWTAuthenticationBundle**

Enfin,  last but not least, le bundle qui va nous servir à sécuriser l'accès à nos données Symfony via un token d'authentification. Je vous laisse lire la **[documentation](https://github.com/lexik/LexikJWTAuthenticationBundle/blob/master/Resources/doc/index.md#getting-started){:rel="nofollow noreferrer"}** officielle qui est très claire. Il vous suffit vraiment de suivre les étapes point par point.

*Note : J'ai ajouté deux petites lignes sous l'index "form\_login" du security.yml de façon à pouvoir envoyer username & password au lieu de \_username et \_password pour nous authentifier auprès de notre API. Je vous invite à en faire de même :*

```yaml
username_parameter: username
password_parameter: password
```

Nous allons ensuite devoir générer des données de bases pour pouvoir tester notre système.

#### 1.3 Création d'utilisateurs

Nous avons besoin d'un utilisateur. Il s'appellera "gary" et aura comme password "pass" (très original...). Pour ce faire nous n'allons pas mettre en place un système de gestion d'utilisateurs car ce n'est pas le but de cet article. Nous allons utiliser le système "user in memory" de Symfony. Je vous propose donc de rajouter un peu de configuration :

```yaml
# app/config/security.yml
security:
    encoders:
        Symfony\Component\Security\Core\User\User: plaintext

    providers:
        in_memory:
            memory:
                users:
                    gary:
                        password: pass
                        roles: 'ROLE_USER'
```

#### 1.4 Création d'un jeu de données

Nous allons avoir besoin de publications à renvoyer à notre client Angular2. Nous devons créer une entity "Post" qui sera la représentation de nos données.

*Note : Nous n'ajouterons qu'une seule propriété "title" à cette entity pour les besoins de ce tutoriel même s'il serait utile que nos publications aient aussi un auteur, un contenu, une date de création, etc, etc...*

```php
<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

/**
 * Post
 *
 * @ORM\Table(name="posts")
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 */
class Post
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     *
     * @Serializer\Expose
     */
    private $title;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Post
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }
}
```

Utilisons ensuite le **DoctrineFixturesBundle** (après l'avoir installé bien sûr !) pour générer deux publications en créant une classe LoadPostData :

```php
<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Post;

class LoadPostData implements FixtureInterface
{
   public function load(ObjectManager $manager)
   {
      $post = new Post();
      $post->setTitle('post1');

      $post2 = new Post();
      $post2->setTitle('post2');

      $manager->persist($post);
      $manager->persist($post2);
      $manager->flush();
   }
}
```

Créons ensuite la base de données, le schéma, et chargeons les données via ces commandes :

```sh
# Création de la base
bin/console do:da:cr

# Création du schéma de données
bin/console do:sc:cr

# Générations des fixtures
bin/console doctrine:fixtures:load
```

Enfin créons notre PostController avec la méthode qui sera le endpoint de notre micro API :

```php
<?php

namespace AppBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations as Rest;

class PostController extends FOSRestController implements ClassResourceInterface
{
    /**
     * @Rest\View()
     */
    public function cgetAction()
    {
        return $this->getDoctrine()->getRepository('AppBundle:Post')->findAll();
    }
}
```

Nous voilà parés ! Vous pouvez dès lors tester la partie back-end en faisant une requête POST vers notre endpoint :

```sh
curl -X POST http://localhost:8000/api/login_check -d username=gary -d password=pass
```

Si tout va bien, vous devriez recevoir un token d'authentification.

C'est le cas ? Très bien, nous allons pouvoir commencer la partie front-end :)

![](/_assets/posts/2017-03-03-angular2-symfony3-comment-creer-rapidement-systeme-dauthentification/ng-blog.png)

---

### **2 Mise en place de la partie Front-end**

#### 2.1 Création de l'application Angular2 via Angular CLI

Installons tout d'abord Angular CLI globalement sur notre machine. Cet outil va nous servir à générer la structure de notre application via une simple commande et à recompiler à la volée nos modifications :

```sh
npm install -g @angular/cli
```

Créons ensuite notre application :

```sh
ng new api-lab
```

Puis lançons notre serveur interne :

```sh
cd api-lab && ng serve
```

Maintenant que notre application est lancée, vous pouvez vous rendre sur l'url indiquée dans votre console pour accéder à votre application :

<http://localhost:4200>

Vous devriez alors voir apparaître : **app works!**

#### 2.2 Création des différents composants

Nous allons ensuite générer trois composants principaux supplémentaires :

-   homepage
-   authentication
-   post

Commençons notre composant "homepage" en lançant la commande suivante :

```sh
ng g c homepage
```

*Note : "g" pour generate et "c" pour... component :)*

```js
// homepage/homepage.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
})
export class HomepageComponent {}
```

*Note : vous remarquerez que nous avons enlevé la déclaration du fichier css. En effet, nous inclurons bootstrap pour styliser rapidement notre application.*

```html
<!-- homepage/homepage.html -->
<h1>Home</h1>
```

Créons ensuite le composant "authentication" de la même manière :

```sh
ng g c authentication
```

```js
// authentication/authentication.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
})
export class AuthenticationComponent {
    loginForm: FormGroup;
    error: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
        this.loginForm = formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    onSubmit() {
        this.authenticationService
            .authenticate(this.loginForm.value)
            .subscribe(
                data => {
                    localStorage.setItem('id_token', data.token);
                    this.router.navigate(['post']);
                },
                error => this.error = error.message
            );
    }
}
```

```html
<!-- authentication/authentication.component.html -->
<h1>Login</h1>
<div>
	<div [hidden]="!error" class="alert alert-danger" role="alert">
	  	<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
	  	<span class="sr-only">Error:</span>
	  	{{ error }}
	</div>
	<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
		<div class="form-group">
			<input type="text" class="form-control" placeholder="Username*" formControlName="username">
		</div>

		<div class="form-group">
			<input type="password" class="form-control" placeholder="Password*" formControlName="password">
		</div>

		<button type="submit" class="btn btn-success pull-right" [disabled]="!loginForm.valid">Submit</button>
	</form>
</div>
```

Ce composant sera notre formulaire d'authentification vers notre API. Nous utiliserons le module ReactiveFormsModule de Angular2 pour une mise en place plus simple sans utiliser la directive \[(ngModel)\] très gourmande en ressources et pour pouvoir lui attribuer des validateurs.

Passons ensuite à la création du composant "post" :

```sh
ng g c post
```

```js
// post/post.component.ts
import { Component, OnInit } from '@angular/core';

import { PostRepository } from './post-repository.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
    posts: any[] = [];
    error: string = '';

    constructor(private postRepository: PostRepository) {}

    ngOnInit() {
        this.postRepository
            .getList()
            .subscribe(
                data => this.posts = data,
                error => this.error = error.message
            );
    }
}
```

```html
<!-- post/post.component.html -->
<h1>Posts</h1>
<div [hidden]="!error" class="alert alert-danger" role="alert">
  	<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  	<span class="sr-only">Error:</span>
  	{{ error }}
</div>
<ul>
	<li *ngFor="let post of posts">
		<a href="#">{{ post.title }}</a>
	</li>
</ul>
```

Pour finir, nous allons ajouter deux services à notre application.

-   Un service qui nous servira à nous authentifier sur notre API et à gérer le login & logout
-   Un service qui nous servira à requêter notre endpoint qui nous renverra notre liste de publications

Pour se faire, lancez les commandes suivantes :

```
ng g s authentication/authentication --flat
```

*Note : "g" pour generate, "s" pour... service (je sais que vous saviez !) et "--flat" pour créer des composants sans dossiers :)*

```js
// authentication/authentication.service.ts
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {}

  authenticate(user: any) {
      let url     = 'http://127.0.0.1:8000/api/login_check';
        let body     = new URLSearchParams();
        body.append('username', user.username);
        body.append('password', user.password);
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});

      return this.http
              .post(url, body.toString(), options)
          .map((data: Response) => data.json());
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired();
  }
}
```

```sh
ng g s post/post-repository --flat
```

```js
// post/post-repository.service.ts
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class PostRepository {

  constructor(private authHttp: AuthHttp) {}

  getList() {
      let url = 'http://127.0.0.1:8000/api/posts';

    return this.authHttp
          .get(url)
          .map((data: Response) => data.json());
  }
}
```

*Note : Nous remarquerons que nous utilisons Http dans l'authentication service alors que nous utilisons AuthHttp dans le post-repository service. Il y a une très bonne raison à cela. En effet, comme il est écrit dans la documentation de la librairie Angular2-jwt :*

> This library does not have any functionality for (or opinion about) implementing user authentication and retrieving JWTs to begin with. Those details will vary depending on your setup, but in most cases, you will use a regular HTTP request to authenticate your users and then save their JWTs in local storage or in a cookie if successful.

En d'autres termes, cette librairie n'est pas faite pour s'authentifier et stocker notre token. Pour cette étape, il vaut mieux privilégier l'utilisation du module Http basique livré avec Angular2.

#### 2.3 Mise en place d'un système de routing

Nous allons maintenant nous occuper du routing. En effet nous n'avons pour l'instant aucun moyen d'afficher le contenu qui se trouve dans les fichiers html de nos composants. Pour configurer le routing de votre application, c'est très simple. Nous allons créer un fichier app.routing.ts à la racine de notre application et indiquer les trois routes de nos composants principaux ainsi que la route de redirection au cas où nous entrions une url qui ne correspond à aucune route :

```js
// app.routing.ts
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from './_guard/index';

const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'login',
        component: AuthenticationComponent
    },
    {
        path: 'post',
        component: PostComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(APP_ROUTES);
```

#### 2.4 Protéger les routes authentifiées avec AuthGuard

Pour finir, nous allons mettre en place un système permettant de protéger nos routes sécurisées via Guard. Créons un dossier "\_guard" dans le dossier "app" contenant deux fichiers :

```js
// _guard/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authentication: AuthenticationService, private router: Router) {}

    canActivate() {
        if(this.authentication.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['login']);

            return false;
        }
    }
}
```

```js
// _guard/index.ts
export * from './auth.guard';
```

Nous importerons le fichier index.ts dans notre fichier app.module.ts et nous déclarerons AuthGuard en tant que provider puis nous l'importerons également dans notre fichier app.routing.ts pour protéger notre route "post" via la propriété "canActivate".

#### 2.5 Authentifier ses requêtes avec Angular2-jwt

Pourquoi ai-je choisi d'utiliser cette librairie ? Et bien tout d'abord pour l'essayer. Et puis parce qu'elle va nous simplifier la vie. Enfin du moins l'envoi des requêtes vers notre API dans un premier temps.

En effet, ce wrapper du module Http natif d'Angular2 permet d'inclure directement l'id\_token contenu dans le localStorage, dans un header "authorization" compatible avec le format utilisé par notre LexikJwtAuthenticationBundle.

Le deuxième avantage de cette librairie est qu'elle va automatiquement vérifier si le token est valide. Ce qui n'est pas du tout négligeable.

Installons angular2-jwt via npm à la racine du projet en lançant cette commande :

```sh
npm install angular2-jwt
```

Maintenant que nous avons structuré notre application, il nous faut mettre à jour notre composant "app" ainsi que notre fichier app.module.ts avec les imports nécessaires :

```js
// app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    hasAuthToken() {
        return localStorage.getItem('id_token') !== null;
    }

    logout() {
         this.authenticationService.logout();
             this.router.navigate(['home']);
    }
}
```

```html
<!-- app.component.html -->
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <img class="pull-left logo" src="../assets/images/ng-xs.png" alt="Angular2">
            <a class="navbar-brand" [routerLink]="['']">Api Lab</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a [routerLink]="['']">Home</a></li>
                <li><a [routerLink]="['post']">Posts</a></li>
            </ul>
            <ul class="nav navbar-nav pull-right">
                <li *ngIf="!hasAuthToken()"><a [routerLink]="['login']">Login</a></li>
                <li *ngIf="hasAuthToken()"><a (click)="logout()" href="#">Logout</a></li>
            </ul>
        </div>
    </div>
</nav>

<router-outlet></router-outlet>
```

```js
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { Routing } from './app.routing';
import { AuthGuard } from './_guard/index';

import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationService } from './authentication/authentication.service';
import { HomepageComponent } from './homepage/homepage.component';
import { PostComponent } from './post/post.component';
import { PostRepository } from './post/post-repository.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp( new AuthConfig({}), http, options);
}

@NgModule({
     declarations: [
         AppComponent,
         AuthenticationComponent,
         HomepageComponent,
         PostComponent
     ],
     imports: [
         BrowserModule,
         ReactiveFormsModule,
         HttpModule,
         Routing
     ],
     providers: [
     {
         provide: AuthHttp,
         useFactory: authHttpServiceFactory,
         deps: [ Http, RequestOptions ]
     },
         AuthGuard,
         AuthenticationService,
         PostRepository
     ],
     bootstrap: [AppComponent]
})
export class AppModule { }
```

*Note : J'ai délibérément inclus la factory authHttpServiceFactory directement dans ce fichier contrairement à ce que dit la documentation car il y a un bug connu de la team Angular2-jwt lors de la compilation* *qui peut être résolu de cette manière :)*

Enfin, pour finaliser notre application, il ne reste plus qu'à lui appliquer un peu de style :

```html
<!-- index.html -->

<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Api Lab</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="icon" type="image/x-icon" href="../../public/favicon.ico">
  <script src="https://code.jquery.com/jquery-3.1.1.min.js"
    integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
    crossorigin="anonymous">
  </script>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container">
  	<app-root><div class="text-center loading">Loading...</div></app-root>
  </div>

  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</body>
</html>
```

```css
// style.css
/* You can add global styles to this file, and also import other style files */
body {
    padding-top: 50px;
}

.loading {
    font-weight: bold;
    margin-top: 150px;
}

.logo {
    margin: 5px;
}
```

Et voilà le travail !

![](/_assets/posts/2017-03-03-angular2-symfony3-comment-creer-rapidement-systeme-dauthentification/Capture-decran-2017-03-03-a-01.58.49.png)

![](/_assets/posts/2017-03-03-angular2-symfony3-comment-creer-rapidement-systeme-dauthentification/Capture-decran-2017-03-03-a-13.28.40.png)

### 3 Conclusion

Pour conclure, je dirais que cette expérience s'est avérée très enrichissante. Angular2 propose une nouvelle perception du framework front-end en comparaison à la première version. Une façon de développer qui se rapproche plus de la programmation orientée objet et rappelle étrangement les frameworks PHP au niveau de la structures des fichiers. Enfin le CLI, bien que toujours en version beta, reste un outil très pratique dans la lignée de la console de Symfony. Une très bonne première expérience. To be continued !
