---
layout: post
title: Introduction à Microsoft Azure
excerpt: Si vous avez lu “Microsoft” et que vous n’avez pas fuit, bienvenue sur cette
introduction à la solution de Cloud Microsoft.
authors:
    - gthibault2
lang: fr
permalink: /fr/introduction-a-microsoft-azure/
categories:[]    
tags:[]
    
cover: /assets/2022-02-15-introduction-a-microsoft-azure/COOKIE.jpg
---

Si vous avez lu **“Microsoft”** et que vous n’avez pas fuit, bienvenue sur cette
introduction à la solution de **Cloud Microsoft** !
Ayant travaillé deux ans sur la solution, j’ai eu envie de partager ce que j’avais pu apprendre sur **Azure** et livrer mes astuces et mon ressenti sur cet outil.

La star de cet article est **Microsoft Azure**. C’est la solution de **cloud computing** fournie par Microsoft.
Cet article a pour objectif de faire une brève **introduction de la solution**, son écosystème et permettre de faire ses **premiers** pas sur la solution.

Pour commencer, nous allons voir ce qu’est Azure, puis je donnerais un avis personnel sur la solution et nous finirons sur un premier tutoriel. 

Toujours présent ? Let’s go ! 

##Microsoft Azure, c’est quoi ? 

###Les concepts de Microsoft Azure

Comme dit plus haut, **Azure** est la **solution Microsoft de cloud**. Il permet l’accès à de nombreux **services hébergés par Microsoft**. Actuellement, on en répertorie une centaine mais ce nombre augmente rapidement avec les innovations. 

Bien que cette solution soit principalement utilisée en tant que **cloud public**, Azure permet par l’utilisation d’**Azure Stack** de mettre en place un **cloud privé** et un **cloud hybride**. Cependant, nous n'aborderons que la notion de cloud public dans cet article.

```Petit rappel sur les notions de cloud privé, public et hybride :
* Le **cloud public** permet l’accès à différents services via les infrastructures Microsoft. 
* Le **cloud privé** permet l’accès à différents services aussi, mais hébergés sur sa propre infrastructure.
* Le **cloud hybride** est un mix des deux.
```

Faire une liste de l’ensemble des services Azure serait long et pas forcément intéressant.
Je vais donc lister ceux qui me semblent être les plus importants. Ils seront détaillés par la suite dans d’autres articles à venir.

Les **services Microsofts Azure principaux** sont : 
* Computing (Machines virtuelles, conteneurs, kubernetes, etc … ), 
* Sécurité (Pare-feu, étude des menaces, monitoring, etc … ),
* Identité (Active directories, etc …),
* Réseau (route, dns, gateway, etc … ),
* Stockage (bases de données, différents types de stockage en fonction des besoins, etc ...),
* IOT (API, Azure Cosmos DB, etc ...)

