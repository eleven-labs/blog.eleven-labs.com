---
layout: post
title: Android et les Design Pattern
excerpt: Nous allons voir à travers cet article jusqu'à quel point peut-on appliquer les principaux Design Pattern dans un projet Android 
authors:
    - obennouna
date: '2017-08-02 22:21:00 +0100'
date_gmt: '2017-08-02 21:21:00 +0100'
permalink: /fr/android-design-pattern/
categories:
    - mobile
tags:
    - mobile
    - android
    - applications mobile
    - mvc
    - mvp
    - mvvm
    - databinding
---
Aujourd'hui nous allons nous intéresser à Android et plus particulièrement aux Design Pattern que l'on peut utiliser et jusqu'à quel point peut-on les appliquer.
 > Android est l'OS mobile développé par Google utilisant le langage JAVA (et Kotlin récemment mais nous en parlerons une autre fois) pour la partie développement. Néanmoins il a une particularité par rapport au JAVA brut, c'est que le SDK est déjà structurant lors de sa création.
 
Un nouveau projet en JAVA ne contient que la méthode main qui sert de point de départ :
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
- On est obligé d'hériter d'une classe type **Activity** (AppCompatActivity / Activity / etc...)
- La méthode main a disparu pour laisser place à une méthode **surchargée** : **onCreate**
- Cette méthode **onCreate** devient notre nouveau point d'entré
- Enfin la méthode setContentView qui permet d'assigner une **vue** à notre Activity

 > **Note:**
 > Si vous avez remarqué on commence déjà à "subir" une implémentation en parlant d'héritage ou de Vue alors que le projet est à peine créé, car le SDK est déjà structurant de base et impose un certain MVC
 
# MVC


Rien de mieux qu'un schéma pour illustrer une implémentation MVC

![MVC Android](/assets/2017-08-02-android-design-pattern/mvc.png)

Maintenant essayons d'attribuer chaque partie constituant un projet Android à un élément de ce pattern, on se retrouve avec :
- **Model** : Une classe qui contiendra notre model, jusque-là rien de particulier
- **Controller** : Il s'agit de l'Activity, vu qu'elle va remonter les interactions utilisateurs et mettre à jour nos vues. 
- **Vue** : Cela correspond aux fichiers layout en .xml

En creusant un peu on peut se rendre compte de quelques détails.

Tout d'abord, on peut définir l'action à faire lors d'un clique sur un bouton via le layout .xml, mais aussi depuis l'Activity (donc le Controller et la View peuvent faire la même chose).
```JAVA
<!-- XML -->
<Button android:id="@+id/decollage"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="On décolle !"
    android:onClick="goIntoSpace" />
    
<!-- JAVA -->
public void goIntoSpace(View view) {
    // C'est partit !
}
```
Ou alors 
```JAVA
Button btn = (Button) findViewById(R.id.decollage);

btn.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        // On décolle !
    }
});
```

