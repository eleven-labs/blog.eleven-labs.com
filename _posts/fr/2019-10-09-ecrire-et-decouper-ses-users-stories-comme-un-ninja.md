---
layout: post
title: "Ecrire et découper ses Users Stories comme un ninja"
lang: fr
permalink: /fr/ecrire-et-decouper-ses-users-stories-comme-un-ninja/
excerpt: Écrire une User Story efficace n'est pas un exercice simple et cela nécessite de l'entraînement, même si à première vue "il ne s'agit que d'une petite phrase courte". Comme en développement, il ne s'agit jamais "que" de cela. Dans le cadre d'un projet AGILE vos Users Stories sont la transcription du besoin des différentes parties prenantes, découpées en incréments fonctionnels.
authors:
    - pbrenot
categories:
    - agile
tags:
    - agile
    - organisation

---


## INTRODUCTION

Écrire une User Story efficace n'est pas un exercice simple et cela nécessite de l'entraînement, même si à première vue "il ne s'agit que d'une petite phrase courte". Comme en développement, il ne s'agit jamais "que" de cela. Dans le cadre d'un projet AGILE vos Users Stories sont la transcription du besoin des différentes parties prenantes, découpées en incréments fonctionnels.

Question bête : "Quel est l'intérêt de passer autant de temps sur des Users Stories ? On ne peut pas simplement donner les grandes lignes et on verra ?"
Alors oui, mais ça ce sont des EPICS, et nous parlons ici du niveau de granularité inférieur.
L’intérêt de disposer de petites User Stories de qualité est très facilement démontrable.

 - Pour l'équipe : il est bien plus motivant de passer 4 Users Stories en DONE qu'une seule sur un sprint. On se rend plus facilement compte de la valeur que l'on crée et que l'on livre. Mais c'est aussi plus de souplesse pour l'équipe qui peut terminer une User Story et passer plus rapidement à autre chose (aider un autre co-équipier).
 - Pour le produit : on livrera plus rapidement des choses qui pourront alors êtres testées et avoir du feedback à chaud, réduire l'incertitude sur des fonctionnalités en ne livrant que l'essentiel (une sorte de Minimum Marketable Feature). Mais surtout, on limite le risque technique car il est plus simple de tester une feature sur un scope limité que quelque chose de plus gros et cela a plus de chances de passer en DONE.
 - Pour le Product Owner : outre le côté feedback et réduction du flou, il est plus facile de prioriser des éléments dont la granularité est fine (on ciblera les scénarios générateurs de forte valeur en écartant le reste). Il devient aussi plus facile de changer les priorités en cours de route ou d'effectuer des pivots. Enfin, on s'assure aussi plus facilement que des éléments seront terminés dans le sprint quand on a 6 Users Stories, plutôt que 2 grosses Users Stories.

Convaincu ? On passe à la suite.
![Mauvaise User Story]({{ site.baseurl }}/assets/2019-10-09-ecrire-et-decouper-ses-users-stories-comme-un-ninja/2019-10-09-not-sure.png)


## LES BONNES PRATIQUES DE LA USER STORY AGILE A GARDER EN TÊTE

Comme il s'agit de l'une des matières premières vous permettant de modeler votre produit et d'alimenter l'équipe, vous voudrez que vos Users Stories soient aussi raffinées que possible : ce n'est pas avec du métal rouillé que Thor aurait pu faire forger Stormbreaker (cf : Marvel Universe).
Avant même de parler de découpage, nous allons donc aborder quelques unes des bonnes pratiques (qui ne sont bien entendu pas de moi) à avoir en tête pour son écriture. Sachez cependant qu'il en existe bien d'autres, comme S.M.A.R.T (pour continuer d'avancer sur votre HA), vous trouverez facilement des articles sur le sujet.

#### LES 3C

 - **Card**
 L'histoire racontée par la User Story doit être assez courte pour tenir sur un post-it (même si vous utilisez Jira,
   Trello...). Allez à l'essentiel, vous ne voulez pas qu'on la lise en diagonale.
 -  **Conversation**
 La User Story ne doit pas être exhaustive. Ses détails seront discutés avec l'équipe technique et le métier afin de
   s'assurer d'en avoir la même compréhension.
 - **Confirmation**
 Il faut que la User Story puisse être validée. Des tests d'acceptation doivent donc être rédigés sinon il ne sera pas possible d'en définir la bonne implémentation. Vous verrez, il est parfois même plus simple de partir de ces tests pour écrire votre User Storie.

