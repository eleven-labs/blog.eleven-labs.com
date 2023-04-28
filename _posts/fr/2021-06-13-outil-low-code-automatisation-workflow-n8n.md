---
lang: fr
date: '2021-06-13'
slug: outil-low-code-automatisation-workflow-n8n
title: 'n8n, outil low-code d''automatisation de workflow'
excerpt: >-
  Découverte et prise en main de n8n.io, outil low-code open-source pour
  automatiser facilement des workflows.
cover: /assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/n8n.png
authors:
  - marianne
categories: []
keywords:
  - low-code
  - outils
  - tutorial
---

Vous souvenez-vous de l'époque des premières versions de Dreamweaver ou de Frontpage dans les années 2000 ? Ces logiciels qui permettaient de faire des sites internet sans faire une ligne de code ? Le code généré était dégueulasse, et c'est tombé en désuétude.
Pourtant, ils font leur grand retour : les applications no-code et low-code ont de nouveau la hype, facilitant la vie des clients et des développeurs.

Parmi tous les types d'outils proposés, ceux proposant l'automatisation de workflows font de plus en plus de l'oeil aux entreprises.
Sur le marché, il existe plusieurs acteurs : [Zapier](https://zapier.com/), [integromat](https://www.integromat.com/en), et celui qui va vous être présenté, [n8n](https://n8n.io/).

Cet outil low-code permet de créer facilement des workflows automatisés où il suffit de faire des connexions entre des noeuds via une interface. Dans les noeuds proposés, il y a par exemple GitHub, GitLab, des services AWS, des services Google, des services de messageries et pour ceux qui veulent quand même coder un peu, des commandes SSH ou la possibilité de pouvoir faire des fonctions en Javascript.

n8n est open-source, sous licence fair-code : vous pouvez vous amuser avec en local et le déployer sur votre serveur si vous en avez besoin. Une version Saas existe, mais comme ses concurrents, la facture peut vite devenir salée.

## Installation sur votre machine
La [documentation](https://docs.n8n.io/getting-started/quickstart.html) est assez bien faite avec plusieurs possibilités d’installation.

Pour une installation rapide qui vous permettra de sauvegarder vos projets dans le dossier ~/.n8n, vous pouvez lancer un container docker contenant le projet :

```
docker run -it --rm \
	--name n8n \
	-p 5678:5678 \
	-v ~/.n8n:/home/node/.n8n \
	n8nio/n8n
```
![Sortie de la console]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/install/install.png)

Voilà, vous n’avez plus qu’à appuyer sur “o” ou à aller sur l’url [http://localhost:5678/](http://localhost:5678/) pour accéder à l’interface.

## Faire votre premier workflow
Pour tester n8n, je vous propose le scénario suivant :

> Je souhaite qu'en début de semaine, un mail me soit envoyé avec mon planning à venir
> ainsi que les tâches que j’ai à faire pour pouvoir m’organiser.

En plus de n8n, vous avez besoin d’un compte Google, avec Google Calendar, Google Tasks et Gmail.

### L’interface
L’outil propose une interface assez claire, avec à droite un menu permettant de gérer les workflows et les credentials pour accéder aux différentes applications que vous souhaitez utiliser, à gauche la recherche pour ajouter un noeud, et au centre, la création de votre workflow.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/workflow_init.png)

### Premier noeud : le trigger
Le trigger *Start* est par défaut sur chaque worflow et on ne peut pas le supprimer, mais cela ne pose aucun souci.
Pour le scénario, il s’agit d’un trigger *Cron* qui sera déclenché tous les dimanches soir à 20h.

Il suffit d’aller le chercher dans la liste des triggers dans l’ajout de noeuds à gauche.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/cron/add_trigger_cron.png)

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/cron/popin_trigger_cron.png)

Dans le cas d’un trigger de type GitLab, il vous faudra saisir les credentials associés. Je vais montrer comment en rajouter lors des étapes suivantes pour les API Google.

### Deuxième noeud : créer les variables de dates de début et de fin pour la recherche dans mon calendrier
Comme vous allez pouvoir le voir dans le noeud *Google Calendar* qui viendra ensuite, il est possible de filtrer les emails avec des dates de début et de fin.
Pour cela, il faut ajouter le noeud *Function* et rajouter le code javascript proposé sur [cet article de blog sur n8n](https://n8n.io/blog/tracking-time-spent-in-meetings-with-google-calendar-twilio-and-n8n/) pour les créer.

```js
var curr = new Date;
var first = (curr.getDate() - curr.getDay()) +1;
var last = first + 4;

var firstday = new Date(curr.setDate(first));
var lastday = new Date(curr.setDate(last));

beginning_week = new Date(firstday.setHours(0,0,0,0));
ending_week = new Date(lastday.setHours(23,59,59,99));

items[0].json.from = beginning_week.toISOString();
items[0].json.to = ending_week.toISOString();

return items;
```

Pour avoir les variables pour le noeud suivant, il faut cliquer sur _Execute Node_ en haut à gauche de la popin.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/function_start_end_date/function_start_end_date.png)

### Troisième noeud : récupérer mon planning de la semaine sur Google Calendar
Maintenant que nous avons les valeurs pour filtrer, vous allez pouvoir ajouter un noeud de type _Google Calendar_.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_calendar/popin_empty.png)

Ici, il va falloir rajouter les credentials de votre compte Google. Dans la popin de configuration du noeud, vous pouvez accéder directement à la création de credentials via  _Credentials -> Calendar Calendar -> Select “Create new”_.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_calendar/credentials_empty.png)

