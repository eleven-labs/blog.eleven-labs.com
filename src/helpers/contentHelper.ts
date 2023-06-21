import { globSync } from 'glob';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path, { dirname, resolve } from 'node:path';

import { ASSETS_DIR, DATA_DIR, MARKDOWN_FILE_PATHS } from '@/app-paths';
import { CATEGORIES } from '@/constants';
import { getPathFile } from '@/helpers/assetHelper';
import { markdownToHtml } from '@/helpers/markdownToHtmlHelper';
import { intersection } from '@/helpers/objectHelper';
import {
  AuthorData,
  DataFromAuthorPage,
  DataFromPostListPage,
  DataFromPostPage,
  PostData,
  TransformedAuthor,
  TransformedPost,
} from '@/types';

interface MarkdownCacheData<T, TData> {
  type: T;
  data: TData;
  mtime?: number;
}

type MarkdownResult = MarkdownCacheData<'post', TransformedPost> | MarkdownCacheData<'author', TransformedAuthor>;

type MarkdownCache = Record<string, MarkdownResult>;

const markdownCache: MarkdownCache = {};

const getReadingTime = (content: string): string => {
  const numberOfWords = content.split(' ').length;
  const readingTimeInMinutes = numberOfWords < 360 ? 1 : Math.round(numberOfWords / 180);
  return `${readingTimeInMinutes}mn`;
};

const transformPost = (options: { data: PostData; rawContent: string; content: string }): TransformedPost => ({
  lang: options.data.lang,
  slug: options.data.slug,
  date: new Date(options.data.date).toISOString(),
  title: options.data.title,
  excerpt: options.data.excerpt,
  readingTime: getReadingTime(options.content),
  authors: options.data.authors,
  categories: options.data.categories,
  content: options.content,
});

const transformAuthor = ({ data, content }: { data: AuthorData; content: string }): TransformedAuthor => {
  const avatarImageFileNames = globSync(`${data.username}.*`, { cwd: path.resolve(ASSETS_DIR, 'authors') });
  return {
    ...data,
    avatarImageUrl:
      avatarImageFileNames.length > 0 ? getPathFile(`/imgs/authors/${avatarImageFileNames[0]}`) : undefined,
    content,
  };
};

const getPostsByLang = (): Record<string, TransformedPost[]> =>
  Object.values(markdownCache).reduce<Record<string, TransformedPost[]>>((currentPostsByLang, markdownResult) => {
    if (markdownResult.type === 'post') {
      if (!currentPostsByLang[markdownResult.data.lang]) {
        currentPostsByLang[markdownResult.data.lang] = [];
      }

      currentPostsByLang[markdownResult.data.lang].push(markdownResult.data);
    }
    return currentPostsByLang;
  }, {});

const getAuthors = (): TransformedAuthor[] =>
  Object.values(markdownCache).reduce<TransformedAuthor[]>((currentAuthors, markdownResult) => {
    if (markdownResult.type === 'author') {
      currentAuthors.push(markdownResult.data);
    }
    return currentAuthors;
  }, []);

export const getPostsByLangAndAuthors = (options?: {
  markdownFilePaths?: string[];
}): {
  postsByLang: ReturnType<typeof getPostsByLang>;
  authors: ReturnType<typeof getAuthors>;
} => {
  const markdownFilePaths = options?.markdownFilePaths ?? MARKDOWN_FILE_PATHS;
  for (const filePath of markdownFilePaths) {
    getDataByMarkdownFilePath({ filePath });
  }

  const postsByLang = getPostsByLang();
  const authors = getAuthors();

  return {
    postsByLang,
    authors,
  };
};

const getDataByMarkdownFilePath = ({ filePath }: { filePath: string }): TransformedPost | TransformedAuthor => {
  const stat = statSync(filePath);
  const cached = markdownCache[filePath];
  if (cached && cached.mtime === stat.mtimeMs) {
    return cached.data;
  }
  const markdownContent = readFileSync(filePath, { encoding: 'utf-8' });
  if (filePath.includes('/_authors/')) {
    const { data, html } = markdownToHtml<AuthorData>(markdownContent);
    const transformedAuthor = transformAuthor({ data, content: html });
    markdownCache[filePath] = { type: 'author', data: transformedAuthor, mtime: stat.mtimeMs };
    return transformedAuthor;
  }

  const { data, html } = markdownToHtml<PostData>(markdownContent);
  const transformedPost = transformPost({ data, rawContent: markdownContent, content: html });
  markdownCache[filePath] = { type: 'post', data: transformedPost, mtime: stat.mtimeMs };
  return transformedPost;
};

