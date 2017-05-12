---
layout: post
title: Google Cloud Platform (3/3) - Compute Engine, une architecture complete
author: jonanthan
date: '2016-12-12 14:48:05 +0100'
date_gmt: '2016-12-12 13:48:05 +0100'
categories:
- Dev Ops
tags:
- tutoriel
- web
- cloud
---
{% raw %}
Si vous avez suivi les deux premiers articles sur Google Cloud Platform, vous êtes capable de mettre en production un site rapidement et êtes capable de scaler automatiquement selon le trafic. Mais tout cela n'est possible qu'avec les éléments pré-installés de Google Cloud Platform. Comment créer sa propre configuration ? Réinstaller un serveur facilement ? Scaler automatiquement ?

<!--more-->

Dans ce tutoriel nous allons seulement installer un apache, mais vous pouvez appliquer tout ceci avec n'importe quelle installation.

#### Etape 1, créer votre configuration :
Allez dans le menu "Compute Engine", disponible <a href="https://console.cloud.google.com/compute/instances">ici</a>.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.09.20.png"><img class="aligncenter size-large wp-image-2744" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.09.20-1024x569.png" alt="Compute Engine - Google Cloud Platform" width="1024" height="569" /></a>

Puis cliquez sur "Créer une instance", vous allez arriver sur un formulaire qu'il va falloir remplir.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.11.17.png"><img class="aligncenter size-large wp-image-2745" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.11.17-1024x906.png" alt="Créer une instance - Google Cloud Platform" width="1024" height="906" /></a>

