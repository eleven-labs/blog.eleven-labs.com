--- layout: post title: 'Comprendre le SSL/TLS : Partie 3 Certificats'
author: ibenichou date: '2016-12-21 16:19:21 +0100' date\_gmt:
'2016-12-21 15:19:21 +0100' categories: - Non classé tags: - sécurité -
SSL - TLS - Chiffrement - Certificats --- {% raw %}

#### [Qu'est-ce qu'un certificat ?]{style="font-weight: 400;"}

[Un ]{style="font-weight: 400;"}**certificat électronique**[ (aussi
appelé ]{style="font-weight: 400;"}**certificat numérique**[ ou
]{style="font-weight: 400;"}**certificat de clé publique**[) peut être
vu comme une carte d']{style="font-weight: 400;"}[[identité
numérique]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Identit%C3%A9_num%C3%A9rique_(Internet))[.
Il est utilisé principalement pour identifier et authentifier une
personne physique ou morale, mais aussi pour chiffrer des
échanges.]{style="font-weight: 400;"}

[Il est ]{style="font-weight: 400;"}**signé**[ par un tiers de confiance
(aussi appelé ]{style="font-weight: 400;"}**autorités de certification,
AC**[ ou ]{style="font-weight: 400;"}**CA**[ pour
]{style="font-weight: 400;"}**Certificate Authority**[ en
anglais]{style="font-weight: 400;"}[) qui atteste du lien entre
l'identité physique et l'entité numérique.]{style="font-weight: 400;"}

