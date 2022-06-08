---
layout: post
title: Responsive typography and why you should care
excerpt: DESCRIPTION (VISIBLE SUR LA HOME)
authors:
    - meugeniatr
permalink: /en/responsive-typography-why-you-should-care/
categories:
    - css
    - ux
    - front-end
tags:
    - css
    - ux
    - front-end
cover: /assets/2022-08-06-responsive-typography/books.jpg
---

How many times have you been aware of text's different shapes and sizes while browsing the web lately? Probably not many, unless you found an extremely uncomfortable typography that pushed you to quickly flee the website.

Typography is a silent tool that UX designers and developers can sometimes take for granted. **There is much noise around this topic**. Pixels? Are breakpoints enough to switch sizes across devices? Do we even need breakpoints at all?

Let’s find out about a few key concepts to succeed at a responsive typography as a front-end developer as well as UX designers.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-06-responsive-typography/books.jpg" width="800px" alt="Open book displayed among many closed books" style="display: block; margin: auto;"/>
    <a href="https://www.freepik.com/photos/books-study">Books study photo created by mamewmy - www.freepik.com</a>
</div>

## How does readability impact web accessibility?

Ok, what’s the trick here? There is an incredibly extended and wonderful documentation about typography, but readability sometimes-forgotten concepts can give some clues about responsiveness and accessibility.

-   ### Type size 🔍
    The first readability factor to consider is the type size. The WCAG (Web Content Accessibility Guidelines) states that **accessible text should be resizable up to 200 percent without loss of content or functionality**.

Smaller text can be challenging for seniors, children or visually impaired people. Even if there is no official recommendation through this point nor WCAG directives, there is a growing consensus about **body text being at least 16px**.

