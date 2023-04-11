import React from 'react';
import { Params, RouteObject } from 'react-router';
import { Outlet } from 'react-router-dom';

import { AUTHORIZED_LANGUAGES, PATHS } from '@/constants';
import { AuthorPageContainer } from '@/containers/AuthorPageContainer';
import { LayoutTemplateContainer } from '@/containers/LayoutTemplateContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { PostListPageContainer } from '@/containers/PostListPageContainer';
import { PostPageContainer } from '@/containers/PostPageContainer';
import { SearchPageContainer } from '@/containers/SearchPageContainer';
import { getDataFromAuthorPage, getDataFromPostListPage, getDataFromPostPage } from '@/helpers/loaderDataHelper';

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
          getDataFromPostListPage({
            request,
            params: {
              lang: 'fr',
            } as Params,
          }),
      },
      {
        path: '/:lang/',
        loader: ({ params }): Record<string, unknown> => {
          if (params.lang && !AUTHORIZED_LANGUAGES.includes(params.lang as (typeof AUTHORIZED_LANGUAGES)[number])) {
            throw new Error('Lang not Found');
          }
          return {};
        },
        children: [
          {
            path: PATHS.HOME,
            element: <PostListPageContainer />,
            loader: getDataFromPostListPage,
          },
          {
            path: PATHS.POST,
            element: <PostPageContainer />,
            loader: getDataFromPostPage,
          },
          {
            path: PATHS.AUTHOR,
            element: <AuthorPageContainer />,
            loader: getDataFromAuthorPage,
          },
          {
            path: PATHS.CATEGORY,
            element: <PostListPageContainer />,
            loader: getDataFromPostListPage,
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
