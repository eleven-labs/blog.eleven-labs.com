---
layout: post
title: Notre blog en AMP
permalink: /fr/notre-blog-en-amp/
excerpt: "Notre est blog est à l'image d'Eleven-labs, on aime partagé et suivre les dernières tendances. Alors même pour notre blog nous voulons ce qu'il y a de meilleur, mais aussi pour  le confort de nos  lecteurs. C'est pour cela qu'aujourd'hui notre blog est **AMP compliant**."
authors:
    - captainjojo
categories:
    - javascript
tags:
    - amp
    - javascript
cover: /assets/2017-09-27-notre-blog-amp/cover.jpg
---
Notre est blog est à l'image d'Eleven-labs, on aime partagé et suivre les dernières tendances. Alors même pour notre blog nous voulons ce qu'il y a de meilleur, mais aussi pour  le confort de nos  lecteurs. C'est pour cela qu'aujourd'hui notre blog est **AMP compliant**.

# Mais c'est quoi AMP ?

Petit résumé pour ceux qui n'ont pas lu l'article [AMP le futur du web ?](https://blog.eleven-labs.com/fr/amp-le-futur-du-web/).
[AMP](https://www.ampproject.org/) est un projet open-source ayant pour volonté d'améliorer les performances de nos sites internet. A la base AMP est créé pour les pages mobiles, même si il est totalement possible de faire le l'AMP sur votre site desktop.
AMP est surtout une technologie Google, en effet le principe est de limité le nombre de requêtes et tout ce qui fait ralentir l'affichage de vos pages web, le petit plus c'est que vos pages AMP sont alors caché directement par les CDN de Google.
Comme Google donne une préférence aux pages AMP lors des recherches mobile, votre SEO n'en est que mieux.

# Notre blog est AMP !!

Eh oui, c'est fait ! Notre blog peut être servir en AMP ce qui va permettre à nos utilisateurs mobile d'avoir une expérience encore meilleur.

    Mais comme on a fait ca ?

Si vous avez suivi l'activité de notre blog cette année, nous [venons de migrer ce dernier](https://blog.eleven-labs.com/fr/migration-du-blog/). En passant de Wordpress à Jekyll nous pouvons faire plus de développement (enfin plus facilement), et c'est pour cela que nous avons passez nos pages articles en AMP.

Pour commencer nous avons installer le plugin [AMP-jekyll](https://github.com/juusaw/amp-jekyll) qui permet de générer le site avec deux layouts différents.

Il nous a donc fallut créer le layout pour nos pages AMP. Le principe est simple pas d'import de fichier js ou css, et l'utilisation de certaine balise interdite.

```html
---
layout: amp
---
<!doctype html>
<html amp lang="fr" class="no-js">
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
    <link rel="canonical" href="{{ page.canonical_url | prepend: site.baseurl | prepend: site.url }}" />
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

Maintenant que la base est posé nous devons mettre notre CSS, comme nous ne pouvons pas importer le fichier existant et devons inlined le css directement dans la balise `<style amp-custom>`

Nous avons choisi de continuer d'utiliser Saas, nous avons donc créer un fichier `amp.scss` dans le dossier `_includes` de Jekyll pour nous permettre de *l'inliner*  facilement dans notre layout.

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

Une fois cette étapes réaliser, il suffit de l'appeler dans notre layout en ajoutant dans la balise `head`.

```html
<style amp-custom>
	{% capture include_to_sassify %}{% include amp.scss %}{% endcapture %}{{ include_to_sassify | scssify }}
</style>
```

Comme nous  n'importons aucun javascript, nous n'avons plus de tag Google Analytics mais heureusement AMP y a pensé. D'abord il faut ajouter le script javascript.

```html
<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
````


Ce qui nous permet d'utiliser la balise `<amp-analytics>` et y intégrer le code javascript. Juste avant la fermeture de la balise `body`, il faut ajouter.

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

Une dernière étape nécessaire pour que Google voit nos pages AMP est de laisser une balise `link` dans nos pages non AMP avec l'url des nouvelles pages.

Dans notre layout principal nous ajouter le code suivant dans le `head`.

```html
{% if page.path contains '_posts' %}
     <link rel="amphtml" href="{{ page.id | prepend: '/amp' | prepend: site.baseurl | prepend: site.url }}">
{% endif %}
```

Si vous voulez vous pouvez voir la pull request [ici](https://github.com/eleven-labs/eleven-labs.github.io/pull/211).

# Le mot de la fin

Et voila vous pouvez retrouver ceci dans vos recherches Google Mobile.

![Search Google](/assets/2017-09-27-notre-blog-amp/search-google.png)

Et notre page dans le CDN google.

![AMP](/assets/2017-09-27-notre-blog-amp/amp.png)

**Bonne lecture.**
