---
contentType: article
lang: en
date: '2020-10-13'
slug: domain-anemia
title: Domain anemia
excerpt: >-
  Are you suffering from domain anemia? Let's look at what an anemic domain
  model is and how things can change.
cover: /imgs/articles/2020-10-13-anemic-domain-model/cover.jpg
categories:
  - php
authors:
  - rpierlot
keywords: []
---

Today I’d like to talk about something that we see quite often in applications: anemic domains.

What’s that you might ask? It’s simply the fact that objects responsible for modeling your business logic... do not contain any of it. Seems strange reading it like this right? Let’s look at some examples to have a better understanding of what I’m saying.

Let’s begin with a simple one: say you want to create a new blog post. In a typical application you’d use your favorite ORM to deal with inserting your shiny new entity into your database. You have a controller handling your HTTP request, and then a service that creates a new Article entity, setting all the right properties for this new stuff.

```php
Class Article
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    private string $title;
    private string $content;
    private string $status;
    private \DateTime $createdAt;
    private \DateTime $updatedAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}
```
The service layer looks like this:

```php

class ArticleService
{
    public function create(string $title, $string $content): Article
    {
        $article = new Article();
        $article->setTitle($title);
        $article->setContent($content);
        $article->setStatus(Article::STATUS_DRAFT);

        $this->orm->save($article);

        return $article;
    }

    public function publish(Article $article): void
    {
        $article->setStatus(Article::STATUS_PUBLISHED);
        $article->setUpdatedAt(new \DateTime());

        $this->orm->save($article);
    }
}
```

Looking back at our code, you might be thinking « it looks pretty standard to me, what’s wrong with it? ». Well, if you look at it conceptually, does it make sense? Is it logical to create an empty shell `new Article()` with no properties at all at first? Then setting a title? Then a content? I doubt that you'd be comfortable reading a blank page with nothing in it.

### Time goes by

Let’s add a business rule: you cannot publish an article without at least having a title and a content.

You’ll change the publish method in your service like this:

```php
// class ArticleService
    public function publish(Article $a)
    {
        if (strlen($article->getTitle()) === 0 || strlen($article->getContent())) {
            throw new CannotPublishException();
        }

        //...
    }
```

Your Article object is just a data bag, and not useful at all. The service layer is the one making sure your entity is valid.
This is somehow very weird to shift all the responsibilities of an object to something outside itself. An article should be able to protect its invariants, so that you are sure to end up having a valid state.

Having such responsibilities will, in the future, allow you or one of your team members to write things like this:

```php
$article = new Article();
$article->setStatus(Article::STATUS_PUBLISHED);
$article->setContent(‘Today we are going to...’);
$this->orm->save($article);
```

This means that you created an article without a title. In the real world it seems quite odd, so why not translate this real world requirement into an explicit thing? Isn’t it what programming is about, translating real processes into code?

Moreover, how would you test this? Again by setting all properties by hand, and asserting that they are all equal. But is it a relevant test? What about change, adding a new business requirement?

This is what's called an anemic domain model. A class with a bunch of getters and setters, but no behavior. It does nothing on its own.

A domain object must be responsible for its own state, as opposed to this anemic Article.

### Mindshift

Shifting from an anemic model to a rich model does not have to be a massive effort. It's mostly a change in how we perceive the domain of our application: the heart of your software.
From our previous example, we can simply make the following changes:

```php
class Article
{
    //...
    private function __construct(string $title, string $content): void
    {
        $this->title = $title;
        $this->content = $content;
        $this->status = self::STATUS_DRAFT;
        $this->createdAt = new \DateTime();
    }

    static public function createDraft(string $title, string $content): Article
    {
        return new self($title, $content);
    }

    public function publish(): void
    {
        if (strlen($title) === 0 || strlen($content) === 0) {
            throw new CannotPublishException();
        }

        $this->status = self::STATUS_PUBLISHED;
        $this->updatedAt = new \DateTime();
    }

    public function getTitle(): string;
    public function getContent(): string;
    public function getCreatedAt(): string;
    public function getUpdatedAt(): string;
}
```

With a richer domain model, your service could look a bit like this:

```php
//class ArticleService
    public function create(string $title, string $content)
    {
        $article = Article::createDraft($title, $content);
        $this->orm->save($article);
    }

    public function publish(Article $article)
    {
        $article->publish();
        $this->orm->save($article);
    }
```

Although this example is very basic, we see a shift in responsibility between the service layer and the domain object. And that seems far more understandable than before.
Tests can now focus only on business logic without needing to deal with the service layer, which is kept thin.

Rich domain objects enable you to have valid states and make sure it stays this way, through the class constructor or using static methods to build your objects.

You will also notice that Article has methods with far more descriptive names. `createDraft` and `publish` are domain concepts, they relate to business requirements shared between all parties of the software. The language used in the code is now aligned with the business.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Interestingly too, with an Explicit Model there are generally far less lines of code than with an Anemic Model (think client+model). The Explicit Model can be easily tested with confidence. The Anemic Model can have 10,000 tests with doubt.</p>&mdash; Vaughn Vernon (@VaughnVernon) <a href="https://twitter.com/VaughnVernon/status/1009183261866639360?ref_src=twsrc%5Etfw">June 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I think most of this anemia comes from how ORM/framework explains to you how to deal with objects and database, but we lose sight of what really is object oriented design: transposing problems into code ; combining behavior and data.

Moving from an anemic domain to a rich one is not for every use case, but if you have a certain amount of business logic, you'd better try it.

For sure there are downsides to defining domain objects with actual behaviors. For instance, you’ll have to adapt how objects are built by your ORM (if you use one) into objects. But that will quickly be forgotten once you discover how it changes the way you test and think about your domain model.

Take a look at this article from Matthias Noback regarding an interesting solution for dealing with database and domain objects: [https://matthiasnoback.nl/2018/03/ormless-a-memento-like-pattern-for-object-persistence/](https://matthiasnoback.nl/2018/03/ormless-a-memento-like-pattern-for-object-persistence/)

Thanks [Guillem](https://twitter.com/buraitopengin) for the feedbacks!

## Resources

- [Anemic Domain Model - Fowler](https://martinfowler.com/bliki/AnemicDomainModel.html)
- [A blog engine using rich domain objects](https://github.com/dddinphp/blog-cqrs)
