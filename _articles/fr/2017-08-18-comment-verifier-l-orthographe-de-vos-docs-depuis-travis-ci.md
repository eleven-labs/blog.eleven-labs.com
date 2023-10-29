---
contentType: article
lang: fr
date: '2017-08-18'
slug: comment-verifier-l-orthographe-de-vos-docs-depuis-travis-ci
title: Comment vérifier l'orthographe de vos docs depuis Travis CI ?
excerpt: >-
  Nous allons montrer dans cet article comment vérifier l'orthographe
  automatiquement dans vos documents markdown, modifiés dans vos pull requests,
  simplement avec Aspell et Travis CI
cover: /assets/2017-08-18-how-to-check-the-spelling-of-your-docs-from-travis-ci/typing.jpg
categories: []
authors:
  - charles-eric
keywords:
  - ci
  - travis
  - aspell
  - orthographe
---

Notre blog est basé sur Jekyll et hébergé sur Github Pages : [plus de détails ici](/fr/migration-du-blog/). Donc pour publier un article de blog, chaque auteur doit ouvrir une pull request sur Github pour soumettre ses fichiers markdown.
Ensuite les autres astronautes peuvent relire ce qui a été rédigé avant de merger, i.e. publier l'article. Bien sûr le but de cette revue est de s'assurer que tout est bien expliqué et pas uniquement de corriger toutes les fautes d'orthographe, sinon cette relecture ne serait pas très drôle ! ;)

C'est pourquoi nous avions besoin d'un moyen simple permettant de trouver automatiquement toutes les fautes dans les fichiers changés des pull requests, pour faciliter cette revue. Nous savons que les outils de vérification automatique d'orthographe ne sont jamais parfaits, et nous voulions donc seulement que cet outil nous envoie une notification avec les éventuelles erreurs, sans bloquer les autres astronautes qui voudraient merger la pull request.

Voilà ce que nous avons donc fait :

Comment fonctionne Aspell ?
===========================

Premièrement il faut installer cet outil :

```bash
apt-get install aspell aspell-en # et aspell-fr pour l'orthographe française par exemple
```

La commande que nous allons utiliser est la suivante :

```bash
cat some_text.md | aspell --lang=en --encoding=utf-8 list
```

- `some_text.md` correspond à votre fichier markdown, dans lequel vous voulez vérifier l'orthographe
- `--lang=en` ou `--lang=fr` par exemple, en fonction de votre langue
- `--encoding=utf-8` si votre fichier contient des caractères spéciaux

Cette commande va retourner tous les mots qu'Aspell ne connaît pas, c'est à dire non listés dans ses dictionnaires : nos potentielles fautes d'orthographe.

> À noter :
> Il peut être intéressant d'exécuter cette commande plusieurs fois, en anglais et en français par exemple, surtout si vous rédigez des documents techniques en français qui contiendront forcément aussi beaucoup de termes anglais.

Vous allez aussi avoir besoin d'autoriser vos propres expressions, qui ne seraient pas reconnues par défaut. Pour cela, vous pouvez ajouter et utiliser vos dictionnaires personnels, nommé `.aspell.en.pws` pour un dictionnaire personnel anglais. Voici un exemple de ce que pourrait contenir ce fichier :

```
personal_ws-1.1 fr 3
php
javascript
android
```

À noter que l'entête de ce fichier (première ligne) est importante : les deux derniers arguments correspondent à la langue et au nombre de mots.

Ensuite pour utiliser ce dictionnaire personnel, vous devez ajouter cet argument à la commande : `--personal=./.aspell.en.pws`

Comment exécuter cet outil depuis Travis CI ?
=============================================

Pour lancer `aspell` depuis Travis CI, vous devez installer ce package apt dans le container Travis. Pour ce faire, ajoutez les lignes suivantes dans le fichier `.travis.yml` :

```yml
addons:
  apt:
    packages:
      - aspell
      - aspell-en
      - aspell-fr # qui correspond à votre langue
```

