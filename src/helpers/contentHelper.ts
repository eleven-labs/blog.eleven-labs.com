import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { DATA_DIR } from '@/app-paths';
import { CATEGORIES, ContentTypeEnum, LanguageEnum } from '@/constants';
import { getArticles, getAuthors, getTutorials } from '@/helpers/markdownContentManagerHelper';
import { intersection } from '@/helpers/objectHelper';
import {
  AuthorPageData,
  LayoutTemplateData,
  PostListPageData,
  PostPageData,
  TransformedAuthorData,
  TransformedPostData,
  TransformedPostDataWithoutContent,
} from '@/types';

export const getAuthorPageData = (options: {
  posts: TransformedPostDataWithoutContent[];
  authors: TransformedAuthorData[];
  author: TransformedAuthorData;
}): AuthorPageData | undefined => {
  const postsByAuthor = options.posts
    .filter((post) => post.authors.includes(options.author.username))
    .map((post) => ({
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

export const getPostPageData = (options: {
  posts: TransformedPostDataWithoutContent[];
  authors: TransformedAuthorData[];
  post: TransformedPostData;
}): PostPageData => {
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
      .map((content) => ({
        ...content,
        authors: options.authors
          .filter((author) => content.authors.includes(author.username))
          .map((author) => ({
            username: author.username,
            name: author.name,
          })),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
};

export const getLayoutTemplateData = (options: {
  posts: TransformedPostDataWithoutContent[];
  lang: string;
}): LayoutTemplateData => {
  const categories: LayoutTemplateData['categories'] = [
    'all',
    ...CATEGORIES.filter((currentCategoryName) =>
      options.posts.some((post) => post.lang === options.lang && post?.categories?.includes(currentCategoryName))
    ),
  ];
  const hasTutorial = options.posts.some(
    (post) => post.lang === options.lang && post?.contentType === ContentTypeEnum.TUTORIAL
  );

  return {
    categories,
    hasTutorial,
  };
};

export const getPostListPageData = (options: {
  posts: TransformedPostDataWithoutContent[];
  authors: TransformedAuthorData[];
  lang: string;
}): PostListPageData => ({
  posts: options.posts
    .map((post) => ({
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

export const writeJsonDataFiles = (): void => {
  const articles = getArticles();
  const tutorials = getTutorials();
  const authors = getAuthors();

  for (const lang of Object.values(LanguageEnum)) {
    const articlesByLang = articles.filter((article) => article.lang === lang);
    const tutorialsByLang = tutorials.filter((tutorial) => tutorial.lang === lang);
    const postsByLang = [...articlesByLang, ...tutorialsByLang] as TransformedPostData[];
    const postsByLangWithoutContentOrSteps: TransformedPostDataWithoutContent[] = postsByLang.map((post) => {
      if (post.contentType === ContentTypeEnum.TUTORIAL) {
        const { steps, ...tutorial } = post;
        return tutorial;
      }
      const { content, ...article } = post;
      return article;
    });

    if (postsByLang.length > 0) {
      writeJsonFileSync({
        filePath: resolve(DATA_DIR, `${lang}/common.json`),
        data: getLayoutTemplateData({
          posts: postsByLangWithoutContentOrSteps,
          lang,
        }),
      });

      writeJsonFileSync({
        filePath: resolve(DATA_DIR, `${lang}/post-list.json`),
        data: getPostListPageData({
          posts: postsByLangWithoutContentOrSteps,
          authors,
          lang,
        }),
      });

      for (const post of postsByLang) {
        writeJsonFileSync({
          filePath: resolve(DATA_DIR, `${lang}/post/${post.slug}.json`),
          data: getPostPageData({
            posts: postsByLangWithoutContentOrSteps,
            authors,
            post,
          }),
        });
      }
    }

    for (const author of authors) {
      const dataFromAuthorPage = getAuthorPageData({
        posts: postsByLangWithoutContentOrSteps,
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
