--- layout: post title: 'Comprendre le SSL/TLS: Partie 4 Handshake
Protocol' author: ibenichou date: '2016-12-22 11:15:59 +0100' date\_gmt:
'2016-12-22 10:15:59 +0100' categories: - Non classé tags: \[\] --- {%
raw %}

[Les protocoles SSL / TLS peuvent être divisés en 2
couches.]{style="font-weight: 400;"}

[La première couche est constituée par des protocoles de négociation
(Handshake, Cipher, Alert) et la deuxième couche est le protocole
Record.]{style="font-weight: 400;"}

[L’image ci-dessous illustre les différentes couches
:]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-300x233.png){.size-medium
.wp-image-2877 .aligncenter width="300"
height="233"}](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram.png)

#### **Handshake Protocol :**

[Traduit “poignée de main” en Français, ]{style="font-weight: 400;"}[ce
protocole permet au serveur et au client de :
]{style="font-weight: 400;"}

1.  [s'authentifier mutuellement ;]{style="font-weight: 400;"}
2.  [négocier :]{style="font-weight: 400;"}
    1.  [ les algorithmes de chiffrement ;]{style="font-weight: 400;"}
    2.  [les algorithmes de MAC ]{style="font-weight: 400;"}[(Message
        Authentification Code) ; ]{style="font-weight: 400;"}
    3.  [les clés symétriques qui vont servir au chiffrement  avant que
        l'application ne transmette son premier
        octet.]{style="font-weight: 400;"}

[Voici en détails comment se déroule le handshake, dans l'ordre
chronologique :]{style="font-weight: 400;"}

[![](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-1-300x165.png){.size-medium
.wp-image-2878 .aligncenter width="300"
height="165"}](http://blog.eleven-labs.com/wp-content/uploads/2016/12/Untitled-Diagram-1.png)

**1 - Client Hello**

[Envoi de la version maximale supportée (SSL = 3.0), de la suite
d'algorithmes supportés (par ordre de préférence décroissant) et une
valeur aléatoire de 32 octets.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

*[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv2 Record Layer: Client
Hello]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
103]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Message Type: Client
Hello (1)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Cipher Spec Length:
78]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Session ID Length:
0]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Challenge Length:
16]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Cipher Specs (26
specs)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Cipher Spec:
SSL2\_RC4\_128\_WITH\_MD5 (0x010080)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            \[ more Cipher Specs deleted
\]]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[
       Challenge]{style="font-weight: 400;"}*

**2 - Server Hello**

[Choix de la version de la suite d'algorithmes (Cipher Suite) et d'une
valeur aléatoire.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Handshake Protocol:
Server Hello]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Handshake
(22)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
74]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Protocol: Server
Hello]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Handshake Type: Server Hello
(2)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Length:
70]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[
           Random]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[                gmt\_unix\_time: Apr 24,
2006 11:04:15.000000000]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[                random\_bytes:
FE81ED93650288A3F8EB63860E2CF68DD00F2C2AD64FCD2D...]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Session ID Length:
32]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Session ID (32
bytes)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Cipher Suite:
TLS\_RSA\_WITH\_AES\_256\_CBC\_SHA
(0x0035)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Compression Method: null
(0)]{style="font-weight: 400;"}

**3 - Certificate (optionnel)**

[Envoi d'une chaîne de certificats par le serveur. Le premier certificat
est celui du serveur, le dernier est celui de l'autorité de
certification.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Handshake Protocol:
Certificate]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Handshake
(22)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
836]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Protocol:
Certificate]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Handshake Type: Certificate
(11)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Length:
832]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            \[ Certificate details deleted
\]]{style="font-weight: 400;"}

**4- Certificate Request (optionnel)**

[D]{style="font-weight: 400;"}[emande un certificat au client pour
l'authentifier.]{style="font-weight: 400;"}

**5 - Server Key Exchange (optionnel)**

[Message complémentaire pour l'échange des clés. Ce message contient la
clé publique du serveur utilisée par le client pour chiffrer les
informations de clé de session.]{style="font-weight: 400;"}

**6 - Server Hello Done**

[Fin des émissions du serveur.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        SSLv3 Record Layer: Handshake
Protocol: Server Hello Done]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Handshake
(22)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
4]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Protocol: Server Hello
Done]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Handshake Type: Server Hello
Done (14)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Length:
0]{style="font-weight: 400;"}

**7 - Certificate (optionnel)**

[Certificat éventuel du client si le serveur demande une
authentification.]{style="font-weight: 400;"}

**8 - Client Key Exchange**

[Le client produit un secret pré-maître (encrypted pre-master key) et le
crypte avec la clé publique du certificat du serveur. Ces informations
sont chiffrées une deuxième fois avec la clé publique du serveur (et non
la clé publique du certificat du serveur) reçue dans le message
]{style="font-weight: 400;"}**Server Key Exchange** *[(cf. étape
5)]{style="font-weight: 400;"}*[.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Handshake Protocol:
Client Key Exchange]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Handshake
(22)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
132]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Protocol: Client Key
Exchange]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Handshake Type: Client Key
Exchange (16)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Length:
128]{style="font-weight: 400;"}

**9 - Certificate Verify (optionnel)**

[Message contenant une empreinte (hash) signée numériquement et créée à
partir des informations de clé et de tous les messages précédents. Ce
message permet de confirmer au serveur que le client possède bien la clé
privée correspondante au certificat client
]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}*[(cf. étape
7)]{style="font-weight: 400;"}*[.]{style="font-weight: 400;"}

**10 - Change Cipher Spec**

[Passage du client en mode chiffré avec la clé master comme clé
symétrique.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Change Cipher Spec
Protocol: Change Cipher Spec]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Change Cipher Spec
(20)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
1]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Change Cipher Spec
Message]{style="font-weight: 400;"}

**11 - Client Finished**

[Fin des émissions du client, ce message est chiffré à l'aide des
paramètres de la suite de chiffrement.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Handshake Protocol:
Finished]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Handshake
(22)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
64]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Protocol:
Finished]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Handshake Type: Finished
(20)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Length:
36]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            MD5
Hash]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            SHA-1
Hash]{style="font-weight: 400;"}

**12 - Change Cipher Spec**

[Passage du serveur en mode chiffré avec la clé
master.]{style="font-weight: 400;"}

*[Exemple :]{style="font-weight: 400;"}*

[Secure Socket Layer]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Change Cipher Spec
Protocol: Change Cipher Spec]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Change Cipher Spec
(20)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
1]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Change Cipher Spec
Message]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[    SSLv3 Record Layer: Handshake Protocol:
Finished]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Content Type: Handshake
(22)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Version: SSL 3.0
(0x0300)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Length:
64]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[        Handshake Protocol:
Finished]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Handshake Type: Finished
(20)]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            Length:
36]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            MD5
Hash]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[            SHA-1
Hash]{style="font-weight: 400;"}

**13 - Server Finished**

[Confirmation au client du passage en mode chiffré. Ce message est
chiffré à l'aide des paramètres de la suite de
chiffrement.]{style="font-weight: 400;"}

**14 - Encrypted Data**

[Le tunnel SSL / TLS est établi, c'est maintenant le
]{style="font-weight: 400;"}**Record Protocol**[ qui prend le relais
pour chiffrer les données.]{style="font-weight: 400;"}

{% endraw %}
