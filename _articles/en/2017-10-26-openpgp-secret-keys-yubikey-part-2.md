---
contentType: article
lang: en
date: '2017-10-26'
slug: openpgp-secret-keys-yubikey-part-2
title: OpenPGP - Export Secret Keys to a Yubikey
excerpt: >-
  After generating the OpenPGP keys, we will see how to store them on a USB key
  like the Yubikey. This will allow us to further secure our secret keys.
cover: /assets/2017-10-24-openpgp-clef-secrete-yubikey-partie-2/cover.jpg
categories: []
authors:
  - tthuon
keywords:
  - openpgp
  - security
  - yubikey
---

We saw in the previous article [the generation of OpenPGP keys](/fr/openpgp-paire-clef-presque-parfaite-partie-1/).
As a reminder, we have in our keychain private keys:

```bash
wilson@spaceship:~$ gpg2 --list-secret-keys

sec#  rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-05]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
ssb   rsa4096/B73A9C79 2017-10-05 [E] [expires: 2018-10-05]
ssb   rsa4096/9CC8B2FB 2017-10-05 [S] [expires: 2018-10-05]
ssb   rsa4096/8047B454 2017-10-05 [A] [expires: 2018-10-05]
```

We also exported the keys in files:
* 1A8132B1.priv.asc: contains all private keys
* 1A8132B1.pub.asc: contains all public keys
* 1A8132B1.sub_priv.asc: contains only the private keys of the subkeys

With this configuration, we have an effective strategy against theft or loss of the private key that is used for certification.
If an attacker take the computer, he will not be able to certify another key. However, the private keys that allow
to sign, encrypt and authenticate are still present on the computer. So, in case of the theft of the keys, it would be possible
to sign messages during a certain time (the time that the stolen subkey is revoked).

To counter this attack, it is possible to place private keys in a smart card. These devices are
very resistant to key extraction techniques. In addition to physical attacks, there is a pin code with 3 tries only. Then it's locked.

We will see in this article the export of the private keys of the subkeys in a smart card. For this example, I will use
a Yubikey 4.

### Yubikey, what is it?

Yubikey is a device the size of a classic USB key. This key makes it possible to perform double authentication on website,
such as Google or Github. Thus, if a person is in possession of both the email and the password of the victim, the attacker
will not be able to connect without this usb key. This is the principle of double authentication, you must be in possession of two secrets.

Yubikey implements an open protocol: *universal 2nd factor*.

In addition to this main protocol, it supports others: OpenPGP, TOTP, HOTP, challenge-response.

The one that will interest us is OpenPGP.

### How to get one

