---
contentType: article
lang: fr
date: 2024-01-10
slug: typage-generique-php
title: "Typage générique en PHP : définition, conseils et exemples"
excerpt: "Découvrez comment réaliser du typage générique en PHP : introduction et définition du concept, conseils et explications pas-à-pas de cas pratique."
categories:
    - php
keywords:
    - typage générique
    - typage PHP
    - phpstan
    - symfony
    - doctrine
authors:
    - ajacquemin
---

## Introduction au typage générique en PHP

Le typage générique, non seulement c'est super, mais en plus, c'est classe. Dans un monde idéal, voilà à quoi ça ressemblerait en PHP :

```php
class Collection<Type> { /* class definition ... */ }


$users = new Collection<User>();
```

Cela signifie que notre instance de collection `$users` ne peut accepter que des objets de type `User`.
Nous aurions alors, notamment grâce à nos IDE intelligents, des informations plus strictes sur le type de données admises par une instance de Collection, sans avoir à simplement le déduire par le nom de la variable. L'analyse statique de notre code serait encore plus performante, ce qui est important en PHP qui ne possède pas d'étape de compilation à proprement parler.

Pour de nombreux langages de programmation, cette étape de compilation permet de soulever des erreurs dans le code, voire de parser ces types génériques.

Alors, pourquoi ces types ne sont-ils pas déjà disponibles dans notre langage préféré ?

## En quoi le typage générique en PHP est impossible dans la pratique ?

Comme dit plus haut, PHP n'est pas un langage que l'on compile pour envoyer ensuite un exécutable sur le serveur. PHP est interprété ; lorsque le serveur reçoit une requête, le code PHP est converti en OPCODE, lui-même ensuite exécuté par une machine virtuelle. Si une erreur s'est glissée dans le code, alors le programme plantera à l'exécution.

Or, c'est donc justement au runtime que se font toutes les assertions de type. Rajouter des étapes de vérification de types génériques serait une atteinte à la performance. Encore une fois, aujourd'hui pour la majorité des langages proposant le typage générique toutes ces assertions de type sont effectuées à la compilation avant que le code ne soit exécuté. La perfomance à l'exécution n'est donc pas un problème comme en PHP.

De plus, on estime que rajouter cette gestion des types génériques dans le coeur de PHP demanderait un effort de refactoring très ambitieux, à tel point que le rapport ***bénéfice*** / ***temps passé à l'implémentation*** n'en vaudrait pas la peine dans le contexte actuel.

PHP a beaucoup évolué ces derniers temps, mais il reste beaucoup de choses à faire, et le nombre de développeurs qui maintiennent le coeur de PHP n'est pas mirobolant, il y a donc également un problème de ressource.

Enfin, proposer une RFC pour les types génériques n'est pas si simple : il faut se mettre d'accord parmi les nombreuses possibilités d'implémentation envisageables, trouver la meilleure, puis prendre le temps de l'implémenter. Des débats sans fin sont à prévoir.

Pour toutes ces raisons, allant du design même du langage à la complexité d'implémentation, les génériques ne sont pas d'actualité pour le moment.

![pikachu crying](https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif)

Mais, ne jamais dire jamais...

## Les types statiques, la solution ?

Alors, que fait-on maintenant ? On se roule en boule dans un coin et on regrette d'avoir choisi PHP ?

... Ou alors, on se tourne vers un des super pouvoirs de PHP : son écosystème d'analyseurs statiques.
En effet, nous avons la chance en PHP d'avoir pléthore d'*analyseurs statiques*, tous extrêmement bien développés.

Grâce à eux, [notre IDE favori, PhpStorm bien entendu]({BASE_URL}/fr/phpstorm-tips-config-extensions/) est en mesure de nous crier dessus à la moindre erreur décelable avant l'exécution.
Problème de typage ? Argument oublié dans une fonction ? Variable inutilisée ? Condition toujours vraie ? Accolade ou point virgule oublié ? Et j'en passe ...

Créez même vos propres règles de lint, de bonnes pratiques à suivre dans votre équipe. Ces outils, comme PHPCs ou PHPStan, permettent tout cela.

Et bonne nouvelle, certains de ces outils vous permettent de définir puis vérifier vos *types génériques*.

Comment ? Tenez vous bien, en utilisant... les annotations de la PHPDoc...

Bon je sais, certains ne sont pas convaincus, mais dites-vous bien que la PHPDoc est une manière très puissante d'enrichir PHP sans avoir à toucher au code.
Vous allez voir, après quelques exemples, vous ne reviendrez plus en arrière.

