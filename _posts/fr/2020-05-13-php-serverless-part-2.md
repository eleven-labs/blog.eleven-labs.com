---
layout: post
title: "PHP & Serverless avec Bref - part 2"
lang: fr
permalink: /fr/php-serverless-part-2/
excerpt: "Comment déployer des applications PHP sur AWS Lambda avec Bref"
authors:
    - marishka
categories:
    - php
    - serverless
    - bref
tags:
    - php
    - serverless
    - aws
    - bref
    - lambda

---

Cet article est la suite d'un ([premier article](https://blog.eleven-labs.com/fr/php-serverless-part-1/) qui fait l'introduction du Serverless. Dans cette deuxième partie, nous allons d'abord voir ce que sont les *layers* dans AWS Lambda et comment les implémenter. Ensuite, nous verrons l'utilisation du framework Bref.

## AWS Lambda

### Fonctionnement

Un environnement AWS Lambda inclut :

-   L'environnement d'exécution (runtime) du langage choisi (Java, Go, PowerShell, Node.js, C#, Python, Ruby par défaut)
-   L'implémentation de *Lambda runtime API*, c'est à dire le cycle de vie de l'exécution de l'environnement et l'invocation des fonctions Serverless

Le cycle de vie d'un environnement d'exécution Lambda est composé d'une phase d'initialisation et de plusieurs (autant que nécessaire) phases d'invocation.

La phase d'initialisation représente le temps entre le moment où l'environnement démarre le runtime et le moment où le code d'une fonction est exécuté. Cette phase n'est exécutée qu'une seule fois durant le cycle de vie de l'environnement.

Après l'initialisation, l'environnement d'exécution se met dans la phase d'invocation et va sans cesse vérifier et exécuter des tâches, et ce jusqu'à ce que l'environnement s'éteigne.

Depuis novembre 2018, il est possible de déclarer ses propres environnements d'exécution pour des fonctions Lambda, mais aussi d'y incorporer des composants réutilisables sous forme de *Layers*.

On peut implémenter un runtime dans n'importe quel langage. Un runtime est un programme qui exécute le `handler` d'une fonction Lambda lorsqu'elle est appelée. Un runtime peut être inclus dans le package de déploiement d'une fonction sous forme d'un fichier exécutable nommé `bootstrap` (nous verrons un exemple plus bas dans l'article).

### Layers

Une fonction Lambda peut être configurée pour télécharger du code et du contenu additionnel sous forme d'un layer. Un layer est une archive ZIP qui contient des librairies, un runtime personnalisé ou d'autres dépendances.

Si vous avez déjà écrit des fonctions serverless en Node.js, vous savez qu'il faut packager tout le dossier `node_modules` pour chacune des fonctions (puisqu'elles sont déployées de façon indépendante les unes des autres). Ceci ralentit le process de déploiement et rend les builds lents.

Mais désormais il est possible de publier le dossier `node_modules` sous forme d'un Layer partagé et réutilisable pour toutes nos fonctions. Cela veut dire que l'on pourrait avoir un layer pour notre runtime custom, un autre layer qui contient nos dépendances et configurer nos fonctions pour utiliser ces 2 layers. Notez qu'une fonction a une limite de 5 layers.

### Exemple

**Fonction PHP**

Prenons la fonction suivante simple comme exemple :

```php
// src/profession.php
function occupation()
{
    $jobs = [
        'Fireman',
        'Astronaut',
        'Super hero',
        'Pilot',
        'Professional cook',
        'Artist',
    ];

    return ['occupation' => $jobs[array_rand($jobs)]];
}
```

**Layer PHP**

Je vais créer un dossier `layers/php` dans mon application et je vais y placer mon layer.
Pour créer un runtime custom, nous avons besoin d'un fichier `bootstrap` qui contiendra la logique de notre runtime responsable d'appeler nos fonctions.

Nous avons également besoin d'un exécutable PHP capable d’interpréter notre code. Je vais créer un dossier `bin` dans le dossier de mon layer pour y placer mon binaire `php`. Pour générer un binaire, je vous recommande de regarder [cet article](https://aws.amazon.com/blogs/compute/scripting-languages-for-aws-lambda-running-php-ruby-and-go/).

Lorsqu'on déploie un layer, il est placé dons le dossier `/opt` dans les containers. Ainsi, mon fichier `bootstrap` pourrait ressembler à ceci :

```bash
#!/bin/sh

#go into the source directory
cd $LAMBDA_TASK_ROOT

#execute the runtime
/opt/bin/php /opt/runtime.php
```

