---
layout: post
title: Handle exceptions gracefully
excerpt: "Hello everyone! Today I would like to speak about a subject too little discussed in php: the exceptions. An exception is an alert issued when the code is executed, to indicate that something has not happened as expected. It can be a bad connection identifier to the database, or an operation on a file that is not allowed, or a division by zero for example."
lang: en
permalink: /php_handle-exception-gracefully/
authors:
 - tthuon
date: '2016-11-17 16:22:32 +0100'
date_gmt: '2016-11-17 15:22:32 +0100'
categories:
- Non classé
tags:
- php
- best practice
- exception
---

Hello everyone! Today I would like to speak about a subject too little discussed in php: the exceptions. An exception is an alert issued when the code is executed, to indicate that something has not happened as expected. It can be a bad connection identifier to the database, or an operation on a file that is not allowed, or a division by zero for example.

Once this alert is raised, you have to do something about it. Either I leave it under the carpet and I pass it over in silence, or I manage it correctly so that my application continues to function normally even after this error.

In this article, I will focus on two axes:

-   raise exceptions
-   handle exceptions

Raise exceptions at the right time
==================================

Let's start with the beginning, there is an exception because at some point in the application or one of the components, a condition or operation could not be fulfilled.

There are some good practices on creating exceptions. I will focus on two in particular: naming and context.

### Name the error, not the issuer

It is easier to name the exception by its location than by the problem itself. This is not a good practice because the returned message will not be able to identify the cause quickly and simply. For example, a divide by zero operation generates an exception. Raising an exception **OperationNotPossibleException** gives little indication of the origin of the error. With this name: *DivisionByZeroException*, the error is clear and precise.

An exception must describe as simply as possible the problem encountered.

```php
<?php

class Filesystem
{
    public function copy($originFile, $targetFile, $overwriteNewerFiles = false)
    {
        if (stream_is_local($originFile) && !is_file($originFile)) {
            throw new FileNotFoundException(sprintf('Failed to copy "%s" because file does not exist.', $originFile), 0, null, $originFile);
        }
        (...)
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Filesystem/Filesystem.php#L41
```

In this example, the copy could not be performed because of the original file not found. The exception is named by the cause of the error and not by the issuer: here the *copy()* method. If I had named the exception by the issuer, it could be *CouldNotCopyFileException*.

### Raise the exception according to the context

The name of the exception is used to understand the cause. To enrich it, it may be interesting to add a context.

Basic PHP exceptions do not identify the context of the error. With the SPL extension, there are 13 additional exceptions. They are grouped into two groups: logical exceptions and runtime exceptions.

A logical exception shows a problem with the code. For example, the exception *\\InvalidArgumentException* gives an indication to the developer about an error in the code: an expected argument is invalid. In addition to being named according to the cause, I know it is in the context of a logical exception. This means that as a developer, I did not pass a good argument to the method.

```php
<?php

class Constraint
{
    public static function getErrorName($errorCode)
    {
        if (!isset(static::$errorNames[$errorCode])) {
            throw new InvalidArgumentException(sprintf(
                'The error code "%s" does not exist for constraint of type "%s".',
                $errorCode,
                get_called_class()
            ));
        }
        return static::$errorNames[$errorCode];
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Validator/Constraint.php#L80
```

Exceptions taken at the runtime execution can not be detected before their interpretation. These are the following exceptions: *OutOfBoundsException*, *OverflowException*, *RangeException*, *UnderflowException*, *UnexpectedValueException*. Unlike a logical exception, it is not an error related to the code or its misuse, but linked to an error when executing the code.

Take the *OutOfBoundsException* example. This exception indicates that the index has no valid value in an array.

```php
<?php

class PropertyPath
{
    public function getElement($index)
    {
        if (!isset($this->elements[$index])) {
            throw new OutOfBoundsException(sprintf('The index %s is not within the property path', $index));
        }

        return $this->elements[$index];
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/PropertyAccess/PropertyPath.php#L188
```

