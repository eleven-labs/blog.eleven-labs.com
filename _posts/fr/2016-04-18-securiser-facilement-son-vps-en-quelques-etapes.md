---
layout: post
lang: fr
date: '2016-04-18'
categories: []
authors:
  - nkania
excerpt: >-
  Quelques commandes de bases qui permettent de sécuriser facilement et
  rapidement un serveur linux (protection ssh, iptables, fail2ban,...)
title: Sécuriser facilement son serveur linux en quelques étapes
slug: securiser-facilement-son-vps-en-quelques-etapes
oldCategoriesAndTags:
  - non classé
  - securite
  - linux
  - vps
  - serveur
permalink: /fr/securiser-facilement-son-vps-en-quelques-etapes/
---

Lorsque vous recevez votre serveur (vps/serveur dédié/...), il est important d'effectuer quelques actions afin de disposer d'un minimum de sécurité. Cet article n'est pas exhaustif et n'est pas forcément la meilleure manière de faire, il s'agit simplement des étapes que j'effectue à chaque fois que j'initialise un nouveau serveur ! Si vous avez des remarques/questions n'hésitez pas à m'en faire part en commentaire :)

Les commandes présentées ci-dessous sont basées sur une Debian, elles conviennent donc aussi à une Ubuntu mais il va falloir les adapter si vous utilisez une autre distrib :). De plus je n'utilise pas sudo donc il est possible que vous ayez à le rajouter si vous n'utilisez pas le compte root.

**Se connecter au serveur**

```bash
# ssh root@ip_du_serveur
```

 **Mettre à jour le serveur**

```bash
 # apt-get update && apt-get upgrade
```

Et si vous désirez mettre à jour votre distrib :

```bash
# apt-get dist-upgrade
```

** Ajouter un nouvel utilisateur**

Une bonne pratique est de ne pas utiliser le compte root directement, que ce soit pour la connexion au serveur comme nous verrons plus bas ou pour toute action ne nécessitant pas de droits spécifiques, il est donc important de créer un nouvel utilisateur.

```bash
# adduser username
```

Modifier le mot de passe root

```bash
# passwd
```

Attention, cette commande modifiera le mot de passe de l'utilisateur courant, donc si vous utilisez sudo vérifiez de bien être connecté en root !

**Désactiver le login en tant que root**

Comme indiqué précedemment il est courant de désactiver la connexion via le compte root, principalement pour éviter la plupart des attaques bruteforces qui tenteront de s'effectuer par cet utilisateur.

```bash
# vim /etc/ssh/sshd_config
```

Modifier la ligne "PermitRootLogin yes" en "PermitRootLogin no".

```bash
# systemctl restart ssh
```

Puis se déconnecter afin de se reconnecter avec son user créé précédemment.

**Utiliser des clés ssh pour renforcer la sécurité**

Vous pouvez aussi utiliser des clés ssh afin de ne plus utiliser de mot de passe, un exemple ici : [https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2){:rel="nofollow noreferrer"}

**Iptables : bloquer les ports non utilisés (DROP policy)**

Par défaut toute connexion est autorisée, nous allons donc faire en sorte de modifier ce comportement afin de refuser toute connexion sauf celles indiquées.

Vérifier que vous êtes bien en INPUT ACCEPT :

```bash
# iptables -L
```

Si vous n'avez pas la ligne suivante : `"Chain INPUT (policy ACCEPT)"` alors utilisez cette commande :

```bash
# iptables -t filter -P INPUT ACCEPT
```

Purger les règles existantes :

```bash
# iptables -F
```

/!\ Attention, ne jamais lancer cette commande lors que vous êtes en INPUT policy DROP sinon cela va bloquer votre connexion ssh et vous devrez passer par la console de rescue de votre hébergeur (si vous en avez une). Si vous voulez re-purger vos iptables, pensez à repasser l'INPUT en ACCEPT !

Garder les connexions actuelles (pour éviter de perdre sa connexion ssh actuelle lors de la prochaine commande :))

```bash
# iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
```

Autoriser le loopback :

```bash
# iptables -A INPUT -i lo -j ACCEPT
```

On indique que par défaut on refuse n'importe quelle connexion en entrée :

```bash
# iptables -P INPUT DROP
```

On autorise les connexions ssh (sur le port 22) :

```bash
# iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

On autorise les connexions web (ports 80 et 443), si vous en avez besoin bien entendu :

```bash
# iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```
```bash
# iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

Remarque : votre configuration sera remise à zéro si vous redémarrez votre serveur ! Pour faire en sorte qu'elle soit persistente vous pouvez utiliser iptables-persistent, un exemple ici : [https://serversforhackers.com/video/firewall-persisting-iptables-rules](https://serversforhackers.com/video/firewall-persisting-iptables-rules){:rel="nofollow noreferrer"}

/!\ Attention, si votre hébergeur vous a fourni une ipv6 pensez à appliquer ces règles dans l'iptables réservé aux ipv6 : ip6tables ! (rejouez les commandes ci-dessus en changeant iptables par ip6tables et pensez à les rendre persistent si vous le souhaitez).

**Fail2ban : éviter de vous faire bruteforce**

```bash
# apt-get install fail2ban
```
```bash
# vim /etc/fail2ban/jail.conf
```

Vous y trouverez une section réservée au ssh :
```bash
[ssh]

enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 6
```

Vous pouvez ici modifier le port utilisé (si jamais vous avez modifié votre port ssh) ou le nombre de maxretry (généralement je le met à 3).

Si vous voulez vérifier les filtres appliqués (par défaut il fonctionne pour n'importe quel utilisateur) :

```bash
# vim /etc/fail2ban/filter.d/sshd.conf
```

Voilà ! Cela ne vous permettra pas d'avoir le serveur le mieux sécurisé au monde mais il vous permettra au moins d'éviter les vecteurs d'attaques basique.

Comme indiqué au début n'hésitez pas à commenter cet article si vous avez des questions ou remarques, je suis preneur :)

Seeya !

