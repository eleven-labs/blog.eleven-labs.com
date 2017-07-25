---
layout: post
title: "Realm, coreData killer"
excerpt: "Realm, coreData killer"
permalink: /fr/realm-coredata-killer
authors:
  - ibenichou
categories:
    - Swift
    - Mobile
tags:
    - swift
    - xcode
    - realm
    - coreData
    - database
image:
    path: /assets/2017-07-18-realm-coredata-killer/realm.png
    height: 100
    width: 100
---

Realm Mobile Database est une alternative de SQLite et de Core Data.
A travers cet article vous allez apprendre et apprécier Realm.

# Benchmark

<img src="/assets/2017-07-18-realm-coredata-killer/realm_benchmarks_count.png"  width="600" />
<img src="/assets/2017-07-18-realm-coredata-killer/realm_benchmarks_insert.png" width="600" />
<img src="/assets/2017-07-18-realm-coredata-killer/realm_benchmarks_queries.png" width="600" />

On voit clairement que Realm en a sous le capot !

Comment Realm fait il pour avoir de t'elle performance ?
Il s'appuie sur les concepts de :

* [Data Structure Alignment](https://en.wikipedia.org/wiki/Data_structure_alignment)
* [Cache](https://en.wikipedia.org/wiki/Cache_(computing)) & [Vectorization](https://en.wikipedia.org/wiki/Vectorization)
* [Zero copy](https://en.wikipedia.org/wiki/Zero-copy) architecture

# Installation

Après avoir créer un nouveau projet vous allez initialiser un Podfile via [Cocoapods](https://cocoapods.org/)

```shell
$ pod init
```

Si vous utilisez une version supérieur à 1.1.0 de Cocoapods, coller le code (post_install) à la fin de votre Podfile.
Ce petit bout de code permet d'éviter le lancement d'assistance de migration.

```ruby
# Podfile
target 'realmArtcile' do
  use_frameworks!

  pod 'RealmSwift'

  target 'realmArtcileTests' do
    inherit! :search_paths

    pod 'RealmSwift'

  end

  target 'realmArtcileUITests' do
    inherit! :search_paths

    pod 'RealmSwift'

  end

end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_VERSION'] = '3.0'
    end
  end
end
```

```shell
$ pod install
```

Maintenant vous pouvez ouvrir votre projet `*.xcworkspace`

# Model

Nous allons créer notre première classe model Planète.

Realm supporte les propriétes suivantes :
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

# Realm Browser

Realm met à disposition un petit [outil](https://itunes.apple.com/app/realm-browser/id1007457278) qui permet de visualiser votre base de donnée et d'intéragir avec.

<img src="https://realm.io/assets/img/docs/browser.png" />

Pratique non ?

Si vous avez besoin de trouver votre fichier Realm de votre app, checkez la réponse [StackOverflow](https://stackoverflow.com/questions/28465706/how-to-find-my-realm-file/28465803#28465803) pour avoir le détail des instructions.
