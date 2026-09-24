---
contentType: tutorial-step
tutorial: kotlin-exoplayer
slug: creation-ui
title: Création de l'UI
---

## Création de notre vue PlayerView :

Créez un fichier player_view.xml dans le dossier layout de votre projet.
Dans ce fichier nous allons ajouter une SurfaceView, réceptacle de notre player, et un bouton play/pause qui permettra de lancer/arrêter le flux :

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <SurfaceView
        android:id="@+id/surface_view"
        android:layout_width="400dp"
        android:layout_height="300dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.appcompat.widget.AppCompatImageButton
        android:id="@+id/play_pause_button"
        style="?android:attr/borderlessButtonStyle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:background="@drawable/exo_controls_play"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```
Ensuite nous allons créer une classe PlayerView qui héritera de FrameLayout, dans laquelle on va définir différents comportements, notamment la gestion de l'état du bouton play/pause, son logo, et les actions que ce bouton va effectuer.

```java
class PlayerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    init {
        inflate(context, R.layout.player_view, this)
    }
}
```

On va y initialiser notre PlayerManager :

```java
  private lateinit var playerManager: PlayerManager

  private fun initPlayer() {
        playerManager = PlayerManager(context = context)
        playerManager.setVideoSurface(surface_view)
        playerManager.prepare(Uri.parse("file:/android_asset/example_video.mp4"))
    }
```

Et dans notre bloc init, on va exécuter notre initPlayer puis définir un listener sur notre bouton pour modifier l'icône et ainsi nous permettre d'avoir un retour UX entre nos lectures et nos pauses :

À savoir que des ressources sont mises à disposition par la librairie pour avoir des images de contrôles ISO sur tout les players, les ressources exo_controls_play et exo_controls_pause sont donc accessibles sans avoir à ajouter d'icônes dans votre projet.

```java
init {
        inflate(context, R.layout.player_view, this)

        play_pause_button.setOnClickListener {
            if (playerManager.isPlaying()) {
                playerManager.pause()
                play_pause_button.setBackgroundResource(R.drawable.exo_controls_play)
            } else {
                playerManager.play()
                play_pause_button.setBackgroundResource(R.drawable.exo_controls_pause)
            }
        }
        initPlayer()
    }
```

### Ressources : 

Niveau ressourcee, créez un dossier assets dans votre dossier main à coté des dossiers res et java et mettez y vos ressources vidéos.
Ainsi vous pourrez y accéder dans vos tests comme défini plus haut :

"file:/android_asset/example_video.mp4"

### Tests : 

Afin de tester, créer une MainActivity. Dans son layout activity_main définissez un PlayerView comme bon vous semble niveau format : 

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <com.example.mynetflix.PlayerView
        android:id="@+id/player"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

Si tout s'aligne bien, vous pouvez exécuter votre code et lancer votre application !
