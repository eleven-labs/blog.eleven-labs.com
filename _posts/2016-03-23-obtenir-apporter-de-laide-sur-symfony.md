---
layout: post
title: Obtenir et apporter de l'aide sur Symfony
authors: 
    - aandre
date: '2016-03-23 16:56:43 +0100'
date_gmt: '2016-03-23 15:56:43 +0100'
permalink: /fr/obtenir-apporter-de-laide-sur-symfony/
categories:
    - Symfony
tags:
    - symfony
    - irc
    - stackoverflow
    - opensource
---
Aujourd'hui, je vous propose un article -qui s'adresse plutôt aux débutants- sur les mécaniques pour obtenir et apporter de l’aide sur Symfony. Une grande partie des informations sont applicables à n'importe quel framework ou librairie.

# Recherche Google

Toute bonne recherche d’informations commence par une recherche en anglais sur Google. Et quand je parle de ça, je ne parle pas d’une recherche en français sur Lycos, ou d’une recherche en chinois sur Bing, je parle d’une recherche **en anglais sur Google**. Rechercher dans une langue qui n’est pas l’anglais, sur un moteur de recherche exotique, c’est se fermer des milliers de portes quant aux opportunités de résultats.

Aucune excuse n’est à trouver, les recherches tout comme le code se font en anglais. Symfony comme de nombreux projets Open Source regroupent de nombreuses nationalités tant dans leur développeurs, la communauté proche, que nous autres utilisateurs de Symfony 2. Le standard, c’est l’anglais. Et de surcroît, sur Google, c’est primordial, leur système d’indexation et algos ne sont plus à prouver, que ce soit à court, moyen ou long terme. En d’autres termes “Google, English, Deal with it”.

