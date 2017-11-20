---
layout: post
title: "Les principaux formats de flux video live DASH et HLS"
excerpt: Le HLS et le DASH, deux protocoles pour les streamer tous.
authors:
    - jbernard
lang: fr
permalink: /fr/video-live-dash-hls/
date: '2017-07-19 12:00:00 +0100'
date_gmt: '2017-07-19 12:00:00 +0100'
categories:
    - JS
    - Stream Video
tags:
    - live
    - streaming
    - video
cover: /assets/2017-07-12-video-live-dash-hls/cover.jpg
---

Bien qu'elles soient utilisées par des grands noms comme Apple, Microsoft, Youtube ou bien Netflix, les technologies de streaming video ne sont pas parmi les plus connues.

## Préambule

Cet article traite des deux grandes technologies permettant le streaming vidéo sur une application web. Le HLS et le DASH seront donc ici détaillés afin d'en comprendre le fonctionnement général.

## Le HLS

Le HLS (HTTP Live Streaming) est un protocole de streaming audio/video conçu par Apple à la fin des années 2000, à la base pour le lecteur QuickTime. Comme son nom l'indique, ce protocole utilise le HTTP comme protocole de transport, ce qui le rend très adaptable et facilement utilisable via un Nginx ou autre Apache.

Au même titre que les autres protocoles servant les même objectifs, le HLS envoie des segments audios et/ou vidéos d'une longueur donnée, laissant la responsabilité au client d'enchaîner l'affichage desdits segments. Dans le bon ordre de préférence.

De grandes plateformes de streaming utilisent ce protocole pour servir leurs streams video live ou leurs replays. La plateforme Twitch.js typiquement, premier site mondial de streaming de jeux video, nous servira d'exemple tout au long de cette partie.

### Fonctionnement

Un diagramme vaut sûrement mieux qu'un long discours :

![Diagramme de fonctionnement - HLS ](/assets/2017-07-12-video-live-dash-hls/diagram_HLS.png)

On voit ici le workflow permettant à l'audio/vidéo brut d'arriver sous forme de streaming au client.
Les fichiers segmentés, le plus souvent au format MPEG-2 TS, sont accessibles via un "manifest", un fichier index au format M3U qui décrit les différents segments du contenu ainsi que des métadata que le client peut/doit utiliser. Ce fichier est basiquement une playlist d'URL.

L'exemple de fichier M3U ci-dessous provient d'un live de la plateforme Twitch.tv :

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:3
#ID3-EQUIV-TDTG:2017-07-12T20:35:58
#EXT-X-MEDIA-SEQUENCE:9179
#EXT-X-TWITCH-ELAPSED-SECS:18337.531
#EXT-X-TWITCH-TOTAL-SECS:18350.403
#EXTINF:2.000,
index-0000009179-wlRO.ts
#EXTINF:2.000,
index-0000009180-r7CE.ts
#EXTINF:2.000,
index-0000009181-m6IG.ts
#EXTINF:2.000,
index-0000009182-icmP.ts
#EXTINF:2.000,
index-0000009183-wnDD.ts
#EXTINF:2.000,
index-0000009184-Juro.ts
```

Les lignes du fichier commençant par un `#` décrivent des métadata, les autres indiquent les URL des fichiers TS qui forment le contenu.
Parmi les données les plus importantes, on retrouve :
- `#EXTM3U` : Genre de shebang indiquant le type de fichier manifest. Ici sans surprise, un fichier M3U.
- `#EXT-X-VERSION` : Version du protocole HLS à utiliser.
- `#EXT-X-MEDIA-SEQUENCE` : Le nombre de séquences précédant la première URL du fichier.
- `#EXTINF` : Durée de la séquence pointée par l'URL située sur la ligne suivante.

L'exemple suivant montre un format de fichier M3U gérant l'adaptive streaming :
```
#EXTM3U
#EXT-X-VERSION:6
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2855600,CODECS="avc1.4d001f,mp4a.40.2",RESOLUTION=960x540
live/medium.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=5605600,CODECS="avc1.640028,mp4a.40.2",RESOLUTION=1280x720
live/high.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1755600,CODECS="avc1.42001f,mp4a.40.2",RESOLUTION=640x360
live/low.m3u8
```

Chaque balise `#EXT-X-STREAM-INF` indique les données nécessaires à la lecture du segment, chacun d'entre eux d'une qualité et d'un encodage donnés. Ainsi, le client compatible pourra passer d'une qualité à une autre en temps réel, en fonction de la bande passante disponible ou du choix de l'utilisateur. Le diagramme suivant illustre d'ailleurs très bien cette possibilité :

![Fichier M3U - HLS ](/assets/2017-07-12-video-live-dash-hls/HLS_Figure_1.jpg)

### Librairie JS

