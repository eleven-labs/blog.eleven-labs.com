---
layout: post
title: "PHP & Serverless with Bref - part 2"
lang: fr
permalink: /en/php-serverless-part-2/
excerpt: "How to deploy PHP applications to AWS Lambda with Bref"
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

This article is a follow-up to this (first part)[https://blog.eleven-labs.com/en/en/php-serverless-part-1/] which introduces serverless computing. In this second part, we will first see what the *layers* are in AWS Lambda and how to implement them. Then we will see how to use the Bref framework.

## AWS Lambda

### How it works

An AWS Lambda environment includes:

- the runtime of the chosen language (Java, Go, PowerShell, Node.js, C #, Python, Ruby by default)
- the implementation of *Lambda runtime API*, i.e. the lifecycle of the execution of the environment and the invocation of serverless functions

The lifecycle of a Lambda runtime consists of an initialization phase and several (as many as necessary) invocation phases.

The initialization phase represents the time between the moment when the environment starts the runtime and the moment when the code of a function is executed. This phase is performed only once during the life cycle of the environment.

After initialization, the execution environment goes into the invocation phase and will constantly check and execute tasks, until the environment shuts down.

Since November 2018, it is possible to declare your own runtimes for Lambda functions, but also to incorporate reusable components in the form of *Layers*.

You can implement a runtime in any language. A runtime is a program that executes the `handler` of a Lambda function when it is called. A runtime can be included in the function deployment package in the form of an executable file named `bootstrap` (we will see an example later in this article).

### Layers

A Lambda function can be configured to download additional code and content as a layer. A layer is a ZIP archive that contains libraries, a custom runtime or other dependencies.

If you have already written serverless functions in Node.js, you know that you must package the entire `node_modules` folder for every function (since they are deployed independently from each other). This slows down the deployment process and makes the builds slow.

But now, it is possible to publish the `node_modules` folder as a shared and reusable layer for all our functions. This means that we could have a layer for our custom runtime, another layer which contains our dependencies and configure our functions to use these 2 layers. Note that a function has a limit of 5 layers.

### Example

**PHP function**

Take the following simple function as an example:

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

**PHP layer**

I am going to create a `layers/php` folder in my application and I will place my layer there.
To create a custom runtime, we need a `bootstrap` file which will contain the logic of our runtime in charge of invoking our functions.

We also need a PHP executable capable of interpreting our code. I'm going to create a `bin` folder in my layer folder to place my `php` binary. To generate a binary, I recommend you read [this article](https://aws.amazon.com/blogs/compute/scripting-languages-for-aws-lambda-running-php-ruby-and-go/).

When deploying a layer, it is placed in the `/opt` folder in the containers. So my `bootstrap` file could look like this:

```bash
#!/bin/sh

#go into the source directory
cd $LAMBDA_TASK_ROOT

#execute the runtime
/opt/bin/php /opt/runtime.php
```

Here is an example of `runtime.php` inspired by the [article on the AWS blog](https://aws.amazon.com/blogs/apn/aws-lambda-custom-runtime-for-php-a-practical-example/).
We will use `Guzzle` to make HTTP calls, therefore I will first execute the following command:

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

To summarize, we currently have the following file structure:

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

**Deployment**

I will use the *serverless* framework to deploy my layer and my function:

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

As we can see, in my `occupation` function, the `handler` contains the name of my file `profession.php` and the `occupation` method. This is how I configured it in `runtime.php`:

```php
//...
list($handlerFile, $handlerFunction) = explode(".", $_ENV['_HANDLER']);
require_once $_ENV['LAMBDA_TASK_ROOT'] . '/src/' . $handlerFile . '.php';
$response = $handlerFunction($request['payload']);
```

It is therefore up to us to configure the way we name the handlers and the way to call them in the runtime.

The name of our layer `PhpLambdaLayer` corresponds to its CloudFormation reference. You can read the details [here](https://www.serverless.com/framework/docs/providers/aws/guide/layers/#aws---layers).

To deploy the function and the layer, execute the following command:

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

Finally, let's invoke the `occupation` function:

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

**Summary**

So we just made a working example with a *layer* capable of executing PHP code.

Now imagine that you have a large application, say a REST API in Symfony, that you would like to deploy on AWS Lambda. It would be necessary to develop a much more advanced runtime capable of integrating with the *front controller of Symfony*, and why not with the *console* as well. We would also have to modify the PHP layer to add all the libraries we would need and to recompile the PHP binary.

Fortunately for us, an *open source* solution exists to manage all of this: [Bref](https://bref.sh/).

## Bref

Bref is an open source Composer package that allows us to deploy PHP applications on AWS Lambda. It is developed by [Matthieu Napoli](https://mnapoli.fr/).

Bref provides:

- the documentation
- PHP runtimes for AWS Lambda
- deployment tools
- integration with PHP frameworks

I suggest we deploy a Symfony application on AWS Lambda using Bref.

### Symfony application

To create my application:

```bash
$ composer create-project symfony / skeleton sf-serverless-example
```

Next, let's modify the default controller as follows (to use the same example as above):

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

Now let's add the Bref library:

```bash
$ composer require bref/bref
```

Finally, let's configure the deployment with *serverless* framework:

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

The list of layers made available by Bref can be consulted [here](https://runtimes.bref.sh/). I also recommend that you read the Bref documentation, it is very clear and provides plenty of examples that you may need.

We need to keep in mind that with most cloud providers the filesystem is read only. Hence, we need to change the `logs` and `cache` folders of our application:

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

Last step, deployment:

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

My application is available on the URL indicated in the endpoints. Here is the result:

![]({{ site.baseurl }}/assets/2020-05-07-php-serverless-part-2/example.png)

That's it. We just deployed a Symfony application to AWS Lambda using Bref!
As you can see, it is a pretty straight forward process...

You can now enjoy deploying PHP applications to a serverless infrastructure :)
