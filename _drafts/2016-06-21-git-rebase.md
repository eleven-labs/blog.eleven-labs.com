---
layout: post
title: Git rebase
author: tthuon
date: '2016-06-21 17:56:42 +0200'
date_gmt: '2016-06-21 15:56:42 +0200'
categories:
- Non classé
tags: []
---

Aujourd'hui, nous utilisons tous git pour gérer le code source des projets, que ce soit pour notre usage personnel ou professionnel.

Nous savons tous commiter ou tirer des modifications. Mais il y a un problème assez récurrent dans les projets à plusieurs collaborateurs : les conflits.

Pour mieux les gérer et les éviter, je vous propose d'aborder une commande git : rebase.

## Le problème
Git permet d'avoir un historique complet des modifications du code source. Pour réaliser une fonctionnalité, chaque contributeur va créer une branche depuis la branche <em>master</em>.

Les développements commencent et chacun modifie des lignes de codes.

Nous avons Jean qui a terminé le développement d'une fonctionnalité. Elle est fusionnée dans <em>master</em>. Tout se passe bien.

Marc a également terminé son développement, mais il a modifié les même fichiers que Jean. Si la branche de marc est fusionnée à ce moment, il y aura des <strong>conflits</strong>.

## La solution
Il est donc nécessaire de mettre à jour sa branche avant de pousser ses modifications. Cette mise à jour va inclure toutes les modifications de Jean dans la branche de Marc. Ça s'appelle un <em>rebase</em>.

<pre class="lang:sh decode:true">
{% raw %}
git rebase{% endraw %}
</pre>

Cette commande va prendre tous les commits de la branche en cours pour les appliquer à la suite de l'historique de la branche cible (très souvent <em>master</em>).

Il est important de voir l'historique git comme un empilement d'éléments (<em>commit</em>).

## Exemple
J'ai une branche <em>master</em> avec le code source de mon application.

<pre class="lang:sh decode:true">
{% raw %}
commit c1
Author: lepiaf
Date: Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial

{% endraw %}
</pre>

Je crée une branche pour implémenter une fonctionnalité.

<pre class="lang:sh decode:true">
{% raw %}
git checkout -b myfeat{% endraw %}
</pre>

Un autre personne crée une branche avec une autre fonctionnalité à implémenter.

<pre class="lang:sh decode:true">
{% raw %}
git checkout -b anotherfe{% endraw %}
</pre>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-init.png"><img class="alignnone size-full wp-image-1893" src="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-init.png" alt="gitrebase-init" width="192" height="170" /></a>

Les développements avancent. La branche <em>myfeat</em> :

<pre class="lang:sh decode:true">
{% raw %}
commit c2
Author: lepiaf
Date:   Sun Jun 12 17:06:00 2016 +0200

    create a branch

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
{% endraw %}
</pre>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-myfeat-commit.png"><img class="alignnone size-full wp-image-1894" src="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-myfeat-commit.png" alt="gitrebase-myfeat-commit" width="189" height="252" /></a>

La branche <em>my-feat</em> est fusionnée en premier dans <em>master</em>.

<pre class="lang:sh decode:true">
{% raw %}
git checkout master
git merge myfeat
{% endraw %}
</pre>

Et mon historique de <em>master</em>

<pre class="lang:sh decode:true">
{% raw %}
commit c1
Author: lepiaf
Date:   Sun Jun 12 17:06:00 2016 +0200

    create a branch

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial
{% endraw %}
</pre>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-myfeat-merge.png"><img class="alignnone size-full wp-image-1895" src="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-myfeat-merge.png" alt="gitrebase-myfeat-merge" width="201" height="263" /></a>

Ici il y a eu une fusion rapide.

Avec la branche <em>anotherfe </em>je crée un autre commit.<em><br />
</em>

<pre class="lang:sh decode:true">
{% raw %}
commit c3
Author: lepiaf
Date:   Sun Jun 12 17:15:59 2016 +0200

    add title level 2

commit c1
Author: lepiaf
Date:   Sun Jun 12 16:32:19 2016 +0200

    initialize tutorial

{% endraw %}
</pre>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-anotherfe-commit.png"><img class="alignnone size-medium wp-image-1896" src="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-anotherfe-commit-300x180.png" alt="gitrebase-anotherfe-commit" width="300" height="180" /></a>

Si je fusionne cette branche avec <em>master</em>, je vais avoir des problèmes car j'ai modifié le même fichier. Je vais d'abord faire un rebase depuis master pour appliquer mes modifications à la suite des modifications de <em>master</em>.

