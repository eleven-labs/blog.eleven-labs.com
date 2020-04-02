---
layout: post
title: Comment (et pourquoi) j'ai créé ma propre extension navigateur
excerpt: Cet article va vous présenter une extension développée à la suite de l'identification d'un besoin récurrent, et vous expliquer comment procéder si vous souhaitez en faire de même !
authors:
    - aallier
lang: fr
permalink: /fr/extensions-navigateur/
categories:
    - javascript
tags:
    - javascript
    - firefox
    - webExtention
    - tools
---

Depuis le début de l’existence des navigateurs, il est possible de les customiser afin d’y ajouter des fonctionnalités. Cela se présentait d'abord presque exclusivement sous la forme de barres d’outils à l'utilité douteuse, pour plus tardivement proposer des extensions présentant un véritable gain pour l’utilisateur. On pourra citer pour les plus connues : µBlock, React Developper Tools, DownloadHelper... Certaines dans d'entre elles ont même été intégrées aux navigateurs.

![]({{ site.baseurl }}/assets/2020-03-30-extensions-navigateur/ie_bar.png)

Ces extensions sont aujourd’hui développées sur la base de Javascript, HTML et CSS. Ce qui rend facile leur accessibilité.
Tous les principaux navigateurs se sont accordés autour d’une seule et même API, à quelques légères différences près. Safari par contre continue à utiliser sa propre structure.

Je vais vous présenter une extension que j’ai développée à la suite de l'identification d'un besoin récurrent...
Dans beaucoup de projets les différents acteurs sont amenés à jongler entre plusieurs fronts et sur différents environnements. Par exemple pour développer une nouvelle fonctionnalité sur un environnement de développement, et débugger sur un environnement de preprod.
Bien souvent la différence entre les URLs est minime, je voulais donc ajouter un élément plus ostensible afin d’éviter les confusions. L’extension navigateur me paraissait la meilleure solution car elle n’interfère avec ni ne dépend du code ou de l’infrastructure, est facile à développer, à mettre à jour et à faire évoluer, il est aussi possible de rajouter des fonctionnalités si besoin.

Concrètement l’extension présentée permet de changer la couleur de la barre du navigateur en fonction de l’URL, à partir d’une configuration simple.

## Structure

Une extension est simplement un projet (js, html, css, ressources) zippé, avec comme extension ".xpi". La structure du projet n’a aucune importance, la seule restriction est d’avoir un fichier `manifest.json` à la racine pour définir le projet.

```
  manifest.json
  beackground.js
  resources/
    icon_32.png
  options/
    options.html
    options.cs
    options.js
```

## manifest.json
La définition de l’extension se fait grâce au fichier [manifest.json](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json) qui décrit entre autres les droits ainsi que les différents scripts et ressources utilisés.

Les clefs `manifest_version`, `name`, et `version` constituent le minimum requis.

La clef permissions permet de définir les droits requis par l’application. Il est obligatoire de les spécifier ici pour avoir accès aux différentes méthodes fournies par l’API.
```javascript
{
 "manifest_version": 2,
 "name": "colenv",
 "version": "0.2",
 "icons": {
    "32": "resources/icon_32.png"
  },
 "background": {
    "scripts": ["background.js"]
 },
"options_ui": {
   "page": "src/options/options.html"
 },
 "permissions": [
    "tabs",
    "storage",
    "theme",
    "<all_urls>"
 ]
}
```
## API
Dans tous les scripts nous avons accès à un objet window tout comme une page web standard mais aussi à l’objet browser qui permet l’accès à l’API du navigateur.
Pour beaucoup de fonctionnalités mises à disposition nous devons effectuer un ajout dans la partie permissions du manifest.
Cette API nous permet d’avoir accès aux fenêtres, onglets, téléchargement, historique, clipboard, passwords, requêtes, réponses et bien d’autres choses.

## background script
Le point d’entrée de notre extension est la clef `background` avec la sous-clef `scripts`. Elle permet de définir tous les scripts lancés au démarrage du navigateur.

