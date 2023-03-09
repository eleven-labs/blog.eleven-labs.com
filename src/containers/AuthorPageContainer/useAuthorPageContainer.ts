import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { getAuthorDataPage } from '@/helpers/apiHelper';
import { useBackLink } from '@/hooks/useBackLink';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { usePostPreviewList } from '@/hooks/usePostPreviewList';
import { AuthorPageProps } from '@/pages/AuthorPage';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t } = useTranslation();
  const author = useLoaderData() as Awaited<ReturnType<typeof getAuthorDataPage>>;
  const postPreviewList = usePostPreviewList({ allPosts: author.posts });
  const backLink = useBackLink();
  const newsletterBlock = useNewsletterBlock();

  if (!author) {
    return;
  }

  return {
    backLink,
    author,
    title: t('pages.author.post_preview_list_title'),
    postPreviewList: {
      ...postPreviewList,
    },
    newsletterBlock,
  };
};
