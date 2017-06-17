---
layout: post
title: Fastlane, vers l'infini et l'au dela
excerpt: Nous allons découvrir un outil qui permet d'automatise des taches fastidieuse en mobile.
permalink: /fr/fastlane/
categories:
    - Ios
    - Swift
    - Xcode
tags:
    - Ios
    - Swift
    - Xcode
    - Tutorial
image:
  path: /assets/fastlane_logo.png
  height: 100
  width: 100
---

# Qu'est-ce que "Fastlane"

Fastlane est un outil open-source qui permet de faire du **Continuous Delivery** sous ios et android.
Il permet d'automatiser un certain nombre de tâches fastidieuses comme gèrer les sreenshots, les certificats, deployer votre app ...

Vous l'avez compris, cet outil va changer votre vie.

Voici la liste des outils à dispositions avec Fastlane :

<img src="../../img/fastlane/fastlane_tools.png" width="400" alt="Fastlane tools">

* **Deliver**: Télécharge des captures d'écran, des métadonnées et votre application sur l'App Store en utilisant une seule commande.
* **Snapshot**: Automatisez la prise des captures d'écran localisées de votre application iOS sur tous les périphériques.
* **Frameit**: Place rapidement vos captures d'écran dans les cadres appropriés (iphone, ipad...).
* **Pem**: Génére et renouvele automatiquement vos profils de notification push
* **Sigh**: Crée, renouvelle, télécharge et répare des profils de provisionnement
* **Produce**: Crée de nouvelles applications iOS sur le portail développeur Apple et iTunes Connect avec les informations minimales requises.
* **Cert**: Crée automatiquement et conserver des certificats de signature.
* **Scan**: Facilite l'exécution des tests de votre application iOS et Mac sur un simulateur ou un périphérique connecté.
* **Gym**: Build et package votre application.
* **Match**: Synchronise facilement vos certificats et provisioning profiles à travers votre équipe en utilisant Git.

Se rajoute également à cette liste:

* **Pilot**: Gére vos testeurs TestFlight et à partir de votre terminal
* **Boarding**: Permet la création d'une page d'inscription simple pour les testeurs bêta TestFlight

<img src="../../img/fastlane/fastlane-tree.png" width="400" alt="Fastlane tree">

Personellement, quand j'ai vue ce que Fastlane était capable de faire j'ai limite versé une petite larmichette !
Fini le temps de tout faire à la main !

*Note* : J'ai créer un projet "bidon" avec differents écrans, tests pour cette article.

# Premier pas

#### Installation

*Prérequis* : ruby >= 2.0

Je vous recommande de créer un `Gemfile` pour définir les éventuels dépendence de Fastlane.

```
source "https://rubygems.org"

gem "fastlane"
```

```
$ bundle install
```

#### Initialisation

Lance la commande suivante :

```
$ bundle exec fastlane init
```

On vous demandera votre Apple ID, mot de passe et dans mon cas un digit code via mon Iphone.
Fastlane vous récapitulera vos informations dans  `Summary for produce` et créer votre application dans Itunes Connect et Dev Center.
Il générera également une configuration pour vous, en fonction des informations fournies.

<img src="../../img/fastlane/fastline-files.png" width="400" alt="Fastlane files">

**Appfile**: L'Appfile stocke des informations utiles qui sont utilisées dans tous les outils Fastlane comme votre Apple ID ou le Bundle Identifier, pour déployer vos **lanes** (voies) plus rapidement et adaptées aux besoins de votre projet.

Par défaut, ce fichier ressemble à :

```
app_identifier "com.eleven.fastlane" # Bundle identifier de votre app
apple_id "obiwan@kenobi.com"  # Votre Apple adresse email
```

Si vous avez des identifiants différents pour Itunes Connect et l'Apple Developer. Vous pouvez utiliser le code suivant :

```
app_identifier "tools.fastlane.app"       # Bundle identifier de votre app

apple_dev_portal_id "portal@company.com"  # Votre Apple adresse email
itunes_connect_id "tunes@company.com"     # Votre Itunes Connect adresse email

team_id "Q2CBPJ58CA" # Le team ID du Developer Portal
itc_team_id "18742801" # Le team ID du iTunes Connect
```

Si vous souhaitez accéder à ces valeurs à partir de votre utilisation Fastfile :

```
identifier = CredentialsManager::AppfileConfig.try_fetch_value(:app_identifier)
team_id = CredentialsManager::AppfileConfig.try_fetch_value(:team_id)
```

**Fastfile**: Fichier ruby qui définit toutes vos lanes. Une lane est un ensemble d'instructions que vous souhaitez que Fastlane s'exécute.

``` ruby
# Fastfile - J'ai clean le fichier et j'ai créer une lane test
fastlane_version "2.39.2"

default_platform :ios

platform :ios do
  desc "Runs all the tests"
  lane :test do
    scan # outil Fastline qui lance vos tests.
  end
end
```

Si vous lancez un :
```
$ bundle exec fastlane test
```

