---
layout: post
title: ParamConverter personnalisé
author: tthuon
date: '2016-08-09 11:25:46 +0200'
date_gmt: '2016-08-09 09:25:46 +0200'
categories:
- Symfony
- Php
tags:
- php
- symfony
- paramconverter
---

Introduction
------------

L'article qui suit s'adresse aux développeurs qui ont déjà utilisé le ParamConverter, et qui comprennent le principe de base de son fonctionnement.

Je l'ai rédigé pour expliquer comment résoudre la problématique suivante : mon besoin était de faire passer un token dans un header personnalisé, et de pouvoir le récupérer dans les contrôleurs. Le but était d'éviter de répéter l'acquisition de ce header dans chacun des contrôleurs.

Fonctionnement de base
----------------------

Le ParamConverter est un outil magique. Depuis un contrôleur, il suffit de typehinter l'argument pour obtenir une instance d'une classe en fonction de l'id dans l'url.

```php
<?php

/**
 * @Route("/post/{post}")
 */
public function getAction(Post $post)
{
    return new Response($post->getTitle());
}
```

Dans mon exemple, Symfony a reconnu le token *post* dans la route. Dans la signature de la méthode, l'argument *$post* est typehinté par la classe *Post*. Symfony, à l'aide du ParamConverter, va tenter de créer une instance de la classe *Post* et l'affecter à la variable *$post*.

Je vous renvoie à la documentation pour le fonctionnement de base du ParamConverter : <http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html>

Mais si la valeur que je cherche ne se trouve pas dans l'url, par exemple dans un header, comment faire ?

Un token dans un header
-----------------------

Prenons un autre exemple:

```php
<?php

/**
 * @Route("/token")
 */
public function isTokenValidAction($token)
{
    return $this->get('app.service')->isValid($token);
}
```

La valeur de mon token doit passer par un header *x-token*. Je vais donc créer un ParamConverter pour aller chercher le token dans le header et non dans l'url.

Création du ParamConverter
--------------------------

Tous les ParamConverter doivent implémenter l'interface Sensio\\Bundle\\FrameworkExtraBundle\\Request\\ParamConverter\\ParamConverterInterface .

Il y a les méthodes apply(Request $request, ConfigurationInterface $configuration);  et supports(ConfigurationInterface $configuration); .

-   *supports* vérifie que le ParamConveter peut s'appliquer avec les données fournies dans *$configuration*. Il renvoie *true* si tout est bon, sinon *false*. Le ParamConverter passe à un autre converter dans ce cas. Il est possible de trier les ParamConverter par priorité.
-   *apply* va appliquer une règle métier. Dans notre cas, il faudra aller chercher le token dans la requête et replacer la valeur dans l'*attributes* de la requête.

Exemple de structure :

```php
<?php

namespace AppBundle\Request\ParamConverter;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ConfigurationInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;

class TokenConverter implements ParamConverterInterface
{
    /**
     * {@inheritdoc}
     */
    public function apply(Request $request, ConfigurationInterface $configuration)
    {

    }

    /**
     * {@inheritdoc}
     */
    public function supports(ConfigurationInterface $configuration)
    {

    }
}
```

Je commence par la méthode *supports.* Ici, je n'ai pas de classe de référence. Je vais me baser sur le nom de la variable.

```php
public function supports(ConfigurationInterface $configuration)
{
    return $configuration->getName() === "token";
}
```

La méthode doit renvoyer *true* ou *false*.

Ensuite, je remplis la méthode *apply*. C'est ici que je vais chercher la valeur de mon token. Comme j'ai accès à la requête courante, je peux faire comme ceci:

```php
public function apply(Request $request, ConfigurationInterface $configuration)
{
    $request->attributes->set($configuration->getName(), $request->headers->get('x-token'));

    return true;
}
```

Lors de la construction du contrôleur, Symfony va chercher toutes les valeurs des arguments du contrôleur dans la variable *attributes* de la requête. C'est pourquoi, j'affecte la valeur de mon token dans la variable *attributes* grâce au méthode du *ParameterBag*.

Mon *ParamConverter* personnalisé est terminé. Je vais maintenant l'utiliser.

Déclaration du service
----------------------

Un *compiler pass* va lire les services avec le tag "request.param\_converter". Je peux définir une priorité et un nom. S'il y a une priorité, ils seront triés dans cet ordre.

```xhtml
<service id="token_converter" class="AppBundle\Request\ParamConverter\CrmTokenConverter">
    <tag name="request.param_converter" converter="token" />
</service>
```

Utilisation dans le contrôleur
------------------------------

Pour l'utiliser dans mon contrôleur, j'ajoute l'annotation *ParamConverter* à mon contrôleur avec les options *name* et le nom de converter renseigné dans le service.

```php
<?php

/**
 * @Route("/token")
 * @ParamConverter(name="token", converter="token")
 */
public function isTokenValidAction($token)
{
    return $this->get('app.service')->isValid($token);
}
```

Lorsque je fais ma requête et que je mets une valeur pour le header "x-token", ma variable "$token" aura la valeur du header.

Voilà comment simplifier le contrôleur et isoler une fonctionnalité dans une classe unitaire.

 

Référence:

-   <http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#creating-a-converter>
-   <http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Controller/ControllerResolver.html>
-   <http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/Request.html>
-   <http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/ParameterBag.html>

