---
layout: post
title: Cancel a feature before pushing into production
lang: en
permalink: /en/cancel-feature-before-pushing-into-production/
authors:
 - tthuon
date: '2016-02-24 17:30:02 +0100'
date_gmt: '2016-02-24 16:30:02 +0100'
categories:
- git
tags:
- git
- workflow
---

## Git workflow

Do you know the "git workflow"? If this is not the case, I invite you to read this article <http://nvie.com/posts/a-successful-git-branching-model>

I will put the image below to have it in mind:

![Git workflow. source: http://nvie.com/posts/a-successful-git-branching-model](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git-model@2x.png)

This schema is interesting, however, it misses an answer to a question: how to cancel a feature from the branch _release_?

This workflow assumes that all features in _develop_ are tested by the product owner and validated. But if a feature is not validated, then it is in _develop_: we are a little stuck. The _release_ branch allows you to prepare for production. It must therefore be used to fix any bugs and cancel uncommitted features. It is on this last point that the article will focus.

## Master git

Let's set the place: we have a _master_ branch that will be used for production, a _develop_ branch for all new features of the current _sprint_, and finally a branch of _release_ to prepare for production.

It gives this :

![git workflow](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/init_git.png)

A developer creates a new feature. He will create his branch from _develop_ and name it _"feat-my-awesome-feature"_. Files are created, there is a commit and the branch is pushed.

```sh
git checkout develop
git checkout -b feat-my-awesome-feature
# do some changes
git add -A
git commit -m "create some awesome code"
git push origin feat-my-awesome-feature
```

![GIT feature](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_feature.png)

The code review is ok, the tests pass, the branch is merged in _develop_ to be deployed in an integration environment. During a pull request, the _merge_ is done with _--no-ff_ (no fast forward). This means that there is a _commit_ of _merge_ in the history. This is important because it will be used later.

```
git checkout develop
git merge --no-ff feat-my-awesome-feature
git push origin develop
```

![Git Awesome Feature](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_awesome_feature.png)

I do the same with a second feature: _feat-killer-feature_

```
git checkout develop
git checkout -b feat-killer-feature
# do some changes
git add -A
git commit -m "create killer code"
git push origin feat-killer-feature
```

![Git Killer Feat](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_killer_feat.png)

And I _merge_ with _--no-ff_ option.

```
git checkout develop
git merge --no-ff feat-killer-feature
git push origin develop
```

![Git merge killer feat](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_merge_killer_feat.png)

Now we have the set-up. Let see in console view.

![Git log](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_log.png)

### Preparing the release branch

Our sprint will soon be over, let's prepare the _release_ branch. But at the last moment, the product owner panic because feature should not be pushed to production.

![seriously](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/seriously.png)

We must manage this situation!

Let's move forward _release_ to _develop_.

```sh
git checkout release
git merge develop --no-ff
```

It is important to do a _merge --no-ff_ because this will allow to keep a trace in the history on this cancellation.

![Git release](/assets/2016-02-24-annuler-une-fonctionnalite-avant-une-mise-en-production/git_release.png)

### Cancel branch "feat-my-awesome-feature"

This feature is not that great as product owner said, so I'll cancel it from the _release_ branch, but I want to be able to keep it in _develop_ to improve it in the next sprint.

So I'm going to do a _revert_

```sh
git checkout release
git revert -m 1 <commit de merge de feat-my-awesome-feature>
```

If I do a _git log_, I will find my corresponding merge commit: 184a372a608b632636f20a1ab7c64027cc9eecc2

Applying this command above, a new commit will be created: a revert commit. It indicate that there has been revert and thus a cancellation of all the modifications of this commit.

My history indicates a revert commit with commentary as an explanation:

```
commit 15c3c27a603263d1e59f5b137e7acfc6dcad5ce0
Author: Thierry Thuon <thierry.thuon.ext@francetv.fr>
Date:   Fri Feb 19 12:49:07 2016 +0100

    Revert "Merge branch 'feat-my-awesome-feature' into develop"

    This reverts commit 184a372a608b632636f20a1ab7c64027cc9eecc2, reversing
    changes made to 59596dd37699742262fc5a2705e2b9396540af77.
```

I push my _release_ branch and the _merge_ in _master_. You must always push _--no-ff_ to have a _merge commit_, and therefore have the opportunity to do a _revert_.

```sh
git push origin release
git checkout master
git merge release --no-ff
```

From _master_, I see that I have the feature _feat-killer-feature_ only.

### Update develop branch

Now there is a problem: if I merge again _develop_ in _release_, git considers that there is no change. This is because of the _revert commit_ in the _release_ branch. To solve this, it is necessary to cancel this _revert commit_ (it mean cancel a cancellation).

I will first update _develop_.

```sh
git checkout develop
git merge release
```

Here I do not need to do a _--no-ff_, I apply the changes directly in _fast-forward_ mode.

From _develop_, I'm looking for my _revert commit_: 15c3c27a603263d1e59f5b137e7acfc6dcad5ce0

And I apply a _revert_ on this _commit_.

```sh
git revert <commit de revert>
```

A new _commit_ adds: it revert the _revert commit_.

```
commit b7f210da78305284f72edc2e671e5be1f167faad
Author: Thierry Thuon <thierry.thuon.ext@francetv.fr>
Date:   Fri Feb 19 13:01:53 2016 +0100

    Revert "Revert "Merge branch 'feat-my-awesome-feature' into develop""

    This reverts commit 15c3c27a603263d1e59f5b137e7acfc6dcad5ce0.
```

I found changes of my branch _feat-my-awesome-feature_. At the next _release_, if everything is ok, it can be merge into _master_. Otherwise, you will have to make a _revert_ in _release_ branch again.

## Conclusion

To conclude, this solution makes it possible to have the strength of _git workflow_, while having the flexibility and the possibility of canceling a complete functionality just before pushing into production. The example shown here is a nominal case, but most of the time there may be a risk of conflict. This technique works well for isolated features. In addition, it is important to make the _merge_ to _release_ and _master_ branch in _no fast forward_ mode (--no-ff option). Finally, we must not forget the _revert commit_ when updating _develop_.

I put you in link the demo: <https://github.com/eleven-labs/cancel-story-before-deploying-prod/network>
