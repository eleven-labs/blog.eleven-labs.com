import { LoaderFunctionArgs } from '@remix-run/router/utils';
import fetch from 'cross-fetch';

import { BASE_URL, CategoryEnum, ContentTypeEnum, IS_PRERENDER, IS_SSR } from '@/constants';
import { ArticlePageData, AuthorPageData, PostListPageData, TutorialPageData } from '@/types';

const cache = new Map();

const fetchWithCache = async <TData>(options: { request: Request; path: string }): Promise<TData> => {
  const requestUrl = new URL(options.request.url);
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}${BASE_URL}data`;
  const url = `${baseUrl}/${options.path}`;

  if (!IS_SSR && cache.has(url)) {
    return JSON.parse(cache.get(url)) as TData;
  }

  let data: TData;
  if (IS_SSR && IS_PRERENDER) {
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

export const loadPostListPageData = async (options: LoaderFunctionArgs): Promise<PostListPageData> => {
  const dataFromPostListPage = await fetchWithCache<PostListPageData>({
    request: options.request,
    path: `${options.params.lang}/post-list.json`,
  });
  if (options.params.categoryName) {
    return {
      categories: dataFromPostListPage.categories,
      posts: dataFromPostListPage.posts.filter((post) =>
        options.params.categoryName === ContentTypeEnum.TUTORIAL
          ? post.contentType === ContentTypeEnum.TUTORIAL
          : post?.categories?.includes(options.params.categoryName as CategoryEnum)
      ),
    };
  }
  return dataFromPostListPage;
};

export const loadAuthorPageData = async (options: LoaderFunctionArgs): Promise<AuthorPageData> =>
  fetchWithCache<AuthorPageData>({
    request: options.request,
    path: `${options.params.lang}/author/${options.params.authorUsername}.json`,
  });

export const loadPostPageData = async (options: LoaderFunctionArgs): Promise<ArticlePageData | TutorialPageData> =>
  fetchWithCache<ArticlePageData | TutorialPageData>({
    request: options.request,
    path: `${options.params.lang}/post/${options.params.slug}.json`,
  });
