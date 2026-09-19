# Audit SEO — septembre 2026

Audit réalisé le 19/09/2026 sur la branche `feat/seo-technical-metadata`, à partir des données Google Search Console de la propriété `https://blog.eleven-labs.com/` et d'une relecture du code de rendu des métadonnées.

## 1. Ce qui a été corrigé sur la branche

### 1.1 Balises canoniques en doublon et contradictoires (bloquant)

La branche introduisait un `<link rel="canonical">` global auto-référent dans `useLayoutTemplateContainer`, mais trois conteneurs posaient déjà leur propre canonique. `hoofd` ne dédoublonne que les `<meta>`, pas les `<link>` : chaque page d'accueil, de catégorie et de recherche se retrouvait donc avec **deux canoniques différentes**, ce qui annule le signal pour Google.

Les canoniques locales étaient par ailleurs fausses, et l'inspection d'URL le confirme en production :

| URL inspectée                 | Canonique déclarée avant correction | Effet                                                                               |
| ----------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------- |
| `/en/categories/javascript/`  | `/fr/categories/javascript/`        | canonique inter-langue : la version anglaise se déclarait dupliquée de la française |
| `/fr/categories/all/pages/2/` | `/fr/categories/all/`               | toutes les pages paginées se déclaraient dupliquées de la page 1                    |
| `/fr/`                        | `/` (URL relative)                  | contredisait directement la canonique absolue posée par le layout                   |
| `/fr/search/`                 | `/fr/search/` en dur                | figeait la canonique quelle que soit la langue                                      |

