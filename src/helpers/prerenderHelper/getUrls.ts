import { CATEGORIES, CategoryEnum, ContentTypeEnum, DEFAULT_LANGUAGE, LANGUAGES_AVAILABLE, PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { TransformedArticleData, TransformedAuthorData, TransformedPostData, TransformedTutorialData } from '@/types';

export type Urls = {
  lang: string;
  url: string;
}[][];

export const getHomePageUrls = (): Urls[0] => [
  {
    lang: DEFAULT_LANGUAGE,
    url: generatePath(PATHS.ROOT, { lang: DEFAULT_LANGUAGE }),
  },
  ...LANGUAGES_AVAILABLE.map((lang) => ({
    lang,
    url: generatePath(PATHS.HOME, { lang }),
  })),
];

export const getCategoryPageUrls = (
  postsData: Pick<TransformedPostData, 'lang' | 'contentType' | 'categories'>[]
): Urls => {
  const urls: Record<string, { lang: string; url: string }[]> = {};

  for (const categoryName of ['all', ...CATEGORIES]) {
    for (const lang of LANGUAGES_AVAILABLE) {
      const numberOfPosts = postsData.filter((post) =>
        categoryName === 'all' ? true : post.lang === lang && post?.categories?.includes(categoryName as CategoryEnum)
      ).length;

      if (numberOfPosts) {
        if (!urls[categoryName]) {
          urls[categoryName] = [];
        }
        urls[categoryName].push({ lang, url: generatePath(PATHS.CATEGORY, { lang, categoryName }) });
      }
    }
  }

  for (const lang of LANGUAGES_AVAILABLE) {
    const numberOfPosts = postsData.filter(
      (post) => post.lang === lang && post.contentType === ContentTypeEnum.TUTORIAL
    ).length;
    if (numberOfPosts) {
      if (!urls['tutorial']) {
        urls['tutorial'] = [];
      }
      urls['tutorial'].push({
        lang,
        url: generatePath(PATHS.CATEGORY, { lang, categoryName: ContentTypeEnum.TUTORIAL }),
      });
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
    for (const lang of LANGUAGES_AVAILABLE) {
      const numberOfPosts = postsData.filter(
        (post) => post.lang === lang && post.authors.includes(author.username)
      ).length;

      if (numberOfPosts) {
        if (!urls[author.username]) {
          urls[author.username] = [];
        }
        urls[author.username].push({
          lang,
          url: generatePath(PATHS.AUTHOR, { lang, authorUsername: author.username }),
        });
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
  ]);

export const getTutorialStepPageUrls = (
  postsData: (
    | Pick<TransformedArticleData, 'contentType'>
    | Pick<TransformedTutorialData, 'lang' | 'slug' | 'contentType' | 'steps'>
  )[]
): Urls => {
  const tutorials = postsData.filter((post) => post.contentType === ContentTypeEnum.TUTORIAL && post.steps) as Pick<
    TransformedTutorialData,
    'lang' | 'contentType' | 'steps' | 'slug'
  >[];

  return tutorials.reduce((urls, tutorial) => {
    const steps = tutorial.steps.slice(1);
    urls.push(
      ...steps.map((step) => [
        {
          lang: tutorial.lang,
          url: generatePath(PATHS.POST, { lang: tutorial.lang, slug: tutorial.slug, step: step.slug }),
        },
      ])
    );
    return urls;
  }, [] as Urls);
};