Ensuite, dans ce même fichier de configuration, vous pouvez exécuter votre script personnalisé grâce à cette ligne :

```yml
script: your_script.sh
```

Dans ce script, vous pouvez utiliser la variable d'environnement `$TRAVIS_COMMIT_RANGE`, disponible dans le container Travis, pour récupérer seulement les fichiers qui ont changé dans la pull request du build en cours :

```bash
git diff --name-only $TRAVIS_COMMIT_RANGE
```

Si vous voulez récupérer seulement les fichiers de type markdown, vous pouvez ajouter `| grep .md` à la fin de la précédente ligne de commande.

Une fois que vous avez les noms des fichiers que vous voulez vérifier sur votre pull request, vous pouvez lancer la commande `aspell list` que nous avons vue en première partie.

Vous pouvez aussi utiliser les commandes `grep` et `sed` pour supprimer les meta-données ou les blocs de code de vos fichiers, avant d'exécuter la commande `aspell`, si vous ne voulez pas vérifier l'orthographe dans ces blocs.
Par exemple, si vous voulez supprimer vos blocs de code de vos fichiers markdown, vous pouvez utiliser cette commande :

```bash
cat your_file.md | sed  -n '/^```/,/^```/ !p'
```

Comment envoyer les résultats vers votre pull request Github ?
==============================================================

Nous ne voulons pas que ce script bloque ceux qui souhaitent merger la pull request. La première chose à faire est donc de retourner `exit 0` à la fin de notre script qui sera exécuté depuis Travis CI. Sinon si un code d'erreur est retourné, Travis va indiquer un statut d'erreur sur la pull request qui empêchera de la merger.

La façon la plus simple d'envoyer les résultats des précédentes commandes est donc de les poster dans un commentaire sur la pull request Github.

Premièrement vous devrez choisir un utilisateur Github qui sera utilisé pour ajouter un commentaire, et configurer un token d'accès pour cet utilisateur :
- Connectez vous sur [https://github.com](https://github.com) avec cet utilisateur
- Allez sur [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
- Ajoutez un nom/description au token que vous créez et cochez bien le scope `public_repo` seulement, si votre repository Github est public.

Ensuite, depuis le script exécuté sur Travis, une fois que vous avez les résultats de la commande `aspell`, vous pouvez utiliser `curl` pour appeler l'API Github avec le token précédemment créé :

```bash
curl -i -H "Authorization: token $GITHUB_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d "{\"body\":\"$ASPELL_RESULTS\"}" \
    https://api.github.com/repos/eleven-labs/blog.eleven-labs.com/issues/$TRAVIS_PULL_REQUEST/comments
```

- Le token Github doit être caché et non pas en dur dans votre script, vous devez donc ajouter une variable d'environnement dans les paramètres Travis. Pour cela, allez sur cette page : [https://travis-ci.org/your-github-account/your-repository/settings](https://travis-ci.org/your-github-account/your-repository/settings)
- La variable d'environnement `$TRAVIS_PULL_REQUEST` est automatiquement disponible sur le container Travis et correspond au numéro de la pull request liée au build en cours sur Travis.

Conclusion
==========

Si vous voulez voir le script entier qui nous utilisons pour notre blog, c'est par [ici](https://github.com/eleven-labs/blog.eleven-labs.com/blob/master/bin/check-spelling.sh).

J'espère que ces astuces vous aideront ! Notez que vous pouvez aussi utiliser ce même process pour vérifier vos doc blocks dans votre code, ou vos fichiers de documentation.

Nous améliorerons très certainement ces scripts et vérifications automatiques lors des prochaines semaines, suivez donc [le repository de notre blog sur Github](https://github.com/eleven-labs/blog.eleven-labs.com), pour voir les prochaines mises à jour.

Vos idées d'améliorations sont également les bienvenues : vous pouvez ajouter des commentaires ci-dessous ;)
