import { Box, PostPageProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ContentTypeEnum } from '@/constants';
import { slugify } from '@/helpers/stringHelper';
import { usePostPage } from '@/hooks/usePostPage';
import { ArticlePageData } from '@/types';

export const useArticlePageContainer = (article: ArticlePageData): PostPageProps => {
  const { t } = useTranslation();
  const postPage = usePostPage(article);

  return {
    variant: ContentTypeEnum.ARTICLE,
    ...postPage,
    summary: {
      title: t('pages.article.summary_card.title'),
      sections: article.summary
        .filter((heading) => heading.level === 2)
        .map((heading) => ({
          name: slugify(heading.text),
          label: heading.text,
          href: `#${slugify(heading.text)}`,
        })),
    },
    children: <Box dangerouslySetInnerHTML={{ __html: article.content }} />,
  };
};