I recommend you go through [the official store](https://www.yubico.com/product/yubikey-4-series/)
to ensure the origin of the product. We are on products related to safety, it's important to know where the purchased product comes from.

For those who have a Github account, there is a [promotional offer that allows to have -10%](https://www.yubico.com/github-special-offer/) on the cart. Interesting :).
However, it's valid only once. I recommend you order at least 2 products. The second will be useful to make a backup in the unfortunate event of the loss of the first one.

Last but not least, our OpenPGP key was generated with a size of 4096 bits. Only the version 4 of the Yubikey allows
to save keys of this size. Version 3 and NEO only support keys up to 3072 bits.

### Install the necessary tools

As a reminder, we started our generation of OpenPGP key with a machine running Ubuntu 16.04 and GnuPG 2.1.11. To be able to
export the keys to the Yubikey, we need to install additional tools beforehand.

```bash
wilson@spaceship:~$ sudo apt-get install -y gnupg-agent pinentry-curses scdaemon pcscd yubikey-personalization libusb-1.0-0-dev
```

### Customize the Yubikey with gpg

Before using the Yubikey, check that the warranty tape has not been broken. If so, do not use it.

Insert the Yubikey into a USB port and type the following command to verify that the card is well recognized.

```bash
wilson@spaceship:~$ gpg2 --card-status
Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240102010006064764950000
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: 06476495
Name of cardholder: [not set]
Language prefs ...: [not set]
Sex ..............: unspecified
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
```

The card is blank, there is no personal information. It is recommended to supplement the information in case a
nobody would find this key.

Edit the card and switch to admin mode. You can enter `help` to get the list of available commands.

```bash
wilson@spaceship:~$ gpg2 --card-edit
gpg/card> admin
Admin commands are allowed
```

First of all, we'll change the PIN key administration code and user PIN. By default, the administrator PIN is 12345678 and the user PIN is 123456.

The administrator PIN is required for some operations on the card, such as the key export, and to unlock when a PIN code has been entered 3 times by mistake.

Enter `passwd` to change them. Let's start with the administrator PIN and then the user PIN.

```
gpg/card> passwd
gpg: OpenPGP card no. D2760001240102010006064764950000 detected

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 3
PIN changed.

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 1
PIN changed.

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? q
gpg/card>
```

Then enter the information to customize your key:

```bash
gpg/card> name
Cardholder's surname: Wilson
Cardholder's given name: Eleven

gpg/card> lang
Language preferences: fr

gpg/card> login
Login data (account name): wilson.eleven@labs.com

gpg/card> sex
Sex ((M)ale, (F)emale or space): m

gpg/card> quit
```

The key is now configured. We can export the private keys of the subkeys in the smart card.

### Export the keys to the Yubikey

The goal is to move the secret keys of the subkeys into the Yubikey. In order to do so, we will
select each subkey one by one with the `key n` command and move it in the card with` keytocard`.
In the end, there will be no more secrets in the gpg keychain.

Let's edit the key.

```bash
wilson@spaceship:~$ gpg2 --expert --edit-key 1A8132B1
gpg (GnuPG) 2.1.11; Copyright (C) 2016 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

Let's export the encryption key to `B73A9C79`.

```bash
gpg> key 1

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb* rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>
```

The small asterisk in front of the key's fingerprint indicates that it's selected.

Enter `keytocard` to export it to the Yubikey. Then type `2` which is the only choice. The Yubikey can store the 3 types
subkeys.

```bash
gpg> keytocard
Please select where to store the key:
   (2) Encryption key
Your selection? 2

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb* rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>
```

gpg will ask you for the password of the secret encryption key and then the admin pin code of the Yubikey key.
Once the Yubikey admin pin code entered, the secret encryption key is in the Yubikey. We can check it right after
moving the other two keys.

Let's select the signature key. Deselect the first key and select the second.

```bash
gpg> key 1

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> key 2

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb* rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

The second key is well selected because there is the small asterisk in front of the key `9CC8B2FB`.

Repeat the operation with `keytocard` command and select `1` because it's a key signature.

```bash
gpg> keytocard
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 1

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb* rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

It's ok for the second key. Repeat with the third.

```bash
gpg> key 2

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb  rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> key 3

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb* rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg> keytocard
Please select where to store the key:
   (3) Authentication key
Your selection? 3

pub  rsa4096/1A8132B1
     created: 2017-10-05  expires: 2018-10-05  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/B73A9C79
     created: 2017-10-05  expires: 2018-10-05  usage: E
     card-no: 0006 06476495
ssb  rsa4096/9CC8B2FB
     created: 2017-10-05  expires: 2018-10-05  usage: S
ssb* rsa4096/8047B454
     created: 2017-10-05  expires: 2018-10-05  usage: A
[ultimate] (1). Wilson Eleven <wilson.eleven@labs.com>

gpg>
```

We are done. Type `save` and` quit`.

Let's check that we do not have any secret keys in our gpg keychain anymore.

```bash
wilson@spaceship:~$ gpg2 --list-secret-keys
/home/wilson/.gnupg/pubring.gpg
--------------------------------
sec#  rsa4096/1A8132B1 2017-10-05 [C] [expires: 2018-10-05]
uid         [ultimate] Wilson Eleven <wilson.eleven@labs.com>
ssb>  rsa4096/B73A9C79 2017-10-05 [E] [expires: 2018-10-05]
ssb>  rsa4096/9CC8B2FB 2017-10-05 [S] [expires: 2018-10-05]
ssb>  rsa4096/8047B454 2017-10-05 [A] [expires: 2018-10-05]
```

The chevron `>` before `ssb` indicates that the secret key does not exist for this key. It's a stub.

Let's check that these secret keys are in the Yubikey.

```bash
wilson@spaceship:~$ gpg2 --card-status

Reader ...........: 1050:0407:X:0
Application ID ...: D2760001240102010006064764950000
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: 06476495
Name of cardholder: Eleven Wilson
Language prefs ...: fr
Sex ..............: male
URL of public key : [not set]
Login data .......: wilson.eleven@labs.com
Signature PIN ....: not forced
Key attributes ...: rsa4096 rsa4096 rsa4096
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
Signature key ....: 49B7 73DB 292F 8A66 C254  AC97 69FE 9865 9CC8 B2FB
      created ....: 2017-10-05 11:39:18
Encryption key....: 88CD 3F3C BA60 1AFD D0A6  22E9 FE2B A21E B73A 9C79
      created ....: 2017-10-05 11:36:19
Authentication key: 0E2F 255E DE28 F044 474D  E571 F000 F81C 8047 B454
      created ....: 2017-10-05 11:43:21
General key info..: sub  rsa4096/9CC8B2FB 2017-10-05 Wilson Eleven <wilson.eleven@labs.com>
sec#  rsa4096/1A8132B1  created: 2017-10-05  expires: 2018-10-05
ssb>  rsa4096/B73A9C79  created: 2017-10-05  expires: 2018-10-05
                        card-no: 0006 06476495
ssb>  rsa4096/9CC8B2FB  created: 2017-10-05  expires: 2018-10-05
                        card-no: 0006 06476495
ssb>  rsa4096/8047B454  created: 2017-10-05  expires: 2018-10-05
                        card-no: 0006 06476495
```

We find the personal information in the first part. Then there is the information
on the keys stored in the Yubikey.

We see that there is the chevron `>` before `ssb`. As seen above, this indicates the absence of the secret key in the
keychain. Just below, there is an extra line that tells gpg where to find the secret key.
Here we have the serial number of the Yubikey `card-no: 0006 06476495`. This serial number is also printed on the key physically.
If you have multiple Yubikeys, it will be easy to find the one you are looking for.

### Conclusion

Through these first two articles, we covered the creation of an OpenPGP key and the export of secrets on a smart card.
The use of a smart card provides additional protection against the theft of secret keys.
It will not be enough to hack the computer to steal them, but it will be necessary to physically steal
the key and the associated PIN code to use the secret keys. Moreover, as seen in the introduction, the secret
key cannot be extracted. Our key is well protected, except against the human factor which remains the only threat.

In addition, you can distribute your public key on [a key server](https://pgp.mit.edu/) and other services (GitHub, Kraken, keybase.io).
This allows you to receive encrypted messages, and [sign your commits](https://help.github.com/articles/signing-commits-using-gpg/)
on GitHub (example on this commit [31dd621](https://github.com/eleven-labs/blog.eleven-labs.com/commit/31dd621db58a7ee1428bc9615c23e74d5ac98c3f)).

In a future article, we will set up a backup strategy to cover for the potential loss of secret keys. An error can quickly happen,
like erasing your computer following a ransomware.

### Article en relation
* [OpenPGP - The almost perfect key pair (part 1)](/openpgp-almost-perfect-key-pair-part-1/)
* [OpenPGP - Export Secret Keys to a Yubikey (part 2)](/openpgp-secret-keys-yubikey-part-2/)
* [OpenPGP - Long term storage (part 3)](/fr/openpgp-stockage-froid-clefs-partie-3/)
* [OpenPGP - I was in a Key Signing Party (part 4)](/fr/openpgp-clef-participe-a-une-fete-de-la-signature-des-clefs/)

### Resources

- [wikipedia - Universal 2nd Factor](https://en.wikipedia.org/wiki/Universal_2nd_Factor)
- [fidoalliance -Universal 2nd Factor (U2F) Overview](https://fidoalliance.org/specs/fido-u2f-overview-ps-20150514.pdf)
- [YubiKey 4 series](https://www.yubico.com/products/yubikey-hardware/yubikey4/)
- [Yubico Expands FIPS Security Certification ](https://www.yubico.com/2016/05/yubikey-gains-support-for-higher-levels-of-federal-crypto-standards/)
- [wikipedia - FIPS 140-2](https://en.wikipedia.org/wiki/FIPS_140-2#Level_1)
- [Cryptographic Module Validation Program](https://csrc.nist.gov/projects/cryptographic-module-validation-program/Certificate/2267)
- [Guide to using YubiKey as a SmartCard for GPG and SSH](https://github.com/drduh/YubiKey-Guide)
- [RFC4880](https://tools.ietf.org/html/rfc4880)
- [Nitrokey Storage Got Great Results in a 3rd Party Security Audit](https://www.nitrokey.com/news/2015/nitrokey-storage-got-great-results-3rd-party-security-audit)
- [Secure Hardware vs. Open Source ](https://www.yubico.com/2016/05/secure-hardware-vs-open-source/)
- [Yubico has replaced all open-source components](https://www.reddit.com/r/linux/comments/4ls94a/yubico_has_replaced_all_opensource_components/)
- [Cover image source](https://www.yubico.com/press/images/)

### Remarks

This tutorial uses a Yubikey for storing secrets. Yubikey is the most popular key in the general public, especially
for the second authentication factor feature. There are other keys that support OpenPGP such as [NitroKey](https://www.nitrokey.com/).
Unlike the Yubikey, the NitroKey is open-source. Security with closed and proprietary hardware is not a viable solution in the long term.
It's also contradictory to the OpenPGP spirit, that aims to be open. However, I chose the Yubikey for its ease of implementation and its ability to do double authentication.
