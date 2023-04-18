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
import { getAuthorDataPage, getPostDataPage, getPostListDataPage } from '@/helpers/apiHelper';

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
          getPostListDataPage({
            request,
            params: {
              lang: 'fr',
            } as Params,
          }),
      },
      {
        path: '/:lang',
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
            loader: async ({ request, params }) =>
              getPostListDataPage({
                request,
                params,
              }),
          },
          {
            path: PATHS.POST,
            element: <PostPageContainer />,
            loader: async ({ request, params }) =>
              getPostDataPage({
                request,
                params,
              }),
          },
          {
            path: PATHS.AUTHOR,
            element: <AuthorPageContainer />,
            loader: async ({ request, params }) =>
              getAuthorDataPage({
                request,
                params,
              }),
          },
          {
            path: PATHS.CATEGORY,
            element: <PostListPageContainer />,
            loader: async ({ request, params }) =>
              getPostListDataPage({
                request,
                params,
              }),
          },
          {
            path: PATHS.SEARCH,
            element: <SearchPageContainer />,
            loader: async ({ request, params }) =>
              getPostListDataPage({
                request,
                params,
              }),
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
