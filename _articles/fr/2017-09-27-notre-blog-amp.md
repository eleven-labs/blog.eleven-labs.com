---
contentType: article
lang: fr
date: '2017-09-27'
slug: notre-blog-en-amp
title: Notre blog en AMP
excerpt: >-
  Notre blog est à l'image d'Eleven-labs, on aime partager et suivre les
  dernières tendances. À la fois pour notre blog et pour nos lecteurs nous
  voulons ce qu'il y a de meilleur et de plus confortable. C'est pour cela
  qu'aujourd'hui notre blog est AMP compliant.
cover: /assets/2017-09-27-notre-blog-amp/cover.jpg
categories:
  - javascript
authors:
  - captainjojo
keywords:
  - amp
---
Notre blog est à l'image d'Eleven-labs, on aime partager et suivre les dernières tendances. À la fois pour notre blog et pour nos lecteurs nous voulons ce qu'il y a de meilleur et de plus confortable. C'est pour cela qu'aujourd'hui notre blog est **AMP compliant**.

## Mais c'est quoi AMP ?

Petit résumé pour ceux qui n'ont pas lu l'article [AMP le futur du web ?]({BASE_URL}/fr/amp-le-futur-du-web/).
[AMP](https://www.ampproject.org/) est un projet open-source ayant pour volonté d'améliorer les performances de nos sites internet. À la base AMP est créé pour les pages mobiles, même si il est totalement possible de faire de l'AMP sur votre site desktop.
AMP est surtout une technologie Google, en effet le principe est de limiter le nombre de requêtes et tout ce qui fait ralentir l'affichage de vos pages web. Le petit plus c'est que vos pages AMP sont alors cachées directement par les CDN de Google.
Comme Google donne une préférence aux pages AMP lors des recherches mobile, votre SEO n'en est que meilleur.

## Notre blog est AMP !!

Eh oui, c'est fait ! Notre blog peut être servi en AMP, ce qui va permettre à nos utilisateurs mobile d'avoir une expérience améliorée.

    Mais comment on a fait ca ?

Si vous avez suivi l'activité de notre blog cette année, nous [venons de migrer ce dernier]({BASE_URL}/fr/migration-du-blog/). En passant de Wordpress à Jekyll nous pouvons faire plus de développement (enfin plus facilement), et c'est pour cela que nous avons passé nos pages articles en AMP.

Pour commencer nous avons installé le plugin [AMP-jekyll](https://github.com/juusaw/amp-jekyll) qui permet de générer le site avec deux layouts différents.

Il nous a donc fallu créer le layout pour nos pages AMP. Le principe est simple : pas d'import de fichier js ou css, et l'utilisation de certaines balises interdite.

```html
---
layout: amp
---
<!doctype html>
<html amp lang="fr" class="no-js">
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
    <link rel="canonical" href="{{ page.canonical_url | prepend: site.baseurl_root | prepend: site.url }}" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  <body>
<div class="content container">
    <article {% if page.cover %}class="feature-image"{% endif %}>
        <header class="page-heading">
            <div class="container">
                <h1 class="page-heading-title">{{ page.title }}</h1>
                <span class="meta">
                    <span class="meta-content">
                        {{ page.date | date: "%B %-d, %Y" }}
                        {% include author_link.html authors=page.authors %}
                    </span>
                </span>
                <div class="page-heading-reading-time">{% include reading_time.html content=content %}</div>
            </div>
        </header>

        <section class="slice">
            <div class="post-content container">{{ content | markdownify | amp_images }}</div>
        </section>

    </article>
    {% include links.html %}
</div>
    {% include newsletter_link.html %}
{% include footer.html %}

</body>
</html>
```

Maintenant que la base est posée nous devons mettre notre CSS. Comme nous ne pouvons pas importer le fichier existant, nous devons inliner le css directement dans la balise `<style amp-custom>`

Nous avons choisi de continuer d'utiliser Saas, nous avons donc créé un fichier `amp.scss` dans le dossier `_includes` de Jekyll pour nous permettre de *l'inliner* facilement dans notre layout.

```scss
// Settings
@import 'settings/fonts';
@import 'settings/variables';

// External
@import 'external/reset';
@import 'external/syntax';

// Base
@import 'base/global';
@import 'base/utility';

// objects
@import 'objects/layout';
@import 'objects/meta';
@import 'objects/buttons';
@import 'objects/page-heading';
@import 'objects/read-also';
@import 'objects/search-bar';
@import 'objects/avatar';
@import 'objects/newsletter';

// Posts
@import 'layouts/posts';
@import 'layouts/index';

// Partials
@import 'includes/header';
@import 'includes/footer';
@import 'includes/md-content';
@import 'includes/author';
```

Une fois cette étape réalisée, il suffit de l'appeler dans notre layout en ajoutant dans la balise `head` :

```html
<style amp-custom>
	{% capture include_to_sassify %}{% include amp.scss %}{% endcapture %}{{ include_to_sassify | scssify }}
</style>
```

Comme nous n'importons aucun javascript, nous n'avons plus de tag Google Analytics mais heureusement AMP y a pensé. D'abord il faut ajouter le script javascript :

```html
<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
````


Ce qui nous permet d'utiliser la balise `<amp-analytics>` et d'y intégrer le code javascript. Juste avant la fermeture de la balise `body`, il faut ajouter :

```html
<amp-analytics type="googleanalytics">
<script type="application/json">
{
  "vars": {
    "account": "{{ site.theme_settings.google_analytics }}"
  },
  "triggers": {
    "default pageview": {
      "on": "visible",
      "request": "pageview",
      "vars": {
        "title": "{{ page.title }}"
      }
    }
  }
}
</script>
</amp-analytics>
```

Une dernière étape nécessaire pour que Google voie nos pages AMP est de laisser une balise `link` dans nos pages non AMP avec l'url des nouvelles pages.

Dans notre layout principal nous ajoutons le code suivant dans le `head` :

```html
{% if page.path contains '_posts' %}
     <link rel="amphtml" href="{{ page.id | prepend: '/amp' | prepend: site.baseurl_root | prepend: site.url }}">
{% endif %}
```

Si vous le souhaitez, vous pouvez voir la pull request [ici](https://github.com/eleven-labs/blog.eleven-labs.com/pull/211).

## Le mot de la fin

Et voilà ! Vous pouvez retrouver ceci dans vos recherches Google Mobile :

![Search Google]({BASE_URL}/imgs/articles/2017-09-27-notre-blog-amp/search-google.png)

Et notre page dans le CDN google :

![AMP]({BASE_URL}/imgs/articles/2017-09-27-notre-blog-amp/amp.png)

**Bonne lecture.**
