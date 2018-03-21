---
layout: post
title: Calabash / Cucumber - Ecrire des tests fonctionnels pour Mobile
lang: fr
permalink: /fr/calabash-cucumber-ecrire-des-tests-fonctionnels-pour-mobile/
excerpt: "Rendez plus robuste votre application mobile en ajoutant des tests fonctionnels"
authors:
    - ibenichou
categories:
    - ios
    - swift
    - xcode
    - test-unitaire
    - gherkins
tags:
    - ios
    - swift
    - xcode
    - test-unitaire
    - gherkins
cover: /assets/2018-03-01-calabash-cucumber/cover.jpg
---

Nous allons voir aujourd'hui comment mettre en place des tests fonctionnels sur votre application.
Cet article va vous permettre notamment de sensibiliser vos PO à écrire des tests afin d'automatiser les sanity checks.

Pour argumenter auprès de votre PO, je vous conseille de lui partager l'article de [Thiga](https://blog.thiga.fr/product-management/bdd-gherkin-pour-ecrire-vos-user-stories/)

> Pré-requis: avoir des bases en Ruby ; Ruby 2.3.3 sur votre machine ; Bundler

## Cucumber

[Cucumber](https://cucumber.io/) est un framework [open-source](https://github.com/cucumber/cucumber) qui permet d'exécuter des tests automatisés.

Ce framework repose sur le principe du Behaviour-Driven Development (BDD).

> Le processus BDD met en avant le langage naturel et les interactions dans le processus de développement logiciel.

En clair, Cucumber vous permet d'exprimer le comportement de votre application en utilisant un langage naturel (Gherkin) qui peut être compris par tout le monde. Cela permet également d'obtenir une documentation fonctionnelle de votre application.

Exemple :

![Cucumber]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/cucumber-feature@2x.png)

### Comment ça marche ?

Un morceau de code Ruby est exécuté pour chaque ligne de test.

Le diagramme suivant illustre comment toutes ces pièces s'emboîtent :

![cucumberSchema]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/image-02.png)

Les `steps definitions` utilisent les API Calabash (Ruby) pour interagir avec l'application lorsqu'elle s'exécute sur un périphérique ou dans le simulateur. Les API contiennent des méthodes pour simuler des actions de l'utilisateur, telles que toucher l'écran, entrer du texte dans des champs de texte, etc.

## Calabash

[Calabash](https://calaba.sh/) est open-source, développé et maintenu par [Xamarin](https://github.com/calabash/calabash-ios).

Il est constitué de bibliothèques qui permettent au code de test d’interagir par programmation avec des applications natives et hybrides.

Nous allons voir tout ça en détail dans la suite de l'article.

### Cucumber - Calabash

Cucumber est un cadre générique pour les tests. Il nécessite une bibliothèque d'automatisation qui se connecte et permet à Cucumber de s'exécuter sur une plateforme ou une technologie particulière.
Cette architecture permet d'écrire des tests Cucumber pour presque n'importe quel dispositif, à condition qu'il existe une bibliothèque d'automatisation qui assure la prise en charge du dispositif en question.

Schéma Cucumber / Calabash:

![stackCucumberCalabash]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/image-01.png){:height="600px"}

Schéma sur le fonctionnement sur device / simulateur.

![iosCalabash]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/calabash-ios-stack.png){:height="500px"}

Le framework Calabash fournit un petit serveur HTTP intégré qui permet aux tests de communiquer et de contrôler l'application pendant qu'elle s'exécute sur le périphérique. Cependant, le framework Calabash ne doit pas être inclus dans les versions Release de l'IPA.

## Installation  

### Dépendances Ruby

Créez un fichier `Gemfile` à la racine de votre projet afin d'installer le [gem](https://rubygems.org/gems/calabash-cucumber/versions/0.21.4?locale=fr) `calabash-cucumber` pour les dépendances de ligne de commande qui vont nous permettre de lancer nos tests.

```ruby
source "https://rubygems.org"

ruby '2.3.3' # On fixe la version de ruby

gem 'calabash-cucumber', '~> 0.21.4'
```

