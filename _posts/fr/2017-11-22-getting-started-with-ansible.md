---
layout: post
title: Commencer avec Ansible, cas concret pour initialiser un VPS
excerpt: Découvrons Ansible en créant un script qui permet d'initialiser un VPS (appliquer les règles de base + sécurité)
authors:
    - nkania
permalink: /fr/getting-start-with-ansible/
lang: fr
categories:
    - Non classé
tags:
    - linux
    - vps
    - serveur
    - ansible
cover: /assets/2017-11-22-getting-started-with-ansible/cover.jpg
---

## Commencer avec Ansible

Quoi de mieux qu'un cas concret pour découvrir et apprendre à utiliser un nouvel outil ? On va donc voir ensemble comment se lancer avec Ansible et ne plus répéter manuellement les mêmes étapes pour chaque nouveau serveur. Cet article va donc se baser sur un précédent qui vous présentait [les bases de la sécurisation d'un nouveau serveur](
/fr/securiser-facilement-son-vps-en-quelques-etapes/).

C'est parti !

### Introduction

Ansible est un outil qui permet d'automatiser le provisionning de serveur (jouer des commandes sur ceux-ci). Le but est donc de vous faire gagner du temps lorsque vous devez administrer vos systèmes et éviter les tâches répétitives. Il ne nécessite que peu de choses pour fonctionner : python et openssh (on peut donc l'utiliser sur presque tous les systèmes d'exploitation). De plus il utilise le langage YAML pour gérer ses configurations, qui est très simple d'utilisation.

### Installation

Bon, pour cette partie rien de spécial, je vous renvoie sur la doc afin que vous puissiez [installer Ansible sur votre OS](http://docs.ansible.com/ansible/latest/intro_installation.html#installing-the-control-machine){rel="nofollow noreferrer"}.

### Configuration

La première chose à faire, c'est d'ajouter l'adresse ip ou hostname de notre serveur dans le fichier hosts de Ansible :

```bash
# vim /etc/ansible/hosts
```

Dans mon exemple j'utilise un VPS chez OVH avec comme distrib ubuntu 16.04, l'installation se fait de base avec juste un user root et une authentification par password, du coup pour tester la connexion on va utiliser la commande suivante :

```bash
# ansible hostname -m ping -u root --ask-pass
```

Si comme moi vous recevez l'erreur `/bin/sh: 1: /usr/bin/python: not found\r\n` pas de soucis c'est juste qu'il faut installer le package python-minimal sur son serveur avec la commande suivante (pour ubuntu) :

```bash
# sudo apt install python-minimal
```

### Script

Maintenant qu'Ansible a accès à notre serveur on peut passer aux choses sérieuses, à savoir notre configuration à proprement parler (Playbook dans le langage Ansible), les choses que l'on veut installer sur notre serveur et les configurations que l'on souhaite modifier.

```yaml
---
- hosts: all
  vars:
    username: username
    password: *******
  tasks:
    - name: Upgrade packages
      apt: upgrade=safe

    - name: Install base packages
      apt:
        name: "{% raw %}{{ item }}{% endraw %}"
        state: present
        update_cache: yes
      with_items:
        - fail2ban
        - iptables-persistent

    - name: Add non-root user
      user:
        name: "{% raw %}{{ username }}{% endraw %}"
        password: "{% raw %}{{ password }}{% endraw %}"
        shell: /bin/bash
        update_password: on_create
        state: present

    - name: Disable root login
      lineinfile:
        dest: /etc/ssh/sshd_config
        regexp: "^PermitRootLogin"
        line: "PermitRootLogin no"
        state: present

    - name: Restart ssh
      service:
        name: ssh
        state: restarted

    - name: Add iptables v4 rules
      action: copy src=iptables.rules dest=/etc/iptables/rules.v4 owner=root group=root mode=0644

    - name: Add iptables v6 rules
      action: copy src=iptables.rules dest=/etc/iptables/rules.v6 owner=root group=root mode=0644

    - name: Restart iptables-persistent
      service:
        name: netfilter-persistent
        state: restarted

```

On voit que le script est séparé en plusieurs parties :

 - hosts : permet de déclarer les hosts (ou groups) sur lesquels le playbook doit se jouer.

 - vars : ici on déclare nos variables, dans notre cas username et password. Pour username il s'agit de l'utilisateur qu'Ansible va créer plus loin et le password est un hash du password à assigner à cet utilisateur. Pour générer ce hash vous pouvez utiliser la commande suivante :

```python
# python -c 'import crypt; print crypt.crypt("mon password", "$1$SomeSalt$")'
```

 - tasks : les différentes étapes que notre playbook va devoir jouer :

  - Mettre à jour la distribution installée
  - Installer les paquets dont on a besoin (ici : fail2ban et iptables-persistent)
  - Ajout un nouvel utilisateur qu'on utilisera pour se connecter en ssh au serveur par la suite
  - Désactiver le fait que le compte root puisse se connecter via ssh
  - Redémarrer le serveur ssh pour prendre en compte nos modifications
  - Ajouter nos règles iptables v4
  - Ajouter nos règles iptables v6 (si notre serveur possède une ipv6 bien entendu)
  - Redémarrer le service iptables-persistent (attention dans mon cas j'ai testé sur une ubuntu qui a renommé le service iptables-persistent en netfiler-persistent !)

Cela reste minimaliste, on peut bien entendu étoffer le playbook afin de changer le port ssh, rajouter des règles fail2ban, etc. Mais le but ici est simplement de vous présenter l'outil et son fonctionnement.

Je vous ai mis un exemple concret de répertoire Ansible ici : [github.com/snroki/ansible](https://github.com/snroki/ansible){:rel="nofollow noreferrer"}

Le répertoire possède plusieurs fichiers :

- main.yml (qui est le fichier que j'ai recopié au dessus) : permet de définir les tasks qu'Ansible va devoir effectuer (une bonne pratique est de séparer les différentes "étapes" en plusieurs fichiers)
- ansible.cfg : permet d'indiquer à Ansible qu'il faut qu'il utilise le fichier hosts de ce dossier et qu'il ne doit pas vérifier le ou les host(s) auxquels il doit se connecter
- iptables.rules : les règles iptables qu'on veut exécuter sur nos serveurs
- hosts : le fichier qui contient la liste des serveurs où exécuter Ansible

### Exécution du playbook

Vous pouvez cloner le repository ci-dessus ou créer le votre. Une fois fait voici la commande à exécuter afin de lancer Ansible :

```bash
# ansible-playbook main.yml -uroot --ask-pass
```

Si tout se passe bien vous devriez vous retrouver avec un récap qui vous indique ce qu'il s'est passé.

Vous pouvez maintenant vous connecter à votre serveur en utilisant le username et password indiqués plus haut !

C'est tout pour cet article, si vous avez des questions/remarques n'hésitez pas !

Seeya !
