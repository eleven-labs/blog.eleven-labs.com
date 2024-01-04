import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { generatePath } from '@/helpers/routerHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useTitle } from '@/hooks/useTitle';
import { PostListPageProps } from '@/pages/PostListPage/PostListPage';
import { PostListPageData } from '@/types';

export const usePostListPageContainer = (): PostListPageProps => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const { t } = useTranslation();
  const { posts } = useLoaderData() as PostListPageData;
  const newsletterBlock = useNewsletterBlock();
  useTitle(categoryName ? t('seo.category.title', { categoryName }) : t('seo.home.title'));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(categoryName ? PATHS.CATEGORY : PATHS.ROOT, {
      lang: DEFAULT_LANGUAGE,
      categoryName: categoryName,
    })}`,
  });

  return {
    title: t('pages.post_list.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={posts} />,
    newsletterBlock,
  };
};
