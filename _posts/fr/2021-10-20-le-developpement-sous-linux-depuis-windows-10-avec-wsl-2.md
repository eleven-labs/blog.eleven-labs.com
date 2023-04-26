---
lang: fr
date: '2021-10-20'
slug: le-developpement-sous-linux-depuis-windows-10-avec-wsl-2
title: Le développement sous Linux depuis Windows 10 avec WSL 2
excerpt: >-
  Développer sans contraintes vos applications sous Linux depuis Windows 10
  grace à WSL 2
authors:
  - gcanal
categories: []
keywords:
  - bonnes pratiques
---

<!--
<div class="admonition example" markdown="1"><p class="admonition-title">Example</p>

</div>
-->

WSL pour Windows SubSystem Linux, est une solution développée par Microsoft vous permettant de faire tourner différentes distributions Linux sur Windows 10.

## Un peu de contexte

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>

Pour plus d'informations sur l'implémentation de WSL 2, une [vidéo de présentation](https://www.youtube.com/watch?v=lwhMThePdIo) et [des slides](https://medius.studios.ms/video/asset/PPT/B19-BRK3068) sont disponibles.

</div>

WSL premier du nom, est un driver pour Windows implémentant l'API du noyau Linux, qui transforme les appels au noyau en instructions compatibles Windows NT. Ce qui pose de nombreux problèmes de compatibilité notamment avec l'API permettant d'accéder au système de fichiers.

![wsl1-architecture]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/wsl1-architecture.png  "Architecture WSL 1")

Pour résoudre les différents problèmes de compatibilité, de performances et pour réduire les coûts de maintenance de WSL, la version 2 fait tourner [un véritable noyau Linux](https://github.com/microsoft/WSL2-Linux-Kernel) compilé et maintenu par Microsoft dans [Hyper-V](https://fr.wikipedia.org/wiki/Hyper-V) (qui est un [hyperviseur de type 1](https://fr.wikipedia.org/wiki/Hyperviseur#Type_1_:_natif)).

![wsl2-architecture]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/wsl2-architecture.png  "Architecture WSL 2")

## Activation de WSL 2

À la rédaction de ce guide, pour profiter de WSL2, il vous faudra rejoindre le [programme Windows Insider](https://insider.windows.com/fr-fr/getting-started/)

- Ouvrez les paramètres [Windows Insider](ms-settings:windowsinsider "Ouvre les paramètres Windows Insider")
- Choisir le type de version d'évaluation **"Rapide"**
- Ouvir [Windows Update](ms-settings:windowsupdate "Ouvre Windows Update")
- Cliquer sur "Rechercher les mises à jour" pour télécharger le dernier build

![insider]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/insider.png)

Lancer PowerShell en tant qu'administrateur

- <kbd>⊞ Win</kbd> + <kbd>R</kbd>
- Saisir `powershell`
- <kbd>Ctrl</kbd> + <kbd>⇧ Shift</kbd> + <kbd>↵ Entrée</kbd>

Activer les fonctionnalités optionnelles nécessaires

```powershell
Enable-WindowsOptionalFeature -Online -NoRestart -FeatureName VirtualMachinePlatform
Enable-WindowsOptionalFeature -Online -NoRestart -FeatureName Microsoft-Windows-Subsystem-Linux
Restart-Computer
```


<div class="admonition important" markdown="1"><p class="admonition-title">Important</p>

Votre ordinateur va redémarrer pour activer les fonctionnalités optionnelles de Windows.

</div>

## Installer une distribution Linux

