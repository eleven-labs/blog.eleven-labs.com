---
layout: post
title: 'WebRTC : La révolution de la communication'
lang: fr
permalink: /fr/webrtc-la-revolution-de-la-communication/
authors:
 - cogren
excerpt: "Historiquement, le Web était un outil qui permettait le chargement, l'interprétation et l'exploitation d'interfaces distribuées. Un serveur héberge un contenu (dynamique ou non), l'expose sur le Web via une URL (Uniform Resources Location), puis un navigateur se connecte à cette URL pour télécharger et afficher le contenu en question à l'utilisateur."
date: '2016-12-06 14:44:19 +0100'
date_gmt: '2016-12-06 13:44:19 +0100'
categories:
- Javascript
tags:
- Javascript
- RTC
- Real Time Communication
- P2P
- Vidéo
---

 Le **WebRTC** (aka **Web** **R**eal-**T**ime **C**ommunication) apporte la communication en temps réel au Web.

Historiquement, le Web était un outil qui permettait le chargement, l'interprétation et l'exploitation d'interfaces distribuées. Un serveur héberge un contenu (dynamique ou non), l'expose sur le Web via une URL (Uniform Resources Location), puis un navigateur se connecte à cette URL pour télécharger et afficher le contenu en question à l'utilisateur.

Dans le navigateur, seuls trois langages de programmation permettent de décrire le contenu desservi à l'utilisateur :

-   le **HTML** pour la structure du contenu
-   le **CSS** pour la forme du contenu
-   le **JavaScript** pour les interactions possibles par l'utilisateur sur le contenu

Ces langages avaient beaucoup de limitations pour fournir des interfaces avancées (riches en interactions). Pour remédier à cela, il existait beaucoup de plugins navigateurs capables d'actions plus *"modernes"*. Ceux que tout le monde connait : Java, Flash. Et ceux qui sont moins connus : NaCL, PNaCL, XUL (langages pour éditer des plugins navigateur).

Ces différents plugins permettaient notamment d'avoir accès à des couches basses du réseau et de manipuler les communications entre machines (client/serveur) plus finement que via le JavaScript (limitation de sécurité forçant le navigateur à initier la demande d'information). Le plus intéressant dans tout cela, outre de faire des interfaces graphiques *bling bling*, était de pouvoir implémenter des communications **RTC** (Real-Time Communication).

Le **RTC**, comme son petit nom l'indique, est le fait de distribuer *instantanément* une information entre plusieurs machines : dès qu'une action est faite, elle se retrouve distribuée aux clients connectés. Ce domaine a longtemps été réservé au monde des télécommunications où l'effet *instantané* était obligatoire. On s'imagine mal devoir entendre le début d'une phrase prononcée une minute plus tôt. La conversation en deviendrait difficile.

Le **WebRTC** permet enfin aux applications Web (HTML, CSS, JavaScript) de fournir cette *instantanéité* à ses utilisateurs.

Bon OK, je vois bien que je suis en train de vous saouler avec *l'histoire du Web* en mode édulcoré alors que vous êtes forcément un public averti qui en vaut deux.

Mais rassurez-vous, ça va rapidement devenir intéressant !

Comment ça marche ?
===================

Le **WebRTC** est exploitable dans le navigateur au travers de plusieurs nouvelles API JavaScript :

-   navigator.getUserMedia()
-   RTCPeerConnection()
-   RTCIceCandidate()

Le *WebRTC* ne se limite pas à ces trois API mais nous allons nous concentrer sur celles-ci pour commencer.

Une liste plus exhaustive peut être trouvée [sur MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API){:target="_blank" rel="nofollow noopener noreferrer"}.

### [navigator.getUserMedia()](https://developer.mozilla.org/en/docs/Web/API/Navigator/getUserMedia){:target="_blank" rel="nofollow noopener noreferrer"}

L'API navigator.getUserMedia() sert à prendre le contrôle sur les équipements médias de l'utilisateur, c.à.d. la webcam et le micro. On pourra alors manipuler ou transférer les flux émis par ces différents médias sous la forme d'une instance de [MediaStream()](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream){:target="_blank" rel="nofollow noopener noreferrer"}. Le navigateur s'occupera de normaliser les protocoles audio/vidéo utilisés pour encoder ces flux. L'utilisateur devra néanmoins autoriser l'application à accéder à ses équipements.

```js
// Ask for permission to access user webcam and microphone
navigator.getUserMedia({ audio: true, video: true }, success, failure);

// Success callback that gets a `MediaStream` instance
function success (stream) {
  var video = document.querySelector('.video');
  video.src = URL.createObjectURL(stream);
}

// Error callback
function failure (err) {
  console.error('Could not capture user media', err);
}
```