## Cas pratique : créer un type générique en PHP

Alors, on trépigne d'impatience à l'idée de créer ses premiers types génériques ?

Ne perdons plus de temps. Tout d'abord, pour créer un type, nous utiliseront toujours le même tag : `@template`.

Par exemple au dessus d'une classe :

```php
/** @template T */
abstract class BaseRepository
{
    // ...
}
```

Ou au dessus d'une fonction :

```php
/** @template T */
function foo()
{
	// ...
}
```

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Si votre IDE n'est pas encore compatible avec l'annotation <code>@template</code> ou avec le typage générique <code>T</code>, utilisez le prefix @phpstan, par exemple : <code>@phpstan-template</code>
</div>

Par convention, on nommera plutôt ce type `T`, mais soyez conscient que vous pouvez le nommer absolument comme vous le souhaitez.

Et voilà, vous avez créé votre type générique `T` ! Mais à quoi sert-t-il ?

Comme vous vous en doutez, `T` est un type qui ne signifie rien en tant que tel. Il est uniquement là pour être remplacé par un autre type (un vrai type cette fois-ci), que nous ne connaissons pas à l'avance. `T` est donc un type en contrat d'intérim, qui attend qu'un vrai type vienne faire le job.

Il est temps à présent de s'amuser un peu avec.
Prenons l'exemple d'une fonction qui prend un paramètre en entrée, et renvoie cette même variable à la fin de son traitement.

```php
function foo($bar)
{
    // Do something ...

	return $bar;
}
```

Mettons que nous ne savons pas à l'avance le type de `$bar`, mais nous voulons nous assurer que le type de retour est le même que ce qui est passé en paramètre.

Vous l'avez compris, `T` est tout indiqué ici ! Nous pouvons faire cela :

```php
/**
 * @template T
 * @param T $bar
 * @return T
 */
function foo($bar)
{
    // Do something ...

	return $bar;
}
```

Et voilà, grâce aux tags `@param` et `@return`, vous indiquez à votre IDE que quelque soit le type de `$bar` en entrée, noté `T`, il devra avoir le même type lors du retour de la fonction.

Et si vous changez le type de `$bar` en cours de route en lui affectant une valeur de type différent, une erreur sera remontée lors de la prochaine exécution de PHPStan.

Exécutez simplement :

```bash
./vendor/bin/phpstan
```

Et vous pourrez constater l'erreur de type retournée. Vous n'avez plus qu'à ajouter PHPStan dans votre CI, et vous ne pourrez plus pousser du code sans que vos types soient cohérents.

Maintenant, mettons que vous en savez un peu plus sur le type que vous allez recevoir. Vous savez que vous ne recevrez jamais de type scalaire (`int`, `float`, `bool`, ...), mais toujours un `object`, sans savoir quelle classe exactement.

Vous pouvez limiter les types qui peuvent remplacer `T` avec la notation suivante :

```php
/**
 * @template T of object
 * @param T $bar
 * @return T
 */
function foo($bar)
{
    // ...
}
```

Grâce à cette notation, vous indiquez à votre analyseur statique que quel que soit le type reçu par votre méthode, il devra forcément être un sous-type de `object`.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Vous pouvez mettre n'importe quel nom de classe à la place de <code>object</code>, par exemple <code>\Exception</code> peut être pratique pour accepter seulement des objets de types <code>Exception</code> sans savoir exactement à l'avance quelle instance d'Exception sera reçue.
</div>

Typer génériquement au niveau des classes peut-être très puissant également, prenons l'exemple classique des `Collection`, et regardez bien les annotations que j'y ai ajouté.

```php
/** @template T */
class Collection
{
    /** @param T $item */
    public function add($item): void
    {
        // Add item to your collection
    }
}
```

À présent, que se passe-t-il si vous souhaitez une `Collection` qui contient uniquement des objets de type `Astronaut` ?

Et bien grâce au typage générique que j'ai ajouté dans la classe `Collection`, vous pouvez faire cela :

```php
/** @param Collection<Astronaut> $astronauts */
public function foo(Collection $astronauts): void
{
    $astronauts->add(new Astronaut());
}
```

Peut-être avez-vous déjà vu cette notation avec les chevrons : `Collection<Astronaut>`, notamment si vous avez déjà fait du TypeScript.

