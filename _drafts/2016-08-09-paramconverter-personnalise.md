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
{% raw %}
## Introduction
<p>L'article qui suit s'adresse aux développeurs qui ont déjà utilisé le ParamConverter, et qui comprennent le principe de base de son fonctionnement.</p>
<p>Je l'ai rédigé pour expliquer comment résoudre la problématique suivante : mon besoin était de faire passer un token dans un header personnalisé, et de pouvoir le récupérer dans les contrôleurs. Le but était d'éviter de répéter l'acquisition de ce header dans chacun des contrôleurs.</p>
## Fonctionnement de base
<p>Le ParamConverter est un outil magique. Depuis un contrôleur, il suffit de typehinter l'argument pour obtenir une instance d'une classe en fonction de l'id dans l'url.</p>
<pre class="lang:php decode:true">&lt;?php

/**
 * @Route("/post/{post}")
 */
public function getAction(Post $post)
{
    return new Response($post-&gt;getTitle());
}</pre>
<p>Dans mon exemple, Symfony a reconnu le token <em>post</em> dans la route. Dans la signature de la méthode, l'argument <em>$post</em> est typehinté par la classe <em>Post</em>. Symfony, à l'aide du ParamConverter, va tenter de créer une instance de la classe <em>Post</em> et l'affecter à la variable <em>$post</em>.</p>
<p>Je vous renvoie à la documentation pour le fonctionnement de base du ParamConverter : <a href="http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html">http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html</a></p>
<p>Mais si la valeur que je cherche ne se trouve pas dans l'url, par exemple dans un header, comment faire ?</p>
## Un token dans un header
<p>Prenons un autre exemple:</p>
<pre class="lang:php decode:true">&lt;?php

/**
 * @Route("/token")
 */
public function isTokenValidAction($token)
{
    return $this-&gt;get('app.service')-&gt;isValid($token);
}</pre>
<p>La valeur de mon token doit passer par un header <em>x-token</em>. Je vais donc créer un ParamConverter pour aller chercher le token dans le header et non dans l'url.</p>
## Création du ParamConverter
<p>Tous les ParamConverter doivent implémenter l'interface <span class="lang:php decode:true crayon-inline">Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface</span> .</p>
<p>Il y a les méthodes <span class="lang:php decode:true crayon-inline ">apply(Request $request, ConfigurationInterface $configuration);</span>  et <span class="lang:php decode:true crayon-inline ">supports(ConfigurationInterface $configuration);</span> .</p>
<ul>
<li><em>supports</em> vérifie que le ParamConveter peut s'appliquer avec les données fournies dans <em>$configuration</em>. Il renvoie <em>true</em> si tout est bon, sinon <em>false</em>. Le ParamConverter passe à un autre converter dans ce cas. Il est possible de trier les ParamConverter par priorité.</li>
<li><em>apply </em>va appliquer une règle métier. Dans notre cas, il faudra aller chercher le token dans la requête et replacer la valeur dans l'<em>attributes</em> de la requête.</li>
</ul>
<p>Exemple de structure :</p>
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
<p>Je commence par la méthode <em>supports. </em>Ici, je n'ai pas de classe de référence. Je vais me baser sur le nom de la variable.</p>
<pre class="lang:php decode:true ">public function supports(ConfigurationInterface $configuration)
{
    return $configuration-&gt;getName() === "token";
}</pre>
<p>La méthode doit renvoyer <em>true</em> ou <em>false</em>.</p>
<p>Ensuite, je remplis la méthode <em>apply</em>. C'est ici que je vais chercher la valeur de mon token. Comme j'ai accès à la requête courante, je peux faire comme ceci:</p>
<pre class="lang:php decode:true">public function apply(Request $request, ConfigurationInterface $configuration)
{
    $request-&gt;attributes-&gt;set($configuration-&gt;getName(), $request-&gt;headers-&gt;get('x-token'));

    return true;
}</pre>
<p>Lors de la construction du contrôleur, Symfony va chercher toutes les valeurs des arguments du contrôleur dans la variable <em>attributes </em>de la requête. C'est pourquoi, j'affecte la valeur de mon token dans la variable <em>attributes </em>grâce au méthode du <em>ParameterBag</em>.</p>
<p>Mon <em>ParamConverter</em> personnalisé est terminé. Je vais maintenant l'utiliser.</p>
## Déclaration du service
<p>Un <em>compiler pass</em> va lire les services avec le tag "request.param_converter". Je peux définir une priorité et un nom. S'il y a une priorité, ils seront triés dans cet ordre.</p>
<pre class="lang:xhtml decode:true ">&lt;service id="token_converter" class="AppBundle\Request\ParamConverter\CrmTokenConverter"&gt;
    &lt;tag name="request.param_converter" converter="token" /&gt;
&lt;/service&gt;</pre>
## Utilisation dans le contrôleur
<p>Pour l'utiliser dans mon contrôleur, j'ajoute l'annotation <em>ParamConverter </em>à mon contrôleur avec les options <em>name </em>et le nom de converter renseigné dans le service.</p>
<pre class="lang:php decode:true">&lt;?php

/**
 * @Route("/token")
 * @ParamConverter(name="token", converter="token")
 */
public function isTokenValidAction($token)
{
    return $this-&gt;get('app.service')-&gt;isValid($token);
}</pre>
<p>Lorsque je fais ma requête et que je mets une valeur pour le header "x-token", ma variable "$token" aura la valeur du header.</p>
<p>Voilà comment simplifier le contrôleur et isoler une fonctionnalité dans une classe unitaire.</p>
<p>&nbsp;</p>
<p>Référence:</p>
<ul>
<li><a href="http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#creating-a-converter">http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html#creating-a-converter</a></li>
<li><a href="http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Controller/ControllerResolver.html">http://api.symfony.com/3.1/Symfony/Component/HttpKernel/Controller/ControllerResolver.html</a></li>
<li><a href="http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/Request.html">http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/Request.html</a></li>
<li><a href="http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/ParameterBag.html">http://api.symfony.com/2.8/Symfony/Component/HttpFoundation/ParameterBag.html</a></li>
</ul>
{% endraw %}
