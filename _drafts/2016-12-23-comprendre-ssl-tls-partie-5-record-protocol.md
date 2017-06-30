---
layout: post
title: 'Comprendre le SSL/TLS: Partie 5 Record Protocol'
author: ibenichou
date: '2016-12-23 12:00:01 +0100'
date_gmt: '2016-12-23 11:00:01 +0100'
categories:
- Non classé
tags:
- sécurité
- SSL
- TLS
- Algorithmes
- Chiffrement
---

#### **Record protocol**
<span style="font-weight: 400;">Ce protocole a pour buts :</span>

<ul>
<li style="font-weight: 400;">**Encapsulation**<span style="font-weight: 400;"> - permet aux données SSL / TLS d'être transmises et reconnues sous une forme homogène ;</span></li>
<li style="font-weight: 400;">**Confidentialité**<span style="font-weight: 400;"> - assure que le contenu du message ne peut pas être lu par un tiers : les données sont chiffrées en utilisant les clés produites lors de la négociation ;</span></li>
<li style="font-weight: 400;">**Intégrité et Identité**<span style="font-weight: 400;"> - permet de vérifier la validité des données transmises, grâce aux signatures HMAC : cette signature est elle aussi générée à l'aide des clés produites lors de la négociation.</span></li>
</ul>
<span style="font-weight: 400;">Voici en détail comment se déroule le record protocole :</span>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/ssl_intro_fig3.jpg"><img class="size-medium wp-image-2995 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/ssl_intro_fig3-300x229.jpg" alt="" width="300" height="229" /></a>

&nbsp;

<span style="font-weight: 400;">1 - Segmentation - les données sont découpées en blocs de taille inférieure à 16 384 octets ;</span>

<span style="font-weight: 400;">2- Compression - les données sont compressées en utilisant l'algorithme choisi lors de la négociation.<br />
</span><span style="font-weight: 400;">A noter : à partir de SSL 3.0, il n'y a plus de compression.</span>

<span style="font-weight: 400;">3 - Signature HMAC (0, 16 ou 20 octets) - une signature des données est générée à l'aide de la clé MAC. Elle est calculée de la manière suivante :</span>

<span style="font-weight: 400;">     HASH(</span>

<span style="font-weight: 400;">        write mac secret</span>

<span style="font-weight: 400;">        | pad_2</span>

<span style="font-weight: 400;">        | HASH(</span>

<span style="font-weight: 400;">                  write mac secret</span>

<span style="font-weight: 400;">                  | pad_1</span>

<span style="font-weight: 400;">                  | numéro de ce message</span>

<span style="font-weight: 400;">                  | protocole pour ce message</span>

<span style="font-weight: 400;">                  | longueur de ce message</span>

<span style="font-weight: 400;">                  | données compressées</span>

<span style="font-weight: 400;">                  )</span>

<span style="font-weight: 400;">          )</span>

<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">La fonction HASH() est soit MD5 soit SHA-1.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">pad_1 et pad_2 sont des mots de remplissage (pad_1 = 0x36 et pad_2 = 0x5C (répétés 40 fois pour SHA-1 et 48 fois pour MD5))</span></li>
</ul>
<span style="font-weight: 400;">4 - </span><span style="font-weight: 400;">Chiffrement - le paquet obtenu est chiffré à l'aide de la fonction récupérée lors de la négociation ;</span>

<span style="font-weight: 400;">5- </span><span style="font-weight: 400;">Un en-tête de 5 octets est ajouté. Le champ “Type” de cet en-tête définit le type du protocole de niveau supérieur au Record Protocol. Les types sont les suivants:</span>

<span style="font-weight: 400;">Content-Type (1 octet) - Indique le type de paquet SSL et TLS contenu dans l'enregistrement :<br />
</span><span style="font-weight: 400;">0x20 - Paquet de type Change Cipher Spec<br />
</span><span style="font-weight: 400;">0x21 - Paquet de type Alert<br />
</span><span style="font-weight: 400;">0x22 - Paquet de type Handshake<br />
</span><span style="font-weight: 400;">0x23 - Paquet de type Application Data : ce type correspond aux données effectives de la transaction SSL.</span>

<span style="font-weight: 400;">À la réception des paquets, le destinataire effectue les opérations suivantes :</span>

<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Vérification de l'en-tête SSL/TLS</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Déchiffrage du paquet</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Vérification du champ HMAC (en appliquant la même fonction que celle décrite ci-dessus, aux données déchiffrées puis en comparant le résultat au HMAC reçu)</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Décompression des données</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Ré-assemblage des parties</span></li>
</ol>
<span style="font-weight: 400;">Si ça se passe mal au cours de ces vérifications, alors une alarme est générée.</span>

#### **Outils:**
**OpenSSL:**

<span style="font-weight: 400;">Implémenté en C, OpenSSL est une boîte à outils de chiffrement comportant deux bibliothèques (une de cryptographie générale et une qui implémente le protocole SSL), ainsi qu'une commande en ligne. OpenSSL est distribué sous une licence de type Apache.</span>

**GnuTLS:**

<span style="font-weight: 400;">Le projet GnuTLS propose une implémentation du protocole TLS conforme aux spécifications de l'IETF. Il permet l'authentification via les certificats X509 et PGP. À la différence d'OpenSSL, GnuTLS est compatible avec les licences GPL.</span>

<span style="font-weight: 400;">Si vous souhaitez tester votre certificat, vous pouvez utiliser </span><a href="https://www.ssllabs.com/" target="_blank"><span style="font-weight: 400;">SSLlab</span></a><span style="font-weight: 400;">.</span>

**Conclusion:**

<span style="font-weight: 400;">Le protocole SSL / TLS n’est pas facile à prendre en main car il touche énormément de choses différentes et complexes. Cependant, je trouve très intéressant de voir le “côté obscur” de ce protocole afin de comprendre les notions que celui-ci met en place. Dans cette série d’articles, j’ai essayé de vous montrer toutes les phases importantes à savoir : le chiffrement, le certificat et les sous-protocoles, afin que vous ne soyez plus perdu quand on vous parle de SSL / TLS (que vous ayez compris les principes).</span><br />
<span style="font-weight: 400;">Toutefois, si vous mettez en place un certificat SSL sur votre site, cela ne vous garantira pas à 100% que celui-ci est sécurisé. Pour exemple récent, le faille connue sous le nom de </span><span style="font-weight: 400;"><a href="https://fr.wikipedia.org/wiki/Heartbleed">Heartbleed</a> </span><span style="font-weight: 400;">qui a ébranlé tout le web.</span>