La librairie open-source [hls.js](https://github.com/video-dev/hls.js) est certainement l'une des plus complètes quand il s'agit d'implémenter un client gérant le HTTP Live Streaming. Utilisée notamment par Canal+ et Dailymotion, hls.js est compatible avec un grand nombre de browsers et embarque des fonctionnalités avancées, comme la gestion de l'adaptive streaming ou le multi-thread (si le navigateur client est compatible){:target="_blank" rel="nofollow noopener noreferrer"} pour améliorer entre autre la fluidité de la mise en cache.

hls.js dispose d'une [API](https://github.com/video-dev/hls.js/blob/master/doc/API.md) très complète (et très bien documentée !){:target="_blank" rel="nofollow noopener noreferrer"} qui permet de gérer la vidéo et le flux directement depuis le Javascript. Exemple de base d'implémentation :
```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<video id="video"></video>
<script>
  if(Hls.isSupported()) {
    var video = document.getElementById('video');
    var hls = new Hls();
    hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
  });
 }
</script>
```

Une démo live est disponible [ici](http://video-dev.github.io/hls.js/demo){:target="_blank" rel="nofollow noopener noreferrer"}.


## Le DASH

Le Moving Picture Expert Group, plus connu sous son acronyme MPEG, a commencé la conception du MPEG-DASH en 2010. Le DASH (Dynamic Adaptive Streaming over HTTP) est ensuite devenu un standard international à la fin de l'année 2011. C'est d'ailleurs la seule solution de streaming certifiée [ISO](http://mpeg.chiariglione.org/standards/mpeg-dash){:target="_blank" rel="nofollow noopener noreferrer"}.

Utilisé lui aussi par de très grandes plateformes comme Youtube ou Netflix, le DASH est assez semblable au HLS dans son fonctionnement général : des fichiers séquencés répertoriés dans un fichier servant de playlist.

Le DASH, en plus d'être normalisé et standardisé ISO, dispose de plusieurs fonctionnalités introuvables dans les autres technologies similaires, au prix d'une complexité un peu plus élevée.

### Fonctionnement

Ne changeons pas une équipe qui gagne et commençons par un bon diagramme :

![Diagramme de fonctionnement - DASH ](/assets/2017-07-12-video-live-dash-hls/diagram_DASH.png)

Les différentes séquences du contenu sont un fois encore d'une taille, d'une qualité et d'un encodage donnés et sont envoyées au client via HTTP. Ce dernier a la responsabilité de sélectionner puis d'afficher les séquences dans la qualité voulue. Et toujours dans le bon ordre. Je vous assure, c'est important.

Le fichier centralisant toutes les informations du contenu est un fichier MPD (Media Presentation Description). Fichier au format XML, il regroupe toutes les données dont pourrait rêver le client.

C'est parti pour un *petit* exemple :

```xml
<MPD xmlns="urn:mpeg:DASH:schema:MPD:2011" mediaPresentationDuration="PT0H3M1.63S" minBufferTime="PT1.5S" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011"
type="static">
  <Period duration="PT0H3M1.63S" start="PT0S">
    <AdaptationSet>
      <ContentComponent contentType="video" id="1" />
      <Representation bandwidth="4190760" codecs="avc1.640028" height="1080" id="1" mimeType="video/mp4" width="1920">
        <BaseURL>car-20120827-89.mp4</BaseURL>
        <SegmentBase indexRange="674-1149">
          <Initialization range="0-673" />
        </SegmentBase>
      </Representation>
      <Representation bandwidth="2073921" codecs="avc1.4d401f" height="720" id="2" mimeType="video/mp4" width="1280">
        <BaseURL>car-20120827-88.mp4</BaseURL>
        <SegmentBase indexRange="708-1183">
          <Initialization range="0-707" />
        </SegmentBase>
      </Representation>
      <Representation bandwidth="869460" codecs="avc1.4d401e" height="480" id="3" mimeType="video/mp4" width="854">
        <BaseURL>car-20120827-87.mp4</BaseURL>
        <SegmentBase indexRange="708-1183">
          <Initialization range="0-707" />
        </SegmentBase>
      </Representation>
      <Representation bandwidth="264835" codecs="avc1.4d4015" height="240" id="5" mimeType="video/mp4" width="426">
        <BaseURL>car-20120827-85.mp4</BaseURL>
        <SegmentBase indexRange="672-1147">
          <Initialization range="0-671" />
        </SegmentBase>
      </Representation>
    </AdaptationSet>
    <AdaptationSet>
      <ContentComponent contentType="audio" id="2" />
      <Representation bandwidth="127236" codecs="mp4a.40.2" id="6" mimeType="audio/mp4" numChannels="2" sampleRate="44100">
        <BaseURL>car-20120827-8c.mp4</BaseURL>
        <SegmentBase indexRange="592-851">
          <Initialization range="0-591" />
        </SegmentBase>
      </Representation>
      <Representation bandwidth="255236" codecs="mp4a.40.2" id="7" mimeType="audio/mp4" numChannels="2" sampleRate="44100">
        <BaseURL>car-20120827-8d.mp4</BaseURL>
        <SegmentBase indexRange="592-851">
          <Initialization range="0-591" />
        </SegmentBase>
      </Representation>
      <Representation bandwidth="31749" codecs="mp4a.40.5" id="8" mimeType="audio/mp4" numChannels="1" sampleRate="22050">
        <BaseURL>car-20120827-8b.mp4</BaseURL>
        <SegmentBase indexRange="592-851">
          <Initialization range="0-591" />
        </SegmentBase>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```

Nous avons donc ici du XML classique, chaque tag donnant des informations spécifiques. Voyons ensemble les tag principaux par ordre hiérarchique :

- `<MPD>` : Décrit les métadata du fichier, sa version, la version du DASH utilisée, la durée total du contenu...
- `<AdaptationSet>` : Une adaptation est l'un des éléments du contenu, pas exemple la vidéo ou l'audio.
- `<ContentComponent>` : De manière assez similaire au tag précédent, le ContentComponent décrit exactement le type d'adaptation.
- `<Representation>` : La représentation décrit une version spécifique du contenu séquencé. Elle dispose d'un encodage qui lui est propre et c'est cet elément qui est utilisé par l'adaptive streaming, décrit dans la partie dédiée au HLS.
- `<BaseURL>` : L'URL de la séquence.

Il peut être intéressant de noter que le DASH supporte les DRM, pour diffuser du contenu protégé. Il permet aussi d'utiliser n'importe quel codec audio/vidéo, ce qui le rend particulièrement adaptable.

### Librairie JS

L'une des librairies open-source les plus complètes pour implémenter un client DASH est sans doute le [Rx-Player](https://github.com/canalplus/rx-player), une librairie maintenue par Canal +. Elle permet de jouer aussi bien du DASH live que du replay, utilisable via une [API](https://github.com/canalplus/rx-player/blob/master/doc/api/index.md){:target="_blank" rel="nofollow noopener noreferrer"} très complète et dont le niveau de documentation est assez incroyable. Le tout est utilisé en production, notamment dans certaines box Canal +.

Je leur laisse le soin d'expliquer [pourquoi](https://github.com/canalplus/rx-player#why-a-new-player-why-rx) le Rx-player est au-dessus quand il s'agit de la délicate mission d'implémenter un player DASH. Il implémente aussi le Smooth Streaming (un autre protocole de streaming moins connu){:target="_blank" rel="nofollow noopener noreferrer"}, si le coeur vous en dit.

Si vous n'êtes pas convaincus, je vous laisse jeter un oeil à leur [démo](http://developers.canal-plus.com/rx-player/){:target="_blank" rel="nofollow noopener noreferrer"}.

## Conclusion

Les deux protocoles présentés dans cet article partagent donc de nombreuses ressemblances dans leur fonctionnement général respectif.

Le HLS est sans doute le plus simple à mettre en place, que ce soit coté serveur ([ffmpeg](https://www.ffmpeg.org/) est votre ami){:target="_blank" rel="nofollow noopener noreferrer"} ou coté client.<br>
Le DASH est un peu plus complexe, mais il offre des possibilités incroyables si vous avez des besoins avancés, notamment au niveau de la gestion des DRM.

Il ne serait pas fair-play de finir cet article sans au moins mentionner deux autres grandes technologies de streaming : Le MSS (Microsoft Smooth Streaming) et le HDS (HTTP Dynamic Streaming). Moins connu et disposant de fonctionnalités qui leurs sont propres, je vous laisse consulter à leurs sujets cet excellent [article](https://bitmovin.com/mpeg-dash-vs-apple-hls-vs-microsoft-smooth-streaming-vs-adobe-hds/) (en anglais){:target="_blank" rel="nofollow noopener noreferrer"} comparant, fonctionnalité par fonctionnalité, les quatre protocoles.

## Références

* [ Spécification HLS - Apple ](https://developer.apple.com/streaming/){:target="_blank" rel="nofollow noopener noreferrer"}
* [ Librairie hls.js - Github ](https://github.com/video-dev/hls.js/tree/master){:target="_blank" rel="nofollow noopener noreferrer"}
* [ Standard DASH - MPEG ](http://mpeg.chiariglione.org/standards/mpeg-dash){:target="_blank" rel="nofollow noopener noreferrer"}
* [ MPEG-DASH - Wikipedia ](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP){:target="_blank" rel="nofollow noopener noreferrer"}
* [ Sample DASH - Appshot ](http://dash-mse-test.appspot.com/media.html){:target="_blank" rel="nofollow noopener noreferrer"}
* [ Rx-player - Github ](https://github.com/canalplus/rx-player){:target="_blank" rel="nofollow noopener noreferrer"}
* [ Comparaison HLS/DASH/MSS/HDS - Bitmovin ](https://bitmovin.com/mpeg-dash-vs-apple-hls-vs-microsoft-smooth-streaming-vs-adobe-hds/){:target="_blank" rel="nofollow noopener noreferrer"}