La documentation de n8n vous explique [comment récupérer vos credentials](https://docs.n8n.io/credentials/google/#prerequisites) si vous ne savez pas comment procéder. Vous allez devoir aller sur le Google Cloud Platform et si vous en avez besoin, créer un projet.

N’oubliez pas non plus d’activer l’API correspondant à l’outil que vous voulez utiliser : n8n vous le rappellera quand ça ne sera pas fait en vous indiquant l’URL à suivre.

Un nouveau _Credential_ sera à recréer pour chaque API différente que vous allez devoir appeler dans ce workflow.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_calendar/credentials.png)

Quand la configuration du _Credential_ est terminée, il faut saisir le reste des paramètres du noeud :
-   Resource : Event
-   Operation : Get All
-   Calendar ID : À récupérer sur Google Calendar, faites un clic droit sur le calendrier que vous voulez, puis l'information figure dans les paramètres
-   Return All : true
-   Options : Rajouter les filtres _Start Time_ et _End Time_. Pour chacun, cliquez sur les écrous puis sur _Add Expression_. Dans la popin, il est possible de récupérer facilement la valeur des items définis dans la fonction précédente.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_calendar/parameters_without_list.png)

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_calendar/filter.png)

Pour tester le noeud, cliquez sur _Execute Node_, et vous verrez l’ensemble des événements pour cet intervalle.

### Quatrième noeud : Récupérer la todo list de Google Tasks
Pour cet article, j’ai fait une petite liste simple sur Google Tasks.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_tasks/list.png)

Comme pour Google Calendar, après avoir ajouté le noeud, il faudra configurer les credentials.

Ensuite, dans les paramètres à saisir, il suffit d'indiquer que vous souhaitez toutes les tasks de votre liste. La TaskList doit normalement être une sélection d'une liste parmi l’ensemble de vos listes. Si vous n'avez rien, cela signifie que vous avez un souci d’accès.

Même scénario pour tester, cliquez sur _Execute node_, vous allez avoir votre tableau de tasks à faire.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/google_tasks/popin.png)

Votre workflow ressemble maintenant à ça :

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/workflow_wip.png)

Il faut maintenant merger les données, créer le mail puis l'envoyer.

### Cinquième noeud : merger les données
Il s’agit du noeud le plus simple dans cet exemple : _Merge_. Il y a plusieurs options de merge possible, et celui qui nous intéresse est _append_.

Après le _Execute Node_, vous avez la liste combinée des événements de la semaine et des tâches à faire.

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/merge/merge.png)

### Sixième noeud : Créer le contenu du mail
Pour créer un contenu de mail tout propre, j’ai décidé d’utiliser une nouvelle fois le noeud _Function_.
Le code Javascript permet de renvoyer un tableau json (contrainte de n8n) contenant uniquement le message HTML que j’ai créé. Les informations renvoyées sont très basiques, à vous d’y mettre ce que vous voulez.

 ```js
messageHTML = "Bonjour Astronaute, <br/> Voici ton planning de la semaine : <br /><ul>";
for (item of items) {
  switch(item.json.kind) {
    case 'calendar#event':
      startDate = new Date(Date.parse(item.json.start.dateTime));
      messageHTML += "<li>Evénement: "+ item.json.summary +" prévu le "+ startDate.toLocaleString("fr-FR") +"</li>";
      break;
    case 'tasks#task':
      if(item.json.status != 'needsAction') {
        continue;
      }
      messageHTML += "<li>Tâche à faire: " +item.json.title+ "</li>";

      break;
  }
}

messageHTML += "</ul>";

newItems = [];
newItems.push({
  json: {
    message: messageHTML
  }
});

return newItems;
```

Testez pour voir le rendu :

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/function_message/function_message.png)

### Dernier noeud : envoi du mail avec toutes les informations
Voici la dernière étape, l'envoi de l'email avec le message.
Après avoir configuré encore une fois les credentials, vous n’avez qu’à indiquer :
-  Resource: Message
-  Operation: Send
-  Subject: Votre titre
-  HTML: true (puisque j’ai fait un message en HTML)
-  HTML Message/Message: Add Expression, et sélectionner le message
-  To Email: l’email du destinataire, vous

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/gmail/popin.png)

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/gmail/message_expression.png)

### Workflow final et réception du mail
![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/workflow_final.png)

Maintenant que le workflow est fini, il ne reste plus qu’à cliquer sur _Execute Workflow_ pour tester de bout-en-bout. Si tout se passe bien, vous allez recevoir ce fameux email :

![]({{ site.baseurl }}/assets/2021-06-13-outil-low-code-automatisation-workflow-n8n/email.png)

Il ne manque plus qu’à activer votre workflow pour qu’il vous envoie le mail toutes les semaines.

## Conclusion
n8n n’est pas un outil grand public, il faut comprendre un minimum l’éco-système de l’IT pour comprendre et savoir l'utiliser. Il permet avant tout de gagner du temps sur les développements : pas la peine de réécrire du code pour récupérer les informations de différentes API, et la manipulation du workflow se fait facilement.

En plus de pouvoir faire des projets personnels pour s’améliorer la vie, il est tout à fait possible de l’utiliser pour les projets en entreprise. n8n a fait une levée de fond de presque 10 millions d'euros en avril 2021, et integromat, un des concurrents de n8n, est utilisé par de nombreuses grosses entreprises telles que Cisco, Uber ou Spotify. On peut y voir un engouement pour ces outils, et ça serait dommage de ne pas s'y intéresser dans le milieu professionnel.

## Sources
- n8n : le [site](https://n8n.io/), la [documentation](https://docs.n8n.io/) et le [blog](https://n8n.io/blog)
- Talk show [Underscore_](https://www.twitch.tv/Micode) :  [NO-CODE : Fausse bonne idée ?](https://www.youtube.com/watch?v=h2VqCnmni8M)