Il lance alors tous les unit/ui tests de votre projet. Bien évidement Scan peut générer des rapports au format HTML, JSON et JUnit.

<img src="../../img/fastlane/cli-scan.png" width="900" alt="Cli scan">

Magique non ?

Nous allons partir du principe que je travail en collaboration avec pleins de dev mobile sur ma super application.
Le problème se pose au niveau des certificats et provisionning profiles.
Heureusement Fastline nous met à disposition **Match**.

# Match

Match implémente le concept de [codesigning.guide](https://codesigning.guide).
Il permet de créer tous vos certificats et provisioning profiles dans un compte Git distinct.
Chaque membre de l'équipe ayant accès au repo peut utiliser ces credentials pour la signature de code.
Match répare également automatiquement les credentials brisées et expirées.
Ceci est bien évidement [sécurisée](https://github.com/fastlane/fastlane/tree/master/match#is-this-secure).

*Note* : L'implémentation de match vous oblige à révoquer vos certificats existants.

Si vous ne voulez pas revoquer vos certificats existants, mais souhaitez toujours une configuration automatisée, cert et sigh sont la pour vous.

* **Cert** : Veillera à ce que vous ayez un certificat valide et sa clé privée installée sur la machine locale.
* **Sigh** : Veillera à ce que vous ayez un provisioning profile valide installé sur la machine locale, qui correspond au certificat installé.

#### Configuration

```
$ bundle exec fastlane match init
```

<img src="https://github.com/fastlane/fastlane/raw/master/match/assets/match_init.gif">

Cela vous demandera d'entrer l'url de votre repo Git. Vous pouvez aussi utiliser un lien git@ si votre machine peut se connecter en SSH sur ce repo.
Cette commande ne lit ou modifie pas les certificats ou profiles.

Cela va créer un fichier `Matchfile` qui ressemble à :

```
git_url "https://gitlab.com/prims47/fastlane_article.git"

type "development" # Le type par défaut, il peut être appstore, adhoc, enterprise ou development

# app_identifier ["tools.fastlane.app", "tools.fastlane.app2"]
# username "user@fastlane.tools" # Votre Apple Developer Portal username
```

Match prend également en charge le stockage des certificats de plusieurs équipes dans un repo, en utilisant des branches.
Si vous travaillez dans plusieurs équipes, assurez-vous de définir le paramètre git_branch à une valeur unique par équipe.
De là, la correspondance créera et utilisera automatiquement la branche spécifiée pour vous.

```
#Fastfile
match(git_branch: "team1", username: "user@team1.com")
match(git_branch: "team2", username: "user@team2.com")
```


Avant d'exécuter match pour la première fois, vous devriez envisager de supprimer vos profils et certificats existants à l'aide de la commande [match nuke](https://github.com/fastlane/fastlane/tree/master/match#nuke).

Executer match :

```
$ bundle exec fastlane match appstore
```

<img src="https://github.com/fastlane/fastlane/raw/master/match/assets/match_appstore_small.gif" />

Cela créera un nouveau certificat et un provisioning profile (si nécessaire) et les stockera dans votre repo Git.
Si vous avez précédemment exécuté match, il installera automatiquement les profils existants à partir du repo Git.

Les provisioning profile sont installés dans ~ / Library / MobileDevice / Provisioning Profiles alors que les certificats et les clés privées sont installés dans votre Keychain.

Comment faire si vous devez ajouter un nouveau device ? Non on va pas se connecter et le faire a la main !!!
On va utiliser l'action [register_devices](https://docs.fastlane.tools/actions/#register_devices) en combinaison avec match.

```ruby
lane :recette do
  register_devices(devices_file: "./devices.txt")
  match(type: "adhoc", force_for_new_devices: true)
end
```

```
#devices.txt
Device ID	Device Name
A123456789012345678901234567890123456789	NAME1
B123456789012345678901234567890123456789	NAME2
```

En utilisant le paramètre `force_for_new_devices`, match va checker si le nombre de device a changé depuis la dernière
execution. et regénère automatiquement le provisioning profile si nécessaire.

Vous pouvez utilisr aussi `force: true` pour regénéré le provisioning profil à chaque execution.

#### Paramétré Xcode

Avec Xcode 8 vous pouvez définir un provisioning profile pour chaque targets au lieu d'un provisioning profile UUID.
En faisant ça, Xcode selectionne automatiquement le dernier provisioning profile corresponddant à son nom.
De cette manière, vous n'aurez pas à mettre à jour Xcode a chaque fois que vous genererai un provisioning profile (ex: Quand vous ajoutez un nouveau device).

Vous pouvez spécifier quel provisioning profile utiliser dans `General` tab après avoir désactivé `Automatically manage signing`.

<img src="../../img/fastlane/fastlane_xcode_sign.png" width="600"/>

On vient de voir avec quel facilité on gère les certificats et provisioning profil. Maintenant on va s'attaquer au push notification profile.

# PEM

J'ai du créer quelque fois à la main la génération de certificat/pem/p12 pour les push notification. Et sans déconner, cette partie ma vite gonfler !!!

Pem est venu me sauve de cette tâche fastidieuse !

`pem` permet de :

* Créer un nouveau signing request
* Créer un certificat push
* Télécharge le certificat
* Génère le nouveau fichier `.pem` dans le dossier courrant.

`pem` ne permet pas de :
* Couvrir la partie upload sur votre serveur/service.
* Revoker vos certificat existant.
* Télécharger n'import quel certificat existant car la clé privée n'est disponible que sur la machine sur laquelle elle a été créée.

Si vous avez déjà activé un certificat push pendaunt au moins 30 jours, pem ne créera pas de nouveau certificat.
Si vous voulez quand même en créer un, vous pouvez utiliser l'option `force`

```ruby
#Fastfile
desc "Generate Push Certificate"
  lane :pushCertificat do
    #pem(new_profile: Proc.new do |value|
        # Code pour upload votre fichier pem sur votre serveur/service.
      #end)

    pem(generate_p12: true, save_private_key: true, p12_password: "1234",
    	pem_name: "fastlane_pem_file", output_path: "/Users/prims47/Desktop/blog/Fastlane/push_certificates", development: true
    )
end
```


```
$ bundle exec fastlane pushCertificat
```

<img src="../../img/fastlane/fastlane_pem.jpg" />

Et hop, un jeux d'enfant !

<img src="../../img/fastlane/fastlane_pem_apple.jpg" />

# Scan

Comme vous l'avez vu au début de l'article, `scan` permet de lancer tous les tests (sur simulateur ou device) de votre projet.
Dans le projet que je me suis créer, j'ai bien évidemment ajouter quelques tests afin de vous montrer ce qu'on peut faire.

Première chose à faire c'est d'initialiser le fichier `Scanfile` afin de configurer les paramètres par défaut :

```
$ bundle exec fastlane scan init
```


```
#Scanfile

#workspace "FastlaneArticle.xcodeproj"
scheme "FastlaneArticle"
clean true #Clean le projet
code_coverage true
#slack_only_on_failure true

#Vous pouvez specifier sur quel iphone,ipad vous souhaitez lancer les tests.
#devices [
#  "iPhone 6s",
#  "iPhone 7"
#]"]
```


Une bonne pratique c'est de notifier Slack lorsque les tests failed. J'ai donc rajouter dans mon fichier `Fastfile` la configuration Slack.

```ruby
#...

platform :ios do
  before_all do
    ENV["SLACK_URL"] = "https://hooks.slack.com/services/XXXXXX" # URL Webhook créer via Slack.
  end

  desc "Runs all the tests"
  lane :test do
    scan()
  end

  #...
end
```

<img src="../../img/fastlane/fastlane_scan_success.png" width="180"/>
<img src="../../img/fastlane/fastlane_scan_error.png" width="200"/>

# Snapshot - Frameit

Si vous devez manuellement créer 20 langues x 6 devices x 5 screenshots (car 5 écrans différents) = 600 screenshots.
On voit la quantité de travail énorme que demande les screenshots.
Les screenshots sont une partie importante car cela influence beaucoup l'utilisateur sur votre application.

Fastlane nous met à disposition deux outils géniaux, `snapshot` et `frameit`.

* **Snapshot** : Comme son nom l'indique, cela génère localement les screenshots pour différent device et langues.
On verra par la suite comment les uploader en utilisant `deliver`
* **Frameit** : Permet de mettre votre screenshot créer par `snapshot` dans un cadre de périphérique tel qu'un iphone, ipad.

Installation de `snapshot` :

```
$ bundle exec fastlane snapshot init
```

Cette commande va créer deux fichiers :

* `SnapshotHelper.swift` : Helper pour effectuer les screenshots
* `Snapfile` : Pour configurer `snapshot`

Il faut tout d'abord ajouter le fichier `SnapshotHelper.swift` à notre target d'UI Tests.
Puis dans notre classe d'ui test, dans la méthode `setUp`, il faut initialisé snapshot.

```swift
override func setUp() {
    super.setUp()
    // In UI tests it is usually best to stop immediately when a failure occurs.
    continueAfterFailure = false

    let app = XCUIApplication()
    setupSnapshot(app)
    app.launch()
}
```

Pour finir, dans chaque test il suffit de faire appel à la méthode `snapsot("Nom du screen")`.

```swift
func testCarList() {
    let app = XCUIApplication()

    //Take screenshot
    snapshot("01CarList")
}

func testCarDetail() {
    let app = XCUIApplication()

    app.collectionViews.cells.otherElements.containing(.image, identifier:"item5").children(matching: .other).element.tap()

    //Take screenshot
    snapshot("02CarDetail")
}
```


```
devices([
  "iPhone 5s",
  "iPhone 6",
  "iPhone 6 Plus",
  "iPhone 7",
  "iPhone 7 Plus"
])

# En anglais et en français
languages([
  "en-US",
  "fr-FR"
])

# Plaçons-les dans ./screenshots
output_directory "./screenshots"

# Et avant chaque exécution, on clean
clear_previous_screenshots true
```
