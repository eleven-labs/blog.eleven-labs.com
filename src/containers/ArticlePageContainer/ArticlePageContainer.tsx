import type { ArticlePageData } from '@/types';

import React from 'react';

import { PostPage } from '@/pages';

import { useArticlePageContainer } from './useArticlePageContainer';

export const ArticlePageContainer: React.FC<{ article: ArticlePageData }> = ({ article }) => {
  const postPage = useArticlePageContainer(article);

  return <PostPage {...postPage} />;
};
