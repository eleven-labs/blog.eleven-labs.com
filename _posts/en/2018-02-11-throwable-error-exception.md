---
layout: post
title: PHP 7 Throwable Errors Exceptions 
lang: fr
permalink: /fr/php7-throwable-error-exception/
excerpt: "Errors exists in our code, in externe library, even when hardware fail, it's why understanding Throwable is essential to have a smart error handler."
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

PHP 7 bring some changes about error reporting. 
The most errors are bring back through exception class `Error`.

All `Throwable` gonna to bubble up through the execution stack until these cases:
 - when meet a `catch` block who support this kind of error.
 - if an exception handler was configure (`set_exception_handler()`).
 - else the exception gonna to be converted into FATAL error an will be process by the traditional system.

We gonna to define and see how to use  `Throwable`, `Error` and `Exception`. 

## Definition

### Throwable

`Throwable` is an PHP 7 interface which represent an error. 

```php
interface Throwable
{
    public function getMessage(): string;       // Error reason
    public function getCode(): int;             // Error code
    public function getFile(): string;          // Error begin file
    public function getLine(): int;             // Error begin line
    public function getTrace(): array;          // Return stack trace as array like debug_backtrace()
    public function getTraceAsString(): string; // Return stack trace as string
    public function getPrevious(): Throwable;   // Return previous `Trowable`
    public function __toString(): string;       // Convert into string
}
```

`Errors` and `Exceptions` are implementing `Throwable`.

Here is `Throwable` hierarchy

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

> ⚠ Caution!!! You can only implement `Throwable` through `Error` and `Exception`. 
> Else you got a FATAL error
> `PHP Fatal error:  Class MyClass cannot implement interface Throwable, extend Exception or Error instead`
> But you can extends this interface in user space

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

`Error` is the base class of all internal PHP errors.

The most common:
 - `ParseError` was throw when `require` or `eval` code with syntax error.
 - `TypeError` was throw when arguments/return not match its declare type. _When an invalid number of arguments are passed to php built-in function in `strict mode`._

_Sometimes you have the right to throw `Error` in your code if you parse a file that contains a syntax error.
Or if you pass wrong numbers of arguments to a variadic function._

### Exception

`Exception` is user exception base class.

Very often you have to throw or create `Exception`.
We going to see how `Exception` work and how use it properly. 

## Usage

### Throw exception

You have to use `throw` keyword in order to throw an `Exception`.

```php
throw new Exception('Render error.');
echo 'Example text.';
```

> An `Exception` interrupt the execution of current instruction.
> In this example the `echo` shouldn't be called. 

### Catch exception

You have to use `try` `catch` structure.

```php
try {
    if (!$_GET['title']) {
        throw new Exception('Can show title. Title is require.');
    }
    echo $_GET['title'];
} catch (Exception $e) {
    echo '⚠ Exception appear: ' . $e->getMessage();
}

You can attach multiple `catch` to a `try` bloc in order to split different exception type.
You must respect catch block precedence.  

```php
try {
    if (!$_GET['title']) {
        throw new Exception('Can show title. Title is require.');
    }
    if (!is_string($_GET['title'])) {
        throw new RuntimeException('Title must be a string.);
    }
    echo $_GET['title'];
} catch (RuntimeException $e) {
    echo $e->getMessage();
} catch (Exception $e) {
    echo '⚠ Exception appear: ' . $e->getMessage();
}
```

> `RuntimeException` extends `Exception`, then you must catch `RuntimeException` before `Exceptions`.

 
```
> The script gonna to show the title if it provided
> else gonna to show error message.

In PHP 7.1 you can specify multiple `Exception` types with `|` char. 

```php
try {
    // Code
} catch (OutOfBoundsException | LogicException $e) {
    echo '⚠ Exception appear: ' . $e->getMessage();
}
``` 

__⚠ It's very important to correctly choose the `Exception` type to preserve error handler consistency.__

**Need to know**

Most of `LogicException` lead to bring code correction.
Catch `LogicException` is going to show an error page and log information in order to inform the developer. 

`RuntimeException` represent errors that appear during the execution (invalide data, data source error). 
You can catch `RuntimeException` in order to execute an alternative code for finish the process correctly.

ℹ️ _You must have an exception handler to render nice error page to visitors.
The second purpose is to avoid any leaking informations (file path, stack trace, error message...)
Best practice: Don't let the exception brake website._

```
set_exception_handler(function($exception){
    echo 'Error appear. Retry in a moment.';
    // log($exception->getMessage());
    // developer email
});
```

### Errors codes

Errors codes was an `integer` which can be use to codify/identify error.

> You can show code error instead of real `Exception` error message in order to hide it to the visitor. 

## Advance usage

### Custom exception

It's very useful to create your custom `Exception` class. They are more accurate and can carry an extra data(text, object, array...) to the error process.

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

> When `MyObjectException` is catch you can get back `MyObject` with method `getMyObject()`
> You can use this object to run alternative process and help you with more information than regular `Exception`. 

### Rethrow exception

Sometime we need to trace/log what going wrong.
In this case we gonna to catch `Exception`, doing alternative process(log, email, ...) and rethrow this exception.

```php
try {
    // content update
} catch (Exception $e) {
    // log('Update failed.');
    throw $e;
}
```

Concret example

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
            $this->logger->error('Error appear during user creation. Reason: ' . $exception->getMessage());
            
            throw $exception;
        } 
    }
}

interface PasswordGeneratorInterface
{
    public function generatePassword();
}
```

> We going to log an message and let the `Exception` bubble up.

### Wrap exception

Wrap an `Exception` is very useful to create a nice stack trace and delegate exception handling to the main exception handler.

```php
try {
    // content update
} catch (RuntimeException $exception) {
    throw new UpdateContentException('Content update failed.', 0, $exception);
}

class UpdateContentException extends RuntimeException {}
```

> All underlay error trigger this catch and throw unique `UpdateContentException` type.
> When you catch the `UpdateContentException` you can access to all previous exception with `getPrevious()` method.


Concret example

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
            throw new UserFactoryException('Error appear during user creation.', 0, $exception);
        } 
    }
}

class UserFactoryException extends RuntimeException {}

interface PasswordGeneratorInterface
{
    public function generatePassword();
}
```

> UserFactory::create() throw always an `UserFactoryException`.
> The first information we need to know is what going wrong? -> We can't create user. Why ? -> exception->getPrevious() 
> Layer separation is preserve.

## Conclusion

We have seen how to throw and catch exception and custom exception with PHP but also more advance exception usage like rethrow and wrapping exception to have a better control when something wrong happen.

**Errors exists in our code, in externe library, even when hardware fail, it's why understanding Throwable is essential to have a smart error handler.**

Pros
 - Better visibility about what happen
 - more readable error
 - multiple type and error level in order to split domain error from software one.
 - easy to debug
 - better split software responsibility (SOLID)
 - error code can hide real error reason
 
Cons
 - need to know how to wrap/rethrow exception
 - render/read stack trace can be complex.
 - dont forget to handle all exceptions  with `catch`/`set_exception_handler` to avoid leaking informations.

## Interesting link

http://php.net/manual/fr/language.errors.php7.php
https://3v4l.org/sDMsv
https://trowski.com/2015/06/24/throwable-exceptions-and-errors-in-php7/
