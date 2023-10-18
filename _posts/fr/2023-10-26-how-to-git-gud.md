---
lang: fr
date: 2023-10-26
slug: how-to-git-gud
title: How to git gud
excerpt: Collection de tips & tricks qui vous simplifierions la vie avec git au quotidien.
categories: []
keywords:
- git, tips, tricks
authors:
    - mchardenal
---
![gitgud]({{ site.baseurl }}/assets/2023-10-26-how-to-git-gud/gitgud.png?width=300)

# Git

Git est un système de gestion de version distribuée [open source](https://github.com/git/git) créé en 2005 par Linus Torvald (créateur du noyau Linux). C'est un outil indispensable pour tout développeur qui va lui permettre de versionner ses fichiers, faciliter la collaboration sur un même projet ou encore simplifier la revue de code. Utilisé par 93% des développeurs d'après le [questionnaire pour développeurs de StackOverflow](https://stackoverflow.blog/2023/01/09/beyond-git-the-other-version-control-systems-developers-use/) c'est LE système de gestion de version le plus utilisé dans notre métier.

# Tips & tricks

Git reste un outil très simple d'utilisation où l'on utilise souvent les mêmes commandes (`add` / `commit` / `push` par exemple) mais il en existe plus de 150 différentes, sans compter les différentes options disponibles pour chaque commande ! Impossible donc de toutes les connaître, mais je suis là pour vous en faire découvrir des nouvelles, qui je pense pourront améliorer votre workflow au quotidien.

## Ajouter par "morceau"

Vous avez l'habitude de stage vos fichiers en faisant un beau `git add .` mais vous vous rendez ensuite compte que vous avez oublié un log que vous ne vouliez pas commit ? Vous vous retrouvez ensuite à chercher sur google comment unstage votre modification ? J'ai la solution pour vous : l'option `--patch` ou `-p`. Celle-ci vous permettra de stage uniquement les lignes que vous voulez de manière interactive

```bash
git add -p
diff --git a/README.md b/README.md
index 5a8a393..280fb5d 100644
--- a/README.md
+++ b/README.md
@@ -1,5 +1,7 @@
 # slack-motd / MEME OF THE DAY (MOTD)
 
+# new line 1
+
 ## Principe 
 
 Tout les jours un meme est posté. Les gens doivent écrire une phrase qui match bien avec le même. Les gens votent ensuite pour la phrase qui les fait le plus rire et à la fin de la journée on élit un gagnant (la phrase avec le plus de réaction)
(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,e,?]? y
@@ -24,6 +26,8 @@ Tout les jours un meme est posté. Les gens doivent écrire une phrase qui match
 * Firebase (scheduler / cloud function)
 * Log
 
+# new line 2
+
 ## TODO
 
 * POST message avec le meme
(2/2) Stage this hunk [y,n,q,a,d,K,g,/,e,?]? y
```


<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>
Petit bonus, cette option est aussi disponible pour unstage vos changements de manière interactive : `git reset --patch`
</div>

## Push sans réfléchir

Nouvelle feature, nouvelle branche. Après avoir fierement créé votre branch et y avoir commit des modifications vous faites un `git push` et vous prenez en pleine face l'erreur suivante `The current branch X has no upstream branch.`. Vous tapez alors `git push --set-upstream origin x` pour corriger votre erreur. Mais a coup sur la prochaine feature, nouvelle branche vous allez refaire l'erreur.
Pour éviter cela ajoutez un nouvel alias dans votre `.bashrc` (ou autre fichier de configuration de shell) :
```bash
alias gpsup="git push --set-upstream origin $(git_current_branch)"
```

En plus avec la variable `$(git_current_branch)` plus besoin de se prendre la tête a retaper son nom de branche.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>
Les utilisateurs de OhMyZSH auront peut-être reconnu cette commande inclut directement avec. Pour toutes les retrouver c'est par [ici](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git/)
</div>

## Trouver facilement un bug

Vous arrivez à votre daily quotidien et surprise, il y a un nouveau bug sur votre appli. Pourtant, ça marchait la semaine dernière non ? Comment faire pour identifier rapidement et simplement ce bug ? Une seule commande `git bisest`. Cette commande effectue une recherche binaire pour retrouver le commit qui a introduit le bug.

Pour cela, commencez par 

```bash
git bisect start
```

Vous êtes normalement sur une version de votre projet où le bug est présent, faite

```bash
git bisect bad # on indique que la version du code sur laquelle contient le bug
```

Il faut ensuite trouver le hash d'un commit où le bug n'est pas présent (avec `git log` ou autre)

```bash
git bisect good 8c96c76a546c093326a447bab26cf4afb79d119e
```

Vous allez voir le message suivant

```bash
Bisecting: 9 revisions left to test after this (roughly 3 steps)
```

Git m'indique que je vais avoir 3 étapes où je vais devoir renseigner si la version du code qu'il me propose contient le bug ou non en enchainant les `git bisect good` ou les `git bisect bad`

Une fois toutes les étapes faites vous devriez avoir le message suivant, contenant le hash du commit qui a introduit le bug.

```bash
cf34ea57c8a64ded24eb3c51bf3dfc5b2d24695c is the first bad commit
```

## Fixup

Il n'est pas rare de devoir faire plusieurs commit sur une même branche. L'option fixup permet de réutiliser un message de commit en le préfixant par fixup!

```bash
git commit --fixup <commit_hash>
```

Cela vous permettra de squash plus facilement vos commits pour un historique plus propre !

Pas envie de squasher manuellement ? Pas de panique il existe aussi une option pour ça :
`git rebase --interactive --autosquash`

## J'ai tout cassé

Git est simple d'utilisation mais une mauvaise commande et voila, vous avez cassé votre repo. Deux solutions : 

`rm -rf /my_project && git clone my_project` 

mais c'est un peu radical

`git reflog` qui vous permet de lister toutes les actions que avec effectué sur votre repo pour retrouver le moment où tout a basculé

`git reset HEAD@{index}` pour revenir a l'état où tout fonctionnait

## Un peu de ménage

Personnellement je ne supprime pas mes branches à chaque fois qu'elles sont merge. Je me retrouve donc très rapidement avec un nombre de branche en local indécent. Voici quelques commandes pour remédier à ce problème.

`git fetch --prune` permet de supprimer toutes les references à des branches distantes qui n'existent plus

`git branch --merged origin/master | xargs git branch -d` supprime toutes les branches qui ont été merge dans master

# Conclusion

Et voila, j'espere vous avoir fait découvrir au moins une nouvelle commande utile que vous pourrez intégrer dans votre workflow

Happy coding !