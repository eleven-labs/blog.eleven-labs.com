---
contentType: tutorial-step
tutorial: graphql-avec-symfony
slug: installation-du-serveur-graphql
title: Installation du serveur GraphQL
---
### Installation de docker

Si vous souhaitez utiliser [Docker](https://www.docker.com/), je vous invite à cloner le projet [github](https://github.com/duck-invaders/graphql-symfony).

Une fois cloné vous pouvez lancer :

```bash
docker-compose up -d
```

vous devez aussi ajouter la ligne suivante dans votre `/etc/hosts` :

```
127.0.0.1 symfony.local
```

Si vous travaillez dans le container docker, les commandes suivantes doivent être lancées dans la machine docker :

```bash
docker-compose exec php sh
```

### Installer Symfony

Comme nous utilisons un Symfony 4, nous allons mettre en place `flex`.

Pour l'installation vous n'avez qu'à lancer la commande suivante :

```bash
composer create-project symfony/skeleton symfony
```

Si tout est ok, vous devriez avoir la page de base de Symfony à l'adresse suivante [http://symfony.localhost/](http://symfony.localhost/)

![symfony]({BASE_URL}/imgs/tutorials/2018-03-28-graphql-avec-symfony/symfony.png)

Retrouvez le code directement [ici](https://github.com/duck-invaders/graphql-symfony/tree/codelabs-step1)