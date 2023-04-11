import { Box } from '@eleven-labs/design-system';
import React from 'react';
import { RouteObject } from 'react-router';
import { Outlet } from 'react-router-dom';

import { AUTHORIZED_LANGUAGES, PATHS } from '@/constants';
import { AuthorPageContainer } from '@/containers/AuthorPageContainer';
import { LayoutTemplateContainer } from '@/containers/LayoutTemplateContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { PostListPageContainer } from '@/containers/PostListPageContainer';
import { PostPageContainer } from '@/containers/PostPageContainer';
import { SearchPageContainer } from '@/containers/SearchPageContainer';
import { getAuthorDataPage, getPostDataPage, getPostListDataPage } from '@/helpers/loaderDataHelper';

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
        loader: () => getPostListDataPage({ lang: 'fr' }),
      },
      {
        path: '/:lang',
        loader: ({ params }): Record<string, unknown> => {
          if (!AUTHORIZED_LANGUAGES.includes(params.lang as string)) {
            throw new Error('Lang not Found');
          }
          return {};
        },
        children: [
          {
            path: PATHS.HOME,
            element: <PostListPageContainer />,
            loader: ({ params }) =>
              getPostListDataPage({
                lang: params.lang as string,
                categoryName: params.categoryName as string,
              }),
          },
          {
            path: PATHS.POST,
            element: <PostPageContainer />,
            loader: ({ params }) =>
              getPostDataPage({
                lang: params.lang as string,
                slug: params.slug as string,
              }),
          },
          {
            path: PATHS.AUTHOR,
            element: <AuthorPageContainer />,
            loader: ({ params }) =>
              getAuthorDataPage({
                lang: params.lang as string,
                authorUsername: params.authorUsername as string,
              }),
          },
          {
            path: PATHS.CATEGORY,
            element: <PostListPageContainer />,
            loader: async ({ params }) =>
              getPostListDataPage({
                lang: params.lang as string,
                categoryName: params.categoryName as string,
              }),
          },
          {
            path: PATHS.SEARCH,
            element: (
              <Box partial-hydrate="search-page-container">
                <SearchPageContainer />
              </Box>
            ),
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
