import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { ContentTypeEnum } from '@/constants';
import { ArticlePageContainer } from '@/containers/ArticlePageContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { TutorialPageContainer } from '@/containers/TutorialPageContainer';
import { PostPageData } from '@/types';

export const PostPageContainer: React.FC = () => {
  const postPageData = useLoaderData() as PostPageData;
  if (!postPageData) {
    return <NotFoundPageContainer />;
  }

  if (postPageData.contentType === ContentTypeEnum.TUTORIAL) {
    return <TutorialPageContainer tutorial={postPageData} />;
  }

  return <ArticlePageContainer article={postPageData} />;
};
