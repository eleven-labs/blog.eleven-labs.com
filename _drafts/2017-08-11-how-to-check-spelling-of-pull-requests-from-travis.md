---
layout: post
title: 'How to check spelling of your pull requests from Travis?'
excerpt: "We will show you how to check the spelling in your markdown documents, very easily using Aspell and Travis"
permalink: /en/how-to-check-spelling-of-pull-requests-from-travis/
authors:
    - charles-eric
date: '2017-08-11 17:00:00 +0100'
date_gmt: '2017-08-11 16:00:00 +0100'
categories:
    - CI
tags:
    - CI
    - Travis
    - Aspell
    - Spelling
cover: /assets/2017-08-11-how-to-check-spelling-of-pull-requests-from-travis/typing.jpg
---

Our blog is built with Jekyll and Github Pages: [more details there](/fr/migration-du-blog/). So to publish any blog post, each author has to open a new pull request on Github to submit his new markdown files.
Then the other astronauts can review what was written before merging, i.e. publishing the post. Of course the goal of this review is to make sure everything is explained properly and not to find all the typos, otherwise reviewing would be boring! ;)

That's why we needed to find a way to easily find the misspelled words in the files changed in each pull request. Of course we knew that none of the automated spell checkers were perfect, we just wanted this tool to notice the mistakes on the pull requests without blocking the developers to merge.

Here is how we did that:

How does Aspell work
====================

First, we need to install this tool:

```bash
apt-get install aspell aspell-en # and aspell-fr for French for example
```

The command that we will use is this one:

```bash
cat some_text.md | aspell --lang=en --encoding=utf-8 list
```

- `some_text.md` is your markdown file, where you want to check spelling
- `--lang=en` or `--lang=fr` for example depending on your language
- `--encoding=utf-8` if your file contains special characters

This command will return all the words that Aspell does not know, not listed in its dictionnaries: so this words might be misspelled.

Note that you might want to execute this command many times, in English and French, especially if you write technical documents in French that will also contain many English words, for example.

Of course you will also need to allow personal words. To do so, you can add and use custom dictionnaries files, named `.aspell.en.pws` for an English personal dictionnary for example:

```
personal_ws-1.1 en 3
php
javascript
android
```

Note that the first line header is important: the two last arguments correspond to the language and the number of words.

Then to use this personal dictionnary, you have to add this argument in your command: `--personal=./.aspell.en.pws`

Conclusion
==========

We will probably improve these scripts and checking during the next few weeks, you can follow our blog repository on github, if you want to follow.

Anyway I hope these tips will help others. Note that you could also use the same process to check spelling in your code doc blocks, or in your documentations.


