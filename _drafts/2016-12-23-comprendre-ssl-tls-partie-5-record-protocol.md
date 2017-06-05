--- layout: post title: 'Comprendre le SSL/TLS: Partie 5 Record
Protocol' author: ibenichou date: '2016-12-23 12:00:01 +0100' date\_gmt:
'2016-12-23 11:00:01 +0100' categories: - Non classé tags: - sécurité -
SSL - TLS - Algorithmes - Chiffrement --- {% raw %}

#### **Record protocol**

[Ce protocole a pour buts :]{style="font-weight: 400;"}

-   **Encapsulation**[ - permet aux données SSL / TLS d'être transmises
    et reconnues sous une forme homogène ;]{style="font-weight: 400;"}
-   **Confidentialité**[ - assure que le contenu du message ne peut pas
    être lu par un tiers : les données sont chiffrées en utilisant les
    clés produites lors de la négociation ;]{style="font-weight: 400;"}
-   **Intégrité et Identité**[ - permet de vérifier la validité des
    données transmises, grâce aux signatures HMAC : cette signature est
    elle aussi générée à l'aide des clés produites lors de la
    négociation.]{style="font-weight: 400;"}

[Voici en détail comment se déroule le record protocole
:]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/ssl_intro_fig3-300x229.jpg){.size-medium
.wp-image-2995 .aligncenter width="300"
height="229"}](http://blog.eleven-labs.com/wp-content/uploads/2016/12/ssl_intro_fig3.jpg)

 

[1 - Segmentation - les données sont découpées en blocs de taille
inférieure à 16 384 octets ;]{style="font-weight: 400;"}

[2- Compression - les données sont compressées en utilisant l'algorithme
choisi lors de la négociation.\
]{style="font-weight: 400;"}[A noter : à partir de SSL 3.0, il n'y a
plus de compression.]{style="font-weight: 400;"}

[3 - Signature HMAC (0, 16 ou 20 octets) - une signature des données est
générée à l'aide de la clé MAC. Elle est calculée de la manière suivante
:]{style="font-weight: 400;"}

[     HASH(]{style="font-weight: 400;"}

[        write mac secret]{style="font-weight: 400;"}

[        | pad\_2]{style="font-weight: 400;"}

[        | HASH(]{style="font-weight: 400;"}

[                  write mac secret]{style="font-weight: 400;"}

[                  | pad\_1]{style="font-weight: 400;"}

[                  | numéro de ce message]{style="font-weight: 400;"}

[                  | protocole pour ce
message]{style="font-weight: 400;"}

[                  | longueur de ce message]{style="font-weight: 400;"}

[                  | données compressées]{style="font-weight: 400;"}

[                  )]{style="font-weight: 400;"}

[          )]{style="font-weight: 400;"}

-   [La fonction HASH() est soit MD5 soit
    SHA-1.]{style="font-weight: 400;"}
-   [pad\_1 et pad\_2 sont des mots de remplissage (pad\_1 = 0x36 et
    pad\_2 = 0x5C (répétés 40 fois pour SHA-1 et 48 fois pour
    MD5))]{style="font-weight: 400;"}

[4 - ]{style="font-weight: 400;"}[Chiffrement - le paquet obtenu est
chiffré à l'aide de la fonction récupérée lors de la négociation
;]{style="font-weight: 400;"}

[5- ]{style="font-weight: 400;"}[Un en-tête de 5 octets est ajouté. Le
champ “Type” de cet en-tête définit le type du protocole de niveau
supérieur au Record Protocol. Les types sont les
suivants:]{style="font-weight: 400;"}

[Content-Type (1 octet) - Indique le type de paquet SSL et TLS contenu
dans l'enregistrement :\
]{style="font-weight: 400;"}[0x20 - Paquet de type Change Cipher Spec\
]{style="font-weight: 400;"}[0x21 - Paquet de type Alert\
]{style="font-weight: 400;"}[0x22 - Paquet de type Handshake\
]{style="font-weight: 400;"}[0x23 - Paquet de type Application Data : ce
type correspond aux données effectives de la transaction
SSL.]{style="font-weight: 400;"}

[À la réception des paquets, le destinataire effectue les opérations
suivantes :]{style="font-weight: 400;"}

1.  [Vérification de l'en-tête SSL/TLS]{style="font-weight: 400;"}
2.  [Déchiffrage du paquet]{style="font-weight: 400;"}
3.  [Vérification du champ HMAC (en appliquant la même fonction que
    celle décrite ci-dessus, aux données déchiffrées puis en comparant
    le résultat au HMAC reçu)]{style="font-weight: 400;"}
4.  [Décompression des données]{style="font-weight: 400;"}
5.  [Ré-assemblage des parties]{style="font-weight: 400;"}

[Si ça se passe mal au cours de ces vérifications, alors une alarme est
générée.]{style="font-weight: 400;"}

#### **Outils:**

**OpenSSL:**

[Implémenté en C, OpenSSL est une boîte à outils de chiffrement
comportant deux bibliothèques (une de cryptographie générale et une qui
implémente le protocole SSL), ainsi qu'une commande en ligne. OpenSSL
est distribué sous une licence de type
Apache.]{style="font-weight: 400;"}

**GnuTLS:**

[Le projet GnuTLS propose une implémentation du protocole TLS conforme
aux spécifications de l'IETF. Il permet l'authentification via les
certificats X509 et PGP. À la différence d'OpenSSL, GnuTLS est
compatible avec les licences GPL.]{style="font-weight: 400;"}

[Si vous souhaitez tester votre certificat, vous pouvez utiliser
]{style="font-weight: 400;"}[[SSLlab]{style="font-weight: 400;"}](https://www.ssllabs.com/)[.]{style="font-weight: 400;"}

**Conclusion:**

[Le protocole SSL / TLS n’est pas facile à prendre en main car il touche
énormément de choses différentes et complexes. Cependant, je trouve
très intéressant de voir le “côté obscur” de ce protocole afin de
comprendre les notions que celui-ci met en place. Dans cette série
d’articles, j’ai essayé de vous montrer toutes les phases importantes à
savoir : le chiffrement, le certificat et les sous-protocoles, afin que
vous ne soyez plus perdu quand on vous parle de SSL / TLS (que vous ayez
compris les principes).]{style="font-weight: 400;"}\
[Toutefois, si vous mettez en place un certificat SSL sur votre site,
cela ne vous garantira pas à 100% que celui-ci est sécurisé. Pour
exemple récent, le faille connue sous le nom de
]{style="font-weight: 400;"}[[Heartbleed](https://fr.wikipedia.org/wiki/Heartbleed) ]{style="font-weight: 400;"}[qui
a ébranlé tout le web.]{style="font-weight: 400;"}

{% endraw %}
