import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';

import { blogUrl, websiteUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { generatePath } from '@/helpers/routerHelper';
import { useTitle } from '@/hooks/useTitle';
import { HomePageProps } from '@/pages';
import { PostListPageData } from '@/types';

export const useHomePageContainer = (): HomePageProps => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const { t } = useTranslation();
  const postListPageData = useLoaderData() as PostListPageData;
  useTitle(categoryName ? t('seo.category.title', { categoryName }) : t('seo.home.title'));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(categoryName ? PATHS.CATEGORY : PATHS.ROOT, {
      lang: DEFAULT_LANGUAGE,
      categoryName: categoryName,
    })}`,
  });

  return {
    homeIntroBlock: {
      intro: t('pages.home.intro'),
      title: t('pages.home.title'),
      description: t('pages.home.description'),
      elevenLabsLink: {
        label: t('pages.home.learn_more_link_label'),
        href: websiteUrl,
      },
    },
    title: t('post_list_block.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={postListPageData.posts} />,
  };
};
