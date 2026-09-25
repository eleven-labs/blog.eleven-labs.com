---
contentType: article
lang: fr
date: '2019-10-16'
slug: skeleton-screen-avec-react-et-apollo-js
title: Une application React plus réactive - Le skeleton screen
excerpt: >-
  Dans cet article, nous allons vous présenter le skeleton screen et vous
  montrer comment l'implémenter dans votre application React facilement grâce à
  ApolloJS
categories:
  - javascript
authors:
  - kcordier
keywords:
  - react
  - apollojs
  - apollo
  - ux
  - skeleton screen
  - squelette
---

## Intro

Êtes-vous quelqu’un de pati… ah non je me [répète]({BASE_URL}/fr/optimistic-ui-avec-react-et-apollo-js/).
Avez vous déjà réalisé une “one page application” (ou une “application web monopage”, dans la langue de Maître Gims) ?
Si oui, vous devez être au fait de la problématique du temps de chargement lors d’un changement de page.
Ce moment de transition ou les blocs statiques de notre application comme le header et le footer sont affichés mais que le contenu, lui, est encore en chargement dû à une mauvaise connexion ou à une API longue à répondre.
Comment résoudre ce problème que j’aime appeler “la transition mâchoire” ?

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/no_loading.gif)

Une première solution est de forcer une hauteur minimum à notre contenu afin d'éviter l’effet mâchoire.

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/min_height.gif)

Le problème avec cette solution est que l’on manque d’information quant à l’état de la page : la page est-elle en chargement ? La page demandée est-elle une simple page blanche ? L’application est-elle plantée ?
Pour toutes ces problématiques il nous suffit simplement d’ajouter un loader.

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/loader.gif)

Bon, tout ça c’est bien, mais on peut faire encore mieux. On peut mettre en place un **Skeleton screen** !

## Skeleton ? Hoouuuu spookie !

Derrière ce nom effrayant se cache une idée de design décrite par [Luke Wroblewski](https://www.lukew.com/about/).
Elle consiste à afficher ce à quoi devrait ressembler la page, mais avec des placeholders à la place des données.
“Mais pourquoi faire ça ?” vous allez me dire. Selon Luke, le loader pose un véritable problème comme expliqué dans [cet article](https://www.lukew.com/ff/entry.asp?1797).

Comme il le stipule, le fait de voir un spiner ou une barre de chargement renvoie l’utilisateur à l’idée d’attendre. Et par conséquent cela donne l'impression que le temps passe plus lentement. Comme quand vous regardez une horloge et que le temps semble ralenti, pour reprendre son exemple.
Le **skeleton screen** est aujourd’hui utilisé par la plupart des géants d’internet comme youtube ou LinkedIn pour ne citer qu’eux deux.

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/skeleton_youtube.png)
Youtube

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/skeleton_linkedin.png)
LinkedIn

Bon, maintenant que nous avons le principe et quelques exemples, comment faire un bon **skeleton screen** ?
Premièrement, vous devez remplacer les images et les zones de texte par des formes simples de couleur grises.
Si vous le souhaitez, vous pouvez choisir d’utiliser d’autres couleurs à condition qu’elles soient neutres.

Je déconseille de remplacer mot pour mot tout le contenu, il est préférable de sélectionner des parties importantes de l’affichage.
Comme par exemple : le titre, le sous-titre, l’image, et 2 lignes de descriptions pour prendre le cas du squelette d’un poste LinkedIn.
Ici, exit la date de parution, le nombre de like ou les liens... Nous restons au plus simple.

Ensuite, vous devez ajouter du mouvement. Grâce au css, vous pouvez créer des effets de scintillement qui rappelleront que notre application n’est pas figée. Préférez des vagues de gauche à droite comme nous pouvons le voir sur les différents exemples donnés plus haut.

Pour finir, il est préférable de découper ses squelettes par composants plutôt que de réaliser un page complète.
Grâce à ce découpage vous pouvez réaliser une page qui se construit au fur et à mesure que les différentes parties sont hydratées par les données.

Mettons maintenant ça en pratique dans une application React.

## Mise en place du skeleton

En premier lieu, nous allons créer notre composant placeholder.

```jsx
// SkeletonItem.jsx
import React from 'react';
import classNames from 'classnames';

import './styles.scss';

const SkeletonItem = ({ style, className }) => (
    <div className={classNames('skeleton-item', className)} style={style} />
);

export default SkeletonItem;
```

Ici rien de compliqué. Il s'agit juste de renvoyer une div avec la classe css **‘skeleton-item’** qui nous permettra de le styliser et de l’animer.

Ce composant étant la base de tous les squelettes de notre application, nous ne pouvons pas directement lui donner une hauteur et une largeur. C’est pour cela que nous lui passons un objet style contenant les informations de sa taille, ainsi que d’autre propriétés comme ses marges ou pourquoi pas une couleur secondaire.

