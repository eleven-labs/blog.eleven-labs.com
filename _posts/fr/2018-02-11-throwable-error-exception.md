---
layout: post
title: PHP 7 Throwable Errors Exceptions 
lang: fr
permalink: /fr/php7-throwable-error-exception/
excerpt: "Les erreurs sont présentes dans notre code, dans le code des librairies externes, ou même en cas de défaillance matérielle, c'est pourquoi la maîtrise des Throwable est indispensable afin d'avoir une gestion d'erreurs de qualitée."
authors:
    - amoutte
categories:
    - php
    - throwable
    - exception
    - error
tags:
    - php7
    - throwable
    - exception
    - error
cover: /assets/2018-02-11-php7-throwable-error-exception/cover.jpg
---

# PHP 7 Throwable Exceptions Errors

PHP 7 apporte un changement à la façon dont les erreurs sont rapportées. 
Désormais la plupart des erreurs sont rapportées en lançant des exceptions `Error`.

Les `Throwable` vont remonter la pile d'exécution (bubble up) jusqu'à rencontrer un des cas suivants:
 - si elle rencontre un bloc`catch` qui supporte ce type d'erreur.
 - si un gestionnaire d'exception est configuré via `set_exception_handler()`.
 - sinon l'exception sera convertie en erreur FATAL et sera traitée par le système traditionnel.

Nous allons donc, plus en détails, définir et voir comment utilisé `Throwable`, `Error` et `Exception`. 

## Définition

### Throwable

`Throwable` est une interface PHP 7 qui représente une erreur dans le script. 

```php
interface Throwable
{
    public function getMessage(): string;       // La raison de l'erreur
    public function getCode(): int;             // Le code de l'erreur
    public function getFile(): string;          // Le fichier dans lequel l'erreur à débuter
    public function getLine(): int;             // La ligne à laquel l'erreur à débuter
    public function getTrace(): array;          // Retourne la stack trace en array comme debug_backtrace()
    public function getTraceAsString(): string; // Retourne la stack trace en chaine de caractère
    public function getPrevious(): Throwable;   // Retourne le `Trowable` précédent
    public function __toString(): string;       // Convertit en chaine de caractère
}
```

`Errors` et `Exceptions` sont les deux types de base qui l'implémente.

Voici la hiérarchie des `Throwable`

```
interface Throwable
  |- Error implements Throwable
      |- ArithmeticError extends Error
          |- DivisionByZeroError extends ArithmeticError
      |- AssertionError extends Error
      |- ParseError extends Error
      |- TypeError extends Error
          |- ArgumentCountError extends TypeError
  |- Exception implements Throwable
      |- ClosedGeneratorException extends Exception
      |- DOMException extends Exception
      |- ErrorException extends Exception
      |- IntlException extends Exception
      |- LogicException extends Exception
          |- BadFunctionCallException extends LogicException
              |- BadMethodCallException extends BadFunctionCallException
          |- DomainException extends LogicException
          |- InvalidArgumentException extends LogicException
          |- LengthException extends LogicException
          |- OutOfRangeException extends LogicException
      |- PharException extends Exception
      |- ReflectionException extends Exception
      |- RuntimeException extends Exception
          |- OutOfBoundsException extends RuntimeException
          |- OverflowException extends RuntimeException
          |- PDOException extends RuntimeException
          |- RangeException extends RuntimeException
          |- UnderflowException extends RuntimeException
          |- UnexpectedValueException extends RuntimeException
```

> ⚠ Attention!!! Vous ne pouvez implémenter `Throwable` qu'à travers `Error` et `Exception`. 
> Sinon vous obtiendrez une erreur FATAL 
> `PHP Fatal error:  Class MyClass cannot implement interface Throwable, extend Exception or Error instead`
> Il est quand même possible d'étendre cette interface dans le domaine utilisateur.

```php
interface MyThrowable extends Throwable {
    public function myCustomMethod();
}

class MyException extends Exception implements MyThrowable {
    public function myCustomMethod()
    {
        // implement custom method code
    }
}
```

### Error

`Error` est la classe de base de toutes les erreurs internes de PHP.

Les plus communes sont:
 - `ParseError` est lancé quand on `require` ou `eval` un code qui contient une erreur de syntax.
 - `TypeError` est lancé quand le typehint d'un argument/retour d'une fonction n'est pas respectée. _Et également en `strict mode` quand on passe un nombre invalid d'argument à une fonction native de PHP._

