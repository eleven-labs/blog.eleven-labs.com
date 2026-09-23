Blog Eleven Labs
===================

Welcome to the **Eleven Labs** [blog](https://blog.eleven-labs.com), this is a [Jamstack](https://jamstack.org/) website.

----------

What's inside?
-------------

This website is 100% [TypeScript](https://www.typescriptlang.org/) with a [Jamstack](https://jamstack.org/) architecture.

It was developed based on the boilerplate [React SSR with Vite and Prerender](https://github.com/eleven-labs/typescript-boilerplates).

It embeds the Eleven Labs design system, in the `src/design-system` folder. Its components are documented in [Storybook](https://storybook.js.org/), which you can browse with `pnpm start:storybook`.

----------

Setting up the blog
-------------

- [For developers](documentations/setup-for-dev.md)
- [For others](documentations/setup-for-others.md)
- [Infrastructure and redirects](documentations/infra.md)

----------

Translations
-------------

The interface translations are versioned in the `src/translations` folder, one file per language (`fr.translations.json` and `en.translations.json`). This repository is their only source of truth.

To add or edit a translation:

1. Add or edit the key in **both** `fr.translations.json` and `en.translations.json`, at the same place in the tree.
2. Use it in the code with the `t` function of [react-i18next](https://react.i18next.com/), e.g. `t('common.post.footer.author.title')`.
3. Run `pnpm test`: a test checks that both files expose exactly the same keys.
