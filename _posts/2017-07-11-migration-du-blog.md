---
layout: post
title: Migration du blog
authors:
    - captainjojo
    - VEBERArnaud
excerpt: "Depuis 2013, les astronautes d'Eleven-labs partagent leurs connaissances techniques avec plaisir. Notre blog est devenu un élément indissociable de notre effort vers l'open-source. Pour aller plus loin dans cette démarche nous avons donc décidé de changer radicalement de technologie. Mais pourquoi ? Comment ? Quelle est la suite ?"
permalink: /fr/migration-du-blog/
---

Depuis 2013, les astronautes d'Eleven-labs partagent leurs connaissances techniques avec plaisir. Notre blog est devenu un élément indissociable de notre effort vers l'open-source. Pour aller plus loin dans cette démarche nous avons donc décidé de changer radicalement de technologie. Mais pourquoi ? Comment ? Quelle est la suite ?

### Pourquoi ?

Les astronautes d'Eleven-labs ont publié en 4 ans plus de 130 articles, avec une moyennne de 9000 vues par mois, le blog est devenu un lieu de partage technique suivi par la communauté. Créé en 2013, nous avions choisi Wordpress pour sa rapidité d'installation et son expertise dans la mise en place de blogs.

Après 3 ans, le site a vieilli et ne représente plus l'esprit d'Eleven-labs. Du point de vue de nos utilisateurs, nous voulions apporter un confort de lecture sur l'ensemble de leurs appareils (mobile, tablette, desktop). Le nouveau site est donc épuré et met en avant l'essentiel : **les articles**.

Une des fonctionnalités qui manquait le plus sur notre blog, c'était la **recherche** que nous avons ajoutée facilement grâce à [Algolia](https://www.algolia.com/)

Nous voulions aussi encore plus partager avec la communauté : il est maintenant possible de s'inscrire à notre newsletter et de suivre l'actualité d'Eleven-labs.

Mais le changement n'est pas qu'esthétique, nos astronautes souhaitaient plus de liberté dans l'écriture de leurs articles et même réfléchir à de nouvelles façons d'afficher du contenu (ça arrive, mais chut !!!). Wordpress ne permettait pas de réaliser cette ambition.

C'est donc après une grande réflexion que nous avons pris **THE** décision.

> Migrer notre blog en JEKYLL sur GitHub Pages

L'utilisation de GitHub va nous permettre de garder un workflow de publication bien connu par les développeurs.
Jekyll, quant à lui, nous permet de personnaliser le site et de rendre le blog plus lisible pour nos utilisateurs.

Qu'avons nous fait techniquement ?

### Techniquement

Pour commencer, nous avons initalisé le repo github en forkant le projet [Type Theme](https://github.com/rohanchandra/type-theme). 
Celà nous a permis d'avoir une base de travail avec un jekyll pré-configuré et un visuel épuré proche de notre objectif de lisibilité.

Afin de servir le blog via la plateforme Github Pages, nous n'avons eu qu'à renommer le projet en `eleven-labs.github.io` (convention de nommage Github Pages pour les organisations) et activer Github Pages sur le repo. 
La magie github faisant le reste, nous avions les prémices du nouveau blog servi en https sur le domaine github.io en quelques minutes.

La reprise des articles du wordpress s'est faite grâce au package [jekyll-import](http://import.jekyllrb.com/docs/wordpress/), qui se connecte directement à la base de donées du wordpress pour en extraire les posts et autres meta-données nécessaires au bon fonctionnement du blog.
Ces posts au format html wysiwyg wordpress ont dans un premier temps été placés dans un dossier `_drafts` permettant des les afficher en local (grace au flag `--drafts`) sans les builder lors du déploiement.
Cette étape de transition a permis de temporiser la migration sans bloquer le reste des développements, sur le SEO et le design par exemple.

La migration ne fut pas compliquée. Chaque astronaute a eu pour mission de migrer ses articles en les passant de HTML vers Markdown. Certains astronautes s'étant mis au défi de scripter cette transformation, nous avions quelques scripts permettant une simplification de la transformation pour les articles complexes et une transformation totale pour les articles simples.

### Maintenant

Eleven-labs souhaitant faire vivre le blog comme un projet open-source, il est possible à tous nos utilisateurs de proposer des nouvelles fonctionnalités simplement en suivant le [contributing](https://github.com/eleven-labs/eleven-labs.github.io/blob/master/.github/CONTRIBUTING.md) du projet public. Chaque issue sera alors ajoutée dans nos sprints projet et sera réalisée pour améliorer en continu notre blog.

Comme notre projet est public, vous pouvez aussi directement développer des nouvelles fonctionnalités et les proposer à nos astronautes, il vous suffit de suivre le [contributing](https://github.com/eleven-labs/eleven-labs.github.io/blob/master/.github/CONTRIBUTING.md) et de proposer une pull request.

Comme nous savons que les astronautes d'Eleven-labs ne sont pas les seuls à vouloir partager leurs connaissances, il vous est aussi possible de proposer des articles et d'être publié sur le blog, suivez le [README](https://github.com/eleven-labs/eleven-labs.github.io).

Bien d'autres choses sont en préparation par notre équipe d'astronautes, en attendant merci d'être des lecteurs fidèles de notre blog, et continuez à partager la connaissance !
