---
contentType: article
lang: fr
date: '2022-01-31'
slug: comment-construire-site-web-avec-nextjs
title: Comment construire son site web avec NextJS ?
excerpt: >-
  Dans cet article, vous apprendrez les basiques de NextJS requis pour
  construire un site web !
categories:
  - javascript
authors:
  - aamara
keywords: []
---

Ce post aborde les bases de NextJS. 
Nous allons construire un site web simple à l'aide de ce framework.

## Qu'est-ce que NextJS ?

NextJS est un framework permettant de construire tout type d'application React. Il est spécialisé dans le rendu des composants côté serveur (SSR), mais il supporte aussi la génération statique (SSG). De ce fait l'application peut être facilement hébergée sur différents types de services, sur un SI, depuis un serveur web HTTP (pour le rendu SSG) jusqu'à un serveur NodeJS pour le rendu des composants côtés serveur.

On peut alors se poser la question : pourquoi devrais-je utiliser NextJS pour construire mon site web ?

## Pourquoi construire son site web avec NextJS

Voyons quels sont les avantages d'utiliser NextJS pour un site web :

* React : un des frameworks orientés composant les plus populaires. Il permet de construire facilement des interfaces efficaces pour le web. Si vous êtes un développeur React vous serez en terrain connu.
* On peut générer les fichiers statiques et déployer le site web facilement sur un serveur HTTP basique ou encore sur un bucket type S3 chez n'importe quel cloud provider.
* Le framework est facile à installer et il est pré-configuré. On peut donc rapidement commencer les développements sans prise de tête.

Dans la prochaine section, nous allons apprendre à utiliser NextJS en construisant un petit site web.

## Projet exemple : AstroTeams

Nous allons construire un site web qui présente les équipes d'astronautes d'Eleven Labs.
Première chose à faire : installer le projet.

### Installation du projet NextJS

Pour suivre ce tutoriel il est fortement recommandé de cloner le dépôt Git d'exemple. Nous allons apprendre à construire les différentes pages du site web et nous n'allons pas apprendre comment construire le contenu, les composants.

Le Git contient l'ensemble des composants React nécessaires pour l'affichage du contenu des pages web. L'ensemble de ces composants est dans le dossier `components`.

Clonons le dépôt git et plaçons-nous sur la branche "get-started" :

```shell
git clone https://gitlab.com/Tonypunisher/astroteams.git
git checkout get-started
```

> **Note**: Si vous avez besoin de créer un projet vide, le paquet create-next-app est là pour ça.
> ```shell
> npx create-next-app astroteams
> ```

### Création de la page d'accueil

Pour commencer, on supprime le contenu du fichier `pages/index js`, pour avoir une page blanche et non la page d'accueil de Next Js.
Maintenant, nous avons besoin de construire le layout de notre site. Pour ça on va créer un composant React qui sera réutilisé par le composant App de NextJS pour chaque page générée.

> **Note** : l'ensemble des pages est dans le dossier `pages`.

### Construction du layout

Tout d'abord, on crée le dossier `components` s'il n'existe pas :

```shell
mkdir components
```

Ensuite, on crée les fichiers pour le composant Layout :

```shell
mkdir components/Layout
touch components/Layout/Layout.js
touch components/index.js
touch components/Layout.module.css
```

Il nous reste à ajouter le contenu du composant et les règles CSS associées :

`components/Layout.js`
```js
// Libs
import PropTypes from "prop-types"
import Head from "next/head";
import { useRouter } from "next/router";

// Components
import { FlexContainer, ORIENTATION } from "../FlexContainer";
import { ElevenLabsLogo } from "../ElevenLabsLogo/ElevenLabsLogo";
import { SpaceCraftButton } from "../SpaceCraftButton";

// CSS Module
import styles from "./Layout.module.css";
import Image from "next/image";

export function Layout({ children: pageContent }) {
  const router = useRouter()
  const isHomePage = router.pathname === "/"

  const handleContactClick = (e) => {
    e.preventDefault()
    router.push("/contact")
  }

    return <div className={styles["main-container"]}>
    <Head>
      <title>AstroTeams</title>
      <meta name="description" content="Eleven Labs Astro Teams" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <FlexContainer orientation={ORIENTATION.VERTICAL}>
        <ElevenLabsLogo />
        { pageContent }
      </FlexContainer>
      { isHomePage && <SpaceCraftButton onClick={handleContactClick}>Contact</SpaceCraftButton> }
    </main>

    <footer className={styles.footer}>
      <Image
        alt="Eleven Labs Logo"
        src="/logo-eleven-labs-large.png"
        objectFit="contain"
        width="150px"
        height="50px"
        priority
      />
      <div className={styles["footer__label"]}>NextJS Demo App</div>
    </footer>
  </div>
}

Layout.propTypes = {
  /**
   * Page content
  */
  children: PropTypes.node.isRequired,
}
```