Google avait ignoré ces deux premières canoniques (il a retenu l'URL anglaise et la page 2 comme canoniques), mais le signal restait incohérent et l'arbitrage pouvait basculer à tout moment.

**Correction** : suppression des trois canoniques locales (`useHomePageContainer`, `useCategoryPageContainer`, `useSearchPageContentContainer`). Le layout reste seul responsable, avec une canonique absolue et auto-référente, sauf pour `/` qui pointe vers `/fr/` comme prévu par la branche.

### 1.2 Directives d'indexation non pilotables

`<meta name="robots" content="index, follow, noarchive">` était codée en dur dans `HtmlTemplate`, donc identique sur toutes les pages et impossible à surcharger.

**Correction** : la balise est déplacée dans `useLayoutTemplateContainer` via `useHead`, ce qui permet à `hoofd` de la dédoublonner par `name` et à une page de la surcharger. Sa valeur passe à `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` (voir 3.3 pour le retrait de `noarchive`).

`max-image-preview:large` autorise Google à afficher une grande vignette dans les résultats : c'est le levier de CTR le plus immédiat compte tenu des chiffres de la section 2.

### 1.3 Pages qui ne doivent pas être indexées

- **Recherche interne** (`/:lang/search/`) : passe en `noindex, follow`. Google déconseille explicitement l'indexation des pages de résultats de recherche interne.
- **Page 404** : le serveur répond `200` sur toutes les URL inconnues (`src/server.ts`), ce qui produit des _soft 404_ indexables. La page passe en `noindex, follow`.

### 1.4 Données structurées

- `publisher.logo.url` pointait vers `/imgs/logo.png`, **fichier inexistant** (vérifié : HTTP 400). Le JSON-LD `BlogPosting` était donc invalide pour Google sur l'ensemble des articles, ce qui explique que l'inspection d'URL ne détecte que `Breadcrumbs` et jamais `Article`. Le chemin est désormais centralisé dans `src/config/website/common.ts` et pointe vers `/imgs/icons/apple-icon-180x180.png`, avec `width` et `height`.
- Les URL `item` du `BreadcrumbList` et `author.url` passent par `getUrl` (URL absolues cohérentes avec la canonique) au lieu de `generateUrl` (destiné aux assets).
- Sur une étape de tutoriel, le fil d'Ariane s'arrêtait au titre du tutoriel tout en pointant vers l'URL de l'étape. Un 4ᵉ niveau distingue désormais le tutoriel de l'étape courante.

### 1.5 Titres dupliqués

- **Étapes de tutoriel** : toutes les étapes d'un tutoriel partageaient le `<title>`, l'`og:title` et le `headline` du tutoriel. Elles sont pourtant dans le sitemap avec une priorité de 0.9. Le titre de l'étape est maintenant concaténé au titre du tutoriel.
- **Pages paginées** (catégories et auteurs) : même `<title>` que la page 1. Un suffixe `- Page N` est ajouté à partir de la page 2.

### 1.6 Flux RSS

Le flux utilisait le même logo inexistant, et ses `id`/`link` — au niveau du flux comme des articles — étaient des chemins relatifs, ce qui est invalide en RSS 2.0. Les URL sont désormais absolues.

### 1.7 Sitemap : `lastmod`

Le sitemap n'exposait que `priority` et `changefreq`, deux balises que Google a confirmé ignorer très largement, et **aucun `lastmod`**, la seule que Google utilise réellement pour planifier ses réexplorations. C'est le complément logique du champ `updatedAt` introduit par cette branche.

`getSitemapEntries` construit désormais une date de dernière modification (`updatedAt` à défaut `date`) pour chaque article, tutoriel et étape de tutoriel : 479 des 674 URL en sont pourvues, les autres étant des pages de liste dont la date de modification n'a pas de sens stable.

### 1.8 Vérification

Type-check, lint et les 54 tests unitaires passent. Le blog a été démarré (`pnpm start:dev`) et 20 URL couvrant toutes les routes ont été contrôlées en SSR, puis la page d'accueil, un article et une navigation SPA complète ont été validés dans Chrome après hydratation : une seule canonique et une seule balise `robots` par page, `noindex` sur la recherche et la 404, `hreflang` présents sur la seule page d'accueil et correctement nettoyés au changement de route, JSON-LD `WebSite` + `BlogPosting` + `BreadcrumbList` valides, sitemap XML valide, aucune régression visuelle ni nouvelle erreur console.

## 2. Ce que dit la Search Console

### 2.1 Vue d'ensemble (21/06/2026 → 19/09/2026)

| Indicateur       | Valeur  |
| ---------------- | ------- |
| Clics            | 2 115   |
| Impressions      | 675 835 |
| CTR              | 0,31 %  |
| Position moyenne | 8,6     |

### 2.2 Le vrai signal : −61 % de clics en un an

Comparaison avec la même période en 2025 :

| Appareil   | Clics 2025 → 2026         | Impressions 2025 → 2026       | CTR 2025 → 2026     | Position 2025 → 2026 |
| ---------- | ------------------------- | ----------------------------- | ------------------- | -------------------- |
| Ordinateur | 4 593 → 1 810 (−61 %)     | 354 693 → 545 887 (+54 %)     | 1,29 % → 0,33 %     | 20,1 → 8,6           |
| Mobile     | 780 → 298 (−62 %)         | 84 630 → 109 403 (+29 %)      | 0,92 % → 0,27 %     | 22,8 → 8,8           |
| Tablette   | 24 → 7                    | 1 507 → 20 545 (×13,6)        | 1,59 % → 0,03 %     | 9,6 → 8,7            |
| **Total**  | **5 397 → 2 115 (−61 %)** | **440 830 → 675 835 (+53 %)** | **1,22 % → 0,31 %** | **20,1 → 8,6**       |

L'amélioration apparente de la position moyenne (20,1 → 8,6) et la hausse des impressions ne sont pas de bonnes nouvelles : elles s'accompagnent d'une division par deux et demie du trafic réel. C'est le profil d'une dilution — le site apparaît beaucoup plus souvent, plus haut en apparence, mais sur des requêtes qui ne convertissent pas.

### 2.3 Une part importante des impressions est du bruit

Répartition sur les 28 derniers jours :

| Pays / appareil          | Impressions | Clics | CTR        |
| ------------------------ | ----------- | ----- | ---------- |
| France / ordinateur      | 82 399      | 403   | 0,49 %     |
| **Maroc / ordinateur**   | **31 565**  | **9** | **0,03 %** |
| France / mobile          | 19 778      | 52    | 0,26 %     |
| **Tunisie / ordinateur** | **7 946**   | **6** | **0,08 %** |

Le Maroc représente à lui seul près d'un quart des impressions pour 2 % des clics. Une page concentre l'anomalie : `/fr/comprendre-le-ssltls-partie-4-handshake-protocol/` totalise **69 182 impressions pour 49 clics** sur 90 jours (CTR 0,07 %), alors que le détail par requête n'attribue que 626 impressions à des requêtes identifiées.

**Conséquence pratique : le CTR global de 0,31 % n'est pas un indicateur exploitable.** Il faut piloter sur le segment France, dont le CTR réel est d'environ 0,49 % sur ordinateur — faible, mais dans un ordre de grandeur sur lequel on peut agir.

### 2.4 Requêtes en forte perte

| Requête               | Clics 2025 → 2026 | Position 2025 → 2026  |
| --------------------- | ----------------- | --------------------- |
| traefik reverse proxy | 63 → 2            | 19,3 → 10,6           |
| semantic release      | 57 → 13           | 3,9 → 4,4             |
| rabbitmq              | 36 → 0            | 6,2 → hors classement |
| traefik docker        | 31 → 5            | 5,5 → 7,6             |
| reverse proxy traefik | 27 → 1            | 7,8 → 12,2            |
| symfony graphql       | 22 → 1            | 6,3 → 4,7             |
| ssl handshake         | 23 → 5            | 5,2 → 2,9             |

Le cas le plus parlant est `semantic release` et `ssl handshake` : la position s'est maintenue ou améliorée, mais les clics s'effondrent. Ce n'est pas un problème de classement, c'est un problème d'attractivité du résultat (titre, description, absence de vignette) et de concurrence des réponses directes dans la SERP.

La seule progression notable est `json server` : 4 → 21 clics, avec un passage de la position 20,1 à 4,4.

### 2.5 Fort volume, très faible CTR (potentiel immédiat)

| Requête                 | Impressions (90 j) | Clics | Position |
| ----------------------- | ------------------ | ----- | -------- |
| architecture hexagonale | 4 479              | 11    | 8,5      |
| k9s                     | 4 223              | 6     | 7,1      |
| traefik                 | 1 685              | 9     | 9,5      |
| atomic design           | 1 197              | 6     | 7,6      |
| cadvisor                | 1 045              | 8     | 4,8      |
| crossplane              | 883                | 8     | 7,5      |
| git rebase              | 811                | 7     | 9,4      |
| apache iceberg          | 732                | 7     | 9,3      |

Ces requêtes sont en première page mais ne récupèrent presque aucun clic. C'est là que se trouve le gain le plus rapide.

### 2.6 Sitemap et indexation

- Un seul sitemap, `https://blog.eleven-labs.com/sitemap.xml` : 658 URL, **0 erreur, 0 avertissement**. Dernier téléchargement par Google le 14/09/2026, dernière soumission manuelle le 16/07/2025.
- La racine `/` est aujourd'hui la page canonique retenue par Google pour l'accueil, et `/fr/` est classée « Page en double sans URL canonique sélectionnée par l'utilisateur ». La branche inverse ce choix (canonique et `loc` du sitemap vers `/fr/`). C'est le bon choix sur le fond — cohérence entre langues — mais **il faut s'attendre à quelques semaines d'instabilité** sur l'accueil, le temps que Google transfère les signaux. À surveiller dans le rapport d'indexation.
- Les articles ne déclaraient aucune canonique avant cette branche (`user_canonical: null` sur `/fr/arbre-syntaxique-abstrait/`). C'est corrigé.
- Aucun résultat enrichi de type `Article` n'a jamais été détecté, uniquement `Breadcrumbs` (issus de la microdonnée du design system). Le logo invalide en était la cause probable.

## 3. Points relevés lors de la première passe

### 3.1 `hreflang` et `x-default` — partiellement appliqué

Le sitemap portait déjà les `xhtml:link` par langue, mais **aucun `x-default` n'était déclaré nulle part**, ni en HTML ni dans le sitemap. C'est le manque le plus net : sans lui, Google choisit seul la version à servir à un visiteur dont la langue ne correspond à aucune version.

Appliqué :

- `x-default` ajouté dans le sitemap pour toute entrée multilingue, pointant vers la version de la langue par défaut.
- `hreflang` `fr` / `en` / `x-default` ajoutés dans le `<head>` de la page d'accueil (`useHomePageContainer`), la seule page dont l'existence dans toutes les langues est garantie quel que soit le contenu publié.

Non appliqué : le `hreflang` HTML sur les catégories et les pages auteur. Ces pages n'existent que si du contenu existe dans la langue visée (il n'y a par exemple aucun tutoriel en anglais), et le layout ne dispose pas de cette information — elle n'est pas exposée dans `common.json`. Déclarer un `hreflang` vers une URL en 404 serait plus nuisible que de ne rien déclarer. Le sitemap couvre déjà ces pages correctement, le gain restant est donc marginal ; l'enjeu est surtout d'étendre `LayoutTemplateData` si l'on veut la redondance.