_Vous pourriez être amené à throw des `Error` dans votre code si par exemple vous parsez un fichier et qu'il contient une erreur de syntaxe.
Ou si vous avez une fonction avec un nombre de paramètre variable et que le nombre/type d'argument n'est pas correct._

### Exception

`Exception` est la classe de base de toutes les exceptions utilisateurs.

Il est très fréquent de lancer ou crée des `Exception`. 
C'est d'ailleurs sur le fonctionnement et l'utilisation des `Exception` que nous allons nous intéresser. 

## Utilisation

### Lancer une exception

Pour lancer une exception il suffit d'utiliser le mot clé `throw`.

```php
throw new Exception('Mon message d\'erreur.');
echo "Affichage d'un contenu texte.";
```

> Il faut savoir qu'une `Exception` interrompt l'exécution des instructions suivantes.
> Dans l'exemple le `echo` ne seras pas exécuté. 

### Attraper une exception

Pour attrapé et géré l'exception il faut utiliser la structure `try` `catch`.
```php
try {
    if (!$_GET['titre']) {
        throw new Exception('Impossible d'afficher le titre. Le titre est requis.);
    }
    echo $_GET['titre'];
}
catch (Exception $e) {
    echo '⚠ Une exception est survenue : ' . $e->getMessage();
}
```
> Dans cet exemple le script affichera le titre s'il est fourni
> sinon il affichera le message d'erreur comme quoi il est obligatoire.

depuis PHP 7.1 il est également possible de spécifier plusieurs types d'`Exception` dans le catch en utilisant le caractère `|`

```php
try {
    // Code
}
catch (OutOfBoundsException | LogicException $e) {
    echo '⚠ Une exception est survenue : ' . $e->getMessage();
}
``` 

__⚠ Il est très important de bien choisir l'`Exception` que l'on veut lancé ou attrapé
sinon la gestion d'erreur ne seras pas consistante.__

**Également à savoir**

La `LogicException` référence une erreur de code qui devrait la plupart du temps menée à un correctif sur le code.
Attrapé une `LogicalException` à généralement pour but d'afficher une page d'erreur et de logger en vue d'informer le développeur. 

La `RuntimeException` représente des erreurs durant l'exécution (donnée invalide, erreur d'une source de données). 
Attrapé une `RuntimeException` est très utile pour exécuter un code alternatif qui permettra au script de finir son execution.

ℹ️ _Il est très fortement recommandé d'avoir un exception handler afin d'afficher une page d'erreur au visiteur.
Mais aussi pour évité d'afficher des informations sensibles (url du fichier, stack trace, message d'erreur ...)
La bonne pratique étant ne pas laisser une exception casser le site._

```
set_exception_handler(function($exception){
    echo 'Une erreur est survenue. Veuillez rééssayer ulterieurement.';
    // log($exception->getMessage());
    // email au developpeur
});
```

### Les codes d'erreurs

Le code d'erreur est un `integer` qui peut être utilisé pour codifier/identifier l'erreur.

> Il permet par exemple d'afficher le code de l'erreur plutôt que le message de l'`Exception` au visiteur. 
> Afin de masquer la raison de l'erreur, qui, peu dans certain cas contenir des informations sensibles. 

## Utilisation avancée

### Créer une exception personalisée

Il est très utile de créer des exceptions personnalisées afin qu'elle puisse identifier un problème plus précisément mais, aussi de pouvoir transporter des données supplémentaires (texte, object, array...).

```php
class MyObject
{
    public $content;
}

class MyObjectException extends RuntimeException
{
    /**
     * @var MyObject
     */
    private $myObject;

    public function __construct(MyObject $myObject, $message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->myObject = $myObject;
    }

    /**
     * @return MyObject
     */
    public function getMyObject()
    {
        return $this->myObject;
    }
}
```

> Quand l'`MyObjectException` est attrapé on peut récupérer l'objet `MyObject` via la méthode `getMyObject()`
> Ce qui permet de gérer encore plus précisément la gestion d'erreur. 

### Relancé une exception

Parfois il est utile de tracé/logguer ce qui c'est mal déroulé. 
Dans ce cas on va donc attraper l'`Exception`, logger un message d'erreur avant de relancer l'`Exception`.

