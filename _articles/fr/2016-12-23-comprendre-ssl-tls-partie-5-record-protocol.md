---
contentType: article
lang: fr
date: '2016-12-23'
slug: comprendre-ssl-tls-partie-5-record-protocol
title: 'Comprendre le SSL/TLS: Partie 5 Record Protocol'
excerpt: Record protocol
categories: []
authors:
  - ibenichou
keywords:
  - tls
  - ssl
  - securite
  - algorithmie
  - protocoles
---

# Record protocol

Ce protocole a pour buts :
* **Encapsulation**  - permet aux données SSL / TLS d'être transmises et reconnues sous une forme homogène ;
* **Confidentialité** - assure que le contenu du message ne peut pas être lu par un tiers : les données sont chiffrées en utilisant les clés produites lors de la négociation ;
* **Intégrité et Identité** - permet de vérifier la validité des données transmises, grâce aux signatures HMAC : cette signature est elle aussi générée à l'aide des clés produites lors de la négociation.

Voici en détail comment se déroule le record protocole :

![]({BASE_URL}/imgs/articles/2016-12-23-comprendre-ssl-tls-partie-5-record-protocol/ssl_intro_fig3.jpg)

1. Segmentation - les données sont découpées en blocs de taille inférieure à 16 384 octets ;
2. Compression - les données sont compressées en utilisant l'algorithme choisi lors de la négociation.
A noter : à partir de SSL 3.0, il n'y a plus de compression.
3. Signature HMAC (0, 16 ou 20 octets) - une signature des données est générée à l'aide de la clé MAC. Elle est calculée de la manière suivante :
```
HASH(

       write mac secret

       | pad_2

       | HASH(

                 write mac secret

                 | pad_1

                 | numéro de ce message

                 | protocole pour ce message

                 | longueur de ce message

                 | données compressées

                 )

         )
```

    * La fonction HASH() est soit MD5 soit SHA-1.
    * pad_1 et pad_2 sont des mots de remplissage (pad_1 = 0x36 et pad_2 = 0x5C (répétés 40 fois pour SHA-1 et 48 fois pour MD5))
4. Chiffrement - le paquet obtenu est chiffré à l'aide de la fonction récupérée lors de la négociation ;
5. Un en-tête de 5 octets est ajouté. Le champ “Type” de cet en-tête définit le type du protocole de niveau supérieur au Record Protocol. Les types sont les suivants:

```
Content-Type (1 octet) – Indique le type de paquet SSL et TLS contenu dans l’enregistrement :
0x20 – Paquet de type Change Cipher Spec
0x21 – Paquet de type Alert
0x22 – Paquet de type Handshake
0x23 – Paquet de type Application Data : ce type correspond aux données effectives de la transaction SSL.
```

À la réception des paquets, le destinataire effectue les opérations suivantes :
1. Vérification de l'en-tête SSL/TLS
2. Déchiffrage du paquet
3. Vérification du champ HMAC (en appliquant la même fonction que celle décrite ci-dessus, aux données déchiffrées puis en comparant le résultat au HMAC reçu)
4. Décompression des données
5. Ré-assemblage des parties

Si ça se passe mal au cours de ces vérifications, alors une alarme est générée.

# Outils:

**OpenSSL** :

Implémenté en C, OpenSSL est une boîte à outils de chiffrement comportant deux bibliothèques (une de cryptographie générale et une qui implémente le protocole SSL), ainsi qu'une commande en ligne. OpenSSL est distribué sous une licence de type Apache.

**GnuTLS** :

Le projet GnuTLS propose une implémentation du protocole TLS conforme aux spécifications de l'IETF. Il permet l'authentification via les certificats X509 et PGP. À la différence d'OpenSSL, GnuTLS est compatible avec les licences GPL.

Si vous souhaitez tester votre certificat, vous pouvez utiliser [SSLlab](https://www.ssllabs.com/).

**Conclusion** :

Le protocole SSL / TLS n’est pas facile à prendre en main car il touche énormément de choses différentes et complexes. Cependant, je trouve très intéressant de voir le “côté obscur” de ce protocole afin de comprendre les notions que celui-ci met en place. Dans cette série d’articles, j’ai essayé de vous montrer toutes les phases importantes à savoir : le chiffrement, le certificat et les sous-protocoles, afin que vous ne soyez plus perdu quand on vous parle de SSL / TLS (que vous ayez compris les principes).
Toutefois, si vous mettez en place un certificat SSL sur votre site, cela ne vous garantira pas à 100% que celui-ci est sécurisé. Pour exemple récent, le faille connue sous le nom de [Heartblee](https://fr.wikipedia.org/wiki/Heartbleed) qui a ébranlé tout le web.
