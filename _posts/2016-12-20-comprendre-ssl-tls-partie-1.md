---
layout: post
title: "Comprendre le SSL/TLS : Partie 1 On parle de quoi ?"
excerpt: "Vous avez sans doute entendu parler des protocoles SSL ou TLS, non, oui ?"
permalink: /fr/comprendre-ssl-tls-partie-1/
author: ibenichou
date: '2016-12-20 10:07:16 +0100'
date_gmt: '2016-12-20 09:07:16 +0100'
categories:
    - TLS
    - SSL
tags:
    - sécurité
    - SSL
    - TLS
    - Algorithmie
    - Protocoles
image:
    path: /assets/2016-12-20-comprendre-ssl-tls-partie-1/SSL-splash.png
    height: 100
    width: 100
---


Vous avez sans doute entendu parler des **protocoles** **SSL** ou **TLS**, non, oui ?
Nous allons voir ensemble de quoi il s’agit.

Pour cela, nous allons découper cet article en 5 parties, une postée chaque jour jusqu'à vendredi.

* On parle de quoi ?
* Chiffrement
* Certificats
* Handshake Protocol
* Record Protocol

Tout d'abord un peu d'historique : attachez vos ceintures, en route pour la partie 1 !

# On parle de quoi ?

SSL et TLS sont des protocoles de sécurisation des données.

Ils se comportent comme une couche intermédiaire supplémentaire entre la couche Transport (TCP) et la couche application (HTTP, FTP, SMTP etc.. ) (cf. schéma).

Cela signifie donc qu'ils peuvent aussi bien être employés pour sécuriser une transaction web que pour l'envoi ou la réception d'email, etc…

Jusqu’ici tout va bien !

SSL et TLS sont donc transparents pour l'utilisateur et ne nécessitent pas l'emploi de protocole de niveau d'application spécifique.

*Modèle OSI avec le SSL/TLS*

<img src="../../assets/2016-12-20-comprendre-ssl-tls-partie-1/tls-in-osi.png" />

*En clair:*

Les protocoles SSL et TLS  permettent d'échanger des informations entre deux ordinateurs de façon sûre.

Ils sont censés assurer les 3 points suivants:

* **Confidentialité** : il est impossible d'espionner les informations échangées. Le client et le serveur doivent avoir l'assurance que leur conversation ne pourra pas être écoutée par un tiers. Cette fonctionnalité est assurée par un **algorithme de chiffrement**.
* **Intégrité** : il est impossible de truquer les informations échangées. Le client et le serveur doivent pouvoir s'assurer que les messages transmis ne sont ni tronqués ni modifiés (intégrité), qu'ils proviennent bien de l'expéditeur attendu. Ces fonctionnalités sont assurées par la **signature des données**.
* **Authentification** : ce point permet de s'assurer de l'identité du programme, de la personne ou de l'entreprise avec laquelle on communique. Depuis SSL 3.0, le serveur peut aussi demander au client de s'authentifier. Cette fonctionnalité est assurée par l'emploi de **certificats**.

Les protocoles SSL et TLS reposent donc sur la combinaison de plusieurs concepts cryptographiques, exploitant à la fois le chiffrement **asymétrique** et le chiffrement **symétrique** (nous allons voir ces notions dans la partie chiffrement).

De plus, ces protocoles se veulent évolutifs,  indépendants des algorithmes de cryptage et d'authentification mis en oeuvre dans une transaction. Cela leur permet de s'adapter aux besoins des utilisateurs et d’avoir une meilleure sécurité puisque ces protocoles ne sont pas soumis aux évolutions théoriques de la cryptographie (si un chiffrement devient obsolète, le protocole reste exploitable en choisissant un chiffrement plus sûr).

**Histoire** :

**A - SSL** :

SSL signifie **Secure Socket Layer**.

