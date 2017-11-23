---
layout: post
title: Faut-il injecter le service container dans un service ?
excerpt: La documentation de Symfony2 explique très bien ce que c'est qu'un service et le conteneur de dépendances. Mais dans une application on a souvent besoin d'injecter plusieurs services ou paramètres. Vous vous êtes déjà dit que c'était plus simple d'injecter le container de service directement plutôt que d'injecter toutes les dépendances les unes après les autres ? Voici les "pour" et les "contre".
lang: fr
permalink: /fr/faut-il-injecter-le-service-container-dans-service/
authors:
 - marie
date: '2013-12-01 00:00:55 +0100'
date_gmt: '2013-11-30 23:00:55 +0100'
categories:
- Symfony
tags:
- php
- symfony2
---

La documentation de Symfony2 explique très bien ce que c'est qu'un [service et le conteneur de dépendances](http://symfony.com/fr/doc/current/book/service_container.html){:rel="nofollow noreferrer"}. Mais dans une application on a souvent besoin d'injecter plusieurs services ou paramètres. Vous vous êtes déjà dit que c'était plus simple d'injecter le container de service directement plutôt que d'injecter toutes les dépendances les unes après les autres ? Voici les "pour" et les "contre".

Pourquoi ne pas le faire ?
==========================

Tout d'abord, quand un service ressemble à ça,

```php
class MyService
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }
    // ....
}
```

... en lisant le constructeur *on ne sait pas quelles sont les dépendances* du service. On serait obligé d'aller lire toute la classe pour savoir de quoi elle a réellement besoin.

Deuxièmement, il faudra utiliser le conteneur de service dans les tests, ou avoir un mock du conteneur si on l'injecte. Par défaut, il ne contiendra pas de services, donc il faudra quand même mocker ceux utilisés par notre service. Il faudra donc lire toute la classe pour ne pas oublier des dépendances. Ce qui impose d'écrire du code (inutile) en plus, tout en rendant les *tests plus compliqués et longs* à écrire... et à maintenir.

Aussi, si on demande un service particulier au conteneur à plusieurs endroits, on n'est plus aussi découplé du reste du code que ce qu'on devrait. On est couplé avec le DIC au lieu de la classe directement, mais cela va toujours à l’encontre du principe d'injection de dépendances.

Dans quel cas injecter le conteneur de services ?
=================================================

Il existe quand même des cas où injecter le conteneur de services directement peut être utile : quand vous avez un service dans un scope (champ d'application) "container" qui a besoin d'un service du scope "request". Exemple, une extension Twig qui aurait besoin de Request pour récupérer une URL.

Les extensions Twig doivent être dans le scope "container" puisqu'elle dépendent de Twig qui est dans ce scope. Mais injecter Request directement demande que le scope soit réduit à "request". Pour résoudre ce problème, on va injecter le service container dans l'extension et vérifier si une request est disponible :

```php
class MyExtension extends \Twig_Extension
{
    private $container;
    private $request;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;

        if ($this->container->isScopeActive('request')) {
            $this->request = $this->container->get('request');
        }
    }
    // ...
}
```

Note : les extensions Twig ne bénéficient pas du lazy loading, et sont donc toujours chargées, même si vous lancez une commande. Puisqu’il n'y a pas de Request dans une commande, nous avons besoin de vérifier son existence avant d’essayer d'y accéder.

**EDIT** : Depuis symfony 2.4, un nouveau scope, "request\_stack", a été introduit (cf [l'article de Fabien Potencier](http://symfony.com/blog/new-in-symfony-2-4-the-request-stack)){:rel="nofollow noreferrer"}. Le problème décrit ci-dessus ne se pose donc plus.
