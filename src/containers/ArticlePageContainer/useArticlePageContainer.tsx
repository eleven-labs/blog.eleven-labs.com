import type { PostPageProps } from '@/pages';
import type { ArticlePageData } from '@/types';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { MARKDOWN_CONTENT_TYPES } from '@/constants';
import { usePostPage } from '@/hooks/usePostPage';

export const useArticlePageContainer = (article: ArticlePageData): PostPageProps => {
  const { t } = useTranslation();
  const postPage = usePostPage(article);
  const headings = article.summary.filter((heading) => heading.level === 2);

  return {
    variant: MARKDOWN_CONTENT_TYPES.ARTICLE,
    ...postPage,
    summary: {
      title: t('pages.article.summary_card.title'),
      sections: headings.map((heading) => ({
        name: heading.id,
        label: heading.text,
        href: `#${heading.id}`,
      })),
      sectionActive: headings[0]?.id,
    },
    children: <div dangerouslySetInnerHTML={{ __html: article.content }} />,
  };
};
