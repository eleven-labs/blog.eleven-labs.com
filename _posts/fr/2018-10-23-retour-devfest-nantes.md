---
layout: post
title: "Retour sur la mission spatiale au devfest Nantes"
excerpt: "Retour sur la mission spatiale au devfest Nantes"
authors:
    - mminassyan
    - tthuon
    - cogren
permalink: /fr/retour-devfest-nantes/
categories:
    - Conférence
tags:
    - Conférence
    - devfest
    - nantes
cover: /assets/2018-10-23-retour-devfest-nantes/cover.jpg
---

## Le devfest en quelques mots

Le DevFest est un évènement sur deux jours qui réunit toute la communauté de développeur autout de conférence orienté sur le web et le cloud computing. Les sujets sont variés. Cela passe par du Web, Mobile et aussi par toutes les technologie back avec du Cloud, Big Data, Machine Learning, DevOps, et enfin des sujets plus ouvert à la découverte.

Chaque année une nouvelle ville et un nouveau thème est choisi. Cette année c'est dans la ville de Nantes avec le thème de l'espace. C'était l'ocassion pour les quelques astronautes présents sur ces terres d'y assister.

## Ce que nous avons aimé

Nous avons eu trois astonautes présents : Marie, Thierry et Carl. Chacun a pu assister à des sujets qui les ont intéressé.

### Hacker les catastrophes naturelles

La Cybersécurité est souvent associée aux failles, attaques, confidentialité, disponibilité des infrastructures. Trop souvent les catastrophes naturelles sont négligées comme risques majeurs dans nos métiers. Cette conférence qui est orienté sur la sécurité et l'alerte aux populations m'a beaucoup intéressé puisque qu'elle parle de scénario catastrophe qui pourrait arriver dès maintenant. Le problème est que nous ne sommes pas préparé, ni même informé. Cela m'a permit de découvrir le monde du radio amateur et des moyens possible simple pour commencer à expérimenter. Par exemple avec un récepteur TNT en USB il est possible d'écouter les avions, d'intercepter des messages en clair, etc.. C'est donc bien du hacking au sens premier et non celui qui médiatisé. Un autre exemple de hack, l'ajout d'un récepteur FM pour diffuser une alerte dans les détecteurs d'incendie. 

Cette conférence, bien qu'il ne soit pas axé sur du web, était intéressant et permet d'ouvrir ses connaissances sur d'autre domaine. Il faut donc prévoir un plan de secours et le communiquer à toutes les personnes impliqué.


### Git Dammit

Git est un outil de versionning le plus utilisé dans le monde. Mais bien souvent, il est utilisé de manière basique sans vraiment comprendre son fonctionnement interne. Très souvent, dès qu'une personne est "experte", elle est très souvent solicité sur des questions récurrentes. 

La conférence m'a beaucoup intéressé car elle n'a pas fait qu'une liste de commande git. Elle a fait la démonstration d'un projet fictif très proche du réel. Il y a eu des explications et des schémas simple et facile à comprendre.

{% raw %}
<blockquote class="twitter-tweet" data-lang="fr"><p lang="fr" dir="ltr">Excellent talk Git Dammit, quelques bonnes commandes pour un repo propre. <a href="https://twitter.com/hashtag/DevFestNantes?src=hash&amp;ref_src=twsrc%5Etfw">#DevFestNantes</a> <a href="https://t.co/Etsf7kTFFT">pic.twitter.com/Etsf7kTFFT</a></p>&mdash; Anthony Manach (@tonicfx) <a href="https://twitter.com/tonicfx/status/1053196563907010561?ref_src=twsrc%5Etfw">19 octobre 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

Voici quelques commandes et concept que j'ai appris:
 
Fix du commit A au milieu de la branche
- `git commit --fixup A` créé un commit de fixup 
- `git rebase -i A~ --autosquash` git rebase avec le commit de fixup

Supprimer un commit
- `git reset head~ --soft` = bouge le HEAD sur le commit précédent
- `git reset head~ --mixed` = bouge le HEAD et l'index sur le commit précédent
- `git reset head~ --hard` = bouge le HEAD et l'index et le working directory sur le commit précédent

Branche de tracking = mirroir de la branche sur le repo distant en mode read only.

Faire un rebase à partir d'un commit sur la branche master
- `git rebase ${SHA1}~ --onto master`

Faire un cherry-pick sans commiter
- `git cherry pick -n`

Ajouter les modifications dans plusieurs commit
- `git add -p`

Les slides de la conférence sont sur [Github: Git dammit talk](https://mghignet.github.io/git-dammit-talk/)


La fusée Eleven-Labs a également posé son camp de base à cet évènement.

{% raw %}
<blockquote class="twitter-tweet" data-lang="fr"><p lang="fr" dir="ltr"><a href="https://twitter.com/hashtag/EXPEDITION?src=hash&amp;ref_src=twsrc%5Etfw">#EXPEDITION</a> 🚀<br>Les portes sont ouvertes : Nos astronautes sont à bord du <a href="https://twitter.com/hashtag/DevFestNantes?src=hash&amp;ref_src=twsrc%5Etfw">#DevFestNantes</a> ! Nous sommes prêts pour 2 journées de conférences, rencontres &amp; échanges.<a href="https://twitter.com/hashtag/Cloud?src=hash&amp;ref_src=twsrc%5Etfw">#Cloud</a> <a href="https://twitter.com/hashtag/DevOps?src=hash&amp;ref_src=twsrc%5Etfw">#DevOps</a> <a href="https://twitter.com/hashtag/Web?src=hash&amp;ref_src=twsrc%5Etfw">#Web</a> <a href="https://twitter.com/hashtag/Mobile?src=hash&amp;ref_src=twsrc%5Etfw">#Mobile</a> <a href="https://twitter.com/hashtag/BigData?src=hash&amp;ref_src=twsrc%5Etfw">#BigData</a> <a href="https://t.co/RiQ6mIAapR">pic.twitter.com/RiQ6mIAapR</a></p>&mdash; Eleven Labs (@Eleven_Labs) <a href="https://twitter.com/Eleven_Labs/status/1052834386259955712?ref_src=twsrc%5Etfw">18 octobre 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}

## Conclusion  