export const getDataFromAuthorPage = (options: {
  posts: TransformedPost[];
  authors: TransformedAuthor[];
  author: TransformedAuthor;
}): DataFromAuthorPage | undefined => {
  const postsByAuthor = options.posts
    .filter((post) => post.authors.includes(options.author.username))
    .map(({ content, ...post }) => ({
      ...post,
      authors: options.authors
        .filter((author) => post.authors.includes(author.username))
        .map((author) => ({
          username: author.username,
          name: author.name,
        })),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!postsByAuthor.length) return;

  return {
    author: options.author,
    posts: postsByAuthor,
  };
};

export const getDataFromPostPage = (options: {
  posts: TransformedPost[];
  authors: TransformedAuthor[];
  post: TransformedPost;
}): DataFromPostPage => {
  const relatedPostsByCategory = options.post.categories
    ? options.posts
        .filter(
          (currentPost) =>
            currentPost.slug !== options.post.slug &&
            intersection(options.post.categories || [], currentPost.categories || []).length > 0
        )
        .slice(0, 3)
    : [];
  const relatedPostsByAuthor = options.posts
    .filter(
      (currentPost) =>
        currentPost.slug !== options.post.slug && intersection(options.post.authors, currentPost.authors).length > 0
    )
    .slice(0, 3);
  const relatedPosts = [...relatedPostsByCategory, ...relatedPostsByAuthor].slice(0, 3);

  return {
    ...options.post,
    authors: options.authors.filter((author) => options.post.authors.includes(author.username)),
    relatedPosts: relatedPosts
      .map(({ content, ...post }) => ({
        ...post,
        authors: options.authors
          .filter((author) => post.authors.includes(author.username))
          .map((author) => ({
            username: author.username,
            name: author.name,
          })),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
};

export const getDataFromPostListPage = (options: {
  posts: TransformedPost[];
  authors: TransformedAuthor[];
  lang: string;
}): DataFromPostListPage => ({
  categories: [
    'all',
    ...CATEGORIES.filter((currentCategoryName) =>
      options.posts.find((post) => post.lang === options.lang && post?.categories?.includes(currentCategoryName))
    ),
  ],
  posts: options.posts
    .map(({ content, ...post }) => ({
      ...post,
      authors: options.authors
        .filter((author) => post.authors.includes(author.username))
        .map((author) => ({
          username: author.username,
          name: author.name,
        })),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
});

const writeJsonFileSync = <TData = Record<string, unknown> | Array<unknown>>(options: {
  filePath: string;
  data: TData;
}): void => {
  const dirPath = dirname(options.filePath);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  writeFileSync(options.filePath, JSON.stringify(options.data), 'utf8');
};

export const writeJsonDataFiles = (options?: { markdownFilePaths?: string[] }): void => {
  const { postsByLang, authors } = getPostsByLangAndAuthors({ markdownFilePaths: options?.markdownFilePaths });

  for (const [lang, posts] of Object.entries(postsByLang)) {
    writeJsonFileSync({
      filePath: resolve(DATA_DIR, `${lang}/post-list.json`),
      data: getDataFromPostListPage({
        posts,
        authors,
        lang,
      }),
    });

    for (const post of posts) {
      writeJsonFileSync({
        filePath: resolve(DATA_DIR, `${lang}/post/${post.slug}.json`),
        data: getDataFromPostPage({
          posts,
          authors,
          post,
        }),
      });
    }
  }

  for (const author of authors) {
    for (const [lang, posts] of Object.entries(postsByLang)) {
      const dataFromAuthorPage = getDataFromAuthorPage({
        posts,
        authors,
        author,
      });

      if (dataFromAuthorPage) {
        writeJsonFileSync({
          filePath: resolve(DATA_DIR, `${lang}/author/${author.username}.json`),
          data: dataFromAuthorPage,
        });
      }
    }
  }
};
