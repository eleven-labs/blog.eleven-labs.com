---
layout: post
title: Upgrade password hashes in Symfony application
lang: en
permalink: /en/upgrade-password-hashes-symfony-application/
excerpt: "In IT, password is everywhere and it is used for anything. Problem: technology evolve and and the way how application store it should evolve. But sometime, there is an application which is stuck in past by storing password hash in md5."
authors:
    - tthuon
categories:
    - php
    - security
    - symfony
tags:
    - php
    - security
    - symfony
    - password
    - hash
cover: /assets/2018-09-27-upgrade-password-hashes-symfony/cover.jpg
---

## Y u no how to store password?

Let's start with beginning. Password is a secret that a user and an application share. It is a common way to authenticate a user for
a protected part of an application. From application side, we could store it in plain text in database. But if database is leaked, all 
password available and we can do more damage to all users in this database. 

To avoid this issue, you have to calculate an hash that represent the password. An hash function can only do this calculation in one way. 
It is not possible to revert an hash to it's original string. We know MD5 and SHA-1. They were used since the begin of web application.

Problem: Security researcher found weakness. They are breakable and insecure. You can found a lot of article around this topic.

## My application still use SHA-1, what should I do?

This topic must be taken seriously. This last year, we saw major database leaked, even from big corporation with tons of personal data and password.

First thing to do is to migrate password hashes to a more secure one. Today we have Argon2, bcrypt, scrypt or pbkdf2. They are slow but built
for the purpose: make cracking really hard.

I started this blog post after reading this one https://www.michalspacek.com/upgrading-existing-password-hashes. It is a good starting point 
to understand how to process in general.

In this post, I will show you how to upgrade password hashes in Symfony application.

## Create a custom encoder

Symfony has built-in encoder, but here we will create a custom one. We want to migrate progressively each user. When a user log-in to 
the application, the encoder will check if user has been migrated. If not, it will re-encode password with new hash function, then store it to database. 
For user, it is totally transparent.

For this example, we will assume we are in Symfony 3.4 and PHP 7.2. It can also work for any Symfony version and PHP version.

Custom encoder must implement `Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface`.

```php
<?php

namespace AppBundle\Security\Encoder;

use Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface;

class UpgradePasswordEncoder implements PasswordEncoderInterface
{
    public function isPasswordValid($encoded, $raw, $salt)
    {
        return password_verify($raw, $encoded);
    }
    
    public function encodePassword($raw, $salt) 
    {
        return password_hash($raw, \PASSWORD_ARGON2I);    
    }
}

```
