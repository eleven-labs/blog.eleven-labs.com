---
layout: post
title: 'Understanding SSL/TLS: Part 1 - What is it?'
authors:
- ibenichou
lang: en
permalink: /understanding-ssltls-part-1/
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

You've certainly heard about SSL or TLS protocols.
We're going to see what it's all about together.


In order to do that, this subject will be decomposed in 5 parts, each of them posted every day until friday.

1.  What is it?
2.  Encryption
3.  Certificates
4.  Handshake Protocol
5.  Record Protocol

First of all, a little history lesson: fasten your seat belt, let's start with part 1!

### **So, what is it?**

SSL and TLS are cryptographic protocols that provide communications security.

They behave like an additional intermediate layer between the transport layer (TCP) and the applicative one (HTTP, FTP, SMTP...) (see diagram below)

This means that they can be used to secure a web transaction, sending or receiving emails...

Until now, everything's right!

SSL and TLS are invisible to the user, and don't require a usage of protocol of specific application.

_OSI Model with SSL/TLS_

![tls-in-osi](/assets/2016-12-21-understanding-ssltls-part-1/tls-in-osi.png)

_Bottom line:_

SSL and TLS protocols allow to exchange secure information between to computers.

They are responsible for the following three things:

1.  **Confidentiality**: it's impossible to spy on exchanged information. Client and server must have the insurance that their conversation can't be listened to by someone else. This is ensured by an **encryption ****algorithm**.
2.  **Integrity**: it's impossible to falsify exchanged information. A client and a server must ensure that transmitted messages are neither truncated nor modified (integrity), and that they come from an expected sender. These functionalities are done by **signature of data**.
3.  **Authentication**: it allows to be sure of the software identity, the person or corporation with which we communicate. Since SSL **3.0**, the server can also ask the client to authenticate, ensured by the use of **certificates**.

TLS and SSL protocols are based on a combination of several cryptographic concepts, dealing with both **asymmetrical** and **symmetrical encryption** (we'll discuss about this in a related part of this article).

Moreover, these protocols are bound to evolve, independent from cryptographic algorithm and authentication set in a transaction. This allows them to adapt to users needs and have better security because those protocols are not impacted by technical evolution of cryptography (if an encryption becomes obsolete, the protocol can still be exploited by choosing a more secure encryption).

**History:**

**A - SSL**:

SSL means **Secure Socket Layer.**

*   Developed by Netscape in **1994,** version **1.0** stayedinternal and had never been released ;
*   The first real SSL version is **2.0**, released in **February, **1995**. It's the first implementation of SSL that was banned in march 2011 ([RFC 6176](https://tools.ietf.org/html/rfc6176)){:rel="nofollow"} ;
*   In **November, 1996** SSL releases **3.0**, last version to this day, which will inspire **TLS**, its successor. Its specifications were re-edited in august, 2008 in [RFC 6101](https://tools.ietf.org/html/rfc6101)[4](https://fr.wikipedia.org/wiki/Transport_Layer_Security#cite_note-4). The protocol was banned in 2014, following the [POODLE](https://fr.wikipedia.org/wiki/POODLE) breach. The banishment was definitely ratified in June of 2015 ([RFC 7568](https://tools.ietf.org/html/rfc7568)){:rel="nofollow"}.

**B - TLS:**

TLS means **Transport Layer Security**.

The development of this protocol has been continued by [IETF](https://www.ietf.org/){:rel="nofollow"}.

TLS protocol is not structurally from version 3 of SSL, but modifications in the use of hash functions result in a non-interoperability of both protocols.

Although TLS, like SSLv3, has an ascending compatibility with previous versions, meaning that at the beginning of the **negotiation **phase, client and server negotiate the best version of the protocol available in common. For security reasons (mentioned above), TLS compatibility with SSL v2 has been dropped.

What also differentiates TLS from SSL is that **asymmetrical keys **generation is a little more secured in SSL than in SSLV3, where not one step is uniquely based on MD5 (where weaknesses have appeared in [cryptanalysis](https://en.wikipedia.org/wiki/Cryptanalysis)){:rel="nofollow"}.

*   In **January 1993**: IETF publishes **TLS 1.0**. Lots of improvements are then brought:
    *   October 1999 ([RFC 2712](https://tools.ietf.org/html/rfc2712)) : Added protocol [Kerberos](https://en.wikipedia.org/wiki/Kerberos_(protocol)){:rel="nofollow"} to TLS
    *   May 2000 ([RFC 2817](https://tools.ietf.org/html/rfc2817) and [RFC 2818](https://tools.ietf.org/html/rfc2818)){:rel="nofollow"} : Migration  to TLS during a HTTP 1.1 session
    *   June 2002 ([RFC 3268](https://tools.ietf.org/html/rfc3268)) : Support of [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard){:rel="nofollow"} encryption system via TLS
*   April 2006 ([RFC 4346](https://tools.ietf.org/html/rfc4346)){:rel="nofollow"} : Publication of **TLS 1.1**.
*   August 2008 ([RFC 5246](https://tools.ietf.org/html/rfc5246)){:rel="nofollow"} : Publication of **TLS 1.2**.
*   March 2011 ([RFC 6176](https://tools.ietf.org/html/rfc6176)){:rel="nofollow"} : SSLv2 compatibility of all TLS versions dropped.
*   April 2014: first draft of **TLS 1.3**.
*   June 2015 ([RFC 7568](https://tools.ietf.org/html/rfc7568)){:rel="nofollow"} : compatibility with SSLv2 and SSLv3 dropped.
*   October 2015: new draft of **TLS 1.3**

**Browsers:**

Most browsers support TLS 1.0\. Browsers supporting by default TLS 1.1 and 1.2 are:

*   Apple Safari 7 and next;
*   Google Chrome and Chromium 30 and next;
*   Microsoft Internet Explorer 11 and next;
*   Mozilla Firefox 27 and next;
*   Opera 17 and next.
*   Microsoft Edge

I really hope not to have lost anyone along the way, because we're now going to dig in deep !
