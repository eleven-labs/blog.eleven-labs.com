--- layout: post title: 'Understanding SSL/TLS: Part 1 - What is it?'
author: rpierlot date: '2016-12-21 11:46:42 +0100' date\_gmt:
'2016-12-21 10:46:42 +0100' categories: - Non classé tags: - security -
protocols - encryption - SSL - TLS --- {% raw %}

[You've certainly heard about SSL or TLS
protocols.]{style="font-weight: 400;"}[\
]{style="font-weight: 400;"}[We're going to see what it's all about
together.\
]{style="font-weight: 400;"}

[In order to do that, this subject will be decomposed in 5 parts, each
of them posted every day until friday.]{style="font-weight: 400;"}

1.  [What is it?]{style="font-weight: 400;"}
2.  [Encryption]{style="font-weight: 400;"}
3.  [Certificates]{style="font-weight: 400;"}
4.  [Handshake Protocol]{style="font-weight: 400;"}
5.  [Record Protocol]{style="font-weight: 400;"}

[First of all, a little history lesson: fasten your seat belt, let's
start with part 1!]{style="font-weight: 400;"}

### **So, what is it?**

[SSL and TLS are cryptographic protocols that provide communications
security.]{style="font-weight: 400;"}

[They behave like an additional intermediate layer between the transport
layer (TCP) and the applicative one (HTTP, FTP, SMTP...) (see diagram
below)]{style="font-weight: 400;"}

This means that they can be used to secure a web transaction, sending or
receiving emails...

