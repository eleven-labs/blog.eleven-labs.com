---
contentType: article
lang: fr
date: '2018-08-16'
slug: renforcer-confidentialite-api-sapient-bundle
title: Renforcer la confidentialité d'une API avec sapient-bundle
excerpt: >-
  Avec la popularisation et la simplicité de la mise en place du protocole
  HTTPS, la sécurisation de données sur internet apparaît comme à la portée de
  tous. Il reste néanmoins critique d’être conscient des failles qui existent
  encore. Avec libsodium, nous allons renforcer la confidentialité des échanges
  de données en toute simplicité.
oldCover: /assets/2018-08-16-renforcer-confidentialite-api-sapient-bundle/cover.jpg
categories:
  - php
authors:
  - tthuon
keywords:
  - bundle
  - symfony
  - security
  - confidentiality
  - api
  - libsodium
---

## Le web de tous les dangers
En tant que développeurs, la sécurisation de nos applications web est devenu un enjeu majeur. Dans un monde où la data vaut de de l’or, il est capital de la maintenir secrète. Let’s Encrypt, qui permet de générer des certificat SSL gratuitement, et Google qui augmente le ranking des sites sécurisés, ont favorisé la mise en place progressive du protocole HTTPS sur une bonne partie des applications web.

HTTPS permet de chiffrer le canal de transmission ainsi que son contenu indirectement. Mais il y a un maillon faible dans ce processus : l’autorité de certification. Cet organisme en charge de la fourniture des certificats peut être attaqué, et de faux certificats peuvent être générés pour détourner le trafic vers le serveur de l’attaquant.

Cette attaque est difficile à mettre en place et nécessite d’infecter l’autorité de certification, mais il a déjà été réalisé. Nous pouvons citer l’affaire Symantec.

Le développement des applications web en PHP est l’une des portes d’entrées des attaques. PHP a une mauvaise image en terme de résistance aux attaques.

Dans cet article, je vais vous présenter un exemple d’implémentation qui permettrait de contrer cette faille. Pour ce faire, nous utiliserons la librairie Sapient en PHP qui est basée sur la librairie cryptographique libsodium et nous l’intégrerons dans une application Symfony. Mais cette même démarche aurait pu être implémentée dans d’autres langages, toujours avec la libsodium.

## Présentation du bundle sapient

Depuis PHP 7.2, une nouvelle librairie cryptographique est directement intégrée au coeur de PHP : libsodium. Elle permet de remplacer la très vieille extension mcrypt. Elle se base sur une librairie qui n'est plus maintenue depuis 2007. Il reste l'extension openssl mais elle ne supporte pas les derniers algorithmes de chiffrement et de signature.