La spécification *WebRTC* n'étant pas finalisée, la façon d'appeler cette API diffère selon le navigateur et sa version. Un [adaptateur](https://github.com/webrtc/adapter) développé et maintenu par le groupe de développement [*WebRTC*](https://webrtc.org){:target="_blank" rel="nofollow noopener noreferrer"} existe pour uniformiser l'exploitation de cette API.

Sur la documentation de [MDN](https://developer.mozilla.org/en/docs/Web/API/Navigator/getUserMedia) on peut voir que cette méthode est obsolète, et remplacée par la nouvelle version de la spécification [mediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) qui dorénavant renvoie une [Promise()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise){:target="_blank" rel="nofollow noopener noreferrer"} :

```js
navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  .then(function (stream) {
    /* use the stream */
  }).catch(function (err) {
    /* handle the error */
  });
```

### [RTCPeerConnection()](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) / [RTCIceCandidate()](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate){:target="_blank" rel="nofollow noopener noreferrer"}

L'API RTCPeerConnection() nous sert à établir une connexion réseau *P2P* (tunnel) pour envoyer des données entre deux clients. Pour réussir à l'établir, ce n'est pas aussi simple que d'entrer une *URL* dans un navigateur, la plupart des clients existants n'ayant pas d'adresse publique accessible.

Le **WebRTC** va se reposer sur deux technologies serveur nommées **STUN/ICE** et **TURN** pour que chaque client puisse découvrir le moyen, selon leur configuration réseau, d'exposer de façon sécurisée un tunnel de connexion public et de transférer les données souhaitées.

Concrètement, il faut que chaque client instancie une RTCPeerConnection() en fournissant l'adresse du serveur *STUN/ICE,* ce qui leur donnera une description d'accès à leur réseau (*NAT*) sous la forme d'une instance RTCIceCandidate().

Il faut ensuite partager cette description via un serveur dit de *signaling.* Ce serveur ne fait pas partie de la spécification *WebRTC* et peut être développé dans n'importe quel langage serveur ; en général il s'agira d'un serveur *WebSocket* auquel chaque client est connecté. Une fois ces descriptions partagées, la connexion *P2P* peut être établie.

Dans certains cas, la connexion *P2P* n'est tout de même pas possible, par exemple dans le cas d'un réseau trop complexe ou très sécurisé comportant des firewalls et proxies. Mais tout n'est pas perdu ! C'est là qu'intervient le serveur *TURN,* qui sert de pont de transmission pour la connexion. Vous l'aurez deviné, il ne s'agit plus réellement d'une connexion *P2P* dans ce cas-là, mais c'est tout comme.

Voici un exemple qui suppose que vous avez déjà un système de *signaling* accessible via la méthode createSignalingChannel(), ainsi que deux éléments &lt;video&gt; : selfView et remoteView pour afficher les flux vidéos.

```js
const signalingChannel = createSignalingChannel();
const peer;
const configuration = ...;

// run start({ isCaller: true }) to initiate a call
function start({ isCaller }) {
  peer = new RTCPeerConnection(configuration);

  // send any ice candidates to the other peer
  peer.onicecandidate = function (evt) {
    signalingChannel.send(
      JSON.stringify({ candidate: evt.candidate })
    );
  };

  // once remote stream arrives, show it in the remote video element
  peer.onaddstream = function (evt) {
    remoteView.src = URL.createObjectURL(evt.stream);
  };

  // get the local stream, show it in the local video element and send it
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(function (stream) {
      selfView.src = URL.createObjectURL(stream);
      peer.addStream(stream);

      if (isCaller) {
        peer.createOffer(gotDescription);
      } else {
        peer.createAnswer(peer.remoteDescription, gotDescription);
      }

      function gotDescription(desc) {
        peer.setLocalDescription(desc);
        signalingChannel.send(
          JSON.stringify({ sdp: desc })
        );
      }
    }).catch(function (err) {
      console.error('Could not capture user media', err);
    });
}

signalingChannel.onmessage = function (evt) {
  if (!peer) {
    start({ isCaller: false });
  }

  const signal = JSON.parse(evt.data);
  if (signal.sdp) {
    peer.setRemoteDescription(
      new RTCSessionDescription(signal.sdp)
    );
  }
  else {
    peer.addIceCandidate(
      new RTCIceCandidate(signal.candidate)
    );
  }
};
```

On voit que cela devient légèrement plus complexe d'arriver à ses fins, et cela sans compter les polyfills nécessaires pour les différents navigateurs. Heureusement, comme l'adaptateur de l'API navigator.getUserMedia(), il existe de très bonnes librairies open-source qui s'occupent de gérer cette complexité pour vous ([Twilio](https://www.twilio.com/), [EasyRTC](https://www.easyrtc.com/)){:target="_blank" rel="nofollow noopener noreferrer"}.

### STUN/ICE

En ce qui concerne le serveur de liaison *STUN/ICE*, si on ne passe pas par un service de *signaling* dédié, Google fournit une instance publique à l'adresse [stun.l.google.com:19302](19302). Il existe également une application serveur open-source développée en *C/C++* pour déployer sa propre instance *STUN/ICE* et *TURN* : <https://github.com/coturn/coturn>.

Conclusion
==========

Nous n'avons fait que gratter la surface de ce qui est possible avec le **WebRTC**. La technologie pousse à imaginer une nouvelle forme d'application Web et le meilleur dans tout ça c'est qu'elle est exploitable dès aujourd'hui !

Serait-ce enfin ce qu'on pourrait appeler le *Web 3.0* ? Ce qui est sûr c'est que cette technologie ne va pas disparaître de si tôt, bien que sa standardisation par le consortium W3C prenne beaucoup de temps.

Beaucoup d'applications se basent déjà sur cette nouvelle technologie :

-   [Twilio](https://twilio.com){:target="_blank" rel="nofollow noopener noreferrer"}
-   [Bistri](https://bistri.com/){:target="_blank" rel="nofollow noopener noreferrer"}
-   [Ottspott](http://ottspott.co/){:target="_blank" rel="nofollow noopener noreferrer"}

Les grands noms de la visio-conférence se basent également dessus :

-   Skype
-   Facebook

Dans une série d'articles, j'entrerai dans le vif du sujet avec des exemples concrets des possibilités que fournit le **WebRTC**. En attendant, renseignez-vous sur le site officiel [webrtc.org](https://webrtc.org), ou sur la très bonne documentation du [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API){:target="_blank" rel="nofollow noopener noreferrer"}

Et surtout, Happy Coding !
