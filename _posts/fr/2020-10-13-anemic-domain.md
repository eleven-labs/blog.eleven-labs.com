---
layout: post
title: "Anémie du domaine"
excerpt: Souffrez-vous d'anémie métier ? Regardons ce qu'est une anémie du domaine et comment les choses peuvent changer.
authors:
    - rpierlot
lang: fr
permalink: /fr/domain-anemia/
categories:
    - bonnes pratiques
tags:
    - php
cover: /assets/2020-10-13-anemic-domain-model/cover.jpg
---

Aujourd'hui j'aimerais parler de quelque chose que l'on voit souvent dans les applications : l'anémie du domaine.

Qu'est-ce donc? C'est simplement le fait que les objects responsables de la modélisation de votre logique métier... n'en contiennent pas. Cela paraît étrange n'est-ce pas ? Prenons un exemple pour mieux comprendre ce que j'entends par là.

Imaginons que vous souhaitiez ajouter un nouvel article à votre blog. Dans une application classique, vous utiliseriez votre ORM favori pour insérer votre toute nouvelle entité dans votre base de données. Vous avez un controller gérant votre requête HTTP, et enfin un service qui crééra votre nouvelle entité Article, avec toutes les propriétés qui vont bien.

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
Votre couche service ressemble à cela :

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

En regardant ce que nous venons d'écrire, on pourrait se dire « cela m'a l'air assez classique, quel est le problème ? ». Si nous observons d'un point de vue plus conceptuel, est-ce que cela a du sens ? Est-ce que c'est logique de créer cet objet vide `new Article()` avec aucune propriété définie en premier lieu ? Puis de définir un titre, puis un contenu ? Je doute que vous soyez confortable avec l'idée de regarder une page d'article vide, sans contenu.

### Le temps passe

Ajoutons une règle métier : vous ne pouvez pas publier d'article sans avoir au moins un titre et un contenu.

La méthode `publish` de notre service serait changée par :

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

L'objet Article est juste un conteneur de propriétés, pas très utile. La couche service est celle qui s'assure que notre entité est valide.
C'est quelque chose d'assez étrange de transposer la responsabilité d'un objet à quelque chose d'extérieur à lui-même. Un article devrait être en mesure de protéger ses propriétés, pour être sûr de finir dans un état valide.

Avoir ces responsabilités vont, dans le futur, permettre à vos collègues ou vous-même d'écrire quelque chose comme :

```php
$article = new Article();
$article->setStatus(Article::STATUS_PUBLISHED);
$article->setContent(‘Today we are going to...’);
$this->orm->save($article);
```

Ce qui veut dire que l'on peut publier un article sans titre. Dans le monde réel, cela parait étrange... Alors pourquoi ne pas traduire ce vrai besoin dans quelque chose d'explicite ? N'est-ce pas ce qu'est la programmation, traduire des vrais process en code ?

De plus, comment testeriez-vous cela ? En définissant toutes les propriétés à la main, et assertant que toutes soient bien égales à celles définies. Mais est-ce pertinent ? Et quid de l'évolution dans le temps, de l'ajout de nouvelles règles métier ?

C'est ce qu'on appelle un domaine anémique. Une classe avec plein de getters et setters, mais aucun comportement. Elle ne fait rien par elle-même.

Un objet métier devrait être reponsable de son propre état, en contradiction totale avec cet Article anémique.

### Changer d'état d'esprit

Transformer un modèle anémique en un modèle riche n'a pas à être un effort incroyable et douloureux. C'est principalement un changement de la façon dont nous percevons le métier de notre application : comme étant le coeur du logiciel.

Par rapport à notre exemple précédent, nous pouvons simplement faire les changements suivants :

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

Avec un modèle du domaine riche, notre service ressemblerait à cela :

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

Bien que cet exemple soit très basique, nous pouvons observer une transformation dans la responsabilité de la couche service et des objets métiers. Et cela est bien plus compréhensible visuellement.
Les tests peuvent maintenant se concentrer uniquement sur la logique métier, sans avoir à gérer la couche service, qui reste simple et petite.

Des objets du domaine riches permettent d'avoir des états valides, et garantir que ces états le restent, à travers le constructeur de la classe ou en utilisant des constructeurs statiques.

Vous remarquerez aussi que Article a des noms de méthodes bien plus explicites. `createDraft` et `publish` sont des concepts métiers, liés à des règles business définies et partagées entre tous les acteurs du logiciel. Le langage utilisé dans le code est maintenant aligné avec le métier.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Interestingly too, with an Explicit Model there are generally far less lines of code than with an Anemic Model (think client+model). The Explicit Model can be easily tested with confidence. The Anemic Model can have 10,000 tests with doubt.</p>&mdash; Vaughn Vernon (@VaughnVernon) <a href="https://twitter.com/VaughnVernon/status/1009183261866639360?ref_src=twsrc%5Etfw">June 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Je pense que la plupart de cette anémie vient des différents ORMs/frameworks expliquant comment gérer les objets et bases de donneés, et nous perdons le fil principal de ce qu'est l'architecture orientée objects : transposer des besoins dans le code ; combiner le comportement et les données.

Partir d'un domaine anémique vers une modelisation riche ne convient pas à tous les cas de figure, mais si vous possédez suffisament de logique métier, vous en sortirez gagnant.

Il y a évidemment des incovénients à définir des objets de la sorte. Par exemple, vous devrez adapter comment vos objets sont récupérés ou persistés  par votre ORM (si vous en utilisez un). Mais cette complexité additionnelle sera vite oubliée quand vous découvrirez la joie de manipuler des objets métiers avec des comportements riches, la façon dont vous testez et pensez votre modélisation métier.

Par ailleurs, voici un article de Matthias Noback concernant une solution intéressante pour gérer l'interaction entre vos objets métiers et la base de données : [https://matthiasnoback.nl/2018/03/ormless-a-memento-like-pattern-for-object-persistence/](https://matthiasnoback.nl/2018/03/ormless-a-memento-like-pattern-for-object-persistence/)

Merci à [Guillem](https://twitter.com/buraitopengin) pour la relecture et les retours!

## Ressources

- [Anemic Domain Model - Fowler](https://martinfowler.com/bliki/AnemicDomainModel.html)
- [A blog engine using rich domain objects](https://github.com/dddinphp/blog-cqrs)