> **Note** : n'oubliez pas d'ajouter les règles de styles dans le module CSS. De plus, il faut exporter le composant Layout dans le fichier index.js.

Enfin, on ajoute le Layout dans le fichier `pages/_app.js` :

```js
// Components
import { Layout } from "../components/Layout"

// Global CSS
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return <Layout><Component {...pageProps} /></Layout>
}

export default MyApp
```

Chaque page générée utilise notre Layout. On peut le constater sur la page d'accueil :

![astro teams layout]({{ site.baseurl }}/assets/2022-01-26-build-website-with-nextjs/website-layout.png)

Il nous reste à ajouter le contenu de la page d'accueil.

### Création du contenu de l'accueil

On ajoute le HTML de la page avec du JSX :

```js
// Libs
import Head from "next/head";
import { useRouter } from "next/router";

// Components
import { FlexContainer } from "../components/FlexContainer";
import { Card } from "../components/Card/Card";
import { Button } from "../components/Button"

// CSS Module
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter()
  const handleTeamPageClick = (e, team) => {
    e.preventDefault()
    router.push(`/${team}`)
  }

  return (
    <>
      <h2>Eleven Labs Astronauts Teams</h2>
      <FlexContainer>
        <Card backgroundColorClass="blue-background" imagePath="/cats-logo.png" imageAlt="Eleven Labs Cats Team" title="Schizo Cats">
          <div className={styles["team-description"]}>
            <div className={styles["team-description__txt"]}>Crazy cats from the kitty planet.</div>
            <Button className="blue-background" onClick={(e) => handleTeamPageClick(e, "schizo-cats")}>READ MORE</Button>
          </div>
        </Card>
        <Card backgroundColorClass="green-background" imagePath="/ducks-logo.png" imageAlt="Eleven Labs Duck Team" title="Duck Invaders">
          <div className={styles["team-description"]}>
            <div className={styles["team-description__txt"]}>Ducks space invaders from Duck planet.</div>
            <Button className="green-background" onClick={(e) => handleTeamPageClick(e, "ducks-invaders")}>READ MORE</Button>
          </div>
        </Card>
        <Card backgroundColorClass="red-background" imagePath="/pandas-logo.png" imageAlt="Eleven Labs Pandas Team" title="Donut Factory">
          <div className={styles["team-description"]}>
            <div className={styles["team-description__txt"]}>Pandas who made some donuts from the Donuts planet.</div>
            <Button className="red-background" onClick={(e) => handleTeamPageClick(e, "donuts-factory")}>READ MORE</Button>
          </div>
        </Card>
        <Card backgroundColorClass="yellow-background" imagePath="/racoon-logo.png" imageAlt="Eleven Labs Racoon Team" title="Raccoons of Asgard">
          <div className={styles["team-description"]}>
            <div className={styles["team-description__txt"]}>Racoons guardian of the galaxy from the great Asgard planet.</div>
            <Button className="yellow-background" onClick={(e) => handleTeamPageClick(e, "asgard-racoons")}>READ MORE</Button>
          </div>
        </Card>
      </FlexContainer>
    </>
  )
}
```

> **Note** : Ne pas oublier d'ajouter les règles CSS. Le fichier correspondant est `styles/home.module Css`. L'ensemble des modules CSS pour les pages est stocké dans ce dossier.

![Website Home Page]({{ site.baseurl }}/assets/2022-01-26-build-website-with-nextjs/homepage.png)

Les composants `pages/index js` et `components/Layout js` contiennent des redirections vers d'autres pages, qui n'existent pas pour l'instant. Nous allons apprendre comment créer ces pages avec NextJS.

### Créer une page simple

Nous avons besoin de créer une page statique pour y mettre les informations de contacts. Par page statique, je veux dire que cette page ne prend pas de paramètre via l'URL. Pour créer une page `/contact`, il faut ajouter un fichier `contact js` avec un composant React qui renvoie au moins un élément vide. Le routeur de NextJS va se charger de créer la page :

```shell
touch pages/contact.js
```

`pages/contact.js`:
```js
// Components
import { PageCard } from "../components/PageCard"
import { FlexContainer, ORIENTATION } from "../components/FlexContainer"

export default function Contact() {
    return <>
    </>
}
```

Nous avons maintenant une page vide, ajoutons son contenu :

```js
// Components
import { PageCard } from "../components/PageCard"
import { FlexContainer, ORIENTATION } from "../components/FlexContainer"

export default function Contact() {
    return <>
        <h2>Contact Eleven Labs</h2>
        <PageCard>
            <FlexContainer orientation={ORIENTATION.VERTICAL}>
                <h3>Eleven Labs</h3>
                <div>PARIS</div>
                <div>15, avenue de la Grande Armée</div>
                <div>75116 PARIS</div>
                <div><a href="mailto:contact@eleven-labs.com">contact@eleven-labs.com</a></div>
            </FlexContainer>
        </PageCard>
    </>
}
```

