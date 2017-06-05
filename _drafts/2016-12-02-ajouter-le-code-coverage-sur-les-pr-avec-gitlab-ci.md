--- layout: post title: Ajouter le code coverage sur les MR avec
Gitlab-CI author: rjardinet date: '2016-12-02 12:15:55 +0100' date\_gmt:
'2016-12-02 11:15:55 +0100' categories: - Non classé tags: - test -
gitlab - code-coverage - gitlab-ci --- {% raw %}

Voici un tip qui permet de pouvoir voir en un clin d’œil les
répercussions d'une MR sur la couverture de code de votre projet.

[![Gitlab ci - code
coverage](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-300x83.png){.wp-image-2663
.aligncenter width="1074"
height="297"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre.png)

 

Dans un premier temps, nous allons modifier notre .gitlab-ci.yml

 

``` {.lang:yaml .decode:true}
before_script:
  - composer install

stages:
  - test

test:
  script:
  - vendor/phpunit/phpunit/phpunit -c app --coverage-text --colors=never
```

 

La modification de notre pipeline porte sur les configs de phpunit en
ajoutant [--coverage-text --colors=never]{.lang:yaml .decode:true
.crayon-inline}  afin d'avoir dans les logs du pipeline les résultats du
code-coverage.

 

Puis dans l'interface de réglages du pipeline, nous allons configurer la
regex afin de récupérer la couverture de code du commit.

[![Code coverage
gitlab-ci](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-1-300x137.png){.wp-image-2672
.aligncenter width="1056"
height="482"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-1.png)

Là, gitlab est plutot sympa et nous donne déjà plusieurs regex toutes
prêtes en fonction du langage du projet. Dans mon cas c'est du PHP donc
la config sera [\^\\s\*Lines:\\s\*\\d+.\\d+\\%]{.lang:default
.decode:true .crayon-inline}

Et voila !!!

 

Petit bonus, pour avoir le badge avec le code coverage sur le README,
ajouter simplement ces lignes :

``` {.lang:default .decode:true}
[![build status](https://gitlab.com/[TEAM]/[PROJECT]/badges/master/build.svg)](https://gitlab.com/[TEAM]/[PROJECT]/commits/master)
```

 

Et voila le résultat

[![Badge
Gitlab](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-2-300x45.png){.wp-image-2684
.aligncenter width="1053"
height="158"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-2.png)

 

Pour plus d'infos
: <https://docs.gitlab.com/ee/user/project/pipelines/settings.html#test-coverage-parsing>

 

 

{% endraw %}
