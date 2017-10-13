---
layout: post
title: Take care of your emails
authors:
    - captainjojo
excerpt: "The most common mean of communication between a provider and its customer is the email. Yet, few people care enough to customize it. And that's a shame, because there are many nice tips that make them more qualitative. Of course, many of them implies Google.. but who does not use Gmail today?"
lang: en
permalink: /take-care-emails/
categories:
- Javascript
tags:
- mail
---


The most common mean of communication between a provider and its customer is the email. Yet, few people care enough to customize it. And that's a shame, because there are many nice tips that make them more qualitative. Of course, many of them implies Google.. but who does not use Gmail today?

### What does it look like?

You should have seen it in your Gmail mailbox, in some cases your mails have a different display or even an extra button (like a call-to-action).

![](/assets/2017-07-05-take-care-your-mails/capture-decran-2017-05-30-a-20.20.36.png)

> Example: Booking an event

![](/assets/2017-07-05-take-care-your-mails/capture-decran-2017-05-30-a-20.26.14.png)

> Example: Your next trip

![](/assets/2017-07-05-take-care-your-mails/capture-decran-2017-05-30-a-20.29.24.png)

> Exemple: Un call-to-action

### How does it work?

The only way to communicate with your mailbox and especially Gmail or Inbox is HTML. To add additional information so that Gmail understands what you want, you need to add a schema.org. Yes, it's as simple as this, as to improve your [seo](https://developers.google.com/search/docs/guides/), Google uses *[schema.org](http://schema.org/)*.

### How to test?

We all know that developing e-mails is not the simplest thing in the world. Setting up a development environment can be very difficult and time consuming. But no worries, Google thought about it!

Just go to [https://script.google.com](https://script.google.com) and put the following script in the Code.gs  file


```javascript
function testSchemas() {
  var htmlBody = HtmlService.createHtmlOutputFromFile('TEMPLATE NAME').getContent();

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: 'MAIL TEST',
    htmlBody: htmlBody,
  });
}
```
Then add a ```TEMPLATE NAME```  file containing the html of your email.

```html
<html>
  <body>
    <p>
      Your email
    </p>
  </body>
</html>
```

Now if you "run" your script, Google will ask you the right to send you an email and you will receive it.

### Developing examples

#### Reservation of an event

```html
<html>
  <body>
    <script type="application/ld+json">
    {
      "@context":             "http://schema.org",
      "@type":                "EventReservation",
      "reservationNumber":    "RESERVATION NUMBER",
      "underName": "CaptainJojo",
      "reservationFor": {
        "@type": "Event",
        "name":               "YOUR EVENEMENT",
        "startDate":          "2017-05-30T20:30:00-00:00",
        "location":           "15 Avenue de la Grande-Armée, 75016 Paris"
      }
    }
  </script>
    <p>
      Your email
    </p>
  </body>
</html>
```

#### Your next trip

```html
<html>
  <body>
     <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "FlightReservation",
      "reservationNumber": "RESERVATION NUMBER",
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
      Your email
    </p>
  </body>
</html>
```

#### A call-to-action

```html
<html>
  <body>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "EmailMessage",
      "potentialAction": {
        "@type": "ConfirmAction",
        "name": "APPROVED EMAIL",
        "handler": {
          "@type": "HttpActionHandler",
          "url": "https://test.fr?id=email"
        }
      },
      "description": "I approved mail"
    }
  </script>
    <p>
      Your email
    </p>
  </body>
</html>
```

### Stronger

As Google knows you better than yourself, you can do Google searches that will put together the information contained in the schemas.org of your emails.

I invite you to type **my flights**, **my orders**, **my reservations**, you will be surprised.

![](/assets/2017-07-05-take-care-your-mails/capture-decran-2017-05-30-a-21.11.52.png)

![](/assets/2017-07-05-take-care-your-mails/capture-decran-2017-05-30-a-21.11.11.png)

### Conclusion

Worldwide, more than 215 billion of emails are sent daily, by a bit more than 2,6 users. It's certainly the format you favor to communicate with your customers. So why not take a little time and make sure they stand out? Google offers a lot of improvements for your mails. I invite you to watch this[https://developers.google.com/gmail/markup/](https://developers.google.com/gmail/markup/), I'm sure you will find what you need.