Voici un exemple de `runtime.php`  inspiré de l'[article sur le blog AWS](https://aws.amazon.com/blogs/apn/aws-lambda-custom-runtime-for-php-a-practical-example/).
Nous allons utiliser `Guzzle` pour faire les appels réseau, par conséquent je vais d'abord exécuter la commande suivante :

```
composer require guzzlehttp/guzzle
```

```php
<?php

// Invoke Composer's autoloader to use Guzzle
require $_ENV['LAMBDA_TASK_ROOT'] . '/vendor/autoload.php';

// Request processing loop => barring unrecoverable failure, this loop runs until the environment shuts down
do {
    // Ask the runtime API for a request to handle
    $request = getNextRequest();

    // Obtain the function name from the _HANDLER environment variable and ensure the function's code is available
    list($handlerFile, $handlerFunction) = explode(".", $_ENV['_HANDLER']);
    require_once $_ENV['LAMBDA_TASK_ROOT'] . '/src/' . $handlerFile . '.php';

    // Execute the desired function and obtain the response
    $response = $handlerFunction($request['payload']);

    // Submit the response back to the runtime API
    sendResponse($request['invocationId'], $response);
} while (true);

function getNextRequest()
{
    $client = new \GuzzleHttp\Client();
    $response = $client->get(sprintf(
        'http://%s/2018-06-01/runtime/invocation/next',
        $_ENV['AWS_LAMBDA_RUNTIME_API']
    ));

    return [
        'invocationId' => $response->getHeader('Lambda-Runtime-Aws-Request-Id')[0],
        'payload' => json_decode((string) $response->getBody(), true),
    ];
}

function sendResponse($invocationId, $response)
{
    $client = new \GuzzleHttp\Client();
    $client->post(
        sprintf(
            'http://%s/2018-06-01/runtime/invocation/%s/response',
            $_ENV['AWS_LAMBDA_RUNTIME_API'],
            $invocationId
        ),
        ['body' => $response]
    );
}
```

Pour résumer, nous avons actuellement la structure de fichiers suivante :

```
layers/
    php/
        bin/
            php #binary file
        bootstrap
        runtime.php
src/
    profession.php
vendor/
    guzzlehttp/
```

**Déploiement**

Je vais utiliser le framework *serverless* pour le déploiement de mon layer et de ma fonction :

```yaml
# serverless.yml
service: php-serverless
provider:
  name: aws
  runtime: provided
  region: eu-west-3
  memorySize: 512

layers:
  php:
    path: layers/php

functions:
  occupation:
    handler: profession.occupation
    layers:
      - {Ref: PhpLambdaLayer}
```

Comme on peut constater, dans ma fonction `occupation`, le `handler` contient le nom de mon fichier `profession.php` et la méthode `occupation`. C'est comme ça que je l'ai configuré dans le `runtime.php` :

```php
//...
list($handlerFile, $handlerFunction) = explode(".", $_ENV['_HANDLER']);
require_once $_ENV['LAMBDA_TASK_ROOT'] . '/src/' . $handlerFile . '.php';
$response = $handlerFunction($request['payload']);
```

C'est donc à nous de bien configurer la façon dont on nomme les handlers et la façon de les exécuter dans le runtime.