[Until now, everything's right!]{style="font-weight: 400;"}

[SSL and TLS are invisible to the user, and don't require a usage of
protocol of specific application.]{style="font-weight: 400;"}

*[OSI Model with SSL/TLS]{style="font-weight: 400;"}*

[![tls-in-osi](http://blog.eleven-labs.com/wp-content/uploads/2016/11/tls-in-osi-300x202.png){.size-medium
.wp-image-2563 .aligncenter width="300"
height="202"}](http://blog.eleven-labs.com/wp-content/uploads/2016/11/tls-in-osi.png)

*[Bottom line:]{style="font-weight: 400;"}*

[SSL and TLS protocols allow to exchange secure information between to
computers.]{style="font-weight: 400;"}

[They are responsible for the following three
things:]{style="font-weight: 400;"}

1.  **Confidentiality**[: it's impossible to spy on exchanged
    information. Client and server must have the insurance that their
    conversation can't be listened to by someone else. This is ensured
    by
    an ]{style="font-weight: 400;"}**encryption[ ]{style="font-weight: 400;"}algorithm**.
2.  **Integrity**:[ it's impossible to falsify exchanged information. A
    client and a server must ensure that transmitted messages are
    neither truncated nor modified (integrity), and that they come from
    an expected sender. These functionalities are done by **signature of
    data**]{style="font-weight: 400;"}[.]{style="font-weight: 400;"}
3.  **Authentication**[: it allows to be sure of the software identity,
    the person or corporation with which we communicate. Since SSL
    ]{style="font-weight: 400;"}**3.0**[, the server can also ask the
    client to authenticate, ensured by the use of
    **certificates**]{style="font-weight: 400;"}[.]{style="font-weight: 400;"}

TLS and SSL protocols are based on a combination of several
cryptographic concepts, dealing with
both **asymmetrical*** *and **symmetrical[ encryption]{style="font-weight: 400;"}** (we'll
discuss about this in a related part of this
article[).]{style="font-weight: 400;"}

[Moreover, these protocols are bound to evolve, independent from
cryptographic algorithm and authentication set in a transaction. This
allows them to adapt to users needs and have better security because
those protocols are not impacted by technical evolution of cryptography
(if an encryption becomes obsolete, the protocol can still be exploited
by choosing a more secure encryption).]{style="font-weight: 400;"}

**History:**

**A - SSL**[:]{style="font-weight: 400;"}

[SSL means ]{style="font-weight: 400;"}**Secure Socket Layer.**

-   [Developed by Netscape in ]{style="font-weight: 400;"}**1994,**
    version **1.0** stayed** **internal and had never been
    released[ ;]{style="font-weight: 400;"}
-   The first real SSL version is **2.0**, released
    in **February,[ **1995**]{style="font-weight: 400;"}**. It's the
    first implementation of SSL that was banned in march
    2011[ (]{style="font-weight: 400;"}[[RFC
    6176]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc6176)[)
    ;]{style="font-weight: 400;"}
-   [In ]{style="font-weight: 400;"}**November[, **1996**
    ]{style="font-weight: 400;"}**[SSL
    releases ]{style="font-weight: 400;"}**3.0**[, last version to this
    day, which will inspire **TLS**, its
    successor]{style="font-weight: 400;"}[. Its specifications were
    re-edited in august, 2008 in ]{style="font-weight: 400;"}[[RFC
    6101]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc6101)[[4]{style="font-weight: 400;"}](https://fr.wikipedia.org/wiki/Transport_Layer_Security#cite_note-4)[.
    The protocol was banned in 2014, following
    the ]{style="font-weight: 400;"}[[POODLE](https://fr.wikipedia.org/wiki/POODLE) breach.
    The banishment was definitely ratified in June of
    2015 ]{style="font-weight: 400;"}[(]{style="font-weight: 400;"}[[RFC
    7568]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc7568)[).]{style="font-weight: 400;"}

**B - TLS:**

[TLS means ]{style="font-weight: 400;"}**Transport Layer
Security**[.]{style="font-weight: 400;"}

[The development of this protocol has been continued by
]{style="font-weight: 400;"}[[IETF]{style="font-weight: 400;"}](https://www.ietf.org/)[.]{style="font-weight: 400;"}

[TLS protocol is not structurally from version 3 of SSL, but
modifications in the use of hash functions result in a
non-interoperability of both protocols.]{style="font-weight: 400;"}

Although TLS, like SSLv3, has an ascending compatibility with previous
versions, meaning that at the beginning of
the **negotiation[ ]{style="font-weight: 400;"}**phase, client
and server negotiate the best version of the protocol available in
common. For security reasons (mentioned above), TLS compatibility with
SSL v2 has been dropped.

What also differentiates TLS from SSL is
that **asymmetrical[ keys ]{style="font-weight: 400;"}**generation is a
little more secured in SSL than in SSLV3, where not one step is uniquely
based on MD5 [(where weaknesses have appeared in
[cryptanalysis](https://en.wikipedia.org/wiki/Cryptanalysis)]{style="font-weight: 400;"}[)]{style="font-weight: 400;"}[.]{style="font-weight: 400;"}

-   [In ]{style="font-weight: 400;"}**January[ 1993]{style="font-weight: 400;"}**[:
    IETF publishes ]{style="font-weight: 400;"}**TLS 1.0**[. Lots of
    improvements are then brought:]{style="font-weight: 400;"}
    -   [October 1999 (]{style="font-weight: 400;"}[[RFC
        2712]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc2712)[)
        : Added
        protocol ]{style="font-weight: 400;"}[[Kerberos]{style="font-weight: 400;"}](https://en.wikipedia.org/wiki/Kerberos_(protocol))[ to
        TLS]{style="font-weight: 400;"}
    -   [May 2000 (]{style="font-weight: 400;"}[[RFC
        2817]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc2817)[ and ]{style="font-weight: 400;"}[[RFC
        2818]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc2818)[)
        : Migration  to TLS during a HTTP 1.1
        session]{style="font-weight: 400;"}
    -   [June 2002 (]{style="font-weight: 400;"}[[RFC
        3268]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc3268)[)
        : Support
        of [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
        encryption system via TLS]{style="font-weight: 400;"}
-   [April 2006 (]{style="font-weight: 400;"}[[RFC
    4346]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc4346)[)
    : Publication of ]{style="font-weight: 400;"}**TLS
    1.1**[.]{style="font-weight: 400;"}
-   [August 2008 (]{style="font-weight: 400;"}[[RFC
    5246]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc5246)[)
    : Publication of ]{style="font-weight: 400;"}**TLS
    1.2**[.]{style="font-weight: 400;"}
-   [March 2011 (]{style="font-weight: 400;"}[[RFC
    6176]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc6176)[)
    : SSLv2 compatibility of all TLS versions
    dropped.]{style="font-weight: 400;"}
-   [April 2014: first draft of ]{style="font-weight: 400;"}**TLS
    1.3**[.]{style="font-weight: 400;"}
-   [June 2015 (]{style="font-weight: 400;"}[[RFC
    7568]{style="font-weight: 400;"}](https://tools.ietf.org/html/rfc7568)[)
    : compatibility with SSLv2 and SSLv3
    dropped.]{style="font-weight: 400;"}
-   [October 2015: new draft of ]{style="font-weight: 400;"}**TLS 1.3**

**Browsers:**

[Most browsers support TLS 1.0. Browsers supporting by default TLS 1.1
and 1.2 are:]{style="font-weight: 400;"}

-   [Apple Safari 7 and next;]{style="font-weight: 400;"}
-   [Google Chrome and Chromium 30 and next;]{style="font-weight: 400;"}
-   [Microsoft Internet Explorer 11 and
    next;]{style="font-weight: 400;"}
-   [Mozilla Firefox 27 and next;]{style="font-weight: 400;"}
-   [Opera 17 and next.]{style="font-weight: 400;"}
-   [Microsoft Edge]{style="font-weight: 400;"}

[I really hope not to have lost anyone along the way, because we're now
going to dig in deep !]{style="font-weight: 400;"}

{% endraw %}
