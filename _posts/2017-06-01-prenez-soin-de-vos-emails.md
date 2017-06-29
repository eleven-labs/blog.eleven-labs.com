---
layout: post
title: Prenez soin de vos emails
author: captainjojo
excerpt: Le moyen de communication le plus répandu entre un prestataire et son client, c'est l'email. Pourtant, peu de gens prennent soin de les personnaliser. C'est dommage, car il existe de nombreux tips sympas qui permettent de les rendre plus qualitatifs. Bien sûr, tout cela passe par Google... mais qui n'utilise pas Gmail aujourd'hui ?
permalink: /fr/prenez-soin-de-vos-emails/
categories:
- Javascript
tags:
- mail
---

Le moyen de communication le plus répandu entre un prestataire et son client, c'est l'email. Pourtant, peu de gens prennent soin de les personnaliser. C'est dommage, car il existe de nombreux tips sympas qui permettent de les rendre plus qualitatifs. Bien sûr, tout cela passe par Google... mais qui n'utilise pas Gmail aujourd'hui ?

### À quoi cela ressemble-t-il ?

Vous avez dû le voir dans votre boite Gmail, dans certains cas, vos mails ont un affichage différent ou même un bouton en plus (un "call-to-action").

![](/assets/2017-06-01-prenez-soin-de-vos-emails/Capture-d’écran-2017-05-30-à-20.20.36.png)

> Exemple: Réservation d'un événement

![](/assets/2017-06-01-prenez-soin-de-vos-emails/Capture-d’écran-2017-05-30-à-20.26.14.png)

> Exemple: Votre prochain voyage

![](/assets/2017-06-01-prenez-soin-de-vos-emails/Capture-d’écran-2017-05-30-à-20.29.24.png)

> Exemple: Un call-to-action

### Comment ça marche ?

La seule façon de communiquer avec votre boite mail et en particulier Gmail ou Inbox c'est l'HTML. Pour ajouter les informations complémentaires afin que Gmail comprenne ce que vous voulez, il faut ajouter un *[schema.org](http://schema.org/)*. Eh oui, c'est aussi simple que cela, comme pour améliorer votre [seo](https://developers.google.com/search/docs/guides/), Google utilise schema.org.

### Comment tester ?

On le sait tous, développer des mails, ce n'est pas ce qui est le plus simple. Mettre en place un environnement de développement peut s'avérer très galère et assez long. Mais pas d'inquiétude, Google y a pensé !

Il suffit de se rendre sur [https://script.google.com](https://script.google.com) et de mettre le script suivant dans le fichier Code.gs

```javascript
function testSchemas() {
  var htmlBody = HtmlService.createHtmlOutputFromFile('NOM DU TEMPLATE').getContent();

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: 'TEST MAIL',
    htmlBody: htmlBody,
  });
}
```

Puis d'ajouter un fichier ```NOM DU TEMPLATE``` contenant l'html de votre email.

```html
<html>
  <body>
    <p>
      Votre email
    </p>
  </body>
</html>
```

Maintenant si vous "runnez" votre script, Google va vous demander le droit de vous envoyer un email et vous allez le recevoir.

### Développer les exemples

#### Réservation d'un événement

```html
<html>
  <body>
    <script type="application/ld+json">
    {
      "@context":             "http://schema.org",
      "@type":                "EventReservation",
      "reservationNumber":    "NUMERO DE RESA",
      "underName": "CaptainJojo",
      "reservationFor": {
        "@type": "Event",
        "name":               "VOTRE EVENEMENT",
        "startDate":          "2017-05-30T20:30:00-00:00",
        "location":           "15 Avenue de la Grande-Armée, 75016 Paris"
      }
    }
  </script>
    <p>
      Votre email
    </p>
  </body>
</html>
```

#### Votre prochain voyage

```html
<html>
  <body>
     <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "FlightReservation",
      "reservationNumber": "NUMERO DE RESERVATION",
      "reservationStatus": "http://schema.org/Confirmed",
      "underName": {
        "@type": "Person",
        "name": "CaptainJojo"
      },
      "reservationFor": {
        "@type": "Flight",
        "flightNumber": "42",
        "airline": {
          "@type": "Airline",
          "name": "Air Eleven Labs",
          "iataCode": "AEA"
        },
        "departureAirport": {
          "@type": "Airport",
          "name": "Symfony",
          "iataCode": "SFO"
        },
        "departureTime": "2017-05-30T20:15:00-08:00",
        "arrivalAirport": {
          "@type": "Airport",
          "name": "NodeJs",
          "iataCode": "NJS"
        },
        "arrivalTime": "2017-06-30T06:30:00-05:00"
      }
    }
  </script>
    <p>
      Votre email
    </p>
  </body>
</html>
```

#### Un call-to-action

```html
<html>
  <body>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "EmailMessage",
      "potentialAction": {
        "@type": "ConfirmAction",
        "name": "APPROUVER LE MAIL",
        "handler": {
          "@type": "HttpActionHandler",
          "url": "https://test.fr?id=email"
        }
      },
      "description": "J'approuve l'email"
    }
  </script>
    <p>
      Votre email
    </p>
  </body>
</html>
```

### En plus fort

Comme Google vous connait mieux que vous même, vous pouvez faire des recherches Google qui remonteront les informations contenues dans les schemas.org de vos emails.

Je vous invite à taper *'mes vols', 'mes commandes', 'mes réservations',*  vous serez surpris.

![](/assets/2017-06-01-prenez-soin-de-vos-emails/Capture-d’écran-2017-05-30-à-21.11.52.png)

![](/assets/2017-06-01-prenez-soin-de-vos-emails/Capture-d’écran-2017-05-30-à-21.11.11.png)

### Conclusion

Dans le monde, plus de 2,5 milliards d'emails sont envoyés chaque année, et c'est certainement le format que vous favorisez pour communiquer avec vos clients. Donc autant faire en sorte qu'ils sortent du lot ! Google propose un grand nombre d'améliorations pour vos mails. Je vous invite à regarder ceci [https://developers.google.com/gmail/markup/](https://developers.google.com/gmail/markup/), je suis sûr que vous trouverez votre bonheur.
