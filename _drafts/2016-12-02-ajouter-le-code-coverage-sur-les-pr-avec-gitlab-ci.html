---
layout: post
title: Ajouter le code coverage sur les MR avec Gitlab-CI
author: rjardinet
date: '2016-12-02 12:15:55 +0100'
date_gmt: '2016-12-02 11:15:55 +0100'
categories:
- Non classé
tags:
- test
- gitlab
- code-coverage
- gitlab-ci
---
{% raw %}
<p>Voici un tip qui permet de pouvoir voir en un clin d’œil les répercussions d'une MR sur la couverture de code de votre projet.</p>
<p><!--more--></p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre.png"><img class=" wp-image-2663 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-300x83.png" alt="Gitlab ci - code coverage" width="1074" height="297" /></a></p>
<p>&nbsp;</p>
<p>Dans un premier temps, nous allons modifier notre .gitlab-ci.yml</p>
<p>&nbsp;</p>
<pre class="lang:yaml decode:true ">before_script:
  - composer install

stages:
  - test

test:
  script:
  - vendor/phpunit/phpunit/phpunit -c app --coverage-text --colors=never</pre>
<p>&nbsp;</p>
<p>La modification de notre pipeline porte sur les configs de phpunit en ajoutant <span class="lang:yaml decode:true crayon-inline ">--coverage-text --colors=never</span>  afin d'avoir dans les logs du pipeline les résultats du code-coverage.</p>
<p>&nbsp;</p>
<p>Puis dans l'interface de réglages du pipeline, nous allons configurer la regex afin de récupérer la couverture de code du commit.</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-1.png"><img class=" wp-image-2672 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-1-300x137.png" alt="Code coverage gitlab-ci" width="1056" height="482" /></a></p>
<p>Là, gitlab est plutot sympa et nous donne déjà plusieurs regex toutes prêtes en fonction du langage du projet. Dans mon cas c'est du PHP donc la config sera <span class="lang:default decode:true crayon-inline  ">^\s*Lines:\s*\d+.\d+\%</span></p>
<p>Et voila !!!</p>
<p>&nbsp;</p>
<p>Petit bonus, pour avoir le badge avec le code coverage sur le README, ajouter simplement ces lignes :</p>
<pre class="lang:default decode:true ">[![build status](https://gitlab.com/[TEAM]/[PROJECT]/badges/master/build.svg)](https://gitlab.com/[TEAM]/[PROJECT]/commits/master)</pre>
<p>&nbsp;</p>
<p>Et voila le résultat</p>
<p><a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-2.png"><img class=" wp-image-2684 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/Sans-titre-2-300x45.png" alt="Badge Gitlab" width="1053" height="158" /></a></p>
<p>&nbsp;</p>
<p>Pour plus d'infos : <a href="https://docs.gitlab.com/ee/user/project/pipelines/settings.html#test-coverage-parsing">https://docs.gitlab.com/ee/user/project/pipelines/settings.html#test-coverage-parsing</a></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
{% endraw %}
