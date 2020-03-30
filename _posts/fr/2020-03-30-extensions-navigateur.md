---
layout: post
title: Extensions navigateur
excerpt: Dans cet article, nous allons voir comment fonctionne une extension navigateur
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

Depuis presque le début de l’existence des navigateurs, il a été possible de les customiser afin d’y ajouter des fonctionnalités. Premièrement presque exclusivement sous la forme de barre d’outils avec une douteuse utilité ensuite en apportant un véritable gain pour l’utilisateur. On pourra citer pour les plus connues µBlock, react developper tools, downloadHelper, certaines extensions ont même été intégrer aux navigateurs.

![]({{ site.baseurl }}/assets/2020-03-30-extensions-navigateur/ie_bar.png)

Ces extensions sont aujourd’hui développées sur la base de javascript, html et css ce qui rends facile son accessibilité.
Tous les principaux navigateurs se sont accordés autour d’une seule et même API  avec quelques légères différences près, Safari par contre continue à utiliser sa propre structure.

Je vais vous présenter une extension que j’ai développé à la suite d’un besoin récurrent rencontré dans plusieurs projets.
Dans beaucoup de projets les différents acteurs sont amenés à jongler entre plusieurs front et sur différents environnements, par exemple pour développer une nouvelle fonctionnalité sur un environnement de développement et débugger sur un environnement de preprod.
Bien souvent la différence entre les URL est minime, je voulais donc ajouter un élément plus visible afin d’éviter de les confondre. L’extension navigateur me paraissait la meilleure possibilité car elle n’interfère ni ne dépend du code ou de l’infrastructure, facile à développer, mettre à jour et à faire évolué, il possible de rajouter de fonctionnalité si besoin.

Concrètement l’extension présenté permet de changer la couleur de la barre du navigateur en fonction de l’URL à partir d’une configuration simple.

## Structure

Une extension est simplement un projet (js, html, css, ressources) zipper avec comme extension .xpi. La structure du projet n’a aucune importance, la seule restriction est d’avoir un fichier `manifest.json` à la racine pour définir le projet.

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
La définition de l’extension se fait grâce au fichier [manifest.json](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json) qui décrit entre autre les droits ainsi que les différents scripts et ressources utilisés.

Les clefs `manifest_version`, `name`, et `version` sont le minimum requis.

La clef permissions permet de définir les droits requis par l’application, il est obligatoire de les spécifier ici pour avoir accès aux différentes méthodes fournis par l’api.
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
Pour beaucoup de fonctionnalité mis à disposition nous devons aussi les ajouter dans la partie permissions du manifest.
Cette API nous permet d’avoir accès aux fenêtres, onglets, téléchargement, historique, clipboard, passwords, requêtes, réponses et bien d’autres choses.

## background script
Le point d’entrée de notre extension est la clef `background` avec la sous clef `scripts`, elle permet de définir tous les scripts lancés au démarrage du navigateur.

Dans notre cas nous avons besoin d’avoir accès à l’objet [tabs](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/tabs) et plus précisément à l’événement [onUpdated](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/theme/onUpdated) (sans oublier de rajouter “tabs” dans les “permissions” du manifest  sans quoi sans quoi le navigateur nous en interdira l’accès).
```javascript
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.active && changeInfo && changeInfo.url) {
		console.log(`Nouvelle url ${tab.url} dans la fenêtre ${tab.windowId}`)
	}
});
```
Nous pouvons donc écouter chaque changement d’url sur un onglet et effectuer une action spécifique.

Nous avons maintenant besoin de changer la couleur de l’onglet concerné, pour ça nous allons utiliser l’objet [theme](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/theme) supporté uniquement par firefox pour le moment.
Nous mettons à jour l’interface avec la fonction [update](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/theme/update) qui a besoin de l’id de la fenêtre récupéré précédemment et d’un objet définissant la [structure de l’interface](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme), “toolbar_field” correspond à la barre url.
```javascript
browser.theme.update(windowId, {
	colors: {
   		toolbar_field: '#70FFF8'
	}
});
```

## Configuration
Nous allons maintenant utilisé la clef « options_ui » pour définir une page html servant pour l’utilisateur à paramétrer l’extension.
A ce moment là le développement est identique a n’importe quelle développement web html,css et javascript bien que nous ayons toujours accès a l’objet browser.
D’ailleurs nous en avons besoin pour sauvegarder les modifications faites par l’utilisateur grâce à [browser.storage](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/API/storage) qui n’est que le localStorage dans le contexte navigateur.
On peut donc utiliser browser.storage.set pour écrire et browser.strorage.get pour lire. (browser.storage.sync utilise la synchronisation entre appareil)

```javascript
browser.storage.sync.set({
    environment: {
      regExp: document.getElementById('regExp').value,
      color: document.getElementById('color').value
    }
  });
```
On poura éditer cette configuation dans les propriété de l'extension dans `about:addons`

![]({{ site.baseurl }}/assets/2020-03-30-extensions-navigateur/web_extension_config.png)

## Installation
Pour installer temporairement son extension il suffit d’ouvrir dans Firefox `about:debugging` et de clicker sur « Charger un module complémentaire temporaire… » et de sélectionner son fichier manifest.json. Cela nous permet aussi d e pouvoir la debbuger.
Afin de crée son package .xpi, il faudra passer par la [validation de Mozilla](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/) qui contrôlera la validité du code et signera l’extension. Elle pourra ensuite être distribuer ou mémé ajouté dans le store.

![]({{ site.baseurl }}/assets/2020-03-30-extensions-navigateur/web_extension.png)

## La suite
Il reste beaucoup à améliorer

- La compatibilité avec les autres navigateurs en gérant les [différences de l’API](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/construction_extension_cross_browser), sur chrome l’objet browser se nomme chrome par exemple.
mais surtout il n’y a que Mozilla qui supporte l’API thème, il faudra trouver une astuce comme ajouter un bandeau directement dans la page concernée.

- Pouvoir partagé une configuration à partir d’une URL en tenant compte des problèmes de synchronisation que cela entraîne, il serait intéressant de pouvoir avoir une gestion centralisé de l’extension pour avoir la même configuration pour une équipe.

- Ajouter un raccourci pour ajouter l’url courante à la configuration.

##  Resources
[Colenv github](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions)

[Colenv branch blog](https://github.com/Ghau/colenv/tree/blog)

[Colenv V0.2](https://github.com/Ghau/colenv/releases/download/V0.2/colenv-0.2-fx-signed.xpi)

[MDN WebExtention](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions)

[Normalisation](https://browserext.github.io/browserext)

[Chrome extention](https://developer.chrome.com/extensions)

[Safari app extensions](https://developer.apple.com/documentation/safariservices/safari_app_extensions)

