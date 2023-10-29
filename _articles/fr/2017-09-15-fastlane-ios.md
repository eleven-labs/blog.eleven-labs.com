---
contentType: article
lang: fr
date: '2017-09-15'
slug: mise-en-place-d-un-workflow-cd-avec-fastlane-pour-ios-ou-android
title: >-
  Mise en place d'un Workflow Continuous Delivery avec Fastlane pour IOS ou
  Android
excerpt: >-
  Nous allons découvrir un outil qui permet d'automatiser des tâches
  fastidieuses en mobile.
cover: /assets/2017-07-17-fastlane-ios/cover.jpg
categories: []
authors:
  - ibenichou
keywords:
  - ios
  - swift
  - xcode
  - tutorial
  - ci
  - fastlane
---

# Qu'est-ce que "Fastlane"

Fastlane est un outil open-source qui permet de faire du **Continuous Delivery** sous IOS et Android.
Il permet d'automatiser un certain nombre de tâches fastidieuses comme gérer les sreenshots, les certificats, déployer votre app...

Vous l'avez compris, cet outil va changer votre vie.

Voici la liste des libs à disposition avec Fastlane :

![Fastlane tools]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_tools.png)

* **Deliver**: Télécharge des captures d'écran, des métadonnées et votre application sur l'App Store en utilisant une seule commande.
* **Snapshot**: Automatise la prise des captures d'écran localisées de votre application iOS sur tous les périphériques.
* **Frameit**: Place rapidement vos captures d'écran dans les cadres appropriés (iphone, ipad...).
* **Pem**: Génére et renouvèle automatiquement vos profils de notification push.
* **Sigh**: Crée, renouvèle, télécharge et répare des profils de provisionnement.
* **Produce**: Crée de nouvelles applications iOS sur le portail développeur Apple et iTunes Connect avec les informations minimales requises.
* **Cert**: Crée automatiquement et conserve des certificats de signature.
* **Scan**: Facilite l'exécution des tests de votre application iOS et Mac sur un simulateur ou un périphérique connecté.
* **Gym**: Build et package votre application.
* **Match**: Synchronise facilement vos certificats et profils de provisionnement à travers votre équipe en utilisant Git.

Se rajoute également à cette liste :

* **Pilot**: Gère vos testeurs TestFlight à partir de votre terminal
* **Boarding**: Permet la création d'une page d'inscription simple pour les testeurs bêta TestFlight

*Schéma de lanes fastlane*

![Fastlane tree]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane-tree.png)

Personnellement, quand j'ai vu ce que Fastlane était capable de faire j'ai limite versé une petite larmichette !
Fini le temps de tout faire à la main !

*Note* : J'ai créé un projet "bidon" avec différents écrans et tests pour cet article.

# Premiers pas

#### Installation

*Prérequis* : ruby >= 2.0

Je vous recommande de créer un `Gemfile` pour définir les éventuelles dépendances de Fastlane.

```
source "https://rubygems.org"

gem "fastlane"
```

```
$ bundle install
```

#### Initialisation

Lancer la commande suivante :

```
$ bundle exec fastlane init
```

On vous demandera votre Apple ID, mot de passe et dans mon cas un digit code via mon Iphone.
Fastlane vous récapitulera vos informations dans  `Summary for produce` et créera votre application dans Itunes Connect et Dev Center.
Il générera également une configuration pour vous, en fonction des informations fournies.

![Fastlane files]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastline-files.png)

**Appfile**: L'Appfile stocke des informations utiles qui sont utilisées dans toutes les libs Fastlane comme votre Apple ID ou le Bundle Identifier, pour déployer vos **lanes** (voies) plus rapidement, adaptées aux besoins de votre projet.

Par défaut, ce fichier ressemble à :

```
app_identifier "com.eleven.fastlane" # Bundle identifier de votre app
apple_id "obiwan@kenobi.com"  # Votre Apple adresse email
```

Si vous avez des identifiants différents pour Itunes Connect et Apple Developer, vous pouvez utiliser le code suivant :

```
app_identifier "tools.fastlane.app"       # Bundle identifier de votre app

apple_dev_portal_id "portal@company.com"  # Votre Apple adresse email
itunes_connect_id "tunes@company.com"     # Votre Itunes Connect adresse email

team_id "Q2CBPJ58CA" # Le team ID du Developer Portal
itc_team_id "18742801" # Le team ID du iTunes Connect
```

