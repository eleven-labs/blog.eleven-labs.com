import type {
  CategoryType,
  TransformedArticleData,
  TransformedAuthorData,
  TransformedPostData,
  TransformedTutorialData,
} from '@/types';

import {
  CATEGORIES,
  IS_DEBUG,
  LANGUAGES,
  LANGUAGES_AVAILABLE_WITH_DT,
  MARKDOWN_CONTENT_TYPES,
  NUMBER_OF_ITEMS_PER_PAGE,
  PATHS,
} from '@/constants';
import { generatePath, getHomePath } from '@/helpers/routerHelper';

export type Urls = {
  lang: string;
  url: string;
}[][];

export const getHomePageUrls = (): Urls[0] =>
  LANGUAGES_AVAILABLE_WITH_DT.map((lang) => ({
    lang,
    url: getHomePath(lang),
  }));

export const getCategoryPageUrls = (
  postsData: Pick<TransformedPostData, 'lang' | 'contentType' | 'categories'>[]
): Urls => {
  const urls: Record<string, { lang: string; url: string }[]> = {};

  for (const categoryName of ['all', ...CATEGORIES]) {
    for (const lang of LANGUAGES_AVAILABLE_WITH_DT) {
      const numberOfPosts = postsData.filter(
        (post) =>
          (lang === LANGUAGES.DT || post.lang === lang) &&
          (categoryName === 'all' ? true : post?.categories?.includes(categoryName as CategoryType))
      ).length;

      if (numberOfPosts) {
        if (!urls[categoryName]) {
          urls[categoryName] = [];
        }
        urls[categoryName].push({ lang, url: generatePath(PATHS.CATEGORY, { lang, categoryName }) });

        const numberOfPages = Math.ceil(numberOfPosts / NUMBER_OF_ITEMS_PER_PAGE);
        if (numberOfPages > 1) {
          Array.from({ length: numberOfPages }).forEach((_, index) => {
            const page = index + 1;
            if (!urls[`${categoryName}-${page}`]) {
              urls[`${categoryName}-${page}`] = [];
            }
            urls[`${categoryName}-${page}`].push({
              lang,
              url: generatePath(PATHS.CATEGORY_PAGINATED, { lang, categoryName, page }),
            });
          });
        }
      }
    }
  }

  for (const lang of LANGUAGES_AVAILABLE_WITH_DT) {
    const numberOfPosts = postsData.filter(
      (post) => (lang === LANGUAGES.DT || post.lang === lang) && post.contentType === MARKDOWN_CONTENT_TYPES.TUTORIAL
    ).length;
    if (numberOfPosts) {
      if (!urls['tutorial']) {
        urls['tutorial'] = [];
      }
      urls['tutorial'].push({
        lang,
        url: generatePath(PATHS.CATEGORY, { lang, categoryName: MARKDOWN_CONTENT_TYPES.TUTORIAL }),
      });

      const numberOfPages = Math.ceil(numberOfPosts / NUMBER_OF_ITEMS_PER_PAGE);
      if (numberOfPages > 1) {
        Array.from({ length: numberOfPages }).forEach((_, index) => {
          const page = index + 1;
          if (!urls[`tutorial-${page}`]) {
            urls[`tutorial-${page}`] = [];
          }
          urls[`tutorial-${page}`].push({
            lang,
            url: generatePath(PATHS.CATEGORY_PAGINATED, {
              lang,
              categoryName: MARKDOWN_CONTENT_TYPES.TUTORIAL,
              page: index + 1,
            }),
          });
        });
      }
    }
  }

  return Object.values(urls);
};

export const getAuthorPageUrls = (
  postsData: Pick<TransformedPostData, 'lang' | 'authors'>[],
  authorData: Pick<TransformedAuthorData, 'username'>[]
): Urls => {
  const urls: Record<string, { lang: string; url: string }[]> = {};

  for (const author of authorData) {
    for (const lang of LANGUAGES_AVAILABLE_WITH_DT) {
      const numberOfPosts = postsData.filter(
        (post) => (lang === LANGUAGES.DT || post.lang === lang) && post.authors.includes(author.username)
      ).length;

      if (numberOfPosts) {
        if (!urls[author.username]) {
          urls[author.username] = [];
        }
        urls[author.username].push({
          lang,
          url: generatePath(PATHS.AUTHOR, { lang, authorUsername: author.username }),
        });

        const numberOfPages = Math.ceil(numberOfPosts / NUMBER_OF_ITEMS_PER_PAGE);
        if (numberOfPages > 1) {
          Array.from({ length: numberOfPages }).forEach((_, index) => {
            const page = index + 1;
            if (!urls[`${author.username}-${page}`]) {
              urls[`${author.username}-${page}`] = [];
            }
            urls[`${author.username}-${page}`].push({
              lang,
              url: generatePath(PATHS.AUTHOR_PAGINATED, { lang, authorUsername: author.username, page: index + 1 }),
            });
          });
        }
      }
    }
  }

  return Object.values(urls);
};

export const getPostPageUrls = (postsData: Pick<TransformedPostData, 'lang' | 'slug'>[]): Urls =>
  postsData.map((post) => [
    {
      lang: post.lang,
      url: generatePath(PATHS.POST, { lang: post.lang, slug: post.slug }),
    },
    ...(IS_DEBUG
      ? [
          {
            lang: LANGUAGES.DT,
            url: generatePath(PATHS.POST, { lang: LANGUAGES.DT, slug: post.slug }),
          },
        ]
      : []),
  ]);

export type Redirect = {
  lang: string;
  from: string;
  to: string;
};

// Every step of a tutorial now lives in a section of the tutorial page, its former url points to that section
export const getTutorialStepRedirects = (
  postsData: (
    | Pick<TransformedArticleData, 'contentType'>
    | Pick<TransformedTutorialData, 'lang' | 'slug' | 'contentType' | 'steps'>
  )[]
): Redirect[] => {
  const tutorials = postsData.filter(
    (post) => post.contentType === MARKDOWN_CONTENT_TYPES.TUTORIAL && post.steps
  ) as Pick<TransformedTutorialData, 'lang' | 'contentType' | 'steps' | 'slug'>[];

  return tutorials.flatMap((tutorial) =>
    [tutorial.lang, ...(IS_DEBUG ? [LANGUAGES.DT] : [])].flatMap((lang) =>
      // The first step was already served on the url of the tutorial
      tutorial.steps.slice(1).map((step) => ({
        lang,
        from: generatePath(PATHS.TUTORIAL_STEP, { lang, slug: tutorial.slug, step: step.slug }),
        to: `${generatePath(PATHS.POST, { lang, slug: tutorial.slug })}#${step.slug}`,
      }))
    )
  );
};