#### INVEST

- **I - Independent** (indépendante)
Une User Story doit être indépendante des autres User Stories, car tout incrément finalisé en fin de sprint doit être "potentiellement livrable". Cela vous assurera qu'il n'y a pas de chevauchement entre vos différentes User Stories, et surtout cela en facilitera la priorisation lors des sprints plannings. L'équipe aura aussi plus de liberté dans l'ordre d'implémentation et personne ne devra attendre le travail d'une autre pour avancer.
Attention cependant : on parle d'indépendance technique ou d'indépendance produit ? Les deux. Cependant, quand on dit "potentiellement livrable" on entend par là que la feature peut ne pas avoir de sens à être livrée en production sans une autre feature. On parlerait alors de "dépendance au sens du release Planning", ce qui n'est pas un problème dans la mesure où les Users Stories sont bien indépendantes techniquement et qu'elle peuvent être testées par un utilisateur.

- **N - Negociable** (négociable)
Un peu à la manière du deuxième C (Conversation) ses détails doivent pouvoir être discutés par toutes les parties prenantes. Aussi elle ne doit pas être trop restrictive et étoffée de détails qui auraient plutôt tendance à contraindre l'équipe à s'orienter dans une direction qui s’avérerait, en cours de sprint, ne pas être la plus adaptée.

-  **V - Valuable** (ayant de la valeur)
Sa valeur métier doit être clairement exposée. Une User Story dont la valeur ajoutée au produit n'est pas apparente (pour l'utilisateur, le client...) n'a pas lieu d'être et ne sera pas priorisée. C'est un des piliers de l'intêret de l'AGILE, si vous ne livrez pas de valeur, c'est une perte de temps et d'argent.

-  **E - Estimable** (estimable)
Elle doit pouvoir être suffisamment comprise pour être estimable par l’équipe de développement. Qu'importe que vous estimiez en t-shirt size, en story points ou pas du tout. Cette estimation n'a pas besoin d'être parfaite, elle doit juste pouvoir être relative. La story doit donc être claire et assez petite.

-  **S - Size approprietly** (suffisamment petite)
Une bonne story est une story de petite taille, ce qui bien entendu dépend totalement du contexte. Si une story prend une semaine à un développeur, c'est qu'elle peut potentiellement être découpée. Le but est d'avoir des Users Sories qui sont assez petites pour être embarquées et finalisées sur un seul et même sprint. Plus il y a de granularité dans le découpage, plus la story pourra être livrée rapidement et plus il sera facile de l'estimer et la tester. Pour ce point, je vous renvoie aux arguments que j'ai donnés en introduction.

- **T - Testable** (testable)
Une User Story doit être testable. C'est d'ailleurs parfois un bon point de départ pour écrire sa User Story car cela implique clairement un but. Une User Story qui ne peut pas être testée est souvent la conséquence d'un manque de clarté dans le scope, un manque de "maturité" dans le besoin du client ou simplement qu'elle n'apporte pas ou trop peu de valeur.

#### LE FORMAT USER VOICE
Une fois que l'on a bien en tête les principes des 3C et de INVEST (qui au final se recoupent pas mal), il est temps de passer à sa rédaction. Le format le plus courant (et celui avec lequel je suis le plus à l'aise) est celui que l'on nomme "user voice". L'idée est d'avoir une structure simple, qui restera cohérente entre toutes les Users Stories que vous écrirez, et dont le format va servir votre objectif : courte, avec du sens, orientée valeur, compréhensible par tous.

    En tant que...
    Je souhaite...
    Afin de...

