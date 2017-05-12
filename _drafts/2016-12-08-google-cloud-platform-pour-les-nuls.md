---
layout: post
title: Google Cloud Platform (1/3) - Le cloud pour les nuls
author: jonathan
date: '2016-12-08 15:31:08 +0100'
date_gmt: '2016-12-08 14:31:08 +0100'
categories:
- Dev Ops
tags:
- tuto
- tutoriel
- Google
- web
- cloud
---
{% raw %}
<p>Aujourd'hui le Cloud c'est le mot à la mode, mais qu'est-ce que c'est ?</p>
<p>Comment ça marche ? Et comment en faire ?</p>
<p><!--more--></p>
#### Qu'est-ce que c'est ?
<p>C'est simple, c'est l'utilisation de la puissance de calcul de serveur distant via le réseau. En résumé, le Cloud nous permet de ne plus installer de machines physiques dans nos propres data-center mais d'utiliser ceux installées par d'autres.</p>
#### Comment ça marche ?
<p>En fait, vous utilisez du Cloud tous les jours. Par exemple votre messagerie mail est dans le Cloud, c'est d'ailleurs de celui-ci que nous allons parler.</p>
#### Comment en faire ?
<p>Aujourd'hui les deux plus gros fournisseurs de Cloud sont Amazon avec leur offre <a href="https://aws.amazon.com/fr/">AWS</a> et Google avec <a href="https://cloud.google.com/">GCP</a>. Les deux concurrents proposent des produits similaires. Pour cette série de tutoriels, nous allons nous concentrer sur Google et apprendre 3 façon de faire du Cloud.</p>
### Le Cloud pour les nuls
<p>Si vous êtes comme moi, c'est à dire pas passionné par l'installation des serveurs, nous allons commencer par l'installation "prêt-à-porter" d'un serveur. Dans cette exemple nous allons installer un <a href="https://jenkins.io/">Jenkins</a> en moins de 10 minutes, ce qui est un record si vous avez eu la chance d'en installer un vous-même.</p>
##### Etape 1, allons dans la console :
<p>Je vous invite à aller sur cette url <a href="https://cloud.google.com/">https://cloud.google.com/</a> puis à cliquer en haut à droite sur <a href="https://console.cloud.google.com/">console</a>. Vous devez alors vous connecter avec votre compte Google. À partir de maintenant, vous allez devoir sortir la carte bleue, mais pas de panique Google vous crédite de 300 dollars pour toute activation de compte. Cela sera suffisant pour faire les trois tutoriels prévus et même plus encore. Vous devez suivre les instructions de Google à partir de <a href="https://console.cloud.google.com/freetrial">cette page</a>. Une fois cette étape terminée, vous êtes redirigé vers un dashboard vide.</p>
##### Etape 2, création du projet :
<p>En haut du dashboard, vous devez alors créer un projet.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.09.13.png"><img class="aligncenter size-large wp-image-2722" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.09.13-1024x143.png" alt="Création d'un projet - Google Cloud Platform" width="1024" height="143" /></a></p>
<p>Vous devez choisir un nom de projet, celui-ci sera alors considéré comme l'id du projet pour le reste du tutoriel.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.11.57.png"><img class="aligncenter size-large wp-image-2723" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.11.57-1024x634.png" alt="Création du projet - Google Cloud Platform" width="1024" height="634" /></a></p>
<p>Vous êtes alors redirigé sur le dashboard du projet, vous y verrez toutes les infos de votre projet.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.15.47.png"><img class="aligncenter size-large wp-image-2724" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.15.47-1024x530.png" alt="Dashboard - Google Cloud Platform" width="1024" height="530" /></a></p>
##### Etape 3,  on va mettre un budget :
<p>Vous avez peur de payer trop cher lors des différents tutoriels, nous allons donc créer un quota dans le budget.<br />
Dans le menu, vous devez sélectionner "Facturation".</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.20.16.png"><img class="aligncenter size-large wp-image-2725" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.20.16-1024x511.png" alt="Facturation - Google Cloud Platform" width="1024" height="511" /></a></p>
<p>Puis cliquez sur "budgets et alertes", vous pouvez alors créer un budget.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.22.21.png"><img class="aligncenter size-large wp-image-2726" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.22.21-1024x457.png" alt="Créer un budget - Google Cloud Platform" width="1024" height="457" /></a></p>
<p>Il ne vous reste plus qu'a remplir le formulaire de création de budget.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.24.38.png"><img class="aligncenter size-large wp-image-2727" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.24.38-1024x964.png" alt="Formulaire création de budget - Google Cloud Platform" width="1024" height="964" /></a></p>
##### Etape 4, Jenkins en 5 minutes :
<p>Dirigez vous dans le menu "Cloud launcher", vous arrivez dans l'interface du choix des technologies disponibles pour être préinstallé.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.28.09.png"><img class="aligncenter size-large wp-image-2728" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.28.09-1024x397.png" alt="Cloud Launcher - Google Cloud Platform" width="1024" height="397" /></a></p>
<p>Vous n'avez plus qu'à chercher la solution Jenkins, vous arrivez alors sur l'interface de lancement de configuration.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.30.33.png"><img class="aligncenter size-large wp-image-2729" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.30.33-1024x477.png" alt="Configuration Jenkins - Google Cloud Platform" width="1024" height="477" /></a></p>
<p>Vous devez cliquer sur "Lancer sur Compute Engine", comme vous le voyez si vous laissez la configuration par défaut le coût estimé est de 14,20 dollars/mois. Je vous invite à jouer avec les options pour voir le prix changer.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.35.43.png"><img class="aligncenter size-large wp-image-2730" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.35.43-1024x789.png" alt="Deployer - Google Cloud Platform" width="1024" height="789" /></a></p>
<p>Il ne vous reste plus qu'à "déployer", cela peut prendre un peu de temps. Lorsque tout est terminé vous trouverez les éléments essentiels pour accéder à votre Jenkins fraîchement installé.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.38.53.png"><img class="aligncenter size-large wp-image-2731" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.38.53-1024x592.png" alt="Accéder à Jenkins - Google Cloud Platform" width="1024" height="592" /></a></p>
<p>Si tout est bon, cliquez sur "Visit the site", entrez les informations utilisateur disponibles sur l'interface précédente.<br />
Félicitations : Jenkins est installé.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.42.19.png"><img class="aligncenter size-large wp-image-2733" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.42.19-1024x686.png" alt="Jenkins - Google Cloud Platform" width="1024" height="686" /></a></p>
<p>Maintenant que vous savez faire du Cloud, nous allons passer à l'étape suivante dans le tutoriel 2.</p>
##### Etape 5, on supprime le projet :
<p>N'oubliez pas de supprimer le projet Jenkins, pour ne pas payer pour rien.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.51.59.png"><img class="aligncenter size-large wp-image-2736" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.51.59-1024x446.png" alt="Supprimer Jenkins - Google Cloud Platform" width="1024" height="446" /></a></p>
{% endraw %}
