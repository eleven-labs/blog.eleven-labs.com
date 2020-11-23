---
layout: post
title: "Realm, CoreData killer"
lang: fr
excerpt: "Realm, CoreData killer"
permalink: /realm-coredata-killer/
authors:
  - ibenichou
categories:
    - swift
    - mobile
    - xcode
    - coreData
    - realm
    - database
    - ios
tags:
    - swift
    - mobile
    - xcode
    - coreData
    - realm
    - database
    - ios
cover: /assets/2018-02-24-realm-coredata-killer/realm2.jpg
---

Realm Mobile Database est une alternative à SQLite et à Core Data pour iOS.
À travers cet article, vous allez découvrir et apprécier Realm :).

## Realm

Pourquoi utiliser une libraire externe pour gérer une base de données alors que CoreData existe (natif) ?
Pourquoi rajouter encore une couche à notre application ?

Voici quelques éléments de réponses :

* Performance
* Syntaxe moderne, plus simple
* Possibilité d'encrypter sa base de données (AES-256)
* Avec la solution Realm Platform, possibilité de synchroniser vos données à tout moment avec votre serveur (Realm).
* Marche à travers les threads
* Migrations
* Cross-platform (Java, Swift, Objective-C, Javascript, .NET)
* Realm Studio
* [Open source](https://github.com/realm/realm-cocoa) (Apache 2.0)

> Realm ne devrait ajouter qu'environ 5 à 8 Mo à la taille de téléchargement de votre application

## Benchmark - Performance

Comme annoncé plus haut, l'un des avantages de Realm est la performance.

![realmCount]({{ site.baseurl }}/assets/2018-02-24-realm-coredata-killer/realm_benchmarks_count.png){:width="600px"}
![realmInsert]({{ site.baseurl }}/assets/2018-02-24-realm-coredata-killer/realm_benchmarks_insert.png){:width="600px"}
![realmQueries]({{ site.baseurl }}/assets/2018-02-24-realm-coredata-killer/realm_benchmarks_queries.png){:width="600px"}

On voit clairement que Realm en a sous le capot !
C'est vraiment un point très important car de nos jours nous mettons en place des applications qui traitent de plus en plus de données et de ce fait nous ne pouvons absolument pas nous permettre d'avoir une application lente.

**Comment Realm fait-il pour avoir de telles performances ?**

Realm s'appuie sur les concepts suivants :

* [Data Structure Alignment](https://en.wikipedia.org/wiki/Data_structure_alignment)
* [Cache](https://en.wikipedia.org/wiki/Cache_(computing)) & [Vectorization](https://en.wikipedia.org/wiki/Vectorization)
* [Zero copy](https://en.wikipedia.org/wiki/Zero-copy) architecture

## Installation

Après avoir créé un nouveau projet, vous allez initialiser un Podfile via [Cocoapods](https://cocoapods.org/)

```shell
$ pod init
```

```ruby
# Podfile
target 'realmArtcile' do
  use_frameworks!

  pod 'RealmSwift'
end
```

Après avoir exécuté `pod install`, vous pouvez ouvrir votre projet `*.xcworkspace`


## Configuration

Il est préférable de configurer Realm avant de l'utiliser en créant une instance de `Realm.Configuration`.
Cette configuration permet :

* De donner le chemin sur le disque du fichier de configuration ;
* Lorsque les schémas ont changé entre les différentes versions, une fonction de migration contrôlant la façon dont les données de Realm doivent être mises à jour vers le schéma le plus récent.
* Stocker de nombreuses données ou des données fréquemment modifiées, une fonction de compactage contrôlant la façon dont le fichier Realm doit être compactée pour assurer une utilisation efficace de l'espace disque.

La configuration peut être transmise à `Realm(configuration: config)` chaque fois que vous avez besoin d'une instance Realm où vous pouvez définir la configuration à utiliser pour Realm par défaut avec `Realm.Configuration.defaultConfiguration = config`.

Vous pouvez avoir plusieurs objets de configuration. Ainsi vous pouvez contrôler la version, le schéma et l'emplacement de chaque modèle Realm indépendamment.

```swift
let config = Realm.Configuration(
  // Obtenir l'URL du fichier MyBundledData.realm
  fileURL: Bundle.main.url(forResource: "MyBundledData", withExtension: "realm"),
  // Ouvrir le fichier en mode read-only
  readOnly: true)

// Ouvrir Realm avec la configuration
let realm = try! Realm(configuration: config)
```

Vous avez peut-être remarqué jusqu'à présent que nous avons initialisé l'accès à notre variable de domaine en appelant `Realm()`. Cette méthode renvoie un objet Realm qui correspond à un fichier nommé `default.realm` dans le dossier Documents (iOS) ou dans le dossier Application Support (macOS) de votre application.

**Class subsets**

Dans certains scénarios, vous pouvez souhaiter limiter les classes pouvant être stockées dans Realm. Par exemple, si vous avez deux équipes travaillant sur différents composants de votre application qui utilisent Realm en interne, vous ne souhaiteriez peut-être pas avoir à coordonner les migrations entre elles. Vous pouvez alors le faire en définissant la propriété `objectTypes` de votre `Realm.Configuration`.

### Exemples de configuration

**Configuration - SchemaVersion - ObjectTypes**

```swift
// Initialisation de la configuration
var config = Realm.Configuration()
// Utilisez le répertoire par défaut, mais remplacez le nom de fichier par le nom Category
config.fileURL = config.fileURL!.deletingLastPathComponent().appendingPathComponent("Category.realm")
config.readOnly = false
// Nous verrons cette partie plus tard
config.schemaVersion = 1
config.objectTypes = [Category.self]

Realm.Configuration.defaultConfiguration = config
```

**Configuration - DeleteRealmIfMigrationNeeded**

```swift
var config = Realm.Configuration()
// Définir ceci changera le comportement de gestion des exceptions de migration. Au lieu de lancer une exception
// RealmMigrationNeededException, Realm sur disque sera effacé et recréé avec le nouveau schéma.
config.deleteRealmIfMigrationNeeded = true
config.fileURL = config.fileURL!.deletingLastPathComponent().appendingPathComponent("PRODUCT.realm")
Realm.Configuration.defaultConfiguration = config
```

Vous voyez, ce n'est pas vraiment compliqué de configurer Realm :).

## Model

Realm supporte les propriétés suivantes :
* Bool
* Int
* Int8
* Int16
* Int32
* Int64
* Double
* Float
* String
* Date
* Data

### Attribut de propriété

Les propriétés de modèle Realm doivent posséder l'attribut `@objc dynamic var` pour devenir des accesseurs pour les données de base de données sous-jacentes. Notez que si la classe est déclarée comme `@objcMembers` (Swift 4), les propriétés individuelles peuvent simplement être déclarées comme `dynamic var`.

Il y a trois exceptions à cela : `LinkingObjects`, `List` et `RealmOptional`. Ces propriétés doivent toujours être déclarées avec `let`.

Ce tableau fournit une référence pratique pour déclarer les propriétés du modèle.

| Type           | Non optional                                                            | Optional  |
| -------------  |:------------------------------------------------------------------------:| :---------:|
| Bool           | `@objc dynamic var value = false`                                        | `let value = RealmOptional<Bool>()` |
| Int            | `@objc dynamic var value = 0`                                            | `let value = RealmOptional<Int>()` |
| Float          | `@objc dynamic var value: Float = 0.0`                                   | `let value = RealmOptional<Float>()` |
| Double         | `@objc dynamic var value: Double = 0.0	`                                 | `let value = RealmOptional<Double>()` |
| String         | `@objc dynamic var value = ""`                                           | `@objc dynamic var value: String? = nil` |
| Data           | `@objc dynamic var value = Data()`                                       | `@objc dynamic var value: Data? = nil` |
| Date           | `@objc dynamic var value = Date()`                                       | `@objc dynamic var value: Date? = nil` |
| Object         | n/a: doit être optional                                                    | `@objc dynamic var value: Class?` |
| List           | `let value = List<Type>()`                                               | n/a: doit être non optional |
| LinkingObjects | `let value = LinkingObjects(fromType: Class.self, property: "property")` | n/a: doit être non optional |


### Clé primaire - Indexation de propriétés

Je pense que vous connaissez tous l’intérêt d'une clé primaire et de l'indexation de propriétés, donc je ne m'attarde pas trop sur ces sujet.

Déclaration d'une clé primaire et d'indexation de propriétés Realm :

```swift
class Planet: Object {
    @objc dynamic var id = 0
    @objc dynamic var name = ""

    override static func primaryKey() -> String? {
        return "id"
    }

    override static func indexedProperties() -> [String] {
        return ["name"]
    }
}
```

### Héritage

Realm permet de faire de l'héritage entre modèles. Cependant, voici quelques règles impossibles :

* Le casting entre class polymorphic (ex: sous-classe à sous-classe, sous-classe à parent, parent à sous-classe...)
* Query simultanée sur plusieurs classes
* Plusieurs class containers (`List` et `Results`)

Sinon, je vous recommande d'utiliser le modèle de composition de classes ci-dessous pour créer des sous-classes englobant la logique d'autres classes.

```swift
// Modèle parent
class Car: Object {
    @objc dynamic var price = 0
}

// Modèle qui hérite de Car
class Audi: Object {
    @objc dynamic var car: Car? = nil
    @objc dynamic var sLine = false
}

// Modèle qui hérite de Car
class Bmw: Object {
    @objc dynamic var car: Car? = nil
    @objc dynamic var mDesign = false
}

let audiTT = Audi(value: [ "car": [ "price": 60000 ], "sLine": true ])
let serie1 = Bmw(value: [ "car": [ "price": 15000 ], "mDesign": false])
```

### Collections

Realm a plusieurs types qui aident à représenter des groupes d'objets. On les appelle `Realm collections`:

* `Results`, une classe représentant des objets récupérés à partir de queries ;
* `List`, une classe représentant les relations `to-many` des modèles ;
* `LinkingObjects`, une classe représentant les relations inverses dans les modèles ;
* `RealmCollection`, un protocole définissant l'interface commune à laquelle toutes les collections de Realm se conforment.

**Many-to-one - One-to-one**

Pour définir une relation `many-to-one` ou `one-to-one`, attribuez à un modèle une propriété dont le type est l'une de vos sous-classes `Object`:

```swift
class User: Object {
    // ...
    @objc dynamic var card: Card? = nil // one
}
```

Vous pouvez utiliser cette propriété comme les autres :

```swift
let amex = Card()
amex.type = "Black"
let pepito = User()
pepito.card = amex
```

Lorsque vous utilisez des propriétés `Object`, vous pouvez accéder aux propriétés imbriquées à l'aide de la syntaxe de propriété normale. Par exemple `pepito.card?.type`.

**Many-to-many**

Vous pouvez créer une relation avec n'importe quel nombre d'objets ou de valeurs primitives prises en charge à l'aide des propriétés de `List`. Les `List` peuvent contenir d'autres `Object` ou valeurs primitives d'un seul type et ont une interface très similaire à un `Array` mutable.

```swift
class Book: Object {
    // ...
    let authors = List<Author>()
}
```

Vous pouvez accéder et assigner aux propriétés `List` comme d'habitude :

```swift
let someAuthors = realm.objects(Author.self).filter("name contains 'De la Vega'")
miserables.authors.append(objectsIn: someAuthors)
miserables.authors.append(victorHugo)
```

Les propriétés `List` sont garanties pour préserver leur ordre d'insertion.

### Relations inverses

Realm fournit des propriétés d'objets de liaison pour représenter les relations inverses :

```swift
class Author: Object {
    @objc dynamic var name = ""
    @objc dynamic var age = 0
    let books = LinkingObjects(fromType: Book.self, property: "authors")
}
```

Avec les propriétés des objets de liaison, vous pouvez obtenir tous les objets liés à un objet donné à partir d'une propriété spécifique.

### Création - Mise à jour - Suppression d'objet

**Création**

Pour créer un nouvel objet Realm, rien de plus simple. Vous pouvez le faire de plusieurs façons :

```swift
// (1) Créez un objet User et setter ses propriétes
var pepito = User()
pepito.name = "Pepito"
pepito.age = 100

// (2) Créez un objet User depuis un dictionary
let pepita = User(value: ["name" : "Pepita", "age": 90])

// (3) Créez un object User depuis un array
let lecolasonne = User(value: ["Lecolasonne", 770])
```

Après avoir créé l'objet, vous pouvez ajouter celui-ci à Realm :

```swift
// Obtenir Realm par défault
let realm = try! Realm()
// Vous avez seulement besoin de le faire une fois (par thread)

// Ajouter l'objet à Realm à l'intérieur d'une transaction
try! realm.write {
    realm.add(pepito)
}
```

Après avoir ajouté l'objet à Realm, vous pouvez continuer à l'utiliser et toutes les modifications que vous y apporterez seront conservées (et doivent être effectuées dans une transaction d'écriture). Toutes les modifications sont mises à la disposition des autres threads qui utilisent le même Realm lorsque la transaction d'écriture est validée.

**Mise à jour**

Vous pouvez mettre à jour n'importe quel objet en définissant ses propriétés dans une transaction write.

`Object`, `Result` et `List` sont conformes au principe `key-value coding` (KVC). Ça peut être utile lorsque vous devez déterminer la propriété à mettre à jour lors de l'exécution. Appliquer KVC à une collection est un excellent moyen de mettre à jour les objets en masse sans avoir à gérer l'itération d'une collection tout en créant des accesseurs pour chaque élément.

```swift
let users = realm.objects(User.self)
try! realm.write {
    users.first?.setValue(true, forKeyPath: "isAstronaut")
    // set pour chaque user la valeur Donuts (la meilleure btw) dans la propriété planet
    users.setValue("Donuts", forKeyPath: "planet")
}
```

Si votre classe de modèle inclut une clé primaire, vous pouvez demander à Realm de mettre à jour ou d'ajouter intelligemment des objets en fonction de leurs valeurs de clé primaire en utilisant `Realm().add(_:update:)` :

```swift
let pepito = User()
user.name = "Pepito"
user.age = 29
user.id = 1

// Update l'user avec l'id = 1
try! realm.write {
    realm.add(user, update: true)
}
```

Si un objet User avec clé primaire == '1' existait déjà dans la base de données, cet objet serait simplement mis à jour. S'il n'existait pas, un objet User entièrement nouveau serait créé et ajouté à la base de données. C'est un peu comme un `INSERT INTO ... ON DUPLICATE KEY UPDATE` en SQL.

Vous pouvez également mettre à jour partiellement des objets avec des clés primaires en passant juste un sous-ensemble des valeurs que vous souhaitez mettre à jour, avec la clé primaire :

```swift
// En supposant qu'un user avec la clé primaire `1` existe déjà.
try! realm.write {
    realm.create(User.self, value: ["id": 1, "age": 30], update: true)
    // La propriété `name` restera inchangée.
}
```

> Notez que lors de la mise à jour des objets, `nil` est toujours considéré comme une valeur valide pour les propriétés facultatives. Si vous fournissez un dictionnaire avec des valeurs de propriétés `nil`, elles seront appliquées à votre objet et ces propriétés seront donc vidées.

**Suppression d'objet**

Pour supprimer un objet, passez celui-ci à la méthode `Realm().Delete(_ :)` dans une transaction d'écriture.

```swift
try! realm.write {
    realm.delete(userPeppito)
}
```

Vous pouvez également supprimer tous les objets stockés dans Realm. Notez que le fichier Realm conservera sa taille sur le disque pour réutiliser efficacement cet espace pour les futurs objets.

```swift
try! realm.write {
    realm.deleteAll()
}
```

### Queries - Filtres - Tries

**Queries**

Les requêtes renvoient une instance `Results`, qui contient une collection d'`Object`. `Results` a une interface très similaire à `Array` et les objets contenus dans un `Results` peuvent être consultés en utilisant un indice indexé. Contrairement aux `Array`, les `Results` contiennent uniquement des objets d'un type de sous-classe unique.

Toutes les requêtes (y compris les requêtes et l'accès aux propriétés) sont `lazy` dans Realm. Les données sont uniquement lues lorsque les propriétés sont accessibles.

Les résultats d'une requête ne sont pas des copies de vos données. La modification des résultats d'une requête (dans une transaction d'écriture) modifiera directement les données sur le disque.

```swift
// Vous savez déjà écrire une query :)
let users = realm.objects(User.self)
```

L'exécution d'une requête est différée jusqu'à ce que les résultats soient utilisés. Cela signifie que l'enchaînement de plusieurs `Results` temporaires pour trier et filtrer vos données n'effectue pas de travail supplémentaire pour traiter l'état intermédiaire.

**Filtres**

Si vous êtes familier avec `NSPredicate`, alors vous savez déjà comment faire pour Realm. `Objects`, `Realm`, `List` et `Results` fournissent tous des méthodes qui vous permettent d'interroger des instances d'`Object` spécifiques en transmettant simplement une instance `NSPredicate`, une chaîne de prédicat ou une chaîne de format de prédicat comme vous le feriez pour un `NSArray`.

```swift
// Query utilisant un predicat String
var pepitos = realm.objects(User.self).filter("age = 30 AND name BEGINSWITH 'P'")

// Query utilisant un NSPredicate
let predicate = NSPredicate(format: "age = %d AND name BEGINSWITH %@", 30, "B")
pepitos = realm.objects(User.self).filter(predicate)
```

Pour plus d'informations sur comment construire des predicats dans [Realm](https://academy.realm.io/posts/nspredicate-cheatsheet/).

**Tries**

`Results` vous permet de spécifier un critère de tri et un ordre basés sur un chemin de clé, une propriété ou sur un ou plusieurs descripteurs de tri. Par exemple, les appels suivants trient par ordre alphabétique les users :

```swift
let pepitos = realm.objects(User.self).filter("age = 30 AND name BEGINSWITH 'P'").sorted(byKeyPath: "name")
```

Notez que `sorted(byKeyPath:)` et `sorted(byProperty:)` ne supportent pas plusieurs propriétés comme critères de tri, et ne peuvent pas être chaînés (seul le dernier appel à trier sera utilisé). Pour trier selon plusieurs propriétés, utilisez la méthode `sorted(by:)` avec plusieurs objets `SortDescriptor`.

> Chaînage des requêtes : un des avantages du moteur de requête de Realm est sa capacité à enchaîner des requêtes avec très peu de surcharge transactionnelle par rapport aux bases de données traditionnelles.

> ⚠ Attention !

Plusieurs choses à savoir  sur Realm :

* Realm n'a pas de mécanisme pour les propriétés d'auto-incrémentation thread-safe / process-safe couramment utilisées dans d'autres bases de données lors de la génération de clés primaires. Cependant, dans la plupart des situations où une valeur auto-générée unique est souhaitée, il n'est pas nécessaire d'avoir des identifiants séquentiels, contigus et entiers. Une clé primaire de chaîne unique est généralement suffisante. Un modèle courant consiste à définir la valeur de la propriété par défaut via `NSUUID().UUIDString` pour générer des IDs de chaînes uniques ;
* Les noms de classe sont limités à un maximum de 57 caractères UTF8 ;
* Les noms de propriétés sont limités à un maximum de 63 caractères UTF8 ;
* Les propriétés `Data` et `String` ne peuvent pas contenir de données d'une taille supérieure à 16 Mo. Pour stocker de plus grandes quantités de données, vous pouvez soit les décomposer en blocs de 16 Mo, soit les stocker directement sur le système de fichiers, en stockant les chemins d'accès à ces fichiers dans Realm. Une exception sera levée au moment de l'exécution si votre application tente de stocker plus de 16 Mo dans une seule propriété ;
* Un seul fichier Realm ne peut pas être plus grand que la quantité de mémoire que votre application serait autorisée à mapper dans iOS. Cela change par périphérique, et dépend de la fragmentation de l'espace mémoire à ce moment-là (il y a un [radar](http://www.openradar.me/17119975) ouvert sur ce problème). Si vous avez besoin de stocker plus de données, vous pouvez le mapper sur plusieurs fichiers Realm.

## Migration

Lorsque vous travaillez avec n'importe quelle base de données, il est probable que votre modèle de données change avec le temps. Étant donné que les modèles de données dans Realm sont définis comme des classes Swift standard, il est aussi facile de modifier un modèle que de changer une autre classe Swift.

Supposons que nous ayons le modèle User suivant :

```swift
class User: Object {
    @objc dynamic var firstName = ""
    @objc dynamic var lastName = ""
    @objc dynamic var age = 0
}
```

Nous voulons mettre à jour le modèle de données pour exiger une propriété `fullName`, plutôt que de séparer les noms et prénoms. Pour ce faire, nous changeons simplement l'interface de l'objet en :

```swift
class User: Object {
    @objc dynamic var fullName = ""
    @objc dynamic var age = 0
}
```

À ce stade, si vous avez sauvegardé des données avec la version précédente du modèle, il y aura un décalage entre ce que Realm voit défini dans le code et les données que Realm voit sur le disque. Lorsque cela se produit, une exception sera levée lorsque vous essayez d'ouvrir le fichier existant, sauf si vous exécutez une migration ou que vous configurez Realm avec `DeleteRealmIfMigrationNeeded`.

Les migrations sont définies en définissant `Realm.Configuration.schemaVersion` et `Realm.Configuration.migrationBlock`.
Votre bloc de migration fournit toute la logique de conversion des modèles de données des schémas précédents vers le nouveau schéma.

Lors de la création de Realm avec cette configuration, le bloc de migration sera appliqué pour mettre à jour Realm vers la version de schéma donnée si une migration est nécessaire.

Supposons que nous souhaitons migrer le modèle User déclaré plus haut. Le bloc de migration minimal nécessaire serait le suivant :

```swift
let config = Realm.Configuration(
    // Définir la nouvelle version du schéma. Elle doit être supérieure à la version précédemment utilisée
    // Si vous n'avez jamais défini de version de schéma auparavant, la version est 0
    schemaVersion: 1,

    // Définir le bloc qui sera appelé automatiquement lors de l'ouverture de Realm
    // avec une version de schéma inférieure à celle définie ci-dessus
    migrationBlock: { migration, oldSchemaVersion in
        // Nous n'avons encore rien migré, alors oldSchemaVersion == 0
        if (oldSchemaVersion < 1) {
            // Rien à faire !
            // Realm détectera automatiquement les nouvelles propriétés et les propriétés supprimées
            // et mettra à jour le schéma sur le disque
        }
    }
)
```

Au minimum, nous devons mettre à jour la version avec un bloc vide pour indiquer que le schéma a été mis à jour (automatiquement) par Realm.

Bien que ce soit la migration minimale acceptable, nous voulons probablement utiliser ce bloc pour remplir toutes les nouvelles propriétés (dans le cas du `fullName`) avec quelque chose de significatif. Dans le bloc de migration, nous pouvons appeler `Migration().enumerateObjects(ofType: _:_:)` pour énumérer chaque `Object` d'un certain type, et appliquer toute logique de migration nécessaire. Notez comment, pour chaque énumération, on accède à l'instance `Object` existante via une ancienne variable `oldObject` et on accède à l'instance mise à jour via `newObject`:

```swift
Realm.Configuration.defaultConfiguration = Realm.Configuration(
    schemaVersion: 1,
    migrationBlock: { migration, oldSchemaVersion in
        if (oldSchemaVersion < 1) {
            // La méthode enumerateObjects(ofType:_:) itère
            // sur chaque objet User stocké dans le fichier Realm
            migration.enumerateObjects(ofType: User.className()) { oldObject, newObject in
                // combiner les champs dans un seul champ
                let firstName = oldObject!["firstName"] as! String
                let lastName = oldObject!["lastName"] as! String
                newObject!["fullName"] = "\(firstName) \(lastName)"
            }

            // Renommez la propriété age en yearsSinceBirth
            migration.renameProperty(onType: User.className(), from: "age", to: "yearsSinceBirth")
        }
    })
```

## Notification

Il est possible d'enregistrer un listener pour recevoir des notifications de modifications Realm ou ses entités.

Pour ce faire, les notifications sont envoyées tant qu'une référence est conservée sur le token de notification renvoyé. Vous devez conserver une référence forte à ce token dans la classe qui enregistre les mises à jour, car les notifications sont automatiquement désinscrites lorsque le token de notification est désalloué. Les notifications sont toujours envoyées sur le thread sur lequel elles étaient initialement enregistrées. Ce thread doit avoir une boucle d'exécution en cours d'exécution. Après la validation de chaque transaction d'écriture pertinente, les gestionnaires de notification sont appelés de manière asynchrone, quel que soit le thread ou le processus sur lequel la transaction d'écriture a eu lieu.

Chaque fois qu'une transaction d'écriture impliquant Realm est validée, quel que soit le thread ou le processus sur lequel la transaction d'écriture a eu lieu, le gestionnaire de notification sera déclenché :

```swift
// Observe Realm Notifications
let token = realm.observe { notification, realm in
    viewController.updateUI()
}

// Plus tard
token.invalidate()
```

Dans un cas concret, vous pouvez avoir un code comme ceci :

```swift
class ViewController: UITableViewController {
    var notificationToken: NotificationToken? = nil

    override func viewDidLoad() {
        super.viewDidLoad()
        let realm = try! Realm()
        let results = realm.objects(User.self).filter("age > 5")

        // Observe Results Notifications
        notificationToken = results.observe { [weak self] (changes: RealmCollectionChange) in
            guard let tableView = self?.tableView else { return }
            switch changes {
            case .initial:
                // Les résultats sont maintenant populés et peuvent être consultés sans bloquer l'interface utilisateur
                tableView.reloadData()
            case .update(_, let deletions, let insertions, let modifications):
                // Les résultats des requêtes ont changé, alors appliquez-les à UITableView
                tableView.beginUpdates()
                tableView.insertRows(at: insertions.map({ IndexPath(row: $0, section: 0) }),
                                     with: .automatic)
                tableView.deleteRows(at: deletions.map({ IndexPath(row: $0, section: 0)}),
                                     with: .automatic)
                tableView.reloadRows(at: modifications.map({ IndexPath(row: $0, section: 0) }),
                                     with: .automatic)
                tableView.endUpdates()
            case .error(let error):
                // Une erreur s'est produite lors de l'ouverture du fichier Realm sur le thread en background
                fatalError("\(error)")
            }
        }
    }

    deinit {
        notificationToken?.invalidate()
    }
}
```

Ces modifications sont accessibles via le paramètre RealmCollectionChange transmis au bloc de notification. Cet objet contient des informations sur les indices affectés par les suppressions, les insertions et les modifications.

## Encryption

Realm prend en charge le cryptage du fichier de base de données sur disque avec AES-256 + SHA2 en fournissant une clé de cryptage de 64 octets lors de la création de Realm.

```swift
// Generez une clé de chiffrement random
var key = Data(count: 64)
_ = key.withUnsafeMutableBytes { bytes in
    SecRandomCopyBytes(kSecRandomDefault, 64, bytes)
}

let config = Realm.Configuration(encryptionKey: key)
do {
    let realm = try Realm(configuration: config)
    let users = realm.objects(User.self).filter("name contains 'Pepi'")
} catch let error as NSError {
    fatalError("Error opening realm: \(error)")
}
```

Realm fait en sorte que toutes les données stockées sur le disque soient cryptées et décryptées de manière transparente avec AES-256 selon les besoins, et vérifiées avec un HMAC SHA-2. La même clé de chiffrement doit être fournie chaque fois que vous obtenez une instance Realm.

> Il y a un faible impact sur les performances (généralement moins de 10% plus lent).

## Test Unitaire

La façon la plus simple d'utiliser et de tester votre application sous Realm est d'utiliser `inMemoryIdentifier` pour chaque test :

```swift
import XCTest

class TestCaseBase: XCTestCase {
    override func setUp() {
        super.setUp()

        // Utilisez Realm en mémoire via le nom du test en cours.
        // Cela garantit que chaque test ne peut pas accidentellement accéder ou modifier les données
        // d'autres tests ou de l'application elle-même, et parce qu'ils sont en mémoire,
        // il n'y a rien à nettoyer.
        Realm.Configuration.defaultConfiguration.inMemoryIdentifier = self.name
    }
}
```

Regardons un simple benchmark sur MacBook Pro 2.8 GHz Intel Core i7, 16 Go 1600 MHz DDR3, stockage Flash, l'exécution de la suite de tests sur un simulateur iOS, nous obtenons ces résultats :

* 100 accès en mémoire ~0.05 secondes vs sur disque ~0.08 secondes
* 1000 accès en mémoire ~0.20 secondes vs sur disque ~0.41 secondes
* 10000 accès en mémoire ~1.72 secondes vs sur disque ~4.66 secondes

Où 1 accès = configure, écrire, détruis Realm.

## Realm Studio

Realm met à disposition un petit [outil](https://realm.io/products/realm-studio#download-studio) qui permet de visualiser votre base de donnée et d’interagir avec.

![realmStudo]({{site.baseurl}}/assets/2018-02-24-realm-coredata-killer/realm-studio.png)

Pratique, non ?

Si vous avez besoin de trouver votre fichier Realm de votre app, checkez la réponse [StackOverflow](https://stackoverflow.com/questions/28465706/how-to-find-my-realm-file/28465803#28465803) pour avoir le détail des instructions.

## Conclusion

J'espère que cet article vous aura convaincu d'utiliser Realm. Sa simplicité, ses performances et sa communauté font qu'il s'est imposé dans le monde du mobile.