Si vous souhaitez accéder à ces valeurs :

```
identifier = CredentialsManager::AppfileConfig.try_fetch_value(:app_identifier)
team_id = CredentialsManager::AppfileConfig.try_fetch_value(:team_id)
```

**Fastfile**: Fichier ruby qui définit toutes vos lanes. Une lane est un ensemble d'instructions que vous souhaitez faire éxécuter par Fastlane.

``` ruby
# Fastfile - J'ai clean le fichier et j'ai créé une lane test
fastlane_version "2.39.2"

default_platform :ios

platform :ios do
  desc "Runs all the tests"
  lane :test do
    scan # lib Fastlane qui lance vos tests.
  end
end
```

Si vous lancez un :
```
$ bundle exec fastlane test
```

Il lance alors tous les unit/ui tests de votre projet. Bien évidemment, Scan peut générer des rapports au format HTML, JSON et JUnit.

![CLI scan]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/cli-scan.png)

Magique non ?

Nous allons partir du principe que je travaille en collaboration avec pleins de devs mobile sur ma super application.
Le problème se pose au niveau des certificats et profils de provisionnement.
Heureusement Fastlane nous met à disposition **Match**.

# Match

Match implémente le concept de [codesigning guide](https://codesigning.guide).
Il permet de créer tous vos certificats et profils de provisionnement dans un compte Git distinct.
Chaque membre de l'équipe ayant accès au repo peut utiliser ces credentials pour la signature de code.

Match répare également automatiquement les credentials brisés et expirés.
Ceci est bien évidement [sécurisé](https://github.com/fastlane/fastlane/tree/master/match#is-this-secure).

*Note* : L'implémentation de match vous oblige à révoquer vos certificats existants.

Si vous ne voulez pas révoquer vos certificats existants, mais souhaitez toujours une configuration automatisée, cert et sigh sont là pour vous.

* **Cert** : Veillera à ce que vous ayez un certificat valide et sa clé privée installée sur votre machine.
* **Sigh** : Veillera à ce que vous ayez un provisioning profile valide installé sur votre machine, qui correspond au certificat installé.

#### Configuration

```
$ bundle exec fastlane match init
```

![](https://github.com/fastlane/fastlane/raw/master/match/assets/match_init.gif)

Cela vous demandera d'entrer l'url de votre repo Git. Vous pouvez aussi utiliser un lien git@ si votre machine peut se connecter en SSH sur ce repo.

*Note* : Cette commande ne lit ou modifie pas les certificats ou profils.

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

Exécuter match :

```
$ bundle exec fastlane match appstore
```

![](https://github.com/fastlane/fastlane/raw/master/match/assets/match_appstore_small.gif)

Cela créera un nouveau certificat et un profil de provisionnement (si nécessaire) et les stockera dans votre repo Git.
Si vous avez précédemment exécuté match, il installera automatiquement les profils existants à partir du repo Git.

Les provisioning profiles sont installés dans ~ / Library / MobileDevice / Provisioning Profiles alors que les certificats et les clés privées sont installés dans votre Keychain.

**Comment faire si vous devez ajouter un nouveau device ?**

Non on ne va pas se connecter et le faire à la main !
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

En utilisant le paramètre `force_for_new_devices`, match va checker si le nombre de devices a changé depuis la dernière
exécution et regénère automatiquement le profil de provisionnement si nécessaire.

Vous pouvez utiliser aussi `force: true` pour générer le profil de provisionnement à chaque exécution.

#### Paramétrer Xcode

Avec Xcode 8 vous pouvez définir un profil de provisionnement pour chaque target au lieu d'un provisioning profile UUID.
En faisant ça, Xcode sélectionne automatiquement le dernier provisioning profile corresponddant à son nom.
De cette manière, vous n'aurez pas à mettre à jour Xcode à chaque fois que vous générez un profil de provisionnement (ex: Quand vous ajoutez un nouveau device).

Vous pouvez spécifier quel profil de provisionnement utiliser dans `General` tab après avoir désactivé `Automatically manage signing`.

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_xcode_sign.png)

On vient de voir avec quelle facilité on gère les certificats et profils de provisionnement. Maintenant on va s'attaquer au push notification profile.

# PEM

Si vous avez lu mon précédent article [Envoyer des push notifications via Amazon SNS en Swift 3](/fr/envoyer-push-notifications-amazon-sns-swift-3/), vous avez vite compris que c'était super "galère" de faire ceci à la main.

Mais ça c'était avant !

Pem est venu me sauver de cette tâche fastidieuse !

`pem` permet de :

* Créer un nouveau signing request
* Créer un certificat push
* Télécharger le certificat
* Générer le nouveau fichier `.pem` dans le dossier courrant.

`pem` ne permet pas de :
* Couvrir la partie upload sur votre serveur/service.
* Révoquer vos certificat existants.
* Télécharger n'importe quel certificat existant car la clé privée n'est disponible que sur la machine sur laquelle elle a été créée.

Si vous avez déjà activé un certificat push pendant au moins 30 jours, pem ne créera pas de nouveau certificat.
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

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_pem.jpg)

Et hop, un jeu d'enfant !

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_pem_apple.jpg)

# Scan

Comme vous l'avez vu au début de l'article, `scan` permet de lancer tous les tests (sur simulateur ou device) de votre projet.
Dans le projet que je me suis créé, j'ai bien évidemment ajouté quelques tests afin de vous montrer ce qu'on peut faire.

Première chose à faire c'est d'initialiser le fichier `Scanfile` afin de configurer les paramètres par défaut :

```
$ bundle exec fastlane scan init
```


```
#Scanfile

#workspace "FastlaneArticle.xcodeproj"
scheme "FastlaneArticle"
clean true #Clean le projet à chaque execution
code_coverage true
#slack_only_on_failure true

#Vous pouvez spécifier sur quel iphone ou ipad vous souhaitez lancer les tests.
#devices [
#  "iPhone 6s",
#  "iPhone 7"
#]"]
```


Une bonne pratique est de notifier Slack lorsque les tests sont failed. J'ai donc ajouté dans mon fichier `Fastfile` la configuration Slack :

```ruby
#...

platform :ios do
  before_all do
    ENV["SLACK_URL"] = "https://hooks.slack.com/services/XXXXXX" # URL Webhook créé via Slack.
  end

  desc "Runs all the tests"
  lane :test do
    scan()
  end

  #...
end
```

*Résultat sur Slack*

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_scan_success.png)
![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_scan_error.png)

