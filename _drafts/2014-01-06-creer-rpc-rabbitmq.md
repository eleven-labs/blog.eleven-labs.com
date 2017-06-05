--- layout: post title: Créer un RPC via RabbitMQ author: jonathan date:
'2014-01-06 00:00:18 +0100' date\_gmt: '2014-01-05 23:00:18 +0100'
categories: - Symfony tags: - php - RabbitMQ --- {% raw %}

RabbitMQ est un gestionnaire de queue, il permet donc de conserver des
messages et de les lire via une autre tâche. Une présentation plus
approfondie sera faite dans un autre article. Dans cet article, nous
allons nous intéresser à un concept important dans RabbitMQ : le RPC.

Un RPC (remote procedure call) permet d'envoyer un message à une queue
et d'en attendre la réponse, pour mieux comprendre ce concept, partons
d'un exemple simple : la génération d'une url de contenu externalisée.

Il y a donc un client qui envoie un contenu dans une queue RabbitMQ afin
de connaitre l'url générée. Le client n'a alors besoin que d'une méthode
"call".

``` {.lang:php .decode:true title="Création de la class client"}
<?php

class generateUrlClient
{
  public function call($value)
  {
    // TODO
    return $response;
  }
}

$generateUrlClient= new generateUrlClient();
$response = $generateUrlClient->call('vive le RPC');
echo "Url généré ".$response;
```

Toujours dans le client, l'initialisation de la queue de "callback"
permet au message mis dans la queue de savoir où déposer le message de
réponse.

``` {.lang:php .decode:true title="Création d'un queue de callback"}
list($queue_name, ,) = $channel->queue_declare("", false, false, true, false);

$msg = new AMQPMessage(
    $payload,
    array('reply_to' => $queue_name));

$channel->basic_publish($msg, '', 'rpc_queue');

// Ici le code de lecture le réponse
```

Vous pouvez trouver toutes les options disponibles pour le protocole
AMQP dans la library suivante
<https://github.com/videlalvaro/php-amqplib>.

Le code ci-dessus fait que tous les messages publiés dans la queue
auront une réponse dans la queue de callback. Un problème demeure :
comment reconnaître chaque message dans la queue de callback? L'idée est
de mettre sur chaque message une clé unique qui permet de le reconnaitre
ensuite.

La clé unique est ce que l'on appelle la 'correlation\_id', elle permet
d'identifier chaque réponse par rapport à son message. Elle est envoyée
sur chaque message envoyé sur le serveur, et renvoyée dans la réponse
qui permet alors de reconnaître la demande initiale.

Avant de faire l'exemple de code, voici un petit résumé:

 

