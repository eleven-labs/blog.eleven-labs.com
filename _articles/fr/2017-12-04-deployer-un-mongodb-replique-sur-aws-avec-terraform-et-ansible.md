---
contentType: article
lang: fr
date: '2017-12-04'
slug: deployer-un-serveur-mongodb-replique-sur-aws-avec-terraform-et-ansible
title: Déployer un serveur MongoDB répliqué sur AWS avec Terraform et Ansible
excerpt: >-
  J'ai récemment eu l'occasion de déployer un serveur MongoDB sur Amazon Web
  Services (AWS). Afin de limiter les problèmes de crash et de perte de données,
  celui-ci est également répliqué avec deux autres serveurs, idéalement dans une
  zone géographique différente pour assurer de la haute disponibilité.
cover: >-
  /assets/2017-09-03-migrer-une-application-react-client-side-en-server-side-avec-nextjs/cover.jpg
categories: []
authors:
  - vcomposieux
keywords:
  - mongodb
  - aws
  - terraform
  - ansible
---

J'ai récemment eu l'occasion de déployer un serveur MongoDB sur Amazon Web Services (AWS). Afin de limiter les problèmes de crash et de perte de données, celui-ci est également répliqué avec deux autres serveurs, idéalement dans une zone géographique différente pour assurer de la haute disponibilité.

