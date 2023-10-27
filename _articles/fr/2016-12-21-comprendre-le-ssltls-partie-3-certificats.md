---
contentType: article
lang: fr
date: '2016-12-21'
slug: comprendre-le-ssltls-partie-3-certificats
title: 'Comprendre le SSL/TLS : Partie 3 Certificats'
excerpt: Qu'est-ce qu'un certificat ?
categories: []
authors:
  - ibenichou
keywords:
  - tls
  - ssl
  - securite
  - algorithmie
  - protocoles
  - chiffrement
  - certificats
---

# Qu'est-ce qu'un certificat ?

Un **certificat électronique** (aussi appelé **certificat numérique** ou **certificat de clé publique**) peut être vu comme une carte d'[identité](https://fr.wikipedia.org/wiki/Identit%C3%A9_num%C3%A9rique_(Internet)) numérique. Il est utilisé principalement pour identifier et authentifier une personne physique ou morale, mais aussi pour chiffrer des échanges.

Il est **signé** par un tiers de confiance (aussi appelé **autorités de certification, AC** ou **CA* pour **Certificate Authority** en anglais) qui atteste du lien entre l'identité physique et l'entité numérique.

Les autorités de certification sont des organismes enregistrés et certifiés auprès d'autorités publiques et/ou de [gouvernance de l'Internet](https://fr.wikipedia.org/wiki/Gouvernance_d%27Internet) qui établissent leur viabilité comme intermédiaire fiable.

Ces organismes diffusent leurs propres clés publiques et étant certifiées fiables, ces autorités sont en contact direct avec les principaux producteurs de navigateurs web (tels que Mozilla Firefox, Google Chrome, Internet Explorer, etc.) qui incluent nativement les listes de clés des autorités de certification.

C'est cette relation qui est à la base de la **chaîne de confiance**. Ces clés sont appelées **clés publiques racines** ou [certificats racines](https://fr.wikipedia.org/wiki/Certificat_racine) et sont utilisées pour identifier les clés publiques d'autres organismes (nous allons voir en détail cette partie plus bas).

Cependant, les CA doivent répondre à des critères de sécurité très stricts, notamment pour garantir que leurs propres certificats ne sont pas compromis, ce qui entraînerait la corruption de tous les certificats émis sous leur responsabilité. C'est pourquoi la clé privée de leur certificats root est mise à l'abri, et n'est pas utilisée pour **signer** des certificats SSL, mais pour **signer** des certificats **intermédiaires**, qui à leur tour signent les certificats SSL finaux.

C’est le terme “**chaîne de confiance**” (que nous avons décrit plus haut) qui désigne ceci.

En effet, la certification peut s'effectuer en cascade. Un certificat peut permettre d'authentifier d'autres certificats jusqu'au certificat qui sera utilisé pour la communication.

Nous allons prendre par exemple le meilleur site au monde (oui c’est bientôt mon point individuel de fin d’année donc…  :p ) [https://eleven-labs.com](https://eleven-labs.com).

On remarque plusieurs points :
1. Eleven-labs n’a pas rempli toutes les infos concernant le site (tel que le type d’entreprise..... (pas bien !!!!)
2. Le nom de l'émetteur (ici Let’s Encrypt), son algo de signature, les infos de la clé publique…
3. La hiérarchie du certificat ! On voit clairement que le certificat intermédiaire d’Eleven-labs qui est émis par Let’s Encrypt Authority X3 est **signé** par DST Root CA X3

![]({{ site.baseurl }}/assets/2016-12-21-comprendre-le-ssltls-partie-3-certificats/capture-d-ecran-2016-11-26-a-11.15.04.png)

# Normes de certificat :

Les deux normes de certificat les plus utilisées aujourd'hui sont :
* X.509, défini dans la RFC [5280](https://tools.ietf.org/html/rfc5280) ;
* OpenPGP, défini dans la [RFC 4880](https://tools.ietf.org/html/rfc4880RFC).


La différence notable entre ces deux normes est qu'un certificat X.509 ne peut contenir qu'un seul identifiant ; que cet identifiant doit contenir de nombreux champs prédéfinis ; et ne peut être signé que par une seule autorité de certification.

Un certificat OpenPGP peut contenir plusieurs identifiants, lesquels autorisent une certaine souplesse sur leur contenu, et peuvent ainsi être signés par une multitude d'autres certificats OpenPGP, permettant alors de construire des toiles de confiance.

Chaque certificat X.509 comprend :

* Le numéro de version du standard X.509 supporté par le certificat.
* Le numéro de série du certificat. Chaque certificat émis par une autorité de certification (CA) a un numéro de série unique parmi les certificats émis par cette CA.
* Algorithme de signature du certificat
* DN (*Distinguished Name*) du délivreur (autorité de certification)
* Validité (dates limites)
    * Pas avant
    * Pas après
* DN de l'objet du certificat
* Informations sur la clé publique
    * Algorithme de la clé publique
    * Clé publique proprement dite
* Identifiant unique du signataire (optionnel, X.509v2)
* Identifiant unique du détenteur du certificat (optionnel, X.509v2)
* Extensions (optionnel, à partir de X.509v3)
    * Liste des extensions
* Signature des informations ci-dessus par l'autorité de certification

# "Signature" ? "Certificat signé" ?

Tout d’abord la fonction de signature doit répondre à plusieurs critères :

* **Authentique** : L'identité du signataire doit pouvoir être retrouvée de manière certaine ;
* **Infalsifiable** : La signature ne peut pas être falsifiée. Quelqu'un ne peut se faire passer pour un autre ;
* **Non réutilisable** : La signature n'est pas réutilisable. Elle fait partie du document signé et ne peut être déplacée sur un autre document ;
* **Inaltérable** : Un document signé est inaltérable. Une fois qu'il est signé, on ne peut plus le modifier ;
* **Irrévocable** : La personne qui a signé ne peut le nier.

Procédure de signature (avec l’exemple du certificat d’Eleven-labs) :

1. Let’s encrypt
    * A - Let’s Encrypt hash vos données avec du SHA-256
    * B- Il chiffre le résultat du hash avec sa clé privé en RSA (4096 bits)
    * C- Le résultat du chiffrement correspond à la signature
    * D- Let’s Encrypt vous envoie votre certificat ![]({{ site.baseurl }}/assets/2016-12-21-comprendre-le-ssltls-partie-3-certificats/cert_1.jpg)

2. Client
    * A - Lors de la connexion à votre serveur, le client récupère votre certificat.
    * B - Il hash votre certificat avec du SHA-256 (défini dans votre certificat)
    * C - Il déchiffre la signature du certificat avec la clé publique récupérée dans le certificat.
    * D - Il compare le résultat du hash avec le résultat du déchiffrement de la signature. ![]({{ site.baseurl }}/assets/2016-12-21-comprendre-le-ssltls-partie-3-certificats/cert_2.jpg)


Si le résultat est le même alors on est sûr que les données que nous allons récupérer de ce serveur viennent bien d’Eleven-labs.

*Attention* : nous avons oublié une étape importante. En effet, comme indiqué plus haut, votre navigateur dispose d’un tas de clé publique CA dont DST Root CA X3.

Donc en amont de l’étape II, votre navigateur utilise la clé publique de DST Root CA X3 afin de vérifier la signature du certificat intermédiaire Let’s Encrypt (chaîne de confiance).

Si la vérification est bonne alors le client passe à l’étape II.

# Type de certificats :

Lorsque vous allez vouloir acheter un certificat auprès d’un tiers de confiance, celui-ci va vous proposer plusieurs types de certificats. Nous allons voir ensemble de quoi il s’agit :
* **Domain Validation (DV)** : Il authentifie uniquement le nom de domaine : il s’agit du certificat le plus répandu (c’est le cas de Let’s Encrypt).
* **Business Validation (BV) ou Organization Validation (OV)** : Vous devez fournir à l’autorité de certification des documents officiels concernant votre entreprise ou association (KBis, Journal officiel, etc.). Après vérification, l’autorité émet un certificat qui relie votre domaine à votre entreprise. Le client peut alors voir sur son navigateur que le site correspond bien à votre société.
* **Extended Validation (EV)** : Le plus exigeant en terme de certification (documents, délai d’émission, budget) mais aussi le plus rassurant pour vos clients et pour lutter contre le phishing, généralement utilisé par les grandes entreprises du fait de son coût élevé, il met clairement en avant votre société dans le navigateur (à côté de la barre d’adresse).

Les certificats peuvent avoir une garantie allant de 10 000 € jusqu'à plus de 1 500 000 € si une faille de sécurité provient de leur certificat.

Aujourd'hui, il existe deux solutions qui vous permettent d'avoir un certificat sans payer :
1. Let's encrypt, open source, sponsorisé par des acteurs important tel que mozilla, free, ovh...   C'est la solution que je vous recommande ! Si vous souhaitez mettre en place cette solution, je vous invite à aller voir un super tuto [ici](https://vincent.composieux.fr/article/installer-configurer-et-renouveller-automatiquement-un-certificat-ssl-let-s-encrypt).
2. Créer vous même un certificat dit **auto-signé**.

Cependant, les certificats SSL auto-signés déclenchent des alertes de sécurité sur la plupart des navigateurs web car ils n'ont pas été vérifiés par une Autorité de Certification de confiance. La plupart du temps, ces alertes conseillent aux visiteurs de quitter la page pour des raisons de sécurité. Mais si vous passez par Let's Encrypt vous n'aurez pas ce type de problème.

# Portée du certificat :

* Un seul domaine : suffisant pour votre site web, mais pas pour les autres services (mail, webmail, ftp, etc.)
*exemple* : www.hatem-ben-arfa.com
* Domaine + sous-domaine (**wildcard**) : idéal pour votre site web et les autres services.
*exemple* : *.hatem-ben-arfa.com (www.hatem-ben-arfa.com, ftp.hatem-ben-arfa.com, ...)
* Multi-domaine : généralement réservé aux grandes structures, agences web ou hébergeurs.
*exemple* : www.hatem-ben-arfa.com, www.estcequecestbientotleweekend.com, ...
