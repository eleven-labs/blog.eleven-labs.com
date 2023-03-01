import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLoaderData, useParams } from 'react-router-dom';

import { PATHS } from '@/constants';
import { getPostListDataPage } from '@/helpers/apiHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { usePostPreviewList } from '@/hooks/usePostPreviewList';
import { PostListPageProps } from '@/pages/PostListPage/PostListPage';

export const usePostListPageContainer = (): PostListPageProps => {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const { t, i18n } = useTranslation();
  const { categories, posts } = useLoaderData() as Awaited<ReturnType<typeof getPostListDataPage>>;
  const postPreviewList = usePostPreviewList({ allPosts: posts });
  const newsletterBlock = useNewsletterBlock();

  return {
    subHeader: {
      introBlock: {
        title: t('header.intro_block.title'),
        description: t('header.intro_block.description'),
      },
      choiceCategoryLabel: t('header.choice_category_label'),
      choiceCategories: categories.map((currentCategoryName) => ({
        as: Link,
        label: currentCategoryName === 'all' ? t('categories.all') : t(`categories.${currentCategoryName}`),
        to: generatePath(currentCategoryName === 'all' ? PATHS.HOME : PATHS.CATEGORY, {
          lang: i18n.language,
          categoryName: currentCategoryName,
        }),
        isActive: currentCategoryName === categoryName ? true : Boolean(!categoryName && currentCategoryName === 'all'),
      })),
    },
    title: t('pages.post_list.post_preview_list_title'),
    postPreviewList: {
      ...postPreviewList,
    },
    newsletterBlock,
  };
};
