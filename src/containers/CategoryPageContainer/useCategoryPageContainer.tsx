import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { generatePath } from '@/helpers/routerHelper';
import { useTitle } from '@/hooks/useTitle';
import { CategoryPageProps } from '@/pages';
import { PostListPageData } from '@/types';

export const useCategoryPageContainer = (): CategoryPageProps => {
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
    categoryIntroBlock: {
      homeLink: {
        label: t('pages.category.home_link_label'),
        href: '#',
      },
      name: t(`categories.${categoryName}`),
      title: t(`pages.category.${categoryName}.title`),
      description: t(`pages.category.${categoryName}.description`),
    },
    categoryEndingBlock: {
      title: t(`pages.category.${categoryName}.expertise.title`),
      description: t(`pages.category.${categoryName}.expertise.description`),
      expertiseLink: {
        label: t(`pages.category.${categoryName}.expertise.link_label`),
        href: t(`pages.category.${categoryName}.expertise.link_url`),
      },
    },
    title: t('post_list_block.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={postListPageData.posts} />,
  };
};
