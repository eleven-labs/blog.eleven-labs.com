---
contentType: article
lang: fr
date: '2024-08-22'
slug: css-anchor-positioning-api
title: La nouvelle Anchor positioning API en CSS
excerpt: >-
  L'Anchor positioning API est arrivée en CSS depuis quelques mois. Expérimentale et uniquement disponible à ce jour pour les navigateurs basés sur Chromium, elle est tout de même très intéressante pour lier des éléments entre eux et répondre en CSS à des problématiques qui ne pouvaient se résoudre qu'en JavaScript.
categories: [javascript]
authors:
  - afauquet
cover:
  alt: À la découverte de l'Anchor positioning API
  path: /imgs/articles/2024-08-22-css-anchor-positioning-api/cover.jpg
keywords:
- css
- javascript
---

## L'anchor positioning API, qu'est-ce que c'est&nbsp;?

L'Anchor Positioning API est une nouvelle API CSS qui permet de **positionner un élément appelé "ancre", par rapport à un autre élément appelé "élément positionné"**. C'est le genre de comportement qu'on veut avoir pour les popovers ou les tooltips par exemple&nbsp;! La vraie force de l'Anchor Positioning API, c'est qu'elle permet à l'élément de se positionner **dynamiquement** en fonction de s'il a de la place ou pas pour apparaître, ce qui ne pouvait se faire jusqu'à présent que plutôt péniblement en JavaScript.
Nous allons voir dans cet article comment la mettre en place simplement, et quels sont ses différentes fonctionnalités.

## Une fonctionnalité encore expérimentale

