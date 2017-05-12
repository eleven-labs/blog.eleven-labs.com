---
layout: post
title: Symfony2 et les Bundles utiles
author: marie
date: '2014-01-05 00:00:58 +0100'
date_gmt: '2014-01-04 23:00:58 +0100'
categories:
- Symfony
tags:
- php
- symfony2
- bundle
---
{% raw %}
Cela fait maintenant plus de 2 ans que Symfony2 est sorti et, comme vous le savez, il fonctionne avec des bundles. Voici une liste non-exhaustive de bundles sympathiques qui s'avèrent très utiles au quotidien.

<!--more-->

<strong>JMSSerializerBundle</strong> utilise la librairie Serializer du même auteur, et vous permet de sérialiser vos données dans un format de sortie demandé, tel que JSON, XML ou YAML, et inversement. En twig cela donne ça :

<pre class="lang:default decode:true">{{ data | serialize }} {# serializes to JSON #}
{{ data | serialize('json') }}
{{ data | serialize('xml') }}</pre>
Les possibilités sont illimitées, plus d'informations <a href="http://jmsyst.com/bundles/JMSSerializerBundle" target="_blank">ici</a>.

Vous devez développer une API REST ? Utilisez <strong>FOSRESTBundle</strong> ! Il vous aide à respecter les conventions RESTful, fournit un controller et un système de routing adaptés au REST, et est très simple à utiliser. FOSRESTBundle va de paire avec JMSSerializerBundle ci-dessus. Avec le serializer vous pouvez paramétrer la politique d'exclusion et exposer uniquement certains attributs de vos entités en utilisant les annotations, le format xml ou yml, ou encore définir le format de sortie pour les dates.

<pre class="lang:default decode:true crayon-selected">&lt;?php

namespace Demo\Bundle\ApiBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use JMS\Serializer\SerializationContext;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends FOSRestController
{
    public function getAction($id)
    {
        $context = new SerializationContext();
        $context-&gt;setSerializeNull(true);

        // retreive the entity
        $entity = $this-&gt;getDoctrine()-&gt;getManager()-&gt;find('MyBundle:Entity', $id);
        $view = $this-&gt;view($entity, 200)-&gt;setSerializationContext($context);

        return $this-&gt;handleView($view);
    }</pre>
Le détail est sur <a href="https://github.com/FriendsOfSymfony/FOSRestBundle" target="_blank">la page github du projet</a>.

Vous appelez des web services REST ? <a href="https://github.com/guzzle/guzzle"><strong>Guzzle</strong></a> et <a href="https://github.com/kriswallsmith/Buzz"><strong>Buzz</strong></a> sont deux librairies PHP basées sur cURL, qui permettent de faire des requêtes HTTP. Ils ont chacun leur bundle respectif, ils sont rapides à prendre en main, même si Guzzle est plus intuitif. Rien de plus simple qu'un appel de web service :

<pre class="lang:default decode:true">// use Guzzle\Http\Client;
$client = new Client($googleMapsApiUrl);
$request = $client-&gt;get($address);
$response = $request-&gt;send()-&gt;json();</pre>
Si votre application permet la gestion des utilisateurs, <strong>FOSUserBundle </strong>le fait pour vous . Il est compatible avec Doctrine, Propel et MongoDB. Et si vous avez un backoffice d'administration, utilisez un de ces 2 bundles pour vous simplifier la vie : <strong> SonataAdminBundle</strong> ou<strong> AdminGeneratorBundle.  </strong>Ils supportent aussi tous les deux Doctrine, MongoDB et Propel. Je ne vous en parle pas plus car il y a beaucoup d'informations sur ces bundles bien connus sur internet.

Dans un projet on a aussi souvent du JavaScript et de l'AJAX. Et quand on a besoin de faire un appel AJAX, <strong>FOSJsRoutingBundle</strong> nous vient en aide. Il permet d'accéder au routing du projet dans le code JavaScript. Il suffit d'indiquer que vous souhaitez exposer la route comme ceci :

<pre class="lang:default decode:true"># routing.yml
getCoordinates:
    pattern: /getCoordinates/{address}
    defaults: { _controller: "MyBundle:Address:getCoordinates"}
    options:
        expose: true</pre>
Et de l'appeler dans un code JavaScript :

<pre class="lang:default decode:true">var input = $('#address').val();
$.ajax({
    url: Routing.generate('getCoordinates', { 'address': input }),
    data: { address: input },
    type: 'post',
    dataType: 'json',
    success: function( result ) {
        // do something
    }
});</pre>
N'oubliez pas d'inclure les fichiers JS du bundle dans votre layout :

<pre class="lang:default decode:true">&lt;script src="{{ asset('bundles/fosjsrouting/js/router.js') }}"&gt;&lt;/script&gt;
&lt;script src="{{ path('fos_js_routing_js', {"callback": "fos.Router.setData"}) }}"&gt;&lt;/script&gt;</pre>
Plus d'informations sur le <a href="https://github.com/FriendsOfSymfony/FOSJsRoutingBundle/blob/master/Resources/doc/README.markdown">site du projet</a>.

En ce qui concerne la navigation sur votre site, prenez <strong>KNPMenuBundle</strong>. Vous définissez notre navigation dans une classe :

<pre class="lang:default decode:true">&lt;?php
// src/MyBundle/Menu/Builder.php
namespace Demo\MyBundle\Menu;

use Knp\Menu\FactoryInterface;
use Symfony\Component\DependencyInjection\ContainerAware;

class Builder extends ContainerAware
{
    public function mainMenu(FactoryInterface $factory, array $options)
    {
        $menu = $factory-&gt;createItem('root');

        $menu-&gt;addChild('Home', array('route' =&gt; 'homepage'));
        $menu-&gt;addChild('Articles', array('route' =&gt; 'posts'))

        return $menu;
    }
}</pre>
Et vous l'appelez dans votre layout :

<pre class="lang:default decode:true">{{ knp_menu_render('DemoMyBundle:Builder:mainMenu') }}</pre>
Faites un tour <a href="https://github.com/KnpLabs/KnpMenuBundle/blob/master/Resources/doc/index.md#first-menu">ici</a> pour lire toutes les informations.

Maintenant que l'on peut accéder à la liste d'articles via le menu, on voudrait améliorer l'affichage et ajouter une pagination. Pour cela existe <strong>KNPPaginatorBundle</strong>. Il gère la pagination et le tri des résultats pour les requêtes Doctrine, MongoDB et Propel. Dans votre action, vous créez une requête et la passez au service paginator :

<pre class="lang:default decode:true">public function listAction()
{
    $em    = $this-&gt;get('doctrine.orm.entity_manager');
    $dql   = "SELECT a FROM DemoMyBundle:Article a";
    $query = $em-&gt;createQuery($dql);

    $paginator  = $this-&gt;get('knp_paginator');
    $pagination = $paginator-&gt;paginate(
        $query,
        $this-&gt;get('request')-&gt;query-&gt;get('page', 1), // default page number,
        10 // limit per page
    );

    // parameters to template
    return $this-&gt;render('DemoMyBundle:Article:list.html.twig', array('pagination' =&gt; $pagination));
}</pre>
Et dans le template twig :

<pre class="lang:default decode:true">{# total items count #}
&lt;div class="count"&gt;
    {{ pagination.getTotalItemCount }}
&lt;/div&gt;
&lt;table&gt;
&lt;tr&gt;
{# sorting of properties based on query components #}
    &lt;th&gt;Id&lt;/th&gt;
    &lt;th&gt;{{ knp_pagination_sortable(pagination, 'Title', 'a.title') }}&lt;/th&gt;
&lt;/tr&gt;

{# table body #}
{% for article in pagination %}
&lt;tr&gt;
    &lt;td&gt;{{ article.id }}&lt;/td&gt;
    &lt;td&gt;{{ article.title }}&lt;/td&gt;
&lt;/tr&gt;
{% endfor %}
&lt;/table&gt;
{# display navigation #}
&lt;div class="navigation"&gt;
    {{ knp_pagination_render(pagination) }}
&lt;/div&gt;</pre>
Visitez la <a href="https://github.com/KnpLabs/KnpPaginatorBundle">page du bundle</a> pour de plus amples informations.

Admettons que vous voulez facturez vos clients. Le meilleur outil pour cela est <strong>JMSPayment</strong>. JMSPaymentCoreBundle vous fournit une API unifiée simple qui gère les différents modes de paiement. Vous n'avez plus à vous soucier des protocoles divers. JMSPaymentPaypalBundle est une couche qui implémente PayPal.

La documentation complète est ici : <a href="http://jmsyst.com/bundles/JMSPaymentCoreBundle" target="_blank">JMSPaymentCore</a> et <a href="http://jmsyst.com/bundles/JMSPaymentPaypalBundle" target="_blank">JMSPaypal</a>

On voudrait pouvoir générer la facture au format PDF pour le client pour confirmer son paiement. Pour cela, il y a <strong>KNPSnappyBundle</strong>. Il est basé sur <a href="http://code.google.com/p/wkhtmltopdf/">wkhtmltopdf</a> qui génère un PDF à partir d'un fichier HTML comme son nom l'indique. On définit notre HTML dans un template twig par exemple. Et le controller n'a besoin que de très peu de code :

<pre class="lang:default decode:true">public function getPDFAction()
{
    $html = $this-&gt;renderView('DemoMyBundle:Default:pdf.html.twig');

    return new Response(
        $this-&gt;get('knp_snappy.pdf')-&gt;getOutputFromHtml($html, array('footer-center' =&gt; 'Page [page]/[topage]')),
        200,
        array(
            'Content-Type'          =&gt; 'application/pdf',
            'Content-Disposition'   =&gt; 'attachment; filename="file.pdf"'
        )
    );
}</pre>
Toutes les options de wkhtmltopdf sont disponibles. Cliquez <a href="https://github.com/KnpLabs/KnpSnappyBundle">ici</a> pour voir le bundle sur Github.

Et vous, quels sont les bundles que vous utilisez ?

{% endraw %}
