---
layout: post
title: Sécuriser facilement son serveur linux en quelques étapes
author: nkania
date: '2016-04-18 14:48:08 +0200'
date_gmt: '2016-04-18 12:48:08 +0200'
categories:
- Non classé
tags:
- sécurité
- linux
- vps
- serveur
---
{% raw %}
Lorsque vous recevez votre serveur (vps/serveur dédié/...), il est important d'effectuer quelques actions afin de disposer d'un minimum de sécurité. Cet article n'est pas exhaustif et n'est pas forcément la meilleure manière de faire, il s'agit simplement des étapes que j'effectue à chaque fois que j'initialise un nouveau serveur ! Si vous avez des remarques/questions n'hésitez pas à m'en faire part en commentaire :)

Les commandes présentées ci-dessous sont basées sur une Debian, elles conviennent donc aussi à une Ubuntu mais il va falloir les adapter si vous utilisez une autre distrib :). De plus je n'utilise pas sudo donc il est possible que vous ayez à le rajouter si vous n'utilisez pas le compte root.

### Se connecter au serveur
<pre class="lang:default decode:true"># ssh root@ip_du_serveur</pre>
###  Mettre à jour le serveur
<pre class="lang:default decode:true"># apt-get update &amp;&amp; apt-get upgrade</pre>
Et si vous désirez mettre à jour votre distrib :

<pre class="lang:default decode:true"># apt-get dist-upgrade</pre>
### Ajouter un nouvel utilisateur
Une bonne pratique est de ne pas utiliser le compte root directement, que ce soit pour la connexion au serveur comme nous verrons plus bas ou pour toute action ne nécessitant pas de droits spécifiques, il est donc important de créer un nouvel utilisateur.

<pre class="lang:default decode:true"># adduser username</pre>
### Modifier le mot de passe root
<pre class="lang:default decode:true"># passwd</pre>
Attention, cette commande modifiera le mot de passe de l'utilisateur courant, donc si vous utilisez sudo vérifiez de bien être connecté en root !

### Désactiver le login en tant que root
Comme indiqué précedemment il est courant de désactiver la connexion via le compte root, principalement pour éviter la plupart des attaques bruteforces qui tenteront de s'effectuer par cet utilisateur.

<pre class="lang:default decode:true"># vim /etc/ssh/sshd_config</pre>
Modifier la ligne "PermitRootLogin yes" en "PermitRootLogin no".

<pre class="lang:default decode:true"># systemctl restart ssh</pre>
Puis se déconnecter afin de se reconnecter avec son user créé précédemment.

### Utiliser des clés ssh pour renforcer la sécurité
Vous pouvez aussi utiliser des clés ssh afin de ne plus utiliser de mot de passe, un exemple ici : <a href="https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2">https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2</a>

### Iptables : bloquer les ports non utilisés (DROP policy)
Par défaut toute connexion est autorisée, nous allons donc faire en sorte de modifier ce comportement afin de refuser toute connexion sauf celles indiquées.

Vérifier que vous êtes bien en INPUT ACCEPT :

<pre class="lang:default decode:true"># iptables -L</pre>
Si vous n'avez pas la ligne suivante : <span class="message_body">"Chain INPUT (policy ACCEPT)" alors utilisez cette commande :</span>

<pre class="lang:default decode:true"># iptables -t filter -P INPUT ACCEPT</pre>
Purger les règles existantes :

<pre class="lang:default decode:true"># iptables -F</pre>
/!\ Attention, ne jamais lancer cette commande lors que vous êtes en INPUT policy DROP sinon cela va bloquer votre connexion ssh et vous devrez passer par la console de rescue de votre hébergeur (si vous en avez une). Si vous voulez re-purger vos iptables, pensez à repasser l'INPUT en ACCEPT !

Garder les connexions actuelles (pour éviter de perdre sa connexion ssh actuelle lors de la prochaine commande :))

<pre class="lang:default decode:true"># iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT</pre>
Autoriser le loopback :

<pre class="lang:default decode:true"># iptables -A INPUT -i lo -j ACCEPT</pre>
On indique que par défaut on refuse n'importe quelle connexion en entrée :

<pre class="lang:default decode:true"># iptables -P INPUT DROP</pre>
On autorise les connexions ssh (sur le port 22) :

<pre class="lang:default decode:true"># iptables -A INPUT -p tcp --dport 22 -j ACCEPT</pre>
On autorise les connexions web (ports 80 et 443), si vous en avez besoin bien entendu :

<pre class="lang:default decode:true"># iptables -A INPUT -p tcp --dport 80 -j ACCEPT
# iptables -A INPUT -p tcp --dport 443 -j ACCEPT</pre>
Remarque : votre configuration sera remise à zéro si vous redémarrez votre serveur ! Pour faire en sorte qu'elle soit persistente vous pouvez utiliser iptables-persistent, un exemple ici : <a href="https://serversforhackers.com/video/firewall-persisting-iptables-rules">https://serversforhackers.com/video/firewall-persisting-iptables-rules</a>

/!\ Attention, si votre hébergeur vous a fourni une ipv6 pensez à appliquer ces règles dans l'iptables réservé aux ipv6 : ip6tables ! (rejouez les commandes ci-dessus en changeant iptables par ip6tables et pensez à les rendre persistent si vous le souhaitez).

### Fail2ban : éviter de vous faire bruteforce
<pre class="lang:default decode:true"># apt-get install fail2ban
# vim /etc/fail2ban/jail.conf</pre>
Vous y trouverez une section réservée au ssh :

<pre class="lang:default decode:true">[ssh]

enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 6</pre>
Vous pouvez ici modifier le port utilisé (si jamais vous avez modifié votre port ssh) ou le nombre de maxretry (généralement je le met à 3).

Si vous voulez vérifier les filtres appliqués (par défaut il fonctionne pour n'importe quel utilisateur) :

<pre class="lang:default decode:true"># vim /etc/fail2ban/filter.d/sshd.conf
</pre>
&nbsp;

Voilà ! Cela ne vous permettra pas d'avoir le serveur le mieux sécurisé au monde mais il vous permettra au moins d'éviter les vecteurs d'attaques basique.

Comme indiqué au début n'hésitez pas à commenter cet article si vous avez des questions ou remarques, je suis preneur :)

&nbsp;

Seeya !

{% endraw %}
