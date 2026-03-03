import type { PostPageData } from '@/types';

import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { MARKDOWN_CONTENT_TYPES } from '@/constants';
import { ArticlePageContainer } from '@/containers/ArticlePageContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { TutorialPageContainer } from '@/containers/TutorialPageContainer';

export const PostPageContainer: React.FC = () => {
  const postPageData = useLoaderData() as PostPageData;

  if (!postPageData) {
    return <NotFoundPageContainer />;
  }

  if (postPageData.contentType === MARKDOWN_CONTENT_TYPES.TUTORIAL) {
    return <TutorialPageContainer tutorial={postPageData} />;
  }

  return <ArticlePageContainer article={postPageData} />;
};
