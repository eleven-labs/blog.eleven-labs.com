---
layout: post
title: Retour sur la Google Cloud Summit 2017
lang: fr
permalink: /fr/google-cloud-summit-2017/
excerpt: "Jeudi 19 octobre 2017 a eu lieu à Paris au Palais des Congrès, le Google Cloud Summit 2017. Google venait à Paris pour exposer toutes les nouveautés de leur Cloud, les nouvelles API de Machine Learning et les nouveaux outils de collaboration. Bien sûr Eleven était présent et nous avons pu suivre la plupart des conférences."
authors:
    - captainjojo
categories:
    - google
    - conference
tags:
    - cloud
cover: /assets/2017-10-20-google-cloud-summit-2017/cover.png
---

Jeudi 19 octobre 2017 a eu lieu à Paris au Palais des Congrès, le Google Cloud Summit 2017. Google venait à Paris pour exposer toutes les nouveautés de leur Cloud, les nouvelles API de Machine Learning et les nouveaux outils de collaboration. Bien sûr Eleven était présent et nous avons pu suivre la plupart des conférences.
<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="921026062200516608"></amp-twitter>

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920912205700325377"></amp-twitter>

### La plenière

Sebastien Marotte ouvre le bal, en expliquant que même si le cloud Google n'est pas le leader du marché, il devient de plus en plus fort et continue à avancer vers le futur.
<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920928469084770305"></amp-twitter>

C'est d'ailleurs en s'inspirant d'un citation de Larry Page que Sébastien Marotte commence à nous exposer les bases du Cloud Google.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="921003932381532162"></amp-twitter>

Puis laissons place à Ulku Rowe.

![Ulku Rowe](/assets/2017-10-20-google-cloud-summit-2017/ulku.jpg)

Qui va nous présenter pourquoi le cloud Google est le meilleur.  Elle commence par nous montrer ce que doit être le futur des sociétés.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920918792628301825"></amp-twitter>

Ulku Rowe insistera longuement sur la sécurité des services Cloud, sur leurs performances, sur la collaboration et sur les liens avec les partenaires.

C'est alors que plusieurs intervenants sont venu faire des démonstrations des outils Google. D'abord le partage, avec en tâche de fond -comme dans l'ensemble des conférences- la Data. Une démonstration sur l'utilisation de l'outil **Explorer**  de Google Sheet. Explorer devient *malin* et peut créer seul des query compliquées.

Puis, on y reviendra plus tard, une présentation de la Cloud Vision API, assez impressionnantes car permettant de reconnaitre instantanément les visages.

La conférence continuera avec un chiffre effrayant.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920930721300189184"></amp-twitter>

On passe tous beaucoup trop de temps à faire de la maintenance et non dans les insights pour nos clients. C'est pour cela que le Cloud Google est parfait, car il n' y a pas besoin de faire maintenance, Google le fait pour vous, et vous pouvez passer votre temps de travail à trouver les insights pour vos clients. Mais Google ne s'arrête pas là, l'avenir est pour eux la Data, et comment comprendre celle-ci est l'avenir. C'est pour cela que Google met en place énormément d'outils pour aider les sociétés à comprendre la données qu'ils ont à disposition.

La plénière se terminera par plusieurs exemples clients, sur comment travailler avec la Data et comment Google a aidé à l'utiliser et la comprendre.

D'abord Dailymotion

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920935649271861248"></amp-twitter>

Puis La Redoute avec la blague de la Google Summit.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920938851270610944"></amp-twitter>


### Introduction au Big Data : outils et insights

Première conférence et premiers défis : comment récupérer, stocker et comprendre l'ensemble des données. Pour commencer Google nous présente deux outils de visualisation, DataLab et DataStudio.

![DataLab](/assets/2017-10-20-google-cloud-summit-2017/image5.jpg)
![DataStudio](/assets/2017-10-20-google-cloud-summit-2017/image6.jpg)

Datalab est un outil orienté développeur qui permet de suivre les données que vous ingérez dans votre Cloud Google.

Quantà DataStudio, il s'agit d'un outil pour l'analyse des données calculées. Il est gratuit et peut se pluguer avec de nombreuses bases de données. Il vous permet de créer des dashboards pour vos équipes marketing, analystes, etc...

La conférence continue avec l'exemple client de Dailymotion et SFEIR qui ont travaillé ensemble pour mettre en place le système de recommandation de Dailymotion.

Ce qu'il faut retenir c'est qu'une stack compliquée il y a quelques années devient simple aujourd'hui avec Google.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920952785314766849"></amp-twitter>

La suite fut les étapes de la conception du système de recommandation, tout d'abord en faisant un ETL permettant de prendre l'ensemble des données necessaires au système.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920954099545321472"></amp-twitter>

![Architecture](/assets/2017-10-20-google-cloud-summit-2017/image7.jpg)

Puis de créer une architecture permettant avec du machine learning de faire ce fameux système.

Le plus de la conférence est de voir que le système qui il y a quelque années aurait été impossible, est aujourd'hui simple à mettre en place via les technologies Google. En moins de 3 mois, Dailymotion a réussi avec SFEIR à mettre en place un système de recommendation en temps réel.

### Cloud Functions: serverless avec Google Cloud Platform

