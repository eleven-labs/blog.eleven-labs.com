import {
  CATEGORIES,
  CategoryEnum,
  ContentTypeEnum,
  DEFAULT_LANGUAGE,
  IS_DEBUG,
  LanguageEnum,
  LANGUAGES_AVAILABLE_WITH_DT,
  NUMBER_OF_ITEMS_PER_PAGE,
  PATHS,
} from '@/constants';
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
  ...LANGUAGES_AVAILABLE_WITH_DT.map((lang) => ({
    lang,
    url: generatePath(PATHS.HOME, { lang }),
  })),
];

export const getCategoryPageUrls = (
  postsData: Pick<TransformedPostData, 'lang' | 'contentType' | 'categories'>[]
): Urls => {
  const urls: Record<string, { lang: string; url: string }[]> = {};

  for (const categoryName of ['all', ...CATEGORIES]) {
    for (const lang of LANGUAGES_AVAILABLE_WITH_DT) {
      const numberOfPosts = postsData.filter(
        (post) =>
          (lang === LanguageEnum.DT || post.lang === lang) &&
          (categoryName === 'all' ? true : post?.categories?.includes(categoryName as CategoryEnum))
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
      (post) => (lang === LanguageEnum.DT || post.lang === lang) && post.contentType === ContentTypeEnum.TUTORIAL
    ).length;
    if (numberOfPosts) {
      if (!urls['tutorial']) {
        urls['tutorial'] = [];
      }
      urls['tutorial'].push({
        lang,
        url: generatePath(PATHS.CATEGORY, { lang, categoryName: ContentTypeEnum.TUTORIAL }),
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
              categoryName: ContentTypeEnum.TUTORIAL,
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
        (post) => (lang === LanguageEnum.DT || post.lang === lang) && post.authors.includes(author.username)
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
            lang: LanguageEnum.DT,
            url: generatePath(PATHS.POST, { lang: LanguageEnum.DT, slug: post.slug }),
          },
        ]
      : []),
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
          url: generatePath(PATHS.POST, { lang: tutorial.lang, slug: tutorial.slug, step }),
        },
        ...(IS_DEBUG
          ? [
              {
                lang: LanguageEnum.DT,
                url: generatePath(PATHS.POST, { lang: LanguageEnum.DT, slug: tutorial.slug, step }),
              },
            ]
          : []),
      ])
    );
    return urls;
  }, [] as Urls);
};