Pour l'installer, rien de plus simple, tapez dans votre terminal : `bundle install`

### Target Calabash sous Xcode

À noter : il faut absolument créer une nouvelle target `-cal` pour lancer vos tests.

**Step 1 - Création de la target -cal**

Cliquez droit sur la target de production et dupliquez celle-ci :

![Step1](https://cloud.githubusercontent.com/assets/466104/10642073/6cfbd6cc-781c-11e5-91c5-ecb5dffc4a14.png)

Si vous avez une application pour iPhone ou iPad uniquement, vous pouvez avoir une alerte de ce type :

(Cliquez sur "Duplicate Only")

![alert](https://cloud.githubusercontent.com/assets/466104/10642075/7079fd42-781c-11e5-9487-93deaf47c03b.png)

Dans ce cas, renommez la target en rajoutant à la fin `-cal` :

![renameCal](https://cloud.githubusercontent.com/assets/466104/10642082/7998f5fe-781c-11e5-8cca-354c4651fc79.png)

Changez son bundle identifier :

![changeBundlerIdentifier](https://cloud.githubusercontent.com/assets/466104/10642083/79b15a2c-781c-11e5-844a-92ebe29e6e9c.png)

Changez le `Info.plist` pour mettre l'original :

![infoPlis](https://cloud.githubusercontent.com/assets/466104/10642086/79bf2580-781c-11e5-9415-0313ebfcfc51.png)

Supprimez le `Info.plist` dupliqué :

![duplicateInfoPlist](https://cloud.githubusercontent.com/assets/466104/10642085/79bf10d6-781c-11e5-9e53-57935455b87e.png)

**Step 2 - Créez le schéma -cal**

Gérez le schéma :

![manageScheme](https://cloud.githubusercontent.com/assets/466104/10642084/79bc4ca2-781c-11e5-86de-6fc8f25d45eb.png)

Vérifiez les options "Show" et "Share" :

![showShareScheme](https://cloud.githubusercontent.com/assets/466104/10642089/79c0e64a-781c-11e5-9e4e-25b91fa10d8c.png)

**Step 3 - Link CFNetwork.framework**

Si votre application de production n'est pas déjà `linker` avec `CFNetwork.framework`, vous devez ajouter celle-ci à la target `-cal`. Cette étape est nécessaire pour que le framework Calabash automatise l'application testée.

![linkCFNetwork](https://cloud.githubusercontent.com/assets/466104/10642090/79c952b2-781c-11e5-83a1-17bcb8719b58.png)
![addLinkCFNetwork](https://cloud.githubusercontent.com/assets/466104/10642091/79d07010-781c-11e5-84fa-da3bb2f9950e.png)

### Podfile

Nous allons maintenant installer le pod `Calabash` sur votre projet.
Vous devez créer votre fichier Podfile via `pod init` à la racine de votre projet et ajouter à votre target -cal le pod `Calabash`.

Exemple :

```ruby
platform :ios, '10.0'

target 'calabashCucumber' do
  use_frameworks!
  pod 'SwiftMessages'
end

target 'calabashCucumber-cal' do
  use_frameworks!
  
  pod 'SwiftMessages'
  pod 'Calabash'
end

```

Ensuite, installez-le via `pod install` et n'oubliez pas d'ouvrir le projet en `*.xcworkspace`.

Voilà, nous avons terminé la configuration ! Cette partie semble longue comme ça, je vous l'accorde, mais à force de pratiquer ça vous prendra peu de temps.

## Génération de fichier features et scripts Ruby

Maintenant, il est temps de rentrer dans le vif du sujet. Dans votre terminal, à la racine du projet, lancez la commande suivante :

```shell
bundle exec calabash-ios gen
```

Après avoir répondu `Y` à la question, vous pourrez constater que cette commande crée un dossier `features` contenant plusieurs sous-dossiers/fichiers :

* `steps/samples_step.rb`: Répertoire contenant les fichiers Ruby qui traduisent les tests [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) ;
* `support`: Répertoire, avec plus de scripts Ruby qui font fonctionner l'ensemble de l'automatisation ;
* `*.features`: Fichier test écrit en [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin).

> Attention ! Pensez bien à builder une première fois votre target -cal avant de lancer les tests.

Pour lancer les tests, tapez la commande :

```shell
bundle exec cucumber
```

Magique, non ? :)

## Gherkin - Cucumber

Nous allons partir du principe que vous travaillez avec un PO exceptionnel qui connaît le Gherkin !
Il rédige donc les scénarios d'acceptation de test de chaque écran dans des fichiers `.features` 

Aide :

![Gerhkins]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/gherkincheat.png){:height="600px"}

> Les scripts Gherkins ci-dessous peuvent être optimisés mais j'ai préféré vous présenter quelque chose de simple :)

### Accueil

Nous allons donc créer notre premier fichier `home.feature`.

Voici la première version de cette feature en Français :

```gherkin
Feature: Page d'accueil
  Scenario: Message de bienvenue
  Etant donné que je lance l'application
  Quand je ne fais rien
  Alors je dois voir "Welcome" en titre

  Scenario: Bouton Login
  Etant donné que je lance l'application
  Quand je ne fais rien
  Alors je dois voir "Login" comme bouton

  Scenario: Bouton Register
  Etant donné que je lance l'application
  Quand je ne fais rien
  Alors je dois voir "Register" comme bouton
```

Je vous conseille de lire la documentation sur les [steps prédéfinies](https://github.com/calabash/calabash-ios/wiki/02-Predefined-steps) de Cucumber. Ces steps vous offrent un moyen rapide et facile de commencer à tester votre application sans avoir à programmer ; comme lorsque vous voulez cliquer sur un bouton, écrire dans un textfield...

Cependant, vous pouvez facilement écrire vos `custom steps` comme `Then I should see the button "Login"` dans `home.feature`.

```gherkin
Feature: Home

Scenario: Home Welcome
  Given the app has launched
  When I do nothing
  Then I should see "Welcome"

Scenario: Login Button
  Given the app has launched
  When I do nothing
  Then I should see the button "Login"

Scenario: Register Button
  Given the app has launched
  When I do nothing
  Then I should see the button "Register"
```

### Login

```gherkin
Feature: Login

Scenario: Login Screen
  Given I press "Login"
  When I do nothing
  Then I should see "Login"

Scenario: Email TextField
  Given I press "Login"
  When I do nothing
  Then I should see "email"

Scenario: Password TextField
  Given I press "Login"
  When I do nothing
  Then I should see "mot de passe"

Scenario: Login Button
  Given I press "Login"
  When I do nothing
  Then I should see "Login"

Scenario: Fermer Button
  Given I press "Login"
  When I do nothing
  Then I should see "Fermer"

Scenario: Fermer Button action
  Given I press "Login"
  When I press "Fermer"
  Then I should see "Welcome"

Scenario: No Valid form without info
  Given I press "Login"
  When I press "Login"
  Then I should see "Please, add a email and a password"

Scenario: No Valid form without valid email
  Given I press "Login"
  When I use the native keyboard to enter "mail@mail" into the "email" input field
  Then I touch done
  And I press "Login"
  And I should see "Please, add a validate email"

Scenario: No Valid form with small password
  Given I press "Login"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "123" into the "mot de passe" input field
  Then I touch done
  And I press "Login"
  And I should see "Please, enter a password sup to 3 char"

Scenario: Email and password not match
  Given I press "Login"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "1235" into the "mot de passe" input field
  Then I touch done
  And I press "Login"
  Then I should see "Login and password dont match"

Scenario: Success login
  Given I press "Login"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "1234" into the "mot de passe" input field
  Then I touch done
  And I press "Login"
  And I should see "Home"
```

### Inscription

```gherkin
Feature: Register

Scenario: Register Screen
  Given I press "Register"
  When I do nothing
  Then I should see "Register"

Scenario: Email TextField
  Given I press "Register"
  When I do nothing
  Then I should see "email"

Scenario: Password TextField
  Given I press "Register"
  When I do nothing
  Then I should see "mot de passe"

Scenario: Password Copy TextField
  Given I press "Register"
  When I do nothing
  Then I should see "recopy mot de passe"

Scenario: Register Button
  Given I press "Register"
  When I do nothing
  Then I should see "Register"

Scenario: Fermer Button
  Given I press "Register"
  When I do nothing
  Then I should see "Fermer"

Scenario: No Valid form without info
  Given I press "Register"
  When I press "Register"
  Then I should see "Please, add a email and a password"

Scenario: No Valid form without valid email
  Given I press "Register"
  When I use the native keyboard to enter "mail@mail" into the "email" input field
  Then I touch done
  And I press "Register"
  And I should see "Please, add a validate email"

Scenario: No Valid form with small password
  Given I press "Register"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "123" into the "mot de passe" input field
  Then I touch done
  And I press "Register"
  Then I should see "Please, enter a password sup to 3 char"

Scenario: No Valid form with small password
  Given I press "Register"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "1234" into the "mot de passe" input field
  And I use the native keyboard to enter "1235" into the "recopy mot de passe" input field
  Then I touch done
  And I press "Register"
  Then I should see "Your password its not same"

Scenario: Success login
  Given I press "Register"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "1234" into the "mot de passe" input field
  And I use the native keyboard to enter "1234" into the "recopy mot de passe" input field
  Then I touch done
  And I press "Register"
  Then I should see "Home"

# J'ai ajouté ce scénario pour provoquer un failed.
Scenario: Test Failed Scenario
  Given I press "Register"
  When I use the native keyboard to enter "mail@mail.fr" into the "email" input field
  And I use the native keyboard to enter "1234" into the "mot de passe" input field
  And I use the native keyboard to enter "1234" into the "recopy mot de passe" input field
  Then I touch done
  And I press "Register"
  Then I should see "Pepito"
```

## Ruby - Calabash

Rappelez-vous que dans `home.feature`, j'ai délibérément ajouté quelques `custom steps` :

* Given the app has launched
* When I do nothing
* I should see the button "Login"

Vous pouvez vous aider de la documentation pour écrire des `custom steps` plus poussées :

* http://calabashapi.xamarin.com/ios/
* https://developer.xamarin.com/guides/testcloud/calabash/calabash-query-syntax/

### Home.rb

```ruby
Given(/^the app has launched$/) do
    wait_for do # Attends une intruction qui retourne true, sinon un timeout lève une exception.
      !query("*").empty?
    end
end
  
When(/^I do nothing$/) do # Ne fait rien.
end

Then(/^I should see the button "([^"]*)"$/) do |txt|
    wait_for_element_exists("button marked:'#{txt}'") # Attend d'avoir un élément button avec la valeur "txt". Un timeout lève une exception s'il n'a rien trouvé.
end
```

**Query**

`Query` sélectionne un ou plusieurs objets de la vue "visible" dans l'écran actuel de votre application. Cette méthode prend un argument `String` qui décrit les objets à "interroger".

`Query` donne une approche "CSS-selector" pour trouver des objets de vue dans les écrans de votre application.

**Exécutez vos tests**

Si vous lancez votre test `bundle exec cucumber -n Home` pour `home.feature` vous devriez obtenir quelque chose comme ça.

![homeFeatureCli]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/screen_home_feature.png){:width="900px"}

Cool non ? :)

## Application

Pour cet article j'ai mis sur [github](https://github.com/Prims47/CalabashCucumber) mon application, qui comporte une page d'inscription/login/home.

> Attention ! J'ai construit rapidement cette application pour cet article, donc j'accepte volontiers toutes pull requests :)

### Screenshots

![appHome]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/simuHome.png){:height="500px"}
![appLogin]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/SimuLogin.png){:height="500px"}
![appLoginError]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/SimoLoginError.png){:height="500px"}
![appRegister]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/SimuRegister.png){:height="500px"}
![appRegisterError]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/SimuRegisterError.png){:height="500px"}
![appHome2]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/SmuHome2.png){:height="500px"}

