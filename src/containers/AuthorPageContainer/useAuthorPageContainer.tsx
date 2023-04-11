import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { getAuthorDataPage } from '@/helpers/loaderDataHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { AuthorPageProps } from '@/pages/AuthorPage';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t } = useTranslation();
  const author = useLoaderData() as ReturnType<typeof getAuthorDataPage>;
  const newsletterBlock = useNewsletterBlock();

  if (!author) {
    return;
  }

  return {
    backLink: <BackLinkContainer />,
    author,
    title: t('pages.author.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={author.posts} />,
    newsletterBlock,
  };
};