# Snapshot - Frameit

Si vous devez manuellement créer des screenshots pour 20 langues x 6 devices x 5 screenshots (car 5 écrans différents) = 600 screenshots. On voit tout de suite la quantité de travail énorme que demandent les screenshots.

Les screenshots sont une partie importante car cela influence beaucoup l'utilisateur sur votre application.

Fastlane nous met à disposition deux librairies géniales, `snapshot` et `frameit`.

* **Snapshot** : Comme son nom l'indique, cela génère localement les screenshots pour différents devices et langues.
On verra par la suite comment les uploader en utilisant `deliver`
* **Frameit** : Permet de mettre votre screenshot créé par `snapshot` dans un cadre de périphérique tel qu'un iphone, ipad.

### Snapshot

Installation de `snapshot` :

```
$ bundle exec fastlane snapshot init
```

Cette commande va créer deux fichiers :

* `SnapshotHelper.swift` : Helper pour effectuer les screenshots
* `Snapfile` : Pour configurer `snapshot`

Il faut tout d'abord ajouter le fichier `SnapshotHelper.swift` à notre target d'UI Tests.
Puis dans notre classe d'ui test, dans la méthode `setUp`, il faut initialiser snapshot.

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

Dans chaque test il faut faire appel à la méthode `snapsot("Nom du screen")`.

```swift
func testCarList() {
    let app = XCUIApplication()

    //Take screenshot
    snapshot("01CarList")
}

func testCarDetail() {
        let app = XCUIApplication()
        app.collectionViews.cells.otherElements.containing(.staticText, identifier:"Dodge").children(matching: .other).element.forceTap()

        //Take screenshot
        snapshot("02CarDetail")
    }
```

**Attention !**

Pour une raison étrange sur certain devices (dans mon cas iphone 5) avec certaines langues le ``tap()``ne marche pas.
Il faut créer une méthode qui va forcer celui-ci.

