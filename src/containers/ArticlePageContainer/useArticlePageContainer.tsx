import type { PostPageProps } from '@eleven-labs/design-system';

import type { ArticlePageData } from '@/types';

import { Box } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { MARKDOWN_CONTENT_TYPES } from '@/constants';
import { slugify } from '@/helpers/stringHelper';
import { usePostPage } from '@/hooks/usePostPage';

export const useArticlePageContainer = (article: ArticlePageData): PostPageProps => {
  const { t } = useTranslation();
  const postPage = usePostPage(article);

  return {
    variant: MARKDOWN_CONTENT_TYPES.ARTICLE,
    ...postPage,
    summary: {
      title: t('pages.article.summary_card.title'),
      sections: article.summary
        .filter((heading) => heading.level === 2)
        .map((heading) => ({
          name: slugify(heading.text),
          label: heading.text,
          href: `#${heading.id}`,
        })),
    },
    children: <Box dangerouslySetInnerHTML={{ __html: article.content }} />,
  };
};
