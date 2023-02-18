import { format } from 'date-fns';
import localeDateEn from 'date-fns/locale/en-US';
import localeDateFr from 'date-fns/locale/fr';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { dirname, resolve } from 'node:path';

import { AUTHORIZED_LANGUAGES, CATEGORIES } from '@/constants';
import { getPathFile } from '@/helpers/assetHelper';
import { AuthorType, PostType } from '@/types';

const postDateToString = (postDate: string, lang: string): string =>
  format(new Date(postDate), 'PP', {
    locale: lang === 'fr' ? localeDateFr : localeDateEn,
  });

const readingTimeToString = (numberOfWords: number): string => {
  const readingTimeInMinutes = numberOfWords < 360 ? 1 : Math.round(numberOfWords / 180);
  return `${readingTimeInMinutes}mn`;
};

const getPosts = (): (Pick<PostType, 'lang' | 'slug' | 'date' | 'title' | 'excerpt' | 'authors' | 'categories'> & {
  readingTime: string;
  content: string;
})[] => {
  const postsModules = import.meta.glob<{
    attributes: PostType;
    content: string;
  }>('../../_posts/**/*.md', { eager: true });

  return Object.entries(postsModules)
    .reduce<ReturnType<typeof getPosts>>((posts, [_, { attributes, content }]) => {
      const numberOfWords = content.split(' ').length;

      return [
        ...posts,
        {
          lang: attributes.lang,
          slug: attributes.slug,
          date: attributes.date,
          title: attributes.title,
          excerpt: attributes.excerpt,
          readingTime: readingTimeToString(numberOfWords),
          authors: attributes.authors,
          categories: attributes.categories,
          content,
        },
      ];
    }, [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      ...post,
      date: postDateToString(post.date, post.lang),
    }));
};

const getAuthors = (): (Pick<AuthorType, 'github' | 'twitter'> & {
  username: string;
  name: string;
  avatarImageUrl?: string;
  description: string;
})[] => {
  const authorModules = import.meta.glob<{
    attributes: {
      login: string;
      title: string;
      twitter?: string;
      github?: string;
    };
    content: string;
  }>('../../_authors/**/*.md', { eager: true });

  return Object.entries(authorModules).reduce<ReturnType<typeof getAuthors>>(
    (authors, [_, { attributes, content }]) => {
      const avatarImageExist = existsSync(
        path.resolve(process.cwd(), 'public/imgs/authors', `${attributes.login}.jpg`)
      );

      authors.push({
        username: attributes.login,
        name: attributes.title,
        github: attributes?.github,
        twitter: attributes?.twitter,
        avatarImageUrl: avatarImageExist ? getPathFile(`/imgs/authors/${attributes.login}.jpg`) : undefined,
        description: content,
      });

      return authors;
    },
    []
  );
};

const getCategoriesByLang = (options: { lang: string; posts: ReturnType<typeof getPosts> }): string[] => [
  'all',
  ...CATEGORIES.filter((currentCategoryName) =>
    options.posts.find((post) => post.lang === options.lang && post?.categories?.includes(currentCategoryName))
  ),
];

export const getData = (): {
  categoriesByLang: Record<string, string[]>;
  posts: ReturnType<typeof getPosts>;
  postsByLang: Record<string, Omit<ReturnType<typeof getPosts>[0], 'lang' | 'content'>[]>;
  authors: ReturnType<typeof getAuthors>;
} => {
  const posts = getPosts();
  const authors = getAuthors();

  return {
    categoriesByLang: AUTHORIZED_LANGUAGES.reduce<Record<string, string[]>>((categoriesByLang, lang) => {
      categoriesByLang[lang] = getCategoriesByLang({ lang, posts });
      return categoriesByLang;
    }, {}),
    posts,
    postsByLang: posts.reduce<ReturnType<typeof getData>['postsByLang']>((postByLang, { lang, content, ...post }) => {
      if (!postByLang[lang]) {
        postByLang[lang] = [];
      }
      postByLang[lang].push(post);
      return postByLang;
    }, {}),
    authors,
  };
};

const writeJsonFileSync = (options: { filePath: string; data: Record<string, unknown> | Array<unknown> }): void => {
  const dirPath = dirname(options.filePath);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  writeFileSync(options.filePath, JSON.stringify(options.data), 'utf8');
};

export const generateDataFiles = (options: { rootDir: string }): void => {
  rmSync(options.rootDir, { recursive: true, force: true });
  const { categoriesByLang, posts, postsByLang, authors } = getData();

  writeJsonFileSync({
    filePath: resolve(options.rootDir, `categories.json`),
    data: categoriesByLang,
  });
  writeJsonFileSync({
    filePath: resolve(options.rootDir, `posts.json`),
    data: postsByLang,
  });
  writeJsonFileSync({
    filePath: resolve(options.rootDir, `authors.json`),
    data: authors,
  });
  for (const { lang, slug, ...post } of posts) {
    writeJsonFileSync({
      filePath: resolve(options.rootDir, `post/${lang}/${slug}.json`),
      data: post,
    });
  }
};