### Login Validation

```swift
var formIsValid = false

func validForm(email: String, password: String) -> Bool {
    if email == "" && password == "" {
        Message.showError(error: "Please, add a email and a password")

        return false
    }

    if !self.isValidEmail(email: email) {
        Message.showError(error: "Please, add a validate email")

        formIsValid = false
    }

    if password.count < 4 {
        Message.showError(error: "Please, enter a password sup to 3 char")

        return false
    }

    if email != "mail@mail.fr" || password != "1234" {
        Message.showError(error: "Login and password dont match")

        return false
    }

    if email == "mail@mail.fr" && password == "1234" {
        formIsValid = true
    }

    return formIsValid
}

func isValidEmail(email: String) -> Bool {
    let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"

    let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)

    return emailTest.evaluate(with: email)
}
``` 

### Inscription Validation

```swift
func validForm(email: String, password: String, copyPass: String) -> Bool {
    if email == "" && password == "" && copyPass == "" {
        Message.showError(error: "Please, add a email and a password")

        return false
    }

    if !self.isValidEmail(email: email) {
        Message.showError(error: "Please, add a validate email")
    }

    if password.count < 4 {
        Message.showError(error: "Please, enter a password sup to 3 char")

        return false
    }

    if password != copyPass {
        Message.showError(error: "Your password its not same")

        return false
    }

    return true
}

func isValidEmail(email: String) -> Bool {
    let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"

    let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)

    return emailTest.evaluate(with: email)
}
``` 

