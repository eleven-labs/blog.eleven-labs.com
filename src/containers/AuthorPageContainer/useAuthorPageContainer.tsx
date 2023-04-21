import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { type getDataFromAuthorPage } from '@/helpers/contentHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { AuthorPageProps } from '@/pages/AuthorPage';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t } = useTranslation();
  const resultAuthorPage = useLoaderData() as ReturnType<typeof getDataFromAuthorPage>;
  const newsletterBlock = useNewsletterBlock();

  if (!resultAuthorPage) {
    return;
  }

  return {
    backLink: <BackLinkContainer />,
    author: resultAuthorPage.author,
    title: t('pages.author.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={resultAuthorPage.posts} />,
    newsletterBlock,
  };
};
