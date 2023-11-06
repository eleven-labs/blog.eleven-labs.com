---
contentType: article
lang: fr
date: '2020-01-22'
slug: lazy-load-react
title: Une application React plus réactive - Le lazy load
excerpt: >-
  Dans cet article, nous allons vous présenter le lazy load et comment
  l’implémenter dans un projet React pour optimiser le chargement de vos pages.
categories:
  - javascript
authors:
  - kcordier
keywords:
  - react
  - lazy load
  - ux
  - images
  - optimisation
  - lazy loading
---

## Intro

Bon ! Vous avez fluidifié les interactions de votre application grâce à [l’optimistic ui](https://blog.eleven-labs.com/fr/optimistic-ui-avec-react-et-apollo-js/), vous avez diminué l'impression d’attente lors du chargement de vos pages grâce au [skeleton screen](https://blog.eleven-labs.com/fr/skeleton-screen-avec-react-et-apollo-js/), et malgré tout ça vos pages mettent encore trop longtemps à s'afficher. J’ai une petite question pour vous :

Qu’est-ce qui fait en moyenne 50% du poids de votre page (selon [HTTP Archive](https://httparchive.org/)) et qui serait susceptible de ralentir le chargement de notre site ?
.
.
.
C’est élémentaire mon cher Wilson… Ce sont les **images**.

Donc la solution ici est simple, réduire le poids des images de votre page. Pour cela, il existe une multitude de services en ligne, comme par exemple l'outil de google [squoosh.app](http://squoosh.app). Mais on peut aller encore plus loin.

Et si on n'affichait aucune image ?

Loin de moi l'idée de retourner dans l'ancien temps du web 1.0 et du minitel, mais plutôt d'utiliser la technique du **Lazy loading**

## On m'vois plus, on m'vois

Le **lazy loading** est une technique, aujourd'hui largement répandue dans le web, qui consiste à charger un contenu de manière asynchrone. Cela permet de grandement alléger le poids des pages web en affichant uniquement le contenu nécessaire au bon fonctionnement de la page et ainsi assurer un chargement rapide, ce qui peut de surcroît améliorer votre SEO.
Dans la pratique, cette technique est utilisée pour les médias mais elle est surtout utile pour ne pas charger les contenus qui n’apparaissent pas à l'utilisateur. On peut prendre l'exemple des commentaires d'un article qui ne s'afficheraient uniquement si l'utilisateur a pris la peine de descendre jusqu'en bas de la page.

Malheureusement, il existe un problème avec cette technique, qui est le référencement des données. Les robots des moteurs de recherche n’exécutant pas le JS, il n'est pas possible d'indexer les contenus affichés de manière asynchrone, du moins en partie. Pour les images nous pouvons utiliser la balise  **\<noscript\>** qui sera exécutée uniquement dans les cas où le javascript n'est pas actif, et qui permettra à votre moteur de recherche préféré de voir votre image.

Maintenant que nous avons la théorie, mettons-la en pratique avec React.

## Mise en place du lazy loading

L'idée n'est pas de créer un simple composant image mais de créer un hook qui puisse centraliser la logique du lazy loading et être utilisée dans de multiples exemples :

```jsx
// useIntersectionObserver.jsx
import { useState, useEffect } from 'react';
import 'intersection-observer';

const useIntersectionObserver = (ref, { threshold, root, rootMargin } = {}) => {
  // configure the state
  const [state, setState] = useState({
    inView: false,
    triggered: false,
  });

  useEffect(() => {
    let observer;
    // check that the element exists, and has not already been triggered
    if (ref.current && !state.triggered) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries, observerInstance) => {
            // checks to see if the element is intersecting
            if (entries[0].intersectionRatio <= 0) {
              return;
            }

            // unobserve the element
            observerInstance.disconnect();
            // if it is update the state, we set triggered as to not re-observe the element
            setState({
              inView: true,
              triggered: true,
            });
          },
          {
            threshold: threshold || 0,
            root: root || null,
            rootMargin: rootMargin || '0%',
          },
        );
      }

      observer.observe(ref.current);
    }

    return () => {
      if (observer && observer.unobserve && ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return [state.inView];
};

export default useIntersectionObserver;
```

Ici nous utilisons **IntersectionObserver** (ou vous pouvez trouver la doc [ici](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API)), cette librairie permet de détecter les possibles intersections entre un élément et la ligne de flottaison.
Ce hook prend en paramètre la référence d'un élément de la page, ainsi que les options de **IntersectionObserver** afin de pouvoir mieux paramétrer au cas par cas. Une fois l’élément détecté dans le champ de vision, nous changeons un state qui est renvoyé aux clients de notre hook, tout en pensant bien à nous déconnecter de l'observer.

Grâce à ce hook nous pouvons ainsi créer notre composant d'image "**lazy loaded**" comme ceci :

```jsx
// ImageLazyLoad.jsx

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useIntersectionObserver } from '../../hooks';
import SkeletonItem from '../SkeletonItem';

const _loaded = {};

const ImageLazyLoad = ({ className, url, alt, placeholder = null, forcePreloadImage = false }) => {
  const elementRef = useRef(null);
  const [inView] = useIntersectionObserver(elementRef);
  const [loaded, setLoaded] = useState(_loaded[url]);

  useEffect(() => {
    if (inView) {
      if (_loaded[url]) {
        setLoaded(true);

        return;
      }

      const img = new Image();
      img.src = url;
      img.onload = () => {
        _loaded[url] = true;
        setLoaded(true);
      };
    }
  }, [inView]);

  return (
    <div ref={elementRef} className={className ? `${className}-wrapper` : null}>
      {!loaded ? (
        placeholder ? (
          placeholder
        ) : (
          <SkeletonItem className={className} />
        )
      ) : (
        <img src={url} className={className} alt={alt} />
      )}
      <noscript>
        <img src={url} className={className} alt={alt} />
      </noscript>
    </div>
  );
};

export default ImageLazyLoad;
```

Dans ce composant nous utilisons le retour de **useIntersectionObserver** afin de savoir quand charger l'image. Pour cela nous utilisons l'objet **Image**  et sa fonction **onLoad**  qui nous permet de savoir quand l'image à fini de charger et ainsi quand interchanger le placeholder (par défaut le skeleton item créé dans cet [article](https://blog.eleven-labs.com/fr/skeleton-screen-avec-react-et-apollo-js/) ) et l'image définitive. On n'oublie pas de rajouter une seconde image dans une balise **\<noscript\>** afin de référencer notre image.

Voici le résultat :

![]({BASE_URL}/imgs/articles/2020-01-22-lazy-load-react/image-lazy-load.gif)

Si vous voulez un effet d'image floue comme le fait le site **Medium**, c'est possible.

![]({BASE_URL}/imgs/articles/2020-01-22-lazy-load-react/medium-lazy-load.jpeg)

La technique la plus simple est d'afficher une image de petite taille (et donc moins lourde), et de l’étirer à la taille souhaitée. Dans notre exemple nous pouvons déclarer en paramètre de placeholder l'image que nous adapterons au contenu grâce au CSS.

```jsx
<ImgLazyLoad
  url={`https://picsum.photos/200/200/?image=${index}`}
  alt={'alt'}
  className={'image'}
  placeholder={<img className={'placeholder'} src={`https://picsum.photos/30/30/?image=${index}`} alt={'alt'} />}
/>
```

Voici le résultat :

![]({BASE_URL}/imgs/articles/2020-01-22-lazy-load-react/image-lazy-load-blur.gif)

Et ceci n'est qu'un exemple parmi tant d'autres.

## Conclusion

En conclusion nous pouvons dire que le **lazy loading** est un concept très important du web d'aujourd'hui. Que ce soit le besoin de rapidité des applications ou la nécessité d'économiser de la bande passante pour les mobiles, il y a toujours une bonne raison de l'intégrer.
Pour en finir avec les images de vos applications, il est bon à savoir que si vous êtes "too lazy" pour mettre en place ce que je vous ai proposé plus haut, les navigateurs récents commencent à mettre en place du **lazy loading native** grâce à l’attribut "**loading=lazy**" à intégrer dans vos balises img.

C'est ainsi que se finit ma suite d'articles sur les techniques permettant d'améliorer l’expérience utilisateur de votre site. Si vous avez appliqué les trois concepts de ce triptyque alors félicitation, votre application React est officiellement plus réactive.
