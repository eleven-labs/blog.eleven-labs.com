---
layout: post
lang: fr
date: '2018-01-29'
categories:
  - php
authors:
  - captainjojo
cover: /assets/2018-01-29-neo4j-et-symfony/cover.png
excerpt: >-
  L'architecture et les données que nous stockons sont de plus en plus
  complexes. Il faut savoir choisir la bonne technologie pour le bon use case.
  L'une des technologies qui peut vous être utile, c'est la base de données
  graphes Neo4j.
title: 'Neo4j et Symfony, comment utiliser une BDD graph ?'
slug: neo4j-et-symfony
oldCategoriesAndTags:
  - php
  - symfony
  - neo4j
permalink: /fr/neo4j-et-symfony/
---

L'architecture et les données que nous stockons sont de plus en plus complexes. Il faut savoir choisir la bonne technologie pour le bon use case. L'une des technologies qui peut vous être utile, c'est la base de données graphes Neo4j.

## Neo4j c'est quoi ?

Neo4j c'est une base de données graphes. Elle permet de stocker vos données dans un format de graphe.

> Mais c'est quoi un graphe ?

Un graphe est composé de deux choses :

- des noeuds qui contiennent la donnée dans un format simple de propriété du noeud ;
- des relations qui permettent de lier les noeuds entre eux. Les relations aussi peuvent avoir des propriétés, et donc contenir de la donnée.

![Graph]({{site.baseurl}}/assets/2018-01-29-neo4j-et-symfony/graph.png)


> Mais cela permet quoi ?

Les bases de données type graphe permettent de gérer des données très liées. Le use case que vous trouverez sur le net est toujours le même : la gestion des relations dans les réseaux sociaux. Il est plus simple de représenter les amis d'une personne via ce genre de base de données, en prenant le noeud comme un utilisateur et la relation comme le lien d'amitié. Ce qu'apporte Neo4J c'est qu'il devient très simple de récupérer les amis de mes amis en une seule requête... ce qui serait très compliqué via une base de données relationnelle.

> Hé ! Mais c'est comme graphQL ?

Alors là non !!! GraphQL n'est pas une base de données graphe, GraphQL n'est même pas une base de données. Neo4J est réellement une base de données et permet de stocker vos données dans un format graphe, tandis que GraphQL est une convention de requêtage.

## Installation d'un Neo4J