Cependant, si vous souhaitez la **liste exhaustive**, voici le lien vers la page du **site de Microsoft** qui détaille l’ensemble : [Liste des services Azure](https://azure.microsoft.com/fr-fr/services/)

Comme beaucoup de solutions cloud, ces services sont hébergés dans différents datacenters, localisés dans différents pays.

###L’écosystème Azure.

Azure est déjà une plate-forme applicative cloud complète, mais elle possède également un **écosystème intéressant**, et notamment: 

**Azure DevOps** qui est une **boite à outils pour DevOps** assez complète. Elle permet via une seule interface de : 
* Gérer des items “agiles” (Epics, User stories, sprint, etc ...),
* Synchroniser un github et y avoir accès via l’interface,
* Gérer les builds, les artéfacts,
* Gérer les pipelines,
* Gérer la création et l’application de tests automatisés.
Pour plus d’information, vous pouvez jeter un oeil ici : [Documentation Azure Devops](https://azure.microsoft.com/fr-fr/services/devops/)

**Office365** qui est un service de **gestion de postes utilisateurs** (en terme 'plus barbare', moderne workplace). Il permet la gestion de ce dont un poste Windows doit avoir besoin. Par exemple les mails, les logiciels. 

**PowerApps** qui est un outil permettant de créer une application avec peu de code. Il est principalement utilisé pour **automatiser des processus métier**. 

##Mon ressenti par rapport à Azure

###Les forces d’Azure

La **force principale d’Azure** (et ce ne sera pas une surprise), est sa **compatibilité avec les services Microsoft**. En effet, il est **simple** de coupler son infrastructure cloud Azure avec celle que l’on a en local. 
Il en est de même avec Office365 vue plus haut et qui est un service qui occupe une place importante chez Microsoft.

Sa seconde force selon moi est son service Azure DevOps. Il permet la mise en place d’une première démarche DevOps assez facilement, avec une administration simplifiée et un côté graphique qui peut être rassurant. 

###Ses faiblesses

La force principale d’Azure est aussi sa plus grosse faiblesse: Le fait qu’il soit aussi bien intégré avec tout ce qui touche à Microsoft et favorise l’accès au service Microsoft, peut gêner pour la mise en place de solutions externes. De plus celà créer une dépendance à Microsoft.

Le second mauvais point reste dans le thème. Les **licences Microsoft** sont très/trop compliquées par rapport à ses concurrents directs comme AWS.

Maintenant que la partie théorique est terminée, passons aux choses sérieuses.

##Un peu de technique

###Accès à une version de test de la plateforme.

Microsoft fournit un accès pour tester sa solution. Il suffit d'effectuer les étapes suivantes.

1- Cliquez sur le lien ci-dessous.

[Accès a une version de test](https://azure.microsoft.com/fr-fr/free/)

2- Cliquez sur le bouton encadré en rouge.
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/FREE.png)
3- Connectez-vous via le portail Microsoft. (si vous n’avez pas de compte, créez-en un
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/CO.png))
4- Remplissez le formulaire avec vos informations. A la fin de la procédure, vos informations bancaires vous seront demandés. C’est une sécurité pour éviter de créer plusieurs comptes gratuits. 

###Votre première Infrastructure

Dans ce chapitre, nous verrons ensemble quelques notions importantes complétés par des exemples concrets. 

####Les base de l’organisation des ressources

La compréhension de l'arborescence des ressources sur Azure permet de mieux organiser ses ressources et vous simplifieras la vie pour l'administration et la gestion des côuts.   
Nous avons donc: 
* le management groupe, qui peut gérer plusieurs Abonnements.
* l'abonnement qui contient plusieurs groupes de ressources.
* les groupes de ressource qui peuvent contenir plusieurs ressources Azure (machines virtuelles, applications, …). 

Voici un schéma qui résume l'ensemble : 

![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/ORGA.png)

####Votre première machine virtuelle

Reprenons notre compte fraichement crée. 

1- Nous allons commencer par vérifier que nous possédons bien un abonnement de disponible.
* Dans l'onglet de recherche, entrez 'abonnement' (1)
* Selectionnez 'Abonnement' (2) 
* Vérifiez qu'il est bien présent (3)
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/ABO.png)
2- Nous avons un abonnement, il nous faut donc un groupe de ressource.
** Dans l'onglet de recherche, entrez 'groupe de ressource' (1)
* Selectionnez 'Groupe de Ressources' (2)
* Cliquez sur 'Créer' (3)
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/RG.png)
3- Vous êtes sur l'interface qui va permettre de configurer le groupe de ressource.
* Entrez le nom du groupe (1)
* Cliquez sur 'Vérifier + Créer'
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/RGC.png)
4- Nous allons créer et ajouter un Groupe de Ressource Réseau. C'est l'équivalant du 'pare-feu' version Azure.
* Dans l'interface de recherche, entrez 'NSG' (1)
* Sélectionnez 'Groupe de Ressources Réseau' (2)
* Cliquez sur 'Créer' 
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/NSG.png)
5- Nous allons configurer le 'Groupe de Ressource Réseau'
* Sélectionner le 'ressource groupe' crée précedemment. (1)
* Entre le nom du groupe réseau (2)
* Vérifier que la région est bien en 'France'.
* Cliquez sur 'Vérifier + Créer' (3)
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/NSGC.png)
* Votre groupe de sécurité est crée. Ici nous avons les règles par défaults. Nous verrons dans un autre article comment administrer ces règles.
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/NSGR.png)
6- Les pré-requis sont en place, nous allons intaller notre machine virtuelle
** Dans l'onglet de recherche, entrez 'machine virtuelle' (1)
* Selectionnez 'Machine Virtuelle' (2)
* Cliquez sur 'Créer' (3)
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/MV.png)
7- Une fois sur la page de configuration, il faut faire attention aux point suivants : 
* Ajouter notre Groupe de Ressources (1)
* Ajouter le nom de la Machine Virtuelle (2)
* Vérifier que la région est bien 'France' ou le pays le plus proche du votre (3)
* Choisir l'OS de la machine (4)
* Choisir la taille en fonction du besoin (5)
* Cliquez sur 'Suivant : Disques'
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/MVC11.png)
8- Selectionner le type de disque qui vous intéresse (2)
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/MVCD.png)
9- Selectionner les paramètres réseau : 
* Au niveau de 'Groupe de sécurité réseau de la carte réseau', cochez 'Paramètres avancés'(1)
* Selectionner le groupe réseaux crée précedemment.
* Cliquez sur 'Vérifier + créer'
![]({{site.baseurl}}/asset/2022-02-15-introduction-a-microsoft-azure/MVCN.png)

Votre première machine virtuelle Azure est crée, **Félicitation**.

##Le mot de la fin 

Voici un **premier aperçu** de la solution Azure. Nous avons pu voir rapidement l’utilité de la solution, et en quoi elle et son écosystème peuvent être intéressants. Vous avez aussi fais vos premiers pas sur la solution.
Si vous cherchez plus d’information, je ne peux que vous rediriger vers la documentation microsoft sur le sujet. 
Dans de prochains articles, nous irons plus loin dans la configuration de la solution et nous verrons les services plus en détail.

