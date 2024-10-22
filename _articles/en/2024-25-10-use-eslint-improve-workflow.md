---
contentType: article
lang: en
date: '2024-25-10'
slug: use-eslint-improve-workflow
title: How to use ESLint to improve your workflow
excerpt: >-
  ESLint ecosystem can be super handy for JS and TS codebases, but are you using it right? Keep reading to learn about useful ESLint rules and a get a little bit more out it.
categories: []
authors:
  - meugeniatr
keywords:
  - javascript
  - typescript
---

## A few words about my experience using ESLint
I have to confess that ESLint and I haven't always been on the best of terms. My first steps with ESLint have been shy. I stuck to the the default setup within my first projects. Over time, I became more familiar with it, but only by struggling in my merge requests when unexpected updates from colleagues would cause issues in the repository. 

It might seem obvious, but there are many linters available that suit different projects and languages, such as [checkstyle](https://github.com/checkstyle/checkstyle) for Java, among others. In this article, I'll focus on ESLint for TypeScript and React codebases.

For a long time, ESLint felt distant to me, more like a satellite hovering around the codebase. While I had read about more advanced configurations, it didn't quite make enough noise to grab my attention. However, my interest slowly but surely grew in this widely popular tool. A turning point was attending the [JS Nation conference in Amsterdam](https://jsnation.com/) last summer, where Anthony Fu gave an insightful talk titled [ESLint One for All Made Easy](https://gitnation.com/contents/eslint-one-for-all-made-easy). His talk, which covered the new flat config feature introduced in ESLint 9, opened my eyes to how ESLint could be more versatile and customizable, especially for monorepos. I'll pick a little bit of this talk in this article, but I highly recommend watching his talk for a more detailed explanation. Anthony is fantastic!

## What is ESLint and why people use it?
ESLint was created by [Nicholas C. Zakas](https://github.com/nzakas) in 2013 as a successor to JSLint (Douglas Crockford, 2002) and its fork, JSHint (Anton Kovalyov, 2011). Like its predecessors, ESLint was designed for linting JavaScript projects, but with much greater flexibility and customization.

<div  class="admonition info"  markdown="1"><p  class="admonition-title">What is linting?</p>
_A *linter* is a static analysis tool used to identify and prevent bugs, stylistic errors, or unconventional code patterns. The term "lint" originally comes from the world of fabrics, referring to the small fibers that break off from tissues, causing issues for machines and making clothes look uneven or worn. In software development, a linter helps keep our large code sheet "clean," much like removing lint helps keep fabrics smooth._

_The concept of linting in computer science was first introduced in 1978 with a Unix utility for analyzing C code, created by Stephen C. Johnson during his debugging process._

</div>

While JSLint was a very opinionated linting tool, it was also groundbreaking. It opened a door to a different view on debugging, prioritizing code quality through static analysis and compilation optimizations. ESLint expanded on this concept, gaining popularity thanks to its highly customizable rule set and flexibility, which allowed developers to adapt it to various coding standards and environments. This versatility helped ESLint grow into the robust tool with a thriving community that it is today.

## How can ESLint improve your codebase?
ESLint is a very common tool for linting languages before the compilation phase. This means that developers can catch errors and identify styling rules in an earlier process than in a code review. And this is honestly quite useful for detecting technical issues and having a consistent codebase. All these can seem pretty obvious after explaining what a linter does. But I would like to share you how eslint can help not only your repository, but also your team.

Reviewing a merge request can become a problematic process when the comments circle around different stylistics points. This is when discussing ESLint rules can be a big relief for the team, since everyone can share their point of view about writing code and -hopefully- agree on a rule that will save time and frustration when reviewing. 

Well, this is already a big win but there's more. The same goes about code quality: linting can be a great objective tool to measure it and cut down some long exchanges about which way is better in technical reviews. This can also be a great help to junior developers who are still learning good practices or adjusting in the onboarding process of a codebase.

### Basic React and Typescript set-up
In any React and Typescript project, you have already installed and set up [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint), [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
 and [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react). If you didn't, then you should. This article 'takes for granted' that you are already using both of these tools.

### A few helpful rules
I have used ESLint for JS and TS projects, and in these experiences I found that this tool can avoid numerous comments in merge requests and upset dev teams. We have gathered a set of rules regarding the topics that kept coming back during the review process and discussed whether implementing them or not in technical meetings. The process has gone smoothly since then. Comments regarding style and conventions dropped dramatically, and it helped newcomers to adapt their writing to the repository too.

I think it has been a huge step forward, since it has also helped us to catch bugs and issues with types even if we already use TypesScript. These are the rules that, for me, have become essential:

-  ### Sorting types, objects, props

Sorting is tricky, but many times it can be pertinent to improve readability. So we adopted a bunch of rules to automatize this process:


  - [eslint-plugin-sort-destructure-keys](https://www.npmjs.com/package/eslint-plugin-sort-destructure-keys)

Maybe the easiest win, with only one option to customize (caseSensitive), this rule will sort every destructured object:

```js
/* caseSenditive true */
let { a, B, c } = obj; 🚫
let { B, a, c } = obj; ✅
```

- [perfectionist/sort-object-types](https://perfectionist.dev/rules/sort-object-types.html)

Perfectionist plugin can be mind blowing! This particular rule allows many options. I particularly like the fact that it allows types to be sorted by _required_ first, as well as being able to pass an array with particular keys that we want to see sorted first, such as "key" or "id".

```ts
/* before 🚫 */
type Department = {
  location: string
  departmentName?: string
  employees: number
  head?: string
  established?: Date
  id: string
}

/* after, using requiredFirst true and customGroups ✅*/
type Department = {
  id: string
  location: string
  departmentName?: string
  employees: number
  established?: Date
  head?: string
}
```
- [react/jsx-sort-props](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md)

Straigh from eslint-plugin-react, this rule sorts all props alphabetically... automatically! It has plenty of cool options for sorting callbacks, shorthands, etc. This is my favorite config:

```js
'react/jsx-sort-props': [
  'error',
    {
      callbacksLast: true,
      shorthandFirst: true,
      ignoreCase: true,
      noSortAlphabetically: false,
      reservedFirst: true,
    },
],
```

This will update your code like this:

```js
/* before 🚫 */
<Hello
  onClick={this._handleClick}
  active
  ref={ref}
  validate
  tel={5555555}
  name="John"
/>

/* after ✅*/
<Hello
  ref={ref} // reservedFirst: true
  active // shorthandFirst: true
  validate
  name="John"
  tel={5555555}
  onClick={this._handleClick} // callbacksLast: true
/>
```

### Code correctness

#### [typescript-eslint/no-unnecessary-condition](https://typescript-eslint.io/rules/no-unnecessary-condition/)

Any time a boolean expression always evaluates to the same value, this rule will catch it. It helps you remove unnecessary expressions that use the `??` operator, `?` operator and `if` conditions. ESLint will evaluate code that precedes an expression and it will deduce the correct type.

The following example shows the expression catching a value that will never be `undefined` so we don't need to check for it.

```ts
const obj: {value?: string;} = {}
obj.value = 'test';
// Unnecessary optional chain on a non-nullish value.
console.log(obj.value?.length) 
// Unnecessary conditional, expected left-hand side of `??` operator to be possibly null or undefined
console.log(obj.value.length ?? 0); 🚫
```

In the same manner, it can detect unnecessary conditions:

```js
const answer = 42;
// Unnecessary conditional, value is always falsy.
if (answer < 0) { 🚫
  console.log("Never happens");
}
```

#### [no-floating-promises/](https://typescript-eslint.io/rules/no-floating-promises/)

Unhandled (or wrongly handled), promises can lead to race conditions and unexpected behaviour.

This rule enforces that all promises have to be awaited, returned, voided, or have their `then()` or `catch()` function called.

Examples of bad promise handling:

```ts
// not awaited 🚫
const promise = new Promise((resolve, reject) => resolve('value'));
promise;

// Then called with a single parameter. 🚫
async function returnsPromise() {
  return 'value';
}
returnsPromise().then(() => {});

// Catch called with no parameter. 🚫
Promise.reject('value').catch();

// No then or catch.
Promise.reject('value').finally();

// Async called within a map instead of Promise.all 🚫
[1, 2, 3].map(async x => x + 1);
```

#### [require-await](https://typescript-eslint.io/rules/require-await/)

This rule checks for functions that are marked async that don't either return a promise or await a function in their code.


```ts
// Does not return a promise. 🚫
async function returnNumber() {
  return 1;
}
```

### Complexity
Simpler code is easier to read and maintain. ESLint community has developped many rules to help this happen. If your codebase does not use these rules yet, I advice you to add them as warnings and progressively refactor sections of the code.

#### [no-uneeded-ternary](https://eslint.org/docs/latest/rules/no-unneeded-ternary)

Some developers love their ternary operators. These rules will keep them in check.

The common mistake is to leave code like this after refactoring.

```ts
/* before 🚫 */
return answer ? true : false;
```

```ts
/* after ✅*/
return answer;
```

Another superfluous code this rule will find is when a ternary could be replaced by a simpler expression:

```ts
/* before 🚫 */
foo(bar ? bar : 1);

/* after ✅*/
foo(bar || 1)
```

#### [no-nested-ternary](https://eslint.org/docs/latest/rules/no-nested-ternary)

Nested get nasty. Nested ternaries are illegible so they should be avoided. Activating this rule will forbid them.


#### [complexity](https://eslint.org/docs/latest/rules/complexity)

Code should be either "long" or "wide", if a function contains nested conditions, there should be only one of them, if it is long, it should only contain simple conditions.

The measure of "cyclomatic complexity" expresses the complexity of code in terms of possible branches.

```ts
// Complexity: 1
return calculate();

// Complexity: 2
// There are two possible paths through this code depending if foo is truthy or falsy.
if (foo) {
  return 0;
}
return calculate();

// Complexity: 3
if (foo) {
  return 0;
}

// Additionally there are two additional paths here depending on the value of bar.
return bar || calculate();
```

You can use the rule to set a maximum allowed value for the complexity (by default it is 20). Setting this to a lower value will force the developers in your team to write shorter and simpler functions. 

Setting this too low might interfere with functions that are just long lists of if clauses (like routers).

### Config alternatives
Maybe you have already heard about [epicweb](https://www.epicweb.dev/), but in case you didn't, it is a platform created by [Kent C. Dodds](kentcdodds.com) among other very talented tech people where you can learn a lot. And I mean a lot! There's workshops, articles, tips. 

But coming back to this article's topic, they have also developped a basic rules config to get get started with ESLing, Typescript and Prettier. You can check it out [here](https://github.com/epicweb-dev/config.) Even if the same set-up can be done by ourselves, these rules working together make sense and they even [took the time to write an article about their chosen Prettier rules](https://www.epicweb.dev/your-code-style-does-matter-actually). It can be really inspiring!

Another approach has been presented by Anthony Fu during JS Nation Amsterdam. He pushes ESLint rules not only as a linter but also as a formatter, getting rid of Prettier configurations in his personal ESLint config https://github.com/antfu/eslint-config. Support for React, Svelte, UnoCSS, Astro, Solid is provided, as well as the newly released ins ESLint 9 flat-config.

## Conclusion
Linter is a great tool for improving code. It is worth that everyone in the team gets involved with its configuration for smoothing the review process and code quality. Even if linters do not replace a review, they quite help brush off a chunk of comments and helps speed up the delivery of properly conventioned code. 
I like to think that this is a way of democratizing code within a team, as well as improving it. But this also means taking time for exploring and testing. If you made it up to here, thanks! I hope you are a bit more ready to play around ESLint!

## Resources and further digging
- ESLint official page [https://eslint.org/](https://eslint.org/)
- ESLint on Wikipedia [https://en.wikipedia.org/wiki/ESLint](https://en.wikipedia.org/wiki/ESLint)
- ESLint One for All Made Easy - Anthony Fu https://gitnation.com/contents/eslint-one-for-all-made-easy
- How to Use Linters and Code Formatters in Your Projects - German Cocca https://www.freecodecamp.org/news/using-prettier-and-jslint/ 
- Top Ten ESlint Rules for Any TypeScript Codebase - Kevin Schaffter https://blog.stackademic.com/top-ten-lint-rules-for-any-typescript-codebase-cb3148e67aca
- What is Linting? How does a linter work? - Dogan Ogut [https://ogutdgnn.medium.com/what-is-linting-how-does-a-linter-work-49381f28fc60](https://ogutdgnn.medium.com/what-is-linting-how-does-a-linter-work-49381f28fc60)
- Easing into Cyclomatic Complexity - Peter Perlepes https://dev.to/igneel64/easing-into-cyclomatic-complexity-38b1