Ici, on indique simplement qu'il faut remplacer le type générique `T` par celui précisé entre les chevrons. Ainsi pour toutes les fois où le type `T` est utilisé dans la classe `Collection` (ici, une fois sur la fonction `add`), c'est en réalité un autre type (ici, `Astronaut`), qui sera utilisé.

Il faut vraiment voir `T` comme un type de substitution qui sera écrasé par un nouveau type, dès que cela est indiqué dans le code.

Voyons à présent un autre tag très important, le `@extends`. Il permet de tirer profit des types génériques avec **l'héritage**.

L'exemple du `@extends` ci-dessous est tiré de mon [Tutoriel]({BASE_URL}/fr/composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine) à propos du concept de ***composition over inheritance***.
Je vous le conseille si vous souhaitez en savoir plus sur ce principe, et dans tous les cas, je vous le recommande pour sa dernière partie qui met en application les types génériques que nous sommes en train d'apprendre ici.

Prenons une classe `BaseRepository`, qui se veut être une classe abstraite contenant toutes les fonctions de base utilisées dans nos repositories (`find`, `store`, `remove`, etc...).

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>
Pour rappel, un repository est une classe qui vous permet d'interagir avec votre base de données via les fonctions mises à votre disposition pour y récupérer des données, voire les manipuler (insertion, mise à jour, suppression) grâce à l'Entity Manager présent dans le Repository.
</div>

```php
/** @template T of object */
abstract class BaseRepository
{
    /** @param T $object */
    public function store(object $object): void
    {
        $this->entityManager->persist($object);
    }

    /** @return ?T */
    public function find(int $id): ?object
    {
        return $this->repository->find($id);
    }
}
```

Cette classe est censée être étendue par nos Repositories métiers, par exemple un `PostRepository` ou encore un `UserRepository`.
Or, elles étendrons nos fonctions `store` et `find`, qui sont typées `object`, car on ne sait pas à l'avance quel Repository va les utiliser.

La solution est de faire un type `T of object`, que l'on a déjà vu plus haut dans cet article. Puis on type les méthodes de la classe. Jusqu'ici, rien de nouveau.

Prenons à présent un de nos réels Repositories, le `UserRepository`.

Voilà comment l'écrire :

```php
/** @extends BaseRepository<User> */
class UserRepository extends BaseRepository
{
    // Repository body ...
}
```

Bien que le tag `@extends` soit nouveau, la notation avec les chevrons devrait vous rappeler ce que nous avons fait avec les Collections.
Du coup on comprend ce qui se passe ici : grâce à cette annotation, on indique qu'en héritant du `BaseRepository`, on souhaite remplacer tous ses types `T` par nos types `User`.
Voilà ce qui en résultera en pratique :

```php
public function index(UserRepository $userRepository): void
{
    // PHPStan is satisfied
    $object = new User();
    $userRepository->store($object);

    // PHPStan throw an error
    $object = new Post();
    $userRepository->store($object);
}
```

Ainsi, vous rajoutez de la sécurité en vous empêchant de faire une action qui n'aurait de toute façon pas été possible à l'exécution du code. Grâce au typage générique, vous augmentez la taille du filet qui attrape les erreurs dans votre code, avant que celui-ci ne soit exécuté en production.

Cet article est volontairement théorique, et sans exemple exhaustif. Prenez-le plutôt comme un pense-bête sur l'utilisation des génériques en PHP.

Pour une mise en application plus poussée et un accompagnement pas-à-pas de la vérification de ces types avec PHPStan, référez-vous au [Tutoriel]({BASE_URL}/fr/composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine) cité plus haut dans cet article.

## Conclusion

Oui, ce serait génial si dans le futur, PHP trouvait un moyen d'introduire les types génériques nativement dans notre langage préféré, mais en attendant, profiter de la puissance de nos analyseurs statiques est une option plus que satisfaisante pour améliorer notre expérience de développement, grâce à leur propre syntaxe du typage générique.

Sachez que d'autres outils que PHPStan permettent d'interpréter ces annotations de la même manière, tel que Psalm.

Il y aurait bien d'autres choses à voir sur les types génériques, en particulier le tag `@template-covariant`, mais ce sera pour une partie 2, pourquoi pas ! En attendant, vous avez tout le nécessaire pour vous en sortir dans la grande majorité des situations.

N'oubliez pas d'aller jeter un oeil à notre [Tutoriel]({BASE_URL}/fr/composition-over-inheritance-et-typage-generique-avec-symfony-et-doctrine), amusez-vous bien avec ces outils, développez-bien, et à la prochaine !
