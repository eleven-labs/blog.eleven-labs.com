import React from 'react';
import { Params, RouteObject } from 'react-router';
import { Outlet } from 'react-router-dom';

import { LanguageEnum, PATHS } from '@/constants';
import { AuthorPageContainer } from '@/containers/AuthorPageContainer';
import { LayoutTemplateContainer } from '@/containers/LayoutTemplateContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { PostListPageContainer } from '@/containers/PostListPageContainer';
import { PostPageContainer } from '@/containers/PostPageContainer';
import { SearchPageContainer } from '@/containers/SearchPageContainer';
import { loadAuthorPageData, loadPostListPageData, loadPostPageData } from '@/helpers/loaderDataHelper';

export const routes: RouteObject[] = [
  {
    element: (
      <LayoutTemplateContainer>
        <Outlet />
      </LayoutTemplateContainer>
    ),
    errorElement: (
      <LayoutTemplateContainer>
        <NotFoundPageContainer />
      </LayoutTemplateContainer>
    ),
    children: [
      {
        index: true,
        path: PATHS.ROOT,
        element: <PostListPageContainer />,
        loader: async ({ request }) =>
          loadPostListPageData({
            request,
            params: {
              lang: 'fr',
            } as Params,
          }),
      },
      {
        path: '/:lang/',
        loader: ({ params }): Record<string, unknown> => {
          if (params.lang && !Object.values(LanguageEnum).includes(params.lang as LanguageEnum)) {
            throw new Error(`The \`${params.lang}\` language doesn't exist`);
          }
          return {};
        },
        children: [
          {
            path: PATHS.HOME,
            element: <PostListPageContainer />,
            loader: loadPostListPageData,
          },
          {
            path: PATHS.POST,
            element: <PostPageContainer />,
            loader: loadPostPageData,
          },
          {
            path: PATHS.AUTHOR,
            element: <AuthorPageContainer />,
            loader: loadAuthorPageData,
          },
          {
            path: PATHS.CATEGORY,
            element: <PostListPageContainer />,
            loader: loadPostListPageData,
          },
          {
            path: PATHS.SEARCH,
            element: <SearchPageContainer />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPageContainer />,
      },
    ],
  },
];