L'Anchor Positioning API est pour l'instant expérimentale, et implémentée sur les dernières versions des navigateurs basés sur Chromium&nbsp;: Chrome, Edge, Opera... [Voir le tableau des compatibilités de l'Anchor Positioning API](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor#browser_compatibility)

**Il est tout de même possible de mettre en place cette API en progressive enhancement**, en gardant une implémentation existante de popover ou de tooltip qui sera disponible pour les navigateurs non compatibles, et en utilisant la nouvelle API pour les navigateurs compatibles. Nous verrons comment à la fin de cet article.

Aussi, certains tooltips et popovers ont une petite flèche qui relie l'ancre à l'élément positionné. Malheureusement aujourd'hui l'Anchor Positioning API ne peut pas gérer nativement la direction de cette flèche. Cette problématique pourrait être réglée dans le futur, avec l'[ajout d'un pseudo élément `::tether` qui est en discussion](https://github.com/w3c/csswg-drafts/issues/9271) pour le niveau 2 de cette API.

Enfin comme il s'agit d'une API expérimentale il est possible que des parties de cet article deviennent obsolètes. Je le mettrai à jour si c'est le cas&nbsp;!

## L'anchor positioning API&nbsp;: comment ça marche&nbsp;?

Comme nous l'avons vu plus tôt, cette API se base sur deux éléments&nbsp;: l'ancre et l'élément positionné. **L'ancre est l'élément qui ne va pas bouger, et à partir duquel va se placer l'élément positionné**. Nous allons utiliser dans cet article le cas concret suivant&nbsp;: l'ancre sera un bouton qui ouvre un tooltip, et le tooltip relatif au bouton sera l'élément positionné. On ne va pas s'occuper de l'interactivité entre ces éléments, juste de l'apparence que les deux éléments doivent avoir une fois le tooltip visible.

![Schéma basique d'un bouton (ancre) et son tooltip (élément positionné)]({BASE_URL}/imgs/articles/2024-08-22-css-anchor-positioning-api/basic-schema.jpg?width=400)
Figure: *Schéma basique d'un bouton (ancre) et son tooltip (élément positionné)*

Voici le code très simple que nous allons utiliser&nbsp;: un `<button>` rouge avec une classe `Anchor` et la `<div>` qui correspond au tooltip lié au bouton, bleu et avec la classe `Tooltip`.

```html
<div class="Tooltip">Tooltip<br />(Element positionné)</div>
<button class="Anchor">Bouton (Ancre)</button>
```

```css
body {
  display: grid;
  grid-template-rows: 1fr;
  justify-content: center;
  height: 100vh;
}

button.Anchor {
  /* Element style */
  height: 40px;
  margin-top: 30vh;
  margin-left: 500px;
  appearance: none;
  background-color: lightcoral;
  border: 2px solid maroon;
  border-radius: 4px;
}

.Tooltip {
  /* Element style */
  max-width: 200px;
  background-color: lightblue;
  width: 100%;
  height: 100px;
  border: 2px solid darkblue;
  font-family: sans-serif;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
```

**La première étape est de nommer l'ancre**. Pour cela il suffit de lui ajouter la propriété `anchor-name` et de lui donner un nom au choix qui commence par `--`. Par exemple&nbsp;:

```css
button.Anchor {
  anchor-name: --button-anchor;
}
```

Maintenant on peut passer à l'élément positionné. Pour que l'API fonctionne **il faut déjà passer l'élément en `position: absolute`**.

Ensuite **il faut le "rattacher" à l'ancre**, et pour cela nous allons utiliser le nom donné précédemment à l'ancre. Il faut également savoir comment l'élément positionné va... se positionner par rapport à l'ancre. On va pouvoir utiliser les valeurs suivantes pour l'élément positionné&nbsp;: `top`, `right`, `bottom`, `left`. Pour l'ancre, on pourra utiliser en plus `center`.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
Il existe une façon plus simple de positionner notre élément que nous verrons juste après, le temps de voir un exemple de la syntaxe de base.
</div>

Il va falloir indiquer **quel côté de l'ancre touche quel côté de l'élément positionné**. Mettons que dans notre cas nous souhaitons dans un premier temps faire apparaître le tooltip en haut à droite du bouton. Lorsque nous allons positionner le tooltip, nous allons donc lui ajouter une propriété `bottom` et `left` puisque ce sont ces côtés qui vont toucher le tooltip en `top` et `right`.
C'est un peu contre intuitif, il est vrai&nbsp;! Il faut aussi bien comprendre que c'est uniquement dans l'élément positionné qu'il va être question de position. L'ancre ne gère que son propre nom dans cette affaire.

![Schéma qui présente le tooltip positionné en haut à droite par rapport au bouton. Quels côtés se touchent&nbsp;? Le "bottom left" du tooltip et le "top right" de l'ancre]({BASE_URL}/imgs/articles/2024-08-22-css-anchor-positioning-api/placed-anchor.jpg?width=600)
Figure: *Schéma qui présente le tooltip positionné en haut à droite par rapport au bouton*

Maintenant il y a **deux syntaxes possibles** pour arriver au même résultat&nbsp;:

- La syntaxe **implicite** avec deux propriétés,
- La syntaxe **explicite** avec une seule propriété, qui est la seule à fonctionner lorsque l'élément positionné est relatif à plusieurs ancres. Pour utiliser plusieurs ancres il suffit d'indiquer leur nom en premier paramètre de `anchor()`, le reste est similaire à l'utilisation d'une seule ancre.

Voici la syntaxe implicite qui correspond à notre exemple&nbsp;:

```css
.Tooltip {
  position: absolute;
  postion-anchor: --button-anchor;
  bottom: anchor(top);
  left: anchor(right);
}
```

Et voici la syntaxe explicite&nbsp;:

```css
.Tooltip {
  position: absolute;
  bottom: anchor(--button-anchor top);
  left: anchor(--button-anchor right);
}
```

Avec la première syntaxe on ajoute le nom de l'ancre dans `position-anchor` puis on ajoute les propriétés `bottom` et `left` dans lesquelles on utilise `anchor()` avec les côtés correspondants de l'ancre, ici `top` et `right`.

Avec la seconde syntaxe le nom de l'ancre est passé dans le `anchor()`, suivi des mêmes valeurs de la première syntaxe.

Bien que la seconde syntaxe puisse paraître meilleure car plus compacte, **on doit souvent utiliser la première syntaxe pour utiliser d'autres fonctionnalités de l'API** dont nous allons parler ensuite.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
On peut aussi utiliser les valeurs de "logical properties"&nbsp;:
  <ul>
    <li><code>top</code> = <code>inset-block-start</code></li>
    <li><code>left</code>= <code>inset-inline-start</code></li>
    <li><code>bottom</code> = <code>inset-block-end</code></li>
    <li><code>right</code>= <code>inset-inline-end</code></li>
  </ul>
</div>

[En savoir plus sur les logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)

## Comment centrer l'élément positionné&nbsp;?
Tout ça c'est bien, mais si on veut centrer notre tooltip alors&nbsp;? Eh bien **on va utiliser d'autres propriétés**, `justify-self`, `justify-items`,  `align-self` et `align-items`, dans lesquelles on va donner la valeur `anchor-center`.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
<code>justify</code> va s'appliquer sur le <code>main-axis</code> (ici l'axe horizontal) et <code>align</code> sur le <code>cross-axis</code> (ici l'axe vertical).
</div>

<div class="admonition warning" markdown="1"><p class="admonition-title">Attention</p>
D'après mes tests cela ne semble pour l'instant fonctionner qu'avec la syntaxe implicite, donc en ajoutant <code>position-anchor</code> et le nom de l'ancre.
</div>

Donc si on veut maintenant que notre tooltip soit en haut, centré par rapport au bouton, on peut faire&nbsp;:

```css
.Tooltip {
  position: absolute;
  position-anchor: --button-anchor;
  bottom: anchor(top);
  justify-self: anchor-center;
}
```

## Une autre façon de gérer la position

Si cette façon de positionner l'élément à l'ancre vous semble un peu compliquée vous êtes vraisemblablement du même avis que celui des personnes qui ont créés cette API&nbsp;: **il existe une autre façon de gérer la position de notre élément qui implique de visualiser la situation autrement**.

La propriété qu'on va utiliser s'appelle `inset-area` et elle va permettre de positionner l'élément **sur une grille de 9 cases**, au centre de laquelle on place notre ancre.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
A partir de Chromium 129 <code>inset-area</code> s'appellera <code>position-area</code>
</div>

![Schéma qui présente la grille à 9 cases : dans une grille de 3 lignes sur 3 colonnes, la case centrale contient le bouton et il y a 8 autres cases tout autour du bouton]({BASE_URL}/imgs/articles/2024-08-22-css-anchor-positioning-api/9-cells-grid.jpg?width=500)
Figure: *Schéma qui présente la grille à 9 cases*

On va pouvoir utiliser dans `inset-area` beaucoup de valeurs possibles&nbsp;:

- Pour placer l'élément **sur toute une ligne ou toute une colone** on va pouvoir utiliser `top`, `right`, `bottom` et `left`. Par exemple, `inset-area: bottom` placera l'élément sur les trois cases en bas de l'ancre.
- Si on veut **placer l'élément sur la case centrale uniquement**, alors on utilisera `center` avec les valeurs de base. Par exemple, `inset-area: top center` placera l'élément sur la ligne en haut de l'ancre, sur la case centrale uniquement.
- Si on veut **placer l'élément sur une seule case qui n'est pas la case centrale**, alors on utilise 2 valeurs de base en commençant par `top` ou `bottom`. Par exemple, `inset-area: bottom left` va placer l'élément en bas de l'ancre, sur la case tout à gauche.
- Enfin, si on veut **placer l'élement sur les 2 premières ou 2 dernières cases d'une ligne ou d'une colone**, alors on va utiliser une des 4 valeurs de base et ajouter  `span-` + vers où on veut étaler l'élément. Par exemple, `inset-area: right span-bottom` va placer l'élément à droite de l'ancre, de la case centrale jusqu'à la case du bas.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
Encore une fois on va pouvoir utiliser les valeurs logiques (avec <code>block</code> et <code>inline</code>).
</div>

Pour aider à visualier cette grille et les nombreuses propriétés de `inseat-area`, les devs de Chrome on créé un outil de visualisation très pratique&nbsp;: https://anchor-tool.com/

Si on veut utiliser `inset-area` avec notre exemple qui place le tooltip centré au dessus de l'ancre, voici ce que ça donnerait&nbsp;:

```css
.Tooltip {
  position: absolute;
  position-anchor: --button-anchor;
  inset-area: top;
}
```

## Le changement de position dynamique
On arrive dans le coeur du sujet, ce qui pour moi constitue le vrai plus de cette API&nbsp;: **elle permet à l'élément positionné de changer tout seul de position** lorsqu'il ne peut pas / plus apparaître dans le bloc qui le contient.

Pour cela on va créer une position de remplacement avec `@position-try`.

Pour l'instant notre tooltip s'ouvre au dessus du bouton&nbsp;: on peut faire en sorte que s'il n'y a pas de place au dessus du bouton alors il s'ouvre en dessous. On va donc créer un `@position-try` qui va s'appeller `--bottom-position` avec le `inset-area` qui placera le tooltip en dessous du bouton&nbsp;:

```css
@position-try --bottom-position {
  inset-area: bottom;
}
```

On va ensuite utiliser `--bottom-position` dans le tooltip, grâce à la propriété `position-try-options`&nbsp;:

```css
.Tooltip {
  position: absolute;
  position-anchor: --button-anchor;
  inset-area: top;
  position-try-options: --bottom-position;
}
```

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
À partir de Chromium 128 <code>position-try-options</code> s'appellera <code>position-try-fallbacks</code>
</div>

### Enchainer les positions de fallback

La magie de `position-try-options` c'est qu'**on peut enchainer les positions pour que l'élément se positionne toujours là où il a la place pour apparaître&nbsp;!**

Imaginons le cas suivant&nbsp;: l'élément se positionne par défaut en haut de l'ancre. Si il n'a pas la place de s'afficher, alors on veut le replacer en bas. S'il n'y a pas de place en bas, alors on veut l'avoir à droite de l'ancre. Enfin si la droite n'a pas assez d'espace disponible alors on veut afficher l'élément à gauche de l'ancre, si vraiment il n'a pas d'autre endroit où aller.

Imaginez-vous devoir implémenter ce comportement en JavaScript. Ou bien peut-être l'avez vous déjà fait et c'est pour cette raison que vous vous intéressez à cette API&nbsp;? En général ça donne lieu à l'écriture de calculs pas vraiment passionants sur la taille de l'élément à afficher, sa position, la place disponible par rapport au viewport, etc.

Eh bien ce temps est révolu&nbsp;! Enfin presque parce que l'API est expérimentale, patati patata... mais elle nous donne de l'espoir pour un futur pas si lointain où on pourra juste créer les positions correspondantes&nbsp;:

```css
@position-try --right-position {
  inset-area: right;
}

@position-try --left-position {
  inset-area: left;
}
```

Et les passer dans `position-try-options` à la suite de celle qu'on a ajouté tout à l'heure&nbsp;:

```css
position-try-options: --bottom-position, --right-position, --left-position;
```

Et voilà&nbsp;! [Vous pouvez tester (sur un navigateur compatible) ce Codepen](https://codepen.io/Alice-Fauquet/pen/zYVWYMN), en redimensionnant la fenêtre verticalement et horizontalement (l'ancre n'est pas centrée, c'est pour voir plus facilement le changement de position de l'élément).

Voici le code final de notre bouton et son tooltip&nbsp;:

```html
<div class="Tooltip">Tooltip<br />(Element positionné)</div>
<button class="Anchor">Bouton (Ancre)</button>
```

```css
body {
  display: grid;
  grid-template-rows: 1fr;
  justify-content: center;
  height: 100vh;
}

@position-try --bottom-position {
  inset-area: bottom;
}

@position-try --left-position {
  inset-area: left;
}

@position-try --right-position {
  inset-area: right;
}

button.Anchor {
  /* Anchor position API */
  anchor-name: --button-anchor;

  /* Element style */
  height: 40px;
  margin-top: 30vh;
  margin-left: 500px;
  appearance: none;
  background-color: lightcoral;
  border: 2px solid maroon;
  border-radius: 4px;
}

.Tooltip {
  /* Anchor position API */
  position: absolute;
  position-anchor: --button-anchor;
  inset-area: top;
  position-try-options: --bottom-position, --right-position, --left-position;

  /* Element style */
  max-width: 200px;
  background-color: lightblue;
  width: 100%;
  height: 100px;
  border: 2px solid darkblue;
  font-family: sans-serif;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
```

### Ajouter des préférences de fallback
Avec `position-try-order` on peut choisir quel fallback est le plus adapté en fonction de l'espace disponible&nbsp;:
-   `most-width` va prioriser l'endroit où l'élément positionné aura le plus d'espace en largeur
-   `most-height` va prioriser l'endroit où l'élément positionné aura le plus d'espace en hauteur

On a aussi accès aux version "logical" de ces valeurs&nbsp;: `most-block-size` et `most-inline-size`.

### Faire un `flip` encore plus facilement

Si jamais on a **le besoin très simple de passer l'élément d'un côté à l'autre**, l'API propose une syntaxe pour arriver au même résultat, avec les 3 valeurs suivantes à passer dans `position-try-options`&nbsp;:

- `flip-block` pour passer de haut en bas et vice versa,
- `flip-inline` pour passer de gauche à droite et vice versa,
- `flip-block flip-inline` pour faire soit `flip-block` soit `flip-inline` selon le cas.

<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>
<code>flip-block flip-inline</code> permet uniquement de passer au côté d'en face, il ne passe pas "sur le côté" lorsqu'il n'y a plus d'espace comme ce qu'on a fait juste avant avec l'enchainement de positions dans <code>position-try-options</code>.
</div>

Pour l'utiliser, on peut supprimer `@position-try --bottom-position` et directement utiliser `flip-block`&nbsp;:

```css
.Tooltip {
  position: absolute;
  position-anchor: --button-anchor;
  inset-area: top;
  position-try-options: flip-block;
}
```

## Récupérer la taille de l'ancre avec `anchor-size()`

L'Anchor Positioning API a encore quelques tours dans son sac. Le premier est `anchor-size()` qui va **permettre d'utiliser la taille (`width`, `height`, `block` ou `inline`) de l'ancre** dans l'élément positionnable. Encore une fois pour l'utiliser on va avoir besoin d'utiliser la syntaxe explicite, avec le nom de l'ancre indiqué dans `position-anchor`. On peut aussi l'utiliser dans `calc()` pour l'utiliser dans des calculs.
Par exemple, si on veut que la largeur de notre tooltip ne soit pas plus de 2 fois plus large que notre bouton, on peut faire&nbsp;:

```css
.Tooltip {
  position: absolute;
  position-anchor: --button-anchor;
  inset-area: top;
  max-width: calc(anchor-size(width) * 2);
}
```

## Gérer la visibilité de l'ancre

Mettons que notre bouton soit dans un bloc qui possède son propre scrolling (un élément avec `overflow-y: scroll` par exemple). Si on ouvre l'ancre en cliquant sur le bouton puis qu'on scroll jusqu'à ce que le bouton commence à disparaître, qu'est-ce qu'il doit se passer&nbsp;? C'est à cette question que va répondre le propriété `position-visibility`. Grâce à elle, **on peut choisir un peu plus précisément le comportement de l'élément positionable lorsque son ancre ou lui-même commence à disparaître**. Pour cela nous avons deux valeurs&nbsp;:

- `position-visibility: anchors-visible` va permettre de garder l'élément positionable visible **jusqu'à ce que l'ancre ne soit plus visible**. Dès qu'un bout de l'ancre n'est plus visible, l'ancre disparaît, et réaparaît lorsque l'ancre redevient entièrement visible.
- `position-visibility: no-overflow` va permettre de **cacher l'élément positionable dès que celui-ci commence à disparaître de la page**. La visibilité de l'ancre n'a pas de rôle à jouer dans la visibilité ou non de l'élément positionable.

Par défaut, si on ne met pas de `position-visibility`, l'élément positionable **ne va pas disparaître** même lorsque l'ancre ne sera plus visible&nbsp;!

## Implémentation en progressive enhancement

Il est possible de faire une implémentation en progressive enhancement, c'est à dire qu'on va utiliser l'Anchor Positioning API pour les navigateurs compatibles, et garder une implémentation "traditionnelle" pour les navigateurs non compatibles.

Pour cela en CSS on peut utiliser la *at-rule* `@supports` avec `anchor-name`. Le style qu'on va ajouter dans les accolades **ne sera pris en compte que si le navigateur connait `anchor-name`, et donc l'Anchor Positioning API**.

```css
@supports (anchor-name: --anchor) {
  /* Le style lorsque l'API est reconnue */
}
```

Et en JavaScript alors&nbsp;? On peut utiliser `document.documentElement.style`&nbsp;:

```javascript
if ("anchorName" in document.documentElement.style)`
```

Comme ça on peut continuer à utiliser les "anciennes" méthodes lorsque le navigateur ne connaît pas l'Anchor Positioning API, et **commencer à implémenter la nouvelle syntaxe dès maintenant&nbsp;!**

## Conclusion
Bien qu'encore très nouvelle l'Anchor Positioning API est très prometteuse et propose des solutions à certaines problématiques qu'on ne pouvait pas gérer en CSS. La gestion des ancres est un sujet complexe, mais cette API permet déjà, malgré qu'elle soit très récente, d'avoir une bonne gestion des différentes problématiques qu'on peut rencontrer lorsqu'on implémente un élément ancré. Elle est définitivement à suivre !

## Sources et articles sur le même thème
 - https://kizu.dev/anchor-positioning-experiments/
 - https://drafts.csswg.org/css-anchor-position-1/
 - https://css-irl.info/anchor-positioning-and-the-popover-api/
 - https://utilitybend.com/blog/lets-hang-an-intro-to-css-anchor-positioning-with-basic-examples
 - https://coryrylan.com/blog/flow-charts-with-css-anchor-positioning
 - https://developer.chrome.com/blog/anchor-positioning-api
