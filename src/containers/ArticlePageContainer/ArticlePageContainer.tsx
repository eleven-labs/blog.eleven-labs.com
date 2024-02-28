import { PostPage } from '@eleven-labs/design-system';
import React from 'react';

import { ArticlePageData } from '@/types';

import { useArticlePageContainer } from './useArticlePageContainer';

export const ArticlePageContainer: React.FC<{ article: ArticlePageData }> = ({ article }) => {
  const postPage = useArticlePageContainer(article);

  return <PostPage {...postPage} />;
};
