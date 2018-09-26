---
layout: post
title: "Enhance confidentiality of an API with sapient-bundle"   
lang: en
permalink: /en/enhance-confidentiality-api-sapient-bundle/  
excerpt: "With the popularization and the simplicity of the implementation of the HTTPS protocol, securing data on the internet seems like everyone can reach. It is important to be aware of flaws that still exist. With libsodium, we will enhance the confidentiality of data exchange with simplicity."
authors:  
    - tthuon  
categories:
    - php
    - bundle
    - symfony
    - security
tags:
    - php
    - bundle
    - symfony
    - security
    - confidentiality
    - api
    - libsodium
cover: /assets/2018-08-16-renforcer-confidentialite-api-sapient-bundle/cover.jpg
---

## The web of all dangers
As developers, securing our web applications has become a major issue. In a world where data is worth gold, it is important to keep it secret. Let's Encrypt, which generates SSL certificates for free, and Google, which increases the ranking of secure sites, have favored the progressive implementation of the HTTPS protocol on a major part of the web applications.

HTTPS encrypts the transmission channel and its content indirectly. But there is one weak link in this process: the certification authority. This organization in charge of providing certificates can be attacked, and fake certificates can be generated to divert traffic to the attacker's server.

This attack is difficult to implement and needs to infect the CA, but it has already been done. We can mention the Symantec case.

The development of web applications in PHP is one of the gateways to attacks. PHP has a bad image in terms of resistance to attacks.

In this article, I will present an example of an implementation that would help to counter this flaw. To do this, we will use the Sapient library in PHP which is based on the libsodium cryptographic library and we will integrate it into a Symfony application. But this same approach could have been done in other languages, always with libsodium.

## Presentation of the Sapient bundle

Since PHP 7.2, a new cryptographic library is directly integrated in the core of PHP: libsodium. It replaces the very old mcrypt extension. Mcrypt is based on a library that is no longer maintained since 2007. It remains openssl extension but it does not support the latest encryption and signature algorithms.

