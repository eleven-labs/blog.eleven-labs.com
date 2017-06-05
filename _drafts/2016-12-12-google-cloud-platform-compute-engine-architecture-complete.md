--- layout: post title: Google Cloud Platform (3/3) - Compute Engine,
une architecture complete author: jonanthan date: '2016-12-12 14:48:05
+0100' date\_gmt: '2016-12-12 13:48:05 +0100' categories: - Dev Ops
tags: - tutoriel - web - cloud --- {% raw %}

Si vous avez suivi les deux premiers articles sur Google Cloud Platform,
vous êtes capable de mettre en production un site rapidement et êtes
capable de scaler automatiquement selon le trafic. Mais tout cela n'est
possible qu'avec les éléments pré-installés de Google Cloud Platform.
Comment créer sa propre configuration ? Réinstaller un serveur
facilement ? Scaler automatiquement ?

Dans ce tutoriel nous allons seulement installer un apache, mais vous
pouvez appliquer tout ceci avec n'importe quelle installation.

#### Etape 1, créer votre configuration :

Allez dans le menu "Compute Engine", disponible
[ici](https://console.cloud.google.com/compute/instances).

[![Compute Engine - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.09.20-1024x569.png){.aligncenter
.size-large .wp-image-2744 width="1024"
height="569"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.09.20.png)

Puis cliquez sur "Créer une instance", vous allez arriver sur un
formulaire qu'il va falloir remplir.

[![Créer une instance - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.11.17-1024x906.png){.aligncenter
.size-large .wp-image-2745 width="1024"
height="906"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.11.17.png)

1.  Choisissez un nom
2.  Puis la zone (il s'agit du lieu du serveur)
3.  Choisissez le type de machine (c'est ceci qui fait varier le prix)
4.  Laissez le disque de démarrage par défaut
5.  Cochez la case "Autoriser le trafic HTTP"

Ouvrez le lien "Gestion, disque, réseau et clés SSH", et dans l'onglet
Disque décochez la case "Supprimer le disque de démarrage lorsque
l'instance est supprimée".

[![Suppression du disque - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.14.42.png){.aligncenter
.size-full .wp-image-2746 width="956"
height="574"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.14.42.png)

Cliquez alors sur "Créer".

#### Etape 2, installer apache :

Allez dans "Instance de VM" et attendre que la machine soit prête.

[![Instance de VM - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.18.22-1024x148.png){.aligncenter
.size-large .wp-image-2747 width="1024"
height="148"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.18.22.png)

Cliquez sur SSH pour ouvrir la connexion à la machine.

[![Connexion SSH - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.20.12-1024x809.png){.aligncenter
.size-large .wp-image-2748 width="1024"
height="809"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.20.12.png)

Une fois connecté, nous allons installer apache. Pour cela il vous
suffit de lancer les commandes suivantes :

``` {.lang:sh .decode:true title="Installation d'apache"}
sudo apt-get update;
sudo apt-get install apache2;
sudo /etc/init.d/apache2 restart;
```

Une fois terminé, si vous cliquez sur l'IP externe fournie dans
l'interface "Instance de VM", vous devriez voir la page apache par
défaut.

[![Apache - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.25.36-1024x230.png){.aligncenter
.size-large .wp-image-2749 width="1024"
height="230"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.25.36.png)

Comme vous pouvez le voir l'installation prend un certain temps, et nous
ne voulons pas le refaire pour chaque machine dont nous avons besoin.
Nous allons donc nous servir de cette machine comme template pour
d'autres machines.

#### Etape 3, création d'un template de machine :

Retour dans l'interface "Instance de VM", vous allez supprimer la
machine en sélectionnant la VM puis cliquer sur supprimer.

[![Supprimer une instance - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.29.17-1024x444.png){.aligncenter
.size-large .wp-image-2750 width="1024"
height="444"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.29.17.png)

Allez dans le menu "Images" et cliquez sur "Créer une image".

[![Créer une image - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.32.54-1024x436.png){.aligncenter
.size-large .wp-image-2751 width="1024"
height="436"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.32.54.png)

Vous devez alors remplir le formulaire de création d'image.

[![Formulaire Image - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.33.58-849x1024.png){.aligncenter
.size-large .wp-image-2752 width="849"
height="1024"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.33.58.png)

La seule chose qu'il faut surveiller, c'est le choix du disque source
qui doit être celui de la machine que l'on vient de détruire.\
Une fois l'image créée, allez dans le menu "Modèles d'instances" et
cliquez sur "Créer un modèle d'instance".

[![Modèle d'instance - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.37.04-1024x555.png){.aligncenter
.size-large .wp-image-2753 width="1024"
height="555"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.37.04.png)

Vous arrivez dans un formulaire ressemblant à celui de la création
d'instance.

[![Modèle d'instance - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.39.26-1024x861.png){.aligncenter
.size-large .wp-image-2754 width="1024"
height="861"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.39.26.png)

Dans disque de démarrage, vous devez choisir l'image que vous venez de
créer, elle est disponible dans l'onglet "images personnalisées" .

[![Image perso - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.41.14-768x1024.png){.aligncenter
.size-large .wp-image-2755 width="768"
height="1024"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.41.14.png)

Et n'oubliez pas de cocher la case "Autoriser le trafic HTTP". Puis
cliquez sur "Créer".

Pour vérifier que tout est bon, nous allons créer de nouvelles instances
via ce template.

#### Etape 4, création d'un groupe d'instance:

Allez dans le menu "Groupes d'instances" puis cliquez sur "Créer un
groupe d'instances".

[![Créer groupe d'instances - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.47.54-1024x647.png){.aligncenter
.size-large .wp-image-2756 width="1024"
height="647"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.47.54.png)

Vous avez l'habitude, nous arrivons sur un formulaire assez long.

[![Formulaire 1 - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.30-809x1024.png){.aligncenter
.size-large .wp-image-2757 width="809"
height="1024"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.30.png)

[![Formulaire 2 - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.43.png){.aligncenter
.size-full .wp-image-2758 width="968"
height="916"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.43.png)

1.  Choisissez un nom pour votre groupe
2.  Puis l'emplacement (le mieux c'est multizone qui permet d'avoir des
    serveurs dans le monde entier)
3.  Prenez ensuite le "modèle d'instance" que vous venez de créer
4.  Activez l'évolution dynamique
5.  Mettez le minimum d'instances à 3

Vous pouvez alors créer le groupe.

Si vous retournez dans le menu "Instances de VM" vous pourrez voir les
trois machines en cours de création. Une fois terminé, cliquez sur l"IP
externe" de chaque machine. Normalement la page d'apache par défaut
s'affiche.

[![groupe d'instance - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.56.59-1024x286.png){.aligncenter
.size-large .wp-image-2759 width="1024"
height="286"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.56.59.png)

À partir de maintenant, nous avons un groupe d'instances qui va scaler
selon le trafic. Seulement, le trafic arrive sur les trois Ips, il nous
faut donc un "load balancer" devant les machines pour envoyer le trafic
sur le groupe d'instances.

#### Etape 5, le load balancer :

Changez de menu et allez dans "réseau".

[![Réseau - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.02.40-1024x817.png){.aligncenter
.size-large .wp-image-2760 width="1024"
height="817"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.02.40.png)

Puis allez dans "Équilibrage des charges", et créez un équilibreur.

[![Load Balancer - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.05.27-1024x369.png){.aligncenter
.size-large .wp-image-2762 width="1024"
height="369"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.05.27.png)

Choisissez un équilibrage des charges HTTP(S).\
Vous pouvez alors configurer l'équilibreur.

[![Configuration équilibreur - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.07.08-1024x522.png){.aligncenter
.size-large .wp-image-2763 width="1024"
height="522"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.07.08.png)

Choisissez un nom.\
Puis cliquez sur "Configuration des backends", et créez un service
backend.\
Vous arrivez sur le formulaire suivant :

[![Backed - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.37.png){.aligncenter
.size-full .wp-image-2764 width="860"
height="450"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.37.png)

[![Formulaire - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.42.png){.aligncenter
.size-full .wp-image-2765 width="842"
height="966"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.42.png)

1.  Choisissez un nom
2.  Puis l'instance backend (c'est le groupe créé juste avant)

Ajoutez un test périodique.

[![Test périodique - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.11.07-883x1024.png){.aligncenter
.size-large .wp-image-2766 width="883"
height="1024"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.11.07.png)

1.  Choisissez un nom
2.  Puis le protocole http
3.  Laissez le reste

Il ne nous reste plus qu'a cliquer sur "Règles d'hôte et de chemin
d'accès", qui passera directement en vert. La même chose pour
"Configuration du frontend" qui passe en vert automatique.

Vous n'avez plus qu'à créer, cela va prendre pas mal de temps (environs
5 min).

Vous pourrez trouver l'IP d'entrée du load balancer dans le menu
"Équilibrage des charges", puis sur le load balancer fraîchement
configuré vous aurez l'ip disponible.

[![Load balancer - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.17.18-1024x488.png){.aligncenter
.size-large .wp-image-2767 width="1024"
height="488"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.17.18.png)

Toujours dans cette interface, dans l'onglet surveillance vous pouvez
suivre les backends qui reçoivent les requêtes.

[![Surveillance Backend - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.20.22-1024x603.png){.aligncenter
.size-large .wp-image-2768 width="1024"
height="603"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.20.22.png)

Et voila vous avez une architecture scalable automatiquement avec un
load balancer comme un vrai architecte réseau.

#### Etape 6, on supprime les machines :

Avant de vous quitter, nous allons supprimer les machines.  Vous devez
le faire dans l'ordre suivant car sinon les machines se relanceront
automatiquement.

1.  Supprimez le load balancer
2.  Puis dans le menu avancé de l'équilibrage des charges supprimez le
    service backend
3.  Retourner dans le menu "compute engine", puis "groupe d'instances"
4.  Supprimez votre groupe d'instance

Si vous allez dans le dashboard vous devez ne plus voir de machine
"compute engine"

[![Dashboard - Google Cloud
Platform](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.28.32-1024x466.png){.aligncenter
.size-large .wp-image-2769 width="1024"
height="466"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.28.32.png)

 

{% endraw %}
