--- layout: post title: Google Cloud Platform (1/3) - Le cloud pour les
nuls author: jonathan date: '2016-12-08 15:31:08 +0100' date\_gmt:
'2016-12-08 14:31:08 +0100' categories: - Dev Ops tags: - tuto -
tutoriel - Google - web - cloud --- {% raw %}

Aujourd'hui le Cloud c'est le mot à la mode, mais qu'est-ce que c'est ?

Comment ça marche ? Et comment en faire ?

#### Qu'est-ce que c'est ?

C'est simple, c'est l'utilisation de la puissance de calcul de serveur
distant via le réseau. En résumé, le Cloud nous permet de ne plus
installer de machines physiques dans nos propres data-center mais
d'utiliser ceux installées par d'autres.

#### Comment ça marche ?

En fait, vous utilisez du Cloud tous les jours. Par exemple votre
messagerie mail est dans le Cloud, c'est d'ailleurs de celui-ci que nous
allons parler.

#### Comment en faire ?

Aujourd'hui les deux plus gros fournisseurs de Cloud sont Amazon avec
leur offre [AWS](https://aws.amazon.com/fr/) et Google avec
[GCP](https://cloud.google.com/). Les deux concurrents proposent des
produits similaires. Pour cette série de tutoriels, nous allons nous
concentrer sur Google et apprendre 3 façon de faire du Cloud.

### Le Cloud pour les nuls

Si vous êtes comme moi, c'est à dire pas passionné par l'installation
des serveurs, nous allons commencer par l'installation "prêt-à-porter"
d'un serveur. Dans cette exemple nous allons installer un
[Jenkins](https://jenkins.io/) en moins de 10 minutes, ce qui est un
record si vous avez eu la chance d'en installer un vous-même.

##### Etape 1, allons dans la console :

Je vous invite à aller sur cette url <https://cloud.google.com/> puis à
cliquer en haut à droite sur
[console](https://console.cloud.google.com/). Vous devez alors vous
connecter avec votre compte Google. À partir de maintenant, vous allez
devoir sortir la carte bleue, mais pas de panique Google vous crédite de
300 dollars pour toute activation de compte. Cela sera suffisant pour
faire les trois tutoriels prévus et même plus encore. Vous devez suivre
les instructions de Google à partir de [cette
page](https://console.cloud.google.com/freetrial). Une fois cette étape
terminée, vous êtes redirigé vers un dashboard vide.

##### Etape 2, création du projet :

En haut du dashboard, vous devez alors créer un projet.

[![Création d'un projet - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.09.13-1024x143.png){.aligncenter
.size-large .wp-image-2722 width="1024"
height="143"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.09.13.png)

Vous devez choisir un nom de projet, celui-ci sera alors considéré comme
l'id du projet pour le reste du tutoriel.

[![Création du projet - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.11.57-1024x634.png){.aligncenter
.size-large .wp-image-2723 width="1024"
height="634"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.11.57.png)

Vous êtes alors redirigé sur le dashboard du projet, vous y verrez
toutes les infos de votre projet.

[![Dashboard - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.15.47-1024x530.png){.aligncenter
.size-large .wp-image-2724 width="1024"
height="530"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.15.47.png)

##### Etape 3,  on va mettre un budget :

Vous avez peur de payer trop cher lors des différents tutoriels, nous
allons donc créer un quota dans le budget.\
Dans le menu, vous devez sélectionner "Facturation".

[![Facturation - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.20.16-1024x511.png){.aligncenter
.size-large .wp-image-2725 width="1024"
height="511"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.20.16.png)

Puis cliquez sur "budgets et alertes", vous pouvez alors créer un
budget.

[![Créer un budget - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.22.21-1024x457.png){.aligncenter
.size-large .wp-image-2726 width="1024"
height="457"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.22.21.png)

Il ne vous reste plus qu'a remplir le formulaire de création de budget.

[![Formulaire création de budget - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.24.38-1024x964.png){.aligncenter
.size-large .wp-image-2727 width="1024"
height="964"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.24.38.png)

##### Etape 4, Jenkins en 5 minutes :

Dirigez vous dans le menu "Cloud launcher", vous arrivez dans
l'interface du choix des technologies disponibles pour être préinstallé.

[![Cloud Launcher - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.28.09-1024x397.png){.aligncenter
.size-large .wp-image-2728 width="1024"
height="397"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.28.09.png)

Vous n'avez plus qu'à chercher la solution Jenkins, vous arrivez alors
sur l'interface de lancement de configuration.

[![Configuration Jenkins - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.30.33-1024x477.png){.aligncenter
.size-large .wp-image-2729 width="1024"
height="477"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.30.33.png)

Vous devez cliquer sur "Lancer sur Compute Engine", comme vous le voyez
si vous laissez la configuration par défaut le coût estimé est de 14,20
dollars/mois. Je vous invite à jouer avec les options pour voir le prix
changer.

[![Deployer - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.35.43-1024x789.png){.aligncenter
.size-large .wp-image-2730 width="1024"
height="789"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.35.43.png)

Il ne vous reste plus qu'à "déployer", cela peut prendre un peu de
temps. Lorsque tout est terminé vous trouverez les éléments essentiels
pour accéder à votre Jenkins fraîchement installé.

[![Accéder à Jenkins - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.38.53-1024x592.png){.aligncenter
.size-large .wp-image-2731 width="1024"
height="592"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.38.53.png)

Si tout est bon, cliquez sur "Visit the site", entrez les informations
utilisateur disponibles sur l'interface précédente.\
Félicitations : Jenkins est installé.

[![Jenkins - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.42.19-1024x686.png){.aligncenter
.size-large .wp-image-2733 width="1024"
height="686"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.42.19.png)

Maintenant que vous savez faire du Cloud, nous allons passer à l'étape
suivante dans le tutoriel 2.

##### Etape 5, on supprime le projet :

N'oubliez pas de supprimer le projet Jenkins, pour ne pas payer pour
rien.

[![Supprimer Jenkins - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.51.59-1024x446.png){.aligncenter
.size-large .wp-image-2736 width="1024"
height="446"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-11.51.59.png)

{% endraw %}
