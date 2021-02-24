---
layout: post
title: À la découverte de Svelte
excerpt: Svelte veut dire "mince et élégant", un nom adapté pour ce jeune framework qui bouleverse quelques paradigmes du développement web.
authors:
    - romaindurand
lang: fr
permalink: /fr/a-la-decouverte-de-svelte/
categories:
    - javascript

tags:
    - javascript
    - svelte
    - sapper
    - webperformance
    - framework
    - component
    - compilation
image:
  path: /assets/2021-02-22-a-la-decouverte-de-svelte/svelte-logo.png
  height: 308
  width: 720
---

![Logo Svelte]({{ site.baseurl }}/assets/2021-02-22-a-la-decouverte-de-svelte/svelte-logo.png)

# À la découverte de Svelte

Connaissez-vous [Svelte](https://svelte.dev/), le framework Javascript qui monte malgré le silence des médias ? Créé en 2016 par [Rich Harris](https://twitter.com/rich_harris) ([github](https://github.com/Rich-Harris)), il est arrivé en version 3 en 2019, et a reçu le _[Prediction Award de la consultation StateOfJS](https://2019.stateofjs.com/awards/#prediction_award)_ cette même année.


# Présentation

Svelte est en fait un framework _et_ un compilateur, et c’est la principale différence qu’il propose par rapport à ses concurrents. Comme React ou Vue, il suit une approche par composants, organisés dans une arborescence où la donnée ne circule que dans un sens. En revanche, React ou Vue livrent au client leur propre code en plus de votre code transpilé, puis l’essentiel du travail se passe dans le navigateur. Svelte, lui, transfère ce travail au moment de la compilation en ajoutant à votre code, là où c’est nécessaire, des instructions qui vont directement lier l’état de votre application à l’état du DOM. Résultat, on livre des fichiers Javascript beaucoup plus légers, et qui ressemblent beaucoup au code que vous avez écrit. Donc on gagne en performances sur l’activité réseau et l’interprétation des fichiers par le navigateur.

Avec cette approche, plus besoin de DOM virtuel ! On se passe également de l’étape de [calcul des différences de DOM virtuel](https://fr.reactjs.org/docs/reconciliation.html) (réconciliation) quand l’état de l'application change... encore des gains de performances !

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2021-02-22-a-la-decouverte-de-svelte/entendement.gif" width="300px" alt="Mais enfin Jérome, ça dépasserait l'entendement !" style="display: block; margin: auto;"/>
    <i>Gagner en performance en se passant du DOM virtuel ??</i>
</div>



Si l’innovation du DOM virtuel a permis à React de gagner en performances, c’est que son algorithme de réconciliation lui permet de ne modifier que les nœuds DOM qui ont changé au lieu de devoir effectuer le rendu de toute l’application.

L’un des points que Rich Harris porte à notre attention, c’est cet ensemble d’outils mis à disposition des développeurs pour optimiser la réconciliation :

*   shouldComponentUpdate
*   React.PureComponent
*   useMemo
*   useCallback

C’est une forme d’aveu de la part de l’équipe de React qu’il y a un problème autour de ce sujet. Autrement dit, c’est au développeur de faire le travail qu’un framework vraiment réactif pourrait faire lui-même.

Avec Svelte, c’est un changement complet de paradigme, puisque c’est le compilateur qui va outiller votre code pour lier directement, par exemple, le changement d’une variable au changement du `<span>` qui contient sa valeur.

\
Maintenant que les présentations sont faites, et plutôt que de continuer à paraphraser l'excellente conférence de Rich Harris, je vais vous détailler mon expérience avec Svelte.


<div style="text-align: center;">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/AdNJ3fydeao" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display: block; margin: auto;"></iframe>
    <i>Mais allez voir cette conférence dès que vous avez un peu de temps, elle est vraiment passionnante !</i>
</div>

# Retour d’expérience

J’ai découvert l'existence de Svelte en mission chez Radio France, quand il a fallu réfléchir à une refonte technique complète du site de France Bleu. Il s'agissait d'un site assez vieux en Symfony 2.8, dont nous avions commencé à transformer quelques composants en React pour tenter d’en réduire la dette technique petit à petit. Une autre équipe avait déjà fait une étude comparative de Vue, React et Svelte pour un autre projet, et avait finalement opté pour ce dernier. Plutôt étonnée de ce choix, alors que React nous semblait être l’évidence, notre équipe a décidé de se lancer dans une petite preuve de concept, afin de déterminer si toutes les fonctionnalités actuelles du site étaient réalisables avec Svelte, mais aussi, à quel coût, puisqu’aucun développeur de l’équipe n’avait encore travaillé avec cet outil.

Tout en parcourant [le très bon tutoriel](https://svelte.dev/tutorial/basics) que propose le site, nous avons listé les points incontournables de cette refonte.

Sans être exhaustif, nous avions besoin d’un rendu en [AMP](https://amp.dev/) de nos pages, d’une gestion précise de notre cache (chaque article ayant une durée de cache différente dépendant de sa date de publication), d’une découpe intelligente de nos styles et composant permettant une [approche atomique du design](https://www.google.com/search?q=atomic+design), et bien sûr d’un rendu des pages côté serveur, la grande majorité du trafic provenant des moteurs de recherche.


## Rendu côté serveur

Le plus simple aura été la gestion du rendu des pages côté serveur, puisque que Svelte a un projet "compagnon" qui y est dédié : [Sapper](https://sapper.svelte.dev/). Pour résumer, Sapper est à Svelte ce que Next est à React. Sapper est d’ailleurs très proche de Next en termes de structure, avec par exemple un dossier `routes` donc chaque nom de sous-dossiers/fichiers permettent de définir une arborescence de routes.


## Styles

À peine plus compliqué, nous avons vu que Svelte permettait l’utilisation de Sass pour le style. Nous avions l’habitude de travailler avec styled-components, qui autorisait une gestion très fine des styles, possiblement très liée au Javascript et à l’état de l’application.

Svelte préfixe les déclarations CSS de chaque composant avec un identifiant qui lui est propre, ainsi chaque style a sa portée et ne peut fuiter vers d’autres composants.

Il a fallu un léger changement d’état d’esprit pour se forcer à mieux séparer les responsabilités de style et de markup. Au bout du compte, cette meilleure séparation a augmenté la lisibilité du code de chaque composant.


## Gestion du cache

Pour la gestion des caches, Sapper ne nous permettait pas directement de définir un cache calculé spécifiquement pour chaque article. Pour faire simple, au moment où nous allions chercher le contenu et sa date de publication via nos API, il était trop tard pour définir les entêtes de la réponse. Nous avons donc mis en place un nouveau middleware sur [le serveur fourni par le template de Sapper](https://github.com/sveltejs/sapper-template/blob/master/src/server.js), en amont du middleware de Sapper.

Ce middleware aurait pour unique responsabilité de détecter si une page est un article, et de lui définir une durée de cache dépendant de sa date de publication le cas échéant.

Le problème était que Sapper gérait déjà la correspondance entre les URLs demandées et les pages associées, comment détecter simplement qu’une URL demandée était un article sans avoir à exclure manuellement toutes les URLs qui correspondaient à d’autres types de pages, et donc créer de la redondance avec la structure du dossier `routes` ?

Après quelques recherches dans le code de Sapper, nous avons trouvé qu’il serait possible de nous interfacer avec l’objet `manifest`, exposé par `'@sapper/internal/manifest-server'`.

Voilà donc une version très simplifiée du code de ce middleware :


```js
import { manifest } from '@sapper/internal/manifest-server'
import axios from 'axios'

export async function articleMiddleware(req, res, next) {
 // On va chercher le fichier Svelte qui devrait correspondre à l'url demandée
 const page = manifest.pages.find(p => p.pattern.test(req.path))
 const svelteFileName = page.parts[0].file

 // Si ce n'est pas un chemin correspondant à un article, on donne la main au middleware principal de Sapper
 if (svelteFileName !== '[...path].svelte') return next()

 // On fait la requête pour aller chercher les données de l'article
 const articleData = await axios.get(`http://localhost:${process.env.PORT}/api/path?value=${req.path}`)
 // On calcule le cache en fonction de la donnée reçue
 const articleCache = getArticleCache(articleData.publishedDate)
  // On définit la durée du cache dans les entêtes
 res.setHeader('Cache-Control', `max-age=${articleCache}`)

 // On conserve les données de l'article pour éviter d'avoir à refaire cette même requête plus tard
 req.articleData = articleData

 next()
}
```



## Pages AMP

Ce qui nous a vraiment donné du fil à retordre, c’est la gestion des pages AMP. Sapper utilise un fichier `template.html` comme base pour toutes les pages rendues, avec quelques espaces réservés respectivement aux balises meta, styles, scripts et corps de la page. Seulement, les pages AMP ont [des problématiques qui leurs sont propres](https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/?format=websites#required-mark-up), on ne peut par exemple pas utiliser des feuilles de style externe, il y a des limitations sur l’utilisation du JS qui nous ont fait choisir de ne pas mettre d’interactions sur ces pages, il faut modifier les attributs de la balise HTML … Rien qui ne soit permis par Sapper à l’heure actuelle, il existe bien une [question ouverte](https://github.com/sveltejs/sapper/issues/1008) sur le dépôt de Sapper, mais aucun exemple fonctionnel. Il a donc fallu bricoler une solution de contournement.

L’idée principale était de copier le code du middleware de Sapper dans un nouveau middleware personnalisé, en indiquant cette fois un nouveau fichier de template : `amp_template.html`, puis faire les ajustements nécessaires pour concaténer tous les styles, les insérer directement dans la page, et empêcher la création de balises script.

C’est donc une solution qui fonctionne, mais assez peu satisfaisante puisque l’on duplique du code déjà présent dans le framework. J’ai tout de même proposé notre solution [ici](https://github.com/sveltejs/sapper/issues/1008#issuecomment-751300133). Le point positif étant que nous avons reçu une réponse de la part d’un des contributeurs de Sapper nous disant que que les pages AMP seraient supportées dans la prochaine version majeure de Sapper !

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2021-02-22-a-la-decouverte-de-svelte/yes.gif" width="300px" style="display: block; margin: auto;" alt="phoque yeah"/>
</div>

En fait il parle plus exactement de SvelteKit, car [il n’y aura pas de version 1.0 de Sapper](https://youtu.be/qSfdtmcZ4d0?t=76). En effet, plutôt que de proposer deux templates de projets (un pour Svelte, l’autre pour Sapper), l’équipe de Svelte souhaite offrir une solution unique qui permette de tout faire. On a encore assez peu de détails sur SvelteKit, mais l’équipe qui travaille dessus a montré la volonté de fournir un processus de migration d’un projet Sapper vers SvelteKit aussi indolore que possible.


<div>
    <img src="{{ site.baseurl }}/assets/2021-02-22-a-la-decouverte-de-svelte/soulagement.gif" width="300px" alt="soulagement" style="display: block; margin: auto;"/>
</div>



## Conclusion

Suite à cette preuve de concept, nous avons comme nos collègues choisi Svelte et Sapper pour la refonte technique de France Bleu. Le gain de performances, notamment en terme de temps avant interaction, étaient trop importantes pour être négligées. C’est un framework vraiment très accessible pour qui connaît les bases du développement web, alors que React nécessite souvent en plus un bagage assez solide en Javascript.

Le framework, parce qu’il est aussi un compilateur, offre plein de fonctionnalités, comme un système natif d’animations, de transitions, de stores, et ne se fixe qu’assez peu de limite de ce côté puisque ne sera compilé et envoyé au client que le code strictement nécessaire.

Il donne vraiment la sensation d’utiliser la plateforme web telle qu’elle a été pensée, la réactivité en plus.

Pour cette refonte, nous gardons un objectif de performance (mesurée grâce à Lighthouse, et qui reste au beau fixe !) et d'expérience développeur. L’outillage est déjà très fourni, au moins pour VSCode et IntelliJ. Nous sommes aussi en train d’intégrer TypeScript, qui est nativement supporté depuis peu. La productivité de l’équipe semble meilleure qu’avec React, et le code est aussi beaucoup moins verbeux. 

Une chose est sûre, c’est que j’utiliserai Svelte (et Sapper si besoin) pour mes prochains projets persos, c’était vraiment ma bonne découverte de l’année 2020 en développement web.


## Ressources utiles



*   [Svelte Crash Course](https://dev.to/methodcoder/svelte-crash-course-with-pics-27cc), un excellent article en anglais qui permet de voir en 10 points et en quelques minutes, les principaux concepts de Svelte
*   [Le tutoriel de Svelte](https://svelte.dev/tutorial/basics), très bien fait, sous forme de petits exercices qui permettent d’acquérir pas à pas chaque concept.
*   [La FAQ du Svelte Society Day 2020](https://www.youtube.com/watch?v=luM5uobewhA), qui évoque à la fin la notion de maximum local, en quoi elle pourrait s’appliquer au développement web, et en quoi Svelte pourrait être une piste pour s’en sortir. Mais aussi à quels autres domaines cette notion pourrait également s’appliquer.

    *(sifflote 
<img src="{{ site.baseurl }}/assets/2021-02-22-a-la-decouverte-de-svelte/Marx.png" width="45px" alt="Marx"/>
)*
*   [Svelte REPL](https://svelte.dev/repl/hello-world?version=3.32.3), un outil très pratique qui permet de développer avec Svelte directement dans son navigateur, de créer un projet, de voir le code compilé, et plein d'autres fonctionnalités très pratiques.
*   [The return of Write Less, Do More](https://www.youtube.com/watch?v=BzX4aTRPzno), une autre conférence (et très drôle) de Rich Harris, qui explique l'état d'esprit qu'il y a derrière la conception de Svelte.
*   [La conférence d'Alexis Jacomy au DevFest Nantes 2019](https://www.youtube.com/watch?v=FY0VkYFZb3k), qui rentre un peu dans les détails de la compilation avec Svelte. Très intéressant même si je suis pas totalement d'accord avec sa conclusion.
*   [Le podcast Svelte Radio](https://www.svelteradio.com/), un format hebdomadaire qui permet de se tenir informé de ce qui se passe dans cet écosystème, pour ceux qui consomment ce genre de format.
*   [L’équivalent d’une awesome-list](https://svelte-community.netlify.app/code), maintenue par la communauté, et plus généralement [ce site](https://svelte-community.netlify.app/), qui contient tout un tas d’autres ressources utiles.
*   [L’extension pour VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
