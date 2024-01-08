import { Box, PostPageProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ContentTypeEnum } from '@/constants';
import { usePostPage } from '@/hooks/usePostPage';
import { ArticlePageData } from '@/types';

export const useArticlePageContainer = (article: ArticlePageData): PostPageProps => {
  const { t } = useTranslation();
  const postPage = usePostPage(article);

  return {
    variant: ContentTypeEnum.ARTICLE,
    ...postPage,
    summary: {
      title: t('pages.post.summary_card_title'),
      sections: [],
    },
    children: <Box dangerouslySetInnerHTML={{ __html: article.content }} />,
  };
};