Pour l'automatisation de la création des machines EC2, j'ai utilisé [Terraform](https://www.terraform.io/) (et son provider `aws`) ainsi que [Ansible](https://www.ansible.com/) pour le provisionnement. Cet article décrit la logique technique que nous avons mis en place pour y arriver.

## Contexte

Nous avons donc un cluster MongoDB composé de trois instances EC2 (disons de type `t2.large`).

Parmi ces instances, MongoDB va élire un serveur master, appelé `primaire` dans le langage MongoDB ainsi que des serveurs slaves, appelés `secondaires`.

Afin que ces trois serveurs se partagent les mêmes données, nous allons devoir créer ce que MongoDB appelle un [replica set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/), soit un ensemble de données.

Ce qu'il est important de noter est que seul le serveur `primaire` pourra lire ou écrire des données. Les serveurs `secondaires` sont là pour prendre le relai au cas ou le serveur `primaire` serait amené à être indisponible. Ceci est possible grâce à une élection qui est lancée automatiquement par MongoDB pour élire un nouveau serveur `primaire`.

Voici donc l'infrastructure cible que nous cherchons à obtenir pour cette réplication :

![MongoDB Replication](/_assets/articles/2017-11-01-deployer-un-mongodb-replique-sur-aws-avec-terraform-et-ansible/replication.svg)


Comme vous pouvez le voir sur ce schéma, seul le noeud primaire est utilisé pour la lecture/écriture, les deux autres réplicas sont là pour la synchronisation des données à jour du serveur primaire en temps réel ainsi que dans le but d'éventuellement devenir primaire à leur tour, dans le cas ou le serveur primaire actuel deviendrait indisponible.

La définition d'un serveur (primaire ou secondaire) se fait via le biais d'une élection à la majorité, qui a lieu entre les serveurs. Ainsi, vous aurez forcément besoin d'avoir au minimum trois serveurs afin qu'une majorité puisse être constituée.

Impossible donc de définir ce modèle de réplication avec seulement deux serveurs dans votre cluster.

## Terraform : création des serveurs

Passons maintenant à la création des machines sur AWS : nous avons fait le choix de [Terraform](https://www.terraform.io) pour cette partie, un outil d'automatisation de ressources.

Terraform est un outil permettant d'industrialiser des tâches d'infrastructure telles que, dans notre cas, la création de machines EC2 sur notre compte AWS.

Afin de créer un serveur MongoDB (prenons ici le cas d'un premier serveur), nous utilisons le code terraform suivant :

```
# EC2 Instance: MongoDB 1
resource "aws_instance" "mongodb_one" {
    availability_zone = "${var.AWS_REGION}a"

    tags {
        Name = "${var.ENVIRONMENT}-mongodb-one"
    }

    ami = "<votre-id-ami>"

    instance_type = "t2.large"

    root_block_device {
        volume_type = "gp2"
        volume_size = "100"
    }

    security_groups = [
        "${aws_security_group.mongodb.name}"
    ]

    associate_public_ip_address = true

    key_name = "id_rsa"
}
```

Dans ce script, nous spécifions une nouvelle ressource de type `aws_instance` et la nommons `mongodb-one`.

Cette instance sera dans la zone `a` de notre région AWS, définie en variable d'environnement.

Nous devons également spécifier l'image AMI (Amazon Image) qui sera utilisée sur cette instance. Pour ce faire, je vous invite à sélectionner un identifiant d'AMI parmi ceux disponibles sur Amazon, en utilisant cette commande via le CLI AWS par exemple :

```json
$ aws ec2 describe-images --filters "Name=root-device-type,Values=ebs" "Name=name,Values=ubuntu*hardy*"

[
    {
        "Architecture": "x86_64",
        "CreationDate": "2011-10-07T09:09:03.000Z",
        "ImageId": "ami-ffecde8b",
        "ImageLocation": "063491364108/ubuntu-8.04-hardy-server-amd64-20111006",
        "ImageType": "machine",
        "Public": true,
        "KernelId": "aki-4cf5c738",
        "OwnerId": "063491364108",
        "RamdiskId": "ari-2ef5c75a",
        "State": "available",
        "BlockDeviceMappings": [
            {
                "DeviceName": "/dev/sda1",
                "Ebs": {
                    "Encrypted": false,
                    "DeleteOnTermination": true,
                    "SnapshotId": "snap-eb7aa883",
                    "VolumeSize": 8,
                    "VolumeType": "standard"
                }
            },
            {
                "DeviceName": "/dev/sdb",
                "VirtualName": "ephemeral0"
            }
        ],
        "Description": "Ubuntu 8.04 Hardy server amd64 20111006",
        "Hypervisor": "xen",
        "Name": "ubuntu-8.04-hardy-server-amd64-20111006",
        "RootDeviceName": "/dev/sda1",
        "RootDeviceType": "ebs",
        "VirtualizationType": "paravirtual"
    }
    ...
]
```

Vous aurez ainsi accès aux images Ubuntu Hardy supportant les volumes EBS (Elastic Block Storage) Amazon.

Le champ qui vous intéressera est bien sûr `ImageId`, que vous devez copier dans votre code Terraform.

Nous spécifions ensuite le type d'instance ainsi que le type de disque et le sizing que nous souhaitons utiliser pour notre serveur.

Ensuite, vous noterez également que nous spécifions une entrée `security_groups` (groupe de sécurité) pour notre instance qui est dynamique et qui pointe en fait sur une autre ressource que nous avons à déclarer.

Ainsi, déclarons notre groupe de sécurité pour ce serveur MongoDB :

```
# MongoDB security group
resource "aws_security_group" "mongodb" {
  name        = "mongodb-${var.ENVIRONMENT}"
  description = "Security group for mongodb-${var.ENVIRONMENT}"

  tags {
    Name = "mongodb-${var.ENVIRONMENT}"
  }
}

resource "aws_security_group_rule" "mongodb_allow_all" {
  type            = "egress"
  from_port       = 0
  to_port         = 0
  protocol        = "-1"
  cidr_blocks     = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.mongodb.id}"
}

resource "aws_security_group_rule" "mongodb_ssh" {
  type            = "ingress"
  from_port       = 22
  to_port         = 22
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.mongodb.id}"
}

resource "aws_security_group_rule" "mongodb_mongodb" {
  type            = "ingress"
  from_port       = 27017
  to_port         = 27017
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.mongodb.id}"
}

resource "aws_security_group_rule" "mongodb_mongodb_replication" {
  type            = "ingress"
  from_port       = 27019
  to_port         = 27019
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.mongodb.id}"
}
```

Ici, un tas de règles sont spécifiées dans notre groupe de sécurité.

Nous avons en effet besoin d'autoriser en entrée les ports `22` (SSH), `27017` (port par défaut de MongoDB) ainsi que `27019` qui est utilisé par MongoDB pour gérer les communications entre les serveurs.

Vous noterez que l'on autorise ici toutes les provenances dans l'entrée `cidr_blocks`, bien évidemment il faut dans les faits restreindre au maximum ces accès.

Nous en avons terminé avec la partie Terraform : nous sommes capables de créer un serveur MongoDB (EC2) sur AWS mais il nous reste à provisionner le serveur.

## Ansible : provisioning

Pour provisionner le serveur MongoDB, nous utilisons un playbook Ansible. Voici la définition du playbook :

```yaml
- hosts: db-mongodb
  become: yes
  roles:
  - project.provision.mongodb
```

Le host `db-mongodb` correspond à la fois au serveur primaire et aux serveurs secondaires.

Nous distinguons ces serveurs car nous devons définir un premier serveur primaire lorsque nous allons provisionner le cluster.

```
# Primary server
[db-mongodb-master]
<adresse ip> ansible_user=root

# Secondary servers
[db-mongodb-slave-1]
<adresse ip> ansible_user=root

[db-mongodb-slave-2]
<adresse ip> ansible_user=root

# MongoDB Groups
[db-mongodb-slave:children]
db-mongodb-slave-1
db-mongodb-slave-2

[db-mongodb:children]
db-mongodb-master
db-mongodb-slave
```

Pour le host `db-mongodb` nous allons jouer un rôle `project.provision.mongodb` dont nous allons avoir le besoin d'effectuer les actions suivantes :

* Installation et création d'un service système MongoDB
* Préparation du fichier de configuration MongoDB
* Activation de la réplication avec les autres hosts
* Création des comptes utilisateurs
* Démarrage de l'instance MongoDB

Commençons par l'installation et l'activation de MongoDB :

```yaml
- name: Install mongodb
  apt:
    name: mongodb-org
    state: present
    allow_unauthenticated: yes

- name: Create systemd service file
  template:
    src: mongod.service
    dest: /etc/systemd/system/mongodb.service

- name: Enable Mongod service
  command: systemctl enable mongodb.service
  become: yes
  when: env == 'dev'
```

Rien de très spécial jusque-là. Notez que le fichier `mongod.service` est directement disponible dans notre code Ansible et peut être variabilisé sur certaines valeurs.

C'est également le cas pour la configuration MongoDB que nous importons aussi sur le serveur :

```yaml
- name: Copy MongoDB configuration file
  template:
    src: mongod.conf
    dest: /etc/mongod.conf
```

Afin d'activer la réplication, notez que nous avons besoin de spécifier dans ce fichier de configuration, un nom de replica set (ici, `rs0`) :

```yaml
replication:
  replSetName: "rs0"
```

Cette réplication fonctionnera uniquement dans le cas où les serveurs peuvent communiquer entre eux.

Il est également important de sécuriser ces échanges, c'est pourquoi nous allons également créer une clé qui aura pour but d'authentifier les serveurs discutant entre eux :

```yaml
- name: Prepare authorization key file
  local_action: shell openssl rand -base64 756 > {{ playbook_dir }}/passwords/{{ env }}/mongodb-key
  when: database_replica_type == "master"

- name: Create mongodb home directory
  file:
    state: directory
    path: /home/mongodb
    owner: mongodb
    group: mongodb
    mode: 0755

- name: Copies key to both master and slaves
  copy:
    src: "{{ playbook_dir + '/passwords/' + env + '/mongodb-key'}}"
    dest: /home/mongodb/mongodb-key
    owner: mongodb
    group: mongodb
    mode: 0400
  when: database_replica_type != false

- name: Add key to mongodb configuration
  lineinfile:
    dest: /etc/mongod.conf
    state: present
    regexp: '#  keyFile:'
    line: '  keyFile: /home/mongodb/mongodb-key'
    backrefs: yes
  when: database_replica_type != false
```

Nous créons ici la clé nécessaire avec `openssl`, la copions sur les serveurs et la spécifions dans le fichier de configuration (un redémarrage de MongoDB sera nécessaire ensuite afin de prendre en compte cette clé).

Finalement, démarrons ou redémarrons nos serveurs MongoDB à l'aide du service système précédemment créé :

```yaml
- name: Restart mongodb
  command: systemctl restart mongodb.service
```

Lorsque vous vous connecterez ensuite à vos différents serveurs MongoDB, vous aurez donc l'élément `PRIMARY` ou `SECONDARY` dans la console, comme dans l'exemple ci-dessous, ce qui vous permet de savoir où vous vous situez :

```
root@mongodb:~# mongo --host localhost -u user -p<password> admin
MongoDB shell version: 3.2.17
connecting to: localhost:27017/admin
rs0:PRIMARY>
```

Vous pouvez également vérifier la configuration de votre réplication via la commande `rs.conf()` dans les différents serveurs MongoDB :

```
rs0:PRIMARY> rs.conf()
{
	"_id" : "rs0",
	"version" : 3,
	"protocolVersion" : NumberLong(1),
	"members" : [
		{
			"_id" : 0,
			"host" : "<ip1>:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {

			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 1,
			"host" : "<ip2>:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {

			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		},
		{
			"_id" : 2,
			"host" : "<ip3>:27017",
			"arbiterOnly" : false,
			"buildIndexes" : true,
			"hidden" : false,
			"priority" : 1,
			"tags" : {

			},
			"slaveDelay" : NumberLong(0),
			"votes" : 1
		}
	],
    ...
```

Ainsi, plus de doute sur votre configuration. Vous avez également la possibilité de donner du poids à certains serveur, ce qui permettra d'influencer les élections d'un nouveau serveur primaire en cas de panne sur votre cluster via la propriété `priority`.

## Conclusion

Déployer un cluster MongoDB avec un réplication active sur une infrastructure spécifiée via du code Terraform et provisionnée avec Ansible est vraiment très simple. En effet, MongoDB nous facilite beaucoup les choses car il ne suffit que de quelques lignes de configuration pour activer la réplication.

Toute la logique d'élection et de re-définition de serveur primaire est gérée par MongoDB.

Pour aller plus loin au niveau de la réplication MongoDB, je vous invite à parcourir la documentation officielle de MongoDB qui explique très bien, avec des schémas, le fonctionnement et les différents paramètres de configuration disponibles pour configurer au mieux vos réplicas : [https://docs.mongodb.com/v3.0/core/replication-introduction/#replication-introduction](https://docs.mongodb.com/v3.0/core/replication-introduction/#replication-introduction).
