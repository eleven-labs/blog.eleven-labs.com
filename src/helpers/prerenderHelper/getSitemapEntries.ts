import { CategoryEnum, ContentTypeEnum, DEFAULT_LANGUAGE, LanguageEnum, PATHS } from '@/constants';
import { getAuthors, getPosts } from '@/helpers/markdownContentManagerHelper';
import { generatePath } from '@/helpers/routerHelper';
import { TransformedAuthorData, TransformedPostData, TransformedTutorialData } from '@/types';

type Link = {
  lang: string;
  url: string;
};

type SitemapEntry = {
  links: Link[];
  changefreq?: string;
  priority?: number;
};

const createCategorySitemapEntry = (categoryName: string): SitemapEntry => ({
  priority: 0.8,
  links: Object.values(LanguageEnum).map((lang) => ({
    lang,
    url: generatePath(PATHS.CATEGORY, { lang, categoryName }),
  })),
});

const createPostSitemapEntry = (post: TransformedPostData): SitemapEntry => ({
  priority: 0.7,
  links: [
    {
      lang: post.lang,
      url: generatePath(PATHS.POST, { lang: post.lang, slug: post.slug }),
    },
  ],
});

const createTutorialStepSitemapEntry = (post: TransformedTutorialData, step: string): SitemapEntry => ({
  priority: 0.6,
  links: [
    {
      lang: post.lang,
      url: generatePath(PATHS.POST, { lang: post.lang, slug: post.slug, step }),
    },
  ],
});

const createAuthorSitemapEntry = (author: TransformedAuthorData, posts: TransformedPostData[]): SitemapEntry => ({
  priority: 0.5,
  links: Object.values(LanguageEnum)
    .filter((lang) => posts.some((post) => post.lang === lang && post.authors.includes(author.username)))
    .map((lang) => ({
      lang,
      url: generatePath(PATHS.AUTHOR, { lang, authorUsername: author.username }),
    })),
});

export const getSitemapEntries = (): SitemapEntry[] => {
  const posts = getPosts();
  const authors = getAuthors();

  const rootEntry: SitemapEntry = {
    priority: 1,
    links: [
      {
        lang: DEFAULT_LANGUAGE,
        url: generatePath(PATHS.ROOT),
      },
      ...Object.values(LanguageEnum).map((lang) => ({
        lang,
        url: generatePath(PATHS.HOME, { lang }),
      })),
    ],
  };

  const searchEntry: SitemapEntry = {
    links: Object.values(LanguageEnum).map((lang) => ({
      lang,
      url: generatePath(PATHS.SEARCH, { lang }),
    })),
  };

  const categoryEntries: SitemapEntry[] = Object.values(CategoryEnum)
    .filter((categoryName) => posts.some((post) => post?.categories?.includes(categoryName)))
    .map(createCategorySitemapEntry);

  const postEntries: SitemapEntry[] = posts.map(createPostSitemapEntry);
  const tutorialStepEntries: SitemapEntry[] = posts.reduce((sitemapEntries, post) => {
    if (post.contentType === ContentTypeEnum.TUTORIAL) {
      const steps = post.steps.slice(1);
      sitemapEntries.push(...steps.map((step) => createTutorialStepSitemapEntry(post, step.slug)));
    }
    return sitemapEntries;
  }, [] as SitemapEntry[]);

  const authorEntries: SitemapEntry[] = authors
    .filter((author) => posts.some((post) => post.authors.includes(author.username)))
    .map((author) => createAuthorSitemapEntry(author, posts));

  const notFoundEntry: SitemapEntry = {
    priority: 0,
    links: [
      {
        lang: DEFAULT_LANGUAGE,
        url: '/404',
      },
    ],
  };

  return [
    rootEntry,
    searchEntry,
    ...categoryEntries,
    ...postEntries,
    ...tutorialStepEntries,
    ...authorEntries,
    notFoundEntry,
  ];
};
