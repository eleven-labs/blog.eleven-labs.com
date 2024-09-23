Blog Eleven Labs
===================

Welcome to the [ElevenLabs] blog (https://blog.eleven-labs.com), this is [Jamstack](https://jamstack.org/) website.

----------

What's inside?
-------------

This website is 100% [TypeScript](https://www.typescriptlang.org/) with [Jamstack](https://jamstack.org/) architecture.

It was developed based on the boilerplate [React SSR with Vite and Prerender](https://github.com/eleven-labs/typescript-boilerplates).

It uses Eleven Labs [Design System](https://github.com/eleven-labs/design-system).

----------

Installation the blog
-------------

**Technical requirements to work on this project**
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/en/main)
- [Vite](https://vitejs.dev/)
- [Storybook](https://storybook.js.org/)

**Computer requirements to work on this project**

- [git](https://git-scm.com/download/linux)

For local installation:
- [Node Version Manager](https://github.com/nvm-sh/nvm)

For docker installation:
- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)

**1 - Clone the project**
```bash
git clone git@github.com:eleven-labs/blog.eleven-labs.com.git
```

**2 - Run the project locally**
```bash
nvm install
npx concurrently "yarn start:storybook" "yarn ts-node bin/dev"
```

Urls:
- Storybook: http://localhost:6006
- Website: http://localhost:5173

**3 - Run the project with docker**
```bash
docker-compose up -d
```

Url: http://localhost:5173


**4 - Start Storybook** :
```bash
docker-compose exec app yarn start:storybook
```

Url: http://localhost:6006

----------

Create your author page
-------------

**1 - Create the markdown file**

In the `_authors` folder add a markdown file with your username.
```bash
cd _authors && touch myusername.md
```

**2 - Add content to the file**

Here is the template of the file.

```md
---
contentType: author
username: myusername
name: Name Lastname
github: mygithub
linkedin: mylinkedin
twitter: mytwitter
---

Some description about me...
```

**3 - Add your avatar**

Add your avatar to the `_assets/authors/myusername.jpg` folder.

**4 -Then add your article**

> You can't do a pull request just with your author markdown, because the deployment doesn't allow an author file without any associated articles

----------

Create your article page
-------------

**1 - Create the markdown file**

In the folder `_articles` add a markdown file with the name of your article and prefixed with the date.
```bash
cd _articles && touch YYYY-MM-DD-slug.md
```

**2 - Add content to the file**

Here is the template of the file.

```md
---
contentType: article
lang: en | fr
date: YYYY-MM-DD
slug: slug of the article (No space dashes instead)
title: Title of the article
excerpt: Description of the article (Visible on the list pages)
cover:
    alt: Alt image
    path: /imgs/articles/YYYY-MM-DD-slug/cover.jpg
    position: top | right top | right | right bottom | bottom | left bottom | left | left top | center | north | northeast | east | southeast | south | southwest | west | northwest // Default value is center
categories:
    - javascript | php | agile | architecture
keywords:
- keyword (limited to 10, must not be identical to the categories, used for SEO and search)
authors:
    - author's username
seo:
    title: title
    description: description
---
Content of your article in markdown
```

> If your title or excerpt contains `:`, `"` use the syntax `>` or add your content between quotes (`"`)

> If you want to add a 2 empty lines, you can use `\` syntax: ex:
```
first paragraph.

\
second paragraph displayed after 2 empty lines.
```

**3 - Adding Cover**

To maintain graphic consistency, cover visuals should be in a photorealistic style and preferably related to the topics of your articles.

By "photorealistic style" we mean: no cartoons, no 3D visuals, no illustrations, no graphics, no logos, etc.

To choose your image, you have several options:

- Head to [La Boîte à Outils de l'Astronaute](https://drive.google.com/drive/folders/1SLZRiqHSel3AWNSVbrblfg3ON_XwR5RU?usp=drive_link) to access ready-to-use image banks
- If you can't find what you're looking for, you can access free and royalty-free image banks like [AdobeStock](https://stock.adobe.com/fr/), [Pexels](https://www.pexels.com/fr-fr/), [Unsplash](https://unsplash.com/fr)
- If you still can't find an image despite these different solutions, you can ask Thomas Péjout to generate an image for you with MidJourney

In order to have a quality image, we ask you to integrate an image with a minimum width of 3000 px

**4 - Write the content of the article**

The content of the article be written in markdown.
You can use one of the solutions:
- [StackEdit](https://stackedit.io)
- [Dillinger](http://dillinger.io)

To add images to your article, you will need to create the folder `_assets/articles/YYYY-MM-DD-slug/` and add your images there.
Then in the markdown content, insert the tag:
```md
![alt of image]({BASE_URL}/imgs/articles/YYYY-MM-DD-slug/image-name.png)
```

To add an image with a figure and a figcaption you just need to write this syntax:

```md
![alt of image]({BASE_URL}/imgs/articles/YYYY-MM-DD-slug/image-name.png)
Figure: *Source Github*
```

And to specify a size on the image, you can add the arguments (`width`, `height`, `maxWidth`, `maxHeight`) after the url:
```md
![alt of image]({BASE_URL}/imgs/articles/YYYY-MM-DD-slug/image-name.png?width=500)
```

If you need to add internal anchor links from your article to other article of our blog, use this syntax:
```md
[title of destination article]({BASE_URL}/fr/destination-article-slug)
```

> Warning: Don't add html in your markdown, you don't have to override the blog template in the markdown.

This blog supports admonitions pannels `warning` ; `info` ; `tip` and `note` to generate colored panels.
When using `<div>` attribute `markdown="1"` text block is rendered as Markdown. The first line must be left empty, else the block will be rendered as html

```md
<div class="admonition warning" markdown="1"><p class="admonition-title">Your Panel Title</p>

Your panel text.
</div>
```

You can also create collapsible panels like this : 

```html
<details>
<summary>Title</summary>
Details
</details>
</br>
```
Note : use `<details open>` if you want to panel to be expanded by default

**5 - Add your pull request**

Create your branch and add your pull request.
```bash
git checkout -b feat/add-article-slug
```

Once your article is finished and you want it to be published and add the label `publication` to your pull request.

----------

Create your tutorial page
-------------

**1 - Create the markdown file**

In the folder `_tutorials` pick the subfolder `fr` or `en` depending on the translation, then create folder with the name of your tutorial and prefixed with the date (`YYYY-MM-DD-slug`).
```bash
cd _tutorials && mkdir YYYY-MM-DD-slug
```

**2 - Add content to the file**

Inside the folder named `YYYY-MM-DD-slug` you created, add a file named `index.md` Here is the template of the file.

```md
---
contentType: tutorial
lang: en | fr
date: YYYY-MM-DD
slug: Slug of the tutorial (No space dashes instead)
title: Title of the tutorial
excerpt: Description of the tutorial (Visible on the list pages)
categories:
    - javascript | php | agile | architecture
keywords:
- keyword (limited to 10, must not be identical to the categories, used for SEO and search)
authors:
    - author's username
steps:
  - slug of your steps (No space dashes instead)
seo:
    title: title
    description: description
---
```

> If your title or excerpt contains `:`, `"` use the syntax `>` or add your content between quotes (`"`)
> The steps should be in the order you want them displayed

Then add a steps folder and add your steps there. Here is the template of the file.

Always inside the folder named `YYYY-MM-DD-slug`, create another folder called `steps`. Then create one file for each step.

Example:

```
YYYY-MM-DD-slug
 ├── index.md
 └── steps/
        ├──introduction.md
        ├──installation-du-serveur-graphql.md
        └── ...
```

Here is the template of the file:

```md
---
contentType: tutorial-step
tutorial: slug of the tutorial (previously added in your index.md file)
slug: Slug of the step (No space dashes instead and previously added in your index.md file)
title: Title of the step
---
Content of your step in markdown
```

> The files need to keep the same name as the steps declared in `index.md`, using snake case.

**3 - Add your pull request**

Create your branch and add your pull request.
```bash
git checkout -b feat/add-tutorial-slug
```

Once your tutorial is finished and you want it to be published and add the label `publication` to your pull request.