Here, the size of the array varies depending on the execution of the code. Occasionally, the selected index does not exist in the array. This exception protects the application against a fatal error that could stop code interpretation.

These two groups of exceptions can be extended to describe their own errors. With the principle of segregating interfaces, it is possible to describe more precisely the errors that can occur when using a library. This makes it possible to know which component causes the error.

```php
<?php

class InvalidArgumentException extends \InvalidArgumentException implements ExceptionInterface
{
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Validator/Exception/InvalidArgumentException.php
```

Catch them at the right time
============================

It is tempting to catch any errors that may arise. But it is better to only catch the exceptions that the application is able to handle. Otherwise, it is better to let them spread to the highest level. With the use of a framework such as Symfony, an exception that is not caught in the application will be managed by the framework (and will display a nice page 500).

### Catch what is manageable

In a modern application, the code is stacked like Russian dolls. An exception thrown at a place, even in depth, will go up all the layers if it is not caught.

With this principle, the developer has the ability to control some of the exceptions that can be removed. If he can not manage them, he will let them spread in the upper layers.

Let's take an example for a manageable error. In my application, I need to contact an API to create a user or update it. I do not know in advance whether this user exists or not. I will first make a GET query to find out. The API returns either an error 404 to say that the user does not exist, or an error 200 otherwise. To make these queries, I use a library: [Guzzle](http://docs.guzzlephp.org/en/latest/). In the case of a 404, I have a [RequestException](https://github.com/guzzle/guzzle/blob/master/src/Exception/RequestException.php){:rel="nofollow"}.

```php
<?php
public function actionType($username)
{
    try {
        $user = $client->get(sprintf("/api/user/%s", $username));
    } catch (RequestException $e) {
        if (404 === $e->getResponse()->getStatusCode()) {
            return "create";
        }

        throw $e;
    }

    return "update";
}
```

In this example, I only manage the case of the 404. For the other types, I do not manage them, I re-throw the exception to let the other layers of the application manage it.

### Let the exception spread

As we have just seen in the previous example, I have managed only the exception I need. For the other cases, I let the exception spread so that it goes up in the highest layers.

An application is a nesting of components, which when assembled together make it possible to construct a functionality. An exception thrown at the component level, and therefore at the bottom of the application layer, does not make sense on its own. There is a functional set related to this exception. It is this functional chain that is able to take care of this exception. As in the previous example. It is the functionality that managed this exception, not the Guzzle component. The component only threw the exception to the top.

For a framework, such as Symfony, it's the same principle. If the developer does not know what to do with the exception, he will let it go up to a listener able to manage it. And at the top, there's this listener: [src\\Symfony\\Component\\HttpKernel\\EventListener\\ExceptionListener](https://github.com/guzzle/guzzle/blob/master/src/Exception/RequestException.php){:rel="nofollow"}.

To conclude
===========

An exception, as its name suggests, is an event that happens at an exceptional moment in the life of the application. It happens because an operation went wrong, or a developer misused a component. Whatever the reason is, the exception must be as explicit as possible. Its good understanding makes it possible to repair it as quickly as possible. It is important to lift the exception at the right time.

On the other hand, the exception should not be placed under the mat, but it should be handled properly. Good management of the exception requires a good understanding of the expected functionality and its perimeter. Catching all exceptions with a \`try {catch (\\ Exception $ e)\` is a very bad practice. This would mask an even more serious exception.

An exception well launched and managed correctly allows your application to be easily maintainable and makes the diagnosis of an error simpler and faster.

### Other post on same subject
* [PHP 7 Throwable Errors Exceptions](/en/fr/php7-throwable-error-exception/)

### References

-   http://wiki.c2.com/?ExceptionPatterns
-   http://www.phptherightway.com/\#exceptions
-   http://ralphschindler.com/2010/09/15/exception-best-practices-in-php-5-3
