---
layout: post
title: "Retour sur la mission spatiale au devfest Nantes"
excerpt: "Retour sur la mission spatiale au devfest Nantes"
authors:
    - marishka
    - tthuon
    - cogren
permalink: /fr/retour-devfest-nantes/
categories:
    - Conférence
tags:
    - Conférence
    - devfest
    - nantes
cover: /assets/2018-11-14-retour-devfest-nantes/cover.jpg
---

## Le devfest en quelques mots  

Le DevFest est un évènement sur deux jours qui réunit toute la communauté de développeurs autour de conférences orientées sur le web et le cloud computing. Les sujets sont variés. Cela passe par du Web, Mobile et par toutes les technologies back avec du Cloud, Big Data, Machine Learning, DevOps, et enfin des sujets plus ouverts à la découverte.

Chaque année un nouveau thème est choisi. Cette année c'était le thème de l'espace. C'est donc tout naturellement que la fusée Eleven Labs et les astronautes nantais ont assisté au DevFest.

## L'équipe  

Trois astonautes étaient présents : Marie, Thierry et Carl. Chacun a pu assister à différents talks, selon leur intérêt pour les sujets présentés. Voici leurs retours !

### Hacker les catastrophes naturelles par Gaël Musquet  

La Cybersécurité est souvent associée aux failles et attaques, à la confidentialité, et à la disponibilité des infrastructures. Mais les catastrophes naturelles restent négligées comme risques majeurs dans nos métiers.  

Cette conférence, qui était orientée sur la sécurité et l'alerte aux populations m'a beaucoup intéressé puisque qu'elle parlait de scénarios catastrophe qui pourraient arriver n'importe quand. Le problème est que nous ne sommes pas préparés, ni même informés.  

Cela m'a permis de découvrir le monde de la radio amateure et des moyens simples pour commencer à expérimenter. Par exemple, avec un récepteur TNT en USB il est possible d'écouter les avions, d'intercepter des messages en clair, etc.. C'est donc bien du hacking au sens premier et non celui qui est médiatisé. Un autre exemple de hack, c'est l'ajout d'un récepteur FM pour diffuser une alerte dans les détecteurs d'incendie.

Cette conférence, bien que non axée sur le web, était intéressante et permet d'ouvrir ses connaissances sur d'autres domaines.

### Git Dammit par Maxime Chignet

Git est l'outil de versionning le plus utilisé dans le monde. Mais bien souvent, il est utilisé de manière basique sans une vraie compréhension de son fonctionnement interne. Et dès qu'une personne est "experte", elle est très souvent solicitée pour répondre à des questions récurrentes.

La conférence m'a beaucoup intéressé car elle n'a pas fait qu'une liste de commandes git. Elle a fait la démonstration d'un projet fictif très proche du réel. Il y a eu des explications et des schémas simples et faciles à comprendre.

{% raw %}
<blockquote class="twitter-tweet" data-lang="fr"><p lang="fr" dir="ltr">Excellent talk Git Dammit, quelques bonnes commandes pour un repo propre. <a href="https://twitter.com/hashtag/DevFestNantes?src=hash&amp;ref_src=twsrc%5Etfw">#DevFestNantes</a> <a href="https://t.co/Etsf7kTFFT">pic.twitter.com/Etsf7kTFFT</a></p>&mdash; Anthony Manach (@tonicfx) <a href="https://twitter.com/tonicfx/status/1053196563907010561?ref_src=twsrc%5Etfw">19 octobre 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

Voici quelques commandes et concepts que j'ai appris :
 
Fix du commit A au milieu de la branche
- `git commit --fixup A` crée un commit de fixup
- `git rebase -i A~ --autosquash` git rebase avec le commit de fixup

Supprimer un commit
- `git reset head~ --soft` = bouge le HEAD sur le commit précédent
- `git reset head~ --mixed` = bouge le HEAD et l'index sur le commit précédent
- `git reset head~ --hard` = bouge le HEAD et l'index et le working directory sur le commit précédent

Branche de tracking = miroir de la branche sur le repo distant en mode read only.

Faire un rebase à partir d'un commit sur la branche master
- `git rebase ${SHA1}~ --onto master`

Faire un cherry-pick sans commiter
- `git cherry-pick -n`

