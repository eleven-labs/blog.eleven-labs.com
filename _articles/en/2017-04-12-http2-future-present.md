---
contentType: article
lang: en
date: '2017-04-12'
slug: http2-future-present
title: HTTP/2 is not future. It's present.
excerpt: "Remember, in\_`may 1996`, the very first HTTP protocol version (HTTP/1.0) was born."
categories:
  - javascript
  - php
authors:
  - vcomposieux
keywords:
  - mobile
  - compression
  - header
  - encryption
  - protocol
  - tls
---
Remember, in `may 1996`, the very first HTTP protocol version (HTTP/1.0) was born.
This protocol is described as a [RFC 1945](https://tools.ietf.org/html/rfc1945).

But time as passed and web applications has evolved a lot. We are now creating web applications that brings more and more logic in the browser and for that we need to load more and more assets: this means that we have to load multiple CSS which sometimes are making animations in the browser or also complex operations, more and more Javascript and images too.

`HTTP/1.1` release has offered and allowed us to use a kind of new web technologies we've known these last years, but web application are more and more done on smartphones and other connected devices, which is why the needs are now focused on web browsing performances.

After a first step made by Google in 2009 with the `SPDY` protocol, `HTTP/2` is finally going in the same direction with the [RFC 7540](https://tools.ietf.org/html/rfc7540).


# HTTP/2 Introduction

Nowadays, HTTP/2 protocol is supported by most browsers and it's important to point out. While writing this blog post, only Opera Mini does not implement the new protocol, as shown on the following table:

![Can I use HTTP/2?](/_assets/posts/2017-04-12-http2-future-present/caniuse.jpg)

That being said, you can consider upgrading your own web applications to HTTP/2 as soon as possible and thus offer high browsing performances to your visitors.

Indeed, HTTP/2 will bring to you new features which will help a lot on improving your applications. We will describe them in the rest of this article.


## TLS native support

Even if encryption is` not mandatory`, most of browsers today only support HTTP/2 using TLS associated encryption and this is not really a problem because it's highly recommended to obtain a SSL certificate, which can be done easily and for free with services like Let's Encrypt. This will also help you to secure your application if they are not already.

For information, if you choose to not use encryption, the protocol diminutive will be `h2c` , where it will be `h2`  if you do.

If you want more information about how to [improve SSL exchanges security](https://vincent.composieux.fr/article/improve-ssl-exchanges-safety-made-by-your-web-server), I highly invite you to read my blog post on this topic.


## Stream Multiplexing

HTTP/1 resources were loaded one by one as you can see below on a HTTP/1 application waterfall. HTTP/2 will allow to gain a lot of time on "waiting time" because multiple resources could be sent/downloaded by the client using the same HTTP stream (which is often called binary stream).

![Waterfall HTTP?](/_assets/posts/2017-04-12-http2-future-present/waterfall_http.jpg)

Here, time passed and displayed in green color is corresponding to wait time before resource loading. Purple time is corresponding to resource loading time (TTFB - Time To First Byte) and finally the grey time is corresponding on the resource reception to the client.

Here is a waterfall of resources loading using the HTTP/2 protocol:

![Waterfall HTTP/2?](/_assets/posts/2017-04-12-http2-future-present/waterfall_http2.jpg)

You can clearly see here that time allocated to wait on resources (old-green time) has disappeared completely and all resources are clearly loaded in the same time because they are in the same stream.

Moreover, given that search engines are taking the page load time as an important metric for upgrading rank of websites, this is a great reason to go on HTTP/2 protocol: it will be a great improvement for your SEO.

In order to help you to visualize the resource loading speed time, here is a demo comparing HTTP/1 and HTTP/2 made by Golang:

* Chargement avec `HTTP/1.1` : [http://http2.golang.org/gophertiles?latency=0](http://http2.golang.org/gophertiles?latency=0)
* Chargement avec `HTTP/2` : [https://http2.golang.org/gophertiles?latency=0](https://http2.golang.org/gophertiles?latency=0)

## HPACK: Headers compression

This new protocol version also comes with headers compression that are sent by the server in order to optimize stream exchanges.

This way, if I make a first request on a HTTP/2 website, I will retrieve the following headers:

```
:authority: vincent.composieux.fr
:method: GET
:path: /
:scheme: https
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
accept-encoding: gzip, deflate, sdch, br
```

On my next request, headers `:authority` , `:method` , `:scheme` , `accept`  and `accept-encoding`  will probably not change.
HTTP/2 will be able to compress them to gain some space in the response.

In order to let you test header compression by yourself, I invite you to use the [h2load](https://nghttp2.org/documentation/h2load-howto.html) tool, which you can use to make a benchmark on HTTP/2 calls, by making here two requests:

```bash
$ h2load https://vincent.composieux.fr -n 2 | grep traffic
traffic: 32.25KB (33023) total, 650B (650) headers (space savings 25.29%), 31.51KB (32270) data</pre>
We can see here that my compressed headers `saved me 25.29%` of exchange size.
```

## Server Push (preload)

This is a little revolution on browser resource loading.

Indeed, your web server will be able to push assets in your browser's cache that your application will need or oculd have needed, and this, only when you detect that your client will need that resource.

In order to preload a resource, you just have to send a HTTP header formatted in the following way:

```
Link: </fonts/myfont.woff2>;rel="preload";as="font"
```

You can of course define multiple `Link` headers, and `as`  attributes can also take the following values: `font` , `image` , `style`  or `script`.

It's also possible to use the HTML markup to preload your resources:

```
<link rel="preload" href="/fonts/myfont.woff2" as="font">
```

Also, if you use the <a href="https://www.symfony.com">Symfony</a> PHP framework, please note that this one has implemented assets preloading in version 3.3. To use it, you just have to use the preload wrapper this way:

```
<link href="{{ preload(asset('/fonts/myfont.woff2'), { as: 'font' }) }}">
```

For more information about this feature, you can visit: [http://symfony.com/blog/new-in-symfony-3-3-asset-preloading-with-http-2-push](http://symfony.com/blog/new-in-symfony-3-3-asset-preloading-with-http-2-push)

Also note that a new Symfony component is currently in review [on this Pull Request](https://github.com/symfony/symfony/pull/22273) in order to manage all available links that allow to preload or push (preload, preset, prerender, ...).

## Server Hints (prefetch)

Please note that this method is not related to HTTP/2 because it's available for a long time but it's interesting to compare it with `preload`.

So, preload will load a resource `into your browser's cache` but prefetch will ensure that the client doesn't already have this resource and will retrieve it `only if the client needs it`.

Its use case is quite the same depending on you not having have to specify the `as` attribute:

```
Link: </fonts/myfont.woff2>; rel=prefetch
```

# Use the HTTP/2 protocol

In the case of your web server being nginx, HTTP/2 protocol is supported since the `1.9.5 version` and you just have to specify in the `listen`  attribute that you want to use http2:

```
server {
    listen 443 ssl http2;
    ...
```

In order to ensure that HTTP/2 is fully enabled on your server, I invite you to type `nginx -V`  and check if you have the `--with-http_v2_module`  compilation option enabled. Additionally, you can also check that your OpenSSL version used by nginx is recent.

Starting from here, you just have to restart your web server in order to enable the new protocol.

`Note:` For your information if http/2 is not supported by the client's browser, your web server will automatically fallback on http/1.1 protocol.

On Apache web server side, `versions 2.4.12` and greater also support HTTP/2.

Globally, HTTP/2 protocol activation is quite simple. If you come from Javascript world, you have to know that a [http2](https://www.npmjs.com/package/http2) package is available in order to instanciate an `express` server with the new protocol version.


# Conclusion

HTTP/2 can be used starting today on your web applications and can only be good (for your users mostly) but also for your application on multiple things: performances, SEO, encryption.

It's also really easy to setup and support a large panel of languages which should really help you to go forward.

So, what's next? No work has begun until now on a HTTP/3 or a new version after HTTP/2 but future and technologies should reserve us a third version of this highly used protocol!
