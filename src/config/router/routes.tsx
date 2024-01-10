import React from 'react';
import { Params, RouteObject } from 'react-router';
import { Outlet } from 'react-router-dom';

import { LanguageEnum, LANGUAGES_AVAILABLE_WITH_DT, PATHS } from '@/constants';
import { AuthorPageContainer } from '@/containers/AuthorPageContainer';
import { CategoryPageContainer } from '@/containers/CategoryPageContainer';
import { HomePageContainer } from '@/containers/HomePageContainer';
import { LayoutTemplateContainer } from '@/containers/LayoutTemplateContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { PostPageContainer } from '@/containers/PostPageContainer';
import { SearchPageContainer } from '@/containers/SearchPageContainer';
import {
  loadAuthorPageData,
  loadLayoutTemplateData,
  loadPostListPageData,
  loadPostPageData,
} from '@/helpers/loaderDataHelper';
import { LayoutTemplateData } from '@/types';

export const routes: RouteObject[] = [
  {
    element: (
      <LayoutTemplateContainer>
        <Outlet />
      </LayoutTemplateContainer>
    ),
    loader: async ({ request }): Promise<LayoutTemplateData> => {
      const lang = request.url.match(/fr|en/)?.[0] ?? 'fr';
      return loadLayoutTemplateData({
        request,
        params: {
          lang,
        } as Params,
      });
    },
    children: [
      {
        index: true,
        path: PATHS.ROOT,
        element: <HomePageContainer />,
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
          const languages = LANGUAGES_AVAILABLE_WITH_DT as LanguageEnum[];
          if (!languages.includes(params.lang as LanguageEnum)) {
            throw new Error(`The \`${params.lang}\` language doesn't exist`);
          }
          return {};
        },
        hasErrorBoundary: true,
        errorElement: <NotFoundPageContainer />,
        children: [
          {
            path: PATHS.HOME,
            element: <HomePageContainer />,
            loader: loadPostListPageData,
          },
          {
            path: PATHS.POST,
            element: <PostPageContainer />,
            hasErrorBoundary: true,
            errorElement: <NotFoundPageContainer />,
            loader: loadPostPageData,
          },
          {
            path: PATHS.AUTHOR,
            element: <AuthorPageContainer />,
            hasErrorBoundary: true,
            errorElement: <NotFoundPageContainer />,
            loader: loadAuthorPageData,
          },
          {
            path: PATHS.AUTHOR_PAGINATED,
            element: <AuthorPageContainer />,
            hasErrorBoundary: true,
            errorElement: <NotFoundPageContainer />,
            loader: loadAuthorPageData,
          },
          {
            path: PATHS.CATEGORY,
            element: <CategoryPageContainer />,
            hasErrorBoundary: true,
            errorElement: <NotFoundPageContainer />,
            loader: loadPostListPageData,
          },
          {
            path: PATHS.CATEGORY_PAGINATED,
            element: <CategoryPageContainer />,
            hasErrorBoundary: true,
            errorElement: <NotFoundPageContainer />,
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
