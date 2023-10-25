---
lang: fr
date: 2023-10-26
slug: how-to-git-gud
title: How to git gud
excerpt: Collection de tips & tricks qui vous simplifierons la vie avec Git au quotidien.
categories: []
keywords:
    - git
    - tips
    - tricks
authors:
    - mchardenal
---
![gitgud]({{ site.baseurl }}/assets/2023-10-26-how-to-git-gud/gitgud.png?width=300)

# Git

Git est un système de gestion de version distribuée [open source](https://github.com/git/git) créé en 2005 par Linus Torvald (créateur du noyau Linux). C'est un outil indispensable pour tout développeur qui va lui permettre de versionner ses fichiers, faciliter la collaboration sur un même projet ou encore simplifier la revue de code. Utilisé par 93% des développeurs d'après le [questionnaire pour développeurs de StackOverflow](https://stackoverflow.blog/2023/01/09/beyond-git-the-other-version-control-systems-developers-use/) c'est LE système de gestion de version le plus utilisé dans notre métier.

# Tips & tricks

Git reste un outil très simple d'utilisation où l'on utilise souvent les mêmes commandes (`add` / `commit` / `push` par exemple) mais il en existe plus de 150 différentes, sans compter les différentes options disponibles pour chaque commande ! Impossible donc de toutes les connaître, mais je suis là pour vous en faire découvrir des nouvelles, qui je pense pourront améliorer votre workflow au quotidien.

## Ajouter par "morceau"

Vous avez l'habitude de *stage* vos fichiers en faisant un beau `git add .` mais vous vous rendez ensuite compte que vous avez oublié un log que vous ne vouliez pas commit ? Vous vous retrouvez ensuite à chercher sur Google comment *unstage* votre modification ? J'ai la solution pour vous : l'option `--patch` ou `-p`. Celle-ci vous permettra de *stage* uniquement les lignes que vous voulez de manière interactive.

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

 Tous les jours, un meme est posté. Les gens doivent écrire une phrase qui matche bien avec le meme. Les gens votent ensuite pour la phrase qui les fait le plus rire et à la fin de la journée on élit un gagnant (la phrase avec le plus de réactions)
(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,e,?]? y
@@ -24,6 +26,8 @@ Tous les jours un meme est posté. Les gens doivent écrire une phrase qui matche
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

Nouvelle feature, nouvelle branche. Après avoir fièrement créé votre branche et y avoir commit des modifications, vous faites un `git push` et vous prenez en pleine face l'erreur suivante : `The current branch X has no upstream branch.`. Vous tapez alors `git push --set-upstream origin x` pour corriger votre erreur. Mais à coup sûr la prochaine feature, nouvelle branche vous allez refaire l'erreur.
Pour éviter cela ajoutez un nouvel alias dans votre `.bashrc` (ou autre fichier de configuration de shell) :
```bash
alias gpsup="git push --set-upstream origin $(git_current_branch)"
```

En plus avec la variable `$(git_current_branch)`, plus besoin de se prendre la tête à retaper son nom de branche.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>
Les utilisateurs de OhMyZSH auront peut-être reconnu cette commande qui est incluse directement avec. Pour toutes les retrouver c'est par [ici](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git/)
</div>

## Git config & alias

Nous venons de voir une méthode pour aliaser ses commandes Git depuis un fichier de configuration de shell mais Git offre aussi la possibilité de configurer ceux-ci via un fichier.

Ce fichier a normalement été initialisé lorsque vous avez configuré votre email / nom d'utilisateur. Pour trouver le path de ce fichier, utiliser `git config --list --show-origin`.

Voila à quoi il peut ressembler :

```yaml
[user]
    name = Matthieu CHARDENAL
    email = mchardenal@eleven-labs.com
```

En rajoutant un bloc `[alias]` nous allons pouvoir configurer nos alias Git qui seront utilisables uniquement via la CLI Git.

```yaml
[user]
    name = Matthieu CHARDENAL
    email = mchardenal@eleven-labs.com
[alias]
    please = push --force-with-lease
```

Vous pouvez retrouver plus d'exemples [ici](https://gist.github.com/ch3ric/f8e6d20c92017f28d462#file-gitconfig) et la documentation de Git [ici](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration).

## Trouver facilement un bug

Vous arrivez à votre daily et surprise, il y a un nouveau bug sur votre appli. Pourtant, ça marchait la semaine dernière non ? Comment faire pour identifier rapidement et simplement ce bug ? Une seule commande : `git bisect`. Cette commande effectue une recherche binaire pour retrouver le commit qui a introduit le bug.

Je vous laisse aller consulter [l'article](https://blog.eleven-labs.com/fr/git-rebase/) de l'un de mes collègues qui vous guidera pas à pas sur l'utilisation de cette commande.

## Fixup

Il n'est pas rare de devoir faire plusieurs commits sur une même branche. L'option fixup permet de réutiliser un message de commit en le préfixant par fixup !

```bash
git commit --fixup <commit_hash>
```

Cela vous permettra de squash plus facilement vos commits pour un historique plus propre !

Pas envie de *squasher* manuellement ? Pas de panique il existe aussi une option pour ça :
```bash
git rebase --interactive --autosquash
```

## Amend

Si vous ne voulez pas avoir à *squash* tous vos commits, il existe une autre option qui pourra vous être très utile.

```bash
git commit --amend
```

Cette commande vous permettra d'éditer votre dernier commit. Il est aussi possible de simplement éditer le message de commit si vous n'avez pas de nouvelles *diffs staged*.

```bash
git commit --amend -m "my new commit msg"
```

## J'ai tout cassé

Git est simple d'utilisation mais une mauvaise commande et voilà, vous avez cassé votre repo. Deux solutions :

```bash
rm -rf /my_project && git clone my_project
```
Mais c'est un peu radical.

```git reflog``` qui vous permet de lister toutes les actions effectuées sur votre repo pour retrouver le moment où tout a basculé.

```git reset HEAD@{index}``` pour revenir a l'état où tout fonctionnait.

## Un peu de ménage

Personnellement je ne supprime pas mes branches à chaque fois qu'elles sont *merge*. Je me retrouve donc très rapidement avec un nombre indécent de branches en local. Voici quelques commandes pour remédier à ce problème :

```git fetch --prune``` permet de supprimer toutes les references à des branches distantes qui n'existent plus

```git branch --merged origin/master | xargs git branch -d``` supprime toutes les branches qui ont été merge dans master

# Conclusion

Et voilà, j'espère vous avoir fait découvrir au moins une nouvelle commande utile que vous pourrez intégrer dans votre workflow.

Happy coding !
