---
contentType: article
lang: en
date: '2021-01-05'
slug: introduction-gitlab-ci
title: Introduction to Gitlab CI/CD
excerpt: >-
  This article presents some of the possibilities that GitLab CI/CD offers. You
  will find on the Codelabs platform two tutorials linked to this article, which
  will show you two use cases.
cover: /imgs/articles/2018-09-19-introduction-gitlab-ci/cover.png
categories:
  - architecture
authors:
  - nicolas
  - marishka
keywords:
  - continuous integration
  - devops
  - gitlab
  - gitlab-ci
  - git
  - ci
  - continuous deployment
  - cd
---
Today if you want to set up a CI/CD on GitHub you need to “link” your repositories with Travis-ci, Circle-ci, Codeship... But did you know that GitLab integrates a CI/CD solution? This is the subject of today's article.

In this article I will just show you the possibilities that GitLab CI/CD offers to you. But if you want to dig further in the subject, I've also created a tutorial on [Eleven Labs codelabs](https://codelabs.eleven-labs.com) on how to [set up a CI on a javascript project](https://codelabs.eleven-labs.com/course/fr/gitlab-ci-js/)

# CI/CD what is that?

I'm not going to write yet another definition for you, beecause there exist plenty already. So here is what Wikipedia tells us for CI and CD:

## CI: Continuous Integration
> “Continuous integration is a set of practices used in software engineering consisting in verifying with each modification of source code that the result of the modifications does not produce a regression in the developed application. [...] The main goal of this practice is to detect integration problems as early as possible during development. In addition, it allows you to automate the execution of test suites and see the evolution of software development.”

## CD: Continuous Delivery
> "Continuous delivery is a software engineering approach in which teams produce software in short cycles, allowing it to be made available anytime. The goal is to build, test, and distribute software faster.
The approach helps reduce the cost, time and risk associated with delivering change by taking a more incremental approach to changes in production. A simple, repeatable deployment process is key."