Vous pouvez obtenir la liste des distribution disponibles [ici](https://aka.ms/wslstore "Lien Microsoft Store")

Dans ce guide nous allons installer Ubuntu, libre à vous d'expérimenter avec d'autres distributions.

- Installer Ubuntu puis cliquer sur le bouton **Lancer** _(un terminal s'ouvre alors)_
- Choisir un nom d'utilisateur et un mot de passe.
- Quitter le terminal
- Dans Powershell, lister les distributions Linux installées

```powershell
wsl --list --verbose
NAME      STATE           VERSION
* Ubuntu    Stopped         1
```

Passer Ubuntu en WSL2

```powershell
wsl --set-version Ubuntu 2
```

Lancer Ubuntu et se positionner dans le répertoire de l'utilisateur courant.

```powershell
wsl ~ -d Ubuntu
```

## Installer Docker

Arrivé à cette étape, vous vous trouvez maintenant dans le shell Ubuntu.

Pour installer Docker, nous allons passer par le [script d'installation de Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script)

```bash
# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

```bash
# On ajoute l'utilisateur courant au groupe Docker
sudo usermod -aG docker $USER
```

```bash
# On se reconnecte avec l'utilisateur courant pour appliquer les droits
su - $USER
```

```bash
# On lance le démon Docker
sudo service docker start
```

```bash
# Tester Docker (Ctrl+C pour stopper le conteneur)
docker run --rm -it -p 80:80 containous/whoami
```

Ouvrir votre navigateur et visiter <http://localhost>

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>

Les distributions Linux conçues pour tourner dans WSL2 ne sont pas livrées avec des scripts de démarrage tels que System V, Systemd ou encore Upstart. Ce qui veut dire qu'il faudra lancer vous-même le démon docker au démarrage d'Ubuntu via `sudo service docker start`.

</div>

<div class="admonition info" markdown="1"><p class="admonition-title">À savoir</p>

Par défaut Windows arrête les conteneurs Linux au bout de quelques secondes en l'absence de tâches de fond. Si telle est votre intention, pensez à arrêter le démon docker via `sudo service docker stop` avant d'éxécuter la commande `exit` ou de fermer votre terminal.

</div>

## Utiliser Systemd

Si vous souhaitez démarrer automatiquement des services au lancement d'Ubuntu, [Shayne Sweeney](https://github.com/shayne) a écrit [un guide plutôt complet](https://github.com/shayne/wsl2-hacks) permettant de lancer Systemd au démarrage d'Ubuntu.

<div class="admonition attention" markdown="1"><p class="admonition-title">Attention</p>

La section de l'article **Access localhost ports from Windows** n'est plus nécessaire car la dernière version de WSL 2 le fait déjà.

</div>

<div class="admonition info" markdown="1"><p class="admonition-title">Info</p>

Dans les grande lignes, l'astuce consiste à remplacer le shell de l'utilisateur `root` par un script qui lance systemd et qui vous authentifie sur votre session utilisateur via `nsenter`

</div>

## Windows Terminal

![Windows Terminal]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/windows-terminal.png  "Windows Terminal")

[Windows Terminal](https://www.microsoft.com/fr-fr/p/windows-terminal-preview/9n0dx20hk701) ([source](https://github.com/microsoft/terminal)) est un terminal moderne, configurable et personnalisable qui centralise PowerShell, Cmd, Azure Cloud Shell et vos shells Linux en une seule application.

### Personnalisation

L'application est personnalisable via un fichier `.json`. Utilisez <kbd>Ctrl</kbd> + <kbd>,</kbd> pour y accéder ou utilisez l'interface de l'application.

![windows-terminal-settings]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/windows-terminal-settings.gif  "Paramétrage de Windows Terminal")

Le schéma du fichier est décrit via JSON Schema, le lien est consultable via la propriété `$schema`. Si vous utilisez VSCode, vous aurez accès à de l'autocomplétion 🎉.

- `profiles` contient toutes les configurations par défaut de chacun de vos shells
- `schemes` vous permet de déclarer des thèmes, utilisables par la suite dans le profil de votre shell via la propriété `colorScheme`.
- `keybindings` vous permet de configurer vos raccourcis clavier

Pour plus d'informations sur la personnalisation de Windows Terminal, je vous invite à consulter les articles de [Kayla Cinnamon](https://devblogs.microsoft.com/commandline/author/cinnamonmicrosoft-com/), Program Manager chez Microsoft mais aussi [cet article](https://www.hanselman.com/blog/NowIsTheTimeToMakeAFreshNewWindowsTerminalProfilesjson.aspx) de [Scott Hanselman](https://twitter.com/shanselman)


<div class="admonition info" markdown="1"><p class="admonition-title">Info</p>

Des thèmes pour Windows Terminal sont disponibles dans le dépôt Github [mbadolato/iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/windowsterminal). Personnellement, j'utilise le thème `Argonaut` pour mon shell Ubuntu.

</div>

### Copier/Coller

Windows identifie les fins de lignes avec la séquence CRLF `\r\n`.
Sous Linux, les fins de lignes n'utilisent que le caractère LF `\n`.

Pour éviter de vous retrouver avec des doublements de lignes dans Windows Terminal quand vous collez du texte, je vous suggère d'utiliser [AutoHotKey](https://www.autohotkey.com/), _(qui est un utilitaire permettant d'automatiser des tâches sous Windows)_.

![ahk-logo]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/ahk-logo.png  "Logo de AutoHotKey")

On va commencer par ouvrir le répertoire des scripts lancés au démarrage de Windows :

- <kbd>⊞ Win</kbd> + <kbd>R</kbd>
- Saisissez `shell:startup` puis <kbd>↵ Entrée</kbd>
- Créez un fichier `copy-paste-on-windows-terminal.ahk`
- Éditez-le, et ajoutez le script suivant :

```ahk
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; Replace Windows line termination from CRLF to LF while copy/pasting into Windows Terminal
#if WinActive("ahk_exe WindowsTerminal.exe")
    RemoveCrlfFromClipBoard() {
        Var := Clipboard
        Clipboard := RegExReplace(Var, "\r\n?|\n\r?", "`n")
        return
    }

    RButton::
    ^+v::
        RemoveCrlfFromClipBoard()
        MouseClick, Right
        return
#if
```

<div class="admonition info" markdown="1"><p class="admonition-title">Info</p>

Par défaut, dans Windows Terminal, l'opération **coller** se fait via <kbd>🖱️ Droit</kbd> ou la combinaison <kbd>Ctrl</kbd> + <kbd>⇧ Shift</kbd> + <kbd>V</kbd>. Le script les intercepte pour replacer les séquences `\r\n` par `\n`

</div>

### Bug d'affichage

Windows Terminal étant en "Development Preview", il existe encore des bugs qui peuvent ruiner votre expérience utilisateur, mais dans l'ensemble, le terminal est plutôt stable et utilisable.

Si vous rencontrez un bug d'affichage rendant l'interface complètement noire en déplaçant la fenêtre sur votre bureau...

![windows-terminal-rendering-bug]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/windows-terminal-rendering-bug.png  "Bug de rendu du Windows Terminal")

... Il suffit de renseigner une largeur initiale pour la fenêtre de `110` via l'option `initialCols`. Cela fonctionne aussi avec des valeurs au-delà de `130` 🤷 (le mystère reste entier).

## Lancer des applications graphiques Linux

Commencez par installer un serveur X pour Windows tel que :

- [X410](https://www.microsoft.com/fr-fr/p/x410/9nlp712zmn9q) (payant avec version d'essai),
- ou encore [VcXsrv Windows X Server](https://sourceforge.net/projects/vcxsrv/) (open-source).

<div class="admonition tip" markdown="1"><p class="admonition-title">Astuce</p>

Si vous utilisez X410, activez l'option **Allow Public Access**.

![x410-public-access]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/x410-public-access.gif  "X410 Allow Public Access")

</div>

<div class="admonition tip" markdown="1"><p class="admonition-title">Astuce</p>

Pour VcXsrv, utilisez l'utilitaire Xlaunch, conservez les options par défaut et choisissez **Disable Access Control**.

![vcxsrv-configuration]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/vcxsrv-configuration.gif  "Configuration de VcXsrv")

</div>

Pour finir, ajoutez dans le fichier de configuration de votre shell Linux  (ex: `.bashrc`, `.zshrc`)

```shell
# Récupère l'adresse IP permettant d'accèder au server X tournant sur Windows
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0
```

Puis lancez une application graphique

```shell
apt update && apt install -y mesa-utils && glxgears
```

Vous pouvez même lancer les applications graphiques depuis Docker 🐳.
[Jess Frazelle](https://github.com/jessfraz "Profil Github de Jess Frazelle"), dans son article [Docker Containers on the Desktop](https://blog.jessfraz.com/post/docker-containers-on-the-desktop/ "Article en anglais: Docker Containers on the Desktop") aborde en détail la marche à suivre. Son dépôt est disponible [ici](https://github.com/jessfraz/dockerfiles "Dépôt Github jessfraz/dockerfiles")

```shell
# Exemple avec InkScape
docker run --rm -it -e DISPLAY jess/inkscape
```

## Les alias utiles

À ajouter dans votre fichier `.bashrc` ou `.zshrc`

```bash
# Rediriger la sortie d'une commande dans le presse-papier Windows
# ex: cat ~/.ssh/id_rsa.pub | copy
alias copy='clip.exe'

# Permet d'ouvrir un fichier, un dossier ou une url dans Windows
alias open="rundll32.exe url.dll,FileProtocolHandler"

# Alias d'`open` pour des raisons de compatibilité
alias xdg-open="open"
```

## Logiciels Windows compatibles avec WSL

<div class="admonition attention" markdown="1"><p class="admonition-title">Précision</p>

Ceci n'est pas une liste exhaustive, mais de plus en plus de logiciels prévoient le support de WSL 2.

</div>


### Visual Studio Code

[VSCode](https://code.visualstudio.com/) pour Windows supporte WSL avec le module [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

![vscode-remote-wsl]({{site.baseurl}}/assets/2019-10-25-le-developpement-sous-linux-depuis-windows-10-avec-wsl-2/wsl-readme.gif)

### PHPStorm

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The 2019.3 Early Access Program gets close to the finish line. But we have something new for you in the fresh build – WSL Support! <a href="https://t.co/PgVZbyYoAU">https://t.co/PgVZbyYoAU</a> <a href="https://t.co/wvzdEOrYAo">pic.twitter.com/wvzdEOrYAo</a></p>&mdash; JetBrains PhpStorm (@phpstorm) <a href="https://twitter.com/phpstorm/status/1187633307896430592?ref_src=twsrc%5Etfw">October 25, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

L'[Early Access 2019.3 de PHPStorm](https://blog.jetbrains.com/phpstorm/tag/2019-3/) pour Windows ajoute le support de WSL et la fonctionnalité ne tardera pas à rejoindre la version stable de L'IDE.
