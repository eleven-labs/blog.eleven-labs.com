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

<span style="font-weight: 400;">Les protocoles SSL / TLS peuvent être divisés en 2 couches.</span>

<span style="font-weight: 400;">La première couche est constituée par des protocoles de négociation (Handshake, Cipher, Alert) et la deuxième couche est le protocole Record.</span>

<span style="font-weight: 400;">L’image ci-dessous illustre les différentes couches :</span>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram.png"><img class="size-medium wp-image-2877 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-300x233.png" alt="" width="300" height="233" /></a>

#### **Handshake Protocol :**
<span style="font-weight: 400;">Traduit “poignée de main” en Français, </span><span style="font-weight: 400;">ce protocole permet au serveur et au client de : </span>

<ol>
<li><span style="font-weight: 400;">s'authentifier mutuellement ;</span></li>
<li><span style="font-weight: 400;">négocier :</span>
<ol>
<li><span style="font-weight: 400;"> les algorithmes de chiffrement ;</span></li>
<li><span style="font-weight: 400;">les algorithmes de MAC </span><span style="font-weight: 400;">(Message Authentification Code) ; </span></li>
<li><span style="font-weight: 400;">les clés symétriques qui vont servir au chiffrement  avant que l'application ne transmette son premier octet.</span></li>
</ol>
</li>
</ol>
<span style="font-weight: 400;">Voici en détails comment se déroule le handshake, dans l'ordre chronologique :</span>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-1.png"><img class="size-medium wp-image-2878 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-1-300x165.png" alt="" width="300" height="165" /></a>

**1 - Client Hello**

<span style="font-weight: 400;">Envoi de la version maximale supportée (SSL = 3.0), de la suite d'algorithmes supportés (par ordre de préférence décroissant) et une valeur aléatoire de 32 octets.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<i><span style="font-weight: 400;">Secure Socket Layer</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">    SSLv2 Record Layer: Client Hello</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Length: 103</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Handshake Message Type: Client Hello (1)</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Cipher Spec Length: 78</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Session ID Length: 0</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Challenge Length: 16</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Cipher Specs (26 specs)</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">            Cipher Spec: SSL2_RC4_128_WITH_MD5 (0x010080)</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">            [ more Cipher Specs deleted ]</span></i><i><span style="font-weight: 400;"><br />
</span></i><i><span style="font-weight: 400;">        Challenge</span></i>

**2 - Server Hello**

<span style="font-weight: 400;">Choix de la version de la suite d'algorithmes (Cipher Suite) et d'une valeur aléatoire.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Handshake Protocol: Server Hello</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Handshake (22)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 74</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Handshake Protocol: Server Hello</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Handshake Type: Server Hello (2)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Length: 70</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Random</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">                gmt_unix_time: Apr 24, 2006 11:04:15.000000000</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">                random_bytes: FE81ED93650288A3F8EB63860E2CF68DD00F2C2AD64FCD2D...</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Session ID Length: 32</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Session ID (32 bytes)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA (0x0035)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Compression Method: null (0)</span>

**3 - Certificate (optionnel)**

<span style="font-weight: 400;">Envoi d'une chaîne de certificats par le serveur. Le premier certificat est celui du serveur, le dernier est celui de l'autorité de certification.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Handshake Protocol: Certificate</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Handshake (22)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 836</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Handshake Protocol: Certificate</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Handshake Type: Certificate (11)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Length: 832</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            [ Certificate details deleted ]</span>

**4- Certificate Request (optionnel)**

<span style="font-weight: 400;">D</span><span style="font-weight: 400;">emande un certificat au client pour l'authentifier.</span>

**5 - Server Key Exchange (optionnel)**

<span style="font-weight: 400;">Message complémentaire pour l'échange des clés. Ce message contient la clé publique du serveur utilisée par le client pour chiffrer les informations de clé de session.</span>

**6 - Server Hello Done**

<span style="font-weight: 400;">Fin des émissions du serveur.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        SSLv3 Record Layer: Handshake Protocol: Server Hello Done</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Handshake (22)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 4</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Handshake Protocol: Server Hello Done</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Handshake Type: Server Hello Done (14)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Length: 0</span>

**7 - Certificate (optionnel)**

<span style="font-weight: 400;">Certificat éventuel du client si le serveur demande une authentification.</span>

**8 - Client Key Exchange**

<span style="font-weight: 400;">Le client produit un secret pré-maître (encrypted pre-master key) et le crypte avec la clé publique du certificat du serveur. Ces informations sont chiffrées une deuxième fois avec la clé publique du serveur (et non la clé publique du certificat du serveur) reçue dans le message </span>**Server Key Exchange **<i><span style="font-weight: 400;">(cf. étape 5)</span></i><span style="font-weight: 400;">.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Handshake Protocol: Client Key Exchange</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Handshake (22)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 132</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Handshake Protocol: Client Key Exchange</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Handshake Type: Client Key Exchange (16)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Length: 128</span>

**9 - Certificate Verify (optionnel)**

<span style="font-weight: 400;">Message contenant une empreinte (hash) signée numériquement et créée à partir des informations de clé et de tous les messages précédents. Ce message permet de confirmer au serveur que le client possède bien la clé privée correspondante au certificat client </span><span style="font-weight: 400;"><br />
</span><i><span style="font-weight: 400;">(cf. étape 7)</span></i><span style="font-weight: 400;">.</span>

**10 - Change Cipher Spec**

<span style="font-weight: 400;">Passage du client en mode chiffré avec la clé master comme clé symétrique.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Change Cipher Spec Protocol: Change Cipher Spec</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Change Cipher Spec (20)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 1</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Change Cipher Spec Message</span>

**11 - Client Finished**

<span style="font-weight: 400;">Fin des émissions du client, ce message est chiffré à l'aide des paramètres de la suite de chiffrement.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Handshake Protocol: Finished</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Handshake (22)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 64</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Handshake Protocol: Finished</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Handshake Type: Finished (20)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Length: 36</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            MD5 Hash</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            SHA-1 Hash</span>

**12 - Change Cipher Spec**

<span style="font-weight: 400;">Passage du serveur en mode chiffré avec la clé master.</span>

<i><span style="font-weight: 400;">Exemple :</span></i>

<span style="font-weight: 400;">Secure Socket Layer</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Change Cipher Spec Protocol: Change Cipher Spec</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Change Cipher Spec (20)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 1</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Change Cipher Spec Message</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">    SSLv3 Record Layer: Handshake Protocol: Finished</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Content Type: Handshake (22)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Version: SSL 3.0 (0x0300)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Length: 64</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">        Handshake Protocol: Finished</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Handshake Type: Finished (20)</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            Length: 36</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            MD5 Hash</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">            SHA-1 Hash</span>

**13 - Server Finished**

<span style="font-weight: 400;">Confirmation au client du passage en mode chiffré. Ce message est chiffré à l'aide des paramètres de la suite de chiffrement.</span>

**14 - Encrypted Data**

<span style="font-weight: 400;">Le tunnel SSL / TLS est établi, c'est maintenant le </span>**Record Protocol**<span style="font-weight: 400;"> qui prend le relais pour chiffrer les données.</span>