À côté de ça nous passons aussi un classname à notre composant. Il correspond à la classe de l’objet remplacé.
Cela nous permet de ne pas avoir à redéfinir complètement le style de notre placeholder.
Ajouté à cela nous avons la feuille de style suivante :

```scss
// styles.scss
.skeleton-item {
    background-color: #D8D8D8;
    border-color: #D8D8D8;
    display: inline-block;
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: -125%;
        left: -100%;
        width: 40px;
        height: 350%;
        opacity: 0;
        transform: rotate(45deg);
        background: rgba(255, 255, 255, 0.20);
        background: linear-gradient(to right, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0) 100%);
        animation: shine;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
    }
}

@keyframes shine {
    from {
        opacity: 0.5;
        left: -100%;
    }

    to {
        opacity: 1;
        left: 200%;
    }
}
```

Une fois notre **SkeletonItem** réalisé voilà à quoi il ressemble une fois une taille donnée :

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/skeleton_item.gif)

Maintenant que nous avons créé la base, tel un os, assemblons-en plusieurs afin de créer le squelette d’un composant.
Pour notre exemple, nous allons prendre un élément d’une liste comme celui-ci :

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/list_item.png)

Voici son code :

```jsx
// MovieItem.jsx
import React from "react";
import PropTypes from "prop-types";
import { capitalize, truncate } from "lodash";

import { Grid, Paper, Typography, Button } from "@material-ui/core";

import useStyles from "./styles";

const MovieItem = ({ title, image, date, summary }) => {
    const classes = useStyles();

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.card}>
                <img
                  className={classes.cardMedia}
                  src={image}
                  alt={capitalize(title)}
                />
                <div className={classes.cardContent}>
                    <div className={classes.cardDetails}>
                      <Typography
                        gutterBottom
                        component="h1"
                        className={classes.cardTitle}
                      >
                          {capitalize(title)}
                      </Typography>
                      <Typography className={classes.textDate}>{date}</Typography>
                      <Typography className={classes.textSummary}>
                          {truncate(summary, {
                            length: 215,
                            separator: /,? +/
                          })}
                      </Typography>
                    </div>
                    <Button size="small" className={classes.buttonMore}>
                      More Info
                    </Button>
                </div>
            </Paper>
        </Grid>
    );
};

MovieItem.propTypes = {
  date: PropTypes.string,
  name: PropTypes.string,
  summary: PropTypes.string,
  image: PropTypes.string
};

export default MovieItem;
```

Pour réaliser sa version **skeleton** nous allons garder la structure HTML et garder uniquement l’image, le titre, et une ligne de description. Pour donner un peu plus de contraste, nous avons donné une couleur plus sombre à notre image.
```jsx
// MovieItemSkeleton.jsx
import React, { useRef } from "react";

import { Grid, Paper } from "@material-ui/core";
import SkeletonItem from "../../Skelton/Item";

import useStyles from "./styles";

const MovieItemSkeleton = () => {
    const classes = useStyles();
    const elementRef = useRef(null);

    return (
        <Grid item xs={12} sm={6} md={6} ref={elementRef}>
            <Paper className={classes.card}>
                <SkeletonItem className={classes.cardMedia} style={{ backgroundColor: "#8e8e8e", minWidth: "185px" }} />
                <div className={classes.cardContent}>
                    <div className={classes.cardDetails}>
                        <SkeletonItem style={{ height: "20px", width: "150px" }} />
                        <SkeletonItem style={{ height: "18px", width: "100%", marginTop: "32px" }} />
                        <SkeletonItem style={{ height: "18px", width: "50%", marginTop: "2px" }} />
                    </div>
                </div>
            </Paper>
        </Grid>
    );
};

export default MovieItemSkeleton;
```
Et voila son rendu final :

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/item_skeleton.gif)

