import { AUTHORIZED_LANGUAGES, CATEGORIES, DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { getPostsByLangAndAuthors } from '@/helpers/contentHelper';
import { generatePath } from '@/helpers/routerHelper';
import { TransformedAuthor, TransformedPost } from '@/types';

const { postsByLang, authors } = getPostsByLangAndAuthors();

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
  links: AUTHORIZED_LANGUAGES.map((lang) => ({
    lang,
    url: generatePath(PATHS.CATEGORY, { lang, categoryName }),
  })),
});

const createPostSitemapEntry = (post: TransformedPost): SitemapEntry => ({
  priority: 0.7,
  links: [
    {
      lang: post.lang,
      url: generatePath(PATHS.POST, { lang: post.lang, slug: post.slug }),
    },
  ],
});

const createAuthorSitemapEntry = (author: TransformedAuthor): SitemapEntry => ({
  priority: 0.5,
  links: AUTHORIZED_LANGUAGES.filter((lang) =>
    postsByLang[lang].some((post) => post.authors.includes(author.username))
  ).map((lang) => ({
    lang,
    url: generatePath(PATHS.AUTHOR, { lang, authorUsername: author.username }),
  })),
});

export const getSitemapEntries = (): SitemapEntry[] => {
  const posts = Object.values(postsByLang).flat();

  const rootEntry: SitemapEntry = {
    priority: 1,
    links: [
      {
        lang: DEFAULT_LANGUAGE,
        url: generatePath(PATHS.ROOT),
      },
      ...AUTHORIZED_LANGUAGES.map((lang) => ({
        lang,
        url: generatePath(PATHS.HOME, { lang }),
      })),
    ],
  };

  const searchEntry: SitemapEntry = {
    links: AUTHORIZED_LANGUAGES.map((lang) => ({
      lang,
      url: generatePath(PATHS.SEARCH, { lang }),
    })),
  };

  const categoryEntries: SitemapEntry[] = CATEGORIES.filter((categoryName) =>
    posts.some((post) => post?.categories?.includes(categoryName))
  ).map(createCategorySitemapEntry);

  const postEntries: SitemapEntry[] = posts.map(createPostSitemapEntry);

  const authorEntries: SitemapEntry[] = authors
    .filter((author) => posts.some((post) => post.authors.includes(author.username)))
    .map(createAuthorSitemapEntry);

  const notFoundEntry: SitemapEntry = {
    priority: 0,
    links: [
      {
        lang: DEFAULT_LANGUAGE,
        url: '/404',
      },
    ],
  };

  return [rootEntry, searchEntry, ...categoryEntries, ...postEntries, ...authorEntries, notFoundEntry];
};