### Message

J'ai ajouté à mon projet la librairie `SwiftMessages` pour customiser mes erreurs.

```swift
struct Message {
    static func showError(error: String) {
        var config = SwiftMessages.Config()
        config.duration = .seconds(seconds: 3)
        config.presentationContext = .window(windowLevel: UIWindowLevelStatusBar)

        let view = MessageView.viewFromNib(layout: .messageViewIOS8)
        view.configureTheme(.error, iconStyle: .subtle)
        view.configureContent(title: "Erreur", body: error)

        SwiftMessages.show(config: config, view: view)
    }
}
```

## Bonus - Aws farm device

Aws dispose d'un service nommé `Device Farm` qui permet de lancer différents tests sur un [parc de téléphones](https://aws.amazon.com/fr/device-farm/device-list/) très vaste. Les avantages de cette solution sont multiples mais l'argument principal est que vous pouvez facilement cibler un device pour vos tests.
Vérifiez que vous avez bien configuré un compte AWS et un utilisateur IAM pour accéder à Device Farm.

> Attention ! Aws avec Calabash ne supporte que des versions en dessous de 10.3.3.


### Préparation

Nous devons préparer certaines choses avant de configurer AWS.

**Création du build**

Vous allez devoir créer un .ipa de votre application. Assurez-vous que celui-ci soit conçu pour un appareil iOS et non pour un simulateur.