## Et Apollo Js là-dedans ?
C’est beau tout ça, mais comment savoir où et quand afficher nos squelettes ?
Pour cela nous allons utiliser le retour des queries Apollo de notre application.
(Pour en savoir plus sur apollo et comment le mettre en place, je vous invite à aller voir [cet article]({BASE_URL}/fr/commencer-avec-apollojs/)).
Continuons dans notre exemple avec cette page comprenant une liste d'items récupérée via une Query graphQL :
```jsx
//MoviesPageList.jsx
import React from "react";
import { fromJS } from "immutable";

import { Query } from "react-apollo";

import MovieListBase from "../../components/Movie/List";
import { MOVIES } from "../../graphql/queries";

const MovieList = () => (
  <Query query={MOVIES} variables={{ page: 1 }}>
    {({ error, data: { movies = {} }, fetchMore, loading }) => {
      if (error) {
          return <p>Error :(</p>;
      }

      if (!movies.items) {
        return "";
      }

      return <MovieListBase movies={fromJS(movies.items || [])} limit={20} />;
    }}
  </Query>
);

export default MovieList;
```
Parmi les variables retournées par le composant Query, nous avons la variable **‘loading’**. C’est un booléen qui est vrai tout au long du chargement, pour au final être faux lorsque les données ont fini d’être récupérées.
Ainsi nous pouvons afficher notre squelette dans la condition suivante :
```jsx
//MoviesPageList.jsx
import React from "react";
import { fromJS } from "immutable";

import { Query } from "react-apollo";

import MovieListBase from "../../components/Movie/List";
import { MOVIES } from "../../graphql/queries";
import MovieItemSkeleton from "../../components/Movie/Item/MovieItemSkeleton";

const MovieList = () => (
  <Query query={MOVIES} variables={{ page: 1 }}>
    {({ error, data: { movies = {} }, loading }) => {
      if (error) {
          return <p>Error :(</p>;
      }

      if (loading) {
        return <MovieItemSkeleton />;
      }

      if (!movies.items) {
        return "";
      }

      return <MovieListBase movies={fromJS(movies.items)} limit={20} />;
    }}
  </Query>
);

export default MovieList;
```
Et le rendu est…

![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/list_skeleton_fail.gif)

Bon... Cet exemple est plutôt adapté à des éléments non répétables, comme par exemple une sidebare (voir l’exemple de LinkedIn).
Ne vous inquiétez pas, je ne vais pas vous laisser là, je vais vous expliquer comment finaliser votre liste.
Ici rien de compliqué, il vous suffit simplement de créer un composant **skeleton** pour votre liste comme ceci :

```jsx
//MovieListSkeleton.jsx
import React from "react";

import { Container, Grid } from "@material-ui/core";

import MovieItemSkeleton from "../Item/MovieItemSkeleton";

import useStyles from "./styles";

const MovieListSeleton = () => {
  const classes = useStyles();

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <Grid container spacing={4}>
        {[...Array(4)].map((movie, key) => (
          <MovieItemSkeleton key={key} />
        ))}
      </Grid>
    </Container>
  );
};

export default MovieListSeleton;
```

Ici, au lieu de boucler sur un tableau de données, je boucle sur un tableau de quatre cases vides (à adapter selon votre design) afin d'afficher quatre fois le squelette créé plus haut.
Le tout assemblé, regardons à quoi ça ressemble :
```jsx
//MoviesPageList.jsx
import React from "react";
import { fromJS } from "immutable";

import { Query } from "react-apollo";

import MovieListBase from "../../components/Movie/List";
import { MOVIES } from "../../graphql/queries";
import MovieListSkeleton from "../../components/Movie/List/MovieListSkeleton";

const MovieList = () => (
  <Query query={MOVIES} variables={{ page: 1 }}>
    {({ error, data: { movies = {} }, loading }) => {
      if (error) {
          return <p>Error :(</p>;
      }

      if (loading) {
        return <MovieListSkeleton />;
      }

      if (!movies.items) {
        return "";
      }

      return <MovieListBase movies={fromJS(movies.items)} limit={20} />;
    }}
  </Query>
);

export default MovieList;
```
![]({BASE_URL}/imgs/articles/2019-10-16-skeleton-screen/list_skeleton.gif)

En bonus la version de notre liste avec apollo hook :

```jsx
import React from "react";
import { fromJS } from "immutable";

import { useQuery } from '@apollo/react-hooks';

import MovieListBase from "../../components/Movie/List";
import { MOVIES } from "../../graphql/queries";
import MovieListSkeleton from "../../components/Movie/List/MovieListSkeleton";

const MovieList = () => {
    const {
        error,
        data: { movies = {} },
        loading
    } = useQuery(MOVIES, { variables: { page: 1 } });

    if (error) {
        return <p>Error :(</p>;
    }

    if (loading) {
        return <MovieListSkeleton />;
    }

    if (!movies.items) {
        return "";
    }

    return <MovieListBase movies={fromJS(movies.items)} limit={20} />;
};

export default MovieList;
```

## Conclusion
Comme vous avez pu le constater, la mise en place d’un **skeleton** screen n’est en rien compliquée, et peut rendre l’application plus réactive et dynamique pour vos utilisateurs, qui en ressortiront plus heureux.
N'hésitez pas à tester plusieurs designs de squelette, en changeant les tailles et les couleurs afin qu’ils correspondent au mieux à votre application.
Si le sujet vous intéresse, je vous invite à lire l’article de Luke Wroblewski linké plus haut, et je vous donne rendez-vous bientôt pour la fin de mon triptyque sur les conseils d’UX qui vont dynamiser vos applications.