À noter : les balises sont sérialisées en `hrefLang` par React. Les noms d'attributs HTML étant insensibles à la casse, le navigateur et Google lisent bien `hreflang` — vérifié dans Chrome.

### 3.2 Pages auteur sans méta description — appliqué

`useAuthorPageContainer` ne posait aucune `<meta name="description">`, alors que ces pages sont dans le sitemap. Une nouvelle clé de traduction était exclue : les traductions viennent de Loco et `pnpm download-translations` écrase les fichiers locaux.

La description est donc dérivée de la **biographie de l'auteur**, déjà présente dans les données, via un nouvel utilitaire `getTextSummaryFromHtml` (`src/helpers/stringHelper.ts`) qui retire les balises, normalise les espaces et coupe à 155 caractères sur une frontière de mot. Le titre SEO sert de repli si la biographie est vide. Aucune clé de traduction, aucun contenu modifié, et une description unique par auteur.

Le suffixe `- Page N` des pages paginées utilise une chaîne littérale pour la même raison : le mot est identique en français et en anglais.

### 3.3 `noarchive` — appliqué

La directive n'apporte plus rien depuis que Google a retiré le lien « En cache » des résultats, et elle reste restrictive pour les autres moteurs. Elle est retirée du meta `robots`.

### 3.4 Feuille de style inutilisée — appliqué