Suivez les étapes suivantes :

* Sélectionnez votre target `-cal` avec `Generic iOS Device`
* Allez dans le menu `Product` > `Archive`
* Dans la fenêtre qui vient d'apparaître, sélectionnez `Export` et `Development`
* Laissez le reste par défaut

Vous devriez avoir un beau fichier .ipa :)

**Compressez vos tests**

Assurez-vous que vos tests Calabash soient contenus dans un fichier .zip. Celui-ci doit comporter la structure suivante :
Pensez donc bien à renommer votre dossier `steps` en `step_definitions`.

```
my-zip-file-name.zip
    `-- features (directory)
          |-- my-feature-1-file-name.feature
          |-- my-feature-2-file-name.feature
          |-- my-feature-N-file-name.feature
          |-- step_definitions (directory)
          |      `-- (.rb files)
          |-- support (directory)
          |      `-- (.rb files)
          `-- (any other supporting files)
```

### Configuration

Nous allons voir ensemble comment configurer le projet.

**Step 1 - Création du projet**

Connectez-vous à la console Device Farm sur l'adresse suivante : https://console.aws.amazon.com/devicefarm.
Sur la page de la console Device Farm, entrez un nom pour votre projet.

![createProject](https://docs.aws.amazon.com/fr_fr/devicefarm/latest/developerguide/images/aws-device-farm-create-project.png)

Si le bouton `Create a new run` s'affiche, choisissez-le.
  

**Step 2 - Uploader votre ipa**

Vous devez uploader votre .ipa précédemment créée :

![uploadIpa]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/upload_ipa.png)

