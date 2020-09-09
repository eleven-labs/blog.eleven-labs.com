---
layout: post
title: "DASH & HLS : The two main video stream protocols"
excerpt: DASH & HLS, two protocols to stream them all.
authors:
    - jbernard
lang: en
permalink: /video-live-dash-hls/
date: '2020-09-03 11:00:00 +0100'
date_gmt: '2020-09-03 11:00:00 +0100'
categories:
    - JS
    - Video Stream
tags:
    - live
    - streaming
    - video
---

Despite being used by big names like Apple, Microsoft, Youtube or Netflix, video streaming technologies are not among the best known.

## Introduction

This article deals with the two main technologies allowing video streaming via a web application. HLS and DASH will be detailed here in order to understand how they work in general.

## HLS

HLS (HTTP Live Streaming) is an audio/video streaming protocol designed by Apple in the late 2000s, originally for the QuickTime player. As its name indicates, this protocol uses HTTP as a transport protocol, which makes it very adaptable and easily usable via Nginx, Apache or any web servers.

Like other protocols serving the same purpose, HLS sends audio and/or video segments of a given length, leaving it up to the client to chain the display of these segments. In the right order of preference.

Major streaming platforms use this protocol to serve their live video streams or replays. The Twitch.js platform, the world's leading gaming streaming site (owned by Amazon), will serve as an example throughout this section.

### How does it work ?

A diagram explains it better than a long speech:

![Operating diagram- HLS ]({{ site.baseurl }}/assets/2017-07-12-video-live-dash-hls/diagram_HLS.png)

Here we see the workflow that allows the raw audio/video to reach the client as a stream.
The segmented files, usually in MPEG-2 TS format, are accessed via a "manifest", an index file in M3U format that describes content segments as well as metadata that the client can/must use. This file is basically an URL playlist.

The example M3U file below is from a live broadcast of the Twitch.tv platform:

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

The lines of the file starting with a `#` describe metadata, the others indicate the URLs of the TS files that make the content.
Among the most important data are :
- `#EXTM3U`: Kind of shebang indicating the manifest file type. Here, unsurprisingly, an M3U file.
- `#EXT-X-VERSION`: Version of the HLS protocol used.
- `#EXT-X-MEDIA-SEQUENCE` : The number of sequences preceding the first URL of the file.
- `#EXTINF` : Duration of the sequence pointed by the URL located on the next line.

The following example shows an M3U file format for adaptive streaming:
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

Each `#EXT-X-STREAM-INF` tag indicates the data needed to read the segment, each of them of a given quality and encoding. Thus, the compatible client will be able to switch from one quality to another in real time, depending on the available bandwidth or the user's choice. The following diagram illustrates this possibility very well:

![M3U file - HLS ]({{ site.baseurl }}/assets/2017-07-12-video-live-dash-hls/HLS_Figure_1.jpg)

### JS library