Exemple : **En tant que** responsable logistique **je souhaite** pouvoir connaître la localisation d'un technicien, **afin de** planifier plus efficacement les tournées de dernière minute.

####  LE  CONCEPT DE MINIMUM MARKETABLE FEATURE (MMF)
C'est en soi déjà une sorte de découpage mais l'idée est que dans notre optique INVEST afin d'avoir une User Story assez "petite" nous allons nous concentrer sur le cœur de la feature, en écartant (ou en splittant) les éléments qui viendraient faire grossir le scope et la complexité (essentiels versus optionnels) d'une User Story, la rendant moins INVEST.

Exemple :
**En tant que** responsable logistique **je souhaite** pouvoir connaître en temps réel la localisation d'un technicien, **afin de** planifier plus efficacement les tournées de dernière minute.

Il n'est peut être pas nécessaire de rentrer dans ce niveau de détails dans un premier temps, nous pourrions tout à fait supprimer "en temps réel" et obtenir une User Story plus MMF, la partie "en temps réel" pouvant impliquer beaucoup de choses. Vous pouvez lire [cet article](https://blog.myagilepartner.fr/index.php/2018/06/17/travaillons-nos-fonctionnalites-avec-le-mmf/) pour aller plus loin.

#### JUSQU’OÙ DÉCOUPER ?
Tout est affaire de contexte. Certaines équipes aiment avoir beaucoup de granularité et découpent leurs Users Stories jusqu’à n'avoir que des éléments de 2 points par exemple, alors que d'autres seront plus à l'aise avec des User Stories assez importantes pour travailler quelques jours dessus.
Vous pouvez cependant définir avec l'équipe un seuil critique (en nombre de points par exemple si vous faites du poker planning en story points) à partir duquel doit être déclenché un découpage.
Gardez en tête que plus une User Story est petite (et est un produit livrable en l'état, avec une valeur métier) plus vous pourrez la livrer vite et donc bénéficier de feedbacks et d'amélioration continue.

J’insiste cependant vraiment sur le fait que "votre User Story doit être un élément livrable complet ayant de la valeur". En effet découper une feature en User Stories dépendantes les unes des autres est un piège dans lequel on peut tomber rapidement, et va à l'encontre de la méthode.

## LES PATTERNS "CLASSIQUES" DE SPLITTING

Tout d'abord je tiens à préciser que ces patterns ne sont pas de moi et proviennent de sources que vous retrouverez en bas de page. Je me suis cependant permis de les trier et d'y apporter ma vision et mes exemples.
Ceci étant dit, l’intérêt des patterns (ou stratégies) présentés ci-dessous est qu'ils vous évitent d'avoir des découpages purement "techniques" du type : IHM, traitement en base de données, règles métiers.
Bien que cela puisse être intéressant dans bien des cas, ce n'est pas AGILE. Si la User Story est trop grosse ou si vous n'arrivez pas à la terminer, qu'est-ce qui pourra réellement être présenté au métier ? L’équipe a-t-elle réellement travaillé sur ce qui avait le plus de valeur ? Est-ce livrable en l'état et testable par un utilisateur lambda ?
Vous trouverez donc ci-dessous des stratégies pour découper plus efficacement vos User Stories. Il est même recommandé d'en utiliser plusieurs.
Rappelez vous cependant que tout ne marche pas toujours car cela dépend du contexte, et j'insiste beaucoup sur ce point.

#### DÉCOUPAGE SELON LES ÉTAPES DU WORKFLOW
Pour une feature donnée, une utilisateur peut avoir besoin de passer par un workflow bien défini. C'est souvent le cas avec de l'upload de fichier pour mettre à jour une base de données. Nous aurions alors besoin d'uploader le fichier, de faire des tests sur ce fichier et sur les données qu'il contient, puis de les comparer avec l'attendu et d'afficher à l'utilisateur les erreurs potentielles et les succès.
La plus grosse valeur (un peu notre **MMF** finalement) vient du fait de pouvoir uploader le fichier et qu'il soit pris en compte par le système. Les étapes de workflow de vérification et de remontées de résultats sont des étapes certes importantes, mais que nous pourrions découper.
Nous arions donc :

    En tant que responsable produit je peux uploader un fichier afin de mettre à jour les informations des produits dans la base de données.

Qui nous donnerait :

    En tant que responsable produit je peux directement uploader un fichier afin de mettre à jour les informations produit.
    En tant que responsable produit je peux contrôler l'intégrité d'un fichier uploadé, afin de garantir l'intégrité de la base de données produit.
    En tant que responsable produit je peux contrôler la conformité des données d'un fichier uploadé, afin de garantir la qualité de la base de données produit.

#### DÉCOUPAGE SELON LES SCENARIOS
Dans le cas d'une fonctionnalité de taille importante il peut être assez facile de découper en différents scénarios, le plus simple étant souvent d'imaginer les différents cas de tests et d'en faire différentes User Stories. Ce pattern de découpage se recoupera aussi facilement avec d'autres patterns et vous mettrez plus facilement en lumière les scénarios qui apporteront de la valeur et dont le risque est élevé versus ceux dont le risque est moindre ou qui n'apportent pas de valeur.
Prenons l'exemple d'un Dispatcheur qui doit assigner des tournées à des techniciens, les cas de tests pourraient être : si le technicien est disponible, si le technicien n'est pas disponible (malade), si le technicien a déjà une journée complète...
Nous aurions donc :

    En tant que Dispatcheur je peux assigner des interventions à mes techniciens afin qu'ils réalisent des tournées.

Qui nous donnerait :

    En tant que Dispatcheur je peux assigner des interventions à un technicien disponible afin qu'il réalise une tournée.
    En tant que Dispatcheur je peux être alerté de la non disponibilité d'un technicien afin de ne pas lui assigner d'interventions.
    En tant que Dispatcheur je peux connaître la charge de travail d'un technicien afin qu'il ne soit pas en surcharge de travail.

#### DÉCOUPAGE SELON LES VARIATIONS SUR LES RÈGLES MÉTIER
Les règles métier sont dans beaucoup de cas des éléments difficiles à appréhender et à connaître dans leur ensemble, il vous faudra beaucoup de temps passé à échanger avec le métier, et d'analyse, pour en avoir une connaissance assez étendue.
Si l'on veut revenir au concept de **MMF**, on pourra aussi considérer que certaines règles métier ne sont pas à prendre en compte dans la première itération et que des "quick win" pourront être utilisées pour y pallier (un message d'explication en rouge, une information au hover, une action manuelle...).
Dans le cas d'une commande logistique nous aurions :

    En tant que Dispatcheur je peux planifier une intervention chez un client afin de répondre à une demande d'intervention.

