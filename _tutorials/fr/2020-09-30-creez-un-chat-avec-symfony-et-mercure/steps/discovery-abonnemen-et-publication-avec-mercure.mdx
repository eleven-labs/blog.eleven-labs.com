---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: discovery-abonnemen-et-publication-avec-mercure
title: Discovery, abonnement et publication avec Mercure
---
## Discovery du Hub Mercure

Notre client (le navigateur web) doit connaître l'URL du Hub pour pouvoir s'abonner à ses updates.
Or, seule notre application Symfony connaît cette adresse, il faut donc la transmettre à nos clients.
Pour cela, on utilise le mécanisme de Discovery de Mercure, en envoyant au client les informations nécessaires de notre Hub.
Rendez-vous dans votre `ChannelController`, et ajoutez un `Link` à la réponse de l'action `chat`, comme ceci :

```php
    /**
     * @Route("/chat/{id}", name="chat")
     */
    public function chat(
        Request $request, // Autowire the request object
        Channel $channel,
        MessageRepository $messageRepository
    ): Response
    {
        $messages = $messageRepository->findBy([
            'channel' => $channel
        ], ['createdAt' => 'ASC']);

        $hubUrl = $this->getParameter('mercure.default_hub'); // Mercure automatically define this parameter
        $this->addLink($request, new Link('mercure', $hubUrl)); // Use the WebLink Component to add this header to the following response

        return $this->render('channel/chat.html.twig', [
            'channel' => $channel,
            'messages' => $messages
        ]);
    }
```

On ajoute un header de type Link à la réponse, avec l'URL de notre Hub. On récupère pour cela l'objet `$request` de la requête récupérée par le controller.

Il n'y a plus qu'à récupérer cette information dans le template `templates/channel/chat.html.twig`. Dans une application Client - API classique qui renverrait une réponse HTTP, il suffirait de récupérer les headers en Javascript comme ceci :

```javascript
const hubUrl = response.headers.get('Link').match(/<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/)[1]; // Cf documentation Symfony - Mercure
```

Cependant notre application renvoie une réponse Twig, c'est un chouia plus complexe de récupérer ce header :

```javascript
// In the Hub URL, 'mercure' is used as the docker-compose service name. We replace it by the actual localhost url for the browser.
const link = '{{ app.request.attributes.get('_links').getLinksbyRel('mercure')[0].getHref }}'
    .replace("mercure", "localhost:3000");
```

Il est ici important de remplacer la partie `mercure` de l'URL par celle réellement accessible depuis le client (`localhost:3000`).
Et voilà, on connaît l'URL de notre Hub, qu'on peut stocker dans une variable de type URL :

```javascript
const url = new URL(link);
```

### S'abonner aux nouveaux messages

Maintenant qu'on connaît l'adresse du Hub, il suffit de définir le topic auquel on souhaite s'abonner. Il est nécessaire pour cela de définir un topic, sous la forme d'une URI, qui représente la ressource que l'on souhaite "écouter". Or, ce sont les nouveaux messages d'un canal de discussion en particulier que nous souhaitons recevoir automatiquement. Choisissons donc arbitrairement ce topic : `http://astrochat.com/channel/{id}` (en précisant l'Id du channel courant).

Quand nous publierons des updates, il faudra être cohérent et les publier sur ce même topic.

Pour le moment, finissons la partie abonnement. C'est avec l'API Javascript `EventSource` qu'on écoutera les événements publiés par notre Hub, et que nous traiterons les données. Je propose de traiter le tout comme ceci :

```javascript
url.searchParams.append('topic', 'http://astrochat.com/channel/{{ channel.id }}'); // On ajoute le topic souhaité aux paramètres de la requête vers le Hub

const eventSource = new EventSource(url); // On s'abonne au Hub

const appUser = {{ app.user.id }};

eventSource.onmessage = ({data}) => { // On écoute les événements publiés par le Hub
    const message = JSON.parse(data); // Le contenu des événements est sous format JSON, il faut le parser
        document.querySelector('.bg-light').insertAdjacentHTML( // On injecte le nouveau message selon le HTML déjà présent plus haut dans notre fichier Twig
        'beforeend',
            appUser === message.author.id ?
            `<div class="row w-75 float-right">
            <b>${message.author.username}</b>
            <p class="alert alert-info w-100">${message.content}</p>
        </div>` :
            `<div class="row w-75 float-left">
            <b>${message.author.username}</b>
            <p class="alert alert-success w-100">${message.content}</p>
        </div>`
    )
    chatDiv.scrollTop = chatDiv.scrollHeight; // On demande au navigateur de scroller le chat tout en bas pour bien apercevoir le dernier message apparu
}
```

On crée donc notre objet `EventSource` en lui passant l'URL de notre Hub, et on injecte l'Id du channel depuis la variable Twig correspondante.
La méthode `onmessage` sera appelée à chaque nouvel événement publié par le Hub.

C'est bon, votre client est capable de recevoir les futures Updates. On injecte simplement une nouvelle `div` html pour chaque nouveau message afin de peupler le chat au fur et à mesure, sans avoir à rafraîchir la page.

Maintenant, ces messages, il faut les publier sur le Hub depuis le serveur !

### Publier les messages sur le Hub

Le package Mercure vient avec certaines méthodes qui rendent extrêmement simples les interactions avec notre Hub, notamment un objet `Update` pour construire notre Update, et un `Publisher` pour publier cette dernière sur le Hub.
C'est dans le `MessageController` que nous allons traiter cela, au moment de la réception d'un nouveau message. Injectez-le `PublisherInterface`, créez et publiez votre update. Voici comment j'ai modifié l'action `sendMessage` pour arriver à ce résultat (comme d'habitude, j'ai commenté les lignes qui ont changé) :

```php
// ...
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
// ...

    /**
     * @Route("/message", name="message", methods={"POST"})
     */
    public function sendMessage(
        Request $request,
        ChannelRepository $channelRepository,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        PublisherInterface $publisher
        ): JsonResponse
    {
        // ...

        $update = new Update( // Création d'une nouvelle update
            sprintf('http://astrochat.com/channel/%s', // On précise le topic, avec pour Id l'identifiant de notre Channel
                $channel->getId()),
            $jsonMessage, // On y passe le message serializer en content value
        );
        $publisher($update); // Le Publisher est un service invokable. On peut publier directement l'update comme cela

        return new JsonResponse(
            $jsonMessage,
            Response::HTTP_OK,
            [],
            true
        );
    }
```

Comme vous le constatez, nous avons précisé le même topic que celui sur lequel notre javascript écoute les événements.

Essayez d'envoyer un message depuis le chat. Normalement, ce dernier devrait apparaître automatiquement ! Votre messagerie fonctionne désormais en temps réel grâce à Mercure !

> Ouf, vous avez fait la majorité du chemin, mais ce n'est pas fini ! Quid de la sécurité dans tout ca ?

Justement c'est l'objet de la prochaine et dernière partie, accrochez-vous encore un tout petit peu !

Vous pouvez vous rendre sur [cette branche](https://github.com/ArthurJCQ/tutorial-astro-chat/tree/codelabs/discovery-and-publish) pour être à jour sur cette étape du tutoriel, et continuer sereinement vers la prochaine partie.
