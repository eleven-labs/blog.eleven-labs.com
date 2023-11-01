---
contentType: tutorial-step
tutorial: gitlab-ci-js
slug: introduction
title: Introduction
---
Dans ce tutoriel nous allons voir comment mettre en place un CI/CD avec Gitlab.

Si vous voulez en savoir plus sur gitlab CI/CD j'ai aussi écrit un article sur le blog Eleven Labs [CI/CD avec Gitlab-ci]({BASE_URL}/fr/introduction-gitlab-ci/)

Vous pouvez retrouver toute la documentation sur le site officiel de gitlab :
- [GitLab Continuous Integration (GitLab CI/CD)](https://docs.gitlab.com/ee/ci/README.html)
- [Getting started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/README.html)
- [Configuration of your jobs with .gitlab-ci.yml](https://docs.gitlab.com/ee/ci/yaml/README.html)
- [GitLab Runner](https://docs.gitlab.com/runner/)

## Le programme du tutoriel

Alors dans ce tuto nous allons mettre en place une CI/CD pour une application Vue.js avec GitLab-ci.

Voici les étapes du tuto :
 - Conception et préparation de l'environnement applicatif
 - Initialisation de la CI/CD et préparation de notre application pour notre CI/CD
 - Mise en place des phases de code style et de test
 - Déploiement de notre application sur Google Cloud PLatform
 - Test et conclusion

## Pré-requis

Pour pouvoir faire ce tuto je vous conseille d'avoir d'installé node version 8 avec yarn.

- Installation de node 8 :
```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```

- Installation de yarn
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

yarn --version
```

Il faut aussi :
 - un compte [google avec Google Clould Plateform](https://accounts.google.com/signup/v2/webcreateaccount?service=cloudconsole&continue=https%3A%2F%2Fconsole.cloud.google.com%2F&flowName=GlifWebSignIn&flowEntry=SignUp&nogm=true)
 - un compte [gitlab.com](https://gitlab.com/users/sign_in#register-pane) minimun