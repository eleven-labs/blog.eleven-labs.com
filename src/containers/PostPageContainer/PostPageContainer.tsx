import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { ContentTypeEnum } from '@/constants';
import { ArticlePageContainer } from '@/containers/ArticlePageContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { TutorialPageContainer } from '@/containers/TutorialPageContainer';
import { PostPageData } from '@/types';

export const PostPageContainer: React.FC = () => {
  const post = useLoaderData() as PostPageData;
  if (!post) {
    return <NotFoundPageContainer />;
  }

  if (post.contentType === ContentTypeEnum.TUTORIAL) {
    return <TutorialPageContainer tutorial={post} />;
  }

  return <ArticlePageContainer article={post} />;
};
