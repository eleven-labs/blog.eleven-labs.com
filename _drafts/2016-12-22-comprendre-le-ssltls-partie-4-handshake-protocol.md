---
layout: post
title: 'Comprendre le SSL/TLS: Partie 4 Handshake Protocol'
author: ibenichou
date: '2016-12-22 11:15:59 +0100'
date_gmt: '2016-12-22 10:15:59 +0100'
categories:
- Non classé
tags: []
---

Les protocoles SSL / TLS peuvent être divisés en 2 couches.

La première couche est constituée par des protocoles de négociation (Handshake, Cipher, Alert) et la deuxième couche est le protocole Record.

L’image ci-dessous illustre les différentes couches :

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram.png)

## **Handshake Protocol :**

Traduit “poignée de main” en Français, ce protocole permet au serveur et au client de :

1.  s'authentifier mutuellement ;
2.  négocier :
    1.   les algorithmes de chiffrement ;
    2.  les algorithmes de MAC (Message Authentification Code) ; 
    3.  les clés symétriques qui vont servir au chiffrement  avant que l'application ne transmette son premier octet.

Voici en détails comment se déroule le handshake, dans l'ordre chronologique :

![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-1.png)

**1 - Client Hello**

Envoi de la version maximale supportée (SSL = 3.0), de la suite d'algorithmes supportés (par ordre de préférence décroissant) et une valeur aléatoire de 32 octets.

*Exemple :*

*Secure Socket Layer
    SSLv2 Record Layer: Client Hello
        Length: 103
        Handshake Message Type: Client Hello (1)
        Version: SSL 3.0 (0x0300)
        Cipher Spec Length: 78
        Session ID Length: 0
        Challenge Length: 16
        Cipher Specs (26 specs)
            Cipher Spec: SSL2\_RC4\_128\_WITH\_MD5 (0x010080)
            \[ more Cipher Specs deleted \]
        Challenge*

**2 - Server Hello**

Choix de la version de la suite d'algorithmes (Cipher Suite) et d'une valeur aléatoire.

*Exemple :*

Secure Socket Layer
    SSLv3 Record Layer: Handshake Protocol: Server Hello
        Content Type: Handshake (22)
        Version: SSL 3.0 (0x0300)
        Length: 74
        Handshake Protocol: Server Hello
            Handshake Type: Server Hello (2)
            Length: 70
            Version: SSL 3.0 (0x0300)
            Random
                gmt\_unix\_time: Apr 24, 2006 11:04:15.000000000
                random\_bytes: FE81ED93650288A3F8EB63860E2CF68DD00F2C2AD64FCD2D...
            Session ID Length: 32
            Session ID (32 bytes)
            Cipher Suite: TLS\_RSA\_WITH\_AES\_256\_CBC\_SHA (0x0035)
            Compression Method: null (0)

**3 - Certificate (optionnel)**

Envoi d'une chaîne de certificats par le serveur. Le premier certificat est celui du serveur, le dernier est celui de l'autorité de certification.

*Exemple :*

Secure Socket Layer
    SSLv3 Record Layer: Handshake Protocol: Certificate
        Content Type: Handshake (22)
        Version: SSL 3.0 (0x0300)
        Length: 836
        Handshake Protocol: Certificate
            Handshake Type: Certificate (11)
            Length: 832
            \[ Certificate details deleted \]

**4- Certificate Request (optionnel)**

Demande un certificat au client pour l'authentifier.

**5 - Server Key Exchange (optionnel)**

Message complémentaire pour l'échange des clés. Ce message contient la clé publique du serveur utilisée par le client pour chiffrer les informations de clé de session.

**6 - Server Hello Done**

Fin des émissions du serveur.

*Exemple :*

Secure Socket Layer
        SSLv3 Record Layer: Handshake Protocol: Server Hello Done
        Content Type: Handshake (22)
        Version: SSL 3.0 (0x0300)
        Length: 4
        Handshake Protocol: Server Hello Done
            Handshake Type: Server Hello Done (14)
            Length: 0

**7 - Certificate (optionnel)**

Certificat éventuel du client si le serveur demande une authentification.

**8 - Client Key Exchange**

Le client produit un secret pré-maître (encrypted pre-master key) et le crypte avec la clé publique du certificat du serveur. Ces informations sont chiffrées une deuxième fois avec la clé publique du serveur (et non la clé publique du certificat du serveur) reçue dans le message **Server Key Exchange** *(cf. étape 5)*.

*Exemple :*

Secure Socket Layer
    SSLv3 Record Layer: Handshake Protocol: Client Key Exchange
        Content Type: Handshake (22)
        Version: SSL 3.0 (0x0300)
        Length: 132
        Handshake Protocol: Client Key Exchange
            Handshake Type: Client Key Exchange (16)
            Length: 128

**9 - Certificate Verify (optionnel)**

Message contenant une empreinte (hash) signée numériquement et créée à partir des informations de clé et de tous les messages précédents. Ce message permet de confirmer au serveur que le client possède bien la clé privée correspondante au certificat client
*(cf. étape 7)*.

**10 - Change Cipher Spec**

Passage du client en mode chiffré avec la clé master comme clé symétrique.

*Exemple :*

Secure Socket Layer
    SSLv3 Record Layer: Change Cipher Spec Protocol: Change Cipher Spec
        Content Type: Change Cipher Spec (20)
        Version: SSL 3.0 (0x0300)
        Length: 1
        Change Cipher Spec Message

**11 - Client Finished**

Fin des émissions du client, ce message est chiffré à l'aide des paramètres de la suite de chiffrement.

*Exemple :*

Secure Socket Layer
    SSLv3 Record Layer: Handshake Protocol: Finished
        Content Type: Handshake (22)
        Version: SSL 3.0 (0x0300)
        Length: 64
        Handshake Protocol: Finished
            Handshake Type: Finished (20)
            Length: 36
            MD5 Hash
            SHA-1 Hash

**12 - Change Cipher Spec**

Passage du serveur en mode chiffré avec la clé master.

*Exemple :*

Secure Socket Layer
    SSLv3 Record Layer: Change Cipher Spec Protocol: Change Cipher Spec
        Content Type: Change Cipher Spec (20)
        Version: SSL 3.0 (0x0300)
        Length: 1
        Change Cipher Spec Message
    SSLv3 Record Layer: Handshake Protocol: Finished
        Content Type: Handshake (22)
        Version: SSL 3.0 (0x0300)
        Length: 64
        Handshake Protocol: Finished
            Handshake Type: Finished (20)
            Length: 36
            MD5 Hash
            SHA-1 Hash

**13 - Server Finished**

Confirmation au client du passage en mode chiffré. Ce message est chiffré à l'aide des paramètres de la suite de chiffrement.

**14 - Encrypted Data**

Le tunnel SSL / TLS est établi, c'est maintenant le **Record Protocol** qui prend le relais pour chiffrer les données.
