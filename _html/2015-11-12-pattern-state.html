---
layout: post
title: Pattern State
author: nkania
date: '2015-11-12 14:35:21 +0100'
date_gmt: '2015-11-12 13:35:21 +0100'
categories:
- Symfony
tags:
- architecture
- design pattern
---
{% raw %}
<p><strong>- Qu'est-ce que c'est ?</strong></p>
<p>Le design pattern State, ou patron de conception Etat, permet la modification d'un objet en fonction de son statut. Pour faire simple, il vous permet d'exécuter des actions en fonction d'un contexte.</p>
<p>Prenons un exemple. Imaginons que nous voulions mettre en place un système de traitement et de publication de vidéo avec le workflow suivant :</p>
<ul>
<li>Demande de création</li>
<li>Récupération de la vidéo</li>
<li>Encodage + traitements</li>
<li>Envoi sur une plateforme de diffusion</li>
<li>Publication</li>
</ul>
<p>Nous pourrions donc décider de traiter chaque demande unitairement de bout en bout, mais cela nous forcerait à rendre interdépendants les différents traitements et rendrait le code difficile à faire évoluer et à maintenir par la suite.</p>
<p>Ou alors, nous pouvons décider d'utiliser le pattern State afin de gérer ces différentes étapes indépendamment.</p>
<p>&nbsp;</p>
<p><strong>- Comment ça marche ?</strong></p>
<p>Si nous reprenons l'exemple de notre vidéo ci-dessus, nous pouvons donc dégager plusieurs étapes utiles à notre workflow :</p>
<ul>
<li><em>create</em></li>
<li><em>download</em></li>
<li><em>encode</em></li>
<li><em>upload</em></li>
<li><em>publish</em></li>
</ul>
<p>Cependant, ces étapes ne sont que des transitions, rien ne nous permet d'identifier qu'une étape est terminée, ce qui est gênant. Comment savoir que le téléchargement de la vidéo s'est bien déroulé et est terminé pour pouvoir passer à la suite ?</p>
<p>Nous avons donc besoin d'ajouter des statuts :</p>
<ul>
<li><em>new</em></li>
<li><em>creating</em></li>
<li><em>created</em></li>
<li><em>downloading</em></li>
<li><em>downloaded</em></li>
<li><em>encoding</em></li>
<li><em>encoded</em></li>
<li><em>uploading</em></li>
<li><em>uploaded</em></li>
<li><em>publishing</em></li>
<li><em>published</em></li>
</ul>
<p>De cette manière, nous pouvons facilement savoir dans quel état se trouve notre objet à l'instant T.</p>
<p>Dans le pattern State, les étapes n'ont pas conscience des autres. Elles n'ont qu'un but : faire passer notre objet d'un statut à un autre. Il faut donc définir le contexte de chaque étape. Celui-ci va permettre d'indiquer à quel moment une étape doit se déclencher sur l'objet en cours.</p>
<p>Imaginons le cas suivant :</p>
<ul>
<li>On reçoit une demande de création de vidéo :
<ul>
<li>L'étape <em>create</em> est lancée</li>
<li>Notre objet passe en status <em>creating</em></li>
<li>Une série de traitements s'effectue</li>
<li>Notre objet passe en statut <em>created</em></li>
</ul>
</li>
</ul>
<p>A partir de ce moment, nous avons donc un objet en état <em>created</em>.</p>
<ul>
<li>La prochaine étape logique de notre workflow est donc l'étape de <em>download</em>:
<ul>
<li>L'étape <em>download</em> détecte que nous avons un objet en état <em>created</em> :</li>
<li>L'étape <em>download</em> est lancée</li>
<li>Notre objet passe en statut <em>downloading</em></li>
<li>Une série de traitements s'effectue</li>
<li>Notre objet passe en statut <em>downloaded</em></li>
</ul>
</li>
</ul>
<p>Et ainsi de suite jusqu'à arriver à l'état <em>published</em> qui indique la fin de notre workflow (en effet, aucune étape n'est configurée pour débuter sur ce statut).</p>
<p><strong>- Dans quel cas l'utiliser ?</strong></p>
<p>De mon opinion, ce pattern est très pratique dans des cas assez complexes où beaucoup d'étapes sont nécessaires à l'élaboration d'un objet.</p>
<p>Il est très souple et permet très facilement d'ajouter/modifier ou supprimer des étapes sans pour autant mettre en péril notre workflow.</p>
<p>Cependant, il reste des cas où il est inutile de l'utiliser, par exemple, sur un workflow assez simple. En effet, ce pattern est assez lourd à installer, donc il ne présenterait pas de gros gains. Il impose en effet une certaine manière de penser et de fonctionner qui n'est pas forcément courante.</p>
<p><strong>- Cas concret avec le bundle Symfony winzou/state-machine-bundle</strong></p>
<p>Ce bundle permet la mise en place d'une state machine assez facilement. En effet, il se base en grande partie sur de la config pour la gérer automatiquement. Vous pouvez trouver son dépôt ici : <a href="https://github.com/winzou/StateMachineBundle" target="_blank">https://github.com/winzou/StateMachineBundle</a></p>
<p>Dans notre cas, la configuration du bundle pourrait ressembler à ça :</p>
<pre class="lang:yaml decode:true"># app/config/config.yml

winzou_state_machine:
    my_bundle_video:
        class: My\Bundle\Entity\Video
        property_path: state
        graph: simple
        # list of all possible states:
        states:
            - creating
            - created
            - downloading
            - downloaded
            - encoding
            - encoded
            - uploading
            - uploaded
            - publishing
            - published
        # list of all possible transitions:
        transitions:
            create:
                from: [new]
                to: created
            download
                from: [created]
                to: downloaded
            encode
                from: [downloaded]
                to: encoded
            upload
                from: [encoded]
                to: uploaded
            publish
                from: [uploaded]
                to: published
        # list of all callbacks
        callbacks:
            # will be called before applying a transition
            before:
                set_transitional_state:
                    on:   ['create', 'download', 'encode', 'upload', 'publish']
                    do:   [@my.awesome.service, 'setTransitionalState']
                    args: ['object']
</pre>
<p>De cette manière, chaque étape sait à quel statut elle doit se déclencher, fera appel à une méthode <code>setTransitionalState</code> qui se chargera de mettre à jour le statut en début d'étape (<em>creating</em>, <em>downloading</em>,...), et enfin définira le statut de fin lorsqu'elle aura terminé.</p>
<p>Ensuite, il suffira juste de choisir de quelle manière activer chaque étape. On peut très bien imaginer la réception d'un call POST sur une url afin de déclencher l'étape <em>create</em>, puis des crons s'occupant de récupérer les objets vidéos et de les traiter en fonction de leurs statuts.</p>
<p><strong>- Conclusion</strong></p>
<p>Pour conclure, je pense que ce pattern est utile dans des workflows assez complexes où vous désirez découpler chaque étape. Il est possible de faire des choses très poussées qui n'ont pas été abordées dans cet article (toute la gestion d'erreur par exemple, car relancer une étape ne nécessite qu'un changement de statut).</p>
<p>See ya!</p>
{% endraw %}
