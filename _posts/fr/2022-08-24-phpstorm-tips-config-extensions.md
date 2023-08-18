---
lang: fr
date: '2022-08-24'
slug: phpstorm-tips-config-extensions
title: 'PhpStorm tips : config & extensions'
excerpt: >-
  Les meilleurs tips de configs et extensions pour profiter pleinement de
  PhpStorm.
authors:
  - ajacquemin
categories:
  - php
keywords: []
---

Bienvenue dans cet article qui j'espère, vous aidera à gagner en productivité sur l'IDE [PhpStorm](https://www.jetbrains.com/fr-fr/phpstorm/) de la suite JetBrains. Je vais vous parler de mes extensions préférées ainsi que de certains points de configuration méconnus mais très utiles. Prêts ? C'est parti !


![PhpStorm Logo]({{ site.baseurl }}/assets/2022-08-24-phpstorm-tips-config-extensions/PhpStorm_Icon.png?width=300)
Figure: *PhpStorm*


<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>

Nous irons crescendo dans cet article, du plus populaire des tips à celui le moins connu. Le meilleur se trouvant à la fin, restez bien jusqu'au bout (oui, j'optimise mon readtime).
</div>

# Mes extensions les plus utiles

## Key promoter

Comme vous le savez certainement si vous utilisez PhpStorm, les raccourcis clavier, c'est la vie. Ce sont eux qui permettent de déployer toute la puissance de votre IDE.

Cependant il peut être compliqué de se rappeler de tous les raccourcis qui existent, et de prendre l'habitude de les utiliser. Il faudrait que quelqu'un nous rabache à longueur de journée que ce que nous faisons aurait pu être effectué en un clic avec un raccourci. Devinez quoi ? C'est exactement ce que Key Promoter va faire pour vous.


![Key Promoter notif]({{ site.baseurl }}/assets/2022-08-24-phpstorm-tips-config-extensions/key-promoter-notification.png?width=450)
Figure: *Key Promoter*


Comme vous le voyez, dès que vous exécuterez une action pour laquelle il existe un raccourci clavier, Key Promoter va vous afficher une petite notification ennuyeuse en bas à droite de votre IDE. Pour vous rappeler que vous êtes nuls car vous avez manuellement copié un fichier au lieu de faire un *Ctrl+c* par exemple.

Si vous trouvez que certains raccourcis clavier sont inutiles pour vous et que vous en avez marre que Key Promoter vous les rappelle, vous pouvez cliquez sur le bouton **Action** de la notification et demander à l'extension de ne plus vous rappeler ce raccourci en particulier. Il est possible de spécifier ce comportement également directement dans la config de l'extension. 

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>

De plus, si Key Promoter vous surprend à faire plusieurs fois la même action qui n'est liée à aucun raccourci, il vous proposera d'en créer un. On dit merci qui ?
</div>

## Codeglance

Une des fonctionnalités qui m'a manqué quand j'ai quitté VSCode pour PhpStorm, c'est cette minimap à droite d'un fichier de code qui vous donne un aperçu du fichier dans sa globalité, ainsi que la possibilité de cliquer dessus pour scroller rapidement dans votre fichier et s'arrêter exactement à la ligne souhaitée.
Heureusement, PhpStorm possède une extension pour cela, j'ai nommé *CodeGlance*.



![Codeglance Map]({{ site.baseurl }}/assets/2022-08-24-phpstorm-tips-config-extensions/code-glance-example.png?width=300)
Figure: *Code Glance*

<br />

Très pratique, on s'en rend compte surtout à l'utilisation, rapidement on ne peut plus s'en passer.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Note</p>

