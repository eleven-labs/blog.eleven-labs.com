---
layout: post
title: Performance et Memcached sous Symfony 2
lang: fr
permalink: /fr/performance-memcached-sous-symfony-2/
excerpt: Dans tout (gros) projet, à un moment avancé de votre développement/exploitation, vous serez amené à rencontrer divers problèmes de performance.
authors:
 - rjardinet
date: '2013-12-17 00:00:35 +0100'
date_gmt: '2013-12-16 23:00:35 +0100'
categories:
- Symfony
tags:
- symfony2
- memcached
---

Dans tout (gros) projet, à un moment avancé de votre développement/exploitation, vous serez amené à rencontrer divers problèmes de performance.

Certains peuvent être liés au trop grand nombre de requêtes effectuées ou encore à la quantité d'informations récupérées dans la BDD.

Nous allons vous proposer dans cet article de faire un point sur les quelques techniques rapides afin d'optimiser votre solution, ainsi que sur l'installation de memcached sous Sf2.

PART I : "Less Request For Less Time"
=====================================

Si il y a une chose que l'on apprécie tous sous Sf2, c'est son Entity Manager avec son système de Lazy Loading. Le principe ? La donnée n'est réellement chargée depuis la BDD que lorsque que vous en avez réellement besoin, c'est a dire, lorsque que vous tentez d'accéder à l'un de ses attributs (le nom par exemple).

Mais cela peut aussi amener à quelques problèmes de performances lorsque l'on ne fait pas attention.

Prenons par exemple un model ou l'on a des Ecoles, des Classes et des Elèves. La problématique de votre projet implique que sur une page vous devez tout charger pour un affichage par liste.

Ex : Une liste d'école ou un click sur un bouton déroule des classes qui elles-mêmes peuvent se dérouler sur les éleves.

Votre logique métier étant bien faite, il vous suffit de récupérer votre liste complète juste en récupérant votre liste d'école (Vos classes étant liées aux écoles et les élèves étant liés aux écoles).

```php
class EcoleRepository {

public function getEcoles() {
  $qBuilder = $this->getEntityManager()
                   ->createQueryBuilder()
                   ->select('e')
                   ->from("MyBundle:Ecole", "e");

  return $qBuilder->getQuery()->getResult();
 }
}
```

Il ne vous reste plus qu'à parcourir la liste des écoles, puis pour chaque école sa liste de classe.

Parfait ! Mais si vous jetez un coup d'oeil sur votre Profiler en bas de page, vous verrez quelque chose comme cela :


Et oui, 194 requêtes Doctrine juste pour votre simple page, et pourtant votre jeu d'essai ne contient que 20 lignes en tout. Alors pourquoi ?

Tout simplement grâce/à cause de Doctrine qui vous a pré-mâché le boulot, certes, mais qui n'a pas optimisé ses requêtes. Si vous jetez un coup d’œil aux requêtes, vous allez voir qu'un certain nombre d'entre elles chargent une Classe pour un ID particulier, les autres chargeant les Elèves aussi pour un ID particulier. Vous commencez à comprendre ? En effet, cela vient de notre fameux Lazy Loading. Ici Doctrine ne charge que les éléments dont il a besoin mais étant dans une boucle, Doctrine les charge un par un, requête par requête. Et voila comment on transforme une page très simple en un enfer pour votre BDD.

La solution est très simple : indiquer à Doctrine de tout charger dans notre objet initial car nous allons avoir besoin de tout.

```php
class EcoleRepository {

public function getEcoles() {
  $qBuilder = $this->getEntityManager()
                   ->createQueryBuilder()
                   ->select('e', 'c', 's')
                   ->from("MyBundle:Ecole", "e")
                   ->leftJoin('e.MyBundle:Classe', 'c')
                   ->leftJoin('c.MyBundle:Student', 's');

  return $qBuilder->getQuery()->getResult();
 }
}
```

Et voila, le boulot est fait. Ici, pas de Lazy Loading, toutes nos données sont chargées en une seule requête. Vous devrez donc gagner un temps proportionnel au nombre d'éléments chargés sur la page.

Vous pouvez aussi gérer les jointures par défaut dans les entités avec l'annotation fetch="EAGER"

PART II : "Object Or Array"
===========================

Bon maintenant que notre requête est optimisée, il serait temps de s'occuper de notre donnée à proprement parlé.

Premier test, pour voir un peut ce qu'on l'on récupère, on peut toujours faire un var\_dump() sur notre variable $liste\_ecoles, mais c'est une mauvaise idée...

Pourquoi ? Tout simplement parce que l'objet (enfin la liste d'objet) est tellement gros qu'il fera certainement planter le rendu de votre navigateur.

Ok mais pourquoi avoir un objet si gros, alors que je veux juste boucler sur les entités et afficher certains de leurs attributs. D'ailleurs, pourquoi mon objet est il si gros alors que ma base ne contient que quelques champs ?

La réponse est encore à trouver du coté de l'EM, plus particulièrement de l'Hydratation de notre donnée.

En effet, lorsqu'elles sont récupérées par votre requête, plus particulièrement par  *$qBuilder->getQuery()->getResult();* vos données sont transformées pour intégrer un certain nombre de choses, principalement pour mapper votre Entity.class