libsodium est à la base du [bundle sapient](https://github.com/lepiaf/sapient-bundle). Mais le bundle ne va pas utiliser directement les fonctions de cette libraire, elle va s'appuyer sur une autre : Sapient. Cette librairie intermédiaire va utiliser les fonctions libsodium et exposer des méthodes simples à utiliser. Il est donc possible de mettre en place notre cas d'usage en dehors de Symfony.

Le but de ce bundle est d'intégrer la librairie Sapient dans l'écosystème Symfony. Il permet de :
 - créer une paire de clef via une commande Symfony
 - configurer le bundle en YAML
 - utiliser des middlewares Guzzle et activables en une ligne de configuration

Il y a également des écouteurs Symfony pour déchiffrer et chiffrer les réponses directement. Dans le cas où vous avec des besoins avancés, la librairie Sapient est directement accessible en tant que service.

Comme vous pouvez le voir, ce bundle s'appuie sur les composants revus par des experts en cryptographie. Et comme le dit l'adage : "Don't roll your own crypto" (Ne faites pas votre propre crypto), sinon c'est la porte ouverte à tous les problèmes.

## Chiffrer et signer les réponses de l'API

Nous avons une API d'une banque A, et un client B qui souhaite consulter la quantité d'argent sur son compte. Le client B veut que les données de l'API soient chiffrées et signées, sinon elle les refuse. L'équipe de l'API A utilise Symfony 4 et va mettre en place ce chiffrement et la signature avec le bundle Sapient.

Pour l'installation, il existe une recette Symfony. Il suffit d'activer dans composer les recettes de dépôt contributeur.

```bash
composer config extra.symfony.allow-contrib true
```

Ensuite l'installation du bundle.

```bash
composer install lepiaf/sapient-bundle
```

La recette va vous inviter à créer la paire de clef. Il suffit de lancer la commande suivante et de copier-coller le contenu dans _config/packages/sapient.yml_

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

Répéter l'opération avec le client B.

Nous avons maintenant l'API A et le client B configurés. Comme nous utilisons un chiffrement asymétrique, il faut échanger les clefs publiques. Pour rappel, API A va chiffrer et signer la réponse pour le client B. Il a donc besoin de la clef publique de client B pour chiffrer le contenu. Seul client B, qui détient la clef privée, pourra déchiffrer le contenu. Pour la signature, l'API A va diffuser sa clef publique. Cela va permettre a client B d'authentifier la réponse d'API A.

Pour résumer, API A donne sa clef publique à client B, client B donne sa clef publique à API A.

Ci-dessous la configuration de l'API A
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

Ci-dessous la configuration du client B
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

La clef publique de client B est installée dans la partie _sealing_public_keys_ (clef publique de scellement). C'est cette clef qui va être utilisée pour chiffrer le contenu. Côté client B, la clef publique d'API A est installée dans la partie _verifying_public_keys_ (clef publique de vérification). Comme son nom l'indique, c'est la clef publique d'API A qui permet de vérifier que la réponse provient bien d'API A.

Ainsi, si la couche TLS (couche 6 du modèle OSI) est compromise, le contenu situé au niveau applicatif (couche 7 du modèle OSI) est chiffré et ne peut pas être compréhensible par l'attaquant.

Exemple de réponse de l'API A.

```bash
HTTP/1.1 200 OK
Host: api-a:8000
content-type: application/json
Body-Signature-Ed25519: 6sHYDSKwx05QNDe-s2a1tBXxKw2JZxLZwUBpLojEQpqzcGEU1XcaqdaG9_FQTbVkeSa_25vSak8MJcZ8RaoaAg==
Sapient-Signer: api-a

q6KSHArUnD0sEa-KWpBCYLka805gdA6lVG2mbeM9kq82_

```

Il y a une en-tête avec la signature de la réponse. Client B va lire cet en-tête. Ensuite, le corps de la réponse est déchiffré.

Il est possible de pousser ce cas d'usage plus loin avec le chiffrement et la signature des requêtes envoyés par le client B. Ainsi, seule l'API A est en mesure de comprendre les requêtes. Cet exemple est disponible dans la [documentation](https://sapient-bundle.readthedocs.io/en/latest/configuration.html#sign-and-seal-request).

## Conclusion

Le bundle s'installe et se configure simplement. Il rend accessible un domaine jusque là réservé à des personnes expérimentées. L'introduction d'une librairie cryptographique dans le coeur de PHP rend le langage plus fort. Cela va permettre de sécuriser davantage les applications présentes et futures, et effacer petit à petit cette image de langage plein de trous de sécurité.

La sécurité et la protection des données doivent être au coeur du métier de développeur. Avec ce bundle, votre application passe à un niveau de sécurité supplémentaire tout en étant simple à mettre en oeuvre.

## Focus sur le processus chiffrement et signature

L'une des forces de la librairie Sapient est de reposer sur un composant de sécurité intégré au coeur de PHP et d'avoir déjà été audité : libsodium. Ce composant expose les algorithmes les plus robustes à ce jour : Ed25519, XChaCha20-Poly1305, X25519, BLAKE2b, HMAC-SHA512-256.

La libraire Sapient va utiliser et assembler plusieurs méthodes pour n'en former qu'une avec un but précis.

Dans l'exemple plus haut, l'API A va chiffrer et signer la réponse.

Pour la signature, l'algorithme est Ed25519. Le processus est assez simple car il prend le corps du message et applique la fonction de signature avec la clef privée d'API A. Cette signature est ensuite attachée à l'en-tête de la réponse PSR-7. Cette étape de signature permet de s'assurer de l'expéditeur du message. Le client B doit rejeter le message si la signature est incorrecte.

Pour le chiffrement, le processus est un peu plus complexe. Un des pré-requis est la confidentialité persistence (_forward secrecy_). Sans cette fonctionnalité, si un attaquant vient à enregistrer les échanges et parvient à dérober la clef privée (par exemple via un commit github), il pourra déchiffrer tous les messages. C'est ce qui est reproché au protocole PGP.

Pour contrer ce problème, il faut créer des clefs éphémères. Elles sont uniques à chaque message.

Il est possible de décomposer le processus de cette façon :
 - un objet _Response_ PSR-7 est créé
 - il passe dans la fonction de chiffrement
 - une paire de clefs asymétriques est créée avec l'algorithme X25519
 - un nonce est également créé
 - un échange de clefs est effectué pour obtenir une clef partagée avec l'algorithme X25519
 - cette clef passe dans une fonction de hash BLAKE2b pour assurer l'intégrité de la clef partagée
 - le corps de la réponse est chiffré avec cette clef partagée en utilisant l'algorithme XChaCha20-Poly1305
 - la clef publique éphémère est concaténée avec le corps de la réponse chiffrée
 - le tout est de nouveau encapsulé dans un objet _Response_ PSR-7

Ensuite côté client B, le processus inverse est effectué :
 - un objet _Response_ PSR-7 est créé
 - il passe dans la fonction de déchiffrement
 - la clef publique éphémère est détachée du corps de la réponse
 - un nonce est également créé
 - un échange de clefs est effectué pour obtenir une clef partagée avec l'algorithme X25519
 - le corps de la réponse est déchiffré avec cette clef partagée en utilisant l'algorithme XChaCha20-Poly1305
 - le message déchiffré est de nouveau encapsulé dans un objet _Response_ PSR-7

Lors du déchiffrement, l'algorithme vérifie que le message n'a pas été altéré. Si c'est le cas, une exception _\SodiumException_ est levée avec le message _Invalid MAC_ (MAC = Message Authenticated Cipher).

Ce focus permet de mieux comprendre le fonctionnement de la libraire ainsi que le but de chaque algorithme.

### Référence
- [sapient-bundle](https://github.com/lepiaf/sapient-bundle)
- [Documentation du bundle sapient](https://sapient-bundle.readthedocs.io/en/latest/index.html)
- [OpenSSL algorithme signature](http://php.net/manual/fr/openssl.signature-algos.php)
- [OpenSSL algorithme chiffrement](http://php.net/manual/fr/openssl.ciphers.php)
- [Mcrypt is Abandonware](https://paragonie.com/blog/2015/05/if-you-re-typing-word-mcrypt-into-your-code-you-re-doing-it-wrong)
- [RFC libsodium](https://wiki.php.net/rfc/libsodium)
- [Google takes Symantec to the woodshed for mis-issuing 30,000 HTTPS certs](https://arstechnica.com/information-technology/2017/03/google-takes-symantec-to-the-woodshed-for-mis-issuing-30000-https-certs/)
- [Final Report on DigiNotar Hack Shows Total Compromise of CA Servers](https://threatpost.com/final-report-diginotar-hack-shows-total-compromise-ca-servers-103112/77170/)
- [Des certificats D-Link détournés pour signer des malwares](https://www.nextinpact.com/brief/des-certificats-d-link-detournes-pour-signer-des-malwares-4865.htm?utm_source=dlvr.it&utm_medium=twitter&utm_campaign=lebrief)
- [Confidentialité persistante](https://fr.wikipedia.org/wiki/Confidentialit%C3%A9_persistante)

