---
layout: post
title: "Envoyer des push notifications via Amazon SNS en Swift 3"
excerpt: "Envoyer des push notifications via Amazon SNS en Swift 3"
lang: fr
permalink: /fr/envoyer-push-notifications-amazon-sns-swift-3/
authors:
  - ibenichou
date: '2017-06-28 12:00:00 +0100'
date_gmt: '2017-06-28 12:00:00 +0100'
categories:
    - Swift
    - Mobile
tags:
    - swift
    - xcode
    - push
    - aws
image:
    path: /assets/2017-06-28-push-notification-ios-amazon-sns/banniere-article-ilan.png
    height: 100
    width: 100
---

Aujourd’hui, nous allons nous intéresser aux push notifications sur iOS à partir d’Amazon SNS en swift 3.

*Prérequis* :

* Avoir un compte Apple développeur ;
* Avoir un compte Amazon

Pour info, pas de panique, la phase théorique est longue mais nécessaire afin que vous compreniez bien la logique derrière tout ça (personnellement, je préfère voir l’ensemble et comprendre le pourquoi du comment, au lieu de reproduire bêtement sans réellement comprendre ce que je fais).

# Sommaire

* Qu’est ce que les push notifications ?
* APNs
* Application
* Configuration Apple
* Amazon SNS
* Conclusion

# Qu’est ce que les push notifications ?

Bon à part si votre téléphone est un 3310 (best phone ever <3 ), vous avez obligatoirement eu l’occasion de recevoir une notification de la part d’une application. Aujourd’hui, cette fonctionnalité est très utilisée par la plupart des applications, donc il est “indispensable” de savoir comment ça marche et comment la mettre en place. Rassurez-vous, nous allons voir tout ça ensemble.

Il existe deux types de push notifications:

1. **Locale** : : votre application configure les détails de notifications localement et transmet ses informations au système qui gère la livraison de la notification lorsque celle-ci n’est pas au premier plan (foreground) ;
2. **Remote** (distante) : avec les notifications à distance, vous utilisez l’un de vos serveur pour envoyer les données à vos utilisateurs via le **service Apple Push Notification** (APNs).

Pour l’utilisateur, il n’y a pas de différence entre une notification dite “locale” et une notification dite “à distance”. Les deux types de notifications ont la même apparence par défaut.

Vous pouvez personnaliser l’apparence dans certains cas, mais surtout vous choisissez comment vous souhaitez que l’utilisateur soit informé. Plus précisément, vous choisissez l’une des options suivantes pour la livraison de la notification :

* Une alerte ou une bannière sur écran ;
* Un badge sur l’icône de votre application ;
* Un son qui accompagne une alerte, une bannière ou un badge.

*À noter* : il faut toujours utiliser les notifications “locales” et “à distance” judicieusement pour éviter d’agacer l’utilisateur. Le système permet aux utilisateurs d’activer et de désactiver la présentation des alertes, des sons et des badges par application.

Bien que les notifications puissent toujours être envoyées à votre application, le système notifie l’utilisateur uniquement aux options actuellement activées. Je m’explique, si l’utilisateur désactive complètement les notifications, les APNs ne fournissent pas les notifications de votre application sur le périphérique de l’utilisateur et la programmation des notifications locales échoue toujours.

# Apns

Apple nous indique qu’il s’agit d’un service robuste, sécurisé et hautement efficace pour les développeurs afin de propager des informations aux périphériques iOS.

Lors du lancement initial de votre application sur l’iphone d’un utilisateur, le système établit automatiquement une connexion IP accréditée, chiffrée et persistante entre votre application et l’APNs. Cette connexion permet à votre application d’effectuer une configuration pour lui permettre de recevoir des notifications.

L’autre partie de la connexion permet l’envoi de notifications. Le “canal” persistant et sécurisé entre un serveur provider et les APNs nécessite une configuration dans votre compte de développeur en ligne et l’utilisation de certificats cryptographiques fournis par Apple. Un serveur provider est un serveur que vous déployez, gérez et configurez pour fonctionner avec les APNs.

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/remote_notif_simple_2x.png" />

1. Votre provider peut envoyer des demandes de notification aux APNs ;
2. Les APNs transmettent les payloads de notification correspondants à chaque périphérique ciblée ;
3. À la réception d’une notification, le système fournit le payload à l’application appropriée sur l’appareil et gère les interactions avec l’utilisateur.

Si une notification arrive et que l’appareil est sous tension mais que l’application ne fonctionne pas, le système peut alors toujours afficher la notification.

Toutefois, si l’appareil est éteint lorsque les APNs envoient une notification, les APNs retiennent la notification et tentent de la renvoyer plus tard.

Votre provider a les responsabilités suivantes pour échanger avec les APNs :

