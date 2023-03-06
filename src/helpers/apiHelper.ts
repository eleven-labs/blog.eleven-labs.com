import fetch from 'cross-fetch';
import { Params } from 'react-router';

import { BASE_URL } from '@/constants';
import { encodeBase64 } from '@/helpers/base64Helper';
import type { getData } from '@/helpers/dataHelper';
import { intersection } from '@/helpers/objectHelper';

const cache = new Map();

const fetchWithCache = async <TData>(options: { request: Request; path: string }): Promise<TData> => {
  const requestUrl = new URL(options.request.url);
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}${BASE_URL}data`;
  const url = `${baseUrl}/${options.path}`;

  if (cache.has(url)) {
    return JSON.parse(cache.get(url)) as TData;
  }

  let data: TData;
  if (import.meta.env.SSR && import.meta.env.MODE === 'prerender') {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const rootDir = resolve(process.cwd(), 'public', 'data');

    const content = readFileSync(resolve(rootDir, options.path), 'utf-8');

    data = JSON.parse(content);
  } else {
    data = await fetch(url).then((res) => res.json());
  }

  cache.set(url, JSON.stringify(data));
  return data as TData;
};

const getCategoriesByLang = async (options: {
  request: Request;
  params: Params<'lang'>;
}): Promise<ReturnType<typeof getData>['categoriesByLang'][0]> => {
  const categoriesByLang = await fetchWithCache<ReturnType<typeof getData>['categoriesByLang']>({
    request: options.request,
    path: 'categories.json',
  });
  return categoriesByLang[options.params.lang!];
};

const getPostsByLang = async (options: {
  request: Request;
  params: Params<'lang'>;
}): Promise<ReturnType<typeof getData>['postsByLang'][0]> => {
  const postsByLang = await fetchWithCache<ReturnType<typeof getData>['postsByLang']>({
    request: options.request,
    path: 'posts.json',
  });
  return postsByLang[options.params.lang!];
};

const getAuthors = async (options: { request: Request }): Promise<ReturnType<typeof getData>['authors']> => {
  return fetchWithCache<ReturnType<typeof getAuthors>>({
    request: options.request,
    path: 'authors.json',
  });
};

const getPost = async (options: {
  request: Request;
  params: Params<'lang' | 'slug'>;
}): Promise<{ slug: string } & ReturnType<typeof getData>['posts'][0]> => {
  const post = await fetchWithCache<ReturnType<typeof getData>['posts'][0]>({
    request: options.request,
    path: `post/${options.params.lang}/${options.params.slug}.json`,
  });
  return {
    ...post,
    slug: options.params.slug!,
  };
};

const transformPost = (options: {
  post: Awaited<ReturnType<typeof getPostsByLang>>[0];
  authors: Awaited<ReturnType<typeof getAuthors>>;
}): Omit<Awaited<ReturnType<typeof getPostsByLang>>[0], 'authors'> & {
  authors: string[];
} => ({
  ...options.post,
  authors: options.authors
    .filter((author) => options.post.authors.includes(author.username))
    .map((author) => author.name),
});

export const getPostListDataPage = async (options: {
  request: Request;
  params: Params<'lang' | 'categoryName'>;
}): Promise<{
  categories: Awaited<ReturnType<typeof getCategoriesByLang>>;
  posts: ReturnType<typeof transformPost>[];
}> => {
  const [categoriesByLang, postsByLang, authors] = await Promise.all([
    getCategoriesByLang({ request: options.request, params: options.params }),
    getPostsByLang({ request: options.request, params: options.params }),
    getAuthors({ request: options.request }),
  ]);

  return {
    categories: categoriesByLang,
    posts: postsByLang
      .filter((post) =>
        options.params.categoryName ? (post.categories || []).includes(options.params.categoryName) : true
      )
      .map((post) => transformPost({ post, authors })),
  };
};

export const getPostDataPage = async (options: {
  request: Request;
  params: Params<'lang' | 'slug'>;
}): Promise<
  Omit<Awaited<ReturnType<typeof getPostsByLang>>[0], 'authors'> & {
    contentBase64: string;
    authors: Awaited<ReturnType<typeof getAuthors>>;
    relatedPosts: ReturnType<typeof transformPost>[];
  }
> => {
  const [postsByLang, authors, { content, ...post }] = await Promise.all([
    getPostsByLang({ request: options.request, params: options.params }),
    getAuthors({ request: options.request }),
    getPost({ request: options.request, params: options.params }),
  ]);

  const relatedPostsByCategory = post.categories
    ? postsByLang
        .filter(
          (currentPost) =>
            currentPost.slug !== post.slug &&
            intersection(post.categories || [], currentPost.categories || []).length > 0
        )
        .slice(0, 3)
    : [];

  const relatedPostsByAuthor = postsByLang
    .filter(
      (currentPost) => currentPost.slug !== post.slug && intersection(post.authors, currentPost.authors).length > 0
    )
    .slice(0, 3);
  const relatedPosts = [...relatedPostsByCategory, ...relatedPostsByAuthor].slice(0, 3);

  return {
    ...post,
    authors: authors.filter((author) => post.authors.includes(author.username)),
    contentBase64: encodeBase64(content),
    relatedPosts: relatedPosts.map((relatedPost) => transformPost({ post: relatedPost, authors })),
  };
};

export const getAuthorDataPage = async (options: {
  request: Request;
  params: Params<'lang' | 'authorUsername'>;
}): Promise<Awaited<ReturnType<typeof getAuthors>>[0] & { posts: ReturnType<typeof transformPost>[] }> => {
  const [postsByLang, authors] = await Promise.all([
    getPostsByLang({ request: options.request, params: options.params }),
    getAuthors({ request: options.request }),
  ]);
  const author = authors.find((currentAuthor) => currentAuthor.username === options.params.authorUsername)!;

  return {
    ...author,
    posts: postsByLang
      .filter((post) => post.authors.includes(options.params.authorUsername as string))
      .map((post) => transformPost({ post, authors })),
  };
};