`useLayoutTemplateContainer` chargeait `Work+Sans` depuis Google Fonts, plus deux `preconnect` déjà présents dans `HtmlTemplate`. Or le design system ne déclare que deux familles : `Agdasima` et `Montserrat`, toutes deux chargées par `HtmlTemplate`. `Work+Sans` n'était utilisée nulle part.

Une requête CSS bloquante vers une origine externe est supprimée, ainsi que trois balises redondantes. Il reste une feuille externe injectée par un script tiers (`info.eleven-labs.com/media/css/modal.min.css`), hors du périmètre de ce dépôt.

### 3.5 Doublon `BreadcrumbList` — non appliqué (arbitrage)

Le composant `Breadcrumb` du design system émet déjà un `BreadcrumbList` en microdonnées. La branche ajoute un `BreadcrumbList` en JSON-LD, plus complet : il inclut l'article et, désormais, l'étape de tutoriel.

Le JSON-LD est conservé parce qu'il est plus riche et que Google le privilégie, mais les deux formats coexistent sur la même page, ce que Google déconseille. La microdonnée ne peut pas être retirée depuis ce dépôt : c'est un arbitrage à porter avec l'équipe qui maintient le design system.

### 3.6 Pages auteur à faible valeur — non appliqué (décision produit)

Le sitemap compte une part notable de pages auteur et de pages auteur paginées, au contenu mince (une biographie et une liste), qui consomment du budget de crawl sans générer de clic. Les sortir du sitemap ou les passer en `noindex, follow` est une décision produit, pas une correction technique — d'autant qu'elles participent au signal d'expertise décrit en 5.7.

