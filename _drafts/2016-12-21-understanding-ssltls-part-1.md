---
layout: post
title: 'Understanding SSL/TLS: Part 1 - What is it?'
author: rpierlot
date: '2016-12-21 11:46:42 +0100'
date_gmt: '2016-12-21 10:46:42 +0100'
categories:
- Non classé
tags:
- security
- protocols
- encryption
- SSL
- TLS
---

<span style="font-weight: 400;">You've certainly heard about SSL or TLS protocols.</span><span style="font-weight: 400;"><br />
</span><span style="font-weight: 400;">We're going to see what it's all about together.<br />
</span>

<span style="font-weight: 400;">In order to do that, this subject will be decomposed in 5 parts, each of them posted every day until friday.</span>

<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">What is it?</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Encryption</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Certificates</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Handshake Protocol</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Record Protocol</span></li>
</ol>
<span style="font-weight: 400;">First of all, a little history lesson: fasten your seat belt, let's start with part 1!</span>

### **So, what is it?**
<span style="font-weight: 400;">SSL and TLS are cryptographic protocols that provide communications security.</span>

<span style="font-weight: 400;">They behave like an additional intermediate layer between the transport layer (TCP) and the applicative one (HTTP, FTP, SMTP...) (see diagram below)</span>

This means that they can be used to secure a web transaction, sending or receiving emails...

<span style="font-weight: 400;">Until now, everything's right!</span>

<span style="font-weight: 400;">SSL and TLS are invisible to the user, and don't require a usage of protocol of specific application.</span>

<i><span style="font-weight: 400;">OSI Model with SSL/TLS</span></i>

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/11/tls-in-osi.png"><img class="size-medium wp-image-2563 aligncenter" src="http://blog.eleven-labs.com/wp-content/uploads/2016/11/tls-in-osi-300x202.png" alt="tls-in-osi" width="300" height="202" /></a>

<i><span style="font-weight: 400;">Bottom line:</span></i>

<span style="font-weight: 400;">SSL and TLS protocols allow to exchange secure information between to computers.</span>

<span style="font-weight: 400;">They are responsible for the following three things:</span>

