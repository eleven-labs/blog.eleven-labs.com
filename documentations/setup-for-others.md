# Mise en place du blog pour les non techs

## 1. Rejoindre l'organisation Github

Accepter l’invitation à rejoindre l'organisation Eleven Labs envoyée par mail.

> **N.B.** : Cette invitation est envoyée dans la boîte mail liée à votre compte Github.

## 2. Créer sa fiche auteur

Une fois que vous avez accès à l'organisation Eleven Labs, rendez-vous **[ici](https://github.com/eleven-labs/blog.eleven-labs.com/tree/master/_authors)**. Cliquez sur **"Add file"**, puis séléctionnez **"Create New File"** dans le ménu déroulant. Complétez le champ `Name your file...` en écrivant la première lettre de votre prénom suivi de votre nom de famille suivi de **".md"**. Le nom du fichier doit donc ressembler à celui-ci : `pnom.md`.

Dans le corps du fichier, collez le template ci-dessous, préalablement complété avec vos informations :

```
---
contentType: author
username: votrepseudo
name: Nom Prénom
github: votrepseudogithub
linkedin: votrepseudolinkedin
twitter: votrepseudoytwitter
---

Quelques mots à propos de vous (optionnel)
```

> **N.B.** : Pour Linkedin et Twitter, renseignez uniquement votre nom d'utilisateur et non l'URL de votre profil.

Une fois cela fait, appuyez sur **"Commit changes"** en haut à droite de votre écran, écrivez `feat/add-author-pnom` dans le champ **Create a new branch for this commit and start a pull request**, puis cliquez sur **"Propose changes"**.

Sur la page suivante, écrivez **"Create author page pnom"** dans le champ **"Add a title"**, puis appuyez sur **"Create pull request"**.

Votre Pull request a été créée ! Vous pouvez l'annoncer sur le channel Slack [#blog](https://eleven-labs.slack.com/archives/C025L32JY).

Un astronaute se chargera de la relire et la validera si tout est bon. Si des choses sont à revoir, il reviendra vers vous.

## 3. Créer le fichier de son article

Rendez-vous maintenant sur cette [page](https://github.com/eleven-labs/blog.eleven-labs.com/tree/master/_articles).

Puis séléctionnez le dossier **"fr"** ou **"en"**, selon que vous souhaitiez rédiger votre article en français ou en anglais.

Une fois dans le dossier adéquat, cliquez en haut à droite sur le menu déroulant **"Add files"**, puis séléctionnez **"Create new file"**.

## 4. Nommer son fichier

Le nom du fichier de l'article doit respecter la nomenclature suivante `yyyy-mm-dd-titre-de-votre-article.md`. Saisissez ces informations dans le champ **"Name your file"**, en haut de votre écran.

## 5. Créer l'en-tête

Collez le template d'en-tête suivant au tout début du corps de votre article, puis complétez-le :

```
---
contentType: article
lang: fr ou en
date: 'yyyy-mm-dd'
slug: titre-de-votre-article
title: Titre de votre article
excerpt: Rédigez ici une courte phrase descriptive de votre article
categories:
  - Javascript ou PHP ou Agile ou Architecture
authors:
  - votre pseudo d'auteur
cover:
  alt: Description de l'image de couverture
  path: /imgs/articles/nom-du-dossier-de-votre-cover/cover.jpg
keywords:
  - symfony
  - développement web
---
```

## 6. Rédiger son article

Copiez le corps de vote article à la suite de l'en-tête, ou rédigez directement.

> **N.B.** : Notez que le format de votre article doit être en Markdown.

Vous pouvez retrouver [les règles de syntaxe de ce format par ici](https://docs.framasoft.org/fr/grav/markdown.html). Vous pouvez également ["transformer" votre texte en Markdown via cet outil](https://www.pastetomarkdown.com/).

## 7. Faire sa PR

Une fois ces étapes réalisées, cliquez sur le bouton **"Commit changes"** en haut à droite de votre écran. Renseignez le titre de votre commit dans le champ **"Commit message"** au format suivant : `add-titre-de-votre-article`.

Validez en appuyant sur le bouton **"Propose changes"**.

Sur la page suivante, écrivez de nouveau `add-titre-de-votre-article` dans le champ **"Add a title"**, puis appuyez sur **"Create pull request"**.

## 8. Rajouter une couverture

Allez dans le repértoire : [\_assets/articles](https://github.com/eleven-labs/blog.eleven-labs.com/tree/master/_assets/articles). Cliquez sur **"Add file"** en haut à droite de vote écran, puis cliquez ensuite sur **"Create New File"** dans le menu déroulant.

Dans le champ **"Name your file"**, saisissez le nom de votre dossier.

> **N.B.** : Ce nom doit être le même que celui de votre article au caractère près.

Une fois que ce nom est saisi, tapez sur **"/"**. Cela a pour effet de créer votre dossier. Tapez maintenant **"fichier"** en nom de fichier, puis appuyez sur "Commit changes" en haut à droite.Appuyez sur Propose changes.

Dans votre branche, retournez maintenant dans [blog.eleven-labs.com/\_assets](http://blog.eleven-labs.com/_assets)/[articles](https://github.com/eleven-labs/blog.eleven-labs.com/tree/master/_assets/articles).Vous devriez y retrouver votre dossier nouvellement créé.

Sélectionnez-le, puis en haut à droite, cliquez sur **"Add files"**, puis **"Upload files"**, puis selectionnez l'image de couverture que vous souhaitez mettre dans l'article.

> Pour plus de simplicité, nommez cette image au préalable **"cover"**. Elle doit être au format jpg.
>
> Pour maintenir une cohérence graphique, les images de couvertures doivent toutes être dans un style photoréaliste en lien avec votre article. N'utilisez donc pas d'images "artoon", de visuels 3D, de logos, etc.

Pour choisir cette image, vous avez plusieurs options :

- Rendez-vous dans [La Boîte à Outils de l'Astronaute](https://drive.google.com/drive/folders/1SLZRiqHSel3AWNSVbrblfg3ON_XwR5RU?usp=drive_link) pour accéder à une séléction d'images.

- Vous pouvez aussi utiliser des images libres de droits dans les librairies [AdobeStock](https://stock.adobe.com/fr/), [Pexels](https://www.pexels.com/fr-fr/), ou encore [Unsplash](https://unsplash.com/fr).

- Si aucune de ces solutions ne vous convient, vous pouvez demander à l'astronaute Thomas Péjout to generate an image for you with MidJourney


> **N.B.** : Assurez-vous que l'image séléctionnée dispose d'une largeur minimale de 3000px.