[![dealwithit](http://blog.eleven-labs.com/wp-content/uploads/2016/03/dealwithit.gif)](http://blog.eleven-labs.com/wp-content/uploads/2016/03/dealwithit.gif)

Je ne peux que retourner le couteau dans la plaie pour ceux qui n’utilisent pas cette méthode en citant les différents intervenants de Symfony.

*   Fabien Potencier : créateur de Symfony (français)
*   Javier Eguiluz : mainteneur Symfony (espagnol)
*   Bernhard Schussek : important contributeur sf2 (autrichien)
*   Christophe Coevoet : important contributeur sf2 (français)
*   Jordi Boggiano : lead dev Composer (suisse)
*   Sebastian Bergmann : lead dev PHPUnit (allemand)
*   j’en passe…

Sans langue commune, les projets ne seraient pas ce qu’ils sont ! Qui sait, bientôt peut-être serez-vous porteur d’un projet à vocation internationale, ne négligez donc pas votre anglais, ni la portée de celui-ci sur vos recherches. À noter par ailleurs que les traductions de la documentation Symfony dans d'autres langues que l'anglais ne sont officiellement plus supportées depuis [octobre 2015](http://symfony.com/blog/discontinuing-the-symfony-community-translations).

# La documentation officielle

Pour ma part, quand mes recherches sont assez simples, je tombe bien souvent sur la même chose : la documentation de Symfony. Les faits sont là, les documentations encadrant Symfony 2 sont relativement complètes, à jour, couvrent de nombreux sujets et son généralement assez bien faites. Pour des oublis typiques, c’est souvent le point qui suit la recherche Google. J’ai en favoris les différents types de form Symfony 2 existants, ainsi que le basic-mapping doctrine, chose que je ne tiens pas à connaître par coeur, et pourtant parmi les choses que j’utilise très souvent. Notez par ailleurs, que la documentation officielle de Symfony est versionnée, ça peut paraître anodin, mais ça vous évitera peut-être 15mn de debug sur une doc qui ne correspond pas à la version de Symfony que vous utilisez :)

La documentation répond donc à de nombreuses questions, il suffit de se donner les moyens de chercher. Outre cette doc, de nombreuses news Sf2 concernant les changelogs entre versions sont très intéressants à lire (j’ai en tête la news concernant le changement du security component, avec [la nouvelle implémentation des voters](http://symfony.com/blog/new-in-symfony-2-6-simpler-security-voters)).

# Le cas de StackOverflow

Parmis les recherches Google, c’est sûrement le lien qui revient le plus souvent, peu importe la technicité de la question. Et pour cause, StackOverflow est leader en terme de questionnement informatique quel qu’il soit, et la communauté est là pour aider. Je tiens néanmoins à mettre en exergue l’importance des votes sur les réponses. Ces derniers sont souvent gage de qualité, mais il faut établir un ratio rapide des votes, et comprendre l’importance de la solution proposée. En effet, elle peut ne pas répondre à la question à laquelle vous tentiez de répondre parce qu’algorithmiquement différente, ou que sais-je. Vérifiez-bien votre problème avant d’accepter une solution.

En général, les réponses les plus acceptées de la communauté remontent le plus vite en tête, je dois avouer ne pas connaître le fonctionnement de StackOverflow concernant les réponses les plus proches de la question posée, mais il faut parfois se méfier. Dans les cas simples, effectivement une potentielle réponse fait unanimité et suffit. Dans des cas plus complexes, les réponses sont souvent hétérogènes et prendre parti ou accepter une réponse est souvent difficile et laissé à l'appréciation du principal concerné, à savoir l'auteur de la question.

# Parcourir le code

Quand parcourir Google et StackOverflow ne suffit plus, il faut bien aller directement à la source du problème et comprendre le pourquoi du comment. C'est un exercice assez difficile au départ, étant donné la complexité du framework (pas compliqué mais complexe, la nuance est importante).

Un avantage néanmoins, c'est la modularité de Symfony découpé et pensé en composants plus ou moins complexes (Yaml Component est plus simple à assimiler que le Security Component). Vous pouvez donc vous focaliser plus rapidement sur votre problème, et faire abstraction du reste.

En bref, c’est un exercice poussé mais absolument nécessaire pour comprendre les rouages de Symfony.

# IRC

Lorsque même parcourir le code n’a fait que vous rendre fou, ou lorsque vous avez besoin d’une réponse rapide, IRC est souvent oublié, parce qu’IRC il faut l’avouer, ça devient sacrément old-school (je ne sais pas s'il y a un Slack dédié Symfony). Il y a par ailleurs des règles à respecter (don’t ask to ask) et c’est parfois élitiste (quoique la communauté Symfony est plutôt sympa). C’est aussi assez mal vu de se présenter sur un channel IRC, demander de l’aide, et de partir aussi vite, c’est courant, mais c’est malpoli sachez-le. Intéressez-vous si vous en avez la possibilité à la communauté, et aidez si vous le pouvez en retour sur IRC. Il y a aussi l’avantage de l’outil d’échange direct, on est bien loin des formalités d’usage et de la _distance_ que l’on peut retrouver sur les forums.

Pour résumer, vous venez sur IRC pour obtenir de l’aide, mais ne lésinez pas sur l’aide que vous pouvez apporter en retour. L’échange et le partage sont à la base de tous les projets open-source et sont à la portée de tout le monde.

Pour les détails, c'est par ici : [http://symfony.com/irc](http://symfony.com/irc)

# Recevoir c'est bien mais donner c'est mieux

Un bug qui traîne ? Ne négligez jamais votre capacité à comprendre ou ne pas comprendre quelque chose ! On peut tous contribuer, pas uniquement sur symfony, mais sur tout l'écosystème autour (les bundles sont nombreux). Et c’est grâce à cela que la communauté se forme et anticipe des besoins, chacun amenant sa pierre à l’édifice. En bref, c’est comme cela que Symfony (et tout projet open source) avance. Certains se démarquent des autres par leur volonté et leur attachement et finissent core-dev, mais pour les autres (utilisateurs du framework au final), nous soulevons des points qui permettent aux projets d’avancer et d'évoluer.

Symfony propose par ailleurs des Virtual Hacking Days, des jours dédiés à la correction de bug. Certains sont triviaux, d'autres moins, et certains sont [carrément prémachés](https://github.com/symfony/symfony/issues/18088) grâce au travail de Javier Eguiluz. Vous n'avez plus d'excuse :D

Contribuer c'est aussi améliorer la doc ([https://github.com/symfony/symfony-docs/commit/8a0297ffe50c213c50bd4d1ef267765696cc86ad](https://github.com/symfony/symfony-docs/commit/8a0297ffe50c213c50bd4d1ef267765696cc86ad)), c'est aussi faire des articles sur un blog, ou des tutoriels pour partager votre savoir.

# Conclusion

Voilà donc ce qui clos ce petit guide d’obtention d’aide utile lorsque vous êtes bloqués (mais sentez être proche de la solution). J’ai essayé de définir les différentes parties de ce guide en fonction de la difficulté du problème. Chacun travaille à sa propre façon mais la démarche restera plus ou moins la même.