\[caption id="attachment\_627" align="alignnone" width="300"\][![RPC
description](http://blog.eleven-labs.com/wp-content/uploads/2013/11/python-six-300x104.png){.size-medium
.wp-image-627 width="300"
height="104"}](http://blog.eleven-labs.com/wp-content/uploads/2013/11/python-six.png)
RPC description\[/caption\]

Comme on peut le voir sur le schéma ci-dessus, le client envoie un
message dans la queue 'rpc\_queue' avec l'option reply\_to qui permet
d'envoyer la réponse dans une queue de callblack et la clé de
'correlation\_id' qui est l'index unique de chaque demande.

Commençons l'exemple du serveur de génération d'url via un titre. Nous
commencerons par le serveur qui s'occupera de créer une url à partir
d'un titre. Pour l'exemple, nous prenons simplement un titre et
remplaçons les espaces par des underscores.

``` {.lang:php .decode:true}
<?php

require_once __DIR__.'/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class generateUrlClient {
    private $connection;
    private $channel;
    private $callback_queue;
    private $response;
    private $correlation_id;

    // On créer la connexion comme sur le serveur
    public function __construct() {
        // Création de la connexion RabbitMQ
        $this->connection = new AMQPConnection(
            'localhost', 5672, 'guest', 'guest');

        // On récupère ensuite le channel qui nous permet de communiquer avec RabbitMQ
         $this->channel = $this->connection->channel();

       // Création de la queue
       list($this->callback_queue, ,) = $this->channel->queue_declare(
            "", false, false, true, false);

       // Consommation de la queue en mode réponse
        $this->channel->basic_consume(
            $this->callback_queue, '', false, false, false, false,
            array($this, 'on_response'));
    }

    // Varification de la correlation_id
    public function on_response($rep) {
        if($rep->get('correlation_id') == $this->correlation_id) {
            $this->response = $rep->body;
        }
    }

    // Publication dans la queue de notre message
    public function call($n) {
        $this->response = null;
        $this->correlation_id = uniqid();

        // Préparation du message avec demande de callback
        $msg = new AMQPMessage(
            (string) $n,
            array('correlation_id' => $this->correlation_id,
                  'reply_to' => $this->callback_queue)
            );

        // Publication du message dans la queue rpc
        $this->channel->basic_publish($msg, '', 'rpc_queue');

        // On attend la réponse
        while(!$this->response) {
            $this->channel->wait();
        }

        // On retourne la reponse
        return $this->response;
    }
};

// On creer un message et on attend la reponse
$generateUrlClient = new generateUrlClient();

$titles = array('test de ouf', 'numero 1', 'numero 5');

foreach ($titles as $title) {
    $response = $generateUrlClient->call($title);
    echo " Pour le titre ".$title.' url recu '.$response, "\n";
}
```

 

Lancer le serveur directement avec:

``` {.lang:sh .decode:true}
php generateUrlServer.php
```

 

Maintenant créons le  client qui devra envoyer le message au serveur de
génération et l'utiliser ensuite.

 

``` {.lang:php .decode:true}
<?php

require_once __DIR__.'/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class generateUrlClient {
    private $connection;
    private $channel;
    private $callback_queue;
    private $response;
    private $correlation_id;

    // On créer la connexion comme sur le serveur
    public function __construct() {
        // Création de la connexion RabbitMQ
        $this->connection = new AMQPConnection(
            'localhost', 5672, 'guest', 'guest');

        // On récupère ensuite le channel qui nous permet de communiquer avec RabbitMQ
         $this->channel = $this->connection->channel();

       // Création de la queue
       list($this->callback_queue, ,) = $this->channel->queue_declare(
            "", false, false, true, false);

       // Consommation de la queue en mode réponse
        $this->channel->basic_consume(
            $this->callback_queue, '', false, false, false, false,
            array($this, 'on_response'));
    }

    // Varification de la correlation_id
    public function on_response($rep) {
        if($rep->get('correlation_id') == $this->correlation_id) {
            $this->response = $rep->body;
        }
    }

    // Publication dans la queue de notre message
    public function call($n) {
        $this->response = null;
        $this->correlation_id = uniqid();

        // Préparation du message avec demande de callback
        $msg = new AMQPMessage(
            (string) $n,
            array('correlation_id' => $this->correlation_id,
                  'reply_to' => $this->callback_queue)
            );

        // Publication du message dans la queue rpc
        $this->channel->basic_publish($msg, '', 'rpc_queue');

        // On attend la réponse
        while(!$this->response) {
            $this->channel->wait();
        }

        // On retourne la reponse
        return $this->response;
    }
};

// On creer un message et on attend la reponse
$generateUrlClient = new generateUrlClient();

$titles = array('test de ouf', 'numero 1', 'numero 5');

foreach ($titles as $title) {
    $response = $generateUrlClient->call($title);
    echo " Pour le titre ".$title.' url recu '.$response, "\n";
}
```

 

Maintenant lançons le client :

``` {.lang:sh .decode:true}
php generateUrlClient.php
```

 

Si tout se passe bien, le serveur renvoie les bonnes valeurs.

 

Laissez un commentaire si vous avez des questions.

 

 

 

 

 

 

 

 

 

 

 

 

{% endraw %}
