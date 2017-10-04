---
layout: post
title: Le drag and drop Let's Create
excerpt: Dans cet article, nous allons voir comment a été réalisé le drag and drop du jeu Let's Create pour Maisons du Monde
authors:
    - jiefmoreno
permalink: /fr/drag-and-drop-letscreate/
categories:
    - javascript
tags:
    - javascript
    - letscreate
cover: /assets/2017-09-28-drag-and-drop-letscreate/cover.jpg
---

# Le drag and drop Let's Create

Eleven-labs a créé son Studio il y a un peu plus d'un an, afin de pouvoir prendre en charge des projets très complets directement dans son Headquarter. C'est avec plaisir que cet été nous (une des équipes du Studio) avons travaillé sur le projet [Let's Create de Maisons du Monde](https://letscreate.maisonsdumonde.com/FR/fr) en développant un jeu permettant de décorer une pièce de manière interactive : l'utilisateur peut sélectionner des objets et les placer dans la pièce de son choix. Mais comment s'y est-on pris ?

### Problématique

Dans cet article, je vais vous décrire la partie drag and drop du jeu. Je m'attarderai particulièrement sur le redimensionnement des objets. Je vous propose de réaliser une version simplifiée de cette fonctionnalité, en utilisant simplement javascript.

### Le drag and Drop

Tout d'abord, voici les images que nous allons utiliser :

![]({{ site.baseurl }}/assets/2017-09-28-drag-and-drop-letscreate/room.jpeg)

![]({{ site.baseurl }}/assets/2017-09-28-drag-and-drop-letscreate/desk.png)

![]({{ site.baseurl }}/assets/2017-09-28-drag-and-drop-letscreate/trackpad.png)

![]({{ site.baseurl }}/assets/2017-09-28-drag-and-drop-letscreate/keyboard.png)

![]({{ site.baseurl }}/assets/2017-09-28-drag-and-drop-letscreate/screen.png)

Plaçons les objets dans la pièce. Pour pouvoir les bouger, ils doivent avoir une position absolue :
```html
<!-- index.html -->

<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div id="container" class="container">
      <img
        class="room"
        src="./room.jpeg"
        draggable="false"
  			ondragstart="return false;">
      <div id="desk" class="object">
        <img
          class="object-picture"
          src="./desk.png"
          draggable="false"
    			ondragstart="return false;">
      </div>
      <div id="screen" class="object">
        <img
          class="object-picture"
          src="./screen.png"
          draggable="false"
    			ondragstart="return false;">
      </div>
      <div id="trackpad" class="object">
        <img
          class="object-picture"
          src="./trackpad.png"
          draggable="false"
    			ondragstart="return false;">
      </div>
      <div id="keyboard" class="object">
        <img
          class="object-picture"
          src="./keyboard.png"
          draggable="false"
    			ondragstart="return false;">
      </div>
    </div>
    <script type="text/javascript" src="./script.js"></script>
  </body>
</html>
```
```css
/* style.css */

body {
  margin: 0;
}

.container {
  display: inline-block;
  position: relative;
}

.room {
  height: 800px;
}

.object {
  position: absolute;
}

.object-picture {
  height: 100%;
}
```
On initialise la taille et la position des objets :

```javascript
/* script.js */

const deskElement = document.querySelector('#desk');
const keyboardElement = document.querySelector('#keyboard');
const containerElement = document.querySelector('#container');
const screenElement = document.querySelector('#screen');
const trackpadElement = document.querySelector('#trackpad');

(function initialisation() {
  deskElement.style.height = '108px';
  deskElement.style.top = '30px';
  deskElement.style.left = '10px';

  keyboardElement.style.height = '8px';
  keyboardElement.style.top = '30px';
  keyboardElement.style.left = '308px';

  screenElement.style.height = '69px';
  screenElement.style.top = '30px';
  screenElement.style.left = '460px';

  trackpadElement.style.height = '5px';
  trackpadElement.style.top = '30px';
  trackpadElement.style.left = '650px';
})();
```

Pour pouvoir réaliser le drag and drop, nous allons ajouter des listeners à ces objets :
```javascript
/* script.js */
...

const getPositionForElement = element => event => {};

(function defineListeners() {
  deskElement.addEventListener('mousedown', getPositionForElement(deskElement));
  keyboardElement.addEventListener(
    'mousedown',
    getPositionForElement(keyboardElement)
  );
  screenElement.addEventListener(
    'mousedown',
    getPositionForElement(screenElement)
  );
  trackpadElement.addEventListener(
    'mousedown',
    getPositionForElement(deskElement)
  );
})();
```
Ces listeners appellent la fonction getPositionForElement au drag de l'objet.

Dans cette fonction, nous allons récupérer la position de la souris jusqu'au drop. On attribue ensuite la position de la souris à la position de l'objet :

```javascript
/* script.js */
...
const getPositionForElement = element => () => {
  const getPosition = event => {
    element.style.top = `${event.clientY}px`;
    element.style.left = `${event.clientX}px`;
  };

  containerElement.addEventListener('mousemove', getPosition);

  containerElement.addEventListener('mouseup', () => {
    containerElement.removeEventListener('mousemove', getPosition);
  });
};
...
```

Notre drag and drop est maintenant fonctionnel !

Mais on peut observer ce petit saut lors du drag d'un objet.

Reprenons notre code :

On récupère la position du curseur, et on place l'objet au niveau de celui-ci. Mais si l'utilisateur à cliqué sur le milieu de l'objet, un décalage se crée.

Corrigeons ce problème :
```javascript
/* script.js */

...

const getPositionForElement = element => startEvent => {
  const offsetTop = startEvent.clientY - element.offsetTop;
  const offsetLeft = element.offsetLeft - startEvent.clientX;

  const getPosition = mouseMoveEvent => {
    const top = mouseMoveEvent.clientY - offsetTop;
    const left = mouseMoveEvent.clientX + offsetLeft;

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  };
  ...
};
  ```

### Taille d'un objet selon sa position

C'est ici qu'on rentre dans le coeur de notre problèmatique mathématique.
On veut que la taille de l'objet s'adapte à la perspective de la pièce.
Dans notre pièce, on peut détecter quatre zones principales.
- le sol
- le coté gauche
- le coté droit
- le mur du fond


![]({{site.baseurl}}/assets/2017-09-28-drag-and-drop-letscreate/room-sections.png)

Sur le sol :

Il faut que la taille de notre objet s'adapte selon l'axe y. C'est à dire que plus l'objet est haut sur l'image, plus l'objet sera petit.

Sur les cotés :

Il faut que la taille de notre objet s'adapte selon l'axe x. plus l'objet sera vers le centre, plus il sera petit.

Sur le mur du fond :

L'objet sera toujours à sa taille minimum.

pour détecter les zones depuis javascript, on va repérer les points délimitant le sol.

```javascript
const points = [
  { left: 0, top: 786 },
  { left: 287, top: 544 },
  { left: 825, top: 544 },
  { left: 1067, top: 758 }
];
```

Pour savoir sur quelle section se trouve l'objet, nous allons  d'abord faire un repérage sur des sections verticales.

![]({{site.baseurl}}/assets/2017-09-28-drag-and-drop-letscreate/room-sections-2.png)

```javascript
const isInSection = x => points.findIndex(({ left }) => x < left);
```

Dans chaque section verticale, il y a une partie haute et une partie basse, qui va nous permettre de déterminer dans quelle zone est notre objet. Ces zones sont délimitées par des vecteurs.

```javascript
const isInZone = (section, mousePosition) => {
  const p1 = points[section - 1];
  const p2 = points[section];

  const func = getEquation(p1.left, p1.top, p2.left, p2.top);

  switch (section) {
    case 1:
      return func(mousePosition.left) < mousePosition.top ? 'sol' : 'gauche';
    case 2:
      return func(mousePosition.left) < mousePosition.top ? 'sol' : 'fond';
    case 3:
      return func(mousePosition.left) < mousePosition.top ? 'sol' : 'droite';
    default:
      return 'out';
  }
};
```

Pour construire nos fonctions linéaire représentant les vecteurs, on utilise la fonction getEquation, qui crée une fonction depuis deux points :
```javascript
/* script.js */

const getEquation = (x1, y1, x2, y2) => {
  // if the two points have the same ordinate
  if (x1 === x2) {
    return () => Math.max(y1, y2);
  }

  // else
  const a = (y1 - y2) / (x1 - x2);
  const b = (x1 * y2 - x2 * y1) / (x1 - x2);

  return x => x * a + b;
};
```

Maintenant qu'on sait dans quelle zone notre objet est, il faut déterminer sa taille selon sa position.

On peut utiliser notre générateur de fonction linéaire :

Resize coté gauche :
![]({{site.baseurl}}/assets/2017-09-28-drag-and-drop-letscreate/room-resize-left.png)
 - A: left = 0px > Taille = 800px
 - B: left = 287px > Taille = 354px

```javascript
const getResizeLeft = getEquation(0, 800, 287, 354);
```

Resize coté droit :
![]({{site.baseurl}}/assets/2017-09-28-drag-and-drop-letscreate/room-resize-write.png)
 - A: left = 287px > Taille = 354px
 - B: left = 1067px > Taille = 800px

```javascript
const getResizeWrite = getEquation(825, 354, 1067, 800);
```

Resize sol :
![]({{site.baseurl}}/assets/2017-09-28-drag-and-drop-letscreate/room-resize-ground.png)
 - A: top = 544px > Taille = 354px
 - B: top = 800px > Taille = 800px

```javascript
const getResizeBottom = getEquation(544, 354, 800, 800);
```

Resize fond :
on aura toujours la taille minimale.
```javascript
const getResizeBack = () => 354;
```

On crée une fonction qui va appeler le bon resize selon la zône de l'objet :
```javascript
/* script.js */
...
const getObjectScale = position => {
  const zone = isInZone(isInSection(position.left), {
    top: position.top,
    left: position.left
  });

  switch (zone) {
    case 'left':
      return getResizeLeft(position.left);
    case 'right':
      return getResizeWrite(position.left);
    case 'ground':
      return getResizeGround(position.top);
    case 'back':
      return getResizeBack();
    default:
      return getResizeBack();
  }
};
...
```

On vient de déterminer la hauteur de la pièce en pixel, selon la position sur l'image.

On doit maintenant déterminer le ratio entre l'objet et la hauteur de la pièce. On peut utiliser les tailles réelles des objets et de la pièce :

T pièce > 100%

T objet > X %

X % = 100% x T objet / T pièce

```javascript
const getObjectRatio = objectId =>
  objects[objectId].size / objects.room.size || 1;
```
En renseignant la taille réelle des objets et de la pièce dans un objet, vous remarquerez que nous récupérons la moitié de la hauteur et la largeur de l'objet, pour que le point de repère soit au centre de l'objet.
```javascript
const objects = {
  desk: { size: 0.7 },
  keyboard: { size: 0.05 },
  room: { size: 2.3 },
  screen: { size: 0.45 },
  trackpad: { size: 0.03 }
};
```
On attribue la taille calculée à l'objet lors de chaque mouvement :
```javascript
/* script.js */
...
const getPosition = mouseMoveEvent => {
  const top = mouseMoveEvent.clientY - offsetTop;
  const left = mouseMoveEvent.clientX + offsetLeft;

  const scale = getObjectScale({
    left: left + element.offsetWidth / 2,
    top: top + element.offsetHeight / 2
  });
  const ratio = getObjectRatio(element.id);

  const objectHeight = scale * ratio;

  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
  element.style.height = `${objectHeight}px`;
};
...
```

Et voilà, en baladant vos objets dans la pièce, vous pouvez observer leur changement de taille selon leur position dans la pièce.

N'hésitez pas à laisser un commentaire si vous avez des questions ou des remarques !
