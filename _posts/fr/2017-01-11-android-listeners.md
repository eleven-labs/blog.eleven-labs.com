---
layout: post
title: 'Android : Pourquoi j''aime les listeners'
authors:
    - thuchon
lang: fr
permalink: /android-listeners/
excerpt: "Parlons de Listeners"
date: '2017-01-11 18:28:25 +0100'
date_gmt: '2017-01-11 17:28:25 +0100'
categories:
    - Mobile
tags:
    - application mobile
    - mobile
    - dév mobile
    - android
---

### Introduction

Salut les astronautes ! Aujourd'hui encore, je vais vous parler de développement mobile natif, et aujourd'hui, on se concentre sur Android. Comme mon précédent article, celui-ci se veut accessible pour les néophytes, donc on va passer un petit peu de temps pour voir quelques termes techniques ensemble avant de rentrer dans le vif du sujet. Si vous n'avez pas lu mon dernier article, Closures VS Delegates, je vous invite vivement à le faire, c'est un pré-requis pour aborder celui-ci. [Delegates VS Closures](https://blog.eleven-labs.com/fr/delegates-closures/){:rel="nofollow noreferrer"}<br />
Pour ceux qui ne savent pas, pour faire de l'Android, on doit utiliser du Java. Du coup, pour les exemples de code, ça va être plus rapide, car un seul code à couvrir, une seule syntaxe et une seule structure de fichier. La notion importante dans cet article, c'est le principe de listener.

**Les Listeners**

Un listener, qu'est-ce que c'est? Un listener est une référence vers un objet dont on ignore le type exact, mais, chose importante, il hérite d'une interface. Comme cet objet hérite d'une interface, on sait que l'on peut appeler les méthodes définies dans cette interface, même si l'on ne connait pas l'objet qu'il y a en face. Je pense qu'une petite mise en situation pourra nous aider là-dessus.<br />
N.B. : Le code que je vais vous fournir est juste une dummy implementation pour que vous compreniez les principes, il ne fera pas de vrai appel HTTP sur l'adresse donnée en paramètres. Imaginons que j'ai un appel GET à faire, de manière générale dans le monde du mobile, on aime bien gérer ça avec 2 callbacks pour le retour. Une en cas de succès et une en cas d'erreur.<br />
Notre but ici est de réaliser une classe qui fait un GET sur une URL donnée. Je veux prévenir l'objet qui a été l'instigateur de cette requête si elle a réussi ou non. Pour éviter un couplage fort, on va utiliser le principe du listener, grâce à ça, je n'aurai pas à connaitre le type exact de cet objet. On va donc définir une interface qui va contenir deux méthodes :
- onRequestSuccess
- onRequestFailure

```Java
public interface RequesterListener {
    void onRequestSuccess();
    void onRequestFailure();
}
```

On va donc hériter cette interface dans notre classe Java

```Java
public class MainActivity extends AppCompatActivity implements RequesterListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    public void onRequestSuccess() {

    }

    @Override
    public void onRequestFailure() {

    }
}
```

On a donc notre Class MainActivity qui hérite de l'interface RequesterListener et qui implémente 2 méthodes (onRequestSuccess, onRequestFailure). On va faire une dummy implementation pour vous donner une idée de comment ça fonctionne :

```Java
public class RequestManager {

    private RequesterListener mListener;

    public void get(String uri) {
        //Do the call
        boolean requestSucceed = this.isSuccess();

        //After the call
        if (requestSucceed) {
            this.mListener.onRequestSuccess();
        } else {
            this.mListener.onRequestFailure();
        }
    }

    public void setListener(RequesterListener listener) {
        this.mListener = listener;
    }

    public  RequesterListener getListener() {
        return this.mListener;
    }

    private boolean isSuccess() {
        return true;
    }
}
```

La classe RequestManager nous sert à exécuter un call GET sur une URL donnée.

```Java
public class MainActivity extends AppCompatActivity implements RequesterListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        RequestManager manager = new RequestManager();
        manager.setListener(this);
        manager.get("http://plop.fr");
    }

    private void callWebService() {
        RequestManager manager = new RequestManager();
        manager.setListener(this);
        manager.get("http://plop.fr");
    }

    @Override
    public void onRequestSuccess() {

    }

    @Override
    public void onRequestFailure() {

    }
}
```

Si maintenant j'appelle la méthode callWebService, vu le dummy code que l'on a fait, le résultat sera un passage dans la méthode onRequestSuccess.

**Mais pourquoi faire tout ça?**

On a un couplage light entre nos différents objets. En effet, RequestManager n'a aucune idée du type de l'objet de son listener, tout ce qui l'intéresse c'est de savoir qu'il contient les deux méthodes de l'interface pour pouvoir les appeler. Donc, c'est bien, j'ai pu appeler mon Webservice, j'ai mes méthodes de retour dans lesquels je peux faire mes traitements, tout me semble bon. Oui, tout est bon, ça fonctionne bien et ça couvrira beaucoup de cas.

**Problème soulevé**

Dans l'article précédent, j'avais abordé le cas où vous aviez plusieurs appels à faire dans une même classe. Vous allez me dire :
- Il doit bien y avoir un équivalent des closures sur Android, comme sur iOS.
- Oui, il y'en a un.
- Bah donne nous le nom là, ne nous fait pas languir.
- Les listeners.
- Hein, de quoi il parle, on vient de voir, ça !!!
- Laissez moi vous expliquer.

**Solution**

En fait, grace au Java, on peut instancier une interface si on redéfinit les méthodes au moment de l'instanciation. Un petit bout de code pour vous montrer ça ?

```Java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        RequestManager manager = new RequestManager();
        RequesterListener listener = new RequesterListener() {

            @Override
            public void onRequestSuccess() {

            }

            @Override
            public void onRequestFailure() {

            }
        };

        manager.setListener(listener);
        manager.get("http://plop.fr");
    }
}
```
### Conclusion

Et donc, si maintenant j'appelle la méthode callWebService, vu le dummy code que l'on a fait, le résultat sera un passage dans la méthode onRequestSuccess. Du coup, c'est plutôt pas mal tout ça non ? Ça couvre 100% des cas et facilement, sans avoir à tout changer, on peut devenir listener en décidant d'hériter d'une interface ou juste définir une instance de celle-ci. Personnellement, quand j'ai découvert ça, je me suis dit, mais c'est pas possible ! C’est juste génial ! J'ai cherché l'équivalent sur iOS, me disant que forcément, ils avaient dû penser à gérer ça... Gros échec, j'ai rien trouvé.. Puis en fouinant sur le web pour un besoin très spécifique, j'ai trouvé une solution assez élégante. Mais bon, ça ce sera lors d'un prochain article :) Allez, salut les astronautes !
