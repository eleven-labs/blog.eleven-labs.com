--- layout: post title: Les dotCSS 2015, c'était bien. author: mcadoux
date: '2015-12-14 09:00:20 +0100' date\_gmt: '2015-12-14 08:00:20 +0100'
categories: - Javascript tags: - dotcss --- {% raw %}

C'est en plein coeur du 2e arrondissement de Paris, dans ce monument
historique légèrement cossu qu'est le Théâtre des Variétés, que s'est
déroulée la deuxième édition de dotCSS le 4 décembre dernier. Ce
jour-là, mon compère Elevenien Thibaut et moi-même avons délesté nos
clients bien-aimés de notre présence pour nous y rendre, et écouter ce
que quelques grands acteurs de la scène CSS voulaient partager avec nous
en cette fin d'année. Et pour être franc, c'était très instructif.

https://twitter.com/glazou/status/672756354608664576

Un peu de contexte
==================

Avant de détailler chaque conférence, petite introduction pour ceux qui
ne connaissent pas l'événement.

dotCSS est un événement faisant parti de l'initiative dotConferences,
une série de conférences qui vise à proposer des présentations de haute
volée en lien avec des technologies ou des sujets particuliers. On en
recense six aujourd'hui, dont les dotJS qui se sont déroulés lundi
dernier, mais aussi les dotGo, et bientôt les dotScale. Ces
rassemblements ont lieu exclusivement à Paris, mais attirent néanmoins
une audience venue en large partie de l'étranger. Pour toucher le plus
large public possible, les présentations se font donc exclusivement en
anglais, alors mieux vaut avoir été attentif pendant ses cours de
langue pour bien suivre le discours des orateurs.

D'autant plus que cette année, c'est un savoureux gratin qui est venu
nous honorer de son temps, composé notamment du Co-président du CSS
Working Group, Alan Stearns, ainsi que de son prédécesseur Daniel
Glazman. Daniel Eden était également présent pour nous parler de son
expérience chez Dropbox, et Andrey Sitnik a fait tout le chemin
depuis Moscou pour venir nous parler de PostCSS. Bref, ça valait le coup
d'y être. Mais si vous n'avez pas pu, ce petit billet est là pour
résumer un peu ce qu'on a retenu.

Les présentations en résumé
===========================

