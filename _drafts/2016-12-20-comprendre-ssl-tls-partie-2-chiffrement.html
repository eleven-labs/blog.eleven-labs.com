---
layout: post
title: 'Comprendre le SSL/TLS : Partie 2 Chiffrement'
author: ibenichou
date: '2016-12-20 14:15:41 +0100'
date_gmt: '2016-12-20 13:15:41 +0100'
categories:
- Non classé
tags:
- sécurité
- SSL
- TLS
- Algorithmes
- Chiffrement
---
{% raw %}
<h4><span style="text-decoration: underline;"><b>Algorithmes symétriques :</b></span></h4>
<p><span style="font-weight: 400;">La </span><b>cryptographie symétrique</b><span style="font-weight: 400;">, également dite </span><b>à clé secrète</b><span style="font-weight: 400;">, est la plus ancienne forme de chiffrement. Elle permet à la fois de chiffrer et de déchiffrer des messages à l'aide d'un même mot clé.</span></p>
<p><span style="font-weight: 400;">Nous pouvons citer le chiffre de Jules César, qui consiste en un chiffrement par </span><b>décalage</b><span style="font-weight: 400;">.</span></p>
<p><span style="font-weight: 400;">C’est à dire que le texte chiffré s'obtient en remplaçant chaque lettre du texte clair original par une lettre à distance fixe, toujours du même côté, dans l'ordre de l'alphabet.</span></p>
<p style="text-align: center;"><i><span style="font-weight: 400;">Chiffre de Jules César</span></i></p>
<p style="text-align: center;"><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Caesar3.jpg"><img class="alignnone size-medium wp-image-2572" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Caesar3-300x127.jpg" alt="caesar3" width="300" height="127" /></a></p>
<p><span style="font-weight: 400;">Bien évidemment, nous parlons ici d'un algorithme enfantin pour notre époque, mais si vous avez compris le principe qui s'applique ici, alors vous avez compris la cryptographie symétrique. </span></p>
<p><span style="font-weight: 400;">On retrouve, dans la catégorie des </span><span style="font-weight: 400;">algorithmes</span><span style="font-weight: 400;"> symétriques, des monstres comme </span><a href="https://fr.wikipedia.org/wiki/Advanced_Encryption_Standard"><span style="font-weight: 400;">AES</span></a><span style="font-weight: 400;"> (ou encore </span><b>DES</b><span style="font-weight: 400;">, </span><b>TripleDES</b><span style="font-weight: 400;">, </span><b>IDEA</b><span style="font-weight: 400;">, </span><b>Blowfish</b><span style="font-weight: 400;">, </span><b>CAST</b><span style="font-weight: 400;">, </span><b>GOST</b><span style="font-weight: 400;">, </span><b>RC4</b><span style="font-weight: 400;">, </span><b>RC6…</b><span style="font-weight: 400;">) qui est le plus utilisé et également le plus sûr aujourd'hui. </span></p>
<p><span style="font-weight: 400;">Ce dernier utilise des clés de 128, 192 et jusqu'à 256 bits soit un chiffre de longueur 1.157920892373162*10^77… (bon courage :) ). Si vous ne savez pas quel algorithme prendre, choisissez AES.</span></p>
<p><span style="font-weight: 400;">Pour décrypter un message sans connaître la clé, on peut utiliser plusieurs méthodes telles que :</span></p>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Essayer toutes les clés possibles avec son ordinateur, ou bien avec un ordinateur très puissant spécialement fabriqué pour casser un algorithme précis (ce qui a été fait pour le DES...).</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Se baser sur une faiblesse mathématique de l'algorithme et trouver des moyens de décoder le message ou trouver une partie de la clé.</span></li>
</ul>
<p><span style="font-weight: 400;">L’avantage de ces types d’</span><span style="font-weight: 400;">algorithmes est qu’ils sont rapides. Ce qui nous arrange lorsque nous traitons un grand nombre de requêtes HTTP.</span></p>
<p><span style="font-weight: 400;">Cependant, ces types </span><span style="font-weight: 400;">d’</span><span style="font-weight: 400;">algorithmes comportent un problème. En effet, il faut envoyer la clé grâce à laquelle nous avons chiffré le message à un destinataire.</span></p>
<p><span style="font-weight: 400;">Comment envoyer de manière sécurisée la clé au destinataire pour qu'il puisse déchiffrer votre message ?</span></p>
<h4><span style="text-decoration: underline;"><b>Algorithmes asymétriques :</b></span></h4>
<p><span style="font-weight: 400;">À la différence des algorithmes symétriques, les algorithmes asymétriques fonctionnent avec </span><b>deux clés</b><span style="font-weight: 400;">. On peut les appeler aussi, algorithmes à </span><b>clé publique</b><span style="font-weight: 400;">.</span></p>
<p><span style="font-weight: 400;">Les deux algorithmes asymétriques les plus connus </span><span style="font-weight: 400;">sont :</span></p>
<ol>
<li style="font-weight: 400;"><a href="https://fr.wikipedia.org/wiki/Chiffrement_RSA"><span style="font-weight: 400;">RSA</span></a><span style="font-weight: 400;"> (de ses concepteurs </span><i><span style="font-weight: 400;">Rivest</span></i><span style="font-weight: 400;">, </span><i><span style="font-weight: 400;">Shamir</span></i><span style="font-weight: 400;"> et </span><i><span style="font-weight: 400;">Adleman</span></i><span style="font-weight: 400;">), qui est basé sur les nombres premiers.</span></li>
<li style="font-weight: 400;"><a href="https://fr.wikipedia.org/wiki/%C3%89change_de_cl%C3%A9s_Diffie-Hellman"><span style="font-weight: 400;">Diffie-Hellman</span></a><span style="font-weight: 400;">.</span></li>
</ol>
<p><span style="font-weight: 400;">Le serveur crée deux clés (privée et public). Il envoie sa clé publique au client et garde bien secrètement sa clé privée.</span></p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/schema_base_asymetrique.jpg"><img class="size-medium wp-image-2574 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/schema_base_asymetrique-300x155.jpg" alt="schema_base_asymetrique" width="300" height="155" /></a></p>
<p><span style="font-weight: 400;">Si le serveur souhaite envoyer des données, il chiffre celles-ci via la clé privée. </span><span style="font-weight: 400;">Le client pourra alors déchiffrer les données via la clé publique.</span></p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/schema_base_asymetrique_v3.jpg"><img class="size-medium wp-image-2575 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/schema_base_asymetrique_v3-300x155.jpg" alt="schema_base_asymetrique_v3" width="300" height="155" /></a></p>
<p><span style="font-weight: 400;">Inversement, pour envoyer des données au serveur, le client utilise la clé publique fournie par le serveur afin de chiffrer ses données. Le serveur utilise la clé privée afin de déchiffrer lesdites données.</span></p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/schema_base_asymetrique_v2.jpg"><img class="size-medium wp-image-2576 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/schema_base_asymetrique_v2-300x155.jpg" alt="schema_base_asymetrique_v2" width="300" height="155" /></a></p>
<p><span style="font-weight: 400;">Le serveur est le seul à pouvoir déchiffrer les messages chiffrés par la clé publique grâce à la clé privé.</span></p>
<p><span style="font-weight: 400;">Si un hacker espionne votre réseau il aura "uniquement" accès à la clé publique et donc ne pourra pas déchiffrer les données.</span></p>
<p><span style="font-weight: 400;">Cependant, </span><span style="font-weight: 400;">lorsque vous utilisez un algorithme comme le RSA qui effectue des opérations sur des nombres premiers, cela augmente énormément les temps de latences et consomme beaucoup de ressources. C'est pourquoi ces algorithmes sont uniquement utilisés pour l'échange des clés nécessaires à des techniques moins gourmandes.</span></p>
<p><span style="font-weight: 400;">De plus, </span><span style="font-weight: 400;">la transmission de la clé publique pose un problème dans le cas où celle-ci n'est pas sécurisée c'est à dire qu'un attaquant peut se positionner entre l'entité et son public en diffusant de fausses clés publiques (par le biais d'un faux site </span><span style="font-weight: 400;">web</span><span style="font-weight: 400;"> par exemple) puis intercepter toutes les communications, lui permettant d'usurper l'identité du diffuseur de clé publique et de créer une dite </span><a href="https://fr.wikipedia.org/wiki/Attaque_de_l'homme_du_milieu"><span style="font-weight: 400;">man in the middle</span></a><span style="font-weight: 400;">.</span></p>
<p><span style="font-weight: 400;">Rassurez-vous </span><span style="font-weight: 400;">les <strong>certificats</strong> peuvent résoudre ce problème grâce à la <strong>signature</strong> de tiers de confiance.</span></p>
{% endraw %}