* Développée par Netscape en **1994**, la version **1.0** reste en interne et n'est jamais mis en œuvre ;
* La première version de SSL réellement utilisée est la version **2.0** sortie en **février 1995**.
Il s'agit également la première implémentation de SSL bannie, en mars 2011 ([RFC 617](https://tools.ietf.org/html/rfc6176)) ;
* En **novembre 1996** SSL sort sa version **3.0**, la dernière version de SSL, qui inspirera son successeur **TLS**. Ses spécifications sont rééditées en août 2008 dans la [RFC 610](https://tools.ietf.org/html/rfc6101).
Le protocole est banni en 2014, à la suite de la publication de la faille [POODLE](https://fr.wikipedia.org/wiki/POODLE), ce bannissement est définitivement ratifié en juin 2015 ([RFC 7568](https://tools.ietf.org/html/rfc7568)).

**B - TLS** :

TLS signifie **Transport Layer Security**.

Le développement de ce protocole a été repris par l'[IETF](https://www.ietf.org/).

Le protocole TLS n'est pas structurellement différent de la version 3 de SSL, mais des modifications dans l'utilisation des fonctions de hachage font que les deux protocoles ne sont pas directement "interopérables".

Cependant TLS, comme SSLv3, intègre un mécanisme de compatibilité ascendante avec les versions précédentes, c'est-à-dire qu'au début de la phase de **négociation**, le client et le serveur négocient la «meilleure » version du protocole disponible en commun. Pour des raisons de sécurité (mentionnées plus haut), la compatibilité de TLS avec la version 2 de SSL est abandonnée.

Ce qui différencie aussi le TLS du SSL c’est que la génération des **clés symétriques** est un peu plus sécurisée dans TLS que dans SSLv3, dans la mesure où aucune étape de l'algorithme ne repose uniquement sur du MD5 (pour lequel sont apparues des faiblesses en [cryptanalyse](https://fr.wikipedia.org/wiki/Cryptanalyse)).

* En **janvier 1993** : IETF publie la norme **TLS 1.0**. Plusieurs améliorations lui sont apportées par la suite :
    * Octobre 1999 [RFC 2712](https://tools.ietf.org/html/rfc2712) : Ajout du protocole [Kerberos](https://fr.wikipedia.org/wiki/Kerberos_(protocole)) à TLS
    * Mai 2000 ([RFC 2817](https://tools.ietf.org/html/rfc2817) et [RFC 2818](https://tools.ietf.org/html/rfc2818)) : Passage à TLS lors d'une session HTTP 1.1
    * Juin 2002 ([RFC 3268](https://tools.ietf.org/html/rfc3268)) : Support du système de chiffrement [AES](https://fr.wikipedia.org/wiki/Standard_de_chiffrement_avanc%C3%A9) par TLS
* Avril 2006 ([RFC 4346](https://tools.ietf.org/html/rfc4346)) : Publication de la norme **TLS 1.1**.
* Août 2008 ([RFC 5246](https://tools.ietf.org/html/rfc5246)) : Publication de la norme **TLS 1.2**.
* Mars 2011 ([RFC 6176](https://tools.ietf.org/html/rfc6176)) : Abandon de la compatibilité avec SSLv2 pour toutes les versions de TLS.
* Avril 2014 : 1er brouillon pour **TLS 1.3**.
* Juin 2015 ([RFC 7568](https://tools.ietf.org/html/rfc7568)) : Abandon de la compatibilité avec SSLv2 et SSLv3.
* Octobre 2015 : Nouveau brouillon de **TLS 1.3**

**Navigateurs** :

La plupart des navigateurs web gèrent TLS 1.0. Les navigateurs supportant par défaut la dernière version TLS 1.1 et TLS 1.2 sont :
* Apple Safari 7 et suivants ;
* Google Chrome et Chromium 30 et suivants ;
* Microsoft Internet Explorer 11 et suivants ;
* Mozilla Firefox 27 et suivants ;
* Opera 17 et suivants.
* Microsoft Edge

Bon j’espère que j’en ai pas perdu en chemin car c’est maintenant qu’on passe aux choses sérieuses.
