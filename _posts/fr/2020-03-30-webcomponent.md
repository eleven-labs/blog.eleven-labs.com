---
layout: post
title: WebComponent
excerpt: Dans cet article, nous allons apprendre à créer un webcomponent
authors:
    - aallier
lang: fr
permalink: /fr/webcomponent/
categories:
    - javascript
tags:
    - javascript
    - web
---

Les normes liées au web ont beaucoup évolué depuis une dizaine d’années, le cap de l’HTML5 CC3 a été difficile mais a ouvert la porte vers de plus en plus de fonctionnalité.
Une de ces fonctionnalités est le WebCompponent, la possibilité de pouvoir créer de composant indépendant et ré-utilisable.
Il ressemble aux composants de React ou Angular mais avec la particularité de n’être dépendant que du navigateur, un webComponent peut donc fonctionner dans une page web indépendamment du framework utilisé.
Nous allons voir comment créer un webComponent simple permetant de gérer un système de popin.
##Principe
Elle se base sur 3 principes :
- [template](https://developer.mozilla.org/fr/docs/Web/HTML/Element/template)
- [shadowDOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot)
- [customElements](https://developer.mozilla.org/fr/docs/Web/Web_Components/Using_custom_elements)

###template
Le tag **template** permet de définir un block HTML ré-utilisable pouvant contenir des sous block `slot` surchargés lors de son utilisation, concrètement ça ressemble à ça :
```html
<template>
    <div class="block">
        <div class="close"><img src="icons-close_24.png"></div>
        <div class="content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
```
Les balises `template` ne sont pas affichées sur la page, elles doivent être copiées puis ajoutées au DOM grâce à `appendChild`
La balise `slot` permet d'insérer du html à la place grâce a la propriété `name`
###customELement
L'objet [customElements](https://developer.mozilla.org/fr/docs/Web/API/Window/customElements) possède la méthode `define` permetant de créer une nouvelle balise, elle a besoin de 2 paramètres :
- le nom de la balise !Attention il est imperatif d'avoir un *-* dans le nom!
- la class définissant la nouvelle balise
```javascript
customElements.define('popin-component', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Le composant est créé
    }

    adoptedCallback() {
        // Le composant est déplacé
    }

    disconnectedCallback() {
        // Le composant est detruit
        // Attention si le noeud est déplacé alors cette méthode sera appeler puis connectedCallback
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`L'attribut ${name} à changé de valeur de ${oldValue} à ${newValue}`);
    }
}
```
Comme on peut le voir la classe étend HTMLElement, elle va donc non seulement hériter de toutes les méthodes et propriétés d'HTMLElement et être considérée comme tel.
Certaines méthodes disponibles vont nous être très utiles `connectedCallback`, à la fin de la création de l'élément lorsqu'il est chargé dans la page, `disconnectedCallback` lorsque l'élément est supprimé et `attributeChangedCallback` lorsqu'une propriété est modifiée
###shadow DOM
Le principe du shadow DOM est la création d'un DOM virtuel à l'intérieur même d'un élément html.
Tout le javascript, html et css fonctionnent dans ce shadow DOM mais n'ont aucun impact à l'extérieur de cet élément et inversement.
Ce qui veux dire qu'on peut nommer une fonction dans la page et dans le shadow DOM sans qu'elles ne se surchargent, cela vaut aussi pour les id et les styles css.
Pour ajouter un shadow DOM il faut utiliser [attachShadow](https://developer.mozilla.org/fr/docs/Web/API/Element/attachShadow) hérité depuis l'objet [Element](https://developer.mozilla.org/fr/docs/Web/API/Element) avec comme paramètre un objet de configuration avec comme seul clef `mode`, on peut par la suite lui ajouter du html, dans notre cas nous voulons utiliser notre template.
```javascript
let popinTemplate = document.createElement('template');
Element.attachShadow({mode: 'open'}).appendChild(popinTemplate.content.cloneNode(true));
```
### pseudo class css
Le shadow DOM donne accès à de nouvelles pseudo class CSS, elles permettent entre autre de définir un style en fonction de la position du component dans le DOM.
Elles n'ont aucun effet en dehors d'un shadow DOM.
- :host
    Pseudo class css faisant référent à la racine du shadow DOM
- :host(<class>)
    Permet d'appliquer un style lorsque la class en paramètre est définit sur le component
- :host-context(<Element>)
    Permet d'appliquer un style lorsque le component est un descendant d'ElementName
### implementation
Pour n'avoir notre composant que dans un seul fichier nous allons déclarer le template en javascript, on va en profiter pour ajouter un peu de css histoire de faire plus joli.
Le template n'a pas besoin d'être ajouté au document, nous allons simplement le cloner et l'ajouter au shadowRoot.
```javascript
let popinTemplate = document.createElement('template');
popinTemplate.innerHTML = `
<style type="text/css">
    :host {
        position: fixed;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        overflow: auto;
        opacity: 0;
        visibility: hidden;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(0,0,0,0.5);
        transition: all 0.4s ease;
    }
    .block {
        box-shadow: 0px 0px 7px 1px grey;
        background-color: #fff;
        padding: 20px;
        min-width: 700px;
        min-height: 300px;
    }
    .close img {
        cursor: pointer;
    }
    .content {
        padding: 20px;
    }
</style>
<div class="block">
    <div class="close"><img src="icons-close_24.png"></div>
    <div class="content">
        <slot name="content"></slot>
    </div>
</div>
`;
```
Maintenant construisons notre class, on va considérer que la variable `popinTemplate` a été précédement créé.
```javascript
customElements.define('popin-component', class extends HTMLElement {
    // Obligatoire afin d'écouter les changements sur la propriété modal grace a la méhode attributeChangedCallback
    static get observedAttributes() {
        return ['modal'];
    }

    constructor() {
        // Ne pas oublier d'appeler le constructeur de l'objet parent HTMLElement
        super();
        // Creation du shadowRoot puis ajout d'un clone du template
        this.attachShadow({mode: 'open'}).appendChild(popinTemplate.content.cloneNode(true));

        [this.close] = this.shadowRoot.querySelectorAll('img');

        this.isVisible = false;
        this.isModal = false;
    }

    // Après création du tag, ajout des divers événements
    connectedCallback() {
        this.close.addEventListener('click', e => !this.isModal && this.hide());

        document.addEventListener('keyup', e => !this.isModal && this.keyUp(e));
        this.addEventListener('click', e => !this.isModal && this.click(e));

        this.modal = !!this.getAttribute('modal');
    }

    // Ecoute de changement sur la propriété "modal"
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'modal') {
            return;
        }

        this.modal = newValue;
    }

    // Petite méthode pour détecter sur l'utilisateur a clické en dehors de la popin, si oui fermeture de la popin
    click(e) {
        const [block] = this.shadowRoot.querySelectorAll('div');
        let parent = e.originalTarget;
        while(parent) {
            if (parent === block) {
                return;
            }

            if (parent == this) {
                this.hide();
            }

            parent = parent.parentNode;
        }
    }

    // Si l'utilisateur appuye sur la touche échape fermeture de la popin
    keyUp(e) {
        if (e.key === 'Escape') {
            this.hide();
        }
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    // Le setter de la propriété visible, c'est la réelle méthode qui ouvre et ferme la popin
    set visible(value) {
        this.isVisible = !!value;
        if (!!value) {
            this.style.visibility = 'visible';
            this.style.opacity = 1;

            return;
        }

        this.style.visibility = 'hidden';
        this.style.opacity = 0;
    }

    get visible() {
        return this.isVisible;
    }

    set modal(value) {
        this.isModal = !!value;
        this.close.style.display = !!value ? 'none' : 'block';
    }

    get modal() {
        return !!this.getAttribute('modal');
    }
});
```
## Utilisation
On l'utilise exactement de la même manière que les balises standards, on peut utiliser des propriétés communes à tous les éléments comme `id`, `name` ou `style` mais aussi les propriétés que l'on a ajouté `modal`.
Il y a tout de même une petite différence, l'utilisation de la propriété `slot` c'est ce qui nous permet de définir un élément qui sera placé dans la balise `slot` du template. Tout ce qui ne sera pas dans un slot géré par le template ne sera pas affiché.
```html
<popin-component id="popin" modal="true">
    <div slot="content" id="popin-content">
        Ce qui va apparaître dans la popin
    </div>