The open-source library [hls.js](https://github.com/video-dev/hls.js) is certainly one of the most viable when it comes to implementing a client managing HTTP Live Streaming. Used in particular by Dailymotion, hls.js is compatible with a large number of browsers and includes advanced features, such as adaptive streaming management or multi-threading (if the client browser is compatible) to improve, among other things, the fluidity of caching.

hls.js has a very complete (and very well documented!) [API](https://github.com/video-dev/hls.js/blob/master/doc/API.md) which allows to manage the video and the stream directly from Javascript.

Here is an example of a basic implementation:
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

A live demo can be found [here](http://video-dev.github.io/hls.js/demo){:rel="nofollow noreferrer"}.


## DASH

The Moving Picture Expert Group, better known by its acronym MPEG, started designing MPEG-DASH in 2010. DASH (Dynamic Adaptive Streaming over HTTP) then became an international standard at the end of 2011. It is the only streaming solution certified [ISO](http://mpeg.chiariglione.org/standards/mpeg-dash){:rel="nofollow noreferrer"}.

Also used by very large platforms such as Youtube or Netflix, DASH is quite similar to HLS in its general structure: sequenced files listed in a file posing as a playlist.

DASH, in addition to being ISO-standardized, has several features not found in other similar technologies, at the price of a slightly higher complexity.

### How does it works ?

Once again, let's use a good diagram:

![Operating diagram - DASH ]({{ site.baseurl }}/assets/2017-07-12-video-live-dash-hls/diagram_DASH.png)

The different sequences of content are again of a given size, quality and encoding and are sent to the client via HTTP. The client is responsible for selecting and displaying the sequences in the desired quality. And always in the right order. Trust me, this is important.

The file centralizing all the information of the content is a MPD file (Media Presentation Description). This XML file contains all the data that the client could dream of.

Let's start with a *small* example:

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

So here we have some classic XML, each tag giving specific information. Let's look at the main tags by hierarchical order:

- `<MPD>`: Describes the metadata of the file, its version, the version of the DASH used, the total duration of the content...
- `<AdaptationSet>`: An adaptation is one of the elements of the content, for example video or audio.
- `<ContentComponent>`: In a similar way, ContentComponent describes exactly the type of adaptation.
- `<Representation>`: Representation describes a specific version of the sequenced content. It has its own encoding and it is this element that is used by adaptive streaming, described in the HLS section.
- `<BaseURL>`: The URL of the sequence.

It may be interesting to note that DASH supports DRM to broadcast protected content. It also allows the use of any audio/video codec, which makes it particularly adaptable.

### JS library

One of the most complete open-source library to implement a DASH client is probably [Rx-Player](https://github.com/canalplus/rx-player){:rel="nofollow noreferrer"}, a library maintained by the french premium TV channel Canal +. It allows to play both live DASH and replay via a very complete [API](https://github.com/canalplus/rx-player/blob/master/doc/api/index.md){:rel="nofollow noreferrer"}

I leave it to them to explain [why](https://github.com/canalplus/rx-player#why-a-new-player){:rel="nofollow noreferrer"} RX is superior when it comes to the delicate task of implementing a DASH player. It also handles Smooth Streaming (a lesser known streaming protocol) if you feel like it.

You can have a look at their [demo](http://developers.canal-plus.com/rx-player/){:rel="nofollow noreferrer"}.

## Conclusion

The two protocols presented in this article share many similarities in their general structure.

HLS is probably the easiest to implement, either server side ([ffmpeg](https://www.ffmpeg.org/){:rel="nofollow noreferrer"} is your friend) or client side.<br>
DASH is a little more complex, but it offers incredible possibilities if you have advanced needs, especially in DRM management.

It wouldn't be fair to end this article without at least mentioning two other great streaming technologies: MSS (Microsoft Smooth Streaming) and HDS (HTTP Dynamic Streaming). Less known and shipping their own set of features, I let you read this excellent [article](https://bitmovin.com/mpeg-dash-vs-apple-hls-vs-microsoft-smooth-streaming-vs-adobe-hds/){:rel="nofollow noreferrer"} about them.

## Reference

* [ HLS specs - Apple ](https://developer.apple.com/streaming/){:rel="nofollow noreferrer"}
* [ hls.js - Github ](https://github.com/video-dev/hls.js/tree/master){:rel="nofollow noreferrer"}
* [ Standard DASH - MPEG ](http://mpeg.chiariglione.org/standards/mpeg-dash){:rel="nofollow noreferrer"}
* [ MPEG-DASH - Wikipedia ](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP){:rel="nofollow noreferrer"}
* [ Sample DASH - Appshot ](http://dash-mse-test.appspot.com/media.html){:rel="nofollow noreferrer"}
* [ Rx-player - Github ](https://github.com/canalplus/rx-player){:rel="nofollow noreferrer"}
* [ HLS/DASH/MSS/HDS - Bitmovin ](https://bitmovin.com/mpeg-dash-vs-apple-hls-vs-microsoft-smooth-streaming-vs-adobe-hds/){:rel="nofollow noreferrer"}