* Recevoir via l’APNs, des tokens uniques et spécifiques par device ainsi que d’autres données pertinentes provenant des instances de votre application sur les devices utilisateurs ;
* Déterminer, selon la conception de votre système de notification lorsque des notifications à distance doivent être envoyées à chaque appareil ;
* Création et envoi de demandes de notification aux APNs. Chaque demande contient un payload et des informations de livraison. Les APNs fournissent ensuite les notifications correspondantes aux appareils visés en votre nom ;

Bien évidemment vous pouvez avoir plusieurs providers

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/remote_notif_multiple_2x.png" />

Vous l’aurez vite compris : c’est un sujet vaste et complexe. Rassurez-vous, il existe énormément de services qui vous facilitent la tâche concernant la partie provider.

Voici une petite liste non exhaustive des services les plus répandus :

* Firebase (Gratuit)
* Amazon Simple Notification Service – SNS (0,50 USD par million)
* Urbanairship
* Twilio
* …

Dans notre article, nous allons utiliser Amazon SNS. Amazon propose des services très utilisés par les devops afin, pour la plupart du temps, de créer l’architecture serveur de votre projet. C’est donc plus simple de centraliser tous vos services.

Avant de configurer Amazon, nous allons coder un peu l’application. C’est parti !

# Application

Votre application doit être configurée au moment du lancement pour prendre en charge les notifications distantes. Plus précisément, vous devez configurer votre application à l’avance si elle fait l’une des opérations suivantes :

* Affiche les alertes, émet des sons ou badges d’icône en réponse à une notification d’arrivée ;
* Affiche des boutons d’action personnalisés avec une notification.

Cela signifie que vous devez configurer votre support de notification au plus tard dans l’application via la méthode `didFinishLaunchingWithOptions`.

Créez une “Single View Application” sous Xcode

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/create_app_xcode.png" />

Ensuite, il va falloir activer les notifications de votre application. Pour cela, il suffit de cliquer dans la rubrique “Capabilities” et d’activer “Push notifications”, et pour finir dans “Background Modes”, checker “Remote notifications”.

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/conf_push_xcode.png" />

Rappel :

Chaque fois que votre application se lance, elle doit s’inscrire auprès des APNs. Les méthodes à utiliser sont différentes selon la plate-forme, mais dans tous les cas, cela fonctionne de cette manière :

1. Votre application demande à être enregistrée auprès des APNs ;
2. Lors d’une inscription réussie, l’APNs envoie un jeton de périphérique spécifique à l’appareil ;
3. Le système délivre le device à votre application en appelant une méthode dans votre délégué d’application ;
4. Votre application envoie le jeton du périphérique au fournisseur associé de l’application.

Récupérer le token auprès des APNs.

Pour initialiser l’enregistrement auprès des APNs, il suffit d’appeler la méthode registerForRemoteNotifications` de l’objet UIApplication.

Appelez cette méthode au moment du lancement dans le cadre de votre séquence de démarrage normale. La première fois que votre application appelle cette méthode, l’objet de l’application contacte les APNs et demande le jeton du périphérique spécifique à l’application en votre nom.

Le système appelle de manière asynchrone l’une des deux méthodes de délégation d’application suivantes, selon le succès `didRegisterForRemoteNotificationsWithDeviceToken` ou l’échec `didFailToRegisterForRemoteNotificationsWithError`.

L’objet de l’application contacte les APNs uniquement lorsque le jeton du périphérique a changé. Si votre device token change pendant que votre application tourne, l’objet de l’application appelle la méthode `didRegisterForRemoteNotificationsWithDeviceToken`.

**Attention : /!\ CECI NE MARCHE PAS SUR SIMULATEUR /!\ Veuillez brancher votre iphone pour tester votre code.**

```swift
import UserNotifications

// ...

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.

    // Configure les interactions utilisateur
    self.configureUserInteractions()

    // Enregistrement avec les APNs
    UIApplication.shared.registerForRemoteNotifications() // L'objet application = UIApplication.shared (singleton)

    return true
}

func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // ...

    // Envoi le token vers votre serveur.
    print("\n\n /**** TOKEN DATA ***/ \(deviceToken) \n\n")

    let deviceTokenString = deviceToken.reduce("", {$0 + String(format: "%02X", $1)})
    print("\n\n /**** TOKEN STRING ***/ \(deviceTokenString) \n\n")
    self.forwardTokenToServer(token: deviceTokenString)
}

func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Error: \(error.localizedDescription)")
}

func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
    print(userInfo)
}

// ...

// MARK: Send Token to server
extension AppDelegate {
    func forwardTokenToServer(token: String) {
        // ...
    }
}

