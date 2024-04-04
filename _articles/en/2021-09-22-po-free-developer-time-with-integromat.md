---
contentType: article
lang: en
date: '2021-09-22'
slug: po-free-developer-time-with-integromat
title: 'PO : Free some developer time by doing some NoCode with Integromat'
excerpt: >-
  You're part of a small team with a lot of features to release quickly and a
  PoC needed to test a product but you only have little to no tech skills ?
  NoCode is what you're looking for !
cover:
  path: /imgs/articles/2021-09-22-po-free-developer-time-with-integromat/cover.jpg
categories: []
authors:
  - marianne
keywords:
  - best practice
  - nocode
---

As a PO or product manager, you can develop yourself some features that may be repetitive and uninspiring for your developers, without much added value. This allows teams to focus on the essentials, while leaving more time available to think about the architecture and the various technical challenges. To test a new idea and/or market without investing too much, a NoCode tool is a real solution.

I already showcased here the open-source projet [n8n]({BASE_URL}/fr/outil-low-code-automatisation-workflow-n8n/) (post in french), a tool dedicated to make Low Code automation. [Integromat](https://www.integromat.com/) aims to go even further with plain NoCode, even usable wihout any technical background.

To try Integromat, a freeplan is available to create your first scenarios. After that, it is easy to go from a PoC to a professional use, using their affordable plans.

I will propose some features that are regularly found in a project, and make a comparison between developer and no-code Integromat tool.

## Interface presentation

![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/homepage.png)

It is worth mentioning that Integromat did pay attention to users with a non-technical profile by proposing an easy to use and quite intuitive interface.

On the scenario building page, each node is represented by a bubble: adding and configuring is done directly on the page. Integromat allows you to create "Data Structures" and to store data ("Data Stores") that you can prepare in advance in their own menus and then use them in the scenarios.
With these features, you can process and manipulate data without needing a specific database.

![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/interface-noeud.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/OExHVQ9CRCw" frameborder="0" allowfullscreen></iframe>


## Case 1: Sending an email to activate a registration

You start a new site from scratch that requires registration, and you want to send a confirmation email.

The scenario is quite simple: a webhook on which the application will have to send data, and an email server.
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas1-scenario.png)
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas1-webhook.png)
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas1-mail.png)

> On the plus side, you are autonomous to change the template: no need for additional development and therefore no need for a specific release to deliver those changes.

Your developers will still have to implement the sending to the webhook part.

### If developers had to do it

They would then have to install and configure a library for email management, then create and send the email. In addition to the development and review time, they also have to test it.


### To go further

#### Save sent email status

After sending the email, it can be interesting to store this information in  database. To do this, you can either send the information on an update API route with the *HTTP* node, or directly modify the line from the node corresponding to your database.


#### Statistics

You need to know how many people signed up per day: instead of asking your developers to pull up the numbers, you can integrate the data into a Google Sheet. Then thanks to the built-in functions you can add a +1 in a cell.

## Case 2: Create and print personalized flyers

You have just created your e-commerce site, either via Shopify or Prestashop. To stand out from the competition, you would like to add a custom flyer to put in the package with [BannerBear](https://www.bannerbear.com/).

For this example, I will use a webhook rather than directly an e-commerce site node that retrieves the information as soon as there is a new event.

![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas2-scenario.png)

> As in our previous exemple with the email template, you are completly autonomous to change it.

### If you had to do it manually

For each client, you would have to open an image processing software, copy/paste the name, and then export or print it.

### If developers had to do it

Without going into too much detail, there are several ways to create an image, but this requires installing libraries on your project. If you have to save the image on a Google Drive-like server, you still have to install and configure the appropriate library.

### To go further

#### Sending this image via email

In addition to storing the image, you can also send it by email.
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas2-aller-plus-loin.png)

#### Printing

Instead of storing the image on your server, you can print it directly with an application like [PrintNode](https://www.printnode.com/fr).

## Case 3: Advanced level: CSV file processing

This scenario allows to go further in Integromat with the use of Data Stores and Data Structures.
We want to process a CSV to split it into several CSV to be then processed by different microservices.
You can connect the trigger on a *FTP* service as well as on a *Google Drive*.

![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-scenario.png)

It is possible to add filters between the nodes. To avoid errors during processing, I added the condition to accept only CSV documents for the following steps.
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-filter-csv.png)


To be sure of uploaded document pattern and to save the data to potentially use in another scenario, I use the *Data Store* node which will map each CSV entry to a database entry.
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-mapping-csv-data-store.png)


For my need, I have to create 3 different CSV based Data Structures and save them in a folder. The *Router* node allows to parallelize the work.
![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-create-data-structure-product.png)

> On the plus side, you have complete autonomy on the models: if the input(s) or output(s) change, you can update them easily.

### If developers had to do it

CSV files processing can quickly become tedious: connecting to a drive-like service, uploading to a server, reading the file and each entry, checking the data, saving to the database, creating each CSV and dropping it on the drive... At first glance, it could be a micro-service of its own.

### To go further

#### Supercharging our CSV

You need to add the brand id or a color trigram, but the data is not in the original CSV. You have several solutions:

-   with the *HTTP* node, you can make an API call

-   thanks to the *Data Store* you have a database at your disposal that you can fill with another scenario

-   thanks to the *Database* nodes you can query directly your database


#### Notify the business team

There are plenty of nodes to allow communication: each time a new file is processed, a slack message will be sent to warn the team.
It is even possible to predict the path in case of an error during a node.

![]({BASE_URL}/imgs/articles/2021-09-22-po-liberez-du-temps-a-vos-developpeurs-avec-integromat/cas3-add-error-handler.png)


## Conclusion

Unlike n8n, Integromat is a tool you can try right away, with an easy and accessible approach even if you are not "technical".

As a developer myself, I'm in favor of No/Low Code: it relieves me of uninteresting features and allows me to focus only on the ones that require some real thinking with high added value.


## Source :

-   Integromat: [site](https://www.integromat.com/) et [documentation](https://www.integromat.com/en/integrations)
