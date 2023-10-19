import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { LinkContainer } from '@/containers/LinkContainer';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { generatePath } from '@/helpers/routerHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useTitle } from '@/hooks/useTitle';
import { PostListPageProps } from '@/pages/PostListPage/PostListPage';
import { PostListPageData } from '@/types';

export const usePostListPageContainer = (): PostListPageProps => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const { t, i18n } = useTranslation();
  const { categories, posts } = useLoaderData() as PostListPageData;
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
    subHeader: {
      introBlock: {
        title: t('header.intro_block.title'),
        description: t('header.intro_block.description'),
      },
      choiceCategoryLabel: t('header.choice_category_label'),
      choiceCategories: categories.map((currentCategoryName) => ({
        as: LinkContainer,
        hrefLang: i18n.language,
        to: generatePath(currentCategoryName === 'all' ? PATHS.HOME : PATHS.CATEGORY, {
          lang: i18n.language,
          categoryName: currentCategoryName,
        }),
        label: currentCategoryName === 'all' ? t('categories.all') : t(`categories.${currentCategoryName}`),
        isActive: currentCategoryName === categoryName ? true : Boolean(!categoryName && currentCategoryName === 'all'),
      })),
    },
    title: t('pages.post_list.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={posts} />,
    newsletterBlock,
  };
};