Guillaume Laforge est venu nous parler de Google Functions. Google Functions est une des technologies serverless de google.

Il commence par un petit historique desdites technologies.

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920963257665511424"></amp-twitter>

Puis il rentre dans le concret avec des exemples. D'ailleurs toute la journée les speakers utiliseront les functions pour faire leurs démos.

Les Google Functions sont des petits codes javascript qui sont lancés lors d'un évènement, soit HTTP (un appel), soit un évènement du cloud Google, comme un ajout de fichier dans un cloud Storage.

Guillaume Laforge s'attardera sur 3 exemples :

 - utiliser ImageMagick pour faire un thumb d'une image uploadée dans le cloud
 - utiliser la vision API pour trouver les tags d'une image uploadée dans le cloud
 - créer un bot pour Google Home

La chose importante à retenir ici, c'est que Google a pensé à tout et a créer un emulator pour vous permettre de développer facilement.

![Local](/assets/2017-10-20-google-cloud-summit-2017/image8.jpg)

### Introduction au Machine Learning

Une conférence fascinante sur comment fonctionne le machine learning.

Google depuis plusieurs années utilise le machine learning dans l'ensemble de ses projets. Google a même utilisé le machine learning pour réduire de 40% la puissance énergétique de ses DataCenters.

Le machine learning en 3 images c'est...

<amp-twitter class="align-left" width="375" height="472" layout="responsive" data-tweetid="920986647273066503"></amp-twitter>

Google a même créé ses propres Processeurs et TPU pour augmenter les performances dans les DataCenters, pour faire du machine learning.

La conférence prouve que le machine learning est essentiel pour l'avenir de nos entreprises, la question qu'il faut se poser est

> Quelles données en notre possession devons-nous tagger ?

**C'est là qu'il faut faire du machine learning.**

La conférence se termine par l'intervention de [Deeptomatic](https://www.deepomatic.com/){:rel="nofollow noreferrer"} qui permet à tout le monde de faire du machine learning simplement gràce à une interface claire et simple. Avec derrière, encore une fois, la puissance du Cloud Google qui permet de réaliser des choses avec une simplicité déconcertante.

### Les APIs de Machine Learning par l'exemple

Pour moi la conférence avec le plus de code (enfin). L'idée est de montrer la puissance des APIs de Google.

Nous aurons droit à la démonstration des 5 APIs de machine learning de Google.

#### API CLOUD TRANSLATION

Api très connue de Google, elle permet de traduire des textes en de nombreuses langues.

Vous trouverez des exemples [ici](https://cloud.google.com/translate/){:rel="nofollow noreferrer"}.

Aujourd'hui, l'API est encore plus pertinente car Google utilise du machine learning pour améliorer ses traductions.

#### API CLOUD NATURAL LANGUAGE

C'est l'API utilisée dans DataDialog qui permet aujourd'hui d'avoir des Google Homes capable de comprendre ce que l'on dit.

Aujourd'hui l'API permet de définir dans des phrases, l'utilité de chaque mot et de comprendre à quoi ce dernier sert. Vous pouvez aussi connaître la catégorie de la conversation, les sentiments de la phrase et de chaque mot. Et pour finir elle vous donne la syntaxe de la phrase.

Vous trouverez des exemples [ici](https://cloud.google.com/natural-language/){:rel="nofollow noreferrer"}.

![Syntax](/assets/2017-10-20-google-cloud-summit-2017/image0.png)

#### API CLOUD SPEECH

Comme l'API cloud natural language, elle est utilisée dans Google Home pour transformer l'audio en texte et permettre ensuite d'être analysé.

Vous trouverez des exemples [ici](https://cloud.google.com/speech/){:rel="nofollow noreferrer"}

#### API CLOUD VISION

L'API permet de reconnaître ce qu'il y a sur des images. On peut l'utiliser de 3 manières différentes.

La première, c'est de tagger ce qu'il y a sur l'image :

![Labels](/assets/2017-10-20-google-cloud-summit-2017/image1.png)

La seconde permet de reconnaître des visages et de connaître le sentiment des personnes :

![Visage](/assets/2017-10-20-google-cloud-summit-2017/image2.png)

La dernière permet de reconnaître des caractères et grâce à l'API de natural language d'identifier ce qu'il se dit :

![Mot](/assets/2017-10-20-google-cloud-summit-2017/image3.png)

L'API est vraiment impressionnante et demande à être prise en main.

Vous pouvez vous amuser [ici](https://cloud.google.com/vision/){:rel="nofollow noreferrer"}.

#### CLOUD VIDEO INTELLIGENCE

Maintenant que Google sait faire tellement de choses avec les images, il s'attaque à la video.

Cette API permet de tagger chaque partie de la video en prenant ce qui se passe dedans et même de suivre des visages dans une vidéo.

Cette API est en bêta mais vous pouvez trouvez les exemples [ici](https://cloud.google.com/video-intelligence/){:rel="nofollow noreferrer"}.

![Labels](/assets/2017-10-20-google-cloud-summit-2017/image4.png)

### Conclusion

Google prouve encore sa persistance dans l'innovation, et sa volonté d'offrir à ses utilisateurs de nombreuses fonctionnalités qui étaient hier encore perçue comme relevant de la science fiction.
