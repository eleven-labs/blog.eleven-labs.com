---
contentType: tutorial-step
tutorial: kotlin-exoplayer
slug: creation-du-player
title: Création du Player
---
## Création du player Exoplayer :

### Prérequis :

Créez un fichier versions.gradle dans le répertoire de votre projet et listez vos dépendances en spécifiant leur version. N'oubliez pas d'y introduire la liste des versions que vous utiliserez dans vos dépendances.
Ici :

```java
ext {
    exoPlayerVersion = '2.9.6'
}
```

Dans votre fichier build.gradle applicatif ajoutez en haut :

apply from: 'versions.gradle'

Enfin, ajoutez dans votre fichier build.gradle les dépendances à ExoPlayer :

```java
    // exoplayer
    implementation "com.google.android.exoplayer:exoplayer-core:$exoPlayerVersion"
    implementation "com.google.android.exoplayer:exoplayer-ui:$exoPlayerVersion"
```

### En ce qui concerne le Player

Nous allons créer une classe Player. Cette classe va avoir un rôle de façade sur notre player ExoPlayer pour exécuter toutes nos actions type play, pause, instancier notre player, le configurer en fonction du flux d'entrée...

Pour commencer nous allons créer une variable privé de type SimpleExoPlayer et l'initialiser dans notre objet :

```java
class Player(val context: Context) {

    private var player: SimpleExoPlayer = ExoPlayerFactory.newSimpleInstance(context)

}
```

À partir d'ici, nous avons notre player instancié. Maintenant il faut lui permettre de lire des vidéos locales. Nous allons donc créer une méthode qui va lui permettre de décoder notre fichier video. ExoPlayer est capable de lire un nombre assez conséquent de formats vidéos différents, que ce soient des vidéos locales ou des streams live. Pour différencier ces types de flux d'entrées nous devons créer un fichier de type MediaSource, qui est le media final que nous passerons à notre player ExoPlayer pour qu'il le lise. Pour créer ce fichier, nous devons passer par une des factories ExoPlayer, qui différera en fonction du flux. À savoir qu'en entrée, la factory va demander une URI.

Ici j'ai choisi de lire un fichier MP4, format considéré comme standard par exoplayer :

```java
    private fun buildMediaSource(uri: Uri): MediaSource {
        val factorymediaSourceFactory: ExtractorMediaSource.Factory =
            ExtractorMediaSource.Factory(
                DefaultDataSourceFactory(
                    context,
                    Util.getUserAgent(context, "MyNetflix")
                )
            )
        return factorymediaSourceFactory.createMediaSource(uri)
    }
```

Nous avons notre player, notre MediaSource résultant de la transformation de notre URI. Mais il nous manque un dernier détail... Pour pouvoir s'afficher correctement, ExoPlayer a besoin qu'on lui fournisse une SurfaceView, custom view de la librairie Exoplayer sur laquelle il va pouvoir afficher son contenu.

Nous allons donc pour l'instant ajouter une méthode pour fournir à notre objet Player une surfaceView :

```java
    fun setVideoSurface(surfaceview: SurfaceView) {
        player.setVideoSurfaceView(surfaceview)
    }
```

Enfin bien sûr, nous allons ajouter plusieurs actions, pour pouvoir tester notre super player par la suite.

Pour charger notre média :

```java
    fun prepare(uri: Uri) {
        player.prepare(buildMediaSource(uri), false, true);
    }
```

Pour reset notre player :

```java
    fun stop() {
        player.stop(true)
        player.seekToDefaultPosition()
    }
```

Pour lancer la lecture :

```java
    fun play() {
        player.playWhenReady = true
    }
```

Pour le mettre en pause :

```java
    fun pause() {
        player.playWhenReady = false
    }
```

Et un getter sur son état en lecture ou pas :

```java
    fun isPlaying() {
        return player.playWhenReady 
    }
```

À savoir que pour indiquer que l'on veut jouer la vidéo de notre player, il faut modifier la valeur du boolean playWhenReady. ExoPlayer écoute cette valeur. Dès qu'elle est modifiée et s'il n'est pas en cours d'initialisation il lancera instantanément la vidéo. Sinon il attendra de finir son initialisation puis la lancera.