### 3.7 Performances web

Le rapport Core Web Vitals n'est pas exposé par l'API utilisée pour cet audit, il reste à consulter dans l'interface. Le chargement de polices est en revanche allégé (voir 3.4).

## 4. Recommandations éditoriales

### 4.1 Priorité 1 — réécrire les titres et descriptions des pages en première page

Cible : les pages de la section 2.5. Elles sont déjà bien classées, le seul frein est le taux de clic.

Points concrets :

- Le gabarit de titre est `Blog Eleven Labs - %s`, ce qui consomme une vingtaine de caractères avant le sujet. Sur `/fr/comprendre-le-ssltls-partie-4-handshake-protocol/`, l'internaute voit d'abord la marque, puis « partie 4 ». Envisager de déplacer la marque en suffixe, ou de la retirer sur les articles (Google la réécrit de toute façon souvent).
- Les articles en série (`SSL/TLS partie 1 à 4`, `RabbitMQ partie 1`, `OpenPGP partie 1`) exposent leur numéro de partie dans le titre. Une requête comme `tls handshake` mène à « partie 4 », ce qui signale un contenu partiel. Donner à chaque partie un titre autonome et décrivant ce qu'elle apporte.
- Vérifier que chaque article à fort volume dispose bien d'un `seo.title` et d'un `seo.description` dans son front matter, distincts du titre et de l'`excerpt`.

### 4.2 Priorité 2 — rafraîchir les contenus en perte

`traefik`, `rabbitmq`, `semantic-release`, `symfony graphql` perdent massivement sur des requêtes durables. Ce sont des sujets où la fraîcheur compte : un article Traefik de plusieurs années est mécaniquement dépassé par des contenus à jour.

La branche ajoute justement un champ `updatedAt` exploité en `dateModified`. Il faut s'en servir : reprendre l'article, mettre à jour les versions et les exemples, et renseigner `updatedAt`. C'est le meilleur retour sur investissement du dispositif mis en place ici.

Ordre suggéré : `/fr/utiliser-traefik-comme-reverse-proxy/` (10 290 impressions, position 17,2 — il était bien mieux placé l'an dernier), puis `/fr/rabbitmq-partie-1-les-bases/`, puis `/fr/semantic-release/`.

### 4.3 Priorité 3 — statuer sur le contenu anglais

Sur les 25 pages les plus performantes en 90 jours, **une seule est en anglais** (`/en/php7-throwable-error-exception/`, 18 467 impressions pour 29 clics, soit 0,16 % de CTR). Le trafic est quasi exclusivement français et francophone (France, Maroc, Tunisie, Sénégal, Belgique, Cameroun).

Deux options cohérentes, mais il faut en choisir une : investir réellement sur l'anglais (traduire les articles qui marchent en français, pas l'inverse), ou assumer un blog francophone et cesser de produire des pages anglaises isolées qui diluent le crawl.

### 4.4 Priorité 4 — capitaliser sur ce qui fonctionne

Les articles qui performent partagent un profil net : sujet outil précis, requête intentionnelle, titre non ambigu. `json server` (CTR 6 %), `crossplane kubernetes` (13,3 %), `docker .env` (21,4 %), `design system react` (13,2 %), `caddy ovh` (10,3 %), `traefik synology` (17,1 %), `php generics` (10,9 %).