[Les autorités de certification sont des organismes enregistrés et
certifiés auprès d'autorités publiques et/ou de
]{style="font-weight: 400;"}[[gouvernance de
l'Internet]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Gouvernance_d%27Internet)[
qui établissent leur viabilité comme intermédiaire fiable.
]{style="font-weight: 400;"}

[Ces organismes diffusent leurs propres clés publiques et étant
certifiées fiables, ces autorités sont en contact direct avec les
principaux producteurs de navigateurs web (tels que Mozilla Firefox,
Google Chrome, Internet Explorer, etc.) qui incluent nativement les
listes de clés des autorités de certification.
]{style="font-weight: 400;"}

[C'est cette relation qui est à la base de la
]{style="font-weight: 400;"}**chaîne de confiance**[. Ces clés sont
appelées
]{style="font-weight: 400;"}*[c]{style="font-weight: 400;"}*[lés]{style="font-weight: 400;"}
**publiques racines**[ ou ]{style="font-weight: 400;"}[[certificats
racines]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Certificat_racine)[
et sont utilisées pour identifier les clés publiques d'autres organismes
(nous allons voir en détail cette partie plus
bas).]{style="font-weight: 400;"}

[Cependant, les CA doivent répondre à des critères de sécurité très
stricts, notamment pour garantir que leurs propres certificats ne sont
pas compromis, ce qui entraînerait la corruption de tous les certificats
émis sous leur responsabilité. C'est pourquoi la clé privée de leur
certificats root est mise à l'abri, et n'est pas utilisée pour
]{style="font-weight: 400;"}**signer**[ des certificats SSL, mais pour
]{style="font-weight: 400;"}**signer**[ des certificats
]{style="font-weight: 400;"}**intermédiaires**[, qui à leur tour signent
les certificats SSL finaux.]{style="font-weight: 400;"}

[C’est le terme “]{style="font-weight: 400;"}**chaîne de confiance”**
[(]{style="font-weight: 400;"}[que nous avons décrit plus haut) qui
désigne ceci.]{style="font-weight: 400;"}

[En effet, la certification peut s'effectuer en cascade. Un certificat
peut permettre d'authentifier d'autres certificats jusqu'au certificat
qui sera utilisé pour la communication.]{style="font-weight: 400;"}

[Nous allons prendre par exemple le meilleur site au monde (oui c’est
bientôt mon point individuel de fin d’année donc…  :p )
]{style="font-weight: 400;"}[[https://eleven-labs.com]{style="font-weight: 400;"}](https://eleven-labs.com)[.]{style="font-weight: 400;"}

[On remarque plusieurs points :]{style="font-weight: 400;"}

1.  [Eleven-labs n’a pas rempli toutes les infos concernant le site (tel
    que le type d’entreprise..... (pas bien
    !!!!)]{style="font-weight: 400;"}
2.  [Le nom de l'émetteur (ici Let’s Encrypt), son algo de signature,
    les infos de la clé publique…]{style="font-weight: 400;"}
3.  La hiérarchie du certificat ! On voit clairement que le certificat
    intermédiaire d’Eleven-labs qui est émis par Let’s Encrypt Authority
    X3 est **signé** [par DST Root CA X3]{style="font-weight: 400;"}

[![capture-decran-2016-11-26-a-11-15-04](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-26-à-11.15.04-202x300.png){.size-medium
.wp-image-2705 .aligncenter width="202"
height="300"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-26-à-11.15.04.png)

#### **Normes de certificat :**

[Les deux normes de certificat les plus utilisées aujourd'hui sont
:]{style="font-weight: 400;"}

-   [X.509, défini dans la ]{style="font-weight: 400;"}[[RFC
    5280]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc5280)[
    ;]{style="font-weight: 400;"}
-   [OpenPGP, défini dans la ]{style="font-weight: 400;"}[[RFC
    4880]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc4880)[.]{style="font-weight: 400;"}

[La différence notable entre ces deux normes est qu'un certificat X.509
ne peut contenir qu'un seul identifiant ; que cet identifiant doit
contenir de nombreux champs prédéfinis ; et ne peut être signé que par
une seule autorité de certification. ]{style="font-weight: 400;"}

[Un certificat OpenPGP peut contenir plusieurs identifiants, lesquels
autorisent une certaine souplesse sur leur contenu, et peuvent ainsi
être signés par une multitude d'autres certificats OpenPGP, permettant
alors de construire des toiles de confiance.]{style="font-weight: 400;"}

[Chaque certificat X.509 comprend :]{style="font-weight: 400;"}

-   [Le numéro de version du standard X.509 supporté par le
    certificat.]{style="font-weight: 400;"}
-   [Le numéro de série du certificat. Chaque certificat émis par une
    autorité de certification (CA) a un numéro de série unique parmi les
    certificats émis par cette CA.]{style="font-weight: 400;"}
-   [Algorithme de signature du certificat]{style="font-weight: 400;"}
-   [DN (]{style="font-weight: 400;"}*[Distinguished
    Name]{style="font-weight: 400;"}*[) du délivreur (autorité de
    certification)]{style="font-weight: 400;"}
-   [Validité (dates limites)]{style="font-weight: 400;"}
    -   [Pas avant]{style="font-weight: 400;"}
    -   [Pas après]{style="font-weight: 400;"}
-   [DN de l'objet du certificat]{style="font-weight: 400;"}
-   [Informations sur la clé publique]{style="font-weight: 400;"}
    -   [Algorithme de la clé publique]{style="font-weight: 400;"}
    -   [Clé publique proprement dite]{style="font-weight: 400;"}
-   [Identifiant unique du signataire (optionnel,
    X.509v2)]{style="font-weight: 400;"}
-   [Identifiant unique du détenteur du certificat (optionnel,
    X.509v2)]{style="font-weight: 400;"}
-   [Extensions (optionnel, à partir de
    X.509v3)]{style="font-weight: 400;"}
    -   [Liste des extensions]{style="font-weight: 400;"}
-   [Signature des informations ci-dessus par l'autorité de
    certification]{style="font-weight: 400;"}

#### **"Signature" ? "Certificat signé" ?**

[Tout d’abord la fonction de signature doit répondre à plusieurs
critères :]{style="font-weight: 400;"}

-   **Authentique**[ : L'identité du signataire doit pouvoir être
    retrouvée de manière certaine ;]{style="font-weight: 400;"}
-   **Infalsifiable**[ : La signature ne peut pas être falsifiée.
    Quelqu'un ne peut se faire passer pour un autre
    ;]{style="font-weight: 400;"}
-   **Non réutilisable**[ : La signature n'est pas réutilisable. Elle
    fait partie du document signé et ne peut être déplacée sur un autre
    document ;]{style="font-weight: 400;"}
-   **Inaltérable**[ : Un document signé est inaltérable. Une fois qu'il
    est signé, on ne peut plus le modifier ;]{style="font-weight: 400;"}
-   **Irrévocable**[ : La personne qui a signé ne peut le
    nier.]{style="font-weight: 400;"}

[Procédure de signature (avec l’exemple du certificat d’Eleven-labs)
:]{style="font-weight: 400;"}

1.  [Let’s encrypt]{style="font-weight: 400;"}

[            A - Let’s Encrypt hash vos données avec du
SHA-256]{style="font-weight: 400;"}

[            B- Il chiffre le résultat du hash avec sa clé privé en RSA
(4096 bits)]{style="font-weight: 400;"}

[            C- Le résultat du chiffrement correspond à la
signature]{style="font-weight: 400;"}

[            D- Let’s Encrypt vous envoie votre
certificat]{style="font-weight: 400;"}[\
![cert\_1](http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_1-300x229.jpg){.alignnone
.size-medium .wp-image-2707 .aligncenter width="300"
height="229"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_1.jpg)

1.  Client

[           A - Lors de la connexion à votre serveur, le client récupère
votre certificat.]{style="font-weight: 400;"}

[           B - Il hash votre certificat avec du SHA-256 (défini dans
votre certificat)]{style="font-weight: 400;"}

[           C - Il déchiffre la signature du certificat avec la clé
publique récupérée dans le certificat.]{style="font-weight: 400;"}

[           D - Il compare le résultat du hash avec le résultat du
déchiffrement de la signature.]{style="font-weight: 400;"}

[![cert\_2](http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_2-300x217.jpg){.size-medium
.wp-image-2708 .aligncenter width="300"
height="217"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_2.jpg)

[Si le résultat est le même alors on est sûr que les données que nous
allons récupérer de ce serveur viennent bien
d’Eleven-labs.]{style="font-weight: 400;"}

[*Attention* : nous avons oublié une étape importante. En effet, comme
indiqué plus haut, votre navigateur dispose d’un tas de clé publique CA
dont ]{style="font-weight: 400;"}[DST Root CA
X3]{style="font-weight: 400;"}[.]{style="font-weight: 400;"}

[Donc en amont de l’étape II, votre navigateur utilise la clé publique
de ]{style="font-weight: 400;"}[DST Root CA X3 afin de vérifier la
signature du certificat intermédiaire Let’s Encrypt (chaîne de
confiance).]{style="font-weight: 400;"}

[Si la vérification est bonne alors le client passe à l’étape
II.]{style="font-weight: 400;"}

#### **Type de certificats :**

[Lorsque vous allez vouloir acheter un certificat auprès d’un tiers de
confiance, celui-ci va vous proposer plusieurs types de certificats.
Nous allons voir ensemble de quoi il s’agit
:]{style="font-weight: 400;"}

-   **Domain Validation (DV)**[ : Il authentifie uniquement le nom de
    domaine : il s’agit du certificat le plus répandu (c’est le cas de
    Let’s Encrypt).]{style="font-weight: 400;"}
-   **Business Validation (BV) ou Organization Validation (OV)**[ : Vous
    devez fournir à l’autorité de certification des documents officiels
    concernant votre entreprise ou association (KBis, Journal officiel,
    etc.). Après vérification, l’autorité émet un certificat qui relie
    votre domaine à votre entreprise. Le client peut alors voir sur son
    navigateur que le site correspond bien à votre
    société.]{style="font-weight: 400;"}
-   **Extended Validation (EV)**[ : Le plus exigeant en terme de
    certification (documents, délai d’émission, budget) mais aussi le
    plus rassurant pour vos clients et pour lutter contre le phishing,
    généralement utilisé par les grandes entreprises du fait de son coût
    élevé, il met clairement en avant votre société dans le navigateur
    (à côté de la barre d’adresse).]{style="font-weight: 400;"}

[Les certificats peuvent avoir une garantie allant de 10 000 € jusqu'à
plus de 1 500 000 € si une faille de sécurité provient de leur
certificat.]{style="font-weight: 400;"}

Aujourd'hui, il existe deux solutions qui vous permettent d'avoir un
certificat sans payer :

1.  Let's encrypt, open source, sponsorisé par des acteurs important tel
    que mozilla, free, ovh...   C'est la solution que je vous recommande
    ! Si vous souhaitez mettre en place cette solution, je vous invite à
    aller voir un super tuto
    [ici](https://vincent.composieux.fr/article/installer-configurer-et-renouveller-automatiquement-un-certificat-ssl-let-s-encrypt).
2.  Créer vous même un certificat dit **auto-signé**.

Cependant, les certificats SSL auto-signés déclenchent des alertes de
sécurité sur la plupart des navigateurs web car ils n'ont pas été
vérifiés par une Autorité de Certification de confiance. La plupart du
temps, ces alertes conseillent aux visiteurs de quitter la page pour des
raisons de sécurité. Mais si vous passez par Let's Encrypt vous n'aurez
pas ce type de problème.

#### **Portée du certificat :**

-   [Un seul domaine : suffisant pour votre site web, mais pas pour les
    autres services (mail, webmail, ftp, etc.)\
    ]{style="font-weight: 400;"}[*exemple*:
    www.hatem-ben-arfa.com]{style="font-weight: 400;"}
-   [Domaine + sous-domaine (]{style="font-weight: 400;"}**wildcard**[)
    : idéal pour votre site web et les autres services.\
    ]{style="font-weight: 400;"}[*exemple* :
    \*.hatem-ben-arfa.com (www.hatem-ben-arfa.com,
    ftp.hatem-ben-arfa.com, ...)]{style="font-weight: 400;"}
-   [Multi-domaine : généralement réservé aux grandes structures,
    agences web ou hébergeurs.\
    ]{style="font-weight: 400;"}[*exemple*: www.hatem-ben-arfa.com,
    www.estcequecestbientotleweekend.com,
    ...]{style="font-weight: 400;"}

{% endraw %}