Comme vous l'avez remarqué, oui je suis dans un mood light theme en ce moment. Le dark mode c'est classe, mais pas si vous voulez prendre soin de vos yeux. cf [Which colour scheme is better according to science ?](https://stitcher.io/blog/why-light-themes-are-better-according-to-science)
</div>

Dans la suite de cet article, nous parlerons de configuration d'IDE. Il s'agit donc de préférences subjectives qui peuvent ne pas vous correspondre, mais je me suis efforcé de sélectionner celles que je trouve réellement utiles et qui me font, je crois, gagner en productivité.

# Optimiser sa configuration

## Cachez ces taskbars que je ne saurais voir

Comme dit plus haut, PhpStorm s'utilise surtout avec des raccourcis, alors pourquoi garder tous ces boutons tout autour de votre éditeur ? Non seulement je suis sûr que vous n'en utilisez pas ne serait-ce que le quart, mais en plus toutes ces barres de tâches rognent vos fichiers de code, on finit par ne plus respirer.

La solution ? Cliquez sur l'onglet *View* => *Appearance*. La liste des menus s'affiche, la majorité est cochée. Décochez *TOUS* les menus, en finissant par le **Main Menu** car c'est celui qui vous permet d'accéder à cette option.

Vous voilà à présent dans cette situation :


![PhpStorm Clean]({{ site.baseurl }}/assets/2022-08-24-phpstorm-tips-config-extensions/clean-phpstorm.png?width=500)
Figure: *PhpStorm, the clean way*

<br />

Je trouve ça toujours émouvant de voir ce beau désert blanc épuré.

<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>

Pour afficher / faire disparaître votre arborescence de fichier, utilisez **Alt + 1**.
Et pas de panique si vous pensez avoir perdu tout accès à votre **Main Menu**, j'y arrive dans un instant.
</div>

Je vous arrête tout de suite, j'ai moi aussi trouvé ça un peu flippant au début. Je me sentais un peu perdu sans toutes ces options qui nous rassurent autour de nous.

Pourtant on se rend vite compte que l'on a jamais eu besoin d'y accéder de cette manière. Il y a beaucoup, beaucoup plus simple, même pour les actions complexes ou les actions de configurations qui n'ont pas leur équivalent en raccourcis clavier comme changer des éléments de layout. Et tout ça en 1 seul raccourci clavier.

Laissez-moi vous présenter votre nouveau meilleur ami...

## Surutilisez le menu d'actions

Vous souhaitez réafficher votre **Main Menu** ? Simple, **Ctrl + Maj + A** puis tapez "Main menu". Vous trouverez votre bonheur.

Besoin de changer les onglets de place ? **Ctrl + Maj + A** => "Tab placement".

Ouvrir un nouveau fichier / projet ? **Ctrl + Maj + A** => "Open...".

Etc. Pour **TOUTES** les actions auxquelles vous pensez dont vous ne vous souvenez plus du raccourci ou qui n'en ont tout simplement pas, il suffit d'ouvrir votre menu d'actions avec **Ctrl + Maj + A** et d'écrire ce que vous voulez faire. 

L'utilisation de ce menu prend tout son sens quand on est débarrassé de toutes nos taskbars. Je trouve son utilisation même plus rapide que les barres de tâches : plutôt que de fouiller dans une arborescence d'options ou même de ne plus savoir où chercher, le menu d'actions trouve votre option en quelques caractères tapés au clavier.

## Distraction free mode, aka le boss de fin

Nous voilà arrivés à la dernière fonctionnalité que je vais vous présenter aujourd'hui. Elle devrait en particulier vous intéresser si vous avez du mal à vous passer des taskbars 100% du temps. Voici le Distraction free mode.


![distraction free mode]({{ site.baseurl }}/assets/2022-08-24-phpstorm-tips-config-extensions/distraction-free-mode.png)
Figure: Distraction free mode


<div  class="admonition important"  markdown="1"><p  class="admonition-title">Important</p>

Pour l'activer, je vous le donne en mille : un petit coup de **Ctrl + Maj + A** => "Distraction free mode"
</div>

Si vous avez préféré ne pas vous séparer de vos taskbars et menus, le *distraction free mode* vous les enlevera **uniquement** pour le temps où vous souhaitez rester focus. C'est donc un bon compromis si vous ne souhaitez travailler ainsi que quelques instants. Dès que vous voulez retrouver vos menus et le layout de PhpStorm de base, il vous suffit d'utiliser votre menu d'action pour quitter ce mode.

Autre avantage, le distraction free mode va quelque peu centrer votre code plutôt que le laisser tout collé à gauche comme il l'est habituellement quand on se contente de fermer l'arborescence de fichiers, et c'est très agréable (et oui, cette marge à gauche est personnalisable à vos souhaits).

Le distraction free mode retire beaucoup de choses, mais vous pouvez le personnaliser si besoin.

Par exemple, si comme moi vous ne pouvez pas vous passer des numéros de lignes (cachés par défaut), en un coup de baguette magique : **Ctrl + Maj + A** => "Show line numbers"..

Vous commencez à connaître la chanson !


## Conclusion

Avez toutes ces astuces, libre à vous de piocher dans celles qui vous intéresse le plus. Surtout : adaptez-les à vos besoins en changeant des éléments de config ou de layout selon vos préférences. Le plus important, c'est que votre IDE vous ressemble et soit agréable à utiliser pour VOUS.

Enfin, n'oubliez pas de vérifiez régulièrement les mises à jour de votre IDE <b>ET</b> de vos extensions.

<div  class="admonition note"  markdown="1"><p  class="admonition-title">Quote</p>

Votre mantra : "Un esprit sain dans un corps sain se doit d'utiliser un IDE sain".
</div>

Prenez soin de votre PhpStorm, et très bon été à tous !

À très bientôt 👋

### Sources

- [How to set up PhpStorm](https://www.youtube.com/watch?v=jVTk-F3g9XM)
- [Which colour scheme is better according to science ?](https://stitcher.io/blog/why-light-themes-are-better-according-to-science)
