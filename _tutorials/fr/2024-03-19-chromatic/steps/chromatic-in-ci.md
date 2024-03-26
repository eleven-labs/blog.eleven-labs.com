---
contentType: tutorial-step
tutorial: chromatic
slug: chromatic-in-ci
title: Utilisation de Chromatic en CI
---

## Utilisation de Chromatic en CI

Nous allons commencer par **initialiser notre projet** et faire un premier commit.

Utilisez les commandes suivantes pour créer **un premier commit** sur une branche principale appelée `main`&nbsp;:

```bash
git init
git add .
git commit -m "init commit"
git branch -M main
```

Ensuite nous allons **créer un repo sur Github** et y envoyer notre premier commit. Rendez vous sur cette page [https://github.com/new](https://github.com/new) puis créez un repo "chromatic-tuto-elevenlabs". Puis sur votre terminal lancez ces commandes (les commandes sont aussi indiquées préremplies sur Github).

```bash
git remote add origin https://github.com/<votre username>/<nom sur repo>.git
git push -u origin main
```

Votre premier commit est maintenant sur Github&nbsp;! Nous allons maintenant passer au moment que vous attendez tous&nbsp;: **installer Chromatic**&nbsp;!

Nous allons installer Chromatic en devDependency&nbsp;:

```bash
npm install -D chromatic
```

Ensuite connectez-vous à Chromatic avec votre compte GitHub&nbsp;: [https://www.chromatic.com/start](https://www.chromatic.com/start)
Choisissez l’option `Choose from GitHub`, choisissez le repo que nous utilisons pour ce tuto puis récupérez et utilisez la ligne de commande sous "Publish your Storybook", elle va nous permettre de **faire le lien entre le projet et Chromatic**.

A la fin du processus vous trouverez un lien qui vous donnera accès à une **version publiée** de votre Storybook. Pas mal, non&nbsp;?

C’est très bien mais nous ce qu’on veut c’est utiliser Chromatic&nbsp;! Il nous reste une dernière étape avant de rentrer dans le vif du sujet&nbsp;: **créer une Github Action**&nbsp;!

Tout d’abord on a besoin de **créer un secret** sur Github. Créez le secret `CHROMATIC_PROJECT_TOKEN` qui contient le token, que vous avez récupéré précédemment. Pour créer un secret vous pouvez suivre [cette documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

Retournez sur votre IDE, créez un dossier `.github/workflows` puis un fichier `chromatic.yml` et collez-y ce template (qu'on peut retrouver [ici](https://www.chromatic.com/docs/github-actions/))&nbsp;:

```yml
# .github/workflows/chromatic.yml

name: "Chromatic"

on: push

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install dependencies
        run: yarn install --immutable --immutable-cache --check-cache

      - name: Publish to Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

Créez un commit et poussez le sur le repo&nbsp;:

```bash
git add .
git commit -m "GitHub action setup"
git push origin main
```

Vous pouvez trouver le build dans la pipeline après le push.

Nous allons maintenant voir **comment fonctionne Chromatic**&nbsp;!
