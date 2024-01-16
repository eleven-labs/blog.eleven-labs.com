import { CategoryPageProps } from '@eleven-labs/design-system';
import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { PostCardListContainer, PostCardListContainerProps } from '@/containers/PostCardListContainer';
import { generatePath } from '@/helpers/routerHelper';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { useNewsletterCard } from '@/hooks/useNewsletterCard';
import { useTitle } from '@/hooks/useTitle';
import { PostListPageData } from '@/types';

export const useCategoryPageContainer = (): CategoryPageProps => {
  const { categoryName, page } = useParams<{ categoryName?: string; page?: string }>();
  const { t, i18n } = useTranslation();
  const postListPageData = useLoaderData() as PostListPageData;
  const newsletterCard = useNewsletterCard();
  const breadcrumb = useBreadcrumb({ categoryName: categoryName as string });
  useTitle(categoryName ? t('seo.category.title', { categoryName }) : t('seo.home.title'));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(categoryName ? PATHS.CATEGORY : PATHS.ROOT, {
      lang: DEFAULT_LANGUAGE,
      categoryName: categoryName,
    })}`,
  });

  const getPaginatedLink: PostCardListContainerProps['getPaginatedLink'] = (page: number) => ({
    href: generatePath(PATHS.CATEGORY_PAGINATED, { lang: i18n.language, categoryName, page }),
  });

  return {
    categoryIntroBlock: {
      breadcrumb,
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
    title: t(`pages.category.${categoryName}.post_list_title`),
    postCardList: (
      <PostCardListContainer
        getPaginatedLink={getPaginatedLink}
        currentPage={page ? parseInt(page, 10) : 1}
        allPosts={postListPageData.posts}
      />
    ),
    newsletterCard,
  };
};
