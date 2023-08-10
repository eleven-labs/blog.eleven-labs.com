---
lang: en
date: '2017-12-04'
slug: deploy-a-replicated-mongodb-on-aws-with-terraform-and-ansible
title: Deploy a replicated MongoDB on AWS with Terraform and Ansible
excerpt: >-
  I recently had the opportunity to deploy a MongoDB server on Amazon Web
  Services (AWS). In order to limit the problems of crash and data loss, it is
  also replicated with two other servers, ideally in a different geographical
  area to ensure high availability.
cover: >-
  /assets/2017-09-03-migrer-une-application-react-client-side-en-server-side-avec-nextjs/cover.jpg
authors:
  - vcomposieux
categories: []
keywords:
  - mongodb
  - aws
  - terraform
  - ansible
---

I recently had the opportunity to deploy a MongoDB server on Amazon Web Services (AWS). In order to limit the problems of crash and data loss, it is also replicated with two other servers, ideally in a different geographical area to ensure high availability.

To automate the creation of EC2 machines, I used [Terraform](https://www.terraform.io/) (and its `aws` provider) as well as Ansible](https://www.ansible.com/) for provisioning. This article describes the technical logic that we set up to achieve this.

## Context

So we have a MongoDB cluster composed of three EC2 instances (say, `t2. large` type).

Among these instances, MongoDB will elect a master server, called `primary` in the MongoDB language as well as slave servers, called `secondary`.

In order for these three servers to share the same data, we will need to create what MongoDB calls a [replica set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/), a data set.

What is important to note is that only the `primary` server will be able to read or write data. The `secondary` servers are there to take over in case the `primary` server is unavailable. This is possible thanks to an election that is launched automatically by MongoDB to elect a new `primary` server.

This is the target infrastructure we are looking for, for this replication:

![MongoDB Replication](/_assets/posts/2017-11-01-deployer-un-mongodb-replique-sur-aws-avec-terraform-et-ansible/replication.svg)


As you can see on this diagram, only the primary node is used for read/write, the other two replicas are there to synchronize the updated data of the primary server in real time as well as for the purpose of eventually becoming primary in turn, in case the current primary server would become unavailable.

The definition of a server (primary or secondary) is done through a majority election, which takes place between the servers. Thus, you will necessarily need to have at least three servers so that a majority can be constituted.

It is therefore impossible to define this replication model with only two servers in your cluster.

## Terraform: server creation

So let's move on to the creation of machines on AWS: we have made the choice of [Terraform](https://www.terraform.io) for this part, a resource automation tool.

Terraform is therefore a tool for industrializing infrastructure tasks such as, in our case, the creation of EC2 machines on our AWS account.

In order to create a MongoDB server (let's take the case of a first server), we use the following terraform code:

```
# EC2 Instance: MongoDB 1
resource "aws_instance" "mongodb_one" {
    availability_zone = "${var.AWS_REGION}a"

    tags {
        Name = "${var.ENVIRONMENT}-mongodb-one"
    }

    ami = "<your-ami-id>"

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

In this script, we therefore specify a new resource of the type `aws_instance` and name it `mongodb-one`.

This instance will be in the area `a` of our AWS region, defined as an environment variable.

We must also specify the AMI image (Amazon Image) that will be used on this instance. To do this, I invite you to select an AMI identifier from those available on Amazon, using this command via the AWS CLI for example:

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

You will have access to Ubuntu Hardy images supporting Amazon EBS (Elastic Block Storage) volumes.

The field you will be interested in is `ImageId`, which you must copy into your Terraform code.

We then specify the type of instance as well as the type of disk and sizing we want to use for our server.

You will notice that we specify a `security_groups' entry for our instance that is dynamic and actually points to another resource we have to declare.

So let's declare our security group for this MongoDB server:

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

Here, a bunch of rules are specified in our security group.

We need to allow the input ports `22` (SSH), `27017` (default port of MongoDB) and `27019` which is used by MongoDB to manage communication between servers.

You will notice that we allow here all the provenances in the `cidr_blocks` entry, it is obviously necessary to restrict these accesses as much as possible.

We are now finished with the Terraform part: we are able to create a MongoDB (EC2) server on AWS but we still have to provision the server.

## Ansible: provisioning

To provision the MongoDB server, we use an Ansible playbook. Here is the definition of the playbook:

```yaml
- hosts: db-mongodb
  become: yes
  roles:
  - project.provision.mongodb
```

The `db-mongodb` host corresponds to both the primary and secondary servers.

We distinguish these servers because we need to define a primary server first when we provision the cluster.

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

For the `db-mongodb` host we will therefore play a `project. provision. mongodb` role that we will need to perform the following actions:

* Installation and creation of a MongoDB system service
* Preparation of the MongoDB configuration file
* Activation of replication with other hosts
* Create user accounts
* Starting the MongoDB instance

So let's start with the installation and activation of MongoDB:

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

Nothing very special so far. Note that the `mongod. service` file is directly available in our Ansible code and can be variabilized on certain values.

This is also the case for the MongoDB configuration, which we also import to the server:

```yaml
- name: Copy MongoDB configuration file
  template:
    src: mongod.conf
    dest: /etc/mongod.conf
```

In order to enable replication, note that we need to specify in this configuration file, a set replica name (here, `rs0`):

```yaml
replication:
  replSetName: "rs0"
```

This replication will work only if the servers are able to communicate with each other.

It is also important to secure these exchanges, which is why we will create a key to authenticate the servers discussing with one another:

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

We create here the necessary key with `openssl`, copy it on the servers and specify it in the configuration file (a restart of MongoDB will be necessary to take this key into account).

Finally, let's boot or reboot our MongoDB servers using the system service previously created:

```yaml
- name: Restart mongodb
  command: systemctl restart mongodb.service
```

Now, when you connect to your different MongoDB servers, you will have the `PRIMARY` or `SECONDARY` element in the console, as in the example below, which allows you to know where you are:

```
root@mongodb:~# mongo --host localhost -u user -p<password> admin
MongoDB shell version: 3.2.17
connecting to: localhost:27017/admin
rs0:PRIMARY>
```

You can also check the configuration of your replication via the `rs. conf ()` command in the different MongoDB servers:

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

Thus, no more doubt about your configuration. You also have the option of giving weight to certain servers that will allow you to influence the elections of a new primary server in case of a failure on your cluster via the `priority` property.

## Conclusion

Deploying a MongoDB cluster with an active replication on a specified infrastructure via Terraform code and provisioned with Ansible is really very simple. Indeed, MongoDB makes things much easier for us because it only takes a few lines of configuration to activate replication.

The whole logic of primary server election and re-definition is managed by MongoDB.

To go further with MongoDB replication, I invite you to browse the official MongoDB documentation which explains very well, with diagrams, operation and the various configuration parameters available to configure your replicas:[https://docs.mongodb.com/v3.0/core/replication-introduction/#replication-introduction](https://docs.mongodb.com/v3.0/core/replication-introduction/#replication-introduction).