Qui nous donnerait :

    En tant que Dispatcheur je peux directement planifier une intervention chez un client afin de répondre à une demande d'intervention.
    En tant que Responsable Logistique je peux bloquer une demande d'intervention qui n'aurait pas de technicien assigné afin de garantir la possibilité de réaliser l'intervention.
    En tant que Responsablble logistique je peux bloquer une demande d'intervention pour laquelle le matériel n'est pas en stock afin d'éviter les ruptures de stock.

#### DÉCOUPAGE SELON L'EFFORT MAJEUR
Dans certains cas, et parce que nous souhaitons développer des choses qui pourront être réutilisées, certaines Users Stories peuvent être découpées en sous-parties. Le plus gros du travail ira sur l'une d'entre elles (pour l'implémentation) et les autres seront des variations ou des évolutions. Attention cependant, il est difficile d'obtenir de vraies User Stories indépendantes, mais c'est une bonne stratégie de départ.
Prenons le cas d'un envoi d'e-mail automatique des informations de mise à jour d'un intervention chez un client. Nous devrions créer toute la partie d'envoi de mail pour le premier mail, mais le reste serait bien plus trivial. Nous aurions :

    En tant que Dispatcheur je veux que le client soit informé des mises à jour de l'intervention (ouverture, assignation, clôture) afin qu'il puisse faire avancer son workflow interne.

Qui nous donnerait :

    En tant que Dispatcheur je veux que le client soit informé de l'ouverture de l'intervention afin qu'il puisse faire avancer son workflow interne.
    En tant que Dispatcheur je veux que le client soit informé des mises à jour de l'intervention (assignation et clôture) afin qu'il puisse faire avancer son workflow interne.

#### DÉCOUPAGE SELON LE SIMPLE/COMPLEXE
Cette stratégie de découpe peut dans certains cas s'apparenter à celle de "l'effort majeur". Il s'agit ici de chercher à identifier les différents niveaux de complexité et à les décomposer en allant du plus simple (moins de critères d'acceptation, livraison rapide, feedbacks plus tôt) au plus complexe.
Si nous avions le cas de d'une planification de tournée d'un technicien, le scope peut être très large car il peut prendre en compte un affinage des résultats selon des critères choisis par l'utilisateur par exemple qui peut venir grandement complexifier la demande. Initialement nous aurions ceci :

    En tant que Responsable Logistique je peux programmer une tournée de x interventions afin de répondre au besoin des clients.

Ce qui nous donnerait :

    En tant que Responsable Logistique je peux directement programmer une tournée de x interventions sans contraintes afin de répondre au besoin des clients.
    En tant que Responsable Logistique je peux programmer une tournée de x interventions en spécifiant l'ordre d'intervention afin de répondre au besoin d'urgence des clients.
    En tant que Responsable Logistique je peux programmer une tournée de x interventions en spécifiant les horaires de chacune des interventions afin de répondre au SLA des contrats client.
    En tant que Responsable Logistique je peux programmer une tournée de x interventions en utilisant des dates flexibles afin d'apporter de la souplesse aux techniciens en cas de retard.

#### DÉCOUPAGE SELON LES VARIATIONS DANS LES DONNÉES
Une autre complexité peut aussi provenir de la variation du type de données en entrée ou en sortie, entendez par là : le type de données que la feature va devoir gérer.
L'idée est de découper la fonctionnalité par type de données, par exemple dans la recherche, afin d'avoir une idée plus claire sur la complexité (pour l'estimation) et aider le Product Owner à prioriser l'ensemble. Peut être que tous les critères et données ne sont pas utiles ? La recherche d'un élément par son nom est suffisante et nous n'aurions pas besoin dans un premier temps de faire une recherche par tranche de prix, ou alors peut être que les données en sorties n'ont pas besoin d'être représentées en graphique, un .csv pourrait suffire.
Si nous imaginons une fonctionnalité de recherche d'un produit dans le catalogue du client, nous aurions initialement :

    En tant qu'utilisateur je peux rechercher un produit dans le catalogue, afin d'en obtenir des informations.

Ce qui nous donnerait :

    En tant qu'utilisateur je peux rechercher un produit via son nom, afin d'obtenir directement des informations sur un produit que je connais
    En tant qu'utilisateur je peux rechercher un produit en specifiant sa catégorie, afin de trouver des produits dont je ne connais pas le nom.
    En tant qu'utilisateur je peux rechercher un produit par son emplacement géographique afin d'obtenir des résultats de recherche plus précis.

#### DÉCOUPAGE SELON LES MÉTHODES DE SAISIE DES DONNÉES OU PLATEFORMES
La complexité d'une User Story peut aussi provenir de la multitude de type de saisies possibles (liste déroulante, auto-complétion, calendrier cliquable...)  ou des différentes plateformes (mobile, desktop, tablettes...). Il peut donc être intéressant de découper la User Story en plusieurs d'après ces éléments afin de prioriser et peut-être même d'en retirer. Après tout, peut être que la consultation desktop de votre plateforme interne n'est pas une priorité sachant qu'aucun technicien en déplacement n'a accès à un ordinateur, ou peut-être que l'auto-complétion n'est pas utile car il n'existe que 10 éléments différents.
Dans le cas d'un formulaire de demande d'intervention nous aurions initialement :

    En tant que client je peux remplir le formulaire d'intervention afin de créer une demande d'intervention de technicien.

Ce qui nous donnerait :

    En tant que client je peux remplir le formulaire d'intervention depuis mon desktop afin de créer une demande d'intervention de technicien.
    En tant que client je peux remplir le formulaire d'intervention depuis mon smartphone afin de créer une demande d'intervention de technicien.
    En tant que client je peux remplir le formulaire d'intervention en sélectionnant une date via un date picker afin de créer une demande d'intervention de technicien plus rapidement.

#### DÉCOUPAGE SELON LA PERFORMANCE OU NIVEAU DE QUALITÉ
Le mieux est l’ennemi du bien. Une fonctionnalité peut être implémentée de nombreuses façons si on prend en ligne de compte l'optimisation :  en temps réel, en instantané et sans rechargement, en moins de 5 secondes, avec du remplissage automatique, un chargement en arrière plan...
Bien que ces éléments puissent apporter de la valeur (ou être différenciants, ou générer le fameux "effet wahou" dont on nous parle tout le temps) ils peuvent être soustraits à notre User Story principale, principale vecteur de valeur.
Attention à ne pas tomber dans le piège du code "quick and dirty" d'un côté, puis dans la ou les autres User Stories de faire du code "propre" pour tout rattraper. Le code doit toujours être propre, maintenable et testable. Ici il s'agira uniquement de disposer d'un niveau de qualité fonctionnel jugé minimum, puis d'améliorer l’expérience avec des optimisations fonctionnelles.
Dans le cas de la recherche d'un point de dépôt TNT pour un technicien nous aurions initialement :

    En tant que technicien je peux trouver le point de dépot TNT le plus proche d'une adresse saisie manuellement, afin de m'assurer d'avoir le trajet le plus court.

Ce qui donnerait :

    En tant que technicien je peux trouver le point de dépot TNT le plus proche de ma position, afin de m'assurer d'avoir le trajet le plus court.
    En tant que technicien je peux trouver le point de dépot TNT le plus proche de ma position en moins de 5 secondes, afin de m'assurer d'avoir le trajet le plus court.
    En tant que technicien je peux utiliser ma position GPS pour trouver un point de dépot TNT afin de m'assurer d'avoir le trajet le plus court.

#### DÉCOUPAGE SELON LE CRUD
CRUD est utilisé pour définir les actions "de base" que sont create, read, update ou delete que l'on retrouve très souvent derrière le terme "gérer" quand on parle de compte, de commande, d'items etc.
Il est donc très facile de décomposer une User Story sur cette base là. On peut s'interroger sur l’intérêt de ne pouvoir effectuer qu'une seule action alors que l'on a souvent besoin de toutes : tout dépend du contexte. Par exemple dans notre cas le métier a besoin de pouvoir créer des pack de produits sans passer par un ticket au support, mais n'a aucun besoin de modifier les existants ou de les supprimer car cela aurait des répercussions trop impactantes (dans un premier temps) sur les commandes en cours.
Nous aurions donc initialement :

    En tant que Logisticien, je peux gérer les packs de produits afin de gagner en autonomie et en réactivité sur mon métier.

Ce qui donnerait :

    En tant que Logisticien, je peux créer des packs de produits afin de gagner en autonomie et en réactivité sur mon métier.
    En tant que Logisticien, je peux modifier des packs de produits afin de gagner en autonomie sur mon métier.
    En tant que Logisticien, je peux modifier les packs de produits afin de gagner en autonomie sur mon métier.

## POUR ALLER PLUS LOIN

Évidemment, même en ayant bien les idées en tête on sait tous ô combien il peut être compliqué dans une situation réelle d'appliquer la théorie. Sachez qu'il existe des exercices pour faciliter cela, voire même des entraînements sous forme de workshops qui existent afin de monter en compétences. L'un des plus connus est un workshop d'un format de 2h qui se réalise avec une équipe et un facilitateur : L’Éléphant Carpaccio, son créateur n'est autre qu'Alistair Cockburn ! Il n'est plus disponible sur son site mais [des traductions existent](https://www.occitech.fr/blog/2014/05/decoupez-vos-stories-en-carpaccio/).
Pour quelque chose de plus simple et de plus opérationnel, il existe bien sûr d'autres exercices à réaliser avec l'équipe de développement, en voici un exemple.

#### LA MÉTHODE DU HAMBURGER
Mise au point par un autre nom connu de l'univers AGILE : [Gojko Adzic](https://twitter.com/gojkoadzic) il s'agit d'un exercice qui peut s'utiliser dans le cas ou l'équipe n'arriverait pas à découper correctement un ticket et où la dimension technique serait très forte. Bien que nous ayons discuté un peu plus haut du fait que le découpage technique n'est que rarement une option convenable, dans certains cas cela est inévitable. Une autre utilisation pourrait être d'utiliser cet exercice pour découper une story en sous-tâches fonctionelles (pas techniques, donc).
Le concept est simple : identifier des tâches > définir des options pour ces tâches > classer par niveau de "qualités" > estimer comparativement les options > définir un niveau de qualité minimal pour chaque tâche > sélectionner.
Un [article sur son blog explique la démarche en détail](https://gojko.net/2012/01/23/splitting-user-stories-the-hamburger-method/), aussi plutôt que de la reprendre ici je vous invite à le consulter.




## CONCLUSION

Il existe bien d'autres méthodes pour découper vos User Stories. Les premières questions auxquelles il sera le plus dur de répondre serront sûrement du type : "Quel pattern privilégier ?", "Est-elle bien écrite ?" ou encore " Est-elle assez découpée ?". Je n'ai aucune réponse toute faite sur le sujet mais partez du principe que :

 - c'est souvent la partie la plus petite et la plus simple qui apporte
   le plus de valeur, essayez donc de trouver la User Story la plus
   simple avec différentes stratégies si possible ;
 - essayez de disposer de User Stories de tailles homogènes (surtout
   si vous voulez partir sur du no-estimate, plus tard).
   - restez 3C, SMART et INVEST, sinon la qualité de vos démos et livraisons risquent d'en souffrir, et ce ne sera pas plaisant pour l'équipe ;
   - plus vos stories sont de qualité, plus vous gagnez de temps pour les Poker Plannings, Sprint Plannings avec les Stakeholders etc...

 Vous verrez qu'avec le temps vous allez avoir tendance (vous et votre équipe) à être plus à l'aise avec certaines stratégies que d'autres, et le contexte vous orientera rapidement vers certaines d'entre elles.
 N’hésitez pas à vous essayer aux ateliers dont je parle à la fin, ils peuvent être de bons exercices pour améliorer la capacité de l'équipe à découper les User Stories.
 Sachez aussi qu'il existe pas mal de jeux de cartes "splitting poker" sur internet. Ils peuvent aider pendant les rituels AGILE (je vous laisse trouver un lien, je n'en recommande aucun en particulier, tous se ressemblent).

Vous avez des techniques particulières ? Vous souhaitez modérer mes propos sur un point ? Je n'ai pas crédité ou cité une personne ? N’hésitez pas à entamer la discussion dans les commentaires pour faire évoluer l'article !


## RÉFÉRENCES

- https://www.qualitystreet.fr/2008/08/25/epic-user-stories/
- https://www.qualitystreet.fr/2011/03/24/10-strategies-pour-des-user-stories-suffisamment-petites/
- https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/
- https://medium.com/the-liberators/10-powerful-strategies-for-breaking-down-user-stories-in-scrum-with-cheatsheet-2cd9aae7d0eb
- https://blog.myagilepartner.fr/index.php/2017/01/27/comment-decouper-ses-user-story/
- https://www.occitech.fr/blog/2014/05/decoupez-vos-stories-en-carpaccio/
- https://gojko.net/2012/01/23/splitting-user-stories-the-hamburger-method/
- https://blog.xebia.fr/2015/12/22/pourquoi-decouper-vos-besoins-en-petites-user-stories/
- https://jp-lambert.me/%C3%A7a-veut-dire-quoi-ind%C3%A9pendant-dans-invest-41357f39509f