```swift
extension XCUIElement {
    func forceTap() {
        if self.isHittable {
            self.tap()
        }

        let coordinate: XCUICoordinate = self.coordinate(withNormalizedOffset:  CGVector(dx:0.0, dy:0.0))
        coordinate.tap()
    }
}
```

Configuration de votre `Snapfile`

```
# Snapfile

# Liste des devices sur lesquels je souhaite avoir des screenshots
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

scheme "FastlaneArticle"

# Super important sinon vous allez avoir une erreur
project "../FastlaneArticle.xcodeproj"

# Plaçons-les dans ./screenshots
output_directory "./screenshots"

# Et avant chaque exécution, on clean
clear_previous_screenshots true
```

Lancer la commande

```shell
$ bundle exec fastlane snapshot
```

Bon c'est le moment d'aller prendre un café ou de manger une pomme ! (Oui les pommes c'est la vie ! :) )

15 minutes plus tard...

Fastlane vous crée une page HTML récapitulant tous les devices par langues.

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_snapshot_success.png)
![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/fastlane_snapshot.png)

Cool non ?

Vous pouvez fournir des arguments supplémentaires à votre application lors du lancement.
En effet, vous pouvez ajouter des valeurs à votre `UserDefaults.standard`

```
launch_arguments([
  "-firstName Hatem -lastName Ben Arfa"
])
```

```swift
name.text = UserDefaults.standard.string(forKey: "firstName")
// name.text = "Hatem"
```

Fastlane inclut `FASTLANE_SNAPSHOT`, qui permet de définir temporairement un `UserDefaults.standard`.
Vous pouvez l'utiliser pour détecter quand l'application est exécutée par Snapshot.

```swift
if UserDefaults.standard.bool(forKey: "FASTLANE_SNAPSHOT") {
    // Check si vous utilisez le mode snapshot
}
```

Bon, maintenant qu'on a nos beaux screenshots, on va rajouter de beaux cadres non ? Allez c'est parti.

### Frameit

*Prérequis*

Pour utiliser `Frameit`, il faut avoir sur votre machine [ImageMagick](https://www.imagemagick.org/script/index.php).

Sur mac, il suffit de faire :

```shell
$ brew install imagemagick
```

Vous pouvez dès à présent essayer ce petit bijou via :

```shell
# Executer cette command dans votre dossier ou ce situe les screenshots.
$ bundle exec fastlane frameit
```

Vous avez normalement de nouvelles images qui sont arrivées telles que :

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/iPhone6Plus-02CarDetail-d41d8cd98f00b204e9800998ecf8427e_framed.png)

Et si vous avez envie d'avoir l'iphone rose on fait comment ?

```shell
# Tout d'abord, mettez à jour votre liste de frames
$ bundle exec fastlane frameit download_frames

$ bundle exec fastlane frameit rose_gold
```

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/iPhone6-01CarList-d41d8cd98f00b204e9800998ecf8427e_framed.png)

