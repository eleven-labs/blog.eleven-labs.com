---
layout: post
title: "NestJS : le cycle de vie d'une requête"
excerpt: Explication précise de chaque étape par laquelle passe une requête puis une réponse dans une application NestJS.
lang: fr
permalink: /fr/nestjs-le-cycle-de-vie-dune-requete/
authors:
    - ajacquemin
categories:
    - nestjs
    - javascript
    - typescript
tags:
    - nestjs
    - javascript
    - typescript
    - node
    - request
    - lifecycle
---

Bienvenue dans cet article ayant pour but de faire un tour d'horizon du cycle de vie d'une requête puis d'une réponse dans un environnement NestJS !

<br />

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-03-04-nestjs-le-cycle-de-vie-dune-requete/nest-logo.png" width="300px" alt="NestJS logo" style="display: block; margin: auto;"/>
    <i>NestJS Framework</i>
</div>

<br />

Le but ici sera de donner une représentation précise de chaque étape que peut rencontrer une requête, dans l'ordre, et avec des exemples. Une fois lu une première fois, gardez cet article dans un coin, à la manière d'un **pense-bête**. 
Ainsi, en cas de confusion ou d'esprit embrumé le lendemain d'un jeudi soir un peu arrosé, il sera votre meilleur allié pour que votre gueule de bois passe inaperçue.

Voilà d'ailleurs un **sommaire** pour retrouver rapidement la partie qui vous intéresse :

