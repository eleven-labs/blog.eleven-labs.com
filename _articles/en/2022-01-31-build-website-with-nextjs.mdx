---
contentType: article
lang: en
date: '2022-01-31'
slug: how-to-build-your-website-with-nextjs
title: How To Build Your Website With NextJS
excerpt: Tutorial on the basics of NextJS for building a website.
cover:
  path: /imgs/articles/2022-01-31-how-to-build-your-website-with-nextjs/cover.jpg
categories:
  - javascript
authors:
  - aamara
keywords: []
---

This post is about the NextJS basics and a guide to build a simple website with this framework.

## What is NextJS

NextJS is a production-grade React framework. It permits the creation of all kinds of React applications, especially hybrid ones with static (SSG) and server-side components rendering (SSR). It is hostable on multiple hosting types, from a simple web server (for SSG) to a Node.js server for server-side rendering (SSR).

A question come: Why should I use NextJS to create my website?

## Why you should build your website with NextJS

Let’s see a few pros of constructing a website with the NextJS framework:

* React: it is a powerful component-oriented framework to construct a great UI or website. Moreover, if you are a React developer, you will not be lost and be productive on the website development.
* You can generate static assets and easily host them on a simple HTTP server or in a static host like AWS S3.
* It is easy to install. All the included developing tools are already configured. You can quickly start your development.

Now, we will learn how to build a website with NextJS. We’ll see the basics of the framework.

## Project example: AstroTeams

Let’s build a website about the astronauts' teams of Eleven Labs.

First, install NextJS and start the project.

### NextJS Installation

To follow this tutorial, you need to clone the git example repository. We will construct the website page and learn how NextJS works. We will not construct the website pages content.

The repo contains all the components needed to construct the pages content. All reusable components are in `components` folder.

Clone the repo and checkout to the get-started branch:

```shell
git clone https://gitlab.com/Tonypunisher/astroteams.git
git checkout get-started
```


> **Note**: To create a project from scratch, use the create-next-app package.
> ```shell
> npx create-next-app astroteams
> ```

### Create the index page

First of all, delete the `pages/index.js` content, to start from a blank page and not with the NextJS welcome page.
Now, we need to build our website layout, let's create a reusable React component and integrate it in the global NextJS App component to see it in each generated pages.

> **Note**: all website pages are in the `pages` folder.

### Construct a layout

First, create a components folder in the root folder:

```shell
mkdir components
```

Create the Layout component folder tree:

```shell
mkdir components/Layout
touch components/Layout/Layout.js
touch components/index.js
touch components/Layout.module.css
```

Let's add the Layout HTML code and add some styling to it:

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

> **Note**: don't forget to add the styling in the CSS module. Also, export your component in the index.js.

Now, add the component to the `pages/_app.js`:

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

Now, each page generated from the pages folder uses the Layout, as we can see in our index page:

![astro teams layout]({BASE_URL}/imgs/articles/2022-01-26-build-website-with-nextjs/website-layout.png)

Let's add the HTML content for the index page.

### Create the index page content

Just add HTML content with a JSX template to have the page content:

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

> **Note**: don't forget to add the CSS rules. They are in the `styles/Home.module.css. All CSS modules for pages are in this folder.

![Website Home Page]({BASE_URL}/imgs/articles/2022-01-26-build-website-with-nextjs/homepage.png)

The `pages/index.js` and `components/Layout.js` components contain redirections to other website pages, but they don't exist yet. Let's learn how to create these pages with NextJS.

### Create a simple static page

First, we need a static page for contact. Static means the page/container doesn't receive any parameter. To create a `/contact` page, add a contact.js file with a React component returning an empty div. NextJS router will automatically create the page:

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

Now we have an empty page for `/contact`. Just add the content and it is done:

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

![Contact Page]({BASE_URL}/imgs/articles/2022-01-26-build-website-with-nextjs/contactpage.png)

Now we have a contact page. The website needs one page for each astronaut's team. To do that, we will create a route with the team name as a parameter.

### Create a page/route with a parameter

The NextJS router permits the creation of routes with parameters, like react-router. To do that, we have to create a file with a specific name pattern. To create a `/<teamname>` route, we need to create a `pages/[team].js` file.

Now we have our page with the team name as a parameter. To parse this parameter and pass it as a prop of the page/container, we need to create two functions:

* **getStaticPath**: a function returning all possible static paths for our pages. In our case, it will return an array of four paths, one for each team name.
* **getStaticProps**: a function returning the props based on the retrieved parameters.

Before adding these functions, let’s add the dynamic content for each page into a JSON file for our example:

`pages/api/teams.json`:
```json
[
    { "name": "schizo-cats", "teamName": "Schizo Cats", "teamDescription": "Crazy cats from the kitty planet.", "teamImagePath": "/cats-logo.png", "teamPlanetPath": "/planet-skizo.png", "teamCounter": 25, "teamPosition": "3rd" },
    { "name": "ducks-invaders", "teamName": "Duck Invaders", "teamDescription": "Ducks space invaders from Duck planet.", "teamImagePath": "/ducks-logo.png", "teamPlanetPath": "/planet-ducks.png", "teamCounter": 20, "teamPosition": "2nd" },
    { "name": "donuts-factory", "teamName": "Donut Factory", "teamDescription": "Pandas who made some donuts from the Donuts planet.", "teamImagePath": "/pandas-logo.png", "teamPlanetPath": "/planet-pandas.png", "teamCounter": 25, "teamPosition": "4th" },
    { "name": "asgard-racoons", "teamName": "Raccoons of Asgard", "teamDescription": "Racoons guardian of the galaxy from the great Asgard planet.", "teamImagePath": "/racoon-logo.png", "teamPlanetPath": "/planet-racoon.png", "teamCounter": 20, "teamPosition": "1st" }
]
```

Let’s implement the getStaticPath based on the JSON data:

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

This function parses an array of pathnames based on the teams' names and returns them in an object. We add fallback: false to construct our pages only on the next build phase. If you add a new page, you have to rebuild the website.

Now we can parse the props for the team page:

`pages/[team].js`
```js
export function getStaticProps({ params }) {
    const { teamName, teamDescription, teamImagePath, teamPlanetPath, teamCounter, teamPosition } = teamsData.find(team => team.name === params.team)

    return { props: { teamName, teamDescription, teamImagePath, teamPlanetPath, teamCounter, teamPosition } }
}
```

We find the content from the JSON file and construct the page props. Now let's create the page content:

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


We pass our props to a component to render the page content. Now if you click on the read more button, you can see a team page:

![Team Page]({BASE_URL}/imgs/articles/2022-01-26-build-website-with-nextjs/teampage.png)

Our website is finally ready to be published. To conclude this article, let's sum up some feedback about building this website.

## Feedback

Here's what we've learned building this small website:

* Easy to init: the project is super easy to init with create-next-app and is ready to be built and deployed without any additional configurations.
* Comes with tooling: the project comes with some tooling like pre-configured ESLint configurations or some pre-configured npm scripts. The ESLint configuration can be better but, it is a good starting point.
* React: It is easy to build with the power of React components if you know it for sure. Moreover, you can build a lot of reusable things across your website. Finally, if you need it, you can also take some React components from npm and use them on your website.
* Build and deploy: it is easy to build and deploy because with SSG you can deploy your website on any simple HTTP server.
* Optimization: NextJS automatically make some optimizations on your website loading and your assets to improve performance and also SEO.