<ol>
<li style="font-weight: 400;"><b style="font-weight: 400;">Confidentiality**<span style="font-weight: 400;">: it's impossible to spy on exchanged information. Client and server must have the insurance that their conversation can't be listened to by someone else. This is ensured by an </span>**encryption<span style="font-weight: 400;"> </span>****algorithm**.</li>
<li style="font-weight: 400;">**Integrity**:<span style="font-weight: 400;"> it's impossible to falsify exchanged information. A client and a server must ensure that transmitted messages are neither truncated nor modified (integrity), and that they come from an expected sender. These functionalities are done by <strong>signature of data</strong></span><span style="font-weight: 400;">.</span></li>
<li style="font-weight: 400;">**Authentication**<span style="font-weight: 400;">: it allows to be sure of the software identity, the person or corporation with which we communicate. Since SSL </span>**3.0**<span style="font-weight: 400;">, the server can also ask the client to authenticate, ensured by the use of <strong>certificates</strong></span><span style="font-weight: 400;">.</span></li>
</ol>
TLS and SSL protocols are based on a combination of several cryptographic concepts, dealing with both **asymmetrical**<i style="font-weight: 400;"> </i>and <strong>symmetrical<span style="font-weight: 400;"> encryption</span></strong> (we'll discuss about this in a related part of this article<span style="font-weight: 400;">).</span>

<span style="font-weight: 400;">Moreover, these protocols are bound to evolve, independent from cryptographic algorithm and authentication set in a transaction. This allows them to adapt to users needs and have better security because those protocols are not impacted by technical evolution of cryptography (if an encryption becomes obsolete, the protocol can still be exploited by choosing a more secure encryption).</span>

**History:**

**A - SSL**<span style="font-weight: 400;">:</span>

<span style="font-weight: 400;">SSL means </span>**Secure Socket Layer.**

<ul>
<li><span style="font-weight: 400;">Developed by Netscape in </span>**1994, **version **1.0 **stayed** **internal and had never been released<span style="font-weight: 400;"> ;</span></li>
<li>The first real SSL version is <strong style="font-weight: 400;">2.0</strong>, released in <strong>February,<span style="font-weight: 400;"> <strong>1995</strong></span></strong>. It's the first implementation of SSL that was banned in march 2011<span style="font-weight: 400;"> (</span><a style="font-weight: 400;" href="https://tools.ietf.org/html/rfc6176"><span style="font-weight: 400;">RFC 6176</span></a><span style="font-weight: 400;">) ;</span></li>
<li><span style="font-weight: 400;">In </span>**November<span style="font-weight: 400;">, <strong>1996 </strong></span>**<span style="font-weight: 400;">SSL releases </span><b style="font-weight: 400;">3.0**<span style="font-weight: 400;">, last version to this day, which will inspire <strong>TLS</strong>, its successor</span><span style="font-weight: 400;">. Its specifications were re-edited in august, 2008 in </span><a style="font-weight: 400;" href="https://tools.ietf.org/html/rfc6101"><span style="font-weight: 400;">RFC 6101</span></a><a style="font-weight: 400;" href="https://fr.wikipedia.org/wiki/Transport_Layer_Security#cite_note-4"><span style="font-weight: 400;">4</span></a><span style="font-weight: 400;">. The protocol was banned in 2014, following the </span><span style="font-weight: 400;"><a href="https://fr.wikipedia.org/wiki/POODLE">POODLE</a> breach. The banishment was definitely ratified in June of 2015 </span><span style="font-weight: 400;">(</span><a style="font-weight: 400;" href="https://tools.ietf.org/html/rfc7568"><span style="font-weight: 400;">RFC 7568</span></a><span style="font-weight: 400;">).</span></li>
</ul>
**B - TLS:**

<span style="font-weight: 400;">TLS means </span>**Transport Layer Security**<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">The development of this protocol has been continued by </span><a href="https://www.ietf.org/"><span style="font-weight: 400;">IETF</span></a><span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">TLS protocol is not structurally from version 3 of SSL, but modifications in the use of hash functions result in a non-interoperability of both protocols.</span>

Although TLS, like SSLv3, has an ascending compatibility with previous versions, meaning that at the beginning of the <strong>negotiation<span style="font-weight: 400;"> </span></strong>phase, client and server negotiate the best version of the protocol available in common. For security reasons (mentioned above), TLS compatibility with SSL v2 has been dropped.

What also differentiates TLS from SSL is that <strong>asymmetrical<span style="font-weight: 400;"> keys </span></strong>generation is a little more secured in SSL than in SSLV3, where not one step is uniquely based on MD5 <span style="font-weight: 400;">(where weaknesses have appeared in <a href="https://en.wikipedia.org/wiki/Cryptanalysis">cryptanalysis</a></span><span style="font-weight: 400;">)</span><span style="font-weight: 400;">.</span>

<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">In </span>**January<span style="font-weight: 400;"> 1993</span>**<span style="font-weight: 400;">: IETF publishes </span><b style="font-weight: 400;">TLS 1.0**<span style="font-weight: 400;">. Lots of improvements are then brought:</span>
<ul style="font-weight: 400;">
<li style="font-weight: 400;"><span style="font-weight: 400;">October 1999 (</span><a href="https://tools.ietf.org/html/rfc2712"><span style="font-weight: 400;">RFC 2712</span></a><span style="font-weight: 400;">) : Added protocol </span><a href="https://en.wikipedia.org/wiki/Kerberos_(protocol)"><span style="font-weight: 400;">Kerberos</span></a><span style="font-weight: 400;"> to TLS</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">May 2000 (</span><a href="https://tools.ietf.org/html/rfc2817"><span style="font-weight: 400;">RFC 2817</span></a><span style="font-weight: 400;"> and </span><a href="https://tools.ietf.org/html/rfc2818"><span style="font-weight: 400;">RFC 2818</span></a><span style="font-weight: 400;">) : Migration  to TLS during a HTTP 1.1 session</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">June 2002 (</span><a href="https://tools.ietf.org/html/rfc3268"><span style="font-weight: 400;">RFC 3268</span></a><span style="font-weight: 400;">) : Support of <a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard">AES</a> encryption system via TLS</span></li>
</ul>
</li>
<li style="font-weight: 400;"><span style="font-weight: 400;">April 2006 (</span><a href="https://tools.ietf.org/html/rfc4346"><span style="font-weight: 400;">RFC 4346</span></a><span style="font-weight: 400;">) : Publication of </span>**TLS 1.1**<span style="font-weight: 400;">.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">August 2008 (</span><a href="https://tools.ietf.org/html/rfc5246"><span style="font-weight: 400;">RFC 5246</span></a><span style="font-weight: 400;">) : Publication of </span>**TLS 1.2**<span style="font-weight: 400;">.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">March 2011 (</span><a href="https://tools.ietf.org/html/rfc6176"><span style="font-weight: 400;">RFC 6176</span></a><span style="font-weight: 400;">) : SSLv2 compatibility of all TLS versions dropped.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">April 2014: first draft of </span>**TLS 1.3**<span style="font-weight: 400;">.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">June 2015 (</span><a href="https://tools.ietf.org/html/rfc7568"><span style="font-weight: 400;">RFC 7568</span></a><span style="font-weight: 400;">) : compatibility with SSLv2 and SSLv3 dropped.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">October 2015: new draft of </span>**TLS 1.3**</li>
</ul>
**Browsers:**

<span style="font-weight: 400;">Most browsers support TLS 1.0. Browsers supporting by default TLS 1.1 and 1.2 are:</span>

<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apple Safari 7 and next;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Google Chrome and Chromium 30 and next;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Microsoft Internet Explorer 11 and next;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Mozilla Firefox 27 and next;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Opera 17 and next.</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Microsoft Edge</span></li>
</ul>
<span style="font-weight: 400;">I really hope not to have lost anyone along the way, because we're now going to dig in deep !</span>