Vous trouverez la liste des frames [ici](https://github.com/fastlane/frameit-frames/tree/gh-pages/latest).

Bon, c'est pas mal mais on peut encore faire mieux. Comment ? En rajoutant un titre à ce beau screenshot.

Dans la version 2.0 de Frameit vous pouvez maintenant ajouter un fond custom, un titre et des couleurs à vos screenshots.

Créer un fichier `Framefile.json` dans le dossier screenshots.

```json
{
  "device_frame_version": "latest",
  "default": {
    "title": {
      "color": "#545454"
    },
    "background": "./background.jpg", // Ajoute un background
    "padding": 50,
    "show_complete_frame": true, // Retrécit le device et le cadre afin de tout afficher
    "stack_title" : false // Spécifie si frameit doit afficher le mot-clé au-dessus du titre lorsque le mot-clé et le titre sont définis.
  },
  "data": [
    {
      "filter": "01CarList", // Si votre sreenshot se nomme Iphone iPhone6-01CarList-*.png alors il utilisera ses paramètres
      "title": {
        "text": "Mes voitures",
        "padding": 100,
        "color": "#d21559"
      }
    },
    {
      "filter": "02CarDetail",
      "title": {
        "text": "Ma mustang",
        "padding": 100
      }
    }
  ]
}
```

![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/iPhone6-01CarList-d41d8cd98f00b204e9800998ecf8427e_framed_custom.png)
![]({BASE_URL}/imgs/articles/2017-07-17-fastlane-ios/iPhone6-02CarDetail-d41d8cd98f00b204e9800998ecf8427e_framed_custom.png)

Avouez c'est bad ass ? :)

# Gym

Gym build et package vos applications iOS pour vous. Il génére un fichier `ipa` ou `app` .

Installation de `gym` afin de configurer les paramètres par défaut :

```shell
$ bundle exec fastlane gym init
```

Configuration de votre `Gymfile`

```
scheme "FastlaneArticle"

clean true

sdk "iphoneos10.3" # Le SDK qui devra être utilisé pour le build de l'application

output_directory "../build" # Chemain où nous allons stocker le fichier .ipa
output_name "Fastlane"

silent true # Cache toutes les informations qui ne sont pas nécessaire pendant le build

#configuration => Configuration utilisée pour le build. Par défaut la valeur est Release
```

Nous allons créer une **lane** pour builder notre application pour Apple TestFlight

```ruby
desc "Submits to Apple TestFlight"
  lane :buildTestFlight do
    match(app_identifier: "com.eleven.fastlane.debug", type: "appstore")
    increment_build_number # Incrémente le chiffre du build de votre projet
    gym(configuration: "Debug")
end
```

```shell
$ bundle exec fastlane buildTestFlight
```

*Note* : Il se peut que vous ayez une erreur dûe au fait que vous n'ayez pas de bundle identifié sur Itunes Connect. Pour remédier à ça, il faut juste en créer un via :

```shell
$ bundle exec fastlane produce -u MAIL -a com.eleven.fastlane.debug --skip_itc
```

Avouez que c'est plus facile que de le faire soi-même. Maintenant on va voir comment envoyer notre fichier ipa pour le tester via TestFlight.

# Pilot

Pilot permet de :

* Uploader et distribuer vos builds
* Ajouter et supprimer vos testeurs
* Récupérer des informations sur les testeurs et les devices
* Import/export tous les testeurs disponibles

Pour uploader un nouveau build vous pouvez exécuter la commande:

```shell
$ bundle exec fastlane pilot upload
```

Cela recherchera automatiquement un ipa dans votre répertoire courant et tentera de récupérer les informations d'identification
de connexion à partir de votre configuration Fastlane.

*Note* : Pensez bien à créer votre application sur Itunes Connect avant.
(ou utilisez la lib [produce](https://github.com/fastlane/fastlane/tree/master/produce))

Nous pouvons reprendre notre **lane** précédement créée et y rajouter l'instruction `pilot`

```ruby
desc "Submits to Apple TestFlight"
  lane :buildTestFlight do
    match(app_identifier: "com.eleven-labs.testflight", type: "appstore")
    increment_build_number # Increment le chiffre du build de votre projet
    gym(configuration: "Debug", include_bitcode: true)
    pilot(app_identifier: "com.eleven-labs.testflight", ipa: "../build/Fastlane.ipa")
end
```

```shell
$ bundle exec fastlane buildTestFlight
```
*Note*:
1. Si comme moi vous avez une double identification via votre téléphone, il suffit de se connecter [ici](https://appleid.apple.com/account/manage) et de générer un password dans la section Security > APP-SPECIFIC PASSWORDS
2. Vérifiez sur votre Itunes Connect le bundle identifier renseigné.

# Deliver

Il est temps de mettre en prod votre application sur Itunes Connect.

```shell
# Comme d'habitude on initialise
$ bundle exec fastlane deliver init
```

```
# Deliverfile
username "yourItunesEmail@eleven-labs.com"
```

Il vous suffit dans votre lane d'ajouter l'instruction :

```ruby
deliver(force: true) # Force: true pour skip le repport HTML de verification
```

Vous devriez avoir un nouveau folder metadata qui vient d'apparaître.

![](https://raw.githubusercontent.com/fastlane/fastlane/master/deliver/assets/metadata.png)

À vous maintenant de mettre à jour ces metadata.

# Conclusion

Si vous n'êtes pas tombés amoureux de Fastlane je ne comprends pas, vous aimez souffrir :)
On voit très rapidement que ce petit bijou nous fait gagner un temps monstre et nous évite de faire une erreur humaine (l'avantage de l'automatisation).
Après quelques tests et configurations vous pouvez facilement reprendre vos scripts pour les réutiliser sur d'autres projets.