```php
try {
    // mise à jour d'un contenu
}
catch (Exception $e) {
    // log('La mise à jour a échoué.');
    throw $e;
}
```

Exemple concret

```php
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerAwareTrait;
use Psr\Log\NullLogger;

class UserFactory implements LoggerAwareInterface
{
    use LoggerAwareTrait;
    
    private $passwordGenerator;
    
    public function construct(PasswordGeneratorInterface $passwordGenerator)
    {
        $this->passwordGenerator = $passwordGenerator;
        $this->logger = new NullLogger();
    }
    
    public function create() 
    {
        try {
            $user = new User();
            $password = $this->passwordGenerator->generatePassword();
            $user->setPassword($password);
            
            return $user;
        } catch (Exception $exception) {
            $this->logger->error('Une erreur est survenue pendant la creation d'un utilisateur. Raison: ' . $exception->getMessage());
            
            throw $exception;
        } 
    }
}

interface PasswordGeneratorInterface
{
    public function generatePassword();
}
```

> Ici on peut remarqué que l'on va seulement logger un message d'erreur et laisser remonté (bubble up) l'exception.

### Encapsuler un exception

Il existe également l'encapsulation d'une `Exception` dans une autre `Exception` afin de créer un stack trace complète.

```php
try {
    // mise à jour d'un contenu
}
catch (Exception $exception) {
    throw new UpdateContentException('Erreur de mise a jour du contenu.', 0, $exception);
}

class UpdateContentException extends RuntimeException {}
```

> Peu importe le type d'exception qui serais lancée pendant la mise à jour du contenu, le code
> renverra toujours une `UpdateContentException`
> Si on attrape l'`UpdateContentException` on peut récupérer l'`Exception` précédente grâce à la méthode `getPrevious()`


Exemple concret
```php
class UserFactory
{
    private $passwordGenerator;
    
    public function construct(PasswordGeneratorInterface $passwordGenerator)
    {
        $this->passwordGenerator = $passwordGenerator;
    }
    
    public function create() 
    {
        try {
            $user = new User();
            $password = $this->passwordGenerator->generatePassword();
            $user->setPassword($password);
            
            return $user;
        } catch (Exception $exception) {
            throw new UserFactoryException('Une erreur est survenue pendant la creation d\'un utilisateur.', 0, $exception);
        } 
    }
}

class UserFactoryException extends RuntimeException {}

interface PasswordGeneratorInterface
{
    public function generatePassword();
}
```

> On peut voir ici que peu importe l'`Exception` qui se produit dans `$this->passwordGenerator->generatePassword()`
> l'`Exception` qui sera remonté est une `UserFactoryException` qui nous informe que la création a échoué. 
> La séparation des couches logiciels est respecté.

## Conclusion

Nous avons vu comment lancé et attrapé une exception en PHP ainsi que des notions un peu plus avancé sur la création d'une exception personnalisée pouvant transporté des données supplémentaires utilisable en cas d'erreur.
Sans oublier la gestion du logging/tracing grâce au rethrow et à l'encapsulation d'exception.

**Les erreurs sont présentes dans notre code, dans le code des librairies externes, ou même en cas de défaillance matérielle, c'est pourquoi la maîtrise des Throwable est indispensable afin d'avoir une gestion d'erreurs de qualitée.**

Les points positifs
 - Une meilleure visibilité de ce qui c'est déroulé
 - Des erreurs plus lisibles
 - Différent type et niveaux d'erreur afin de pouvoir séparer les erreurs métiers des erreurs logiciels
 - facilite le débogage
 - un meilleur découpage des responsabilitées logiciels (SOLID)
 - l'utilisation des codes d'erreurs permet de masquer la réel raison aux visiteurs
 
Les points négatifs
 - il faut savoir quand encapsuler/relancer une exception
 - la lecture/mise en forme de la stack trace peut être complexe.
 - il ne faut pas oublier de gérer toutes les exceptions `catch`/`set_exception_handler` afin qu'aucune information sensible ne soit affiché aux visiteurs.

## Autre articles intéressant

http://php.net/manual/fr/language.errors.php7.php
https://3v4l.org/sDMsv
https://trowski.com/2015/06/24/throwable-exceptions-and-errors-in-php7/
