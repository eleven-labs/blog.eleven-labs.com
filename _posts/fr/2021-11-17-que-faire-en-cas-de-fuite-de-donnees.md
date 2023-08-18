---
lang: fr
date: '2021-11-17'
slug: que-faire-en-cas-de-fuite-de-donnees
title: Que faire en cas de fuite de données ?
excerpt: >-
  Les récentes fuites de données chez Twitch et Facebook rappellent aux
  entreprises qu'elles sont vulnérables, et qu'elles ont des obligations envers
  les utilisateurs. Si ça vous arrivait aussi, sauriez-vous quoi faire ?
cover: /assets/2021-11-17-que-faire-en-cas-de-fuite-de-donnees/dataleak.png
authors:
  - marianne
categories: []
keywords:
  - bonnes pratiques
---

Après la fuite de données de Twitch en octobre 2021, on se rappelle de [la fuite chez Facebook de 533 millions d’utilisateurs qui est sortie en avril 2021](https://www.francetvinfo.fr/internet/reseaux-sociaux/facebook/facebook-cinq-questions-sur-la-fuite-de-donnees-de-533-millions-d-utilisateurs-a-travers-le-monde_4362885.html) et d’autres encore qui ont valu à [Mark Zuckerberg d’être entendu au Capitol américain en 2018](https://www.forbes.fr/business/facebook-mark-zuckerberg-au-capitol/). En bref on est tous dans la vie privée comme dans notre entreprise exposés à ce risque, notamment lorsque des hackers accèdent frauduleusement à un système de données.

Mais la violation de données n’inclut pas uniquement la fuite. D’après l’article 4.12 du RGPD, la violation de données se définit comme :

> une violation de la sécurité entraînant, de manière accidentelle ou
> illicite, la destruction, la perte, l'altération, la divulgation non
> autorisée de données à caractère personnel transmises, conservées ou
> traitées d'une autre manière, ou l'accès non autorisé à de telles
> données.

Cela peut être la perte d’une clé USB ayant une copie de la base de données autant qu'une intrusion frauduleuse dans le système de données.

![Mais enfin Jérome, ça dépasserait l'entendement !]({{ site.baseurl }}/assets/2021-11-17-que-faire-en-cas-de-fuite-de-donnees/dataleak.png?width=300)

## Comment les données peuvent-elles fuiter ?
Les gros cas de fuites nous permettent de faire une liste plutôt exhaustive :
-   exploitation d’une faille (Facebook)
-   personne en interne mal-intentionnée qui récupère les données (exemple de Twitch)
-   récupération d’accès en hackant des employés (par exemple fishing et cheval de troie chez TV5 MONDE)
-   négligence, de type laisser un post-it avec un mot de passe lors d’une interview télévisée (toujours chez [TV5 MONDE](https://tvmag.lefigaro.fr/le-scan-tele/insolite/2015/04/10/28009-20150410ARTFIG00214-les-mots-de-passe-de-tv5-monde-devoiles-sur-france-2.php))

Dans la majorité des cas, quand les données se retrouvent sur internet/darkweb, c’est un acte de malveillance.

## Obligations légales
En possédant des données personnelles de clients, vous êtes responsable de leur sécurité.
Quand vous êtes au courant d’une fuite de données, voici ce que dit le droit français via la CNIL et le droit européen avec la RGPD :
-   Inscrire l’incident dans le registre des violations des données :
> Le registre des violations devrait notamment contenir les éléments
> suivants :
> -   la nature de la violation
> -   les catégories et le nombre approximatif des personnes concernées
> -   les catégories et le nombre approximatif de fichiers concernés
> -   les conséquences probables de la violation
> -   les mesures prises pour remédier à la violation et, le cas échéant, pour limiter les conséquences négatives de la violation
> -   le cas échéant, la justification de l’absence de notification auprès de la CNIL ou d’information aux personnes concernées.
-   Vous devrez donc faire [une déclaration auprès de la CNIL](https://notifications.cnil.fr/notifications/index) dans les 72h, et vous pouvez la compléter au fur et à mesure : pas la peine d’attendre d'avoir plus d’information pour la faire.
-   S’il s’agit d’une cyberattaque, vous devez aussi déposer plainte auprès de la gendarmerie ou du commissariat de police.
-   En fonction de votre secteur (centres de santé, services de paiement, etc…), il faut prévenir [d’autres acteurs](https://rgpd-brest.fr/vol-de-donneesl/).
-   En cas d’incident à risque élevé, il faut prévenir les personnes concernées dans les meilleurs délais.

Vous pouvez aussi faire en interne un manuel d’intervention en cas d’incident : cela vous permettra d’être plus efficace lors de la prise en charge et de moins jouer les pompiers.

![Mais enfin Jérome, ça dépasserait l'entendement !]({{ site.baseurl }}/assets/2021-11-17-que-faire-en-cas-de-fuite-de-donnees/law_legal_terms.png?width=300)

### Comment créer un manuel d’intervention ?

#### 1 - Avoir une équipe d’intervention

Cette équipe doit être constituée des différents acteurs devant intervenir lors d’un incident, chacun avec un rôle défini et un périmètre d’action clair. Le délégué à la protection des données (DPO) nommé doit en être membre pour plus de praticité.

#### 2 - Identifier des données sensibles

Toutes les données ne sont pas sujettes au même plan d’action. Par exemple, si ce sont les données produits sans informations personnelles qui fuient, il n’y a pas de déclaration à faire à la CNIL, mais il faut vérifier la faille et si d’autres données n’ont pas fuité. Si c’est l’ensemble de votre base utilisateurs, c’est un degré plus sérieux. Vous pouvez faire un tableau regroupant l’ensemble des données et leur niveau d’importance.

#### 3 - Créer des plans d’actions

Le premier plan doit démarrer dès que vous êtes au courant d’une fuite de données, qui consiste à enquêter.
Les membres de l’équipe d’intervention vont chacun jouer leur rôle : identification des données, source de la fuite, etc.
À partir de ces premières informations, vous allez pouvoir donner un niveau d’importance et donc avoir un plan spécifique, même si globalement, cela sera : corriger et prévenir (si besoin).

## Marche à suivre concernant les utilisateurs

Comme le demande la CNIL, vous devez prévenir les utilisateurs qui ont subi cette violation de données. Le plus simple est une notification par email qui doit contenir :
-   la nature de la violation (hack, problème de sécurité, etc.) - ⚠️*obligatoire*
-   les conséquences probables de la violation - ⚠️*obligatoire*
-   les coordonnées de la personne à contacter (DPO ou autre) - ⚠️*obligatoire*
-   les mesures prises par l’entreprise pour pallier l’incident, pour éviter les conséquences négatives - ⚠️*obligatoire*
-   la liste de recommandations pour éviter les effets négatifs : changer le mot de passe, vérifier les données ou actions sur le compte
-   si vos utilisateurs ont eux-mêmes des clients (un CRM utilisé par des entreprises par exemple) : les inciter à les prévenir avec les informations que vous leur fournissez

## Le California Consumer Privacy Act

Il n’y a pas qu’en France et en Europe que les données personnelles sont protégées par des lois. En 2018, la Californie a mis en place sa propre RGPD même si elle est moins protectrice que notre version.
Si vous avez une partie de votre business en Californie et/ou avez des données de résidents californiens et qu’elles ont fuité, il faut aussi [prévenir les institutions](https://oag.ca.gov/privacy/databreach/reporting) : cela peut faire doublon, mais il n’y a pas de supra-plateforme pour gérer l’ensemble des organismes de contrôle des données utilisateurs.

## Pourquoi faut-il le faire ?

Avec les dernières réglementations, les fuites de données ne peuvent plus passer inaperçues : les états et organisations veillent et peuvent mettre des amendes allant jusqu'à 4% du chiffres d'affaires annuel si cela est caché ou n'est pas fait en temps et en heure ([Booking avec 475.000€](https://www.capital.fr/entreprises-marches/booking-ecope-dune-lourde-amende-pour-une-fuite-de-donnees-1399050), une enquête est en cours pour [Facebook qui encourt jusqu'à 3,5 milliards de dollars](https://www.latribune.fr/technos-medias/internet/fuite-de-donnees-sur-facebook-negligence-des-utilisateurs-ou-faute-du-reseau-social-882469.html)).

Pour les entreprises, il faut avoir en tête que cela renforce la réputation envers les utilisateurs : elles sont réactives, transparentes et prennent au sérieux la réglementation.

### Sources
- [CNIL : les violations des données personnelles](https://www.cnil.fr/fr/les-violations-de-donnees-personnelles)
- [CNIL : notifier une violation de données personnelles](https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles)
- [Déclarer un vol / fuite de données à la CNIL](https://rgpd-brest.fr/vol-de-donneesl/)
- [OneTrust : Comment votre organisation peut-elle bénéficier d'un manuel de gestion des incidents ?](https://www.onetrust.fr/blog/creer-un-manuel-de-gestion-des-incidents/)
- [Netwrix Blog : Comment prévenir les violations de données](https://blog.netwrix.fr/2020/02/25/comment-prevenir-les-violations-de-donnees/)
- [Africa Cybersecurity : Quel plan d'intervention en cas d'atteinte à la protection des données ? 4 éléments clés indispensables.](https://cybersecuritymag.africa/quel-plan-dintervention-en-cas-datteinte-la-protection-des-donnees)