The New CSS Layout, par [Rachel Andrew](https://twitter.com/rachelandrew)
-------------------------------------------------------------------------

https://twitter.com/dotCSS/status/672760704781393920

Rachel Andrew est la co-fondatrice de Perch CMS, [un CMS avec des
poussins](https://grabaperch.com). Dans cette présentation riche en
démonstrations, Rachel a fait un point sur les trois dernières
innovations majeures pour la création de mises en pages flexibles et
responsives en CSS : [CSS Grid Layout](http://www.w3.org/TR/css-grid-1/)
et [Flexbox](http://www.w3.org/TR/css-flexbox-1/), qui sont les deux
plus récents modèles de mise en page, ainsi que le [Box Alignment Level
3](http://www.w3.org/TR/css-align-3/), qui définit les règles
d'alignement des éléments.

Concernant Flexbox et Grid, Rachel rappelle ce qui caractérise ces modes
de mises en page : une "conscience" particulière des éléments les uns
par rapport aux autres, une séparation potentielle entre l'ordre de
déclaration des éléments et leur ordre d'affichage, un contrôle sur la
direction d'alignement des éléments, ainsi que sur les proportions des
éléments les uns par rapport aux autres. Si vous avez déjà eu l'occasion
de vous amuser avec Flexbox, vous savez à quel point ces
caractéristiques sont bénies, mais comme le disait oncle Ben, un grand
pouvoir implique de grandes responsabilités, et pouvoir manipuler
l'ordre de ses éléments en CSS ne doit pas dispenser de conserver un
ordre sémantique correct dans votre HTML. De même, pas question de
perdre la tête et s'amuser à transformer tous ses éléments en flex ou
grid. La notion de *Separation of Concerns *reste d'actualité*.*

Les amateurs de Flexbox connaissent aussi les règles du Box Alignment.
Pour les autres, sachez qu'il existe aujourd'hui des propriétés CSS pour
aligner des éléments les uns par rapport aux autres de façon souple : à
gauche, à droite et au centre bien sûr, mais aussi avec un espace
équivalent autour ou entre eux, horizontalement comme verticalement. Oui
oui, *verticalement.* Non non, y a pas de quoi.

En terme de support, si vous ne supportez plus IE9-, faites-vous plaisir
: [Flex est bien implémenté partout
ailleurs](http://caniuse.com/#feat=flexbox). De plus, Microsoft est sur
le point de mettre fin au support de IE10-, donc vous devriez même
pouvoir dire adieu aux anciennes syntaxes très bientôt. Du côté de Grid,
c'est le constat inverse : [seuls IE10+ et Edge ont un support partiel
par défaut au jour
d'aujourd'hui.](http://caniuse.com/#feat=css-grid) Vous pouvez donc
commencer à vous exercer, mais vous devrez patienter encore au moins une
bonne année avant de pouvoir vous en servir en production.

Vous pouvez retrouver les diapos ainsi que tous les exemples de la
présentation sur [le site de Rachel
Andrew](https://rachelandrew.co.uk/presentations/modern-css-layout?utm_content=bufferd2221&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer).

Fix Global CSS with PostCSS, par [Andrey Sitnik](https://twitter.com/andreysitnik)
----------------------------------------------------------------------------------

https://twitter.com/andreysitnik/status/672768576466649088

Développer front-end dans [une société russe avec un nom très
cool](https://evilmartians.com), Andrey Sitnik, auteur du très apprécié
[Autoprefixer](https://github.com/postcss/autoprefixer), est venu nous
parler de [PostCSS](https://github.com/postcss), une autre de ses
créations.

Comme son nom l'indique plutôt bien, PostCSS est un post-processeur, et
s'inscrit donc dans une démarche différente de celle des
pré-processeurs. Si, avec Sass et Less, on travaille sur des feuilles de
style dans un format spécifique qui sera ensuite compilé en CSS, postCSS
traite quant à lui directement des feuilles CSS en vue de les améliorer.
De quelles façons ? Tout dépend des plugins que vous souhaitez utiliser,
sachant qu'il en existe déjà un petit paquet et de toutes sortes
différentes : linting, autoprefixing, optimisations diverses... De quoi
automatiser pas mal de tâches rébarbatives et optimiser son workflow,
*baby* !

Dans sa présentation, Andrey explique en quoi PostCSS peut être utilisé
pour rendre son CSS plus maintenable avec une bonne séparation de ses
styles, notamment pour éviter les pièges du CSS Global, c'est-à-dire
tout ce qui, dans notre CSS, va s'appliquer à l'ensemble de notre appli
et causer des problèmes de cascade et de maintenabilité : sélecteurs
globaux, resets, héritage, etc. Il présente pour cela des plugins qui
permettent d'organiser son interface en module, de réorganiser ses
sélecteurs et ses propriétés, et de créer des media-queries qui
s'appliquent à des composants plutôt qu'à des pages entières.

Si vous voulez en savoir plus, je vous conseille vivement de jeter un
oeil à ses diapos de présentation sur [son
GitHub](http://ai.github.io/postcss-isolation/).

(S)CSS at Dropbox, par [Daniel Eden](https://twitter.com/_dte)
--------------------------------------------------------------

https://twitter.com/\_dte/status/672736555472154624

Daniel Eden est *Design engineer* chez Dropbox. Un poste au nom plutôt
classe, mais surtout à la responsabilité très importante comme il nous
l'a expliqué dans un retour d'expérience particulièrement intéressant.

À son arrivée chez Dropbox, Daniel s'est retrouvé confronté à une
architecture CSS particulièrement infâme, avec des centaines de
sélecteurs trop longs, de déclarations trop spécifiques, de propriétés
dupliquées... Il explique que la raison simple pour laquelle un code
aussi trash a pu voir le jour est que trop de personnes mettaient
la main dedans, trop souvent, et sans forcément bien connaître et aimer
le langage. Il en vient ainsi au constat qu'il est trop facile d'écrire
du CSS pour écraser celui de son prédécesseur en écrivant par-dessus,
menant à un cauchemar de cascades et de spécificités susceptibles de
créer des effets de bords à la moindre modification.

Pour changer ces mauvaises habitudes, Daniel a mis en place des linters
pour vérifier la qualité du code, ainsi que des *blocking reviews* pour
refuser du CSS jugé non-conforme. Il utilise également des outils de
stats pour quantifier le CSS comme
[CSSStats](https://github.com/cssstats/cssstats),
[Cloc](http://cloc.sourceforge.net) et
[Parker](https://github.com/katiefenn/parker). Faire accepter ces
nouveaux processus implique de bien expliquer leur intérêt aux
développeurs pour les sensibiliser.

Je n'ai pas réussi à mettre la main sur les diapos de cette
présentation, mais je les ajouterai si j'y parviens.

Editing photos with CSS, par [Una Kravets](https://twitter.com/Una)
-------------------------------------------------------------------

https://twitter.com/dotCSS/status/672784779922788352

Retour vers des démonstrations plus concrètes avec la présentation d'Una
Kravets, développeur front-end et designer chez IBM Bluemix, qui nous a
montré comment on peut utiliser CSS aujourd'hui pour modifier des images
de toutes sortes de façons différentes. Elle évoque pour cela trois
méthodes : les *filters*, les *gradients*, et *blend-mode*.

Les [CSS
filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
proposent toute une collection de propriétés pour altérer une image :
grayscale (niveau de gris), blur (flou), hue (teinte), brightness
(luminosité), contrast (hmmm...) et plein d'autres. Leur support n'est
pas encore autant au point que celui des SVG, et on ne peut qu'espérer
que la situation évolue rapidement. Les [CSS
gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)
permettent de définir des dégradés comme une valeur de fond en CSS. On
peut en faire des linéaires et des circulaires, et contrôler les
différentes étapes de transition entre chaque couleur.

Enfin, une partie importante de la présentation était dédiée à
[blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode),
une propriété qui permet de définir comment les parties superposées de
deux images doivent s'afficher. Comme c'est un sujet avec un jargon
particulier que je ne maîtrise pas aussi bien qu'Una, je vous invite à
jeter à son site [\#artTheWeb](http://arttheweb.com), qui compile pas
mal de démos agrémentées d'explications techniques.

Becoming responsible for CSS, par [Alan Stearns](https://twitter.com/alanstearns)
---------------------------------------------------------------------------------

https://twitter.com/alanstearns/status/673124776181911552

Grand manitou du CSS chez Adobe - c'est pas moi qui le dit, [c'est
lui](https://twitter.com/alanstearns), Alan Stearns est devenu en juin
dernier rien de moins que Co-président du CSS Working Group. Et comme il
l'explique non sans une pointe de malice, cela signifie que l'avenir du
CSS, de tout un langage et du standard qui se trouve derrière, est entre
ses mains expertes.

Mais ce que nous dit Alan, c'est qu'en réalité, le CSS est entre les
mains de tous ceux qui l'utilisent au quotidien et veulent le voir
évoluer. Pour que le langage progresse, il nous incite à nous exprimer,
à participer à des groupes de discussions sur des fonctionnalités
désirées, et à ouvrir des tickets de bugs sur les sites appropriés avec
des [tests W3C](https://github.com/w3c/csswg-test).

Il a également évoqué un nouveau groupe de travail qui a émergé cette
année, baptisé [Houdini](https://wiki.css-houdini.org), et qui vise
à définir de nouvelles APIs bas niveau de style et de mise en forme pour
faciliter l'implémentation de nouvelles spécifications via JavaScript.
Alan et d'autres membres du W3C espèrent ainsi qu'à
terme, l'implémentation de nouvelles propriétés dans le navigateur sera
accélérée, pour ne plus être victimes de leur lente standardisation.

Transform alchemy, par [Tom Giannattasio](https://twitter.com/attasi)
---------------------------------------------------------------------

https://twitter.com/dotCSS/status/672807657439404032

Fondateur de [Macaw](http://macaw.co), une solution à destination des
designers qui génère du code HTML et CSS à partir d'un design graphique,
Tom Giannattasio nous a montré ce qu'il était possible de faire
aujourd'hui en matière de 3D rien qu'avec la magie du CSS.

Avec la propriété *transform*, on peut ajuster des valeurs de rotation
et de translation sur trois axes sur des éléments HTML. En animant les
transitions entre ces valeurs, on peut obtenir des effets 3D plus
fluides qu'en animant n'importe quelle autre propriété (outre l'opacité)
puisque le navigateur se contente de compositer différemment
l'élément plutôt que de le repeindre à chaque image. Pour illustrer
cela, Tom a reproduit [l'effet de parallaxe des blocs de l'interface
de tvOS](http://codepen.io/thomasxiii/pen/MaByJa), l'OS de la dernière
Apple TV. Le résultat est fluide, classe, et il y a du Breaking Bad
dedans.

Tom précise tout de même que dès lors qu'il s'agit de faire des choses
plus complexes à une échelle plus large, WebGL est une solution plus
adaptée que CSS. C'est sans doute vrai, mais c'est toujours amusant de
voir [jusqu'où les gens sont capables de pousser le
langage](http://www.keithclark.co.uk/labs/css-fps/desktop/).

The expanding boundaries of CSS, par [Chris Eppstein](https://twitter.com/chriseppstein)
----------------------------------------------------------------------------------------

https://twitter.com/dotCSS/status/672813085892198400

C'est le co-créateur de Sass lui-même, Chris Eppstein, qui est venu
délivrer une réflexion très intéressante sur la perception que les gens
ont du CSS d'une façon générale, et en quoi cela influe sur son
évolution.

Pour cela, il évoque d'abord la philosophie originelle derrière le
langage, qui prétend que le CSS doit rester aussi simple que possible
pour correspondre à un public bien déterminé qui ne sais pas
nécessairement programmer. Mais Tom argumente contre cette notion selon
laquelle programmer devrait être complexe et difficile, et écrire du CSS
devrait être simple et facile. Le langage s'est considérablement enrichi
en propriétés, sélecteurs et autres possibilités en vingt ans, et
rédiger et organiser des feuilles de style de qualité, maintenables et
efficaces demande de l'expertise. Dire que le CSS est un langage facile
est erroné, et cette idée freine la croissance du langage.

Le succès massif des pré-processeurs tels que Sass et Less prouve que
les développeurs CSS sont prêts à accueillir plus de possibilités et de
complexité dans le langage. Variables, mixins, héritage... Toutes ces
notions ajoutent une richesse supplémentaire à CSS qui facilite le
travail des développeurs. Tom évoque également Houdini, et la vocation
de ce groupe à étendre les possibilités offertes par les outils natifs
du Web, à rendre ce dernier plus compréhensible et son développement
plus rapide et efficace.

Pushing CSS to new frontiers, par [Daniel Glazman](https://twitter.com/glazou)
------------------------------------------------------------------------------

https://twitter.com/dotCSS/status/672820792481198084

En point final de cette journée, c'est l'ex Co-président du CSS Working
Group, Daniel Glazman, qui est monté sur scène pour une présentation un
tantinet coup-de-gueule, et qui fait écho à la précédente.

Daniel dénonce en effet les limitations dramatiques du CSS Object Model
et la pauvreté des APIs qu'il définit. De plus, à l'instar de Chris
Eppstein, il explique que CSS devrait déjà permettre nativement tout ce
que permettent les pré-processeurs comme les variables et les
imbrications de sélecteurs. Surtout, il pense que le CSS pourrait servir
à bien plus qu'à définir des styles, et que la syntaxe des sélecteurs
pourrait être utilisée pour des usages plus variés. En bref, CSS est
comme une boîte noire inaccessible qui a besoin de s'ouvrir et se
développer.

En conclusion
=============

Si je me suis bien débrouillé, vous avez dû remarquer que les sujets
évoqués étaient relativement variés, s'attardant tantôt sur des
applications concrètes et emballantes de propriétés CSS émergentes,
tantôt sur des notions plus abstraites qui nous invitent à réfléchir sur
ce que nous attendons de ce langage avec lequel nous travaillons tous
les jours. C'est de là que vient le vrai succès de cette journée pour
moi : une alternance de sujets variés et intéressants portés par
des présentations solides et démonstratives.

Ca, et puis les pauses buffet.

https://twitter.com/dotCSS/status/672797455692529664

Les photos officielles de l'événement sont disponibles sur [le Flickr de
dotConferences](https://www.flickr.com/photos/97226415@N08/sets/72157662173518555).
Quant aux vidéos, elles devraient être en ligne d'ici quelques jours.

{% endraw %}
