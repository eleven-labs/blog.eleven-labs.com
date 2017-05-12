---
layout: post
title: 'Comprendre le SSL/TLS : Partie 3 Certificats'
author: ibenichou
date: '2016-12-21 16:19:21 +0100'
date_gmt: '2016-12-21 15:19:21 +0100'
categories:
- Non classé
tags:
- sécurité
- SSL
- TLS
- Chiffrement
- Certificats
---
{% raw %}
<h4><span style="font-weight: 400;">Qu'est-ce qu'un certificat ?</span></h4>
<p><span style="font-weight: 400;">Un </span>**certificat électronique**<span style="font-weight: 400;"> (aussi appelé </span>**certificat numérique**<span style="font-weight: 400;"> ou </span>**certificat de clé publique**<span style="font-weight: 400;">) peut être vu comme une carte d'</span><a href="https://fr.wikipedia.org/wiki/Identit%C3%A9_num%C3%A9rique_(Internet)"><span style="font-weight: 400;">identité numérique</span></a><span style="font-weight: 400;">. Il est utilisé principalement pour identifier et authentifier une personne physique ou morale, mais aussi pour chiffrer des échanges.</span></p>
<p><span style="font-weight: 400;">Il est </span>**signé**<span style="font-weight: 400;"> par un tiers de confiance (aussi appelé </span>**autorités de certification, AC**<span style="font-weight: 400;"> ou </span>**CA**<span style="font-weight: 400;"> pour </span>**Certificate Authority**<span style="font-weight: 400;"> en anglais</span><span style="font-weight: 400;">) qui atteste du lien entre l'identité physique et l'entité numérique.</span></p>
<p><span style="font-weight: 400;">Les autorités de certification sont des organismes enregistrés et certifiés auprès d'autorités publiques et/ou de </span><a href="https://fr.wikipedia.org/wiki/Gouvernance_d%27Internet"><span style="font-weight: 400;">gouvernance de l'Internet</span></a><span style="font-weight: 400;"> qui établissent leur viabilité comme intermédiaire fiable. </span></p>
<p><span style="font-weight: 400;">Ces organismes diffusent leurs propres clés publiques et étant certifiées fiables, ces autorités sont en contact direct avec les principaux producteurs de navigateurs web (tels que Mozilla Firefox, Google Chrome, Internet Explorer, etc.) qui incluent nativement les listes de clés des autorités de certification. </span></p>
<p><span style="font-weight: 400;">C'est cette relation qui est à la base de la </span>**chaîne de confiance**<span style="font-weight: 400;">. Ces clés sont appelées </span><i><span style="font-weight: 400;">c</span></i><span style="font-weight: 400;">lés</span>** publiques racines**<span style="font-weight: 400;"> ou </span><a href="https://fr.wikipedia.org/wiki/Certificat_racine"><span style="font-weight: 400;">certificats racines</span></a><span style="font-weight: 400;"> et sont utilisées pour identifier les clés publiques d'autres organismes (nous allons voir en détail cette partie plus bas).</span></p>
<p><span style="font-weight: 400;">Cependant, les CA doivent répondre à des critères de sécurité très stricts, notamment pour garantir que leurs propres certificats ne sont pas compromis, ce qui entraînerait la corruption de tous les certificats émis sous leur responsabilité. C'est pourquoi la clé privée de leur certificats root est mise à l'abri, et n'est pas utilisée pour </span>**signer**<span style="font-weight: 400;"> des certificats SSL, mais pour </span>**signer**<span style="font-weight: 400;"> des certificats </span>**intermédiaires**<span style="font-weight: 400;">, qui à leur tour signent les certificats SSL finaux.</span></p>
<p><span style="font-weight: 400;">C’est le terme “</span>**chaîne de confiance” **<span style="font-weight: 400;">(</span><span style="font-weight: 400;">que nous avons décrit plus haut) qui désigne ceci.</span></p>
<p><span style="font-weight: 400;">En effet, la certification peut s'effectuer en cascade. Un certificat peut permettre d'authentifier d'autres certificats jusqu'au certificat qui sera utilisé pour la communication.</span></p>
<p><span style="font-weight: 400;">Nous allons prendre par exemple le meilleur site au monde (oui c’est bientôt mon point individuel de fin d’année donc…  :p ) </span><a href="https://eleven-labs.com"><span style="font-weight: 400;">https://eleven-labs.com</span></a><span style="font-weight: 400;">.</span></p>
<p><span style="font-weight: 400;">On remarque plusieurs points :</span></p>
<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Eleven-labs n’a pas rempli toutes les infos concernant le site (tel que le type d’entreprise..... (pas bien !!!!)</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Le nom de l'émetteur (ici Let’s Encrypt), son algo de signature, les infos de la clé publique…</span></li>
<li style="font-weight: 400;">La hiérarchie du certificat ! On voit clairement que le certificat intermédiaire d’Eleven-labs qui est émis par Let’s Encrypt Authority X3 est **signé **<span style="font-weight: 400;">par DST Root CA X3</span></li>
</ol>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-26-à-11.15.04.png"><img class="size-medium wp-image-2705 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-26-à-11.15.04-202x300.png" alt="capture-decran-2016-11-26-a-11-15-04" width="202" height="300" /></a></p>
<h4>**Normes de certificat :**</h4>
<p><span style="font-weight: 400;">Les deux normes de certificat les plus utilisées aujourd'hui sont :</span></p>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">X.509, défini dans la </span><a href="https://tools.ietf.org/html/rfc5280"><span style="font-weight: 400;">RFC 5280</span></a><span style="font-weight: 400;"> ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">OpenPGP, défini dans la </span><a href="https://tools.ietf.org/html/rfc4880"><span style="font-weight: 400;">RFC 4880</span></a><span style="font-weight: 400;">.</span></li>
</ul>
<p><span style="font-weight: 400;">La différence notable entre ces deux normes est qu'un certificat X.509 ne peut contenir qu'un seul identifiant ; que cet identifiant doit contenir de nombreux champs prédéfinis ; et ne peut être signé que par une seule autorité de certification. </span></p>
<p><span style="font-weight: 400;">Un certificat OpenPGP peut contenir plusieurs identifiants, lesquels autorisent une certaine souplesse sur leur contenu, et peuvent ainsi être signés par une multitude d'autres certificats OpenPGP, permettant alors de construire des toiles de confiance.</span></p>
<p><span style="font-weight: 400;">Chaque certificat X.509 comprend :</span></p>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Le numéro de version du standard X.509 supporté par le certificat.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Le numéro de série du certificat. Chaque certificat émis par une autorité de certification (CA) a un numéro de série unique parmi les certificats émis par cette CA.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Algorithme de signature du certificat</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">DN (</span><i><span style="font-weight: 400;">Distinguished Name</span></i><span style="font-weight: 400;">) du délivreur (autorité de certification)</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Validité (dates limites)</span>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Pas avant</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Pas après</span></li>
</ul>
</li>
<li style="font-weight: 400;"><span style="font-weight: 400;">DN de l'objet du certificat</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Informations sur la clé publique</span>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Algorithme de la clé publique</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Clé publique proprement dite</span></li>
</ul>
</li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Identifiant unique du signataire (optionnel, X.509v2)</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Identifiant unique du détenteur du certificat (optionnel, X.509v2)</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Extensions (optionnel, à partir de X.509v3)</span>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Liste des extensions</span></li>
</ul>
</li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Signature des informations ci-dessus par l'autorité de certification</span></li>
</ul>
<h4>**"Signature" ? "Certificat signé" ?**</h4>
<p><span style="font-weight: 400;">Tout d’abord la fonction de signature doit répondre à plusieurs critères :</span></p>
<ul>
<li style="font-weight: 400;">**Authentique**<span style="font-weight: 400;"> : L'identité du signataire doit pouvoir être retrouvée de manière certaine ;</span></li>
<li style="font-weight: 400;">**Infalsifiable**<span style="font-weight: 400;"> : La signature ne peut pas être falsifiée. Quelqu'un ne peut se faire passer pour un autre ;</span></li>
<li style="font-weight: 400;">**Non réutilisable**<span style="font-weight: 400;"> : La signature n'est pas réutilisable. Elle fait partie du document signé et ne peut être déplacée sur un autre document ;</span></li>
<li style="font-weight: 400;">**Inaltérable**<span style="font-weight: 400;"> : Un document signé est inaltérable. Une fois qu'il est signé, on ne peut plus le modifier ;</span></li>
<li style="font-weight: 400;">**Irrévocable**<span style="font-weight: 400;"> : La personne qui a signé ne peut le nier.</span></li>
</ul>
<p><span style="font-weight: 400;">Procédure de signature (avec l’exemple du certificat d’Eleven-labs) :</span></p>
<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Let’s encrypt</span></li>
</ol>
<p><span style="font-weight: 400;">            A - Let’s Encrypt hash vos données avec du SHA-256</span></p>
<p><span style="font-weight: 400;">            B- Il chiffre le résultat du hash avec sa clé privé en RSA (4096 bits)</span></p>
<p><span style="font-weight: 400;">            C- Le résultat du chiffrement correspond à la signature</span></p>
<p><span style="font-weight: 400;">            D- Let’s Encrypt vous envoie votre certificat</span><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_1.jpg"><br />
<img class="alignnone size-medium wp-image-2707 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_1-300x229.jpg" alt="cert_1" width="300" height="229" /></a></p>
<ol>
<li style="font-weight: 400;">Client</li>
</ol>
<p><span style="font-weight: 400;">           A - Lors de la connexion à votre serveur, le client récupère votre certificat.</span></p>
<p><span style="font-weight: 400;">           B - Il hash votre certificat avec du SHA-256 (défini dans votre certificat)</span></p>
<p><span style="font-weight: 400;">           C - Il déchiffre la signature du certificat avec la clé publique récupérée dans le certificat.</span></p>
<p><span style="font-weight: 400;">           D - Il compare le résultat du hash avec le résultat du déchiffrement de la signature.</span></p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_2.jpg"><img class="size-medium wp-image-2708 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/cert_2-300x217.jpg" alt="cert_2" width="300" height="217" /></a></p>
<p><span style="font-weight: 400;">Si le résultat est le même alors on est sûr que les données que nous allons récupérer de ce serveur viennent bien d’Eleven-labs.</span></p>
<p><span style="font-weight: 400;"><em>Attention</em> : nous avons oublié une étape importante. En effet, comme indiqué plus haut, votre navigateur dispose d’un tas de clé publique CA dont </span><span style="font-weight: 400;">DST Root CA X3</span><span style="font-weight: 400;">.</span></p>
<p><span style="font-weight: 400;">Donc en amont de l’étape II, votre navigateur utilise la clé publique de </span><span style="font-weight: 400;">DST Root CA X3 afin de vérifier la signature du certificat intermédiaire Let’s Encrypt (chaîne de confiance).</span></p>
<p><span style="font-weight: 400;">Si la vérification est bonne alors le client passe à l’étape II.</span></p>
<h4>**Type de certificats :**</h4>
<p><span style="font-weight: 400;">Lorsque vous allez vouloir acheter un certificat auprès d’un tiers de confiance, celui-ci va vous proposer plusieurs types de certificats. Nous allons voir ensemble de quoi il s’agit :</span></p>
<ul>
<li style="font-weight: 400;">**Domain Validation (DV)**<span style="font-weight: 400;"> : Il authentifie uniquement le nom de domaine : il s’agit du certificat le plus répandu (c’est le cas de Let’s Encrypt).</span></li>
<li style="font-weight: 400;">**Business Validation (BV) ou Organization Validation (OV)**<span style="font-weight: 400;"> : Vous devez fournir à l’autorité de certification des documents officiels concernant votre entreprise ou association (KBis, Journal officiel, etc.). Après vérification, l’autorité émet un certificat qui relie votre domaine à votre entreprise. Le client peut alors voir sur son navigateur que le site correspond bien à votre société.</span></li>
<li style="font-weight: 400;">**Extended Validation (EV)**<span style="font-weight: 400;"> : Le plus exigeant en terme de certification (documents, délai d’émission, budget) mais aussi le plus rassurant pour vos clients et pour lutter contre le phishing, généralement utilisé par les grandes entreprises du fait de son coût élevé, il met clairement en avant votre société dans le navigateur (à côté de la barre d’adresse).</span></li>
</ul>
<p><span style="font-weight: 400;">Les certificats peuvent avoir une garantie allant de 10 000 € jusqu'à plus de 1 500 000 € si une faille de sécurité provient de leur certificat.</span></p>
<p>Aujourd'hui, il existe deux solutions qui vous permettent d'avoir un certificat sans payer :</p>
<ol>
<li>Let's encrypt, open source, sponsorisé par des acteurs important tel que mozilla, free, ovh...   C'est la solution que je vous recommande ! Si vous souhaitez mettre en place cette solution, je vous invite à aller voir un super tuto <a href="https://vincent.composieux.fr/article/installer-configurer-et-renouveller-automatiquement-un-certificat-ssl-let-s-encrypt" target="_blank">ici</a>.</li>
<li>Créer vous même un certificat dit **auto-signé**.</li>
</ol>
<p>Cependant, les certificats SSL auto-signés déclenchent des alertes de sécurité sur la plupart des navigateurs web car ils n'ont pas été vérifiés par une Autorité de Certification de confiance. La plupart du temps, ces alertes conseillent aux visiteurs de quitter la page pour des raisons de sécurité. Mais si vous passez par Let's Encrypt vous n'aurez pas ce type de problème.</p>
<h4>**Portée du certificat :**</h4>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Un seul domaine : suffisant pour votre site web, mais pas pour les autres services (mail, webmail, ftp, etc.)<br />
</span><span style="font-weight: 400;"><em>exemple</em>: www.hatem-ben-arfa.com</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Domaine + sous-domaine (</span>**wildcard**<span style="font-weight: 400;">) : idéal pour votre site web et les autres services.<br />
</span><span style="font-weight: 400;"><em>exemple</em> : *.hatem-ben-arfa.com (www.hatem-ben-arfa.com, ftp.hatem-ben-arfa.com, ...)</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Multi-domaine : généralement réservé aux grandes structures, agences web ou hébergeurs.<br />
</span><span style="font-weight: 400;"><em>exemple</em>: www.hatem-ben-arfa.com, www.estcequecestbientotleweekend.com, ...</span></li>
</ul>
{% endraw %}
