---
contentType: article
lang: fr
date: '2017-08-09'
slug: android-design-pattern
title: Android et les Design Patterns
excerpt: >-
  Nous allons voir à travers cet article jusqu'à quel point on peut appliquer
  les principaux Design Patterns dans un projet Android
cover: /assets/2017-08-02-android-design-pattern/cover.jpg
categories: []
authors:
  - obennouna
keywords:
  - mobile
  - android
  - applications mobile
  - mvc
  - mvp
  - mvvm
  - databinding
---
Aujourd'hui nous allons voir jusqu'à quel point on peut implémenter le plus rigoureusement possible certains Design Patterns. En effet nous allons les séparer en deux catégories :
 - Design Patterns structurants
 - Design Patterns non structurants

Concernant les Design Patterns structurants, nous allons voir en détail les trois plus connus, à savoir :
 - MVC
 - MVP
 - MVVM

Enfin concernant les non structurants, nous n'allons en survoler que quelques-uns car nous allons surtout nous intéresser à la première catégorie.

> **Petit rappel :**
> Android est l'OS mobile développé par Google utilisant le langage JAVA (et Kotlin récemment mais nous en parlerons une autre fois) pour la partie développement. Pour en savoir plus il n'y a pas mieux que la [documentation officielle](https://developer.android.com/index.html).

Néanmoins Android a une particularité par rapport au JAVA : le SDK est déjà structurant.

Avant de commencer à rentrer dans le vif du sujet, il est important de noter certaines différences cruciales avec une application en JAVA (Desktop par exemple) afin de comprendre jusqu'à quel point on peut suivre les différents Design Patterns.

En effet, un nouveau projet en JAVA ne contient que la méthode main qui sert de point de départ ce qui nous laisse une totale liberté de l'architecture du projet :
```Java
public static void main(String[] args) {
    System.out.println("Hello World");
}
```
Maintenant si on regarde de plus près un nouveau projet Android on se retrouve avec ceci :
```Java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}

```
Plusieurs choses ont changé :
- On est obligé d'hériter une classe type **Activity** (AppCompatActivity / Activity / etc...)
- La méthode main a disparu pour laisser place à une méthode **surchargée** : **onCreate**
- Cette méthode **onCreate** devient notre nouveau point d'entrée
- Enfin la méthode setContentView qui permet d'assigner une **vue** à notre Activity

 > **Note:**
 > Si vous avez remarqué on commence déjà à "subir" une implémentation en parlant d'héritage ou de vue alors que le projet est à peine créé, car le SDK impose un certain MVC

# MVC


Rien de mieux qu'un schéma pour illustrer une implémentation MVC

![MVC Android]({BASE_URL}/imgs/articles/2017-08-02-android-design-pattern/mvc.png)

Maintenant essayons d'attribuer chaque partie constituant un projet Android à un élément de ce pattern, on se retrouve avec :
- **Modèle** : Une classe qui contiendra notre modèle (jusque-là rien de particulier)
- **Contrôleur** : Il s'agit de l'Activity (ou fragment), vu qu'elle va remonter les interactions utilisateurs et mettre à jour nos vues.
- **Vue** : Cela correspond aux fichiers layout en .XML

En creusant un peu on peut se rendre compte de quelques détails.

Tout d'abord, on peut définir l'action à faire lors d'un clic sur un bouton, par exemple via l'Activity, mais aussi depuis le layout .XML. La vue reprend une partie de la gestion de l'interaction avec l'utilisateur et donc une partie des responsabilités du contrôleur.

```JAVA
<!-- XML -->
<Button android:id="@+id/decollage"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="On décolle !"
    android:onClick="goIntoSpace" />

<!-- JAVA -->
public void goIntoSpace(View view) {
    // C'est parti !
}
```
Ou alors :
```JAVA
Button btn = (Button) findViewById(R.id.decollage);

btn.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        // On décolle !
    }
});
```

Maintenant intéressons-nous à l'interaction entre la vue et son modèle. D'abord, on note que le modèle est complètement indépendant car il ne possède aucun lien avec une vue ou un contrôleur.
Ensuite, et c'est le point le plus important, la vue devrait avoir connaissance de son modèle afin de pouvoir lire les informations dont elle a besoin, sauf que sur Android **il est impossible d'indiquer à la vue quel modèle elle utilise.**

Effectivement, le SDK Android nous propose déjà une panoplie de vues (Champ texte, checkbox etc...) qui ne prennent pas un modèle en paramètre mais directement des données brutes (Chaîne de caractère, entier etc...).

**Exemple :**
Prenons un formulaire de contact avec les champs suivants :
 - Nom
 - Prénom
 - Mail
 - Message

Le modèle correspondant sera une classe avec quatre champs `String` pour chaque attribut. Seulement notre layout n'aura jamais connaissance d'un objet de ce type, mais uniquement des quatre champs qui lui auront été fournis (Grâce à une Activity / Fragment ou autre **contrôleur**).

> Et les ViewModels ?

En effet la première contradiction est le DataBinding, car on lie explicitement un modèle à la vue. Seulement notre modèle se transforme en ViewModel, ce qui nous amène plus à du "MVMC" (Model - ViewModel - Controller) et non plus à du MVC "classique".

La seconde méthode, beaucoup moins jolie, consiste à se fabriquer des vues personnalisées permettant de leur attacher un modèle tel que c'est prévu dans le MVC.

Au final, si l'on veut respecter scrupuleusement cette implémentation, on se retrouve obligé de tordre le code pour créer le lien entre la vue et son modèle, sinon on se retrouve avec quelque chose qui ressemble étrangement à du MVP (voir MVVM)

![MVC / MVP Android]({BASE_URL}/imgs/articles/2017-08-02-android-design-pattern/mvp-mvc-android.jpg)

<span style="color:green">+</span>
----------
 - Le SDK nous fournit déjà un projet tout prêt pour du MVC
 - Il s'agit d'un des Patterns les plus connus et donc très bien documenté, utilisé etc...
 - Il empêche la création de "god" application, voire de "god" classe

<span style="color:red">-</span>
----------
 - Comme on a vu plus haut, son respect le plus strict peut s'avérer compliqué.
 - Il centralise énormément l'aspect "fonctionnel" de l'application (seul le contrôleur sait ce qui doit être fait)
 - Un code respectant scrupuleusement le MVC n'est pas forcément très lisible car si l'on prend un layout .XML tout seul (ou un modèle) on ne peut pas voir ce qui est affiché, ni comment.


# MVP


Encore une fois, un schéma pour expliquer l'implémentation d'un MVP

![MVP Android]({BASE_URL}/imgs/articles/2017-08-02-android-design-pattern/mvp.png)

La différence la plus marquante avec le MVC est la disparition de l'interaction entre la vue et le modèle. Cette absence d'interaction tombe à pic pour Android, car on se retrouve avec l'intégration suivante :
- **Modèle** : Une classe qui contiendra notre modèle
- **Présenteur** : Il s'agit de l'Activity (ou fragment)
- **Vue** : Cela correspond aux fichiers layout en .XML

Voici un exemple d'implémentation (très basique) d'un MVP :

```JAVA
@Override
protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   setContentView(R.layout.activity_main);

   // Model
   Post post = new Post();

   // Presenter
   TextView textView = findViewById(R.id.title);
   textView.setText(post.getTitle());
}
```

Notre vue n'a pas changé et est toujours portée par le layout .XML.
Le modèle non plus, il peut s'agir d'une simple classe JAVA avec X attributs / accesseurs.
La présentation, c'est-à-dire celle qui va indiquer quel contenu mettre dans quel champ, est faite exclusivement par l'Activity (ou fragment) sans autre interaction.

> Sans s'en rendre compte, la plupart des projets respectent plus le MVP que le MVC car il est plus naturel de laisser l'Activity gérer ce qui doit être affiché que d'essayer de lier la vue et son modèle.

<span style="color:green">+</span>
----------
 - Les mêmes point positifs que le MVC
 - Il supprime une des grosses contraintes du MVC (à savoir le lien entre la vue et le modèle) et épouse beaucoup plus l'architecture de base d'Android
 - Il peut amener à respecter encore plus les principes [SOLID](https://fr.wikipedia.org/wiki/SOLID_(informatique))

<span style="color:red">-</span>
----------
 - La logique de l'application est encore plus concentrée dans la présentation
 - La vue et le modèle ne sont plus que des "squelettes" et ne contiennent que très peu, voire pas de logique


# MVVM

Enfin le dernier Design Pattern structurant parmi les plus utilisés est le MVVM.

![MVVM Android]({BASE_URL}/imgs/articles/2017-08-02-android-design-pattern/mvvm.png)

Il se distingue grandement des deux précédents car il attribue beaucoup plus d'intelligence à la vue ainsi qu'au ViewModel.

En effet chaque vue d'un layout est liée à un ViewModel qui lui fournit les données spécifiques à afficher. Ces données peuvent être un texte, une couleur, une liste d'éléments etc...

```JAVA
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">

    <data>

        <variable
            name="model"
            type="com.elevenlabs.viewmodel.MainViewModel" />
    </data>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="@dimen/material_spacing">

        <TextView
            android:id="@+id/title"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:textStyle="bold"
            android:text="@{model.title}"/>
    </LinearLayout>
</layout>
```
```JAVA
public class MainViewModel extends BaseObservable {

    private Post mPost;

    MainViewModel(Post post) {
        this.mPost = post;
    }

    public String getTitle() {
        return mPost.getTitle();
    }
}
```

La TextView ne contient plus de données statiques (par exemple `@string/app_title` ou autre chaîne de caractères statique) mais devient dynamique : son contenu dépend maintenant du champ `title` de son ViewModel.


 > **Note:**
 > Une subtilité s'est glissée dans cet exemple : le champ `title` n'existe pas. En effet notre seul attribut s'appelle `mTitle` , en private, mais possède une méthode `getTitle` qui est publique.
 > Le DataBinding Android permet d'appeler le getter comme s'il correspondait à un attribut (si ce getter respecte une certaine nomenclature).
 > Dans notre cas puisque le getter s'appelle `getTitle`, le DataBinding va pouvoir nous permettre de l'appeler comme si on avait un attribut `title` qui existait.
 > Bien sûr rien ne nous empêche de l'appeler directement : `android:text="@{model.getTitle()}"`

Maintenant reste une étape très importante : générer nos ViewModels. On peut le faire directement dans une Activity ou un Fragment par exemple :

```JAVA
@Override
protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   MainActivityBinding binding = DataBindingUtil.setContentView(this, R.layout.main_activity);

   // Création du modèle
   Post post = new Post("Eleven Labs !");

   // Création du ViewModel
   MainViewModel viewModel = new MainViewModel (post);
   binding.setUser(viewModel);
}
```
Seul le MVVM permet d'apporter une indépendance certaine qu'il serait dommage de ne pas utiliser.
On peut, par exemple, envisager de déléguer cette tâche à un BusinessService qui pourra générer les ViewModels en fonction de la source de données (locales, via appel REST etc...) et leur appliquer une logique, un traitement etc...

```JAVA
private MainActivityBinding mBinding;
private MainActivityBusinessService mService;

@Override
protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   mBinding = DataBindingUtil.setContentView(this, R.layout.main_activity);
   mService = new MainActivityBusinessService();

   MainViewModel viewModel = mService.generateViewModel();
   binding.setUser(viewModel);
}
```
L'un des avantages de cette approche est de proposer du code plus clair et lisible en définissant le rôle de chaque partie très clairement et ce jusqu'au XML.

<span style="color:green">+</span>
----------
 - Notre .XML est bien plus intelligent et clair
 - Moins de code Boiler Plate avec l'absence des `findViewById`.
 - Il permet l'utilisation des [Binding Adapter](https://developer.android.com/reference/android/databinding/BindingAdapter.html)
 - Grâce à l'utilisation de `BaseObservable`, on peut rafraîchir la vue dès que le ViewModel subit un changement, ce qui évite toute gestion manuelle du rafraîchissement.

<span style="color:red">-</span>
----------
 - Approche complètement différente des Design Patterns qui peut perturber.
 - Sur un projet existant, une migration s'impose voir une refonte, ce qui peut prendre du temps.


# Design Patterns non structurants

Les Design Pattern qui ne sont pas structurants, c'est-à-dire qui ne façonnent pas entièrement l'architecture d'une application, n'ont pas de particularité d'implémentation sur Android.

Par exemple, le Singleton est implémenté exactement de la même manière que sur une autre plateforme. Il en va de même pour la Factory.

Concernant le Design Pattern Observer, il est très répandu grâce à la profusion des listeners (Cf. [Android : Pourquoi j'aime les Listeners]({BASE_URL}/fr/android-listeners/)), mais aussi et surtout aux librairies tels qu'[Otto](http://square.github.io/otto/) de Square, [EventBus](https://github.com/greenrobot/EventBus) de GreenRobot ou même encore [Guava](https://github.com/google/guava/wiki/EventBusExplained) de Google.

# Conclusion

Android nous offre énormément de possibilités quant aux moyens de bien structurer notre code et de bien l'organiser. Je suis, à titre personnel, un fan du Databinding qui permet enfin de donner un peu plus d'intelligence à mes layouts et pouvoir explicitement lui indiquer comment et avec quoi se remplir.

Ensuite il est tout à fait possible de faire cohabiter plusieurs Design Pattern, je pense notamment au MVC/MVP et MVVM. Si l'on rajoute un élément extérieur à notre trio qui va s'occuper, par exemple, de générer des ViewModels, il peut être considéré comme un pseudo-Presenter ou pseudo-Controller, car il va se charger d'ajouter ou de modifier des données à afficher (en interagissant avec les ViewModels).

Pour terminer, je n'ai pas souhaité parler de librairies d'injection tel que [Dagger 2](https://github.com/google/dagger) (car ça s'assimile à de la Factory) ou encore de librairies très structurantes tel que [RxJava](https://github.com/ReactiveX/RxJava) (qui apporte la notion de React Programming certes, mais qui dans certains cas essaye aussi de contourner certains comportements de base d'Android).

> Embrace Android do not fight it

Et vous, quel Design Pattern vous plaît le plus ?