Ce qu'il faut comprendre, c'est que cette opération consomme de la ressource, pour chaque objet, et ses objets liés etc... Mais pour de la vue simple, aucun intérêt !

Du coup, on va changer de méthode d'hydratation, pour quelque chose de beaucoup plus simple et donc performant.

```php
class EcoleRepository {

public function getEcoles() {
  $qBuilder = $this->getEntityManager()
                   ->createQueryBuilder()
                   ->select('e', 'c', 's')
                   ->from("MyBundle:Ecole", "e")
                   ->leftJoin('e.MyBundle:Classe', 'c')
                   ->leftJoin('c.MyBundle:Student', 's');

  return $qBuilder->getQuery()->getArrayResult();
 }
}
```

Voila, simple non !?

Maintenant faites un var\_dump(), si si vous pouvez promis ;)

Simple, vous n'avez que les données dont vous avez besoin.

Petite chose à vous rappeler dans votre template twig, vos données sont accessibles via des tableaux indéxés et non via des getter.

Ex :

{% raw %}
```twig
{{ eleve["nom"] }} {# remplace {{ eleve.getNom }} #}
```
{% endraw %}

PART III : "Time to Cache"
==========================

Bon, jusqu'ici c'était la partie facile, celle qui est à mettre en place partout, un réflexe à prendre en quelque sorte.

Nous allons maintenant rentrer dans les dernières phases d'optimisation côté code, même si nous allons tricher, puisque nous allons coupler Sf à une autre technologie : Memcached.

**⚠ Cette partie consiste à "stocker" nos données dans la RAM, cela est toujours mieux si la donnée à stocker est elle-même déjà optimisée, par exemple avec les conseils ci-dessus ;) ⚠**

Alors, pourquoi stocker notre donnée dans la RAM, si celle-ci est déjà optimisée grâce aux exemples précédents ?

1 / La vitesse

En effet, la grande différence entre stocker en mémoire (Memcached) et le disque (BDD) est la vitesse. Que ce soit en lecture ou écriture, la RAM est beaucoup, BEAUCOUP plus performant que le DD. Ca, je pense que vous le savez, donc pourquoi ne pas en profiter pour votre projet ? Apres tout la RAM ne sert pas qu'à faire tourner les derniers jeux !

2 / Le temps d'exécution

Et oui, qui dit données stockées, dit aussi stockées intelligemment, c'est a dire prêtes à servir. Une fois la donnée stockée, plus aucun traitement n'est à faire dessus hormis de la lecture, alors qu'en temps normal, on a au moins l'hydratation qui est faire à chaque fois.

**Memcached : Késako ?**

Memcached est un binaire, tournant sur à peu près toutes les plateformes, permettant d'accéder à un espace mémoire assez simplement.

En fait, memcached va nous permettre d'accéder à la RAM comme un simple tableau PHP, indéx clef => valeur, avec une durée de vie.

Pour nous simplifier la vie, nous allons utiliser le Bundle Memcached de Leaseweb, disponible [ici](https://github.com/LeaseWeb/LswMemcacheBundle){:target="_blank" rel="nofollow"}.

Pour l'installation, référez vous au README, c'est assez simple sous Linux.

Maintenant, allons "stocker" notre tableau dans la mémoire : (Note, le plugin permet de cacher directement les requêtes Doctrine, mais c'est aussi bien d'avoir toujours le contrôle sur ce que vous faites, à vous de voir)

```php
class EcoleRepository {

public function getEcoles() {

 //Verification de la donnée déja presente dans le cache
 if ($data = $this->memcache->get("ecole_list")) {
   return $data;
 }

  $qBuilder = $this->getEntityManager()
                   ->createQueryBuilder()
                   ->select('e', 'c', 's')
                   ->from("MyBundle:Ecole", "e")
                   ->leftJoin('e.MyBundle:Classe', 'c')
                   ->leftJoin('c.MyBundle:Student', 's');

  $data = $qBuilder->getQuery()->getArrayResult();
  //Sinon on set le resultat de notre requête dans le cache
  $this->memcache->set("ecole_list", $data, 86400);

  return $data;
 }
}
```

Ici on considérera que l'on a passé le service memcached dans le repo, sinon on y accède par service : *$this->get('memcache.default')*

On a défini dans le cache pour la clef  "ecole\_list" notre tableau de résultat, qui sera accessible n'importe où, et pour une durée d'une journée.

Et voila, c'était simple non ?

Attention, une dernière petite chose, la donnée dans cet état n'est pas mise à jour lorsque vous ajoutez une école ou encore un élève par exemple. Il faut donc penser à expirer le namespace du cache ("ecole\_list") lors de l'ajout ou la modification d'une donnée :

```php
$this->memcache->delete("ecole_list");
```

Voila vous savez tout. Pour pousser l'exemple plus loin, et surtout pour qu'il soit plus exploitable, vous pouvez créer un service MyMemcache qui gère vos enregistrements et suppressions en fonction du context, des paramètres (utile quand les données sont propres à l'utilisateur courant par exemple) :

```php
$param = array("ecole_list", "clientId", "ListId", ...);

//Creer un namespace unique composé des éléments du tableau $param
if ($data = $this->memcache->get(implode("_", $param), null)) {
  return $data;
}
```
