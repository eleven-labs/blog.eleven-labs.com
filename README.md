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
cd _authors && touch myusername.md
```

**2 - Add content to the file**

Here is the template of the file.

```md
---
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

**4 -Then add your post**

> You can't do a pull request just with your author markdown, because the deployment doesn't allow an author file without any associated posts

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
lang: en | fr
date: YYYY-MM-DD
slug: slug of the post (No space dashes instead)
title: Title of the post
excerpt: Description of the post (Visible on the list pages)
categories:
    - javascript | php | agile | architecture
keywords:
- keyword (limited to 10, must not be identical to the categories, used for SEO and search)
authors:
    - author's username
---
Content of your post in markdown
```

**3 - Write the content of the post**

The content of the articlpostbe written in markdown.
You can use one of the solutions:
- [StackEdit](https://stackedit.io)
- [Dillinger](http://dillinger.io)

To add images to your post, you will need to create the folder `_assets/posts/YYYY-MM-DD-slug/` and add your images there.
Then in the markdown content, insert the tag:
```md
![alt of image]({{ site.baseurl }}/_assets/posts/YYYY-MM-DD-slug/image-name.png)
```

To add an image with a figure and a figcaption you just need to write this syntax:

```md
![alt of image]({{ site.baseurl }}/_assets/posts/YYYY-MM-DD-slug/image-name.png)
Figure: *Source Github*
```

And to specify a size on the image, you can add the arguments (`width`, `height`, `maxWidth`, `maxHeight`) after the url:
```md
![alt of image]({{ site.baseurl }}/_assets/posts/YYYY-MM-DD-slug/image-name.png?width=500)
```

> Warning: Don't add html in your markdown, you don't have to override the blog template in the markdown.

**4 - Add your pull request**

Create your branch and add your pull request. 
```bash
git checkout -b feat/add-post-slug
```

Once your post is finished and you want it to be published and add the label `publication` to your pull request.