Ensuite, il n'est pas naturel de donner au model la possibilité de changer la vue ou au moins de notifier la vue du changement.
Cela induit que le model devra garder une référence sur la vue constamment, ou alors la vue devra fournir un Listener au model pour être notifié du changement (A lire à ce sujet : [Android : Pourquoi j'aime les Listeners](https://eleven-labs.github.io//fr/android-listeners/))

Au final si l'on veut respecter scrupuleusement cette implémentation, on se retrouve obligé de tordre un peu notre code pour créer le lien entre le model et notre vue, sinon on se retrouve avec quelque chose qui ressemble étrangement à du MVP



![MVC / MVP Android](/assets/2017-08-02-android-design-pattern/mvp-mvc-android.jpg)


# MVP


Encore une fois un schéma pour expliquer l'implémentation d'un MVP

![MVP Android](/assets/2017-08-02-android-design-pattern/mvp.png)

Sans s'en rendre compte la plupart des projets lorsqu'on commence dans le développement Android respectent plus le MVP que du MVC.

Maintenant on peut envisager deux implémentations différentes du MVP :
- Le Controller du MVC se transforme en Presenter du MVP
- Le Controller du MVC se transforme en View du MVP, puis on créé un Presenter qui fera le lien avec le Model

Lorsqu'on débute dans le développement Android on se retrouve à se baser sur un MVP, peut-être inconsciemment,  où l'Activity joue le rôle du Presenter, la View toujours porté par les layout .xml et le Model à part.

Néanmoins on peut essayer de faire porter le rôle de View à l'Activity et donner le rôle de Presenter à une autre classe.

![MVP Android](/assets/2017-08-02-android-design-pattern/mvp2.png)

# MVVM

Enfin le dernier Design Pattern structurant parmi les plus utilisés est le MVVM.

![MVVM Android](/assets/2017-08-02-android-design-pattern/mvvm.png)

Il se distingue grandement des deux précédents car il attribue beaucoup plus d'intelligence à la vue permettant de les rendre très indépendante.

En effet chaque vue d'un layout se gère tout seul en demandant au ViewModel de lui fournir une donnée spécifique à afficher. Cette donnée peut être un texte, une couleur, une liste d'élément etc...

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
On remarque ici que le champs `android:text` n'est plus statique mais devient dynamique, car il dépend maintenant du champs `title` de son ViewModel.

```JAVA
public class MainViewModel extends BaseObservable {

    private String mTitle;

    MainViewModel(String title) {
        this.mTitle = title;
    }

    public String getTitle() {
        return mTitle;
    }
}
```

 > **Note:**
 > Une subtilité s'est glissée dans cet exemple : le champs `title` n'existe pas. En effet notre seul attribut s'appelle `mTitle` , en private, mais possède une méthode `getTitle` qui est public. 
 > Le DataBinding Android permet d'appeler le getter comme s'il correspondait à un attribut (si ce getter respecte une certaine nomenclature).
 > Dans notre cas puisque le getter s'appelle `getTitle`, le DataBinding va pouvoir nous permettre de l'appeler comme si on avait un attribut `title` qui existait.
 > Bien sûr rien ne nous empêche de l'appeler directement : `android:text="@{model.getTitle()}"` 

Maintenant pour générer nos ViewModels, on peut le faire directement dans une Activity ou un Fragment par exemple.

```JAVA
@Override
protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   MainActivityBinding binding = DataBindingUtil.setContentView(this, R.layout.main_activity);
   MainViewModel viewModel = new MainViewModel ("Eleven Labs !");
   binding.setUser(viewModel);
}
```
Seulement on se rend compte que le MVVM permet d'apporter une certaine indépendance, qu'il serait dommage de ne pas en profiter. On peut, par exemple, envisager de déléguer cette tâche à un BusinessService qui pourra générer les ViewModels en fonction de la source de donnée (locale, via appel REST etc...).

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
L'un des avantages de cette approche et de permettre de proposer du code le plus clair et lisible possible car le rôle de chaque partie de ce code est définit très clairement et ce jusqu'au XML.

#Singleton / Observer / Factory ...

Les Design Pattern qui ne sont pas structurant, c'est-à-dire qui ne façonnent pas entièrement l'architecture d'une application, n'ont pas de particularité d'implémentation sur Android.

En effet le Singleton par exemple est implémenté exactement de la même manière que sur une autre plateforme, il en va de même pour la Factory.

Concernant le Design Pattern Observer, celui-ci est très répandu grâce à la profusion des listeners (Cf. [Android : Pourquoi j'aime les Listeners](https://eleven-labs.github.io//fr/android-listeners/)), mais aussi et surtout aux librairies tels qu'[Otto](http://square.github.io/otto/) de Square, [EventBus](https://github.com/greenrobot/EventBus) de GreenRobot ou même encore [Guava](https://github.com/google/guava/wiki/EventBusExplained) de Google.

# Conclusion

Android nous offre énormément de possibilités quant aux moyens de bien structurer notre code et bien l'organiser. Je suis, à titre personnel, un fan du Databinding qui permet enfin de donner un peu plus d'intelligence à mes layouts et pouvoir explicitement lui indiquer comment et avec quoi se remplir.

Ensuite il est tout à fait possible de faire cohabiter plusieurs Design Pattern, je pense notamment au MVC/MVP et MVVM. Si l'on rajoute un élément extérieur à notre trio qui va s'occuper, par exemple, de générer des ViewModels, il peut être considéré comme un pseudo-Presenter ou pseudo-Controller, car il va se charger d'ajouter ou de modifier des données à afficher (en interagissant avec les ViewModels).

Pour terminer je n'ai pas souhaiter parler de librairies d'injection, tel que [Dagger 2](https://github.com/google/dagger) même si ça s'assimile à de la Factory ou encore des librairies très structurantes tel que [RxJava](https://github.com/ReactiveX/RxJava) qui apporte la notion de React Programming, car, dans certains cas, elles essayent de contourner certains comportements de base d'Android ce qui n'est pas le cas avec les Design Pattern dont il a été question.

> Embrace Android do not fight it