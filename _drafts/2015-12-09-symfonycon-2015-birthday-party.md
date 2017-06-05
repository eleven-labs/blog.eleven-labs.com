--- layout: post title: 'SymfonyCon 2015 : THE Birthday Party' author:
sofany date: '2015-12-09 18:21:32 +0100' date\_gmt: '2015-12-09 17:21:32
+0100' categories: - Symfony tags: - doctrine - symfony - form -
conférence - guard - sécurité - symfony con - routing --- {% raw %}

![](http://pariscon2015.symfony.com/bundles/sensiosymfonylive/images/pariscon2015/assets/header.jpg){.alignnone
width="916" height="289"}

[Pour la troisième édition de la SymfonyCon (conférence internationale
sur Symfony), SensioLabs a fait les choses en grand aux Folies Bergère à
Paris, la ville natale de Symfony. Les conférences ont eu lieu pendant
deux jours en deux tracks.]{style="font-weight: 400;"}

------------------------------------------------------------------------

 

### 1ère journée pleine d’émotions

[L’ouverture des conférences débute par le discours
de [@[fabpot]{.u-linkComplex-target}](https://twitter.com/fabpot){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav}, qui va retracer le chemin parcouru depuis la
première version du framework jusqu'à la sortie très récente de Symfony
3. En effet, le projet a 10 ans, 10 ans de commits, PRs, merges, tags,
releases… mais également une communauté unie pour l’amour de
Symfony.]{style="font-weight: 400;"}

https://twitter.com/piaf\_/status/672343739986272256

#### Dig in Security with Symfony

[La première présentation commence
avec [@[Saro0h]{.u-linkComplex-target}](https://twitter.com/Saro0h){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} qui vient à la rescousse des plus fébriles sur
la sécurité pour démystifier un des composants les plus craints et
redoutés. Les principes d'authentification et d’autorisation sont clairs
et très bien expliqués. Les points les plus intéressants à retenir sont
la suppression des ACL, le nouveau composant LDAP et surtout le
[teasing](#conf-guard-authentication) sur le composant Guard
Authentication. Tout cela est disponible depuis la version
2.8. [Retrouvez les slides
ici.](https://speakerdeck.com/saro0h/symfonycon-paris-dig-in-security)]{style="font-weight: 400;"}

#### The Twelve-Factor App

La présentation commence avec une jolie métaphore sur "le pont" qui
représente le chemin parcouru depuis les déploiements en FTP jusqu'au
simple "git push heroku". La seconde partie présente le manifeste "The
Twelve-Factor App" écrit par Heroku et présenté
par [@[dzuelke]{.u-linkComplex-target}](https://twitter.com/dzuelke){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} qui explique un plan d'action pour résoudre les
problèmes couramment rencontrés lors de déploiement et de maintenabilité
d'un projet.

#### Symfony routing under the hood

Après l'exploration du composant de
sécurité, [@[dbu]{.u-linkComplex-target}](https://twitter.com/dbu){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} nous plonge dans celui du Routing. La
présentation montre une vue d'ensemble sur le mécanisme du composant,
des conseils toujours bons à prendre et des cas pratiques d'utilisation
de Bundles liés au Routing. [Retrouvez les slides
ici.](http://davidbu.ch/slides/2015-12-03-symfony-routing.html#1)

#### Doctrine 2: To Use or Not to Use

[@[beberlei]{.u-linkComplex-target}](https://twitter.com/beberlei){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} présente Doctrine d'un point de
vue honnête avec de bons conseils sur son utilisation et également dans
quels cas l'éviter ou le contourner :

> Choosing Doctrine does not require you to go all in

En effet, Doctrine est très bon pour faire du CRUD, gère assez bien les
associations, le lazy loading… cependant n’est pas fait pour de
l’analytique ni pour de la statistique. [Retrouvez les slides
ici.](https://qafoo.com/talks/15_12_symfonycon_paris_doctrine2_to_use_or_not_to_use.pdf)

#### La tête dans les nuages avec des astronautes !

Après l'effort, le réconfort ! SensioLabs a organisé une super soirée
sur le thème du jeu... Wilson a relevé le défi !

https://twitter.com/Eleven\_Labs/status/672501912726544384

------------------------------------------------------------------------

 

### 2ème journée plus technique

#### Guard Authentication {#conf-guard-authentication}

[Le choc de la simplification on
l'attendait, [@[weaverryan]{.u-linkComplex-target}](https://twitter.com/weaverryan){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} l'a fait. Désormais, on peut gérer
l'authentification avec seulement un fichier. Les différents cas
d'utilisation les plus communs sont montrés avec une simplicité
déconcertante. Il ne reste plus qu'à l'essayer puis
l'adopter. ]{.s1}[Retrouvez les slides
ici.](http://fr.slideshare.net/weaverryan/guard-authentication-powerful-beautiful-security)

#### Matters of State

[@[kriswallsmith]{.u-linkComplex-target}](https://twitter.com/kriswallsmith){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} nous présente comment dans un future proche (il
planche actuellement sur cette feature) dispatcher nos événements de
manière plus simple et ainsi créer une application plus maintenable et
testable. [Retrouvez les slides
ici.](http://fr.slideshare.net/kriswallsmith/matters-of-state-55843873)

https://twitter.com/andreiabohner/status/672725735283535872

 

#### \$letsPlay = new GameShow()

Un petit moment de répit
avec [@[jmikola]{.u-linkComplex-target}](https://twitter.com/jmikola){.ProfileHeaderCard-screennameLink
.u-linkComplex
.js-nav} et [@[weaverryan]{.u-linkComplex-target}](https://twitter.com/weaverryan){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav}

https://twitter.com/symfonycon/status/672757482847096832

#### New Symfony Tips and Tricks

[@[javiereguiluz]{.u-linkComplex-target}](https://twitter.com/javiereguiluz){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} nous fait découvrir des astuces sur Symfony et
son écosystème, collectées auprès de la communauté. Ces petites pépites
souvent très peu documentées nous permettent d’améliorer grandement
notre quotidien. A lire sans modération : [retrouvez les slides
ici.](http://fr.slideshare.net/javier.eguiluz/new-symfony-tips-tricks-symfonycon-paris-2015)

#### Symfony2 Form: Do’s and Don’ts

Sur la même
lancée, [@[webmozart]{.u-linkComplex-target}](https://twitter.com/webmozart){.ProfileHeaderCard-screennameLink
.u-linkComplex .js-nav} nous présente les nouveautés et quelques
features méconnues sur les composants Form et Validation. On retrouve
également ses conseils et bonnes pratiques à utiliser. [Retrouvez les
slides
ici.](https://speakerdeck.com/webmozart/symfony2-forms-dos-and-donts)

------------------------------------------------------------------------

 

### Conclusion de ces deux jours

L'ambiance était au rendez-vous, les lieux également cependant, petit
bémol pour l'accès à la deuxième salle le premier jour. [Pour la
première journée, les présentations étaient un peu light techniquement,
c'était surtout un balayage de Symfony plus ou moins approfondi qui
s'adressait aux plus novices. La deuxième journée se rattrape avec des
conférences plus techniques, offrant des conseils intéressants et des
nouveautés qui donnent envie d'aller plus
loin.]{style="font-weight: 400;"}

 

### Bonus

https://twitter.com/Eleven\_Labs/status/672775123116625920

{% endraw %}
