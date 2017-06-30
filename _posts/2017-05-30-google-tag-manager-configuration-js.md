---
layout: post
title: Google tag manager, votre configuration js
author: captainjojo
permalink: /fr/google-tag-manager-votre-configuration-js/
excerpt: La gestion des "tags" javascript externe peut très vite devenir un vrai calvaire. Si vous regardez les grands sites de médias avec l'extension Ghostery vous remarquerez que chaque site charge environ 20 mouchards, ce qui donne autant de tags javascript. Mais comment contrôler les différentes versions, la publication, les changements ? C'est là que Google Tag Manager intervient.
categories:
- Javascript
tags:
- tutoriel
- cache
- Javascript
- web
---

La gestion des "tags" javascript externe peut très vite devenir un vrai calvaire. Si vous regardez les grands sites de médias avec l'extension [Ghostery](https://chrome.google.com/webstore/detail/ghostery/mlomiejdfkolichcflejclcbmpeaniij?hl=fr) vous remarquerez que chaque site charge environ 20 mouchards, ce qui donne autant de tags javascript. Mais comment contrôler les différentes versions, la publication, les changements ? C'est là que Google Tag Manager intervient.

### Pour quoi faire ?

Vous l'aurez compris, Google Tag Manager va vous servir à contrôler vos tags javascript.  Il vous permet de les stocker tous au même endroit. Aujourd'hui vous les mettez directement dans votre code, ce qui rend contraignant chaque changement car demande souvent une mise en production. En plus de les stocker, vous pouvez aussi les publier à tout moment et Google Tag Manager permet de garder chaque version en mémoire et de rollbacker facilement. L'un des plus gros avantages de Google Tag Manager est qu'il permet de créer et d'utiliser des variables que vous pourrez ensuite utiliser dans votre code, c'est ce que l'on appelle le DataLayer.

### Comment l'utiliser ?

Vous pouvez vous rendre sur le site de [Google Tag Manager](https://tagmanager.google.com). Il faut alors configurer votre site.


![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-26-à-10.49.46.png)

La première chose à configurer est le type de container dont vous avez besoin.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-26-à-10.50.52.png)

Vous allez choisir Web. Vous n'avez plus qu'à mettre le script sur votre site. Il s'agit d'un tag javascript classique à poser dans la balise ```<head>``` de votre site.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-26-à-10.53.20.png)

Vous arrivez sur la page d'accueil, dans laquelle vous trouverez les informations de la dernière version de votre Google Tag Manager ainsi que les modifications en cours.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-26-à-11.01.29.png)

Vous pouvez maintenant commencer à utiliser Google Tag Manager.

### Projet de test

Maintenant, nous allons faire un mini projet de test. Vous avez seulement besoin d'un serveur web et de quelques pages HTML.

Commençons par créer la page HTML suivante.

```html
<html>
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5JQJFQV');</script>
  <!-- End Google Tag Manager -->
</head>
<body>
  TEST GTM
</body>
</html>
```

On y pose seulement le script Google Tag Manager.

Retournez ensuite dans l'interface Google Tag Manager et créez votre premier workspace. Cliquez sur "Default Workspace" en haut à gauche. Puis créez votre workspace, il s'agit d'un espace de travail qui permet ensuite de faire une sorte de Pull Request (on verra plus tard).

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-12.42.42.png)

Une fois le workspace créé, nous allons nous mettre en "mode prévisualisation" qui permet de voir les modifications du Google Tag Manager, ainsi qu'activer le débuggeur directement dans votre page web. Pour cela rien de plus simple, il vous suffit de cliquer sur "Preview" en haut à droite.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-12.48.11.png)

Ce qui est pratique avec la Prévisualisation, c'est que vous pouvez la partager avec d'autres personnes, il vous suffit de cliquer sur "Share Preview" et d'envoyer le lien fourni par Google Tag Manager. Cela permet de faire les modifications dont vous avez besoin et de les faire tester avant la mise en production.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-12.49.57.png)

Retournez sur votre page web, vous devriez voir en bas de la page la console de debug Google Tag Manager.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-12.52.55.png)

Nous allons poser le premier tag, pour faire simple il s'agira seulement d'un petit <span class="lang:default decode:true crayon-inline ">alert('GTM')</span> . Cliquez sur tag dans la colonne de gauche, puis "New".

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-12.56.08.png)

Puis cliquez sur "Tag configuration" et choisissez "HTML personnalisé", comme vous pouvez le voir, il existe de nombreux tags pré-configurés, je vous invite à regarder ceux qui pourrait vous intéresser.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-12.58.48.png)

Dans le "textarea" je vous invite à mettre le code suivant.

```html
<script>
  alert("GTM");
</script>
```
Puis il faut choisir le trigger, le trigger permet de savoir quand le tag doit s'activer.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-13.01.18.png)

