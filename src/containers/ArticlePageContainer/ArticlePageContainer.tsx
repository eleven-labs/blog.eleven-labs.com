import React from 'react';

import { ArticlePage } from '@/pages/ArticlePage';
import { ArticlePageData } from '@/types';

import { useArticlePageContainer } from './useArticlePageContainer';

export const ArticlePageContainer: React.FC<{ article: ArticlePageData }> = ({ article }) => {
  const articlePageProps = useArticlePageContainer(article);

  return <ArticlePage {...articlePageProps} />;
};
