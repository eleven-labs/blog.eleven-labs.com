--- layout: post title: 'Comprendre le SSL/TLS : Partie 1 On parle de
quoi ?' author: ibenichou date: '2016-12-20 10:07:16 +0100' date\_gmt:
'2016-12-20 09:07:16 +0100' categories: - Non classé tags: - sécurité -
SSL - TLS - Algorithmie - Protocoles --- {% raw %}

[Vous avez sans doute entendu parler des
]{style="font-weight: 400;"}**protocoles** **SSL**[ ou
]{style="font-weight: 400;"}**TLS**[, non, oui ?\
]{style="font-weight: 400;"}[Nous allons voir ensemble de quoi il
s’agit.\
]{style="font-weight: 400;"}

[Pour cela, nous allons découper cet article en 5 parties, une postée
chaque jour jusqu'à vendredi.]{style="font-weight: 400;"}

1.  [On parle de quoi ? ]{style="font-weight: 400;"}
2.  [Chiffrement]{style="font-weight: 400;"}
3.  [Certificats]{style="font-weight: 400;"}
4.  [Handshake Protocol]{style="font-weight: 400;"}
5.  [Record Protocol]{style="font-weight: 400;"}

[Tout d'abord un peu d'historique : attachez vos ceintures, en route
pour la partie 1 !]{style="font-weight: 400;"}

### **On parle de quoi ?**

[SSL et TLS sont des protocoles de sécurisation des
données.]{style="font-weight: 400;"}

[Ils se comportent comme une couche intermédiaire supplémentaire entre
la couche ]{style="font-weight: 400;"}[Transport (TCP) et la couche
application (HTTP, FTP, SMTP etc.. ) (cf. schéma).
]{style="font-weight: 400;"}

[Cela signifie donc qu'ils peuvent aussi bien être employés pour
sécuriser une transaction web que pour l'envoi ou la réception d'email,
etc…]{style="font-weight: 400;"}

[Jusqu’ici tout va bien !]{style="font-weight: 400;"}

[SSL et TLS sont donc transparents pour l'utilisateur et ne nécessitent
pas l'emploi de protocole de niveau d'application
spécifique.]{style="font-weight: 400;"}

*[Modèle OSI avec le SSL/TLS]{style="font-weight: 400;"}*

[![tls-in-osi](http://blog.eleven-labs.com/wp-content/uploads/2016/11/tls-in-osi-300x202.png){.size-medium
.wp-image-2563 .aligncenter width="300"
height="202"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/tls-in-osi.png)

*[En clair:]{style="font-weight: 400;"}*

[Les protocoles SSL et TLS  permettent d'échanger des informations entre
deux ordinateurs de façon sûre. ]{style="font-weight: 400;"}

[Ils sont censés assurer les 3 points
suivants:]{style="font-weight: 400;"}

1.  **Confidentialité **[: il est impossible d'espionner les
    informations échangées. Le client et le serveur doivent avoir
    l'assurance que leur conversation ne pourra pas être écoutée par un
    tiers. Cette fonctionnalité est assurée par un
    ]{style="font-weight: 400;"}**algorithme de
    chiffrement**[.]{style="font-weight: 400;"}
2.  **Intégrité **[: il est impossible de truquer les informations
    échangées. Le client et le serveur doivent pouvoir s'assurer que les
    messages transmis ne sont ni tronqués ni modifiés (intégrité),
    qu'ils proviennent bien de l'expéditeur attendu. Ces fonctionnalités
    sont assurées par la ]{style="font-weight: 400;"}**signature des
    données**[.]{style="font-weight: 400;"}
3.  **Authentification **[: ce point permet de s'assurer de l'identité
    du programme, de la personne ou de l'entreprise avec laquelle on
    communique. Depuis SSL ]{style="font-weight: 400;"}**3.0**[, le
    serveur peut aussi demander au client de s'authentifier. Cette
    fonctionnalité est assurée par l'emploi de
    ]{style="font-weight: 400;"}**certificats**[.]{style="font-weight: 400;"}

[Les protocoles SSL et TLS reposent donc sur la combinaison de plusieurs
concepts cryptographiques, exploitant à la fois le chiffrement
]{style="font-weight: 400;"}**asymétrique**[ et le chiffrement
]{style="font-weight: 400;"}**symétrique**[ (nous allons voir ces
notions dans la partie chiffrement).]{style="font-weight: 400;"}

[De plus, ces protocoles se veulent évolutifs,  indépendants des
algorithmes de cryptage et d'authentification mis en oeuvre dans une
transaction. Cela leur permet de s'adapter aux besoins des utilisateurs
et d’avoir une meilleure sécurité puisque ces protocoles ne sont pas
soumis aux évolutions théoriques de la cryptographie (si un chiffrement
devient obsolète, le protocole reste exploitable en choisissant un
chiffrement plus sûr).]{style="font-weight: 400;"}

**Histoire :**

**A - SSL**[ :]{style="font-weight: 400;"}

[SSL signifie ]{style="font-weight: 400;"}**Secure Socket Layer.**

-   [Développée par Netscape en ]{style="font-weight: 400;"}**1994,** la
    version[ ]{style="font-weight: 400;"}**1.0 **[reste en interne et
    n'est jamais mis en œuvre ;]{style="font-weight: 400;"}
-   [La première version de SSL réellement utilisée est la version
    **2.0 **sortie en ]{style="font-weight: 400;"}**février 1995**. Il
    s'agit[ également la première implémentation de SSL bannie, en mars
    2011 (]{style="font-weight: 400;"}[[RFC
    6176]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc6176)[)
    ;]{style="font-weight: 400;"}
-   [En]{style="font-weight: 400;"} **novembre 1996** [SSL sort sa
    version ]{style="font-weight: 400;"}**3.0**[, la dernière version de
    SSL, qui inspirera son successeur
    ]{style="font-weight: 400;"}**TLS**[. Ses spécifications sont
    rééditées en août 2008 dans la ]{style="font-weight: 400;"}[[RFC
    6101]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc6101)[[4]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Transport_Layer_Security#cite_note-4)[.
    Le protocole est banni en 2014, à la suite de la publication de la
    faille
    ]{style="font-weight: 400;"}[[POODLE]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/POODLE)[,
    ce bannissement est définitivement ratifié en juin 2015
    (]{style="font-weight: 400;"}[[RFC
    7568]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc7568)[).]{style="font-weight: 400;"}

**B - TLS :**

[TLS signifie ]{style="font-weight: 400;"}**Transport Layer
Security**[.]{style="font-weight: 400;"}

[Le développement de ce protocole a été repris par
l']{style="font-weight: 400;"}[[IETF]{style="font-weight: 400;"}](https://www.ietf.org/)[.]{style="font-weight: 400;"}

[Le protocole TLS n'est pas structurellement différent de la version 3
de SSL, mais des modifications dans l'utilisation des fonctions de
hachage font que les deux protocoles ne sont pas directement
"interopérables". ]{style="font-weight: 400;"}

[Cependant TLS, comme SSLv3, intègre un mécanisme de compatibilité
ascendante avec les versions précédentes, c'est-à-dire qu'au début de la
phase de **négociation**, le client et le serveur négocient la
«meilleure » version du protocole disponible en commun. Pour des raisons
de sécurité (mentionnées plus haut), la compatibilité de TLS avec la
version 2 de SSL est abandonnée.]{style="font-weight: 400;"}

[Ce qui différencie aussi le TLS du SSL c’est que la génération des
]{style="font-weight: 400;"}**clés symétriques**[ est un peu plus
sécurisée dans TLS que dans SSLv3, dans la mesure où aucune étape de
l'algorithme ne repose uniquement sur du MD5 (pour lequel sont apparues
des faiblesses en
]{style="font-weight: 400;"}[[cryptanalyse](https://fr.wikipedia.org/wiki/Cryptanalyse))]{style="font-weight: 400;"}[.]{style="font-weight: 400;"}

-   [En ]{style="font-weight: 400;"}**janvier 1993**[: IETF publie la
    norme ]{style="font-weight: 400;"}**TLS 1.0**[. Plusieurs
    améliorations lui sont apportées par la suite
    :]{style="font-weight: 400;"}
    -   [Octobre 1999 (]{style="font-weight: 400;"}[[RFC
        2712]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc2712)[)
        : Ajout du protocole
        ]{style="font-weight: 400;"}[[Kerberos]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Kerberos_(protocole))[
        à TLS]{style="font-weight: 400;"}
    -   [Mai 2000 (]{style="font-weight: 400;"}[[RFC
        2817]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc2817)[
        et ]{style="font-weight: 400;"}[[RFC
        2818]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc2818)[)
        : Passage à TLS lors d'une session HTTP
        1.1]{style="font-weight: 400;"}
    -   [Juin 2002 (]{style="font-weight: 400;"}[[RFC
        3268]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc3268)[)
        : Support du système de chiffrement
        ]{style="font-weight: 400;"}[[AES]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Standard_de_chiffrement_avanc%C3%A9)[
        par TLS]{style="font-weight: 400;"}
-   [Avril 2006 (]{style="font-weight: 400;"}[[RFC
    4346]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc4346)[)
    : Publication de la norme ]{style="font-weight: 400;"}**TLS
    1.1**[.]{style="font-weight: 400;"}
-   [Août 2008 (]{style="font-weight: 400;"}[[RFC
    5246]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc5246)[)
    : Publication de la norme ]{style="font-weight: 400;"}**TLS
    1.2**[.]{style="font-weight: 400;"}
-   [Mars 2011 (]{style="font-weight: 400;"}[[RFC
    6176]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc6176)[)
    : Abandon de la compatibilité avec SSLv2 pour toutes les versions de
    TLS.]{style="font-weight: 400;"}
-   [Avril 2014 :
    1]{style="font-weight: 400;"}[er]{style="font-weight: 400;"}[
    brouillon pour ]{style="font-weight: 400;"}**TLS
    1.3**[.]{style="font-weight: 400;"}
-   [Juin 2015 (]{style="font-weight: 400;"}[[RFC
    7568]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc7568)[)
    : Abandon de la compatibilité avec SSLv2 et
    SSLv3.]{style="font-weight: 400;"}
-   [Octobre 2015 : Nouveau brouillon de
    ]{style="font-weight: 400;"}**TLS 1.3**

**Navigateurs :**

[La plupart des navigateurs web gèrent TLS 1.0. Les navigateurs
supportant par défaut la dernière version TLS 1.1 et TLS 1.2 sont
:]{style="font-weight: 400;"}

-   [Apple Safari 7 et suivants ;]{style="font-weight: 400;"}
-   [Google Chrome et Chromium 30 et suivants
    ;]{style="font-weight: 400;"}
-   [Microsoft Internet Explorer 11 et suivants
    ;]{style="font-weight: 400;"}
-   [Mozilla Firefox 27 et suivants ;]{style="font-weight: 400;"}
-   [Opera 17 et suivants.]{style="font-weight: 400;"}
-   [Microsoft Edge]{style="font-weight: 400;"}

[Bon j’espère que j’en ai pas perdu en chemin car c’est maintenant qu’on
passe aux choses sérieuses.]{style="font-weight: 400;"}

{% endraw %}