L'installation d'un serveur Neo4j est assez simple, il suffit de suivre les indications sur le site [neo4j](https://neo4j.com/). Vous pouvez aussi utiliser la machine docker disponible [ici](https://store.docker.com/images/neo4j).

Si vous êtes sur un environnement Ubuntu vous n'avez qu'à suivre les instructions suivantes [ubuntu](https://doc.ubuntu-fr.org/neo4j).

Une fois l'installation terminée, vous aurez accès à l'interface web qui est très pratique, elle est disponible [ici](http://127.0.0.1:7474/browser/).

![Interface]({{site.baseurl}}/assets/2018-01-29-neo4j-et-symfony/interface.png)

## Cypher, le requêtage simple

Pour requêter votre base de données, il faut apprendre à faire du Cypher. Cypher c'est le langage de requêtage pour Neo4J. Il est assez simple car très visuel. Vous pouvez lancer directement vos requêtes dans l'interface de Neo4j.

Commençons par créer un noeud :

```
CREATE (ee:Person { name: "Emil", from: "Sweden" })
```

Ici, nous venons de créer un noeud de type `Person` qui a comme propriété `name` et `from` avec comme valeurs respectives `Emil` et `Sweden`

Validons maintenant que notre noeud est bien créé en allant le récupérer :

```
MATCH (ee:Person) WHERE ee.name = "Emil" RETURN ee;
```

En Cypher, la récupération se fait via le mot clé `MATCH` puis nous récupérons les noeuds de type `Person` qui ont pour valeur dans la propriété `name` `Emil`.

Maintenant que nous savons créer des noeuds, nous allons en créer plusieurs pour ensuite les mettre en relation :

```
CREATE (js:Person { name: "Johan", from: "Sweden", learn: "surfing" }),
(ir:Person { name: "Ian", from: "England", title: "author" }),
(rvb:Person { name: "Rik", from: "Belgium", pet: "Orval" }),
(ally:Person { name: "Allison", from: "California", hobby: "surfing" })
```

Puis nous allons créer les relations entre les noeuds :

```
MATCH (ee:Person) WHERE ee.name = "Emil"
MATCH (js:Person) WHERE js.name = "Johan"
MATCH (ir:Person) WHERE ir.name = "Ian"
MATCH (rvb:Person) WHERE rvb.name = "Rik"
MATCH (ally:Person) WHERE ally.name = "Allison"
CREATE
(ee)-[:KNOWS {since: 2001}]->(js),(ee)-[:KNOWS {rating: 5}]->(ir),
(js)-[:KNOWS]->(ir),(js)-[:KNOWS]->(rvb),
(ir)-[:KNOWS]->(js),(ir)-[:KNOWS]->(ally),
(rvb)-[:KNOWS]->(ally)
```

Nous récupérons donc l'ensemble des noeuds déjà créés, puis nous créons les relations. Dans cet exemple, il y a deux façons de créer des relations :

```
CREATE (ee)-[:KNOWS {since: 2001}]->(js)
```

Ici nous créons une relation dans le sens `ee` et `js` la relation est de type `KNOWS` avec la propriété `since` qui a pour valeur `2011`.

```
CREATE (rvb)-[:KNOWS]->(ally)
```

Ici nous créons une autre relation de type `KNOWS` entre `rvb` et `ally` mais ici sans propriété.

Si vous récupérez l'ensemble des noeuds de type `Person`...

```
MATCH (n:Person) RETURN n
```

...vous devez voir cela :

![person]({{site.baseurl}}/assets/2018-01-29-neo4j-et-symfony/person.png)

Pour finir, nous allons récupérer toutes les relations avec `Emil`.

```
MATCH (ee:Person)-[:KNOWS]-(friends)
WHERE ee.name = "Emil" RETURN ee, friends
```

La requête est assez simple. Vous faites un `MATCH` sur les relations qui ont comme noeud dans un des sens `ee`.

## Utiliser Symfony et Neo4J


### Use Case

Dans notre use case, nous allons créer un système d'arborescence pour un site web.
Un noeud sera donc une rubrique avec comme propriété `title`, et les noeuds seront en relation afin de créer l'arborescence de votre site.


### Installation

L'architecture du projet est un Symfony 4 avec Twig et la gestion des annotations.

Vous pouvez maintenant ajouter le bundle suivant :

```
"neo4j/neo4j-bundle": "^0.4.0",
```

Disponible [ici](https://github.com/neo4j-contrib/neo4j-symfony)

Vous devez aussi ajouter la librairie suivante :

```
"graphaware/neo4j-php-ogm": "@rc",
```

Disponible [ici](https://github.com/graphaware/neo4j-php-ogm). Cette librairie permet de récupérer un entityManager pour Neo4j.


### Controller

Nous allons créer un controller avec deux actions :

- première action, permet de récupérer l'ensemble des rubriques ainsi que leurs relations ;
- seconde action, permet de créer une nouvelle rubrique liée à la rubrique choisie.

Commençons par ajouter le client Neo4j à votre controller :

```php
//src/Controller/ArboController.php

private $neo4jClient;

public function __construct(Client $client)
{
    $this->neo4jClient = $client;
}
```

Pour que cela fonctionne, n'oubliez pas de `bind` le service Neo4j dans la configuration :

```yaml
## config/services.yaml

services:
    # default configuration for services in *this* file
    _defaults:
        autowire: true      # Automatically injects dependencies in your services.
        autoconfigure: true # Automatically registers your services as commands, event subscribers, etc.
        public: false       # Allows optimizing the container by removing unused services; this also means
                            # fetching services directly from the container via $container->get() won't work.
                            # The best practice is to be explicit about your dependencies anyway.
        bind:
          GraphAware\Neo4j\Client\Client: '@neo4j.client'

```

Codons maintenant l'action permettant de récupérer l'ensemble des rubriques et des relations :

```php
//src/Controller/ArboController.php
/**
 * @Route("/getArbo", name="arbo")
 */
public function getArbo(Request $request)
{
    $query = 'MATCH (n:Rubrique)-[r]->(n1:Rubrique) RETURN n,n1,r';
    $result = $this->neo4jClient->run($query);

    $rubriques = [];
    foreach ($result->records() as $record) {
        $node = $record->get('n');
        $rubrique = $node->values();
        $identity = $node->identity();
        $rel = $record->get('r');
        $rel->startNodeIdentity();
        $rel->endNodeIdentity();
        $node2 = $record->get('n1');
        $rubrique2 = $node2->values();
        $identity2 = $node2->identity();

        if (!isset($rubriques[$identity])) {
            $rubriques[$identity] = [];
        }

        if (!isset($rubriques[$identity2])) {
            $rubriques[$identity2] = [];
        }


        $rubriques[$identity2]['title']  = $rubrique2['title'];
        $rubriques[$identity]['title'] = $rubrique['title'];
        $rubriques[$identity]['children'][] = $identity2;
    }

    $form = $this->createForm(NodeType::class);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $create = $form->getData();

        return $this->redirectToRoute('createArbo', ['title' => $create['title'], 'startTitle' => $create['startTitle']]);
    }

    return $this->render('arbo.html.twig', ['result' => $rubriques, 'form' => $form->createView()]);
}
```

Comme vous pouvez le voir, nous récupérons l'ensemble des rubriques liées. Puis nous parcourons les noeuds et relations pour les mettre dans un format plus simple pour le `front`.

Maintenant nous allons ajouter l'action permettant de sauvegarder un nouveau noeud et sa relation :

```
//src/Controller/ArboController.php

/**
 * @Route("/createArbo/{title}/{startTitle}", name="createArbo")
 */
public function createNode($title, $startTitle)
{
    $createNodeQuery = "CREATE (n:Rubrique { title: {title}})";
    $createRelationQuery = "MATCH (a:Rubrique),(b:Rubrique) WHERE a.title = {startTitle} AND b.title = {endTitle} CREATE (a)-[r:RELTYPE]->(b) RETURN r";


    $this->neo4jClient->run($createNodeQuery, ['title' => $title]);
    $this->neo4jClient->run($createRelationQuery, ['startTitle' => $startTitle,'endTitle' => $title]);

    return $this->redirectToRoute('arbo');
}
```

On crée d'abord la nouvelle rubrique, puis on récupère chaque noeud et on crée la relation.

### FormType

Rien de compliqué. Le formulaire prend deux paramètres, le `title` du nouveau noeud, et le `title` du noeud parent.

```php
//src/Form/NodeType.php

class NodeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            ->add('startTitle')
            ->add('save', SubmitType::class, array('label' => 'Create node'))
        ;
    }
}
```

### Twig

Et pour terminer nous allons mettre en place une extension twig qui permet d'afficher l'arborescence.

Commençons par le code php de l'extension :

```php
//src/service/ArboExtension.php

class ArboExtension extends AbstractExtension
{
    private $twig;

    public function __construct( Environment $twig )
    {
        $this->twig = $twig;
    }

    public function getFilters()
    {
        return array(
            new TwigFilter('arbo', [$this, 'arbo'], ['is_safe' => ['html']]),
        );
    }

    public function arbo($arbo, $start = null)
    {
        return $this->twig->render('node.html.twig', ['arbo' => $arbo[$start], 'all' => $arbo]);
    }
}

```

Puis ajoutons l'affichage qui appelle récursivement l'extension twig :

{% raw %}
```twig
<!-- /templates/node.html.twig ->
<ul>
    <li>
        {{ arbo.title }}
        {% if arbo.children is defined %}
            {% for child in arbo.children %}
               {{ all|arbo(child) }}
            {% endfor %}
        {% endif %}
    </li>
</ul>
```
{% endraw %}

Il ne vous reste plus qu'à afficher la page complète !

{% raw %}
```
<!-- /templates/arbo.html.twig ->
{% extends 'base.html.twig' %}

{% block body %}
    {{ result|arbo(22) }}


    {{ form_start(form) }}
    {{ form_end(form) }}
{% endblock %}

```
{% endraw %}

![arbo]({{site.baseurl}}/assets/2018-01-29-neo4j-et-symfony/arbo.png)

## Conclusion

Voilà ! Vous avez un exemple assez simple de l'utilisation d'une base de données Neo4J.
Il existe de nombreux uses cases qui donnent tout l'intérêt à Neo4j. L'idée n'est jamais de faire un site qui n'utilise que Neo4j, mais dans nos architectures micro-service, pourquoi ne pas faire un service avec Neo4j ?
Il existe aussi des systèmes pour faire de l'affichage de graph Neo4j. C'est le cas par exemple de Linkurious, une petite start-up française. Si vous utilisez ou comptez utiliser Neo4j, laissez-moi un message pour connaître votre cas d'utilisation, je suis certain que beaucoup de personnes seraient intéressées.
