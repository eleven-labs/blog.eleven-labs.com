---
layout: post
title: PHP 7 Throwable Errors Exceptions
lang: en
permalink: /fr/php7-throwable-error-exception/
excerpt: "Errors exist in our code, in external library, and also when hardware fail. That's why understanding Throwable is essential to handle these errors cleverly."
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

PHP 7 brings some changes about how errors are reported.
From now on, most of the errors are reported through the exception class `Error`.

All `Throwable` will bubble up through the execution stack until they meet one of these cases:
 - when meeting a `catch` block which supports this kind of error;
 - if an exception handler is configured via `set_exception_handler()`;
 - or else, the exception will be converted into FATAL error and will be processed by the traditional system.

We are going to first define, and then see how to use  `Throwable`, `Error` and `Exception`.

## Definition

### Throwable

`Throwable` is a PHP 7 interface which represents an error.

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

Here is `Throwable` hierarchy:

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

> ⚠ Caution! You can only implement `Throwable` through `Error` and `Exception`.
> Else you get a FATAL error
> `PHP Fatal error:  Class MyClass cannot implement interface Throwable, extend Exception or Error instead`
> But you can extend this interface in user space

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

`Error` is the base class of all the internal PHP errors.

The most commons are the following:
 - `ParseError`, which is thrown when we `require` or `eval` a code with syntax error.
 - `TypeError`, which is thrown when arguments/return do not match its declare type. It's also the case when an invalid number of arguments are passed to php built-in function in `strict mode`._

_Sometimes you have the right to throw `Error` in your code, for example if you parse a file that contains a syntax error, or if you pass wrong numbers of arguments to a variadic function._

### Exception

`Exception` is the user exception base class.

Very often you have to throw or create one, se we are going to see how it works and how use to it properly.

## Usage

### Throw exception

You have to use the `throw` keyword in order to throw an `Exception`.

```php
throw new Exception('Render error.');
echo 'Example text.';
```

> An `Exception` interrupts the execution of next instructions.
> In this example the `echo` won't be called.

### Catch exception

You have to use `try` `catch` structure.

```php
try {
    if (!$_GET['title']) {
        throw new Exception('Can't show title. Title is required.');
    }
    echo $_GET['title'];
} catch (Exception $e) {
    echo '⚠ Exception appear: ' . $e->getMessage();
}

> The script will show the title if it's provided, or else it will show the error message.

You can attach multiple `catch` to a `try` bloc in order to split different exception types.
You must respect catch block precedence.

```php
try {
    if (!$_GET['title']) {
        throw new Exception('Can't show title. Title is required.');
    }
    if (!is_string($_GET['title'])) {
        throw new RuntimeException('Title must be a string.');
    }
    echo $_GET['title'];
} catch (RuntimeException $e) {
    echo $e->getMessage();
} catch (Exception $e) {
    echo '⚠ Exception appear: ' . $e->getMessage();
}
```

> `RuntimeException` extends `Exception`, then you must catch `RuntimeException` before `Exceptions`.

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

Most of `LogicException` usually leads to a code correction.
To catch `LogicException` is going to show an error page and log information in order to inform the developer.

`RuntimeException` represents errors that appear during the execution (invalide data, data source error).
You can catch `RuntimeException` in order to execute an alternative code for finishing the process correctly.

ℹ️ _You must have an exception handler to render a nice error page to visitors.
The second purpose is to avoid any leaking informations (file path, stack trace, error message...)
Best practice: Don't let the exception break the website._

```
set_exception_handler(function($exception){
    echo 'Error appear. Retry in a moment.';
    // log($exception->getMessage());
    // developer email
});
```

### Errors codes

the error code is an `integer` which can be used to codify/identify the error.

> You can show the error code instead of the message of the real `Exception` to the visitor, and prevent him to potentially be confronted to sensitive data.

## Advanced use

### Customize an exception

It's very useful to create your custom `Exception` class. They are more accurate and can carry extra data (text, object, array...) to the error process.

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

> When `MyObjectException` is caught, you can get back `MyObject` with the method `getMyObject()`
> You can use this object to run alternative processes, that will provide you more information than with the regular `Exception`.

### Rethrow an exception

Sometime we need to trace/log what's going wrong.
In this case we will have to catch the `Exception`, then do an alternative process (log, email, ...) and rethrow this exception.

```php
try {
    // content update
} catch (Exception $e) {
    // log('Update failed.');
    throw $e;
}
```

Here's a concrete example:

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

> We are logging a message and letting the `Exception` bubble up.

### Wrap an exception

Wrap an `Exception` is very useful to create a nice stack trace and delegate the exception handling to the main exception handler.

```php
try {
    // content update
} catch (RuntimeException $exception) {
    throw new UpdateContentException('Content update failed.', 0, $exception);
}

class UpdateContentException extends RuntimeException {}
```

> During the content update, the exception type doesn't matter and will always return an `UpdateContentException`. If you catch the `UpdateContentException`, you can access to all previous exceptions with the `getPrevious()` method.


Here's a concrete example:

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

> UserFactory::create() always tyhrows an `UserFactoryException`.
> The first information we need to know is what is going wrong? -> We can't create a user. Why ? -> exception->getPrevious()
> Layer separation is preserved.

## Conclusion

We have seen how to throw and catch exceptions, and even how to customize them with PHP. We have also seen how more advanced exception usages such as rethrow and wrap, in order to have a better control when something wrong happens.

**Errors exists in our code, in external library, or when hardware fails. that's why understanding Throwable is essential to handle errors cleverly.**

Pros
 - Better visibility about what's happening
 - Erros easier to read
 - Multiple types and error levels in order to split domain errors from software one
 - Easy to debug
 - Better split software responsibility (SOLID)
 - Error code can hide the real error reason

Cons
 - Need to know how to wrap/rethrow exception
 - Render/read stack trace can be complex
 - Don't forget to handle all exceptions with `catch`/`set_exception_handler` to avoid leaking informations

## Interesting links

* [Handle exceptions gracefully](/en/php_handle-exception-gracefully/)
* [Errors in PHP 7](http://php.net/manual/fr/language.errors.php7.php)
* [Example](https://3v4l.org/sDMsv)
* [Throwable Exceptions and Errors in PHP 7](https://trowski.com/2015/06/24/throwable-exceptions-and-errors-in-php7/)
