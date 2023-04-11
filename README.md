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

Urls:
- Storybook: http://localhost:6006
- Website: http://localhost:5173

----------

Create your author page
-------------

**1 - Create the markdown file**

In the `_authors` folder add a markdown file with your username.
```bash
cd _authors && touch mypseudo.md
```

**2 - Add content to the file**

Here is the template of the file.

```md
---
layout: author
login: mypseudo
title: Name Lastname
github: https://github.com/mypseudogithub/
linkedin: https://www.linkedin.com/in/mylinkedin/
permalink: /authors/mypseudo/
---

Some description about me...
```

**3 - Add your avatar**

Add your avatar to the `_assets/authors/mypseudo.jpg` folder.

**4 - Add your pull request**

Create your branch and add your pull request with the label `publication`. 
```bash
git checkout -b feat/add-author-mypseudo
```

----------

Create your post page
-------------

**1 - Create the markdown file**

In the folder `_posts` add a markdown file with the name of your post and prefixed with the date.
```bash
cd _posts && touch YYYY-MM-DD-slug.md
```

**2 - Add content to the file**

Here is the template of the file.

```md
---
lang: lang
slug: slug of the post
title: title of the post
excerpt: description of the post
authors:
  - author's username
date: YYYY-MM-DD
---
Content of your post
```

**3 - Write the content of the post**

The content of the articlpostbe written in markdown.
You can use one of the solutions:
- [StackEdit](https://stackedit.io)
- [Dillinger](http://dillinger.io)

To add images to your post, you will need to create the folder `_assets/imgs/posts/YYYY-MM-DD-slug/` and add your images there.
Then in the markdown content, insert the tag:
```md
![alt of image]({{ site.baseurl }}/imgs/posts/YYYY-MM-DD-slug/image-name.png)
```

> If it's the resumption of an article it is necessary to keep the same slug

**4 - Add your pull request**

Create your branch and add your pull request. 
```bash
git checkout -b feat/add-post-slug
```

Once your post is finished and you want it to be published, set the isDraft value to false and add the label `publication` to your PR.
