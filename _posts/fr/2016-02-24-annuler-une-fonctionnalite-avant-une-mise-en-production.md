---
layout: post
lang: fr
date: '2016-02-24'
categories: []
authors:
  - tthuon
excerpt: Git workflow
title: Annuler une fonctionnalité avant une mise en production
slug: annuler-une-fonctionnalite-avant-une-mise-en-production
oldCategoriesAndTags:
  - non classé
  - git
  - workflow
permalink: /fr/annuler-une-fonctionnalite-avant-une-mise-en-production/
---

Git workflow
============

Connaissez-vous le "git workflow" ? Si ce n'est pas le cas, je vous invite à lire cet article <http://nvie.com/posts/a-successful-git-branching-model>

Je vais mettre ci-dessous l'image pour bien l'avoir en tête :

![Git workflow](http://nvie.com/img/git-model@2x.png){:rel="nofollow noreferrer"}

> "Git workflow. source: http://nvie.com/posts/a-successful-git-branching-model"

Ce schéma est intéressant, cependant, il manque une réponse à une question : comment faire pour annuler une fonctionnalité depuis la branche *release* ?

Ce flux de travail suppose que toutes les fonctionnalités en *develop* soient *recettées* par le *product owner* et validées. Mais si une fonctionnalité n'est pas validée, alors qu'elle est en *develop *: nous sommes un peu coincés. La branche *release* permet de préparer la mise en production. Il faut donc l'utiliser pour fixer les éventuels bogues et annuler les fonctionnalités non validées. C'est sur ce dernier point que l'article va se concentrer.

Maîtriser git comme un chef
===========================

Posons le décor : nous avons une branche *master* qui sera utilisée pour la mise en production, une branche *develop* pour toutes les nouvelles fonctionnalités du *sprint* en cours, et enfin une branche de *release* pour préparer la mise en production.

Ça donne ceci :

![git workflow](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/init_git.png)

Un développeur créé une nouvelle fonctionnalité. Il va créer sa branche depuis *develop et* la nommer "*feat-my-awesome-feature*". Des fichiers sont créés, il y a un commit et la branche est poussée.

```sh
git checkout develop
git checkout -b feat-my-awesome-feature
# faire des modifications
git add -A
git commit -m "create some awesome code"
git push origin feat-my-awesome-feature
```

![GIT feature](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_feature.png)

La *code review* est ok, les tests passent, la branche est *fusionnée* dans *develop* pour être déployée en environnement d'intégration. Lors d'une *pull request*, le *merge* est fait en no-ff (*no fast forward*). Cela signifie qu'il y a un *commit* de *merge* dans l'historique. C'est important car il sera utilisé plus tard.

```
git checkout develop
git merge --no-ff feat-my-awesome-feature
git push origin develop
```

![Git Awesome Feature](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_awesome_feature.png)

Je refais de même avec une seconde fonctionnalité : *feat-killer-feature*

```
git checkout develop
git checkout -b feat-killer-feature
# faire des modifications
git add -A
git commit -m "create killer code"
git push origin feat-killer-feature
```

![Git Killer Feat](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_killer_feat.png)

Et je *merge*.

```
git checkout develop
git merge --no-ff feat-killer-feature
git push origin develop
```

![Git merge killer feat](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_merge_killer_feat.png)

Voilà, mon décor est posé. Petite vue en mode terminal.

![Git log](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_log.png)

Préparation de la branche release
---------------------------------

Notre *sprint* va bientôt s'achever, préparons la branche de *release*. Mais au dernier moment, un *product owner* affolé voit que la fonctionnalité n'est pas valide. Il ne faut pas passer cette fonctionnalité en production.

![seriously](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/seriously.png)

Il faut gérer cette situation !

Faisons avancer *release* vers *develop*.

```sh
git checkout release
git merge develop --no-ff
```

Il est important de faire un *merge --no-ff* car cela va permettre de garder une trace dans l'historique sur cette annulation.

![Git release](/_assets/posts/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_release.png)

Annuler la branche "feat-my-awesome-feature"
============================================

Cette fonctionnalité n'est pas si géniale que ça (selon le *product owner*), je vais donc l'annuler de la branche *release*, mais je veux pouvoir la garder en *develop* pour l'améliorer dans le prochain *sprint*.

Je vais donc faire un *revert.*

```sh
git checkout release
git revert -m 1 <commit de merge de feat-my-awesome-feature>
```

Si je fais un *git log*, je vais retrouver mon *commit* de *merge* correspondant :  184a372a608b632636f20a1ab7c64027cc9eecc2

En appliquant cette commande, un nouveau *commit* va être créé : un *commit* de *revert*. Cela va permettre d'indiquer qu'il y a eu *revert* et donc une annulation de l'ensemble des modifications de ce *commit*.

Mon historique indique bien un *commit* de *revert* avec en commentaire une explication:

```
commit 15c3c27a603263d1e59f5b137e7acfc6dcad5ce0
Author: Thierry Thuon <thierry.thuon.ext@francetv.fr>
Date:   Fri Feb 19 12:49:07 2016 +0100

    Revert "Merge branch 'feat-my-awesome-feature' into develop"

    This reverts commit 184a372a608b632636f20a1ab7c64027cc9eecc2, reversing
    changes made to 59596dd37699742262fc5a2705e2b9396540af77.
```

Je pousse ma branche *release* et la *merge* dans *master*. Il faut toujours pousser en --*no-ff* pour avoir un *commit* de *merge*, et donc avoir la possibilité de faire un *revert*.

```sh
git push origin release
git checkout master
git merge release --no-ff
```

Depuis *master*, je vois que j'ai bien la fonctionnalité *feat-killer-feature* uniquement.

Remettre à jour develop
=======================

Maintenant, une autre problématique se pose : si je *merge* de nouveau *develop* dans *release*,  git considère qu'il n'y a aucune modification. C'est à cause du *commit* de *revert* dans la branche *release*. Pour cela, il faut annuler ce *commit* de *revert* (en gros, annuler une annulation x) ).

Je vais tout d'abord mettre à jour *develop.*

```sh
git checkout develop
git merge release
```

Ici je n'ai pas besoin de faire un *--no-ff*, j'applique les modifications directement en *fast-forward*.

Depuis *develop*, je cherche mon *commit* de *revert* : 15c3c27a603263d1e59f5b137e7acfc6dcad5ce0

Et j'applique un *revert* sur ce *commit*.

```sh
git revert <commit de revert>
```

Un nouveau *commit* s'ajoute : il annule un *commit* d'annulation ("revert the revert").

```
commit b7f210da78305284f72edc2e671e5be1f167faad
Author: Thierry Thuon <thierry.thuon.ext@francetv.fr>
Date:   Fri Feb 19 13:01:53 2016 +0100

    Revert "Revert "Merge branch 'feat-my-awesome-feature' into develop""

    This reverts commit 15c3c27a603263d1e59f5b137e7acfc6dcad5ce0.
```

Je retrouve bien les modifications de ma branche *feat-my-awesome-feature*. Et lors de la prochaine *release*, si tout est ok, elle pourra passer en *master*. Sinon, il faudra faire de nouveau un *revert* dans *release*.

Pour conclure, cette solution permet d'avoir la rigueur du *git workflow*, tout en ayant la souplesse et la possibilité d'annuler une fonctionnalité complète juste avant une mise en production. L'exemple montré ici est un cas nominal, mais la plupart du temps il peut y avoir un risque de conflit. Cette technique fonctionne bien pour des fonctionnalités isolées. De plus, il est important de bien faire les *merge* vers *release* et *master* en *no fast forward* (*--no-ff*). Enfin, il ne faut pas oublier les *commit* de *revert* lors de la mise à jour de *develop*.

Je vous mets en lien la démo: <https://github.com/eleven-labs/cancel-story-before-deploying-prod/network>
