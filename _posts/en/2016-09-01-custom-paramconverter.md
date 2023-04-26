---
lang: en
date: '2016-09-01'
slug: custom-paramconverter
title: Custom ParamConverter
excerpt: >-
  The following article is aimed at developers who have already used the
  ParamConverter, and who understand its basic principles.
authors:
  - tthuon
categories: []
keywords: []
---

Introduction
============

The following article is aimed at developers who have already used the ParamConverter, and who understand its basic principles.

It was written in order to explain how to solve the following issue: I needed to pass a token into a custom header, and to be able to get it back in the controllers. The goal was to avoid repeating the acquisition of the header in each one of the controllers.

The basics
==========

The ParamConverter is a magic tool. From a controller, you just need to type-hint the argument to obtain an instance of a class based on the id in the url.

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

In my example, Symfony has recognised the *post* token in the route. In the method signature, the *$post* variable is type hinted by the *Post* class. Through ParamConverter, Symfony will try to create an instance of the *Post* class and to assign it to the *$post* variable.

I would refer you to the documentation for the basic usage of the ParamConverter: <http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html>

But what if the value I am looking for is not found in the url, for example in a header?

A token in a header
===================

Let’s take another example:

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

The value of the token must pass through an *x-token* header. I will then create a ParamConverter in order to fetch the token from the header and not from the url.

Creation of the Paramconverter
==============================

All ParamConverters must implement the `Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface`.

There are the apply(Request $request, ConfigurationInterface $configuration); and supports(ConfigurationInterface $configuration); methods.

-   *supports* verifies that the ParamConveter can be applied with the data provided in *$configuration*. It will result in *true* if all is good, otherwise it will be *false*. In this case, the ParamConverter moves to another converter. It is possible to sort ParamConverters by priority.
-   *apply *will apply a business rule. In our case, we will need to search for the token in the request and replace the value in the request’s *attributes*.

Structure example:

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

I begin with the *supports* method*. *Here, I don’t have any reference class. I will then work on the name of the variable.

```php
public function supports(ConfigurationInterface $configuration)
{
    return $configuration->getName() === "token";
}
```

The method must return *true* or *false*.

Then, I work on the *apply* method . It’s here that I’ll fetch the token’s value. Since I have access to the current request, I can proceed as follow:

```php
public function apply(Request $request, ConfigurationInterface $configuration)
{
    $request->attributes->set($configuration->getName(), $request->headers->get('x-token'));

    return true;
}
```

During the building of the controller, Symfony will fetch all the values of the controller’s arguments in the *attributes *variable of the request. This is why I assign the token’s value in the *attributes *variable through the *ParameterBag* method.

My custom *ParamConverter* is complete. I can now use it.

Service statement
=================

A *compiler pass* will read the services with the "request.param\_converter" tag. We can define a priority and a name. If there’s a priority, they will be sorted in this order.

```xhtml
<service id="token_converter" class="AppBundle\Request\ParamConverter\CrmTokenConverter">
    <tag name="request.param_converter" converter="token" />
</service>
```

Use in the controller
=====================

In order to use it in my controller, I add the *ParamConverter *annotation to my controller with the *name *option and the converter name given in the service.

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

When I carry out my request and I use a value for the "x-token" header, my "$token" variable will then have the value of the header.

So this is how to simplify the controller and isolate a functionality in a unitary class.

References:

-   <http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#creating-a-converter>
-   <http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Controller/ControllerResolver.html>
-   <http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/Request.html>
-   <http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/ParameterBag.html>