![Contact Page]({{ site.baseurl }}/assets/2022-01-26-build-website-with-nextjs/contactpage.png)

Maintenant que nous avons une page de contact, il nous faut une page par équipe. Pour ça, on va créer une seule page avec le nom de l'équipe en paramètre.

### Créer une page/route avec paramètre

Le routeur de NextJS permet de créer facilement une page avec des paramètres d'URL. Pour cela, on va créer un fichier avec un nom spécifique. Dans notre cas, on veut une page `/<teamname>`, on crée alors un fichier `pages/[team].js`.

Nous avons maintenant créé notre page. Il nous faut parser le paramètre de l'URL et le passer en propos au composant. Nous devons pour ça créer 2 fonctions :

* **getStaticPath** : une fonction qui retourne l'ensemble des URLs possibles pour notre page. Dans notre cas nous renverrons un tableau avec 4 URLs, une pour chaque équipe.
* **getStaticProps** : une fonction qui retourne les propos à partir du paramètre d'URL courant.

Mais avant d'ajouter ces 2 fonctions, ajoutons le contenu textuel pour l'affichage dans un fichier JSON :

`pages/api/teams.json`:
```json
[
    { "name": "schizo-cats", "teamName": "Schizo Cats", "teamDescription": "Crazy cats from the kitty planet.", "teamImagePath": "/cats-logo.png", "teamPlanetPath": "/planet-skizo.png", "teamCounter": 25, "teamPosition": "3rd" },
    { "name": "ducks-invaders", "teamName": "Duck Invaders", "teamDescription": "Ducks space invaders from Duck planet.", "teamImagePath": "/ducks-logo.png", "teamPlanetPath": "/planet-ducks.png", "teamCounter": 20, "teamPosition": "2nd" },
    { "name": "donuts-factory", "teamName": "Donut Factory", "teamDescription": "Pandas who made some donuts from the Donuts planet.", "teamImagePath": "/pandas-logo.png", "teamPlanetPath": "/planet-pandas.png", "teamCounter": 25, "teamPosition": "4th" },
    { "name": "asgard-racoons", "teamName": "Raccoons of Asgard", "teamDescription": "Racoons guardian of the galaxy from the great Asgard planet.", "teamImagePath": "/racoon-logo.png", "teamPlanetPath": "/planet-racoon.png", "teamCounter": 20, "teamPosition": "1st" }
]
```

Implémentons la fonction getstaticpath basée sur les éléments du fichier JSON :

`pages/[team].js`:
```js
export async function getStaticPaths() {
    const paths = teamsData.map(team => {
        return {
            params: { team: team.name }
        }
    })

    return { paths, fallback: false }
}
```

Cette fonction construit un tableau d'URLs qui contient un élément path basé sur le nom de chaque équipe. L'option fallback ajoute une contrainte. Il faut relancer la phase de build pour générer de nouvelles pages.

On peut maintenant construire les props pour notre page :

`pages/[team].js`
```js
export function getStaticProps({ params }) {
    const { teamName, teamDescription, teamImagePath, teamPlanetPath, teamCounter, teamPosition } = teamsData.find(team => team.name === params.team)

    return { props: { teamName, teamDescription, teamImagePath, teamPlanetPath, teamCounter, teamPosition } }
}
```

On a recherché les éléments utiles grâce au tableau construit précédemment. Il nous reste à créer le contenu de la page :

`pages/[team].js`:
```js
export default function Team({ teamName, teamDescription, teamImagePath, teamPlanetPath, teamCounter, teamPosition }) {
    return <TeamCard
        teamName={teamName}
        teamDescription={teamDescription}
        teamImagePath={teamImagePath}
        teamPlanetPath={teamPlanetPath}
        teamCounter={teamCounter}
        teamPosition={teamPosition}
    />
}
```
Ici on passe nos propos à un composant qui rend les éléments de la page. Dorénavant, si on clique sur le bouton "read more", on verra la page de détails d'une équipe.

![Team Page]({{ site.baseurl }}/assets/2022-01-26-build-website-with-nextjs/teampage.png)

Nous avons maintenant un site web prêt à être mis en production.

## Feedback

Pour conclure, quelques points sur la construction d'un site web avec NextJS :

* Environnement pré-configuré : tout est facile à initialiser et des outils permettent de suivre des bonnes pratiques comme ESLint. Bien que la configuration d'ESLint soit basique, c'est un bon départ.
* React : si on a déjà développé avec React il est très facile de construire son site web. De plus on peut réutiliser des composants provenant de l'open source.
* Le déploiement : il y a plusieurs possibilités différentes pour mettre le site web en production.
* Optimisation : NextJS optimise certains éléments comme les images, ou encore le chargement de la page pour améliorer le référencement naturel, ce qui est avantageux.

Voilà, j'espère que cet article vous aura plu ! 
