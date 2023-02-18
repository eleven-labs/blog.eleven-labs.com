import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLoaderData } from 'react-router-dom';

import { PATHS } from '@/constants';
import { getAuthorDataPage } from '@/helpers/apiHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { usePostPreviewList } from '@/hooks/usePostPreviewList';
import { AuthorPageProps } from '@/pages/AuthorPage';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t, i18n } = useTranslation();
  const author = useLoaderData() as Awaited<ReturnType<typeof getAuthorDataPage>>;
  const postPreviewList = usePostPreviewList({ allPosts: author.posts });
  const newsletterBlock = useNewsletterBlock();

  if (!author) {
    return;
  }

  return {
    backLink: {
      as: Link,
      label: t('common.back'),
      to: generatePath(PATHS.HOME, { lang: i18n.language }),
    } as AuthorPageProps['backLink'],
    author,
    postPreviewList: {
      title: t('pages.author.post_preview_list_title'),
      ...postPreviewList,
    },
    newsletterBlock,
  };
};