Vous pouvez créer vos propres trigger, mais pour l'instant je vous invite à prendre le trigger "All page" par défaut qui activera le tag à chaque page vue. Il ne vous reste plus qu'à nommer le tag et sauvegarder.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-13.03.47.png)

Il ne vous reste plus qu'à "Refresh" la preview et retourner sur votre page web, l'alert devrait s'afficher.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-13.05.10.png)

Maintenant nous allons créer une nouvelle page "category.html" avec exactement le même code.

```html
<html>
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5JQJFQV');</script>
  <!-- End Google Tag Manager -->
</head>
<body>
  TEST GTM
</body>
</html>
```
Si vous allez sur la page vous devriez avoir la même "alert".

### Comment gérer deux alertes différentes ?

On va d'abord utiliser les triggers, retournez dans l'interface de Google Tag Manager et cliquez sur triggers dans la colonne de gauche puis "new". Vous arrivez sur une page permettant de créer un trigger. Cliquez "Trigger configuration" et choisissez "Page vue".

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-17.58.03.png)

Maintenant, on va choisir quand le trigger doit s'activer, donc choisissez "Certaines pages vues". À ce moment, vous allez pouvoir choisir quand le trigger "Page vue" doit s'activer, pour cet exemple nous allons choisir de regarder le "Page Path" et selon ce qu'il contient nous allons lancer le trigger.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.02.31.png)

Nommez votre trigger et sauvegardez. Re-faites l'opération en créant un trigger pour la page index.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.05.09.png)

Maintenant, nous allons modifier notre tag "ALERT 1", pour cela cliquez sur le tag puis cliquez pour modifier le trigger. Les deux triggers que vous avez créés doivent apparaître dans la colonne de droite.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.08.06.png)

Je vous invite à choisir le trigger "Page Index", de sauvegarder et de "refresh" votre "preview". Si vous allez sur votre page "index.html" vous devriez voir votre "alert" mais pas sur la page "category.html", d'ailleurs dans la console de debug vous voyez qu'aucun trigger n'a été appelé.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.12.45.png)

Il existe énormément de trigger, vous pouvez en créer vous-même, ce qui permet d'effectuer de nombreuses actions personnalisées.

Revenez en arrière en changeant le trigger pour que toutes les pages lancent l'alerte. Nous allons utiliser les "variables" et mettre en place un "data layer". Cliquez sur "variables" dans la colonne de gauche, vous y trouverez les variables fournies directement par Google Tag Manager ainsi que les variables que vous pouvez ajouter.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.21.01.png)

Nous allons ajouter une variable, cliquez sur "New", puis sur "variable de configuration".

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.23.04.png)

Choisissez "Variable Javascript" et  donnez un nom à votre variable puis sauvegardez.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.25.42.png)

Retournez dans la configuration de votre tag, et changez l'HTML personnalisé en mettant le {% raw %}```{{NOM DE VOTRE VARIABLE}}```{% endraw %} à la place du message. Sauvegardez votre tag et faites un "refresh" de votre "preview".

{% raw %}
```html
<script>
  alert("{{Message Alert}}");
</script>
```
{% endraw %}

Il faut maintenant mettre en place votre "data layer" dans vos pages HTML,  et ajouter vos variables avant l'appel du script Google Tag Manager.

```html
<html>
<head>
  <script>
  alertMsg = 'index';
</script>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5JQJFQV');</script>
  <!-- End Google Tag Manager -->
</head>
<body>
  TEST GTM
</body>
</html>
```

Vous pouvez donc choisir votre message de l'alerte en donnant la valeur à <span class="lang:default decode:true crayon-inline ">alertMsg</span> . Vous pouvez voir vos variables directement dans la console de debug.

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.36.39.png)

Vous pouvez mettre énormément d'informations dans votre "data layer" ce qui vous permet d'utiliser et de configurer chacun de vos tags selon votre page.

Maintenant que nous avons terminé notre travail, nous allons publier notre "container". Retournez dans l'interface Google Tag Manager et cliquez sur "Submit" en haut à droite. Vous arrivez sur une page vous montrant l'ensemble des modifications. Choisissez votre nom de version et une description pour cliquez sur "publish" .

![](/assets/2017-05-30-google-tag-manager-configuration-js/Capture-d’écran-2017-05-27-à-18.40.08.png)

Vous êtes redirigé sur la page de votre version, vous pouvez retourner sur votre site et maintenant tous les utilisateurs sont sur la nouvelle version. Vous pouvez quitter le mode debug.

Les versions permettent, comme pour git, de revenir sur certaines versions et de suivre l'évolution de vos tags.

### En conclusion

Google Tag Manager est un outil très complet qui permet enfin de gérer vos tags javascript sans mettre en production votre site. Il existe de nombreuses fonctionnalités que je n'ai pas expliquées, je vous invite à faire un tour dans le produit. Si vous voulez en savoir plus, laissez-moi un commentaire.
