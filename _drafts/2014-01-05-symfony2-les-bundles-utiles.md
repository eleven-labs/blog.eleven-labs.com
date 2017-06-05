--- layout: post title: Symfony2 et les Bundles utiles author: marie
date: '2014-01-05 00:00:58 +0100' date\_gmt: '2014-01-04 23:00:58 +0100'
categories: - Symfony tags: - php - symfony2 - bundle --- {% raw %}

Cela fait maintenant plus de 2 ans que Symfony2 est sorti et, comme vous
le savez, il fonctionne avec des bundles. Voici une liste non-exhaustive
de bundles sympathiques qui s'avèrent très utiles au quotidien.

**JMSSerializerBundle** utilise la librairie Serializer du même auteur,
et vous permet de sérialiser vos données dans un format de sortie
demandé, tel que JSON, XML ou YAML, et inversement. En twig cela donne
ça :

``` {.lang:default .decode:true}
{{ data | serialize }} {# serializes to JSON #}
{{ data | serialize('json') }}
{{ data | serialize('xml') }}
```

Les possibilités sont illimitées, plus d'informations
[ici](http://jmsyst.com/bundles/JMSSerializerBundle).

Vous devez développer une API REST ? Utilisez **FOSRESTBundle** ! Il
vous aide à respecter les conventions RESTful, fournit un controller et
un système de routing adaptés au REST, et est très simple à utiliser.
FOSRESTBundle va de paire avec JMSSerializerBundle ci-dessus. Avec le
serializer vous pouvez paramétrer la politique d'exclusion et exposer
uniquement certains attributs de vos entités en utilisant les
annotations, le format xml ou yml, ou encore définir le format de sortie
pour les dates.

``` {.lang:default .decode:true .crayon-selected}
<?php

namespace Demo\Bundle\ApiBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use JMS\Serializer\SerializationContext;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends FOSRestController
{
    public function getAction($id)
    {
        $context = new SerializationContext();
        $context->setSerializeNull(true);

        // retreive the entity
        $entity = $this->getDoctrine()->getManager()->find('MyBundle:Entity', $id);
        $view = $this->view($entity, 200)->setSerializationContext($context);

        return $this->handleView($view);
    }
```

Le détail est sur [la page github du
projet](https://github.com/FriendsOfSymfony/FOSRestBundle).

Vous appelez des web services REST ?
[**Guzzle**](https://github.com/guzzle/guzzle) et
[**Buzz**](https://github.com/kriswallsmith/Buzz) sont deux librairies
PHP basées sur cURL, qui permettent de faire des requêtes HTTP. Ils ont
chacun leur bundle respectif, ils sont rapides à prendre en main, même
si Guzzle est plus intuitif. Rien de plus simple qu'un appel de web
service :

``` {.lang:default .decode:true}
// use Guzzle\Http\Client;
$client = new Client($googleMapsApiUrl);
$request = $client->get($address);
$response = $request->send()->json();
```

Si votre application permet la gestion des utilisateurs,
**FOSUserBundle **le fait pour vous . Il est compatible avec Doctrine,
Propel et MongoDB. Et si vous avez un backoffice d'administration,
utilisez un de ces 2 bundles pour vous simplifier la vie :
**SonataAdminBundle** ou **AdminGeneratorBundle. ** Ils supportent aussi
tous les deux Doctrine, MongoDB et Propel. Je ne vous en parle pas plus
car il y a beaucoup d'informations sur ces bundles bien connus sur
internet.

Dans un projet on a aussi souvent du JavaScript et de l'AJAX. Et quand
on a besoin de faire un appel AJAX, **FOSJsRoutingBundle** nous vient en
aide. Il permet d'accéder au routing du projet dans le code JavaScript.
Il suffit d'indiquer que vous souhaitez exposer la route comme ceci :

``` {.lang:default .decode:true}
# routing.yml
getCoordinates:
    pattern: /getCoordinates/{address}
    defaults: { _controller: "MyBundle:Address:getCoordinates"}
    options:
        expose: true
```

Et de l'appeler dans un code JavaScript :

``` {.lang:default .decode:true}
var input = $('#address').val();
$.ajax({
    url: Routing.generate('getCoordinates', { 'address': input }),
    data: { address: input },
    type: 'post',
    dataType: 'json',
    success: function( result ) {
        // do something
    }
});
```

N'oubliez pas d'inclure les fichiers JS du bundle dans votre layout :

``` {.lang:default .decode:true}
<script src="{{ asset('bundles/fosjsrouting/js/router.js') }}"></script>
<script src="{{ path('fos_js_routing_js', {"callback": "fos.Router.setData"}) }}"></script>
```

Plus d'informations sur le [site du
projet](https://github.com/FriendsOfSymfony/FOSJsRoutingBundle/blob/master/Resources/doc/README.markdown).

En ce qui concerne la navigation sur votre site, prenez
**KNPMenuBundle**. Vous définissez notre navigation dans une classe :

``` {.lang:default .decode:true}
<?php
// src/MyBundle/Menu/Builder.php
namespace Demo\MyBundle\Menu;

use Knp\Menu\FactoryInterface;
use Symfony\Component\DependencyInjection\ContainerAware;

class Builder extends ContainerAware
{
    public function mainMenu(FactoryInterface $factory, array $options)
    {
        $menu = $factory->createItem('root');

        $menu->addChild('Home', array('route' => 'homepage'));
        $menu->addChild('Articles', array('route' => 'posts'))

        return $menu;
    }
}
```

Et vous l'appelez dans votre layout :

``` {.lang:default .decode:true}
{{ knp_menu_render('DemoMyBundle:Builder:mainMenu') }}
```

Faites un tour
[ici](https://github.com/KnpLabs/KnpMenuBundle/blob/master/Resources/doc/index.md#first-menu)
pour lire toutes les informations.

Maintenant que l'on peut accéder à la liste d'articles via le menu, on
voudrait améliorer l'affichage et ajouter une pagination. Pour cela
existe **KNPPaginatorBundle**. Il gère la pagination et le tri des
résultats pour les requêtes Doctrine, MongoDB et Propel. Dans votre
action, vous créez une requête et la passez au service paginator :

``` {.lang:default .decode:true}
public function listAction()
{
    $em    = $this->get('doctrine.orm.entity_manager');
    $dql   = "SELECT a FROM DemoMyBundle:Article a";
    $query = $em->createQuery($dql);

    $paginator  = $this->get('knp_paginator');
    $pagination = $paginator->paginate(
        $query,
        $this->get('request')->query->get('page', 1), // default page number,
        10 // limit per page
    );

    // parameters to template
    return $this->render('DemoMyBundle:Article:list.html.twig', array('pagination' => $pagination));
}
```

Et dans le template twig :

``` {.lang:default .decode:true}
{# total items count #}
<div class="count">
    {{ pagination.getTotalItemCount }}
</div>
<table>
<tr>
{# sorting of properties based on query components #}
    <th>Id</th>
    <th>{{ knp_pagination_sortable(pagination, 'Title', 'a.title') }}</th>
</tr>

{# table body #}
{% for article in pagination %}
<tr>
    <td>{{ article.id }}</td>
    <td>{{ article.title }}</td>
</tr>
{% endfor %}
</table>
{# display navigation #}
<div class="navigation">
    {{ knp_pagination_render(pagination) }}
</div>
```

Visitez la [page du
bundle](https://github.com/KnpLabs/KnpPaginatorBundle) pour de plus
amples informations.

Admettons que vous voulez facturez vos clients. Le meilleur outil pour
cela est **JMSPayment**. JMSPaymentCoreBundle vous fournit une API
unifiée simple qui gère les différents modes de paiement. Vous n'avez
plus à vous soucier des protocoles divers. JMSPaymentPaypalBundle est
une couche qui implémente PayPal.

La documentation complète est ici :
[JMSPaymentCore](http://jmsyst.com/bundles/JMSPaymentCoreBundle) et
[JMSPaypal](http://jmsyst.com/bundles/JMSPaymentPaypalBundle)

On voudrait pouvoir générer la facture au format PDF pour le client pour
confirmer son paiement. Pour cela, il y a **KNPSnappyBundle**. Il est
basé sur [wkhtmltopdf](http://code.google.com/p/wkhtmltopdf/) qui génère
un PDF à partir d'un fichier HTML comme son nom l'indique. On définit
notre HTML dans un template twig par exemple. Et le controller n'a
besoin que de très peu de code :

``` {.lang:default .decode:true}
public function getPDFAction()
{
    $html = $this->renderView('DemoMyBundle:Default:pdf.html.twig');

    return new Response(
        $this->get('knp_snappy.pdf')->getOutputFromHtml($html, array('footer-center' => 'Page [page]/[topage]')),
        200,
        array(
            'Content-Type'          => 'application/pdf',
            'Content-Disposition'   => 'attachment; filename="file.pdf"'
        )
    );
}
```

Toutes les options de wkhtmltopdf sont disponibles. Cliquez
[ici](https://github.com/KnpLabs/KnpSnappyBundle) pour voir le bundle
sur Github.

Et vous, quels sont les bundles que vous utilisez ?

{% endraw %}
