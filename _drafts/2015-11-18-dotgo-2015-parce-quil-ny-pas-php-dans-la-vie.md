--- layout: post title: 'dotGo 2015 : parce qu''il n’y a pas que PHP
dans la vie' author: achaysinh date: '2015-11-18 18:34:27 +0100'
date\_gmt: '2015-11-18 17:34:27 +0100' categories: - Non classé tags: -
conférence - go --- {% raw %}

Parce qu'il n’y a pas que PHP dans la vie, j’ai décidé d’assister au
[dotGo](http://www.dotgo.eu/) 2015, la conférence européenne sur le
[Go](https://golang.org/). Ce langage open source et créé, à la base,
par une équipe de Google, vient d’avoir 6 ans, et [certains puristes ne
jurent déjà que par
lui](https://www.quora.com/Is-Google-Go-worth-learning). Voici un résumé
des présentations de l’unique journée de conférence:

> .[@francesc](https://twitter.com/francesc) talking about implementing
> FP primitives with Go. Here Haskell's 'Maybe'. Fun.
> [\#dotgoeu](https://twitter.com/hashtag/dotgoeu?src=hash)
> [\#dotgo](https://twitter.com/hashtag/dotgo?src=hash)
> [pic.twitter.com/ZVHmhrSsRs](https://t.co/ZVHmhrSsRs)
>
> — Sam Bessalah (@samklr) [9 Novembre
> 2015](https://twitter.com/samklr/status/663665425373396992)

 

1.  **Happiness **[: Péter Bourgon rappelle que les micro services
    peuvent entraver le débuggage quand ils sont nombreux, et que le
    Golang n’était pas facile à manipuler à ses débuts. Mais il avoue
    tout de même qu’il est heureux de travailler
    avec..]{style="font-weight: 400;"}
2.  **Systèmes distribués **[: Verónica López raconte l’expansion du
    langage depuis quelques années.]{style="font-weight: 400;"}
3.  **Tools **[: Fatih Arslan fait une démo des outils pour développer
    en Go, du générateur de code au linter en passant par le chercheur
    de définition, mais sans s’étayer sur les packages de
    test.]{style="font-weight: 400;"}
4.  **Functional Go **[: ]{style="font-weight: 400;"}[Francesc Campoy
    Flores ]{style="font-weight: 400;"}[s’amuse à coder en Go comme s’il
    s’agissait de haskell, avec variables immutables et first class
    functions. En conclusion, c’est faisable mais lent et non
    adapté.]{style="font-weight: 400;"}
5.  **Lightning talk**[ techniques : des informations techniques
    diverses: utilisation des certificats SSL, témoignage de gain de
    performance, package python qui convertit du python en Go, gestion
    de http2 avec go1.6.]{style="font-weight: 400;"}
6.  **Internal Go **[: Alan Shreve expose sur la contribution open
    source, on ne peut pas aider sans comprendre l’architecture d’une
    app]{style="font-weight: 400;"}
7.  **Svgo **[: Anthony Starks présente sa lib de manipulation
    vectorielle]{style="font-weight: 400;"}
8.  **Bleve full text search **[: ]{style="font-weight: 400;"}[Marty
    Schoch ]{style="font-weight: 400;"}[explique les différents filtres
    utilisés par les recherches full texte et raconte comment les
    contributions internationales ont fait évoluer son projet open
    source]{style="font-weight: 400;"}
9.  **Mobile go **[: ]{style="font-weight: 400;"}[David Crawshaw
    ]{style="font-weight: 400;"}[détaille comment les Goroutines sont
    transformés en processus du système
    d’exploitation]{style="font-weight: 400;"}
10. **Worker go **[: ]{style="font-weight: 400;"}[Matt Aimonetti
    ]{style="font-weight: 400;"}[optimise en live un worker
    Go]{style="font-weight: 400;"}
11. **Go at Docker’s **[: ]{style="font-weight: 400;"}[Jessica Frazelle
    ]{style="font-weight: 400;"}[partage des petites anecdotes et bugs
    liés au Go chez Docker]{style="font-weight: 400;"}
12. **Simple is complicated **[: Rob Pyke, l’un des créateurs du
    langage, raconte comment il a été difficile de le concevoir pour
    qu'il soit simple. Go est un langage fixé et ajouter des features
    n’en est absolument pas la philosophie]{style="font-weight: 400;"}

 

> Jason Hickey about running Go in Chrome and vanadium at
> [\#dotgoeu](https://twitter.com/hashtag/dotgoeu?src=hash)
> [pic.twitter.com/eMTKa970rx](https://t.co/eMTKa970rx) — Charles
> Sarrazin (@csarrazi) [9 Novembre
> 2015](https://twitter.com/csarrazi/status/663720318154973185)

**Ça valait le coup ?**

[Tout à fait. Je pense que [tout développeur se doit de s’intéresser à
d’autres
langages](http://blog.teamtreehouse.com/learn-a-new-programming-language-every-year)
et à leurs mécaniques. Même sans comprendre toutes les subtilités du Go,
l’expérience a été très enrichissante en tous points. Je continuerai à
garder un oeil sur le Golang.]{style="font-weight: 400;"}

 

> This is the best representation of a map function I've even seen!
> [@francesc](https://twitter.com/francesc)
> [\#DotGoEu](https://twitter.com/hashtag/DotGoEu?src=hash)
> [pic.twitter.com/HBehkUhvTY](https://t.co/HBehkUhvTY)
>
> — Micha Mazaheri (@mittsh) [9 Novembre
> 2015](https://twitter.com/mittsh/status/663663348312092672)
>
>  

**Mais le Golang, c’est demandé/utilisé ?** [En France, à part MailJet
qui était un ambassadeur de la conférence, je n’ai jamais entendu parler
de sociétés qui le mettent en avant. Même les entreprises de formation
n’ont pas l’air de s’en soucier. \#dotgoeu a été très “influent” sur
Twitter ce jour là vers San Francisco.]{style="font-weight: 400;"}

 

> San Francisco 1 TensorFlow 2
> [\#TacoEmojiEngine](https://twitter.com/hashtag/TacoEmojiEngine?src=hash)
> 3
> [\#mondaymotivation](https://twitter.com/hashtag/mondaymotivation?src=hash)
> 4 [\#satsummit](https://twitter.com/hashtag/satsummit?src=hash) 5
> Fallout 4 6 [\#dotgoeu](https://twitter.com/hashtag/dotgoeu?src=hash)
> [pic.twitter.com/jX4Hago2xs](https://t.co/jX4Hago2xs) — Trend Topics
> USA (@TrendTopicsUSA) [9 Novembre
> 2015](https://twitter.com/TrendTopicsUSA/status/663749439241097217)

**Ah ça sert à rien alors...**

[Ce n'est probablement pas le meilleur choix pour du développement web.
Mais encore une fois, un développeur se doit d’être curieux des
évolutions dans le milieu, ne serait-ce que pour s’adapter à la demande
du marché. Dans le meilleur des cas, il le fait par
passion.]{style="font-weight: 400;"}

{% endraw %}