- [Présentation globale du cycle de vie requête / réponse](#cycle-de-vie--vue-globale)
- [Les niveaux de déclaration](#niveaux-de-déclaration)
- [Présentation des Middlewares](#les-middlewares)
- [Présentation des Guards](#les-guards)
- [Présentation des Interceptors](#les-interceptors)
- [Présentation des Pipes](#les-pipes)
- [Présentation du Controller](#le-controller)
- [Présentation des Exception Filters](#les-exception-filters)
- [Conclusion](#conclusion)

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Vous pouvez totalement être débutant en NestJS pour être en mesure de lire cet article. C'est peut-être même recommandé.
</div>

## Cycle de vie : vue globale
Rien de tel qu'un schéma que je vous ai concocté pour entrer dans le vif du sujet. Je vous laisse vous en imprégner.

![]({{ site.baseurl }}/assets/2022-03-04-nestjs-le-cycle-de-vie-dune-requete/nest-lifecycle-schema.png)

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Il s'agit d'un parcours plutôt exhaustif d'une requête, mais la seule étape réellement essentielle ici est le **Controller**. Il a pour rôle de recevoir votre requête, la traiter, et renvoyer une réponse. Tout le reste est facultatif.
</div>

Comme vous pouvez le constater, une requête, avant d'en arriver au **Controller**, peut passer par 4 premières couches qui sont dans l'ordre : **Middleware** -> **Guard** -> **Interceptor** -> **Pipe**.
Puis, libre à votre **Controller** d'appeler tout **Service** (où par convention repose votre logique métier) ou **Repository** (pour les appels à la base de données) pour traiter la requête.
Enfin, le **Controller** renverra une réponse qui, comme vous le constatez, peut à nouveau passer par un **Interceptor**, puis par les **Exception Filters**.
Nous allons dans cet article expliquer à quoi correspondent chacune de ces étapes.

Chacune de ces couches peut être déclarée sur un ou plusieurs niveaux, rendez-vous dans la section suivante pour les découvrir.

## Niveaux de déclaration

Avant de définir plus en détail chacune des couches vues précédemment, il me semblait important de parler des *niveaux de déclaration*.
En réalité, chacune de ces étapes que traverse la requête peut se diviser en 1 ou plusieurs sous-étapes. Pas de panique, rien de très compliqué ici, voyons par l'exemple.

Tout d'abord, il existe 5 niveaux de déclarations :

- Déclaration **globale**
- Déclaration au niveau **Module**
- Déclaration au niveau **Controller**
- Déclaration au niveau **Route**
- Déclaration au niveau **paramètre de route**

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Par exemple, un Interceptor peut être déclaré à 3 niveaux :

- Globalement
- Au niveau d'un controller
- Au niveau d'une route

Un Interceptor global intercepte toutes les requêtes, tandis qu'un Interceptor placé au niveau d'un Controller / d'une route intercepte seulement les requêtes qui passent par ce Controller / cette route.
</div>

Ainsi, sachez que lors d’une requête, au sein de chaque couche, l’ordre de passage est toujours :

Niveau **global** => Niveau **module** => Niveau **controller** => Niveau **route** => Niveau **paramètre de route**.

Reprenons donc une partie de notre schéma vu plus haut, mais mis à jour. Cela donnerait  :

![]({{ site.baseurl }}/assets/2022-03-04-nestjs-le-cycle-de-vie-dune-requete/updated-lifecycle-schema.png)

Ci-dessous à titre indicatif, vous trouverez des exemples de déclaration pour chaque niveau. Rendez-vous dans les prochaines sections pour les présentations plus poussées de toutes nos couches (Middlewares, Interceptors, ...).

### Déclaration globale

Exemple avec un Guard :

```javascript
// app.module.ts

// ...
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
// ...
```

=> Ce Guard est appliqué globalement = à toute l'application (quelque soit le module où il est déclaré).


### Déclaration niveau module

Exemple avec un Middleware :

```javascript
// app.module.ts

// ...

// Style de déclaration spécifique aux Middlewares
configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
}
```

=> Ce Middleware est déclaré au niveau d'un module, il est donc appelé après tout éventuel Middleware déclaré globalement. Cela étant dit, un Middleware déclaré comme ci-dessus s'applique sur toutes les routes de l'application grâce au wildcard `*`.


### Déclaration niveau Controller

Exemple avec un Interceptor :

```javascript
// some-controller.ts

@UseInterceptors(LoggingInterceptor)
export class SomeController {}
```

=> Cet Interceptor sera appliqué à toutes les routes de ce Controller.

### Déclaration niveau route

Exemple avec un Guard :

```javascript
// some-controller.ts

// ...
@UseGuards(new RolesGuard())
@Get()
async someRoute(): any {
  // ...
}
// ...
```

### Déclaration niveau paramètre de route

Exemple avec un Pipe :

```javascript
// some-controller.ts

// ...
@Get(':id')
async someRoute(@Param('id', ParseIntPipe) id: number): any {
  // ...
}
// ...
```

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
L'annotation `@Param` permet de sélectionner un paramètre de l'URL, ici `:id`.
</div>

Passons maintenant à l'explication de chacun de ces concepts que nous survolons depuis le début. Pour chacun, en début de section, je mettrai une petite note indiquant à quel(s) niveau(x) il est déclarable.

## Les Middlewares

<div  class="admonition info"  markdown="1"><p  class="admonition-title">Niveaux de déclaration possibles</p>
- Global
- Module
</div>

Vous êtes peut-être déjà familier du concept si vous avez déjà fait du développement en NodeJS.
Le Middleware est toujours appelé avant le Controller, et il a accès à la requête, ainsi qu'à la réponse (par conséquent pas encore peuplée par le retour du Controller).

Voilà un exemple de Middleware en Nest :

```javascript
@Injectable()  
export class CurrentUserMiddleware implements NestMiddleware {  
  constructor(private userService: UserService) {}  
  
  async use(req: Request, _: Response, next: NextFunction): Promise<void> {  
    const { userId } = req.session;  
  
    if (userId) {  
      const user = await this.userService.getUserById(userId);  
  
      if (user) {  
        req.currentUser = user;  
      }  
    }  
  
    next();  
  }  
}
```

Dans cet exemple, nous récupérons un potentiel objet `session` dans la requête, puis nous peuplons la requête avec un *user* complet, à l'aide de l'id trouvé dans la `session`.
Enfin, nous n'oublions pas d'appeler `next()` pour continuer l'exécution.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Un Middleware doit implémenter la fonction `use()`.

De plus, il doit se terminer par un appel à la fonction `next()` pour pouvoir passer à la suite des étapes d'exécution. Sans le `next()`, la requête est suspendue.
</div>

## Les Guards

<div  class="admonition info"  markdown="1"><p  class="admonition-title">Niveaux de déclaration possibles</p>
- Global
- Controller
- Route
</div>

Le Guard est une classe dont la mission est le plus souvent l'autorisation. Un Guard a accès à tout le **contexte d'exécution** d'une requête. Il a donc la connaissance de ce qui sera exécuté après lui (quel Controller, quelle fonction, quelle route...). 

Il peut par exemple vérifier quels sont les rôles nécessaires pour accéder au Controller qui sera appelé dans la foulée, et avorter la requête si elle ne contient pas le rôle requis.

Prenons l'exemple d'un Guard appelé à la suite du Middleware que nous avons écrit plus haut. Voilà ce qu'on pourrait faire :

```javascript
@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return request.currentUser.role === UserRole.ADMIN;
  }
}
```

Ici, on vérifie si l'utilisateur stocké plus tôt dans la requête a le rôle **ADMIN**. 

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Un Guard doit implémenter la fonction  `canActivate()`, qui retourne un booléen, de manière synchrone ou dans une Promesse ou un Observable. 
</div>

## Les Interceptors

<div  class="admonition info"  markdown="1"><p  class="admonition-title">Niveaux de déclaration possibles</p>
- Global
- Controller
- Route
</div>

On compare souvent les Interceptors avec les Middlewares. Leurs différences sont nombreuses mais en voici quelques unes :

- Un Interceptor est appelé à la fois lors de la **requête**, mais aussi lors de la **réponse**.
- Comme le Guard, l'Interceptor a accès au **contexte d'exécution** (qui contient la requête), contrairement au Middleware qui a accès à la requête, mais pas au contexte d'exécution.
- Comme vous le savez maintenant, l'Interceptor est appelé **après** le Guard. Le Middleware est lui appelé **avant**.

Souvent, les Interceptors sont utilisés pour *serializer* les réponses renvoyées par le Controller, par exemple :

```javascript
class UserSerializerInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((user) =>
        plainToInstance(UserDto, user),
      ),
    );
  }
}
```

L'Interceptor doit implémenter la fonction `intercept()` qui prend 2 arguments, représentant respectivement :

- Un **ExecutionContext**, contenant notamment la requête.
- un **CallHandler**, qui donne accès à la réponse.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Comment ça marche ?</p>
L'interface `CallHandler` implémente la méthode `handle()`, qui retourne un Observable. C'est ainsi que l'Interceptor reste à l'écoute de la réponse. Réponse que vous pouvez ensuite manipuler comme n'importe quel Observable classique. Ici on utilise la fonction `plainToInstance()` de la librairie *class-transformer*, qui serialize un objet Javascript selon une classe donnée; ici un hypothétique UserDto.
</div>

## Les Pipes

<div  class="admonition info"  markdown="1"><p  class="admonition-title">Niveaux de déclaration possibles</p>
- Global
- Controller
- Route
- Paramètre de route
</div>

Les Pipes ont 2 cas d'usage : La **validation** des données, et la **transformation**.

Voici un exemple tiré cette fois de la [documentation de NestJS](https://docs.nestjs.com/pipes) :

```javascript
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    
    return val;
  }
}
```

Ici on récupère une chaîne de caractère que nous tentons de **transformer** en nombre. Si la chaîne de caractère contient autre chose que des chiffres, on fait échouer la **validation**.

Voilà l'utilisation de ce Pipe, associé à un paramètre d'une route :

```javascript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Cat {
  return this.catsService.findOne(id);
}
```

## Le Controller

Et nous voilà au coeur du traitement de notre requête. Nous ne perdrons pas de temps ici à expliquer tout ce qu'est capable de faire un Controller en NestJS car ce n'est pas l'objet de cet article.

Mais voilà un exemple d'un Controller appelé dans la lignée de nos exemples précédents :

```javascript
@Get('admin/some-secret-route')
@UseGuards(AdminRoleGuard)
async findOne(): User {
  return this.adminService.somePrivateData();
}
```

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>
Avec l'annotation `@UseGuards()`, on utilise également un Guard (celui que nous avons écrit plus haut) au niveau de la route. Ainsi, nous sommes sûrs que l'utilisateur qui appelle cette route est bien un administrateur.
</div>

Nous n'irons pas plus loin dans le traitement de la **requête**, sachez juste qu'habituellement un Controller appelle un service, à l'intérieur duquel se trouve la logique métier, et les appels éventuels aux Repositories, où résident la connexion à la base de données.

> Votre mantra : Quoiqu'il arrive, votre Controller doit récupérer une requête, et retourner une réponse.

## Les Exception filters

<div  class="admonition info"  markdown="1"><p  class="admonition-title">Niveaux de déclaration possibles</p>
- Global
- Controller
- Route
</div>


Les Exception Filter permettent de `catch` les exceptions que vous déclenchez dans votre code, pour les transformer en messages d'erreur lisibles dans la réponse du serveur.
NestJS fournit par défaut un Exception Filter **global** qui récupère toutes les Exceptions de type `HttpException`. 

C'est-à-dire que vous pouvez par exemple faire ceci dans un Controller :

```javascript
@Get('some-admin-route')
async adminRoute(): any {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

Et par défaut, NestJS génèrera une réponse JSON reprenant le code d'erreur `403` d'une exception Forbidden.

La plupart du temps vous n'avez donc par à créer d'Exception Filter custom, vu qu'il est une bonne pratique de renvoyer des erreurs HTTP pour des applications REST ou encore GraphQL; et donc Nest s'en occupera pour vous.

Mais voici tout de même un court exemple de ce à quoi ressemble la définition d'un Exception Filter :

```javascript
@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // handle exception
  }
}
```

L'annotation `@Catch()` permet de spécifier quelle exception vous souhaitez "écouter".

Le deuxième argument de la fonction `catch()` est un objet de type `ArgumentHost`. Cet objet contient tout le contexte d'exécution; vous pouvez y retrouver notamment la **requête** et la **réponse**. C'est surtout cette dernière qui vous intéresse, pour par exemple y ajouter un message relatif à l'exception récupérée.

## Conclusion

Vous savez à présent à peu près tout sur le cycle de vie d'une requête en NestJS. Le but était surtout de donner une meilleure vue d'ensemble de ces différentes étapes, de leur **ordre** d'exécution, et de leur utilité. Mais si vous voulez en savoir plus sur **comment** les implémenter, à différents niveaux (module, controller, route...), n'hésitez pas à vous référez à la [documentation officielle de NestJS](https://docs.nestjs.com).

À très bientôt 👋