<pre class="lang:sh decode:true">
{% raw %}
git rebase master
Premièrement, rembobinons head pour rejouer votre travail par-dessus...
Application : add title level 2
{% endraw %}
</pre>

Je vois que le commit "c3" est bien appliqué après les modification "c1" et "c2".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-anotherfe-rebase.png"><img class="alignnone size-medium wp-image-1897" src="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-anotherfe-rebase-300x217.png" alt="gitrebase-anotherfe-rebase" width="300" height="217" /></a>

Ici, le <em>rebase</em> s'est bien déroulé car il n'y a pas eu de modification au même endroit.

Ensuite je peux fusionner <em>anotherfe</em> dans <em>master</em> sans problème.

<pre class="lang:sh decode:true">
{% raw %}
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
{% endraw %}
</pre>

Je vois que master contient bien les modifications de <em>myfeat</em> et <em>anotherfe</em>.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-master-final-1.png"><img class="alignnone size-medium wp-image-1899" src="http://blog.eleven-labs.com/wp-content/uploads/2016/06/gitrebase-master-final-1-193x300.png" alt="gitrebase-master-final" width="193" height="300" /></a>

### Gestion des conflits
Il arrive que les modifications soient sur le même fichier et sur les même lignes. Dans ce cas, git ne sait pas lesquelles appliquer.

Je vais créer deux branches: <em>feat-commit</em> et <em>feat-cherry-pick</em>

Sur <em>feat-commit</em>, j'ai un commit et il est prêt à être fusionné sur <em>master</em>.

<pre class="lang:sh decode:true">
{% raw %}
commit 98dfce3f58f158b966dbd4a8ef177b2a4aa23f18
Author: lepiaf
Date:   Sun Jun 12 17:23:21 2016 +0200

    create commit

commit 13f1553f92a9ef09da02a695743dd0f6952b4b82
Author: lepiaf
Date:   Sun Jun 12 17:15:59 2016 +0200

    add title level 2

(...)
{% endraw %}
</pre>

Je merge <em>feat-commit</em> dans <em>master</em>.

<pre class="lang:sh decode:true">
{% raw %}
git checkout master
git merge feat-commit
{% endraw %}
</pre>

Tout se passe bien.

Maintenant, je dois fusionner <em>feat-cherry-pick</em> dans <em>master</em>.

Comme je sais qu'il y a eu des modifications sur <em>master</em>, je vais faire un <em>git rebase</em> pour appliquer mes modifications au dessus de ceux de <em>master</em>.

<pre class="lang:sh decode:true">
{% raw %}
git checkout feat-cherry-pick
git rebase master
{% endraw %}
</pre>

Et là, kaboum !

<pre class="lang:sh decode:true">
{% raw %}
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
Pour extraire la branche d'orig<span class="keyword">in</span>e et stopper le rebasage, lancez "git rebase --abort".
{% endraw %}
</pre>

Le rebase n'a pas fonctionné. Il y a des conflits dans le fichier README.md.

Git va marquer les sections en conflit avec des chevrons.

<pre class="lang:sh decode:true">
{% raw %}
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
<span class="comment">## Commit</span>

To commit a change:

```bash
git commit -m <span class="string">"my message"</span>
=======
<span class="comment">## Cherry pick</span>

To cherry-pick a commit

```bash
git cherry-pick
&lt;&lt;&lt;&lt;&lt;&lt;&lt; how to cherry pick
{% endraw %}
</pre>

D'un côté il y a le HEAD qui correspond au master, de l'autre la branche en cours de rebase.

Dans notre cas, je veux garder les deux modifications et les fusionner. J'édite le fichier en supprimant les chevrons.

<pre class="lang:sh decode:true">
{% raw %}
<span class="comment">## Commit</span>

To commit a change:

```bash
git commit -m <span class="string">"my message"</span>

<span class="comment">## Cherry pick</span>

To cherry-pick a commit

```bash
git cherry-pick
{% endraw %}
</pre>

J'ajoute mes modifications et je continue. Git rebase va s'arrêter à chaque commit où il y a des conflits lors de la fusion.

<pre class="lang:sh decode:true">
{% raw %}
git add README.md
git rebase --continue
{% endraw %}
</pre>

Le rebase est terminé. L'historique de <em>master</em> est propre.

Pour référence: <a href="https://git-scm.com/docs/git-rebase">git-rebase</a> et <a href="https://git-scm.com/book/en/v2/Git-Branching-Rebasing">Git branching - rebasing</a>

Images créées avec <a href="http://learngitbranching.js.org/?NODEMO">http://learngitbranching.js.org/?NODEMO</a>