C'est le format à reproduire : un outil, un problème concret, un titre qui reprend la requête. À l'inverse, les articles conceptuels génériques (`architecture hexagonale`, `atomic design`) captent beaucoup d'impressions et très peu de clics, car ils affrontent des références installées.

### 4.5 Priorité 5 — maillage interne

Les séries en plusieurs parties et les tutoriels multi-étapes sont les meilleurs candidats : depuis la partie 4 de SSL/TLS, renvoyer explicitement vers les parties 1 à 3 et vice-versa. Cela aide autant l'internaute que la distribution du PageRank interne, et améliore mécaniquement la profondeur de visite.

## 5. Confrontation aux guides Google

Cette section confronte le blog à deux références : [Créer du contenu utile, fiable et axé sur l'internaute](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=fr) et le [guide de démarrage SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=fr). Chaque constat est chiffré sur le dépôt, pas repris tel quel du guide.

### 5.1 Ce qui est déjà conforme

Autant le dire d'emblée : les fondamentaux techniques sont bons, et plusieurs points sont même au-dessus de ce que Google demande.

- **URL descriptives et hiérarchisées.** `/fr/categories/javascript/`, `/fr/arbre-syntaxique-abstrait/` : mots lisibles, regroupement par répertoires, aucun identifiant opaque. C'est exactement le modèle recommandé.
- **Hiérarchie des titres.** `validateHeaders` (`src/helpers/markdownHelper.ts`) **interdit tout `h1` dans le corps markdown** — il est réservé au titre de la page — et refuse les sauts de niveau. Le guide se contente de demander un ordre sémantique pour l'accessibilité en précisant que Google tolère le désordre : la validation du dépôt est plus stricte, et c'est une bonne chose.
- **Liens externes vers des sources fiables.** Sur les articles français : 378 liens vers `github.com`, 61 vers Wikipédia, 54 vers `symfony.com`, 54 vers MDN, 50 vers `php.net`. Le guide demande de « créer des liens vers des ressources dignes de confiance » — c'est fait.
- **Le « Qui » du cadre Qui / Comment / Pourquoi.** Signature d'auteur, biographie en pied d'article, page auteur dédiée, `author.url` dans le JSON-LD : la paternité du contenu est clairement établie.
- **Sommaire automatique** via `extractHeaders`, **texte alternatif de couverture** avec repli sur le titre de l'article, **sitemap sans erreur**, **Search Console configurée**, **aucune publicité ni interstitiel**.

Il n'y a donc rien à corriger sur ces points, et il serait contre-productif d'y consacrer du temps.

### 5.2 Méta descriptions : le chaînon manquant du CTR

Le guide demande une méta description « courte et pertinente, une à deux phrases résumant la page ». Voici l'état réel sur les 411 articles :

| Constat                                               | Volume     |
| ----------------------------------------------------- | ---------- |
| Articles avec une `seo.description` dédiée            | 20 (5 %)   |
| Articles dont la description vient du champ `excerpt` | 391 (95 %) |
| Articles dont l'`excerpt` dépasse 160 caractères      | 188 (46 %) |
| Articles dont l'`excerpt` fait moins de 70 caractères | 61 (15 %)  |

Le problème est structurel : l'`excerpt` sert **deux usages incompatibles** — le texte de la carte dans les listes, et la méta description. Résultat, près d'un article sur deux a une description tronquée dans les résultats de recherche, et un sur sept une description trop courte que Google réécrit à sa guise.

C'est le lien direct avec le constat de la section 2 : sur `semantic release` ou `ssl handshake`, la position est bonne mais les clics s'effondrent. Le guide est explicite sur le fait que le titre et la description déterminent le lien affiché dans les résultats.

**Action** : renseigner `seo.title` et `seo.description` (110 à 155 caractères) dans le front matter des trente pages listées en 2.5 et 2.4. C'est la tâche au meilleur rapport effort/impact de tout cet audit. Aujourd'hui, seuls 21 articles sur 492 ont un bloc `seo:`.

### 5.3 Textes d'ancrage non descriptifs

Le guide demande des ancres « descriptives et appropriées », et cite explicitement « cliquez ici » comme contre-exemple. Sur les articles et tutoriels :

| Ancre       | Occurrences |
| ----------- | ----------- |
| `[ici]`     | 152         |
| `[here]`    | 14          |
| `[lien]`    | 6           |
| `[ce lien]` | 3           |

Soit 175 liens dont ni le lecteur ni Google ne peuvent deviner la destination. Le remplacement est purement rédactionnel et peut se faire au fil de l'eau, en priorité sur les articles rafraîchis (4.2).

### 5.4 Textes alternatifs des images

Le guide indique que l'attribut `alt` aide Google à comprendre le sujet de l'image et qu'il pèse sur le classement dans Google Images. Sur le corpus markdown : **302 images sur 1 237 (24 %) n'ont aucun texte alternatif**.

Les couvertures ne sont pas concernées (repli automatique sur le titre de l'article), mais les illustrations dans le corps des articles le sont. Google Images est une source de trafic que le blog n'exploite pas du tout aujourd'hui.

**Action recommandée** : le dépôt dispose déjà d'un dispositif de validation markdown (`bin/validateMarkdown`, avec `validateTags`, `validateExistingAssets`, `validateHeaders`). Ajouter une règle qui signale les `![](...)` sans texte alternatif empêcherait la dette de croître. La reprise de l'existant reste un travail éditorial.

### 5.5 Fraîcheur du contenu : le cœur du problème

Le guide de démarrage demande de « mettre à jour régulièrement le contenu existant ou le supprimer s'il devient obsolète ». Répartition des 344 articles français par année de publication :

| Période     | Articles | Part |
| ----------- | -------- | ---- |
| 2011 – 2015 | 42       | 12 % |
| 2016 – 2018 | 143      | 42 % |
| 2019 – 2021 | 91       | 26 % |
| 2022 – 2024 | 51       | 15 % |
| 2025 – 2026 | 17       | 5 %  |

**185 articles (54 %) datent de 2018 ou avant.** Et le rythme de publication décroît : 21 articles en 2023, 15 en 2024, 14 en 2025, 3 en 2026. C'est cohérent avec la perte de 61 % des clics.

Le champ `updatedAt` introduit par cette branche est l'outil qui manquait — mais il n'est **renseigné dans aucun article à ce jour**. Il est désormais exposé en `dateModified` dans le JSON-LD et en `lastmod` dans le sitemap : son intérêt est donc réel et immédiat.

Attention toutefois à l'avertissement inverse du guide sur le contenu utile : « modifier les dates sans mise à jour substantielle » est listé parmi les signaux d'un contenu conçu pour les moteurs et non pour les lecteurs. **`updatedAt` ne doit être renseigné qu'après une révision réelle du contenu.**

**Processus suggéré** : cinq articles par trimestre, choisis dans les listes 2.4 et 2.5, avec pour chacun une décision explicite — mettre à jour, fusionner avec un article voisin, ou dépublier. Le guide confirme qu'il n'existe pas de pénalité pour contenu dupliqué : la fusion d'articles en série est donc une décision éditoriale de confort de lecture, pas une mesure défensive.

### 5.6 E-E-A-T : le « Comment » et le « Pourquoi » ne sont pas couverts

Le cadre Qui / Comment / Pourquoi du guide sur le contenu utile est couvert à un tiers. Le « Qui » est bon (5.1). Manquent :

- **Le « Comment ».** Aucun article n'explicite son contexte de production : mission client, projet interne, veille, versions réellement testées. Pour le blog d'une ESN, c'est pourtant l'atout différenciant — le premier « E » de E-E-A-T est l'expérience vécue, ce qu'un contenu généré ne peut pas simuler. Une ligne d'introduction du type « retour d'expérience sur une migration en production, Traefik 2.9 » vaut plus que trois paragraphes de définitions.
- **La date de dernière révision visible.** Seule la date de publication est affichée au lecteur. Un article Traefik de 2019 sans mention de révision perd la confiance avant même d'être lu. Une fois `updatedAt` renseigné, l'afficher dans l'en-tête de l'article est un gain de crédibilité immédiat — et c'est déjà techniquement disponible.
- **Les données structurées de personne et d'organisation.** Les pages auteur contiennent une biographie et des liens sociaux mais n'émettent aucun JSON-LD `Person` ou `ProfilePage`, et le site n'expose pas de bloc `Organization` autonome (uniquement le `publisher` imbriqué dans chaque article). Ce sont les types que Google recommande pour rattacher un contenu à son auteur et à son éditeur.

### 5.7 Ce que Google dit d'ignorer

Utile pour ne pas dépenser d'énergie inutilement. Le guide confirme explicitement que les points suivants n'ont pas d'effet :

- **La longueur du contenu n'est pas un critère de classement** — ne pas rallonger les articles artificiellement.
- **`priority` et `changefreq` du sitemap sont très largement ignorés** — le réglage fin actuel (1.0 pour les articles, 0.9 pour les étapes, 0.8 pour l'accueil…) ne sert à rien. Seul `lastmod`, ajouté en 1.7, compte.
- **La balise `meta keywords` est inutilisée** — elle n'est pas présente dans le dépôt, rien à faire.
- **L'accumulation de mots-clés est contraire aux règles** — et Google comprend seul les variantes sémantiques.
- **E-E-A-T n'est pas un facteur de classement direct** : c'est une grille d'auto-évaluation, pas une liste à cocher. Les recommandations de 5.6 valent pour la confiance du lecteur avant tout.
- **Il n'y a pas de pénalité pour contenu dupliqué** — voir 5.5.

### 5.8 Google Images et vidéos : deux canaux inexploités

Le guide consacre une section à chacun. Le blog ne publie pas de vidéo et, faute de textes alternatifs (5.4), ne capte quasiment rien sur Google Images alors que son corpus compte plus de 1 200 illustrations — schémas d'architecture, captures d'outils, diagrammes. C'est un gisement entier laissé de côté, et le correctif est le même que celui de 5.4.

## 6. À surveiller après mise en production

1. **Bascule de l'accueil** `/` → `/fr/` : suivre dans le rapport d'indexation que `/fr/` passe en « Indexée » et `/` en « Page en double avec balise canonique correcte ». Compter deux à six semaines.
2. **Apparition des résultats enrichis `Article`** : contrôler quelques articles avec le test des résultats enrichis une fois le logo corrigé en ligne.
3. **Désindexation des pages de recherche** : vérifier que `/fr/search/` et `/en/search/` disparaissent de l'index.
4. **Évolution du CTR sur le segment France** après activation de `max-image-preview:large`. C'est l'indicateur à suivre, pas le CTR global.
5. **Resoumettre le sitemap** après le déploiement : la dernière soumission manuelle date du 16/07/2025.
6. **Prise en compte du `lastmod`** : vérifier dans le rapport sitemap que les 479 URL datées sont acceptées sans avertissement, puis observer si la fréquence de réexploration des articles récemment mis à jour augmente.
7. **`hreflang` de l'accueil** : contrôler dans le rapport de ciblage international qu'aucune erreur de réciprocité n'apparaît entre `/fr/`, `/en/` et le `x-default`.
8. **Méta descriptions des pages auteur** : vérifier sur quelques pages que Google reprend bien la biographie plutôt que d'en générer une.
