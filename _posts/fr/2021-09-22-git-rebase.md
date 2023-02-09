---
layout: post
lang: fr
date: '2021-09-22'
categories: []
authors:
  - tthuon
excerpt: >-
  Aujourd'hui, nous utilisons tous git pour gérer le code source des projets,
  que ce soit pour notre usage personnel ou professionnel.
title: Git rebase
slug: git-rebase
oldCategoriesAndTags:
  - bonnes pratiques
  - git
permalink: /fr/git-rebase/
---

Aujourd'hui, nous utilisons tous git pour gérer le code source des projets, que ce soit pour notre usage personnel ou professionnel.
Nous savons tous commiter ou tirer des modifications. Mais il y a un problème assez récurrent dans les projets à plusieurs collaborateurs : les conflits.
Pour mieux les gérer et les éviter, je vous propose d'aborder une commande git : rebase.

*Notez qu'après lecture de ces quelques lignes, un autre article sera susceptible de vous intéresser aussi, intitulé [Introduction à Gitlab CI/CD](https://blog.eleven-labs.com/fr/introduction-gitlab-ci/) (qui comme son nom l'indique vous initie au fonctionnement de Gitlab CI/CD). N'hésitez pas à aller y jeter un oeil :)* 

## Le problème

Git permet d'avoir un historique complet des modifications du code source. Pour réaliser une fonctionnalité, chaque contributeur va créer une branche depuis la branche *master*.

Les développements commencent et chacun modifie des lignes de codes.

Nous avons Jean qui a terminé le développement d'une fonctionnalité. Elle est fusionnée dans *master*. Tout se passe bien.

Marc a également terminé son développement, mais il a modifié les même fichiers que Jean. Si la branche de marc est fusionnée à ce moment, il y aura des **conflits**.

## La solution

Il est donc nécessaire de mettre à jour sa branche avant de pousser ses modifications. Cette mise à jour va inclure toutes les modifications de Jean dans la branche de Marc. Ça s'appelle un *rebase*.

```sh
git rebase
```

Cette commande va prendre tous les commits de la branche en cours pour les appliquer à la suite de l'historique de la branche cible (très souvent *master*).

Il est important de voir l'historique git comme un empilement d'éléments (*commit*).

## Exemple

J'ai une branche *master* avec le code source de mon application.

```
commit c1
Author: lepiaf
Date: Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
```

Je crée une branche pour implémenter une fonctionnalité.

```sh
git checkout -b myfeat
```

Un autre personne crée une branche avec une autre fonctionnalité à implémenter.

```sh
git checkout -b anotherfe
```

![gitrebase-init]({{site.baseurl}}/assets/2016-06-21-git-rebase/gitrebase-init.png)

Les développements avancent. La branche *myfeat* :

```
commit c2
Author: lepiaf
Date:   Sun Jun 12 17:06:00 2016 +0200

    create a branch

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
```

![gitrebase-myfeat-commit]({{site.baseurl}}/assets/2016-06-21-git-rebase/gitrebase-myfeat-commit.png)

La branche *my-feat* est fusionnée en premier dans *master*.

```sh
git checkout master
git merge myfeat
```

Et mon historique de *master*

```
commit c1
Author: lepiaf
Date:   Sun Jun 12 17:06:00 2016 +0200

    create a branch

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
```

![gitrebase-myfeat-merge]({{site.baseurl}}/assets/2016-06-21-git-rebase/gitrebase-myfeat-merge.png)

Ici il y a eu une fusion rapide.

Avec la branche *anotherfe* je crée un autre commit.

```
commit c3
Author: lepiaf
Date:   Sun Jun 12 17:15:59 2016 +0200

    add title level 2

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
```

![gitrebase-anotherfe-commit]({{site.baseurl}}/assets/2016-06-21-git-rebase/gitrebase-anotherfe-commit.png)

Si je fusionne cette branche avec *master*, je vais avoir des problèmes car j'ai modifié le même fichier. Je vais d'abord faire un rebase depuis master pour appliquer mes modifications à la suite des modifications de *master*.

```sh
git rebase master
Premièrement, rembobinons head pour rejouer votre travail par-dessus...
Application : add title level 2
```

