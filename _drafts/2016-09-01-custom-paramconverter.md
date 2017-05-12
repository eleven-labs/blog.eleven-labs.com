---
layout: post
title: Custom ParamConverter
author: tthuon
date: '2016-09-01 11:05:05 +0200'
date_gmt: '2016-09-01 09:05:05 +0200'
categories:
- Non classé
tags: []
---
{% raw %}
## Introduction
The following article is aimed at developers who have already used the ParamConverter, and who understand its basic principles.

It was written in order to explain how to solve the following issue: I needed to pass a token into a custom header, and to be able to get it back in the controllers. The goal was to avoid repeating the acquisition of the header in each one of the controllers.

## The basics
The ParamConverter is a magic tool. From a controller, you just need to type-hint the argument to obtain an instance of a class based on the id in the url.

<pre class="lang:php decode:true">&lt;?php

/**
 * @Route("/post/{post}")
 */
public function getAction(Post $post)
{
    return new Response($post-&gt;getTitle());
}</pre>
In my example, Symfony has recognised the<em> post</em> token in the route. In the method signature, the <em>$post</em> variable is type hinted by the <em>Post </em>class. Through ParamConverter, Symfony will try to create an instance of the <em>Post</em> class and to assign it to the <em>$post</em> variable.

I would refer you to the documentation for the basic usage of the ParamConverter: <a href="http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html">http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html</a>

But what if the value I am looking for is not found in the url, for example in a header?

## A token in a header
Let’s take another example:

<pre class="lang:php decode:true">&lt;?php

/**
 * @Route("/token")
 */
public function isTokenValidAction($token)
{
    return $this-&gt;get('app.service')-&gt;isValid($token);
}</pre>
The value of the token must pass through an <em>x-token</em> header. I will then create a ParamConverter in order to fetch the token from the header and not from the url.

## Creation of the Paramconverter
All ParamConverters must implement the <span class="lang:php decode:true crayon-inline">Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface</span>.

There are the <span class="lang:php decode:true crayon-inline ">apply(Request $request, ConfigurationInterface $configuration);</span> and <span class="lang:php decode:true crayon-inline ">supports(ConfigurationInterface $configuration);</span> methods.

<ul>
<li><em>supports</em> verifies that the ParamConveter can be applied with the data provided in <em>$configuration</em>. It will result in <em>true</em> if all is good, otherwise it will be <em>false</em>. In this case, the ParamConverter moves to another converter. It is possible to sort ParamConverters by priority.</li>
<li><em>apply </em>will apply a business rule. In our case, we will need to search for the token in the request and replace the value in the request’s <em>attributes</em>.</li>
</ul>
Structure example:

<pre class="lang:php decode:true">&lt;?php

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
}</pre>
I begin with the <em>supports </em>method<em>. </em>Here, I don’t have any reference class. I will then work on the name of the variable.

<pre class="lang:php decode:true ">public function supports(ConfigurationInterface $configuration)
{
    return $configuration-&gt;getName() === "token";
}</pre>
The method must return <em>true</em> or <em>false</em>.

Then, I work on the <em>apply</em> method . It’s here that I’ll fetch the token’s value. Since I have access to the current request, I can proceed as follow:

<pre class="lang:php decode:true">public function apply(Request $request, ConfigurationInterface $configuration)
{
    $request-&gt;attributes-&gt;set($configuration-&gt;getName(), $request-&gt;headers-&gt;get('x-token'));

    return true;
}</pre>
During the building of the controller, Symfony will fetch all the values of the controller’s arguments in the <em>attributes </em>variable of the request. This is why I assign the token’s value in the <em>attributes </em>variable through the <em>ParameterBag </em>method.

My custom <em>ParamConverter</em> is complete. I can now use it.

## Service statement
A <em>compiler pass</em> will read the services with the "request.param_converter" tag. We can define a priority and a name. If there’s a priority, they will be sorted in this order.

<pre class="lang:xhtml decode:true ">&lt;service id="token_converter" class="AppBundle\Request\ParamConverter\CrmTokenConverter"&gt;
    &lt;tag name="request.param_converter" converter="token" /&gt;
&lt;/service&gt;</pre>
## Use in the controller
In order to use it in my controller, I add the <em>ParamConverter </em>annotation to my controller with the <em>name </em>option and the converter name given in the service.

<pre class="lang:php decode:true">&lt;?php

/**
 * @Route("/token")
 * @ParamConverter(name="token", converter="token")
 */
public function isTokenValidAction($token)
{
    return $this-&gt;get('app.service')-&gt;isValid($token);
}</pre>
When I carry out my request and I use a value for the "x-token" header, my "$token" variable will then have the value of the header.

So this is how to simplify the controller and isolate a functionality in a unitary class.

&nbsp;

References:

<ul>
<li><a href="http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#creating-a-converter">http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#creating-a-converter</a></li>
<li><a href="http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Controller/ControllerResolver.html">http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Controller/ControllerResolver.html</a></li>
<li><a href="http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/Request.html">http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/Request.html</a></li>
<li><a href="http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/ParameterBag.html">http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/ParameterBag.html</a></li>
</ul>
&nbsp;

{% endraw %}