libsodium is at the foundation of the [sapient bundle](https://github.com/lepiaf/sapient-bundle). But the bundle will not directly use the functions of this library, it will rely on another: Sapient. This intermediate library will use libsodium functions and expose simple methods to use. It is therefore possible to set up our use case outside of Symfony.

The purpose of this bundle is to integrate the Sapient library into the Symfony ecosystem. It allows to:
 - create a key pair via a Symfony command
 - configure the bundle in YAML
 - use Guzzle middleware and can be activated in one configuration line

There are also Symfony listeners to decrypt and encrypt the response directly. In case you have advanced needs, the Sapient library is directly accessible as a service.

As you can see, this bundle is based on components reviewed by experts in cryptography. And as they said: "Do not roll your own crypto".

## Encrypt and sign API response

We have an API of bank A, and a customer B who wants to consult the amount of money on his account. Client B wants the API data to be encrypted and signed, otherwise it denies them. The API A team uses Symfony 4 and will implement this encryption and signature with the Sapient bundle.

For installation, there is a Symfony recipe. Simply activate in composer contributor repository receipts.

```bash
composer config extra.symfony.allow-contrib true
```

Then, installation of the bundle.

```bash
composer install lepiaf/sapient-bundle
```

The recipe will invite you to create the key pair. Just run the following command and copy and paste the contents into _config/packages/sapient.yml_

```yaml
sapient:
    sign:
        public: 'G3zo5Zub2o-eyp-g3GYb9JXEzdtIqmFdDOvU5PV6hBk='
        private: 'giP81DlS_R3JL4-UnSVbn2I5lm9abv8vA7aLuEdOUB4bfOjlm5vaj57Kn6DcZhv0lcTN20iqYV0M69Tk9XqEGQ=='
        host: 'api-a'
    seal:
        public: 'tquhje8C_hNdd85R-CzVq7n7MOLqc5h11GJv7Vo7fgc='
        private: 'NoxnlCvhxl8NRfCgIhuxm95IE1Y9QFUHMuvDkrWrnQ4='
    sealing_public_keys: ~
    verifying_public_keys: ~
```

Repeat the operation with client B.

We now have API A and Client B configured. As we use asymmetric encryption, we need to exchange public keys. As a reminder, API A will encrypt and sign the response for client B. It needs the client B public key to encrypt the content. Only customer B, who has the private key, will be able to decrypt the content. For signing, API A will broadcast its public key. This will allow client B to authenticate the API response A.

To summarize, API A gives its public key to client B, client B gives its public key to API A.

Below is the configuration of API A

```yaml
sapient:
    sign:
        public: 'G3zo5Zub2o-eyp-g3GYb9JXEzdtIqmFdDOvU5PV6hBk='
        private: 'giP81DlS_R3JL4-UnSVbn2I5lm9abv8vA7aLuEdOUB4bfOjlm5vaj57Kn6DcZhv0lcTN20iqYV0M69Tk9XqEGQ=='
        host: 'api-a'
    seal:
        public: 'tquhje8C_hNdd85R-CzVq7n7MOLqc5h11GJv7Vo7fgc='
        private: 'NoxnlCvhxl8NRfCgIhuxm95IE1Y9QFUHMuvDkrWrnQ4='
    sealing_public_keys: 
      -
        host: 'client-b'
        key: 'M2SMMPHg9NOXoX3NgzlWY8iTheyu8qSovnTZpAlIGB0='
    verifying_public_keys: ~
```

Below the configuration of client B

```yaml
    sapient:
        sign:
            public: 'aO8pIZYoGUrPOSJFC1UfH-XE7M19xC-LP-tZwukwFqI='
            private: 'nnr3sTDvLfDHtw6suup3LlNh2YYCCCcXvksDpIp5VHVo7ykhligZSs85IkULVR8f5cTszX3EL4s_61nC6TAWog=='
            host: 'client-b'
        seal:
            public: 'M2SMMPHg9NOXoX3NgzlWY8iTheyu8qSovnTZpAlIGB0='
            private: 'FzyiZAbEuquHUXt-YNF6WOXFB6CVBpyz2ocMMaT0FK8='
        guzzle_middleware:
            verify: true
            unseal: true
            requester_host: 'client-bob'
        sealing_public_keys: ~
        verifying_public_keys:
            -
                key: 'G3zo5Zub2o-eyp-g3GYb9JXEzdtIqmFdDOvU5PV6hBk='
                host: 'api-a'
```

The client B public key is installed in the _sealing_public_keys_ (public key sealing) part. This key will be used to encrypt the content. On client side B, the API A public key is installed in the _verifying_public_keys_ (public key verification) part. As its name indicates, it is the API A public key which makes it possible to verify that the response comes from API A.

Thus, if the TLS layer (layer 6 of the OSI model) is compromised, the content at the application level (layer 7 of the OSI model) is encrypted and can not be understood by the attacker.

Sample response from API A.

```bash
HTTP/1.1 200 OK
Host: api-a:8000
content-type: application/json
Body-Signature-Ed25519: 6sHYDSKwx05QNDe-s2a1tBXxKw2JZxLZwUBpLojEQpqzcGEU1XcaqdaG9_FQTbVkeSa_25vSak8MJcZ8RaoaAg==
Sapient-Signer: api-a

q6KSHArUnD0sEa-KWpBCYLka805gdA6lVG2mbeM9kq82_

```

There is a header with the signature of the response. Client B will read this header. Then the body of the answer is decrypted.

It is possible to push this use case further with the encryption and signature of the requests sent by the client B. Thus, only the API A is able to understand the requests. This example is available in the [documentation](https://sapient-bundle.readthedocs.io/en/latest/configuration.html#sign-and-seal-request).

## Conclusion

The bundle installs and configures itself easily. It makes security domain more accessible to less experienced people. The introduction of a cryptographic library in the core of PHP makes the language stronger. This will further secure current and future applications, and gradually erase this language image full of security holes.

Security and data protection must be at the core of the developer's job. With this bundle, your application goes to an extra level of security while being simple to implement.

## Focus on the encryption and signature process

One of the strengths of the Sapient library is to rely on a built-in security component at the core of PHP and have already been audited: libsodium. This component exposes the most robust algorithms so far: Ed25519, XChaCha20-Poly1305, X25519, BLAKE2b, HMAC-SHA512-256.

The library Sapient will use and assemble several methods to form one with a specific purpose.

In the example above, API A will encrypt and sign the response.

For signature, the algorithm is Ed25519. The process is quite simple because it takes the body of the message and applies the signature function with the private key of API A. This signature is then attached to the header of the PSR-7 response. This signing step ensures the sender authenticity of the message. Client B must reject the message if the signature is incorrect.

For encryption, the process is a bit more complex. One of the prerequisites is the _forward secrecy_. Without this feature, if an attacker record the exchanges and manages to steal the private key (for example via a github commit), he will be able to decrypt all previous and futur messages. This is what is criticized for the PGP protocol.

To counter this problem, you need to create an ephemeral keys. They are unique for each message.

It is possible to break down the process this way:
 - a _Response_ PSR-7 object is created
 - it goes into the encryption function
 - a pair of asymmetric keys is created with the algorithm X25519
 - a nonce is also created
 - an exchange of keys is done to obtain a shared key with the X25519 algorithm 
 - this key goes into a BLAKE2b hash function to ensure the integrity of the shared key
 - the body of the response is encrypted with this shared key using the algorithm XChaCha20-Poly1305
 - the ephemeral public key is concatenated with the body of the encrypted response
 - everything is encapsulated again in a _Response_ object PSR-7

Then client side B, the reverse process is performed:
 - a _Response_ PSR-7 object is created
 - it goes into the decryption function
 - the ephemeral public key is detached from the body of the answer
 - a nonce is also created
 - an exchange of keys is done to obtain a key shared with the X25519 algorithm 
 - the body of the response is decrypted with this shared key using the XChaCha20-Poly1305 algorithm
 - the decrypted message is encapsulated again in a _Response_ object PSR-7
   
During decryption, the algorithm verifies that the message has not been tampered. If this is the case, a _\SodiumException_ exception is raised with the message _Invalid MAC_ (MAC = Message Authenticated Cipher).

This focus allows a better understanding of the operation in the library and the purpose of each algorithm.

### Reference
- [sapient-bundle](https://github.com/lepiaf/sapient-bundle)
- [Documentation of sapient bundle](https://sapient-bundle.readthedocs.io/en/latest/index.html)
- [OpenSSL signature algorithme](http://php.net/manual/en/openssl.signature-algos.php)
- [OpenSSL ciphers](http://php.net/manual/en/openssl.ciphers.php)
- [Mcrypt is Abandonware](https://paragonie.com/blog/2015/05/if-you-re-typing-word-mcrypt-into-your-code-you-re-doing-it-wrong)
- [RFC libsodium](https://wiki.php.net/rfc/libsodium)
- [Google takes Symantec to the woodshed for mis-issuing 30,000 HTTPS certs](https://arstechnica.com/information-technology/2017/03/google-takes-symantec-to-the-woodshed-for-mis-issuing-30000-https-certs/)
- [Final Report on DigiNotar Hack Shows Total Compromise of CA Servers](https://threatpost.com/final-report-diginotar-hack-shows-total-compromise-ca-servers-103112/77170/)
- [Des certificats D-Link détournés pour signer des malwares](https://www.nextinpact.com/brief/des-certificats-d-link-detournes-pour-signer-des-malwares-4865.htm?utm_source=dlvr.it&utm_medium=twitter&utm_campaign=lebrief)
- [Forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy)

