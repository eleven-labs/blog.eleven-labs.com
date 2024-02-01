---
contentType: tutorial-step
tutorial: gitlab-ci-js
slug: test-et-conclusion
title: Test et conclusion
---
## Test et conclusion

Voilà nous arrivons au terme de ce tutoriel.

je vous ai présenté comment mettre en place une CI/CD avec Gitlab et Google Cloud Platform.

Avant de conclure ce tutoriel je vais vous montrer quelques résultats de tests que j'ai effectués.

### Test

Lors de mes phases de tests j'ai arrêté quelques déploiements en `demo` suite à un push de la pipeline de déploiement en `production`.
Vous pouvez voir sur la capture d'écran ci-desous les différences de version.

![Workflow gitlab-ci app js]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-version-app-demo-vs-prod.png)

Je ne vous ai pas montré le résultat d'une pipeline suite à un `tag` donc voici ce que ça donne :

![résultat CI/CD déploiement production]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-deploy-production.png)

Et voici une vue d'ensemble d'un déploiement sur `demo` et `production` :

![résultat CI/CD déploiement demo et production]({BASE_URL}/imgs/tutorials/2018-09-19-gitlab-ci-js/screenshot-cis-demo-production.png)

Nous pouvons très clairement voir que suite à un merge (ici ce fut un push de correction) la pipeline de deploiement en `demo` est exécuté.
Puis j'ai créé un nouveau tag "v0.0.28" ce qui a déclenché la pipeline de depliement en `production`.
Suite a ce tag les branches se sont mises à jour et la pipeline de deploiement en `demo` s'est déclenchée avec comme nom de commit `NEW VERSION - v0.0.28`

### Conclusion

Les étapes de build, de lint et de test restent très simples à mettre en place mais ça se complique lors du déploiement car il y a plus de choses à prendre en compte.
De plus, dans ce tutoriel je n'ai pas eu envie de faire les choses simplement avec des mises à jour de branche dans la pipeline.

Je vous ai montré un exemple mais il existe des milliers de possibilités de configuration. Cela ne dépend que de vous et de votre projet.

Peut-être l'aurez-vous remarqué, mais gitlab peut être quelque fois lent ou présenter des bugs. Pour des petits projets ce n'est pas forcément dérangeant.

J'éspère que ce tutoriel vous a été utile et vous a donné envie de mettre une CI/CD dans vos projet pour les rendre plus Agiles avec le mouvement DevOps.