# GitLab in a nutshell
So Gitlab is :
- **Gitlab inc**: the company that manages the development of GitLab products
- **Gitlab**: it is a version that you can install on your machine, server, or in the cloud easily with the [AWS Marketplace](https://aws.amazon.com/marketplace/pp/B071RFCJZK)
- **GitLab.com**: it's a web version like GitHub or BitBucket

GitLab and GitLab.com are web-based git repository managers with features like:
 - wiki,
 - issues tracking,
 - docker registry,
- code tracking,
- code review
- CI/CD,
 - ...

GitLab offers more features than GitHub in its free version. It is also possible to have private repositories without having a subscription.

# Before we begin
GitLab CI/CD will allow you to automate the `builds`, the `tests`, the `deployments`, etc of your applications. All of your tasks can be broken down into stages and all of your tasks and stages make up a pipeline.

Each task is executed thanks to `runners`, which work thanks to an open source project named [GitLab Runner](https://gitlab.com/gitlab-org/gitlab-runner/) written in [GO](https://golang.org).

You can have your own `runners` directly on your machine or server. For more information I let you read the official documentation:
 - [GitLab Runner project page](https://docs.gitlab.com/runner/)
 - [Configuration of GitLab Runner](https://docs.gitlab.com/runner/configuration/)
 - [Advanced configuration for GitLab Runner](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

GitLab also offers public runners, which save you an installation, but beware, there are quotas depending on the type of account you have. On a free account, you are entitled to 2,000 minutes of pipeline time per month. The gitlab.com public runners run on AWS.

# Presentation of GitLab CI/CD
As I told you I will not show you how to set up a CI/CD from A to Z in this article but I will introduce you to the possibilities of the GitLab CI/CD solution.

## Manifesto
For the CI/CD on GitLab to work you need a `.gitlab-ci.yml` manifest at the root of your project. In this manifesto you will be able to define `stages`, `jobs`, `variables`, `anchors`, etc.

You can give it another name, but you will have to change the manifest name in the web interface settings:  `Settings > CI/CD > General pipelines > Custom CI config path`

## Jobs
In the GitLab CI/CD manifesto you can define an unlimited number of `jobs`, with constraints indicating when they should be executed or not.

Here is the easiest way to declare a `job`:
```yaml
job:
  script: echo 'my first job'
```

If you want to declare several `jobs` :
```yaml
job:1:
  script: echo 'my first job'

job:2:
  script: echo 'my second job'
```

Names of `jobs` must be unique and should not be part of reserved words:
- `image`
- `services`
- `stages`
- `types`
- `before_script`
- `after_script`
- `variables`
- `cache`

In the definition of a `job` only `script` is mandatory.

## Script
The `script` declaration is the only mandatory part of a `job`. This declaration is the heart of the `job` because it is here that you will indicate the actions to be performed.

It can call one or more script(s) in your project, or even execute one or more command line(s).

```yaml
job:script:
  script: ./bin/script/my-script.sh ## Appel d'un script de votre projet

job:scripts:
  script: ## Calls two scripts from your project
    - ./bin/script/my-script-1.sh
    - ./bin/script/my-script-2.sh

job:command:
  script: printenv # Execution of a command

job:commands:
  script: # Execution of two commands
    - printenv
    - echo $USER
```

## before_script and after_script
These declarations will allow you to perform actions before and after your main script. This can be interesting to divide the actions to be done during the `jobs`, or to call or execute an action before and after each `job`.

```yaml
before_script: # Execution of a command before each `job`
  - echo 'start jobs'

after_script: # Execution of a command after each `job`
  - echo 'end jobs'

job:no_overwrite: # Here the job will execute the actions of the `before_script` and `after_script` by default
  script:
    - echo 'script'

job:overwrite:before_script:
  before_script:
    - echo 'overwrite' # Will not perform the action defined in the `before_script` by default
  script:
    - echo 'script'

job:overwrite:after_script:
  script:
    - echo 'script'
  after_script:
    - echo 'overwrite' # Will not perform the action defined in the `after_script` by default

job:overwrite:all:
  before_script:
    - echo 'overwrite' # Will not perform the action defined in the `before_script` by default
  script:
    - echo 'script'
  after_script:
    - echo 'overwrite' # Will not perform the action defined in the `after_script` by default
```

## Image
This declaration is simply the docker image that will be used during a job or during all jobs.

```yaml
image: alpine # Image used by all `jobs`, this will be the default image

job:node: # Job using image node
  image: node
  script: yarn install

job:alpine: # Job using default image
  script: echo $USER
```

## Stages
This declaration makes it possible to group `jobs` into stages. For example, we can do a `build`, `codestyling`, `test`, `code coverage`, `deployment` step,….

```yaml
stages: # Here we declare all our steps
  - build
  - test
  - deploy

job:build:
  stage: build # We declare that this `job` is part of the build step
  script: make build

job:test:unit:
  stage: test # We declare that this `job` is part of the test step
  script: make test-unit

job:test:functional:
  stage: test # We declare that this `job` is part of the test step
  script: make test-functional

job:deploy:
  stage: deploy # We declare that this `job` is part of the deploy step
  script: make deploy
```
![CI Stages]({BASE_URL}/imgs/articles/2018-09-19-introduction-gitlab-ci/ci-stages.png)

## Only and except
These two directives allow you to put in place constraints on the execution of a task. You can say that a task will run only on the event of a push on master or run on every push in a branch except master.

Here are the possibilities:
 - **branches** triggers the `job` when a push is made on the specified branches.
 - **tags** triggers the `job` when a tag is created.
 - **api** triggers the `job` when a second pipeline requests it through pipeline API.
 - **external** triggers the `job` through a CI/CD service other than GitLab.
 - **pipelines** triggers the `job` thanks to another pipeline, useful for multiprojects thanks to the API and the `CI_JOB_TOKEN` token.
 - **pushes** triggers the `job` when `push` is done by a user.
 - **schedules** triggers the `job` in accordance to a schedule to be configured in the web interface.
 - **triggers** triggers the `job` in accordance to a trigger token.
 - **web** triggers the `job` in accordance to `Run pipeline` button in the web interface.

 I'll show you three examples of use:

### only and except simple
In its simplest use, only and except are declared like this:
```yaml
job:only:master:
  script: make deploy
  only:
    - master # The job will only be performed during an event on the master branch

job:except:master:
  script: make test
  except:master:
    - master # The job will be performed on all branches during an event except on the master branch
```
### Complex only and except

In its most complex use, only and except are used like this:
```yaml
job:only:master:
  script: make deploy
  only:
    refs:
      - master # Will only be done on master
    kubernetes: active # Kubernetes will be available
    variables:
      - $RELEASE == "staging" # Check that $RELEASE is "staging"
      - $STAGING # Check that $STAGING is defined
```
### only with schedules
For the use of `schedules` you must first define rules in the web interface.
You can configure them in the Gitlab web interface: `CI/CD -> Schedules` and fill out the form.

![CI Schedules]({BASE_URL}/imgs/articles/2018-09-19-introduction-gitlab-ci/ci-schedules.png)

If you want, you can set a custom time interval. This is what I did in my example. The definition is made as a [cron](https://en.wikipedia.org/wiki/Cron).

## when
As with the `only` and `except` directives, the `when` directive is a constraint on the execution of the task. There are four possible modes:
- `on_success`: the job will be executed only if all the` jobs` of the previous stage have passed
- `on_failure`: the job will be executed only if a job fails
- `always`: the job will be executed no matter what (even in case of failure)
- `manual`: the job will be executed only by a manual action

```yaml
stages:
  - build
  - test
  - report
  - clean

job:build:
  stage: build
  script:
    - make build

job:test:
  stage: test
  script:
    - make test
  when: on_success # will only run if the `job:build` job passes

job:report:
  stage: report
  script:
    - make report
  when: on_failure # will run if the job `job:build` or` job:test` does not pass

job:clean:
  stage: clean
  script:
    - make clean # will run in all cases
  when: always
```

## allow_failure
This directive is used to accept that a job fails without causing the pipeline to fail.

```yaml
stages:
  - build
  - test
  - report
  - clean

...

stage: clean
  script:
    - make clean
    when: always
    allow_failure: true # Will not fail the pipeline
...
```

## tags
As I told you at the beginning of the article, with GitLab Runner you can host your own runners on a server which can be useful for specific configuration.

Each runner that you define on your server has a name, if you put the name of the runner in `tags`, then this runner will be executed.

```yaml
job:tag:
  script: yarn install
  tags:
    - shell # The runner with the name `shell` will be launched
```

## services
This declaration allows you to add basic services (docker container) to help you with your `jobs`.
For example if you want to use a database to test your application you will ask for it in `services`.

```yaml
test:functional:
  image: registry.gitlab.com/username/project/php:test
  services:
    - postgres # We call the `postgres` service as a database
 before_script:
   - composer install -n
 script:
   - codecept run functional
```

## environment
This declaration is used to define a specific environment for the deployment. You can create an environment in the GitLab web interface or just let GitLab CI/CD create it automatically.

It is possible to specify:
  - a `name`,
  - a `url`,
  - an `on_stop` condition,
  - an `action` in response to the previous condition.

```yaml
...

deploy:demo:
  stage: deploy
  environment: demo # Simple environmental statement
  script:
    - make deploy

deploy:production:
  environment: # Extended environmental statement
    name: production
    url: 'https://blog.eleven-labs/fr/gitlab-ci/' # Application URL
  script:
    - make deploy
```

By declaring `environments` you can, from the GitLab web interface, deploy / redeploy your application or directly access your site if you have declared a `url`. This is done in `Operations > Environment`.

![CI Environment]({BASE_URL}/imgs/articles/2018-09-19-introduction-gitlab-ci/ci-environment.png)

The `undo` button allows you to redeploy, the `external link` button allows you to go to the application and the `remove` button allows you to remove the environment.

`on_stop` and `action` will be used to add an action at the end of the deployment, if you want to stop your application on command. Useful for demonstration environments.

```yaml
...

deploy:demo:
  script: make deploy
  environment:
    name: demo
    on_stop: stop:demo

stop:demo: # This job can only be visible and executed after the `deploy:demo` job
  script: make stop
  environment:
    name: demo
    action: stop
```

Here is the official link for the [environments documentation](docs.gitlab.com/ee/ci/environments.html) if you want to go further.

## variables
This declaration allows you to define variables for all `jobs` or for a specific `job`.
This is equivalent to declaring environment variables.

```yaml
...
variables: # Declaration of variables for all `jobs`
  SYMFONY_ENV: prod

build:
  script: echo ${SYMFONY_ENV} # Will display "prod"

test:
  variables: # Declaration and rewrite of global variables for this `job`
    SYMFONY_ENV: dev
    DB_URL: '127.0.0.1'
  script: echo ${SYMFONY_ENV} ${DB_URL} # Will display "dev 127.0.0.1"
```

As with `environment` I'll let you look at the official documentation on [variables](https://docs.gitlab.com/ee/ci/yaml/#variables) if you want to go further.

It is also possible to declare variables from the GitLab web interface `Settings> CI/CD> Variables` and to specify an environment for them.

![CI Variables]({BASE_URL}/imgs/articles/2018-09-19-introduction-gitlab-ci/ci-variables.png)

## cache
This directive allows you to play with cache. The cache is useful for specifying a list of files and directories to cache along your pipeline. Once the pipeline is finished the cache will be destroyed.

Several sub-directives are possible:
- paths: mandatory, it allows you to specify the list of files and / or directories to cache
- key: optional, it allows you to define a key for the list of files and / or directories. Personally, I still haven't seen the usefulness of it.
- untracked: optional, it allows you to specify that files should not be tracked by your git repository in the event of a `push` during your pipeline.
- policy: optional, it allows to say that the cache must be recovered or saved during a job (`push` or` pull`).

```yaml
stages:
  - build
  - deploy

job:build:
  stage: build
  image: node:8-alpine
  script: yarn install && yarn build
  cache:
    paths:
      - build # cached directory
    policy: push # the cache will just be backed up, no recovery of an existing cache

job:deploy:
  stage: deploy
  script: make deploy
  cache:
    paths:
      - build
    policy: pull # cache recovery
```

## artifacts
Artifacts are a bit like cache, but they can be retrieved from another pipeline.
As for the cache, you must define a list of files or / and directories that will be saved by GitLab.
Files are saved only if the `job` is successful.

We find five possible sub-directives:
  - paths: mandatory, it allows you to specify the list of files and / or folders to put in `artifact`
  - name: optional, it allows giving a name to the `artifact`. By default it will be named `artifacts.zip`
  - untracked: optional, it allows to ignore the files defined in the `.gitignore` file
  - when: optional, it allows to define when the`artifact` must be created. Three possible choices: `on_success`,` on_failure`, and `always`. The `on_success` value is the default.
  - expire_in: optional, it allows you to define an expiration time

```yaml
job:
  script: make build
  artifacts:
    paths:
      - dist
    name: artifact:build
    when: on_success
    expire_in: 1 weeks
```

## dependencies
This declaration works with `artifacts`, it makes a `job` dependent on an `artifact`. If the 'artifact' has expired or has been deleted / does not exist, then the pipeline will fail.

```yaml

build:artifact:
  stage: build
  script: echo hello > artifact.txt
  artifacts: # Add an `artifact`
    paths:
      - artifact.txt

deploy:ko:
  stage: deploy
  script: cat artifact.txt
  dependencies: # We link the job with 'build:artifact:fail' which does not exist so the pipeline will fail
    - build:artifact:fail

deploy:ok:
  stage: deploy
  script: cat artifact.txt
  dependencies: # We link the job with 'build:artifact' which exists so the pipeline will not fail
    - build:artifact
```

## coverage
This declaration allows you to specify a regular expression to retrieve the code coverage for a `job`.

```yaml
...

test:unit:
  script: echo 'Code coverage 13.13'
  coverage: '/Code coverage \d+\.\d+/'
```

The code coverage will be visible in the `job` information in the GitLab web interface:

![CI Coverage]({BASE_URL}/imgs/articles/2018-09-19-introduction-gitlab-ci/ci-coverage.png)

## retry
This declaration allows to re-execute the `job` in case of failure. You must indicate the number of times you want to re-run the `job`.

```yaml
job:retry:
  script: echo 'retry'
  retry: 5
```

## include
For this functionality you will need a premium account. This functionality allows you to include "templates".
The "templates" can be local in your project or remotely.

Files are always evaluated first and merged recursively. You can override or replace "template" declarations.

 - local template

```yaml
# template-ci/.lint-template.yml

job:lint:
  stage: lint
  script:
    - yarn lint
```

 - remote template

```yaml
# https://gitlab.com/awesome-project/raw/master/template-ci/.test-template.yml

job:test:
  stage: test
  script:
    - yarn test
```

 - main manifesto

```yaml
# .gitlab-ci.yml

include:
  - '/template-ci/.lint-template.yml'
  - 'https://gitlab.com/awesome-project/raw/master/template-ci/.test-template.yml'

stages:
  - lint
  - test

image: node:9-alpine

job:lint:
  before_script:
    - yarn install

job:test:
  script:
    - yarn install
    - yarn unit
```

Here is what gitlab CI/CD will interpret:

```yaml
stages:
  - lint
  - test

image: node:9-alpine

job:lint:
  stage: lint
  before_script: # we override `job:lint` with `before_script`
    - yarn install
  script:
    - yarn lint

job:test:
  stage: test
  script: # we replace the `script` declaration of the "template" https://gitlab.com/awesome-project/raw/master/template-ci/.test-template.yml
    - yarn install
    - yarn unit
```

This can be useful if your manifesto is large, and therefore more difficult to maintain.

## Anchors
This feature allows you to reuse templates several times.

```yaml
.test_template: &test_template
  stage: test
  image: registry.gitlab.com/username/project/php:test
  before_script:
    - composer install -n
  when: on_success

.db_template:
  services:
    - postgres
    - mongo

test:unit:
  <<: *test_template
  script:
    - bin/phpunit --coverage-text --colors=never tests/

test:functional:
  <<: *test_template
  services: *db_template
  script:
    - codecept run functional
```

Here is what gitlab CI/CD will interpret:

```yaml
test:unit:
  stage: test
  image: registry.gitlab.com/username/project/php:test
  before_script:
    - composer install -n
  script:
    - bin/phpunit --coverage-text --colors=never tests/
  when: on_success

test:functional:
  stage: test
  image: registry.gitlab.com/username/project/php:test
  services:
    - postgres
    - mongo
  before_script:
    - composer install -n
  script:
    - codecept run functional
  when: on_success
```

# Resources

- [GitLab Continuous Integration (GitLab CI/CD)](https://docs.gitlab.com/ee/ci/README.html)
- [Getting started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/README.html)
- [Configuration of your jobs with .gitlab-ci.yml](https://docs.gitlab.com/ee/ci/yaml/README.html)
- [GitLab Runner](https://docs.gitlab.com/runner/)