Je vois que le commit "c3" est bien appliqué après les modification "c1" et "c2".

![gitrebase-anotherfe-rebase]({{site.baseurl}}/assets/2016-06-21-git-rebase/gitrebase-anotherfe-rebase.png)

Ici, le *rebase* s'est bien déroulé car il n'y a pas eu de modification au même endroit.

Ensuite je peux fusionner *anotherfe* dans *master* sans problème.

```
commit c3
Author: lepiaf
Date:   Sun Jun 12 17:15:59 2016 +0200

    add title level 2

commit c2
Author: lepiaf
Date:   Sun Jun 12 17:06:00 2016 +0200

    create a branch

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
```

Je vois que master contient bien les modifications de *myfeat* et *anotherfe*.

![gitrebase-master-final]({{site.baseurl}}/assets/2016-06-21-git-rebase/gitrebase-master-final-1.png)

### Gestion des conflits

Il arrive que les modifications soient sur le même fichier et sur les même lignes. Dans ce cas, git ne sait pas lesquelles appliquer.

Je vais créer deux branches: *feat-commit* et *feat-cherry-pick*

Sur *feat-commit*, j'ai un commit et il est prêt à être fusionné sur *master*.

```sh
commit 98dfce3f58f158b966dbd4a8ef177b2a4aa23f18
Author: lepiaf
Date:   Sun Jun 12 17:23:21 2016 +0200

    create commit

commit 13f1553f92a9ef09da02a695743dd0f6952b4b82
Author: lepiaf
Date:   Sun Jun 12 17:15:59 2016 +0200

    add title level 2

(...)
```

Je merge *feat-commit* dans *master*.

```sh
git checkout master
git merge feat-commit
```

Tout se passe bien.

Maintenant, je dois fusionner *feat-cherry-pick* dans *master*.

Comme je sais qu'il y a eu des modifications sur *master*, je vais faire un *git rebase* pour appliquer mes modifications au dessus de ceux de *master*.

```sh
git checkout feat-cherry-pick
git rebase master
```

Et là, kaboum !

```
git rebase master
Premièrement, rembobinons head pour rejouer votre travail par-dessus...
Application : how to cherry pick
Utilisation de l'information de l'index pour reconstruire un arbre de base...
M   README.md
Retour à un patch de la base et fusion à 3 points...
Fusion automatique de README.md
CONFLIT (contenu) : Conflit de fusion dans README.md
Échec d'intégration des modifications.
Le patch a échoué à 0001 how to cherry pick
La copie du patch qui a échoué se trouve dans :
   /home/nous/Sites/git/.git/rebase-apply/patch

Lorsque vous aurez résolu ce problème, lancez "git rebase --continue".
Si vous préférez sauter ce patch, lancez "git rebase --skip" à la place.
Pour extraire la branche d'origine et stopper le rebasage, lancez "git rebase --abort".
```

Le rebase n'a pas fonctionné. Il y a des conflits dans le fichier README.md.

Git va marquer les sections en conflit avec des chevrons.

```
<<<<<<< HEAD
```

### Commit

To commit a change:

```bash
git commit -m "my message"
```

### Cherry pick

To cherry-pick a commit

```bash
git cherry-pick
```

D'un côté il y a le HEAD qui correspond au master, de l'autre la branche en cours de rebase.

Dans notre cas, je veux garder les deux modifications et les fusionner. J'édite le fichier en supprimant les chevrons.

### Commit

To commit a change:

```bash
git commit -m "my message"
```

### Cherry pick

To cherry-pick a commit

```bash
git cherry-pick
```

J'ajoute mes modifications et je continue. Git rebase va s'arrêter à chaque commit où il y a des conflits lors de la fusion.

```sh
git add README.md
git rebase --continue
```

Le rebase est terminé. L'historique de *master* est propre.

Pour référence: [git-rebase]({{site.baseurl}}https://git-scm.com/docs/git-rebase) et [Git branching - rebasing]({{site.baseurl}}https://git-scm.com/book/en/v2/Git-Branching-Rebasing){:rel="nofollow noreferrer"}

Images créées avec <http://learngitbranching.js.org/?NODEMO>