Amazon nous indique quelques informations à propos de votre build :

![uploadIpaVersion]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/upload_ipa_version.png)

**Step 3 - Uploader vos tests Calabash**

Sélectionnez Calabash et uploadez votre dossier .zip :

![uploadCalabash]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/upload_calabash.png)

**Step 4 - Pool de Devices**

J'ai délibérément mis mon build en target iOS 10.3, c'est pourquoi la sélection `Top Devices` d'Amazon apparaît en rouge.

![poolError]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/pool_error.png)

Cependant, vous pouvez bien sûr créer votre propre pool.

![poolCreate]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/pool_create.png)
![poolSuccess]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/pool_success.png)

**Step 5 - Configuration Devices**

Un des nombreux avantages d'AWS Device Farm est que vous pouvez configurer vos devices.
En effet, on remarque via l'image ci-dessous qu'Amazon nous permet de :

* Fournir des données supplémentaires qui seront utilisées par Device Farm lors de l'exécution. `Add extra data`, choisissez Upload, puis recherchez et choisissez le fichier .zip.
* Installer une application supplémentaire qui sera utilisée par Device Farm lors de l'exécution. Choisissez `Install other apps`, puis Upload. Enfin, recherchez et sélectionnez le fichier .ipa contenant l'application. Répétez la procédure pour toutes les applications supplémentaires que vous voulez installer. Vous pouvez modifier l'ordre d'installation en faisant glisser et en déplaçant les applications ;
* Pré-sélectionner la latitude et la longitude de l'appareil ;
* Pré-sélectionner les paramètres régionaux de l'appareil pour l'exécution ;
* Pré-définir le profil réseau de l'exécution, choisissez un profil dans `Network profil` ou choisissez `Create a new profile` pour créer le vôtre.

![deviceState]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/device_state.png)

**Step 6 - Run**

Avant de lancer les tests, Amazon vous demande le temps (en minutes) maximum par devices qu'il doit prendre. Bien évidemment, ce temps dépend de vos tests ; dans mon cas, j'ai mis une valeur large de 30 minutes.

![runExec]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/run_exec_time.png)

### Tableau de bord

Au bout de X minutes, lorsque vos tests sont terminés, si vous allez dans le détail de votre projet, Amazon va créer un dashboard hyper complet.

![dashboard]({{ site.baseurl }}/assets/2018-03-01-calabash-cucumber/dashboard.png)

Dans notre cas, Amazon nous montre directement quel scénario ne fonctionne pas. En quelques clics, nous pouvons rentrer en détails sur chaque device et chaque scénario. Amazon nous fournit pas mal d’éléments comme :

* Vidéo du scénario exécuté ;
* Logs (tableau + filtrer) ;
* Perfomance (CPU, Mémoire, Threads) ;
* Screenshots

Qui permettent de débugger plus facilement.

### Conclusion du service Device Farm

Cependant, on remarque deux contraintes à cette solution :

* Aws Device Farm ne supporte pas les versions supérieures à iOS 10.3.3
* [Le prix](https://aws.amazon.com/fr/device-farm/pricing/), même si normalement c'est à votre société de prendre en charge cette partie :)

## Conclusion

Calabash et Cucumber forment un combo de feu pour la stabilisation de vos apps (avec des [tests unitaires](https://blog.eleven-labs.com/fr/test-unitaire-swift-xcode/) bien sûr !). Ajoutez avec ça un AWS Device Farm, et vous pourrez parfaitement tester votre application sur l'ensemble des devices du marché.

Les avantages que j'ai remarqués sont :

* Faciliter vos campagnes de test de non regression de façon automatique ;
* Avoir de la documentation fonctionnelle de votre application ;
* Permet de tester sur un ensemble de device sans avoir à tout acheter obligatoirement.

Le seul "défaut" que j'ai trouvé, c'est la configuration qui nécessite un peu de temps au début.