For **heavy-text pages, even 18px or >20px** could even be suitable for a comfortable reading. Does it sound ridiculous? Check the body text on any medium.com article, such as [this one](https://kantrowitz.medium.com/face-to-face-with-dall-e-the-ai-artist-that-might-change-the-world-e9057e9e89a).

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-06-responsive-typography/medium-example.jpg" width="800px" alt="Post on medium with detail on font-size" style="display: block; margin: auto;"/>
</div>

### Should typography be smaller in mobile?

<div style="display: flex">
 <img src="{{ site.baseurl }}/assets/2022-08-06-responsive-typography/zoom-front-color.png" width="300px" alt="Magnifier glass" style="display: block; margin-right: 20px;"/>
 <p>
Perhaps an intuitive answer to this question is to think that the text needs to be smaller to fit on the phone screen, or perhaps the opposite…That the text should be larger to achieve a more comfortable experience when reading on a smaller screen!</p>
</div>

However, the answer is quite simple. **The size of the font in the body of the text is the same on desktop, tablet or mobile**. The companies that manufacture mobile devices have already solved this point by themselves. As front-end developers, our most critical practice is the way the font-size is implemented.

### Font units: why px can be accessibility enemies

The **px unit** is a very popular unit in the front-end development world. Even if more often than not its use is accepted for font sizes in typographical hierarchies, it **is not the way for creating a fully accessible body text in code**. Users can change the default font value on the browser!

This is why body text has a better result when using the **rem unit, which is relative to the font size of the root element**. All major browsers set a default font size of 16px, so this is the value that developers use as reference in their CSS code.

<div  class="admonition info"  markdown="1"><p  class="admonition-title">What is the root element? </p>
As the [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) documentation states, the root is the top-level element in an HTML document.
</div>

You probably know at this point that **rem** is not the only relative unit in CSS. There is also **em** units, which take the parent's font-size for calculating its value. Using rem is a more consistent approach for setting the size of your body text, since it has a fixed value that will scale predictably. I strongly recommend you to read this [article about px and accessibility](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/#unit-summaries) if you need to dive deeper in these waters.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="dyWZVgV" data-user="amirtaqiabadi" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/amirtaqiabadi/pen/dyWZVgV">
  px vs rem</a> by amir taqiabadi (<a href="https://codepen.io/amirtaqiabadi">@amirtaqiabadi</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### How and why to implement rem units for type size?

There a few different ways of implementing accessible font-size for body text. Take a few minutes to enumerate the possible ways this can be achieved. Did you think about tweaking the value from the HTML document ?

```css
/* Bad practice! It overrides any changes made by the user on the browser font-size. */
html {
    font-size: 16px;
}
```

This is a completely not-to-do. Applying a base font-size will override any change the user had done in the browser's settings. Maybe you have seen this trick that intends to make the math behind the usage of rem units easier by downsizing the equivalence of 1rem = 10px:

```css
/* Not recommended! It breaks the by-default convention 1rem = 16px*/
html {
    font-size: 62.5%;
}
```

This practice has even been promoted by CSS-tricks last May on Twitter... and it received little love from their followers:
https://twitter.com/css/status/1523700789083996160?s=20&t=CC56aWixbiPV7R_pqUOGcw

Changing the font size in the root is generally not great. It will either overwrite custom values or break any other usage of rem outside the typography. It is possible, but it will bring many changes regarding scalability.

Let's check a better way. Or two.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-06-responsive-typography/research-illustration.png" width="800px" alt="Researcher going for adventure" style="display: block; margin: auto;"/>
</div>

#### #1 - Use calc(): yes, but wait and see!

There's good news in this world of darkness. CSS has evolved through the years, and it has incorporated solving mathematical operations (+, -, /, \*).

This CSS function takes a [single expression as parameter and returns a value](https://developer.mozilla.org/en-US/docs/Web/CSS/calc). **The most powerful asset of calc() is the fact that it can mix different CSS units, and also supports CSS variables!**.

calc() can become handy when calculating typography size using rem units. It is possible to getting the proportional value in a single line:

```css
p {
    font-size: calc(18rem / 16);
}
```

Ok, this is quite practical. But you can take this magic to another level.

#### #2 - calc() + CSS variables: the winner !

As Joshua W. Comeau wonderfully explains in his article "The Surprising Truth About Pixels and Accessibility", it is possible to take out the most of calc() **by storing the calculated values in CSS variables**.

<div  class="admonition info"  markdown="1"><p  class="admonition-title">What are CSS variables? </p>
[CSS variables are custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) that store specific values that are reused several times through an app. They are written in a specific notation (e.g., `font-size: --font-size-xs`) and are accessed using the `var()` function.
</div>

```css
html {
    --font-size-extra-small: 0.75rem; /* 12 px */
    --font-size-small: 0.875rem; /* 14 px */
    --font-size-normal: 1rem; /* 16 px */
    --font-size-large: 1.125rem; /* 18 px */
}
```

Yes, it is almost the same. But in terms of scalability and practicity, this approach has it all!

### Ok, great... but what about fluid typography?

This technique introduces **breakpoints** in the font-sizing menu. Fluid typography is an enhacement that smoothly scales the font-size depending on the viewport width.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-08-06-responsive-typography/fluid-typography.png" width="800px" alt="Researcher going for adventure" style="display: block; margin: auto;"/>
</div>

Headings are great, and they should not be underestimated. They are clear visual keys ordering content at a glance, and they can totally use this

## Ressources

-   Accessible font sizing, explained:
    [https://css-tricks.com/accessible-font-sizing-explained/](https://css-tricks.com/accessible-font-sizing-explained/)
-   CSS for JS developers by Joshua W. Comeau:  
    [https://css-for-js.dev/](https://css-for-js.dev/)
-   CSS units:  
    [https://www.w3.org/Style/Examples/007/units.en.html](https://www.w3.org/Style/Examples/007/units.en.html)
-   Legibility vs. readability:
    [https://creativepro.com/legibility-and-readability-whats-the-difference/](https://creativepro.com/legibility-and-readability-whats-the-difference/)
-   Text resizing according to WCAG:
    [https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
-   The Surprising Truth About Pixels and Accessibility: [https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/)