<ol>
<li>Choisissez un nom</li>
<li>Puis la zone (il s'agit du lieu du serveur)</li>
<li>Choisissez le type de machine (c'est ceci qui fait varier le prix)</li>
<li>Laissez le disque de démarrage par défaut</li>
<li>Cochez la case "Autoriser le trafic HTTP"</li>
</ol>
Ouvrez le lien "Gestion, disque, réseau et clés SSH", et dans l'onglet Disque décochez la case "Supprimer le disque de démarrage lorsque l'instance est supprimée".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.14.42.png"><img class="aligncenter size-full wp-image-2746" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.14.42.png" alt="Suppression du disque - Google Cloud Platform" width="956" height="574" /></a>

Cliquez alors sur "Créer".

#### Etape 2, installer apache :
Allez dans "Instance de VM" et attendre que la machine soit prête.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.18.22.png"><img class="aligncenter size-large wp-image-2747" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.18.22-1024x148.png" alt="Instance de VM - Google Cloud Platform" width="1024" height="148" /></a>

Cliquez sur SSH pour ouvrir la connexion à la machine.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.20.12.png"><img class="aligncenter size-large wp-image-2748" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.20.12-1024x809.png" alt="Connexion SSH - Google Cloud Platform" width="1024" height="809" /></a>

Une fois connecté, nous allons installer apache. Pour cela il vous suffit de lancer les commandes suivantes :

<pre class="lang:sh decode:true " title="Installation d'apache">sudo apt-get update;
sudo apt-get install apache2;
sudo /etc/init.d/apache2 restart;</pre>
Une fois terminé, si vous cliquez sur l'IP externe fournie dans l'interface "Instance de VM", vous devriez voir la page apache par défaut.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.25.36.png"><img class="aligncenter size-large wp-image-2749" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.25.36-1024x230.png" alt="Apache - Google Cloud Platform" width="1024" height="230" /></a>

Comme vous pouvez le voir l'installation prend un certain temps, et nous ne voulons pas le refaire pour chaque machine dont nous avons besoin. Nous allons donc nous servir de cette machine comme template pour d'autres machines.

#### Etape 3, création d'un template de machine :
Retour dans l'interface "Instance de VM", vous allez supprimer la machine en sélectionnant la VM puis cliquer sur supprimer.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.29.17.png"><img class="aligncenter size-large wp-image-2750" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.29.17-1024x444.png" alt="Supprimer une instance - Google Cloud Platform" width="1024" height="444" /></a>

Allez dans le menu "Images" et cliquez sur "Créer une image".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.32.54.png"><img class="aligncenter size-large wp-image-2751" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.32.54-1024x436.png" alt="Créer une image - Google Cloud Platform" width="1024" height="436" /></a>

Vous devez alors remplir le formulaire de création d'image.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.33.58.png"><img class="aligncenter size-large wp-image-2752" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.33.58-849x1024.png" alt="Formulaire Image - Google Cloud Platform" width="849" height="1024" /></a>

La seule chose qu'il faut surveiller, c'est le choix du disque source qui doit être celui de la machine que l'on vient de détruire.<br />
Une fois l'image créée, allez dans le menu "Modèles d'instances" et cliquez sur "Créer un modèle d'instance".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.37.04.png"><img class="aligncenter size-large wp-image-2753" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.37.04-1024x555.png" alt="Modèle d'instance - Google Cloud Platform" width="1024" height="555" /></a>

Vous arrivez dans un formulaire ressemblant à celui de la création d'instance.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.39.26.png"><img class="aligncenter size-large wp-image-2754" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.39.26-1024x861.png" alt="Modèle d'instance - Google Cloud Platform" width="1024" height="861" /></a>

Dans disque de démarrage, vous devez choisir l'image que vous venez de créer, elle est disponible dans l'onglet "images personnalisées" .

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.41.14.png"><img class="aligncenter size-large wp-image-2755" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.41.14-768x1024.png" alt="Image perso - Google Cloud Platform" width="768" height="1024" /></a>

Et n'oubliez pas de cocher la case "Autoriser le trafic HTTP". Puis cliquez sur "Créer".

Pour vérifier que tout est bon, nous allons créer de nouvelles instances via ce template.

#### Etape 4, création d'un groupe d'instance:
Allez dans le menu "Groupes d'instances" puis cliquez sur "Créer un groupe d'instances".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.47.54.png"><img class="aligncenter size-large wp-image-2756" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.47.54-1024x647.png" alt="Créer groupe d'instances - Google Cloud Platform" width="1024" height="647" /></a>

Vous avez l'habitude, nous arrivons sur un formulaire assez long.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.30.png"><img class="aligncenter size-large wp-image-2757" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.30-809x1024.png" alt="Formulaire 1 - Google Cloud Platform" width="809" height="1024" /></a>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.43.png"><img class="aligncenter size-full wp-image-2758" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.49.43.png" alt="Formulaire 2 - Google Cloud Platform" width="968" height="916" /></a>

<ol>
<li>Choisissez un nom pour votre groupe</li>
<li>Puis l'emplacement (le mieux c'est multizone qui permet d'avoir des serveurs dans le monde entier)</li>
<li>Prenez ensuite le "modèle d'instance" que vous venez de créer</li>
<li>Activez l'évolution dynamique</li>
<li>Mettez le minimum d'instances à 3</li>
</ol>
Vous pouvez alors créer le groupe.

Si vous retournez dans le menu "Instances de VM" vous pourrez voir les trois machines en cours de création. Une fois terminé, cliquez sur l"IP externe" de chaque machine. Normalement la page d'apache par défaut s'affiche.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.56.59.png"><img class="aligncenter size-large wp-image-2759" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-18.56.59-1024x286.png" alt="groupe d'instance - Google Cloud Platform" width="1024" height="286" /></a>

À partir de maintenant, nous avons un groupe d'instances qui va scaler selon le trafic. Seulement, le trafic arrive sur les trois Ips, il nous faut donc un "load balancer" devant les machines pour envoyer le trafic sur le groupe d'instances.

#### Etape 5, le load balancer :
Changez de menu et allez dans "réseau".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.02.40.png"><img class="aligncenter size-large wp-image-2760" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.02.40-1024x817.png" alt="Réseau - Google Cloud Platform" width="1024" height="817" /></a>

Puis allez dans "Équilibrage des charges", et créez un équilibreur.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.05.27.png"><img class="aligncenter size-large wp-image-2762" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.05.27-1024x369.png" alt="Load Balancer - Google Cloud Platform" width="1024" height="369" /></a>

Choisissez un équilibrage des charges HTTP(S).<br />
Vous pouvez alors configurer l'équilibreur.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.07.08.png"><img class="aligncenter size-large wp-image-2763" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.07.08-1024x522.png" alt="Configuration équilibreur - Google Cloud Platform" width="1024" height="522" /></a>

Choisissez un nom.<br />
Puis cliquez sur "Configuration des backends", et créez un service backend.<br />
Vous arrivez sur le formulaire suivant :

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.37.png"><img class="aligncenter size-full wp-image-2764" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.37.png" alt="Backed - Google Cloud Platform" width="860" height="450" /></a>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.42.png"><img class="aligncenter size-full wp-image-2765" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.10.42.png" alt="Formulaire - Google Cloud Platform" width="842" height="966" /></a>

<ol>
<li>Choisissez un nom</li>
<li>Puis l'instance backend (c'est le groupe créé juste avant)</li>
</ol>
Ajoutez un test périodique.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.11.07.png"><img class="aligncenter size-large wp-image-2766" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.11.07-883x1024.png" alt="Test périodique - Google Cloud Platform" width="883" height="1024" /></a>

<ol>
<li>Choisissez un nom</li>
<li>Puis le protocole http</li>
<li>Laissez le reste</li>
</ol>
Il ne nous reste plus qu'a cliquer sur "Règles d'hôte et de chemin d'accès", qui passera directement en vert. La même chose pour "Configuration du frontend" qui passe en vert automatique.

Vous n'avez plus qu'à créer, cela va prendre pas mal de temps (environs 5 min).

Vous pourrez trouver l'IP d'entrée du load balancer dans le menu "Équilibrage des charges", puis sur le load balancer fraîchement configuré vous aurez l'ip disponible.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.17.18.png"><img class="aligncenter size-large wp-image-2767" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.17.18-1024x488.png" alt="Load balancer - Google Cloud Platform" width="1024" height="488" /></a>

Toujours dans cette interface, dans l'onglet surveillance vous pouvez suivre les backends qui reçoivent les requêtes.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.20.22.png"><img class="aligncenter size-large wp-image-2768" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.20.22-1024x603.png" alt="Surveillance Backend - Google Cloud Platform" width="1024" height="603" /></a>

Et voila vous avez une architecture scalable automatiquement avec un load balancer comme un vrai architecte réseau.

#### Etape 6, on supprime les machines :
Avant de vous quitter, nous allons supprimer les machines.  Vous devez le faire dans l'ordre suivant car sinon les machines se relanceront automatiquement.

<ol>
<li>Supprimez le load balancer</li>
<li>Puis dans le menu avancé de l'équilibrage des charges supprimez le service backend</li>
<li>Retourner dans le menu "compute engine", puis "groupe d'instances"</li>
<li>Supprimez votre groupe d'instance</li>
</ol>
Si vous allez dans le dashboard vous devez ne plus voir de machine "compute engine"

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.28.32.png"><img class="aligncenter size-large wp-image-2769" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-30-à-19.28.32-1024x466.png" alt="Dashboard - Google Cloud Platform" width="1024" height="466" /></a>

&nbsp;

{% endraw %}