</popin-component>
```
Pour afficher ou faire disparaitre la popin il suffit d'appeler les méthodes `show` et `hide` que nous avons définit dans sa classe.
```javascript
// On affiche la popin
document.getElementById('popin').show();
// On la fait disparaitre
document.getElementById('popin').hide();
```
Nous pouvons connaitre son état grace à la propriété `visible`
```javascript
// Renvera true si la popin est visible sinon false
document.getElementById('popin').visible;
```
Cette propriété a aussi un setter il nous est donc possible d'afficher ou de faire disparaitre la popin en la modifiant.
```javascript
// Aura le même effet que l'appel de la méthode show()
document.getElementById('popin').visible = true;
```
Voilà notre composant popin complètement indépendant et facilement installable et utilisable dans un projet en javascript vanilla, react, angular ou vue.
Seul petit problème, certain navigateur ne le supporte pas, coucou IE, mais pas de panique il existe un [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) qu'on espére comme solution temporaire.
Vous pouvez retrouver un grand nombre de WebComponents disponible sur ce [site](https://www.webcomponents.org/)
## Ressources
- [Github exemple](https://github.com/Ghau/webcomponent)
- [MDN WebComponents](https://developer.mozilla.org/fr/docs/Web/Web_Components)
- [Standard specification](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [Google developpers](https://developers.google.com/web/fundamentals/web-components/)
- [Polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)
- [WebComponent ressources](https://www.webcomponents.org/)