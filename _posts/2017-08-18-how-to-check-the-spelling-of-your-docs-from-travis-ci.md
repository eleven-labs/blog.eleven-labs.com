---
layout: post
title: How to check the spelling of your docs from Travis CI?
excerpt: "We will show you how to check the spelling in your markdown documents, changed in your pull requests, very easily using Aspell and Travis CI"
permalink: /en/how-to-check-the-spelling-of-your-docs-from-travis-ci/
authors:
    - charles-eric
date: '2017-08-18 17:00:00 +0100'
date_gmt: '2017-08-18 16:00:00 +0100'
categories:
    - CI
tags:
    - CI
    - Travis
    - Aspell
    - Spelling
cover: /assets/2017-08-18-how-to-check-the-spelling-of-your-docs-from-travis-ci/typing.jpg
---

Our blog is built with Jekyll and Github Pages: [more details there (in French)](/fr/migration-du-blog/). So to publish any blog post, each author has to open a new pull request on Github to submit his new markdown files.
Then the other astronauts can review what was written before merging, i.e. publishing the post. Of course the goal of this review is to make sure everything is explained properly and not to find all the typos, otherwise reviewing would be boring! ;)

That's why we needed to find a way to easily find the misspelled words in the files changed in each pull request, to ease the reviewing process. Of course we knew that none of the automated spell checkers were perfect, we just wanted this tool to send notifications about the mistakes on the pull requests without blocking the developers to merge.

Here is how we did that:

How does Aspell work?
=====================

First, we need to install this tool:

```bash
apt-get install aspell aspell-en # and aspell-fr for French for example
```

The command that we will use is this one:

```bash
cat some_text.md | aspell --lang=en --encoding=utf-8 list
```

- `some_text.md` is your markdown file, where you want to check the spelling
- `--lang=en` or `--lang=fr` for example, depending on your language
- `--encoding=utf-8` if your file contains special characters

This command will return all the words that Aspell does not know, not listed in its dictionaries: so the words that might be misspelled.

> Note:
> You might want to execute this command many times, in English and French for example, especially if you write technical documents in French that will also contain many English words.

Of course you will also need to allow personal words. To do so, you can add and use custom dictionaries files, named `.aspell.en.pws` for an English personal dictionary. Here is an example of what this file could contain:

```
personal_ws-1.1 en 3
php
javascript
android
```

Note that the header (first line) of this file is important: the two last arguments correspond to the language and the number of words.

Then to use this personal dictionary, you have to add this argument in your command: `--personal=./.aspell.en.pws`

How to execute this tool from Travis CI?
========================================

To execute `aspell` from Travis CI, you need to install this apt package in the Travis container. To do so, add these lines in your `.travis.yml` file:

```yml
addons:
  apt:
    packages:
      - aspell
      - aspell-en
      - aspell-fr # that corresponds to your language
```

Then, in this same configuration file, you can execute a custom bash script:

```yml
script: your_script.sh
```

In this script, you can use the environment variable `$TRAVIS_COMMIT_RANGE`, available in the Travis container, to get only the files that were changed in the pull request that corresponds to your build:

```bash
git diff --name-only $TRAVIS_COMMIT_RANGE
```

If you want to get only markdown files, you can add `| grep .md` at the end of the previous command.

Once you have the names of the files that should be checked for this pull request, you can execute the `aspell list` command that we've seen in the first part.

Note that you can also use `grep` and `sed` commands to remove metadata or code blocks from your files before executing `aspell` command, if you don't want to check the spelling in these blocks.
For example, if you want to remove your code blocks from your markdown file, you can use this command:

```bash
cat your_file.md | sed  -n '/^```/,/^```/ !p'
```

How to send the results to Github pull request?
===============================================

We don't want this script to block the reviewers to merge the pull request, so the first thing to do is to add `exit 0` at the end of the script that will be executed from Travis CI. Otherwise if an error code is returned by the script, Travis will mark the pull request status as failing, and will block the user from merging this pull request.

The easiest thing that we can do to send the results of previous commands is to post them in a comment on the Github pull request.

First you need to choose the Github user that will be used to add this comment, and configure an access token for this user:
- Login to [https://github.com](https://github.com) with this user
- Go to [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
- Add a name/description for the token you're creating, and check the scope `public_repo` only, if your Github repository is public.

Then, from the script executed on Travis, once you've got the results of the `aspell` command, you can use `curl` to call Github API, with the token previously created:

```bash
curl -i -H "Authorization: token $GITHUB_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d "{\"body\":\"$ASPELL_RESULTS\"}" \
    https://api.github.com/repos/eleven-labs/eleven-labs.github.io/issues/$TRAVIS_PULL_REQUEST/comments
```

- The Github token should be hidden and not hard-coded in your script, so you should add it in an environment variable in the Travis settings. To do that, go on this page: [https://travis-ci.org/your-github-account/your-repository/settings](https://travis-ci.org/your-github-account/your-repository/settings)
- The environment variable `$TRAVIS_PULL_REQUEST` is automatically available in the Travis container and corresponds to the identification number of your pull request related to the current Travis build.

Conclusion
==========

If you want to see the full script that we use for our blog, it's [there](https://github.com/eleven-labs/eleven-labs.github.io/blob/master/bin/check-spelling.sh).

I hope these tips will help you! Note that you could also use the same process to check the spelling in the doc blocks of your code, or in your documentations too.

We will probably improve these scripts and automatic checks during the next few weeks, so you might want to follow [our blog repository on Github](https://github.com/eleven-labs/eleven-labs.github.io), to see all the incoming updates.

Any idea to improve this process is also welcomed: please add comments bellow ;)
