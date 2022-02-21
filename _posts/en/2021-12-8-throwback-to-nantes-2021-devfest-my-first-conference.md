---
layout: post
title: Throwback to Nantes' 2021 DevFest, my first conference
excerpt: "Finally! After 4 years of working as a web developer, I finally attended a conference linked to my job & passion: the DevFest Nantes."
lang: en
authors:
    - jbberthet
permalink: /throwback-to-nantes-2021-devfest-my-first-conference/
categories:
    - conference
---

![DevFest Nantes 2021's logo]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/devfest-logo.png)

Finally! After 4 years of working as a web developer, I finally attended a conference linked to my job & passion: the [DevFest Nantes](https://devfest2021.gdgnantes.com).

For the 9th edition, which took place on 21 & 22 of October, the theme was street art. Both the Google Developer Group (GDG) of Nantes and his partners on the event did a great job and the final result was stunning! Graffiti everywhere, basketball hoops, beers, video games and a photo booth were styling the lounge all along the event.

## What is the DevFest ?

Since 2012, the GDG of Nantes organises a festival dedicated to developers where speakers talk about many topics from the tech world (cloud, systems & networks, data, web & mobile development, soft skills, etc...).

During 2 days, speakers share their tech watch or experience with passionate people to let them know about the last technology they tried or tips they want to share.

It is also an opportunity to meet and share with tech lovers that work in a different environment and to extend one's professional network.

This year, they welcomed a little bit more than 2000 people per day during 2 days (speakers, journalists, developers, and others included).

## The talks I attended

### The opening keynote with Antonin Fourneau

_By Antonin Fourneau_

![Waterlight Graffiti]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/waterlight-graffiti.jpeg)

<center><i><small>Credits: Antonin Fourneau</small></i></center>

To open the DevFest, Antonin Fourneau has been introduced to talk about his "designer, artist, developer, maker, teacher" work.

Antonin is an artist that creates pieces of art from old technology and objects. His goal is to make these objects alive thanks to technology, but at a low cost.

He told us about his projects, mainly [Waterlight's graffiti](https://www.antoninfourneau.com/2020/09/10/waterlight-graffiti/), which is the reason why he was invited. This work is inspired from ephemeral street calligraphy with water he had the chance to see during a trip to China. By the sun’s heat, the water dry and the artwork evaporates in seconds. He then reproduced the idea with led lights that turn on when wet and off when dried, to create Waterlight Graffiti.

Antonin's work is curiously awesome, you can find his other projects on [his website](https://www.antoninfourneau.com/).

### Tips to fight the imposter syndrome

_By Aurélie Vache_

The imposter syndrome is a subject I feel concerned about. At my worst times, when I’m facing difficulties, I usually hear a little voice reminding me that things would be easier for others. The thing is that I'm not alone: this was also the case of numbers of people that attended the talk. What struck me was that I wasn’t the only one feeling that way : many of us in the talk felt
the same about it.

Aurélie reassured us. She basically explained that the imposter syndrome is linked to the feeling not to be legit. She proved us that it’s a matter of point of view: we think that we know less than others, and that our successes are due to luck.

_SPOILER ALERT_: we are wrong.

She gave us many tips to bypass the syndrome: list our successes, find communities, share and contribute, ask for feedback, do some pair programming and stay positive !

To summarize, she made us understand that a majority of developers have this syndrome, that we can handle it and that this is normal not to know everything.

### How to create a pure CSS game

_By Elad Schechter_

![Coronavirus Invaders]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/coronavirus-invaders.jpeg)

When the lockdown started, Elad prepared his apartment to make it feel cosy and a place where he feels good. During a week-end, he decided to code a pure CSS game related to the global health situation: Coronavirus Invaders. The game and its source code are [available on CodePen](https://codepen.io/elad2412/pen/wvabjXy).

To do it, he used multiple HTML & CSS tricks to avoid using JavaScript:

-   HTML `label` element and `input:radio` to define the coronavirus creatures to kill
-   HTML `label` & `input:checkbox` to navigate from page to page
-   The CSS `counter` feature to make the countdown
-   A form with a `input:reset` to return to the main menu from the game
-   etc...

I found this talk very inspiring, it helped me to remember how awesome our job is as we can do anything we want using code, the only barrier being our imagination.

### Quick guide to start a design system

_By Cécile Freyd-Foucault_

When and how should you start a design system?

This is the question Cecile answered, giving us a ton of tips to start. It’s clear she had a lot of experiences about it, whether good or bad. She was able to learn from her mistakes and explain to us how to succeed building our design system.

What seems primary for her is to start a design system for the good reasons and in a team (at least a designer and a developer). You have to explain why its’ necessary and convince the persons in charge while being totally transparent (pros, cons, workload & organization).

Then you’ll have to do an inventory, prioritize, document and engage people around the design system, both internally and externally.

I personally hope to have the opportunity to create a design system in a future project, as this is one of my goals as a developer. When this day will come, I’ll take my notes and I’ll apply this precious advices from Cécile!

### What if you learned how to code to your children

_By Stéphanie Moallic_

I don’t have children, but I was strangely curious about Stéphanie’s talk. Until then, I had no idea how to introduce programming to kids. Stéphanie has a daughter. “Mom, what is your job?” is a question she often has been asked, so decided out to answer her daughter involving her in toys programming!

Stéphanie explain us how to make programming playful, thanks to equipment and technologies linked to each other that allow one to animate toys, robots, etc... Thanks, for instance, to the [micro:bit](https://en.wikipedia.org/wiki/Micro_Bit) card. She even demonstrated it with her own robots, cars, and a Lego connected house!

During her talk, Stéphanie made me feel like a kid and in the end, I would really like to try this out. She will admit it, she’s the one playing most with all these toys!

### React Query, the easy server state for React

_By Olivier Thierry_

As a React developer, I was looking forward to this “quickie”. Olivier showcases us React Query, a server state manager (unlike client state manager’s Redux) developed by Tanner Linsley, well known for his contributions to the ReactJS community ([his GitHub](https://github.com/tannerlinsley) will confirm).

The main features of React Query are front-end/back-end synchronization, REST/GraphQL fetching, the query state management, cache management and cached data update. To enjoy these features, the library give us many hooks (`useQuery`, `useMutation` and `useQueryClient`).

Advanced features are also available, like paginated queries, “See more”, infinite scroll, query canceling, etc...

Olivier had the time to show us main features with source code and tell us about advanced ones in 15 minutes! Hats off to him, because in this short amount of time, he made me want to use it in my next side project...

### Next.js to the rescue of my front-end

_By Nordwin Hoff_

Next.js slowly becomes the future of the fast front-end development giving React a Node.js server that allow it doing some server side rendering.

Nordwin does a little reminder of what is Next.js and what does it bring to a project (he talks about rendering modes, lazy loading, integrated component, etc...) before he explains how he added it to an existing codebase.

I will not give you details as it’s very specific. That being said, his methodology to show us Next.js features worked well because it’s applied to a real case to which it’s easy to identify.

For me that does not know Next.js, it was a very interesting talk. To make it even better, Nordwin is a very fluent speaker.

### Vue 3 and its ecosystem

_By Nicolas Firzzarin_

I’ve always been interested in Vue.js but never went through it. I did the “Hello world” of the first versions, but I never took the time to study advanced concepts of Vue, and that’s why I attended this talk.

Vue 3 seems to be inspired from some React concepts to optimize the developer experience keeping its strength: performance.

The Composition API, reactive refs, proxy handlers, Suspense API, asynchronous components, libraries, etc... Everything is covered! Nicolas serves us all his knowledge on a plate, his talk is very consistent. The only issue for me was that he was comparing Vue 2 and Vue 3, but my lack of knowledge on Vue 2 did not allow me to observe the improvement made on Vue 3. A little reminder about Vue 2 would have been welcomed to help me appreciate the talk that seemed to me very complete!

### Art & entropy: Chaos in your front-end

_By Thibaud Courtoison_

I have to admit, the title of the talk attracts me, but means nothing to me. What will Thibaud talk about? I don’t know. Yet, I will attend his talk.

What a great decision! I discover chaos engineering, as he explains the origins (Netflix, 2011), which consists - to be short - of breaking things to look at the behaviour of the infrastructure, the application, etc...

Today, chaos engineering is mainly used in the infrastructure and back-end side. Thibaud brings us with him in his front-end chaos engineering experiments:

-   Disturbing HTTP queries (what will happen if the CDN that hosts the style files is down?)
-   Disturbing localization disturbing (what if the language has to be read from right to left, or is verbose?)
-   Disturbing timers (add a proxy on `setTimeout` and `setInterval`)
-   History check (what if a user clicks on previous then comes back, would the form still be filled in?)
-   What does happen if the user double clicks on the form submit button?
-   Accessibility: is the site still accessible with a `grayscale(100%)` CSS filter?

This is Thibaud’s proposal to set up chaos engineering in the front-end. He pushes it to its limits, watches how it reacts, then fix it.

## What I remember from my first conference

![Waouh]({{ site.baseurl }}/assets/2021-12-08-mon-retour-sur-le-devfest-nantes-ma-premiere-conference/waouh.jpeg)

On one hand, I felt a fervour during these two days that made me watch everywhere with amazed eyes. Everything seemed awesome to me and everyone looked accessible & nice.

On the other hand, I found during the talks the type of information I had already seen in videos, and that I thought was cool. From where I used to work (north-west of Brittany, France), I had the feeling that this world was apart and far from me. I now know that it’s an accessible world thus not fictive at all!

All these great knowledge mixed to the great mates I had all along the event - from the talks to the aperitifs - made me have two very enriching days professionally and personally.

So thanks to Nantes GDG and Eleven Labs that allowed me to attend my first conference! 🚀

See you soon!