Dans notre cas nous avons besoin d’avoir accès à l’objet [tabs](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/tabs) et plus précisément à l’événement [onUpdated](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/theme/onUpdated) (sans oublier de rajouter “tabs” dans les “permissions” du manifest sans quoi le navigateur nous en interdira l’accès).
```javascript
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.active && changeInfo && changeInfo.url) {
		console.log(`Nouvelle url ${tab.url} dans la fenêtre ${tab.windowId}`)
	}
});
```
Nous pouvons donc écouter chaque changement d’URL sur un onglet et effectuer une action spécifique.

Nous avons maintenant besoin de changer la couleur de l’onglet concerné, pour cela nous allons utiliser l’objet [theme](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/theme) supporté uniquement par firefox pour le moment.
Nous mettons à jour l’interface avec la fonction [update](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/theme/update) qui a besoin de l’id de la fenêtre récupéré précédemment, et d’un objet définissant la [structure de l’interface](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme), “toolbar_field” correspond à la barre url.
```javascript
browser.theme.update(windowId, {
	colors: {
   		toolbar_field: '#70FFF8'
	}
});
```

## Configuration
Nous allons maintenant utiliser la clef « options_ui » pour définir une page html servant pour l’utilisateur à paramétrer l’extension.
À ce moment-là, le développement est identique à n’importe quel développement web HTML, CSS ou Javascript, bien que nous ayons toujours accès à l’objet browser.
D’ailleurs nous en avons besoin pour sauvegarder les modifications faites par l’utilisateur grâce à [browser.storage](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/storage) qui n’est que le localStorage dans le contexte navigateur.
On peut donc utiliser browser.storage.set pour écrire et browser.strorage.get pour lire. (browser.storage.sync utilise la synchronisation entre appareils)

```javascript
browser.storage.sync.set({
    environment: {
      regExp: document.getElementById('regExp').value,
      color: document.getElementById('color').value
    }
  });
```
On poura éditer cette configuation dans les propriétés de l'extension dans `about:addons`

![]({{ site.baseurl }}/assets/2020-03-30-extensions-navigateur/web_extension_config.png)

## Installation
Pour installer temporairement son extension il suffit d’ouvrir dans Firefox `about:debugging` et de cliquer sur « Charger un module complémentaire temporaire… » et de sélectionner son fichier manifest.json. Cela nous permet aussi de pouvoir la débuguer.
Afin de créer son package .xpi, il faudra passer par la [validation de Mozilla](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/) qui contrôlera la validité du code et signera l’extension. Elle pourra ensuite être distribuée ou même ajoutée dans le store.

![]({{ site.baseurl }}/assets/2020-03-30-extensions-navigateur/web_extension.png)

## La suite
Il reste beaucoup à améliorer :

- La compatibilité avec les autres navigateurs en gérant les [différences de l’API](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/construction_extension_cross_browser). Sur chrome l’objet browser se nomme chrome par exemple.
Mais surtout, il n’y a que Mozilla qui supporte l’API thème, il faudra trouver une astuce comme ajouter un bandeau directement dans la page concernée.

- Pouvoir partager une configuration à partir d’une URL en tenant compte des problèmes de synchronisation que cela entraîne. Il serait intéressant de pouvoir avoir une gestion centralisée de l’extension pour avoir la même configuration pour une équipe.

- Ajouter un raccourci pour ajouter l’URL courante à la configuration.

## Conclusion
Il suffit d'une bonne idée, d'un peu de javascript et d'une pincée de HTML pour créer assez rapidement une extension permettant de nous aider dans notre quotidien.

##  Ressources
[Colenv github](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions)

[Colenv branch blog](https://github.com/Ghau/colenv/tree/blog)

[Colenv V0.2](https://github.com/Ghau/colenv/releases/download/V0.2/colenv-0.2-fx-signed.xpi)

[MDN WebExtention](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions)

[Normalisation](https://browserext.github.io/browserext)

[Chrome extention](https://developer.chrome.com/extensions)

[Safari app extensions](https://developer.apple.com/documentation/safariservices/safari_app_extensions)