Ajouter les modifications dans plusieurs commits
- `git add -p`

Les slides de la conférence sont sur [Github: Git dammit talk](https://mghignet.github.io/git-dammit-talk/)


## Les nouveautés "serverless" de Google Cloud par Guillaume Laforge

Guillaume Laforge, developer advocate chez Google, nous a parlé de Google Cloud et notamment de l'offre Serverless de Google.

L'avantage du serverless c'est que l'on ne s'occupe pas des serveurs. Notre provider Cloud s'en charge pour nous, et nous pouvons nous concentrer sur le développement de notre application en elle même. C'est aussi avantageux au niveau des coûts et de la scalabilité des serveurs. Google nous propose 2 options :
- App Engine, destiné plutôt aux application backend, qui sont accessibles via un navigateur, depuis un téléphone portable ou via des APIs REST - tout ce qui répond à une requête, en somme.
- Cloud functions, plateforme qui sert à exécuter des "fonctions" lorsqu'un évènement se produit.

La présentation est concentrée sur les nouveautés de ces 2 offres, avec une application que l'on a pu tester en live.

Retrouvez la présentation [ici](https://www.youtube.com/watch?v=wk2uOJmzNVY) et les slides [ici](https://speakerdeck.com/glaforge/whats-new-in-serverless-on-google-cloud-platform).

## Highway to Elm! par Jordane Grenat

Cette présentation (https://twitter.com/JoGrenat) nous a donné envie de tester ELM. Vous imaginez ? Finies les exceptions runtime, les problèmes de compatibilité entre navigateurs, etc. !

Le speaker commence par nous raconter son histoire sur le JavaScript, pour expliquer comment le language a évolué. Et il dit qu'ELM réunit tous les avantages du JS moderne. ELM est un language fonctionnel qui complile le code en JavaScript. Jordane fait ensuite une démo d'une application simple 'Pile ou Face', développée sous nous yeux. Et c'est très réussi.

Nous vous invitons à regarder la vidéo de cette présentation : https://www.youtube.com/watch?v=pjeXbKXSiVs.

## Conclusion

C'est toujours un plaisir pour les astronautes d'aller à la rencontre de leurs collègues !
Cela nous a permis d'apprendre de nouvelles choses et d'ouvrir d'autres horizons, et ce dans un cadre détendu et accueillant.
La mission spaciale est accomplie !

La fusée Eleven-Labs a également posé son camp de base à cet évènement.

{% raw %}
<blockquote class="twitter-tweet" data-lang="fr"><p lang="fr" dir="ltr"><a href="https://twitter.com/hashtag/EXPEDITION?src=hash&amp;ref_src=twsrc%5Etfw">#EXPEDITION</a> 🚀<br>Les portes sont ouvertes : Nos astronautes sont à bord du <a href="https://twitter.com/hashtag/DevFestNantes?src=hash&amp;ref_src=twsrc%5Etfw">#DevFestNantes</a> ! Nous sommes prêts pour 2 journées de conférences, rencontres &amp; échanges.<a href="https://twitter.com/hashtag/Cloud?src=hash&amp;ref_src=twsrc%5Etfw">#Cloud</a> <a href="https://twitter.com/hashtag/DevOps?src=hash&amp;ref_src=twsrc%5Etfw">#DevOps</a> <a href="https://twitter.com/hashtag/Web?src=hash&amp;ref_src=twsrc%5Etfw">#Web</a> <a href="https://twitter.com/hashtag/Mobile?src=hash&amp;ref_src=twsrc%5Etfw">#Mobile</a> <a href="https://twitter.com/hashtag/BigData?src=hash&amp;ref_src=twsrc%5Etfw">#BigData</a> <a href="https://t.co/RiQ6mIAapR">pic.twitter.com/RiQ6mIAapR</a></p>&mdash; Eleven Labs (@Eleven_Labs) <a href="https://twitter.com/Eleven_Labs/status/1052834386259955712?ref_src=twsrc%5Etfw">18 octobre 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

Vous pouvez retrouver toutes les conférences en vidéo sur [Playlist Youtube DevFest Nantes](https://www.youtube.com/playlist?list=PLuZ_sYdawLiXyaSnyRinPKvPXQIsNaJFz).