Le nom de notre layer `PhpLambdaLayer` correspond à sa référence CloudFormation. Vous pouvez lire les détails [ici](https://www.serverless.com/framework/docs/providers/aws/guide/layers/#aws---layers).

Pour déployer la fonction et le layer, exécutons la commande suivante :

```bash
$ sls deploy

Serverless: Packaging service...
#...
Serverless: Stack update finished...
Service Information
service: php-serverless
stage: dev
region: eu-west-3
stack: php-serverless-dev
resources: 7
api keys:
  None
endpoints:
  None
functions:
  occupation: php-serverless-dev-occupation
layers:
  php: arn:aws:lambda:eu-west-3:087017887086:layer:php:1
```

Enfin, appelons la fonction `occupation` :

```bash
$ sls invoke -f occupation -l
{
  "occupation": "Fireman"
}
--------------------------------------------------------------------
START RequestId: d09f2191-7233-47d3-a4fe-8de2a621a608 Version: $LATEST
END RequestId: d09f2191-7233-47d3-a4fe-8de2a621a608
REPORT RequestId: d09f2191-7233-47d3-a4fe-8de2a621a608  Duration: 38.15 ms  Billed Duration: 300 ms  Memory Size: 512 MB  Max Memory Used: 59 MB  Init Duration: 191.10 ms
```

**Récapitulatif**

Nous venons donc de réaliser un exemple fonctionnel avec un *layer* capable d'exécuter du code PHP.

Maintenant, imaginez que vous avez une grande application, disons une API REST en Symfony, que vous voudriez déployer sur AWS Lambda. Il faudrait développer un runtime beaucoup plus poussé capable de s'intégrer avec le *front controller de Symfony*, et pourquoi pas aussi avec la *console*. Il faudrait également modifier le layer PHP pour ajouter toutes les librairies dont nous aurions besoin et de recompiler le binaire PHP.

Heureusement pour nous, une solution *open source* existe pour gérer tout cela : [Bref](https://bref.sh/).

## Bref

Bref est un package Composer open source qui nous permet de déployer des applications PHP sur AWS Lambda. Il est développé par [Matthieu Napoli](https://mnapoli.fr/).

Bref fournit :

- la documentation
- les runtimes PHP pour AWS Lambda
- des outils de déploiement
- l'intégration avec des frameworks PHP

Je vous propose de déployer une application Symfony sur AWS Lambda en utilisant Bref.

### Application Symfony

Pour créer mon application,

```bash
$ composer create-project symfony/skeleton sf-serverless-example
```

Ensuite, modifions le controller par défaut comme ceci (pour reprendre le même exemple que plus haut) :

```php
namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController
{
    public function index()
    {
        $jobs = [
            'Fireman',
            'Astronaut',
            'Super hero',
            'Pilot',
            'Professional cook',
            'Artist',
        ];

        return new JsonResponse([
            'occupation' => $jobs[array_rand($jobs)],
        ]);
    }
}
```

Ajoutons maintenant la librairie Bref :

```bash
$ composer require bref/bref
```

Enfin, configurons le déploiement avec *serverless* :

```yaml
# serverless.yml
service: php-serverless-sf-bref
provider:
  name: aws
  region: eu-west-3
  runtime: provided
  environment:
    # Symfony environment variables
    APP_ENV: prod

plugins:
  - ./vendor/bref/bref

functions:
  website:
    handler: public/index.php
    timeout: 28 # API Gateway has a timeout of 29 seconds
    layers:
      - ${bref:layer.php-74-fpm}
    events:
      - http: 'ANY /'
      - http: 'ANY /{proxy+}'
  console:
    handler: bin/console
    timeout: 120 # in seconds
    layers:
      - ${bref:layer.php-74} # PHP
      - ${bref:layer.console} # The "console" layer
```

La liste des layers mis à disposition par Bref peut être consultée [ici](https://runtimes.bref.sh/). Je vous recommande également de lire la documentation de Bref, elle est très claire et fournit plein d'exemples dont vous pourriez avoir besoin.

Il ne faut pas oublier qu'avec la plupart des fournisseurs Cloud, le filesystem est disponible de lecture seulement. Ainsi, nous devons changer l'endroit où sont stockés les fichers de `logs` et `cache` :

```php
public function getLogDir()
{
    // When on the lambda only /tmp is writeable
    if (getenv('LAMBDA_TASK_ROOT') !== false) {
        return '/tmp/log/';
    }

    return parent::getLogDir();
}

public function getCacheDir()
{
    // When on the lambda only /tmp is writeable
    if (getenv('LAMBDA_TASK_ROOT') !== false) {
        return '/tmp/cache/'.$this->environment;
    }

    return parent::getCacheDir();
}
```

Dernière étape, le déploiement :

```bash
$ sls deploy

Serverless: Packaging service...
Service Information
service: php-serverless-sf-bref
stage: dev
region: eu-west-3
stack: php-serverless-sf-bref-dev
resources: 15
api keys:
  None
endpoints:
  ANY - https://maeck9uwyf.execute-api.eu-west-3.amazonaws.com/dev
  ANY - https://maeck9uwyf.execute-api.eu-west-3.amazonaws.com/dev/{proxy+}
functions:
  website: php-serverless-sf-bref-dev-website
  console: php-serverless-sf-bref-dev-console
layers:
  None
```

L'URL à laquelle mon application est accessible est indiquée dans les endpoints. Voici donc le résultat :

![]({{ site.baseurl }}/assets/2020-05-07-php-serverless-part-2/example.png)

Nous avons terminé ! Nous venons de déployer une application Symfony sur AWS Lambda en utilisant Bref.
Comme vous avez vu, c'est assez simple au final...

Maintenant vous pouvez déployer vos applications PHP sur des infrastructures serverless :)