// MARK: User interactions
extension AppDelegate {
    func configureUserInteractions() {
        // iOS 10 support
        if #available(iOS 10, *) {
            UNUserNotificationCenter.current().requestAuthorization(options:[.badge, .alert, .sound]){ (granted, error) in }

            return
        }

        // iOS 8/9 support
        UIApplication.shared.registerUserNotificationSettings(UIUserNotificationSettings(types: [.badge, .sound, .alert], categories: nil))
    }
}
```

Dans la méthode `didFinishLaunchingWithOptions`, je fais appel à une méthode custom (configureUserInteractions) afin de demander l’autorisation à l’utilisateur de recevoir des notifs de l’application. On remarquera que dans cette méthode j’ai ajouté une condition en fonction de la version de l’OS de l’iphone.

*A noter* : depuis iOS10, un nouveau framework appelé UserNotifications a été introduit et doit être importé au début afin d’avoir accès à la classe `UNUserNotificationCenter`.

Je me suis permis également d’ajouter un petit bout de code (dans didRegisterForRemoteNotificationsWithDeviceToken) afin de printer le token reçu par l’APNs.

Lorsque votre application reçoit une push notification c’est par la méthode `didReceiveRemoteNotification`. Cependant cette méthode existe sous la forme fetchCompletionHandler, qui permet de gérer le cas background.

C’est à vous de développer la logique réelle qui s’exécute lorsqu’une notification génère une interaction. Par exemple, si vous avez une application messenger, une notification push « nouveau message » doit ouvrir la page de discussion pertinente et faire apparaître la liste des messages à partir du serveur. Utilisez userInfo qui contiendra toute donnée que vous envoyez à partir de votre backend d’application, tel que l’ID de chat, dans l’exemple de messagerie.

# Configuration Apple

Comme mentionné plus haut, nous devons générer un certificat SSL pour le client de notification push qui permet à votre provider de notification de se connecter aux APNs.

Nb : Chaque App ID est requis pour avoir son propre certificat SSL client.

Le certificat SSL client généré est un certificat universel qui permet à votre application de se connecter aux environnements de développement et de production.

Pour générer un certificat SSL de client universel, il faut :

1. Accéder à Certificates
2. Cliquer sur le button (+) à droite
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/ios_notif_cert01.png" />
3. Sélectionner dans la partie développement “Apple Push Notification service SSL (Sandbox)” et cliquer sur “Continue”. Bien évidemment, si vous devez mettre en production vous devez sélectionner la partie “production”.
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-17.31.52.png" />
4. Choisir L’App ID qui match avec votre bundle ID et cliquer sur “Continue”.
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-17.37.58.jpg" />
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-17.35.17.jpg" />
5. Apple vous demande de créer un “Certificate Signing Request” (CSR)
Pour générer manuellement un certificat, vous avez besoin d’un fichier de demande de signature de certificat (CSR) à partir de votre Mac.
Pour créer un fichier CSR, suivez les instructions ci-dessous:
    1. Ouvrez l’application “Keychain Access”.
    2. Cliquez sur Trousseaux > Assistant de certification > Demandez un certificat à une autre autorité de certificat (cf: screenshot)
    <img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-17.56.30.jpg" />
    3. Dans la fenêtre Informations sur le certificat, entrez les informations suivantes :
        1. Votre adresse email
        2. Dans le champ Nom commun, créez un nom pour votre clé privée (par exemple, Pepito Dev Key).
        3. Le champ Adresse de l’adresse CA doit être laissé vide.
        4. Pour “La requête est”, selectionnez “Enregistrée sur le disque”
        5. Cliquez sur continuer
6. Uploader votre fichier .certSigningRequest précédemment créé.
7. Votre certificat est prêt, téléchargez-le.
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-18.05.22.jpg" />

Encore un effort c’est presque fini !

Maintenant, nous devons transformer notre fichier aps_development.cer en fichier .p12 pour Amazon SNS, afin que celui-ci le convertisse en .pem.
Pour se faire, c’est très simple :

1. Double-cliquez sur votre fichier précédemment créé. Ça l’ajoutera dans votre application Keychain.
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-18.13.54.jpg" />
2. Clique droit sur celui-ci et cliquez sur Exporter
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-19.09.52.png" />
3. Choisissez bien le format .p12, puis l’application Keychain vous demandera un mot de passe.
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-18.18.55.png" />

Bien évidemment vous pouvez utiliser openssl en cli afin d’exporter votre .cer en .pem :

```shell
$ openssl x509 -in aps_development.cer -inform DER -out myapnsappcert.pem
```

Pour vérifier que tout est en ordre, il suffit d’aller sur la liste des App IDs, de cliquer sur l’ID de votre App puis sur “Edit”. Dans la partie Push notification, vous devriez voir que vous avez bien un certificat dans la partie Development.
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-18.22.00.png" />


Enfin fini ! Je vous l’accorde cette partie est fastidieuse et lourde. Il ne manque plus que la partie Amazon SNS.

# Amazon SNS

Amazon SNS est un service web qui coordonne et gère la diffusion ou l’envoi de messages à des clients ou à des endpoints abonnés. Il existe deux types de clients :

1. Les éditeurs (publishers), également appelés producteurs (producers) ;
2. Les abonnés (subscribers), également appelés consommateurs (consumers).

Les publishers communiquent de façon asynchrone avec les subscribers en produisant et en envoyant un message à une rubrique (topic), qui est un point d’accès logique et un canal de communication.

Les subscribers (par exemple, des serveurs web, des adresses e-mail, des files d’attente Amazon SQS, des fonctions AWS Lambda) consomment ou reçoivent le message ou la notification via l’un des protocoles pris en charge (Amazon SQS, HTTP/S, e-mail, SMS, Lambda) lorsqu’ils sont abonnés au topic.

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/sns-how-works.png" />

Lorsque vous utilisez Amazon SNS, vous créez une rubrique (topic) et définissez des stratégies d’accès à cette dernière de manière à déterminer quels publishers et subscribers peuvent communiquer avec le topic.

Les publishers envoient des messages aux topics qu’ils ont créés ou à ceux sur lesquels ils sont autorisés à publier. Plutôt que d’inclure l’adresse d’une destination spécifique dans chaque message, les publishers envoient un message au topic. Amazon SNS établit une correspondance entre le topic et la liste des abonnés à ce topic, puis remet le message à chacun d’eux.

Chaque topic possède un nom unique qui identifie le point de terminaison d’Amazon SNS de manière à ce que les publishers puissent publier des messages et que les subscribers puissent s’inscrire pour recevoir des notifications.

Les subscribers reçoivent tous les messages publiés dans les topics auxquels ils sont abonnés, et tous les subscribers à un topic reçoivent les mêmes messages.

**Etape 1: Création d’un topic**
1. Connectez-vous à la console AWS , cliquez sur “Create topic”

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/sns_c_app.jpg" />

2. Renseignez un nom.

**Etape 2 : Inscription de votre application mobile auprès d’Amazon SNS**

1. Cliquez sur “Create platform application”

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/sns_c_s.jpg" />

2. Indiquez un nom à votre application
3. Dans la zone “Push notification platform”, sélectionnez la plateforme auprès de laquelle l’application est inscrite. Dans notre cas nous choisissons “Apple development”.
4. Dans la zone “Push certificate type”, sélectionnez “iOS push certificate”
5. Choisissez le fichier .p12 créer ultérieurement
6. Entrez votre mot de passe et cliquez sur “load credentials”
<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/capture-d-ecran-2017-05-01-a-19.19.53.jpg" />

**Etape 3 : Ajoutez notre token à notre application**

Avant de nous abonner à un topic, il faut ajouter notre token généré à notre application.

Connectez votre iphone, buildez votre projet et vous verrez votre token dans la console.

Pour ajouter votre token :

1. Ouvrez la console AWS ;
2. Allez dans la rubrique Application et sélectionnez votre application précédemment créée ;
3. Cliquez sur  “Create platform endpoint” et ajoutez votre token.

Une fois votre token enregistré, veuillez copier l’Endpoint ARN qui nous servira pour la partie suivante.

**Etape 4 : Abonnement à un topic**

Pour recevoir les messages publiés dans un topic, vous devez abonner un endpoint à ce topic. Un endpoint est une application mobile, un serveur web, une adresse e-mail ou une file d’attente Amazon SQS.. qui peut recevoir des messages de notification d’Amazon SNS. Une fois que vous avez abonné un endpoint au topic et que l’abonnement est confirmé, le endpoint reçoit tous les messages publiés dans ce topic.

1. Ouvrez la console AWS ;
2. Cliquez sur la rubrique topic et sélectionnez votre topic ;
3. Cliquez sur “Create subscription”, sélectionnez comme protocol application et collez votre Endpoint ARN.

**Etape 5 : Publier un message**

Rien de plus simple, il vous suffit de sélectionner votre topic et de cliquer sur publish.

Amazon met à votre disposition un json generator si vous ne savez pas comment écrire le payload.

Résultat :

<img src="{{ site.baseurl }}/assets/2017-06-28-push-notification-ios-amazon-sns/img_0562.png" />

# Conclusion

La mise en place de push notifications n’est pas un sujet hyper complexe, mais nécessite néanmoins un peu de connaissances. Une fois que vous avez compris le système de certificat (.pem/.p12) qui permet d’identifier chaque application, le reste est plutôt simple (pour l’exemple que j’ai utilisé).
