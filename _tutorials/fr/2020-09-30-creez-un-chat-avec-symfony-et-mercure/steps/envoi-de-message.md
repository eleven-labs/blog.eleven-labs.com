---
contentType: tutorial-step
tutorial: creez-un-chat-avec-symfony-et-mercure
slug: envoi-de-message
title: Envoi de message
---
À la fin de cette partie, on sera capable d'envoyer nos messages, et nous serons fin prêts à faire intervenir Mercure.

### Poster les messages

Pour poster nos messages, nous devons pouvoir les envoyer depuis notre page de chat.
Cependant, on souhaite que notre page ne se recharge pas ! Ainsi, nous pourrons profiter du temps réel avec Mercure dans de bonnes conditions.
Nous devons donc faire intervenir un peu de JavaScript.

Dans `templates/channel/chat.html.twig`, ajoutez ce morceau de script, en lisant bien mes commentaires pour comprendre ce qui se passe :

```javascript
    // Dans une balise <script>, et un block {% block javascripts %}
        let chatDiv = document.querySelector('.overflow-auto');
        chatDiv.scrollTop = chatDiv.scrollHeight; // On souhaite scroller toujours jusqu'au dernier message du chat

        let form = document.getElementById('form');
        function handleForm(event) {
            event.preventDefault(); // Empêche la page de se rafraîchir après le submit du formulaire
        }
        form.addEventListener('submit', handleForm);

        const submit = document.querySelector('button');
        submit.onclick = e => { // On change le comportement du submit
            const message = document.getElementById('message'); // Récupération du message dans l'input correspondant
            const data = { // La variable data sera envoyée au controller
                'content': message.value, // On transmet le message...
                'channel': {{ channel.id }} // ... Et le canal correspondant
            }
            console.log(data); // Pour vérifier vos informations
            fetch('/message', { // On envoie avec un post nos datas sur le endpoint /message de notre application
                method: 'POST',
                body: JSON.stringify(data) // On envoie les data sous format JSON
            }).then((response) => {
                message.value = '';
                console.log(response);
            });
        }
```

Après avoir empêché le navigateur de rafraîchir la page, on utilise l'API `fetch` et la méthode `POST` afin d'envoyer le message au serveur et passer outre le fonctionnement natif des formulaires Symfony. Ainsi notre comportement se rapproche un peu plus d'un client communiquant avec son API.

On souhaite que seuls les utilisateurs authentifiés puissent envoyer des messages, alors mettez à jour le pare-feu de `security.yaml` :

```yaml
security:
    # ...
    access_control:
        - { path: ^/chat, roles: ROLE_USER }
```

### Récupérer les messages
Super. L'envoi est fonctionnel et sécurisé. Maintenant, récupérons nos messages depuis le `MessageController`, via une action `sendMessage` en méthode `POST` :

```php
    /**
     * @Route("/message", name="message", methods={"POST"})
     */
    public function sendMessage(
        Request $request,
        ChannelRepository $channelRepository,
        SerializerInterface $serializer,
        EntityManagerInterface $em): JsonResponse
    {
        $data = \json_decode($request->getContent(), true); // On récupère les data postées et on les déserialize
        if (empty($content = $data['content'])) {
            throw new AccessDeniedHttpException('No data sent');
        }

        $channel = $channelRepository->findOneBy([
            'id' => $data['channel'] // On cherche à savoir de quel channel provient le message
        ]);
        if (!$channel) {
            throw new AccessDeniedHttpException('Message have to be sent on a specific channel');
        }

        $message = new Message(); // Après validation, on crée le nouveau message
        $message->setContent($content);
        $message->setChannel($channel);
        $message->setAuthor($this->getUser()); // On lui attribue comme auteur l'utilisateur courant

        $em->persist($message);
        $em->flush(); // Sauvegarde du nouvel objet en DB

        $jsonMessage = $serializer->serialize($message, 'json', [
            'groups' => ['message'] // On serialize la réponse avant de la renvoyer
        ]);

        return new JsonResponse( // Enfin, on retourne la réponse
            $jsonMessage,
            Response::HTTP_OK,
            [],
            true
        );
    }
```

Après avoir décodé le message reçu et avoir validé qu'il corresponde aux données attendues, on a créé un nouvel objet Message, qu'on a serializé avec le serialization group `message`. Puis on le retourne donc sous format Json.
Pour savoir quelles propriétés de notre entité on souhaite serializer, on utilise l'annotation `@Groups()` sur ces dernières, comme ceci :

```php
    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("message")
     */
    private string $content;
```

À minima, ajoutez ce groupe sur les propriétés `$id`, `$content`, `$channel`, `$author` de l'entité Message.

Vous pouvez dès à présent tenter d'envoyer un message. Rafraîchissez la page afin de constater que le message a bien été envoyé, et s'affiche bien dans le chat. 

> Pas très pratique d'avoir fait tout ca pour simplement recharger manuellement notre page

Il est temps de passer au temps réel avec Mercure.

Vous pouvez vous rendre sur [cette branche](https://github.com/ArthurJCQ/tutorial-astro-chat/tree/codelabs/send-message) pour être à jour sur cette étape du tutoriel, et continuer sereinement vers la prochaine partie.